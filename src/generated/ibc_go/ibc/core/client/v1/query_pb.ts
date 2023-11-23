// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file ibc/core/client/v1/query.proto (package ibc.core.client.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { ConsensusStateWithHeight, Height, IdentifiedClientState, Params } from "./client_pb.js";
import { PageRequest, PageResponse } from "../../../../cosmos/base/query/v1beta1/pagination_pb.js";

/**
 * QueryClientStateRequest is the request type for the Query/ClientState RPC
 * method
 *
 * @generated from message ibc.core.client.v1.QueryClientStateRequest
 */
export class QueryClientStateRequest extends Message<QueryClientStateRequest> {
  /**
   * client state unique identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = "";

  constructor(data?: PartialMessage<QueryClientStateRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStateRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStateRequest {
    return new QueryClientStateRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStateRequest {
    return new QueryClientStateRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStateRequest {
    return new QueryClientStateRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStateRequest | PlainMessage<QueryClientStateRequest> | undefined, b: QueryClientStateRequest | PlainMessage<QueryClientStateRequest> | undefined): boolean {
    return proto3.util.equals(QueryClientStateRequest, a, b);
  }
}

/**
 * QueryClientStateResponse is the response type for the Query/ClientState RPC
 * method. Besides the client state, it includes a proof and the height from
 * which the proof was retrieved.
 *
 * @generated from message ibc.core.client.v1.QueryClientStateResponse
 */
export class QueryClientStateResponse extends Message<QueryClientStateResponse> {
  /**
   * client state associated with the request identifier
   *
   * @generated from field: google.protobuf.Any client_state = 1;
   */
  clientState?: Any;

  /**
   * merkle proof of existence
   *
   * @generated from field: bytes proof = 2;
   */
  proof = new Uint8Array(0);

  /**
   * height at which the proof was retrieved
   *
   * @generated from field: ibc.core.client.v1.Height proof_height = 3;
   */
  proofHeight?: Height;

