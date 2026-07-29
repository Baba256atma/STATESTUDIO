/**
 * EX-1:1 — Executive Focus Layer.
 *
 * Visualises executive attention. Focus originates exclusively from Runtime.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import type { ExecutiveStageLayerProps } from "./executiveStageTypes.ts";

export interface ExecutiveFocusLayerProps extends ExecutiveStageLayerProps {
  readonly focusedObjectId?: string | null;
  readonly focusedRegionId?: string | null;
}

/**
 * Focus Layer — focused object / region projection from Runtime.
 */
export function ExecutiveFocusLayer({
  visualState = "Ready",
  focusedObjectId = null,
  focusedRegionId = null,
  "data-testid": testId = "executive-focus-layer",
}: ExecutiveFocusLayerProps) {
  const hasFocus = Boolean(focusedObjectId || focusedRegionId);

  return (
    <div
      data-testid={testId}
      data-layer="FocusLayer"
      data-visual-state={visualState}
      data-has-focus={hasFocus ? "true" : "false"}
      data-focused-object={focusedObjectId ?? ""}
      data-focused-region={focusedRegionId ?? ""}
      aria-label="Executive Focus Layer"
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        inset: "clamp(2rem, 4vw, 4.5rem)",
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {hasFocus ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: "min(22rem, 48%)",
            height: "min(14rem, 36%)",
            transform: "translate(-50%, -50%)",
            border: "1px solid color-mix(in oklab, var(--ex-stage-accent) 55%, transparent)",
            boxShadow:
              "0 0 0 1px color-mix(in oklab, var(--ex-stage-accent) 18%, transparent), 0 0 48px color-mix(in oklab, var(--ex-stage-accent) 12%, transparent)",
          }}
        />
      ) : null}
    </div>
  );
}

export const ExecutiveFocusLayerMeta = Object.freeze({
  layerName: "FocusLayer" as const,
  responsibilities: Object.freeze([
    "focused object",
    "focused region",
    "focus clearing",
    "Runtime focus synchronisation",
  ] as const),
  focusOrigin: "Runtime" as const,
  metadataOnly: false as const,
  immutable: true as const,
} as const);
