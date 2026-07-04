import type { DomainFoundationManifest, DomainValidationResult } from "./domainFoundationIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeIndex.ts";
import type { DomainOntologyFreezeResult } from "./domainOntologyPlatformFreezeIndex.ts";
import type {
  DomainKpiFoundationManifest,
  DomainKpiRegistry,
  DomainKpiValidationResult,
} from "./domainKpiIndex.ts";
import type { DomainKpiSnapshot } from "./domainKpiQueryIndex.ts";

export const DOMAIN_KPI_EXPORT_CONTRACT_VERSION = "DOM-4:3" as const;

export type DomainKpiCertificationStatus = "PASS" | "FAIL";

export type DomainKpiExportSection =
  | "kpiManifest"
  | "kpiSnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "referenceInspectionCapability"
  | "diffCapability"
  | "fingerprint";

export type DomainKpiCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainKpiExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_KPI_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packageCount: number;
  sections: readonly DomainKpiExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainKpiExportBundle = Readonly<{
  metadata: DomainKpiExportMetadata;
  kpiManifest: DomainKpiFoundationManifest;
  kpiSnapshot: DomainKpiSnapshot;
  validation: DomainKpiValidationResult;
  queryCapability: DomainKpiCapabilityMetadata;
  lookupCapability: DomainKpiCapabilityMetadata;
  referenceInspectionCapability: DomainKpiCapabilityMetadata;
  diffCapability: DomainKpiCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainKpiExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainKpiExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainKpiCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainKpiCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_KPI_EXPORT_CONTRACT_VERSION;
  status: DomainKpiCertificationStatus;
  gates: readonly DomainKpiCertificationGate[];
  exportBundle: DomainKpiExportBundle;
}>;

export type DomainKpiRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainKpiRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_KPI_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainKpiRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainKpiCompatibilityResult = Readonly<{
  compatible: boolean;
  kpiContractVersion: DomainKpiRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  vocabularyFreeze: DomainVocabularyFreezeResult;
  ontologyFreeze: DomainOntologyFreezeResult;
  metadataOnly: true;
}>;
