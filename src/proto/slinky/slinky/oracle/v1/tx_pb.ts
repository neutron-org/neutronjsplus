// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file slinky/oracle/v1/tx.proto (package slinky.oracle.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { CurrencyPair } from "../../types/v1/currency_pair_pb.js";

/**
 * Given an authority + a set of CurrencyPairs, the x/oracle module will
 * check to see that the authority has permissions to update the set of
 * CurrencyPairs tracked in the oracle, and add the given CurrencyPairs to be
 * tracked in each VoteExtension
 *
 * @generated from message slinky.oracle.v1.MsgAddCurrencyPairs
 */
export class MsgAddCurrencyPairs extends Message<MsgAddCurrencyPairs> {
  /**
   * authority is the address of the account that is authorized to update the
   * x/oracle's CurrencyPairs
   *
   * @generated from field: string authority = 1;
   */
  authority = "";

  /**
   * set of CurrencyPairs to be added to the module (+ prices if they are to be
   * set)
   *
   * @generated from field: repeated slinky.types.v1.CurrencyPair currency_pairs = 2;
   */
  currencyPairs: CurrencyPair[] = [];

  constructor(data?: PartialMessage<MsgAddCurrencyPairs>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.oracle.v1.MsgAddCurrencyPairs";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "authority", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "currency_pairs", kind: "message", T: CurrencyPair, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAddCurrencyPairs {
    return new MsgAddCurrencyPairs().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAddCurrencyPairs {
    return new MsgAddCurrencyPairs().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAddCurrencyPairs {
    return new MsgAddCurrencyPairs().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAddCurrencyPairs | PlainMessage<MsgAddCurrencyPairs> | undefined, b: MsgAddCurrencyPairs | PlainMessage<MsgAddCurrencyPairs> | undefined): boolean {
    return proto3.util.equals(MsgAddCurrencyPairs, a, b);
  }
}

/**
 * @generated from message slinky.oracle.v1.MsgAddCurrencyPairsResponse
 */
export class MsgAddCurrencyPairsResponse extends Message<MsgAddCurrencyPairsResponse> {
  constructor(data?: PartialMessage<MsgAddCurrencyPairsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.oracle.v1.MsgAddCurrencyPairsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAddCurrencyPairsResponse {
    return new MsgAddCurrencyPairsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAddCurrencyPairsResponse {
    return new MsgAddCurrencyPairsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAddCurrencyPairsResponse {
    return new MsgAddCurrencyPairsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAddCurrencyPairsResponse | PlainMessage<MsgAddCurrencyPairsResponse> | undefined, b: MsgAddCurrencyPairsResponse | PlainMessage<MsgAddCurrencyPairsResponse> | undefined): boolean {
    return proto3.util.equals(MsgAddCurrencyPairsResponse, a, b);
  }
}

/**
 * Given an authority + a set of CurrencyPairIDs, the x/oracle module's message
 * service will remove all of the CurrencyPairs identified by each
 * CurrencyPairID in the request from state. Notice, if a given currency-pair
 * does not exist in state, the module ignores that currency-pair and continues
 * removing the rest.
 *
 * @generated from message slinky.oracle.v1.MsgRemoveCurrencyPairs
 */
export class MsgRemoveCurrencyPairs extends Message<MsgRemoveCurrencyPairs> {
  /**
   * authority is the address of the account that is authorized to update the
   * x/oracle's CurrencyPairs
   *
   * @generated from field: string authority = 1;
   */
  authority = "";

  /**
   * currency_pair_ids are the stringified representation of a currency-pairs
   * (base/quote) to be removed from the module's state
   *
   * @generated from field: repeated string currency_pair_ids = 2;
   */
  currencyPairIds: string[] = [];

  constructor(data?: PartialMessage<MsgRemoveCurrencyPairs>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.oracle.v1.MsgRemoveCurrencyPairs";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "authority", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "currency_pair_ids", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRemoveCurrencyPairs {
    return new MsgRemoveCurrencyPairs().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRemoveCurrencyPairs {
    return new MsgRemoveCurrencyPairs().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRemoveCurrencyPairs {
    return new MsgRemoveCurrencyPairs().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRemoveCurrencyPairs | PlainMessage<MsgRemoveCurrencyPairs> | undefined, b: MsgRemoveCurrencyPairs | PlainMessage<MsgRemoveCurrencyPairs> | undefined): boolean {
    return proto3.util.equals(MsgRemoveCurrencyPairs, a, b);
  }
}

/**
 * @generated from message slinky.oracle.v1.MsgRemoveCurrencyPairsResponse
 */
export class MsgRemoveCurrencyPairsResponse extends Message<MsgRemoveCurrencyPairsResponse> {
  constructor(data?: PartialMessage<MsgRemoveCurrencyPairsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.oracle.v1.MsgRemoveCurrencyPairsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRemoveCurrencyPairsResponse {
    return new MsgRemoveCurrencyPairsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRemoveCurrencyPairsResponse {
    return new MsgRemoveCurrencyPairsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRemoveCurrencyPairsResponse {
    return new MsgRemoveCurrencyPairsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRemoveCurrencyPairsResponse | PlainMessage<MsgRemoveCurrencyPairsResponse> | undefined, b: MsgRemoveCurrencyPairsResponse | PlainMessage<MsgRemoveCurrencyPairsResponse> | undefined): boolean {
    return proto3.util.equals(MsgRemoveCurrencyPairsResponse, a, b);
  }
}

