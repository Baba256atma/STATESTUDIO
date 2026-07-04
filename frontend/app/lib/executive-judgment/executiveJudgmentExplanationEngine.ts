export type {
  StructuredExecutiveJudgmentExplanation,
} from "./executiveJudgmentExplanationBuilder.ts";
export {
  buildExecutiveJudgmentExplanation,
  createExecutiveJudgmentExplanation,
} from "./executiveJudgmentExplanationBuilder.ts";
export type {
  ExecutiveJudgmentExplanationSection,
  ExecutiveJudgmentTraceabilityEntry,
  NormalizedExecutiveJudgmentExplanation,
} from "./executiveJudgmentExplanationNormalizer.ts";
export { normalizeExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationNormalizer.ts";
export type { ExecutiveJudgmentExplanationValidation } from "./executiveJudgmentExplanationValidation.ts";
export { validateExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationValidation.ts";
export type { ExecutiveJudgmentExplanationSnapshot } from "./executiveJudgmentExplanationSnapshot.ts";
export { buildExecutiveJudgmentExplanationSnapshot } from "./executiveJudgmentExplanationSnapshot.ts";
export type {
  ExecutiveJudgmentExplanationRegistry,
  ExecutiveJudgmentExplanationSectionType,
} from "./executiveJudgmentExplanationRegistry.ts";
export {
  EXECUTIVE_JUDGMENT_EXPLANATION_COMPATIBLE_INPUTS,
  EXECUTIVE_JUDGMENT_EXPLANATION_SECTION_TYPES,
  getExecutiveJudgmentExplanationRegistry,
} from "./executiveJudgmentExplanationRegistry.ts";

import {
  buildExecutiveJudgmentExplanation,
  createExecutiveJudgmentExplanation,
} from "./executiveJudgmentExplanationBuilder.ts";
import { normalizeExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationNormalizer.ts";
import { validateExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationValidation.ts";
import { buildExecutiveJudgmentExplanationSnapshot } from "./executiveJudgmentExplanationSnapshot.ts";
import { getExecutiveJudgmentExplanationRegistry } from "./executiveJudgmentExplanationRegistry.ts";

export const ExecutiveJudgmentExplanationEngine = Object.freeze({
  createExecutiveJudgmentExplanation,
  buildExecutiveJudgmentExplanation,
  normalizeExecutiveJudgmentExplanation,
  validateExecutiveJudgmentExplanation,
  buildExecutiveJudgmentExplanationSnapshot,
  getExecutiveJudgmentExplanationRegistry,
});
