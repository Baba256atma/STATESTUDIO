import type { DecisionContext, EvaluatedScenario, ScenarioSeed } from "./decisionAssistantTypes.ts";

function clampLine(s: string, max = 120): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function buildScenarioTradeoffs(
  context: DecisionContext,
  seed: ScenarioSeed,
  effects: EvaluatedScenario["projectedEffects"]
): string[] {
  const lines: string[] = [];
  const riskU = context.riskLevel;

  if (typeof effects.risk === "number" && Math.abs(effects.risk) > 0.02) {
    lines.push(
      clampLine(
        effects.risk < 0
          ? `Risk posture improves (~${Math.round(Math.abs(effects.risk) * 100)} pts vs baseline).`
          : `Risk exposure increases (~${Math.round(effects.risk * 100)} pts); warrants tighter controls.`
      )
    );
  }
  if (typeof effects.cost === "number" && Math.abs(effects.cost) > 0.02) {
    lines.push(
      clampLine(
        effects.cost > 0
          ? `Adds ~${Math.round(effects.cost * 100)}% pressure on cost or capital.`
          : `Frees ~${Math.round(Math.abs(effects.cost) * 100)}% cost headroom.`
      )
    );
  }
  if (typeof effects.throughput === "number" && effects.throughput > 0.05) {
    lines.push(clampLine(`Lifts throughput / delivery cadence (~${Math.round(effects.throughput * 100)}%).`));
  }
  if (typeof effects.stability === "number" && effects.stability > 0.05 && (riskU === "high" || riskU === "critical")) {
    lines.push(clampLine("Prioritizes stability — appropriate while fragility is elevated."));
  }
  if (lines.length === 0) {
    lines.push(clampLine(`${seed.name}: balanced move — monitor leading indicators after commit.`));
  }
  return lines.slice(0, 4);
}
