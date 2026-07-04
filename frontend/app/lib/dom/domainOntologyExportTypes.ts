import type {
  DomainOntologyFoundationManifest,
  DomainOntologyRegistry,
  DomainOntologyValidationResult,
} from "./domainOntologyIndex.ts";
import type { DomainOntologySnapshot } from "./domainOntologyQueryIndex.ts";
import type { DomainValidationResult, DomainFoundationManifest } from "./domainFoundationIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeIndex.ts";

export const DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION = "DOM-3:3" as const;

export type DomainOntologyCertificationStatus = "PASS" | "FAIL";

export type DomainOntologyExportSection =
  | "ontologyManifest"
  | "ontologySnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "traversalCapability"
  | "diffCapability"
  | "fingerprint";

export type DomainOntologyCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainOntologyExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  ontologyCount: number;
  sections: readonly DomainOntologyExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainOntologyExportBundle = Readonly<{
  metadata: DomainOntologyExportMetadata;
  ontologyManifest: DomainOntologyFoundationManifest;
  ontologySnapshot: DomainOntologySnapshot;
  validation: DomainOntologyValidationResult;
  queryCapability: DomainOntologyCapabilityMetadata;
  lookupCapability: DomainOntologyCapabilityMetadata;
  traversalCapability: DomainOntologyCapabilityMetadata;
  diffCapability: DomainOntologyCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainOntologyExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainOntologyExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainOntologyCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainOntologyCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION;
  status: DomainOntologyCertificationStatus;
  gates: readonly DomainOntologyCertificationGate[];
  exportBundle: DomainOntologyExportBundle;
}>;

export type DomainOntologyRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainOntologyRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainOntologyRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainOntologyCompatibilityResult = Readonly<{
  compatible: boolean;
  ontologyContractVersion: DomainOntologyRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  vocabularyFreeze: DomainVocabularyFreezeResult;
  metadataOnly: true;
}>;
