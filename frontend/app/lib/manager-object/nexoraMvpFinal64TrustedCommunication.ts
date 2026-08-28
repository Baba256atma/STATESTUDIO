/**
 * NEX-MVP-FINAL:6.4 — Trusted Executive Communication.
 * Composes manager-facing wording from authoritative material.
 * Does not decide truth, commit decisions, or start execution.
 */

import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { ClarificationTurnResult } from "./nexoraMvpFinal63ClarificationTypes.ts";
import type { ExecutiveObjectExplanation } from "./managerObjectExplainTypes.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";
import type {
  TrustedClaimConfidence,
  TrustedExecutiveClaim,
  TrustedExecutiveCommunication,
  TrustedResponseDepth,
} from "./nexoraMvpFinal64CommunicationTypes.ts";

export const nexoraMvpFinal64CommunicationIdentity =
  "NEX-MVP-FINAL:6.4/TrustedExecutiveCommunication" as const;
export const nexoraMvpFinal64CommunicationVersion = "1.0.0" as const;
export const nexoraMvpFinal64CommunicationNamespace =
  "nexora.mvp.final64.trusted-executive-communication" as const;

export const NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY = Object.freeze({
  identity: nexoraMvpFinal64CommunicationIdentity,
  createsSecondExplainEngine: false as const,
  createsSecondEvidenceStore: false as const,
  createsSecondAdvisor: false as const,
  createsSecondConfidenceSystem: false as const,
  inventsBusinessTruth: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  usesLlm: false as const,
  startsFinal65: false as const,
  mutatesAuthoritativeState: false as const,
});

