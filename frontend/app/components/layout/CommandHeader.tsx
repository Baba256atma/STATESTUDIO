"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";

type CommandHeaderProps = {
  pilotOperatorChrome?: boolean;
  scenarioLabel: string;
  activeModeLabel: string;
  contextLabel?: string | null;
  /** Opens workspace / domain selection (page-level). */
  onSwitchWorkspace?: (() => void) | null;
  /** Shown as “{label} ▼”; falls back to “Workspace ▼”. */
  workspaceSwitcherLabel?: string | null;
  statusLabel: "Stable" | "Warning" | "Critical";
  statusTone: "stable" | "warning" | "critical";
  systemHealthTier?: "green" | "yellow" | "red" | null;
  councilSummary?: string | null;
  decisionHeadline?: string | null;
  topDriverLabel?: string | null;
  profileSelector?: React.ReactNode;
  commandValue: string;
  commandPlaceholder: string;
  onCommandChange: (value: string) => void;
  onCommandSubmit: () => void;
  onAssessBusinessText?: (() => void) | null;
  onOpenMultiSourceAssess?: (() => void) | null;
  onLoadDemo?: () => void;
  onSnapshot?: () => void;
  onReplay?: () => void;
  onStartInvestorDemo?: (() => void) | null;
  investorDemoActive?: boolean;
  commandBarMicroHint?: string | null;
};

function toneColor(tone: CommandHeaderProps["statusTone"]) {
  if (tone === "critical") return nx.risk;
  if (tone === "warning") return nx.warning;
  return nx.success;
}

function healthChip(tier: "green" | "yellow" | "red" | null | undefined): { label: string; color: string } {
  if (tier === "green") return { label: "Healthy", color: nx.success };
  if (tier === "yellow") return { label: "Warning", color: nx.warning };
  return { label: "Critical", color: nx.risk };
}

export function CommandHeader(props: CommandHeaderProps) {
  const pilot = Boolean(props.pilotOperatorChrome);
  const health = healthChip(props.systemHealthTier ?? "red");
  const statusColor = toneColor(props.statusTone);
  const identityLabel = pilot ? "Nexora Pilot" : "Nexora";
  const context = (props.contextLabel ?? props.activeModeLabel ?? "").trim() || "Decision workspace";

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    globalThis.console?.debug?.("[Nexora][TopBar] simplified");
    globalThis.console?.debug?.("[Nexora][TopBar] input_removed");
    globalThis.console?.debug?.("[Nexora][TopBar] icon_system_applied");
    globalThis.console?.debug?.("[Nexora][TopBar] actions_reduced");
  }, []);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 12,
        minHeight: 64,
        borderBottom: `1px solid ${nx.border}`,
        background: nx.bgShell,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          margin: "0 auto",
          padding: "10px 16px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          minWidth: 0,
        }}
      >
        <div className="nexora-top-left" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "1 1 0%" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${nx.logoBorder}`,
              background: nx.logoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: nx.logoText,
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.1em",
              flexShrink: 0,
            }}
            aria-hidden
          >
            NX
          </div>
          <span className="nexora-brand" style={{ color: nx.textStrong, fontSize: 15, fontWeight: 800, lineHeight: 1.15, flexShrink: 0 }}>
            {identityLabel}
          </span>
          <span
            className="nexora-domain"
            style={{
              color: nx.muted,
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 220,
              minWidth: 0,
            }}
            title={context}
          >
            {context}
          </span>
          {props.onSwitchWorkspace ? (
            <button
              type="button"
              className="nexora-workspace-switch"
              onClick={props.onSwitchWorkspace}
              aria-label="Switch workspace"
              title="Return to workspace selection"
            >
              <span className="nexora-workspace-switch-label">
                {(props.workspaceSwitcherLabel ?? "Workspace").trim() || "Workspace"} ▼
              </span>
            </button>
          ) : null}
        </div>

        <div style={{ flex: "1 1 0%", maxWidth: 380, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <button type="button" className="nexora-primary-cta" onClick={props.onCommandSubmit} style={primaryActionStyle}>
            [{">"}] Analyze
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, flex: "1 1 0%", minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              borderRadius: 999,
              border: `1px solid ${nx.border}`,
              background: nx.statusWellBg,
              fontSize: 11,
              fontWeight: 700,
              color: nx.textSoft,
              flexShrink: 0,
            }}
            title={`System health: ${health.label}`}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusColor,
                boxShadow: `0 0 8px ${statusColor}`,
              }}
            />
            {health.label}
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("nexora:focus-bottom-command-dock"))}
            style={secondaryActionStyle}
            title="Focus bottom command dock (Cmd+K)"
          >
            [K] Ask
          </button>

          {props.onSnapshot ? (
            <button type="button" onClick={props.onSnapshot} style={secondaryActionStyle}>
              [S] Snapshot
            </button>
          ) : null}

          {props.onReplay ? (
            <button type="button" onClick={props.onReplay} style={secondaryActionStyle}>
              [R] Replay
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const primaryActionStyle: React.CSSProperties = {
  height: 40,
  minWidth: 140,
  padding: "0 18px",
  borderRadius: 12,
  border: `1px solid ${nx.primaryCtaBorder}`,
  background: nx.btnPrimaryBg,
  color: nx.btnPrimaryText,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.02em",
  cursor: "pointer",
  flexShrink: 0,
};

const secondaryActionStyle: React.CSSProperties = {
  height: 34,
  padding: "0 10px",
  borderRadius: 9,
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
};
