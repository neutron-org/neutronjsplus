// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file slinky/marketmap/module/v1/module.proto (package slinky.marketmap.module.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * Module is the config object of the builder module.
 *
 * @generated from message slinky.marketmap.module.v1.Module
 */
export class Module extends Message<Module> {
  /**
   * Authority defines the custom module authority. If not set, defaults to the
   * governance module.
   *
   * @generated from field: string authority = 1;
   */
  authority = "";

  /**
   * HooksOrder specifies the order of marketmap hooks and should be a list
   * of module names which provide a marketmap hooks instance. If no order is
   * provided, then hooks will be applied in alphabetical order of module names.
   *
   * @generated from field: repeated string hooks_order = 2;
   */
  hooksOrder: string[] = [];

  constructor(data?: PartialMessage<Module>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "slinky.marketmap.module.v1.Module";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "authority", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "hooks_order", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module {
    return new Module().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module {
    return new Module().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module {
    return new Module().fromJsonString(jsonString, options);
  }

  static equals(a: Module | PlainMessage<Module> | undefined, b: Module | PlainMessage<Module> | undefined): boolean {
    return proto3.util.equals(Module, a, b);
  }
}

