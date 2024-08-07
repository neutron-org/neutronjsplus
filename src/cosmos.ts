import cosmosclient from '@cosmos-client/core';
import cosmwasmclient from '@cosmos-client/cosmwasm';
import axios from 'axios';
import Long from 'long';
import { BlockWaiter, getWithAttempts } from './wait';
import {
  CosmosTxV1beta1GetTxResponse,
  BroadcastTx200ResponseTxResponse,
} from '@cosmos-client/core/cjs/openapi/api';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { ibc } from '@cosmos-client/ibc/cjs/proto';
import crypto from 'crypto';
import {
  AckFailuresResponse,
  ScheduleResponse,
  ChannelsList,
  IBCClientStatus,
  PageRequest,
  PauseInfoResponse,
  CurrentPlanResponse,
  PinnedCodesResponse,
  IcaHostParamsResponse,
  Wallet,
  CodeId,
  GlobalfeeParamsResponse,
  InterchaintxsParamsResponse,
  ParamsFeeburnerResponse,
  ParamsInterchainqueriesResponse,
  ParamsFeerefunderResponse,
  ParamsContractmanagerResponse,
  ParamsCronResponse,
  ParamsDexResponse,
  ParamsTokenfactoryResponse,
  Strategy,
  TransferParamsResponse,
} from './types';
import { DEBUG_SUBMIT_TX, getContractBinary, getHeight } from './env';
import { Message } from '@bufbuild/protobuf';
import { MsgSubmitProposalLegacy } from './proto/admin_module/cosmos/adminmodule/adminmodule/tx_pb';
import { MsgTransfer } from './proto/neutron/neutron/transfer/v1/tx_pb';
import { Height } from './proto/ibc_go/ibc/core/client/v1/client_pb';
import { MsgAuctionBid } from './proto/block_sdk/sdk/auction/v1/tx_pb';
import { ParameterChangeProposal } from './proto/cosmos_sdk/cosmos/params/v1beta1/params_pb';
import { MsgSend } from './proto/cosmos_sdk/cosmos/bank/v1beta1/tx_pb';
import { MsgRemoveInterchainQueryRequest } from './proto/neutron/neutron/interchainqueries/tx_pb';
import ICoin = cosmosclient.proto.cosmos.base.v1beta1.ICoin;
import IHeight = ibc.core.client.v1.IHeight;
import { GetPriceResponse } from './oracle';
import { GetAllCurrencyPairsResponse, GetPricesResponse } from './oracle';
import {
  GasPriceResponse,
  GasPricesResponse,
  DynamicFeesRaparmsResponse,
  FeeMarketParamsResponse as FeeMarketParamsResponse,
} from './feemarket';

export const NEUTRON_DENOM = process.env.NEUTRON_DENOM || 'untrn';
export const IBC_ATOM_DENOM = process.env.IBC_ATOM_DENOM || 'uibcatom';
export const IBC_USDC_DENOM = process.env.IBC_USDC_DENOM || 'uibcusdc';
export const COSMOS_DENOM = process.env.COSMOS_DENOM || 'uatom';
export const IBC_RELAYER_NEUTRON_ADDRESS =
  'neutron1mjk79fjjgpplak5wq838w0yd982gzkyf8fxu8u';
export const ADMIN_MODULE_ADDRESS =
  'neutron1hxskfdxpp5hqgtjj6am6nkjefhfzj359x0ar3z';

// BalancesResponse is the response model for the bank balances query.
type BalancesResponse = {
  balances: ICoin[];
  pagination: {
    next_key: string;
    total: string;
  };
};

// DenomTraceResponse is the response model for the ibc transfer denom trace query.
type DenomTraceResponse = {
  path?: string;
  base_denom?: string;
};

export type TotalSupplyByDenomResponse = {
  amount: ICoin;
};

export type DenomMetadataResponse = {
  metadatas: [
    {
      description: string;
      denom_units: [
        {
          denom: string;
          exponent: number;
          aliases: [string];
        },
      ];
      base: string;
      display: string;
      name: string;
      symbol: string;
      uri: string;
      uri_hash: string;
    },
  ];
  pagination: {
    next_key: string;
    total: string;
  };
};

