"use client";

import React from "react";

import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { buildDecisionConfidenceModel } from "../../lib/decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../../lib/decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../../lib/decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { nx, panelSurfaceStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionConfidenceCalibrationPanelProps = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
};

function tone(label: string) {
  if (label === "well_calibrated") return nx.success;
  if (label === "overconfident") return nx.risk;
  if (label === "underconfident") return "#93c5fd";
  return nx.lowMuted;
}

function prettify(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function DecisionConfidenceCalibrationPanel(props: DecisionConfidenceCalibrationPanelProps) {
  const confidenceModel = React.useMemo(
    () =>
      buildDecisionConfidenceModel({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );

  const outcomeAssessment = React.useMemo(
    () =>
      buildDecisionOutcomeAssessment({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult, props.memoryEntries]
  );

  const calibration = React.useMemo(
    () =>
      buildDecisionConfidenceCalibration({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        confidenceModel,
        outcomeAssessment,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.canonicalRecommendation, confidenceModel, outcomeAssessment, props.memoryEntries]
  );

  const recentHistory = (props.memoryEntries ?? []).slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Confidence Calibration</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Review how predicted confidence compares with observed or replayed outcomes.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 10 }}>
        <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
          <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Original confidence
          </div>
          <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>
            {prettify(calibration.predicted_confidence_level)}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            Recommendation: {props.canonicalRecommendation?.primary.action ?? "No recommendation available yet."}
          </div>
          {typeof calibration.predicted_confidence_score === "number" ? (
            <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700 }}>
              {Math.round(calibration.predicted_confidence_score * 100)}%
            </div>
          ) : null}
        </div>

        <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
          <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Calibration result
          </div>
          <div style={{ color: tone(calibration.calibration_label), fontSize: 15, fontWeight: 800 }}>
            {prettify(calibration.calibration_label)}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            {calibration.calibrated_confidence_level === "unknown"
              ? "Outcome evidence is still limited."
              : `Calibrated confidence: ${prettify(calibration.calibrated_confidence_level)}${
                  typeof calibration.calibrated_confidence_score === "number"
                    ? ` (${Math.round(calibration.calibrated_confidence_score * 100)}%)`
                    : ""
                }`}
          </div>
        </div>
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Outcome vs expectation
        </div>
        <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>
          {prettify(outcomeAssessment.outcome_quality)}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          {outcomeAssessment.summary}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <SignalList
            title="Matched signals"
            items={outcomeAssessment.matched_signals}
            emptyText="No strong matched signals are visible yet."
          />
          <SignalList
            title="Mismatched signals"
            items={outcomeAssessment.mismatched_signals}
            emptyText="No major mismatches are visible yet."
          />
        </div>
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Explanation
        </div>
        <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.55 }}>{calibration.explanation}</div>
        {calibration.guidance ? (
          <div style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.55 }}>
            Guidance: {calibration.guidance}
          </div>
        ) : null}
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Recent calibration context
        </div>
        {recentHistory.length ? (
          recentHistory.map((entry) => (
            <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 700 }}>{entry.title}</div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  {entry.impact_summary ?? entry.recommendation_summary ?? "Outcome evidence remains limited."}
                </div>
              </div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                {entry.recommendation_confidence?.level ? prettify(entry.recommendation_confidence.level) : "Unknown"}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            No calibration available yet. Nexora needs replay, memory, or observed outcome evidence to compare confidence against reality.
          </div>
        )}
      </div>
    </div>
  );
}

function SignalList(props: { title: string; items: string[]; emptyText: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.title}
      </div>
      {props.items.length ? (
        props.items.slice(0, 4).map((item) => (
          <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
            <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{item}</span>
          </div>
        ))
      ) : (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.emptyText}</div>
      )}
    </div>
  );
}
