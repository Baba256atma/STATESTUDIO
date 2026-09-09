/**
 * DATA-ADV:1 — read-only Advisor projection of the manager Data Library.
 * Not a source store, Data Reality, or semantic writer.
 */
import {
  listCsvImportCandidates,
  listCsvRealDataImports,
  listCsvRemovedSourceReferences,
  type CsvImportCandidate,
  type CsvCommittedImport,
  type CsvRemovedSourceReference,
} from "../data-reality/csvRealDataImportStore.ts";
import { projectExecutiveSourceIntelligence } from "../data-reality/executiveSourceIntelligence.ts";
import { listNexoraLiveConnections } from "../data-reality/liveDataConnectionStore.ts";
import { CSV_MAPPING_TARGETS, type CsvColumnMapping, type CsvMappingReview } from "../data-reality/csvRealDataVerticalSlice.ts";
import { resolveSemanticCandidates, type SemanticCandidateResolution } from "../data-reality/semanticCandidateIntelligence.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const nexoraAdvisorDataContextIdentity = "DATA-ADV:1/AdvisorDataContext" as const;

export const ADVISOR_DATA_CONTEXT_BOUNDARY = Object.freeze({
  ownsCsvStore: false as const,
  ownsDataReality: false as const,
  ownsSemanticWrites: false as const,
  ownsStage: false as const,
  ownsDecision: false as const,
  dumpsFullCsvIntoPrompt: false as const,
  restoreAnnounces: false as const,
});

export type AdvisorDataLifecycle = "committed" | "pending" | "connected" | "historical";
export type AdvisorDataFieldConfidence = "confirmed" | "authoritative" | "likely" | "ambiguous" | "unresolved";

export type AdvisorDataField = Readonly<{
  sourceContextId: string;
  sourceLabel: string;
  column: string;
  fieldId: string | null;
  confirmedMeaning: string | null;
  proposedMeaning: string | null;
  confirmationSource: "manager" | "authoritative-mapping" | "none";
  confidence: AdvisorDataFieldConfidence;
  ignored: boolean;
  semanticResolution: SemanticCandidateResolution;
  observation: AdvisorFieldObservation;
}>;

export type AdvisorFieldObservation = Readonly<{
  rowCount: number;
  nonNullCount: number;
  uniqueCount: number;
  numeric: boolean;
  minimum: number | null;
  maximum: number | null;
  average: number | null;
}>;

export type AdvisorDataSource = Readonly<{
  sourceContextId: string;
  sourceType: "csv" | "connected";
  lifecycle: AdvisorDataLifecycle;
  label: string;
  statusLabel: string;
  description: string;
  acceptedEvidence: boolean;
  fields: readonly AdvisorDataField[];
  relatedObjectLabels: readonly string[];
  relatedUncertainty: boolean;
  recordCount: number;
}>;

export type AdvisorDataContext = Readonly<{
  identity: typeof nexoraAdvisorDataContextIdentity;
  workspaceId: WorkspaceId;
  sources: readonly AdvisorDataSource[];
}>;

export function compactDataToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function fieldConfidence(mapping: CsvColumnMapping): AdvisorDataFieldConfidence {
  if (mapping.semantic?.confirmationSource === "authoritative-mapping" && mapping.confirmed) return "authoritative";
  if (mapping.confirmed && mapping.semantic?.confirmationSource === "manager") return "confirmed";
  if (mapping.confirmed && mapping.targetLabel) return "confirmed";
  const proposed = mapping.semantic?.proposedMeaning?.trim() ?? "";
  const known = CSV_MAPPING_TARGETS.some((target) => target.label.toLowerCase() === proposed.toLowerCase());
  if (proposed && known && !mapping.confirmed) return "likely";
  return "unresolved";
}

