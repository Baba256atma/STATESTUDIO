import type { NexoraRelationship } from "../relationshipTypes";
import type { RelationshipAnimationContract } from "./executiveRelationshipTypes";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import { evaluateExecutiveRelationshipMetadata } from "./executiveRelationshipRuntime";

/** Architecture-only contract for future animated intelligence overlays. */
export function createRelationshipAnimationContract(
  relationship: NexoraRelationship,
  rendererKind: RelationshipAnimationContract["rendererKind"] = "three"
): RelationshipAnimationContract {
  const metadata = evaluateExecutiveRelationshipMetadata(relationship);
  const classification = classifyExecutiveRelationship(relationship);

  const supportedAnimations: RelationshipAnimationContract["supportedAnimations"] = [];
  if (classification === "RISK" && metadata.propagationPotential >= 0.5) {
    supportedAnimations.push("risk_movement", "signal_flow");
  }
  if (classification === "INFLUENCE" || classification === "INFORMATION") {
    supportedAnimations.push("signal_flow");
  }
  if (classification === "DEPENDENCY" || classification === "SUPPLY") {
    supportedAnimations.push("dependency_tracing", "decision_propagation");
  }
  if (metadata.relationshipImportance >= 0.7) {
    supportedAnimations.push("decision_propagation");
  }

  return {
    relationshipId: relationship.id,
    supportedAnimations: [...new Set(supportedAnimations)],
    rendererKind,
    enabled: false,
  };
}
