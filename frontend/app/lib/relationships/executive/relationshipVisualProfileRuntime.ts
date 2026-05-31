import type {
  ExecutiveRelationshipMetadata,
  RelationshipFocusRole,
  RelationshipVisualEmphasis,
  RelationshipVisualProfile,
} from "./executiveRelationshipTypes";
import { logExecutiveRelationship } from "./executiveRelationshipInstrumentation";

export function resolveRelationshipVisualProfile(input: {
  metadata: ExecutiveRelationshipMetadata;
  focusRole: RelationshipFocusRole;
  selected?: boolean;
  densityExecutive?: boolean;
}): RelationshipVisualProfile {
  const { metadata, focusRole, selected = false, densityExecutive = true } = input;

  let emphasis: RelationshipVisualEmphasis = "SECONDARY";
  if (selected || focusRole === "major_risk_route" || focusRole === "direct_dependency") {
    emphasis = "PRIMARY";
  } else if (
    focusRole === "critical_influence" ||
    focusRole === "connected_context" ||
    metadata.relationshipImportance >= 0.72
  ) {
    emphasis = "SECONDARY";
  } else {
    emphasis = densityExecutive ? "BACKGROUND" : "SECONDARY";
  }

  const opacity =
    emphasis === "PRIMARY"
      ? Math.min(0.96, 0.62 + metadata.relationshipImportance * 0.34)
      : emphasis === "SECONDARY"
        ? Math.min(0.78, 0.38 + metadata.relationshipImportance * 0.28)
        : Math.max(0.16, 0.22 + metadata.relationshipImportance * 0.12);

  const lineWidthMultiplier =
    emphasis === "PRIMARY"
      ? 1.35 + metadata.relationshipStrength * 0.25
      : emphasis === "SECONDARY"
        ? 1 + metadata.relationshipStrength * 0.12
        : 0.75;

  const profile: RelationshipVisualProfile = {
    emphasis,
    opacity,
    lineWidthMultiplier,
    showLabel: emphasis !== "BACKGROUND" || selected,
    glow: emphasis === "PRIMARY" || metadata.relationshipType === "RISK",
  };

  logExecutiveRelationship({
    relationshipId: metadata.relationshipId,
    emphasis,
    opacity,
    focusRole,
    selected,
  });

  return profile;
}
