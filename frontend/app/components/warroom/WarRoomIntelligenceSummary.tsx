"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import type { SystemIntelligenceResult } from "../../lib/intelligence/systemIntelligenceTypes";

type WarRoomIntelligenceSummaryProps = {
  result: SystemIntelligenceResult | null;
  loading: boolean;
  error: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function WarRoomIntelligenceSummary(props: WarRoomIntelligenceSummaryProps) {
  if (props.loading) {
    return <LoadingStateCard text="Interpreting system signals…" />;
  }

  if (props.error) {
    return <ErrorStateCard text={props.error} />;
  }

  if (!props.result?.active) {
    return <EmptyStateCard text="War Room intelligence appears after a scenario, pressure path, or decision signal becomes active." />;
  }

  const topObject = props.result.object_insights[0] ?? null;
  const topPath = props.result.path_insights[0] ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>War Room Intelligence</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>{props.result.summary.headline}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.result.summary.summary}</div>
        {props.result.summary.key_signal ? (
          <div style={{ color: "#cbd5e1", fontSize: 12 }}>{props.result.summary.key_signal}</div>
        ) : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Focus Target</div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
            {props.result.summary.suggested_focus_object_id
              ? props.resolveObjectLabel?.(props.result.summary.suggested_focus_object_id) ?? "Target is outside the current scene."
              : "No dominant focus yet"}
          </div>
        </div>
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Suggested Mode</div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
            {(props.result.summary.suggested_mode ?? "analysis").toUpperCase()}
          </div>
        </div>
      </div>

      {topObject ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Top Pressure Object</div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
            {props.resolveObjectLabel?.(topObject.object_id) ?? "Target is outside the current scene."} · {topObject.role.toUpperCase()}
          </div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{topObject.rationale}</div>
        </div>
      ) : null}

      {topPath ? (
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Key Path</div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
            {props.resolveObjectLabel?.(topPath.source_object_id) ?? "Outside current scene"} → {props.resolveObjectLabel?.(topPath.target_object_id) ?? "Outside current scene"}
          </div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{topPath.rationale}</div>
        </div>
      ) : null}

      {props.result.advice.slice(0, 3).length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={sectionTitleStyle}>Recommended Next Moves</div>
          {props.result.advice.slice(0, 3).map((item) => (
            <div key={item.advice_id} style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: nx.muted, fontSize: 12 }}>{item.body}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
