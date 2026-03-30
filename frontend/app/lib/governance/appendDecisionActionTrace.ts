import { appendAuditEvents, appendTrustProvenance, createAuditEvent, createTrustProvenance } from "./governanceTrustAuditContract";

type AppendDecisionActionTraceParams = {
  payload: any;
  workspaceId?: string | null;
  projectId?: string | null;
  mode: "simulate" | "preview" | "compare" | "save" | "apply";
  summary: string;
  confidence?: number | null;
  targetIds?: string[];
};

function mapAuditEventType(mode: AppendDecisionActionTraceParams["mode"]) {
  if (mode === "simulate") return "simulation_run" as const;
  if (mode === "compare") return "scenario_compared" as const;
  if (mode === "save") return "memory_updated" as const;
  return "action_applied" as const;
}

export function appendDecisionActionTrace(params: AppendDecisionActionTraceParams) {
  if (!params.payload || typeof params.payload !== "object") return params.payload;

  const provenance = createTrustProvenance({
    kind: params.mode === "simulate" ? "simulation_output" : "explainability_output",
    source: {
      source_id: `decision_automation_${params.mode}`,
      source_label: "Decision Automation",
      source_type: "ui_action",
      subsystem: "decision_automation",
      version: "v1",
    },
    transformation_path: ["intent_selected", params.mode, "user_confirmation"],
    confidence: params.confidence ?? undefined,
    uncertainty_notes:
      params.mode === "apply" || params.mode === "preview"
        ? ["Safe mode only. No irreversible system mutation was applied."]
        : undefined,
  });

  const event = createAuditEvent({
    event_type: mapAuditEventType(params.mode),
    category:
      params.mode === "save"
        ? "memory_learning"
        : params.mode === "simulate" || params.mode === "compare"
          ? "simulation_scenario"
          : "recommendation_explainability",
    workspace_id: params.workspaceId ?? "default_workspace",
    project_id: params.projectId ?? "default_project",
    origin_type: "system",
    actor_hint: "decision_automation",
    affected_entity: params.targetIds?.[0] ?? params.mode,
    after_hint: params.summary,
    provenance_ref_id: provenance.id,
    explanation_notes: [params.summary],
  });

  return {
    ...params.payload,
    trust_provenance: appendTrustProvenance(params.payload?.trust_provenance, [provenance]),
    audit_events: appendAuditEvents(params.payload?.audit_events, [event]),
  };
}
