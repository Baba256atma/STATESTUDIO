/**
 * CC:5 — Deterministic conversational experience response copy.
 *
 * Short executive confirmations — Stage is primary feedback.
 * CC:8 recommendation responses stay concise and status-faithful.
 */

import type { NexoraConversationalCommand } from "./conversationalCommand.ts";
import type { NexoraConversationalIntent } from "./conversationalIntent.ts";
import type { NexoraResolvedConversationalContext } from "./conversationalContext.ts";
import type { NexoraConversationalRuntimeBridgeResult } from "./conversationalRuntimeBridge.ts";
import type { NexoraConversationalExperienceStatus } from "./conversationalExperience.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import { getNexoraRegisteredExecutiveExperiences } from "./conversationalExperienceRegistry.ts";
import type { NexoraExecutiveRecommendationResult } from "./executiveRecommendation.ts";
import type { NexoraExecutiveScenarioConversationResult } from "./executiveScenarioResolver.ts";
import type { NexoraDecisionCommitmentResult } from "./executiveDecisionCommitmentResolver.ts";
import type { NexoraConversationalAdvisorGrounding } from "./conversationalExperience.ts";
import type { NexoraPendingTurnResolution } from "./conversationalTurnExpectation.ts";

export function buildNexoraConversationalExperienceResponse(input: {
  readonly status: NexoraConversationalExperienceStatus;
  readonly intent: NexoraConversationalIntent;
  readonly context: NexoraResolvedConversationalContext;
  readonly command: NexoraConversationalCommand | null;
  readonly runtime: NexoraConversationalRuntimeBridgeResult | null;
  readonly utterance: string;
  readonly experienceResolution?: NexoraConversationalExperienceContextResolution | null;
  readonly recommendationResult?: NexoraExecutiveRecommendationResult | null;
  readonly scenarioResult?: NexoraExecutiveScenarioConversationResult | null;
  readonly decisionCommitmentResult?: NexoraDecisionCommitmentResult | null;
  readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
  readonly pendingTurnResolution?: NexoraPendingTurnResolution | null;
  readonly bareSubjectReference?: boolean;
  readonly safeActionNavigation?: boolean;
}): string {
  const {
    status,
    intent,
    context,
    command,
    runtime,
    experienceResolution,
    recommendationResult,
    scenarioResult,
    decisionCommitmentResult,
    advisorGrounding,
    pendingTurnResolution,
    bareSubjectReference,
    safeActionNavigation,
  } = input;
  const label =
    context.primarySubject?.canonicalName ??
    intent.targetHints.find((h) => h.role === "primary")?.raw ??
    intent.targetHints[0]?.raw ??
    null;
  const experienceLabel = resolveExperienceLabel(experienceResolution);
  const hintRaw =
    intent.targetHints.find((h) => h.role === "experience")?.raw ??
    intent.targetHints[0]?.raw;

  if (intent.kind === "greet" || intent.kind === "help") {
    const attention =
      recommendationResult?.assessment.issues[0]?.summary ??
      recommendationResult?.assessment.constraints[0]?.summary ??
      null;
    if (intent.kind === "help") {
      return attention
        ? `${managerSummary(attention)} You can ask what is happening, why it matters, what I recommend, or tell me what to focus on.`
        : "I can explain the current context, show available evidence, recommend a grounded next step, or focus the Stage on a subject.";
    }
    return attention
      ? `Hi. I’m ready. ${managerSummary(attention)} Would you like to review it?`
      : "Hi. I’m ready. What would you like to review?";
  }

  if (decisionCommitmentResult) {
    if (
      decisionCommitmentResult.status === "clarification-required" ||
      decisionCommitmentResult.status === "confirmation-required"
    ) {
      return (
        decisionCommitmentResult.clarificationPrompt ??
        decisionCommitmentResult.summary
      );
    }
    return decisionCommitmentResult.summary;
  }

  if (scenarioResult) {
    if (scenarioResult.status === "clarification-required") {
      return scenarioResult.clarificationPrompt ?? "For what time horizon?";
    }
    return scenarioResult.summary;
  }

  if (
    pendingTurnResolution?.status === "answered" &&
    pendingTurnResolution.expectation.questionKind === "review-subject"
  ) {
    if (
      advisorGrounding &&
      advisorGroundingMatchesContext(
        advisorGrounding,
        context.primarySubject?.subjectId ?? null,
      )
    ) {
      return buildAdvisorGroundedResponse("situation", advisorGrounding);
    }
    if (recommendationResult) {
      return buildReviewConfirmationResponse(label, recommendationResult);
    }
    return label
      ? `Reviewing ${label}. Ask me to explain the situation, evidence, or recommendation.`
      : "The subject is ready for review.";
  }

  if (safeActionNavigation) {
    if (
      advisorGrounding &&
      advisorGroundingMatchesContext(
        advisorGrounding,
        context.primarySubject?.subjectId ?? null,
      )
    ) {
      return buildAdvisorGroundedResponse("situation", advisorGrounding);
    }
    if (recommendationResult) {
      return buildReviewConfirmationResponse(label, recommendationResult);
    }
    return label
      ? `${label} is now in focus.`
      : "The requested subject is now in focus.";
  }

  if (bareSubjectReference && runtime?.status === "no-op" && label) {
    return `${label} is already the current subject. You can ask me to explain the situation, show the evidence, or review the recommendation.`;
  }

  if (
    status === "applied" &&
    advisorGrounding &&
    (intent.kind === "situation" ||
      intent.kind === "explain" ||
      intent.kind === "recommend") &&
    advisorGroundingMatchesContext(advisorGrounding, context.primarySubject?.subjectId ?? null)
  ) {
    return buildAdvisorGroundedResponse(intent.kind, advisorGrounding);
  }

  if (
    status === "applied" &&
    recommendationResult &&
    (intent.kind === "recommend" ||
      intent.kind === "explain" ||
      intent.kind === "prioritize" ||
      command?.kind === "request-recommendation" ||
      command?.kind === "request-explanation" ||
      command?.kind === "request-prioritization")
  ) {
    return buildRecommendationResponse({
      intentKind: intent.kind,
      label,
      recommendationResult,
    });
  }

  switch (status) {
    case "clarification-required":
      if (experienceResolution?.decision === "clarification-required") {
        return "Which review do you want to prepare?";
      }
      if (context.resolutionStatus === "ambiguous") {
        if (hintRaw) {
          return `I found more than one “${titleCase(hintRaw)}”. Which one do you mean?`;
        }
        return "I found more than one match. Which one do you mean?";
      }
      if (
        intent.kind === "prepare-context" &&
        intent.requiresContext &&
        !hintRaw
      ) {
        return "Which executive context should I prepare?";
      }
      return "Which item do you mean?";

    case "not-found":
      if (
        intent.kind === "prepare-context" ||
        intent.kind === "switch-workspace"
      ) {
        return "That executive context isn't available yet.";
      }
      return hintRaw
        ? `I couldn't find “${titleCase(hintRaw)}” in the current Nexora context.`
        : "I couldn't find that in the current Nexora context.";

    case "unsupported":
      if (intent.kind === "unknown" || command == null) {
        return "I’m not sure how that relates to the current executive context. Try asking me to explain the situation, evidence, recommendation, scenario, decision, or execution.";
      }
      if (command.kind === "compare-subjects") {
        return "I can’t compare those subjects with the available validated context yet.";
      }
      if (command.kind === "reveal-goals") {
        return "I can’t open that goal view in the current executive context.";
      }
      if (command.kind === "simulate-scenario") {
        return "I can explain the available scenarios, but a full simulation is not available in this context.";
      }
      return "That request is not available in the current executive context.";

    case "confirmation-required":
      return "That request needs confirmation before Nexora can proceed.";

    case "no-op":
      if (experienceResolution?.decision === "keep-current" && experienceLabel) {
        return `You're already in the ${experienceLabel} context.`;
      }
      return label
        ? `Already on ${label}.`
        : "No change — that command was already applied.";

    case "failed":
      return "Nexora couldn’t complete that request. Please try again.";

    case "applied":
      return buildAppliedResponse(
        intent.kind,
        command,
        label,
        runtime,
        experienceLabel,
        experienceResolution,
      );

    default:
      return "Nexora couldn’t complete that request. Please try again.";
  }
}

