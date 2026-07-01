export const EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION = "LAY-12" as const;

export type ExecutiveBrainPlatformCertificationStatus = "PASS" | "FAIL";

export type ExecutiveBrainPlatformPhaseId =
  | "LAY-1"
  | "LAY-2"
  | "LAY-3"
  | "LAY-4"
  | "LAY-5"
  | "LAY-6"
  | "LAY-7"
  | "LAY-8"
  | "LAY-9"
  | "LAY-10"
  | "LAY-11"
  | "LAY-12";

export type ExecutiveBrainPlatformPhaseRegistryEntry = Readonly<{
  phaseId: ExecutiveBrainPlatformPhaseId;
  name: string;
  contractVersion: string;
  certified: boolean;
  frozen: boolean;
  consumes: readonly ExecutiveBrainPlatformPhaseId[];
  publicApiCount: number;
}>;

export type ExecutiveBrainPlatformPublicApiEntry = Readonly<{
  phaseId: ExecutiveBrainPlatformPhaseId;
  apiName: string;
  available: boolean;
}>;

export type ExecutiveBrainPlatformCapabilityEntry = Readonly<{
  capabilityId: string;
  name: string;
  ownerPhase: ExecutiveBrainPlatformPhaseId;
  certified: boolean;
}>;

export type ExecutiveBrainPlatformPhaseCompatibilityEntry = Readonly<{
  consumerPhaseId: ExecutiveBrainPlatformPhaseId | "Platform";
  providerPhaseId: ExecutiveBrainPlatformPhaseId;
  compatible: boolean;
  contract: "public-exports";
}>;

export type ExecutiveBrainPlatformLayerCompatibilityEntry = Readonly<{
  sourceLayer: string;
  targetLayer: string;
  compatible: boolean;
  relationship: string;
  status: "verified" | "future";
}>;

export type ExecutiveBrainCompatibilityMatrix = Readonly<{
  matrixId: string;
  phaseEntries: readonly ExecutiveBrainPlatformPhaseCompatibilityEntry[];
  layerEntries: readonly ExecutiveBrainPlatformLayerCompatibilityEntry[];
  entryCount: number;
  validationResult: "valid" | "invalid";
}>;

export type ExecutiveBrainPlatformExtensionPolicy = Readonly<{
  frozen: true;
  extensionMode: "additive-only";
  breakingChangesAllowed: false;
  privateImportsAllowed: false;
  runtimeBehaviorAllowed: false;
  requiresNewPhase: true;
  notes: readonly string[];
}>;

export type ExecutiveBrainReleaseMetadata = Readonly<{
  platformId: "nexora-executive-brain-platform";
  platformName: "Nexora Executive Brain Platform";
  releaseVersion: typeof EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION;
  releaseStage: "certified";
  layerIdentity: "LAY";
  releaseId: "nexora-executive-brain-platform-lay-12";
  declaration: "The Executive Brain Platform is Certified, Frozen, and Released.";
  certifiedAt: "2026-07-01T00:00:00.000Z";
  metadataOnly: true;
  runtimeIntelligence: false;
}>;

export type ExecutiveBrainPlatformCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type ExecutiveBrainRegressionResult = Readonly<{
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  deterministic: boolean;
}>;

export type ExecutiveBrainPlatformManifest = Readonly<{
  contractVersion: typeof EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION;
  releaseMetadata: ExecutiveBrainReleaseMetadata;
  phases: readonly ExecutiveBrainPlatformPhaseRegistryEntry[];
  publicApis: readonly ExecutiveBrainPlatformPublicApiEntry[];
  capabilities: readonly ExecutiveBrainPlatformCapabilityEntry[];
  compatibility: ExecutiveBrainCompatibilityMatrix;
  extensionPolicy: ExecutiveBrainPlatformExtensionPolicy;
  regression: ExecutiveBrainRegressionResult;
  certificationState: "certified";
  frozen: true;
  consumerSafe: boolean;
}>;

export type ExecutiveBrainCertificationResult = Readonly<{
  status: ExecutiveBrainPlatformCertificationStatus;
  gates: readonly ExecutiveBrainPlatformCertificationGate[];
  manifest: ExecutiveBrainPlatformManifest;
}>;

export type ExecutiveBrainFreezeResult = Readonly<{
  status: ExecutiveBrainPlatformCertificationStatus;
  frozen: true;
  released: true;
  manifest: ExecutiveBrainPlatformManifest;
  certification: ExecutiveBrainCertificationResult;
}>;
