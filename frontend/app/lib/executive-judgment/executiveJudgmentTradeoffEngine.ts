export type {
  ExecutiveJudgmentTradeoffAssessment,
  ExecutiveJudgmentTradeoffAssessmentCollection,
} from "./executiveJudgmentTradeoffAnalyzer.ts";
export { analyzeExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffAnalyzer.ts";
export type {
  ExecutiveJudgmentTradeoffCollection,
  ExecutiveJudgmentTradeoffDirection,
  ExecutiveJudgmentTradeoffLevel,
  ExecutiveJudgmentTradeoffStatus,
  NormalizedExecutiveJudgmentTradeoffRecord,
} from "./executiveJudgmentTradeoffNormalizer.ts";
export { normalizeExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffNormalizer.ts";
export type { ExecutiveJudgmentTradeoffValidation } from "./executiveJudgmentTradeoffValidation.ts";
export { validateExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffValidation.ts";
export type {
  ExecutiveJudgmentTradeoffSnapshot,
  ExecutiveJudgmentTradeoffSnapshotEntry,
} from "./executiveJudgmentTradeoffSnapshot.ts";
export { buildExecutiveJudgmentTradeoffSnapshot } from "./executiveJudgmentTradeoffSnapshot.ts";
export type {
  ExecutiveJudgmentTradeoffDomain,
  ExecutiveJudgmentTradeoffRegistry,
} from "./executiveJudgmentTradeoffRegistry.ts";
export {
  EXECUTIVE_JUDGMENT_TRADEOFF_COMPATIBLE_INPUTS,
  EXECUTIVE_JUDGMENT_TRADEOFF_DOMAINS,
  getExecutiveJudgmentTradeoffRegistry,
} from "./executiveJudgmentTradeoffRegistry.ts";

import { analyzeExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffAnalyzer.ts";
import { normalizeExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffNormalizer.ts";
import { validateExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffValidation.ts";
import { buildExecutiveJudgmentTradeoffSnapshot } from "./executiveJudgmentTradeoffSnapshot.ts";
import { getExecutiveJudgmentTradeoffRegistry } from "./executiveJudgmentTradeoffRegistry.ts";

export const ExecutiveJudgmentTradeoffEngine = Object.freeze({
  analyzeExecutiveJudgmentTradeoffs,
  normalizeExecutiveJudgmentTradeoffs,
  validateExecutiveJudgmentTradeoffs,
  buildExecutiveJudgmentTradeoffSnapshot,
  getExecutiveJudgmentTradeoffRegistry,
});
