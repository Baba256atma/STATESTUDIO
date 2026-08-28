/**
 * NCA-POST:2 — Manager assertions, pending-question precedence, collection queries.
 * Extends NCA:1–7 / NCA-POST:1. Not NCA:8. No phrase tables.
 */

import { recoverBoundedCollectionNouns } from "../conversational-control/conversationalIntentNormalization.ts";

export const nexoraNcaPost2Identity =
  "NCA-POST:2/ManagerAssertionsPendingQuestionPrecedenceCollectionQueryIntelligence" as const;
export const nexoraNcaPost2Version = "1.0.0" as const;
export const nexoraNcaPost2Namespace =
  "nexora.nca.post.manager-assertions-pending-question-precedence-collection-query" as const;

export const NEXORA_NCA_POST2_BOUNDARY = Object.freeze({
  identity: nexoraNcaPost2Identity,
  createsNca8: false as const,
  usesLiveLlm: false as const,
  writesAuthoritativeBusinessTruth: false as const,
  usesPhraseTables: false as const,
});

export const MANAGER_SPEECH_ACTS = Object.freeze([
  "QUESTION",
  "COMMAND",
  "ASSERTION",
  "OBSERVATION",
  "CORRECTION",
  "ANSWER",
  "ACKNOWLEDGEMENT",
  "PREFERENCE",
  "COMMITMENT",
  "SOCIAL",
  "UNKNOWN",
] as const);

export type ManagerSpeechAct = (typeof MANAGER_SPEECH_ACTS)[number];

export const NEXORA_QUESTION_PURPOSES = Object.freeze([
  "YES_NO_PERMISSION",
  "YES_NO_CONFIRMATION",
  "BOOLEAN_BUSINESS_FACT",
  "PREFERENCE",
  "TIMEFRAME",
  "PERCENTAGE",
  "OPTION_SELECTION",
  "NAVIGATION_CHOICE",
  "REVIEW_OFFER",
  "ADVISORY",
  "YES_NO_PERMISSION",
  "YES_NO_CONFIRMATION",
  "BOOLEAN_BUSINESS_FACT",
  "OPTION_SELECTION",
  "REVIEW_OFFER",
  "NAVIGATION_CHOICE",
] as const);

export type NexoraQuestionPurpose = (typeof NEXORA_QUESTION_PURPOSES)[number];

export const PENDING_QUESTION_STATUSES = Object.freeze([
  "ACTIVE",
  "SUSPENDED",
  "ANSWERED",
  "EXPIRED",
  "SUPERSEDED",
] as const);

export type PendingQuestionStatus = (typeof PENDING_QUESTION_STATUSES)[number];

export const COLLECTION_KINDS = Object.freeze([
  "PROBLEM",
  "RISK",
  "OPPORTUNITY",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
  "GOAL",
  "KPI",
  "OBJECT",
  "OTHER",
] as const);

export type ExecutiveCollectionKind = (typeof COLLECTION_KINDS)[number];

export const COLLECTION_SCOPES = Object.freeze([
  "ALL",
  "ACTIVE",
  "OPEN",
  "CURRENT",
  "RELATED",
  "TOP",
  "FILTERED",
] as const);

export type ExecutiveCollectionScope = (typeof COLLECTION_SCOPES)[number];

export type ExecutiveCollectionQuery = Record<string, unknown> & {
  readonly scope: ExecutiveCollectionScope;
};

export type CollectionQueryResult = {
  readonly items: readonly unknown[];
  readonly total: number;
  readonly collectionKind: ExecutiveCollectionKind;
  readonly scope: ExecutiveCollectionScope;
  readonly presentationIntent: "COLLECTION" | "SUMMARY" | "STAGE_GROUP";
};

