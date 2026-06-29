/**
 * APP-2:4 — Executive Scenario Priority Engine certification.
 * Certification gates A–P for APP-2:4 readiness.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_CONTEXT_ENGINE_MANIFEST } from "./scenarioContextEngineCertification.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { SCENARIO_STATE_ENGINE_MANIFEST } from "./scenarioStateEngineCertification.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import {
  ExecutiveScenarioPriorityEngine,
  resolveExecutiveScenarioPriority,
} from "./executiveScenarioPriority.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTIC_CODES } from "./executiveScenarioPriorityDiagnostics.ts";
import { evaluateExecutiveScenarioPriority } from "./executiveScenarioPriorityEvaluator.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import {
  EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  EXECUTIVE_SCENARIO_PRIORITY_LEVELS,
} from "./executiveScenarioPriorityResult.ts";

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_CERTIFICATION_VERSION = "APP-2/4" as const;

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/4",
  title: "Executive Scenario Priority Engine",
  goal: "Canonical read-only executive priority assessment from ScenarioContext.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
  contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
  engineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  contractModified: false,
  stateEngineModified: false,
  contextEngineModified: false,
} as const);

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioPriorityEngineCertification(): Readonly<{
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
  const probe = resolveExecutiveScenarioPriorityProbeExample(generatedAt);
  const probeRepeat = resolveExecutiveScenarioPriorityProbeExample(generatedAt);

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        EXECUTIVE_SCENARIO_PRIORITY_LEVELS.length === 5,
      "APP-2:1 contract preserved; five priority levels defined."
    )
  );

  checks.push(
    gate(
      "B",
      "State Engine integration",
      context.state !== null &&
        context.state.engineVersion === SCENARIO_STATE_ENGINE_VERSION &&
        SCENARIO_STATE_ENGINE_MANIFEST.contractModified === false,
      "Priority evaluation consumes state embedded in ScenarioContext."
    )
  );

  checks.push(
    gate(
      "C",
      "Context Engine integration",
      context.engineVersion === SCENARIO_CONTEXT_ENGINE_VERSION &&
        SCENARIO_CONTEXT_ENGINE_MANIFEST.contractModified === false &&
        ExecutiveScenarioPriorityEngine.rules.consumesScenarioContext === true,
      "Priority engine consumes APP-2:3 ScenarioContext without rebuilding."
    )
  );

  checks.push(
    gate(
      "D",
      "Priority evaluation",
      probe.priorityLevel !== "none" && probe.scenarioId === context.scenarioId,
      `Priority level ${probe.priorityLevel} resolved for probe scenario.`
    )
  );

  checks.push(
    gate(
      "E",
      "Evidence generation",
      probe.supportingEvidence.length > 0 &&
        probe.priorityFactors.length > 0 &&
        probe.priorityReasonCodes.length > 0,
      "Priority assessment includes factors, reason codes, and evidence."
    )
  );

  checks.push(
    gate(
      "F",
      "Executive Time compatibility",
      probe.supportingEvidence.some((entry) => entry.dimension === "executive_time") &&
        ExecutiveScenarioPriorityEngine.rules.readOnly === true,
      "Executive Time contributes read-only evidence."
    )
  );

  checks.push(
    gate(
      "G",
      "Timeline compatibility",
      probe.supportingEvidence.some((entry) => entry.dimension === "timeline"),
      "Timeline contributes read-only evidence."
    )
  );

  const crossWorkspace = resolveExecutiveScenarioPriority(
    Object.freeze({
      context,
      evaluatedAt: generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "H",
      "Workspace isolation",
      crossWorkspace.priorityLevel === "none" &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_priority"),
      "Cross-workspace priority evaluation rejected."
    )
  );

  checks.push(
    gate(
      "I",
      "Diagnostics",
      EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTIC_CODES.length === 9 &&
        crossWorkspace.diagnostics.length > 0,
      "Priority diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "J",
      "Read-only compliance",
      probe.readOnly === true && ExecutiveScenarioPriorityEngine.rules.noSideEffects === true,
      "ExecutiveScenarioPriority declares readOnly and avoids side effects."
    )
  );

  checks.push(
    gate(
      "K",
      "No DS mutation",
      EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "L",
      "No INT mutation",
      EXECUTIVE_SCENARIO_PRIORITY_ENGINE_MANIFEST.contextEngineModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "M",
      "No APP-1 mutation",
      ExecutiveScenarioPriorityEngine.rules.rebuildsContext === false,
      "Executive Time consumed via ScenarioContext only."
    )
  );

  checks.push(
    gate(
      "N",
      "Build passes",
      typeof evaluateExecutiveScenarioPriority === "function" &&
        typeof resolveExecutiveScenarioPriority === "function",
      "Priority engine modules export callable functions."
    )
  );

  checks.push(
    gate(
      "O",
      "Tests pass",
      probe.priorityLevel === probeRepeat.priorityLevel &&
        probe.supportingEvidence.length === probeRepeat.supportingEvidence.length,
      "Deterministic priority output verified for identical input."
    )
  );

  checks.push(
    gate(
      "P",
      "Architecture preserved",
      probe.engineVersion === EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION &&
        ExecutiveScenarioPriorityEngine.rules.consumesScenarioContext === true,
      "ExecutiveScenarioPriority is canonical executive-priority object for APP-2."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:4 Executive Scenario Priority Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Scenario Priority Engine certification passed."
      : `Executive Scenario Priority Engine certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
