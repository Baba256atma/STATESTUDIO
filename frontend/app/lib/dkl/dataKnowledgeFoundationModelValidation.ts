/**
 * DKL-1:4 — Model Validation domain.
 *
 * Deterministically validates the DKL-1:3 Model using its official public
 * surface only. Metadata only — no runtime behavior.
 */

import {
  BusinessObjectModel,
  DataKnowledgeFoundationModel,
  DataKnowledgeFoundationModelManifest,
  DataKnowledgeObjectModel,
  KnowledgeMetadataModel,
  KnowledgeRelationshipModel,
  getDataKnowledgeFoundationModelSummary,
} from "./dataKnowledgeFoundationModel.ts";
import {
  createValidationDomain,
  createValidationRule,
  isDeeplyFrozen,
} from "./dataKnowledgeFoundationValidationTypes.ts";

const REQUIRED_OBJECT_FACETS = [
  "identifier",
  "category",
  "source",
  "ownership",
  "lifecycle",
  "visibility",
  "stability",
  "organizationalKnowledge",
] as const;

const objectFacetsComplete = REQUIRED_OBJECT_FACETS.every(
  (facet) => DataKnowledgeObjectModel[facet]?.facet === facet
);

const summaryDeterministic =
  JSON.stringify(getDataKnowledgeFoundationModelSummary()) ===
  JSON.stringify(getDataKnowledgeFoundationModelSummary());

