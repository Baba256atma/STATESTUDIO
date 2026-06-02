export type ExecutiveHoverAffordance = {
  showGlow: boolean;
  emissiveBoost: number;
  scaleBoost: number;
  cursor: "pointer" | "default";
};

export function resolveExecutiveHoverAffordance(input: {
  hovered: boolean;
  selected: boolean;
  focused: boolean;
  connectedToSelected: boolean;
  relationshipExplorationActive: boolean;
}): ExecutiveHoverAffordance {
  const interactive = input.hovered || input.connectedToSelected;
  if (input.selected || input.focused) {
    return {
      showGlow: true,
      emissiveBoost: 0.42,
      scaleBoost: 1.02,
      cursor: "pointer",
    };
  }
  if (input.hovered) {
    return {
      showGlow: true,
      emissiveBoost: 0.28,
      scaleBoost: 1.018,
      cursor: "pointer",
    };
  }
  if (input.relationshipExplorationActive && input.connectedToSelected) {
    return {
      showGlow: true,
      emissiveBoost: 0.16,
      scaleBoost: 1.008,
      cursor: "default",
    };
  }
  return {
    showGlow: false,
    emissiveBoost: 0,
    scaleBoost: 1,
    cursor: interactive ? "pointer" : "default",
  };
}

export type ExecutiveRelationshipExploration = {
  active: boolean;
  selectedObjectId: string | null;
  connectedObjectIds: string[];
  incomingObjectIds: string[];
  outgoingObjectIds: string[];
};

export function buildExecutiveRelationshipExploration(input: {
  selectedObjectId: string | null;
  relationships: Array<{ sourceId: string; targetId: string }>;
}): ExecutiveRelationshipExploration {
  const selectedObjectId = input.selectedObjectId?.trim() || null;
  if (!selectedObjectId) {
    return {
      active: false,
      selectedObjectId: null,
      connectedObjectIds: [],
      incomingObjectIds: [],
      outgoingObjectIds: [],
    };
  }

  const incoming = new Set<string>();
  const outgoing = new Set<string>();
  input.relationships.forEach(({ sourceId, targetId }) => {
    if (targetId === selectedObjectId && sourceId) incoming.add(sourceId);
    if (sourceId === selectedObjectId && targetId) outgoing.add(targetId);
  });
  const connectedObjectIds = Array.from(new Set([...incoming, ...outgoing]));
  return {
    active: true,
    selectedObjectId,
    connectedObjectIds,
    incomingObjectIds: Array.from(incoming),
    outgoingObjectIds: Array.from(outgoing),
  };
}

export function readSceneRelationshipEdges(sceneJson: unknown): Array<{ sourceId: string; targetId: string }> {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  if (!Array.isArray(relationships)) return [];
  const edges: Array<{ sourceId: string; targetId: string }> = [];
  relationships.forEach((relationship) => {
    const record = relationship as {
      source_id?: unknown;
      target_id?: unknown;
      from?: unknown;
      to?: unknown;
      source?: unknown;
      target?: unknown;
    };
    const sourceId = String(
      record.source_id ?? record.from ?? record.source ?? ""
    ).trim();
    const targetId = String(
      record.target_id ?? record.to ?? record.target ?? ""
    ).trim();
    if (!sourceId || !targetId) return;
    edges.push({ sourceId, targetId });
  });
  return edges;
}

export function buildRelationshipNeighborMap(
  objectIds: string[],
  edges: Array<{ sourceId: string; targetId: string }>
): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  const ensure = (id: string) => {
    if (!map.has(id)) map.set(id, new Set<string>());
    return map.get(id)!;
  };
  edges.forEach(({ sourceId, targetId }) => {
    ensure(sourceId).add(targetId);
    ensure(targetId).add(sourceId);
  });
  const result = new Map<string, string[]>();
  objectIds.forEach((id) => {
    result.set(id, Array.from(map.get(id) ?? []));
  });
  return result;
}
