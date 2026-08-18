"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
} from "react";
import {
  getNexoraMVPPresentationStates,
  type NexoraMVPPresentationState,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  NEXORA_MVP_PRESENTATION_TRANSITION_MS,
  NEXORA_MVP_PRESENTATION_TRANSITION_MS_REDUCED,
  type NexoraMVPPresentationCapability,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly activePresentationState: NexoraMVPPresentationState;
  readonly capability: NexoraMVPPresentationCapability;
  readonly onPresentationStateChange: (
    state: NexoraMVPPresentationState,
  ) => void;
};

const LABELS: Record<NexoraMVPPresentationState, string> = {
  minimum: "Focus",
  report: "Details",
  operation: "Actions",
};

/**
 * Compact presentation-depth selector (Stage upper-right).
 * Does not own authoritative presentation state.
 */
export function NexoraPresentationStateSelector({
  activePresentationState,
  capability,
  onPresentationStateChange,
}: Props) {
  const labelId = useId();
  const states = getNexoraMVPPresentationStates();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  const transitionMs = reducedMotion
    ? NEXORA_MVP_PRESENTATION_TRANSITION_MS_REDUCED
    : NEXORA_MVP_PRESENTATION_TRANSITION_MS;

  const isEnabled = useCallback(
    (state: NexoraMVPPresentationState) => {
      if (state === "minimum") return true;
      if (state === "report") return capability.report;
      return capability.operation;
    },
    [capability.operation, capability.report],
  );

  const requestChange = useCallback(
    (state: NexoraMVPPresentationState) => {
      if (!isEnabled(state) || state === activePresentationState) return;
      onPresentationStateChange(state);
    },
    [activePresentationState, isEnabled, onPresentationStateChange],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const index = states.indexOf(activePresentationState);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        for (let offset = 1; offset < states.length; offset += 1) {
          const candidate = states[(index + offset) % states.length]!;
          if (isEnabled(candidate)) {
            requestChange(candidate);
            break;
          }
        }
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        for (let offset = 1; offset < states.length; offset += 1) {
          const candidate =
            states[(index - offset + states.length) % states.length]!;
          if (isEnabled(candidate)) {
            requestChange(candidate);
            break;
          }
        }
      }
      if (event.key === "Home") {
        event.preventDefault();
        requestChange("minimum");
      }
      if (event.key === "End") {
        event.preventDefault();
        if (isEnabled("operation")) requestChange("operation");
        else if (isEnabled("report")) requestChange("report");
      }
    },
    [activePresentationState, isEnabled, requestChange, states],
  );

  return (
    <div
      data-testid="nexora-presentation-state-selector"
      data-nex-mvp="6"
      data-active-presentation={activePresentationState}
      data-operation-enabled={capability.operation ? "true" : "false"}
      data-ux1-compact="true"
      role="radiogroup"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{
        position: "absolute",
        right: "0.85rem",
        top: "0.75rem",
        zIndex: 8,
        minWidth: "7.5rem",
        pointerEvents: "auto",
        outline: "none",
      }}
    >
      <details
        data-testid="nexora-presentation-disclosure"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.35rem",
          padding: "0.35rem 0.45rem",
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
            fontSize: "0.56rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cockpit.muted,
            fontWeight: 550,
            display: "flex",
            justifyContent: "space-between",
            gap: "0.4rem",
          }}
        >
          <span id={labelId}>View</span>
          <span
            data-testid="nexora-presentation-active-label"
            style={{ color: cockpit.accent }}
          >
            {LABELS[activePresentationState]}
          </span>
        </summary>
        <span style={cockpit.visuallyHidden}>Presentation Level</span>
      <div
        style={{
          display: "flex",
          gap: "0.2rem",
        }}
      >
        {states.map((state) => {
          const active = state === activePresentationState;
          const enabled = isEnabled(state);
          return (
            <button
              key={state}
              type="button"
              role="radio"
              aria-checked={active}
              aria-disabled={!enabled}
              disabled={!enabled}
              title={
                enabled
                  ? LABELS[state]
                  : `${LABELS[state]} unavailable for current subject`
              }
              data-testid={`nexora-presentation-option-${state}`}
              onClick={() => requestChange(state)}
              style={{
                flex: 1,
                border: active
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
                background: active
                  ? cockpit.accentSoft
                  : "rgba(8, 14, 24, 0.45)",
                color: !enabled
                  ? cockpit.lowMuted
                  : active
                    ? cockpit.accent
                    : cockpit.muted,
                fontSize: "0.58rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: cockpit.radius.sm,
                padding: "0.32rem 0.2rem",
                cursor: enabled ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                fontWeight: active ? 650 : 500,
                opacity: enabled ? 1 : 0.45,
                transition: reducedMotion
                  ? "none"
                  : `color ${transitionMs}ms ease, background ${transitionMs}ms ease, border-color ${transitionMs}ms ease`,
              }}
            >
              {LABELS[state]}
            </button>
          );
        })}
      </div>
      </details>
    </div>
  );
}
