"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { formatDiagnosticLocation } from "../../lib/pipeline/pipelinePageFormatters";
import type {
  PipelinePageViewModel,
  PipelineUiDiagnostic,
} from "../../lib/pipeline/pipelinePageTypes";

export interface PipelineDiagnosticsPanelProps {
  readonly viewModel: PipelinePageViewModel;
  /** Optional display filter; full counts still come from viewModel.diagnosticCounts. */
  readonly visibleDiagnostics?: PipelinePageViewModel["diagnostics"];
}

type Severity = "Blocking" | "Error" | "Warning" | "Info";
type ParserDiagnosticView = PipelinePageViewModel["diagnostics"][number];

const severityOrder: readonly Severity[] = Object.freeze([
  "Blocking",
  "Error",
  "Warning",
  "Info",
]);

const severityColor = (severity: Severity): string => {
  switch (severity) {
    case "Blocking":
    case "Error":
      return nx.risk;
    case "Warning":
      return nx.warning;
    default:
      return nx.muted;
  }
};

export function PipelineDiagnosticsPanel({
  viewModel,
  visibleDiagnostics,
}: PipelineDiagnosticsPanelProps) {
  const diagnostics = visibleDiagnostics ?? viewModel.diagnostics;
  const parserBySeverity = groupParser(diagnostics);
  const uiBySeverity = groupUi(viewModel.uiDiagnostics);
  const displayedTotal =
    diagnostics.length + viewModel.uiDiagnostics.length;
  const fullTotal = viewModel.diagnosticCounts.total;

  return (
    <section
      id="pipeline-diagnostics"
      aria-label="Diagnostics"
      tabIndex={-1}
      style={{ ...softCardStyle, padding: 16 }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: 15, color: nx.textStrong }}>Diagnostics</h2>
      {fullTotal === 0 ? (
        <p style={{ margin: 0, color: nx.muted, fontSize: 13 }}>No diagnostics.</p>
      ) : displayedTotal === 0 ? (
        <p role="status" style={{ margin: 0, color: nx.muted, fontSize: 13 }}>
          No diagnostics match the current filters. Full count remains {fullTotal}.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {severityOrder.map((severity) => {
            const items = [...(parserBySeverity.get(severity) ?? []), ...(uiBySeverity.get(severity) ?? [])];
            if (items.length === 0) {
              return null;
            }
            return (
              <div key={severity}>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    color: severityColor(severity),
                    fontWeight: 700,
                  }}
                >
                  {severity} ({items.length})
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                  {items.map((item) => (
                    <li key={item.id} style={{ fontSize: 13, color: nx.text }}>
                      <strong style={{ color: nx.textStrong }}>{item.code}</strong>
                      {" — "}
                      {item.message}
                      {item.meta ? (
                        <span style={{ color: nx.muted }}> ({item.meta})</span>
                      ) : null}
                      {item.recoverable !== null ? (
                        <span style={{ color: nx.muted }}>
                          {" "}
                          · {item.recoverable ? "recoverable" : "not recoverable"}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

interface ListedDiagnostic {
  readonly id: string;
  readonly code: string;
  readonly message: string;
  readonly meta: string;
  readonly recoverable: boolean | null;
}

function groupParser(
  diagnostics: readonly ParserDiagnosticView[],
): Map<Severity, ListedDiagnostic[]> {
  const map = new Map<Severity, ListedDiagnostic[]>();
  for (const d of diagnostics) {
    const severity = d.severity as Severity;
    const list = map.get(severity) ?? [];
    list.push({
      id: d.diagnosticId,
      code: d.code,
      message: d.message,
      meta: formatDiagnosticLocation(d),
      recoverable: d.recoverable,
    });
    map.set(severity, list);
  }
  return map;
}

function groupUi(
  diagnostics: readonly PipelineUiDiagnostic[],
): Map<Severity, ListedDiagnostic[]> {
  const map = new Map<Severity, ListedDiagnostic[]>();
  for (const d of diagnostics) {
    const list = map.get(d.severity) ?? [];
    list.push({
      id: d.diagnosticId,
      code: d.code,
      message: d.message,
      meta: d.field ? `field ${d.field}` : "",
      recoverable: null,
    });
    map.set(d.severity, list);
  }
  return map;
}
