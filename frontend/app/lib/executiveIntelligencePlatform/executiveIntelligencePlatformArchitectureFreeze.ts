/**
 * INT-5 — Executive Intelligence Platform architecture freeze.
 */

import {
  EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  type ExecutiveIntelligenceArchitectureFreezeReport,
} from "./executiveIntelligencePlatformCertificationContract.ts";

let platformFrozen = false;
let frozenAt: string | null = null;

export function isExecutiveIntelligencePlatformFrozen(): boolean {
  return platformFrozen;
}

export function getExecutiveIntelligencePlatformFrozenAt(): string | null {
  return frozenAt;
}

export function freezeExecutiveIntelligencePlatform(input: {
  certified: boolean;
  reason?: string;
}): ExecutiveIntelligenceArchitectureFreezeReport {
  if (input.certified) {
    platformFrozen = true;
    frozenAt = new Date().toISOString();
  }

  return Object.freeze({
    frozen: platformFrozen,
    frozenAt,
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
    reason:
      input.reason ??
      (platformFrozen
        ? "Executive Intelligence Platform certified and architecture frozen."
        : "Platform not frozen — certification incomplete."),
    tags: EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  });
}

export function resetExecutiveIntelligencePlatformFreezeForTests(): void {
  platformFrozen = false;
  frozenAt = null;
}

export function getExecutiveIntelligenceArchitectureFreezeReport(): ExecutiveIntelligenceArchitectureFreezeReport {
  return Object.freeze({
    frozen: platformFrozen,
    frozenAt,
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
    reason: platformFrozen
      ? "Executive Intelligence Platform architecture is frozen."
      : "Executive Intelligence Platform architecture is not frozen.",
    tags: EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  });
}
