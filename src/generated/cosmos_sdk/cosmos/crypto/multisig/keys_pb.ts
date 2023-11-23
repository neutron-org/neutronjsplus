// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/crypto/multisig/keys.proto (package cosmos.crypto.multisig, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3 } from "@bufbuild/protobuf";

/**
 * LegacyAminoPubKey specifies a public key type
 * which nests multiple public keys and a threshold,
 * it uses legacy amino address rules.
 *
 * @generated from message cosmos.crypto.multisig.LegacyAminoPubKey
 */
export class LegacyAminoPubKey extends Message<LegacyAminoPubKey> {
  /**
   * @generated from field: uint32 threshold = 1;
   */
  threshold = 0;

  /**
   * @generated from field: repeated google.protobuf.Any public_keys = 2;
   */
  publicKeys: Any[] = [];

  constructor(data?: PartialMessage<LegacyAminoPubKey>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.crypto.multisig.LegacyAminoPubKey";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "threshold", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "public_keys", kind: "message", T: Any, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LegacyAminoPubKey {
    return new LegacyAminoPubKey().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LegacyAminoPubKey {
    return new LegacyAminoPubKey().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LegacyAminoPubKey {
    return new LegacyAminoPubKey().fromJsonString(jsonString, options);
  }

  static equals(a: LegacyAminoPubKey | PlainMessage<LegacyAminoPubKey> | undefined, b: LegacyAminoPubKey | PlainMessage<LegacyAminoPubKey> | undefined): boolean {
    return proto3.util.equals(LegacyAminoPubKey, a, b);
  }
}

