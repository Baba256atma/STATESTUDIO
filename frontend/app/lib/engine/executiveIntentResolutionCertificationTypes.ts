export type ExecutiveCertificationStatus = "Certified";
export type ExecutiveCertificationSeverity = "Informational" | "Warning" | "Error" | "Critical";

export interface ExecutiveCertificationEvidence {
  readonly phase: "ENG-3:1" | "ENG-3:2" | "ENG-3:3" | "ENG-3:4" | "ENG-3:5" | "ENG-3:6";
  readonly publicIndex: string;
  readonly artifact: object;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveCertificationResult {
  readonly status: ExecutiveCertificationStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveCertificationGate {
  readonly id: `eng-3-certification-gate-${string}`;
  readonly name: string;
  readonly severity: ExecutiveCertificationSeverity;
  readonly result: ExecutiveCertificationResult;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveCompatibilityEvidence {
  readonly id: `eng-3-certification-compatibility-${string}`;
  readonly target: string;
  readonly status: "Compatible" | "ArchitecturallyCompatible";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRegressionDeclaration {
  readonly id: `eng-3-certification-regression-${string}`;
  readonly category: string;
  readonly status: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveReleaseReadiness {
  readonly certificationStatus: "Certified";
  readonly freezeReadiness: "ReadyForFreeze";
  readonly publicApiStatus: "Stable";
  readonly dependencyStatus: "Stable";
  readonly metadataStatus: "Stable";
  readonly namespaceStatus: "Stable";
  readonly architectureStatus: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveCertificationMetadata {
  readonly platformId: "ENG-3:7";
  readonly name: "Executive Intent Resolution Certification Platform";
  readonly namespace: "nexora.engine.executive.intent-resolution.certification";
  readonly version: "1.0.0";
  readonly owner: "ENG-3";
  readonly status: "Certified";
  readonly publicationState: "Published";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveCertificationSummary {
  readonly totalCertificationGates: 12;
  readonly certifiedComponents: 6;
  readonly compatibilityCount: 4;
  readonly regressionDeclarationCount: 6;
  readonly releaseReadiness: "ReadyForFreeze";
  readonly certificationStatus: "Certified";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveCertificationManifest {
  readonly ownership: "ENG-3";
  readonly scope: readonly ["ENG-3:1", "ENG-3:2", "ENG-3:3", "ENG-3:4", "ENG-3:5", "ENG-3:6"];
  readonly dependencies: readonly ExecutiveCertificationEvidence[];
  readonly evidence: readonly ExecutiveCertificationEvidence[];
  readonly compatibilityReferences: readonly ExecutiveCompatibilityEvidence[];
  readonly regressionDeclarations: readonly ExecutiveRegressionDeclaration[];
  readonly version: "1.0.0";
  readonly publicationState: "Published";
  readonly releaseReadiness: ExecutiveReleaseReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveCertificationPlatform {
  readonly certificationRegistry: object;
  readonly compatibilityMatrix: readonly ExecutiveCompatibilityEvidence[];
  readonly certificationManifest: ExecutiveCertificationManifest;
  readonly certificationMetadata: ExecutiveCertificationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
