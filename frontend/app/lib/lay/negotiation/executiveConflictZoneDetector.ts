import type { ExecutiveConflictZone, ExecutiveStakeholderPosition } from "./executiveNegotiationTypes.ts";

export function detectExecutiveConflictZones(positions: readonly ExecutiveStakeholderPosition[]): readonly ExecutiveConflictZone[] {
  const primary = positions[0];
  if (!primary) {
    return Object.freeze([]);
  }

  return Object.freeze(
    positions.slice(1).map((position) =>
      Object.freeze({
        conflictZoneId: `conflict-zone:${primary.stakeholderId}:${position.stakeholderId}`,
        leftPositionId: primary.stakeholderId,
        rightPositionId: position.stakeholderId,
        conflictStatement: `${primary.stakeholderLabel} and ${position.stakeholderLabel} may emphasize different executive frames.`,
        sourceReferences: Object.freeze([primary.sourceReference, position.sourceReference].sort()),
        explanation: "Conflict zone is a deterministic comparison of audience-derived positions, not a legal or final negotiation finding.",
      })
    ).sort((left, right) => left.conflictZoneId.localeCompare(right.conflictZoneId))
  );
}
