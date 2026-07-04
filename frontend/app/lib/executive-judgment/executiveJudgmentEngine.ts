export type {
  ExecutiveJudgmentPosture,
  ExecutiveJudgmentReadiness,
  ExecutiveJudgmentRegistry,
} from "./executiveJudgmentRegistry.ts";
export {
  EXECUTIVE_JUDGMENT_ENGINE_COMPATIBLE_INPUTS,
  EXECUTIVE_JUDGMENT_POSTURES,
  getExecutiveJudgmentRegistry,
} from "./executiveJudgmentRegistry.ts";
export type {
  ExecutiveJudgmentAlternativeBasis,
  ExecutiveJudgmentAlternativeState,
  NormalizedExecutiveJudgment,
} from "./executiveJudgmentNormalizer.ts";
export { normalizeExecutiveJudgment } from "./executiveJudgmentNormalizer.ts";
export type { CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentSynthesizer.ts";
export {
  createExecutiveJudgment,
  synthesizeExecutiveJudgment,
} from "./executiveJudgmentSynthesizer.ts";
export type { ExecutiveJudgmentValidation } from "./executiveJudgmentValidation.ts";
export { validateExecutiveJudgment } from "./executiveJudgmentValidation.ts";
export type { ExecutiveJudgmentSnapshot } from "./executiveJudgmentSnapshot.ts";
export { buildExecutiveJudgmentSnapshot } from "./executiveJudgmentSnapshot.ts";

import { getExecutiveJudgmentRegistry } from "./executiveJudgmentRegistry.ts";
import { normalizeExecutiveJudgment } from "./executiveJudgmentNormalizer.ts";
import {
  createExecutiveJudgment,
  synthesizeExecutiveJudgment,
} from "./executiveJudgmentSynthesizer.ts";
import { validateExecutiveJudgment } from "./executiveJudgmentValidation.ts";
import { buildExecutiveJudgmentSnapshot } from "./executiveJudgmentSnapshot.ts";

export const ExecutiveJudgmentEngine = Object.freeze({
  createExecutiveJudgment,
  synthesizeExecutiveJudgment,
  normalizeExecutiveJudgment,
  validateExecutiveJudgment,
  buildExecutiveJudgmentSnapshot,
  getExecutiveJudgmentRegistry,
});
