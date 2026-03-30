"use client";

import React from "react";

import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { appendApprovalDecision, loadApprovalWorkflowEnvelope } from "../../lib/approval/approvalWorkflowStore";
import type { ApprovalActorRole } from "../../lib/approval/approvalWorkflowTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type ExecutiveApprovalPanelProps = {
  workspaceId?: string | null;
  projectId?: string | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenDecisionGovernance?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function ExecutiveApprovalPanel(props: ExecutiveApprovalPanelProps) {
  const intent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );
  const governance = React.useMemo(
    () =>
      buildDecisionGovernanceState({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionExecutionIntent: intent,
        decisionResult: props.decisionResult ?? null,
        responseData: props.responseData ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.canonicalRecommendation, intent, props.decisionResult, props.responseData, props.memoryEntries]
  );
  const decisionId = governance.decision_id ?? intent?.id ?? props.canonicalRecommendation?.id ?? null;
  const [actorRole, setActorRole] = React.useState<ApprovalActorRole>("executive");
  const [note, setNote] = React.useState("");
  const [version, setVersion] = React.useState(0);

  const storedEnvelope = React.useMemo(
    () =>
      loadApprovalWorkflowEnvelope(
        props.workspaceId ?? null,
        props.projectId ?? null,
        decisionId
      ),
    [props.workspaceId, props.projectId, decisionId, version]
  );

  const workflow = React.useMemo(
    () =>
      buildApprovalWorkflowState({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionExecutionIntent: intent,
        decisionGovernance: governance,
        decisionResult: props.decisionResult ?? null,
        responseData: props.responseData ?? null,
        memoryEntries: props.memoryEntries ?? [],
        existingWorkflow: storedEnvelope?.workflow ?? null,
      }),
    [props.canonicalRecommendation, intent, governance, props.decisionResult, props.responseData, props.memoryEntries, storedEnvelope]
  );

  const recordDecision = React.useCallback(
    (decision: "approved" | "rejected" | "escalated") => {
      appendApprovalDecision({
        workspaceId: props.workspaceId ?? null,
        projectId: props.projectId ?? null,
        decisionId,
        actorRole,
        decision,
        note,
        workflow,
      });
      setNote("");
      setVersion((current) => current + 1);
    },
    [props.workspaceId, props.projectId, decisionId, actorRole, note, workflow]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Executive Approval</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Track which decisions require review, what is blocked, and what should happen next.
        </div>
      </div>

      <Section label="Approval Status" title={pretty(workflow.status)} summary={workflow.explanation}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Required" value={workflow.required ? "Yes" : "No"} />
          <StatCard label="Reviewer" value={workflow.requested_reviewer_role ? pretty(workflow.requested_reviewer_role) : "None"} />
          <StatCard label="Owner" value={workflow.current_owner_role ? pretty(workflow.current_owner_role) : "Unassigned"} />
        </div>
      </Section>

      <Section label="Actions" title="What is blocked until approval" summary="Approval posture controls which stronger actions can proceed.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ListCard label="Allowed now" items={(workflow.status === "approved" ? workflow.allowed_post_approval_actions : ["preview", "simulate", "compare", "save"]).map(pretty)} empty="No action is currently allowed." />
          <ListCard label="Blocked until approval" items={workflow.blocked_until_approval_actions.map(pretty)} empty="No action is blocked by approval." />
        </div>
      </Section>

      <Section label="Approval History" title="What has already happened" summary="Keep approval changes readable and auditable.">
        {workflow.decisions.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {workflow.decisions.map((decision) => (
              <div key={decision.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>
                    {pretty(decision.actor_role)} · {pretty(decision.decision)}
                  </div>
                  <div style={{ color: nx.lowMuted, fontSize: 11 }}>
                    {new Date(decision.timestamp).toLocaleString()}
                  </div>
                </div>
                {decision.note ? (
                  <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{decision.note}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <ListCard label={null} items={[]} empty="No approval decision has been recorded yet." />
        )}
      </Section>

      <Section label="Review Actions" title="Update the approval workflow" summary="This lightweight workflow is local and auditable, designed for enterprise-safe review rather than realtime orchestration.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Reviewer role
            </div>
            <select
              value={actorRole}
              onChange={(event) => setActorRole(event.target.value as ApprovalActorRole)}
              style={{
                borderRadius: 10,
                border: `1px solid ${nx.border}`,
                background: "rgba(15,23,42,0.72)",
                color: nx.text,
                padding: "10px 12px",
                fontSize: 12,
              }}
            >
              {["executive", "manager", "analyst", "operator", "investor", "system_owner"].map((role) => (
                <option key={role} value={role}>
                  {pretty(role)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Review note
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a short approval or escalation note"
              style={{
                borderRadius: 10,
                border: `1px solid ${nx.border}`,
                background: "rgba(15,23,42,0.72)",
                color: nx.text,
                padding: "10px 12px",
                fontSize: 12,
                minHeight: 80,
                resize: "vertical",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => recordDecision("approved")} style={secondaryButtonStyle}>
            Mark Approved
          </button>
          <button type="button" onClick={() => recordDecision("rejected")} style={secondaryButtonStyle}>
            Mark Rejected
          </button>
          <button type="button" onClick={() => recordDecision("escalated")} style={secondaryButtonStyle}>
            Escalate
          </button>
        </div>
      </Section>

      <Section label="Next Steps" title="What should happen next" summary="Approval should guide the safest useful path, not just freeze the decision.">
        <ListCard label={null} items={workflow.next_steps} empty="No next step is available yet." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {props.onOpenDecisionGovernance ? (
            <button type="button" onClick={props.onOpenDecisionGovernance} style={secondaryButtonStyle}>
              Open Governance
            </button>
          ) : null}
          {props.onOpenCompare ? (
            <button type="button" onClick={props.onOpenCompare} style={secondaryButtonStyle}>
              Open Compare
            </button>
          ) : null}
          {props.onOpenTimeline ? (
            <button type="button" onClick={props.onOpenTimeline} style={secondaryButtonStyle}>
              Open Timeline
            </button>
          ) : null}
        </div>
      </Section>
    </div>
  );
}

function Section(props: { label: string; title: string; summary: string; children: React.ReactNode }) {
  return (
    <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{props.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function StatCard(props: { label: string; value: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 4 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{props.value}</div>
    </div>
  );
}

function ListCard(props: { label: string | null; items: string[]; empty: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      {props.label ? (
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {props.label}
        </div>
      ) : null}
      {(props.items.length ? props.items : [props.empty]).map((item) => (
        <div key={item} style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
          {item}
        </div>
      ))}
    </div>
  );
}
