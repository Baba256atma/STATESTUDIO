/** NXA:5 — Advisor judgment composition over POST:4, EI:3–5, MO:6 and NXA:3. */
import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";
import type { ExecutiveCollectionComparisonResult, ExecutiveComparisonCriterion } from "./nexoraNcaPost4CollectionComparison.ts";
import type { ExecutiveSituation } from "./nexoraNxa3ExecutiveSituation.ts";

export const nexoraNxa5Identity = "NXA:5/ExecutiveJudgmentPrioritizationRecommendationQuality" as const;
export const NEXORA_NXA5_BOUNDARY = Object.freeze({
  consumesPost4CandidateSet: true as const, consumesEiJudgment: true as const,
  consumesMo6Significance: true as const, consumesNxa3Situation: true as const,
  createsPrioritizationEngine: false as const, createsExecutiveSituation: false as const,
  createsUniversalScore: false as const, validatesEvidence: false as const,
  commitsDecision: false as const, startsExecution: false as const,
  writesOutcome: false as const, writesStage: false as const, changesManagerPreference: false as const,
});

export type Nxa5JudgmentType = "ATTENTION" | "INVESTIGATION_PRIORITY" | "RISK_PRIORITY" | "OPPORTUNITY_PRIORITY" | "SCENARIO" | "ACTION_RECOMMENDATION" | "DECISION_READINESS" | "EXECUTION_PRIORITY" | "LEARNING_PRIORITY";
export type Nxa5RecommendationType = "OBSERVE" | "INVESTIGATE" | "COMPARE" | "MITIGATE" | "ACT" | "WAIT" | "REASSESS" | "ESCALATE_ATTENTION";
export type Nxa5RecommendationStrength = "STRONG" | "QUALIFIED" | "TENTATIVE" | "INSUFFICIENT";
export type Nxa5DecisionReadiness = "NOT_READY" | "READY_WITH_KNOWN_UNCERTAINTY" | "READY" | "NOT_APPLICABLE";
type Level = "UNKNOWN" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

/** Read-only semantic projection from EI/POST:4; NXA:5 does not establish these facts. */
export type Nxa5JudgmentCandidate = Readonly<{
  id: string; label: string; kind: string;
  goalAlignment: "DIRECT" | "RELATED" | "NONE" | "UNKNOWN";
  materiality: Level; urgency: Level; riskExposure: Level;
  evidenceStrength: "UNKNOWN" | "WEAK" | "MODERATE" | "STRONG";
  consequence: string | null; uncertainties: readonly string[]; constraints: readonly string[];
  feasible: boolean | null; reversibility: "REVERSIBLE" | "PARTIAL" | "IRREVERSIBLE" | "UNKNOWN";
  gains: readonly string[]; sacrifices: readonly string[];
  learningValue: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  managerPreference: boolean; timeSensitive: boolean;
  existingRecommendation?: string | null;
}>;

export type Nxa5ExecutiveJudgment = Readonly<{
  identity: typeof nexoraNxa5Identity;
  judgmentType: Nxa5JudgmentType; criterion: ExecutiveComparisonCriterion;
  candidateIds: readonly string[]; candidateSetSource: string;
  comparability: "COMPARABLE" | "PARTIAL" | "INSUFFICIENT";
  preferredCandidateId: string | null; recommendationType: Nxa5RecommendationType;
  recommendationStrength: Nxa5RecommendationStrength; decisionReadiness: Nxa5DecisionReadiness;
  what: string; why: readonly string[]; evidence: readonly string[]; uncertainty: readonly string[];
  tradeoffs: readonly string[]; alternatives: readonly string[]; nextMove: string;
  changeConditions: readonly string[]; changedFromPrevious: boolean;
  managerMessage: string; audit: readonly string[]; numericalScore: null;
  commitsDecision: false; startsExecution: false; writesOutcome: false; writesStage: false;
}>;

