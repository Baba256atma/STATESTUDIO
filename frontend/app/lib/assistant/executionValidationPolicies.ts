/** ASSISTANT-8:4 — Immutable validation policies. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import type { ExecutionValidationPolicyMetadata } from "./executionValidationMetadata.ts";

const declarations = Object.freeze([
  [
    "Deterministic Validation",
    "Validation definitions remain deterministic and ordered.",
  ],
  [
    "Immutable Identity",
    "Validation identities remain immutable after declaration.",
  ],
  [
    "Canonical Registry Compliance",
    "Validation remains compliant with canonical Registry vocabularies.",
  ],
  [
    "Relationship Consistency",
    "Validation preserves descriptive relationship consistency.",
  ],
  [
    "Metadata Completeness",
    "Validation requires complete metadata field coverage.",
  ],
  [
    "Lifecycle Consistency",
    "Validation preserves lifecycle and state consistency metadata.",
  ],
  [
    "Foundation Compatibility",
    "Validation remains compatible with Foundation architectural intent.",
  ],
  [
    "Validation Stability",
    "Validation exports remain stable for Manifest consumers.",
  ],
] as const);

export const ExecutionValidationPolicies:
readonly ExecutionValidationPolicyMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:4/Policy/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    version: "1.0.0",
    status: "Canonical",
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ExecutionValidationPolicyContext = Object.freeze({
  sourceModel: ExecutiveActionExecutionModel.identity,
  policies: ExecutionValidationPolicies,
  metadataOnly: true,
  immutable: true,
} as const);
