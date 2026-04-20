/**
 * B.23 — Tunable, governable adaptive bias (deterministic; frontend-only).
 */

import type { NexoraAdaptiveBiasResult } from "./nexoraAdaptiveBiasContract.ts";
import type { NexoraDecisionQualityReport } from "./nexoraDecisionQuality.ts";
import {
  DEFAULT_NEXORA_BIAS_GOVERNANCE,
  type NexoraBiasGovernanceConfig,
  type NexoraBiasGovernanceResult,
} from "./nexoraBiasGovernanceContract.ts";
import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import { modeToBiasEnabled, type NexoraMode } from "../product/nexoraMode.ts";
import type { NexoraScenarioMemoryEntry } from "../scenario/nexoraScenarioMemory.ts";
import { buildAdaptiveBias } from "./nexoraAdaptiveBias.ts";

export type { NexoraBiasGovernanceConfig, NexoraBiasGovernanceResult } from "./nexoraBiasGovernanceContract.ts";
export { DEFAULT_NEXORA_BIAS_GOVERNANCE } from "./nexoraBiasGovernanceContract.ts";

export type NexoraBiasLayerContext = {
  operatorMode: NexoraMode;
  config: NexoraBiasGovernanceConfig;
  governance: NexoraBiasGovernanceResult;
  rawBias: NexoraAdaptiveBiasResult | null;
  governedBiasForPick: NexoraAdaptiveBiasResult | null;
  biasStrengthBand: "soft" | "strong";
};

const LS_KEY = "nexora.biasGovernance.v1";

export const BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT = "nexora:bias_governance_config" as const;

const b23Logged = new Set<string>();

export function emitBiasGovernanceReadyDev(key: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (b23Logged.has(key)) return;
  b23Logged.add(key);
  globalThis.console?.debug?.("[Nexora][B23] bias_governance_ready", { key });
}

export function buildBiasGovernanceLogKey(
  config: NexoraBiasGovernanceConfig,
  qualitySignature: string,
  rawBias: NexoraAdaptiveBiasResult | null,
  gov: NexoraBiasGovernanceResult,
  operatorMode: NexoraMode = "adaptive"
): string {
  const biasSig = rawBias
    ? `${rawBias.confidence}:${rawBias.preferredOptionId ?? "-"}:${rawBias.discouragedOptionId ?? "-"}`
    : "-";
  const cfgSig = `${config.enabled}|${config.strength}|${config.minRatedRuns}|${config.allowPreferredOptionBias ? 1 : 0}|${
    config.allowDiscouragedOptionBias ? 1 : 0
  }`;
  return `${cfgSig}|${qualitySignature}|${biasSig}|${gov.blocked}|${gov.effectiveStrength.toFixed(3)}|m:${operatorMode}`;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function effectiveStrengthToMode(s: number): "none" | "hint_only" | "soft" | "strong" {
  if (s <= 0) return "none";
  if (s <= 0.3) return "hint_only";
  if (s <= 0.6) return "soft";
  return "strong";
}

export function resolveBiasGovernance(
  config: NexoraBiasGovernanceConfig,
  quality: NexoraDecisionQualityReport | null,
  bias: NexoraAdaptiveBiasResult | null,
  opts?: { operatorMode?: NexoraMode }
): NexoraBiasGovernanceResult {
  if (!config.enabled) {
    return {
      enabled: false,
      effectiveStrength: 0,
      blocked: true,
      blockReason: "disabled",
      summary:
        opts?.operatorMode === "pure"
          ? "Pure mode: no historical bias applied to recommendations."
          : "Adaptive bias off: disabled by policy.",
    };
  }
  if (!quality) {
    return {
      enabled: true,
      effectiveStrength: 0,
      blocked: true,
      blockReason: "no_quality",
      summary: "Adaptive bias limited: missing quality snapshot.",
    };
  }
  if (quality.totalRatedRuns < config.minRatedRuns) {
    return {
      enabled: true,
      effectiveStrength: 0,
      blocked: true,
      blockReason: "insufficient_runs",
      summary: "Adaptive bias limited: not enough rated runs.",
    };
  }
  if (quality.qualityTier === "low") {
    return {
      enabled: true,
      effectiveStrength: 0,
      blocked: true,
      blockReason: "low_quality",
      summary: "Adaptive bias off: low decision quality.",
    };
  }
  if (bias == null) {
    return {
      enabled: true,
      effectiveStrength: 0,
      blocked: true,
      blockReason: "no_bias",
      summary: "Adaptive bias limited: no adaptive signal.",
    };
  }

  let mult = 1;
  if (bias.confidence === "low") mult = 0.12;
  else if (bias.confidence === "medium") mult = 0.82;
  else mult = 1;

  if (quality.qualityTier === "medium") mult *= 0.92;

  let effective = clamp01(config.strength * mult);

  const mode = effectiveStrengthToMode(effective);
  let summary: string | null;
  if (mode === "none") {
    summary = "Adaptive bias off: strength reduced to zero.";
  } else if (mode === "hint_only") {
    summary = "Adaptive bias limited: hint-only band (no recommendation override).";
  } else if (mode === "soft") {
    summary = bias.summary ? `Adaptive bias active: ${bias.summary}` : "Adaptive bias active: soft governance band.";
  } else {
    summary = bias.summary ? `Adaptive bias active (strong band): ${bias.summary}` : "Adaptive bias active: strong governance band.";
  }

  const blocked = mode === "none";

  return {
    enabled: true,
    effectiveStrength: effective,
    blocked,
    blockReason: blocked ? "zero_strength" : null,
    summary,
  };
}

export function buildGovernedAdaptiveBiasForPick(
  raw: NexoraAdaptiveBiasResult | null,
  gov: NexoraBiasGovernanceResult,
  config: NexoraBiasGovernanceConfig
): { pickBias: NexoraAdaptiveBiasResult | null; band: "soft" | "strong" } {
  if (!raw) return { pickBias: null, band: "soft" };
  if (!gov.enabled || gov.blocked || gov.effectiveStrength <= 0) {
    return { pickBias: null, band: "soft" };
  }
  const mode = effectiveStrengthToMode(gov.effectiveStrength);
  if (mode === "none" || mode === "hint_only") {
    return { pickBias: null, band: "soft" };
  }
  const next: NexoraAdaptiveBiasResult = { ...raw };
  if (!config.allowPreferredOptionBias) {
    delete next.preferredOptionId;
  }
  if (!config.allowDiscouragedOptionBias) {
    delete next.discouragedOptionId;
  }
  if (!next.preferredOptionId && !next.discouragedOptionId) {
    return { pickBias: null, band: mode === "strong" ? "strong" : "soft" };
  }
  const band = mode === "strong" ? "strong" : "soft";
  return { pickBias: next, band };
}

function readOverride(): Partial<NexoraBiasGovernanceConfig> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return null;
    return v as Partial<NexoraBiasGovernanceConfig>;
  } catch {
    return null;
  }
}

