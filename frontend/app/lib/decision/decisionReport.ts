import type { KpiValue } from "../kpi/kpiEngine";

export type DecisionImpact = {
  kpiId: string;
  label: string;
  from?: number;
  to: number;
  delta?: number;
  trend: "up" | "down" | "flat";
};

export type DecisionRisk = {
  level: "low" | "medium" | "high";
  score: number; // 0..1
  reasons: string[];
};

export type DecisionNextAction = {
  id: string;
  title: string;
  detail?: string;
  priority: "P1" | "P2" | "P3";
};

export type DecisionReport = {
  id: string;
  createdAt: string;
  context: {
    selectedObjectId: string | null;
    activeLoops: string[];
    intensity?: number;
    volatility?: number;
  };
  summary: {
    title: string;
    bullets: string[];
  };
  impacts: DecisionImpact[];
  risk: DecisionRisk;
  nextActions: DecisionNextAction[];
};

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function nowIso() {
  return new Date().toISOString();
}

function trendFromDelta(delta?: number): "up" | "down" | "flat" {
  if (typeof delta !== "number") return "flat";
  if (delta > 0.01) return "up";
  if (delta < -0.01) return "down";
  return "flat";
}

export function buildDecisionReport(args: {
  sceneJson: any | null;
  loops: any[];
  kpis: KpiValue[];
  lastKpis?: Record<string, number>;
  selectedObjectId: string | null;
}): DecisionReport {
  const { sceneJson, loops, kpis, lastKpis, selectedObjectId } = args;

  const intensity = clamp(sceneJson?.state_vector?.intensity ?? 0.5);
  const volatility = clamp(sceneJson?.state_vector?.volatility ?? 0);

  const activeLoops = (loops || [])
    .map((l) => String(l?.type ?? "").trim())
    .filter(Boolean);

  const impacts: DecisionImpact[] = (kpis || []).map((k) => {
    const from = lastKpis?.[k.id];
    const to = k.value;
    const delta = typeof from === "number" ? to - from : undefined;
    return {
      kpiId: k.id,
      label: (k as any).label ?? k.id,
      from,
      to,
      delta,
      trend: trendFromDelta(delta),
    };
  });

  // Risk model: volatility dominates, plus loop-based flags
  const reasons: string[] = [];
  if (volatility > 0.65) reasons.push("High volatility: outcomes may change quickly.");
  if (intensity < 0.35) reasons.push("Low intensity: weak signal / low confidence state.");

  const loopText = activeLoops.join(" ").toLowerCase();
  if (loopText.includes("risk")) reasons.push("Risk loop active: monitor exposure and constraints.");
  if (loopText.includes("ignor")) reasons.push("Ignoring risk loop detected: consider safeguards.");

  const riskScore = clamp(volatility * 0.7 + (1 - intensity) * 0.2 + (loopText.includes("risk") ? 0.1 : 0));
  const level: DecisionRisk["level"] = riskScore > 0.66 ? "high" : riskScore > 0.33 ? "medium" : "low";

  if (reasons.length === 0) reasons.push("Risk is within acceptable bounds for the current state.");

  const risk: DecisionRisk = { level, score: riskScore, reasons };

  // Summary
  const title = selectedObjectId
    ? `Decision for ${selectedObjectId}`
    : "Decision Snapshot";

  const bullets: string[] = [];
  if (selectedObjectId) bullets.push("Selection is focused; actions will apply to the selected object.");
  if (activeLoops.length) bullets.push(`Active loops: ${activeLoops.slice(0, 3).join(", ")}${activeLoops.length > 3 ? "…" : ""}`);
  bullets.push(`State: intensity ${intensity.toFixed(2)}, volatility ${volatility.toFixed(2)}.`);
  bullets.push(`Risk: ${risk.level.toUpperCase()} (${risk.score.toFixed(2)}).`);

  // Next actions (simple, actionable defaults)
  const nextActions: DecisionNextAction[] = [];

  // If risk high -> safeguards
  if (risk.level === "high") {
    nextActions.push({
      id: "add_guardrails",
      title: "Add guardrails before scaling changes",
      detail: "Introduce constraints, approvals, or staged rollout to reduce blast radius.",
      priority: "P1",
    });
    nextActions.push({
      id: "monitor_leading",
      title: "Monitor leading indicators",
      detail: "Track volatility drivers and risk_exposure KPI after each adjustment.",
      priority: "P1",
    });
  }

  // If quality defects KPI exists and is high -> quality action
  const quality = (kpis || []).find((k) => k.id === "quality_defects");
  if (quality && typeof quality.target === "number" && quality.value > quality.target) {
    nextActions.push({
      id: "quality_root_cause",
      title: "Run quick root-cause on defects",
      detail: "Identify the top 1–2 defect sources; apply a small fix and re-measure.",
      priority: risk.level === "high" ? "P2" : "P1",
    });
  }

  // If delivery on time KPI exists and low -> delivery action
  const delivery = (kpis || []).find((k) => k.id === "delivery_on_time");
  if (delivery && typeof delivery.target === "number" && delivery.value < delivery.target) {
    nextActions.push({
      id: "delivery_bottleneck",
      title: "Remove the biggest delivery bottleneck",
      detail: "Focus on one constraint: capacity, queue, or handoff. Fix and re-check KPI.",
      priority: "P1",
    });
  }

  // Always include a small experiment
  nextActions.push({
    id: "small_experiment",
    title: "Run a small experiment",
    detail: "Change one variable, log the decision, and compare KPI delta after 1–3 steps.",
    priority: "P2",
  });

  // De-duplicate by id
  const uniq: Record<string, boolean> = {};
  const deduped = nextActions.filter((a) => (uniq[a.id] ? false : (uniq[a.id] = true)));

  return {
    id: `dec_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: nowIso(),
    context: {
      selectedObjectId,
      activeLoops,
      intensity,
      volatility,
    },
    summary: { title, bullets },
    impacts,
    risk,
    nextActions: deduped,
  };
}
