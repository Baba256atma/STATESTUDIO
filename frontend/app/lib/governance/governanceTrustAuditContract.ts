export type ReviewStatus = "draft" | "review" | "approved" | "experimental" | "archived";

export type GovernanceState = {
  review_status: ReviewStatus;
  approval_state?: "pending" | "approved" | "rejected";
  trusted_source_classification?: "trusted" | "mixed" | "untrusted";
  policy_scope?: string[];
  environment_flags?: string[];
  role_intent_hints?: string[];
};

export type SourceProvenance = {
  source_id: string;
  source_label?: string;
  source_type?: string;
  subsystem: string;
  timestamp: string;
  version?: string;
};

export type TrustProvenance = {
  id: string;
  kind:
    | "prompt_interpretation"
    | "semantic_enrichment"
    | "scanner_update"
    | "external_integration"
    | "simulation_output"
    | "recommendation_output"
    | "explainability_output"
    | "multi_agent_output"
    | "kpi_strategy_output";
  source: SourceProvenance;
  transformation_path: string[];
  confidence?: number;
  uncertainty_notes?: string[];
  timestamp: string;
};

export type AuditEventType =
  | "project_loaded"
  | "prompt_submitted"
  | "reasoning_generated"
  | "simulation_run"
  | "scenario_compared"
  | "recommendation_generated"
  | "action_applied"
  | "scanner_enrichment_applied"
  | "external_integration_applied"
  | "memory_updated"
  | "strategic_command_state_generated"
  | "decision_policy_evaluated"
  | "collaboration_input_added"
  | "collaboration_alignment_updated"
  | "collaboration_decision_delta_detected"
  | "autonomous_council_review_generated"
  | "council_consensus_updated"
  | "approval_required"
  | "approval_submitted"
  | "approval_approved"
  | "approval_rejected"
  | "approval_escalated"
  | "mode_switched"
  | "project_restored";

export type AuditEvent = {
  id: string;
  timestamp: string;
  workspace_id?: string;
  project_id: string;
  origin_type?: "user" | "system" | "scanner" | "agent" | "integration";
  actor_hint?: string;
  event_type: AuditEventType;
  category:
    | "project_lifecycle"
    | "prompt_reasoning"
    | "simulation_scenario"
    | "scanner_integration"
    | "recommendation_explainability"
    | "memory_learning"
    | "collaboration_review"
    | "governance_policy"
    | "approval_workflow"
    | "workspace_mode_context";
  affected_entity?: string;
  before_hint?: string;
  after_hint?: string;
  provenance_ref_id?: string;
  explanation_notes?: string[];
};

export type ProjectGovernanceContext = {
  workspace_id?: string;
  project_id: string;
  project_status: ReviewStatus;
  scenario_status?: ReviewStatus;
  recommendation_status?: ReviewStatus;
  governance: GovernanceState;
};

const MAX_AUDIT_EVENTS = 80;

function nowIso(): string {
  return new Date().toISOString();
}

function normId(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function createTrustProvenance(params: {
  kind: TrustProvenance["kind"];
  source: {
    source_id: string;
    source_label?: string;
    source_type?: string;
    subsystem: string;
    version?: string;
  };
  transformation_path: string[];
  confidence?: number;
  uncertainty_notes?: string[];
  timestamp?: string;
}): TrustProvenance {
  const ts = params.timestamp ?? nowIso();
  return {
    id: `prov_${normId(params.kind)}_${Date.now().toString(36)}`,
    kind: params.kind,
    source: {
      source_id: params.source.source_id,
      source_label: params.source.source_label,
      source_type: params.source.source_type,
      subsystem: params.source.subsystem,
      version: params.source.version,
      timestamp: ts,
    },
    transformation_path: Array.isArray(params.transformation_path) ? params.transformation_path : [],
    confidence: Number.isFinite(Number(params.confidence)) ? Number(params.confidence) : undefined,
    uncertainty_notes: Array.isArray(params.uncertainty_notes) ? params.uncertainty_notes : undefined,
    timestamp: ts,
  };
}

export function createAuditEvent(params: {
  event_type: AuditEventType;
  category: AuditEvent["category"];
  project_id: string;
  workspace_id?: string;
  origin_type?: AuditEvent["origin_type"];
  actor_hint?: string;
  affected_entity?: string;
  before_hint?: string;
  after_hint?: string;
  provenance_ref_id?: string;
  explanation_notes?: string[];
  timestamp?: string;
}): AuditEvent {
  const ts = params.timestamp ?? nowIso();
  return {
    id: `audit_${normId(params.event_type)}_${Date.now().toString(36)}`,
    timestamp: ts,
    workspace_id: params.workspace_id,
    project_id: params.project_id,
    origin_type: params.origin_type,
    actor_hint: params.actor_hint,
    event_type: params.event_type,
    category: params.category,
    affected_entity: params.affected_entity,
    before_hint: params.before_hint,
    after_hint: params.after_hint,
    provenance_ref_id: params.provenance_ref_id,
    explanation_notes: Array.isArray(params.explanation_notes) ? params.explanation_notes : undefined,
  };
}

export function appendAuditEvents(existing: unknown, incoming: AuditEvent[]): AuditEvent[] {
  const base = Array.isArray(existing) ? (existing as AuditEvent[]) : [];
  const list = [...base, ...incoming].filter(Boolean);
  const byId = new Map<string, AuditEvent>();
  list.forEach((evt) => {
    const id = String(evt?.id ?? "");
    if (!id) return;
    byId.set(id, evt);
  });
  return Array.from(byId.values()).slice(-MAX_AUDIT_EVENTS);
}

export function appendTrustProvenance(existing: unknown, incoming: TrustProvenance[]): TrustProvenance[] {
  const base = Array.isArray(existing) ? (existing as TrustProvenance[]) : [];
  const list = [...base, ...incoming].filter(Boolean);
  const byId = new Map<string, TrustProvenance>();
  list.forEach((p) => {
    const id = String(p?.id ?? "");
    if (!id) return;
    byId.set(id, p);
  });
  return Array.from(byId.values()).slice(-MAX_AUDIT_EVENTS);
}

export function buildProjectGovernanceContext(params: {
  workspace_id?: string;
  project_id: string;
  project_status?: ReviewStatus;
  scenario_status?: ReviewStatus;
  recommendation_status?: ReviewStatus;
  governance?: Partial<GovernanceState>;
}): ProjectGovernanceContext {
  const governance: GovernanceState = {
    review_status: params.governance?.review_status ?? params.project_status ?? "draft",
    approval_state: params.governance?.approval_state ?? "pending",
    trusted_source_classification: params.governance?.trusted_source_classification ?? "mixed",
    policy_scope: params.governance?.policy_scope ?? ["traceability", "explainability", "audit_ready"],
    environment_flags: params.governance?.environment_flags ?? ["operational"],
    role_intent_hints: params.governance?.role_intent_hints ?? [],
  };
  return {
    workspace_id: params.workspace_id,
    project_id: params.project_id,
    project_status: params.project_status ?? governance.review_status,
    scenario_status: params.scenario_status ?? "draft",
    recommendation_status: params.recommendation_status ?? "review",
    governance,
  };
}
