/**
 * D7:1:5 — Scenario branching timeline framework (public surface).
 */

export type {
  ScenarioTimelineBranch,
  TimelineBranchPoint,
  BranchDivergenceSummary,
  ExecutiveScenarioKind,
  ScenarioBranchForestState,
  ScenarioBranchComparisonRow,
  ScenarioBranchComparisonMatrix,
} from "./branchingTypes.ts";

export {
  EXECUTIVE_SCENARIO_KIND_LABELS,
  resolveExecutiveBranchLabel,
  slugifyBranchId,
} from "./branchingExecutiveSemantics.ts";

export type { BranchGuardCode, BranchGuardResult } from "./branchingGuards.ts";
export {
  DEFAULT_MAX_ACTIVE_BRANCHES,
  DEFAULT_MAX_BRANCH_DEPTH,
  computeBranchDepth,
  guardMaxActiveBranches,
  guardBranchDepth,
  guardDuplicateBranchId,
  guardBranchPointTick,
  guardStaleParentTimeline,
} from "./branchingGuards.ts";

export { computeBranchDivergenceSummary } from "./branchDivergence.ts";

export {
  buildScenarioBranchComparisonMatrix,
  listSiblingBranchesAtTick,
} from "./branchComparison.ts";

export type {
  BranchForkHeadPatch,
  BranchDivergenceInput,
  CreateScenarioBranchInput,
  CreateScenarioBranchResult,
} from "./branchingScenarioTimelineEngine.ts";

export {
  createScenarioBranchForest,
  upsertTimelineInForest,
  createScenarioBranch,
  scenarioBranchForestFingerprint,
  commitBranchTimelineEvolution,
} from "./branchingScenarioTimelineEngine.ts";
