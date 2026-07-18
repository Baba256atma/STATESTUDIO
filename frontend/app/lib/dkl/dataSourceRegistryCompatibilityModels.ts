/**
 * DKL-2:3 — Compatibility Models.
 *
 * Canonical, immutable metadata models describing architectural source-to-
 * knowledge compatibility relationships. Every model is derived deterministically
 * from a DKL-2:2 compatibility registry entry by reference. Metadata only — no
 * runtime scoring is performed.
 *
 * Responsibility: publish the compatibility models + lookup.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:2 public registry platform and
 * DKL-2:3 model types.
 * Architectural purpose: answer "what is the metadata model of a compatibility?".
 */

import { SourceKnowledgeCompatibilityRegistry } from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  createModelIdentity,
  modelIdFor,
  type CompatibilityModel,
  type CompatibilityModelsContainer,
} from "./dataSourceRegistryModelTypes.ts";

const compatibilityModel = (
  entry: (typeof SourceKnowledgeCompatibilityRegistry.entries)[number]
): CompatibilityModel =>
  Object.freeze({
    identity: createModelIdentity({
      id: modelIdFor(entry.identity.registryEntryId),
      name: `${entry.identity.registryEntryName} Model`,
      category: "compatibility",
      tags: Object.freeze(["compatibility-model", entry.identity.category]),
    }),
    registryEntryId: entry.identity.registryEntryId,
    sourceCategoryId: entry.sourceCategoryId,
    knowledgeCategoryId: entry.knowledgeCategoryId,
    compatibilityCategory: entry.compatibilityType,
    architecturalConfidence: entry.confidence,
    relationshipType: "source-provides-knowledge",
    rationale: entry.rationale,
    metadataOnly: true,
    immutable: true,
  } as const satisfies CompatibilityModel);

const compatibilityModelEntries: readonly CompatibilityModel[] = Object.freeze(
  SourceKnowledgeCompatibilityRegistry.entries.map(compatibilityModel)
);

export const CompatibilityModels: CompatibilityModelsContainer = Object.freeze({
  kind: "CompatibilityModels",
  models: compatibilityModelEntries,
  getById: (id: string): CompatibilityModel | undefined =>
    compatibilityModelEntries.find((model) => model.identity.id === id),
});
