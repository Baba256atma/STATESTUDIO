"use client";

import React, { useMemo } from "react";
import type { OperationalChangeSummary } from "../../lib/operational/changeDetectionTypes.ts";
import {
  isExecutiveWorkspaceCleanPresentation,
  shouldExposeExecutiveDevSurfaces,
} from "../../lib/ui/executiveWorkspacePresentation";
import type { OperationalPropagationPreview } from "../../lib/operational/propagationPreviewTypes.ts";
import type { OperationalRiskImpactMap } from "../../lib/operational/riskImpactTypes.ts";
import {
  formatOperationalTopChangeLine,
  getOperationalChangeSummaryTone,
  getOperationalExecutiveSignal,
  truncateOperationalText,
} from "../../lib/operational/changePresentation.ts";
import {
  getOperationalExposureLabel,
  getOperationalRiskHeadlineTone,
} from "../../lib/operational/riskImpactPresentation.ts";
import {
  getPropagationExecutiveSummary,
  getPropagationRiskLabel,
  getPropagationRiskTone,
} from "../../lib/operational/propagationPresentation.ts";
import type { OperationalMonitoringSnapshot } from "../../lib/operational/monitoringTypes.ts";
import type { OperationalAlertEvaluationResult } from "../../lib/operational/index.ts";
import {
  getOperationalAlertHeadline,
  getOperationalExecutiveAlertTone,
  topOperationalAlert,
} from "../../lib/operational/index.ts";
import type { MonitoringPresentationTone } from "../../lib/operational/monitoringPresentation.ts";
import {
  getMonitoringStatusLabel,
  getMonitoringStatusTone,
  getMonitoringTrendLabel,
  getMonitoringTrendTone,
} from "../../lib/operational/monitoringPresentation.ts";

export type D3StatusHudProps = {
  snapshot: OperationalMonitoringSnapshot | null;
  changeSummary?: OperationalChangeSummary | null;
  propagationPreview?: OperationalPropagationPreview | null;
  riskImpactMap?: OperationalRiskImpactMap | null;
  alertEvaluation?: OperationalAlertEvaluationResult | null;
  className?: string;
};

function isD3MonitoringSnapshotLive(snapshot: OperationalMonitoringSnapshot | null): snapshot is OperationalMonitoringSnapshot {
  return snapshot != null && (snapshot.status !== "idle" || snapshot.signals.length > 0);
}

function toneToBadgeStyle(tone: ReturnType<typeof getMonitoringStatusTone>): React.CSSProperties {
  switch (tone) {
    case "positive":
      return {
        border: "1px solid rgba(52, 211, 153, 0.35)",
        background: "rgba(16, 185, 129, 0.12)",
        color: "rgba(167, 243, 208, 0.95)",
      };
    case "caution":
      return {
        border: "1px solid rgba(251, 191, 36, 0.35)",
        background: "rgba(245, 158, 11, 0.12)",
        color: "rgba(253, 230, 138, 0.95)",
      };
    case "negative":
      return {
        border: "1px solid rgba(248, 113, 113, 0.35)",
        background: "rgba(239, 68, 68, 0.12)",
        color: "rgba(254, 202, 202, 0.95)",
      };
    case "critical":
      return {
        border: "1px solid rgba(248, 113, 113, 0.55)",
        background: "rgba(185, 28, 28, 0.22)",
        color: "rgba(254, 226, 226, 0.98)",
      };
    case "neutral":
    default:
      return {
        border: "1px solid rgba(148, 163, 184, 0.22)",
        background: "rgba(148, 163, 184, 0.08)",
        color: "rgba(226, 232, 240, 0.9)",
      };
  }
}

function toneToMutedStyle(tone: ReturnType<typeof getMonitoringTrendTone>): React.CSSProperties {
  const base = toneToBadgeStyle(tone);
  return { ...base, fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600 };
}

function changeSummaryAccentBorder(tone: MonitoringPresentationTone): string {
  switch (tone) {
    case "critical":
    case "negative":
      return "rgba(248, 113, 113, 0.38)";
    case "positive":
      return "rgba(52, 211, 153, 0.32)";
    case "caution":
      return "rgba(251, 191, 36, 0.35)";
    case "neutral":
    default:
      return "rgba(148, 163, 184, 0.22)";
  }
}

const HUD_OUTER: React.CSSProperties = {
  position: "fixed",
  right: 12,
  bottom: 12,
  zIndex: 11,
  maxWidth: "min(300px, calc(100vw - 24px))",
  pointerEvents: "none",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  fontSize: 11,
  lineHeight: 1.45,
};

const HUD_CARD: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(2, 6, 23, 0.55)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
  padding: "10px 12px",
};