export function evaluateNxa5ExecutiveJudgment(input: {
  situation: ExecutiveSituation; comparison: ExecutiveCollectionComparisonResult;
  attention: ExecutiveAttentionIntelligence; candidates: readonly Nxa5JudgmentCandidate[];
  judgmentType: Nxa5JudgmentType; criterion?: ExecutiveComparisonCriterion;
  previous?: Nxa5ExecutiveJudgment | null;
  decision?: { criticalEvidenceMissing: readonly string[]; materialUncertainty: readonly string[]; remainingUncertainty: readonly string[]; downsideUnderstood: boolean; feasible: boolean; additionalLearningValue: "LOW" | "HIGH" } | null;
}): Nxa5ExecutiveJudgment {
  const criterion = input.criterion ?? input.comparison.criterion;
  const allowed = new Set(input.comparison.candidateSet.candidateIds);
  const candidates = input.candidates.filter((candidate) => allowed.has(candidate.id));
  if (candidates.length < 2 && input.judgmentType !== "DECISION_READINESS") return unresolved(input, criterion, candidates, "The current comparison does not contain at least two supported candidates.");

  if (input.judgmentType === "DECISION_READINESS") return readinessJudgment(input, criterion, candidates);
  const magnitudeQuestion = criterion === "OVERALL_SIGNIFICANCE" || criterion === "SEVERITY" || criterion === "FINANCIAL_IMPACT" || criterion === "COST";
  const comparable = input.comparison.evidenceState === "SUFFICIENT" || hasComparableEvidence(candidates, criterion);
  const investigationAlternative = input.judgmentType === "INVESTIGATION_PRIORITY" || criterion === "INVESTIGATION_PRIORITY";
  const chosen = selectDefensibleCandidate(candidates, criterion, input.judgmentType, comparable);

  if (magnitudeQuestion && !comparable) {
    const criterionName = criterion === "OVERALL_SIGNIFICANCE"
      ? "overall-significance basis"
      : `${criterion.toLowerCase().replaceAll("_", " ")} evidence`;
    const message = `I don’t have a defensible comparable ${criterionName} for ${candidateNames(candidates)}. You can ask me to compare them on another explicit criterion, such as risk exposure or evidence strength.`;
    return build(input, criterion, candidates, null, "INSUFFICIENT", "COMPARE", "INSUFFICIENT", "NOT_APPLICABLE", message, [], candidates.flatMap(changeConditions));
  }
  if (!chosen) {
    const names = candidates.map((candidate) => candidate.label);
    const criterionName = criterion.toLowerCase().replaceAll("_", " ");
    const noGoal = criterion === "GOAL_IMPACT" && !input.situation.goal;
    const message = !comparable && criterion !== "UNSPECIFIED"
      ? noGoal
        ? `I don’t have an authoritative active Goal or comparable Goal-impact evidence for ${candidateNames(candidates)}. You can choose another explicit criterion, such as urgency, risk exposure, or evidence strength.`
        : `I don’t have enough comparable ${criterionName} evidence for ${candidateNames(candidates)} to select one. You can ask me to compare them on another explicit criterion, such as risk exposure or evidence strength.`
      : candidates.length >= 2
      ? `Neither clearly dominates. ${names[0]} and ${names[1]} have different supported strengths. ${conditionalTie(candidates[0]!, candidates[1]!)}`
      : "There is not enough supported context to form a recommendation.";
    return build(input, criterion, candidates, null, comparable ? "PARTIAL" : "INSUFFICIENT", "COMPARE", "INSUFFICIENT", "NOT_APPLICABLE", message, [], candidates.flatMap(changeConditions));
  }

  const evidence = chosen.evidenceStrength;
  const commitmentRisk = chosen.reversibility === "IRREVERSIBLE" || chosen.feasible === false;
  const recommendationType: Nxa5RecommendationType =
    chosen.feasible === false ? "WAIT" :
    input.judgmentType === "INVESTIGATION_PRIORITY" ? "INVESTIGATE" :
    evidence === "WEAK" || evidence === "UNKNOWN" || commitmentRisk ? "INVESTIGATE" :
    input.judgmentType === "RISK_PRIORITY" ? "MITIGATE" :
    input.judgmentType === "LEARNING_PRIORITY" ? "INVESTIGATE" : "ACT";
  const strength: Nxa5RecommendationStrength = evidence === "STRONG" && chosen.uncertainties.length === 0 && chosen.feasible !== false ? "STRONG" : evidence === "MODERATE" ? "QUALIFIED" : "TENTATIVE";
  const reason = primaryReason(chosen, criterion);
  const alternative = candidates.find((candidate) => candidate.id !== chosen.id) ?? null;
  const relative = alternative ? relativeReason(chosen, alternative, criterion) : reason;
  const action = recommendationType === "ACT" ? `proceed with ${chosen.label}` : recommendationType === "MITIGATE" ? `mitigate ${chosen.label}` : recommendationType === "WAIT" ? `wait before committing to ${chosen.label}` : `investigate ${chosen.label}`;
  const prefix = strength === "TENTATIVE" ? "My tentative recommendation is to" : strength === "QUALIFIED" ? "Based on the current evidence, I would" : "I recommend you";
  const uncertainty = chosen.uncertainties[0] ? ` ${chosen.uncertainties[0]}` : "";
  const tradeoff = chosen.sacrifices[0] ? ` The trade-off is ${lower(chosen.sacrifices[0])}` : alternative ? ` This puts ${alternative.label} second for now, rather than dismissing it.` : "";
  const message = `${prefix} ${action}, because ${relative}${uncertainty}${tradeoff}`.replace(/\s+/g, " ").trim();
  return build(input, criterion, candidates, chosen, comparable ? "COMPARABLE" : investigationAlternative ? "PARTIAL" : "INSUFFICIENT", recommendationType, strength, "NOT_APPLICABLE", message, [reason, relative], changeConditions(chosen));
}

