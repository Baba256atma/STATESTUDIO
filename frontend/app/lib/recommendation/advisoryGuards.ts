/**
 * D7:5:8 — Executive strategic advisory governance guard rails.
 */

import type { ExecutiveStrategicAdvisorySignal } from "./executiveStrategicAdvisoryTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";

export type ExecutiveStrategicAdvisoryGuardCode =
  | "empty_advisory_context"
  | "too_many_advisory_signals"
  | "invalid_advisory_strength"
  | "invalid_advisory_region"
  | "duplicate_advisory_build"
  | "unsupported_advisory_claim"
  | "hidden_persuasion_detected"
  | "autonomous_executive_decision"
  | "runaway_advisory_amplification"
  | "corrupted_advisory_state";

export type ExecutiveStrategicAdvisoryGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveStrategicAdvisoryGuardCode; message: string };

export const DEFAULT_MAX_ADVISORY_SIGNALS = 96;
export const ADVISORY_AMBIGUITY_DISCLAIMER =
  "Strategic advisory guidance reflects synthesized operational intelligence under current conditions and is indicative, not definitive.";
export const NON_AUTONOMOUS_AUTHORITY_DISCLAIMER =
  "Nexora provides advisory intelligence only; executives retain full authority over strategic decisions.";

const PROHIBITED_PERSUASION_TEXT = [
  "hidden persuasion",
  "manipulative",
  "override executive",
  "override judgment",
  "autonomous decision",
  "mandate action",
  "you must",
  "required to act",
  "hidden prioritization",
  "black-box advisory",
] as const;

function containsProhibitedPersuasionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_PERSUASION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveStrategicAdvisoryGuardCode,
  message: string
): ExecutiveStrategicAdvisoryGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveStrategicAdvisoryDev("AdvisoryGuard", { code, message });
  return result;
}

export function buildAdvisoryContentFingerprint(input: {
  topologyFingerprint: string;
  explainabilityFingerprint?: string;
  governanceFingerprint?: string;
  memoryFingerprint?: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    explainability: input.explainabilityFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    memory: input.memoryFingerprint ?? null,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveAdvisory(input: {
  topologyId: string;
  regionIds: readonly string[];
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  priorAdvisoryFingerprints?: readonly string[];
  pendingFingerprint?: string;
  advisoryClarityScore?: number;
  actionabilityScore?: number;
}): ExecutiveStrategicAdvisoryGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_advisory_context",
      "Topology context is required to evaluate executive advisory"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.advisories.length > DEFAULT_MAX_ADVISORY_SIGNALS) {
    return reject(
      "too_many_advisory_signals",
      `Advisory signal count ${input.advisories.length} exceeds max ${DEFAULT_MAX_ADVISORY_SIGNALS}`
    );
  }

  if ((input.advisoryClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_advisory_amplification",
      "Advisory clarity score implies uncontrolled advisory amplification"
    );
  }

  if ((input.actionabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_advisory_amplification",
      "Actionability score implies uncontrolled advisory amplification"
    );
  }

  for (const advisory of input.advisories) {
    if (
      !Number.isFinite(advisory.advisoryStrength) ||
      advisory.advisoryStrength < 0 ||
      advisory.advisoryStrength > 0.92
    ) {
      return reject(
        "invalid_advisory_strength",
        `Advisory strength ${advisory.advisoryStrength} for ${advisory.advisoryId} is out of allowed range`
      );
    }
    for (const regionId of advisory.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_advisory_region",
          `Advisory region ${regionId} is not in topology for ${advisory.advisoryId}`
        );
      }
    }
  }

  if (input.priorAdvisoryFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject("duplicate_advisory_build", "Duplicate executive advisory build fingerprint detected");
  }

  return { ok: true };
}

export function guardAdvisoryExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveStrategicAdvisoryGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_advisory_claim",
      "Advisory semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedPersuasionText(combined)) {
    return reject(
      "hidden_persuasion_detected",
      "Advisory semantics imply hidden persuasion or manipulative framing"
    );
  }
  if (combined.toLowerCase().includes("autonomously decide")) {
    return reject(
      "autonomous_executive_decision",
      "Advisory semantics imply autonomous executive decision-making"
    );
  }
  return { ok: true };
}
