/** ASSISTANT-4:3 — Canonical immutable domain models and structural metadata. */
import { AssistantExecutiveGuidanceRegistry } from "./assistantExecutiveGuidanceRegistry.ts";
import { AssistantExecutiveGuidanceModelLifecycle } from "./assistantExecutiveGuidanceModel.lifecycle.ts";
import { AssistantExecutiveGuidanceModelRelationships } from "./assistantExecutiveGuidanceModel.relationships.ts";
import type { AssistantExecutiveGuidanceDomainModelMetadata } from "./assistantExecutiveGuidanceModel.types.ts";

const names = Object.freeze([
  "Executive Guidance",
  "Guidance Identity",
  "Guidance Session",
  "Guidance Context",
  "Guidance Objective",
  "Guidance Strategy",
  "Guidance Path",
  "Guidance Step",
  "Guidance Milestone",
  "Guidance Recommendation",
  "Guidance Priority",
  "Guidance Outcome",
  "Guidance State",
  "Guidance Transition",
  "Guidance Policy",
  "Guidance Capability",
  "Guidance Boundary",
  "Guidance Lifecycle",
  "Guidance Summary",
  "Guidance Metadata",
] as const);

const domainModelMetadataFields = Object.freeze([
  "identifier",
  "canonicalName",
  "description",
  "category",
  "parentModel",
  "childModels",
  "relationshipReferences",
  "lifecycleReference",
  "version",
  "status",
  "tags",
] as const);

export const AssistantExecutiveGuidanceDomainModels:
readonly AssistantExecutiveGuidanceDomainModelMetadata[] = Object.freeze(
  names.map((canonicalName, index) => {
    const identifier =
      `ASSISTANT-4:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
    return Object.freeze({
      identifier,
      canonicalName,
      description: `Canonical structural metadata for ${canonicalName}.`,
      category: "Executive Guidance Domain Model",
      parentModel: index === 0 ? null : "ASSISTANT-4:3/DomainModel/01",
      childModels: index === 0
        ? Object.freeze(names.slice(1).map((_, childIndex) =>
          `ASSISTANT-4:3/DomainModel/${
            String(childIndex + 2).padStart(2, "0")
          }`))
        : Object.freeze([]),
      relationshipReferences: Object.freeze(
        AssistantExecutiveGuidanceModelRelationships
          .filter(({ source, target }) =>
            canonicalName === source || canonicalName === target)
          .map(({ identifier: relationshipId }) => relationshipId),
      ),
      lifecycleReference: "ASSISTANT-4:3/Lifecycle",
      registryReference: AssistantExecutiveGuidanceRegistry.identity.id,
      version: "1.0.0",
      status: "Canonical",
      tags: Object.freeze(["assistant", "executive-guidance", "model"]),
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const AssistantExecutiveGuidanceModelStructuralMetadata = Object.freeze({
  rules: Object.freeze([
    "Consume Registry Identities Only",
    "Preserve Immutable Identities",
    "Define Explicit Relationships",
    "Expose Deterministic Structures",
    "Remain Implementation Free",
    "Contain No Executable Behaviour",
  ]),
  statistics: Object.freeze({
    domainModelCount: AssistantExecutiveGuidanceDomainModels.length,
    relationshipCount: AssistantExecutiveGuidanceModelRelationships.length,
    lifecycleCount: AssistantExecutiveGuidanceModelLifecycle.length,
    metadataCount: domainModelMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime", "Recommendation Generation", "Coaching Generation",
    "Decision Generation", "Action Planning", "Workflow Execution",
    "LLM Integration", "Prompt Execution", "AI Reasoning",
    "Workspace Orchestration", "Workspace Execution", "Object Creation",
    "Engine Execution", "DKL", "Director", "EVE", "NEA", "Runtime Layer",
    "SDK", "API Endpoints", "Database", "Queue", "Event Bus", "Networking",
    "UI", "Rendering", "Authentication", "Authorization", "Logging",
    "Monitoring",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
