/**
 * EI:4 — Scenario, Priority & Trade-off Intelligence.
 * Immutable analysis over EI:3 issues and canonical CC:9 scenarios.
 * Preference is never recommendation or Decision commitment.
 */
import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { NexoraExecutiveScenario, NexoraScenarioHorizon } from "../conversational-control/executiveScenarioDefinition.ts";
import type { NexoraExecutiveScenarioEvaluation } from "../conversational-control/executiveScenarioEvaluation.ts";
import type { ExecutiveIntelligenceTrace } from "./executiveIntelligenceIntegration.ts";
import type { StrategicRelevanceLevel } from "./strategicIntelligenceIntegration.ts";
import type {
  ExecutiveClaim,
  ExecutiveConstraintReference,
  ExecutiveIssueFraming,
  EvidenceStrength,
  SemanticConfidence,
} from "./problemRiskOpportunityIntelligence.ts";

export const scenarioPriorityTradeoffIntelligenceIdentity = "EI:4/ScenarioPriorityTradeoffIntelligence" as const;
export const scenarioPriorityTradeoffIntelligenceVersion = "1.0.0" as const;
export const scenarioPriorityTradeoffIntelligenceNamespace = "nexora.executive-intelligence.scenario-priority-tradeoff" as const;

export const SCENARIO_PRIORITY_TRADEOFF_BOUNDARY = Object.freeze({
  role: "decision-preparation-analysis" as const,
  issueAuthority: "EI:3 + upstream authorities" as const,
  scenarioAuthority: "CC:9/ScenarioConversation" as const,
  priorityAuthority: "EI:4/ExplainablePriorityEvaluation" as const,
  tradeoffAuthority: "EI:4/ExplicitTradeoffEvaluation" as const,
  decisionAuthority: "CC:10R/CanonicalDecisionRuntime" as const,
  ownsScenarioState: false as const,
  commitsDecisions: false as const,
  synthesizesFinalRecommendation: false as const,
  usesOpaqueScores: false as const,
  forecasts: false as const,
  mutatesEi1: false as const,
  mutatesEi2: false as const,
  mutatesEi3: false as const,
  mutatesStage: false as const,
});

export const scenarioPriorityTradeoffCapabilityMap = deepFreeze([
  { concept: "scenario", authority: "CC:9/ScenarioConversation", status: "CANONICAL", role: "definition, session state, baseline, evaluation and comparison" },
  { concept: "priority", authority: "EI:4/ExplainablePriorityEvaluation", status: "CANONICAL", role: "semantic evidence-backed attention evaluation; no universal score" },
  { concept: "trade-off", authority: "EI:4/ExplicitTradeoffEvaluation + CC:9 directional tradeoffs", status: "CONVERGED", role: "separate gains and sacrifices" },
  { concept: "next-best-action", authority: "STAGE-PROD:3", status: "PRESENTATION_ONLY", role: "navigation guidance; numeric action ordering is not EI:4 priority" },
  { concept: "decision-brief", authority: "STAGE-PROD:4", status: "PRESENTATION_ONLY", role: "grounded presentation synthesis only" },
  { concept: "recommendation", authority: "CC:8 now; final synthesis deferred to EI:5", status: "PARTIAL", role: "EI:4 may expose a preferred candidate, never a recommendation" },
] as const);

export const scenarioPriorityTradeoffGapRegister = deepFreeze([
  { gapId: "EI4-GAP-001", subject: "Scenario → Decision synthesis", status: "PARTIAL", owner: "EI:5", resolution: "Convert decision-ready alternatives into recommendation context without commitment." },
  { gapId: "EI4-GAP-002", subject: "PROD:3 / CC:8 / EI:4 overlap", status: "PARTIAL", owner: "EI:5", resolution: "Keep navigation guidance, recommendation, and analytical preference distinct." },
  { gapId: "EI4-GAP-003", subject: "Decision Brief semantic input", status: "PARTIAL", owner: "EI:5", resolution: "Consume EI:4 alternatives without making PROD:4 an intelligence authority." },
  { gapId: "EI4-GAP-004", subject: "Missing trade-off evidence", status: "UNRESOLVED", owner: "EI:5", resolution: "Do not prefer alternatives whose differentiating trade-offs lack evidence or explicit assumptions." },
  { gapId: "EI4-GAP-005", subject: "Outcome validation", status: "MISSING", owner: "EI:6", resolution: "Compare expected scenario effects with observed outcomes without retrospective causal invention." },
] as const);

