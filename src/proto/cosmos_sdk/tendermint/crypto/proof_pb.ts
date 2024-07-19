// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file tendermint/crypto/proof.proto (package tendermint.crypto, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message tendermint.crypto.Proof
 */
export class Proof extends Message<Proof> {
  /**
   * @generated from field: int64 total = 1;
   */
  total = protoInt64.zero;

  /**
   * @generated from field: int64 index = 2;
   */
  index = protoInt64.zero;

  /**
   * @generated from field: bytes leaf_hash = 3;
   */
  leafHash = new Uint8Array(0);

  /**
   * @generated from field: repeated bytes aunts = 4;
   */
  aunts: Uint8Array[] = [];

  constructor(data?: PartialMessage<Proof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.crypto.Proof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "total", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "index", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "leaf_hash", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "aunts", kind: "scalar", T: 12 /* ScalarType.BYTES */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Proof {
    return new Proof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Proof {
    return new Proof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Proof {
    return new Proof().fromJsonString(jsonString, options);
  }

  static equals(a: Proof | PlainMessage<Proof> | undefined, b: Proof | PlainMessage<Proof> | undefined): boolean {
    return proto3.util.equals(Proof, a, b);
  }
}

/**
 * @generated from message tendermint.crypto.ValueOp
 */
export class ValueOp extends Message<ValueOp> {
  /**
   * Encoded in ProofOp.Key.
   *
   * @generated from field: bytes key = 1;
   */
  key = new Uint8Array(0);

  /**
   * To encode in ProofOp.Data
   *
   * @generated from field: tendermint.crypto.Proof proof = 2;
   */
  proof?: Proof;

  constructor(data?: PartialMessage<ValueOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.crypto.ValueOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "proof", kind: "message", T: Proof },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValueOp {
    return new ValueOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValueOp {
    return new ValueOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValueOp {
    return new ValueOp().fromJsonString(jsonString, options);
  }

  static equals(a: ValueOp | PlainMessage<ValueOp> | undefined, b: ValueOp | PlainMessage<ValueOp> | undefined): boolean {
    return proto3.util.equals(ValueOp, a, b);
  }
}

/**
 * @generated from message tendermint.crypto.DominoOp
 */
export class DominoOp extends Message<DominoOp> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: string input = 2;
   */
  input = "";

  /**
   * @generated from field: string output = 3;
   */
  output = "";

  constructor(data?: PartialMessage<DominoOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.crypto.DominoOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "input", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "output", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DominoOp {
    return new DominoOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DominoOp {
    return new DominoOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DominoOp {
    return new DominoOp().fromJsonString(jsonString, options);
  }

  static equals(a: DominoOp | PlainMessage<DominoOp> | undefined, b: DominoOp | PlainMessage<DominoOp> | undefined): boolean {
    return proto3.util.equals(DominoOp, a, b);
  }
}

/**
 * ProofOp defines an operation used for calculating Merkle root
 * The data could be arbitrary format, providing nessecary data
 * for example neighbouring node hash
 *
 * @generated from message tendermint.crypto.ProofOp
 */
export class ProofOp extends Message<ProofOp> {
  /**
   * @generated from field: string type = 1;
   */
  type = "";

  /**
   * @generated from field: bytes key = 2;
   */
  key = new Uint8Array(0);

  /**
   * @generated from field: bytes data = 3;
   */
  data = new Uint8Array(0);

  constructor(data?: PartialMessage<ProofOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.crypto.ProofOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "data", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProofOp {
    return new ProofOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProofOp {
    return new ProofOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProofOp {
    return new ProofOp().fromJsonString(jsonString, options);
  }

  static equals(a: ProofOp | PlainMessage<ProofOp> | undefined, b: ProofOp | PlainMessage<ProofOp> | undefined): boolean {
    return proto3.util.equals(ProofOp, a, b);
  }
}

/**
 * ProofOps is Merkle proof defined by the list of ProofOps
 *
 * @generated from message tendermint.crypto.ProofOps
 */
export class ProofOps extends Message<ProofOps> {
  /**
   * @generated from field: repeated tendermint.crypto.ProofOp ops = 1;
   */
  ops: ProofOp[] = [];

  constructor(data?: PartialMessage<ProofOps>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "tendermint.crypto.ProofOps";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "ops", kind: "message", T: ProofOp, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProofOps {
    return new ProofOps().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProofOps {
    return new ProofOps().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProofOps {
    return new ProofOps().fromJsonString(jsonString, options);
  }

  static equals(a: ProofOps | PlainMessage<ProofOps> | undefined, b: ProofOps | PlainMessage<ProofOps> | undefined): boolean {
    return proto3.util.equals(ProofOps, a, b);
  }
}
