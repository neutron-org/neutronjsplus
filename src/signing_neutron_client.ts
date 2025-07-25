import { StdFee } from '@cosmjs/amino';
import { AuthInfo, Fee, Tx, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { toUtf8, toHex } from '@cosmjs/encoding';
import { Uint53 } from '@cosmjs/math';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { Uint64 } from '@cosmjs/math';
import pako from 'pako';
import {
  ServiceClientImpl,
  SimulateRequest,
} from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import {
  CometClient,
  connectComet,
  HttpEndpoint,
} from '@cosmjs/tendermint-rpc';
import { assertDefined } from '@cosmjs/utils';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { ChangeAdminResult } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import { sha256 } from '@cosmjs/crypto';

import {
  calculateFee,
  defaultRegistryTypes,
  DeliverTxResponse,
  GasPrice,
  Event,
  isDeliverTxFailure,
  MsgSendEncodeObject,
  SigningStargateClientOptions,
  logs,
  Attribute,
  createProtobufRpcClient,
  ProtobufRpcClient,
  MsgDelegateEncodeObject,
  MsgUndelegateEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import {
  CosmWasmClient,
  ExecuteInstruction,
  ExecuteResult,
  InstantiateOptions,
  InstantiateResult,
  JsonObject,
  MigrateResult,
  MsgClearAdminEncodeObject,
  MsgExecuteContractEncodeObject,
  MsgInstantiateContract2EncodeObject,
  MsgInstantiateContractEncodeObject,
  MsgMigrateContractEncodeObject,
  MsgStoreCodeEncodeObject,
  MsgUpdateAdminEncodeObject,
  UploadResult,
} from '@cosmjs/cosmwasm-stargate';
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgInstantiateContract2,
  MsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { AccessConfig } from 'cosmjs-types/cosmwasm/wasm/v1/types';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { BaseAccount } from 'cosmjs-types/cosmos/auth/v1beta1/auth';
import {
  MsgDelegate,
  MsgUndelegate,
} from '@neutron-org/neutronjs/cosmos/staking/v1beta1/tx';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

/**
 * Signing information for a single signer that is not included in the transaction.
 *
 * @see https://github.com/cosmos/cosmos-sdk/blob/v0.42.2/x/auth/signing/sign_mode_handler.go#L23-L37
 */
export interface SignerData {
  readonly accountNumber: number;
  readonly sequence: number;
  readonly chainId: string;
}

// Signer allows implementing different signing methods for SigningNeutronClient
export interface Signer {
  sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
    timeoutHeight?: bigint,
  ): Promise<TxRaw>;
  getPubKey(signer: string): Promise<Any>;
}

// SigningNeutronClient has the same interface as SigningCosmWasmClient from cosmjs.
// Allows for using eip191 signing method as well as usual direct and amino methods.
export class SigningNeutronClient extends CosmWasmClient {
  public readonly registry: Registry;
  public readonly broadcastTimeoutMs: number | undefined;
  public readonly broadcastPollIntervalMs: number | undefined;

  private readonly gasPrice: GasPrice | undefined;
  // Starting with Cosmos SDK 0.47, we see many cases in which 1.3 is not enough anymore
  // E.g. https://github.com/cosmos/cosmos-sdk/issues/16020
  private readonly defaultGasMultiplier = 1.4;

  /**
   * Creates an instance by connecting to the given CometBFT RPC endpoint.
   *
   * This uses auto-detection to decide between a CometBFT 0.38, Tendermint 0.37 and 0.34 client.
   * To set the Comet client explicitly, use `createWithSigner`.
   */
  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: Signer,
    options: SigningStargateClientOptions = {},
  ): Promise<SigningNeutronClient> {
    const cometClient = await connectComet(endpoint);
    return SigningNeutronClient.createWithSigner(cometClient, signer, options);
  }

  /**
   * Creates an instance from a manually created Comet client.
   * Use this to use `Comet38Client` or `Tendermint37Client` instead of `Tendermint34Client`.
   */
  public static async createWithSigner(
    cometClient: CometClient,
    signer: Signer,
    options: SigningStargateClientOptions = {},
  ): Promise<SigningNeutronClient> {
    return new SigningNeutronClient(cometClient, signer, options);
  }

  protected constructor(
    cometClient: CometClient | undefined,
    private signer: Signer,
    options: SigningStargateClientOptions,
  ) {
    super(cometClient);

    const { registry = new Registry(defaultRegistryTypes) } = options;
    this.registry = registry;
    this.broadcastTimeoutMs = options.broadcastTimeoutMs;
    this.broadcastPollIntervalMs = options.broadcastPollIntervalMs;
    this.gasPrice = options.gasPrice;
  }

  public async simulate(
    signerAddress: string,
    messages: readonly EncodeObject[],
    memo: string | undefined,
  ): Promise<number> {
    const anyMsgs = messages.map((m) => this.registry.encodeAsAny(m));
    const pubkey: Any = await this.signer.getPubKey(signerAddress);

    const rawAccount = await this.forceGetQueryClient().auth.account(
      signerAddress,
    );
    if (!rawAccount) {
      throw new Error('no account found');
    }
    const baseAccount = BaseAccount.decode(rawAccount.value);
    const sequence = uint64FromProto(baseAccount.sequence).toNumber();
    const rpc = createProtobufRpcClient(this.forceGetQueryClient());
    const { gasInfo } = await simulate(rpc, anyMsgs, memo, pubkey, sequence);
    assertDefined(gasInfo);
    return Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
  }

  public async signAndBroadcast(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | 'auto' | number,
    memo = '',
    timeoutHeight?: bigint,
  ): Promise<DeliverTxResponse> {
    let usedFee: StdFee;
    if (fee == 'auto' || typeof fee === 'number') {
      assertDefined(
        this.gasPrice,
        'Gas price must be set in the client options when auto gas is used.',
      );
      const gasEstimation = await this.simulate(signerAddress, messages, memo);
      const multiplier =
        typeof fee === 'number' ? fee : this.defaultGasMultiplier;
      usedFee = calculateFee(
        Math.round(gasEstimation * multiplier),
        this.gasPrice,
      );
    } else {
      usedFee = fee;
    }
    const txRaw = await this.sign(
      signerAddress,
      messages,
      usedFee,
      memo,
      undefined,
      timeoutHeight,
    );
    const txBytes = TxRaw.encode(txRaw).finish();
    return this.broadcastTx(
      txBytes,
      this.broadcastTimeoutMs,
      this.broadcastPollIntervalMs,
    );
  }

  /**
   * This method is useful if you want to send a transaction in broadcast,
   * without waiting for it to be placed inside a block, because for example
   * I would like to receive the hash to later track the transaction with another tool.
   * @returns Returns the hash of the transaction
   */
  public async signAndBroadcastSync(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | 'auto' | number,
    memo = '',
    timeoutHeight?: bigint,
  ): Promise<string> {
    let usedFee: StdFee;
    if (fee == 'auto' || typeof fee === 'number') {
      assertDefined(
        this.gasPrice,
        'Gas price must be set in the client options when auto gas is used.',
      );
      const gasEstimation = await this.simulate(signerAddress, messages, memo);
      const multiplier =
        typeof fee === 'number' ? fee : this.defaultGasMultiplier;
      usedFee = calculateFee(
        Math.round(gasEstimation * multiplier),
        this.gasPrice,
      );
    } else {
      usedFee = fee;
    }
    const txRaw = await this.sign(
      signerAddress,
      messages,
      usedFee,
      memo,
      undefined,
      timeoutHeight,
    );
    const txBytes = TxRaw.encode(txRaw).finish();
    return this.broadcastTxSync(txBytes);
  }

  /**
   * Gets account number and sequence from the API, creates a sign doc,
   * creates a single signature and assembles the signed transaction.
   *
   * The sign mode (SIGN_MODE_DIRECT, SIGN_MODE_LEGACY_AMINO_JSON or SIGN_MODE_EIP_191)
   * is determined by this client's signer.
   *
   * You can pass signer data (account number, sequence and chain ID) explicitly instead of querying them
   * from the chain. This is needed when signing for a multisig account, but it also allows for offline signing
   * (See the SigningStargateClient.offline constructor).
   */
  public async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData,
    timeoutHeight?: bigint,
  ): Promise<TxRaw> {
    let signerData: SignerData;
    if (explicitSignerData) {
      signerData = explicitSignerData;
    } else {
      const rawAccount = await this.forceGetQueryClient().auth.account(
        signerAddress,
      );
      if (!rawAccount) {
        throw new Error('no account found');
      }
      const baseAccount = BaseAccount.decode(rawAccount.value);
      const accountNumber = uint64FromProto(
        baseAccount.accountNumber,
      ).toNumber();
      const sequence = uint64FromProto(baseAccount.sequence).toNumber();
      const chainId = await this.getChainId();
      signerData = {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
      };
    }

    return this.signer.sign(
      signerAddress,
      messages,
      fee,
      memo,
      signerData,
      timeoutHeight,
    );
  }

  /** Uploads code and returns a receipt, including the code ID */
  public async upload(
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: StdFee | 'auto' | number,
    memo = '',
    instantiatePermission?: AccessConfig,
  ): Promise<UploadResult> {
    const compressed = pako.gzip(wasmCode, { level: 9 });
    const storeCodeMsg: MsgStoreCodeEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgStoreCode',
      value: MsgStoreCode.fromPartial({
        sender: senderAddress,
        wasmByteCode: compressed,
        instantiatePermission,
      }),
    };

    // When uploading a contract, the simulation is only 1-2% away from the actual gas usage.
    // So we have a smaller default gas multiplier than signAndBroadcast.
    const usedFee = fee == 'auto' ? 1.1 : fee;
    const result = await this.signAndBroadcast(
      senderAddress,
      [storeCodeMsg],
      usedFee,
      memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    const codeIdAttr = findAttribute(result.events, 'store_code', 'code_id');
    return {
      checksum: toHex(sha256(wasmCode)),
      originalSize: wasmCode.length,
      compressedSize: compressed.length,
      codeId: Number.parseInt(codeIdAttr.value, 10),
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async instantiate2(
    senderAddress: string,
    codeId: number,
    salt: Uint8Array,
    msg: JsonObject,
    label: string,
    fee: StdFee | 'auto' | number,
    options: InstantiateOptions = {},
  ): Promise<InstantiateResult> {
    const instantiateContract2Msg: MsgInstantiateContract2EncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract2',
      value: MsgInstantiateContract2.fromPartial({
        sender: senderAddress,
        codeId: BigInt(new Uint53(codeId).toString()),
        label: label,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
        admin: options.admin,
        salt: salt,
        fixMsg: false,
      }),
    };
    const result = await this.signAndBroadcast(
      senderAddress,
      [instantiateContract2Msg],
      fee,
      options.memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    const contractAddressAttr = findAttribute(
      result.events,
      'instantiate',
      '_contract_address',
    );
    return {
      contractAddress: contractAddressAttr.value,
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async updateAdmin(
    senderAddress: string,
    contractAddress: string,
    newAdmin: string,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<ChangeAdminResult> {
    const updateAdminMsg: MsgUpdateAdminEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      value: MsgUpdateAdmin.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        newAdmin: newAdmin,
      }),
    };
    const result = await this.signAndBroadcast(
      senderAddress,
      [updateAdminMsg],
      fee,
      memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    return {
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async clearAdmin(
    senderAddress: string,
    contractAddress: string,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<ChangeAdminResult> {
    const clearAdminMsg: MsgClearAdminEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgClearAdmin',
      value: MsgClearAdmin.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
      }),
    };
    const result = await this.signAndBroadcast(
      senderAddress,
      [clearAdminMsg],
      fee,
      memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    return {
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async instantiate(
    senderAddress: string,
    codeId: number,
    msg: JsonObject,
    label: string,
    fee: StdFee | 'auto' | number,
    options: InstantiateOptions = {},
  ): Promise<InstantiateResult> {
    const instantiateContractMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      value: MsgInstantiateContract.fromPartial({
        sender: senderAddress,
        codeId: BigInt(new Uint53(codeId).toString()),
        label: label,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
        admin: options.admin,
      }),
    };
    const result = await this.signAndBroadcast(
      senderAddress,
      [instantiateContractMsg],
      fee,
      options.memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    const contractAddressAttr = findAttribute(
      result.events,
      'instantiate',
      '_contract_address',
    );
    return {
      contractAddress: contractAddressAttr.value,
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async migrate(
    senderAddress: string,
    contractAddress: string,
    codeId: number,
    migrateMsg: JsonObject,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<MigrateResult> {
    const migrateContractMsg: MsgMigrateContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgMigrateContract',
      value: MsgMigrateContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        codeId: BigInt(new Uint53(codeId).toString()),
        msg: toUtf8(JSON.stringify(migrateMsg)),
      }),
    };
    const result = await this.signAndBroadcast(
      senderAddress,
      [migrateContractMsg],
      fee,
      memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    return {
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async execute(
    senderAddress: string,
    contractAddress: string,
    msg: JsonObject,
    fee: StdFee | 'auto' | number,
    memo = '',
    funds?: readonly Coin[],
  ): Promise<ExecuteResult> {
    const instruction: ExecuteInstruction = {
      contractAddress: contractAddress,
      msg: msg,
      funds: funds,
    };
    return this.executeMultiple(senderAddress, [instruction], fee, memo);
  }

  /**
   * Like `execute` but allows executing multiple messages in one transaction.
   */
  public async executeMultiple(
    senderAddress: string,
    instructions: readonly ExecuteInstruction[],
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<ExecuteResult> {
    const msgs: MsgExecuteContractEncodeObject[] = instructions.map((i) => ({
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: i.contractAddress,
        msg: toUtf8(JSON.stringify(i.msg)),
        funds: [...(i.funds || [])],
      }),
    }));
    const result = await this.signAndBroadcast(senderAddress, msgs, fee, memo);
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    return {
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      events: result.events,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  public async sendTokens(
    senderAddress: string,
    recipientAddress: string,
    amount: readonly Coin[],
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<DeliverTxResponse> {
    const sendMsg: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: senderAddress,
        toAddress: recipientAddress,
        amount: [...amount],
      },
    };
    return this.signAndBroadcast(senderAddress, [sendMsg], fee, memo);
  }

  public async delegateTokens(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<DeliverTxResponse> {
    const delegateMsg: MsgDelegateEncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgDelegate.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorAddress,
        amount,
      }),
    };
    return this.signAndBroadcast(delegatorAddress, [delegateMsg], fee, memo);
  }

  public async undelegateTokens(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<DeliverTxResponse> {
    const undelegateMsg: MsgUndelegateEncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: MsgUndelegate.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorAddress,
        amount,
      }),
    };
    return this.signAndBroadcast(delegatorAddress, [undelegateMsg], fee, memo);
  }

  public async withdrawRewards(
    delegatorAddress: string,
    validatorAddress: string,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<DeliverTxResponse> {
    const withdrawDelegatorRewardMsg: MsgWithdrawDelegatorRewardEncodeObject = {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: MsgWithdrawDelegatorReward.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorAddress,
      }),
    };
    return this.signAndBroadcast(
      delegatorAddress,
      [withdrawDelegatorRewardMsg],
      fee,
      memo,
    );
  }
}

function createDeliverTxResponseErrorMessage(
  result: DeliverTxResponse,
): string {
  return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
}

/**
 * Searches in events for an event of the given event type which contains an
 * attribute for with the given key.
 *
 * Throws if the attribute was not found.
 */
export function findAttribute(
  events: readonly Event[],
  eventType: string,
  attrKey: string,
): Attribute {
  // all attributes from events with the right event type
  const attributes = events
    .filter((event) => event.type === eventType)
    .flatMap((e) => e.attributes);
  const out = attributes.find((attr) => attr.key === attrKey);
  if (!out) {
    throw new Error(
      `Could not find attribute '${attrKey}' in first event of type '${eventType}' in first log.`,
    );
  }
  return out;
}

export async function simulate(
  rpc: ProtobufRpcClient,
  messages: readonly Any[],
  memo: string | undefined,
  signer: Any,
  sequence: number,
) {
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new ServiceClientImpl(rpc);

  const tx = Tx.fromPartial({
    authInfo: AuthInfo.fromPartial({
      fee: Fee.fromPartial({}),
      signerInfos: [
        {
          publicKey: signer,
          sequence: BigInt(sequence),
          modeInfo: { single: { mode: SignMode.SIGN_MODE_UNSPECIFIED } },
        },
      ],
    }),
    body: TxBody.fromPartial({
      messages: Array.from(messages),
      memo: memo,
    }),
    signatures: [new Uint8Array()],
  });
  const request = SimulateRequest.fromPartial({
    txBytes: Tx.encode(tx).finish(),
  });
  const response = await queryService.Simulate(request);
  return response;
}

function uint64FromProto(input: number | bigint): Uint64 {
  return Uint64.fromString(input.toString());
}
