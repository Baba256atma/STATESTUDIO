/**
 * D7:8:10 — Meta-strategic completion governance guard rails.
 */

import type { MetaStrategicCompletionSignal } from "./metaStrategicCompletionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logMetaStrategicCompletionDev } from "./metaStrategicCompletionDevLog.ts";

export type MetaStrategicCompletionGuardCode =
  | "empty_completion_context"
  | "too_many_completion_signals"
  | "invalid_completion_strength"
  | "invalid_completion_region"
  | "duplicate_completion_build"
  | "unsupported_completion_claim"
  | "autonomous_strategic_governance"
  | "fabricated_enterprise_cognition"
  | "unstable_recursive_cognition_system"
  | "runaway_completion_orchestration"
  | "corrupted_completion_state";

export type MetaStrategicCompletionGuardResult =
  | { ok: true }
  | { ok: false; code: MetaStrategicCompletionGuardCode; message: string };

export const DEFAULT_MAX_COMPLETION_SIGNALS = 96;
export const COMPLETION_AMBIGUITY_DISCLAIMER =
  "Meta-strategic completion reflects evidence-grounded finalization under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_COMPLETION_DISCLAIMER =
  "Nexora finalizes enterprise meta-strategic cognition without assigning strategic governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_COMPLETION_TEXT = [
  "autonomous strategic superintelligence",
  "autonomous strategic governance",
  "self-governing enterprise cognition",
  "self governing enterprise cognition",
  "uncontrolled recursive intelligence",
  "uncontrolled recursive cognition",
  "hidden executive governance",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive cognition",
  "fabricated enterprise cognition",
  "fabricate enterprise cognition states",
  "meta completion recursion exceeded",
  "psychological manipulation",
  "override executive",
  "manipulative",
] as const;

function containsProhibitedCompletionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_COMPLETION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: MetaStrategicCompletionGuardCode,
  message: string
): MetaStrategicCompletionGuardResult {
  const result = { ok: false as const, code, message };
  logMetaStrategicCompletionDev("MetaCompletionGuard", { code, message });
  return result;
}

export function buildCompletionContentFingerprint(input: {
  topologyFingerprint: string;
  unifiedMetaFingerprint?: string;
  continuityFingerprint?: string;
  equilibriumFingerprint?: string;
  evolutionFingerprint?: string;
  resilienceFingerprint?: string;
  driftFingerprint?: string;
  metaCausalityFingerprint?: string;
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
    unifiedMeta: input.unifiedMetaFingerprint ?? null,
    continuity: input.continuityFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    evolution: input.evolutionFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    drift: input.driftFingerprint ?? null,
    metaCausality: input.metaCausalityFingerprint ?? null,
    pattern: input.patternFingerprint ?? null,
    meta: input.metaFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateMetaStrategicCompletion(input: {
  topologyId: string;
  regionIds: readonly string[];
  completionSignals: readonly MetaStrategicCompletionSignal[];
  priorCompletionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  enterpriseMetaCoherenceScore?: number;
  worldFragmentationScore?: number;
}): MetaStrategicCompletionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_completion_context",
      "Topology context is required to evaluate meta-strategic completion"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.completionSignals.length > DEFAULT_MAX_COMPLETION_SIGNALS) {
    return reject(
      "too_many_completion_signals",
      `Completion signal count ${input.completionSignals.length} exceeds max ${DEFAULT_MAX_COMPLETION_SIGNALS}`
    );
  }

  if ((input.enterpriseMetaCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_completion_orchestration",
      "Enterprise meta-coherence score implies uncontrolled completion orchestration"
    );
  }

  if ((input.worldFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_completion_orchestration",
      "World fragmentation score implies uncontrolled completion orchestration"
    );
  }

  for (const signal of input.completionSignals) {
    if (
      !Number.isFinite(signal.completionStrength) ||
      signal.completionStrength < 0 ||
      signal.completionStrength > 0.92
    ) {
      return reject(
        "invalid_completion_strength",
        `Completion strength ${signal.completionStrength} for ${signal.completionId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_completion_region",
          `Completion region ${regionId} is not in topology for ${signal.completionId}`
        );
      }
    }
  }

  if (input.priorCompletionFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_completion_build",
      "Duplicate meta-strategic completion build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardMetaStrategicCompletionSemantics(input: {
  headline: string;
  summary: string;
}): MetaStrategicCompletionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_completion_claim",
      "Meta-strategic completion semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedCompletionText(combined)) {
    return reject(
      "fabricated_enterprise_cognition",
      "Meta-strategic completion semantics imply fabricated cognition or autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic governance")) {
    return reject(
      "autonomous_strategic_governance",
      "Meta-strategic completion semantics imply autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive cognition")) {
    return reject(
      "unstable_recursive_cognition_system",
      "Meta-strategic completion semantics imply unstable recursive cognition systems"
    );
  }
  return { ok: true };
}
