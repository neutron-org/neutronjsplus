// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/auth/v1beta1/query.proto (package cosmos.auth.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { PageRequest, PageResponse } from "../../base/query/v1beta1/pagination_pb.js";
import { BaseAccount, Params } from "./auth_pb.js";

/**
 * QueryAccountsRequest is the request type for the Query/Accounts RPC method.
 *
 * Since: cosmos-sdk 0.43
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountsRequest
 */
export class QueryAccountsRequest extends Message<QueryAccountsRequest> {
  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 1;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryAccountsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "pagination", kind: "message", T: PageRequest },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountsRequest {
    return new QueryAccountsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountsRequest {
    return new QueryAccountsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountsRequest {
    return new QueryAccountsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountsRequest | PlainMessage<QueryAccountsRequest> | undefined, b: QueryAccountsRequest | PlainMessage<QueryAccountsRequest> | undefined): boolean {
    return proto3.util.equals(QueryAccountsRequest, a, b);
  }
}

/**
 * QueryAccountsResponse is the response type for the Query/Accounts RPC method.
 *
 * Since: cosmos-sdk 0.43
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountsResponse
 */
export class QueryAccountsResponse extends Message<QueryAccountsResponse> {
  /**
   * accounts are the existing accounts
   *
   * @generated from field: repeated google.protobuf.Any accounts = 1;
   */
  accounts: Any[] = [];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryAccountsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "accounts", kind: "message", T: Any, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountsResponse {
    return new QueryAccountsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountsResponse {
    return new QueryAccountsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountsResponse {
    return new QueryAccountsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountsResponse | PlainMessage<QueryAccountsResponse> | undefined, b: QueryAccountsResponse | PlainMessage<QueryAccountsResponse> | undefined): boolean {
    return proto3.util.equals(QueryAccountsResponse, a, b);
  }
}

/**
 * QueryAccountRequest is the request type for the Query/Account RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountRequest
 */
export class QueryAccountRequest extends Message<QueryAccountRequest> {
  /**
   * address defines the address to query for.
   *
   * @generated from field: string address = 1;
   */
  address = "";

  constructor(data?: PartialMessage<QueryAccountRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountRequest {
    return new QueryAccountRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountRequest {
    return new QueryAccountRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountRequest {
    return new QueryAccountRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountRequest | PlainMessage<QueryAccountRequest> | undefined, b: QueryAccountRequest | PlainMessage<QueryAccountRequest> | undefined): boolean {
    return proto3.util.equals(QueryAccountRequest, a, b);
  }
}

/**
 * QueryAccountResponse is the response type for the Query/Account RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountResponse
 */
export class QueryAccountResponse extends Message<QueryAccountResponse> {
  /**
   * account defines the account of the corresponding address.
   *
   * @generated from field: google.protobuf.Any account = 1;
   */
  account?: Any;

  constructor(data?: PartialMessage<QueryAccountResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account", kind: "message", T: Any },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountResponse {
    return new QueryAccountResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountResponse {
    return new QueryAccountResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountResponse {
    return new QueryAccountResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountResponse | PlainMessage<QueryAccountResponse> | undefined, b: QueryAccountResponse | PlainMessage<QueryAccountResponse> | undefined): boolean {
    return proto3.util.equals(QueryAccountResponse, a, b);
  }
}

/**
 * QueryParamsRequest is the request type for the Query/Params RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryParamsRequest
 */
export class QueryParamsRequest extends Message<QueryParamsRequest> {
  constructor(data?: PartialMessage<QueryParamsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryParamsRequest";
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
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryParamsResponse
 */
export class QueryParamsResponse extends Message<QueryParamsResponse> {
  /**
   * params defines the parameters of the module.
   *
   * @generated from field: cosmos.auth.v1beta1.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<QueryParamsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryParamsResponse";
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
 * QueryModuleAccountsRequest is the request type for the Query/ModuleAccounts RPC method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.QueryModuleAccountsRequest
 */
export class QueryModuleAccountsRequest extends Message<QueryModuleAccountsRequest> {
  constructor(data?: PartialMessage<QueryModuleAccountsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryModuleAccountsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryModuleAccountsRequest {
    return new QueryModuleAccountsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryModuleAccountsRequest {
    return new QueryModuleAccountsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryModuleAccountsRequest {
    return new QueryModuleAccountsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryModuleAccountsRequest | PlainMessage<QueryModuleAccountsRequest> | undefined, b: QueryModuleAccountsRequest | PlainMessage<QueryModuleAccountsRequest> | undefined): boolean {
    return proto3.util.equals(QueryModuleAccountsRequest, a, b);
  }
}

/**
 * QueryModuleAccountsResponse is the response type for the Query/ModuleAccounts RPC method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.QueryModuleAccountsResponse
 */
export class QueryModuleAccountsResponse extends Message<QueryModuleAccountsResponse> {
  /**
   * @generated from field: repeated google.protobuf.Any accounts = 1;
   */
  accounts: Any[] = [];

  constructor(data?: PartialMessage<QueryModuleAccountsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryModuleAccountsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "accounts", kind: "message", T: Any, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryModuleAccountsResponse {
    return new QueryModuleAccountsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryModuleAccountsResponse {
    return new QueryModuleAccountsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryModuleAccountsResponse {
    return new QueryModuleAccountsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryModuleAccountsResponse | PlainMessage<QueryModuleAccountsResponse> | undefined, b: QueryModuleAccountsResponse | PlainMessage<QueryModuleAccountsResponse> | undefined): boolean {
    return proto3.util.equals(QueryModuleAccountsResponse, a, b);
  }
}

/**
 * QueryModuleAccountByNameRequest is the request type for the Query/ModuleAccountByName RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryModuleAccountByNameRequest
 */
export class QueryModuleAccountByNameRequest extends Message<QueryModuleAccountByNameRequest> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  constructor(data?: PartialMessage<QueryModuleAccountByNameRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryModuleAccountByNameRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryModuleAccountByNameRequest {
    return new QueryModuleAccountByNameRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryModuleAccountByNameRequest {
    return new QueryModuleAccountByNameRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryModuleAccountByNameRequest {
    return new QueryModuleAccountByNameRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryModuleAccountByNameRequest | PlainMessage<QueryModuleAccountByNameRequest> | undefined, b: QueryModuleAccountByNameRequest | PlainMessage<QueryModuleAccountByNameRequest> | undefined): boolean {
    return proto3.util.equals(QueryModuleAccountByNameRequest, a, b);
  }
}

/**
 * QueryModuleAccountByNameResponse is the response type for the Query/ModuleAccountByName RPC method.
 *
 * @generated from message cosmos.auth.v1beta1.QueryModuleAccountByNameResponse
 */
export class QueryModuleAccountByNameResponse extends Message<QueryModuleAccountByNameResponse> {
  /**
   * @generated from field: google.protobuf.Any account = 1;
   */
  account?: Any;

  constructor(data?: PartialMessage<QueryModuleAccountByNameResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryModuleAccountByNameResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account", kind: "message", T: Any },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryModuleAccountByNameResponse {
    return new QueryModuleAccountByNameResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryModuleAccountByNameResponse {
    return new QueryModuleAccountByNameResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryModuleAccountByNameResponse {
    return new QueryModuleAccountByNameResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryModuleAccountByNameResponse | PlainMessage<QueryModuleAccountByNameResponse> | undefined, b: QueryModuleAccountByNameResponse | PlainMessage<QueryModuleAccountByNameResponse> | undefined): boolean {
    return proto3.util.equals(QueryModuleAccountByNameResponse, a, b);
  }
}

/**
 * Bech32PrefixRequest is the request type for Bech32Prefix rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.Bech32PrefixRequest
 */
export class Bech32PrefixRequest extends Message<Bech32PrefixRequest> {
  constructor(data?: PartialMessage<Bech32PrefixRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.Bech32PrefixRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Bech32PrefixRequest {
    return new Bech32PrefixRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Bech32PrefixRequest {
    return new Bech32PrefixRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Bech32PrefixRequest {
    return new Bech32PrefixRequest().fromJsonString(jsonString, options);
  }

  static equals(a: Bech32PrefixRequest | PlainMessage<Bech32PrefixRequest> | undefined, b: Bech32PrefixRequest | PlainMessage<Bech32PrefixRequest> | undefined): boolean {
    return proto3.util.equals(Bech32PrefixRequest, a, b);
  }
}

/**
 * Bech32PrefixResponse is the response type for Bech32Prefix rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.Bech32PrefixResponse
 */
export class Bech32PrefixResponse extends Message<Bech32PrefixResponse> {
  /**
   * @generated from field: string bech32_prefix = 1;
   */
  bech32Prefix = "";

  constructor(data?: PartialMessage<Bech32PrefixResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.Bech32PrefixResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "bech32_prefix", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Bech32PrefixResponse {
    return new Bech32PrefixResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Bech32PrefixResponse {
    return new Bech32PrefixResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Bech32PrefixResponse {
    return new Bech32PrefixResponse().fromJsonString(jsonString, options);
  }

  static equals(a: Bech32PrefixResponse | PlainMessage<Bech32PrefixResponse> | undefined, b: Bech32PrefixResponse | PlainMessage<Bech32PrefixResponse> | undefined): boolean {
    return proto3.util.equals(Bech32PrefixResponse, a, b);
  }
}

/**
 * AddressBytesToStringRequest is the request type for AddressString rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.AddressBytesToStringRequest
 */
export class AddressBytesToStringRequest extends Message<AddressBytesToStringRequest> {
  /**
   * @generated from field: bytes address_bytes = 1;
   */
  addressBytes = new Uint8Array(0);

  constructor(data?: PartialMessage<AddressBytesToStringRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.AddressBytesToStringRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address_bytes", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddressBytesToStringRequest {
    return new AddressBytesToStringRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddressBytesToStringRequest {
    return new AddressBytesToStringRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddressBytesToStringRequest {
    return new AddressBytesToStringRequest().fromJsonString(jsonString, options);
  }

  static equals(a: AddressBytesToStringRequest | PlainMessage<AddressBytesToStringRequest> | undefined, b: AddressBytesToStringRequest | PlainMessage<AddressBytesToStringRequest> | undefined): boolean {
    return proto3.util.equals(AddressBytesToStringRequest, a, b);
  }
}

/**
 * AddressBytesToStringResponse is the response type for AddressString rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.AddressBytesToStringResponse
 */
export class AddressBytesToStringResponse extends Message<AddressBytesToStringResponse> {
  /**
   * @generated from field: string address_string = 1;
   */
  addressString = "";

  constructor(data?: PartialMessage<AddressBytesToStringResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.AddressBytesToStringResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address_string", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddressBytesToStringResponse {
    return new AddressBytesToStringResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddressBytesToStringResponse {
    return new AddressBytesToStringResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddressBytesToStringResponse {
    return new AddressBytesToStringResponse().fromJsonString(jsonString, options);
  }

  static equals(a: AddressBytesToStringResponse | PlainMessage<AddressBytesToStringResponse> | undefined, b: AddressBytesToStringResponse | PlainMessage<AddressBytesToStringResponse> | undefined): boolean {
    return proto3.util.equals(AddressBytesToStringResponse, a, b);
  }
}

/**
 * AddressStringToBytesRequest is the request type for AccountBytes rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.AddressStringToBytesRequest
 */
export class AddressStringToBytesRequest extends Message<AddressStringToBytesRequest> {
  /**
   * @generated from field: string address_string = 1;
   */
  addressString = "";

  constructor(data?: PartialMessage<AddressStringToBytesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.AddressStringToBytesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address_string", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddressStringToBytesRequest {
    return new AddressStringToBytesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddressStringToBytesRequest {
    return new AddressStringToBytesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddressStringToBytesRequest {
    return new AddressStringToBytesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: AddressStringToBytesRequest | PlainMessage<AddressStringToBytesRequest> | undefined, b: AddressStringToBytesRequest | PlainMessage<AddressStringToBytesRequest> | undefined): boolean {
    return proto3.util.equals(AddressStringToBytesRequest, a, b);
  }
}

/**
 * AddressStringToBytesResponse is the response type for AddressBytes rpc method.
 *
 * Since: cosmos-sdk 0.46
 *
 * @generated from message cosmos.auth.v1beta1.AddressStringToBytesResponse
 */
export class AddressStringToBytesResponse extends Message<AddressStringToBytesResponse> {
  /**
   * @generated from field: bytes address_bytes = 1;
   */
  addressBytes = new Uint8Array(0);

  constructor(data?: PartialMessage<AddressStringToBytesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.AddressStringToBytesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address_bytes", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddressStringToBytesResponse {
    return new AddressStringToBytesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddressStringToBytesResponse {
    return new AddressStringToBytesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddressStringToBytesResponse {
    return new AddressStringToBytesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: AddressStringToBytesResponse | PlainMessage<AddressStringToBytesResponse> | undefined, b: AddressStringToBytesResponse | PlainMessage<AddressStringToBytesResponse> | undefined): boolean {
    return proto3.util.equals(AddressStringToBytesResponse, a, b);
  }
}

/**
 * QueryAccountAddressByIDRequest is the request type for AccountAddressByID rpc method
 *
 * Since: cosmos-sdk 0.46.2
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountAddressByIDRequest
 */
export class QueryAccountAddressByIDRequest extends Message<QueryAccountAddressByIDRequest> {
  /**
   * Deprecated, use account_id instead
   *
   * id is the account number of the address to be queried. This field
   * should have been an uint64 (like all account numbers), and will be
   * updated to uint64 in a future version of the auth query.
   *
   * @generated from field: int64 id = 1 [deprecated = true];
   * @deprecated
   */
  id = protoInt64.zero;

  /**
   * account_id is the account number of the address to be queried.
   *
   * Since: cosmos-sdk 0.47
   *
   * @generated from field: uint64 account_id = 2;
   */
  accountId = protoInt64.zero;

  constructor(data?: PartialMessage<QueryAccountAddressByIDRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountAddressByIDRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "account_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountAddressByIDRequest {
    return new QueryAccountAddressByIDRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountAddressByIDRequest {
    return new QueryAccountAddressByIDRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountAddressByIDRequest {
    return new QueryAccountAddressByIDRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountAddressByIDRequest | PlainMessage<QueryAccountAddressByIDRequest> | undefined, b: QueryAccountAddressByIDRequest | PlainMessage<QueryAccountAddressByIDRequest> | undefined): boolean {
    return proto3.util.equals(QueryAccountAddressByIDRequest, a, b);
  }
}

/**
 * QueryAccountAddressByIDResponse is the response type for AccountAddressByID rpc method
 *
 * Since: cosmos-sdk 0.46.2
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountAddressByIDResponse
 */
export class QueryAccountAddressByIDResponse extends Message<QueryAccountAddressByIDResponse> {
  /**
   * @generated from field: string account_address = 1;
   */
  accountAddress = "";

  constructor(data?: PartialMessage<QueryAccountAddressByIDResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountAddressByIDResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountAddressByIDResponse {
    return new QueryAccountAddressByIDResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountAddressByIDResponse {
    return new QueryAccountAddressByIDResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountAddressByIDResponse {
    return new QueryAccountAddressByIDResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountAddressByIDResponse | PlainMessage<QueryAccountAddressByIDResponse> | undefined, b: QueryAccountAddressByIDResponse | PlainMessage<QueryAccountAddressByIDResponse> | undefined): boolean {
    return proto3.util.equals(QueryAccountAddressByIDResponse, a, b);
  }
}

/**
 * QueryAccountInfoRequest is the Query/AccountInfo request type.
 *
 * Since: cosmos-sdk 0.47
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountInfoRequest
 */
export class QueryAccountInfoRequest extends Message<QueryAccountInfoRequest> {
  /**
   * address is the account address string.
   *
   * @generated from field: string address = 1;
   */
  address = "";

  constructor(data?: PartialMessage<QueryAccountInfoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountInfoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountInfoRequest {
    return new QueryAccountInfoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountInfoRequest {
    return new QueryAccountInfoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountInfoRequest {
    return new QueryAccountInfoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountInfoRequest | PlainMessage<QueryAccountInfoRequest> | undefined, b: QueryAccountInfoRequest | PlainMessage<QueryAccountInfoRequest> | undefined): boolean {
    return proto3.util.equals(QueryAccountInfoRequest, a, b);
  }
}

/**
 * QueryAccountInfoResponse is the Query/AccountInfo response type.
 *
 * Since: cosmos-sdk 0.47
 *
 * @generated from message cosmos.auth.v1beta1.QueryAccountInfoResponse
 */
export class QueryAccountInfoResponse extends Message<QueryAccountInfoResponse> {
  /**
   * info is the account info which is represented by BaseAccount.
   *
   * @generated from field: cosmos.auth.v1beta1.BaseAccount info = 1;
   */
  info?: BaseAccount;

  constructor(data?: PartialMessage<QueryAccountInfoResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.v1beta1.QueryAccountInfoResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "info", kind: "message", T: BaseAccount },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryAccountInfoResponse {
    return new QueryAccountInfoResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryAccountInfoResponse {
    return new QueryAccountInfoResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryAccountInfoResponse {
    return new QueryAccountInfoResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryAccountInfoResponse | PlainMessage<QueryAccountInfoResponse> | undefined, b: QueryAccountInfoResponse | PlainMessage<QueryAccountInfoResponse> | undefined): boolean {
    return proto3.util.equals(QueryAccountInfoResponse, a, b);
  }
}

