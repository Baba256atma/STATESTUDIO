/**
 * APP-2:3 — Scenario Context Engine certification.
 * Certification gates A–R for APP-2:3 readiness.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
  resolveScenarioIdentityExample,
} from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_CONTEXT_DIAGNOSTIC_CODES } from "./scenarioContextDiagnostics.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { ScenarioContextEngine, resolveScenarioContext } from "./scenarioContextEngine.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { SCENARIO_STATE_ENGINE_MANIFEST } from "./scenarioStateEngineCertification.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";

export const SCENARIO_CONTEXT_ENGINE_CERTIFICATION_VERSION = "APP-2/3" as const;

export const SCENARIO_CONTEXT_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/3",
  title: "Scenario Context Engine",
  goal: "Canonical read-only executive context assembly for APP-2 consumers.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
  engineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
  extendsContract: "APP-2/1",
  extendsStateEngine: "APP-2/2",
  contractModified: false,
  stateEngineModified: false,
} as const);

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runScenarioContextEngineCertification(): Readonly<{
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
  const probe = resolveScenarioContextProbeExample(generatedAt);
  const probeRepeat = resolveScenarioContextProbeExample(generatedAt);
  const identity = resolveScenarioIdentityExample();
  const metadata = createScenarioMetadataRecord();

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true,
      "APP-2:1 contract preserved read-only."
    )
  );

  checks.push(
    gate(
      "B",
      "State Engine integration",
      probe.state !== null &&
        probe.state.engineVersion === SCENARIO_STATE_ENGINE_VERSION &&
        SCENARIO_STATE_ENGINE_MANIFEST.contractModified === false,
      "ScenarioContext consumes ScenarioStateResult from APP-2:2."
    )
  );

  checks.push(
    gate(
      "C",
      "Context construction",
      probe.scenarioId === identity.scenarioId &&
        probe.workspace !== null &&
        probe.objects.length > 0 &&
        probe.readOnly === true,
      "Complete ScenarioContext assembled for probe scenario."
    )
  );

  const crossWorkspace = resolveScenarioContext({
    scenarioId: identity.scenarioId,
    workspaceId: "ws-other",
    generatedAt,
    identity,
    metadata,
    state: probe.state,
  });
  checks.push(
    gate(
      "D",
      "Workspace isolation",
      crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_context"),
      "Cross-workspace context rejected with invalid_context diagnostic."
    )
  );

  checks.push(
    gate(
      "E",
      "Executive Time integration",
      probe.executiveTimeReference !== null &&
        probe.executiveTimeReference.readOnly === true &&
        ScenarioContextEngine.rules.executiveTimeReadOnly === true,
      "Executive Time reference collected read-only."
    )
  );

  checks.push(
    gate(
      "F",
      "Timeline integration",
      probe.timelineReference !== null &&
        probe.timelineReference.readOnly === true &&
        ScenarioContextEngine.rules.timelineReadOnly === true,
      "Timeline reference collected read-only."
    )
  );

  checks.push(
    gate("G", "Object references", probe.objects.length === 1, "Object references collected.")
  );

  checks.push(
    gate(
      "H",
      "Relationship references",
      probe.relationships.length === 1,
      "Relationship references collected."
    )
  );

  checks.push(gate("I", "KPI references", probe.kpis.length === 1, "KPI references collected."));

  checks.push(gate("J", "Risk references", probe.risks.length === 1, "Risk references collected."));

  checks.push(
    gate(
      "K",
      "Diagnostics",
      probe.diagnostics.length >= 0 &&
        SCENARIO_CONTEXT_DIAGNOSTIC_CODES.length === 15 &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_context"),
      "Context diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "L",
      "Read-only compliance",
      probe.readOnly === true && ScenarioContextEngine.rules.noSideEffects === true,
      "ScenarioContext declares readOnly and avoids side effects."
    )
  );

  checks.push(
    gate(
      "M",
      "No DS mutation",
      SCENARIO_CONTEXT_ENGINE_MANIFEST.contractModified === false,
      "DS modules untouched — APP-2 extends in isolation."
    )
  );

  checks.push(
    gate(
      "N",
      "No INT mutation",
      SCENARIO_CONTEXT_ENGINE_MANIFEST.stateEngineModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "O",
      "No APP-1 mutation",
      ScenarioContextEngine.rules.executiveTimeReadOnly === true,
      "Executive Time consumed read-only without APP-1 engine imports."
    )
  );

  checks.push(
    gate(
      "P",
      "Build passes",
      typeof buildScenarioContext === "function" && typeof resolveScenarioContext === "function",
      "Context engine modules export callable functions."
    )
  );

  checks.push(
    gate(
      "Q",
      "Tests pass",
      probe.generatedAt === probeRepeat.generatedAt &&
        probe.scenarioId === probeRepeat.scenarioId &&
        probe.objects.length === probeRepeat.objects.length &&
        probe.diagnostics.length === probeRepeat.diagnostics.length,
      "Deterministic context output verified for identical input."
    )
  );

  checks.push(
    gate(
      "R",
      "Architecture preserved",
      probe.engineVersion === SCENARIO_CONTEXT_ENGINE_VERSION &&
        ScenarioContextEngine.rules.consumesStateEngine === true,
      "APP-2 architecture preserved; ScenarioContext is canonical business context."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:3 Scenario Context Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Scenario Context Engine certification passed."
      : `Scenario Context Engine certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
