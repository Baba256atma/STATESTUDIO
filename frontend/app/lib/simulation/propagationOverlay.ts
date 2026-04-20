import type { SceneJson, SceneLoop } from "../sceneTypes";
import type {
  PropagationEdgeImpact,
  PropagationNodeImpact,
  PropagationOverlayState,
  PropagationTriggerSource,
} from "./propagationTypes";

type LooseRecord = Record<string, unknown>;

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function hasMeaningfulPropagationOverlay(
  overlay: PropagationOverlayState | null | undefined
): overlay is PropagationOverlayState {
  if (!overlay?.active) return false;
  const impactedEdges = Array.isArray(overlay.impacted_edges) ? overlay.impacted_edges.length : 0;
  const impactedNodes = Array.isArray(overlay.impacted_nodes) ? overlay.impacted_nodes : [];
  if (impactedEdges > 0) return true;
  return impactedNodes.some((node) => {
    const depth = Number(node?.depth ?? 0);
    const role = typeof node?.role === "string" ? node.role : null;
    return depth > 0 || role === "impacted" || role === "context";
  });
}

function buildLoopEdges(loops: SceneLoop[] | undefined | null): Array<{ from: string; to: string; weight?: number }> {
  if (!Array.isArray(loops)) return [];
  return loops.flatMap((loop) =>
    Array.isArray(loop?.edges)
      ? loop.edges
          .map((edge) => ({
            from: String(edge?.from ?? "").trim(),
            to: String(edge?.to ?? "").trim(),
            weight: typeof edge?.weight === "number" ? edge.weight : typeof loop?.strength === "number" ? loop.strength : undefined,
          }))
          .filter((edge) => edge.from && edge.to)
      : []
  );
}

export function buildPropagationLoopEdges(
  loops: SceneLoop[] | undefined | null
): Array<{ from: string; to: string; weight?: number }> {
  return buildLoopEdges(loops);
}

export function resolveScannerPrimarySource(sceneJson: SceneJson | null | undefined): string | null {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  const focused = objects.find((object) => object?.scanner_focus === true);
  if (focused?.id) return String(focused.id);
  const highlighted = objects.find((object) => object?.scanner_highlighted === true);
  if (highlighted?.id) return String(highlighted.id);
  return null;
}

export function collectPropagationSceneIds(params: {
  sceneJson: SceneJson | null | undefined;
  loops?: SceneLoop[] | null;
}): Set<string> {
  const ids = new Set<string>();
  const objects = Array.isArray(params.sceneJson?.scene?.objects) ? params.sceneJson.scene.objects : [];
  objects.forEach((object, idx) => {
    const stableId = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`).trim();
    if (stableId) ids.add(stableId);
    const objectId = String(object?.id ?? "").trim();
    if (objectId) ids.add(objectId);
    const objectName = String(object?.name ?? "").trim();
    if (objectName) ids.add(objectName);
  });
  buildLoopEdges(params.loops ?? params.sceneJson?.scene?.loops ?? []).forEach((edge) => {
    if (edge.from) ids.add(edge.from);
    if (edge.to) ids.add(edge.to);
  });
  return ids;
}

export function buildPropagationSceneSignature(params: {
  sceneJson: SceneJson | null | undefined;
  loops?: SceneLoop[] | null;
}): string {
  const objects = Array.isArray(params.sceneJson?.scene?.objects) ? params.sceneJson.scene.objects : [];
  const objectSig = objects
    .map((object, idx) => {
      const objectWithTransform = object as { transform?: { pos?: unknown }; position?: unknown[] };
      const objectId = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`).trim();
      const pos = Array.isArray(objectWithTransform?.transform?.pos)
        ? objectWithTransform.transform.pos
        : Array.isArray(object?.position)
          ? object.position
          : null;
      if (!pos || pos.length < 3) return `${objectId}:na`;
      return `${objectId}:${Number(pos[0]).toFixed(2)},${Number(pos[1]).toFixed(2)},${Number(pos[2]).toFixed(2)}`;
    })
    .join("|");
  const loopSig = buildLoopEdges(params.loops ?? params.sceneJson?.scene?.loops ?? [])
    .map((edge) => `${edge.from}>${edge.to}:${typeof edge.weight === "number" ? edge.weight.toFixed(2) : "1.00"}`)
    .join("|");
  return `${objectSig}::${loopSig}`;
}

