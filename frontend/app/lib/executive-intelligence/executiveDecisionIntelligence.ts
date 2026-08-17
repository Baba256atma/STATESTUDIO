/**
 * EI:5 — Executive Decision Intelligence.
 * Synthesizes evidence-backed recommendations and delegates manager commitment
 * to CC:10 / CC:10R. It owns no Decision state.
 */
import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { NexoraDecisionRationale } from "../conversational-control/executiveDecisionCandidate.ts";
import type { NexoraDecisionRuntimeAdapter } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  resolveNexoraExecutiveDecisionCommitment,
  type NexoraDecisionCommitmentResolverInput,
  type NexoraDecisionCommitmentResult,
} from "../conversational-control/executiveDecisionCommitmentResolver.ts";
import type { ExecutiveIntelligenceTrace } from "./executiveIntelligenceIntegration.ts";
import type { ExecutiveIssueFraming, SemanticConfidence } from "./problemRiskOpportunityIntelligence.ts";
import type {
  ScenarioComparison,
  ScenarioIntelligenceEvaluation,
  ScenarioPriorityTradeoffTrace,
} from "./scenarioPriorityTradeoffIntelligence.ts";

export const executiveDecisionIntelligenceIdentity = "EI:5/ExecutiveDecisionIntelligence" as const;
export const executiveDecisionIntelligenceVersion = "1.0.0" as const;
export const executiveDecisionIntelligenceNamespace = "nexora.executive-intelligence.decision" as const;

export const EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY = Object.freeze({
  role: "recommendation-synthesis-and-commitment-handoff" as const,
  recommendationAuthority: "EI:5/ExecutiveRecommendationSynthesis" as const,
  localAssessmentRecommendationAuthority: "CC:8/ExecutiveRecommendation" as const,
  scenarioPreferenceAuthority: "CC:9/ScenarioComparison" as const,
  nextBestActionAuthority: "STAGE-PROD:3/PresentationOnly" as const,
  decisionBriefAuthority: "STAGE-PROD:4/PresentationOnly" as const,
  commitmentAuthority: "CC:10/DecisionCommitment" as const,
  decisionAuthority: "CC:10R/CanonicalDecisionRuntime" as const,
  ownsDecisionState: false as const,
  recommendationIsDecision: false as const,
  preferenceIsCommitment: false as const,
  fabricatesManagerApproval: false as const,
  mutatesUpstreamIntelligence: false as const,
  validatesOutcomes: false as const,
  promotesLearning: false as const,
  mutatesStage: false as const,
});

export const executiveDecisionCapabilityMap = deepFreeze([
  { capability: "local-assessment-recommendation", authority: "CC:8", scope: "local assessment next step", status: "CANONICAL" },
  { capability: "scenario-preference", authority: "CC:9", scope: "scenario comparison preference; never commitment", status: "CANONICAL" },
  { capability: "workflow-guidance", authority: "STAGE-PROD:3", scope: "presentation-only next workflow action", status: "PRESENTATION_ONLY" },
  { capability: "decision-brief", authority: "STAGE-PROD:4", scope: "presentation-only grounded brief", status: "PRESENTATION_ONLY" },
  { capability: "executive-recommendation", authority: "EI:5", scope: "cross-intelligence recommendation synthesis", status: "CANONICAL" },
  { capability: "manager-commitment", authority: "CC:10", scope: "preference/intent/confirmation/commitment semantics", status: "CANONICAL" },
  { capability: "committed-decision", authority: "CC:10R", scope: "Decision identity, status, lock and transitions", status: "CANONICAL" },
] as const);

export const executiveDecisionGapRegister = deepFreeze([
  { gapId: "EI5-GAP-001", subject: "Decision rationale extensibility", owner: "EI:6", status: "PARTIAL", resolution: "Canonical Decision references EI:5 recommendation; detailed analysis stays reconstructable rather than duplicated." },
  { gapId: "EI5-GAP-002", subject: "Expected outcome validation", owner: "EI:6", status: "MISSING", resolution: "Measure prepared expectations against later observed evidence." },
  { gapId: "EI5-GAP-003", subject: "Decision Brief adapter", owner: "product integration", status: "PARTIAL", resolution: "Render EI:5 projection through PROD:4 without transferring truth authority." },
  { gapId: "EI5-GAP-004", subject: "CC:8 / PROD:3 / EI:5 recommendation terminology", owner: "architecture governance", status: "PARTIAL", resolution: "Retain explicit scopes and avoid treating workflow guidance as substantive recommendation." },
  { gapId: "EI5-GAP-005", subject: "Decision → Outcome → Learning", owner: "EI:6", status: "MISSING", resolution: "Preserve expected/actual distinction and promote only evidence-backed learning." },
] as const);

