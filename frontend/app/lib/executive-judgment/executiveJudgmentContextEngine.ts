export type {
  ExecutiveJudgmentContextBuildResult,
} from "./executiveJudgmentContextBuilder.ts";
export {
  createExecutiveJudgmentContext,
  createExecutiveJudgmentContextBuildResult,
} from "./executiveJudgmentContextBuilder.ts";
export type {
  ExecutiveJudgmentContextInput,
  ExecutiveJudgmentContextItem,
  ExecutiveJudgmentContextPlatformMetadata,
  NormalizedExecutiveJudgmentContext,
} from "./executiveJudgmentContextNormalizer.ts";
export { normalizeExecutiveJudgmentContext } from "./executiveJudgmentContextNormalizer.ts";
export type { ExecutiveJudgmentContextValidation } from "./executiveJudgmentContextValidation.ts";
export { validateExecutiveJudgmentContext } from "./executiveJudgmentContextValidation.ts";
export type {
  ExecutiveJudgmentContextSnapshot,
  ExecutiveJudgmentContextSnapshotEntry,
} from "./executiveJudgmentContextSnapshot.ts";
export { buildExecutiveJudgmentSnapshot } from "./executiveJudgmentContextSnapshot.ts";
export type {
  ExecutiveJudgmentContextRegistry,
  ExecutiveJudgmentContextRegistryEntry,
  ExecutiveJudgmentContextSectionName,
} from "./executiveJudgmentContextRegistry.ts";
export {
  EXECUTIVE_JUDGMENT_CONTEXT_COMPATIBLE_PLATFORMS,
  EXECUTIVE_JUDGMENT_CONTEXT_SECTIONS,
  getExecutiveJudgmentContextRegistry,
} from "./executiveJudgmentContextRegistry.ts";

import {
  createExecutiveJudgmentContext,
  createExecutiveJudgmentContextBuildResult,
} from "./executiveJudgmentContextBuilder.ts";
import { normalizeExecutiveJudgmentContext } from "./executiveJudgmentContextNormalizer.ts";
import { validateExecutiveJudgmentContext } from "./executiveJudgmentContextValidation.ts";
import { buildExecutiveJudgmentSnapshot } from "./executiveJudgmentContextSnapshot.ts";
import { getExecutiveJudgmentContextRegistry } from "./executiveJudgmentContextRegistry.ts";

export const ExecutiveJudgmentContextEngine = Object.freeze({
  createExecutiveJudgmentContext,
  createExecutiveJudgmentContextBuildResult,
  validateExecutiveJudgmentContext,
  normalizeExecutiveJudgmentContext,
  buildExecutiveJudgmentSnapshot,
  getExecutiveJudgmentContextRegistry,
});
