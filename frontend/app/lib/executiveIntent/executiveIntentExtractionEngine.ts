/**
 * APP-3:4 — Executive Intent Extraction Engine.
 * Deterministic structured extraction — consumes APP-3:1 contract only.
 */

import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "./executiveIntentConstants.ts";
import {
  createIntentExtractionDiagnostic,
  type IntentExtractionDiagnostic,
} from "./executiveIntentExtractionDiagnostics.ts";
import {
  EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION,
  findActionVerb,
  findFirstMatchingKeyword,
  INTENT_EXTRACTION_PATTERN_RULES,
  resolveExplicitCategory,
  resolveExplicitPriority,
  resolveExplicitScope,
  resolveIntentExtractionLanguageAdapter,
  type IntentExtractionLanguageAdapter,
} from "./executiveIntentExtractionRules.ts";
import {
  createIntentExtractionResult,
  EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
  type ExtractedActor,
  type ExtractedAssumption,
  type ExtractedConstraint,
  type ExtractedEvidence,
  type ExtractedGoal,
  type ExtractedTarget,
  type ExtractedTimeReference,
  type ExtractionDiagnostics,
  type ExtractionMetadata,
  type IntentExtractionBatchResult,
  type IntentExtractionRequest,
  type IntentExtractionResult,
  type IntentExtractionStatus,
  type IntentExtractionValidationResult,
} from "./executiveIntentExtractionTypes.ts";
import { getIntentExtractionCanonicalExample } from "./executiveIntentExtractionExamples.ts";
import type {
  ExecutiveIntent,
  IntentAssumption,
  IntentCategory,
  IntentConstraint,
  IntentEvidence,
  IntentMetadata,
  IntentPriority,
  IntentScope,
  IntentTag,
  IntentTarget,
  IntentVersion,
} from "./executiveIntentTypes.ts";
import { validateExecutiveIntentShape } from "./executiveIntentValidation.ts";

export const EXECUTIVE_INTENT_EXTRACTION_ENGINE_OWNER = "executive-intent-extraction-engine" as const;

export const EXECUTIVE_INTENT_EXTRACTION_ENGINE_TAGS = Object.freeze([
  "[APP3_4]",
  "[EXECUTIVE_INTENT_EXTRACTION]",
  "[EXTRACTION_ENGINE]",
  "[MULTILINGUAL_READY]",
  "[READ_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_EXTRACTION_ENGINE_RULES = Object.freeze({
  deterministic: true,
  pure: true,
  noSideEffects: true,
  noGlobalState: true,
  noStorage: true,
  noMutation: true,
  noInference: true,
  explicitOnly: true,
  readOnly: true,
} as const);

const CONTRACT_PLACEHOLDER_PRIORITY: IntentPriority = "medium";

function pushDiagnostic(
  diagnostics: IntentExtractionDiagnostic[],
  code: Parameters<typeof createIntentExtractionDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createIntentExtractionDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createIntentExtractionDiagnostic(code, message, timestamp, options));
}

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

function splitSegments(text: string): readonly string[] {
  const parts = text
    .split(INTENT_EXTRACTION_PATTERN_RULES.multiIntentSplit)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
  return Object.freeze(parts.length > 0 ? parts : [text.trim()]);
}

function extractTargetObject(text: string, adapter: IntentExtractionLanguageAdapter): string | null {
  const category = resolveExplicitCategory(text, adapter);
  if (!category) return null;
  const keywords = adapter.categoryKeywords[category];
  if (!keywords) return null;
  return findFirstMatchingKeyword(text, keywords);
}

function extractMarkers(
  text: string,
  markers: readonly string[],
  prefix: string,
  timestamp: string,
  build: (index: number, phrase: string, explicitText: string) => ExtractedConstraint | ExtractedAssumption | ExtractedEvidence
): readonly ExtractedConstraint[] | readonly ExtractedAssumption[] | readonly ExtractedEvidence[] {
  const normalized = text.toLowerCase();
  const results: Array<ExtractedConstraint | ExtractedAssumption | ExtractedEvidence> = [];
  for (const marker of markers) {
    const index = normalized.indexOf(marker.toLowerCase());
    if (index >= 0) {
      const explicitText = text.slice(index).trim();
      results.push(build(results.length, marker, explicitText));
    }
  }
  return Object.freeze(results);
}

