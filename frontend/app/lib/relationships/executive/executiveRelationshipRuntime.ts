import type { NexoraRelationship } from "../relationshipTypes";
import type {
  ExecutiveDependencyDirection,
  ExecutiveRelationshipClassification,
  ExecutiveRelationshipMetadata,
} from "./executiveRelationshipTypes";
import { TYPE_TO_CLASSIFICATION } from "./executiveRelationshipTypes";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import { logExecutiveRelationship } from "./executiveRelationshipInstrumentation";

function readStrength(relationship: NexoraRelationship): number {
  const raw = relationship.metadata?.strength;
  return typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0.5;
}

function resolveDirection(relationship: NexoraRelationship): ExecutiveDependencyDirection {
  if (relationship.direction === "bi") return "bidirectional";
  return "downstream";
}

function resolveImportance(
  relationship: NexoraRelationship,
  classification: ExecutiveRelationshipClassification,
  strength: number
): number {
  const typeWeight =
    classification === "RISK"
      ? 0.92
      : classification === "DEPENDENCY"
        ? 0.84
        : classification === "INFLUENCE"
          ? 0.78
          : classification === "SUPPLY"
            ? 0.72
            : 0.62;
  return Math.max(0.1, Math.min(1, strength * 0.55 + typeWeight * 0.45));
}

function resolvePropagationPotential(
  classification: ExecutiveRelationshipClassification,
  strength: number
): number {
  const base =
    classification === "RISK"
      ? 0.9
      : classification === "DEPENDENCY"
        ? 0.82
        : classification === "INFLUENCE"
          ? 0.74
          : classification === "SUPPLY"
            ? 0.68
            : 0.45;
  return Math.max(0.08, Math.min(1, base * 0.7 + strength * 0.3));
}

/** Generate executive metadata for a relationship without mutating scene contracts. */
export function evaluateExecutiveRelationshipMetadata(
  relationship: NexoraRelationship
): ExecutiveRelationshipMetadata {
  const classification = classifyExecutiveRelationship(relationship);
  const strength = readStrength(relationship);
  const metadata: ExecutiveRelationshipMetadata = {
    relationshipId: relationship.id,
    relationshipImportance: resolveImportance(relationship, classification, strength),
    relationshipType: classification,
    relationshipStrength: strength,
    dependencyDirection: resolveDirection(relationship),
    propagationPotential: resolvePropagationPotential(classification, strength),
  };

  logExecutiveRelationship({
    relationshipId: relationship.id,
    type: relationship.type,
    classification,
    importance: metadata.relationshipImportance,
    strength,
    propagationPotential: metadata.propagationPotential,
  });

  return metadata;
}

export function evaluateExecutiveRelationshipBatch(
  relationships: NexoraRelationship[]
): Record<string, ExecutiveRelationshipMetadata> {
  return Object.fromEntries(
    relationships.map((relationship) => [relationship.id, evaluateExecutiveRelationshipMetadata(relationship)])
  );
}
