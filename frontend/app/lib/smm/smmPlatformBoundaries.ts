/**
 * SMM-1 — Platform boundary definitions.
 */

import {
  SMM_PLATFORM_MUST_NOT_OWN,
  SMM_PLATFORM_MUST_OWN,
  SMM_PLATFORM_PRINCIPLES,
  SMM_POSITION_STATEMENT,
} from "./smmPlatformContracts.ts";
import type { SmmPlatformBoundaries, SmmPlatformValidationIssue } from "./smmPlatformTypes.ts";

export const SMM_PLATFORM_BOUNDARIES: SmmPlatformBoundaries = Object.freeze({
  owns: SMM_PLATFORM_MUST_OWN,
  doesNotOwn: SMM_PLATFORM_MUST_NOT_OWN,
  readOnly: true as const,
});

export function getSmmPlatformBoundaries(): SmmPlatformBoundaries {
  return SMM_PLATFORM_BOUNDARIES;
}

export function getSmmPlatformPositionStatement() {
  return SMM_POSITION_STATEMENT;
}

export function validateSmmPlatformBoundaries(): readonly SmmPlatformValidationIssue[] {
  const issues: SmmPlatformValidationIssue[] = [];
  if (SMM_PLATFORM_BOUNDARIES.owns.length === 0) {
    issues.push(Object.freeze({ code: "empty_owns", message: "Platform must declare owned responsibilities.", readOnly: true as const }));
  }
  if (SMM_PLATFORM_BOUNDARIES.doesNotOwn.length === 0) {
    issues.push(Object.freeze({ code: "empty_does_not_own", message: "Platform must declare excluded responsibilities.", readOnly: true as const }));
  }
  const overlap = SMM_PLATFORM_BOUNDARIES.owns.filter((item) =>
    (SMM_PLATFORM_BOUNDARIES.doesNotOwn as readonly string[]).includes(item)
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

export function getSmmPlatformPrinciples(): readonly string[] {
  return SMM_PLATFORM_PRINCIPLES;
}
