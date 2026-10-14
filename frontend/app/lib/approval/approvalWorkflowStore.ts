import { appendAuditEvents, appendTrustProvenance, createAuditEvent, createTrustProvenance } from "../governance/governanceTrustAuditContract";
import type { AuditEvent, TrustProvenance } from "../governance/governanceTrustAuditContract";
import { resolveManagerRecordWorkspaceId } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import type { ApprovalActorRole, ApprovalDecisionRecord, ApprovalWorkflowState } from "./approvalWorkflowTypes";

export type ApprovalWorkflowStorage = Pick<Storage, "getItem" | "setItem">;

type ApprovalWorkflowEnvelope = {
  workflow: ApprovalWorkflowState;
  audit_events: AuditEvent[];
  trust_provenance: TrustProvenance[];
};

function browserStorage(): ApprovalWorkflowStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function key(workspaceId?: string | null, projectId?: string | null, decisionId?: string | null): string | null {
  const owner = resolveManagerRecordWorkspaceId(workspaceId);
  if (!owner) return null;
  return `nexora.approvalWorkflow.${owner}.${String(projectId || "default_project")}.${String(decisionId || "default_decision")}`;
}

export function loadApprovalWorkflowEnvelope(
  workspaceId?: string | null,
  projectId?: string | null,
  decisionId?: string | null,
  storage: ApprovalWorkflowStorage | null = browserStorage(),
): ApprovalWorkflowEnvelope | null {
  const storageKey = key(workspaceId, projectId, decisionId);
  if (!storage || !storageKey) return null;
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.workflow) return null;
    return parsed as ApprovalWorkflowEnvelope;
  } catch {
    return null;
  }
}

export function saveApprovalWorkflowEnvelope(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  decisionId?: string | null;
  envelope: ApprovalWorkflowEnvelope;
  storage?: ApprovalWorkflowStorage | null;
}) {
  const storage = params.storage === undefined ? browserStorage() : params.storage;
  const storageKey = key(params.workspaceId, params.projectId, params.decisionId);
  if (!storage || !storageKey) return params.envelope;
  try {
    storage.setItem(storageKey, JSON.stringify(params.envelope));
  } catch {
    return params.envelope;
  }
  return params.envelope;
}

function eventTypeForDecision(decision: ApprovalDecisionRecord["decision"]) {
  if (decision === "approved") return "approval_approved" as const;
  if (decision === "rejected") return "approval_rejected" as const;
  return "approval_escalated" as const;
}

export function appendApprovalDecision(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  decisionId?: string | null;
  actorRole: ApprovalActorRole;
  decision: ApprovalDecisionRecord["decision"];
  note?: string | null;
  workflow: ApprovalWorkflowState;
  sourceWorkspaceId?: string | null;
  storage?: ApprovalWorkflowStorage | null;
}): ApprovalWorkflowEnvelope {
  const owner = resolveManagerRecordWorkspaceId(params.workspaceId);
  const source = params.sourceWorkspaceId?.trim() ?? "";
  if (!owner || (source && source !== owner)) {
    return { workflow: params.workflow, audit_events: [], trust_provenance: [] };
  }
  const record: ApprovalDecisionRecord = {
    id: `approval_${params.decision}_${Date.now().toString(36)}`,
    timestamp: Date.now(),
    actor_role: params.actorRole,
    decision: params.decision,
    note: params.note ?? null,
  };
  const provenance = createTrustProvenance({
    kind: "explainability_output",
    source: {
      source_id: `approval_workflow_${params.decision}`,
      source_label: "Approval Workflow",
      source_type: "ui_workflow",
      subsystem: "approval_workflow",
      version: "v1",
    },
    transformation_path: ["approval_required", params.decision, params.actorRole],
  });
  const event = createAuditEvent({
    event_type: eventTypeForDecision(params.decision),
    category: "recommendation_explainability",
    workspace_id: owner,
    project_id: params.projectId ?? "default_project",
    origin_type: "user",
    actor_hint: params.actorRole,
    affected_entity: params.decisionId ?? params.workflow.decision_id ?? "decision",
    after_hint: params.note ?? params.decision,
    provenance_ref_id: provenance.id,
    explanation_notes: [params.note ?? `${params.actorRole} marked this decision as ${params.decision}.`],
  });

  const envelope: ApprovalWorkflowEnvelope = {
    workflow: {
      ...params.workflow,
      decisions: [record, ...(params.workflow.decisions ?? [])],
    },
    audit_events: appendAuditEvents(loadApprovalWorkflowEnvelope(params.workspaceId, params.projectId, params.decisionId, params.storage)?.audit_events, [event]),
    trust_provenance: appendTrustProvenance(loadApprovalWorkflowEnvelope(params.workspaceId, params.projectId, params.decisionId, params.storage)?.trust_provenance, [provenance]),
  };
  return saveApprovalWorkflowEnvelope({
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    decisionId: params.decisionId,
    envelope,
    storage: params.storage,
  });
}
