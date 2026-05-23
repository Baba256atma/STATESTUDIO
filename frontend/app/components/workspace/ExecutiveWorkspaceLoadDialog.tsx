"use client";

import React from "react";

import type { SavedWorkspaceSummary } from "../../lib/persistence/workspacePersistenceTypes";
import { listSavedWorkspaces } from "../../lib/persistence/workspacePersistenceRuntime";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";

export type ExecutiveWorkspaceLoadDialogProps = {
  open: boolean;
  themeMode?: NexoraHudThemeMode;
  onCancel: () => void;
  onConfirm: (workspaceId: string) => void;
};

export function ExecutiveWorkspaceLoadDialog(
  props: ExecutiveWorkspaceLoadDialogProps
): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const [workspaces, setWorkspaces] = React.useState<SavedWorkspaceSummary[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!props.open) {
      setSelectedId(null);
      return;
    }
    setWorkspaces(listSavedWorkspaces());
  }, [props.open]);

  const selected = workspaces.find((workspace) => workspace.id === selectedId) ?? null;

  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Load Workspace"
      data-nx="executive-workspace-load-dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 450,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "color-mix(in srgb, var(--nx-bg-app) 35%, rgba(0,0,0,0.45))",
        backdropFilter: "blur(8px)",
      }}
      onPointerDown={props.onCancel}
    >
      <div
        style={{
          ...sceneHudShellStyle(tokens),
          width: "min(640px, 96vw)",
          maxHeight: "min(78vh, 680px)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 12,
          padding: 14,
          overflow: "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
            Workspace Persistence
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>Load Workspace</div>
        </header>

        <div style={{ minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, overflow: "hidden" }}>
          <div style={{ minHeight: 0, overflowY: "auto", display: "grid", gap: 8 }}>
            {workspaces.length === 0 ? (
              <div style={{ fontSize: 12, color: tokens.textSecondary }}>No saved workspaces yet.</div>
            ) : (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  aria-pressed={selectedId === workspace.id}
                  onClick={() => setSelectedId(workspace.id)}
                  style={{
                    ...sceneHudControlButtonStyle(tokens),
                    textAlign: "left",
                    padding: "10px 12px",
                    opacity: selectedId === workspace.id ? 1 : 0.82,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: tokens.textPrimary }}>{workspace.name}</div>
                  <div style={{ fontSize: 10, color: tokens.textSecondary, marginTop: 3 }}>
                    {workspace.objectCount} objects · {workspace.relationshipCount} relationships
                  </div>
                </button>
              ))
            )}
          </div>

          <aside
            style={{
              borderRadius: 12,
              border: `1px solid ${tokens.panelBorder}`,
              background: tokens.controlBackground,
              padding: 12,
              display: "grid",
              gap: 8,
              alignContent: "start",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label }}>
              Preview
            </div>
            {selected ? (
              <>
                <PreviewRow label="Name" value={selected.name} tokens={tokens} />
                <PreviewRow label="Objects" value={String(selected.objectCount)} tokens={tokens} />
                <PreviewRow label="Relationships" value={String(selected.relationshipCount)} tokens={tokens} />
                <PreviewRow label="Created" value={new Date(selected.createdAt).toLocaleString()} tokens={tokens} />
                <PreviewRow label="Modified" value={new Date(selected.updatedAt).toLocaleString()} tokens={tokens} />
              </>
            ) : (
              <div style={{ fontSize: 11, color: tokens.textSecondary, lineHeight: 1.45 }}>
                Select a saved workspace to preview before restoring.
              </div>
            )}
          </aside>
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => selectedId && props.onConfirm(selectedId)}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: selectedId ? 1 : 0.5,
              cursor: selectedId ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              background: tokens.chipBackground,
            }}
          >
            Restore Workspace
          </button>
        </footer>
      </div>
    </div>
  );
}

function PreviewRow(props: {
  label: string;
  value: string;
  tokens: ReturnType<typeof resolveSceneThemeTokens>;
}): React.ReactElement {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: props.tokens.textSecondary }}>{props.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: props.tokens.textPrimary }}>{props.value}</span>
    </div>
  );
}

export default ExecutiveWorkspaceLoadDialog;
