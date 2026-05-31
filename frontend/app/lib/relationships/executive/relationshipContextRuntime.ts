import type { NexoraRelationship } from "../relationshipTypes";
import type {
  RelationshipContextEntry,
  RelationshipContextInput,
  RelationshipContextSnapshot,
} from "./executiveRelationshipTypes";
import { CLASSIFICATION_EXECUTIVE_LABELS as LABELS } from "./executiveRelationshipTypes";
import { evaluateExecutiveRelationshipMetadata } from "./executiveRelationshipRuntime";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import { logRelationshipContext } from "./executiveRelationshipInstrumentation";

function connectedLabel(
  relationship: NexoraRelationship,
  objectId: string,
  labels: Map<string, string>
): string {
  const otherId = relationship.sourceId === objectId ? relationship.targetId : relationship.sourceId;
  return labels.get(otherId) ?? otherId;
}

function toContextEntry(
  relationship: NexoraRelationship,
  objectId: string,
  labels: Map<string, string>
): RelationshipContextEntry {
  const metadata = evaluateExecutiveRelationshipMetadata(relationship);
  const classification = classifyExecutiveRelationship(relationship);
  return {
    relationshipId: relationship.id,
    executiveLabel: LABELS[classification],
    connectedObjectLabel: connectedLabel(relationship, objectId, labels),
    classification,
    importance: metadata.relationshipImportance,
  };
}

function pickBest(
  entries: RelationshipContextEntry[],
  classificationFilter?: RelationshipContextEntry["classification"]
): RelationshipContextEntry | null {
  const filtered = classificationFilter
    ? entries.filter((entry) => entry.classification === classificationFilter)
    : entries;
  if (filtered.length === 0) return null;
  return [...filtered].sort((a, b) => b.importance - a.importance)[0] ?? null;
}

/** Build executive relationship context for Object Info — no graph terminology. */
export function resolveRelationshipContext(input: RelationshipContextInput): RelationshipContextSnapshot {
  const objectId = input.objectId.trim();
  const labels = input.objectLabels ?? new Map<string, string>();
  const connected = input.relationships.filter(
    (relationship) => relationship.sourceId === objectId || relationship.targetId === objectId
  );
  const entries = connected.map((relationship) => toContextEntry(relationship, objectId, labels));

  const snapshot: RelationshipContextSnapshot = {
    mostInfluentialConnection: pickBest(entries, "INFLUENCE"),
    mostCriticalDependency: pickBest(entries, "DEPENDENCY"),
    highestRiskRelationship: pickBest(entries, "RISK"),
  };

  logRelationshipContext({
    objectId,
    connectedCount: connected.length,
    influential: snapshot.mostInfluentialConnection?.relationshipId ?? null,
    dependency: snapshot.mostCriticalDependency?.relationshipId ?? null,
    risk: snapshot.highestRiskRelationship?.relationshipId ?? null,
  });

  return snapshot;
}
