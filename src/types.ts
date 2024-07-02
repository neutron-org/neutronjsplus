import {
  ParamsContractmanagerInfo,
  ParamsCronInfo,
  ParamsFeeburnerInfo,
  ParamsFeerefunderInfo,
  ParamsInterchainqueriesInfo,
  ParamsTokenfactoryInfo,
} from './proposal';
import {
  AccountData,
  Coin,
  DirectSecp256k1HdWallet,
} from '@cosmjs/proto-signing';

export type AcknowledgementResult =
  | { success: string[] }
  | { error: string[] }
  | { timeout: string };

export type ChannelsList = {
  channels: {
    state: string;
    ordering: string;
    counterparty: {
      port_id: string;
      channel_id: string;
    };
    connection_hops: string[];
    version: string;
    port_id: string;
    channel_id: string;
  }[];
};

export type IBCClientStatus = {
  status: string;
};

// SingleChoiceProposal represents a single governance proposal item (partial object).
export type SingleChoiceProposal = {
  readonly title: string;
  readonly description: string;
  /// The address that created this proposal.
  readonly proposer: string;
  /// The block height at which this proposal was created. Voting
  /// power queries should query for voting power at this block
  /// height.
  readonly start_height: number;
  /// The threshold at which this proposal will pass.
  /// proposal's creation.
  readonly total_power: string;
  readonly proposal: {
    status:
      | 'open'
      | 'rejected'
      | 'passed'
      | 'executed'
      | 'closed'
      | 'execution_failed';
    readonly votes: {
      yes: string;
      no: string;
      abstain: string;
    };
  };
};

export type TotalPowerAtHeightResponse = {
  readonly height: string;
  readonly power: number;
};

export type VotingPowerAtHeightResponse = {
  readonly height: string;
  readonly power: number;
};

// PageRequest is the params of pagination for request
export type PageRequest = {
  'pagination.key'?: string;
  'pagination.offset'?: string;
  'pagination.limit'?: string;
  'pagination.count_total'?: boolean;
};

// AckFailuresResponse is the response model for the contractmanager failures.
export type AckFailuresResponse = {
  failures: Failure[];
  pagination: {
    next_key: string;
    total: string;
  };
};

// Failure represents a single contractmanager failure
type Failure = {
  address: string;
  id: string;
  sudo_payload: string; // base64 encoded json bytes
};

export type ScheduleResponse = {
  schedules: Schedule[];
  pagination: {
    next_key: string;
    total: string;
  };
};

// Schedule represents a single cron added schedule
type Schedule = {
  name: string;
  period: number;
  msgs: any[];
};

export type PauseInfoResponse = {
  paused: {
    until_height: number;
  };
  unpaused: Record<string, never>;
};

// Strategy defines a permission strategy in the chain manager.
export type Strategy = any;

/**
 * @deprecated since version 0.5.0
 */