// TotalBurnedNeutronsAmountResponse is the response model for the feeburner's total-burned-neutrons.
export type TotalBurnedNeutronsAmountResponse = {
  total_burned_neutrons_amount: {
    coin: ICoin;
  };
};

export class CosmosWrapper {
  readonly sdk: cosmosclient.CosmosSDK;
  readonly blockWaiter: BlockWaiter;
  readonly denom: string;

  constructor(
    sdk: cosmosclient.CosmosSDK,
    blockWaiter: BlockWaiter,
    denom: string,
  ) {
    this.denom = denom;
    this.sdk = sdk;
    this.blockWaiter = blockWaiter;
  }

  async queryContractWithWait<T>(
    contract: string,
    query: Record<string, unknown>,
    numAttempts = 20,
  ): Promise<T> {
    while (numAttempts > 0) {
      const res: T = await this.queryContract<T>(contract, query).catch(
        () => null,
      );

      if (res !== null) {
        return res;
      }

      numAttempts--;
      await this.blockWaiter.waitBlocks(1);
    }

    throw new Error('failed to query contract');
  }

  async queryContract<T>(
    contract: string,
    query: Record<string, unknown>,
  ): Promise<T> {
    const url = `${
      this.sdk.url
    }/cosmwasm/wasm/v1/contract/${contract}/smart/${Buffer.from(
      JSON.stringify(query),
    ).toString('base64')}?encoding=base64`;
    const resp = await axios.get(url).catch((error) => {
      if (error.response) {
        throw new Error(
          `Status: ${JSON.stringify(error.response.status)} \n` +
            `Response: ${JSON.stringify(error.response.data)} \n` +
            `Headers: ${JSON.stringify(error.response.headers)}`,
        );
      } else if (error.request) {
        throw new Error(error.request);
      }
      throw new Error('Error: ' + error.message);
    });
    return resp.data.data as T;
  }

  async getContractInfo(contract: string): Promise<any> {
    const url = `${this.sdk.url}/cosmwasm/wasm/v1/contract/${contract}`;
    try {
      const resp = await axios.get(url);
      return resp.data;
    } catch (e) {
      throw new Error(e.response?.data?.message);
    }
  }

