import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionCertification } from "./executiveActionExecutionCertification.ts";

const files = [
  "executionCertificationCriteria.ts",
  "executionCertificationGates.ts",
  "executionCertificationMetadata.ts",
  "executionCertificationPlatform.ts",
  "executionCertificationReadiness.ts",
  "executionCertificationResults.ts",
  "executiveActionExecutionCertification.test.ts",
  "executiveActionExecutionCertification.ts",
];

const certificationModuleFiles = [
  "executionCertificationCriteria.ts",
  "executionCertificationGates.ts",
  "executionCertificationMetadata.ts",
  "executionCertificationPlatform.ts",
  "executionCertificationReadiness.ts",
  "executionCertificationResults.ts",
  "executiveActionExecutionCertification.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:7 publishes canonical Certification identity", () => {
  const certification = ExecutiveActionExecutionCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-8:7/ExecutiveActionExecutionCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.executive-action-execution.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.identity.status, "Certification");
  assert.equal(certification.identity.stage, "ReadyForFreeze");
  assert.equal(certification.identity.canonical, true);
  assert.equal(certification.identity.mutable, false);
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-8:6/ExecutiveActionExecutionPlatform",
  );
  assert.equal(certification.status, "Certification");
  assert.equal(certification.stage, "ReadyForFreeze");
  assert.equal(certification.readinessStatus, "ReadyForFreeze");
});

test("ASSISTANT-8:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = ExecutiveActionExecutionCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(certification.results.criteriaCount, 18);
  assert.equal(certification.results.gateCount, 16);
  assert.equal(certification.statistics.certificationCriteriaCount, 18);
  assert.equal(certification.statistics.certificationGateCount, 16);
  assert.equal(certification.certificationPlatform.criteriaCount, 18);
  assert.equal(certification.certificationPlatform.gateCount, 16);
  assert.equal(
    certification.certificationPlatform.certificationStatus,
    "Certified",
  );
  assert.equal(
    certification.certificationPlatform.readiness,
    "ReadyForFreeze",
  );
  assert.deepEqual(
    certification.criteria.map(({ name }) => name),
    [
      "Foundation Compatible",
      "Registry Compatible",
      "Model Compatible",
      "Validation Compatible",
      "Manifest Compatible",
      "Platform Compatible",
      "Canonical Identity",
      "Immutable Metadata",
      "Deterministic Structure",
      "Stable Contracts",
      "Stable Models",
      "Stable Relationships",
      "Lifecycle Integrity",
      "Policy Integrity",
      "Inventory Integrity",
      "Metadata Completeness",
      "Consumer Compatibility",
      "Release Readiness",
    ],
  );
  assert.deepEqual(
    certification.gates.map(({ name }) => name),
    [
      "Foundation Gate",
      "Registry Gate",
      "Model Gate",
      "Validation Gate",
      "Manifest Gate",
      "Platform Gate",
      "Identity Gate",
      "Metadata Gate",
      "Relationship Gate",
      "Lifecycle Gate",
      "Policy Gate",
      "Inventory Gate",
      "Compatibility Gate",
      "Stability Gate",
      "Release Gate",
      "Ready For Freeze",
    ],
  );
  assert.deepEqual([...certification.readiness.declarations], [
    "Certified",
    "ReadyForFreeze",
    "Stable",
    "Canonical",
    "Immutable",
    "Deterministic",
    "Metadata Complete",
  ]);
});

test("ASSISTANT-8:7 results and metadata are immutable and deterministic", () => {
  const certification = ExecutiveActionExecutionCertification;
  assert.equal(
    new Set(certification.criteria.map(({ id }) => id)).size,
    18,
  );
  assert.equal(
    new Set(certification.gates.map(({ id }) => id)).size,
    16,
  );
  assert.equal(certification.criteria.every(Object.isFrozen), true);
  assert.equal(certification.gates.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(certification.results), true);
  assert.equal(Object.isFrozen(certification.readiness), true);
  assert.equal(Object.isFrozen(certification.certificationPlatform), true);
  assert.deepEqual(
    certification.criteria.map(({ order }) => order),
    certification.criteria.map((_, index) => index + 1),
  );
  assert.deepEqual(
    certification.gates.map(({ order }) => order),
    certification.gates.map((_, index) => index + 1),
  );
  assert.equal(
    certification.criteria.every(({ evaluationStatus }) =>
      evaluationStatus === "Certified"),
    true,
  );
  assert.equal(
    certification.criteria.every(({ readiness }) =>
      readiness === "ReadyForFreeze"),
    true,
  );
  assert.equal(
    certification.criteria.every(({ canonicalIdentity }) =>
      canonicalIdentity === "ASSISTANT-8:6/ExecutiveActionExecutionPlatform"),
    true,
  );
  assert.equal(
    certification.results.criterionResults.length,
    certification.criteria.length,
  );
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.releaseEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
  assert.deepEqual(certification.guarantees, [
    "Immutable Exports",
    "Deterministic Metadata",
    "Canonical Identities",
    "Compatibility Preservation",
    "Stable Inventory",
    "Metadata Completeness",
  ]);
  assert.equal(
    certification.compatibility,
    certification.platform.compatibility,
  );
  assert.equal(
    certification.certificationPlatform.sourcePlatform.id,
    "ASSISTANT-8:6/ExecutiveActionExecutionPlatform",
  );
});

test("ASSISTANT-8:7 consumes Platform only and forbids runtime behavior", () => {
  const certification = ExecutiveActionExecutionCertification;
  assert.deepEqual(
    readImports("executiveActionExecutionCertification.ts"),
    [
      "./executiveActionExecutionPlatform.ts",
      "./executionCertificationCriteria.ts",
      "./executionCertificationGates.ts",
      "./executionCertificationMetadata.ts",
      "./executionCertificationPlatform.ts",
      "./executionCertificationReadiness.ts",
      "./executionCertificationResults.ts",
    ],
  );
  for (const fileName of certificationModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionPlatform.ts"
        || importPath === "./executionCertificationCriteria.ts"
        || importPath === "./executionCertificationGates.ts"
        || importPath === "./executionCertificationMetadata.ts"
        || importPath === "./executionCertificationPlatform.ts"
        || importPath === "./executionCertificationReadiness.ts"
        || importPath === "./executionCertificationResults.ts";
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
        importPath.includes("executiveActionExecutionModel"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionValidation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionManifest"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionFreeze"),
        false,
      );
    }
  }
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-8:6 Executive Action Execution Platform",
  ]);
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-8:6/ExecutiveActionExecutionPlatform",
  );
  assert.deepEqual(certification.publicApiSurface, [
    "ExecutiveActionExecutionCertification",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.executionEngine, false);
  assert.equal(certification.workflowRuntime, false);
  assert.equal(certification.scheduler, false);
  assert.equal(certification.monitoringServices, false);
  assert.equal(certification.automation, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.orchestration, false);
  assert.equal(certification.apis, false);
  assert.equal(certification.aiReasoning, false);
  assert.equal(certification.ui, false);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
});
