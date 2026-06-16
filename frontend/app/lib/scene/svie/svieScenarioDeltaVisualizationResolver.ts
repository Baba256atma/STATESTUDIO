/**
 * SVIE:4:3 — Derive and resolve scenario delta visual overlays (read-only).
 */

import type { SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import {
  SVIE_SCENARIO_DELTA_PALETTE,
  SVIE_SCENARIO_DELTA_VISUAL_BY_DIRECTION,
  type SvieScenarioDelta,
  type SvieScenarioDeltaDirection,
  type SvieScenarioDeltaNodeVisualStyle,
} from "./svieScenarioDeltaVisualizationContract.ts";

const DIRECTION_RANK: Record<SvieScenarioDeltaDirection, number> = {
  increase: 4,
  decrease: 3,
  unknown: 2,
  stable: 1,
};

function normalizeDelta(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value * 1000) / 1000;
}

function resolveChangeDelta(change: Readonly<{ before?: number; after?: number; delta?: number }>): number | null {
  const explicit = normalizeDelta(change.delta);
  if (explicit !== null) return explicit;
  if (
    typeof change.before === "number" &&
    Number.isFinite(change.before) &&
    typeof change.after === "number" &&
    Number.isFinite(change.after)
  ) {
    return normalizeDelta(change.after - change.before);
  }
  return null;
}

function directionFromDelta(delta: number | null): SvieScenarioDeltaDirection {
  if (delta === null) return "unknown";
  if (Math.abs(delta) < 0.001) return "stable";
  return delta > 0 ? "increase" : "decrease";
}

function mergeDirection(
  current: SvieScenarioDeltaDirection,
  next: SvieScenarioDeltaDirection
): SvieScenarioDeltaDirection {
  return DIRECTION_RANK[next] > DIRECTION_RANK[current] ? next : current;
}

export function deriveScenarioDelta(link: SvieScenarioVisualLink): readonly SvieScenarioDelta[] {
  const deltas: SvieScenarioDelta[] = [];

  for (const objectId of link.objectIds) {
    const changes = link.predictedChanges.filter((change) => change.objectId === objectId);
    if (changes.length === 0) {
      deltas.push(
        Object.freeze({
          objectId,
          scenarioId: link.scenarioId,
          direction: "unknown",
          magnitude: 0,
          confidence: link.confidence,
          changeCount: 0,
        })
      );
      continue;
    }

    let direction: SvieScenarioDeltaDirection = "stable";
    let magnitude = 0;
    let hasKnownDelta = false;

    for (const change of changes) {
      const delta = resolveChangeDelta(change);
      const nextDirection = directionFromDelta(delta);
      direction = mergeDirection(direction, nextDirection);
      if (delta !== null) {
        hasKnownDelta = true;
        magnitude = Math.max(magnitude, Math.abs(delta));
      }
    }

    deltas.push(
      Object.freeze({
        objectId,
        scenarioId: link.scenarioId,
        direction: hasKnownDelta ? direction : "unknown",
        magnitude: Math.round(magnitude * 1000) / 1000,
        confidence: link.confidence,
        changeCount: changes.length,
      })
    );
  }

  return Object.freeze(
    deltas.sort(
      (left, right) =>
        left.objectId.localeCompare(right.objectId) || left.scenarioId.localeCompare(right.scenarioId)
    )
  );
}

export function resolveScenarioDeltaVisualization(
  links: readonly SvieScenarioVisualLink[]
): readonly SvieScenarioDelta[] {
  return Object.freeze(
    links
      .flatMap((link) => [...deriveScenarioDelta(link)])
      .sort(
        (left, right) =>
          left.objectId.localeCompare(right.objectId) || left.scenarioId.localeCompare(right.scenarioId)
      )
  );
}

export function resolveScenarioDeltaNodeVisual(
  delta: SvieScenarioDelta
): SvieScenarioDeltaNodeVisualStyle {
  const directionVisual = SVIE_SCENARIO_DELTA_VISUAL_BY_DIRECTION[delta.direction];
  const confidenceBoost = 0.8 + delta.confidence * 0.2;
  const magnitudeBoost = Math.min(1.25, 1 + delta.magnitude * 0.25);

  return Object.freeze({
    objectId: delta.objectId,
    scenarioId: delta.scenarioId,
    direction: delta.direction,
    glowColor: SVIE_SCENARIO_DELTA_PALETTE[delta.direction],
    glowOpacity: Math.round(directionVisual.glowOpacity * confidenceBoost * 1000) / 1000,
    glowIntensity:
      Math.round(directionVisual.glowIntensity * confidenceBoost * magnitudeBoost * 1000) / 1000,
    radiusMultiplier: directionVisual.radiusMultiplier,
    pulseSpeed: directionVisual.pulseSpeed,
  });
}

export function mergeScenarioDeltaVisuals(
  deltas: readonly SvieScenarioDelta[]
): Readonly<Record<string, SvieScenarioDeltaNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieScenarioDeltaNodeVisualStyle> = {};

  for (const delta of deltas) {
    const visual = resolveScenarioDeltaNodeVisual(delta);
    const existing = nodeVisualByObjectId[delta.objectId];
    if (
      !existing ||
      DIRECTION_RANK[visual.direction] > DIRECTION_RANK[existing.direction] ||
      (DIRECTION_RANK[visual.direction] === DIRECTION_RANK[existing.direction] &&
        visual.glowIntensity > existing.glowIntensity)
    ) {
      nodeVisualByObjectId[delta.objectId] = visual;
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}

export function buildSvieScenarioDeltaSignature(input: {
  links: readonly SvieScenarioVisualLink[];
}): string {
  return `svie:scenario-delta:${JSON.stringify(resolveScenarioDeltaVisualization(input.links))}`;
}
