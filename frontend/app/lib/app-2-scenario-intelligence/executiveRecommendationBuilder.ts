/**
 * APP-2:9 — Executive Recommendation Builder.
 * Deterministic portfolio construction from snapshot and summary only.
 */

import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import {
  EXECUTIVE_RECOMMENDATION_CONFIDENCE_RANK,
  EXECUTIVE_RECOMMENDATION_INTENT_LABELS,
  EXECUTIVE_RECOMMENDATION_INTENT_ORDER,
  type ExecutiveRecommendationFocus,
  type ExecutiveRecommendationIntent,
} from "./executiveRecommendationPortfolio.ts";
import {
  createExecutiveRecommendationAssumption,
  createExecutiveRecommendationConstraint,
  createExecutiveRecommendationEvidence,
  createExecutiveRecommendationOption,
  createExecutiveRecommendationPortfolio,
  type ExecutiveRecommendationAssumption,
  type ExecutiveRecommendationConstraint,
  type ExecutiveRecommendationEvidence,
  type ExecutiveRecommendationOption,
  type ExecutiveRecommendationPortfolio,
} from "./executiveRecommendationResult.ts";
import {
  createExecutiveRecommendationDiagnostic,
  type ExecutiveRecommendationDiagnostic,
} from "./executiveRecommendationDiagnostics.ts";

type BuildContext = Readonly<{
  snapshot: ExecutiveScenarioSnapshot;
  summary: ExecutiveScenarioSummary;
  generatedAt: string;
}>;

function evidenceId(prefix: string, index: number): string {
  return `${prefix}-evidence-${index}`;
}

function buildPortfolioEvidence(ctx: BuildContext): readonly ExecutiveRecommendationEvidence[] {
  const evidence: ExecutiveRecommendationEvidence[] = [];
  let index = 0;

  if (ctx.snapshot.state !== null) {
    evidence.push(
      createExecutiveRecommendationEvidence({
        evidenceId: evidenceId("state", index++),
        source: "state",
        sourceRef: ctx.snapshot.state.scenarioId,
        summary: ctx.summary.stateSummary,
      })
    );
  }

  evidence.push(
    createExecutiveRecommendationEvidence({
      evidenceId: evidenceId("priority", index++),
      source: "priority",
      sourceRef: ctx.snapshot.priority.scenarioId,
      summary: ctx.summary.prioritySummary,
    })
  );

  evidence.push(
    createExecutiveRecommendationEvidence({
      evidenceId: evidenceId("dependency", index++),
      source: "dependency_graph",
      sourceRef: ctx.snapshot.dependencyGraph.scenarioId,
      summary: ctx.summary.dependencySummary,
    })
  );

  evidence.push(
    createExecutiveRecommendationEvidence({
      evidenceId: evidenceId("conflict", index++),
      source: "conflict_graph",
      sourceRef: ctx.snapshot.conflictGraph.scenarioId,
      summary: ctx.summary.conflictSummary,
    })
  );

  evidence.push(
    createExecutiveRecommendationEvidence({
      evidenceId: evidenceId("opportunity", index++),
      source: "opportunity_graph",
      sourceRef: ctx.snapshot.opportunityGraph.scenarioId,
      summary: ctx.summary.opportunitySummary,
    })
  );

  evidence.push(
    createExecutiveRecommendationEvidence({
      evidenceId: evidenceId("summary", index++),
      source: "summary",
      sourceRef: ctx.summary.scenarioId,
      summary: ctx.summary.executiveHeadline,
    })
  );

  for (const entry of ctx.summary.supportingEvidence) {
    evidence.push(
      createExecutiveRecommendationEvidence({
        evidenceId: evidenceId(entry.source, index++),
        source: entry.source,
        sourceRef: entry.sourceRef,
        summary: entry.summary,
      })
    );
  }

  return Object.freeze(evidence);
}