export const PRIORITY_LEVELS = Object.freeze(["high", "medium", "low", "unresolved"] as const);
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
export const PRIORITY_DIMENSIONS = Object.freeze(["operational-severity", "strategic-relevance", "urgency", "impact", "risk-exposure", "opportunity-value", "constraint-pressure", "time-sensitivity", "evidence-strength", "uncertainty"] as const);
export type PriorityDimension = (typeof PRIORITY_DIMENSIONS)[number];
export type PriorityFactor = Readonly<{
  factorId: string;
  dimension: PriorityDimension;
  level: "high" | "medium" | "low" | "unknown";
  effect: "raises" | "reduces" | "neutral" | "unresolved";
  reason: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  assumptionRefs: readonly string[];
}>;
export type ExplainablePriority = Readonly<{
  level: PriorityLevel;
  primaryReasons: readonly string[];
  reducingFactors: readonly string[];
  unresolvedDimensions: readonly PriorityDimension[];
  factors: readonly PriorityFactor[];
  numericalScore: null;
}>;

export const TRADEOFF_DIMENSIONS = Object.freeze(["cost", "time", "capacity", "quality", "risk", "revenue", "profit", "customer-impact", "operational-stability", "strategic-alignment", "resource-consumption", "reversibility", "optionality"] as const);
export type TradeoffDimension = (typeof TRADEOFF_DIMENSIONS)[number];
export type ScenarioTradeoff = Readonly<{
  tradeoffId: string;
  dimension: TradeoffDimension;
  gain: string | null;
  sacrifice: string | null;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  assumptionRefs: readonly string[];
  confidence: SemanticConfidence;
  timeHorizon: NexoraScenarioHorizon | null;
  reversibility: "reversible" | "partially-reversible" | "irreversible" | "unknown";
}>;

export type ScenarioConstraintMode = "hard" | "soft" | "unresolved";
export type ScenarioConstraintStatus = "satisfied" | "violated" | "worsened" | "reduced" | "unresolved";
export type ScenarioConstraintEvaluation = Readonly<{
  evaluationId: string;
  constraintRef: ExecutiveConstraintReference;
  mode: ScenarioConstraintMode;
  status: ScenarioConstraintStatus;
  rationale: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  explicitlyConfigured: boolean;
}>;

export type ExpectedEffect = Readonly<{
  effectId: string;
  kind: "benefit" | "cost" | "risk" | "impact";
  statement: string;
  claimType: "ASSUMPTION" | "PREDICTION" | "UNKNOWN";
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  assumptionRefs: readonly string[];
  confidence: SemanticConfidence;
}>;

export type IssueScenarioContext = Readonly<{
  handoffId: string;
  issueId: string;
  issueType: ExecutiveIssueFraming["issueType"];
  workspaceId: string;
  modelId: string | null;
  realityId: string;
  strategicContextId: string | null;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  factClaimRefs: readonly string[];
  assumptionClaimRefs: readonly string[];
  predictionClaimRefs: readonly string[];
  unknownClaimRefs: readonly string[];
  uncertaintyRefs: readonly string[];
  constraintRefs: readonly string[];
  possibleContributorRefs: readonly string[];
  operationalSeverity: ExecutiveIssueFraming["operationalSeverity"];
  strategicRelevance: StrategicRelevanceLevel;
  evidenceStrength: EvidenceStrength;
}>;

