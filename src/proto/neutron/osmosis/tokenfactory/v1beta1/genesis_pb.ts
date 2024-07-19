// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file osmosis/tokenfactory/v1beta1/genesis.proto (package osmosis.tokenfactory.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Params } from "./params_pb.js";
import { DenomAuthorityMetadata } from "./authorityMetadata_pb.js";

/**
 * GenesisState defines the tokenfactory module's genesis state.
 *
 * @generated from message osmosis.tokenfactory.v1beta1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * params defines the parameters of the module.
   *
   * @generated from field: osmosis.tokenfactory.v1beta1.Params params = 1;
   */
  params?: Params;

  /**
   * @generated from field: repeated osmosis.tokenfactory.v1beta1.GenesisDenom factory_denoms = 2;
   */
  factoryDenoms: GenesisDenom[] = [];

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "osmosis.tokenfactory.v1beta1.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
    { no: 2, name: "factory_denoms", kind: "message", T: GenesisDenom, repeated: true },
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

/**
 * GenesisDenom defines a tokenfactory denom that is defined within genesis
 * state. The structure contains DenomAuthorityMetadata which defines the
 * denom's admin.
 *
 * @generated from message osmosis.tokenfactory.v1beta1.GenesisDenom
 */
export class GenesisDenom extends Message<GenesisDenom> {
  /**
   * @generated from field: string denom = 1;
   */
  denom = "";

  /**
   * @generated from field: osmosis.tokenfactory.v1beta1.DenomAuthorityMetadata authority_metadata = 2;
   */
  authorityMetadata?: DenomAuthorityMetadata;

  constructor(data?: PartialMessage<GenesisDenom>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "osmosis.tokenfactory.v1beta1.GenesisDenom";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "authority_metadata", kind: "message", T: DenomAuthorityMetadata },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenesisDenom {
    return new GenesisDenom().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenesisDenom {
    return new GenesisDenom().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenesisDenom {
    return new GenesisDenom().fromJsonString(jsonString, options);
  }

  static equals(a: GenesisDenom | PlainMessage<GenesisDenom> | undefined, b: GenesisDenom | PlainMessage<GenesisDenom> | undefined): boolean {
    return proto3.util.equals(GenesisDenom, a, b);
  }
}
