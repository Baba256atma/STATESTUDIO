"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

import type { SceneConnectionLine } from "../../../lib/scene/topology/topologyConnectionTypes";
import {
  auditTopologyConnectionHighlight,
  resolveTopologyLineVisualState,
  type TopologyLineVisualState,
} from "../../../lib/scene/topology/topologyConnectionHighlight";
import { buildTopologyConnectionGeometrySignature } from "../../../lib/scene/topology/connectionGeometrySignature";
import { resolveStableTopologyLineGeometries } from "../../../lib/scene/topology/connectionGeometryRuntime";
import { logTopologyLineResolved } from "../../../lib/scene/topology/topologyRuntimePositionDevLog";

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

const TopologyConnectionLineSegment = React.memo(function TopologyConnectionLineSegment({
  geometry,
  visualState,
}: {
  geometry: THREE.BufferGeometry;
  visualState: TopologyLineVisualState;
}): React.ReactElement {
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

  const connectionGeometrySignature = useMemo(
    () => buildTopologyConnectionGeometrySignature(geometryLines),
    [geometryLines]
  );

  const lineGeometries = useMemo(
    () =>
      resolveStableTopologyLineGeometries({
        lines: geometryLines,
        signature: connectionGeometrySignature,
        selectedObjectId,
        reason: visible ? "topology-lines-visible" : "topology-lines-hidden",
      }),
    [connectionGeometrySignature, geometryLines, visible]
  );

  const renderedLines = useMemo(() => {
    if (!visible) return [] as Array<{ line: SceneConnectionLine; visualState: TopologyLineVisualState }>;
    return geometryLines.map((line) => ({
      line,
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
          ({ line }) =>
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
    for (const { line } of renderedLines) {
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
      {renderedLines.map(({ line, visualState }) => {
        const geometry = lineGeometries.get(line.id);
        if (!geometry) return null;
        return (
          <TopologyConnectionLineSegment
            key={line.id}
            geometry={geometry}
            visualState={visualState}
          />
        );
      })}
    </group>
  );
}

export const TopologyConnectionLines = React.memo(TopologyConnectionLinesComponent);
