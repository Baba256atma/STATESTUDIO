/**
 * E2:75 — Lock fallback / authority reconciliation / parity churn when idle-stable.
 */

export type IdleRuntimeStabilityInput = {
  dashboardActive: boolean;
  authoritySignature: string;
  sceneSignature: string;
  selectedObjectId: string | null;
  contractValid: boolean;
};

let locked = false;
let lastSnapshot: IdleRuntimeStabilityInput | null = null;
let lastSemanticSignature: string | null = null;
let semanticSignatureChangedAt = Date.now();
let idleDebugLocked = false;
const emittedIdleDebugKeys = new Set<string>();

const IDLE_DEBUG_LOCK_MS = 10_000;

export function evaluateIdleRuntimeStability(input: IdleRuntimeStabilityInput): boolean {
  if (!input.dashboardActive || !input.contractValid) {
    locked = false;
    lastSnapshot = null;
    return false;
  }

  if (
    lastSnapshot &&
    lastSnapshot.authoritySignature === input.authoritySignature &&
    lastSnapshot.sceneSignature === input.sceneSignature &&
    lastSnapshot.selectedObjectId === input.selectedObjectId &&
    lastSnapshot.contractValid === input.contractValid &&
    lastSnapshot.dashboardActive === input.dashboardActive
  ) {
    locked = true;
    return true;
  }

  lastSnapshot = input;
  locked = false;
  return false;
}

export function isIdleRuntimeLocked(): boolean {
  return locked;
}

export function updateIdleRuntimeSemanticSignature(signature: string): void {
  if (lastSemanticSignature === signature) return;
  lastSemanticSignature = signature;
  semanticSignatureChangedAt = Date.now();
  idleDebugLocked = false;
  emittedIdleDebugKeys.clear();
}

export function isIdleRuntimeDebugLocked(): boolean {
  if (idleDebugLocked) return true;
  if (Date.now() - semanticSignatureChangedAt < IDLE_DEBUG_LOCK_MS) return false;
  idleDebugLocked = true;
  return true;
}

export function shouldSuppressIdleDebugLog(key: string): boolean {
  if (!isIdleRuntimeDebugLocked()) return false;
  emittedIdleDebugKeys.add(key);
  return true;
}

export function shouldBlockFallbackWhileIdle(): boolean {
  return locked;
}

export function shouldBlockAuthorityReconciliationWhileIdle(): boolean {
  return locked;
}

export function shouldBlockParityRegenerationWhileIdle(): boolean {
  return locked;
}

export function clearIdleRuntimeLock(): void {
  locked = false;
  lastSnapshot = null;
  lastSemanticSignature = null;
  semanticSignatureChangedAt = Date.now();
  idleDebugLocked = false;
  emittedIdleDebugKeys.clear();
}

export function resetIdleRuntimeStabilityGuardForTests(): void {
  clearIdleRuntimeLock();
}
