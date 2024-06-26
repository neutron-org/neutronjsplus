import axios from 'axios';
import { sleep } from './wait';
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
  GlobalfeeParamsResponse,
  InterchaintxsParamsResponse,
  ParamsFeeburnerResponse,
  ParamsInterchainqueriesResponse,
  ParamsFeerefunderResponse,
  ParamsContractmanagerResponse,
  ParamsCronResponse,
  ParamsTokenfactoryResponse,
  Strategy,
  TransferParamsResponse,
  DenomTraceResponse,
  TotalBurnedNeutronsAmountResponse,
  TotalSupplyByDenomResponse,
  DenomMetadataResponse,
} from './types';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import { connectComet } from '@cosmjs/tendermint-rpc';
import {
  Event as CosmosEvent,
  createProtobufRpcClient,
  QueryClient,
  StargateClient,
} from '@cosmjs/stargate';

import { GetPriceResponse } from './oracle';
import { GetAllCurrencyPairsResponse, GetPricesResponse } from './oracle';
import { Coin } from '@cosmjs/proto-signing';
import { IndexedTx } from '@cosmjs/stargate';
import { IBC_ATOM_DENOM, IBC_USDC_DENOM } from './constants';
import {
  DynamicFeesParamsResponse,
  FeeMarketParamsResponse,
  GasPriceResponse,
  GasPricesResponse,
} from './feemarket';

export class CosmosWrapper {
  constructor(public denom: string, public rest: string, public rpc: string) {}

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
      await this.waitBlocks(1);
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

