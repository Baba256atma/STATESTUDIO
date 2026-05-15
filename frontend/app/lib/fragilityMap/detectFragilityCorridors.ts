import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { FragilityCorridor } from "./enterpriseFragilityMapTypes.ts";

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function detectFragilityCorridors(params: {
  propagationHints?: DomainPropagationHint[];
  fragilityScores?: DomainFragilityScore[];
  relationships?: EnrichedDomainRelationship[];
  domainIds?: string[];
}): FragilityCorridor[] {
  const hints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const relationships = Array.isArray(params.relationships) ? params.relationships : [];
  const scoreByObject = new Map((params.fragilityScores ?? []).map((score) => [score.objectId, score.score]));
  const relationshipByPair = new Map(relationships.map((item) => [`${item.sourceObjectId}|${item.targetObjectId}`, item]));
  const corridors: FragilityCorridor[] = [];
  const seen = new Set<string>();

  for (const first of hints) {
    for (const second of hints) {
      if (first.targetObjectId !== second.sourceObjectId) continue;
      const objectPath = unique([first.sourceObjectId, first.targetObjectId, second.targetObjectId]);
      if (objectPath.length < 3) continue;
      const pathKey = objectPath.join("|");
      if (seen.has(pathKey)) continue;
      seen.add(pathKey);

      const relatedRelationships = [
        relationshipByPair.get(`${first.sourceObjectId}|${first.targetObjectId}`),
        relationshipByPair.get(`${second.sourceObjectId}|${second.targetObjectId}`),
      ].filter((item): item is EnrichedDomainRelationship => Boolean(item));
      const propagationIntensity = Math.round(average([first.propagationStrength, second.propagationStrength]) * 100) / 100;
      const fragilityScore = Math.round(average(objectPath.map((id) => scoreByObject.get(id) ?? 35)));
      if (propagationIntensity < 0.55 && fragilityScore < 55) continue;

      corridors.push({
        id: `fragility_corridor_${normalizeIdPart(pathKey)}`,
        objectPath,
        relatedEdgeIds: unique(relatedRelationships.map((item) => item.edgeId)),
        propagationIntensity,
        fragilityScore,
        domainIds: unique(params.domainIds ?? []),
      });
    }
  }

  return corridors.sort((left, right) => {
    if (right.propagationIntensity !== left.propagationIntensity) return right.propagationIntensity - left.propagationIntensity;
    if (right.fragilityScore !== left.fragilityScore) return right.fragilityScore - left.fragilityScore;
    return left.id.localeCompare(right.id);
  });
}
