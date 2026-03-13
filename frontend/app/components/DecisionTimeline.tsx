import React from "react";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";

type Props = {
  snapshots: DecisionSnapshot[];
  activeId: string | null;
  onSelect?: (id: string) => void;
};

export function DecisionTimeline({ snapshots, activeId, onSelect }: Props) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) return null;

  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 40,
        background: "rgba(10,12,18,0.82)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "10px 12px",
        width: 260,
        backdropFilter: "blur(6px)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        <span>Decisions</span>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{sorted.length}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: 180,
          overflowY: "auto",
        }}
      >
        {sorted.map((snap) => {
          const isActive = activeId === snap.id;
          const date = new Date(snap.timestamp);
          return (
            <button
              key={snap.id}
              type="button"
              onClick={() => onSelect?.(snap.id)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: isActive ? "rgba(34,211,238,0.16)" : "rgba(255,255,255,0.04)",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
                  {snap.activeLoopId ? "Active loop" : "Snapshot"}
                </span>
                <span style={{ fontSize: 11, opacity: 0.75 }}>
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {snap.activeLoopId ? (
                <div style={{ fontSize: 12, opacity: 0.82, marginTop: 2 }}>
                  {snap.activeLoopId}
                </div>
              ) : null}
              {snap.note ? (
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{snap.note}</div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DecisionTimeline;
