import type { DomainFoundationManifest, DomainValidationResult } from "./domainFoundationIndex.ts";
import type { DomainRegistrySnapshot } from "./domainRegistryQueryIndex.ts";
import type { DomainRegistryIndex, DomainRegistryStats } from "./domainRegistryStatsIndex.ts";

export const DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION = "DOM-1:4" as const;

export type DomainRegistryCertificationStatus = "PASS" | "FAIL";

export type DomainRegistryExportSection =
  | "foundationManifest"
  | "registrySnapshot"
  | "registryStats"
  | "registryIndex"
  | "validation"
  | "fingerprint";

export type DomainRegistryExportMetadata = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  domainCount: number;
  sections: readonly DomainRegistryExportSection[];
  deterministic: true;
}>;

export type DomainRegistryExportBundle = Readonly<{
  metadata: DomainRegistryExportMetadata;
  foundationManifest: DomainFoundationManifest;
  registrySnapshot: DomainRegistrySnapshot;
  registryStats: DomainRegistryStats;
  registryIndex: DomainRegistryIndex;
  validation: DomainValidationResult;
  fingerprint: string;
  exportValid: boolean;
}>;

export type DomainRegistryExportValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainRegistryExportComparison = Readonly<{
  equal: boolean;
  fingerprintEqual: boolean;
  metadataEqual: boolean;
  validationEqual: boolean;
}>;

export type DomainRegistryCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type DomainRegistryCertificationResult = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION;
  status: DomainRegistryCertificationStatus;
  gates: readonly DomainRegistryCertificationGate[];
  exportBundle: DomainRegistryExportBundle;
}>;

export type DomainRegistryRegressionEntry = Readonly<{
  phaseId: string;
  description: string;
  passed: number;
  total: number;
  deterministic: true;
}>;

export type DomainRegistryRegressionResult = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION;
  totalTests: number;
  passed: number;
  failed: number;
  command: string;
  entries: readonly DomainRegistryRegressionEntry[];
  deterministic: true;
}>;
