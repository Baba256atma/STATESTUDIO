"use client";

import React from "react";

import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionGovernancePanelProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenTeamDecision?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function DecisionGovernancePanel(props: DecisionGovernancePanelProps) {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Governance</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          See what this decision is allowed to do, what requires review, and what should happen next.
        </div>
      </div>

      <Section label="Governance Status" title={pretty(governance.mode)} summary={governance.explanation}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Mode" value={pretty(governance.mode)} />
          <StatCard label="Approval" value={governance.approval.required ? "Required" : "Not required"} />
          <StatCard label="Escalation" value={governance.escalation_required ? "Required" : "Not required"} />
        </div>
      </Section>

      <Section label="Actions" title="What is allowed right now" summary="Governance controls what can proceed now versus what stays gated.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ListCard label="Allowed actions" items={governance.allowed_actions.map(pretty)} empty="No action is currently allowed." />
          <ListCard label="Blocked or gated actions" items={governance.blocked_actions.map(pretty)} empty="No action is currently blocked." />
        </div>
      </Section>

      <Section label="Approval / Escalation" title="What review is required" summary="Use this to understand who must review or approve the next move.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Approval
            </div>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>
              {governance.approval.required
                ? `Required from ${pretty(governance.approval.approver_role ?? "manager")}`
                : "No explicit approval required"}
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {governance.approval.reason ?? "Current policy does not require a separate approver."}
            </div>
          </div>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Escalation
            </div>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>
              {governance.escalation_required ? "Escalation required" : "Escalation not required"}
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {governance.escalation_reason ?? "The current governance posture does not require escalation."}
            </div>
          </div>
        </div>
      </Section>

      <Section label="Rule Evaluations" title="Why this governance posture was chosen" summary="Each rule shows how Nexora reached the current control posture.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {governance.rule_evaluations.map((rule) => (
            <div key={rule.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{rule.label}</div>
                <div style={{ color: rule.passed ? "#86efac" : "#fca5a5", fontSize: 11, fontWeight: 800 }}>
                  {rule.passed ? "Passed" : "Failed"}
                </div>
              </div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{rule.summary}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Next Steps" title="What to do next" summary="Governance should guide the user toward the safest useful path, not just block action.">
        <ListCard label={null} items={governance.next_steps} empty="No next step is available yet." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          {props.onOpenTeamDecision ? (
            <button type="button" onClick={props.onOpenTeamDecision} style={secondaryButtonStyle}>
              Open Team Decision
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
