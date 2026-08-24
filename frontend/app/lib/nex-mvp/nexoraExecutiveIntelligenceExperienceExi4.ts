/**
 * EXI:4 — Executive Intelligence Presentation Consolidation.
 *
 * Presentation-only composition of CORE-INT:2–5 outputs.
 * Does not create claims, rank, bind constraints, or choose options.
 */

import type { NexoraExecutiveIntelligenceExperience } from "./nexoraExecutiveIntelligenceExperience.ts";
import type { NexoraExiTradeoffOption } from "./nexoraExecutiveIntelligenceExperienceGrounding.ts";

export const nexoraExi4PresentationIdentity =
  "EXI:4/ExecutiveIntelligencePresentation" as const;
export const nexoraExi4PresentationVersion = "1.0.0" as const;

export const NEXORA_EXI4_PRESENTATION_BOUNDARY = Object.freeze({
  presentationOnly: true as const,
  ownsReasoning: false as const,
  inventsClaims: false as const,
  inventsCausation: false as const,
  inventsConstraints: false as const,
  inventsPriority: false as const,
  inventsTradeoffs: false as const,
  inventsRecommendations: false as const,
  upgradesConfidence: false as const,
  fillsMissingEvidence: false as const,
  commitsDecisions: false as const,
  mutatesExecution: false as const,
  writesMemory: false as const,
  writesFocus: false as const,
  usesLlm: false as const,
  startsOutcomeLearning: false as const,
  changesStageTopology: false as const,
});

export type NexoraExi4OptionLineKind =
  | "benefit"
  | "sacrifice"
  | "risk"
  | "constraint"
  | "assumption"
  | "missing";

export type NexoraExi4OptionLine = Readonly<{
  readonly kind: NexoraExi4OptionLineKind;
  readonly text: string;
}>;

export type NexoraExi4OptionCard = Readonly<{
  readonly optionId: string;
  readonly title: string;
  readonly lines: readonly NexoraExi4OptionLine[];
}>;

export type NexoraExi4Presentation = Readonly<{
  readonly identity: typeof nexoraExi4PresentationIdentity;
  readonly recommendationTitle: "Nexora Recommendation";
  readonly situationTitle: string;
  readonly topPriorityLabel: string | null;
  readonly topPriorityWhy: string | null;
  readonly attentionLabel: string | null;
  readonly contributorTitle: "Possible contributors";
  readonly contributorStatement: string | null;
  readonly showRootCause: false;
  readonly constraintTitle: "Recorded Constraints" | "Binding Constraint";
  readonly constraintStatement: string | null;
  readonly bindingUnknownNote: string | null;
  readonly optionCards: readonly NexoraExi4OptionCard[];
  readonly optionSummary: string | null;
  readonly comparable: boolean;
  readonly missingNotes: readonly string[];
  readonly observed: string | null;
  readonly interpretation: string | null;
  readonly showFactVsInterpretation: boolean;
  readonly rootCauseNote: string | null;
  readonly confidenceLabel: string;
  readonly defaultDisclosure: "calm";
}>;

function firstSentence(text: string | null | undefined): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^[^.!?]+[.!?]?/);
  return match?.[0]?.trim() ?? trimmed;
}

function confidenceLabel(
  experience: Omit<NexoraExecutiveIntelligenceExperience, "presentation">,
): string {
  const state = experience.evidence.confidence;
  if (state === "strong") return "Evidence strong";
  if (state === "limited") return "Evidence limited";
  if (state === "incomplete") return "Evidence limited";
  if (state === "stale") return "Unknown";
  return "Unknown";
}

