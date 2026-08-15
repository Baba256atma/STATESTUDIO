/**
 * STAGE-2D:3 Stage bridge — apply click-to-center topology recomposition.
 *
 * STAGE-2D:4 readability polish is the live Stage apply path. This module
 * re-exports that path so existing STAGE-2D:3 call sites remain valid while
 * anchored layouts receive footprint-aware readability refinements.
 *
 * Authority:
 *   clicked selected/focused object = sole spatial anchor at (0,0,0)
 */

export {
  applyExecutiveStage2DTopologyReadabilityToStagePresentation as applyExecutiveStage2DTopologyRecompositionToStagePresentation,
  getNexoraMVPExecutiveStage2DReadabilityObservability as getNexoraMVPExecutiveStage2DRecompositionObservability,
  resolveExecutiveStage2DTopologyReadabilityFromPresentation as resolveExecutiveStage2DTopologyRecompositionFromPresentation,
  resolveStage2DAnchorObjectId,
  NEXORA_MVP_EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY as NEXORA_MVP_EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY,
  nexoraMVPExecutiveStage2DTopologyReadabilityIdentity as nexoraMVPExecutiveStage2DTopologyRecompositionIdentity,
} from "./nexoraMVPExecutiveStage2DTopologyReadability";
