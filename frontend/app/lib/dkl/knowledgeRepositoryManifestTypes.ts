/**
 * DKL-6:5 — Knowledge Repository Manifest Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Manifest.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

export type KnowledgeRepositoryManifestStatus = "Manifested";

export type KnowledgeRepositoryManifestReadiness =
  | "ReadyForDKL6Platform"
  | "Blocked";

export type KnowledgeRepositoryManifestSectionName =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest";

export type KnowledgeRepositoryManifestSection = Readonly<{
  id: string;
  name: KnowledgeRepositoryManifestSectionName;
  sourceIdentity: string;
  sourceVersion: string;
  sourceStatus: string;
  order: number;
  owner: "DKL-6";
  included: true;
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestInventoryEntry = Readonly<{
  id: string;
  category: string;
  sourceReference: string;
  count: number;
  status: "Complete";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestComponentEntry = Readonly<{
  id: string;
  componentName: string;
  sourceIdentity: string;
  version: string;
  namespace: string;
  status: string;
  architecturalRole: string;
  publicApiCount: number;
  owner: "DKL-6";
  runtimeBehavior: "None";
  completeness: "Complete";
}>;

export type KnowledgeRepositoryManifestPublicApiPhase = Readonly<{
  id: string;
  phase: string;
  sourceIdentity: string;
  publicApiCount: number;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestDependency = Readonly<{
  id: string;
  consumer: string;
  provider: string;
  providerIdentity: string;
  dependencyType: "Architectural";
  approvedSurface: string;
  status: "Compatible";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestOwnershipEntry = Readonly<{
  id: string;
  responsibility: string;
  ownership: "Owned" | "NotOwned";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestBoundary = Readonly<{
  id: string;
  name: string;
  description: string;
  status: "Preserved";
  owner: "DKL-6";
  enforcementType: "Architectural";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestCompatibility = Readonly<{
  id: string;
  compatibilityTarget: string;
  description: string;
  status: "Compatible";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestGuarantee = Readonly<{
  id: string;
  name: string;
  description: string;
  evidenceReferences: readonly string[];
  status: "Guaranteed";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestCompletenessGate = Readonly<{
  id: string;
  name: string;
  evidenceReferences: readonly string[];
  status: "Pass";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryManifestResult = Readonly<{
  status: "Manifested";
  completeness: "Complete";
  validationStatus: "Pass";
  blockingIssueCount: 0;
  readiness: "ReadyForDKL6Platform";
}>;

export interface KnowledgeRepositoryManifestIdentityDescriptor {
  readonly manifestId: "DKL-6:5/KnowledgeRepositoryManifest";
  readonly manifestName: "Knowledge Repository Manifest";
  readonly manifestVersion: string;
  readonly manifestNamespace: "nexora.dkl.repository.manifest";
  readonly phase: "DKL-6:5";
  readonly owner: "DKL-6";
  readonly status: "Manifested";
  readonly readiness: "ReadyForDKL6Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryManifestSummaryDescriptor {
  readonly manifestId: "DKL-6:5/KnowledgeRepositoryManifest";
  readonly version: string;
  readonly name: "Knowledge Repository Manifest";
  readonly namespace: "nexora.dkl.repository.manifest";
  readonly status: "Manifested";
  readonly foundationIdentity: string;
  readonly registryIdentity: string;
  readonly modelIdentity: string;
  readonly validationIdentity: string;
  readonly architectureSectionCount: number;
  readonly componentCount: number;
  readonly inventoryGroupCount: number;
  readonly publicApiCount: number;
  readonly dependencyCount: number;
  readonly ownedResponsibilityCount: number;
  readonly nonOwnedResponsibilityCount: number;
  readonly boundaryDeclarationCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly guaranteeCount: number;
  readonly completenessGateCount: number;
  readonly passedCompletenessGateCount: number;
  readonly failedCompletenessGateCount: number;
  readonly validationRuleCount: number;
  readonly validationPassedRuleCount: number;
  readonly validationFailedRuleCount: number;
  readonly blockingIssueCount: number;
  readonly completeness: "Complete";
  readonly readiness: "ReadyForDKL6Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
