"use client";

import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import { NexoraWorkspaceDial } from "./workspace/NexoraWorkspaceDial";

type Props = {
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly onWorkspaceChange: (workspace: NexoraMVPWorkspaceKind) => void;
};

/**
 * NEX-MVP:5 — Workspace Dial mount in the Stage control zone (lower-right).
 */
export function NexoraWorkspaceDialMount({
  activeWorkspace,
  onWorkspaceChange,
}: Props) {
  return (
    <div
      data-testid="nexora-workspace-dial-mount"
      data-mvp-mount="workspace-dial"
      data-nex-mvp="5"
      data-active-workspace={activeWorkspace}
      aria-label="Workspace Dial"
      style={{
        position: "absolute",
        right: "0.85rem",
        bottom: "0.85rem",
        zIndex: 8,
        padding: "0.4rem 0.45rem 0.5rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(10, 16, 26, 0.72)",
        boxShadow: cockpit.elevation.raised,
        backdropFilter: "blur(8px)",
        pointerEvents: "auto",
        maxWidth: "min(10.5rem, calc(100% - 1.5rem))",
        opacity: 0.92,
      }}
    >
      <NexoraWorkspaceDial
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={onWorkspaceChange}
      />
    </div>
  );
}
