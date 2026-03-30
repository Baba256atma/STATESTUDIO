"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, LoadingStateCard } from "../ui/panelStates";
import type { EvolutionState } from "../../lib/evolution/evolutionTypes";

type WarRoomLearningSummaryProps = {
  evolutionState: EvolutionState | null;
  loading: boolean;
  onRefresh: () => void;
  onRunLearning: () => void;
};

export function WarRoomLearningSummary(props: WarRoomLearningSummaryProps) {
  if (props.loading) {
    return <LoadingStateCard text="Refreshing decision memory and learning signals…" />;
  }

  if (!props.evolutionState) {
    return <EmptyStateCard text="Evolution signals will appear after Nexora has enough stored decision history." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Learning Summary</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>{props.evolutionState.summary.headline}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.evolutionState.summary.explanation}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Signals</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{props.evolutionState.learning_signals.length}</div>
          </div>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Adjustments</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{props.evolutionState.policy_adjustments.length}</div>
          </div>
        </div>
        {props.evolutionState.learning_signals.slice(0, 2).map((signal) => (
          <div key={signal.signal_id} style={{ color: nx.muted, fontSize: 12 }}>
            {signal.rationale}
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button type="button" onClick={props.onRefresh} style={{ borderRadius: 10, border: `1px solid ${nx.border}`, background: "rgba(2,6,23,0.42)", color: nx.text, fontSize: 12, fontWeight: 700, padding: "10px 8px", cursor: "pointer" }}>
            Refresh Memory
          </button>
          <button type="button" onClick={props.onRunLearning} style={{ borderRadius: 10, border: `1px solid ${nx.borderStrong}`, background: "rgba(59,130,246,0.16)", color: "#dbeafe", fontSize: 12, fontWeight: 700, padding: "10px 8px", cursor: "pointer" }}>
            Run Learning
          </button>
        </div>
      </div>
    </div>
  );
}
