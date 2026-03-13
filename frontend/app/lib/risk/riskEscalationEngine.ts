import type { RiskLevel } from "../contracts";

export type { RiskLevel };

export function computeRiskLevel(input: {
  strategicState?: any;
  loops?: any[];
  kpis?: any[];
}): { level: RiskLevel; score: number; reasons: string[] } {
  const { strategicState, loops } = input;
  let score = 0;
  const reasons: string[] = [];

  if (Number(strategicState?.tensionLevel ?? 0) > 0.7) {
    score += 30;
    reasons.push("High tension level");
  }

  if (Number(strategicState?.riskLevel ?? 0) > 0.7) {
    score += 40;
    reasons.push("Elevated systemic risk");
  }

  if (Number(strategicState?.stabilityScore ?? 1) < 0.3) {
    score += 30;
    reasons.push("Low stability");
  }

  const matcher = /risk|delay|rework/i;
  let loopScore = 0;
  if (Array.isArray(loops)) {
    for (const l of loops) {
      const label = `${String(l?.id ?? "")} ${String(l?.label ?? "")}`;
      if (matcher.test(label)) {
        loopScore += 15;
        reasons.push(`Risk loop: ${String(l?.label ?? l?.id ?? "loop")}`);
      }
      if (loopScore >= 45) {
        loopScore = 45;
        break;
      }
    }
  }
  score += loopScore;

  let level: RiskLevel = "low";
  if (score < 30) level = "low";
  else if (score < 60) level = "medium";
  else if (score < 85) level = "high";
  else level = "critical";

  return { level, score, reasons };
}
