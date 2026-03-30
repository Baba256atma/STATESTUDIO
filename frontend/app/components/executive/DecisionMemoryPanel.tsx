"use client";

import React from "react";

import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { DecisionTrustTimeline } from "./DecisionTrustTimeline";
import { nx, panelSurfaceStyle, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionMemoryPanelProps = {
  entries: DecisionMemoryEntry[];
  memoryInsights?: any | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenCompare?: (() => void) | null;
  onOpenWarRoom?: (() => void) | null;
  onOpenObject?: ((id?: string | null) => void) | null;
};

function formatRelativeTime(timestamp: number) {
  const deltaMs = Date.now() - timestamp;
  const deltaMinutes = Math.max(1, Math.round(deltaMs / 60000));
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d ago`;
}

export function DecisionMemoryPanel(props: DecisionMemoryPanelProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(props.entries[0]?.id ?? null);

  React.useEffect(() => {
    setSelectedId((current) => current ?? props.entries[0]?.id ?? null);
  }, [props.entries]);

  const selectedEntry =
    props.entries.find((entry) => entry.id === selectedId) ??
    props.entries[0] ??
    null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Memory</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Review recent recommendations, simulations, and outcomes.
        </div>
      </div>

      {props.entries.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Recent Decisions
            </div>
            {props.entries.slice(0, 8).map((entry) => {
              const active = entry.id === selectedEntry?.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  style={{
                    ...softCardStyle,
                    padding: 12,
                    textAlign: "left",
                    gap: 8,
                    border: active ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
                    background: active ? "rgba(59,130,246,0.12)" : softCardStyle.background,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{entry.title}</div>
                    <div style={{ color: nx.lowMuted, fontSize: 11 }}>{formatRelativeTime(entry.created_at)}</div>
                  </div>
                  {entry.situation_summary ? (
                    <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{entry.situation_summary}</div>
                  ) : null}
                  {entry.recommendation_action ? (
                    <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                      Recommended move: {entry.recommendation_action}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Replay Preview
                  </div>
                  <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
                    {selectedEntry?.title ?? "Decision snapshot"}
                  </div>
                </div>
                {selectedEntry?.recommendation_confidence?.level ? (
                  <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                    Confidence {selectedEntry.recommendation_confidence.level}
                  </div>
                ) : null}
              </div>

              {selectedEntry?.situation_summary ? (
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{selectedEntry.situation_summary}</div>
              ) : null}
              {selectedEntry?.recommendation_summary ? (
                <MemoryFact label="Recommended Move" value={selectedEntry.recommendation_summary} />
              ) : null}
              {selectedEntry?.impact_summary ? (
                <MemoryFact label="Expected Impact" value={selectedEntry.impact_summary} />
              ) : null}
              {selectedEntry?.compare_summary ? (
                <MemoryFact label="Compare Context" value={selectedEntry.compare_summary} />
              ) : null}
              {selectedEntry?.alternative_actions?.length ? (
                <MemoryFact label="Alternatives" value={selectedEntry.alternative_actions.join(", ")} />
              ) : null}
              {selectedEntry?.target_ids?.length ? (
                <MemoryFact
                  label="Targets"
                  value={selectedEntry.target_ids.map((id) => props.resolveObjectLabel?.(id) ?? id).join(", ")}
                />
              ) : null}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                <button type="button" onClick={props.onOpenWarRoom ?? (() => {})} style={primaryButtonStyle}>
                  Open In War Room
                </button>
                <button type="button" onClick={props.onOpenTimeline ?? (() => {})} style={secondaryButtonStyle}>
                  Open Timeline
                </button>
                <button type="button" onClick={props.onOpenCompare ?? (() => {})} style={secondaryButtonStyle}>
                  Compare Again
                </button>
                {selectedEntry?.target_ids?.[0] && props.onOpenObject ? (
                  <button
                    type="button"
                    onClick={() => props.onOpenObject?.(selectedEntry.target_ids?.[0] ?? null)}
                    style={secondaryButtonStyle}
                  >
                    Inspect Target
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...softCardStyle, padding: 14, gap: 6 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Recent Decisions
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            No decision history yet. Run an analysis, comparison, or simulation to start building decision memory.
          </div>
        </div>
      )}

      <DecisionTrustTimeline
        responseData={props.responseData ?? null}
        canonicalRecommendation={props.canonicalRecommendation ?? null}
        decisionResult={props.decisionResult ?? null}
        memoryEntry={selectedEntry}
      />

      {props.memoryInsights?.memory_reasoning ? (
        <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Pattern Context
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            {String(props.memoryInsights.memory_reasoning)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MemoryFact(props: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{props.value}</div>
    </div>
  );
}
