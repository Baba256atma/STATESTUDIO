"use client";

import React from "react";

import { buildDecisionConfidenceModel } from "../../lib/decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../../lib/decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../../lib/decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildObservedOutcomeAssessment } from "../../lib/decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../../lib/decision/outcome/buildDecisionOutcomeFeedback";
import { buildMetaDecisionState } from "../../lib/decision/meta/buildMetaDecisionState";
import { buildTeamDecisionState } from "../../lib/team/buildTeamDecisionState";
import { loadCollaborationEnvelope } from "../../lib/collaboration/collaborationStore";
import { buildCollaborationState } from "../../lib/collaboration/buildCollaborationState";
import { buildAutonomousDecisionCouncilState } from "../../lib/council/buildAutonomousDecisionCouncilState";
import { buildOrgMemoryState } from "../../lib/org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildStrategicCommandState } from "../../lib/command/buildStrategicCommandState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type StrategicCommandPanelProps = {
  workspaceId?: string | null;
  projectId?: string | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenView?: ((view: RightPanelView) => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function StrategicCommandPanel(props: StrategicCommandPanelProps) {
  const memoryEntries = props.memoryEntries ?? [];
  const executionIntent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );
  const decisionId = executionIntent?.id ?? props.canonicalRecommendation?.id ?? null;
  const collaborationEnvelope = React.useMemo(
    () =>
      loadCollaborationEnvelope(
        props.workspaceId ?? null,
        props.projectId ?? null,
        decisionId
      ),
    [props.workspaceId, props.projectId, decisionId]
  );
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    responseData: props.responseData ?? null,
    decisionResult: props.decisionResult ?? null,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: props.responseData ?? null,
      decisionResult: props.decisionResult ?? null,
      memoryEntries,
    }),
    memoryEntries,
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    observedAssessment: buildObservedOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: props.responseData ?? null,
      decisionResult: props.decisionResult ?? null,
      memoryEntries,
    }),
    memoryEntry: memoryEntries[0] ?? null,
    responseData: props.responseData ?? null,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: props.responseData?.ai_reasoning ?? null,
    simulation: props.responseData?.decision_simulation ?? null,
    comparison: props.responseData?.decision_comparison ?? props.responseData?.comparison ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    calibration,
    responseData: props.responseData ?? null,
    memoryEntries,
  });
  const teamDecision = buildTeamDecisionState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
  });
  const collaborationState = buildCollaborationState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    responseData: props.responseData ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    teamDecisionState: teamDecision,
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
  });
  const policyState = buildDecisionPolicyState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
  });
  const governanceState = buildDecisionGovernanceState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
    orgMemoryState: orgMemory,
    teamDecisionState: teamDecision,
    metaDecisionState: metaDecision,
    policyState,
  });
  const approvalWorkflow = buildApprovalWorkflowState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionGovernance: governanceState,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
    policyState,
  });
  const decisionCouncil = buildAutonomousDecisionCouncilState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
  });
  const commandState = buildStrategicCommandState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    confidenceModel,
    calibration,
    outcomeFeedback,
    metaDecision,
    teamDecision,
    collaborationState,
    orgMemory,
    policyState,
    governanceState,
    approvalWorkflow,
    decisionCouncil,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Strategic Command</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          See what matters now, what Nexora recommends, and what should happen next.
        </div>
      </div>

      <Section label="Command" title={commandState.headline} summary={commandState.summary}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{pretty(commandState.priority)}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{commandState.priority_reason}</div>
          </div>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Next move
            </div>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800, lineHeight: 1.4 }}>{commandState.next_move}</div>
          </div>
        </div>
      </Section>

      <Section label="Alerts" title="Top command alerts" summary="These are the most important blockers, warnings, or guidance signals in the current decision posture.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {commandState.alerts.map((alert) => (
            <div key={alert.id} style={{ ...softCardStyle, padding: 12, gap: 4, borderColor: alert.level === "critical" ? "rgba(248,113,113,0.35)" : alert.level === "warning" ? "rgba(245,158,11,0.28)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{alert.title}</div>
                <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {alert.source}
                </div>
              </div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{alert.summary}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Notes" title="Recommendation and control posture" summary={commandState.explanation}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <NoteCard label="Recommendation" text={commandState.command_recommendation} />
          <NoteCard label="Confidence" text={commandState.command_confidence_note ?? "Confidence context is still limited."} />
          <NoteCard label="Governance" text={commandState.command_governance_note ?? "Governance context is still forming."} />
          <NoteCard label="Approval" text={commandState.command_approval_note ?? "Approval context is still forming."} />
        </div>
      </Section>

      <Section label="Next Move" title={commandState.next_move} summary={commandState.next_move_reason}>
        <div style={{ ...softCardStyle, padding: 12, gap: 6, color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
          {commandState.next_move_reason}
        </div>
      </Section>

      <Section label="Routing" title="Where to go next" summary="Open the deeper surface that best matches the current command priority.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {commandState.routing_hints.map((hint) => (
            <div key={`${hint.target_view}:${hint.label}`} style={{ ...softCardStyle, padding: 12, gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{hint.label}</div>
                  <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{hint.reason}</div>
                </div>
                {props.onOpenView ? (
                  <button type="button" onClick={() => props.onOpenView?.(hint.target_view)} style={secondaryButtonStyle}>
                    Open
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Review Flags" title="What still needs attention" summary="These are the main unresolved issues still shaping the command posture.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {(commandState.review_flags.length ? commandState.review_flags : ["Strategic command is still forming."]).map((flag) => (
            <div key={flag} style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {flag}
            </div>
          ))}
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

function NoteCard(props: { label: string; text: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.text}</div>
    </div>
  );
}
