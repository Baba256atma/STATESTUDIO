"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";
import { useNexoraOperatorModeOptional } from "../../lib/product/nexoraOperatorModeContext";
import type { NexoraMode } from "../../lib/product/nexoraMode";

type CommandHeaderProps = {
  /** B.31 — minimal operator chrome: simplified header + command row only. */
  pilotOperatorChrome?: boolean;
  scenarioLabel: string;
  activeModeLabel: string;
  contextLabel?: string | null;
  statusLabel: "Stable" | "Warning" | "Critical";
  statusTone: "stable" | "warning" | "critical";
  /** B.26 — backend `/health` tier (green = all services up, yellow = partial, red = unreachable). */
  systemHealthTier?: "green" | "yellow" | "red" | null;
  councilSummary?: string | null;
  decisionHeadline?: string | null;
  topDriverLabel?: string | null;
  /** Demo / workspace selector — must live in the right zone, not inside the command field. */
  profileSelector?: React.ReactNode;
  commandValue: string;
  commandPlaceholder: string;
  onCommandChange: (value: string) => void;
  onCommandSubmit: () => void;
  /**
   * Assess command-bar text on the loaded scene: ingestion → fragility scan → scene highlights (does not send chat).
   * When omitted, the secondary action is hidden.
   */
  onAssessBusinessText?: (() => void) | null;
  /** Open compact multi-source assessment (trust-weighted merge → scanner → scene). */
  onOpenMultiSourceAssess?: (() => void) | null;
  onLoadDemo?: () => void;
  onSnapshot?: () => void;
  onReplay?: () => void;
  /** Guided investor walkthrough (frontend-only). */
  onStartInvestorDemo?: (() => void) | null;
  investorDemoActive?: boolean;
  /** B.27 — one-line operator hint under the command field (when present). */
  commandBarMicroHint?: string | null;
};

function toneColor(tone: CommandHeaderProps["statusTone"]) {
  if (tone === "critical") return nx.risk;
  if (tone === "warning") return nx.warning;
  return nx.success;
}

function healthChip(tier: "green" | "yellow" | "red" | null | undefined): { emoji: string; label: string; color: string } {
  if (tier === "green") return { emoji: "🟢", label: "Healthy", color: nx.success };
  if (tier === "yellow") return { emoji: "🟡", label: "Partial", color: nx.warning };
  return { emoji: "🔴", label: "Down", color: nx.risk };
}

