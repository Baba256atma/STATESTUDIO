/**
 * APP-9:4 — Confidence movement event detection.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import { CONFIDENCE_EVOLUTION_TREND_RULES, clampConfidenceMetric } from "./confidenceEvolutionTrendRules.ts";
import type { ConfidenceDeltaPair, ConfidenceMovementEvent } from "./confidenceEvolutionTrendTypes.ts";

function buildMovementEvent(
  workspaceId: string,
  record: ConfidenceEvolutionEngineRecord,
  type: ConfidenceMovementEvent["type"],
  fromScore: number,
  toScore: number,
  delta: number,
  suffix: string
): ConfidenceMovementEvent {
  return Object.freeze({
    id: `confidence-movement-${workspaceId}-${type}-${suffix}`,
    workspaceId,
    recordId: record.id,
    type,
    fromScore,
    toScore,
    delta,
    occurredAt: record.updatedAt,
    confidence: clampConfidenceMetric(1),
    metadata: Object.freeze({ detection: "deterministic" }),
    readOnly: true as const,
  });
}

export function detectStepMovementEvents(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceMovementEvent[] {
  const events: ConfidenceMovementEvent[] = [];
  const threshold = CONFIDENCE_EVOLUTION_TREND_RULES.stableDeltaThreshold;

  for (const entry of deltas) {
    const record = records.find((candidate) => candidate.id === entry.recordId);
    if (!record) {
      continue;
    }
    let type: ConfidenceMovementEvent["type"];
    if (entry.delta > threshold) {
      type = "increase";
    } else if (entry.delta < -threshold) {
      type = "decrease";
    } else {
      type = "stable";
    }
    events.push(
      buildMovementEvent(
        workspaceId,
        record,
        type,
        entry.fromScore,
        entry.toScore,
        entry.delta,
        entry.recordId
      )
    );
  }

  return Object.freeze(events);
}

export function detectConfidencePeaks(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[]
): readonly ConfidenceMovementEvent[] {
  if (records.length < 3) {
    return Object.freeze([]);
  }

  const peaks: ConfidenceMovementEvent[] = [];
  for (let index = 1; index < records.length - 1; index += 1) {
    const previous = records[index - 1]!;
    const current = records[index]!;
    const next = records[index + 1]!;
    if (
      current.confidenceScore > previous.confidenceScore &&
      current.confidenceScore > next.confidenceScore
    ) {
      peaks.push(
        buildMovementEvent(
          workspaceId,
          current,
          "peak",
          previous.confidenceScore,
          current.confidenceScore,
          current.confidenceScore - previous.confidenceScore,
          `peak-${current.id}`
        )
      );
    }
  }

  return Object.freeze(peaks);
}

export function detectConfidenceDrops(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceMovementEvent[] {
  const drops: ConfidenceMovementEvent[] = [];
  const threshold = CONFIDENCE_EVOLUTION_TREND_RULES.dropDeltaThreshold;

  for (const entry of deltas) {
    if (entry.delta > threshold) {
      continue;
    }
    const record = records.find((candidate) => candidate.id === entry.recordId);
    if (!record) {
      continue;
    }
    drops.push(
      buildMovementEvent(
        workspaceId,
        record,
        "drop",
        entry.fromScore,
        entry.toScore,
        entry.delta,
        `drop-${entry.recordId}`
      )
    );
  }

  return Object.freeze(drops);
}

export function detectConfidenceRecoveries(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  deltas: readonly ConfidenceDeltaPair[]
): readonly ConfidenceMovementEvent[] {
  const recoveries: ConfidenceMovementEvent[] = [];
  const dropThreshold = CONFIDENCE_EVOLUTION_TREND_RULES.dropDeltaThreshold;

  for (let index = 0; index < deltas.length; index += 1) {
    const entry = deltas[index]!;
    if (entry.delta > dropThreshold) {
      continue;
    }
    const next = deltas[index + 1];
    if (!next || next.delta <= 0) {
      continue;
    }
    const record = records.find((candidate) => candidate.id === next.recordId);
    if (!record) {
      continue;
    }
    recoveries.push(
      buildMovementEvent(
        workspaceId,
        record,
        "recovery",
        entry.toScore,
        next.toScore,
        next.delta,
        `recovery-${next.recordId}`
      )
    );
  }

  return Object.freeze(recoveries);
}

export const ConfidenceEvolutionMovementDetection = Object.freeze({
  detectStepMovementEvents,
  detectConfidencePeaks,
  detectConfidenceDrops,
  detectConfidenceRecoveries,
});