function buildReviewConfirmationResponse(
  label: string | null,
  recommendationResult: NexoraExecutiveRecommendationResult,
): string {
  const primarySubjectId = recommendationResult.assessment.primarySubjectId;
  const situation =
    recommendationResult.assessment.issues.find(
      (item) => item.subjectId === primarySubjectId,
    )?.summary ??
    recommendationResult.assessment.constraints.find(
      (item) => item.subjectId === primarySubjectId,
    )?.summary ??
    recommendationResult.assessment.opportunities.find(
      (item) => item.subjectId === primarySubjectId,
    )?.summary ??
    null;
  const recommendation = recommendationResult.primaryRecommendation;
  return [
    situation
      ? managerSummary(situation)
      : label
        ? `${label} is ready for review.`
        : "The subject is ready for review.",
    recommendation
      ? `Recommendation: ${managerSummary(recommendation.summary)}`
      : "Evidence is limited, so Nexora cannot recommend a stronger action yet.",
  ].join(" ");
}

function advisorGroundingMatchesContext(
  grounding: NexoraConversationalAdvisorGrounding,
  primarySubjectId: string | null,
): boolean {
  return grounding.isOverview
    ? primarySubjectId == null
    : grounding.currentSubjectId === primarySubjectId;
}

function buildAdvisorGroundedResponse(
  intentKind: string,
  grounding: NexoraConversationalAdvisorGrounding,
): string {
  if (intentKind === "recommend") {
    if (!grounding.recommendation) {
      return (
        grounding.noRecommendationReason ??
        grounding.evidenceSummary ??
        "No grounded recommendation is available for this context."
      );
    }
    return [
      `Recommendation: ${withPeriod(grounding.recommendation)}`,
      grounding.primaryActionLabel &&
      normalizeStatement(grounding.primaryActionLabel) !==
        normalizeStatement(grounding.recommendation)
        ? `Next: ${withPeriod(grounding.primaryActionLabel)}`
        : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (grounding.isOverview) {
    return [
      "Executive Overview. No explicit subject is selected.",
      grounding.attentionReason
        ? withPeriod(grounding.attentionReason)
        : grounding.situation
          ? withPeriod(grounding.situation)
          : null,
      grounding.whyItMatters
        ? withPeriod(grounding.whyItMatters)
        : grounding.evidenceSummary
          ? withPeriod(grounding.evidenceSummary)
          : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (intentKind === "explain") {
    return [
      grounding.whyItMatters
        ? withPeriod(grounding.whyItMatters)
        : grounding.situation
          ? withPeriod(grounding.situation)
          : null,
      grounding.recommendation
        ? `Recommendation: ${withPeriod(grounding.recommendation)}`
        : grounding.evidenceSummary
          ? withPeriod(grounding.evidenceSummary)
          : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    grounding.situation ? withPeriod(grounding.situation) : null,
    grounding.whyItMatters ? withPeriod(grounding.whyItMatters) : null,
    grounding.recommendation
      ? `Recommendation: ${withPeriod(grounding.recommendation)}`
      : grounding.noRecommendationReason
        ? withPeriod(grounding.noRecommendationReason)
        : grounding.evidenceSummary
          ? withPeriod(grounding.evidenceSummary)
          : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function withPeriod(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function normalizeStatement(value: string): string {
  return value.toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " ").trim();
}

function buildRecommendationResponse(input: {
  readonly intentKind: string;
  readonly label: string | null;
  readonly recommendationResult: NexoraExecutiveRecommendationResult;
}): string {
  const { recommendationResult, intentKind, label } = input;
  const primary = recommendationResult.primaryRecommendation;
  const assessment = recommendationResult.assessment;

  if (intentKind === "change") {
    return label
      ? `I don’t have a validated prior-state comparison for ${label} in this session yet.`
      : "I don’t have a validated prior-state comparison for the current context yet.";
  }

  if (intentKind === "evidence") {
    const summaries = [
      ...assessment.issues.map((item) => item.summary),
      ...assessment.constraints.map((item) => item.summary),
      ...(primary?.rationale.map((item) => item.summary) ?? []),
    ]
      .map(managerSummary)
      .filter((item, index, all) => all.indexOf(item) === index);
    const sourceKinds = [
      ...(primary?.evidenceRefs ?? []),
      ...assessment.issues.flatMap((item) => item.evidenceRefs),
      ...assessment.constraints.flatMap((item) => item.evidenceRefs),
    ]
      .map((reference) => executiveSourceLabel(reference.sourceKind))
      .filter((item, index, all) => all.indexOf(item) === index);
    if (summaries.length === 0 || sourceKinds.length === 0) {
      return "Evidence is currently limited. I don’t have enough validated information to support a stronger answer.";
    }
    return `${summaries.slice(0, 2).join(" ")} Evidence: ${sourceKinds.join(", ")}.`;
  }

  if (intentKind === "situation") {
    const situation =
      assessment.issues[0]?.summary ??
      assessment.constraints[0]?.summary ??
      assessment.opportunities[0]?.summary ??
      primary?.rationale[0]?.summary ??
      null;
    if (!situation) {
      return "Evidence is currently limited. I can’t establish a validated situation for this context yet.";
    }
    const next = primary?.nextBestActions[0]?.label;
    return [managerSummary(situation), next ? `Next: ${next}.` : null]
      .filter(Boolean)
      .join(" ");
  }

  if (intentKind === "risk") {
    const risk =
      assessment.conflicts[0]?.summary ??
      assessment.issues.find(
        (item) => item.severity === "critical" || item.severity === "important",
      )?.summary ??
      assessment.constraints[0]?.summary ??
      primary?.uncertainties[0]?.description ??
      null;
    return risk
      ? `${managerSummary(risk)} ${primary?.uncertainties[0] ? `Uncertainty: ${primary.uncertainties[0].description}` : "No causal claim is implied."}`
      : "I don’t have a validated risk signal for this context.";
  }

  if (intentKind === "decision-status") {
    if (!primary || recommendationResult.status === "insufficient-evidence") {
      return "No current decision requirement is supported by the available evidence.";
    }
    return primary.requiresDecisionCommitment
      ? `${primary.summary} A decision requires explicit review and commitment; a preference alone will not commit it.`
      : `${primary.summary} No explicit decision commitment is required yet.`;
  }

  if (intentKind === "execution-status") {
    const state =
      assessment.issues[0]?.summary ??
      assessment.constraints[0]?.summary ??
      primary?.rationale[0]?.summary ??
      null;
    const next = primary?.nextBestActions[0]?.label;
    if (!state) {
      return "I don’t have enough validated execution information to answer that yet.";
    }
    return [managerSummary(state), next ? `Next: ${next}.` : null]
      .filter(Boolean)
      .join(" ");
  }

  if (recommendationResult.status === "insufficient-evidence" || !primary) {
    return "I don't have enough evidence to recommend a course of action yet.";
  }

  if (recommendationResult.status === "conflicted") {
    const why = primary.rationale[0]?.summary;
    const lines = [
      primary.summary,
      why ? `Why: ${why}` : null,
      primary.tradeoffs[0]
        ? `Trade-off: ${primary.tradeoffs[0].upside} / ${primary.tradeoffs[0].downside}`
        : null,
      primary.requiresScenarioAnalysis
        ? "Scenario analysis is needed before committing."
        : null,
    ].filter(Boolean);
    return lines.join("\n");
  }

  if (intentKind === "explain") {
    const reasons = primary.rationale
      .slice(0, 1)
      .map((r) => r.summary)
      .join("\n");
    return [
      primary.summary,
      reasons ? `Why: ${reasons}` : null,
      primary.uncertainties[0]
        ? `Uncertainty: ${primary.uncertainties[0].description}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (intentKind === "prioritize") {
    const subject = label ?? primary.subjectIds[0] ?? "the current subject";
    return [
      `${subject} is the main priority under current evidence.`,
      `Recommendation: ${primary.summary}`,
      primary.rationale[0] ? `Why: ${primary.rationale[0].summary}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const lines = [
    `Recommendation: ${primary.summary}`,
    primary.rationale[0] ? `Why: ${primary.rationale[0].summary}` : null,
    primary.uncertainties[0]
      ? `Uncertainty: ${primary.uncertainties[0].description}`
      : null,
    primary.requiresScenarioAnalysis
      ? "Scenario analysis is needed before committing."
      : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function executiveSourceLabel(sourceKind: string): string {
  switch (sourceKind) {
    case "data-reality":
      return "validated operating data";
    case "kpi":
      return "current KPI signals";
    case "relationship":
      return "recorded business relationships";
    case "goal":
      return "current goals";
    case "problem":
      return "recorded problems";
    case "scenario":
      return "scenario assumptions";
    case "decision":
      return "decision records";
    case "execution":
      return "execution records";
    case "runtime":
      return "current runtime state";
    default:
      return "validated evidence";
  }
}

function managerSummary(value: string): string {
  return value
    .replace(/\s+shows critical\./i, " needs urgent attention.")
    .replace(/\s+shows (?:important|elevated)\./i, " needs attention.")
    .replace(/\s+shows normal\./i, " is stable.");
}

function resolveExperienceLabel(
  experienceResolution:
    | NexoraConversationalExperienceContextResolution
    | null
    | undefined,
): string | null {
  const id = experienceResolution?.targetExperienceContext.experienceId;
  if (!id) return null;
  const registered = getNexoraRegisteredExecutiveExperiences().find(
    (e) => e.id === id,
  );
  return registered?.label ?? titleCase(id.replace(/-/g, " "));
}

function buildAppliedResponse(
  intentKind: string,
  command: NexoraConversationalCommand | null,
  label: string | null,
  runtime: NexoraConversationalRuntimeBridgeResult | null,
  experienceLabel: string | null,
  experienceResolution:
    | NexoraConversationalExperienceContextResolution
    | null
    | undefined,
): string {
  const kind = command?.kind ?? intentKind;

  if (
    kind === "prepare-executive-context" ||
    kind === "switch-workspace" ||
    intentKind === "prepare-context" ||
    intentKind === "switch-workspace"
  ) {
    const base = experienceLabel
      ? `${experienceLabel} context is ready.`
      : "Executive context is ready.";
    if (label) {
      return `${base} Focused on ${label}.`;
    }
    return base;
  }

  if (
    experienceResolution?.decision === "keep-current" &&
    label &&
    (kind === "focus-subject" || intentKind === "prepare-context")
  ) {
    return experienceLabel
      ? `You're already in the ${experienceLabel} context. Focused on ${label}.`
      : `Focused on ${label}.`;
  }

  if (kind === "simulate-scenario") {
    return label
      ? `Scenario selected: ${label}. Full simulation is not available yet.`
      : "Scenario selected. Full simulation is not available yet.";
  }

  if (kind === "analyze-subject") {
    return label
      ? `Focused on ${label} for analysis.`
      : "Focused for analysis.";
  }

  if (kind === "explore-subject") {
    return label ? `Exploring ${label}.` : "Exploring.";
  }

  if (kind === "focus-subject") {
    return label ? `Focused on ${label}.` : "Focused.";
  }

  if (kind === "open-overview") {
    return "Returned to overview.";
  }

  if (kind === "navigate-back") {
    return "Returned to the previous view.";
  }

  if (kind === "navigate-forward") {
    return "Moved forward.";
  }

  if (kind === "reveal-related") {
    return label
      ? `Showing related context for ${label}.`
      : "Showing related context.";
  }

  if (
    kind === "reveal-problems" ||
    kind === "reveal-scenarios" ||
    kind === "reveal-decisions" ||
    kind === "reveal-execution"
  ) {
    const what =
      kind === "reveal-problems"
        ? "problems"
        : kind === "reveal-scenarios"
          ? "scenarios"
          : kind === "reveal-decisions"
            ? "decisions"
            : "execution";
    if (label && runtime?.runtimeActionKind === "select-interaction-subject") {
      return `Showing ${what} for ${label}.`;
    }
    return `Opened ${what}.`;
  }

  return label ? `Done — ${label}.` : "Done.";
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
