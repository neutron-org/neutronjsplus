// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file interchaintxs/v1/tx.proto (package neutron.interchaintxs.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Fee } from "../../feerefunder/fee_pb.js";

/**
 * MsgRegisterInterchainAccount is used to register an account on a remote zone.
 *
 * @generated from message neutron.interchaintxs.v1.MsgRegisterInterchainAccount
 */
export class MsgRegisterInterchainAccount extends Message<MsgRegisterInterchainAccount> {
  /**
   * @generated from field: string from_address = 1;
   */
  fromAddress = "";

  /**
   * @generated from field: string connection_id = 2;
   */
  connectionId = "";

  /**
   * @generated from field: string interchain_account_id = 3;
   */
  interchainAccountId = "";

  constructor(data?: PartialMessage<MsgRegisterInterchainAccount>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchaintxs.v1.MsgRegisterInterchainAccount";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "from_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "interchain_account_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRegisterInterchainAccount {
    return new MsgRegisterInterchainAccount().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRegisterInterchainAccount {
    return new MsgRegisterInterchainAccount().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRegisterInterchainAccount {
    return new MsgRegisterInterchainAccount().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRegisterInterchainAccount | PlainMessage<MsgRegisterInterchainAccount> | undefined, b: MsgRegisterInterchainAccount | PlainMessage<MsgRegisterInterchainAccount> | undefined): boolean {
    return proto3.util.equals(MsgRegisterInterchainAccount, a, b);
  }
}

/**
 * MsgRegisterInterchainAccountResponse is the response type for
 * MsgRegisterInterchainAccount.
 *
 * @generated from message neutron.interchaintxs.v1.MsgRegisterInterchainAccountResponse
 */
export class MsgRegisterInterchainAccountResponse extends Message<MsgRegisterInterchainAccountResponse> {
  constructor(data?: PartialMessage<MsgRegisterInterchainAccountResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchaintxs.v1.MsgRegisterInterchainAccountResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRegisterInterchainAccountResponse {
    return new MsgRegisterInterchainAccountResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRegisterInterchainAccountResponse {
    return new MsgRegisterInterchainAccountResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRegisterInterchainAccountResponse {
    return new MsgRegisterInterchainAccountResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRegisterInterchainAccountResponse | PlainMessage<MsgRegisterInterchainAccountResponse> | undefined, b: MsgRegisterInterchainAccountResponse | PlainMessage<MsgRegisterInterchainAccountResponse> | undefined): boolean {
    return proto3.util.equals(MsgRegisterInterchainAccountResponse, a, b);
  }
}

/**
 * MsgSubmitTx defines the payload for Msg/SubmitTx
 *
 * @generated from message neutron.interchaintxs.v1.MsgSubmitTx
 */
export class MsgSubmitTx extends Message<MsgSubmitTx> {
  /**
   * @generated from field: string from_address = 1;
   */
  fromAddress = "";

  /**
   * interchain_account_id is supposed to be the unique identifier, e.g.,
   * lido/kava. This allows contracts to have more than one interchain accounts
   * on remote zone This identifier will be a part of the portID that we'll
   * claim our capability for.
   *
   * @generated from field: string interchain_account_id = 2;
   */
  interchainAccountId = "";

  /**
   * @generated from field: string connection_id = 3;
   */
  connectionId = "";

  /**
   * @generated from field: repeated google.protobuf.Any msgs = 4;
   */
  msgs: Any[] = [];

  /**
   * @generated from field: string memo = 5;
   */
  memo = "";

  /**
   * timeout in seconds after which the packet times out
   *
   * @generated from field: uint64 timeout = 6;
   */
  timeout = protoInt64.zero;

  /**
   * @generated from field: neutron.feerefunder.Fee fee = 7;
   */
  fee?: Fee;

  constructor(data?: PartialMessage<MsgSubmitTx>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchaintxs.v1.MsgSubmitTx";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "from_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "interchain_account_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "msgs", kind: "message", T: Any, repeated: true },
    { no: 5, name: "memo", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "timeout", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 7, name: "fee", kind: "message", T: Fee },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitTx {
    return new MsgSubmitTx().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitTx {
    return new MsgSubmitTx().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitTx {
    return new MsgSubmitTx().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitTx | PlainMessage<MsgSubmitTx> | undefined, b: MsgSubmitTx | PlainMessage<MsgSubmitTx> | undefined): boolean {
    return proto3.util.equals(MsgSubmitTx, a, b);
  }
}

/**
 * MsgSubmitTxResponse defines the response for Msg/SubmitTx
 *
 * @generated from message neutron.interchaintxs.v1.MsgSubmitTxResponse
 */
export class MsgSubmitTxResponse extends Message<MsgSubmitTxResponse> {
  /**
   * channel's sequence_id for outgoing ibc packet. Unique per a channel.
   *
   * @generated from field: uint64 sequence_id = 1;
   */
  sequenceId = protoInt64.zero;

  /**
   * channel src channel on neutron side trasaction was submitted from
   *
   * @generated from field: string channel = 2;
   */
  channel = "";

  constructor(data?: PartialMessage<MsgSubmitTxResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchaintxs.v1.MsgSubmitTxResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "sequence_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "channel", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitTxResponse {
    return new MsgSubmitTxResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitTxResponse {
    return new MsgSubmitTxResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitTxResponse {
    return new MsgSubmitTxResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitTxResponse | PlainMessage<MsgSubmitTxResponse> | undefined, b: MsgSubmitTxResponse | PlainMessage<MsgSubmitTxResponse> | undefined): boolean {
    return proto3.util.equals(MsgSubmitTxResponse, a, b);
  }
}

