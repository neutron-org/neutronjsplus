import cosmosclient from '@cosmos-client/core';
import Long from 'long';
import {
  CosmosTxV1beta1GetTxResponse,
  BroadcastTx200ResponseTxResponse,
} from '@cosmos-client/core/cjs/openapi/api';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { ibc } from '@cosmos-client/ibc/cjs/proto';
import { Wallet, CodeId } from './types';
import { DEBUG_SUBMIT_TX, getContractBinary, getHeight } from './env';
import { MsgSubmitProposalLegacy } from './proto/admin_module/cosmos/adminmodule/adminmodule/tx_pb';
import { MsgAuctionBid } from './proto/block_sdk/sdk/auction/v1/tx_pb';
import { ParameterChangeProposal } from './proto/cosmos_sdk/cosmos/params/v1beta1/params_pb';
import { MsgSend } from './proto/cosmos_sdk/cosmos/bank/v1beta1/tx_pb';
import { MsgRemoveInterchainQueryRequest } from './proto/neutron/neutron/interchainqueries/tx_pb';
import {
  IndexedTx,
  MsgSendEncodeObject,
  StdFee,
  defaultRegistryTypes,
} from '@cosmjs/stargate';
import {
  MigrateResult,
  SigningCosmWasmClient,
  wasmTypes,
} from '@cosmjs/cosmwasm-stargate';
import { MsgTransfer } from '@neutron-org/cosmjs-types/ibc/applications/transfer/v1/tx';

import ICoin = cosmosclient.proto.cosmos.base.v1beta1.ICoin;
import IHeight = ibc.core.client.v1.IHeight;
import { Coin, EncodeObject, Registry } from '@cosmjs/proto-signing';
import {
  BalancesResponse,
  CosmosWrapper,
  NEUTRON_DENOM,
  packAnyMsg,
} from './cosmos';

// constructor for WalletWrapper
export async function createWalletWrapper(
  chain: CosmosWrapper,
  wallet: Wallet,
) {
  const wasmClient = await SigningCosmWasmClient.connectWithSigner(
    chain.rpc,
    wallet.directwallet,
    { registry: new Registry([...defaultRegistryTypes, ...wasmTypes]) },
  );
  return new WalletWrapper(chain, wallet, wasmClient);
}

export class WalletWrapper {
  readonly chain: CosmosWrapper;
  readonly wallet: Wallet;
  readonly wasmClient: SigningCosmWasmClient;

  constructor(
    chain: CosmosWrapper,
    wallet: Wallet,
    wasmClient: SigningCosmWasmClient,
  ) {
    this.chain = chain;
    this.wallet = wallet;
    this.wasmClient = wasmClient;
  }

  async queryBalances(): Promise<BalancesResponse> {
    return await this.chain.queryBalances(this.wallet.address.toString());
  }

  async queryDenomBalance(denom: string): Promise<number> {
    return await this.chain.queryDenomBalance(
      this.wallet.address.toString(),
      denom,
    );
  }

  async execTx2(
    fee: StdFee | 'auto' | number,
    msgs: EncodeObject[],
    numAttempts = 10,
    memo?: string,
  ): Promise<IndexedTx> {
    memo ||= '';

    const result = await this.wasmClient.signAndBroadcast(
      this.wallet.address.toString(),
      msgs,
      fee,
      memo,
    );
    console.log(
      'result code : ' +
        JSON.stringify(result.code) +
        ' hash: ' +
        result.transactionHash,
    );

    let error = null;
    // TODO: probably does not make sense because it already waits being in the block
    while (numAttempts > 0) {
      await this.chain.blockWaiter.waitBlocks(1);
      numAttempts--;
      const data = await this.wasmClient.getTx(result.transactionHash);
      if (data != null) {
        if (DEBUG_SUBMIT_TX) {
          const code = +data.code;
          console.log('response code: ', code);
          if (code > 0) {
            console.log('\x1b[31m error log: ', JSON.stringify(data.events));
          }
          console.log('response: ', JSON.stringify(data));
        }
        return data;
      }
    }
    error = error ?? new Error('failed to submit tx');

    throw error;
  }

  /**
   * execTx broadcasts messages and returns the transaction result.
   */
  async execTx(
    fee: cosmosclient.proto.cosmos.tx.v1beta1.IFee,
    msgs: cosmosclient.proto.google.protobuf.Any[],
    numAttempts = 10,
    mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
      .BroadcastTxMode.Sync,
    sequence: number = this.wallet.account.sequence,
    txTimeoutHeight?: number,
  ): Promise<CosmosTxV1beta1GetTxResponse> {
    const txBuilder = this.buildTx(fee, msgs, sequence, txTimeoutHeight);
    const txhash = await this.broadcastTx(txBuilder, mode);
    if (DEBUG_SUBMIT_TX) {
      console.log('tx hash: ', txhash);
    }
    let error = null;
    while (numAttempts > 0) {
      await this.chain.blockWaiter.waitBlocks(1);
      numAttempts--;
      const data = await cosmosclient.rest.tx
        .getTx(this.chain.sdk as CosmosSDK, txhash)
        .catch((reason) => {
          error = reason;
          return null;
        });
      if (data != null) {
        if (DEBUG_SUBMIT_TX) {
          const code = +data.data?.tx_response.code;
          console.log('response code: ', code);
          if (code > 0) {
            console.log('\x1b[31m error log: ', data.data?.tx_response.raw_log);
          }
          console.log('response: ', JSON.stringify(data.data));
        }
        return data.data;
      }
    }
    error = error ?? new Error('failed to submit tx');
    throw error;
  }

