import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveExecutionMonitoringPlatformPublicFoundation, ExecutiveExecutionMonitoringPublicApiRegistry, ExecutiveExecutionMonitoringPublicIndexId, ExecutiveExecutionMonitoringPublicIndexNamespace, ExecutiveExecutionMonitoringPublicIndexStatus, ExecutiveExecutionMonitoringPublicIndexVersion, getExecutiveExecutionMonitoringPublicApiRegistry, getExecutiveExecutionMonitoringPublicFoundation, getExecutiveExecutionMonitoringPublicMetadata, getExecutiveExecutionMonitoringReleaseSummary } from "./executiveExecutionMonitoringPublicIndex.ts";

const sections = ["foundation", "registry", "model", "validation", "manifest", "platform", "certification", "freeze", "publicIndex"] as const;

test("public namespace contains exactly nine approved sections", () => {
  assert.deepEqual(Object.keys(ExecutiveExecutionMonitoringPlatformPublicFoundation).sort(), [...sections].sort());
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformPublicFoundation), true);
  assert.equal(sections.every((section) => Object.isFrozen(ExecutiveExecutionMonitoringPlatformPublicFoundation[section as keyof typeof ExecutiveExecutionMonitoringPlatformPublicFoundation])), true);
});

test("public metadata identifies the certified frozen release", () => {
  const metadata = getExecutiveExecutionMonitoringPublicMetadata();
  assert.equal(ExecutiveExecutionMonitoringPublicIndexId, "OPS-9:9");
  assert.equal(ExecutiveExecutionMonitoringPublicIndexNamespace, "nexora.ops.executive-execution-monitoring.public-index");
  assert.equal(ExecutiveExecutionMonitoringPublicIndexVersion, "1.0.0");
  assert.equal(metadata.platformId, "OPS-9:1");
  assert.deepEqual(ExecutiveExecutionMonitoringPublicIndexStatus, { certificationStatus: "Certified", freezeStatus: "Frozen", releaseStatus: "Released", metadataOnly: true, publicApiStable: true, immutable: true });
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
});

test("public API registry inventories all approved exports", () => {
  const registry = getExecutiveExecutionMonitoringPublicApiRegistry();
  assert.equal(registry.totalExportCount, 75);
  assert.equal(Object.isFrozen(registry), true);
  const entries = sections.flatMap((section) => registry[section]);
  assert.equal(entries.length, registry.totalExportCount);
  assert.equal(entries.every((entry) => entry.status === "Approved" && entry.publicStability === "Stable" && entry.metadataOnly), true);
});

test("registry entries have correct phase ownership", () => {
  sections.forEach((section, index) => {
    const entries = ExecutiveExecutionMonitoringPublicApiRegistry[section];
    assert.equal(entries.every((entry) => entry.sourcePhase === `OPS-9:${index + 1}` && entry.category === section), true);
  });
});

test("helpers return canonical frozen deterministic objects", () => {
  assert.equal(getExecutiveExecutionMonitoringPublicFoundation(), ExecutiveExecutionMonitoringPlatformPublicFoundation);
  assert.equal(getExecutiveExecutionMonitoringPublicApiRegistry(), ExecutiveExecutionMonitoringPublicApiRegistry);
  assert.equal(Object.isFrozen(getExecutiveExecutionMonitoringReleaseSummary()), true);
  assert.deepEqual(getExecutiveExecutionMonitoringPublicFoundation(), getExecutiveExecutionMonitoringPublicFoundation());
  assert.deepEqual(getExecutiveExecutionMonitoringPublicMetadata(), getExecutiveExecutionMonitoringPublicMetadata());
  assert.deepEqual(getExecutiveExecutionMonitoringReleaseSummary(), getExecutiveExecutionMonitoringReleaseSummary());
});

test("release summary represents certification, freeze, compatibility, and readiness", () => {
  const summary = getExecutiveExecutionMonitoringReleaseSummary();
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
  assert.equal(summary.compatibilitySummary, "Complete");
  assert.equal(summary.publicApiStatus, "Stable");
});

test("public index has no internal export leakage", async () => {
  const publicApi = await import("./executiveExecutionMonitoringPublicIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveExecutionMonitoringPlatformPublicFoundation", "ExecutiveExecutionMonitoringPublicApiRegistry",
    "ExecutiveExecutionMonitoringPublicIndexId", "ExecutiveExecutionMonitoringPublicIndexName",
    "ExecutiveExecutionMonitoringPublicIndexDescription", "ExecutiveExecutionMonitoringPublicIndexNamespace",
    "ExecutiveExecutionMonitoringPublicIndexVersion", "ExecutiveExecutionMonitoringPublicIndexStatus",
    "getExecutiveExecutionMonitoringPublicFoundation", "getExecutiveExecutionMonitoringPublicMetadata",
    "getExecutiveExecutionMonitoringPublicApiRegistry", "getExecutiveExecutionMonitoringReleaseSummary",
  ].sort());
  const entries = sections.flatMap((section) => ExecutiveExecutionMonitoringPublicApiRegistry[section]);
  assert.equal(entries.some((entry) => /internal|\.ts$/i.test(entry.exportName)), false);
});

test("preserves legacy monitoring phase APIs inside the canonical namespace", () => {
  assert.ok("ExecutiveExecutionMonitoringFoundation" in ExecutiveExecutionMonitoringPlatformPublicFoundation.foundation);
  assert.ok("ExecutiveExecutionMonitoringRegistry" in ExecutiveExecutionMonitoringPlatformPublicFoundation.registry);
  assert.ok("ExecutiveExecutionMonitoringModel" in ExecutiveExecutionMonitoringPlatformPublicFoundation.model);
});
