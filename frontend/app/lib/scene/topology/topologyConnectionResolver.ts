/**
 * Resolve topology connection metadata into render-ready scene lines (pure, read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { logTopologyConnectionBrake } from "./topologyConnectionDevLog.ts";
import type {
  SceneConnectionLine,
  TopologyConnectionResolution,
} from "./topologyConnectionTypes.ts";
import { isValidScenePosition, type ScenePosition } from "./topologyScenePositioning.ts";
import {
  auditTopologyConnectionEndpointAlignment,
  resolveTopologyRuntimePosition,
} from "./topologyRuntimePosition.ts";
import type { SceneTopologyBinding } from "./topologySceneBindingTypes.ts";

const ZERO_POSITION = Object.freeze({ x: 0, y: 0, z: 0 });

function clonePosition(position: ScenePosition): ScenePosition {
  return { x: position.x, y: position.y, z: position.z };
}

export function buildTopologyConnectionLineId(sourceId: string, targetId: string): string {
  return `${sourceId}__to__${targetId}`;
}

export function resolveTopologyConnectionLines(input: {
  connections: readonly {
    sourceId: string;
    targetId: string;
  }[];
  runtimeLayoutPositions?: Record<string, [number, number, number]>;
  bindings?: readonly SceneTopologyBinding[];
  sceneObjects?: readonly SceneObject[];
  topologyEnabled?: boolean;
  sceneObjectCount?: number;
}): TopologyConnectionResolution {
  const connections = Array.isArray(input.connections) ? input.connections : [];
  const warnings: string[] = [];
  const lines: SceneConnectionLine[] = [];
  const seenLineIds = new Set<string>();
  const topologyEnabled = input.topologyEnabled === true;
  const sceneObjectCount = Number.isFinite(input.sceneObjectCount)
    ? Number(input.sceneObjectCount)
    : 0;

  const positionContext = {
    runtimeLayoutPositions: input.runtimeLayoutPositions,
    bindings: input.bindings,
    sceneObjects: input.sceneObjects,
    topologyEnabled,
  };

  if (
    connections.length === 0 &&
    topologyEnabled &&
    sceneObjectCount > 1
  ) {
    logTopologyConnectionBrake("No connections found");
  }

  for (const connection of connections) {
    const sourceId = String(connection?.sourceId ?? "").trim();
    const targetId = String(connection?.targetId ?? "").trim();
    const connectionLabel = `${sourceId} -> ${targetId}`;

    if (!sourceId || !targetId) {
      warnings.push(`Missing connection endpoint: ${connectionLabel}`);
      continue;
    }

    if (sourceId === targetId) {
      const warning = `Self-connection ignored: ${sourceId}`;
      warnings.push(warning);
      logTopologyConnectionBrake(warning);
      continue;
    }

    const lineId = buildTopologyConnectionLineId(sourceId, targetId);
    if (seenLineIds.has(lineId)) {
      logTopologyConnectionBrake(`Duplicate connection ignored: ${sourceId} -> ${targetId}`);
      warnings.push(`Duplicate connection ignored: ${connectionLabel}`);
      continue;
    }
    seenLineIds.add(lineId);

    const sourceResolved = resolveTopologyRuntimePosition({
      objectId: sourceId,
      ...positionContext,
    });
    const targetResolved = resolveTopologyRuntimePosition({
      objectId: targetId,
      ...positionContext,
    });
    const sourcePosition = sourceResolved.position;
    const targetPosition = targetResolved.position;
    let valid = true;

    if (!isValidScenePosition(sourcePosition)) {
      valid = false;
      const warning = `Invalid source position for connection: ${connectionLabel}`;
      warnings.push(warning);
      logTopologyConnectionBrake(warning);
    } else if (sourceResolved.source === "origin" && topologyEnabled) {
      valid = false;
      const warning = `Missing source position for connection: ${connectionLabel}`;
      warnings.push(warning);
      logTopologyConnectionBrake(warning);
    }

    if (!isValidScenePosition(targetPosition)) {
      valid = false;
      const warning = `Invalid target position for connection: ${connectionLabel}`;
      warnings.push(warning);
      logTopologyConnectionBrake(warning);
    } else if (targetResolved.source === "origin" && topologyEnabled) {
      valid = false;
      const warning = `Missing target position for connection: ${connectionLabel}`;
      warnings.push(warning);
      logTopologyConnectionBrake(warning);
    }

    lines.push({
      id: lineId,
      sourceId,
      targetId,
      sourcePosition: isValidScenePosition(sourcePosition)
        ? clonePosition(sourcePosition)
        : { ...ZERO_POSITION },
      targetPosition: isValidScenePosition(targetPosition)
        ? clonePosition(targetPosition)
        : { ...ZERO_POSITION },
      valid,
    });
  }

  auditTopologyConnectionEndpointAlignment({
    lines,
    runtimeLayoutPositions: input.runtimeLayoutPositions,
    bindings: input.bindings,
    sceneObjects: input.sceneObjects,
    topologyEnabled,
  });

  const validLineCount = lines.filter((line) => line.valid).length;

  return {
    lines,
    diagnostics: {
      connectionCount: connections.length,
      validLineCount,
      invalidLineCount: lines.length - validLineCount,
      warnings,
    },
  };
}
