/**
 * D7:8:3 — Strategic meta-causality governance guard rails.
 */

import type { StrategicMetaCausalitySignal } from "./strategicMetaCausalityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicMetaCausalityDev } from "./strategicMetaCausalityDevLog.ts";

export type StrategicMetaCausalityGuardCode =
  | "empty_meta_causality_context"
  | "too_many_meta_causality_signals"
  | "invalid_meta_causality_strength"
  | "invalid_meta_causality_region"
  | "duplicate_meta_causality_build"
  | "unsupported_meta_causality_claim"
  | "autonomous_strategic_redesign"
  | "fabricated_strategic_causality"
  | "unstable_recursive_reasoning"
  | "runaway_meta_causality_orchestration"
  | "corrupted_meta_causality_state";

export type StrategicMetaCausalityGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicMetaCausalityGuardCode; message: string };

export const DEFAULT_MAX_META_CAUSALITY_SIGNALS = 96;
export const META_CAUSALITY_AMBIGUITY_DISCLAIMER =
  "Strategic meta-causality intelligence reflects evidence-grounded causal structure under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER =
  "Nexora models strategic meta-causality without assigning strategic redesign authority; strategic decisions remain fully under executive control.";

const PROHIBITED_META_CAUSALITY_TEXT = [
  "speculative superintelligence",
  "autonomous enterprise strategy generation",
  "autonomous strategic redesign",
  "self-governing enterprise ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive reasoning",
  "hidden executive manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive reasoning",
  "fabricated strategic causality",
  "fabricate causal structures",
  "meta-causality recursion exceeded",
  "meta causality recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedMetaCausalityText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_META_CAUSALITY_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicMetaCausalityGuardCode,
  message: string
): StrategicMetaCausalityGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicMetaCausalityDev("MetaCausalityGuard", { code, message });
  return result;
}

export function buildMetaCausalityContentFingerprint(input: {
  topologyFingerprint: string;
  patternFingerprint?: string;
  metaFingerprint?: string;
  realityFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    pattern: input.patternFingerprint ?? null,
    meta: input.metaFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicMetaCausality(input: {
  topologyId: string;
  regionIds: readonly string[];
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  priorMetaCausalityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  metaCausalityCoherenceScore?: number;
  metaCausalityInstabilityScore?: number;
}): StrategicMetaCausalityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_meta_causality_context",
      "Topology context is required to evaluate strategic meta-causality"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.metaCausalitySignals.length > DEFAULT_MAX_META_CAUSALITY_SIGNALS) {
    return reject(
      "too_many_meta_causality_signals",
      `Meta-causality signal count ${input.metaCausalitySignals.length} exceeds max ${DEFAULT_MAX_META_CAUSALITY_SIGNALS}`
    );
  }

  if ((input.metaCausalityCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_meta_causality_orchestration",
      "Meta-causality coherence score implies uncontrolled meta-causality orchestration"
    );
  }

  if ((input.metaCausalityInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_meta_causality_orchestration",
      "Meta-causality instability score implies uncontrolled meta-causality orchestration"
    );
  }

  for (const signal of input.metaCausalitySignals) {
    if (
      !Number.isFinite(signal.metaCausalityStrength) ||
      signal.metaCausalityStrength < 0 ||
      signal.metaCausalityStrength > 0.92
    ) {
      return reject(
        "invalid_meta_causality_strength",
        `Meta-causality strength ${signal.metaCausalityStrength} for ${signal.metaCausalityId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_meta_causality_region",
          `Meta-causality region ${regionId} is not in topology for ${signal.metaCausalityId}`
        );
      }
    }
  }

  if (input.priorMetaCausalityFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_meta_causality_build",
      "Duplicate strategic meta-causality build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicMetaCausalitySemantics(input: {
  headline: string;
  summary: string;
}): StrategicMetaCausalityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_meta_causality_claim",
      "Strategic meta-causality semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedMetaCausalityText(combined)) {
    return reject(
      "fabricated_strategic_causality",
      "Strategic meta-causality semantics imply fabricated causality or autonomous strategic redesign"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic redesign")) {
    return reject(
      "autonomous_strategic_redesign",
      "Strategic meta-causality semantics imply autonomous strategic redesign"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive reasoning")) {
    return reject(
      "unstable_recursive_reasoning",
      "Strategic meta-causality semantics imply unstable recursive reasoning"
    );
  }
  return { ok: true };
}