export type ManagerProvidedObservation = {
  readonly subject: string | null;
  readonly proposition: string;
  readonly value: number | string | null;
  readonly qualitativeState: string | null;
  readonly timeframe: string | null;
  readonly source: "MANAGER";
  readonly confidence: "HIGH" | "MEDIUM" | "LOW";
  readonly status:
    | "REPORTED"
    | "CONFLICTS_WITH_AUTHORITATIVE_DATA"
    | "CONSISTENT_WITH_AUTHORITATIVE_DATA"
    | "UNVERIFIED"
    | "CONFLICTS_WITH_AUTHORITATIVE_DATA"
    | "CONSISTENT_WITH_AUTHORITATIVE_DATA";
  readonly preference: boolean;
};

export type PendingNexoraQuestionFields = {
  readonly askedAtTurn: number;
  readonly source: "NCA3" | "NCA5" | "NEX_EXP" | "CC" | "MO" | "OTHER";
  readonly status: PendingQuestionStatus;
  readonly questionPurpose: NexoraQuestionPurpose;
};

const COMMAND_LEAD =
  /^(?:show|open|bring|display|focus|look at|go to|take me|list|pull|review|investigate|compare|explain|walk me)\b/;
const PREFERENCE_LEAD =
  /^(?:i(?:'| a)?m (?:ok|okay|fine) with|i can live with|i(?:'| a)?m comfortable with|we can live with)\b/;
