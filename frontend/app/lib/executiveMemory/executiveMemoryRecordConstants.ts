/**
 * APP-4:2 — Executive Memory record constants.
 * Schema versioning, reference types, and certification tags.
 */

import type { ExecutiveMemoryReferenceType } from "./executiveMemoryReference.ts";

export const EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION = "APP-4/2" as const;
export const EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION = "1.0.0" as const;
export const EXECUTIVE_MEMORY_RECORD_ARCHITECTURE_VERSION = "APP-4/2-arch" as const;

export const EXECUTIVE_MEMORY_RECORD_TAGS = Object.freeze([
  "[APP4_2]",
  "[EXECUTIVE_MEMORY_RECORD]",
  "[EXECUTIVE_MEMORY_CONTRACTS]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_PERSISTENCE]",
  "[NO_RETRIEVAL]",
] as const);

export const EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS = Object.freeze([
  "goal",
  "intent",
  "scenario",
  "decision",
  "object",
  "relationship",
  "kpi",
  "risk",
  "timeline",
  "data_source",
  "workspace",
  "report",
  "assistant_session",
  "evidence",
  "custom",
] as const satisfies readonly ExecutiveMemoryReferenceType[]);

export const EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
  "unknown",
] as const);

export const EXECUTIVE_MEMORY_RECORD_MANDATORY_FIELDS = Object.freeze([
  "id",
  "providerId",
  "workspaceId",
  "category",
  "header",
  "body",
  "references",
  "tags",
  "createdAt",
  "updatedAt",
  "version",
  "metadata",
  "schemaVersion",
  "contractVersion",
] as const);

export const EXECUTIVE_MEMORY_RECORD_LIMITS = Object.freeze({
  minConfidenceScore: 0,
  maxConfidenceScore: 1,
  maxReferences: 128,
  maxTags: 64,
  maxEvidenceItems: 64,
  maxAssumptions: 32,
  maxConstraints: 32,
  maxOutcomes: 32,
  maxLessonsLearned: 32,
  maxRelationships: 64,
  maxTitleLength: 512,
  maxSummaryLength: 4096,
} as const);

export const EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS = Object.freeze({
  app41Compatible: true,
  schemaMigrationSupported: true,
  forwardCompatible: true,
  backwardCompatible: true,
  readOnly: true,
} as const);
