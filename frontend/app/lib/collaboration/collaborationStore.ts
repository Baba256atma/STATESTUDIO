import {
  appendAuditEvents,
  appendTrustProvenance,
  createAuditEvent,
  createTrustProvenance,
} from "../governance/governanceTrustAuditContract";
import type { AuditEvent, TrustProvenance } from "../governance/governanceTrustAuditContract";
import type { CollaborationInput, CollaborationState } from "./collaborationTypes";

export type CollaborationEnvelope = {
  inputs: CollaborationInput[];
  state?: CollaborationState | null;
  audit_events: AuditEvent[];
  trust_provenance: TrustProvenance[];
  updated_at: number;
};

function key(workspaceId?: string | null, projectId?: string | null, decisionId?: string | null) {
  return `nexora.collaboration.${String(workspaceId || "default_workspace")}.${String(projectId || "default_project")}.${String(decisionId || "default_decision")}`;
}

export function loadCollaborationEnvelope(
  workspaceId?: string | null,
  projectId?: string | null,
  decisionId?: string | null
): CollaborationEnvelope | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(workspaceId, projectId, decisionId));
    if (!raw) return null;
    return JSON.parse(raw) as CollaborationEnvelope;
  } catch {
    return null;
  }
}

export function saveCollaborationEnvelope(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  decisionId?: string | null;
  envelope: CollaborationEnvelope;
}) {
  if (typeof window === "undefined") return params.envelope;
  try {
    window.localStorage.setItem(
      key(params.workspaceId, params.projectId, params.decisionId),
      JSON.stringify(params.envelope)
    );
  } catch {
    return params.envelope;
  }
  return params.envelope;
}

export function appendCollaborationInput(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  decisionId?: string | null;
  input: CollaborationInput;
  state?: CollaborationState | null;
}): CollaborationEnvelope {
  const current =
    loadCollaborationEnvelope(params.workspaceId, params.projectId, params.decisionId) ?? {
      inputs: [],
      state: null,
      audit_events: [],
      trust_provenance: [],
      updated_at: Date.now(),
    };
  const provenance = createTrustProvenance({
    kind: "explainability_output",
    source: {
      source_id: `collaboration_${params.input.kind}`,
      source_label: "Collaboration Intelligence",
      source_type: "ui_workflow",
      subsystem: "collaboration_intelligence",
      version: "v1",
    },
    transformation_path: [
      params.input.role,
      params.input.kind,
      params.input.user_label,
    ],
  });
  const event = createAuditEvent({
    event_type: "collaboration_input_added" as AuditEvent["event_type"],
    category: "collaboration_review",
    workspace_id: params.workspaceId ?? "default_workspace",
    project_id: params.projectId ?? "default_project",
    origin_type: "user",
    actor_hint: params.input.user_label,
    affected_entity: params.decisionId ?? params.state?.decision_id ?? "decision",
    after_hint: params.input.summary,
    provenance_ref_id: provenance.id,
    explanation_notes: [`${params.input.role} added a ${params.input.kind} input.`],
  });

  const envelope: CollaborationEnvelope = {
    inputs: [params.input, ...current.inputs].slice(0, 40),
    state: params.state ?? current.state ?? null,
    audit_events: appendAuditEvents(current.audit_events, [event]),
    trust_provenance: appendTrustProvenance(current.trust_provenance, [provenance]),
    updated_at: Date.now(),
  };
  return saveCollaborationEnvelope({
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    decisionId: params.decisionId,
    envelope,
  });
}

export function persistCollaborationState(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  decisionId?: string | null;
  state: CollaborationState;
}): CollaborationEnvelope {
  const current =
    loadCollaborationEnvelope(params.workspaceId, params.projectId, params.decisionId) ?? {
      inputs: [],
      state: null,
      audit_events: [],
      trust_provenance: [],
      updated_at: Date.now(),
    };
  const provenance = createTrustProvenance({
    kind: "explainability_output",
    source: {
      source_id: "collaboration_state",
      source_label: "Collaboration Intelligence",
      source_type: "derived_state",
      subsystem: "collaboration_intelligence",
      version: "v1",
    },
    transformation_path: [
      `alignment:${params.state.alignment.alignment_level}`,
      `contributors:${params.state.contributors.length}`,
    ],
  });
  const events: AuditEvent[] = [
    createAuditEvent({
      event_type: "collaboration_alignment_updated" as AuditEvent["event_type"],
      category: "collaboration_review",
      workspace_id: params.workspaceId ?? "default_workspace",
      project_id: params.projectId ?? "default_project",
      origin_type: "system",
      affected_entity: params.decisionId ?? params.state.decision_id ?? "decision",
      after_hint: params.state.alignment.alignment_level,
      provenance_ref_id: provenance.id,
      explanation_notes: params.state.alignment.agreement_points.slice(0, 2),
    }),
  ];
  if (params.state.decision_delta.changed) {
    events.push(
      createAuditEvent({
        event_type: "collaboration_decision_delta_detected" as AuditEvent["event_type"],
        category: "collaboration_review",
        workspace_id: params.workspaceId ?? "default_workspace",
        project_id: params.projectId ?? "default_project",
        origin_type: "system",
        affected_entity: params.decisionId ?? params.state.decision_id ?? "decision",
        after_hint: params.state.decision_delta.after_summary ?? params.state.decision_delta.summary,
        provenance_ref_id: provenance.id,
        explanation_notes: [params.state.decision_delta.summary],
      })
    );
  }

  const envelope: CollaborationEnvelope = {
    inputs: current.inputs,
    state: params.state,
    audit_events: appendAuditEvents(current.audit_events, events),
    trust_provenance: appendTrustProvenance(current.trust_provenance, [provenance]),
    updated_at: Date.now(),
  };
  return saveCollaborationEnvelope({
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    decisionId: params.decisionId,
    envelope,
  });
}
