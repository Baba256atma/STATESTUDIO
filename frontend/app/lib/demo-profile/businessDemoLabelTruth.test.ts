import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createMemoryCsvDurabilityStorage } from "../data-reality/csvRealDataImportDurability.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import type { NexoraDatasetRecord } from "../data-reality/dataRealityContracts.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveExecutiveStageOwnedLabelPlacement } from "../spatial-presentation/executiveStageObjectLabelTerritory.ts";
import { BUSINESS_DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import { openBusinessDemo, resetBusinessDemoActivationForTests } from "./businessDemoActivation.ts";
import {
  BUSINESS_DEMO_STAGE_OBJECTS,
  readBusinessDemoOwnedLabelValue,
  resolveBusinessDemoStageLabelValue,
  resolveBusinessDemoStageMaterials,
} from "./businessDemoStageCatalog.ts";
import { resolveActiveDemoProfileStageMaterials } from "./demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";

const here = dirname(fileURLToPath(import.meta.url));

function installStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage, sessionStorage: storage, dispatchEvent() { return true; } },
  });
}

function record(objectKey: string, metricKey: string, value: number, unit?: string): NexoraDatasetRecord {
  return Object.freeze({
    objectKey,
    metricKey,
    value,
    ...(unit != null ? { unit } : {}),
  });
}

function placed(xs: readonly number[]) {
  return resolveExecutiveStageOwnedLabelPlacement({
    presentationLevel: "minimum",
    objects: BUSINESS_DEMO_STAGE_OBJECTS.map((entry, index) =>
      Object.freeze({
        id: entry.id,
        label: entry.label,
        kind: "object",
        status: "stable",
        x: xs[index] ?? 0,
        y: 0,
        halfExtent: 0.42,
        valueText: entry.objectKey === "revenue"
          ? "546,400 USD"
          : entry.objectKey === "inventory"
            ? "140 units"
            : "324,800 USD",
      }),
    ),
  });
}

function overlaps(
  left: { readonly minX: number; readonly maxX: number; readonly minY: number; readonly maxY: number },
  right: { readonly minX: number; readonly maxX: number; readonly minY: number; readonly maxY: number },
): boolean {
  return left.minX < right.maxX && left.maxX > right.minX && left.minY < right.maxY && left.maxY > right.minY;
}