function readinessJudgment(input: Parameters<typeof evaluateNxa5ExecutiveJudgment>[0], criterion: ExecutiveComparisonCriterion, candidates: readonly Nxa5JudgmentCandidate[]): Nxa5ExecutiveJudgment {
  const decision = input.decision;
  if (!decision || decision.criticalEvidenceMissing.length || !decision.feasible) {
    const missing = decision?.criticalEvidenceMissing[0] ?? "a feasible option and its critical evidence";
    return build(input, criterion, candidates, null, "PARTIAL", "INVESTIGATE", "INSUFFICIENT", "NOT_READY", `We are not ready to decide. We still need to resolve ${lower(missing)}.`, [missing], [missing]);
  }
  if (decision.materialUncertainty.length) {
    const missing = decision.materialUncertainty[0]!;
    return build(input, criterion, candidates, null, "PARTIAL", "WAIT", "TENTATIVE", "NOT_READY", `I would not commit yet because ${lower(missing)} materially affects the Decision.`, [missing], [missing]);
  }
  if (decision.remainingUncertainty.length && decision.downsideUnderstood && decision.additionalLearningValue === "LOW") {
    return build(input, criterion, candidates, null, "COMPARABLE", "ACT", "QUALIFIED", "READY_WITH_KNOWN_UNCERTAINTY", `We have enough to make the Decision. ${decision.remainingUncertainty[0]} remains uncertain, but delaying is unlikely to add enough Decision value.`, ["Downside is understood and further learning value is low."], decision.remainingUncertainty);
  }
  return build(input, criterion, candidates, null, "COMPARABLE", "ACT", "STRONG", "READY", "Yes, we have enough to make the Decision. The relevant evidence, downside, and feasibility are sufficiently understood.", ["Relevant evidence, downside, and feasibility are sufficiently understood."], []);
}

function hasComparableEvidence(candidates: readonly Nxa5JudgmentCandidate[], criterion: ExecutiveComparisonCriterion): boolean {
  if (candidates.length < 2) return false;
  if (criterion === "COST" || criterion === "FINANCIAL_IMPACT") return candidates.every((candidate) => candidate.gains.some((item) => /cost|cash|margin|financial/i.test(item)) || candidate.sacrifices.some((item) => /cost|cash|margin|financial/i.test(item)));
  if (criterion === "RISK") return candidates.every((candidate) => candidate.riskExposure !== "UNKNOWN");
  if (criterion === "REVERSIBILITY") return candidates.every((candidate) => candidate.reversibility !== "UNKNOWN");
  if (criterion === "EVIDENCE_STRENGTH") return candidates.every((candidate) => candidate.evidenceStrength !== "UNKNOWN");
  return false;
}