export function hasPropagationRelations(params: {
  sceneJson: SceneJson | null | undefined;
  loops?: SceneLoop[] | null;
}): boolean {
  return buildLoopEdges(params.loops ?? params.sceneJson?.scene?.loops ?? []).length > 0;
}

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function normalizeNodeImpact(value: unknown): PropagationNodeImpact | null {
  if (typeof value === "string") {
    const objectId = value.trim();
    if (!objectId) return null;
    return {
      object_id: objectId,
      depth: 1,
      strength: 0.72,
      role: "impacted",
    };
  }
  const record = asRecord(value);
  const objectId = String(record?.object_id ?? record?.objectId ?? record?.id ?? "").trim();
  if (!objectId) return null;
  return {
    object_id: objectId,
    depth: Number.isFinite(Number(record?.depth)) ? Math.max(0, Number(record?.depth)) : 0,
    strength: clamp01(Number(record?.strength ?? 0)),
    role:
      record?.role === "source" || record?.role === "context" || record?.role === "impacted"
        ? record.role
        : "impacted",
  };
}

function normalizeEdgeImpact(value: unknown): PropagationEdgeImpact | null {
  const record = asRecord(value);
  const from = String(record?.from ?? record?.from_id ?? record?.source ?? record?.fromObjectId ?? "").trim();
  const to = String(record?.to ?? record?.to_id ?? record?.target ?? record?.toObjectId ?? "").trim();
  if (!from || !to) return null;
  return {
    from,
    to,
    depth: Number.isFinite(Number(record?.depth)) ? Math.max(1, Number(record?.depth)) : 1,
    strength: clamp01(Number(record?.strength ?? record?.weight ?? 0.68)),
  };
}

export function normalizePropagationOverlay(
  payload: unknown
): PropagationOverlayState | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  if (!raw) return null;
  const simulationRecord = asRecord(raw.simulation);
  const decisionSimulationRecord = asRecord(raw.decision_simulation);
  const analysisRecord = asRecord(raw.analysis);
  const scenePayloadRecord = asRecord(raw.scene_payload);
  const candidate = asRecord(
    simulationRecord?.propagation ??
      decisionSimulationRecord?.propagation ??
      analysisRecord?.propagation ??
      scenePayloadRecord?.propagation ??
      raw.propagation ??
      null
  );
  if (!candidate) return null;

  const impactedNodes = Array.isArray(candidate.impacted_nodes)
    ? candidate.impacted_nodes.map(normalizeNodeImpact).filter(Boolean)
    : Array.isArray(decisionSimulationRecord?.impacted_nodes)
      ? decisionSimulationRecord.impacted_nodes.map(normalizeNodeImpact).filter(Boolean)
    : [];
  const impactedEdges = Array.isArray(candidate.impacted_edges)
    ? candidate.impacted_edges.map(normalizeEdgeImpact).filter(Boolean)
    : Array.isArray(decisionSimulationRecord?.propagation)
      ? decisionSimulationRecord.propagation.map(normalizeEdgeImpact).filter(Boolean)
    : [];
  const sourceObjectId = String(candidate.source_object_id ?? candidate.sourceId ?? "").trim() || null;

  if (!sourceObjectId && impactedNodes.length === 0 && impactedEdges.length === 0) return null;

  return {
    active: candidate.active !== false && (!!sourceObjectId || impactedNodes.length > 0),
    source_object_id: sourceObjectId,
    mode: candidate.mode === "preview" ? "preview" : "backend",
    impacted_nodes: impactedNodes,
    impacted_edges: impactedEdges,
    meta: {
      label: typeof asRecord(candidate.meta)?.label === "string" ? String(asRecord(candidate.meta)?.label) : "What-if propagation",
      timestamp: Date.now(),
      source_kind: "backend_payload",
    },
  };
}

export function isPropagationOverlayCompatible(params: {
  overlay: PropagationOverlayState | null | undefined;
  sceneJson: SceneJson | null | undefined;
  loops?: SceneLoop[] | null;
  expectedSourceId?: string | null;
}): boolean {
  const { overlay, sceneJson, loops, expectedSourceId = null } = params;
  if (!overlay?.active) return false;
  const ids = collectPropagationSceneIds({ sceneJson, loops });
  if (expectedSourceId && overlay.source_object_id && overlay.source_object_id !== expectedSourceId) {
    return false;
  }
  if (ids.size === 0) return true;
  if (overlay.source_object_id && !ids.has(overlay.source_object_id)) return false;
  const nodeMatch = (overlay.impacted_nodes ?? []).some((impact) => ids.has(String(impact?.object_id ?? "")));
  const edgeMatch = (overlay.impacted_edges ?? []).some(
    (impact) => ids.has(String(impact?.from ?? "")) && ids.has(String(impact?.to ?? ""))
  );
  return nodeMatch || edgeMatch || (!!overlay.source_object_id && ids.has(overlay.source_object_id));
}

