/**
 * APP-3:10 — Executive Intent Confidence Engine.
 * Measures understanding confidence — not business success prediction.
 */

import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import {
  buildConflictExample,
} from "./executiveIntentConflictEngine.ts";
import { EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION } from "./executiveIntentConflictTypes.ts";
import { buildDependencyExample } from "./executiveIntentDependencyEngine.ts";
import { EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION } from "./executiveIntentDependencyTypes.ts";
import {
  buildEvolutionExampleSet,
  buildIntentEvolution,
} from "./executiveIntentEvolutionEngine.ts";
import { EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION } from "./executiveIntentEvolutionTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  createIntentConfidenceDiagnostic,
  type IntentConfidenceDiagnostic,
} from "./executiveIntentConfidenceDiagnostics.ts";
import { getIntentConfidenceCanonicalExample } from "./executiveIntentConfidenceExamples.ts";
import {
  collectConfidenceRulesApplied,
  resolveAggregateScore,
  resolveConfidenceFactors,
  resolveConfidenceLevel,
} from "./executiveIntentConfidenceRules.ts";
import {
  createIntentConfidenceAnalysisInput,
  createIntentConfidenceResult,
  EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION,
  type IntentConfidenceAnalysisInput,
  type IntentConfidenceBreakdown,
  type IntentConfidenceFactor,
  type IntentConfidenceFlags,
  type IntentConfidenceLevel,
  type IntentConfidenceResult,
  type IntentConfidenceSummary,
  type IntentConfidenceValidationResult,
} from "./executiveIntentConfidenceTypes.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_VERSION } from "./executiveIntentStateTypes.ts";

export const EXECUTIVE_INTENT_CONFIDENCE_ENGINE_OWNER = "executive-intent-confidence" as const;

export const EXECUTIVE_INTENT_CONFIDENCE_ENGINE_TAGS = Object.freeze([
  "[APP3_10]",
  "[EXECUTIVE_INTENT_CONFIDENCE]",
  "[UNDERSTANDING_CONFIDENCE]",
  "[READ_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES = Object.freeze({
  deterministic: true,
  pure: true,
  noSideEffects: true,
  noGlobalState: true,
  noStorage: true,
  noMutation: true,
  noRecommendations: true,
  noBusinessPrediction: true,
  readOnly: true,
} as const);

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

function pushDiagnostic(
  diagnostics: IntentConfidenceDiagnostic[],
  code: Parameters<typeof createIntentConfidenceDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createIntentConfidenceDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createIntentConfidenceDiagnostic(code, message, timestamp, options));
}

export function resolveConfidenceBreakdown(
  factors: readonly IntentConfidenceFactor[],
  timestamp: string
): IntentConfidenceBreakdown {
  const aggregateScore = resolveAggregateScore(factors);
  return Object.freeze({
    breakdownId: deterministicId("confidence-breakdown", `${aggregateScore}:${factors.length}:${timestamp}`),
    factors: Object.freeze([...factors]),
    aggregateScore,
    level: resolveConfidenceLevel(aggregateScore),
    readOnly: true as const,
  });
}

export function resolveConfidenceFlags(input: Readonly<{
  level: IntentConfidenceLevel;
  aggregateScore: number;
  factors: readonly IntentConfidenceFactor[];
  conflict: import("./executiveIntentConflictTypes.ts").IntentConflictResult | null;
  dependency: import("./executiveIntentDependencyTypes.ts").IntentDependencyResult | null;
  evolution: import("./executiveIntentEvolutionTypes.ts").IntentEvolutionResult | null;
  semanticModel: import("./executiveIntentSemanticTypes.ts").ExecutiveIntentSemanticModel | null;
}>): IntentConfidenceFlags {
  const blockingFactorCount = input.factors.filter((factor) => factor.blocking).length;
  const readinessFactor = input.factors.find((factor) => factor.factorKey === "readiness");
  const readyForReasoning =
    readinessFactor?.rawScore >= 75 && blockingFactorCount === 0 && input.level !== "unknown";

  return Object.freeze({
    highConfidence: input.level === "very_high" || input.level === "high",
    mediumConfidence: input.level === "medium",
    lowConfidence: input.level === "low" || input.level === "very_low" || input.level === "unknown",
    requiresClarification:
      Boolean(input.semanticModel?.flags.requiresClarification) ||
      blockingFactorCount > 0 ||
      input.level === "low" ||
      input.level === "very_low",
    conflictAffected: Boolean(input.conflict?.flags.hasConflict),
    dependencyAffected:
      Boolean(input.dependency?.flags.hasDependencies) ||
      Boolean(input.dependency?.flags.circularDependency),
    evolutionStable:
      input.evolution == null ||
      (input.evolution.status !== "broken" &&
        input.evolution.timeline.events.length <= 5 &&
        !input.evolution.flags.superseded),
    readyForReasoning,
    futureCompatible: true as const,
    readOnly: true as const,
    deterministic: true as const,
  });
}