const FILLER =
  /^(?:absolutely|great question|of course|certainly|happy to help|i'd be happy to|as an ai)[!.,]?\s*/i;
const CONSULTANT =
  /\b(?:leverage synergies|strategic alignment opportunities|holistic approach|optimize stakeholder value|actionable insights)\b/gi;
const FAKE_CERTAINTY =
  /\b(?:definitely|clearly|certainly|guaranteed)\b/gi;
const THEATER =
  /\bcritical strategic inflection point\b/gi;
const LOCKED =
  /^(?:Focused on |Returned to |Moved forward\.|Which item do you mean\?|I can’t compare those subjects)/;
const ARCH_EXTRA =
  /\b(?:FINAL:6\.[0-9]|canonical meaning|namespace|resolver|semantic contract|Data Reality runtime)\b/gi;

export function getNexoraMvpFinal64CommunicationIdentity() {
  return Object.freeze({
    id: nexoraMvpFinal64CommunicationIdentity,
    version: nexoraMvpFinal64CommunicationVersion,
    namespace: nexoraMvpFinal64CommunicationNamespace,
  });
}

export function verifyNexoraMvpFinal64Communication(): { readonly ok: true } {
  if (
    getNexoraMvpFinal64CommunicationIdentity().id !==
    nexoraMvpFinal64CommunicationIdentity
  ) {
    throw new Error("FINAL:6.4 identity mismatch");
  }
  if (NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY.createsSecondExplainEngine) {
    throw new Error("FINAL:6.4 must not create a second Explain Engine");
  }
  if (NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY.commitsDecision) {
    throw new Error("FINAL:6.4 must not commit decisions");
  }
  return Object.freeze({ ok: true as const });
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinSentences(parts: readonly string[]): string {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function resolveDepth(
  meaning: CanonicalManagerMeaning,
  utterance: string,
): TrustedResponseDepth {
  const raw = utterance.toLowerCase();
  if (
    meaning.requestedDepth === "DEEP" ||
    /\b(?:walk me through|give me the details|explain more|in detail)\b/.test(raw)
  ) {
    return "DEEP";
  }
  if (meaning.requestedDepth === "SHALLOW" || /^(?:why|so)\??$/.test(raw.trim())) {
    return "BRIEF";
  }
  return "NORMAL";
}

function causalConfirmed(explanation: ExecutiveObjectExplanation | null): boolean {
  if (!explanation) return false;
  return (
    explanation.drivers.some((item) => item.causalClaim === "confirmed") ||
    explanation.relationships.some((item) => item.causalClaim === "confirmed")
  );
}

function polish(text: string): string {
  return text
    .replace(FILLER, "")
    .replace(CONSULTANT, "")
    .replace(THEATER, "this matters")
    .replace(ARCH_EXTRA, "")
    .replace(NEXORA_MANAGER_ARCHITECTURE_LEAK, "")
    .replace(/\bbecause(?:\s*,)+/gi, "because")
    .replace(/\bbecause\s*\./gi, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function repairCausalLanguage(text: string, confirmed: boolean): string {
  if (confirmed) return text;
  return text
    .replace(/\bis causing\b/gi, "is connected to")
    .replace(/\bare causing\b/gi, "are connected to")
    .replace(/\bcaused\b/gi, "is associated with")
    .replace(/\bis the (?:root )?cause\b/gi, "is a plausible contributor, not a confirmed cause")
    .replace(/\bthe intervention worked\b/gi, "the result improved, but attribution is still uncertain")
    .replace(/\bwill definitely\b/gi, "may");
}

function repairPredictionLanguage(text: string): string {
  return text.replace(
    /\bwill (improve|recover|increase|decrease|fix)\b/gi,
    "is expected to $1",
  );
}

function stripUnjustifiedCertainty(text: string, confirmed: boolean): string {
  if (confirmed) return text.replace(/\bguaranteed\b/gi, "");
  return text
    .replace(FAKE_CERTAINTY, "")
    // Preserve the safety qualification “not proven”; remove only a positive
    // unsupported claim that something is proven.
    .replace(/(?<!\bnot\s)\bproven\b/gi, "");
}

function capDepth(text: string, depth: TrustedResponseDepth, locked: boolean): string {
  if (locked || depth === "DEEP") return text;
  const max = depth === "BRIEF" ? 3 : 4;
  return joinSentences(sentences(text).slice(0, max));
}

function inferClaims(
  text: string,
  explanation: ExecutiveObjectExplanation | null,
): readonly TrustedExecutiveClaim[] {
  const claims: TrustedExecutiveClaim[] = [];
  const push = (
    kind: TrustedExecutiveClaim["kind"],
    value: string,
    confidence: TrustedClaimConfidence,
  ) => {
    if (!value) return;
    claims.push(Object.freeze({ kind, text: value, confidence }));
  };
  if (explanation) {
    for (const item of explanation.evidence) {
      push("FACT", item.text, item.support === "KNOWN" ? "HIGH" : "MEDIUM");
    }
    if (explanation.currentSituation) {
      push("FACT", explanation.currentSituation, "HIGH");
    }
    for (const item of explanation.drivers) {
      push(
        item.causalClaim === "confirmed" ? "FACT" : "HYPOTHESIS",
        item.text,
        item.causalClaim === "confirmed" ? "HIGH" : "MEDIUM",
      );
    }
    for (const item of explanation.relationships) {
      push(
        item.causalClaim === "confirmed" ? "FACT" : "HYPOTHESIS",
        item.text,
        "MEDIUM",
      );
    }
    if (explanation.uncertainty) push("UNKNOWN", explanation.uncertainty, "LOW");
    if (explanation.handoffRecommendation) {
      push("RECOMMENDATION", explanation.managerFacingText, "MEDIUM");
    }
  }
  if (/\bI recommend\b/i.test(text)) {
    push("RECOMMENDATION", text, "MEDIUM");
  }
  if (/\bnot (?:yet )?(?:confirmed|enough evidence)\b/i.test(text)) {
    push("UNKNOWN", "insufficient causal evidence", "LOW");
  }
  if (/\bunder (?:the )?current assumptions\b/i.test(text) || /\bexpected to\b/i.test(text)) {
    push("PREDICTION", text, "MEDIUM");
  }
  if (/\byou reported\b/i.test(text) || /\bobserved\b/i.test(text)) {
    push("OBSERVATION", text, "MEDIUM");
  }
  if (/\bassumes?\b/i.test(text)) push("ASSUMPTION", text, "LOW");
  return Object.freeze(claims.slice(0, 12));
}

function decisionWording(text: string): TrustedExecutiveCommunication["decisionStateWording"] {
  if (/\b(?:decision is approved|has been approved)\b/i.test(text)) return "approved";
  if (/\b(?:selected scenario|is selected)\b/i.test(text) && !/\brecommend/i.test(text)) {
    return "selected";
  }
  if (/\bI recommend\b/i.test(text) || /\bRecommendation:/i.test(text)) return "recommended";
  return "none";
}

function executionWording(text: string): TrustedExecutiveCommunication["executionStateWording"] {
  if (/\bexecution has started\b/i.test(text) || /\bhas started\b/i.test(text)) return "started";
  if (/\bready to start\b/i.test(text) || /\bplan is ready\b/i.test(text)) return "planned";
  return "none";
}

function mixedCertaintyAnswer(explanation: ExecutiveObjectExplanation | null): string | null {
  if (!explanation) return null;
  const label = explanation.subject.label ?? "this";
  const contributor =
    explanation.relationships.find((item) => item.causalClaim !== "confirmed")?.otherLabel ??
    explanation.drivers.find((item) => item.causalClaim !== "confirmed")?.text ??
    null;
  const fact = explanation.currentSituation ?? explanation.evidence[0]?.text ?? null;
  if (fact && contributor) {
    if (/\bwatch\b/i.test(fact) || /needs attention/i.test(fact)) {
      return `The current ${label} condition is recorded. ${contributor} is associated, but that is not confirmed as the cause. Evidence is still limited.`;
    }
    return `I'm sure ${fact.replace(/\.$/, "")}. I'm not yet sure ${contributor} is the confirmed cause.`;
  }
  if (causalConfirmed(explanation)) {
    return `The current evidence supports a confirmed relationship for ${label}.`;
  }
  return `I'm confident in the current ${label} result. The cause is still a hypothesis.`;
}

function challengePrefix(explanation: ExecutiveObjectExplanation | null): string {
  const other =
    explanation?.relationships.find((item) => item.causalClaim !== "confirmed")
      ?.otherLabel ?? "that issue";
  return `I would be careful with that conclusion. ${other} is connected, but the evidence does not confirm causality yet.`;
}

export function composeTrustedExecutiveCommunication(input: {
  readonly sourceText: string;
  readonly utterance: string;
  readonly meaning: CanonicalManagerMeaning;
  readonly clarification: ClarificationTurnResult | null;
  readonly status: string;
  readonly intentKind: string;
  readonly explanation: ExecutiveObjectExplanation | null;
  readonly lockPresentedResponse?: boolean;
}): TrustedExecutiveCommunication {
  const sourceText = input.sourceText ?? "";
  const depth = resolveDepth(input.meaning, input.utterance);
  const clarify =
    input.clarification?.action === "clarify" ||
    input.clarification?.action === "fail" ||
    input.clarification?.action === "unpark";
  const locked =
    Boolean(input.lockPresentedResponse) ||
    LOCKED.test(sourceText) ||
    input.status === "confirmation-required" ||
    /commit|execution|confirm-decision/.test(input.intentKind);
  const confirmed = causalConfirmed(input.explanation);
  const raw = input.utterance.toLowerCase();

  if (clarify) {
    const answer = polish(sourceText);
    return freezeResult({
      sourceText,
      answer,
      depth: "BRIEF",
      explanation: input.explanation,
      skippedRewrite: true,
    });
  }

  let answer = polish(sourceText);

  if (
    input.clarification?.correctionDetected &&
    input.clarification.resumeReference?.canonicalName &&
    !answer.toLowerCase().startsWith(
      input.clarification.resumeReference.canonicalName.toLowerCase(),
    )
  ) {
    const name = input.clarification.resumeReference.canonicalName;
    if (answer.length < 24 || /^(?:okay|ok|understood)\.?$/i.test(answer)) {
      answer = `${name} — understood.`;
    }
  }

  if (!locked) {
    answer = repairCausalLanguage(answer, confirmed);
    answer = repairPredictionLanguage(answer);
    answer = stripUnjustifiedCertainty(answer, confirmed);
    answer = answer.replace(/\bYou must\b/g, "I recommend");
    answer = answer.replace(/\bIt's entirely up to you\.?/gi, "");
    answer = answer.replace(/\bUnknown intent\.?/gi, "I can't answer that from the current evidence.");
    answer = answer.replace(/\bI don't know\.?/gi, "I don't have enough evidence to confirm that yet.");
    answer = answer.replace(/\bDECISION_REQUIRED\b/g, "a decision from you");
    answer = answer.replace(/\bACTION_REQUIRED\b/g, "an action from you");
    answer = answer.replace(/\bgoal-executive-discovered\b/g, "the Goal");
    answer = answer.replace(/\b(?:obj|ctx|kpi|scen|dec|exec)-[a-z0-9-]+\b/gi, "this subject");
    answer = answer.replace(/\bUNRESOLVED_ISSUE\b/g, "an unresolved issue");
    answer = answer.replace(
      /\b(?:GOAL RELEVANCE|JOURNEY BLOCKER|STABLE\s*\/\s*ONGOING|OWNER[- ]HANDLED)\b/gi,
      "",
    );
    answer = answer.replace(/\bbecause it is Watch\b/gi, "because it is worth monitoring");
    answer = answer.replace(/\bit is Watch\b/gi, "it is worth monitoring");
  }

  const overconfidentCause =
    input.meaning.communicativeIntent === "CHALLENGE" ||
    /\b(?:definitely|obviously|must be) (?:the )?cause\b/.test(raw) ||
    /\bjust approve it\b/.test(raw) ||
    /\bthe intervention worked\b/.test(raw);
  if (overconfidentCause && !confirmed && !locked) {
    const prefix = challengePrefix(input.explanation);
    if (!/careful with that conclusion|does not confirm/i.test(answer)) {
      answer = joinSentences([prefix, ...sentences(answer).slice(0, 2)]);
    }
  }

  if (
    (input.meaning.communicativeIntent === "ASK_UNCERTAINTY" ||
      /\b(?:how sure|are you sure|how confident)\b/.test(raw)) &&
    !locked &&
    !/\bevidence|not sure|hypothesis|unknown|limited\b/i.test(answer)
  ) {
    const mixed = mixedCertaintyAnswer(input.explanation);
    if (mixed) answer = mixed;
  }

  if (
    /\b(?:so it worked|the intervention worked|that means it worked)\b/.test(raw) &&
    !locked
  ) {
    answer =
      "The latest result improved. That is encouraging, but it is not enough yet to treat the intervention as the reason for the change.";
  }

  if (
    (input.meaning.communicativeIntent === "ASK_RECOMMENDATION" ||
      /\bwhat (?:should i do|do you think|would you recommend)\b/.test(raw)) &&
    !locked &&
    !/\bI recommend\b/i.test(answer) &&
    !/not a recommendation/i.test(answer)
  ) {
    const thin =
      answer.length < 80 || /not sure how that relates/i.test(answer);
    const next =
      input.explanation?.relationships[0]?.otherLabel ??
      input.explanation?.subject.label ??
      null;
    const identityLike = Boolean(next && / · /.test(next));
    if (thin && next && !identityLike) {
      answer = `I recommend investigating ${next} first. I don't have enough basis to commit to an intervention yet.`;
    } else if (thin && !next) {
      answer = "I don't have enough basis to recommend an action yet.";
    }
  }

  if (
    /\b(?:why are you challenging|are you challenging)\b/.test(raw) &&
    !locked
  ) {
    answer =
      "Because we have a relationship, but not confirmed causality. I would not commit as if that were settled.";
  }

  if (input.meaning.communicativeIntent === "REJECT" && !locked) {
    if (!/^understood/i.test(answer)) {
      answer = joinSentences([
        "Understood.",
        sentences(answer)[0] ?? "The unresolved evidence still matters.",
      ]);
    }
  }

  if (input.meaning.communicativeIntent === "ACCEPT" && !locked) {
    answer = answer.replace(/\b(?:excellent choice|great choice|perfect)\b/gi, "Understood");
  }

  if (!locked) {
    answer = capDepth(answer, depth, false);
  }
  answer = polish(answer);
  if (!answer) answer = sourceText;

  return freezeResult({
    sourceText,
    answer,
    depth,
    explanation: input.explanation,
    skippedRewrite: locked,
  });
}

function freezeResult(input: {
  readonly sourceText: string;
  readonly answer: string;
  readonly depth: TrustedResponseDepth;
  readonly explanation: ExecutiveObjectExplanation | null;
  readonly skippedRewrite: boolean;
}): TrustedExecutiveCommunication {
  const claims = inferClaims(input.answer, input.explanation);
  return Object.freeze({
    identity: nexoraMvpFinal64CommunicationIdentity,
    depth: input.depth,
    sourceText: input.sourceText,
    answer: input.answer,
    claims,
    challengePresent: /careful with that conclusion|would not commit yet|does not confirm/i.test(
      input.answer,
    ),
    recommendationPresent: /\bI recommend\b/i.test(input.answer),
    uncertaintyPreserved:
      /not (?:yet )?(?:confirmed|enough)|hypothesis|unknown|uncertain|assumption/i.test(
        input.answer,
      ) || input.skippedRewrite,
    causalClaimValidated:
      !/\b(?:is causing|are causing|is the (?:root )?cause)\b/i.test(input.answer) ||
      causalConfirmed(input.explanation),
    decisionStateWording: decisionWording(input.answer),
    executionStateWording: executionWording(input.answer),
    skippedRewrite: input.skippedRewrite,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
    usesLlm: false,
  });
}

export function validateTrustedExecutiveCopy(text: string): readonly string[] {
  const failures: string[] = [];
  if (FILLER.test(text)) failures.push("COMMUNICATION_TONE_FAILURE");
  if (NEXORA_MANAGER_ARCHITECTURE_LEAK.test(text) || ARCH_EXTRA.test(text)) {
    failures.push("COMMUNICATION_ARCHITECTURE_LEAK");
  }
  if (/\b(?:must choose|you must always)\b/i.test(text)) {
    failures.push("COMMUNICATION_RECOMMENDATION_MUTATION");
  }
  return Object.freeze(failures);
}
