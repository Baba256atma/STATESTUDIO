/**
 * SVIE:4:7 — Resolve executive future story scene visuals (read-only).
 */

import {
  SVIE_EXECUTIVE_FUTURE_STORY_PALETTE,
  SVIE_EXECUTIVE_FUTURE_STORY_ROLE_RANK,
  SVIE_EXECUTIVE_FUTURE_STORY_ROLE_VISUAL,
  type SvieExecutiveFutureStory,
  type SvieExecutiveFutureStoryConnectionVisualStyle,
  type SvieExecutiveFutureStoryNodeVisualStyle,
  type SvieExecutiveFutureStoryScene,
} from "./svieExecutiveFutureStoryLayerContract.ts";

function roundVisual(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function resolveExecutiveFutureStoryScene(
  story: SvieExecutiveFutureStory
): SvieExecutiveFutureStoryScene {
  const nodeVisualByObjectId: Record<string, SvieExecutiveFutureStoryNodeVisualStyle> = {};
  const confidenceBoost = 0.85 + story.confidence * 0.15;

  for (const node of story.nodes) {
    const roleVisual = SVIE_EXECUTIVE_FUTURE_STORY_ROLE_VISUAL[node.role];
    nodeVisualByObjectId[node.objectId] = Object.freeze({
      objectId: node.objectId,
      scenarioId: story.scenarioId,
      role: node.role,
      storyIndex: node.storyIndex,
      glowColor: SVIE_EXECUTIVE_FUTURE_STORY_PALETTE[node.role],
      glowOpacity: roundVisual(roleVisual.glowOpacity * confidenceBoost),
      glowIntensity: roundVisual(roleVisual.glowIntensity * confidenceBoost),
      ringScale: roleVisual.ringScale,
      pulseSpeed: roleVisual.pulseSpeed,
    });
  }

  const connectionVisuals = story.connections.map((connection) =>
    Object.freeze({
      id: `${story.scenarioId}__future_story__${connection.fromObjectId}__${connection.toObjectId}`,
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      highlightColor: SVIE_EXECUTIVE_FUTURE_STORY_PALETTE.connection,
      highlightOpacity: roundVisual((0.18 + connection.storyIndex * 0.04) * confidenceBoost),
      lineWidth: 1.5 + connection.storyIndex * 0.25,
    })
  );

  return Object.freeze({
    scenarioId: story.scenarioId,
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
    connectionVisuals: Object.freeze(connectionVisuals),
  });
}

export function mergeExecutiveFutureStoryScenes(
  storyScenes: readonly SvieExecutiveFutureStoryScene[]
): Readonly<{
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveFutureStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveFutureStoryConnectionVisualStyle[];
}> {
  const nodeVisualByObjectId: Record<string, SvieExecutiveFutureStoryNodeVisualStyle> = {};
  const connectionVisuals: SvieExecutiveFutureStoryConnectionVisualStyle[] = [];
  const connectionIds = new Set<string>();

  for (const scene of storyScenes) {
    for (const [objectId, style] of Object.entries(scene.nodeVisualByObjectId)) {
      const existing = nodeVisualByObjectId[objectId];
      if (
        !existing ||
        SVIE_EXECUTIVE_FUTURE_STORY_ROLE_RANK[style.role] >
          SVIE_EXECUTIVE_FUTURE_STORY_ROLE_RANK[existing.role]
      ) {
        nodeVisualByObjectId[objectId] = style;
      }
    }
    for (const connection of scene.connectionVisuals) {
      if (connectionIds.has(connection.id)) continue;
      connectionIds.add(connection.id);
      connectionVisuals.push(connection);
    }
  }

  return Object.freeze({
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
    connectionVisuals: Object.freeze(
      connectionVisuals.sort((left, right) => left.id.localeCompare(right.id))
    ),
  });
}
