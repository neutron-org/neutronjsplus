// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file confio/proofs.proto (package ics23, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum ics23.HashOp
 */
export enum HashOp {
  /**
   * NO_HASH is the default if no data passed. Note this is an illegal argument some places.
   *
   * @generated from enum value: NO_HASH = 0;
   */
  NO_HASH = 0,

  /**
   * @generated from enum value: SHA256 = 1;
   */
  SHA256 = 1,

  /**
   * @generated from enum value: SHA512 = 2;
   */
  SHA512 = 2,

  /**
   * @generated from enum value: KECCAK = 3;
   */
  KECCAK = 3,

  /**
   * @generated from enum value: RIPEMD160 = 4;
   */
  RIPEMD160 = 4,

  /**
   * ripemd160(sha256(x))
   *
   * @generated from enum value: BITCOIN = 5;
   */
  BITCOIN = 5,

  /**
   * @generated from enum value: SHA512_256 = 6;
   */
  SHA512_256 = 6,
}
// Retrieve enum metadata with: proto3.getEnumType(HashOp)
proto3.util.setEnumType(HashOp, "ics23.HashOp", [
  { no: 0, name: "NO_HASH" },
  { no: 1, name: "SHA256" },
  { no: 2, name: "SHA512" },
  { no: 3, name: "KECCAK" },
  { no: 4, name: "RIPEMD160" },
  { no: 5, name: "BITCOIN" },
  { no: 6, name: "SHA512_256" },
]);

/**
 * *
 * LengthOp defines how to process the key and value of the LeafOp
 * to include length information. After encoding the length with the given
 * algorithm, the length will be prepended to the key and value bytes.
 * (Each one with it's own encoded length)
 *
 * @generated from enum ics23.LengthOp
 */
export enum LengthOp {
  /**
   * NO_PREFIX don't include any length info
   *
   * @generated from enum value: NO_PREFIX = 0;
   */
  NO_PREFIX = 0,

  /**
   * VAR_PROTO uses protobuf (and go-amino) varint encoding of the length
   *
   * @generated from enum value: VAR_PROTO = 1;
   */
  VAR_PROTO = 1,

  /**
   * VAR_RLP uses rlp int encoding of the length
   *
   * @generated from enum value: VAR_RLP = 2;
   */
  VAR_RLP = 2,

  /**
   * FIXED32_BIG uses big-endian encoding of the length as a 32 bit integer
   *
   * @generated from enum value: FIXED32_BIG = 3;
   */
  FIXED32_BIG = 3,

  /**
   * FIXED32_LITTLE uses little-endian encoding of the length as a 32 bit integer
   *
   * @generated from enum value: FIXED32_LITTLE = 4;
   */
  FIXED32_LITTLE = 4,

  /**
   * FIXED64_BIG uses big-endian encoding of the length as a 64 bit integer
   *
   * @generated from enum value: FIXED64_BIG = 5;
   */
  FIXED64_BIG = 5,

  /**
   * FIXED64_LITTLE uses little-endian encoding of the length as a 64 bit integer
   *
   * @generated from enum value: FIXED64_LITTLE = 6;
   */
  FIXED64_LITTLE = 6,

  /**
   * REQUIRE_32_BYTES is like NONE, but will fail if the input is not exactly 32 bytes (sha256 output)
   *
   * @generated from enum value: REQUIRE_32_BYTES = 7;
   */
  REQUIRE_32_BYTES = 7,

  /**
   * REQUIRE_64_BYTES is like NONE, but will fail if the input is not exactly 64 bytes (sha512 output)
   *
   * @generated from enum value: REQUIRE_64_BYTES = 8;
   */
  REQUIRE_64_BYTES = 8,
}
// Retrieve enum metadata with: proto3.getEnumType(LengthOp)
proto3.util.setEnumType(LengthOp, "ics23.LengthOp", [
  { no: 0, name: "NO_PREFIX" },
  { no: 1, name: "VAR_PROTO" },
  { no: 2, name: "VAR_RLP" },
  { no: 3, name: "FIXED32_BIG" },
  { no: 4, name: "FIXED32_LITTLE" },
  { no: 5, name: "FIXED64_BIG" },
  { no: 6, name: "FIXED64_LITTLE" },
  { no: 7, name: "REQUIRE_32_BYTES" },
  { no: 8, name: "REQUIRE_64_BYTES" },
]);

