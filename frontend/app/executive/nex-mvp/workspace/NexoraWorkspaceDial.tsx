"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type WheelEvent,
} from "react";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import {
  NEXORA_MVP_WORKSPACE_LABELS,
  type NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  deriveNexoraMVPWorkspaceDialState,
  NEXORA_MVP_WORKSPACE_TRANSITION_MS,
  NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED,
  type NexoraMVPWorkspaceDialState,
} from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";

type Props = {
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly onWorkspaceChange: (workspace: NexoraMVPWorkspaceKind) => void;
  readonly disabled?: boolean;
};

/**
 * Premium cockpit-style Workspace Dial (DOM/SVG).
 * Displays canonical workspace order; does not own application authority.
 */
export function NexoraWorkspaceDial({
  activeWorkspace,
  onWorkspaceChange,
  disabled = false,
}: Props) {
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  const dial: NexoraMVPWorkspaceDialState = useMemo(
    () =>
      deriveNexoraMVPWorkspaceDialState({
        activeWorkspace,
        transitionState: transitioning ? "transitioning" : "idle",
      }),
    [activeWorkspace, transitioning],
  );

  const transitionMs = reducedMotion
    ? NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED
    : NEXORA_MVP_WORKSPACE_TRANSITION_MS;

  const requestChange = useCallback(
    (workspace: NexoraMVPWorkspaceKind | null) => {
      if (disabled || workspace == null || workspace === activeWorkspace) {
        return;
      }
      setTransitioning(true);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        setTransitioning(false);
      }, transitionMs);
      onWorkspaceChange(workspace);
    },
    [activeWorkspace, disabled, onWorkspaceChange, transitionMs],
  );

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          requestChange(dial.previousWorkspace);
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          requestChange(dial.nextWorkspace);
          break;
        case "Home":
          event.preventDefault();
          requestChange("overview");
          break;
        case "End":
          event.preventDefault();
          requestChange("execution");
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          break;
        default:
          break;
      }
    },
    [dial.nextWorkspace, dial.previousWorkspace, disabled, requestChange],
  );

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (Math.abs(event.deltaY) < 8) return;
      event.preventDefault();
      if (event.deltaY > 0) requestChange(dial.nextWorkspace);
      else requestChange(dial.previousWorkspace);
    },
    [dial.nextWorkspace, dial.previousWorkspace, disabled, requestChange],
  );

  return (
    <div
      ref={rootRef}
      data-testid="nexora-workspace-dial"
      data-active-workspace={dial.activeWorkspace}
      data-dial-index={dial.activeIndex}
      data-transition-state={dial.transitionState}
      data-edge-policy="stop-at-ends"
      role="group"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.4rem",
        minWidth: "8.75rem",
        outline: "none",
        pointerEvents: "auto",
      }}
    >
      <span
        id={labelId}
        style={{
          fontSize: "0.56rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
          fontWeight: 550,
        }}
      >
        Workspace Dial
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        <button
          type="button"
          data-testid="nexora-workspace-dial-previous"
          aria-label="Previous workspace"
          disabled={disabled || !dial.canGoPrevious}
          onClick={() => requestChange(dial.previousWorkspace)}
          style={chevronStyle(!dial.canGoPrevious || disabled)}
        >
          ‹
        </button>

        <div
          data-testid="nexora-workspace-dial-face"
          aria-hidden="true"
          style={{
            position: "relative",
            width: "4.8rem",
            height: "4.8rem",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 35% 30%, rgba(148,163,184,0.22), rgba(8,14,24,0.92) 55%, rgba(2,6,14,0.98))",
            border: `1px solid ${cockpit.borderStrong}`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 22px rgba(2,6,14,0.45)",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            style={{ display: "block" }}
          >
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="2.5"
            />
            {dial.workspaces.map((entry) => {
              const angle = -135 + entry.index * (270 / 4);
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + Math.cos(rad) * 30;
              const y1 = 50 + Math.sin(rad) * 30;
              const x2 = 50 + Math.cos(rad) * 36;
              const y2 = 50 + Math.sin(rad) * 36;
              const active = entry.kind === dial.activeWorkspace;
              return (
                <line
                  key={entry.kind}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={active ? cockpit.accent : "rgba(148,163,184,0.45)"}
                  strokeWidth={active ? 2.4 : 1.4}
                  strokeLinecap="round"
                />
              );
            })}
            <g
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${dial.rotationDegrees}deg)`,
                transition: reducedMotion
                  ? "none"
                  : `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            >
              <circle cx="50" cy="50" r="9" fill="rgba(15,23,42,0.95)" />
              <circle cx="50" cy="50" r="4.5" fill={cockpit.accent} />
              <line
                x1="50"
                y1="50"
                x2="78"
                y2="50"
                stroke={cockpit.accent}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        <button
          type="button"
          data-testid="nexora-workspace-dial-next"
          aria-label="Next workspace"
          disabled={disabled || !dial.canGoNext}
          onClick={() => requestChange(dial.nextWorkspace)}
          style={chevronStyle(!dial.canGoNext || disabled)}
        >
          ›
        </button>
      </div>

      <p
        data-testid="nexora-workspace-dial-active-label"
        style={{
          margin: 0,
          fontSize: "0.78rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.accent,
          fontWeight: 600,
        }}
      >
        {dial.label}
      </p>

      <div
        role="listbox"
        aria-label="Executive workspaces"
        aria-activedescendant={`nexora-workspace-option-${dial.activeWorkspace}`}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.2rem",
          maxWidth: "10.5rem",
        }}
      >
        {dial.workspaces.map((entry) => {
          const active = entry.kind === dial.activeWorkspace;
          return (
            <button
              key={entry.kind}
              id={`nexora-workspace-option-${entry.kind}`}
              type="button"
              role="option"
              aria-selected={active}
              data-testid={`nexora-workspace-option-${entry.kind}`}
              title={entry.label}
              disabled={disabled}
              onClick={() => requestChange(entry.kind)}
              style={{
                border: active
                  ? `1px solid ${cockpit.accent}`
                  : "1px solid transparent",
                background: active ? cockpit.accentSoft : "transparent",
                color: active ? cockpit.accent : cockpit.muted,
                fontSize: "0.58rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: cockpit.radius.sm,
                padding: "0.18rem 0.32rem",
                cursor: disabled ? "default" : "pointer",
                fontFamily: "inherit",
                transition: reducedMotion
                  ? "none"
                  : `color ${transitionMs}ms ease, background ${transitionMs}ms ease`,
              }}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      <span
        style={{
          fontSize: "0.52rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        {dial.previousWorkspace
          ? NEXORA_MVP_WORKSPACE_LABELS[dial.previousWorkspace]
          : "—"}{" "}
        ·{" "}
        {dial.nextWorkspace
          ? NEXORA_MVP_WORKSPACE_LABELS[dial.nextWorkspace]
          : "—"}
      </span>
    </div>
  );
}

function chevronStyle(disabled: boolean): CSSProperties {
  return {
    width: "1.55rem",
    height: "1.55rem",
    borderRadius: "999px",
    border: `1px solid ${cockpit.border}`,
    background: "rgba(8,14,24,0.65)",
    color: disabled ? cockpit.lowMuted : cockpit.textSoft,
    fontSize: "1rem",
    lineHeight: 1,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontFamily: "inherit",
  };
}
