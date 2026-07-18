/**
 * DKL-6:7 — Knowledge Repository Certification Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Certification.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

export type KnowledgeRepositoryCertificationStatus =
  | "Certified"
  | "CertificationFailed";

export type KnowledgeRepositoryCertificationReadiness =
  | "ReadyForDKL6Freeze"
  | "Blocked";

export type KnowledgeRepositoryCertificationGateStatus = "Pass" | "Fail";

export type KnowledgeRepositoryCertificationScopeName =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform"
  | "certification";

export type KnowledgeRepositoryCertificationScope = Readonly<{
  id: string;
  name: KnowledgeRepositoryCertificationScopeName;
  sourceIdentity: string;
  sourceVersion: string;
  sourceStatus: string;
  order: number;
  included: true;
  stable: true;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationCriterion = Readonly<{
  id: string;
  name: string;
  category: string;
  description: string;
  subjectReference: string;
  expected: string;
  actual: string;
  status: "Pass" | "Fail";
  severity: "Critical" | "Required";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationEvidence = Readonly<{
  id: string;
  name: string;
  sourceIdentity: string;
  sourceReference: string;
  evidenceType: string;
  accepted: true;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationCompatibility = Readonly<{
  id: string;
  name: string;
  target: string;
  evidenceReferences: readonly string[];
  status: "CertifiedCompatible";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationRegression = Readonly<{
  id: string;
  name: string;
  protectedSubject: string;
  expectedInvariant: string;
  evidenceReferences: readonly string[];
  status: "Protected";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationBoundary = Readonly<{
  id: string;
  name: string;
  description: string;
  status: "CertifiedPreserved";
  owner: "DKL-6";
  enforcementType: "Architectural";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationGuarantee = Readonly<{
  id: string;
  name: string;
  description: string;
  evidenceReferences: readonly string[];
  status: "Guaranteed";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationGate = Readonly<{
  id: string;
  name: string;
  criterionReferences: readonly string[];
  evidenceReferences: readonly string[];
  passedCriterionCount: number;
  failedCriterionCount: number;
  status: KnowledgeRepositoryCertificationGateStatus;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationPublicApiPhase = Readonly<{
  id: string;
  phase: string;
  sourceIdentity: string;
  publicApiCount: number;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryCertificationResult = Readonly<{
  status: "Certified";
  totalCriteria: number;
  passedCriteria: number;
  failedCriteria: number;
  totalGates: number;
  passedGates: number;
  failedGates: number;
  blockingIssueCount: 0;
  readiness: "ReadyForDKL6Freeze";
}>;

export interface KnowledgeRepositoryCertificationIdentityDescriptor {
  readonly certificationId: "DKL-6:7/KnowledgeRepositoryCertification";
  readonly certificationName: "Knowledge Repository Certification";
  readonly certificationVersion: string;
  readonly certificationNamespace: "nexora.dkl.repository.certification";
  readonly phase: "DKL-6:7";
  readonly owner: "DKL-6";
  readonly status: "Certified";
  readonly readiness: "ReadyForDKL6Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryCertificationSummaryDescriptor {
  readonly certificationId: "DKL-6:7/KnowledgeRepositoryCertification";
  readonly version: string;
  readonly name: "Knowledge Repository Certification";
  readonly namespace: "nexora.dkl.repository.certification";
  readonly status: "Certified";
  readonly platformIdentity: string;
  readonly platformStatus: string;
  readonly scopeCount: number;
  readonly criteriaCount: number;
  readonly passedCriteriaCount: number;
  readonly failedCriteriaCount: number;
  readonly criticalCriteriaCount: number;
  readonly requiredCriteriaCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCertificationCount: number;
  readonly regressionProtectionCount: number;
  readonly boundaryCertificationCount: number;
  readonly guaranteeCount: number;
  readonly certificationGateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly publicApiCount: number;
  readonly blockingIssueCount: number;
  readonly platformCompleteness: "Complete";
  readonly certificationResult: "Certified";
  readonly readiness: "ReadyForDKL6Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
