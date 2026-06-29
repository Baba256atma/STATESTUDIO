/**
 * APP-9:5 — Confidence evidence link builder.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import {
  clampLinkConfidence,
  hasEvidenceValue,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import type { ConfidenceEvidenceReasonLink } from "./confidenceEvolutionEvidenceReasonTypes.ts";

function buildLink(
  workspaceId: string,
  record: ConfidenceEvolutionEngineRecord,
  type: ConfidenceEvidenceReasonLink["type"]
): ConfidenceEvidenceReasonLink {
  return Object.freeze({
    id: `confidence-evidence-link-${workspaceId}-${record.id}`,
    workspaceId,
    recordId: record.id,
    type,
    reason: record.reason,
    source: record.source,
    evidenceReferences: record.evidenceReferences,
    delta: null,
    explained: hasEvidenceValue(record.evidenceReferences),
    confidence: clampLinkConfidence(1),
    metadata: Object.freeze({ linkKind: "evidence", evidenceCount: String(record.evidenceReferences.length) }),
    readOnly: true as const,
  });
}

export function buildConfidenceEvidenceLinks(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[]
): readonly ConfidenceEvidenceReasonLink[] {
  return Object.freeze(
    records
      .filter((record) => hasEvidenceValue(record.evidenceReferences))
      .map((record) => buildLink(workspaceId, record, "evidence-link"))
  );
}

export const ConfidenceEvolutionEvidenceLinks = Object.freeze({
  buildConfidenceEvidenceLinks,
});
