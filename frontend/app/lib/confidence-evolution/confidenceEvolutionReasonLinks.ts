/**
 * APP-9:5 — Confidence reason link builder.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import {
  clampLinkConfidence,
  hasReasonValue,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import type { ConfidenceEvidenceReasonLink } from "./confidenceEvolutionEvidenceReasonTypes.ts";

function buildLink(
  workspaceId: string,
  record: ConfidenceEvolutionEngineRecord,
  type: ConfidenceEvidenceReasonLink["type"]
): ConfidenceEvidenceReasonLink {
  return Object.freeze({
    id: `confidence-reason-link-${workspaceId}-${record.id}`,
    workspaceId,
    recordId: record.id,
    type,
    reason: record.reason,
    source: record.source,
    evidenceReferences: record.evidenceReferences,
    delta: null,
    explained: hasReasonValue(record.reason),
    confidence: clampLinkConfidence(1),
    metadata: Object.freeze({ linkKind: "reason" }),
    readOnly: true as const,
  });
}

export function buildConfidenceReasonLinks(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[]
): readonly ConfidenceEvidenceReasonLink[] {
  return Object.freeze(
    records
      .filter((record) => hasReasonValue(record.reason))
      .map((record) => buildLink(workspaceId, record, "reason-link"))
  );
}

export const ConfidenceEvolutionReasonLinks = Object.freeze({
  buildConfidenceReasonLinks,
});
