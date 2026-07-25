/** ASSISTANT-8:1 — Immutable Executive Action Execution policies. */
import type { ExecutiveActionExecutionPolicyMetadata } from "./executiveActionExecutionTypes.ts";

const declarations = Object.freeze([
  [
    "Execution Consistency",
    "Execution metadata remains consistent across Foundation consumers.",
  ],
  [
    "Immutable Identity",
    "Canonical execution identities remain immutable after declaration.",
  ],
  [
    "Deterministic Status",
    "Execution status classifications remain deterministic and ordered.",
  ],
  [
    "Progress Integrity",
    "Progress metadata remains descriptive and non-executable.",
  ],
  [
    "Feedback Traceability",
    "Feedback metadata remains traceable to execution identities.",
  ],
  [
    "Exception Visibility",
    "Exception classifications remain visible as architectural metadata.",
  ],
  [
    "Executive Transparency",
    "Executive visibility metadata remains publicly describable.",
  ],
  [
    "Foundation Stability",
    "Foundation exports remain stable for all downstream ASSISTANT-8 phases.",
  ],
] as const);

export const ExecutiveActionExecutionPolicies:
readonly ExecutiveActionExecutionPolicyMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:1/Policy/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    enforceableAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
