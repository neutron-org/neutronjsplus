// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file slinky/alerts/v1/strategies.proto (package slinky.alerts.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Validator } from "../../../tendermint/abci/types_pb.js";

/**
 * ValidatorAlertIncentive defines the incentive strategy to be executed for a
 * validator that has been confirmed to have at fault for an x/alerts alert.
 * This strategy is expected to slash half of the validator's stake.
 *
 * @generated from message slinky.alerts.v1.ValidatorAlertIncentive
 */
export class ValidatorAlertIncentive extends Message<ValidatorAlertIncentive> {
  /**
   * The validator that has been confirmed to have been at fault for an alert.
   *
   * @generated from field: tendermint.abci.Validator validator = 1;
   */
  validator?: Validator;

  /**
   * AlertSigner is the signer of the alert referenced by the conclusion that
   * created this incentive.
   *
   * @generated from field: string alert_signer = 2;
   */
  alertSigner = "";

  /**
   * AlertHeight is the height at which the infraction occurred
   *
   * @generated from field: uint64 alert_height = 3;
   */
  alertHeight = protoInt64.zero;

  constructor(data?: PartialMessage<ValidatorAlertIncentive>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.alerts.v1.ValidatorAlertIncentive";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "validator", kind: "message", T: Validator },
    { no: 2, name: "alert_signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "alert_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidatorAlertIncentive {
    return new ValidatorAlertIncentive().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidatorAlertIncentive {
    return new ValidatorAlertIncentive().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidatorAlertIncentive {
    return new ValidatorAlertIncentive().fromJsonString(jsonString, options);
  }

  static equals(a: ValidatorAlertIncentive | PlainMessage<ValidatorAlertIncentive> | undefined, b: ValidatorAlertIncentive | PlainMessage<ValidatorAlertIncentive> | undefined): boolean {
    return proto3.util.equals(ValidatorAlertIncentive, a, b);
  }
}

