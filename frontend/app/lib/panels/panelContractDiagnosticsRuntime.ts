/**
 * E2:80 — Defer panel contract diagnostics out of render/memo path.
 * Validation stays synchronous; logs flush on microtask with permanent signature dedupe.
 */

import { traceRuntimeContract } from "../debug/runtimeLoopTrace";
import { devLogOncePermanent } from "../runtime/diagnosticIdleGate";
import { recordRuntimeCycleEvent } from "../runtime/runtimeCycleDetector";
import { isIdleRuntimeLocked } from "../runtime/idleRuntimeStabilityGuard";
import { shouldProceedRuntimeWrite } from "../runtime/idleRuntimeWriteGuard";
import { traceSalvageIgnoredAuthority } from "../runtime/fallbackAuthorityDiagnostics";
import { recordContractSalvageRun } from "./panelContractStability";

export type PanelContractSalvageDiagnosticPayload = {
  signature: string;
  contractSignature: string;
  payload: Record<string, unknown>;
  previousContractSignature: string | null;
  repeatedSalvage: boolean;
};

const emittedSalvageSignatures = new Set<string>();
const emittedContractDiagnosticKeys = new Set<string>();
const pendingSalvageDiagnostics = new Map<string, PanelContractSalvageDiagnosticPayload>();
let flushScheduled = false;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function shouldEmitContractDiagnostic(action: string, contractSignature: string): boolean {
  const key = `${action}:${contractSignature}`;
  if (emittedContractDiagnosticKeys.has(key)) return false;
  emittedContractDiagnosticKeys.add(key);
  return true;
}

function stableJson(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableJson(entry)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
    .join(",")}}`;
}

function buildSalvageDiagnosticKey(diagnostic: PanelContractSalvageDiagnosticPayload): string {
  return stableJson({
    contractSignature: diagnostic.contractSignature,
    payload: diagnostic.payload,
  });
}

export function hasEmittedPanelContractSalvage(signature: string): boolean {
  return emittedSalvageSignatures.has(signature);
}

export function queuePanelContractSalvageDiagnostic(
  diagnostic: PanelContractSalvageDiagnosticPayload
): void {
  if (!isDev()) return;
  const diagnosticKey = buildSalvageDiagnosticKey(diagnostic);
  if (
    emittedSalvageSignatures.has(diagnostic.signature) ||
    emittedSalvageSignatures.has(diagnostic.contractSignature) ||
    emittedSalvageSignatures.has(diagnosticKey)
  ) {
    return;
  }
  if (
    isIdleRuntimeLocked() &&
    !shouldProceedRuntimeWrite("panel-contract-salvage", diagnostic.contractSignature)
  ) {
    return;
  }
  if (pendingSalvageDiagnostics.has(diagnosticKey)) return;
  pendingSalvageDiagnostics.set(diagnosticKey, diagnostic);
  schedulePanelContractDiagnosticFlush();
}

function schedulePanelContractDiagnosticFlush(): void {
  if (flushScheduled) return;
  flushScheduled = true;
  queueMicrotask(() => {
    flushScheduled = false;
    flushPanelContractDiagnostics();
  });
}

export function flushPanelContractDiagnostics(): void {
  if (!isDev()) {
    pendingSalvageDiagnostics.clear();
    return;
  }
  for (const [diagnosticKey, diagnostic] of pendingSalvageDiagnostics) {
    const contractSignature = diagnostic.contractSignature;
    if (
      emittedSalvageSignatures.has(diagnostic.signature) ||
      emittedSalvageSignatures.has(contractSignature) ||
      emittedSalvageSignatures.has(diagnosticKey)
    ) {
      pendingSalvageDiagnostics.delete(diagnosticKey);
      continue;
    }
    emittedSalvageSignatures.add(diagnostic.signature);
    emittedSalvageSignatures.add(contractSignature);
    emittedSalvageSignatures.add(diagnosticKey);
    pendingSalvageDiagnostics.delete(diagnosticKey);
    recordContractSalvageRun();
    recordRuntimeCycleEvent("PanelSalvage", {
      signature: contractSignature,
      source: "validatePanelSharedDataWithDiagnostics",
    });
    devLogOncePermanent("[Nexora][PanelContractSalvaged]", diagnosticKey, {
      signature: diagnosticKey,
      rootSignature: diagnostic.signature,
      contractSignature: diagnostic.contractSignature,
      ...diagnostic.payload,
    }, "warn");
    if (shouldEmitContractDiagnostic("contract_salvaged", contractSignature)) {
      traceRuntimeContract({
        source: "validatePanelSharedDataWithDiagnostics",
        action: "contract_salvaged",
        contractSignature: diagnostic.contractSignature,
        previousContractSignature: diagnostic.previousContractSignature,
        salvageReason: "schema_repair",
        repeatedSalvage: diagnostic.repeatedSalvage,
        detail: diagnostic.payload,
      });
    }
    traceSalvageIgnoredAuthority({
      signature: diagnostic.signature,
      source: "panel_salvage",
      reason: "repair_contract_only",
    });
  }
}

export function resetPanelContractDiagnosticsForTests(): void {
  emittedSalvageSignatures.clear();
  emittedContractDiagnosticKeys.clear();
  pendingSalvageDiagnostics.clear();
  flushScheduled = false;
}
