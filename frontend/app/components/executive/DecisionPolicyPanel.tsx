"use client";

import React from "react";

import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionPolicyPanelProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenDecisionGovernance?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function DecisionPolicyPanel(props: DecisionPolicyPanelProps) {
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
  const policy = React.useMemo(
    () =>
      buildDecisionPolicyState({
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
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Policy</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Understand which policy rules are shaping the current decision posture.
        </div>
      </div>

      <Section label="Policy Posture" title={pretty(policy.posture)} summary={policy.explanation}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Posture" value={pretty(policy.posture)} />
          <StatCard label="Drivers" value={String(policy.policy_drivers.length)} />
          <StatCard label="Constraints" value={String(policy.constraints.length)} />
        </div>
      </Section>

      <Section label="Policy Drivers" title="What is most shaping this posture" summary="These are the main reasons Nexora is using the current control posture.">
        <ListCard label={null} items={policy.policy_drivers} empty="No strong policy driver is visible yet." />
      </Section>

      <Section label="Rule Evaluations" title="How the rules evaluated this decision" summary="Each rule shows how Nexora translated risk, evidence, alignment, and memory into a policy posture.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {policy.evaluations.map((evaluation) => (
            <div key={evaluation.rule_id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{evaluation.label}</div>
                <div style={{ color: evaluation.passed ? "#fef3c7" : "#86efac", fontSize: 11, fontWeight: 800 }}>
                  {evaluation.passed ? pretty(evaluation.impact) : "Allow"}
                </div>
              </div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{evaluation.summary}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Constraints" title="What this posture means operationally" summary="These constraints translate policy into practical decision discipline.">
        <ListCard label={null} items={policy.constraints} empty="No hard policy constraint is visible yet." />
      </Section>

      <Section label="Next Steps" title="What to do next" summary="Policy should guide better action, not just add bureaucracy.">
        <ListCard label={null} items={policy.next_steps} empty="No next step is available yet." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