export type RecommendationStatus = "supported" | "unresolved" | "request-more-information";
export type AlternativeDisposition = "not-selected" | "deprioritized" | "infeasible";
export type ExecutiveAlternativeReference = Readonly<{
  scenarioId: string;
  disposition: AlternativeDisposition;
  reasons: readonly string[];
}>;
export type ExecutiveRecommendation = Readonly<{
  recommendationId: string;
  workspaceId: string;
  issueId: string;
  preferredScenarioId: string | null;
  alternativeScenarioIds: readonly string[];
  alternatives: readonly ExecutiveAlternativeReference[];
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  strategicContextRefs: readonly string[];
  supportingFactRefs: readonly string[];
  assumptionRefs: readonly string[];
  predictionRefs: readonly string[];
  unknownRefs: readonly string[];
  priorityRationale: readonly string[];
  tradeoffRationale: readonly Readonly<{ dimension: string; gain: string | null; sacrifice: string | null }>[];
  constraintRationale: readonly string[];
  riskRationale: readonly string[];
  supportingReasons: readonly string[];
  reducingReasons: readonly string[];
  conflictingEvidence: readonly string[];
  unresolvedEvidence: readonly string[];
  confidence: SemanticConfidence;
  recommendationStatus: RecommendationStatus;
  summary: string;
  createdAt: string;
  recommendationOnly: true;
}>;

export type ExpectedOutcomePreparation = Readonly<{
  preparationId: string;
  recommendationId: string;
  expectedOutcomeRefs: readonly string[];
  successCriteriaRefs: readonly string[];
  kpiRefs: readonly string[];
  timeHorizonRef: string | null;
  assumptionRefs: readonly string[];
  validationAuthority: "EI:6";
  validated: false;
}>;

export type DecisionRationaleHandoff = Readonly<{
  rationaleId: string;
  recommendationId: string;
  issueId: string;
  selectedScenarioId: string;
  consideredScenarioIds: readonly string[];
  strategicContextRefs: readonly string[];
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  assumptionRefs: readonly string[];
  predictionRefs: readonly string[];
  unknownRefs: readonly string[];
  tradeoffRefs: readonly string[];
  constraintRefs: readonly string[];
  conflictingEvidence: readonly string[];
  runtimeRationale: NexoraDecisionRationale;
  expectedOutcomePreparation: ExpectedOutcomePreparation;
}>;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return value;
}
function unique<T extends string>(values: readonly T[]): readonly T[] { return Object.freeze([...new Set(values)].sort()); }
function copyEvidence(refs: readonly NexoraExecutiveEvidenceReference[]): readonly NexoraExecutiveEvidenceReference[] { return Object.freeze(refs.map((ref) => Object.freeze({ ...ref }))); }

function confidenceFor(input: { supported: boolean; evidenceCount: number; unresolvedCount: number; conflictCount: number; strongEvidence: boolean }): SemanticConfidence {
  if (!input.supported && input.evidenceCount === 0) return "unknown";
  if (!input.supported) return "low";
  if (input.strongEvidence && input.unresolvedCount === 0 && input.conflictCount === 0) return "high";
  return "medium";
}

