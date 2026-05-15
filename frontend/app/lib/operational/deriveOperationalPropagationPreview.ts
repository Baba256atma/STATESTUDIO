import type { OperationalChangeSummary } from "./changeDetectionTypes.ts";
import {
  comparePropagationNodes,
  derivePropagationRiskLevel,
  derivePropagationScore,
  maxPropagationRiskLevel,
  normalizePropagationScore,
} from "./propagationScoring.ts";
import type {
  OperationalPropagationNode,
  OperationalPropagationPreview,
  OperationalPropagationRiskLevel,
} from "./propagationPreviewTypes.ts";
import type { OperationalMonitoringSnapshot } from "./monitoringTypes.ts";
import type { SceneJson, SceneObject } from "../sceneTypes.ts";
import { buildPropagationLoopEdges } from "../simulation/propagationOverlay.ts";
import { safeOperationalTraversalLimit } from "./d3StabilityGuards.ts";

export type DeriveOperationalPropagationPreviewInput = Readonly<{
  monitoringSnapshot: OperationalMonitoringSnapshot | null;
  operationalChangeSummary: OperationalChangeSummary | null;
  sceneJson: SceneJson | null;
  now?: number;
}>;

const MAX_BFS_STEPS = 220;
const MAX_GRAPH_DEPTH = 3;
const MAX_NEIGHBORS_PER_NODE = 28;
const MAX_PREVIEW_NODES = 36;

function isoNow(now?: number): string {
  const ms = typeof now === "number" && Number.isFinite(now) ? now : Date.now();
  return new Date(ms).toISOString();
}

function readSceneRecord(scene: SceneJson["scene"] | undefined): Record<string, unknown> | null {
  if (!scene || typeof scene !== "object") return null;
  return scene as Record<string, unknown>;
}

function readSceneRelationEdges(scene: SceneJson["scene"] | undefined): ReadonlyArray<{ from: string; to: string }> {
  const rec = readSceneRecord(scene);
  const rel = rec?.relations;
  if (!Array.isArray(rel)) return [];
  const out: { from: string; to: string }[] = [];
  for (const r of rel) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const from = String(o.from ?? "").trim();
    const to = String(o.to ?? "").trim();
    if (from && to) out.push({ from, to });
  }
  return out;
}