function buildPortfolioConstraints(ctx: BuildContext): readonly ExecutiveRecommendationConstraint[] {
  const constraints: ExecutiveRecommendationConstraint[] = [
    createExecutiveRecommendationConstraint({
      constraintId: "constraint-no-execution",
      label: "No automatic execution",
      description: "Recommendations are advisory only. Executive retains final decision authority.",
    }),
    createExecutiveRecommendationConstraint({
      constraintId: "constraint-read-only",
      label: "Read-only intelligence",
      description: "Portfolio does not modify scenario, workspace, or business model state.",
    }),
  ];

  if (ctx.snapshot.conflictGraph.criticalConflicts.length > 0) {
    constraints.push(
      createExecutiveRecommendationConstraint({
        constraintId: "constraint-critical-conflicts",
        label: "Critical conflicts present",
        description: `${ctx.snapshot.conflictGraph.criticalConflicts.length} critical conflict(s) may limit viable options.`,
      })
    );
  }

  if (ctx.snapshot.opportunityGraph.blockedOpportunities.length > 0) {
    constraints.push(
      createExecutiveRecommendationConstraint({
        constraintId: "constraint-blocked-opportunities",
        label: "Blocked opportunities",
        description: `${ctx.snapshot.opportunityGraph.blockedOpportunities.length} opportunity(ies) blocked by unresolved conflicts.`,
      })
    );
  }

  if (ctx.summary.summaryStatus !== "complete") {
    constraints.push(
      createExecutiveRecommendationConstraint({
        constraintId: "constraint-partial-summary",
        label: "Partial executive summary",
        description: "Summary status is partial or incomplete; recommendations carry reduced certainty.",
      })
    );
  }

  return Object.freeze(constraints);
}

function buildPortfolioAssumptions(ctx: BuildContext): readonly ExecutiveRecommendationAssumption[] {
  const assumptions: ExecutiveRecommendationAssumption[] = [
    createExecutiveRecommendationAssumption({
      assumptionId: "assumption-certified-inputs",
      label: "Certified inputs current",
      description: "Snapshot and summary reflect the latest certified APP-2 intelligence at generation time.",
    }),
    createExecutiveRecommendationAssumption({
      assumptionId: "assumption-executive-decision",
      label: "Executive decision authority",
      description: "The executive evaluates all options and selects a course of action independently.",
    }),
  ];

  if (ctx.snapshot.state !== null && ctx.snapshot.state.completeness < 0.75) {
    assumptions.push(
      createExecutiveRecommendationAssumption({
        assumptionId: "assumption-incomplete-scenario",
        label: "Incomplete scenario data",
        description: `Scenario completeness is ${Math.round(ctx.snapshot.state.completeness * 100)}%; additional context may change recommendations.`,
      })
    );
  }

  return Object.freeze(assumptions);
}

function optionEvidence(
  portfolioEvidence: readonly ExecutiveRecommendationEvidence[],
  sources: readonly ExecutiveRecommendationEvidence["source"][]
): readonly ExecutiveRecommendationEvidence[] {
  return Object.freeze(portfolioEvidence.filter((entry) => sources.includes(entry.source)));
}

function buildMaintainCourse(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const state = ctx.snapshot.state?.currentState;
  if (state !== "healthy" && state !== "attention") {
    return null;
  }
  const confidence = state === "healthy" ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-maintain-course",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.maintain_course,
    summary: "Continue current scenario trajectory without structural changes.",
    executiveIntent: "maintain_course",
    expectedBenefits: Object.freeze([
      "Preserves operational stability.",
      "Avoids disruption from premature changes.",
    ]),
    possibleTradeoffs: Object.freeze([
      "May defer capture of identified opportunities.",
      "Existing conflicts remain unless separately addressed.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["state", "summary", "priority"]),
    supportingConflicts: Object.freeze(
      ctx.snapshot.conflictGraph.conflictNodes.slice(0, 3).map((node) => node.conflictNodeId)
    ),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.criticalDependencies.slice(0, 3).map((edge) => edge.edgeId)
    ),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: confidence,
    confidenceExplanation: `State is ${state}; maintaining course aligns with current stable posture.`,
  });
}

function buildAccelerateInitiative(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const quickWins = ctx.snapshot.opportunityGraph.quickWinOpportunities;
  const priority = ctx.snapshot.priority.priorityLevel;
  if (quickWins.length === 0 || (priority !== "high" && priority !== "critical" && priority !== "normal")) {
    return null;
  }
  const confidence = priority === "critical" || priority === "high" ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-accelerate-initiative",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.accelerate_initiative,
    summary: "Accelerate initiatives supported by quick-win opportunities and executive priority.",
    executiveIntent: "accelerate_initiative",
    expectedBenefits: Object.freeze([
      `${quickWins.length} quick-win opportunity(ies) available for near-term action.`,
      "Aligns with elevated executive priority.",
    ]),
    possibleTradeoffs: Object.freeze([
      "Increased resource demand.",
      "May amplify unresolved dependency or conflict exposure.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["opportunity_graph", "priority", "summary"]),
    supportingConflicts: Object.freeze([]),
    supportingOpportunities: Object.freeze(quickWins.slice(0, 5).map((node) => node.opportunityNodeId)),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.outgoingDependencies.slice(0, 3).map((edge) => edge.edgeId)
    ),
    priorityReferences: Object.freeze([priority]),
    confidenceLevel: confidence,
    confidenceExplanation: `${quickWins.length} quick-win opportunities with ${priority} priority support acceleration.`,
  });
}