export function synthesizeExecutiveRecommendation(input: {
  readonly recommendationId: string;
  readonly issue: ExecutiveIssueFraming;
  readonly comparison: ScenarioComparison;
  readonly evaluations: readonly ScenarioIntelligenceEvaluation[];
  readonly createdAt: string;
}): ExecutiveRecommendation {
  if (input.comparison.issueId !== input.issue.issueId || input.evaluations.some((item) => item.issueId !== input.issue.issueId)) throw new Error("ei5-recommendation-issue-mismatch");
  const preferredId = input.comparison.preferredAlternativeCandidateId;
  const selected = preferredId ? input.evaluations.find((item) => item.scenarioRef.scenario.scenarioId === preferredId) ?? null : null;
  const evidenceRefs = copyEvidence(unique(input.issue.claims.flatMap((claim) => claim.evidenceRefs.map((ref) => JSON.stringify(ref)))).map((serialized) => JSON.parse(serialized) as NexoraExecutiveEvidenceReference));
  const traceable = evidenceRefs.length > 0 && input.issue.claims.some((claim) => claim.type === "FACT");
  const feasible = selected?.feasible === true && !selected.constraints.some((item) => item.mode === "hard" && item.status === "violated");
  const supported = Boolean(selected && feasible && traceable);
  const unresolved = unique([...(input.comparison.unresolvedReasons ?? []), ...input.issue.uncertaintyRefs, ...(selected?.uncertainties.map((claim) => claim.claimId) ?? [])]);
  const conflicts = unique([...(input.comparison.conflictingEvidence ?? []), ...(selected?.tradeoffs.flatMap((item) => item.sacrifice ? [`${item.dimension}: ${item.sacrifice}`] : []) ?? [])]);
  const status: RecommendationStatus = supported ? "supported" : traceable ? "request-more-information" : "unresolved";
  const confidence = confidenceFor({ supported, evidenceCount: evidenceRefs.length, unresolvedCount: unresolved.length, conflictCount: conflicts.length, strongEvidence: input.issue.evidenceStrength === "strong" });
  const alternatives = input.evaluations.filter((item) => item.scenarioRef.scenario.scenarioId !== preferredId).map((item) => deepFreeze({ scenarioId: item.scenarioRef.scenario.scenarioId, disposition: item.feasible === false ? "infeasible" as const : item.priority.level === "low" ? "deprioritized" as const : "not-selected" as const, reasons: unique([...(item.feasible === false ? ["Hard constraint prevents feasibility."] : []), ...item.priority.reducingFactors, ...item.tradeoffs.flatMap((tradeoff) => tradeoff.sacrifice ? [tradeoff.sacrifice] : [])]) }));
  return deepFreeze({
    recommendationId: input.recommendationId,
    workspaceId: input.issue.workspaceId,
    issueId: input.issue.issueId,
    preferredScenarioId: supported ? preferredId : null,
    alternativeScenarioIds: input.evaluations.map((item) => item.scenarioRef.scenario.scenarioId),
    alternatives,
    evidenceRefs,
    strategicContextRefs: unique([...(input.issue.strategicContext ? [input.issue.strategicContext.contextId] : []), ...(input.issue.strategicContext?.references.map((item) => item.id) ?? [])]),
    supportingFactRefs: unique(input.issue.claims.filter((claim) => claim.type === "FACT").map((claim) => claim.claimId)),
    assumptionRefs: unique(input.issue.claims.filter((claim) => claim.type === "ASSUMPTION").map((claim) => claim.claimId)),
    predictionRefs: unique(input.issue.claims.filter((claim) => claim.type === "PREDICTION").map((claim) => claim.claimId)),
    unknownRefs: unique(input.issue.claims.filter((claim) => claim.type === "UNKNOWN").map((claim) => claim.claimId)),
    priorityRationale: selected?.priority.primaryReasons ?? [],
    tradeoffRationale: selected?.tradeoffs.map((tradeoff) => ({ dimension: tradeoff.dimension, gain: tradeoff.gain, sacrifice: tradeoff.sacrifice })) ?? [],
    constraintRationale: selected?.constraints.map((constraint) => `${constraint.constraintRef.constraintId}: ${constraint.status} (${constraint.mode})`) ?? [],
    riskRationale: selected?.expectedRisks.map((risk) => risk.statement) ?? [],
    supportingReasons: unique([...(selected?.priority.primaryReasons ?? []), ...(selected?.tradeoffs.flatMap((item) => item.gain ? [item.gain] : []) ?? []), ...(feasible ? ["Preferred alternative is feasible within explicitly evaluated constraints."] : [])]),
    reducingReasons: unique([...(selected?.priority.reducingFactors ?? []), ...(selected?.tradeoffs.flatMap((item) => item.sacrifice ? [item.sacrifice] : []) ?? [])]),
    conflictingEvidence: conflicts,
    unresolvedEvidence: unresolved,
    confidence,
    recommendationStatus: status,
    summary: supported && selected ? `Nexora recommends ${selected.scenarioRef.scenario.name} as the current evidence-backed alternative.` : "Nexora cannot yet support an executive recommendation; more information is required.",
    createdAt: input.createdAt,
    recommendationOnly: true,
  });
}

