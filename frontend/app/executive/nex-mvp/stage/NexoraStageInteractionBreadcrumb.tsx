"use client";

import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import type { NexoraMVPInteractionSubject } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

type Props = {
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
  readonly canStepBack: boolean;
  readonly canStepForward?: boolean;
  readonly breadcrumbHasOverflow?: boolean;
  readonly breadcrumbHasOverflowBefore?: boolean;
  readonly breadcrumbHasOverflowAfter?: boolean;
  readonly currentObjectId?: string | null;
  readonly currentTrailIndex?: number;
  readonly onStepBack: () => void;
  readonly onStepForward?: () => void;
  readonly onOverview: () => void;
  /** STAGE-2D:5/6 — jump to absolute navigation-trail index. */
  readonly onNavigateTrailIndex?: (index: number) => void;
};

/**
 * Lightweight Stage orientation indicator (DOM, outside WebGL).
 * STAGE-2D:6 — scoped trail density; ellipsis = history overflow only.
 */
export function NexoraStageInteractionBreadcrumb({
  breadcrumb,
  canStepBack,
  canStepForward = false,
  breadcrumbHasOverflow = false,
  breadcrumbHasOverflowBefore = false,
  breadcrumbHasOverflowAfter = false,
  currentObjectId = null,
  currentTrailIndex = -1,
  onStepBack,
  onStepForward,
  onOverview,
  onNavigateTrailIndex,
}: Props) {
  const showOverflowBefore =
    breadcrumbHasOverflowBefore ||
    (breadcrumbHasOverflow && !breadcrumbHasOverflowAfter);
  const showOverflowAfter = breadcrumbHasOverflowAfter;

  return (
    <div
      data-testid="nexora-stage-interaction-breadcrumb"
      data-stage-navigation-ui="trail"
      aria-label="Stage navigation trail"
      style={{
        position: "absolute",
        left: "50%",
        top: "0.7rem",
        transform: "translateX(-50%)",
        zIndex: 3,
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        maxWidth: "min(36rem, calc(100% - 14rem))",
        padding: "0.3rem 0.55rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(8, 14, 24, 0.48)",
        backdropFilter: "blur(8px)",
        pointerEvents: "auto",
      }}
    >
      {breadcrumb.map((entry, index) => {
        const isOverview = entry.id === "trail-overview";
        const isCurrent = isOverview
          ? breadcrumb.length === 1
          : entry.navigationTrailIndex != null
            ? entry.navigationTrailIndex === currentTrailIndex
            : currentObjectId != null
              ? entry.id === currentObjectId && index === breadcrumb.length - 1
              : index === breadcrumb.length - 1;

        const clickable =
          isOverview ||
          (entry.navigationTrailIndex != null &&
            onNavigateTrailIndex != null &&
            !isCurrent);

        const accessibleName = entry.navigationLabelFull ?? entry.label;

        return (
          <span
            key={
              entry.navigationTrailEntryId ??
              `${entry.id}-legacy-${entry.navigationTrailIndex ?? index}`
            }
            data-navigation-trail-entry-id={
              entry.navigationTrailEntryId ?? "legacy"
            }
            data-navigation-subject-id={entry.id}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            {index === 1 && showOverflowBefore ? (
              <span
                data-testid="nexora-breadcrumb-overflow-before"
                aria-hidden="true"
                title="Earlier navigation history"
                style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}
              >
                …
              </span>
            ) : null}
            {index > 0 ? (
              <span style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}>
                /
              </span>
            ) : null}
            <button
              type="button"
              data-testid={`nexora-breadcrumb-${entry.id}`}
              data-breadcrumb-current={isCurrent ? "true" : "false"}
              data-label-mode={entry.navigationLabelMode ?? "full"}
              aria-current={isCurrent ? "page" : undefined}
              title={accessibleName}
              aria-label={accessibleName}
              disabled={!clickable}
              onClick={() => {
                if (isOverview) {
                  onOverview();
                  return;
                }
                if (
                  entry.navigationTrailIndex != null &&
                  onNavigateTrailIndex != null &&
                  !isCurrent
                ) {
                  onNavigateTrailIndex(entry.navigationTrailIndex);
                }
              }}
              style={{
                border: "none",
                background: "transparent",
                color: isCurrent ? cockpit.accent : cockpit.textSoft,
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: isCurrent ? 600 : 400,
                cursor: clickable ? "pointer" : "default",
                fontFamily: "inherit",
                padding: 0,
                maxWidth: isCurrent ? "11rem" : "7.5rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {entry.label}
            </button>
            {index === breadcrumb.length - 1 &&
            showOverflowAfter &&
            !isOverview ? (
              <span
                data-testid="nexora-breadcrumb-overflow-after"
                aria-hidden="true"
                title="Later navigation history"
                style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}
              >
                …
              </span>
            ) : null}
          </span>
        );
      })}
      {canStepBack ? (
        <button
          type="button"
          data-testid="nexora-stage-step-back"
          onClick={onStepBack}
          style={{
            marginLeft: "0.3rem",
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            fontSize: "0.56rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: cockpit.radius.sm,
            padding: "0.16rem 0.35rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back
        </button>
      ) : null}
      {canStepForward && onStepForward ? (
        <button
          type="button"
          data-testid="nexora-stage-step-forward"
          onClick={onStepForward}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            fontSize: "0.56rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: cockpit.radius.sm,
            padding: "0.16rem 0.35rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Forward
        </button>
      ) : null}
    </div>
  );
}
