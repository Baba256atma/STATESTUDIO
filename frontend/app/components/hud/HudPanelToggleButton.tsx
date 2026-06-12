"use client";

import React from "react";

import { hudPanelToggleButtonStyle } from "../../lib/hud/hudPanelToggleButtonStyle";
import {
  resolveHudPanelToggleAriaLabel,
  resolveHudPanelToggleIcon,
  resolveHudPanelToggleTitle,
  traceNexoraHudToggle,
  type HudPanelToggleId,
} from "../../lib/hud/hudPanelToggleContract";

export type HudPanelToggleButtonProps = {
  panelId: HudPanelToggleId;
  /** True when panel body / expanded content is visible. */
  expanded: boolean;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
};

export function HudPanelToggleButton(props: HudPanelToggleButtonProps): React.ReactElement {
  const [hovered, setHovered] = React.useState(false);
  const ariaLabel = props.ariaLabel ?? resolveHudPanelToggleAriaLabel(props.panelId, props.expanded);
  const title = props.title ?? resolveHudPanelToggleTitle(props.panelId, props.expanded);
  const icon = resolveHudPanelToggleIcon(props.expanded);

  React.useEffect(() => {
    traceNexoraHudToggle(props.panelId, props.expanded);
  }, [props.expanded, props.panelId]);

  return (
    <button
      type="button"
      data-nx="hud-panel-toggle"
      data-nx-hud-panel={props.panelId}
      aria-label={ariaLabel}
      aria-expanded={props.expanded}
      title={title}
      disabled={props.disabled}
      onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hudPanelToggleButtonStyle({ disabled: props.disabled, hovered })}
    >
      <span aria-hidden>{icon}</span>
    </button>
  );
}

export default HudPanelToggleButton;
