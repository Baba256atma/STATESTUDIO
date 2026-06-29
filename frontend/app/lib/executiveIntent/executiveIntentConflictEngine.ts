/**
 * APP-3:7 — Executive Intent Conflict Detection Engine.
 * Read-only conflict identification — no resolution or recommendations.
 */

import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  createIntentConflictDiagnostic,
  type IntentConflictDiagnostic,
} from "./executiveIntentConflictDiagnostics.ts";
import { getIntentConflictCanonicalExample } from "./executiveIntentConflictExamples.ts";
import {
  collectConflictRulesApplied,
  detectPairConflicts,
  highestConflictSeverity,
  pairKey,
  sortConflicts,
  type IntentConflictAnalysisBundle,
} from "./executiveIntentConflictRules.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_VERSION } from "./executiveIntentStateTypes.ts";
import {
  createIntentConflictAnalysisInput,
  createIntentConflictResult,
  EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
  type IntentConflict,
  type IntentConflictDetectionRequest,
  type IntentConflictFlags,
  type IntentConflictMatrix,
  type IntentConflictPair,
  type IntentConflictResult,
  type IntentConflictSummary,
  type IntentConflictValidationResult,
  type IntentConflictAnalysisInput,
  type IntentConflictCategory,
  type IntentConflictSeverity,
} from "./executiveIntentConflictTypes.ts";

export const EXECUTIVE_INTENT_CONFLICT_ENGINE_OWNER = "executive-intent-conflict" as const;

export const EXECUTIVE_INTENT_CONFLICT_ENGINE_TAGS = Object.freeze([
  "[APP3_7]",
  "[EXECUTIVE_INTENT_CONFLICT]",
  "[CONFLICT_DETECTION]",
  "[READ_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_CONFLICT_ENGINE_RULES = Object.freeze({
  deterministic: true,
  pure: true,
  noSideEffects: true,
  noGlobalState: true,
  noStorage: true,
  noMutation: true,
  noResolution: true,
  noRecommendations: true,
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
  diagnostics: IntentConflictDiagnostic[],
  code: Parameters<typeof createIntentConflictDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createIntentConflictDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createIntentConflictDiagnostic(code, message, timestamp, options));
}

function toBundle(input: IntentConflictAnalysisInput): IntentConflictAnalysisBundle {
  return Object.freeze({
    semanticModel: input.semanticModel,
    classification: input.classification,
    state: input.state,
  });
}

export function resolveConflictCategory(conflict: IntentConflict): IntentConflictCategory {
  return conflict.category;
}

export function resolveConflictSeverity(conflict: IntentConflict): IntentConflictSeverity {
  return conflict.severity;
}

export function resolveConflictFlags(input: Readonly<{
  conflicts: readonly IntentConflict[];
  pairs: readonly IntentConflictPair[];
}>): IntentConflictFlags {
  const hasConflict = input.conflicts.length > 0;
  const duplicateIntent = input.conflicts.some((entry) => entry.category === "duplicate");
  const sharedResources = input.conflicts.some(
    (entry) => entry.category === "resource" || entry.ruleId === "RULE_RESOURCE_KEYWORD"
  );
  const sharedTargets = input.conflicts.some(
    (entry) => entry.category === "target" || entry.ruleId === "RULE_TARGET_SHARED"
  );
  const timelineOverlap = input.conflicts.some((entry) => entry.category === "time");
  const requiresExecutiveReview =
    hasConflict &&
    input.conflicts.some((entry) =>
      ["high", "critical", "unknown"].includes(entry.severity)
    );

  return Object.freeze({
    hasConflict,
    multipleConflicts: input.conflicts.length > 1,
    duplicateIntent,
    sharedResources,
    sharedTargets,
    timelineOverlap,
    requiresExecutiveReview,
    futureCompatible: true as const,
    readOnly: true as const,
    deterministic: true as const,
  });
}

export function buildConflictSummary(input: Readonly<{
  conflicts: readonly IntentConflict[];
  pairs: readonly IntentConflictPair[];
}>): IntentConflictSummary {
  const highestSeverity = highestConflictSeverity(input.conflicts);
  const compatible = input.conflicts.length === 0;
  const headline = compatible
    ? "No executive intent conflicts detected."
    : `${input.conflicts.length} conflict(s) across ${input.pairs.filter((entry) => !entry.compatible).length} pair(s).`;

  return Object.freeze({
    headline,
    conflictCount: input.conflicts.length,
    pairCount: input.pairs.length,
    highestSeverity,
    compatible,
    readOnly: true as const,
  });
}

