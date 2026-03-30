"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { SceneJson, SceneLoop } from "../sceneTypes";
import {
  buildPropagationLoopEdges,
  normalizePropagationOverlay,
} from "./propagationOverlay";
import type { PropagationOverlayState } from "./propagationTypes";

type RequestPropagationSimulationParams = {
  sourceObjectId: string;
  sceneJson?: SceneJson | null;
  loops?: SceneLoop[] | null;
  maxDepth?: number;
  decay?: number;
  mode?: "preview" | "backend";
};

function buildObjectGraph(sceneJson: SceneJson | null | undefined, loops?: SceneLoop[] | null) {
  const objects = Array.isArray(sceneJson?.scene?.objects)
    ? sceneJson.scene.objects
        .map((object, idx) => {
          const id = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`).trim();
          return id ? { id } : null;
        })
        .filter(Boolean)
    : [];
  const edges = buildPropagationLoopEdges(loops ?? sceneJson?.scene?.loops ?? []).map((edge) => ({
    from_id: edge.from,
    to_id: edge.to,
    weight: typeof edge.weight === "number" ? edge.weight : 1,
  }));
  if (objects.length === 0 && edges.length === 0) return null;
  return {
    objects,
    edges,
  };
}

export async function requestPropagationSimulation(
  params: RequestPropagationSimulationParams
): Promise<PropagationOverlayState | null> {
  const {
    sourceObjectId,
    sceneJson = null,
    loops,
    maxDepth = 2,
    decay = 0.74,
    mode = "preview",
  } = params;

  const trimmedSourceId = String(sourceObjectId ?? "").trim();
  if (!trimmedSourceId) return null;

  const requestBody = sceneJson
    ? {
        source_object_id: trimmedSourceId,
        scene_json: sceneJson,
        max_depth: maxDepth,
        decay,
        mode,
      }
    : {
        source_object_id: trimmedSourceId,
        object_graph: buildObjectGraph(sceneJson, loops),
        max_depth: maxDepth,
        decay,
        mode,
      };

  if (process.env.NODE_ENV !== "production") {
    console.debug("[Nexora][PropagationBridge][request]", {
      sourceId: trimmedSourceId,
      maxDepth,
      decay,
      mode,
      hasSceneJson: !!sceneJson,
    });
  }

  try {
    const response = await fetchJson(`${apiBase()}/simulation/propagation`, {
      method: "POST",
      body: requestBody,
      timeoutMs: 8000,
      retryNetworkErrors: true,
    });
    const overlay = normalizePropagationOverlay(response);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][PropagationBridge][response]", {
        sourceId: trimmedSourceId,
        active: !!overlay?.active,
        impactedCount: overlay?.impacted_nodes.length ?? 0,
        edgeCount: overlay?.impacted_edges.length ?? 0,
        mode: overlay?.mode ?? null,
      });
    }
    return overlay;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][PropagationBridge][fallback]", {
        sourceId: trimmedSourceId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}
