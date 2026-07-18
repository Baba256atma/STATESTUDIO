/**
 * DKL-2:2 — Knowledge Type Registry.
 *
 * The canonical, immutable registry of every approved DKL-2:1 knowledge
 * category. Each category is represented exactly once. Entries are metadata
 * declarations only — no Business Object models are defined and no runtime
 * entity instances are created.
 *
 * Responsibility: publish the authoritative knowledge-type registry + lookup.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on DKL-2:2 registry types and the DKL-2:1
 * public foundation metadata.
 * Architectural purpose: answer "which knowledge domains does Nexora recognize?".
 */

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  contentTypeId,
  createRegistryIdentity,
  knowledgeTypeId,
  REGISTRY_OWNER,
  sourceGroupId,
  type ContentDefinitionKey,
  type KnowledgeCategoryKey,
  type KnowledgeTypeRegistryContainer,
  type KnowledgeTypeRegistryEntry,
  type SourceGroupKey,
} from "./dataSourceRegistryTypes.ts";

interface KnowledgeConfig {
  readonly groups: readonly SourceGroupKey[];
  readonly contentTypes: readonly ContentDefinitionKey[];
  readonly directional: boolean;
  readonly symmetric: boolean;
}

const ALL_GROUPS: readonly SourceGroupKey[] = Object.freeze([
  "operational-systems",
  "analytical-systems",
  "business-applications",
  "documents-and-files",
  "communication-channels",
  "developer-interfaces",
  "manual-sources",
  "external-knowledge-sources",
]);

const DEFAULT_CONFIG: KnowledgeConfig = Object.freeze({
  groups: ALL_GROUPS,
  contentTypes: Object.freeze(["structured-payload", "document"] as const),
  directional: true,
  symmetric: false,
});

const CONFIG: Readonly<Record<KnowledgeCategoryKey, KnowledgeConfig>> = Object.freeze({
  customer: { groups: ["business-applications", "communication-channels"], contentTypes: ["structured-payload", "message"], directional: true, symmetric: false },
  organization: { groups: ["business-applications", "external-knowledge-sources"], contentTypes: ["structured-payload", "document"], directional: true, symmetric: false },
  employee: { groups: ["business-applications", "operational-systems"], contentTypes: ["structured-payload", "tabular"], directional: true, symmetric: false },
  project: { groups: ["business-applications", "developer-interfaces"], contentTypes: ["structured-payload", "document"], directional: true, symmetric: false },
  task: { groups: ["business-applications", "communication-channels"], contentTypes: ["structured-payload", "message"], directional: true, symmetric: false },
  meeting: { groups: ["communication-channels", "documents-and-files"], contentTypes: ["audio-transcript", "document"], directional: true, symmetric: false },
  decision: { groups: ["communication-channels", "documents-and-files"], contentTypes: ["document", "message"], directional: true, symmetric: false },
  goal: { groups: ["business-applications", "documents-and-files"], contentTypes: ["document", "structured-payload"], directional: true, symmetric: false },
  strategy: { groups: ["documents-and-files", "external-knowledge-sources"], contentTypes: ["document"], directional: true, symmetric: false },
  kpi: { groups: ["analytical-systems", "business-applications"], contentTypes: ["tabular", "structured-payload"], directional: true, symmetric: false },
  okr: { groups: ["business-applications", "documents-and-files"], contentTypes: ["structured-payload", "document"], directional: true, symmetric: false },
  risk: { groups: ["documents-and-files", "communication-channels"], contentTypes: ["document", "message"], directional: true, symmetric: false },
  opportunity: { groups: ["business-applications", "communication-channels"], contentTypes: ["structured-payload", "message"], directional: true, symmetric: false },
  product: { groups: ["business-applications", "operational-systems"], contentTypes: ["structured-payload", "tabular"], directional: true, symmetric: false },
  service: { groups: ["business-applications", "operational-systems"], contentTypes: ["structured-payload", "tabular"], directional: true, symmetric: false },
  contract: { groups: ["documents-and-files", "business-applications"], contentTypes: ["document"], directional: true, symmetric: false },
  invoice: { groups: ["business-applications", "documents-and-files"], contentTypes: ["structured-payload", "document"], directional: true, symmetric: false },
  purchase: { groups: ["business-applications", "operational-systems"], contentTypes: ["structured-payload", "tabular"], directional: true, symmetric: false },
  revenue: { groups: ["analytical-systems", "business-applications"], contentTypes: ["tabular", "structured-payload"], directional: true, symmetric: false },
  cost: { groups: ["analytical-systems", "business-applications"], contentTypes: ["tabular", "structured-payload"], directional: true, symmetric: false },
  document: { groups: ["documents-and-files", "external-knowledge-sources"], contentTypes: ["document", "binary-attachment"], directional: false, symmetric: true },
  conversation: { groups: ["communication-channels"], contentTypes: ["message", "audio-transcript"], directional: false, symmetric: true },
  event: { groups: ["operational-systems", "communication-channels"], contentTypes: ["structured-payload", "message"], directional: true, symmetric: false },
});

const knowledgeEntry = (
  category: (typeof DataSourceKnowledgeRegistryMetadata.knowledgeCategories)[number]
): KnowledgeTypeRegistryEntry => {
  const key = category.key;
  const config = CONFIG[key] ?? DEFAULT_CONFIG;
  return Object.freeze({
    identity: createRegistryIdentity({
      id: knowledgeTypeId(key),
      name: category.name,
      description: category.description,
      kind: "KnowledgeType",
      category: key,
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["knowledge-type", key]),
    }),
    knowledgeCategory: key,
    owningPlatform: "DKL Data Knowledge Foundation",
    allowedSourceGroupIds: Object.freeze(config.groups.map(sourceGroupId)),
    supportedContentTypeIds: Object.freeze(config.contentTypes.map(contentTypeId)),
    relationshipCapability: Object.freeze({
      canRelate: true,
      directional: config.directional,
      symmetric: config.symmetric,
    }),
    metadataOnly: true,
    immutable: true,
  } as const satisfies KnowledgeTypeRegistryEntry);
};

const knowledgeEntries: readonly KnowledgeTypeRegistryEntry[] = Object.freeze(
  DataSourceKnowledgeRegistryMetadata.knowledgeCategories.map(knowledgeEntry)
);

export const KnowledgeTypeRegistry: KnowledgeTypeRegistryContainer = Object.freeze({
  kind: "KnowledgeType",
  entries: knowledgeEntries,
  getById: (id: string): KnowledgeTypeRegistryEntry | undefined =>
    knowledgeEntries.find((entry) => entry.identity.registryEntryId === id),
});
