import { resolveContextWindow } from "../executive-time/executiveTimeContextResolver.ts";
import type { ExecutiveTimeContextKey } from "../executive-time/executiveTimeTypes.ts";
import type {
  HistoricalManagerHistory,
  HistoricalPresentationItem,
} from "../historical-truth/historicalTruthPresentation.ts";
import type { ProjectHistoricalTruthInput } from "../historical-truth/historicalTruthProjection.ts";

export const HISTORICAL_CONVERSATION_QUERY_IDENTITY =
  "NPA-T TIMELINE-CONV:1/HistoricalConversationQuery" as const;

export type HistoricalConversationOperation =
  | "SUMMARY"
  | "FIRST"
  | "LATEST"
  | "BEFORE"
  | "AFTER"
  | "AT_TIME"
  | "RANGE"
  | "PROVENANCE";

export type HistoricalConversationClassification =
  | "SUPPORTED_HISTORY"
  | "NO_SUPPORTED_HISTORY"
  | "NO_SUPPORTED_HISTORY_IN_PERIOD"
  | "AMBIGUOUS_SUBJECT"
  | "AMBIGUOUS_TIME"
  | "UNSUPPORTED_HISTORICAL_TIME"
  | "CAUSATION_NOT_ESTABLISHED";

export type HistoricalConversationRead = (input: {
  readonly subjectId: string;
  readonly subjectLabel: string | null;
  readonly range?: ProjectHistoricalTruthInput["range"];
}) => HistoricalManagerHistory;

export type HistoricalConversationResult = Readonly<{
  classification: HistoricalConversationClassification;
  subjectId: string | null;
  operation: HistoricalConversationOperation;
  range: ProjectHistoricalTruthInput["range"] | null;
  facts: readonly HistoricalPresentationItem[];
  unplacedFacts: readonly HistoricalPresentationItem[];
  refusedFacts: readonly string[];
  provenance: readonly string[];
  text: string;
}>;

const RELATIVE_TIME: readonly Readonly<{
  pattern: RegExp;
  contextId: ExecutiveTimeContextKey;
}>[] = Object.freeze([
  { pattern: /\btoday\b/, contextId: "today" },
  { pattern: /\bthis week\b/, contextId: "this_week" },
  { pattern: /\blast week\b/, contextId: "last_week" },
  { pattern: /\bthis month\b/, contextId: "this_month" },
  { pattern: /\blast month\b/, contextId: "last_month" },
  { pattern: /\bthis year\b/, contextId: "this_year" },
  { pattern: /\blast year\b/, contextId: "last_year" },
]);

const MONTHS: Readonly<Record<string, number>> = Object.freeze({
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
});

function explicitMonthRange(normalized: string): ProjectHistoricalTruthInput["range"] | null {
  const match = /\b(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+(?:1\s*[–-]\s*31|\d{4}))?\b/.exec(
    normalized,
  );
  if (!match) return null;
  const yearMatch = /\b(20\d{2})\b/.exec(normalized);
  const month = MONTHS[match[1] ?? ""];
  const year = yearMatch ? Number(yearMatch[1]) : Number.NaN;
  if (month == null || !Number.isInteger(year)) return null;
  return Object.freeze({
    from: new Date(Date.UTC(year, month, 1)).toISOString(),
    to: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString(),
  });
}