export type CanonicalScenarioReference = Readonly<{
  authorityId: "CC:9/ScenarioConversation";
  issueContext: IssueScenarioContext;
  scenario: NexoraExecutiveScenario;
  issueIdentityPreserved: true;
}>;

export type ScenarioIntelligenceEvaluation = Readonly<{
  evaluationId: string;
  issueId: string;
  scenarioRef: CanonicalScenarioReference;
  cc9Evaluation: NexoraExecutiveScenarioEvaluation | null;
  expectedBenefits: readonly ExpectedEffect[];
  expectedCosts: readonly ExpectedEffect[];
  expectedRisks: readonly ExpectedEffect[];
  expectedImpacts: readonly ExpectedEffect[];
  assumptions: readonly ExecutiveClaim[];
  uncertainties: readonly ExecutiveClaim[];
  constraints: readonly ScenarioConstraintEvaluation[];
  tradeoffs: readonly ScenarioTradeoff[];
  priority: ExplainablePriority;
  feasible: true | false | null;
  evaluationStatus: "evaluated" | "partial" | "unresolved" | "infeasible";
  forwardLooking: true;
}>;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
function unique<T extends string>(values: readonly T[]): readonly T[] { return Object.freeze([...new Set(values)].sort()); }
function evidence(refs: readonly NexoraExecutiveEvidenceReference[]): readonly NexoraExecutiveEvidenceReference[] { return Object.freeze(refs.map((ref) => Object.freeze({ ...ref }))); }

export function createIssueScenarioContext(issue: ExecutiveIssueFraming): IssueScenarioContext {
  const claims = (type: ExecutiveClaim["type"]) => unique(issue.claims.filter((claim) => claim.type === type).map((claim) => claim.claimId));
  return deepFreeze({
    handoffId: `ei4:${issue.issueId}:${issue.updatedAt}`,
    issueId: issue.issueId,
    issueType: issue.issueType,
    workspaceId: issue.workspaceId,
    modelId: issue.strategicContext?.modelId ?? null,
    realityId: issue.reality.recordId,
    strategicContextId: issue.strategicContext?.contextId ?? null,
    evidenceRefs: evidence(issue.claims.flatMap((claim) => claim.evidenceRefs)),
    factClaimRefs: claims("FACT"), assumptionClaimRefs: claims("ASSUMPTION"), predictionClaimRefs: claims("PREDICTION"), unknownClaimRefs: claims("UNKNOWN"),
    uncertaintyRefs: issue.uncertaintyRefs,
    constraintRefs: unique(issue.constraints.map((item) => item.constraintId)),
    possibleContributorRefs: unique(issue.relationships.filter((item) => item.kind === "possible-contributor").map((item) => item.relationshipId)),
    operationalSeverity: issue.operationalSeverity,
    strategicRelevance: issue.strategicRelevance,
    evidenceStrength: issue.evidenceStrength,
  });
}

export function referenceCanonicalScenario(input: { readonly issueContext: IssueScenarioContext; readonly scenario: NexoraExecutiveScenario }): CanonicalScenarioReference {
  if (!input.scenario.scenarioId.startsWith("cc9:scenario:")) throw new Error("ei4-scenario-must-use-cc9-identity");
  if (input.scenario.baseContextId && input.scenario.baseContextId !== input.issueContext.workspaceId && input.scenario.baseContextId !== input.issueContext.issueId) throw new Error("ei4-scenario-context-mismatch");
  return deepFreeze({ authorityId: "CC:9/ScenarioConversation", issueContext: input.issueContext, scenario: input.scenario, issueIdentityPreserved: true });
}

export function createPriorityFactor(input: PriorityFactor): PriorityFactor {
  if (!input.factorId || !input.reason.trim()) throw new Error("ei4-priority-factor-identity-required");
  if (input.level !== "unknown" && input.evidenceRefs.length === 0 && input.assumptionRefs.length === 0) throw new Error("ei4-priority-factor-support-required");
  return deepFreeze({ ...input, evidenceRefs: evidence(input.evidenceRefs), assumptionRefs: unique(input.assumptionRefs) });
}

