/**
 * SVIE:4:5 — Multi-scenario comparison model and visual resolver (read-only).
 */

import type { SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import {
  SVIE_SCENARIO_COMPARISON_PALETTE,
  SVIE_SCENARIO_COMPARISON_VISUAL_BY_ROLE,
  type SvieScenarioComparisonEntry,
  type SvieScenarioComparisonModel,
  type SvieScenarioComparisonNodeVisualStyle,
  type SvieScenarioComparisonRole,
} from "./svieScenarioComparisonLayerContract.ts";

const ROLE_ORDER: readonly SvieScenarioComparisonRole[] = Object.freeze([
  "primary",
  "secondary",
  "alternative",
]);

const ROLE_RANK: Record<SvieScenarioComparisonRole, number> = {
  primary: 3,
  secondary: 2,
  alternative: 1,
};

function normalizeScenarioId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildScenarioOrder(input: {
  links: readonly SvieScenarioVisualLink[];
  primaryScenarioId?: string | null;
  secondaryScenarioId?: string | null;
  alternativeScenarioId?: string | null;
}): readonly SvieScenarioVisualLink[] {
  const linkById = new Map(input.links.map((link) => [link.scenarioId, link] as const));
  const ordered: SvieScenarioVisualLink[] = [];
  const seen = new Set<string>();

  for (const requestedId of [
    input.primaryScenarioId,
    input.secondaryScenarioId,
    input.alternativeScenarioId,
  ]) {
    const scenarioId = normalizeScenarioId(requestedId);
    if (!scenarioId || seen.has(scenarioId)) continue;
    const link = linkById.get(scenarioId);
    if (!link) continue;
    seen.add(scenarioId);
    ordered.push(link);
  }

  for (const link of [...input.links].sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))) {
    if (seen.has(link.scenarioId)) continue;
    seen.add(link.scenarioId);
    ordered.push(link);
  }

  return Object.freeze(ordered.slice(0, ROLE_ORDER.length));
}

export function buildScenarioComparisonModel(input: {
  links: readonly SvieScenarioVisualLink[];
  primaryScenarioId?: string | null;
  secondaryScenarioId?: string | null;
  alternativeScenarioId?: string | null;
}): SvieScenarioComparisonModel {
  const orderedLinks = buildScenarioOrder(input);
  const roleByScenarioId: Record<string, SvieScenarioComparisonRole> = {};
  const entries: SvieScenarioComparisonEntry[] = [];

  orderedLinks.forEach((link, index) => {
    const role = ROLE_ORDER[index];
    if (!role) return;
    roleByScenarioId[link.scenarioId] = role;
    entries.push(
      Object.freeze({
        scenarioId: link.scenarioId,
        role,
        objectIds: Object.freeze([...link.objectIds].sort((left, right) => left.localeCompare(right))),
        confidence: link.confidence,
        predictedChangeCount: link.predictedChanges.length,
      })
    );
  });

  return Object.freeze({
    entries: Object.freeze(entries),
    roleByScenarioId: Object.freeze(roleByScenarioId),
  });
}

function resolveNodeVisual(
  entry: SvieScenarioComparisonEntry,
  objectId: string
): SvieScenarioComparisonNodeVisualStyle {
  const roleVisual = SVIE_SCENARIO_COMPARISON_VISUAL_BY_ROLE[entry.role];
  const confidenceBoost = 0.8 + entry.confidence * 0.2;
  return Object.freeze({
    objectId,
    scenarioId: entry.scenarioId,
    role: entry.role,
    glowColor: SVIE_SCENARIO_COMPARISON_PALETTE[entry.role],
    glowOpacity: Math.round(roleVisual.glowOpacity * confidenceBoost * 1000) / 1000,
    glowIntensity: Math.round(roleVisual.glowIntensity * confidenceBoost * 1000) / 1000,
    radiusMultiplier: roleVisual.radiusMultiplier,
    pulseSpeed: roleVisual.pulseSpeed,
  });
}

export function resolveScenarioComparisonVisualization(
  model: SvieScenarioComparisonModel
): Readonly<Record<string, SvieScenarioComparisonNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieScenarioComparisonNodeVisualStyle> = {};

  for (const entry of model.entries) {
    for (const objectId of entry.objectIds) {
      const visual = resolveNodeVisual(entry, objectId);
      const existing = nodeVisualByObjectId[objectId];
      if (
        !existing ||
        ROLE_RANK[visual.role] > ROLE_RANK[existing.role] ||
        (ROLE_RANK[visual.role] === ROLE_RANK[existing.role] &&
          visual.glowIntensity > existing.glowIntensity)
      ) {
        nodeVisualByObjectId[objectId] = visual;
      }
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}

export function buildSvieScenarioComparisonSignature(input: {
  model: SvieScenarioComparisonModel;
}): string {
  return `svie:scenario-comparison:${JSON.stringify(input.model)}`;
}
