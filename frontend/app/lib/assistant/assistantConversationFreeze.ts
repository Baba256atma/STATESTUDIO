/** ASSISTANT-1:8 — Canonical Assistant Conversation Freeze aggregate. */
import { AssistantConversationCertification } from "./assistantConversationCertification.ts";
import { AssistantConversationFreezeBaselines } from "./assistantConversationFreeze.baselines.ts";
import { AssistantConversationFreezeCompatibility } from "./assistantConversationFreeze.compatibility.ts";
import { AssistantConversationFreezeConstants } from "./assistantConversationFreeze.constants.ts";
import { AssistantConversationFreezeIdentity } from "./assistantConversationFreeze.identity.ts";
import {
  AssistantConversationFreezeArchitecturalLocks,
  AssistantConversationFreezeArchitectureRegistry,
  AssistantConversationFreezeCanonicalLock,
} from "./assistantConversationFreeze.lock.ts";

export const AssistantConversationFreeze = Object.freeze({
  identity: AssistantConversationFreezeIdentity,
  certification: AssistantConversationCertification,
  constants: AssistantConversationFreezeConstants,
  lock: AssistantConversationFreezeCanonicalLock,
  architecturalLocks: AssistantConversationFreezeArchitecturalLocks,
  baselines: AssistantConversationFreezeBaselines,
  compatibility: AssistantConversationFreezeCompatibility,
  architectureRegistry: AssistantConversationFreezeArchitectureRegistry,
  metadata: Object.freeze({
    freezeIdentifier: AssistantConversationFreezeConstants.freezeIdentifier,
    namespace: AssistantConversationFreezeConstants.namespace,
    version: AssistantConversationFreezeConstants.version,
    status: AssistantConversationFreezeConstants.status,
    lockIdentifier: AssistantConversationFreezeConstants.lockIdentifier,
    baselineCount: AssistantConversationFreezeConstants.baselineCount,
    compatibilityCount:
      AssistantConversationFreezeConstants.compatibilityCount,
    lockCount: AssistantConversationFreezeConstants.lockCount,
    registryEntryCount:
      AssistantConversationFreezeConstants.registryEntryCount,
    readiness: AssistantConversationFreezeConstants.readiness,
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
    "ASSISTANT-1:7 Conversation Certification",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationFreeze"]),
  status: "Frozen",
  readiness: "ReadyForPublicIndex",
  nextPhase: "ASSISTANT-1:9 — Conversation Public Index",
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
  services: false,
  factories: false,
  builders: false,
  executors: false,
} as const);
