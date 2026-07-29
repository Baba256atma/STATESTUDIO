/**
 * RTC-1:4 — Executive Context Runtime Validation Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Validation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveContextRuntimeModel } from "./executiveContextRuntimeModel.ts";
import * as ValidationModule from "./executiveContextRuntimeValidation.ts";
import {
  ExecutiveContextRuntimeValidation,
  ExecutiveContextRuntimeValidationId,
  ExecutiveContextRuntimeValidationName,
  ExecutiveContextRuntimeValidationNamespace,
  ExecutiveContextRuntimeValidationReadiness,
  ExecutiveContextRuntimeValidationStatus,
  ExecutiveContextRuntimeValidationVersion,
  getExecutiveContextRuntimeValidationSummary,
} from "./executiveContextRuntimeValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC14_FILES = Object.freeze([
  "executiveContextRuntimeValidation.ts",
  "executiveContextValidationRules.ts",
  "executiveContextValidationCategories.ts",
  "executiveContextValidationResult.ts",
  "executiveContextValidationSeverity.ts",
  "executiveContextIntegrityValidation.ts",
  "executiveContextValidationRegistry.ts",
  "executiveContextRuntimeValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeValidationId",
  "ExecutiveContextRuntimeValidationVersion",
  "ExecutiveContextRuntimeValidationName",
  "ExecutiveContextRuntimeValidationNamespace",
  "ExecutiveContextRuntimeValidationStatus",
  "ExecutiveContextRuntimeValidationReadiness",
  "ExecutiveContextRuntimeValidation",
  "getExecutiveContextRuntimeValidationSummary",
  "getExecutiveContextRuntimeValidation",
  "ExecutiveContextRuntimeValidationIdentity",
  "ExecutiveContextRuntimeValidationNextPhase",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Structure",
  "Ownership",
  "References",
  "Lifecycle",
  "Workspace",
  "Timeline",
  "Focus",
  "Metadata",
  "Integrity",
] as const);

const EXPECTED_SEVERITIES = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
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
  /from ["']\.\/executiveContext(Model|WorkspaceModel|PackModel|TimelineModel|StageModel)\.ts["']/,
  /from ["']\.\/executiveRuntimeRelationships\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:4 Executive Context Runtime Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(RTC14_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC14_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC14_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !RTC14_FILES.some((name) =>
        /Manifest|Platform|Certification|Freeze/i.test(name)
      ),
      "Validation artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in ValidationModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Validation identity and ReadyForManifest readiness", () => {
    assert.equal(
      ExecutiveContextRuntimeValidationId,
      "RTC-1:4/ExecutiveContextRuntimeValidation",
    );
    assert.equal(ExecutiveContextRuntimeValidationVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeValidationName,
      "Executive Context Runtime Validation",
    );
    assert.equal(
      ExecutiveContextRuntimeValidationNamespace,
      "nexora.rtc.executive.context.validation",
    );
    assert.equal(ExecutiveContextRuntimeValidationStatus, "Validation");
    assert.equal(
      ExecutiveContextRuntimeValidationReadiness,
      "ReadyForManifest",
    );

    const validation = ExecutiveContextRuntimeValidation;
    assert.equal(validation.identity.phaseId, "RTC-1:4");
    assert.equal(validation.identity.status, "Validation");
    assert.equal(validation.identity.readiness, "ReadyForManifest");
    assert.equal(
      validation.identity.sourceModel,
      "RTC-1:3/ExecutiveContextRuntimeModel",
    );
    assert.equal(validation.status, "Validation");
    assert.equal(validation.readiness, "ReadyForManifest");
    assert.equal(
      validation.nextPhase,
      "RTC-1:5 — Executive Context Runtime Manifest",
    );
  });

  it("consumes RTC-1:3 Model and declares ten categories in fixed order", () => {
    const validation = ExecutiveContextRuntimeValidation;
    assert.equal(validation.model, ExecutiveContextRuntimeModel);
    assert.deepEqual([...validation.categoryNames], [...EXPECTED_CATEGORIES]);
    assert.deepEqual([...validation.executionOrder], [...EXPECTED_CATEGORIES]);
    assert.deepEqual(
      validation.categories.map((item) => item.categoryName),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      validation.categories.map((item) => item.executionOrder),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    );
    assert.ok(validation.categories.every((item) => item.removable === false));
  });

  it("publishes exactly forty unique canonical validation rules", () => {
    const validation = ExecutiveContextRuntimeValidation;
    assert.equal(validation.rules.length, 40);
    assert.equal(validation.registry.ruleCount, 40);
    assert.equal(validation.statistics.ruleCount, 40);

    assertUnique(
      validation.rules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      validation.rules.map((item) => item.ruleKey),
      "rule keys",
    );

    assert.deepEqual(
      validation.rules.map((item) => item.executionOrder),
      validation.rules.map((_, index) => index + 1),
    );

    for (const category of EXPECTED_CATEGORIES) {
      assert.equal(
        validation.registry.rulesByCategory[category].length,
        4,
        `${category} must contain exactly 4 rules`,
      );
    }

    assert.ok(validation.rules.every((item) => item.evaluatesOnly === true));
    assert.ok(validation.rules.every((item) => item.mutatesState === false));
    assert.ok(validation.rules.every((item) => item.executable === false));
    assert.ok(validation.rules.every((item) => Object.isFrozen(item)));

    assert.equal(validation.integrity.ruleCount, 4);
    assert.ok(validation.integrity.coversActiveContext);
    assert.ok(validation.integrity.coversStage);
    assert.ok(validation.integrity.coversJournal);
    assert.ok(validation.integrity.coversTimeline);
    assert.ok(validation.integrity.coversDirector);
    assert.ok(validation.integrity.coversAdvisor);
  });

  it("defines complete severity and structured result models", () => {
    const validation = ExecutiveContextRuntimeValidation;

    assert.deepEqual([...validation.severityNames], [...EXPECTED_SEVERITIES]);
    assert.deepEqual(
      [...validation.activationBlockingSeverities],
      ["Error", "Critical"],
    );
    assert.ok(
      validation.severities.every((item) =>
        item.preventsActivation ===
          (item.level === "Error" || item.level === "Critical")
      ),
    );

    assert.equal(validation.resultModel.fieldCount, 6);
    assert.deepEqual(
      validation.resultModel.fields.map((item) => item.fieldName),
      ["identity", "status", "ruleResults", "warnings", "errors", "timestamp"],
    );
    assert.equal(validation.resultModel.immutableResults, true);
    assert.equal(
      validation.resultModel.usesExceptionsAsBusinessValidation,
      false,
    );

    assert.equal(validation.statuses.length, 4);
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Passed" && item.activationPermitted,
      ),
    );
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Failed" && !item.activationPermitted,
      ),
    );
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Blocked" && !item.activationPermitted,
      ),
    );
  });

  it("is read-only with zero prohibited runtime behaviors", () => {
    const validation = ExecutiveContextRuntimeValidation;
    assert.equal(Object.isFrozen(validation), true);
    assert.equal(Object.isFrozen(validation.registry), true);
    assert.equal(Object.isFrozen(validation.rules), true);

    assert.equal(validation.metadataOnly, true);
    assert.equal(validation.evaluatesOnly, true);
    assert.equal(validation.readOnly, true);
    assert.equal(validation.activatesContexts, false);
    assert.equal(validation.modifiesRuntimeState, false);
    assert.equal(validation.executesTransitions, false);
    assert.equal(validation.renderingBehavior, false);
    assert.equal(validation.communicatesWithReact, false);
    assert.equal(validation.invokesAi, false);
    assert.equal(validation.accessesDatabases, false);
    assert.equal(validation.calculatesBusinessMetrics, false);
    assert.equal(validation.usesExceptionsAsBusinessValidation, false);
    assert.equal(validation.executableValidation, false);
    assert.equal(validation.reactBehavior, false);
    assert.equal(validation.nextJsBehavior, false);
    assert.equal(validation.manifestPhase, false);
    assert.equal(validation.platformPhase, false);

    assert.ok(validation.prohibitedSurfaces.includes("activate contexts"));
    assert.ok(validation.prohibitedSurfaces.includes("modify runtime state"));
    assert.ok(validation.prohibitedSurfaces.includes("invoke AI"));
    assert.equal(validation.principles.length, 5);
    assert.ok(validation.guarantees.includes("activation safety"));
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = RTC14_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.doesNotMatch(source, /\bfrom ["']react/);
      assert.doesNotMatch(source, /\bfrom ["']next/);
    }

    const aggregateSource = readFileSync(
      new URL("./executiveContextRuntimeValidation.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeModel\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const validation = ExecutiveContextRuntimeValidation;
    const summaryA = getExecutiveContextRuntimeValidationSummary();
    const summaryB = getExecutiveContextRuntimeValidationSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, ExecutiveContextRuntimeValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.categoryCount, 10);
    assert.equal(summaryA.ruleCount, 40);
    assert.equal(summaryA.severityCount, 4);
    assert.equal(summaryA.integrityRuleCount, 4);
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:5 — Executive Context Runtime Manifest",
    );

    assert.equal(validation.statistics.ruleCount, validation.rules.length);
    assert.equal(
      validation.statistics.categoryCount,
      validation.categories.length,
    );
    assert.equal(
      validation.statistics.blockingRuleCount,
      validation.rules.filter((item) => item.preventsActivation).length,
    );
    assert.equal(
      validation.registry.statistics.ruleCount,
      validation.rules.length,
    );
  });
});
