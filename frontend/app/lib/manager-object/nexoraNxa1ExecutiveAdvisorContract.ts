/**
 * NXA:1 — Executive Advisor identity and conversation contract.
 *
 * This is a policy projection over the existing NCA/MO/CC interpretation. It
 * does not classify a turn independently, compose a second answer, or mutate
 * Runtime. Its purpose is to make the existing Advisor's behavioral promise
 * explicit and certifiable at the authoritative orchestration boundary.
 */

import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";

export const nexoraNxa1Identity =
  "NXA:1/ExecutiveDecisionAdvisorConversationContract" as const;

export const NEXORA_ADVISOR_ROLE = "Executive Decision Advisor" as const;

export const NEXORA_NXA1_BOUNDARY = Object.freeze({
  identity: nexoraNxa1Identity,
  role: NEXORA_ADVISOR_ROLE,
  createsSecondIntentArchitecture: false as const,
  createsSecondComposer: false as const,
  createsSecondReferentStore: false as const,
  writesStage: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesExecutiveTruth: false as const,
  needAuthority: "NCA:1+MO meaning" as const,
  referentAuthority: "NCA:2 dialogue state" as const,
  presentationAuthority: "DIR:1" as const,
});

export const NXA_CONVERSATIONAL_NEEDS = Object.freeze([
  "KNOW",
  "UNDERSTAND",
  "NAVIGATE",
  "INVESTIGATE",
  "CONSEQUENCE",
  "ADVISE",
  "COMPARE",
  "PRIORITIZE",
  "DECIDE",
  "EXECUTE",
  "OBSERVE",
  "LEARN",
  "LEARN_NEXORA",
  "CLARIFY",
] as const);

export type NxaConversationalNeed = (typeof NXA_CONVERSATIONAL_NEEDS)[number];

export type NxaAdvisorTurnContract = {
  readonly identity: typeof nexoraNxa1Identity;
  readonly role: typeof NEXORA_ADVISOR_ROLE;
  readonly need: NxaConversationalNeed;
  readonly needSource: "NCA_MO_EXISTING_AUTHORITIES";
  readonly referentId: string | null;
  readonly referentName: string | null;
  readonly referentSource: "EXPLICIT_OR_NCA2_ACTIVE_SUBJECT" | "NCA2_ACTIVE_COLLECTION" | "UNRESOLVED";
  readonly collectionMemberIds: readonly string[];
  readonly navigationAllowed: boolean;
  readonly evidenceRequired: boolean;
  readonly managerAuthorityPreserved: true;
};

function needFromExistingMeaning(
  meaning: CanonicalManagerMeaning,
  nca: ManagerConversationTurn,
): NxaConversationalNeed {
  const operation = meaning.requestedOperation;
  if (nca.advisorBehavior === "CLARIFY" || nca.need.family === "CLARIFY") return "CLARIFY";
  if (operation === "FOCUS" || nca.need.family === "LOCATE") return "NAVIGATE";
  if (operation === "CAUSE" || operation === "INVESTIGATE" || operation === "EVIDENCE") return "INVESTIGATE";
  if (operation === "CONSEQUENCE" || operation === "IMPACT") return "CONSEQUENCE";
  if (operation === "COMPARE" || nca.need.family === "COMPARE") return "COMPARE";
  if (operation === "RECOMMEND" || nca.need.family === "REQUEST_RECOMMENDATION") return "ADVISE";
  if (operation === "ATTENTION") return "PRIORITIZE";
  if (nca.need.family === "DECIDE") return "DECIDE";
  if (nca.need.family === "ACT") return "EXECUTE";
  if (operation === "OBSERVE" || nca.need.family === "PROVIDE_INFORMATION") return "OBSERVE";
  if (nca.need.family === "LEARN" || nca.need.family === "FOLLOW_UP") return "LEARN";
  if (operation === "HELP" || nca.need.family === "TEACH" || nca.need.family === "ORIENT") return "LEARN_NEXORA";
  if (operation === "EXPLAIN" && /^(?:what is|what's|whats|define)\b/i.test(meaning.rawUtterance.trim())) return "KNOW";
  return "UNDERSTAND";
}

export function resolveNxaAdvisorTurnContract(input: {
  readonly meaning: CanonicalManagerMeaning;
  readonly nca: ManagerConversationTurn;
  readonly dialogue: NexoraConversationState;
}): NxaAdvisorTurnContract {
  const need = needFromExistingMeaning(input.meaning, input.nca);
  const explicit = input.meaning.objectReference;
  const active = input.dialogue.activeSubject;
  const collection = input.dialogue.lastCollection;
  const useCollection =
    !explicit &&
    Boolean(collection?.memberIds?.length) &&
    (need === "COMPARE" ||
      need === "PRIORITIZE" ||
      /\b(?:which one|which of (?:these|them)|among (?:these|them))\b/i.test(
        input.meaning.rawUtterance,
      ) ||
      !active?.id);
  return Object.freeze({
    identity: nexoraNxa1Identity,
    role: NEXORA_ADVISOR_ROLE,
    need,
    needSource: "NCA_MO_EXISTING_AUTHORITIES" as const,
    referentId: useCollection ? null : explicit?.subjectId ?? active?.id ?? null,
    referentName: useCollection ? collection?.kind ?? null : explicit?.canonicalName ?? active?.name ?? null,
    referentSource: useCollection
      ? ("NCA2_ACTIVE_COLLECTION" as const)
      : explicit || active?.id
      ? ("EXPLICIT_OR_NCA2_ACTIVE_SUBJECT" as const)
      : ("UNRESOLVED" as const),
    collectionMemberIds: Object.freeze([...(collection?.memberIds ?? [])]),
    navigationAllowed: need === "NAVIGATE",
    evidenceRequired: need === "INVESTIGATE" || need === "CONSEQUENCE" || need === "ADVISE" || need === "DECIDE",
    managerAuthorityPreserved: true as const,
  });
}

const ARCHITECTURE_LEAK = /\b(?:canonical|resolver|semantic route|runtime binding|overlay|registry|intent code|authority|internal state identifiers?|NCA:\d|MO:\d|EI:\d|DIR:\d)\b/i;
const UNSUPPORTED_CERTAINTY = /\b(?:definitely caused|is causing|confirmed cause)\b/i;

export function inspectNxaManagerLanguage(response: string): {
  readonly architectureLeak: boolean;
  readonly unsupportedCausalCertainty: boolean;
} {
  const certaintyCandidate = response.replace(
    /\b(?:not|isn't|is not|none of (?:these|them) is) (?:a )?confirmed cause\b/gi,
    "uncertainty preserved",
  );
  return Object.freeze({
    architectureLeak: ARCHITECTURE_LEAK.test(response),
    unsupportedCausalCertainty: UNSUPPORTED_CERTAINTY.test(certaintyCandidate),
  });
}

export function verifyNexoraNxa1(): { readonly ok: true } {
  if (NEXORA_NXA1_BOUNDARY.createsSecondIntentArchitecture || NEXORA_NXA1_BOUNDARY.writesStage) {
    throw new Error("NXA:1 boundary violation");
  }
  return Object.freeze({ ok: true as const });
}
