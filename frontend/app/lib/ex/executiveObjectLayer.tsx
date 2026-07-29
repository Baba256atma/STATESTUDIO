/**
 * EX-1:1 — Executive Object Layer.
 *
 * Placeholder rendering for Runtime objects.
 * Business rendering is introduced later.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import type { ExecutiveStageLayerProps } from "./executiveStageTypes.ts";

/**
 * Object Layer — object containers and identity binding placeholders.
 */
export function ExecutiveObjectLayer({
  visualState = "Ready",
  "data-testid": testId = "executive-object-layer",
}: ExecutiveStageLayerProps) {
  return (
    <div
      data-testid={testId}
      data-layer="ObjectLayer"
      data-visual-state={visualState}
      aria-label="Executive Object Layer"
      role="group"
      style={{
        position: "absolute",
        inset: "clamp(2rem, 4vw, 4.5rem)",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--ex-stage-font)",
          fontSize: "0.95rem",
          letterSpacing: "0.04em",
          color: "var(--ex-stage-muted)",
          maxWidth: "28rem",
        }}
      >
        Object placeholders bind to Runtime identities. Business rendering is
        deferred.
      </p>
    </div>
  );
}

export const ExecutiveObjectLayerMeta = Object.freeze({
  layerName: "ObjectLayer" as const,
  responsibilities: Object.freeze([
    "object containers",
    "object identity binding",
    "selection state",
    "visibility state",
  ] as const),
  businessRendering: false as const,
  metadataOnly: false as const,
  immutable: true as const,
} as const);
