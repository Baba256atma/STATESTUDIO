import type {
  DomainFoundationManifest,
  DomainValidationResult,
} from "./domainFoundationIndex.ts";
import type {
  DomainVocabularyFoundationManifest,
  DomainVocabularyRegistry,
  DomainVocabularyValidationResult,
} from "./domainVocabularyIndex.ts";
import type { DomainVocabularySnapshot } from "./domainVocabularyQueryIndex.ts";

export const DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION = "DOM-2:3" as const;

export type DomainVocabularyCertificationStatus = "PASS" | "FAIL";

export type DomainVocabularyExportSection =
  | "vocabularyManifest"
  | "vocabularySnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "synonymResolutionCapability"
  | "diffCapability"
  | "fingerprint";

export type DomainVocabularyCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainVocabularyExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  vocabularyCount: number;
  sections: readonly DomainVocabularyExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainVocabularyExportBundle = Readonly<{
  metadata: DomainVocabularyExportMetadata;
  vocabularyManifest: DomainVocabularyFoundationManifest;
  vocabularySnapshot: DomainVocabularySnapshot;
  validation: DomainVocabularyValidationResult;
  queryCapability: DomainVocabularyCapabilityMetadata;
  lookupCapability: DomainVocabularyCapabilityMetadata;
  synonymResolutionCapability: DomainVocabularyCapabilityMetadata;
  diffCapability: DomainVocabularyCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainVocabularyExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainVocabularyExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainVocabularyCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainVocabularyCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION;
  status: DomainVocabularyCertificationStatus;
  gates: readonly DomainVocabularyCertificationGate[];
  exportBundle: DomainVocabularyExportBundle;
}>;

export type DomainVocabularyRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainVocabularyRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainVocabularyRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainVocabularyCompatibilityResult = Readonly<{
  compatible: boolean;
  vocabularyContractVersion: DomainVocabularyRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  metadataOnly: true;
}>;
