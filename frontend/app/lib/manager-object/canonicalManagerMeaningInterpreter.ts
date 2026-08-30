/**
 * NEX-MVP-FINAL:6.1 — feature-frame interpreter.
 *
 * Understands classes of manager meaning from speech-act cues, operation
 * frames, and registered-object mentions. Not a sentence table. Not an LLM.
 * Does not invent object IDs or business truth.
 */

import { expandControlledManagerLanguageKeys } from "@/app/lib/conversational-control/conversationalIntentNormalization.ts";
import { buildNexoraConversationalSubjectMatchIndex } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { resolveRegisteredReference } from "./nexoraRegisteredReferenceRecovery.ts";
import { classifyManagerSpeechAct, observationShouldNotNavigate } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { interpretMultiEntityAssertion } from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type {
  CanonicalManagerCommunicativeIntent,
  CanonicalManagerConfidence,
  CanonicalManagerMeaning,
  CanonicalManagerModality,
  CanonicalManagerObjectReference,
  CanonicalManagerOperation,
  CanonicalManagerPolarity,
  CanonicalManagerQuestionType,
} from "./canonicalManagerMeaning.ts";
import { refineOperationForManagerNeed } from "./nexoraNca1ConversationArchitecture.ts";

export type CanonicalManagerMeaningInput = {
  readonly utterance: string;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
};

type CueHit = {
  readonly family: CanonicalManagerOperation | "HELP" | "CHALLENGE" | "OBSERVE" | "META" | "COMMIT_SAFE" | "TENTATIVE" | "CORRECT";
  readonly cue: string;
  readonly weight: number;
};

const PRESENTATION_FILLER =
  /^(?:picture|view|screen|page|dashboard|numbers|performance|situation|target)$/u;

const DEICTIC =
  /^(?:this|that|it|them|these|those|here|there)$/u;

