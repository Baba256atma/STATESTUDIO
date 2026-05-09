import { TYPE_C_CORE_OBJECT_ID } from "./typeCSceneBootstrap.ts";
import type { TypeCObjectDraft } from "./typeCObjectDraft.ts";
import type { SceneJson, SceneLoop, SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

export type TypeCConnectionSuggestion = {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  type: "dependency" | "risk_flow" | "support";
  reason: string;
  confidence: number;
  selected?: boolean;
};

const TYPE_C_LINK_LOOP_ID = "typec_core_links";
const MAX_SUGGESTIONS = 5;

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function slug(value: string | null | undefined): string {
  return normalize(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function draftObjectId(draft: TypeCObjectDraft): string {
  const id = String(draft.id ?? "").trim();
  if (id) return id;
  return `typec_${slug(draft.label) || "object"}`;
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.display_label ?? object.id ?? "").trim();
}

function sceneObjects(sceneJson: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
}

function sceneLoops(sceneJson: SceneJson | null | undefined): SceneLoop[] {
  return Array.isArray(sceneJson?.scene?.loops) ? sceneJson.scene.loops : [];
}

function tokenSet(value: string): Set<string> {
  return new Set(slug(value).split("_").filter(Boolean));
}

function hasExistingEdge(sceneJson: SceneJson, from: string, to: string): boolean {
  return sceneLoops(sceneJson).some((loop) =>
    Array.isArray(loop.edges) && loop.edges.some((edge) => edge.from === from && edge.to === to)
  );
}

function hasObject(sceneJson: SceneJson, objectId: string): boolean {
  return sceneObjects(sceneJson).some((object) => String(object.id ?? "") === objectId);
}

function addSuggestion(
  suggestions: TypeCConnectionSuggestion[],
  sceneJson: SceneJson,
  suggestion: Omit<TypeCConnectionSuggestion, "id" | "confidence"> & { confidence: number }
): void {
  if (!suggestion.sourceObjectId || !suggestion.targetObjectId) return;
  if (suggestion.sourceObjectId === suggestion.targetObjectId) return;
  if (hasExistingEdge(sceneJson, suggestion.sourceObjectId, suggestion.targetObjectId)) return;

  const id = `typec_connection_${suggestion.sourceObjectId}_${suggestion.targetObjectId}_${suggestion.type}`;
  if (suggestions.some((existing) => existing.id === id)) return;

  suggestions.push({
    ...suggestion,
    id,
    confidence: Math.min(0.95, Math.max(0.3, Number(suggestion.confidence.toFixed(2)))),
    selected: suggestion.confidence >= 0.5,
  });
}

function roleRuleFor(newId: string, newName: string, object: SceneObject): Omit<TypeCConnectionSuggestion, "id" | "confidence"> & { confidence: number } | null {
  const otherName = normalize(objectLabel(object));
  const otherId = String(object.id ?? "");
  const name = normalize(newName);

  if (name.includes("supplier") && otherName.includes("inventory")) {
    return {
      sourceObjectId: newId,
      targetObjectId: otherId,
      type: "dependency",
      reason: "Typical supply chain flow",
      confidence: 0.9,
    };
  }
  if (name.includes("inventory") && otherName.includes("supplier")) {
    return {
      sourceObjectId: otherId,
      targetObjectId: newId,
      type: "dependency",
      reason: "Typical supply chain flow",
      confidence: 0.88,
    };
  }
  if (name.includes("inventory") && otherName.includes("delivery")) {
    return {
      sourceObjectId: newId,
      targetObjectId: otherId,
      type: "risk_flow",
      reason: "Typical supply chain flow",
      confidence: 0.86,
    };
  }
  if (name.includes("delivery") && otherName.includes("inventory")) {
    return {
      sourceObjectId: otherId,
      targetObjectId: newId,
      type: "risk_flow",
      reason: "Typical supply chain flow",
      confidence: 0.86,
    };
  }
  if (name.includes("payment") && otherName.includes("order")) {
    return {
      sourceObjectId: otherId,
      targetObjectId: newId,
      type: "dependency",
      reason: "Dependency pattern",
      confidence: 0.82,
    };
  }
  if (name.includes("order") && otherName.includes("payment")) {
    return {
      sourceObjectId: newId,
      targetObjectId: otherId,
      type: "dependency",
      reason: "Dependency pattern",
      confidence: 0.82,
    };
  }

  return null;
}

export function buildTypeCConnectionSuggestions(input: {
  newObject: TypeCObjectDraft;
  sceneJson: SceneJson;
}): TypeCConnectionSuggestion[] {
  try {
    const objects = sceneObjects(input.sceneJson);
    if (!objects.length) return [];

    const newId = draftObjectId(input.newObject);
    const newLabel = input.newObject.label.trim();
    if (!newLabel || !newId) return [];

    const suggestions: TypeCConnectionSuggestion[] = [];
    const newTokens = tokenSet(newLabel);

    for (const object of objects) {
      const objectId = String(object.id ?? "");
      if (!objectId || objectId === newId) continue;
      const label = objectLabel(object);

      const roleRule = roleRuleFor(newId, newLabel, object);
      if (roleRule) {
        addSuggestion(suggestions, input.sceneJson, roleRule);
        continue;
      }

      const shared = [...newTokens].filter((token) => token.length > 2 && tokenSet(label).has(token));
      if (shared.length > 0) {
        addSuggestion(suggestions, input.sceneJson, {
          sourceObjectId: objectId,
          targetObjectId: newId,
          type: "support",
          reason: "Name similarity detected",
          confidence: shared.length > 1 ? 0.72 : 0.52,
        });
      }
    }

    if (objects.some((object) => String(object.id ?? "") === TYPE_C_CORE_OBJECT_ID)) {
      addSuggestion(suggestions, input.sceneJson, {
        sourceObjectId: TYPE_C_CORE_OBJECT_ID,
        targetObjectId: newId,
        type: "support",
        reason: "Central system connection",
        confidence: 0.42,
      });
    }

    return suggestions
      .sort((left, right) => right.confidence - left.confidence || left.id.localeCompare(right.id))
      .slice(0, MAX_SUGGESTIONS);
  } catch {
    return [];
  }
}

function addEdgeToLoops(loops: SceneLoop[], edge: SceneLoopEdge): { loops: SceneLoop[]; added: boolean } {
  if (loops.some((loop) => loop.edges?.some((existing) => existing.from === edge.from && existing.to === edge.to))) {
    return { loops, added: false };
  }

  const linkLoopIndex = loops.findIndex((loop) => loop.id === TYPE_C_LINK_LOOP_ID);
  if (linkLoopIndex >= 0) {
    return {
      added: true,
      loops: loops.map((loop, index) =>
        index === linkLoopIndex ? { ...loop, edges: [...(loop.edges ?? []), edge] } : loop
      ),
    };
  }

  return {
    added: true,
    loops: [
      ...loops,
      {
        id: TYPE_C_LINK_LOOP_ID,
        type: "stability_balance",
        label: "Type-C Core Links",
        status: "active",
        severity: 0.2,
        edges: [edge],
      },
    ],
  };
}

export function applyTypeCConnectionSuggestionsToScene(
  sceneJson: SceneJson,
  suggestions: TypeCConnectionSuggestion[]
): SceneJson {
  const selected = suggestions.filter((suggestion) => suggestion.selected);
  if (!selected.length) return sceneJson;

  let nextLoops = sceneLoops(sceneJson);
  let added = false;

  for (const suggestion of selected) {
    if (!hasObject(sceneJson, suggestion.sourceObjectId) || !hasObject(sceneJson, suggestion.targetObjectId)) continue;
    const result = addEdgeToLoops(nextLoops, {
      from: suggestion.sourceObjectId,
      to: suggestion.targetObjectId,
      weight: suggestion.confidence,
      kind: `type_c_${suggestion.type}`,
      label: suggestion.reason,
      polarity: "positive",
    });
    nextLoops = result.loops;
    added = added || result.added;
  }

  if (!added) return sceneJson;

  return {
    ...sceneJson,
    meta: { ...(sceneJson.meta ?? {}), mode: "type_c" },
    scene: {
      ...sceneJson.scene,
      loops: nextLoops,
    },
  };
}
