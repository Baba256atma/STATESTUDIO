/**
 * DKL-2:8 — Data Source & Knowledge Freeze Types.
 *
 * Readonly, metadata-only contracts for the DKL-2:8 freeze (release-lock) layer.
 * This module declares the shapes for the freeze identity, frozen-component
 * registry, architectural baseline, compatibility policies, extension locks,
 * freeze guarantees, manifest, summary, and the aggregate freeze platform root.
 *
 * Responsibility: shared immutable freeze vocabulary.
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: pure type/constant module; no phase imports.
 * Architectural purpose: the release-lock contract surface. No runtime behavior,
 * no side effects, no I/O.
 */

export const FREEZE_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const FREEZE_VERSION = "1.0.0";

export const FREEZE_SOURCE_PHASE = "DKL-2:8";

export const CANONICAL_COMPLETE_PLATFORM_EXPORT = "DataSourceKnowledgeRegistryPlatform";

export type FreezeStatus = "Frozen";

export type FreezeStability = "StableAndFrozen";

export type FreezeReadiness = "ReadyForPublicIndex";

export type OwnershipStatus = "Protected";

export type ComponentCompatibilityStatus = "Compatible";

export type CertificationStatus = "Certified";

export type FreezeComponentKind =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "PublicSurfaceStrategy";

export type CompatibilityChangeType =
  | "AdditiveExtension"
  | "IdentifierChange"
  | "PublicApiRemoval"
  | "OwnershipTransfer"
  | "DependencyExpansion"
  | "NamingStrategy";

export type CompatibilityPolicyStatus = "Compatible" | "Restricted" | "Forbidden" | "Locked";

export type LockStatus = "Locked";

export type GuaranteeStatus = "Guaranteed";

export type BaselineStatus = "BaselineLocked";

