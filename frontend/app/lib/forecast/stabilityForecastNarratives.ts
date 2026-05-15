import type {
  ForecastHorizon,
  StabilityForecastDirection,
} from "./executiveStabilityForecastTypes.ts";

export function labelForForecastHorizon(horizon: ForecastHorizon): string {
  if (horizon === "immediate") return "Immediate operating pressure";
  if (horizon === "near_term") return "Near-term decision cycle";
  return "Monitoring period";
}

export function buildStabilityForecastTitle(params: {
  direction: StabilityForecastDirection;
  focus: string;
}): string {
  const focus = params.focus || "Operational stability";
  if (params.direction === "improving") return `${focus} shows signs of stabilization.`;
  if (params.direction === "stable") return `${focus} is expected to remain steady in the near term.`;
  if (params.direction === "degrading") return `${focus} is expected to remain under pressure.`;
  if (params.direction === "volatile") return `${focus} remains volatile and should be watched closely.`;
  return `${focus} has an uncertain near-term stability direction.`;
}

export function buildStabilityForecastSummary(params: {
  direction: StabilityForecastDirection;
  focus: string;
}): string {
  const focus = params.focus || "Operational stability";
  if (params.direction === "improving") {
    return `${focus} may continue stabilizing if current intervention and monitoring evidence holds.`;
  }
  if (params.direction === "stable") {
    return `${focus} is expected to stay broadly stable while current monitoring conditions remain consistent.`;
  }
  if (params.direction === "degrading") {
    return `${focus} is expected to remain under pressure while unresolved fragility or dependency concentration persists.`;
  }
  if (params.direction === "volatile") {
    return `${focus} may fluctuate because operating pressure and stabilization evidence are both active.`;
  }
  return `${focus} remains uncertain because available signals do not yet support a clear stability direction.`;
}

export function buildForecastRationale(params: {
  direction: StabilityForecastDirection;
}): string {
  if (params.direction === "improving") return "Outlook is based on stabilized review evidence and visible intervention relief.";
  if (params.direction === "stable") return "Outlook is based on balanced pressure and relief signals.";
  if (params.direction === "degrading") return "Outlook is based on elevated monitoring, fragility, or alert pressure.";
  if (params.direction === "volatile") return "Outlook is based on active pressure with unstable signal movement.";
  return "Outlook is limited because evidence is mixed or incomplete.";
}
