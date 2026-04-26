"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { dedupeNexoraDevLog, dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";
import { logPanelOnce } from "../../lib/debug/panelLogSignature";
import { resolveConflictReadiness } from "../../lib/panels/panelDataReadiness";
import { buildConflictIntelligence, logPanelIntelligence } from "../../lib/intelligence/panelIntelligence";
import { buildConflictDecisionSet } from "../../lib/decision/decisionEngine";
import { PanelDecisionSetSection } from "./PanelDecisionSetSection";
import { RightPanelFallback } from "../right-panel/RightPanelFallback";

type ConflictItem = {
  a?: string;
  b?: string;
  score?: number;
  reason?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeConflictItem(input: unknown): ConflictItem | null {
  const record = asRecord(input);
  if (!record) return null;

  const left = getString(record.a) ?? getString(record.from) ?? getString(record.source);
  const right = getString(record.b) ?? getString(record.to) ?? getString(record.target);
  const score = getNumber(record.score) ?? getNumber(record.weight) ?? 0;
  const reason = getString(record.reason) ?? getString(record.summary);

  if (!left && !right && !reason) return null;

  return {
    a: left ?? "unknown",
    b: right ?? "unknown",
    score,
    reason: reason ?? "",
  };
}

function normalizeConflicts(input: unknown): ConflictItem[] {
  const normalizeArray = (value: unknown[]) =>
    value
      .map((entry) => normalizeConflictItem(entry))
      .filter((entry): entry is ConflictItem => Boolean(entry));

  if (Array.isArray(input)) {
    return normalizeArray(input);
  }

  const record = asRecord(input);
  if (!record) return [];

  if (Array.isArray(record.conflicts)) {
    return normalizeArray(record.conflicts);
  }

  if (Array.isArray(record.edges)) {
    return normalizeArray(record.edges);
  }

  if (Array.isArray(record.tradeoffs)) {
    return normalizeArray(record.tradeoffs);
  }

  if (Array.isArray(record.tensions)) {
    return normalizeArray(record.tensions);
  }

  if (Array.isArray(record.conflict_points)) {
    return normalizeArray(record.conflict_points);
  }

  return [];
}

export default function ConflictMapPanel({
  conflicts,
}: {
  conflicts: ConflictItem[] | Record<string, unknown> | null | undefined;
}) {
  const DEBUG_PANEL_TRACE = process.env.NODE_ENV !== "production";
  const normalizedConflicts = normalizeConflicts(conflicts);
  const conflictRecord = asRecord(conflicts);
  const summary =
    getString(conflictRecord?.summary) ??
    getString(conflictRecord?.headline) ??
    getString(conflictRecord?.posture);
  const inputType =
    Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty";
  const readiness = resolveConflictReadiness(conflicts);

  React.useEffect(() => {
    logPanelOnce("[Nexora][PanelDataState]", {
      panel: "conflict",
      readiness,
      shape: {
        inputType,
        normalizedCount: normalizedConflicts.length,
        hasSummary: Boolean(summary),
      },
    });
  }, [readiness, inputType, normalizedConflicts.length, summary]);

  if (readiness === "loading") {
    return <RightPanelFallback mode="loading" embedded />;
  }
  if (readiness === "empty") {
    return <RightPanelFallback mode="empty" embedded message="No active conflicts detected." />;
  }

  if (DEBUG_PANEL_TRACE) {
    dedupePanelConsoleTrace("PanelComponent", "conflict", "main", {
      meaningfulData: true,
      inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
      normalizedCount: normalizedConflicts.length,
      hasSummary: Boolean(summary),
    });
    dedupeNexoraDevLog("[Nexora][ConflictPanelData]", "shape", {
      inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
      normalizedCount: normalizedConflicts.length,
    });
  }

  const intelligence = React.useMemo(
    () => buildConflictIntelligence({ summary, items: normalizedConflicts }),
    [summary, normalizedConflicts]
  );

  React.useEffect(() => {
    logPanelIntelligence("conflict", intelligence);
  }, [intelligence]);

  const decisionSet = React.useMemo(
    () =>
      buildConflictDecisionSet({
        summary,
        conflictCount: normalizedConflicts.length,
      }),
    [summary, normalizedConflicts.length]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...softCardStyle, border: "1px solid rgba(251,191,36,0.25)", padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Primary insight
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 15,
            fontWeight: 800,
            color: "#fef3c7",
            lineHeight: 1.35,
            maxHeight: "4.6em",
            overflow: "hidden",
          }}
        >
          {intelligence.primary}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: nx.muted,
            opacity: 0.78,
            lineHeight: 1.45,
            maxHeight: "4.5em",
            overflow: "hidden",
          }}
        >
          {intelligence.implication}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: nx.text, lineHeight: 1.45 }}>
          <strong>Recommended action:</strong> {intelligence.action}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: nx.lowMuted, opacity: 0.72 }}>
          Confidence: {(intelligence.confidence * 100).toFixed(0)}%
        </div>
      </div>

      <PanelDecisionSetSection view="conflict" decisionSet={decisionSet} />

      <details style={{ borderRadius: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: nx.muted }}>
          Details: posture summary & tension list
        </summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {summary ? (
            <div
              style={{
                ...softCardStyle,
                padding: 10,
                color: nx.text,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {summary}
            </div>
          ) : null}
          {normalizedConflicts.map((c, i) => (
            <div
              key={i}
              style={{
                ...cardStyle,
                padding: 10,
                background: nx.bgPanelSoft,
              }}
            >
              <div style={{ fontSize: 12, color: nx.text, fontWeight: 600 }}>
                {String(c?.a ?? "unknown")} {"\u2194"} {String(c?.b ?? "unknown")}
              </div>
              <div style={{ fontSize: 11, color: nx.muted }}>{String(c?.reason ?? "")}</div>
              <div style={{ fontSize: 10, color: nx.lowMuted }}>
                score: {Number(c?.score ?? 0).toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
