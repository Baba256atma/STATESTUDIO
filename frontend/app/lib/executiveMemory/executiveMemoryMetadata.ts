/**
 * APP-4:2 — Executive Memory metadata, header, body, and version contracts.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import {
  EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS,
  EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
} from "./executiveMemoryRecordConstants.ts";
import type { ExecutiveMemoryReference } from "./executiveMemoryReference.ts";

export type ExecutiveMemoryTag = Readonly<{
  tagId: string;
  label: string;
  readOnly: true;
}>;

export type ExecutiveMemoryVersion = Readonly<{
  versionId: string;
  schemaVersion: typeof EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION | string;
  contractVersion: typeof EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION | string;
  semanticVersion: string;
  compatibility: typeof EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryHeader = Readonly<{
  title: string;
  summary: string;
  owner: string;
  sourceModule: string;
  readOnly: true;
}>;

export type ExecutiveMemoryBody = Readonly<{
  narrative: string;
  keyPoints: readonly string[];
  readOnly: true;
}>;

export type ExecutiveMemoryBusinessContext = Readonly<{
  contextId: string;
  domain: string;
  businessUnit: string | null;
  department: string | null;
  market: string | null;
  description: string;
  readOnly: true;
}>;

export type ExecutiveMemoryMetadata = Readonly<{
  memoryId: ExecutiveMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  owner: string;
  sourceModule: string;
  tags: readonly ExecutiveMemoryTag[];
  references: readonly ExecutiveMemoryReference[];
  customMetadata: Readonly<Record<string, string>>;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export function createExecutiveMemoryTag(
  input: Omit<ExecutiveMemoryTag, "readOnly">
): ExecutiveMemoryTag {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryVersion(
  input: Omit<ExecutiveMemoryVersion, "readOnly" | "compatibility"> & {
    compatibility?: typeof EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS;
  }
): ExecutiveMemoryVersion {
  return Object.freeze({
    ...input,
    compatibility: input.compatibility ?? EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS,
    readOnly: true as const,
  });
}

export function createExecutiveMemoryHeader(
  input: Omit<ExecutiveMemoryHeader, "readOnly">
): ExecutiveMemoryHeader {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryBody(
  input: Omit<ExecutiveMemoryBody, "readOnly"> & { keyPoints?: readonly string[] }
): ExecutiveMemoryBody {
  return Object.freeze({
    narrative: input.narrative,
    keyPoints: Object.freeze([...(input.keyPoints ?? [])]),
    readOnly: true as const,
  });
}

export function createExecutiveMemoryBusinessContext(
  input: Omit<ExecutiveMemoryBusinessContext, "readOnly">
): ExecutiveMemoryBusinessContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export type CreateExecutiveMemoryMetadataInput = Readonly<{
  memoryId: ExecutiveMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  owner: string;
  sourceModule: string;
  tags?: readonly ExecutiveMemoryTag[];
  references?: readonly ExecutiveMemoryReference[];
  customMetadata?: Readonly<Record<string, string>>;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export function createExecutiveMemoryMetadata(
  input: CreateExecutiveMemoryMetadataInput
): ExecutiveMemoryMetadata {
  return Object.freeze({
    memoryId: input.memoryId,
    workspaceId: input.workspaceId,
    category: input.category,
    owner: input.owner,
    sourceModule: input.sourceModule,
    tags: Object.freeze([...(input.tags ?? [])]),
    references: Object.freeze([...(input.references ?? [])]),
    customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
    extensionMetadata: Object.freeze({ ...(input.extensionMetadata ?? {}) }),
    readOnly: true as const,
  });
}
