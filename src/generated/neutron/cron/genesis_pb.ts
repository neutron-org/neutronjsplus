// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cron/genesis.proto (package neutron.cron, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Schedule } from "./schedule_pb.js";
import { Params } from "./params_pb.js";

/**
 * GenesisState defines the cron module's genesis state.
 *
 * @generated from message neutron.cron.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * @generated from field: repeated neutron.cron.Schedule scheduleList = 2;
   */
  scheduleList: Schedule[] = [];

  /**
   * @generated from field: neutron.cron.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.cron.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "scheduleList", kind: "message", T: Schedule, repeated: true },
    { no: 1, name: "params", kind: "message", T: Params },
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

