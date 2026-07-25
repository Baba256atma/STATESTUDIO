/** ASSISTANT-3:8 — Canonical Intent & Dialogue Understanding Freeze. */
import { AssistantIntentDialogueCertification } from "./assistantIntentDialogueCertification.ts";
import { AssistantIntentDialogueFreezeBaselines } from "./assistantIntentDialogueFreeze.baselines.ts";
import { AssistantIntentDialogueFreezeCompatibility } from "./assistantIntentDialogueFreeze.compatibility.ts";
import { AssistantIntentDialogueFreezeConstants } from "./assistantIntentDialogueFreeze.constants.ts";
import { AssistantIntentDialogueFreezeIdentity } from "./assistantIntentDialogueFreeze.identity.ts";
import {
  AssistantIntentDialogueFreezeArchitecturalLocks,
  AssistantIntentDialogueFreezeArchitectureRegistry,
  AssistantIntentDialogueFreezeCanonicalLock,
} from "./assistantIntentDialogueFreeze.lock.ts";

export const AssistantIntentDialogueFreeze = Object.freeze({
  identity: AssistantIntentDialogueFreezeIdentity,
  certification: AssistantIntentDialogueCertification,
  constants: AssistantIntentDialogueFreezeConstants,
  lock: AssistantIntentDialogueFreezeCanonicalLock,
  architecturalLocks: AssistantIntentDialogueFreezeArchitecturalLocks,
  baselines: AssistantIntentDialogueFreezeBaselines,
  compatibility: AssistantIntentDialogueFreezeCompatibility,
  architectureRegistry: AssistantIntentDialogueFreezeArchitectureRegistry,
  metadata: Object.freeze({
    freezeIdentifier: AssistantIntentDialogueFreezeConstants.freezeIdentifier,
    canonicalNamespace: AssistantIntentDialogueFreezeConstants.namespace,
    version: AssistantIntentDialogueFreezeConstants.version,
    status: AssistantIntentDialogueFreezeConstants.status,
    readiness: AssistantIntentDialogueFreezeConstants.readiness,
    freezeLockIdentifier:
      AssistantIntentDialogueFreezeConstants.lockIdentifier,
    baselineCount: AssistantIntentDialogueFreezeConstants.baselineCount,
    compatibilityCount:
      AssistantIntentDialogueFreezeConstants.compatibilityCount,
    architecturalLockCount: AssistantIntentDialogueFreezeConstants.lockCount,
    frozenRegistryEntryCount:
      AssistantIntentDialogueFreezeConstants.registryEntryCount,
    metadataOnly: true,
    immutable: true,
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
    "ASSISTANT-3:7 Intent & Dialogue Understanding Certification",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueFreeze"]),
  status: "Frozen",
  readiness: "ReadyForPublicIndex",
  nextPhase: "ASSISTANT-3:9 — Intent & Dialogue Understanding Public Index",
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
  services: false,
  factories: false,
  builders: false,
  executors: false,
} as const);
