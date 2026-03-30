"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";

type CommandHeaderProps = {
  scenarioLabel: string;
  activeModeLabel: string;
  contextLabel?: string | null;
  statusLabel: "Stable" | "Warning" | "Critical";
  statusTone: "stable" | "warning" | "critical";
  councilSummary?: string | null;
  systemStateSummary?: string | null;
  keyRiskStatement?: string | null;
  decisionHeadline?: string | null;
  topDriverLabel?: string | null;
  profileSelector?: React.ReactNode;
  commandValue: string;
  commandPlaceholder: string;
  onCommandChange: (value: string) => void;
  onCommandSubmit: () => void;
  onLoadDemo: () => void;
  onSnapshot: () => void;
  onReplay: () => void;
};

function toneColor(tone: CommandHeaderProps["statusTone"]) {
  if (tone === "critical") return nx.risk;
  if (tone === "warning") return nx.warning;
  return nx.success;
}

export function CommandHeader(props: CommandHeaderProps) {
  const statusColor = toneColor(props.statusTone);
  const contextChips = [
    props.systemStateSummary
      ? { label: "System", value: props.systemStateSummary, tone: "#dbeafe" }
      : null,
    props.keyRiskStatement
      ? { label: "Risk", value: props.keyRiskStatement, tone: "#fde68a" }
      : null,
    props.decisionHeadline
      ? { label: "Decision", value: props.decisionHeadline, tone: "#bfdbfe" }
      : null,
  ].filter((entry): entry is { label: string; value: string; tone: string } => Boolean(entry));

  return (
    <div
      style={{
        minHeight: 96,
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "12px 18px 10px",
        borderBottom: `1px solid ${nx.border}`,
        background: "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(8,16,28,0.86))",
        boxShadow: "0 16px 42px rgba(2,6,23,0.28)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(240px, 340px) minmax(320px, 1fr) minmax(260px, 360px)",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(96,165,250,0.28)",
              background: "linear-gradient(135deg, rgba(37,99,235,0.24), rgba(15,23,42,0.84))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#eff6ff",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.12em",
            }}
          >
            NX
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800 }}>Nexora</div>
            <div style={{ color: nx.lowMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginTop: 2 }}>
              Executive Command
            </div>
            {props.contextLabel ? (
              <div style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {props.contextLabel}
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
              <span style={metaPillStyle("rgba(96,165,250,0.12)", "#dbeafe")}>{props.activeModeLabel}</span>
              <span style={{ color: nx.muted, fontSize: 12, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {props.scenarioLabel}
              </span>
              {props.topDriverLabel ? (
                <span style={metaPillStyle("rgba(245,158,11,0.12)", "#fde68a")}>{props.topDriverLabel}</span>
              ) : null}
            </div>
            {props.councilSummary ? (
              <div style={{ color: "#93c5fd", fontSize: 11, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {props.councilSummary}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: 44,
              padding: "0 12px",
              borderRadius: 16,
              border: `1px solid ${nx.borderStrong}`,
              background: "rgba(2,6,23,0.72)",
              boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.08)",
            }}
          >
            <span style={{ color: "#93c5fd", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Command
            </span>
            <input
              value={props.commandValue}
              onChange={(event) => props.onCommandChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.onCommandSubmit();
              }}
              placeholder={props.commandPlaceholder}
              style={{
                flex: 1,
                minWidth: 0,
                height: 32,
                border: "none",
                outline: "none",
                background: "transparent",
                color: nx.text,
                fontSize: 13,
              }}
            />
          </div>
          <button type="button" onClick={props.onCommandSubmit} style={primaryActionStyle}>
            Run
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
          {props.profileSelector ?? null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 14,
              border: `1px solid ${nx.border}`,
              background: "rgba(2,6,23,0.58)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: statusColor,
                boxShadow: `0 0 14px ${statusColor}`,
              }}
            />
            <div>
              <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Business State
              </div>
              <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.statusLabel}</div>
            </div>
          </div>

          <button type="button" onClick={props.onLoadDemo} style={secondaryActionStyle}>
            Load Demo
          </button>
          <button type="button" onClick={props.onSnapshot} style={secondaryActionStyle}>
            Snapshot
          </button>
          <button type="button" onClick={props.onReplay} style={secondaryActionStyle}>
            Replay
          </button>
        </div>
      </div>

      {contextChips.length ? (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {contextChips.map((chip) => (
            <div
              key={chip.label}
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: "8px 10px",
                borderRadius: 14,
                border: `1px solid ${nx.border}`,
                background: "rgba(2,6,23,0.42)",
                boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.05)",
              }}
            >
              <div
                style={{
                  color: chip.tone,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {chip.label}
              </div>
              <div
                style={{
                  color: "#e5eefb",
                  fontSize: 12,
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {chip.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function metaPillStyle(background: string, color: string): React.CSSProperties {
  return {
    padding: "3px 8px",
    borderRadius: 999,
    border: `1px solid ${nx.border}`,
    background,
    color,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  };
}

const primaryActionStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(96,165,250,0.34)",
  background: "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(59,130,246,0.18))",
  color: "#dbeafe",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryActionStyle: React.CSSProperties = {
  height: 38,
  padding: "0 12px",
  borderRadius: 12,
  border: `1px solid ${nx.border}`,
  background: "rgba(15,23,42,0.74)",
  color: nx.text,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};
