"use client";

import React from "react";

import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import {
  buildDecisionTimelineModel,
  type DecisionTimelineStage as ExecutiveDecisionTimelineStage,
} from "../../lib/decision/timeline/buildDecisionTimelineModel";
import { DecisionTimeline } from "../warroom/DecisionTimeline";
import type { DecisionTimelineStage } from "../warroom/TimelineNode";
import type { DecisionTimelineTransitionData } from "../warroom/TimelineTransition";
import { nx, panelSurfaceStyle, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";
import { logPanelOnce } from "../../lib/debug/panelLogSignature";
import { resolveDecisionTimelineReadiness } from "../../lib/panels/panelDataReadiness";
import { buildTimelineIntelligence, logPanelIntelligence } from "../../lib/intelligence/panelIntelligence";
import { buildTimelineDecisionSet } from "../../lib/decision/decisionEngine";
import { PanelDecisionSetSection } from "../panels/PanelDecisionSetSection";
import { RightPanelFallback } from "../right-panel/RightPanelFallback";

type DecisionTimelinePanelProps = {
  responseData?: any;
  strategicAdvice?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  onCompareOptions?: (() => void) | null;
  onSimulateDecision?: (() => void) | null;
  onReturnToWarRoom?: (() => void) | null;
};

function toneToMetricTone(
  direction?: "up" | "down" | "neutral"
): "positive" | "negative" | "neutral" {
  if (direction === "up") return "positive";
  if (direction === "down") return "negative";
  return "neutral";
}

function toneToTransition(
  direction?: "up" | "down" | "neutral"
): "positive" | "negative" | "neutral" {
  if (direction === "up") return "positive";
  if (direction === "down") return "negative";
  return "neutral";
}

function buildTransitions(stages: ExecutiveDecisionTimelineStage[]): DecisionTimelineTransitionData[] {
  const after = stages.find((stage) => stage.id === "after");
  const whatIf = stages.find((stage) => stage.id === "what_if");
  return [
    {
      id: "before-after",
      label: "Recommended shift",
      summary:
        after?.impactItems?.[0]?.value ??
        after?.summary ??
        "Projected change becomes visible once the recommended move is simulated.",
      tone: toneToTransition(after?.impactItems?.[0]?.direction ?? "up"),
    },
    {
      id: "after-what-if",
      label: "Alternative path",
      summary:
        whatIf?.details?.[0] ??
        whatIf?.impactItems?.[0]?.value ??
        "Alternative path shows a different balance of risk and control.",
      tone: toneToTransition(whatIf?.impactItems?.[0]?.direction ?? "neutral"),
    },
  ];
}

function mapStage(stage: ExecutiveDecisionTimelineStage): DecisionTimelineStage {
  return {
    id: stage.id,
    title: stage.title,
    label:
      stage.id === "before"
        ? "Current state"
        : stage.id === "after"
        ? "Recommended path"
        : "Alternative path",
    narrative: stage.summary,
    metrics: (stage.impactItems ?? []).slice(0, 4).map((item) => ({
      label: item.label,
      value: item.value ?? "No visible change",
      tone: toneToMetricTone(item.direction),
    })),
    focusObjectId: stage.target_ids?.[0] ?? null,
  };
}

export function DecisionTimelinePanel(props: DecisionTimelinePanelProps) {
  const model = React.useMemo(
    () =>
      buildDecisionTimelineModel({
        responseData: props.responseData ?? null,
        strategicAdvice: props.strategicAdvice ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.responseData, props.strategicAdvice, props.canonicalRecommendation, props.decisionResult]
  );
  const [activeStageId, setActiveStageId] = React.useState<ExecutiveDecisionTimelineStage["id"]>("after");
  const playbackTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setActiveStageId("after");
  }, [model.stages]);

  React.useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        window.clearTimeout(playbackTimerRef.current);
      }
    };
  }, []);

  const activeStage =
    model.stages.find((stage) => stage.id === activeStageId) ??
    model.stages.find((stage) => stage.id === "after") ??
    model.stages[0] ??
    null;

  const stages = React.useMemo(() => model.stages.map(mapStage), [model.stages]);
  const transitions = React.useMemo(() => buildTransitions(model.stages), [model.stages]);

  const readiness = resolveDecisionTimelineReadiness({
    stageCount: model.stages.length,
    decisionLoading: props.decisionLoading,
    decisionStatus: props.decisionStatus ?? null,
  });

  React.useEffect(() => {
    logPanelOnce("[Nexora][PanelDataState]", { panel: "timeline", readiness });
  }, [readiness]);

  const timelineIntel = React.useMemo(
    () =>
      buildTimelineIntelligence({
        stageCount: model.stages.length,
        activeSummary: activeStage?.summary ?? null,
        activeTitle: activeStage?.title ?? null,
        recommendationLabel: activeStage?.recommendationLabel ?? null,
        hasRecommendedPath: Boolean(activeStage?.isRecommendedPath),
      }),
    [
      model.stages.length,
      activeStage?.summary,
      activeStage?.title,
      activeStage?.recommendationLabel,
      activeStage?.isRecommendedPath,
    ]
  );

  React.useEffect(() => {
    logPanelIntelligence("timeline", timelineIntel);
  }, [timelineIntel]);

  const timelineDecisionSet = React.useMemo(() => {
    const afterStage = model.stages.find((s) => s.id === "after");
    const whatIf = model.stages.find((s) => s.id === "what_if");
    return buildTimelineDecisionSet({
      stageCount: model.stages.length,
      hasRecommendedPath: Boolean(afterStage?.isRecommendedPath),
      recommendedSummary: afterStage?.summary ?? null,
      alternativeHint: whatIf?.summary ?? whatIf?.details?.[0] ?? null,
    });
  }, [model.stages]);

  const handlePlayStory = React.useCallback(() => {
    if (!model.hasPlayback) return;
    if (playbackTimerRef.current) {
      window.clearTimeout(playbackTimerRef.current);
    }
    const ordered = ["before", "after", "what_if"] as const;
    ordered.forEach((stageId, index) => {
      playbackTimerRef.current = window.setTimeout(() => {
        setActiveStageId(stageId);
      }, index * 900);
    });
  }, [model.hasPlayback]);

  const statusMessage =
    props.decisionStatus === "error"
      ? props.decisionError ?? "Timeline playback is not fully available yet."
      : props.decisionStatus === "loading" || props.decisionLoading
      ? "Building the decision story from the current simulation and recommendation."
      : null;

  if (readiness === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <RightPanelFallback mode="loading" embedded />
      </div>
    );
  }
  if (readiness === "empty") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <RightPanelFallback
          mode="empty"
          embedded
          message="No timeline segments yet. Run a simulation to build the decision story."
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Timeline</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          See how the system changes before, after, and under an alternative path.
        </div>
      </div>

      {props.decisionStatus === "error" && statusMessage ? (
        <div style={{ ...softCardStyle, padding: 12, color: nx.warning, fontSize: 12, lineHeight: 1.5 }}>{statusMessage}</div>
      ) : null}

      <div style={{ ...softCardStyle, border: "1px solid rgba(96,165,250,0.22)", padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Primary insight
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 15,
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.35,
            maxHeight: "4.6em",
            overflow: "hidden",
          }}
        >
          {timelineIntel.primary}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: nx.muted,
            opacity: 0.78,
            lineHeight: 1.45,
            maxHeight: "4.5em",
            overflow: "hidden",
          }}
        >
          {timelineIntel.implication}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: nx.text, lineHeight: 1.45 }}>
          <strong>Recommended action:</strong> {timelineIntel.action}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: nx.lowMuted, opacity: 0.72 }}>
          Confidence: {(timelineIntel.confidence * 100).toFixed(0)}%
        </div>
      </div>

      <PanelDecisionSetSection view="timeline" decisionSet={timelineDecisionSet} />

      <details style={{ borderRadius: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: nx.muted }}>
          Details: story, stages, scope & next steps
        </summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          {props.decisionStatus !== "error" && statusMessage ? (
            <div style={{ ...softCardStyle, padding: 12, color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{statusMessage}</div>
          ) : null}

          <div style={{ ...softCardStyle, padding: 14, gap: 10, border: "1px solid rgba(96,165,250,0.18)" }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Story Summary
            </div>
            <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>
              {activeStage?.summary ?? "No timeline available. Run a simulation to see how the system evolves."}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={handlePlayStory} style={primaryButtonStyle}>
                {model.playbackLabel ?? "View analysis"}
              </button>
              <button type="button" onClick={() => setActiveStageId("after")} style={secondaryButtonStyle}>
                Back
              </button>
            </div>
          </div>

          <DecisionTimeline
            stages={stages}
            transitions={transitions}
            activeStageId={activeStageId}
            onSelectStage={(stage) => setActiveStageId(stage.id as ExecutiveDecisionTimelineStage["id"])}
            emptyText="No timeline available. Run a simulation to see how the system evolves."
          />

          <div
            style={{
              ...panelSurfaceStyle,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              border: activeStage?.isRecommendedPath ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {activeStage?.title ?? "Timeline stage"}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
                  {activeStage?.recommendationLabel ?? "Decision story"}
                </div>
              </div>
              {activeStage?.confidenceLevel ? (
                <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                  Confidence {activeStage.confidenceLevel}
                </div>
              ) : null}
            </div>

            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
              {activeStage?.summary ?? "No stage summary available yet."}
            </div>

            {(activeStage?.details?.length ?? 0) > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(activeStage?.details ?? []).slice(0, 4).map((detail) => (
                  <div key={detail} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
                    <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{detail}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
                {activeStage?.id === "before"
                  ? "No current-state detail is available yet."
                  : activeStage?.id === "what_if"
                    ? "No alternative path is available yet. Use Compare Options to evaluate another move."
                    : "No projected outcome yet. Run a simulation to see the expected change."}
              </div>
            )}

            {activeStage?.target_ids?.length ? (
              <div style={{ color: "#93c5fd", fontSize: 11, lineHeight: 1.45 }}>
                Scope: {activeStage.target_ids.map((id) => props.resolveObjectLabel?.(id) ?? id).join(", ")}
              </div>
            ) : null}
          </div>

          <div style={{ ...softCardStyle, padding: 12, gap: 10 }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Explore Next
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={props.onCompareOptions ?? (() => {})} style={primaryButtonStyle}>
                Open Compare
              </button>
              <button type="button" onClick={props.onSimulateDecision ?? (() => {})} style={secondaryButtonStyle}>
                Open Simulation
              </button>
              <button type="button" onClick={props.onReturnToWarRoom ?? (() => {})} style={secondaryButtonStyle}>
                Back
              </button>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