  async queryTransferParams(): Promise<TransferParamsResponse> {
    const req = await axios.get(`${this.rest}/ibc/apps/transfer/v1/params`);

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

  async queryBalances(addr: string): Promise<Coin[]> {
    // TODO: fixme don't connect every time
    const client = await connectComet(this.rpc);
    const queryClient = new QueryClient(client);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const res = await bankQueryService.AllBalances({
      address: addr,
    });
    return res.balances;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async queryDenomBalance(addr: string, denom: string): Promise<number> {
    // TODO: fixme don't connect every time
    const client = await connectComet(this.rpc);
    const queryClient = new QueryClient(client);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const res = await bankQueryService.Balance({
      address: addr,
      denom,
    });

    return parseInt(res?.balance.amount ?? '0', 10);
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getHeight(): Promise<number> {
    // TODO: fixme don't connect every time
    const client = await connectComet(this.rpc);

    const block = await client.block();
    return +block.block.header.height;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async waitBlocks(blocks: number, timeout = 120000): Promise<void> {
    const start = Date.now();
    const client = await StargateClient.connect(this.rpc);
    const initBlock = await client.getBlock();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const block = await client.getBlock();
        if (block.header.height - initBlock.header.height >= blocks) {
          break;
        }
        if (Date.now() - start > timeout) {
          throw new Error('Timeout waiting for the specific block');
        }
      } catch (e) {
        //noop
      }
      await sleep(1000);
    }
  }

  /**
   * @deprecated since version 0.5.0
   */
  async queryDenomTrace(ibcDenom: string): Promise<DenomTraceResponse> {
    const data = axios.get<{ denom_trace: DenomTraceResponse }>(
      `${this.rest}/ibc/apps/transfer/v1/denom_traces/${ibcDenom}`,
    );
    return data.then((res) => res.data.denom_trace);
  }

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
  async listIBCChannels(): Promise<ChannelsList> {
    const res = await axios.get<ChannelsList>(
      `${this.rest}/ibc/core/channel/v1/channels`,
    );
    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getIBCClientStatus(clientId: string): Promise<IBCClientStatus> {
    const res = await axios.get<IBCClientStatus>(
      `${this.rest}/ibc/core/client/v1/client_status/${clientId}`,
    );
    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
  async getChainAdmins() {
    const url = `${this.rest}/cosmos/adminmodule/adminmodule/admins`;
    const resp = await axios.get<{
      admins: [string];
    }>(url);
    return resp.data.admins;
  }

  /**
   * @deprecated since version 0.5.0
   */
  // TODO: do not belong here - move out to the dao.ts or something
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

  /**
   * @deprecated since version 0.5.0
   */
  // TODO: do not belong here - move out to the dao.ts or something
  async queryPausedInfo(addr: string): Promise<PauseInfoResponse> {
    return await this.queryContract<PauseInfoResponse>(addr, {
      pause_info: {},
    });
  }

  /**
   * @deprecated since version 0.5.0
   */
  // TODO: do not belong here - move to test helpers
  async getWithAttempts<T>(
    getFunc: () => Promise<T>,
    readyFunc: (t: T) => Promise<boolean>,
    numAttempts = 20,
  ): Promise<T> {
    let error = null;
    let data: T;
    while (numAttempts > 0) {
      numAttempts--;
      try {
        data = await getFunc();
        if (await readyFunc(data)) {
          return data;
        }
      } catch (e) {
        error = e;
      }
      await this.waitBlocks(1);
    }
    throw error != null
      ? error
      : new Error(
          'getWithAttempts: no attempts left. Latest get response: ' +
            (data === Object(data) ? JSON.stringify(data) : data).toString(),
        );
  }

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
  async queryGlobalfeeParams(): Promise<GlobalfeeParamsResponse> {
    const req = await axios.get(`${this.rest}/gaia/globalfee/v1beta1/params`);

    return req.data.params;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getGasPrice(denom: string): Promise<GasPriceResponse> {
    const res = await axios.get<GasPriceResponse>(
      `${this.rest}/feemarket/v1/gas_price/${denom}`,
    );

    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getGasPrices(): Promise<GasPricesResponse> {
    const res = await axios.get<GasPricesResponse>(
      `${this.rest}/feemarket/v1/gas_prices`,
    );

    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getDynamicFeesRaparms(): Promise<DynamicFeesParamsResponse> {
    const res = await axios.get<DynamicFeesParamsResponse>(
      `${this.rest}/neutron/dynamicfees/v1/params`,
    );

    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async getFeemarketParams(): Promise<FeeMarketParamsResponse> {
    const res = await axios.get<FeeMarketParamsResponse>(
      `${this.rest}/feemarket/v1/params`,
    );

    return res.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async queryContractAdmin(address: string): Promise<string> {
    const resp = await this.getContractInfo(address);
    return resp.contract_info.admin;
  }

  /**
   * @deprecated since version 0.5.0
   */
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

  /**
   * @deprecated since version 0.5.0
   */
  async queryOraclePrices(
    currencyPairIds: string[],
  ): Promise<GetPricesResponse> {
    const req = await axios.get(`${this.rest}/slinky/oracle/v1/get_prices`, {
      params: { currency_pair_ids: currencyPairIds.join(',') },
    });

    return req.data;
  }

  /**
   * @deprecated since version 0.5.0
   */
  async queryOracleAllCurrencyPairs(): Promise<GetAllCurrencyPairsResponse> {
    const req = await axios.get(
      `${this.rest}/slinky/oracle/v1/get_all_tickers`,
    );

    return req.data;
  }
}

// TODO: move out to some helpers
/**
 * @deprecated since version 0.5.0
 */
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

// TODO: move out to IBC helpers
/**
 * @deprecated since version 0.5.0
 */
export const getIBCDenom = (portName, channelName, denom: string): string => {
  const uatomIBCHash = crypto
    .createHash('sha256')
    .update(`${portName}/${channelName}/${denom}`)
    .digest('hex')
    .toUpperCase();
  return `ibc/${uatomIBCHash}`;
};

// TODO: move to dao helpers
/**
 * @deprecated since version 0.5.0
 */
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

// TODO: move to helpers
/**
 * @deprecated since version 0.5.0
 */
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

// TODO: move out to IBC helpers
/**
 * @deprecated since version 0.5.0
 */
export const filterIBCDenoms = (list: Coin[]) =>
  list.filter(
    (coin) =>
      coin.denom && ![IBC_ATOM_DENOM, IBC_USDC_DENOM].includes(coin.denom),
  );

// TODO: move to dao helpers
/**
 * @deprecated since version 0.5.0
 */
export const wrapMsg = (x) => Buffer.from(JSON.stringify(x)).toString('base64');