function describeSource(fileName: string, mapping: CsvMappingReview | null, related: readonly string[]): string {
  if (!mapping) return `${fileName} is still under review.`;
  const confirmed = mapping.mappings
    .filter((entry) => entry.confirmed && (entry.semantic?.confirmedMeaning || entry.targetLabel))
    .map((entry) => entry.semantic?.confirmedMeaning ?? entry.targetLabel)
    .filter((entry): entry is string => Boolean(entry));
  const unique = [...new Set(confirmed)];
  if (unique.length === 0) {
    return "Nexora has not confirmed enough business meaning to describe this source yet.";
  }
  const list = unique.length === 1 ? unique[0] : unique.length === 2 ? `${unique[0]} and ${unique[1]}` : `${unique.slice(0, -1).join(", ")}, and ${unique.slice(-1)[0]}`;
  const relatedClause = related.length ? ` Related objects: ${related.join(", ")}.` : "";
  const unresolved = mapping.mappings.some((entry) => !entry.ignored && !entry.confirmed);
  if (unresolved) return `Nexora understands this file contains ${list.toLowerCase()} information. Other fields still need clarification.`;
  return `Nexora understands this source as ${list.toLowerCase()} information.${relatedClause}`;
}

function potentialRelated(mapping: CsvMappingReview): readonly string[] {
  const labels = new Set<string>();
  for (const entry of mapping.mappings) {
    if (!entry.confirmed || entry.ignored) continue;
    const targetId = entry.semantic?.confirmedTargetId ?? entry.targetId;
    const target = CSV_MAPPING_TARGETS.find((item) => item.targetId === targetId);
    if (target?.objectKey) labels.add(target.objectKey.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()));
  }
  return Object.freeze([...labels].sort());
}

function observeColumn(records: readonly { readonly values: readonly unknown[] }[], columnIndex: number): AdvisorFieldObservation {
  const texts: string[] = [];
  for (const record of records) {
    const raw = record.values[columnIndex];
    if (raw == null || raw === "") continue;
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
      const text = String(raw).trim();
      if (text) texts.push(text);
    }
  }
  const numbers = texts
    .map((text) => Number(text.replace(/[$,%\s]/g, "")))
    .filter((value) => Number.isFinite(value));
  const numeric = texts.length > 0 && numbers.length === texts.length;
  const sum = numbers.reduce((total, value) => total + value, 0);
  return Object.freeze({
    rowCount: records.length,
    nonNullCount: texts.length,
    uniqueCount: new Set(texts).size,
    numeric,
    minimum: numeric && numbers.length ? Math.min(...numbers) : null,
    maximum: numeric && numbers.length ? Math.max(...numbers) : null,
    average: numeric && numbers.length ? sum / numbers.length : null,
  });
}

function fieldsFromMapping(
  sourceContextId: string,
  sourceLabel: string,
  mapping: CsvMappingReview | null,
  records: readonly { readonly values: readonly unknown[] }[] = [],
): readonly AdvisorDataField[] {
  if (!mapping) return Object.freeze([]);
  const neighboringConfirmedMeanings = mapping.mappings.flatMap((entry) => entry.semantic?.confirmedMeaning ? [entry.semantic.confirmedMeaning] : []);
  return Object.freeze(mapping.mappings.map((entry) => {
    const semanticResolution = resolveSemanticCandidates({
      term: entry.sourceColumn,
      sourceLabel,
      confirmedMeaning: entry.semantic?.confirmedMeaning ?? (entry.confirmed ? entry.targetLabel : null),
      canonicalProposedMeaning: fieldConfidence(entry) === "likely" ? entry.semantic?.proposedMeaning ?? null : null,
      confirmationSource: entry.semantic?.confirmationSource ?? "none",
      neighboringConfirmedMeanings: neighboringConfirmedMeanings.filter((meaning) => meaning !== entry.semantic?.confirmedMeaning),
    });
    const confidence: AdvisorDataFieldConfidence = semanticResolution.state === "AUTHORITATIVE" ? "authoritative"
      : semanticResolution.state === "MANAGER_CONFIRMED" ? "confirmed"
        : semanticResolution.state === "LIKELY" ? "likely"
          : semanticResolution.state === "AMBIGUOUS" ? "ambiguous" : fieldConfidence(entry);
    return Object.freeze({
      sourceContextId,
      sourceLabel,
      column: entry.sourceColumn,
      fieldId: entry.semantic?.fieldId ?? null,
      confirmedMeaning: entry.semantic?.confirmedMeaning ?? (entry.confirmed ? entry.targetLabel : null),
      proposedMeaning: semanticResolution.state === "LIKELY" ? semanticResolution.candidates[0]?.meaning ?? entry.semantic?.proposedMeaning ?? null : null,
      confirmationSource: entry.semantic?.confirmationSource ?? "none",
      confidence,
      ignored: entry.ignored,
      semanticResolution,
      observation: observeColumn(records, entry.columnIndex),
    });
  }));
}

