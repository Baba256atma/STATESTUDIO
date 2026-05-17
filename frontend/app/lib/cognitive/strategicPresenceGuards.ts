/**
 * D7:6:8 — Executive strategic presence governance guard rails.
 */

import type { ExecutiveStrategicPresenceSignal } from "./executiveStrategicPresenceTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveStrategicPresenceDev } from "./strategicPresenceDevLog.ts";

export type ExecutiveStrategicPresenceGuardCode =
  | "empty_presence_context"
  | "too_many_presence_signals"
  | "invalid_presence_strength"
  | "invalid_presence_region"
  | "duplicate_presence_build"
  | "unsupported_presence_claim"
  | "manipulative_engagement_system"
  | "addictive_awareness_loop"
  | "hidden_behavioral_tracking"
  | "runaway_presence_orchestration"
  | "corrupted_presence_state";

export type ExecutiveStrategicPresenceGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveStrategicPresenceGuardCode; message: string };

export const DEFAULT_MAX_PRESENCE_SIGNALS = 96;
export const PRESENCE_AMBIGUITY_DISCLAIMER =
  "Executive strategic presence reflects evidence-grounded situational awareness under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_PRESENCE_DISCLAIMER =
  "Nexora supports evidence-grounded strategic awareness without hidden steering; situational presence remains fully under executive authority.";

const PROHIBITED_PRESENCE_TEXT = [
  "psychological manipulation",
  "psychological conditioning",
  "behavioral surveillance",
  "hidden behavioral tracking",
  "hidden tracking",
  "emotional persuasion",
  "manipulative engagement",
  "manipulative attention",
  "addictive awareness",
  "addictive ux",
  "addictive engagement",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
  "surveillance system",
] as const;

function containsProhibitedPresenceText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_PRESENCE_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveStrategicPresenceGuardCode,
  message: string
): ExecutiveStrategicPresenceGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveStrategicPresenceDev("PresenceGuard", { code, message });
  return result;
}

export function buildPresenceContentFingerprint(input: {
  topologyFingerprint: string;
  immersionFingerprint?: string;
  timelineFingerprint?: string;
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
    immersion: input.immersionFingerprint ?? null,
    timeline: input.timelineFingerprint ?? null,
    narrative: input.narrativeFingerprint ?? null,
    insightPrioritization: input.insightPrioritizationFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveStrategicPresence(input: {
  topologyId: string;
  regionIds: readonly string[];
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  priorPresenceFingerprints?: readonly string[];
  pendingFingerprint?: string;
  situationalContinuityScore?: number;
  presenceFragmentationScore?: number;
}): ExecutiveStrategicPresenceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_presence_context",
      "Topology context is required to evaluate executive strategic presence"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.presenceSignals.length > DEFAULT_MAX_PRESENCE_SIGNALS) {
    return reject(
      "too_many_presence_signals",
      `Presence signal count ${input.presenceSignals.length} exceeds max ${DEFAULT_MAX_PRESENCE_SIGNALS}`
    );
  }

  if ((input.situationalContinuityScore ?? 0) > 0.95) {
    return reject(
      "runaway_presence_orchestration",
      "Situational continuity score implies uncontrolled presence orchestration"
    );
  }

  if ((input.presenceFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_presence_orchestration",
      "Presence fragmentation score implies uncontrolled presence orchestration"
    );
  }

  for (const signal of input.presenceSignals) {
    if (
      !Number.isFinite(signal.presenceStrength) ||
      signal.presenceStrength < 0 ||
      signal.presenceStrength > 0.92
    ) {
      return reject(
        "invalid_presence_strength",
        `Presence strength ${signal.presenceStrength} for ${signal.presenceId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_presence_region",
          `Presence region ${regionId} is not in topology for ${signal.presenceId}`
        );
      }
    }
  }

  if (input.priorPresenceFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_presence_build",
      "Duplicate executive strategic presence build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExecutiveStrategicPresenceSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveStrategicPresenceGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_presence_claim",
      "Presence semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedPresenceText(combined)) {
    return reject(
      "manipulative_engagement_system",
      "Presence semantics imply manipulative engagement or behavioral conditioning"
    );
  }
  if (combined.toLowerCase().includes("addictive awareness")) {
    return reject("addictive_awareness_loop", "Presence semantics imply compulsive awareness loops");
  }
  if (combined.toLowerCase().includes("hidden behavioral tracking")) {
    return reject("hidden_behavioral_tracking", "Presence semantics imply hidden behavioral tracking");
  }
  return { ok: true };
}