export function extractIntentTargets(
  text: string,
  languageCode: string = "en"
): readonly ExtractedTarget[] {
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  const segments = splitSegments(text);
  return Object.freeze(
    segments.map((segment, index) => {
      const objectLabel = extractTargetObject(segment, adapter);
      const percentMatch = segment.match(INTENT_EXTRACTION_PATTERN_RULES.percentValue);
      const numericValue = percentMatch ? Number.parseFloat(percentMatch[1] ?? "") : null;
      const valueLabel = percentMatch ? percentMatch[0] : null;
      const scope = resolveExplicitScope(segment, adapter) ?? "custom";
      const targetId = deterministicId("target", `${segment}|${index}`);
      const intentTarget: IntentTarget | null = objectLabel
        ? Object.freeze({
            targetId,
            targetType: scope,
            label: objectLabel,
            readOnly: true as const,
          })
        : null;
      return Object.freeze({
        targetId,
        objectLabel: objectLabel ?? "",
        valueLabel,
        numericValue,
        unit: percentMatch ? "percent" : null,
        businessArea: objectLabel,
        intentTarget,
        readOnly: true as const,
      });
    })
  );
}

export function extractIntentConstraints(
  text: string,
  languageCode: string = "en"
): readonly ExtractedConstraint[] {
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  return extractMarkers(
    text,
    adapter.constraintMarkers,
    "constraint",
    new Date(0).toISOString(),
    (index, marker, explicitText) =>
      Object.freeze({
        constraintId: deterministicId("constraint", `${marker}|${index}|${explicitText}`),
        label: marker,
        description: explicitText,
        explicitText,
        readOnly: true as const,
      })
  ) as readonly ExtractedConstraint[];
}

export function extractIntentAssumptions(
  text: string,
  languageCode: string = "en"
): readonly ExtractedAssumption[] {
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  return extractMarkers(
    text,
    adapter.assumptionMarkers,
    "assumption",
    new Date(0).toISOString(),
    (index, marker, explicitText) =>
      Object.freeze({
        assumptionId: deterministicId("assumption", `${marker}|${index}|${explicitText}`),
        label: marker,
        description: explicitText,
        explicitText,
        readOnly: true as const,
      })
  ) as readonly ExtractedAssumption[];
}

