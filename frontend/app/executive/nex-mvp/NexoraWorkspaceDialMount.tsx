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
      data-ux1-compact="true"
      aria-label="Workspace Dial"
      style={{
        position: "absolute",
        right: "0.85rem",
        bottom: "0.85rem",
        zIndex: 8,
        pointerEvents: "auto",
        maxWidth: "min(10.5rem, calc(100% - 1.5rem))",
      }}
    >
      <details
        data-testid="nexora-workspace-dial-disclosure"
        style={{
          padding: "0.28rem 0.4rem 0.32rem",
          borderRadius: cockpit.radius.md,
          border: `1px solid ${cockpit.border}`,
          background: "rgba(10, 16, 26, 0.62)",
          boxShadow: cockpit.elevation.raised,
          backdropFilter: "blur(8px)",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
            fontSize: "0.58rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cockpit.accent,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Workspace
        </summary>
        <div style={{ marginTop: "0.35rem" }}>
          <NexoraWorkspaceDial
            activeWorkspace={activeWorkspace}
            onWorkspaceChange={onWorkspaceChange}
          />
        </div>
      </details>
    </div>
  );
}
