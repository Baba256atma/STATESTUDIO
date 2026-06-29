/**
 * APP-4:8 — Executive Context Memory contracts and builders.
 */

import {
  EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_CONTEXT_MEMORY_SCHEMA_VERSION,
} from "./executiveContextMemoryConstants.ts";
import type {
  CreateExecutiveContextMemoryInput,
  ExecutiveBusinessContext,
  ExecutiveContextMemory,
  ExecutiveContextMemoryVersion,
  ExecutiveContextMetadata,
  ExecutiveContextReference,
  ExecutiveContextSnapshot,
  ExecutiveExternalContext,
  ExecutiveExternalEvent,
  ExecutiveMarketContext,
  ExecutiveOrganizationContext,
  ExecutivePolicyContext,
  ExecutivePolicyEntry,
  ExecutiveResourceContext,
  ExecutiveResourceEntry,
  ExecutiveStakeholderContext,
  UpdateExecutiveContextMemoryInput,
} from "./executiveContextMemoryTypes.ts";

export function createExecutiveContextReference(
  input: Omit<ExecutiveContextReference, "readOnly">
): ExecutiveContextReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveBusinessContext(
  input: Omit<ExecutiveBusinessContext, "readOnly">
): ExecutiveBusinessContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMarketContext(
  input: Omit<ExecutiveMarketContext, "readOnly">
): ExecutiveMarketContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveOrganizationContext(
  input: Omit<ExecutiveOrganizationContext, "readOnly">
): ExecutiveOrganizationContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveResourceEntry(
  input: Omit<ExecutiveResourceEntry, "readOnly">
): ExecutiveResourceEntry {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveResourceContext(
  input: Omit<ExecutiveResourceContext, "readOnly"> & {
    resources?: readonly ExecutiveResourceEntry[];
  }
): ExecutiveResourceContext {
  return Object.freeze({
    resourceContextId: input.resourceContextId,
    resources: Object.freeze([...(input.resources ?? [])]),
    description: input.description,
    readOnly: true as const,
  });
}

export function createExecutiveStakeholderContext(
  input: Omit<ExecutiveStakeholderContext, "readOnly">
): ExecutiveStakeholderContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutivePolicyEntry(
  input: Omit<ExecutivePolicyEntry, "readOnly">
): ExecutivePolicyEntry {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutivePolicyContext(
  input: Omit<ExecutivePolicyContext, "readOnly"> & {
    policies?: readonly ExecutivePolicyEntry[];
  }
): ExecutivePolicyContext {
  return Object.freeze({
    policyContextId: input.policyContextId,
    policies: Object.freeze([...(input.policies ?? [])]),
    regulatorySummary: input.regulatorySummary,
    readOnly: true as const,
  });
}

export function createExecutiveExternalEvent(
  input: Omit<ExecutiveExternalEvent, "readOnly">
): ExecutiveExternalEvent {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveExternalContext(
  input: Omit<ExecutiveExternalContext, "readOnly"> & {
    events?: readonly ExecutiveExternalEvent[];
  }
): ExecutiveExternalContext {
  return Object.freeze({
    externalContextId: input.externalContextId,
    events: Object.freeze([...(input.events ?? [])]),
    description: input.description,
    readOnly: true as const,
  });
}

export function createExecutiveContextSnapshot(
  input: Omit<ExecutiveContextSnapshot, "readOnly">
): ExecutiveContextSnapshot {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveContextMetadata(
  input: Omit<ExecutiveContextMetadata, "readOnly"> & {
    customMetadata?: Readonly<Record<string, string>>;
  }
): ExecutiveContextMetadata {
  return Object.freeze({
    title: input.title,
    summary: input.summary,
    owner: input.owner,
    sourceModule: input.sourceModule,
    customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
    readOnly: true as const,
  });
}

export function createExecutiveContextMemoryVersion(
  input: Omit<ExecutiveContextMemoryVersion, "readOnly">
): ExecutiveContextMemoryVersion {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveContextMemory(
  input: CreateExecutiveContextMemoryInput
): ExecutiveContextMemory {
  return Object.freeze({
    memoryId: input.memoryId,
    workspaceId: input.workspaceId,
    goalId: input.goalId ?? null,
    intentId: input.intentId ?? null,
    scenarioId: input.scenarioId ?? null,
    decisionId: input.decisionId ?? null,
    executiveMemoryIds: Object.freeze([...(input.executiveMemoryIds ?? [])]),
    businessContext: input.businessContext,
    marketContext: input.marketContext,
    organizationContext: input.organizationContext,
    resourceContext: input.resourceContext,
    stakeholders: Object.freeze([...(input.stakeholders ?? [])]),
    policyContext: input.policyContext,
    externalContext: input.externalContext,
    contextSnapshot: input.contextSnapshot,
    strategicPriorities: Object.freeze([...(input.strategicPriorities ?? [])]),
    assumptions: Object.freeze([...(input.assumptions ?? [])]),
    businessConstraints: Object.freeze([...(input.businessConstraints ?? [])]),
    riskIds: Object.freeze([...(input.riskIds ?? [])]),
    kpiIds: Object.freeze([...(input.kpiIds ?? [])]),
    timelineIds: Object.freeze([...(input.timelineIds ?? [])]),
    references: Object.freeze([...(input.references ?? [])]),
    metadata: input.metadata,
    lifecycle: "active",
    version: input.version,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    archivedAt: null,
    schemaVersion: input.schemaVersion ?? EXECUTIVE_CONTEXT_MEMORY_SCHEMA_VERSION,
    contractVersion: input.contractVersion ?? EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function bumpSemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) return "1.0.1";
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function applyExecutiveContextMemoryUpdate(
  existing: ExecutiveContextMemory,
  updates: UpdateExecutiveContextMemoryInput,
  updatedAt: string
): ExecutiveContextMemory {
  const nextMetadata = updates.metadata
    ? createExecutiveContextMetadata({
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
    marketContext: updates.marketContext ?? existing.marketContext,
    organizationContext: updates.organizationContext ?? existing.organizationContext,
    strategicPriorities: updates.strategicPriorities ?? existing.strategicPriorities,
    assumptions: updates.assumptions ?? existing.assumptions,
    businessConstraints: updates.businessConstraints ?? existing.businessConstraints,
    version: createExecutiveContextMemoryVersion({
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

export const ExecutiveContextMemoryBuilder = Object.freeze({
  createExecutiveContextMemory,
  createExecutiveContextMetadata,
  createExecutiveContextMemoryVersion,
  createExecutiveContextReference,
  createExecutiveBusinessContext,
  createExecutiveMarketContext,
  createExecutiveOrganizationContext,
  createExecutiveResourceContext,
  createExecutiveResourceEntry,
  createExecutiveStakeholderContext,
  createExecutivePolicyContext,
  createExecutivePolicyEntry,
  createExecutiveExternalContext,
  createExecutiveExternalEvent,
  createExecutiveContextSnapshot,
  applyExecutiveContextMemoryUpdate,
});
