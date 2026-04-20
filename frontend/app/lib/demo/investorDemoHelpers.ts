import { pickDecisionAnalysisFromResponse } from "../panels/buildScenarioExplanationFromDecisionAnalysis";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/** Resolve a primary object id for demo focus: highlights, then decision impacts, then null. */
export function resolveInvestorDemoFocusObjectId(responseData: unknown, sceneJson: unknown): string | null {
  const sources = [responseData, sceneJson, asRecord(asRecord(sceneJson)?.scene)];
  for (const source of sources) {
    const r = asRecord(source);
    if (!r) continue;
    const selections = [asRecord(r.object_selection), asRecord(asRecord(r.scene)?.object_selection)];
    for (const sel of selections) {
      const hi = Array.isArray(sel?.highlighted_objects) ? sel.highlighted_objects : [];
      for (const id of hi) {
        if (typeof id === "string" && id.trim()) return id.trim();
      }
    }
  }
  const da = pickDecisionAnalysisFromResponse(responseData, sceneJson);
  const impacts = da ? asRecord(da.object_impacts as unknown) : null;
  if (impacts) {
    const primary = Array.isArray(impacts.primary) ? impacts.primary : [];
    for (const row of primary) {
      const o = asRecord(row);
      const id = typeof o?.object_id === "string" ? o.object_id.trim() : "";
      if (id) return id;
    }
  }
  return null;
}

export function hasRenderableScenario(sceneJson: unknown): boolean {
  const sj = asRecord(sceneJson);
  const scene = asRecord(sj?.scene);
  const objects = Array.isArray(scene?.objects) ? scene.objects : [];
  return objects.length > 0;
}
