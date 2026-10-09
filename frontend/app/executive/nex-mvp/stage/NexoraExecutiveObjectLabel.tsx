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
      ? "var(--nx-text-strong)"
      : label.tone === "object.label.assist"
        ? "var(--nx-text-soft)"
        : "var(--nx-muted)";

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
        whiteSpace: "normal",
        maxWidth: `${Math.max(label.maxNameCharacters, 16)}ch`,
        fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        fontSize: `${label.fontSizePx}px`,
        // SP:2.8 — quieter letter-spacing / line height so labels support geometry.
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color,
        opacity: label.opacity,
        transform: `translate(${label.anchor.screenOffsetX}px, ${label.anchor.screenOffsetY}px) scale(${label.scale})`,
        transformOrigin:
          (label.anchor.worldOffsetY ?? 0) < -0.05
            ? "center top"
            : "center bottom",
        textAlign: "center",
        lineHeight: 1.15,
        textShadow: "var(--nx-label-halo)",
      }}
    >
      <span
        data-object-caption="primary"
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
            data-caption-role={index === 0 ? "primary" : "secondary"}
            style={{
              display: "block",
              fontWeight: index === 0 ? 700 : 500,
              // Secondary lines (state/value) stay subordinate to identity.
              opacity: index === 0 ? 1 : 0.58,
              letterSpacing: index === 0 ? "0.045em" : "0.03em",
              fontSize: index === 0 ? "1em" : "0.92em",
            }}
          >
            {line}
          </span>
        ))}
      </span>
    </Html>
  );
}
