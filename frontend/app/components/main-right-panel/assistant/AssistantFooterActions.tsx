"use client";

import React from "react";

import type { ExecutiveWorkspaceId } from "../../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantCommandDock } from "./AssistantCommandDock";

export const ASSISTANT_FOOTER_EXPORT_REPAIRED_DIAGNOSTIC =
  "[ASSISTANT_FOOTER_EXPORT_REPAIRED]" as const;

export type AssistantFooterActionsProps = Readonly<{
  themeMode?: NexoraHudThemeMode;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

/** MRP:12:8 — Assistant footer: Executive Command Dock only (questions moved to support panel). */
export function AssistantFooterActions(props: AssistantFooterActionsProps): React.ReactElement {
  return (
    <div
      data-nx="assistant-footer-actions"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <AssistantCommandDock
        themeMode={props.themeMode}
        onWorkspaceLaunch={props.onWorkspaceLaunch}
      />
    </div>
  );
}
