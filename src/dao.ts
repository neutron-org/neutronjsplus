import { createBankSendMessage, getEventAttribute } from './cosmos';
import {
  MultiChoiceOption,
  SingleChoiceProposal,
  TotalPowerAtHeightResponse,
  VotingPowerAtHeightResponse,
} from './types';
import {
  addSchedule,
  addSubdaoProposal,
  chainManagerWrapper,
  clearAdminProposal,
  clientUpdateProposal,import axios from 'axios';
import { sleep } from './wait';
import crypto from 'crypto';
import {
  AckFailuresResponse,
  ScheduleResponse,
  ChannelsList,
  IBCClientStatus,
  PageRequest,
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

/**
 * @deprecated since version 0.5.0
 */
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

  /**
   * @deprecated since version 0.5.0
   */
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

// TODO: move out to IBC helpers
/**
 * @deprecated since version 0.5.0
 */
export const filterIBCDenoms = (list: Coin[]) =>
  list.filter(
    (coin) =>
      coin.denom && ![IBC_ATOM_DENOM, IBC_USDC_DENOM].includes(coin.denom),
  );

paramChangeProposal,
  ParamChangeProposalInfo,
  ParamsContractmanagerInfo,
  ParamsCronInfo,
  ParamsFeeburnerInfo,
  ParamsFeerefunderInfo,
  ParamsGlobalfeeInfo,
  ParamsInterchainqueriesInfo,
  ParamsInterchaintxsInfo,
  ParamsTokenfactoryInfo,
  ParamsTransferInfo,
  pinCodesCustomAuthorityProposal,
  pinCodesProposal,
  removeSchedule,
  SendProposalInfo,
  unpinCodesProposal,
  updateAdminProposal,
  upgradeProposal,
} from './proposal';
import {
  Contract,
  CosmWasmClient,
  ExecuteResult,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { ClientState } from '@neutron-org/cosmjs-types/ibc/lightclients/tendermint/v1/tendermint';
import { QueryClientImpl as AdminQueryClient } from '@neutron-org/cosmjs-types/cosmos/adminmodule/adminmodule/query';
import { ADMIN_MODULE_ADDRESS } from './constants';
import { DynamicFeesParams, FeeMarketParams } from './proposal';
import { getWithAttempts } from './wait';
import { ProtobufRpcClient } from '@cosmjs/stargate';

export type SubdaoProposalConfig = {
  threshold: any;
  max_voting_period: Duration;
  min_voting_period: Duration;
  allow_revoting: boolean;
  dao: string;
  close_proposal_on_execution_failure: boolean;
};

export type Duration = {
  height: number | null;
  time: number | null;
};

export type ProposalFailedExecutionErrorResponse = string;

export type GetSubdaoResponse = { addr: string; charter: string };

export type TimeLockSingleChoiceProposal = {
  id: number;
  msgs: Array<Record<string, any>>; // Vec<CosmosMsg<NeutronMsg>>
  status: string;
};

export type TimelockConfig = {
  owner: string;
  overrule_pre_propose: string;
  subdao: string;
};

export type TimelockProposalListResponse = {
  proposals: Array<TimeLockSingleChoiceProposal>;
};

export type SubDaoConfig = {
  name: string;
  description: string;
  dao_uri: string;
  main_dao: string;
  security_dao: string;
};

export type LockdropVaultConfig = {
  name: string;
  description: string;
  lockdrop_contract: string;
  oracle_usdc_contract: string;
  oracle_atom_contract: string;
  owner: string;
};

export type VestingLpVaultConfig = {
  name: string;
  description: string;
  atom_vesting_lp_contract: string;
  atom_oracle_contract: string;
  usdc_vesting_lp_contract: string;
  usdc_oracle_contract: string;
  owner: string;
};

export type CreditsVaultConfig = {
  name: string;
  description: string;
  credits_contract_address: string;
  owner: string;
  airdrop_contract_address: string;
};

export type VaultBondingStatus = {
  bonding_enabled: string;
  unbondable_amount: string;
  height: number;
};

export type VotingVaultsModule = {
  address: string;
  vaults: {
    neutron: {
      address: string;
    };
    lockdrop: {
      address: string;
    };
  };
};

export type VotingCw4Module = {
  address: string;
  cw4group: {
    address: string;
  };
};

export type ProposalModule = {
  address: string;
  pre_propose: {
    address: string;
    timelock?: {
      address: string;
    };
  };
};

export type NewMarkets = {
  ticker: {
    currency_pair: {
      Base: string;
      Quote: string;
    };
    decimals: number;
    min_provider_count: number;
    enabled: boolean;
    metadata_JSON: string;
  };
  provider_configs: {
    name: string;
    off_chain_ticker: string;
    normalize_by_pair?: {
      Base: string;
      Quote: string;
    };
    invert?: boolean;
    metadata_JSON?: string;
  }[];
}[];

export const DaoPrefixes = {
  'Neutron DAO': 'neutron',
  'Security SubDAO': 'security',
  'Grants SubDAO': 'grants',
};

export type DaoContracts = {
  name: string;
  core: {
    address: string;
  };
  proposals: {
    [name: string]: ProposalModule;
  };
  voting: VotingVaultsModule | VotingCw4Module;
  subdaos?: {
    [name: string]: DaoContracts;
  };
};

export type PauseInfoResponse = {
  paused: {
    until_height: number;
  };
  unpaused: Record<string, never>;
};

export const getVotingModule = async (
  client: CosmWasmClient,
  daoAddress: string,
): Promise<string> =>
  await client.queryContractSmart(daoAddress, {
    voting_module: {},
  });

export const getVotingVaults = async (
  client: CosmWasmClient,
  votingModuleAddress: string,
): Promise<VotingVaultsModule['vaults']> => {
  const votingVaults = await client.queryContractSmart(votingModuleAddress, {
    voting_vaults: {},
  });
  let ntrnVaultAddress;
  let lockdropVaultAddress;
  for (const vault of votingVaults) {
    const vaultContract = await client.getContract(vault.address);

    switch (vaultContract.label) {
      case DaoContractLabels.NEUTRON_VAULT:
        ntrnVaultAddress = vault.address;
        break;
      case DaoContractLabels.LOCKDROP_VAULT:
        lockdropVaultAddress = vault.address;
        break;
    }
  }

  return {
    neutron: { address: ntrnVaultAddress },
    lockdrop: { address: lockdropVaultAddress },
  };
};

export const getProposalModules = async (
  client: CosmWasmClient,
  daoAddress: string,
): Promise<DaoContracts['proposals']> => {
  const proposalModules = await client.queryContractSmart(daoAddress, {
    proposal_modules: {},
  });

  const proposalsStructure: DaoContracts['proposals'] = {};

  for (const proposalModule of proposalModules) {
    const proposalContractInfo: Contract = await client.getContract(
      proposalModule.address,
    );
    const preProposalContract = await client.queryContractSmart(
      proposalModule.address,
      { proposal_creation_policy: {} },
    );
    const modulePath = proposalContractInfo.label.split('.');
    const moduleType = modulePath.at(-1);

    const preProposeModule: ProposalModule['pre_propose'] = {
      address: preProposalContract.Module.addr,
    };

    try {
      const timelockAddr = await client.queryContractSmart(
        preProposalContract.Module.addr,
        {
          query_extension: { msg: { timelock_address: {} } },
        },
      );
      preProposeModule.timelock = {
        address: timelockAddr,
      };
      // eslint-disable-next-line no-empty
    } catch (e) {}

    proposalsStructure[moduleType] = {
      address: proposalModule.address,
      pre_propose: preProposeModule,
    };
  }

  return proposalsStructure;
};

export const getDaoContracts = async (
  client: CosmWasmClient,
  daoAddress: string,
): Promise<DaoContracts> => {
  const config = await client.queryContractSmart(daoAddress, {
    config: {},
  });

  const votingModuleAddress = await getVotingModule(client, daoAddress);
  const votingVaults = await getVotingVaults(client, votingModuleAddress);
  const proposalsStructure = await getProposalModules(client, daoAddress);

  const subdaosList = await client.queryContractSmart(daoAddress, {
    list_sub_daos: {},
  });

  const subdaos = {};
  for (const subdao of subdaosList) {
    const subDaoContracts = await getSubDaoContracts(client, subdao.addr);
    subdaos[DaoPrefixes[subDaoContracts.name]] = subDaoContracts;
  }

  return {
    name: config.name,
    core: { address: daoAddress },
    proposals: proposalsStructure,
    voting: {
      address: votingModuleAddress,
      vaults: votingVaults,
    },
    subdaos: subdaos,
  };
};

export const getSubDaoContracts = async (
  client: CosmWasmClient,
  daoAddress: string,
): Promise<DaoContracts> => {
  const config = await client.queryContractSmart(daoAddress, {
    config: {},
  });

  const votingModuleAddress = await client.queryContractSmart(daoAddress, {
    voting_module: {},
  });
  const cw4GroupAddress = await client.queryContractSmart(votingModuleAddress, {
    group_contract: {},
  });

  const proposalsStructure = await getProposalModules(client, daoAddress);

  return {
    name: config.name,
    core: {
      address: daoAddress,
    },
    proposals: proposalsStructure,
    voting: {
      address: votingModuleAddress,
      cw4group: {
        address: cw4GroupAddress,
      },
    },
  };
};

export class Dao {
  constructor(private client: CosmWasmClient, public contracts: DaoContracts) {}

  async checkPassedProposal(proposalId: number) {
    await getWithAttempts(
      this.client,
      async () => await this.queryProposal(proposalId),
      async (response) => response.proposal.status === 'passed',
      20,
    );
  }

  async checkPassedMultiChoiceProposal(proposalId: number) {
    await getWithAttempts(
      this.client,
      async () => await this.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'passed',
      20,
    );
  }

  async checkExecutedMultiChoiceProposal(proposalId: number) {
    await getWithAttempts(
      this.client,
      async () => await this.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  async queryMultiChoiceProposal(proposalId: number): Promise<any> {
    return await this.client.queryContractSmart(
      this.contracts.proposals.multiple.address,
      {
        proposal: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async queryProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<SingleChoiceProposal> {
    return await this.client.queryContractSmart(
      this.contracts.proposals[customModule].address,
      {
        proposal: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async queryOverruleProposal(
    proposalId: number,
  ): Promise<SingleChoiceProposal> {
    return await this.client.queryContractSmart(
      this.contracts.proposals.overrule.address,
      {
        proposal: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async queryTotalVotingPower(
    height?: number,
  ): Promise<TotalPowerAtHeightResponse> {
    return await this.client.queryContractSmart(this.contracts.core.address, {
      total_power_at_height:
        typeof height === 'undefined' ? {} : { height: height },
    });
  }

  async queryVotingPower(
    addr: string,
    height?: number,
  ): Promise<VotingPowerAtHeightResponse> {
    return await this.client.queryContractSmart(this.contracts.core.address, {
      voting_power_at_height:
        typeof height === 'undefined'
          ? {
              address: addr,
            }
          : {
              address: addr,
              height: height,
            },
    });
  }

  async getTimelockedProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<TimeLockSingleChoiceProposal> {
    return this.client.queryContractSmart(
      this.contracts.proposals[customModule].pre_propose.timelock.address,
      {
        proposal: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async getTimelockedProposalError(
    proposalId: number,
    customModule = 'single',
  ): Promise<ProposalFailedExecutionErrorResponse> {
    return this.client.queryContractSmart(
      this.contracts.proposals[customModule].pre_propose.timelock.address,
      {
        proposal_execution_error: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async getSubDaoList(): Promise<string[]> {
    const res = await this.client.queryContractSmart(
      this.contracts.core.address,
      {
        list_sub_daos: {},
      },
    );
    return res.map((x) => x.addr);
  }

  async querySubDao(subdaoAddress: string): Promise<GetSubdaoResponse> {
    return this.client.queryContractSmart(this.contracts.core.address, {
      get_sub_dao: {
        address: subdaoAddress,
      },
    });
  }

  async getOverruleProposalId(
    timelockAddress: string,
    subdaoProposalId: number,
  ): Promise<number> {
    return await this.client.queryContractSmart(
      this.contracts.proposals.overrule.pre_propose.address,
      {
        query_extension: {
          msg: {
            overrule_proposal_id: {
              timelock_address: timelockAddress,
              subdao_proposal_id: subdaoProposalId,
            },
          },
        },
      },
    );
  }

  async queryPausedInfo(addr: string): Promise<PauseInfoResponse> {
    return await this.client.queryContractSmart(addr, {
      pause_info: {},
    });
  }
}

export class DaoMember {
  constructor(
    public dao: Dao,
    private client: SigningCosmWasmClient,
    public user: string,
    private denom: string,
  ) {}

  /**
   * voteYes  vote 'yes' for given proposal.
   */
  async voteYes(
    proposalId: number,
    customModule = 'single',
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals[customModule].address,
      { vote: { proposal_id: proposalId, vote: 'yes' } },
      fee,
    );
  }

  /**
   * voteNo  vote 'no' for given proposal.
   */
  async voteNo(
    proposalId: number,
    customModule = 'single',
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals[customModule].address,
      { vote: { proposal_id: proposalId, vote: 'no' } },
      fee,
    );
  }

  /**
   * voteForOption  vote for option for given multi choice proposal.
   */
  async voteForOption(
    proposalId: number,
    optionId: number,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals.multiple.address,
      {
        vote: { proposal_id: proposalId, vote: { option_id: optionId } },
      },
      fee,
    );
  }

  async bondFunds(
    amount: string,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    const vaultAddress = (this.dao.contracts.voting as VotingVaultsModule)
      .vaults.neutron.address;
    return await this.client.execute(
      this.user,
      vaultAddress,
      {
        bond: {},
      },
      fee,
      '',
      [{ denom: this.denom, amount: amount }],
    );
  }

  async unbondFunds(
    amount: string,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    const vaultAddress = (this.dao.contracts.voting as VotingVaultsModule)
      .vaults.neutron.address;
    return await this.client.execute(
      this.user,
      vaultAddress,
      {
        unbond: { amount: amount },
      },
      fee,
    );
  }

  /**
   * submitSingleChoiceProposal creates proposal with given message.
   */
  async submitSingleChoiceProposal(
    title: string,
    description: string,
    msgs: any[],
    deposit = '',
    customModule = 'single',
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<number> {
    let depositFunds = [];
    if (deposit !== '') {
      depositFunds = [{ denom: this.denom, amount: deposit }];
    }
    const proposalTx = await this.client.execute(
      this.user,
      this.dao.contracts.proposals[customModule].pre_propose.address,
      {
        propose: {
          msg: {
            propose: {
              title: title,
              description: description,
              msgs,
            },
          },
        },
      },
      fee,
      '',
      depositFunds,
    );

    const attribute = getEventAttribute(
      proposalTx.events,
      'wasm',
      'proposal_id',
    );

    const proposalId = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          JSON.stringify(proposalTx.events),
      );
    }
    return proposalId;
  }

  /**
   * executeProposal executes given proposal.
   */
  async executeProposal(
    proposalId: number,
    customModule = 'single',
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals[customModule].address,
      { execute: { proposal_id: proposalId } },
      fee,
    );
  }

  /**
   * executeProposal executes given proposal and waits until it has 'executed' status
   */
  async executeProposalWithAttempts(
    proposalId: number,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ) {
    await this.executeProposal(proposalId, 'single', fee);
    await getWithAttempts(
      this.client,
      async () => await this.dao.queryProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  /**
   * executeProposal executes given multchoice proposal and waits until it has 'executed' status
   */
  async executeMultiChoiceProposalWithAttempts(proposalId: number) {
    await this.executeMultiChoiceProposal(proposalId);
    await getWithAttempts(
      this.client,
      async () => await this.dao.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  /**
   * executeMultiChoiceProposal executes given multichoice proposal.
   */
  async executeMultiChoiceProposal(
    proposalId: number,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<any> {
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals.multiple.address,
      { execute: { proposal_id: proposalId } },
      fee,
    );
  }

  /**
   * submitSendProposal creates proposal to send funds from DAO core contract for given address.
   */
  async submitSendProposal(
    title: string,
    description: string,
    dest: { recipient: string; amount: number; denom: string }[],
    deposit = '',
  ): Promise<number> {
    const messages = dest.map((d) =>
      createBankSendMessage(d.recipient, d.amount, d.denom),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      messages,
      deposit,
    );
  }

  /**
   * submitParameterChangeProposal creates parameter change proposal.
   */
  async submitParameterChangeProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    subspace: string,
    key: string,
    value: string,
    deposit: string,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<number> {
    const message = paramChangeProposal(
      {
        title,
        description,
        subspace,
        key,
        value,
      },
      chainManagerAddress,
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
      'single',
      fee,
    );
  }

  /**
   * submitMultiChoiceSendProposal creates parameter change proposal with multiple choices.
   */
  async submitMultiChoiceSendProposal(
    choices: SendProposalInfo[],
    title: string,
    description: string,
    deposit: string,
  ): Promise<number> {
    const messages: MultiChoiceOption[] = choices.map((choice, idx) => ({
      title: 'choice' + idx,
      description: 'choice' + idx,
      msgs: [
        createBankSendMessage(choice.to, parseInt(choice.amount), choice.denom),
      ],
    }));
    return await this.submitMultiChoiceProposal(
      title,
      description,
      deposit,
      messages,
    );
  }

  /**
   * submitMultiChoiceParameterChangeProposal creates parameter change proposal with multiple choices.
   */
  async submitMultiChoiceParameterChangeProposal(
    chainManagerAddress: string,
    choices: ParamChangeProposalInfo[],
    title: string,
    description: string,
    deposit: string,
  ): Promise<number> {
    const messages: MultiChoiceOption[] = choices.map((choice, idx) => ({
      title: 'choice' + idx,
      description: 'choice' + idx,
      msgs: [paramChangeProposal(choice, chainManagerAddress)],
    }));
    return await this.submitMultiChoiceProposal(
      title,
      description,
      deposit,
      messages,
    );
  }

  /**
   * submitMultiChoiceProposal creates multi-choice proposal with given message.
   */
  async submitMultiChoiceProposal(
    title: string,
    description: string,
    deposit: string,
    options: MultiChoiceOption[],
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<number> {
    const proposalTx = await this.client.execute(
      this.user,
      this.dao.contracts.proposals.multiple.pre_propose.address,
      {
        propose: {
          msg: {
            propose: {
              title: title,
              description: description,
              choices: { options },
            },
          },
        },
      },
      fee,
      '',
      [{ denom: this.denom, amount: deposit }],
    );

    const attribute = getEventAttribute(
      proposalTx.events,
      'wasm',
      'proposal_id',
    );

    const proposalId = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          JSON.stringify(proposalTx.events),
      );
    }
    return proposalId;
  }

  /**
   * submitSoftwareUpgradeProposal creates proposal.
   */
  async submitSoftwareUpgradeProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    name: string,
    height: number,
    info: string,
    deposit: string,
  ): Promise<number> {
    const message = chainManagerWrapper(chainManagerAddress, {
      custom: {
        submit_admin_proposal: {
          admin_proposal: {
            proposal_execute_message: {
              message: JSON.stringify({
                '@type': '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade',
                authority: ADMIN_MODULE_ADDRESS,
                plan: {
                  name,
                  height,
                  info,
                },
              }),
            },
          },
        },
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }

  /**
   * submitCancelSoftwareUpgradeProposal creates proposal.
   */
  async submitCancelSoftwareUpgradeProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    deposit: string,
  ): Promise<number> {
    const message = chainManagerWrapper(chainManagerAddress, {
      custom: {
        submit_admin_proposal: {
          admin_proposal: {
            proposal_execute_message: {
              message: JSON.stringify({
                '@type': '/cosmos.upgrade.v1beta1.MsgCancelUpgrade',
                authority: 'neutron1hxskfdxpp5hqgtjj6am6nkjefhfzj359x0ar3z',
              }),
            },
          },
        },
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }
  /**
   * submitBankSendProposal creates proposal.
   */
  async submitBankSendProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    deposit: string,
  ): Promise<number> {
    const message = chainManagerWrapper(chainManagerAddress, {
      custom: {
        submit_admin_proposal: {
          admin_proposal: {
            proposal_execute_message: {
              message: JSON.stringify({
                '@type': '/cosmos.bank.v1beta1.MsgSend',
                from_address: ADMIN_MODULE_ADDRESS,
                to_address: ADMIN_MODULE_ADDRESS,
                amount: [],
              }),
            },
          },
        },
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }

  /**
   * submitFeeMarketChangeParamsProposal creates proposal.
   */
  async submitFeeMarketChangeParamsProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    deposit: string,
    params: FeeMarketParams,
  ): Promise<number> {
    const message = chainManagerWrapper(chainManagerAddress, {
      custom: {
        submit_admin_proposal: {
          admin_proposal: {
            proposal_execute_message: {
              message: JSON.stringify({
                '@type': '/feemarket.feemarket.v1.MsgParams',
                authority: ADMIN_MODULE_ADDRESS,
                params,
              }),
            },
          },
        },
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }

  /**
   * submitDynamicfeesChangeParamsProposal creates proposal.
   */
  async submitDynamicfeesChangeParamsProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    deposit: string,
    params: DynamicFeesParams,
  ): Promise<number> {
    const message = chainManagerWrapper(chainManagerAddress, {
      custom: {
        submit_admin_proposal: {
          admin_proposal: {
            proposal_execute_message: {
              message: JSON.stringify({
                '@type': '/neutron.dynamicfees.v1.MsgUpdateParams',
                authority: ADMIN_MODULE_ADDRESS,
                params,
              }),
            },
          },
        },
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }

  // TODO: move to neutron-integration-tests
  /**
   * @deprecated since version 0.5.0
   */
  async supportAndExecuteProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<TimeLockSingleChoiceProposal> {
    await this.voteYes(proposalId, customModule);
    await this.executeProposal(proposalId, customModule);
    return await this.dao.getTimelockedProposal(proposalId, customModule);
  }

  // TODO: description
  async executeTimelockedProposal(
    proposalId: number,
    customModule = 'single',
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    return this.client.execute(
      this.user,
      this.dao.contracts.proposals[customModule].pre_propose.timelock.address,
      {
        execute_proposal: {
          proposal_id: proposalId,
        },
      },
      fee,
    );
  }

  // TODO: optional: move to tests only functionality?
  /**
   * @deprecated since version 0.5.0
   */
  async overruleTimelockedProposal(
    timelockAddress: string,
    proposalId: number,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<ExecuteResult> {
    const overruleProposalId = await this.dao.getOverruleProposalId(
      timelockAddress,
      proposalId,
    );
    await this.client.execute(
      this.user,
      this.dao.contracts.proposals.overrule.address,
      {
        vote: { proposal_id: overruleProposalId, vote: 'yes' },
      },
      fee,
    );
    return await this.client.execute(
      this.user,
      this.dao.contracts.proposals.overrule.address,
      { execute: { proposal_id: overruleProposalId } },
      fee,
    );
  }

  /**
   * submitOverruleProposal tries to create overrule proposal.
   * Actually, it will always fail since even while creation of overrule proposals
   * is permissionless, there is no moment in time when user can do that.
   * The overrule proposal is created automatically when subdao proposal is timelocked
   * and there is no way to create it for non-timelocked proposal or create a duplicate.
   * Thus, this function is for testing purposes only.
   */
  async submitOverruleProposal(
    timelockAddress: string,
    proposalId: number,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<number> {
    const proposalTx = await this.client.execute(
      this.user,
      this.dao.contracts.proposals.overrule.pre_propose.address,
      {
        propose: {
          msg: {
            propose_overrule: {
              timelock_contract: timelockAddress,
              proposal_id: proposalId,
            },
          },
        },
      },
      fee,
    );

    const attribute = getEventAttribute(
      proposalTx.events,
      'wasm',
      'proposal_id',
    );

    const proposalId1 = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          JSON.stringify(proposalTx.events),
      );
    }
    return proposalId1;
  }

  // TODO: description
  async submitUpdateConfigProposal(
    title: string,
    description: string,
    config: SubdaoProposalConfig,
    deposit: string,
    customModule = 'single',
  ): Promise<number> {
    const msg = {
      update_config: config,
    };
    const message = {
      wasm: {
        execute: {
          contract_addr: this.dao.contracts.proposals[customModule].address,
          msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
          funds: [],
        },
      },
    };
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      deposit,
    );
  }

  // TODO: description
  async submitUpdateSubDaoConfigProposal(
    newConfig: {
      name?: string;
      description?: string;
      dao_uri?: string;
    },
    customModule = 'single',
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: this.dao.contracts.core.address,
          msg: wrapMsg({
            update_config: newConfig,
          }),
          funds: [],
        },
      },
    };

    return await this.submitSingleChoiceProposal(
      'update subDAO config',
      'sets subDAO config to new value',
      [message],
      '',
      customModule,
    );
  }

  // TODO: description
  async submitTypedPauseProposal(
    contractAddr: string,
    duration = 10,
    customModule = 'single',
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: contractAddr,
          msg: wrapMsg({
            pause: {
              duration: { time: duration },
            },
          }),
          funds: [],
        },
      },
    };

    return await this.submitSingleChoiceProposal(
      'pause proposal',
      'pauses contract',
      [message],
      '',
      customModule,
    );
  }

  // TODO: description
  async submitUntypedPauseProposal(
    contractAddr: string,
    duration = 10,
    customModule = 'single',
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: contractAddr,
          msg: wrapMsg({
            pause: {
              duration: duration,
            },
          }),
          funds: [],
        },
      },
    };

    return await this.submitSingleChoiceProposal(
      'pause proposal',
      'pauses contract',
      [message],
      '',
      customModule,
    );
  }

  // TODO: description
  async submitUntypedPauseProposalWFunds(
    contractAddr: string,
    duration = 10,
    customModule = 'single',
    denom = 'untrn',
    amount = '100',
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: contractAddr,
          msg: wrapMsg({
            pause: {
              duration: duration,
            },
          }),
          funds: [{ denom: denom, amount: amount }],
        },
      },
    };

    return await this.submitSingleChoiceProposal(
      'pause proposal',
      'pauses contract',
      [message],
      '',
      customModule,
    );
  }

  // TODO: description
  async submitUpdateSubDaoMultisigParticipants(
    newParticipants: string[],
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: (this.dao.contracts.voting as VotingCw4Module).cw4group
            .address,
          msg: wrapMsg({
            update_members: {
              remove: [],
              add: newParticipants.map((m) => ({
                addr: m,
                weight: 1,
              })),
            },
          }),
          funds: [],
        },
      },
    };

    return await this.submitSingleChoiceProposal(
      'update members',
      'update members',
      [message],
    );
  }

  /**
   * submitPinCodesProposal creates proposal which pins given code ids to wasmvm.
   */
  async submitPinCodesProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    codesIds: number[],
    amount: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      pinCodesProposal({
        title,
        description,
        codes_ids: codesIds,
      }),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitPinCodesCustomAuthorityProposal creates proposal which pins given code ids to wasmvm.
   */
  async submitPinCodesCustomAuthorityProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    codesIds: number[],
    amount: string,
    authority: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      pinCodesCustomAuthorityProposal(
        {
          title,
          description,
          codes_ids: codesIds,
        },
        authority,
      ),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitUnpinCodesProposal creates proposal which unpins given code ids to wasmvm.
   */
  async submitUnpinCodesProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    codesIds: number[],
    amount: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      unpinCodesProposal({
        title,
        description,
        codes_ids: codesIds,
      }),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitUpdateParamsInterchaintxsProposal creates proposal which changes params of interchaintxs module.
   */
  async submitUpdateParamsInterchaintxsProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsInterchaintxsInfo,
    amount: string,
  ): Promise<number> {
    const messageWrapped = {
      wasm: {
        execute: {
          contract_addr: chainManagerAddress,
          msg: Buffer.from(
            JSON.stringify({
              execute_messages: {
                messages: [message],
              },
            }),
          ).toString('base64'),
          funds: [],
        },
      },
    };
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [messageWrapped],
      amount,
    );
  }

  /**
   * submitUpdateParamsTransferProposal creates proposal which changes params of transfer module.
   */
  async submitUpdateParamsTransferProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsTransferInfo,
    amount: string,
  ): Promise<number> {
    const messageWrapped = {
      wasm: {
        execute: {
          contract_addr: chainManagerAddress,
          msg: Buffer.from(
            JSON.stringify({
              execute_messages: {
                messages: [message],
              },
            }),
          ).toString('base64'),
          funds: [],
        },
      },
    };
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [messageWrapped],
      amount,
    );
  }

  // TODO: description
  async submitUpdateParamsGlobalfeeProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsGlobalfeeInfo,
    amount: string,
    fee = {
      gas: '4000000',
      amount: [{ denom: this.denom, amount: '10000' }],
    },
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
      'single',
      fee,
    );
  }

  /**
   * submitUpdateParamsInterchainqueriesProposal creates proposal which changes params of interchaintxs module.
   */
  async submitUpdateParamsInterchainqueriesProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsInterchainqueriesInfo,
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  // TODO: description
  async submitAddChainManagerStrategyProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    strategy: any,
    amount: string,
  ): Promise<number> {
    const message = {
      wasm: {
        execute: {
          contract_addr: chainManagerAddress,
          msg: Buffer.from(JSON.stringify(strategy)).toString('base64'),
          funds: [],
        },
      },
    };
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitUpdateParamsTokenfactoryProposal creates proposal which changes params of tokenfactory module.
   */
  async submitUpdateParamsTokenfactoryProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsTokenfactoryInfo,
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  /**
   * submitUpdateParamsFeeburnerProposal creates proposal which changes some params of feeburner module.
   */
  async submitUpdateParamsFeeburnerProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsFeeburnerInfo,
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  /**
   * submitUpdateParamsFeerefunderProposal creates proposal which changes some params of feerefunder module.
   */
  async submitUpdateParamsFeerefunderProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsFeerefunderInfo = {
      min_fee: { recv_fee: null, ack_fee: null, timeout_fee: null },
    },
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  /**
   * submitUpdateParamsCronProposal creates proposal which changes soe params of cron module.
   */
  async submitUpdateParamsCronProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsCronInfo,
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  /**
   * submitUpdateParamsContractmanagerProposal creates proposal which changes some params of contractmanager module.
   */
  async submitUpdateParamsContractmanagerProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsContractmanagerInfo,
    amount: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [chainManagerWrapper(chainManagerAddress, message)],
      amount,
    );
  }

  /**
   * submitClientUpdateProposal creates proposal which updates client.
   */
  async submitClientUpdateProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    subjectClientId: string,
    substituteClientId: string,
    amount: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      clientUpdateProposal({
        title,
        description,
        subject_client_id: subjectClientId,
        substitute_client_id: substituteClientId,
      }),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitUpgradeProposal creates proposal which upgrades ibc.
   */
  async submitUpgradeProposal(
    title: string,
    description: string,
    name: string,
    height: number,
    info: string,
    amount: string,
  ): Promise<number> {
    const message = upgradeProposal({
      title,
      description,
      name,
      height,
      info,
      upgraded_client_state: {
        type_url: ClientState.typeUrl,
        value: Buffer.from(JSON.stringify({})).toString('base64'),
      },
    });
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitUpdateAminProposal creates proposal which updates an admin of a contract.
   */
  async submitUpdateAdminProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    sender: string,
    contract: string,
    newAdmin: string,
    amount: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      updateAdminProposal({
        sender,
        contract,
        new_admin: newAdmin,
      }),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitClearAdminProposal creates proposal which removes an admin of a contract.
   */
  async submitClearAdminProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    sender: string,
    contract: string,
    amount: string,
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      clearAdminProposal({ sender, contract }),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitAddSchedule creates proposal to add new schedule.
   */
  async submitAddSchedule(
    chainManagerAddress: string,
    title: string,
    description: string,
    amount: string,
    name: string,
    period: number,
    msgs: any[],
  ): Promise<number> {
    const message = chainManagerWrapper(
      chainManagerAddress,
      addSchedule(name, period, msgs),
    );
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
    );
  }

  /**
   * submitRemoveSchedule creates proposal to remove added schedule.
   */
  async submitRemoveSchedule(
    chainManagerAddress: string,
    title: string,
    description: string,
    amount: string,
    name: string,
    customModule = 'single',
    wrapForChainManager = true,
  ): Promise<number> {
    // This ugly piece of code is required because we are not going
    // to remove the security address functionality from the cron module
    // when upgrading the dao to support privileged subdaos. In the future,
    // the security address functionality should be removed from the cron
    // module, and the permission to remove schedules should be given to
    // the privileged cron subdao through the chain manager contract.
    // TODO(pr0n00gler).
    let message: any;
    if (wrapForChainManager) {
      message = chainManagerWrapper(chainManagerAddress, removeSchedule(name));
    } else {
      message = removeSchedule(name);
    }
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [message],
      amount,
      customModule,
    );
  }

  /**
   * submitRecoverClient creates proposal to recover IBC client.
   */
  async submitRecoverIBCClient(
    chainManagerAddress: string,
    title: string,
    description: string,
    subjectClientId: string,
    substituteClientId: string,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [
        chainManagerWrapper(chainManagerAddress, {
          custom: {
            submit_admin_proposal: {
              admin_proposal: {
                proposal_execute_message: {
                  message: JSON.stringify({
                    '@type': '/ibc.core.client.v1.MsgRecoverClient',
                    signer: ADMIN_MODULE_ADDRESS,
                    subject_client_id: subjectClientId,
                    substitute_client_id: substituteClientId,
                  }),
                },
              },
            },
          },
        }),
      ],
      '1000',
    );
  }

  /**
   * submitCreateMarketMap creates proposal to create market map.
   */
  async submitCreateMarketMap(
    chainManagerAddress: string,
    title: string,
    description: string,
    newMarkets: NewMarkets,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [
        chainManagerWrapper(chainManagerAddress, {
          custom: {
            submit_admin_proposal: {
              admin_proposal: {
                proposal_execute_message: {
                  message: JSON.stringify({
                    '@type': '/slinky.marketmap.v1.MsgCreateMarkets',
                    authority: ADMIN_MODULE_ADDRESS,
                    create_markets: newMarkets,
                  }),
                },
              },
            },
          },
        }),
      ],
      '1000',
    );
  }

  /**
   * submitUpdateMarketMap creates proposal to update market map.
   */
  async submitUpdateMarketMap(
    chainManagerAddress: string,
    title: string,
    description: string,
    newMarkets: NewMarkets,
  ): Promise<number> {
    return await this.submitSingleChoiceProposal(
      title,
      description,
      [
        chainManagerWrapper(chainManagerAddress, {
          custom: {
            submit_admin_proposal: {
              admin_proposal: {
                proposal_execute_message: {
                  message: JSON.stringify({
                    '@type': '/slinky.marketmap.v1.MsgUpdateMarkets',
                    authority: ADMIN_MODULE_ADDRESS,
                    update_markets: newMarkets,
                  }),
                },
              },
            },
          },
        }),
      ],
      '1000',
    );
  }

  // TODO: description
  async queryVotingPower(
    height?: number,
  ): Promise<VotingPowerAtHeightResponse> {
    return await this.dao.queryVotingPower(this.user, height);
  }
}

