/** ASSISTANT-6:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantObjectContextManagementFoundation } from "./assistantObjectContextManagementFoundation.ts";
import { AssistantObjectContextManagementRegistryCollections } from "./assistantObjectContextManagementRegistry.collections.ts";
import { AssistantObjectContextManagementRegistryEntries } from "./assistantObjectContextManagementRegistry.entries.ts";

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
  Object.keys(AssistantObjectContextManagementRegistryCollections),
);

export const AssistantObjectContextManagementRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantObjectContextManagementFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-6:1 Object & Context Management Foundation",
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
    entryCount: AssistantObjectContextManagementRegistryEntries.length,
    categoryCount: new Set(
      AssistantObjectContextManagementRegistryEntries.map(
        ({ category }) => category,
      ),
    ).size,
    metadataCount: entryMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime", "Object Creation", "Object Persistence",
    "Context Persistence", "Context Synchronization", "Workflow Execution",
    "Recommendation Generation", "Decision Generation", "LLM Integration",
    "Prompt Execution", "AI Reasoning", "Runtime Layer", "SDK", "Database",
    "API Endpoints", "Queue", "Event Bus", "Networking", "UI", "Rendering",
    "Authentication", "Authorization", "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-6:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
