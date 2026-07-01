export const IDENTITY_PLATFORM_FREEZE_CONTRACT_VERSION = "IDN-10" as const;

export type IdentityPlatformCertificationStatus = "PASS" | "PASS_WITH_WARNINGS" | "FAIL";

export type IdentityPlatformPhaseId =
  | "IDN-1"
  | "IDN-2"
  | "IDN-3"
  | "IDN-4"
  | "IDN-5"
  | "IDN-6"
  | "IDN-7"
  | "IDN-8"
  | "IDN-9";

export type IdentityPlatformPhaseRegistryEntry = Readonly<{
  phaseId: IdentityPlatformPhaseId;
  name: string;
  contractVersion: string;
  certified: boolean;
  frozen: boolean;
  consumes: readonly IdentityPlatformPhaseId[];
  publicApiCount: number;
}>;

export type IdentityPlatformPublicApiEntry = Readonly<{
  phaseId: IdentityPlatformPhaseId;
  apiName: string;
  available: boolean;
}>;

export type IdentityPlatformCompatibilityEntry = Readonly<{
  consumerPhaseId: IdentityPlatformPhaseId | "Platform";
  providerPhaseId: IdentityPlatformPhaseId;
  compatible: boolean;
  contract: "public-exports";
}>;

export type IdentityPlatformExtensionPolicy = Readonly<{
  frozen: true;
  extensionMode: "additive-only";
  breakingChangesAllowed: false;
  privateImportsAllowed: false;
  runtimeBehaviorAllowed: false;
  requiresNewPhase: true;
  notes: readonly string[];
}>;

export type IdentityPlatformCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type IdentityPlatformRegressionResult = Readonly<{
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  deterministic: boolean;
}>;

export type IdentityPlatformFreezeManifest = Readonly<{
  contractVersion: typeof IDENTITY_PLATFORM_FREEZE_CONTRACT_VERSION;
  platformId: "nexora-identity-platform";
  releaseId: "nexora-identity-platform-idn-10";
  declaration: "The Nexora Identity Platform is Certified, Frozen, and Released.";
  phases: readonly IdentityPlatformPhaseRegistryEntry[];
  publicApis: readonly IdentityPlatformPublicApiEntry[];
  compatibilityMatrix: readonly IdentityPlatformCompatibilityEntry[];
  extensionPolicy: IdentityPlatformExtensionPolicy;
  regression: IdentityPlatformRegressionResult;
  frozen: true;
  consumerSafe: boolean;
}>;

export type IdentityPlatformCertificationResult = Readonly<{
  status: IdentityPlatformCertificationStatus;
  gates: readonly IdentityPlatformCertificationGate[];
  manifest: IdentityPlatformFreezeManifest;
}>;

export type IdentityPlatformFreezeState = Readonly<{
  status: IdentityPlatformCertificationStatus;
  frozen: true;
  released: true;
  manifest: IdentityPlatformFreezeManifest;
  certification: IdentityPlatformCertificationResult;
}>;
