import type { CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentEngine.ts";
import { normalizeExecutiveJudgmentExplanation, type NormalizedExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationNormalizer.ts";

export type StructuredExecutiveJudgmentExplanation = NormalizedExecutiveJudgmentExplanation;

export function buildExecutiveJudgmentExplanation(judgment: CanonicalExecutiveJudgmentOutput): StructuredExecutiveJudgmentExplanation {
  return normalizeExecutiveJudgmentExplanation(judgment);
}

export const createExecutiveJudgmentExplanation = buildExecutiveJudgmentExplanation;
