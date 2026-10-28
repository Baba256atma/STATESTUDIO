import type { ReactNode } from "react";
import { ExecutiveModeSelector } from "../mode/ExecutiveModeSelector";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly children: ReactNode;
  readonly overlay?: ReactNode;
  readonly guidedAttentionCue?: "SOFT_HALO" | "EMPHASIS" | null;
  /**
   * Stage navigation bar. Reserves height above the canvas for Scenes,
   * the navigation trail, and View.
   */
  readonly stageHeader?: ReactNode | null;
  /**
   * Stage-associated control mount.
   * Defaults to EXS Mode Selector. Pass MVP Workspace Dial mount (or null)
   * to replace it without removing Stage ownership.
   */
  readonly stageControls?: ReactNode | null;
};

/**
 * Executive Stage Frame — largest UI region.
 * Mode Selector reads ExecutiveModeContext when stageControls is omitted.
 */
export function ExecutiveStageFrame({
  children,
  overlay,
  stageHeader = null,
  stageControls,
  guidedAttentionCue = null,
}: Props) {
  const controls =
    stageControls === undefined ? <ExecutiveModeSelector /> : stageControls;
  const guided = guidedAttentionCue != null;

  return (
    <section
      data-testid="executive-stage-frame"
      data-guided-attention-target="STAGE"
      data-guided-attention-cue={guidedAttentionCue ?? "none"}
      data-guided-attention-active={guided ? "true" : "false"}
      aria-label="Executive Stage Frame"
      style={{
        flex: "1 1 auto",
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: cockpit.stageBg,
        boxShadow: guidedAttentionCue === "SOFT_HALO"
          ? "inset 0 0 0 1px rgba(56, 189, 248, 0.45), 0 0 24px rgba(56, 189, 248, 0.12)"
          : "inset 0 0 0 1px rgba(148, 163, 184, 0.05)",
        outline: guidedAttentionCue === "EMPHASIS" ? `2px solid ${cockpit.accent}` : "none",
        outlineOffset: guidedAttentionCue === "EMPHASIS" ? -2 : 0,
        overflow: "hidden",
        transition: `flex-basis ${cockpit.drawerMs} ease, background 250ms ease, box-shadow 250ms ease`,
      }}
    >
      {stageHeader != null ? (
        <div
          data-testid="executive-stage-header"
          data-stage-menu="navigation"
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            columnGap: "0.85rem",
            rowGap: "0.35rem",
            padding: "0.35rem 0.75rem",
            minWidth: 0,
            position: "relative",
            zIndex: 4,
            background: "var(--nx-bg-hud)",
            borderBottom: `1px solid ${cockpit.border}`,
          }}
        >
          {stageHeader}
        </div>
      ) : null}
      <div
        data-testid="executive-stage-director"
        data-exs1-compat="exs1-stage"
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          position: "relative",
        }}
      >
        {children}
        {controls}
        {overlay ? (
          <div
            data-testid="executive-stage-overlay"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 6,
            }}
          >
            {overlay}
          </div>
        ) : null}
      </div>
    </section>
  );
}
