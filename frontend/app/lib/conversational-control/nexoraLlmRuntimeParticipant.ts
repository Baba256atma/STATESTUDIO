/**
 * LLM-MVP:3 — CC participant adapter over the provider-neutral runtime.
 *
 * contribute() stays synchronous. Live network belongs in the injected
 * server adapter. Failures throw so CC:5 uses the Phase-1 fallback (D).
 */

import type {
  NexoraLlmConversationParticipant,
  NexoraLlmParticipantRequest,
} from "./nexoraLlmConversationParticipant.ts";
import { executeNexoraLlmRuntime } from "./nexoraLlmRuntime.ts";
import type { NexoraLlmRuntimeAdapter } from "./nexoraLlmRuntimeContract.ts";

export function createNexoraLlmRuntimeParticipant(
  adapter: NexoraLlmRuntimeAdapter | null | undefined,
): NexoraLlmConversationParticipant {
  return Object.freeze({
    contribute(request: NexoraLlmParticipantRequest) {
      const result = executeNexoraLlmRuntime(request, adapter);
      if (result.status !== "ok" || !result.contribution) {
        throw Object.freeze({
          identity: "LLM-MVP:3/RuntimeParticipantFailure",
          failure: result.failure,
        });
      }
      return Object.freeze({ contribution: result.contribution });
    },
  });
}
