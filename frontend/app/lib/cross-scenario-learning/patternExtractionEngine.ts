/**
 * APP-10:2 — Pattern Extraction Engine.
 * Deterministic executive pattern extraction from certified completed scenarios.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST } from "./crossScenarioLearningContracts.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import {
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_ENGINE_FORBIDDEN_PATTERNS,
  PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES,
  PATTERN_EXTRACTION_ENGINE_TAGS,
  PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS,
} from "./patternExtractionEngineConstants.ts";
import { extractExecutivePatterns } from "./patternExtractionPipeline.ts";
import {
  getPattern,
  getPatternRegistrySnapshot,
  getPatterns,
  patternExists,
  registerPattern,
  resetPatternExtractionEngineRegistryForTests,
  unregisterPattern,
} from "./patternExtractionEngineRegistry.ts";
import type {
  ExecutivePattern,
  PatternEngineResult,
  PatternExtractionEngineState,
  PatternExtractionRequest,
  PatternExtractionResult,
} from "./patternExtractionEngineTypes.ts";
import {
  validateExecutivePattern,
  validateFoundationCompatibilityForEngine,
} from "./patternExtractionEngineValidation.ts";

export const PATTERN_EXTRACTION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...PATTERN_EXTRACTION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/2",
  title: "Pattern Extraction Engine",
  goal: "Deterministic executive pattern extraction, evidence aggregation, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionNormalizer.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEvidenceAggregation.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionPipeline.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngine.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/patternExtractionEngine.test.ts",
    "docs/app-10-2-pattern-extraction-engine.md",
  ]),
  forbiddenPatterns: PATTERN_EXTRACTION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1"]),
  runtimePath: "library-only" as const,
  tags: PATTERN_EXTRACTION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializePatternExtractionEngine(
  timestamp: string = engineTimestamp
): PatternExtractionEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getPatternExtractionEngineState(timestamp);
}

export function isPatternExtractionEngineInitialized(): boolean {
  return engineInitialized;
}

export function getPatternExtractionEngineState(
  timestamp: string = engineTimestamp
): PatternExtractionEngineState {
  const registry = getPatternRegistrySnapshot();
  return Object.freeze({
    engineId: "pattern-extraction-engine",
    contractVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredPatternCount: registry.patternCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetPatternExtractionEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetPatternExtractionEngineRegistryForTests();
}

function assertEngineReady<T>(): PatternEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForEngine(isCrossScenarioLearningPlatformInitialized());
  if (!foundationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-10:1 Cross-Scenario Learning Foundation is not initialized.",
      data: null,
      error: Object.freeze({
        code: "foundation_incompatible",
        message: "Foundation not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isPatternExtractionEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Pattern Extraction Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "engine_not_initialized",
        message: "Engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  return null;
}

export function extractExecutivePatternsFromCertifiedScenarios(
  request: PatternExtractionRequest
): PatternExtractionResult {
  const readiness = assertEngineReady<PatternExtractionResult>();
  if (readiness) {
    return Object.freeze({
      success: false,
      reason: readiness.reason,
      workspaceId: request.workspaceId,
      extractedPatterns: Object.freeze([]),
      registeredPatternIds: Object.freeze([]),
      skippedGroups: 0,
      pipelineStages: Object.freeze([]),
      extractionTimestamp: request.extractionTimestamp ?? engineTimestamp,
      readOnly: true as const,
    });
  }
  return extractExecutivePatterns(request);
}

export function validateExecutivePatterns(
  patterns: readonly ExecutivePattern[]
): ReturnType<typeof validateExecutivePattern> {
  const issues = patterns.flatMap((pattern) => validateExecutivePattern(pattern).issues);
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function registerExecutivePattern(pattern: ExecutivePattern): PatternEngineResult<ExecutivePattern> {
  const readiness = assertEngineReady<ExecutivePattern>();
  if (readiness) {
    return readiness;
  }
  return registerPattern(pattern);
}

export function getExecutivePatterns(workspaceId?: string): readonly ExecutivePattern[] {
  return getPatterns(workspaceId);
}

export { extractExecutivePatternsFromCertifiedScenarios as extractExecutivePatterns };
export { registerPattern, unregisterPattern, getPattern, getPatterns, patternExists };
export { validateExecutivePattern, validateCertifiedScenarioInput } from "./patternExtractionEngineValidation.ts";
export { runPatternExtractionEngine } from "./patternExtractionEngineRunner.ts";

export const PATTERN_EXTRACTION_ENGINE_VERSION = PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;

export const PatternExtractionEngine = Object.freeze({
  initializePatternExtractionEngine,
  isPatternExtractionEngineInitialized,
  getPatternExtractionEngineState,
  extractExecutivePatterns: extractExecutivePatternsFromCertifiedScenarios,
  validateExecutivePatterns,
  registerExecutivePattern,
  getExecutivePatterns,
  registerPattern,
  unregisterPattern,
  getPattern,
  getPatterns,
  patternExists,
  version: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS,
  tags: PATTERN_EXTRACTION_ENGINE_TAGS,
  publicApiRules: PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_ENGINE_TAGS,
  PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS,
  PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES,
};
