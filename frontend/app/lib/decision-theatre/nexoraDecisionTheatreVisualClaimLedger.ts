/**
 * DTH:3 — Read-only visual claim ledger. Not an evidence store.
 */

import type { NexoraDecisionTheatreVisualChannel } from "./nexoraDecisionTheatreVisualGrammar.ts";

export const nexoraDecisionTheatreVisualClaimLedgerIdentity =
  "DTH:3/VisualClaimLedger" as const;

export type NexoraDecisionTheatreVisualClaim = Readonly<{
  claimId: string;
  participantId: string;
  channel: NexoraDecisionTheatreVisualChannel;
  channelMeaning: string;
  semanticToken: string;
  supportingFact: string;
  provenance: string;
  confidenceOrLimitation: string;
  whyVisible: string;
  mustNotInfer: readonly string[];
  advisorExplanation: string;
}>;

export function createNexoraDecisionTheatreVisualClaim(
  input: Omit<NexoraDecisionTheatreVisualClaim, "claimId"> & { readonly claimId?: string },
): NexoraDecisionTheatreVisualClaim {
  const claimId =
    input.claimId ??
    `dth3-claim:${input.participantId}:${input.channel}:${input.semanticToken}`;
  return Object.freeze({
    claimId,
    participantId: input.participantId,
    channel: input.channel,
    channelMeaning: input.channelMeaning,
    semanticToken: input.semanticToken,
    supportingFact: input.supportingFact,
    provenance: input.provenance,
    confidenceOrLimitation: input.confidenceOrLimitation,
    whyVisible: input.whyVisible,
    mustNotInfer: Object.freeze([...input.mustNotInfer]),
    advisorExplanation: input.advisorExplanation,
  });
}
