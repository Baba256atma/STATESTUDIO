/** ASSISTANT-4:1 — Immutable constants, vocabulary, categories, and concepts. */
import type {
  AssistantExecutiveGuidanceCategoryMetadata,
  AssistantExecutiveGuidanceConceptMetadata,
} from "./assistantExecutiveGuidanceFoundation.types.ts";

export const AssistantExecutiveGuidanceFoundationConstants = Object.freeze({
  phaseIdentifier: "ASSISTANT-4:1",
  namespace: "nexora.assistant.executive-guidance.foundation",
  version: "1.0.0",
  readiness: "ReadyForRegistry",
  foundationStatus: "Foundation",
  canonicalIdentity: "ASSISTANT-4:1/ExecutiveGuidanceFoundation",
} as const);

export const AssistantExecutiveGuidanceResponsibilities = Object.freeze([
  "Executive Guidance",
  "Guidance Identity",
  "Guidance Session",
  "Guidance Context",
  "Guidance Objective",
  "Guidance Strategy",
  "Guidance Path",
  "Guidance Policy",
  "Guidance Boundary",
  "Guidance Capability",
  "Guidance Lifecycle",
  "Guidance Outcome",
] as const);

const guidanceCategoryNames = Object.freeze([
  "Strategic Guidance",
  "Operational Guidance",
  "Tactical Guidance",
  "Analytical Guidance",
  "Planning Guidance",
  "Decision Guidance",
  "Risk Guidance",
  "Opportunity Guidance",
  "Review Guidance",
  "Monitoring Guidance",
  "Educational Guidance",
  "Executive Coaching",
] as const);

export const AssistantExecutiveGuidanceCategories:
readonly AssistantExecutiveGuidanceCategoryMetadata[] = Object.freeze(
  guidanceCategoryNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:1/GuidanceCategory/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const guidanceConceptNames = Object.freeze([
  "Guidance Session",
  "Guidance Step",
  "Guidance Milestone",
  "Guidance Flow",
  "Guidance Transition",
  "Guidance Recommendation",
  "Guidance Summary",
  "Guidance Objective",
] as const);

export const AssistantExecutiveGuidanceConcepts:
readonly AssistantExecutiveGuidanceConceptMetadata[] = Object.freeze(
  guidanceConceptNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:1/GuidanceConcept/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    descriptiveOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
