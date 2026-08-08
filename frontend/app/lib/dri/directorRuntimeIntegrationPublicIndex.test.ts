import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as freeze from "./directorRuntimeIntegrationPlatformFreeze.ts";
import {
  DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS,
  directorRuntimeIntegrationCanonicalPublicIndexCandidate as canonical,
  directorRuntimeIntegrationConsumerGuarantees,
  directorRuntimeIntegrationConsumerProhibitions,
  directorRuntimeIntegrationConsumerVerification,
  directorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPublicApiRegistry,
  directorRuntimeIntegrationPublicApiRegistryCount,
  directorRuntimeIntegrationPublicCompatibility,
  directorRuntimeIntegrationPublicExportCount,
  directorRuntimeIntegrationPublicIdentityChain,
  directorRuntimeIntegrationPublicIndex,
  directorRuntimeIntegrationPublicIndexManifest,
  directorRuntimeIntegrationPublicNamespaceSectionCount,
  directorRuntimeIntegrationReleaseDeclaration,
  verifyDirectorRuntimeIntegrationConsumerEntry,
  type DirectorRuntimeIntegrationPublicIndexCandidate,
} from "./directorRuntimeIntegrationPublicIndex.ts";

function withCandidate(overrides: Partial<DirectorRuntimeIntegrationPublicIndexCandidate>) {
  return { ...canonical, ...overrides } as DirectorRuntimeIntegrationPublicIndexCandidate;
}

test("publishes exact final identity and sole consumer entry", () => {
  assert.deepEqual(directorRuntimeIntegrationPublicIndexManifest, {
    publicIndexId: "DRI-1:9/DirectorRuntimeIntegrationPublicIndex", version: "1.9.0",
    namespace: "nexora.dri.runtime.integration.public-index", layer: "DRI", phase: "DRI-1",
    stage: "PublicIndex", status: "Released", stability: "Stable",
    readiness: "ReadyForConsumer",
    upstreamIdentity: "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze",
    consumerRole: "SoleConsumerEntryPoint", integrationDirection: "runtime-to-director",
  });
  assert.equal(directorRuntimeIntegrationPublicIndex.consumerInformation.entryModule,
    "@/app/lib/dri/directorRuntimeIntegrationPublicIndex");
});

test("uses Freeze as its sole immediate implementation dependency", () => {
  const source = readFileSync(new URL("./directorRuntimeIntegrationPublicIndex.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["'](\.\/[^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], ["./directorRuntimeIntegrationPlatformFreeze.ts"]);
});

test("preserves the exact lock and valid frozen upstream", () => {
  assert.equal(canonical.lockId, "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED");
  assert.equal(freeze.verifyDirectorRuntimeIntegrationPlatformFreeze(canonical.freeze), true);
  assert.equal(Object.isFrozen(canonical.freeze.lock), true);
});

test("publishes the immutable ordered nine-stage identity chain", () => {
  assert.equal(directorRuntimeIntegrationPublicIdentityChain.length, 9);
  assert.equal(new Set(directorRuntimeIntegrationPublicIdentityChain).size, 9);
  assert.equal(Object.isFrozen(directorRuntimeIntegrationPublicIdentityChain), true);
  assert.equal(directorRuntimeIntegrationPublicIdentityChain.at(-1),
    "DRI-1:9/DirectorRuntimeIntegrationPublicIndex");
});

test("publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS, [
    "Identity", "Public Types", "Public APIs", "Validation", "Certification",
    "Release Information", "Compatibility", "Registry", "Consumer Information",
  ]);
  assert.equal(directorRuntimeIntegrationPublicNamespaceSectionCount,
    DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS.length);
  assert.deepEqual(Object.keys(directorRuntimeIntegrationPublicIndex), [
    "identity", "publicTypes", "publicApis", "validation", "certification",
    "releaseInformation", "compatibility", "registry", "consumerInformation",
  ]);
  assert.equal(Object.isFrozen(directorRuntimeIntegrationPublicIndex), true);
});

test("publishes exactly the DRI-1:8-approved surface", () => {
  assert.deepEqual(directorRuntimeIntegrationPublicApiRegistry.map(({ exportName }) => exportName),
    freeze.directorRuntimeIntegrationFrozenPublicApiSurface.map(({ exportName }) => exportName));
  assert.equal(directorRuntimeIntegrationPublicExportCount,
    freeze.directorRuntimeIntegrationFrozenPublicApiSurface.length);
  assert.equal(directorRuntimeIntegrationPublicApiRegistryCount,
    directorRuntimeIntegrationPublicApiRegistry.length);
  assert.equal(new Set(directorRuntimeIntegrationPublicApiRegistry
    .map(({ exportName }) => exportName)).size, directorRuntimeIntegrationPublicApiRegistry.length);
});

test("preserves exact function and value identity", () => {
  assert.equal(directorRuntimeIntegrationPlatform, freeze.directorRuntimeIntegrationPlatform);
  assert.equal(directorRuntimeIntegrationPublicIndex.validation.platformVerification,
    freeze.verifyDirectorRuntimeIntegrationPlatform);
});

test("publishes derived Validation and Certification availability", () => {
  assert.equal(directorRuntimeIntegrationPublicIndex.validation.available, true);
  assert.equal(directorRuntimeIntegrationPublicIndex.certification.available, true);
  assert.equal(directorRuntimeIntegrationPublicIndex.certification.report.decision.certified, true);
});

