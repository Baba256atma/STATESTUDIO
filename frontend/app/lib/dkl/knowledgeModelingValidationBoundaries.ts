/**
 * DKL-4:4 — Knowledge Modeling Validation Boundaries.
 *
 * Ownership: owned exclusively by DKL-4:4.
 */

export const KnowledgeModelingValidationBoundaries = Object.freeze({
  boundaryId: "DKL-4:4/ValidationBoundaries",
  validatesArchitecturalIntegrityOnly: true,
  validatesOperationalPayloads: false,
  mutatesInputs: false,
  repairsModels: false,
  createsBusinessObjects: false,
  createsKnowledgeObjects: false,
  traversesGraphs: false,
  persistsData: false,
  executesAi: false,
  executesEngineReasoning: false,
  understandsSemantics: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
