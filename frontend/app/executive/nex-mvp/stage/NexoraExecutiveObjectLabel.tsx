"use client";

import { Html } from "@react-three/drei";
import type { ExecutiveObjectLabelPresentation } from "@/app/lib/spatial-presentation/executiveObjectLabelInformationDensity";

type Props = {
  readonly label: ExecutiveObjectLabelPresentation;
  readonly testId?: string;
  readonly auditAttributes?: Readonly<Record<string, string | undefined>>;
};

/**
 * Dumb Stage label renderer — consumes SP:2.5 resolved presentation only.
 * No status/attention branching. Pointer-transparent by contract.
 */
export function NexoraExecutiveObjectLabel({
  label,
  testId,
  auditAttributes,
}: Props) {
  if (!label.visible || !label.showName) return null;

  const color =
    label.tone === "object.label.primary"
      ? "#f8fafc"
      : label.tone === "object.label.assist"
        ? "rgba(226, 232, 240, 0.78)"
        : "rgba(226, 232, 240, 0.72)";

  return (
    <Html
      center
      distanceFactor={10}
      position={[
        label.anchor.worldOffsetX ?? 0,
        label.anchor.worldOffsetY ?? label.anchor.offset,
        0,
      ]}
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: label.pointerEvents,
        userSelect: "none",
        whiteSpace: "nowrap",
        fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        fontSize: `${label.fontSizePx}px`,
        // SP:2.8 — quieter letter-spacing / line height so labels support geometry.
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color,
        opacity: label.opacity,
        transform: `translate(${label.anchor.screenOffsetX}px, ${label.anchor.screenOffsetY}px) scale(${label.scale})`,
        transformOrigin: "center bottom",
        textAlign: "center",
        lineHeight: 1.15,
        textShadow: "0 1px 6px rgba(2, 6, 14, 0.75)",
      }}
    >
      <span
        data-testid={testId}
        data-label-level={label.level}
        data-label-prominence={label.prominence}
        data-label-priority={String(label.priorityRank)}
        data-show-state-cue={label.showStateCue ? "true" : "false"}
        data-show-primary-value={label.showPrimaryValue ? "true" : "false"}
        data-face-camera={label.anchor.faceCamera ? "true" : "false"}
        data-label-upright={label.anchor.upright ? "true" : "false"}
        data-visual-audit="stage-object-label"
        {...auditAttributes}
      >
        {label.lines.map((line, index) => (
          <span
            key={`${label.objectId}-line-${index}`}
            style={{
              display: "block",
              fontWeight: index === 0 ? 600 : 500,
              // Secondary lines (state/value) stay subordinate to identity.
              opacity: index === 0 ? 1 : 0.78,
              letterSpacing: index === 0 ? "0.04em" : "0.02em",
            }}
          >
            {line}
          </span>
        ))}
      </span>
    </Html>
  );
}
