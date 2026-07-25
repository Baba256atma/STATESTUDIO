/** ASSISTANT-1:4 — Canonical Conversation Validation aggregate. */
import { AssistantConversationModel } from "./assistantConversationModel.ts";
import { AssistantConversationValidationConstants } from "./assistantConversationValidation.constants.ts";
import { AssistantConversationValidationGates } from "./assistantConversationValidation.gates.ts";
import { AssistantConversationValidationIdentity } from "./assistantConversationValidation.identity.ts";
import {
  AssistantConversationValidationCategories,
  AssistantConversationValidationRules,
} from "./assistantConversationValidation.rules.ts";
import { AssistantConversationValidationResults } from "./assistantConversationValidation.results.ts";

export const AssistantConversationValidation = Object.freeze({
  identity: AssistantConversationValidationIdentity,
  model: AssistantConversationModel,
  constants: AssistantConversationValidationConstants,
  categories: AssistantConversationValidationCategories,
  rules: AssistantConversationValidationRules,
  gates: AssistantConversationValidationGates,
  results: AssistantConversationValidationResults,
  boundaries: Object.freeze([
    "Runtime", "Conversation Execution", "Chat Engine", "Prompt Execution",
    "LLM Integration", "AI Reasoning", "Workspace Selection",
    "Object Creation", "Engine Execution", "Director", "DKL", "EVE", "NEA",
    "Runtime Layer", "SDK", "Persistence", "Database", "API", "Queue",
    "Event Bus", "Network", "UI", "Rendering", "Authentication",
    "Authorization", "Logging", "Monitoring",
  ]),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:3 Conversation Model",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationValidation"]),
  status: "Validation",
  readiness: "ReadyForManifest",
  nextPhase: "ASSISTANT-1:5 — Conversation Manifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidation: false,
  runtime: false,
  conversationExecution: false,
  llmIntegration: false,
  promptExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
} as const);
