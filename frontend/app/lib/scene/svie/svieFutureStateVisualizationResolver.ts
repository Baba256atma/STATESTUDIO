/**
 * SVIE:4:2 — Resolve future state visual overlays from scenario links (read-only).
 */

import type { SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import {
  SVIE_FUTURE_STATE_PALETTE,
  SVIE_FUTURE_STATE_VISUAL_BY_LEVEL,
  type SvieFutureObjectState,
  type SvieFutureStateLevel,
  type SvieFutureStateNodeVisualStyle,
} from "./svieFutureStateVisualizationContract.ts";

const FUTURE_LEVEL_RANK: Record<SvieFutureStateLevel, number> = {
  stable: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

function normalizeScore(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value <= 1 ? value : value / 100;
    return Math.round(Math.min(1, Math.max(0, normalized)) * 1000) / 1000;
  }
  return fallback;
}

export function classifyFutureStateLevel(futureRiskScore: number): SvieFutureStateLevel {
  const score = normalizeScore(futureRiskScore);
  if (score >= 0.85) return "critical";
  if (score >= 0.65) return "high";
  if (score >= 0.4) return "moderate";
  return "stable";
}

function resolveFutureRiskScore(link: SvieScenarioVisualLink, objectId: string): number {
  const riskChanges = link.predictedChanges.filter(
    (change) => change.objectId === objectId && change.metric === "risk"
  );
  if (riskChanges.length === 0) return 0;

  const strongest = riskChanges
    .map((change) => normalizeScore(change.after, normalizeScore(change.before, 0) + (change.delta ?? 0)))
    .sort((left, right) => right - left)[0];

  return normalizeScore(strongest, 0);
}

export function resolveFutureStateVisualization(
  links: readonly SvieScenarioVisualLink[]
): readonly SvieFutureObjectState[] {
  const states: SvieFutureObjectState[] = [];

  for (const link of links) {
    for (const objectId of link.objectIds) {
      const objectChanges = link.predictedChanges.filter((change) => change.objectId === objectId);
      if (objectChanges.length === 0) continue;

      const futureRiskScore = resolveFutureRiskScore(link, objectId);
      states.push(
        Object.freeze({
          objectId,
          scenarioId: link.scenarioId,
          futureLevel: classifyFutureStateLevel(futureRiskScore),
          futureRiskScore,
          confidence: link.confidence,
          changeCount: objectChanges.length,
        })
      );
    }
  }

  return Object.freeze(
    states.sort(
      (left, right) =>
        left.objectId.localeCompare(right.objectId) || left.scenarioId.localeCompare(right.scenarioId)
    )
  );
}

export function resolveFutureStateNodeVisual(
  state: SvieFutureObjectState
): SvieFutureStateNodeVisualStyle {
  const levelVisual = SVIE_FUTURE_STATE_VISUAL_BY_LEVEL[state.futureLevel];
  const confidenceBoost = 0.8 + state.confidence * 0.2;

  return Object.freeze({
    objectId: state.objectId,
    scenarioId: state.scenarioId,
    futureLevel: state.futureLevel,
    glowColor: SVIE_FUTURE_STATE_PALETTE[state.futureLevel],
    glowOpacity: Math.round(levelVisual.glowOpacity * confidenceBoost * 1000) / 1000,
    glowIntensity: Math.round(levelVisual.glowIntensity * confidenceBoost * 1000) / 1000,
    radiusMultiplier: levelVisual.radiusMultiplier,
    pulseSpeed: levelVisual.pulseSpeed,
  });
}

export function mergeFutureStateVisuals(
  futureStates: readonly SvieFutureObjectState[]
): Readonly<Record<string, SvieFutureStateNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieFutureStateNodeVisualStyle> = {};

  for (const state of futureStates) {
    const visual = resolveFutureStateNodeVisual(state);
    const existing = nodeVisualByObjectId[state.objectId];
    if (
      !existing ||
      FUTURE_LEVEL_RANK[visual.futureLevel] > FUTURE_LEVEL_RANK[existing.futureLevel] ||
      (FUTURE_LEVEL_RANK[visual.futureLevel] === FUTURE_LEVEL_RANK[existing.futureLevel] &&
        visual.glowIntensity > existing.glowIntensity)
    ) {
      nodeVisualByObjectId[state.objectId] = visual;
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}

export function buildSvieFutureStateSignature(input: {
  links: readonly SvieScenarioVisualLink[];
}): string {
  return `svie:future-state:${JSON.stringify(resolveFutureStateVisualization(input.links))}`;
}
