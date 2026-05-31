/**
 * E2:83 — Upstream idempotency for runtime writes during idle/stable states.
 */

import { isIdleRuntimeLocked } from "./idleRuntimeStabilityGuard";

const lastSignatureByDomain = new Map<string, string>();

export function shouldProceedRuntimeWrite(domain: string, signature: string): boolean {
  const previous = lastSignatureByDomain.get(domain);
  if (previous === signature) {
    return false;
  }
  lastSignatureByDomain.set(domain, signature);
  return true;
}

export function shouldProceedRuntimeWriteDuringIdle(domain: string, signature: string): boolean {
  const previous = lastSignatureByDomain.get(domain);
  if (previous === signature) {
    return false;
  }
  if (isIdleRuntimeLocked() && previous != null) {
    return false;
  }
  lastSignatureByDomain.set(domain, signature);
  return true;
}

export function getLastRuntimeWriteSignature(domain: string): string | null {
  return lastSignatureByDomain.get(domain) ?? null;
}

export function resetIdleRuntimeWriteGuardForTests(): void {
  lastSignatureByDomain.clear();
}
