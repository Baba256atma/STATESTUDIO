/**
 * NPA-T ECA:7 — Executive Recommendation Framing & Decision Readiness.
 * Read-only judgment over ECA:1–6 plus NCA:4 / NXA:5 / POST:4. Does not
 * replace those authorities, score options, or write Decision.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveInitiativeJudgment } from "./ecaExecutiveInitiativeJudgment.ts";
import type { EcaExecutiveInformationNeedJudgment } from "./ecaExecutiveInformationNeed.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaExecutiveDialogueStrategy } from "./ecaExecutiveDialogueStrategy.ts";
import type { EcaSubject, EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";
import type { ExecutiveAdvisoryStrategy } from "../manager-object/nexoraNca4AdvisoryIntelligenceTypes.ts";
import type { Nxa5ExecutiveJudgment } from "../manager-object/nexoraNxa5ExecutiveJudgment.ts";

export const ECA_EXECUTIVE_RECOMMENDATION_IDENTITY =
  "NPA-T ECA:7/ExecutiveRecommendationFramingDecisionReadiness" as const;

export const ECA_RECOMMENDATION_READINESS = Object.freeze([
  "READY",
  "READY_WITH_CONDITIONS",
  "NOT_READY",
  "NO_CLEAR_PREFERENCE",
  "BLOCKED_BY_CRITICAL_UNKNOWN",
] as const);
export type EcaRecommendationReadiness = (typeof ECA_RECOMMENDATION_READINESS)[number];

export const ECA_DECISION_READINESS = Object.freeze([
  "READY",
  "READY_WITH_CONDITIONS",
  "NOT_READY",
  "BLOCKED",
] as const);
export type EcaDecisionReadinessState = (typeof ECA_DECISION_READINESS)[number];

export const ECA_RECOMMENDATION_TYPES = Object.freeze([
  "PREFER_OPTION",
  "CONDITIONAL_PREFERENCE",
  "NO_CLEAR_PREFERENCE",
  "DEFER_DECISION",
  "CONTINUE_INVESTIGATION",
  "REVIEW_EVIDENCE",
  "NONE",
] as const);
export type EcaRecommendationType = (typeof ECA_RECOMMENDATION_TYPES)[number];

export const ECA_RECOMMENDATION_STRENGTHS = Object.freeze([
  "TENTATIVE",
  "SUPPORTED",
  "STRONG",
  "NONE",
] as const);
export type EcaRecommendationStrength = (typeof ECA_RECOMMENDATION_STRENGTHS)[number];

export const ECA_CRITERION_SOURCES = Object.freeze([
  "MANAGER",
  "COMPARISON",
  "GOAL",
  "ROLE",
  "NONE",
] as const);
export type EcaCriterionSource = (typeof ECA_CRITERION_SOURCES)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  writesScenario: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondDecisionEngine: false as const,
  replacesNca4: false as const,
  replacesDth7: false as const,
  createsRecommendationStore: false as const,
  recommendationEqualsDecision: false as const,
  readinessEqualsCommitment: false as const,
});

export type EcaRecommendationOption = Readonly<{
  id: string;
  label: string;
}>;

export type EcaRecommendationSession = Readonly<{
  criterion: string | null;
  criterionSource: EcaCriterionSource;
  optionIds: readonly string[];
  optionLabels: readonly string[];
  lastType: EcaRecommendationType | null;
  lastOptionId: string | null;
  lastFingerprint: string | null;
  delivered: boolean;
  sawCompare: boolean;
}>;

export type EcaExecutiveRecommendationJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_RECOMMENDATION_IDENTITY;
  recommendationRequested: boolean;
  readiness: EcaRecommendationReadiness;
  decisionReadiness: EcaDecisionReadinessState;
  recommendationType: EcaRecommendationType;
  strength: EcaRecommendationStrength;
  subject: EcaSubject | null;
  recommendedOption: EcaRecommendationOption | null;
  consideredOptions: readonly EcaRecommendationOption[];
  criterion: string | null;
  criterionSource: EcaCriterionSource;
  supportingEvidence: readonly string[];
  counterEvidence: readonly string[];
  tradeoffs: readonly string[];
  uncertainty: readonly string[];
  conditions: readonly string[];
  unresolvedCriticalNeedId: string | null;
  changeConditions: readonly string[];
  postDecision: boolean;
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  managerFacingNote: string | null;
  speak: boolean;
  unsupportedRecommendation: false;
  staleRecommendation: false;
  hiddenTradeoff: false;
  lostUncertainty: false;
  trustInflation: false;
  semanticPromotion: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    preferenceSource: "NXA:5" | "NCA:4" | "NONE";
    rationale: string;
  }>;
}>;

export type EcaRecommendationInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  initiative?: EcaExecutiveInitiativeJudgment | null;
  informationNeed?: EcaExecutiveInformationNeedJudgment | null;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  dialogueStrategy?: EcaExecutiveDialogueStrategy | null;
  session?: EcaRecommendationSession | null;
  nca4?: ExecutiveAdvisoryStrategy | null;
  nxa5?: Nxa5ExecutiveJudgment | null;
  committedDecisionId?: string | null;
  capAvUnconfirmed?: boolean;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaRecommendationSession(): EcaRecommendationSession {
  return freeze({
    criterion: null,
    criterionSource: "NONE",
    optionIds: Object.freeze([]),
    optionLabels: Object.freeze([]),
    lastType: null,
    lastOptionId: null,
    lastFingerprint: null,
    delivered: false,
    sawCompare: false,
  });
}

function isRecommendRequest(text: string, intent: EcaExecutiveIntent): boolean {
  return (
    intent === "SEEK_RECOMMENDATION" ||
    /\bwhat do you recommend\b|\bwhich should i (?:choose|pick)\b|\bwhat should (?:i|we) (?:choose|do)\b/i.test(text)
  );
}
function isWhy(text: string): boolean {
  return /^(?:why(?: do you recommend(?: that| \w+)?)?)\??$/i.test(text.trim());
}
function isWhyNot(text: string): boolean {
  return /\bwhy not\b/i.test(text);
}
function isConfidence(text: string): boolean {
  return /\bhow sure\b|\bhow confident\b/i.test(text);
}
function isReadyToDecide(text: string): boolean {
  return /\bare we ready to decide\b|\bready to decide\b/i.test(text);
}
function isWhatCouldChange(text: string): boolean {
  return /\bwhat could change (?:your |the )?recommendation\b/i.test(text);
}
function isBestWithoutCriterion(text: string): boolean {
  return /\bwhich is best\b|\bwhat(?:'s| is) best\b/i.test(text);
}
function isEvaluateOnly(text: string, intent: EcaExecutiveIntent): boolean {
  if (isRecommendRequest(text, intent)) return false;
  return (
    intent === "EVALUATE" ||
    intent === "COMPARE" ||
    /\bwhich (?:has |is )?(?:lower risk|safer|fastest|cheaper)\b/i.test(text)
  );
}

function criterionFromUtterance(text: string): { criterion: string; source: EcaCriterionSource } | null {
  if (/\bdelivery speed matters\b|\bspeed (?:is|matters) (?:more|most)\b|\bfastest\b/i.test(text) &&
      !/\bcost matters more\b/i.test(text)) {
    return { criterion: "delivery speed", source: "MANAGER" };
  }
  if (/\bcost matters\b|\bcheaper\b|\bminimize cost\b/i.test(text) && !/\bspeed (?:is|matters) more\b/i.test(text)) {
    return { criterion: "cost", source: "MANAGER" };
  }
  if (/\bsafest\b|\blower risk\b|\brisk matters\b/i.test(text)) {
    return { criterion: "risk", source: "MANAGER" };
  }
  return null;
}

/** Internal comparison sentinels (e.g. NCA-POST:4) must not appear raw in manager-facing notes. */
const INTERNAL_CRITERION_SENTINELS = Object.freeze(
  new Set(["UNSPECIFIED", "UNKNOWN", "NOT_APPLICABLE", "NONE", "UNRESOLVED", "NULL", "UNDEFINED"]),
);

