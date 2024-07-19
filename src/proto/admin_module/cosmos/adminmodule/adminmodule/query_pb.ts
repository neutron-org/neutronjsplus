// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/adminmodule/adminmodule/query.proto (package cosmos.adminmodule.adminmodule, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Proposal } from "../../gov/v1/gov_pb.js";
import { Proposal as Proposal$1 } from "../../gov/v1beta1/gov_pb.js";

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryAdminsRequest
 */
export class QueryAdminsRequest extends Message<QueryAdminsRequest> {
  constructor(data?: PartialMessage<QueryAdminsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryAdminsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAdminsRequest {
    return new QueryAdminsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAdminsRequest {
    return new QueryAdminsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAdminsRequest {
    return new QueryAdminsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAdminsRequest | PlainMessage<QueryAdminsRequest> | undefined, b: QueryAdminsRequest | PlainMessage<QueryAdminsRequest> | undefined): boolean {
    return proto3.util.equals(QueryAdminsRequest, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryAdminsResponse
 */
export class QueryAdminsResponse extends Message<QueryAdminsResponse> {
  /**
   * @generated from field: repeated string admins = 1;
   */
  admins: string[] = [];

  constructor(data?: PartialMessage<QueryAdminsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryAdminsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "admins", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAdminsResponse {
    return new QueryAdminsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAdminsResponse {
    return new QueryAdminsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAdminsResponse {
    return new QueryAdminsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAdminsResponse | PlainMessage<QueryAdminsResponse> | undefined, b: QueryAdminsResponse | PlainMessage<QueryAdminsResponse> | undefined): boolean {
    return proto3.util.equals(QueryAdminsResponse, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryArchivedProposalsRequest
 */
export class QueryArchivedProposalsRequest extends Message<QueryArchivedProposalsRequest> {
  constructor(data?: PartialMessage<QueryArchivedProposalsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryArchivedProposalsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryArchivedProposalsRequest {
    return new QueryArchivedProposalsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryArchivedProposalsRequest {
    return new QueryArchivedProposalsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryArchivedProposalsRequest {
    return new QueryArchivedProposalsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryArchivedProposalsRequest | PlainMessage<QueryArchivedProposalsRequest> | undefined, b: QueryArchivedProposalsRequest | PlainMessage<QueryArchivedProposalsRequest> | undefined): boolean {
    return proto3.util.equals(QueryArchivedProposalsRequest, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryArchivedProposalsLegacyRequest
 */
export class QueryArchivedProposalsLegacyRequest extends Message<QueryArchivedProposalsLegacyRequest> {
  constructor(data?: PartialMessage<QueryArchivedProposalsLegacyRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryArchivedProposalsLegacyRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryArchivedProposalsLegacyRequest {
    return new QueryArchivedProposalsLegacyRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryArchivedProposalsLegacyRequest {
    return new QueryArchivedProposalsLegacyRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryArchivedProposalsLegacyRequest {
    return new QueryArchivedProposalsLegacyRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryArchivedProposalsLegacyRequest | PlainMessage<QueryArchivedProposalsLegacyRequest> | undefined, b: QueryArchivedProposalsLegacyRequest | PlainMessage<QueryArchivedProposalsLegacyRequest> | undefined): boolean {
    return proto3.util.equals(QueryArchivedProposalsLegacyRequest, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryProposalsResponse
 */
export class QueryProposalsResponse extends Message<QueryProposalsResponse> {
  /**
   * @generated from field: repeated cosmos.gov.v1.Proposal proposals = 1;
   */
  proposals: Proposal[] = [];

  constructor(data?: PartialMessage<QueryProposalsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryProposalsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "proposals", kind: "message", T: Proposal, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryProposalsResponse {
    return new QueryProposalsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryProposalsResponse {
    return new QueryProposalsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryProposalsResponse {
    return new QueryProposalsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryProposalsResponse | PlainMessage<QueryProposalsResponse> | undefined, b: QueryProposalsResponse | PlainMessage<QueryProposalsResponse> | undefined): boolean {
    return proto3.util.equals(QueryProposalsResponse, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryArchivedProposalsResponse
 */
export class QueryArchivedProposalsResponse extends Message<QueryArchivedProposalsResponse> {
  /**
   * @generated from field: repeated cosmos.gov.v1.Proposal proposals = 1;
   */
  proposals: Proposal[] = [];

  constructor(data?: PartialMessage<QueryArchivedProposalsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryArchivedProposalsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "proposals", kind: "message", T: Proposal, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryArchivedProposalsResponse {
    return new QueryArchivedProposalsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryArchivedProposalsResponse {
    return new QueryArchivedProposalsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryArchivedProposalsResponse {
    return new QueryArchivedProposalsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryArchivedProposalsResponse | PlainMessage<QueryArchivedProposalsResponse> | undefined, b: QueryArchivedProposalsResponse | PlainMessage<QueryArchivedProposalsResponse> | undefined): boolean {
    return proto3.util.equals(QueryArchivedProposalsResponse, a, b);
  }
}

/**
 * @generated from message cosmos.adminmodule.adminmodule.QueryArchivedProposalsLegacyResponse
 */
export class QueryArchivedProposalsLegacyResponse extends Message<QueryArchivedProposalsLegacyResponse> {
  /**
   * @generated from field: repeated cosmos.gov.v1beta1.Proposal proposalsLegacy = 1;
   */
  proposalsLegacy: Proposal$1[] = [];

  constructor(data?: PartialMessage<QueryArchivedProposalsLegacyResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.adminmodule.adminmodule.QueryArchivedProposalsLegacyResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "proposalsLegacy", kind: "message", T: Proposal$1, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryArchivedProposalsLegacyResponse {
    return new QueryArchivedProposalsLegacyResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryArchivedProposalsLegacyResponse {
    return new QueryArchivedProposalsLegacyResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryArchivedProposalsLegacyResponse {
    return new QueryArchivedProposalsLegacyResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryArchivedProposalsLegacyResponse | PlainMessage<QueryArchivedProposalsLegacyResponse> | undefined, b: QueryArchivedProposalsLegacyResponse | PlainMessage<QueryArchivedProposalsLegacyResponse> | undefined): boolean {
    return proto3.util.equals(QueryArchivedProposalsLegacyResponse, a, b);
  }
}
