/**
 * NPA-T TIMELINE-LIVE:1 — presentation adapter for Timeline Dock and Activity.
 * Formats HistoricalProjection rows. It does not admit facts, assign time,
 * or persist a ledger.
 */

import { listPublishedKpiObservations } from "../data-reality/publishedKpiObservedDirection.ts";
import {
  projectHistoricalTruth,
  type HistoricalObservationInput,
  type HistoricalProjection,
  type HistoricalProjectionFactType,
  type HistoricalProjectionRow,
  type ProjectHistoricalTruthInput,
} from "./historicalTruthProjection.ts";

export type { HistoricalObservationInput };

export function collectLiveHistoricalObservations(input?: {
  readonly snapshotKpis?: readonly {
    readonly kpiId: string;
    readonly objectKey: string;
    readonly nexoraObjectId: string;
    readonly value: number;
    readonly unit: string;
    readonly calculatedAt: string;
  }[];
  readonly datasetId?: string | null;
}): readonly HistoricalObservationInput[] {
  const seen = new Set<string>();
  const collected: HistoricalObservationInput[] = [];
  const push = (entry: HistoricalObservationInput) => {
    const key = `${entry.kpiId}:${entry.nexoraObjectId}:${entry.observedAt}`;
    if (seen.has(key)) return;
    seen.add(key);
    collected.push(Object.freeze(entry));
  };
  for (const entry of listPublishedKpiObservations()) {
    push({
      observationId: entry.observationId,
      kpiId: entry.kpiId,
      objectKey: entry.objectKey,
      nexoraObjectId: entry.nexoraObjectId,
      value: entry.value,
      unit: entry.unit,
      observedAt: entry.observedAt,
    });
  }
  const datasetId = input?.datasetId ?? "data-reality";
  for (const kpi of input?.snapshotKpis ?? []) {
    if (!Number.isFinite(kpi.value)) continue;
    push({
      observationId: `${datasetId}:${kpi.kpiId}:${kpi.nexoraObjectId}:${kpi.calculatedAt}`,
      kpiId: kpi.kpiId,
      objectKey: kpi.objectKey,
      nexoraObjectId: kpi.nexoraObjectId,
      value: kpi.value,
      unit: kpi.unit,
      observedAt: kpi.calculatedAt,
    });
  }
  return Object.freeze(collected);
}

export const historicalTruthPresentationIdentity =
  "NPA-T TIMELINE-LIVE:1/HistoricalPresentation" as const;

export const HISTORICAL_PRESENTATION_BOUNDARY = Object.freeze({
  role: "presentation" as const,
  persists: false as const,
  mutatesAuthorities: false as const,
  establishesCausation: false as const,
  readsFlowTimeline: false as const,
  readsJournalPacks: false as const,
  admitsFixtureHistory: false as const,
  timelineOrder: "chronological-ascending-then-unplaced" as const,
  activityOrder: "chronological-descending-then-unplaced" as const,
});

export const HISTORICAL_PRESENTATION_LEGACY = Object.freeze({
  "flowDomain.timelineEvents": "DEPRECATE as manager-history source",
  journalPacks: "DEPRECATE as Activity-history source",
  NEXORA_MVP_FLOW_TIMELINE_SEED: "TEST-ONLY",
  "tl-*": "PRESENTATION-ONLY legacy identity",
  "pack-*": "PRESENTATION-ONLY legacy identity",
} as const);

const DAY_MS = 86_400_000;
const LENS_DAYS = Object.freeze({
  day: 1,
  week: 7,
  month: 31,
  year: 366,
} as const);

const STATUS_LABELS: Readonly<Record<string, string>> = Object.freeze({
  planned: "Planned",
  ready: "Ready",
  "in-progress": "In progress",
  blocked: "Blocked",
  "at-risk": "At risk",
  completed: "Completed",
  cancelled: "Cancelled",
  Approved: "Approved",
  Rejected: "Rejected",
});

export type HistoricalPresentationItem = Readonly<{
  projectionKey: string;
  factType: HistoricalProjectionFactType;
  subjectId: string;
  sourceId: string | null;
  sourceAuthority: string;
  truthClass: HistoricalProjectionRow["truthClass"];
  title: string;
  detail: string;
  timeLabel: string;
  placeable: boolean;
  group: "chronological" | "unplaced";
  orderingTimestamp: string | null;
  timestampSemantic: string | null;
  relatedRefs: HistoricalProjectionRow["relatedRefs"];
  tone: "neutral" | "attention" | "positive";
  establishesCausation: false;
}>;

