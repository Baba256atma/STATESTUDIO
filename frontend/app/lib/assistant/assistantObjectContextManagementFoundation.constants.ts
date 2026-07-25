/** ASSISTANT-6:1 — Immutable constants, vocabulary, categories, and concepts. */
import type {
  AssistantObjectContextManagementCategoryMetadata,
  AssistantObjectContextManagementConceptMetadata,
} from "./assistantObjectContextManagementFoundation.types.ts";

export const AssistantObjectContextManagementFoundationConstants =
  Object.freeze({
    phaseIdentifier: "ASSISTANT-6:1",
    namespace: "nexora.assistant.object-context-management.foundation",
    version: "1.0.0",
    readiness: "ReadyForRegistry",
    foundationStatus: "Foundation",
    canonicalIdentity: "ASSISTANT-6:1/ObjectContextManagementFoundation",
  } as const);

export const AssistantObjectContextManagementResponsibilities = Object.freeze([
  "Object Context Management",
  "Executive Object",
  "Object Identity",
  "Object Context",
  "Context Scope",
  "Context Session",
  "Context Relationship",
  "Object Reference",
  "Object Lifecycle",
  "Context Boundary",
  "Context Capability",
  "Context Metadata",
] as const);

const objectCategoryNames = Object.freeze([
  "Goal Object",
  "Problem Object",
  "Decision Object",
  "Scenario Object",
  "KPI Object",
  "Risk Object",
  "Strategy Object",
  "Initiative Object",
  "Task Object",
  "Project Object",
  "Organization Object",
  "Knowledge Object",
] as const);

export const AssistantObjectContextManagementObjectCategories:
readonly AssistantObjectContextManagementCategoryMetadata[] = Object.freeze(
  objectCategoryNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-6:1/ObjectCategory/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const contextCategoryNames = Object.freeze([
  "Conversation Context",
  "Executive Context",
  "Business Context",
  "Workspace Context",
  "Temporal Context",
  "Organizational Context",
  "Strategic Context",
  "Operational Context",
  "Analytical Context",
  "External Context",
] as const);

export const AssistantObjectContextManagementContextCategories:
readonly AssistantObjectContextManagementCategoryMetadata[] = Object.freeze(
  contextCategoryNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-6:1/ContextCategory/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const objectConceptNames = Object.freeze([
  "Executive Object",
  "Object Reference",
  "Context Snapshot",
  "Context Timeline",
  "Context State",
  "Context Transition",
  "Context Summary",
  "Context Scope",
] as const);

export const AssistantObjectContextManagementConcepts:
readonly AssistantObjectContextManagementConceptMetadata[] = Object.freeze(
  objectConceptNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-6:1/ObjectConcept/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    descriptiveOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
