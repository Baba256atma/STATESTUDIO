/**
 * Phase D — Risk Engine from configurable simulation rules (not AI).
 */

import type { ExecutiveFutureState } from "./ExecutiveFutureState";
import type {
  SimulationAssumptionId,
  SimulationRiskLevel,
} from "./ExecutiveSimulationConfig";
import { ASSUMPTION_EFFECTS } from "./ExecutiveSimulationConfig";

export type ExecutiveRiskResult = {
  readonly level: SimulationRiskLevel;
  readonly drivers: readonly string[];
  readonly summary: string;
};

const RISK_RANK: Record<SimulationRiskLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function maxRisk(
  levels: readonly SimulationRiskLevel[],
): SimulationRiskLevel {
  return levels.reduce<SimulationRiskLevel>(
    (acc, level) => (RISK_RANK[level] > RISK_RANK[acc] ? level : acc),
    "Low",
  );
}

export function runRiskEngine(
  assumptionIds: readonly SimulationAssumptionId[],
  future: ExecutiveFutureState,
): ExecutiveRiskResult {
  const fromAssumptions = assumptionIds.map(
    (id) => ASSUMPTION_EFFECTS[id].risk,
  );
  let level = maxRisk(fromAssumptions.length ? fromAssumptions : ["Low"]);

  const cash = future.objects.find((o) => o.objectId === "revenue");
  const delivery = future.objects.find((o) => o.objectId === "customer");
  const drivers: string[] = assumptionIds.map(
    (id) => ASSUMPTION_EFFECTS[id].notes,
  );

  if (cash && cash.delta <= -200) {
    level = maxRisk([level, "High"]);
    drivers.push("Working cash compression exceeds configured High threshold.");
  }
  if (delivery && delivery.delta <= -6) {
    level = maxRisk([level, "Critical"]);
    drivers.push("Delivery OTIF decline crosses Critical threshold.");
  }
  if (cash && cash.delta < 0 && delivery && delivery.delta > 0) {
    drivers.push("Service improves while cash pressure rises (trade-off).");
  }

  return {
    level,
    drivers,
    summary: `Executive risk · ${level}`,
  };
}
