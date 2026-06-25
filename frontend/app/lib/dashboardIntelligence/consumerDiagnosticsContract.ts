/**
 * INT-1.1 — Consumer diagnostics contract.
 * Development diagnostics only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { DashboardIntelligenceRefreshTrigger } from "./dashboardIntelligenceContract.ts";
import {
  NEXORA_SINGLE_INTELLIGENCE_SOURCE_LOG_PREFIX,
  SINGLE_INTELLIGENCE_SOURCE_TAGS,
  type IntelligenceConsumerDiagnostics,
  type IntelligenceConsumerId,
} from "./singleIntelligenceSourceContract.ts";
import type { DashboardIntelligenceMode, DashboardIntelligencePanelId } from "./dashboardIntelligenceContract.ts";

const diagnosticsLog: IntelligenceConsumerDiagnostics[] = [];

export function recordIntelligenceConsumerDiagnostics(
  entry: IntelligenceConsumerDiagnostics
): IntelligenceConsumerDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("singleIntelligenceSource", NEXORA_SINGLE_INTELLIGENCE_SOURCE_LOG_PREFIX, {
      requestId: entry.requestId,
      consumer: entry.consumer,
      requestedMode: entry.requestedMode,
      requestedPanel: entry.requestedPanel,
      runtimeSelected: entry.runtimeSelected,
      normalizationCompleted: entry.normalizationCompleted,
      executionTimeMs: entry.executionTimeMs,
      refreshTrigger: entry.refreshTrigger,
      errorCode: entry.errorCode,
      rejectedDirectAccess: entry.rejectedDirectAccess,
      tags: SINGLE_INTELLIGENCE_SOURCE_TAGS,
      phase: "INT-1.1",
    });
  }
  return entry;
}

export function buildIntelligenceConsumerDiagnostics(input: {
  requestId: string;
  consumer: IntelligenceConsumerId;
  requestedMode: DashboardIntelligenceMode;
  requestedPanel: DashboardIntelligencePanelId;
  runtimeSelected: string | null;
  normalizationCompleted: boolean;
  executionTimeMs: number;
  refreshTrigger?: DashboardIntelligenceRefreshTrigger | null;
  errorCode?: string | null;
  rejectedDirectAccess?: boolean;
}): IntelligenceConsumerDiagnostics {
  return Object.freeze({
    requestId: input.requestId,
    consumer: input.consumer,
    requestedMode: input.requestedMode,
    requestedPanel: input.requestedPanel,
    runtimeSelected: input.runtimeSelected,
    normalizationCompleted: input.normalizationCompleted,
    executionTimeMs: input.executionTimeMs,
    refreshTrigger: input.refreshTrigger ?? null,
    errorCode: input.errorCode ?? null,
    rejectedDirectAccess: input.rejectedDirectAccess ?? false,
    generatedAt: new Date().toISOString(),
  });
}

export function getIntelligenceConsumerDiagnostics(): readonly IntelligenceConsumerDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function getLatestIntelligenceConsumerDiagnostics(
  consumer?: IntelligenceConsumerId
): IntelligenceConsumerDiagnostics | null {
  const entries = consumer
    ? diagnosticsLog.filter((entry) => entry.consumer === consumer)
    : diagnosticsLog;
  return entries.at(-1) ?? null;
}

export function resetIntelligenceConsumerDiagnosticsForTests(): void {
  diagnosticsLog.length = 0;
}
