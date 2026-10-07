/**
 * DATA-ADV projection of accepted Data Reality observations into DIR:VI evidence.
 * Not a store, not a second Data Reality, not a chart engine.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  listCsvRealDataImports,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  CSV_MAPPING_TARGETS,
  type CsvColumnMapping,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP } from "../data-reality/demo/executiveOperationsObjectBindings.ts";
import type {
  NexoraVisualEvidenceBundle,
  NexoraVisualSeries,
} from "../director/nexoraVisualIntelligence.ts";
import { compactDataToken, projectAdvisorDataContext } from "./nexoraAdvisorDataContext.ts";

export const nexoraAdvisorVisualEvidenceIdentity =
  "DATA-ADV:1/AdvisorAcceptedVisualEvidence" as const;

export const ADVISOR_VISUAL_EVIDENCE_BOUNDARY = Object.freeze({
  ownsDataReality: false as const,
  ownsCsvStore: false as const,
  ownsVisualIntelligence: false as const,
  fabricatesValues: false as const,
  fabricatesPeriods: false as const,
  acceptsPendingSources: false as const,
  infersRelationshipsFromFilenames: false as const,
});

export type AdvisorVisualObservationProvenance = Readonly<{
  observationId: string;
  sourceContextId: string;
  sourceLabel: string;
  fieldKey: string;
  periodLabel: string;
  acceptedIntoDataReality: true;
}>;

export type AdvisorAcceptedVisualEvidenceProjection = Readonly<{
  identity: typeof nexoraAdvisorVisualEvidenceIdentity;
  bundle: NexoraVisualEvidenceBundle;
  observationProvenance: readonly AdvisorVisualObservationProvenance[];
}>;

function mvpStageIdForObjectKey(objectKey: string): string | null {
  if (objectKey === "inventory") return "obj-inventory";
  return (
    EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find((item) => item.objectKey === objectKey)
      ?.mvpStageObjectId ?? null
  );
}

function parseNumeric(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const parsed = Number(value.trim().replace(/[$,%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function periodLabelOf(value: unknown, fallback: string): string {
  if (value == null || value === "") return fallback;
  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}

function subjectTokens(subjectId: string | null | undefined, subjectLabel: string | null | undefined): readonly string[] {
  return Object.freeze(
    [subjectId, subjectLabel]
      .filter((item): item is string => Boolean(item && item.trim()))
      .map((item) => compactDataToken(item.replace(/^obj-/, ""))),
  );
}

function mappingMatchesSubject(
  mapping: CsvColumnMapping,
  tokens: readonly string[],
): boolean {
  if (tokens.length === 0) return true;
  const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === mapping.targetId);
  const objectKey = target?.objectKey ?? "";
  const mvpId = objectKey ? mvpStageIdForObjectKey(objectKey) : null;
  const candidates = [
    objectKey,
    mvpId,
    mapping.targetLabel,
    mapping.sourceColumn,
    target?.label,
  ]
    .filter((item): item is string => Boolean(item))
    .map((item) => compactDataToken(item.replace(/^obj-/, "")));
  return tokens.some((token) =>
    candidates.some(
      (candidate) =>
        candidate === token || candidate.includes(token) || token.includes(candidate),
    ),
  );
}

function seriesFromCommitted(
  committed: CsvCommittedImport,
  tokens: readonly string[],
): {
  readonly series: readonly NexoraVisualSeries[];
  readonly provenance: readonly AdvisorVisualObservationProvenance[];
} {
  const mapping = committed.prepared.mapping;
  const parse = committed.prepared.parse;
  if (!mapping || !parse) {
    return { series: Object.freeze([]), provenance: Object.freeze([]) };
  }
  const dateColumn = mapping.mappings.find((entry) => {
    const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === entry.targetId);
    return entry.confirmed && !entry.ignored && target?.aggregation === "metadata";
  });
  const numericMappings = mapping.mappings.filter((entry) => {
    if (!entry.confirmed || entry.ignored || !entry.targetId) return false;
    const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === entry.targetId);
    if (!target?.objectKey || !target.metricKey || target.aggregation === "metadata") {
      return false;
    }
    return mappingMatchesSubject(entry, tokens);
  });
  const series: NexoraVisualSeries[] = [];
  const provenance: AdvisorVisualObservationProvenance[] = [];
  for (const entry of numericMappings) {
    const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === entry.targetId)!;
    const mvpId = mvpStageIdForObjectKey(target.objectKey!) ?? target.objectKey!;
    const points: { periodLabel: string; value: number }[] = [];
    for (const record of parse.records) {
      const value = parseNumeric(record.values[entry.columnIndex]);
      if (value == null) continue;
      const observed =
        dateColumn != null
          ? periodLabelOf(record.values[dateColumn.columnIndex], committed.committedAt)
          : committed.prepared.handoff?.dataset.capturedAt ?? committed.committedAt;
      points.push({ periodLabel: observed, value });
      provenance.push(
        Object.freeze({
          observationId: `csv:${committed.importId}:${record.recordId}:${entry.sourceColumn}`,
          sourceContextId: committed.sourceContextId,
          sourceLabel: committed.prepared.fileName,
          fieldKey: entry.sourceColumn,
          periodLabel: observed,
          acceptedIntoDataReality: true as const,
        }),
      );
    }
    if (points.length === 0) continue;
    series.push(
      Object.freeze({
        id: mvpId,
        fieldLabel: target.label,
        displayLabel: target.label,
        confidence: "CONFIRMED" as const,
        unit: target.unit,
        sourceLabel: committed.prepared.fileName,
        example: false,
        points: Object.freeze(
          points.map((point) => Object.freeze({ periodLabel: point.periodLabel, value: point.value })),
        ),
      }),
    );
  }
  return {
    series: Object.freeze(series),
    provenance: Object.freeze(provenance),
  };
}

export function projectAdvisorAcceptedVisualEvidence(input: {
  readonly workspaceId: WorkspaceId;
  readonly subjectId?: string | null;
  readonly subjectLabel?: string | null;
}): AdvisorAcceptedVisualEvidenceProjection {
  const context = projectAdvisorDataContext(input.workspaceId);
  const acceptedIds = new Set(
    context.sources
      .filter((source) => source.acceptedEvidence && source.lifecycle === "committed")
      .map((source) => source.sourceContextId),
  );
  const tokens = subjectTokens(input.subjectId, input.subjectLabel);
  const series: NexoraVisualSeries[] = [];
  const provenance: AdvisorVisualObservationProvenance[] = [];
  for (const entry of listCsvRealDataImports(input.workspaceId)) {
    if (!acceptedIds.has(entry.sourceContextId)) continue;
    const projected = seriesFromCommitted(entry, tokens);
    series.push(...projected.series);
    provenance.push(...projected.provenance);
  }
  return Object.freeze({
    identity: nexoraAdvisorVisualEvidenceIdentity,
    bundle: Object.freeze({
      acceptedIntoDataReality: true,
      series: Object.freeze(series),
    }),
    observationProvenance: Object.freeze(provenance),
  });
}
