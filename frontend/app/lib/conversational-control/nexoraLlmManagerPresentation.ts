/**
 * LLM-MVP:FINAL — async Shell completion of the certified LLM participant.
 *
 * CC:5 stays synchronous and still owns D. When Shell did not inject a
 * live participant, this module POSTs D + Phase-2 context to the existing
 * `/nexora/llm/runtime` cost-guarded runtime, then applies Phase-5
 * governance locally. Not a second Advisor, runtime, or cost guard.
 */

import { apiBase } from "@/app/lib/apiBase.ts";
import type { NexoraConversationalExperienceResult } from "./conversationalExperience.ts";
import {
  nexoraLlmConversationParticipantIdentity,
  type NexoraLlmParticipantStatus,
  type NexoraLlmParticipantTurn,
} from "./nexoraLlmConversationParticipant.ts";
import { governNexoraLlmOutput } from "./nexoraLlmGovernedOutput.ts";

export const NEXORA_LLM_RUNTIME_HTTP_PATH = "/nexora/llm/runtime" as const;

function freezeTurn(
  turn: Omit<NexoraLlmParticipantTurn, "identity">,
): NexoraLlmParticipantTurn {
  return Object.freeze({
    identity: nexoraLlmConversationParticipantIdentity,
    ...turn,
  });
}

function statusFromHttp(body: {
  readonly status?: unknown;
  readonly policy?: { readonly reason?: unknown } | null;
}): NexoraLlmParticipantStatus {
  if (body.status === "skipped") return "skipped-by-policy";
  if (body.status === "ok") return "succeeded";
  return "failed";
}

export async function completeNexoraLlmManagerPresentation(
  result: NexoraConversationalExperienceResult,
  options?: {
    readonly fetchImpl?: typeof fetch;
    readonly apiBaseUrl?: string;
  },
): Promise<NexoraConversationalExperienceResult> {
  const deterministic =
    result.llmGovernedOutput?.deterministicResponse ?? result.response;
  if (result.llmParticipantTurn && result.llmParticipantTurn.status !== "not-configured") {
    return result;
  }
  const context = result.llmManagementContext;
  if (!context) return result;
  const fetchImpl = options?.fetchImpl ?? fetch;
  const base = (options?.apiBaseUrl ?? apiBase()).replace(/\/$/, "");
  let body: {
    contribution?: unknown;
    status?: unknown;
    policy?: { reason?: unknown } | null;
  };
  try {
    const response = await fetchImpl(`${base}${NEXORA_LLM_RUNTIME_HTTP_PATH}`, {
      method: "POST",
      headers: Object.freeze({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        turnId: result.nexoraMessage.id,
        deterministicResponse: deterministic,
        experienceStatus: result.status,
        managementContext: context,
      }),
    });
    if (!response.ok) {
      throw new Error("nexora-llm-http");
    }
    body = (await response.json()) as typeof body;
  } catch {
    const governed = governNexoraLlmOutput({
      deterministicResponse: deterministic,
      contribution: null,
      participantStatus: "failed",
      managementContext: context,
    });
    return overlayPresentation(result, {
      turn: freezeTurn({
        status: "failed",
        invoked: true,
        fallbackUsed: true,
        contribution: null,
        deterministicResponse: deterministic,
      }),
      governed,
    });
  }
  const contribution =
    typeof body.contribution === "string" ? body.contribution : null;
  const participantStatus = statusFromHttp(body);
  const policyReason =
    typeof body.policy?.reason === "string" ? body.policy.reason : null;
  const governed = governNexoraLlmOutput({
    deterministicResponse: deterministic,
    contribution: participantStatus === "succeeded" ? contribution : null,
    participantStatus,
    policyReason,
    managementContext: context,
  });
  return overlayPresentation(result, {
    turn: freezeTurn({
      status: participantStatus === "succeeded" && !contribution?.trim()
        ? "rejected"
        : participantStatus,
      invoked: true,
      fallbackUsed: participantStatus !== "succeeded" && participantStatus !== "skipped-by-policy"
        ? true
        : false,
      contribution: participantStatus === "succeeded" ? contribution?.trim() ?? null : null,
      deterministicResponse: deterministic,
      policyReason,
    }),
    governed,
  });
}

function overlayPresentation(
  result: NexoraConversationalExperienceResult,
  overlay: {
    readonly turn: NexoraLlmParticipantTurn;
    readonly governed: NonNullable<NexoraConversationalExperienceResult["llmGovernedOutput"]>;
  },
): NexoraConversationalExperienceResult {
  const managerText = overlay.governed.managerText;
  const nexoraMessage =
    managerText === result.nexoraMessage.text
      ? result.nexoraMessage
      : Object.freeze({
          ...result.nexoraMessage,
          text: managerText,
        });
  return Object.freeze({
    ...result,
    response: managerText,
    nexoraMessage,
    llmParticipantTurn: overlay.turn,
    llmGovernedOutput: overlay.governed,
  });
}
