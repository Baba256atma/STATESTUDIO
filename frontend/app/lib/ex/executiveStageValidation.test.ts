/**
 * EX-1:4 — Executive Stage Validation Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Validation.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveStageModel } from "./executiveStageModel.ts";
import * as ValidationModule from "./executiveStageValidation.ts";
import {
  ExecutiveStageValidation,
  ExecutiveStageValidationId,
  ExecutiveStageValidationName,
  ExecutiveStageValidationNamespace,
  ExecutiveStageValidationReadiness,
  ExecutiveStageValidationStatus,
  ExecutiveStageValidationVersion,
  getExecutiveStageValidation,
  getExecutiveStageValidationSummary,
} from "./executiveStageValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX14_FILES = Object.freeze([
  "executiveStageValidation.ts",
  "executiveStageValidationRules.ts",
  "executiveStageValidationCategories.ts",
  "executiveStageValidationResult.ts",
  "executiveStageValidationSeverity.ts",
  "executiveStageIntegrityValidation.ts",
  "executiveStageValidationRegistry.ts",
  "executiveStageValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageValidationId",
  "ExecutiveStageValidationVersion",
  "ExecutiveStageValidationName",
  "ExecutiveStageValidationNamespace",
  "ExecutiveStageValidationStatus",
  "ExecutiveStageValidationReadiness",
  "ExecutiveStageValidation",
  "getExecutiveStageValidationSummary",
  "getExecutiveStageValidation",
  "ExecutiveStageValidationIdentity",
  "ExecutiveStageValidationNextPhase",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Structure",
  "Layers",
  "Objects",
  "Relationships",
  "Focus",
  "Interactions",
  "Runtime Binding",
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
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|rtc)\//,
  /from ["']\.\/executive(StageFoundation|Shell|StageSurface|ObjectLayer|RelationshipLayer|FocusLayer)\.tsx["']/,
  /from ["']\.\/executiveStageTypes\.ts["']/,
  /from ["']\.\/executiveStageRegistry\.ts["']/,
  /from ["']\.\/executiveStage(Layer|Object|Interaction|Layout|Overlay)Registry\.ts["']/,
  /from ["']\.\/executiveStageRegistryMetadata\.ts["']/,
  /from ["']\.\/executiveStage(Surface|Layer|Object|Relationship|Interaction)Model\.ts["']/,
  /from ["']\.\/executiveStageRuntimeBindings\.ts["']/,
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

describe("EX-1:4 Executive Stage Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(EX14_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX14_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX14_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !EX14_FILES.some((name) =>
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
      ExecutiveStageValidationId,
      "EX-1:4/ExecutiveStageValidation",
    );
    assert.equal(ExecutiveStageValidationName, "Executive Stage Validation");
    assert.equal(ExecutiveStageValidationVersion, "1.0.0");
    assert.equal(
      ExecutiveStageValidationNamespace,
      "nexora.ex.executive.stage.validation",
    );
    assert.equal(ExecutiveStageValidationStatus, "Validation");
    assert.equal(ExecutiveStageValidationReadiness, "ReadyForManifest");
    assert.equal(ExecutiveStageValidation.identity.status, "Validation");
    assert.equal(
      ExecutiveStageValidation.identity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveStageValidation.identity.sourceModel,
      "EX-1:3/ExecutiveStageModel",
    );
    assert.equal(
      ExecutiveStageValidation.nextPhase,
      "EX-1:5 — Executive Stage Manifest",
    );
  });

  it("consumes EX-1:3 Model and declares ten categories in fixed order", () => {
    assert.equal(ExecutiveStageValidation.model, ExecutiveStageModel);
    assert.deepEqual(
      [...ExecutiveStageValidation.categoryNames],
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      [...ExecutiveStageValidation.executionOrder],
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      ExecutiveStageValidation.categories.map((item) => item.categoryName),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      ExecutiveStageValidation.categories.map((item) => item.executionOrder),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    );
    assert.ok(
      ExecutiveStageValidation.categories.every(
        (item) => item.removable === false,
      ),
    );
  });

  it("publishes exactly forty unique canonical validation rules", () => {
    const validation = ExecutiveStageValidation;
    assert.equal(validation.rules.length, 40);
    assert.equal(validation.registry.ruleCount, 40);
    assert.equal(validation.baselines.canonicalValidationRules, 40);
    assert.equal(validation.registry.canonicalRuleCount, 40);
    assert.equal(validation.registry.dynamicallyExtensible, true);
    assert.equal(validation.registry.preservesCanonicalRuleIdentities, true);

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
  });

  it("defines integrity checks, runtime compatibility, and result model baselines", () => {
    const validation = ExecutiveStageValidation;

    assert.equal(validation.baselines.validationCategories, 10);
    assert.equal(validation.baselines.severityLevels, 4);
    assert.equal(validation.baselines.integrityChecks, 7);
    assert.equal(validation.baselines.runtimeCompatibilityChecks, 5);
    assert.equal(validation.baselines.validationResultSections, 7);

    assert.equal(validation.integrity.checkCount, 7);
    assert.equal(validation.integrity.runtimeCompatibilityCheckCount, 5);
    assert.equal(validation.integrity.executesRuntime, false);
    assert.ok(validation.integrity.coversStageRoot);
    assert.ok(validation.integrity.coversRuntimeCompatibility);

    assert.deepEqual([...validation.severityNames], [...EXPECTED_SEVERITIES]);
    assert.deepEqual(
      [...validation.renderingBlockingSeverities],
      ["Error", "Critical"],
    );

    assert.equal(validation.resultModel.fieldCount, 7);
    assert.deepEqual(
      validation.resultModel.fields.map((item) => item.fieldName),
      [
        "identity",
        "status",
        "categoryResults",
        "warnings",
        "errors",
        "timestamp",
        "stageVersion",
      ],
    );
    assert.equal(validation.resultModel.immutableResults, true);
  });

  it("remains read-only and does not permit render on Error or Critical", () => {
    const validation = ExecutiveStageValidation;
    assert.equal(validation.readOnly, true);
    assert.equal(validation.evaluatesOnly, true);
    assert.equal(validation.rendersStage, false);
    assert.equal(validation.modifiesRuntime, false);
    assert.equal(validation.modifiesStageState, false);
    assert.equal(validation.reactBehavior, false);
    assert.equal(validation.animationBehavior, false);

    assert.ok(
      validation.severities.every(
        (item) =>
          item.preventsRendering ===
          (item.level === "Error" || item.level === "Critical"),
      ),
    );
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Passed" && item.renderPermitted,
      ),
    );
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Failed" && !item.renderPermitted,
      ),
    );
    assert.ok(
      validation.statuses.some(
        (item) => item.status === "Blocked" && !item.renderPermitted,
      ),
    );

    const summary = getExecutiveStageValidationSummary();
    assert.equal(summary.readiness, "ReadyForManifest");
    assert.equal(summary.readOnly, true);
    assert.equal(summary.modifiesRuntime, false);
    assert.equal(getExecutiveStageValidation(), ExecutiveStageValidation);
  });

  it("forbids React, rendering, and non-Model upstream imports in Validation sources", () => {
    for (const file of EX14_FILES) {
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
      `${HERE}/executiveStageValidation.ts`,
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/executiveStageModel\.ts["']/);
  });
});
