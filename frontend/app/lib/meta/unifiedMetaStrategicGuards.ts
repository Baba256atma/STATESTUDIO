/**
 * D7:8:9 — Unified meta-strategic governance guard rails.
 */

import type { UnifiedMetaStrategicSignal } from "./unifiedMetaStrategicTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logUnifiedMetaStrategicDev } from "./unifiedMetaStrategicDevLog.ts";

export type UnifiedMetaStrategicGuardCode =
  | "empty_unified_meta_context"
  | "too_many_unified_meta_signals"
  | "invalid_unified_meta_strength"
  | "invalid_unified_meta_region"
  | "duplicate_unified_meta_build"
  | "unsupported_unified_meta_claim"
  | "autonomous_strategic_governance"
  | "fabricated_strategic_intelligence"
  | "unstable_recursive_cognition_system"
  | "runaway_unified_meta_orchestration"
  | "corrupted_unified_meta_state";

export type UnifiedMetaStrategicGuardResult =
  | { ok: true }
  | { ok: false; code: UnifiedMetaStrategicGuardCode; message: string };

export const DEFAULT_MAX_UNIFIED_META_SIGNALS = 96;
export const UNIFIED_META_AMBIGUITY_DISCLAIMER =
  "Unified meta-strategic intelligence reflects evidence-grounded synthesis under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER =
  "Nexora unifies strategic intelligence layers without assigning strategic governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_UNIFIED_META_TEXT = [
  "autonomous strategic superintelligence",
  "autonomous strategic governance",
  "self-governing executive cognition",
  "self governing executive cognition",
  "uncontrolled recursive intelligence",
  "uncontrolled recursive cognition",
  "hidden strategic manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive cognition",
  "fabricated strategic intelligence",
  "fabricate strategic realities",
  "unified meta recursion exceeded",
  "psychological manipulation",
  "override executive",
  "manipulative",
] as const;

function containsProhibitedUnifiedMetaText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_UNIFIED_META_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: UnifiedMetaStrategicGuardCode,
  message: string
): UnifiedMetaStrategicGuardResult {
  const result = { ok: false as const, code, message };
  logUnifiedMetaStrategicDev("UnifiedMetaGuard", { code, message });
  return result;
}

export function buildUnifiedMetaContentFingerprint(input: {
  topologyFingerprint: string;
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

export function guardEvaluateUnifiedMetaStrategicIntelligence(input: {
  topologyId: string;
  regionIds: readonly string[];
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  priorUnifiedMetaFingerprints?: readonly string[];
  pendingFingerprint?: string;
  unifiedStrategicCoherenceScore?: number;
  ecosystemFragmentationScore?: number;
}): UnifiedMetaStrategicGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_unified_meta_context",
      "Topology context is required to evaluate unified meta-strategic intelligence"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.unifiedMetaSignals.length > DEFAULT_MAX_UNIFIED_META_SIGNALS) {
    return reject(
      "too_many_unified_meta_signals",
      `Unified meta signal count ${input.unifiedMetaSignals.length} exceeds max ${DEFAULT_MAX_UNIFIED_META_SIGNALS}`
    );
  }

  if ((input.unifiedStrategicCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_unified_meta_orchestration",
      "Unified strategic coherence score implies uncontrolled unified meta orchestration"
    );
  }

  if ((input.ecosystemFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_unified_meta_orchestration",
      "Ecosystem fragmentation score implies uncontrolled unified meta orchestration"
    );
  }

  for (const signal of input.unifiedMetaSignals) {
    if (
      !Number.isFinite(signal.unifiedMetaStrength) ||
      signal.unifiedMetaStrength < 0 ||
      signal.unifiedMetaStrength > 0.92
    ) {
      return reject(
        "invalid_unified_meta_strength",
        `Unified meta strength ${signal.unifiedMetaStrength} for ${signal.unifiedMetaId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_unified_meta_region",
          `Unified meta region ${regionId} is not in topology for ${signal.unifiedMetaId}`
        );
      }
    }
  }

  if (input.priorUnifiedMetaFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_unified_meta_build",
      "Duplicate unified meta-strategic intelligence build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardUnifiedMetaStrategicSemantics(input: {
  headline: string;
  summary: string;
}): UnifiedMetaStrategicGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_unified_meta_claim",
      "Unified meta semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedUnifiedMetaText(combined)) {
    return reject(
      "fabricated_strategic_intelligence",
      "Unified meta semantics imply fabricated intelligence or autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic governance")) {
    return reject(
      "autonomous_strategic_governance",
      "Unified meta semantics imply autonomous strategic governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive cognition")) {
    return reject(
      "unstable_recursive_cognition_system",
      "Unified meta semantics imply unstable recursive cognition systems"
    );
  }
  return { ok: true };
}
