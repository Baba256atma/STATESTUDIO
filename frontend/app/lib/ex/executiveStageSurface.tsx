/**
 * EX-1:1 — Executive Stage Surface.
 *
 * Defines the visual workspace: layout boundaries, scene dimensions,
 * background composition, interaction region, and viewport.
 * No business objects are created here.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import type { ReactNode } from "react";
import type { ExecutiveStageLayerProps } from "./executiveStageTypes.ts";

/**
 * Stage Surface — calm visual workspace for the executive scene.
 */
export function ExecutiveStageSurface({
  visualState = "Ready",
  "data-testid": testId = "executive-stage-surface",
  children,
}: ExecutiveStageLayerProps & { readonly children?: ReactNode }) {
  return (
    <section
      data-testid={testId}
      data-layer="StageSurface"
      data-visual-state={visualState}
      aria-label="Executive Stage Surface"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        isolation: "isolate",
        overflow: "hidden",
        background:
          "radial-gradient(120% 80% at 50% 0%, var(--ex-stage-glow) 0%, transparent 55%), linear-gradient(165deg, var(--ex-stage-deep) 0%, var(--ex-stage-mid) 48%, var(--ex-stage-base) 100%)",
        color: "var(--ex-stage-ink)",
      }}
    >
      <div
        data-region="viewport"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          minHeight: "36rem",
          padding: "clamp(2rem, 4vw, 4.5rem)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export const ExecutiveStageSurfaceMeta = Object.freeze({
  layerName: "StageSurface" as const,
  responsibilities: Object.freeze([
    "layout boundaries",
    "scene dimensions",
    "background composition",
    "interaction region",
    "viewport definition",
  ] as const),
  createsBusinessObjects: false as const,
  metadataOnly: false as const,
  immutable: true as const,
} as const);
