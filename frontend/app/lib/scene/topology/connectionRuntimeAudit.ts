/**
 * AUDIT-REMOVE: Connection runtime audit instrumentation (diagnostics only).
 *
 * Traces every visible connection layer and reports whether endpoints use
 * topology runtime positions or legacy scene/object positions.
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { readPropagationPaths } from "../../propagation/propagationAuthoringRuntime.ts";
import type { SceneTopologyBinding } from "./topologySceneBindingTypes.ts";
import type { SceneConnectionLine } from "./topologyConnectionTypes.ts";
import {
  resolveTopologyRuntimePosition,
  topologyPositionDistance,
  type TopologyRuntimePositionSource,
} from "./topologyRuntimePosition.ts";
import { propagationOverlayToEdges } from "../../overlay/mergePropagationOverlay.ts";
import type { PropagationOverlayState } from "../../simulation/propagationTypes.ts";
import type { DecisionPathOverlayState } from "../../simulation/decisionPathOverlayTypes.ts";
import type { OverlayRuntimeVisibility } from "../../overlay/overlayContracts.ts";
import type { SceneLoop } from "../../sceneTypes.ts";

export const CONNECTION_TOPOLOGY_MATCH_THRESHOLD = 0.001;

export type ConnectionPositionProvider =
  | "topologyRuntime.position"
  | "resolvedTopologyPosition"
  | "layoutEngine.position"
  | "sceneObject.position"
  | "sceneObject.transform.pos"
  | "fallback.position"
  | "unknown";

export type ConnectionRuntimeLayer =
  | "topology"
  | "relationship"
  | "overlay_propagation"
  | "overlay_risk_flow"
  | "overlay_scenario"
  | "overlay_dependency"
  | "overlay_authored_propagation"
  | "loop";

export type ConnectionRuntimeClassification =
  | "topology-driven"
  | "legacy-position-driven"
  | "mixed-position-driven";

export type ConnectionRuntimeAuditRecord = {
  connectionId: string;
  layer: ConnectionRuntimeLayer;
  sourceObjectId: string;
  targetObjectId: string;
  sourceRenderPosition: { x: number; y: number; z: number };
  targetRenderPosition: { x: number; y: number; z: number };
  sourceTopologyPosition: { x: number; y: number; z: number };
  targetTopologyPosition: { x: number; y: number; z: number };
  activeSourcePositionProvider: ConnectionPositionProvider;
  activeTargetPositionProvider: ConnectionPositionProvider;
  sourcePositionMatch: number;
  targetPositionMatch: number;
  classification: ConnectionRuntimeClassification;
};

export type ConnectionRuntimeAuditSummary = {
  totalConnections: number;
  connectionsUsingTopology: number;
  connectionsUsingLegacyScenePositions: number;
  connectionsWithPositionMismatch: number;
  largestMismatchDistance: number;
  averageMismatchDistance: number;
  topologyPositionSourceActive: boolean;
};

export type ConnectionRuntimeAuditContext = {
  topologyEnabled: boolean;
  topologyLines: readonly SceneConnectionLine[];
  topologyConnectionLinesVisible: boolean;
  runtimeLayoutPositions?: Record<string, [number, number, number]>;
  bindings?: readonly SceneTopologyBinding[];
  sceneObjects: readonly SceneObject[];
  sceneJson: unknown;
  overlayVisibility: OverlayRuntimeVisibility;
  propagationOverlay: PropagationOverlayState | null;
  decisionPathOverlay: DecisionPathOverlayState | null;
  loops?: readonly SceneLoop[];
  showLoops?: boolean;
  viewMode?: string | null;
};

type AuditRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
};

type AuditEdge = {
  from: string;
  to: string;
};

function readAuditRelationships(sceneJson: unknown): AuditRelationship[] {
  const scene = (sceneJson as { scene?: { relationships?: unknown } } | null)?.scene;
  const raw = scene?.relationships;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      const record = entry as { id?: unknown; sourceId?: unknown; targetId?: unknown };
      const sourceId = String(record.sourceId ?? "").trim();
      const targetId = String(record.targetId ?? "").trim();
      if (!sourceId || !targetId) return null;
      return {
        id: String(record.id ?? `${sourceId}__to__${targetId}`),
        sourceId,
        targetId,
      };
    })
    .filter((entry): entry is AuditRelationship => entry != null);
}

function readDependencyOverlayEdges(sceneJson: unknown): AuditEdge[] {
  const scene = (sceneJson as { scene?: { dependencies?: unknown; relationships?: unknown } } | null)?.scene;
  const dependencyRaw = scene?.dependencies;
  if (Array.isArray(dependencyRaw)) {
    return dependencyRaw
      .map((entry) => {
        const record = entry as { from?: unknown; to?: unknown; sourceId?: unknown; targetId?: unknown };
        const from = String(record.from ?? record.sourceId ?? "").trim();
        const to = String(record.to ?? record.targetId ?? "").trim();
        if (!from || !to) return null;
        return { from, to };
      })
      .filter((entry): entry is AuditEdge => entry != null);
  }

  return readAuditRelationships(sceneJson)
    .filter((relationship) => relationship.sourceId && relationship.targetId)
    .map((relationship) => ({ from: relationship.sourceId, to: relationship.targetId }));
}

type ScenePosition = { x: number; y: number; z: number };

function readLegacySceneObjectPosition(objectId: string, objects: readonly any[]): ScenePosition {
  const found = objects.find((object) => object?.id === objectId);
  const candidates = [found?.position, found?.transform?.pos, found?.pos];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length >= 3) {
      return {
        x: Number(candidate[0]) || 0,
        y: Number(candidate[1]) || 0,
        z: Number(candidate[2]) || 0,
      };
    }
    if (candidate && typeof candidate === "object" && "x" in candidate && "y" in candidate && "z" in candidate) {
      return {
        x: Number((candidate as { x: unknown }).x) || 0,
        y: Number((candidate as { y: unknown }).y) || 0,
        z: Number((candidate as { z: unknown }).z) || 0,
      };
    }
  }
  return { x: 0, y: 0, z: 0 };
}

function readLegacyObjectPositionProvider(objectId: string, objects: readonly any[]): ConnectionPositionProvider {
  const found = objects.find((object) => object?.id === objectId);
  if (!found) return "fallback.position";
  if (Array.isArray(found.position) || (found.position && typeof found.position === "object")) {
    return "sceneObject.position";
  }
  if (Array.isArray(found.transform?.pos) || (found.transform?.pos && typeof found.transform?.pos === "object")) {
    return "sceneObject.transform.pos";
  }
  if (Array.isArray(found.pos) || (found.pos && typeof found.pos === "object")) {
    return "sceneObject.position";
  }
  return "fallback.position";
}

function readLayoutEnginePosition(
  objectId: string,
  layoutPositions?: Record<string, [number, number, number]>
): ScenePosition | null {
  if (!layoutPositions) return null;
  const tuple = layoutPositions[objectId];
  if (!tuple || tuple.length < 3) return null;
  return { x: tuple[0], y: tuple[1], z: tuple[2] };
}

function mapTopologySourceToProvider(source: TopologyRuntimePositionSource): ConnectionPositionProvider {
  if (source === "runtime_layout") return "topologyRuntime.position";
  if (source === "topology_binding") return "resolvedTopologyPosition";
  if (source === "json") return "sceneObject.position";
  return "fallback.position";
}

function resolveEndpointAudit(input: {
  objectId: string;
  renderPosition: ScenePosition;
  context: ConnectionRuntimeAuditContext;
}): {
  topologyPosition: ScenePosition;
  provider: ConnectionPositionProvider;
  delta: number;
} {
  const topology = resolveTopologyRuntimePosition({
    objectId: input.objectId,
    runtimeLayoutPositions: input.context.runtimeLayoutPositions,
    bindings: input.context.bindings,
    sceneObjects: input.context.sceneObjects,
    topologyEnabled: input.context.topologyEnabled,
  });

  const layoutPosition = readLayoutEnginePosition(input.objectId, input.context.runtimeLayoutPositions);
  const legacyPosition = readLegacySceneObjectPosition(input.objectId, input.context.sceneObjects as any[]);

  const candidates: Array<{ provider: ConnectionPositionProvider; position: ScenePosition }> = [
    { provider: mapTopologySourceToProvider(topology.source), position: topology.position },
  ];
  if (layoutPosition) {
    candidates.push({ provider: "layoutEngine.position", position: layoutPosition });
  }
  candidates.push({
    provider: readLegacyObjectPositionProvider(input.objectId, input.context.sceneObjects as any[]),
    position: legacyPosition,
  });

  let best = candidates[0]!;
  let bestDistance = topologyPositionDistance(input.renderPosition, best.position);
  for (const candidate of candidates.slice(1)) {
    const distance = topologyPositionDistance(input.renderPosition, candidate.position);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return {
    topologyPosition: topology.position,
    provider: best.provider,
    delta: topologyPositionDistance(input.renderPosition, topology.position),
  };
}

function classifyConnection(
  sourceProvider: ConnectionPositionProvider,
  targetProvider: ConnectionPositionProvider,
  sourceDelta: number,
  targetDelta: number
): ConnectionRuntimeClassification {
  const topologyProviders = new Set<ConnectionPositionProvider>([
    "topologyRuntime.position",
    "resolvedTopologyPosition",
    "layoutEngine.position",
  ]);
  const legacyProviders = new Set<ConnectionPositionProvider>([
    "sceneObject.position",
    "sceneObject.transform.pos",
    "fallback.position",
  ]);

  const sourceTopologyAligned = sourceDelta < CONNECTION_TOPOLOGY_MATCH_THRESHOLD;
  const targetTopologyAligned = targetDelta < CONNECTION_TOPOLOGY_MATCH_THRESHOLD;

  if (sourceTopologyAligned && targetTopologyAligned) {
    return "topology-driven";
  }

  if (legacyProviders.has(sourceProvider) && legacyProviders.has(targetProvider)) {
    return "legacy-position-driven";
  }

  if (topologyProviders.has(sourceProvider) && topologyProviders.has(targetProvider)) {
    return "mixed-position-driven";
  }

  return "mixed-position-driven";
}

function buildAuditRecord(input: {
  connectionId: string;
  layer: ConnectionRuntimeLayer;
  sourceObjectId: string;
  targetObjectId: string;
  sourceRenderPosition: ScenePosition;
  targetRenderPosition: ScenePosition;
  context: ConnectionRuntimeAuditContext;
}): ConnectionRuntimeAuditRecord {
  const source = resolveEndpointAudit({
    objectId: input.sourceObjectId,
    renderPosition: input.sourceRenderPosition,
    context: input.context,
  });
  const target = resolveEndpointAudit({
    objectId: input.targetObjectId,
    renderPosition: input.targetRenderPosition,
    context: input.context,
  });

  return {
    connectionId: input.connectionId,
    layer: input.layer,
    sourceObjectId: input.sourceObjectId,
    targetObjectId: input.targetObjectId,
    sourceRenderPosition: input.sourceRenderPosition,
    targetRenderPosition: input.targetRenderPosition,
    sourceTopologyPosition: source.topologyPosition,
    targetTopologyPosition: target.topologyPosition,
    activeSourcePositionProvider: source.provider,
    activeTargetPositionProvider: target.provider,
    sourcePositionMatch: source.delta,
    targetPositionMatch: target.delta,
    classification: classifyConnection(
      source.provider,
      target.provider,
      source.delta,
      target.delta
    ),
  };
}

function readLegacyObjPos(id: string, objects: readonly any[], yOffset = 0): ScenePosition {
  const position = readLegacySceneObjectPosition(id, objects);
  return { x: position.x, y: position.y + yOffset, z: position.z };
}

function collectTopologyRecords(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditRecord[] {
  if (!context.topologyConnectionLinesVisible) return [];
  return context.topologyLines
    .filter((line) => line.valid)
    .map((line) =>
      buildAuditRecord({
        connectionId: line.id,
        layer: "topology",
        sourceObjectId: line.sourceId,
        targetObjectId: line.targetId,
        sourceRenderPosition: line.sourcePosition,
        targetRenderPosition: line.targetPosition,
        context,
      })
    );
}

function collectRelationshipRecords(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditRecord[] {
  const relationships = readAuditRelationships(context.sceneJson);
  const yOffset = context.viewMode === "2D" ? 0.06 : 0.1;
  return relationships.map((relationship) =>
    buildAuditRecord({
      connectionId: relationship.id,
      layer: "relationship",
      sourceObjectId: relationship.sourceId,
      targetObjectId: relationship.targetId,
      sourceRenderPosition: readLegacyObjPos(relationship.sourceId, context.sceneObjects as any[], yOffset),
      targetRenderPosition: readLegacyObjPos(relationship.targetId, context.sceneObjects as any[], yOffset),
      context,
    })
  );
}

function collectOverlayFlowRecords(
  context: ConnectionRuntimeAuditContext,
  layer: ConnectionRuntimeLayer,
  edges: Array<{ from: string; to: string }>,
  yOffset: number
): ConnectionRuntimeAuditRecord[] {
  return edges.map((edge) =>
    buildAuditRecord({
      connectionId: `${edge.from}__to__${edge.to}`,
      layer,
      sourceObjectId: edge.from,
      targetObjectId: edge.to,
      sourceRenderPosition: readLegacyObjPos(edge.from, context.sceneObjects as any[], yOffset),
      targetRenderPosition: readLegacyObjPos(edge.to, context.sceneObjects as any[], yOffset),
      context,
    })
  );
}

function collectAuthoredPropagationRecords(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditRecord[] {
  if (!context.overlayVisibility.propagation) return [];
  const paths = readPropagationPaths(context.sceneJson);
  const yOffset = 0.18;
  return paths.map((path) =>
    buildAuditRecord({
      connectionId: path.id,
      layer: "overlay_authored_propagation",
      sourceObjectId: path.sourceObjectId,
      targetObjectId: path.targetObjectId,
      sourceRenderPosition: readLegacyObjPos(path.sourceObjectId, context.sceneObjects as any[], yOffset),
      targetRenderPosition: readLegacyObjPos(path.targetObjectId, context.sceneObjects as any[], yOffset),
      context,
    })
  );
}

function collectLoopRecords(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditRecord[] {
  if (!context.showLoops) return [];
  const loops = context.loops ?? [];
  const records: ConnectionRuntimeAuditRecord[] = [];
  loops.forEach((loop) => {
    const edges = Array.isArray(loop.edges) ? loop.edges : [];
    edges.forEach((edge, index) => {
      const from = String((edge as { from?: string }).from ?? "");
      const to = String((edge as { to?: string }).to ?? "");
      if (!from || !to) return;
      records.push(
        buildAuditRecord({
          connectionId: `${loop.id ?? "loop"}:${index}:${from}__to__${to}`,
          layer: "loop",
          sourceObjectId: from,
          targetObjectId: to,
          sourceRenderPosition: readLegacyObjPos(from, context.sceneObjects as any[], 0),
          targetRenderPosition: readLegacyObjPos(to, context.sceneObjects as any[], 0),
          context,
        })
      );
    });
  });
  return records;
}

function collectScenarioOverlayRecords(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditRecord[] {
  if (!context.overlayVisibility.scenario || !context.decisionPathOverlay?.active) return [];
  const edges = context.decisionPathOverlay.edges ?? [];
  return edges.map((edge) =>
    buildAuditRecord({
      connectionId: `${edge.from}__to__${edge.to}`,
      layer: "overlay_scenario",
      sourceObjectId: edge.from,
      targetObjectId: edge.to,
      sourceRenderPosition: readLegacyObjPos(edge.from, context.sceneObjects as any[], 0.14),
      targetRenderPosition: readLegacyObjPos(edge.to, context.sceneObjects as any[], 0.14),
      context,
    })
  );
}

export function collectConnectionRuntimeAuditRecords(
  context: ConnectionRuntimeAuditContext
): ConnectionRuntimeAuditRecord[] {
  const propagationEdges = context.overlayVisibility.propagation
    ? propagationOverlayToEdges(context.propagationOverlay)
    : [];

  return [
    ...collectTopologyRecords(context),
    ...collectRelationshipRecords(context),
    ...collectOverlayFlowRecords(context, "overlay_propagation", propagationEdges, 0.1),
    ...collectOverlayFlowRecords(
      context,
      "overlay_risk_flow",
      context.overlayVisibility.risk_flow && context.propagationOverlay?.active
        ? propagationOverlayToEdges(context.propagationOverlay)
        : [],
      0.12
    ),
    ...collectOverlayFlowRecords(
      context,
      "overlay_dependency",
      context.overlayVisibility.dependency ? readDependencyOverlayEdges(context.sceneJson) : [],
      0.06
    ),
    ...collectScenarioOverlayRecords(context),
    ...collectAuthoredPropagationRecords(context),
    ...collectLoopRecords(context),
  ];
}

export function summarizeConnectionRuntimeAudit(
  records: readonly ConnectionRuntimeAuditRecord[]
): ConnectionRuntimeAuditSummary {
  const totalConnections = records.length;
  const connectionsUsingTopology = records.filter((record) => record.classification === "topology-driven").length;
  const connectionsUsingLegacyScenePositions = records.filter(
    (record) => record.classification === "legacy-position-driven"
  ).length;
  const mismatches = records.map((record) => Math.max(record.sourcePositionMatch, record.targetPositionMatch));
  const connectionsWithPositionMismatch = mismatches.filter(
    (distance) => distance >= CONNECTION_TOPOLOGY_MATCH_THRESHOLD
  ).length;
  const largestMismatchDistance = mismatches.length > 0 ? Math.max(...mismatches) : 0;
  const averageMismatchDistance =
    mismatches.length > 0 ? mismatches.reduce((sum, value) => sum + value, 0) / mismatches.length : 0;

  const topologyLayerRecords = records.filter((record) => record.layer === "topology");
  const topologyPositionSourceActive =
    topologyLayerRecords.length > 0 &&
    topologyLayerRecords.every(
      (record) =>
        record.classification === "topology-driven" &&
        record.activeSourcePositionProvider === "topologyRuntime.position" &&
        record.activeTargetPositionProvider === "topologyRuntime.position"
    );

  return {
    totalConnections,
    connectionsUsingTopology,
    connectionsUsingLegacyScenePositions,
    connectionsWithPositionMismatch,
    largestMismatchDistance,
    averageMismatchDistance,
    topologyPositionSourceActive,
  };
}

export function runConnectionRuntimeAudit(context: ConnectionRuntimeAuditContext): {
  records: ConnectionRuntimeAuditRecord[];
  summary: ConnectionRuntimeAuditSummary;
} {
  const records = collectConnectionRuntimeAuditRecords(context);
  const summary = summarizeConnectionRuntimeAudit(records);
  return { records, summary };
}

export function logConnectionRuntimeAudit(context: ConnectionRuntimeAuditContext): ConnectionRuntimeAuditSummary {
  const { records, summary } = runConnectionRuntimeAudit(context);
  const consoleRef = globalThis.console;
  if (!consoleRef) return summary;

  consoleRef.group?.("[NEXORA_CONNECTION_AUDIT]");
  records.forEach((record) => {
    consoleRef.log?.("[NEXORA_CONNECTION]", {
      connectionId: record.connectionId,
      layer: record.layer,
      sourceObjectId: record.sourceObjectId,
      targetObjectId: record.targetObjectId,
      sourceRenderPosition: record.sourceRenderPosition,
      targetRenderPosition: record.targetRenderPosition,
      sourceTopologyPosition: record.sourceTopologyPosition,
      targetTopologyPosition: record.targetTopologyPosition,
      activeSourcePositionProvider: record.activeSourcePositionProvider,
      activeTargetPositionProvider: record.activeTargetPositionProvider,
      sourceDelta: record.sourcePositionMatch,
      targetDelta: record.targetPositionMatch,
      classification: record.classification,
    });
  });
  consoleRef.groupEnd?.();

  consoleRef.log?.("[NEXORA_CONNECTION_AUDIT_SUMMARY]", {
    totalConnections: summary.totalConnections,
    connectionsUsingTopology: summary.connectionsUsingTopology,
    connectionsUsingLegacyScenePositions: summary.connectionsUsingLegacyScenePositions,
    connectionsWithPositionMismatch: summary.connectionsWithPositionMismatch,
    largestMismatchDistance: summary.largestMismatchDistance,
    averageMismatchDistance: summary.averageMismatchDistance,
    topologyPositionSource:
      summary.topologyPositionSourceActive ? "ACTIVE" : "NOT ACTIVE",
  });

  return summary;
}

export function buildConnectionRuntimeAuditSignature(context: ConnectionRuntimeAuditContext): string {
  const { records } = runConnectionRuntimeAudit(context);
  return JSON.stringify({
    topologyEnabled: context.topologyEnabled,
    topologyVisible: context.topologyConnectionLinesVisible,
    topologyLineCount: context.topologyLines.length,
    records: records.map((record) => ({
      id: record.connectionId,
      layer: record.layer,
      source: record.sourceRenderPosition,
      target: record.targetRenderPosition,
      sourceProvider: record.activeSourcePositionProvider,
      targetProvider: record.activeTargetPositionProvider,
      sourceDelta: Number(record.sourcePositionMatch.toFixed(4)),
      targetDelta: Number(record.targetPositionMatch.toFixed(4)),
      classification: record.classification,
    })),
  });
}
