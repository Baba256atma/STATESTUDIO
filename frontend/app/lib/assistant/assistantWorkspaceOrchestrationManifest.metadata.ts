/** ASSISTANT-5:5 — Immutable publication and boundary metadata. */
import { AssistantWorkspaceOrchestrationManifestConstants } from "./assistantWorkspaceOrchestrationManifest.constants.ts";
import { AssistantWorkspaceOrchestrationManifestInventory } from "./assistantWorkspaceOrchestrationManifest.inventory.ts";

export const AssistantWorkspaceOrchestrationManifestMetadata = Object.freeze({
  manifestIdentifier:
    AssistantWorkspaceOrchestrationManifestConstants.manifestIdentifier,
  canonicalName: "Assistant Workspace Orchestration Manifest",
  description:
    "Canonical publication of validated Workspace Orchestration metadata.",
  namespace: AssistantWorkspaceOrchestrationManifestConstants.namespace,
  version: AssistantWorkspaceOrchestrationManifestConstants.version,
  status: AssistantWorkspaceOrchestrationManifestConstants.status,
  releaseTarget: "Assistant Workspace Orchestration Platform",
  readiness: AssistantWorkspaceOrchestrationManifestConstants.readiness,
  publishedInventoryCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .validationRuleCount,
  validationGateCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .validationGateCount,
  source: AssistantWorkspaceOrchestrationManifestInventory.source,
  boundaries: Object.freeze([
    "Runtime", "Workspace Execution", "Workspace Routing",
    "Workspace Switching", "Orchestration Engine", "Workflow Execution",
    "Scheduling", "Recommendation Generation", "Decision Generation",
    "LLM Integration", "Prompt Execution", "AI Reasoning", "Runtime Layer",
    "SDK", "Database", "API Endpoints", "Queue", "Event Bus", "Networking",
    "UI", "Rendering", "Authentication", "Authorization", "Logging",
    "Monitoring",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
