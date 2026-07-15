export type ExecutiveReasoningCertificationOwner = "ENG-6";
export type ExecutiveReasoningCertificationVersion = "1.0.0";
export type ExecutiveReasoningCertificationPhase = "ENG-6:7";
export type ExecutiveReasoningCertificationNamespace =
  "nexora.engine.executive.reasoning.certification";

export type ExecutiveReasoningCertificationStatus =
  | "PENDING"
  | "PASS"
  | "WARNING"
  | "FAIL"
  | "CERTIFIED";

export type ExecutiveReasoningCertificationGateStatus =
  | "PASS"
  | "WARNING"
  | "FAIL";

export type ExecutiveReasoningCertificationReadiness =
  | "ReadyForFreeze"
  | "Blocked";

export type ExecutiveReasoningCertificationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveReasoningCertificationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Ownership"
  | "Dependency"
  | "PublicApi"
  | "Compatibility"
  | "Immutability"
  | "ReleaseReadiness";

export interface ExecutiveReasoningCertificationGate {
  readonly id: string;
  readonly gateNumber: number;
  readonly title: string;
  readonly description: string;
  readonly certificationPurpose: string;
  readonly category: ExecutiveReasoningCertificationCategory;
  readonly severity: ExecutiveReasoningCertificationSeverity;
  readonly status: ExecutiveReasoningCertificationGateStatus;
  readonly expectedStatus: "PASS";
  readonly certifiedPhase: string;
  readonly owner: ExecutiveReasoningCertificationOwner;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly aiFree: true;
}

export interface ExecutiveReasoningCertificationRunnerResult {
  readonly status: ExecutiveReasoningCertificationStatus;
  readonly passCount: number;
  readonly warningCount: number;
  readonly failCount: number;
  readonly totalGateCount: number;
  readonly freezeReadiness: ExecutiveReasoningCertificationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