export const NeutronContract = {
  IBC_TRANSFER: 'ibc_transfer.wasm',
  MSG_RECEIVER: 'msg_receiver.wasm',
  STARGATE_QUERIER: 'stargate_querier.wasm',
  INTERCHAIN_QUERIES: 'neutron_interchain_queries.wasm',
  INTERCHAIN_TXS: 'neutron_interchain_txs.wasm',
  REFLECT: 'reflect.wasm',
  DISTRIBUTION: 'neutron_distribution.wasm',
  DAO_CORE: 'cwd_core.wasm',
  DAO_PROPOSAL_SINGLE: 'cwd_proposal_single.wasm',
  DAO_PROPOSAL_MULTI: 'cwd_proposal_multiple.wasm',
  DAO_PREPROPOSAL_SINGLE: 'cwd_pre_propose_single.wasm',
  DAO_PREPROPOSAL_MULTI: 'cwd_pre_propose_multiple.wasm',
  DAO_PREPROPOSAL_OVERRULE: 'cwd_pre_propose_overrule.wasm',
  VOTING_REGISTRY: 'neutron_voting_registry.wasm',
  NEUTRON_VAULT: 'neutron_vault.wasm',
  RESERVE: 'neutron_reserve.wasm',
  SUBDAO_CORE: 'cwd_subdao_core.wasm',
  SUBDAO_PREPROPOSE: 'cwd_subdao_pre_propose_single.wasm',
  SUBDAO_PREPROPOSE_NO_TIMELOCK: 'cwd_security_subdao_pre_propose.wasm',
  SUBDAO_PROPOSAL: 'cwd_subdao_proposal_single.wasm',
  SUBDAO_TIMELOCK: 'cwd_subdao_timelock_single.wasm',
  LOCKDROP_VAULT: 'lockdrop_vault.wasm',
  ORACLE_HISTORY: 'astroport_oracle.wasm',
  TGE_CREDITS: 'credits.wasm',
  TGE_AIRDROP: 'cw20_merkle_airdrop.wasm',
  CW4_VOTING: '../contracts_thirdparty/cw4_voting.wasm',
  CW4_GROUP: '../contracts_thirdparty/cw4_group.wasm',
  CW20_BASE: '../contracts_thirdparty/cw20_base.wasm',
  TGE_AUCTION: 'neutron_auction.wasm',
  TGE_LOCKDROP: 'neutron_lockdrop.wasm',
  TGE_LOCKDROP_PCL: 'neutron_lockdrop_pcl.wasm',
  TGE_PRICE_FEED_MOCK: 'neutron_price_feed_mock.wasm',
  ASTRO_PAIR_XYK: '../contracts_thirdparty/astroport_pair.wasm',
  ASTRO_PAIR_PCL: '../contracts_thirdparty/astroport_pair_concentrated.wasm',
  ASTRO_COIN_REGISTRY:
    '../contracts_thirdparty/astroport_native_coin_registry.wasm',
  ASTRO_FACTORY: '../contracts_thirdparty/astroport_factory.wasm',
  ASTRO_TOKEN: '../contracts_thirdparty/astroport_xastro_token.wasm',
  ASTRO_GENERATOR: '../contracts_thirdparty/astroport_generator.wasm',
  ASTRO_INCENTIVES: '../contracts_thirdparty/astroport_incentives.wasm',
  ASTRO_WHITELIST: '../contracts_thirdparty/astroport_whitelist.wasm',
  ASTRO_VESTING: '../contracts_thirdparty/astroport_vesting.wasm',
  VESTING_LP_PCL: 'vesting_lp_pcl.wasm',
  VESTING_LP: 'vesting_lp.wasm',
  VESTING_LP_VAULT: 'vesting_lp_vault.wasm',
  CREDITS_VAULT: 'credits_vault.wasm',
  VESTING_INVESTORS: 'vesting_investors.wasm',
  INVESTORS_VESTING_VAULT: 'investors_vesting_vault.wasm',
  TOKENFACTORY: 'tokenfactory.wasm',
  BEFORE_SEND_HOOK_TEST: 'before_send_hook_test.wasm',
  // https://github.com/CosmWasm/cosmwasm/tree/main/contracts/floaty
  FLOATY: '../contracts_thirdparty/floaty_2.0.wasm',
  DEX_STARGATE: 'dex_stargate.wasm',
  DEX_DEV: 'dex.wasm',

  // TGE liquidity migration related contracts with fixed versions

  // pre-migration mainnet version of the lockdrop contract
  TGE_LOCKDROP_CURRENT:
    '../contracts_tge_migration/current_neutron_lockdrop.wasm',
  // pre-migration mainnet version of the vesting lp contract
  VESTING_LP_CURRENT: '../contracts_tge_migration/current_vesting_lp.wasm',
  // pre-migration mainnet version of the reserve contract
  RESERVE_CURRENT: '../contracts_tge_migration/current_neutron_reserve.wasm',

  VESTING_LP_VAULT_CL: 'vesting_lp_vault_for_cl_pools.wasm',
  LOCKDROP_VAULT_CL: 'lockdrop_vault_for_cl_pools.wasm',
  MARKETMAP: 'marketmap.wasm',
  ORACLE: 'oracle.wasm',
};

export type MultiChoiceOption = {
  title: string;
  description: string;
  msgs: any[];
};

// https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/upgrade/v1beta1/query.proto#L53
export type CurrentPlanResponse = {
  plan: Plan | null;
};

// https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/upgrade/v1beta1/upgrade.proto#L14
export type Plan = {
  name: string;
  height: string;
  info: string;
};

export const nativeToken = (denom: string, amount: string): Asset => ({
  info: nativeTokenInfo(denom),
  amount: amount,
});

