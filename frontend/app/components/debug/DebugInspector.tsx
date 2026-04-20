"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clearDebugEvents, getRecentDebugEvents } from "../../lib/debug/debugEventStore";
import { subscribeDebugEvents } from "../../lib/debug/debugEventBus";
import { isChatFlowDebugEvent, runSelfDebugDiagnosis } from "../../lib/debug/debugDiagnosis";
import { shouldEmitSelfDebug } from "../../lib/debug/debugEmit";
import { buildStrategicDebugSummary } from "../../lib/debug/debugSummary";
import { buildFixSuggestions } from "../../lib/debug/debugFixSuggestions";
import { DebugAssistantPanel } from "./DebugAssistantPanel";
import type { DebugEvent } from "../../lib/debug/debugEventTypes";

function isChatChainEvent(e: DebugEvent): boolean {
  return isChatFlowDebugEvent(e) || typeof e.metadata?.chatCorrelationId === "string";
}

/** Cheap snapshot for “did the visible event list change?” (length + last id). */
function visibleDebugEventsSnapshot(list: DebugEvent[]): string {
  if (list.length === 0) return "0";
  const last = list[list.length - 1];
  return `${list.length}:${last.id}`;
}

export function DebugInspector(): null | React.ReactElement {
  const [open, setOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [fixPathsOpen, setFixPathsOpen] = useState(true);
  const [guardsOpen, setGuardsOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [events, setEvents] = useState<DebugEvent[]>(() =>
    getRecentDebugEvents().filter((e) => e.origin !== "debug_inspector")
  );
  const lastVisibleSnapshotRef = useRef<string>(visibleDebugEventsSnapshot(events));
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldEmitSelfDebug()) return;

    const DEBOUNCE_MS = 100;

    const flush = () => {
      debounceTimerRef.current = null;
      const next = getRecentDebugEvents().filter((e) => e.origin !== "debug_inspector");
      const snap = visibleDebugEventsSnapshot(next);
      if (snap === lastVisibleSnapshotRef.current) {
        return;
      }
      lastVisibleSnapshotRef.current = snap;
      setEvents(next);
    };

    const scheduleFlush = () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(flush, DEBOUNCE_MS);
    };

    const unsub = subscribeDebugEvents(scheduleFlush);
    return () => {
      unsub();
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  const diagnoses = useMemo(() => runSelfDebugDiagnosis(events), [events]);
  const strategicSummary = useMemo(() => buildStrategicDebugSummary(events, diagnoses), [events, diagnoses]);
  const fixSuggestions = useMemo(
    () => buildFixSuggestions(strategicSummary, diagnoses[0] ?? null, events),
    [strategicSummary, diagnoses, events],
  );
  const lastChatCorrelation = useMemo(() => {
    const sub = [...events].reverse().find((e) => e.type === "chat_submitted");
    const id = sub?.correlationId ?? sub?.metadata?.chatCorrelationId;
    return typeof id === "string" ? id : null;
  }, [events]);

  const guardAlerts = useMemo(() => {
    return [...events]
      .reverse()
      .filter((e) => e.type === "guard_warning" || e.type === "guard_critical")
      .slice(0, 10);
  }, [events]);

  const handleClear = useCallback(() => {
    clearDebugEvents();
    lastVisibleSnapshotRef.current = "0";
    setEvents([]);
  }, []);

  if (!shouldEmitSelfDebug()) {
    return null;
  }

  const latest = diagnoses[0] ?? null;
  const moreDiagnoses = diagnoses.length > 1 ? diagnoses.slice(1) : [];
  const preview = events.slice(-12);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Nexora dev self-debug"
        style={{
          position: "fixed",
          right: 12,
          bottom: 12,
          zIndex: 99990,
          height: 32,
          padding: "0 12px",
          borderRadius: 8,
          border: "1px solid rgba(96,165,250,0.35)",
          background: "rgba(15,23,42,0.92)",
          color: "#e2e8f0",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Self-Debug {open ? "Hide" : "Show"}
      </button>
      {open ? (
        <div
          style={{
            position: "fixed",
            right: 12,
            bottom: 52,
            zIndex: 99990,
            width: 420,
            maxHeight: "46vh",
            overflow: "auto",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(15,23,42,0.96)",
            color: "#e2e8f0",
            fontSize: 11,
            padding: 12,
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 800 }}>Nexora self-debug (dev)</span>
            <button
              type="button"
              onClick={handleClear}
              style={{
                height: 26,
                padding: "0 10px",
                borderRadius: 6,
                border: "1px solid rgba(148,163,184,0.3)",
                background: "rgba(30,41,59,0.9)",
                color: "#cbd5e1",
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              Clear
            </button>
          </div>

          <div
            style={{
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid rgba(129,140,248,0.25)",
              background: "rgba(49,46,129,0.2)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                border: "none",
                background: "rgba(30,27,75,0.35)",
                color: "#e0e7ff",
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>Strategic Summary</span>
              <span style={{ opacity: 0.8 }}>{summaryOpen ? "▼" : "▶"}</span>
            </button>
            {summaryOpen ? (
              <div style={{ padding: "10px 10px 12px", lineHeight: 1.45 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#c7d2fe", marginBottom: 6 }}>
                  {strategicSummary.headline}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#a5b4fc" }}>What happened</span>
                  <div style={{ marginTop: 2, opacity: 0.92 }}>{strategicSummary.what_happened}</div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#a5b4fc" }}>Why</span>
                  <div style={{ marginTop: 2, opacity: 0.92 }}>{strategicSummary.why_it_happened}</div>
                </div>
                <div style={{ marginBottom: 8, fontSize: 10, opacity: 0.85 }}>
                  <span style={{ opacity: 0.75 }}>Where</span> {strategicSummary.where_it_failed} ·{" "}
                  <span style={{ opacity: 0.75 }}>Confidence</span> {strategicSummary.confidence}
                </div>
                <div style={{ fontSize: 10, opacity: 0.88, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#a5b4fc" }}>Next check</span>{" "}
                  {strategicSummary.recommended_next_check}
                </div>
                {strategicSummary.key_events.length > 0 ? (
                  <div style={{ fontSize: 10, opacity: 0.8 }}>
                    <div style={{ fontWeight: 700, color: "#a5b4fc", marginBottom: 4 }}>Key events</div>
                    <ul style={{ margin: 0, paddingLeft: 14 }}>
                      {strategicSummary.key_events.map((ke, idx) => (
                        <li key={`${ke.type}-${idx}`}>
                          <span style={{ fontWeight: 700 }}>{ke.type}</span> ({ke.layer}) — {ke.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid rgba(45,212,191,0.22)",
              background: "rgba(6,78,59,0.18)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setFixPathsOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                border: "none",
                background: "rgba(6,95,70,0.28)",
                color: "#ccfbf1",
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>Suggested Fix Paths</span>
              <span style={{ opacity: 0.8 }}>{fixPathsOpen ? "\u25bc" : "\u25b6"}</span>
            </button>
            {fixPathsOpen ? (
              <div style={{ padding: "10px 10px 12px", lineHeight: 1.4, fontSize: 10 }}>
                <div style={{ opacity: 0.82, marginBottom: 8 }}>
                  Inspection-only hints from <span style={{ fontWeight: 700 }}>{strategicSummary.template_key}</span> — not
                  auto-fixes.
                </div>
                <ul style={{ margin: 0, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {fixSuggestions.map((s, idx) => (
                    <li key={`${s.title}-${idx}`} style={{ listStyleType: "disc" }}>
                      <div style={{ fontWeight: 800, color: "#99f6e4", marginBottom: 4 }}>{s.title}</div>
                      <ul style={{ margin: 0, paddingLeft: 12, opacity: 0.9 }}>
                        <li style={{ marginBottom: 2 }}>
                          <span style={{ opacity: 0.75 }}>Why</span> {s.why_this_matters}
                        </li>
                        <li style={{ marginBottom: 2 }}>
                          <span style={{ opacity: 0.75 }}>Check</span> {s.what_to_check}
                        </li>
                        <li style={{ marginBottom: 2 }}>
                          <span style={{ opacity: 0.75 }}>Where</span> {s.where_to_check}
                        </li>
                        <li>
                          <span style={{ opacity: 0.75 }}>Confidence</span> {s.confidence}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid rgba(251,191,36,0.28)",
              background: "rgba(120,53,15,0.2)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setGuardsOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                border: "none",
                background: "rgba(146,64,14,0.28)",
                color: "#ffedd5",
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>Guard Alerts</span>
              <span style={{ opacity: 0.85 }}>{guardsOpen ? "\u25bc" : "\u25b6"}</span>
            </button>
            {guardsOpen ? (
              <div style={{ padding: "10px 10px 12px", lineHeight: 1.4, fontSize: 10 }}>
                {guardAlerts.length === 0 ? (
                  <div style={{ opacity: 0.78 }}>No guard rail warnings in the recent buffer.</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {guardAlerts.map((g) => {
                      const sev =
                        typeof g.metadata?.severity === "string" ? g.metadata.severity : g.type === "guard_critical" ? "critical" : "warning";
                      const guardType = typeof g.metadata?.guardType === "string" ? g.metadata.guardType : g.type;
                      const suggestion =
                        typeof g.metadata?.suggestion === "string" ? g.metadata.suggestion : "";
                      return (
                        <li key={g.id} style={{ listStyleType: "disc" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                            <span style={{ fontWeight: 800, color: "#fde68a" }}>{guardType}</span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 800,
                                padding: "1px 5px",
                                borderRadius: 4,
                                background:
                                  sev === "critical" ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.2)",
                                color: sev === "critical" ? "#fecaca" : "#fef3c7",
                              }}
                            >
                              {sev}
                            </span>
                            <span style={{ opacity: 0.75 }}>({g.layer})</span>
                          </div>
                          <div style={{ opacity: 0.92, marginBottom: suggestion ? 4 : 0 }}>{g.message}</div>
                          {suggestion ? (
                            <div style={{ opacity: 0.82, fontSize: 9 }}>
                              <span style={{ fontWeight: 700, color: "#fcd34d" }}>Hint</span> {suggestion}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid rgba(167,139,250,0.28)",
              background: "rgba(49,46,129,0.22)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setAssistantOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                border: "none",
                background: "rgba(67,56,202,0.28)",
                color: "#ede9fe",
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>Dev Assistant</span>
              <span style={{ opacity: 0.85 }}>{assistantOpen ? "\u25bc" : "\u25b6"}</span>
            </button>
            {assistantOpen ? (
              <div style={{ padding: "10px 10px 12px" }}>
                <DebugAssistantPanel
                  events={events}
                  diagnoses={diagnoses}
                  strategicSummary={strategicSummary}
                  fixSuggestions={fixSuggestions}
                  guardAlerts={guardAlerts}
                />
              </div>
            ) : null}
          </div>

          <div style={{ marginBottom: 10, padding: 8, borderRadius: 8, background: "rgba(30,41,59,0.65)" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Latest diagnosis</div>
            {latest ? (
              <>
                <div style={{ color: "#93c5fd" }}>{latest.title}</div>
                {latest.tags?.includes("chat") ? (
                  <div style={{ marginTop: 4 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: "rgba(167,139,250,0.2)",
                        color: "#ddd6fe",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      chat
                    </span>
                  </div>
                ) : null}
                <div style={{ marginTop: 4, opacity: 0.9 }}>
                  <span style={{ opacity: 0.7 }}>Layer:</span> {latest.layer} ·{" "}
                  <span style={{ opacity: 0.7 }}>Confidence:</span> {latest.confidence}
                </div>
                <div style={{ marginTop: 6, lineHeight: 1.4 }}>{latest.explanation}</div>
              </>
            ) : (
              <div style={{ opacity: 0.75 }}>No rule matched recent events.</div>
            )}
            {moreDiagnoses.length > 0 ? (
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Other matches</div>
                <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.35 }}>
                  {moreDiagnoses.map((d) => (
                    <li key={d.id}>
                      <span style={{ color: "#93c5fd" }}>{d.title}</span> ({d.confidence})
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div style={{ fontWeight: 700, marginBottom: 4 }}>Event chain (recent)</div>
          {lastChatCorrelation ? (
            <div style={{ marginBottom: 8, fontSize: 10, opacity: 0.75, wordBreak: "break-all" }}>
              Last chat correlation: <span style={{ color: "#c4b5fd" }}>{lastChatCorrelation}</span>
            </div>
          ) : null}
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {preview.length === 0 ? (
              <li style={{ opacity: 0.7 }}>No events yet. Use the app in dev to populate.</li>
            ) : (
              preview.map((e) => {
                const inActiveChatChain =
                  Boolean(lastChatCorrelation) &&
                  (e.metadata?.chatCorrelationId === lastChatCorrelation ||
                    (isChatFlowDebugEvent(e) && e.correlationId === lastChatCorrelation));
                return (
                <li
                  key={e.id}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: inActiveChatChain
                      ? "rgba(76,29,149,0.22)"
                      : "rgba(30,41,59,0.55)",
                    borderLeft: `3px solid ${
                      e.status === "blocked" || e.status === "error"
                        ? "rgba(248,113,113,0.85)"
                        : e.status === "warn"
                          ? "rgba(251,191,36,0.85)"
                          : "rgba(56,189,248,0.75)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>{e.type}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isChatChainEvent(e) ? (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#ddd6fe",
                            border: "1px solid rgba(167,139,250,0.35)",
                            borderRadius: 4,
                            padding: "0 5px",
                          }}
                        >
                          CHAT
                        </span>
                      ) : null}
                      <span style={{ opacity: 0.65, whiteSpace: "nowrap" }}>{e.layer}</span>
                    </span>
                  </div>
                  <div style={{ opacity: 0.85, marginTop: 2 }}>{e.message}</div>
                  {inActiveChatChain && e.metadata?.panelCorrelationId ? (
                    <div
                      style={{ fontSize: 9, opacity: 0.65, marginTop: 4 }}
                      title={String(e.metadata.panelCorrelationId)}
                    >
                      panel: {String(e.metadata.panelCorrelationId).slice(0, 28)}
                      {String(e.metadata.panelCorrelationId).length > 28 ? "…" : ""}
                    </div>
                  ) : null}
                </li>
              );
              })
            )}
          </ul>
        </div>
      ) : null}
    </>
  );
}
