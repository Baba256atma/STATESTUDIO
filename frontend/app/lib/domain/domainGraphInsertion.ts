import { createDomainEdges } from "./domainEdgeFactory.ts";
import { generateDomainRelationships } from "./domainRelationshipEngine.ts";
import type { SceneJson, SceneLoop, SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

export type DomainGraphInsertionResult = {
  success: boolean;
  nextScene?: SceneJson;
  createdEdgeIds?: string[];
  warnings?: string[];
};

const DOMAIN_RELATIONSHIP_LOOP_ID = "domain_relationships";

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene && typeof (value as SceneJson).scene === "object");
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function sceneLoops(scene: SceneJson): SceneLoop[] {
  return Array.isArray(scene.scene.loops) ? scene.scene.loops : [];
}

function loopEdges(loops: SceneLoop[]): SceneLoopEdge[] {
  return loops.flatMap((loop) => Array.isArray(loop.edges) ? loop.edges : []);
}

function edgeId(edge: unknown): string | null {
  return edge && typeof edge === "object" && "id" in edge ? String((edge as { id?: unknown }).id ?? "") : null;
}

function mergeEdgesIntoDomainLoop(loops: SceneLoop[], edges: SceneLoopEdge[]): SceneLoop[] {
  const domainLoopIndex = loops.findIndex((loop) => loop.id === DOMAIN_RELATIONSHIP_LOOP_ID);
  if (domainLoopIndex >= 0) {
    return loops.map((loop, index) =>
      index === domainLoopIndex
        ? {
            ...loop,
            edges: [...(Array.isArray(loop.edges) ? loop.edges : []), ...edges],
          }
        : loop
    );
  }

  return [
    ...loops,
    {
      id: DOMAIN_RELATIONSHIP_LOOP_ID,
      type: "stability_balance",
      label: "Domain Relationships",
      status: "active",
      severity: 0.2,
      polarity: "positive",
      edges,
    },
  ];
}

export function insertDomainRelationshipsIntoScene(params: {
  currentScene: unknown;
  domainId: unknown;
}): DomainGraphInsertionResult {
  if (!isSceneJson(params.currentScene)) {
    return {
      success: false,
      warnings: ["invalid_scene"],
    };
  }

  const objects = sceneObjects(params.currentScene);
  if (objects.length < 2) {
    return {
      success: false,
      nextScene: params.currentScene,
      warnings: ["not_enough_objects"],
    };
  }

  const loops = sceneLoops(params.currentScene);
  const relationshipResult = generateDomainRelationships({
    domainId: params.domainId,
    objects,
  });
  const edgeResult = createDomainEdges({
    domainId: params.domainId,
    relationships: relationshipResult.relationships,
    existingEdges: loopEdges(loops),
  });
  const edges = edgeResult.edges as SceneLoopEdge[];
  if (!edgeResult.success || edges.length === 0) {
    return {
      success: false,
      nextScene: params.currentScene,
      warnings: [
        ...(relationshipResult.warnings ?? []),
        ...(edgeResult.warnings ?? []),
        "no_new_edges",
      ],
    };
  }

  const nextScene: SceneJson = {
    ...params.currentScene,
    meta: {
      ...(params.currentScene.meta ?? {}),
      lastDomainRelationshipsInsertedAt: new Date().toISOString(),
    },
    scene: {
      ...params.currentScene.scene,
      objects,
      loops: mergeEdgesIntoDomainLoop(loops, edges),
    },
  };

  return {
    success: true,
    nextScene,
    createdEdgeIds: edges.map((edge) => edgeId(edge)).filter((id): id is string => Boolean(id)),
    warnings: relationshipResult.warnings,
  };
}
