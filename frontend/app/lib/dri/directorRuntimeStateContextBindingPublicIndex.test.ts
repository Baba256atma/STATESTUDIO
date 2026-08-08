import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as upstream from "./directorRuntimeStateContextBindingAdapterCertification.ts";
import * as publicIndex from "./directorRuntimeStateContextBindingPublicIndex.ts";

const expectedSections = ["Identity", "Public Types", "Public APIs", "Validation", "Certification",
  "Release Information", "Compatibility", "Registry", "Consumer Information"];
const runtimeNames = ["createRuntimeStateContextBindingRequest", "executeRuntimeStateContextBindingEngine",
  "createRuntimeStateContextBindingIntegrationRequest", "integrateRuntimeStateContextBinding",
  "inspectRuntimeStateContextBindingIntegrationOutcome", "isBoundRuntimeStateContextBindingResult",
  "validateRuntimeStateContextBinding"] as const;

test("publishes exact Public Index and Freeze identity through the sole DRI-2:8 dependency", () => {
  const descriptor = publicIndex.directorRuntimeStateContextBindingPublicIndex;
  assert.equal(descriptor.identity, "DRI-2:9/DirectorRuntimeStateContextBindingPublicIndex");
  assert.equal(descriptor.freezeIdentity, "DRI-2:9/DirectorRuntimeStateContextBindingFreeze");
  assert.equal(descriptor.version, "2.9.0");
  assert.equal(descriptor.namespace, "nexora.dri.runtime.state-context-binding.public-index");
  assert.equal(descriptor.freezeNamespace, "nexora.dri.runtime.state-context-binding.freeze");
  assert.equal(descriptor.stage, "PublicIndex");
  assert.equal(descriptor.immediateDependency,
    "DRI-2:8/DirectorRuntimeStateContextBindingAdapterCertification");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingPublicIndex.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingAdapterCertification"]);
  assert.doesNotMatch(source, /from\s+["'][^"']*directorRuntimeStateContextBinding(?:Platform|Certification|Validation|Integration|Engine|Contracts|Foundation)["']/);
  assert.doesNotMatch(source, /from\s+["'][^"']*directorRuntimeIntegrationPublicIndex["']/);
});

test("publishes exact immutable final release declarations", () => {
  const descriptor = publicIndex.directorRuntimeStateContextBindingPublicIndex;
  assert.equal(descriptor.lock, "DRI-2-RUNTIME-STATE-CONTEXT-BINDING-LOCKED");
  assert.equal(descriptor.releaseStatus, "Released");
  assert.equal(descriptor.freezeStatus, "Frozen");
  assert.equal(descriptor.certificationStatus, "Certified");
  assert.equal(descriptor.adapterCertificationStatus, "AdapterCertified");
  assert.equal(descriptor.stability, "Stable");
  assert.equal(descriptor.readiness, "ReadyForConsumer");
  assert.equal(descriptor.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(descriptor.consumerImportPath,
    "@/app/lib/dri/directorRuntimeStateContextBindingPublicIndex");
  assert.deepEqual(publicIndex.directorRuntimeStateContextBindingFreeze.statuses,
    ["Frozen", "Locked", "Certified", "AdapterCertified"]);
});

test("publishes exactly nine ordered unique namespace sections", () => {
  assert.deepEqual(publicIndex.runtimeStateContextBindingPublicNamespaceSections, expectedSections);
  assert.equal(new Set(publicIndex.runtimeStateContextBindingPublicNamespaceSections).size, 9);
  assert.equal(publicIndex.runtimeStateContextBindingPublicIndexRegistry.namespaceSectionCount,
    publicIndex.runtimeStateContextBindingPublicNamespaceSections.length);
});

test("preserves every approved runtime function by strict upstream identity", () => {
  for (const name of runtimeNames) assert.equal(publicIndex[name], upstream[name], name);
  assert.equal(publicIndex.inspectRuntimeStateContextBindingAdapterCertification,
    upstream.inspectRuntimeStateContextBindingAdapterCertification);
  assert.equal(publicIndex.isRuntimeStateContextBindingAdapterCertified,
    upstream.isRuntimeStateContextBindingAdapterCertified);
  assert.equal(publicIndex.isRuntimeStateContextBindingAdapterCertifiedWithConditions,
    upstream.isRuntimeStateContextBindingAdapterCertifiedWithConditions);
  assert.equal(publicIndex.isRuntimeStateContextBindingAdapterCertificationRejected,
    upstream.isRuntimeStateContextBindingAdapterCertificationRejected);
});

test("publishes closed, ordered, unique public and frozen registries with derived counts", () => {
  const registry = publicIndex.runtimeStateContextBindingPublicIndexRegistry;
  const publicNames = publicIndex.runtimeStateContextBindingPublicApiSurface.map(({ name }) => name);
  const frozenNames = publicIndex.runtimeStateContextBindingFrozenExportSurface.map(({ name }) => name);
  assert.equal(new Set(publicNames).size, publicNames.length);
  assert.equal(new Set(publicIndex.runtimeStateContextBindingPublicTypeNames).size,
    publicIndex.runtimeStateContextBindingPublicTypeNames.length);
  assert.equal(new Set(frozenNames).size, frozenNames.length);
  assert.deepEqual(Object.keys(publicIndex).filter((name) => !frozenNames.includes(name)), []);
  for (const name of [...publicNames, ...publicIndex.runtimeStateContextBindingPublicTypeNames,
    "verifyDirectorRuntimeStateContextBindingConsumerEntry", "runtimeStateContextBindingFreezeManifest",
    "runtimeStateContextBindingReleaseManifest", "runtimeStateContextBindingPublicIndexRegistry",
    "directorRuntimeStateContextBindingPublicIndex"])
    assert.ok(frozenNames.includes(name), name);
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.publicTypeCount, registry.publicTypes], [registry.publicApiCount, registry.publicApis],
    [registry.publicPredicateCount, registry.publicPredicates],
    [registry.publicValidatorCount, registry.publicValidators],
    [registry.publicInspectorCount, registry.publicInspectors],
    [registry.validationGuaranteeCount, registry.validationGuarantees],
    [registry.certificationGuaranteeCount, registry.certificationGuarantees],
    [registry.compatibilityEntryCount, registry.compatibilityEntries],
    [registry.consumerRuleCount, registry.consumerRules], [registry.frozenExportCount, registry.frozenExports],
    [registry.releaseFieldCount, registry.releaseFields],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
});

