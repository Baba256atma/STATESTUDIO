import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";

const files = [
  "executionValidationCategories.ts",
  "executionValidationManifest.ts",
  "executionValidationMetadata.ts",
  "executionValidationPlatform.ts",
  "executionValidationPolicies.ts",
  "executionValidationRules.ts",
  "executiveActionExecutionValidation.test.ts",
  "executiveActionExecutionValidation.ts",
];

const validationModuleFiles = [
  "executionValidationCategories.ts",
  "executionValidationManifest.ts",
  "executionValidationMetadata.ts",
  "executionValidationPlatform.ts",
  "executionValidationPolicies.ts",
  "executionValidationRules.ts",
  "executiveActionExecutionValidation.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:4 publishes canonical Validation identity", () => {
  const validation = ExecutiveActionExecutionValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.executive-action-execution.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.identity.status, "Validation");
  assert.equal(validation.identity.stage, "ReadyForManifest");
  assert.equal(validation.identity.canonical, true);
  assert.equal(validation.identity.mutable, false);
  assert.equal(
    validation.identity.sourceModel,
    "ASSISTANT-8:3/ExecutiveActionExecutionModel",
  );
  assert.equal(validation.status, "Validation");
  assert.equal(validation.stage, "ReadyForManifest");
  assert.equal(validation.readiness, "ReadyForManifest");
});

test("ASSISTANT-8:4 publishes exactly 12 categories, 48 rules, and 16 gates", () => {
  const validation = ExecutiveActionExecutionValidation;
  assert.equal(validation.categories.length, 12);
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.gates.length, 16);
  assert.equal(validation.policies.length, 8);
  assert.equal(validation.statistics.validationCategoryCount, 12);
  assert.equal(validation.statistics.validationRuleCount, 48);
  assert.equal(validation.statistics.validationGateCount, 16);
  assert.equal(validation.platform.validationCategoryCount, 12);
  assert.equal(validation.platform.validationRuleCount, 48);
  assert.equal(validation.platform.validationGateCount, 16);
  assert.equal(validation.platform.validationReadiness, "ReadyForManifest");
  assert.equal(validation.results.ruleCount, 48);
  assert.equal(validation.results.gateCount, 16);
  assert.equal(validation.results.validationStatus, "Passed");
  assert.equal(validation.results.manifestEligibility, "Eligible");
  assert.deepEqual(
    validation.categories.map(({ name }) => name),
    [
      "Model Integrity",
      "Registry Consistency",
      "Execution Structure",
      "Relationship Integrity",
      "Progress Integrity",
      "Execution State Consistency",
      "Execution Health",
      "Exception Integrity",
      "Feedback Integrity",
      "Checkpoint Integrity",
      "Timeline Integrity",
      "Metadata Completeness",
    ],
  );
  assert.deepEqual(
    validation.categories.map(({ expectedRuleCount }) => expectedRuleCount),
    [6, 4, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3],
  );
  assert.deepEqual(
    validation.categories.map(({ expectedRuleCount }) => expectedRuleCount),
    validation.categories.map(({ name }) =>
      validation.rules.filter((rule) => rule.category === name).length),
  );
  assert.deepEqual(
    validation.gates.map(({ name }) => name),
    [
      "Foundation Compatible",
      "Registry Compatible",
      "Model Complete",
      "Relationships Valid",
      "Execution Structure Valid",
      "Progress Valid",
      "Execution States Valid",
      "Health Valid",
      "Exceptions Valid",
      "Feedback Valid",
      "Timeline Valid",
      "Metadata Complete",
      "Policy Compliant",
      "Canonical Identity Valid",
      "Immutable Exports",
      "Ready For Manifest",
    ],
  );
  assert.deepEqual(
    validation.policies.map(({ name }) => name),
    [
      "Deterministic Validation",
      "Immutable Identity",
      "Canonical Registry Compliance",
      "Relationship Consistency",
      "Metadata Completeness",
      "Lifecycle Consistency",
      "Foundation Compatibility",
      "Validation Stability",
    ],
  );
});

test("ASSISTANT-8:4 metadata is immutable and deterministic", () => {
  const validation = ExecutiveActionExecutionValidation;
  assert.equal(
    new Set(validation.rules.map(({ id }) => id)).size,
    48,
  );
  assert.equal(
    new Set(validation.gates.map(({ id }) => id)).size,
    16,
  );
  assert.equal(
    new Set(validation.categories.map(({ id }) => id)).size,
    12,
  );
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(validation.gates.every(Object.isFrozen), true);
  assert.equal(validation.categories.every(Object.isFrozen), true);
  assert.equal(validation.policies.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(validation), true);
  assert.equal(Object.isFrozen(validation.manifest), true);
  assert.equal(Object.isFrozen(validation.platform), true);
  assert.equal(Object.isFrozen(validation.results), true);
  assert.deepEqual(
    validation.rules.map(({ order }) => order),
    validation.rules.map((_, index) => index + 1),
  );
  assert.deepEqual(
    validation.gates.map(({ order }) => order),
    validation.gates.map((_, index) => index + 1),
  );
  assert.equal(
    validation.rules.every(({ validationTarget }) =>
      validationTarget === "ASSISTANT-8:3/ExecutiveActionExecutionModel"),
    true,
  );
  assert.equal(
    validation.rules.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    validation.gates.every(({ declaredState }) => declaredState === "Passed"),
    true,
  );
  assert.equal(
    validation.gates.every(({ evidenceRules }) =>
      evidenceRules.length === 3),
    true,
  );
  assert.deepEqual(
    validation.metadata.metadataFields,
    [
      "canonical id",
      "version",
      "namespace",
      "ownership",
      "readiness",
      "lifecycle",
      "compatibility",
      "release status",
    ],
  );
});

test("ASSISTANT-8:4 consumes Model only and forbids runtime behavior", () => {
  const validation = ExecutiveActionExecutionValidation;
  assert.deepEqual(readImports("executiveActionExecutionValidation.ts"), [
    "./executiveActionExecutionModel.ts",
    "./executionValidationCategories.ts",
    "./executionValidationManifest.ts",
    "./executionValidationMetadata.ts",
    "./executionValidationPlatform.ts",
    "./executionValidationPolicies.ts",
    "./executionValidationRules.ts",
  ]);
  for (const fileName of validationModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionModel.ts"
        || importPath === "./executionValidationCategories.ts"
        || importPath === "./executionValidationManifest.ts"
        || importPath === "./executionValidationMetadata.ts"
        || importPath === "./executionValidationPlatform.ts"
        || importPath === "./executionValidationPolicies.ts"
        || importPath === "./executionValidationRules.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionFoundation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionRegistry"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionManifest"),
        false,
      );
    }
  }
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-8:3 Executive Action Execution Model",
  ]);
  assert.equal(
    validation.model.identity.id,
    "ASSISTANT-8:3/ExecutiveActionExecutionModel",
  );
  assert.deepEqual(validation.publicApiSurface, [
    "ExecutiveActionExecutionValidation",
  ]);
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.executionEngine, false);
  assert.equal(validation.workflowExecution, false);
  assert.equal(validation.scheduler, false);
  assert.equal(validation.monitoringServices, false);
  assert.equal(validation.automation, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.orchestration, false);
  assert.equal(validation.apis, false);
  assert.equal(validation.aiReasoning, false);
  assert.equal(validation.ui, false);
  assert.equal(validation.metadataOnly, true);
  assert.equal(validation.immutable, true);
});
