/** ASSISTANT-8:4 — Exactly 48 immutable declarative validation rules. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import { ExecutionValidationCategories } from "./executionValidationCategories.ts";
import {
  registerValidationRules,
  type ExecutionValidationRuleMetadata,
} from "./executionValidationMetadata.ts";

const rulesByCategory = Object.freeze([
  [
    "Domain Model Completeness",
    "Canonical Domain Model Identities",
    "Model Category Integrity",
    "Model Attribute Coverage",
    "Model Readiness Consistency",
    "Model Immutable Exports",
  ],
  [
    "Registry Reference Validity",
    "Registry Compatibility Metadata",
    "Canonical Registry Identities",
    "Stable Registry Vocabulary Links",
  ],
  [
    "Executive Action Structure",
    "Execution Plan Structure",
    "Execution Step Structure",
    "Dependency Structure Metadata",
    "Ownership Structure Metadata",
  ],
  [
    "Parent Relationship Integrity",
    "Child Relationship Integrity",
    "Dependency Reference Integrity",
    "Checkpoint Reference Integrity",
    "Timeline Reference Integrity",
  ],
  [
    "Valid Progress Type",
    "Valid Progress Measurement",
    "Unique Progress Identity",
    "Deterministic Progress Structure",
  ],
  [
    "Legal Execution States",
    "Unique State Definitions",
    "Immutable State Registry Mapping",
    "Canonical Lifecycle Mapping",
  ],
  [
    "Health Classification Completeness",
    "Health Level Canonical Identity",
    "Health Metadata Integrity",
    "Health Catalog Determinism",
  ],
  [
    "Exception Classification Validity",
    "Exception Severity Definition",
    "Exception Canonical Identity",
    "Exception Metadata Completeness",
  ],
  [
    "Feedback Origin Validity",
    "Feedback Type Validity",
    "Feedback Canonical Ownership",
  ],
  [
    "Checkpoint Identity Validity",
    "Checkpoint Progress Linkage",
    "Checkpoint Metadata Completeness",
  ],
  [
    "Timeline Event Completeness",
    "Timeline Snapshot Linkage",
    "Timeline Metadata Determinism",
  ],
  [
    "Required Metadata Fields",
    "Metadata Ownership And Namespace",
    "Metadata Readiness And Compatibility",
  ],
] as const);

const categoryOffsets = Object.freeze(
  rulesByCategory.reduce<readonly number[]>((offsets, names, index) => {
    if (index === 0) {
      return Object.freeze([1]);
    }
    const previous = offsets[index - 1];
    return Object.freeze([
      ...offsets,
      previous + rulesByCategory[index - 1].length,
    ]);
  }, Object.freeze([])),
);

export const ExecutionValidationRules:
readonly ExecutionValidationRuleMetadata[] = Object.freeze(
  rulesByCategory.flatMap((names, index) =>
    registerValidationRules(
      ExecutionValidationCategories[index].name,
      names,
      categoryOffsets[index],
      index < 4 ? "Critical" : "Error",
    )),
);

export const ExecutionValidationRuleContext = Object.freeze({
  sourceModel: ExecutiveActionExecutionModel.identity,
  categories: ExecutionValidationCategories,
  rules: ExecutionValidationRules,
  metadataOnly: true,
  immutable: true,
} as const);