export function extractIntentTimeReferences(
  text: string,
  languageCode: string = "en"
): readonly ExtractedTimeReference[] {
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  const results: ExtractedTimeReference[] = [];
  const normalized = adapter.normalizeText(text);

  for (const phrase of adapter.timeRelativePhrases) {
    if (normalized.includes(phrase)) {
      results.push(
        Object.freeze({
          timeRefId: deterministicId("time", phrase),
          phrase,
          normalizedLabel: phrase,
          explicitText: phrase,
          readOnly: true as const,
        })
      );
    }
  }

  const yearMatch = text.match(INTENT_EXTRACTION_PATTERN_RULES.absoluteYear);
  if (yearMatch) {
    results.push(
      Object.freeze({
        timeRefId: deterministicId("time", yearMatch[0]),
        phrase: yearMatch[0],
        normalizedLabel: yearMatch[0],
        explicitText: yearMatch[0],
        readOnly: true as const,
      })
    );
  }

  const quarterMatch = text.match(INTENT_EXTRACTION_PATTERN_RULES.quarterReference);
  if (quarterMatch) {
    const phrase = `Q${quarterMatch[1]}`;
    results.push(
      Object.freeze({
        timeRefId: deterministicId("time", phrase),
        phrase,
        normalizedLabel: phrase,
        explicitText: phrase,
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(results);
}

export function extractIntentEvidence(
  text: string,
  languageCode: string = "en"
): readonly ExtractedEvidence[] {
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  return extractMarkers(
    text,
    adapter.evidenceMarkers,
    "evidence",
    new Date(0).toISOString(),
    (index, marker, explicitText) =>
      Object.freeze({
        evidenceId: deterministicId("evidence", `${marker}|${index}|${explicitText}`),
        source: marker,
        summary: explicitText,
        explicitText,
        readOnly: true as const,
      })
  ) as readonly ExtractedEvidence[];
}

export function extractIntentActors(
  text: string,
  _languageCode: string = "en"
): readonly ExtractedActor[] {
  const results: ExtractedActor[] = [];
  const rolePatterns = Object.freeze([
    Object.freeze({ role: "CEO", pattern: /\bceo\b/i }),
    Object.freeze({ role: "CFO", pattern: /\bcfo\b/i }),
    Object.freeze({ role: "CTO", pattern: /\bcto\b/i }),
    Object.freeze({ role: "Board", pattern: /\bboard\b/i }),
  ]);
  for (const entry of rolePatterns) {
    const match = text.match(entry.pattern);
    if (match) {
      results.push(
        Object.freeze({
          actorId: deterministicId("actor", entry.role),
          name: match[0],
          role: entry.role,
          explicitText: match[0],
          readOnly: true as const,
        })
      );
    }
  }
  return Object.freeze(results);
}

function buildIntentVersion(timestamp: string, intentId: string): IntentVersion {
  return Object.freeze({
    versionId: deterministicId("version", intentId),
    semanticVersion: "1.0.0",
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function mapConstraints(constraints: readonly ExtractedConstraint[]): readonly IntentConstraint[] {
  return Object.freeze(
    constraints.map((entry) =>
      Object.freeze({
        constraintId: entry.constraintId,
        label: entry.label,
        description: entry.description,
        readOnly: true as const,
      })
    )
  );
}

function mapAssumptions(assumptions: readonly ExtractedAssumption[]): readonly IntentAssumption[] {
  return Object.freeze(
    assumptions.map((entry) =>
      Object.freeze({
        assumptionId: entry.assumptionId,
        label: entry.label,
        description: entry.description,
        readOnly: true as const,
      })
    )
  );
}

function mapEvidence(evidence: readonly ExtractedEvidence[]): readonly IntentEvidence[] {
  return Object.freeze(
    evidence.map((entry) =>
      Object.freeze({
        evidenceId: entry.evidenceId,
        source: entry.source,
        summary: entry.summary,
        readOnly: true as const,
      })
    )
  );
}

function buildExecutiveIntentFromSegment(
  request: IntentExtractionRequest,
  segment: string,
  segmentIndex: number,
  adapter: IntentExtractionLanguageAdapter,
  shared: Readonly<{
    constraints: readonly ExtractedConstraint[];
    assumptions: readonly ExtractedAssumption[];
    evidence: readonly ExtractedEvidence[];
    timeReferences: readonly ExtractedTimeReference[];
    actors: readonly ExtractedActor[];
  }>
): Readonly<{ intent: ExecutiveIntent | null; goals: ExtractedGoal[]; targets: ExtractedTarget[] }> {
  const actionVerb = findActionVerb(segment, adapter);
  const targetObject = extractTargetObject(segment, adapter);
  const goals: ExtractedGoal[] = [];
  const targets = [...extractIntentTargets(segment, adapter.languageCode)];

  if (!actionVerb) {
    return Object.freeze({ intent: null, goals, targets });
  }

  goals.push(
    Object.freeze({
      goalId: deterministicId("goal", `${segment}|${segmentIndex}`),
      actionVerb,
      primaryPhrase: segment,
      rawSegment: segment,
      readOnly: true as const,
    })
  );

  const explicitCategory = request.explicitTags?.length
    ? null
    : resolveExplicitCategory(segment, adapter);
  const category: IntentCategory = explicitCategory ?? "custom";
  const explicitPriority = request.explicitPriority ?? resolveExplicitPriority(segment, adapter);
  const explicitScope = request.explicitScope ?? resolveExplicitScope(segment, adapter);
  const scope: IntentScope = explicitScope ?? "custom";

  const intentId = deterministicId(
    request.intentIdPrefix ?? "intent-ext",
    `${request.workspaceId}|${segment}|${segmentIndex}`
  );

  const tags: IntentTag[] = (request.explicitTags ?? []).map((label, index) =>
    Object.freeze({
      tagId: deterministicId("tag", `${label}|${index}`),
      label,
      readOnly: true as const,
    })
  );

  const customMetadata: Record<string, string> = {
    extractionLanguage: adapter.languageCode,
    extractionRuleSet: EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION,
    priorityExplicit: explicitPriority ? "true" : "false",
    scopeExplicit: explicitScope ? "true" : "false",
    categoryExplicit: explicitCategory ? "true" : "false",
    actionVerb: actionVerb,
  };
  if (shared.timeReferences[0]) {
    customMetadata.timeHorizon = shared.timeReferences[0].normalizedLabel;
  }
  if (targetObject) customMetadata.targetObject = targetObject;
  if (targets[0]?.valueLabel) customMetadata.targetValue = targets[0].valueLabel;

  const metadata: IntentMetadata = Object.freeze({
    intentId,
    title: segment.length > 256 ? `${segment.slice(0, 253)}...` : segment,
    summary: segment,
    description: segment,
    createdAt: request.generatedAt,
    updatedAt: request.generatedAt,
    version: buildIntentVersion(request.generatedAt, intentId),
    owner: request.owner,
    workspaceId: request.workspaceId,
    tags: Object.freeze(tags),
    priority: explicitPriority ?? CONTRACT_PLACEHOLDER_PRIORITY,
    status: "draft",
    scope: Object.freeze({
      scope,
      scopeRef: explicitScope ? scope : null,
      label: explicitScope ?? "custom",
      readOnly: true as const,
    }),
    category,
    source: "executive",
    lifecycle: "created",
    references: Object.freeze([]),
    assumptions: mapAssumptions(shared.assumptions),
    constraints: mapConstraints(shared.constraints),
    dependencies: Object.freeze([]),
    evidence: mapEvidence(shared.evidence),
    confidenceReference: null,
    conflictReference: null,
    customMetadata: Object.freeze(customMetadata),
    readOnly: true,
  });

  const intent: ExecutiveIntent = Object.freeze({
    intentId,
    workspaceId: request.workspaceId,
    metadata,
    relations: Object.freeze([]),
    readOnly: true,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
  });

  return Object.freeze({ intent, goals, targets });
}

function buildExtractionDiagnostics(
  entries: readonly IntentExtractionDiagnostic[],
  status: IntentExtractionStatus,
  extractedFieldNames: readonly string[],
  missingRequiredFields: readonly string[],
  unsupportedConstructs: readonly string[]
): ExtractionDiagnostics {
  const warnings = entries.filter((entry) => entry.severity === "warning").map((entry) => entry.code);
  return Object.freeze({
    status,
    codes: Object.freeze(entries.map((entry) => entry.code)),
    warnings: Object.freeze(warnings),
    extractedFieldNames: Object.freeze(extractedFieldNames),
    missingRequiredFields: Object.freeze(missingRequiredFields),
    unsupportedConstructs: Object.freeze(unsupportedConstructs),
    explanation:
      status === "success"
        ? "Executive intent extracted from explicit language."
        : status === "partial"
          ? "Executive intent partially extracted; review diagnostics."
          : "Executive intent extraction failed.",
    entries: Object.freeze(entries),
    readOnly: true,
  });
}

export function extractExecutiveIntent(request: IntentExtractionRequest): IntentExtractionResult {
  const diagnostics: IntentExtractionDiagnostic[] = [];
  const languageCode = request.languageCode ?? "en";
  const adapter = resolveIntentExtractionLanguageAdapter(languageCode);
  const normalized = adapter.normalizeText(request.text);
  const extractionId = deterministicId("extraction", `${request.workspaceId}|${request.text}`);

  if (normalized.length === 0) {
    pushDiagnostic(diagnostics, "empty_input", "Extraction input is empty.", request.generatedAt, {
      blocking: true,
    });
    return createIntentExtractionResult({
      extractionId,
      status: "failed",
      intents: Object.freeze([]),
      primaryIntent: null,
      goals: Object.freeze([]),
      targets: Object.freeze([]),
      constraints: Object.freeze([]),
      assumptions: Object.freeze([]),
      timeReferences: Object.freeze([]),
      evidence: Object.freeze([]),
      actors: Object.freeze([]),
      diagnostics: buildExtractionDiagnostics(diagnostics, "failed", Object.freeze([]), Object.freeze(["text"]), Object.freeze([])),
      metadata: Object.freeze({
        extractionId,
        languageCode: adapter.languageCode,
        ruleSetVersion: EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION,
        inputLength: 0,
        segmentCount: 0,
        explicitPriority: false,
        explicitScope: false,
        explicitCategory: false,
        readOnly: true as const,
      }),
      timestamp: request.generatedAt,
      contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    });
  }

  if (languageCode !== adapter.languageCode && languageCode !== "en") {
    pushDiagnostic(
      diagnostics,
      "language_adapter_fallback",
      `Language adapter fallback applied for "${languageCode}".`,
      request.generatedAt
    );
  }

  const segments = splitSegments(request.text);
  const constraints = extractIntentConstraints(request.text, languageCode);
  const assumptions = extractIntentAssumptions(request.text, languageCode);
  const timeReferences = extractIntentTimeReferences(request.text, languageCode);
  const evidence = extractIntentEvidence(request.text, languageCode);
  const actors = extractIntentActors(request.text, languageCode);

  if (segments.length > 1) {
    pushDiagnostic(
      diagnostics,
      "multiple_intents_found",
      `${segments.length} independent intent segments detected.`,
      request.generatedAt,
      Object.freeze({ metadata: Object.freeze({ segmentCount: segments.length }) })
    );
  }

  for (const marker of adapter.conflictMarkers) {
    if (normalized.includes(marker)) {
      pushDiagnostic(
        diagnostics,
        "conflicting_statements",
        "Conflicting statements detected in input.",
        request.generatedAt
      );
      break;
    }
  }

  const shared = Object.freeze({ constraints, assumptions, evidence, timeReferences, actors });
  const allGoals: ExtractedGoal[] = [];
  const allTargets: ExtractedTarget[] = [];
  const intents: ExecutiveIntent[] = [];
  const missingRequiredFields: string[] = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index] ?? "";
    const actionVerb = findActionVerb(segment, adapter);
    const targetObject = extractTargetObject(segment, adapter);

    if (!actionVerb) {
      pushDiagnostic(
        diagnostics,
        "no_action_verb",
        "No explicit action verb found in segment.",
        request.generatedAt,
        Object.freeze({ metadata: Object.freeze({ segment }) })
      );
      missingRequiredFields.push("actionVerb");
      continue;
    }

    if (!targetObject) {
      pushDiagnostic(
        diagnostics,
        "target_not_specified",
        "No explicit target object found in segment.",
        request.generatedAt,
        Object.freeze({ metadata: Object.freeze({ segment }) })
      );
      missingRequiredFields.push("targetObject");
      continue;
    }

    const built = buildExecutiveIntentFromSegment(request, segment, index, adapter, shared);
    allGoals.push(...built.goals);
    allTargets.push(...built.targets);
    if (built.intent) intents.push(built.intent);
  }

  if (intents.length === 0) {
    pushDiagnostic(
      diagnostics,
      "intent_not_found",
      "No executive intent could be extracted.",
      request.generatedAt,
      Object.freeze({ blocking: true })
    );
  }

  const explicitPriority =
    request.explicitPriority !== undefined && request.explicitPriority !== null
      ? true
      : resolveExplicitPriority(request.text, adapter) !== null;
  const explicitScope =
    request.explicitScope !== undefined && request.explicitScope !== null
      ? true
      : resolveExplicitScope(request.text, adapter) !== null;
  const explicitCategory = resolveExplicitCategory(request.text, adapter) !== null;

  if (!explicitPriority) {
    pushDiagnostic(
      diagnostics,
      "priority_not_explicit",
      "Priority not explicitly stated; contract placeholder applied.",
      request.generatedAt
    );
  }
  if (!explicitScope) {
    pushDiagnostic(
      diagnostics,
      "scope_not_explicit",
      "Scope not explicitly stated; custom scope applied when needed.",
      request.generatedAt
    );
  }
  if (!explicitCategory) {
    pushDiagnostic(
      diagnostics,
      "category_not_explicit",
      "Category not explicitly matched; custom category may apply.",
      request.generatedAt
    );
  }

  if (timeReferences.length > 1) {
    pushDiagnostic(
      diagnostics,
      "ambiguous_time_reference",
      "Multiple time references detected.",
      request.generatedAt
    );
  }

  const hasBlockingError = diagnostics.some((entry) => entry.blocking && entry.severity === "error");
  let status: IntentExtractionStatus = "success";
  if (hasBlockingError || intents.length === 0) status = "failed";
  else if (diagnostics.some((entry) => entry.severity === "warning")) status = "partial";

  if (status === "success" || (status === "partial" && intents.length > 0)) {
    pushDiagnostic(
      diagnostics,
      "successful_extraction",
      "Structured executive intent extracted.",
      request.generatedAt
    );
  }

  const extractedFieldNames = Object.freeze(
    [
      intents.length > 0 ? "ExecutiveIntent" : null,
      allGoals.length > 0 ? "ExtractedGoal" : null,
      allTargets.length > 0 ? "ExtractedTarget" : null,
      constraints.length > 0 ? "ExtractedConstraint" : null,
      assumptions.length > 0 ? "ExtractedAssumption" : null,
      timeReferences.length > 0 ? "ExtractedTimeReference" : null,
      evidence.length > 0 ? "ExtractedEvidence" : null,
      actors.length > 0 ? "ExtractedActor" : null,
    ].filter((entry): entry is string => entry !== null)
  );

  const metadata: ExtractionMetadata = Object.freeze({
    extractionId,
    languageCode: adapter.languageCode,
    ruleSetVersion: EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION,
    inputLength: request.text.length,
    segmentCount: segments.length,
    explicitPriority,
    explicitScope,
    explicitCategory,
    readOnly: true,
  });

  return createIntentExtractionResult({
    extractionId,
    status,
    intents: Object.freeze(intents),
    primaryIntent: intents[0] ?? null,
    goals: Object.freeze(allGoals),
    targets: Object.freeze(allTargets),
    constraints,
    assumptions,
    timeReferences,
    evidence,
    actors,
    diagnostics: buildExtractionDiagnostics(
      diagnostics,
      status,
      extractedFieldNames,
      Object.freeze(missingRequiredFields),
      Object.freeze([])
    ),
    metadata,
    timestamp: request.generatedAt,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
  });
}

export function extractExecutiveIntentBatch(
  requests: readonly IntentExtractionRequest[]
): IntentExtractionBatchResult {
  const results = Object.freeze(requests.map((request) => extractExecutiveIntent(request)));
  return Object.freeze({
    results,
    successCount: results.filter((entry) => entry.status === "success").length,
    partialCount: results.filter((entry) => entry.status === "partial").length,
    failedCount: results.filter((entry) => entry.status === "failed").length,
    readOnly: true,
  });
}

export function extractExecutiveIntentExample(
  exampleId: string,
  workspaceId: string = "ws-example-001",
  owner: string = "executive-owner",
  generatedAt: string = new Date(0).toISOString()
): IntentExtractionResult | null {
  const example = getIntentExtractionCanonicalExample(exampleId);
  if (!example) return null;
  return extractExecutiveIntent(
    Object.freeze({
      text: example.text,
      workspaceId,
      owner,
      languageCode: example.languageCode,
      generatedAt,
    })
  );
}

export function validateExtractionResult(
  result: IntentExtractionResult
): IntentExtractionValidationResult {
  const issues: string[] = [];
  if (result.readOnly !== true) issues.push("Extraction result must be read-only.");
  for (const intent of result.intents) {
    const validation = validateExecutiveIntentShape(intent);
    if (!validation.valid) {
      issues.push(
        ...validation.issues.map((issue) => `${intent.intentId}: ${issue.code} ${issue.message}`)
      );
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true,
  });
}

export function getExecutiveIntentExtractionEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION;
  contractVersion: typeof EXECUTIVE_INTENT_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_INTENT_EXTRACTION_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    owner: EXECUTIVE_INTENT_EXTRACTION_ENGINE_OWNER,
  });
}

export const ExecutiveIntentExtractionEngine = Object.freeze({
  extractExecutiveIntent,
  extractExecutiveIntentBatch,
  extractExecutiveIntentExample,
  extractIntentTargets,
  extractIntentConstraints,
  extractIntentAssumptions,
  extractIntentTimeReferences,
  extractIntentEvidence,
  extractIntentActors,
  validateExtractionResult,
  getExecutiveIntentExtractionEngineVersionMetadata,
  version: EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
  rules: EXECUTIVE_INTENT_EXTRACTION_ENGINE_RULES,
});

export type {
  IntentExtractionRequest,
  IntentExtractionResult,
  IntentExtractionBatchResult,
  IntentExtractionValidationResult,
};
