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

export function buildNexoraConversationalExperienceResponse(input: {
  readonly status: NexoraConversationalExperienceStatus;
  readonly intent: NexoraConversationalIntent;
  readonly context: NexoraResolvedConversationalContext;
  readonly command: NexoraConversationalCommand | null;
  readonly runtime: NexoraConversationalRuntimeBridgeResult | null;
  readonly utterance: string;
  readonly experienceResolution?: NexoraConversationalExperienceContextResolution | null;
  readonly recommendationResult?: NexoraExecutiveRecommendationResult | null;
}): string {
  const {
    status,
    intent,
    context,
    command,
    runtime,
    experienceResolution,
    recommendationResult,
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
        return "I couldn't map that to a Nexora command.";
      }
      if (command.kind === "compare-subjects") {
        return "Comparison control isn't available yet.";
      }
      if (command.kind === "reveal-goals") {
        return "Goals collection control isn't available yet.";
      }
      if (command.kind === "simulate-scenario") {
        return "Full simulation isn't available yet.";
      }
      return "That control isn't available yet.";

    case "confirmation-required":
      return "That command needs confirmation before Nexora can proceed.";

    case "no-op":
      if (experienceResolution?.decision === "keep-current" && experienceLabel) {
        return `You're already in the ${experienceLabel} context.`;
      }
      return label
        ? `Already on ${label}.`
        : "No change — that command was already applied.";

    case "failed":
      return "Nexora couldn't complete that command.";

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
      return "Nexora couldn't complete that command.";
  }
}

function buildRecommendationResponse(input: {
  readonly intentKind: string;
  readonly label: string | null;
  readonly recommendationResult: NexoraExecutiveRecommendationResult;
}): string {
  const { recommendationResult, intentKind, label } = input;
  const primary = recommendationResult.primaryRecommendation;

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
      .slice(0, 3)
      .map((r) => `- ${r.summary}`)
      .join("\n");
    return [
      primary.summary,
      reasons ? `Why:\n${reasons}` : null,
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
