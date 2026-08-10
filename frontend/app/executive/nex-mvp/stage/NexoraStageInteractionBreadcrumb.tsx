"use client";

import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import type { NexoraMVPInteractionSubject } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

type Props = {
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
  readonly canStepBack: boolean;
  readonly onStepBack: () => void;
  readonly onOverview: () => void;
};

/**
 * Lightweight Stage orientation indicator (DOM, outside WebGL).
 */
export function NexoraStageInteractionBreadcrumb({
  breadcrumb,
  canStepBack,
  onStepBack,
  onOverview,
}: Props) {
  return (
    <div
      data-testid="nexora-stage-interaction-breadcrumb"
      aria-label="Stage interaction context"
      style={{
        position: "absolute",
        left: "50%",
        top: "0.7rem",
        transform: "translateX(-50%)",
        zIndex: 3,
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        maxWidth: "min(42rem, calc(100% - 12rem))",
        padding: "0.35rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(8, 14, 24, 0.72)",
        backdropFilter: "blur(8px)",
        pointerEvents: "auto",
      }}
    >
      {breadcrumb.map((entry, index) => {
        const isLast = index === breadcrumb.length - 1;
        const isOverview = entry.id === "trail-overview";
        return (
          <span
            key={`${entry.id}-${index}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            {index > 0 ? (
              <span style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}>
                /
              </span>
            ) : null}
            <button
              type="button"
              data-testid={`nexora-breadcrumb-${entry.id}`}
              disabled={isLast && !isOverview}
              onClick={() => {
                if (isOverview) onOverview();
                else if (!isLast) onStepBack();
              }}
              style={{
                border: "none",
                background: "transparent",
                color: isLast ? cockpit.accent : cockpit.textSoft,
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: isLast && !isOverview ? "default" : "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              {entry.label}
            </button>
          </span>
        );
      })}
      {canStepBack ? (
        <button
          type="button"
          data-testid="nexora-stage-step-back"
          onClick={onStepBack}
          style={{
            marginLeft: "0.35rem",
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: cockpit.radius.sm,
            padding: "0.18rem 0.4rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back
        </button>
      ) : null}
    </div>
  );
}
