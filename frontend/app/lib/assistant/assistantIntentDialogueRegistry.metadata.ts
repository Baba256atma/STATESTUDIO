/** ASSISTANT-3:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantIntentDialogueFoundation } from "./assistantIntentDialogueFoundation.ts";
import { AssistantIntentDialogueRegistryCollections } from "./assistantIntentDialogueRegistry.collections.ts";
import { AssistantIntentDialogueRegistryEntries } from "./assistantIntentDialogueRegistry.entries.ts";

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
  Object.keys(AssistantIntentDialogueRegistryCollections),
);

export const AssistantIntentDialogueRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantIntentDialogueFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-3:1 Intent & Dialogue Understanding Foundation",
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
    entryCount: AssistantIntentDialogueRegistryEntries.length,
    categoryCount: new Set(
      AssistantIntentDialogueRegistryEntries.map(({ category }) => category),
    ).size,
    metadataCount: entryMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime", "Intent Classification", "NLP", "Natural Language Parsing",
    "LLM Integration", "Prompt Execution", "AI Reasoning",
    "Conversation Execution", "Executive Memory Persistence",
    "Workspace Orchestration", "Workspace Execution", "Object Creation",
    "Recommendation Generation", "Decision Making", "Engine Execution",
    "DKL", "Director", "EVE", "NEA", "Runtime Layer", "SDK", "API Endpoints",
    "Database", "Queue", "Event Bus", "Networking", "UI", "Rendering",
    "Authentication", "Authorization", "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-3:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