export const token = (contractAddr: string, amount: string): Asset => ({
  info: tokenInfo(contractAddr),
  amount: amount,
});

export const nativeTokenInfo = (denom: string): NativeToken => ({
  native_token: {
    denom: denom,
  },
});

export const tokenInfo = (contractAddr: string): Token => ({
  token: {
    contract_addr: contractAddr,
  },
});

export const vestingAccount = (
  addr: string,
  schedules: VestingSchedule[],
): VestingAccount => ({
  address: addr,
  schedules: schedules,
});

export const vestingSchedule = (
  startPoint: VestingSchedulePoint,
  endPoint?: VestingSchedulePoint,
): VestingSchedule => ({
  start_point: startPoint,
  end_point: endPoint,
});

export const vestingSchedulePoint = (
  time: number,
  amount: string,
): VestingSchedulePoint => ({
  time: time,
  amount: amount,
});

export type PoolStatus = {
  assets: Asset[];
  total_share: string;
};

export type Asset = {
  info: Token | NativeToken;
  amount: string;
};

export type Token = {
  token: {
    contract_addr: string;
  };
};

export type NativeToken = {
  native_token: {
    denom: string;
  };
};

export type VestingAccount = {
  address: string;
  schedules: VestingSchedule[];
};

export type VestingSchedule = {
  start_point: VestingSchedulePoint;
  end_point: VestingSchedulePoint | undefined;
};

export type VestingSchedulePoint = {
  time: number;
  amount: string;
};

export type PinnedCodesResponse = {
  code_ids: number[];
};

export type IcaHostParamsResponse = {
  params: {
    host_enabled: boolean;
  };
};

export type TransferParamsResponse = {
  params: {
    send_enabled: boolean;
    receive_enabled: boolean;
  };
};

export type InterchainqueriesParamsResponse = {
  params: {
    query_submit_timeout: number;
    tx_query_removal_limit: number;
  };
};

export type InterchaintxsParamsResponse = {
  params: {
    msg_submit_tx_max_messages: string;
  };
};

export type GlobalfeeParamsResponse = {
  minimum_gas_prices: Coin[];
  bypass_min_fee_msg_types: string[];
  max_total_bypass_min_fee_msg_gas_usage: string;
};

export type ContractAdminResponse = {
  contract_info: {
    admin: string;
  };
};

export type ParamsContractmanagerResponse = {
  params: ParamsContractmanagerInfo;
};

export type ParamsCronResponse = {
  params: ParamsCronInfo;
};

export type ParamsFeerefunderResponse = {
  params: ParamsFeerefunderInfo;
};

export type ParamsFeeburnerResponse = {
  params: ParamsFeeburnerInfo;
};

export type ParamsTokenfactoryResponse = {
  params: ParamsTokenfactoryInfo;
};
export type ParamsInterchainqueriesResponse = {
  params: ParamsInterchainqueriesInfo;
};

export class Wallet {
  addrPrefix: string;
  directwallet: DirectSecp256k1HdWallet;
  account: AccountData;
  address: string;
  valAddress: string;
  constructor(
    addrPrefix: string,
    directwallet: DirectSecp256k1HdWallet,
    account: AccountData,
    valAccount: AccountData,
  ) {
    this.addrPrefix = addrPrefix;
    this.directwallet = directwallet;
    this.account = account;
    this.address = this.account.address;
    this.valAddress = valAccount.address;
  }
}

export type CodeId = number;

// DenomTraceResponse is the response model for the ibc transfer denom trace query.
// TODO: use rpc authogeneration
/**
 * @deprecated since version 0.5.0
 */
export type DenomTraceResponse = {
  path?: string;
  base_denom?: string;
};

// TODO: use rpc authogeneration
/**
 * @deprecated since version 0.5.0
 */
export type TotalSupplyByDenomResponse = {
  amount: Coin;
};

// TODO: use rpc authogeneration
/**
 * @deprecated since version 0.5.0
 */
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

// TODO: use rpc authogeneration
/**
 * @deprecated since version 0.5.0
 */
// TotalBurnedNeutronsAmountResponse is the response model for the feeburner's total-burned-neutrons.
export type TotalBurnedNeutronsAmountResponse = {
  total_burned_neutrons_amount: {
    coin: Coin;
  };
};
