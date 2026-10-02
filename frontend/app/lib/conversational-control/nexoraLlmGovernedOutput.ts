/**
 * LLM-MVP:5 — deterministic governed presentation of optional LLM contribution L.
 *
 * D remains Nexora authority. L is non-authoritative. M is manager-facing text.
 * Governance is local: no second provider call, no canonical mutation.
 */

import type { NexoraLlmManagementContext } from "./nexoraLlmManagementContext.ts";
import type { NexoraLlmParticipantStatus } from "./nexoraLlmConversationParticipant.ts";

export const nexoraLlmGovernedOutputIdentity =
  "LLM-MVP:5/GovernedLlmOutput" as const;

export const NEXORA_LLM_GOVERNED_OUTPUT_BOUNDARY = Object.freeze({
  identity: nexoraLlmGovernedOutputIdentity,
  isAdvisor: false as const,
  isConversationAuthority: false as const,
  mutatesCanonicalState: false as const,
  usesLiveProvider: false as const,
  secondProviderCall: false as const,
  replacesDeterministicAuthority: false as const,
});

export const NEXORA_LLM_MANAGER_TEXT_MAX_CHARS = 480 as const;

export const NEXORA_LLM_GOVERNED_REASONS = Object.freeze([
  "ACCEPTED",
  "NO_LLM_CONTRIBUTION",
  "POLICY_SKIPPED",
  "PROVIDER_FAILURE",
  "REDUNDANT",
  "UNSUPPORTED_CLAIM",
  "AUTHORITY_VIOLATION",
  "ACTION_CLAIM",
  "STATE_MUTATION_CLAIM",
  "INVALID_OUTPUT",
  "EMPTY_OUTPUT",
  "GOVERNANCE_ERROR",
] as const);

export type NexoraLlmGovernedReason =
  (typeof NEXORA_LLM_GOVERNED_REASONS)[number];

export type NexoraGovernedLlmOutput = Readonly<{
  readonly identity: typeof nexoraLlmGovernedOutputIdentity;
  readonly status: "accepted" | "rejected" | "fallback";
  readonly managerText: string;
  readonly deterministicResponse: string;
  readonly llmContributionUsed: boolean;
  readonly reason: NexoraLlmGovernedReason;
  readonly provenance: Readonly<{
    readonly deterministic: boolean;
    readonly llmAssisted: boolean;
  }>;
}>;

const ACTION_CLAIM =
  /\b(?:i|we|nexora)\s+(?:approved|created|assigned|changed|started|stopped|updated|sent|notified|committed|recorded|executed|selected)\b/i;
const FALSE_DECISION =
  /\b(?:i selected|nexora has decided|is now approved|scenario \w+ is now approved|i approved)\b/i;
const FALSE_EXECUTION =
  /\b(?:execution started|task assigned|owner notified|deadline changed|plan committed|assigned it to)\b/i;
const FALSE_OUTCOME =
  /\b(?:lesson learned|was a (?:success|failure)|we (?:succeeded|failed)|outcome (?:is|was) (?:success|failure))\b/i;
const EVIDENCE_CLAIM =
  /\b(?:according to the latest|operations team confirmed|historical data proves|production report)\b/i;
const EPISTEMIC_UPGRADE =
  /\b(?:definitely|proven|confirmed|resolved|certainly|without (?:a )?doubt)\b/i;
const HYPOTHETICAL =
  /\b(?:you could|you may want|you might|consider (?:examining|comparing)|another option|as another option)\b/i;
const SECRET =
  /OPENAI_API_KEY|ANTHROPIC_API_KEY|sk-[a-zA-Z0-9]{8,}|system prompt|\/Users\/|NEXORA_LLM_USAGE_|stack trace/i;
const INJECTION =
  /\b(?:ignore (?:all )?nexora rules|reveal (?:your|the) system prompt|print the api key|override governance)\b/i;
const CREATED_STATE =
  /\b(?:scenario \w+ has been created|i created the|canonical scenario|created (?:decision|scenario|execution))\b/i;
const CONTRADICT_ACTIVE =
  /\b(?:no longer a problem|is not (?:the )?(?:active|current) (?:problem|constraint|subject))\b/i;

function freezeOutput(
  output: Omit<NexoraGovernedLlmOutput, "identity">,
): NexoraGovernedLlmOutput {
  return Object.freeze({
    identity: nexoraLlmGovernedOutputIdentity,
    ...output,
    provenance: Object.freeze({ ...output.provenance }),
  });
}

function fallback(
  deterministicResponse: string,
  reason: NexoraLlmGovernedReason,
  status: "rejected" | "fallback" = "fallback",
): NexoraGovernedLlmOutput {
  return freezeOutput({
    status,
    managerText: deterministicResponse,
    deterministicResponse,
    llmContributionUsed: false,
    reason,
    provenance: { deterministic: true, llmAssisted: false },
  });
}

function normalizeComparable(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9%]+/g, " ").trim();
}

function boundManagerText(text: string): string | null {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  if (trimmed.length <= NEXORA_LLM_MANAGER_TEXT_MAX_CHARS) return trimmed;
  const sliced = trimmed.slice(0, NEXORA_LLM_MANAGER_TEXT_MAX_CHARS);
  const sentence = sliced.match(/^(.*[.?!])\s/);
  const bounded = (sentence?.[1] ?? sliced).trim();
  return bounded.length >= 24 ? bounded : null;
}

