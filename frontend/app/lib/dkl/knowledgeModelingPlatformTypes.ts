/**
 * DKL-4:6 — Knowledge Modeling Platform Types.
 *
 * Readonly contracts for the canonical immutable Platform composition layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

export interface KnowledgeModelingPlatformIdentityDescriptor {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-4:6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly owner: string;
  readonly architectureType: "KnowledgeModelingPlatform";
  readonly sourcePhases: readonly [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
    "DKL-4:5",
  ];
  readonly publicVisibility: "Public";
  readonly stability: "Stable";
  readonly compatibilityStatus: "Compatible";
  readonly extensionStatus: "AdditiveAllowed";
  readonly metadataOnly: true;
  readonly runtimeBehavior: "Forbidden";
  readonly certificationTarget: "DKL-4:7";
  readonly freezeTarget: "DKL-4:8";
  readonly publicIndexTarget: "DKL-4:9";
  readonly platformId: "DKL-4";
  readonly sourcePhase: "DKL-4:6";
}

export interface PlatformComponentEntry {
  readonly id: string;
  readonly name: string;
  readonly phase: string;
  readonly publicEntryPoint: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly readiness: string;
  readonly owner: string;
  readonly dependencyOrder: number;
  readonly platformPosition: number;
  readonly stability: "Stable";
  readonly compatibility: "Compatible";
  readonly extensionPolicy: "AdditiveAllowed";
  readonly includedByReference: true;
  readonly ownedByPlatform: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PlatformDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly module: string;
  readonly version: string;
  readonly phase: string;
  readonly readiness: string;
  readonly dependencyOrder: number;
  readonly required: true;
  readonly futurePhase: false;
  readonly publicEntryPointOnly: true;
}

export interface PlatformCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface PlatformExtensionEntry {
  readonly extensionId: string;
  readonly name: string;
  readonly status: "AdditiveAllowed";
  readonly ownedBy: string;
  readonly description: string;
  readonly platformMutableRegistration: false;
}

export interface PlatformReadinessGate {
  readonly gateId: string;
  readonly name: string;
  readonly status: "Pass" | "Fail";
  readonly expected: string;
  readonly actual: string;
}

export interface PlatformSummaryDescriptor {
  readonly platformId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-4:6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly sectionCount: 6;
  readonly componentCount: 5;
  readonly dependencyCount: 5;
  readonly readinessGateCount: number;
  readonly readinessGatesPassed: number;
  readonly readinessGatesFailed: number;
  readonly allReadinessGatesPass: true;
  readonly totalPublicApiCount: 48;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface PlatformStatusDescriptor {
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly allReadinessGatesPass: true;
  readonly foundationComplete: true;
  readonly registryComplete: true;
  readonly modelComplete: true;
  readonly validationComplete: true;
  readonly validationPass: true;
  readonly manifestComplete: true;
  readonly platformComplete: true;
  readonly runtimeBehaviorForbidden: true;
  readonly ownershipConflictsAbsent: true;
  readonly nextPhase: "DKL-4:7 — Knowledge Modeling Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
