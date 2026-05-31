/**
 * E2:79 — Startup noise audit summary (development diagnostics only).
 */

import { isStartupPhase, markStartupCompleted } from "../runtime/startupPhase";
import { shouldSuppressIdleDebugLog } from "../runtime/idleRuntimeStabilityGuard";

type StartupNoiseCounters = {
  parityRuns: number;
  paritySkipped: number;
  duplicateWritesPrevented: number;
  nullSelectionWritesPrevented: number;
  salvageRuns: number;
  salvageSkippedStable: number;
  hudDriftIgnored: number;
};

const counters: StartupNoiseCounters = {
  parityRuns: 0,
  paritySkipped: 0,
  duplicateWritesPrevented: 0,
  nullSelectionWritesPrevented: 0,
  salvageRuns: 0,
  salvageSkippedStable: 0,
  hudDriftIgnored: 0,
};

let auditScheduled = false;
let auditEmitted = false;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function recordParityRun(): void {
  if (!isDev()) return;
  counters.parityRuns += 1;
}

export function recordParitySkipped(): void {
  if (!isDev()) return;
  counters.paritySkipped += 1;
}

export function recordDuplicateWritePrevented(): void {
  if (!isDev()) return;
  counters.duplicateWritesPrevented += 1;
}

export function recordNullSelectionWritePrevented(): void {
  if (!isDev()) return;
  counters.nullSelectionWritesPrevented += 1;
}

export function recordSalvageRun(): void {
  if (!isDev()) return;
  counters.salvageRuns += 1;
}

export function recordSalvageSkippedStable(): void {
  if (!isDev()) return;
  counters.salvageSkippedStable += 1;
}

export function recordHudDriftIgnored(): void {
  if (!isDev()) return;
  counters.hudDriftIgnored += 1;
}

export function scheduleStartupNoiseAudit(delayMs = 5000): void {
  if (!isDev() || auditScheduled) return;
  auditScheduled = true;
  globalThis.setTimeout(() => {
    emitStartupNoiseAudit();
  }, delayMs);
}

export function emitStartupNoiseAudit(force = false): void {
  if (!isDev()) return;
  if (auditEmitted && !force) return;
  auditEmitted = true;
  if (isStartupPhase()) {
    markStartupCompleted();
  }
  if (shouldSuppressIdleDebugLog("[Nexora][StartupNoiseAudit]")) return;
  globalThis.console?.debug?.("[Nexora][StartupNoiseAudit]", { ...counters });
}

export function getStartupNoiseCountersForTests(): Readonly<StartupNoiseCounters> {
  return { ...counters };
}

export function resetStartupNoiseAuditForTests(): void {
  counters.parityRuns = 0;
  counters.paritySkipped = 0;
  counters.duplicateWritesPrevented = 0;
  counters.nullSelectionWritesPrevented = 0;
  counters.salvageRuns = 0;
  counters.salvageSkippedStable = 0;
  counters.hudDriftIgnored = 0;
  auditScheduled = false;
  auditEmitted = false;
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  scheduleStartupNoiseAudit();
  (window as unknown as { __NEXORA_STARTUP_NOISE_AUDIT__?: () => void }).__NEXORA_STARTUP_NOISE_AUDIT__ =
    () => emitStartupNoiseAudit(true);
}