const CORRECTION_LEAD =
  /^(?:no[, ]+|actually |that(?:'?s| is) not what i (?:asked|meant|said)\b|i (?:meant|mean|asked|am asking|was asking|said|am talking about|was talking about)\b|not (?:the )?(?:problem|issue|one)\b)/;
const QUALITATIVE =
  /\b(?:ok|okay|fine|good|bad|tight|high|low|worse|better|weak|strong|elevated|stable|seasonal)\b/;
const COPULA = /\b(?:is|are|looks?|feels?|seems?|was|were|'s)\b/;
const NUMERIC =
  /\b\d+(?:\.\d+)?\s*%?|\b(?:two|three|four|five)\s+(?:people|orders|months)\b/;

export function getNexoraNcaPost2Identity() {
  return Object.freeze({
    id: nexoraNcaPost2Identity,
    version: nexoraNcaPost2Version,
    namespace: nexoraNcaPost2Namespace,
  });
}

export function verifyNexoraNcaPost2(): { readonly ok: true } {
  if (getNexoraNcaPost2Identity().id !== nexoraNcaPost2Identity) {
    throw new Error("NCA-POST:2 identity mismatch");
  }
  if (NEXORA_NCA_POST2_BOUNDARY.createsNca8) {
    throw new Error("NCA-POST:2 must not create NCA:8");
  }
  return Object.freeze({ ok: true as const });
}

export function preparedManagerUtterance(utterance: string): string {
  return recoverBoundedCollectionNouns(
    utterance.trim().toLowerCase().replace(/[.!]+$/g, ""),
  );
}

export function isGreetingSocialUtterance(utterance: string): boolean {
  return /^(?:hi|hello|hey|good (?:morning|afternoon|evening))$/i.test(
    preparedManagerUtterance(utterance),
  );
}

export function isShortPolarReply(utterance: string): boolean {
  return /^(?:yes|yeah|yep|y|no|nope|maybe|sure|not now|ok|okay)$/i.test(
    preparedManagerUtterance(utterance),
  );
}

export function looksLikeCopularObservation(prepared: string): boolean {
  if (COMMAND_LEAD.test(prepared) || PREFERENCE_LEAD.test(prepared)) return false;
  if (!COPULA.test(prepared)) return false;
  if (/\?/.test(prepared)) return false;
  return QUALITATIVE.test(prepared) || NUMERIC.test(prepared) || /\b(?:okay|ok)\b/.test(prepared);
}

export function classifyManagerSpeechAct(utterance: string): ManagerSpeechAct {
  const prepared = preparedManagerUtterance(utterance);
  if (!prepared) return "UNKNOWN";
  if (
    isGreetingSocialUtterance(utterance) ||
    /^(?:thanks|thank you|got it)$/i.test(prepared)
  ) {
    return "SOCIAL";
  }
  if (
    isShortPolarReply(utterance) ||
    /^(?:the (?:first|second|third)(?: one)?|friday|\d+\s*%)$/i.test(prepared)
  ) {
    return "ANSWER";
  }
  if (PREFERENCE_LEAD.test(prepared)) return "PREFERENCE";
  if (CORRECTION_LEAD.test(prepared)) return "CORRECTION";
  if (
    /\?$/.test(utterance.trim()) ||
    /^(?:what|why|how|when|where|which|is |are |do |does |can |should )\b/.test(
      prepared,
    )
  ) {
    return "QUESTION";
  }
  if (COMMAND_LEAD.test(prepared)) return "COMMAND";
  if (looksLikeCopularObservation(prepared)) {
    return NUMERIC.test(prepared) || QUALITATIVE.test(prepared)
      ? "OBSERVATION"
      : "ASSERTION";
  }
  return "UNKNOWN";
}

export function interpretManagerProvidedObservation(input: {
  readonly utterance: string;
  readonly subjectName?: string | null;
  readonly authoritativeValue?: number | string | null;
  readonly authoritativeTarget?: number | string | null;
}): ManagerProvidedObservation | null {
  const speech = classifyManagerSpeechAct(input.utterance);
  if (
    speech !== "ASSERTION" &&
    speech !== "OBSERVATION" &&
    speech !== "CORRECTION" &&
    speech !== "PREFERENCE"
  ) {
    return null;
  }
  const prepared = preparedManagerUtterance(input.utterance);
  const percent = input.utterance.match(/(\d+(?:\.\d+)?)\s*%/);
  const qualitative = prepared.match(QUALITATIVE)?.[0] ?? null;
  const derivedSubject = prepared
    .replace(PREFERENCE_LEAD, "")
    .replace(CORRECTION_LEAD, "")
    .replace(/\b(?:is|are|looks?|feels?|seems?|was|were|'s)\b.*$/i, "")
    .replace(/^(?:no,?|actually|the)\s+/i, "")
    .trim();
  const subject = input.subjectName ?? (derivedSubject || null);
  const numeric = percent ? Number(percent[1]) : null;
  const preference = speech === "PREFERENCE";
  const confidence: ManagerProvidedObservation["confidence"] =
    numeric != null
      ? "HIGH"
      : /\bseems?|feels?|looks?\b/.test(prepared)
        ? "LOW"
        : "MEDIUM";
  let status: ManagerProvidedObservation["status"] = "REPORTED";
  if (input.authoritativeValue == null && input.authoritativeTarget == null) {
    status = "UNVERIFIED";
  } else if (numeric != null && typeof input.authoritativeValue === "number") {
    status =
      Math.abs(numeric - input.authoritativeValue) < 0.51
        ? "CONSISTENT_WITH_AUTHORITATIVE_DATA"
        : "CONFLICTS_WITH_AUTHORITATIVE_DATA";
  } else if (
    qualitative &&
    /ok|okay|fine|good/.test(qualitative) &&
    typeof input.authoritativeValue === "number" &&
    typeof input.authoritativeTarget === "number" &&
    input.authoritativeValue < input.authoritativeTarget
  ) {
    status = "CONFLICTS_WITH_AUTHORITATIVE_DATA";
  } else if (input.authoritativeValue != null) {
    status = "UNVERIFIED";
  }
  return Object.freeze({
    subject,
    proposition: input.utterance.trim(),
    value: numeric ?? percent?.[0] ?? null,
    qualitativeState: qualitative,
    timeframe: /\btoday|now|currently|this (?:week|month|quarter)\b/.test(prepared)
      ? (prepared.match(/\btoday|now|currently|this (?:week|month|quarter)\b/)?.[0] ??
        null)
      : null,
    source: "MANAGER",
    confidence,
    status,
    preference,
  });
}

export function composeManagerObservationReply(
  observation: ManagerProvidedObservation,
): string {
  const subject = observation.subject
    ? observation.subject.replace(/\b\w/g, (char) => char.toUpperCase())
    : "that";
  if (observation.preference) {
    return `Understood — you're treating the current ${subject} level as acceptable from a preference standpoint. I'll keep that as your tolerance, not as a change to the underlying measure.`;
  }
  if (observation.status === "CONFLICTS_WITH_AUTHORITATIVE_DATA") {
    return `Understood — you're saying ${subject} looks okay from your perspective. The current Nexora data still shows it below the stated target, so I'd keep those two views separate until we reconcile them.`;
  }
  if (observation.status === "CONSISTENT_WITH_AUTHORITATIVE_DATA") {
    return `Understood. That matches the current Nexora reading for ${subject}.`;
  }
  if (observation.status === "UNVERIFIED") {
    return `Understood. I'll treat that as your current observation about ${subject}, not as verified external evidence.`;
  }
  return `Understood. I'll treat that as your current observation about ${subject}.`;
}

export function inferNexoraQuestionPurpose(question: string): NexoraQuestionPurpose {
  const text = question.toLowerCase();
  if (/would you like to review|want to review|shall we look/.test(text)) {
    return "REVIEW_OFFER";
  }
  if (/would you like|do you want me to|should i (?:show|open|focus)/.test(text)) {
    return "YES_NO_PERMISSION";
  }
  if (/is that (?:right|correct)|does that match/.test(text)) {
    return "YES_NO_CONFIRMATION";
  }
  if (/which|first|second|or /.test(text)) return "OPTION_SELECTION";
  if (/how much|percent|%/.test(text)) return "PERCENTAGE";
  if (/how long|until|when|friday|timeframe/.test(text)) return "TIMEFRAME";
  if (/continue|persist|expected to|demand|temporary/.test(text)) {
    return "BOOLEAN_BUSINESS_FACT";
  }
  return "ADVISORY";
}

export function polarReplyCompatibleWithPurpose(
  purpose: NexoraQuestionPurpose,
): boolean {
  return (
    purpose === "YES_NO_PERMISSION" ||
    purpose === "YES_NO_CONFIRMATION" ||
    purpose === "BOOLEAN_BUSINESS_FACT" ||
    purpose === "REVIEW_OFFER" ||
    purpose === "NAVIGATION_CHOICE"
  );
}

export function selectAnswerablePendingQuestion<
  T extends {
    readonly valid?: boolean;
    readonly status?: PendingQuestionStatus;
    readonly askedAtTurn?: number;
    readonly questionPurpose?: NexoraQuestionPurpose;
    readonly question?: string;
    readonly purpose?: string;
  },
>(candidates: readonly T[], utterance: string): T | null {
  const polar = isShortPolarReply(utterance);
  const eligible = candidates.filter((item) => {
    if (item.valid === false) return false;
    if (item.status && item.status !== "ACTIVE") return false;
    if (!polar) return true;
    const purpose =
      item.questionPurpose ??
      inferNexoraQuestionPurpose(`${item.question ?? ""} ${item.purpose ?? ""}`);
    return polarReplyCompatibleWithPurpose(purpose);
  });
  if (eligible.length === 0) return null;
  return (
    [...eligible].sort((a, b) => (b.askedAtTurn ?? 0) - (a.askedAtTurn ?? 0))[0] ??
    null
  );
}

export function pendingQuestionFieldsFor(
  question: string,
  turn: number,
  source: PendingNexoraQuestionFields["source"] = "OTHER",
): PendingNexoraQuestionFields {
  return Object.freeze({
    askedAtTurn: turn,
    source,
    status: "ACTIVE" as const,
    questionPurpose: inferNexoraQuestionPurpose(question),
  });
}

export function interpretExecutiveCollectionQuery(
  utterance: string,
): ExecutiveCollectionQuery | null {
  const prepared = preparedManagerUtterance(utterance).replace(/[?]+$/g, "");
  const countRequested = /\bhow many\b/.test(prepared);
  const stripped = prepared
    .replace(/^(?:no[, ]+(?:actually[, ]+)?)?/i, "")
    .replace(/^(?:that is not what i (?:asked|meant|said)[, ]*)/i, "")
    .replace(/^(?:i (?:am |was )?(?:just )?ask(?:ing)? (?:you )?(?:about |of |for )?)/i, "")
    .replace(/^(?:i (?:meant|mean|said) (?:the |about |of )?)/i, "")
    .replace(/^(?:i (?:am |was )?talking about (?:the )?)/i, "")
    .replace(/^(?:not (?:the )?(?:problem|issue|one),?\s+(?:the )?)/i, "")
    .replace(/^(?:how many|what)\s+/i, "show ")
    .replace(/^go back to\s+/i, "show ")
    .replace(/\s+on stage(?: that show)?$/i, "")
    .replace(/\s+(?:do we have|are there|are open)$/i, "")
    .trim();
  const issue =
    /\bissues?\b/.test(prepared) &&
    /\b(?:show|list|all|what|open)\b/.test(prepared);
  const match = stripped.match(
    /^(?:(?:show|open|list|see)(?:\s+me)?|what|which)(?:\s+(?:are|do we have))?(?:\s+(the|all|active|open|current|our|my|top))?\s*(problems?|risks?|opportunit(?:y|ies)|scenarios?|decisions?|executions?|goals?|kpis?|objects?)(?:\s+(?:do we have|are there|are open|collection|on stage))?(?:\s+(?:related to|for|about)\s+(.+))?$/,
  );
  const nounOnly = stripped.match(
    /^(?:the |all |our |current )?(problems?|risks?|opportunit(?:y|ies)|scenarios?|decisions?|executions?|goals?)$/,
  );
  if (issue && !match && !nounOnly) {
    return Object.freeze({
      collectionKind: "OTHER" as const,
      scope: "ALL" as const,
      subjectContext: null,
      ambiguousIssueNoun: true,
      countRequested,
    });
  }
  if (!match && !nounOnly) return null;
  const scopeToken = match?.[1] ?? "";
  const noun = (match?.[2] ?? nounOnly?.[1] ?? "") as string;
  const subjectContext = match?.[3]?.trim() ?? null;
  const scope: ExecutiveCollectionScope =
    scopeToken === "active"
      ? "ACTIVE"
      : scopeToken === "open"
        ? "OPEN"
        : scopeToken === "current"
          ? "CURRENT"
          : scopeToken === "top"
            ? "TOP"
            : subjectContext
              ? "FILTERED"
              : "ALL";
  const collectionKind: ExecutiveCollectionKind = noun.startsWith("problem")
    ? "PROBLEM"
    : noun.startsWith("risk")
      ? "RISK"
      : noun.startsWith("opportunit")
        ? "OPPORTUNITY"
        : noun.startsWith("scenario")
          ? "SCENARIO"
          : noun.startsWith("decision")
            ? "DECISION"
            : noun.startsWith("execution")
              ? "EXECUTION"
              : noun.startsWith("goal")
                ? "GOAL"
                : noun.startsWith("kpi")
                  ? "KPI"
                  : noun.startsWith("object")
                    ? "OBJECT"
                    : "OTHER";
  return Object.freeze({
    collectionKind,
    scope,
    subjectContext,
    ambiguousIssueNoun: false,
    countRequested,
  });
}

export function conversationalIntentKindForCollection(
  query: ExecutiveCollectionQuery,
):
  | "show-problems"
  | "show-goals"
  | "show-scenarios"
  | "show-decisions"
  | "show-execution"
  | "show-related"
  | null {
  switch ((query.collectionKind ?? query.collectionKind) as ExecutiveCollectionKind | undefined) {
    case "PROBLEM":
    case "RISK":
    case "OPPORTUNITY":
      return "show-problems";
    case "GOAL":
      return "show-goals";
    case "SCENARIO":
      return "show-scenarios";
    case "DECISION":
      return "show-decisions";
    case "EXECUTION":
      return "show-execution";
    case "OBJECT":
      return "show-related";
    default:
      return null;
  }
}

export function collectionEmptyCopy(query: ExecutiveCollectionQuery): string {
  const noun =
    (query.collectionKind ?? query.collectionKind) === "PROBLEM"
      ? "Problems"
      : (query.collectionKind ?? query.collectionKind) === "RISK"
        ? "Risks"
        : (query.collectionKind ?? query.collectionKind) === "GOAL"
          ? "Goals"
          : (query.collectionKind ?? query.collectionKind) === "SCENARIO"
            ? "Scenarios"
            : (query.collectionKind ?? query.collectionKind) === "DECISION"
              ? "Decisions"
              : (query.collectionKind ?? query.collectionKind) === "EXECUTION"
                ? "Executions"
                : "items";
  const scope =
    query.scope === "ACTIVE"
      ? "active "
      : query.scope === "OPEN"
        ? "open "
        : query.scope === "CURRENT"
          ? "current "
          : "";
  return `I don't see any ${scope}${noun} in the current context.`;
}

export function collectionAmbiguityCopy(): string {
  return "Do you want Problems, Risks, or both?";
}

export function greetingAllowsInitiative(input: {
  readonly utterance: string;
  readonly critical: boolean;
}): boolean {
  if (!isGreetingSocialUtterance(input.utterance)) return true;
  return input.critical;
}

export function rewriteTautologicalAttentionLanguage(text: string): string {
  return text
    .replace(
      /\bneeds attention because it is worth monitoring\b/gi,
      "is below the current target, so it is worth monitoring",
    )
    .replace(
      /\bneeds monitoring because it needs attention\b/gi,
      "has not been resolved yet, so it still deserves attention",
    )
    .replace(
      /\bdeserves attention because it (?:deserves attention|needs attention|is worth monitoring)\b/gi,
      "has not been resolved yet, so it still deserves attention",
    );
}

export function composeConcreteAttentionReason(input: {
  readonly label: string;
  readonly belowTarget?: boolean;
  readonly unresolved?: boolean;
  readonly deteriorated?: boolean;
  readonly state?: string | null;
}): string {
  if (input.belowTarget) {
    return `${input.label} is below the current target, so it is worth monitoring.`;
  }
  if (input.deteriorated) {
    return `${input.label} has deteriorated from the last reading, so it still deserves attention.`;
  }
  if (input.unresolved) {
    return `${input.label} has not been resolved yet, so it still deserves attention.`;
  }
  const state = (input.state ?? "").trim();
  if (state && !/watch|attention|monitor/i.test(state)) {
    return `${input.label} needs attention because ${state}.`;
  }
  return `${input.label} has not been resolved yet, so it still deserves attention.`;
}

export function collectionOrdinalIndex(utterance: string): number | null {
  const prepared = preparedManagerUtterance(utterance);
  if (
    /^(?:the )?first(?: one)?$/.test(prepared) ||
    /\bthe first one\b/.test(prepared)
  ) {
    return 0;
  }
  if (
    /^(?:the )?second(?: one)?$/.test(prepared) ||
    /\bthe other one\b/.test(prepared)
  ) {
    return 1;
  }
  if (/^(?:the )?last(?: one)?$/.test(prepared)) return -1;
  return null;
}

export function observationShouldNotNavigate(utterance: string): boolean {
  const act = classifyManagerSpeechAct(utterance);
  return (
    act === "ASSERTION" ||
    act === "OBSERVATION" ||
    act === "CORRECTION" ||
    act === "PREFERENCE"
  );
}
