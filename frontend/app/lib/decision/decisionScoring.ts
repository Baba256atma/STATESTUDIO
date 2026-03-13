import type { DecisionSnapshot } from "./decisionTypes";
import type { SceneJson } from "../sceneTypes";
import type { KpiValue } from "../kpi/kpiEngine";

export type DecisionScorePack = {
  kpiDeltaScore: number; // -100..+100
  riskScore: number; // 0..100 (higher = worse)
  chaosScore: number; // 0..100 (higher = more chaotic)
  finalScore: number; // -100..+100 (positive favors B)
  summary: {
    verdict: string;
    confidence: "low" | "medium" | "high";
    reasons: string[];
  };
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const clamp01 = (n: number) => clamp(n, 0, 1);

export function scoreDecisionPair(
  a: DecisionSnapshot | null,
  b: DecisionSnapshot | null,
  sceneJson?: SceneJson | null
): DecisionScorePack | null {
  if (!a || !b) return null;

  const aKpis = ((a as DecisionSnapshot & { kpis?: KpiValue[] }).kpis ?? []) as KpiValue[];
  const bKpis = ((b as DecisionSnapshot & { kpis?: KpiValue[] }).kpis ?? []) as KpiValue[];
  const aMap = new Map(aKpis.map((k) => [k.id, k]));
  const bMap = new Map(bKpis.map((k) => [k.id, k]));
  const kpiIds = Array.from(new Set([...aMap.keys(), ...bMap.keys()]));
  const deltaSum = kpiIds.reduce((sum, id) => {
    const aVal = aMap.get(id)?.value ?? 0;
    const bVal = bMap.get(id)?.value ?? 0;
    return sum + (bVal - aVal);
  }, 0);
  const kpiDeltaScore = clamp(Math.round(deltaSum * 100), -100, 100);

  const intensity = clamp01(Number(sceneJson?.state_vector?.intensity ?? 0));
  const volatility = clamp01(Number(sceneJson?.state_vector?.volatility ?? 0));
  const chaosScore = clamp(Math.round((volatility * 0.7 + intensity * 0.3) * 100), 0, 100);

  const riskMatchers = /(risk|ignore|delay|rework)/i;
  const safetyMatchers = /(quality|protect|stabil)/i;
  let riskScore = 40;
  const loops = Array.isArray(a.loops) ? a.loops : [];
  for (const loop of loops) {
    const label = `${loop.id ?? ""} ${loop.label ?? ""} ${loop.type ?? ""}`;
    if (riskMatchers.test(label)) riskScore += 10;
    if (safetyMatchers.test(label)) riskScore -= 5;
  }
  riskScore = clamp(riskScore, 0, 100);

  const finalScore = clamp(kpiDeltaScore - (riskScore - 40) - (chaosScore - 50), -100, 100);

  const verdict = finalScore >= 10 ? "B is better overall" : finalScore <= -10 ? "A is safer overall" : "Balanced";

  const kpiCount = kpiIds.length;
  const confidence =
    kpiCount >= 3 && Math.abs(finalScore) >= 15 ? "high" : kpiCount >= 1 ? "medium" : "low";

  const reasons = [
    `KPI delta score ${kpiDeltaScore}`,
    `Risk score ${riskScore}`,
    `Chaos score ${chaosScore}`,
  ];

  return {
    kpiDeltaScore,
    riskScore,
    chaosScore,
    finalScore,
    summary: {
      verdict,
      confidence,
      reasons,
    },
  };
}
