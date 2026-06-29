/**
 * APP-4:7 — Executive Decision Memory contracts and builders.
 */

import {
  EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_DECISION_MEMORY_SCHEMA_VERSION,
} from "./executiveDecisionMemoryConstants.ts";
import type {
  CreateExecutiveDecisionMemoryInput,
  ExecutiveDecisionAlternative,
  ExecutiveDecisionConfidence,
  ExecutiveDecisionConstraint,
  ExecutiveDecisionEvidence,
  ExecutiveDecisionMemory,
  ExecutiveDecisionMemoryMetadata,
  ExecutiveDecisionMemoryReference,
  ExecutiveDecisionMemoryVersion,
  ExecutiveDecisionOutcome,
  ExecutiveDecisionRationale,
  ExecutiveDecisionReview,
  UpdateExecutiveDecisionMemoryInput,
} from "./executiveDecisionMemoryTypes.ts";

export function createExecutiveDecisionMemoryReference(
  input: Omit<ExecutiveDecisionMemoryReference, "readOnly">
): ExecutiveDecisionMemoryReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionEvidence(
  input: Omit<ExecutiveDecisionEvidence, "readOnly">
): ExecutiveDecisionEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionOutcome(
  input: Omit<ExecutiveDecisionOutcome, "readOnly">
): ExecutiveDecisionOutcome {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionRationale(
  input: Omit<ExecutiveDecisionRationale, "readOnly">
): ExecutiveDecisionRationale {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionConstraint(
  input: Omit<ExecutiveDecisionConstraint, "readOnly">
): ExecutiveDecisionConstraint {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionAlternative(
  input: Omit<ExecutiveDecisionAlternative, "readOnly">
): ExecutiveDecisionAlternative {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionConfidence(
  input: Omit<ExecutiveDecisionConfidence, "readOnly">
): ExecutiveDecisionConfidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionReview(
  input: Omit<ExecutiveDecisionReview, "readOnly">
): ExecutiveDecisionReview {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionMemoryMetadata(
  input: Omit<ExecutiveDecisionMemoryMetadata, "readOnly"> & {
    customMetadata?: Readonly<Record<string, string>>;
  }
): ExecutiveDecisionMemoryMetadata {
  return Object.freeze({
    title: input.title,
    summary: input.summary,
    owner: input.owner,
    sourceModule: input.sourceModule,
    customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
    readOnly: true as const,
  });
}

export function createExecutiveDecisionMemoryVersion(
  input: Omit<ExecutiveDecisionMemoryVersion, "readOnly">
): ExecutiveDecisionMemoryVersion {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveDecisionMemory(
  input: CreateExecutiveDecisionMemoryInput
): ExecutiveDecisionMemory {
  return Object.freeze({
    memoryId: input.memoryId,
    decisionId: input.decisionId,
    workspaceId: input.workspaceId,
    goalId: input.goalId ?? null,
    intentId: input.intentId ?? null,
    scenarioId: input.scenarioId ?? null,
    executiveMemoryIds: Object.freeze([...(input.executiveMemoryIds ?? [])]),
    riskIds: Object.freeze([...(input.riskIds ?? [])]),
    kpiIds: Object.freeze([...(input.kpiIds ?? [])]),
    objectIds: Object.freeze([...(input.objectIds ?? [])]),
    relationshipIds: Object.freeze([...(input.relationshipIds ?? [])]),
    timelineIds: Object.freeze([...(input.timelineIds ?? [])]),
    assumptions: Object.freeze([...(input.assumptions ?? [])]),
    evidence: Object.freeze([...(input.evidence ?? [])]),
    constraints: Object.freeze([...(input.constraints ?? [])]),
    alternatives: Object.freeze([...(input.alternatives ?? [])]),
    rationale: input.rationale,
    confidence: input.confidence,
    expectedOutcomes: Object.freeze([...(input.expectedOutcomes ?? [])]),
    actualOutcomes: Object.freeze([...(input.actualOutcomes ?? [])]),
    lessonsLearned: Object.freeze([...(input.lessonsLearned ?? [])]),
    reviews: Object.freeze([...(input.reviews ?? [])]),
    references: Object.freeze([...(input.references ?? [])]),
    metadata: input.metadata,
    lifecycle: "active",
    version: input.version,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    archivedAt: null,
    schemaVersion: input.schemaVersion ?? EXECUTIVE_DECISION_MEMORY_SCHEMA_VERSION,
    contractVersion: input.contractVersion ?? EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function bumpSemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) return "1.0.1";
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function applyExecutiveDecisionMemoryUpdate(
  existing: ExecutiveDecisionMemory,
  updates: UpdateExecutiveDecisionMemoryInput,
  updatedAt: string
): ExecutiveDecisionMemory {
  const nextMetadata = updates.metadata
    ? createExecutiveDecisionMemoryMetadata({
        title: updates.metadata.title ?? existing.metadata.title,
        summary: updates.metadata.summary ?? existing.metadata.summary,
        owner: existing.metadata.owner,
        sourceModule: existing.metadata.sourceModule,
        customMetadata: updates.metadata.customMetadata ?? existing.metadata.customMetadata,
      })
    : existing.metadata;

  const nextRationale = updates.rationale
    ? createExecutiveDecisionRationale({
        rationaleId: existing.rationale.rationaleId,
        summary: updates.rationale.summary ?? existing.rationale.summary,
        explanation: updates.rationale.explanation ?? existing.rationale.explanation,
        decidedBy: existing.rationale.decidedBy,
        decidedAt: existing.rationale.decidedAt,
      })
    : existing.rationale;

  return Object.freeze({
    ...existing,
    metadata: nextMetadata,
    rationale: nextRationale,
    confidence: updates.confidence ?? existing.confidence,
    expectedOutcomes: updates.expectedOutcomes ?? existing.expectedOutcomes,
    actualOutcomes: updates.actualOutcomes ?? existing.actualOutcomes,
    lessonsLearned: updates.lessonsLearned ?? existing.lessonsLearned,
    reviews: updates.reviews ?? existing.reviews,
    version: createExecutiveDecisionMemoryVersion({
      versionId: `${existing.version.versionId}-rev-${updatedAt}`,
      semanticVersion: bumpSemanticVersion(existing.version.semanticVersion),
      schemaVersion: existing.version.schemaVersion,
      contractVersion: existing.version.contractVersion,
      createdAt: updatedAt,
    }),
    updatedAt,
    readOnly: true as const,
  });
}

export const ExecutiveDecisionMemoryBuilder = Object.freeze({
  createExecutiveDecisionMemory,
  createExecutiveDecisionMemoryMetadata,
  createExecutiveDecisionMemoryVersion,
  createExecutiveDecisionMemoryReference,
  createExecutiveDecisionEvidence,
  createExecutiveDecisionOutcome,
  createExecutiveDecisionRationale,
  createExecutiveDecisionConstraint,
  createExecutiveDecisionAlternative,
  createExecutiveDecisionConfidence,
  createExecutiveDecisionReview,
  applyExecutiveDecisionMemoryUpdate,
});
