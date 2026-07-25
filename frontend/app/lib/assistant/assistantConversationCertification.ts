/** ASSISTANT-1:7 — Canonical Assistant Conversation Certification aggregate. */
import { AssistantConversationPlatform } from "./assistantConversationPlatform.ts";
import { AssistantConversationCertificationConstants } from "./assistantConversationCertification.constants.ts";
import { AssistantConversationCertificationCriteria } from "./assistantConversationCertification.criteria.ts";
import { AssistantConversationCertificationGates } from "./assistantConversationCertification.gates.ts";
import { AssistantConversationCertificationIdentity } from "./assistantConversationCertification.identity.ts";
import { AssistantConversationCertificationResults } from "./assistantConversationCertification.results.ts";

export const AssistantConversationCertification = Object.freeze({
  identity: AssistantConversationCertificationIdentity,
  platform: AssistantConversationPlatform,
  constants: AssistantConversationCertificationConstants,
  criteria: AssistantConversationCertificationCriteria,
  gates: AssistantConversationCertificationGates,
  results: AssistantConversationCertificationResults,
  metadata: Object.freeze({
    certificationIdentifier:
      AssistantConversationCertificationConstants.certificationIdentifier,
    namespace: AssistantConversationCertificationConstants.namespace,
    version: AssistantConversationCertificationConstants.version,
    status: AssistantConversationCertificationConstants.status,
    criteriaCount: AssistantConversationCertificationConstants.criteriaCount,
    gateCount: AssistantConversationCertificationConstants.gateCount,
    readiness: AssistantConversationCertificationConstants.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  boundaries: Object.freeze([
    "Runtime", "Conversation Execution", "Dialogue Engine", "Prompt Execution",
    "LLM Integration", "AI Reasoning", "Executive Memory",
    "Workspace Orchestration", "Workspace Execution", "Object Creation",
    "Recommendation Generation", "Decision Making", "Engine Execution",
    "Director", "DKL", "EVE", "NEA", "Runtime Layer", "SDK", "API Endpoints",
    "Database", "Queue", "Event Bus", "Networking", "Persistence", "UI",
    "Rendering", "Authentication", "Authorization", "Logging", "Monitoring",
  ]),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:6 Conversation Platform",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationCertification"]),
  status: "Certification",
  readiness: "ReadyForFreeze",
  nextPhase: "ASSISTANT-1:8 — Conversation Freeze",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableLogic: false,
  runtime: false,
  conversationExecution: false,
  llmIntegration: false,
  promptExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  workflowExecution: false,
  aiReasoning: false,
} as const);