export function resolveExplainablePriority(factors: readonly PriorityFactor[]): ExplainablePriority {
  const supported = factors.filter((factor) => factor.level !== "unknown" && factor.effect !== "unresolved");
  const highRaise = supported.filter((factor) => factor.level === "high" && factor.effect === "raises");
  const decisive = highRaise.some((factor) => factor.dimension === "urgency" || factor.dimension === "time-sensitivity")
    || highRaise.some((factor) => factor.dimension === "strategic-relevance") && highRaise.some((factor) => factor.dimension === "impact" || factor.dimension === "risk-exposure" || factor.dimension === "opportunity-value" || factor.dimension === "constraint-pressure");
  const level: PriorityLevel = supported.length === 0 ? "unresolved" : decisive ? "high" : highRaise.length > 0 || supported.some((factor) => factor.level === "medium" && factor.effect === "raises") ? "medium" : "low";
  return deepFreeze({
    level,
    primaryReasons: unique(supported.filter((factor) => factor.effect === "raises").map((factor) => factor.reason)),
    reducingFactors: unique(supported.filter((factor) => factor.effect === "reduces").map((factor) => factor.reason)),
    unresolvedDimensions: unique(factors.filter((factor) => factor.level === "unknown" || factor.effect === "unresolved").map((factor) => factor.dimension)),
    factors: [...factors],
    numericalScore: null,
  });
}

export type PriorityComparison = Readonly<{
  leftId: string;
  rightId: string;
  result: "left" | "right" | "tied" | "unresolved";
  higherPriorityId: string | null;
  reasons: readonly string[];
  numericalDifference: null;
}>;
export function compareExplainablePriorities(input: { readonly leftId: string; readonly left: ExplainablePriority; readonly rightId: string; readonly right: ExplainablePriority }): PriorityComparison {
  if (input.left.level === "unresolved" || input.right.level === "unresolved") return deepFreeze({ leftId: input.leftId, rightId: input.rightId, result: "unresolved", higherPriorityId: null, reasons: ["At least one priority lacks sufficient evidence."], numericalDifference: null });
  const difference = PRIORITY_ORDER[input.left.level] - PRIORITY_ORDER[input.right.level];
  if (difference === 0) return deepFreeze({ leftId: input.leftId, rightId: input.rightId, result: "tied", higherPriorityId: null, reasons: ["Supported categorical priority is equal; no unsupported tie-break was applied."], numericalDifference: null });
  const leftWins = difference > 0;
  const winner = leftWins ? input.left : input.right;
  return deepFreeze({ leftId: input.leftId, rightId: input.rightId, result: leftWins ? "left" : "right", higherPriorityId: leftWins ? input.leftId : input.rightId, reasons: winner.primaryReasons, numericalDifference: null });
}

export function createScenarioTradeoff(input: ScenarioTradeoff): ScenarioTradeoff {
  if (!input.tradeoffId || input.gain == null && input.sacrifice == null) throw new Error("ei4-tradeoff-content-required");
  if (input.evidenceRefs.length === 0 && input.assumptionRefs.length === 0) throw new Error("ei4-tradeoff-support-required");
  return deepFreeze({ ...input, evidenceRefs: evidence(input.evidenceRefs), assumptionRefs: unique(input.assumptionRefs) });
}

export function evaluateScenarioConstraint(input: {
  readonly evaluationId: string;
  readonly constraintRef: ExecutiveConstraintReference;
  readonly mode?: "hard" | "soft" | null;
  readonly status?: Exclude<ScenarioConstraintStatus, "unresolved"> | null;
  readonly rationale?: string | null;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
  readonly explicitlyConfigured?: boolean;
}): ScenarioConstraintEvaluation {
  const configured = input.explicitlyConfigured === true && input.mode != null && input.status != null && Boolean(input.rationale?.trim());
  return deepFreeze({ evaluationId: input.evaluationId, constraintRef: input.constraintRef, mode: configured ? input.mode! : "unresolved", status: configured ? input.status! : "unresolved", rationale: configured ? input.rationale! : "Constraint applicability is unresolved.", evidenceRefs: evidence(input.evidenceRefs ?? []), explicitlyConfigured: configured });
}