export type HistoricalManagerHistory = Readonly<{
  subjectId: string;
  projection: HistoricalProjection;
  timeline: readonly HistoricalPresentationItem[];
  activity: readonly HistoricalPresentationItem[];
  chronological: readonly HistoricalPresentationItem[];
  unplaced: readonly HistoricalPresentationItem[];
  outsidePeriodCount: number;
  establishesCausation: false;
  persisted: false;
}>;

export function historicalLensRange(
  lens: "day" | "week" | "month" | "year",
  nowIso: string,
): Readonly<{ from: string; to: string }> | null {
  const parsed = Date.parse(nowIso);
  if (!Number.isFinite(parsed)) return null;
  const span = LENS_DAYS[lens];
  return Object.freeze({
    from: new Date(parsed - (span - 1) * DAY_MS).toISOString(),
    to: new Date(parsed).toISOString(),
  });
}

export function readCanonicalHistoricalPresentation(
  input: ProjectHistoricalTruthInput & { readonly subjectLabel?: string | null },
): HistoricalManagerHistory {
  const projection = projectHistoricalTruth({
    subjectId: input.subjectId,
    decisions: input.decisions,
    executions: input.executions,
    observations: input.observations,
    outcomeCaptures: input.outcomeCaptures,
    outcomeAssessments: input.outcomeAssessments,
    learnings: input.learnings,
  });
  const presented = projectHistoricalPresentation(projection, {
    subjectLabel: input.subjectLabel ?? null,
  });
  if (input.range == null) return presented;
  const chronological = presented.chronological.filter(
    (item) => item.orderingTimestamp != null && timestampInRange(item.orderingTimestamp, input.range),
  );
  return Object.freeze({
    ...presented,
    chronological: Object.freeze(chronological),
    timeline: Object.freeze([...chronological, ...presented.unplaced]),
    activity: Object.freeze([...chronological].reverse().concat(presented.unplaced)),
    outsidePeriodCount: presented.chronological.length - chronological.length,
  });
}

export function projectHistoricalPresentation(
  projection: HistoricalProjection,
  options?: { readonly subjectLabel?: string | null },
): HistoricalManagerHistory {
  const chronological = projection.chronological.map((row) =>
    presentRow(row, "chronological", options?.subjectLabel ?? null),
  );
  const unplaced = projection.unplaced.map((row) =>
    presentRow(row, "unplaced", options?.subjectLabel ?? null),
  );
  return Object.freeze({
    subjectId: projection.subjectId,
    projection,
    timeline: Object.freeze([...chronological, ...unplaced]),
    activity: Object.freeze([...chronological].reverse().concat(unplaced)),
    chronological: Object.freeze(chronological),
    unplaced: Object.freeze(unplaced),
    outsidePeriodCount: 0,
    establishesCausation: false as const,
    persisted: false as const,
  });
}

export function historicalPresentationRisk(
  tone: HistoricalPresentationItem["tone"],
): "warning" | "risk" | "success" {
  if (tone === "positive") return "success";
  if (tone === "attention") return "risk";
  return "warning";
}

export function historicalActivityEntry(item: HistoricalPresentationItem) {
  return Object.freeze({
    id: item.projectionKey,
    occurredAt: item.orderingTimestamp ?? "",
    eventType: item.factType,
    canonicalSubjectId: historicalPresentationNavigationSubject(item) ?? "",
    relatedCanonicalIds: Object.freeze(
      item.relatedRefs
        .map((ref) => ref.id)
        .filter((id) => !isLegacyHistoryId(id)),
    ),
    title: item.title,
    description: item.detail,
    sourceRecordIds: Object.freeze(item.sourceId ? [item.sourceId] : []),
    timeLabel: item.timeLabel,
    placeable: item.placeable,
    factType: item.factType,
    sourceId: item.sourceId,
    projectionKey: item.projectionKey,
  });
}

function isLegacyHistoryId(id: string): boolean {
  return id.startsWith("tl-") || id.startsWith("pack-") || id.startsWith("ctx-execution-") || id.startsWith("historical:");
}

