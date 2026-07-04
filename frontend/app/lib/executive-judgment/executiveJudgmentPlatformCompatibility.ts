import type { ExecutiveJudgmentPlatformCompatibilityEntry } from "./executiveJudgmentPlatformFreezeTypes.ts";

export const EXECUTIVE_JUDGMENT_PLATFORM_COMPATIBILITY_MATRIX: readonly ExecutiveJudgmentPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ target: "CORE", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "DS", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "INT", compatibility: "compatible", boundary: "public-api", runtimeDependency: false }),
  Object.freeze({ target: "KNL", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "APP", compatibility: "compatible", boundary: "public-api", runtimeDependency: false }),
  Object.freeze({ target: "ASS", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "LAY", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "LLM", compatibility: "compatible", boundary: "metadata-contract", runtimeDependency: false }),
  Object.freeze({ target: "Future Executive Platforms", compatibility: "future-compatible", boundary: "future-extension", runtimeDependency: false }),
]);

export function getExecutiveJudgmentPlatformCompatibilityMatrix(): readonly ExecutiveJudgmentPlatformCompatibilityEntry[] {
  return EXECUTIVE_JUDGMENT_PLATFORM_COMPATIBILITY_MATRIX;
}
