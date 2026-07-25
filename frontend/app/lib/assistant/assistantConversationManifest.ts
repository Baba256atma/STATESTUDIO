/** ASSISTANT-1:5 — Canonical Assistant Conversation Manifest aggregate. */
import { AssistantConversationValidation } from "./assistantConversationValidation.ts";
import { AssistantConversationManifestConstants } from "./assistantConversationManifest.constants.ts";
import { AssistantConversationManifestIdentity } from "./assistantConversationManifest.identity.ts";
import { AssistantConversationManifestInventory } from "./assistantConversationManifest.inventory.ts";
import { AssistantConversationManifestMetadata } from "./assistantConversationManifest.metadata.ts";
import { AssistantConversationManifestSummary } from "./assistantConversationManifest.summary.ts";

export const AssistantConversationManifest = Object.freeze({
  identity: AssistantConversationManifestIdentity,
  validation: AssistantConversationValidation,
  constants: AssistantConversationManifestConstants,
  inventory: AssistantConversationManifestInventory,
  summary: AssistantConversationManifestSummary,
  metadata: AssistantConversationManifestMetadata,
  compatibility:
    AssistantConversationManifestInventory.compatibilityInventory,
  readiness: AssistantConversationManifestInventory.readinessInventory,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:4 Conversation Validation",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationManifest"]),
  status: "Manifest",
  readinessStatus: "ReadyForPlatform",
  nextPhase: "ASSISTANT-1:6 — Conversation Platform",
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  executableLogic: false,
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
