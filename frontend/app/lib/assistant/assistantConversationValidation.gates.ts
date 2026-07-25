/** ASSISTANT-1:4 — Exactly 16 immutable non-executable gates. */
import { AssistantConversationValidationRules } from "./assistantConversationValidation.rules.ts";
import type { AssistantConversationValidationGateMetadata } from "./assistantConversationValidation.types.ts";

const names = Object.freeze([
  "Identity Complete",
  "Registry Complete",
  "Relationships Valid",
  "Lifecycle Valid",
  "Metadata Complete",
  "Namespace Valid",
  "Boundaries Enforced",
  "Export Integrity",
  "Model Complete",
  "Constants Complete",
  "Type Safety Ready",
  "Dependency Safe",
  "Architecture Compliant",
  "Metadata Immutable",
  "Validation Passed",
  "ReadyForManifest",
] as const);

export const AssistantConversationValidationGates:
readonly AssistantConversationValidationGateMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    gateId: `ASSISTANT-1:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    declaredState: "Passed",
    evidenceRules: Object.freeze(
      AssistantConversationValidationRules.slice(index * 2, index * 2 + 2)
        .map(({ ruleId }) => ruleId),
    ),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