function managerFacingCriterionPhrase(criterion: string | null | undefined): string | null {
  if (criterion == null) return null;
  const trimmed = criterion.trim();
  if (!trimmed) return null;
  if (INTERNAL_CRITERION_SENTINELS.has(trimmed.toUpperCase())) return null;
  return trimmed.replaceAll("_", " ").toLowerCase();
}

function optionsFromText(text: string, working: EcaWorkingConversationContext, previous: EcaRecommendationSession): readonly EcaRecommendationOption[] {
  const named: EcaRecommendationOption[] = [];
  const compare = text.match(/\bcompare\s+(.+?)\s+and\s+(.+?)(?:[.?!]|$)/i);
  if (compare?.[1] && compare[2]) {
    named.push(
      freeze({ id: slug(compare[1]), label: cleanOption(compare[1]) }),
      freeze({ id: slug(compare[2]), label: cleanOption(compare[2]) }),
    );
  }
  const fromWorking = working.decisionContext.comparisonSubjects.map((item) =>
    freeze({ id: item.id, label: item.label }),
  );
  if (named.length >= 2) return freeze(named);
  if (fromWorking.length >= 2) return freeze(fromWorking);
  if (previous.optionLabels.length >= 2) {
    return freeze(
      previous.optionLabels.map((label, index) =>
        freeze({ id: previous.optionIds[index] ?? slug(label), label }),
      ),
    );
  }
  return freeze([]);
}

