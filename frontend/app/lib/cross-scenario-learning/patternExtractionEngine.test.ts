import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "./crossScenarioLearningContracts.ts";
import { buildCrossScenarioLearningFoundation } from "./crossScenarioLearningFoundation.ts";
import { resetCrossScenarioLearningPlatformForTests } from "./crossScenarioLearningRunner.ts";
import {
  PATTERN_CATEGORY_KEYS,
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_PIPELINE_STAGES,
} from "./patternExtractionEngineConstants.ts";
import {
  extractExecutivePatterns,
  getExecutivePatterns,
  getPattern,
  initializePatternExtractionEngine,
  patternExists,
  PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST,
  registerExecutivePattern,
  resetPatternExtractionEngineForTests,
  unregisterPattern,
  validateExecutivePattern,
  validateExecutivePatterns,
} from "./patternExtractionEngine.ts";
import { aggregatePatternEvidence, groupScenariosByPatternSignature } from "./patternExtractionEvidenceAggregation.ts";
import { normalizeCompletedScenario } from "./patternExtractionNormalizer.ts";
import { runPatternExtractionEngine, resetPatternExtractionEnginePlatformForTests } from "./patternExtractionEngineRunner.ts";
import type { CertifiedCompletedScenarioInput } from "./patternExtractionEngineTypes.ts";
import {
  hasDuplicateEvidence,
  isPatternCategory,
  validateCertifiedScenarioInput,
  validatePatternProvenance,
} from "./patternExtractionEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function marketingScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-${suffix}`,
    workspaceId: WORKSPACE,
    scenarioTitle: `Marketing Expansion ${suffix}`,
    patternCategory: "growth",
    patternType: "strategy_outcome",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Increased",
      "Profit Increased",
      "Risk Stable",
    ]),
    decisionIds: Object.freeze([`decision-${suffix}`]),
    outcomeSummary: "Profit Increased with stable risk profile.",
    timelineReferences: Object.freeze([`timeline-${suffix}`]),
    journalReferences: Object.freeze([`journal-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

test.beforeEach(() => {
  resetPatternExtractionEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/patternExtractionEngine.ts",
    allowedFiles: PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("extracts marketing expansion pattern from repeated completed scenarios", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      patternNamePrefix: "Marketing Expansion",
      minOccurrences: 2,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.extractedPatterns.length, 1);
  const pattern = result.extractedPatterns[0];
  assert.ok(pattern);
  assert.equal(pattern.patternName, "Marketing Expansion Pattern");
  assert.equal(pattern.patternCategory, "growth");
  assert.equal(pattern.sourceScenarioIds.length, 2);
  assert.equal(pattern.readOnly, true);
  assert.equal(Object.isFrozen(pattern), true);
});

test("validates executive pattern contract and provenance", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  const pattern = result.extractedPatterns[0];
  assert.ok(pattern);
  assert.equal(validateExecutivePattern(pattern).valid, true);
  assert.equal(validatePatternProvenance(pattern.provenance).valid, true);
  assert.equal(pattern.provenance.foundationVersion, "APP-10/1");
  assert.equal(pattern.version, "APP-10/2");
});

test("aggregates evidence without duplicates", () => {
  const normalized = normalizeCompletedScenario(marketingScenario("001"));
  const group = groupScenariosByPatternSignature(Object.freeze([normalized, normalizeCompletedScenario(marketingScenario("002"))]))[0];
  assert.ok(group);
  const summary = aggregatePatternEvidence(group);
  assert.equal(summary.contributingScenarios.length, 2);
  const pattern = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  ).extractedPatterns[0];
  assert.ok(pattern);
  assert.equal(hasDuplicateEvidence(pattern.supportingEvidence), false);
  assert.ok(pattern.supportingEvidence.length >= 2);
});

test("registers retrieves and unregisters patterns", () => {
  extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  const patterns = getExecutivePatterns(WORKSPACE);
  assert.equal(patterns.length, 1);
  const patternId = patterns[0]!.patternId;
  assert.equal(patternExists(patternId), true);
  assert.ok(getPattern(patternId));
  const removed = unregisterPattern(patternId);
  assert.equal(removed.success, true);
  assert.equal(patternExists(patternId), false);
});

test("rejects duplicate pattern registration", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  const pattern = result.extractedPatterns[0];
  assert.ok(pattern);
  const duplicate = registerExecutivePattern(pattern);
  assert.equal(duplicate.success, false);
});

test("skips singleton groups below minimum occurrence threshold", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("solo")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  assert.equal(result.success, true);
  assert.equal(result.extractedPatterns.length, 0);
  assert.equal(result.skippedGroups, 1);
});

test("rejects invalid certified scenario input", () => {
  const validation = validateCertifiedScenarioInput(
    Object.freeze({
      ...marketingScenario("bad"),
      sourceApps: Object.freeze(["APP-99"]),
    })
  );
  assert.equal(validation.valid, false);
});

test("rejects workspace mismatch during extraction", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([
        Object.freeze({ ...marketingScenario("001"), workspaceId: "ws-other" }),
        marketingScenario("002"),
      ]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-10:1 foundation before extraction", () => {
  resetCrossScenarioLearningPlatformForTests();
  resetPatternExtractionEngineForTests();
  initializePatternExtractionEngine(FIXED_TIME);
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation/);
});

test("validates batch executive patterns", () => {
  const result = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingScenario("001"), marketingScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      minOccurrences: 2,
    })
  );
  assert.equal(validateExecutivePatterns(result.extractedPatterns).valid, true);
});

test("exports pattern categories and pipeline stages", () => {
  assert.equal(PATTERN_CATEGORY_KEYS.length, 10);
  assert.equal(isPatternCategory("financial"), true);
  assert.equal(PATTERN_EXTRACTION_PIPELINE_STAGES.length, 9);
  assert.equal(PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION, "APP-10/2");
});

test("regression: APP-9 and APP-10:1 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs pattern extraction engine certification", () => {
  const result = runPatternExtractionEngine(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 25);
  assert.equal(result.phase, "APP-10/2");
});