export interface FreezeIdentityDescriptor {
  readonly freezeId: string;
  readonly freezeVersion: string;
  readonly freezeName: string;
  readonly freezeNamespace: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly certificationStatus: CertificationStatus;
  readonly freezeStatus: FreezeStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeComponentEntry {
  readonly freezeEntryId: string;
  readonly componentName: string;
  readonly componentKind: FreezeComponentKind;
  readonly sourcePhase: string;
  readonly publicModule: string;
  readonly certificationGateIds: readonly string[];
  readonly frozenApiCount: number;
  readonly freezeStatus: FreezeStatus;
  readonly stability: FreezeStability;
  readonly ownershipStatus: OwnershipStatus;
  readonly compatibilityStatus: ComponentCompatibilityStatus;
  readonly readiness: FreezeReadiness;
}

export interface FreezeRegistryContainer {
  readonly kind: "FreezeRegistry";
  readonly components: readonly FreezeComponentEntry[];
  readonly frozenRuntimeApiCount: number;
  readonly getComponentById: (freezeEntryId: string) => FreezeComponentEntry | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FoundationBaselineDescriptor {
  readonly dataSourceCategoryCount: number;
  readonly knowledgeCategoryCount: number;
  readonly connectorCategoryCount: number;
  readonly contentCategoryCount: number;
  readonly metadataCategoryCount: number;
  readonly sourceGroupCount: number;
}

export interface RegistryBaselineDescriptor {
  readonly dataSourceEntryCount: number;
  readonly knowledgeEntryCount: number;
  readonly connectorEntryCount: number;
  readonly contentEntryCount: number;
  readonly sourceGroupEntryCount: number;
  readonly compatibilityRelationshipCount: number;
  readonly totalRegistryEntryCount: number;
}

export interface ModelBaselineDescriptor {
  readonly identityModelCount: number;
  readonly dataSourceModelCount: number;
  readonly knowledgeModelCount: number;
  readonly connectorModelCount: number;
  readonly compatibilityModelCount: number;
  readonly totalModelCount: number;
}

export interface ValidationBaselineDescriptor {
  readonly validationCategoryCount: number;
  readonly validationRuleCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly validationWarningCount: number;
  readonly validationStatus: string;
}

export interface ManifestBaselineDescriptor {
  readonly manifestSectionCount: number;
  readonly guaranteeCount: number;
  readonly manifestStatus: string;
}

export interface PlatformBaselineDescriptor {
  readonly platformPhaseCount: number;
  readonly platformMetadataArtifactCount: number;
  readonly physicalPhaseArtifactCountThroughDKL26: number;
  readonly platformStatus: string;
}

export interface CertificationBaselineDescriptor {
  readonly certificationComponentCount: number;
  readonly certificationGateCount: number;
  readonly certificationEvidenceCount: number;
  readonly certificationCompatibilityCount: number;
  readonly certificationStatus: string;
}

export interface FreezeBaselineDescriptor {
  readonly baselineStatus: BaselineStatus;
  readonly foundation: FoundationBaselineDescriptor;
  readonly registry: RegistryBaselineDescriptor;
  readonly model: ModelBaselineDescriptor;
  readonly validation: ValidationBaselineDescriptor;
  readonly manifest: ManifestBaselineDescriptor;
  readonly platform: PlatformBaselineDescriptor;
  readonly certification: CertificationBaselineDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CompatibilityPolicyDeclaration {
  readonly compatibilityId: string;
  readonly name: string;
  readonly description: string;
  readonly changeType: CompatibilityChangeType;
  readonly status: CompatibilityPolicyStatus;
  readonly conditions: readonly string[];
  readonly protectedSurfaces: readonly string[];
  readonly sourcePhase: string;
}

export interface FreezeCompatibilityContainer {
  readonly kind: "FreezeCompatibility";
  readonly declarations: readonly CompatibilityPolicyDeclaration[];
  readonly getCompatibilityById: (
    compatibilityId: string,
  ) => CompatibilityPolicyDeclaration | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExtensionLock {
  readonly lockId: string;
  readonly name: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly policy: string;
  readonly status: LockStatus;
  readonly exceptions: readonly string[];
}

export interface FreezeLocksContainer {
  readonly kind: "FreezeLocks";
  readonly locks: readonly ExtensionLock[];
  readonly getLockById: (lockId: string) => ExtensionLock | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeGuarantee {
  readonly guaranteeId: string;
  readonly name: string;
  readonly description: string;
  readonly evidenceIds: readonly string[];
  readonly status: GuaranteeStatus;
}

export interface FreezeGuaranteesContainer {
  readonly kind: "FreezeGuarantees";
  readonly guarantees: readonly FreezeGuarantee[];
  readonly getGuaranteeById: (guaranteeId: string) => FreezeGuarantee | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeManifestDescriptor {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhases: readonly string[];
  readonly dependencies: readonly string[];
  readonly frozenComponentCount: number;
  readonly frozenRuntimeApiCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly extensionLockCount: number;
  readonly guaranteeCount: number;
  readonly baselineStatus: BaselineStatus;
  readonly certificationStatus: CertificationStatus;
  readonly freezeStatus: FreezeStatus;
  readonly stability: FreezeStability;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly readiness: FreezeReadiness;
  readonly nextPhase: "DKL-2:9";
}

export interface FreezeSummaryDescriptor {
  readonly frozenComponentCount: number;
  readonly frozenRuntimeApiCount: number;
  readonly registryEntryCount: number;
  readonly modelCount: number;
  readonly validationPassCount: number;
  readonly certificationGateCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly extensionLockCount: number;
  readonly guaranteeCount: number;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly status: FreezeStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly nextPhase: "DKL-2:9";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface FreezePlatformDescriptor {
  readonly identity: FreezeIdentityDescriptor;
  readonly registry: FreezeRegistryContainer;
  readonly baseline: FreezeBaselineDescriptor;
  readonly compatibility: FreezeCompatibilityContainer;
  readonly locks: FreezeLocksContainer;
  readonly guarantees: FreezeGuaranteesContainer;
  readonly manifest: FreezeManifestDescriptor;
  readonly summary: FreezeSummaryDescriptor;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
}
