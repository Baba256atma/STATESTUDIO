import type {
  DependencyStrength,
  OperationalCausalChain,
  PropagationType,
} from "./causalDependencyTypes";

export const CAUSAL_DEPENDENCY_MAX_CHAINS = 14;
export const CAUSAL_DEPENDENCY_MAX_LINKS = 24;
export const CAUSAL_DEPENDENCY_MAX_SNAPSHOTS = 8;
export const CAUSAL_DEPENDENCY_MAX_SIGNALS = 10;
export const CAUSAL_DEPENDENCY_MAX_IMPACT = 10;
export const CAUSAL_DEPENDENCY_MAX_SEQUENCES = 10;
export const CAUSAL_DEPENDENCY_MIN_EVAL_INTERVAL_MS = 500;
export const CAUSAL_DEPENDENCY_MAX_RECURSION_DEPTH = 2;
export const CAUSAL_DEPENDENCY_MIN_CONFIDENCE = 0.45;
export const CAUSAL_DEPENDENCY_MAX_CHAIN_LENGTH = 6;

const lastEvalAtByOrg = new Map<string, number>();
let causalDepth = 0;

const VALID_STRENGTH = new Set<DependencyStrength>([
  "weak",
  "moderate",
  "strong",
  "systemic",
]);

const VALID_PROPAGATION = new Set<PropagationType>([
  "localized",
  "distributed",
  "cascading",
  "cyclical",
]);

export function beginCausalDependencyEvaluation(): boolean {
  if (causalDepth >= CAUSAL_DEPENDENCY_MAX_RECURSION_DEPTH) return false;
  causalDepth += 1;
  return true;
}

export function endCausalDependencyEvaluation(): void {
  causalDepth = Math.max(0, causalDepth - 1);
}

export function shouldEvaluateCausalDependencies(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CAUSAL_DEPENDENCY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateCausalChain(
  chain: OperationalCausalChain | null | undefined
): chain is OperationalCausalChain {
  if (!chain) return false;
  if (!chain.causalChainId.trim() || !chain.summary.trim()) return false;
  if (!VALID_STRENGTH.has(chain.dependencyStrength)) return false;
  if (!VALID_PROPAGATION.has(chain.propagationType)) return false;
  if (chain.confidence < CAUSAL_DEPENDENCY_MIN_CONFIDENCE) return false;
  if (chain.chain.length === 0) return false;
  if (chain.chain.length > CAUSAL_DEPENDENCY_MAX_CHAIN_LENGTH) return false;
  return Number.isFinite(chain.generatedAt);
}

export function shouldRetainCausalChain(chain: OperationalCausalChain): boolean {
  if (!validateCausalChain(chain)) return false;
  if (chain.propagationType === "localized" && chain.chain.length < 2) return false;
  if (chain.dependencyStrength === "weak" && chain.confidence < 0.6) return false;
  return true;
}

export function confidenceToLevel(confidence: number): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetCausalDependencyGuards(): void {
  lastEvalAtByOrg.clear();
  causalDepth = 0;
}
