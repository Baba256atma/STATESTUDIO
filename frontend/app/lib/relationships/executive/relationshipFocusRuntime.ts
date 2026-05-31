import type { NexoraRelationship } from "../relationshipTypes";
import type { RelationshipFocusRole } from "./executiveRelationshipTypes";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import { logRelationshipFocus } from "./executiveRelationshipInstrumentation";

export function resolveRelationshipFocusRole(input: {
  relationship: NexoraRelationship;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
}): RelationshipFocusRole {
  const { relationship, selectedObjectId, selectedRelationshipId } = input;
  const objectId = selectedObjectId?.trim() ?? "";
  const isSelectedRelationship = selectedRelationshipId === relationship.id;

  if (!objectId && !isSelectedRelationship) return "connected_context";

  const touchesObject =
    Boolean(objectId) &&
    (relationship.sourceId === objectId || relationship.targetId === objectId);

  if (!touchesObject && !isSelectedRelationship) return "unrelated";

  const classification = classifyExecutiveRelationship(relationship);

  let role: RelationshipFocusRole;
  if (isSelectedRelationship) {
    role =
      classification === "RISK"
        ? "major_risk_route"
        : classification === "INFLUENCE"
          ? "critical_influence"
          : "direct_dependency";
  } else if (classification === "RISK") {
    role = "major_risk_route";
  } else if (classification === "INFLUENCE") {
    role = "critical_influence";
  } else if (classification === "DEPENDENCY" || classification === "SUPPLY" || classification === "CONTROL") {
    role = "direct_dependency";
  } else {
    role = "connected_context";
  }

  logRelationshipFocus({
    relationshipId: relationship.id,
    selectedObjectId: objectId || null,
    focusRole: role,
    classification,
  });

  return role;
}
