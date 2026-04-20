/**
 * B.18 — Deterministic scenario variants from audit + trust + B.7 decision (no backend / no ML).
 */

import type { NexoraAuditRecord } from "../audit/nexoraAuditContract.ts";
import type { NexoraMode } from "../product/nexoraMode.ts";
import type { NexoraBiasGovernanceResult } from "../quality/nexoraBiasGovernanceContract.ts";
import type { NexoraAdaptiveBiasResult } from "../quality/nexoraAdaptiveBiasContract.ts";
import type { ScenarioMemoryInsights } from "./nexoraScenarioMemory.ts";

export type NexoraScenarioVariant = {
  id: string;
  label: string;
  fragilityLevel: string;
  confidenceTier?: string;
  summary: string;
  drivers: string[];
};

export type NexoraPipelineTrustSnapshot = {
  confidenceTier?: "low" | "medium" | "high" | null;
  trustSummaryLine?: string | null;
  fragilityLevel?: string | null;
};

const FR_ORDER = ["low", "medium", "high", "critical"] as const;

export function fragilityRank(level: string): number {
  const L = String(level ?? "medium").trim().toLowerCase();
  if (L === "moderate") return FR_ORDER.indexOf("medium");
  const i = FR_ORDER.indexOf(L as (typeof FR_ORDER)[number]);
  return i >= 0 ? i : 1;
}

export function clampFragilityIndex(idx: number): number {
  return Math.max(0, Math.min(FR_ORDER.length - 1, idx));
}

export function fragilityNameFromIndex(idx: number): string {
  return FR_ORDER[clampFragilityIndex(idx)] ?? "medium";
}

export function normalizeFragilityToken(raw: string | null | undefined): string {
  const L = String(raw ?? "medium").trim().toLowerCase();
  if (L === "moderate") return "medium";
  if (FR_ORDER.includes(L as (typeof FR_ORDER)[number])) return L;
  return "medium";
}

export function isNexoraAuditRecordLike(value: unknown): value is NexoraAuditRecord {
  if (!value || typeof value !== "object") return false;
  const o = value as NexoraAuditRecord;
  return typeof o.runId === "string" && Boolean(o.runId.trim()) && typeof o.timestamp === "number" && o.merge != null;
}

function effectiveTrustTier(
  trust: { confidenceTier?: string | null; summary?: string | null },
  audit: NexoraAuditRecord
): "low" | "medium" | "high" {
  const t = String(trust.confidenceTier ?? audit.trust.confidenceTier ?? "medium").toLowerCase();
  if (t === "low" || t === "high") return t;
  return "medium";
}

function downgradeTier(t: "low" | "medium" | "high"): "low" | "medium" | "high" {
  if (t === "high") return "medium";
  if (t === "medium") return "low";
  return "low";
}

function upgradeTier(t: "low" | "medium" | "high"): "low" | "medium" | "high" {
  if (t === "low") return "medium";
  if (t === "medium") return "high";
  return "high";
}

function driversFor(audit: NexoraAuditRecord, rotation: number): string[] {
  const raw = audit.scanner.drivers ?? [];
  const labels = raw.map((d) => String(d).trim()).filter(Boolean);
  if (labels.length === 0) return ["Latest scan drivers (none listed)"];
  const out: string[] = [];
  const n = labels.length;
  for (let i = 0; i < Math.min(3, n); i++) {
    out.push(labels[(rotation + i) % n]!);
  }
  return out;
}

