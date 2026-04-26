import type { DecisionContext, EvaluatedScenario, ScenarioSeed } from "./decisionAssistantTypes.ts";
import { buildScenarioTradeoffs } from "./decisionTradeoffBuilder.ts";

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function blob(context: DecisionContext): string {
  return [
    context.domainId,
    context.userIntent ?? "",
    context.systemSummary ?? "",
    ...(context.highlightedDriverIds ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function applicableBonus(context: DecisionContext, seed: ScenarioSeed): number {
  const when = seed.applicableWhen ?? [];
  if (when.length === 0) return 0;
  const b = blob(context);
  let hits = 0;
  for (const w of when) {
    const key = String(w).toLowerCase().replace(/_/g, " ");
    if (key.includes("low risk") && (context.riskLevel === "low")) hits++;
    else if (key.includes("medium") && context.riskLevel === "medium") hits++;
    else if (key.includes("high risk") && context.riskLevel === "high") hits++;
    else if (key.includes("critical") && context.riskLevel === "critical") hits++;
    else if (key.includes("inventory") && b.includes("invent")) hits++;
    else if (key.includes("delivery") && (b.includes("deliver") || b.includes("fulfill"))) hits++;
    else if (key.includes("flow") && b.includes("flow")) hits++;
    else if (key.includes("escalation") && b.includes("escal")) hits++;
    else if (key.includes("deal") && b.includes("deal")) hits++;
    else if (key.includes("cost") && b.includes("cost")) hits++;
    else if (key.includes("optimize") && b.includes("optim")) hits++;
    else if (b.includes(key.replace(/\s+/g, ""))) hits++;
  }
  return Math.min(0.22, hits * 0.08);
}

function stabilityBias(context: DecisionContext, seed: ScenarioSeed): number {
  const delta = seed.delta;
  const stabilizing =
    (delta.risk ?? 0) < 0 || (delta.stability ?? 0) > 0 || seed.tags?.some((t) => /stabil|buffer|contain|defensive/i.test(t));
  if ((context.riskLevel === "high" || context.riskLevel === "critical") && stabilizing) return 0.18;
  if (context.riskLevel === "low" && seed.tags?.some((t) => /acceler|bet|push/i.test(t))) return 0.08;
  return 0;
}

function objectRelevance(context: DecisionContext, seed: ScenarioSeed): number {
  let s = 0;
  const sel = context.selectedObjectId;
  if (sel && context.fragileObjectIds.includes(sel)) s += 0.12;
  if (sel && seed.tags?.some((t) => sel.toLowerCase().includes(t.toLowerCase()))) s += 0.06;
  if (context.fragileObjectIds.length && seed.tags?.some((t) => /propagat|risk|flow/i.test(t))) s += 0.06;
  return Math.min(0.2, s);
}

function projectedFromDelta(seed: ScenarioSeed, context: DecisionContext): EvaluatedScenario["projectedEffects"] {
  const d = seed.delta;
  const risk = clamp((d.risk ?? 0) * (context.riskLevel === "critical" ? 1.15 : 1), -0.35, 0.35);
  let stability = clamp((d.stability ?? 0) + (d.risk && d.risk < 0 ? -d.risk * 0.4 : 0), -0.2, 0.35);
  const throughput = clamp(d.throughput ?? 0, -0.15, 0.35);
  let cost = clamp(d.cost ?? 0, -0.2, 0.25);
  if (context.riskLevel === "critical" && cost > 0.08) {
    cost *= 0.65;
  }
  const confidence = clamp(
    0.58 + (seed.id.includes("baseline") ? 0.06 : 0) + (Object.keys(d).length === 0 ? 0.04 : 0.08),
    0.45,
    0.92
  );
  return {
    risk: risk || undefined,
    stability: stability || undefined,
    throughput: throughput || undefined,
    cost: cost || undefined,
    confidence,
  };
}

function affectedIds(context: DecisionContext, seed: ScenarioSeed): string[] {
  const out = new Set<string>();
  const topFragile = context.fragileObjectIds.slice(0, 4);
  topFragile.forEach((id) => out.add(id));
  if (context.selectedObjectId) out.add(context.selectedObjectId);
  if (out.size === 0 && seed.tags?.includes("inventory")) {
    /* no ids */ void 0;
  }
  return Array.from(out).slice(0, 6);
}

function rationaleLines(context: DecisionContext, seed: ScenarioSeed, effects: EvaluatedScenario["projectedEffects"]): string[] {
  const r: string[] = [seed.intent];
  if (context.riskLevel !== "low") {
    r.push(`Current risk posture: ${context.riskLevel}.`);
  }
  if (typeof effects.confidence === "number") {
    r.push(`Estimated confidence in outcome shape: ${Math.round(effects.confidence * 100)}%.`);
  }
  return r.slice(0, 4);
}

function evaluateOne(context: DecisionContext, seed: ScenarioSeed): EvaluatedScenario {
  const projectedEffects = projectedFromDelta(seed, context);
  const tradeoffs = buildScenarioTradeoffs(context, seed, projectedEffects);
  const rationale = rationaleLines(context, seed, projectedEffects);
  const affectedObjectIds = affectedIds(context, seed);

  let score =
    0.42 +
    applicableBonus(context, seed) +
    stabilityBias(context, seed) +
    objectRelevance(context, seed) +
    projectedEffects.confidence * 0.12;

  if (seed.id.includes("baseline")) score += 0.02;

  if (context.riskLevel === "critical" && (seed.delta.cost ?? 0) > 0.1) score -= 0.14;
  if (context.riskLevel === "critical" && ((seed.delta.risk ?? 0) > 0 || (seed.delta.stability ?? 0) < 0)) score -= 0.1;

  score = clamp(score, 0.15, 0.98);

  return {
    id: seed.id,
    title: seed.name,
    intent: seed.intent,
    delta: { ...seed.delta },
    projectedEffects,
    tradeoffs,
    rationale,
    affectedObjectIds,
    score,
  };
}

export function evaluateDecisionScenarios(context: DecisionContext, seeds: ScenarioSeed[]): EvaluatedScenario[] {
  if (!seeds.length) return [];
  const out = seeds.map((seed) => evaluateOne(context, seed));
  return [...out].sort((a, b) => b.score - a.score);
}
