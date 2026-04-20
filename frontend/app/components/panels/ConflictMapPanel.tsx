"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";
import { dedupeNexoraDevLog, dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";

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
  const hasThinRenderableConflict = normalizedConflicts.length > 0 || Boolean(summary);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.warn("[Nexora][PanelLifecycle] mounted", {
      panel: "conflict",
      readiness: normalizedConflicts.length > 0 ? "full" : hasThinRenderableConflict ? "thin" : "empty",
      shape: {
        inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
        normalizedCount: normalizedConflicts.length,
        hasSummary: Boolean(summary),
      },
    });
    return () => {
      console.warn("[Nexora][PanelLifecycle] unmounted", {
        panel: "conflict",
      });
    };
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!hasThinRenderableConflict) return;
    if (normalizedConflicts.length > 0) return;
    console.warn("[Nexora][PanelLifecycle] thin_data_received", {
      panel: "conflict",
      readiness: "thin",
      shape: {
        inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
        normalizedCount: normalizedConflicts.length,
        hasSummary: Boolean(summary),
      },
    });
  }, [conflicts, hasThinRenderableConflict, normalizedConflicts.length, summary]);

  if (DEBUG_PANEL_TRACE) {
    dedupePanelConsoleTrace("PanelComponent", "conflict", "main", {
      meaningfulData: hasThinRenderableConflict,
      inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
      normalizedCount: normalizedConflicts.length,
      hasSummary: Boolean(summary),
    });
    dedupeNexoraDevLog("[Nexora][ConflictPanelData]", "shape", {
      inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
      normalizedCount: normalizedConflicts.length,
    });
  }

  if (normalizedConflicts.length === 0 && !summary) {
    if (DEBUG_PANEL_TRACE) {
      console.warn("[Nexora][PanelBlankGuard] triggered", {
        panel: "conflict",
        reason: "no_conflict_items_or_summary",
      });
      console.warn("[Nexora][PanelLifecycle] blank_or_fallback_render", {
        panel: "conflict",
        readiness: "empty",
        shape: {
          inputType: Array.isArray(conflicts) ? "array" : conflicts && typeof conflicts === "object" ? "object" : "empty",
          normalizedCount: 0,
          hasSummary: false,
        },
      });
    }
    return <EmptyStateCard text="No active conflicts detected." />;
  }

  if (DEBUG_PANEL_TRACE && normalizedConflicts.length === 0 && summary) {
    dedupePanelConsoleTrace("PanelThinRender", "conflict", "summary_only", {
      reason: "summary_only_conflict",
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
          <div style={{ fontSize: 11, color: nx.muted }}>
            {String(c?.reason ?? "")}
          </div>
          <div style={{ fontSize: 10, color: nx.lowMuted }}>
            score: {Number(c?.score ?? 0).toFixed(3)}
          </div>
        </div>
      ))}
    </div>
  );
}
