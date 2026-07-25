/** ASSISTANT-1:5 — Immutable publication and boundary metadata. */
import { AssistantConversationManifestConstants } from "./assistantConversationManifest.constants.ts";
import { AssistantConversationManifestInventory } from "./assistantConversationManifest.inventory.ts";

export const AssistantConversationManifestMetadata = Object.freeze({
  manifestIdentifier: AssistantConversationManifestConstants.manifestIdentifier,
  manifestName: "Assistant Conversation Manifest",
  description:
    "Canonical publication of validated Assistant Conversation metadata.",
  version: AssistantConversationManifestConstants.version,
  namespace: AssistantConversationManifestConstants.namespace,
  releaseTarget: "Assistant Conversation Platform",
  readiness: AssistantConversationManifestConstants.readiness,
  publishedInventoryCount:
    AssistantConversationManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantConversationManifestConstants.inventoryTotals.validationRuleCount,
  validationGateCount:
    AssistantConversationManifestConstants.inventoryTotals.validationGateCount,
  source: AssistantConversationManifestInventory.source,
  boundaries: Object.freeze([
    "Runtime", "Conversation Execution", "Prompt Execution", "LLM Integration",
    "AI Reasoning", "Executive Memory", "Workspace Selection",
    "Object Creation", "Engine Execution", "Director", "DKL", "EVE", "NEA",
    "Runtime Layer", "SDK", "API Endpoints", "Database", "Queue", "Event Bus",
    "Persistence", "Networking", "UI", "Rendering", "Logging", "Monitoring",
    "Authentication", "Authorization",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
