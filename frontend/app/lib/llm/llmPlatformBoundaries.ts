/**
 * LLM-1 — Platform boundary definitions.
 */

import {
  LLM_PLATFORM_MUST_NOT_OWN,
  LLM_PLATFORM_MUST_OWN,
  LLM_PLATFORM_PRINCIPLES,
} from "./llmPlatformContracts.ts";
import type { LlmPlatformBoundaries, LlmPlatformValidationIssue } from "./llmPlatformTypes.ts";

export const LLM_PLATFORM_BOUNDARIES: LlmPlatformBoundaries = Object.freeze({
  owns: LLM_PLATFORM_MUST_OWN,
  doesNotOwn: LLM_PLATFORM_MUST_NOT_OWN,
  readOnly: true as const,
});

export function getLlmPlatformBoundaries(): LlmPlatformBoundaries {
  return LLM_PLATFORM_BOUNDARIES;
}

export function validateLlmPlatformBoundaries(): readonly LlmPlatformValidationIssue[] {
  const issues: LlmPlatformValidationIssue[] = [];
  if (LLM_PLATFORM_BOUNDARIES.owns.length === 0) {
    issues.push(Object.freeze({ code: "empty_owns", message: "Platform must declare owned responsibilities.", readOnly: true as const }));
  }
  if (LLM_PLATFORM_BOUNDARIES.doesNotOwn.length === 0) {
    issues.push(Object.freeze({ code: "empty_does_not_own", message: "Platform must declare excluded responsibilities.", readOnly: true as const }));
  }
  const overlap = LLM_PLATFORM_BOUNDARIES.owns.filter((item) =>
    (LLM_PLATFORM_BOUNDARIES.doesNotOwn as readonly string[]).includes(item)
  );
  if (overlap.length > 0) {
    issues.push(Object.freeze({
      code: "boundary_overlap",
      message: `Owns and does-not-own lists overlap: ${overlap.join(", ")}`,
      readOnly: true as const,
    }));
  }
  return Object.freeze(issues);
}

export function getLlmPlatformPrinciples(): readonly string[] {
  return LLM_PLATFORM_PRINCIPLES;
}
