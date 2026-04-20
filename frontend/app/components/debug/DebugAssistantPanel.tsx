"use client";

import React, { useMemo, useState } from "react";
import type { DebugEvent } from "../../lib/debug/debugEventTypes";
import type { SelfDebugDiagnosis } from "../../lib/debug/debugDiagnosis";
import type { StrategicDebugSummary } from "../../lib/debug/debugSummary";
import type { FixSuggestion } from "../../lib/debug/debugFixSuggestions";
import {
  runDevAssistant,
  type DevAssistantContext,
  type DevAssistantIntent,
} from "../../lib/debug/debugAssistant";
import { DEV_ASSISTANT_INTENT_LABELS } from "../../lib/debug/debugAssistantPrompts";

const PRESET_INTENTS: DevAssistantIntent[] = [
  "current_issue",
  "root_cause_plain",
  "next_checks",
  "supporting_chain",
  "failure_layer",
  "guard_alerts",
  "investigation_plan",
];

export type DebugAssistantPanelProps = {
  events: DebugEvent[];
  diagnoses: SelfDebugDiagnosis[];
  strategicSummary: StrategicDebugSummary;
  fixSuggestions: FixSuggestion[];
  guardAlerts: DebugEvent[];
};

export function DebugAssistantPanel({
  events,
  diagnoses,
  strategicSummary,
  fixSuggestions,
  guardAlerts,
}: DebugAssistantPanelProps): React.ReactElement {
  const [intent, setIntent] = useState<DevAssistantIntent>("current_issue");

  const ctx = useMemo(
    (): DevAssistantContext => ({
      events,
      diagnoses,
      strategicSummary,
      fixSuggestions,
      guardAlertEvents: guardAlerts,
    }),
    [events, diagnoses, strategicSummary, fixSuggestions, guardAlerts]
  );

  const response = useMemo(() => runDevAssistant(intent, ctx), [intent, ctx]);

  return (
    <div style={{ fontSize: 10, lineHeight: 1.45 }}>
      <div style={{ opacity: 0.82, marginBottom: 8 }}>
        Internal dev assistant — preset intents only. No auto-fix, no external AI, dev builds only.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {PRESET_INTENTS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setIntent(key)}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: `1px solid ${key === intent ? "rgba(167,139,250,0.55)" : "rgba(148,163,184,0.35)"}`,
              background: key === intent ? "rgba(76,29,149,0.35)" : "rgba(30,41,59,0.75)",
              color: "#e2e8f0",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {DEV_ASSISTANT_INTENT_LABELS[key]}
          </button>
        ))}
      </div>
      <div
        style={{
          borderRadius: 8,
          padding: 10,
          background: "rgba(15,23,42,0.55)",
          border: "1px solid rgba(129,140,248,0.2)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: "#ddd6fe", marginBottom: 6 }}>{response.headline}</div>
        <div style={{ opacity: 0.88, marginBottom: 8 }}>{response.answer}</div>
        <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 8 }}>
          <span style={{ fontWeight: 700 }}>Mode</span> {response.mode} ·{" "}
          <span style={{ fontWeight: 700 }}>Confidence</span> {response.confidence} ·{" "}
          <span style={{ fontWeight: 700 }}>Layer</span> {response.layer}
        </div>
        {response.supporting_events.length > 0 ? (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>Supporting events</div>
            <ul style={{ margin: 0, paddingLeft: 14 }}>
              {response.supporting_events.map((se, i) => (
                <li key={se.id ?? `${se.type}-${i}`} style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{se.type}</span> ({se.layer}) — {se.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {response.recommended_checks.length > 0 ? (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>Recommended checks</div>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {response.recommended_checks.map((c, i) => (
                <li key={i} style={{ marginBottom: 3 }}>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {response.guard_alerts.length > 0 ? (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: "#fcd34d", marginBottom: 4 }}>Guard signals (summary)</div>
            <ul style={{ margin: 0, paddingLeft: 14 }}>
              {response.guard_alerts.slice(0, 5).map((g, i) => (
                <li key={`${g.guardType}-${i}`} style={{ marginBottom: 3 }}>
                  <span style={{ fontWeight: 700 }}>{g.guardType}</span> ({g.severity}) — {g.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div style={{ fontSize: 9, opacity: 0.75, fontStyle: "italic" }}>{response.notes}</div>
      </div>
    </div>
  );
}