export function buildConfidenceSummary(result: IntentConfidenceResult): IntentConfidenceSummary {
  const blockingFactorCount = result.breakdown.factors.filter((factor) => factor.blocking).length;
  return Object.freeze({
    headline: `Understanding confidence is ${result.level.replace("_", " ")} (${result.aggregateScore}/100).`,
    level: result.level,
    aggregateScore: result.aggregateScore,
    factorCount: result.breakdown.factors.length,
    blockingFactorCount,
    readyForReasoning: result.flags.readyForReasoning,
    readOnly: true as const,
  });
}

export function calculateIntentConfidence(
  input: IntentConfidenceAnalysisInput
): IntentConfidenceResult {
  const diagnostics: IntentConfidenceDiagnostic[] = [];
  const factors = resolveConfidenceFactors(input);
  const breakdown = resolveConfidenceBreakdown(factors, input.timestamp);
  const flags = resolveConfidenceFlags({
    level: breakdown.level,
    aggregateScore: breakdown.aggregateScore,
    factors,
    conflict: input.conflict,
    dependency: input.dependency,
    evolution: input.evolution,
    semanticModel: input.semanticModel,
  });

  if (breakdown.level === "very_high" || breakdown.level === "high") {
    pushDiagnostic(
      diagnostics,
      "confidence_high",
      "Understanding confidence is high.",
      input.timestamp
    );
  } else if (breakdown.level === "medium") {
    pushDiagnostic(
      diagnostics,
      "confidence_medium",
      "Understanding confidence is medium.",
      input.timestamp
    );
  } else if (breakdown.level === "unknown") {
    pushDiagnostic(
      diagnostics,
      "unknown_confidence",
      "Understanding confidence could not be established.",
      input.timestamp
    );
  } else {
    pushDiagnostic(
      diagnostics,
      "confidence_low",
      "Understanding confidence is low.",
      input.timestamp
    );
  }

  if (flags.readyForReasoning) {
    pushDiagnostic(
      diagnostics,
      "ready_for_reasoning",
      "Intent is ready for downstream executive reasoning.",
      input.timestamp
    );
  }
  if (flags.requiresClarification) {
    pushDiagnostic(
      diagnostics,
      "requires_clarification",
      "Intent requires clarification before confident understanding.",
      input.timestamp
    );
  }
  if (input.semanticModel?.flags.incompleteObjective) {
    pushDiagnostic(
      diagnostics,
      "semantic_incomplete",
      "Semantic model is incomplete.",
      input.timestamp
    );
  }
  if (input.conflict?.flags.hasConflict) {
    pushDiagnostic(
      diagnostics,
      "conflict_present",
      "Unresolved conflicts affect understanding confidence.",
      input.timestamp
    );
  }
  if (input.dependency?.flags.circularDependency) {
    pushDiagnostic(
      diagnostics,
      "dependency_complex",
      "Circular dependencies increase complexity.",
      input.timestamp
    );
  }
  if (input.evolution?.status === "broken") {
    pushDiagnostic(
      diagnostics,
      "unstable_evolution",
      "Broken evolution lineage reduces stability confidence.",
      input.timestamp
    );
  }

  pushDiagnostic(
    diagnostics,
    "confidence_calculation_success",
    "Confidence calculation completed deterministically.",
    input.timestamp
  );

  const result = createIntentConfidenceResult({
    resultId: deterministicId(
      "confidence-result",
      `${input.workspaceId}:${input.focusIntentId ?? "none"}:${input.timestamp}`
    ),
    workspaceId: input.workspaceId,
    focusIntentId: input.focusIntentId,
    semanticModelId: input.semanticModel?.modelId ?? null,
    level: breakdown.level,
    aggregateScore: breakdown.aggregateScore,
    breakdown,
    flags,
    diagnostics: Object.freeze([...diagnostics]),
    summary: Object.freeze({
      headline: "",
      level: breakdown.level,
      aggregateScore: breakdown.aggregateScore,
      factorCount: factors.length,
      blockingFactorCount: factors.filter((factor) => factor.blocking).length,
      readyForReasoning: flags.readyForReasoning,
      readOnly: true as const,
    }),
    metadata: Object.freeze({
      confidenceEngineVersion: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION,
      semanticModelVersion: input.semanticModel ? EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION : null,
      classificationEngineVersion: input.classification
        ? EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION
        : null,
      conflictEngineVersion: input.conflict ? EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION : null,
      dependencyEngineVersion: input.dependency ? EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION : null,
      evolutionEngineVersion: input.evolution ? EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION : null,
      stateEngineVersion: input.state ? EXECUTIVE_INTENT_STATE_ENGINE_VERSION : null,
      rulesApplied: collectConfidenceRulesApplied(factors),
      readOnly: true as const,
    }),
    timestamp: input.timestamp,
  });

  return Object.freeze({
    ...result,
    summary: buildConfidenceSummary(result),
  });
}

export function buildIntentConfidence(
  input: IntentConfidenceAnalysisInput
): IntentConfidenceResult {
  return calculateIntentConfidence(input);
}

