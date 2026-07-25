/** ASSISTANT-1:6 — Canonical Assistant Conversation Platform aggregate. */
import { AssistantConversationManifest } from "./assistantConversationManifest.ts";
import { AssistantConversationPlatformCapabilities } from "./assistantConversationPlatform.capabilities.ts";
import { AssistantConversationPlatformCompatibility } from "./assistantConversationPlatform.compatibility.ts";
import { AssistantConversationPlatformConstants } from "./assistantConversationPlatform.constants.ts";
import { AssistantConversationPlatformGuarantees } from "./assistantConversationPlatform.guarantees.ts";
import { AssistantConversationPlatformIdentity } from "./assistantConversationPlatform.identity.ts";

export const AssistantConversationPlatform = Object.freeze({
  identity: AssistantConversationPlatformIdentity,
  manifest: AssistantConversationManifest,
  composition: Object.freeze({
    foundation:
      AssistantConversationManifest.inventory.registryInventory.metadata
        .sourceFoundation,
    registry: AssistantConversationManifest.inventory.registryInventory,
    model: AssistantConversationManifest.inventory.modelInventory,
    validation: AssistantConversationManifest.validation,
    manifest: AssistantConversationManifest,
    publicMetadata:
      AssistantConversationManifest.inventory.publicMetadataInventory,
    sourceManifest: AssistantConversationManifest.identity,
    metadataOnly: true,
    immutable: true,
  }),
  constants: AssistantConversationPlatformConstants,
  capabilities: AssistantConversationPlatformCapabilities,
  guarantees: AssistantConversationPlatformGuarantees,
  compatibility: AssistantConversationPlatformCompatibility,
  readiness: Object.freeze({
    status: "ReadyForCertification",
    certificationCompatible: true,
    freezeCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  consumerMetadata: Object.freeze({
    consumer: "Conversation Certification",
    stablePublicMetadata: true,
    runtimeConsumer: false,
    metadataOnly: true,
    immutable: true,
  }),
  publishedInventoryCount:
    AssistantConversationManifest.summary.publishedInventoryCount,
  boundaries: Object.freeze([
    "Runtime", "Conversation Execution", "Prompt Execution", "LLM Integration",
    "AI Reasoning", "Executive Memory", "Workspace Orchestration",
    "Workspace Execution", "Object Creation", "Recommendation Generation",
    "Decision Making", "Engine Execution", "Director", "DKL", "EVE", "NEA",
    "Runtime Layer", "SDK", "API Endpoints", "Database", "Queue", "Event Bus",
    "Networking", "Persistence", "UI", "Rendering", "Authentication",
    "Authorization", "Logging", "Monitoring",
  ]),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:5 Conversation Manifest",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationPlatform"]),
  status: "Platform",
  readinessStatus: "ReadyForCertification",
  nextPhase: "ASSISTANT-1:7 — Conversation Certification",
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
