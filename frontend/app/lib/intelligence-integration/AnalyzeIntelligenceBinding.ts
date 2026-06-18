import { buildAnalyzeIntelligenceProfile } from "./AnalyzeIntelligenceProfile.ts";
import { buildExecutiveIntelligenceAdapterRegistry } from "./ExecutiveIntelligenceAdapter.ts";
import {
  resolveAnalyzeIntelligenceBinding as resolveCanonicalAnalyzeIntelligenceBinding,
  resetAnalyzeIntelligenceBindingForTests as resetCanonicalAnalyzeIntelligenceBindingForTests,
  getAnalyzeIntelligenceBindingResult as getCanonicalAnalyzeIntelligenceBindingResult,
} from "../intelligence/AnalyzeIntelligenceBinding.ts";
import {
  EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT,
  type AnalyzeIntelligenceBindingBuildInput,
  type AnalyzeIntelligenceBindingResult,
} from "./analyzeIntelligenceBindingContract.ts";

let latestAnalyzeIntelligenceBindingResult: AnalyzeIntelligenceBindingResult =
  EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;

function collectAdapterInput(input: AnalyzeIntelligenceBindingBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId ?? input.objectId,
  });
}

export function resolveAnalyzeIntelligenceBinding(
  input: AnalyzeIntelligenceBindingBuildInput
): AnalyzeIntelligenceBindingResult {
  const objectId = input.objectId?.trim() || input.selectedObjectId?.trim() || null;
  if (!objectId) {
    latestAnalyzeIntelligenceBindingResult = EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;
    return latestAnalyzeIntelligenceBindingResult;
  }

  const adapterInput = collectAdapterInput({ ...input, objectId });
  const adapterRegistry =
    input.adapterRegistry ?? buildExecutiveIntelligenceAdapterRegistry(adapterInput);
  const profile =
    input.profile ??
    buildAnalyzeIntelligenceProfile({
      ...adapterInput,
      adapterRegistry,
    });

  const binding = resolveCanonicalAnalyzeIntelligenceBinding({
    ...input,
    objectId,
    profile: profile as Parameters<typeof resolveCanonicalAnalyzeIntelligenceBinding>[0]["profile"],
  });

  const result = Object.freeze({
    ...binding,
    profile: binding.bindingStatus === "bound" ? profile : null,
  }) as AnalyzeIntelligenceBindingResult;

  latestAnalyzeIntelligenceBindingResult = result;
  return result;
}

export function getAnalyzeIntelligenceBindingResult(): AnalyzeIntelligenceBindingResult {
  return latestAnalyzeIntelligenceBindingResult;
}

export function resetAnalyzeIntelligenceBindingForTests(): void {
  resetCanonicalAnalyzeIntelligenceBindingForTests();
  latestAnalyzeIntelligenceBindingResult = EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;
}

export const AnalyzeIntelligenceBinding = Object.freeze({
  resolveAnalyzeIntelligenceBinding,
  getAnalyzeIntelligenceBindingResult,
  resetAnalyzeIntelligenceBindingForTests,
});
