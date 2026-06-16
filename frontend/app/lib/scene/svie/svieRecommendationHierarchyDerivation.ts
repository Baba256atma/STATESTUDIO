/**
 * SVIE:3:3 — Derive recommendation object hierarchy from advisory links (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieAdvisoryFindingInput, SvieAdvisoryVisualLink } from "./svieAdvisoryLinkFoundationContract.ts";
import type {
  SvieRecommendationHierarchy,
  SvieRecommendationRankedObject,
  SvieRecommendationTier,
} from "./svieRecommendationVisualizationContract.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMetric(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value <= 1 ? value : value / 100;
    return Math.round(Math.min(1, Math.max(0, normalized)) * 1000) / 1000;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return normalizeMetric(parsed, fallback);
  }
  return fallback;
}

function buildSceneObjectIndex(sceneJson: unknown): ReadonlyMap<string, SceneObject> {
  const objects = readSceneObjectsFromJson(sceneJson);
  const index = new Map<string, SceneObject>();
  for (const object of objects) {
    const id = normalizeObjectId(object.id);
    if (id) index.set(id, object);
    const name = normalizeObjectId(object.name);
    if (name) index.set(name.toLowerCase(), object);
  }
  return index;
}

function resolveLabelToObjectId(label: string, sceneIndex: ReadonlyMap<string, SceneObject>): string | null {
  const normalized = label.trim().toLowerCase();
  if (!normalized) return null;
  for (const [key, object] of sceneIndex.entries()) {
    const objectId = normalizeObjectId(object.id);
    const objectName = normalizeObjectId(object.name)?.toLowerCase();
    if (key === normalized || objectId?.toLowerCase() === normalized || objectName === normalized) {
      return objectId;
    }
  }
  return null;
}

function resolveStepLabel(objectId: string, sceneIndex: ReadonlyMap<string, SceneObject>): string {
  const object = sceneIndex.get(objectId);
  const name = normalizeObjectId(object?.name);
  return name ?? objectId;
}

function resolveObjectImpact(objectId: string, sceneIndex: ReadonlyMap<string, SceneObject>): number {
  const object = sceneIndex.get(objectId);
  return normalizeMetric((object as { impact?: unknown } | undefined)?.impact, 0.5);
}

function tierWeight(tier: SvieRecommendationTier): number {
  if (tier === 1) return 1;
  if (tier === 2) return 0.66;
  return 0.33;
}

function tierFromIndex(index: number): SvieRecommendationTier {
  if (index <= 0) return 1;
  if (index === 1) return 2;
  return 3;
}

function resolveTierAssignments(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
  sceneIndex: ReadonlyMap<string, SceneObject>;
}): readonly { objectId: string; tier: SvieRecommendationTier }[] {
  const finding = input.finding as
    | (SvieAdvisoryFindingInput & {
        recommendationTierSteps?: readonly string[] | null;
        recommendationTiers?: Readonly<{
          tier1?: readonly string[] | null;
          tier2?: readonly string[] | null;
          tier3?: readonly string[] | null;
        }> | null;
        primaryObjectId?: string | null;
      })
    | null
    | undefined;

  const assignments: { objectId: string; tier: SvieRecommendationTier }[] = [];
  const seen = new Set<string>();

  const pushAssignment = (objectId: string | null, tier: SvieRecommendationTier) => {
    if (!objectId || !input.link.objectIds.includes(objectId) || seen.has(objectId)) return;
    seen.add(objectId);
    assignments.push({ objectId, tier });
  };

  if (finding?.recommendationTiers) {
    for (const entry of finding.recommendationTiers.tier1 ?? []) {
      pushAssignment(normalizeObjectId(entry) ?? resolveLabelToObjectId(String(entry ?? ""), input.sceneIndex), 1);
    }
    for (const entry of finding.recommendationTiers.tier2 ?? []) {
      pushAssignment(normalizeObjectId(entry) ?? resolveLabelToObjectId(String(entry ?? ""), input.sceneIndex), 2);
    }
    for (const entry of finding.recommendationTiers.tier3 ?? []) {
      pushAssignment(normalizeObjectId(entry) ?? resolveLabelToObjectId(String(entry ?? ""), input.sceneIndex), 3);
    }
    if (assignments.length > 0) return Object.freeze(assignments);
  }

  if (Array.isArray(finding?.recommendationTierSteps) && finding.recommendationTierSteps.length > 0) {
    finding.recommendationTierSteps.forEach((step, index) => {
      const objectId =
        normalizeObjectId(step) ?? resolveLabelToObjectId(String(step ?? ""), input.sceneIndex);
      pushAssignment(objectId, tierFromIndex(index));
    });
    if (assignments.length > 0) return Object.freeze(assignments);
  }

  const primaryObjectId =
    normalizeObjectId(finding?.primaryObjectId) ??
    (Array.isArray(finding?.targetObjectIds) && finding.targetObjectIds.length > 0
      ? normalizeObjectId(finding.targetObjectIds[0])
      : null);
  if (primaryObjectId) {
    pushAssignment(primaryObjectId, 1);
  }

  if (Array.isArray(finding?.linkedLabels) && finding.linkedLabels.length > 0) {
    finding.linkedLabels.forEach((label, index) => {
      const objectId = resolveLabelToObjectId(String(label ?? ""), input.sceneIndex);
      if (primaryObjectId && objectId === primaryObjectId) return;
      pushAssignment(objectId, tierFromIndex(primaryObjectId ? index + 1 : index));
    });
    if (assignments.length > 0) return Object.freeze(assignments);
  }

  const findingImpact = normalizeMetric(finding?.impact, input.link.impact);
  const findingConfidence = normalizeMetric(finding?.confidence, input.link.confidence);
  const scored = [...input.link.objectIds]
    .map((objectId) => ({
      objectId,
      score: resolveObjectImpact(objectId, input.sceneIndex) * findingImpact * findingConfidence,
    }))
    .sort((left, right) => right.score - left.score || left.objectId.localeCompare(right.objectId));

  scored.forEach((entry, index) => {
    pushAssignment(entry.objectId, tierFromIndex(index));
  });

  return Object.freeze(assignments);
}

export function deriveRecommendationHierarchy(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
  sceneJson?: unknown;
}): SvieRecommendationHierarchy | null {
  if (input.link.objectIds.length === 0) return null;

  const sceneIndex = buildSceneObjectIndex(input.sceneJson);
  const tierAssignments = resolveTierAssignments({
    link: input.link,
    finding: input.finding ?? null,
    sceneIndex,
  });
  if (tierAssignments.length === 0) return null;

  const findingImpact = normalizeMetric(input.finding?.impact, input.link.impact);
  const findingConfidence = normalizeMetric(input.finding?.confidence, input.link.confidence);

  const rankedObjects: SvieRecommendationRankedObject[] = tierAssignments.map(({ objectId, tier }) =>
    Object.freeze({
      objectId,
      label: resolveStepLabel(objectId, sceneIndex),
      tier,
      rankScore:
        Math.round(
          tierWeight(tier) *
            findingImpact *
            findingConfidence *
            resolveObjectImpact(objectId, sceneIndex) *
            1000
        ) / 1000,
    })
  );

  return Object.freeze({
    recommendationId: input.link.recommendationId,
    title: normalizeObjectId(input.finding?.title) ?? undefined,
    rankedObjects: Object.freeze(
      rankedObjects.sort((left, right) => left.tier - right.tier || right.rankScore - left.rankScore)
    ),
  });
}

export function deriveRecommendationHierarchies(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): readonly SvieRecommendationHierarchy[] {
  const findingById = new Map(
    (input.findings ?? [])
      .map((finding) => [normalizeObjectId(finding.recommendationId), finding] as const)
      .filter((entry): entry is [string, SvieAdvisoryFindingInput] => Boolean(entry[0]))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        deriveRecommendationHierarchy({
          link,
          finding: findingById.get(link.recommendationId) ?? null,
          sceneJson: input.sceneJson,
        })
      )
      .filter((hierarchy): hierarchy is SvieRecommendationHierarchy => hierarchy !== null)
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function buildSvieRecommendationVisualizationSignature(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): string {
  const hierarchies = deriveRecommendationHierarchies(input);
  return `svie:recommendation:${JSON.stringify(hierarchies)}`;
}
