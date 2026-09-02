import type { CsvCommittedImport, CsvImportCandidate } from "../../../lib/data-reality/csvRealDataImportStore.ts";
import {
  CSV_MAPPING_TARGETS,
  type CsvColumnMapping,
  type CsvMappingReview,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import { nextCsvSemanticClarification } from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import type { ExecutiveSourceIntelligence } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import { projectExecutiveSourceIntelligence } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import type { NexoraLiveCommittedObservation, NexoraLiveConnection } from "../../../lib/data-reality/liveDataConnectorFoundation.ts";
import { projectCsvImportAsDecisionTheatreDataObject } from "../../../lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";

export type NexoraDataRailSourcePresentation = Readonly<{
  sourceId: string;
  dataObjectId: string;
  label: string;
  sourceTypeLabel: "CSV";
  statusLabel: "Ready" | "Needs attention" | "Needs clarification";
  requiresManagerAttention: boolean;
  relatedObjectLabels: readonly string[];
  updatedLabel: string;
  active: boolean;
  validationState: "valid";
  understandingState: "validated-mapping";
}>;

export type NexoraDataRailLibraryRow = Readonly<{
  id: string;
  kind: "csv" | "connected";
  lifecycle: "committed" | "pending" | "connected";
  label: string;
  typeLabel: "CSV" | "Connected";
  statusLabel: string;
  active: boolean;
  relatedObjectLabels: readonly string[];
  attention: boolean;
}>;

export type NexoraDataRailLibrary = Readonly<{
  totalCount: number;
  csvCount: number;
  committedCsvCount: number;
  pendingCsvCount: number;
  connectedCount: number;
  csvEmpty: boolean;
  csvRows: readonly NexoraDataRailLibraryRow[];
  connectedRows: readonly NexoraDataRailLibraryRow[];
}>;

function relatedLabels(intelligence: ExecutiveSourceIntelligence | null): readonly string[] {
  return Object.freeze([
    ...new Set((intelligence?.affectedObjects ?? []).map((entry) => entry.objectLabel)),
  ]);
}

export function describeCsvSourceForManager(input: Readonly<{
  fileName: string;
  mapping: CsvMappingReview;
  relatedObjectLabels?: readonly string[];
}>): string {
  const confirmed = input.mapping.mappings
    .filter((entry) => entry.confirmed && (entry.semantic?.confirmedMeaning || entry.targetLabel))
    .map((entry) => entry.semantic?.confirmedMeaning ?? entry.targetLabel)
    .filter((entry): entry is string => Boolean(entry));
  const unresolved = input.mapping.mappings.filter((entry) => !entry.ignored && !entry.confirmed);
  if (confirmed.length === 0) {
    return "Nexora has not confirmed enough business meaning to describe this source yet.";
  }
  const unique = [...new Set(confirmed)];
  const list = unique.length === 1 ? unique[0] : unique.length === 2 ? `${unique[0]} and ${unique[1]}` : `${unique.slice(0, -1).join(", ")}, and ${unique.slice(-1)[0]}`;
  const related = (input.relatedObjectLabels ?? []).slice(0, 3);
  const relatedClause = related.length ? ` Related objects: ${related.join(", ")}.` : "";
  if (unresolved.length > 0) {
    return `Nexora understands this file contains ${list.toLowerCase()} information. Other fields still need clarification.`;
  }
  return `Nexora understands this source as ${list.toLowerCase()} information.${relatedClause}`;
}

export function describeCsvNeedsAttentionForManager(error: string): string {
  const missing = error.match(/KPI "[^"]+" is missing required metric "([^.]+)\.([^"]+)"\./);
  if (!missing) return error;
  const objectLabel = missing[1]!
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const metricLabel = missing[2]!
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `Nexora needs ${metricLabel} before this data can be used for ${objectLabel}.`;
}

export function csvUncertainMeaningCopy(mapping: CsvColumnMapping): string {
  if (mapping.semantic?.state === "CONFLICTING") return "Conflicts with an earlier meaning";
  const proposed = mapping.semantic?.proposedMeaning?.trim() ?? "";
  if (!proposed) return "Meaning not confirmed";
  const knownTarget = CSV_MAPPING_TARGETS.find((target) => target.label.toLowerCase() === proposed.toLowerCase());
  const compactProposed = proposed.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const compactColumn = mapping.sourceColumn.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!knownTarget && (compactProposed === compactColumn || proposed.length <= 4)) {
    return "Meaning not confirmed";
  }
  if (knownTarget) return `Likely ${knownTarget.label}`;
  if (proposed.split(/\s+/).every((word) => word.length > 2)) return `Likely ${proposed}`;
  return "Meaning not confirmed";
}

export function csvManagerObjectLabel(objectKey: string): string {
  return objectKey.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function csvPotentialRelatedLabels(mapping: CsvMappingReview): readonly string[] {
  const labels = new Set<string>();
  for (const entry of mapping.mappings) {
    if (!entry.confirmed || entry.ignored) continue;
    const targetId = entry.semantic?.confirmedTargetId ?? entry.targetId;
    const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === targetId);
    if (target?.objectKey) labels.add(csvManagerObjectLabel(target.objectKey));
  }
  return Object.freeze([...labels].sort());
}

export function csvConfirmedMappings(mapping: CsvMappingReview): readonly CsvColumnMapping[] {
  return Object.freeze(mapping.mappings.filter((entry) => !entry.ignored && entry.confirmed && (entry.semantic?.confirmedMeaning || entry.targetLabel)));
}

export function csvUnconfirmedMappings(mapping: CsvMappingReview): readonly CsvColumnMapping[] {
  return Object.freeze(mapping.mappings.filter((entry) => !entry.ignored && !entry.confirmed));
}

export function projectCsvDataRailSource(input: Readonly<{
  committed: CsvCommittedImport;
  intelligence: ExecutiveSourceIntelligence;
  active: boolean;
}>): NexoraDataRailSourcePresentation {
  const dataObject = projectCsvImportAsDecisionTheatreDataObject(input.committed);
  const needsClarification = nextCsvSemanticClarification(input.committed.prepared.mapping) != null;
  const needsAttention = needsClarification || input.intelligence.overallState !== "normal";
  return Object.freeze({
    sourceId: input.committed.sourceContextId,
    dataObjectId: dataObject.id,
    label: input.committed.prepared.fileName,
    sourceTypeLabel: "CSV" as const,
    statusLabel: needsClarification ? "Needs clarification" as const : needsAttention ? "Needs attention" as const : "Ready" as const,
    requiresManagerAttention: needsAttention,
    relatedObjectLabels: relatedLabels(input.intelligence),
    updatedLabel: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(input.committed.committedAt)),
    active: input.active,
    validationState: dataObject.validationState,
    understandingState: dataObject.understandingState,
  });
}

