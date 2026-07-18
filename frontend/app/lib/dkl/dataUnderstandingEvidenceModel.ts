/**
 * DKL-3:3 — Understanding Evidence Model.
 *
 * Canonical immutable model schema for evidence references. Evidence never
 * contains runtime calculations.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import { DataUnderstandingEvidenceCatalog } from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingEvidenceRegistry } from "./dataUnderstandingRegistry.ts";
import type {
  ModelBoundaryMetadata,
  ModelFieldDescriptor,
  ModelOwnershipMetadata,
} from "./dataUnderstandingModelTypes.ts";

const OWNERSHIP: ModelOwnershipMetadata = Object.freeze({
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:3",
  metadataOnly: true,
  modelOnly: true,
});

const BOUNDARIES: ModelBoundaryMetadata = Object.freeze({
  provisionalOnly: true,
  businessObjectForbidden: true,
  knowledgeGraphForbidden: true,
  persistenceForbidden: true,
  aiForbidden: true,
  engineReasoningForbidden: true,
});

const field = (
  fieldName: string,
  fieldKind: string,
  required: boolean,
  cardinality: ModelFieldDescriptor["cardinality"],
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({ fieldName, fieldKind, required, cardinality, description });

const EVIDENCE_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("evidenceId", "Identity", true, "one", "Stable evidence identity."),
  field("category", "EvidenceCategory", true, "one", "Registered evidence category."),
  field("priorityTier", "EvidencePriority", true, "one", "Static priority tier."),
  field("subjectId", "SubjectReference", true, "one", "Subject this evidence supports."),
  field("description", "Text", true, "one", "Description of the evidence reference."),
  field("supportingSource", "SourceReference", true, "one", "Supporting source reference."),
  field("limitations", "Limitation", true, "one", "Required limitations on the evidence."),
  field("strength", "EvidenceStrength", true, "one", "Declared evidence strength."),
  field(
    "confidenceAssociation",
    "ConfidenceLevel",
    false,
    "one",
    "Optional associated confidence level.",
  ),
  field("registryEntryId", "RegistryReference", true, "one", "DKL-3:2 evidence registry id."),
  field("ownership", "OwnershipMetadata", true, "one", "Model ownership metadata."),
  field("boundaries", "BoundaryMetadata", true, "one", "Model boundary metadata."),
]);

/** Canonical immutable Understanding Evidence model schema. */
export const DataUnderstandingEvidenceModel = Object.freeze({
  modelId: "DKL-3:3/UnderstandingEvidence",
  modelKind: "UnderstandingEvidence",
  modelName: "Understanding Evidence Model",
  description:
    "Evidence references that support provisional meaning. Limitations are always required.",
  fields: EVIDENCE_FIELDS,
  fieldCount: EVIDENCE_FIELDS.length,
  allowedCategories: DataUnderstandingEvidenceCatalog.categories,
  allowedStrengths: DataUnderstandingEvidenceCatalog.strengths,
  allowedPriorityTiers: DataUnderstandingEvidenceRegistry.priorityTiers,
  registry: Object.freeze({
    evidenceCategoryCount: DataUnderstandingEvidenceRegistry.entryCount,
    priorityTierCount: DataUnderstandingEvidenceRegistry.priorityTierCount,
    limitationsRequired: DataUnderstandingEvidenceRegistry.limitationsRequired,
    evidenceNeverCalculatedHere:
      DataUnderstandingEvidenceRegistry.evidenceNeverCalculatedHere,
  }),
  limitationsRequired: true,
  runtimeCalculationForbidden: true,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});