/**
 * *
 * ExistenceProof takes a key and a value and a set of steps to perform on it.
 * The result of peforming all these steps will provide a "root hash", which can
 * be compared to the value in a header.
 *
 * Since it is computationally infeasible to produce a hash collission for any of the used
 * cryptographic hash functions, if someone can provide a series of operations to transform
 * a given key and value into a root hash that matches some trusted root, these key and values
 * must be in the referenced merkle tree.
 *
 * The only possible issue is maliablity in LeafOp, such as providing extra prefix data,
 * which should be controlled by a spec. Eg. with lengthOp as NONE,
 * prefix = FOO, key = BAR, value = CHOICE
 * and
 * prefix = F, key = OOBAR, value = CHOICE
 * would produce the same value.
 *
 * With LengthOp this is tricker but not impossible. Which is why the "leafPrefixEqual" field
 * in the ProofSpec is valuable to prevent this mutability. And why all trees should
 * length-prefix the data before hashing it.
 *
 * @generated from message ics23.ExistenceProof
 */
export class ExistenceProof extends Message<ExistenceProof> {
  /**
   * @generated from field: bytes key = 1;
   */
  key = new Uint8Array(0);

  /**
   * @generated from field: bytes value = 2;
   */
  value = new Uint8Array(0);

  /**
   * @generated from field: ics23.LeafOp leaf = 3;
   */
  leaf?: LeafOp;

  /**
   * @generated from field: repeated ics23.InnerOp path = 4;
   */
  path: InnerOp[] = [];