function liveProjection(observation: NexoraLiveCommittedObservation) {
  return Object.freeze({
    workspaceId: observation.workspaceId,
    sourceContextId: observation.sourceContextId,
    sourceLabel: observation.sourceLabel,
    committedAt: observation.committedAt,
    recordCount: observation.recordCount,
    mappingId: observation.mappingId,
    snapshot: observation.snapshot,
    handoff: observation.handoff,
    dataReality: observation.dataReality,
  });
}

export function projectNexoraDataRailLibrary(input: Readonly<{
  csvImports: readonly CsvCommittedImport[];
  liveConnections: readonly NexoraLiveConnection[];
  latestObservationByConnectionId: Readonly<Record<string, NexoraLiveCommittedObservation | null | undefined>>;
  activeCsvSourceId: string | null;
  activeLiveSourceContextId: string | null;
  pendingCandidates?: readonly CsvImportCandidate[];
}>): NexoraDataRailLibrary {
  const pendingRows = Object.freeze((input.pendingCandidates ?? [])
    .filter((entry) => !entry.replacementSourceContextId)
    .map((pending) => Object.freeze({
      id: pending.candidateId,
      kind: "csv" as const,
      lifecycle: "pending" as const,
      label: pending.fileName,
      typeLabel: "CSV" as const,
      statusLabel: "Pending",
      active: false,
      relatedObjectLabels: Object.freeze([]) as readonly string[],
      attention: true,
    })));
  const csvRows = Object.freeze([
    ...pendingRows,
    ...input.csvImports.map((committed) => {
      const intelligence = projectExecutiveSourceIntelligence(committed);
      const view = projectCsvDataRailSource({
        committed,
        intelligence,
        active: input.activeCsvSourceId === committed.sourceContextId,
      });
      return Object.freeze({
        id: committed.sourceContextId,
        kind: "csv" as const,
        lifecycle: "committed" as const,
        label: view.label,
        typeLabel: "CSV" as const,
        statusLabel: view.statusLabel,
        active: view.active,
        relatedObjectLabels: view.relatedObjectLabels,
        attention: view.requiresManagerAttention,
      });
    }),
  ]);
  const connectedRows = Object.freeze(input.liveConnections.map((connection) => {
    const latest = input.latestObservationByConnectionId[connection.connectionId] ?? null;
    const intelligence = latest ? projectExecutiveSourceIntelligence(liveProjection(latest)) : null;
    const active = input.activeLiveSourceContextId === `live:${connection.connectionId}`;
    return Object.freeze({
      id: connection.connectionId,
      kind: "connected" as const,
      lifecycle: "connected" as const,
      label: connection.displayName,
      typeLabel: "Connected" as const,
      statusLabel: connection.status === "connected" ? "Connected" : connection.status,
      active,
      relatedObjectLabels: relatedLabels(intelligence),
      attention: intelligence != null && intelligence.overallState !== "normal",
    });
  }));
  const committedCsvCount = input.csvImports.length;
  const pendingCsvCount = pendingRows.length;
  return Object.freeze({
    totalCount: csvRows.length + connectedRows.length,
    csvCount: csvRows.length,
    committedCsvCount,
    pendingCsvCount,
    connectedCount: connectedRows.length,
    csvEmpty: csvRows.length === 0,
    csvRows,
    connectedRows,
  });
}
