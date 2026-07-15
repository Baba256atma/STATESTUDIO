export type ExecutiveContextCertificationOwner = "ENG-4";
export type ExecutiveContextCertificationVersion = "1.0.0";
export type ExecutiveContextCertificationNamespace = "nexora.engine.executive.context-assembly.certification";
export type ExecutiveContextCertificationPhase = "ENG-4:7";
export type ExecutiveContextCertificationGateStatus = "Pass" | "Fail" | "Warning" | "NotApplicable";
export type ExecutiveContextCertificationState = "Certified" | "NotCertified" | "ConditionallyCertified";
export type ExecutiveContextCertificationSeverity = "Critical" | "High" | "Medium" | "Low" | "Informational";
export type ExecutiveContextCertificationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Ownership"
  | "Compatibility"
  | "Regression"
  | "PublicApi"
  | "Boundary"
  | "Readiness";

export interface ExecutiveContextCertificationResult {
  readonly status: ExecutiveContextCertificationState;
  readonly description: string;
  readonly freezeReadiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextCertificationGate {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveContextCertificationCategory;
  readonly severity: ExecutiveContextCertificationSeverity;
  readonly status: ExecutiveContextCertificationGateStatus;
  readonly evidenceReferences: readonly string[];
  readonly certifiedPhase: "ENG-4:1" | "ENG-4:2" | "ENG-4:3" | "ENG-4:4" | "ENG-4:5" | "ENG-4:6" | "ENG-4:7";
  readonly owner: ExecutiveContextCertificationOwner;
  readonly guarantee: string;
  readonly runtimeFree: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextCertificationEvidence {
  readonly evidenceId: string;
  readonly category: string;
  readonly description: string;
  readonly publicSurface: string;
  readonly declaredCount?: number;
  readonly artifactReference?: object;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly inspectionProhibited: true;
}

export interface ExecutiveContextCertificationCompatibilityEntry {
  readonly id: string;
  readonly subject: string;
  readonly classification: string;
  readonly description: string;
  readonly status: "Compatible" | "ApprovedCompatibility" | "BoundaryDeclared";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextCertificationRegressionEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Pass";
  readonly preservedSurface: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextCertificationGuarantee {
  readonly id: string;
  readonly guarantee: string;
  readonly status: "Guaranteed";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextCertificationDependency {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly direction: "ForwardOnly";
  readonly consumption: "PublicIndexOnly";
  readonly reverseDependency: false;
  readonly circularDependency: false;
  readonly futurePhaseDependency: false;
  readonly publicIndexReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextCertificationMetadata {
  readonly certificationId: "ENG-4:7";
  readonly version: ExecutiveContextCertificationVersion;
  readonly name: "Executive Context Assembly Certification";
  readonly description: string;
  readonly namespace: ExecutiveContextCertificationNamespace;
  readonly phase: ExecutiveContextCertificationPhase;
  readonly owner: ExecutiveContextCertificationOwner;
  readonly certifiedPlatformId: "ENG-4:6";
  readonly gateCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCount: number;
  readonly regressionCount: number;
  readonly certificationResult: "Certified";
  readonly status: Readonly<{
    certification: "Certification";
    certified: "Certified";
    validated: "Validated";
    metadataOnly: "MetadataOnly";
    immutable: "Immutable";
    runtimeFree: "RuntimeFree";
    deterministic: "Deterministic";
    ownershipProtected: "OwnershipProtected";
    antiDuplicationProtected: "AntiDuplicationProtected";
    publicApiStable: "PublicApiStable";
    readyForFreeze: "ReadyForFreeze";
  }>;
  readonly nextPhase: "ENG-4:8";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextCertificationSummary {
  readonly certificationId: "ENG-4:7";
  readonly phase: ExecutiveContextCertificationPhase;
  readonly namespace: ExecutiveContextCertificationNamespace;
  readonly owner: ExecutiveContextCertificationOwner;
  readonly certifiedPlatformId: "ENG-4:6";
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCount: number;
  readonly regressionCount: number;
  readonly guaranteeCount: number;
  readonly certificationResult: "Certified";
  readonly freezeReadiness: "ReadyForFreeze";
  readonly nextPhase: "ENG-4:8";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextAssemblyCertificationAggregate {
  readonly metadata: ExecutiveContextCertificationMetadata;
  readonly platform: object;
  readonly gates: readonly ExecutiveContextCertificationGate[];
  readonly evidence: readonly ExecutiveContextCertificationEvidence[];
  readonly compatibility: readonly ExecutiveContextCertificationCompatibilityEntry[];
  readonly regression: readonly ExecutiveContextCertificationRegressionEntry[];
  readonly guarantees: readonly ExecutiveContextCertificationGuarantee[];
  readonly dependencies: readonly ExecutiveContextCertificationDependency[];
  readonly result: ExecutiveContextCertificationResult;
  readonly summary: ExecutiveContextCertificationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
