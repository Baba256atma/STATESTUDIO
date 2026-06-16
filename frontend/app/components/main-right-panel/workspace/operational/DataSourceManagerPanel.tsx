"use client";

import React from "react";

import {
  buildDataSourceManagerSnapshot,
  deleteDataSource,
  refreshDataSource,
  viewDataSource,
} from "../../../../lib/data-sources/dataSourceManagerRuntime.ts";
import type {
  DataSourceManagerAction,
  DataSourceManagerSnapshot,
} from "../../../../lib/data-sources/dataSourceManagerContract.ts";
import type { DataSourceSyncState } from "../../../../lib/data-sources/dataSourceSyncContract.ts";
import {
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type DataSourceManagerPanelProps = Readonly<{
  refreshSignal: number;
  onRegistryChanged?: () => void;
}>;

type ManagerFeedback = Readonly<{
  tone: "idle" | "success" | "error";
  message: string;
}>;

const IDLE_FEEDBACK: ManagerFeedback = Object.freeze({
  tone: "idle",
  message: "View, refresh, or delete registered data source metadata.",
});

const MANAGER_RADIUS = 4;

function managerShellStyle(): React.CSSProperties {
  return {
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: MANAGER_RADIUS,
    background: "var(--nx-bg-panel)",
    padding: `${operationalVisualSpacing.shellPaddingY}px ${operationalVisualSpacing.shellPaddingX}px`,
    display: "flex",
    flexDirection: "column",
    gap: operationalVisualSpacing.sectionGap,
    minWidth: 0,
  };
}

function managerTableStyle(): React.CSSProperties {
  return {
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: MANAGER_RADIUS,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "minmax(140px, 1.4fr) minmax(80px, 0.8fr) minmax(84px, 0.8fr) minmax(96px, 0.9fr) minmax(72px, 0.6fr) minmax(140px, 1fr) minmax(170px, 1fr)",
  };
}

function managerHeaderCellStyle(): React.CSSProperties {
  return {
    background: "var(--nx-bg-control)",
    color: operationalVisualColors.muted,
    borderBottom: `1px solid ${operationalVisualColors.border}`,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    lineHeight: 1.2,
    padding: "9px 10px",
    textTransform: "uppercase",
  };
}

function managerCellStyle(): React.CSSProperties {
  return {
    borderTop: `1px solid ${operationalVisualColors.border}`,
    color: operationalVisualColors.text,
    fontSize: 12,
    lineHeight: 1.35,
    minWidth: 0,
    overflow: "hidden",
    padding: "10px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}

function syncCellStyle(syncState: DataSourceSyncState): React.CSSProperties {
  const color =
    syncState === "healthy"
      ? operationalVisualColors.success
      : syncState === "warning"
        ? operationalVisualColors.warning
        : operationalVisualColors.critical;
  return {
    ...managerCellStyle(),
    color,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}

function managerActionButtonStyle(action: DataSourceManagerAction): React.CSSProperties {
  const danger = action === "delete";
  return {
    border: `1px solid ${danger ? operationalVisualColors.warning : operationalVisualColors.border}`,
    borderRadius: MANAGER_RADIUS,
    background: "var(--nx-bg-control)",
    color: danger ? operationalVisualColors.warning : operationalVisualColors.accent,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "6px 8px",
    textTransform: "uppercase",
  };
}

function feedbackStyle(tone: ManagerFeedback["tone"]): React.CSSProperties {
  const color =
    tone === "success"
      ? operationalVisualColors.success
      : tone === "error"
        ? operationalVisualColors.warning
        : operationalVisualColors.muted;
  return {
    ...operationalCardDetailStyle(),
    color,
    margin: 0,
  };
}

export function DataSourceManagerPanel(props: DataSourceManagerPanelProps): React.ReactElement {
  const [snapshot, setSnapshot] = React.useState<DataSourceManagerSnapshot>(() =>
    buildDataSourceManagerSnapshot()
  );
  const [feedback, setFeedback] = React.useState<ManagerFeedback>(IDLE_FEEDBACK);
  const { onRegistryChanged, refreshSignal } = props;
  const selectedSourceId = snapshot.selectedSource?.sourceId;

  React.useEffect(() => {
    setSnapshot(buildDataSourceManagerSnapshot(selectedSourceId));
  }, [refreshSignal, selectedSourceId]);

  const handleView = React.useCallback((sourceId: string) => {
    const result = viewDataSource(sourceId);
    setSnapshot(result.snapshot);
    setFeedback(Object.freeze({
      tone: result.success ? "success" : "error",
      message: result.success
        ? `Viewing ${result.source?.sourceName ?? "selected source"}.`
        : "Source is no longer available.",
    }));
  }, []);

  const handleRefresh = React.useCallback((sourceId: string) => {
    const result = refreshDataSource(sourceId);
    setSnapshot(result.snapshot);
    setFeedback(Object.freeze({
      tone: result.success ? "success" : "error",
      message: result.success
        ? `${result.source?.sourceName ?? "Source"} refreshed.`
        : "Refresh failed. Source is no longer available.",
    }));
    if (result.success) onRegistryChanged?.();
  }, [onRegistryChanged]);

  const handleDelete = React.useCallback((sourceId: string) => {
    const result = deleteDataSource(sourceId);
    setSnapshot(result.snapshot);
    setFeedback(Object.freeze({
      tone: result.success ? "success" : "error",
      message: result.success
        ? `${result.source?.sourceName ?? "Source"} deleted.`
        : "Delete failed. Source is no longer available.",
    }));
    if (result.success) onRegistryChanged?.();
  }, [onRegistryChanged]);

  return (
    <section
      data-nx="data-source-manager-panel"
      data-ds-manager-runtime="metadata-only"
      aria-label="Data Source Manager"
      style={managerShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <div style={operationalSectionLabelStyle()}>Data Source Manager</div>
        <div style={operationalCardHeadlineStyle("accent")}>
          Registry visible: {snapshot.sourceCount} sources
        </div>
        <p style={feedbackStyle(feedback.tone)}>{feedback.message}</p>
      </header>

      {snapshot.rows.length > 0 ? (
        <div role="table" aria-label="Registered data sources" style={managerTableStyle()}>
          {["Source Name", "Type", "Status", "Sync", "Records", "Last Sync", "Actions"].map((label) => (
            <div key={label} role="columnheader" style={managerHeaderCellStyle()}>
              {label}
            </div>
          ))}

          {snapshot.rows.map((row) => (
            <React.Fragment key={row.sourceId}>
              <div role="cell" title={row.sourceName} style={managerCellStyle()}>
                {row.sourceName}
              </div>
              <div role="cell" style={managerCellStyle()}>
                {row.typeLabel}
              </div>
              <div role="cell" style={managerCellStyle()}>
                {row.statusLabel}
              </div>
              <div role="cell" style={syncCellStyle(row.syncState)}>
                {row.syncLabel}
              </div>
              <div role="cell" style={managerCellStyle()}>
                {row.recordsLabel}
              </div>
              <div role="cell" title={row.lastSyncLabel} style={managerCellStyle()}>
                {row.lastSyncLabel}
              </div>
              <div
                role="cell"
                style={{
                  ...managerCellStyle(),
                  display: "flex",
                  gap: operationalVisualSpacing.fieldGap,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  style={managerActionButtonStyle("view")}
                  onClick={() => handleView(row.sourceId)}
                >
                  View
                </button>
                <button
                  type="button"
                  style={managerActionButtonStyle("refresh")}
                  onClick={() => handleRefresh(row.sourceId)}
                >
                  Refresh
                </button>
                <button
                  type="button"
                  style={managerActionButtonStyle("delete")}
                  onClick={() => handleDelete(row.sourceId)}
                >
                  Delete
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p style={operationalCardDetailStyle()}>
          No data sources registered yet. Upload or register a source to manage metadata here.
        </p>
      )}

      {snapshot.selectedSource ? (
        <aside
          data-nx="data-source-manager-selection"
          style={{
            border: `1px solid ${operationalVisualColors.border}`,
            borderRadius: MANAGER_RADIUS,
            padding: "10px",
            color: operationalVisualColors.muted,
            fontSize: 12,
          }}
        >
          Viewing {snapshot.selectedSource.sourceName} as {snapshot.selectedSource.sourceType}.
        </aside>
      ) : null}
    </section>
  );
}

export default DataSourceManagerPanel;

