import type { TypeCConnectionSuggestion } from "./typeCConnectionSuggestions.ts";
import { TYPE_C_CORE_OBJECT_ID } from "./typeCSceneBootstrap.ts";
import type { SceneJson, SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

export type TypeCScenarioDraft = {
  id: string;
  title: string;
  description: string;
  trigger: string;
  impact: string;
  confidence: number;
  relatedObjectIds: string[];
  basedOnConnections: string[];
};

type EdgeCandidate = {
  from: string;
  to: string;
  type: "dependency" | "risk_flow" | "support" | "unknown";
  connectionId: string;
  recent: boolean;
};

const MAX_SCENARIOS = 3;

function sceneObjects(sceneJson: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
}

function objectLabelMap(sceneJson: SceneJson): Map<string, string> {
  const labels = new Map<string, string>();
  for (const object of sceneObjects(sceneJson)) {
    const id = String(object.id ?? "").trim();
    if (!id) continue;
    labels.set(id, String(object.label ?? object.name ?? object.display_label ?? id).trim() || id);
  }
  return labels;
}

function labelFor(labels: Map<string, string>, id: string): string {
  return labels.get(id) ?? id;
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0.3;
  return Math.min(0.95, Math.max(0.3, Number(value.toFixed(2))));
}

function connectionTypeFromEdge(edge: SceneLoopEdge): EdgeCandidate["type"] {
  const kind = String(edge.kind ?? edge.label ?? "").toLowerCase();
  if (kind.includes("risk_flow")) return "risk_flow";
  if (kind.includes("dependency") || kind.includes("flow")) return "dependency";
  if (kind.includes("support") || kind.includes("relation")) return "support";
  return "unknown";
}

function edgeCandidates(sceneJson: SceneJson, newConnections: TypeCConnectionSuggestion[] = []): EdgeCandidate[] {
  const candidates: EdgeCandidate[] = [];
  const seen = new Set<string>();

  for (const connection of newConnections) {
    if (!connection.sourceObjectId || !connection.targetObjectId) continue;
    const key = `${connection.sourceObjectId}->${connection.targetObjectId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push({
      from: connection.sourceObjectId,
      to: connection.targetObjectId,
      type: connection.type,
      connectionId: connection.id,
      recent: true,
    });
  }

  for (const loop of sceneJson.scene.loops ?? []) {
    for (const edge of loop.edges ?? []) {
      if (!edge.from || !edge.to) continue;
      const key = `${edge.from}->${edge.to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push({
        from: edge.from,
        to: edge.to,
        type: connectionTypeFromEdge(edge),
        connectionId: key,
        recent: false,
      });
    }
  }

  return candidates.filter((edge) => edge.from !== TYPE_C_CORE_OBJECT_ID && edge.to !== TYPE_C_CORE_OBJECT_ID);
}

function addDraft(drafts: TypeCScenarioDraft[], draft: TypeCScenarioDraft): void {
  if (drafts.some((existing) => existing.id === draft.id || existing.title === draft.title)) return;
  drafts.push({
    ...draft,
    confidence: clampConfidence(draft.confidence),
    relatedObjectIds: [...new Set(draft.relatedObjectIds)].filter(Boolean),
    basedOnConnections: [...new Set(draft.basedOnConnections)].filter(Boolean),
  });
}

export function buildTypeCScenarioDrafts(input: {
  sceneJson: SceneJson;
  newConnections?: TypeCConnectionSuggestion[];
}): TypeCScenarioDraft[] {
  try {
    const objects = sceneObjects(input.sceneJson);
    if (!objects.length) return [];

    const labels = objectLabelMap(input.sceneJson);
    const edges = edgeCandidates(input.sceneJson, input.newConnections ?? []);
    if (!edges.length) return [];

    const drafts: TypeCScenarioDraft[] = [];

    for (const first of edges) {
      const second = edges.find((edge) => edge.from === first.to && edge.to !== first.from);
      if (!second) continue;
      const a = labelFor(labels, first.from);
      const b = labelFor(labels, first.to);
      const c = labelFor(labels, second.to);
      addDraft(drafts, {
        id: `typec_scenario_chain_${first.from}_${first.to}_${second.to}`,
        title: `${a} delay cascade risk`,
        description: `Delay in ${a} may propagate through ${b} to ${c}.`,
        trigger: `${a} delay > 2 days`,
        impact: `${c} disruption and customer dissatisfaction`,
        confidence: first.recent || second.recent ? 0.9 : 0.82,
        relatedObjectIds: [first.from, first.to, second.to],
        basedOnConnections: [first.connectionId, second.connectionId],
      });
    }

    for (const edge of edges.filter((candidate) => candidate.type === "risk_flow")) {
      const from = labelFor(labels, edge.from);
      const to = labelFor(labels, edge.to);
      addDraft(drafts, {
        id: `typec_scenario_risk_flow_${edge.from}_${edge.to}`,
        title: "Risk amplification across nodes",
        description: `Risk may amplify from ${from} into ${to}.`,
        trigger: `${from} volatility increases`,
        impact: `${to} pressure and downstream instability`,
        confidence: edge.recent ? 0.78 : 0.62,
        relatedObjectIds: [edge.from, edge.to],
        basedOnConnections: [edge.connectionId],
      });
    }

    const degree = new Map<string, number>();
    for (const edge of edges) {
      degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
      degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
    }
    for (const [objectId, count] of [...degree.entries()].sort((a, b) => b[1] - a[1])) {
      if (count < 3) continue;
      const label = labelFor(labels, objectId);
      addDraft(drafts, {
        id: `typec_scenario_central_stress_${objectId}`,
        title: `Single point of failure: ${label}`,
        description: `${label} is connected to multiple parts of the system and may become a stress point.`,
        trigger: `${label} capacity or reliability drops`,
        impact: "Multiple dependent nodes may slow down or fail together",
        confidence: 0.66,
        relatedObjectIds: [objectId],
        basedOnConnections: edges
          .filter((edge) => edge.from === objectId || edge.to === objectId)
          .map((edge) => edge.connectionId),
      });
    }

    return drafts
      .sort((left, right) => right.confidence - left.confidence || left.id.localeCompare(right.id))
      .slice(0, MAX_SCENARIOS);
  } catch {
    return [];
  }
}
