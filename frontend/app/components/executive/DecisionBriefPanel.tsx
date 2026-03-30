"use client";

import React from "react";

import type { DecisionBrief } from "../../lib/executive/decisionSummaryTypes";
import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import { cardStyle, nx, primaryButtonStyle, sectionTitleStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionBriefPanelProps = {
  brief: DecisionBrief;
  titleLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: (() => void) | null;
  onSecondaryAction?: (() => void) | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionMode?: "simulate" | "compare" | "dashboard" | null;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
};

function riskTone(riskLevel: DecisionBrief["summary"]["risk_level"]) {
  if (riskLevel === "critical") return nx.risk;
  if (riskLevel === "high") return "#fda4af";
  if (riskLevel === "medium") return nx.warning;
  return nx.success;
}

export function DecisionBriefPanel(props: DecisionBriefPanelProps) {
  const { brief } = props;
  const result = props.decisionResult ?? null;
  const decisionExecutionTitle =
    props.decisionMode === "simulate"
      ? "Decision Simulation"
      : props.decisionMode === "compare"
      ? "Compare Options"
      : "Decision Execution";

  return (
    <div style={{ ...cardStyle, gap: 14, padding: 14, border: "1px solid rgba(96,165,250,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Decision Brief"}</div>
        <div
          style={{
            color: riskTone(brief.summary.risk_level),
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {brief.summary.risk_level} risk
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 8, border: "1px solid rgba(96,165,250,0.2)" }}>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>{brief.summary.situation}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{brief.summary.core_problem}</div>
        <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
          Primary object: {brief.summary.primary_object} · Confidence {brief.summary.confidence.toFixed(2)}
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 6, padding: 12 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Recommended Action
        </div>
        <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{brief.recommendation.action_title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{brief.recommendation.reasoning}</div>
        <div style={{ color: "#93c5fd", fontSize: 11 }}>
          {brief.recommendation.action_type.replace(/_/g, " ")} · {brief.recommendation.urgency} urgency
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 6, padding: 12 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Expected Impact
        </div>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{brief.expected_impact.primary_effect}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{brief.expected_impact.system_change_summary}</div>
        {brief.expected_impact.secondary_effects.length ? (
          <div style={{ color: "#93c5fd", fontSize: 11 }}>
            Secondary effects: {brief.expected_impact.secondary_effects.join(", ")}
          </div>
        ) : null}
      </div>

      <div style={{ ...softCardStyle, gap: 10, padding: 12 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {decisionExecutionTitle}
        </div>
        {props.decisionStatus === "loading" || props.decisionLoading ? (
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>Running decision analysis...</div>
        ) : props.decisionStatus === "error" && !result ? (
          <div style={{ color: nx.risk, fontSize: 12, lineHeight: 1.45 }}>
            {props.decisionError ?? "Decision execution is not available yet."}
          </div>
        ) : props.decisionStatus === "ready" && result ? (
          <>
            {props.decisionError ? (
              <div style={{ color: nx.warning, fontSize: 11, lineHeight: 1.4 }}>{props.decisionError}</div>
            ) : null}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              <MetricTile label="Impact Score" value={formatScore(result.simulation_result.impact_score)} />
              <MetricTile label="Risk Change" value={formatSignedPercent(result.simulation_result.risk_change)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>KPI Effects</div>
              {result.simulation_result.kpi_effects.map((item) => (
                <div key={item.kpi} style={{ display: "flex", justifyContent: "space-between", gap: 12, color: nx.muted, fontSize: 12 }}>
                  <span style={{ color: nx.text }}>{item.kpi}</span>
                  <span>{formatSignedValue(item.change)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>Comparison</div>
              {result.comparison.map((item) => (
                <div key={item.option} style={{ display: "grid", gridTemplateColumns: "84px minmax(0, 1fr) 44px", gap: 8, alignItems: "center" }}>
                  <div style={{ color: nx.muted, fontSize: 11, fontWeight: 700 }}>{item.option}</div>
                  <div style={{ height: 8, borderRadius: 999, background: "rgba(15,23,42,0.92)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.max(0, Math.min(100, item.score * 100))}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, rgba(96,165,250,0.85), rgba(59,130,246,0.45))",
                      }}
                    />
                  </div>
                  <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, textAlign: "right" }}>
                    {formatScore(item.score)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            No decision run yet.
          </div>
        )}
      </div>

      <div style={{ ...softCardStyle, gap: 6, padding: 12 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Business Value
        </div>
        {brief.value_framing.risk_reduction ? <div style={{ color: nx.text, fontSize: 12 }}>{brief.value_framing.risk_reduction}</div> : null}
        {brief.value_framing.efficiency_gain ? <div style={{ color: nx.text, fontSize: 12 }}>{brief.value_framing.efficiency_gain}</div> : null}
        {brief.value_framing.cost_avoidance ? <div style={{ color: nx.text, fontSize: 12 }}>{brief.value_framing.cost_avoidance}</div> : null}
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{brief.value_framing.qualitative_roi}</div>
      </div>

      {brief.council_recommendation ? (
        <div style={{ ...softCardStyle, gap: 5, padding: 12 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Council Recommendation
          </div>
          <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{brief.council_recommendation}</div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          paddingTop: 2,
          borderTop: `1px solid ${nx.border}`,
        }}
      >
        {props.onPrimaryAction ? (
          <button type="button" onClick={props.onPrimaryAction} style={primaryButtonStyle}>
            {props.primaryActionLabel ?? (brief.stable_system ? "Continue Monitoring" : "Simulate This Decision")}
          </button>
        ) : null}
        {props.onSecondaryAction ? (
          <button type="button" onClick={props.onSecondaryAction} style={secondaryButtonStyle}>
            {props.secondaryActionLabel ?? "Compare Options"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MetricTile(props: { label: string; value: string }) {
  return (
    <div style={{ ...softCardStyle, gap: 4, padding: 10, minHeight: 0, border: "1px solid rgba(148,163,184,0.16)" }}>
      <div style={{ color: nx.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800 }}>{props.value}</div>
    </div>
  );
}

function formatScore(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function formatSignedPercent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  const scaled = Math.round(value * 100);
  return `${scaled > 0 ? "+" : ""}${scaled}%`;
}

function formatSignedValue(value: number) {
  if (!Number.isFinite(value)) return "0";
  return `${value > 0 ? "+" : ""}${value}`;
}
