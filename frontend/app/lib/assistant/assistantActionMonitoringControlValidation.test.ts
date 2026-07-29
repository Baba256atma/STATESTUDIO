import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlValidation } from "./assistantActionMonitoringControlValidation.ts";

const files = [
  "assistantActionMonitoringControlValidation.test.ts",
  "assistantActionMonitoringControlValidation.ts",
  "assistantActionMonitoringControlValidationMetadata.ts",
  "assistantActionMonitoringControlValidationPlatform.ts",
  "assistantActionMonitoringControlValidationPublic.ts",
  "assistantActionMonitoringControlValidationReport.ts",
  "assistantActionMonitoringControlValidationResults.ts",
  "assistantActionMonitoringControlValidationRules.ts",
];

const validationModuleFiles = [
  "assistantActionMonitoringControlValidation.ts",
  "assistantActionMonitoringControlValidationMetadata.ts",
  "assistantActionMonitoringControlValidationPlatform.ts",
  "assistantActionMonitoringControlValidationPublic.ts",
  "assistantActionMonitoringControlValidationReport.ts",
  "assistantActionMonitoringControlValidationResults.ts",
  "assistantActionMonitoringControlValidationRules.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:4 publishes canonical Validation identity", () => {
  const validation = AssistantActionMonitoringControlValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-9:4/ExecutiveActionMonitoringControlValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.identity.status, "Validation");
  assert.equal(validation.identity.stage, "ReadyForManifest");
  assert.equal(validation.identity.readiness, "ReadyForManifest");
  assert.equal(validation.identity.canonical, true);
  assert.equal(validation.identity.mutable, false);
  assert.equal(
    validation.identity.sourceModel,
    "ASSISTANT-9:3/ExecutiveActionMonitoringControlModel",
  );
  assert.equal(validation.status, "Validation");
  assert.equal(validation.stage, "ReadyForManifest");
  assert.equal(validation.readiness, "ReadyForManifest");
});

test("ASSISTANT-9:4 publishes exactly 10 categories and 42 rules", () => {
  const validation = AssistantActionMonitoringControlValidation;
  assert.equal(validation.categories.length, 10);
  assert.equal(validation.rules.length, 42);
  assert.equal(validation.statistics.validationCategoryCount, 10);
  assert.equal(validation.statistics.validationRuleCount, 42);
  assert.equal(validation.platform.totalValidationCategories, 10);
  assert.equal(validation.platform.totalValidationRules, 42);
  assert.equal(validation.results.ruleCount, 42);
  assert.equal(validation.results.validationStatus, "Passed");
  assert.equal(validation.results.manifestEligibility, "Eligible");
  assert.deepEqual(
    validation.categories.map(({ name }) => name),
    [
      "Foundation Validation",
      "Registry Validation",
      "Model Validation",
      "Identity Validation",
      "Relationship Validation",
      "Lifecycle Validation",
      "Capability Validation",
      "Policy Validation",
      "Metadata Validation",
      "Architecture Validation",
    ],
  );
  assert.deepEqual(
    validation.categories.map(({ expectedRuleCount }) => expectedRuleCount),
    [4, 5, 6, 4, 5, 4, 4, 3, 3, 4],
  );
  assert.deepEqual(
    validation.categories.map(({ expectedRuleCount }) => expectedRuleCount),
    validation.categories.map(({ name }) =>
      validation.rules.filter((rule) => rule.validationCategory === name)
        .length),
  );
  assert.deepEqual([...validation.outcomeStates], [
    "NotValidated",
    "Passed",
    "PassedWithWarnings",
    "Failed",
    "Blocked",
  ]);
  assert.equal(
    validation.platform.totalValidatedModelKinds,
    validation.model.statistics.domainModelCount,
  );
  assert.equal(
    validation.platform.totalValidatedRelationshipKinds,
    validation.model.statistics.relationshipCount,
  );
  assert.equal(validation.report.readinessDeclaration, "ReadyForManifest");
  assert.equal(validation.report.manifestCompatibility.manifestCompatible, true);
});

test("ASSISTANT-9:4 rules are unique, referenced, and immutable", () => {
  const validation = AssistantActionMonitoringControlValidation;
  const allowedSources = new Set<string>([
    validation.model.identity.id,
    validation.model.registry.identity.id,
    validation.model.registry.foundation.identity.id,
  ]);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 42);
  assert.equal(
    new Set(validation.categories.map(({ id }) => id)).size,
    10,
  );
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(validation.categories.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(validation), true);
  assert.equal(Object.isFrozen(validation.results), true);
  assert.equal(Object.isFrozen(validation.platform), true);
  assert.equal(Object.isFrozen(validation.report), true);
  assert.deepEqual(
    validation.rules.map(({ order }) => order),
    validation.rules.map((_, index) => index + 1),
  );
  const allowedSourceValues = [...allowedSources];
  assert.equal(
    validation.rules.every(({ sourceReference }) =>
      allowedSourceValues.some((value) => value === sourceReference)),
    true,
  );
  assert.equal(
    validation.rules.every(({ targetComponent }) =>
      allowedSourceValues.some((value) => value === targetComponent)),
    true,
  );
  assert.equal(
    validation.rules.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    validation.rules.every(({ expectedOutcome }) =>
      expectedOutcome === "Passed"),
    true,
  );
  assert.equal(validation.results.ruleResults.length, 42);
});

test("ASSISTANT-9:4 consumes Model only and forbids runtime behavior", () => {
  const validation = AssistantActionMonitoringControlValidation;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlValidation.ts"),
    [
      "./assistantActionMonitoringControlModel.ts",
      "./assistantActionMonitoringControlValidationMetadata.ts",
      "./assistantActionMonitoringControlValidationPlatform.ts",
      "./assistantActionMonitoringControlValidationPublic.ts",
      "./assistantActionMonitoringControlValidationReport.ts",
      "./assistantActionMonitoringControlValidationResults.ts",
      "./assistantActionMonitoringControlValidationRules.ts",
    ],
  );
  for (const fileName of validationModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlModel.ts"
        || importPath
          === "./assistantActionMonitoringControlValidation.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationPlatform.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationPublic.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationReport.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationResults.ts"
        || importPath
          === "./assistantActionMonitoringControlValidationRules.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlFoundation"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlRegistry"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlManifest"),
        false,
      );
    }
  }
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-9:3 Executive Action Monitoring & Control Model",
  ]);
  assert.equal(
    validation.model.identity.id,
    "ASSISTANT-9:3/ExecutiveActionMonitoringControlModel",
  );
  assert.deepEqual(validation.publicApiSurface, [
    "AssistantActionMonitoringControlValidation",
  ]);
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.monitoringRuntime, false);
  assert.equal(validation.controlRuntime, false);
  assert.equal(validation.kpiCalculations, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.services, false);
  assert.equal(validation.factories, false);
  assert.equal(validation.ui, false);
  assert.equal(validation.metadataOnly, true);
  assert.equal(validation.immutable, true);
});
