/**
 * D7:6:5 — Executive narrative intelligence governance guard rails.
 */

import type { ExecutiveNarrativeSignal } from "./executiveNarrativeTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveNarrativeDev } from "./narrativeIntelligenceDevLog.ts";

export type ExecutiveNarrativeGuardCode =
  | "empty_narrative_context"
  | "too_many_narrative_signals"
  | "invalid_narrative_strength"
  | "invalid_narrative_region"
  | "duplicate_narrative_build"
  | "unsupported_narrative_claim"
  | "manipulative_storytelling"
  | "fabricated_narrative"
  | "emotional_persuasion_detected"
  | "runaway_narrative_generation"
  | "corrupted_narrative_state";

export type ExecutiveNarrativeGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveNarrativeGuardCode; message: string };

export const DEFAULT_MAX_NARRATIVE_SIGNALS = 96;
export const NARRATIVE_AMBIGUITY_DISCLAIMER =
  "Executive narrative intelligence reflects evidence-grounded synthesis under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_NARRATIVE_DISCLAIMER =
  "Nexora does not influence executive emotions or persuasion; narrative synthesis remains fully under executive authority.";

const PROHIBITED_NARRATIVE_TEXT = [
  "psychological manipulation",
  "emotional persuasion",
  "propaganda",
  "fabricated narrative",
  "fabricate strategic",
  "manipulative storytelling",
  "hidden persuasion",
  "behavioral conditioning",
  "addictive urgency",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
] as const;

function containsProhibitedNarrativeText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_NARRATIVE_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveNarrativeGuardCode,
  message: string
): ExecutiveNarrativeGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveNarrativeDev("NarrativeGuard", { code, message });
  return result;
}

export function buildNarrativeContentFingerprint(input: {
  topologyFingerprint: string;
  insightPrioritizationFingerprint?: string;
  explainabilityFingerprint?: string;
  advisoryFingerprint?: string;
  cognitiveLoadFingerprint?: string;
  orchestrationFingerprint?: string;
  governanceFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    insightPrioritization: input.insightPrioritizationFingerprint ?? null,
    explainability: input.explainabilityFingerprint ?? null,
    advisory: input.advisoryFingerprint ?? null,
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveNarratives(input: {
  topologyId: string;
  regionIds: readonly string[];
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  priorNarrativeFingerprints?: readonly string[];
  pendingFingerprint?: string;
  narrativeClarityScore?: number;
  narrativeFragmentationScore?: number;
}): ExecutiveNarrativeGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_narrative_context",
      "Topology context is required to evaluate executive narratives"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.narrativeSignals.length > DEFAULT_MAX_NARRATIVE_SIGNALS) {
    return reject(
      "too_many_narrative_signals",
      `Narrative signal count ${input.narrativeSignals.length} exceeds max ${DEFAULT_MAX_NARRATIVE_SIGNALS}`
    );
  }

  if ((input.narrativeClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_narrative_generation",
      "Narrative clarity score implies uncontrolled narrative generation"
    );
  }

  if ((input.narrativeFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_narrative_generation",
      "Narrative fragmentation score implies uncontrolled narrative generation"
    );
  }

  for (const signal of input.narrativeSignals) {
    if (
      !Number.isFinite(signal.narrativeStrength) ||
      signal.narrativeStrength < 0 ||
      signal.narrativeStrength > 0.92
    ) {
      return reject(
        "invalid_narrative_strength",
        `Narrative strength ${signal.narrativeStrength} for ${signal.narrativeId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_narrative_region",
          `Narrative region ${regionId} is not in topology for ${signal.narrativeId}`
        );
      }
    }
  }

  if (input.priorNarrativeFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_narrative_build",
      "Duplicate executive narrative build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExecutiveNarrativeSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveNarrativeGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_narrative_claim",
      "Narrative semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedNarrativeText(combined)) {
    return reject(
      "manipulative_storytelling",
      "Narrative semantics imply manipulative storytelling or emotional persuasion"
    );
  }
  if (combined.toLowerCase().includes("fabricated narrative")) {
    return reject("fabricated_narrative", "Narrative semantics imply fabricated strategic narratives");
  }
  if (combined.toLowerCase().includes("emotional persuasion")) {
    return reject(
      "emotional_persuasion_detected",
      "Narrative semantics imply emotional persuasion systems"
    );
  }
  return { ok: true };
}