export function createDecisionRationaleHandoff(input: {
  readonly recommendation: ExecutiveRecommendation;
  readonly issue: ExecutiveIssueFraming;
  readonly evaluation: ScenarioIntelligenceEvaluation;
  readonly expectedOutcomeRefs?: readonly string[];
  readonly successCriteriaRefs?: readonly string[];
  readonly kpiRefs?: readonly string[];
}): DecisionRationaleHandoff {
  const recommendation = input.recommendation;
  if (recommendation.recommendationStatus !== "supported" || recommendation.preferredScenarioId !== input.evaluation.scenarioRef.scenario.scenarioId) throw new Error("ei5-supported-recommendation-required");
  const goalIds = input.issue.strategicContext?.references.filter((item) => item.kind === "objective").map((item) => item.id) ?? [];
  const runtimeRationale: NexoraDecisionRationale = deepFreeze({ summary: `Manager commitment must reference ${recommendation.recommendationId}; recommendation is not commitment.`, goalIds: unique(goalIds), problemIds: [input.issue.issueId], recommendationId: recommendation.recommendationId, scenarioId: recommendation.preferredScenarioId, evidenceRefs: recommendation.evidenceRefs, uncertaintyRefs: unique([...recommendation.assumptionRefs, ...recommendation.predictionRefs, ...recommendation.unknownRefs, ...recommendation.unresolvedEvidence]) });
  const horizon = input.evaluation.scenarioRef.scenario.horizon;
  const expectedOutcomePreparation: ExpectedOutcomePreparation = deepFreeze({ preparationId: `ei5:expected:${recommendation.recommendationId}`, recommendationId: recommendation.recommendationId, expectedOutcomeRefs: unique(input.expectedOutcomeRefs ?? []), successCriteriaRefs: unique(input.successCriteriaRefs ?? []), kpiRefs: unique(input.kpiRefs ?? []), timeHorizonRef: horizon ? `${horizon.amount}:${horizon.unit}` : null, assumptionRefs: recommendation.assumptionRefs, validationAuthority: "EI:6", validated: false });
  return deepFreeze({ rationaleId: `ei5:rationale:${recommendation.recommendationId}`, recommendationId: recommendation.recommendationId, issueId: recommendation.issueId, selectedScenarioId: recommendation.preferredScenarioId, consideredScenarioIds: recommendation.alternativeScenarioIds, strategicContextRefs: recommendation.strategicContextRefs, evidenceRefs: recommendation.evidenceRefs, assumptionRefs: recommendation.assumptionRefs, predictionRefs: recommendation.predictionRefs, unknownRefs: recommendation.unknownRefs, tradeoffRefs: input.evaluation.tradeoffs.map((item) => item.tradeoffId), constraintRefs: input.evaluation.constraints.map((item) => item.constraintRef.constraintId), conflictingEvidence: recommendation.conflictingEvidence, runtimeRationale, expectedOutcomePreparation });
}

