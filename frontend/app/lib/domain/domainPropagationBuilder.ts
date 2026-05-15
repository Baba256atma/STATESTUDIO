import { buildDomainSignature, dedupeBySignature } from "./domainDedupe.ts";
import type { DomainTimelineFrame, DomainPropagationEvent } from "./domainTimelinePropagation.ts";

type PropagationType = DomainPropagationEvent["propagationType"];
type PropagationSeverity = DomainPropagationEvent["severity"];
type TimelinePropagationHint = {
  sourceObjectId: string;
  targetObjectId: string;
  propagationStrength: number;
  propagationType: PropagationType;
};

const MAX_FRAMES = 8;
const BASE_TIMESTAMP = 1_700_000_000_000;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function severityFromStrength(strength: number): PropagationSeverity {
  if (strength >= 0.86) return "critical";
  if (strength >= 0.68) return "high";
  if (strength >= 0.42) return "medium";
  return "low";
}

function normalizeType(value: unknown): PropagationType {
  const raw = String(value ?? "").toLowerCase();
  if (raw.includes("risk")) return "risk";
  if (raw.includes("delay")) return "delay";
  if (raw.includes("capacity")) return "capacity";
  if (raw.includes("confidence") || raw.includes("decision") || raw.includes("feedback")) return "confidence";
  return "dependency";
}

function objectIdSet(objects: unknown[]): Set<string> {
  return new Set(
    (Array.isArray(objects) ? objects : [])
      .map((object) => String(asRecord(object).id ?? "").trim())
      .filter(Boolean)
  );
}

function edgeId(sourceObjectId: string, targetObjectId: string, propagationType: string): string {
  return buildDomainSignature(["domain_propagation_edge", sourceObjectId, targetObjectId, propagationType]);
}

function eventId(sourceObjectId: string, targetObjectId: string, propagationType: string): string {
  return buildDomainSignature(["domain_propagation_event", sourceObjectId, targetObjectId, propagationType]);
}

function hintFromUnknown(value: unknown): TimelinePropagationHint | null {
  const record = asRecord(value);
  const sourceObjectId = String(record.sourceObjectId ?? record.from ?? record.source ?? "").trim();
  const targetObjectId = String(record.targetObjectId ?? record.to ?? record.target ?? "").trim();
  if (!sourceObjectId || !targetObjectId || sourceObjectId === targetObjectId) return null;
  return {
    sourceObjectId,
    targetObjectId,
    propagationType: normalizeType(record.propagationType ?? record.type),
    propagationStrength: clamp01(Number(record.propagationStrength ?? record.strength ?? record.weight ?? 0.5)),
  };
}

function hintsFromEdges(edges: unknown[]): TimelinePropagationHint[] {
  return (Array.isArray(edges) ? edges : [])
    .map((edge) => {
      const record = asRecord(edge);
      return hintFromUnknown({
        sourceObjectId: record.from,
        targetObjectId: record.to,
        propagationType: record.kind ?? record.relationshipType ?? asRecord(record.metadata).relationshipType,
        propagationStrength: record.weight,
      });
    })
    .filter((hint): hint is TimelinePropagationHint => Boolean(hint));
}

function riskBoostForTarget(targetObjectId: string, riskSignals: unknown[]): number {
  return (Array.isArray(riskSignals) ? riskSignals : []).reduce<number>((boost, signal) => {
    const record = asRecord(signal);
    const relatedObjectIds = Array.isArray(record.relatedObjectIds) ? record.relatedObjectIds.map(String) : [];
    if (!relatedObjectIds.includes(targetObjectId)) return boost;
    const severity = String(record.severity ?? "").toLowerCase();
    const severityBoost = severity === "critical" ? 0.2 : severity === "high" ? 0.14 : severity === "medium" ? 0.08 : 0.04;
    const confidenceBoost = typeof record.confidence === "number" ? clamp01(record.confidence) * 0.08 : 0;
    return Math.max(boost, severityBoost + confidenceBoost);
  }, 0);
}

export function buildDomainPropagationFrames(params: {
  objects: unknown[];
  edges?: unknown[];
  riskSignals?: unknown[];
  propagationHints?: unknown[];
}): DomainTimelineFrame[] {
  const validObjectIds = objectIdSet(params.objects);
  if (validObjectIds.size < 2) return [];

  const rawHints = [
    ...(Array.isArray(params.propagationHints) ? params.propagationHints.map(hintFromUnknown) : []),
    ...hintsFromEdges(params.edges ?? []),
  ].filter((hint): hint is TimelinePropagationHint => {
    return Boolean(hint && validObjectIds.has(hint.sourceObjectId) && validObjectIds.has(hint.targetObjectId));
  });

  const hints = dedupeBySignature(
    rawHints,
    (hint) => `${hint.sourceObjectId}|${hint.targetObjectId}|${hint.propagationType}`
  ).slice(0, MAX_FRAMES);

  return hints.map((hint, index) => {
    const strength = Number(
      clamp01(hint.propagationStrength + riskBoostForTarget(hint.targetObjectId, params.riskSignals ?? [])).toFixed(2)
    );
    const timestamp = BASE_TIMESTAMP + index * 1_000;
    const event: DomainPropagationEvent = {
      id: eventId(hint.sourceObjectId, hint.targetObjectId, hint.propagationType),
      sourceObjectId: hint.sourceObjectId,
      targetObjectId: hint.targetObjectId,
      propagationType: hint.propagationType,
      severity: severityFromStrength(strength),
      propagationStrength: strength,
      timestamp,
      estimatedDelayMs: index * 1_000,
      metadata: {
        stage: index + 1,
        deterministic: true,
      },
    };
    return {
      timestamp,
      activePropagationEvents: [event],
      highlightedObjectIds: [hint.sourceObjectId, hint.targetObjectId],
      highlightedEdgeIds: [edgeId(hint.sourceObjectId, hint.targetObjectId, hint.propagationType)],
    };
  });
}
