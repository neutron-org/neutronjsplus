import axios from 'axios';
import {
  ADMIN_MODULE_ADDRESS,
  CosmosWrapper,
  createBankSendMessage,
  getEventAttribute,
  packAnyMsg,
  WalletWrapper,
  wrapMsg,
} from './cosmos';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/cjs/openapi/api';
import { getWithAttempts } from './wait';
import {
  MultiChoiceOption,
  NeutronContract,
  SingleChoiceProposal,
  TotalPowerAtHeightResponse,
  VotingPowerAtHeightResponse,
} from './types';
import {
  addSchedule,
  addSubdaoProposal,
  chainManagerWrapper,
  clearAdminProposal,
  clientUpdateProposal,
  paramChangeProposal,
  ParamChangeProposalInfo,
  ParamsContractmanagerInfo,
  ParamsCronInfo,
  ParamsDexInfo,
  ParamsFeeburnerInfo,
  ParamsFeerefunderInfo,
  ParamsGlobalfeeInfo,
  ParamsInterchainqueriesInfo,
  ParamsInterchaintxsInfo,
  ParamsTokenfactoryInfo, ParamsTransferInfo,
  pinCodesCustomAuthorityProposal,
  pinCodesProposal,
  removeSchedule,
  SendProposalInfo,
  unpinCodesProposal,
  updateAdminProposal,
  upgradeProposal,
} from './proposal';
import Long from 'long';
import { ClientState } from './proto/neutron_thirdparty/ibc/lightclients/tendermint/v1/tendermint_pb';
import { DynamicFeesParams, FeeMarketParams } from './feemarket';

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

export const getVotingModule = async (
  cm: CosmosWrapper,
  daoAddress: string,
): Promise<string> =>
  await cm.queryContract<string>(daoAddress, {
    voting_module: {},
  });

