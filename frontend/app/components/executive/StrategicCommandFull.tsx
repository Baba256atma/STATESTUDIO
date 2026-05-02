"use client";

import React from "react";

import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import type { StrategicCommandAlert } from "../../lib/command/strategicCommandTypes";
import { nx, softCardStyle, secondaryButtonStyle, panelSurfaceStyle, primaryButtonStyle } from "../ui/nexoraTheme";
import { useStrategicCommandPanelModel, type StrategicCommandPanelModelProps } from "./useStrategicCommandPanelModel";
import { StrategicDecisionStrip } from "./StrategicDecisionStrip";
import {
  buildStrategicDecisionStrip,
  sortAlertsBySeverity,
  type StrategicDecisionStripOverrides,
} from "./buildStrategicDecisionStrip";

export type StrategicCommandFullProps = StrategicCommandPanelModelProps & {
  onOpenView?: ((view: Exclude<RightPanelView, null>) => void) | null;
  /** Optional overrides for decision strip (merged with derived command state). */
  decisionStrip?: StrategicDecisionStripOverrides | null;
};

const ANALYSIS_TONE = /trade-?offs?\s+remain|partially\s+reconstructed|context\s+is\s+still|still\s+forming/i;

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function oneSentence(text: string, max: number) {
  const t = String(text ?? "").trim().replace(/\s+/g, " ");
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s/)[0] ?? t;
  const s = cut.length > max ? `${cut.slice(0, max - 1)}…` : cut;
  if (ANALYSIS_TONE.test(s)) {
    return "Comparison or simulation will firm up the decision.";
  }
  return s;
}

function resolvePrimaryCta(s: ReturnType<typeof useStrategicCommandPanelModel>): {
  label: string;
  view: Exclude<RightPanelView, null>;
} | null {
  if (s.priority === "compare") return { label: "Open Compare", view: "compare" };
  if (s.priority === "simulate") return { label: "Run Simulation", view: "simulate" };
  const compareHint = s.routing_hints.find((h) => h.target_view === "compare");
  const simHint = s.routing_hints.find((h) => h.target_view === "simulate");
  if (compareHint) return { label: "Open Compare", view: "compare" };
  if (simHint) return { label: "Run Simulation", view: "simulate" };
  const first = s.routing_hints[0];
  if (first) return { label: `Open ${first.label}`.slice(0, 36), view: first.target_view };
  return null;
}

