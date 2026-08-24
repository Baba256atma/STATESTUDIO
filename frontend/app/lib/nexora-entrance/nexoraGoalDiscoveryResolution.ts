/**
 * NEX-EXP:2 — deterministic goal-signal extraction, sufficiency, and reuse.
 * Reuses MO:4 tokenize/overlap and registered Goal matching. Does not invent goals.
 */

import {
  getManagerObjectRegisteredSubjects,
  type ManagerObjectCatalogRecord,
} from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  overlapCount,
  parseExplicitGoalTitle,
  tokenizeGoalText,
} from "@/app/lib/manager-object/managerObjectGoalContext.ts";
import { extractGoalSignals } from "./nexoraEntranceIdentity.ts";
import type {
  ExecutiveGoalDiscoveryContext,
  GoalCandidate,
  GoalEpistemicSource,
  GoalMutationKind,
  GoalPersistenceState,
  GoalSignalClarity,
  GoalSufficiency,
} from "./nexoraGoalDiscoveryTypes.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";

const BROAD = new Set(["things", "everything", "operations", "performance", "the business"]);

const OUTCOME_VERBS =
  /\b(?:improve|reduce|protect|grow|increase|decrease|launch|close|stop|cut|raise|lower|strengthen|stabilize)\b/i;

export function emptyGoalDiscoveryContext(
  relatedExecutiveContext: string | null = null,
): ExecutiveGoalDiscoveryContext {
  return freezeContext({
    goalSignal: null,
    goalTitle: null,
    goalDescription: null,
    source: "UNKNOWN",
    scope: relatedExecutiveContext,
    targetState: null,
    currentState: null,
    successSignals: [],
    timeHorizon: null,
    priority: "UNKNOWN_PRIORITY",
    relatedExecutiveContext,
    constraints: [],
    unknowns: ["outcome", "success", "target", "time horizon"],
    epistemicStatus: "UNKNOWN",
    managerConfirmed: false,
    sufficiency: "INSUFFICIENT",
    clarity: "UNKNOWN",
    needsConfirmation: false,
  });
}

export function extractGoalCandidates(utterance: string): readonly GoalCandidate[] {
  const text = utterance.trim();
  if (!text) return Object.freeze([]);
  const explicit = parseExplicitGoalTitle(text);
  const signals = [
    ...(explicit ? [explicit] : []),
    ...extractGoalSignals(text),
    ...extractVerbOutcomes(text),
  ];
  const split = splitMultiple(signals.length ? signals : []);
  return Object.freeze(
    uniqueTitles(split)
      .map((signal) => toCandidate(signal, explicit != null))
      .filter((candidate) => candidate.title.length > 2),
  );
}

export function classifyGoalClarity(
  title: string,
  extraCandidates: readonly GoalCandidate[] = [],
): GoalSignalClarity {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return "UNKNOWN";
  if (extraCandidates.length > 1) {
    return candidatesConflict(extraCandidates) ? "CONFLICTING" : "AMBIGUOUS";
  }
  if (
    /^(?:improve|fix|change|help)\s+(?:things|it|this)$/i.test(normalized) ||
    /run better|do better|get better/.test(normalized)
  ) {
    return "TOO_BROAD";
  }
  const rest = normalized.replace(OUTCOME_VERBS, "").trim();
  if (BROAD.has(rest)) return "TOO_BROAD";
  if (!OUTCOME_VERBS.test(normalized) && rest.split(/\s+/).length < 2) {
    return "AMBIGUOUS";
  }
  return "CLEAR";
}

export function goalSufficiencyOf(input: {
  readonly title: string | null;
  readonly clarity: GoalSignalClarity;
  readonly relatedExecutiveContext: string | null;
  readonly scope: string | null;
}): GoalSufficiency {
  if (!input.title) return "INSUFFICIENT";
  if (input.clarity === "TOO_BROAD" || input.clarity === "UNKNOWN") {
    return "INSUFFICIENT";
  }
  if (input.clarity === "AMBIGUOUS" || input.clarity === "CONFLICTING") {
    return "PARTIAL";
  }
  const hasOutcome = OUTCOME_VERBS.test(input.title);
  const hasContext = Boolean(input.relatedExecutiveContext || input.scope);
  if (
    hasOutcome &&
    (hasContext ||
      /revenue|cash|delivery|launch|retention|downtime|cost|quality/i.test(
        input.title,
      ))
  ) {
    return "SUFFICIENT";
  }
  if (hasOutcome) return "PARTIAL";
  return "INSUFFICIENT";
}

