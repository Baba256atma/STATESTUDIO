import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveExecutiveScenarioPriority } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraph } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResolver.ts";
import { resolveExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResolver.ts";
import {
  resolveExecutiveScenarioSnapshot,
  resolveExecutiveScenarioSummaryFromCertifiedInputs,
} from "./executiveScenarioSummaryEngine.ts";
import {
  ExecutiveRecommendationEngine,
  resolveExecutiveRecommendationPortfolio,
} from "./executiveRecommendationEngine.ts";
import { runExecutiveRecommendationEngineCertification } from "./executiveRecommendationCertification.ts";
import {
  EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS,
  EXECUTIVE_RECOMMENDATION_INTENTS,
} from "./executiveRecommendationPortfolio.ts";
import { resolveExecutiveRecommendationPortfolioProbeExample } from "./executiveRecommendationResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildReadyIdentity(): ScenarioIdentity {
  const base = resolveScenarioIdentityExample();
  return Object.freeze({
    ...base,
    status: "active",
    executiveTimeReference: Object.freeze({
      contextKey: "now",
      eventId: "evt-001",
      timestamp: FIXED_TIME,
      readOnly: true as const,
    }),
    timelineReference: Object.freeze({
      timelineId: "timeline-001",
      anchorTimestamp: FIXED_TIME,
      readOnly: true as const,
    }),
  });
}

function buildFullReferences(identity: ScenarioIdentity) {
  return Object.freeze({
    workspace: Object.freeze({ workspaceId: identity.workspaceId, readOnly: true as const }),
    executiveTime: identity.executiveTimeReference,
    timeline: identity.timelineReference,
    objects: Object.freeze([
      Object.freeze({ objectId: "obj-001", label: "Primary Object", readOnly: true as const }),
    ]),
    relationships: Object.freeze([
      Object.freeze({
        relationshipId: "rel-001",
        sourceId: "obj-001",
        targetId: "obj-002",
        readOnly: true as const,
      }),
    ]),
    kpis: Object.freeze([
      Object.freeze({ kpiId: "kpi-001", label: "Revenue", readOnly: true as const }),
    ]),
    risks: Object.freeze([
      Object.freeze({ riskId: "risk-001", label: "Supply Risk", readOnly: true as const }),
    ]),
    decisionReferences: Object.freeze([
      Object.freeze({ journalEntryId: "dj-001", decisionId: "dec-001", readOnly: true as const }),
    ]),
    simulationReferences: Object.freeze([
      Object.freeze({
        simulationId: "sim-001",
        label: "Completed Simulation",
        status: "completed",
        readOnly: true as const,
      }),
    ]),
    compareReferences: Object.freeze([
      Object.freeze({
        compareId: "cmp-001",
        baselineScenarioId: identity.scenarioId,
        candidateScenarioId: "scn-candidate-001",
        readOnly: true as const,
      }),
    ]),
    dataSources: Object.freeze([
      Object.freeze({ dataSourceId: "ds-001", label: "ERP Feed", readOnly: true as const }),
    ]),
  });
}

function buildCertifiedChain(identity: ScenarioIdentity) {
  const metadata = createScenarioMetadataRecord();
  const state = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: FIXED_TIME,
    identity,
    metadata,
  });
  const context = buildScenarioContext(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      generatedAt: FIXED_TIME,
      identity,
      metadata,
      state,
      references: buildFullReferences(identity),
    })
  );
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );
  const dependencyGraph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );
  const conflictGraph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({ context, priority, dependencyGraph, generatedAt: FIXED_TIME })
  );
  const opportunityGraph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({ context, priority, dependencyGraph, conflictGraph, generatedAt: FIXED_TIME })
  );
  const snapshot = resolveExecutiveScenarioSnapshot(
    Object.freeze({
      context,
      priority,
      dependencyGraph,
      conflictGraph,
      opportunityGraph,
      generatedAt: FIXED_TIME,
    })
  );
  const summary = resolveExecutiveScenarioSummaryFromCertifiedInputs(
    Object.freeze({
      context,
      priority,
      dependencyGraph,
      conflictGraph,
      opportunityGraph,
      generatedAt: FIXED_TIME,
    })
  );
  return Object.freeze({ snapshot, summary });
}

