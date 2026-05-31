/**
 * E2:79 — Skip salvage when contract output is already stable.
 */

import { recordSalvageRun, recordSalvageSkippedStable } from "../debug/startupNoiseAudit";

export type ContractStabilityInput = {
  contractSignature: string;
  salvagedOutputSignature: string;
  priorOutputSignature: string | null;
  preservedSlices?: Record<string, boolean>;
  priorPreservedSlices?: Record<string, boolean>;
};

const loggedStableSignatures = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function isMeaningfullyDifferentContract(input: ContractStabilityInput): boolean {
  if (!input.priorOutputSignature) return true;
  if (input.priorOutputSignature !== input.salvagedOutputSignature) return true;

  const prior = input.priorPreservedSlices ?? {};
  const next = input.preservedSlices ?? {};
  const keys = new Set([...Object.keys(prior), ...Object.keys(next)]);
  for (const key of keys) {
    if (prior[key] !== next[key]) return true;
  }

  return false;
}

export function traceContractAlreadyStable(signature: string): void {
  if (!isDev()) return;
  if (loggedStableSignatures.has(signature)) return;
  loggedStableSignatures.add(signature);
  recordSalvageSkippedStable();
  globalThis.console?.debug?.("[Nexora][ContractAlreadyStable]", { signature });
}

export function recordContractSalvageRun(): void {
  recordSalvageRun();
}

export function resetPanelContractStabilityForTests(): void {
  loggedStableSignatures.clear();
}