export function historicalPresentationNavigationSubject(
  item: Pick<HistoricalPresentationItem, "subjectId" | "projectionKey" | "sourceId">,
): string | null {
  const subjectId = item.subjectId;
  if (!subjectId || subjectId === item.projectionKey) return null;
  if (
    subjectId.startsWith("tl-") ||
    subjectId.startsWith("pack-") ||
    subjectId.startsWith("ctx-execution-") ||
    subjectId.startsWith("historical:")
  ) {
    return null;
  }
  if (item.sourceId != null && subjectId === item.sourceId && subjectId.startsWith("ctx-execution-")) {
    return null;
  }
  return subjectId;
}

function timestampInRange(
  timestamp: string,
  range: ProjectHistoricalTruthInput["range"],
): boolean {
  if (range?.from != null && range.from.length > 0 && timestamp < range.from) return false;
  if (range?.to != null && range.to.length > 0 && timestamp > range.to) return false;
  return true;
}

function presentRow(
  row: HistoricalProjectionRow,
  group: "chronological" | "unplaced",
  subjectLabel: string | null,
): HistoricalPresentationItem {
  const placeable = group === "chronological" && row.placeable && row.orderingTimestamp != null;
  const orderingSemantic =
    row.timestamps.find((entry) => entry.value === row.orderingTimestamp)?.semantics ??
    row.timestamps.find((entry) => entry.placeable)?.semantics ??
    null;
  return Object.freeze({
    projectionKey: row.projectionKey,
    factType: row.factType,
    subjectId: row.subjectId,
    sourceId: row.sourceId,
    sourceAuthority: row.sourceAuthority,
    truthClass: row.truthClass,
    title: titleFor(row, subjectLabel),
    detail: detailFor(row),
    timeLabel: placeable && row.orderingTimestamp ? displayTime(row.orderingTimestamp) : "Time unknown",
    placeable,
    group,
    orderingTimestamp: placeable ? row.orderingTimestamp : null,
    timestampSemantic: placeable ? orderingSemantic : null,
    relatedRefs: row.relatedRefs,
    tone: toneFor(row),
    establishesCausation: false as const,
  });
}

function titleFor(row: HistoricalProjectionRow, subjectLabel: string | null): string {
  switch (row.factType) {
    case "decision-approved":
      return "Decision approved";
    case "decision-rejected":
      return "Decision rejected";
    case "execution-created":
      return "Execution created";
    case "execution-started":
      return "Execution started";
    case "execution-completed":
      return "Execution completed";
    case "execution-current-status":
      return `Current status: ${statusLabel(row.recordStatus)}`;
    case "observation-recorded":
      return observationTitle(row, subjectLabel);
    case "outcome-capture-link":
      return "Outcome observation captured";
    case "outcome-assessment-available":
      return "Outcome assessment available";
    case "learning-supported":
      return "Learning supported";
    default:
      return "Supported history";
  }
}

function observationTitle(row: HistoricalProjectionRow, subjectLabel: string | null): string {
  if (row.measurement == null) return "Observation recorded";
  const measurement = `${row.measurement.value}${row.measurement.unit}`;
  return subjectLabel ? `${subjectLabel} observed at ${measurement}` : `Observed at ${measurement}`;
}

function detailFor(row: HistoricalProjectionRow): string {
  if (row.factType === "execution-current-status") {
    return `Current status remains ${statusLabel(row.recordStatus)}.`;
  }
  if (row.factType === "outcome-capture-link") {
    return "Linked to the recorded observation.";
  }
  if (row.factType === "outcome-assessment-available") {
    return "Derived assessment. Evaluation time is unknown.";
  }
  if (row.factType === "learning-supported") {
    return "Supported learning. Chronology is unknown.";
  }
  if (row.factType === "observation-recorded") {
    const committed = row.timestamps.find(
      (entry) => entry.field === "committedAt" && entry.status === "present" && entry.value,
    );
    if (committed?.value && committed.value !== row.orderingTimestamp) {
      return `Imported at ${displayTime(committed.value)}.`;
    }
  }
  return row.summary;
}

function toneFor(row: HistoricalProjectionRow): HistoricalPresentationItem["tone"] {
  if (row.factType === "decision-rejected") return "attention";
  if (row.factType === "execution-current-status" && (row.recordStatus === "blocked" || row.recordStatus === "at-risk")) {
    return "attention";
  }
  if (row.factType === "decision-approved" || row.factType === "execution-completed" || row.factType === "observation-recorded") {
    return "positive";
  }
  return "neutral";
}

function statusLabel(status: string | null): string {
  if (!status) return "Unknown";
  return STATUS_LABELS[status] ?? status;
}

function displayTime(iso: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(iso);
  return match ? `${match[1]} ${match[2]} UTC` : iso;
}
