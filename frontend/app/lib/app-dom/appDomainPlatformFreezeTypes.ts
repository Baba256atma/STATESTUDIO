export type AppDomainPlatformStatus = "PASS" | "FAIL";

export type AppDomainPlatformIdentity = Readonly<{
  platformId: "nexora-app-domain-consumer-platform";
  platformName: "Nexora APP-DOM Consumer Platform";
  layerId: "APP-DOM";
  version: "APP-DOM-4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type AppDomainPlatformPhaseRegistryEntry = Readonly<{
  phaseId: "APP-DOM-1" | "APP-DOM-2" | "APP-DOM-3" | "APP-DOM-4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  metadataOnly: true;
}>;

export type AppDomainPlatformPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: AppDomainPlatformPhaseRegistryEntry["phaseId"];
  category: "bridge" | "mapping" | "context" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type AppDomainPlatformCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type AppDomainPlatformExtensionPolicy = Readonly<{
  allowsNewConsumerUtilities: true;
  allowsExecutiveReasoning: false;
  allowsRecommendations: false;
  allowsDecisionEngine: false;
  allowsInference: false;
  allowsSimulation: false;
  allowsPlanning: false;
  allowsOptimization: false;
  allowsRanking: false;
  allowsScoring: false;
  allowsAiLogic: false;
  allowsLlmPrompting: false;
  allowsRuntimeExecution: false;
  allowsRuntimeMutation: false;
  allowsDomainMutations: false;
  requiresPublicApiConsumption: true;
  policy: "metadata-consumer-extension-only";
}>;

export type AppDomainPlatformReleaseMetadata = Readonly<{
  releaseId: "app-dom-consumer-platform-freeze";
  releaseName: "APP-DOM Consumer Platform Certification & Freeze";
  releaseVersion: "APP-DOM-4";
  certificationDependency: "APP-DOM-1 through APP-DOM-3";
  regressionDependency: "APP-DOM regression";
  immutable: true;
  deterministic: true;
}>;

export type AppDomainPlatformCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type AppDomainPlatformCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type AppDomainPlatformRegressionEntry = Readonly<{
  phaseId: AppDomainPlatformPhaseRegistryEntry["phaseId"];
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type AppDomainPlatformRegressionResult = Readonly<{
  status: AppDomainPlatformStatus;
  totalTests: number;
  passed: number;
  failed: number;
  entries: readonly AppDomainPlatformRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type AppDomainPlatformManifest = Readonly<{
  platformIdentity: AppDomainPlatformIdentity;
  phaseRegistry: readonly AppDomainPlatformPhaseRegistryEntry[];
  publicApiRegistry: readonly AppDomainPlatformPublicApiEntry[];
  compatibilityMatrix: readonly AppDomainPlatformCompatibilityEntry[];
  extensionPolicy: AppDomainPlatformExtensionPolicy;
  releaseMetadata: AppDomainPlatformReleaseMetadata;
  certificationStatus: AppDomainPlatformStatus;
  regressionStatus: AppDomainPlatformStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type AppDomainPlatformCertificationResult = Readonly<{
  status: AppDomainPlatformStatus;
  gates: readonly AppDomainPlatformCertificationGate[];
  diagnostics: readonly AppDomainPlatformCertificationDiagnostic[];
  manifest: AppDomainPlatformManifest;
}>;

export type AppDomainPlatformFreezeState = Readonly<{
  status: AppDomainPlatformStatus;
  manifest: AppDomainPlatformManifest;
  certification: AppDomainPlatformCertificationResult;
  regression: AppDomainPlatformRegressionResult;
  checks: readonly AppDomainPlatformCertificationGate[];
}>;
