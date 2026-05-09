export type TypeCPipelineStep =
  | "intent_detected"
  | "object_added"
  | "system_model_added"
  | "scenario_draft_created"
  | "scenario_selected"
  | "scenario_ignored"
  | "scenario_ready_for_decision"
  | "decision_readiness_snapshot"
  | "decision_draft_created"
  | "executive_summary_created"
  | "skipped"
  | "deduped";

export type TypeCPipelineEvent = {
  id: string;
  step: TypeCPipelineStep;
  timestamp: string;
  input?: string;
  intentType?: string;
  objectIds?: string[];
  scenarioId?: string;
  reason?: string;
};

export type TypeCPipelineEventInput = Omit<TypeCPipelineEvent, "id" | "timestamp">;

let eventCounter = 0;

export function createTypeCPipelineEvent(input: Partial<TypeCPipelineEventInput> = {}): TypeCPipelineEvent {
  try {
    eventCounter += 1;
    const timestamp = new Date().toISOString();
    return {
      id: `typec_pipeline_${Date.now()}_${eventCounter}`,
      step: input.step ?? "skipped",
      timestamp,
      ...(input.input ? { input: input.input } : {}),
      ...(input.intentType ? { intentType: input.intentType } : {}),
      ...(input.objectIds?.length ? { objectIds: [...input.objectIds] } : {}),
      ...(input.scenarioId ? { scenarioId: input.scenarioId } : {}),
      ...(input.reason ? { reason: input.reason } : {}),
    };
  } catch {
    eventCounter += 1;
    return {
      id: `typec_pipeline_fallback_${eventCounter}`,
      step: "skipped",
      timestamp: new Date(0).toISOString(),
      reason: "event_creation_failed",
    };
  }
}
