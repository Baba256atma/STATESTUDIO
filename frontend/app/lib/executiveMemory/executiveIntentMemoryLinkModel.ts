/**
 * APP-4:5 — Executive Intent ↔ Memory link contracts and builders.
 */

import type {
  CreateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkMetadata,
  ExecutiveIntentMemoryLinkVersion,
} from "./executiveIntentMemoryLinkTypes.ts";

export function createExecutiveIntentMemoryLinkMetadata(
  input: Omit<ExecutiveIntentMemoryLinkMetadata, "readOnly"> & {
    customMetadata?: Readonly<Record<string, string>>;
  }
): ExecutiveIntentMemoryLinkMetadata {
  return Object.freeze({
    label: input.label,
    notes: input.notes,
    createdBy: input.createdBy,
    sourceModule: input.sourceModule,
    customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
    readOnly: true as const,
  });
}

export function createExecutiveIntentMemoryLinkVersion(
  input: Omit<ExecutiveIntentMemoryLinkVersion, "readOnly">
): ExecutiveIntentMemoryLinkVersion {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveIntentMemoryLink(
  input: CreateExecutiveIntentMemoryLinkInput
): ExecutiveIntentMemoryLink {
  return Object.freeze({
    linkId: input.linkId,
    intentId: input.intentId,
    memoryId: input.memoryId ?? null,
    workspaceId: input.workspaceId,
    relationship: input.relationship,
    linkType: input.linkType,
    goalId: input.goalId ?? null,
    scenarioId: input.scenarioId ?? null,
    decisionId: input.decisionId ?? null,
    evidenceId: input.evidenceId ?? null,
    referenceId: input.referenceId ?? null,
    lifecycle: "active",
    metadata: input.metadata,
    version: input.version,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    archivedAt: null,
    readOnly: true as const,
  });
}

function bumpSemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) {
    return "1.0.1";
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function applyExecutiveIntentMemoryLinkUpdate(
  existing: ExecutiveIntentMemoryLink,
  updates: Readonly<{
    linkType?: ExecutiveIntentMemoryLink["linkType"];
    metadata?: Readonly<{
      label?: string;
      notes?: string;
      customMetadata?: Readonly<Record<string, string>>;
    }>;
  }>,
  updatedAt: string
): ExecutiveIntentMemoryLink {
  const nextMetadata = updates.metadata
    ? createExecutiveIntentMemoryLinkMetadata({
        label: updates.metadata.label ?? existing.metadata.label,
        notes: updates.metadata.notes ?? existing.metadata.notes,
        createdBy: existing.metadata.createdBy,
        sourceModule: existing.metadata.sourceModule,
        customMetadata: updates.metadata.customMetadata ?? existing.metadata.customMetadata,
      })
    : existing.metadata;

  return Object.freeze({
    ...existing,
    linkType: updates.linkType ?? existing.linkType,
    metadata: nextMetadata,
    version: createExecutiveIntentMemoryLinkVersion({
      versionId: `${existing.version.versionId}-rev-${updatedAt}`,
      semanticVersion: bumpSemanticVersion(existing.version.semanticVersion),
      createdAt: updatedAt,
    }),
    updatedAt,
    readOnly: true as const,
  });
}

export const ExecutiveIntentMemoryLinkBuilder = Object.freeze({
  createExecutiveIntentMemoryLink,
  createExecutiveIntentMemoryLinkMetadata,
  createExecutiveIntentMemoryLinkVersion,
  applyExecutiveIntentMemoryLinkUpdate,
});
