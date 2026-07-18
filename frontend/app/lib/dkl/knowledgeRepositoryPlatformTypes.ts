/**
 * DKL-6:6 — Knowledge Repository Platform Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Platform.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

export type KnowledgeRepositoryPlatformStatus = "PlatformComplete";

export type KnowledgeRepositoryPlatformReadiness =
  | "ReadyForDKL6Certification"
  | "Blocked";

export type KnowledgeRepositoryPlatformSectionName =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

export type KnowledgeRepositoryPlatformSection = Readonly<{
  id: string;
  name: KnowledgeRepositoryPlatformSectionName;
  sourceIdentity: string;
  sourceVersion: string;
  sourceStatus: string;
  order: number;
  owner: "DKL-6";
  included: true;
  stable: true;
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformComponent = Readonly<{
  id: string;
  name: string;
  sourceIdentity: string;
  architecturalRole: string;
  status: "Available";
  owner: "DKL-6";
  stable: true;
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformDependency = Readonly<{
  id: string;
  consumer: string;
  provider: string;
  providerIdentity: string;
  approvedSurface: string;
  dependencyType: "Architectural";
  compatibilityStatus: "Compatible";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformCompatibility = Readonly<{
  id: string;
  name: string;
  target: string;
  description: string;
  status: "Compatible";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformBoundary = Readonly<{
  id: string;
  name: string;
  description: string;
  status: "Preserved";
  owner: "DKL-6";
  enforcementType: "Architectural";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformGuarantee = Readonly<{
  id: string;
  name: string;
  description: string;
  evidenceReferences: readonly string[];
  status: "Guaranteed";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformReadinessGate = Readonly<{
  id: string;
  name: string;
  evidenceReferences: readonly string[];
  status: "Pass";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformPublicApiPhase = Readonly<{
  id: string;
  phase: string;
  sourceIdentity: string;
  publicApiCount: number;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryPlatformResult = Readonly<{
  status: "PlatformComplete";
  completeness: "Complete";
  validationStatus: "Pass";
  manifestStatus: "Manifested";
  blockingIssueCount: 0;
  readiness: "ReadyForDKL6Certification";
}>;

export interface KnowledgeRepositoryPlatformIdentityDescriptor {
  readonly platformId: "DKL-6:6/KnowledgeRepositoryPlatform";
  readonly platformName: "Knowledge Repository Platform";
  readonly platformVersion: string;
  readonly platformNamespace: "nexora.dkl.repository.platform";
  readonly phase: "DKL-6:6";
  readonly owner: "DKL-6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForDKL6Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryPlatformSummaryDescriptor {
  readonly platformId: "DKL-6:6/KnowledgeRepositoryPlatform";
  readonly version: string;
  readonly name: "Knowledge Repository Platform";
  readonly namespace: "nexora.dkl.repository.platform";
  readonly status: "PlatformComplete";
  readonly foundationIdentity: string;
  readonly registryIdentity: string;
  readonly modelIdentity: string;
  readonly validationIdentity: string;
  readonly manifestIdentity: string;
  readonly platformSectionCount: number;
  readonly platformComponentCount: number;
  readonly dependencyCount: number;
  readonly compatibilityCount: number;
  readonly boundaryCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly readinessGateCount: number;
  readonly passedReadinessGateCount: number;
  readonly failedReadinessGateCount: number;
  readonly validationRuleCount: number;
  readonly validationPassedRuleCount: number;
  readonly manifestCompleteness: "Complete";
  readonly blockingIssueCount: number;
  readonly completeness: "Complete";
  readonly readiness: "ReadyForDKL6Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
