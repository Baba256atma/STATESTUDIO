/**
 * LLM-12 — Platform Certification & Freeze domain types.
 */

export type LlmPlatformCertificationStatusKey = "certified" | "failed" | "pending";

export type LlmPlatformPhaseRegistration = Readonly<{
  phaseId: string;
  contractVersion: string;
  platformId: string;
  title: string;
  publicApis: readonly string[];
  requiredFiles: readonly string[];
  buildLayerApi: string;
  readOnly: true;
}>;

export type LlmPlatformRegistry = Readonly<{
  platformId: string;
  platformName: string;
  contractVersion: "LLM/12";
  releaseVersion: string;
  freezeVersion: string;
  releaseStage: string;
  certifiedPhases: readonly LlmPlatformPhaseRegistration[];
  phaseCount: number;
  publicApis: readonly string[];
  extensionPoints: readonly LlmPlatformExtensionRegistration[];
  readOnly: true;
}>;

export type LlmPlatformExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
  status: "certified" | "reserved" | "enterprise";
  readOnly: true;
}>;

export type LlmPlatformCompatibilityEntry = Readonly<{
  sourceLayer: string;
  targetLayer: string;
  compatible: boolean;
  relationship: string;
  readOnly: true;
}>;

export type LlmPlatformCompatibilityMatrix = Readonly<{
  matrixId: string;
  entries: readonly LlmPlatformCompatibilityEntry[];
  entryCount: number;
  validationResult: "valid" | "invalid";
  readOnly: true;
}>;

export type LlmPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type LlmPlatformRegressionResult = Readonly<{
  success: boolean;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly LlmPlatformCertificationCheck[];
  readOnly: true;
}>;

export type LlmPlatformCertificationResult = Readonly<{
  success: boolean;
  certificationStatus: LlmPlatformCertificationStatusKey;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly LlmPlatformCertificationCheck[];
  regression: LlmPlatformRegressionResult;
  timestamp: string;
  readOnly: true;
}>;

export type LlmPlatformFreezeManifest = Readonly<{
  manifestId: string;
  platformName: string;
  releaseVersion: string;
  freezeVersion: string;
  certifiedPhases: readonly string[];
  compatibility: readonly string[];
  publicApis: readonly string[];
  extensionRegistry: readonly LlmPlatformExtensionRegistration[];
  certificationTimestamp: string;
  releaseStage: string;
  certificationStatus: LlmPlatformCertificationStatusKey;
  readOnly: true;
}>;

export type LlmPlatformFreezeState = Readonly<{
  contractVersion: "LLM/12";
  frozen: boolean;
  registry: LlmPlatformRegistry;
  compatibilityMatrix: LlmPlatformCompatibilityMatrix;
  lastCertification: LlmPlatformCertificationResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type LlmPlatformFreezeReport = Readonly<{
  success: boolean;
  reason: string;
  manifest: LlmPlatformFreezeManifest | null;
  certification: LlmPlatformCertificationResult | null;
  readOnly: true;
}>;
