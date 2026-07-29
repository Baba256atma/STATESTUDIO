/**
 * RTC-1:7 — Executive Context Runtime Certification Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Certification.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as CertificationModule from "./executiveContextRuntimeCertification.ts";
import {
  ExecutiveContextRuntimeCertification,
  ExecutiveContextRuntimeCertificationId,
  ExecutiveContextRuntimeCertificationName,
  ExecutiveContextRuntimeCertificationNamespace,
  ExecutiveContextRuntimeCertificationReadiness,
  ExecutiveContextRuntimeCertificationStatus,
  ExecutiveContextRuntimeCertificationVersion,
  getExecutiveContextRuntimeCertificationSummary,
} from "./executiveContextRuntimeCertification.ts";
import { ExecutiveContextRuntimePlatform } from "./executiveContextRuntimePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC17_FILES = Object.freeze([
  "executiveContextRuntimeCertification.ts",
  "executiveContextCertificationCategories.ts",
  "executiveContextCertificationGates.ts",
  "executiveContextCertificationResult.ts",
  "executiveContextCertificationStatus.ts",
  "executiveContextCertificationRegistry.ts",
  "executiveContextCertificationMetadata.ts",
  "executiveContextRuntimeCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeCertificationId",
  "ExecutiveContextRuntimeCertificationVersion",
  "ExecutiveContextRuntimeCertificationName",
  "ExecutiveContextRuntimeCertificationNamespace",
  "ExecutiveContextRuntimeCertificationStatus",
  "ExecutiveContextRuntimeCertificationReadiness",
  "ExecutiveContextRuntimeCertification",
  "getExecutiveContextRuntimeCertificationSummary",
  "getExecutiveContextRuntimeCertification",
  "ExecutiveContextCertificationIdentity",
  "ExecutiveContextRuntimeCertificationNextPhase",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Architecture",
  "Identity",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Contracts",
  "Dependencies",
  "Quality",
  "Compatibility",
  "ReleaseReadiness",
] as const);

const EXPECTED_GATES = Object.freeze([
  "FoundationComplete",
  "RegistryComplete",
  "ModelComplete",
  "ValidationComplete",
  "ManifestComplete",
  "PlatformComplete",
  "ArchitectureVerified",
  "IdentityVerified",
  "ContractsStable",
  "DependenciesVerified",
  "QualityVerified",
  "CompatibilityVerified",
  "ReleaseMetadataVerified",
  "TestsPassed",
  "LintPassed",
  "ReadyForFreeze",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Pending",
  "Running",
  "Passed",
  "PassedWithWarnings",
  "Failed",
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
  /from ["']\.\/executiveContextPlatform(Services|Events|Lifecycle|Inspection|Health|Metadata)\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:7 Executive Context Runtime Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(RTC17_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC17_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC17_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !RTC17_FILES.some((name) => /Freeze|PublicIndex/i.test(name)),
      "Certification artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in CertificationModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Certification identity and ReadyForFreeze readiness", () => {
    assert.equal(
      ExecutiveContextRuntimeCertificationId,
      "RTC-1:7/ExecutiveContextRuntimeCertification",
    );
    assert.equal(ExecutiveContextRuntimeCertificationVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeCertificationName,
      "Executive Context Runtime Certification",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationNamespace,
      "nexora.rtc.executive.context.certification",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationStatus,
      "Certification",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationReadiness,
      "ReadyForFreeze",
    );

    const certification = ExecutiveContextRuntimeCertification;
    assert.equal(certification.identity.phaseId, "RTC-1:7");
    assert.equal(certification.identity.status, "Certification");
    assert.equal(certification.identity.readiness, "ReadyForFreeze");
    assert.equal(
      certification.identity.sourcePlatform,
      "RTC-1:6/ExecutiveContextRuntimePlatform",
    );
    assert.equal(certification.status, "Certification");
    assert.equal(certification.readiness, "ReadyForFreeze");
    assert.equal(
      certification.nextPhase,
      "RTC-1:8 — Executive Context Runtime Freeze",
    );
  });

  it("consumes RTC-1:6 Platform and defines twelve categories with sixteen gates", () => {
    const certification = ExecutiveContextRuntimeCertification;
    assert.equal(certification.platform, ExecutiveContextRuntimePlatform);

    assert.equal(certification.categories.length, 12);
    assert.deepEqual([...certification.categoryNames], [...EXPECTED_CATEGORIES]);
    assert.ok(certification.categories.every((item) => item.removable === false));

    assert.equal(certification.gates.length, 16);
    assert.deepEqual([...certification.gateNames], [...EXPECTED_GATES]);
    assert.deepEqual(
      certification.gates.map((item) => item.order),
      certification.gates.map((_, index) => index + 1),
    );
    assert.ok(certification.gates.every((item) => item.deterministic === true));
    assert.ok(certification.gates.every((item) => item.modifiesRuntime === false));

    assertUnique(
      certification.categories.map((item) => item.categoryId),
      "category IDs",
    );
    assertUnique(
      certification.gates.map((item) => item.gateId),
      "gate IDs",
    );
  });

  it("defines complete status and immutable result models", () => {
    const certification = ExecutiveContextRuntimeCertification;

    assert.deepEqual([...certification.statusNames], [...EXPECTED_STATUSES]);
    assert.equal(certification.freezeProgressionStatus, "Passed");
    assert.ok(
      certification.statuses.some(
        (item) => item.status === "Passed" && item.allowsFreezeProgression,
      ),
    );
    assert.ok(
      certification.statuses.every(
        (item) =>
          item.allowsFreezeProgression === (item.status === "Passed"),
      ),
    );

    assert.equal(certification.resultModel.fieldCount, 8);
    assert.deepEqual(
      certification.resultModel.fields.map((item) => item.fieldName),
      [
        "identity",
        "status",
        "certificationCategories",
        "passedGates",
        "warnings",
        "errors",
        "timestamp",
        "version",
      ],
    );
    assert.equal(certification.resultModel.immutableResults, true);
    assert.equal(
      certification.resultModel.archivedForReleaseTraceability,
      true,
    );
  });

  it("verifies architecture, identity, API stability, and release readiness", () => {
    const certification = ExecutiveContextRuntimeCertification;

    assert.ok(
      certification.architecturalCompliance.includes(
        "canonical architecture order",
      ),
    );
    assert.ok(
      certification.architecturalCompliance.includes(
        "Runtime boundary compliance",
      ),
    );
    assert.ok(
      certification.identityCompliance.includes("unique Runtime identity"),
    );
    assert.ok(
      certification.apiStability.includes("stable public contracts"),
    );
    assert.ok(
      certification.apiStability.includes("stable service identities"),
    );
    assert.ok(
      certification.qualityChecks.includes("strict TypeScript compilation"),
    );
    assert.ok(certification.qualityChecks.includes("ESLint compliance"));

    assert.equal(certification.scope.length, 6);
    assert.deepEqual(
      certification.scope.map((item) => item.phaseId),
      ["RTC-1:1", "RTC-1:2", "RTC-1:3", "RTC-1:4", "RTC-1:5", "RTC-1:6"],
    );
    assert.equal(certification.includesDownstreamModules, false);

    assert.equal(certification.compatibility.length, 6);
    assert.ok(
      certification.compatibility.every((item) => item.contractLevelOnly),
    );
    assert.equal(certification.guarantees.length, 6);
    assert.equal(certification.releaseReadinessConditions.length, 4);
    assert.equal(certification.introducesNewApis, false);
  });

  it("is read-only with zero prohibited runtime behaviors", () => {
    const certification = ExecutiveContextRuntimeCertification;
    assert.equal(Object.isFrozen(certification), true);
    assert.equal(Object.isFrozen(certification.registry), true);
    assert.equal(Object.isFrozen(certification.gates), true);

    assert.equal(certification.metadataOnly, true);
    assert.equal(certification.readOnly, true);
    assert.equal(certification.evaluatesOnly, true);
    assert.equal(certification.addsNewRuntimeCapabilities, false);
    assert.equal(certification.modifiesRuntimeState, false);
    assert.equal(certification.generatesRuntimeCode, false);
    assert.equal(certification.executesBusinessLogic, false);
    assert.equal(certification.renderingBehavior, false);
    assert.equal(certification.invokesAi, false);
    assert.equal(certification.persistsApplicationData, false);
    assert.equal(certification.publishesReleases, false);
    assert.equal(certification.reactBehavior, false);
    assert.equal(certification.nextJsBehavior, false);
    assert.equal(certification.freezePhase, false);
    assert.equal(certification.publicIndexPhase, false);

    assert.ok(
      certification.prohibitedSurfaces.includes("modify Runtime state"),
    );
    assert.ok(certification.prohibitedSurfaces.includes("invoke AI"));
    assert.ok(certification.prohibitedSurfaces.includes("React"));
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = RTC17_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      new URL("./executiveContextRuntimeCertification.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimePlatform\.ts["']/,
    );
  });

  it("preserves deterministic summary and canonical baselines", () => {
    const certification = ExecutiveContextRuntimeCertification;
    const summaryA = getExecutiveContextRuntimeCertificationSummary();
    const summaryB = getExecutiveContextRuntimeCertificationSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(
      summaryA.certificationId,
      ExecutiveContextRuntimeCertificationId,
    );
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.categoryCount, 12);
    assert.equal(summaryA.gateCount, 16);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.guaranteeCount, 6);
    assert.equal(summaryA.compatibilityCount, 6);
    assert.equal(summaryA.upstreamPhaseCount, 6);
    assert.equal(summaryA.freezeProgressionStatus, "Passed");
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:8 — Executive Context Runtime Freeze",
    );

    assert.deepEqual(
      { ...certification.baselines },
      {
        certificationCategories: 12,
        certificationGates: 16,
        certificationStatuses: 5,
        runtimeGuarantees: 6,
        compatibilityTargets: 6,
        upstreamRuntimePhases: 6,
      },
    );
    assert.equal(
      certification.statistics.gateCount,
      certification.gates.length,
    );
    assert.deepEqual(
      [...certification.compositionLayers],
      [
        "Foundation",
        "Registry",
        "Model",
        "Validation",
        "Manifest",
        "Platform",
        "Certification",
      ],
    );
  });
});
