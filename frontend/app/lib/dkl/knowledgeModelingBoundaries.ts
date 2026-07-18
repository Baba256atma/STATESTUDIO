/**
 * DKL-4:1 — Knowledge Modeling Boundaries.
 *
 * Explicit immutable boundary declarations separating Knowledge Modeling from
 * ingestion, understanding execution, persistence, AI, Engine, Advisor, Scene,
 * and UI.
 *
 * Ownership: owned exclusively by DKL-4:1.
 */

/** Canonical immutable boundary declarations. */
export const KnowledgeModelingBoundaries = Object.freeze({
  consumesDkl3PublicIndex: true,
  modifiesDkl3Understanding: false,
  modifiesDkl2Registry: false,
  performsUnderstanding: false,
  performsIngestion: false,
  performsParsing: false,
  persistsModels: false,
  executesAiModels: false,
  executesEngineReasoning: false,
  executesQueries: false,
  traversesGraphs: false,
  rendersUi: false,
  narratesAdvisor: false,
  rendersScene: false,
  metadataOnly: true,
  modelingOnly: true,
  persistenceForbidden: true,
  aiExecutionForbidden: true,
  engineReasoningForbidden: true,
  algorithmExecutionForbidden: true,
  architecturalPosition: Object.freeze({
    upstream: Object.freeze([
      "DKL-3 Data Understanding (Public Index only)",
      "DKL-2 Source & Knowledge Registry (via DKL-3)",
      "NEA / Integrations / Pipeline (via DKL-3)",
    ]),
    platform: "DKL-4 Knowledge Modeling",
    downstream: Object.freeze([
      "DKL-4:2 Knowledge Modeling Registry",
      "Executive Engine",
      "Advisor / Director / Scene (consumers only)",
    ]),
  }),
  immutable: true,
  deterministic: true,
});
