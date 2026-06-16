/**
 * SVIE:4:6 — Scenario confidence mapping and visual resolver (read-only).
 */

import type { SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import {
  SVIE_SCENARIO_CONFIDENCE_PALETTE,
  SVIE_SCENARIO_CONFIDENCE_VISUAL_BY_TIER,
  type SvieScenarioConfidenceEntry,
  type SvieScenarioConfidenceNodeVisualStyle,
  type SvieScenarioConfidenceTier,
} from "./svieScenarioConfidenceLayerContract.ts";

const TIER_RANK: Record<SvieScenarioConfidenceTier, number> = {
  executive_high: 4,
  high: 3,
  moderate: 2,
  low: 1,
};

function normalizeConfidence(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value <= 1 ? value : value / 100;
    return Math.round(Math.min(1, Math.max(0, normalized)) * 1000) / 1000;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return normalizeConfidence(parsed, fallback);
  }
  return fallback;
}

export function mapScenarioConfidence(confidence: number): SvieScenarioConfidenceTier {
  const normalized = normalizeConfidence(confidence);
  if (normalized >= 0.9) return "executive_high";
  if (normalized >= 0.7) return "high";
  if (normalized >= 0.5) return "moderate";
  return "low";
}

export function mapScenarioConfidenceEntry(link: SvieScenarioVisualLink): SvieScenarioConfidenceEntry {
  const confidence = normalizeConfidence(link.confidence);
  return Object.freeze({
    scenarioId: link.scenarioId,
    confidence,
    tier: mapScenarioConfidence(confidence),
    objectIds: Object.freeze([...link.objectIds].sort((left, right) => left.localeCompare(right))),
  });
}

export function mapScenarioConfidences(
  links: readonly SvieScenarioVisualLink[]
): readonly SvieScenarioConfidenceEntry[] {
  return Object.freeze(
    links
      .map((link) => mapScenarioConfidenceEntry(link))
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );
}

function resolveNodeVisual(
  entry: SvieScenarioConfidenceEntry,
  objectId: string
): SvieScenarioConfidenceNodeVisualStyle {
  const tierVisual = SVIE_SCENARIO_CONFIDENCE_VISUAL_BY_TIER[entry.tier];
  return Object.freeze({
    objectId,
    scenarioId: entry.scenarioId,
    tier: entry.tier,
    pulseMode: tierVisual.pulseMode,
    glowColor: SVIE_SCENARIO_CONFIDENCE_PALETTE[entry.tier],
    glowOpacity: tierVisual.glowOpacity,
    glowIntensity: tierVisual.glowIntensity,
    pulseSpeed: tierVisual.pulseSpeed,
    pulseAmplitude: tierVisual.pulseAmplitude,
    ringScale: tierVisual.ringScale,
  });
}

export function resolveScenarioConfidenceVisualization(
  entries: readonly SvieScenarioConfidenceEntry[]
): Readonly<Record<string, SvieScenarioConfidenceNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieScenarioConfidenceNodeVisualStyle> = {};

  for (const entry of entries) {
    for (const objectId of entry.objectIds) {
      const visual = resolveNodeVisual(entry, objectId);
      const existing = nodeVisualByObjectId[objectId];
      if (!existing || TIER_RANK[visual.tier] >= TIER_RANK[existing.tier]) {
        nodeVisualByObjectId[objectId] = visual;
      }
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}

export function buildSvieScenarioConfidenceSignature(input: {
  entries: readonly SvieScenarioConfidenceEntry[];
}): string {
  return `svie:scenario-confidence:${JSON.stringify(input.entries)}`;
}
