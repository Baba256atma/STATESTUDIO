/**
 * RTC-1:5 — Executive Context Runtime Manifest Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Manifest.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./executiveContextRuntimeManifest.ts";
import {
  ExecutiveContextRuntimeManifest,
  ExecutiveContextRuntimeManifestId,
  ExecutiveContextRuntimeManifestName,
  ExecutiveContextRuntimeManifestNamespace,
  ExecutiveContextRuntimeManifestReadiness,
  ExecutiveContextRuntimeManifestStatus,
  ExecutiveContextRuntimeManifestVersion,
  getExecutiveContextRuntimeManifestSummary,
} from "./executiveContextRuntimeManifest.ts";
import { ExecutiveContextRuntimeValidation } from "./executiveContextRuntimeValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC15_FILES = Object.freeze([
  "executiveContextRuntimeManifest.ts",
  "executiveContextManifestIdentity.ts",
  "executiveContextManifestDependencies.ts",
  "executiveContextManifestCapabilities.ts",
  "executiveContextManifestGuarantees.ts",
  "executiveContextManifestMetadata.ts",
  "executiveContextManifestRegistry.ts",
  "executiveContextRuntimeManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeManifestId",
  "ExecutiveContextRuntimeManifestVersion",
  "ExecutiveContextRuntimeManifestName",
  "ExecutiveContextRuntimeManifestNamespace",
  "ExecutiveContextRuntimeManifestStatus",
  "ExecutiveContextRuntimeManifestReadiness",
  "ExecutiveContextRuntimeManifest",
  "getExecutiveContextRuntimeManifestSummary",
  "getExecutiveContextRuntimeManifest",
  "ExecutiveContextManifestIdentity",
  "ExecutiveContextRuntimeManifestNextPhase",
  "ExecutiveContextRuntimeName",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "Context Creation",
  "Context Identity",
  "Context Registration",
  "Context Modeling",
  "Context Validation",
  "Snapshot Definition",
  "Lifecycle Definition",
  "Runtime Metadata",
] as const);

const EXPECTED_GUARANTEES = Object.freeze([
  "Single active Executive Context",
  "Immutable identities",
  "Deterministic model",
  "Deterministic validation",
  "Stable lifecycle",
  "Structured metadata",
  "Reproducible snapshots",
  "Forward-compatible extension",
] as const);

const EXPECTED_UPSTREAM = Object.freeze([
  "RTC-1:1",
  "RTC-1:2",
  "RTC-1:3",
  "RTC-1:4",
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
  /from ["']\.\/executiveContextValidation(Rules|Categories|Result|Severity|Registry)\.ts["']/,
  /from ["']\.\/executiveContextIntegrityValidation\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:5 Executive Context Runtime Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(RTC15_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC15_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC15_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !RTC15_FILES.some((name) =>
        /Platform|Certification|Freeze/i.test(name)
      ),
      "Manifest artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in ManifestModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Manifest identity and ReadyForPlatform readiness", () => {
    assert.equal(
      ExecutiveContextRuntimeManifestId,
      "RTC-1:5/ExecutiveContextRuntimeManifest",
    );
    assert.equal(ExecutiveContextRuntimeManifestVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeManifestName,
      "Executive Context Runtime Manifest",
    );
    assert.equal(
      ExecutiveContextRuntimeManifestNamespace,
      "nexora.rtc.executive.context.manifest",
    );
    assert.equal(ExecutiveContextRuntimeManifestStatus, "Manifest");
    assert.equal(
      ExecutiveContextRuntimeManifestReadiness,
      "ReadyForPlatform",
    );

    const manifest = ExecutiveContextRuntimeManifest;
    assert.equal(manifest.identity.phaseId, "RTC-1:5");
    assert.equal(manifest.identity.runtimeName, "Executive Context Runtime");
    assert.equal(manifest.identity.status, "Manifest");
    assert.equal(manifest.identity.readiness, "ReadyForPlatform");
    assert.equal(
      manifest.identity.sourceValidation,
      "RTC-1:4/ExecutiveContextRuntimeValidation",
    );
    assert.equal(manifest.status, "Manifest");
    assert.equal(manifest.readiness, "ReadyForPlatform");
    assert.equal(
      manifest.nextPhase,
      "RTC-1:6 — Executive Context Runtime Platform",
    );
  });

  it("references only RTC-1:1 through RTC-1:4 and consumes Validation", () => {
    const manifest = ExecutiveContextRuntimeManifest;
    assert.equal(manifest.validation, ExecutiveContextRuntimeValidation);
    assert.equal(manifest.dependencies.length, 4);
    assert.deepEqual(
      manifest.dependencies.map((item) => item.phaseId),
      [...EXPECTED_UPSTREAM],
    );
    assert.equal(manifest.dependencyCatalog.downstreamCount, 0);
    assert.equal(
      manifest.dependencyCatalog.downstreamDependenciesPermitted,
      false,
    );
    assert.deepEqual(
      [...manifest.upstreamDependencies],
      [
        "RTC-1:1 — Executive Context Runtime Foundation",
        "RTC-1:2 — Executive Context Runtime Registry",
        "RTC-1:3 — Executive Context Runtime Model",
        "RTC-1:4 — Executive Context Runtime Validation",
      ],
    );
    assert.equal(manifest.referencesPlatform, false);
    assert.equal(manifest.referencesUi, false);
  });

  it("publishes canonical baselines for capabilities, guarantees, and validation", () => {
    const manifest = ExecutiveContextRuntimeManifest;

    assert.deepEqual([...manifest.capabilityNames], [...EXPECTED_CAPABILITIES]);
    assert.deepEqual(
      manifest.capabilities.map((item) => item.name),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      manifest.capabilities.every((item) => item.implemented === false),
    );
    assert.ok(manifest.capabilities.every((item) => item.executable === false));

    assert.deepEqual([...manifest.guaranteeNames], [...EXPECTED_GUARANTEES]);
    assert.equal(manifest.guarantees.length, 8);

    assert.equal(manifest.validationSummary.validationCategories, 10);
    assert.equal(manifest.validationSummary.validationRules, 40);
    assert.equal(manifest.validationSummary.validationStatus, "Complete");
    assert.equal(
      manifest.validationSummary.storesIndividualRuleExecution,
      false,
    );

    assert.equal(manifest.compatibility.length, 5);
    assert.ok(
      manifest.compatibility.every((item) => item.impliesDependency === false),
    );
    assert.equal(manifest.extensionPoints.length, 6);
    assert.ok(
      manifest.extensionPoints.every(
        (item) => item.existingIdentitiesRemainStable === true,
      ),
    );

    assert.deepEqual(
      { ...manifest.baselines },
      {
        upstreamRuntimePhases: 4,
        runtimeCapabilities: 8,
        runtimeGuarantees: 8,
        validationCategories: 10,
        validationRules: 40,
        compatibilityTargets: 5,
        extensionPoints: 6,
      },
    );

    assertUnique(
      manifest.capabilities.map((item) => item.capabilityId),
      "capability IDs",
    );
    assertUnique(
      manifest.guarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
  });

  it("declares public contracts, sections, and immutable metadata", () => {
    const manifest = ExecutiveContextRuntimeManifest;

    assert.deepEqual(
      manifest.publicContracts.map((item) => item.name),
      [
        "ExecutiveContext",
        "RuntimeIdentity",
        "RuntimeLifecycle",
        "RuntimeRegistry",
        "RuntimeValidation",
      ],
    );

    assert.deepEqual(
      [...manifest.sections],
      [
        "Identity",
        "Version",
        "Status",
        "Dependencies",
        "Public Contracts",
        "Runtime Capabilities",
        "Runtime Guarantees",
        "Validation Summary",
        "Compatibility",
        "Extension Points",
        "Metadata",
      ],
    );

    assert.equal(manifest.metadata.architecture, "NPA-T vNext");
    assert.equal(manifest.metadata.releaseStage, "Manifest");
    assert.equal(
      manifest.metadata.generatedTimestamp,
      "2026-07-25T00:00:00.000Z",
    );
    assert.equal(Object.isFrozen(manifest.metadata), true);
    assert.equal(manifest.principles.length, 5);
    assert.ok(manifest.invariants.includes("One canonical manifest"));
  });

  it("is metadata-only with zero prohibited runtime behaviors", () => {
    const manifest = ExecutiveContextRuntimeManifest;
    assert.equal(Object.isFrozen(manifest), true);
    assert.equal(Object.isFrozen(manifest.registry), true);
    assert.equal(Object.isFrozen(manifest.dependencies), true);

    assert.equal(manifest.metadataOnly, true);
    assert.equal(manifest.executableRuntimeLogic, false);
    assert.equal(manifest.holdsActiveState, false);
    assert.equal(manifest.validatesContexts, false);
    assert.equal(manifest.performsLifecycleTransitions, false);
    assert.equal(manifest.renderingBehavior, false);
    assert.equal(manifest.invokesAi, false);
    assert.equal(manifest.persistsData, false);
    assert.equal(manifest.accessesExternalSystems, false);
    assert.equal(manifest.reactBehavior, false);
    assert.equal(manifest.nextJsBehavior, false);
    assert.equal(manifest.platformPhase, false);
    assert.equal(manifest.certificationPhase, false);
    assert.equal(manifest.freezePhase, false);

    assert.ok(manifest.prohibitedSurfaces.includes("execute Runtime code"));
    assert.ok(manifest.prohibitedSurfaces.includes("validate contexts"));
    assert.ok(manifest.prohibitedSurfaces.includes("React"));
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = RTC15_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      new URL("./executiveContextRuntimeManifest.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeValidation\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const manifest = ExecutiveContextRuntimeManifest;
    const summaryA = getExecutiveContextRuntimeManifestSummary();
    const summaryB = getExecutiveContextRuntimeManifestSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, ExecutiveContextRuntimeManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.upstreamPhaseCount, 4);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.guaranteeCount, 8);
    assert.equal(summaryA.validationCategoryCount, 10);
    assert.equal(summaryA.validationRuleCount, 40);
    assert.equal(summaryA.compatibilityCount, 5);
    assert.equal(summaryA.extensionPointCount, 6);
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:6 — Executive Context Runtime Platform",
    );

    assert.equal(
      manifest.statistics.capabilityCount,
      manifest.capabilities.length,
    );
    assert.equal(
      manifest.statistics.guaranteeCount,
      manifest.guarantees.length,
    );
    assert.equal(
      manifest.statistics.upstreamPhaseCount,
      manifest.dependencies.length,
    );
    assert.equal(
      manifest.registry.baselines.validationRules,
      40,
    );
  });
});
