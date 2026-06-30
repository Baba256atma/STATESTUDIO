/**
 * ASS-9 — Platform certification and freeze domain types.
 */

export type ExecutiveAssistantPlatformCertificationStatusKey = "certified" | "failed";

export type ExecutiveAssistantPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformPhaseRegistration = Readonly<{
  phaseId: string;
  contractVersion: string;
  platformId: string;
  title: string;
  publicApis: readonly string[];
  requiredFiles: readonly string[];
  buildLayerApi: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  extensionKey: string;
  status: "certified" | "reserved";
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformRegistry = Readonly<{
  platformId: string;
  platformName: string;
  contractVersion: typeof import("./executiveAssistantPlatformFreezeRegistry.ts").ASS_PLATFORM_FREEZE_CONTRACT_VERSION;
  releaseVersion: string;
  freezeVersion: string;
  releaseStage: string;
  certifiedPhases: readonly ExecutiveAssistantPlatformPhaseRegistration[];
  phaseCount: number;
  publicApis: readonly string[];
  extensionPoints: readonly ExecutiveAssistantPlatformExtensionRegistration[];
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformCompatibilityEntry = Readonly<{
  sourceLayer: string;
  targetLayer: string;
  compatible: boolean;
  relationship: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformCompatibilityMatrix = Readonly<{
  matrixId: string;
  entries: readonly ExecutiveAssistantPlatformCompatibilityEntry[];
  entryCount: number;
  validationResult: "valid" | "invalid";
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformRegressionResult = Readonly<{
  success: boolean;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly ExecutiveAssistantPlatformCertificationCheck[];
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformCertificationResult = Readonly<{
  success: boolean;
  certificationStatus: ExecutiveAssistantPlatformCertificationStatusKey;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly ExecutiveAssistantPlatformCertificationCheck[];
  regression: ExecutiveAssistantPlatformRegressionResult;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformManifest = Readonly<{
  manifestId: string;
  platformName: string;
  releaseVersion: string;
  freezeVersion: string;
  certifiedPhases: readonly string[];
  compatibility: readonly string[];
  publicApis: readonly string[];
  extensionRegistry: readonly ExecutiveAssistantPlatformExtensionRegistration[];
  extensionPolicy: readonly string[];
  regressionMetadata: Readonly<{
    regressionSuite: string;
    phaseCount: number;
    readOnly: true;
  }>;
  certificationTimestamp: string;
  releaseStage: string;
  certificationStatus: ExecutiveAssistantPlatformCertificationStatusKey;
  officialPublication: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformFreezeState = Readonly<{
  contractVersion: typeof import("./executiveAssistantPlatformFreezeRegistry.ts").ASS_PLATFORM_FREEZE_CONTRACT_VERSION;
  frozen: boolean;
  registry: ExecutiveAssistantPlatformRegistry;
  compatibilityMatrix: ExecutiveAssistantPlatformCompatibilityMatrix;
  lastCertification: ExecutiveAssistantPlatformCertificationResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformFreezeReport = Readonly<{
  success: boolean;
  reason: string;
  manifest: ExecutiveAssistantPlatformManifest | null;
  certification: ExecutiveAssistantPlatformCertificationResult | null;
  readOnly: true;
}>;