test("release and freeze manifests close the approved architecture", () => {
  const release = publicIndex.runtimeStateContextBindingReleaseManifest;
  const freeze = publicIndex.runtimeStateContextBindingFreezeManifest;
  assert.equal(release.frozenExportCount, publicIndex.runtimeStateContextBindingFrozenExportSurface.length);
  assert.equal(release.publicTypeCount, publicIndex.runtimeStateContextBindingPublicTypeNames.length);
  assert.equal(release.publicApiCount, publicIndex.runtimeStateContextBindingPublicApiSurface.length);
  assert.deepEqual(freeze.approvedExportNames,
    publicIndex.runtimeStateContextBindingFrozenExportSurface.map(({ name }) => name));
  assert.equal(Object.isFrozen(release), true);
  assert.equal(Object.isFrozen(freeze), true);
});

test("consumer rules prohibit every internal phase and preserve invariants", () => {
  const rules = new Set(publicIndex.runtimeStateContextBindingConsumerRules);
  for (const rule of ["public-index-only", "no-foundation-import", "no-contracts-import",
    "no-engine-import", "no-integration-import", "no-validation-import", "no-certification-import",
    "no-platform-import", "no-adapter-certification-import", "preserve-caller-identity",
    "preserve-binding-status", "preserve-bound-context-invariant", "no-runtime-store",
    "no-state-synchronization", "no-event-dispatch", "no-ui-semantics", "no-director-execution"])
    assert.ok(rules.has(rule as never), rule);
  assert.equal(rules.size, publicIndex.runtimeStateContextBindingConsumerRules.length);
});

test("consumer verification accepts canonical metadata and detects stable mismatches", () => {
  const canonical = publicIndex.verifyDirectorRuntimeStateContextBindingConsumerEntry();
  assert.equal(canonical.valid, true);
  assert.deepEqual(canonical.violations, []);
  const base = publicIndex.runtimeStateContextBindingConsumerEntryVerificationInput;
  const variants = [
    [{ ...base, identity: "wrong" }, "identity"],
    [{ ...base, freezeIdentity: "wrong" }, "freeze-identity"],
    [{ ...base, namespace: "wrong" }, "namespace"],
    [{ ...base, lock: "wrong" }, "lock"],
    [{ ...base, releaseStatus: "wrong" }, "release-status"],
    [{ ...base, readiness: "wrong" }, "readiness"],
    [{ ...base, namespaceSections: base.namespaceSections.slice(1) }, "namespace-sections"],
    [{ ...base, frozenExportNames: base.frozenExportNames.slice(1) }, "frozen-exports"],
  ] as const;
  for (const [input, violation] of variants) {
    const result = publicIndex.verifyDirectorRuntimeStateContextBindingConsumerEntry(input);
    assert.equal(result.valid, false);
    assert.ok(result.violations.includes(violation));
  }
  assert.equal(Object.isFrozen(canonical), true);
  assert.equal(Object.isFrozen(canonical.violations), true);
  assert.deepEqual(publicIndex.verifyDirectorRuntimeStateContextBindingConsumerEntry(), canonical);
  assert.deepEqual(JSON.parse(JSON.stringify(canonical)), canonical);
});

test("metadata is frozen, deterministic, JSON-compatible, and contains no live behavior", () => {
  const descriptor = publicIndex.directorRuntimeStateContextBindingPublicIndex;
  assert.equal(Object.isFrozen(descriptor), true);
  assert.equal(Object.isFrozen(descriptor.registry), true);
  assert.equal(Object.isFrozen(descriptor.frozenExportSurface), true);
  assert.deepEqual(JSON.parse(JSON.stringify(descriptor)), descriptor);
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingPublicIndex.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|async|Promise|setTimeout|setInterval|EventEmitter|subscribe|listener|callback|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:activateBinding|synchronizeBinding|persistBinding|executeDirectorCommand)\b/);
});
