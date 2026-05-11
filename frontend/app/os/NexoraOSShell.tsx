"use client";

import React from "react";

import { NexoraWorkspaceManager } from "./NexoraWorkspaceManager.tsx";
import { createDefaultNexoraOSState, switchNexoraWorkspace } from "./NexoraOSState.ts";

export type NexoraOSShellProps = {
  children: React.ReactNode;
};

export function NexoraOSShell({ children }: NexoraOSShellProps): React.ReactElement {
  const [state, setState] = React.useState(() => createDefaultNexoraOSState());

  const handleSwitchWorkspace = React.useCallback((workspaceId: string) => {
    setState((prev) => switchNexoraWorkspace(prev, workspaceId));
  }, []);

  return (
    <div data-nx="nexora-os-shell" style={{ position: "relative", minWidth: 0, minHeight: 0, flex: 1 }}>
      {children}
      <NexoraWorkspaceManager state={state} onSwitchWorkspace={handleSwitchWorkspace} />
    </div>
  );
}

export default NexoraOSShell;
