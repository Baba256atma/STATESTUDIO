export type DomainExpertisePlatformStatus = "PASS" | "FAIL";

export type DomainExpertisePlatformIdentity = Readonly<{
  platformId: "nexora-domain-expertise-platform";
  platformName: "Nexora Domain Expertise Platform";
  layerId: "DOM";
  version: "DOM-8";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
  domainFunctionality: false;
}>;

export type DomainExpertisePlatformPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-1" | "DOM-2" | "DOM-3" | "DOM-4" | "DOM-5" | "DOM-6" | "DOM-7" | "DOM-8";
  title: string;
  status: "certified" | "frozen";
  order: number;
  metadataOnly: true;
  behaviorAdded: boolean;
}>;

export type DomainExpertisePlatformRegistryEntry = Readonly<{
  platformId: DomainExpertisePlatformPhaseRegistryEntry["phaseId"];
  platformName: string;
  publicFacade: string;
  certification: "certified" | "frozen";
  metadataOnly: true;
  runtimeDependency: false;
}>;

export type DomainExpertisePlatformPublicApiEntry = Readonly<{
  apiName: string;
  sourcePlatform: DomainExpertisePlatformPhaseRegistryEntry["phaseId"];
  category: "foundation" | "platform-freeze" | "certification" | "dom-freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainExpertisePlatformCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "consumer-compatible" | "future-compatible";
  boundary: "metadata-contract" | "public-api" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainExpertisePlatformExtensionPolicy = Readonly<{
  allowsNewDomainPlatforms: true;
  allowsDomainFunctionality: false;
  allowsReasoning: false;
  allowsRecommendations: false;
  allowsOntologyBehavior: false;
  allowsVocabularyBehavior: false;
  allowsKpiBehavior: false;
  allowsComplianceBehavior: false;
  allowsRuntimeExecution: false;
  allowsInference: false;
  allowsAiLogic: false;
  allowsSimulation: false;
  allowsPlanning: false;
  allowsDecisionMaking: false;
  allowsUiBehavior: false;
  allowsPersistence: false;
  allowsNetworking: false;
  allowsDatabaseAccess: false;
  requiresPublicApiConsumption: true;
  requiresFreezeCertification: true;
  policy: "metadata-platform-extension-only";
}>;

export type DomainExpertisePlatformReleaseMetadata = Readonly<{
  releaseId: "dom-8-domain-expertise-platform-freeze";
  releaseName: "DOM-8 Domain Expertise Platform Certification & Freeze";
  releaseVersion: "DOM-8";
  certificationDependency: "DOM-1 through DOM-7";
  regressionDependency: "DOM platform regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainExpertisePlatformCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainExpertisePlatformCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type DomainExpertisePlatformRegressionEntry = Readonly<{
  platformId: DomainExpertisePlatformPhaseRegistryEntry["phaseId"];
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainExpertisePlatformRegressionResult = Readonly<{
  status: DomainExpertisePlatformStatus;
  totalTests: number;
  passed: number;
  failed: number;
  entries: readonly DomainExpertisePlatformRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainExpertisePlatformManifest = Readonly<{
  platformIdentity: DomainExpertisePlatformIdentity;
  platformRegistry: readonly DomainExpertisePlatformRegistryEntry[];
  phaseRegistry: readonly DomainExpertisePlatformPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainExpertisePlatformPublicApiEntry[];
  compatibilityMatrix: readonly DomainExpertisePlatformCompatibilityEntry[];
  extensionPolicy: DomainExpertisePlatformExtensionPolicy;
  releaseMetadata: DomainExpertisePlatformReleaseMetadata;
  certificationStatus: DomainExpertisePlatformStatus;
  regressionStatus: DomainExpertisePlatformStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainExpertisePlatformCertificationResult = Readonly<{
  status: DomainExpertisePlatformStatus;
  gates: readonly DomainExpertisePlatformCertificationGate[];
  diagnostics: readonly DomainExpertisePlatformCertificationDiagnostic[];
  manifest: DomainExpertisePlatformManifest;
}>;

export type DomainExpertisePlatformFreezeState = Readonly<{
  status: DomainExpertisePlatformStatus;
  manifest: DomainExpertisePlatformManifest;
  certification: DomainExpertisePlatformCertificationResult;
  regression: DomainExpertisePlatformRegressionResult;
  checks: readonly DomainExpertisePlatformCertificationGate[];
}>;
