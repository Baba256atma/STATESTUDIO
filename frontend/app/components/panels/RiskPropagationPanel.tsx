"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";
import type { RiskPanelData } from "../../lib/panels/panelDataContract";
import { resolveRiskReadiness } from "../../lib/panels/panelDataReadiness";
import { logPanelOnce } from "../../lib/debug/panelLogSignature";
import { RightPanelFallback } from "../right-panel/RightPanelFallback";
import {
  buildRiskIntelligence,
  intelligencePrimaryTone,
  logPanelIntelligence,
} from "../../lib/intelligence/panelIntelligence";
import { buildRiskDecisionSet } from "../../lib/decision/decisionEngine";
import { PanelDecisionSetSection } from "./PanelDecisionSetSection";

function executiveHeadline(text: string, max = 120): string {
  const t = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "—";
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

function prettyObjectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

type StableRiskPanelContentProps = {
  risk: RiskPanelData;
  mode: "risk" | "fragility";
  showRiskFlowEntry: boolean;
  onOpenRiskFlow: (() => void) | null;
};

function StableRiskPanelContent({
  risk,
  mode,
  showRiskFlowEntry,
  onOpenRiskFlow,
}: StableRiskPanelContentProps) {
  const isFragility = mode === "fragility";
  const edges = Array.isArray(risk.edges) ? risk.edges : [];
  const drivers = Array.isArray(risk.drivers) ? risk.drivers : [];
  const sources = Array.isArray(risk.sources) ? risk.sources : [];
  const summary = typeof risk.summary === "string" && risk.summary.trim().length > 0 ? risk.summary : null;
  const level =
    typeof risk.level === "string" && risk.level.trim().length > 0
      ? risk.level
      : typeof risk.risk_level === "string" && risk.risk_level.trim().length > 0
        ? risk.risk_level
        : null;
  const showRiskFlowCta = showRiskFlowEntry && typeof onOpenRiskFlow === "function";
  const isCritical = Boolean(level && /high|critical|severe/i.test(level));

  const intelligence = React.useMemo(
    () => buildRiskIntelligence(risk as Record<string, unknown>, mode),
    [risk, mode]
  );

  React.useEffect(() => {
    logPanelIntelligence(mode === "fragility" ? "fragility" : "risk", intelligence);
  }, [intelligence, mode]);

  const decisionSet = React.useMemo(() => buildRiskDecisionSet(risk as Record<string, unknown>), [risk]);

  const primaryInsightBorder =
    isCritical && mode === "risk" ? "1px solid rgba(248,113,113,0.42)" : "1px solid rgba(56,189,248,0.28)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...softCardStyle, border: primaryInsightBorder, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Primary insight
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 15,
            fontWeight: 800,
            color: mode === "risk" ? intelligencePrimaryTone(isCritical) : "#e0f2fe",
            lineHeight: 1.35,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={intelligence.primary}
        >
          {executiveHeadline(intelligence.primary)}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
            Recommended action
          </div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: nx.text, lineHeight: 1.4 }}>{intelligence.action}</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: nx.lowMuted }}>
          Confidence: {(intelligence.confidence * 100).toFixed(0)}%
        </div>
      </div>

      <PanelDecisionSetSection view={mode === "fragility" ? "fragility" : "risk"} decisionSet={decisionSet} />

      <details style={{ borderRadius: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: nx.muted }}>
          Details: scanner context, drivers, edges & actions
        </summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {intelligence.implication ? (
            <div style={{ fontSize: 11, color: nx.muted, lineHeight: 1.45, opacity: 0.88 }}>{intelligence.implication}</div>
          ) : null}
          {isFragility ? (
            <div style={{ ...softCardStyle, border: "1px solid rgba(56,189,248,0.22)" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
                Fragility scan
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: nx.muted, lineHeight: 1.45 }}>
                Use the <strong style={{ color: nx.text }}>Fragility Scanner</strong> in the left inspector to paste a short update. Supporting readout lives below.
              </div>
            </div>
          ) : null}
          {isFragility && drivers.length ? (
            <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted, marginBottom: 6 }}>
                Active drivers
              </div>
              {drivers
                .slice(0, 6)
                .map((driver) => String((driver as { label?: unknown; id?: unknown })?.label ?? (driver as { id?: unknown })?.id ?? driver))
                .join(" · ")}
            </div>
          ) : null}
          {showRiskFlowCta ? (
            <div
              style={{
                ...softCardStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: nx.text }}>Risk Flow</div>
                <div style={{ fontSize: 11, color: nx.muted }}>Inspect propagation, drivers, and downstream exposure.</div>
              </div>
              <button
                type="button"
                onClick={() => onOpenRiskFlow?.()}
                style={{
                  border: "1px solid rgba(148,163,184,0.22)",
                  background: "rgba(15,23,42,0.72)",
                  color: nx.text,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Open Risk Flow
              </button>
            </div>
          ) : null}
          {summary ? (
            <div style={{ fontSize: 11, color: nx.muted, lineHeight: 1.45 }}>{summary}</div>
          ) : null}
          {edges[0] ? (
            <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
              Edge: {prettyObjectName(String(edges[0]?.from ?? "source"))} {"\u2192"}{" "}
              {prettyObjectName(String(edges[0]?.to ?? "target"))}.
            </div>
          ) : null}
          {!edges.length && level ? (
            <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
              Current risk posture: {level}
              {sources.length ? ` across ${sources.length} source${sources.length === 1 ? "" : "s"}.` : "."}
            </div>
          ) : null}
          {!edges.length && drivers.length && !isFragility ? (
            <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
              Active drivers:{" "}
              {drivers
                .slice(0, 4)
                .map((driver) => String((driver as { label?: unknown; id?: unknown })?.label ?? (driver as { id?: unknown })?.id ?? driver))
                .join(", ")}
            </div>
          ) : null}
          {edges.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {edges.map((e, i) => (
                <div
                  key={`${e.from ?? "src"}-${e.to ?? "dst"}-${i}`}
                  style={{
                    ...cardStyle,
                    padding: 10,
                    background: nx.bgPanelSoft,
                  }}
                >
                  <div style={{ fontSize: 12, color: nx.text, fontWeight: 600 }}>
                    {prettyObjectName(String(e.from ?? "unknown"))} {"\u2192"}{" "}
                    {prettyObjectName(String(e.to ?? "unknown"))}
                  </div>
                  <div style={{ fontSize: 11, color: nx.muted }}>weight: {Number(e.weight ?? 0).toFixed(3)}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}

export default function RiskPropagationPanel({
  risk,
  mode = "risk",
  showRiskFlowEntry = false,
  onOpenRiskFlow = null,
}: {
  risk: RiskPanelData | null | undefined;
  /** `risk` = propagation / edges; `fragility` = scan posture + drivers (scanner UI stays in the inspector). */
  mode?: "risk" | "fragility";
  showRiskFlowEntry?: boolean;
  onOpenRiskFlow?: (() => void) | null;
}) {
  const readiness = resolveRiskReadiness(risk);

  React.useEffect(() => {
    logPanelOnce("[Nexora][PanelDataState]", {
      panel: mode === "fragility" ? "fragility" : "risk",
      readiness,
    });
  }, [mode, readiness]);

  if (readiness === "loading") {
    return <RightPanelFallback mode="loading" embedded />;
  }
  if (readiness === "empty") {
    return (
      <EmptyStateCard
        text={
          mode === "fragility"
            ? "Run a fragility scan from the inspector to populate drivers and weak-link signals."
            : "No significant risk detected."
        }
      />
    );
  }

  return (
    <StableRiskPanelContent
      risk={risk as RiskPanelData}
      mode={mode}
      showRiskFlowEntry={showRiskFlowEntry}
      onOpenRiskFlow={onOpenRiskFlow}
    />
  );
}
