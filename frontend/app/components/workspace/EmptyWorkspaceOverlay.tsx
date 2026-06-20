"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";
import type { EmptyWorkspaceState } from "../../lib/workspace/emptyWorkspaceContract";
import {
  dismissEmptyWorkspaceOnboarding,
  reopenEmptyWorkspaceOnboarding,
} from "../../lib/workspace/emptyWorkspaceContract";
import { openDomainDiscoveryModal } from "./WorkspaceModalHost";

export type EmptyWorkspaceOverlayProps = {
  state: EmptyWorkspaceState | null;
};

export function EmptyWorkspaceOverlay(props: EmptyWorkspaceOverlayProps): React.ReactElement | null {
  const state = props.state;
  if (!state || state.state !== "empty") return null;

  if (state.onboardingState === "dismissed") {
    return (
      <div style={reopenDockStyle()}>
        <button
          type="button"
          onClick={() => reopenEmptyWorkspaceOnboarding(state.workspaceId)}
          style={secondaryActionStyle()}
        >
          Start Modeling
        </button>
      </div>
    );
  }

  return (
    <div data-nx="empty-workspace-overlay" style={overlayShellStyle()}>
      <section aria-label="Empty workspace onboarding" style={panelStyle()}>
        <header style={{ display: "grid", gap: 6 }}>
          <div style={eyebrowStyle()}>Welcome to Nexora</div>
          <h2 style={titleStyle()}>Let’s build your first model.</h2>
        </header>
        <p style={bodyStyle()}>
          This workspace does not contain a business model yet. Nexora can help you define a domain, describe your situation, identify goals, and generate a first draft model.
        </p>
        <footer style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => openDomainDiscoveryModal(state.workspaceId)}
            style={primaryActionStyle()}
          >
            Start Modeling
          </button>
          <button
            type="button"
            onClick={() => dismissEmptyWorkspaceOnboarding(state.workspaceId)}
            style={secondaryActionStyle()}
          >
            Dismiss
          </button>
        </footer>
      </section>
    </div>
  );
}

function overlayShellStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    pointerEvents: "none",
    background: "color-mix(in srgb, var(--nx-bg-app) 18%, transparent)",
  };
}

function panelStyle(): React.CSSProperties {
  return {
    width: "min(520px, 92vw)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: "color-mix(in srgb, var(--nx-popover-bg) 94%, transparent)",
    boxShadow: nx.popoverShadow,
    backdropFilter: "blur(12px)",
    padding: 18,
    display: "grid",
    gap: 14,
    textAlign: "center",
    pointerEvents: "auto",
  };
}

function eyebrowStyle(): React.CSSProperties {
  return {
    color: nx.lowMuted,
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 800,
  };
}

function titleStyle(): React.CSSProperties {
  return {
    color: nx.text,
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 800,
    margin: 0,
  };
}

function bodyStyle(): React.CSSProperties {
  return {
    color: nx.muted,
    fontSize: 13,
    lineHeight: 1.5,
    margin: 0,
  };
}

function primaryActionStyle(): React.CSSProperties {
  return {
    minHeight: 36,
    borderRadius: 4,
    border: `1px solid ${nx.navTileActiveBorder}`,
    background: nx.navTileActiveBg,
    color: nx.text,
    fontSize: 12,
    fontWeight: 800,
    padding: "0 14px",
    cursor: "pointer",
  };
}

function secondaryActionStyle(): React.CSSProperties {
  return {
    minHeight: 36,
    borderRadius: 4,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    color: nx.muted,
    fontSize: 12,
    fontWeight: 800,
    padding: "0 14px",
    cursor: "pointer",
  };
}

function reopenDockStyle(): React.CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    bottom: 18,
    zIndex: 5,
    transform: "translateX(-50%)",
    pointerEvents: "auto",
  };
}
