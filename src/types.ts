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

export type MultiChoiceOption = {
  title: string;
  description: string;
  msgs: any[];
};
