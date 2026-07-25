/** ASSISTANT-5:4 — Immutable Validation constants. */
import { AssistantWorkspaceOrchestrationValidationGates } from "./assistantWorkspaceOrchestrationValidation.gates.ts";
import { AssistantWorkspaceOrchestrationValidationRules } from "./assistantWorkspaceOrchestrationValidation.rules.ts";

export const AssistantWorkspaceOrchestrationValidationConstants =
  Object.freeze({
    validationIdentifier: "ASSISTANT-5:4/WorkspaceOrchestrationValidation",
    namespace: "nexora.assistant.workspace-orchestration.validation",
    version: "1.0.0",
    status: "Validation",
    readiness: "ReadyForManifest",
    ruleCount: AssistantWorkspaceOrchestrationValidationRules.length,
    gateCount: AssistantWorkspaceOrchestrationValidationGates.length,
  } as const);
