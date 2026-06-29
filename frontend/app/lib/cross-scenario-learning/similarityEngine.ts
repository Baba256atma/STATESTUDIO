/**
 * APP-10:3 — Similarity Engine.
 * Deterministic scenario and pattern similarity comparison.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import { PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST, isPatternExtractionEngineInitialized } from "./patternExtractionEngine.ts";
import {
  compareScenarioSimilarityProfiles,
  compareScenarioToPatternProfiles,
} from "./similarityEngineComparison.ts";
import {
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_ENGINE_FORBIDDEN_PATTERNS,
  SIMILARITY_ENGINE_PUBLIC_API_RULES,
  SIMILARITY_ENGINE_TAGS,
  SIMILARITY_MANDATORY_RESULT_FIELDS,
} from "./similarityEngineConstants.ts";
import {
  clearSimilarityRegistryForTests,
  getSimilarityResult,
  getSimilarityResults,
  getSimilarityRegistrySnapshot,
  registerSimilarityResult,
  similarityResultExists,
} from "./similarityEngineRegistry.ts";
import type {
  ScenarioSimilarityComparisonResult,
  ScenarioSimilarityInput,
  SimilarityEngineState,
  SimilarityResult,
} from "./similarityEngineTypes.ts";
import {
  validateEngineDependencies,
  validateScenarioSimilarityInput,
  validateSimilarityResult,
} from "./similarityEngineValidation.ts";

export const SIMILARITY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...SIMILARITY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const SIMILARITY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/3",
  title: "Similarity Engine",
  goal: "Deterministic scenario-to-scenario and scenario-to-pattern similarity with explainable weighted scoring.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/similarityEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineScoring.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineComparison.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngine.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/similarityEngine.test.ts",
    "docs/app-10-3-similarity-engine.md",
  ]),
  forbiddenPatterns: SIMILARITY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1", "APP-10/2"]),
  runtimePath: "library-only" as const,
  tags: SIMILARITY_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeSimilarityEngine(timestamp: string = engineTimestamp): SimilarityEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getSimilarityEngineState(timestamp);
}

export function isSimilarityEngineInitialized(): boolean {
  return engineInitialized;
}

export function getSimilarityEngineState(timestamp: string = engineTimestamp): SimilarityEngineState {
  return Object.freeze({
    engineId: "similarity-engine",
    contractVersion: SIMILARITY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredResultCount: getSimilarityRegistrySnapshot().resultCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetSimilarityEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  clearSimilarityRegistryForTests();
}

function assertEngineReady(): ScenarioSimilarityComparisonResult | null {
  const dependencyValidation = validateEngineDependencies(
    isCrossScenarioLearningPlatformInitialized(),
    isPatternExtractionEngineInitialized()
  );
  if (!dependencyValidation.valid) {
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      queryScenarioId: "",
      workspaceId: "",
      scenarioResults: Object.freeze([]),
      patternResults: Object.freeze([]),
      comparedAt: engineTimestamp,
      readOnly: true as const,
    });
  }
  if (!isSimilarityEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Similarity Engine is not initialized.",
      queryScenarioId: "",
      workspaceId: "",
      scenarioResults: Object.freeze([]),
      patternResults: Object.freeze([]),
      comparedAt: engineTimestamp,
      readOnly: true as const,
    });
  }
  return null;
}

export function compareScenarioSimilarity(input: ScenarioSimilarityInput): ScenarioSimilarityComparisonResult {
  const readiness = assertEngineReady();
  if (readiness) {
    return Object.freeze({
      ...readiness,
      queryScenarioId: input.query.scenarioId,
      workspaceId: input.query.workspaceId,
      comparedAt: input.comparedAt ?? engineTimestamp,
    });
  }

  const inputValidation = validateScenarioSimilarityInput(input);
  if (!inputValidation.valid) {
    return Object.freeze({
      success: false,
      reason: inputValidation.issues.map((entry) => entry.message).join("; "),
      queryScenarioId: input.query.scenarioId,
      workspaceId: input.query.workspaceId,
      scenarioResults: Object.freeze([]),
      patternResults: Object.freeze([]),
      comparedAt: input.comparedAt ?? engineTimestamp,
      readOnly: true as const,
    });
  }

  const comparedAt = input.comparedAt ?? engineTimestamp;
  const minScore = input.minScore ?? 0;
  const scenarioResults = compareScenarioSimilarityProfiles(
    input.query,
    input.historicalScenarios,
    comparedAt,
    minScore
  );
  const patternResults = compareScenarioToPatternProfiles(input.query, input.patterns ?? Object.freeze([]), comparedAt, minScore);

  for (const result of [...scenarioResults, ...patternResults]) {
    registerSimilarityResult(result);
  }

  return Object.freeze({
    success: true,
    reason: `Compared query scenario against ${scenarioResults.length} scenario match(es) and ${patternResults.length} pattern match(es).`,
    queryScenarioId: input.query.scenarioId,
    workspaceId: input.query.workspaceId,
    scenarioResults,
    patternResults,
    comparedAt,
    readOnly: true as const,
  });
}

export function compareScenarioToPatterns(
  input: ScenarioSimilarityInput
): ScenarioSimilarityComparisonResult {
  return compareScenarioSimilarity(
    Object.freeze({
      ...input,
      historicalScenarios: Object.freeze([]),
    })
  );
}

export { validateSimilarityResult, validateScenarioSimilarityInput };
export { registerSimilarityResult, getSimilarityResult, getSimilarityResults, similarityResultExists };
export { runSimilarityEngineCertification } from "./similarityEngineRunner.ts";

export const SIMILARITY_ENGINE_VERSION = SIMILARITY_ENGINE_CONTRACT_VERSION;

export const SimilarityEngine = Object.freeze({
  initializeSimilarityEngine,
  isSimilarityEngineInitialized,
  getSimilarityEngineState,
  compareScenarioSimilarity,
  compareScenarioToPatterns,
  validateSimilarityResult,
  registerSimilarityResult,
  getSimilarityResults,
  getSimilarityResult,
  similarityResultExists,
  version: SIMILARITY_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: SIMILARITY_MANDATORY_RESULT_FIELDS,
  tags: SIMILARITY_ENGINE_TAGS,
  publicApiRules: SIMILARITY_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_ENGINE_TAGS,
  SIMILARITY_MANDATORY_RESULT_FIELDS,
  SIMILARITY_ENGINE_PUBLIC_API_RULES,
};
