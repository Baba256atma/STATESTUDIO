"use client";

import React from "react";

import { nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import type { WarRoomOverlaySummary, WarRoomSessionState } from "../../lib/warroom/warRoomTypes";

type WarRoomSummaryProps = {
  session: WarRoomSessionState;
  summary: WarRoomOverlaySummary | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

function formatTimestamp(value: number | null | undefined): string {
  if (!value) return "Not run yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not run yet" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function WarRoomSummary({ session, summary, resolveObjectLabel }: WarRoomSummaryProps) {
  if (!session.lastActionId && !summary?.active) {
    return <EmptyStateCard text="Run a scenario to keep the current decision story, overlay state, and last operating result here." />;
  }

  if (summary?.loading) {
    return <LoadingStateCard text="War Room is requesting strategic overlays…" />;
  }

  if (summary?.error) {
    return <ErrorStateCard text={summary.error} />;
  }

  const sourceObjectId = summary?.sourceObjectId ?? session.draft.selectedObjectId ?? null;
  const sourceLabel = sourceObjectId ? resolveObjectLabel?.(sourceObjectId) ?? null : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Scenario Run</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ ...primaryMetricStyle, fontSize: 16 }}>
              {summary?.overlayMode === "mixed"
                ? "Mixed"
                : summary?.overlayMode === "decision_path"
                ? "Decision Path"
                : "Propagation"}
            </div>
            <div style={{ color: nx.muted, fontSize: 12 }}>
              Source {sourceObjectId ? sourceLabel ?? "Target is outside the current scene." : "none selected"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: summary?.resultMode === "backend" ? "#93c5fd" : nx.muted, fontSize: 12, fontWeight: 700 }}>
              {summary?.resultMode === "backend" ? "Backend" : summary?.resultMode === "preview" ? "Preview" : "Idle"}
            </div>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>{formatTimestamp(session.lastRunAt)}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Propagation</div>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
              {summary?.propagationNodeCount ?? 0} nodes · {summary?.propagationEdgeCount ?? 0} edges
            </div>
          </div>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Decision Path</div>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
              {summary?.decisionNodeCount ?? 0} nodes · {summary?.decisionEdgeCount ?? 0} edges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
