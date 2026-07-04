import type { DomainFoundationManifest, DomainValidationResult } from "./domainFoundationIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeIndex.ts";
import type { DomainOntologyFreezeResult } from "./domainOntologyPlatformFreezeIndex.ts";
import type { DomainKpiFreezeResult } from "./domainKpiPlatformFreezeIndex.ts";
import type { DomainRegulationCertificationResult } from "./domainRegulationCertificationIndex.ts";
import type { DomainReasoningFreezeResult } from "./domainReasoningPlatformFreezeIndex.ts";
import type {
  DomainRecommendationFoundationManifest,
  DomainRecommendationRegistry,
  DomainRecommendationValidationResult,
} from "./domainRecommendationIndex.ts";
import type { DomainRecommendationSnapshot } from "./domainRecommendationQueryIndex.ts";

export const DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION = "DOM-7:3" as const;

export type DomainRecommendationCertificationStatus = "PASS" | "FAIL";

export type DomainRecommendationExportSection =
  | "recommendationManifest"
  | "recommendationSnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "referenceInspectionCapability"
  | "snapshotMetadata"
  | "diffMetadata"
  | "diffCapability"
  | "fingerprint";

export type DomainRecommendationCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainRecommendationExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packageCount: number;
  sections: readonly DomainRecommendationExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainRecommendationSnapshotMetadata = Readonly<{
  registryId: string;
  packageCount: number;
  fingerprint: string;
  valid: boolean;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRecommendationDiffMetadata = Readonly<{
  comparisonBaseline: "self";
  equal: boolean;
  entryCount: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRecommendationExportBundle = Readonly<{
  metadata: DomainRecommendationExportMetadata;
  recommendationManifest: DomainRecommendationFoundationManifest;
  recommendationSnapshot: DomainRecommendationSnapshot;
  validation: DomainRecommendationValidationResult;
  queryCapability: DomainRecommendationCapabilityMetadata;
  lookupCapability: DomainRecommendationCapabilityMetadata;
  referenceInspectionCapability: DomainRecommendationCapabilityMetadata;
  snapshotMetadata: DomainRecommendationSnapshotMetadata;
  diffMetadata: DomainRecommendationDiffMetadata;
  diffCapability: DomainRecommendationCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainRecommendationExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainRecommendationExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainRecommendationCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainRecommendationCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type DomainRecommendationCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION;
  status: DomainRecommendationCertificationStatus;
  gates: readonly DomainRecommendationCertificationGate[];
  diagnostics: readonly DomainRecommendationCertificationDiagnostic[];
  exportBundle: DomainRecommendationExportBundle;
}>;

export type DomainRecommendationRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRecommendationRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainRecommendationRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRecommendationCompatibilityResult = Readonly<{
  compatible: boolean;
  recommendationContractVersion: DomainRecommendationRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  vocabularyFreeze: DomainVocabularyFreezeResult;
  ontologyFreeze: DomainOntologyFreezeResult;
  kpiFreeze: DomainKpiFreezeResult;
  regulationCertification: DomainRegulationCertificationResult;
  reasoningFreeze: DomainReasoningFreezeResult;
  metadataOnly: true;
}>;
