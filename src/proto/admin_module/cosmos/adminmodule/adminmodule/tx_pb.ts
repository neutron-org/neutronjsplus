// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/adminmodule/adminmodule/tx.proto (package cosmos.adminmodule.adminmodule, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message cosmos.adminmodule.adminmodule.MsgDeleteAdmin
 */
export class MsgDeleteAdmin extends Message<MsgDeleteAdmin> {
  /**
   * @generated from field: string creator = 1;
   */
  creator = "";

  /**
   * @generated from field: string admin = 2;
   */
  admin = "";

  constructor(data?: PartialMessage<MsgDeleteAdmin>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgDeleteAdmin";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "creator", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "admin", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgDeleteAdmin {
    return new MsgDeleteAdmin().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgDeleteAdmin {
    return new MsgDeleteAdmin().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgDeleteAdmin {
    return new MsgDeleteAdmin().fromJsonString(jsonString, options);
  }

  static equals(a: MsgDeleteAdmin | PlainMessage<MsgDeleteAdmin> | undefined, b: MsgDeleteAdmin | PlainMessage<MsgDeleteAdmin> | undefined): boolean {
    return proto3.util.equals(MsgDeleteAdmin, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.MsgDeleteAdminResponse
 */
export class MsgDeleteAdminResponse extends Message<MsgDeleteAdminResponse> {
  constructor(data?: PartialMessage<MsgDeleteAdminResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgDeleteAdminResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgDeleteAdminResponse {
    return new MsgDeleteAdminResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgDeleteAdminResponse {
    return new MsgDeleteAdminResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgDeleteAdminResponse {
    return new MsgDeleteAdminResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgDeleteAdminResponse | PlainMessage<MsgDeleteAdminResponse> | undefined, b: MsgDeleteAdminResponse | PlainMessage<MsgDeleteAdminResponse> | undefined): boolean {
    return proto3.util.equals(MsgDeleteAdminResponse, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.MsgAddAdmin
 */
export class MsgAddAdmin extends Message<MsgAddAdmin> {
  /**
   * @generated from field: string creator = 1;
   */
  creator = "";

  /**
   * @generated from field: string admin = 2;
   */
  admin = "";

  constructor(data?: PartialMessage<MsgAddAdmin>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgAddAdmin";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "creator", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "admin", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAddAdmin {
    return new MsgAddAdmin().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAddAdmin {
    return new MsgAddAdmin().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAddAdmin {
    return new MsgAddAdmin().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAddAdmin | PlainMessage<MsgAddAdmin> | undefined, b: MsgAddAdmin | PlainMessage<MsgAddAdmin> | undefined): boolean {
    return proto3.util.equals(MsgAddAdmin, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.MsgAddAdminResponse
 */
export class MsgAddAdminResponse extends Message<MsgAddAdminResponse> {
  constructor(data?: PartialMessage<MsgAddAdminResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgAddAdminResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAddAdminResponse {
    return new MsgAddAdminResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAddAdminResponse {
    return new MsgAddAdminResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAddAdminResponse {
    return new MsgAddAdminResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAddAdminResponse | PlainMessage<MsgAddAdminResponse> | undefined, b: MsgAddAdminResponse | PlainMessage<MsgAddAdminResponse> | undefined): boolean {
    return proto3.util.equals(MsgAddAdminResponse, a, b);
  }
}

/**
 * MsgSubmitProposalLegacy defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 *
 * @generated from message cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy
 */
export class MsgSubmitProposalLegacy extends Message<MsgSubmitProposalLegacy> {
  /**
   * @generated from field: google.protobuf.Any content = 1;
   */
  content?: Any;

  /**
   * @generated from field: string proposer = 2;
   */
  proposer = "";

  constructor(data?: PartialMessage<MsgSubmitProposalLegacy>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "content", kind: "message", T: Any },
    { no: 2, name: "proposer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitProposalLegacy {
    return new MsgSubmitProposalLegacy().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitProposalLegacy {
    return new MsgSubmitProposalLegacy().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitProposalLegacy {
    return new MsgSubmitProposalLegacy().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitProposalLegacy | PlainMessage<MsgSubmitProposalLegacy> | undefined, b: MsgSubmitProposalLegacy | PlainMessage<MsgSubmitProposalLegacy> | undefined): boolean {
    return proto3.util.equals(MsgSubmitProposalLegacy, a, b);
  }
}

/**
 * MsgSubmitProposalLegacyResponse defines the Msg/SubmitProposalLegacy response type.
 *
 * @generated from message cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacyResponse
 */
export class MsgSubmitProposalLegacyResponse extends Message<MsgSubmitProposalLegacyResponse> {
  /**
   * @generated from field: uint64 proposal_id = 1;
   */
  proposalId = protoInt64.zero;

  constructor(data?: PartialMessage<MsgSubmitProposalLegacyResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacyResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "proposal_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitProposalLegacyResponse {
    return new MsgSubmitProposalLegacyResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitProposalLegacyResponse {
    return new MsgSubmitProposalLegacyResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitProposalLegacyResponse {
    return new MsgSubmitProposalLegacyResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitProposalLegacyResponse | PlainMessage<MsgSubmitProposalLegacyResponse> | undefined, b: MsgSubmitProposalLegacyResponse | PlainMessage<MsgSubmitProposalLegacyResponse> | undefined): boolean {
    return proto3.util.equals(MsgSubmitProposalLegacyResponse, a, b);
  }
}

/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 *
 * @generated from message cosmos.adminmodule.adminmodule.MsgSubmitProposal
 */
export class MsgSubmitProposal extends Message<MsgSubmitProposal> {
  /**
   * messages are the arbitrary messages to be executed if proposal passes.
   *
   * @generated from field: repeated google.protobuf.Any messages = 1;
   */
  messages: Any[] = [];

  /**
   * @generated from field: string proposer = 2;
   */
  proposer = "";

  constructor(data?: PartialMessage<MsgSubmitProposal>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgSubmitProposal";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "messages", kind: "message", T: Any, repeated: true },
    { no: 2, name: "proposer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitProposal {
    return new MsgSubmitProposal().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitProposal {
    return new MsgSubmitProposal().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitProposal {
    return new MsgSubmitProposal().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitProposal | PlainMessage<MsgSubmitProposal> | undefined, b: MsgSubmitProposal | PlainMessage<MsgSubmitProposal> | undefined): boolean {
    return proto3.util.equals(MsgSubmitProposal, a, b);
  }
}

/**
 * MsgSubmitProposalResponse defines the Msg/SubmitProposal response type.
 *
 * @generated from message cosmos.adminmodule.adminmodule.MsgSubmitProposalResponse
 */
export class MsgSubmitProposalResponse extends Message<MsgSubmitProposalResponse> {
  /**
   * @generated from field: uint64 proposal_id = 1;
   */
  proposalId = protoInt64.zero;

  constructor(data?: PartialMessage<MsgSubmitProposalResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.MsgSubmitProposalResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "proposal_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgSubmitProposalResponse {
    return new MsgSubmitProposalResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgSubmitProposalResponse {
    return new MsgSubmitProposalResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgSubmitProposalResponse {
    return new MsgSubmitProposalResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgSubmitProposalResponse | PlainMessage<MsgSubmitProposalResponse> | undefined, b: MsgSubmitProposalResponse | PlainMessage<MsgSubmitProposalResponse> | undefined): boolean {
    return proto3.util.equals(MsgSubmitProposalResponse, a, b);
  }
}

