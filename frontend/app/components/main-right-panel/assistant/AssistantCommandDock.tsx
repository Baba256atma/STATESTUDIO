"use client";

import React, { useEffect } from "react";

import type { ExecutiveWorkspaceId } from "../../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  listExecutiveCommandDockVisibleCommands,
  type AssistantCommandDockAction,
} from "../../../lib/assistant/assistantCommandDockContract";
import {
  traceExecutiveCommandDockAction,
  traceExecutiveCommandDockMounted,
} from "../../../lib/assistant/assistantCommandDockDiagnostics";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantCommandDockProps = Readonly<{
  themeMode?: NexoraHudThemeMode;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

export function AssistantCommandDock(props: AssistantCommandDockProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const commands = listExecutiveCommandDockVisibleCommands();

  useEffect(() => {
    traceExecutiveCommandDockMounted();
  }, []);

  const handleCommand = (action: AssistantCommandDockAction, workspaceId: ExecutiveWorkspaceId | null) => {
    if (!workspaceId) return;
    traceExecutiveCommandDockAction(action);
    props.onWorkspaceLaunch?.(workspaceId);
  };

  return (
    <div
      data-nx="executive-command-dock"
      role="toolbar"
      aria-label="Executive command dock"
      style={{
        flexShrink: 0,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 6,
        padding: "8px 10px 10px",
        borderTop: `1px solid ${theme.shellBorder}`,
        background: theme.headerBackground,
      }}
    >
      {commands.map((command) => {
        const disabled = command.disabled === true || !command.workspaceId;
        return (
          <button
            key={command.id}
            type="button"
            disabled={disabled}
            data-nx="executive-command-dock-button"
            data-nx-command={command.id}
            data-nx-priority={command.priority}
            title={disabled ? `${command.label} (coming soon)` : command.label}
            aria-label={command.label}
            onClick={() => handleCommand(command.id, command.workspaceId)}
            style={{
              minWidth: 0,
              height: 34,
              padding: "0 8px",
              borderRadius: 10,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: disabled ? theme.textMuted : theme.text,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.55 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>
              {command.icon}
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {command.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AssistantCommandDock;
