// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file sdk/auction/v1/genesis.proto (package sdk.auction.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Coin } from "../../../cosmos/base/v1beta1/coin_pb.js";

/**
 * GenesisState defines the genesis state of the x/auction module.
 *
 * @generated from message sdk.auction.v1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * @generated from field: sdk.auction.v1.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sdk.auction.v1.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
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

/**
 * Params defines the parameters of the x/auction module.
 *
 * @generated from message sdk.auction.v1.Params
 */
export class Params extends Message<Params> {
  /**
   * max_bundle_size is the maximum number of transactions that can be bundled
   * in a single bundle.
   *
   * @generated from field: uint32 max_bundle_size = 1;
   */
  maxBundleSize = 0;

  /**
   * escrow_account_address is the address of the account that will receive a
   * portion of the bid proceeds.
   *
   * @generated from field: bytes escrow_account_address = 2;
   */
  escrowAccountAddress = new Uint8Array(0);

  /**
   * reserve_fee specifies the bid floor for the auction.
   *
   * @generated from field: cosmos.base.v1beta1.Coin reserve_fee = 3;
   */
  reserveFee?: Coin;

  /**
   * min_bid_increment specifies the minimum amount that the next bid must be
   * greater than the previous bid.
   *
   * @generated from field: cosmos.base.v1beta1.Coin min_bid_increment = 4;
   */
  minBidIncrement?: Coin;

  /**
   * front_running_protection specifies whether front running and sandwich
   * attack protection is enabled.
   *
   * @generated from field: bool front_running_protection = 5;
   */
  frontRunningProtection = false;

  /**
   * proposer_fee defines the portion of the winning bid that goes to the block
   * proposer that proposed the block.
   *
   * @generated from field: string proposer_fee = 6;
   */
  proposerFee = "";

  constructor(data?: PartialMessage<Params>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sdk.auction.v1.Params";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "max_bundle_size", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "escrow_account_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "reserve_fee", kind: "message", T: Coin },
    { no: 4, name: "min_bid_increment", kind: "message", T: Coin },
    { no: 5, name: "front_running_protection", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "proposer_fee", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Params {
    return new Params().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Params {
    return new Params().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Params {
    return new Params().fromJsonString(jsonString, options);
  }

  static equals(a: Params | PlainMessage<Params> | undefined, b: Params | PlainMessage<Params> | undefined): boolean {
    return proto3.util.equals(Params, a, b);
  }
}