export function createExpectedEffect(input: ExpectedEffect): ExpectedEffect {
  if (!input.effectId || !input.statement.trim()) throw new Error("ei4-expected-effect-identity-required");
  if (input.claimType !== "UNKNOWN" && input.evidenceRefs.length === 0 && input.assumptionRefs.length === 0) throw new Error("ei4-expected-effect-support-required");
  return deepFreeze({ ...input, evidenceRefs: evidence(input.evidenceRefs), assumptionRefs: unique(input.assumptionRefs) });
}

export function createScenarioIntelligenceEvaluation(input: {
  readonly evaluationId: string;
  readonly scenarioRef: CanonicalScenarioReference;
  readonly cc9Evaluation?: NexoraExecutiveScenarioEvaluation | null;
  readonly expectedEffects?: readonly ExpectedEffect[];
  readonly claims: readonly ExecutiveClaim[];
  readonly constraints?: readonly ScenarioConstraintEvaluation[];
  readonly tradeoffs?: readonly ScenarioTradeoff[];
  readonly priorityFactors: readonly PriorityFactor[];
}): ScenarioIntelligenceEvaluation {
  if (input.cc9Evaluation && input.cc9Evaluation.scenarioId !== input.scenarioRef.scenario.scenarioId) throw new Error("ei4-cc9-evaluation-scenario-mismatch");
  const effects = input.expectedEffects ?? [];
  const constraints = input.constraints ?? [];
  const infeasible = constraints.some((item) => item.mode === "hard" && item.status === "violated");
  const unresolved = constraints.some((item) => item.status === "unresolved") || input.claims.some((claim) => claim.type === "UNKNOWN") || input.priorityFactors.some((factor) => factor.level === "unknown");
  const priority = resolveExplainablePriority(input.priorityFactors);
  const evaluationStatus = infeasible ? "infeasible" as const : priority.level === "unresolved" ? "unresolved" as const : unresolved ? "partial" as const : "evaluated" as const;
  const byKind = (kind: ExpectedEffect["kind"]) => effects.filter((effect) => effect.kind === kind);
  return deepFreeze({
    evaluationId: input.evaluationId,
    issueId: input.scenarioRef.issueContext.issueId,
    scenarioRef: input.scenarioRef,
    cc9Evaluation: input.cc9Evaluation ?? null,
    expectedBenefits: byKind("benefit"), expectedCosts: byKind("cost"), expectedRisks: byKind("risk"), expectedImpacts: byKind("impact"),
    assumptions: input.claims.filter((claim) => claim.type === "ASSUMPTION" || claim.type === "PREDICTION"),
    uncertainties: input.claims.filter((claim) => claim.type === "UNKNOWN"),
    constraints: [...constraints], tradeoffs: [...(input.tradeoffs ?? [])], priority,
    feasible: infeasible ? false : constraints.some((item) => item.status === "unresolved") ? null : true,
    evaluationStatus,
    forwardLooking: true,
  });
}

export type ScenarioComparison = Readonly<{
  comparisonId: string;
  issueId: string;
  alternativeIds: readonly string[];
  baselineScenarioId: string | null;
  orderedAlternativeIds: readonly string[];
  preferredAlternativeCandidateId: string | null;
  preferenceReasons: readonly string[];
  conflictingEvidence: readonly string[];
  unresolvedReasons: readonly string[];
  recommendation: null;
  committedDecisionId: null;
  requiresDecisionCommitment: true;
  deterministic: true;
}>;