const CUES: readonly {
  readonly cue: string;
  readonly family: CueHit["family"];
  readonly weight: number;
}[] = Object.freeze([
  { cue: "what should i do", family: "RECOMMEND", weight: 5 },
  { cue: "what should i do", family: "RECOMMEND", weight: 5 },
  { cue: "what would you do", family: "RECOMMEND", weight: 5 },
  { cue: "would you choose", family: "RECOMMEND", weight: 5 },
  { cue: "know about", family: "EXPLAIN", weight: 4 },
  { cue: "tell me", family: "EXPLAIN", weight: 3 },
  { cue: "doing nothing", family: "CONSEQUENCE", weight: 5 },
  { cue: "does not make sense", family: "CHALLENGE", weight: 5 },
  { cue: "you are assuming", family: "CHALLENGE", weight: 5 },
  { cue: "recommendation", family: "RECOMMEND", weight: 3 },
  { cue: "bring", family: "FOCUS", weight: 2 },
  { cue: "which would you choose", family: "RECOMMEND", weight: 5 },
  { cue: "what would you choose", family: "RECOMMEND", weight: 5 },
  { cue: "how do we know", family: "EVIDENCE", weight: 5 },
  { cue: "how confident", family: "EVIDENCE", weight: 4 },
  { cue: "what evidence", family: "EVIDENCE", weight: 5 },
  { cue: "are you sure", family: "CHALLENGE", weight: 5 },
  { cue: "why should i believe", family: "CHALLENGE", weight: 5 },
  { cue: "does not make sense", family: "CHALLENGE", weight: 5 },
  { cue: "do not buy", family: "CHALLENGE", weight: 5 },
  { cue: "i disagree", family: "CHALLENGE", weight: 5 },
  { cue: "prove it", family: "EVIDENCE", weight: 5 },
  { cue: "hurting the goal", family: "ATTENTION", weight: 4 },
  { cue: "our choices", family: "COMPARE", weight: 4 },
  { cue: "anything weird", family: "STATUS", weight: 4 },
  { cue: "correlation not cause", family: "CHALLENGE", weight: 5 },
  { cue: "i am not convinced", family: "CHALLENGE", weight: 5 },
  { cue: "you are assuming", family: "CHALLENGE", weight: 5 },
  { cue: "what makes you say", family: "CHALLENGE", weight: 4 },
  { cue: "do nothing", family: "CONSEQUENCE", weight: 5 },
  { cue: "did nothing", family: "CONSEQUENCE", weight: 5 },
  { cue: "leave this alone", family: "CONSEQUENCE", weight: 5 },
  { cue: "leave it alone", family: "CONSEQUENCE", weight: 5 },
  { cue: "left this alone", family: "CONSEQUENCE", weight: 5 },
  { cue: "if this continues", family: "CONSEQUENCE", weight: 5 },
  { cue: "what happens if", family: "CONSEQUENCE", weight: 4 },
  { cue: "what happen if", family: "CONSEQUENCE", weight: 4 },
  { cue: "what if", family: "CONSEQUENCE", weight: 4 },
  { cue: "suppose", family: "CONSEQUENCE", weight: 4 },
  { cue: "too late", family: "OBSERVE", weight: 4 },
  { cue: "gets delayed", family: "OBSERVE", weight: 3 },
  { cue: "falls behind", family: "OBSERVE", weight: 3 },
  { cue: "what would happen", family: "CONSEQUENCE", weight: 4 },
  { cue: "walk me through", family: "EXPLAIN", weight: 4 },
  { cue: "going on", family: "EXPLAIN", weight: 4 },
  { cue: "tell me about", family: "EXPLAIN", weight: 4 },
  { cue: "what do we know", family: "EXPLAIN", weight: 4 },
  { cue: "bring up", family: "FOCUS", weight: 4 },
  { cue: "take me", family: "FOCUS", weight: 4 },
  { cue: "let me see", family: "FOCUS", weight: 4 },
  { cue: "look at", family: "FOCUS", weight: 3 },
  { cue: "open up", family: "FOCUS", weight: 3 },
  { cue: "pull up", family: "FOCUS", weight: 4 },
  { cue: "paying attention", family: "ATTENTION", weight: 4 },
  { cue: "worth worrying", family: "ATTENTION", weight: 4 },
  { cue: "worth investigating", family: "INVESTIGATE", weight: 4 },
  { cue: "at risk", family: "ATTENTION", weight: 3 },
  { cue: "what else", family: "COMPARE", weight: 3 },
  { cue: "other options", family: "COMPARE", weight: 4 },
  { cue: "my options", family: "COMPARE", weight: 4 },
  { cue: "which option", family: "COMPARE", weight: 4 },
  { cue: "which one", family: "COMPARE", weight: 3 },
  { cue: "best balance", family: "COMPARE", weight: 4 },
  { cue: "looks safer", family: "COMPARE", weight: 4 },
  { cue: "is safer", family: "COMPARE", weight: 3 },
  { cue: "how are we doing", family: "STATUS", weight: 4 },
  { cue: "where are we", family: "STATUS", weight: 4 },
  { cue: "what can you", family: "META", weight: 6 },
  { cue: "how nexora", family: "META", weight: 6 },
  { cue: "how does nexora", family: "META", weight: 6 },
  { cue: "kinds of questions", family: "META", weight: 6 },
  { cue: "can nexora", family: "META", weight: 6 },
  { cue: "can you help me investigate", family: "META", weight: 6 },
  { cue: "how should i", family: "META", weight: 6 },
  { cue: "how do i use", family: "META", weight: 6 },
  { cue: "what should i ask", family: "META", weight: 6 },
  { cue: "now what", family: "META", weight: 6 },
  { cue: "what next", family: "META", weight: 6 },
  { cue: "where do we go", family: "META", weight: 5 },
  { cue: "what options", family: "COMPARE", weight: 5 },
  { cue: "help me decide", family: "META", weight: 6 },
  { cue: "you decide", family: "META", weight: 6 },
  { cue: "did we decide", family: "STATUS", weight: 6 },
  { cue: "what do you need", family: "META", weight: 6 },
  { cue: "what is missing", family: "META", weight: 6 },
  { cue: "what can we investigate", family: "META", weight: 6 },
  { cue: "do it for me", family: "META", weight: 6 },
  { cue: "maybe we should", family: "TENTATIVE", weight: 4 },
  { cue: "perhaps we", family: "TENTATIVE", weight: 3 },
  { cue: "why", family: "CAUSE", weight: 4 },
  { cue: "cause", family: "CAUSE", weight: 3 },
  { cue: "causing", family: "CAUSE", weight: 3 },
  { cue: "slipping", family: "CAUSE", weight: 2 },
  { cue: "affect", family: "IMPACT", weight: 4 },
  { cue: "affects", family: "IMPACT", weight: 4 },
  { cue: "affecting", family: "IMPACT", weight: 4 },
  { cue: "impact", family: "IMPACT", weight: 4 },
  { cue: "connected", family: "IMPACT", weight: 3 },
  { cue: "related", family: "IMPACT", weight: 2 },
  { cue: "evidence", family: "EVIDENCE", weight: 4 },
  { cue: "missing", family: "EVIDENCE", weight: 2 },
  { cue: "confident", family: "EVIDENCE", weight: 3 },
  { cue: "recommend", family: "RECOMMEND", weight: 4 },
  { cue: "compare", family: "COMPARE", weight: 4 },
  { cue: "versus", family: "COMPARE", weight: 3 },
  { cue: "safer", family: "COMPARE", weight: 3 },
  { cue: "investigate", family: "INVESTIGATE", weight: 4 },
  { cue: "explain", family: "EXPLAIN", weight: 4 },
  { cue: "understand", family: "EXPLAIN", weight: 4 },
  { cue: "happening", family: "EXPLAIN", weight: 3 },
  { cue: "show", family: "FOCUS", weight: 3 },
  { cue: "open", family: "FOCUS", weight: 3 },
  { cue: "display", family: "FOCUS", weight: 3 },
  { cue: "inspect", family: "FOCUS", weight: 3 },
  { cue: "review", family: "FOCUS", weight: 2 },
  { cue: "see", family: "FOCUS", weight: 2 },
  { cue: "check", family: "FOCUS", weight: 2 },
  { cue: "view", family: "FOCUS", weight: 2 },
  { cue: "worry", family: "ATTENTION", weight: 4 },
  { cue: "worrying", family: "ATTENTION", weight: 4 },
  { cue: "threatening", family: "ATTENTION", weight: 4 },
  { cue: "threat", family: "ATTENTION", weight: 3 },
  { cue: "attention", family: "ATTENTION", weight: 3 },
  { cue: "matter", family: "ATTENTION", weight: 2 },
  { cue: "important", family: "ATTENTION", weight: 2 },
  { cue: "status", family: "STATUS", weight: 3 },
  { cue: "seems", family: "OBSERVE", weight: 4 },
  { cue: "feels", family: "OBSERVE", weight: 4 },
  { cue: "i think", family: "OBSERVE", weight: 3 },
  { cue: "we have", family: "OBSERVE", weight: 3 },
  { cue: "was around", family: "OBSERVE", weight: 4 },
  { cue: "last month", family: "OBSERVE", weight: 3 },
  { cue: "the target is", family: "OBSERVE", weight: 4 },
  { cue: "approve", family: "COMMIT_SAFE", weight: 3 },
  { cue: "confirm", family: "COMMIT_SAFE", weight: 3 },
  { cue: "lets do that", family: "COMMIT_SAFE", weight: 4 },
  { cue: "i meant", family: "CORRECT", weight: 6 },
  { cue: "i mean", family: "CORRECT", weight: 5 },
  { cue: "meant", family: "CORRECT", weight: 5 },
  { cue: "not the one", family: "CORRECT", weight: 5 },
  { cue: "scratch that", family: "CORRECT", weight: 6 },
  { cue: "not that", family: "CORRECT", weight: 4 },
  { cue: "not what i meant", family: "CORRECT", weight: 6 },
  { cue: "not what i asked", family: "CORRECT", weight: 6 },
  { cue: "that is not what i asked", family: "CORRECT", weight: 6 },
  { cue: "i asked", family: "CORRECT", weight: 5 },
  { cue: "i am asking", family: "CORRECT", weight: 5 },
  { cue: "asking about", family: "CORRECT", weight: 4 },
  { cue: "asking of", family: "CORRECT", weight: 4 },
  { cue: "i said", family: "CORRECT", weight: 4 },
  { cue: "talking about", family: "CORRECT", weight: 5 },
  { cue: "i am talking about", family: "CORRECT", weight: 6 },
  { cue: "was talking about", family: "CORRECT", weight: 5 },
  { cue: "was referring", family: "CORRECT", weight: 5 },
  { cue: "i was referring", family: "CORRECT", weight: 5 },
]);

