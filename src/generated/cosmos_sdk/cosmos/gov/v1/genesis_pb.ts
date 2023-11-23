// Since: cosmos-sdk 0.46

// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/gov/v1/genesis.proto (package cosmos.gov.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Deposit, DepositParams, Params, Proposal, TallyParams, Vote, VotingParams } from "./gov_pb.js";

/**
 * GenesisState defines the gov module's genesis state.
 *
 * @generated from message cosmos.gov.v1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * starting_proposal_id is the ID of the starting proposal.
   *
   * @generated from field: uint64 starting_proposal_id = 1;
   */
  startingProposalId = protoInt64.zero;

  /**
   * deposits defines all the deposits present at genesis.
   *
   * @generated from field: repeated cosmos.gov.v1.Deposit deposits = 2;
   */
  deposits: Deposit[] = [];

  /**
   * votes defines all the votes present at genesis.
   *
   * @generated from field: repeated cosmos.gov.v1.Vote votes = 3;
   */
  votes: Vote[] = [];

  /**
   * proposals defines all the proposals present at genesis.
   *
   * @generated from field: repeated cosmos.gov.v1.Proposal proposals = 4;
   */
  proposals: Proposal[] = [];

  /**
   * Deprecated: Prefer to use `params` instead.
   * deposit_params defines all the paramaters of related to deposit.
   *
   * @generated from field: cosmos.gov.v1.DepositParams deposit_params = 5 [deprecated = true];
   * @deprecated
   */
  depositParams?: DepositParams;

  /**
   * Deprecated: Prefer to use `params` instead.
   * voting_params defines all the paramaters of related to voting.
   *
   * @generated from field: cosmos.gov.v1.VotingParams voting_params = 6 [deprecated = true];
   * @deprecated
   */
  votingParams?: VotingParams;

  /**
   * Deprecated: Prefer to use `params` instead.
   * tally_params defines all the paramaters of related to tally.
   *
   * @generated from field: cosmos.gov.v1.TallyParams tally_params = 7 [deprecated = true];
   * @deprecated
   */
  tallyParams?: TallyParams;

  /**
   * params defines all the paramaters of x/gov module.
   *
   * Since: cosmos-sdk 0.47
   *
   * @generated from field: cosmos.gov.v1.Params params = 8;
   */
  params?: Params;

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.gov.v1.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "starting_proposal_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "deposits", kind: "message", T: Deposit, repeated: true },
    { no: 3, name: "votes", kind: "message", T: Vote, repeated: true },
    { no: 4, name: "proposals", kind: "message", T: Proposal, repeated: true },
    { no: 5, name: "deposit_params", kind: "message", T: DepositParams },
    { no: 6, name: "voting_params", kind: "message", T: VotingParams },
    { no: 7, name: "tally_params", kind: "message", T: TallyParams },
    { no: 8, name: "params", kind: "message", T: Params },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenesisState {
    return new GenesisState().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenesisState {
    return new GenesisState().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenesisState {
    return new GenesisState().fromJsonString(jsonString, options);
  }

  static equals(a: GenesisState | PlainMessage<GenesisState> | undefined, b: GenesisState | PlainMessage<GenesisState> | undefined): boolean {
    return proto3.util.equals(GenesisState, a, b);
  }
}