export function CommandHeader(props: CommandHeaderProps) {
  const pilot = Boolean(props.pilotOperatorChrome);
  const operatorModeCtx = useNexoraOperatorModeOptional();
  const health = healthChip(props.systemHealthTier ?? "red");
  const statusColor = toneColor(props.statusTone);
  const decisionChip = props.decisionHeadline
    ? { label: "Decision", value: props.decisionHeadline, tone: nx.accentMuted }
    : null;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 12,
        minHeight: 72,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: 0,
        borderBottom: `1px solid ${nx.border}`,
        background: nx.bgShell,
        boxShadow: nx.headerShadow,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "14px 18px 12px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          minWidth: 0,
        }}
      >
        {/* LEFT: product / workspace / domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            minWidth: 0,
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: pilot ? "200px" : "280px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${nx.logoBorder}`,
              background: nx.logoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: nx.logoText,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.12em",
              flexShrink: 0,
            }}
          >
            NX
          </div>
          <div style={{ minWidth: 0 }}>
            {pilot ? (
              <>
                <div style={{ color: nx.textStrong, fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Nexora Pilot</div>
                <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 600, marginTop: 3, letterSpacing: "0.02em" }}>
                  Decision Intelligence System
                </div>
              </>
            ) : (
              <>
                <div style={{ color: nx.textStrong, fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Nexora</div>
                <div style={{ color: nx.lowMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginTop: 4 }}>
                  Decision intelligence
                </div>
                <div
                  style={{
                    color: nx.lowMuted,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginTop: 5,
                    opacity: 0.68,
                  }}
                >
                  War room · Live decision mode
                </div>
                {props.contextLabel ? (
                  <div
                    style={{
                      color: nx.textSoft,
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {props.contextLabel}
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                  <span style={metaPillStyle(nx.metaPillModeBg, nx.accentInk)}>{props.activeModeLabel}</span>
                  <span
                    style={{
                      color: nx.muted,
                      fontSize: 12,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {props.scenarioLabel}
                  </span>
                  {props.topDriverLabel ? (
                    <span style={metaPillStyle(nx.metaPillDriverBg, nx.warning)}>{props.topDriverLabel}</span>
                  ) : null}
                </div>
                {props.councilSummary ? (
                  <div style={{ color: nx.accentMuted, fontSize: 11, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {props.councilSummary}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* CENTER: command + primary CTA only */}
        <div
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            justifyContent: "center",
          }}
        >
          <div
            className="nexora-command-console"
            style={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 46,
              padding: "0 14px",
              borderRadius: 12,
              border: `1px solid ${nx.borderStrong}`,
              background: nx.consoleBg,
              boxShadow: nx.consoleInset,
            }}
          >
            <span
              style={{
                color: nx.accentMuted,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Ask
            </span>
            <input
              value={props.commandValue}
              onChange={(event) => props.onCommandChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.onCommandSubmit();
              }}
              placeholder={props.commandPlaceholder}
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                height: 34,
                border: "none",
                outline: "none",
                background: "transparent",
                color: nx.text,
                fontSize: 13,
                fontWeight: 500,
                caretColor: nx.accentMuted,
              }}
            />
          </div>
          {!pilot ? (
            <button type="button" className="nexora-primary-cta" onClick={props.onCommandSubmit} style={primaryActionStyle}>
              Analyze
            </button>
          ) : null}
          {props.onAssessBusinessText ? (
            <button
              type="button"
              title="Assess this text on the scene: signals, fragility scan, and highlights (does not send chat)."
              onClick={props.onAssessBusinessText}
              style={{
                ...primaryActionStyle,
                opacity: 0.92,
                background: nx.consoleBg,
                color: nx.textSoft,
                border: `1px solid ${nx.borderStrong}`,
              }}
            >
              Assess text
            </button>
          ) : null}
          {props.onOpenMultiSourceAssess ? (
            <button
              type="button"
              title="Assess multiple sources (merge, trust weighting, fragility scan, scene)."
              onClick={props.onOpenMultiSourceAssess}
              style={{
                ...primaryActionStyle,
                opacity: 0.92,
                background: nx.consoleBg,
                color: nx.textSoft,
                border: `1px solid ${nx.borderStrong}`,
              }}
            >
              Assess sources
            </button>
          ) : null}
          {operatorModeCtx ? (
            <OperatorModeInlineToggle mode={operatorModeCtx.nexoraMode} onChange={operatorModeCtx.setNexoraMode} />
          ) : null}
        </div>

        {/* RIGHT: scenario → state → presenter tools (grouped for live demos) */}
        {!pilot ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 12,
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: "440px",
              minWidth: 0,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 4, flexWrap: "wrap" }}>
              <span
                title={`System health: ${health.label}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: `1px solid ${nx.border}`,
                  background: nx.statusWellBg,
                  fontSize: 10,
                  fontWeight: 800,
                  color: health.color,
                  flexShrink: 0,
                }}
              >
                <span aria-hidden="true">{health.emoji}</span>
                {health.label}
              </span>
              {props.profileSelector ?? null}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                borderLeft: `1px solid ${nx.divider}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 14,
                  border: `1px solid ${nx.border}`,
                  background: nx.statusWellBg,
                  flexShrink: 0,
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
                  <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    State
                  </div>
                  <div style={{ color: nx.textStrong, fontSize: 13, fontWeight: 800 }}>{props.statusLabel}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 12,
                borderLeft: `1px solid ${nx.divider}`,
                flexWrap: "wrap",
              }}
            >
              {props.onStartInvestorDemo ? (
                <button
                  type="button"
                  className="nexora-secondary-cta"
                  onClick={props.onStartInvestorDemo}
                  style={{
                    ...secondaryActionStyle,
                    borderColor: props.investorDemoActive ? nx.accentMuted : secondaryActionStyle.borderColor,
                    color: props.investorDemoActive ? nx.accentMuted : undefined,
                  }}
                  title="Guided 5-step decision story on the current scenario"
                >
                  {props.investorDemoActive ? "Demo live" : "Start demo"}
                </button>
              ) : null}
              {props.onLoadDemo ? (
                <button type="button" className="nexora-secondary-cta" onClick={props.onLoadDemo} style={{ ...secondaryActionStyle, opacity: 0.95 }}>
                  Load scenario
                </button>
              ) : null}
              {props.onSnapshot ? (
                <button type="button" className="nexora-secondary-cta" onClick={props.onSnapshot} style={secondaryActionStyle}>
                  Snapshot
                </button>
              ) : null}
              {props.onReplay ? (
                <button type="button" className="nexora-secondary-cta" onClick={props.onReplay} style={secondaryActionStyle}>
                  Replay
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {props.commandBarMicroHint ? (
        <div
          style={{
            width: "100%",
            maxWidth: 720,
            margin: "0 auto",
            padding: "0 4px 2px",
            boxSizing: "border-box",
            color: nx.lowMuted,
            fontSize: 10,
            lineHeight: 1.35,
            textAlign: "center",
          }}
        >
          {props.commandBarMicroHint}
        </div>
      ) : null}

      {decisionChip ? (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "6px 10px",
              borderRadius: 12,
              border: `1px solid ${nx.border}`,
              background: nx.chipSurface,
              boxShadow: nx.chipInset,
            }}
          >
            <div
              style={{
                color: decisionChip.tone,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {decisionChip.label}
            </div>
            <div
              style={{
                color: nx.chipValueText,
                fontSize: 11,
                lineHeight: 1.35,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {decisionChip.value}
            </div>
          </div>
        </div>
      ) : null}
      </div>
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
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: `1px solid ${nx.primaryCtaBorder}`,
  background: nx.btnPrimaryBg,
  color: nx.btnPrimaryText,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.02em",
  cursor: "pointer",
  flexShrink: 0,
};

const secondaryActionStyle: React.CSSProperties = {
  height: 36,
  padding: "0 12px",
  borderRadius: 10,
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
};

function OperatorModeInlineToggle(props: { mode: NexoraMode; onChange: (mode: NexoraMode) => void }) {
  const chip = (label: string, value: NexoraMode) => {
    const on = props.mode === value;
    return (
      <button
        type="button"
        title={value === "adaptive" ? "Use memory, outcomes, and adaptive bias" : "Fragility and trust only; no historical bias"}
        onClick={() => props.onChange(value)}
        style={{
          height: 32,
          padding: "0 10px",
          borderRadius: 999,
          border: `1px solid ${on ? nx.accentMuted : nx.borderStrong}`,
          background: on ? "color-mix(in srgb, var(--nx-accent-muted) 18%, transparent)" : nx.consoleBg,
          color: on ? nx.accentInk : nx.textSoft,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.04em",
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {label} {on ? "●" : "○"}
      </button>
    );
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} aria-label="Nexora operator mode">
      {chip("Adaptive", "adaptive")}
      {chip("Pure", "pure")}
    </div>
  );
}
