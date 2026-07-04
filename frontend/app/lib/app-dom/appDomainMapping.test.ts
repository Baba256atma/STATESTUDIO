import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import {
  AppDomainMappingLayer,
  buildAppDomainConsumerSnapshot,
  buildAppDomainMapping,
  buildAppDomainMappingManifest,
  buildDomainCapabilityMap,
  buildDomainPackageMap,
  buildDomainPlatformMap,
  buildDomainRegistryMap,
  validateAppDomainMapping,
  validateAppDomainMappingManifest,
} from "./appDomainMappingIndex.ts";

test("creates APP-DOM mapping", () => {
  const mapping = buildAppDomainMapping();

  assert.equal(mapping.mappingId, "app-dom-mapping");
  assert.equal(mapping.bridgeId, "app-dom-bridge");
  assert.equal(mapping.validation.valid, true);
  assert.equal(Object.isFrozen(mapping), true);
});

test("maps domain capabilities", () => {
  const map = buildDomainCapabilityMap();

  assert.equal(map.totalCapabilities > 0, true);
  assert.equal(map.bySourcePlatform["DOM-8"].some((entry) => entry.name === "DomainExpertisePlatformFreeze"), true);
  assert.equal(map.metadataOnly, true);
});

test("maps domain registry", () => {
  const map = buildDomainRegistryMap();

  assert.equal(map.platformCount, 7);
  assert.equal(map.phaseCount, 8);
  assert.equal(map.platformIds.includes("DOM-7"), true);
});

test("maps domain packages", () => {
  const map = buildDomainPackageMap();

  assert.equal(map.totalPackages, 7);
  assert.equal(map.packages.some((entry) => entry.packageId === "DOM-6"), true);
  assert.equal(map.packages.every((entry) => entry.metadataOnly), true);
});

test("maps domain platform", () => {
  const map = buildDomainPlatformMap();

  assert.equal(map.platformInfo.version, "DOM-8");
  assert.equal(map.compatible, true);
  assert.equal(map.runtimeBehavior, false);
});

test("builds consumer snapshot", () => {
  const snapshot = buildAppDomainConsumerSnapshot();

  assert.equal(snapshot.platformMap.compatible, true);
  assert.equal(snapshot.capabilityMap.totalCapabilities > 0, true);
  assert.equal(snapshot.packageMap.totalPackages, 7);
  assert.equal(snapshot.metadataOnly, true);
});

test("validates mapping", () => {
  const mapping = buildAppDomainMapping();
  const validation = validateAppDomainMapping(mapping);

  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds mapping manifest", () => {
  const manifest = buildAppDomainMappingManifest();

  assert.equal(manifest.phaseId, "APP-DOM-2");
  assert.equal(manifest.bridgeVersion, "APP-DOM-1");
  assert.equal(manifest.consumedDomVersion, "DOM-8");
  assert.equal(manifest.metadataOnly, true);
});

test("validates mapping manifest", () => {
  assert.equal(validateAppDomainMappingManifest(buildAppDomainMappingManifest()).valid, true);
});

test("uses deterministic mapping fingerprint", () => {
  const first = buildAppDomainMappingManifest();
  const second = buildAppDomainMappingManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public mapping APIs", () => {
  assert.equal(typeof AppDomainMappingLayer.buildDomainCapabilityMap, "function");
  assert.equal(typeof AppDomainMappingLayer.buildAppDomainMappingManifest, "function");
  assert.equal(Object.isFrozen(AppDomainMappingLayer), true);
});

test("keeps bridge compatibility", () => {
  const bridge = AppDomainBridge.createAppDomainBridge();

  assert.equal(bridge.state.status, "ready");
  assert.equal(AppDomainBridge.validateAppDomainBridge(bridge).valid, true);
});

test("keeps DOM compatibility through bridge", () => {
  assert.equal(AppDomainBridge.isDomainPlatformCompatible().compatible, true);
  assert.equal(AppDomainBridge.getDomainPlatformInfo().version, "DOM-8");
});

test("mapping consumes APP-DOM bridge only", () => {
  const source = readFileSync("app/lib/app-dom/appDomainMapping.ts", "utf8");

  assert.equal(source.includes("./appDomainBridgeIndex.ts"), true);
  assert.equal(source.includes("../dom/"), false);
});

test("does not expose runtime intelligence behavior", () => {
  const source = [
    readFileSync("app/lib/app-dom/appDomainMapping.ts", "utf8"),
    readFileSync("app/lib/app-dom/appDomainMappingManifest.ts", "utf8"),
  ].join(" ");

  assert.equal(source.includes("execute"), false);
  assert.equal(source.includes("infer"), false);
  assert.equal(source.includes("score"), false);
  assert.equal(source.includes("rank"), false);
  assert.equal(source.includes("generate"), false);
});
