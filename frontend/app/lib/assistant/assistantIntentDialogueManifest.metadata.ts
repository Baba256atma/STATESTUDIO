/** ASSISTANT-3:5 — Immutable publication and boundary metadata. */
import { AssistantIntentDialogueManifestConstants } from "./assistantIntentDialogueManifest.constants.ts";
import { AssistantIntentDialogueManifestInventory } from "./assistantIntentDialogueManifest.inventory.ts";

export const AssistantIntentDialogueManifestMetadata = Object.freeze({
  manifestIdentifier:
    AssistantIntentDialogueManifestConstants.manifestIdentifier,
  canonicalName: "Assistant Intent & Dialogue Understanding Manifest",
  description:
    "Canonical publication of validated Intent & Dialogue Understanding metadata.",
  namespace: AssistantIntentDialogueManifestConstants.namespace,
  version: AssistantIntentDialogueManifestConstants.version,
  status: AssistantIntentDialogueManifestConstants.status,
  releaseTarget: "Assistant Intent & Dialogue Understanding Platform",
  readiness: AssistantIntentDialogueManifestConstants.readiness,
  publishedInventoryCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .validationRuleCount,
  validationGateCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .validationGateCount,
  source: AssistantIntentDialogueManifestInventory.source,
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
  metadataOnly: true,
  immutable: true,
} as const);