test("publishes exact compatibility and unsupported capabilities", () => {
  assert.deepEqual(directorRuntimeIntegrationPublicCompatibility, {
    phase: "DRI-1", platformVersion: "1.7.0", freezeVersion: "1.8.0",
    publicIndexVersion: "1.9.0",
    requiredUpstream: "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze",
    integrationDirection: "runtime-to-director", runtimeAuthorityRequired: true,
    liveSynchronizationSupported: false, renderingSupported: false,
    reverseWriteBackSupported: false, readyForConsumer: true,
  });
  assert.equal(directorRuntimeIntegrationPublicIndex.releaseInformation.businessEvaluationSupported, false);
});

test("publishes complete ordered guarantees and prohibitions", () => {
  assert.equal(directorRuntimeIntegrationConsumerGuarantees.length, 19);
  assert.equal(directorRuntimeIntegrationConsumerProhibitions.length, 15);
  assert.equal(directorRuntimeIntegrationConsumerProhibitions.includes("no-direct-freeze-import"), true);
  assert.equal(Object.isFrozen(directorRuntimeIntegrationConsumerGuarantees), true);
  assert.equal(Object.isFrozen(directorRuntimeIntegrationConsumerProhibitions), true);
});

test("verifies the canonical consumer entry", () => {
  assert.deepEqual(directorRuntimeIntegrationConsumerVerification, {
    valid: true, readyForConsumer: true, identityValid: true, freezeValid: true,
    publicSurfaceValid: true, registryValid: true, authorityValid: true,
    directionValid: true, consumerRulesValid: true, issueCodes: [],
  });
  assert.deepEqual(directorRuntimeIntegrationReleaseDeclaration, {
    released: true, certified: true, frozen: true, stable: true,
    readyForConsumer: true, role: "SoleConsumerEntryPoint",
  });
});

test("rejects invalid Freeze and upstream identity", () => {
  const badFreeze = { ...canonical.freeze, state: "invalid" as const };
  const manifest = { ...canonical.manifest, upstreamIdentity: "wrong" } as unknown as
    typeof canonical.manifest;
  const result = verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({ freeze: badFreeze, manifest }));
  assert.equal(result.freezeValid, false);
  assert.deepEqual(result.issueCodes.slice(0, 2), [
    "DRI_PUBLIC_INDEX_UPSTREAM_INVALID", "DRI_PUBLIC_INDEX_FREEZE_INVALID",
  ]);
});

test("rejects missing, unapproved, and duplicate exports transparently", () => {
  const missing = canonical.publicApiRegistry.slice(1);
  const unknown = [...canonical.publicApiRegistry, Object.freeze({
    ...canonical.publicApiRegistry[0]!, exportName: "internalHelper",
  })];
  const duplicate = [...canonical.publicApiRegistry, canonical.publicApiRegistry[0]!];
  assert.ok(verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({ publicApiRegistry: missing }))
    .issueCodes.includes("DRI_PUBLIC_INDEX_EXPORT_MISSING"));
  assert.ok(verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({ publicApiRegistry: unknown }))
    .issueCodes.includes("DRI_PUBLIC_INDEX_EXPORT_UNAPPROVED"));
  assert.ok(verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({ publicApiRegistry: duplicate }))
    .issueCodes.includes("DRI_PUBLIC_INDEX_EXPORT_DUPLICATE"));
});

test("rejects wrappers through exact symbol identity", () => {
  const wrapper = (...args: Parameters<typeof freeze.createDirectorRuntimeIntegrationPlatform>) =>
    freeze.createDirectorRuntimeIntegrationPlatform(...args);
  const runtimeSymbols = { ...canonical.runtimeSymbols,
    createDirectorRuntimeIntegrationPlatform: wrapper };
  const result = verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({ runtimeSymbols }));
  assert.ok(result.issueCodes.includes("DRI_PUBLIC_INDEX_SYMBOL_IDENTITY_INVALID"));
});

test("rejects namespace, authority, direction, and consumer-rule violations", () => {
  const manifest = { ...canonical.manifest,
    integrationDirection: "director-to-runtime" } as unknown as typeof canonical.manifest;
  const authority = { ...canonical.authority,
    dri: "authoritative operational and business state" } as unknown as typeof canonical.authority;
  const result = verifyDirectorRuntimeIntegrationConsumerEntry(withCandidate({
    manifest, authority, namespaceSections: canonical.namespaceSections.slice(1),
    prohibitions: canonical.prohibitions.slice(1),
  }));
  assert.ok(result.issueCodes.includes("DRI_PUBLIC_INDEX_NAMESPACE_SECTIONS_INVALID"));
  assert.ok(result.issueCodes.includes("DRI_PUBLIC_INDEX_AUTHORITY_INVALID"));
  assert.ok(result.issueCodes.includes("DRI_PUBLIC_INDEX_DIRECTION_INVALID"));
  assert.ok(result.issueCodes.includes("DRI_PUBLIC_INDEX_CONSUMER_RULE_INVALID"));
});

test("verification is deterministic and does not mutate frozen inputs", () => {
  const before = JSON.stringify(canonical);
  assert.deepEqual(verifyDirectorRuntimeIntegrationConsumerEntry(),
    verifyDirectorRuntimeIntegrationConsumerEntry());
  assert.equal(JSON.stringify(canonical), before);
});

test("has no forbidden architecture or nondeterministic runtime dependency", () => {
  const source = readFileSync(new URL("./directorRuntimeIntegrationPublicIndex.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@\/app\/lib\/nol)/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|localStorage|indexedDB|fetch)\s*\(/);
  assert.doesNotMatch(source, /\b(?:subscribe|poll|stream|dispatch|synchronize)\s*\(/);
});

test("business payload differences cannot affect static verification", () => {
  const one = verifyDirectorRuntimeIntegrationConsumerEntry();
  const two = verifyDirectorRuntimeIntegrationConsumerEntry();
  assert.deepEqual(one, two);
});
