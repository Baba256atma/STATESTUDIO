/**
 * UX:3 — Professional Advisor presentation composer.
 *
 * Composes existing Advisor / Insight / NBA / Brief / memory / data-reality
 * outputs into one executive-facing narrative:
 *
 *   SITUATION → WHY IT MATTERS → RECOMMENDATION → NEXT ACTION
 *
 * Does not own intelligence. Does not invent recommendations, causality,
 * confidence scores, or conversational replies.
 */

import type { DataRealityAwareAdvisorBindingResult } from "@/app/lib/data-reality/dataRealityAwareAdvisorExperienceBinding";
import type { ExecutiveDecisionBriefResult } from "@/app/lib/spatial-presentation/executiveStageDecisionBrief";
import type { ExecutiveDecisionMemoryView } from "@/app/lib/spatial-presentation/executiveStageDecisionMemory";
import type { ExecutiveNextBestActionResult } from "@/app/lib/spatial-presentation/executiveStageNextBestAction";
import type {
  NexoraMVPAdvisorViewModel,
  NexoraMVPExecutiveIntelligenceContext,
  NexoraMVPInsightViewModel,
  NexoraMVPIntelligenceAction,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import type { NexoraMVPAdvisorContextBridge } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures";

export const nexoraMVPProfessionalAdvisorPresentationIdentity =
  "UX:3/NexoraProfessionalAdvisorPresentation" as const;

export const NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY = Object.freeze({
  ownsAdvisorReasoning: false as const,
  inventsRecommendations: false as const,
  inventsCausality: false as const,
  inventsConfidence: false as const,
  introducesConversationalReplies: false as const,
  changesStageFocus: false as const,
  presentationCompositionOnly: true as const,
});

export type NexoraProfessionalAdvisorGrammarKind =
  | "overview"
  | "object"
  | "problem"
  | "opportunity"
  | "scenario"
  | "decision"
  | "execution"
  | "risk";

export type NexoraProfessionalEvidenceState =
  | "strong"
  | "limited"
  | "incomplete"
  | "stale"
  | "none";

export type NexoraProfessionalRecommendationAuthority =
  | "nba"
  | "decision-brief"
  | "data-reality"
  | "advisor-intelligence"
  | "none";

export type NexoraProfessionalAdvisorActionSource = "nba" | "advisor-intelligence";

export type NexoraProfessionalAdvisorAction = {
  readonly id: string;
  readonly label: string;
  readonly source: NexoraProfessionalAdvisorActionSource;
  readonly intelligenceAction?: NexoraMVPIntelligenceAction;
};

export type NexoraProfessionalAdvisorHeadings = {
  readonly situation: string;
  readonly why: string;
  readonly recommendation: string;
  readonly nextAction: string;
};

export type NexoraProfessionalAdvisorNarrative = {
  readonly grammarKind: NexoraProfessionalAdvisorGrammarKind;
  readonly headings: NexoraProfessionalAdvisorHeadings;
  readonly isOverview: boolean;
  readonly currentSubjectId: string | null;
  readonly currentSubjectLabel: string | null;
  readonly currentSubjectKind: string | null;
  readonly currentSubjectState: string | null;
  readonly attentionSubjectId: string | null;
  readonly attentionSubjectLabel: string | null;
  readonly attentionReason: string | null;
  readonly situation: string | null;
  readonly whyItMatters: string | null;
  readonly recommendation: string | null;
  readonly recommendationRationale: string | null;
  readonly recommendationAuthority: NexoraProfessionalRecommendationAuthority;
  readonly noRecommendationReason: string | null;
  readonly primaryAction: NexoraProfessionalAdvisorAction | null;
  readonly secondaryActions: readonly NexoraProfessionalAdvisorAction[];
  readonly evidenceState: NexoraProfessionalEvidenceState;
  readonly evidenceSummary: string | null;
  readonly recentChange: string | null;
  readonly decisionRequired: string | null;
  readonly assumptions: readonly string[];
  readonly tradeoffs: readonly string[];
};

const HEADINGS: Record<
  NexoraProfessionalAdvisorGrammarKind,
  NexoraProfessionalAdvisorHeadings
> = Object.freeze({
  overview: Object.freeze({
    situation: "Situation",
    why: "Why it matters",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  object: Object.freeze({
    situation: "Situation",
    why: "Why it matters",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  problem: Object.freeze({
    situation: "Problem",
    why: "Impact",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  opportunity: Object.freeze({
    situation: "Opportunity",
    why: "Potential value",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  scenario: Object.freeze({
    situation: "Scenario",
    why: "Expected impact",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  decision: Object.freeze({
    situation: "Decision",
    why: "Why it matters",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  execution: Object.freeze({
    situation: "Progress",
    why: "Blockers",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
  risk: Object.freeze({
    situation: "Risk",
    why: "Exposure",
    recommendation: "Recommendation",
    nextAction: "Next Action",
  }),
});

const RELATION_PHRASE: Readonly<Record<string, string>> = Object.freeze({
  blocks: "is associated with a constraint on",
  "constrained-by": "depends on",
  "depends-on": "depends on",
  influences: "is associated with",
  affects: "is associated with",
  "acts-on": "is associated with",
  "explored-by": "is explored with",
  sources: "is linked to",
  implements: "is linked to",
  related: "is related to",
});

function freezeNarrative(
  value: NexoraProfessionalAdvisorNarrative,
): NexoraProfessionalAdvisorNarrative {
  return Object.freeze({
    ...value,
    headings: Object.freeze({ ...value.headings }),
    secondaryActions: Object.freeze(value.secondaryActions.map((action) => Object.freeze(action))),
    assumptions: Object.freeze([...value.assumptions]),
    tradeoffs: Object.freeze([...value.tradeoffs]),
    ...(value.primaryAction ? { primaryAction: Object.freeze(value.primaryAction) } : {}),
  });
}

function humanLabel(id: string | null | undefined): string | null {
  if (id == null || id.length === 0) return null;
  const object = NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === id);
  if (object) return object.label;
  const context = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.id === id);
  if (context) return context.label;
  if (id.startsWith("obj-") || id.startsWith("ctx-")) return null;
  return id;
}

function normalizeKey(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function looksTechnical(text: string | null | undefined): boolean {
  if (text == null || text.length === 0) return false;
  return /bridge|resolver|runtime|binding|canonical|fixture|namespace|data-reality|obj-|ctx-|certified data is currently insufficient|nex-mvp|flowdomain|cc:11|adapter/i.test(
    text,
  );
}

function simplifyActionLabel(label: string): string {
  if (/^focus /i.test(label)) {
    return `Investigate ${label.slice(6)}`;
  }
  if (/^inspect /i.test(label)) {
    return `Investigate ${label.slice(8)}`;
  }
  return label;
}

function simplifyExecutiveStatement(value: string): string {
  const simplified = value
    .replace(/\bin a attention operating state\b/gi, "in a state that needs attention")
    .replace(/\bin a attention state\b/gi, "in a state that needs attention")
    .replace(/\bin attention state\b/gi, "and needs attention")
    .replace(/under review \(attention\)/gi, "under review and needs attention")
    .replace(/\bin a unresolved risk state\b/gi, "with unresolved risk exposure")
    .replace(/\bis currently with unresolved risk exposure\b/gi, "currently has unresolved risk exposure")
    .replace(/\s+/g, " ")
    .trim();
  return /[.!?]$/.test(simplified) ? simplified : `${simplified}.`;
}

function resolveGrammarKind(input: {
  readonly isOverview: boolean;
  readonly subjectKind: string | null;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
}): NexoraProfessionalAdvisorGrammarKind {
  if (input.isOverview) return "overview";
  const kind = (input.subjectKind ?? "").toLowerCase();
  if (kind === "problem") return "problem";
  if (kind === "opportunity") return "opportunity";
  if (kind === "scenario") return "scenario";
  if (kind === "decision") return "decision";
  if (kind === "execution") return "execution";
  if (kind === "risk") return "risk";
  if (input.subjectId === "obj-risk" || input.subjectLabel === "Risk") {
    return "risk";
  }
  return "object";
}

export function translateExecutiveEvidenceState(input: {
  readonly warning?: string | null;
  readonly unavailableInformation?: readonly string[];
  readonly unresolved?: boolean;
  readonly hasData?: boolean;
  readonly hasKpi?: boolean;
  readonly resolutionStatus?: string | null;
  readonly executiveState?: string | null;
}): {
  readonly state: NexoraProfessionalEvidenceState;
  readonly summary: string | null;
} {
  const blobs = [
    input.warning ?? "",
    ...(input.unavailableInformation ?? []),
    input.resolutionStatus ?? "",
    input.executiveState ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (/stale/.test(blobs)) {
    return Object.freeze({
      state: "stale" as const,
      summary: "Data stale. Nexora is working from information that may no longer be current.",
    });
  }

  if (
    /insufficient|unavailable/.test(blobs) ||
    input.resolutionStatus === "unavailable"
  ) {
    return Object.freeze({
      state: "limited" as const,
      summary:
        "Evidence limited. Nexora does not yet have enough validated data to assess this subject confidently.",
    });
  }

  if (
    input.unresolved === true ||
    input.resolutionStatus === "unresolved" ||
    input.executiveState === "unresolved" ||
    /unresolved/.test(blobs)
  ) {
    return Object.freeze({
      state: "incomplete" as const,
      summary: "Data incomplete. Validated evidence is still missing for this subject.",
    });
  }

  if (input.hasKpi === true || input.hasData === true) {
    return Object.freeze({
      state: "strong" as const,
      summary: "Evidence strong.",
    });
  }

  return Object.freeze({
    state: "none" as const,
    summary: "No validated evidence.",
  });
}

function phraseRelation(relation: string, targetLabel: string): string {
  const verb = RELATION_PHRASE[relation] ?? "is related to";
  return `${verb} ${targetLabel}`;
}

function uniqueTexts(values: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = value?.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    const key = normalizeKey(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

function sameAdvice(left: string | null | undefined, right: string | null | undefined): boolean {
  const a = normalizeKey(left);
  const b = normalizeKey(right);
  if (a.length === 0 || b.length === 0) return false;
  return a === b || a.includes(b) || b.includes(a);
}

export function composeNexoraProfessionalAdvisorPresentation(input: {
  readonly advisor: NexoraMVPAdvisorViewModel;
  readonly insight?: NexoraMVPInsightViewModel | null;
  readonly intelligence?: NexoraMVPExecutiveIntelligenceContext | null;
  readonly advisorBridge?: NexoraMVPAdvisorContextBridge | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
  readonly decisionBrief?: ExecutiveDecisionBriefResult | null;
  readonly decisionMemory?: ExecutiveDecisionMemoryView | null;
  readonly advisorBinding?: DataRealityAwareAdvisorBindingResult | null;
  readonly validatedDataSource?: boolean;
}): NexoraProfessionalAdvisorNarrative {
  const bridge = input.advisorBridge ?? null;
  const currentSubjectId =
    bridge?.advisorSubjectId ??
    (typeof input.advisor.subjectId === "string" && input.advisor.subjectId.length > 0
      ? input.advisor.subjectId
      : null);
  const isOverview = currentSubjectId == null;
  const currentSubjectKind = isOverview
    ? null
    : (bridge?.subjectKind ?? input.advisor.subjectKind);
  const currentSubjectLabel = isOverview
    ? null
    : (humanLabel(currentSubjectId) ??
      (looksTechnical(input.advisor.subjectLabel) ? null : input.advisor.subjectLabel) ??
      humanLabel(currentSubjectId));
  const grammarKind = resolveGrammarKind({
    isOverview,
    subjectKind: currentSubjectKind,
    subjectId: currentSubjectId,
    subjectLabel: currentSubjectLabel,
  });

  const attentionEntry = isOverview
    ? (input.intelligence?.overviewAttention[0] ?? null)
    : null;
  const recommendedFocusId = input.advisorBinding?.focus.recommendedObjectId ?? null;
  const attentionSubjectId = isOverview
    ? (attentionEntry?.id ?? recommendedFocusId ?? null)
    : recommendedFocusId != null && recommendedFocusId !== currentSubjectId
      ? recommendedFocusId
      : null;
  const attentionSubjectLabel = attentionSubjectId
    ? (attentionEntry?.label ?? humanLabel(attentionSubjectId))
    : null;
  const attentionReason =
    attentionSubjectLabel == null
      ? null
      : `${attentionSubjectLabel} currently has the strongest validated attention signal.`;

  const bindingSubject =
    currentSubjectId != null
      ? input.advisorBinding?.prioritizedSubjects.find(
          (subject) => subject.objectId === currentSubjectId,
        ) ??
        (input.advisorBinding?.primarySubject?.objectId === currentSubjectId
          ? input.advisorBinding.primarySubject
          : undefined)
      : undefined;

  const brief =
    !isOverview &&
    input.decisionBrief?.eligible === true &&
    input.decisionBrief.available === true
      ? input.decisionBrief.brief
      : null;

  const resolvedEvidence = translateExecutiveEvidenceState({
    warning: input.advisor.warning,
    unavailableInformation:
      isOverview || bindingSubject?.isUnresolved === true
        ? input.advisorBinding?.unresolved.unavailableInformation
        : Object.freeze([]),
    unresolved:
      bindingSubject?.isUnresolved === true ||
      (isOverview &&
        input.advisorBinding?.unresolved.hasUnresolvedReality === true),
    hasData:
      input.validatedDataSource === false
        ? false
        : bindingSubject?.hasData === true ||
          (brief?.evidence.length ?? 0) > 0,
    hasKpi:
      input.validatedDataSource === false
        ? false
        : bindingSubject?.hasKPI === true ||
          input.intelligence?.primaryKpi != null,
    resolutionStatus: bindingSubject?.resolutionStatus,
    executiveState: bindingSubject?.executiveState,
  });
  const evidence =
    input.validatedDataSource === false &&
    (resolvedEvidence.state === "strong" || resolvedEvidence.state === "none")
      ? Object.freeze({
          state: "limited" as const,
          summary:
            "Evidence limited. Nexora is using local data and does not yet have enough validated evidence to treat this as confirmed.",
        })
      : isOverview && resolvedEvidence.state === "limited"
      ? Object.freeze({
          ...resolvedEvidence,
          summary:
            "Evidence limited. Nexora does not yet have enough validated data to assess the executive overview confidently.",
        })
      : resolvedEvidence;

  const nba =
    !isOverview &&
    input.nextBestAction?.eligible === true &&
    input.nextBestAction.recommendedAction != null
      ? input.nextBestAction
      : null;

  const situation = resolveSituation({
    isOverview,
    grammarKind,
    currentSubjectLabel,
    advisor: input.advisor,
    insight: input.insight ?? null,
    intelligence: input.intelligence ?? null,
    briefSituation: brief?.situation.text ?? null,
    advisorMeaning:
      bindingSubject != null && !looksTechnical(bindingSubject.advisorMeaning)
        ? bindingSubject.advisorMeaning
        : null,
    evidence,
  });

  const whyItMatters = resolveWhyItMatters({
    isOverview,
    grammarKind,
    currentSubjectLabel,
    attentionReason,
    insight: input.insight ?? null,
    intelligence: input.intelligence ?? null,
    briefImpact: brief?.impact?.text ?? null,
    nbaReason: nba?.recommendedAction?.reason ?? null,
  });

  const recommendation = resolveRecommendation({
    isOverview,
    nbaLabel: nba?.recommendedAction?.label ?? null,
    nbaReason: nba?.recommendedAction?.reason ?? null,
    briefRecommendation: brief?.recommendation?.text ?? null,
    dataRealityTitle:
      input.advisorBinding?.presentationDensity.showRecommendedActions === true &&
      input.advisorBinding.recommendations.primaryAction != null &&
      (isOverview
        ? false
        : input.advisorBinding.recommendations.primaryAction.subjectId ===
          currentSubjectId)
        ? input.advisorBinding.recommendations.primaryAction.title
        : null,
    dataRealityRationale:
      input.advisorBinding?.recommendations.primaryAction?.rationale ?? null,
    advisorRecommendation: isOverview ? null : input.advisor.recommendation,
    advisorRationale: isOverview ? null : input.advisor.rationale,
    evidence,
  });

  const actions = resolveActions({
    isOverview,
    attentionSubjectId,
    attentionSubjectLabel,
    nba,
    advisorActions: input.advisor.nextActions,
    recommendationLabel: recommendation.text,
  });

  const recentChange = resolveRecentChange({
    isOverview,
    currentSubjectId,
    currentSubjectLabel,
    decisionMemory: input.decisionMemory ?? null,
  });

  const assumptions =
    grammarKind === "scenario"
      ? uniqueTexts(
          (input.insight?.drivers ?? input.intelligence?.relationships ?? []).map(
            (entry) =>
              typeof entry === "string"
                ? entry
                : `${entry.relation} ${entry.label}`,
          ),
        ).slice(0, 3)
      : [];

  const tradeoffs =
    grammarKind === "scenario" || grammarKind === "decision"
      ? uniqueTexts((brief?.options ?? []).map((option) => option.label)).slice(0, 3)
      : [];

  return freezeNarrative({
    grammarKind,
    headings: HEADINGS[grammarKind],
    isOverview,
    currentSubjectId,
    currentSubjectLabel,
    currentSubjectKind,
    currentSubjectState: isOverview
      ? null
      : (input.intelligence?.status ??
        input.advisor.priority ??
        bindingSubject?.executiveState ??
        null),
    attentionSubjectId,
    attentionSubjectLabel,
    attentionReason,
    situation,
    whyItMatters,
    recommendation: recommendation.text,
    recommendationRationale: recommendation.rationale,
    recommendationAuthority: recommendation.authority,
    noRecommendationReason: recommendation.empty,
    primaryAction: actions.primary,
    secondaryActions: actions.secondary,
    evidenceState: evidence.state,
    evidenceSummary: evidence.summary,
    recentChange,
    decisionRequired: brief?.decisionRequired?.text ?? null,
    assumptions,
    tradeoffs,
  });
}

function resolveSituation(input: {
  readonly isOverview: boolean;
  readonly grammarKind: NexoraProfessionalAdvisorGrammarKind;
  readonly currentSubjectLabel: string | null;
  readonly advisor: NexoraMVPAdvisorViewModel;
  readonly insight: NexoraMVPInsightViewModel | null;
  readonly intelligence: NexoraMVPExecutiveIntelligenceContext | null;
  readonly briefSituation: string | null;
  readonly advisorMeaning: string | null;
  readonly evidence: {
    readonly state: NexoraProfessionalEvidenceState;
    readonly summary: string | null;
  };
}): string | null {
  if (input.isOverview) {
    return "There is no explicit subject. Nexora is showing the executive overview.";
  }

  if (input.grammarKind === "execution") {
    const status = input.intelligence?.status ?? "";
    const summary = input.intelligence?.summary ?? null;
    if (/planned/i.test(status) || /planned/i.test(summary ?? "")) {
      if (summary && !looksTechnical(summary)) {
        return simplifyExecutiveStatement(summary);
      }
      return "This Execution is planned. Nexora is not tracking live delivery yet.";
    }
  }

  const kpi = input.intelligence?.primaryKpi ?? input.insight?.primaryKpi ?? null;
  const kpiSituation =
    kpi != null && input.currentSubjectLabel != null
      ? kpi.target != null
        ? `${input.currentSubjectLabel} ${kpi.label.toLowerCase()} is ${kpi.value}, against a ${kpi.target} operating target.`
        : `${input.currentSubjectLabel} ${kpi.label.toLowerCase()} is ${kpi.value}.`
      : null;

  const candidates = [
    input.briefSituation,
    input.advisorMeaning,
    input.intelligence?.summary,
    input.insight?.summary,
    looksTechnical(input.advisor.observation) ? null : input.advisor.observation,
    kpiSituation,
    input.currentSubjectLabel != null && input.intelligence?.status
      ? `${input.currentSubjectLabel} is currently ${input.intelligence.status}.`
      : null,
  ];

  for (const candidate of candidates) {
    if (candidate && !looksTechnical(candidate)) {
      return simplifyExecutiveStatement(candidate);
    }
  }

  if (input.evidence.state === "limited" || input.evidence.state === "incomplete") {
    return input.evidence.summary;
  }

  if (input.currentSubjectLabel != null) {
    return `${input.currentSubjectLabel} is the current subject.`;
  }

  return null;
}

function resolveWhyItMatters(input: {
  readonly isOverview: boolean;
  readonly grammarKind: NexoraProfessionalAdvisorGrammarKind;
  readonly currentSubjectLabel: string | null;
  readonly attentionReason: string | null;
  readonly insight: NexoraMVPInsightViewModel | null;
  readonly intelligence: NexoraMVPExecutiveIntelligenceContext | null;
  readonly briefImpact: string | null;
  readonly nbaReason: string | null;
}): string | null {
  if (input.isOverview) {
    return null;
  }

  const relations = input.intelligence?.relationships ?? input.insight?.relationships ?? [];
  const relationPhrase =
    input.currentSubjectLabel != null && relations.length > 0
      ? `${input.currentSubjectLabel} ${phraseRelation(relations[0]!.relation, relations[0]!.label)}.`
      : null;

  const candidates = [
    input.briefImpact,
    relationPhrase,
    input.nbaReason,
    input.insight?.drivers[0] ?? null,
  ];

  for (const candidate of candidates) {
    if (candidate && !looksTechnical(candidate)) {
      return simplifyExecutiveStatement(candidate);
    }
  }

  return "No validated business consequence is available for this context.";
}

function resolveRecommendation(input: {
  readonly isOverview: boolean;
  readonly nbaLabel: string | null;
  readonly nbaReason: string | null;
  readonly briefRecommendation: string | null;
  readonly dataRealityTitle: string | null;
  readonly dataRealityRationale: string | null;
  readonly advisorRecommendation: string | null;
  readonly advisorRationale: string | null;
  readonly evidence: {
    readonly state: NexoraProfessionalEvidenceState;
  };
}): {
  readonly text: string | null;
  readonly rationale: string | null;
  readonly authority: NexoraProfessionalRecommendationAuthority;
  readonly empty: string | null;
} {
  if (input.isOverview) {
    return {
      text: null,
      rationale: null,
      authority: "none",
      empty: null,
    };
  }

  const sources: readonly {
    readonly text: string | null;
    readonly rationale: string | null;
    readonly authority: NexoraProfessionalRecommendationAuthority;
  }[] = [
    {
      text: input.briefRecommendation,
      rationale: input.nbaReason,
      authority: "decision-brief",
    },
    {
      text: input.nbaLabel,
      rationale: input.nbaReason,
      authority: "nba",
    },
    {
      text: input.dataRealityTitle,
      rationale: input.dataRealityRationale,
      authority: "data-reality",
    },
    {
      text: input.advisorRecommendation,
      rationale: input.advisorRationale,
      authority: "advisor-intelligence",
    },
  ];

  for (const source of sources) {
    if (source.text && !looksTechnical(source.text)) {
      return {
        text: simplifyActionLabel(source.text),
        rationale:
          source.rationale && !looksTechnical(source.rationale)
            ? simplifyExecutiveStatement(source.rationale)
            : null,
        authority: source.authority,
        empty: null,
      };
    }
  }

  const empty =
    input.evidence.state === "limited" ||
    input.evidence.state === "incomplete" ||
    input.evidence.state === "none"
      ? "Nexora does not currently have enough validated evidence to recommend an action."
      : "No recommended action is available for this context.";

  return {
    text: null,
    rationale: null,
    authority: "none",
    empty,
  };
}

function resolveActions(input: {
  readonly isOverview: boolean;
  readonly attentionSubjectId: string | null;
  readonly attentionSubjectLabel: string | null;
  readonly nba: ExecutiveNextBestActionResult | null;
  readonly advisorActions: readonly NexoraMVPIntelligenceAction[];
  readonly recommendationLabel: string | null;
}): {
  readonly primary: NexoraProfessionalAdvisorAction | null;
  readonly secondary: readonly NexoraProfessionalAdvisorAction[];
} {
  const collected: NexoraProfessionalAdvisorAction[] = [];

  if (input.nba?.recommendedAction) {
    collected.push(
      Object.freeze({
        id: input.nba.recommendedAction.id,
        label: simplifyActionLabel(input.nba.recommendedAction.label),
        source: "nba",
      }),
    );
    for (const alternative of input.nba.alternativeActions.slice(0, 2)) {
      collected.push(
        Object.freeze({
          id: alternative.id,
          label: simplifyActionLabel(alternative.label),
          source: "nba",
        }),
      );
    }
  }

  for (const action of input.advisorActions) {
    if (!action.available) continue;
    collected.push(
      Object.freeze({
        id: action.id,
        label: simplifyActionLabel(action.label),
        source: "advisor-intelligence" as const,
        intelligenceAction: action,
      }),
    );
  }

  if (
    input.isOverview &&
    input.attentionSubjectId != null &&
    input.attentionSubjectLabel != null &&
    !collected.some((action) => action.intelligenceAction?.targetSubjectId === input.attentionSubjectId)
  ) {
    collected.unshift(
      Object.freeze({
        id: `intel-focus-${input.attentionSubjectId}`,
        label: `Investigate ${input.attentionSubjectLabel}`,
        source: "advisor-intelligence" as const,
        intelligenceAction: Object.freeze({
          id: `intel-focus-${input.attentionSubjectId}`,
          label: `Investigate ${input.attentionSubjectLabel}`,
          kind: "select-subject" as const,
          available: true,
          targetSubjectId: input.attentionSubjectId,
        }),
      }),
    );
  }

  const deduped: NexoraProfessionalAdvisorAction[] = [];
  const seen = new Set<string>();
  for (const action of collected) {
    const key = normalizeKey(action.label);
    if (seen.has(key) || seen.has(action.id)) continue;
    seen.add(key);
    seen.add(action.id);
    deduped.push(action);
  }

  const primary =
    deduped.find((action) => sameAdvice(action.label, input.recommendationLabel)) ??
    deduped[0] ??
    null;
  const secondary = deduped
    .filter((action) => action.id !== primary?.id)
    .slice(0, 2);

  return {
    primary,
    secondary,
  };
}

function resolveRecentChange(input: {
  readonly isOverview: boolean;
  readonly currentSubjectId: string | null;
  readonly currentSubjectLabel: string | null;
  readonly decisionMemory: ExecutiveDecisionMemoryView | null;
}): string | null {
  if (input.isOverview) return null;
  const memory = input.decisionMemory;
  if (
    memory == null ||
    memory.available !== true ||
    memory.eligible !== true ||
    memory.memory == null
  ) {
    return null;
  }

  if (memory.historicalVsCurrentDifferent === true) {
    const label = input.currentSubjectLabel ?? "This subject";
    return `Previous Decision. A previous ${label.toLowerCase()} decision exists.`;
  }

  return `Previous Decision. ${memory.memory.decisionStatus}.`;
}

export function professionalAdvisorHasDuplicateRecommendation(
  narrative: NexoraProfessionalAdvisorNarrative,
): boolean {
  if (narrative.recommendation == null) return false;
  const rec = normalizeKey(narrative.recommendation);
  const siblings = [
    narrative.situation,
    narrative.whyItMatters,
    narrative.decisionRequired,
    ...narrative.assumptions,
    ...narrative.tradeoffs,
  ]
    .filter((value): value is string => typeof value === "string")
    .map(normalizeKey);
  return siblings.filter((value) => value === rec).length > 0;
}
