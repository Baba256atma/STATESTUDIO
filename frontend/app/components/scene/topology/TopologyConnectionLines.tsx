"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

import type { SceneConnectionLine } from "../../../lib/scene/topology/topologyConnectionTypes";
import {
  auditTopologyConnectionHighlight,
  resolveTopologyLineVisualState,
  type TopologyLineVisualState,
} from "../../../lib/scene/topology/topologyConnectionHighlight";
import { logTopologyLineResolved } from "../../../lib/scene/topology/topologyRuntimePositionDevLog";
import {
  recordGeometryCreated,
  recordGeometryDisposed,
} from "../../../lib/diagnostics/connectionRuntimeStabilityAudit";

export type TopologyConnectionLinesProps = {
  lines: SceneConnectionLine[];
  visible?: boolean;
  selectedObjectId?: string | null;
};

const TOPOLOGY_LINE_COLORS = {
  dim: "#64748b",
  active: "#e5e7eb",
} as const;

const TOPOLOGY_LINE_DIM_OPACITY = 0.28;
const TOPOLOGY_LINE_ACTIVE_OPACITY = 0.72;

type RenderedTopologyLine = SceneConnectionLine & {
  visualState: TopologyLineVisualState;
};

function buildSingleLineGeometry(line: SceneConnectionLine): THREE.BufferGeometry {
  recordGeometryCreated("topology-connection-line", line.id);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        line.sourcePosition.x,
        line.sourcePosition.y,
        line.sourcePosition.z,
        line.targetPosition.x,
        line.targetPosition.y,
        line.targetPosition.z,
      ],
      3
    )
  );
  return geometry;
}

const TopologyConnectionLineSegment = React.memo(function TopologyConnectionLineSegment({
  line,
  visualState,
}: {
  line: SceneConnectionLine;
  visualState: TopologyLineVisualState;
}): React.ReactElement {
  const geometry = useMemo(() => buildSingleLineGeometry(line), [
    line.id,
    line.sourcePosition.x,
    line.sourcePosition.y,
    line.sourcePosition.z,
    line.targetPosition.x,
    line.targetPosition.y,
    line.targetPosition.z,
  ]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      recordGeometryDisposed("topology-connection-line", line.id);
    };
  }, [geometry, line.id]);

  const isActive = visualState === "active";

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={TOPOLOGY_LINE_COLORS[visualState]}
        transparent
        opacity={isActive ? TOPOLOGY_LINE_ACTIVE_OPACITY : TOPOLOGY_LINE_DIM_OPACITY}
        depthWrite={false}
      />
    </lineSegments>
  );
});

function TopologyConnectionLinesComponent({
  lines,
  visible = true,
  selectedObjectId = null,
}: TopologyConnectionLinesProps): React.ReactElement | null {
  const geometryLines = useMemo(() => {
    if (!visible) return [] as SceneConnectionLine[];
    return lines.filter((line) => line.valid);
  }, [lines, visible]);

  const renderedLines = useMemo(() => {
    if (!visible) return [] as RenderedTopologyLine[];
    return geometryLines.map((line) => ({
      ...line,
      visualState: resolveTopologyLineVisualState({
        line,
        selectedObjectId,
      }),
    }));
  }, [geometryLines, selectedObjectId, visible]);

  const lineResolvedSignature = useMemo(
    () =>
      renderedLines
        .map(
          (line) =>
            `${line.id}:${line.sourcePosition.x.toFixed(3)},${line.sourcePosition.y.toFixed(3)},${line.sourcePosition.z.toFixed(3)}:${line.targetPosition.x.toFixed(3)},${line.targetPosition.y.toFixed(3)},${line.targetPosition.z.toFixed(3)}`
        )
        .join("|"),
    [renderedLines]
  );

  useEffect(() => {
    auditTopologyConnectionHighlight({
      lines,
      selectedObjectId,
      visible,
      topologyEnabled: visible,
    });
  }, [lines, selectedObjectId, visible]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!visible || renderedLines.length === 0) return;
    for (const line of renderedLines) {
      logTopologyLineResolved(
        JSON.stringify({
          sourceId: line.sourceId,
          targetId: line.targetId,
          sourcePosition: line.sourcePosition,
          targetPosition: line.targetPosition,
        })
      );
    }
  }, [lineResolvedSignature, renderedLines, visible]);

  if (!visible || renderedLines.length === 0) {
    return null;
  }

  return (
    <group>
      {renderedLines.map((line) => (
        <TopologyConnectionLineSegment
          key={line.id}
          line={line}
          visualState={line.visualState}
        />
      ))}
    </group>
  );
}

export const TopologyConnectionLines = React.memo(TopologyConnectionLinesComponent);
