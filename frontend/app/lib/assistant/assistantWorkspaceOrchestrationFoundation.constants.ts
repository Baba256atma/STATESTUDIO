/** ASSISTANT-5:1 — Immutable constants, vocabulary, categories, and concepts. */
import type {
  AssistantWorkspaceOrchestrationCategoryMetadata,
  AssistantWorkspaceOrchestrationConceptMetadata,
} from "./assistantWorkspaceOrchestrationFoundation.types.ts";

export const AssistantWorkspaceOrchestrationFoundationConstants =
  Object.freeze({
    phaseIdentifier: "ASSISTANT-5:1",
    namespace: "nexora.assistant.workspace-orchestration.foundation",
    version: "1.0.0",
    readiness: "ReadyForRegistry",
    foundationStatus: "Foundation",
    canonicalIdentity: "ASSISTANT-5:1/WorkspaceOrchestrationFoundation",
  } as const);

export const AssistantWorkspaceOrchestrationResponsibilities = Object.freeze([
  "Workspace Orchestration",
  "Workspace Identity",
  "Workspace Session",
  "Workspace Context",
  "Workspace Transition",
  "Workspace Selection",
  "Workspace Coordination",
  "Workspace Policy",
  "Workspace Boundary",
  "Workspace Capability",
  "Workspace Lifecycle",
  "Workspace Metadata",
] as const);

const workspaceCategoryNames = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "Problem Workspace",
  "Decision Workspace",
  "Scenario Workspace",
  "Strategy Workspace",
  "KPI Workspace",
  "Risk Workspace",
  "Operations Workspace",
  "Knowledge Workspace",
  "Timeline Workspace",
  "War Room Workspace",
] as const);

export const AssistantWorkspaceOrchestrationCategories:
readonly AssistantWorkspaceOrchestrationCategoryMetadata[] = Object.freeze(
  workspaceCategoryNames.map((name, index) => Object.freeze({
    id:
      `ASSISTANT-5:1/WorkspaceCategory/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const workspaceConceptNames = Object.freeze([
  "Workspace Session",
  "Workspace State",
  "Workspace Transition",
  "Workspace Activation",
  "Workspace Focus",
  "Workspace Flow",
  "Workspace Collaboration",
  "Workspace Summary",
] as const);

export const AssistantWorkspaceOrchestrationConcepts:
readonly AssistantWorkspaceOrchestrationConceptMetadata[] = Object.freeze(
  workspaceConceptNames.map((name, index) => Object.freeze({
    id:
      `ASSISTANT-5:1/WorkspaceConcept/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    descriptiveOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
