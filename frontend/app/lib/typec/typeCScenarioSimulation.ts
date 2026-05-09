import type { SceneJson, SceneLoopEdge } from "../sceneTypes.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";

export type TypeCScenarioSimulation = {
  scenarioId: string;
  affectedObjectIds: string[];
  propagationPaths: {
    from: string;
    to: string;
    intensity: number;
  }[];
  riskLevel: "low" | "medium" | "high";
  summary: string;
};

function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return 0.4;
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function uniqueStrings(values: unknown[]): string[] {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function sceneObjectIds(sceneJson: SceneJson | null | undefined): Set<string> {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  return new Set(objects.map((object) => String(object.id ?? "").trim()).filter(Boolean));
}

function sceneObjectLabels(sceneJson: SceneJson | null | undefined): Map<string, string> {
  const labels = new Map<string, string>();
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  for (const object of objects) {
    const id = String(object.id ?? "").trim();
    if (!id) continue;
    labels.set(id, String(object.label ?? object.name ?? object.display_label ?? id).trim() || id);
  }
  return labels;
}

function edgeKey(edge: Pick<SceneLoopEdge, "from" | "to">): string {
  return `${edge.from}->${edge.to}`;
}

function sceneEdges(sceneJson: SceneJson | null | undefined): SceneLoopEdge[] {
  const loops = Array.isArray(sceneJson?.scene?.loops) ? sceneJson.scene.loops : [];
  return loops.flatMap((loop) => (Array.isArray(loop.edges) ? loop.edges : []));
}

function labelFor(labels: Map<string, string>, id: string): string {
  return labels.get(id) ?? id;
}

function buildFallbackSummary(
  scenario: TypeCScenarioDraft,
  labels: Map<string, string>,
  propagationPaths: TypeCScenarioSimulation["propagationPaths"]
): string {
  if (propagationPaths.length > 0) {
    const first = propagationPaths[0];
    const last = propagationPaths[propagationPaths.length - 1];
    return `Delay propagates from ${labelFor(labels, first.from)} to ${labelFor(labels, last.to)}.`;
  }
  const related = scenario.relatedObjectIds.map((id) => labelFor(labels, id)).filter(Boolean);
  if (related.length > 1) return `Scenario pressure touches ${related.join(" and ")}.`;
  if (related.length === 1) return `Scenario pressure is isolated around ${related[0]}.`;
  return "Scenario has no active propagation path yet.";
}

export function simulateTypeCScenario(input: {
  scenario: TypeCScenarioDraft;
  sceneJson: SceneJson;
}): TypeCScenarioSimulation {
  try {
    const scenarioId = String(input.scenario?.id ?? "typec_scenario_unknown");
    const objectIds = sceneObjectIds(input.sceneJson);
    const labels = sceneObjectLabels(input.sceneJson);
    const relatedObjectIds = uniqueStrings(input.scenario?.relatedObjectIds ?? []).filter((id) =>
      objectIds.has(id)
    );
    const relatedSet = new Set(relatedObjectIds);
    const allowedConnectionIds = new Set(uniqueStrings(input.scenario?.basedOnConnections ?? []));

    const paths: TypeCScenarioSimulation["propagationPaths"] = [];
    const seenPaths = new Set<string>();

    for (const edge of sceneEdges(input.sceneJson)) {
      const from = String(edge.from ?? "").trim();
      const to = String(edge.to ?? "").trim();
      if (!from || !to || !objectIds.has(from) || !objectIds.has(to)) continue;
      const key = edgeKey({ from, to });
      const isBasedOnConnection = allowedConnectionIds.has(key);
      const isRelatedEdge = relatedSet.has(from) && relatedSet.has(to);
      if (!isBasedOnConnection && !isRelatedEdge) continue;
      if (seenPaths.has(key)) continue;
      seenPaths.add(key);
      paths.push({
        from,
        to,
        intensity: clampIntensity(paths.length === 0 ? 0.8 : 0.6),
      });
    }

    if (paths.length === 0 && relatedObjectIds.length >= 2) {
      for (let index = 0; index < relatedObjectIds.length - 1; index += 1) {
        const from = relatedObjectIds[index];
        const to = relatedObjectIds[index + 1];
        const key = `${from}->${to}`;
        if (seenPaths.has(key)) continue;
        seenPaths.add(key);
        paths.push({
          from,
          to,
          intensity: clampIntensity(index === 0 ? 0.8 : 0.6),
        });
      }
    }

    const affectedObjectIds = uniqueStrings([
      ...relatedObjectIds,
      ...paths.flatMap((path) => [path.from, path.to]),
    ]);

    const riskLevel: TypeCScenarioSimulation["riskLevel"] =
      affectedObjectIds.length >= 3 && paths.length >= 2
        ? "high"
        : affectedObjectIds.length >= 2 && paths.length >= 1
          ? "medium"
          : "low";

    return {
      scenarioId,
      affectedObjectIds,
      propagationPaths: paths,
      riskLevel,
      summary: buildFallbackSummary(input.scenario, labels, paths),
    };
  } catch {
    return {
      scenarioId: "typec_scenario_unknown",
      affectedObjectIds: [],
      propagationPaths: [],
      riskLevel: "low",
      summary: "Scenario has no active propagation path yet.",
    };
  }
}

export function clearTypeCScenarioSimulation(): TypeCScenarioSimulation | null {
  return null;
}
