import type { StrategicConsensusRecord } from "./consensusIntelligenceTypes";

export const CONSENSUS_INTELLIGENCE_MAX_PERSPECTIVES = 12;
export const CONSENSUS_INTELLIGENCE_MAX_RECORDS = 10;
export const CONSENSUS_INTELLIGENCE_MAX_SNAPSHOTS = 8;
export const CONSENSUS_INTELLIGENCE_MAX_CONFLICTS = 10;
export const CONSENSUS_INTELLIGENCE_MAX_SIGNALS = 10;
export const CONSENSUS_INTELLIGENCE_MAX_ALIGNMENT_FIELDS = 8;
export const CONSENSUS_INTELLIGENCE_MIN_EVAL_INTERVAL_MS = 500;
export const CONSENSUS_INTELLIGENCE_MAX_RECURSION_DEPTH = 2;
export const CONSENSUS_INTELLIGENCE_MIN_CONFIDENCE = 0.48;
export const CONSENSUS_INTELLIGENCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const CONSENSUS_INTELLIGENCE_MIN_UNIFIED_LAYERS = 3;
export const CONSENSUS_INTELLIGENCE_MIN_REFLECTIVE_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let consensusDepth = 0;

export function beginConsensusIntelligenceEvaluation(): boolean {
  if (consensusDepth >= CONSENSUS_INTELLIGENCE_MAX_RECURSION_DEPTH) return false;
  consensusDepth += 1;
  return true;
}

export function endConsensusIntelligenceEvaluation(): void {
  consensusDepth = Math.max(0, consensusDepth - 1);
}

export function shouldEvaluateConsensusIntelligence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CONSENSUS_INTELLIGENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampConsensusConfidence(score: number): number {
  return Number(
    Math.min(
      CONSENSUS_INTELLIGENCE_MAX_INFLATED_CONFIDENCE,
      Math.max(CONSENSUS_INTELLIGENCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicConsensusRecord(
  record: StrategicConsensusRecord | null | undefined
): record is StrategicConsensusRecord {
  if (!record) return false;
  if (!record.consensusId.trim() || !record.summary.trim()) return false;
  if (record.confidence < CONSENSUS_INTELLIGENCE_MIN_CONFIDENCE) return false;
  if (record.confidence > CONSENSUS_INTELLIGENCE_MAX_INFLATED_CONFIDENCE) return false;
  if (record.consensusSignals.length < 1) return false;
  return Number.isFinite(record.generatedAt);
}

export function shouldRetainStrategicConsensusRecord(record: StrategicConsensusRecord): boolean {
  if (!validateStrategicConsensusRecord(record)) return false;
  if (record.consensusState === "aligned" && record.consensusStrength === "weak") return false;
  if (record.consensusState === "fragmented" && record.confidence > 0.9) return false;
  return true;
}

export function consensusStrengthRank(
  strength: StrategicConsensusRecord["consensusStrength"]
): number {
  const ranks: Record<StrategicConsensusRecord["consensusStrength"], number> = {
    weak: 1,
    partial: 2,
    moderate: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[strength];
}

export function consensusStateRank(state: StrategicConsensusRecord["consensusState"]): number {
  const ranks: Record<StrategicConsensusRecord["consensusState"], number> = {
    fragmented: 1,
    divergent: 2,
    negotiating: 3,
    converging: 4,
    aligned: 5,
  };
  return ranks[state];
}

export function resetConsensusIntelligenceGuards(): void {
  lastEvalAtByOrg.clear();
  consensusDepth = 0;
}
