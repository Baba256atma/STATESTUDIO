/**
 * P0:6 — End-to-End Data Reality Verification & Certification tests.
 *
 * Uses actual P0:1–P0:5 implementation APIs (not test-only reimplementation).
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS,
  NEXORA_DATA_REALITY_KNOWN_LIMITATIONS,
  NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE,
  NEXORA_DATA_REALITY_P0_STATUS_LABEL,
  createDataRealityCertificationResult,
  dataRealityCertificationIdentity,
  dataRealityCertificationVersion,
  getDataRealityCertificationIdentity,
  type NexoraDataRealityCertificationCheck,
} from "./dataRealityCertification.ts";
import {
  normalizeDatasetToBusinessFacts,
  resolveDatasetExecutiveReality,
} from "./dataRealityFoundation.ts";
import {
  bindBusinessFactsToNexoraObjects,
} from "./objectDataBinding.ts";
import { computeNexoraKPIs } from "./kpiComputation.ts";
import { resolveObjectExecutiveStates } from "./executiveStateResolution.ts";
import {
  DATA_REALITY_STAGE_PROJECTION_BOUNDARY,
  NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP,
  NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS,
  projectDataRealityToExecutiveRuntime,
} from "./dataRealityStageProjection.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";
import {
  applyDataRealityProjectionsToStageCatalog,
  NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY,
  parseNexoraMVPDataRealityDatasetScenario,
  resolveNexoraMVPDataRealityStageBridge,
} from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";

const here = dirname(fileURLToPath(import.meta.url));
const certificationChecks: NexoraDataRealityCertificationCheck[] = [];

function recordCheck(id: string, ok: boolean, detail: string) {
  certificationChecks.push(Object.freeze({ id, ok, detail }));
}

function runFullChain(scenario: "baseline" | "operational-pressure") {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const definitions = getExecutiveOperationsKpiDefinitions();
  const rules = getExecutiveOperationsExecutiveStateRules();

  const facts = normalizeDatasetToBusinessFacts(dataset);
  const bound = bindBusinessFactsToNexoraObjects(facts, bindings);
  assert.equal(bound.status, "bound");

  const kpis = computeNexoraKPIs(definitions, bound.boundFacts, {
    calculatedAt: dataset.capturedAt,
  });
  assert.equal(kpis.status, "computed");

  const states = resolveObjectExecutiveStates(kpis.kpis, rules);
  assert.equal(states.status, "resolved");

  const reality = resolveDatasetExecutiveReality(dataset, {
    bindings,
    definitions,
    rules,
  });
  assert.equal(reality.status, "resolved");

  const projection = projectDataRealityToExecutiveRuntime(reality.snapshot);
  assert.ok(projection.status === "projected" || projection.status === "partial");

  const baseCatalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const catalog = applyDataRealityProjectionsToStageCatalog(
    baseCatalog,
    projection.projections,
  );

  const interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    interaction,
    catalog,
  );

  return Object.freeze({
    dataset,
    facts,
    bound,
    kpis,
    states,
    reality,
    projection,
    catalog,
    presentation,
    bindings,
    definitions,
    rules,
  });
}

function kpi(
  chain: ReturnType<typeof runFullChain>,
  kpiId: string,
) {
  return chain.kpis.kpis.find((entry) => entry.kpiId === kpiId);
}

function state(
  chain: ReturnType<typeof runFullChain>,
  objectKey: string,
) {
  return chain.states.objectStates.find((entry) => entry.objectKey === objectKey);
}

function stageObject(
  chain: ReturnType<typeof runFullChain>,
  stageObjectId: string,
) {
  return chain.catalog.objects.find((entry) => entry.id === stageObjectId);
}

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectFiles(full));
    else if (/\.(ts|tsx)$/.test(entry) && !entry.includes(".test.")) out.push(full);
  }
  return out;
}

test("P0:6 certification identity", () => {
  const identity = getDataRealityCertificationIdentity();
  assert.equal(
    dataRealityCertificationIdentity,
    "P0:6/NexoraDataRealityEndToEndCertification",
  );
  assert.equal(identity.id, "P0:6/NexoraDataRealityEndToEndCertification");
  assert.equal(dataRealityCertificationVersion, "1.0.0");
  assert.equal(NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS.length >= 10, true);
  assert.equal(NEXORA_DATA_REALITY_KNOWN_LIMITATIONS.length, 5);
  assert.ok(NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE.baseline.route.includes("baseline"));
});

test("Test 1 — Baseline Full Chain", () => {
  const a = runFullChain("baseline");

  assert.equal(kpi(a, "kpi.revenue.growth")!.value, ((8_400_000 - 8_080_000) / 8_080_000) * 100);
  assert.equal(kpi(a, "kpi.production.capacity-utilization")!.value, 87);
  assert.equal(kpi(a, "kpi.warehouse.capacity-utilization")!.value, (7900 / 8500) * 100);
  assert.equal(kpi(a, "kpi.shipping.on-time-rate")!.value, 91);
  assert.equal(kpi(a, "kpi.customer.satisfaction-index")!.value, (4.2 / 5) * 100);

  assert.equal(state(a, "revenue")!.state, "normal");
  assert.equal(state(a, "production")!.state, "attention");
  assert.equal(state(a, "warehouse")!.state, "attention");
  assert.equal(state(a, "shipping")!.state, "attention");
  assert.equal(state(a, "customer")!.state, "attention");
  assert.equal(state(a, "cost"), undefined);

  assert.equal(stageObject(a, "obj-revenue")!.status, "stable");
  assert.equal(stageObject(a, "obj-revenue")!.attention, "normal");
  assert.equal(stageObject(a, "obj-capacity")!.status, "watch");
  assert.equal(stageObject(a, "obj-capacity")!.attention, "important");
  assert.equal(stageObject(a, "obj-inventory")!.status, "watch");
  assert.equal(stageObject(a, "obj-inventory")!.attention, "important");
  assert.equal(stageObject(a, "obj-delivery")!.status, "watch");
  assert.equal(stageObject(a, "obj-delivery")!.attention, "important");
  assert.equal(stageObject(a, "obj-customer")!.status, "watch");
  assert.equal(stageObject(a, "obj-customer")!.attention, "important");

  recordCheck("baseline-full-chain", true, "Dataset A full chain matches certified expectations.");
});

test("Test 2 — Operational Pressure Full Chain", () => {
  const b = runFullChain("operational-pressure");

  assert.equal(kpi(b, "kpi.revenue.growth")!.value, ((8_200_000 - 8_080_000) / 8_080_000) * 100);
  assert.equal(kpi(b, "kpi.production.capacity-utilization")!.value, 96);
  assert.equal(kpi(b, "kpi.warehouse.capacity-utilization")!.value, (8400 / 8500) * 100);
  assert.equal(kpi(b, "kpi.shipping.on-time-rate")!.value, 82);
  assert.equal(kpi(b, "kpi.customer.satisfaction-index")!.value, (3.6 / 5) * 100);

  assert.equal(state(b, "revenue")!.state, "attention");
  assert.equal(state(b, "production")!.state, "critical");
  assert.equal(state(b, "warehouse")!.state, "critical");
  assert.equal(state(b, "shipping")!.state, "critical");
  assert.equal(state(b, "customer")!.state, "critical");

  assert.equal(stageObject(b, "obj-revenue")!.status, "watch");
  assert.equal(stageObject(b, "obj-revenue")!.attention, "important");
  assert.equal(stageObject(b, "obj-capacity")!.status, "risk");
  assert.equal(stageObject(b, "obj-capacity")!.attention, "critical");
  assert.equal(stageObject(b, "obj-inventory")!.status, "risk");
  assert.equal(stageObject(b, "obj-inventory")!.attention, "critical");
  assert.equal(stageObject(b, "obj-delivery")!.status, "risk");
  assert.equal(stageObject(b, "obj-delivery")!.attention, "critical");
  assert.equal(stageObject(b, "obj-customer")!.status, "risk");
  assert.equal(stageObject(b, "obj-customer")!.attention, "critical");

  recordCheck(
    "operational-pressure-full-chain",
    true,
    "Dataset B full chain matches certified expectations.",
  );
});

test("Test 3 — A/B Causal Difference", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");

  assert.equal(a.dataset.familyId, b.dataset.familyId);
  assert.equal(a.bindings, b.bindings);
  assert.equal(a.definitions, b.definitions);
  assert.equal(a.rules, b.rules);
  assert.notDeepEqual(
    a.catalog.objects.map((o) => `${o.id}:${o.status}:${o.attention}`).sort(),
    b.catalog.objects.map((o) => `${o.id}:${o.status}:${o.attention}`).sort(),
  );
  assert.notEqual(
    kpi(a, "kpi.production.capacity-utilization")!.value,
    kpi(b, "kpi.production.capacity-utilization")!.value,
  );

  recordCheck(
    "ab-causal-difference",
    true,
    "Same architecture + different data produces different Stage presentation.",
  );
});

test("Test 4 — Identity Stability", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.deepEqual(
    a.projection.projections.map((p) => p.stageObjectId).sort(),
    b.projection.projections.map((p) => p.stageObjectId).sort(),
  );
  assert.deepEqual(
    a.projection.projections.map((p) => p.nexoraObjectId).sort(),
    b.projection.projections.map((p) => p.nexoraObjectId).sort(),
  );
  assert.deepEqual(
    [...NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS].map((b) => ({
      objectKey: b.objectKey,
      nexoraObjectId: b.nexoraObjectId,
      mvpStageObjectId: b.mvpStageObjectId,
    })),
    [
      {
        objectKey: "revenue",
        nexoraObjectId: "nexora.executive-operations.object.revenue",
        mvpStageObjectId: "obj-revenue",
      },
      {
        objectKey: "production",
        nexoraObjectId: "nexora.executive-operations.object.production",
        mvpStageObjectId: "obj-capacity",
      },
      {
        objectKey: "warehouse",
        nexoraObjectId: "nexora.executive-operations.object.warehouse",
        mvpStageObjectId: "obj-inventory",
      },
      {
        objectKey: "shipping",
        nexoraObjectId: "nexora.executive-operations.object.shipping",
        mvpStageObjectId: "obj-delivery",
      },
      {
        objectKey: "customer",
        nexoraObjectId: "nexora.executive-operations.object.customer",
        mvpStageObjectId: "obj-customer",
      },
    ],
  );
  recordCheck("identity-stability", true, "Canonical and Stage identities are stable across A/B.");
});

test("Test 5 — Revenue Transition normal → attention", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "revenue")!.state, "normal");
  assert.equal(state(b, "revenue")!.state, "attention");
  assert.equal(stageObject(a, "obj-revenue")!.attention, "normal");
  assert.equal(stageObject(b, "obj-revenue")!.attention, "important");
  recordCheck("revenue-transition", true, "Revenue normal → attention certified.");
});

test("Test 6 — Production Transition attention → critical", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "production")!.state, "attention");
  assert.equal(state(b, "production")!.state, "critical");
  assert.equal(stageObject(a, "obj-capacity")!.attention, "important");
  assert.equal(stageObject(b, "obj-capacity")!.attention, "critical");
  assert.equal(kpi(a, "kpi.production.capacity-utilization")!.value, 87);
  assert.equal(kpi(b, "kpi.production.capacity-utilization")!.value, 96);
  recordCheck(
    "production-transition",
    true,
    "Production 87% attention → 96% critical certified.",
  );
});

test("Test 7 — Warehouse Transition attention → critical", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "warehouse")!.state, "attention");
  assert.equal(state(b, "warehouse")!.state, "critical");
  recordCheck("warehouse-transition", true, "Warehouse attention → critical certified.");
});

test("Test 8 — Shipping Transition attention → critical", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "shipping")!.state, "attention");
  assert.equal(state(b, "shipping")!.state, "critical");
  recordCheck("shipping-transition", true, "Shipping attention → critical certified.");
});

test("Test 9 — Customer Transition attention → critical", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "customer")!.state, "attention");
  assert.equal(state(b, "customer")!.state, "critical");
  recordCheck("customer-transition", true, "Customer attention → critical certified.");
});

test("Test 10 — Cost Non-Fabrication", () => {
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");
  assert.equal(state(a, "cost"), undefined);
  assert.equal(state(b, "cost"), undefined);
  assert.equal(
    a.kpis.kpis.some((entry) => entry.objectKey === "cost"),
    false,
  );
  assert.equal(
    a.projection.projections.some((entry) => entry.objectKey === "cost"),
    false,
  );
  assert.equal(
    a.catalog.objects.some((entry) => entry.id === "obj-cost"),
    false,
  );
  assert.equal(
    a.bound.boundFacts.some((fact) => fact.objectKey === "cost"),
    true,
  );
  recordCheck(
    "cost-non-fabrication",
    true,
    "Cost remains bound but without KPI/state/Stage fabrication.",
  );
});

test("Test 11 — Non-P0 Objects Preserved (Budget/Risk/Demand)", () => {
  const fixtureById = Object.fromEntries(
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) => [object.id, object]),
  );
  const a = runFullChain("baseline");
  const b = runFullChain("operational-pressure");

  for (const id of ["obj-budget", "obj-risk", "obj-demand"] as const) {
    assert.equal(stageObject(a, id)!.status, fixtureById[id]!.status);
    assert.equal(stageObject(a, id)!.attention, fixtureById[id]!.attention);
    assert.equal(stageObject(b, id)!.status, fixtureById[id]!.status);
    assert.equal(stageObject(b, id)!.attention, fixtureById[id]!.attention);
  }
  assert.equal(stageObject(a, "obj-risk")!.attention, "critical");
  assert.equal(stageObject(b, "obj-risk")!.attention, "critical");
  assert.equal(stageObject(a, "obj-budget")!.attention, "normal");
  assert.equal(stageObject(b, "obj-budget")!.attention, "normal");

  recordCheck(
    "non-p0-objects-preserved",
    true,
    "Budget/Risk/Demand retain fixture state; P0 does not overwrite them.",
  );
});

test("Test 12 — Structured Reasons Survive", () => {
  const b = runFullChain("operational-pressure");
  const production = state(b, "production")!;
  assert.ok(production.reasons.length > 0);
  assert.equal(production.reasons[0]!.ruleId, "production-capacity-state-rule");
  assert.equal(production.reasons[0]!.value, 96);
  assert.equal(production.reasons[0]!.state, "critical");

  const projected = b.projection.projections.find(
    (entry) => entry.stageObjectId === "obj-capacity",
  )!;
  assert.equal(projected.reasons[0]!.ruleId, "production-capacity-state-rule");
  assert.equal(projected.reasons[0]!.kpiId, "kpi.production.capacity-utilization");

  recordCheck(
    "reason-provenance",
    true,
    "Structured reasons survive Dataset → KPI → rule → state → projection.",
  );
});

test("Test 13 — Determinism", () => {
  const first = runFullChain("baseline");
  const second = runFullChain("baseline");
  assert.deepEqual(first.facts, second.facts);
  assert.deepEqual(first.kpis.kpis, second.kpis.kpis);
  assert.deepEqual(first.states.objectStates, second.states.objectStates);
  assert.deepEqual(first.projection.projections, second.projection.projections);

  const b1 = runFullChain("operational-pressure");
  const b2 = runFullChain("operational-pressure");
  assert.deepEqual(b1.projection.projections, b2.projection.projections);
  recordCheck("determinism", true, "Repeated full-chain execution is identical.");
});

test("Test 14 — Immutability", () => {
  const datasetA = getExecutiveOperationsDemoDataset();
  const datasetB = getExecutiveOperationsPressureDataset();
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const definitions = getExecutiveOperationsKpiDefinitions();
  const rules = getExecutiveOperationsExecutiveStateRules();
  const identity = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS;

  const aJson = JSON.stringify(datasetA);
  const bJson = JSON.stringify(datasetB);
  const bindingsJson = JSON.stringify(bindings);
  const definitionsJson = JSON.stringify(definitions);
  const rulesJson = JSON.stringify(rules);
  const identityJson = JSON.stringify(identity);

  runFullChain("baseline");
  runFullChain("operational-pressure");

  assert.equal(JSON.stringify(datasetA), aJson);
  assert.equal(JSON.stringify(datasetB), bJson);
  assert.equal(JSON.stringify(bindings), bindingsJson);
  assert.equal(JSON.stringify(definitions), definitionsJson);
  assert.equal(JSON.stringify(rules), rulesJson);
  assert.equal(JSON.stringify(identity), identityJson);
  recordCheck("immutability", true, "Upstream registries and datasets remain immutable.");
});

test("Test 15 — Failure Isolation", () => {
  const a = runFullChain("baseline");
  const snapshot = Object.freeze({
    ...a.reality.snapshot,
    objectStates: Object.freeze([
      ...a.reality.snapshot.objectStates,
      Object.freeze({
        objectKey: "orphan",
        nexoraObjectId: "nexora.executive-operations.object.orphan",
        state: "critical" as const,
        reasons: Object.freeze([
          Object.freeze({
            kpiId: "kpi.orphan",
            kpiName: "Orphan",
            value: 1,
            unit: "%",
            state: "critical" as const,
            ruleId: "orphan-rule",
          }),
        ]),
      }),
    ]),
  });
  const projection = projectDataRealityToExecutiveRuntime(snapshot);
  assert.equal(projection.status, "partial");
  assert.ok(projection.issues.some((issue) => issue.code === "UNMAPPED_STAGE_OBJECT"));
  assert.equal(projection.projections.length, 5);
  assert.ok(
    projection.projections.some((entry) => entry.stageObjectId === "obj-capacity"),
  );
  recordCheck(
    "failure-isolation",
    true,
    "Unmapped projection does not corrupt valid projections.",
  );
});

test("Test 16 — Stage Business-Logic Boundary", () => {
  const stageRoot = join(here, "../../executive/nex-mvp/stage");
  const forbidden = [
    "computeNexoraKPI",
    "resolveKPIExecutiveState",
    "executiveOperationsExecutiveStateRules",
    "executiveOperationsDemoDataset",
    "minInclusive",
    "ZERO_DENOMINATOR",
    "production-capacity-state-rule",
  ];
  for (const file of collectFiles(stageRoot)) {
    const source = readFileSync(file, "utf8");
    for (const token of forbidden) {
      assert.equal(source.includes(token), false, `${file} :: ${token}`);
    }
    assert.equal(source.includes("data-reality"), false, file);
  }
  recordCheck(
    "stage-business-logic-boundary",
    true,
    "Low-level Stage does not compute KPI/state rules.",
  );
});

test("Test 17 — No Parallel Runtime", () => {
  assert.equal(DATA_REALITY_STAGE_PROJECTION_BOUNDARY.ownsParallelRuntime, false);
  assert.equal(NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY.ownsParallelRuntime, false);
  assert.equal(
    DATA_REALITY_STAGE_PROJECTION_BOUNDARY.consumesExistingMvpStatusAttention,
    true,
  );
  assert.deepEqual(
    NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP.map((m) => m.executiveState),
    ["normal", "attention", "critical"],
  );
  recordCheck(
    "no-parallel-runtime",
    true,
    "P0 uses existing MVP status/attention; no parallel runtime engine.",
  );
});

test("Test 18 — Workspace Isolation", () => {
  const a = resolveNexoraMVPDataRealityStageBridge("baseline");
  const b = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  const interactionA = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const interactionB = { ...interactionA };
  const presentationA = deriveNexoraMVPStageInteractionPresentation(
    interactionA,
    a.catalog,
  );
  const presentationB = deriveNexoraMVPStageInteractionPresentation(
    interactionB,
    b.catalog,
  );
  assert.equal(presentationA.scene.environmentIntent, "neutral");
  assert.equal(presentationB.scene.environmentIntent, "neutral");
  assert.equal(interactionA.workspace, "overview");
  assert.equal(interactionB.workspace, "overview");
  assert.equal(interactionA.presentationState, "report");
  assert.equal(interactionB.presentationState, "report");
  recordCheck(
    "workspace-isolation",
    true,
    "Dataset change does not alter workspace/presentation/environment context.",
  );
});

test("Test 19 — Interaction Coexistence", () => {
  const bridge = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", bridge.catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    bridge.catalog,
  );
  const capacity = presentation.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.equal(capacity.attention, "critical");
  assert.equal(capacity.selected, true);
  assert.equal(capacity.focused, true);

  state = selectNexoraMVPInteractionSubject(state, "obj-revenue", bridge.catalog);
  const revenuePresentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    bridge.catalog,
  );
  const revenue = revenuePresentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenue.attention, "important");
  assert.equal(revenue.focused, true);
  recordCheck(
    "interaction-coexistence",
    true,
    "Business state and selection/focus coexist independently.",
  );
});

test("Test 20 — Query Selection", () => {
  assert.equal(parseNexoraMVPDataRealityDatasetScenario("baseline"), "baseline");
  assert.equal(
    parseNexoraMVPDataRealityDatasetScenario("operational-pressure"),
    "operational-pressure",
  );
  assert.equal(parseNexoraMVPDataRealityDatasetScenario(undefined), "baseline");
  assert.equal(parseNexoraMVPDataRealityDatasetScenario(null), "baseline");
  assert.equal(parseNexoraMVPDataRealityDatasetScenario("unknown"), "baseline");
  assert.equal(parseNexoraMVPDataRealityDatasetScenario(""), "baseline");

  const bridgeUnknown = resolveNexoraMVPDataRealityStageBridge(
    parseNexoraMVPDataRealityDatasetScenario("garbage"),
  );
  assert.equal(bridgeUnknown.scenario, "baseline");
  assert.equal(bridgeUnknown.projection.status, "projected");

  recordCheck(
    "query-selection",
    true,
    "baseline/operational-pressure resolve; unknown falls back to baseline safely.",
  );
});

test("Hard-code audit — Stage mesh does not embed P0 business values", () => {
  const stageRoot = join(here, "../../executive/nex-mvp/stage");
  const suspicious = [
    "8700",
    "9600",
    "92.94",
    "98.82",
    "production-capacity-state-rule",
    "kpi.production.capacity-utilization",
  ];
  for (const file of collectFiles(stageRoot)) {
    const source = readFileSync(file, "utf8");
    for (const token of suspicious) {
      assert.equal(source.includes(token), false, `${file} :: ${token}`);
    }
  }
  recordCheck(
    "hard-code-audit",
    true,
    "Stage mesh sources do not embed P0 business values or rule IDs.",
  );
});

test("Runtime attention mapping certification", () => {
  assert.deepEqual(
    [...NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP],
    [
      {
        executiveState: "normal",
        mvpStatus: "stable",
        mvpAttention: "normal",
      },
      {
        executiveState: "attention",
        mvpStatus: "watch",
        mvpAttention: "important",
      },
      {
        executiveState: "critical",
        mvpStatus: "risk",
        mvpAttention: "critical",
      },
    ],
  );
  recordCheck(
    "runtime-mapping",
    true,
    "normal→stable/normal; attention→watch/important; critical→risk/critical.",
  );
});

test("Manual visual evidence recorded", () => {
  assert.match(
    NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE.baseline.route,
    /dataset=baseline/,
  );
  assert.match(
    NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE.operationalPressure.route,
    /dataset=operational-pressure/,
  );
  assert.ok(
    NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE.operationalPressure.observations.some(
      (line) => line.includes("Capacity becomes critical"),
    ),
  );
  recordCheck(
    "manual-visual-evidence",
    true,
    "Browser A/B visual evidence recorded for certification.",
  );
});

test("P0:6 final certification result", () => {
  // Ensure required checks from this suite were recorded.
  const required = [
    "baseline-full-chain",
    "operational-pressure-full-chain",
    "ab-causal-difference",
    "identity-stability",
    "revenue-transition",
    "production-transition",
    "warehouse-transition",
    "shipping-transition",
    "customer-transition",
    "cost-non-fabrication",
    "non-p0-objects-preserved",
    "reason-provenance",
    "determinism",
    "immutability",
    "failure-isolation",
    "stage-business-logic-boundary",
    "no-parallel-runtime",
    "workspace-isolation",
    "interaction-coexistence",
    "query-selection",
    "hard-code-audit",
    "runtime-mapping",
    "manual-visual-evidence",
  ];
  for (const id of required) {
    assert.ok(
      certificationChecks.some((check) => check.id === id && check.ok),
      `missing/failed check: ${id}`,
    );
  }

  const result = createDataRealityCertificationResult(certificationChecks);
  assert.equal(result.identity, "P0:6/NexoraDataRealityEndToEndCertification");
  assert.equal(result.version, "1.0.0");
  assert.equal(result.readiness, "ReadyForMVP");
  assert.equal(result.status, "ReadyForMVP");
  assert.equal(result.checks.every((check) => check.ok), true);
  assert.equal(NEXORA_DATA_REALITY_P0_STATUS_LABEL, "Verified · Certified · Stable · ReadyForMVP");
  assert.equal(result.knownLimitations.length, 5);
});