function resolveRange(
  normalized: string,
  anchorIso: string,
  previousUtterance: string | null,
): { readonly range: ProjectHistoricalTruthInput["range"] | null; readonly ambiguous: boolean } {
  if (/\b(?:recently|earlier|around then)\b/.test(normalized)) {
    return { range: null, ambiguous: true };
  }
  const anchorYear = new Date(anchorIso).getUTCFullYear();
  const explicit = explicitMonthRange(
    /\b20\d{2}\b/.test(normalized) ? normalized : `${normalized} ${anchorYear}`,
  );
  if (explicit) return { range: explicit, ambiguous: false };
  const relative = RELATIVE_TIME.find((candidate) => candidate.pattern.test(normalized));
  if (relative) {
    const window = resolveContextWindow({
      contextId: relative.contextId,
      anchorDate: anchorIso,
    });
    return {
      range: Object.freeze({ from: window.startBoundary, to: window.endBoundary }),
      ambiguous: false,
    };
  }
  if (/\bbefore that\b/.test(normalized) && previousUtterance) {
    const previous = resolveRange(previousUtterance.toLowerCase(), anchorIso, null);
    if (previous.range?.from) {
      return {
        range: Object.freeze({
          to: new Date(Date.parse(previous.range.from) - 1).toISOString(),
        }),
        ambiguous: false,
      };
    }
    return { range: null, ambiguous: true };
  }
  if (/\b(?:before|after) that\b/.test(normalized)) {
    return { range: null, ambiguous: true };
  }
  return { range: null, ambiguous: false };
}

function operationOf(normalized: string): HistoricalConversationOperation {
  if (/\b(?:how do you know|where did that come from|observed or inferred|are you sure)\b/.test(normalized)) {
    return "PROVENANCE";
  }
  if (/\bbefore\b/.test(normalized)) return "BEFORE";
  if (/\bafter\b/.test(normalized)) return "AFTER";
  if (/\bfirst\b/.test(normalized)) return "FIRST";
  if (/\b(?:latest|most recent)\b/.test(normalized)) return "LATEST";
  if (/\b(?:in|during|last|this|today|year)\b/.test(normalized)) return "RANGE";
  return "SUMMARY";
}

function unsupportedChronology(normalized: string): string | null {
  if (/\b(?:problem start|first identified as a problem)\b/.test(normalized)) {
    return "Nexora does not have a supported occurrence time for that Problem, so it cannot reliably place when it started.";
  }
  if (/\bscenario\b.*\b(?:reviewed|review)\b/.test(normalized)) {
    return "Nexora does not have a supported historical review time for that Scenario.";
  }
  if (/\boutcome\b.*\b(?:evaluated|assessed)\b/.test(normalized)) {
    return "Nexora does not have a supported evaluation time for that Outcome assessment.";
  }
  if (/\b(?:when did nexora learn|learning)\b/.test(normalized)) {
    return "Nexora may have supported Learning, but it does not have a supported historical time for that Learning.";
  }
  return null;
}

function isCausation(normalized: string): boolean {
  return /\bwhy did\b|\b(?:decision|execution|action)\b.*\b(?:cause|caused|fix|fixed)\b|\bcaused by\b/.test(
    normalized,
  );
}

function chooseFacts(
  history: HistoricalManagerHistory,
  operation: HistoricalConversationOperation,
  normalized: string,
): readonly HistoricalPresentationItem[] {
  const placeable = history.chronological.filter(
    (item) => item.placeable && item.orderingTimestamp != null,
  );
  if (operation === "FIRST") return Object.freeze(placeable.slice(0, 1));
  if (operation === "LATEST") return Object.freeze(placeable.slice(-1));
  const percentageBoundary = /\b(\d+(?:\.\d+)?)\s*%/.exec(normalized)?.[1];
  if (operation === "BEFORE" || operation === "AFTER") {
    const boundary = /\blatest\b/.test(normalized)
      ? placeable.at(-1)
      : percentageBoundary
        ? placeable.find((item) => item.title.includes(`${percentageBoundary}%`))
        : null;
    if (!boundary?.orderingTimestamp) return Object.freeze(placeable);
    return Object.freeze(
      placeable.filter((item) =>
        operation === "BEFORE"
          ? item.orderingTimestamp! < boundary.orderingTimestamp!
          : item.orderingTimestamp! > boundary.orderingTimestamp!,
      ),
    );
  }
  return Object.freeze([...history.chronological, ...history.unplaced]);
}

function factCopy(item: HistoricalPresentationItem): string {
  return item.placeable ? `${item.title} on ${item.timeLabel}` : `${item.title} (${item.detail})`;
}

