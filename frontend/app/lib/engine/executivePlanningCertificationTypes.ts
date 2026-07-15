export type ExecutivePlanningCertificationOwner = "ENG-5";
export type ExecutivePlanningCertificationVersion = "1.0.0";
export type ExecutivePlanningCertificationPhase = "ENG-5:7";
export type ExecutivePlanningCertificationNamespace =
  "nexora.engine.executive.planning.certification";

export type ExecutivePlanningCertificationStatus =
  | "Pending"
  | "Passed"
  | "Failed"
  | "Certified";

export type ExecutivePlanningCertificationReadiness = "ReadyForFreeze" | "Blocked";

export type ExecutivePlanningCertificationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutivePlanningCertificationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Ownership"
  | "Dependency"
  | "Compatibility"
  | "PublicApi"
  | "Metadata"
  | "Runtime"
  | "Determinism"
  | "Integrity"
  | "Readiness";

export interface ExecutivePlanningCertificationResult {
  readonly status: ExecutivePlanningCertificationStatus;
  readonly description: string;
  readonly readiness: ExecutivePlanningCertificationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutivePlanningCertificationGate {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly certificationPurpose: string;
  readonly category: ExecutivePlanningCertificationCategory;
  readonly severity: ExecutivePlanningCertificationSeverity;
  readonly status: "Passed";
  readonly expectedStatus: "Passed";
  readonly readinessTarget: ExecutivePlanningCertificationReadiness;
  readonly owner: ExecutivePlanningCertificationOwner;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutivePlanningCertificationMetadata {
  readonly platformId: "ENG-5:7";
  readonly name: "Executive Planning Certification Platform";
  readonly version: ExecutivePlanningCertificationVersion;
  readonly namespace: ExecutivePlanningCertificationNamespace;
  readonly description: string;
  readonly phase: ExecutivePlanningCertificationPhase;
  readonly owner: ExecutivePlanningCertificationOwner;
  readonly certifiedPlatformId: "ENG-5:6";
  readonly status: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly gateCount: 15;
  readonly passedGateCount: 15;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly nextPhase: "ENG-5:8";
}

export interface ExecutivePlanningCertificationSummaryDescriptor {
  readonly certificationId: "ENG-5:7";
  readonly phase: ExecutivePlanningCertificationPhase;
  readonly namespace: ExecutivePlanningCertificationNamespace;
  readonly owner: ExecutivePlanningCertificationOwner;
  readonly certifiedPlatformId: "ENG-5:6";
  readonly gateCount: 15;
  readonly passedGateCount: 15;
  readonly certificationStatus: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly architecturalGuarantees: readonly string[];
  readonly platformMaturity: "Certified";
  readonly nextPhase: "ENG-5:8";
  readonly nextPhaseName: "Executive Planning Freeze Platform";
  readonly executionOwner: "OPS";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutivePlanningCertificationPlatformMetadata {
  readonly platformId: "ENG-5:7";
  readonly name: "Executive Planning Certification Platform";
  readonly version: ExecutivePlanningCertificationVersion;
  readonly namespace: ExecutivePlanningCertificationNamespace;
  readonly description: string;
  readonly status: Readonly<{
    certification: "Certification";
    certified: "Certified";
    metadataOnly: "MetadataOnly";
    runtimeFree: "RuntimeFree";
    immutable: "Immutable";
    deterministic: "Deterministic";
    readyForFreeze: "ReadyForFreeze";
  }>;
  readonly ownership: "ENG-5";
  readonly executionOwner: "OPS";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly nextPhase: "ENG-5:8";
}
