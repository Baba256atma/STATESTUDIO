import type {
  ExecutiveConcessionCandidate,
  ExecutiveConflictZone,
  ExecutiveLeveragePoint,
  ExecutiveNegotiationPath,
} from "./executiveNegotiationTypes.ts";

export function buildExecutiveNegotiationPaths(
  leveragePoints: readonly ExecutiveLeveragePoint[],
  concessionCandidates: readonly ExecutiveConcessionCandidate[],
  conflictZones: readonly ExecutiveConflictZone[]
): readonly ExecutiveNegotiationPath[] {
  return Object.freeze(
    conflictZones.map((zone, index) => {
      const leverage = leveragePoints[index % leveragePoints.length];
      const concession = concessionCandidates[index % concessionCandidates.length];
      return Object.freeze({
        pathId: `negotiation-path:${zone.conflictZoneId}`,
        openingFrame: `Open around ${zone.conflictStatement}`,
        leverageReference: leverage?.leverageId ?? zone.conflictZoneId,
        concessionReference: concession?.concessionId ?? zone.conflictZoneId,
        conflictReference: zone.conflictZoneId,
        possibleNextQuestion: `What would make ${zone.rightPositionId} compatible with ${zone.leftPositionId}?`,
        sourceReferences: Object.freeze([zone.conflictZoneId, leverage?.leverageId ?? zone.conflictZoneId, concession?.concessionId ?? zone.conflictZoneId].sort()),
        explanation: "Negotiation path is a possible metadata path and does not choose or execute a final path.",
      });
    }).sort((left, right) => left.pathId.localeCompare(right.pathId))
  );
}
