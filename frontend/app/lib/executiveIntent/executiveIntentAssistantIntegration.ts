/**
 * APP-3:12 — Executive Intent Assistant Integration.
 * Presentation layer only — consumes APP-3:11 reasoning model exclusively.
 */

import {
  createAssistantIntentDiagnostic,
  type AssistantIntentDiagnostic,
} from "./executiveIntentAssistantDiagnostics.ts";
import { getExecutiveIntentAssistantCanonicalExample } from "./executiveIntentAssistantExamples.ts";
import {
  CLARIFICATION_QUESTION_TEMPLATES,
  buildSectionFromTemplate,
  mapReasoningStatusToAssistantStatus,
  templateClassificationExplanation,
  templateConfidenceExplanation,
  templateConflictExplanation,
  templateDependencyExplanation,
  templateDiagnosticsBody,
  templateEvolutionExplanation,
  templateHighlights,
  templateIntentExplanation,
  templateKnownInformation,
  templateNoIntentSummary,
  templateOpenIssues,
  templateOverviewSummary,
  templateStateExplanation,
  templateUnknownInformation,
} from "./executiveIntentAssistantTemplates.ts";
import {
  createAssistantIntentResponse,
  EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION,
  type AssistantIntentClarification,
  type AssistantIntentExplanation,
  type AssistantIntentFlags,
  type AssistantIntentQuestion,
  type AssistantIntentResponse,
  type AssistantIntentSection,
  type AssistantIntentStatus,
  type AssistantIntentValidationResult,
  type AssistantIntentWarning,
  type AssistantClarificationQuestionType,
} from "./executiveIntentAssistantTypes.ts";
import {
  buildReasoningExample,
  buildReasoningProbe,
} from "./executiveIntentReasoningEngine.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_VERSION } from "./executiveIntentReasoningTypes.ts";
import type {
  ExecutiveIntentReadinessState,
  ExecutiveIntentReasoning,
} from "./executiveIntentReasoningTypes.ts";

export const EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_OWNER = "executive-intent-assistant" as const;

export const EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_TAGS = Object.freeze([
  "[APP3_12]",
  "[EXECUTIVE_INTENT_ASSISTANT]",
  "[ASSISTANT_INTEGRATION]",
  "[REASONING_CONSUMER]",
  "[READ_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES = Object.freeze({
  deterministic: true,
  pure: true,
  noSideEffects: true,
  noGlobalState: true,
  noStorage: true,
  noMutation: true,
  noRecommendations: true,
  noBusinessReasoning: true,
  reasoningConsumerOnly: true,
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
  diagnostics: AssistantIntentDiagnostic[],
  code: Parameters<typeof createAssistantIntentDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createAssistantIntentDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createAssistantIntentDiagnostic(code, message, timestamp, options));
}

function withSyntheticReadinessState(
  reasoning: ExecutiveIntentReasoning,
  state: ExecutiveIntentReadinessState
): ExecutiveIntentReasoning {
  const readinessAssessment = Object.freeze({
    ...reasoning.readinessAssessment,
    state,
    headline:
      state === "archived"
        ? "Intent is archived."
        : state === "blocked"
          ? "Intent is blocked."
          : reasoning.readinessAssessment.headline,
    explanation: reasoning.readinessAssessment.explanation,
    readyForAssistant: state === "ready" || state === "needs_clarification",
    readyForDashboard: state === "ready",
    blockingIssueCount: reasoning.readinessAssessment.blockingIssueCount,
    readOnly: true as const,
  });
  const summary = Object.freeze({
    ...reasoning.summary,
    readinessState: state,
    readOnly: true as const,
  });
  return Object.freeze({
    ...reasoning,
    summary,
    readinessAssessment,
  });
}

export function buildIntentStatus(
  reasoning: ExecutiveIntentReasoning | null
): AssistantIntentStatus {
  if (!reasoning) return "unknown";
  return mapReasoningStatusToAssistantStatus(reasoning.readinessAssessment.state);
}

export function buildIntentSummary(reasoning: ExecutiveIntentReasoning | null): string {
  if (!reasoning) return templateNoIntentSummary();
  return templateOverviewSummary(reasoning);
}