function cleanOption(value: string): string {
  return value.replace(/[.?!]/g, "").replace(/^scenario\s+/i, "Scenario ").trim();
}
function slug(value: string): string {
  return cleanOption(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "option";
}

function blockingNeed(need: EcaExecutiveInformationNeedJudgment | null): boolean {
  return need?.shouldAsk === true || need?.primaryNeed?.necessity === "BLOCKING";
}

function estimateMaterial(intake: EcaExecutiveAnswerIntakeJudgment | null): boolean {
  return intake?.answerType === "ESTIMATE" || intake?.confidence === "ESTIMATED";
}

function overreach(text: string): boolean {
  return /\b(?:definitely|certainly|obviously|guaranteed|must choose|the best option)\b/i.test(text);
}

function authorityPreference(
  nxa5: Nxa5ExecutiveJudgment | null | undefined,
  nca4: ExecutiveAdvisoryStrategy | null | undefined,
  options: readonly EcaRecommendationOption[],
): { option: EcaRecommendationOption | null; source: "NXA:5" | "NCA:4" | "NONE" } {
  if (nxa5?.preferredCandidateId) {
    const hit =
      options.find((item) => item.id === nxa5.preferredCandidateId) ??
      freeze({ id: nxa5.preferredCandidateId, label: nxa5.preferredCandidateId });
    return { option: hit, source: "NXA:5" };
  }
  const id = nca4?.position.recommendation.optionId;
  const label = nca4?.position.recommendation.optionLabel;
  if (id || label) {
    const hit =
      options.find((item) => item.id === id || item.label === label) ??
      freeze({ id: id ?? slug(label ?? "option"), label: label ?? id ?? "option" });
    return { option: hit, source: "NCA:4" };
  }
  return { option: null, source: "NONE" };
}

function mapNxa5Readiness(nxa5: Nxa5ExecutiveJudgment | null | undefined): EcaDecisionReadinessState | null {
  if (!nxa5) return null;
  if (nxa5.decisionReadiness === "READY") return "READY";
  if (nxa5.decisionReadiness === "READY_WITH_KNOWN_UNCERTAINTY") return "READY_WITH_CONDITIONS";
  if (nxa5.decisionReadiness === "NOT_READY") return "NOT_READY";
  return null;
}

function mapStrength(
  nxa5: Nxa5ExecutiveJudgment | null | undefined,
  nca4: ExecutiveAdvisoryStrategy | null | undefined,
  estimate: boolean,
  capAv: boolean,
): EcaRecommendationStrength {
  if (estimate || capAv) return "TENTATIVE";
  const nxa = nxa5?.recommendationStrength;
  if (nxa === "STRONG") return "STRONG";
  if (nxa === "QUALIFIED") return "SUPPORTED";
  if (nxa === "TENTATIVE") return "TENTATIVE";
  const nca = nca4?.position.recommendation.strength;
  if (nca === "STRONGLY_RECOMMEND") return "STRONG";
  if (nca === "RECOMMEND") return "SUPPORTED";
  if (nca === "LEAN_TOWARD") return "TENTATIVE";
  return "TENTATIVE";
}

export function judgeEcaExecutiveRecommendation(
  input: EcaRecommendationInput,
): EcaExecutiveRecommendationJudgment {
  const text = input.utterance.trim();
  const intent = input.actionPlan.intent;
  const previous = input.session ?? emptyEcaRecommendationSession();
  const need = input.informationNeed ?? null;
  const intake = input.answerIntake ?? null;
  const strategy = input.dialogueStrategy ?? null;
  const gap = blockingNeed(need);
  const estimate = estimateMaterial(intake);
  const capAv = input.capAvUnconfirmed === true || (/\bcap_av\b/i.test(text) && input.workingContext.activeDataSource?.semanticStatus !== "CONFIRMED");
  const postDecision = Boolean(input.committedDecisionId);
  const requested = isRecommendRequest(text, intent);
  const spokenFollowUp = isWhy(text) || isWhyNot(text) || isConfidence(text) || isReadyToDecide(text) || isWhatCouldChange(text);
  const evaluateOnly = isEvaluateOnly(text, intent);
  const fromUtterance = criterionFromUtterance(text);
  const criterion = fromUtterance?.criterion ?? previous.criterion ?? input.workingContext.decisionContext.criterion;
  const facingCriterion = managerFacingCriterionPhrase(criterion);
  const criterionSource: EcaCriterionSource = fromUtterance?.source ??
    (previous.criterion ? previous.criterionSource : input.workingContext.decisionContext.criterion ? "COMPARISON" : "NONE");
  const compared = previous.sawCompare || intent === "COMPARE" || /\bcompare\b/i.test(text) || strategy?.progress.some((item) => item.id === "OPTIONS_COMPARED") === true;
  const options = optionsFromText(text, input.workingContext, previous);
  const authority = authorityPreference(input.nxa5 ?? null, input.nca4 ?? null, options);
  const nxaReadiness = mapNxa5Readiness(input.nxa5 ?? null);
  const sources = freeze([
    "NCA:4",
    "NXA:5",
    "NCA-POST:4",
    "DTH:7",
    "NPA-T ECA:2",
    "NPA-T ECA:4",
    "NPA-T ECA:5",
    "NPA-T ECA:6",
    "NPA-T ECA:7",
  ]);

  let readiness: EcaRecommendationReadiness = "NOT_READY";
  let decisionReadiness: EcaDecisionReadinessState = nxaReadiness ?? "NOT_READY";
  let recommendationType: EcaRecommendationType = "NONE";
  let strength: EcaRecommendationStrength = "NONE";
  let recommended: EcaRecommendationOption | null = null;
  let rationale = "Recommendation readiness is judged from existing comparison, needs, and advisory authorities.";
  const supporting: string[] = [];
  const counter: string[] = [];
  const tradeoffs: string[] = [...(input.nxa5?.tradeoffs ?? []), ...(input.nca4?.position.tradeoffs.map((item) => `${item.gained}; trade-off ${item.givenUp}`) ?? [])];
  const uncertainty: string[] = [...(input.nxa5?.uncertainty ?? []), ...(input.nca4?.position.uncertainties ?? [])];
  const conditions: string[] = [];
  const change = [...(input.nxa5?.changeConditions ?? [])];
  if (input.nca4?.position.counterargument) counter.push(input.nca4.position.counterargument);
  if (estimate) {
    uncertainty.push("A material input remains an estimate, not confirmed Data truth.");
    conditions.push("Treat this as provisional while estimated values remain unconfirmed.");
  }
  if (capAv) {
    uncertainty.push("CAP_AV semantics are still unconfirmed, so capacity cannot be treated as authoritative.");
    conditions.push("Confirm CAP_AV meaning before treating capacity as decided evidence.");
  }
  if (gap && need?.primaryNeed) {
    uncertainty.push(`${need.primaryNeed.id} remains unresolved.`);
  }

  if (postDecision) {
    readiness = "NOT_READY";
    decisionReadiness = "BLOCKED";
    recommendationType = "NONE";
    rationale = "Canonical Decision already exists; ECA:7 does not keep an open-choice recommendation.";
  } else if (gap && requested) {
    readiness = "BLOCKED_BY_CRITICAL_UNKNOWN";
    decisionReadiness = "BLOCKED";
    recommendationType = "DEFER_DECISION";
    rationale = "A blocking ECA:4 need prevents a justified option recommendation.";
  } else if (!compared && options.length < 2 && requested) {
    readiness = "NOT_READY";
    recommendationType = strategy?.objectiveType === "INVESTIGATE_ISSUE" ? "CONTINUE_INVESTIGATION" : "REVIEW_EVIDENCE";
    rationale = "Recommendation was requested before a meaningful comparison existed.";
  } else if ((isBestWithoutCriterion(text) || (requested && !criterion && !authority.option)) && options.length >= 2) {
    readiness = "NO_CLEAR_PREFERENCE";
    decisionReadiness = "NOT_READY";
    recommendationType = "NO_CLEAR_PREFERENCE";
    rationale = "Options trade off and no manager criterion or advisory preference is available.";
  } else if (authority.option && compared) {
    recommended = authority.option;
    const other = options.find((item) => item.id !== recommended!.id) ?? options.find((item) => item.label !== recommended!.label);
    supporting.push(facingCriterion ? `Aligns with ${facingCriterion}.` : "Supported by current advisory/comparison context.");
    if (other) {
      counter.push(`${other.label} remains a viable alternative if priorities change.`);
      if (tradeoffs.length === 0) tradeoffs.push(`${recommended.label} is preferred on the stated criterion; ${other.label} remains the material alternative.`);
    }
    if (estimate || capAv || gap) {
      readiness = "READY_WITH_CONDITIONS";
      decisionReadiness = "READY_WITH_CONDITIONS";
      recommendationType = "CONDITIONAL_PREFERENCE";
      strength = "TENTATIVE";
    } else {
      readiness = "READY";
      decisionReadiness = nxaReadiness ?? "READY_WITH_CONDITIONS";
      recommendationType = "PREFER_OPTION";
      strength = mapStrength(input.nxa5 ?? null, input.nca4 ?? null, false, false);
      if (strength === "NONE") strength = criterionSource === "MANAGER" ? "SUPPORTED" : "TENTATIVE";
    }
    rationale = `Preference consumed from ${authority.source}; ECA:7 does not re-rank.`;
  } else if (requested && compared && criterion && options.length >= 2 && !authority.option) {
    readiness = "NO_CLEAR_PREFERENCE";
    recommendationType = "CONDITIONAL_PREFERENCE";
    strength = "TENTATIVE";
    decisionReadiness = "NOT_READY";
    const [first, second] = options;
    tradeoffs.push(`${first?.label ?? "One option"} and ${second?.label ?? "the other"} remain in trade-off until an advisory authority prefers one.`);
    if (facingCriterion) {
      conditions.push(`If ${facingCriterion} remains the priority, ask to compare on that criterion in Decision Theatre.`);
    } else {
      conditions.push("Ask to compare on a stated priority in Decision Theatre before treating this as decided.");
    }
    rationale = "Criterion is known but NCA:4/NXA:5 have not established a preferred candidate.";
  } else if (requested && compared && options.length >= 2) {
    readiness = "NO_CLEAR_PREFERENCE";
    recommendationType = "NO_CLEAR_PREFERENCE";
    decisionReadiness = "NOT_READY";
  } else if (strategy?.objectiveType === "INVESTIGATE_ISSUE" && requested) {
    recommendationType = "CONTINUE_INVESTIGATION";
    readiness = "NOT_READY";
  }

  if (evaluateOnly && !requested) {
    recommendationType = recommendationType === "NONE" ? "NONE" : recommendationType;
    rationale = "Evaluation is not treated as a recommendation request.";
  }

  if (strength === "STRONG" && (estimate || capAv || gap)) strength = "TENTATIVE";

  if (!change.length && recommended) {
    if (gap && need?.primaryNeed) change.push(`Resolving ${need.primaryNeed.id} could reverse the comparison.`);
    if (capAv) change.push("Confirmed CAP_AV meaning could change the capacity-based preference.");
    if (facingCriterion) change.push(`A change in whether ${facingCriterion} remains the priority would reassess this advice.`);
  }

  if (isReadyToDecide(text) && !postDecision) {
    if (gap) decisionReadiness = "BLOCKED";
    else if (estimate || capAv) decisionReadiness = "READY_WITH_CONDITIONS";
    else if (readiness === "READY" || readiness === "READY_WITH_CONDITIONS") decisionReadiness = readiness === "READY" ? "READY" : "READY_WITH_CONDITIONS";
  }

  const whyBits = [
    recommended ? `I recommend ${recommended.label}` : null,
    facingCriterion ? `because ${facingCriterion} is the current priority` : null,
    supporting[0] ?? null,
    tradeoffs[0] ? `The trade-off is ${tradeoffs[0]}` : null,
    uncertainty[0] ? uncertainty[0] : null,
  ].filter(Boolean);

  let note: string | null = null;
  let speak = false;
  if (postDecision && (requested || spokenFollowUp)) {
    note = "A Decision is already committed through the canonical Decision path. I can explain that choice, but I will not treat the recommendation as still open.";
    speak = true;
  } else if (isReadyToDecide(text)) {
    note =
      decisionReadiness === "READY"
        ? "Yes. The main options have been compared and no critical information gap remains. This is decision-ready, not a Decision."
        : decisionReadiness === "READY_WITH_CONDITIONS"
          ? "Ready with conditions. You can decide, but estimated or unconfirmed inputs should stay visible."
          : decisionReadiness === "BLOCKED"
            ? "Not yet. A required input is still unresolved and could reverse the comparison."
            : "Not yet. I don’t have enough compared evidence to call this decision-ready.";
    speak = true;
  } else if (isConfidence(text)) {
    note =
      strength === "SUPPORTED" || strength === "STRONG"
        ? "Moderately confident. The compared evidence supports the preference, but this remains advice, not a Decision."
        : "Only tentatively. Important uncertainty remains, so I would not treat this as a strong recommendation.";
    speak = true;
  } else if (isWhyNot(text) && options.length >= 2) {
    const other = options.find((item) => item.id !== recommended?.id) ?? options[1];
    note = other
      ? `${other.label} can still be preferable if your priority changes. I am not dismissing it.`
      : "The alternative remains viable if priorities change.";
    speak = true;
  } else if (isWhy(text)) {
    note = whyBits.length
      ? `${whyBits.join(". ")}.`
      : "I don’t have a justified option recommendation yet.";
    speak = true;
  } else if (isWhatCouldChange(text)) {
    note = change[0]
      ? change[0]
      : "A change in the stated criterion or a newly confirmed critical input would require reassessment.";
    speak = true;
  } else if (requested) {
    speak = true;
    if (recommendationType === "DEFER_DECISION" || readiness === "BLOCKED_BY_CRITICAL_UNKNOWN") {
      note = `I don’t have enough information to recommend one yet.${need?.primaryNeed ? ` ${need.primaryNeed.id} is still missing.` : ""}`;
    } else if (recommendationType === "CONTINUE_INVESTIGATION" || recommendationType === "REVIEW_EVIDENCE") {
      note = "I don’t have enough evidence to recommend one option yet. I would continue the investigation before choosing.";
    } else if (recommendationType === "NO_CLEAR_PREFERENCE") {
      const [first, second] = options;
      note = `There isn’t a justified single winner yet. ${first?.label ?? "One option"} and ${second?.label ?? "the other"} trade off. Your priority determines the choice.`;
    } else if (recommendationType === "CONDITIONAL_PREFERENCE" && recommended) {
      note = `I would lean toward ${recommended.label} if ${facingCriterion ?? "the current priority"} remains the focus. ${tradeoffs[0] ?? ""} ${uncertainty[0] ?? "Treat this as conditional, not a Decision."}`.replace(/\s+/g, " ").trim();
    } else if (recommended) {
      note = `I recommend ${recommended.label}${facingCriterion ? ` because it better matches ${facingCriterion}` : ""}. ${tradeoffs[0] ? `The trade-off is ${tradeoffs[0]}.` : ""} ${uncertainty[0] ?? ""} This is advice, not a Decision.`.replace(/\s+/g, " ").trim();
    }
  }

  if (note && overreach(note)) {
    note = note.replace(/\b(?:definitely|certainly|obviously|guaranteed|must choose|the best option)\b/gi, "").replace(/\s+/g, " ").trim();
  }
  if (previous.delivered && previous.lastFingerprint && previous.lastOptionId === recommended?.id && !fromUtterance && !intake && requested) {
    speak = false;
    note = null;
    rationale = "The same recommendation was just given; the follow-up does not repeat the full frame.";
  }

  return freeze({
    identity: ECA_EXECUTIVE_RECOMMENDATION_IDENTITY,
    recommendationRequested: requested,
    readiness,
    decisionReadiness,
    recommendationType,
    strength,
    subject: recommended
      ? freeze({ id: recommended.id, label: recommended.label, kind: "option" })
      : input.workingContext.activeSubject,
    recommendedOption: recommended,
    consideredOptions: options,
    criterion,
    criterionSource,
    supportingEvidence: freeze(supporting),
    counterEvidence: freeze(counter),
    tradeoffs: freeze(tradeoffs),
    uncertainty: freeze(uncertainty),
    conditions: freeze(conditions),
    unresolvedCriticalNeedId: gap ? need?.primaryNeed?.id ?? null : null,
    changeConditions: freeze(change),
    postDecision,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    managerFacingNote: note,
    speak,
    unsupportedRecommendation: false,
    staleRecommendation: false,
    hiddenTradeoff: false,
    lostUncertainty: false,
    trustInflation: false,
    semanticPromotion: false,
    boundaries: BOUNDARIES,
    provenance: freeze({
      sources,
      preferenceSource: authority.source,
      rationale,
    }),
  });
}

export function nextEcaRecommendationSession(
  previous: EcaRecommendationSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveRecommendationJudgment,
): EcaRecommendationSession {
  const base = previous ?? emptyEcaRecommendationSession();
  const compared = base.sawCompare || /\bcompare\b/i.test(utterance) || judgment.consideredOptions.length >= 2;
  return freeze({
    criterion: judgment.criterion,
    criterionSource: judgment.criterionSource,
    optionIds: freeze(judgment.consideredOptions.map((item) => item.id)),
    optionLabels: freeze(judgment.consideredOptions.map((item) => item.label)),
    lastType: judgment.recommendationType,
    lastOptionId: judgment.recommendedOption?.id ?? base.lastOptionId,
    lastFingerprint: [
      judgment.criterion,
      judgment.recommendedOption?.id ?? "",
      judgment.readiness,
    ].join("|"),
    delivered: judgment.speak && Boolean(judgment.recommendedOption),
    sawCompare: compared,
  });
}

export function applyEcaRecommendationToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveRecommendationJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (overreach(note)) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  if (
    input.judgment.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN" ||
    input.judgment.recommendationType === "DEFER_DECISION" ||
    input.judgment.recommendationType === "NO_CLEAR_PREFERENCE" ||
    input.judgment.postDecision
  ) {
    if (/\bi recommend\b/i.test(input.source) && input.judgment.recommendationRequested) {
      return note;
    }
  }
  return `${input.source} ${note}`.trim();
}
