import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  APP_DOMAIN_BRIDGE_IDENTITY,
  APP_DOMAIN_CONSUMED_PLATFORM,
  AppDomainBridge,
  buildAppDomainBridgeManifest,
  createAppDomainBridge,
  getAvailableDomains,
  getDomainPlatformCapabilities,
  getDomainPlatformInfo,
  getDomainPlatformRegistry,
  isDomainPlatformCompatible,
  validateAppDomainBridge,
} from "./appDomainBridgeIndex.ts";

test("creates APP-DOM bridge", () => {
  const bridge = createAppDomainBridge();

  assert.equal(bridge.bridgeId, "app-dom-bridge");
  assert.equal(bridge.state.status, "ready");
  assert.equal(bridge.state.metadataOnly, true);
  assert.equal(Object.isFrozen(bridge), true);
});

test("discovers DOM platform", () => {
  const info = getDomainPlatformInfo();

  assert.equal(info.platformId, APP_DOMAIN_CONSUMED_PLATFORM.expectedPlatformId);
  assert.equal(info.version, "DOM-8");
  assert.equal(info.layerId, "DOM");
  assert.equal(info.runtimeBehavior, false);
});

test("validates DOM compatibility", () => {
  const compatibility = isDomainPlatformCompatible();

  assert.equal(compatibility.compatible, true);
  assert.equal(compatibility.actualVersion, compatibility.expectedVersion);
  assert.equal(compatibility.diagnostics.length, 0);
});

test("discovers DOM platform capabilities", () => {
  const capabilities = getDomainPlatformCapabilities();

  assert.equal(capabilities.length > 0, true);
  assert.equal(capabilities.some((capability) => capability.name === "DomainExpertisePlatformFreeze"), true);
  assert.equal(capabilities.every((capability) => capability.metadataOnly), true);
});

test("discovers DOM registry snapshot", () => {
  const registry = getDomainPlatformRegistry();

  assert.equal(registry.platformCount, 7);
  assert.equal(registry.phaseCount, 8);
  assert.equal(registry.platforms.some((entry) => entry.platformId === "DOM-7"), true);
});

test("lists available domain platforms", () => {
  const domains = getAvailableDomains();

  assert.deepEqual(domains, ["DOM-1", "DOM-2", "DOM-3", "DOM-4", "DOM-5", "DOM-6", "DOM-7"]);
});

test("validates bridge state", () => {
  const bridge = createAppDomainBridge();
  const validation = validateAppDomainBridge(bridge);

  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds APP-DOM bridge manifest", () => {
  const manifest = buildAppDomainBridgeManifest();

  assert.equal(manifest.bridgeId, APP_DOMAIN_BRIDGE_IDENTITY.bridgeId);
  assert.equal(manifest.consumedPlatform.version, "DOM-8");
  assert.equal(manifest.compatibility.compatible, true);
  assert.equal(manifest.metadataOnly, true);
});

test("uses deterministic bridge fingerprint", () => {
  const first = buildAppDomainBridgeManifest();
  const second = buildAppDomainBridgeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public bridge APIs", () => {
  assert.equal(typeof AppDomainBridge.createAppDomainBridge, "function");
  assert.equal(typeof AppDomainBridge.getDomainPlatformInfo, "function");
  assert.equal(typeof AppDomainBridge.buildAppDomainBridgeManifest, "function");
  assert.equal(Object.isFrozen(AppDomainBridge), true);
});

test("consumes DOM only through DomainExpertisePlatformFreeze facade", () => {
  const bridgeSource = readFileSync("app/lib/app-dom/appDomainBridge.ts", "utf8");

  assert.equal(bridgeSource.includes("../dom/domainExpertisePlatformFreezeIndex.ts"), true);
  assert.equal(bridgeSource.includes("../dom/domainFoundation"), false);
  assert.equal(bridgeSource.includes("../dom/domainVocabulary"), false);
  assert.equal(bridgeSource.includes("../dom/domainOntology"), false);
  assert.equal(bridgeSource.includes("../dom/domainKpi"), false);
  assert.equal(bridgeSource.includes("../dom/domainRegulation"), false);
  assert.equal(bridgeSource.includes("../dom/domainReasoning"), false);
  assert.equal(bridgeSource.includes("../dom/domainRecommendation"), false);
});

test("does not expose reasoning recommendation or runtime behavior", () => {
  const manifest = buildAppDomainBridgeManifest();
  const names = manifest.capabilities.map((capability) => capability.name).join(" ");

  assert.equal(names.includes("execute"), false);
  assert.equal(names.includes("infer"), false);
  assert.equal(names.includes("score"), false);
  assert.equal(names.includes("rank"), false);
  assert.equal(names.includes("generate"), false);
});