const PRIORITY_ORDER: Readonly<Record<PriorityLevel, number>> = Object.freeze({ high: 3, medium: 2, low: 1, unresolved: 0 });
export function compareScenarioAlternatives(input: { readonly comparisonId: string; readonly evaluations: readonly ScenarioIntelligenceEvaluation[] }): ScenarioComparison {
  if (input.evaluations.length < 2) throw new Error("ei4-comparison-needs-two-alternatives");
  const issueIds = unique(input.evaluations.map((item) => item.issueId));
  if (issueIds.length !== 1) throw new Error("ei4-comparison-issue-mismatch");
  const ordered = [...input.evaluations].sort((left, right) => {
    if (left.feasible !== right.feasible) return left.feasible === true ? -1 : right.feasible === true ? 1 : left.feasible === null ? -1 : 1;
    const priority = PRIORITY_ORDER[right.priority.level] - PRIORITY_ORDER[left.priority.level];
    return priority || left.scenarioRef.scenario.scenarioId.localeCompare(right.scenarioRef.scenario.scenarioId);
  });
  const feasible = ordered.filter((item) => item.feasible === true && item.priority.level !== "unresolved");
  const top = feasible[0] ?? null;
  const tied = top ? feasible.filter((item) => item.priority.level === top.priority.level) : [];
  const preferred = tied.length === 1 ? top : null;
  const conflicts = input.evaluations.flatMap((item) => item.tradeoffs.filter((tradeoff) => tradeoff.sacrifice).map((tradeoff) => `${item.scenarioRef.scenario.scenarioId}: ${tradeoff.sacrifice}`));
  const unresolved = input.evaluations.flatMap((item) => [
    ...item.priority.unresolvedDimensions.map((dimension) => `${item.scenarioRef.scenario.scenarioId}: ${dimension} unresolved`),
    ...item.uncertainties.map((claim) => `${item.scenarioRef.scenario.scenarioId}: ${claim.statement}`),
  ]);
  return deepFreeze({
    comparisonId: input.comparisonId,
    issueId: issueIds[0],
    alternativeIds: input.evaluations.map((item) => item.scenarioRef.scenario.scenarioId),
    baselineScenarioId: input.evaluations.find((item) => item.scenarioRef.scenario.kind === "do-nothing")?.scenarioRef.scenario.scenarioId ?? null,
    orderedAlternativeIds: ordered.map((item) => item.scenarioRef.scenario.scenarioId),
    preferredAlternativeCandidateId: preferred?.scenarioRef.scenario.scenarioId ?? null,
    preferenceReasons: preferred ? preferred.priority.primaryReasons : [],
    conflictingEvidence: unique(conflicts),
    unresolvedReasons: unique(unresolved),
    recommendation: null,
    committedDecisionId: null,
    requiresDecisionCommitment: true,
    deterministic: true,
  });
}

export type ScenarioPriorityTradeoffTrace = Readonly<{
  traceId: string;
  ei1: ExecutiveIntelligenceTrace;
  issueId: string;
  scenarioIds: readonly string[];
  evaluationIds: readonly string[];
  comparison: ScenarioComparison;
  downstreamDecisionId: string | null;
  valid: boolean;
  complete: boolean;
  noFakePrecision: boolean;
  issues: readonly string[];
}>;
export function createScenarioPriorityTradeoffTrace(input: { readonly traceId: string; readonly ei1: ExecutiveIntelligenceTrace; readonly evaluations: readonly ScenarioIntelligenceEvaluation[]; readonly comparison: ScenarioComparison }): ScenarioPriorityTradeoffTrace {
  const issues: string[] = [];
  if (input.evaluations.some((item) => item.issueId !== input.comparison.issueId)) issues.push("ei4-trace-issue-mismatch");
  if (input.evaluations.some((item) => item.scenarioRef.issueContext.workspaceId !== input.ei1.workspaceId)) issues.push("ei4-trace-workspace-mismatch");
  const valid = input.ei1.valid && issues.length === 0;
  return deepFreeze({ traceId: input.traceId, ei1: input.ei1, issueId: input.comparison.issueId, scenarioIds: input.evaluations.map((item) => item.scenarioRef.scenario.scenarioId), evaluationIds: input.evaluations.map((item) => item.evaluationId), comparison: input.comparison, downstreamDecisionId: input.ei1.decision?.recordId ?? null, valid, complete: valid && input.evaluations.length >= 2, noFakePrecision: input.evaluations.every((item) => item.priority.numericalScore === null), issues: unique(issues) });
}

