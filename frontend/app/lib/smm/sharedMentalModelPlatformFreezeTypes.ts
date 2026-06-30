/**
 * SMM-8 — Platform Certification & Freeze domain types.
 */

export type SharedMentalModelPlatformCertificationStatusKey = "certified" | "failed" | "pending";

export type SharedMentalModelPlatformPhaseRegistration = Readonly<{
  phaseId: string;
  contractVersion: string;
  platformId: string;
  title: string;
  publicApis: readonly string[];
  requiredFiles: readonly string[];
  buildLayerApi: string;
  readOnly: true;
}>;

export type SharedMentalModelPlatformExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
  status: "certified" | "reserved" | "future";
  readOnly: true;
}>;

export type SharedMentalModelPlatformRegistry = Readonly<{
  platformId: string;
  platformName: string;
  contractVersion: "SMM/8";
  releaseVersion: string;
  freezeVersion: string;
  releaseStage: string;
  certifiedPhases: readonly SharedMentalModelPlatformPhaseRegistration[];
  phaseCount: number;
  publicApis: readonly string[];
  extensionPoints: readonly SharedMentalModelPlatformExtensionRegistration[];
  readOnly: true;
}>;

export type SharedMentalModelPlatformCompatibilityEntry = Readonly<{
  sourceLayer: string;
  targetLayer: string;
  compatible: boolean;
  relationship: string;
  readOnly: true;
}>;

export type SharedMentalModelPlatformCompatibilityMatrix = Readonly<{
  matrixId: string;
  entries: readonly SharedMentalModelPlatformCompatibilityEntry[];
  entryCount: number;
  validationResult: "valid" | "invalid";
  readOnly: true;
}>;

export type SharedMentalModelPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type SharedMentalModelPlatformRegressionResult = Readonly<{
  success: boolean;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly SharedMentalModelPlatformCertificationCheck[];
  readOnly: true;
}>;

export type SharedMentalModelPlatformCertificationResult = Readonly<{
  success: boolean;
  certificationStatus: SharedMentalModelPlatformCertificationStatusKey;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly SharedMentalModelPlatformCertificationCheck[];
  regression: SharedMentalModelPlatformRegressionResult;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelPlatformManifest = Readonly<{
  manifestId: string;
  platformName: string;
  releaseVersion: string;
  freezeVersion: string;
  certifiedPhases: readonly string[];
  compatibility: readonly string[];
  publicApis: readonly string[];
  extensionRegistry: readonly SharedMentalModelPlatformExtensionRegistration[];
  extensionPolicy: readonly string[];
  certificationTimestamp: string;
  releaseStage: string;
  certificationStatus: SharedMentalModelPlatformCertificationStatusKey;
  readOnly: true;
}>;

export type SharedMentalModelPlatformFreezeState = Readonly<{
  contractVersion: "SMM/8";
  frozen: boolean;
  registry: SharedMentalModelPlatformRegistry;
  compatibilityMatrix: SharedMentalModelPlatformCompatibilityMatrix;
  lastCertification: SharedMentalModelPlatformCertificationResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelPlatformFreezeReport = Readonly<{
  success: boolean;
  reason: string;
  manifest: SharedMentalModelPlatformManifest | null;
  certification: SharedMentalModelPlatformCertificationResult | null;
  readOnly: true;
}>;
