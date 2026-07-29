/**
 * EX-1:1 — Executive Relationship Layer.
 *
 * Reserves space for object relationships.
 * Relationship graphics are not implemented in this phase.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import type { ExecutiveStageLayerProps } from "./executiveStageTypes.ts";

/**
 * Relationship Layer — rendering order and Runtime connection only.
 */
export function ExecutiveRelationshipLayer({
  visualState = "Ready",
  "data-testid": testId = "executive-relationship-layer",
}: ExecutiveStageLayerProps) {
  return (
    <div
      data-testid={testId}
      data-layer="RelationshipLayer"
      data-visual-state={visualState}
      aria-label="Executive Relationship Layer"
      role="group"
      style={{
        position: "absolute",
        inset: "clamp(2rem, 4vw, 4.5rem)",
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: "1px dashed color-mix(in oklab, var(--ex-stage-muted) 35%, transparent)",
          borderRadius: "0",
        }}
      />
    </div>
  );
}

export const ExecutiveRelationshipLayerMeta = Object.freeze({
  layerName: "RelationshipLayer" as const,
  responsibilities: Object.freeze([
    "layer identity",
    "rendering order",
    "Runtime connection",
  ] as const),
  relationshipGraphics: false as const,
  metadataOnly: false as const,
  immutable: true as const,
} as const);
