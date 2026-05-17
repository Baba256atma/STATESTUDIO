/**
 * D7:6:10 — Executive cognitive orchestration completion governance guard rails.
 */

import type { ExecutiveCognitiveCompletionSignal } from "./executiveCognitiveCompletionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveCognitiveCompletionDev } from "./cognitiveCompletionDevLog.ts";

export type ExecutiveCognitiveCompletionGuardCode =
  | "empty_completion_context"
  | "too_many_completion_signals"
  | "invalid_completion_strength"
  | "invalid_completion_region"
  | "duplicate_completion_build"
  | "unsupported_completion_claim"
  | "autonomous_cognition_authority"
  | "manipulative_orchestration_system"
  | "hidden_psychological_governance"
  | "runaway_completion_orchestration"
  | "corrupted_completion_state";

export type ExecutiveCognitiveCompletionGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveCognitiveCompletionGuardCode; message: string };

export const DEFAULT_MAX_COMPLETION_SIGNALS = 96;
export const COMPLETION_AMBIGUITY_DISCLAIMER =
  "Executive cognitive orchestration completion reflects evidence-grounded platform integration under current conditions and is indicative, not definitive.";
export const NON_AUTONOMOUS_COMPLETION_DISCLAIMER =
  "Nexora finalizes cognitive orchestration without autonomous authority; strategic decisions remain fully under executive control.";

const PROHIBITED_COMPLETION_TEXT = [
  "autonomous cognition authority",
  "autonomous executive cognition",
  "autonomous executive superintelligence",
  "self-governing cognition",
  "self governing cognition",
  "executive replacement ai",
  "executive replacement cognition",
  "hidden psychological governance",
  "hidden psychological orchestration",
  "psychological manipulation",
  "psychological conditioning",
  "manipulative orchestration",
  "manipulative cognition",
  "addictive executive loop",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
] as const;

function containsProhibitedCompletionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_COMPLETION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveCognitiveCompletionGuardCode,
  message: string
): ExecutiveCognitiveCompletionGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveCognitiveCompletionDev("CompletionGuard", { code, message });
  return result;
}

export function buildCompletionContentFingerprint(input: {
  topologyFingerprint: string;
  environmentFingerprint?: string;
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
    environment: input.environmentFingerprint ?? null,
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

export function guardEvaluateExecutiveCognitiveCompletion(input: {
  topologyId: string;
  regionIds: readonly string[];
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  priorCompletionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  overallCognitiveCoherenceScore?: number;
  platformCoherenceDegradationScore?: number;
}): ExecutiveCognitiveCompletionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_completion_context",
      "Topology context is required to evaluate executive cognitive completion"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.completionSignals.length > DEFAULT_MAX_COMPLETION_SIGNALS) {
    return reject(
      "too_many_completion_signals",
      `Completion signal count ${input.completionSignals.length} exceeds max ${DEFAULT_MAX_COMPLETION_SIGNALS}`
    );
  }

  if ((input.overallCognitiveCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_completion_orchestration",
      "Overall cognitive coherence score implies uncontrolled completion orchestration"
    );
  }

  if ((input.platformCoherenceDegradationScore ?? 0) > 0.95) {
    return reject(
      "runaway_completion_orchestration",
      "Platform coherence degradation score implies uncontrolled completion orchestration"
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
      "Duplicate executive cognitive completion build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExecutiveCognitiveCompletionSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveCognitiveCompletionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_completion_claim",
      "Completion semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedCompletionText(combined)) {
    return reject(
      "manipulative_orchestration_system",
      "Completion semantics imply manipulative orchestration or autonomous cognition authority"
    );
  }
  if (combined.toLowerCase().includes("autonomous cognition authority")) {
    return reject(
      "autonomous_cognition_authority",
      "Completion semantics imply autonomous cognition authority"
    );
  }
  if (combined.toLowerCase().includes("hidden psychological governance")) {
    return reject(
      "hidden_psychological_governance",
      "Completion semantics imply hidden psychological governance"
    );
  }
  return { ok: true };
}