const rank = (level: Level | Nxa5JudgmentCandidate["evidenceStrength"]) => ({ UNKNOWN: 0, WEAK: 1, LOW: 1, MODERATE: 2, STRONG: 3, HIGH: 3, CRITICAL: 4 }[level] ?? 0);
function selectDefensibleCandidate(candidates: readonly Nxa5JudgmentCandidate[], criterion: ExecutiveComparisonCriterion, type: Nxa5JudgmentType, comparable: boolean): Nxa5JudgmentCandidate | null {
  const ordered = [...candidates].sort((a, b) => compareCandidate(b, a, criterion, type) || a.id.localeCompare(b.id));
  const first = ordered[0], second = ordered[1];
  if (!first || !second) return first ?? null;
  if (!comparable && type !== "INVESTIGATION_PRIORITY" && type !== "LEARNING_PRIORITY") return null;
  return compareCandidate(first, second, criterion, type) === 0 ? null : first;
}
function compareCandidate(a: Nxa5JudgmentCandidate, b: Nxa5JudgmentCandidate, criterion: ExecutiveComparisonCriterion, type: Nxa5JudgmentType): number {
  const goal = (value: Nxa5JudgmentCandidate["goalAlignment"]) => ({ UNKNOWN: 0, NONE: 0, RELATED: 1, DIRECT: 2 }[value]);
  const reversible = (value: Nxa5JudgmentCandidate["reversibility"]) => ({ UNKNOWN: 0, IRREVERSIBLE: 0, PARTIAL: 1, REVERSIBLE: 2 }[value]);
  if (criterion === "RISK") return rank(a.riskExposure) - rank(b.riskExposure) || rank(a.evidenceStrength) - rank(b.evidenceStrength);
  if (criterion === "URGENCY") return rank(a.urgency) - rank(b.urgency) || Number(a.timeSensitive) - Number(b.timeSensitive);
  if (criterion === "REVERSIBILITY") return reversible(a.reversibility) - reversible(b.reversibility);
  if (criterion === "EVIDENCE_STRENGTH") return rank(a.evidenceStrength) - rank(b.evidenceStrength);
  if (type === "LEARNING_PRIORITY" || criterion === "INVESTIGATION_PRIORITY") return rank(a.learningValue) - rank(b.learningValue) || goal(a.goalAlignment) - goal(b.goalAlignment) || reversible(a.reversibility) - reversible(b.reversibility);
  if (criterion === "GOAL_IMPACT" || criterion === "DELIVERY_IMPACT") return goal(a.goalAlignment) - goal(b.goalAlignment) || rank(a.evidenceStrength) - rank(b.evidenceStrength);
  return Number(a.managerPreference) - Number(b.managerPreference) || rank(a.materiality) - rank(b.materiality) || goal(a.goalAlignment) - goal(b.goalAlignment) || rank(a.evidenceStrength) - rank(b.evidenceStrength);
}

function primaryReason(candidate: Nxa5JudgmentCandidate, criterion: ExecutiveComparisonCriterion): string {
  if (criterion === "RISK") return `${candidate.label} has the strongest supported risk exposure`;
  if (criterion === "URGENCY") return `${candidate.label} is the most time-sensitive supported candidate`;
  if (criterion === "REVERSIBILITY") return `${candidate.label} is the more reversible move while evidence develops`;
  if (criterion === "EVIDENCE_STRENGTH") return `${candidate.label} has the stronger evidence base`;
  if (criterion === "INVESTIGATION_PRIORITY") return candidate.goalAlignment === "UNKNOWN"
    ? `${candidate.label} offers the strongest supported combination of current-context relevance, learning value, and reversibility`
    : `${candidate.label} offers the strongest combination of Goal relevance, learning value, and reversibility`;
  if (criterion === "GOAL_IMPACT" || criterion === "DELIVERY_IMPACT") return `${candidate.label} is most directly connected to the active Goal`;
  return `${candidate.label} has the strongest supported combination of materiality, Goal relevance, and evidence`;
}
function relativeReason(chosen: Nxa5JudgmentCandidate, alternative: Nxa5JudgmentCandidate, criterion: ExecutiveComparisonCriterion): string {
  return `${primaryReason(chosen, criterion)}, while ${alternative.label} is less decisive on that criterion`;
}
function changeConditions(candidate: Nxa5JudgmentCandidate): readonly string[] {
  const conditions = [
    ...candidate.uncertainties.slice(0, 2).map(conditionFromUncertainty),
    ...(candidate.constraints.length ? [`${candidate.constraints[0]} is resolved or materially changes`] : []),
  ];
  return Object.freeze(conditions.length ? conditions : [`The evidence supporting ${candidate.label} materially weakens or an alternative becomes more relevant to the Goal.`]);
}
function conditionFromUncertainty(value: string): string {
  const normalized = value.replace(/[.]$/, "");
  if (/ remains incomplete$/i.test(normalized)) return normalized.replace(/ remains incomplete$/i, " becomes sufficient");
  if (/ is not yet verified$/i.test(normalized)) return normalized.replace(/ is not yet verified$/i, " is verified");
  return `${normalized} is resolved or materially changes`;
}
function conditionalTie(a: Nxa5JudgmentCandidate, b: Nxa5JudgmentCandidate): string {
  return `${a.label} is stronger if Goal fit is decisive; ${b.label} may be stronger if its risk or resource consequence is the priority.`;
}
function lower(value: string): string { return value ? value[0]!.toLowerCase() + value.slice(1) : value; }
function candidateNames(candidates: readonly Nxa5JudgmentCandidate[]): string {
  return candidates.map((candidate) => candidate.label).join(" and ");
}

