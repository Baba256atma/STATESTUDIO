/**
 * DKL-2:5 — Data Source & Knowledge Manifest Types.
 *
 * Readonly, metadata-only manifest contracts for the DKL-2:5 manifest platform.
 * This module declares the shapes for the authoritative, release-oriented
 * architectural inventory of DKL-2:1 through DKL-2:4.
 *
 * Responsibility: shared immutable manifest shapes and canonical constants.
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: pure type/constant module; no phase imports.
 * Architectural purpose: the manifest vocabulary. No runtime behavior, no side
 * effects, no I/O.
 */

export type ManifestStatus = "ManifestComplete" | "ManifestIncomplete";

export type PhaseStatus = "Complete" | "Incomplete";

export type PhaseKind = "Foundation" | "Registry" | "Model" | "Validation";

export type GuaranteeStatus = "Guaranteed";

export type ManifestReadiness = "ReadyForPlatform";

export type ManifestSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "phaseInventory"
  | "dependencyMap"
  | "compatibility"
  | "guarantees"
  | "releaseReadiness";

export const CANONICAL_MANIFEST_SECTIONS: readonly ManifestSection[] = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "phaseInventory",
  "dependencyMap",
  "compatibility",
  "guarantees",
  "releaseReadiness",
]);

export const MANIFEST_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const MANIFEST_VERSION = "1.0.0";

export const MANIFEST_SOURCE_PHASE = "DKL-2:5";

export interface ManifestIdentityDescriptor {
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly manifestName: string;
  readonly manifestNamespace: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly status: ManifestStatus;
  readonly readiness: ManifestReadiness;
  readonly sections: readonly ManifestSection[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PhaseManifestEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly phaseKind: PhaseKind;
  readonly owner: string;
  readonly status: PhaseStatus;
  readonly readiness: string;
  readonly publicModule: string;
  readonly runtimeExportCount: number;
  readonly artifactCount: number;
  readonly dependencies: readonly string[];
  readonly capabilities: readonly string[];
  readonly boundaries: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PhaseManifestContainer {
  readonly kind: "PhaseManifest";
  readonly entries: readonly PhaseManifestEntry[];
  readonly getByPhaseId: (phaseId: string) => PhaseManifestEntry | undefined;
}

export interface InventoryManifestDescriptor {
  readonly foundation: Readonly<{
    dataSourceCategories: number;
    knowledgeCategories: number;
    connectorCategories: number;
    contentCategories: number;
    metadataCategories: number;
    sourceGroups: number;
  }>;
  readonly registry: Readonly<{
    dataSourceEntries: number;
    knowledgeEntries: number;
    connectorEntries: number;
    contentEntries: number;
    sourceGroupEntries: number;
    compatibilityRelationships: number;
  }>;
  readonly model: Readonly<{
    identityModels: number;
    dataSourceModels: number;
    knowledgeModels: number;
    connectorModels: number;
    compatibilityModels: number;
    totalModels: number;
  }>;
  readonly validation: Readonly<{
    categories: number;
    rules: number;
    pass: number;
    fail: number;
    warning: number;
    notApplicable: number;
    status: string;
  }>;
  readonly publicSurface: Readonly<{
    foundationExports: number;
    registryExports: number;
    modelExports: number;
    validationExports: number;
    totalPriorExports: number;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DependencyManifestEntry {
  readonly phaseId: string;
  readonly directDependencies: readonly string[];
  readonly transitiveDependencies: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DependencyManifestDescriptor {
  readonly entries: readonly DependencyManifestEntry[];
  readonly forbiddenDependencies: readonly string[];
  readonly forwardOnly: true;
  readonly cycleFree: true;
  readonly publicApiOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CompatibilityManifestDescriptor {
  readonly totalRelationships: number;
  readonly sourceCategoriesRepresented: number;
  readonly knowledgeCategoriesRepresented: number;
  readonly compatibilityTypesRepresented: readonly string[];
  readonly confidenceClassificationsRepresented: readonly string[];
  readonly semantics: string;
  readonly nonGuarantee: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GuaranteeManifestEntry {
  readonly guaranteeId: string;
  readonly name: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly evidence: readonly string[];
  readonly status: GuaranteeStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GuaranteeManifestContainer {
  readonly kind: "GuaranteeManifest";
  readonly guarantees: readonly GuaranteeManifestEntry[];
  readonly getByGuaranteeId: (guaranteeId: string) => GuaranteeManifestEntry | undefined;
}

export interface ReleaseReadinessDescriptor {
  readonly foundationStatus: "Complete";
  readonly registryStatus: "Complete";
  readonly modelStatus: "Complete";
  readonly validationStatus: "ValidationCertified";
  readonly manifestStatus: "ManifestComplete";
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly certificationState: "ReadyForPlatform";
  readonly readiness: "ReadyForPlatform";
  readonly nextPhase: "DKL-2:6";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ManifestSummaryDescriptor {
  readonly phaseCount: number;
  readonly sectionCount: number;
  readonly artifactCount: number;
  readonly priorRuntimeExportCount: number;
  readonly registryEntryCount: number;
  readonly modelCount: number;
  readonly validationRuleCount: number;
  readonly validationPassCount: number;
  readonly guaranteeCount: number;
  readonly status: ManifestStatus;
  readonly readiness: ManifestReadiness;
  readonly nextPhase: "DKL-2:6";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}