export function buildIntentHighlights(reasoning: ExecutiveIntentReasoning | null): readonly string[] {
  if (!reasoning) return Object.freeze([]);
  return templateHighlights(reasoning);
}

export function buildIntentClarificationQuestions(
  reasoning: ExecutiveIntentReasoning | null
): readonly AssistantIntentQuestion[] {
  if (!reasoning) return Object.freeze([]);

  const questions: AssistantIntentQuestion[] = [];
  const seen = new Set<AssistantClarificationQuestionType>();

  const addQuestion = (
    questionType: AssistantClarificationQuestionType,
    context: string
  ): void => {
    if (seen.has(questionType)) return;
    seen.add(questionType);
    questions.push(
      Object.freeze({
        questionId: deterministicId("assistant-question", questionType),
        questionType,
        prompt: CLARIFICATION_QUESTION_TEMPLATES[questionType],
        context,
        readOnly: true as const,
      })
    );
  };

  for (const issue of reasoning.issues) {
    if (issue.issueKey === "missing_deadline") {
      addQuestion("deadline", issue.description);
    } else if (issue.issueKey === "missing_target_value") {
      addQuestion("target_value", issue.description);
    } else if (issue.issueKey === "unknown_constraints") {
      addQuestion("constraint_clarification", issue.description);
    } else if (issue.issueKey === "incomplete_classification") {
      addQuestion("classification_clarification", issue.description);
    }
  }

  for (const unknown of reasoning.unknowns) {
    if (unknown.label.toLowerCase().includes("department")) {
      addQuestion("department_responsible", unknown.description);
    } else if (unknown.label.toLowerCase().includes("unit") || unknown.label.toLowerCase().includes("owner")) {
      addQuestion("business_unit_owner", unknown.description);
    } else if (unknown.label.toLowerCase().includes("target")) {
      addQuestion("target_value", unknown.description);
    } else if (unknown.label.toLowerCase().includes("deadline") || unknown.label.toLowerCase().includes("time")) {
      addQuestion("deadline", unknown.description);
    } else {
      addQuestion("general_unknown", unknown.description);
    }
  }

  if (
    reasoning.readinessAssessment.state === "needs_clarification" &&
    questions.length === 0
  ) {
    addQuestion("general_unknown", reasoning.readinessAssessment.explanation);
  }

  return Object.freeze(questions);
}

export function buildIntentWarnings(
  reasoning: ExecutiveIntentReasoning | null
): readonly AssistantIntentWarning[] {
  if (!reasoning) return Object.freeze([]);

  const warnings: AssistantIntentWarning[] = [];

  if (reasoning.flags.hasConflicts) {
    warnings.push(
      Object.freeze({
        warningId: deterministicId("assistant-warning", "conflict"),
        label: "Conflicts Present",
        message: templateConflictExplanation(reasoning),
        severity: "warning",
        readOnly: true as const,
      })
    );
  }
  if (reasoning.flags.lowConfidence) {
    warnings.push(
      Object.freeze({
        warningId: deterministicId("assistant-warning", "confidence"),
        label: "Low Confidence",
        message: templateConfidenceExplanation(reasoning),
        severity: "warning",
        readOnly: true as const,
      })
    );
  }
  if (reasoning.flags.hasDependencies) {
    warnings.push(
      Object.freeze({
        warningId: deterministicId("assistant-warning", "dependency"),
        label: "Dependencies Present",
        message: templateDependencyExplanation(reasoning),
        severity: "info",
        readOnly: true as const,
      })
    );
  }
  for (const issue of reasoning.issues.filter((entry) => entry.blocking)) {
    warnings.push(
      Object.freeze({
        warningId: deterministicId("assistant-warning", issue.issueId),
        label: issue.label,
        message: issue.description,
        severity: "error",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(warnings);
}

export function buildIntentExplanation(
  reasoning: ExecutiveIntentReasoning | null
): readonly AssistantIntentExplanation[] {
  if (!reasoning) return Object.freeze([]);

  const explanations: AssistantIntentExplanation[] = [
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "intent"),
      topic: "Intent",
      body: templateIntentExplanation(reasoning),
      sourceSection: "intent",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "state"),
      topic: "State",
      body: templateStateExplanation(reasoning),
      sourceSection: "state",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "classification"),
      topic: "Classification",
      body: templateClassificationExplanation(reasoning),
      sourceSection: "classification",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "confidence"),
      topic: "Confidence",
      body: templateConfidenceExplanation(reasoning),
      sourceSection: "confidence",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "conflicts"),
      topic: "Conflicts",
      body: templateConflictExplanation(reasoning),
      sourceSection: "conflicts",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "dependencies"),
      topic: "Dependencies",
      body: templateDependencyExplanation(reasoning),
      sourceSection: "dependencies",
      readOnly: true as const,
    }),
    Object.freeze({
      explanationId: deterministicId("assistant-explanation", "evolution"),
      topic: "Evolution",
      body: templateEvolutionExplanation(reasoning),
      sourceSection: "evolution",
      readOnly: true as const,
    }),
  ];

  return Object.freeze(explanations);
}

