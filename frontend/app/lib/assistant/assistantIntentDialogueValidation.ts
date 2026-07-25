/** ASSISTANT-3:4 — Canonical Intent & Dialogue Understanding Validation. */
import { AssistantIntentDialogueModel } from "./assistantIntentDialogueModel.ts";
import { AssistantIntentDialogueValidationConstants } from "./assistantIntentDialogueValidation.constants.ts";
import { AssistantIntentDialogueValidationGates } from "./assistantIntentDialogueValidation.gates.ts";
import { AssistantIntentDialogueValidationIdentity } from "./assistantIntentDialogueValidation.identity.ts";
import {
  AssistantIntentDialogueValidationCategories,
  AssistantIntentDialogueValidationRuleMetadataCount,
  AssistantIntentDialogueValidationRules,
} from "./assistantIntentDialogueValidation.rules.ts";
import { AssistantIntentDialogueValidationResults } from "./assistantIntentDialogueValidation.results.ts";

export const AssistantIntentDialogueValidation = Object.freeze({
  identity: AssistantIntentDialogueValidationIdentity,
  model: AssistantIntentDialogueModel,
  constants: AssistantIntentDialogueValidationConstants,
  categories: AssistantIntentDialogueValidationCategories,
  rules: AssistantIntentDialogueValidationRules,
  gates: AssistantIntentDialogueValidationGates,
  results: AssistantIntentDialogueValidationResults,
  statistics: Object.freeze({
    validationRuleCount: AssistantIntentDialogueValidationConstants.ruleCount,
    validationGateCount: AssistantIntentDialogueValidationConstants.gateCount,
    validationCategoryCount: AssistantIntentDialogueValidationCategories.length,
    validationMetadataCount:
      AssistantIntentDialogueValidationRuleMetadataCount,
  }),
  boundaries: Object.freeze([
    "Runtime", "Intent Classification", "NLP", "Natural Language Parsing",
    "LLM Integration", "Prompt Execution", "AI Reasoning",
    "Conversation Execution", "Executive Memory Persistence",
    "Context Injection", "Workspace Orchestration", "Workspace Execution",
    "Object Creation", "Recommendation Generation", "Decision Making",
    "Engine Execution", "DKL", "Director", "EVE", "NEA", "Runtime Layer",
    "SDK", "API Endpoints", "Database", "Queue", "Event Bus", "Networking",
    "UI", "Rendering", "Authentication", "Authorization", "Logging",
    "Monitoring",
  ]),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-3:3 Intent & Dialogue Understanding Model",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueValidation"]),
  status: "Validation",
  readiness: "ReadyForManifest",
  nextPhase: "ASSISTANT-3:5 — Intent & Dialogue Understanding Manifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidation: false,
  runtime: false,
  intentClassification: false,
  nlp: false,
  naturalLanguageParsing: false,
  llmIntegration: false,
  promptExecution: false,
  dialogueExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
} as const);
