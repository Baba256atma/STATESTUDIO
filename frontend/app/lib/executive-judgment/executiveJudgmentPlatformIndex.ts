export type { ExecutiveJudgmentPlatformRegistry, ExecutiveJudgmentPlatformPhaseId } from "./executiveJudgmentPlatformRegistry.ts";
export {
  EXECUTIVE_JUDGMENT_PLATFORM_PHASES,
  EXECUTIVE_JUDGMENT_PLATFORM_PUBLIC_APIS,
  getExecutiveJudgmentPlatformRegistry,
  getExecutiveJudgmentPlatformVersion,
} from "./executiveJudgmentPlatformRegistry.ts";
export type { ExecutiveJudgmentPlatformManifest } from "./executiveJudgmentPlatformManifest.ts";
export { buildExecutiveJudgmentPlatformManifest } from "./executiveJudgmentPlatformManifest.ts";
export type { ExecutiveJudgmentPlatformResult } from "./executiveJudgmentPlatformRunner.ts";
export {
  createExecutiveJudgmentPlatform,
  runExecutiveJudgmentPlatform,
} from "./executiveJudgmentPlatformRunner.ts";
export type { ExecutiveJudgmentPlatformValidation } from "./executiveJudgmentPlatformValidation.ts";
export { validateExecutiveJudgmentPlatform } from "./executiveJudgmentPlatformValidation.ts";

import {
  getExecutiveJudgmentPlatformRegistry,
  getExecutiveJudgmentPlatformVersion,
} from "./executiveJudgmentPlatformRegistry.ts";
import { buildExecutiveJudgmentPlatformManifest } from "./executiveJudgmentPlatformManifest.ts";
import {
  createExecutiveJudgmentPlatform,
  runExecutiveJudgmentPlatform,
} from "./executiveJudgmentPlatformRunner.ts";
import { validateExecutiveJudgmentPlatform } from "./executiveJudgmentPlatformValidation.ts";

export const ExecutiveJudgmentPlatform = Object.freeze({
  runExecutiveJudgmentPlatform,
  createExecutiveJudgmentPlatform,
  validateExecutiveJudgmentPlatform,
  buildExecutiveJudgmentPlatformManifest,
  getExecutiveJudgmentPlatformRegistry,
  getExecutiveJudgmentPlatformVersion,
});
