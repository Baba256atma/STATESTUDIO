/**
 * APP-10:2 — Pattern Extraction Engine record normalizer.
 */

import { PATTERN_EXTRACTION_ENGINE_LIMITS } from "./patternExtractionEngineConstants.ts";
import type {
  CertifiedCompletedScenarioInput,
  NormalizedCompletedScenario,
} from "./patternExtractionEngineTypes.ts";

function normalizeStep(step: string): string {
  return step.trim().replace(/\s+/g, " ");
}

export function buildStrategySignature(strategyChain: readonly string[]): string {
  return strategyChain.map((step) => normalizeStep(step).toLowerCase()).join("->");
}

function hashSignature(payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function buildPatternGroupKey(
  workspaceId: string,
  patternCategory: string,
  patternType: string,
  strategySignature: string
): string {
  return `${workspaceId}|${patternCategory}|${patternType}|${strategySignature}`;
}

export function buildPatternId(
  workspaceId: string,
  patternCategory: string,
  patternType: string,
  strategySignature: string
): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  const signatureHash = hashSignature(`${patternCategory}|${patternType}|${strategySignature}`);
  return `executive-pattern-${safeWorkspace}-${signatureHash}`;
}

export function normalizeCompletedScenario(
  input: CertifiedCompletedScenarioInput
): NormalizedCompletedScenario {
  const strategyChain = Object.freeze(
    input.strategyChain
      .map((step) => normalizeStep(step))
      .filter((step) => step.length > 0)
      .slice(0, PATTERN_EXTRACTION_ENGINE_LIMITS.maxStrategyChainSteps)
  );
  const strategySignature = buildStrategySignature(strategyChain);
  return Object.freeze({
    scenarioId: input.scenarioId.trim(),
    workspaceId: input.workspaceId.trim(),
    scenarioTitle: input.scenarioTitle.trim(),
    patternCategory: input.patternCategory,
    patternType: input.patternType,
    strategyChain,
    strategySignature,
    decisionIds: Object.freeze([...new Set(input.decisionIds.map((id) => id.trim()).filter(Boolean))]),
    outcomeSummary: input.outcomeSummary.trim(),
    timelineReferences: Object.freeze([...new Set(input.timelineReferences.map((ref) => ref.trim()).filter(Boolean))]),
    journalReferences: Object.freeze([...new Set(input.journalReferences.map((ref) => ref.trim()).filter(Boolean))]),
    confidenceReferences: Object.freeze([...new Set(input.confidenceReferences.map((ref) => ref.trim()).filter(Boolean))]),
    confidenceVersion: input.confidenceVersion?.trim() || "APP-9/1",
    sourceApps: Object.freeze([...new Set(input.sourceApps.map((app) => app.trim()).filter(Boolean))]),
    readOnly: true as const,
  });
}

export function normalizeCompletedScenarios(
  scenarios: readonly CertifiedCompletedScenarioInput[]
): readonly NormalizedCompletedScenario[] {
  return Object.freeze(scenarios.map((scenario) => normalizeCompletedScenario(scenario)));
}

export const PatternExtractionNormalizer = Object.freeze({
  normalizeCompletedScenario,
  normalizeCompletedScenarios,
  buildStrategySignature,
  buildPatternGroupKey,
  buildPatternId,
});
