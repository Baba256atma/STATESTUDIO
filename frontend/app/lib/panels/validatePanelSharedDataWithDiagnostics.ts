import type { PanelSharedData, PanelSharedDataValidationResult } from "./panelDataContract";
import {
  buildPanelValidationCacheKey,
  getPanelValidationCacheEntry,
  logPanelValidationCacheLookup,
} from "./panelValidationCache";
import { executePanelSharedDataValidation } from "./panelDataContract";

export type { PanelSharedDataValidationResult } from "./panelDataContract";
export { buildPanelValidationCacheKey, buildPanelValidationCacheShape } from "./panelValidationCache";

export function validatePanelSharedDataWithDiagnostics(
  input: unknown
): PanelSharedDataValidationResult {
  const cacheKey = buildPanelValidationCacheKey(input);
  const cached = getPanelValidationCacheEntry(cacheKey);
  logPanelValidationCacheLookup(cacheKey, cached != null);
  if (cached) {
    return cached as PanelSharedDataValidationResult;
  }
  return executePanelSharedDataValidation(input, cacheKey);
}

export function validatePanelSharedData(input: unknown): PanelSharedData {
  return validatePanelSharedDataWithDiagnostics(input).data;
}

export function validatePanelData(input: unknown): PanelSharedData {
  return validatePanelSharedData(input);
}