function buildAssistantSections(
  reasoning: ExecutiveIntentReasoning | null,
  questions: readonly AssistantIntentQuestion[]
): readonly AssistantIntentSection[] {
  if (!reasoning) {
    return Object.freeze([
      buildSectionFromTemplate({
        sectionId: deterministicId("assistant-section", "overview"),
        sectionKey: "overview",
        body: templateNoIntentSummary(),
        available: false,
      }),
    ]);
  }

  const timestamp = reasoning.timestamp;
  return Object.freeze([
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `overview:${timestamp}`),
      sectionKey: "overview",
      body: templateOverviewSummary(reasoning),
      available: true,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `intent:${timestamp}`),
      sectionKey: "intent",
      body: templateIntentExplanation(reasoning),
      available: true,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `state:${timestamp}`),
      sectionKey: "state",
      body: templateStateExplanation(reasoning),
      available: reasoning.sections.some((entry) => entry.sectionKey === "current_state" && entry.available),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `classification:${timestamp}`),
      sectionKey: "classification",
      body: templateClassificationExplanation(reasoning),
      available: reasoning.sections.some(
        (entry) => entry.sectionKey === "primary_classification" && entry.available
      ),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `confidence:${timestamp}`),
      sectionKey: "confidence",
      body: templateConfidenceExplanation(reasoning),
      available: reasoning.sections.some(
        (entry) => entry.sectionKey === "confidence_summary" && entry.available
      ),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `conflicts:${timestamp}`),
      sectionKey: "conflicts",
      body: templateConflictExplanation(reasoning),
      available: Boolean(reasoning.flags.hasConflicts),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `dependencies:${timestamp}`),
      sectionKey: "dependencies",
      body: templateDependencyExplanation(reasoning),
      available: Boolean(reasoning.flags.hasDependencies),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `evolution:${timestamp}`),
      sectionKey: "evolution",
      body: templateEvolutionExplanation(reasoning),
      available: Boolean(reasoning.flags.hasEvolutionHistory),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `known:${timestamp}`),
      sectionKey: "known_information",
      body: templateKnownInformation(reasoning),
      available: reasoning.sections.some(
        (entry) => entry.sectionKey === "known_information" && entry.available
      ),
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `unknown:${timestamp}`),
      sectionKey: "unknown_information",
      body: templateUnknownInformation(reasoning),
      available: reasoning.unknowns.length > 0,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `highlights:${timestamp}`),
      sectionKey: "highlights",
      body: templateHighlights(reasoning).join("; ") || "No highlights recorded.",
      available: reasoning.highlights.items.length > 0,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `issues:${timestamp}`),
      sectionKey: "issues",
      body: templateOpenIssues(reasoning).join("; ") || "No open issues recorded.",
      available: reasoning.issues.length > 0,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `questions:${timestamp}`),
      sectionKey: "questions",
      body: questions.map((entry) => entry.prompt).join(" ") || "No clarification questions.",
      available: questions.length > 0,
    }),
    buildSectionFromTemplate({
      sectionId: deterministicId("assistant-section", `diagnostics:${timestamp}`),
      sectionKey: "diagnostics",
      body: templateDiagnosticsBody(reasoning),
      available: reasoning.diagnostics.length > 0,
    }),
  ]);
}

