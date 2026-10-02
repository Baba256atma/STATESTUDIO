/**
 * LLM-MVP:4 — CC participant that evaluates policy before any adapter call.
 *
 * Not the server cost boundary. HTTP /nexora/llm/runtime remains the
 * paid-call authority. This preserves D when policy skips.
 */

import type {
  NexoraLlmConversationParticipant,
  NexoraLlmParticipantRequest,
} from "./nexoraLlmConversationParticipant.ts";
import { executeNexoraLlmRuntime } from "./nexoraLlmRuntime.ts";
import type { NexoraLlmRuntimeAdapter } from "./nexoraLlmRuntimeContract.ts";
import type { NexoraLlmUsageDecision } from "./nexoraLlmUsagePolicy.ts";

export function createNexoraLlmUsageGuardedParticipant(input: {
  readonly adapter: NexoraLlmRuntimeAdapter | null | undefined;
  readonly evaluate: (
    request: NexoraLlmParticipantRequest,
  ) => NexoraLlmUsageDecision;
}): NexoraLlmConversationParticipant {
  return Object.freeze({
    contribute(request: NexoraLlmParticipantRequest) {
      let decision: NexoraLlmUsageDecision;
      try {
        decision = input.evaluate(request);
      } catch {
        return Object.freeze({
          contribution: null,
          skipReason: "CONFIGURATION_ERROR",
        });
      }
      if (!decision.allowed) {
        return Object.freeze({
          contribution: null,
          skipReason: decision.reason,
        });
      }
      const result = executeNexoraLlmRuntime(request, input.adapter);
      if (result.status !== "ok" || !result.contribution) {
        throw Object.freeze({
          identity: "LLM-MVP:4/GuardedParticipantFailure",
          failure: result.failure,
        });
      }
      return Object.freeze({ contribution: result.contribution });
    },
  });
}

export function createInMemoryCallAllowancePolicy(input: {
  readonly enabled: boolean;
  readonly limit: number;
  readonly malformed?: boolean;
}): {
  readonly evaluate: (
    request: NexoraLlmParticipantRequest,
  ) => NexoraLlmUsageDecision;
  readonly authorizedAttempts: () => number;
} {
  let attempts = 0;
  const reserved = new Set<string>();
  return {
    authorizedAttempts: () => attempts,
    evaluate(request) {
      if (input.malformed) {
        return Object.freeze({
          allowed: false,
          reason: "CONFIGURATION_ERROR",
          reservationId: null,
        });
      }
      if (!input.enabled) {
        return Object.freeze({
          allowed: false,
          reason: "LLM_DISABLED",
          reservationId: null,
        });
      }
      if (reserved.has(request.turnId)) {
        return Object.freeze({
          allowed: false,
          reason: "POLICY_DECLINED",
          reservationId: null,
        });
      }
      if (attempts >= input.limit) {
        return Object.freeze({
          allowed: false,
          reason: "ALLOWANCE_EXHAUSTED",
          reservationId: null,
        });
      }
      attempts += 1;
      reserved.add(request.turnId);
      return Object.freeze({
        allowed: true,
        reason: "ALLOWED",
        reservationId: `mem_${request.turnId}`,
      });
    },
  };
}
