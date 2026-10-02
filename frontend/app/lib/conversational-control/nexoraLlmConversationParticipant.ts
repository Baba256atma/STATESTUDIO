/**
 * LLM-MVP:1 — Optional post-resolution LLM language participant for CC:5.
 *
 * Not an Advisor, conversation authority, referent, or mutation owner.
 * Not a live provider. CC remains provider-neutral.
 *
 * NCA `usesLiveLlm: false` is unchanged: NCA is not a live-LLM Advisor.
 * CC `usesLlmOrExternalProvider: false` is unchanged: CC does not own a provider.
 *
 * Existing `app/lib/llm` envelopes require provider/model keys and are
 * [NO_HTTP] dry-run infrastructure. This CC-facing contract is the smallest
 * adapter seam; later phases may wrap it without moving CC onto a vendor API.
 *
 * LLM-MVP:2 attaches a bounded management context projected from existing
 * Nexora owners. The participant still cannot replace the deterministic response.
 */

import type { NexoraConversationalExperienceStatus } from "./conversationalExperience.ts";
import {
  emptyNexoraLlmManagementContext,
  projectNexoraLlmManagementContext,
  type NexoraLlmManagementContext,
  type NexoraLlmManagementContextInput,
} from "./nexoraLlmManagementContext.ts";

export const nexoraLlmConversationParticipantIdentity =
  "LLM-MVP:1/ConversationParticipantSeam" as const;
export const nexoraLlmConversationParticipantVersion = "1.0.0" as const;
export const nexoraLlmConversationParticipantNamespace =
  "nexora.conversational-control.llm-conversation-participant" as const;

export const NEXORA_LLM_PARTICIPANT_BOUNDARY = Object.freeze({
  identity: nexoraLlmConversationParticipantIdentity,
  isAdvisor: false as const,
  isConversationAuthority: false as const,
  isReferentAuthority: false as const,
  mutatesCanonicalState: false as const,
  usesLiveProvider: false as const,
  ownsProviderRouting: false as const,
  ownsMemory: false as const,
  ncaUsesLiveLlmRemainsFalse: true as const,
  ccUsesLlmOrExternalProviderRemainsFalse: true as const,
  replacesDeterministicResponse: false as const,
});

export const NEXORA_LLM_PARTICIPANT_STATUSES = Object.freeze([
  "not-configured",
  "succeeded",
  "failed",
  "rejected",
  "skipped-by-policy",
] as const);

export type NexoraLlmParticipantStatus =
  (typeof NEXORA_LLM_PARTICIPANT_STATUSES)[number];

/**
 * Provider-neutral request. `managementContext` is a bounded projection of
 * existing Nexora owners. CC must not add vendor-specific fields here.
 */
export type NexoraLlmParticipantRequest = Readonly<{
  readonly turnId: string;
  readonly deterministicResponse: string;
  readonly experienceStatus: NexoraConversationalExperienceStatus;
  readonly managementContext: NexoraLlmManagementContext;
}>;

export type { NexoraLlmManagementContext, NexoraLlmManagementContextInput };

export type NexoraLlmParticipantResult = Readonly<{
  readonly contribution: string | null;
  readonly skipReason?: string | null;
}>;

export type NexoraLlmConversationParticipant = Readonly<{
  readonly contribute: (
    request: NexoraLlmParticipantRequest,
  ) => NexoraLlmParticipantResult;
}>;

export type NexoraLlmParticipantTurn = Readonly<{
  readonly identity: typeof nexoraLlmConversationParticipantIdentity;
  readonly status: NexoraLlmParticipantStatus;
  readonly invoked: boolean;
  readonly fallbackUsed: boolean;
  readonly contribution: string | null;
  readonly deterministicResponse: string;
  readonly policyReason?: string | null;
}>;

function freezeTurn(
  turn: Omit<NexoraLlmParticipantTurn, "identity">,
): NexoraLlmParticipantTurn {
  return Object.freeze({
    identity: nexoraLlmConversationParticipantIdentity,
    ...turn,
  });
}

function isThenable(value: unknown): boolean {
  return (
    value != null &&
    typeof value === "object" &&
    "then" in value &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

export function invokeNexoraLlmConversationParticipant(input: {
  readonly participant: NexoraLlmConversationParticipant | null | undefined;
  readonly turnId: string;
  readonly deterministicResponse: string;
  readonly experienceStatus: NexoraConversationalExperienceStatus;
  readonly contextInput?: NexoraLlmManagementContextInput | null;
}): NexoraLlmParticipantTurn {
  const deterministicResponse = input.deterministicResponse;
  if (!input.participant) {
    return freezeTurn({
      status: "not-configured",
      invoked: false,
      fallbackUsed: true,
      contribution: null,
      deterministicResponse,
    });
  }

  let managementContext: NexoraLlmManagementContext;
  try {
    managementContext = input.contextInput
      ? projectNexoraLlmManagementContext(input.contextInput)
      : emptyNexoraLlmManagementContext();
  } catch {
    return freezeTurn({
      status: "failed",
      invoked: false,
      fallbackUsed: true,
      contribution: null,
      deterministicResponse,
    });
  }

  try {
    const request: NexoraLlmParticipantRequest = Object.freeze({
      turnId: input.turnId,
      deterministicResponse,
      experienceStatus: input.experienceStatus,
      managementContext,
    });
    const raw: unknown = input.participant.contribute(request);
    if (isThenable(raw) || raw == null || typeof raw !== "object") {
      return freezeTurn({
        status: "rejected",
        invoked: true,
        fallbackUsed: true,
        contribution: null,
        deterministicResponse,
      });
    }
    const skipReason = (raw as { skipReason?: unknown }).skipReason;
    if (
      typeof skipReason === "string" &&
      skipReason.trim() !== "" &&
      (typeof (raw as { contribution?: unknown }).contribution !== "string" ||
        String((raw as { contribution?: unknown }).contribution).trim() === "")
    ) {
      return freezeTurn({
        status: "skipped-by-policy",
        invoked: true,
        fallbackUsed: false,
        contribution: null,
        deterministicResponse,
        policyReason: skipReason,
      });
    }
    const contribution = (raw as { contribution?: unknown }).contribution;
    if (typeof contribution !== "string" || contribution.trim() === "") {
      return freezeTurn({
        status: "rejected",
        invoked: true,
        fallbackUsed: true,
        contribution: null,
        deterministicResponse,
      });
    }
    return freezeTurn({
      status: "succeeded",
      invoked: true,
      fallbackUsed: false,
      contribution: contribution.trim(),
      deterministicResponse,
    });
  } catch {
    return freezeTurn({
      status: "failed",
      invoked: true,
      fallbackUsed: true,
      contribution: null,
      deterministicResponse,
    });
  }
}
