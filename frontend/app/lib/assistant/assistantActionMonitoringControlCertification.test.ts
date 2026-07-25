import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlCertification } from "./assistantActionMonitoringControlCertification.ts";

const files = [
  "assistantActionMonitoringControlCertification.test.ts",
  "assistantActionMonitoringControlCertification.ts",
  "assistantActionMonitoringControlCertificationCriteria.ts",
  "assistantActionMonitoringControlCertificationGates.ts",
  "assistantActionMonitoringControlCertificationMetadata.ts",
  "assistantActionMonitoringControlCertificationPlatform.ts",
  "assistantActionMonitoringControlCertificationPublic.ts",
  "assistantActionMonitoringControlCertificationReport.ts",
];

const certificationModuleFiles = [
  "assistantActionMonitoringControlCertification.ts",
  "assistantActionMonitoringControlCertificationCriteria.ts",
  "assistantActionMonitoringControlCertificationGates.ts",
  "assistantActionMonitoringControlCertificationMetadata.ts",
  "assistantActionMonitoringControlCertificationPlatform.ts",
  "assistantActionMonitoringControlCertificationPublic.ts",
  "assistantActionMonitoringControlCertificationReport.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:7 publishes canonical Certification identity", () => {
  const certification = AssistantActionMonitoringControlCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-9:7/ExecutiveActionMonitoringControlCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.identity.status, "Certified");
  assert.equal(certification.identity.stage, "ReadyForFreeze");
  assert.equal(certification.identity.readiness, "ReadyForFreeze");
  assert.equal(certification.identity.canonical, true);
  assert.equal(certification.identity.mutable, false);
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
  );
  assert.equal(certification.status, "Certified");
  assert.equal(certification.stage, "ReadyForFreeze");
  assert.equal(certification.readinessStatus, "ReadyForFreeze");
});

test("ASSISTANT-9:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantActionMonitoringControlCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(certification.statistics.certificationCriteriaCount, 18);
  assert.equal(certification.statistics.certificationGateCount, 16);
  assert.equal(
    certification.certificationPlatform.totalCertificationCriteria,
    18,
  );
  assert.equal(
    certification.certificationPlatform.totalCertificationGates,
    16,
  );
  assert.equal(
    certification.certificationPlatform.certificationStatus,
    "Certified",
  );
  assert.equal(
    certification.certificationPlatform.freezeReadiness,
    "ReadyForFreeze",
  );
  assert.deepEqual(
    certification.criteria.map(({ canonicalName }) => canonicalName),
    [
      "Foundation integrity certified",
      "Registry integrity certified",
      "Model integrity certified",
      "Validation integrity certified",
      "Manifest integrity certified",
      "Platform integrity certified",
      "Canonical identities verified",
      "Relationship consistency verified",
      "Metadata completeness verified",
      "Inventory consistency verified",
      "Deterministic ordering verified",
      "Compatibility verified",
      "Metadata-only implementation verified",
      "Runtime exclusion verified",
      "TypeScript compliance verified",
      "ESLint compliance verified",
      "Freeze readiness verified",
      "Release readiness verified",
    ],
  );
  assert.deepEqual(
    certification.gates.map(({ canonicalName }) => canonicalName),
    [
      "Foundation Gate",
      "Registry Gate",
      "Model Gate",
      "Validation Gate",
      "Manifest Gate",
      "Platform Gate",
      "Identity Gate",
      "Relationship Gate",
      "Metadata Gate",
      "Inventory Gate",
      "Compatibility Gate",
      "Architecture Gate",
      "Runtime Boundary Gate",
      "Quality Gate",
      "Freeze Gate",
      "Release Gate",
    ],
  );
  assert.deepEqual([...certification.outcomes], [
    "NotCertified",
    "Certified",
    "CertifiedWithNotes",
    "CertificationBlocked",
  ]);
  assert.equal(certification.report.summary.outcome, "Certified");
  assert.equal(certification.report.freezeDeclaration.freezeReady, true);
  assert.equal(certification.report.releaseDeclaration.releaseReady, true);
});

test("ASSISTANT-9:7 metadata is Platform-derived, unique, and immutable", () => {
  const certification = AssistantActionMonitoringControlCertification;
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
  assert.equal(Object.isFrozen(certification.report), true);
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
    certification.criteria.every(({ platformReference }) =>
      platformReference
        === "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform"),
    true,
  );
  assert.equal(
    certification.gates.every(({ platformReference }) =>
      platformReference
        === "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform"),
    true,
  );
  assert.equal(
    certification.criteria.every(({ readiness }) =>
      readiness === "ReadyForFreeze"),
    true,
  );
  assert.equal(
    certification.certificationPlatform.platformGuaranteeCount,
    certification.platform.statistics.platformGuaranteeCount,
  );
  assert.equal(
    certification.certificationPlatform.platformInventoryTotals,
    certification.platform.inventory.totals,
  );
  assert.equal(
    certification.compatibility,
    certification.platform.compatibility,
  );
});

test("ASSISTANT-9:7 consumes Platform only and forbids runtime behavior", () => {
  const certification = AssistantActionMonitoringControlCertification;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlCertification.ts"),
    [
      "./assistantActionMonitoringControlPlatform.ts",
      "./assistantActionMonitoringControlCertificationCriteria.ts",
      "./assistantActionMonitoringControlCertificationGates.ts",
      "./assistantActionMonitoringControlCertificationMetadata.ts",
      "./assistantActionMonitoringControlCertificationPlatform.ts",
      "./assistantActionMonitoringControlCertificationPublic.ts",
      "./assistantActionMonitoringControlCertificationReport.ts",
    ],
  );
  for (const fileName of certificationModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlPlatform.ts"
        || importPath
          === "./assistantActionMonitoringControlCertification.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationCriteria.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationGates.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationPlatform.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationPublic.ts"
        || importPath
          === "./assistantActionMonitoringControlCertificationReport.ts";
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
        importPath.includes("assistantActionMonitoringControlModel"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlValidation"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlManifest"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlFreeze"),
        false,
      );
    }
  }
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-9:6 Executive Action Monitoring & Control Platform",
  ]);
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
  );
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantActionMonitoringControlCertification",
  ]);
  assert.equal(certification.executableCertification, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.monitoringRuntime, false);
  assert.equal(certification.controlRuntime, false);
  assert.equal(certification.kpiCalculations, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.services, false);
  assert.equal(certification.factories, false);
  assert.equal(certification.ui, false);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
});
