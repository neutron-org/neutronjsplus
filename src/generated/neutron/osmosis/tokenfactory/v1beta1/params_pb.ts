// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file osmosis/tokenfactory/v1beta1/params.proto (package osmosis.tokenfactory.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Coin } from "../../../cosmos/base/v1beta1/coin_pb.js";

/**
 * Params defines the parameters for the tokenfactory module.
 *
 * @generated from message osmosis.tokenfactory.v1beta1.Params
 */
export class Params extends Message<Params> {
  /**
   * DenomCreationFee defines the fee to be charged on the creation of a new
   * denom. The fee is drawn from the MsgCreateDenom's sender account, and
   * transferred to the community pool.
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin denom_creation_fee = 1;
   */
  denomCreationFee: Coin[] = [];

  /**
   * DenomCreationGasConsume defines the gas cost for creating a new denom.
   * This is intended as a spam deterrence mechanism.
   *
   * See: https://github.com/CosmWasm/token-factory/issues/11
   *
   * @generated from field: uint64 denom_creation_gas_consume = 2;
   */
  denomCreationGasConsume = protoInt64.zero;

  /**
   * FeeCollectorAddress is the address where fees collected from denom creation are sent to
   *
   * @generated from field: string fee_collector_address = 3;
   */
  feeCollectorAddress = "";

  constructor(data?: PartialMessage<Params>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "osmosis.tokenfactory.v1beta1.Params";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "denom_creation_fee", kind: "message", T: Coin, repeated: true },
    { no: 2, name: "denom_creation_gas_consume", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "fee_collector_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
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

