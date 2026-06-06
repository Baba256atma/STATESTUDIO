import * as THREE from "three";

import { devLogThrottled } from "../../runtime/diagnosticThrottle.ts";
import {
  recordConnectionLineRebuild,
  recordGeometryCreated,
  recordGeometryDisposed,
} from "../../diagnostics/connectionRuntimeStabilityAudit.ts";
import type { SceneConnectionLine } from "./topologyConnectionTypes.ts";
import { buildTopologyConnectionGeometrySignature } from "./connectionGeometrySignature.ts";

type GeometryCacheEntry<T> = {
  signature: string;
  value: T;
  geometryCreatedDelta: number;
};

let topologyLineGeometryCache: GeometryCacheEntry<Map<string, THREE.BufferGeometry>> | null = null;
let overlayFlowGeometryCache: GeometryCacheEntry<THREE.BufferGeometry | null> | null = null;
const loopLineGeometryCache = new Map<string, GeometryCacheEntry<THREE.BufferGeometry | null>>();

function logConnectionGeometryEvent(
  label:
    | "[NEXORA_CONNECTION_GEOMETRY_REUSE]"
    | "[NEXORA_CONNECTION_GEOMETRY_REBUILD_BLOCKED_ON_SELECTION]"
    | "[NEXORA_CONNECTION_GEOMETRY_REBUILT]",
  payload: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devLogThrottled({
    key: `${label}:${String(payload.reason ?? "unknown")}:${String(payload.nextSignature ?? payload.previousSignature ?? "none")}`,
    label,
    scope: "connectionGeometry",
    intervalMs: label === "[NEXORA_CONNECTION_GEOMETRY_REBUILT]" ? 1000 : 2500,
    payload,
  });
}

function buildTopologyLineGeometry(line: SceneConnectionLine): THREE.BufferGeometry {
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

function disposeTopologyLineGeometries(geometries: Map<string, THREE.BufferGeometry>): void {
  geometries.forEach((geometry, lineId) => {
    geometry.dispose();
    recordGeometryDisposed("topology-connection-line", lineId);
  });
}

export function resolveStableTopologyLineGeometries(input: {
  lines: readonly SceneConnectionLine[];
  signature?: string;
  selectedObjectId?: string | null;
  reason: string;
}): Map<string, THREE.BufferGeometry> {
  const signature = input.signature ?? buildTopologyConnectionGeometrySignature(input.lines);
  const previousSignature = topologyLineGeometryCache?.signature ?? null;
  const connectionCount = input.lines.filter((line) => line.valid).length;

  if (topologyLineGeometryCache && topologyLineGeometryCache.signature === signature) {
    logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REUSE]", {
      reason: input.reason,
      previousSignature,
      nextSignature: signature,
      selectedObjectId: input.selectedObjectId ?? null,
      connectionCount,
      geometryCreatedDelta: 0,
    });
    return topologyLineGeometryCache.value;
  }

  if (
    topologyLineGeometryCache &&
    previousSignature === signature &&
    input.reason.includes("selection")
  ) {
    logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REBUILD_BLOCKED_ON_SELECTION]", {
      reason: input.reason,
      previousSignature,
      nextSignature: signature,
      selectedObjectId: input.selectedObjectId ?? null,
      connectionCount,
      geometryCreatedDelta: 0,
    });
    return topologyLineGeometryCache.value;
  }

  const geometries = new Map<string, THREE.BufferGeometry>();
  const createdBefore = topologyLineGeometryCache?.geometryCreatedDelta ?? 0;
  for (const line of input.lines) {
    if (!line.valid) continue;
    geometries.set(line.id, buildTopologyLineGeometry(line));
  }
  recordConnectionLineRebuild("topology-connection-lines");

  if (topologyLineGeometryCache) {
    disposeTopologyLineGeometries(topologyLineGeometryCache.value);
  }

  const geometryCreatedDelta = geometries.size;
  topologyLineGeometryCache = {
    signature,
    value: geometries,
    geometryCreatedDelta,
  };

  logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REBUILT]", {
    reason: input.reason,
    previousSignature,
    nextSignature: signature,
    selectedObjectId: input.selectedObjectId ?? null,
    connectionCount,
    geometryCreatedDelta: geometryCreatedDelta - createdBefore,
  });

  return geometries;
}

