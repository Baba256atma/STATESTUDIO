import type { StrategicLearningState } from "./strategicLearningTypes";

export function buildStrategicLearningGuidance(input: {
  recurringSuccesses: string[];
  recurringFailures: string[];
  recurringTradeoffs: string[];
  recurringUncertainties: string[];
  confidenceTrend: StrategicLearningState["memory_evolution"]["confidence_trend"];
  driftDetected: boolean;
}): string | null {
  if (input.recurringFailures[0]) {
    return `Recent evidence suggests extra caution: ${input.recurringFailures[0].replace(/\.$/, "")}.`;
  }
  if (input.driftDetected) {
    return "Recent evidence suggests operating conditions are shifting, so simulation-first decision flow is now the safer default.";
  }
  if (input.confidenceTrend === "improving" && input.recurringSuccesses[0]) {
    return `Long-term learning suggests this guidance is strengthening: ${input.recurringSuccesses[0].replace(/\.$/, "")}.`;
  }
  if (input.recurringTradeoffs[0]) {
    return `Historical learning suggests you should explicitly manage ${input.recurringTradeoffs[0].toLowerCase()} before escalating the next decision.`;
  }
  if (input.recurringUncertainties[0]) {
    return `Long-term learning remains constrained by ${input.recurringUncertainties[0].toLowerCase()}.`;
  }
  return null;
}
