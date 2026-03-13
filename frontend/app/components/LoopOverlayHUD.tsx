"use client";

import React, { useMemo, useState } from "react";
import type { SceneLoop } from "../lib/sceneTypes";

function strengthOf(loop: SceneLoop | undefined): number {
  if (!loop) return 0;
  return Number((loop as any)?.strength ?? (loop as any)?.weight ?? 0);
}

export function LoopOverlayHUD({
  loops,
  activeLoopId,
  onSelectLoop,
  showLoopLabels,
  onToggleLoopLabels,
  loopSuggestions,
  onFocusObject,
  embedded,
}: {
  loops?: SceneLoop[] | null;
  activeLoopId?: string | null;
  onSelectLoop?: (loopId: string) => void;
  showLoopLabels?: boolean;
  onToggleLoopLabels?: () => void;
  loopSuggestions?: string[];
  onFocusObject?: (id: string) => void;
  embedded?: boolean;
}) {
  const list = useMemo(() => (Array.isArray(loops) ? loops : []), [loops]);
  const count = list.length;
  const [onlyActive, setOnlyActive] = useState(false);
  const activeLoop = list.find((l) => l?.id && l.id === activeLoopId) ?? null;

  const edgePairs = (loop: SceneLoop | null) => {
    if (!loop || !Array.isArray(loop.edges)) return [];
    return loop.edges
      .map((e) => ({
        from: String((e as any)?.from ?? ""),
        to: String((e as any)?.to ?? ""),
        label: (e as any)?.label as string | undefined,
      }))
      .filter((p) => p.from && p.to);
  };

  const suggestionsSafe = Array.isArray(loopSuggestions) ? loopSuggestions.slice(0, 5) : [];
  const displayLoops = useMemo(() => {
    if (!onlyActive) return list;
    return activeLoop ? [activeLoop] : [];
  }, [onlyActive, list, activeLoop]);

  return (
    <div
      style={{
        position: embedded ? "relative" : "fixed",
        bottom: embedded ? undefined : 12,
        left: embedded ? undefined : 12,
        zIndex: embedded ? 0 : 850,
        maxWidth: embedded ? "100%" : 320,
        width: embedded ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 14,
            backdropFilter: "blur(10px)",
            background: "rgba(10,12,18,0.75)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.92)",
            boxShadow: embedded ? "none" : "0 12px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontWeight: 700, letterSpacing: 0.2, whiteSpace: "nowrap" }}>Loops</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {count}
              </span>
              <button
                type="button"
                onClick={() => onToggleLoopLabels?.()}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: showLoopLabels ? "rgba(34, 211, 238, 0.18)" : "rgba(255,255,255,0.08)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Labels {showLoopLabels ? "On" : "Off"}
              </button>
              <button
                type="button"
                onClick={() => setOnlyActive((v) => !v)}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: onlyActive ? "rgba(34, 211, 238, 0.18)" : "rgba(255,255,255,0.08)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {onlyActive ? "Show all" : "Only active"}
              </button>
            </div>
          </div>

      {!displayLoops.length ? (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          {onlyActive ? "No active loop yet." : "No loops yet."}
        </div>
      ) : (
        <>
          {activeLoop && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background: "linear-gradient(145deg, rgba(34,211,238,0.14), rgba(255,255,255,0.06))",
                border: "1px solid rgba(34,211,238,0.35)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                  Active: {activeLoop.label ?? activeLoop.id}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  {(activeLoop as any).polarity ?? "neutral"}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, strengthOf(activeLoop) * 100))}%`,
                    height: "100%",
                    background: "rgba(34, 211, 238, 0.7)",
                  }}
                />
              </div>

              {edgePairs(activeLoop).length > 0 && (
                <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                  {edgePairs(activeLoop).map((p, idx) => (
                    <div key={`${p.from}-${p.to}-${idx}`} style={{ fontSize: 12, opacity: 0.85 }}>
                      <span
                        style={{ cursor: "pointer", color: "rgba(34,211,238,0.9)" }}
                        onClick={() => onFocusObject?.(p.from)}
                      >
                        {p.from}
                      </span>{" "}
                      →{" "}
                      <span
                        style={{ cursor: "pointer", color: "rgba(34,211,238,0.9)" }}
                        onClick={() => onFocusObject?.(p.to)}
                      >
                        {p.to}
                      </span>
                      {p.label ? ` • ${p.label}` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {displayLoops.map((loop) => {
              const s = strengthOf(loop);
              const isActive = activeLoopId === loop.id;
              return (
                <div
                  key={loop.id}
                  onClick={() => onSelectLoop?.(loop.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: isActive
                      ? "1px solid rgba(34, 211, 238, 0.35)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: isActive ? "rgba(34, 211, 238, 0.10)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {(loop as any).label ?? loop.id}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.75 }}>{s.toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {(loop as any).polarity ?? "neutral"}
                    </span>
                    <span style={{ fontSize: 11, opacity: 0.75 }}>
                      {Array.isArray((loop as any).edges) ? `${(loop as any).edges.length} edges` : "0 edges"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, opacity: 0.9 }}>Suggested actions</div>
            {suggestionsSafe.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>No suggestions yet.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 4 }}>
                {suggestionsSafe.map((s, i) => (
                  <li key={i} style={{ fontSize: 12, opacity: 0.85 }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, opacity: 0.9 }}>Manager view</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                onClick={() => onFocusObject?.("obj_inventory")}
                style={{
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(34, 211, 238, 0.12)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Focus Inventory
              </button>
              <button
                type="button"
                onClick={() => onFocusObject?.("obj_delivery")}
                style={{
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(231, 76, 60, 0.12)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Focus Delivery
              </button>
              <button
                type="button"
                onClick={() => onFocusObject?.("obj_risk_zone")}
                style={{
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(241, 196, 15, 0.12)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Focus Risk
              </button>
              {activeLoopId && (
                <button
                  type="button"
                  onClick={() => onSelectLoop?.(activeLoopId)}
                  style={{
                    fontSize: 11,
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Show only active loop
                </button>
              )}
            </div>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
}
