/** ASSISTANT-4:4 — Immutable Validation constants. */
import { AssistantExecutiveGuidanceValidationGates } from "./assistantExecutiveGuidanceValidation.gates.ts";
import { AssistantExecutiveGuidanceValidationRules } from "./assistantExecutiveGuidanceValidation.rules.ts";

export const AssistantExecutiveGuidanceValidationConstants = Object.freeze({
  validationIdentifier: "ASSISTANT-4:4/ExecutiveGuidanceValidation",
  namespace: "nexora.assistant.executive-guidance.validation",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  ruleCount: AssistantExecutiveGuidanceValidationRules.length,
  gateCount: AssistantExecutiveGuidanceValidationGates.length,
} as const);
