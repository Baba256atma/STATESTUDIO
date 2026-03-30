"use client";

import React from "react";

import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { buildComparePanelModel, type CompareOption } from "../../lib/decision/recommendation/buildComparePanelModel";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";
import { DecisionActionBar } from "./DecisionActionBar";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { loadApprovalWorkflowEnvelope } from "../../lib/approval/approvalWorkflowStore";

type DecisionComparePanelProps = {
  responseData?: any;
  strategicAdvice?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
  memoryEntries?: DecisionMemoryEntry[];
  onApplyRecommended?: (() => void) | null;
  onSimulateDeeper?: (() => void) | null;
  onViewRiskFlow?: (() => void) | null;
  onViewScenarioTree?: (() => void) | null;
  onOpenDecisionTimeline?: (() => void) | null;
  onPreviewDecision?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onSaveScenario?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onApplyDecisionSafe?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onOpenDecisionPolicy?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function DecisionComparePanel(props: DecisionComparePanelProps) {
  const model = buildComparePanelModel({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    strategicAdvice: props.strategicAdvice ?? null,
    responseData: props.responseData ?? null,
  });
  const executionIntent = buildDecisionExecutionIntent({
    source: "compare",
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    compareOption: model.recommendedOption,
    responseData: props.responseData ?? null,
    decisionResult: props.decisionResult ?? null,
  });
  const policy = buildDecisionPolicyState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries: props.memoryEntries ?? [],
  });
  const governance = buildDecisionGovernanceState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries: props.memoryEntries ?? [],
    policyState: policy,
  });
  const approvalEnvelope = React.useMemo(
    () =>
      loadApprovalWorkflowEnvelope(
        props.responseData?.workspace_id ?? null,
        props.responseData?.project_id ?? null,
        governance.decision_id ?? executionIntent?.id ?? props.canonicalRecommendation?.id ?? null
      ),
    [props.responseData?.workspace_id, props.responseData?.project_id, governance.decision_id, executionIntent?.id, props.canonicalRecommendation?.id]
  );
  const approvalWorkflow = buildApprovalWorkflowState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionGovernance: governance,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries: props.memoryEntries ?? [],
    existingWorkflow: approvalEnvelope?.workflow ?? null,
    policyState: policy,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Compare Options</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Evaluate the recommended move against viable alternatives.
        </div>
      </div>

      {props.decisionLoading || props.decisionStatus === "loading" ? (
        <ComparePlaceholder message="Running option comparison and decision analysis..." />
      ) : null}
      {props.decisionStatus === "error" && !model.recommendedOption ? (
        <ComparePlaceholder message={props.decisionError ?? "No comparison yet. Run a simulation or analysis to compare options."} />
      ) : null}

      {!model.recommendedOption && props.decisionStatus !== "loading" ? (
        <ComparePlaceholder message="No recommendation yet. Run a simulation or analysis to compare options." />
      ) : null}

      {model.recommendedOption ? (
        <>
          <div style={{ ...softCardStyle, padding: 14, gap: 10, border: "1px solid rgba(96,165,250,0.24)" }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Recommended Option
            </div>
            <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>{model.recommendedOption.title}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
              {model.compareSummary ?? model.recommendedOption.summary ?? "This is the strongest visible option in the current decision context."}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge label="Recommended" tone="info" />
              <Badge label={`Confidence ${model.recommendedOption.confidence_level ?? "medium"}`} tone={badgeTone(model.recommendedOption.confidence_level)} />
              {props.onOpenDecisionTimeline ? (
                <button type="button" onClick={props.onOpenDecisionTimeline} style={secondaryButtonStyle}>
                  Why this?
                </button>
              ) : null}
            </div>
            {model.recommendedOption.impact_summary ? (
              <div style={{ color: "#dbeafe", fontSize: 12, lineHeight: 1.45 }}>
                {model.recommendedOption.impact_summary}
              </div>
            ) : null}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <CompareOptionCard option={model.recommendedOption} resolveObjectLabel={props.resolveObjectLabel ?? null} />
            {model.alternatives.length ? (
              model.alternatives.slice(0, 2).map((option) => (
                <CompareOptionCard
                  key={option.id}
                  option={option}
                  resolveObjectLabel={props.resolveObjectLabel ?? null}
                />
              ))
            ) : (
              <CompareOptionCard
                option={{
                  id: "no-alternative",
                  title: "No alternative options yet",
                  summary: "Run a deeper simulation or comparison to surface another path.",
                  isRecommended: false,
                }}
                resolveObjectLabel={props.resolveObjectLabel ?? null}
              />
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <CompareSection
              title="Key Trade-offs"
              items={
                model.tradeoffs.length
                  ? model.tradeoffs
                  : ["No major trade-off is visible yet."]
              }
            />
            <CompareSection
              title="Why this option is stronger"
              items={
                model.whyRecommended.length
                  ? model.whyRecommended
                  : ["This option currently provides the best visible overall balance."]
              }
            />
          </div>

          <CompareSection
            title="Why not the others"
            items={
              model.whyNotOthers.length
                ? model.whyNotOthers
                : ["No alternative options are available yet."]
            }
          />

          <div style={{ ...softCardStyle, padding: 12, gap: 10 }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Next Actions
            </div>
            <DecisionActionBar
              intent={executionIntent}
              policyState={policy}
              governanceState={governance}
              approvalWorkflowState={approvalWorkflow}
              onOpenPolicy={props.onOpenDecisionPolicy ?? null}
              onOpenApproval={props.onOpenExecutiveApproval ?? null}
              onSimulateDecision={() => props.onSimulateDeeper?.()}
              onPreviewImpact={props.onPreviewDecision ?? null}
              onSaveScenario={props.onSaveScenario ?? null}
              onApplySafeMode={props.onApplyDecisionSafe ?? (() => {
                props.onApplyRecommended?.();
              })}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={props.onViewRiskFlow ?? (() => {})} style={secondaryButtonStyle}>
                View Risk Flow
              </button>
              <button type="button" onClick={props.onViewScenarioTree ?? (() => {})} style={secondaryButtonStyle}>
                View Scenario Tree
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CompareOptionCard(props: {
  option: CompareOption;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
}) {
  return (
    <div
      style={{
        ...softCardStyle,
        padding: 12,
        gap: 8,
        border: props.option.isRecommended ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{props.option.title}</div>
        {props.option.isRecommended ? <Badge label="Recommended" tone="info" /> : null}
      </div>
      {props.option.summary ? (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.option.summary}</div>
      ) : null}
      {props.option.impact_summary ? (
        <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{props.option.impact_summary}</div>
      ) : null}
      {props.option.tradeoff ? (
        <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.45 }}>Trade-off: {props.option.tradeoff}</div>
      ) : null}
      {props.option.target_ids?.length ? (
        <div style={{ color: "#93c5fd", fontSize: 11, lineHeight: 1.45 }}>
          Targets: {props.option.target_ids.map((id) => props.resolveObjectLabel?.(id) ?? id).join(", ")}
        </div>
      ) : null}
      {props.option.confidence_level ? (
        <div style={{ color: nx.lowMuted, fontSize: 11 }}>
          Confidence {props.option.confidence_level}
        </div>
      ) : null}
    </div>
  );
}

function CompareSection(props: { title: string; items: string[] }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.title}
      </div>
      {props.items.slice(0, 4).map((item) => (
        <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
          <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ComparePlaceholder(props: { message: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 14, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Compare Options
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.message}</div>
    </div>
  );
}

function Badge(props: { label: string; tone: "positive" | "warning" | "info" | "neutral" }) {
  const toneMap = {
    positive: { color: "#dcfce7", border: "rgba(34,197,94,0.28)", background: "rgba(34,197,94,0.12)" },
    warning: { color: "#fef3c7", border: "rgba(245,158,11,0.28)", background: "rgba(245,158,11,0.12)" },
    info: { color: "#dbeafe", border: "rgba(96,165,250,0.28)", background: "rgba(59,130,246,0.14)" },
    neutral: { color: "#cbd5e1", border: nx.border, background: "rgba(15,23,42,0.58)" },
  } as const;
  const tone = toneMap[props.tone];
  return (
    <div
      style={{
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.color,
        fontSize: 10,
        fontWeight: 800,
        padding: "5px 8px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      {props.label}
    </div>
  );
}

function badgeTone(level?: "low" | "medium" | "high") {
  if (level === "high") return "positive" as const;
  if (level === "medium") return "warning" as const;
  return "neutral" as const;
}