export type ScenarioAdvisorProjection = Readonly<{
  comparisonId: string;
  factsOnly: true;
  authority: false;
  options: readonly Readonly<{ scenarioId: string; name: string; baseline: boolean; priority: PriorityLevel; feasible: boolean | null; gains: readonly string[]; sacrifices: readonly string[]; assumptions: readonly string[]; unknowns: readonly string[]; constraints: readonly string[] }>[];
  preferredAlternativeCandidateId: string | null;
  recommendation: null;
  supportingReasons: readonly string[];
  conflictingEvidence: readonly string[];
}>;
export function projectScenarioComparisonForAdvisor(comparison: ScenarioComparison, evaluations: readonly ScenarioIntelligenceEvaluation[]): ScenarioAdvisorProjection {
  return deepFreeze({ comparisonId: comparison.comparisonId, factsOnly: true, authority: false, options: evaluations.map((item) => ({ scenarioId: item.scenarioRef.scenario.scenarioId, name: item.scenarioRef.scenario.name, baseline: item.scenarioRef.scenario.kind === "do-nothing", priority: item.priority.level, feasible: item.feasible, gains: item.tradeoffs.flatMap((tradeoff) => tradeoff.gain ? [tradeoff.gain] : []), sacrifices: item.tradeoffs.flatMap((tradeoff) => tradeoff.sacrifice ? [tradeoff.sacrifice] : []), assumptions: item.assumptions.map((claim) => claim.statement), unknowns: item.uncertainties.map((claim) => claim.statement), constraints: item.constraints.map((constraint) => `${constraint.constraintRef.constraintId}:${constraint.status}`) })), preferredAlternativeCandidateId: comparison.preferredAlternativeCandidateId, recommendation: null, supportingReasons: comparison.preferenceReasons, conflictingEvidence: comparison.conflictingEvidence });
}

export const scenarioPriorityTradeoffStageCompatibility = deepFreeze({ projectionOnly: true, scenarioAuthority: false, positionRepresentsPriority: false, sizeRepresentsImportance: false, proximityRepresentsCausality: false, existingTopologyPreserved: true, fixedCameraPreserved: true, zPlane: 0 });

export function certifyScenarioPriorityTradeoffIntelligence(trace: ScenarioPriorityTradeoffTrace) {
  const scenarioAuthorityPreserved = trace.scenarioIds.every((id) => id.startsWith("cc9:scenario:"));
  const decisionAuthorityProtected = trace.comparison.recommendation === null && trace.comparison.committedDecisionId === null && trace.comparison.requiresDecisionCommitment;
  const noFakePrecision = trace.noFakePrecision;
  const baselineComparable = trace.comparison.baselineScenarioId != null;
  const uncertaintyVisible = trace.comparison.unresolvedReasons.length > 0;
  const conflictsVisible = trace.comparison.conflictingEvidence.length > 0;
  const certified = trace.valid && trace.complete && scenarioAuthorityPreserved && decisionAuthorityProtected && noFakePrecision && baselineComparable && uncertaintyVisible && conflictsVisible;
  return deepFreeze({ certified, scenarioAuthorityPreserved, decisionAuthorityProtected, noFakePrecision, baselineComparable, uncertaintyVisible, conflictsVisible, checks: [`trace:${trace.valid ? "passed" : "failed"}`, `scenario-authority:${scenarioAuthorityPreserved ? "passed" : "failed"}`, `decision-boundary:${decisionAuthorityProtected ? "passed" : "failed"}`, `baseline:${baselineComparable ? "passed" : "failed"}`, `uncertainty:${uncertaintyVisible ? "passed" : "failed"}`, `conflicts:${conflictsVisible ? "passed" : "failed"}`] });
}
