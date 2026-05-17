/**
 * D7:6:6 — Executive cognitive timeline governance guard rails.
 */

import type { ExecutiveTimelineSignal } from "./executiveCognitiveTimelineTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveCognitiveTimelineDev } from "./cognitiveTimelineDevLog.ts";

export type ExecutiveCognitiveTimelineGuardCode =
  | "empty_timeline_context"
  | "too_many_timeline_signals"
  | "invalid_timeline_strength"
  | "invalid_timeline_region"
  | "duplicate_timeline_build"
  | "unsupported_timeline_claim"
  | "fabricated_future_timeline"
  | "manipulative_urgency_framing"
  | "hidden_temporal_persuasion"
  | "runaway_timeline_generation"
  | "corrupted_timeline_state";

export type ExecutiveCognitiveTimelineGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveCognitiveTimelineGuardCode; message: string };

export const DEFAULT_MAX_TIMELINE_SIGNALS = 96;
export const TIMELINE_AMBIGUITY_DISCLAIMER =
  "Executive cognitive timeline intelligence reflects evidence-grounded temporal indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_TIMELINE_DISCLAIMER =
  "Nexora does not assert unsupported future timelines or manipulate urgency perception; temporal cognition remains fully under executive authority.";

const PROHIBITED_TIMELINE_TEXT = [
  "fabricated future timeline",
  "fabricate future",
  "deterministic prophecy",
  "manipulative temporal",
  "hidden temporal persuasion",
  "emotional persuasion",
  "propaganda",
  "psychological manipulation",
  "hidden executive steering",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
] as const;

function containsProhibitedTimelineText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_TIMELINE_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveCognitiveTimelineGuardCode,
  message: string
): ExecutiveCognitiveTimelineGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveCognitiveTimelineDev("TimelineGuard", { code, message });
  return result;
}

export function buildTimelineContentFingerprint(input: {
  topologyFingerprint: string;
  narrativeFingerprint?: string;
  insightPrioritizationFingerprint?: string;
  foresightFingerprint?: string;
  cognitiveLoadFingerprint?: string;
  orchestrationFingerprint?: string;
  governanceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    narrative: input.narrativeFingerprint ?? null,
    insightPrioritization: input.insightPrioritizationFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveCognitiveTimelines(input: {
  topologyId: string;
  regionIds: readonly string[];
  timelineSignals: readonly ExecutiveTimelineSignal[];
  priorTimelineFingerprints?: readonly string[];
  pendingFingerprint?: string;
  timelineClarityScore?: number;
  timelineFragmentationScore?: number;
}): ExecutiveCognitiveTimelineGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_timeline_context",
      "Topology context is required to evaluate executive cognitive timelines"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.timelineSignals.length > DEFAULT_MAX_TIMELINE_SIGNALS) {
    return reject(
      "too_many_timeline_signals",
      `Timeline signal count ${input.timelineSignals.length} exceeds max ${DEFAULT_MAX_TIMELINE_SIGNALS}`
    );
  }

  if ((input.timelineClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_timeline_generation",
      "Timeline clarity score implies uncontrolled timeline generation"
    );
  }

  if ((input.timelineFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_timeline_generation",
      "Timeline fragmentation score implies uncontrolled timeline generation"
    );
  }

  for (const signal of input.timelineSignals) {
    if (
      !Number.isFinite(signal.timelineStrength) ||
      signal.timelineStrength < 0 ||
      signal.timelineStrength > 0.92
    ) {
      return reject(
        "invalid_timeline_strength",
        `Timeline strength ${signal.timelineStrength} for ${signal.timelineId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_timeline_region",
          `Timeline region ${regionId} is not in topology for ${signal.timelineId}`
        );
      }
    }
  }

  if (input.priorTimelineFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_timeline_build",
      "Duplicate executive cognitive timeline build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExecutiveCognitiveTimelineSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveCognitiveTimelineGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_timeline_claim",
      "Timeline semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedTimelineText(combined)) {
    return reject(
      "fabricated_future_timeline",
      "Timeline semantics imply fabricated futures or manipulative temporal framing"
    );
  }
  if (combined.toLowerCase().includes("hidden temporal persuasion")) {
    return reject(
      "hidden_temporal_persuasion",
      "Timeline semantics imply hidden temporal persuasion"
    );
  }
  if (combined.toLowerCase().includes("manipulative urgency")) {
    return reject(
      "manipulative_urgency_framing",
      "Timeline semantics imply manipulative urgency framing"
    );
  }
  return { ok: true };
}
