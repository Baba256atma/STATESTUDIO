/** ASSISTANT-3:7 — Canonical Intent & Dialogue Understanding Certification. */
import { AssistantIntentDialoguePlatform } from "./assistantIntentDialoguePlatform.ts";
import { AssistantIntentDialogueCertificationConstants } from "./assistantIntentDialogueCertification.constants.ts";
import {
  AssistantIntentDialogueCertificationCategories,
  AssistantIntentDialogueCertificationCriteria,
  AssistantIntentDialogueCertificationMetadataFieldCount,
} from "./assistantIntentDialogueCertification.criteria.ts";
import { AssistantIntentDialogueCertificationGates } from "./assistantIntentDialogueCertification.gates.ts";
import { AssistantIntentDialogueCertificationIdentity } from "./assistantIntentDialogueCertification.identity.ts";
import { AssistantIntentDialogueCertificationResults } from "./assistantIntentDialogueCertification.results.ts";

export const AssistantIntentDialogueCertification = Object.freeze({
  identity: AssistantIntentDialogueCertificationIdentity,
  platform: AssistantIntentDialoguePlatform,
  constants: AssistantIntentDialogueCertificationConstants,
  criteria: AssistantIntentDialogueCertificationCriteria,
  gates: AssistantIntentDialogueCertificationGates,
  results: AssistantIntentDialogueCertificationResults,
  categories: AssistantIntentDialogueCertificationCategories,
  metadata: Object.freeze({
    certificationIdentifier:
      AssistantIntentDialogueCertificationConstants.certificationIdentifier,
    namespace: AssistantIntentDialogueCertificationConstants.namespace,
    version: AssistantIntentDialogueCertificationConstants.version,
    status: AssistantIntentDialogueCertificationConstants.status,
    criteriaCount: AssistantIntentDialogueCertificationConstants.criteriaCount,
    gateCount: AssistantIntentDialogueCertificationConstants.gateCount,
    readiness: AssistantIntentDialogueCertificationConstants.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  statistics: Object.freeze({
    certificationCriteriaCount:
      AssistantIntentDialogueCertificationConstants.criteriaCount,
    certificationGateCount:
      AssistantIntentDialogueCertificationConstants.gateCount,
    certificationCategoryCount:
      AssistantIntentDialogueCertificationCategories.length,
    certifiedMetadataCount:
      AssistantIntentDialogueCertificationMetadataFieldCount,
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
    "ASSISTANT-3:6 Intent & Dialogue Understanding Platform",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueCertification"]),
  status: "Certification",
  readiness: "ReadyForFreeze",
  nextPhase: "ASSISTANT-3:8 — Intent & Dialogue Understanding Freeze",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableLogic: false,
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
  workflowExecution: false,
  aiReasoning: false,
} as const);
