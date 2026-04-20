/**
 * Phase B.7 — thin deterministic decision layer on top of fragility + domain calibration (no LLM).
 */

import { getEffectiveVocabularyDomain } from "../lib/visual/domainVocabulary";
import type { FragilityDriver } from "../types/fragilityScanner";

export type NexoraDecisionTone = "cautious" | "steady" | "urgent";

export type NexoraDecisionLayerResult = {
  posture: string;
  tradeoff: string;
  recommendedAction: string;
  decisionTone: NexoraDecisionTone;
  /** Heuristic confidence from driver concentration + fragility level. */
  confidence: "low" | "medium" | "high";
};

export type NexoraDecisionLayerInput = {
  domainId?: string | null;
  fragilityLevel: string;
  drivers: FragilityDriver[];
  highlightObjectIds: string[];
  summary?: string | null;
};

function norm(s: string): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function levelBand(raw: string): "low" | "medium" | "high" | "critical" {
  const L = norm(raw);
  if (L === "critical") return "critical";
  if (L === "high") return "high";
  if (L === "medium" || L === "moderate") return "medium";
  return "low";
}

function scoreHits(blob: string, words: string[]): number {
  let n = 0;
  for (const w of words) {
    if (w.length > 1 && blob.includes(w)) n += 1;
  }
  return n;
}

function themeScores(blob: string, idBlob: string): Record<string, number> {
  const b = `${blob} ${idBlob}`;
  return {
    supply: scoreHits(b, ["supplier", "suppliers", "vendor", "supply", "procurement", "upstream", "sourcing"]),
    inventory: scoreHits(b, ["inventory", "stock", "warehouse", "stockout", "oos", "shortage", "buffer"]),
    delivery: scoreHits(b, ["delivery", "shipping", "logistics", "shipment", "delay", "delays", "carrier", "transit"]),
    margin: scoreHits(b, ["margin", "margins", "cost", "costs", "pricing", "profit", "cogs", "expense", "expenses"]),
    demand: scoreHits(b, ["demand", "orders", "sales", "volume", "storefront"]),
    liquidity: scoreHits(b, ["liquidity", "cash", "working capital", "runway", "covenant", "refinance"]),
    ops: scoreHits(b, ["latency", "outage", "deploy", "deployment", "release", "pipeline", "incident", "availability", "sre"]),
    schedule: scoreHits(b, ["milestone", "schedule", "timeline", "deadline", "critical path", "slip"]),
    capacity: scoreHits(b, ["capacity", "resource", "bandwidth", "burnout", "overcommit"]),
    access: scoreHits(b, ["access", "identity", "credential", "privilege", "mfa", "sso"]),
    threat: scoreHits(b, ["threat", "vulnerability", "exploit", "malware", "breach", "patch"]),
  };
}

function pickTheme(scores: Record<string, number>): string {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  if (!top || top[1] < 1) return "mixed";
  if (entries.length > 1 && entries[1][1] >= top[1] - 0.5) {
    const a = entries[0][0];
    const b = entries[1][0];
    if ((a === "supply" || b === "supply") && (a === "inventory" || b === "inventory")) return "supply_chain";
    if ((a === "delivery" || b === "delivery") && (a === "inventory" || b === "inventory")) return "supply_chain";
  }
  return top[0];
}

function toneFromLevel(level: ReturnType<typeof levelBand>): NexoraDecisionTone {
  if (level === "critical" || level === "high") return "urgent";
  if (level === "medium") return "steady";
  return "cautious";
}

function confidenceFromDrivers(drivers: FragilityDriver[], level: ReturnType<typeof levelBand>): "low" | "medium" | "high" {
  const top = drivers[0];
  const score = typeof top?.score === "number" && Number.isFinite(top.score) ? top.score : 0;
  if (level === "critical" || level === "high") return score >= 0.45 ? "high" : "medium";
  if (level === "medium") return score >= 0.5 ? "medium" : "low";
  return score >= 0.55 ? "medium" : "low";
}

