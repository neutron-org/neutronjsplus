// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file interchainqueries/genesis.proto (package neutron.interchainqueries, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Height } from "../ibc/core/client/v1/client_pb.js";
import { Coin } from "../cosmos/base/v1beta1/coin_pb.js";
import { Params } from "./params_pb.js";

/**
 * @generated from message neutron.interchainqueries.RegisteredQuery
 */
export class RegisteredQuery extends Message<RegisteredQuery> {
  /**
   * The unique id of the registered query.
   *
   * @generated from field: uint64 id = 1;
   */
  id = protoInt64.zero;

  /**
   * The address that registered the query.
   *
   * @generated from field: string owner = 2;
   */
  owner = "";

  /**
   * The query type identifier: `kv` or `tx` now
   *
   * @generated from field: string query_type = 3;
   */
  queryType = "";

  /**
   * The KV-storage keys for which we want to get values from remote chain
   *
   * @generated from field: repeated neutron.interchainqueries.KVKey keys = 4;
   */
  keys: KVKey[] = [];

  /**
   * The filter for transaction search ICQ
   *
   * @generated from field: string transactions_filter = 5;
   */
  transactionsFilter = "";

  /**
   * The IBC connection ID for getting ConsensusState to verify proofs
   *
   * @generated from field: string connection_id = 6;
   */
  connectionId = "";

  /**
   * Parameter that defines how often the query must be updated.
   *
   * @generated from field: uint64 update_period = 7;
   */
  updatePeriod = protoInt64.zero;

  /**
   * The local chain last block height when the query result was updated.
   *
   * @generated from field: uint64 last_submitted_result_local_height = 8;
   */
  lastSubmittedResultLocalHeight = protoInt64.zero;

  /**
   * The remote chain last block height when the query result was updated.
   *
   * @generated from field: ibc.core.client.v1.Height last_submitted_result_remote_height = 9;
   */
  lastSubmittedResultRemoteHeight?: Height;

  /**
   * Amount of coins deposited for the query.
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin deposit = 10;
   */
  deposit: Coin[] = [];

  /**
   * Timeout before query becomes available for everybody to remove.
   *
   * @generated from field: uint64 submit_timeout = 11;
   */
  submitTimeout = protoInt64.zero;

  /**
   * The local chain height when the query was registered.
   *
   * @generated from field: uint64 registered_at_height = 12;
   */
  registeredAtHeight = protoInt64.zero;

  constructor(data?: PartialMessage<RegisteredQuery>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.RegisteredQuery";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "owner", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "query_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "keys", kind: "message", T: KVKey, repeated: true },
    { no: 5, name: "transactions_filter", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "update_period", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 8, name: "last_submitted_result_local_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 9, name: "last_submitted_result_remote_height", kind: "message", T: Height },
    { no: 10, name: "deposit", kind: "message", T: Coin, repeated: true },
    { no: 11, name: "submit_timeout", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 12, name: "registered_at_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegisteredQuery {
    return new RegisteredQuery().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegisteredQuery {
    return new RegisteredQuery().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegisteredQuery {
    return new RegisteredQuery().fromJsonString(jsonString, options);
  }

  static equals(a: RegisteredQuery | PlainMessage<RegisteredQuery> | undefined, b: RegisteredQuery | PlainMessage<RegisteredQuery> | undefined): boolean {
    return proto3.util.equals(RegisteredQuery, a, b);
  }
}

/**
 * @generated from message neutron.interchainqueries.KVKey
 */
export class KVKey extends Message<KVKey> {
  /**
   * Path (storage prefix) to the storage where you want to read value by key
   * (usually name of cosmos-sdk module: 'staking', 'bank', etc.)
   *
   * @generated from field: string path = 1;
   */
  path = "";

  /**
   * Key you want to read from the storage
   *
   * @generated from field: bytes key = 2;
   */
  key = new Uint8Array(0);

  constructor(data?: PartialMessage<KVKey>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.KVKey";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "path", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): KVKey {
    return new KVKey().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): KVKey {
    return new KVKey().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): KVKey {
    return new KVKey().fromJsonString(jsonString, options);
  }

  static equals(a: KVKey | PlainMessage<KVKey> | undefined, b: KVKey | PlainMessage<KVKey> | undefined): boolean {
    return proto3.util.equals(KVKey, a, b);
  }
}

/**
 * GenesisState defines the interchainqueries module's genesis state.
 *
 * @generated from message neutron.interchainqueries.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * @generated from field: neutron.interchainqueries.Params params = 1;
   */
  params?: Params;

  /**
   * @generated from field: repeated neutron.interchainqueries.RegisteredQuery registered_queries = 2;
   */
  registeredQueries: RegisteredQuery[] = [];

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "neutron.interchainqueries.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
    { no: 2, name: "registered_queries", kind: "message", T: RegisteredQuery, repeated: true },
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