export type ManagerCommitmentHandoffResult = Readonly<{
  recommendationId: string;
  state: "preferred" | "pending-commitment" | "committed" | "rejected" | "blocked";
  commitment: NexoraDecisionCommitmentResult;
  canonicalDecisionConfirmed: boolean;
  rationaleHandoff: DecisionRationaleHandoff;
}>;
export function routeManagerCommitment(input: {
  readonly recommendation: ExecutiveRecommendation;
  readonly rationaleHandoff: DecisionRationaleHandoff;
  readonly commitmentInput: NexoraDecisionCommitmentResolverInput & Readonly<{ decisionRuntime: NexoraDecisionRuntimeAdapter }>;
}): ManagerCommitmentHandoffResult {
  if (input.recommendation.recommendationStatus !== "supported" || !input.recommendation.preferredScenarioId) throw new Error("ei5-commitment-recommendation-not-supported");
  if (input.commitmentInput.executiveContext.lastRecommendationId !== input.recommendation.recommendationId) throw new Error("ei5-context-recommendation-mismatch");
  const selectedScenarioId = input.recommendation.preferredScenarioId;
  const scenarioSession = input.commitmentInput.scenarioSession;
  const selectedEvaluation = scenarioSession?.evaluationsById[selectedScenarioId] ?? null;
  const enrichedScenarioSession = scenarioSession && selectedEvaluation
    ? deepFreeze({
        ...scenarioSession,
        evaluationsById: {
          ...scenarioSession.evaluationsById,
          [selectedScenarioId]: {
            ...selectedEvaluation,
            evidenceRefs: copyEvidence([
              ...selectedEvaluation.evidenceRefs,
              ...input.recommendation.evidenceRefs.filter((ref) => !selectedEvaluation.evidenceRefs.some((existing) => existing.sourceKind === ref.sourceKind && existing.sourceId === ref.sourceId && existing.subjectId === ref.subjectId && existing.factKey === ref.factKey)),
            ]),
            uncertainties: [
              ...selectedEvaluation.uncertainties,
              ...input.rationaleHandoff.runtimeRationale.uncertaintyRefs
                .filter((ref) => !selectedEvaluation.uncertainties.some((existing) => existing.kind === ref))
                .map((ref) => ({ kind: ref, description: `Uncertainty retained from ${input.recommendation.recommendationId}: ${ref}.`, evidenceRefs: input.recommendation.evidenceRefs })),
            ],
          },
        },
      })
    : scenarioSession;
  const targetHint = (input.commitmentInput.targetHintRaw ?? "").trim().toLowerCase();
  const normalizedTargetHint = targetHint === "recommendation" || targetHint === "the recommendation" || targetHint === "your recommendation"
    ? selectedScenarioId
    : input.commitmentInput.targetHintRaw;
  const before = input.commitmentInput.decisionRuntime.listDecisions().length;
  const commitment = resolveNexoraExecutiveDecisionCommitment({ ...input.commitmentInput, scenarioSession: enrichedScenarioSession, targetHintRaw: normalizedTargetHint });
  const after = input.commitmentInput.decisionRuntime.listDecisions().length;
  const canonicalDecisionConfirmed = Boolean(commitment.decision && input.commitmentInput.decisionRuntime.getDecision(commitment.decision.decisionId)?.decisionId === commitment.decision.decisionId);
  if ((input.commitmentInput.action === "preference" || input.commitmentInput.strength === "preference") && after !== before) throw new Error("ei5-preference-mutated-decision-runtime");
  const state = commitment.status === "preference-only" ? "preferred" as const : commitment.requiresConfirmation ? "pending-commitment" as const : commitment.decision?.status === "Approved" && canonicalDecisionConfirmed ? "committed" as const : commitment.decision?.status === "Rejected" && canonicalDecisionConfirmed ? "rejected" as const : "blocked" as const;
  return deepFreeze({ recommendationId: input.recommendation.recommendationId, state, commitment, canonicalDecisionConfirmed, rationaleHandoff: input.rationaleHandoff });
}

export type ExecutiveDecisionTrace = Readonly<{
  traceId: string;
  ei1: ExecutiveIntelligenceTrace;
  ei4: ScenarioPriorityTradeoffTrace;
  recommendation: ExecutiveRecommendation;
  rationale: DecisionRationaleHandoff;
  commitment: ManagerCommitmentHandoffResult | null;
  state: "recommended" | "preferred" | "pending-commitment" | "committed" | "rejected";
  canonicalDecisionId: string | null;
  valid: boolean;
  issues: readonly string[];
}>;
export function createExecutiveDecisionTrace(input: { readonly traceId: string; readonly ei1: ExecutiveIntelligenceTrace; readonly ei4: ScenarioPriorityTradeoffTrace; readonly recommendation: ExecutiveRecommendation; readonly rationale: DecisionRationaleHandoff; readonly commitment?: ManagerCommitmentHandoffResult | null }): ExecutiveDecisionTrace {
  const issues: string[] = [];
  if (input.recommendation.issueId !== input.ei4.issueId) issues.push("ei5-trace-issue-mismatch");
  if (input.rationale.recommendationId !== input.recommendation.recommendationId) issues.push("ei5-trace-rationale-mismatch");
  const commitment = input.commitment ?? null;
  const state = commitment?.state === "committed" ? "committed" as const : commitment?.state === "rejected" ? "rejected" as const : commitment?.state === "pending-commitment" ? "pending-commitment" as const : commitment?.state === "preferred" ? "preferred" as const : "recommended" as const;
  return deepFreeze({ traceId: input.traceId, ei1: input.ei1, ei4: input.ei4, recommendation: input.recommendation, rationale: input.rationale, commitment, state, canonicalDecisionId: commitment?.canonicalDecisionConfirmed ? commitment.commitment.decision?.decisionId ?? null : null, valid: input.ei1.valid && input.ei4.valid && issues.length === 0, issues: unique(issues) });
}

