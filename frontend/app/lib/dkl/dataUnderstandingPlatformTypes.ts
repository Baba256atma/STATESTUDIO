/**
 * DKL-3:6 — Data Understanding Platform Types.
 *
 * Readonly contracts for the canonical immutable Platform layer.
 * Platform metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:6.
 */

export interface DataUnderstandingPlatformIdentityDescriptor {
  readonly platformId: "DKL-3";
  readonly platformVersion: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
}

export interface PlatformComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly publicApiCount: 8;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PlatformDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly module: string;
  readonly version: string | null;
  readonly phase: string;
  readonly readiness: string;
  readonly required: true;
  readonly futurePhase: false;
}

export interface PlatformCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface PlatformReadinessDescriptor {
  readonly FoundationComplete: true;
  readonly RegistryComplete: true;
  readonly ModelComplete: true;
  readonly ValidationComplete: true;
  readonly ManifestComplete: true;
  readonly PlatformComplete: true;
  readonly ReadyForCertification: true;
  readonly ReadyForFreeze: true;
  readonly ReadyForPublicIndex: true;
  readonly MetadataOnly: true;
  readonly PlatformOnly: true;
  readonly Deterministic: true;
  readonly Immutable: true;
  readonly UnderstandingForbidden: true;
  readonly SemanticInferenceForbidden: true;
  readonly CandidateGenerationForbidden: true;
  readonly ValidationExecutionForbidden: true;
  readonly BusinessObjectCreationForbidden: true;
  readonly KnowledgeGraphForbidden: true;
  readonly PersistenceForbidden: true;
  readonly AIFree: true;
  readonly EngineFree: true;
}

export interface PlatformSummaryDescriptor {
  readonly totalComponents: number;
  readonly totalRegistries: number;
  readonly totalModels: number;
  readonly totalValidationRules: number;
  readonly totalDependencies: number;
  readonly totalPublicApis: number;
  readonly totalReferences: number;
  readonly totalInventories: number;
  readonly totalMetadataObjects: number;
  readonly namespaceSectionCount: 5;
  readonly phasesCompleted: 5;
  readonly platformId: "DKL-3";
  readonly nextPhase: "DKL-3:7";
}
