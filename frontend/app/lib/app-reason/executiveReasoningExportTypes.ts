import type { ExecutiveReasoningManifest } from "./executiveReasoningIndex.ts";
import type { ExecutiveReasoningSnapshot } from "./executiveReasoningQueryIndex.ts";

export type ExecutiveReasoningExportStructuralValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
    field?: string;
  }>[];
}>;

export type ExecutiveReasoningExportManifest = Readonly<{
  exportVersion: "APP-REASON-3";
  platformName: "Executive Reasoning Certification & Export Layer";
  foundationPhase: "APP-REASON-1";
  queryPhase: "APP-REASON-2";
  certificationPhase: "APP-REASON-3";
  metadataOnly: true;
}>;

export type ExecutiveReasoningExportMetadata = Readonly<{
  registryId: string;
  exportVersion: "APP-REASON-3";
  packageCount: number;
  contractCount: number;
  snapshotEntryCount: number;
  queryCapabilityCount: number;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type ExecutiveReasoningExportBundle = Readonly<{
  exportManifest: ExecutiveReasoningExportManifest;
  reasoningManifest: ExecutiveReasoningManifest;
  reasoningSnapshot: ExecutiveReasoningSnapshot;
  reasoningSummary: string;
  queryMetadata: Readonly<{
    capabilities: readonly string[];
    metadataOnly: true;
  }>;
  validationMetadata: Readonly<{
    foundationValidation: ExecutiveReasoningExportStructuralValidation;
    registryValidation: ExecutiveReasoningExportStructuralValidation;
    snapshotValidation: ExecutiveReasoningExportStructuralValidation;
    manifestValidation: ExecutiveReasoningExportStructuralValidation;
    metadataOnly: true;
  }>;
  exportMetadata: ExecutiveReasoningExportMetadata;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveReasoningExportValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type ExecutiveReasoningExportComparison = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  diagnostics: readonly string[];
}>;

export type ExecutiveReasoningCertificationStatus = "PASS" | "FAIL";

export type ExecutiveReasoningCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type ExecutiveReasoningCertificationDiagnostic = Readonly<{
  code: "certification_gate_passed" | "certification_gate_failed";
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type ExecutiveReasoningCertificationResult = Readonly<{
  status: ExecutiveReasoningCertificationStatus;
  gates: readonly ExecutiveReasoningCertificationGate[];
  diagnostics: readonly ExecutiveReasoningCertificationDiagnostic[];
  exportBundle: ExecutiveReasoningExportBundle;
}>;

export type ExecutiveReasoningRegressionEntry = Readonly<{
  phaseId: "APP-REASON-1" | "APP-REASON-2" | "APP-REASON-3";
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveReasoningRegressionResult = Readonly<{
  status: ExecutiveReasoningCertificationStatus;
  totalTests: number;
  passed: number;
  failed: number;
  entries: readonly ExecutiveReasoningRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;
