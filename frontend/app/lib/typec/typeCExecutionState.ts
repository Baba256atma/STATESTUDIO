import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "./typeCScenarioSimulation.ts";

export type TypeCExecutionState = {
  scenarioId: string;
  status: "idle" | "running" | "paused" | "stopped";
  startedAt: number | null;
  monitoredSignals: string[];
  riskLevel: "low" | "medium" | "high";
};

function labelFromId(id: string): string {
  const cleaned = String(id ?? "")
    .replace(/^typec_/, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!cleaned) return "System";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function buildTypeCMonitoringSignals(simulation: TypeCScenarioSimulation): string[] {
  const signals: string[] = [];

  for (const path of simulation.propagationPaths) {
    signals.push(`${labelFromId(path.from)} delay risk`);
    signals.push(`${labelFromId(path.to)} instability`);
  }

  if (signals.length === 0) {
    for (const id of simulation.affectedObjectIds) {
      signals.push(`${labelFromId(id)} disruption`);
    }
  }

  if (simulation.riskLevel === "high") signals.push("System stability pressure");
  if (simulation.riskLevel === "medium") signals.push("Propagation watch");

  return unique(signals).slice(0, 6);
}

export function startTypeCExecution(input: {
  scenario: TypeCScenarioDraft;
  simulation: TypeCScenarioSimulation;
}): TypeCExecutionState {
  return {
    scenarioId: String(input.scenario?.id ?? input.simulation?.scenarioId ?? ""),
    status: "running",
    startedAt: Date.now(),
    monitoredSignals: buildTypeCMonitoringSignals(input.simulation),
    riskLevel: input.simulation?.riskLevel ?? "low",
  };
}

export function pauseTypeCExecution(current?: TypeCExecutionState | null): TypeCExecutionState {
  if (!current) {
    return {
      scenarioId: "",
      status: "paused",
      startedAt: null,
      monitoredSignals: [],
      riskLevel: "low",
    };
  }
  return {
    ...current,
    status: "paused",
  };
}

export function stopTypeCExecution(): TypeCExecutionState {
  return {
    scenarioId: "",
    status: "stopped",
    startedAt: null,
    monitoredSignals: [],
    riskLevel: "low",
  };
}
