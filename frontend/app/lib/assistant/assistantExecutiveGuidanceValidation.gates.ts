/** ASSISTANT-4:4 — Exactly 16 immutable non-executable gates. */
import { AssistantExecutiveGuidanceValidationRules } from "./assistantExecutiveGuidanceValidation.rules.ts";
import type { AssistantExecutiveGuidanceValidationGateMetadata } from "./assistantExecutiveGuidanceValidation.types.ts";

const gates = Object.freeze([
  {
    name: "Identity Gate",
    description: "Gate confirming Executive Guidance identity validation.",
  },
  {
    name: "Namespace Gate",
    description: "Gate confirming namespace integrity validation.",
  },
  {
    name: "Version Gate",
    description: "Gate confirming version consistency validation.",
  },
  {
    name: "Registry Gate",
    description: "Gate confirming Registry reference validation.",
  },
  {
    name: "Model Gate",
    description: "Gate confirming domain model validation.",
  },
  {
    name: "Relationship Gate",
    description: "Gate confirming relationship integrity validation.",
  },
  {
    name: "Lifecycle Gate",
    description: "Gate confirming lifecycle definition validation.",
  },
  {
    name: "Metadata Gate",
    description: "Gate confirming required metadata validation.",
  },
  {
    name: "Boundary Gate",
    description: "Gate confirming prohibited-surface boundary validation.",
  },
  {
    name: "Export Gate",
    description: "Gate confirming public export validation.",
  },
  {
    name: "Dependency Gate",
    description: "Gate confirming Model-only dependency validation.",
  },
  {
    name: "Architecture Gate",
    description: "Gate confirming metadata-only architecture validation.",
  },
  {
    name: "Metadata Integrity Gate",
    description: "Gate confirming immutable metadata integrity validation.",
  },
  {
    name: "Consumer Readiness Gate",
    description: "Gate confirming Manifest consumer readiness validation.",
  },
  {
    name: "Final Validation Gate",
    description: "Gate confirming final Validation approval.",
  },
  {
    name: "ReadyForManifest Gate",
    description: "Gate confirming ReadyForManifest readiness validation.",
  },
] as const);

export const AssistantExecutiveGuidanceValidationGates:
readonly AssistantExecutiveGuidanceValidationGateMetadata[] = Object.freeze(
  gates.map((gate, index) => Object.freeze({
    gateId: `ASSISTANT-4:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name: gate.name,
    description: gate.description,
    declaredState: "Passed",
    evidenceRules: Object.freeze(
      AssistantExecutiveGuidanceValidationRules
        .slice(index * 2, index * 2 + 2)
        .map(({ ruleId }) => ruleId),
    ),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
