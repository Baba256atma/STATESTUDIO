/** ASSISTANT-2:4 — Immutable Validation constants. */
import { AssistantExecutiveMemoryValidationGates } from "./assistantExecutiveMemoryValidation.gates.ts";
import { AssistantExecutiveMemoryValidationRules } from "./assistantExecutiveMemoryValidation.rules.ts";

export const AssistantExecutiveMemoryValidationConstants = Object.freeze({
  validationIdentifier: "ASSISTANT-2:4/ExecutiveMemoryValidation",
  namespace: "nexora.assistant.executive-memory.validation",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  ruleCount: AssistantExecutiveMemoryValidationRules.length,
  gateCount: AssistantExecutiveMemoryValidationGates.length,
} as const);
