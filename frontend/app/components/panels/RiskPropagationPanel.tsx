"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";
import type { RiskPanelData } from "../../lib/panels/panelDataContract";
import { dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";

function prettyObjectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function RiskPropagationPanel({
  risk,
  showRiskFlowEntry = false,
  onOpenRiskFlow = null,
}: {
  risk: RiskPanelData | null | undefined;
  showRiskFlowEntry?: boolean;
  onOpenRiskFlow?: (() => void) | null;
}) {
  const edges = Array.isArray(risk?.edges) ? risk.edges : [];
  const drivers = Array.isArray(risk?.drivers) ? risk.drivers : [];
  const sources = Array.isArray(risk?.sources) ? risk.sources : [];
  const summary = typeof risk?.summary === "string" && risk.summary.trim().length > 0 ? risk.summary : null;
  const level =
    typeof risk?.level === "string" && risk.level.trim().length > 0
      ? risk.level
      : typeof risk?.risk_level === "string" && risk.risk_level.trim().length > 0
        ? risk.risk_level
        : null;
  const hasThinRenderableRisk = edges.length > 0 || drivers.length > 0 || sources.length > 0 || Boolean(summary) || Boolean(level);
  const showRiskFlowCta = showRiskFlowEntry && typeof onOpenRiskFlow === "function";

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.warn("[Nexora][RiskFlowAudit] payload_received", {
      hasThinRenderableRisk,
      edgesCount: edges.length,
      driversCount: drivers.length,
      sourcesCount: sources.length,
      hasSummary: Boolean(summary),
      hasLevel: Boolean(level),
    });
    if (showRiskFlowCta) {
      console.warn("[Nexora][RiskFlowAudit] flow_visible", {
        hasThinRenderableRisk,
        edgesCount: edges.length,
        driversCount: drivers.length,
        sourcesCount: sources.length,
      });
    } else {
      console.warn("[Nexora][RiskFlowAudit] flow_hidden_reason", {
        reason: !showRiskFlowEntry ? "entry_disabled" : "missing_open_handler",
        hasThinRenderableRisk,
      });
    }
    console.warn("[Nexora][PanelLifecycle] mounted", {
      panel: "risk_or_fragility",
      readiness: edges.length > 0 ? "full" : hasThinRenderableRisk ? "thin" : "empty",
      shape: {
        edgesCount: edges.length,
        driversCount: drivers.length,
        sourcesCount: sources.length,
        hasSummary: Boolean(summary),
        hasLevel: Boolean(level),
      },
    });
    return () => {
      console.warn("[Nexora][PanelLifecycle] unmounted", {
        panel: "risk_or_fragility",
      });
    };
  }, [drivers.length, edges.length, hasThinRenderableRisk, level, showRiskFlowCta, showRiskFlowEntry, sources.length, summary]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!hasThinRenderableRisk) return;
    if (edges.length > 0) return;
    console.warn("[Nexora][PanelLifecycle] thin_data_received", {
      panel: "risk_or_fragility",
      readiness: "thin",
      shape: {
        edgesCount: edges.length,
        driversCount: drivers.length,
        sourcesCount: sources.length,
        hasSummary: Boolean(summary),
        hasLevel: Boolean(level),
      },
    });
  }, [drivers.length, edges.length, hasThinRenderableRisk, level, sources.length, summary]);

  dedupePanelConsoleTrace("PanelComponent", "risk_or_fragility", "main", {
    meaningfulData: hasThinRenderableRisk,
    driversCount: drivers.length,
    edgesCount: edges.length,
    sourcesCount: sources.length,
    hasSummary: Boolean(summary),
  });
  if (!edges.length && !drivers.length && !sources.length && !summary && !level) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][PanelBlankGuard] triggered", {
        panel: "risk_or_fragility",
        reason: "no_risk_details",
      });
      console.warn("[Nexora][PanelLifecycle] blank_or_fallback_render", {
        panel: "risk_or_fragility",
        readiness: "empty",
        shape: {
          edgesCount: 0,
          driversCount: 0,
          sourcesCount: 0,
          hasSummary: false,
          hasLevel: false,
        },
      });
    }
    return <EmptyStateCard text="Risk changes will appear after a disruption is simulated." />;
  }

  if (!edges.length && (summary || level || drivers.length || sources.length)) {
    dedupePanelConsoleTrace("PanelThinRender", "risk_or_fragility", "thin", {
      reason: "summary_or_driver_level_render",
      driversCount: drivers.length,
      sourcesCount: sources.length,
      hasSummary: Boolean(summary),
      hasLevel: Boolean(level),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            <div style={{ fontSize: 11, color: nx.muted }}>
              Inspect propagation, drivers, and downstream exposure.
            </div>
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
      {edges[0] ? (
        <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
          Risk summary: {prettyObjectName(String(edges[0]?.from ?? "source"))} risk is increasing and propagating to{" "}
          {prettyObjectName(String(edges[0]?.to ?? "target"))}.
        </div>
      ) : null}
      {summary ? <div style={{ fontSize: 11, color: nx.muted }}>{summary}</div> : null}
      {!edges.length && level ? (
        <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
          Current risk posture: {level}
          {sources.length ? ` across ${sources.length} source${sources.length === 1 ? "" : "s"}.` : "."}
        </div>
      ) : null}
      {!edges.length && drivers.length ? (
        <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
          Active drivers: {drivers.slice(0, 4).map((driver) => String((driver as { label?: unknown; id?: unknown })?.label ?? (driver as { id?: unknown })?.id ?? driver)).join(", ")}
        </div>
      ) : null}
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
            {prettyObjectName(String(e.from ?? "unknown"))} {"\u2192"} {prettyObjectName(String(e.to ?? "unknown"))}
          </div>
          <div style={{ fontSize: 11, color: nx.muted }}>weight: {Number(e.weight ?? 0).toFixed(3)}</div>
        </div>
      ))}
    </div>
  );
}
