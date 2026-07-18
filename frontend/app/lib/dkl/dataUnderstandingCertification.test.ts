/**
 * DKL-3:7 — Data Understanding Certification Tests.
 *
 * Deterministic coverage for the immutable Certification layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as certificationApi from "./dataUnderstandingCertification.ts";
import {
  DataUnderstandingCertification,
  DataUnderstandingCertificationRegistry,
  DataUnderstandingCertificationCompatibility,
  DataUnderstandingCertificationEvidence,
  DataUnderstandingCertificationManifest,
  DataUnderstandingCertificationReport,
  DataUnderstandingCertificationVersion,
  DataUnderstandingCertificationIdentity,
} from "./dataUnderstandingCertification.ts";
import { DataUnderstandingPlatform } from "./dataUnderstandingPlatform.ts";
import { DataUnderstandingPlatformDependencies } from "./dataUnderstandingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL37_FILES = [
  "dataUnderstandingCertificationTypes.ts",
  "dataUnderstandingCertificationRegistry.ts",
  "dataUnderstandingCertificationCompatibility.ts",
  "dataUnderstandingCertificationEvidence.ts",
  "dataUnderstandingCertificationManifest.ts",
  "dataUnderstandingCertificationReport.ts",
  "dataUnderstandingCertification.ts",
  "dataUnderstandingCertification.test.ts",
];

const REQUIRED_GATES = [
  "FoundationCertified",
  "RegistryCertified",
  "ModelCertified",
  "ValidationCertified",
  "ManifestCertified",
  "PlatformCertified",
  "DependenciesCertified",
  "CompatibilityCertified",
  "OwnershipCertified",
  "BoundaryCertified",
  "PublicApiCertified",
  "DeterministicCertified",
  "ImmutableCertified",
  "ReadyForFreeze",
] as const;

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly eight DKL-3:7 files exist", () => {
  assert.equal(DKL37_FILES.length, 8);
  for (const file of DKL37_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. certification module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(certificationApi).sort(), [
    "DataUnderstandingCertification",
    "DataUnderstandingCertificationCompatibility",
    "DataUnderstandingCertificationEvidence",
    "DataUnderstandingCertificationIdentity",
    "DataUnderstandingCertificationManifest",
    "DataUnderstandingCertificationRegistry",
    "DataUnderstandingCertificationReport",
    "DataUnderstandingCertificationVersion",
  ]);
});

test("3. no helper functions among certification public exports", () => {
  for (const [name, value] of Object.entries(certificationApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. identity and version consistency", () => {
  assert.equal(
    DataUnderstandingCertificationIdentity.certificationId,
    "DKL-3:7/DataUnderstandingCertification",
  );
  assert.equal(DataUnderstandingCertificationIdentity.sourcePhase, "DKL-3:7");
  assert.equal(DataUnderstandingCertificationIdentity.status, "Certified");
  assert.equal(DataUnderstandingCertificationIdentity.readiness, "ReadyForFreeze");
  assert.equal(DataUnderstandingCertificationIdentity.platformId, "DKL-3");
  assert.equal(DataUnderstandingCertificationVersion, "1.0.0");
  assert.equal(
    DataUnderstandingCertificationIdentity.certificationNamespace,
    "nexora.dkl.data-understanding.certification",
  );
  assert.equal(
    DataUnderstandingCertification.identity,
    DataUnderstandingCertificationIdentity,
  );
  assert.equal(
    DataUnderstandingCertification.version,
    DataUnderstandingCertificationVersion,
  );
});

test("5. certification completeness — components and surfaces", () => {
  assert.equal(DataUnderstandingCertificationRegistry.componentCount, 6);
  assert.equal(DataUnderstandingCertificationManifest.counts.phasesCertified, 6);
  assert.deepEqual(
    DataUnderstandingCertificationRegistry.components.map((c) => c.sourcePhase),
    ["DKL-3:1", "DKL-3:2", "DKL-3:3", "DKL-3:4", "DKL-3:5", "DKL-3:6"],
  );
  assert.deepEqual(Object.keys(DataUnderstandingCertification.certifiedSurfaces).sort(), [
    "foundation",
    "manifest",
    "model",
    "platform",
    "registry",
    "validation",
  ]);
  for (const surface of Object.values(DataUnderstandingCertification.certifiedSurfaces)) {
    assert.equal(surface.certified, true);
  }
});

test("6. certification gates — required set all PASS/Certified", () => {
  assert.equal(DataUnderstandingCertificationRegistry.gateCount, 14);
  assert.equal(DataUnderstandingCertificationRegistry.certifiedGateCount, 14);
  assert.equal(DataUnderstandingCertificationRegistry.allGatesPass, true);
  assert.equal(DataUnderstandingCertificationRegistry.allGatesCertified, true);
  const names = DataUnderstandingCertificationRegistry.gates.map((g) => g.gateName);
  for (const required of REQUIRED_GATES) {
    assert.ok(names.includes(required), `missing gate ${required}`);
  }
  for (const gate of DataUnderstandingCertificationRegistry.gates) {
    assert.equal(gate.expectedStatus, "PASS");
    assert.equal(gate.actualStatus, "PASS");
    assert.equal(gate.status, "Certified");
    assert.equal(gate.blocking, true);
  }
});

test("7. platform certification", () => {
  assert.equal(
    DataUnderstandingCertification.certifiedSurfaces.platform.identity,
    DataUnderstandingPlatform.identity,
  );
  assert.equal(
    DataUnderstandingCertification.certifiedSurfaces.platform.readiness,
    true,
  );
  assert.equal(DataUnderstandingCertification.readiness.PlatformCertified, true);
  assert.equal(
    DataUnderstandingPlatform.readiness.ReadyForCertification,
    true,
  );
});

test("8. dependency certification", () => {
  assert.equal(DataUnderstandingCertification.readiness.DependenciesCertified, true);
  assert.equal(
    DataUnderstandingCertification.dependencies.platformDependencies,
    DataUnderstandingPlatformDependencies,
  );
  assert.equal(DataUnderstandingPlatformDependencies.noFuturePhases, true);
  assert.ok(
    DataUnderstandingCertification.dependencies.forbidden.includes("DKL-3:8+"),
  );
  assert.ok(DataUnderstandingCertification.dependencies.forbidden.includes("DKL-4"));
  assert.ok(
    DataUnderstandingCertification.dependencies.forbidden.includes("Business Objects"),
  );
  assert.ok(
    DataUnderstandingCertification.dependencies.forbidden.includes("Knowledge Graph"),
  );
  assert.ok(
    DataUnderstandingCertification.dependencies.pipelineUnderstandingPlatform
      .readyForDKL3Intake,
  );
});

test("9. compatibility certification", () => {
  assert.equal(DataUnderstandingCertification.readiness.CompatibilityCertified, true);
  assert.equal(
    DataUnderstandingCertificationCompatibility.runtimeCompatibilityLogic,
    false,
  );
  assert.ok(DataUnderstandingCertificationCompatibility.entryCount >= 10);
  const byId = Object.fromEntries(
    DataUnderstandingCertificationCompatibility.entries.map((e) => [
      e.compatibilityId,
      e,
    ]),
  );
  assert.equal(byId.PlatformCertificationCompatible?.status, "Compatible");
  assert.equal(byId.ForwardCompatibleToFreeze?.status, "ForwardCompatible");
  assert.equal(byId.Dkl4CompatibilityReferenceOnly?.status, "Restricted");
  assert.equal(byId.BusinessObjectCompatibilityForbidden?.status, "Forbidden");
  assert.equal(byId.KnowledgeGraphCompatibilityForbidden?.status, "Forbidden");
});

test("10. ownership and boundary certification", () => {
  assert.equal(DataUnderstandingCertification.readiness.OwnershipCertified, true);
  assert.equal(DataUnderstandingCertification.readiness.BoundaryCertified, true);
  const evidenceIds = DataUnderstandingCertificationEvidence.entries.map(
    (e) => e.evidenceId,
  );
  assert.ok(evidenceIds.includes("EV-OWNERSHIP"));
  assert.ok(evidenceIds.includes("EV-BOUNDARIES"));
});

test("11. readiness certification — ReadyForFreeze", () => {
  assert.equal(DataUnderstandingCertification.readiness.ReadyForFreeze, true);
  assert.equal(DataUnderstandingCertification.readiness.Certified, true);
  assert.equal(DataUnderstandingCertification.status, "Certified");
  assert.equal(
    DataUnderstandingCertificationIdentity.readiness,
    "ReadyForFreeze",
  );
  assert.equal(
    DataUnderstandingCertification.nextPhase,
    "DKL-3:8 — Data Understanding Freeze",
  );
  assert.equal(DataUnderstandingCertificationManifest.status, "Certified");
  assert.equal(DataUnderstandingCertificationReport.status, "Certified");
  assert.equal(
    DataUnderstandingCertificationReport.summary.readiness,
    "ReadyForFreeze",
  );
});

test("12. public API count and registry names", () => {
  assert.equal(DataUnderstandingCertificationRegistry.publicApiCount, 8);
  assert.equal(DataUnderstandingCertificationManifest.counts.publicApiCount, 8);
  assert.deepEqual(
    [...DataUnderstandingCertificationRegistry.publicApiNames].sort(),
    Object.keys(certificationApi).sort(),
  );
});

test("13. immutable guarantees", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationIdentity), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationCompatibility), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationEvidence), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCertificationReport), true);
  assert.equal(Object.isFrozen(DataUnderstandingCertification), true);
  assert.equal(Object.isFrozen(DataUnderstandingCertification.gates), true);
  assert.equal(Object.isFrozen(DataUnderstandingCertification.certifiedSurfaces), true);
  assert.equal(Object.isFrozen(DataUnderstandingCertification.dependencies), true);
});

test("14. deterministic guarantees", () => {
  assert.equal(DataUnderstandingCertification.metadata.deterministic, true);
  assert.equal(DataUnderstandingCertificationRegistry.deterministic, true);
  assert.equal(DataUnderstandingCertificationEvidence.deterministic, true);
  const a = JSON.stringify(DataUnderstandingCertificationReport.summary);
  const b = JSON.stringify(DataUnderstandingCertificationReport.summary);
  assert.equal(a, b);
  assert.equal(
    JSON.stringify(DataUnderstandingCertificationManifest.counts),
    JSON.stringify(DataUnderstandingCertificationManifest.counts),
  );
});

test("15. no runtime behavior in source files", () => {
  for (const file of DKL37_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("16. no future dependencies — imports limited to allowed surfaces", () => {
  for (const file of DKL37_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      const allowed =
        spec.includes("dataUnderstanding") ||
        /dataSourceKnowledgeRegistryPublicIndex\.ts$/.test(spec) ||
        /pipelineUnderstandingPlatform\.ts$/.test(spec);
      assert.ok(allowed, `${file} imports forbidden module: ${spec}`);
    }
    assert.equal(/from\s+["'][^"']*dkl-4/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*Freeze/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*businessObject/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*knowledgeGraph/i.test(text), false, file);
  }
});

test("17. metadata only — no understanding, validation execution, BO, KG, AI, Engine", () => {
  assert.equal(DataUnderstandingCertification.metadata.metadataOnly, true);
  assert.equal(DataUnderstandingCertification.metadata.certificationOnly, true);
  assert.equal(DataUnderstandingCertification.metadata.semanticUnderstandingPerformed, false);
  assert.equal(DataUnderstandingCertification.metadata.validationExecuted, false);
  assert.equal(DataUnderstandingCertification.metadata.businessObjectsCreated, false);
  assert.equal(DataUnderstandingCertification.metadata.knowledgeGraphCreated, false);
  assert.equal(DataUnderstandingCertification.metadata.persistencePerformed, false);
  assert.equal(DataUnderstandingCertification.metadata.aiExecuted, false);
  assert.equal(DataUnderstandingCertification.metadata.engineReasoningPerformed, false);
  assert.equal(DataUnderstandingCertification.readiness.UnderstandingForbidden, true);
  assert.equal(DataUnderstandingCertification.readiness.ValidationExecutionForbidden, true);
  assert.equal(DataUnderstandingCertification.readiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingCertification.readiness.KnowledgeGraphForbidden, true);
  assert.equal(DataUnderstandingCertification.readiness.AIFree, true);
  assert.equal(DataUnderstandingCertification.readiness.EngineFree, true);
});

test("18. report and evidence completeness", () => {
  assert.equal(DataUnderstandingCertificationEvidence.allCertified, true);
  assert.ok(DataUnderstandingCertificationEvidence.entryCount >= 20);
  assert.equal(DataUnderstandingCertificationReport.gates, DataUnderstandingCertificationRegistry.gates);
  assert.equal(
    DataUnderstandingCertificationReport.evidence,
    DataUnderstandingCertificationEvidence.entries,
  );
  assert.equal(DataUnderstandingCertificationReport.sectionCount, 9);
  assert.equal(DataUnderstandingCertification.report, DataUnderstandingCertificationReport);
  assert.equal(DataUnderstandingCertification.manifest, DataUnderstandingCertificationManifest);
  assert.equal(DataUnderstandingCertification.registry, DataUnderstandingCertificationRegistry);
});
