/**
 * RDI-DIR:1 — canonical published KPI observed direction.
 *
 * Derives descriptive increase/decrease/stable from published P0:1 KPI
 * observations. Does not evaluate Outcome, copy expected direction, or
 * attribute causation. RDI:3 improved/deteriorated remains a different
 * executive-source comparison vocabulary.
 */

import type { NexoraPublishedKpiObservedDirection } from "./dataRealityContracts.ts";
import { NEXORA_PUBLISHED_KPI_OBSERVED_DIRECTIONS } from "./dataRealityContracts.ts";
import { EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP } from "./demo/executiveOperationsObjectBindings.ts";
import {
  listCsvPublishedKpiObservations,
  type CsvPublishedKpiObservation,
} from "./csvRealDataImportStore.ts";
import { listAllNexoraLiveCommittedObservations } from "./liveDataConnectionStore.ts";

export const publishedKpiObservedDirectionIdentity =
  "RDI-DIR:1/PublishedKpiObservedDirection" as const;
export const publishedKpiObservedDirectionVersion = "1.0.0" as const;
export const publishedKpiObservedDirectionNamespace =
  "nexora.data-reality.published-kpi-observed-direction" as const;

export const PUBLISHED_KPI_OBSERVED_DIRECTION_BOUNDARY = Object.freeze({
  owner: "P0:1/NexoraDataRealityFoundation" as const,
  publicationAuthority: "RDI:1/NexoraRealDataIntegrationFoundation" as const,
  csvRuntime: "RDI:2/csvRealDataImportStore" as const,
  liveJournal: "RDI:4/liveDataConnectionStore" as const,
  ownsOutcomeEvaluation: false as const,
  ownsExpectedDirection: false as const,
  ownsCausation: false as const,
  ownsLearning: false as const,
  copiesRdi3ImprovedDeteriorated: false as const,
  copiesExecutiveObjectState: false as const,
  copiesManagerReportedState: false as const,
  hiddenTolerance: false as const,
  derivedNotSecondStore: true as const,
});

export type PublishedKpiObservation = Readonly<{
  observationId: string;
  kpiId: string;
  objectKey: string;
  nexoraObjectId: string;
  value: number;
  unit: string;
  observedAt: string;
  sourceContextId: string;
  publicationId: string;
  channel: "csv" | "live";
  provenance: readonly string[];
}>;

export type PublishedKpiDirectionAbsenceReason =
  | "first-observation"
  | "no-matching-observation"
  | "same-timestamp"
  | "incompatible-unit"
  | "incompatible-source"
  | "missing-value"
  | "non-finite-value"
  | "incompatible-shape";

export type PublishedKpiObservedDirectionProjection = Readonly<{
  identity: typeof publishedKpiObservedDirectionIdentity;
  subjectId: string;
  objectKey: string;
  kpiId: string;
  observedDirection: NexoraPublishedKpiObservedDirection | null;
  absenceReason: PublishedKpiDirectionAbsenceReason | null;
  previousObservationId: string | null;
  currentObservationId: string | null;
  previousObservedAt: string | null;
  currentObservedAt: string | null;
  previousValue: number | null;
  currentValue: number | null;
  unit: string | null;
  previousSourceContextId: string | null;
  currentSourceContextId: string | null;
  provenance: readonly string[];
  establishesCausation: false;
  evaluatesOutcome: false;
}>;

export const CORE_OUT_OBSERVED_DIRECTION_VOCABULARY = Object.freeze([
  "improved",
  "worsened",
  "unchanged",
] as const);

export const PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY = Object.freeze({
  automaticProjection: false as const,
  reason:
    "RDI increase/decrease/stable is descriptive numeric change. CORE-OUT observedDirection improved/worsened/unchanged encodes evaluative meaning and must not be copied here.",
  representationalNotes: Object.freeze({
    increase: "not equivalent to improved",
    decrease: "not equivalent to worsened",
    stable: "closest CORE-OUT token is unchanged, but that mapping is a later projection certification, not RDI-DIR",
  }),
});

