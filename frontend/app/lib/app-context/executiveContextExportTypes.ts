import type { ExecutiveContextManifest, ExecutiveContextValidation } from "./executiveContextIndex.ts";
import type { ExecutiveContextSnapshot } from "./executiveContextQueryIndex.ts";

export type ExecutiveContextCertificationStatus = "PASS" | "FAIL";

export type ExecutiveContextExportManifest = Readonly<{
  exportVersion: "APP-CTX-3";
  platformName: "Executive Context Certification & Export Layer";
  builderPhase: "APP-CTX-1";
  queryPhase: "APP-CTX-2";
  certificationPhase: "APP-CTX-3";
  metadataOnly: true;
}>;

export type ExecutiveContextExportMetadata = Readonly<{
  contextId: string;
  contextVersion: "APP-CTX-1";
  exportVersion: "APP-CTX-3";
  sectionCount: number;
  snapshotEntryCount: number;
  queryCapabilityCount: number;
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type ExecutiveContextExportValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type ExecutiveContextExportBundle = Readonly<{
  exportManifest: ExecutiveContextExportManifest;
  contextManifest: ExecutiveContextManifest;
  contextSnapshot: ExecutiveContextSnapshot;
  contextSummary: string;
  queryMetadata: Readonly<{
    sections: readonly string[];
    capabilities: readonly string[];
    metadataOnly: true;
  }>;
  validationMetadata: Readonly<{
    contextValidation: ExecutiveContextValidation;
    snapshotValidation: ExecutiveContextExportValidation;
    manifestValidation: ExecutiveContextExportValidation;
    metadataOnly: true;
  }>;
  exportMetadata: ExecutiveContextExportMetadata;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveContextExportComparison = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  diagnostics: readonly string[];
}>;

export type ExecutiveContextCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type ExecutiveContextCertificationDiagnostic = Readonly<{
  code: string;
  message: string;
  gateId: string;
  severity: "info" | "error";
}>;

export type ExecutiveContextCertificationResult = Readonly<{
  status: ExecutiveContextCertificationStatus;
  gates: readonly ExecutiveContextCertificationGate[];
  diagnostics: readonly ExecutiveContextCertificationDiagnostic[];
  exportBundle: ExecutiveContextExportBundle;
}>;

export type ExecutiveContextRegressionEntry = Readonly<{
  phaseId: "APP-CTX-1" | "APP-CTX-2" | "APP-CTX-3";
  description: string;
  passed: number;
  total: number;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveContextRegressionResult = Readonly<{
  status: ExecutiveContextCertificationStatus;
  totalTests: number;
  passed: number;
  failed: number;
  entries: readonly ExecutiveContextRegressionEntry[];
  deterministic: true;
  metadataOnly: true;
}>;
