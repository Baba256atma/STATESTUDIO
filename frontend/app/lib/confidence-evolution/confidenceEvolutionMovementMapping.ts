/**
 * APP-9:5 — Confidence movement-to-reason/evidence mapping.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type { ConfidenceDeltaPair } from "./confidenceEvolutionTrendTypes.ts";
import {
  clampLinkConfidence,
  isExplainedRecord,
  isLargeMovement,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import type { ConfidenceEvidenceReasonLink } from "./confidenceEvolutionEvidenceReasonTypes.ts";

function findRecord(
  records: readonly ConfidenceEvolutionEngineRecord[],
  recordId: string
): ConfidenceEvolutionEngineRecord | undefined {
  return records.find((record) => record.id === recordId);
}

function buildMovementLink(
  workspaceId: string,
  record: ConfidenceEvolutionEngineRecord,
  previousRecordId: string,
  delta: number,
  type: ConfidenceEvidenceReasonLink["type"]
): ConfidenceEvidenceReasonLink {
  const explained = isExplainedRecord(record.reason, record.evidenceReferences);
  return Object.freeze({
    id: `confidence-movement-link-${workspaceId}-${type}-${record.id}`,
    workspaceId,
    recordId: record.id,
    previousRecordId,
    type,
    reason: record.reason,
    source: record.source,
    evidenceReferences: record.evidenceReferences,
    delta,
    explained,
    confidence: clampLinkConfidence(1),
    metadata: Object.freeze({ movementType: type }),
    readOnly: true as const,
  });
}

export function mapConfidenceMovementsToReasons(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceEvidenceReasonLink[] {
  const links: ConfidenceEvidenceReasonLink[] = [];
  for (const entry of deltas) {
    const record = findRecord(records, entry.recordId);
    if (!record) {
      continue;
    }
    links.push(buildMovementLink(workspaceId, record, entry.previousRecordId, entry.delta, "movement-link"));
  }
  return Object.freeze(links);
}

export function mapConfidenceMovementsToEvidence(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceEvidenceReasonLink[] {
  const links: ConfidenceEvidenceReasonLink[] = [];
  for (const entry of deltas) {
    const record = findRecord(records, entry.recordId);
    if (!record || record.evidenceReferences.length === 0) {
      continue;
    }
    links.push(
      Object.freeze({
        ...buildMovementLink(workspaceId, record, entry.previousRecordId, entry.delta, "movement-link"),
        id: `confidence-movement-evidence-${workspaceId}-${record.id}`,
        type: "movement-link" as const,
        metadata: Object.freeze({ movementType: "movement-link", evidenceMapped: "true" }),
      })
    );
  }
  return Object.freeze(links);
}

export function buildMovementExplanationLinks(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceEvidenceReasonLink[] {
  const links: ConfidenceEvidenceReasonLink[] = [];

  for (const entry of deltas) {
    const record = findRecord(records, entry.recordId);
    if (!record) {
      continue;
    }
    const explained = isExplainedRecord(record.reason, record.evidenceReferences);
    const movementType: ConfidenceEvidenceReasonLink["type"] = explained
      ? "explained-movement"
      : "unexplained-movement";
    links.push(buildMovementLink(workspaceId, record, entry.previousRecordId, entry.delta, movementType));

    if (isLargeMovement(entry.delta)) {
      links.push(
        Object.freeze({
          ...buildMovementLink(workspaceId, record, entry.previousRecordId, entry.delta, "large-change"),
          id: `confidence-large-change-${workspaceId}-${record.id}`,
          type: "large-change" as const,
          explained,
          metadata: Object.freeze({ largeChange: "true", explained: String(explained) }),
        })
      );
    }
  }

  return Object.freeze(links);
}

export function buildSourceLinks(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[]
): readonly ConfidenceEvidenceReasonLink[] {
  return Object.freeze(
    records.map((record) =>
      Object.freeze({
        id: `confidence-source-link-${workspaceId}-${record.id}`,
        workspaceId,
        recordId: record.id,
        type: "source-link" as const,
        reason: record.reason,
        source: record.source,
        evidenceReferences: record.evidenceReferences,
        delta: null,
        explained: isExplainedRecord(record.reason, record.evidenceReferences),
        confidence: clampLinkConfidence(1),
        metadata: Object.freeze({ linkKind: "source" }),
        readOnly: true as const,
      })
    )
  );
}

export const ConfidenceEvolutionMovementMapping = Object.freeze({
  mapConfidenceMovementsToReasons,
  mapConfidenceMovementsToEvidence,
  buildMovementExplanationLinks,
  buildSourceLinks,
});