  async getSeq(address: string): Promise<number> {
    const account = await cosmosclient.rest.auth
      .account(this.sdk, address)
      .then((res) =>
        cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account),
        ),
      )
      .catch((e) => {
        console.log(e);
        throw e;
      });

    if (
      !(account instanceof cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount)
    ) {
      throw new Error("can't get account");
    }

    return account.sequence;
  }

  async queryInterchainqueriesParams(): Promise<ParamsInterchainqueriesResponse> {
    const req = await axios.get(
      `${this.sdk.url}/neutron/interchainqueries/params`,
    );

    return req.data;
  }

  async queryTransferParams(): Promise<TransferParamsResponse> {
    const req = await axios.get(`${this.sdk.url}/ibc/apps/transfer/v1/params`);

    return req.data;
  }

  async queryFeeburnerParams(): Promise<ParamsFeeburnerResponse> {
    const req = await axios.get(`${this.sdk.url}/neutron/feeburner/params`);

    return req.data;
  }

  async queryFeerefunderParams(): Promise<ParamsFeerefunderResponse> {
    const req = await axios.get(
      `${this.sdk.url}/neutron-org/neutron/feerefunder/params`,
    );

    return req.data;
  }

  async queryContractmanagerParams(): Promise<ParamsContractmanagerResponse> {
    const req = await axios.get(
      `${this.sdk.url}/neutron/contractmanager/params`,
    );

    return req.data;
  }

  async queryCronParams(): Promise<ParamsCronResponse> {
    const req = await axios.get(`${this.sdk.url}/neutron/cron/params`);

    return req.data;
  }

  async queryDexParams(): Promise<ParamsDexResponse> {
    const req = await axios.get(`${this.sdk.url}/neutron/dex/params`);

    return req.data;
  }

  async queryTokenfactoryParams(): Promise<ParamsTokenfactoryResponse> {
    const req = await axios.get(
      `${this.sdk.url}/osmosis/tokenfactory/v1beta1/params`,
    );

    return req.data;
  }

  async queryDelegations(delegatorAddr: cosmosclient.AccAddress): Promise<any> {
    const balances = await cosmosclient.rest.staking.delegatorDelegations(
      this.sdk,
      delegatorAddr,
    );
    return balances.data;
  }

  async queryBalances(addr: string): Promise<BalancesResponse> {
    const balances = await cosmosclient.rest.bank.allBalances(this.sdk, addr);
    return balances.data as BalancesResponse;
  }

  async queryDenomBalance(addr: string, denom: string): Promise<number> {
    const { data } = await cosmosclient.rest.bank.allBalances(this.sdk, addr);
    const balance = data.balances.find((b) => b.denom === denom);
    return parseInt(balance?.amount ?? '0', 10);
  }

  async queryDenomTrace(ibcDenom: string): Promise<DenomTraceResponse> {
    const data = axios.get<{ denom_trace: DenomTraceResponse }>(
      `${this.sdk.url}/ibc/apps/transfer/v1/denom_traces/${ibcDenom}`,
    );
    return data.then((res) => res.data.denom_trace);
  }

  async queryAckFailures(
    addr: string,
    pagination?: PageRequest,
  ): Promise<AckFailuresResponse> {
    try {
      const req = await axios.get<AckFailuresResponse>(
        `${this.sdk.url}/neutron/contractmanager/failures/${addr}`,
        { params: pagination },
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async listIBCChannels(): Promise<ChannelsList> {
    const res = await axios.get<ChannelsList>(
      `${this.sdk.url}/ibc/core/channel/v1/channels`,
    );
    return res.data;
  }

  async getIBCClientStatus(clientId: string): Promise<IBCClientStatus> {
    const res = await axios.get<IBCClientStatus>(
      `${this.sdk.url}/ibc/core/client/v1/client_status/${clientId}`,
    );
    return res.data;
  }

  async queryTotalBurnedNeutronsAmount(): Promise<TotalBurnedNeutronsAmountResponse> {
    try {
      const req = await axios.get<TotalBurnedNeutronsAmountResponse>(
        `${this.sdk.url}/neutron/feeburner/total_burned_neutrons_amount`,
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryTotalSupplyByDenom(
    denom: string,
  ): Promise<TotalSupplyByDenomResponse> {
    try {
      const req = await axios.get<TotalSupplyByDenomResponse>(
        `${this.sdk.url}/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`,
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryDenomsMetadata(
    pagination?: PageRequest,
  ): Promise<DenomMetadataResponse> {
    try {
      const req = await axios.get<DenomMetadataResponse>(
        `${this.sdk.url}/cosmos/bank/v1beta1/denoms_metadata`,
        { params: pagination },
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async getChainAdmins() {
    const url = `${this.sdk.url}/cosmos/adminmodule/adminmodule/admins`;
    const resp = await axios.get<{
      admins: [string];
    }>(url);
    return resp.data.admins;
  }

  async getNeutronDAOCore() {
    const chainManager = (await this.getChainAdmins())[0];
    const strategies = await this.queryContract<[string, Strategy][]>(
      chainManager,
      {
        strategies: {},
      },
    );
    return strategies[0][0];
  }

  async queryPausedInfo(addr: string): Promise<PauseInfoResponse> {
    return await this.queryContract<PauseInfoResponse>(addr, {
      pause_info: {},
    });
  }

  async getWithAttempts<T>(
    getFunc: () => Promise<T>,
    readyFunc: (t: T) => Promise<boolean>,
    numAttempts = 20,
  ): Promise<T> {
    return await getWithAttempts(
      this.blockWaiter,
      getFunc,
      readyFunc,
      numAttempts,
    );
  }

  async getCodeDataHash(codeId: number): Promise<string> {
    try {
      const res = await axios.get(
        `${this.sdk.url}/cosmwasm/wasm/v1/code/${codeId}`,
      );
      return res.data.code_info.data_hash;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async querySchedules(pagination?: PageRequest): Promise<ScheduleResponse> {
    try {
      const req = await axios.get<ScheduleResponse>(
        `${this.sdk.url}/neutron/cron/schedule`,
        { params: pagination },
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryCurrentUpgradePlan(): Promise<CurrentPlanResponse> {
    try {
      const req = await axios.get<CurrentPlanResponse>(
        `${this.sdk.url}/cosmos/upgrade/v1beta1/current_plan`,
        {},
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryPinnedCodes(): Promise<PinnedCodesResponse> {
    try {
      const req = await axios.get<PinnedCodesResponse>(
        `${this.sdk.url}/cosmwasm/wasm/v1/codes/pinned`,
        {},
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryHostEnabled(): Promise<boolean> {
    try {
      const req = await axios.get<IcaHostParamsResponse>(
        `${this.sdk.url}/ibc/apps/interchain_accounts/host/v1/params`,
        {},
      );
      return req.data.params.host_enabled;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryMaxTxsAllowed(): Promise<string> {
    try {
      const req = await axios.get<InterchaintxsParamsResponse>(
        `${this.sdk.url}/neutron/interchaintxs/params`,
        {},
      );
      return req.data.params.msg_submit_tx_max_messages;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryGlobalfeeParams(): Promise<GlobalfeeParamsResponse> {
    const req = await axios.get(
      `${this.sdk.url}/gaia/globalfee/v1beta1/params`,
    );

    return req.data.params;
  }

  async getGasPrice(denom: string): Promise<GasPriceResponse> {
    const res = await axios.get<GasPriceResponse>(
      `${this.sdk.url}/feemarket/v1/gas_price/${denom}`,
    );

    return res.data;
  }

  async getGasPrices(): Promise<GasPricesResponse> {
    const res = await axios.get<GasPricesResponse>(
      `${this.sdk.url}/feemarket/v1/gas_prices`,
    );

    return res.data;
  }

  async getDynamicFeesRaparms(): Promise<DynamicFeesRaparmsResponse> {
    const res = await axios.get<DynamicFeesRaparmsResponse>(
      `${this.sdk.url}/neutron/dynamicfees/v1/params`,
    );

    return res.data;
  }

  async getFeemarketParams(): Promise<FeeMarketParamsResponse> {
    const res = await axios.get<FeeMarketParamsResponse>(
      `${this.sdk.url}/feemarket/v1/params`,
    );

    return res.data;
  }

  async queryContractAdmin(address: string): Promise<string> {
    const resp = await this.getContractInfo(address);
    return resp.contract_info.admin;
  }

  async queryOraclePrice(
    base: string,
    quote: string,
  ): Promise<GetPriceResponse> {
    try {
      const req = await axios.get<any>(
        `${this.sdk.url}/slinky/oracle/v1/get_price`,
        {
          params: {
            'currency_pair.Base': base,
            'currency_pair.Quote': quote,
          },
        },
      );
      return req.data;
    } catch (e) {
      if (e.response?.data?.message !== undefined) {
        throw new Error(e.response?.data?.message);
      }
      throw e;
    }
  }

  async queryOraclePrices(
    currencyPairIds: string[],
  ): Promise<GetPricesResponse> {
    const req = await axios.get(`${this.sdk.url}/slinky/oracle/v1/get_prices`, {
      params: { currency_pair_ids: currencyPairIds.join(',') },
    });

    return req.data;
  }

  async queryOracleAllCurrencyPairs(): Promise<GetAllCurrencyPairsResponse> {
    const req = await axios.get(
      `${this.sdk.url}/slinky/oracle/v1/get_all_tickers`,
    );

    return req.data;
  }
}

export class WalletWrapper {
  readonly chain: CosmosWrapper;
  readonly wallet: Wallet;

  constructor(cw: CosmosWrapper, wallet: Wallet) {
    this.chain = cw;
    this.wallet = wallet;
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
    const storeMsg = new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgStoreCode({
      sender: this.wallet.address.toString(),
      wasm_byte_code: await getContractBinary(fileName),
      instantiate_permission: null,
    });
    const data = await this.execTx(
      {
        amount: [{ denom: NEUTRON_DENOM, amount: '250000' }],
        gas_limit: Long.fromString('60000000'),
      },
      [cosmosclient.codec.instanceToProtoAny(storeMsg)],
    );

    if (data.tx_response.code !== 0) {
      throw new Error(`upload error: ${data.tx_response.raw_log}`);
    }

    const attributes = getEventAttributesFromTx(data, 'store_code', [
      'code_id',
    ]);

    return parseInt(attributes[0].code_id);
  }

  async instantiateContract(
    codeId: number,
    msg: string,
    label: string,
    admin: string = this.wallet.address.toString(),
  ): Promise<Array<Record<string, string>>> {
    const msgInit =
      new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgInstantiateContract({
        code_id: codeId + '',
        sender: this.wallet.address.toString(),
        admin: admin,
        label,
        msg: Buffer.from(msg),
      });

    const data = await this.execTx(
      {
        amount: [{ denom: NEUTRON_DENOM, amount: '2000000' }],
        gas_limit: Long.fromString('600000000'),
      },
      [cosmosclient.codec.instanceToProtoAny(msgInit)],
      10,
      cosmosclient.rest.tx.BroadcastTxMode.Sync,
    );

    if (data.tx_response.code !== 0) {
      throw new Error(`instantiate error: ${data.tx_response.raw_log}`);
    }

    return getEventAttributesFromTx(data, 'instantiate', [
      '_contract_address',
      'code_id',
    ]);
  }

  async migrateContract(
    contract: string,
    codeId: number,
    msg: string | Record<string, unknown>,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const sender = this.wallet.address.toString();
    const msgMigrate =
      new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgMigrateContract({
        sender,
        contract,
        code_id: codeId + '',
        msg: Buffer.from(typeof msg === 'string' ? msg : JSON.stringify(msg)),
      });
    const res = await this.execTx(
      {
        gas_limit: Long.fromString('5000000'),
        amount: [{ denom: this.chain.denom, amount: '20000' }],
      },
      [cosmosclient.codec.instanceToProtoAny(msgMigrate)],
    );
    if (res.tx_response.code !== 0) {
      throw new Error(
        `${res.tx_response.raw_log}\nFailed tx hash: ${res.tx_response.txhash}`,
      );
    }
    return res?.tx_response;
  }

  async executeContract(
    contract: string,
    msg: string,
    funds: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] = [],
    fee = {
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.chain.denom, amount: '10000' }],
    },
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const sender = this.wallet.address.toString();
    const msgExecute =
      new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgExecuteContract({
        sender,
        contract,
        msg: Buffer.from(msg),
        funds,
      });

    const res = await this.execTx(fee, [
      cosmosclient.codec.instanceToProtoAny(msgExecute),
    ]);
    if (res.tx_response.code !== 0) {
      throw new Error(
        `${res.tx_response.raw_log}\nFailed tx hash: ${res.tx_response.txhash}`,
      );
    }
    return res?.tx_response;
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
    sequence: number = this.wallet.account.sequence,
    mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
      .BroadcastTxMode.Sync,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const { amount, denom = this.chain.denom } =
      typeof coin === 'string' ? { amount: coin } : coin;
    const msgSend = new MsgSend({
      fromAddress: this.wallet.address.toString(),
      toAddress: to,
      amount: [{ denom, amount }],
    });
    const res = await this.execTx(
      fee,
      [packAnyMsg('/cosmos.bank.v1beta1.MsgSend', msgSend)],
      10,
      mode,
      sequence,
    );
    return res?.tx_response;
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
    token: ICoin,
    receiver: string,
    timeoutHeight: IHeight,
    memo?: string,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const newMsgSend = new MsgTransfer({
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      token: token,
      sender: this.wallet.address.toString(),
      receiver: receiver,
      timeoutHeight: new Height({
        revisionHeight: timeoutHeight.revision_height,
        revisionNumber: timeoutHeight.revision_number,
      }),
      memo: memo,
    });

    const res = await this.execTx(
      {
        gas_limit: Long.fromString('200000'),
        amount: [{ denom: this.chain.denom, amount: '1000' }],
      },
      [packAnyMsg('/ibc.applications.transfer.v1.MsgTransfer', newMsgSend)],
    );
    return res?.tx_response;
  }
}

export const getEventAttributesFromTx = (
  data: any,
  event: string,
  attributes: string[],
): Array<
  Record<(typeof attributes)[number], string> | Record<string, never>
> => {
  const events = data?.tx_response.events;
  const resp = [];
  for (const e of events) {
    if (event === e.type) {
      let out = {};
      for (const a of e.attributes) {
        if (attributes.includes(a.key)) {
          out[a.key] = a.value;
        }
        if (Object.keys(out).length == attributes.length) {
          resp.push(out);
          out = {};
        }
      }
    }
  }
  return resp;
};

export const mnemonicToWallet = async (
  walletType: {
    fromPublicKey: (
      k: cosmosclient.PubKey,
    ) => cosmosclient.AccAddress | cosmosclient.ValAddress;
  },
  sdk: cosmosclient.CosmosSDK,
  mnemonic: string,
  addrPrefix: string,
  validate = true,
): Promise<Wallet> => {
  const privKey = new cosmosclient.proto.cosmos.crypto.secp256k1.PrivKey({
    key: await cosmosclient.generatePrivKeyFromMnemonic(mnemonic),
  });

  const pubKey = privKey.pubKey();
  let account = null;
  cosmosclient.config.setBech32Prefix({
    accAddr: addrPrefix,
    accPub: `${addrPrefix}pub`,
    valAddr: `${addrPrefix}valoper`,
    valPub: `${addrPrefix}valoperpub`,
    consAddr: `${addrPrefix}valcons`,
    consPub: `${addrPrefix}valconspub`,
  });
  const address = walletType.fromPublicKey(pubKey);
  // eslint-disable-next-line no-prototype-builtins
  if (cosmosclient.ValAddress !== walletType && validate) {
    account = await cosmosclient.rest.auth
      .account(sdk, address.toString())
      .then((res) =>
        cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account),
        ),
      )
      .catch((e) => {
        console.log(e);
        throw e;
      });

    if (
      !(account instanceof cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount)
    ) {
      throw new Error("can't get account");
    }
  }
  return new Wallet(address, account, pubKey, privKey, addrPrefix);
};

export const getSequenceId = (
  rawLog: BroadcastTx200ResponseTxResponse | undefined,
): number => {
  if (!rawLog) {
    throw 'getSequenceId: empty rawLog';
  }
  for (const event of rawLog.events) {
    if (event.type === 'send_packet') {
      const sequenceAttr = event.attributes.find(
        (attr) => attr.key === 'packet_sequence',
      );
      if (sequenceAttr) {
        return parseInt(sequenceAttr.value);
      }
    }
  }
};

export const getIBCDenom = (portName, channelName, denom: string): string => {
  const uatomIBCHash = crypto
    .createHash('sha256')
    .update(`${portName}/${channelName}/${denom}`)
    .digest('hex')
    .toUpperCase();
  return `ibc/${uatomIBCHash}`;
};

export const createBankSendMessage = (
  addr: string,
  amount: number,
  denom: string,
) => ({
  bank: {
    send: {
      to_address: addr,
      amount: [
        {
          denom: denom,
          amount: amount.toString(),
        },
      ],
    },
  },
});

export const getEventAttribute = (
  events: { type: string; attributes: { key: string; value: string }[] }[],
  eventType: string,
  attribute: string,
): string => {
  const attributes = events
    .filter((event) => event.type === eventType)
    .map((event) => event.attributes)
    .flat();

  const attrValue = attributes?.find((attr) => attr.key === attribute)
    ?.value as string;

  if (!attrValue) {
    throw new Error(`Attribute ${attribute} not found`);
  }

  return attrValue;
};

export const filterIBCDenoms = (list: ICoin[]) =>
  list.filter(
    (coin) =>
      coin.denom && ![IBC_ATOM_DENOM, IBC_USDC_DENOM].includes(coin.denom),
  );

export const wrapMsg = (x) => Buffer.from(JSON.stringify(x)).toString('base64');

// *packAnyMsg* packs the protobuf message inside an Any type with given typeUrl
export const packAnyMsg = (
  typeUrl: string,
  msg: Message,
): cosmosclient.proto.google.protobuf.Any =>
  new cosmosclient.proto.google.protobuf.Any({
    type_url: typeUrl,
    value: msg.toBinary(),
  });
