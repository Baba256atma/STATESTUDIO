/**
 * APP-9:5 — Confidence explanation flag detection.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type { ConfidenceDeltaPair } from "./confidenceEvolutionTrendTypes.ts";
import {
  clampLinkConfidence,
  hasEvidenceValue,
  hasReasonValue,
  isExplainedRecord,
  isLargeMovement,
  isSourceReasonAligned,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import type {
  ConfidenceExplanationFlag,
  ConfidenceExplanationFlagType,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";

function flag(
  type: ConfidenceExplanationFlagType,
  description: string,
  recordId?: string,
  previousRecordId?: string
): ConfidenceExplanationFlag {
  return Object.freeze({
    type,
    recordId,
    previousRecordId,
    description,
    confidence: clampLinkConfidence(1),
    metadata: Object.freeze({ deterministic: "true" }),
    readOnly: true as const,
  });
}

export function detectConfidenceExplanationFlags(
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceExplanationFlag[] {
  const flags: ConfidenceExplanationFlag[] = [];

  for (const record of records) {
    const hasReason = hasReasonValue(record.reason);
    const hasEvidence = hasEvidenceValue(record.evidenceReferences);

    if (hasReason) {
      flags.push(flag("has-reason", `Record ${record.id} declares change reason.`, record.id));
    }
    if (hasEvidence) {
      flags.push(flag("has-evidence", `Record ${record.id} references evidence.`, record.id));
    }
    if (hasReason && !hasEvidence) {
      flags.push(
        flag("reason-without-evidence", `Record ${record.id} has reason without evidence.`, record.id)
      );
    }
    if (hasEvidence && !hasReason) {
      flags.push(
        flag("evidence-without-reason", `Record ${record.id} has evidence without explicit reason.`, record.id)
      );
    }
    if (isSourceReasonAligned(record.source, record.reason)) {
      flags.push(
        flag("source-reason-aligned", `Record ${record.id} source and reason are aligned.`, record.id)
      );
    } else {
      flags.push(
        flag("source-reason-misaligned", `Record ${record.id} source and reason are misaligned.`, record.id)
      );
    }
  }

  for (const entry of deltas) {
    const record = records.find((candidate) => candidate.id === entry.recordId);
    if (!record) {
      continue;
    }
    const explained = isExplainedRecord(record.reason, record.evidenceReferences);
    const supported = hasEvidenceValue(record.evidenceReferences);

    if (supported) {
      flags.push(
        flag(
          "movement-supported",
          `Movement to ${record.id} is supported by evidence.`,
          record.id,
          entry.previousRecordId
        )
      );
    } else {
      flags.push(
        flag(
          "movement-unsupported",
          `Movement to ${record.id} lacks evidence support.`,
          record.id,
          entry.previousRecordId
        )
      );
    }

    if (isLargeMovement(entry.delta)) {
      if (explained) {
        flags.push(
          flag(
            "large-change-explained",
            `Large movement to ${record.id} is explained.`,
            record.id,
            entry.previousRecordId
          )
        );
      } else {
        flags.push(
          flag(
            "large-change-unexplained",
            `Large movement to ${record.id} is unexplained.`,
            record.id,
            entry.previousRecordId
          )
        );
      }
    }
  }

  return Object.freeze(flags);
}

export function countExplainedMovements(
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): { explained: number; unexplained: number; large: number } {
  let explained = 0;
  let unexplained = 0;
  let large = 0;

  for (const entry of deltas) {
    const record = records.find((candidate) => candidate.id === entry.recordId);
    if (!record) {
      continue;
    }
    if (isExplainedRecord(record.reason, record.evidenceReferences)) {
      explained += 1;
    } else {
      unexplained += 1;
    }
    if (isLargeMovement(entry.delta)) {
      large += 1;
    }
  }

  return { explained, unexplained, large };
}

export const ConfidenceEvolutionExplanationFlags = Object.freeze({
  detectConfidenceExplanationFlags,
  countExplainedMovements,
});
