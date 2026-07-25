/** ASSISTANT-9:1 — Immutable Foundation monitoring policies. */
import type { AssistantActionMonitoringControlPolicyMetadata } from "./assistantActionMonitoringControlIdentity.ts";

const declarations = Object.freeze([
  [
    "Immutable Foundation",
    "Foundation metadata remains immutable after declaration.",
  ],
  [
    "No Runtime Behaviour",
    "Foundation forbids monitoring and control runtime behaviour.",
  ],
  [
    "Metadata Only",
    "Foundation publishes descriptive metadata exclusively.",
  ],
  [
    "Deterministic Identity",
    "Foundation identities remain deterministic and ordered.",
  ],
  [
    "Registry Ownership",
    "Registry ownership of monitoring vocabularies remains preserved.",
  ],
  [
    "Validation Ownership",
    "Validation ownership of integrity gates remains preserved.",
  ],
  [
    "Freeze Compatibility",
    "Foundation remains compatible with Freeze release constraints.",
  ],
  [
    "Public Index Compatibility",
    "Foundation remains compatible with Public Index publication.",
  ],
] as const);

export const AssistantActionMonitoringControlPolicies:
readonly AssistantActionMonitoringControlPolicyMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-9:1/Policy/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    enforceableAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
