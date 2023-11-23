// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/app/v1alpha1/query.proto (package cosmos.app.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Config } from "./config_pb.js";

/**
 * QueryConfigRequest is the Query/Config request type.
 *
 * @generated from message cosmos.app.v1alpha1.QueryConfigRequest
 */
export class QueryConfigRequest extends Message<QueryConfigRequest> {
  constructor(data?: PartialMessage<QueryConfigRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.app.v1alpha1.QueryConfigRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConfigRequest {
    return new QueryConfigRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConfigRequest {
    return new QueryConfigRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConfigRequest {
    return new QueryConfigRequest().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConfigRequest | PlainMessage<QueryConfigRequest> | undefined, b: QueryConfigRequest | PlainMessage<QueryConfigRequest> | undefined): boolean {
    return proto3.util.equals(QueryConfigRequest, a, b);
  }
}

/**
 * QueryConfigRequest is the Query/Config response type.
 *
 * @generated from message cosmos.app.v1alpha1.QueryConfigResponse
 */
export class QueryConfigResponse extends Message<QueryConfigResponse> {
  /**
   * config is the current app config.
   *
   * @generated from field: cosmos.app.v1alpha1.Config config = 1;
   */
  config?: Config;

  constructor(data?: PartialMessage<QueryConfigResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.app.v1alpha1.QueryConfigResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "config", kind: "message", T: Config },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryConfigResponse {
    return new QueryConfigResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryConfigResponse {
    return new QueryConfigResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryConfigResponse {
    return new QueryConfigResponse().fromJsonString(jsonString, options);
  }

  static equals(a: QueryConfigResponse | PlainMessage<QueryConfigResponse> | undefined, b: QueryConfigResponse | PlainMessage<QueryConfigResponse> | undefined): boolean {
    return proto3.util.equals(QueryConfigResponse, a, b);
  }
}

