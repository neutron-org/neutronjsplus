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

export type TimelockConfig = {
  owner: string;
  overrule_pre_propose: string;
  subdao: string;
};
