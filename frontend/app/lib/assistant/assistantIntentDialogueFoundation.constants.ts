/** ASSISTANT-3:1 — Immutable constants, vocabulary, categories, and concepts. */
import type {
  AssistantIntentDialogueCategoryMetadata,
  AssistantIntentDialogueConceptMetadata,
} from "./assistantIntentDialogueFoundation.types.ts";

export const AssistantIntentDialogueFoundationConstants = Object.freeze({
  phaseIdentifier: "ASSISTANT-3:1",
  namespace: "nexora.assistant.intent-dialogue.foundation",
  version: "1.0.0",
  readiness: "ReadyForRegistry",
  foundationStatus: "Foundation",
  canonicalIdentity: "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation",
} as const);

export const AssistantIntentDialogueResponsibilities = Object.freeze([
  "Executive Intent",
  "Executive Dialogue",
  "Dialogue Context",
  "Dialogue Turn",
  "Intent Identity",
  "Intent Category",
  "Dialogue Flow",
  "Dialogue State",
  "Dialogue Policy",
  "Dialogue Boundary",
  "Dialogue Capability",
  "Dialogue Lifecycle",
] as const);

const intentCategoryNames = Object.freeze([
  "Question",
  "Request",
  "Analysis",
  "Decision",
  "Planning",
  "Comparison",
  "Investigation",
  "Explanation",
  "Review",
  "Guidance",
  "Monitoring",
  "Unknown",
] as const);

export const AssistantIntentDialogueIntentCategories:
readonly AssistantIntentDialogueCategoryMetadata[] = Object.freeze(
  intentCategoryNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:1/IntentCategory/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const dialogueConceptNames = Object.freeze([
  "Dialogue Session",
  "Dialogue Exchange",
  "Dialogue Sequence",
  "Dialogue Transition",
  "Dialogue Context",
  "Dialogue Objective",
  "Dialogue Outcome",
  "Dialogue Summary",
] as const);

export const AssistantIntentDialogueConcepts:
readonly AssistantIntentDialogueConceptMetadata[] = Object.freeze(
  dialogueConceptNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:1/DialogueConcept/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    descriptiveOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