export function normalizeGoalTitle(signal: string): {
  readonly title: string;
  readonly materialChange: boolean;
} {
  const cleaned = cleanGoalPhrase(signal);
  const lower = cleaned.toLowerCase();
  if (/few(?:er)? late deliver/.test(lower) || /late deliver/.test(lower)) {
    return { title: "Improve delivery reliability", materialChange: true };
  }
  if (/stop missing (?:shipments|deliveries)/.test(lower) || /missed shipments/.test(lower)) {
    return { title: "Reduce missed shipments", materialChange: false };
  }
  if (/^need fewer /.test(lower)) {
    return {
      title: titleCase(cleaned.replace(/^need fewer /i, "reduce ")),
      materialChange: false,
    };
  }
  return { title: titleCase(cleaned), materialChange: false };
}

export function matchExistingCanonicalGoal(
  title: string,
): ManagerObjectCatalogRecord | null {
  const tokens = tokenizeGoalText(title);
  let best: { record: ManagerObjectCatalogRecord; hits: number } | null = null;
  for (const record of getManagerObjectRegisteredSubjects()) {
    const haystack = tokenizeGoalText(
      `${record.canonicalName} ${record.aliases.join(" ")}`,
    );
    const hits = overlapCount(tokens, haystack);
    if (hits >= 2 && (best == null || hits > best.hits)) {
      best = { record, hits };
    }
  }
  return best?.record ?? null;
}

export function isDuplicateGoalTitle(left: string, right: string): boolean {
  if (left.trim().toLowerCase() === right.trim().toLowerCase()) return true;
  const hits = overlapCount(tokenizeGoalText(left), tokenizeGoalText(right));
  const min = Math.min(tokenizeGoalText(left).size, tokenizeGoalText(right).size);
  return min > 0 && hits >= Math.max(2, min - 1);
}

export function candidatesConflict(candidates: readonly GoalCandidate[]): boolean {
  if (candidates.length < 2) return false;
  const text = candidates.map((candidate) => candidate.title.toLowerCase()).join(" ");
  const service = /delivery|service|reliability|quality|ontime|on-time/.test(text);
  const cost = /cash|cost|margin|spend|budget/.test(text);
  const growth = /grow|revenue|launch/.test(text);
  return (service && cost) || (growth && cost);
}

export function classifyMutation(
  previousTitle: string | null,
  nextTitle: string,
): GoalMutationKind {
  if (!previousTitle) return "NONE";
  if (previousTitle.toLowerCase() === nextTitle.toLowerCase()) return "NONE";
  if (isDuplicateGoalTitle(previousTitle, nextTitle)) return "REFINEMENT";
  const prev = tokenizeGoalText(previousTitle);
  const next = tokenizeGoalText(nextTitle);
  if (overlapCount(prev, next) >= 1 && next.size >= prev.size) return "REFINEMENT";
  return "CHANGE";
}

export function extractSuccessSignals(utterance: string): readonly string[] {
  const text = utterance.trim();
  const signals: string[] = [];
  const below = text.match(/\bbelow\s+(\d+(?:\.\d+)?%?)/i);
  if (below?.[1]) signals.push(`below ${below[1]}`);
  const look = text.match(/\bsuccess (?:looks like|means)\s+([^.;]+)/i);
  if (look?.[1]) signals.push(cleanGoalPhrase(look[1]));
  if (/reduce late/.test(text.toLowerCase()) && /success|looks like/.test(text.toLowerCase())) {
    signals.push(cleanGoalPhrase(text));
  }
  return Object.freeze(unique(signals));
}

export function extractTargetState(utterance: string): string | null {
  const want = utterance.match(/\b(?:want|target(?: is)?|to)\s+(\d+(?:\.\d+)?%)/i);
  if (want?.[1]) return want[1];
  const below = utterance.match(/\bbelow\s+(\d+(?:\.\d+)?%?)/i);
  return below?.[1] ? `below ${below[1]}` : null;
}

