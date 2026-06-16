/**
 * SVIE:3:5 — Resolve executive story scene visuals (read-only).
 */

import {
  SVIE_EXECUTIVE_STORY_PALETTE,
  SVIE_EXECUTIVE_STORY_ROLE_RANK,
  SVIE_EXECUTIVE_STORY_ROLE_VISUAL,
  type SvieExecutiveStory,
  type SvieExecutiveStoryConnectionVisualStyle,
  type SvieExecutiveStoryNodeVisualStyle,
  type SvieExecutiveStoryScene,
} from "./svieExecutiveStoryLayerContract.ts";

export function resolveExecutiveStoryScene(story: SvieExecutiveStory): SvieExecutiveStoryScene {
  const nodeVisualByObjectId: Record<string, SvieExecutiveStoryNodeVisualStyle> = {};

  for (const node of story.nodes) {
    const roleVisual = SVIE_EXECUTIVE_STORY_ROLE_VISUAL[node.role];
    nodeVisualByObjectId[node.objectId] = Object.freeze({
      objectId: node.objectId,
      recommendationId: story.recommendationId,
      role: node.role,
      storyIndex: node.storyIndex,
      glowColor: SVIE_EXECUTIVE_STORY_PALETTE[node.role],
      glowOpacity: roleVisual.glowOpacity,
      glowIntensity: roleVisual.glowIntensity,
      ringScale: roleVisual.ringScale,
      pulseSpeed: roleVisual.pulseSpeed,
    });
  }

  const connectionVisuals = story.connections.map((connection) =>
    Object.freeze({
      id: `${story.recommendationId}__story__${connection.fromObjectId}__${connection.toObjectId}`,
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      highlightColor: SVIE_EXECUTIVE_STORY_PALETTE.connection,
      highlightOpacity: 0.16 + connection.storyIndex * 0.04,
      lineWidth: 1.4 + connection.storyIndex * 0.2,
    })
  );

  return Object.freeze({
    recommendationId: story.recommendationId,
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
    connectionVisuals: Object.freeze(connectionVisuals),
  });
}

export function mergeExecutiveStoryScenes(
  storyScenes: readonly SvieExecutiveStoryScene[]
): Readonly<{
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveStoryConnectionVisualStyle[];
}> {
  const nodeVisualByObjectId: Record<string, SvieExecutiveStoryNodeVisualStyle> = {};
  const connectionVisuals: SvieExecutiveStoryConnectionVisualStyle[] = [];
  const connectionIds = new Set<string>();

  for (const scene of storyScenes) {
    for (const [objectId, style] of Object.entries(scene.nodeVisualByObjectId)) {
      const existing = nodeVisualByObjectId[objectId];
      if (
        !existing ||
        SVIE_EXECUTIVE_STORY_ROLE_RANK[style.role] > SVIE_EXECUTIVE_STORY_ROLE_RANK[existing.role]
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
