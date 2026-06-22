"use client";

import React from "react";

import { uploadWorkspaceCsv } from "../../../../lib/workspace/workspaceCsvUploadRuntime.ts";
import {
  buildWorkspaceDataSourcePanelSnapshot,
  notifyWorkspaceDataSourcePanelClosed,
  notifyWorkspaceDataSourcePanelOpened,
  refreshWorkspaceDataSourcePanelMetadata,
  removeWorkspaceDataSourcePanelSource,
  selectWorkspaceDataSourcePanelSource,
  type WorkspaceDataSourcePanelSnapshot,
} from "../../../../lib/workspace/workspaceDataSourcePanelRuntime.ts";
import {
  getWorkspaceDataSourceRegistryVersion,
  subscribeWorkspaceDataSourceRegistry,
} from "../../../../lib/workspace/workspaceDataSourceRegistry.ts";
import {
  getActiveWorkspaceId,
  subscribeWorkspaceRegistry,
} from "../../../../lib/workspace/workspaceRegistryStore.ts";
import {
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalCardStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type WorkspaceDataSourcePanelProps = Readonly<{
  refreshSignal?: number;
  onRegistryChanged?: () => void;
}>;

type PanelFeedback = Readonly<{
  tone: "idle" | "success" | "error";
  message: string;
}>;

const IDLE_FEEDBACK: PanelFeedback = Object.freeze({
  tone: "idle",
  message: "Manage CSV data sources for the active workspace.",
});

const PANEL_RADIUS = 4;

function panelShellStyle(): React.CSSProperties {
  return {
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: "var(--nx-bg-panel)",
    padding: `${operationalVisualSpacing.shellPaddingY}px ${operationalVisualSpacing.shellPaddingX}px`,
    display: "flex",
    flexDirection: "column",
    gap: operationalVisualSpacing.sectionGap,
    minWidth: 0,
  };
}

function panelDividerStyle(): React.CSSProperties {
  return {
    borderTop: `1px solid ${operationalVisualColors.border}`,
    margin: 0,
  };
}

function panelButtonStyle(options?: { danger?: boolean; disabled?: boolean }): React.CSSProperties {
  const danger = options?.danger === true;
  const disabled = options?.disabled === true;
  return {
    border: `1px solid ${danger ? operationalVisualColors.warning : operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: disabled ? "var(--nx-bg-muted)" : "var(--nx-bg-control)",
    color: disabled
      ? operationalVisualColors.muted
      : danger
        ? operationalVisualColors.warning
        : operationalVisualColors.accent,
    cursor: disabled ? "default" : "pointer",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "8px 12px",
    textTransform: "uppercase",
  };
}

function listItemStyle(selected: boolean): React.CSSProperties {
  return {
    border: `1px solid ${selected ? operationalVisualColors.accent : operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: selected ? "var(--nx-bg-control)" : "transparent",
    color: operationalVisualColors.text,
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1.4,
    padding: "10px 12px",
    textAlign: "left",
    width: "100%",
  };
}

function feedbackStyle(tone: PanelFeedback["tone"]): React.CSSProperties {
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

function metadataValueStyle(): React.CSSProperties {
  return {
    color: operationalVisualColors.text,
    fontSize: 12,
    lineHeight: 1.45,
  };
}

function metadataLabelStyle(): React.CSSProperties {
  return {
    color: operationalVisualColors.muted,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

function useWorkspaceDataSourcePanelSnapshot(refreshSignal = 0): WorkspaceDataSourcePanelSnapshot {
  const registryVersion = React.useSyncExternalStore(
    subscribeWorkspaceDataSourceRegistry,
    getWorkspaceDataSourceRegistryVersion,
    () => 0
  );
  const activeWorkspaceId = React.useSyncExternalStore(
    subscribeWorkspaceRegistry,
    () => getActiveWorkspaceId(),
    () => null
  );

  return React.useMemo(
    () => buildWorkspaceDataSourcePanelSnapshot(activeWorkspaceId),
    [activeWorkspaceId, registryVersion, refreshSignal]
  );
}

export function WorkspaceDataSourcePanel(props: WorkspaceDataSourcePanelProps): React.ReactElement {
  const snapshot = useWorkspaceDataSourcePanelSnapshot(props.refreshSignal ?? 0);
  const [feedback, setFeedback] = React.useState<PanelFeedback>(IDLE_FEEDBACK);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const selectedSource = snapshot.selectedSource;

  React.useEffect(() => {
    notifyWorkspaceDataSourcePanelOpened(snapshot.workspaceId);
    return () => {
      notifyWorkspaceDataSourcePanelClosed(snapshot.workspaceId);
    };
  }, [snapshot.workspaceId]);

  const handleSelect = React.useCallback(
    (dataSourceId: string) => {
      if (!snapshot.workspaceId) return;
      const result = selectWorkspaceDataSourcePanelSource(snapshot.workspaceId, dataSourceId);
      setFeedback(Object.freeze({
        tone: result.success ? "success" : "error",
        message: result.message,
      }));
    },
    [snapshot.workspaceId]
  );

  const handleRemove = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const result = removeWorkspaceDataSourcePanelSource(
      snapshot.workspaceId,
      snapshot.selectedDataSourceId
    );
    setFeedback(Object.freeze({
      tone: result.success ? "success" : "error",
      message: result.message,
    }));
    if (result.success) props.onRegistryChanged?.();
  }, [props, snapshot.selectedDataSourceId, snapshot.workspaceId]);

  const handleRefresh = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const result = refreshWorkspaceDataSourcePanelMetadata(
      snapshot.workspaceId,
      snapshot.selectedDataSourceId
    );
    setFeedback(Object.freeze({
      tone: result.success ? "success" : "error",
      message: result.message,
    }));
    if (result.success) props.onRegistryChanged?.();
  }, [props, snapshot.selectedDataSourceId, snapshot.workspaceId]);

  const handleAddCsvClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      event.target.value = "";
      if (!file || !snapshot.workspaceId) return;

      setUploading(true);
      setFeedback(Object.freeze({ tone: "idle", message: "Uploading CSV..." }));
      const result = await uploadWorkspaceCsv(file, snapshot.workspaceId);
      setUploading(false);

      if (!result.success || !result.dataSource) {
        setFeedback(Object.freeze({
          tone: "error",
          message: result.message,
        }));
        return;
      }

      selectWorkspaceDataSourcePanelSource(snapshot.workspaceId, result.dataSource.dataSourceId);
      setFeedback(Object.freeze({
        tone: "success",
        message: result.message,
      }));
      props.onRegistryChanged?.();
    },
    [props, snapshot.workspaceId]
  );

  const hasSelection = Boolean(snapshot.selectedDataSourceId);
  const actionsDisabled = uploading || !snapshot.workspaceId;

  return (
    <section
      data-nx="workspace-data-source-panel"
      data-workspace-data-source-panel="true"
      aria-label="Data Sources"
      style={panelShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <div style={operationalSectionLabelStyle()}>Data Sources</div>
        <div style={operationalCardHeadlineStyle("accent")}>
          {snapshot.rows.length} source{snapshot.rows.length === 1 ? "" : "s"} in workspace
        </div>
        <p style={feedbackStyle(feedback.tone)}>{feedback.message}</p>
      </header>

      <hr style={panelDividerStyle()} />

      {snapshot.rows.length > 0 ? (
        <div
          role="listbox"
          aria-label="Workspace data sources"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: operationalVisualSpacing.fieldGap,
          }}
        >
          {snapshot.rows.map((row) => {
            const selected = row.dataSourceId === snapshot.selectedDataSourceId;
            return (
              <button
                key={row.dataSourceId}
                type="button"
                role="option"
                aria-selected={selected}
                style={listItemStyle(selected)}
                onClick={() => handleSelect(row.dataSourceId)}
              >
                {row.fileName}
              </button>
            );
          })}
        </div>
      ) : (
        <p style={operationalCardDetailStyle()}>No data sources registered for this workspace yet.</p>
      )}

      <hr style={panelDividerStyle()} />

      {selectedSource ? (
        <aside
          aria-label="Selected data source metadata"
          style={{
            ...operationalCardStyle("neutral"),
            display: "grid",
            gap: operationalVisualSpacing.fieldGap,
          }}
        >
          <div style={metadataLabelStyle()}>Selected Source</div>
          <div style={operationalCardHeadlineStyle("accent")}>{selectedSource.fileName}</div>
          <div style={metadataValueStyle()}>Status: {selectedSource.statusLabel}</div>
          <div style={metadataValueStyle()}>
            Rows: {selectedSource.rowCount ?? "—"} · Columns: {selectedSource.columnCount ?? "—"}
          </div>
          <div style={metadataValueStyle()}>
            Size: {selectedSource.fileSize ?? "—"} bytes
          </div>
          <div style={metadataValueStyle()}>
            Uploaded: {selectedSource.uploadTime ?? selectedSource.updatedAt}
          </div>
        </aside>
      ) : (
        <p style={operationalCardDetailStyle()}>Select a data source to inspect metadata.</p>
      )}

      <div
        style={{
          display: "flex",
          gap: operationalVisualSpacing.fieldGap,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          style={panelButtonStyle({ disabled: actionsDisabled })}
          disabled={actionsDisabled}
          onClick={handleAddCsvClick}
        >
          {uploading ? "Uploading..." : "Add CSV"}
        </button>
        <button
          type="button"
          style={panelButtonStyle({ danger: true, disabled: actionsDisabled || !hasSelection })}
          disabled={actionsDisabled || !hasSelection}
          onClick={handleRemove}
        >
          Remove
        </button>
        <button
          type="button"
          style={panelButtonStyle({ disabled: actionsDisabled || !hasSelection })}
          disabled={actionsDisabled || !hasSelection}
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv,application/csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-hidden
      />
    </section>
  );
}

export default WorkspaceDataSourcePanel;
