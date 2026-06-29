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
import { resolveExecutiveRecommendationPortfolio } from "./executiveRecommendationEngine.ts";
import {
  resolveExecutiveScenarioPackage,
  resolveExecutiveScenarioPackageProbeExample,
} from "./executiveScenarioPackageResolver.ts";
import { runExecutiveScenarioPackageCertification } from "./executiveScenarioPackageCertification.ts";
import {
  EXECUTIVE_SCENARIO_PACKAGE_MANIFEST,
  EXECUTIVE_SCENARIO_PACKAGE_RULES,
  EXECUTIVE_SCENARIO_PACKAGE_VERSION,
} from "./executiveScenarioPackageManifest.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTIC_CODES } from "./executiveScenarioPackageDiagnostics.ts";
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
  const recommendationPortfolio = resolveExecutiveRecommendationPortfolio(
    Object.freeze({ snapshot, summary, generatedAt: FIXED_TIME })
  );
  return Object.freeze({ snapshot, summary, recommendationPortfolio });
}

test("constructs executive scenario package from certified outputs", () => {
  const { snapshot, summary, recommendationPortfolio } = buildCertifiedChain(buildReadyIdentity());
  const pkg = resolveExecutiveScenarioPackage(
    Object.freeze({ snapshot, summary, recommendationPortfolio, generatedAt: FIXED_TIME })
  );

  assert.equal(pkg.scenarioId, snapshot.scenarioId);
  assert.equal(pkg.readOnly, true);
  assert.equal(pkg.packageVersion, "APP-2/9.5");
  assert.ok(pkg.packageId.includes(snapshot.scenarioId));
});

test("includes snapshot summary and portfolio by reference", () => {
  const { snapshot, summary, recommendationPortfolio } = buildCertifiedChain(buildReadyIdentity());
  const pkg = resolveExecutiveScenarioPackage(
    Object.freeze({ snapshot, summary, recommendationPortfolio, generatedAt: FIXED_TIME })
  );

  assert.equal(pkg.snapshot, snapshot);
  assert.equal(pkg.summary, summary);
  assert.equal(pkg.recommendationPortfolio, recommendationPortfolio);
  assert.equal(pkg.references.context, snapshot.context);
  assert.equal(pkg.references.state, snapshot.state);
  assert.equal(pkg.references.priority, snapshot.priority);
  assert.equal(pkg.references.dependencyGraph, snapshot.dependencyGraph);
  assert.equal(pkg.references.conflictGraph, snapshot.conflictGraph);
  assert.equal(pkg.references.opportunityGraph, snapshot.opportunityGraph);
});

test("package is immutable and serializable", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  assert.equal(Object.isFrozen(pkg), true);

  const serialized = JSON.stringify(pkg);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.packageVersion, "APP-2/9.5");
  assert.equal(parsed.readOnly, true);
});

test("includes complete metadata and versioning", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);

  assert.equal(pkg.metadata.packageVersion, EXECUTIVE_SCENARIO_PACKAGE_VERSION);
  assert.equal(pkg.metadata.architecture, EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.architectureVersion);
  assert.equal(pkg.metadata.certification, EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.certificationVersion);
  assert.equal(pkg.metadata.freeze, EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.freezeVersion);
  assert.equal(pkg.metadata.compatibilityVersion, EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.compatibilityVersion);
  assert.equal(pkg.metadata.readOnly, true);
});

test("enforces workspace isolation via diagnostics", () => {
  const { snapshot, summary, recommendationPortfolio } = buildCertifiedChain(buildReadyIdentity());
  const pkg = resolveExecutiveScenarioPackage(
    Object.freeze({
      snapshot,
      summary,
      recommendationPortfolio,
      generatedAt: FIXED_TIME,
      workspaceId: "ws-other",
    })
  );

  assert.ok(pkg.diagnostics.some((entry) => entry.code === "incomplete_package"));
});

test("produces deterministic package for identical input", () => {
  const first = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);

  assert.equal(first.packageId, second.packageId);
  assert.equal(first.scenarioId, second.scenarioId);
  assert.equal(first.recommendationPortfolio.recommendations.length, second.recommendationPortfolio.recommendations.length);
});

test("declares aggregation-only export rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.referencesOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.noBusinessLogic, true);
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.noRecommendationGeneration, true);
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.noMutation, true);
});

test("defines seven package diagnostic codes", () => {
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTIC_CODES.length, 7);
});

test("runExecutiveScenarioPackageCertification passes all gates", () => {
  const result = runExecutiveScenarioPackageCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 18);
});

test("does not throw for expected boundary cases", () => {
  const { snapshot, summary, recommendationPortfolio } = buildCertifiedChain(buildReadyIdentity());
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioPackage(
      Object.freeze({
        snapshot,
        summary,
        recommendationPortfolio,
        generatedAt: FIXED_TIME,
        workspaceId: "ws-other",
      })
    )
  );
});