export function buildPreviewPropagationOverlay(params: {
  sceneJson: SceneJson | null;
  loops?: SceneLoop[] | null;
  sourceObjectId: string | null;
  sourceKind: PropagationTriggerSource;
  maxDepth?: number;
  decay?: number;
}): PropagationOverlayState | null {
  const {
    sceneJson,
    loops,
    sourceObjectId,
    sourceKind,
    maxDepth = 2,
    decay = 0.72,
  } = params;
  if (!sourceObjectId) return null;

  const edges = buildLoopEdges(loops ?? sceneJson?.scene?.loops ?? []);
  const adjacency = new Map<string, Array<{ id: string; weight: number }>>();
  edges.forEach((edge) => {
    const weight = typeof edge.weight === "number" ? clamp01(edge.weight) : 1;
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, []);
    adjacency.get(edge.from)?.push({ id: edge.to, weight });
    adjacency.get(edge.to)?.push({ id: edge.from, weight });
  });

  const nodeStrengthById = new Map<string, { depth: number; strength: number; role: PropagationNodeImpact["role"] }>();
  nodeStrengthById.set(sourceObjectId, { depth: 0, strength: 1, role: "source" });
  const edgeImpacts: PropagationEdgeImpact[] = [];
  const queue: Array<{ id: string; depth: number; strength: number }> = [{ id: sourceObjectId, depth: 0, strength: 1 }];
  const bestDepthById = new Map<string, number>([[sourceObjectId, 0]]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth >= maxDepth) continue;
    const neighbors = adjacency.get(current.id) ?? [];
    neighbors.forEach((neighbor) => {
      const nextDepth = current.depth + 1;
      const nextStrength = clamp01(current.strength * decay * neighbor.weight);
      if (nextStrength <= 0.08) return;
      const bestDepth = bestDepthById.get(neighbor.id);
      if (bestDepth !== undefined && bestDepth < nextDepth) return;

      edgeImpacts.push({
        from: current.id,
        to: neighbor.id,
        depth: nextDepth,
        strength: nextStrength,
      });
      const prev = nodeStrengthById.get(neighbor.id);
      if (!prev || nextStrength > prev.strength) {
        nodeStrengthById.set(neighbor.id, {
          depth: nextDepth,
          strength: nextStrength,
          role: nextDepth >= 2 ? "context" : "impacted",
        });
      }
      if (bestDepth === undefined || nextDepth <= bestDepth) {
        bestDepthById.set(neighbor.id, nextDepth);
        queue.push({ id: neighbor.id, depth: nextDepth, strength: nextStrength });
      }
    });
  }

  const overlay: PropagationOverlayState = {
    active: true,
    source_object_id: sourceObjectId,
    mode: "preview",
    impacted_nodes: Array.from(nodeStrengthById.entries()).map(([objectId, value]) => ({
      object_id: objectId,
      depth: value.depth,
      strength: value.strength,
      role: value.role,
    })),
    impacted_edges: edgeImpacts,
    meta: {
      label: "Propagation preview",
      timestamp: Date.now(),
      source_kind: sourceKind,
    },
  };
  return hasMeaningfulPropagationOverlay(overlay) ? overlay : null;
}

export function resolvePropagationOverlay(params: {
  sceneJson: SceneJson | null;
  loops?: SceneLoop[] | null;
  selectedObjectId?: string | null;
  propagationPayload?: unknown;
  previewEnabled?: boolean;
}): PropagationOverlayState | null {
  const backendOverlay = normalizePropagationOverlay(params.propagationPayload);
  if (
    isPropagationOverlayCompatible({
      overlay: backendOverlay,
      sceneJson: params.sceneJson,
      loops: params.loops,
      expectedSourceId: params.selectedObjectId ?? null,
    })
  ) {
    return backendOverlay;
  }
  if (!params.previewEnabled) return null;

  const sourceObjectId =
    (typeof params.selectedObjectId === "string" && params.selectedObjectId.trim().length > 0
      ? params.selectedObjectId
      : null) ?? resolveScannerPrimarySource(params.sceneJson);
  const sourceKind: PropagationTriggerSource = params.selectedObjectId
    ? "selected_object"
    : "scanner_primary";

  return buildPreviewPropagationOverlay({
    sceneJson: params.sceneJson,
    loops: params.loops,
    sourceObjectId,
    sourceKind,
  });
}
