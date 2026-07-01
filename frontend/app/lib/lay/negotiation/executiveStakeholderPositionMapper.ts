import type { ExecutiveNegotiationContext, ExecutiveNegotiationInput, ExecutiveStakeholderPosition } from "./executiveNegotiationTypes.ts";

export function mapExecutiveStakeholderPositions(
  input: ExecutiveNegotiationInput,
  context: ExecutiveNegotiationContext
): readonly ExecutiveStakeholderPosition[] {
  return Object.freeze(
    context.stakeholderIds.map((stakeholderId) => {
      const audience = stakeholderId.replace("stakeholder:", "");
      const frame = input.communication.audienceFrames.find((candidate) => candidate.audience === audience);
      return Object.freeze({
        stakeholderId,
        stakeholderLabel: audience,
        statedPosition: frame?.focus ?? `Position frame for ${audience}`,
        sourceReference: frame?.frameId ?? context.session.communicationSessionId,
        explanation: `Stakeholder ${audience} is modeled from communication audience framing as metadata only.`,
      });
    }).sort((left, right) => left.stakeholderId.localeCompare(right.stakeholderId))
  );
}
