"use client";

import React from "react";

import type { MrpWorkspaceId } from "../../../lib/ui/mrpWorkspace/mrpWorkspaceLoaderContract.ts";
import { getMrpWorkspaceRegistryEntry } from "../../../lib/ui/mrpWorkspace/mrpWorkspaceRegistry.ts";
import { nx } from "../../ui/nexoraTheme";

export type MrpWorkspaceLoaderShellProps = Readonly<{
  workspaceId: MrpWorkspaceId;
  mountKey: string;
}>;

export function MrpWorkspaceLoaderShell(props: MrpWorkspaceLoaderShellProps): React.ReactElement {
  const entry = getMrpWorkspaceRegistryEntry(props.workspaceId);

  return (
    <div
      data-nx="mrp-workspace-loader-shell"
      data-mrp-workspace-id={props.workspaceId}
      data-mrp-workspace-mount-key={props.mountKey}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        padding: 16,
        gap: 8,
        background: nx.workspacePanelBg,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 800,
          color: nx.text,
        }}
      >
        {entry.title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 500,
          color: nx.muted,
          lineHeight: 1.45,
        }}
      >
        {entry.description}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: nx.lowMuted,
        }}
      >
        Loader mount slot — intelligence not implemented in MRP:3:4
      </p>
    </div>
  );
}

export default MrpWorkspaceLoaderShell;