function retailDecision(
  theme: string,
  level: ReturnType<typeof levelBand>,
  drivers: FragilityDriver[]
): NexoraDecisionLayerResult {
  const tone = toneFromLevel(level);
  const conf = confidenceFromDrivers(drivers, level);

  if (theme === "supply_chain" || (theme === "supply" && level !== "low")) {
    return {
      posture: "Stabilize supply",
      tradeoff: "Inventory protection may raise short-term cost",
      recommendedAction: "Increase buffer on delayed or critical items",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "delivery") {
    return {
      posture: "Reduce delivery exposure",
      tradeoff: "Faster recovery may increase expedite cost",
      recommendedAction: "Prioritize delayed delivery lanes and carrier options",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "inventory") {
    return {
      posture: "Protect inventory position",
      tradeoff: "Safety stock may reduce capital flexibility",
      recommendedAction: "Review inventory thresholds and reorder points this cycle",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "margin" || theme === "demand") {
    return {
      posture: theme === "margin" ? "Protect margin" : "Watch demand volatility",
      tradeoff:
        theme === "margin" ? "Margin defense may slow demand response" : "Demand actions may compress near-term margin",
      recommendedAction:
        theme === "margin" ? "Review pricing and cost levers with owners" : "Align promotions and supply to demand shifts",
      decisionTone: tone,
      confidence: conf,
    };
  }
  return {
    posture: "Stabilize operations",
    tradeoff: "Broader moves may trade speed for cost",
    recommendedAction: "Confirm top risk drivers with owners and set one mitigation",
    decisionTone: tone,
    confidence: conf,
  };
}

function financeDecision(
  theme: string,
  level: ReturnType<typeof levelBand>,
  drivers: FragilityDriver[]
): NexoraDecisionLayerResult {
  const tone = toneFromLevel(level);
  const conf = confidenceFromDrivers(drivers, level);
  if (theme === "liquidity" || theme === "supply_chain") {
    return {
      posture: "Protect liquidity",
      tradeoff: "Cash preservation may slow expansion or buybacks",
      recommendedAction: "Review short-term obligations and covenant headroom",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "margin") {
    return {
      posture: "Defend profitability",
      tradeoff: "Cost control may reduce growth investment",
      recommendedAction: "Stress-test margin under rate and volume shifts",
      decisionTone: tone,
      confidence: conf,
    };
  }
  return {
    posture: "Tighten financial posture",
    tradeoff: "Balancing liquidity and growth has near-term tradeoffs",
    recommendedAction: "Prioritize cash and margin levers with finance leadership",
    decisionTone: tone,
    confidence: conf,
  };
}

function devopsDecision(
  theme: string,
  level: ReturnType<typeof levelBand>,
  drivers: FragilityDriver[]
): NexoraDecisionLayerResult {
  const tone = toneFromLevel(level);
  const conf = confidenceFromDrivers(drivers, level);
  if (theme === "ops" || theme === "delivery") {
    return {
      posture: "Reduce bottleneck pressure",
      tradeoff: "Throughput fixes may reduce change flexibility",
      recommendedAction: "Relieve the most constrained service or deploy step first",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "threat" || theme === "access") {
    return {
      posture: "Contain exposure",
      tradeoff: "Hardening may add friction for builders",
      recommendedAction: "Patch critical paths and validate access controls",
      decisionTone: tone,
      confidence: conf,
    };
  }
  return {
    posture: "Stabilize reliability",
    tradeoff: "Reliability work may defer feature throughput",
    recommendedAction: "Set error budget owners and one mitigation milestone",
    decisionTone: tone,
    confidence: conf,
  };
}

function pmoDecision(
  theme: string,
  level: ReturnType<typeof levelBand>,
  drivers: FragilityDriver[]
): NexoraDecisionLayerResult {
  const tone = toneFromLevel(level);
  const conf = confidenceFromDrivers(drivers, level);
  if (theme === "schedule") {
    return {
      posture: "Protect delivery dates",
      tradeoff: "Schedule buffers may consume scarce capacity",
      recommendedAction: "Re-sequence dependencies on the critical path",
      decisionTone: tone,
      confidence: conf,
    };
  }
  if (theme === "capacity") {
    return {
      posture: "Rebalance capacity",
      tradeoff: "Adding capacity may raise burn or dilute focus",
      recommendedAction: "Cut or defer lowest-value commitments this quarter",
      decisionTone: tone,
      confidence: conf,
    };
  }
  return {
    posture: "Clarify program tradeoffs",
    tradeoff: "Scope, time, and capacity cannot all flex at once",
    recommendedAction: "Pick one deferrable workstream and communicate the cut",
    decisionTone: tone,
    confidence: conf,
  };
}

function securityDecision(
  kind: "threat" | "access",
  level: ReturnType<typeof levelBand>,
  drivers: FragilityDriver[]
): NexoraDecisionLayerResult {
  const tone = toneFromLevel(level);
  const conf = confidenceFromDrivers(drivers, level);
  return {
    posture: kind === "threat" ? "Reduce threat exposure" : "Tighten access posture",
    tradeoff: "Security controls may slow delivery cadence",
    recommendedAction:
      kind === "threat"
        ? "Validate patch and detection coverage on critical assets"
        : "Review privileged access and session policies",
    decisionTone: tone,
    confidence: conf,
  };
}

/** Deterministic posture / tradeoff / next move from fragility scan + highlights + domain. */
export function deriveNexoraDecisionLayer(input: NexoraDecisionLayerInput): NexoraDecisionLayerResult {
  const domain = getEffectiveVocabularyDomain(input.domainId);
  const level = levelBand(input.fragilityLevel);
  const drivers = Array.isArray(input.drivers) ? input.drivers : [];
  const blob = norm(
    [input.summary ?? "", ...drivers.map((d) => [d.label, d.dimension, d.evidence_text].filter(Boolean).join(" "))].join(
      " "
    )
  );
  const idBlob = norm(input.highlightObjectIds.join(" "));
  const scores = themeScores(blob, idBlob);
  let theme = pickTheme(scores);
  if (scores.supply >= 1 && scores.inventory >= 1) theme = "supply_chain";
  else if (scores.delivery >= 1 && scores.inventory >= 1) theme = "supply_chain";

  let base: NexoraDecisionLayerResult;
  if (domain === "finance") base = financeDecision(theme, level, drivers);
  else if (domain === "devops") base = devopsDecision(theme, level, drivers);
  else if (domain === "pmo") base = pmoDecision(theme, level, drivers);
  else if (domain === "security") {
    const st = scores.threat >= scores.access ? "threat" : "access";
    base = securityDecision(st, level, drivers);
  }
  else base = retailDecision(theme, level, drivers);

  return base;
}

export function buildNexoraDecisionLayerSignature(r: NexoraDecisionLayerResult): string {
  return [r.posture, r.tradeoff, r.recommendedAction, r.decisionTone, r.confidence].join("::");
}

/** B.12 + B.13.e — nudge decision tone from trust tier and domain (deterministic, subtle). */
export function adjustDecisionToneForTrust(
  tone: NexoraDecisionTone,
  trustTier: "low" | "medium" | "high" | null,
  fragilityLevelRaw: string,
  domainId?: string | null
): NexoraDecisionTone {
  const L = levelBand(fragilityLevelRaw);
  const domain = getEffectiveVocabularyDomain(domainId);
  if (!trustTier) {
    if (domain === "finance" && (L === "high" || L === "critical") && tone === "steady") return "cautious";
    return tone;
  }
  let t: NexoraDecisionTone = tone;
  if (trustTier === "low") {
    if (tone === "urgent") t = "steady";
    else t = "cautious";
  } else if (trustTier === "high" && tone === "cautious" && L === "low") {
    t = "steady";
  }
  if (domain === "finance" && trustTier !== "high" && t === "steady") return "cautious";
  if ((domain === "supply_chain" || domain === "retail") && L === "high" && trustTier === "high" && t === "cautious") {
    return "steady";
  }
  return t;
}
