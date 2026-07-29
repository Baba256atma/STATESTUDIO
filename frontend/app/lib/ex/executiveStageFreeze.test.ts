/**
 * EX-1:8 — Executive Stage Freeze Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Freeze.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveStageCertification } from "./executiveStageCertification.ts";
import * as FreezeModule from "./executiveStageFreeze.ts";
import {
  EXECUTIVE_STAGE_LOCK,
  ExecutiveStageFreeze,
  ExecutiveStageFreezeId,
  ExecutiveStageFreezeName,
  ExecutiveStageFreezeNamespace,
  ExecutiveStageFreezeReadiness,
  ExecutiveStageFreezeStatus,
  ExecutiveStageFreezeVersion,
  getExecutiveStageFreeze,
  getExecutiveStageFreezeSummary,
} from "./executiveStageFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX18_FILES = Object.freeze([
  "executiveStageFreeze.ts",
  "executiveStageFreezeRegistry.ts",
  "executiveStageArchitecturalLocks.ts",
  "executiveStageFrozenBaselines.ts",
  "executiveStageCompatibility.ts",
  "executiveStageExtensions.ts",
  "executiveStageReleaseMetadata.ts",
  "executiveStageFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageFreezeId",
  "ExecutiveStageFreezeVersion",
  "ExecutiveStageFreezeName",
  "ExecutiveStageFreezeNamespace",
  "ExecutiveStageFreezeStatus",
  "ExecutiveStageFreezeReadiness",
  "ExecutiveStageFreeze",
  "getExecutiveStageFreezeSummary",
  "getExecutiveStageFreeze",
  "ExecutiveStageFreezeIdentity",
  "ExecutiveStageFreezeLock",
  "ExecutiveStageFreezeNextPhase",
  "EXECUTIVE_STAGE_LOCK",
] as const);

const EXPECTED_LOCKS = Object.freeze([
  "Identity Lock",
  "Architecture Lock",
  "Registry Lock",
  "Model Lock",
  "Validation Lock",
  "Manifest Lock",
  "Platform Lock",
  "Certification Lock",
  "Runtime Compatibility Lock",
  "Public API Lock",
  "Dependency Lock",
  "Release Lock",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "Architecture",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Public Contracts",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "RTC-1 Executive Context Runtime",
  "EX-2 Executive Journal",
  "EX-3 Executive Timeline",
  "EX-4 Executive Interaction",
  "Workspace Layer",
  "Assistant Layer",
  "Director Layer",
  "EVE Visualization Layer",
] as const);

const EXPECTED_EXTENSIONS = Object.freeze([
  "Object Types",
  "Overlay Types",
  "Interaction Types",
  "Relationship Types",
  "Metadata Fields",
  "Visual States",
  "Viewport Features",
  "Future Stage Modules",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ExecutiveStage",
  "ExecutiveShell",
  "StageSurface",
  "StageObject",
  "StageRelationship",
  "StageFocus",
  "StageInteraction",
  "StageOverlay",
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
  /from ["']\.\/executiveStageValidation\.ts["']/,
  /from ["']\.\/executiveStageManifest\.ts["']/,
  /from ["']\.\/executiveStagePlatform\.ts["']/,
  /from ["']\.\/executiveStageCertification(Domains|Gates|Result|Registry|Audits|Metadata)\.ts["']/,
]);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bcreateElement\b/,
  /\buseState\b/,
  /\buseEffect\b/,
  /\bjsx\b/i,
  /\brequestAnimationFrame\b/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EX-1:8 Executive Stage Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(EX18_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX18_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX18_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !EX18_FILES.some((name) => /PublicIndex/i.test(name)),
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
    assert.equal(ExecutiveStageFreezeId, "EX-1:8/ExecutiveStageFreeze");
    assert.equal(ExecutiveStageFreezeName, "Executive Stage Freeze");
    assert.equal(ExecutiveStageFreezeVersion, "1.0.0");
    assert.equal(
      ExecutiveStageFreezeNamespace,
      "nexora.ex.executive.stage.freeze",
    );
    assert.equal(ExecutiveStageFreezeStatus, "Freeze");
    assert.equal(ExecutiveStageFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(EXECUTIVE_STAGE_LOCK, "EX-1-EXECUTIVE-STAGE-LOCKED");

    assert.equal(ExecutiveStageFreeze.identity.phaseId, "EX-1:8");
    assert.equal(ExecutiveStageFreeze.identity.status, "Freeze");
    assert.equal(
      ExecutiveStageFreeze.identity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveStageFreeze.lockIdentifier,
      "EX-1-EXECUTIVE-STAGE-LOCKED",
    );
    assert.equal(ExecutiveStageFreeze.lock.oneLockPerRelease, true);
    assert.equal(ExecutiveStageFreeze.lock.mutationAllowed, false);
    assert.equal(
      ExecutiveStageFreeze.nextPhase,
      "EX-1:9 — Executive Stage Public Index",
    );
  });

  it("consumes Certification and declares twelve locks with eight baselines", () => {
    assert.equal(
      ExecutiveStageFreeze.certification,
      ExecutiveStageCertification,
    );
    assert.equal(
      ExecutiveStageCertification.freezeProgressionStatus,
      "Certified",
    );
    assert.equal(ExecutiveStageFreeze.onlyCertifiedArtifactsMayEnter, true);

    assert.equal(ExecutiveStageFreeze.architecturalLocks.length, 12);
    assert.deepEqual(
      [...ExecutiveStageFreeze.architecturalLockNames],
      [...EXPECTED_LOCKS],
    );
    assert.ok(
      ExecutiveStageFreeze.architecturalLocks.every(
        (item) => item.lockStatus === "Locked",
      ),
    );

    assert.equal(ExecutiveStageFreeze.baselines.length, 8);
    assert.deepEqual(
      [...ExecutiveStageFreeze.baselineNames],
      [...EXPECTED_BASELINES],
    );
    assert.ok(ExecutiveStageFreeze.baselines.every((item) => item.frozen));

    assertUnique(
      ExecutiveStageFreeze.architecturalLocks.map((item) => item.lockId),
      "architectural lock IDs",
    );
    assertUnique(
      ExecutiveStageFreeze.baselines.map((item) => item.baselineId),
      "baseline IDs",
    );
  });

  it("declares compatibility, extensions, and frozen public contracts", () => {
    assert.deepEqual(
      [...ExecutiveStageFreeze.compatibilityNames],
      [...EXPECTED_COMPATIBILITY],
    );
    assert.deepEqual(
      [...ExecutiveStageFreeze.extensionCategoryNames],
      [...EXPECTED_EXTENSIONS],
    );
    assert.deepEqual(
      [...ExecutiveStageFreeze.publicContractNames],
      [...EXPECTED_CONTRACTS],
    );
    assert.equal(ExecutiveStageFreeze.baselinesPublished.architecturalLocks, 12);
    assert.equal(ExecutiveStageFreeze.baselinesPublished.frozenBaselines, 8);
    assert.equal(
      ExecutiveStageFreeze.baselinesPublished.compatibilityTargets,
      8,
    );
    assert.equal(
      ExecutiveStageFreeze.baselinesPublished.extensionCategories,
      8,
    );
    assert.equal(
      ExecutiveStageFreeze.baselinesPublished.publicContractIdentities,
      8,
    );
    assert.equal(
      ExecutiveStageFreeze.baselinesPublished.releaseMetadataFields,
      7,
    );
    assert.equal(
      ExecutiveStageFreeze.runtimeCompatibility.embedsRuntimeImplementation,
      false,
    );
    assert.ok(
      ExecutiveStageFreeze.extensions.existingIdentitiesRemainStable,
    );
  });

  it("publishes immutable release metadata and remains non-executable", () => {
    assert.equal(ExecutiveStageFreeze.releaseMetadataFields.length, 7);
    assert.deepEqual(
      ExecutiveStageFreeze.releaseMetadataFields.map((item) => item.fieldName),
      [
        "Release Identity",
        "Architecture Version",
        "Freeze Version",
        "Platform Version",
        "Certification Version",
        "Release Timestamp",
        "Release Status",
      ],
    );
    assert.deepEqual([...ExecutiveStageFreeze.releaseStatuses], [
      "Released",
      "Certified",
      "Frozen",
      "Stable",
    ]);
    assert.equal(ExecutiveStageFreeze.sealed, true);
    assert.equal(ExecutiveStageFreeze.mutationAllowed, false);
    assert.equal(ExecutiveStageFreeze.introducesFunctionalBehaviour, false);
    assert.equal(ExecutiveStageFreeze.executesPlatformServices, false);
    assert.equal(ExecutiveStageFreeze.modifiesRuntime, false);
    assert.equal(ExecutiveStageFreeze.rendersStage, false);

    const summary = getExecutiveStageFreezeSummary();
    assert.equal(summary.readiness, "ReadyForPublicIndex");
    assert.equal(summary.lockIdentifier, EXECUTIVE_STAGE_LOCK);
    assert.equal(summary.sealed, true);
    assert.equal(getExecutiveStageFreeze(), ExecutiveStageFreeze);
  });

  it("forbids React and non-Certification upstream imports in Freeze sources", () => {
    for (const file of EX18_FILES) {
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
    const aggregate = readFileSync(`${HERE}/executiveStageFreeze.ts`, "utf8");
    assert.match(
      aggregate,
      /from ["']\.\/executiveStageCertification\.ts["']/,
    );
  });
});
