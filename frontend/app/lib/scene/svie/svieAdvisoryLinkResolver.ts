/**
 * SVIE:3:1 — Advisory finding → scene object link resolver (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import type {
  SvieAdvisoryFindingInput,
  SvieAdvisoryLinkSnapshot,
  SvieAdvisoryVisualLink,
} from "./svieAdvisoryLinkFoundationContract.ts";

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
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return normalizeMetric(parsed, fallback);
    }
    const lower = trimmed.toLowerCase();
    if (lower === "very_high" || lower === "high") return 0.85;
    if (lower === "moderate" || lower === "medium") return 0.55;
    if (lower === "low") return 0.3;
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

export function collectAdvisoryFindingObjectIds(
  finding: SvieAdvisoryFindingInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): readonly string[] {
  const collected = new Set<string>();

  const idFields = [
    finding.objectIds,
    finding.relatedObjectIds,
    finding.targetObjectIds,
    finding.linkedObjectIds,
  ];

  for (const field of idFields) {
    if (!Array.isArray(field)) continue;
    for (const entry of field) {
      const objectId = normalizeObjectId(entry);
      if (!objectId) continue;
      if (sceneIndex.size === 0 || sceneIndex.has(objectId)) {
        collected.add(objectId);
      }
    }
  }

  if (Array.isArray(finding.linkedLabels)) {
    for (const label of finding.linkedLabels) {
      const resolved = resolveLabelToObjectId(String(label ?? ""), sceneIndex);
      if (resolved) collected.add(resolved);
    }
  }

  return Object.freeze([...collected].sort((left, right) => left.localeCompare(right)));
}

export function resolveSvieAdvisoryVisualLink(
  finding: SvieAdvisoryFindingInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): SvieAdvisoryVisualLink | null {
  const recommendationId = normalizeObjectId(finding.recommendationId);
  if (!recommendationId) return null;

  const objectIds = collectAdvisoryFindingObjectIds(finding, sceneIndex);
  return Object.freeze({
    recommendationId,
    objectIds,
    confidence: normalizeMetric(finding.confidence, 0),
    impact: normalizeMetric(finding.impact, 0),
  });
}

export function buildSvieAdvisoryLinkSignature(input: {
  findings: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): string {
  const sceneObjects = readSceneObjectsFromJson(input.sceneJson);
  const findingSignature = input.findings
    .map((finding) =>
      JSON.stringify({
        recommendationId: finding.recommendationId,
        objectIds: finding.objectIds ?? null,
        relatedObjectIds: finding.relatedObjectIds ?? null,
        targetObjectIds: finding.targetObjectIds ?? null,
        linkedObjectIds: finding.linkedObjectIds ?? null,
        linkedLabels: finding.linkedLabels ?? null,
        confidence: finding.confidence ?? null,
        impact: finding.impact ?? null,
      })
    )
    .join("|");
  const sceneSignature = sceneObjects.map((object) => normalizeObjectId(object.id)).join(",");
  return `svie:advisory-link:${findingSignature}:${sceneSignature}`;
}

export function resolveSvieAdvisoryLinkSnapshot(
  input: {
    findings?: readonly SvieAdvisoryFindingInput[];
    sceneJson?: unknown;
  },
  generatedAt: number
): SvieAdvisoryLinkSnapshot {
  const findings = Array.isArray(input.findings) ? input.findings : [];
  const sceneIndex = buildSceneObjectIndex(input.sceneJson);
  const linkByRecommendationId: Record<string, SvieAdvisoryVisualLink> = {};

  for (const finding of findings) {
    const link = resolveSvieAdvisoryVisualLink(finding, sceneIndex);
    if (!link) continue;
    linkByRecommendationId[link.recommendationId] = link;
  }

  const links = Object.freeze(
    Object.values(linkByRecommendationId).sort((left, right) =>
      left.recommendationId.localeCompare(right.recommendationId)
    )
  );

  return Object.freeze({
    links,
    linkByRecommendationId: Object.freeze(linkByRecommendationId),
    generatedAt,
    signature: buildSvieAdvisoryLinkSignature({ findings, sceneJson: input.sceneJson }),
  });
}
