"use client";

import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import type {
  ExecutiveCameraNavigationAction,
  ExecutiveCameraNavigationLimitState,
} from "@/app/lib/spatial-presentation/executiveCameraNavigation";

type Props = {
  readonly limits: ExecutiveCameraNavigationLimitState;
  readonly onNavigate: (action: ExecutiveCameraNavigationAction) => void;
};

type ControlSpec = {
  readonly action: ExecutiveCameraNavigationAction;
  readonly label: string;
  readonly symbol: string;
  readonly enabled: boolean;
  readonly testId: string;
};

function NavigationButton({
  action,
  label,
  symbol,
  enabled,
  testId,
  onNavigate,
}: {
  readonly action: ExecutiveCameraNavigationAction;
  readonly label: string;
  readonly symbol: string;
  readonly enabled: boolean;
  readonly testId: string;
  readonly onNavigate: (action: ExecutiveCameraNavigationAction) => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      data-nav-action={action}
      aria-label={label}
      title={label}
      disabled={!enabled}
      onClick={() => {
        if (!enabled) return;
        onNavigate(action);
      }}
      style={{
        width: "1.85rem",
        height: "1.85rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${enabled ? cockpit.border : "rgba(148,163,184,0.06)"}`,
        borderRadius: cockpit.radius.sm,
        background: enabled
          ? "rgba(8, 14, 24, 0.72)"
          : "rgba(8, 14, 24, 0.35)",
        color: enabled ? cockpit.textSoft : cockpit.lowMuted,
        fontSize: "0.72rem",
        lineHeight: 1,
        cursor: enabled ? "pointer" : "default",
        opacity: enabled ? 1 : 0.45,
        fontFamily: "inherit",
        padding: 0,
        transition: cockpit.transition,
      }}
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}

/**
 * Compact Stage camera navigation instrument — presentation commands only.
 * Does not mutate Three.js camera directly.
 *
 * STAGE-2D:1 STATUS: BYPASS / DEPRECATE for Executive Stage.
 * The live Stage host no longer mounts this control. Orbit / tilt / zoom
 * violate the fixed-camera contract. Keep the module for SP:1.3 tests and
 * potential non-Stage reuse until STAGE-2D:2+ removal.
 */
export function NexoraExecutiveCameraNavigationControls({
  limits,
  onNavigate,
}: Props) {
  const controls: readonly ControlSpec[] = [
    {
      action: "tilt-up",
      label: "Tilt Up",
      symbol: "↑",
      enabled: limits.canTiltUp,
      testId: "nexora-camera-nav-tilt-up",
    },
    {
      action: "orbit-left",
      label: "Orbit Left",
      symbol: "←",
      enabled: limits.canOrbitLeft,
      testId: "nexora-camera-nav-orbit-left",
    },
    {
      action: "reset",
      label: "Reset View",
      symbol: "◎",
      enabled: limits.canReset,
      testId: "nexora-camera-nav-reset",
    },
    {
      action: "orbit-right",
      label: "Orbit Right",
      symbol: "→",
      enabled: limits.canOrbitRight,
      testId: "nexora-camera-nav-orbit-right",
    },
    {
      action: "tilt-down",
      label: "Tilt Down",
      symbol: "↓",
      enabled: limits.canTiltDown,
      testId: "nexora-camera-nav-tilt-down",
    },
    {
      action: "zoom-out",
      label: "Zoom Out",
      symbol: "−",
      enabled: limits.canZoomOut,
      testId: "nexora-camera-nav-zoom-out",
    },
    {
      action: "zoom-in",
      label: "Zoom In",
      symbol: "+",
      enabled: limits.canZoomIn,
      testId: "nexora-camera-nav-zoom-in",
    },
  ];

  const pad = controls.filter((entry) =>
    ["tilt-up", "orbit-left", "reset", "orbit-right", "tilt-down"].includes(
      entry.action,
    ),
  );
  const zoom = controls.filter((entry) =>
    ["zoom-out", "zoom-in"].includes(entry.action),
  );

  return (
    <div
      data-testid="nexora-executive-camera-navigation"
      role="group"
      aria-label="Executive camera navigation"
      style={{
        position: "absolute",
        right: "0.75rem",
        bottom: "0.75rem",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.4rem 0.45rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(8, 14, 24, 0.68)",
        backdropFilter: "blur(8px)",
        pointerEvents: "auto",
        boxShadow: cockpit.elevation.raised,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1.85rem)",
          gridTemplateRows: "repeat(3, 1.85rem)",
          gap: "0.22rem",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <span style={{ gridColumn: 2, gridRow: 1 }}>
          <NavigationButton {...pad[0]!} onNavigate={onNavigate} />
        </span>
        <span style={{ gridColumn: 1, gridRow: 2 }}>
          <NavigationButton {...pad[1]!} onNavigate={onNavigate} />
        </span>
        <span style={{ gridColumn: 2, gridRow: 2 }}>
          <NavigationButton {...pad[2]!} onNavigate={onNavigate} />
        </span>
        <span style={{ gridColumn: 3, gridRow: 2 }}>
          <NavigationButton {...pad[3]!} onNavigate={onNavigate} />
        </span>
        <span style={{ gridColumn: 2, gridRow: 3 }}>
          <NavigationButton {...pad[4]!} onNavigate={onNavigate} />
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.22rem",
          alignItems: "center",
        }}
      >
        <NavigationButton {...zoom[0]!} onNavigate={onNavigate} />
        <NavigationButton {...zoom[1]!} onNavigate={onNavigate} />
      </div>

      <span
        style={{
          fontSize: "0.52rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        View
      </span>
    </div>
  );
}