export function extractCurrentState(utterance: string): string | null {
  const match = utterance.match(
    /\b(?:currently|current(?:ly)? around|we're around|we are around)\s+(\d+(?:\.\d+)?%)/i,
  );
  return match?.[1] ?? null;
}

export function extractTimeHorizon(utterance: string): string | null {
  const by = utterance.match(/\bby\s+(the end of\s+)?(q[1-4]|next quarter|year end|eoy)\b/i);
  if (by) return cleanGoalPhrase(by[0]);
  const quarter = utterance.match(/\b(q[1-4])\b/i);
  return quarter?.[1] ? quarter[1].toUpperCase() : null;
}

export function extractIssueSignals(utterance: string): readonly string[] {
  const because = utterance.match(/\bbecause\s+([^.;]+)/i);
  if (!because?.[1]) return Object.freeze([]);
  return Object.freeze([cleanGoalPhrase(because[1])]);
}

export function extractCausalHypotheses(utterance: string): readonly string[] {
  if (!/\bbecause\b/i.test(utterance) && !/\bcaused by\b/i.test(utterance)) {
    return Object.freeze([]);
  }
  return Object.freeze([cleanGoalPhrase(utterance)]);
}

export function applyGoalUtterance(
  previous: ExecutiveGoalDiscoveryContext,
  utterance: string,
  relatedExecutiveContext: string | null,
): {
  readonly context: ExecutiveGoalDiscoveryContext;
  readonly candidates: readonly GoalCandidate[];
  readonly mutation: GoalMutationKind;
  readonly existingMatch: ManagerObjectCatalogRecord | null;
} {
  const extractedSignals = extractGoalSignals(utterance);
  let candidates = [...extractGoalCandidates(utterance)];
  const moreImportant = utterance.match(
    /\b(cost|cash(?: flow)?|delivery|quality|capacity|revenue) is more important/i,
  );
  if (candidates.length === 0 && moreImportant?.[1]) {
    candidates = [
      toCandidate(`improve ${moreImportant[1]}`, true),
    ];
  }
  const correction = /^(?:actually|no,?\s+refine|no,?\s+the goal)/i.test(
    utterance.trim(),
  );
  const confirmation = /^(?:yes|yeah|yep|correct|that's right|that is right|right)\b/i.test(
    utterance.trim(),
  );

  let nextTitle = previous.goalTitle;
  let source: GoalEpistemicSource = previous.source;
  let needsConfirmation = previous.needsConfirmation;
  let managerConfirmed = previous.managerConfirmed;
  let clarity = previous.clarity;

  if (confirmation && previous.goalTitle) {
    managerConfirmed = true;
    needsConfirmation = false;
    source = previous.source === "INFERRED" ? "EXPLICIT" : previous.source;
    clarity = previous.clarity === "INFERRED" ? "CLEAR" : previous.clarity;
  } else if (candidates.length > 1) {
    clarity = candidatesConflict(candidates) ? "CONFLICTING" : "AMBIGUOUS";
    nextTitle = previous.goalTitle;
    managerConfirmed = false;
  } else if (candidates[0]) {
    nextTitle = candidates[0].title;
    const inferred = candidates[0].source === "INFERRED";
    clarity = classifyGoalClarity(candidates[0].title);
    source = inferred ? "INFERRED" : "EXPLICIT";
    needsConfirmation = inferred;
    managerConfirmed = !inferred && clarity === "CLEAR";
    if (correction) {
      source = inferred ? "INFERRED" : "EXPLICIT";
      needsConfirmation = inferred;
      managerConfirmed = !inferred && clarity === "CLEAR";
    }
    if (
      previous.goalTitle &&
      nextTitle &&
      !correction &&
      isDuplicateGoalTitle(previous.goalTitle, nextTitle)
    ) {
      nextTitle = previous.goalTitle;
      source = previous.source;
      needsConfirmation = previous.needsConfirmation;
      managerConfirmed = previous.managerConfirmed;
      clarity = previous.clarity === "UNKNOWN" ? clarity : previous.clarity;
    }
  } else if (extractedSignals[0] && !previous.goalTitle) {
    const normalized = normalizeGoalTitle(extractedSignals[0]);
    nextTitle = normalized.title;
    source = normalized.materialChange ? "INFERRED" : "EXPLICIT";
    needsConfirmation = normalized.materialChange;
    clarity = classifyGoalClarity(nextTitle);
  }

  const existingMatch = nextTitle ? matchExistingCanonicalGoal(nextTitle) : null;

  const successSignals = unique([
    ...previous.successSignals,
    ...extractSuccessSignals(utterance),
  ]);
  const targetState = extractTargetState(utterance) ?? previous.targetState;
  const currentState = extractCurrentState(utterance) ?? previous.currentState;
  const timeHorizon = extractTimeHorizon(utterance) ?? previous.timeHorizon;
  const scope = previous.scope ?? relatedExecutiveContext;
  const sufficiency = goalSufficiencyOf({
    title: nextTitle,
    clarity,
    relatedExecutiveContext,
    scope,
  });
  const mutation = classifyMutation(
    previous.goalTitle,
    nextTitle ?? previous.goalTitle ?? "",
  );

  return {
    context: freezeContext({
      ...previous,
      goalSignal:
        candidates[0]?.signal ?? extractedSignals[0] ?? previous.goalSignal,
      goalTitle: nextTitle,
      goalDescription: nextTitle,
      source,
      scope,
      targetState,
      currentState,
      successSignals,
      timeHorizon,
      priority:
        candidates.length > 1
          ? candidatesConflict(candidates)
            ? "CONFLICTING"
            : "UNKNOWN_PRIORITY"
          : sufficiency === "SUFFICIENT"
            ? "ACTIVE"
            : previous.priority,
      relatedExecutiveContext:
        relatedExecutiveContext ?? previous.relatedExecutiveContext,
      unknowns: resolveUnknowns({
        title: nextTitle,
        successSignals,
        targetState,
        timeHorizon,
        clarity,
      }),
      epistemicStatus:
        source === "UNKNOWN"
          ? "UNKNOWN"
          : source === "INFERRED"
            ? "INFERRED"
            : "KNOWN",
      managerConfirmed,
      sufficiency,
      clarity,
      needsConfirmation,
    }),
    candidates,
    mutation,
    existingMatch,
  };
}

export function isGoalObjectId(objectId: string | null | undefined): boolean {
  return (
    objectId === NEXORA_EXECUTIVE_GOAL_OBJECT_ID ||
    objectId?.startsWith("goal-") === true
  );
}

export function persistenceForMatch(
  match: ManagerObjectCatalogRecord | null,
): GoalPersistenceState {
  return match ? "REGISTERED_RUNTIME" : "SESSION_ONLY";
}

function toCandidate(signal: string, explicit: boolean): GoalCandidate {
  const normalized = normalizeGoalTitle(signal);
  const clarity = classifyGoalClarity(normalized.title);
  return Object.freeze({
    title: normalized.title,
    signal: cleanGoalPhrase(signal),
    clarity: normalized.materialChange ? "INFERRED" : clarity,
    source: explicit
      ? "EXPLICIT"
      : normalized.materialChange
        ? "INFERRED"
        : "EXPLICIT",
    role: "UNKNOWN_PRIORITY",
  });
}

function extractVerbOutcomes(text: string): readonly string[] {
  const matches = [
    ...text.matchAll(
      /\b((?:improve|reduce|protect|grow|increase|decrease|launch|close|stop|cut)\s+[^.,;]+)/gi,
    ),
    ...text.matchAll(/\b((?:fewer|less)\s+[^.,;]+)/gi),
  ];
  return Object.freeze(matches.map((match) => cleanGoalPhrase(match[1] ?? "")));
}

function splitMultiple(signals: readonly string[]): readonly string[] {
  const parts: string[] = [];
  for (const signal of signals) {
    parts.push(
      ...signal.split(/\s+and\s+(?=improve|reduce|protect|grow|increase|launch)/i),
    );
  }
  return Object.freeze(parts.map(cleanGoalPhrase).filter(Boolean));
}

function resolveUnknowns(input: {
  readonly title: string | null;
  readonly successSignals: readonly string[];
  readonly targetState: string | null;
  readonly timeHorizon: string | null;
  readonly clarity: GoalSignalClarity;
}): readonly string[] {
  const unknowns: string[] = [];
  if (!input.title || input.clarity === "TOO_BROAD") unknowns.push("outcome");
  if (input.successSignals.length === 0) unknowns.push("success");
  if (!input.targetState) unknowns.push("target");
  if (!input.timeHorizon) unknowns.push("time horizon");
  return Object.freeze(unknowns);
}

function freezeContext(
  input: ExecutiveGoalDiscoveryContext,
): ExecutiveGoalDiscoveryContext {
  return Object.freeze({
    ...input,
    successSignals: Object.freeze([...input.successSignals]),
    constraints: Object.freeze([...input.constraints]),
    unknowns: Object.freeze([...input.unknowns]),
  });
}

function cleanGoalPhrase(value: string): string {
  return value
    .replace(/^(?:to\s+|we need to\s+|i want to\s+|trying to\s+)/i, "")
    .replace(/\b(?:please|right now|currently)\b/gi, "")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(" ");
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function uniqueTitles(values: readonly string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    if (result.some((existing) => isDuplicateGoalTitle(existing, value))) continue;
    result.push(value);
  }
  return result;
}
