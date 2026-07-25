/** ASSISTANT-2:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantExecutiveMemoryFoundation } from "./assistantExecutiveMemoryFoundation.ts";
import { AssistantExecutiveMemoryRegistryCollections } from "./assistantExecutiveMemoryRegistry.collections.ts";
import { AssistantExecutiveMemoryRegistryEntries } from "./assistantExecutiveMemoryRegistry.entries.ts";

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
  Object.keys(AssistantExecutiveMemoryRegistryCollections),
);

export const AssistantExecutiveMemoryRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantExecutiveMemoryFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-2:1 Executive Memory Foundation",
  ]),
  rules: Object.freeze([
    "Define Canonical Vocabularies",
    "Contain Immutable Entries",
    "Provide Stable Identifiers",
    "Preserve Deterministic Ordering",
    "Support Downstream Model Construction",
    "Expose Lookup Metadata Only",
    "Avoid Implementation Logic",
  ]),
  statistics: Object.freeze({
    collectionCount: categories.length,
    entryCount: AssistantExecutiveMemoryRegistryEntries.length,
    categoryCount: new Set(
      AssistantExecutiveMemoryRegistryEntries.map(({ category }) => category),
    ).size,
    metadataCount: entryMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime Memory", "Memory Persistence", "Database", "Vector Database",
    "Embeddings", "Semantic Search", "Memory Retrieval", "Context Injection",
    "Prompt Execution", "LLM Integration", "AI Reasoning",
    "Workspace Execution", "Object Creation", "Engine Execution", "Director",
    "DKL", "EVE", "NEA", "Runtime Layer", "SDK", "API Endpoints", "Queue",
    "Event Bus", "Networking", "UI", "Rendering", "Authentication",
    "Authorization", "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-2:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