function supportedText(
  subjectLabel: string,
  facts: readonly HistoricalPresentationItem[],
  operation: HistoricalConversationOperation,
): string {
  if (operation === "PROVENANCE") {
    const observed = facts.filter((fact) => fact.truthClass === "OBSERVED_DATA");
    const authorities = [...new Set(facts.map((fact) => fact.sourceAuthority))];
    return `${subjectLabel}'s answer comes from ${observed.length} supported Data Reality observation${observed.length === 1 ? "" : "s"} admitted to canonical history${authorities.length ? ` through ${authorities.join(", ")}` : ""}. The dates shown are supported observation or recording times; Nexora has not inferred causation.`;
  }
  if (facts.length === 1) return `${factCopy(facts[0]!)}.`;
  return `${subjectLabel} has ${facts.length} supported historical facts: ${facts.map(factCopy).join("; ")}. This establishes chronology, not causation.`;
}

export function answerHistoricalConversation(input: {
  readonly utterance: string;
  readonly previousUtterance?: string | null;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly anchorIso: string;
  readonly read: HistoricalConversationRead;
}): HistoricalConversationResult {
  const normalized = input.utterance.trim().toLowerCase();
  const operation = operationOf(normalized);
  const base = {
    subjectId: input.subjectId,
    operation,
    range: null,
    facts: Object.freeze([] as HistoricalPresentationItem[]),
    unplacedFacts: Object.freeze([] as HistoricalPresentationItem[]),
    refusedFacts: Object.freeze([] as string[]),
    provenance: Object.freeze([] as string[]),
  };
  if (isCausation(normalized)) {
    return Object.freeze({
      ...base,
      classification: "CAUSATION_NOT_ESTABLISHED",
      text: "The supported history establishes the order of observations, not what caused the change. Nexora does not have certified causal evidence for that claim.",
    });
  }
  const unsupported = unsupportedChronology(normalized);
  if (unsupported) {
    return Object.freeze({
      ...base,
      classification: "UNSUPPORTED_HISTORICAL_TIME",
      text: unsupported,
    });
  }
  if (!input.subjectId) {
    return Object.freeze({
      ...base,
      classification: "AMBIGUOUS_SUBJECT",
      text: "Which subject do you mean?",
    });
  }
  const temporal = resolveRange(
    normalized,
    input.anchorIso,
    input.previousUtterance ?? null,
  );
  if (temporal.ambiguous) {
    return Object.freeze({
      ...base,
      classification: "AMBIGUOUS_TIME",
      text: "Which supported time period do you mean?",
    });
  }
  const history = input.read({
    subjectId: input.subjectId,
    subjectLabel: input.subjectLabel,
    ...(temporal.range ? { range: temporal.range } : {}),
  });
  const facts = chooseFacts(history, operation, normalized);
  const resultBase = {
    ...base,
    range: temporal.range,
    facts,
    unplacedFacts: history.unplaced,
    refusedFacts: Object.freeze(
      history.projection.refused.map((fact) => `${fact.sourceKind}:${fact.reason}`),
    ),
    provenance: Object.freeze(
      facts.map((fact) => `${fact.sourceAuthority}:${fact.sourceId ?? fact.projectionKey}`),
    ),
  };
  if (facts.length === 0) {
    const outsidePeriod = temporal.range != null && history.outsidePeriodCount > 0;
    return Object.freeze({
      ...resultBase,
      classification: outsidePeriod
        ? "NO_SUPPORTED_HISTORY_IN_PERIOD"
        : "NO_SUPPORTED_HISTORY",
      text: outsidePeriod
        ? "No supported history in this period."
        : "No supported history yet.",
    });
  }
  return Object.freeze({
    ...resultBase,
    classification: "SUPPORTED_HISTORY",
    text: supportedText(input.subjectLabel ?? "This subject", facts, operation),
  });
}
