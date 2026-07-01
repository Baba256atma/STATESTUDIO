import type { ExecutiveInterestAnalysis, ExecutiveStakeholderPosition } from "./executiveNegotiationTypes.ts";

export function analyzeExecutiveInterests(positions: readonly ExecutiveStakeholderPosition[]): readonly ExecutiveInterestAnalysis[] {
  return Object.freeze(
    positions.map((position) =>
      Object.freeze({
        interestId: `interest:${position.stakeholderId}`,
        stakeholderId: position.stakeholderId,
        underlyingInterest: `Underlying interest behind ${position.stakeholderLabel} is to preserve the frame: ${position.statedPosition}`,
        contrastedPosition: position.statedPosition,
        sourceReference: position.sourceReference,
        explanation: "Interest analysis separates the audience-derived stated position from the inferred metadata interest.",
      })
    ).sort((left, right) => left.interestId.localeCompare(right.interestId))
  );
}
