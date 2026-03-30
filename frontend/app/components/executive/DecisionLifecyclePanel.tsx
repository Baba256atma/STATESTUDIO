"use client";

import React from "react";

import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { runDecisionPipeline } from "../../lib/decision/core/runDecisionPipeline";
import { buildDecisionPipelineSummary } from "../../lib/decision/core/buildDecisionPipelineSummary";
import { appendDecisionPipelineSnapshot, loadDecisionPipelineSnapshots } from "../../lib/decision/core/decisionPipelineStore";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionLifecyclePanelProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  workspaceId?: string | null;
  projectId?: string | null;
  onOpenDecisionTimeline?: (() => void) | null;
  onOpenCompare?: (() => void) | null;
  onOpenOutcomeFeedback?: (() => void) | null;
};

export function DecisionLifecyclePanel(props: DecisionLifecyclePanelProps) {
  const pipeline = React.useMemo(
    () =>
      runDecisionPipeline({
        responseData: {
          ...(props.responseData ?? {}),
          canonical_recommendation: props.canonicalRecommendation ?? props.responseData?.canonical_recommendation,
        },
        prompt: props.memoryEntries?.[0]?.prompt ?? null,
        workspaceId: props.workspaceId ?? null,
        projectId: props.projectId ?? null,
        memoryEntries: props.memoryEntries ?? [],
        decisionResult: props.decisionResult ?? null,
      }),
    [props.responseData, props.canonicalRecommendation, props.memoryEntries, props.workspaceId, props.projectId, props.decisionResult]
  );
  const summary = React.useMemo(() => buildDecisionPipelineSummary(pipeline), [pipeline]);
  const [snapshotCount, setSnapshotCount] = React.useState(0);

  React.useEffect(() => {
    appendDecisionPipelineSnapshot({
      workspaceId: props.workspaceId,
      projectId: props.projectId,
      snapshot: pipeline,
    });
    setSnapshotCount(loadDecisionPipelineSnapshots(props.workspaceId, props.projectId).length);
  }, [pipeline, props.workspaceId, props.projectId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Lifecycle</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Review the full loop from reasoning through calibration and pattern learning.
        </div>
        <div style={{ color: "#cbd5f5", fontSize: 11, lineHeight: 1.45 }}>
          {snapshotCount
            ? `Lifecycle snapshots stored: ${snapshotCount}`
            : "Lifecycle snapshots will appear as Nexora records more decisions."}
        </div>
      </div>

      <Section
        label="Decision Overview"
        title={pipeline.recommendation?.primary?.action ?? "No recommendation available yet"}
        summary={summary.overview}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MetricCard label="Expected" value={summary.expected} />
          <MetricCard label="Observed" value={summary.observed} />
        </div>
      </Section>

      <Section
        label="Decision Strategy"
        title="How Nexora chose the decision path"
        summary={pipeline.meta_decision?.rationale ?? "No meta-decision strategy is visible yet."}
      >
        <LineList
          items={[
            pipeline.meta_decision?.selected_strategy
              ? `Selected strategy: ${pipeline.meta_decision.selected_strategy.replace(/_/g, " ")}`
              : null,
            pipeline.meta_decision?.action_posture
              ? `Action posture: ${pipeline.meta_decision.action_posture.replace(/_/g, " ")}`
              : null,
            ...(pipeline.meta_decision?.warnings ?? []),
          ].filter(Boolean) as string[]}
          empty="Meta-decision guidance is pending."
        />
      </Section>

      <Section
        label="Reasoning"
        title="Why Nexora interpreted the situation this way"
        summary={pipeline.reasoning?.trace?.selected_path_reason ?? "No reasoning trace available yet."}
      >
        <LineList
          items={[
            ...(pipeline.reasoning?.trace?.detected_signals ?? []),
            ...(pipeline.reasoning?.ambiguity_notes ?? []),
          ].slice(0, 4)}
          empty="No reasoning detail is available yet."
        />
      </Section>

      <Section
        label="Simulation"
        title="Projected system change"
        summary={pipeline.simulation?.impact?.summary ?? "No simulation has been attached yet."}
      >
        <LineList
          items={[
            pipeline.simulation?.risk?.summary,
            ...(pipeline.simulation?.timeline?.map((step) => step.summary) ?? []),
          ].filter(Boolean).slice(0, 4) as string[]}
          empty="Simulation is pending."
        />
      </Section>

      <Section
        label="Recommendation"
        title="Recommended move"
        summary={pipeline.recommendation?.reasoning?.why ?? "No canonical recommendation is available yet."}
      >
        <LineList
          items={[
            pipeline.recommendation?.primary?.impact_summary,
            pipeline.recommendation?.reasoning?.risk_summary,
            ...(pipeline.recommendation?.reasoning?.key_drivers ?? []),
          ].filter(Boolean).slice(0, 4) as string[]}
          empty="Recommendation detail is pending."
        />
      </Section>

      <Section
        label="Execution"
        title="What Nexora executed or previewed"
        summary={
          pipeline.execution?.simulation_result
            ? "Execution or preview output is available for review."
            : "No execution has been recorded yet."
        }
      >
        <LineList
          items={[
            pipeline.execution?.simulation_result?.impact_score !== undefined
              ? `Impact score ${Math.round((pipeline.execution?.simulation_result?.impact_score ?? 0) * 100)}%`
              : null,
            pipeline.execution?.simulation_result?.risk_change !== undefined
              ? `Risk change ${Math.round((pipeline.execution?.simulation_result?.risk_change ?? 0) * 100)}%`
              : null,
            Array.isArray(pipeline.execution?.simulation_result?.affected_objects) && pipeline.execution?.simulation_result?.affected_objects.length
              ? `${pipeline.execution.simulation_result.affected_objects.length} affected objects`
              : null,
          ].filter(Boolean) as string[]}
          empty="Execution is pending."
        />
      </Section>

      <Section
        label="Outcome Feedback"
        title="What happened after the decision"
        summary={pipeline.outcome_feedback?.feedback_summary ?? "No observed outcome evidence is available yet."}
      >
        <LineList
          items={[
            ...(pipeline.outcome_feedback?.matched_signals ?? []),
            ...(pipeline.outcome_feedback?.diverged_signals ?? []),
          ].slice(0, 4)}
          empty="Outcome feedback is pending."
        />
      </Section>

      <Section
        label="Calibration"
        title="How confidence changed"
        summary={summary.confidenceChange}
      >
        <LineList
          items={[
            pipeline.calibration?.explanation,
            pipeline.outcome_feedback?.guidance,
          ].filter(Boolean) as string[]}
          empty="Calibration is pending."
        />
      </Section>

      <Section
        label="Pattern Context"
        title="What Nexora is learning from similar decisions"
        summary={summary.learning}
      >
        <LineList
          items={[
            ...(pipeline.pattern_context?.top_success_patterns ?? []),
            ...(pipeline.pattern_context?.top_failure_patterns ?? []),
          ].slice(0, 4)}
          empty="Pattern evidence is still limited."
        />
      </Section>

      <Section
        label="Next Move"
        title="What to do next"
        summary={summary.nextMove}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {props.onOpenDecisionTimeline ? (
            <button type="button" onClick={props.onOpenDecisionTimeline} style={secondaryButtonStyle}>
              Open Audit Timeline
            </button>
          ) : null}
          {props.onOpenOutcomeFeedback ? (
            <button type="button" onClick={props.onOpenOutcomeFeedback} style={secondaryButtonStyle}>
              Open Outcome Feedback
            </button>
          ) : null}
          {props.onOpenCompare ? (
            <button type="button" onClick={props.onOpenCompare} style={secondaryButtonStyle}>
              Open Compare
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

function MetricCard(props: { label: string; value: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 12, lineHeight: 1.5 }}>{props.value}</div>
    </div>
  );
}

function LineList(props: { items: string[]; empty: string }) {
  return props.items.length ? (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
      {props.items.map((item) => (
        <div key={item} style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
          {item}
        </div>
      ))}
    </div>
  ) : (
    <div style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
      {props.empty}
    </div>
  );
}
