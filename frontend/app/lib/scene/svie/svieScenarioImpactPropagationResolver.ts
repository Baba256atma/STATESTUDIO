/**
 * SVIE:4:4 — Resolve scenario impact propagation visuals (read-only).
 */

import {
  SVIE_SCENARIO_IMPACT_CHAIN_PALETTE,
  type SvieScenarioImpactChain,
  type SvieScenarioImpactChainConnectionVisualStyle,
  type SvieScenarioImpactChainNodeVisualStyle,
  type SvieVisualScenarioImpactChain,
} from "./svieScenarioImpactChainContract.ts";

export function resolveScenarioImpactPropagation(
  chain: SvieScenarioImpactChain
): SvieVisualScenarioImpactChain {
  const stepCount = chain.steps.length;
  const nodeVisualByObjectId: Record<string, SvieScenarioImpactChainNodeVisualStyle> = {};

  for (const step of chain.steps) {
    const phase = stepCount <= 1 ? 0 : step.stepIndex / (stepCount - 1);
    const confidenceBoost = 0.8 + chain.confidence * 0.2;
    nodeVisualByObjectId[step.objectId] = Object.freeze({
      objectId: step.objectId,
      scenarioId: chain.scenarioId,
      stepIndex: step.stepIndex,
      stepCount,
      glowColor: SVIE_SCENARIO_IMPACT_CHAIN_PALETTE.nodeGlow,
      glowOpacity: Math.round((0.12 + phase * 0.12) * confidenceBoost * 1000) / 1000,
      glowIntensity: Math.round((0.18 + phase * 0.18) * confidenceBoost * 1000) / 1000,
      radiusMultiplier: 1.4 + phase * 0.18,
      sequentialGlowPhase: phase,
    });
  }

  const connectionVisuals = chain.connections.map((connection) => {
    const phase = stepCount <= 1 ? 0 : connection.stepIndex / stepCount;
    return Object.freeze({
      id: `${chain.scenarioId}__impact__${connection.fromObjectId}__${connection.toObjectId}`,
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      stepIndex: connection.stepIndex,
      highlightColor: SVIE_SCENARIO_IMPACT_CHAIN_PALETTE.connection,
      highlightOpacity: 0.2 + phase * 0.18,
      lineWidth: 1.5 + phase * 0.8,
      sequentialGlowPhase: phase,
    });
  });

  return Object.freeze({
    scenarioId: chain.scenarioId,
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
    connectionVisuals: Object.freeze(connectionVisuals),
  });
}

export function mergeScenarioImpactPropagations(
  visualChains: readonly SvieVisualScenarioImpactChain[]
): Readonly<{
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioImpactChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieScenarioImpactChainConnectionVisualStyle[];
}> {
  const nodeVisualByObjectId: Record<string, SvieScenarioImpactChainNodeVisualStyle> = {};
  const connectionVisuals: SvieScenarioImpactChainConnectionVisualStyle[] = [];
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
