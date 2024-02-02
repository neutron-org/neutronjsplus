// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/distribution/v1beta1/genesis.proto (package cosmos.distribution.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { DecCoin } from "../../base/v1beta1/coin_pb.js";
import { DelegatorStartingInfo, FeePool, Params, ValidatorAccumulatedCommission, ValidatorCurrentRewards, ValidatorHistoricalRewards, ValidatorSlashEvent } from "./distribution_pb.js";

/**
 * DelegatorWithdrawInfo is the address for where distributions rewards are
 * withdrawn to by default this struct is only used at genesis to feed in
 * default withdraw addresses.
 *
 * @generated from message cosmos.distribution.v1beta1.DelegatorWithdrawInfo
 */
export class DelegatorWithdrawInfo extends Message<DelegatorWithdrawInfo> {
  /**
   * delegator_address is the address of the delegator.
   *
   * @generated from field: string delegator_address = 1;
   */
  delegatorAddress = "";

  /**
   * withdraw_address is the address to withdraw the delegation rewards to.
   *
   * @generated from field: string withdraw_address = 2;
   */
  withdrawAddress = "";

  constructor(data?: PartialMessage<DelegatorWithdrawInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.DelegatorWithdrawInfo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "delegator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "withdraw_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DelegatorWithdrawInfo {
    return new DelegatorWithdrawInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DelegatorWithdrawInfo {
    return new DelegatorWithdrawInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DelegatorWithdrawInfo {
    return new DelegatorWithdrawInfo().fromJsonString(jsonString, options);
  }

  static equals(a: DelegatorWithdrawInfo | PlainMessage<DelegatorWithdrawInfo> | undefined, b: DelegatorWithdrawInfo | PlainMessage<DelegatorWithdrawInfo> | undefined): boolean {
    return proto3.util.equals(DelegatorWithdrawInfo, a, b);
  }
}

/**
 * ValidatorOutstandingRewardsRecord is used for import/export via genesis json.
 *
 * @generated from message cosmos.distribution.v1beta1.ValidatorOutstandingRewardsRecord
 */
export class ValidatorOutstandingRewardsRecord extends Message<ValidatorOutstandingRewardsRecord> {
  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 1;
   */
  validatorAddress = "";

  /**
   * outstanding_rewards represents the outstanding rewards of a validator.
   *
   * @generated from field: repeated cosmos.base.v1beta1.DecCoin outstanding_rewards = 2;
   */
  outstandingRewards: DecCoin[] = [];

  constructor(data?: PartialMessage<ValidatorOutstandingRewardsRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.ValidatorOutstandingRewardsRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "outstanding_rewards", kind: "message", T: DecCoin, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorOutstandingRewardsRecord {
    return new ValidatorOutstandingRewardsRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorOutstandingRewardsRecord {
    return new ValidatorOutstandingRewardsRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorOutstandingRewardsRecord {
    return new ValidatorOutstandingRewardsRecord().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorOutstandingRewardsRecord | PlainMessage<ValidatorOutstandingRewardsRecord> | undefined, b: ValidatorOutstandingRewardsRecord | PlainMessage<ValidatorOutstandingRewardsRecord> | undefined): boolean {
    return proto3.util.equals(ValidatorOutstandingRewardsRecord, a, b);
  }
}

/**
 * ValidatorAccumulatedCommissionRecord is used for import / export via genesis
 * json.
 *
 * @generated from message cosmos.distribution.v1beta1.ValidatorAccumulatedCommissionRecord
 */
export class ValidatorAccumulatedCommissionRecord extends Message<ValidatorAccumulatedCommissionRecord> {
  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 1;
   */
  validatorAddress = "";

  /**
   * accumulated is the accumulated commission of a validator.
   *
   * @generated from field: cosmos.distribution.v1beta1.ValidatorAccumulatedCommission accumulated = 2;
   */
  accumulated?: ValidatorAccumulatedCommission;

  constructor(data?: PartialMessage<ValidatorAccumulatedCommissionRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.ValidatorAccumulatedCommissionRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "accumulated", kind: "message", T: ValidatorAccumulatedCommission },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorAccumulatedCommissionRecord {
    return new ValidatorAccumulatedCommissionRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorAccumulatedCommissionRecord {
    return new ValidatorAccumulatedCommissionRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorAccumulatedCommissionRecord {
    return new ValidatorAccumulatedCommissionRecord().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorAccumulatedCommissionRecord | PlainMessage<ValidatorAccumulatedCommissionRecord> | undefined, b: ValidatorAccumulatedCommissionRecord | PlainMessage<ValidatorAccumulatedCommissionRecord> | undefined): boolean {
    return proto3.util.equals(ValidatorAccumulatedCommissionRecord, a, b);
  }
}

/**
 * ValidatorHistoricalRewardsRecord is used for import / export via genesis
 * json.
 *
 * @generated from message cosmos.distribution.v1beta1.ValidatorHistoricalRewardsRecord
 */
export class ValidatorHistoricalRewardsRecord extends Message<ValidatorHistoricalRewardsRecord> {
  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 1;
   */
  validatorAddress = "";

  /**
   * period defines the period the historical rewards apply to.
   *
   * @generated from field: uint64 period = 2;
   */
  period = protoInt64.zero;

  /**
   * rewards defines the historical rewards of a validator.
   *
   * @generated from field: cosmos.distribution.v1beta1.ValidatorHistoricalRewards rewards = 3;
   */
  rewards?: ValidatorHistoricalRewards;

  constructor(data?: PartialMessage<ValidatorHistoricalRewardsRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.ValidatorHistoricalRewardsRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "period", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "rewards", kind: "message", T: ValidatorHistoricalRewards },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorHistoricalRewardsRecord {
    return new ValidatorHistoricalRewardsRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorHistoricalRewardsRecord {
    return new ValidatorHistoricalRewardsRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorHistoricalRewardsRecord {
    return new ValidatorHistoricalRewardsRecord().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorHistoricalRewardsRecord | PlainMessage<ValidatorHistoricalRewardsRecord> | undefined, b: ValidatorHistoricalRewardsRecord | PlainMessage<ValidatorHistoricalRewardsRecord> | undefined): boolean {
    return proto3.util.equals(ValidatorHistoricalRewardsRecord, a, b);
  }
}

/**
 * ValidatorCurrentRewardsRecord is used for import / export via genesis json.
 *
 * @generated from message cosmos.distribution.v1beta1.ValidatorCurrentRewardsRecord
 */
export class ValidatorCurrentRewardsRecord extends Message<ValidatorCurrentRewardsRecord> {
  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 1;
   */
  validatorAddress = "";

  /**
   * rewards defines the current rewards of a validator.
   *
   * @generated from field: cosmos.distribution.v1beta1.ValidatorCurrentRewards rewards = 2;
   */
  rewards?: ValidatorCurrentRewards;

  constructor(data?: PartialMessage<ValidatorCurrentRewardsRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.ValidatorCurrentRewardsRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "rewards", kind: "message", T: ValidatorCurrentRewards },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorCurrentRewardsRecord {
    return new ValidatorCurrentRewardsRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorCurrentRewardsRecord {
    return new ValidatorCurrentRewardsRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorCurrentRewardsRecord {
    return new ValidatorCurrentRewardsRecord().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorCurrentRewardsRecord | PlainMessage<ValidatorCurrentRewardsRecord> | undefined, b: ValidatorCurrentRewardsRecord | PlainMessage<ValidatorCurrentRewardsRecord> | undefined): boolean {
    return proto3.util.equals(ValidatorCurrentRewardsRecord, a, b);
  }
}

/**
 * DelegatorStartingInfoRecord used for import / export via genesis json.
 *
 * @generated from message cosmos.distribution.v1beta1.DelegatorStartingInfoRecord
 */
export class DelegatorStartingInfoRecord extends Message<DelegatorStartingInfoRecord> {
  /**
   * delegator_address is the address of the delegator.
   *
   * @generated from field: string delegator_address = 1;
   */
  delegatorAddress = "";

  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 2;
   */
  validatorAddress = "";

  /**
   * starting_info defines the starting info of a delegator.
   *
   * @generated from field: cosmos.distribution.v1beta1.DelegatorStartingInfo starting_info = 3;
   */
  startingInfo?: DelegatorStartingInfo;

  constructor(data?: PartialMessage<DelegatorStartingInfoRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.DelegatorStartingInfoRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "delegator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "starting_info", kind: "message", T: DelegatorStartingInfo },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DelegatorStartingInfoRecord {
    return new DelegatorStartingInfoRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DelegatorStartingInfoRecord {
    return new DelegatorStartingInfoRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DelegatorStartingInfoRecord {
    return new DelegatorStartingInfoRecord().fromJsonString(jsonString, options);
  }

  static equals(a: DelegatorStartingInfoRecord | PlainMessage<DelegatorStartingInfoRecord> | undefined, b: DelegatorStartingInfoRecord | PlainMessage<DelegatorStartingInfoRecord> | undefined): boolean {
    return proto3.util.equals(DelegatorStartingInfoRecord, a, b);
  }
}

/**
 * ValidatorSlashEventRecord is used for import / export via genesis json.
 *
 * @generated from message cosmos.distribution.v1beta1.ValidatorSlashEventRecord
 */
export class ValidatorSlashEventRecord extends Message<ValidatorSlashEventRecord> {
  /**
   * validator_address is the address of the validator.
   *
   * @generated from field: string validator_address = 1;
   */
  validatorAddress = "";

  /**
   * height defines the block height at which the slash event occurred.
   *
   * @generated from field: uint64 height = 2;
   */
  height = protoInt64.zero;

  /**
   * period is the period of the slash event.
   *
   * @generated from field: uint64 period = 3;
   */
  period = protoInt64.zero;

  /**
   * validator_slash_event describes the slash event.
   *
   * @generated from field: cosmos.distribution.v1beta1.ValidatorSlashEvent validator_slash_event = 4;
   */
  validatorSlashEvent?: ValidatorSlashEvent;

  constructor(data?: PartialMessage<ValidatorSlashEventRecord>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.ValidatorSlashEventRecord";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "period", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "validator_slash_event", kind: "message", T: ValidatorSlashEvent },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorSlashEventRecord {
    return new ValidatorSlashEventRecord().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorSlashEventRecord {
    return new ValidatorSlashEventRecord().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorSlashEventRecord {
    return new ValidatorSlashEventRecord().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorSlashEventRecord | PlainMessage<ValidatorSlashEventRecord> | undefined, b: ValidatorSlashEventRecord | PlainMessage<ValidatorSlashEventRecord> | undefined): boolean {
    return proto3.util.equals(ValidatorSlashEventRecord, a, b);
  }
}

/**
 * GenesisState defines the distribution module's genesis state.
 *
 * @generated from message cosmos.distribution.v1beta1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * params defines all the parameters of the module.
   *
   * @generated from field: cosmos.distribution.v1beta1.Params params = 1;
   */
  params?: Params;

  /**
   * fee_pool defines the fee pool at genesis.
   *
   * @generated from field: cosmos.distribution.v1beta1.FeePool fee_pool = 2;
   */
  feePool?: FeePool;

  /**
   * fee_pool defines the delegator withdraw infos at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.DelegatorWithdrawInfo delegator_withdraw_infos = 3;
   */
  delegatorWithdrawInfos: DelegatorWithdrawInfo[] = [];

  /**
   * fee_pool defines the previous proposer at genesis.
   *
   * @generated from field: string previous_proposer = 4;
   */
  previousProposer = "";

  /**
   * fee_pool defines the outstanding rewards of all validators at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.ValidatorOutstandingRewardsRecord outstanding_rewards = 5;
   */
  outstandingRewards: ValidatorOutstandingRewardsRecord[] = [];

  /**
   * fee_pool defines the accumulated commissions of all validators at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.ValidatorAccumulatedCommissionRecord validator_accumulated_commissions = 6;
   */
  validatorAccumulatedCommissions: ValidatorAccumulatedCommissionRecord[] = [];

  /**
   * fee_pool defines the historical rewards of all validators at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.ValidatorHistoricalRewardsRecord validator_historical_rewards = 7;
   */
  validatorHistoricalRewards: ValidatorHistoricalRewardsRecord[] = [];

  /**
   * fee_pool defines the current rewards of all validators at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.ValidatorCurrentRewardsRecord validator_current_rewards = 8;
   */
  validatorCurrentRewards: ValidatorCurrentRewardsRecord[] = [];

  /**
   * fee_pool defines the delegator starting infos at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.DelegatorStartingInfoRecord delegator_starting_infos = 9;
   */
  delegatorStartingInfos: DelegatorStartingInfoRecord[] = [];

  /**
   * fee_pool defines the validator slash events at genesis.
   *
   * @generated from field: repeated cosmos.distribution.v1beta1.ValidatorSlashEventRecord validator_slash_events = 10;
   */
  validatorSlashEvents: ValidatorSlashEventRecord[] = [];

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.distribution.v1beta1.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
    { no: 2, name: "fee_pool", kind: "message", T: FeePool },
    { no: 3, name: "delegator_withdraw_infos", kind: "message", T: DelegatorWithdrawInfo, repeated: true },
    { no: 4, name: "previous_proposer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "outstanding_rewards", kind: "message", T: ValidatorOutstandingRewardsRecord, repeated: true },
    { no: 6, name: "validator_accumulated_commissions", kind: "message", T: ValidatorAccumulatedCommissionRecord, repeated: true },
    { no: 7, name: "validator_historical_rewards", kind: "message", T: ValidatorHistoricalRewardsRecord, repeated: true },
    { no: 8, name: "validator_current_rewards", kind: "message", T: ValidatorCurrentRewardsRecord, repeated: true },
    { no: 9, name: "delegator_starting_infos", kind: "message", T: DelegatorStartingInfoRecord, repeated: true },
    { no: 10, name: "validator_slash_events", kind: "message", T: ValidatorSlashEventRecord, repeated: true },
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