/** Center workspace: decision-first hierarchy; 3-column only for supporting context. */
export function StrategicCommandFull(props: StrategicCommandFullProps) {
  const commandState = useStrategicCommandPanelModel(props);
  const stripModel = React.useMemo(() => {
    const m = buildStrategicDecisionStrip(commandState, props.decisionStrip ?? null);
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.debug?.("[Nexora][DecisionStrip][Built]", {
        decision: m.decision,
        action: m.action,
        confidence: m.confidence,
        source: m.source,
        riskTag: m.riskTag,
      });
    }
    return m;
  }, [
    commandState.headline,
    commandState.summary,
    commandState.priority,
    commandState.next_move,
    commandState.command_confidence_note,
    commandState.command_recommendation,
    commandState.alerts,
    props.decisionStrip,
  ]);

  const [showMoreAlerts, setShowMoreAlerts] = React.useState(false);
  const [govOpen, setGovOpen] = React.useState(false);
  const [showSupporting, setShowSupporting] = React.useState(false);

  const sortedAlerts = React.useMemo(() => sortAlertsBySeverity(commandState.alerts), [commandState.alerts]);
  const topAlerts = sortedAlerts.slice(0, 2);
  const moreAlertCount = Math.max(0, sortedAlerts.length - topAlerts.length);
  const visibleAlerts: StrategicCommandAlert[] = showMoreAlerts ? sortedAlerts : topAlerts;

  const primaryCta = resolvePrimaryCta(commandState);
  const nextReason = oneSentence(commandState.next_move_reason, 140);

  const govSummary = oneSentence(
    [commandState.command_governance_note, commandState.command_approval_note].filter(Boolean).join(" · "),
    120
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", minHeight: 0 }}>
      <StrategicDecisionStrip model={stripModel} />

      {/* 2 — Next move (single column, actionable) */}
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Next move
        </div>
        <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{commandState.next_move}</div>
        {nextReason ? (
          <div style={{ color: nx.muted, fontSize: 13, lineHeight: 1.45 }}>{nextReason}</div>
        ) : null}
        {primaryCta && props.onOpenView ? (
          <button
            type="button"
            onClick={() => props.onOpenView?.(primaryCta.view)}
            style={{
              ...primaryButtonStyle,
              alignSelf: "flex-start",
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {primaryCta.label}
          </button>
        ) : null}
      </div>

      {/* 3 — Alerts (severity-first, top 2 + expand) */}
      {sortedAlerts.length ? (
        <div style={{ ...panelSurfaceStyle, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Alerts
            </div>
            {moreAlertCount > 0 && !showMoreAlerts ? (
              <button
                type="button"
                onClick={() => setShowMoreAlerts(true)}
                style={{ ...secondaryButtonStyle, padding: "6px 12px", fontSize: 11, fontWeight: 700 }}
              >
                +{moreAlertCount} more
              </button>
            ) : null}
            {showMoreAlerts && moreAlertCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowMoreAlerts(false)}
                style={{ ...secondaryButtonStyle, padding: "6px 12px", fontSize: 11, fontWeight: 700 }}
              >
                Show fewer
              </button>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  ...softCardStyle,
                  padding: 12,
                  borderColor:
                    alert.level === "critical"
                      ? "rgba(248,113,113,0.4)"
                      : alert.level === "warning"
                        ? "rgba(245,158,11,0.32)"
                        : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{alert.title}</div>
                  <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{alert.level}</div>
                </div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>{oneSentence(alert.summary, 160)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 4 — Governance & approval (collapsed by default) */}
      <div style={{ ...softCardStyle, padding: 0, overflow: "hidden" }}>
        <button
          type="button"
          onClick={() => setGovOpen((v) => !v)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "12px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Governance & approval
            </div>
            <div style={{ color: nx.muted, fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
              {govOpen ? "Hide details" : govSummary || "Tap to review gates before execution"}
            </div>
          </div>
          <span style={{ color: nx.muted, fontSize: 18, fontWeight: 700 }}>{govOpen ? "▾" : "▸"}</span>
        </button>
        {govOpen ? (
          <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...softCardStyle, padding: 12 }}>
              <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Governance</div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, marginTop: 6 }}>
                {oneSentence(commandState.command_governance_note ?? "No governance blockers surfaced.", 220)}
              </div>
            </div>
            <div style={{ ...softCardStyle, padding: 12 }}>
              <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Approval</div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, marginTop: 6 }}>
                {oneSentence(commandState.command_approval_note ?? "Approval path is clear or not required.", 220)}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Toggle — deep / supporting context */}
      <button
        type="button"
        onClick={() => setShowSupporting((v) => !v)}
        style={{ ...secondaryButtonStyle, alignSelf: "flex-start", fontSize: 12, fontWeight: 700 }}
      >
        {showSupporting ? "Hide supporting context" : "Show details"}
      </button>

      {showSupporting ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Situation
            </div>
            <div style={{ color: nx.text, fontSize: 15, fontWeight: 800 }}>{commandState.headline}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{oneSentence(commandState.summary, 280)}</div>
            <div style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>Priority</div>
              <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800, marginTop: 4 }}>{pretty(commandState.priority)}</div>
              <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45, marginTop: 4 }}>{oneSentence(commandState.priority_reason, 200)}</div>
            </div>
          </div>

          <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Options & routing
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {commandState.routing_hints.map((hint) => (
                <div key={`${hint.target_view}:${hint.label}`} style={{ ...softCardStyle, padding: 10 }}>
                  <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{hint.label}</div>
                  <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>{oneSentence(hint.reason, 120)}</div>
                  {props.onOpenView ? (
                    <button type="button" style={{ ...secondaryButtonStyle, marginTop: 8, fontSize: 11 }} onClick={() => props.onOpenView?.(hint.target_view)}>
                      Open
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Recommendation & flags
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{oneSentence(commandState.command_recommendation, 260)}</div>
            <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>{oneSentence(commandState.explanation, 220)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              {(commandState.review_flags.length ? commandState.review_flags : ["No open review flags."]).map((flag) => (
                <div key={flag} style={{ ...softCardStyle, padding: 8, color: nx.muted, fontSize: 11, lineHeight: 1.4 }}>
                  {oneSentence(flag, 160)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
