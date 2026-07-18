/**
 * DKL-4:5 — Knowledge Modeling Manifest Types.
 *
 * Readonly contracts for the canonical DKL-4 Manifest inventory.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:5.
 */

export interface KnowledgeModelingManifestIdentityDescriptor {
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly manifestName: string;
  readonly manifestNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:5";
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly status: "ManifestComplete";
  readonly readiness: "ReadyForPlatform";
}

export interface ManifestComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly publicApiCount: 8;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ManifestDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly module: string;
  readonly version: string;
  readonly phase: string;
  readonly readiness: string;
  readonly required: true;
  readonly futurePhase: false;
  readonly publicEntryPointOnly: true;
}

export interface ManifestInventoryCounts {
  readonly componentCount: 5;
  readonly foundationPublicApiCount: 8;
  readonly registryPublicApiCount: 8;
  readonly modelPublicApiCount: 8;
  readonly validationPublicApiCount: 8;
  readonly manifestPublicApiCount: 8;
  readonly totalPublicApiCount: 40;
  readonly registryCategoryCount: number;
  readonly businessObjectCategoryCount: number;
  readonly relationshipCategoryCount: number;
  readonly canonicalModelCount: number;
  readonly validationCategoryCount: number;
  readonly validationRuleCount: number;
  readonly lifecycleStateCount: number;
  readonly extensionPolicyCount: number;
  readonly compatibilityPolicyCount: number;
  readonly dependencyCount: number;
}

export interface ManifestSummaryDescriptor {
  readonly manifestId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-4:5";
  readonly status: "ManifestComplete";
  readonly readiness: "ReadyForPlatform";
  readonly componentCount: 5;
  readonly totalPublicApiCount: 40;
  readonly validationStatus: string;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly registryEntryCount: number;
  readonly businessObjectCategoryCount: number;
  readonly relationshipCategoryCount: number;
  readonly canonicalModelCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestStatisticsDescriptor {
  readonly foundationContractCount: number;
  readonly registryCategoryCount: number;
  readonly registryEntryCount: number;
  readonly businessObjectCategoryCount: number;
  readonly relationshipCategoryCount: number;
  readonly canonicalModelCount: number;
  readonly modelRelationshipDeclarationCount: number;
  readonly validationCategoryCount: number;
  readonly validationRuleCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipOwnsCount: number;
  readonly ownershipDoesNotOwnCount: number;
  readonly extensionPolicyCount: number;
  readonly compatibilityPolicyCount: number;
  readonly dependencyCount: number;
  readonly totalPublicApiCount: 40;
  readonly phasesCompleted: 5;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
