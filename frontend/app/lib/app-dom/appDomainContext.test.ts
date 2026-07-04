import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import {
  AppDomainContextLayer,
  buildAppDomainContextManifest,
  clearDomainSelection,
  createDomainContext,
  getActiveDomainContext,
  listSelectedDomains,
  selectDomainContext,
  selectDomains,
  validateAppDomainContextManifest,
  validateDomainContext,
  type AppDomainSelectionCriteria,
} from "./appDomainContextIndex.ts";

function criteria(
  requestedDomainIds: readonly string[],
  scope: AppDomainSelectionCriteria["scope"] = "workspace",
  mode: AppDomainSelectionCriteria["mode"] = "multiple"
): AppDomainSelectionCriteria {
  return Object.freeze({
    scope,
    mode,
    requestedDomainIds: Object.freeze([...requestedDomainIds]),
    consumerId: "context-test-consumer",
    contextLabel: "Context Test",
  });
}

test("creates domain context", () => {
  const context = createDomainContext(criteria(["DOM-1"]));

  assert.equal(context.contextId, "app-domain-context.workspace.multiple.DOM-1");
  assert.equal(context.validation.valid, true);
  assert.equal(Object.isFrozen(context), true);
});

test("selects single domain", () => {
  const context = selectDomainContext("DOM-2");

  assert.deepEqual(listSelectedDomains(context), ["DOM-2"]);
  assert.equal(context.selection.criteria.mode, "single");
});

test("selects multiple domains", () => {
  const selection = selectDomains(criteria(["DOM-1", "DOM-3", "DOM-7"]));

  assert.deepEqual(selection.selectedDomainIds, ["DOM-1", "DOM-3", "DOM-7"]);
  assert.equal(selection.rejectedDomainIds.length, 0);
});

test("creates workspace context", () => {
  const context = createDomainContext(criteria(["DOM-1"], "workspace"));

  assert.equal(context.snapshot.scope, "workspace");
});

test("creates scenario context", () => {
  const context = createDomainContext(criteria(["DOM-4"], "scenario"));

  assert.equal(context.snapshot.scope, "scenario");
});

test("creates executive session context", () => {
  const context = createDomainContext(criteria(["DOM-6"], "executive-session"));

  assert.equal(context.snapshot.scope, "executive-session");
});

test("clears domain selection", () => {
  const context = clearDomainSelection("simulation");

  assert.equal(context.snapshot.scope, "simulation");
  assert.deepEqual(context.selection.selectedDomainIds, []);
});

test("returns active domain context", () => {
  const context = createDomainContext(criteria(["DOM-5"]));

  assert.equal(getActiveDomainContext(context).contextId, context.contextId);
});

test("builds context snapshot", () => {
  const context = createDomainContext(criteria(["DOM-2", "DOM-3"], "future-app-engine"));

  assert.equal(context.snapshot.mappedPlatformVersion, "DOM-8");
  assert.equal(context.snapshot.mappedPackageCount, 7);
  assert.deepEqual(context.snapshot.selectedDomainIds, ["DOM-2", "DOM-3"]);
});

test("builds context manifest", () => {
  const manifest = buildAppDomainContextManifest(criteria(["DOM-7"], "scenario", "single"));

  assert.equal(manifest.selectionMode, "single");
  assert.equal(manifest.selectionScope, "scenario");
  assert.equal(manifest.mappedPlatform, "DOM-8");
});

test("validates context manifest", () => {
  assert.equal(validateAppDomainContextManifest(buildAppDomainContextManifest()).valid, true);
});

test("uses deterministic context fingerprint", () => {
  const first = buildAppDomainContextManifest(criteria(["DOM-1", "DOM-2"]));
  const second = buildAppDomainContextManifest(criteria(["DOM-1", "DOM-2"]));

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public context APIs", () => {
  assert.equal(typeof AppDomainContextLayer.createDomainContext, "function");
  assert.equal(typeof AppDomainContextLayer.buildAppDomainContextManifest, "function");
  assert.equal(Object.isFrozen(AppDomainContextLayer), true);
});

test("keeps APP-DOM-2 compatibility", () => {
  assert.equal(AppDomainMappingLayer.buildAppDomainMapping().validation.valid, true);
});

test("keeps APP-DOM-1 compatibility", () => {
  assert.equal(AppDomainBridge.createAppDomainBridge().state.status, "ready");
});

test("keeps DOM compatibility through bridge and mapping", () => {
  assert.equal(AppDomainBridge.isDomainPlatformCompatible().compatible, true);
  assert.equal(AppDomainMappingLayer.buildDomainPlatformMap().platformInfo.version, "DOM-8");
});

test("rejects unavailable domains without automatic selection", () => {
  const context = createDomainContext(criteria(["DOM-1", "DOM-404"]));

  assert.deepEqual(context.selection.selectedDomainIds, ["DOM-1"]);
  assert.deepEqual(context.selection.rejectedDomainIds, ["DOM-404"]);
  assert.equal(validateDomainContext(context).valid, true);
});

test("context selection consumes mapping layer only", () => {
  const source = readFileSync("app/lib/app-dom/appDomainContextSelection.ts", "utf8");

  assert.equal(source.includes("./appDomainMappingIndex.ts"), true);
  assert.equal(source.includes("../dom/"), false);
  assert.equal(source.includes("./appDomainBridgeIndex.ts"), false);
});

test("does not expose runtime intelligence behavior", () => {
  const source = [
    readFileSync("app/lib/app-dom/appDomainContextSelection.ts", "utf8"),
    readFileSync("app/lib/app-dom/appDomainContextManifest.ts", "utf8"),
  ].join(" ");

  assert.equal(source.includes("execute"), false);
  assert.equal(source.includes("infer"), false);
  assert.equal(source.includes("score"), false);
  assert.equal(source.includes("rank"), false);
  assert.equal(source.includes("heuristic"), false);
});