export const getNeutronDAOCore = async (
  client: CosmWasmClient,
  rpcClient: ProtobufRpcClient,
) => {
  const queryClient = new AdminQueryClient(rpcClient);
  const admins = await queryClient.Admins();
  const chainManager = admins.admins[0];
  const strategies = await client.queryContractSmart(chainManager, {
    strategies: {},
  });
  return strategies[0][0];
};

export const DaoContractLabels = {
  DAO_CORE: 'neutron.core',
  NEUTRON_VAULT: 'neutron.voting.vaults.neutron',
  LOCKDROP_VAULT: 'neutron.voting.vaults.lockdrop',
  TREASURY: 'treasury',
  DISTRIBUTION: 'distribution',
  DAO_PRE_PROPOSAL_SINGLE: 'neutron.proposals.single.pre_propose',
  DAO_PRE_PROPOSAL_MULTIPLE: 'neutron.proposals.multiple.pre_propose',
  DAO_PRE_PROPOSAL_OVERRULE: 'neutron.proposals.overrule.pre_propose',
  DAO_VOTING_REGISTRY: 'neutron.voting',
  DAO_PROPOSAL_SINGLE: 'neutron.proposals.single',
  DAO_PROPOSAL_MULTIPLE: 'neutron.proposals.multiple',
  DAO_PROPOSAL_OVERRULE: 'neutron.proposals.overrule',
};

export const wrapMsg = (x) => Buffer.from(JSON.stringify(x)).toString('base64');
