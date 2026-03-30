"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { SceneJson, SceneLoop } from "../sceneTypes";
import { buildPropagationLoopEdges } from "./propagationOverlay";
import { normalizeScenarioActionResponsePayload } from "./scenarioActionContract";
import type { ScenarioActionContract, ScenarioActionResponsePayload } from "./scenarioActionTypes";

type RequestScenarioActionParams = {
  contract: ScenarioActionContract;
  sceneJson?: SceneJson | null;
  loops?: SceneLoop[] | null;
  maxDepth?: number;
  decay?: number;
};

function buildObjectGraph(sceneJson: SceneJson | null | undefined, loops?: SceneLoop[] | null) {
  const object_ids = Array.isArray(sceneJson?.scene?.objects)
    ? sceneJson.scene.objects
        .map((object, idx) => String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`).trim())
        .filter(Boolean)
    : [];
  const edges = buildPropagationLoopEdges(loops ?? sceneJson?.scene?.loops ?? []).map((edge) => ({
    from_id: edge.from,
    to_id: edge.to,
    weight: typeof edge.weight === "number" ? edge.weight : 1,
  }));
  if (object_ids.length === 0 && edges.length === 0) return null;
  return { object_ids, edges };
}

export async function requestScenarioAction(
  params: RequestScenarioActionParams
): Promise<ScenarioActionResponsePayload | null> {
  const { contract, sceneJson = null, loops, maxDepth = 2, decay = 0.74 } = params;
  const requestBody = {
    scenario_action: contract.intent,
    scene_json: sceneJson,
    object_graph: sceneJson ? undefined : buildObjectGraph(sceneJson, loops),
    current_context: {
      visualization_hints: contract.visualization_hints,
      metadata: contract.metadata,
    },
    max_depth: maxDepth,
    decay,
  };

  if (process.env.NODE_ENV !== "production") {
    console.debug("[Nexora][ScenarioAction][request]", {
      actionId: contract.intent.action_id,
      actionKind: contract.intent.action_kind,
      sourceId: contract.intent.source_object_id,
      outputs: contract.intent.requested_outputs,
    });
  }

  try {
    const response = await fetchJson(`${apiBase()}/simulation/scenario-action`, {
      method: "POST",
      body: requestBody,
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    const normalized = normalizeScenarioActionResponsePayload(response);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][ScenarioAction][response]", {
        actionId: contract.intent.action_id,
        hasPropagation: !!normalized?.propagation?.active,
        hasDecisionPath: !!normalized?.decisionPath?.active,
      });
    }
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][ScenarioAction][fallback]", {
        actionId: contract.intent.action_id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}
