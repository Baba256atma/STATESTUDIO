import type { ExecutiveObjectCluster, ExecutiveObjectClusterKind } from "./executiveSceneFramingTypes";
import type { SceneObjectPosition } from "./executiveSceneBoundsRuntime";

function clusterKindForObject(object: SceneObjectPosition): ExecutiveObjectClusterKind {
  if (object.riskKind || object.tags.some((tag) => tag.includes("risk") || tag.includes("threat"))) {
    return "risk";
  }
  if (object.tags.some((tag) => tag.includes("scenario") || tag.includes("simulation"))) {
    return "scenario";
  }
  if (object.role === "core" || object.role === "decision" || object.role === "hub") {
    return "operational";
  }
  return "general";
}

function resolveClusterDistanceThreshold(objectCount: number): number {
  if (objectCount <= 5) return 2.4;
  if (objectCount <= 10) return 2.8;
  if (objectCount <= 25) return 3.2;
  if (objectCount <= 50) return 3.6;
  return 4.2;
}

function distance(a: [number, number, number], b: [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** Detect operational clusters for sparse and medium scenes. */
export function detectExecutiveObjectClusters(input: {
  objects: SceneObjectPosition[];
  relationships: Array<{ sourceId: string; targetId: string }>;
}): ExecutiveObjectCluster[] {
  const objects = input.objects;
  if (!objects.length) return [];

  const threshold = resolveClusterDistanceThreshold(objects.length);
  const parent = new Map<string, string>();
  const ensure = (id: string) => {
    if (!parent.has(id)) parent.set(id, id);
    return id;
  };
  const find = (id: string): string => {
    ensure(id);
    let root = id;
    while (parent.get(root) !== root) {
      root = parent.get(root)!;
    }
    let current = id;
    while (parent.get(current) !== root) {
      const next = parent.get(current)!;
      parent.set(current, root);
      current = next;
    }
    return root;
  };
  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootB, rootA);
  };

  objects.forEach((object) => ensure(object.id));
  for (let i = 0; i < objects.length; i += 1) {
    for (let j = i + 1; j < objects.length; j += 1) {
      if (distance(objects[i].position, objects[j].position) <= threshold) {
        union(objects[i].id, objects[j].id);
      }
    }
  }

  input.relationships.forEach(({ sourceId, targetId }) => {
    if (parent.has(sourceId) && parent.has(targetId)) union(sourceId, targetId);
  });

  const groups = new Map<string, SceneObjectPosition[]>();
  objects.forEach((object) => {
    const root = find(object.id);
    const bucket = groups.get(root) ?? [];
    bucket.push(object);
    groups.set(root, bucket);
  });

  return Array.from(groups.entries()).map(([root, members], index) => {
    const cx = members.reduce((sum, member) => sum + member.position[0], 0) / members.length;
    const cy = members.reduce((sum, member) => sum + member.position[1], 0) / members.length;
    const cz = members.reduce((sum, member) => sum + member.position[2], 0) / members.length;
    let radius = 0;
    for (const member of members) {
      radius = Math.max(radius, distance(member.position, [cx, cy, cz]));
    }
    const kindVotes = members.map(clusterKindForObject);
    const kind =
      kindVotes.includes("risk")
        ? "risk"
        : kindVotes.includes("scenario")
          ? "scenario"
          : kindVotes.includes("operational")
            ? "operational"
            : "general";
    return {
      id: `${root}:${index}`,
      objectIds: members.map((member) => member.id),
      center: [cx, cy, cz],
      radius: Math.max(0.55, radius * 1.12),
      kind,
    };
  });
}

export function resolveExecutiveClusterLayoutSpacing(input: {
  objectCount: number;
  clusterCount: number;
  layoutSpacingMultiplier: number;
}): number {
  const base =
    input.objectCount <= 5
      ? 0.82
      : input.objectCount <= 10
        ? 0.92
        : input.objectCount <= 25
          ? 1.02
          : input.objectCount <= 50
            ? 1.12
            : 1.22;
  const clusterSeparation = input.clusterCount > 1 ? 1.08 : 1;
  return Number((base * input.layoutSpacingMultiplier * clusterSeparation).toFixed(3));
}