function build(input: Parameters<typeof evaluateNxa5ExecutiveJudgment>[0], criterion: ExecutiveComparisonCriterion, candidates: readonly Nxa5JudgmentCandidate[], chosen: Nxa5JudgmentCandidate | null, comparability: Nxa5ExecutiveJudgment["comparability"], recommendationType: Nxa5RecommendationType, strength: Nxa5RecommendationStrength, readiness: Nxa5DecisionReadiness, message: string, why: readonly string[], changes: readonly string[]): Nxa5ExecutiveJudgment {
  const previous = input.previous?.preferredCandidateId ?? null;
  const tradeoffs = chosen ? [...chosen.gains.map((item) => `Gain: ${item}`), ...chosen.sacrifices.map((item) => `Sacrifice: ${item}`)] : [];
  return Object.freeze({ identity: nexoraNxa5Identity, judgmentType: input.judgmentType, criterion,
    candidateIds: Object.freeze(candidates.map((candidate) => candidate.id)), candidateSetSource: input.comparison.candidateSet.source,
    comparability, preferredCandidateId: chosen?.id ?? null, recommendationType, recommendationStrength: strength, decisionReadiness: readiness,
    what: chosen ? `${recommendationType} ${chosen.label}` : recommendationType, why: Object.freeze([...new Set(why)]),
    evidence: Object.freeze(chosen ? [`${chosen.evidenceStrength} evidence supports ${chosen.label}.`] : []),
    uncertainty: Object.freeze(chosen?.uncertainties ?? []), tradeoffs: Object.freeze(tradeoffs),
    alternatives: Object.freeze(candidates.filter((candidate) => candidate.id !== chosen?.id).map((candidate) => candidate.label)),
    nextMove: chosen ? `${recommendationType === "ACT" ? "Proceed with" : "Investigate"} ${chosen.label}.` : "Resolve the distinguishing evidence before committing.",
    changeConditions: Object.freeze(changes), changedFromPrevious: Boolean(previous && previous !== chosen?.id), managerMessage: message,
    audit: Object.freeze([`POST:4 set=${input.comparison.candidateSet.source}:${candidates.map((candidate) => candidate.id).join(",")}`, `judgment=${input.judgmentType}; criterion=${criterion}; comparability=${comparability}`, `MO:6 attention=${input.attention.attentionState}`, `NXA:3 goal=${input.situation.goal?.title ?? "none"}; decision=${input.situation.decision.state}`, `recommendation=${recommendationType}; strength=${strength}; preferred=${chosen?.id ?? "none"}`]),
    numericalScore: null, commitsDecision: false, startsExecution: false, writesOutcome: false, writesStage: false });
}
function unresolved(input: Parameters<typeof evaluateNxa5ExecutiveJudgment>[0], criterion: ExecutiveComparisonCriterion, candidates: readonly Nxa5JudgmentCandidate[], reason: string): Nxa5ExecutiveJudgment {
  return build(input, criterion, candidates, null, "INSUFFICIENT", "COMPARE", "INSUFFICIENT", "NOT_APPLICABLE", reason, [reason], []);
}
export function verifyNexoraNxa5(): { readonly ok: true } {
  if (NEXORA_NXA5_BOUNDARY.createsPrioritizationEngine || NEXORA_NXA5_BOUNDARY.createsUniversalScore || NEXORA_NXA5_BOUNDARY.commitsDecision || NEXORA_NXA5_BOUNDARY.writesStage) throw new Error("NXA:5 boundary violation");
  return Object.freeze({ ok: true as const });
}
