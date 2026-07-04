import type {
  DomainKpiCertificationStatus,
  DomainKpiRegressionResult,
} from "./domainKpiCertificationIndex.ts";

export type DomainKpiFreezeStatus = "PASS" | "FAIL";

export type DomainKpiPlatformIdentity = Readonly<{
  platformId: "nexora-domain-kpi-contract-platform";
  platformName: "Nexora Domain KPI Contract Platform";
  layerId: "DOM";
  phaseId: "DOM-4";
  version: "DOM-4:4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainKpiPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-4:1" | "DOM-4:2" | "DOM-4:3" | "DOM-4:4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  behaviorAdded: boolean;
  metadataOnly: true;
}>;

export type DomainKpiPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: DomainKpiPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainKpiCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainKpiExtensionPolicy = Readonly<{
  allowsNewKpiPackages: true;
  allowsNewQueryUtilities: false;
  allowsKpiCalculationEngine: false;
  allowsRuntimeMetricEvaluation: false;
  allowsRuntimeInference: false;
  allowsAiLogic: false;
  allowsSemanticMatching: false;
  requiresPublicApiConsumption: true;
  requiresCertificationForMutation: true;
  policy: "metadata-extension-only";
}>;

export type DomainKpiReleaseMetadata = Readonly<{
  releaseId: "dom-4-kpi-contract-platform-freeze";
  releaseName: "DOM-4 Domain KPI Contract Platform Freeze";
  releaseVersion: "DOM-4:4";
  certificationDependency: "DOM-4:3";
  regressionDependency: "DOM-4 regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainKpiPlatformFreezeManifest = Readonly<{
  platformIdentity: DomainKpiPlatformIdentity;
  phaseRegistry: readonly DomainKpiPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainKpiPublicApiEntry[];
  compatibilityMatrix: readonly DomainKpiCompatibilityEntry[];
  extensionPolicy: DomainKpiExtensionPolicy;
  releaseMetadata: DomainKpiReleaseMetadata;
  certificationStatus: DomainKpiCertificationStatus;
  regressionStatus: DomainKpiFreezeStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainKpiFreezeResult = Readonly<{
  status: DomainKpiFreezeStatus;
  manifest: DomainKpiPlatformFreezeManifest;
  certificationStatus: DomainKpiCertificationStatus;
  regression: DomainKpiRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;
