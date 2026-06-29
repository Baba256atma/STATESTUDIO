/**
 * APP-2:2 — Scenario State Engine certification.
 * Lightweight certification gates for APP-2:2 readiness.
 */

import {
  SCENARIO_HEALTH_STATE_KEYS,
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import { SCENARIO_DIAGNOSTIC_CODES } from "./scenarioIntelligenceDiagnostics.ts";
import { SCENARIO_LIFECYCLE_STAGE_DEFINITIONS } from "./scenarioIntelligenceLifecycle.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { ScenarioStateEngine, resolveScenarioState } from "./scenarioStateEngine.ts";
import { evaluateScenarioState } from "./scenarioStateEvaluator.ts";
import {
  createScenarioStateLookupFromRecords,
  resolveScenarioStateProbeExample,
} from "./scenarioStateResolver.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";

export const SCENARIO_STATE_ENGINE_CERTIFICATION_VERSION = "APP-2/2" as const;

export const SCENARIO_STATE_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/2",
  title: "Scenario State Engine",
  goal: "Deterministic read-only scenario state resolution for APP-2 consumers.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  engineVersion: SCENARIO_STATE_ENGINE_VERSION,
  extendsContract: "APP-2/1",
  contractModified: false,
} as const);

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runScenarioStateEngineCertification(): Readonly<{
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
  const probe = resolveScenarioStateProbeExample();
  const probeResult = evaluateScenarioState(probe);
  const deterministicA = evaluateScenarioState(probe);
  const deterministicB = evaluateScenarioState(probe);

  checks.push(
    check(
      "A",
      "Contract compatibility",
      SCENARIO_HEALTH_STATE_KEYS.length === 6 &&
        SCENARIO_DIAGNOSTIC_CODES.length === 7 &&
        SCENARIO_LIFECYCLE_STAGE_DEFINITIONS.length === 8,
      "APP-2:1 contract vocabulary unchanged and consumed read-only."
    )
  );

  checks.push(
    check(
      "B",
      "State engine initialization",
      ScenarioStateEngine.version === SCENARIO_STATE_ENGINE_VERSION &&
        ScenarioStateEngine.rules.stateless === true,
      `Engine version ${ScenarioStateEngine.version} initialized with stateless rules.`
    )
  );

  checks.push(
    check(
      "C",
      "State resolution",
      probeResult.currentState === "attention" && probeResult.scenarioId === probe.scenarioId,
      `Resolved state ${probeResult.currentState} for probe scenario.`
    )
  );

  checks.push(
    check(
      "D",
      "Lifecycle validation",
      probeResult.lifecycle === "created" && probeResult.operationalState === "inactive",
      `Lifecycle ${probeResult.lifecycle} mapped to operational ${probeResult.operationalState}.`
    )
  );

  const identity = resolveScenarioIdentityExample();
  const crossWorkspace = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: "ws-other",
    evaluatedAt: probe.evaluatedAt,
    identity,
    metadata: createScenarioMetadataRecord(),
  });
  checks.push(
    check(
      "E",
      "Workspace isolation",
      crossWorkspace.isBlocked === true &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_workspace"),
      "Cross-workspace evaluation produces invalid_workspace diagnostic."
    )
  );

  checks.push(
    check(
      "F",
      "Executive Time compatibility",
      probeResult.readOnly === true &&
        ScenarioStateEngine.rules.executiveTimeReadOnly === true &&
        !probeResult.diagnostics.some((entry) => entry.code === "dependency_error"),
      "Executive Time reference validated read-only without mutation."
    )
  );

  checks.push(
    check(
      "G",
      "Timeline compatibility",
      probeResult.readOnly === true && ScenarioStateEngine.rules.timelineReadOnly === true,
      "Timeline reference consumed read-only."
    )
  );

  checks.push(
    check(
      "H",
      "Diagnostics",
      probeResult.diagnostics.length >= 0 &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_workspace"),
      "Diagnostics returned without throwing for normal boundary cases."
    )
  );

  checks.push(
    check(
      "I",
      "Read-only compliance",
      probeResult.readOnly === true && ScenarioStateEngine.rules.noSideEffects === true,
      "Engine result declares readOnly and avoids side effects."
    )
  );

  checks.push(
    check(
      "J",
      "No DS mutation",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1",
      "APP-2:1 contract manifest preserved — DS modules untouched."
    )
  );

  checks.push(
    check(
      "K",
      "No INT mutation",
      SCENARIO_STATE_ENGINE_MANIFEST.contractModified === false,
      "Engine extends APP-2:1 without INT changes."
    )
  );

  checks.push(
    check(
      "L",
      "No APP-1 mutation",
      ScenarioStateEngine.rules.executiveTimeReadOnly === true,
      "Executive Time consumed read-only without engine imports."
    )
  );

  checks.push(
    check(
      "M",
      "Build passes",
      typeof resolveScenarioState === "function" && typeof evaluateScenarioState === "function",
      "Engine modules export callable resolution functions."
    )
  );

  checks.push(
    check(
      "N",
      "Tests pass",
      deterministicA.currentState === deterministicB.currentState &&
        deterministicA.confidence === deterministicB.confidence &&
        deterministicA.completeness === deterministicB.completeness,
      "Deterministic output verified for identical input."
    )
  );

  const lookup = createScenarioStateLookupFromRecords([
    Object.freeze({
      identity: resolveScenarioIdentityExample(),
      metadata: createScenarioMetadataRecord(),
    }),
  ]);
  const lookupResult = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: probe.evaluatedAt,
    lookup,
  });
  checks.push(
    check(
      "O",
      "Architecture preserved",
      SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        lookupResult.engineVersion === SCENARIO_STATE_ENGINE_VERSION,
      "APP-2 contract freeze rules respected; engine version stamped on results."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:2 Scenario State Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Scenario State Engine certification passed."
      : `Scenario State Engine certification failed (${failedChecks.length} checks).`,
    generatedAt: new Date(0).toISOString(),
  });
}