function buildClarifications(
  reasoning: ExecutiveIntentReasoning | null,
  questions: readonly AssistantIntentQuestion[]
): AssistantIntentClarification | null {
  if (!reasoning || questions.length === 0) return null;

  return Object.freeze({
    clarificationId: deterministicId("assistant-clarification", reasoning.reasoningId),
    required:
      reasoning.readinessAssessment.state === "needs_clarification" ||
      reasoning.readinessAssessment.state === "incomplete",
    headline: "Clarification may help improve understanding of this executive intent.",
    questions,
    readOnly: true as const,
  });
}

function resolveAssistantFlags(input: Readonly<{
  reasoning: ExecutiveIntentReasoning | null;
  warnings: readonly AssistantIntentWarning[];
  questions: readonly AssistantIntentQuestion[];
}>): AssistantIntentFlags {
  return Object.freeze({
    assistantReady: Boolean(input.reasoning?.flags.readyForAssistant),
    reasoningAvailable: Boolean(input.reasoning),
    clarificationRequired: input.questions.length > 0,
    hasWarnings: input.warnings.length > 0,
    hasConflicts: Boolean(input.reasoning?.flags.hasConflicts),
    hasDependencies: Boolean(input.reasoning?.flags.hasDependencies),
    lowConfidence: Boolean(input.reasoning?.flags.lowConfidence),
    futureCompatible: true as const,
    readOnly: true as const,
    deterministic: true as const,
  });
}

export function buildAssistantIntentResponse(
  reasoning: ExecutiveIntentReasoning | null,
  timestamp: string = reasoning?.timestamp ?? new Date(0).toISOString()
): AssistantIntentResponse {
  const diagnostics: AssistantIntentDiagnostic[] = [];
  const status = buildIntentStatus(reasoning);
  const questions = buildIntentClarificationQuestions(reasoning);
  const warnings = buildIntentWarnings(reasoning);
  const sections = buildAssistantSections(reasoning, questions);
  const clarifications = buildClarifications(reasoning, questions);
  const flags = resolveAssistantFlags({ reasoning, warnings, questions });

  if (!reasoning) {
    pushDiagnostic(
      diagnostics,
      "no_executive_intent",
      "No executive intent reasoning model was provided.",
      timestamp
    );
    pushDiagnostic(
      diagnostics,
      "reasoning_unavailable",
      "Assistant cannot present intent without APP-3:11 reasoning.",
      timestamp
    );
  } else {
    if (flags.assistantReady) {
      pushDiagnostic(diagnostics, "assistant_ready", "Assistant is ready to present intent.", timestamp);
    }
    if (status === "ready") {
      pushDiagnostic(diagnostics, "intent_ready", "Executive intent is ready.", timestamp);
    }
    if (status === "incomplete") {
      pushDiagnostic(diagnostics, "intent_incomplete", "Executive intent is incomplete.", timestamp);
    }
    if (status === "archived") {
      pushDiagnostic(diagnostics, "archived_intent", "Executive intent is archived.", timestamp);
    }
    if (status === "blocked") {
      pushDiagnostic(diagnostics, "blocked_intent", "Executive intent is blocked.", timestamp);
    }
    if (flags.clarificationRequired) {
      pushDiagnostic(
        diagnostics,
        "clarification_required",
        "Clarification questions are available.",
        timestamp
      );
    }
    if (flags.lowConfidence) {
      pushDiagnostic(diagnostics, "low_confidence", "Low understanding confidence reported.", timestamp);
    }
    if (flags.hasConflicts) {
      pushDiagnostic(diagnostics, "conflict_present", "Conflicts are present.", timestamp);
    }
    if (flags.hasDependencies) {
      pushDiagnostic(diagnostics, "dependency_present", "Dependencies are present.", timestamp);
    }
  }

  pushDiagnostic(
    diagnostics,
    "assistant_response_success",
    "Assistant response built deterministically from reasoning model.",
    timestamp
  );

  return createAssistantIntentResponse({
    responseId: deterministicId(
      "assistant-intent-response",
      `${reasoning?.reasoningId ?? "none"}:${timestamp}`
    ),
    workspaceId: reasoning?.workspaceId ?? null,
    focusIntentId: reasoning?.focusIntentId ?? null,
    status,
    summary: buildIntentSummary(reasoning),
    sections,
    explanations: buildIntentExplanation(reasoning),
    warnings,
    clarifications,
    highlights: buildIntentHighlights(reasoning),
    openIssues: reasoning ? templateOpenIssues(reasoning) : Object.freeze([]),
    flags,
    diagnostics: Object.freeze([...diagnostics]),
    metadata: Object.freeze({
      assistantIntegrationVersion: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION,
      reasoningEngineVersion: reasoning?.metadata.reasoningEngineVersion ?? null,
      reasoningId: reasoning?.reasoningId ?? null,
      enginesConsumed: reasoning?.metadata.enginesConsumed ?? Object.freeze([]),
      sectionCount: sections.length,
      questionCount: questions.length,
      readOnly: true as const,
    }),
    timestamp,
  });
}

