import cosmosclient from '@cosmos-client/core';
import axios from 'axios';
import { BlockWaiter, getWithAttempts } from './wait';
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
  GlobalfeeParamsResponse,
  InterchaintxsParamsResponse,
  ParamsFeeburnerResponse,
  ParamsInterchainqueriesResponse,
  ParamsFeerefunderResponse,
  ParamsContractmanagerResponse,
  ParamsCronResponse,
  ParamsTokenfactoryResponse,
} from './types';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import {
  Event as CosmosEvent,
  createProtobufRpcClient,
  QueryClient,
} from '@cosmjs/stargate';

import { GetPriceResponse } from './oracle';
import { GetAllCurrencyPairsResponse, GetPricesResponse } from './oracle';
import { Coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { IndexedTx } from '@cosmjs/stargate';

export const NEUTRON_DENOM = process.env.NEUTRON_DENOM || 'untrn';
export const IBC_ATOM_DENOM = process.env.IBC_ATOM_DENOM || 'uibcatom';
export const IBC_USDC_DENOM = process.env.IBC_USDC_DENOM || 'uibcusdc';
export const COSMOS_DENOM = process.env.COSMOS_DENOM || 'uatom';
export const IBC_RELAYER_NEUTRON_ADDRESS =
  'neutron1mjk79fjjgpplak5wq838w0yd982gzkyf8fxu8u';
export const ADMIN_MODULE_ADDRESS =
  'neutron1hxskfdxpp5hqgtjj6am6nkjefhfzj359x0ar3z';

// BalancesResponse is the response model for the bank balances query.
export type BalancesResponse = {
  balances: Coin[];
  // pagination: {
  // next_key: string;
  // total: string;
  // };
};

// DenomTraceResponse is the response model for the ibc transfer denom trace query.
type DenomTraceResponse = {
  path?: string;
  base_denom?: string;
};

export type TotalSupplyByDenomResponse = {
  amount: Coin;
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
    coin: Coin;
  };
};

// TODO?
// export function createCosmosWrapper(rpc: string) {

// }

export class CosmosWrapper {
  readonly sdk: cosmosclient.CosmosSDK; // TODO: remove
  readonly blockWaiter: BlockWaiter;
  readonly denom: string;
  readonly rest: string;
  readonly rpc: string;

  constructor(
    sdk: cosmosclient.CosmosSDK, // TODO: remove
    blockWaiter: BlockWaiter,
    denom: string,
    rpc: string,
  ) {
    this.denom = denom;
    this.sdk = sdk;
    this.blockWaiter = blockWaiter;
    this.rpc = rpc;
    this.rest = sdk.url; // TODO: just pass rest string without sdk
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
      this.rest
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
    const url = `${this.rest}/cosmwasm/wasm/v1/contract/${contract}`;
    try {
      const resp = await axios.get(url);
      return resp.data;
    } catch (e) {
      throw new Error(e.response?.data?.message);
    }
  }

  async queryInterchainqueriesParams(): Promise<ParamsInterchainqueriesResponse> {
    const req = await axios.get(
      `${this.rest}/neutron/interchainqueries/params`,
    );

    return req.data;
  }

  async queryFeeburnerParams(): Promise<ParamsFeeburnerResponse> {
    const req = await axios.get(`${this.rest}/neutron/feeburner/params`);

    return req.data;
  }

  async queryFeerefunderParams(): Promise<ParamsFeerefunderResponse> {
    const req = await axios.get(
      `${this.rest}/neutron-org/neutron/feerefunder/params`,
    );

    return req.data;
  }

  async queryContractmanagerParams(): Promise<ParamsContractmanagerResponse> {
    const req = await axios.get(`${this.rest}/neutron/contractmanager/params`);

    return req.data;
  }

  async queryCronParams(): Promise<ParamsCronResponse> {
    const req = await axios.get(`${this.rest}/neutron/cron/params`);

    return req.data;
  }

  async queryTokenfactoryParams(): Promise<ParamsTokenfactoryResponse> {
    const req = await axios.get(
      `${this.rest}/osmosis/tokenfactory/v1beta1/params`,
    );

    return req.data;
  }

