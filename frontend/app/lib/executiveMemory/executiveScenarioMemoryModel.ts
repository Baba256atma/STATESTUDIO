/**
 * APP-4:6 — Executive Scenario Memory contracts and builders.
 */

import {
  EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_SCENARIO_MEMORY_SCHEMA_VERSION,
} from "./executiveScenarioMemoryConstants.ts";
import type {
  CreateExecutiveScenarioMemoryInput,
  ExecutiveScenarioBusinessContext,
  ExecutiveScenarioDecisionPath,
  ExecutiveScenarioDecisionPathStep,
  ExecutiveScenarioMemory,
  ExecutiveScenarioMemoryAssumption,
  ExecutiveScenarioMemoryEvidence,
  ExecutiveScenarioMemoryMetadata,
  ExecutiveScenarioMemoryOutcome,
  ExecutiveScenarioMemoryReference,
  ExecutiveScenarioMemoryVersion,
  UpdateExecutiveScenarioMemoryInput,
} from "./executiveScenarioMemoryTypes.ts";

export function createExecutiveScenarioMemoryReference(
  input: Omit<ExecutiveScenarioMemoryReference, "readOnly">
): ExecutiveScenarioMemoryReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioMemoryAssumption(
  input: Omit<ExecutiveScenarioMemoryAssumption, "readOnly">
): ExecutiveScenarioMemoryAssumption {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioMemoryOutcome(
  input: Omit<ExecutiveScenarioMemoryOutcome, "readOnly">
): ExecutiveScenarioMemoryOutcome {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioMemoryEvidence(
  input: Omit<ExecutiveScenarioMemoryEvidence, "readOnly">
): ExecutiveScenarioMemoryEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioDecisionPathStep(
  input: Omit<ExecutiveScenarioDecisionPathStep, "readOnly">
): ExecutiveScenarioDecisionPathStep {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioDecisionPath(
  input: Omit<ExecutiveScenarioDecisionPath, "readOnly"> & {
    steps?: readonly ExecutiveScenarioDecisionPathStep[];
  }
): ExecutiveScenarioDecisionPath {
  return Object.freeze({
    pathId: input.pathId,
    title: input.title,
    steps: Object.freeze([...(input.steps ?? [])]),
    readOnly: true as const,
  });
}

export function createExecutiveScenarioBusinessContext(
  input: Omit<ExecutiveScenarioBusinessContext, "readOnly">
): ExecutiveScenarioBusinessContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioMemoryMetadata(
  input: Omit<ExecutiveScenarioMemoryMetadata, "readOnly"> & {
    customMetadata?: Readonly<Record<string, string>>;
  }
): ExecutiveScenarioMemoryMetadata {
  return Object.freeze({
    title: input.title,
    summary: input.summary,
    owner: input.owner,
    sourceModule: input.sourceModule,
    customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
    readOnly: true as const,
  });
}

export function createExecutiveScenarioMemoryVersion(
  input: Omit<ExecutiveScenarioMemoryVersion, "readOnly">
): ExecutiveScenarioMemoryVersion {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioMemory(
  input: CreateExecutiveScenarioMemoryInput
): ExecutiveScenarioMemory {
  return Object.freeze({
    memoryId: input.memoryId,
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    goalId: input.goalId ?? null,
    intentId: input.intentId ?? null,
    decisionId: input.decisionId ?? null,
    riskIds: Object.freeze([...(input.riskIds ?? [])]),
    kpiIds: Object.freeze([...(input.kpiIds ?? [])]),
    objectIds: Object.freeze([...(input.objectIds ?? [])]),
    relationshipIds: Object.freeze([...(input.relationshipIds ?? [])]),
    timelineIds: Object.freeze([...(input.timelineIds ?? [])]),
    executiveMemoryIds: Object.freeze([...(input.executiveMemoryIds ?? [])]),
    assumptions: Object.freeze([...(input.assumptions ?? [])]),
    constraints: Object.freeze([...(input.constraints ?? [])]),
    outcomes: Object.freeze([...(input.outcomes ?? [])]),
    lessonsLearned: Object.freeze([...(input.lessonsLearned ?? [])]),
    evidence: Object.freeze([...(input.evidence ?? [])]),
    decisionPath: input.decisionPath ?? null,
    businessContext: input.businessContext ?? null,
    references: Object.freeze([...(input.references ?? [])]),
    metadata: input.metadata,
    lifecycle: "active",
    version: input.version,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    archivedAt: null,
    schemaVersion: input.schemaVersion ?? EXECUTIVE_SCENARIO_MEMORY_SCHEMA_VERSION,
    contractVersion: input.contractVersion ?? EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function bumpSemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) return "1.0.1";
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function applyExecutiveScenarioMemoryUpdate(
  existing: ExecutiveScenarioMemory,
  updates: UpdateExecutiveScenarioMemoryInput,
  updatedAt: string
): ExecutiveScenarioMemory {
  const nextMetadata = updates.metadata
    ? createExecutiveScenarioMemoryMetadata({
        title: updates.metadata.title ?? existing.metadata.title,
        summary: updates.metadata.summary ?? existing.metadata.summary,
        owner: existing.metadata.owner,
        sourceModule: existing.metadata.sourceModule,
        customMetadata: updates.metadata.customMetadata ?? existing.metadata.customMetadata,
      })
    : existing.metadata;

  return Object.freeze({
    ...existing,
    metadata: nextMetadata,
    assumptions: updates.assumptions ?? existing.assumptions,
    outcomes: updates.outcomes ?? existing.outcomes,
    evidence: updates.evidence ?? existing.evidence,
    lessonsLearned: updates.lessonsLearned ?? existing.lessonsLearned,
    constraints: updates.constraints ?? existing.constraints,
    executiveMemoryIds: updates.executiveMemoryIds ?? existing.executiveMemoryIds,
    version: createExecutiveScenarioMemoryVersion({
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

export const ExecutiveScenarioMemoryBuilder = Object.freeze({
  createExecutiveScenarioMemory,
  createExecutiveScenarioMemoryMetadata,
  createExecutiveScenarioMemoryVersion,
  createExecutiveScenarioMemoryReference,
  createExecutiveScenarioMemoryAssumption,
  createExecutiveScenarioMemoryOutcome,
  createExecutiveScenarioMemoryEvidence,
  createExecutiveScenarioDecisionPath,
  createExecutiveScenarioBusinessContext,
  applyExecutiveScenarioMemoryUpdate,
});