function projectCommitted(entry: CsvCommittedImport): AdvisorDataSource {
  const esi = projectExecutiveSourceIntelligence(entry);
  const related = Object.freeze([...new Set(esi.affectedObjects.map((item) => item.objectLabel))]);
  return Object.freeze({
    sourceContextId: entry.sourceContextId,
    sourceType: "csv" as const,
    lifecycle: "committed" as const,
    label: entry.prepared.fileName,
    statusLabel: "Ready",
    description: describeSource(entry.prepared.fileName, entry.prepared.mapping, related),
    acceptedEvidence: true,
    fields: fieldsFromMapping(entry.sourceContextId, entry.prepared.fileName, entry.prepared.mapping, entry.prepared.parse.records),
    relatedObjectLabels: related,
    relatedUncertainty: false,
    recordCount: entry.prepared.parse.records.length,
  });
}

function projectHistorical(entry: CsvRemovedSourceReference): AdvisorDataSource {
  return Object.freeze({
    sourceContextId: entry.sourceId,
    sourceType: "csv" as const,
    lifecycle: "historical" as const,
    label: entry.label,
    statusLabel: "Removed",
    description: `${entry.label} was removed and is not currently used as accepted evidence.`,
    acceptedEvidence: false,
    fields: Object.freeze([] as AdvisorDataField[]),
    relatedObjectLabels: Object.freeze([] as string[]),
    relatedUncertainty: false,
    recordCount: 0,
  });
}

function projectPending(entry: CsvImportCandidate): AdvisorDataSource {
  const potential = entry.mapping ? potentialRelated(entry.mapping) : [];
  return Object.freeze({
    sourceContextId: entry.candidateId,
    sourceType: "csv" as const,
    lifecycle: "pending" as const,
    label: entry.fileName,
    statusLabel: "Pending",
    description: describeSource(entry.fileName, entry.mapping, []),
    acceptedEvidence: false,
    fields: fieldsFromMapping(entry.candidateId, entry.fileName, entry.mapping, entry.parse?.records ?? []),
    relatedObjectLabels: potential,
    relatedUncertainty: potential.length > 0,
    recordCount: entry.parse?.records.length ?? 0,
  });
}

export function projectAdvisorDataContext(workspaceId: WorkspaceId): AdvisorDataContext {
  const committed = listCsvRealDataImports(workspaceId).map(projectCommitted);
  const pending = listCsvImportCandidates(workspaceId).map(projectPending);
  const historical = listCsvRemovedSourceReferences(workspaceId).map(projectHistorical);
  const connected = listNexoraLiveConnections(workspaceId).map((connection) => Object.freeze({
    sourceContextId: `live:${connection.connectionId}`,
    sourceType: "connected" as const,
    lifecycle: "connected" as const,
    label: connection.displayName,
    statusLabel: connection.status === "connected" ? "Connected" : connection.status,
    description: `${connection.displayName} is a connected source.`,
    acceptedEvidence: connection.status === "connected",
    fields: Object.freeze([] as AdvisorDataField[]),
    relatedObjectLabels: Object.freeze([] as string[]),
    relatedUncertainty: false,
    recordCount: 0,
  }));
  return Object.freeze({
    identity: nexoraAdvisorDataContextIdentity,
    workspaceId,
    sources: Object.freeze([...committed, ...pending, ...connected, ...historical]),
  });
}
