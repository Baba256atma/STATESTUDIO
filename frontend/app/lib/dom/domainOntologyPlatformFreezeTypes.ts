import type {
  DomainOntologyCertificationStatus,
  DomainOntologyRegressionResult,
} from "./domainOntologyCertificationIndex.ts";

export type DomainOntologyFreezeStatus = "PASS" | "FAIL";

export type DomainOntologyPlatformIdentity = Readonly<{
  platformId: "nexora-domain-ontology-platform";
  platformName: "Nexora Domain Ontology Platform";
  layerId: "DOM";
  phaseId: "DOM-3";
  version: "DOM-3:4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainOntologyPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-3:1" | "DOM-3:2" | "DOM-3:3" | "DOM-3:4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  behaviorAdded: boolean;
  metadataOnly: true;
}>;

export type DomainOntologyPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: DomainOntologyPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainOntologyCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainOntologyExtensionPolicy = Readonly<{
  allowsNewOntologyPackages: true;
  allowsNewQueryUtilities: false;
  allowsRuntimeInference: false;
  allowsRuntimeGraphReasoning: false;
  allowsAiLogic: false;
  allowsFuzzyMatching: false;
  requiresPublicApiConsumption: true;
  requiresCertificationForMutation: true;
  policy: "metadata-extension-only";
}>;

export type DomainOntologyReleaseMetadata = Readonly<{
  releaseId: "dom-3-ontology-platform-freeze";
  releaseName: "DOM-3 Domain Ontology Platform Freeze";
  releaseVersion: "DOM-3:4";
  certificationDependency: "DOM-3:3";
  regressionDependency: "DOM-3 regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainOntologyPlatformFreezeManifest = Readonly<{
  platformIdentity: DomainOntologyPlatformIdentity;
  phaseRegistry: readonly DomainOntologyPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainOntologyPublicApiEntry[];
  compatibilityMatrix: readonly DomainOntologyCompatibilityEntry[];
  extensionPolicy: DomainOntologyExtensionPolicy;
  releaseMetadata: DomainOntologyReleaseMetadata;
  certificationStatus: DomainOntologyCertificationStatus;
  regressionStatus: DomainOntologyFreezeStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainOntologyFreezeResult = Readonly<{
  status: DomainOntologyFreezeStatus;
  manifest: DomainOntologyPlatformFreezeManifest;
  certificationStatus: DomainOntologyCertificationStatus;
  regression: DomainOntologyRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;
