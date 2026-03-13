/** @jsxImportSource react */
"use client";

import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import React, { type JSX } from "react";

export function DecisionTimelineHUD({
  snapshots,
  activeId,
  onSelect,
  onClear,
}: {
  snapshots: DecisionSnapshot[];
  activeId?: string | null;
  onSelect: (snapshot: DecisionSnapshot) => void;
  onClear?: () => void;
}): JSX.Element | null {
  if (!Array.isArray(snapshots) || snapshots.length === 0) return null;

  const latestId = snapshots[snapshots.length - 1]?.id;

  return (
    <div
      style={{
        position: "fixed",
        right: 14,
        bottom: 14,
        zIndex: 1200,
        maxWidth: 340,
        padding: 12,
        borderRadius: 14,
        background: "rgba(10,12,18,0.78)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        color: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.2, fontSize: 13 }}>
          Timeline ({snapshots.length})
        </div>
        {onClear ? (
          <button
            type="button"
            onClick={() => onClear()}
            style={{
              fontSize: 11,
              padding: "4px 8px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.85)",
              cursor: "pointer",
            }}
            title="Clear saved snapshots"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {snapshots.map((s) => {
          const isActive = activeId ? s.id === activeId : false;
          const isLatest = s.id === latestId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              title={`Snapshot @ ${new Date(s.timestamp).toLocaleTimeString()} ${
                s.activeLoopId ? `• ${s.activeLoopId}` : ""
              }`}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.22)",
                background: isActive
                  ? "#22d3ee"
                  : isLatest
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.18)",
                cursor: "pointer",
                outline: "none",
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        {snapshots
          .slice(-3)
          .reverse()
          .map((s) => (
            <button
              key={`row-${s.id}`}
              type="button"
              onClick={() => onSelect(s)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  activeId && s.id === activeId
                    ? "rgba(34,211,238,0.18)"
                    : "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.activeLoopId ?? "No active loop"}
                </span>
                <span style={{ opacity: 0.7, fontSize: 11 }}>
                  {new Date(s.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