export function buildConflictMatrix(input: Readonly<{
  workspaceId: IntentConflictDetectionRequest["workspaceId"];
  intents: readonly IntentConflictAnalysisInput[];
  timestamp: string;
}>): Readonly<{ pairs: readonly IntentConflictPair[]; matrix: IntentConflictMatrix }> {
  const pairs: IntentConflictPair[] = [];
  const pairIndex: Record<string, string[]> = {};

  for (let leftIndex = 0; leftIndex < input.intents.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < input.intents.length; rightIndex += 1) {
      const left = input.intents[leftIndex]!;
      const right = input.intents[rightIndex]!;
      const pairConflicts = detectPairConflicts({
        left: toBundle(left),
        right: toBundle(right),
      });
      const key = pairKey(left.semanticModel.modelId, right.semanticModel.modelId);
      const pairId = deterministicId("conflict-pair", key);
      pairs.push(
        Object.freeze({
          pairId,
          leftSemanticModelId: left.semanticModel.modelId,
          rightSemanticModelId: right.semanticModel.modelId,
          conflicts: pairConflicts,
          compatible: pairConflicts.length === 0,
          readOnly: true as const,
        })
      );
      pairIndex[left.semanticModel.modelId] = [
        ...(pairIndex[left.semanticModel.modelId] ?? []),
        pairId,
      ];
      pairIndex[right.semanticModel.modelId] = [
        ...(pairIndex[right.semanticModel.modelId] ?? []),
        pairId,
      ];
    }
  }

  pairs.sort((left, right) => left.pairId.localeCompare(right.pairId));

  const matrixId = deterministicId(
    "conflict-matrix",
    `${input.workspaceId}:${input.intents.map((entry) => entry.semanticModel.modelId).join("|")}`
  );

  return Object.freeze({
    pairs: Object.freeze(pairs),
    matrix: Object.freeze({
      matrixId,
      workspaceId: input.workspaceId,
      intentCount: input.intents.length,
      pairs: Object.freeze(pairs),
      pairIndex: Object.freeze(
        Object.fromEntries(
          Object.entries(pairIndex).map(([modelId, pairIds]) => [
            modelId,
            Object.freeze([...pairIds].sort()),
          ])
        )
      ),
      readOnly: true as const,
    }),
  });
}

export function detectIntentConflict(
  left: IntentConflictAnalysisInput,
  right: IntentConflictAnalysisInput,
  timestamp: string = left.semanticModel.timestamp
): IntentConflictResult {
  return detectIntentConflicts(
    Object.freeze({
      workspaceId: left.semanticModel.workspaceId,
      intents: Object.freeze([left, right]),
      timestamp,
      readOnly: true as const,
    })
  );
}

export function detectIntentConflicts(
  request: IntentConflictDetectionRequest
): IntentConflictResult {
  const diagnostics: IntentConflictDiagnostic[] = [];
  const timestamp = request.timestamp;

  if (request.intents.length < 2) {
    pushDiagnostic(
      diagnostics,
      "conflict_detection_incomplete",
      "At least two intents are required for conflict detection.",
      timestamp
    );
  }

  const { pairs, matrix } = buildConflictMatrix({
    workspaceId: request.workspaceId,
    intents: request.intents,
    timestamp,
  });

  const conflicts = sortConflicts(
    pairs.flatMap((pair) => [...pair.conflicts])
  );

  if (conflicts.length === 0 && request.intents.length >= 2) {
    pushDiagnostic(diagnostics, "no_conflict", "No executive intent conflicts detected.", timestamp);
  }

  if (conflicts.length > 1) {
    pushDiagnostic(
      diagnostics,
      "multiple_conflicts",
      `${conflicts.length} conflicts detected across intent set.`,
      timestamp
    );
  }

  for (const conflict of conflicts) {
    const codeMap: Partial<Record<string, Parameters<typeof createIntentConflictDiagnostic>[0]>> = {
      duplicate: "duplicate_intent",
      target: "target_conflict",
      resource: "resource_conflict",
      time: "time_conflict",
      constraint: "constraint_conflict",
      assumption: "assumption_conflict",
      strategic: "classification_conflict",
      financial: "resource_conflict",
      technology: "target_conflict",
      compliance: "classification_conflict",
      unknown: "unknown_conflict",
    };
    const code = codeMap[conflict.category] ?? "unknown_conflict";
    pushDiagnostic(diagnostics, code, conflict.summary, timestamp, {
      explanation: conflict.explanation,
      metadata: Object.freeze({ conflictId: conflict.conflictId, ruleId: conflict.ruleId }),
    });
  }

  if (conflicts.some((entry) => entry.ruleId === "RULE_TARGET_SHARED")) {
    pushDiagnostic(diagnostics, "shared_target_detected", "Shared targets detected.", timestamp);
  }
  if (conflicts.some((entry) => entry.category === "resource")) {
    pushDiagnostic(diagnostics, "shared_resource_detected", "Shared resources detected.", timestamp);
  }
  if (conflicts.some((entry) => entry.category === "time")) {
    pushDiagnostic(
      diagnostics,
      "timeline_overlap_detected",
      "Timeline overlap detected.",
      timestamp
    );
  }

  const flags = resolveConflictFlags({ conflicts, pairs });
  const summary = buildConflictSummary({ conflicts, pairs });
  const rulesApplied = collectConflictRulesApplied(conflicts);

  let status: IntentConflictResult["status"] = "clear";
  if (conflicts.length > 0) status = "conflicts_detected";
  else if (request.intents.some((entry) => entry.semanticModel.flags.incompleteObjective)) {
    status = "partial";
  }
  if (conflicts.some((entry) => entry.severity === "unknown")) status = "unknown";

  if (status === "clear" || status === "conflicts_detected") {
    pushDiagnostic(
      diagnostics,
      "conflict_detection_success",
      "Conflict detection completed.",
      timestamp
    );
  }

  const resultId = deterministicId(
    "conflict-result",
    `${request.workspaceId}:${matrix.matrixId}:${timestamp}`
  );

  return createIntentConflictResult({
    resultId,
    workspaceId: request.workspaceId,
    status,
    conflicts,
    matrix,
    flags,
    diagnostics: Object.freeze([...diagnostics]),
    summary,
    metadata: Object.freeze({
      conflictEngineVersion: EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
      semanticModelVersion: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
      classificationEngineVersion: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
      stateEngineVersion: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
      rulesApplied,
      intentCount: request.intents.length,
      readOnly: true as const,
    }),
    timestamp,
  });
}