  buildTx(
    fee: cosmosclient.proto.cosmos.tx.v1beta1.IFee,
    protoMsgs: cosmosclient.proto.google.protobuf.Any[],
    sequence: number = this.wallet.account.sequence,
    txTimeoutHeight?: number,
  ): cosmosclient.TxBuilder {
    const txBody = new cosmosclient.proto.cosmos.tx.v1beta1.TxBody({
      messages: protoMsgs,
    });
    if (txTimeoutHeight != undefined) {
      txBody.timeout_height = txTimeoutHeight;
    }
    const authInfo = new cosmosclient.proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.instanceToProtoAny(this.wallet.pubKey),
          mode_info: {
            single: {
              mode: cosmosclient.proto.cosmos.tx.signing.v1beta1.SignMode
                .SIGN_MODE_DIRECT,
            },
          },
          sequence,
        },
      ],
      fee,
    });
    const txBuilder = new cosmosclient.TxBuilder(
      this.chain.sdk as CosmosSDK,
      txBody,
      authInfo,
    );
    const signDocBytes = txBuilder.signDocBytes(
      this.wallet.account.account_number,
    );
    txBuilder.addSignature(this.wallet.privKey.sign(signDocBytes));
    return txBuilder;
  }

  async broadcastTx(
    txBuilder: cosmosclient.TxBuilder,
    mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
      .BroadcastTxMode.Sync,
  ): Promise<string> {
    try {
      if (DEBUG_SUBMIT_TX) {
        console.log('\n\n\nStart broadcasting tx: ----------------------');
        try {
          console.log(JSON.stringify(txBuilder.toProtoJSON()));
        } catch (error) {
          console.log('failed to serialize tx');
        }
      }

      const res = await cosmosclient.rest.tx.broadcastTx(
        this.chain.sdk as CosmosSDK,
        {
          tx_bytes: txBuilder.txBytes(),
          mode,
        },
      );

      const code = res.data?.tx_response.code;
      if (DEBUG_SUBMIT_TX) {
        console.log('async response code: ', code);
      }
      if (code !== 0) {
        if (DEBUG_SUBMIT_TX) {
          console.log(`broadcast error: ${res.data?.tx_response.raw_log}`);
        }
        throw new Error(`broadcast error: ${res.data?.tx_response.raw_log}`);
      }
      const txhash = res.data?.tx_response.txhash;
      this.wallet.account.sequence++;
      return txhash;
    } catch (e) {
      console.log('broadcast error: ' + JSON.stringify(e));
      throw e;
    }
  }

  // storeWasm stores the wasm code by the passed path on the blockchain.
  async storeWasm(fileName: string): Promise<CodeId> {
    const sender = this.wallet.address.toString();
    const wasmCode = await getContractBinary(fileName);
    const res = await this.wasmClient.upload(sender, wasmCode, {
      amount: [{ denom: NEUTRON_DENOM, amount: '250000' }],
      gas: '60000000',
    });
    return res.codeId;
  }

  async instantiateContract(
    codeId: number,
    msg: string,
    label: string,
    admin: string = this.wallet.address.toString(),
  ): Promise<string> {
    const instantiateRes = await this.wasmClient.instantiate(
      this.wallet.address.toString(),
      codeId,
      Buffer.from(msg),
      label,
      {
        amount: [{ denom: NEUTRON_DENOM, amount: '2000000' }],
        gas: '600000000',
      },
      { admin },
    );
    return instantiateRes.contractAddress;
  }

  async migrateContract(
    contract: string,
    codeId: number,
    msg: string | Record<string, unknown>,
  ): Promise<MigrateResult> {
    const sender = this.wallet.address.toString();
    const msgRaw = Buffer.from(
      typeof msg === 'string' ? msg : JSON.stringify(msg),
    );
    const res = await this.wasmClient.migrate(
      sender,
      contract,
      codeId,
      msgRaw,
      {
        gas: '5000000',
        amount: [{ denom: this.chain.denom, amount: '20000' }],
      },
    );
    // TODO: throw error if unsuccessful?
    return res;
  }

  async executeContract(
    contract: string,
    msg: any,
    funds: Coin[] = [],
    fee = {
      gas: '4000000',
      amount: [{ denom: this.chain.denom, amount: '10000' }],
    },
  ): Promise<IndexedTx> {
    const sender = this.wallet.address.toString();
    const res = await this.wasmClient.execute(
      sender,
      contract,
      msg,
      fee,
      '',
      funds,
    );
    return await this.wasmClient.getTx(res.transactionHash);
  }

  /**
   * msgSend processes a transfer, waits two blocks and returns the tx hash.
   */
  async msgSend(
    to: string,
    coin:
      | {
          amount: string;
          denom?: string;
        }
      | string,
    fee = {
      gas_limit: Long.fromString('300000'),
      amount: [{ denom: this.chain.denom, amount: '1500' }],
    },
  ): Promise<IndexedTx> {
    const { amount, denom = this.chain.denom } =
      typeof coin === 'string' ? { amount: coin } : coin;
    const msgSendObject: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: this.wallet.address.toString(),
        toAddress: to,
        amount: [{ denom, amount }],
      },
    };

    const res = await this.execTx2(
      {
        amount: fee.amount,
        gas: fee.gas_limit + '',
      },
      [msgSendObject],
      10,
    );
    return res;
  }

  async msgSendDirectProposal(
    subspace: string,
    key: string,
    value: string,
    fee = {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: this.chain.denom, amount: '1000' }],
    },
    sequence: number = this.wallet.account.sequence,
    mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
      .BroadcastTxMode.Sync,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const msg = new MsgSubmitProposalLegacy({
      content: {
        typeUrl: '/cosmos.params.v1beta1.ParameterChangeProposal',
        value: new ParameterChangeProposal({
          title: 'mock',
          description: 'mock',
          changes: [
            new cosmosclient.proto.cosmos.params.v1beta1.ParamChange({
              key: key,
              subspace: subspace,
              value: value,
            }),
          ],
        }).toBinary(),
      },
      proposer: this.wallet.account.address,
    });
    const res = await this.execTx(
      fee,
      [
        packAnyMsg(
          '/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy',
          msg,
        ),
      ],
      10,
      mode,
      sequence,
    );
    return res?.tx_response;
  }

  async msgSendAuction(
    bidder: string,
    bid: ICoin,
    transactions: Uint8Array[],
    fee = {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: this.chain.denom, amount: '1000' }],
    },
    sequence: number = this.wallet.account.sequence,
    mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
      .BroadcastTxMode.Sync,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const msg = new MsgAuctionBid({
      bidder,
      bid,
      transactions,
    });
    const currentHeight = await getHeight(this.chain.sdk);
    const res = await this.execTx(
      fee,
      [packAnyMsg('/sdk.auction.v1.MsgAuctionBid', msg)],
      10,
      mode,
      sequence,
      currentHeight + 1,
    );
    return res?.tx_response;
  }

  /* simulateFeeBurning simulates fee burning via send tx.
   */
  async simulateFeeBurning(
    amount: number,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const msgSend = new MsgSend({
      fromAddress: this.wallet.address.toString(),
      toAddress: this.wallet.address.toString(),
      amount: [{ denom: this.chain.denom, amount: '1' }],
    });

    const res = await this.execTx(
      {
        gas_limit: Long.fromString('200000'),
        amount: [
          {
            denom: this.chain.denom,
            amount: `${Math.ceil((1000 * amount) / 750)}`,
          },
        ],
      },
      [packAnyMsg('/cosmos.bank.v1beta1.MsgSend', msgSend)],
    );
    return res?.tx_response;
  }

  /**
   * msgRemoveInterchainQuery sends transaction to remove interchain query, waits two blocks and returns the tx hash.
   */
  async msgRemoveInterchainQuery(
    queryId: bigint,
    sender: string,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const msgRemove = new MsgRemoveInterchainQueryRequest({
      queryId: queryId,
      sender,
    });

    const res = await this.execTx(
      {
        gas_limit: Long.fromString('200000'),
        amount: [{ denom: this.chain.denom, amount: '1000' }],
      },
      [
        packAnyMsg(
          '/neutron.interchainqueries.MsgRemoveInterchainQueryRequest',
          msgRemove,
        ),
      ],
    );
    return res?.tx_response;
  }

  /**
   * msgIBCTransfer processes an IBC transfer, waits two blocks and returns the tx hash.
   */
  async msgIBCTransfer(
    sourcePort: string,
    sourceChannel: string,
    token: Coin,
    receiver: string,
    timeoutHeight: IHeight,
    memo?: string,
  ): Promise<IndexedTx> {
    const newMsgSend: MsgTransfer = {
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      token: token,
      sender: this.wallet.address.toString(),
      receiver: receiver,
      timeoutHeight: {
        revisionHeight: timeoutHeight.revision_height,
        revisionNumber: timeoutHeight.revision_number,
      },
      timeoutTimestamp: null,
      memo: memo,
    };

    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: newMsgSend,
    };

    const res = await this.execTx2(
      {
        gas: '200000',
        amount: [{ denom: this.chain.denom, amount: '1000' }],
      },
      [msg],
    );
    return res;
  }
}
