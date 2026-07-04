import type { DomainFoundationManifest, DomainValidationResult } from "./domainFoundationIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeIndex.ts";
import type { DomainOntologyFreezeResult } from "./domainOntologyPlatformFreezeIndex.ts";
import type { DomainKpiFreezeResult } from "./domainKpiPlatformFreezeIndex.ts";
import type {
  DomainRegulationFoundationManifest,
  DomainRegulationRegistry,
  DomainRegulationValidationResult,
} from "./domainRegulationIndex.ts";
import type { DomainRegulationSnapshot } from "./domainRegulationQueryIndex.ts";

export const DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION = "DOM-5:3" as const;

export type DomainRegulationCertificationStatus = "PASS" | "FAIL";

export type DomainRegulationExportSection =
  | "regulationManifest"
  | "regulationSnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "referenceInspectionCapability"
  | "snapshotMetadata"
  | "diffMetadata"
  | "diffCapability"
  | "fingerprint";

export type DomainRegulationCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainRegulationExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packageCount: number;
  sections: readonly DomainRegulationExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainRegulationSnapshotMetadata = Readonly<{
  registryId: string;
  packageCount: number;
  fingerprint: string;
  valid: boolean;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRegulationDiffMetadata = Readonly<{
  comparisonBaseline: "self";
  equal: boolean;
  entryCount: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRegulationExportBundle = Readonly<{
  metadata: DomainRegulationExportMetadata;
  regulationManifest: DomainRegulationFoundationManifest;
  regulationSnapshot: DomainRegulationSnapshot;
  validation: DomainRegulationValidationResult;
  queryCapability: DomainRegulationCapabilityMetadata;
  lookupCapability: DomainRegulationCapabilityMetadata;
  referenceInspectionCapability: DomainRegulationCapabilityMetadata;
  snapshotMetadata: DomainRegulationSnapshotMetadata;
  diffMetadata: DomainRegulationDiffMetadata;
  diffCapability: DomainRegulationCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainRegulationExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainRegulationExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainRegulationCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainRegulationCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type DomainRegulationCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION;
  status: DomainRegulationCertificationStatus;
  gates: readonly DomainRegulationCertificationGate[];
  diagnostics: readonly DomainRegulationCertificationDiagnostic[];
  exportBundle: DomainRegulationExportBundle;
}>;

export type DomainRegulationRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRegulationRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainRegulationRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRegulationCompatibilityResult = Readonly<{
  compatible: boolean;
  regulationContractVersion: DomainRegulationRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  vocabularyFreeze: DomainVocabularyFreezeResult;
  ontologyFreeze: DomainOntologyFreezeResult;
  kpiFreeze: DomainKpiFreezeResult;
  metadataOnly: true;
}>;