function groundText(
  deterministicResponse: string,
  context: NexoraLlmManagementContext | null,
): string {
  return JSON.stringify({
    d: deterministicResponse,
    subject: context?.subject ?? null,
    referent: context?.referent ?? null,
    management: context?.management.refs ?? [],
    dataReality: context?.dataReality.refs ?? [],
    evidence: context?.evidence.refs ?? [],
    scenario: context?.scenario.refs ?? [],
    decision: context?.decision.refs ?? [],
    conversation: context?.conversation ?? null,
  });
}

function numbersOf(text: string): string[] {
  return text.match(/\d+(?:\.\d+)?%?/g) ?? [];
}

function isMaterialNumber(value: string): boolean {
  return value.includes("%") || value.includes(".") || value.replace(/\D/g, "").length >= 2;
}

function isHypotheticalSuggestion(text: string): boolean {
  return HYPOTHETICAL.test(text) && !CREATED_STATE.test(text) && !ACTION_CLAIM.test(text);
}

function overlapsDeterministicAuthority(
  contribution: string,
  deterministicResponse: string,
): boolean {
  const hay = normalizeComparable(contribution);
  return normalizeComparable(deterministicResponse)
    .split(" ")
    .filter((word) => word.length >= 4)
    .some((word) => hay.includes(word));
}

export function governNexoraLlmOutput(input: {
  readonly deterministicResponse: string;
  readonly contribution: string | null;
  readonly participantStatus: NexoraLlmParticipantStatus;
  readonly policyReason?: string | null;
  readonly managementContext?: NexoraLlmManagementContext | null;
}): NexoraGovernedLlmOutput {
  const d = input.deterministicResponse;
  try {
    if (input.participantStatus === "not-configured") {
      return fallback(d, "NO_LLM_CONTRIBUTION");
    }
    if (input.participantStatus === "skipped-by-policy") {
      return fallback(d, "POLICY_SKIPPED");
    }
    if (input.participantStatus === "failed") {
      return fallback(d, "PROVIDER_FAILURE");
    }
    const raw = input.contribution?.trim() ?? "";
    if (!raw || input.participantStatus === "rejected") {
      return fallback(d, "EMPTY_OUTPUT", "rejected");
    }
    if (SECRET.test(raw) || INJECTION.test(raw)) {
      return fallback(d, "INVALID_OUTPUT", "rejected");
    }
    if (normalizeComparable(raw) === normalizeComparable(d)) {
      return freezeOutput({
        status: "fallback",
        managerText: d,
        deterministicResponse: d,
        llmContributionUsed: false,
        reason: "REDUNDANT",
        provenance: { deterministic: true, llmAssisted: false },
      });
    }
    const context = input.managementContext ?? null;
    const ground = groundText(d, context);
    const subject = context?.subject.label;
    const epistemic = (context?.subject.epistemic ?? "").toLowerCase();
    const uncertain =
      /\b(?:unknown|unverified|inferred|watch|unresolved)\b/.test(epistemic);
    if (ACTION_CLAIM.test(raw) || FALSE_EXECUTION.test(raw)) {
      return fallback(d, "ACTION_CLAIM", "rejected");
    }
    if (FALSE_DECISION.test(raw) || CREATED_STATE.test(raw)) {
      return fallback(d, "STATE_MUTATION_CLAIM", "rejected");
    }
    if (FALSE_OUTCOME.test(raw)) {
      return fallback(d, "STATE_MUTATION_CLAIM", "rejected");
    }
    if (EVIDENCE_CLAIM.test(raw)) {
      return fallback(d, "UNSUPPORTED_CLAIM", "rejected");
    }
    if (uncertain && EPISTEMIC_UPGRADE.test(raw)) {
      return fallback(d, "AUTHORITY_VIOLATION", "rejected");
    }
    if (CONTRADICT_ACTIVE.test(raw)) {
      return fallback(d, "AUTHORITY_VIOLATION", "rejected");
    }
    const allowedNumbers = new Set(numbersOf(ground).map((n) => n.toLowerCase()));
    for (const value of numbersOf(raw)) {
      if (isMaterialNumber(value) && !allowedNumbers.has(value.toLowerCase())) {
        return fallback(d, "UNSUPPORTED_CLAIM", "rejected");
      }
    }
    if (subject) {
      const currentClaim = raw.match(
        /\b([A-Za-z][A-Za-z0-9-]*)\b(?: is| remains)? (?:the )?(?:current|active) (?:problem|constraint|subject)/i,
      );
      const claimed = currentClaim?.[1];
      if (
        claimed &&
        claimed.toLowerCase() !== subject.toLowerCase() &&
        !new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(claimed)
      ) {
        return fallback(d, "AUTHORITY_VIOLATION", "rejected");
      }
      if (
        !isHypotheticalSuggestion(raw) &&
        !new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(raw)
      ) {
        return fallback(d, "UNSUPPORTED_CLAIM", "rejected");
      }
    } else if (!isHypotheticalSuggestion(raw) && !overlapsDeterministicAuthority(raw, d)) {
      return fallback(d, "UNSUPPORTED_CLAIM", "rejected");
    }
    const managerText = boundManagerText(raw);
    if (!managerText) {
      return fallback(d, "INVALID_OUTPUT", "rejected");
    }
    return freezeOutput({
      status: "accepted",
      managerText,
      deterministicResponse: d,
      llmContributionUsed: true,
      reason: "ACCEPTED",
      provenance: { deterministic: true, llmAssisted: true },
    });
  } catch {
    return fallback(d, "GOVERNANCE_ERROR", "rejected");
  }
}
