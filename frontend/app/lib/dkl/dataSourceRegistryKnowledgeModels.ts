/**
 * DKL-2:3 — Knowledge Models.
 *
 * Canonical, immutable metadata models describing each registered knowledge
 * type. Every model is derived deterministically from a DKL-2:2 knowledge-type
 * registry entry by reference. Metadata only — no business objects are created.
 *
 * Responsibility: publish the knowledge models + lookup.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:2 public registry platform and
 * DKL-2:3 model types.
 * Architectural purpose: answer "what is the metadata model of a knowledge type?".
 */

import { KnowledgeTypeRegistry } from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  createModelIdentity,
  modelIdFor,
  type KnowledgeModel,
  type KnowledgeModelsContainer,
} from "./dataSourceRegistryModelTypes.ts";

const knowledgeModel = (
  entry: (typeof KnowledgeTypeRegistry.entries)[number]
): KnowledgeModel =>
  Object.freeze({
    identity: createModelIdentity({
      id: modelIdFor(entry.identity.registryEntryId),
      name: `${entry.identity.registryEntryName} Model`,
      category: "knowledge",
      tags: Object.freeze(["knowledge-model", entry.knowledgeCategory]),
    }),
    registryEntryId: entry.identity.registryEntryId,
    semanticCategory: entry.knowledgeCategory,
    businessPurpose: entry.identity.registryEntryDescription,
    relationshipCapability: Object.freeze({
      canRelate: entry.relationshipCapability.canRelate,
      directional: entry.relationshipCapability.directional,
      symmetric: entry.relationshipCapability.symmetric,
    }),
    supportedSourceGroupIds: entry.allowedSourceGroupIds,
    supportedContentCategoryIds: entry.supportedContentTypeIds,
    metadataOnly: true,
    immutable: true,
  } as const satisfies KnowledgeModel);

const knowledgeModelEntries: readonly KnowledgeModel[] = Object.freeze(
  KnowledgeTypeRegistry.entries.map(knowledgeModel)
);

export const KnowledgeModels: KnowledgeModelsContainer = Object.freeze({
  kind: "KnowledgeModels",
  models: knowledgeModelEntries,
  getById: (id: string): KnowledgeModel | undefined =>
    knowledgeModelEntries.find((model) => model.identity.id === id),
});