export function D3StatusHud({
  snapshot,
  changeSummary,
  propagationPreview,
  riskImpactMap,
  alertEvaluation,
  className,
}: D3StatusHudProps): React.JSX.Element | null {
  const changeSection = useMemo(() => {
    if (changeSummary == null) return null;
    const tone = getOperationalChangeSummaryTone(changeSummary);
    const accent = changeSummaryAccentBorder(tone);
    const stableDelta = changeSummary.totalChanges === 0 && changeSummary.criticalChanges === 0;
    const headline = stableDelta ? "Operational delta · stable" : "Operational delta";
    const execLine = getOperationalExecutiveSignal(changeSummary);
    const summaryLine = truncateOperationalText(changeSummary.executiveSummary, 200);
    const topLine = formatOperationalTopChangeLine(changeSummary.topChange, 118);

    return (
      <div
        data-nx="d3-status-hud-delta"
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${accent}`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", color: "rgba(226,232,240,0.92)", marginBottom: 6 }}>
          {headline}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          <span style={{ ...toneToBadgeStyle("neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Total {changeSummary.totalChanges}
          </span>
          <span style={{ ...toneToBadgeStyle(changeSummary.criticalChanges > 0 ? "critical" : "neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Critical {changeSummary.criticalChanges}
          </span>
          <span style={{ ...toneToBadgeStyle("negative"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Worsening {changeSummary.worseningCount}
          </span>
          <span style={{ ...toneToBadgeStyle("positive"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Improving {changeSummary.improvingCount}
          </span>
          <span style={{ ...toneToBadgeStyle("neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Stable {changeSummary.stableCount}
          </span>
        </div>
        {topLine ? (
          <div style={{ color: "rgba(226,232,240,0.9)", fontSize: 10, fontWeight: 600, marginBottom: 4 }} title={topLine}>
            Top: {topLine}
          </div>
        ) : null}
        <div style={{ color: "rgba(226,232,240,0.88)", fontSize: 10, marginBottom: 4 }}>{execLine}</div>
        <div style={{ color: "rgba(148,163,184,0.95)", fontSize: 9 }}>{summaryLine}</div>
      </div>
    );
  }, [changeSummary]);

  const propagationSection = useMemo(() => {
    if (propagationPreview == null) return null;
    const tone = getPropagationRiskTone(propagationPreview.highestRiskLevel) as MonitoringPresentationTone;
    const accent = changeSummaryAccentBorder(tone);
    const riskLabel = getPropagationRiskLabel(propagationPreview.highestRiskLevel);
    const exec = getPropagationExecutiveSummary(propagationPreview);
    const summaryLine = truncateOperationalText(propagationPreview.summary, 200);
    const top = propagationPreview.propagationNodes[0];
    const topLine = top
      ? truncateOperationalText(`${top.objectId} — ${truncateOperationalText(top.reason, 72)}`, 132)
      : "";

    return (
      <div
        data-nx="d3-status-hud-propagation"
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${accent}`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", color: "rgba(226,232,240,0.92)", marginBottom: 6 }}>
          Propagation preview
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6, alignItems: "center" }}>
          <span style={{ ...toneToBadgeStyle(tone), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{riskLabel}</span>
          <span style={{ ...toneToBadgeStyle("neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            At-risk systems {propagationPreview.propagationNodes.length}
          </span>
        </div>
        {topLine ? (
          <div style={{ color: "rgba(226,232,240,0.88)", fontSize: 10, fontWeight: 600, marginBottom: 4 }} title={topLine}>
            Next: {topLine}
          </div>
        ) : null}
        <div style={{ color: "rgba(226,232,240,0.86)", fontSize: 10, marginBottom: 4 }}>{exec}</div>
        <div style={{ color: "rgba(148,163,184,0.95)", fontSize: 9 }}>{summaryLine}</div>
      </div>
    );
  }, [propagationPreview]);

  const riskImpactSection = useMemo(() => {
    if (riskImpactMap == null) return null;
    const tone = getOperationalRiskHeadlineTone(riskImpactMap) as MonitoringPresentationTone;
    const accent = changeSummaryAccentBorder(tone);
    const exposureLabel = getOperationalExposureLabel(riskImpactMap.highestExposureLevel);
    const systems = riskImpactMap.nodes.length;
    const fragile = riskImpactMap.mostFragileObjectId ?? "—";
    const headline = truncateOperationalText(riskImpactMap.executiveRiskHeadline, 168);

    return (
      <div
        data-nx="d3-status-hud-risk-impact"
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${accent}`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", color: "rgba(226,232,240,0.92)", marginBottom: 6 }}>
          Risk impact map
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6, alignItems: "center" }}>
          <span style={{ ...toneToBadgeStyle(tone), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            {exposureLabel}
          </span>
          <span style={{ ...toneToBadgeStyle("neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Systems mapped {systems}
          </span>
        </div>
        <div style={{ color: "rgba(148,163,184,0.95)", fontSize: 10, marginBottom: 4 }}>
          Most fragile: <strong style={{ color: "rgba(226,232,240,0.95)" }}>{fragile}</strong>
        </div>
        <div style={{ color: "rgba(226,232,240,0.88)", fontSize: 10 }} title={riskImpactMap.executiveRiskHeadline}>
          {headline}
        </div>
      </div>
    );
  }, [riskImpactMap]);

  const operationalAlertsSection = useMemo(() => {
    if (alertEvaluation == null) return null;
    const tone = getOperationalExecutiveAlertTone(alertEvaluation) as MonitoringPresentationTone;
    const accent = changeSummaryAccentBorder(tone);
    const top = topOperationalAlert(alertEvaluation.alerts);
    const execLine =
      top == null
        ? "No rule-based operational alerts in the current window."
        : truncateOperationalText(getOperationalAlertHeadline(top), 200);

    return (
      <div
        data-nx="d3-status-hud-operational-alerts"
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${accent}`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", color: "rgba(226,232,240,0.92)", marginBottom: 6 }}>
          Operational alerts
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6, alignItems: "center" }}>
          <span style={{ ...toneToBadgeStyle(alertEvaluation.criticalAlertCount > 0 ? "critical" : "neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Critical {alertEvaluation.criticalAlertCount}
          </span>
          <span style={{ ...toneToBadgeStyle(alertEvaluation.warningAlertCount > 0 ? "caution" : "neutral"), borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            Warning+ {alertEvaluation.warningAlertCount}
          </span>
        </div>
        {top ? (
          <div style={{ color: "rgba(148,163,184,0.95)", fontSize: 10, marginBottom: 4 }} title={getOperationalAlertHeadline(top)}>
            Top: <strong style={{ color: "rgba(226,232,240,0.95)" }}>{truncateOperationalText(top.title, 72)}</strong>
          </div>
        ) : null}
        <div style={{ color: "rgba(226,232,240,0.86)", fontSize: 10 }}>{execLine}</div>
      </div>
    );
  }, [alertEvaluation]);

  if (isExecutiveWorkspaceCleanPresentation() && !shouldExposeExecutiveDevSurfaces()) {
    return null;
  }

  if (!isD3MonitoringSnapshotLive(snapshot)) {
    return (
      <div data-nx="d3-status-hud" className={className} style={HUD_OUTER}>
        <div style={{ ...HUD_CARD, color: "rgba(226, 232, 240, 0.88)" }}>
          <div style={{ fontWeight: 700, letterSpacing: "0.02em", marginBottom: 4 }}>D3 monitoring idle</div>
          <div style={{ color: "rgba(148, 163, 184, 0.95)" }}>Connect or upload operational data to begin monitoring.</div>
        </div>
      </div>
    );
  }

  const statusLabel = getMonitoringStatusLabel(snapshot.status);
  const trendLabel = getMonitoringTrendLabel(snapshot.trend);
  const statusTone = getMonitoringStatusTone(snapshot.status);
  const trendTone = getMonitoringTrendTone(snapshot.trend);
  const affectedCount = snapshot.affectedObjectIds.length;

  return (
    <div data-nx="d3-status-hud" className={className} style={HUD_OUTER}>
      <div style={{ ...HUD_CARD, color: "rgba(226, 232, 240, 0.9)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <span style={{ ...toneToBadgeStyle(statusTone), borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>
            {statusLabel}
          </span>
          <span style={toneToMutedStyle(trendTone)}>Trend: {trendLabel}</span>
        </div>
        <div style={{ color: "rgba(148, 163, 184, 0.95)", marginBottom: 4 }}>
          Affected objects: <strong style={{ color: "rgba(226,232,240,0.95)" }}>{affectedCount}</strong>
          {snapshot.topRiskObjectId ? (
            <>
              {" "}
              · Top risk: <strong style={{ color: "rgba(226,232,240,0.95)" }}>{snapshot.topRiskObjectId}</strong>
            </>
          ) : null}
        </div>
        <div style={{ marginBottom: 6, color: "rgba(226,232,240,0.88)" }}>{snapshot.summary}</div>
        <div style={{ color: "rgba(148, 163, 184, 0.98)", fontSize: 10 }}>{snapshot.recommendedFocus}</div>
        {changeSection}
        {propagationSection}
        {riskImpactSection}
        {operationalAlertsSection}
      </div>
    </div>
  );
}
