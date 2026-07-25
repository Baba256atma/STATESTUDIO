/** ASSISTANT-3:1 — Immutable Intent & Dialogue Understanding Foundation. */
import { assistantExecutiveMemoryPublicIndexIdentity } from "./assistantExecutiveMemoryPublicIndex.ts";
import { AssistantIntentDialogueFoundationBoundaries } from "./assistantIntentDialogueFoundation.boundaries.ts";
import { AssistantIntentDialogueFoundationCapabilities } from "./assistantIntentDialogueFoundation.capabilities.ts";
import {
  AssistantIntentDialogueConcepts,
  AssistantIntentDialogueFoundationConstants,
  AssistantIntentDialogueIntentCategories,
  AssistantIntentDialogueResponsibilities,
} from "./assistantIntentDialogueFoundation.constants.ts";
import { AssistantIntentDialogueFoundationContracts } from "./assistantIntentDialogueFoundation.contracts.ts";
import { AssistantIntentDialogueFoundationIdentity } from "./assistantIntentDialogueFoundation.identity.ts";

export const AssistantIntentDialogueFoundation = Object.freeze({
  identity: AssistantIntentDialogueFoundationIdentity,
  constants: AssistantIntentDialogueFoundationConstants,
  executiveMemoryPublicIndex: assistantExecutiveMemoryPublicIndexIdentity,
  architecturalPosition: Object.freeze([
    "Manager",
    "Conversation",
    "Executive Memory",
    "Intent & Dialogue Understanding Foundation",
  ]),
  responsibilities: AssistantIntentDialogueResponsibilities,
  contracts: AssistantIntentDialogueFoundationContracts,
  capabilities: AssistantIntentDialogueFoundationCapabilities,
  intentCategories: AssistantIntentDialogueIntentCategories,
  dialogueConcepts: AssistantIntentDialogueConcepts,
  boundaries: AssistantIntentDialogueFoundationBoundaries,
  inventory: Object.freeze({
    responsibilityCount: AssistantIntentDialogueResponsibilities.length,
    contractCount: AssistantIntentDialogueFoundationContracts.length,
    capabilityCount: AssistantIntentDialogueFoundationCapabilities.length,
    intentCategoryCount: AssistantIntentDialogueIntentCategories.length,
    dialogueConceptCount: AssistantIntentDialogueConcepts.length,
    boundaryCount: AssistantIntentDialogueFoundationBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-2:9 Executive Memory Public Index",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueFoundation"]),
  status: "Foundation",
  readiness: "ReadyForRegistry",
  nextPhase: "ASSISTANT-3:2 — Intent & Dialogue Understanding Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  intentClassification: false,
  nlp: false,
  naturalLanguageParsing: false,
  llmIntegration: false,
  promptExecution: false,
  dialogueExecution: false,
  aiReasoning: false,
  orchestration: false,
  networking: false,
  persistence: false,
  uiRendering: false,
  sdk: false,
  stateMutation: false,
} as const);
