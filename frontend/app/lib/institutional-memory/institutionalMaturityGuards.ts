import type {
  EvolutionTrend,
  InstitutionalMaturityLevel,
  InstitutionalMaturitySnapshot,
  MaturityCategory,
} from "./institutionalMaturityTypes";

export const INSTITUTIONAL_MATURITY_MAX_SNAPSHOTS = 20;
export const INSTITUTIONAL_MATURITY_MAX_EVOLUTIONS = 12;
export const INSTITUTIONAL_MATURITY_MAX_SIGNALS = 16;
export const INSTITUTIONAL_MATURITY_MAX_TRENDS = 8;
export const INSTITUTIONAL_MATURITY_MAX_PROGRESS = 12;
export const INSTITUTIONAL_MATURITY_MAX_OBSERVATIONS = 12;
export const INSTITUTIONAL_MATURITY_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_MATURITY_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_MATURITY_MIN_CONFIDENCE = 0.45;
export const INSTITUTIONAL_MATURITY_MIN_EVIDENCE_DEPTH = 4;

const lastEvalAtByOrg = new Map<string, number>();
let maturityDepth = 0;

const VALID_MATURITY = new Set<InstitutionalMaturityLevel>([
  "reactive",
  "unstable",
  "adaptive",
  "resilient",
  "strategically_mature",
]);

const VALID_TRENDS = new Set<EvolutionTrend>([
  "stagnant",
  "inconsistent",
  "improving",
  "accelerating",
  "regressing",
]);

const VALID_CATEGORIES = new Set<MaturityCategory>([
  "resilience",
  "governance",
  "coordination",
  "operational",
  "recovery",
  "fragility",
  "strategic",
  "unknown",
]);

export function beginInstitutionalMaturityEvaluation(): boolean {
  if (maturityDepth >= INSTITUTIONAL_MATURITY_MAX_RECURSION_DEPTH) return false;
  maturityDepth += 1;
  return true;
}

export function endInstitutionalMaturityEvaluation(): void {
  maturityDepth = Math.max(0, maturityDepth - 1);
}

export function shouldEvaluateInstitutionalMaturity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_MATURITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateMaturitySnapshot(
  snapshot: InstitutionalMaturitySnapshot | null | undefined
): snapshot is InstitutionalMaturitySnapshot {
  if (!snapshot) return false;
  if (!snapshot.maturitySnapshotId.trim() || !snapshot.summary.trim()) return false;
  if (!VALID_MATURITY.has(snapshot.maturityLevel)) return false;
  if (!VALID_TRENDS.has(snapshot.evolutionTrend)) return false;
  if (!VALID_CATEGORIES.has(snapshot.category)) return false;
  if (snapshot.confidence < INSTITUTIONAL_MATURITY_MIN_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function maturityRank(level: InstitutionalMaturityLevel): number {
  const ranks: Record<InstitutionalMaturityLevel, number> = {
    reactive: 1,
    unstable: 2,
    adaptive: 3,
    resilient: 4,
    strategically_mature: 5,
  };
  return ranks[level];
}

export function trendRank(trend: EvolutionTrend): number {
  const ranks: Record<EvolutionTrend, number> = {
    regressing: 1,
    stagnant: 2,
    inconsistent: 3,
    improving: 4,
    accelerating: 5,
  };
  return ranks[trend];
}

export function shouldRetainMaturitySnapshot(
  snapshot: InstitutionalMaturitySnapshot,
  evidenceDepth: number
): boolean {
  if (!validateMaturitySnapshot(snapshot)) return false;
  if (snapshot.maturityLevel === "strategically_mature" && evidenceDepth < 6) return false;
  if (snapshot.maturityLevel === "resilient" && evidenceDepth < 5) return false;
  if (snapshot.evolutionTrend === "accelerating" && evidenceDepth < 5) return false;
  if (snapshot.observations.length === 0 && snapshot.confidence < 0.7) return false;
  return true;
}

export function shouldAllowMaturityInflation(
  proposed: InstitutionalMaturityLevel,
  prior: InstitutionalMaturityLevel | null,
  evidenceDepth: number
): boolean {
  if (!prior) return true;
  const jump = maturityRank(proposed) - maturityRank(prior);
  if (jump > 1 && evidenceDepth < 5) return false;
  if (jump > 2) return false;
  return true;
}

export function resetInstitutionalMaturityGuards(): void {
  lastEvalAtByOrg.clear();
  maturityDepth = 0;
}