export function buildScenarioVariants(
  audit: NexoraAuditRecord,
  trust: { confidenceTier?: string | null; summary?: string | null },
  decision?: { posture?: string; tradeoff?: string; nextMove?: string }
): NexoraScenarioVariant[] {
  const baseIdx = fragilityRank(normalizeFragilityToken(audit.scanner.fragilityLevel));
  const baseTrust = effectiveTrustTier(trust, audit);
  const posture = decision?.posture?.trim() || "Current posture";
  const tradeoff = decision?.tradeoff?.trim() || null;

  const conservativeIdx = clampFragilityIndex(baseIdx - 1);
  const balancedIdx = clampFragilityIndex(baseIdx);
  const aggressiveIdx = clampFragilityIndex(baseIdx + 1);

  const conFrag = fragilityNameFromIndex(conservativeIdx);
  const balFrag = fragilityNameFromIndex(balancedIdx);
  const aggFrag = fragilityNameFromIndex(aggressiveIdx);

  let aggTrust: "low" | "medium" | "high" = baseTrust;
  if (baseTrust !== "high") {
    aggTrust = downgradeTier(baseTrust);
  }
  const conTrust = upgradeTier(baseTrust);

  return [
    {
      id: "conservative",
      label: "Conservative",
      fragilityLevel: conFrag,
      confidenceTier: conTrust,
      summary: `Stabilize around "${posture}".${tradeoff ? ` Trade-space: ${tradeoff.slice(0, 96)}${tradeoff.length > 96 ? "..." : ""}` : ""} Prioritize buffers and lower exposure vs the live scan.`,
      drivers: driversFor(audit, 0),
    },
    {
      id: "balanced",
      label: "Balanced",
      fragilityLevel: balFrag,
      confidenceTier: baseTrust,
      summary: `Optimize within current evidence - hold fragility near baseline while aligning with the stated next move.`,
      drivers: driversFor(audit, 1),
    },
    {
      id: "aggressive",
      label: "Aggressive push",
      fragilityLevel: aggFrag,
      confidenceTier: aggTrust,
      summary: `Lean into speed / throughput - accepts ${aggFrag !== balFrag ? `higher (${aggFrag}) ` : ""}fragility pressure for faster relief.`,
      drivers: driversFor(audit, 2),
    },
  ];
}

/** Deterministic summary tags from B.19 memory insights (fixed order per variant id). */
export function applyMemorySummaryEnrichment(
  variants: NexoraScenarioVariant[],
  insights?: ScenarioMemoryInsights | null
): NexoraScenarioVariant[] {
  if (!insights) return variants;
  return variants.map((v) => {
    const extra: string[] = [];
    if (v.id === "conservative" && insights.similarRuns >= 3 && insights.stabilityTrend !== "declining") {
      extra.push("Consistent with previous stable runs.");
    }
    if (v.id === "balanced" && insights.repeatedDecision && insights.similarRuns >= 2) {
      extra.push("Similar risk pattern observed before.");
    }
    if (v.id === "aggressive" && insights.similarRuns > 0 && (insights.optionSeenCounts.aggressive ?? 0) === 0) {
      extra.push("New path vs previous runs.");
    }
    if (!extra.length) return v;
    return { ...v, summary: `${v.summary.trimEnd()} ${extra.join(" ")}`.trim() };
  });
}

/** Prefer lowest fragility among variants with non-low confidence; else balanced id. */
export function pickRecommendedOptionBaseline(variants: NexoraScenarioVariant[]): string | null {
  if (!variants.length) return null;
  const acceptable = (t?: string) => String(t ?? "").toLowerCase() !== "low";
  const byFrag = [...variants].sort((a, b) => fragilityRank(a.fragilityLevel) - fragilityRank(b.fragilityLevel));
  for (const v of byFrag) {
    if (acceptable(v.confidenceTier)) return v.id;
  }
  const bal = variants.find((x) => x.id === "balanced");
  return bal?.id ?? variants[0]?.id ?? null;
}

function pickNextBestExcluding(variants: NexoraScenarioVariant[], excludeId: string): string | null {
  if (!variants.length) return null;
  const acceptable = (t?: string) => String(t ?? "").toLowerCase() !== "low";
  const byFrag = [...variants]
    .filter((v) => v.id !== excludeId)
    .sort((a, b) => fragilityRank(a.fragilityLevel) - fragilityRank(b.fragilityLevel));
  for (const v of byFrag) {
    if (acceptable(v.confidenceTier)) return v.id;
  }
  const bal = byFrag.find((x) => x.id === "balanced");
  return bal?.id ?? byFrag[0]?.id ?? null;
}

