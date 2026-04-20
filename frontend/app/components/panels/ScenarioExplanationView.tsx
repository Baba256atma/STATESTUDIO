"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";
import type { ScenarioExplanationBlockInput } from "../../lib/panels/buildScenarioExplanationFromDecisionAnalysis";
import { useInvestorDemoOptional } from "../demo/InvestorDemoContext";

type InvestorDemoSection = "problem" | "cause" | "impact" | "recommendation" | "trust";

function capitalizeConfidence(label: string): string {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

export type WarRoomExplanationChrome = {
  decisionFocus: string | null;
  timeHorizon: string | null;
  riskStatus: string | null;
  fragilityStatus: string | null;
  confidenceLabel: string | null;
  primaryNodeLabel: string | null;
  onSimulate: (() => void) | null;
  onExecute: (() => void) | null;
  executeDisabled?: boolean;
  dense?: boolean;
};

export function ScenarioExplanationView(props: {
  block: ScenarioExplanationBlockInput;
  /** When false, omits the top "Explanation" caption (e.g. RSK tab has its own chrome). */
  showCaption?: boolean;
  /** Command-intel chrome for RSK / war room (decision focus, status, CTAs). */
  warRoom?: WarRoomExplanationChrome | null;
}) {
  const { block, showCaption = true, warRoom = null } = props;
  const investorDemoCtx = useInvestorDemoOptional();
  const demoActive = investorDemoCtx?.demo.active ?? false;
  const demoStep = investorDemoCtx?.demo.step ?? -1;
  const demoHighlight: InvestorDemoSection | null =
    demoActive && demoStep === 1
      ? "problem"
      : demoActive && demoStep === 2
        ? "cause"
        : demoActive && demoStep === 3
          ? "impact"
          : demoActive && demoStep === 4
            ? "recommendation"
            : demoActive && demoStep === 5
              ? "trust"
              : null;
  const dense = warRoom?.dense === true;
  const lineClamp = dense ? 1 : 2;
  const rowShell: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "8px 10px",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: nx.border,
    background: nx.bgPanelSoft,
  };
  const sectionShell = (section: InvestorDemoSection, extra?: React.CSSProperties): React.CSSProperties => {
    const hi = demoHighlight === section;
    const rest: React.CSSProperties = { ...(extra ?? {}) };
    const explicitBorderColor = rest.borderColor;
    delete rest.border;
    delete rest.borderColor;
    delete rest.borderStyle;
    delete rest.borderWidth;
    const borderColor = hi ? nx.accentMuted : explicitBorderColor ?? nx.border;
    return {
      ...rowShell,
      ...rest,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor,
      ...(hi
        ? {
            boxShadow: `0 0 0 2px ${nx.accentMuted}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }
        : {}),
    };
  };
  const labelRow = (emoji: string, label: string, color: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>
        {emoji}
      </span>
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
  const bodyStyle = (emphasis: "problem" | "default" | "recommendation"): React.CSSProperties => ({
    fontSize: 12,
    lineHeight: 1.35,
    fontWeight: emphasis === "problem" ? 800 : emphasis === "recommendation" ? 700 : 500,
    color: emphasis === "recommendation" ? nx.accent : emphasis === "problem" ? nx.textStrong : nx.textSoft,
    display: "-webkit-box",
    WebkitLineClamp: lineClamp,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
  });
  const conf = block.confidence;
  const trust = block.trust;
  const confColor =
    conf === "high" ? nx.success : conf === "medium" ? nx.warning : conf === "low" ? nx.risk : nx.muted;
  const trustConfColor =
    trust?.confidence.label === "high"
      ? nx.success
      : trust?.confidence.label === "medium"
        ? nx.warning
        : trust?.confidence.label === "low"
          ? nx.risk
          : nx.muted;

  const confidenceForStatus =
    warRoom?.confidenceLabel != null
      ? capitalizeConfidence(warRoom.confidenceLabel)
      : trust
        ? capitalizeConfidence(trust.confidence.label)
        : null;

  const bulletList = (items: string[], max: number, keyPrefix: string) =>
    items.length ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.slice(0, max).map((item, idx) => (
          <div key={`${keyPrefix}:${idx}:${item.slice(0, 24)}`} style={{ fontSize: 11.5, lineHeight: 1.35, color: nx.textSoft }}>
            • {item}
          </div>
        ))}
      </div>
    ) : null;

  const ctaBase: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: nx.borderStrong,
  };

  return (
    <div
      style={{
        marginTop: showCaption ? 10 : 0,
        padding: 10,
        borderRadius: 12,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: nx.border,
        background: nx.surfacePanel,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {warRoom && !demoActive ? (
        <div
          style={{
            padding: "10px 10px 12px",
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: nx.border,
            background: nx.bgDeep,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: nx.accentMuted }}>
            Decision focus
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.35, color: nx.textStrong }}>
            {warRoom.decisionFocus ?? block.recommendation}
          </div>
          {warRoom.timeHorizon ? (
            <div style={{ fontSize: 10, color: nx.textSoft, fontWeight: 600 }}>
              <span style={{ color: nx.lowMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Time horizon · </span>
              {warRoom.timeHorizon}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              fontSize: 11,
              lineHeight: 1.4,
              color: nx.textSoft,
            }}
          >
            <span style={{ color: nx.lowMuted, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 9 }}>
              System status
            </span>
            {warRoom.riskStatus ? <span>{warRoom.riskStatus}</span> : null}
            {warRoom.fragilityStatus ? <span>{warRoom.fragilityStatus}</span> : null}
            {confidenceForStatus ? (
              <span style={{ color: trustConfColor, fontWeight: 700 }}>Confidence: {confidenceForStatus}</span>
            ) : null}
          </div>
          {warRoom.primaryNodeLabel ? (
            <div style={{ fontSize: 11, color: nx.textSoft, fontWeight: 600 }}>
              <span style={{ color: nx.lowMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9 }}>Primary node · </span>
              {warRoom.primaryNodeLabel}
            </div>
          ) : null}
        </div>
      ) : null}

      {showCaption && !demoActive ? (
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Explanation
        </div>
      ) : null}
      <div data-investor-demo-section="problem" style={sectionShell("problem")}>
        {labelRow("\u{1F534}", "Problem", nx.risk)}
        <div style={bodyStyle("problem")}>{block.problem}</div>
      </div>
      <div data-investor-demo-section="cause" style={sectionShell("cause")}>
        {labelRow("\u{26A0}\u{FE0F}", "Cause", nx.warning)}
        <div style={bodyStyle("default")}>{block.cause}</div>
      </div>
      <div data-investor-demo-section="impact" style={sectionShell("impact")}>
        {labelRow("\u{1F4C9}", "Impact", nx.muted)}
        <div style={bodyStyle("default")}>{block.impact}</div>
      </div>
      <div data-investor-demo-section="recommendation" style={sectionShell("recommendation", { borderColor: nx.borderStrong })}>
        {labelRow("\u{1F449}", "Recommendation", nx.accentMuted)}
        <div style={bodyStyle("recommendation")}>{block.recommendation}</div>
      </div>
      {trust ? (
        <div data-investor-demo-section="trust" style={sectionShell("trust", { gap: 8 })}>
          {labelRow("\u{1F50E}", "Why this?", nx.textSoft)}
          {bulletList(trust.whyThisBullets, dense ? 4 : 5, "why")}

          {labelRow("\u{1F4CA}", "Evidence", nx.textSoft)}
          {bulletList(trust.evidence, dense ? 4 : 5, "ev")}

          {labelRow("\u{26A1}", "Trade-offs & risks", nx.warning)}
          {bulletList(trust.riskTradeoffs, 3, "risk")}

          <div>
            {labelRow("\u{1F9E0}", "Confidence", trustConfColor)}
            <div style={{ fontSize: 11.5, lineHeight: 1.35, color: trustConfColor, fontWeight: 700 }}>
              {capitalizeConfidence(trust.confidence.label)}
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.35, color: nx.textSoft, marginTop: 2 }}>{trust.confidence.summaryLine}</div>
            <div
              style={{
                fontSize: 11,
                lineHeight: 1.35,
                color: nx.lowMuted,
                marginTop: 2,
                display: "-webkit-box",
                WebkitLineClamp: dense ? 1 : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {trust.confidence.explanation}
            </div>
          </div>

          {!demoActive ? (
            <>
              <div
                style={{
                  fontSize: 10,
                  lineHeight: 1.35,
                  color: nx.lowMuted,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Decision trace
              </div>
              <div style={{ fontSize: 10.5, lineHeight: 1.35, color: nx.muted }}>{trust.decisionTrace}</div>
            </>
          ) : null}
        </div>
      ) : null}
      {warRoom && (warRoom.onSimulate || warRoom.onExecute) && !demoActive ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {warRoom.onSimulate ? (
              <button
                type="button"
                style={{
                  ...ctaBase,
                  background: nx.bgControl,
                  color: nx.textStrong,
                }}
                onClick={() => warRoom.onSimulate?.()}
              >
                Simulate this action
              </button>
            ) : null}
            {warRoom.onExecute ? (
              <button
                type="button"
                style={{
                  ...ctaBase,
                  background: nx.accentSoft,
                  color: nx.accent,
                  opacity: warRoom.executeDisabled ? 0.45 : 1,
                }}
                disabled={warRoom.executeDisabled}
                title={warRoom.executeDisabled ? "Run analysis or ensure targets are available to execute." : undefined}
                onClick={() => warRoom.onExecute?.()}
              >
                Execute decision
              </button>
            ) : null}
          </div>
          <div style={{ fontSize: 9, color: nx.lowMuted, letterSpacing: "0.06em", fontWeight: 600 }}>
            See → Understand → Decide → Act
          </div>
        </div>
      ) : null}
      {conf && !trust ? (
        <div
          style={{
            alignSelf: "flex-start",
            marginTop: 2,
            padding: "4px 10px",
            borderRadius: 999,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: nx.border,
            background: nx.bgDeep,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: confColor,
          }}
        >
          Confidence · {conf}
        </div>
      ) : null}
    </div>
  );
}