  async queryBalances(addr: string): Promise<BalancesResponse> {
    // TODO: fixme don't connect every time
    const tendermint = await Tendermint37Client.connect(this.rpc);
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const res = await bankQueryService.AllBalances({
      address: addr,
    });
    return res;
  }

  async queryDenomBalance(addr: string, denom: string): Promise<number> {
    const tendermint = await Tendermint37Client.connect(this.rpc);
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const res = await bankQueryService.Balance({
      address: addr,
      denom,
    });

    return parseInt(res?.balance.amount ?? '0', 10);
  }

  async queryDenomTrace(ibcDenom: string): Promise<DenomTraceResponse> {
    const data = axios.get<{ denom_trace: DenomTraceResponse }>(
      `${this.rest}/ibc/apps/transfer/v1/denom_traces/${ibcDenom}`,
    );
    return data.then((res) => res.data.denom_trace);
  }

  async queryAckFailures(
    addr: string,
    pagination?: PageRequest,
  ): Promise<AckFailuresResponse> {
    try {
      const req = await axios.get<AckFailuresResponse>(
        `${this.rest}/neutron/contractmanager/failures/${addr}`,
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
      `${this.rest}/ibc/core/channel/v1/channels`,
    );
    return res.data;
  }

  async getIBCClientStatus(clientId: string): Promise<IBCClientStatus> {
    const res = await axios.get<IBCClientStatus>(
      `${this.rest}/ibc/core/client/v1/client_status/${clientId}`,
    );
    return res.data;
  }

  async queryTotalBurnedNeutronsAmount(): Promise<TotalBurnedNeutronsAmountResponse> {
    try {
      const req = await axios.get<TotalBurnedNeutronsAmountResponse>(
        `${this.rest}/neutron/feeburner/total_burned_neutrons_amount`,
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
        `${this.rest}/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`,
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
        `${this.rest}/cosmos/bank/v1beta1/denoms_metadata`,
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
    const url = `${this.rest}/cosmos/adminmodule/adminmodule/admins`;
    const resp = await axios.get<{
      admins: [string];
    }>(url);
    return resp.data.admins;
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
        `${this.rest}/cosmwasm/wasm/v1/code/${codeId}`,
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
        `${this.rest}/neutron/cron/schedule`,
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
        `${this.rest}/cosmos/upgrade/v1beta1/current_plan`,
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
        `${this.rest}/cosmwasm/wasm/v1/codes/pinned`,
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
        `${this.rest}/ibc/apps/interchain_accounts/host/v1/params`,
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
        `${this.rest}/neutron/interchaintxs/params`,
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
    const req = await axios.get(`${this.rest}/gaia/globalfee/v1beta1/params`);

    return req.data.params;
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
        `${this.rest}/slinky/oracle/v1/get_price`,
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
    const req = await axios.get(`${this.rest}/slinky/oracle/v1/get_prices`, {
      params: { currency_pair_ids: currencyPairIds.join(',') },
    });

    return req.data;
  }

  async queryOracleAllCurrencyPairs(): Promise<GetAllCurrencyPairsResponse> {
    const req = await axios.get(
      `${this.rest}/slinky/oracle/v1/get_all_tickers`,
    );

    return req.data;
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
  mnemonic: string,
  addrPrefix: string,
): Promise<Wallet> => {
  const directwallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: addrPrefix,
  });
  const account = (await directwallet.getAccounts())[0];
  const directwalletValoper = await DirectSecp256k1HdWallet.fromMnemonic(
    mnemonic,
    {
      prefix: addrPrefix + 'valoper',
    },
  );
  const accountValoper = (await directwalletValoper.getAccounts())[0];
  return new Wallet(addrPrefix, directwallet, account, accountValoper);
};

export const getSequenceId = (tx: IndexedTx | undefined): number => {
  if (!tx) {
    throw 'getSequenceId: empty rawLog';
  }
  for (const event of tx.events) {
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
  events: readonly CosmosEvent[],
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

export const filterIBCDenoms = (list: Coin[]) =>
  list.filter(
    (coin) =>
      coin.denom && ![IBC_ATOM_DENOM, IBC_USDC_DENOM].includes(coin.denom),
  );

export const wrapMsg = (x) => Buffer.from(JSON.stringify(x)).toString('base64');