const rules = [
  createValidationRule({
    id: "DKL-VAL-M-01",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Required model APIs exist",
    description: "The aggregate model must expose object, business, relationship, metadata models and a manifest.",
    expected: "all four sub-models and manifest present",
    actual: String(
      Boolean(DataKnowledgeFoundationModel.objectModel) &&
        Boolean(DataKnowledgeFoundationModel.businessModel) &&
        Boolean(DataKnowledgeFoundationModel.relationshipModel) &&
        Boolean(DataKnowledgeFoundationModel.metadataModel) &&
        Boolean(DataKnowledgeFoundationModel.manifest)
    ),
    condition:
      Boolean(DataKnowledgeFoundationModel.objectModel) &&
      Boolean(DataKnowledgeFoundationModel.businessModel) &&
      Boolean(DataKnowledgeFoundationModel.relationshipModel) &&
      Boolean(DataKnowledgeFoundationModel.metadataModel) &&
      Boolean(DataKnowledgeFoundationModel.manifest),
    evidence: { hasAllModels: true },
  }),
  createValidationRule({
    id: "DKL-VAL-M-02",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Knowledge Object facets are complete",
    description: "The Knowledge Object Model must declare all required facets.",
    expected: REQUIRED_OBJECT_FACETS.join(","),
    actual: String(objectFacetsComplete),
    condition: objectFacetsComplete,
    evidence: { facetCount: REQUIRED_OBJECT_FACETS.length, complete: objectFacetsComplete },
  }),
  createValidationRule({
    id: "DKL-VAL-M-03",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Eight Business Object definitions exist",
    description: "The Business Object Model must define exactly eight entity types.",
    expected: "8",
    actual: String(BusinessObjectModel.types.length),
    condition: BusinessObjectModel.types.length === 8,
    evidence: { businessObjectTypeCount: BusinessObjectModel.types.length },
  }),
  createValidationRule({
    id: "DKL-VAL-M-04",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Seven relationship definitions exist",
    description: "The Knowledge Relationship Model must define exactly seven relationship types.",
    expected: "7",
    actual: String(KnowledgeRelationshipModel.relationships.length),
    condition: KnowledgeRelationshipModel.relationships.length === 7,
    evidence: { relationshipTypeCount: KnowledgeRelationshipModel.relationships.length },
  }),
  createValidationRule({
    id: "DKL-VAL-M-05",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Seven metadata field definitions exist",
    description: "The Knowledge Metadata Model must define exactly seven metadata fields.",
    expected: "7",
    actual: String(KnowledgeMetadataModel.fields.length),
    condition: KnowledgeMetadataModel.fields.length === 7,
    evidence: { metadataFieldCount: KnowledgeMetadataModel.fields.length },
  }),
  createValidationRule({
    id: "DKL-VAL-M-06",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Source, Identity, Ownership, Organizational Knowledge represented",
    description: "The Knowledge Object Model must represent source, identity, ownership, and organizational knowledge facets.",
    expected: "source + identifier + ownership + organizationalKnowledge facets present",
    actual: String(
      DataKnowledgeObjectModel.source.facet === "source" &&
        DataKnowledgeObjectModel.identifier.facet === "identifier" &&
        DataKnowledgeObjectModel.ownership.facet === "ownership" &&
        DataKnowledgeObjectModel.organizationalKnowledge.facet === "organizationalKnowledge"
    ),
    condition:
      DataKnowledgeObjectModel.source.facet === "source" &&
      DataKnowledgeObjectModel.identifier.facet === "identifier" &&
      DataKnowledgeObjectModel.ownership.facet === "ownership" &&
      DataKnowledgeObjectModel.organizationalKnowledge.facet === "organizationalKnowledge",
    evidence: {
      source: DataKnowledgeObjectModel.source.facet,
      identity: DataKnowledgeObjectModel.identifier.facet,
      ownership: DataKnowledgeObjectModel.ownership.facet,
      organizationalKnowledge: DataKnowledgeObjectModel.organizationalKnowledge.facet,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-M-07",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Foundation compatibility is declared",
    description: "The model manifest must declare compatibility with the DKL-1:1 Foundation.",
    expected: "foundationCompatibility.compatible === true (DKL-1:1)",
    actual: `${DataKnowledgeFoundationModelManifest.foundationCompatibility.phase}:${DataKnowledgeFoundationModelManifest.foundationCompatibility.compatible}`,
    condition:
      DataKnowledgeFoundationModelManifest.foundationCompatibility.phase === "DKL-1:1" &&
      DataKnowledgeFoundationModelManifest.foundationCompatibility.compatible === true,
    evidence: {
      phase: DataKnowledgeFoundationModelManifest.foundationCompatibility.phase,
      compatible: DataKnowledgeFoundationModelManifest.foundationCompatibility.compatible,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-M-08",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Registry compatibility is declared",
    description: "The model manifest must declare compatibility with the DKL-1:2 Registry.",
    expected: "registryCompatibility.compatible === true (DKL-1:2)",
    actual: `${DataKnowledgeFoundationModelManifest.registryCompatibility.phase}:${DataKnowledgeFoundationModelManifest.registryCompatibility.compatible}`,
    condition:
      DataKnowledgeFoundationModelManifest.registryCompatibility.phase === "DKL-1:2" &&
      DataKnowledgeFoundationModelManifest.registryCompatibility.compatible === true,
    evidence: {
      phase: DataKnowledgeFoundationModelManifest.registryCompatibility.phase,
      compatible: DataKnowledgeFoundationModelManifest.registryCompatibility.compatible,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-M-09",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Registered model counts match actual models",
    description: "The model manifest must register exactly the four published models.",
    expected: "4",
    actual: String(DataKnowledgeFoundationModelManifest.registeredModels.length),
    condition: DataKnowledgeFoundationModelManifest.registeredModels.length === 4,
    evidence: { registeredModelCount: DataKnowledgeFoundationModelManifest.registeredModels.length },
  }),
  createValidationRule({
    id: "DKL-VAL-M-10",
    domain: "model",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "Model platform is deeply frozen",
    description: "The aggregate model platform and all nested metadata must be deeply frozen.",
    expected: "isDeeplyFrozen(DataKnowledgeFoundationModel) === true",
    actual: String(isDeeplyFrozen(DataKnowledgeFoundationModel)),
    condition: isDeeplyFrozen(DataKnowledgeFoundationModel),
    evidence: { deeplyFrozen: isDeeplyFrozen(DataKnowledgeFoundationModel) },
  }),
  createValidationRule({
    id: "DKL-VAL-M-11",
    domain: "model",
    severity: "INFO",
    sourcePhase: "DKL-1:3",
    title: "Model summary is deterministic",
    description: "Repeated model summary calls must return equivalent values.",
    expected: "summary is deterministic",
    actual: String(summaryDeterministic),
    condition: summaryDeterministic,
    evidence: { deterministic: summaryDeterministic },
  }),
];

export const DataKnowledgeFoundationModelValidation = createValidationDomain(
  "model",
  "Model Validation",
  "DKL-1:3",
  rules
);
