/**
 * D7:5:3 — Executive tradeoff governance guard rails.
 */

import type { StrategicTradeoffSignal } from "./tradeoffAnalysisTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logTradeoffDev } from "./tradeoffDevLog.ts";

export type TradeoffGuardCode =
  | "empty_tradeoff_context"
  | "too_many_tradeoff_signals"
  | "invalid_tradeoff_strength"
  | "invalid_tradeoff_region"
  | "duplicate_tradeoff_build"
  | "unsupported_tradeoff_claim"
  | "autonomous_strategy_selection"
  | "runaway_tradeoff_amplification"
  | "corrupted_tradeoff_state";

export type TradeoffGuardResult =
  | { ok: true }
  | { ok: false; code: TradeoffGuardCode; message: string };

export const DEFAULT_MAX_TRADEOFF_SIGNALS = 96;
export const TRADEOFF_UNCERTAINTY_DISCLAIMER =
  "Executive tradeoff analysis reflects competing consequences under current conditions and is indicative, not definitive.";
export const NON_SELECTION_DISCLAIMER =
  "Strategy selection remains fully under executive control; Nexora never mandates a chosen path.";

const PROHIBITED_SELECTION_TEXT = [
  "auto-select",
  "automatically choose",
  "automatically select",
  "autonomous strategy selection",
  "override executive",
  "hidden prioritization",
] as const;

function containsAutonomousSelectionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_SELECTION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(code: TradeoffGuardCode, message: string): TradeoffGuardResult {
  const result = { ok: false as const, code, message };
  logTradeoffDev("TradeoffGuard", { code, message });
  return result;
}

export function buildTradeoffContentFingerprint(input: {
  topologyFingerprint: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  foresightFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveTradeoffs(input: {
  topologyId: string;
  regionIds: readonly string[];
  tradeoffs: readonly StrategicTradeoffSignal[];
  priorTradeoffFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicBalanceScore?: number;
  benefitAsymmetryScore?: number;
}): TradeoffGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_tradeoff_context",
      "Topology context is required to evaluate executive tradeoffs"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.tradeoffs.length > DEFAULT_MAX_TRADEOFF_SIGNALS) {
    return reject(
      "too_many_tradeoff_signals",
      `Tradeoff signal count ${input.tradeoffs.length} exceeds max ${DEFAULT_MAX_TRADEOFF_SIGNALS}`
    );
  }

  if ((input.strategicBalanceScore ?? 0) > 0.95) {
    return reject(
      "runaway_tradeoff_amplification",
      "Strategic balance score implies uncontrolled tradeoff amplification"
    );
  }

  if ((input.benefitAsymmetryScore ?? 0) > 0.95) {
    return reject(
      "runaway_tradeoff_amplification",
      "Benefit asymmetry score implies uncontrolled tradeoff amplification"
    );
  }

  for (const tradeoff of input.tradeoffs) {
    if (tradeoff.tradeoffStrength < 0 || tradeoff.tradeoffStrength > 1) {
      return reject(
        "invalid_tradeoff_strength",
        `Tradeoff signal ${tradeoff.tradeoffId} strength must be between 0 and 1`
      );
    }
    if (tradeoff.tradeoffStrength > 0.92) {
      return reject(
        "unsupported_tradeoff_claim",
        `Tradeoff signal ${tradeoff.tradeoffId} strength implies excessive certainty`
      );
    }
    for (const regionId of tradeoff.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_tradeoff_region",
          `Tradeoff signal ${tradeoff.tradeoffId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(tradeoff.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_tradeoff_claim",
        `Tradeoff signal ${tradeoff.tradeoffId} contains prohibited certainty language`
      );
    }
    if (containsAutonomousSelectionText(label)) {
      return reject(
        "autonomous_strategy_selection",
        `Tradeoff signal ${tradeoff.tradeoffId} contains prohibited autonomous selection language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorTradeoffFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_tradeoff_build",
      "Identical executive tradeoff evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardTradeoffExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): TradeoffGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_tradeoff_claim",
      "Tradeoff headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_tradeoff_claim",
      "Tradeoff summary contains prohibited certainty language"
    );
  }
  if (containsAutonomousSelectionText(input.headline)) {
    return reject(
      "autonomous_strategy_selection",
      "Tradeoff headline contains prohibited autonomous selection language"
    );
  }
  if (containsAutonomousSelectionText(input.summary)) {
    return reject(
      "autonomous_strategy_selection",
      "Tradeoff summary contains prohibited autonomous selection language"
    );
  }
  return { ok: true };
}