test("constructs recommendation portfolio with multiple options", () => {
  const { snapshot, summary } = buildCertifiedChain(buildReadyIdentity());
  const portfolio = resolveExecutiveRecommendationPortfolio(
    Object.freeze({ snapshot, summary, generatedAt: FIXED_TIME })
  );

  assert.equal(portfolio.scenarioId, snapshot.scenarioId);
  assert.equal(portfolio.readOnly, true);
  assert.equal(portfolio.engineVersion, "APP-2/9");
  assert.ok(portfolio.recommendations.length > 1);
  assert.equal(portfolio.recommendedOrder.length, portfolio.recommendations.length);
  assert.ok(portfolio.constraints.length > 0);
  assert.ok(portfolio.assumptions.length > 0);
});

test("generates evidence-linked recommendations with confidence", () => {
  const portfolio = resolveExecutiveRecommendationPortfolioProbeExample(FIXED_TIME);

  for (const recommendation of portfolio.recommendations) {
    assert.ok(recommendation.recommendationId);
    assert.ok(recommendation.title);
    assert.ok(recommendation.summary);
    assert.ok(recommendation.supportingEvidence.length > 0);
    assert.ok(recommendation.confidenceExplanation.length > 0);
    assert.ok(EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS.includes(recommendation.confidenceLevel));
    assert.ok(EXECUTIVE_RECOMMENDATION_INTENTS.includes(recommendation.executiveIntent));
    assert.equal(recommendation.readOnly, true);
  }
});

test("orders recommendations deterministically", () => {
  const first = resolveExecutiveRecommendationPortfolioProbeExample(FIXED_TIME);
  const second = resolveExecutiveRecommendationPortfolioProbeExample(FIXED_TIME);

  assert.deepEqual(first.recommendedOrder, second.recommendedOrder);
  assert.equal(first.recommendations.length, second.recommendations.length);
});

test("consumes snapshot and summary without rebuilding intelligence", () => {
  assert.equal(ExecutiveRecommendationEngine.rules.rebuildsSnapshot, false);
  assert.equal(ExecutiveRecommendationEngine.rules.rebuildsSummary, false);
  assert.equal(ExecutiveRecommendationEngine.rules.rebuildsContext, false);
  assert.equal(ExecutiveRecommendationEngine.rules.executesDecisions, false);
  assert.equal(ExecutiveRecommendationEngine.rules.portfolioBased, true);
});

test("enforces workspace isolation", () => {
  const { snapshot, summary } = buildCertifiedChain(buildReadyIdentity());
  const portfolio = resolveExecutiveRecommendationPortfolio(
    Object.freeze({ snapshot, summary, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
  );

  assert.equal(portfolio.recommendations.length, 0);
  assert.ok(portfolio.diagnostics.some((entry) => entry.code === "invalid_recommendation"));
});

test("includes portfolio-level evidence constraints and assumptions", () => {
  const portfolio = resolveExecutiveRecommendationPortfolioProbeExample(FIXED_TIME);

  assert.ok(portfolio.evidence.length > 0);
  assert.ok(portfolio.constraints.some((entry) => entry.constraintId === "constraint-no-execution"));
  assert.ok(portfolio.assumptions.some((entry) => entry.assumptionId === "assumption-executive-decision"));
});

test("defines eight recommendation intents and five confidence levels", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_INTENTS.length, 8);
  assert.equal(EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS.length, 5);
});

test("runExecutiveRecommendationEngineCertification passes all gates", () => {
  const result = runExecutiveRecommendationEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 19);
});

test("engine declares read-only no-execution rules", () => {
  assert.equal(ExecutiveRecommendationEngine.rules.readOnly, true);
  assert.equal(ExecutiveRecommendationEngine.rules.noLlm, true);
  assert.equal(ExecutiveRecommendationEngine.rules.noMl, true);
  assert.equal(
    ExecutiveRecommendationEngine.getExecutiveRecommendationEngineVersionMetadata().engineVersion,
    "APP-2/9"
  );
});

test("does not throw for expected boundary cases", () => {
  const { snapshot, summary } = buildCertifiedChain(buildReadyIdentity());
  assert.doesNotThrow(() =>
    resolveExecutiveRecommendationPortfolio(
      Object.freeze({ snapshot, summary, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
    )
  );
});
