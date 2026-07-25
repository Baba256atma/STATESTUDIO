/** ASSISTANT-8:4 — Exactly 12 immutable validation categories. */
import type { ExecutionValidationCategoryMetadata } from "./executionValidationMetadata.ts";

const declarations = Object.freeze([
  ["Model Integrity", 6],
  ["Registry Consistency", 4],
  ["Execution Structure", 5],
  ["Relationship Integrity", 5],
  ["Progress Integrity", 4],
  ["Execution State Consistency", 4],
  ["Execution Health", 4],
  ["Exception Integrity", 4],
  ["Feedback Integrity", 3],
  ["Checkpoint Integrity", 3],
  ["Timeline Integrity", 3],
  ["Metadata Completeness", 3],
] as const);

export const ExecutionValidationCategories:
readonly ExecutionValidationCategoryMetadata[] = Object.freeze(
  declarations.map(([name, expectedRuleCount], index) => Object.freeze({
    id: `ASSISTANT-8:4/Category/${String(index + 1).padStart(2, "0")}`,
    name,
    description:
      `Canonical validation category for ${name} metadata integrity.`,
    expectedRuleCount,
    order: index + 1,
    version: "1.0.0",
    status: "Canonical",
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
