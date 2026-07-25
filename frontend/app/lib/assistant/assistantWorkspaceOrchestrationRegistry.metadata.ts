/** ASSISTANT-5:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantWorkspaceOrchestrationFoundation } from "./assistantWorkspaceOrchestrationFoundation.ts";
import { AssistantWorkspaceOrchestrationRegistryCollections } from "./assistantWorkspaceOrchestrationRegistry.collections.ts";
import { AssistantWorkspaceOrchestrationRegistryEntries } from "./assistantWorkspaceOrchestrationRegistry.entries.ts";

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
  Object.keys(AssistantWorkspaceOrchestrationRegistryCollections),
);

export const AssistantWorkspaceOrchestrationRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantWorkspaceOrchestrationFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-5:1 Workspace Orchestration Foundation",
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
    entryCount: AssistantWorkspaceOrchestrationRegistryEntries.length,
    categoryCount: new Set(
      AssistantWorkspaceOrchestrationRegistryEntries.map(
        ({ category }) => category,
      ),
    ).size,
    metadataCount: entryMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime", "Workspace Execution", "Workspace Routing",
    "Workflow Execution", "Scheduling", "Recommendation Generation",
    "Decision Generation", "LLM Integration", "Prompt Execution",
    "AI Reasoning", "Runtime Layer", "SDK", "API Endpoints", "Database",
    "Queue", "Event Bus", "Networking", "UI", "Rendering", "Authentication",
    "Authorization", "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-5:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
