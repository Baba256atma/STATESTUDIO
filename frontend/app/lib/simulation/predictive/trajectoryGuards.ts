/**
 * D7:4:1 — Predictive future trajectory governance guard rails.
 */

import type { FutureTrajectorySignal } from "./futureTrajectoryTypes.ts";
import { logTrajectoryDev } from "./trajectoryDevLog.ts";

export type TrajectoryGuardCode =
  | "empty_trajectory_context"
  | "too_many_trajectory_signals"
  | "invalid_directional_confidence"
  | "invalid_trajectory_region"
  | "duplicate_trajectory_build"
  | "false_certainty_language"
  | "unsupported_trajectory_claim"
  | "corrupted_trajectory_state";

export type TrajectoryGuardResult =
  | { ok: true }
  | { ok: false; code: TrajectoryGuardCode; message: string };

export const DEFAULT_MAX_TRAJECTORY_SIGNALS = 96;
export const UNCERTAINTY_DISCLAIMER =
  "Directional trajectories reflect current operational conditions and are indicative, not definitive forecasts.";

export const PROHIBITED_CERTAINTY_TEXT = [
  "guaranteed",
  "certain",
  "certainty",
  "will definitely",
  "definitely will",
  "prophecy",
  "guarantee",
  "100%",
  "inevitable",
  "certainly",
] as const;

function reject(code: TrajectoryGuardCode, message: string): TrajectoryGuardResult {
  const result = { ok: false as const, code, message };
  logTrajectoryDev("TrajectoryGuard", { code, message });
  return result;
}

export function buildTrajectoryContentFingerprint(input: {
  topologyFingerprint: string;
  momentumFingerprint?: string;
  equilibriumFingerprint?: string;
  resilienceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    momentum: input.momentumFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsFalseCertaintyText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_CERTAINTY_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateFutureTrajectories(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly FutureTrajectorySignal[];
  priorTrajectoryFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): TrajectoryGuardResult {
  if (!input.topologyId) {
    return reject("empty_trajectory_context", "Topology context is required to evaluate future trajectories");
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_TRAJECTORY_SIGNALS) {
    return reject(
      "too_many_trajectory_signals",
      `Trajectory signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_TRAJECTORY_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.directionalConfidence < 0 || signal.directionalConfidence > 1) {
      return reject(
        "invalid_directional_confidence",
        `Trajectory signal ${signal.signalId} directional confidence must be between 0 and 1`
      );
    }
    if (signal.directionalConfidence > 0.92) {
      return reject(
        "false_certainty_language",
        `Trajectory signal ${signal.signalId} directional confidence implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_trajectory_region",
          `Trajectory signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_trajectory_claim",
        `Trajectory signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorTrajectoryFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_trajectory_build",
      "Identical predictive trajectory evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardTrajectoryExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): TrajectoryGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_trajectory_claim",
      "Trajectory headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_trajectory_claim",
      "Trajectory summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
