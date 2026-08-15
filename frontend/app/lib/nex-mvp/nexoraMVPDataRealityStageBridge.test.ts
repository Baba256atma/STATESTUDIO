/**
 * P0:5 — NEX-MVP Data Reality Stage bridge integration tests.
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyDataRealityProjectionsToStageCatalog,
  NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY,
  parseNexoraMVPDataRealityDatasetScenario,
  resolveNexoraMVPDataRealityStageBridge,
} from "./nexoraMVPDataRealityStageBridge.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";

const here = dirname(fileURLToPath(import.meta.url));
const stageUiRoot = join(here, "../../executive/nex-mvp/stage");

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

test("bridge identity / boundary", () => {
  assert.equal(
    NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY.ownsParallelRuntime,
    false,
  );
  assert.equal(
    NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY.ownsKpiComputation,
    false,
  );
  assert.equal(
    NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY.mutatesSelectionFocus,
    false,
  );
  assert.equal(
    parseNexoraMVPDataRealityDatasetScenario("operational-pressure"),
    "operational-pressure",
  );
  assert.equal(parseNexoraMVPDataRealityDatasetScenario("baseline"), "baseline");
  assert.equal(parseNexoraMVPDataRealityDatasetScenario(undefined), "baseline");
});

test("integration — Dataset A → catalog projection", () => {
  const bridge = resolveNexoraMVPDataRealityStageBridge("baseline");
  assert.equal(bridge.projection.status, "projected");
  const byId = Object.fromEntries(
    bridge.catalog.objects.map((object) => [object.id, object]),
  );
  assert.equal(byId["obj-revenue"]!.status, "stable");
  assert.equal(byId["obj-revenue"]!.attention, "normal");
  assert.equal(byId["obj-capacity"]!.status, "watch");
  assert.equal(byId["obj-capacity"]!.attention, "important");
  assert.equal(byId["obj-inventory"]!.attention, "important");
  assert.equal(byId["obj-delivery"]!.attention, "important");
  assert.equal(byId["obj-customer"]!.attention, "important");
});

test("integration — Dataset B → catalog projection", () => {
  const bridge = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  const byId = Object.fromEntries(
    bridge.catalog.objects.map((object) => [object.id, object]),
  );
  assert.equal(byId["obj-revenue"]!.attention, "important");
  assert.equal(byId["obj-capacity"]!.status, "risk");
  assert.equal(byId["obj-capacity"]!.attention, "critical");
  assert.equal(byId["obj-inventory"]!.attention, "critical");
  assert.equal(byId["obj-delivery"]!.attention, "critical");
  assert.equal(byId["obj-customer"]!.attention, "critical");
});

test("integration — A/B Stage identities identical; states differ", () => {
  const a = resolveNexoraMVPDataRealityStageBridge("baseline");
  const b = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  assert.deepEqual(
    a.catalog.objects.map((o) => o.id).sort(),
    b.catalog.objects.map((o) => o.id).sort(),
  );
  assert.notDeepEqual(
    a.catalog.objects.map((o) => `${o.id}:${o.status}:${o.attention}`).sort(),
    b.catalog.objects.map((o) => `${o.id}:${o.status}:${o.attention}`).sort(),
  );
});

test("integration — Stage scene presentation differs A/B for Production", () => {
  const interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const a = deriveNexoraMVPStageInteractionPresentation(
    interaction,
    resolveNexoraMVPDataRealityStageBridge("baseline").catalog,
  );
  const b = deriveNexoraMVPStageInteractionPresentation(
    interaction,
    resolveNexoraMVPDataRealityStageBridge("operational-pressure").catalog,
  );
  const capacityA = a.scene.objects.find((o) => o.id === "obj-capacity")!;
  const capacityB = b.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.equal(capacityA.attention, "important");
  assert.equal(capacityB.attention, "critical");
  assert.ok(capacityB.scale > capacityA.scale);
  assert.ok(capacityB.emissiveIntensity >= capacityA.emissiveIntensity);
});

test("integration — selection/focus remain independent of Data Reality", () => {
  const bridge = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", bridge.catalog);
  assert.equal(state.selectedSubject?.id, "obj-capacity");
  assert.equal(state.focusedSubject?.id, "obj-capacity");

  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    bridge.catalog,
  );
  const capacity = presentation.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.equal(capacity.attention, "critical");
  assert.equal(capacity.selected, true);
  assert.equal(capacity.focused, true);
});

test("integration — apply projections does not invent Cost object", () => {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  const bridge = resolveNexoraMVPDataRealityStageBridge("baseline", base);
  assert.equal(
    bridge.catalog.objects.some((object) => object.id === "obj-cost"),
    false,
  );
  assert.equal(bridge.catalog.objects.length, base.objects.length);
});

test("integration — catalog apply is immutable relative to base fixtures", () => {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  const baseJson = JSON.stringify(base);
  const bridge = resolveNexoraMVPDataRealityStageBridge(
    "operational-pressure",
    base,
  );
  assert.notEqual(bridge.catalog, base);
  assert.equal(JSON.stringify(base), baseJson);
  assert.equal(
    applyDataRealityProjectionsToStageCatalog(base, bridge.projection.projections)
      .objects.find((o) => o.id === "obj-capacity")!.attention,
    "critical",
  );
});

test("integration — low-level Stage UI does not import Data Reality", () => {
  for (const file of collectFiles(stageUiRoot)) {
    const source = readFileSync(file, "utf8");
    assert.equal(source.includes("data-reality"), false, file);
    assert.equal(source.includes("executiveOperationsDemoDataset"), false, file);
    assert.equal(source.includes("computeNexoraKPI"), false, file);
    assert.equal(source.includes("resolveKPIExecutiveState"), false, file);
  }
});

test("integration — reason preserved through bridge snapshot", () => {
  const bridge = resolveNexoraMVPDataRealityStageBridge("operational-pressure");
  const production = bridge.projection.projections.find(
    (entry) => entry.stageObjectId === "obj-capacity",
  )!;
  assert.equal(production.reasons[0]!.ruleId, "production-capacity-state-rule");
  assert.equal(production.reasons[0]!.value, 96);
});