function buildDelayInitiative(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const critical = ctx.snapshot.conflictGraph.criticalConflicts.length;
  const blocked = ctx.snapshot.state?.isBlocked === true;
  if (critical === 0 && !blocked) {
    return null;
  }
  const confidence = blocked ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-delay-initiative",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.delay_initiative,
    summary: "Defer initiative progression until critical conflicts or blocked conditions are addressed.",
    executiveIntent: "delay_initiative",
    expectedBenefits: Object.freeze([
      "Reduces risk of compounding conflicts.",
      "Allows time to resolve blocking conditions.",
    ]),
    possibleTradeoffs: Object.freeze([
      "Timeline slippage on dependent initiatives.",
      "Opportunity windows may narrow.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["conflict_graph", "state", "summary"]),
    supportingConflicts: Object.freeze(
      ctx.snapshot.conflictGraph.criticalConflicts.slice(0, 5).map((node) => node.conflictNodeId)
    ),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.incomingDependencies.slice(0, 3).map((edge) => edge.edgeId)
    ),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: confidence,
    confidenceExplanation: `${critical} critical conflict(s) and blocked state ${blocked ? "present" : "absent"} support delay.`,
  });
}

function buildReduceExposure(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const risks = ctx.snapshot.context.risks.length;
  const critical = ctx.snapshot.conflictGraph.criticalConflicts.length;
  if (risks === 0 && critical === 0) {
    return null;
  }
  const confidence = critical > 0 ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-reduce-exposure",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.reduce_exposure,
    summary: "Reduce exposure to identified risks and critical conflicts before expanding commitments.",
    executiveIntent: "reduce_exposure",
    expectedBenefits: Object.freeze([
      "Lowers downside from unresolved risk and conflict factors.",
      "Improves decision quality for subsequent actions.",
    ]),
    possibleTradeoffs: Object.freeze([
      "May require resource reallocation from growth initiatives.",
      "Short-term performance targets may be affected.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["conflict_graph", "risk", "summary"]),
    supportingConflicts: Object.freeze(
      ctx.snapshot.conflictGraph.criticalConflicts.slice(0, 5).map((node) => node.conflictNodeId)
    ),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.criticalDependencies.slice(0, 3).map((edge) => edge.edgeId)
    ),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: confidence,
    confidenceExplanation: `${risks} risk reference(s) and ${critical} critical conflict(s) warrant exposure reduction.`,
  });
}

function buildIncreaseInvestment(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const strategic = ctx.snapshot.opportunityGraph.strategicOpportunities;
  const highValue = ctx.snapshot.opportunityGraph.highValueOpportunities;
  if (strategic.length === 0 && highValue.length === 0) {
    return null;
  }
  const count = strategic.length + highValue.length;
  const confidence = strategic.length > 0 ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-increase-investment",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.increase_investment,
    summary: "Increase investment in strategic and high-value opportunities identified in the scenario.",
    executiveIntent: "increase_investment",
    expectedBenefits: Object.freeze([
      `${count} strategic or high-value opportunity(ies) support increased investment.`,
      "Potential long-term competitive advantage.",
    ]),
    possibleTradeoffs: Object.freeze([
      "Higher capital or resource commitment required.",
      "Returns depend on conflict and dependency resolution.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["opportunity_graph", "summary", "kpi"]),
    supportingConflicts: Object.freeze([]),
    supportingOpportunities: Object.freeze([
      ...strategic.slice(0, 3).map((node) => node.opportunityNodeId),
      ...highValue.slice(0, 3).map((node) => node.opportunityNodeId),
    ]),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.sharedDependencies.slice(0, 3).map((node) => node.nodeId)
    ),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: confidence,
    confidenceExplanation: `${strategic.length} strategic and ${highValue.length} high-value opportunities identified.`,
  });
}

