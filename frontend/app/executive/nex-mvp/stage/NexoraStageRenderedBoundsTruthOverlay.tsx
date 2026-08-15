"use client";

/**
 * SP:4.1C audit infrastructure — development-only projected safe-envelope overlay.
 * Not product UI. Disabled unless explicitly enabled (see gate helper).
 */

import { useMemo } from "react";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  auditExecutiveRenderedObjectTruthFromPresentation,
} from "@/app/lib/spatial-presentation/executiveRenderedObjectTruthAudit";
import {
  isExecutiveRenderedBoundsTruthOverlayEnabled,
  ndcRadiusToCssPercent,
  ndcToStageCssPercent,
} from "@/app/lib/spatial-presentation/executiveRenderedBoundsTruthOverlay";
import { EXECUTIVE_FOCUS_HUB_SECTOR_POLICY } from "@/app/lib/spatial-presentation/executiveFocusHubProjectedSectors";

type Props = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
};

export function NexoraStageRenderedBoundsTruthOverlay({
  presentation,
}: Props) {
  const enabled = isExecutiveRenderedBoundsTruthOverlayEnabled();
  const audit = useMemo(() => {
    if (!enabled) return null;
    return auditExecutiveRenderedObjectTruthFromPresentation(presentation, {
      fixture: "live-stage-overlay",
    });
  }, [enabled, presentation]);

  if (!enabled || audit == null) return null;

  const focus = audit.snapshots.find(
    (entry) => entry.objectId === audit.focusedObjectId,
  );

  return (
    <div
      data-testid="nexora-stage-rendered-bounds-truth-overlay"
      data-audit-case={audit.caseClassification}
      data-audit-root={audit.rootCause}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      {focus?.certifiedProjected != null ? (
        <EnvelopeRing
          label="focus-clear"
          centerNdcX={focus.certifiedProjected.centerNdcX}
          centerNdcY={focus.certifiedProjected.centerNdcY}
          radiusNdc={
            focus.certifiedProjected.safeRadiusNdc +
            EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.focusProjectedClearPaddingNdc
          }
          color="rgba(250, 204, 21, 0.55)"
          dashed
        />
      ) : null}
      {audit.snapshots.map((snapshot) => {
        const projected = snapshot.certifiedProjected;
        if (projected == null) return null;
        const isFocus = snapshot.objectId === audit.focusedObjectId;
        return (
          <div key={snapshot.objectId}>
            <EnvelopeRing
              label={`${snapshot.objectId}-bounds`}
              centerNdcX={projected.centerNdcX}
              centerNdcY={projected.centerNdcY}
              radiusNdc={projected.radiusNdc}
              color={
                isFocus
                  ? "rgba(56, 189, 248, 0.85)"
                  : "rgba(148, 163, 184, 0.7)"
              }
            />
            <EnvelopeRing
              label={`${snapshot.objectId}-safe`}
              centerNdcX={projected.centerNdcX}
              centerNdcY={projected.centerNdcY}
              radiusNdc={projected.safeRadiusNdc}
              color={
                isFocus
                  ? "rgba(34, 211, 238, 0.45)"
                  : "rgba(248, 113, 113, 0.45)"
              }
              dashed
            />
            <div
              data-testid={`nexora-truth-overlay-label-${snapshot.objectId}`}
              style={{
                position: "absolute",
                ...(() => {
                  const css = ndcToStageCssPercent(
                    projected.centerNdcX,
                    projected.centerNdcY,
                  );
                  return {
                    left: `${css.leftPercent}%`,
                    top: `${css.topPercent}%`,
                    transform: "translate(-50%, -120%)",
                  };
                })(),
                color: "#e2e8f0",
                fontSize: 9,
                letterSpacing: "0.04em",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                whiteSpace: "nowrap",
                textShadow: "0 1px 2px rgba(0,0,0,0.85)",
              }}
            >
              {snapshot.objectId} s=
              {snapshot.certifiedPresentationScale.toFixed(2)}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 8,
          bottom: 8,
          padding: "4px 6px",
          background: "rgba(2, 6, 23, 0.72)",
          color: "#94a3b8",
          fontSize: 9,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          border: "1px solid rgba(148,163,184,0.35)",
        }}
      >
        SP:4.1C truth overlay · {audit.caseClassification} · proven=
        {audit.findings[0]?.slice(0, 48) ?? "n/a"}
      </div>
    </div>
  );
}

function EnvelopeRing(props: {
  readonly label: string;
  readonly centerNdcX: number;
  readonly centerNdcY: number;
  readonly radiusNdc: number;
  readonly color: string;
  readonly dashed?: boolean;
}) {
  const center = ndcToStageCssPercent(props.centerNdcX, props.centerNdcY);
  const rx = ndcRadiusToCssPercent(props.radiusNdc, "x");
  const ry = ndcRadiusToCssPercent(props.radiusNdc, "y");
  return (
    <div
      data-testid={`nexora-truth-overlay-ring-${props.label}`}
      style={{
        position: "absolute",
        left: `${center.leftPercent}%`,
        top: `${center.topPercent}%`,
        width: `${rx * 2}%`,
        height: `${ry * 2}%`,
        transform: "translate(-50%, -50%)",
        border: `${props.dashed ? "1.5px dashed" : "1.5px solid"} ${props.color}`,
        borderRadius: "50%",
        boxSizing: "border-box",
      }}
    />
  );
}
