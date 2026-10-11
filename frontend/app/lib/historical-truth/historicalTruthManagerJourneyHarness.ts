/**
 * NPA-T TIMELINE-TEST:1 — test-only manager journey harness.
 * Interprets manager turns against the certified Historical Projection /
 * presentation path. This is not a product authority, alias map, or
 * conversational historical route.
 */

import type { RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import {
  historicalLensRange,
  readCanonicalHistoricalPresentation,
  type HistoricalManagerHistory,
  type HistoricalPresentationItem,
} from "./historicalTruthPresentation.ts";
import type { HistoricalObservationInput, ProjectHistoricalTruthInput } from "./historicalTruthProjection.ts";

export const historicalTruthManagerJourneyIdentity =
  "NPA-T TIMELINE-TEST:1/ManagerHistoricalJourneyHarness" as const;

export const HISTORICAL_MANAGER_FROZEN_NOW = "2026-10-11T12:00:00.000Z" as const;

export const HISTORICAL_ANSWER_CLASSES = Object.freeze([
  "SUPPORTED_HISTORY",
  "SUPPORTED_HISTORY_OUTSIDE_PERIOD",
  "SUPPORTED_FACT_UNPLACED",
  "NO_SUPPORTED_HISTORY",
  "AMBIGUOUS_SUBJECT",
  "AMBIGUOUS_TIME",
  "UNSUPPORTED_HISTORICAL_CLAIM",
  "CURRENT_STATE_NOT_HISTORY",
  "CAUSATION_NOT_ESTABLISHED",
] as const);

export type HistoricalAnswerClass = (typeof HISTORICAL_ANSWER_CLASSES)[number];

export type HistoricalJourneyFamily =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N";

export type HistoricalTimeScope =
  | "unbounded"
  | "day"
  | "week"
  | "month"
  | "year"
  | "august-2026"
  | "last-month"
  | "explicit-august"
  | "ambiguous"
  | "none";

export type HistoricalTurnIntent =
  | "history"
  | "current-state"
  | "causation"
  | "unsupported-claim"
  | "before"
  | "after"
  | "first"
  | "latest"
  | "skeptical"
  | "ambiguous-subject"
  | "ambiguous-time";

export type HistoricalJourneyTurn = Readonly<{
  readonly journeyId: string;
  readonly family: HistoricalJourneyFamily;
  readonly managerProfile: RmsManagerProfileId;
  readonly seed: 11 | 29 | 47;
  readonly initialSubject: string | null;
  readonly managerUtterance: string;
  readonly intent: HistoricalTurnIntent;
  readonly requestedTimeScope: HistoricalTimeScope;
  readonly expectedClassification: HistoricalAnswerClass;
  readonly expectedSubject?: string | null;
  readonly mustIncludeTitles?: readonly string[];
  readonly mustExcludeTitles?: readonly string[];
  readonly expectEmptyLabel?: "No supported history yet" | "No supported history in this period";
  readonly expectPlaceableOnly?: boolean;
  readonly expectNoCausation?: boolean;
  readonly expectRecordingTimeOnly?: boolean;
}>;

export type HistoricalJourneyLedgerRow = Readonly<{
  readonly journeyId: string;
  readonly managerProfile: RmsManagerProfileId;
  readonly initialSubject: string | null;
  readonly managerUtterance: string;
  readonly resolvedSubject: string | null;
  readonly requestedTimeScope: HistoricalTimeScope;
  readonly expectedClassification: HistoricalAnswerClass;
  readonly actualClassification: HistoricalAnswerClass;
  readonly canonicalFactsAvailable: readonly string[];
  readonly canonicalFactsUsed: readonly string[];
  readonly factsRefused: readonly string[];
  readonly surface: string;
  readonly findingSeverity: "none" | "S1" | "S2" | "S3";
  readonly pass: boolean;
}>;

const SUBJECT_LABELS: Readonly<Record<string, string>> = Object.freeze({
  "obj-capacity": "Capacity",
  "obj-revenue": "Revenue",
  "obj-inventory": "Inventory",
});

export function emptyLabelFor(classification: HistoricalAnswerClass): string | null {
  if (classification === "NO_SUPPORTED_HISTORY") return "No supported history yet";
  if (classification === "SUPPORTED_HISTORY_OUTSIDE_PERIOD") {
    return "No supported history in this period";
  }
  return null;
}

export function rangeForScope(
  scope: HistoricalTimeScope,
  nowIso: string = HISTORICAL_MANAGER_FROZEN_NOW,
): ProjectHistoricalTruthInput["range"] {
  if (scope === "day" || scope === "week" || scope === "month" || scope === "year") {
    return historicalLensRange(scope, nowIso) ?? undefined;
  }
  if (scope === "august-2026" || scope === "explicit-august") {
    return { from: "2026-08-01T00:00:00.000Z", to: "2026-08-31T23:59:59.999Z" };
  }
  if (scope === "last-month") {
    return { from: "2026-09-01T00:00:00.000Z", to: "2026-09-30T23:59:59.999Z" };
  }
  return undefined;
}

function namedSubject(utterance: string): string | null {
  const text = utterance.toLowerCase();
  if (/\brevenue\b/.test(text)) return "obj-revenue";
  if (/\binventory\b/.test(text)) return "obj-inventory";
  if (/\bcapacity\b/.test(text)) return "obj-capacity";
  return null;
}

export function resolveJourneySubject(
  utterance: string,
  priorSubject: string | null,
  initialSubject: string | null,
  intent: HistoricalTurnIntent,
): { readonly subjectId: string | null; readonly ambiguous: boolean } {
  if (intent === "ambiguous-subject") {
    return { subjectId: null, ambiguous: true };
  }
  const named = namedSubject(utterance);
  if (named) return { subjectId: named, ambiguous: false };
  if (/\b(?:it|that|this issue|this)\b/i.test(utterance)) {
    if (priorSubject) return { subjectId: priorSubject, ambiguous: false };
    return { subjectId: null, ambiguous: true };
  }
  if (priorSubject) return { subjectId: priorSubject, ambiguous: false };
  if (initialSubject) return { subjectId: initialSubject, ambiguous: false };
  return { subjectId: null, ambiguous: true };
}

function factKeys(items: readonly HistoricalPresentationItem[]): readonly string[] {
  return Object.freeze(
    items.map((item) => `${item.factType}:${item.sourceId ?? item.projectionKey}`),
  );
}

function titlesOf(history: HistoricalManagerHistory): readonly string[] {
  return Object.freeze(history.timeline.map((item) => item.title));
}

function classify(
  intent: HistoricalTurnIntent,
  subjectAmbiguous: boolean,
  scope: HistoricalTimeScope,
  history: HistoricalManagerHistory | null,
): HistoricalAnswerClass {
  if (intent === "current-state") return "CURRENT_STATE_NOT_HISTORY";
  if (intent === "causation") return "CAUSATION_NOT_ESTABLISHED";
  if (intent === "unsupported-claim") return "UNSUPPORTED_HISTORICAL_CLAIM";
  if (intent === "ambiguous-time" || scope === "ambiguous") return "AMBIGUOUS_TIME";
  if (intent === "ambiguous-subject" || subjectAmbiguous || history == null) {
    return "AMBIGUOUS_SUBJECT";
  }
  if (history.chronological.length > 0) return "SUPPORTED_HISTORY";
  if (history.outsidePeriodCount > 0) return "SUPPORTED_HISTORY_OUTSIDE_PERIOD";
  if (history.unplaced.length > 0) return "SUPPORTED_FACT_UNPLACED";
  return "NO_SUPPORTED_HISTORY";
}

function sliceRelative(
  history: HistoricalManagerHistory,
  intent: HistoricalTurnIntent,
): readonly HistoricalPresentationItem[] {
  const placeable = history.chronological.filter((item) => item.placeable && item.orderingTimestamp);
  if (intent === "first") return placeable.slice(0, 1);
  if (intent === "latest") return placeable.slice(-1);
  return placeable;
}

export function playHistoricalManagerTurn(input: {
  readonly turn: HistoricalJourneyTurn;
  readonly priorSubject: string | null;
  readonly world: ProjectHistoricalTruthInput;
  readonly extraObservations?: readonly HistoricalObservationInput[];
}): {
  readonly ledger: HistoricalJourneyLedgerRow;
  readonly history: HistoricalManagerHistory | null;
  readonly resolvedSubject: string | null;
} {
  void RMS_MANAGER_PROFILES[input.turn.managerProfile];
  const resolved = resolveJourneySubject(
    input.turn.managerUtterance,
    input.priorSubject,
    input.turn.initialSubject,
    input.turn.intent,
  );
  const observations = [
    ...(input.world.observations ?? []),
    ...(input.extraObservations ?? []),
  ];
  const history =
    resolved.ambiguous || resolved.subjectId == null
      ? null
      : readCanonicalHistoricalPresentation({
          ...input.world,
          observations,
          subjectId: resolved.subjectId,
          subjectLabel: SUBJECT_LABELS[resolved.subjectId] ?? null,
          range: rangeForScope(input.turn.requestedTimeScope),
        });
  const actual = classify(
    input.turn.intent,
    resolved.ambiguous,
    input.turn.requestedTimeScope,
    history,
  );
  const used =
    history == null
      ? []
      : input.turn.intent === "first" || input.turn.intent === "latest"
        ? factKeys(sliceRelative(history, input.turn.intent))
        : factKeys(history.timeline);
  const available = history == null ? [] : factKeys([...history.chronological, ...history.unplaced]);
  const refused = history?.projection.refused.map((entry) => `${entry.sourceKind}:${entry.reason}`) ?? [];
  const titles = history ? titlesOf(history) : [];
  const empty = emptyLabelFor(actual);
  const includeOk = (input.turn.mustIncludeTitles ?? []).every((title) =>
    titles.some((item) => item.includes(title)),
  );
  const excludeOk = (input.turn.mustExcludeTitles ?? []).every((title) =>
    titles.every((item) => !item.includes(title)),
  );
  const emptyOk =
    input.turn.expectEmptyLabel == null || input.turn.expectEmptyLabel === empty;
  const causationOk =
    input.turn.expectNoCausation !== true ||
    history == null ||
    (history.establishesCausation === false &&
      history.timeline.every((item) => item.establishesCausation === false));
  const placeableOk =
    input.turn.expectPlaceableOnly !== true ||
    (history?.chronological.every((item) => item.placeable) ?? true);
  const recordingOk =
    input.turn.expectRecordingTimeOnly !== true ||
    (history?.chronological.every((item) =>
      item.timestampSemantic === "RECORDED_TIME" || item.factType === "observation-recorded",
    ) ?? true);
  const subjectOk =
    input.turn.expectedSubject === undefined || input.turn.expectedSubject === resolved.subjectId;
  const pass =
    actual === input.turn.expectedClassification &&
    includeOk &&
    excludeOk &&
    emptyOk &&
    causationOk &&
    placeableOk &&
    recordingOk &&
    subjectOk;
  let findingSeverity: HistoricalJourneyLedgerRow["findingSeverity"] = "none";
  if (!pass) {
    findingSeverity =
      actual !== input.turn.expectedClassification || !excludeOk || !causationOk ? "S1" : "S2";
  }
  return {
    resolvedSubject: resolved.subjectId,
    history,
    ledger: Object.freeze({
      journeyId: input.turn.journeyId,
      managerProfile: input.turn.managerProfile,
      initialSubject: input.turn.initialSubject,
      managerUtterance: input.turn.managerUtterance,
      resolvedSubject: resolved.subjectId,
      requestedTimeScope: input.turn.requestedTimeScope,
      expectedClassification: input.turn.expectedClassification,
      actualClassification: actual,
      canonicalFactsAvailable: available,
      canonicalFactsUsed: used,
      factsRefused: refused,
      surface: history
        ? `${empty ?? "canonical-presentation"}:${history.chronological.length}/${history.unplaced.length}/${history.outsidePeriodCount}`
        : "no-presentation",
      findingSeverity,
      pass,
    }),
  };
}

export function agreementKeys(history: HistoricalManagerHistory): {
  readonly timeline: readonly string[];
  readonly activity: readonly string[];
} {
  const key = (item: HistoricalPresentationItem) =>
    `${item.factType}:${item.sourceId ?? item.projectionKey}:${item.orderingTimestamp ?? "unplaced"}`;
  return {
    timeline: Object.freeze([...history.timeline.map(key)].sort()),
    activity: Object.freeze([...history.activity.map(key)].sort()),
  };
}
