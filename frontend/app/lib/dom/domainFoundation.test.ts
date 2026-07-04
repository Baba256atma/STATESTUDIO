import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  DomainFoundation,
  MAX_DOMAIN_ID_LENGTH,
  SUPPORTED_DOMAIN_CATEGORIES,
  buildDomainFoundationManifest,
  createDomainRegistry,
  freezeDomainRegistry,
  getDomain,
  hasDomain,
  listDomains,
  registerDomain,
  unregisterDomain,
  validateDomainFoundation,
  validateDomainPackage,
  validateDomainRegistry,
} from "./domainFoundationIndex.ts";
import type { DomainPackage } from "./domainFoundationIndex.ts";

function domainPackage(overrides: Partial<DomainPackage["manifest"]> = {}): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.manufacturing",
      name: "Manufacturing",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Manufacturing Domain",
        description: "Manufacturing domain package registration metadata.",
        category: "manufacturing",
        tags: Object.freeze(["manufacturing", "operations"]),
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

test("creates an empty deterministic registry", () => {
  const registry = createDomainRegistry();

  assert.equal(registry.contractVersion, "DOM-1");
  assert.equal(registry.frozen, false);
  assert.equal(registry.domains.length, 0);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.indexes.byId), true);
});

test("registers a domain package", () => {
  const registry = createDomainRegistry();
  const result = registerDomain(registry, domainPackage());

  assert.equal(result.success, true);
  assert.equal(result.registry.domains.length, 1);
  assert.equal(result.domain?.package.manifest.domainId, "domain.manufacturing");
  assert.equal(result.domain?.registrationOrder, 0);
  assert.equal(hasDomain(result.registry, "domain.manufacturing"), true);
});

test("rejects duplicate domain ids", () => {
  const first = registerDomain(createDomainRegistry(), domainPackage());
  const duplicate = registerDomain(first.registry, domainPackage({ domainId: "domain.manufacturing", name: "Manufacturing Copy" }));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.registry.domains.length, 1);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_id"), true);
});

test("rejects duplicate domain names", () => {
  const first = registerDomain(createDomainRegistry(), domainPackage());
  const duplicate = registerDomain(first.registry, domainPackage({ domainId: "domain.manufacturing.copy", name: "Manufacturing" }));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_name"), true);
});

test("looks up registered domains", () => {
  const registered = registerDomain(createDomainRegistry(), domainPackage());
  const found = getDomain(registered.registry, "domain.manufacturing");
  const listed = listDomains(registered.registry);

  assert.ok(found);
  assert.equal(found.package.manifest.name, "Manufacturing");
  assert.equal(listed.length, 1);
  assert.equal(listed[0].package.manifest.domainId, "domain.manufacturing");
});

test("unregisters a domain", () => {
  const registered = registerDomain(createDomainRegistry(), domainPackage());
  const removed = unregisterDomain(registered.registry, "domain.manufacturing");

  assert.equal(removed.success, true);
  assert.equal(removed.registry.domains.length, 0);
  assert.equal(hasDomain(removed.registry, "domain.manufacturing"), false);
});

test("freezes the registry and blocks mutations", () => {
  const registered = registerDomain(createDomainRegistry(), domainPackage());
  const frozen = freezeDomainRegistry(registered.registry);
  const blocked = registerDomain(
    frozen,
    domainPackage({ domainId: "domain.healthcare", name: "Healthcare", metadata: Object.freeze({
      displayName: "Healthcare Domain",
      description: "Healthcare domain package registration metadata.",
      category: "healthcare",
      tags: Object.freeze(["healthcare"]),
    }) })
  );

  assert.equal(frozen.frozen, true);
  assert.equal(blocked.success, false);
  assert.equal(blocked.validation.issues.some((entry) => entry.code === "registry_frozen"), true);
});

test("builds immutable foundation manifest", () => {
  const manifest = buildDomainFoundationManifest();

  assert.equal(manifest.platform.platformId, "nexora-domain-expertise-platform");
  assert.equal(manifest.platform.version, "DOM-1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(manifest.readyFor, "DOM-2 Domain Registry Platform");
  assert.equal(manifest.maxDomainIdLength, MAX_DOMAIN_ID_LENGTH);
  assert.deepEqual(manifest.supportedCategories, SUPPORTED_DOMAIN_CATEGORIES);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates foundation integrity", () => {
  const validation = validateDomainFoundation();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("validates dependency integrity", () => {
  const base = registerDomain(createDomainRegistry(), domainPackage());
  const dependent = registerDomain(
    base.registry,
    domainPackage({
      domainId: "domain.logistics",
      name: "Logistics",
      metadata: Object.freeze({
        displayName: "Logistics Domain",
        description: "Logistics domain package registration metadata.",
        category: "logistics",
        tags: Object.freeze(["logistics"]),
      }),
      dependencies: Object.freeze([
        Object.freeze({
          domainId: "domain.manufacturing",
          minVersion: Object.freeze({ major: 1, minor: 0, patch: 0 }),
          optional: false,
        }),
      ]),
    })
  );

  assert.equal(dependent.success, true);
  assert.equal(validateDomainRegistry(dependent.registry).valid, true);
});

test("rejects missing required dependencies", () => {
  const result = registerDomain(
    createDomainRegistry(),
    domainPackage({
      domainId: "domain.retail",
      name: "Retail",
      metadata: Object.freeze({
        displayName: "Retail Domain",
        description: "Retail domain package registration metadata.",
        category: "retail",
        tags: Object.freeze(["retail"]),
      }),
      dependencies: Object.freeze([
        Object.freeze({
          domainId: "domain.manufacturing",
          minVersion: Object.freeze({ major: 1, minor: 0, patch: 0 }),
          optional: false,
        }),
      ]),
    })
  );

  assert.equal(result.success, false);
  assert.equal(result.validation.issues.some((entry) => entry.code === "missing_dependency"), true);
});

test("exports public foundation APIs", () => {
  assert.equal(typeof DomainFoundation.createDomainRegistry, "function");
  assert.equal(typeof DomainFoundation.registerDomain, "function");
  assert.equal(typeof DomainFoundation.unregisterDomain, "function");
  assert.equal(typeof DomainFoundation.getDomain, "function");
  assert.equal(typeof DomainFoundation.listDomains, "function");
  assert.equal(typeof DomainFoundation.hasDomain, "function");
  assert.equal(typeof DomainFoundation.freezeDomainRegistry, "function");
  assert.equal(typeof DomainFoundation.buildDomainFoundationManifest, "function");
  assert.equal(Object.isFrozen(DomainFoundation), true);
});

test("keeps registry validation deterministic", () => {
  const first = buildDomainFoundationManifest();
  const second = buildDomainFoundationManifest();

  assert.equal(first.platform.version, second.platform.version);
  assert.equal(first.publicApis.length, second.publicApis.length);
  assert.equal(first.validation.valid, second.validation.valid);
});

test("rejects invalid domain package versions", () => {
  const validation = validateDomainPackage(
    domainPackage({
      version: Object.freeze({ major: -1, minor: 0, patch: 0 }),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "invalid_domain_version"), true);
});

test("supports unlimited future domain categories through other", () => {
  const result = registerDomain(
    createDomainRegistry(),
    domainPackage({
      domainId: "domain.custom",
      name: "Custom Domain",
      metadata: Object.freeze({
        displayName: "Custom Domain",
        description: "Custom domain package registration metadata.",
        category: "other",
        tags: Object.freeze(["custom"]),
      }),
    })
  );

  assert.equal(result.success, true);
  assert.equal(result.domain?.package.manifest.metadata.category, "other");
});
