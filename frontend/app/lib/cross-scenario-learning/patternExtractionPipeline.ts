/**
 * APP-10:2 — Pattern Extraction Engine deterministic pipeline.
 */

import { PATTERN_EXTRACTION_ENGINE_LIMITS, PATTERN_EXTRACTION_PIPELINE_STAGES } from "./patternExtractionEngineConstants.ts";
import { buildExecutivePatternFromGroup, groupScenariosByPatternSignature } from "./patternExtractionEvidenceAggregation.ts";
import { normalizeCompletedScenarios } from "./patternExtractionNormalizer.ts";
import { registerPattern } from "./patternExtractionEngineRegistry.ts";
import type {
  ExecutivePattern,
  PatternExtractionRequest,
  PatternExtractionResult,
} from "./patternExtractionEngineTypes.ts";
import { validateCertifiedScenarioInput, validateExecutivePattern } from "./patternExtractionEngineValidation.ts";

export function extractExecutivePatterns(request: PatternExtractionRequest): PatternExtractionResult {
  const extractionTimestamp = request.extractionTimestamp ?? new Date(0).toISOString();
  const minOccurrences = request.minOccurrences ?? PATTERN_EXTRACTION_ENGINE_LIMITS.minOccurrencesForExtraction;

  if (request.scenarios.length === 0) {
    return Object.freeze({
      success: false,
      reason: "No certified scenarios provided for extraction.",
      workspaceId: request.workspaceId,
      extractedPatterns: Object.freeze([]),
      registeredPatternIds: Object.freeze([]),
      skippedGroups: 0,
      pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
      extractionTimestamp,
      readOnly: true as const,
    });
  }

  if (request.scenarios.length > PATTERN_EXTRACTION_ENGINE_LIMITS.maxScenarioInputs) {
    return Object.freeze({
      success: false,
      reason: "Scenario input limit exceeded.",
      workspaceId: request.workspaceId,
      extractedPatterns: Object.freeze([]),
      registeredPatternIds: Object.freeze([]),
      skippedGroups: 0,
      pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
      extractionTimestamp,
      readOnly: true as const,
    });
  }

  for (const scenario of request.scenarios) {
    const validation = validateCertifiedScenarioInput(scenario);
    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: `Input validation failed for scenario ${scenario.scenarioId}: ${validation.issues.map((issue) => issue.message).join("; ")}`,
        workspaceId: request.workspaceId,
        extractedPatterns: Object.freeze([]),
        registeredPatternIds: Object.freeze([]),
        skippedGroups: 0,
        pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
        extractionTimestamp,
        readOnly: true as const,
      });
    }
    if (scenario.workspaceId !== request.workspaceId) {
      return Object.freeze({
        success: false,
        reason: `Workspace mismatch for scenario ${scenario.scenarioId}.`,
        workspaceId: request.workspaceId,
        extractedPatterns: Object.freeze([]),
        registeredPatternIds: Object.freeze([]),
        skippedGroups: 0,
        pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
        extractionTimestamp,
        readOnly: true as const,
      });
    }
  }

  const normalized = normalizeCompletedScenarios(request.scenarios);
  const groups = groupScenariosByPatternSignature(normalized);
  const extractedPatterns: ExecutivePattern[] = [];
  const registeredPatternIds: string[] = [];
  let skippedGroups = 0;

  for (const group of groups) {
    if (group.scenarios.length < minOccurrences) {
      skippedGroups += 1;
      continue;
    }

    const pattern = buildExecutivePatternFromGroup(group, extractionTimestamp, request.patternNamePrefix);
    const patternValidation = validateExecutivePattern(pattern);
    if (!patternValidation.valid) {
      return Object.freeze({
        success: false,
        reason: `Pattern validation failed: ${patternValidation.issues.map((issue) => issue.message).join("; ")}`,
        workspaceId: request.workspaceId,
        extractedPatterns: Object.freeze(extractedPatterns),
        registeredPatternIds: Object.freeze(registeredPatternIds),
        skippedGroups,
        pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
        extractionTimestamp,
        readOnly: true as const,
      });
    }

    const registration = registerPattern(pattern);
    if (!registration.success) {
      return Object.freeze({
        success: false,
        reason: registration.reason,
        workspaceId: request.workspaceId,
        extractedPatterns: Object.freeze(extractedPatterns),
        registeredPatternIds: Object.freeze(registeredPatternIds),
        skippedGroups,
        pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
        extractionTimestamp,
        readOnly: true as const,
      });
    }

    extractedPatterns.push(pattern);
    registeredPatternIds.push(pattern.patternId);
  }

  return Object.freeze({
    success: true,
    reason:
      extractedPatterns.length > 0
        ? `Extracted ${extractedPatterns.length} executive pattern(s) from certified scenarios.`
        : "No reusable patterns met minimum occurrence threshold.",
    workspaceId: request.workspaceId,
    extractedPatterns: Object.freeze(extractedPatterns),
    registeredPatternIds: Object.freeze(registeredPatternIds),
    skippedGroups,
    pipelineStages: PATTERN_EXTRACTION_PIPELINE_STAGES,
    extractionTimestamp,
    readOnly: true as const,
  });
}

export const PatternExtractionPipeline = Object.freeze({
  extractExecutivePatterns,
  stages: PATTERN_EXTRACTION_PIPELINE_STAGES,
});