export function projectExecutiveDecisionForAdvisor(trace: ExecutiveDecisionTrace) {
  const decisionApproved = trace.canonicalDecisionId != null && trace.state === "committed";
  return deepFreeze({ traceId: trace.traceId, factsOnly: true as const, authority: false as const, recommendationStatus: trace.recommendation.recommendationStatus, recommendationSummary: trace.recommendation.summary, preferredScenarioId: trace.recommendation.preferredScenarioId, alternatives: trace.recommendation.alternatives, supportingReasons: trace.recommendation.supportingReasons, reducingReasons: trace.recommendation.reducingReasons, conflictingEvidence: trace.recommendation.conflictingEvidence, assumptions: trace.recommendation.assumptionRefs, predictions: trace.recommendation.predictionRefs, unknowns: trace.recommendation.unknownRefs, gains: trace.recommendation.tradeoffRationale.flatMap((item) => item.gain ? [item.gain] : []), sacrifices: trace.recommendation.tradeoffRationale.flatMap((item) => item.sacrifice ? [item.sacrifice] : []), constraints: trace.recommendation.constraintRationale, commitmentState: trace.state, decisionApproved, canonicalDecisionId: decisionApproved ? trace.canonicalDecisionId : null });
}

export function projectRecommendationForDecisionBrief(recommendation: ExecutiveRecommendation) {
  return deepFreeze({ presentationOnly: true as const, truthAuthority: false as const, situationRef: recommendation.issueId, evidenceRefs: recommendation.evidenceRefs, optionRefs: recommendation.alternativeScenarioIds, recommendationRef: recommendation.recommendationId, why: recommendation.supportingReasons, tradeoffs: recommendation.tradeoffRationale, constraints: recommendation.constraintRationale, uncertainty: recommendation.unresolvedEvidence, decisionRequired: recommendation.recommendationStatus === "supported" });
}

export const executiveDecisionStageCompatibility = deepFreeze({ projectionOnly: true, recommendationCreatesDecision: false, clickCommitsDecision: false, visualProminenceCreatesAuthority: false, existingTopologyPreserved: true, fixedCameraPreserved: true, zPlane: 0 });
export const executiveNextBestActionCompatibility = deepFreeze({ presentationOnly: true, workflowGuidanceOnly: true, substantiveRecommendationAuthority: false, decisionAuthority: false });

export function certifyExecutiveDecisionIntelligence(trace: ExecutiveDecisionTrace) {
  const recommendationTraceable = trace.recommendation.evidenceRefs.length > 0 && trace.recommendation.supportingFactRefs.length > 0;
  const decisionAuthorityProtected = !trace.commitment || !trace.commitment.canonicalDecisionConfirmed || trace.commitment.commitment.decision != null;
  const uncertaintyPreserved = trace.rationale.runtimeRationale.uncertaintyRefs.length >= trace.recommendation.unknownRefs.length;
  const conflictsVisible = trace.recommendation.conflictingEvidence.length > 0;
  const recommendationNotDecision = trace.recommendation.recommendationOnly && (trace.state !== "committed" || trace.canonicalDecisionId != null);
  const certified = trace.valid && recommendationTraceable && decisionAuthorityProtected && uncertaintyPreserved && conflictsVisible && recommendationNotDecision;
  return deepFreeze({ certified, recommendationTraceable, decisionAuthorityProtected, uncertaintyPreserved, conflictsVisible, recommendationNotDecision, checks: [`trace:${trace.valid ? "passed" : "failed"}`, `recommendation:${recommendationTraceable ? "passed" : "failed"}`, `decision-authority:${decisionAuthorityProtected ? "passed" : "failed"}`, `uncertainty:${uncertaintyPreserved ? "passed" : "failed"}`, `conflicts:${conflictsVisible ? "passed" : "failed"}`, `recommendation-not-decision:${recommendationNotDecision ? "passed" : "failed"}`] });
}