function optionLines(option: NexoraExiTradeoffOption): readonly NexoraExi4OptionLine[] {
  const lines: NexoraExi4OptionLine[] = [];
  if (option.benefits) {
    lines.push({ kind: "benefit", text: option.benefits });
  }
  if (option.costs) {
    lines.push({ kind: "sacrifice", text: option.costs });
  } else {
    lines.push({
      kind: "sacrifice",
      text: "No validated sacrifice is currently recorded.",
    });
  }
  if (option.risks) {
    lines.push({ kind: "risk", text: option.risks });
  }
  if (option.constraints) {
    lines.push({ kind: "constraint", text: option.constraints });
  }
  if (option.assumptions) {
    lines.push({ kind: "assumption", text: option.assumptions });
  }
  if (option.missingDimensions.includes("cost")) {
    lines.push({ kind: "missing", text: "Cost unknown" });
  }
  if (option.missingDimensions.includes("time")) {
    lines.push({ kind: "missing", text: "Time unknown" });
  }
  return Object.freeze(lines);
}

export function composeNexoraExi4Presentation(
  experience: Omit<NexoraExecutiveIntelligenceExperience, "presentation">,
): NexoraExi4Presentation {
  const top = experience.corePriorityAssessment.topPriority;
  const binding = experience.coreConstraintAssessment.bindingConstraint;
  const hasContributors =
    experience.causes.authority !== "missing" &&
    Boolean(experience.causes.statement);
  const hasConstraints =
    experience.coreConstraintAssessment.constraints.length > 0 ||
    experience.constraintAssessment.constraints.length > 0;
  const cards = experience.tradeoffAssessment.options.map((option) =>
    Object.freeze({
      optionId: option.optionId ?? option.label,
      title: option.label,
      lines: optionLines(option),
    }),
  );
  const missing = Object.freeze(
    [
      ...new Set(experience.coreTradeoffAssessment.missingDimensions),
    ].flatMap((dimension) => {
      if (dimension === "cost") return ["Cost unknown"];
      if (dimension === "time") return ["Time unknown"];
      if (dimension === "sacrifice") {
        return ["No validated sacrifice is currently recorded."];
      }
      return [];
    }),
  );
  const observation = experience.epistemicFoundation.observation;
  const interpretation = experience.epistemicFoundation.interpretation;
  const observed = observation?.managerStatement ?? null;
  const interpreted = interpretation?.managerStatement ?? null;
  return Object.freeze({
    identity: nexoraExi4PresentationIdentity,
    recommendationTitle: "Nexora Recommendation",
    situationTitle:
      experience.subjectKind === "scenario" ? "Projected Effect" : "Situation",
    topPriorityLabel: top?.subjectLabel ?? null,
    topPriorityWhy: firstSentence(
      experience.corePriorityAssessment.rationale[0] ??
        experience.priority.statement,
    ),
    attentionLabel: experience.isOverview
      ? (experience.attentionStatement.statement ?? null)
      : null,
    contributorTitle: "Possible contributors",
    contributorStatement: hasContributors
      ? experience.causes.statement
      : null,
    showRootCause: false,
    rootCauseNote:
      !experience.isOverview &&
      experience.coreCausalAssessment.rootCause == null &&
      (experience.subjectKind === "problem" ||
        experience.subjectKind === "risk" ||
        experience.subjectKind === "object")
        ? "Root cause has not been established."
        : null,
    constraintTitle: binding ? "Binding Constraint" : "Recorded Constraints",
    constraintStatement: hasConstraints
      ? experience.constraints.statement
      : null,
    bindingUnknownNote:
      hasConstraints && !binding
        ? "Nexora has not established which constraint is binding."
        : null,
    optionCards: Object.freeze(cards),
    optionSummary:
      cards.length >= 2
        ? cards.map((card) => card.title).join(" · ")
        : cards.length === 1
          ? `One evaluated option is currently available: ${cards[0]!.title}.`
          : null,
    comparable: experience.coreTradeoffAssessment.comparable,
    missingNotes: missing,
    observed,
    interpretation: interpreted,
    showFactVsInterpretation:
      Boolean(observed) &&
      Boolean(interpreted) &&
      observed !== interpreted,
    confidenceLabel: confidenceLabel(experience),
    defaultDisclosure: "calm",
  });
}
