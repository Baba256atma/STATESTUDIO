/** ASSISTANT-4:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantExecutiveGuidanceFoundation } from "./assistantExecutiveGuidanceFoundation.ts";
import { AssistantExecutiveGuidanceRegistryCollections } from "./assistantExecutiveGuidanceRegistry.collections.ts";
import { AssistantExecutiveGuidanceRegistryEntries } from "./assistantExecutiveGuidanceRegistry.entries.ts";

const entryMetadataFields = Object.freeze([
  "identifier",
  "name",
  "description",
  "category",
  "version",
  "lifecycle",
  "status",
  "tags",
] as const);

const categories = Object.freeze(
  Object.keys(AssistantExecutiveGuidanceRegistryCollections),
);

export const AssistantExecutiveGuidanceRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantExecutiveGuidanceFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-4:1 Executive Guidance Foundation",
  ]),
  rules: Object.freeze([
    "Define Canonical Vocabularies",
    "Publish Immutable Registry Entries",
    "Preserve Stable Identities",
    "Expose Deterministic Ordering",
    "Provide Lookup Metadata Only",
    "Remain Implementation Free",
  ]),
  statistics: Object.freeze({
    collectionCount: categories.length,
    entryCount: AssistantExecutiveGuidanceRegistryEntries.length,
    categoryCount: new Set(
      AssistantExecutiveGuidanceRegistryEntries.map(({ category }) => category),
    ).size,
    metadataCount: entryMetadataFields.length,
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
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-4:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
