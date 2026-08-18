"use client";

import type {
  NexoraMVPPresentationAvailableAction,
  NexoraMVPPresentationViewModel,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly viewModel: NexoraMVPPresentationViewModel;
  readonly onAction: (action: NexoraMVPPresentationAvailableAction) => void;
};

/**
 * Operation action surface — only real or explicitly disabled actions.
 */
export function NexoraSubjectOperation({ viewModel, onAction }: Props) {
  if (!viewModel.showOperationSurface) return null;

  return (
    <div
      data-testid="nexora-subject-operation"
      data-presentation-state="operation"
      data-subject-id={viewModel.subjectId ?? "none"}
      aria-label="Subject operations"
      style={{
        position: "absolute",
        right: "0.85rem",
        top: "6.4rem",
        zIndex: 7,
        width: "min(12rem, calc(100% - 1.7rem))",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        padding: "0.6rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(8, 14, 24, 0.86)",
        boxShadow: cockpit.elevation.raised,
        backdropFilter: "blur(10px)",
        pointerEvents: "auto",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.56rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Actions
      </p>
      <p
        data-testid="nexora-subject-operation-title"
        style={{
          margin: 0,
          fontSize: "0.78rem",
          color: cockpit.text,
          fontWeight: 600,
        }}
      >
        {viewModel.subjectLabel ?? viewModel.subjectId}
      </p>

      {viewModel.availableActions.length === 0 ? (
        <p
          data-testid="nexora-subject-operation-empty"
          style={{
            margin: "0.2rem 0 0",
            fontSize: "0.68rem",
            color: cockpit.muted,
          }}
        >
          No actions available for this subject.
        </p>
      ) : (
        viewModel.availableActions.map((action) => (
          <button
            key={action.id}
            type="button"
            data-testid={`nexora-subject-action-${action.id}`}
            data-action-available={action.available ? "true" : "false"}
            disabled={!action.available}
            title={
              action.available
                ? action.label
                : (action.disabledReason ?? "Unavailable")
            }
            onClick={() => {
              if (action.available) onAction(action);
            }}
            style={{
              textAlign: "left",
              border: `1px solid ${
                action.available ? cockpit.border : cockpit.border
              }`,
              background: action.available
                ? "rgba(56, 120, 180, 0.18)"
                : "rgba(8, 14, 24, 0.35)",
              color: action.available ? cockpit.textSoft : cockpit.lowMuted,
              fontSize: "0.68rem",
              letterSpacing: "0.04em",
              borderRadius: cockpit.radius.sm,
              padding: "0.4rem 0.45rem",
              cursor: action.available ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              opacity: action.available ? 1 : 0.65,
            }}
          >
            {action.label}
            {!action.available && action.disabledReason ? (
              <span
                style={{
                  display: "block",
                  marginTop: "0.15rem",
                  fontSize: "0.55rem",
                  color: cockpit.lowMuted,
                  letterSpacing: "0.04em",
                }}
              >
                {action.disabledReason}
              </span>
            ) : null}
          </button>
        ))
      )}
    </div>
  );
}
