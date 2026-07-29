/**
 * RTC-1:8 — Executive Context Runtime Freeze Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Freeze.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveContextRuntimeCertification } from "./executiveContextRuntimeCertification.ts";
import * as FreezeModule from "./executiveContextRuntimeFreeze.ts";
import {
  EXECUTIVE_CONTEXT_RUNTIME_LOCK,
  ExecutiveContextRuntimeFreeze,
  ExecutiveContextRuntimeFreezeId,
  ExecutiveContextRuntimeFreezeName,
  ExecutiveContextRuntimeFreezeNamespace,
  ExecutiveContextRuntimeFreezeReadiness,
  ExecutiveContextRuntimeFreezeStatus,
  ExecutiveContextRuntimeFreezeVersion,
  getExecutiveContextRuntimeFreezeSummary,
} from "./executiveContextRuntimeFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC18_FILES = Object.freeze([
  "executiveContextRuntimeFreeze.ts",
  "executiveContextFreezeLock.ts",
  "executiveContextFreezeBaselines.ts",
  "executiveContextFreezeCompatibility.ts",
  "executiveContextFreezePublicApi.ts",
  "executiveContextFreezeMetadata.ts",
  "executiveContextFreezeManifest.ts",
  "executiveContextRuntimeFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeFreezeId",
  "ExecutiveContextRuntimeFreezeVersion",
  "ExecutiveContextRuntimeFreezeName",
  "ExecutiveContextRuntimeFreezeNamespace",
  "ExecutiveContextRuntimeFreezeStatus",
  "ExecutiveContextRuntimeFreezeReadiness",
  "ExecutiveContextRuntimeFreeze",
  "getExecutiveContextRuntimeFreezeSummary",
  "getExecutiveContextRuntimeFreeze",
  "ExecutiveContextFreezeIdentity",
  "ExecutiveContextFreezeLock",
  "ExecutiveContextRuntimeFreezeNextPhase",
  "EXECUTIVE_CONTEXT_RUNTIME_LOCK",
] as const);

const EXPECTED_LOCKS = Object.freeze([
  "FoundationLocked",
  "RegistryLocked",
  "ModelLocked",
  "ValidationLocked",
  "ManifestLocked",
  "PlatformLocked",
  "CertificationLocked",
  "RuntimeIdentityLocked",
  "PublicContractsLocked",
  "CompatibilityLocked",
  "MetadataLocked",
  "ReleaseLocked",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "FoundationBaseline",
  "RegistryBaseline",
  "ModelBaseline",
  "ValidationBaseline",
  "ManifestBaseline",
  "PlatformBaseline",
  "CertificationBaseline",
  "ReleaseBaseline",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']\.\/executiveContextRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveContextRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveContextRuntimeModel\.ts["']/,
  /from ["']\.\/executiveContextRuntimeValidation\.ts["']/,
  /from ["']\.\/executiveContextRuntimeManifest\.ts["']/,
  /from ["']\.\/executiveContextRuntimePlatform\.ts["']/,
  /from ["']\.\/executiveContextCertification(Categories|Gates|Result|Status|Registry|Metadata)\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:8 Executive Context Runtime Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(RTC18_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC18_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC18_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !RTC18_FILES.some((name) => /PublicIndex/i.test(name)),
      "Freeze artifact set must not include Public Index files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in FreezeModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Freeze identity, lock, and ReadyForPublicIndex readiness", () => {
    assert.equal(
      ExecutiveContextRuntimeFreezeId,
      "RTC-1:8/ExecutiveContextRuntimeFreeze",
    );
    assert.equal(ExecutiveContextRuntimeFreezeVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeFreezeName,
      "Executive Context Runtime Freeze",
    );
    assert.equal(
      ExecutiveContextRuntimeFreezeNamespace,
      "nexora.rtc.executive.context.freeze",
    );
    assert.equal(ExecutiveContextRuntimeFreezeStatus, "Freeze");
    assert.equal(
      ExecutiveContextRuntimeFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      EXECUTIVE_CONTEXT_RUNTIME_LOCK,
      "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED",
    );

    const freeze = ExecutiveContextRuntimeFreeze;
    assert.equal(freeze.identity.phaseId, "RTC-1:8");
    assert.equal(freeze.identity.status, "Freeze");
    assert.equal(freeze.identity.readiness, "ReadyForPublicIndex");
    assert.equal(
      freeze.lockIdentifier,
      "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED",
    );
    assert.equal(freeze.lock.lockIdentifier, EXECUTIVE_CONTEXT_RUNTIME_LOCK);
    assert.equal(freeze.lock.oneLockPerRelease, true);
    assert.equal(freeze.lock.mutationAllowed, false);
    assert.equal(
      freeze.nextPhase,
      "RTC-1:9 — Executive Context Runtime Public Index",
    );
  });

  it("consumes RTC-1:7 Certification and declares twelve locks with eight baselines", () => {
    const freeze = ExecutiveContextRuntimeFreeze;
    assert.equal(freeze.certification, ExecutiveContextRuntimeCertification);

    assert.equal(freeze.architecturalLocks.length, 12);
    assert.deepEqual(
      [...freeze.architecturalLockNames],
      [...EXPECTED_LOCKS],
    );
    assert.ok(
      freeze.architecturalLocks.every((item) => item.lockStatus === "Locked"),
    );
    assert.ok(
      freeze.architecturalLocks.every((item) => item.mutationAllowed === false),
    );

    assert.equal(freeze.baselines.length, 8);
    assert.deepEqual([...freeze.baselineNames], [...EXPECTED_BASELINES]);
    assert.ok(freeze.baselines.every((item) => item.frozen === true));

    assertUnique(
      freeze.architecturalLocks.map((item) => item.lockId),
      "architectural lock IDs",
    );
    assertUnique(
      freeze.baselines.map((item) => item.baselineId),
      "baseline IDs",
    );
  });

  it("declares eight compatibility targets and dynamically derived public API registry", () => {
    const freeze = ExecutiveContextRuntimeFreeze;

    assert.equal(freeze.compatibilityDeclarations.length, 8);
    assert.ok(
      freeze.compatibilityDeclarations.every(
        (item) => item.immutableForRelease === true,
      ),
    );

    assert.deepEqual(
      [...freeze.frozenPublicContracts],
      [
        "ExecutiveContext",
        "RuntimePlatform",
        "RuntimeLifecycle",
        "RuntimeRegistry",
        "RuntimeValidation",
        "RuntimeManifest",
      ],
    );

    const { publicApi } = freeze;
    assert.equal(publicApi.hardCodedCounts, false);
    assert.equal(publicApi.introducesNewApis, false);
    assert.equal(
      publicApi.inventory.contractCount,
      publicApi.contracts.length,
    );
    assert.equal(publicApi.inventory.exportCount, publicApi.exports.length);
    assert.equal(publicApi.inventory.serviceCount, publicApi.services.length);
    assert.equal(
      publicApi.inventory.metadataIdentityCount,
      publicApi.metadataIdentities.length,
    );
    assert.equal(
      publicApi.inventory.compatibilityDeclarationCount,
      publicApi.compatibilityDeclarations.length,
    );
    assert.equal(
      publicApi.inventory.totalRegistryEntries,
      publicApi.contracts.length +
        publicApi.exports.length +
        publicApi.services.length +
        publicApi.metadataIdentities.length,
    );
    assert.equal(
      publicApi.consumerEntryDeclaration.file,
      "executiveContextRuntimePublicIndex.ts",
    );
  });

  it("seals immutable metadata, release statuses, and extension policy", () => {
    const freeze = ExecutiveContextRuntimeFreeze;

    assert.deepEqual(
      [...freeze.releaseStatuses],
      ["Released", "Certified", "Frozen", "Stable"],
    );
    assert.equal(freeze.metadataGroups.length, 7);
    assert.equal(freeze.metadata.architectureVersion, "NPA-T vNext");
    assert.equal(freeze.metadata.freezeTimestamp, "2026-07-25T00:00:00.000Z");
    assert.equal(freeze.metadata.oneFreezeArtifactPerRelease, true);
    assert.equal(Object.isFrozen(freeze.metadata), true);

    assert.ok(
      freeze.extensionPolicy.allowed.includes("new optional services"),
    );
    assert.ok(
      freeze.extensionPolicy.notAllowed.includes("changing canonical identities"),
    );
    assert.equal(freeze.guarantees.length, 8);
    assert.ok(freeze.guarantees.includes("immutable Runtime identity"));
    assert.equal(freeze.principles.length, 5);

    assert.deepEqual(
      { ...freeze.baselinesPublished },
      {
        canonicalRuntimeLock: 1,
        architecturalLocks: 12,
        frozenBaselines: 8,
        compatibilityDeclarations: 8,
        releaseStatusValues: 4,
        freezeMetadataGroups: 7,
        publicApiRegistry: "Dynamic",
      },
    );
  });

  it("is sealed with zero prohibited runtime behaviors", () => {
    const freeze = ExecutiveContextRuntimeFreeze;
    assert.equal(Object.isFrozen(freeze), true);
    assert.equal(Object.isFrozen(freeze.lock), true);
    assert.equal(Object.isFrozen(freeze.publicApi), true);

    assert.equal(freeze.metadataOnly, true);
    assert.equal(freeze.sealed, true);
    assert.equal(freeze.mutationAllowed, false);
    assert.equal(freeze.introducesNewApis, false);
    assert.equal(freeze.introducesNewRuntimeFunctionality, false);
    assert.equal(freeze.executesRuntimeLogic, false);
    assert.equal(freeze.activatesContexts, false);
    assert.equal(freeze.modifiesRuntimeState, false);
    assert.equal(freeze.validatesContexts, false);
    assert.equal(freeze.renderingBehavior, false);
    assert.equal(freeze.invokesAi, false);
    assert.equal(freeze.communicatesExternally, false);
    assert.equal(freeze.exposesImplementationDetails, false);
    assert.equal(freeze.reactBehavior, false);
    assert.equal(freeze.nextJsBehavior, false);
    assert.equal(freeze.publicIndexPhase, false);

    assert.ok(freeze.prohibitedSurfaces.includes("execute Runtime logic"));
    assert.ok(freeze.prohibitedSurfaces.includes("activate contexts"));
    assert.ok(freeze.prohibitedSurfaces.includes("React"));
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = RTC18_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.doesNotMatch(source, /\bDate\.now\b/);
      assert.doesNotMatch(source, /\bfrom ["']react/);
      assert.doesNotMatch(source, /\bfrom ["']next/);
    }

    const aggregateSource = readFileSync(
      new URL("./executiveContextRuntimeFreeze.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeCertification\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamically counted public API inventory", () => {
    const freeze = ExecutiveContextRuntimeFreeze;
    const summaryA = getExecutiveContextRuntimeFreezeSummary();
    const summaryB = getExecutiveContextRuntimeFreezeSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, ExecutiveContextRuntimeFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(
      summaryA.lockIdentifier,
      "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED",
    );
    assert.equal(summaryA.architecturalLockCount, 12);
    assert.equal(summaryA.baselineCount, 8);
    assert.equal(summaryA.compatibilityCount, 8);
    assert.equal(summaryA.releaseStatusCount, 4);
    assert.equal(summaryA.metadataGroupCount, 7);
    assert.equal(
      summaryA.publicApiTotalEntries,
      freeze.publicApi.inventory.totalRegistryEntries,
    );
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:9 — Executive Context Runtime Public Index",
    );

    assert.equal(
      freeze.statistics.architecturalLockCount,
      freeze.architecturalLocks.length,
    );
    assert.equal(
      freeze.statistics.publicApiTotalEntries,
      freeze.publicApi.inventory.totalRegistryEntries,
    );
    assert.deepEqual(
      [...freeze.compositionLayers],
      [
        "Foundation",
        "Registry",
        "Model",
        "Validation",
        "Manifest",
        "Platform",
        "Certification",
        "Freeze",
      ],
    );
  });
});
