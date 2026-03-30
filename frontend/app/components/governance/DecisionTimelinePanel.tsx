"use client";

import React from "react";

import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { buildDecisionTimeline } from "../../lib/governance/buildDecisionTimeline";
import { buildDecisionTimelineView } from "../../lib/governance/buildDecisionTimelineView";
import { nx, panelSurfaceStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionTimelinePanelProps = {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function formatRelativeTime(timestamp: number) {
  const deltaMs = Date.now() - timestamp;
  const deltaMinutes = Math.max(1, Math.round(deltaMs / 60000));
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d ago`;
}

function sourceTone(source: string) {
  if (source === "User") return "#cbd5e1";
  if (source === "Simulation") return "#bfdbfe";
  if (source === "Multi-agent") return "#ddd6fe";
  return "#93c5fd";
}

export function DecisionTimelinePanel(props: DecisionTimelinePanelProps) {
  const latestMemory = props.memoryEntries?.[0] ?? null;
  const latestUserMessage = [
    ...(Array.isArray(props.responseData?.messages) ? props.responseData.messages : []),
  ]
    .reverse()
    .map((message) => asRecord(message))
    .find((message) => message?.role === "user" && String(message?.text ?? "").trim()) ?? null;
  const prompt =
    latestMemory?.prompt ??
    (typeof latestUserMessage?.text === "string" ? latestUserMessage.text : null) ??
    null;

  const events = React.useMemo(
    () =>
      buildDecisionTimeline({
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        memoryEntries: props.memoryEntries ?? [],
        prompt,
      }),
    [props.responseData, props.canonicalRecommendation, props.memoryEntries, prompt]
  );
  const viewEvents = React.useMemo(() => buildDecisionTimelineView(events), [events]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>What Happens Next</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Follow the cause-and-effect path from current pressure to the next likely business outcome.
        </div>
      </div>

      {!viewEvents.length ? (
        <div style={{ ...softCardStyle, padding: 14, gap: 6 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Timeline
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            No risk progression timeline available yet.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {viewEvents.map((event, index) => (
            <div
              key={event.id}
              style={{ display: "grid", gridTemplateColumns: "20px minmax(0, 1fr)", columnGap: 10 }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    marginTop: 5,
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, rgba(96,165,250,0.92), rgba(59,130,246,0.48))",
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
                  }}
                />
                {index < viewEvents.length - 1 ? (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 34,
                      marginTop: 6,
                      background: "linear-gradient(180deg, rgba(96,165,250,0.28), rgba(148,163,184,0.12))",
                    }}
                  />
                ) : null}
              </div>

              <div style={{ paddingBottom: index < viewEvents.length - 1 ? 14 : 0 }}>
                <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{event.title}</div>
                      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{event.summary}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div style={{ color: nx.lowMuted, fontSize: 11 }}>{formatRelativeTime(event.timestamp)}</div>
                      <div
                        style={{
                          borderRadius: 999,
                          padding: "4px 8px",
                          border: `1px solid ${sourceTone(event.sourceLabel)}`,
                          background: "rgba(2,6,23,0.46)",
                          color: sourceTone(event.sourceLabel),
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {event.sourceLabel}
                      </div>
                    </div>
                  </div>

                  {event.confidenceLabel ? (
                    <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                      Confidence: {event.confidenceLabel}
                    </div>
                  ) : null}

                  {event.why?.length || event.signals?.length || event.uncertainty?.length ? (
                    <details style={{ color: nx.text }}>
                      <summary style={{ cursor: "pointer", color: "#cbd5f5", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        Why this?
                      </summary>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                        {event.why?.length ? (
                          <TimelineList title="Why" items={event.why} />
                        ) : null}
                        {event.signals?.length ? (
                          <TimelineList title="Signals Used" items={event.signals} />
                        ) : null}
                        {event.uncertainty?.length ? (
                          <TimelineList title="Uncertainty" items={event.uncertainty} />
                        ) : null}
                      </div>
                    </details>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineList(props: { title: string; items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.title}
      </div>
      {props.items.slice(0, 4).map((item) => (
        <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
          <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}
