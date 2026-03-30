"use client";

import React from "react";

import { loadCollaborationEnvelope } from "../../lib/collaboration/collaborationStore";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildAutonomousDecisionCouncilState } from "../../lib/council/buildAutonomousDecisionCouncilState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type AutonomousDecisionCouncilPanelProps = {
  workspaceId?: string | null;
  projectId?: string | null;
  responseData?: unknown | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: unknown | null;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenDecisionGovernance?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
  onOpenCollaborationIntelligence?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function AutonomousDecisionCouncilPanel(
  props: AutonomousDecisionCouncilPanelProps
) {
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
  const state = React.useMemo(
    () =>
      buildAutonomousDecisionCouncilState({
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
        collaborationInputs: collaborationEnvelope?.inputs ?? [],
      }),
    [
      props.responseData,
      props.canonicalRecommendation,
      props.decisionResult,
      props.memoryEntries,
      collaborationEnvelope,
    ]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Council</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          See how Nexora&apos;s internal decision roles review, challenge, and converge on the current recommendation.
        </div>
      </div>

      <Section
        label="Council Outcome"
        title={state.consensus.final_recommendation}
        summary={state.explanation}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Consensus" value={pretty(state.consensus.consensus_level)} />
          <StatCard label="Support" value={state.consensus.strongest_support[0] ?? "Still forming"} />
          <StatCard label="Reservation" value={state.consensus.main_reservations[0] ?? "No major reservation"} />
        </div>
      </Section>

      <Section
        label="Internal Roles"
        title="How the council pressure-tested the decision"
        summary="Each role reviews the same underlying recommendation through a different strategic responsibility."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {state.role_perspectives.map((perspective) => (
            <div key={perspective.role} style={{ ...softCardStyle, padding: 12, gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {pretty(perspective.role)}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>{perspective.headline}</div>
                <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>
                  {perspective.confidence_note ?? "Confidence context remains limited."}
                </div>
              </div>
              <MiniList label="Priorities" items={perspective.priorities} empty="No priority signal is available yet." />
              <MiniList label="Concerns" items={perspective.concerns} empty="No concern is visible yet." />
              <MiniList label="Proposed action" items={[perspective.proposed_action]} empty="No proposed action is visible yet." />
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="Debate"
        title="Where the council agrees and where it still pushes back"
        summary="The council is most useful when it makes support, tension, and uncertainty explicit."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
          <MiniList label="Agreement points" items={state.debate.agreement_points} empty="No clear agreement is visible yet." />
          <MiniList label="Conflict points" items={state.debate.conflict_points} empty="No material conflict is visible yet." />
          <MiniList label="Unresolved questions" items={state.debate.unresolved_questions} empty="No unresolved question is visible yet." />
        </div>
      </Section>

      <Section
        label="Consensus"
        title={`Consensus is ${pretty(state.consensus.consensus_level)}`}
        summary={state.consensus.rationale}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniList label="Strongest support" items={state.consensus.strongest_support} empty="Support is still tentative." />
          <MiniList label="Main reservations" items={state.consensus.main_reservations} empty="No major reservation is visible yet." />
        </div>
      </Section>

      <Section
        label="Next Steps"
        title="What the council wants to happen next"
        summary="The council remains advisory and should sharpen the next move, not lock the user into one path."
      >
        <MiniList label={null} items={state.next_steps} empty="No council next step is visible yet." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {props.onOpenCompare ? (
            <button type="button" onClick={props.onOpenCompare} style={secondaryButtonStyle}>
              Open Compare
            </button>
          ) : null}
          {props.onOpenDecisionGovernance ? (
            <button type="button" onClick={props.onOpenDecisionGovernance} style={secondaryButtonStyle}>
              Open Governance
            </button>
          ) : null}
          {props.onOpenExecutiveApproval ? (
            <button type="button" onClick={props.onOpenExecutiveApproval} style={secondaryButtonStyle}>
              Open Approval
            </button>
          ) : null}
          {props.onOpenCollaborationIntelligence ? (
            <button type="button" onClick={props.onOpenCollaborationIntelligence} style={secondaryButtonStyle}>
              Open Collaboration
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
      <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800, lineHeight: 1.45 }}>{props.value}</div>
    </div>
  );
}

function MiniList(props: { label: string | null; items: string[]; empty: string }) {
  const rows = props.items.length ? props.items : [props.empty];
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      {props.label ? (
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
      ) : null}
      {rows.map((item) => (
        <div key={item} style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          {item}
        </div>
      ))}
    </div>
  );
}
