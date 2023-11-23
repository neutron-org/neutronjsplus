// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file tendermint/p2p/types.proto (package tendermint.p2p, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message tendermint.p2p.NetAddress
 */
export class NetAddress extends Message<NetAddress> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string ip = 2;
   */
  ip = "";

  /**
   * @generated from field: uint32 port = 3;
   */
  port = 0;

  constructor(data?: PartialMessage<NetAddress>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.p2p.NetAddress";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "ip", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "port", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NetAddress {
    return new NetAddress().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NetAddress {
    return new NetAddress().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NetAddress {
    return new NetAddress().fromJsonString(jsonString, options);
  }

  static equals(a: NetAddress | PlainMessage<NetAddress> | undefined, b: NetAddress | PlainMessage<NetAddress> | undefined): boolean {
    return proto3.util.equals(NetAddress, a, b);
  }
}

/**
 * @generated from message tendermint.p2p.ProtocolVersion
 */
export class ProtocolVersion extends Message<ProtocolVersion> {
  /**
   * @generated from field: uint64 p2p = 1;
   */
  p2p = protoInt64.zero;

  /**
   * @generated from field: uint64 block = 2;
   */
  block = protoInt64.zero;

  /**
   * @generated from field: uint64 app = 3;
   */
  app = protoInt64.zero;

  constructor(data?: PartialMessage<ProtocolVersion>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.p2p.ProtocolVersion";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "p2p", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "block", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "app", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProtocolVersion {
    return new ProtocolVersion().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProtocolVersion {
    return new ProtocolVersion().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProtocolVersion {
    return new ProtocolVersion().fromJsonString(jsonString, options);
  }

  static equals(a: ProtocolVersion | PlainMessage<ProtocolVersion> | undefined, b: ProtocolVersion | PlainMessage<ProtocolVersion> | undefined): boolean {
    return proto3.util.equals(ProtocolVersion, a, b);
  }
}

/**
 * @generated from message tendermint.p2p.DefaultNodeInfo
 */
export class DefaultNodeInfo extends Message<DefaultNodeInfo> {
  /**
   * @generated from field: tendermint.p2p.ProtocolVersion protocol_version = 1;
   */
  protocolVersion?: ProtocolVersion;

  /**
   * @generated from field: string default_node_id = 2;
   */
  defaultNodeId = "";

  /**
   * @generated from field: string listen_addr = 3;
   */
  listenAddr = "";

  /**
   * @generated from field: string network = 4;
   */
  network = "";

  /**
   * @generated from field: string version = 5;
   */
  version = "";

  /**
   * @generated from field: bytes channels = 6;
   */
  channels = new Uint8Array(0);

  /**
   * @generated from field: string moniker = 7;
   */
  moniker = "";

  /**
   * @generated from field: tendermint.p2p.DefaultNodeInfoOther other = 8;
   */
  other?: DefaultNodeInfoOther;

  constructor(data?: PartialMessage<DefaultNodeInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.p2p.DefaultNodeInfo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "protocol_version", kind: "message", T: ProtocolVersion },
    { no: 2, name: "default_node_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "listen_addr", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "network", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "channels", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 7, name: "moniker", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "other", kind: "message", T: DefaultNodeInfoOther },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DefaultNodeInfo {
    return new DefaultNodeInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DefaultNodeInfo {
    return new DefaultNodeInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DefaultNodeInfo {
    return new DefaultNodeInfo().fromJsonString(jsonString, options);
  }

  static equals(a: DefaultNodeInfo | PlainMessage<DefaultNodeInfo> | undefined, b: DefaultNodeInfo | PlainMessage<DefaultNodeInfo> | undefined): boolean {
    return proto3.util.equals(DefaultNodeInfo, a, b);
  }
}

/**
 * @generated from message tendermint.p2p.DefaultNodeInfoOther
 */
export class DefaultNodeInfoOther extends Message<DefaultNodeInfoOther> {
  /**
   * @generated from field: string tx_index = 1;
   */
  txIndex = "";

  /**
   * @generated from field: string rpc_address = 2;
   */
  rpcAddress = "";

  constructor(data?: PartialMessage<DefaultNodeInfoOther>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.p2p.DefaultNodeInfoOther";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "tx_index", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "rpc_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DefaultNodeInfoOther {
    return new DefaultNodeInfoOther().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DefaultNodeInfoOther {
    return new DefaultNodeInfoOther().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DefaultNodeInfoOther {
    return new DefaultNodeInfoOther().fromJsonString(jsonString, options);
  }

  static equals(a: DefaultNodeInfoOther | PlainMessage<DefaultNodeInfoOther> | undefined, b: DefaultNodeInfoOther | PlainMessage<DefaultNodeInfoOther> | undefined): boolean {
    return proto3.util.equals(DefaultNodeInfoOther, a, b);
  }
}

