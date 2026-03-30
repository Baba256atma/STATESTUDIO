import type { DecisionExecutionPayload, DecisionExecutionResult } from "./decisionExecutionTypes";
import { postDecisionExecution } from "../api/client";

export async function runDecisionExecution(
  endpoint: "/decision/simulate" | "/decision/compare",
  payload: DecisionExecutionPayload
): Promise<DecisionExecutionResult> {
  return postDecisionExecution(endpoint, payload);
}