export function validateAssistantIntentResponse(
  response: AssistantIntentResponse
): AssistantIntentValidationResult {
  const issues: string[] = [];
  if (response.readOnly !== true) issues.push("Assistant response must be read-only.");
  if (response.flags.readOnly !== true) issues.push("Assistant flags must be read-only.");
  if (response.flags.deterministic !== true) issues.push("Assistant integration must be deterministic.");
  if (response.metadata.assistantIntegrationVersion !== EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION) {
    issues.push("Unexpected assistant integration version.");
  }
  if (response.metadata.reasoningEngineVersion && response.metadata.reasoningEngineVersion !== EXECUTIVE_INTENT_REASONING_ENGINE_VERSION) {
    issues.push("Unexpected reasoning engine version reference.");
  }
  if (response.clarifications && response.clarifications.questions.length !== response.metadata.questionCount) {
    issues.push("Question count metadata mismatch.");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function buildAssistantExample(
  exampleId: string,
  workspaceId: string = "ws-example-001",
  owner: string = "executive-owner",
  generatedAt: string = new Date(0).toISOString()
): AssistantIntentResponse | null {
  const example = getExecutiveIntentAssistantCanonicalExample(exampleId);
  if (!example) return null;

  if (!example.reasoningExampleId) {
    return buildAssistantIntentResponse(null, generatedAt);
  }

  const reasoning = buildReasoningExample(
    example.reasoningExampleId,
    workspaceId,
    owner,
    generatedAt
  );
  if (!reasoning) return null;

  const presentationReasoning = example.syntheticStatus
    ? withSyntheticReadinessState(
        reasoning,
        example.syntheticStatus as ExecutiveIntentReadinessState
      )
    : reasoning;

  const response = buildAssistantIntentResponse(presentationReasoning, generatedAt);

  if (exampleId === "multiple-intents") {
    const diagnostics = Object.freeze([
      ...response.diagnostics,
      createAssistantIntentDiagnostic(
        "multiple_intents_context",
        "Assistant presents one executive intent at a time.",
        generatedAt
      ),
    ]);
    return createAssistantIntentResponse({
      ...response,
      diagnostics,
    });
  }

  return response;
}

export function buildAssistantProbe(
  generatedAt: string = new Date(0).toISOString()
): AssistantIntentResponse {
  const reasoning = buildReasoningProbe(generatedAt);
  return buildAssistantIntentResponse(reasoning, generatedAt);
}

export function getExecutiveIntentAssistantIntegrationVersionMetadata(): Readonly<{
  assistantIntegrationVersion: typeof EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION;
  owner: typeof EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_OWNER;
}> {
  return Object.freeze({
    assistantIntegrationVersion: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION,
    owner: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_OWNER,
  });
}

export const ExecutiveIntentAssistantIntegration = Object.freeze({
  buildAssistantIntentResponse,
  buildIntentExplanation,
  buildIntentSummary,
  buildIntentWarnings,
  buildIntentClarificationQuestions,
  buildIntentHighlights,
  buildIntentStatus,
  validateAssistantIntentResponse,
  buildAssistantExample,
  buildAssistantProbe,
  getExecutiveIntentAssistantIntegrationVersionMetadata,
  version: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION,
  rules: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES,
  tags: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_TAGS,
});
