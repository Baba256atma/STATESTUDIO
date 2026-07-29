/**
 * EX-1:7 — Executive Stage Certification Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Certification.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as CertificationModule from "./executiveStageCertification.ts";
import {
  ExecutiveStageCertification,
  ExecutiveStageCertificationId,
  ExecutiveStageCertificationName,
  ExecutiveStageCertificationNamespace,
  ExecutiveStageCertificationReadiness,
  ExecutiveStageCertificationStatus,
  ExecutiveStageCertificationVersion,
  getExecutiveStageCertification,
  getExecutiveStageCertificationSummary,
} from "./executiveStageCertification.ts";
import { ExecutiveStagePlatform } from "./executiveStagePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX17_FILES = Object.freeze([
  "executiveStageCertification.ts",
  "executiveStageCertificationDomains.ts",
  "executiveStageCertificationGates.ts",
  "executiveStageCertificationResult.ts",
  "executiveStageCertificationRegistry.ts",
  "executiveStageCertificationAudits.ts",
  "executiveStageCertificationMetadata.ts",
  "executiveStageCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageCertificationId",
  "ExecutiveStageCertificationVersion",
  "ExecutiveStageCertificationName",
  "ExecutiveStageCertificationNamespace",
  "ExecutiveStageCertificationStatus",
  "ExecutiveStageCertificationReadiness",
  "ExecutiveStageCertification",
  "getExecutiveStageCertificationSummary",
  "getExecutiveStageCertification",
  "ExecutiveStageCertificationIdentity",
  "ExecutiveStageCertificationNextPhase",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Architecture",
  "Identity",
  "Dependencies",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Runtime Compatibility",
  "Public API",
  "Quality",
  "Release Readiness",
] as const);

const EXPECTED_GATES = Object.freeze([
  "Architecture Gate",
  "Identity Gate",
  "Registry Gate",
  "Model Gate",
  "Validation Gate",
  "Manifest Gate",
  "Platform Gate",
  "Runtime Gate",
  "Dependency Gate",
  "API Gate",
  "Quality Gate",
  "Test Gate",
  "TypeScript Gate",
  "ESLint Gate",
  "Compatibility Gate",
  "Release Gate",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Pending",
  "Running",
  "Passed",
  "Failed",
  "Certified",
] as const);

const EXPECTED_QUALITY_GATES = Object.freeze([
  "Strict TypeScript",
  "ESLint",
  "Unit Tests",
  "Architecture Tests",
  "Dependency Audits",
  "Public API Audits",
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
  /from ["']\.\/executiveStage(PlatformService|LifecycleService|RuntimeBridge|EventBus|InspectionService|PlatformMetadata)\.ts["']/,
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

describe("EX-1:7 Executive Stage Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(EX17_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX17_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX17_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !EX17_FILES.some((name) => /Freeze|PublicIndex/i.test(name)),
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
      ExecutiveStageCertificationId,
      "EX-1:7/ExecutiveStageCertification",
    );
    assert.equal(
      ExecutiveStageCertificationName,
      "Executive Stage Certification",
    );
    assert.equal(ExecutiveStageCertificationVersion, "1.0.0");
    assert.equal(
      ExecutiveStageCertificationNamespace,
      "nexora.ex.executive.stage.certification",
    );
    assert.equal(ExecutiveStageCertificationStatus, "Certification");
    assert.equal(ExecutiveStageCertificationReadiness, "ReadyForFreeze");
    assert.equal(ExecutiveStageCertification.identity.status, "Certification");
    assert.equal(
      ExecutiveStageCertification.identity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveStageCertification.identity.sourcePlatform,
      "EX-1:6/ExecutiveStagePlatform",
    );
    assert.equal(
      ExecutiveStageCertification.nextPhase,
      "EX-1:8 — Executive Stage Freeze",
    );
  });

  it("consumes Platform and defines twelve domains with sixteen gates", () => {
    assert.equal(ExecutiveStageCertification.platform, ExecutiveStagePlatform);
    assert.deepEqual(
      [...ExecutiveStageCertification.domainNames],
      [...EXPECTED_DOMAINS],
    );
    assert.deepEqual(
      [...ExecutiveStageCertification.gateNames],
      [...EXPECTED_GATES],
    );
    assert.equal(ExecutiveStageCertification.baselines.certificationDomains, 12);
    assert.equal(ExecutiveStageCertification.baselines.certificationGates, 16);
    assert.ok(
      ExecutiveStageCertification.domains.every(
        (item) => item.mustPassIndependently === true,
      ),
    );
    assert.ok(
      ExecutiveStageCertification.gates.every(
        (item) => item.modifiesPlatform === false,
      ),
    );
  });

  it("defines Certified-only Freeze progression and complete baselines", () => {
    assert.deepEqual(
      [...ExecutiveStageCertification.statusNames],
      [...EXPECTED_STATUSES],
    );
    assert.equal(
      ExecutiveStageCertification.freezeProgressionStatus,
      "Certified",
    );
    assert.ok(
      ExecutiveStageCertification.statuses.every((item) =>
        item.status === "Certified"
          ? item.allowsFreezeProgression === true
          : item.allowsFreezeProgression === false
      ),
    );

    assert.equal(ExecutiveStageCertification.baselines.qualityGates, 6);
    assert.equal(
      ExecutiveStageCertification.baselines.runtimeCompatibilityChecks,
      6,
    );
    assert.equal(ExecutiveStageCertification.baselines.certificationStatuses, 5);
    assert.equal(
      ExecutiveStageCertification.baselines.certificationResultSections,
      7,
    );

    assert.deepEqual(
      ExecutiveStageCertification.qualityGates.map((item) => item.name),
      [...EXPECTED_QUALITY_GATES],
    );
    assert.equal(ExecutiveStageCertification.resultModel.fieldCount, 7);
    assert.deepEqual(
      ExecutiveStageCertification.resultModel.fields.map(
        (item) => item.fieldName,
      ),
      [
        "identity",
        "status",
        "certifiedDomains",
        "warnings",
        "errors",
        "timestamp",
        "platformVersion",
      ],
    );
  });

  it("includes Runtime compatibility and Public API certification audits", () => {
    assert.equal(
      ExecutiveStageCertification.runtimeCompatibilityChecks.length,
      6,
    );
    assert.ok(
      ExecutiveStageCertification.runtimeCompatibilityChecks.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      ExecutiveStageCertification.audits.publicApiAudits.includes(
        "stable API surface",
      ),
    );
    assert.ok(
      ExecutiveStageCertification.audits.architectureAudits.includes(
        "canonical architecture",
      ),
    );
    assert.equal(ExecutiveStageCertification.audits.executesRuntime, false);
    assert.equal(ExecutiveStageCertification.audits.readOnly, true);
  });

  it("remains read-only and never modifies platform or Runtime", () => {
    assert.equal(ExecutiveStageCertification.readOnly, true);
    assert.equal(ExecutiveStageCertification.evaluatesOnly, true);
    assert.equal(ExecutiveStageCertification.modifiesPlatform, false);
    assert.equal(ExecutiveStageCertification.modifiesSourceCode, false);
    assert.equal(ExecutiveStageCertification.executesRuntimeLogic, false);
    assert.equal(ExecutiveStageCertification.rendersStage, false);
    assert.equal(ExecutiveStageCertification.invokesAi, false);
    assert.ok(
      ExecutiveStageCertification.prohibitedSurfaces.includes(
        "render the Stage",
      ),
    );

    const summary = getExecutiveStageCertificationSummary();
    assert.equal(summary.readiness, "ReadyForFreeze");
    assert.equal(summary.freezeProgressionStatus, "Certified");
    assert.equal(summary.readOnly, true);
    assert.equal(getExecutiveStageCertification(), ExecutiveStageCertification);

    assertUnique(
      ExecutiveStageCertification.domains.map((item) => item.domainId),
      "domain ids",
    );
    assertUnique(
      ExecutiveStageCertification.gates.map((item) => item.gateId),
      "gate ids",
    );
  });

  it("forbids React and non-Platform upstream imports in Certification sources", () => {
    for (const file of EX17_FILES) {
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
    const aggregate = readFileSync(
      `${HERE}/executiveStageCertification.ts`,
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/executiveStagePlatform\.ts["']/);
  });
});
