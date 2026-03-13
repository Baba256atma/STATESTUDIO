

"use client";

import React from "react";

export type KpiTrend = "up" | "down" | "flat";
export type KpiDirection = "up" | "down";

export type KPIBoardItem = {
  id: string;
  label: string;
  value: number;
  target: number;
  direction: KpiDirection;
  trend?: KpiTrend;
  score: number; // 0..2
  weight?: number;
  note?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

function trendIcon(t?: KpiTrend) {
  if (t === "up") return "↑";
  if (t === "down") return "↓";
  if (t === "flat") return "→";
  return "";
}

export function KPIBoard({ kpis }: { kpis: KPIBoardItem[] }) {
  const safe = Array.isArray(kpis) ? kpis : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
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
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>KPI Board</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{safe.length} KPIs</div>
          </div>

          {safe.length === 0 ? (
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>No KPI data yet.</div>
          ) : (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {safe.map((k) => {
                const pct = clamp((k.score / 2) * 100, 0, 100);
                const good = k.direction === "up" ? k.value >= k.target : k.value <= k.target;
                const w = typeof k.weight === "number" ? k.weight : 1;
                return (
                  <div
                    key={k.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: good
                        ? w > 1
                          ? "rgba(34,211,238,0.16)"
                          : "rgba(34,211,238,0.10)"
                        : w > 1
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(255,255,255,0.04)",
                      border: good
                        ? w > 1
                          ? "1px solid rgba(34,211,238,0.38)"
                          : "1px solid rgba(34,211,238,0.28)"
                        : w > 1
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, opacity: 0.95 }}>{k.label}</div>
                        {w > 1 ? (
                          <span
                            style={{
                              marginLeft: 8,
                              padding: "2px 8px",
                              borderRadius: 999,
                              border: "1px solid rgba(255,255,255,0.14)",
                              background: "rgba(255,255,255,0.05)",
                              fontSize: 11,
                              fontWeight: 800,
                              opacity: 0.95,
                            }}
                          >
                            x{w}
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.85, minWidth: 14, textAlign: "right" }}>
                        {k.trend ? trendIcon(k.trend) : ""}
                      </div>
                    </div>

                    <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>
                        <span style={{ opacity: 0.8 }}>value</span> {fmt(k.value)}
                        <span style={{ opacity: 0.6 }}> / target {fmt(k.target)}</span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>{Math.round(pct)}%</div>
                    </div>

                    <div style={{ marginTop: 6, width: "100%", height: 6, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "rgba(34, 211, 238, 0.7)" }} />
                    </div>

                    {k.note ? (
                      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{k.note}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