export const getVotingVaults = async (
  cm: CosmosWrapper,
  votingModuleAddress: string,
): Promise<VotingVaultsModule['vaults']> => {
  const votingVaults = await cm.queryContract<
    [{ address: string; name: string }]
  >(votingModuleAddress, { voting_vaults: {} });
  let ntrnVaultAddress;
  let lockdropVaultAddress;
  for (const vault of votingVaults) {
    const vaultContractInfo = await cm.getContractInfo(vault.address);

    switch (vaultContractInfo['contract_info']['label']) {
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
  cm: CosmosWrapper,
  daoAddress: string,
): Promise<DaoContracts['proposals']> => {
  const proposalModules = await cm.queryContract<{ address: string }[]>(
    daoAddress,
    { proposal_modules: {} },
  );

  const proposalsStructure: DaoContracts['proposals'] = {};

  for (const proposalModule of proposalModules) {
    const proposalContractInfo = await cm.getContractInfo(
      proposalModule.address,
    );
    const preProposalContract = await cm.queryContract<{
      Module: { addr: string };
    }>(proposalModule.address, { proposal_creation_policy: {} });
    const modulePath =
      proposalContractInfo['contract_info']['label'].split('.');
    const moduleType = modulePath.at(-1);

    const preProposeModule: ProposalModule['pre_propose'] = {
      address: preProposalContract.Module.addr,
    };

    try {
      const timelockAddr = await cm.queryContract<string>(
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
  cm: CosmosWrapper,
  daoAddress: string,
): Promise<DaoContracts> => {
  const config = await cm.queryContract<{ name: string }>(daoAddress, {
    config: {},
  });

  const votingModuleAddress = await getVotingModule(cm, daoAddress);
  const votingVaults = await getVotingVaults(cm, votingModuleAddress);
  const proposalsStructure = await getProposalModules(cm, daoAddress);

  const subdaosList = await cm.queryContract<{ addr: string }[]>(daoAddress, {
    list_sub_daos: {},
  });

  const subdaos = {};
  for (const subdao of subdaosList) {
    const subDaoContracts = await getSubDaoContracts(cm, subdao.addr);
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
  cm: CosmosWrapper,
  daoAddress: string,
): Promise<DaoContracts> => {
  const config = await cm.queryContract<{ name: string }>(daoAddress, {
    config: {},
  });

  const votingModuleAddress = await cm.queryContract<string>(daoAddress, {
    voting_module: {},
  });
  const cw4GroupAddress = await cm.queryContract<string>(votingModuleAddress, {
    group_contract: {},
  });

  const proposalsStructure = await getProposalModules(cm, daoAddress);

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

export const getTreasuryContract = async (
  cm: CosmosWrapper,
): Promise<string> => {
  const url = `${cm.sdk.url}/neutron/feeburner/params`;
  const resp = await axios.get<{
    params: { treasury_address: string };
  }>(url);
  return resp.data.params.treasury_address;
};

export class Dao {
  readonly chain: CosmosWrapper;
  readonly contracts: DaoContracts;

  constructor(cm: CosmosWrapper, contracts: DaoContracts) {
    this.chain = cm;
    this.contracts = contracts;
  }

  async checkPassedProposal(proposalId: number) {
    await getWithAttempts(
      this.chain.blockWaiter,
      async () => await this.queryProposal(proposalId),
      async (response) => response.proposal.status === 'passed',
      20,
    );
  }

  async checkPassedMultiChoiceProposal(proposalId: number) {
    await getWithAttempts(
      this.chain.blockWaiter,
      async () => await this.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'passed',
      20,
    );
  }

  async checkExecutedMultiChoiceProposal(proposalId: number) {
    await getWithAttempts(
      this.chain.blockWaiter,
      async () => await this.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  async queryMultiChoiceProposal(proposalId: number): Promise<any> {
    return await this.chain.queryContract<any>(
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
    return await this.chain.queryContract<SingleChoiceProposal>(
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
    return await this.chain.queryContract<SingleChoiceProposal>(
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
    return await this.chain.queryContract<TotalPowerAtHeightResponse>(
      this.contracts.core.address,
      {
        total_power_at_height:
          typeof height === 'undefined' ? {} : { height: height },
      },
    );
  }

  async queryVotingPower(
    addr: string,
    height?: number,
  ): Promise<VotingPowerAtHeightResponse> {
    return await this.chain.queryContract<VotingPowerAtHeightResponse>(
      this.contracts.core.address,
      {
        voting_power_at_height:
          typeof height === 'undefined'
            ? {
                address: addr,
              }
            : {
                address: addr,
                height: height,
              },
      },
    );
  }

  async makeSingleChoiceProposalPass(
    loyalVoters: DaoMember[],
    title: string,
    description: string,
    msgs: any[],
    deposit: string,
  ) {
    const proposalId = await loyalVoters[0].submitSingleChoiceProposal(
      title,
      description,
      msgs,
      deposit,
    );
    await loyalVoters[0].user.chain.blockWaiter.waitBlocks(1);

    for (const voter of loyalVoters) {
      await voter.voteYes(proposalId);
    }
    await loyalVoters[0].executeProposal(proposalId);

    await getWithAttempts(
      loyalVoters[0].user.chain.blockWaiter,
      async () => await this.queryProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  async getTimelockedProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<TimeLockSingleChoiceProposal> {
    return this.chain.queryContract<TimeLockSingleChoiceProposal>(
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
    return this.chain.queryContract<ProposalFailedExecutionErrorResponse>(
      this.contracts.proposals[customModule].pre_propose.timelock.address,
      {
        proposal_execution_error: {
          proposal_id: proposalId,
        },
      },
    );
  }

  async getSubDaoList(): Promise<string[]> {
    const res = await this.chain.queryContract<{ addr: string }[]>(
      this.contracts.core.address,
      {
        list_sub_daos: {},
      },
    );
    return res.map((x) => x.addr);
  }

  async querySubDao(subdaoAddress: string): Promise<GetSubdaoResponse> {
    return this.chain.queryContract<GetSubdaoResponse>(
      this.contracts.core.address,
      {
        get_sub_dao: {
          address: subdaoAddress,
        },
      },
    );
  }

  async getOverruleProposalId(
    timelockAddress: string,
    subdaoProposalId: number,
  ): Promise<number> {
    return await this.chain.queryContract<number>(
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
}

export class DaoMember {
  readonly user: WalletWrapper;
  readonly dao: Dao;

  constructor(cm: WalletWrapper, dao: Dao) {
    this.user = cm;
    this.dao = dao;
  }

  /**
   * voteYes  vote 'yes' for given proposal.
   */
  async voteYes(
    proposalId: number,
    customModule = 'single',
    fee = {
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
    },
  ): Promise<BroadcastTx200ResponseTxResponse> {
    return await this.user.executeContract(
      this.dao.contracts.proposals[customModule].address,
      JSON.stringify({ vote: { proposal_id: proposalId, vote: 'yes' } }),
      [],
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
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
    },
  ): Promise<BroadcastTx200ResponseTxResponse> {
    return await this.user.executeContract(
      this.dao.contracts.proposals[customModule].address,
      JSON.stringify({ vote: { proposal_id: proposalId, vote: 'no' } }),
      [],
      fee,
    );
  }

  /**
   * voteForOption  vote for option for given multi choice proposal.
   */
  async voteForOption(
    proposalId: number,
    optionId: number,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    return await this.user.executeContract(
      this.dao.contracts.proposals.multiple.address,
      JSON.stringify({
        vote: { proposal_id: proposalId, vote: { option_id: optionId } },
      }),
    );
  }

  async bondFunds(amount: string): Promise<BroadcastTx200ResponseTxResponse> {
    const vaultAddress = (this.dao.contracts.voting as VotingVaultsModule)
      .vaults.neutron.address;
    return await this.user.executeContract(
      vaultAddress,
      JSON.stringify({
        bond: {},
      }),
      [{ denom: this.user.chain.denom, amount: amount }],
    );
  }

  async unbondFunds(amount: string): Promise<BroadcastTx200ResponseTxResponse> {
    const vaultAddress = (this.dao.contracts.voting as VotingVaultsModule)
      .vaults.neutron.address;
    return await this.user.executeContract(
      vaultAddress,
      JSON.stringify({
        unbond: { amount: amount },
      }),
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
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
    },
  ): Promise<number> {
    let depositFunds = [];
    if (deposit !== '') {
      depositFunds = [{ denom: this.user.chain.denom, amount: deposit }];
    }
    const proposalTx = await this.user.executeContract(
      this.dao.contracts.proposals[customModule].pre_propose.address,
      JSON.stringify({
        propose: {
          msg: {
            propose: {
              title: title,
              description: description,
              msgs,
            },
          },
        },
      }),
      depositFunds,
      fee,
    );

    const attribute = getEventAttribute(
      (proposalTx as any).events,
      'wasm',
      'proposal_id',
    );

    const proposalId = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          proposalTx.raw_log,
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
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
    },
  ): Promise<BroadcastTx200ResponseTxResponse> {
    return await this.user.executeContract(
      this.dao.contracts.proposals[customModule].address,
      JSON.stringify({ execute: { proposal_id: proposalId } }),
      [],
      fee,
    );
  }

  async executeProposalWithAttempts(
    proposalId: number,
    fee = {
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
    },
  ) {
    await this.executeProposal(proposalId, 'single', fee);
    await getWithAttempts(
      this.user.chain.blockWaiter,
      async () => await this.dao.queryProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  async executeMultiChoiceProposalWithAttempts(proposalId: number) {
    await this.executeMultiChoiceProposal(proposalId);
    await getWithAttempts(
      this.user.chain.blockWaiter,
      async () => await this.dao.queryMultiChoiceProposal(proposalId),
      async (response) => response.proposal.status === 'executed',
      20,
    );
  }

  /**
   * executeMultiChoiceProposal executes given multichoice proposal.
   */
  async executeMultiChoiceProposal(proposalId: number): Promise<any> {
    return await this.user.executeContract(
      this.dao.contracts.proposals.multiple.address,
      JSON.stringify({ execute: { proposal_id: proposalId } }),
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
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
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
  ): Promise<number> {
    const proposalTx = await this.user.executeContract(
      this.dao.contracts.proposals.multiple.pre_propose.address,
      JSON.stringify({
        propose: {
          msg: {
            propose: {
              title: title,
              description: description,
              choices: { options },
            },
          },
        },
      }),
      [{ denom: this.user.chain.denom, amount: deposit }],
    );

    const attribute = getEventAttribute(
      (proposalTx as any).events,
      'wasm',
      'proposal_id',
    );

    const proposalId = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          proposalTx.raw_log,
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

  async supportAndExecuteProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<TimeLockSingleChoiceProposal> {
    await this.voteYes(proposalId, customModule);
    await this.executeProposal(proposalId, customModule);
    return await this.dao.getTimelockedProposal(proposalId, customModule);
  }

  async executeTimelockedProposal(
    proposalId: number,
    customModule = 'single',
  ): Promise<BroadcastTx200ResponseTxResponse> {
    return this.user.executeContract(
      this.dao.contracts.proposals[customModule].pre_propose.timelock.address,
      JSON.stringify({
        execute_proposal: {
          proposal_id: proposalId,
        },
      }),
    );
  }

  async overruleTimelockedProposal(
    timelockAddress: string,
    proposalId: number,
  ): Promise<BroadcastTx200ResponseTxResponse> {
    const overruleProposalId = await this.dao.getOverruleProposalId(
      timelockAddress,
      proposalId,
    );
    await this.user.executeContract(
      this.dao.contracts.proposals.overrule.address,
      JSON.stringify({
        vote: { proposal_id: overruleProposalId, vote: 'yes' },
      }),
    );
    return await this.user.executeContract(
      this.dao.contracts.proposals.overrule.address,
      JSON.stringify({ execute: { proposal_id: overruleProposalId } }),
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
  ): Promise<number> {
    const proposalTx = await this.user.executeContract(
      this.dao.contracts.proposals.overrule.pre_propose.address,
      JSON.stringify({
        propose: {
          msg: {
            propose_overrule: {
              timelock_contract: timelockAddress,
              proposal_id: proposalId,
            },
          },
        },
      }),
    );

    const attribute = getEventAttribute(
      (proposalTx as any).events,
      'wasm',
      'proposal_id',
    );

    const proposalId1 = parseInt(attribute);
    if (proposalId < 0) {
      throw new Error(
        'failed to get proposal ID from the proposal creation tx attributes: ' +
          proposalTx.raw_log,
      );
    }
    return proposalId1;
  }

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

  async submitUpdateParamsGlobalfeeProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsGlobalfeeInfo,
    amount: string,
    fee = {
      gas_limit: Long.fromString('4000000'),
      amount: [{ denom: this.user.chain.denom, amount: '10000' }],
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
   * submitUpdateParamsDexProposal creates proposal which changes soe params of dex module.
   */

  async submitUpdateParamsDexProposal(
    chainManagerAddress: string,
    title: string,
    description: string,
    message: ParamsDexInfo,
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
      upgraded_client_state: packAnyMsg(
        '/ibc.lightclients.tendermint.v1.ClientState',
        new ClientState({}),
      ),
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

  async queryVotingPower(
    height?: number,
  ): Promise<VotingPowerAtHeightResponse> {
    return await this.dao.queryVotingPower(
      this.user.wallet.address.toString(),
      height,
    );
  }

  async addSubdaoToDao(subDaoCore: string) {
    const p = await this.submitSingleChoiceProposal(
      'add subdao',
      '',
      [addSubdaoProposal(this.dao.contracts.core.address, subDaoCore)],
      '1000',
    );
    await this.voteYes(p);
    await this.executeProposalWithAttempts(p);
  }
}

export const deploySubdao = async (
  cm: WalletWrapper,
  mainDaoCoreAddress: string,
  overrulePreProposeAddress: string,
  securityDaoAddr: string,
  closeProposalOnExecutionFailure = true,
): Promise<Dao> => {
  const coreCodeId = await cm.storeWasm(NeutronContract.SUBDAO_CORE);
  const cw4VotingCodeId = await cm.storeWasm(NeutronContract.CW4_VOTING);
  const cw4GroupCodeId = await cm.storeWasm(NeutronContract.CW4_GROUP);
  const proposeCodeId = await cm.storeWasm(NeutronContract.SUBDAO_PROPOSAL);
  const preProposeTimelockedCodeId = await cm.storeWasm(
    NeutronContract.SUBDAO_PREPROPOSE,
  );
  const preProposeNonTimelockedPauseCodeId = await cm.storeWasm(
    NeutronContract.SUBDAO_PREPROPOSE_NO_TIMELOCK,
  );
  const timelockCodeId = await cm.storeWasm(NeutronContract.SUBDAO_TIMELOCK);
  const votingModuleInstantiateInfo = {
    code_id: cw4VotingCodeId,
    label: 'subDAO_Neutron_voting_module',
    msg: wrapMsg({
      cw4_group_code_id: cw4GroupCodeId,
      initial_members: [
        {
          addr: cm.wallet.address.toString(),
          weight: 1,
        },
      ],
    }),
  };

  const proposeInstantiateMessage = {
    threshold: { absolute_count: { threshold: '1' } },
    max_voting_period: { height: 10 },
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: preProposeTimelockedCodeId,
          label: 'neutron.subdaos.test.proposal.single.pre_propose',
          msg: wrapMsg({
            open_proposal_submission: true,
            timelock_module_instantiate_info: {
              code_id: timelockCodeId,
              label:
                'neutron.subdaos.test.proposal.single.pre_propose.timelock',
              msg: wrapMsg({
                overrule_pre_propose: overrulePreProposeAddress,
              }),
            },
          }),
        },
      },
    },
    close_proposal_on_execution_failure: closeProposalOnExecutionFailure,
  };
  const proposalModuleInstantiateInfo = {
    code_id: proposeCodeId,
    label: 'neutron.subdaos.test.proposal.single',
    msg: wrapMsg(proposeInstantiateMessage),
  };

  const propose2InstantiateMessage = {
    threshold: { absolute_count: { threshold: '1' } },
    max_voting_period: { height: 10 },
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: preProposeTimelockedCodeId,
          label: 'neutron.subdaos.test.proposal.single2.pre_propose',
          msg: wrapMsg({
            open_proposal_submission: true,
            timelock_module_instantiate_info: {
              code_id: timelockCodeId,
              label:
                'neutron.subdaos.test.proposal.single2.pre_propose.timelock',
              msg: wrapMsg({
                overrule_pre_propose: overrulePreProposeAddress,
              }),
            },
          }),
        },
      },
    },
    close_proposal_on_execution_failure: false,
  };
  const proposal2ModuleInstantiateInfo = {
    code_id: proposeCodeId,
    label: 'neutron.subdaos.test.proposal.single2',
    msg: wrapMsg(propose2InstantiateMessage),
  };

  const nonTimelockedPauseProposeInstantiateMessage = {
    threshold: { absolute_count: { threshold: '1' } },
    max_voting_period: { height: 10 },
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: preProposeNonTimelockedPauseCodeId,
          label: 'neutron.subdaos.test.proposal.single_nt_pause.pre_propose',
          msg: wrapMsg({
            open_proposal_submission: true,
          }),
        },
      },
    },
    close_proposal_on_execution_failure: false,
  };
  const nonTimelockedPauseProposalModuleInstantiateInfo = {
    code_id: proposeCodeId,
    label: 'neutron.subdaos.test.proposal.single_nt_pause',
    msg: wrapMsg(nonTimelockedPauseProposeInstantiateMessage),
  };

  const coreInstantiateMessage = {
    name: 'SubDAO core test 1',
    description: 'serves testing purposes',
    vote_module_instantiate_info: votingModuleInstantiateInfo,
    proposal_modules_instantiate_info: [
      proposalModuleInstantiateInfo,
      proposal2ModuleInstantiateInfo,
      nonTimelockedPauseProposalModuleInstantiateInfo,
    ],
    main_dao: mainDaoCoreAddress,
    security_dao: securityDaoAddr,
  };
  const res = await cm.instantiateContract(
    coreCodeId,
    JSON.stringify(coreInstantiateMessage),
    'neutron.subdaos.test.core',
  );

  const f = (arr: Record<string, string>[], id: number) =>
    (arr.find((v) => Number(v.code_id) == id) || {})._contract_address;

  return new Dao(
    cm.chain,
    await getSubDaoContracts(cm.chain, f(res, coreCodeId)),
  );
};

export const setupSubDaoTimelockSet = async (
  cm: WalletWrapper,
  mainDaoAddress: string,
  securityDaoAddr: string,
  mockMainDao: boolean,
  closeProposalOnExecutionFailure = true,
): Promise<Dao> => {
  const daoContracts = await getDaoContracts(cm.chain, mainDaoAddress);
  const subDao = await deploySubdao(
    cm,
    mockMainDao ? cm.wallet.address.toString() : daoContracts.core.address,
    daoContracts.proposals.overrule.pre_propose.address,
    securityDaoAddr,
    closeProposalOnExecutionFailure,
  );

  const mainDaoMember = new DaoMember(cm, new Dao(cm.chain, daoContracts));
  await mainDaoMember.addSubdaoToDao(subDao.contracts.core.address);

  return subDao;
};

export const deployNeutronDao = async (
  cm: WalletWrapper,
): Promise<DaoContracts> => {
  const coreCodeId = await cm.storeWasm(NeutronContract.DAO_CORE);
  const proposeSingleCodeId = await cm.storeWasm(
    NeutronContract.DAO_PROPOSAL_SINGLE,
  );
  const preProposeSingleCodeId = await cm.storeWasm(
    NeutronContract.DAO_PREPROPOSAL_SINGLE,
  );
  const proposeMultipleCodeId = await cm.storeWasm(
    NeutronContract.DAO_PROPOSAL_MULTI,
  );
  const preProposeMultipleCodeId = await cm.storeWasm(
    NeutronContract.DAO_PREPROPOSAL_MULTI,
  );
  const preProposeOverruleCodeId = await cm.storeWasm(
    NeutronContract.DAO_PREPROPOSAL_OVERRULE,
  );
  const votingRegistryCodeId = await cm.storeWasm(
    NeutronContract.VOTING_REGISTRY,
  );

  const neutronVaultCodeId = await cm.storeWasm(NeutronContract.NEUTRON_VAULT);
  const neutronVaultInitMsg = {
    owner: cm.wallet.address.toString(),
    name: 'voting vault',
    denom: cm.chain.denom,
    description: 'a simple voting vault for testing purposes',
  };

  const neutronVaultCodeIdRes = await cm.instantiateContract(
    neutronVaultCodeId,
    JSON.stringify(neutronVaultInitMsg),
    DaoContractLabels.NEUTRON_VAULT,
  );

  const f = (arr: Record<string, string>[], id: number) =>
    (arr.find((v) => Number(v.code_id) == id) || {})._contract_address;
  const neutronVaultAddress = f(neutronVaultCodeIdRes, neutronVaultCodeId);
  const votingRegistryInstantiateInfo = {
    admin: {
      core_module: {},
    },
    code_id: votingRegistryCodeId,
    label: DaoContractLabels.DAO_VOTING_REGISTRY,
    msg: wrapMsg({
      owner: cm.wallet.address.toString(),
      voting_vaults: [neutronVaultAddress],
    }),
  };
  const preProposeInitMsg = {
    deposit_info: {
      denom: {
        token: {
          denom: {
            native: cm.chain.denom,
          },
        },
      },
      amount: '1000',
      refund_policy: 'always',
    },
    open_proposal_submission: false,
  };
  const proposeSingleInitMsg = {
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          admin: {
            core_module: {},
          },
          code_id: preProposeSingleCodeId,
          msg: wrapMsg(preProposeInitMsg),
          label: DaoContractLabels.DAO_PRE_PROPOSAL_SINGLE,
        },
      },
    },
    only_members_execute: false,
    max_voting_period: {
      time: 604800,
    },
    close_proposal_on_execution_failure: false,
    threshold: {
      threshold_quorum: {
        quorum: {
          percent: '0.20',
        },
        threshold: {
          majority: {},
        },
      },
    },
  };

  const proposeMultipleInitMsg = {
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          admin: {
            core_module: {},
          },
          code_id: preProposeMultipleCodeId,
          msg: wrapMsg(preProposeInitMsg),
          label: DaoContractLabels.DAO_PRE_PROPOSAL_MULTIPLE,
        },
      },
    },
    only_members_execute: false,
    max_voting_period: {
      time: 604800,
    },
    close_proposal_on_execution_failure: false,
    voting_strategy: {
      single_choice: {
        quorum: {
          majority: {},
        },
      },
    },
  };

  const proposeOverruleInitMsg = {
    allow_revoting: false,
    pre_propose_info: {
      module_may_propose: {
        info: {
          admin: {
            core_module: {},
          },
          code_id: preProposeOverruleCodeId,
          msg: wrapMsg({}),
          label: DaoContractLabels.DAO_PRE_PROPOSAL_OVERRULE,
        },
      },
    },
    only_members_execute: false,
    max_voting_period: {
      height: 10,
    },
    close_proposal_on_execution_failure: false,
    threshold: {
      absolute_percentage: {
        percentage: {
          percent: '0.10',
        },
      },
    },
  };

  const coreInstantiateMessage = {
    name: 'SubDAO core test 1',
    description: 'serves testing purposes',
    initial_items: null,
    voting_registry_module_instantiate_info: votingRegistryInstantiateInfo,
    proposal_modules_instantiate_info: [
      {
        admin: {
          core_module: {},
        },
        code_id: proposeSingleCodeId,
        label: DaoContractLabels.DAO_PROPOSAL_SINGLE,
        msg: wrapMsg(proposeSingleInitMsg),
      },
      {
        admin: {
          core_module: {},
        },
        code_id: proposeMultipleCodeId,
        label: DaoContractLabels.DAO_PROPOSAL_MULTIPLE,
        msg: wrapMsg(proposeMultipleInitMsg),
      },
      {
        admin: {
          core_module: {},
        },
        code_id: proposeSingleCodeId,
        label: DaoContractLabels.DAO_PROPOSAL_OVERRULE,
        msg: wrapMsg(proposeOverruleInitMsg),
      },
    ],
  };
  const res = await cm.instantiateContract(
    coreCodeId,
    JSON.stringify(coreInstantiateMessage),
    DaoContractLabels.DAO_CORE,
  );
  await cm.chain.blockWaiter.waitBlocks(1);
  return getDaoContracts(cm.chain, f(res, coreCodeId));
};