export function resolveStableOverlayFlowGeometry(input: {
  signature: string;
  selectedObjectId?: string | null;
  reason: string;
  build: () => THREE.BufferGeometry | null;
}): THREE.BufferGeometry | null {
  const previousSignature = overlayFlowGeometryCache?.signature ?? null;
  if (overlayFlowGeometryCache && overlayFlowGeometryCache.signature === input.signature) {
    logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REUSE]", {
      reason: input.reason,
      previousSignature,
      nextSignature: input.signature,
      selectedObjectId: input.selectedObjectId ?? null,
      connectionCount: 0,
      geometryCreatedDelta: 0,
    });
    return overlayFlowGeometryCache.value;
  }

  if (
    overlayFlowGeometryCache &&
    previousSignature === input.signature &&
    input.reason.includes("selection")
  ) {
    logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REBUILD_BLOCKED_ON_SELECTION]", {
      reason: input.reason,
      previousSignature,
      nextSignature: input.signature,
      selectedObjectId: input.selectedObjectId ?? null,
      connectionCount: 0,
      geometryCreatedDelta: 0,
    });
    return overlayFlowGeometryCache.value;
  }

  const geometry = input.build();
  if (overlayFlowGeometryCache?.value) {
    overlayFlowGeometryCache.value.dispose();
    recordGeometryDisposed("overlay-flow-lines");
  }
  overlayFlowGeometryCache = {
    signature: input.signature,
    value: geometry,
    geometryCreatedDelta: geometry ? 1 : 0,
  };
  logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REBUILT]", {
    reason: input.reason,
    previousSignature,
    nextSignature: input.signature,
    selectedObjectId: input.selectedObjectId ?? null,
    connectionCount: 0,
    geometryCreatedDelta: geometry ? 1 : 0,
  });
  return geometry;
}

export function resolveStableLoopLineGeometry(input: {
  cacheKey: string;
  signature: string;
  selectedObjectId?: string | null;
  reason: string;
  build: () => THREE.BufferGeometry | null;
}): THREE.BufferGeometry | null {
  const cached = loopLineGeometryCache.get(input.cacheKey) ?? null;
  const previousSignature = cached?.signature ?? null;
  if (cached && cached.signature === input.signature) {
    logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REUSE]", {
      reason: input.reason,
      previousSignature,
      nextSignature: input.signature,
      selectedObjectId: input.selectedObjectId ?? null,
      connectionCount: 0,
      geometryCreatedDelta: 0,
    });
    return cached.value;
  }

  const geometry = input.build();
  recordConnectionLineRebuild(input.cacheKey);
  if (cached?.value) {
    cached.value.dispose();
    recordGeometryDisposed("loop-lines");
  }
  loopLineGeometryCache.set(input.cacheKey, {
    signature: input.signature,
    value: geometry,
    geometryCreatedDelta: geometry ? 1 : 0,
  });
  logConnectionGeometryEvent("[NEXORA_CONNECTION_GEOMETRY_REBUILT]", {
    reason: input.reason,
    previousSignature,
    nextSignature: input.signature,
    selectedObjectId: input.selectedObjectId ?? null,
    connectionCount: 0,
    geometryCreatedDelta: geometry ? 1 : 0,
  });
  return geometry;
}

export function resetConnectionGeometryRuntimeForTests(): void {
  if (topologyLineGeometryCache) {
    disposeTopologyLineGeometries(topologyLineGeometryCache.value);
  }
  topologyLineGeometryCache = null;
  if (overlayFlowGeometryCache?.value) {
    overlayFlowGeometryCache.value.dispose();
  }
  overlayFlowGeometryCache = null;
  loopLineGeometryCache.forEach((entry) => {
    entry.value?.dispose();
  });
  loopLineGeometryCache.clear();
}
