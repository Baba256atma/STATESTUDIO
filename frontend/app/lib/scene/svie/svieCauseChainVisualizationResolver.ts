/**
 * SVIE:3:2 — Resolve visual styles for cause chains (read-only).
 */

import {
  SVIE_CAUSE_CHAIN_PALETTE,
  type SvieCauseChain,
  type SvieCauseChainConnectionVisualStyle,
  type SvieCauseChainNodeVisualStyle,
  type SvieVisualCauseChain,
} from "./svieCauseChainVisualizationContract.ts";

export function resolveVisualCauseChain(chain: SvieCauseChain): SvieVisualCauseChain {
  const stepCount = chain.steps.length;
  const nodeVisualByObjectId: Record<string, SvieCauseChainNodeVisualStyle> = {};

  for (const step of chain.steps) {
    const phase = stepCount <= 1 ? 0 : step.stepIndex / (stepCount - 1);
    nodeVisualByObjectId[step.objectId] = Object.freeze({
      objectId: step.objectId,
      stepIndex: step.stepIndex,
      stepCount,
      label: step.label,
      showNodeHighlight: true,
      glowColor: SVIE_CAUSE_CHAIN_PALETTE.nodeGlow,
      glowOpacity: 0.12 + phase * 0.12,
      glowIntensity: 0.18 + phase * 0.16,
      sequentialGlowPhase: phase,
    });
  }

  const connectionVisuals = chain.connections.map((connection) => {
    const phase = stepCount <= 1 ? 0 : connection.stepIndex / stepCount;
    return Object.freeze({
      id: `${connection.fromObjectId}__cause__${connection.toObjectId}`,
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      stepIndex: connection.stepIndex,
      highlightColor: SVIE_CAUSE_CHAIN_PALETTE.connection,
      highlightOpacity: 0.22 + phase * 0.18,
      lineWidth: 1.6 + phase * 0.8,
      sequentialGlowPhase: phase,
    });
  });

  return Object.freeze({
    recommendationId: chain.recommendationId,
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
    connectionVisuals: Object.freeze(connectionVisuals),
  });
}

export function mergeVisualCauseChains(
  visualChains: readonly SvieVisualCauseChain[]
): Readonly<{
  nodeVisualByObjectId: Readonly<Record<string, SvieCauseChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieCauseChainConnectionVisualStyle[];
}> {
  const nodeVisualByObjectId: Record<string, SvieCauseChainNodeVisualStyle> = {};
  const connectionVisuals: SvieCauseChainConnectionVisualStyle[] = [];
  const connectionIds = new Set<string>();

  for (const visual of visualChains) {
    for (const [objectId, style] of Object.entries(visual.nodeVisualByObjectId)) {
      const existing = nodeVisualByObjectId[objectId];
      if (!existing || style.glowIntensity > existing.glowIntensity) {
        nodeVisualByObjectId[objectId] = style;
      }
    }
    for (const connection of visual.connectionVisuals) {
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