export function validateConfidence(result: IntentConfidenceResult): IntentConfidenceValidationResult {
  const issues: string[] = [];
  if (result.readOnly !== true) issues.push("Confidence result must be read-only.");
  if (result.flags.readOnly !== true) issues.push("Confidence flags must be read-only.");
  if (result.flags.deterministic !== true) issues.push("Confidence engine must be deterministic.");
  if (result.metadata.confidenceEngineVersion !== EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION) {
    issues.push("Unexpected confidence engine version.");
  }
  if (result.breakdown.factors.length !== 11) {
    issues.push("Confidence breakdown must include eleven factors.");
  }
  if (result.level !== resolveConfidenceLevel(result.aggregateScore)) {
    issues.push("Confidence level does not match aggregate score.");
  }
  const recomputed = resolveAggregateScore(result.breakdown.factors);
  if (recomputed !== result.aggregateScore) {
    issues.push("Aggregate score does not match factor weighting.");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

function buildPipelineFromText(
  text: string,
  workspaceId: string,
  owner: string,
  languageCode: string,
  generatedAt: string
): IntentConfidenceAnalysisInput {
  const extraction = extractExecutiveIntent(
    Object.freeze({ text, workspaceId, owner, languageCode, generatedAt })
  );
  const semantic = buildExecutiveIntentSemanticModel(extraction, generatedAt);
  const classification = classifyExecutiveIntent(semantic.model, generatedAt);
  const state = extraction.primaryIntent
    ? resolveExecutiveIntentStateResult(
        Object.freeze({
          intent: extraction.primaryIntent,
          intentId: extraction.primaryIntent.intentId,
          workspaceId,
          evaluatedAt: generatedAt,
          proposedLifecycleTransition: null,
        })
      )
    : null;
  const conflict = null;
  const dependency = null;
  const evolution = null;

  return createIntentConfidenceAnalysisInput({
    workspaceId,
    focusIntentId: extraction.primaryIntent?.intentId ?? null,
    extraction,
    semanticModel: semantic.model,
    classification,
    conflict,
    dependency,
    evolution,
    state,
    timestamp: generatedAt,
  });
}

export function buildConfidenceExample(
  exampleId: string,
  workspaceId: string = "ws-example-001",
  owner: string = "executive-owner",
  generatedAt: string = new Date(0).toISOString()
): IntentConfidenceResult | null {
  const example = getIntentConfidenceCanonicalExample(exampleId);
  if (!example) return null;

  if (!example.text) return null;

  const input = buildPipelineFromText(example.text, workspaceId, owner, "en", generatedAt);

  let conflict = input.conflict;
  if (example.conflictExampleId) {
    const pairConflict = buildConflictExample(
      example.conflictExampleId,
      workspaceId,
      owner,
      generatedAt
    );
    if (pairConflict) conflict = pairConflict;
  }

  let dependency = input.dependency;
  if (example.dependencyExampleId) {
    const dependencyExample = buildDependencyExample(
      example.dependencyExampleId,
      workspaceId,
      owner,
      generatedAt
    );
    if (dependencyExample) dependency = dependencyExample;
  }

  let evolution = input.evolution;
  if (example.evolutionExampleId) {
    const evolutionSet = buildEvolutionExampleSet(example.evolutionExampleId);
    if (evolutionSet) {
      evolution = buildIntentEvolution(
        Object.freeze({
          workspaceId,
          records: evolutionSet.records,
          focusIntentId: evolutionSet.focusIntentId,
          timestamp: generatedAt,
          readOnly: true as const,
        })
      );
    }
  }

  return calculateIntentConfidence(
    createIntentConfidenceAnalysisInput({
      ...input,
      conflict,
      dependency,
      evolution,
    })
  );
}

export function buildConfidenceProbe(
  generatedAt: string = new Date(0).toISOString()
): IntentConfidenceResult {
  return (
    buildConfidenceExample("high-confidence-intent", "ws-example-001", "executive-owner", generatedAt) ??
    calculateIntentConfidence(
      buildPipelineFromText(
        "Increase company profit by 20% next year.",
        "ws-example-001",
        "executive-owner",
        "en",
        generatedAt
      )
    )
  );
}

export function getExecutiveIntentConfidenceEngineVersionMetadata(): Readonly<{
  confidenceEngineVersion: typeof EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION;
  owner: typeof EXECUTIVE_INTENT_CONFIDENCE_ENGINE_OWNER;
}> {
  return Object.freeze({
    confidenceEngineVersion: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION,
    owner: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_OWNER,
  });
}

export const ExecutiveIntentConfidenceEngine = Object.freeze({
  buildIntentConfidence,
  calculateIntentConfidence,
  resolveConfidenceFactors,
  resolveConfidenceLevel,
  resolveConfidenceBreakdown,
  validateConfidence,
  buildConfidenceSummary,
  buildConfidenceExample,
  buildConfidenceProbe,
  getExecutiveIntentConfidenceEngineVersionMetadata,
  version: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION,
  rules: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES,
  tags: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_TAGS,
});

export { resolveConfidenceFactors, resolveConfidenceLevel } from "./executiveIntentConfidenceRules.ts";
