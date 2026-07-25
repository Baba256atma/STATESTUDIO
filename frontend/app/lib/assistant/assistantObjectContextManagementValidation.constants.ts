/** ASSISTANT-6:4 — Immutable Validation constants. */
import { AssistantObjectContextManagementValidationGates } from "./assistantObjectContextManagementValidation.gates.ts";
import { AssistantObjectContextManagementValidationRules } from "./assistantObjectContextManagementValidation.rules.ts";

export const AssistantObjectContextManagementValidationConstants =
  Object.freeze({
    validationIdentifier:
      "ASSISTANT-6:4/ObjectContextManagementValidation",
    namespace: "nexora.assistant.object-context-management.validation",
    version: "1.0.0",
    status: "Validation",
    readiness: "ReadyForManifest",
    ruleCount: AssistantObjectContextManagementValidationRules.length,
    gateCount: AssistantObjectContextManagementValidationGates.length,
  } as const);
