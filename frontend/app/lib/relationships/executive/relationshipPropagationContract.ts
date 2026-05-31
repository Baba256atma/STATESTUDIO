import type { NexoraRelationship } from "../relationshipTypes";
import type { RelationshipPropagationContract } from "./executiveRelationshipTypes";
import { evaluateExecutiveRelationshipMetadata } from "./executiveRelationshipRuntime";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import { logRelationshipPropagationContract } from "./executiveRelationshipInstrumentation";

/** Architecture-only contract for future propagation intelligence layers. */
export function createRelationshipPropagationContract(
  relationship: NexoraRelationship
): RelationshipPropagationContract {
  const metadata = evaluateExecutiveRelationshipMetadata(relationship);
  const classification = classifyExecutiveRelationship(relationship);

  const contract: RelationshipPropagationContract = {
    relationshipId: relationship.id,
    sourceObjectId: relationship.sourceId,
    targetObjectId: relationship.targetId,
    classification,
    propagationPotential: metadata.propagationPotential,
    direction: metadata.dependencyDirection,
    readyForRiskPropagation: classification === "RISK" && metadata.propagationPotential >= 0.6,
    readyForScenarioPropagation:
      metadata.propagationPotential >= 0.55 &&
      (classification === "DEPENDENCY" || classification === "INFLUENCE" || classification === "RISK"),
    readyForOperationalImpactFlow:
      classification === "DEPENDENCY" || classification === "SUPPLY" || classification === "RISK",
  };

  logRelationshipPropagationContract(contract as unknown as Record<string, unknown>);
  return contract;
}

export function createRelationshipPropagationContracts(
  relationships: NexoraRelationship[]
): RelationshipPropagationContract[] {
  return relationships.map(createRelationshipPropagationContract);
}
