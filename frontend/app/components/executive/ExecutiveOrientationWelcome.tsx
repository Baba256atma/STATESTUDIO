"use client";

import type React from "react";

import type { ExecutiveWelcomeSnapshot } from "../../lib/workspace/orientation";
import { nexoraHudShellStyle, resolveNexoraHudTheme } from "../../lib/scene/nexoraHudTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveOrientationWelcomeProps = {
  welcome: ExecutiveWelcomeSnapshot;
  themeMode: "day" | "night";
  onDismiss: () => void;
  onPrimaryAction?: () => void;
};

/** E2:48 Part 7 — minimal first-visit welcome (no tutorial walkthrough). */
export function ExecutiveOrientationWelcome(props: ExecutiveOrientationWelcomeProps): React.ReactElement | null {
  if (!props.welcome.showWelcome) return null;

  const theme = resolveNexoraHudTheme(props.themeMode);

  return (
    <div
      data-nx="executive-orientation-welcome"
      role="dialog"
      aria-label="Executive workspace orientation"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        background: "var(--nx-overlay-backdrop)",
      }}
    >
      <div
        style={{
          ...nexoraHudShellStyle(theme, { width: "min(560px, calc(100vw - 32px))", padding: "16px 18px", textAlign: "left", lineHeight: 1.5 }, {
            surface: "executiveStatusHud",
            edgeAnchor: "CENTER_FLOATING",
          }),
        }}
      >
        <div
          style={{
            color: theme.label,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Executive workspace
        </div>
        <div style={{ color: theme.textPrimary, fontSize: 20, fontWeight: 800, marginTop: 8 }}>
          {props.welcome.currentSystemState}
        </div>
        <div style={{ color: theme.textSecondary, fontSize: 13, marginTop: 10, lineHeight: 1.45 }}>
          <strong style={{ color: theme.textPrimary }}>Most important insight:</strong>{" "}
          {props.welcome.mostImportantInsight}
        </div>
        <div style={{ color: theme.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 1.45 }}>
          <strong style={{ color: theme.textPrimary }}>Suggested first action:</strong>{" "}
          {props.welcome.suggestedFirstAction}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={props.onPrimaryAction}
            style={{
              height: 34,
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${theme.accent}`,
              background: "color-mix(in srgb, var(--nx-accent-soft) 55%, transparent)",
              color: theme.textPrimary,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {props.welcome.suggestedFirstAction}
          </button>
          <button
            type="button"
            onClick={props.onDismiss}
            style={{
              height: 34,
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${nx.borderSoft}`,
              background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enter workspace
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveOrientationWelcome;
