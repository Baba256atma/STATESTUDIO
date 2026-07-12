export type ExecutiveRequestIntentCertificationStatus = "Certified";
export type ExecutiveRequestIntentCertificationCategory = "Foundation" | "Registry" | "Model" | "Validation" | "Manifest" | "Platform" | "PublicAPI" | "Namespace" | "Ownership" | "AntiDuplication" | "MetadataOnly" | "Dependency";

export interface ExecutiveRequestIntentCertificationGate {
  readonly identifier: `eng-2-certification-${string}`;
  readonly name: string;
  readonly description: string;
  readonly owningPhase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4" | "ENG-2:5" | "ENG-2:6" | "ENG-2:7";
  readonly category: ExecutiveRequestIntentCertificationCategory;
  readonly status: ExecutiveRequestIntentCertificationStatus;
  readonly evidenceReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentCompatibility {
  readonly identifier: `eng-2-compatibility-${string}`;
  readonly target: string;
  readonly status: "Compatible" | "ArchitecturallyReady";
  readonly description: string;
  readonly boundary: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentReleaseReadiness {
  readonly certificationStatus: "Certified";
  readonly freezeReadiness: "ReadyForFreeze";
  readonly publicApiStatus: "Stable";
  readonly ownershipStatus: "Safe";
  readonly namespaceStatus: "Stable";
  readonly metadataStatus: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentCertificationSummary {
  readonly gateCount: 12;
  readonly certifiedGateCount: 12;
  readonly compatibilityCount: 8;
  readonly dependencyCount: 6;
  readonly certificationStatus: "Certified";
  readonly freezeReadiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestIntentCertification {
  readonly registry: readonly ExecutiveRequestIntentCertificationGate[];
  readonly compatibility: readonly ExecutiveRequestIntentCompatibility[];
  readonly manifest: object;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
