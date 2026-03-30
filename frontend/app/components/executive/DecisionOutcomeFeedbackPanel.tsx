"use client";

import React from "react";

import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { buildObservedOutcomeAssessment } from "../../lib/decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../../lib/decision/outcome/buildDecisionOutcomeFeedback";
import { buildDecisionFeedbackSignal } from "../../lib/decision/outcome/buildDecisionFeedbackSignal";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionOutcomeFeedbackPanelProps = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenDecisionTimeline?: (() => void) | null;
};

function prettify(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function tone(label: string) {
  if (label === "well_calibrated" || label === "as_expected") return nx.success;
  if (label === "overconfident" || label === "worse_than_expected") return nx.risk;
  if (label === "underconfident" || label === "better_than_expected") return "#93c5fd";
  return nx.lowMuted;
}

export function DecisionOutcomeFeedbackPanel(props: DecisionOutcomeFeedbackPanelProps) {
  const latestMemory = props.memoryEntries?.[0] ?? null;
  const observedAssessment = React.useMemo(
    () =>
      buildObservedOutcomeAssessment({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult, props.memoryEntries]
  );
  const feedback = React.useMemo(
    () =>
      buildDecisionOutcomeFeedback({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        observedAssessment,
        memoryEntry: latestMemory,
        responseData: props.responseData ?? null,
      }),
    [props.canonicalRecommendation, observedAssessment, latestMemory, props.responseData]
  );
  const calibration = React.useMemo(
    () =>
      buildDecisionFeedbackSignal({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        outcomeFeedback: feedback,
        priorAdjustedScore: latestMemory?.calibration_result?.adjusted_confidence_score ?? null,
      }),
    [props.canonicalRecommendation, feedback, latestMemory]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Outcome Feedback</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Compare expected impact with observed or replayed results.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SummaryCard
          label="Expected Outcome"
          title={feedback.expected_summary ?? "No expected outcome captured yet."}
          body={props.canonicalRecommendation?.primary.action ?? "Recommendation context is not available yet."}
        />
        <SummaryCard
          label="Observed Outcome"
          title={feedback.observed_summary ?? "No outcome feedback available yet."}
          body={
            observedAssessment.observation_available
              ? `Observation strength: ${prettify(observedAssessment.observation_strength)}`
              : "Nexora needs execution, replay, or saved outcome evidence to compare predictions against reality."
          }
        />
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Match vs divergence
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <SignalList
            title="Matched signals"
            items={feedback.matched_signals}
            emptyText="No clear matched signal is visible yet."
            tone={nx.success}
          />
          <SignalList
            title="Diverged signals"
            items={feedback.diverged_signals}
            emptyText="No major divergence is visible yet."
            tone={nx.risk}
          />
        </div>
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Calibration result
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Original confidence
            </div>
            <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>
              {prettify(calibration.original_confidence_level ?? "unknown")}
            </div>
            {typeof calibration.original_confidence_score === "number" ? (
              <div style={{ color: "#93c5fd", fontSize: 12 }}>{Math.round(calibration.original_confidence_score * 100)}%</div>
            ) : null}
          </div>
          <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Adjusted confidence
            </div>
            <div style={{ color: tone(calibration.calibration_label), fontSize: 14, fontWeight: 800 }}>
              {prettify(calibration.adjusted_confidence_level ?? "unknown")}
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {prettify(calibration.calibration_label)}
              {typeof calibration.adjusted_confidence_score === "number"
                ? ` (${Math.round(calibration.adjusted_confidence_score * 100)}%)`
                : ""}
            </div>
          </div>
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{calibration.explanation}</div>
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Guidance
        </div>
        <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{feedback.feedback_summary}</div>
        <div style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.5 }}>
          {feedback.guidance ?? "Collect more outcome evidence before making a stronger trust adjustment."}
        </div>
        {props.onOpenDecisionTimeline ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={props.onOpenDecisionTimeline} style={secondaryButtonStyle}>
              Open Audit Timeline
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SummaryCard(props: { label: string; title: string; body: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800, lineHeight: 1.4 }}>{props.title}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.body}</div>
    </div>
  );
}

function SignalList(props: { title: string; items: string[]; emptyText: string; tone: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.title}
      </div>
      {props.items.length ? (
        props.items.slice(0, 4).map((item) => (
          <div key={item} style={{ color: props.tone, fontSize: 12, lineHeight: 1.45 }}>
            {item}
          </div>
        ))
      ) : (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.emptyText}</div>
      )}
    </div>
  );
}
