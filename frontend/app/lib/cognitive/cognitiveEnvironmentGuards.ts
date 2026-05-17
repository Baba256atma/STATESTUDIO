/**
 * D7:6:9 — Unified executive cognitive environment governance guard rails.
 */

import type { UnifiedExecutiveEnvironmentSignal } from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logUnifiedExecutiveCognitiveEnvironmentDev } from "./cognitiveEnvironmentDevLog.ts";

export type UnifiedExecutiveCognitiveEnvironmentGuardCode =
  | "empty_environment_context"
  | "too_many_environment_signals"
  | "invalid_environment_strength"
  | "invalid_environment_region"
  | "duplicate_environment_build"
  | "unsupported_environment_claim"
  | "manipulative_cognition_environment"
  | "addictive_executive_loop"
  | "hidden_psychological_orchestration"
  | "runaway_environment_orchestration"
  | "corrupted_environment_state";

export type UnifiedExecutiveCognitiveEnvironmentGuardResult =
  | { ok: true }
  | { ok: false; code: UnifiedExecutiveCognitiveEnvironmentGuardCode; message: string };

export const DEFAULT_MAX_ENVIRONMENT_SIGNALS = 96;
export const ENVIRONMENT_AMBIGUITY_DISCLAIMER =
  "Unified executive cognitive environment reflects evidence-grounded integration under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_ENVIRONMENT_DISCLAIMER =
  "Nexora supports evidence-grounded unified cognition without hidden steering; the executive environment remains fully under executive authority.";

const PROHIBITED_ENVIRONMENT_TEXT = [
  "psychological manipulation",
  "psychological conditioning",
  "hidden psychological orchestration",
  "hidden psychological",
  "manipulative cognition environment",
  "manipulative cognition",
  "addictive executive loop",
  "addictive executive",
  "addictive ux",
  "addictive engagement",
  "autonomous executive cognition",
  "emotional persuasion",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
  "behavioral surveillance",
] as const;

function containsProhibitedEnvironmentText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ENVIRONMENT_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: UnifiedExecutiveCognitiveEnvironmentGuardCode,
  message: string
): UnifiedExecutiveCognitiveEnvironmentGuardResult {
  const result = { ok: false as const, code, message };
  logUnifiedExecutiveCognitiveEnvironmentDev("EnvironmentGuard", { code, message });
  return result;
}

export function buildEnvironmentContentFingerprint(input: {
  topologyFingerprint: string;
  presenceFingerprint?: string;
  immersionFingerprint?: string;
  timelineFingerprint?: string;
  narrativeFingerprint?: string;
  insightPrioritizationFingerprint?: string;
  attentionFingerprint?: string;
  cognitiveLoadFingerprint?: string;
  cognitiveUxFingerprint?: string;
  foresightFingerprint?: string;
  orchestrationFingerprint?: string;
  governanceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    presence: input.presenceFingerprint ?? null,
    immersion: input.immersionFingerprint ?? null,
    timeline: input.timelineFingerprint ?? null,
    narrative: input.narrativeFingerprint ?? null,
    insightPrioritization: input.insightPrioritizationFingerprint ?? null,
    attention: input.attentionFingerprint ?? null,
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
    cognitiveUx: input.cognitiveUxFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateUnifiedExecutiveEnvironment(input: {
  topologyId: string;
  regionIds: readonly string[];
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  priorEnvironmentFingerprints?: readonly string[];
  pendingFingerprint?: string;
  environmentCoherenceScore?: number;
  environmentFragmentationScore?: number;
}): UnifiedExecutiveCognitiveEnvironmentGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_environment_context",
      "Topology context is required to evaluate unified executive cognitive environment"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.environmentSignals.length > DEFAULT_MAX_ENVIRONMENT_SIGNALS) {
    return reject(
      "too_many_environment_signals",
      `Environment signal count ${input.environmentSignals.length} exceeds max ${DEFAULT_MAX_ENVIRONMENT_SIGNALS}`
    );
  }

  if ((input.environmentCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_environment_orchestration",
      "Environment coherence score implies uncontrolled environment orchestration"
    );
  }

  if ((input.environmentFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_environment_orchestration",
      "Environment fragmentation score implies uncontrolled environment orchestration"
    );
  }

  for (const signal of input.environmentSignals) {
    if (
      !Number.isFinite(signal.environmentStrength) ||
      signal.environmentStrength < 0 ||
      signal.environmentStrength > 0.92
    ) {
      return reject(
        "invalid_environment_strength",
        `Environment strength ${signal.environmentStrength} for ${signal.environmentId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_environment_region",
          `Environment region ${regionId} is not in topology for ${signal.environmentId}`
        );
      }
    }
  }

  if (input.priorEnvironmentFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_environment_build",
      "Duplicate unified executive cognitive environment build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardUnifiedExecutiveCognitiveEnvironmentSemantics(input: {
  headline: string;
  summary: string;
}): UnifiedExecutiveCognitiveEnvironmentGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_environment_claim",
      "Environment semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEnvironmentText(combined)) {
    return reject(
      "manipulative_cognition_environment",
      "Environment semantics imply manipulative cognition environments or hidden orchestration"
    );
  }
  if (combined.toLowerCase().includes("addictive executive loop")) {
    return reject("addictive_executive_loop", "Environment semantics imply compulsive executive loops");
  }
  if (combined.toLowerCase().includes("hidden psychological orchestration")) {
    return reject(
      "hidden_psychological_orchestration",
      "Environment semantics imply hidden psychological orchestration"
    );
  }
  return { ok: true };
}
