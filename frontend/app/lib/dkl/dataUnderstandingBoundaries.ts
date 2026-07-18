/**
 * DKL-3:1 — Data Understanding Boundaries.
 *
 * Explicit immutable boundary declarations separating Data Understanding from
 * transport, persistence, Business Objects, knowledge graphs, AI, Engine, and UI.
 *
 * Ownership: owned exclusively by DKL-3:1.
 */

/** Canonical immutable boundary declarations. */
export const DataUnderstandingBoundaries = Object.freeze({
  consumesValidatedPipelineIntake: true,
  modifiesPipelinePackage: false,
  modifiesDkl2Registry: false,
  persistsDataset: false,
  createsBusinessObjects: false,
  createsKnowledgeGraph: false,
  executesAiModels: false,
  executesEngineReasoning: false,
  rendersUi: false,
  previewOnly: true,
  persistenceForbidden: true,
  businessObjectCreationForbidden: true,
  aiExecutionForbidden: true,
  engineReasoningForbidden: true,
  architecturalPosition: Object.freeze({
    upstream: Object.freeze([
      "NEA / Integrations / Pipeline",
      "DKL-2 Source & Knowledge Registry",
    ]),
    platform: "DKL-3 Data Understanding",
    downstream: Object.freeze([
      "DKL-4 Knowledge Modeling + Business Objects",
      "Executive Engine",
      "Advisor / Director / Scene",
    ]),
  }),
});
