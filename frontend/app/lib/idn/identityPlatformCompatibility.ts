import type {
  IdentityPlatformCompatibilityEntry,
  IdentityPlatformExtensionPolicy,
} from "./identityPlatformFreezeTypes.ts";

const COMPATIBILITY_MATRIX: readonly IdentityPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ consumerPhaseId: "IDN-2", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-3", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-3", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-4", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-4", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-4", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-5", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-5", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-5", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-5", providerPhaseId: "IDN-4", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-6", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-6", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-6", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-6", providerPhaseId: "IDN-4", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-6", providerPhaseId: "IDN-5", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-4", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-5", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-7", providerPhaseId: "IDN-6", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-8", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-8", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-8", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-8", providerPhaseId: "IDN-7", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-1", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-2", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-3", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-4", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-5", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-7", compatible: true, contract: "public-exports" }),
  Object.freeze({ consumerPhaseId: "IDN-9", providerPhaseId: "IDN-8", compatible: true, contract: "public-exports" }),
]);

const EXTENSION_POLICY: IdentityPlatformExtensionPolicy = Object.freeze({
  frozen: true,
  extensionMode: "additive-only",
  breakingChangesAllowed: false,
  privateImportsAllowed: false,
  runtimeBehaviorAllowed: false,
  requiresNewPhase: true,
  notes: Object.freeze([
    "Certified IDN public APIs are frozen.",
    "Future identity changes must be additive and released as later IDN phases.",
    "Consumers must import through public phase index files only.",
  ]),
});

export function getIdentityPlatformCompatibilityMatrix(): readonly IdentityPlatformCompatibilityEntry[] {
  return COMPATIBILITY_MATRIX;
}

export function getIdentityPlatformExtensionPolicy(): IdentityPlatformExtensionPolicy {
  return EXTENSION_POLICY;
}
