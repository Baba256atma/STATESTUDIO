/** ASSISTANT-3:3 — Canonical immutable domain models and structural metadata. */
import { AssistantIntentDialogueRegistry } from "./assistantIntentDialogueRegistry.ts";
import { AssistantIntentDialogueModelLifecycle } from "./assistantIntentDialogueModel.lifecycle.ts";
import { AssistantIntentDialogueModelRelationships } from "./assistantIntentDialogueModel.relationships.ts";
import type { AssistantIntentDialogueDomainModelMetadata } from "./assistantIntentDialogueModel.types.ts";

const names = Object.freeze([
  "Executive Intent",
  "Intent Identity",
  "Intent Category",
  "Intent Priority",
  "Intent Outcome",
  "Dialogue Session",
  "Dialogue Context",
  "Dialogue Turn",
  "Dialogue Flow",
  "Dialogue State",
  "Dialogue Transition",
  "Dialogue Objective",
  "Dialogue Summary",
  "Clarification Request",
  "Clarification Response",
  "Dialogue Policy",
  "Dialogue Capability",
  "Dialogue Boundary",
  "Dialogue Lifecycle",
  "Dialogue Metadata",
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

export const AssistantIntentDialogueDomainModels:
readonly AssistantIntentDialogueDomainModelMetadata[] = Object.freeze(
  names.map((canonicalName, index) => {
    const identifier =
      `ASSISTANT-3:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
    return Object.freeze({
      identifier,
      canonicalName,
      description: `Canonical structural metadata for ${canonicalName}.`,
      category: "Intent & Dialogue Domain Model",
      parentModel: index === 0 ? null : "ASSISTANT-3:3/DomainModel/01",
      childModels: index === 0
        ? Object.freeze(names.slice(1).map((_, childIndex) =>
          `ASSISTANT-3:3/DomainModel/${
            String(childIndex + 2).padStart(2, "0")
          }`))
        : Object.freeze([]),
      relationshipReferences: Object.freeze(
        AssistantIntentDialogueModelRelationships
          .filter(({ source, target }) =>
            canonicalName === source || canonicalName === target)
          .map(({ identifier: relationshipId }) => relationshipId),
      ),
      lifecycleReference: "ASSISTANT-3:3/Lifecycle",
      registryReference: AssistantIntentDialogueRegistry.identity.id,
      version: "1.0.0",
      status: "Canonical",
      tags: Object.freeze(["assistant", "intent-dialogue", "model"]),
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const AssistantIntentDialogueModelStructuralMetadata = Object.freeze({
  rules: Object.freeze([
    "Consume Registry Identities Only",
    "Preserve Immutable Identities",
    "Define Explicit Relationships",
    "Expose Deterministic Structures",
    "Remain Implementation Free",
    "Contain No Executable Behaviour",
  ]),
  statistics: Object.freeze({
    domainModelCount: AssistantIntentDialogueDomainModels.length,
    relationshipCount: AssistantIntentDialogueModelRelationships.length,
    lifecycleCount: AssistantIntentDialogueModelLifecycle.length,
    metadataCount: domainModelMetadataFields.length,
  }),
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
