/** ASSISTANT-7:4 — Immutable Validation constants. */
import { AssistantExecutiveActionPlanningValidationGates } from "./assistantExecutiveActionPlanningValidation.gates.ts";
import { AssistantExecutiveActionPlanningValidationRules } from "./assistantExecutiveActionPlanningValidation.rules.ts";

export const AssistantExecutiveActionPlanningValidationConstants =
  Object.freeze({
    validationIdentifier:
      "ASSISTANT-7:4/ExecutiveActionPlanningValidation",
    namespace: "nexora.assistant.executive-action-planning.validation",
    version: "1.0.0",
    status: "Validation",
    readiness: "ReadyForManifest",
    ruleCount: AssistantExecutiveActionPlanningValidationRules.length,
    gateCount: AssistantExecutiveActionPlanningValidationGates.length,
  } as const);
