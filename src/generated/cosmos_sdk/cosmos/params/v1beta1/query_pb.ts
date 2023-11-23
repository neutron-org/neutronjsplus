// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/params/v1beta1/query.proto (package cosmos.params.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { ParamChange } from "./params_pb.js";

/**
 * QueryParamsRequest is request type for the Query/Params RPC method.
 *
 * @generated from message cosmos.params.v1beta1.QueryParamsRequest
 */
export class QueryParamsRequest extends Message<QueryParamsRequest> {
  /**
   * subspace defines the module to query the parameter for.
   *
   * @generated from field: string subspace = 1;
   */
  subspace = "";

  /**
   * key defines the key of the parameter in the subspace.
   *
   * @generated from field: string key = 2;
   */
  key = "";

  constructor(data?: PartialMessage<QueryParamsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.params.v1beta1.QueryParamsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "subspace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryParamsRequest {
    return new QueryParamsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryParamsRequest {
    return new QueryParamsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryParamsRequest {
    return new QueryParamsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined, b: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined): boolean {
    return proto3.util.equals(QueryParamsRequest, a, b);
  }
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 *
 * @generated from message cosmos.params.v1beta1.QueryParamsResponse
 */
export class QueryParamsResponse extends Message<QueryParamsResponse> {
  /**
   * param defines the queried parameter.
   *
   * @generated from field: cosmos.params.v1beta1.ParamChange param = 1;
   */
  param?: ParamChange;

  constructor(data?: PartialMessage<QueryParamsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.params.v1beta1.QueryParamsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "param", kind: "message", T: ParamChange },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryParamsResponse {
    return new QueryParamsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryParamsResponse {
    return new QueryParamsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryParamsResponse {
    return new QueryParamsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined, b: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined): boolean {
    return proto3.util.equals(QueryParamsResponse, a, b);
  }
}

/**
 * QuerySubspacesRequest defines a request type for querying for all registered
 * subspaces and all keys for a subspace.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.params.v1beta1.QuerySubspacesRequest
 */
export class QuerySubspacesRequest extends Message<QuerySubspacesRequest> {
  constructor(data?: PartialMessage<QuerySubspacesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.params.v1beta1.QuerySubspacesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QuerySubspacesRequest {
    return new QuerySubspacesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QuerySubspacesRequest {
    return new QuerySubspacesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QuerySubspacesRequest {
    return new QuerySubspacesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QuerySubspacesRequest | PlainMessage<QuerySubspacesRequest> | undefined, b: QuerySubspacesRequest | PlainMessage<QuerySubspacesRequest> | undefined): boolean {
    return proto3.util.equals(QuerySubspacesRequest, a, b);
  }
}

/**
 * QuerySubspacesResponse defines the response types for querying for all
 * registered subspaces and all keys for a subspace.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.params.v1beta1.QuerySubspacesResponse
 */
export class QuerySubspacesResponse extends Message<QuerySubspacesResponse> {
  /**
   * @generated from field: repeated cosmos.params.v1beta1.Subspace subspaces = 1;
   */
  subspaces: Subspace[] = [];

  constructor(data?: PartialMessage<QuerySubspacesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.params.v1beta1.QuerySubspacesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "subspaces", kind: "message", T: Subspace, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QuerySubspacesResponse {
    return new QuerySubspacesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QuerySubspacesResponse {
    return new QuerySubspacesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QuerySubspacesResponse {
    return new QuerySubspacesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QuerySubspacesResponse | PlainMessage<QuerySubspacesResponse> | undefined, b: QuerySubspacesResponse | PlainMessage<QuerySubspacesResponse> | undefined): boolean {
    return proto3.util.equals(QuerySubspacesResponse, a, b);
  }
}

/**
 * Subspace defines a parameter subspace name and all the keys that exist for
 * the subspace.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.params.v1beta1.Subspace
 */
export class Subspace extends Message<Subspace> {
  /**
   * @generated from field: string subspace = 1;
   */
  subspace = "";

  /**
   * @generated from field: repeated string keys = 2;
   */
  keys: string[] = [];

  constructor(data?: PartialMessage<Subspace>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.params.v1beta1.Subspace";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "subspace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "keys", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Subspace {
    return new Subspace().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Subspace {
    return new Subspace().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Subspace {
    return new Subspace().fromJsonString(jsonString, options);
  }

  static equals(a: Subspace | PlainMessage<Subspace> | undefined, b: Subspace | PlainMessage<Subspace> | undefined): boolean {
    return proto3.util.equals(Subspace, a, b);
  }
}

