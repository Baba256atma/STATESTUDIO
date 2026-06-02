/**
 * E2:80 — Defer panel contract diagnostics out of render/memo path.
 * Validation stays synchronous; logs flush on microtask with permanent signature dedupe.
 */

import { traceRuntimeContract } from "../debug/runtimeLoopTrace";
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

const emittedPanelSalvageSignatures = new Set<string>();
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

export function hasEmittedPanelContractSalvage(signature: string): boolean {
  return emittedPanelSalvageSignatures.has(signature);
}

export function queuePanelContractSalvageDiagnostic(
  diagnostic: PanelContractSalvageDiagnosticPayload
): void {
  if (!isDev()) return;
  const contractSignature = diagnostic.contractSignature;
  if (emittedPanelSalvageSignatures.has(contractSignature)) {
    return;
  }
  if (
    isIdleRuntimeLocked() &&
    !shouldProceedRuntimeWrite("panel-contract-salvage", contractSignature)
  ) {
    return;
  }
  if (pendingSalvageDiagnostics.has(contractSignature)) return;
  pendingSalvageDiagnostics.set(contractSignature, diagnostic);
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
  for (const [contractSignature, diagnostic] of pendingSalvageDiagnostics) {
    if (emittedPanelSalvageSignatures.has(contractSignature)) {
      pendingSalvageDiagnostics.delete(contractSignature);
      continue;
    }
    emittedPanelSalvageSignatures.add(contractSignature);
    pendingSalvageDiagnostics.delete(contractSignature);
    recordContractSalvageRun();
    recordRuntimeCycleEvent("PanelSalvage", {
      signature: contractSignature,
      source: "validatePanelSharedDataWithDiagnostics",
    });
    if (isDev()) {
      globalThis.console?.warn?.("[Nexora][PanelContractSalvaged]", {
        signature: contractSignature,
        rootSignature: diagnostic.signature,
        contractSignature: diagnostic.contractSignature,
        ...diagnostic.payload,
      });
    }
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

export function tracePanelContractDiagnosticOnce(
  action: string,
  contractSignature: string,
  emit: () => void
): void {
  if (!isDev()) return;
  if (!shouldEmitContractDiagnostic(action, contractSignature)) return;
  emit();
}

export function resetPanelContractDiagnosticsForTests(): void {
  emittedPanelSalvageSignatures.clear();
  emittedContractDiagnosticKeys.clear();
  pendingSalvageDiagnostics.clear();
  flushScheduled = false;
}
