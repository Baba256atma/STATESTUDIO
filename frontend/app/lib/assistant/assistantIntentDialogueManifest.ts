/** ASSISTANT-3:5 — Canonical Intent & Dialogue Understanding Manifest. */
import { AssistantIntentDialogueValidation } from "./assistantIntentDialogueValidation.ts";
import { AssistantIntentDialogueManifestConstants } from "./assistantIntentDialogueManifest.constants.ts";
import { AssistantIntentDialogueManifestIdentity } from "./assistantIntentDialogueManifest.identity.ts";
import { AssistantIntentDialogueManifestInventory } from "./assistantIntentDialogueManifest.inventory.ts";
import { AssistantIntentDialogueManifestMetadata } from "./assistantIntentDialogueManifest.metadata.ts";
import { AssistantIntentDialogueManifestSummary } from "./assistantIntentDialogueManifest.summary.ts";

export const AssistantIntentDialogueManifest = Object.freeze({
  identity: AssistantIntentDialogueManifestIdentity,
  validation: AssistantIntentDialogueValidation,
  constants: AssistantIntentDialogueManifestConstants,
  inventory: AssistantIntentDialogueManifestInventory,
  summary: AssistantIntentDialogueManifestSummary,
  metadata: AssistantIntentDialogueManifestMetadata,
  compatibility:
    AssistantIntentDialogueManifestInventory.compatibilityInventory,
  readiness: AssistantIntentDialogueManifestInventory.readinessInventory,
  statistics: Object.freeze({
    publishedInventoryCount:
      AssistantIntentDialogueManifestConstants.inventoryTotals
        .publishedInventoryCount,
    validationRuleCount:
      AssistantIntentDialogueManifestConstants.inventoryTotals
        .validationRuleCount,
    validationGateCount:
      AssistantIntentDialogueManifestConstants.inventoryTotals
        .validationGateCount,
    compatibilityCount: 4,
    readinessStatus:
      AssistantIntentDialogueManifestInventory.readinessInventory.readiness,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-3:4 Intent & Dialogue Understanding Validation",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueManifest"]),
  status: "Manifest",
  readinessStatus: "ReadyForPlatform",
  nextPhase: "ASSISTANT-3:6 — Intent & Dialogue Understanding Platform",
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  executableLogic: false,
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
} as const);