function freezeList<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

function canonicalSubjectKeys(identity: string): readonly string[] {
  const mapped = EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find(
    (entry) =>
      entry.objectKey === identity ||
      entry.nexoraObjectId === identity ||
      entry.mvpStageObjectId === identity,
  );
  if (!mapped) return Object.freeze([identity]);
  return freezeList(
    [mapped.objectKey, mapped.nexoraObjectId, mapped.mvpStageObjectId].filter(
      (value): value is string => Boolean(value),
    ),
  );
}

export function publishedKpiSubjectsEquivalent(left: string, right: string): boolean {
  const leftKeys = new Set(canonicalSubjectKeys(left));
  return canonicalSubjectKeys(right).some((key) => leftKeys.has(key));
}

function unitsCompatible(left: string, right: string): boolean {
  return left.trim() === right.trim();
}

function fromCsv(entry: CsvPublishedKpiObservation): PublishedKpiObservation {
  return Object.freeze({
    observationId: entry.observationId,
    kpiId: entry.kpiId,
    objectKey: entry.objectKey,
    nexoraObjectId: entry.nexoraObjectId,
    value: entry.value,
    unit: entry.unit,
    observedAt: entry.observedAt,
    sourceContextId: entry.sourceContextId,
    publicationId: entry.importId,
    channel: "csv" as const,
    provenance: freezeList([entry.sourceContextId, entry.importId, entry.observedAt]),
  });
}

function fromLive(): readonly PublishedKpiObservation[] {
  return freezeList(
    listAllNexoraLiveCommittedObservations().flatMap((observation) =>
      (observation.dataReality?.kpis ?? []).flatMap((kpi) => {
        if (!Number.isFinite(kpi.value)) return [];
        const observedAt = kpi.calculatedAt || observation.observedAt;
        return [
          Object.freeze({
            observationId: `live:${observation.observationId}:${kpi.kpiId}`,
            kpiId: kpi.kpiId,
            objectKey: kpi.objectKey,
            nexoraObjectId: kpi.nexoraObjectId,
            value: kpi.value,
            unit: kpi.unit,
            observedAt,
            sourceContextId: observation.sourceContextId,
            publicationId: observation.observationId,
            channel: "live" as const,
            provenance: freezeList([
              observation.sourceContextId,
              observation.observationId,
              observedAt,
            ]),
          }),
        ];
      }),
    ),
  );
}

export function listPublishedKpiObservations(filter?: {
  readonly kpiId?: string;
  readonly subjectId?: string;
}): readonly PublishedKpiObservation[] {
  const merged = freezeList([
    ...listCsvPublishedKpiObservations().map(fromCsv),
    ...fromLive(),
  ]);
  return freezeList(
    merged.filter((entry) => {
      if (filter?.kpiId && entry.kpiId !== filter.kpiId) return false;
      if (
        filter?.subjectId &&
        !publishedKpiSubjectsEquivalent(filter.subjectId, entry.nexoraObjectId) &&
        !publishedKpiSubjectsEquivalent(filter.subjectId, entry.objectKey)
      ) {
        return false;
      }
      return true;
    }),
  );
}

function compareTemporal(left: PublishedKpiObservation, right: PublishedKpiObservation): number {
  const byTime = left.observedAt.localeCompare(right.observedAt);
  if (byTime !== 0) return byTime;
  return left.observationId.localeCompare(right.observationId);
}

function emptyProjection(
  input: {
    readonly kpiId: string;
    readonly subjectId: string;
    readonly objectKey?: string;
  },
  reason: PublishedKpiDirectionAbsenceReason,
  current: PublishedKpiObservation | null,
): PublishedKpiObservedDirectionProjection {
  return Object.freeze({
    identity: publishedKpiObservedDirectionIdentity,
    subjectId: input.subjectId,
    objectKey: current?.objectKey ?? input.objectKey ?? "",
    kpiId: input.kpiId,
    observedDirection: null,
    absenceReason: reason,
    previousObservationId: null,
    currentObservationId: current?.observationId ?? null,
    previousObservedAt: null,
    currentObservedAt: current?.observedAt ?? null,
    previousValue: null,
    currentValue: current?.value ?? null,
    unit: current?.unit ?? null,
    previousSourceContextId: null,
    currentSourceContextId: current?.sourceContextId ?? null,
    provenance: current?.provenance ?? Object.freeze([]),
    establishesCausation: false,
    evaluatesOutcome: false,
  });
}