export function getNexoraBiasGovernanceConfig(): NexoraBiasGovernanceConfig {
  const d = DEFAULT_NEXORA_BIAS_GOVERNANCE;
  const o = readOverride();
  if (!o) return { ...d };
  return {
    /** B.24 — on/off is owned by operator mode (`buildNexoraBiasLayerContext`); ignore LS `enabled`. */
    enabled: d.enabled,
    strength: typeof o.strength === "number" && Number.isFinite(o.strength) ? clamp01(o.strength) : d.strength,
    minRatedRuns:
      typeof o.minRatedRuns === "number" && Number.isFinite(o.minRatedRuns) ? Math.max(0, Math.floor(o.minRatedRuns)) : d.minRatedRuns,
    allowPreferredOptionBias: typeof o.allowPreferredOptionBias === "boolean" ? o.allowPreferredOptionBias : d.allowPreferredOptionBias,
    allowDiscouragedOptionBias:
      typeof o.allowDiscouragedOptionBias === "boolean" ? o.allowDiscouragedOptionBias : d.allowDiscouragedOptionBias,
  };
}

export function saveNexoraBiasGovernanceOverride(patch: Partial<NexoraBiasGovernanceConfig>): void {
  if (typeof window === "undefined") return;
  const cur = getNexoraBiasGovernanceConfig();
  const d = DEFAULT_NEXORA_BIAS_GOVERNANCE;
  const next: NexoraBiasGovernanceConfig = {
    ...cur,
    ...patch,
    enabled: d.enabled,
    strength: patch.strength != null && Number.isFinite(patch.strength) ? clamp01(patch.strength) : cur.strength,
    minRatedRuns:
      patch.minRatedRuns != null && Number.isFinite(patch.minRatedRuns) ? Math.max(0, Math.floor(patch.minRatedRuns)) : cur.minRatedRuns,
  };
  window.localStorage.setItem(LS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT, { detail: next }));
}

export function saveNexoraBiasGovernanceFull(config: NexoraBiasGovernanceConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent(BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT, { detail: config }));
}

export function clearNexoraBiasGovernanceOverride(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
  window.dispatchEvent(new CustomEvent(BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT, { detail: DEFAULT_NEXORA_BIAS_GOVERNANCE }));
}

export function buildNexoraBiasLayerContext(input: {
  quality: NexoraDecisionQualityReport | null;
  memory: NexoraScenarioMemoryEntry[];
  outcomes: NexoraExecutionOutcome[];
  operatorMode: NexoraMode;
}): NexoraBiasLayerContext {
  const base = getNexoraBiasGovernanceConfig();
  const config = { ...base, enabled: modeToBiasEnabled(input.operatorMode) };
  const rawBias = buildAdaptiveBias({
    quality: input.quality,
    memory: input.memory,
    outcomes: input.outcomes,
  });
  const governance = resolveBiasGovernance(config, input.quality, rawBias, { operatorMode: input.operatorMode });
  const { pickBias, band } = buildGovernedAdaptiveBiasForPick(rawBias, governance, config);
  return {
    operatorMode: input.operatorMode,
    config,
    governance,
    rawBias,
    governedBiasForPick: pickBias,
    biasStrengthBand: band,
  };
}
