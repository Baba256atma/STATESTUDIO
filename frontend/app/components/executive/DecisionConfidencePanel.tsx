"use client";

import React from "react";

import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import {
  buildDecisionConfidenceModel,
  type DecisionConfidenceModel,
} from "../../lib/decision/confidence/buildDecisionConfidenceModel";
import { nx, cardStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionConfidencePanelProps = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any;
  decisionResult?: any;
  titleLabel?: string;
};

function levelTone(level: DecisionConfidenceModel["level"]) {
  if (level === "high") return nx.success;
  if (level === "medium") return nx.warning;
  return nx.risk;
}

function severityTone(severity: "low" | "medium" | "high") {
  if (severity === "high") return nx.risk;
  if (severity === "medium") return nx.warning;
  return "#cbd5e1";
}

export function DecisionConfidencePanel(props: DecisionConfidencePanelProps) {
  const model = React.useMemo(
    () =>
      buildDecisionConfidenceModel({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );

  return (
    <div style={{ ...cardStyle, gap: 14, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Decision Confidence"}</div>
        <div style={{ color: levelTone(model.level), fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {model.level} confidence
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 8, padding: 12, border: "1px solid rgba(96,165,250,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>Confidence Signal</div>
          <div style={{ color: "#dbeafe", fontSize: 12, fontWeight: 700 }}>{Math.round(model.overall_score * 100)}%</div>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "rgba(2,6,23,0.72)", overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.max(8, Math.min(100, model.overall_score * 100))}%`,
              height: "100%",
              borderRadius: 999,
              background:
                model.level === "high"
                  ? "linear-gradient(90deg, rgba(34,197,94,0.82), rgba(16,185,129,0.45))"
                  : model.level === "medium"
                  ? "linear-gradient(90deg, rgba(245,158,11,0.82), rgba(234,179,8,0.45))"
                  : "linear-gradient(90deg, rgba(239,68,68,0.82), rgba(244,63,94,0.45))",
            }}
          />
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{model.explanation}</div>
      </div>

      <ConfidenceList
        title="Why confidence looks this way"
        items={model.drivers.map((driver) => ({
          key: `${driver.label}-${driver.note}`,
          tone: driver.impact === "positive" ? nx.success : nx.risk,
          label: driver.label,
          note: driver.note,
          marker: driver.impact === "positive" ? "+" : "-",
        }))}
        emptyText="Confidence is limited due to insufficient data. Use Compare or Simulation to strengthen decision clarity."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ConfidenceSimpleList
          title="Assumptions"
          items={model.assumptions}
          emptyText="No explicit assumptions are available yet."
        />
        <ConfidenceSimpleList
          title="Uncertainties"
          items={model.uncertainties}
          emptyText="No major uncertainty notes are visible yet."
        />
      </div>

      <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Risk Flags
        </div>
        {model.risk_flags.length ? (
          model.risk_flags.slice(0, 4).map((flag) => (
            <div key={flag.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{flag.label}</div>
              <div style={{ color: severityTone(flag.severity), fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                {flag.severity}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            No major risk flags are visible yet.
          </div>
        )}
      </div>
    </div>
  );
}

function ConfidenceList(props: {
  title: string;
  items: Array<{ key: string; tone: string; label: string; note: string; marker: string }>;
  emptyText: string;
}) {
  return (
    <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.title}
      </div>
      {props.items.length ? (
        props.items.slice(0, 5).map((item) => (
          <div key={item.key} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: item.tone, fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>{item.marker}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.label}</span>
              <span style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{item.note}</span>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.emptyText}</div>
      )}
    </div>
  );
}

function ConfidenceSimpleList(props: { title: string; items: string[]; emptyText: string }) {
  return (
    <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
