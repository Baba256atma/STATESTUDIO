/**
 * D7:4:2 — Multi-future divergence governance guard rails.
 */

import type { FutureBranchRecord, FutureDivergenceSignal } from "./multiFutureDivergenceTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logDivergenceDev } from "./divergenceDevLog.ts";

export type DivergenceGuardCode =
  | "empty_divergence_context"
  | "too_many_divergence_signals"
  | "too_many_future_branches"
  | "invalid_divergence_intensity"
  | "invalid_future_branch"
  | "duplicate_divergence_build"
  | "false_certainty_language"
  | "unsupported_divergence_claim"
  | "corrupted_divergence_state";

export type DivergenceGuardResult =
  | { ok: true }
  | { ok: false; code: DivergenceGuardCode; message: string };

export const DEFAULT_MAX_DIVERGENCE_SIGNALS = 64;
export const DEFAULT_MAX_FUTURE_BRANCHES = 12;
export const DIVERGENCE_UNCERTAINTY_DISCLAIMER =
  "Multi-future divergence reflects branching patterns under current conditions and is indicative, not definitive.";

function reject(code: DivergenceGuardCode, message: string): DivergenceGuardResult {
  const result = { ok: false as const, code, message };
  logDivergenceDev("DivergenceGuard", { code, message });
  return result;
}

export function buildDivergenceContentFingerprint(input: {
  topologyFingerprint: string;
  trajectoryFingerprint?: string;
  momentumFingerprint?: string;
  resilienceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    trajectory: input.trajectoryFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateFutureDivergence(input: {
  topologyId: string;
  knownBranchIds: readonly string[];
  signals: readonly FutureDivergenceSignal[];
  branches: readonly FutureBranchRecord[];
  priorDivergenceFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): DivergenceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_divergence_context",
      "Topology context is required to evaluate multi-future divergence"
    );
  }

  const branchSet = new Set(input.knownBranchIds);

  if (input.signals.length > DEFAULT_MAX_DIVERGENCE_SIGNALS) {
    return reject(
      "too_many_divergence_signals",
      `Divergence signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_DIVERGENCE_SIGNALS}`
    );
  }

  if (input.branches.length > DEFAULT_MAX_FUTURE_BRANCHES) {
    return reject(
      "too_many_future_branches",
      `Future branch count ${input.branches.length} exceeds max ${DEFAULT_MAX_FUTURE_BRANCHES}`
    );
  }

  for (const signal of input.signals) {
    if (signal.divergenceIntensity < 0 || signal.divergenceIntensity > 1) {
      return reject(
        "invalid_divergence_intensity",
        `Divergence signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    if (signal.divergenceIntensity > 0.92) {
      return reject(
        "false_certainty_language",
        `Divergence signal ${signal.signalId} intensity implies excessive certainty`
      );
    }
    for (const branchId of signal.futureBranchIds) {
      if (!branchSet.has(branchId)) {
        return reject(
          "invalid_future_branch",
          `Divergence signal ${signal.signalId} references unsupported branch ${branchId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_divergence_claim",
        `Divergence signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  for (const branch of input.branches) {
    if (branch.branchStrength < 0 || branch.branchStrength > 1) {
      return reject(
        "corrupted_divergence_state",
        `Future branch ${branch.branchId} strength must be between 0 and 1`
      );
    }
    if (containsFalseCertaintyText(branch.explanation)) {
      return reject(
        "unsupported_divergence_claim",
        `Future branch ${branch.branchId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorDivergenceFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_divergence_build",
      "Identical multi-future divergence evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardDivergenceExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): DivergenceGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_divergence_claim",
      "Divergence headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_divergence_claim",
      "Divergence summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