function stableObjectId(obj: SceneObject, idx: number): string {
  return String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`).trim();
}

function objectLabel(sceneJson: SceneJson | null, objectId: string): string {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  for (let i = 0; i < objects.length; i += 1) {
    const o = objects[i]!;
    const sid = stableObjectId(o, i);
    if (sid === objectId) {
      const lab = typeof o.label === "string" ? o.label.trim() : "";
      const nm = typeof o.name === "string" ? o.name.trim() : "";
      return lab || nm || objectId;
    }
  }
  return objectId;
}

function buildAdjacency(sceneJson: SceneJson | null): ReadonlyMap<string, readonly string[]> {
  const map = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (!a || !b || a === b) return;
    let sa = map.get(a);
    if (!sa) {
      sa = new Set();
      map.set(a, sa);
    }
    if (sa.size < MAX_NEIGHBORS_PER_NODE) sa.add(b);
    let sb = map.get(b);
    if (!sb) {
      sb = new Set();
      map.set(b, sb);
    }
    if (sb.size < MAX_NEIGHBORS_PER_NODE) sb.add(a);
  };

  const loops = sceneJson?.scene?.loops ?? null;
  for (const e of buildPropagationLoopEdges(loops)) {
    add(e.from, e.to);
  }
  for (const e of readSceneRelationEdges(sceneJson?.scene)) {
    add(e.from, e.to);
  }

  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  objects.forEach((obj, idx) => {
    const id = stableObjectId(obj, idx);
    if (!id) return;
    const deps = Array.isArray(obj.dependencies) ? obj.dependencies : [];
    for (const d of deps) {
      const t = String(d).trim();
      if (t) add(id, t);
    }
    const sem = obj.semantic && typeof obj.semantic === "object" ? (obj.semantic as { dependencies?: unknown }) : null;
    const sdeps = Array.isArray(sem?.dependencies) ? sem.dependencies : [];
    for (const d of sdeps) {
      const t = String(d).trim();
      if (t) add(id, t);
    }
  });

  const frozen = new Map<string, readonly string[]>();
  for (const [k, set] of map) {
    frozen.set(k, [...set].sort((a, b) => a.localeCompare(b)));
  }
  return frozen;
}

function dedupeSorted(ids: readonly string[]): readonly string[] {
  return [...new Set(ids.map((x) => String(x).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function monitoringBaseSeverity01(snapshot: OperationalMonitoringSnapshot | null): number {
  if (!snapshot?.signals?.length) {
    if (snapshot?.status === "critical") return 0.9;
    if (snapshot?.status === "degraded") return 0.65;
    if (snapshot?.status === "watching") return 0.45;
    return 0.32;
  }
  let m = 0;
  for (const s of snapshot.signals) {
    const v = typeof s.severity === "number" && Number.isFinite(s.severity) ? s.severity : 0;
    m = Math.max(m, normalizePropagationScore(v));
  }
  return m;
}

function collectSeedObjectIds(
  monitoringSnapshot: OperationalMonitoringSnapshot | null,
  changeSummary: OperationalChangeSummary | null
): readonly string[] {
  const acc: string[] = [];
  if (monitoringSnapshot?.affectedObjectIds) {
    for (const id of monitoringSnapshot.affectedObjectIds) acc.push(String(id).trim());
  }
  if (monitoringSnapshot?.topRiskObjectId) acc.push(String(monitoringSnapshot.topRiskObjectId).trim());
  if (changeSummary?.affectedObjectIds) {
    for (const id of changeSummary.affectedObjectIds) acc.push(String(id).trim());
  }
  if (changeSummary?.topChange?.objectId) acc.push(String(changeSummary.topChange.objectId).trim());
  if (monitoringSnapshot?.signals) {
    for (const s of monitoringSnapshot.signals) {
      if (typeof s.objectId === "string" && s.objectId.trim()) acc.push(s.objectId.trim());
    }
  }
  return dedupeSorted(acc).slice(0, safeOperationalTraversalLimit(96, 128));
}

function collectChangeIdTokens(changeSummary: OperationalChangeSummary | null, sourceId: string): readonly string[] {
  const out: string[] = [];
  if (changeSummary?.topChange?.id) out.push(changeSummary.topChange.id);
  if (changeSummary?.topChange?.objectId === sourceId) out.push(`src:${sourceId}`);
  return dedupeSorted(out);
}

function bfsPropagation(
  adj: ReadonlyMap<string, readonly string[]>,
  seeds: readonly string[],
  base01: number,
  changeSummary: OperationalChangeSummary | null
): OperationalPropagationNode[] {
  const seedSet = new Set(seeds);
  if (seedSet.size === 0) return [];

  const dist = new Map<string, number>();
  const via = new Map<string, string>();
  const queue: string[] = [];

  for (const s of seeds) {
    if (!s) continue;
    dist.set(s, 0);
    via.set(s, s);
    queue.push(s);
  }

  let steps = 0;
  while (queue.length > 0 && steps < MAX_BFS_STEPS) {
    steps += 1;
    const u = queue.shift()!;
    const d = dist.get(u) ?? 0;
    if (d >= MAX_GRAPH_DEPTH) continue;
    const nbrs = adj.get(u) ?? [];
    for (const v of nbrs) {
      if (!v || v === u) continue;
      const nd = d + 1;
      if (nd > MAX_GRAPH_DEPTH) continue;
      const prev = dist.get(v);
      if (prev == null || nd < prev) {
        dist.set(v, nd);
        via.set(v, d === 0 ? u : via.get(u) ?? u);
        queue.push(v);
      }
    }
  }

  const nodes: OperationalPropagationNode[] = [];
  for (const [objectId, hop] of dist) {
    if (hop === 0 || seedSet.has(objectId)) continue;
    const sourceObjectId = via.get(objectId) ?? seeds[0] ?? objectId;
    const score = derivePropagationScore({ base01, hop: hop - 1, edgeWeight: 1 });
    const riskLevel = derivePropagationRiskLevel(score);
    const reason =
      hop === 1
        ? `Within ${hop} hop of operational focus ${sourceObjectId} via scene connectivity.`
        : `Within ${hop} hops of operational focus ${sourceObjectId} via scene connectivity.`;
    const estimatedImpact =
      hop <= 1
        ? "May absorb adjacent operational stress on the next connectivity hop."
        : "Secondary exposure; monitor downstream indicators if stress persists.";
    nodes.push({
      objectId,
      riskLevel,
      propagationScore: score,
      sourceObjectId,
      reason,
      affectedByChangeIds: collectChangeIdTokens(changeSummary, sourceObjectId),
      estimatedImpact,
    });
  }

  nodes.sort(comparePropagationNodes);
  return nodes.slice(0, MAX_PREVIEW_NODES);
}

const EMPTY_PREVIEW_BASE: Omit<OperationalPropagationPreview, "id" | "generatedAt"> = {
  sourceObjectIds: [],
  affectedObjectIds: [],
  propagationNodes: [],
  highestRiskLevel: "low",
  summary: "No operational propagation preview — insufficient scene connectivity or operational focus.",
};

/**
 * Read-only preview of how operational stress might spread along existing scene edges (loops, relations, dependencies).
 * Does not mutate `sceneJson` or run async / network / connectors.
 * Connector orchestration: this module never invokes connector execution — it only consumes already-normalized inputs.
 */
export function deriveOperationalPropagationPreview(
  input?: DeriveOperationalPropagationPreviewInput | null
): OperationalPropagationPreview {
  const generatedAt = isoNow(input?.now);
  if (!input) {
    return {
      ...EMPTY_PREVIEW_BASE,
      id: "opprop:empty",
      generatedAt,
    };
  }

  const { monitoringSnapshot, operationalChangeSummary, sceneJson } = input;
  const seeds = collectSeedObjectIds(monitoringSnapshot, operationalChangeSummary);
  const adj = buildAdjacency(sceneJson);

  const base01 = monitoringBaseSeverity01(monitoringSnapshot);
  const worseningSignal =
    (operationalChangeSummary?.worseningCount ?? 0) > (operationalChangeSummary?.improvingCount ?? 0);
  const adjustedBase = normalizePropagationScore(base01 * (worseningSignal ? 1.05 : 0.92));

  if (!sceneJson || seeds.length === 0 || adj.size === 0) {
    const id = `opprop:${seeds.length}|${adj.size}|${adjustedBase.toFixed(2)}`;
    return {
      ...EMPTY_PREVIEW_BASE,
      id,
      sourceObjectIds: seeds,
      summary:
        seeds.length === 0
          ? "No propagation preview — no operational object anchors in the current read model."
          : adj.size === 0
            ? "No propagation preview — scene has no loop, relation, or dependency edges to traverse."
            : EMPTY_PREVIEW_BASE.summary,
      generatedAt,
    };
  }

  const rawNodes = bfsPropagation(adj, seeds, adjustedBase, operationalChangeSummary);
  const nodes: OperationalPropagationNode[] = rawNodes.map((n) => ({
    ...n,
    affectedByChangeIds:
      operationalChangeSummary?.topChange?.objectId &&
      (n.sourceObjectId === operationalChangeSummary.topChange.objectId ||
        n.objectId === operationalChangeSummary.topChange.objectId)
        ? dedupeSorted([...n.affectedByChangeIds, operationalChangeSummary.topChange.id])
        : n.affectedByChangeIds,
  }));

  const affectedObjectIds = dedupeSorted([...seeds, ...nodes.map((nn) => nn.objectId)]);

  const levels: OperationalPropagationRiskLevel[] = nodes.length ? nodes.map((nn) => nn.riskLevel) : ["low"];
  const highestRiskLevel = maxPropagationRiskLevel(levels);

  const top = nodes[0];
  const src0 = seeds[0] ?? top?.sourceObjectId ?? "system";
  const topLabel = top ? objectLabel(sceneJson, top.objectId) : null;
  const srcLabel = objectLabel(sceneJson, src0);
  const summary = topLabel
    ? `Operational degradation may propagate from ${srcLabel} toward ${topLabel} along existing scene links.`
    : `Operational focus on ${srcLabel} is contained — no adjacent systems flagged beyond current anchors.`;

  const id = `opprop:${dedupeSorted(seeds).join("+")}|n${nodes.length}|${highestRiskLevel}|${adjustedBase.toFixed(2)}`;

  return {
    id,
    sourceObjectIds: seeds,
    affectedObjectIds,
    propagationNodes: nodes,
    highestRiskLevel,
    summary,
    generatedAt,
  };
}