/**
 * B.18 baseline pick, optionally nudged by B.19 dominant option when it is not more fragile than the baseline pick.
 * B.22 — secondary nudge from adaptive bias when confidence is not low (fragility remains primary).
 */
export function pickRecommendedOption(
  variants: NexoraScenarioVariant[],
  insights?: ScenarioMemoryInsights | null,
  adaptiveBias?: NexoraAdaptiveBiasResult | null,
  options?: { biasStrengthBand?: "soft" | "strong" }
): string | null {
  const baselinePath = variants.find((x) => x.id === "balanced");
  let pick = pickRecommendedOptionBaseline(variants);
  const domId = insights?.dominantRecommendedOption;
  if (domId && pick) {
    const dom = variants.find((x) => x.id === domId);
    if (dom && baselinePath && fragilityRank(dom.fragilityLevel) <= fragilityRank(baselinePath.fragilityLevel)) {
      pick = domId;
    }
  }

  const bias = adaptiveBias;
  if (!bias || bias.confidence === "low") {
    return pick;
  }

  const band = options?.biasStrengthBand ?? "soft";
  const maxPrefFragDelta = band === "strong" ? 1 : 0;

  const minFrag = Math.min(...variants.map((v) => fragilityRank(v.fragilityLevel)));
  const clearlyBestFragility = (id: string | null | undefined): boolean => {
    if (!id) return false;
    const v = variants.find((x) => x.id === id);
    return Boolean(v && fragilityRank(v.fragilityLevel) === minFrag);
  };

  if (bias.discouragedOptionId && pick === bias.discouragedOptionId && !clearlyBestFragility(pick)) {
    const next = pickNextBestExcluding(variants, bias.discouragedOptionId);
    if (next) pick = next;
  }

  if (bias.preferredOptionId) {
    const pref = variants.find((x) => x.id === bias.preferredOptionId);
    if (pref && baselinePath) {
      const ok =
        fragilityRank(pref.fragilityLevel) <= fragilityRank(baselinePath.fragilityLevel) + maxPrefFragDelta;
      if (ok) {
        const prefIsDiscouraged = bias.preferredOptionId === bias.discouragedOptionId;
        if (!prefIsDiscouraged || clearlyBestFragility(bias.preferredOptionId)) {
          pick = bias.preferredOptionId;
        }
      }
    }
  }

  return pick;
}

export function buildScenarioB18Signature(audit: NexoraAuditRecord, trustTier: string): string {
  const frag = normalizeFragilityToken(audit.scanner.fragilityLevel);
  return `${audit.runId}|${trustTier}|${frag}`;
}

export type NexoraB18CompareResolved = {
  current: {
    id: "current";
    label: string;
    fragilityLevel: string;
    confidenceTier?: string | null;
    drivers: string[];
    summary: string;
    recommendationTone: string;
  };
  variants: NexoraScenarioVariant[];
  recommendedOptionId: string | null;
  signature: string;
  memoryInsights?: ScenarioMemoryInsights;
  /** B.21 — optional one-line hint from decision quality (compare only). */
  qualityHint?: string;
  /** B.22 — raw adaptive bias (hints / badges; not necessarily applied to pick). */
  adaptiveBias?: NexoraAdaptiveBiasResult | null;
  /** B.23 — governance outcome driving explainability line. */
  biasGovernance?: NexoraBiasGovernanceResult | null;
  /** B.24 — operator mode for compare copy. */
  nexoraOperatorMode?: NexoraMode;
};

export type NexoraB18SimulateResolved = {
  variants: NexoraScenarioVariant[];
  recommendedOptionId: string | null;
  signature: string;
  decisionContext: {
    posture?: string;
    tradeoff?: string;
    nextMove?: string;
  };
  memoryInsights?: ScenarioMemoryInsights;
  /** B.22 — raw adaptive bias for simulate context. */
  adaptiveBias?: NexoraAdaptiveBiasResult | null;
  /** B.23 — governance summary for simulate. */
  biasGovernance?: NexoraBiasGovernanceResult | null;
  /** B.24 — operator mode. */
  nexoraOperatorMode?: NexoraMode;
};
