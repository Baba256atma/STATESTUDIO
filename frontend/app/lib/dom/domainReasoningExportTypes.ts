import type { DomainFoundationManifest, DomainValidationResult } from "./domainFoundationIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeIndex.ts";
import type { DomainOntologyFreezeResult } from "./domainOntologyPlatformFreezeIndex.ts";
import type { DomainKpiFreezeResult } from "./domainKpiPlatformFreezeIndex.ts";
import type { DomainRegulationCertificationResult } from "./domainRegulationCertificationIndex.ts";
import type {
  DomainReasoningFoundationManifest,
  DomainReasoningRegistry,
  DomainReasoningValidationResult,
} from "./domainReasoningIndex.ts";
import type { DomainReasoningSnapshot } from "./domainReasoningQueryIndex.ts";

export const DOMAIN_REASONING_EXPORT_CONTRACT_VERSION = "DOM-6:3" as const;

export type DomainReasoningCertificationStatus = "PASS" | "FAIL";

export type DomainReasoningExportSection =
  | "reasoningManifest"
  | "reasoningSnapshot"
  | "validation"
  | "queryCapability"
  | "lookupCapability"
  | "referenceInspectionCapability"
  | "snapshotMetadata"
  | "diffMetadata"
  | "diffCapability"
  | "fingerprint";

export type DomainReasoningCapabilityMetadata = Readonly<{
  capabilityId: string;
  publicApis: readonly string[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainReasoningExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packageCount: number;
  sections: readonly DomainReasoningExportSection[];
  deterministic: true;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type DomainReasoningSnapshotMetadata = Readonly<{
  registryId: string;
  packageCount: number;
  fingerprint: string;
  valid: boolean;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainReasoningDiffMetadata = Readonly<{
  comparisonBaseline: "self";
  equal: boolean;
  entryCount: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainReasoningExportBundle = Readonly<{
  metadata: DomainReasoningExportMetadata;
  reasoningManifest: DomainReasoningFoundationManifest;
  reasoningSnapshot: DomainReasoningSnapshot;
  validation: DomainReasoningValidationResult;
  queryCapability: DomainReasoningCapabilityMetadata;
  lookupCapability: DomainReasoningCapabilityMetadata;
  referenceInspectionCapability: DomainReasoningCapabilityMetadata;
  snapshotMetadata: DomainReasoningSnapshotMetadata;
  diffMetadata: DomainReasoningDiffMetadata;
  diffCapability: DomainReasoningCapabilityMetadata;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainReasoningExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainReasoningExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
  snapshotEqual: boolean;
}>;

export type DomainReasoningCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainReasoningCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type DomainReasoningCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_EXPORT_CONTRACT_VERSION;
  status: DomainReasoningCertificationStatus;
  gates: readonly DomainReasoningCertificationGate[];
  diagnostics: readonly DomainReasoningCertificationDiagnostic[];
  exportBundle: DomainReasoningExportBundle;
}>;

export type DomainReasoningRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainReasoningRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainReasoningRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainReasoningCompatibilityResult = Readonly<{
  compatible: boolean;
  reasoningContractVersion: DomainReasoningRegistry["contractVersion"];
  domainValidation: DomainValidationResult;
  foundationManifest: DomainFoundationManifest;
  vocabularyFreeze: DomainVocabularyFreezeResult;
  ontologyFreeze: DomainOntologyFreezeResult;
  kpiFreeze: DomainKpiFreezeResult;
  regulationCertification: DomainRegulationCertificationResult;
  metadataOnly: true;
}>;
