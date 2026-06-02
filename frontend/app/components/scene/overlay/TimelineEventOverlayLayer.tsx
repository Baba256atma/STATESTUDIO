"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import type { SpatialTimelineEventAnchor } from "../../../lib/scene/timeline/spatialTimeIntelligenceTypes";
import { getObjPos } from "../sceneRenderUtils";

export type TimelineEventOverlayLayerProps = {
  objects: any[];
  anchors: readonly SpatialTimelineEventAnchor[];
  visibleAnchorIds: readonly string[];
  selectedEventId?: string | null;
  hoveredEventId?: string | null;
  viewMode?: "2D" | "3D" | string | null;
  visible?: boolean;
};

const SEVERITY_COLOR: Record<string, string> = {
  info: "#7aa7c7",
  watch: "#8ea8d8",
  warning: "#d4a24f",
  critical: "#d86a6a",
};

const MARKER_GLYPH: Record<string, string> = {
  decision: "D",
  risk: "!",
  scenario: "S",
  operational: "O",
  recovery: "R",
};

function markerOpacity(anchor: SpatialTimelineEventAnchor, selected: boolean, hovered: boolean): number {
  let opacity = anchor.severity === "critical" ? 0.92 : anchor.severity === "warning" ? 0.82 : 0.62;
  if (selected) opacity = 0.98;
  else if (hovered) opacity = Math.min(0.95, opacity + 0.12);
  else if (anchor.eventStatus !== "active" && anchor.spatialStatus !== "active") opacity *= 0.72;
  return opacity;
}

function markerScale(anchor: SpatialTimelineEventAnchor, selected: boolean, hovered: boolean, viewMode?: string | null): number {
  const base = viewMode === "2D" ? 0.11 : 0.08;
  if (selected) return base * 1.35;
  if (hovered) return base * 1.18;
  if (anchor.severity === "critical") return base * 1.12;
  return base;
}

function TimelineEventMarker(props: {
  anchor: SpatialTimelineEventAnchor;
  objects: any[];
  selected: boolean;
  hovered: boolean;
  viewMode?: string | null;
}): React.ReactElement | null {
  const objectId = props.anchor.objectId ?? props.anchor.objectIds?.[0] ?? null;
  const position = useMemo(() => {
    if (objectId) {
      const pos = getObjPos(objectId, props.objects);
      return new THREE.Vector3(pos.x, pos.y + (props.viewMode === "2D" ? 0.08 : 0.22), pos.z);
    }
    if (props.anchor.position) {
      const [x, y, z] = props.anchor.position;
      return new THREE.Vector3(x, y + 0.18, z);
    }
    return null;
  }, [objectId, props.anchor.position, props.objects, props.viewMode]);

  if (!position || props.anchor.kind === "global") return null;

  const color = SEVERITY_COLOR[props.anchor.severity] ?? SEVERITY_COLOR.info;
  const opacity = markerOpacity(props.anchor, props.selected, props.hovered);
  const scale = markerScale(props.anchor, props.selected, props.hovered, props.viewMode);
  const showLabel = props.selected || props.hovered || props.anchor.severity === "critical";

  return (
    <group position={position.toArray()} data-nx-timeline-marker={props.anchor.eventId}>
      <mesh scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={props.selected || props.hovered ? 0.45 : 0.18}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} scale={[scale * 1.8, scale * 1.8, 1]}>
        <ringGeometry args={[0.55, 0.85, 24]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.55} />
      </mesh>
      {showLabel ? (
        <Html
          center
          distanceFactor={props.viewMode === "2D" ? 14 : 10}
          style={{
            pointerEvents: "none",
            transform: "translate3d(-50%, -140%, 0)",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              padding: "2px 6px",
              borderRadius: 6,
              background: "rgba(8, 14, 24, 0.82)",
              border: `1px solid ${color}`,
              color: "#eef4ff",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 4px 16px rgba(0,0,0,0.28)",
            }}
          >
            {MARKER_GLYPH[props.anchor.markerType] ?? "•"} {props.anchor.title}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export const TimelineEventOverlayLayer = React.memo(function TimelineEventOverlayLayer(
  props: TimelineEventOverlayLayerProps
): React.ReactElement | null {
  const visibleSet = useMemo(() => new Set(props.visibleAnchorIds), [props.visibleAnchorIds]);
  const renderedAnchors = useMemo(
    () => props.anchors.filter((anchor) => visibleSet.has(anchor.eventId) && anchor.kind !== "global"),
    [props.anchors, visibleSet]
  );

  if (props.visible === false || renderedAnchors.length === 0) return null;

  return (
    <group data-nx-overlay="timeline-events">
      {renderedAnchors.map((anchor) => (
        <TimelineEventMarker
          key={anchor.eventId}
          anchor={anchor}
          objects={props.objects}
          selected={props.selectedEventId === anchor.eventId}
          hovered={props.hoveredEventId === anchor.eventId}
          viewMode={props.viewMode}
        />
      ))}
    </group>
  );
});

export default TimelineEventOverlayLayer;
