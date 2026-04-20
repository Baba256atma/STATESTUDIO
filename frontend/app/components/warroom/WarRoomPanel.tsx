"use client";

import React from "react";

import { nx, panelSurfaceStyle } from "../ui/nexoraTheme";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";
import { ActionControls } from "./ActionControls";
import { ScenarioInspector } from "./ScenarioInspector";
import { ScenarioList } from "./ScenarioList";
import { StrategicCouncilPanel } from "../executive/StrategicCouncilPanel";
import { DecisionImpactPanel } from "../executive/DecisionImpactPanel";
import { DecisionBriefPanel } from "../executive/DecisionBriefPanel";
import type { StrategicCouncilResult } from "../../lib/council/strategicCouncilTypes";
import type { CustomerDemoProfile } from "../../lib/demo/customerDemoTypes";
import { CustomerDemoHero } from "../demo/CustomerDemoHero";
import type { DecisionImpactState } from "../../lib/impact/decisionImpactTypes";
import { mapDecisionBrief } from "../../lib/executive/decisionSummaryMapper";
import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import { StrategicNarrativeBlock } from "../executive/StrategicNarrativeBlock";
import { buildStrategicNarrative } from "../../lib/ui/narrative/buildStrategicNarrative";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { RecommendationCard } from "../recommendation/RecommendationCard";
import { DecisionActionBar } from "../executive/DecisionActionBar";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { loadApprovalWorkflowEnvelope } from "../../lib/approval/approvalWorkflowStore";
import { dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";

type WarRoomPanelProps = {
  controller: WarRoomController;
  selectedObjectLabel: string | null;
  strategicCouncil: StrategicCouncilResult | null;
  decisionImpact?: DecisionImpactState | null;
  demoProfile?: CustomerDemoProfile | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
  activeExecutiveView?: "simulate" | "compare" | "dashboard" | null;
  intelligence?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  onSimulateDecision?: (() => void) | null;
  onCompareOptions?: (() => void) | null;
  onOpenDecisionTimeline?: (() => void) | null;
  onPreviewDecision?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onSaveScenario?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onApplyDecisionSafe?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onOpenDecisionPolicy?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
  onClose: () => void;
};

type WarRoomActionId =
  | "open_policy"
  | "open_approval"
  | "simulate"
  | "compare"
  | "open_timeline";

export function WarRoomPanel(props: WarRoomPanelProps) {
  const panelLabels = props.demoProfile?.panel_labels ?? {};
  const emptyStateCopy = props.demoProfile?.empty_state_copy ?? {};
  const intelligence = (props.intelligence ?? props.controller.intelligence ?? null) as any;
  const decisionBrief = mapDecisionBrief({
    fragility: intelligence?.fragility ?? null,
    decisionImpact: props.decisionImpact ?? null,
    strategicAdvice: intelligence?.strategicAdvice ?? intelligence?.advice ?? null,
    strategicCouncil: props.strategicCouncil ?? null,
    cockpitExecutive: intelligence?.executiveSummary ?? intelligence?.summary ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? intelligence?.canonical_recommendation ?? null,
    promptFeedback: intelligence?.prompt_feedback ?? null,
    decisionSimulation: intelligence?.decision_simulation ?? null,
    reply: intelligence?.reply ?? null,
    selectedObjectLabel: props.selectedObjectLabel,
    resolveObjectLabel: props.resolveObjectLabel ?? null,
  });
  const focusTitle = decisionBrief.stable_system
    ? "No critical decision focus is active."
    : decisionBrief.summary.primary_object;
  const focusSummary = decisionBrief.stable_system
    ? decisionBrief.summary.situation
    : decisionBrief.summary.core_problem;
  const scenarioTitle =
    props.controller.state.activeScenarioId &&
    props.controller.state.scenarios[props.controller.state.activeScenarioId]
      ? props.controller.state.scenarios[props.controller.state.activeScenarioId]?.title ?? "Current scenario"
      : "Current scenario";
  const statusTone = decisionBrief.summary.risk_level === "critical"
    ? nx.risk
    : decisionBrief.summary.risk_level === "high"
    ? "#fda4af"
    : decisionBrief.summary.risk_level === "medium"
    ? nx.warning
    : nx.success;
  const strategicNarrative = buildStrategicNarrative({
    brief: decisionBrief,
    scenarioTitle,
    focusLabel: props.selectedObjectLabel ?? decisionBrief.summary.primary_object,
  });
  const canonicalRecommendation =
    props.canonicalRecommendation ?? decisionBrief.canonical_recommendation ?? intelligence?.canonical_recommendation ?? null;
  const expectedImpactLines = [
    decisionBrief.expected_impact.primary_effect,
    decisionBrief.expected_impact.risk_reduction ?? null,
    decisionBrief.expected_impact.secondary_effects[0] ?? null,
    decisionBrief.value_framing.qualitative_roi ?? null,
  ].filter((entry): entry is string => Boolean(entry?.trim()));
  const targetScope = canonicalRecommendation?.primary.target_ids?.length
    ? canonicalRecommendation.primary.target_ids
        .slice(0, 3)
        .map((targetId: string) => props.resolveObjectLabel?.(targetId) ?? targetId)
        .join(", ")
    : null;
  const impactConfidence =
    props.decisionResult?.simulation_result?.impact_score ??
    canonicalRecommendation?.confidence.score ??
    decisionBrief.summary.confidence;
  const supportingDetailOpen = props.decisionStatus === "ready";
  const executionIntent = buildDecisionExecutionIntent({
    source: "war_room",
    canonicalRecommendation,
    responseData: intelligence ?? null,
    decisionResult: props.decisionResult ?? null,
  });
  const policy = buildDecisionPolicyState({
    canonicalRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: intelligence ?? null,
    memoryEntries: props.memoryEntries ?? [],
  });
  const governance = buildDecisionGovernanceState({
    canonicalRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: intelligence ?? null,
    memoryEntries: props.memoryEntries ?? [],
    policyState: policy,
  });
  const approvalEnvelope = React.useMemo(
    () =>
      loadApprovalWorkflowEnvelope(
        intelligence?.workspace_id ?? null,
        intelligence?.project_id ?? null,
        governance.decision_id ?? executionIntent?.id ?? canonicalRecommendation?.id ?? null
      ),
    [intelligence?.workspace_id, intelligence?.project_id, governance.decision_id, executionIntent?.id, canonicalRecommendation?.id]
  );
  const approvalWorkflow = buildApprovalWorkflowState({
    canonicalRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionGovernance: governance,
    decisionResult: props.decisionResult ?? null,
    responseData: intelligence ?? null,
    memoryEntries: props.memoryEntries ?? [],
    existingWorkflow: approvalEnvelope?.workflow ?? null,
    policyState: policy,
  });
  dedupePanelConsoleTrace("PanelComponent", "war_room", "main", {
    meaningfulData: Boolean(intelligence),
    hasIntelligence: Boolean(intelligence),
    hasCanonicalRecommendation: Boolean(canonicalRecommendation),
    prioritiesCount: Array.isArray(intelligence?.priorities) ? intelligence.priorities.length : 0,
    risksCount: Array.isArray(intelligence?.risks) ? intelligence.risks.length : 0,
    hasRecommendation: Boolean(intelligence?.recommendation ?? canonicalRecommendation?.primary?.action),
    hasSummary: Boolean(intelligence?.summary),
  });
  const dispatchWarRoomAction = (actionId: WarRoomActionId) => {
    let resolvedView: string | null = null;

    switch (actionId) {
      case "open_policy":
        resolvedView = "decision_policy";
        break;
      case "open_approval":
        resolvedView = "executive_approval";
        break;
      case "simulate":
        resolvedView = "simulate";
        break;
      case "compare":
        resolvedView = "compare";
        break;
      case "open_timeline":
        resolvedView = "decision_timeline";
        break;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][WarRoomActionDispatch]", {
        actionId,
        resolvedView,
      });
    }

    if (actionId === "open_policy") {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][WarRoomAction]", {
          action: "open_policy",
          targetView: "decision_policy",
        });
      }
      if (!props.onOpenDecisionPolicy) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Nexora][WarRoomDashboardHijackBlocked]", {
            actionId,
            attemptedView: "dashboard",
          });
        }
        return;
      }
      props.onOpenDecisionPolicy();
      return;
    }

    if (actionId === "open_approval") {
      if (!props.onOpenExecutiveApproval) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Nexora][WarRoomDashboardHijackBlocked]", {
            actionId,
            attemptedView: "dashboard",
          });
        }
        return;
      }
      props.onOpenExecutiveApproval();
      return;
    }

    if (actionId === "simulate") {
      if (props.onSimulateDecision) {
        props.onSimulateDecision();
        return;
      }
      if (props.controller.canRun) {
        void props.controller.runScenario();
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Nexora][WarRoomDashboardHijackBlocked]", {
          actionId,
          attemptedView: "dashboard",
        });
      }
      return;
    }

    if (actionId === "compare") {
      if (!props.onCompareOptions) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Nexora][WarRoomDashboardHijackBlocked]", {
            actionId,
            attemptedView: "dashboard",
          });
        }
        return;
      }
      props.onCompareOptions();
      return;
    }

    if (actionId === "open_timeline") {
      if (!props.onOpenDecisionTimeline) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Nexora][WarRoomDashboardHijackBlocked]", {
            actionId,
            attemptedView: "dashboard",
          });
        }
        return;
      }
      props.onOpenDecisionTimeline();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
      {props.demoProfile ? <CustomerDemoHero profile={props.demoProfile} /> : null}
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>{panelLabels.war_room_title ?? "War Room"}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, maxWidth: 420, marginTop: 4 }}>
              {emptyStateCopy.war_room ?? "Compose a decision action, request strategic overlays, and keep the current scene intact."}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
              {props.controller.session.viewMode.toUpperCase()}
            </div>
            <button
              type="button"
              onClick={props.onClose}
              style={{ color: nx.lowMuted, background: "transparent", border: "none", cursor: "pointer", fontSize: 12, padding: 0 }}
            >
              Close
            </button>
          </div>
        </div>

        <WarRoomSection
          label="Current Situation"
          title={scenarioTitle}
          summary={decisionBrief.summary.situation}
          accent="neutral"
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <WarRoomStat label="Mode" value={props.controller.state.mode.toUpperCase()} />
            <WarRoomStat label="View" value={props.controller.session.viewMode.toUpperCase()} />
            <WarRoomStat label="Risk" value={decisionBrief.summary.risk_level.toUpperCase()} valueTone={statusTone} />
          </div>
        </WarRoomSection>

        <WarRoomSection
          label="Why It Matters"
          title={focusTitle}
          summary={focusSummary}
          accent="priority"
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            <WarRoomStat
              label="Confidence"
              value={decisionBrief.summary.confidence.toFixed(2)}
              valueTone="#93c5fd"
            />
            <WarRoomStat
              label="Primary Object"
              value={decisionBrief.summary.primary_object}
            />
          </div>
        </WarRoomSection>

        <WarRoomSection
          label="Strategic View"
          title="Read the decision story first"
          summary="Start with Nexora's strategic interpretation before moving into execution and deeper evidence."
          accent="neutral"
        >
          <StrategicNarrativeBlock
            title="Strategic View"
            narrative={strategicNarrative.narrative}
            takeaway={strategicNarrative.takeaway}
            caution={strategicNarrative.caution}
            isEmpty={!strategicNarrative.narrative}
          />
        </WarRoomSection>

        <WarRoomSection
          label="Recommended Move"
          title={decisionBrief.recommendation.action_title}
          summary={
            canonicalRecommendation?.reasoning.why ??
            decisionBrief.recommendation.reasoning
          }
          accent="priority"
        >
          {canonicalRecommendation ? (
            <RecommendationCard
              rec={canonicalRecommendation}
              onWhyThis={() => dispatchWarRoomAction("open_timeline")}
            />
          ) : (
            <WarRoomFallbackCard text="No recommendation yet. Run an analysis to generate guidance." />
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <WarRoomStat label="Urgency" value={decisionBrief.recommendation.urgency.toUpperCase()} valueTone={statusTone} />
            <WarRoomStat
              label="Action Type"
              value={decisionBrief.recommendation.action_type.replace(/_/g, " ").toUpperCase()}
            />
            <WarRoomStat
              label="Target Scope"
              value={targetScope ?? decisionBrief.summary.primary_object}
            />
          </div>
        </WarRoomSection>

        <WarRoomSection
          label="Actions"
          title="Choose the next move"
          summary="Act on the recommendation first, then explore comparison or scenario depth if you need more confidence."
          accent="neutral"
        >
          <DecisionActionBar
            intent={executionIntent}
            policyState={policy}
            governanceState={governance}
            approvalWorkflowState={approvalWorkflow}
            onOpenPolicy={
              props.onOpenDecisionPolicy
                ? () => {
                    if (process.env.NODE_ENV !== "production") {
                      console.log("[Nexora][WarRoomOpenPolicy]", {
                        requestedView: "decision_policy",
                        contextId: null,
                      });
                    }
                    dispatchWarRoomAction("open_policy");
                  }
                : null
            }
            onOpenApproval={
              props.onOpenExecutiveApproval
                ? () => {
                    if (process.env.NODE_ENV !== "production") {
                      console.log("[Nexora][CanonicalPanelOpen]", {
                        source: "WarRoomPanel.OpenApproval",
                        requestedView: "executive_approval",
                        contextId: null,
                      });
                    }
                    dispatchWarRoomAction("open_approval");
                  }
                : null
            }
            onSimulateDecision={() => dispatchWarRoomAction("simulate")}
            onPreviewImpact={props.onPreviewDecision ?? null}
            onCompareAlternatives={() => dispatchWarRoomAction("compare")}
            onSaveScenario={props.onSaveScenario ?? null}
            onApplySafeMode={props.onApplyDecisionSafe ?? null}
          />
          <ActionControls controller={props.controller} loading={props.controller.overlaySummary?.loading ?? false} />
        </WarRoomSection>
      </div>

      <WarRoomFlowGroup
        label="Expected Impact"
        summary="See what changes if you act now, then use the detailed impact footprint only if you need more evidence."
      >
        <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Expected Impact
              </div>
              <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
                {decisionBrief.expected_impact.primary_effect}
              </div>
            </div>
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
              Impact confidence {impactConfidence.toFixed(2)}
            </div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            {decisionBrief.expected_impact.system_change_summary}
          </div>
          <WarRoomBulletList
            items={expectedImpactLines.slice(0, 4)}
            emptyText="No impact summary yet. Simulate this decision to project the outcome."
          />
        </div>
        <DecisionImpactPanel
          impact={props.decisionImpact ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          titleLabel={panelLabels.impact_title ?? "Decision Impact"}
          emptyText={emptyStateCopy.impact ?? "No strong downstream impact path is active yet."}
        />
      </WarRoomFlowGroup>

      <WarRoomFlowGroup
        label="Compare / Explore Next"
        summary="Use council guidance and scenario options to compare alternatives, queue the next test, or move into deeper review."
      >
        <StrategicCouncilPanel
          council={props.strategicCouncil}
          compact
          titleLabel={panelLabels.council_title ?? "Recommended Next Move"}
          emptyText={emptyStateCopy.council ?? "No recommendation generated yet."}
        />
        <ScenarioList controller={props.controller} />
      </WarRoomFlowGroup>

      <WarRoomFlowGroup
        label="Supporting Detail"
        summary="Open the deeper brief and scenario inspector only when you need supporting evidence beyond the main decision flow."
      >
        <details
          open={supportingDetailOpen}
          style={{
            ...panelSurfaceStyle,
            padding: 14,
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              color: "#dbeafe",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            More detail
          </summary>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
            <DecisionBriefPanel
              brief={decisionBrief}
              titleLabel={panelLabels.decision_brief_title ?? "Decision Brief"}
              primaryActionLabel="Simulate This Decision"
              secondaryActionLabel="Compare Options"
              onPrimaryAction={() => dispatchWarRoomAction("simulate")}
              onSecondaryAction={() => dispatchWarRoomAction("compare")}
              decisionResult={props.decisionResult ?? null}
              decisionLoading={props.decisionLoading ?? false}
              decisionStatus={props.decisionStatus ?? "idle"}
              decisionError={props.decisionError ?? null}
              decisionMode={props.activeExecutiveView ?? "dashboard"}
            />
            <ScenarioInspector
              controller={props.controller}
              selectedObjectLabel={props.selectedObjectLabel}
              resolveObjectLabel={props.resolveObjectLabel ?? null}
            />
          </div>
        </details>
      </WarRoomFlowGroup>
    </div>
  );
}

function WarRoomFlowGroup(props: {
  label: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 2px" }}>
        <div
          style={{
            color: "#cbd5f5",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {props.label}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function WarRoomSection(props: {
  label: string;
  title: string;
  summary: string;
  accent?: "neutral" | "priority";
  children?: React.ReactNode;
}) {
  const priority = props.accent === "priority";
  return (
    <div
      style={{
        borderRadius: 16,
        border: priority ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
        background: priority ? "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(8,47,73,0.6))" : "rgba(2,6,23,0.46)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            color: priority ? "#bfdbfe" : "#cbd5f5",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {props.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: priority ? 16 : 14, fontWeight: 800, lineHeight: 1.3 }}>{props.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function WarRoomStat(props: { label: string; value: string; valueTone?: string }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        background: "rgba(2,6,23,0.36)",
        border: `1px solid ${nx.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
      }}
    >
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div
        style={{
          color: props.valueTone ?? nx.text,
          fontSize: 12,
          fontWeight: 800,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

function WarRoomBulletList(props: { items: string[]; emptyText: string }) {
  if (!props.items.length) {
    return <WarRoomFallbackCard text={props.emptyText} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {props.items.map((item) => (
        <div
          key={item}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            padding: "10px 12px",
            borderRadius: 12,
            border: `1px solid ${nx.border}`,
            background: "rgba(2,6,23,0.36)",
          }}
        >
          <div style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.4 }}>•</div>
          <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.5 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function WarRoomFallbackCard(props: { text: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: "rgba(2,6,23,0.36)",
        color: nx.muted,
        fontSize: 12,
        lineHeight: 1.5,
        padding: 12,
      }}
    >
      {props.text}
    </div>
  );
}