function buildGatherEvidence(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const incomplete =
    ctx.summary.summaryStatus !== "complete" ||
    (ctx.snapshot.state !== null && ctx.snapshot.state.completeness < 0.75);
  if (!incomplete) {
    return null;
  }
  const confidence = ctx.summary.summaryStatus === "incomplete" ? "high" : "medium";
  return createExecutiveRecommendationOption({
    recommendationId: "rec-gather-evidence",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.gather_evidence,
    summary: "Gather additional evidence before committing to major executive actions.",
    executiveIntent: "gather_evidence",
    expectedBenefits: Object.freeze([
      "Improves decision confidence with fuller intelligence.",
      "Reduces risk of action on incomplete data.",
    ]),
    possibleTradeoffs: Object.freeze([
      "Delays time-sensitive opportunities.",
      "Additional analysis cost and effort required.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["summary", "state"]),
    supportingConflicts: Object.freeze([]),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze([]),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: confidence,
    confidenceExplanation: `Summary status ${ctx.summary.summaryStatus}; completeness may be insufficient for decisive action.`,
  });
}

function buildRescopeScenario(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const isolated = ctx.snapshot.dependencyGraph.isolatedDependencies.length;
  const snapshotDiagnostics = ctx.snapshot.diagnostics.length;
  if (isolated === 0 && snapshotDiagnostics === 0) {
    return null;
  }
  return createExecutiveRecommendationOption({
    recommendationId: "rec-rescope-scenario",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.rescope_scenario,
    summary: "Rescope scenario boundaries to address isolated dependencies and structural gaps.",
    executiveIntent: "rescope_scenario",
    expectedBenefits: Object.freeze([
      "Clarifies scenario scope and dependency relationships.",
      "May unlock previously blocked analysis paths.",
    ]),
    possibleTradeoffs: Object.freeze([
      "Requires stakeholder realignment on scenario boundaries.",
      "May invalidate prior comparison or simulation assumptions.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["dependency_graph", "summary"]),
    supportingConflicts: Object.freeze([]),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze(
      ctx.snapshot.dependencyGraph.isolatedDependencies.slice(0, 5).map((node) => node.nodeId)
    ),
    priorityReferences: Object.freeze([ctx.snapshot.priority.priorityLevel]),
    confidenceLevel: "medium",
    confidenceExplanation: `${isolated} isolated dependency(ies) suggest scope refinement may be beneficial.`,
  });
}

function buildMonitorOnly(ctx: BuildContext, portfolioEvidence: readonly ExecutiveRecommendationEvidence[]): ExecutiveRecommendationOption | null {
  const priority = ctx.snapshot.priority.priorityLevel;
  const critical = ctx.snapshot.conflictGraph.criticalConflicts.length;
  if ((priority !== "low" && priority !== "normal" && priority !== "none") || critical > 0) {
    return null;
  }
  return createExecutiveRecommendationOption({
    recommendationId: "rec-monitor-only",
    title: EXECUTIVE_RECOMMENDATION_INTENT_LABELS.monitor_only,
    summary: "Monitor scenario indicators without initiating new executive actions.",
    executiveIntent: "monitor_only",
    expectedBenefits: Object.freeze([
      "Minimal resource commitment while maintaining situational awareness.",
      "Preserves optionality for future decision cycles.",
    ]),
    possibleTradeoffs: Object.freeze([
      "May miss time-bound opportunities.",
      "Does not proactively address emerging concerns.",
    ]),
    supportingEvidence: optionEvidence(portfolioEvidence, ["state", "priority", "summary"]),
    supportingConflicts: Object.freeze([]),
    supportingOpportunities: Object.freeze([]),
    dependencyReferences: Object.freeze([]),
    priorityReferences: Object.freeze([priority]),
    confidenceLevel: "high",
    confidenceExplanation: `${priority} priority with no critical conflicts supports monitoring posture.`,
  });
}

function resolveRecommendedFocus(
  recommendations: readonly ExecutiveRecommendationOption[]
): ExecutiveRecommendationFocus {
  const intents = new Set(recommendations.map((entry) => entry.executiveIntent));
  if (intents.has("reduce_exposure") || intents.has("delay_initiative")) {
    return "risk_mitigation";
  }
  if (intents.has("accelerate_initiative") || intents.has("increase_investment")) {
    return "growth";
  }
  if (intents.has("gather_evidence")) {
    return "evidence";
  }
  if (intents.has("monitor_only")) {
    return "monitoring";
  }
  if (intents.has("rescope_scenario")) {
    return "optimization";
  }
  return "stability";
}

function orderRecommendations(
  recommendations: readonly ExecutiveRecommendationOption[]
): readonly string[] {
  return Object.freeze(
    [...recommendations]
      .sort((left, right) => {
        const confidenceDiff =
          EXECUTIVE_RECOMMENDATION_CONFIDENCE_RANK[right.confidenceLevel] -
          EXECUTIVE_RECOMMENDATION_CONFIDENCE_RANK[left.confidenceLevel];
        if (confidenceDiff !== 0) {
          return confidenceDiff;
        }
        return (
          EXECUTIVE_RECOMMENDATION_INTENT_ORDER[left.executiveIntent] -
          EXECUTIVE_RECOMMENDATION_INTENT_ORDER[right.executiveIntent]
        );
      })
      .map((entry) => entry.recommendationId)
  );
}

function validateRecommendations(
  recommendations: readonly ExecutiveRecommendationOption[],
  generatedAt: string
): readonly ExecutiveRecommendationDiagnostic[] {
  const diagnostics: ExecutiveRecommendationDiagnostic[] = [];

  for (const recommendation of recommendations) {
    if (recommendation.supportingEvidence.length === 0) {
      diagnostics.push(
        createExecutiveRecommendationDiagnostic(
          "missing_evidence",
          `Recommendation ${recommendation.recommendationId} lacks supporting evidence.`,
          generatedAt,
          Object.freeze({ recommendationId: recommendation.recommendationId })
        )
      );
    }
    if (!recommendation.confidenceExplanation) {
      diagnostics.push(
        createExecutiveRecommendationDiagnostic(
          "invalid_confidence",
          `Recommendation ${recommendation.recommendationId} lacks confidence explanation.`,
          generatedAt,
          Object.freeze({ recommendationId: recommendation.recommendationId })
        )
      );
    }
  }

  return Object.freeze(diagnostics);
}

export function buildExecutiveRecommendationPortfolio(
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  options: Readonly<{ generatedAt: string }>
): ExecutiveRecommendationPortfolio {
  const ctx: BuildContext = Object.freeze({ snapshot, summary, generatedAt: options.generatedAt });

  const portfolioEvidence = buildPortfolioEvidence(ctx);
  const constraints = buildPortfolioConstraints(ctx);
  const assumptions = buildPortfolioAssumptions(ctx);

  const candidates = [
    buildReduceExposure(ctx, portfolioEvidence),
    buildDelayInitiative(ctx, portfolioEvidence),
    buildGatherEvidence(ctx, portfolioEvidence),
    buildRescopeScenario(ctx, portfolioEvidence),
    buildMaintainCourse(ctx, portfolioEvidence),
    buildMonitorOnly(ctx, portfolioEvidence),
    buildAccelerateInitiative(ctx, portfolioEvidence),
    buildIncreaseInvestment(ctx, portfolioEvidence),
  ].filter((entry): entry is ExecutiveRecommendationOption => entry !== null);

  const diagnostics: ExecutiveRecommendationDiagnostic[] = [];

  if (constraints.length === 0) {
    diagnostics.push(
      createExecutiveRecommendationDiagnostic(
        "missing_constraints",
        "Portfolio constraints could not be established.",
        options.generatedAt
      )
    );
  }

  if (candidates.length === 0) {
    diagnostics.push(
      createExecutiveRecommendationDiagnostic(
        "empty_portfolio",
        "No executive recommendation options could be generated from snapshot and summary.",
        options.generatedAt
      )
    );
  }

  diagnostics.push(...validateRecommendations(candidates, options.generatedAt));

  const recommendedOrder = orderRecommendations(candidates);
  const recommendedFocus = resolveRecommendedFocus(candidates);

  return createExecutiveRecommendationPortfolio({
    scenarioId: snapshot.scenarioId,
    workspaceId: snapshot.workspaceId,
    recommendations: Object.freeze(candidates),
    recommendedOrder,
    recommendedFocus,
    evidence: portfolioEvidence,
    constraints,
    assumptions,
    diagnostics: Object.freeze(diagnostics),
    generatedAt: options.generatedAt,
  });
}

export function buildEmptyExecutiveRecommendationPortfolio(
  scenarioId: string,
  workspaceId: string,
  generatedAt: string,
  diagnostics: readonly ExecutiveRecommendationDiagnostic[]
): ExecutiveRecommendationPortfolio {
  return createExecutiveRecommendationPortfolio({
    scenarioId,
    workspaceId,
    recommendations: Object.freeze([]),
    recommendedOrder: Object.freeze([]),
    recommendedFocus: "stability",
    evidence: Object.freeze([]),
    constraints: Object.freeze([]),
    assumptions: Object.freeze([]),
    diagnostics,
    generatedAt,
  });
}
