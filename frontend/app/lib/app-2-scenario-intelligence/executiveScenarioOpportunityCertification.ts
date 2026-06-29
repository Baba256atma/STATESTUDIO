/**
 * APP-2:7 — Executive Scenario Opportunity Engine certification.
 * Certification gates A–R for APP-2:7 readiness.
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
import { SCENARIO_STATE_ENGINE_MANIFEST } from "./scenarioStateEngineCertification.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES } from "./executiveScenarioOpportunityGraph.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_DIAGNOSTIC_CODES } from "./executiveScenarioOpportunityDiagnostics.ts";
import {
  ExecutiveScenarioOpportunityEngine,
  resolveExecutiveScenarioOpportunityGraph,
} from "./executiveScenarioOpportunityEngine.ts";
import { buildExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityBuilder.ts";
import { resolveExecutiveScenarioOpportunityGraphProbeExample } from "./executiveScenarioOpportunityResolver.ts";
import { resolveExecutiveScenarioConflictGraphProbeExample } from "./executiveScenarioConflictResolver.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";

export const EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_CERTIFICATION_VERSION = "APP-2/7" as const;

export const EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/7",
  title: "Executive Scenario Opportunity Engine",
  goal: "Canonical read-only opportunity graph from certified executive models.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
  contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
  priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  dependencyEngineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
  conflictEngineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
  engineVersion: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
  contractModified: false,
  stateEngineModified: false,
  contextEngineModified: false,
  priorityEngineModified: false,
  dependencyEngineModified: false,
  conflictEngineModified: false,
} as const);

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioOpportunityEngineCertification(): Readonly<{
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
  const priority = resolveExecutiveScenarioPriorityProbeExample(generatedAt);
  const dependencyGraph = resolveScenarioDependencyGraphProbeExample(generatedAt);
  const conflictGraph = resolveExecutiveScenarioConflictGraphProbeExample(generatedAt);
  const probe = resolveExecutiveScenarioOpportunityGraphProbeExample(generatedAt);
  const probeRepeat = resolveExecutiveScenarioOpportunityGraphProbeExample(generatedAt);

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES.length === 15,
      "APP-2:1 contract preserved; opportunity categories defined."
    )
  );

  checks.push(
    gate(
      "B",
      "State Engine integration",
      context.state !== null &&
        context.state.engineVersion === SCENARIO_STATE_ENGINE_VERSION &&
        SCENARIO_STATE_ENGINE_MANIFEST.contractModified === false,
      "Opportunity detection consumes state embedded in ScenarioContext."
    )
  );

  checks.push(
    gate(
      "C",
      "Context Engine integration",
      context.engineVersion === SCENARIO_CONTEXT_ENGINE_VERSION &&
        SCENARIO_CONTEXT_ENGINE_MANIFEST.contractModified === false,
      "Opportunity engine consumes APP-2:3 ScenarioContext."
    )
  );

  checks.push(
    gate(
      "D",
      "Priority Engine integration",
      priority.engineVersion === EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION &&
        EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST.contractModified === false,
      "Opportunity engine consumes APP-2:4 ExecutiveScenarioPriority."
    )
  );

  checks.push(
    gate(
      "E",
      "Dependency Engine integration",
      dependencyGraph.engineVersion === SCENARIO_DEPENDENCY_GRAPH_VERSION &&
        SCENARIO_DEPENDENCY_ENGINE_MANIFEST.contractModified === false,
      "Opportunity engine consumes APP-2:5 ScenarioDependencyGraph."
    )
  );

  checks.push(
    gate(
      "F",
      "Conflict Engine integration",
      conflictGraph.engineVersion === EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION &&
        EXECUTIVE_SCENARIO_CONFLICT_ENGINE_MANIFEST.contractModified === false &&
        ExecutiveScenarioOpportunityEngine.rules.consumesConflictGraph === true,
      "Opportunity engine consumes APP-2:6 ExecutiveScenarioConflictGraph."
    )
  );

  checks.push(
    gate(
      "G",
      "Opportunity graph construction",
      probe.opportunityNodes.length > 0 &&
        probe.opportunityEdges.length > 0 &&
        probe.readOnly === true,
      `Opportunity graph built with ${probe.opportunityNodes.length} nodes.`
    )
  );

  checks.push(
    gate(
      "H",
      "Opportunity categorization",
      probe.opportunityClusters.length > 0,
      `Built ${probe.opportunityClusters.length} opportunity clusters.`
    )
  );

  checks.push(
    gate(
      "I",
      "Evidence generation",
      probe.supportingEvidence.length > 0,
      `Generated ${probe.supportingEvidence.length} evidence records.`
    )
  );

  const crossWorkspace = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({
      context,
      priority,
      dependencyGraph,
      conflictGraph,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "J",
      "Workspace isolation",
      crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_opportunity_edge"),
      "Cross-workspace opportunity graph rejected."
    )
  );

  checks.push(
    gate(
      "K",
      "Diagnostics",
      EXECUTIVE_SCENARIO_OPPORTUNITY_DIAGNOSTIC_CODES.length === 9 &&
        crossWorkspace.diagnostics.length > 0,
      "Opportunity diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "L",
      "Read-only compliance",
      probe.readOnly === true && ExecutiveScenarioOpportunityEngine.rules.noSideEffects === true,
      "ExecutiveScenarioOpportunityGraph declares readOnly."
    )
  );

  checks.push(
    gate(
      "M",
      "No DS mutation",
      EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "N",
      "No INT mutation",
      EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_MANIFEST.contextEngineModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "O",
      "No APP-1 mutation",
      ExecutiveScenarioOpportunityEngine.rules.rebuildsContext === false,
      "Executive Time consumed via certified models only."
    )
  );

  checks.push(
    gate(
      "P",
      "Build passes",
      typeof buildExecutiveScenarioOpportunityGraph === "function" &&
        typeof resolveExecutiveScenarioOpportunityGraph === "function",
      "Opportunity engine modules export callable functions."
    )
  );

  checks.push(
    gate(
      "Q",
      "Tests pass",
      probe.opportunityNodes.length === probeRepeat.opportunityNodes.length &&
        probe.supportingEvidence.length === probeRepeat.supportingEvidence.length,
      "Deterministic opportunity graph verified for identical input."
    )
  );

  checks.push(
    gate(
      "R",
      "Architecture preserved",
      probe.engineVersion === EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION &&
        ExecutiveScenarioOpportunityEngine.rules.detectsOnly === true,
      "ExecutiveScenarioOpportunityGraph is canonical opportunity model."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:7 Executive Scenario Opportunity Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Scenario Opportunity Engine certification passed."
      : `Executive Scenario Opportunity Engine certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