export function resolvePublishedKpiObservedDirectionFromObservations(
  observations: readonly PublishedKpiObservation[],
  input: {
    readonly kpiId: string;
    readonly subjectId: string;
    readonly currentObservationId?: string | null;
  },
): PublishedKpiObservedDirectionProjection {
  const scoped = observations.filter(
    (entry) =>
      entry.kpiId === input.kpiId &&
      (publishedKpiSubjectsEquivalent(input.subjectId, entry.nexoraObjectId) ||
        publishedKpiSubjectsEquivalent(input.subjectId, entry.objectKey)),
  );
  if (scoped.length === 0) {
    return emptyProjection(input, "no-matching-observation", null);
  }
  const ordered = [...scoped].sort(compareTemporal);
  const current =
    (input.currentObservationId
      ? ordered.find((entry) => entry.observationId === input.currentObservationId)
      : ordered[ordered.length - 1]) ?? null;
  if (!current) return emptyProjection(input, "no-matching-observation", null);
  if (!Number.isFinite(current.value)) {
    return emptyProjection(input, "non-finite-value", current);
  }
  const earlier = ordered.filter(
    (entry) =>
      entry.observedAt < current.observedAt && entry.sourceContextId === current.sourceContextId,
  );
  if (earlier.length === 0) {
    return emptyProjection(input, "first-observation", current);
  }
  const previousTime = earlier[earlier.length - 1]!.observedAt;
  const previousCandidates = earlier.filter((entry) => entry.observedAt === previousTime);
  if (previousCandidates.length !== 1) {
    return emptyProjection(input, "same-timestamp", current);
  }
  const previous = previousCandidates[0]!;
  if (!unitsCompatible(previous.unit, current.unit)) {
    return emptyProjection(input, "incompatible-unit", current);
  }
  let observedDirection: NexoraPublishedKpiObservedDirection;
  if (current.value === previous.value) observedDirection = "stable";
  else if (current.value > previous.value) observedDirection = "increase";
  else observedDirection = "decrease";
  return Object.freeze({
    identity: publishedKpiObservedDirectionIdentity,
    subjectId: input.subjectId,
    objectKey: current.objectKey,
    kpiId: current.kpiId,
    observedDirection,
    absenceReason: null,
    previousObservationId: previous.observationId,
    currentObservationId: current.observationId,
    previousObservedAt: previous.observedAt,
    currentObservedAt: current.observedAt,
    previousValue: previous.value,
    currentValue: current.value,
    unit: current.unit,
    previousSourceContextId: previous.sourceContextId,
    currentSourceContextId: current.sourceContextId,
    provenance: freezeList([...previous.provenance, ...current.provenance]),
    establishesCausation: false,
    evaluatesOutcome: false,
  });
}

export function projectPublishedKpiObservedDirection(input: {
  readonly kpiId: string;
  readonly subjectId: string;
  readonly currentObservationId?: string | null;
}): PublishedKpiObservedDirectionProjection {
  return resolvePublishedKpiObservedDirectionFromObservations(
    listPublishedKpiObservations({ kpiId: input.kpiId, subjectId: input.subjectId }),
    input,
  );
}

export function getPublishedKpiObservedDirectionIdentity() {
  return Object.freeze({
    id: publishedKpiObservedDirectionIdentity,
    version: publishedKpiObservedDirectionVersion,
    namespace: publishedKpiObservedDirectionNamespace,
    directions: NEXORA_PUBLISHED_KPI_OBSERVED_DIRECTIONS,
  });
}