export function validateConflictResult(result: IntentConflictResult): IntentConflictValidationResult {
  const issues: string[] = [];
  if (result.readOnly !== true) issues.push("Conflict result must be read-only.");
  if (result.flags.readOnly !== true) issues.push("Conflict flags must be read-only.");
  if (result.flags.deterministic !== true) issues.push("Conflict detection must be deterministic.");
  if (result.metadata.conflictEngineVersion !== EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION) {
    issues.push("Unexpected conflict engine version.");
  }
  if (result.summary.compatible && result.conflicts.length > 0) {
    issues.push("Summary compatible flag conflicts with detected conflicts.");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true,
  });
}

function buildAnalysisInputFromText(
  text: string,
  workspaceId: string,
  owner: string,
  languageCode: string,
  generatedAt: string
): IntentConflictAnalysisInput {
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

  return createIntentConflictAnalysisInput({
    semanticModel: semantic.model,
    classification,
    state,
  });
}

export function buildConflictExample(
  exampleId: string,
  workspaceId: string = "ws-example-001",
  owner: string = "executive-owner",
  generatedAt: string = new Date(0).toISOString()
): IntentConflictResult | null {
  const example = getIntentConflictCanonicalExample(exampleId);
  if (!example) return null;

  const left = buildAnalysisInputFromText(
    example.leftText,
    workspaceId,
    owner,
    example.languageCode,
    generatedAt
  );
  const right = buildAnalysisInputFromText(
    example.rightText,
    workspaceId,
    owner,
    example.languageCode,
    generatedAt
  );

  return detectIntentConflict(left, right, generatedAt);
}

export function buildConflictProbe(
  generatedAt: string = new Date(0).toISOString()
): IntentConflictResult {
  const left = buildAnalysisInputFromText(
    "Increase company profit by 20% next year.",
    "ws-example-001",
    "executive-owner",
    "en",
    generatedAt
  );
  const right = buildAnalysisInputFromText(
    "Reduce company profit by 10% next year.",
    "ws-example-001",
    "executive-owner",
    "en",
    generatedAt
  );
  return detectIntentConflict(left, right, generatedAt);
}

export function getExecutiveIntentConflictEngineVersionMetadata(): Readonly<{
  conflictEngineVersion: typeof EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION;
  owner: typeof EXECUTIVE_INTENT_CONFLICT_ENGINE_OWNER;
}> {
  return Object.freeze({
    conflictEngineVersion: EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
    owner: EXECUTIVE_INTENT_CONFLICT_ENGINE_OWNER,
  });
}

export const ExecutiveIntentConflictEngine = Object.freeze({
  detectIntentConflicts,
  detectIntentConflict,
  buildConflictMatrix,
  resolveConflictCategory,
  resolveConflictSeverity,
  resolveConflictFlags,
  validateConflictResult,
  buildConflictSummary,
  buildConflictExample,
  buildConflictProbe,
  getExecutiveIntentConflictEngineVersionMetadata,
  version: EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
  rules: EXECUTIVE_INTENT_CONFLICT_ENGINE_RULES,
  tags: EXECUTIVE_INTENT_CONFLICT_ENGINE_TAGS,
});
