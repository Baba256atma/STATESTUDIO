import type { ReactNode } from "react";
import { ExecutiveModeSelector } from "../mode/ExecutiveModeSelector";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly children: ReactNode;
  readonly overlay?: ReactNode;
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
  stageControls,
}: Props) {
  const controls =
    stageControls === undefined ? <ExecutiveModeSelector /> : stageControls;

  return (
    <section
      data-testid="executive-stage-frame"
      aria-label="Executive Stage Frame"
      style={{
        flex: "1 1 auto",
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: cockpit.stageBg,
        boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.05)",
        overflow: "hidden",
        transition: `flex-basis ${cockpit.drawerMs} ease, background 250ms ease`,
      }}
    >
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
