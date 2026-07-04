import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  buildDomainFoundationManifest,
  createDomainRegistry,
  freezeDomainRegistry,
  registerDomain,
  validateDomainFoundation,
} from "./domainFoundationIndex.ts";
import type { DomainCategory, DomainPackage, DomainRegistry } from "./domainFoundationIndex.ts";
import { buildDomainRegistrySnapshot, queryDomains, validateDomainRegistrySnapshot } from "./domainRegistryQueryIndex.ts";
import { buildDomainRegistryStats, buildCompleteDomainRegistryIndex } from "./domainRegistryStatsIndex.ts";
import {
  DomainRegistryCertificationLayer,
  buildDomainRegistryExportBundle,
  compareDomainRegistryExportBundles,
  runDomainRegistryCertification,
  runDomainRegistryRegression,
  validateDomainRegistryExportBundle,
} from "./domainRegistryCertificationIndex.ts";

function domainPackage(
  domainId: string,
  name: string,
  category: DomainCategory,
  overrides: Partial<DomainPackage["manifest"]> = {}
): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name,
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: `${name} Domain`,
        description: `${name} domain package registration metadata.`,
        category,
        tags: Object.freeze([category]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "package-registration",
          name: "Package Registration",
          description: "Registers the domain package in the foundation registry.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
      ...overrides,
    }),
  });
}

function buildSampleRegistry(): DomainRegistry {
  let registry = createDomainRegistry();
  registry = registerDomain(registry, domainPackage("domain.manufacturing", "Manufacturing", "manufacturing")).registry;
  registry = registerDomain(
    registry,
    domainPackage("domain.healthcare", "Healthcare", "healthcare", { status: "active" })
  ).registry;
  registry = registerDomain(
    registry,
    domainPackage("domain.logistics", "Logistics", "logistics", {
      dependencies: Object.freeze([
        Object.freeze({
          domainId: "domain.manufacturing",
          minVersion: Object.freeze({ major: 1, minor: 0, patch: 0 }),
          optional: false,
        }),
      ]),
    })
  ).registry;
  return registry;
}

test("generates export bundle", () => {
  const bundle = buildDomainRegistryExportBundle(buildSampleRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-1:4");
  assert.equal(bundle.metadata.domainCount, 3);
  assert.equal(bundle.foundationManifest.platform.version, "DOM-1");
  assert.equal(bundle.registrySnapshot.entries.length, 3);
  assert.equal(bundle.registryStats.totalDomains, 3);
  assert.equal(bundle.registryIndex.dependencyIndex.entries.length, 3);
  assert.equal(Object.isFrozen(bundle), true);
});

test("validates export bundle", () => {
  const bundle = buildDomainRegistryExportBundle(buildSampleRegistry());
  const validation = validateDomainRegistryExportBundle(bundle);

  assert.equal(validation.valid, true);
  assert.equal(bundle.exportValid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares export bundles", () => {
  const registry = buildSampleRegistry();
  const left = buildDomainRegistryExportBundle(registry);
  const right = buildDomainRegistryExportBundle(registry);
  const comparison = compareDomainRegistryExportBundles(left, right);

  assert.equal(comparison.equal, true);
  assert.equal(comparison.fingerprintEqual, true);
});

test("produces deterministic fingerprint", () => {
  const registry = buildSampleRegistry();
  const first = buildDomainRegistryExportBundle(registry);
  const second = buildDomainRegistryExportBundle(registry);

  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.fingerprint.length > 0, true);
});

test("passes domain registry certification", () => {
  const certification = runDomainRegistryCertification(buildSampleRegistry());

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
  assert.equal(certification.exportBundle.exportValid, true);
});

test("publishes certification gate details", () => {
  const certification = runDomainRegistryCertification(buildSampleRegistry());

  assert.equal(certification.gates.some((gate) => gate.gateId === "export-bundle-valid"), true);
  assert.equal(certification.gates.some((gate) => gate.gateId === "deterministic-reproducibility"), true);
  assert.equal(certification.gates.some((gate) => gate.gateId === "public-apis-available"), true);
});

test("certifies frozen registry behavior", () => {
  const frozen = freezeDomainRegistry(buildSampleRegistry());
  const certification = runDomainRegistryCertification(frozen);

  assert.equal(certification.status, "PASS");
  assert.equal(certification.exportBundle.metadata.frozen, true);
  assert.equal(certification.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns regression result metadata", () => {
  const regression = runDomainRegistryRegression();

  assert.equal(regression.totalTests, 64);
  assert.equal(regression.passed, 64);
  assert.equal(regression.failed, 0);
  assert.equal(regression.deterministic, true);
  assert.equal(regression.entries.length, 4);
});

test("exports public certification layer APIs", () => {
  assert.equal(typeof DomainRegistryCertificationLayer.buildDomainRegistryExportBundle, "function");
  assert.equal(typeof DomainRegistryCertificationLayer.runDomainRegistryCertification, "function");
  assert.equal(typeof DomainRegistryCertificationLayer.runDomainRegistryRegression, "function");
  assert.equal(Object.isFrozen(DomainRegistryCertificationLayer), true);
});

test("keeps DOM-1:1 foundation regression compatible", () => {
  const validation = validateDomainFoundation();
  const manifest = buildDomainFoundationManifest();
  const registry = createDomainRegistry();

  assert.equal(validation.valid, true);
  assert.equal(manifest.platform.version, "DOM-1");
  assert.equal(registry.domains.length, 0);
});

test("keeps DOM-1:2 query regression compatible", () => {
  const registry = buildSampleRegistry();
  const query = queryDomains(registry, Object.freeze({ sortKey: "name", sortDirection: "asc" }));
  const snapshot = buildDomainRegistrySnapshot(registry);

  assert.equal(query.total, 3);
  assert.equal(validateDomainRegistrySnapshot(snapshot).valid, true);
});

test("keeps DOM-1:3 stats regression compatible", () => {
  const registry = buildSampleRegistry();
  const stats = buildDomainRegistryStats(registry);
  const index = buildCompleteDomainRegistryIndex(registry);

  assert.equal(stats.totalDomains, 3);
  assert.equal(index.dependencyIndex.entries.length, 3);
  assert.equal(stats.deterministic, true);
});

test("handles empty registry export", () => {
  const bundle = buildDomainRegistryExportBundle(createDomainRegistry());

  assert.equal(bundle.metadata.domainCount, 0);
  assert.equal(validateDomainRegistryExportBundle(bundle).valid, true);
  assert.equal(runDomainRegistryCertification(createDomainRegistry()).status, "PASS");
});

test("detects export bundle differences", () => {
  const left = buildDomainRegistryExportBundle(buildSampleRegistry());
  const right = buildDomainRegistryExportBundle(
    registerDomain(buildSampleRegistry(), domainPackage("domain.retail", "Retail", "retail")).registry
  );
  const comparison = compareDomainRegistryExportBundles(left, right);

  assert.equal(comparison.equal, false);
  assert.equal(comparison.fingerprintEqual, false);
});
