// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file neutron/interchainqueries/query.proto (package neutron.interchainqueries, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Params } from "./params_pb.js";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination_pb.js";
import { RegisteredQuery } from "./genesis_pb.js";
import { QueryResult } from "./tx_pb.js";

/**
 * QueryParamsRequest is request type for the Query/Params RPC method.
 *
 * @generated from message neutron.interchainqueries.QueryParamsRequest
 */
export class QueryParamsRequest extends Message<QueryParamsRequest> {
  constructor(data?: PartialMessage<QueryParamsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryParamsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
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
 * @generated from message neutron.interchainqueries.QueryParamsResponse
 */
export class QueryParamsResponse extends Message<QueryParamsResponse> {
  /**
   * params holds all the parameters of this module.
   *
   * @generated from field: neutron.interchainqueries.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<QueryParamsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryParamsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
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
 * @generated from message neutron.interchainqueries.QueryRegisteredQueriesRequest
 */
export class QueryRegisteredQueriesRequest extends Message<QueryRegisteredQueriesRequest> {
  /**
   * @generated from field: repeated string owners = 1;
   */
  owners: string[] = [];

  /**
   * @generated from field: string connection_id = 2;
   */
  connectionId = "";

  /**
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 3;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryRegisteredQueriesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueriesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "owners", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "pagination", kind: "message", T: PageRequest },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueriesRequest {
    return new QueryRegisteredQueriesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueriesRequest {
    return new QueryRegisteredQueriesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueriesRequest {
    return new QueryRegisteredQueriesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueriesRequest | PlainMessage<QueryRegisteredQueriesRequest> | undefined, b: QueryRegisteredQueriesRequest | PlainMessage<QueryRegisteredQueriesRequest> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueriesRequest, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryRegisteredQueriesResponse
 */
export class QueryRegisteredQueriesResponse extends Message<QueryRegisteredQueriesResponse> {
  /**
   * @generated from field: repeated neutron.interchainqueries.RegisteredQuery registered_queries = 1;
   */
  registeredQueries: RegisteredQuery[] = [];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryRegisteredQueriesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueriesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "registered_queries", kind: "message", T: RegisteredQuery, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueriesResponse {
    return new QueryRegisteredQueriesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueriesResponse {
    return new QueryRegisteredQueriesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueriesResponse {
    return new QueryRegisteredQueriesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueriesResponse | PlainMessage<QueryRegisteredQueriesResponse> | undefined, b: QueryRegisteredQueriesResponse | PlainMessage<QueryRegisteredQueriesResponse> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueriesResponse, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryRegisteredQueryRequest
 */
export class QueryRegisteredQueryRequest extends Message<QueryRegisteredQueryRequest> {
  /**
   * @generated from field: uint64 query_id = 1;
   */
  queryId = protoInt64.zero;

  constructor(data?: PartialMessage<QueryRegisteredQueryRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueryRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "query_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueryRequest {
    return new QueryRegisteredQueryRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueryRequest {
    return new QueryRegisteredQueryRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueryRequest {
    return new QueryRegisteredQueryRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueryRequest | PlainMessage<QueryRegisteredQueryRequest> | undefined, b: QueryRegisteredQueryRequest | PlainMessage<QueryRegisteredQueryRequest> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueryRequest, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryRegisteredQueryResponse
 */
export class QueryRegisteredQueryResponse extends Message<QueryRegisteredQueryResponse> {
  /**
   * @generated from field: neutron.interchainqueries.RegisteredQuery registered_query = 1;
   */
  registeredQuery?: RegisteredQuery;

  constructor(data?: PartialMessage<QueryRegisteredQueryResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueryResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "registered_query", kind: "message", T: RegisteredQuery },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueryResponse {
    return new QueryRegisteredQueryResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResponse {
    return new QueryRegisteredQueryResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResponse {
    return new QueryRegisteredQueryResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueryResponse | PlainMessage<QueryRegisteredQueryResponse> | undefined, b: QueryRegisteredQueryResponse | PlainMessage<QueryRegisteredQueryResponse> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueryResponse, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryRegisteredQueryResultRequest
 */
export class QueryRegisteredQueryResultRequest extends Message<QueryRegisteredQueryResultRequest> {
  /**
   * @generated from field: uint64 query_id = 1;
   */
  queryId = protoInt64.zero;

  constructor(data?: PartialMessage<QueryRegisteredQueryResultRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueryResultRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "query_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueryResultRequest {
    return new QueryRegisteredQueryResultRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResultRequest {
    return new QueryRegisteredQueryResultRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResultRequest {
    return new QueryRegisteredQueryResultRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueryResultRequest | PlainMessage<QueryRegisteredQueryResultRequest> | undefined, b: QueryRegisteredQueryResultRequest | PlainMessage<QueryRegisteredQueryResultRequest> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueryResultRequest, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryRegisteredQueryResultResponse
 */
export class QueryRegisteredQueryResultResponse extends Message<QueryRegisteredQueryResultResponse> {
  /**
   * @generated from field: neutron.interchainqueries.QueryResult result = 1;
   */
  result?: QueryResult;

  constructor(data?: PartialMessage<QueryRegisteredQueryResultResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryRegisteredQueryResultResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "message", T: QueryResult },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRegisteredQueryResultResponse {
    return new QueryRegisteredQueryResultResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResultResponse {
    return new QueryRegisteredQueryResultResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRegisteredQueryResultResponse {
    return new QueryRegisteredQueryResultResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryRegisteredQueryResultResponse | PlainMessage<QueryRegisteredQueryResultResponse> | undefined, b: QueryRegisteredQueryResultResponse | PlainMessage<QueryRegisteredQueryResultResponse> | undefined): boolean {
    return proto3.util.equals(QueryRegisteredQueryResultResponse, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.Transaction
 */
export class Transaction extends Message<Transaction> {
  /**
   * @generated from field: uint64 id = 1;
   */
  id = protoInt64.zero;

  /**
   * @generated from field: uint64 height = 2;
   */
  height = protoInt64.zero;

  /**
   * @generated from field: bytes data = 3;
   */
  data = new Uint8Array(0);

  constructor(data?: PartialMessage<Transaction>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.Transaction";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "data", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Transaction {
    return new Transaction().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Transaction {
    return new Transaction().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Transaction {
    return new Transaction().fromJsonString(jsonString, options);
  }

  static equals(a: Transaction | PlainMessage<Transaction> | undefined, b: Transaction | PlainMessage<Transaction> | undefined): boolean {
    return proto3.util.equals(Transaction, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryLastRemoteHeight
 */
export class QueryLastRemoteHeight extends Message<QueryLastRemoteHeight> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = "";

  constructor(data?: PartialMessage<QueryLastRemoteHeight>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryLastRemoteHeight";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryLastRemoteHeight {
    return new QueryLastRemoteHeight().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryLastRemoteHeight {
    return new QueryLastRemoteHeight().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryLastRemoteHeight {
    return new QueryLastRemoteHeight().fromJsonString(jsonString, options);
  }

  static equals(a: QueryLastRemoteHeight | PlainMessage<QueryLastRemoteHeight> | undefined, b: QueryLastRemoteHeight | PlainMessage<QueryLastRemoteHeight> | undefined): boolean {
    return proto3.util.equals(QueryLastRemoteHeight, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.QueryLastRemoteHeightResponse
 */
export class QueryLastRemoteHeightResponse extends Message<QueryLastRemoteHeightResponse> {
  /**
   * @generated from field: uint64 height = 1;
   */
  height = protoInt64.zero;

  constructor(data?: PartialMessage<QueryLastRemoteHeightResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.QueryLastRemoteHeightResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryLastRemoteHeightResponse {
    return new QueryLastRemoteHeightResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryLastRemoteHeightResponse {
    return new QueryLastRemoteHeightResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryLastRemoteHeightResponse {
    return new QueryLastRemoteHeightResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryLastRemoteHeightResponse | PlainMessage<QueryLastRemoteHeightResponse> | undefined, b: QueryLastRemoteHeightResponse | PlainMessage<QueryLastRemoteHeightResponse> | undefined): boolean {
    return proto3.util.equals(QueryLastRemoteHeightResponse, a, b);
  }
}
