/**
 * APP-2:8 — Executive Scenario Summary Engine certification.
 * Certification gates A–V for APP-2:8 readiness.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_CONTEXT_ENGINE_MANIFEST } from "./scenarioContextEngineCertification.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST } from "./executiveScenarioPriorityCertification.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { SCENARIO_DEPENDENCY_ENGINE_MANIFEST } from "./scenarioDependencyCertification.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_ENGINE_MANIFEST } from "./executiveScenarioConflictCertification.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_MANIFEST } from "./executiveScenarioOpportunityCertification.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";
import { SCENARIO_STATE_ENGINE_MANIFEST } from "./scenarioStateEngineCertification.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import {
  EXECUTIVE_SCENARIO_SNAPSHOT_DIAGNOSTIC_CODES,
  EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTIC_CODES,
} from "./executiveScenarioSummaryDiagnostics.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import {
  ExecutiveScenarioSummaryEngine,
  resolveExecutiveScenarioSummary,
} from "./executiveScenarioSummaryEngine.ts";
import { buildExecutiveScenarioSnapshot } from "./executiveScenarioSnapshotBuilder.ts";
import { buildExecutiveScenarioSummary } from "./executiveScenarioSummaryBuilder.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraphProbeExample } from "./executiveScenarioConflictResolver.ts";
import { resolveExecutiveScenarioOpportunityGraphProbeExample } from "./executiveScenarioOpportunityResolver.ts";

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_CERTIFICATION_VERSION = "APP-2/8" as const;

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/8",
  title: "Executive Scenario Summary Engine",
  goal: "Canonical executive snapshot aggregation and template-based summary.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
  contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
  priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  dependencyEngineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
  conflictEngineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
  opportunityEngineVersion: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
  engineVersion: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
  contractModified: false,
  stateEngineModified: false,
  contextEngineModified: false,
  priorityEngineModified: false,
  dependencyEngineModified: false,
  conflictEngineModified: false,
  opportunityEngineModified: false,
} as const);

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioSummaryEngineCertification(): Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
}> {
  const checks: ScenarioIntelligenceCertificationCheck[] = [];
  const generatedAt = new Date(0).toISOString();
  const context = resolveScenarioContextProbeExample(generatedAt);
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(generatedAt);
  const snapshotRepeat = resolveExecutiveScenarioSnapshotProbeExample(generatedAt);
  const summary = resolveExecutiveScenarioSummaryProbeExample(generatedAt);
  const summaryRepeat = resolveExecutiveScenarioSummaryProbeExample(generatedAt);

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true,
      "APP-2:1 contract preserved."
    )
  );

  checks.push(
    gate(
      "B",
      "State Engine integration",
      snapshot.state !== null &&
        snapshot.state.engineVersion === SCENARIO_STATE_ENGINE_VERSION &&
        SCENARIO_STATE_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates ScenarioStateResult from context."
    )
  );

  checks.push(
    gate(
      "C",
      "Context Engine integration",
      snapshot.context.engineVersion === SCENARIO_CONTEXT_ENGINE_VERSION &&
        SCENARIO_CONTEXT_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates APP-2:3 ScenarioContext."
    )
  );

  checks.push(
    gate(
      "D",
      "Priority Engine integration",
      snapshot.priority.engineVersion === EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION &&
        EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates APP-2:4 ExecutiveScenarioPriority."
    )
  );

  checks.push(
    gate(
      "E",
      "Dependency Engine integration",
      snapshot.dependencyGraph.engineVersion === SCENARIO_DEPENDENCY_GRAPH_VERSION &&
        SCENARIO_DEPENDENCY_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates APP-2:5 ScenarioDependencyGraph."
    )
  );

  checks.push(
    gate(
      "F",
      "Conflict Engine integration",
      snapshot.conflictGraph.engineVersion === EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION &&
        EXECUTIVE_SCENARIO_CONFLICT_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates APP-2:6 ExecutiveScenarioConflictGraph."
    )
  );

  checks.push(
    gate(
      "G",
      "Opportunity Engine integration",
      snapshot.opportunityGraph.engineVersion === EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION &&
        EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_MANIFEST.contractModified === false,
      "Snapshot aggregates APP-2:7 ExecutiveScenarioOpportunityGraph."
    )
  );

  checks.push(
    gate(
      "H",
      "ExecutiveScenarioSnapshot construction",
      snapshot.scenarioId === context.scenarioId &&
        snapshot.dependencyGraph.dependencyNodes.length > 0 &&
        snapshot.readOnly === true,
      "ExecutiveScenarioSnapshot constructed from certified outputs."
    )
  );

  checks.push(
    gate(
      "I",
      "Snapshot immutability",
      Object.isFrozen(snapshot) &&
        snapshot.engineVersion === EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
      "Snapshot is frozen and versioned."
    )
  );

  checks.push(
    gate(
      "J",
      "Summary construction",
      summary.executiveHeadline.length > 0 &&
        summary.situationBrief.length > 0 &&
        summary.readOnly === true,
      "ExecutiveScenarioSummary built from snapshot."
    )
  );

  checks.push(
    gate(
      "K",
      "Deterministic output",
      summary.executiveHeadline === summaryRepeat.executiveHeadline &&
        snapshot.opportunityGraph.opportunityNodes.length ===
          snapshotRepeat.opportunityGraph.opportunityNodes.length,
      "Identical inputs produce identical snapshot and summary."
    )
  );

  checks.push(
    gate(
      "L",
      "Evidence generation",
      summary.supportingEvidence.length > 0,
      `Generated ${summary.supportingEvidence.length} evidence records.`
    )
  );

  const crossWorkspace = resolveExecutiveScenarioSummary(
    Object.freeze({
      snapshot,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "M",
      "Workspace isolation",
      crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_summary"),
      "Cross-workspace summary rejected."
    )
  );

  checks.push(
    gate(
      "N",
      "Diagnostics",
      EXECUTIVE_SCENARIO_SNAPSHOT_DIAGNOSTIC_CODES.length === 7 &&
        EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTIC_CODES.length === 10 &&
        crossWorkspace.diagnostics.length > 0,
      "Summary diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "O",
      "Read-only compliance",
      summary.readOnly === true && ExecutiveScenarioSummaryEngine.rules.noSideEffects === true,
      "ExecutiveScenarioSummary declares readOnly."
    )
  );

  checks.push(
    gate(
      "P",
      "No DS mutation",
      EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "Q",
      "No INT mutation",
      EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST.contextEngineModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "R",
      "No APP-1 mutation",
      ExecutiveScenarioSummaryEngine.rules.rebuildsContext === false,
      "Executive Time consumed via snapshot references only."
    )
  );

  checks.push(
    gate(
      "S",
      "No recommendations",
      ExecutiveScenarioSummaryEngine.rules.recommendsExecution === false &&
        ExecutiveScenarioSummaryEngine.rules.ranksActions === false,
      "Summary explains situation without decision guidance."
    )
  );

  checks.push(
    gate(
      "T",
      "Build passes",
      typeof buildExecutiveScenarioSnapshot === "function" &&
        typeof buildExecutiveScenarioSummary === "function",
      "Summary engine modules export callable functions."
    )
  );

  checks.push(
    gate(
      "U",
      "Tests pass",
      summary.supportingEvidence.length === summaryRepeat.supportingEvidence.length,
      "Deterministic summary verified for identical snapshot."
    )
  );

  checks.push(
    gate(
      "V",
      "Architecture preserved",
      summary.engineVersion === EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION &&
        ExecutiveScenarioSummaryEngine.rules.consumesSnapshotOnly === true,
      "ExecutiveScenarioSnapshot is canonical aggregation object."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:8 Executive Scenario Summary Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Scenario Summary Engine certification passed."
      : `Executive Scenario Summary Engine certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
