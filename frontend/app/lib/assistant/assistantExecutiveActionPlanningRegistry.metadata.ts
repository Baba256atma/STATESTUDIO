/** ASSISTANT-7:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantExecutiveActionPlanningFoundation } from "./assistantExecutiveActionPlanningFoundation.ts";
import { AssistantExecutiveActionPlanningRegistryCollections } from "./assistantExecutiveActionPlanningRegistry.collections.ts";
import { AssistantExecutiveActionPlanningRegistryEntries } from "./assistantExecutiveActionPlanningRegistry.entries.ts";

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
  Object.keys(AssistantExecutiveActionPlanningRegistryCollections),
);

export const AssistantExecutiveActionPlanningRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantExecutiveActionPlanningFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-7:1 Executive Action Planning Foundation",
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
    entryCount: AssistantExecutiveActionPlanningRegistryEntries.length,
    categoryCount: new Set(
      AssistantExecutiveActionPlanningRegistryEntries.map(
        ({ category }) => category,
      ),
    ).size,
    metadataCount: entryMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime", "Planning Engine", "Action Generation", "Task Execution",
    "Scheduling", "Assignment", "Workflow Execution", "Automation",
    "Object Creation", "Object Mutation", "Object Persistence",
    "Context Persistence", "Recommendation Generation",
    "Decision Generation", "LLM Integration", "Prompt Execution",
    "AI Reasoning", "Runtime Layer", "SDK", "Database", "API Endpoints",
    "Queue", "Event Bus", "Networking", "UI", "Rendering",
    "Authentication", "Authorization", "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-7:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
