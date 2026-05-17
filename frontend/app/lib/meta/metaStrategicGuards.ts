/**
 * D7:8:1 — Meta-strategic intelligence governance guard rails.
 */

import type { MetaStrategicSignal } from "./metaStrategicTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logMetaStrategicDev } from "./metaStrategicDevLog.ts";

export type MetaStrategicGuardCode =
  | "empty_meta_context"
  | "too_many_meta_signals"
  | "invalid_meta_strength"
  | "invalid_meta_region"
  | "duplicate_meta_build"
  | "unsupported_meta_claim"
  | "autonomous_strategic_governance"
  | "fabricated_meta_conclusion"
  | "unstable_recursive_intelligence"
  | "runaway_meta_orchestration"
  | "corrupted_meta_state";

export type MetaStrategicGuardResult =
  | { ok: true }
  | { ok: false; code: MetaStrategicGuardCode; message: string };

export const DEFAULT_MAX_META_SIGNALS = 96;
export const META_AMBIGUITY_DISCLAIMER =
  "Meta-strategic intelligence reflects evidence-grounded strategy evolution under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_META_DISCLAIMER =
  "Nexora models enterprise strategy evolution without assigning strategic governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_META_TEXT = [
  "autonomous superintelligence",
  "autonomous strategic governance",
  "self-governing strategic ai",
  "self governing strategic ai",
  "uncontrolled recursive cognition",
  "hidden executive manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive intelligence",
  "fabricated meta-strategic conclusion",
  "fabricate strategic intelligence",
  "meta recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedMetaText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_META_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: MetaStrategicGuardCode,
  message: string
): MetaStrategicGuardResult {
  const result = { ok: false as const, code, message };
  logMetaStrategicDev("MetaGuard", { code, message });
  return result;
}

export function buildMetaContentFingerprint(input: {
  topologyFingerprint: string;
  realityFingerprint?: string;
  completionFingerprint?: string;
  orchestrationFingerprint?: string;
  momentumFingerprint?: string;
  equilibriumFingerprint?: string;
  resilienceFingerprint?: string;
  governanceFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    reality: input.realityFingerprint ?? null,
    completion: input.completionFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateMetaStrategicIntelligence(input: {
  topologyId: string;
  regionIds: readonly string[];
  metaSignals: readonly MetaStrategicSignal[];
  priorMetaFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicMetaCoherenceScore?: number;
  metaInstabilityScore?: number;
}): MetaStrategicGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_meta_context",
      "Topology context is required to evaluate meta-strategic intelligence"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.metaSignals.length > DEFAULT_MAX_META_SIGNALS) {
    return reject(
      "too_many_meta_signals",
      `Meta signal count ${input.metaSignals.length} exceeds max ${DEFAULT_MAX_META_SIGNALS}`
    );
  }

  if ((input.strategicMetaCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_meta_orchestration",
      "Strategic meta-coherence score implies uncontrolled meta orchestration"
    );
  }

  if ((input.metaInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_meta_orchestration",
      "Meta instability score implies uncontrolled meta orchestration"
    );
  }

  for (const signal of input.metaSignals) {
    if (
      !Number.isFinite(signal.metaStrength) ||
      signal.metaStrength < 0 ||
      signal.metaStrength > 0.92
    ) {
      return reject(
        "invalid_meta_strength",
        `Meta strength ${signal.metaStrength} for ${signal.metaId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_meta_region",
          `Meta region ${regionId} is not in topology for ${signal.metaId}`
        );
      }
    }
  }

  if (input.priorMetaFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_meta_build",
      "Duplicate meta-strategic intelligence build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardMetaStrategicSemantics(input: {
  headline: string;
  summary: string;
}): MetaStrategicGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_meta_claim",
      "Meta-strategic semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedMetaText(combined)) {
    return reject(
      "fabricated_meta_conclusion",
      "Meta-strategic semantics imply fabricated meta conclusions or autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic governance")) {
    return reject(
      "autonomous_strategic_governance",
      "Meta-strategic semantics imply autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive intelligence")) {
    return reject(
      "unstable_recursive_intelligence",
      "Meta-strategic semantics imply unstable recursive intelligence"
    );
  }
  return { ok: true };
}
