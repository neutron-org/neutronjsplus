// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file cosmos/auth/module/v1/module.proto (package cosmos.auth.module.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * Module is the config object for the auth module.
 *
 * @generated from message cosmos.auth.module.v1.Module
 */
export class Module extends Message<Module> {
  /**
   * bech32_prefix is the bech32 account prefix for the app.
   *
   * @generated from field: string bech32_prefix = 1;
   */
  bech32Prefix = "";

  /**
   * module_account_permissions are module account permissions.
   *
   * @generated from field: repeated cosmos.auth.module.v1.ModuleAccountPermission module_account_permissions = 2;
   */
  moduleAccountPermissions: ModuleAccountPermission[] = [];

  /**
   * authority defines the custom module authority. If not set, defaults to the governance module.
   *
   * @generated from field: string authority = 3;
   */
  authority = "";

  constructor(data?: PartialMessage<Module>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.module.v1.Module";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "bech32_prefix", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "module_account_permissions", kind: "message", T: ModuleAccountPermission, repeated: true },
    { no: 3, name: "authority", kind: "scalar", T: 9 /* ScalarType.STRING */ },
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

/**
 * ModuleAccountPermission represents permissions for a module account.
 *
 * @generated from message cosmos.auth.module.v1.ModuleAccountPermission
 */
export class ModuleAccountPermission extends Message<ModuleAccountPermission> {
  /**
   * account is the name of the module.
   *
   * @generated from field: string account = 1;
   */
  account = "";

  /**
   * permissions are the permissions this module has. Currently recognized
   * values are minter, burner and staking.
   *
   * @generated from field: repeated string permissions = 2;
   */
  permissions: string[] = [];

  constructor(data?: PartialMessage<ModuleAccountPermission>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.auth.module.v1.ModuleAccountPermission";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "permissions", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ModuleAccountPermission {
    return new ModuleAccountPermission().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ModuleAccountPermission {
    return new ModuleAccountPermission().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ModuleAccountPermission {
    return new ModuleAccountPermission().fromJsonString(jsonString, options);
  }

  static equals(a: ModuleAccountPermission | PlainMessage<ModuleAccountPermission> | undefined, b: ModuleAccountPermission | PlainMessage<ModuleAccountPermission> | undefined): boolean {
    return proto3.util.equals(ModuleAccountPermission, a, b);
  }
}

