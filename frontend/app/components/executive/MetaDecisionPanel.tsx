"use client";

import React from "react";

import { buildMetaDecisionState } from "../../lib/decision/meta/buildMetaDecisionState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type MetaDecisionPanelProps = {
  responseData?: any;
  reasoning?: any | null;
  simulation?: any | null;
  comparison?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  calibration?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenMemory?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function MetaDecisionPanel(props: MetaDecisionPanelProps) {
  const state = buildMetaDecisionState({
    reasoning: props.reasoning ?? props.responseData?.ai_reasoning ?? null,
    simulation: props.simulation ?? props.responseData?.decision_simulation ?? null,
    comparison: props.comparison ?? props.responseData?.decision_comparison ?? props.responseData?.comparison ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    calibration: props.calibration ?? null,
    responseData: props.responseData ?? null,
    memoryEntries: props.memoryEntries ?? [],
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Strategy</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          See how Nexora chose the best decision approach for this situation.
        </div>
      </div>

      <Section
        label="Selected Strategy"
        title={pretty(state.selected_strategy)}
        summary={state.rationale}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Evidence" value={pretty(state.evidence_strength)} />
          <StatCard label="Uncertainty" value={pretty(state.uncertainty_level)} />
          <StatCard label="Posture" value={pretty(state.action_posture)} />
        </div>
      </Section>

      <Section
        label="Why This Strategy"
        title="How Nexora chose the current path"
        summary="The current decision process is advisory and can still be adjusted if another path looks safer."
      >
        <div style={{ ...softCardStyle, padding: 12, gap: 6, color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          {state.rationale}
        </div>
      </Section>

      <Section
        label="Strategy Alternatives"
        title="Other viable decision paths"
        summary="Top alternatives remain visible so the process does not feel hidden or locked."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {state.strategy_scores.map((score, index) => (
            <div key={score.strategy} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{pretty(score.strategy)}</div>
                <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {index === 0 ? "Best fit" : index === 1 ? "Strong alternative" : "Fallback posture"}
                </div>
              </div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                {(score.reasons[0] ?? "Alternative path remains available.")} Fit: {Math.round(score.score * 100)}%
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="Warnings And Constraints"
        title="What shaped the choice"
        summary="These signals limited how confidently Nexora could favor one decision process."
      >
        <TwoColumnList
          leftTitle="Constraints"
          leftItems={state.constraints}
          leftEmpty="No major hard constraint is visible yet."
          rightTitle="Warnings"
          rightItems={state.warnings}
          rightEmpty="No major warning is visible yet."
        />
      </Section>

      <Section
        label="Next Best Actions"
        title="What to do next"
        summary="These actions match the selected strategy without hard-locking other paths."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {state.next_best_actions.map((item) => (
            <div key={item} style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
              {item}
            </div>
          ))}
        </div>
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
          {props.onOpenMemory ? (
            <button type="button" onClick={props.onOpenMemory} style={secondaryButtonStyle}>
              Open Decision Memory
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

function TwoColumnList(props: {
  leftTitle: string;
  leftItems: string[];
  leftEmpty: string;
  rightTitle: string;
  rightItems: string[];
  rightEmpty: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {props.leftTitle}
        </div>
        {(props.leftItems.length ? props.leftItems : [props.leftEmpty]).map((item) => (
          <div key={item} style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            {item}
          </div>
        ))}
      </div>
      <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {props.rightTitle}
        </div>
        {(props.rightItems.length ? props.rightItems : [props.rightEmpty]).map((item) => (
          <div key={item} style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
