/**
 * APP-9:5 — Confidence evidence + reason link model builder.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import {
  countExplainedMovements,
  detectConfidenceExplanationFlags,
} from "./confidenceEvolutionExplanationFlags.ts";
import {
  calculateEvidenceCoverage,
  calculateModelLinkConfidence,
  hasEvidenceValue,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import { buildConfidenceEvidenceLinks } from "./confidenceEvolutionEvidenceLinks.ts";
import {
  buildMovementExplanationLinks,
  buildSourceLinks,
  mapConfidenceMovementsToEvidence,
  mapConfidenceMovementsToReasons,
} from "./confidenceEvolutionMovementMapping.ts";
import { buildConfidenceReasonLinks } from "./confidenceEvolutionReasonLinks.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  type ConfidenceEvidenceReasonLinkModel,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";

function incrementCount(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

function buildDistribution(
  records: readonly ConfidenceEvolutionEngineRecord[],
  field: "reason" | "source"
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const record of records) {
    incrementCount(counts, record[field]);
  }
  return Object.freeze({ ...counts });
}

export function calculateConfidenceEvidenceCoverage(
  records: readonly ConfidenceEvolutionEngineRecord[]
): number {
  const withEvidence = records.filter((record) => hasEvidenceValue(record.evidenceReferences)).length;
  return calculateEvidenceCoverage(withEvidence, records.length);
}

export function buildConfidenceEvidenceReasonLinkModelFromRecords(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  generatedAt: string
): ConfidenceEvidenceReasonLinkModel {
  const deltas = calculateConfidenceDeltas(records);
  const reasonLinks = buildConfidenceReasonLinks(workspaceId, records);
  const evidenceLinks = buildConfidenceEvidenceLinks(workspaceId, records);
  const movementReasonLinks = mapConfidenceMovementsToReasons(workspaceId, records, deltas);
  const movementEvidenceLinks = mapConfidenceMovementsToEvidence(workspaceId, records, deltas);
  const movementExplanationLinks = buildMovementExplanationLinks(workspaceId, records, deltas);
  const sourceLinks = buildSourceLinks(workspaceId, records);

  const links = Object.freeze([
    ...reasonLinks,
    ...evidenceLinks,
    ...movementReasonLinks,
    ...movementEvidenceLinks,
    ...movementExplanationLinks,
    ...sourceLinks,
  ]);

  const movementCounts = countExplainedMovements(records, deltas);
  const flags = detectConfidenceExplanationFlags(records, deltas);

  return Object.freeze({
    workspaceId,
    generatedAt,
    recordCount: records.length,
    linkCount: links.length,
    links,
    flags,
    evidenceCoverage: calculateConfidenceEvidenceCoverage(records),
    reasonDistribution: buildDistribution(records, "reason"),
    sourceDistribution: buildDistribution(records, "source"),
    explainedMovementCount: movementCounts.explained,
    unexplainedMovementCount: movementCounts.unexplained,
    largeMovementCount: movementCounts.large,
    confidence: calculateModelLinkConfidence(records.length),
    metadata: Object.freeze({
      linkVersion: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
      analysis: "explanation_link_only",
    }),
    contractVersion: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionEvidenceReasonBuilder = Object.freeze({
  buildConfidenceEvidenceReasonLinkModelFromRecords,
  calculateConfidenceEvidenceCoverage,
});
