import type { NexoraRelationship } from "../relationshipTypes";
import type { ExecutiveRelationshipClassification } from "./executiveRelationshipTypes";
import { TYPE_TO_CLASSIFICATION } from "./executiveRelationshipTypes";
import { logRelationshipClassification } from "./executiveRelationshipInstrumentation";

const SUPPORTED_CLASSIFICATIONS: ExecutiveRelationshipClassification[] = [
  "DEPENDENCY",
  "INFLUENCE",
  "RISK",
  "SUPPLY",
  "INFORMATION",
  "CONTROL",
];

export function classifyExecutiveRelationship(
  relationship: NexoraRelationship
): ExecutiveRelationshipClassification {
  const mapped = TYPE_TO_CLASSIFICATION[relationship.type] ?? "DEPENDENCY";
  logRelationshipClassification({
    relationshipId: relationship.id,
    rawType: relationship.type,
    classification: mapped,
  });
  return mapped;
}

export function isExecutiveRelationshipClassificationSupported(
  classification: ExecutiveRelationshipClassification
): boolean {
  return SUPPORTED_CLASSIFICATIONS.includes(classification);
}

export function isExecutiveRelationshipClassificationImplemented(
  classification: ExecutiveRelationshipClassification
): boolean {
  return classification === "DEPENDENCY" || classification === "INFLUENCE" || classification === "RISK";
}
