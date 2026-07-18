/**
 * DKL-3:4 — Data Understanding Validation Rules.
 *
 * Immutable catalog of deterministic validation rules. Registry of rules only —
 * execution lives in the validation runner.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

import type { DataUnderstandingValidationRule } from "./dataUnderstandingValidationTypes.ts";

const rule = (
  ruleId: string,
  category: DataUnderstandingValidationRule["category"],
  name: string,
  description: string,
  blocking: boolean,
): DataUnderstandingValidationRule =>
  Object.freeze({ ruleId, category, name, description, blocking });

/** Canonical immutable validation rule catalog. */
export const DataUnderstandingValidationRules: readonly DataUnderstandingValidationRule[] =
  Object.freeze([
    rule("ModelPresent", "Model", "ModelPresent", "A Data Understanding model view must be supplied.", true),
    rule("FoundationIdentityAligned", "Foundation", "FoundationIdentityAligned", "Model foundation reference must align with DKL-3:1.", true),
    rule("FoundationReadyForRegistry", "Foundation", "FoundationReadyForRegistry", "Foundation readiness must be ReadyForRegistry.", true),
    rule("RegistryIdentityAligned", "Registry", "RegistryIdentityAligned", "Model registry reference must align with DKL-3:2.", true),
    rule("RegistryReadyForModel", "Registry", "RegistryReadyForModel", "Registry readiness must be ReadyForModel.", true),
    rule("ModelIdentityStable", "Model", "ModelIdentityStable", "Model identity must be DKL-3:3 ModelComplete / ReadyForValidation.", true),
    rule("ModelKindsComplete", "Model", "ModelKindsComplete", "All required model kinds must be present.", true),
    rule("SubjectKindsRegistered", "Subject", "SubjectKindsRegistered", "Subject kinds must match foundation and registry.", true),
    rule("CandidateTypesRegistered", "Candidate", "CandidateTypesRegistered", "Candidate types must match foundation and registry.", true),
    rule("CandidateStatusesRegistered", "Candidate", "CandidateStatusesRegistered", "Candidate statuses must match foundation and registry.", true),
    rule("CandidatesNotBusinessObjects", "Candidate", "CandidatesNotBusinessObjects", "Candidates must forbid Business Object contents.", true),
    rule("EvidenceCategoriesRegistered", "Evidence", "EvidenceCategoriesRegistered", "Evidence categories must match foundation and registry.", true),
    rule("EvidenceLimitationsRequired", "Evidence", "EvidenceLimitationsRequired", "Evidence limitations must be required.", true),
    rule("RelationshipKindsRegistered", "Relationship", "RelationshipKindsRegistered", "Relationship kinds must be the six provisional kinds.", true),
    rule("ClarificationStatusesRegistered", "Clarification", "ClarificationStatusesRegistered", "Clarification statuses must match foundation.", true),
    rule("ConfidenceLevelsRegistered", "Confidence", "ConfidenceLevelsRegistered", "Confidence levels must match foundation; floats forbidden.", true),
    rule("AmbiguityLevelsRegistered", "Ambiguity", "AmbiguityLevelsRegistered", "Ambiguity levels must match foundation.", true),
    rule("SnapshotIntegrity", "Snapshot", "SnapshotIntegrity", "Snapshot sections and forbidden outputs must be intact.", true),
    rule("ResultIntegrity", "Result", "ResultIntegrity", "Result readiness and statuses must be ReadyForValidation-aligned.", true),
    rule("PipelineReferenceValid", "Reference", "PipelineReferenceValid", "Pipeline reference must target DKL-3 with preview-only required.", true),
    rule("ValidationSummaryReferencePending", "Reference", "ValidationSummaryReferencePending", "Validation summary reference must defer Business Objects to later phases.", true),
    rule("OwnershipCompliant", "Ownership", "OwnershipCompliant", "Ownership owns/doesNotOwn must be present and non-overlapping.", true),
    rule("BoundaryCompliant", "Boundary", "BoundaryCompliant", "Boundaries must forbid BO, KG, persistence, AI, Engine, and UI.", true),
    rule("LifecycleStatesValid", "Lifecycle", "LifecycleStatesValid", "Lifecycle states must match foundation lifecycle.", true),
    rule("ProcessingPolicyValid", "ProcessingPolicy", "ProcessingPolicyValid", "Processing policies must preserve preview-only and forbid BO/AI/Engine/persistence.", true),
    rule("DependencyCompliant", "Dependency", "DependencyCompliant", "DKL-3:1, DKL-3:2, and Pipeline dependencies must report ready.", true),
    rule("PublicApiConsistent", "PublicApi", "PublicApiConsistent", "Model public API names must be exactly eight immutable exports.", true),
    rule("IdentityUniqueness", "Identity", "IdentityUniqueness", "Model, foundation, and registry identities must be distinct and stable.", true),
  ]);