beforeEach(() => {
  installStorage();
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

test("Revenue, Inventory, and Operating Cost labels use committed aggregates and units", async () => {
  await openBusinessDemo({ storage: createMemoryCsvDurabilityStorage() });
  const materials = resolveBusinessDemoStageMaterials();
  assert.ok(materials);
  const byId = new Map(materials.catalog.objects.map((object) => [object.id, object]));
  assert.equal(
    byId.get(`business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:revenue`)?.primaryValue,
    "546,400 USD",
  );
  assert.equal(
    byId.get(`business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:inventory`)?.primaryValue,
    "140 units",
  );
  assert.equal(
    byId.get(`business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:cost`)?.primaryValue,
    "324,800 USD",
  );
  for (const object of materials.catalog.objects) {
    assert.equal(object.status, "stable");
    assert.equal(object.attention, "normal");
    assert.equal(object.primaryValue?.includes("Healthy"), false);
    assert.equal(object.primaryValue?.includes("$"), false);
  }
  const previous = materials.dataset.records.find((entry) => entry.metricKey === "previousRevenue");
  assert.equal(previous?.value, 527600);
  assert.equal(
    materials.catalog.objects.some((object) => object.primaryValue?.includes("527,600")),
    false,
  );
});

test("a missing value or unit is omitted instead of invented", () => {
  assert.equal(resolveBusinessDemoStageLabelValue([], "revenue"), null);
  assert.equal(
    resolveBusinessDemoStageLabelValue([record("revenue", "previousRevenue", 527600, "USD")], "revenue"),
    null,
  );
  assert.equal(
    resolveBusinessDemoStageLabelValue([record("revenue", "currentRevenue", 546400)], "revenue"),
    "546,400",
  );
  assert.equal(
    resolveBusinessDemoStageLabelValue(
      [
        record("inventory", "onHand", 140, "units"),
        record("inventory", "onHand", 210, "units"),
      ],
      "inventory",
    ),
    null,
  );
});

test("each caption stays owned by its Business Demo object and does not overlap", () => {
  for (const spread of [
    [-1.571138, 1.036782, -0.267178],
    [-1.15, 0, 1.15],
  ]) {
    const layout = placed(spread);
    assert.equal(layout.visibleCount, 3);
    assert.equal(layout.labelLabelOverlapCount, 0);
    assert.equal(layout.clippedCount, 0);
    assert.equal(layout.bodyOverlapCount, 0);
    const ids = layout.ownerships.map((entry) => entry.ownerObjectId);
    assert.deepEqual(ids.slice().sort(), BUSINESS_DEMO_STAGE_OBJECTS.map((entry) => entry.id).slice().sort());
    for (const ownership of layout.ownerships) {
      assert.equal(ownership.ownerObjectId.startsWith(`business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:`), true);
      assert.equal(ownership.secondaryLine, "STABLE");
      assert.ok(ownership.valueLine);
    }
    const bounds = layout.ownerships.map((entry) => entry.bounds);
    for (let left = 0; left < bounds.length; left += 1) {
      for (let right = left + 1; right < bounds.length; right += 1) {
        assert.equal(overlaps(bounds[left]!, bounds[right]!), false);
      }
    }
  }
});

test("value captions stay off their own bodies and inside the stage frame", () => {
  const xs = [-1.571138, 1.036782, -0.267178];
  const layout = placed(xs);
  assert.equal(layout.visibleCount, 3);
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
  assert.equal(layout.labelLabelOverlapCount, 0);
  for (const ownership of layout.ownerships) {
    const index = BUSINESS_DEMO_STAGE_OBJECTS.findIndex((entry) => entry.id === ownership.ownerObjectId);
    const x = xs[index] ?? 0;
    const body = { minX: x - 0.42, maxX: x + 0.42, minY: -0.42, maxY: 0.42 };
    assert.equal(overlaps(ownership.bounds, body), false);
    assert.equal(ownership.valueLine?.includes("USD") || ownership.valueLine?.includes("units"), true);
  }
  const renderer = readFileSync(join(here, "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx"), "utf8");
  assert.equal(renderer.includes("-100%"), false);
});

test("workspace switching does not keep Business Demo label values", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  openManufacturingDemo();
  const manufacturing = resolveActiveDemoProfileStageMaterials();
  assert.ok(manufacturing);
  assert.equal(manufacturing.catalog.objects.some((object) => object.primaryValue?.includes("546,400")), false);

  await openBusinessDemo({ storage });
  const business = resolveBusinessDemoStageMaterials();
  assert.equal(business?.catalog.objects.find((object) => object.label === "Revenue")?.primaryValue, "546,400 USD");

  openProjectDemo();
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  const project = resolveActiveDemoProfileStageMaterials();
  assert.ok(project);
  assert.equal(project.catalog.objects.some((object) => object.primaryValue?.includes("546,400")), false);
  assert.equal(
    readBusinessDemoOwnedLabelValue(project.catalog.objects[0]!.id, "546,400 USD"),
    null,
  );

  await openBusinessDemo({ storage });
  assert.equal(
    resolveBusinessDemoStageMaterials()?.catalog.objects.find((object) => object.label === "Inventory")?.primaryValue,
    "140 units",
  );
});

test("Manufacturing captions do not receive a Business Demo value line", () => {
  openManufacturingDemo();
  const manufacturing = resolveActiveDemoProfileStageMaterials();
  assert.ok(manufacturing);
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const presented = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    deriveNexoraMVPStageInteractionPresentation(state, manufacturing.catalog, {
      consultExecutiveChangeSessionStore: false,
    }),
  );
  assert.ok(presented.scene.objects.length > 0);
  for (const object of presented.scene.objects) {
    assert.equal(object.labelValueLine ?? null, null);
    assert.equal(object.label?.includes("546,400"), false);
  }
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(readBusinessDemoOwnedLabelValue("obj-risk", "12 USD"), null);
});

test("label wiring adds no color system", () => {
  const catalog = readFileSync(join(here, "businessDemoStageCatalog.ts"), "utf8");
  const renderer = readFileSync(join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"), "utf8");
  assert.equal(catalog.includes("labelValueLine"), false);
  assert.equal(catalog.includes("#"), false);
  assert.match(renderer, /labelValueLine\?\.trim\(\)/);
  assert.equal(renderer.includes("labelValueColor"), false);
});
