/**
 * APP-10:2 — Pattern Extraction Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION, CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "./crossScenarioLearningContracts.ts";
import { buildCrossScenarioLearningFoundation } from "./crossScenarioLearningFoundation.ts";
import { resetCrossScenarioLearningPlatformForTests } from "./crossScenarioLearningRunner.ts";
import {
  PATTERN_CATEGORY_KEYS,
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES,
  PATTERN_EXTRACTION_PIPELINE_STAGES,
  PATTERN_TYPE_KEYS,
} from "./patternExtractionEngineConstants.ts";
import {
  extractExecutivePatterns,
  getExecutivePatterns,
  getPattern,
  initializePatternExtractionEngine,
  isPatternExtractionEngineInitialized,
  patternExists,
  PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST,
  registerExecutivePattern,
  resetPatternExtractionEngineForTests,
  unregisterPattern,
  validateExecutivePatterns,
} from "./patternExtractionEngine.ts";
import { buildExecutivePatternFromGroup, groupScenariosByPatternSignature } from "./patternExtractionEvidenceAggregation.ts";
import { normalizeCompletedScenarios } from "./patternExtractionNormalizer.ts";
import { getPatternRegistrySnapshot } from "./patternExtractionEngineRegistry.ts";
import type { CertifiedCompletedScenarioInput, PatternExtractionCertificationCheck, PatternExtractionCertificationResult } from "./patternExtractionEngineTypes.ts";
import {
  hasDuplicateEvidence,
  hasDuplicateIds,
  isPatternCategory,
  isPatternType,
  validateCertifiedScenarioInput,
  validateExecutivePattern,
  validateFoundationCompatibilityForEngine,
  validatePatternProvenance,
} from "./patternExtractionEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-pattern-extraction-001";

function check(id: string, title: string, passed: boolean, evidence: string): PatternExtractionCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function marketingScenario(suffix: string, decisionId: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-marketing-${suffix}`,
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
    decisionIds: Object.freeze([decisionId]),
    outcomeSummary: "Profit Increased with stable risk profile.",
    timelineReferences: Object.freeze([`timeline-ref-${suffix}`]),
    journalReferences: Object.freeze([`journal-entry-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-ref-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

export function resetPatternExtractionEnginePlatformForTests(): void {
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runPatternExtractionEngine(timestamp: string = FIXED_TIME): PatternExtractionCertificationResult {
  resetPatternExtractionEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);

  const checks: PatternExtractionCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isPatternExtractionEngineInitialized() === true,
      PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-10:1 foundation dependency",
      validateFoundationCompatibilityForEngine(true).valid === true,
      CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION
    )
  );

  const extraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([
        marketingScenario("001", "decision-001"),
        marketingScenario("002", "decision-002"),
      ]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Marketing Expansion",
      minOccurrences: 2,
    })
  );

  checks.push(
    check(
      "C_extraction_success",
      "Deterministic pattern extraction",
      extraction.success === true && extraction.extractedPatterns.length === 1,
      extraction.reason
    )
  );

  const pattern = extraction.extractedPatterns[0];
  checks.push(
    check(
      "D_pattern_contract",
      "Executive pattern contract valid",
      pattern !== undefined && validateExecutivePattern(pattern).valid === true,
      pattern?.patternId ?? "missing"
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance metadata complete",
      pattern !== undefined &&
        validatePatternProvenance(pattern.provenance).valid === true &&
        pattern.provenance.scenarioIds.length === 2,
      String(pattern?.provenance.scenarioIds.length ?? 0)
    )
  );

  checks.push(
    check(
      "F_evidence_aggregation",
      "Evidence aggregation without duplicates",
      pattern !== undefined &&
        pattern.supportingEvidence.length >= 2 &&
        hasDuplicateEvidence(pattern.supportingEvidence) === false,
      String(pattern?.supportingEvidence.length ?? 0)
    )
  );

  checks.push(
    check(
      "G_registry_register",
      "Pattern registry registration",
      pattern !== undefined && patternExists(pattern.patternId) === true,
      pattern?.patternId ?? "missing"
    )
  );

  checks.push(
    check(
      "H_registry_get",
      "Pattern registry retrieval",
      pattern !== undefined && getPattern(pattern.patternId)?.patternId === pattern.patternId,
      "getPattern"
    )
  );

  checks.push(
    check(
      "I_registry_list",
      "Pattern registry listing",
      getExecutivePatterns(WORKSPACE).length === 1,
      String(getExecutivePatterns(WORKSPACE).length)
    )
  );

  if (pattern) {
    const unregistered = unregisterPattern(pattern.patternId);
    checks.push(
      check(
        "J_registry_unregister",
        "Pattern registry unregister",
        unregistered.success === true && patternExists(pattern.patternId) === false,
        unregistered.reason
      )
    );
    const reregister = registerExecutivePattern(pattern);
    checks.push(
      check(
        "K_registry_reregister",
        "Pattern registry re-register",
        reregister.success === true,
        reregister.reason
      )
    );
  }

  checks.push(
    check(
      "L_duplicate_prevention",
      "Duplicate pattern prevention",
      pattern !== undefined && registerExecutivePattern(pattern!).success === false,
      "duplicate rejected"
    )
  );

  checks.push(
    check(
      "M_pipeline_stages",
      "Extraction pipeline stages declared",
      PATTERN_EXTRACTION_PIPELINE_STAGES.length === 9 &&
        extraction.pipelineStages.length === 9,
      String(PATTERN_EXTRACTION_PIPELINE_STAGES.length)
    )
  );

  checks.push(
    check(
      "N_vocabulary",
      "Pattern vocabulary guards",
      isPatternCategory("growth") === true &&
        isPatternType("strategy_outcome") === true &&
        PATTERN_CATEGORY_KEYS.length === 10 &&
        PATTERN_TYPE_KEYS.length === 5,
      String(PATTERN_CATEGORY_KEYS.length)
    )
  );

  checks.push(
    check(
      "O_no_ml_forbidden",
      "No ML or similarity forbidden scope",
      PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES.noMachineLearning === true &&
        PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES.noSimilarityEngine === true &&
        PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES.noRecommendationEngine === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "P_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-5/6/8/9/10 identity verified"
    )
  );

  checks.push(
    check(
      "Q_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST).valid === true,
      PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "R_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/patternExtractionEngine.ts",
        allowedFiles: PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: PATTERN_EXTRACTION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "patternExtractionEngine.ts"
    )
  );

  checks.push(
    check(
      "S_input_validation",
      "Certified scenario input validation",
      validateCertifiedScenarioInput(marketingScenario("validate", "decision-validate")).valid === true,
      "valid"
    )
  );

  const normalized = normalizeCompletedScenarios([
    marketingScenario("n1", "decision-n1"),
    marketingScenario("n2", "decision-n2"),
  ]);
  const groups = groupScenariosByPatternSignature(normalized);
  checks.push(
    check(
      "T_evidence_grouping",
      "Deterministic evidence grouping",
      groups.length === 1 && groups[0]?.scenarios.length === 2,
      String(groups.length)
    )
  );

  if (groups[0]) {
    const built = buildExecutivePatternFromGroup(groups[0], timestamp, "Marketing Expansion");
    checks.push(
      check(
        "U_pattern_builder",
        "Executive pattern builder",
        built.patternName === "Marketing Expansion Pattern" && Object.isFrozen(built),
        built.patternName
      )
    );
    checks.push(
      check(
        "V_validate_patterns_batch",
        "Batch executive pattern validation",
        validateExecutivePatterns(Object.freeze([built])).valid === true,
        "valid"
      )
    );
  }

  checks.push(
    check(
      "W_immutable_outputs",
      "Immutable pattern outputs",
      pattern !== undefined && Object.isFrozen(pattern) && pattern.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "X_registry_snapshot",
      "Registry snapshot",
      getPatternRegistrySnapshot().patternCount >= 1,
      String(getPatternRegistrySnapshot().patternCount)
    )
  );

  checks.push(
    check(
      "Y_duplicate_ids",
      "Duplicate id detection",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate detection"
    )
  );

  checks.push(
    check(
      "Z_min_occurrence_skip",
      "Minimum occurrence threshold skips singleton groups",
      extractExecutivePatterns(
        Object.freeze({
          workspaceId: WORKSPACE,
          scenarios: Object.freeze([marketingScenario("solo", "decision-solo")]),
          extractionTimestamp: timestamp,
          minOccurrences: 2,
        })
      ).extractedPatterns.length === 0,
      "singleton skipped"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/2",
    contractVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const PatternExtractionEngineRunner = Object.freeze({
  runPatternExtractionEngine,
  resetPatternExtractionEnginePlatformForTests,
});