  constructor(data?: PartialMessage<ExistenceProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.ExistenceProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "leaf", kind: "message", T: LeafOp },
    { no: 4, name: "path", kind: "message", T: InnerOp, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExistenceProof {
    return new ExistenceProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExistenceProof {
    return new ExistenceProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExistenceProof {
    return new ExistenceProof().fromJsonString(jsonString, options);
  }

  static equals(a: ExistenceProof | PlainMessage<ExistenceProof> | undefined, b: ExistenceProof | PlainMessage<ExistenceProof> | undefined): boolean {
    return proto3.util.equals(ExistenceProof, a, b);
  }
}

/**
 *
 * NonExistenceProof takes a proof of two neighbors, one left of the desired key,
 * one right of the desired key. If both proofs are valid AND they are neighbors,
 * then there is no valid proof for the given key.
 *
 * @generated from message ics23.NonExistenceProof
 */
export class NonExistenceProof extends Message<NonExistenceProof> {
  /**
   * TODO: remove this as unnecessary??? we prove a range
   *
   * @generated from field: bytes key = 1;
   */
  key = new Uint8Array(0);

  /**
   * @generated from field: ics23.ExistenceProof left = 2;
   */
  left?: ExistenceProof;

  /**
   * @generated from field: ics23.ExistenceProof right = 3;
   */
  right?: ExistenceProof;

  constructor(data?: PartialMessage<NonExistenceProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.NonExistenceProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "left", kind: "message", T: ExistenceProof },
    { no: 3, name: "right", kind: "message", T: ExistenceProof },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NonExistenceProof {
    return new NonExistenceProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NonExistenceProof {
    return new NonExistenceProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NonExistenceProof {
    return new NonExistenceProof().fromJsonString(jsonString, options);
  }

  static equals(a: NonExistenceProof | PlainMessage<NonExistenceProof> | undefined, b: NonExistenceProof | PlainMessage<NonExistenceProof> | undefined): boolean {
    return proto3.util.equals(NonExistenceProof, a, b);
  }
}

/**
 *
 * CommitmentProof is either an ExistenceProof or a NonExistenceProof, or a Batch of such messages
 *
 * @generated from message ics23.CommitmentProof
 */
export class CommitmentProof extends Message<CommitmentProof> {
  /**
   * @generated from oneof ics23.CommitmentProof.proof
   */
  proof: {
    /**
     * @generated from field: ics23.ExistenceProof exist = 1;
     */
    value: ExistenceProof;
    case: "exist";
  } | {
    /**
     * @generated from field: ics23.NonExistenceProof nonexist = 2;
     */
    value: NonExistenceProof;
    case: "nonexist";
  } | {
    /**
     * @generated from field: ics23.BatchProof batch = 3;
     */
    value: BatchProof;
    case: "batch";
  } | {
    /**
     * @generated from field: ics23.CompressedBatchProof compressed = 4;
     */
    value: CompressedBatchProof;
    case: "compressed";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<CommitmentProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.CommitmentProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "exist", kind: "message", T: ExistenceProof, oneof: "proof" },
    { no: 2, name: "nonexist", kind: "message", T: NonExistenceProof, oneof: "proof" },
    { no: 3, name: "batch", kind: "message", T: BatchProof, oneof: "proof" },
    { no: 4, name: "compressed", kind: "message", T: CompressedBatchProof, oneof: "proof" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CommitmentProof {
    return new CommitmentProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CommitmentProof {
    return new CommitmentProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CommitmentProof {
    return new CommitmentProof().fromJsonString(jsonString, options);
  }

  static equals(a: CommitmentProof | PlainMessage<CommitmentProof> | undefined, b: CommitmentProof | PlainMessage<CommitmentProof> | undefined): boolean {
    return proto3.util.equals(CommitmentProof, a, b);
  }
}

/**
 * *
 * LeafOp represents the raw key-value data we wish to prove, and
 * must be flexible to represent the internal transformation from
 * the original key-value pairs into the basis hash, for many existing
 * merkle trees.
 *
 * key and value are passed in. So that the signature of this operation is:
 * leafOp(key, value) -> output
 *
 * To process this, first prehash the keys and values if needed (ANY means no hash in this case):
 * hkey = prehashKey(key)
 * hvalue = prehashValue(value)
 *
 * Then combine the bytes, and hash it
 * output = hash(prefix || length(hkey) || hkey || length(hvalue) || hvalue)
 *
 * @generated from message ics23.LeafOp
 */
export class LeafOp extends Message<LeafOp> {
  /**
   * @generated from field: ics23.HashOp hash = 1;
   */
  hash = HashOp.NO_HASH;

  /**
   * @generated from field: ics23.HashOp prehash_key = 2;
   */
  prehashKey = HashOp.NO_HASH;

  /**
   * @generated from field: ics23.HashOp prehash_value = 3;
   */
  prehashValue = HashOp.NO_HASH;

  /**
   * @generated from field: ics23.LengthOp length = 4;
   */
  length = LengthOp.NO_PREFIX;

  /**
   * prefix is a fixed bytes that may optionally be included at the beginning to differentiate
   * a leaf node from an inner node.
   *
   * @generated from field: bytes prefix = 5;
   */
  prefix = new Uint8Array(0);

  constructor(data?: PartialMessage<LeafOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.LeafOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "hash", kind: "enum", T: proto3.getEnumType(HashOp) },
    { no: 2, name: "prehash_key", kind: "enum", T: proto3.getEnumType(HashOp) },
    { no: 3, name: "prehash_value", kind: "enum", T: proto3.getEnumType(HashOp) },
    { no: 4, name: "length", kind: "enum", T: proto3.getEnumType(LengthOp) },
    { no: 5, name: "prefix", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LeafOp {
    return new LeafOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LeafOp {
    return new LeafOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LeafOp {
    return new LeafOp().fromJsonString(jsonString, options);
  }

  static equals(a: LeafOp | PlainMessage<LeafOp> | undefined, b: LeafOp | PlainMessage<LeafOp> | undefined): boolean {
    return proto3.util.equals(LeafOp, a, b);
  }
}

/**
 * *
 * InnerOp represents a merkle-proof step that is not a leaf.
 * It represents concatenating two children and hashing them to provide the next result.
 *
 * The result of the previous step is passed in, so the signature of this op is:
 * innerOp(child) -> output
 *
 * The result of applying InnerOp should be:
 * output = op.hash(op.prefix || child || op.suffix)
 *
 * where the || operator is concatenation of binary data,
 * and child is the result of hashing all the tree below this step.
 *
 * Any special data, like prepending child with the length, or prepending the entire operation with
 * some value to differentiate from leaf nodes, should be included in prefix and suffix.
 * If either of prefix or suffix is empty, we just treat it as an empty string
 *
 * @generated from message ics23.InnerOp
 */
export class InnerOp extends Message<InnerOp> {
  /**
   * @generated from field: ics23.HashOp hash = 1;
   */
  hash = HashOp.NO_HASH;

  /**
   * @generated from field: bytes prefix = 2;
   */
  prefix = new Uint8Array(0);

  /**
   * @generated from field: bytes suffix = 3;
   */
  suffix = new Uint8Array(0);

  constructor(data?: PartialMessage<InnerOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.InnerOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "hash", kind: "enum", T: proto3.getEnumType(HashOp) },
    { no: 2, name: "prefix", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "suffix", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InnerOp {
    return new InnerOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InnerOp {
    return new InnerOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InnerOp {
    return new InnerOp().fromJsonString(jsonString, options);
  }

  static equals(a: InnerOp | PlainMessage<InnerOp> | undefined, b: InnerOp | PlainMessage<InnerOp> | undefined): boolean {
    return proto3.util.equals(InnerOp, a, b);
  }
}

/**
 * *
 * ProofSpec defines what the expected parameters are for a given proof type.
 * This can be stored in the client and used to validate any incoming proofs.
 *
 * verify(ProofSpec, Proof) -> Proof | Error
 *
 * As demonstrated in tests, if we don't fix the algorithm used to calculate the
 * LeafHash for a given tree, there are many possible key-value pairs that can
 * generate a given hash (by interpretting the preimage differently).
 * We need this for proper security, requires client knows a priori what
 * tree format server uses. But not in code, rather a configuration object.
 *
 * @generated from message ics23.ProofSpec
 */
export class ProofSpec extends Message<ProofSpec> {
  /**
   * any field in the ExistenceProof must be the same as in this spec.
   * except Prefix, which is just the first bytes of prefix (spec can be longer) 
   *
   * @generated from field: ics23.LeafOp leaf_spec = 1;
   */
  leafSpec?: LeafOp;

  /**
   * @generated from field: ics23.InnerSpec inner_spec = 2;
   */
  innerSpec?: InnerSpec;

  /**
   * max_depth (if > 0) is the maximum number of InnerOps allowed (mainly for fixed-depth tries)
   *
   * @generated from field: int32 max_depth = 3;
   */
  maxDepth = 0;

  /**
   * min_depth (if > 0) is the minimum number of InnerOps allowed (mainly for fixed-depth tries)
   *
   * @generated from field: int32 min_depth = 4;
   */
  minDepth = 0;

  constructor(data?: PartialMessage<ProofSpec>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.ProofSpec";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "leaf_spec", kind: "message", T: LeafOp },
    { no: 2, name: "inner_spec", kind: "message", T: InnerSpec },
    { no: 3, name: "max_depth", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "min_depth", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProofSpec {
    return new ProofSpec().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProofSpec {
    return new ProofSpec().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProofSpec {
    return new ProofSpec().fromJsonString(jsonString, options);
  }

  static equals(a: ProofSpec | PlainMessage<ProofSpec> | undefined, b: ProofSpec | PlainMessage<ProofSpec> | undefined): boolean {
    return proto3.util.equals(ProofSpec, a, b);
  }
}

/**
 *
 * InnerSpec contains all store-specific structure info to determine if two proofs from a
 * given store are neighbors.
 *
 * This enables:
 *
 * isLeftMost(spec: InnerSpec, op: InnerOp)
 * isRightMost(spec: InnerSpec, op: InnerOp)
 * isLeftNeighbor(spec: InnerSpec, left: InnerOp, right: InnerOp)
 *
 * @generated from message ics23.InnerSpec
 */
export class InnerSpec extends Message<InnerSpec> {
  /**
   * Child order is the ordering of the children node, must count from 0
   * iavl tree is [0, 1] (left then right)
   * merk is [0, 2, 1] (left, right, here)
   *
   * @generated from field: repeated int32 child_order = 1;
   */
  childOrder: number[] = [];

  /**
   * @generated from field: int32 child_size = 2;
   */
  childSize = 0;

  /**
   * @generated from field: int32 min_prefix_length = 3;
   */
  minPrefixLength = 0;

  /**
   * @generated from field: int32 max_prefix_length = 4;
   */
  maxPrefixLength = 0;

  /**
   * empty child is the prehash image that is used when one child is nil (eg. 20 bytes of 0)
   *
   * @generated from field: bytes empty_child = 5;
   */
  emptyChild = new Uint8Array(0);

  /**
   * hash is the algorithm that must be used for each InnerOp
   *
   * @generated from field: ics23.HashOp hash = 6;
   */
  hash = HashOp.NO_HASH;

  constructor(data?: PartialMessage<InnerSpec>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.InnerSpec";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "child_order", kind: "scalar", T: 5 /* ScalarType.INT32 */, repeated: true },
    { no: 2, name: "child_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "min_prefix_length", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "max_prefix_length", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: "empty_child", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 6, name: "hash", kind: "enum", T: proto3.getEnumType(HashOp) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InnerSpec {
    return new InnerSpec().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InnerSpec {
    return new InnerSpec().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InnerSpec {
    return new InnerSpec().fromJsonString(jsonString, options);
  }

  static equals(a: InnerSpec | PlainMessage<InnerSpec> | undefined, b: InnerSpec | PlainMessage<InnerSpec> | undefined): boolean {
    return proto3.util.equals(InnerSpec, a, b);
  }
}

/**
 *
 * BatchProof is a group of multiple proof types than can be compressed
 *
 * @generated from message ics23.BatchProof
 */
export class BatchProof extends Message<BatchProof> {
  /**
   * @generated from field: repeated ics23.BatchEntry entries = 1;
   */
  entries: BatchEntry[] = [];

  constructor(data?: PartialMessage<BatchProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.BatchProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "entries", kind: "message", T: BatchEntry, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BatchProof {
    return new BatchProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BatchProof {
    return new BatchProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BatchProof {
    return new BatchProof().fromJsonString(jsonString, options);
  }

  static equals(a: BatchProof | PlainMessage<BatchProof> | undefined, b: BatchProof | PlainMessage<BatchProof> | undefined): boolean {
    return proto3.util.equals(BatchProof, a, b);
  }
}

/**
 * Use BatchEntry not CommitmentProof, to avoid recursion
 *
 * @generated from message ics23.BatchEntry
 */
export class BatchEntry extends Message<BatchEntry> {
  /**
   * @generated from oneof ics23.BatchEntry.proof
   */
  proof: {
    /**
     * @generated from field: ics23.ExistenceProof exist = 1;
     */
    value: ExistenceProof;
    case: "exist";
  } | {
    /**
     * @generated from field: ics23.NonExistenceProof nonexist = 2;
     */
    value: NonExistenceProof;
    case: "nonexist";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<BatchEntry>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.BatchEntry";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "exist", kind: "message", T: ExistenceProof, oneof: "proof" },
    { no: 2, name: "nonexist", kind: "message", T: NonExistenceProof, oneof: "proof" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BatchEntry {
    return new BatchEntry().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BatchEntry {
    return new BatchEntry().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BatchEntry {
    return new BatchEntry().fromJsonString(jsonString, options);
  }

  static equals(a: BatchEntry | PlainMessage<BatchEntry> | undefined, b: BatchEntry | PlainMessage<BatchEntry> | undefined): boolean {
    return proto3.util.equals(BatchEntry, a, b);
  }
}

/**
 * @generated from message ics23.CompressedBatchProof
 */
export class CompressedBatchProof extends Message<CompressedBatchProof> {
  /**
   * @generated from field: repeated ics23.CompressedBatchEntry entries = 1;
   */
  entries: CompressedBatchEntry[] = [];

  /**
   * @generated from field: repeated ics23.InnerOp lookup_inners = 2;
   */
  lookupInners: InnerOp[] = [];

  constructor(data?: PartialMessage<CompressedBatchProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.CompressedBatchProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "entries", kind: "message", T: CompressedBatchEntry, repeated: true },
    { no: 2, name: "lookup_inners", kind: "message", T: InnerOp, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CompressedBatchProof {
    return new CompressedBatchProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CompressedBatchProof {
    return new CompressedBatchProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CompressedBatchProof {
    return new CompressedBatchProof().fromJsonString(jsonString, options);
  }

  static equals(a: CompressedBatchProof | PlainMessage<CompressedBatchProof> | undefined, b: CompressedBatchProof | PlainMessage<CompressedBatchProof> | undefined): boolean {
    return proto3.util.equals(CompressedBatchProof, a, b);
  }
}

/**
 * Use BatchEntry not CommitmentProof, to avoid recursion
 *
 * @generated from message ics23.CompressedBatchEntry
 */
export class CompressedBatchEntry extends Message<CompressedBatchEntry> {
  /**
   * @generated from oneof ics23.CompressedBatchEntry.proof
   */
  proof: {
    /**
     * @generated from field: ics23.CompressedExistenceProof exist = 1;
     */
    value: CompressedExistenceProof;
    case: "exist";
  } | {
    /**
     * @generated from field: ics23.CompressedNonExistenceProof nonexist = 2;
     */
    value: CompressedNonExistenceProof;
    case: "nonexist";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<CompressedBatchEntry>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.CompressedBatchEntry";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "exist", kind: "message", T: CompressedExistenceProof, oneof: "proof" },
    { no: 2, name: "nonexist", kind: "message", T: CompressedNonExistenceProof, oneof: "proof" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CompressedBatchEntry {
    return new CompressedBatchEntry().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CompressedBatchEntry {
    return new CompressedBatchEntry().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CompressedBatchEntry {
    return new CompressedBatchEntry().fromJsonString(jsonString, options);
  }

  static equals(a: CompressedBatchEntry | PlainMessage<CompressedBatchEntry> | undefined, b: CompressedBatchEntry | PlainMessage<CompressedBatchEntry> | undefined): boolean {
    return proto3.util.equals(CompressedBatchEntry, a, b);
  }
}

/**
 * @generated from message ics23.CompressedExistenceProof
 */
export class CompressedExistenceProof extends Message<CompressedExistenceProof> {
  /**
   * @generated from field: bytes key = 1;
   */
  key = new Uint8Array(0);

  /**
   * @generated from field: bytes value = 2;
   */
  value = new Uint8Array(0);

  /**
   * @generated from field: ics23.LeafOp leaf = 3;
   */
  leaf?: LeafOp;

  /**
   * these are indexes into the lookup_inners table in CompressedBatchProof
   *
   * @generated from field: repeated int32 path = 4;
   */
  path: number[] = [];

  constructor(data?: PartialMessage<CompressedExistenceProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.CompressedExistenceProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "leaf", kind: "message", T: LeafOp },
    { no: 4, name: "path", kind: "scalar", T: 5 /* ScalarType.INT32 */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CompressedExistenceProof {
    return new CompressedExistenceProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CompressedExistenceProof {
    return new CompressedExistenceProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CompressedExistenceProof {
    return new CompressedExistenceProof().fromJsonString(jsonString, options);
  }

  static equals(a: CompressedExistenceProof | PlainMessage<CompressedExistenceProof> | undefined, b: CompressedExistenceProof | PlainMessage<CompressedExistenceProof> | undefined): boolean {
    return proto3.util.equals(CompressedExistenceProof, a, b);
  }
}

/**
 * @generated from message ics23.CompressedNonExistenceProof
 */
export class CompressedNonExistenceProof extends Message<CompressedNonExistenceProof> {
  /**
   * TODO: remove this as unnecessary??? we prove a range
   *
   * @generated from field: bytes key = 1;
   */
  key = new Uint8Array(0);

  /**
   * @generated from field: ics23.CompressedExistenceProof left = 2;
   */
  left?: CompressedExistenceProof;

  /**
   * @generated from field: ics23.CompressedExistenceProof right = 3;
   */
  right?: CompressedExistenceProof;

  constructor(data?: PartialMessage<CompressedNonExistenceProof>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ics23.CompressedNonExistenceProof";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "left", kind: "message", T: CompressedExistenceProof },
    { no: 3, name: "right", kind: "message", T: CompressedExistenceProof },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CompressedNonExistenceProof {
    return new CompressedNonExistenceProof().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CompressedNonExistenceProof {
    return new CompressedNonExistenceProof().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CompressedNonExistenceProof {
    return new CompressedNonExistenceProof().fromJsonString(jsonString, options);
  }

  static equals(a: CompressedNonExistenceProof | PlainMessage<CompressedNonExistenceProof> | undefined, b: CompressedNonExistenceProof | PlainMessage<CompressedNonExistenceProof> | undefined): boolean {
    return proto3.util.equals(CompressedNonExistenceProof, a, b);
  }
}

