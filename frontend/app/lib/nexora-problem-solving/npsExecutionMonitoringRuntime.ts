/**
 * NPA-T NPS:7 runtime adapter. Observes ECA:9/10 and CC:11 results.
 * Does not write Execution.
 */

import type { EcaExecutiveExecutionReadinessJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveExecutionReadiness.ts";
import type { EcaLiveExecutionJudgment } from "@/app/lib/nexora-conversation/ecaLiveExecution.ts";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import type { NpsDecisionCommitment } from "./npsDecisionCommitment.ts";
import {
  composeNpsExecutionMonitoring,
  type NpsCc11Observation,
  type NpsExecutionMonitoring,
} from "./npsExecutionMonitoring.ts";

export function composeNpsRuntimeExecutionMonitoring(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly commitment?: NpsDecisionCommitment | null;
  readonly ecaReadiness?: EcaExecutiveExecutionReadinessJudgment | null;
  readonly ecaLive?: EcaLiveExecutionJudgment | null;
  readonly cc11?: Partial<NpsCc11Observation>;
}): NpsExecutionMonitoring {
  return composeNpsExecutionMonitoring(input);
}

export function applyNpsExecutionMonitoringToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly execution: NpsExecutionMonitoring;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const ready = /\bare we ready to execute\b|\bready to (?:execute|start)\b/i.test(utterance);
  const startIt = /^(?:start it|start execution|execute it)\.?$/i.test(utterance);
  const howGoing = /\bhow is it going\b|\bwhat(?:[’']s| is) happening now\b/i.test(utterance);
  const goingWrong = /\bis anything going wrong\b|\bany problems\b|\bwhat needs attention\b/i.test(utterance);
  const fixIt = /^(?:fix it)\.?$/i.test(utterance);
  const facing = input.execution.managerProjection.text.replace(/\n/g, " ");

  if (ready || howGoing) {
    if (input.source.toLowerCase().includes(facing.slice(0, 28).toLowerCase())) return input.source;
    return `${input.source} ${facing}`.trim();
  }
  if (startIt && input.execution.executionHandoffStatus !== "READY_FOR_CC11" && !input.execution.executionId) {
    const note = input.execution.readinessStatus === "BLOCKED"
      ? facing
      : "Execution can start only after you authorize it and Execution records it.";
    if (input.source.toLowerCase().includes("authorize it")) return input.source;
    return `${input.source} ${note}`.trim();
  }
  if (goingWrong) {
    const note =
      input.execution.attentionStatus === "ATTENTION"
        ? `${input.execution.deviations[0] ?? "Something needs attention."} That is attention, not an automatic change to the plan.`
        : "I don’t see a material execution issue in the current evidence.";
    if (input.source.toLowerCase().includes("not an automatic")) return input.source;
    return `${input.source} ${note}`.trim();
  }
  if (fixIt) {
    const note =
      "I can identify the issue for review, but that is not authorization to change the Execution. Review the intervention path before anything is written.";
    if (input.source.toLowerCase().includes("not authorization to change")) return input.source;
    return `${input.source} ${note}`.trim();
  }
  return input.source;
}
