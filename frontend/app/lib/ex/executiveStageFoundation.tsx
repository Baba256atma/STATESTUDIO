/**
 * EX-1:1 — Executive Stage Foundation.
 *
 * Runtime-driven Executive Stage composition.
 * Consumes only the Executive Context Runtime Public Index.
 * No business visualisation, animations, Workspace behaviour, or AI.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import type { ReactNode } from "react";
import {
  executiveContextRuntimePublicIndex,
} from "../rtc/executiveContextRuntimePublicIndex.ts";
import { ExecutiveFocusLayer } from "./executiveFocusLayer.tsx";
import { ExecutiveObjectLayer } from "./executiveObjectLayer.tsx";
import { ExecutiveRelationshipLayer } from "./executiveRelationshipLayer.tsx";
import { ExecutiveStageSurface } from "./executiveStageSurface.tsx";
import {
  ExecutiveStageFoundation as ExecutiveStageFoundationMeta,
  ExecutiveStageFoundationId,
  ExecutiveStageFoundationName,
  ExecutiveStageFoundationNamespace,
  ExecutiveStageFoundationNextPhase,
  ExecutiveStageFoundationReadiness,
  ExecutiveStageFoundationStatus,
  ExecutiveStageFoundationVersion,
  ExecutiveStageInteractionKinds,
  ExecutiveStageLayers,
  ExecutiveStageOverlayKinds,
  type ExecutiveStageOverlayKind,
  type ExecutiveStageVisualState,
} from "./executiveStageTypes.ts";

export {
  ExecutiveStageFoundationId,
  ExecutiveStageFoundationName,
  ExecutiveStageFoundationNamespace,
  ExecutiveStageFoundationNextPhase,
  ExecutiveStageFoundationReadiness,
  ExecutiveStageFoundationStatus,
  ExecutiveStageFoundationVersion,
};

export { ExecutiveStageFoundationMeta as ExecutiveStageFoundation };

/** Interaction Layer — captures interactions; handling deferred. */
export function ExecutiveInteractionLayer({
  visualState = "Ready",
  "data-testid": testId = "executive-interaction-layer",
}: {
  readonly visualState?: ExecutiveStageVisualState;
  readonly "data-testid"?: string;
}) {
  return (
    <div
      data-testid={testId}
      data-layer="InteractionLayer"
      data-visual-state={visualState}
      data-interactions={ExecutiveStageInteractionKinds.join(",")}
      aria-label="Executive Interaction Layer"
      role="presentation"
      tabIndex={-1}
      style={{
        position: "absolute",
        inset: "clamp(2rem, 4vw, 4.5rem)",
        zIndex: 5,
        outline: "none",
      }}
    />
  );
}

export const ExecutiveInteractionLayerMeta = Object.freeze({
  layerName: "InteractionLayer" as const,
  interactions: ExecutiveStageInteractionKinds,
  handlingDeferred: true as const,
  immutable: true as const,
} as const);

/** Stage Overlay — non-business visual information only. */
export function ExecutiveStageOverlay({
  visualState = "Ready",
  overlayKind,
  "data-testid": testId = "executive-stage-overlay",
}: {
  readonly visualState?: ExecutiveStageVisualState;
  readonly overlayKind?: ExecutiveStageOverlayKind | null;
  readonly "data-testid"?: string;
}) {
  const resolvedKind =
    overlayKind ??
    (visualState === "Loading" || visualState === "Initializing"
      ? "loading"
      : visualState === "Empty"
      ? "empty-stage"
      : visualState === "Error"
      ? "unavailable-runtime"
      : null);

  if (!resolvedKind) {
    return null;
  }

  const label =
    resolvedKind === "loading"
      ? "Stage loading"
      : resolvedKind === "empty-stage"
      ? "Stage empty"
      : resolvedKind === "unavailable-runtime"
      ? "Runtime unavailable"
      : "Stage diagnostics";

  return (
    <div
      data-testid={testId}
      data-layer="StageOverlay"
      data-overlay-kind={resolvedKind}
      data-visual-state={visualState}
      aria-label={label}
      role="status"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        background:
          "color-mix(in oklab, var(--ex-stage-deep) 42%, transparent)",
        color: "var(--ex-stage-muted)",
        fontFamily: "var(--ex-stage-font)",
        fontSize: "1rem",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </div>
  );
}

export const ExecutiveStageOverlayMeta = Object.freeze({
  layerName: "StageOverlay" as const,
  overlayKinds: ExecutiveStageOverlayKinds,
  kpiOverlaysPermitted: false as const,
  analyticsOverlaysPermitted: false as const,
  immutable: true as const,
} as const);

export interface ExecutiveStageProps {
  readonly visualState?: ExecutiveStageVisualState;
  readonly focusedObjectId?: string | null;
  readonly focusedRegionId?: string | null;
  readonly overlayKind?: ExecutiveStageOverlayKind | null;
  readonly children?: ReactNode;
  readonly "data-testid"?: string;
}

/**
 * Executive Stage — projects the active Executive Context.
 * Consumes only the Runtime Public Index.
 */
export function ExecutiveStage({
  visualState = "Ready",
  focusedObjectId = null,
  focusedRegionId = null,
  overlayKind = null,
  children,
  "data-testid": testId = "executive-stage",
}: ExecutiveStageProps) {
  const runtime = executiveContextRuntimePublicIndex;
  const runtimeAvailable = runtime.readiness === "ReadyForConsumer";

  return (
    <section
      data-testid={testId}
      data-stage="ExecutiveStage"
      data-phase="EX-1:1"
      data-visual-state={visualState}
      data-runtime-id={runtime.id}
      data-runtime-available={runtimeAvailable ? "true" : "false"}
      data-layer-count={ExecutiveStageLayers.length}
      aria-label="Executive Stage"
      aria-busy={
        visualState === "Loading" || visualState === "Initializing"
      }
    >
      <ExecutiveStageSurface visualState={visualState}>
        <ExecutiveObjectLayer visualState={visualState} />
        <ExecutiveRelationshipLayer visualState={visualState} />
        <ExecutiveFocusLayer
          visualState={visualState}
          focusedObjectId={focusedObjectId}
          focusedRegionId={focusedRegionId}
        />
        <ExecutiveInteractionLayer visualState={visualState} />
        <ExecutiveStageOverlay
          visualState={
            !runtimeAvailable && visualState === "Ready"
              ? "Error"
              : visualState
          }
          overlayKind={
            !runtimeAvailable && !overlayKind
              ? "unavailable-runtime"
              : overlayKind
          }
        />
        {children}
      </ExecutiveStageSurface>
    </section>
  );
}

/** Deterministic Foundation summary for registry readiness. */
export function getExecutiveStageFoundationSummary() {
  return Object.freeze({
    foundationId: ExecutiveStageFoundationId,
    version: ExecutiveStageFoundationVersion,
    name: ExecutiveStageFoundationName,
    namespace: ExecutiveStageFoundationNamespace,
    status: ExecutiveStageFoundationStatus,
    readiness: ExecutiveStageFoundationReadiness,
    layerCount: ExecutiveStageLayers.length,
    runtimeDependency: "executiveContextRuntimePublicIndex" as const,
    sourceRuntimePublicIndex:
      ExecutiveStageFoundationMeta.identity.sourceRuntimePublicIndex,
    nextPhase: ExecutiveStageFoundationNextPhase,
    ownsBusinessState: false as const,
    projectionOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
