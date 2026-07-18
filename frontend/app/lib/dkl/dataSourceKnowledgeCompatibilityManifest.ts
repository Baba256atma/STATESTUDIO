/**
 * DKL-2:5 — Compatibility Manifest.
 *
 * Immutable compatibility summary derived from the DKL-2:2 public compatibility
 * registry. It reports aggregate counts and the canonical compatibility
 * semantics. No new relationships are introduced and static confidence is never
 * reinterpreted as runtime confidence.
 *
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: depends only on the DKL-2:2 public registry platform and the
 * DKL-2:5 manifest types.
 */

import { SourceKnowledgeCompatibilityRegistry } from "./dataSourceKnowledgeRegistryPlatform.ts";
import type { CompatibilityManifestDescriptor } from "./dataSourceKnowledgeManifestTypes.ts";

const entries = SourceKnowledgeCompatibilityRegistry.entries;

const sourceCategoriesRepresented = new Set(entries.map((entry) => entry.sourceCategoryId)).size;
const knowledgeCategoriesRepresented = new Set(entries.map((entry) => entry.knowledgeCategoryId)).size;
const compatibilityTypesRepresented = Object.freeze(
  [...new Set(entries.map((entry) => entry.compatibilityType))].sort()
);
const confidenceClassificationsRepresented = Object.freeze(
  [...new Set(entries.map((entry) => entry.confidence))].sort()
);

export const DataSourceKnowledgeCompatibilityManifest = Object.freeze({
  totalRelationships: entries.length,
  sourceCategoriesRepresented,
  knowledgeCategoriesRepresented,
  compatibilityTypesRepresented,
  confidenceClassificationsRepresented,
  semantics:
    "Compatibility means architecturally permitted or commonly expected mapping from a source category to a knowledge category.",
  nonGuarantee:
    "Compatibility does not guarantee connector availability, extraction success, semantic certainty, source completeness, or live data presence.",
  metadataOnly: true,
  immutable: true,
} as const satisfies CompatibilityManifestDescriptor);
