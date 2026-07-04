import type {
  DomainVocabularyCertificationStatus,
  DomainVocabularyRegressionResult,
} from "./domainVocabularyCertificationIndex.ts";

export type DomainVocabularyFreezeStatus = "PASS" | "FAIL";

export type DomainVocabularyPlatformIdentity = Readonly<{
  platformId: "nexora-domain-vocabulary-platform";
  platformName: "Nexora Domain Vocabulary Platform";
  layerId: "DOM";
  phaseId: "DOM-2";
  version: "DOM-2:4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainVocabularyPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-2:1" | "DOM-2:2" | "DOM-2:3" | "DOM-2:4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  behaviorAdded: boolean;
  metadataOnly: true;
}>;

export type DomainVocabularyPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: DomainVocabularyPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainVocabularyCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "future-compatible" | "consumer-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainVocabularyExtensionPolicy = Readonly<{
  allowsNewVocabularyPackages: true;
  allowsNewQueryUtilities: false;
  allowsRuntimeInference: false;
  allowsAiLogic: false;
  allowsFuzzyMatching: false;
  requiresPublicApiConsumption: true;
  requiresCertificationForMutation: true;
  policy: "metadata-extension-only";
}>;

export type DomainVocabularyReleaseMetadata = Readonly<{
  releaseId: "dom-2-vocabulary-platform-freeze";
  releaseName: "DOM-2 Domain Vocabulary Platform Freeze";
  releaseVersion: "DOM-2:4";
  certificationDependency: "DOM-2:3";
  regressionDependency: "DOM-2 regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainVocabularyPlatformFreezeManifest = Readonly<{
  platformIdentity: DomainVocabularyPlatformIdentity;
  phaseRegistry: readonly DomainVocabularyPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainVocabularyPublicApiEntry[];
  compatibilityMatrix: readonly DomainVocabularyCompatibilityEntry[];
  extensionPolicy: DomainVocabularyExtensionPolicy;
  releaseMetadata: DomainVocabularyReleaseMetadata;
  certificationStatus: DomainVocabularyCertificationStatus;
  regressionStatus: DomainVocabularyFreezeStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainVocabularyFreezeResult = Readonly<{
  status: DomainVocabularyFreezeStatus;
  manifest: DomainVocabularyPlatformFreezeManifest;
  certificationStatus: DomainVocabularyCertificationStatus;
  regression: DomainVocabularyRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;
