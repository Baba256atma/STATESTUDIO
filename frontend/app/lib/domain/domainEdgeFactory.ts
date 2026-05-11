import { getDomainDefinition } from "./domainRegistry.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import { domainEdgeDedupeSignature } from "./domainDedupe.ts";
import type { DomainRelationshipMatch } from "./domainRelationshipEngine.ts";
import type { SceneLoopEdge } from "../sceneTypes.ts";

export type DomainEdgeCreationResult = {
  success: boolean;
  edges: unknown[];
  warnings?: string[];
};

type DomainSceneLoopEdge = SceneLoopEdge & {
  id: string;
  metadata: {
    domainId: string;
    relationshipType: string;
    templateId: string;
    generatedBy: "domain_relationship_engine";
  };
};

function edgeId(domainId: string, relationship: DomainRelationshipMatch): string {
  return `domain_edge_${domainId}_${relationship.sourceObjectId}_${relationship.targetObjectId}_${relationship.relationshipType}`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function labelForRelationship(domainId: string, relationship: DomainRelationshipMatch): string {
  const template = getDomainDefinition(domainId).relationshipTemplates.find(
    (candidate) => candidate.id === relationship.templateId
  );
  return template?.description ?? relationship.relationshipType.replace(/_/g, " ");
}

function polarityForRelationship(relationshipType: string): string {
  if (relationshipType === "constraint" || relationshipType === "risk_path") return "negative";
  return "positive";
}

export function createDomainEdges(params: {
  domainId: unknown;
  relationships: DomainRelationshipMatch[];
  existingEdges?: unknown[];
}): DomainEdgeCreationResult {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const existing = Array.isArray(params.existingEdges) ? params.existingEdges : [];
    const seen = new Set(existing.map(domainEdgeDedupeSignature).filter(Boolean));
    const edges: DomainSceneLoopEdge[] = [];

    for (const relationship of params.relationships) {
      if (!relationship.sourceObjectId || !relationship.targetObjectId) continue;
      const key = domainEdgeDedupeSignature({
        from: relationship.sourceObjectId,
        to: relationship.targetObjectId,
        metadata: { relationshipType: relationship.relationshipType },
      });
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        id: edgeId(domainId, relationship),
        from: relationship.sourceObjectId,
        to: relationship.targetObjectId,
        weight: clamp01(relationship.confidence),
        kind: `domain_${relationship.relationshipType}`,
        label: labelForRelationship(domainId, relationship),
        polarity: polarityForRelationship(relationship.relationshipType),
        metadata: {
          domainId,
          relationshipType: relationship.relationshipType,
          templateId: relationship.templateId,
          generatedBy: "domain_relationship_engine",
        },
      });
    }

    return {
      success: true,
      edges,
    };
  } catch {
    return {
      success: false,
      edges: [],
      warnings: ["edge_creation_failed"],
    };
  }
}
