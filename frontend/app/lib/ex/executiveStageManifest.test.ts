/**
 * EX-1:5 — Executive Stage Manifest Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Manifest.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./executiveStageManifest.ts";
import {
  ExecutiveStageManifest,
  ExecutiveStageManifestId,
  ExecutiveStageManifestName,
  ExecutiveStageManifestNamespace,
  ExecutiveStageManifestReadiness,
  ExecutiveStageManifestStatus,
  ExecutiveStageManifestVersion,
  getExecutiveStageManifest,
  getExecutiveStageManifestSummary,
} from "./executiveStageManifest.ts";
import { ExecutiveStageValidation } from "./executiveStageValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX15_FILES = Object.freeze([
  "executiveStageManifest.ts",
  "executiveStageManifestIdentity.ts",
  "executiveStageManifestDependencies.ts",
  "executiveStageManifestCapabilities.ts",
  "executiveStageManifestGuarantees.ts",
  "executiveStageManifestMetadata.ts",
  "executiveStageManifestRegistry.ts",
  "executiveStageManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageManifestId",
  "ExecutiveStageManifestVersion",
  "ExecutiveStageManifestName",
  "ExecutiveStageManifestNamespace",
  "ExecutiveStageManifestStatus",
  "ExecutiveStageManifestReadiness",
  "ExecutiveStageManifest",
  "getExecutiveStageManifestSummary",
  "getExecutiveStageManifest",
  "ExecutiveStageManifestIdentity",
  "ExecutiveStageManifestNextPhase",
  "ExecutiveStageName",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "Stage Composition",
  "Layer Management",
  "Object Projection",
  "Focus Projection",
  "Relationship Projection",
  "Interaction Surface",
  "Viewport Management",
  "Overlay Management",
] as const);

const EXPECTED_GUARANTEES = Object.freeze([
  "Runtime-driven projection",
  "Immutable visual identities",
  "Canonical layer ordering",
  "Deterministic structure",
  "Runtime compatibility",
  "Accessibility foundation",
  "Responsive architecture",
  "Forward-compatible extension",
] as const);

const EXPECTED_UPSTREAM = Object.freeze([
  "EX-1:1",
  "EX-1:2",
  "EX-1:3",
  "EX-1:4",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "Executive Context Runtime",
  "Executive Journal",
  "Executive Timeline",
  "Executive Workspace",
  "Executive Assistant",
  "Director",
  "EVE Visualization Layer",
  "Future Executive Experience Modules",
] as const);

const EXPECTED_EXTENSIONS = Object.freeze([
  "Stage Layers",
  "Object Types",
  "Relationship Types",
  "Interaction Types",
  "Overlay Types",
  "Visual States",
  "Viewport Features",
  "Metadata Fields",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|rtc)\//,
  /from ["']\.\/executive(StageFoundation|Shell|StageSurface|ObjectLayer|RelationshipLayer|FocusLayer)\.tsx["']/,
  /from ["']\.\/executiveStageTypes\.ts["']/,
  /from ["']\.\/executiveStageRegistry\.ts["']/,
  /from ["']\.\/executiveStageModel\.ts["']/,
  /from ["']\.\/executiveStageValidation(Rules|Categories|Result|Severity|Registry)\.ts["']/,
  /from ["']\.\/executiveStageIntegrityValidation\.ts["']/,
]);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bcreateElement\b/,
  /\buseState\b/,
  /\buseEffect\b/,
  /\bjsx\b/i,
  /\brender\s*\(/,
  /\brequestAnimationFrame\b/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EX-1:5 Executive Stage Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(EX15_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX15_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX15_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !EX15_FILES.some((name) =>
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
    assert.equal(ExecutiveStageManifestId, "EX-1:5/ExecutiveStageManifest");
    assert.equal(ExecutiveStageManifestName, "Executive Stage Manifest");
    assert.equal(ExecutiveStageManifestVersion, "1.0.0");
    assert.equal(
      ExecutiveStageManifestNamespace,
      "nexora.ex.executive.stage.manifest",
    );
    assert.equal(ExecutiveStageManifestStatus, "Manifest");
    assert.equal(ExecutiveStageManifestReadiness, "ReadyForPlatform");
    assert.equal(ExecutiveStageManifest.identity.phaseId, "EX-1:5");
    assert.equal(ExecutiveStageManifest.identity.stageName, "Executive Stage");
    assert.equal(ExecutiveStageManifest.identity.status, "Manifest");
    assert.equal(ExecutiveStageManifest.identity.readiness, "ReadyForPlatform");
    assert.equal(
      ExecutiveStageManifest.identity.sourceValidation,
      "EX-1:4/ExecutiveStageValidation",
    );
    assert.equal(
      ExecutiveStageManifest.nextPhase,
      "EX-1:6 — Executive Stage Platform",
    );
  });

  it("declares exactly four upstream dependencies and consumes Validation", () => {
    assert.equal(ExecutiveStageManifest.validation, ExecutiveStageValidation);
    assert.equal(ExecutiveStageManifest.dependencies.length, 4);
    assert.deepEqual(
      ExecutiveStageManifest.dependencies.map((item) => item.phaseId),
      [...EXPECTED_UPSTREAM],
    );
    assert.equal(ExecutiveStageManifest.dependencyCatalog.downstreamCount, 0);
    assert.equal(
      ExecutiveStageManifest.dependencyCatalog.downstreamDependenciesPermitted,
      false,
    );
    assert.deepEqual([...ExecutiveStageManifest.upstreamDependencies], [
      "EX-1:1 — Executive Stage Foundation",
      "EX-1:2 — Executive Stage Registry",
      "EX-1:3 — Executive Stage Model",
      "EX-1:4 — Executive Stage Validation",
    ]);
  });

  it("publishes eight capabilities, eight guarantees, and complete baselines", () => {
    assert.deepEqual(
      [...ExecutiveStageManifest.capabilityNames],
      [...EXPECTED_CAPABILITIES],
    );
    assert.deepEqual(
      [...ExecutiveStageManifest.guaranteeNames],
      [...EXPECTED_GUARANTEES],
    );
    assert.equal(ExecutiveStageManifest.baselines.upstreamDependencies, 4);
    assert.equal(ExecutiveStageManifest.baselines.stageCapabilities, 8);
    assert.equal(ExecutiveStageManifest.baselines.stageGuarantees, 8);
    assert.equal(ExecutiveStageManifest.baselines.validationCategories, 10);
    assert.equal(ExecutiveStageManifest.baselines.canonicalValidationRules, 40);
    assert.equal(ExecutiveStageManifest.baselines.compatibilityTargets, 8);
    assert.equal(ExecutiveStageManifest.baselines.extensionPoints, 8);

    assert.equal(
      ExecutiveStageManifest.validationSummary.validationStatus,
      "Complete",
    );
    assert.equal(
      ExecutiveStageManifest.validationSummary.storesIndividualRuleExecution,
      false,
    );

    assertUnique(
      ExecutiveStageManifest.capabilities.map((item) => item.capabilityId),
      "capability ids",
    );
    assertUnique(
      ExecutiveStageManifest.guarantees.map((item) => item.guaranteeId),
      "guarantee ids",
    );
  });

  it("publishes public contracts, compatibility, and extension points", () => {
    assert.deepEqual(
      ExecutiveStageManifest.publicContracts.map((item) => item.name),
      [
        "ExecutiveStage",
        "ExecutiveShell",
        "StageSurface",
        "StageObject",
        "StageFocus",
        "StageInteraction",
      ],
    );
    assert.deepEqual(
      ExecutiveStageManifest.compatibility.map((item) => item.name),
      [...EXPECTED_COMPATIBILITY],
    );
    assert.deepEqual(
      ExecutiveStageManifest.extensionPoints.map((item) => item.name),
      [...EXPECTED_EXTENSIONS],
    );
    assert.ok(
      ExecutiveStageManifest.compatibility.every(
        (item) => item.impliesDependency === false,
      ),
    );
    assert.ok(
      ExecutiveStageManifest.extensionPoints.every(
        (item) => item.existingIdentitiesRemainStable === true,
      ),
    );
    assert.deepEqual([...ExecutiveStageManifest.sections], [
      "Identity",
      "Version",
      "Status",
      "Dependencies",
      "Public Contracts",
      "Stage Capabilities",
      "Stage Guarantees",
      "Validation Summary",
      "Compatibility",
      "Extension Points",
      "Metadata",
    ]);
  });

  it("remains metadata-only without rendering or Runtime implementation", () => {
    assert.equal(ExecutiveStageManifest.metadataOnly, true);
    assert.equal(ExecutiveStageManifest.rendersStage, false);
    assert.equal(ExecutiveStageManifest.holdsRuntimeState, false);
    assert.equal(ExecutiveStageManifest.createsRuntimeObjects, false);
    assert.equal(ExecutiveStageManifest.reactBehavior, false);
    assert.equal(ExecutiveStageManifest.nextJsBehavior, false);
    assert.equal(ExecutiveStageManifest.referencesPlatform, false);
    assert.ok(
      ExecutiveStageManifest.prohibitedSurfaces.includes("render the Stage"),
    );
    assert.ok(
      ExecutiveStageManifest.prohibitedSurfaces.includes("React rendering"),
    );

    const summary = getExecutiveStageManifestSummary();
    assert.equal(summary.readiness, "ReadyForPlatform");
    assert.equal(summary.capabilityCount, 8);
    assert.equal(summary.guaranteeCount, 8);
    assert.equal(getExecutiveStageManifest(), ExecutiveStageManifest);
  });

  it("forbids React, Platform, and non-Validation upstream imports in Manifest sources", () => {
    for (const file of EX15_FILES) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
      for (const pattern of PROHIBITED_SOURCE_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
    }
    const aggregate = readFileSync(`${HERE}/executiveStageManifest.ts`, "utf8");
    assert.match(
      aggregate,
      /from ["']\.\/executiveStageValidation\.ts["']/,
    );
  });
});
