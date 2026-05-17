/**
 * D7:3:8 — Ethical human-system resilience governance guard rails.
 */

import type { HumanSystemResilienceSignal } from "./humanSystemResilienceTypes.ts";
import { logHumanSystemResilienceDev } from "./humanSystemResilienceDevLog.ts";

export type HumanSystemResilienceGuardCode =
  | "empty_resilience_context"
  | "too_many_resilience_signals"
  | "invalid_resilience_intensity"
  | "invalid_resilience_region"
  | "duplicate_resilience_build"
  | "prohibited_behavioral_inference"
  | "invasive_resilience_analysis"
  | "corrupted_resilience_state";

export type HumanSystemResilienceGuardResult =
  | { ok: true }
  | { ok: false; code: HumanSystemResilienceGuardCode; message: string };

export const DEFAULT_MAX_RESILIENCE_SIGNALS = 96;
export const PROHIBITED_RESILIENCE_TEXT = [
  "personality",
  "emotion",
  "emotional",
  "psychological",
  "psychology",
  "mental",
  "health",
  "burnout",
  "fatigue",
  "depression",
  "anxiety",
  "manipulation",
  "surveillance",
] as const;

function reject(
  code: HumanSystemResilienceGuardCode,
  message: string
): HumanSystemResilienceGuardResult {
  const result = { ok: false as const, code, message };
  logHumanSystemResilienceDev("ResilienceGuard", { code, message });
  return result;
}

export function buildHumanSystemResilienceContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  frictionFingerprint?: string;
  influenceFingerprint?: string;
  trustFingerprint?: string;
  leadershipFingerprint?: string;
  alignmentFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    friction: input.frictionFingerprint ?? null,
    influence: input.influenceFingerprint ?? null,
    trust: input.trustFingerprint ?? null,
    leadership: input.leadershipFingerprint ?? null,
    alignment: input.alignmentFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedResilienceText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_RESILIENCE_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateHumanSystemResilience(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly HumanSystemResilienceSignal[];
  priorResilienceFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): HumanSystemResilienceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_resilience_context",
      "Topology context is required to evaluate human-system resilience"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_RESILIENCE_SIGNALS) {
    return reject(
      "too_many_resilience_signals",
      `Resilience signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_RESILIENCE_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_resilience_intensity",
        `Resilience signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_resilience_region",
          `Resilience signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedResilienceText(label)) {
      return reject(
        "invasive_resilience_analysis",
        `Resilience signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    for (const driver of signal.dominantResilienceDrivers ?? []) {
      if (containsProhibitedResilienceText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Resilience signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorResilienceFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_resilience_build",
      "Identical human-system resilience evaluation was already executed"
    );
  }

  return { ok: true };
}