const FAMILY_RANK: readonly CanonicalManagerOperation[] = Object.freeze([
  "CHALLENGE",
  "CONSEQUENCE",
  "CAUSE",
  "EVIDENCE",
  "COMPARE",
  "RECOMMEND",
  "ATTENTION",
  "IMPACT",
  "INVESTIGATE",
  "EXPLAIN",
  "STATUS",
  "FOCUS",
  "OBSERVE",
  "HELP",
  "NONE",
]);

export function prepareManagerUtteranceLight(utterance: string): string {
  let text = typeof utterance === "string" ? utterance : "";
  text = text.normalize("NFKC").toLowerCase();
  text = text
    .replace(/won[’']t/g, "will not")
    .replace(/can[’']t/g, "can not")
    .replace(/n[’']t/g, " not")
    .replace(/i[’']m/g, "i am")
    .replace(/it[’']s/g, "it is")
    .replace(/that[’']s/g, "that is")
    .replace(/what[’']s/g, "what is")
    .replace(/where[’']s/g, "where is")
    .replace(/how[’']s/g, "how is")
    .replace(/we[’']re/g, "we are")
    .replace(/they[’']re/g, "they are")
    .replace(/you[’']re/g, "you are")
    .replace(/i[’']d/g, "i would")
    .replace(/let[’']s/g, "lets")
    .replace(/['’]/g, "");
  text = text
    .replace(/\bwont\b/g, "will not")
    .replace(/\bdont\b/g, "do not")
    .replace(/\bcant\b/g, "can not")
    .replace(/\bwhats\b/g, "what is")
    .replace(/\bthats\b/g, "that is");
  text = text.replace(/[^\p{L}\p{N}\s]+/gu, " ");
  return text.replace(/\s+/g, " ").trim();
}

export function prepareManagerUtterance(utterance: string): string {
  let text = prepareManagerUtteranceLight(utterance);
  const wrappers: readonly RegExp[] = [
    /^please\s+/,
    /^could you\s+/,
    /^would you\s+/,
    /^can you\s+/,
    /^could we\s+/,
    /^would we\s+/,
    /^can we\s+/,
    /^can i\s+/,
    /^i would like to\s+/,
    /^i would like\s+/,
    /^id like to\s+/,
    /^i want to\s+/,
    /^i need to\s+/,
    /^help me\s+/,
    /^lets\s+/,
    /^let us\s+/,
    /^kindly\s+/,
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of wrappers) {
      const next = text.replace(pattern, "");
      if (next !== text) {
        text = next.trim();
        changed = true;
      }
    }
  }
  text = text.replace(/\b(?:please|pls|actually|really|just|kinda|kind of)\b/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keysForSubject(subject: NexoraConversationalSubjectRecord): readonly string[] {
  const raw = [
    subject.canonicalName,
    subject.subjectId,
    subject.businessKey ?? "",
    ...(subject.aliases ?? []),
  ]
    .map((item) => prepareManagerUtterance(String(item)))
    .filter(Boolean);
  const expanded = new Set<string>();
  for (const key of raw) {
    expanded.add(key);
    if (key.endsWith("y") && key.length > 3) expanded.add(`${key.slice(0, -1)}ies`);
    if (!key.endsWith("s")) expanded.add(`${key}s`);
    if (key.endsWith("s") && key.length > 3) expanded.add(key.slice(0, -1));
    for (const extra of expandControlledManagerLanguageKeys(key)) {
      expanded.add(extra);
    }
  }
  return Object.freeze(
    [...expanded].filter((key) => key.length > 1).sort((a, b) => b.length - a.length),
  );
}

function toRef(
  subject: NexoraConversationalSubjectRecord,
  lexicalHint: string,
): CanonicalManagerObjectReference {
  return Object.freeze({
    subjectId: subject.subjectId,
    canonicalName: subject.canonicalName,
    lexicalHint,
    subjectKind: subject.subjectKind,
  });
}

function extraTokensAreActionVerbs(longer: string, shorter: string): boolean {
  const longTokens = longer.split(/\s+/).filter(Boolean);
  const shortTokens = new Set(shorter.split(/\s+/).filter(Boolean));
  const extra = longTokens.filter((token) => !shortTokens.has(token));
  if (extra.length === 0) return false;
  return extra.every((token) =>
    /^(?:show|open|bring|expand|increase|add|review|check|see|focus|explain|compare|start|commit|pull|display)$/.test(
      token,
    ),
  );
}

function preferNestedRegisteredName(
  found: readonly CanonicalManagerObjectReference[],
): readonly CanonicalManagerObjectReference[] {
  if (found.length <= 1) return found;
  const withoutVerbInflated = found.filter((item) => {
    const hint = item.lexicalHint ?? item.canonicalName?.toLowerCase() ?? "";
    return !found.some((other) => {
      if (other.subjectId === item.subjectId) return false;
      const shorter = other.lexicalHint ?? other.canonicalName?.toLowerCase() ?? "";
      return (
        hint.length > shorter.length &&
        hint.includes(shorter) &&
        extraTokensAreActionVerbs(hint, shorter)
      );
    });
  });
  const pool = withoutVerbInflated.length > 0 ? withoutVerbInflated : found;
  if (pool.length === 1) return Object.freeze(pool);
  const bySpan = [...pool].sort(
    (left, right) =>
      (right.lexicalHint?.length ?? 0) - (left.lexicalHint?.length ?? 0),
  );
  const primary = bySpan[0];
  const primaryHint = primary?.lexicalHint ?? "";
  if (
    primary &&
    primaryHint.length > 0 &&
    pool.every(
      (item) =>
        item.subjectId === primary.subjectId ||
        Boolean(
          item.lexicalHint &&
            primaryHint.includes(item.lexicalHint) &&
            !extraTokensAreActionVerbs(primaryHint, item.lexicalHint),
        ),
    )
  ) {
    return Object.freeze([primary]);
  }
  return Object.freeze(pool);
}

function findObjectMentions(
  prepared: string,
  subjects: readonly NexoraConversationalSubjectRecord[],
): readonly CanonicalManagerObjectReference[] {
  const index = buildNexoraConversationalSubjectMatchIndex(subjects);
  const found: CanonicalManagerObjectReference[] = [];
  const seen = new Set<string>();
  for (const subject of index.subjects) {
    for (const key of keysForSubject(subject)) {
      const bounded = new RegExp(`(?:^|\\s)${escapeRegExp(key)}(?:$|\\s)`);
      if (!bounded.test(` ${prepared} `)) continue;
      if (seen.has(subject.subjectId)) continue;
      seen.add(subject.subjectId);
      found.push(toRef(subject, key));
      break;
    }
  }
  if (found.length > 1) {
    const resolved = preferNestedRegisteredName(found);
    found.splice(0, found.length, ...resolved);
  }
  if (found.length === 0) {
    const catalog = index.subjects.map((subject) =>
      Object.freeze({
        subjectId: subject.subjectId,
        canonicalName: subject.canonicalName,
        keys: keysForSubject(subject),
      }),
    );
    const phrase = resolveRegisteredReference({ raw: prepared, catalog });
    if (phrase.selected && !seen.has(phrase.selected.subjectId)) {
      const subject = index.subjects.find((item) => item.subjectId === phrase.selected?.subjectId);
      if (subject) {
        seen.add(subject.subjectId);
        found.push(toRef(subject, phrase.normalized));
      }
    } else {
      const tokens = prepared.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (token.length < 5 || DEICTIC.test(token) || PRESENTATION_FILLER.test(token)) {
          continue;
        }
        const recovered = resolveRegisteredReference({ raw: token, catalog });
        if (!recovered.selected) continue;
        const subject = index.subjects.find((item) => item.subjectId === recovered.selected?.subjectId);
        if (!subject || seen.has(subject.subjectId)) continue;
        seen.add(subject.subjectId);
        found.push(toRef(subject, token));
      }
    }
  }
  if (found.length > 1) {
    const generic = found.filter((item) =>
      /^(?:problem|goal|scenario|decision|execution|outcome|kpi)$/.test(
        item.lexicalHint ?? "",
      ),
    );
    const specific = found.filter((item) => !generic.includes(item));
    if (specific.length >= 1 && generic.length >= 1) {
      const compound = generic.some((kindRef) =>
        specific.some((objectRef) => {
          const a = objectRef.lexicalHint ?? "";
          const b = kindRef.lexicalHint ?? "";
          return new RegExp(
            `(?:^|\\s)${escapeRegExp(a)}\\s+${escapeRegExp(b)}(?:$|\\s)|(?:^|\\s)${escapeRegExp(b)}\\s+${escapeRegExp(a)}(?:$|\\s)`,
          ).test(` ${prepared} `);
        }),
      );
      if (!compound) return Object.freeze(specific);
    }
  }
  return Object.freeze(found);
}

function collectCues(text: string): readonly CueHit[] {
  const hits: CueHit[] = [];
  let remaining = ` ${text} `;
  const ordered = [...CUES].sort((a, b) => b.cue.length - a.cue.length);
  for (const entry of ordered) {
    const pattern = new RegExp(`(?:^|\\s)${escapeRegExp(entry.cue)}(?:$|\\s)`);
    if (!pattern.test(remaining)) continue;
    hits.push({ family: entry.family, cue: entry.cue, weight: entry.weight });
    remaining = remaining.replace(pattern, " ");
  }
  return Object.freeze(hits);
}

function scoreFamily(
  hits: readonly CueHit[],
  family: CueHit["family"],
): number {
  return hits
    .filter((hit) => hit.family === family)
    .reduce((sum, hit) => sum + hit.weight, 0);
}

function pickOperation(hits: readonly CueHit[]): {
  readonly operation: CanonicalManagerOperation;
  readonly meta: boolean;
  readonly tentative: boolean;
  readonly challenge: boolean;
  readonly observe: boolean;
  readonly correct: boolean;
} {
  const meta = scoreFamily(hits, "META") >= 5;
  const tentative = scoreFamily(hits, "TENTATIVE") >= 3;
  const challenge = scoreFamily(hits, "CHALLENGE") >= 4;
  const observe = scoreFamily(hits, "OBSERVE") >= 3;
  const correct = scoreFamily(hits, "CORRECT") >= 4;
  if (meta) {
    return { operation: "HELP", meta: true, tentative, challenge, observe, correct };
  }
  if (correct) {
    return { operation: "NONE", meta: false, tentative, challenge, observe, correct: true };
  }
  if (challenge) {
    return { operation: "CHALLENGE", meta: false, tentative, challenge, observe, correct };
  }
  let best: CanonicalManagerOperation = "NONE";
  let bestScore = 0;
  for (const family of FAMILY_RANK) {
    const mapped: CueHit["family"] = family;
    const score = scoreFamily(hits, mapped);
    if (score > bestScore) {
      best = family;
      bestScore = score;
    }
  }
  if (tentative && (best === "NONE" || best === "FOCUS" || best === "INVESTIGATE")) {
    return { operation: "NONE", meta: false, tentative: true, challenge, observe, correct };
  }
  if (observe && (best === "NONE" || best === "FOCUS" || best === "STATUS")) {
    return { operation: "OBSERVE", meta: false, tentative, challenge, observe: true, correct };
  }
  if (bestScore <= 0) {
    return { operation: "NONE", meta: false, tentative, challenge, observe, correct };
  }
  return { operation: best, meta: false, tentative, challenge, observe, correct };
}

function isUnderspecifiedRequest(
  prepared: string,
  objects: readonly CanonicalManagerObjectReference[],
  operation: CanonicalManagerOperation,
): boolean {
  if (objects.length > 0) return false;
  if (/\b(?:something|everything|anything)\b/.test(prepared)) return true;
  if (/\bmake\b/.test(prepared) && /\b(?:better|awesome)\b/.test(prepared)) {
    return true;
  }
  if (/\btake care\b/.test(prepared)) return true;
  if (
    operation === "NONE" &&
    /\bthing\b/.test(prepared) &&
    !/\b(?:show|open|bring|look|see)\b/.test(prepared)
  ) {
    return true;
  }
  if (operation === "NONE" && /^(?:do|fix)\b/.test(prepared)) return true;
  return false;
}

function detectModality(raw: string, prepared: string): CanonicalManagerModality {
  if (/\?/.test(raw)) return "INTERROGATIVE";
  if (/^(?:what|why|how|where|which|who|when|is|are|do|does|did|can|could|would|should)\b/.test(prepared)) {
    return "INTERROGATIVE";
  }
  if (/\b(?:if|would happen|did nothing|do nothing)\b/.test(prepared)) return "HYPOTHETICAL";
  const tokens = prepared.split(/\s+/).filter(Boolean);
  if (tokens.length <= 2) return "FRAGMENT";
  if (/^(?:show|open|bring|take|explain|compare|investigate|check|review)\b/.test(prepared)) {
    return "IMPERATIVE";
  }
  return "DECLARATIVE";
}

function detectPolarity(prepared: string, tentative: boolean): CanonicalManagerPolarity {
  if (tentative || /\b(?:maybe|perhaps|might|not sure)\b/.test(prepared)) return "TENTATIVE";
  if (/\b(?:not|never|no)\b/.test(prepared)) return "NEGATIVE";
  return "AFFIRMATIVE";
}

function questionTypeFor(
  operation: CanonicalManagerOperation,
  modality: CanonicalManagerModality,
): CanonicalManagerQuestionType {
  if (modality !== "INTERROGATIVE" && modality !== "HYPOTHETICAL") return "NONE";
  switch (operation) {
    case "EXPLAIN":
      return "EXPLANATION";
    case "CAUSE":
      return "CAUSE";
    case "IMPACT":
      return "IMPACT";
    case "CONSEQUENCE":
      return "CONSEQUENCE";
    case "EVIDENCE":
      return "EVIDENCE";
    case "RECOMMEND":
      return "RECOMMENDATION";
    case "COMPARE":
      return "COMPARISON";
    case "STATUS":
      return "STATUS";
    case "HELP":
      return "CAPABILITY";
    case "ATTENTION":
      return /goal|matter|worth/.test("attention") ? "ATTENTION" : "ATTENTION";
    default:
      return "NONE";
  }
}

function communicativeIntentFor(input: {
  readonly operation: CanonicalManagerOperation;
  readonly modality: CanonicalManagerModality;
  readonly meta: boolean;
  readonly challenge: boolean;
  readonly observe: boolean;
  readonly tentative: boolean;
  readonly correct: boolean;
  readonly hasObject: boolean;
}): CanonicalManagerCommunicativeIntent {
  if (input.meta) return "ASK_CAPABILITY";
  if (input.correct) return "CORRECT";
  if (input.challenge) return "CHALLENGE";
  if (input.tentative) return "SUGGEST";
  if (input.observe) return "OBSERVE";
  switch (input.operation) {
    case "FOCUS":
      return "REQUEST_FOCUS";
    case "EXPLAIN":
      return input.modality === "INTERROGATIVE" ? "ASK_EXPLANATION" : "ASK_EXPLANATION";
    case "CAUSE":
      return "ASK_WHY";
    case "IMPACT":
      return "ASK_IMPACT";
    case "CONSEQUENCE":
      return "ASK_CONSEQUENCE";
    case "EVIDENCE":
      return "ASK_EVIDENCE";
    case "RECOMMEND":
      return "ASK_RECOMMENDATION";
    case "COMPARE":
      return "ASK_COMPARISON";
    case "INVESTIGATE":
      return "REQUEST_INVESTIGATION";
    case "STATUS":
      return "ASK_STATUS";
    case "ATTENTION":
      return "ASK_INFORMATION";
    case "HELP":
      return "ASK_CAPABILITY";
    case "CHALLENGE":
      return "CHALLENGE";
    case "OBSERVE":
      return "OBSERVE";
    default:
      if (input.hasObject && input.modality === "FRAGMENT") return "REQUEST_FOCUS";
      if (input.hasObject && input.modality === "INTERROGATIVE") return "ASK_INFORMATION";
      return "UNKNOWN";
  }
}

function authorityFor(operation: CanonicalManagerOperation): string | null {
  switch (operation) {
    case "FOCUS":
      return "CC:3/focus-subject";
    case "EXPLAIN":
    case "CAUSE":
      return "MO:2/GenericExplainEngine";
    case "IMPACT":
      return "CC:3/reveal-related";
    case "CONSEQUENCE":
      return "CC:9/explore-scenario";
    case "EVIDENCE":
    case "CHALLENGE":
      return "CC:1/evidence";
    case "RECOMMEND":
      return "CC:8/request-recommendation";
    case "COMPARE":
      return "CC:9/compare-scenarios";
    case "INVESTIGATE":
      return "MO:3/ObjectGuidedExecutiveExploration";
    case "STATUS":
    case "ATTENTION":
      return "MO:6/ExecutiveAttentionInterventionIntelligence";
    case "HELP":
      return "CC:1/help";
    default:
      return null;
  }
}

function confidenceFor(input: {
  readonly operation: CanonicalManagerOperation;
  readonly objects: readonly CanonicalManagerObjectReference[];
  readonly hits: readonly CueHit[];
  readonly unresolved: boolean;
  readonly unknownAction: boolean;
}): CanonicalManagerConfidence {
  if (input.unknownAction && input.objects.length === 0) return "UNKNOWN";
  if (input.unresolved) return "LOW";
  const cueWeight = input.hits.reduce((sum, hit) => sum + hit.weight, 0);
  const uniqueObject = input.objects.length === 1;
  if (input.operation !== "NONE" && uniqueObject && cueWeight >= 4) return "HIGH";
  if (input.operation !== "NONE" && (uniqueObject || cueWeight >= 4)) return "MEDIUM";
  if (input.operation === "NONE" && uniqueObject) return "MEDIUM";
  if (cueWeight >= 3) return "MEDIUM";
  return "LOW";
}

export function interpretCanonicalManagerMeaning(
  input: CanonicalManagerMeaningInput,
): CanonicalManagerMeaning {
  const rawUtterance = typeof input.utterance === "string" ? input.utterance : "";
  const preparedUtterance = prepareManagerUtterance(rawUtterance);
  const lightHits = collectCues(prepareManagerUtteranceLight(rawUtterance));
  const hits = Object.freeze([
    ...lightHits.filter((hit) => hit.family === "META"),
    ...collectCues(preparedUtterance),
  ]);
  const picked = pickOperation(hits);
  const objectSearchText = hits.reduce((text, hit) => {
    return text
      .replace(new RegExp(`(?:^|\\s)${escapeRegExp(hit.cue)}(?:$|\\s)`), " ")
      .replace(/\s+/g, " ")
      .trim();
  }, preparedUtterance);
  const objects = findObjectMentions(
    objectSearchText || preparedUtterance,
    input.subjects ?? [],
  );
  const kindCompound = objects.some((item) =>
    objects.some((other) => {
      if (item === other) return false;
      const a = item.lexicalHint ?? "";
      const b = other.lexicalHint ?? "";
      return new RegExp(
        `(?:^|\\s)${escapeRegExp(a)}\\s+${escapeRegExp(b)}(?:$|\\s)`,
      ).test(` ${preparedUtterance} `);
    }),
  );
  const businessObjects = objects.filter((item) => item.subjectKind === "object");
  const goalKind = objects.filter((item) => item.subjectKind === "goal");
  const deicticOnly =
    objects.length === 0 &&
    /\b(?:this|that|it|them|these|those|thing)\b/.test(preparedUtterance) &&
    (picked.operation === "FOCUS" || /\bbring\b/.test(preparedUtterance));
  const vagueAction = isUnderspecifiedRequest(
    preparedUtterance,
    objects,
    picked.operation,
  );
  const multiple = objects.length > 1;
  const subject =
    objects.length === 1
      ? objects[0] ?? null
      : businessObjects.length === 1 &&
          (!kindCompound ||
            objects.some((item) => item.lexicalHint === "goal"))
        ? businessObjects[0] ?? null
        : goalKind.length === 1 && businessObjects.length === 0 && !kindCompound
          ? goalKind[0] ?? null
          : null;
  const unresolved =
    (kindCompound &&
      objects.length > 1 &&
      !objects.some((item) => item.lexicalHint === "goal" && businessObjects.length === 1)) ||
    deicticOnly ||
    (picked.operation === "FOCUS" && objects.length === 0 && !vagueAction) ||
    (multiple && subject == null);
  const speechAct = classifyManagerSpeechAct(rawUtterance);
  const pickedOperation =
    vagueAction
      ? "NONE"
      : observationShouldNotNavigate(rawUtterance) || interpretMultiEntityAssertion(rawUtterance)
        ? "OBSERVE"
        : speechAct === "QUESTION" || speechAct === "PREFERENCE"
          ? picked.operation
          : picked.operation === "NONE" && subject && !picked.observe && !picked.tentative
            ? "FOCUS"
            : picked.operation;
  const modality = detectModality(rawUtterance, preparedUtterance);
  const operation = refineOperationForManagerNeed(
    preparedUtterance,
    pickedOperation,
    Boolean(subject),
    modality,
  );
  const polarity = detectPolarity(preparedUtterance, picked.tentative);
  const questionType =
    operation === "ATTENTION" && /\bgoal\b/.test(preparedUtterance)
      ? "GOAL_RELEVANCE"
      : questionTypeFor(operation, modality);
  const communicativeIntent = vagueAction
    ? "UNKNOWN"
    : communicativeIntentFor({
        operation,
        modality,
        meta: picked.meta,
        challenge: picked.challenge,
        observe: picked.observe,
        tentative: picked.tentative,
        correct: picked.correct,
        hasObject: Boolean(subject) || multiple,
      });
  const unknownAction =
    communicativeIntent === "UNKNOWN" ||
    (operation === "NONE" && !subject && !multiple);
  const confidence = confidenceFor({
    operation,
    objects,
    hits,
    unresolved: unresolved && !vagueAction,
    unknownAction,
  });

  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance,
    preparedUtterance,
    communicativeIntent,
    requestedOperation: operation,
    subject,
    objectReference: subject,
    questionType,
    requestedDepth: /\b(?:walk|detail|actually)\b/.test(preparedUtterance)
      ? "DEEP"
      : "STANDARD",
    modality,
    polarity,
    confidence: vagueAction ? "UNKNOWN" : confidence,
    ambiguity: Object.freeze({
      unresolved: Boolean(unresolved && !vagueAction) || vagueAction,
      reason: vagueAction
        ? "underspecified-action"
        : multiple
          ? "multiple-objects"
          : deicticOnly || (operation === "FOCUS" && !subject)
            ? "missing-referent"
            : "none",
      candidates: Object.freeze(multiple ? objects : []),
    }),
    semanticEvidence: Object.freeze({
      operationCues: Object.freeze(hits.map((hit) => hit.cue)),
      objectCues: Object.freeze(objects.map((item) => item.lexicalHint ?? "")),
      speechActCues: Object.freeze(
        hits
          .filter(
            (hit) =>
              hit.family === "META" ||
              hit.family === "CHALLENGE" ||
              hit.family === "OBSERVE" ||
              hit.family === "CORRECT",
          )
          .map((hit) => hit.cue),
      ),
      reasoningPath: "feature-frame-interpreter",
      usesLlm: false,
    }),
    selectedAuthority: authorityFor(operation),
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  });
}