  constructor(data?: PartialMessage<QueryClientStateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_state", kind: "message", T: Any },
    { no: 2, name: "proof", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_height", kind: "message", T: Height },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStateResponse {
    return new QueryClientStateResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStateResponse {
    return new QueryClientStateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStateResponse {
    return new QueryClientStateResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStateResponse | PlainMessage<QueryClientStateResponse> | undefined, b: QueryClientStateResponse | PlainMessage<QueryClientStateResponse> | undefined): boolean {
    return proto3.util.equals(QueryClientStateResponse, a, b);
  }
}

/**
 * QueryClientStatesRequest is the request type for the Query/ClientStates RPC
 * method
 *
 * @generated from message ibc.core.client.v1.QueryClientStatesRequest
 */
export class QueryClientStatesRequest extends Message<QueryClientStatesRequest> {
  /**
   * pagination request
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 1;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryClientStatesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStatesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "pagination", kind: "message", T: PageRequest },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStatesRequest {
    return new QueryClientStatesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStatesRequest {
    return new QueryClientStatesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStatesRequest {
    return new QueryClientStatesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStatesRequest | PlainMessage<QueryClientStatesRequest> | undefined, b: QueryClientStatesRequest | PlainMessage<QueryClientStatesRequest> | undefined): boolean {
    return proto3.util.equals(QueryClientStatesRequest, a, b);
  }
}

/**
 * QueryClientStatesResponse is the response type for the Query/ClientStates RPC
 * method.
 *
 * @generated from message ibc.core.client.v1.QueryClientStatesResponse
 */
export class QueryClientStatesResponse extends Message<QueryClientStatesResponse> {
  /**
   * list of stored ClientStates of the chain.
   *
   * @generated from field: repeated ibc.core.client.v1.IdentifiedClientState client_states = 1;
   */
  clientStates: IdentifiedClientState[] = [];

  /**
   * pagination response
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryClientStatesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStatesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_states", kind: "message", T: IdentifiedClientState, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStatesResponse {
    return new QueryClientStatesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStatesResponse {
    return new QueryClientStatesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStatesResponse {
    return new QueryClientStatesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStatesResponse | PlainMessage<QueryClientStatesResponse> | undefined, b: QueryClientStatesResponse | PlainMessage<QueryClientStatesResponse> | undefined): boolean {
    return proto3.util.equals(QueryClientStatesResponse, a, b);
  }
}

/**
 * QueryConsensusStateRequest is the request type for the Query/ConsensusState
 * RPC method. Besides the consensus state, it includes a proof and the height
 * from which the proof was retrieved.
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStateRequest
 */
export class QueryConsensusStateRequest extends Message<QueryConsensusStateRequest> {
  /**
   * client identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = "";

  /**
   * consensus state revision number
   *
   * @generated from field: uint64 revision_number = 2;
   */
  revisionNumber = protoInt64.zero;

  /**
   * consensus state revision height
   *
   * @generated from field: uint64 revision_height = 3;
   */
  revisionHeight = protoInt64.zero;

  /**
   * latest_height overrrides the height field and queries the latest stored
   * ConsensusState
   *
   * @generated from field: bool latest_height = 4;
   */
  latestHeight = false;

  constructor(data?: PartialMessage<QueryConsensusStateRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStateRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "revision_number", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "revision_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "latest_height", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStateRequest {
    return new QueryConsensusStateRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStateRequest {
    return new QueryConsensusStateRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStateRequest {
    return new QueryConsensusStateRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStateRequest | PlainMessage<QueryConsensusStateRequest> | undefined, b: QueryConsensusStateRequest | PlainMessage<QueryConsensusStateRequest> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStateRequest, a, b);
  }
}

/**
 * QueryConsensusStateResponse is the response type for the Query/ConsensusState
 * RPC method
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStateResponse
 */
export class QueryConsensusStateResponse extends Message<QueryConsensusStateResponse> {
  /**
   * consensus state associated with the client identifier at the given height
   *
   * @generated from field: google.protobuf.Any consensus_state = 1;
   */
  consensusState?: Any;

  /**
   * merkle proof of existence
   *
   * @generated from field: bytes proof = 2;
   */
  proof = new Uint8Array(0);

  /**
   * height at which the proof was retrieved
   *
   * @generated from field: ibc.core.client.v1.Height proof_height = 3;
   */
  proofHeight?: Height;

  constructor(data?: PartialMessage<QueryConsensusStateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "consensus_state", kind: "message", T: Any },
    { no: 2, name: "proof", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_height", kind: "message", T: Height },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStateResponse {
    return new QueryConsensusStateResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStateResponse {
    return new QueryConsensusStateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStateResponse {
    return new QueryConsensusStateResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStateResponse | PlainMessage<QueryConsensusStateResponse> | undefined, b: QueryConsensusStateResponse | PlainMessage<QueryConsensusStateResponse> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStateResponse, a, b);
  }
}

/**
 * QueryConsensusStatesRequest is the request type for the Query/ConsensusStates
 * RPC method.
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStatesRequest
 */
export class QueryConsensusStatesRequest extends Message<QueryConsensusStatesRequest> {
  /**
   * client identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = "";

  /**
   * pagination request
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 2;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryConsensusStatesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStatesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "pagination", kind: "message", T: PageRequest },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStatesRequest {
    return new QueryConsensusStatesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStatesRequest {
    return new QueryConsensusStatesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStatesRequest {
    return new QueryConsensusStatesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStatesRequest | PlainMessage<QueryConsensusStatesRequest> | undefined, b: QueryConsensusStatesRequest | PlainMessage<QueryConsensusStatesRequest> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStatesRequest, a, b);
  }
}

/**
 * QueryConsensusStatesResponse is the response type for the
 * Query/ConsensusStates RPC method
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStatesResponse
 */
export class QueryConsensusStatesResponse extends Message<QueryConsensusStatesResponse> {
  /**
   * consensus states associated with the identifier
   *
   * @generated from field: repeated ibc.core.client.v1.ConsensusStateWithHeight consensus_states = 1;
   */
  consensusStates: ConsensusStateWithHeight[] = [];

  /**
   * pagination response
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryConsensusStatesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStatesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "consensus_states", kind: "message", T: ConsensusStateWithHeight, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStatesResponse {
    return new QueryConsensusStatesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStatesResponse {
    return new QueryConsensusStatesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStatesResponse {
    return new QueryConsensusStatesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStatesResponse | PlainMessage<QueryConsensusStatesResponse> | undefined, b: QueryConsensusStatesResponse | PlainMessage<QueryConsensusStatesResponse> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStatesResponse, a, b);
  }
}

/**
 * QueryConsensusStateHeightsRequest is the request type for Query/ConsensusStateHeights
 * RPC method.
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStateHeightsRequest
 */
export class QueryConsensusStateHeightsRequest extends Message<QueryConsensusStateHeightsRequest> {
  /**
   * client identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = "";

  /**
   * pagination request
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 2;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryConsensusStateHeightsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStateHeightsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "pagination", kind: "message", T: PageRequest },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStateHeightsRequest {
    return new QueryConsensusStateHeightsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStateHeightsRequest {
    return new QueryConsensusStateHeightsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStateHeightsRequest {
    return new QueryConsensusStateHeightsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStateHeightsRequest | PlainMessage<QueryConsensusStateHeightsRequest> | undefined, b: QueryConsensusStateHeightsRequest | PlainMessage<QueryConsensusStateHeightsRequest> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStateHeightsRequest, a, b);
  }
}

/**
 * QueryConsensusStateHeightsResponse is the response type for the
 * Query/ConsensusStateHeights RPC method
 *
 * @generated from message ibc.core.client.v1.QueryConsensusStateHeightsResponse
 */
export class QueryConsensusStateHeightsResponse extends Message<QueryConsensusStateHeightsResponse> {
  /**
   * consensus state heights
   *
   * @generated from field: repeated ibc.core.client.v1.Height consensus_state_heights = 1;
   */
  consensusStateHeights: Height[] = [];

  /**
   * pagination response
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryConsensusStateHeightsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryConsensusStateHeightsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "consensus_state_heights", kind: "message", T: Height, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConsensusStateHeightsResponse {
    return new QueryConsensusStateHeightsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConsensusStateHeightsResponse {
    return new QueryConsensusStateHeightsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConsensusStateHeightsResponse {
    return new QueryConsensusStateHeightsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConsensusStateHeightsResponse | PlainMessage<QueryConsensusStateHeightsResponse> | undefined, b: QueryConsensusStateHeightsResponse | PlainMessage<QueryConsensusStateHeightsResponse> | undefined): boolean {
    return proto3.util.equals(QueryConsensusStateHeightsResponse, a, b);
  }
}

/**
 * QueryClientStatusRequest is the request type for the Query/ClientStatus RPC
 * method
 *
 * @generated from message ibc.core.client.v1.QueryClientStatusRequest
 */
export class QueryClientStatusRequest extends Message<QueryClientStatusRequest> {
  /**
   * client unique identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = "";

  constructor(data?: PartialMessage<QueryClientStatusRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStatusRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStatusRequest {
    return new QueryClientStatusRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStatusRequest {
    return new QueryClientStatusRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStatusRequest {
    return new QueryClientStatusRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStatusRequest | PlainMessage<QueryClientStatusRequest> | undefined, b: QueryClientStatusRequest | PlainMessage<QueryClientStatusRequest> | undefined): boolean {
    return proto3.util.equals(QueryClientStatusRequest, a, b);
  }
}

/**
 * QueryClientStatusResponse is the response type for the Query/ClientStatus RPC
 * method. It returns the current status of the IBC client.
 *
 * @generated from message ibc.core.client.v1.QueryClientStatusResponse
 */
export class QueryClientStatusResponse extends Message<QueryClientStatusResponse> {
  /**
   * @generated from field: string status = 1;
   */
  status = "";

  constructor(data?: PartialMessage<QueryClientStatusResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientStatusResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "status", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientStatusResponse {
    return new QueryClientStatusResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientStatusResponse {
    return new QueryClientStatusResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientStatusResponse {
    return new QueryClientStatusResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientStatusResponse | PlainMessage<QueryClientStatusResponse> | undefined, b: QueryClientStatusResponse | PlainMessage<QueryClientStatusResponse> | undefined): boolean {
    return proto3.util.equals(QueryClientStatusResponse, a, b);
  }
}

/**
 * QueryClientParamsRequest is the request type for the Query/ClientParams RPC
 * method.
 *
 * @generated from message ibc.core.client.v1.QueryClientParamsRequest
 */
export class QueryClientParamsRequest extends Message<QueryClientParamsRequest> {
  constructor(data?: PartialMessage<QueryClientParamsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientParamsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientParamsRequest {
    return new QueryClientParamsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientParamsRequest {
    return new QueryClientParamsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientParamsRequest {
    return new QueryClientParamsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientParamsRequest | PlainMessage<QueryClientParamsRequest> | undefined, b: QueryClientParamsRequest | PlainMessage<QueryClientParamsRequest> | undefined): boolean {
    return proto3.util.equals(QueryClientParamsRequest, a, b);
  }
}

/**
 * QueryClientParamsResponse is the response type for the Query/ClientParams RPC
 * method.
 *
 * @generated from message ibc.core.client.v1.QueryClientParamsResponse
 */
export class QueryClientParamsResponse extends Message<QueryClientParamsResponse> {
  /**
   * params defines the parameters of the module.
   *
   * @generated from field: ibc.core.client.v1.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<QueryClientParamsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryClientParamsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryClientParamsResponse {
    return new QueryClientParamsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryClientParamsResponse {
    return new QueryClientParamsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryClientParamsResponse {
    return new QueryClientParamsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryClientParamsResponse | PlainMessage<QueryClientParamsResponse> | undefined, b: QueryClientParamsResponse | PlainMessage<QueryClientParamsResponse> | undefined): boolean {
    return proto3.util.equals(QueryClientParamsResponse, a, b);
  }
}

/**
 * QueryUpgradedClientStateRequest is the request type for the
 * Query/UpgradedClientState RPC method
 *
 * @generated from message ibc.core.client.v1.QueryUpgradedClientStateRequest
 */
export class QueryUpgradedClientStateRequest extends Message<QueryUpgradedClientStateRequest> {
  constructor(data?: PartialMessage<QueryUpgradedClientStateRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryUpgradedClientStateRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryUpgradedClientStateRequest {
    return new QueryUpgradedClientStateRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryUpgradedClientStateRequest {
    return new QueryUpgradedClientStateRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryUpgradedClientStateRequest {
    return new QueryUpgradedClientStateRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryUpgradedClientStateRequest | PlainMessage<QueryUpgradedClientStateRequest> | undefined, b: QueryUpgradedClientStateRequest | PlainMessage<QueryUpgradedClientStateRequest> | undefined): boolean {
    return proto3.util.equals(QueryUpgradedClientStateRequest, a, b);
  }
}

/**
 * QueryUpgradedClientStateResponse is the response type for the
 * Query/UpgradedClientState RPC method.
 *
 * @generated from message ibc.core.client.v1.QueryUpgradedClientStateResponse
 */
export class QueryUpgradedClientStateResponse extends Message<QueryUpgradedClientStateResponse> {
  /**
   * client state associated with the request identifier
   *
   * @generated from field: google.protobuf.Any upgraded_client_state = 1;
   */
  upgradedClientState?: Any;

  constructor(data?: PartialMessage<QueryUpgradedClientStateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryUpgradedClientStateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "upgraded_client_state", kind: "message", T: Any },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryUpgradedClientStateResponse {
    return new QueryUpgradedClientStateResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryUpgradedClientStateResponse {
    return new QueryUpgradedClientStateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryUpgradedClientStateResponse {
    return new QueryUpgradedClientStateResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryUpgradedClientStateResponse | PlainMessage<QueryUpgradedClientStateResponse> | undefined, b: QueryUpgradedClientStateResponse | PlainMessage<QueryUpgradedClientStateResponse> | undefined): boolean {
    return proto3.util.equals(QueryUpgradedClientStateResponse, a, b);
  }
}

/**
 * QueryUpgradedConsensusStateRequest is the request type for the
 * Query/UpgradedConsensusState RPC method
 *
 * @generated from message ibc.core.client.v1.QueryUpgradedConsensusStateRequest
 */
export class QueryUpgradedConsensusStateRequest extends Message<QueryUpgradedConsensusStateRequest> {
  constructor(data?: PartialMessage<QueryUpgradedConsensusStateRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryUpgradedConsensusStateRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryUpgradedConsensusStateRequest {
    return new QueryUpgradedConsensusStateRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryUpgradedConsensusStateRequest {
    return new QueryUpgradedConsensusStateRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryUpgradedConsensusStateRequest {
    return new QueryUpgradedConsensusStateRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryUpgradedConsensusStateRequest | PlainMessage<QueryUpgradedConsensusStateRequest> | undefined, b: QueryUpgradedConsensusStateRequest | PlainMessage<QueryUpgradedConsensusStateRequest> | undefined): boolean {
    return proto3.util.equals(QueryUpgradedConsensusStateRequest, a, b);
  }
}

/**
 * QueryUpgradedConsensusStateResponse is the response type for the
 * Query/UpgradedConsensusState RPC method.
 *
 * @generated from message ibc.core.client.v1.QueryUpgradedConsensusStateResponse
 */
export class QueryUpgradedConsensusStateResponse extends Message<QueryUpgradedConsensusStateResponse> {
  /**
   * Consensus state associated with the request identifier
   *
   * @generated from field: google.protobuf.Any upgraded_consensus_state = 1;
   */
  upgradedConsensusState?: Any;

  constructor(data?: PartialMessage<QueryUpgradedConsensusStateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.client.v1.QueryUpgradedConsensusStateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "upgraded_consensus_state", kind: "message", T: Any },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryUpgradedConsensusStateResponse {
    return new QueryUpgradedConsensusStateResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryUpgradedConsensusStateResponse {
    return new QueryUpgradedConsensusStateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryUpgradedConsensusStateResponse {
    return new QueryUpgradedConsensusStateResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryUpgradedConsensusStateResponse | PlainMessage<QueryUpgradedConsensusStateResponse> | undefined, b: QueryUpgradedConsensusStateResponse | PlainMessage<QueryUpgradedConsensusStateResponse> | undefined): boolean {
    return proto3.util.equals(QueryUpgradedConsensusStateResponse, a, b);
  }
}

