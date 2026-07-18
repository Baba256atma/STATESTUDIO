import assert from "node:assert/strict";
import test from "node:test";

import * as certificationApi from "./dataSourceKnowledgeCertificationPlatform.ts";
import {
  DataSourceKnowledgeCertificationCompatibility,
  DataSourceKnowledgeCertificationEvidence,
  DataSourceKnowledgeCertificationGates,
  DataSourceKnowledgeCertificationManifest,
  DataSourceKnowledgeCertificationPlatform,
  DataSourceKnowledgeCertificationRegistry,
  DataSourceKnowledgeCertificationSummary,
} from "./dataSourceKnowledgeCertificationPlatform.ts";

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import * as validationModule from "./dataSourceKnowledgeValidationRunner.ts";
import * as manifestModule from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import * as platformIndexModule from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl22RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl26CompletePlatform } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";

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

const EXPECTED_PUBLIC_API = [
  "DataSourceKnowledgeCertificationPlatform",
  "DataSourceKnowledgeCertificationRegistry",
  "DataSourceKnowledgeCertificationGates",
  "DataSourceKnowledgeCertificationEvidence",
  "DataSourceKnowledgeCertificationCompatibility",
  "DataSourceKnowledgeCertificationManifest",
  "DataSourceKnowledgeCertificationSummary",
];

const EXPECTED_COMPONENT_IDS = [
  "CERT-FOUNDATION",
  "CERT-REGISTRY",
  "CERT-MODEL",
  "CERT-VALIDATION",
  "CERT-MANIFEST",
  "CERT-PLATFORM",
  "CERT-PUBLIC-SURFACE",
];

test("1. eight DKL-2:7 files are represented by the certification surface", () => {
  // types, registry, gates, compatibility, evidence, manifest, platform, test.
  assert.ok(DataSourceKnowledgeCertificationRegistry);
  assert.ok(DataSourceKnowledgeCertificationGates);
  assert.ok(DataSourceKnowledgeCertificationCompatibility);
  assert.ok(DataSourceKnowledgeCertificationEvidence);
  assert.ok(DataSourceKnowledgeCertificationManifest);
  assert.ok(DataSourceKnowledgeCertificationSummary);
  assert.ok(DataSourceKnowledgeCertificationPlatform);
});

test("2. certification module has exactly seven runtime exports", () => {
  assert.equal(Object.keys(certificationApi).length, 7);
  assert.deepEqual(Object.keys(certificationApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("3. exactly seven certification components exist", () => {
  assert.equal(DataSourceKnowledgeCertificationRegistry.components.length, 7);
  assert.deepEqual(
    DataSourceKnowledgeCertificationRegistry.components.map((c) => c.componentId),
    EXPECTED_COMPONENT_IDS,
  );
});

test("4. all seven components report Certified with zero issues", () => {
  for (const component of DataSourceKnowledgeCertificationRegistry.components) {
    assert.equal(component.status, "Certified");
    assert.equal(component.blockingIssueCount, 0);
    assert.equal(component.warningCount, 0);
    assert.equal(component.readiness, "ReadyForFreeze");
  }
});

test("5. exactly fourteen certification gates exist", () => {
  assert.equal(DataSourceKnowledgeCertificationGates.gates.length, 14);
});

test("6. all fourteen gates report PASS and Certified", () => {
  for (const gate of DataSourceKnowledgeCertificationGates.gates) {
    assert.equal(gate.expectedStatus, "PASS");
    assert.equal(gate.actualStatus, "PASS");
    assert.equal(gate.status, "Certified");
  }
});

test("7. exactly ten compatibility declarations exist", () => {
  assert.equal(DataSourceKnowledgeCertificationCompatibility.declarations.length, 10);
});

test("8. all compatibility declarations report Compatible", () => {
  for (const declaration of DataSourceKnowledgeCertificationCompatibility.declarations) {
    assert.equal(declaration.status, "Compatible");
  }
});

test("9. every gate id is globally unique", () => {
  const ids = DataSourceKnowledgeCertificationGates.gates.map((g) => g.gateId);
  assert.equal(new Set(ids).size, ids.length);
});

test("10. every component id is globally unique", () => {
  const ids = DataSourceKnowledgeCertificationRegistry.components.map((c) => c.componentId);
  assert.equal(new Set(ids).size, ids.length);
});

test("11. every evidence id is globally unique", () => {
  const ids = DataSourceKnowledgeCertificationEvidence.items.map((e) => e.evidenceId);
  assert.equal(new Set(ids).size, ids.length);
});

test("12. every compatibility id is globally unique", () => {
  const ids = DataSourceKnowledgeCertificationCompatibility.declarations.map((c) => c.compatibilityId);
  assert.equal(new Set(ids).size, ids.length);
});

test("13. all evidence items report Verified with matching values", () => {
  for (const item of DataSourceKnowledgeCertificationEvidence.items) {
    assert.equal(item.status, "Verified");
    assert.deepEqual(item.actualValue, item.expectedValue);
  }
});

test("14. foundation certification resolves DKL-2:1", () => {
  const component = DataSourceKnowledgeCertificationRegistry.getComponentById("CERT-FOUNDATION");
  assert.ok(component);
  assert.equal(component?.sourcePhase, "DKL-2:1");
  assert.equal(component?.publicModule, "dataSourceKnowledgeRegistryFoundation.ts");
});

test("15. registry certification confirms 95 entries", () => {
  const entries = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-REGISTRY-ENTRIES");
  assert.equal(entries?.actualValue, 95);
  assert.equal(DataSourceKnowledgeCertificationSummary.registryEntryCount, 95);
});

test("16. model certification confirms 86 models", () => {
  const models = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-2-3-MODELS");
  assert.equal(models?.actualValue, 86);
  assert.equal(DataSourceKnowledgeCertificationSummary.modelCount, 86);
});

test("17. validation certification confirms 40/40 PASS", () => {
  const validation = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-2-4-VALIDATION");
  const rules = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-2-4-RULES");
  assert.equal(validation?.actualValue, 40);
  assert.equal(rules?.actualValue, 40);
  assert.equal(DataSourceKnowledgeCertificationSummary.validationPassCount, 40);
});

test("18. manifest certification confirms ManifestComplete", () => {
  const manifest = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-2-5-MANIFEST");
  assert.equal(manifest?.actualValue, "ManifestComplete");
});

test("19. platform certification confirms PlatformComplete", () => {
  const platform = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-2-6-PLATFORM");
  assert.equal(platform?.actualValue, "PlatformComplete");
});

test("20. public API counts are 7, 8, 9, 7, 8, 6, and 7", () => {
  assert.equal(Object.keys(foundationModule).length, 7);
  assert.equal(Object.keys(registryModule).length, 8);
  assert.equal(Object.keys(modelModule).length, 9);
  assert.equal(Object.keys(validationModule).length, 7);
  assert.equal(Object.keys(manifestModule).length, 8);
  assert.equal(Object.keys(platformIndexModule).length, 6);
  assert.equal(Object.keys(certificationApi).length, 7);
});

test("21. DKL-2:2 and DKL-2:6 platform-name ambiguity is explicitly controlled", () => {
  assert.notEqual(Dkl22RegistryPlatform as object, Dkl26CompletePlatform as object);
  const evidence = DataSourceKnowledgeCertificationEvidence.getEvidenceById(
    "EV-PUBLIC-SURFACE-AMBIGUITY",
  );
  assert.equal(evidence?.actualValue, true);
  const gate = DataSourceKnowledgeCertificationGates.getGateById(
    "GATE-PUBLIC-SURFACE-AMBIGUITY-CONTROLLED",
  );
  assert.ok(gate);
  assert.equal(gate?.status, "Certified");
});

test("22. future DKL-2:9 resolution strategy is declared", () => {
  const gate = DataSourceKnowledgeCertificationGates.getGateById(
    "GATE-PUBLIC-SURFACE-AMBIGUITY-CONTROLLED",
  );
  assert.match(gate?.readinessImpact ?? "", /DKL-2:9/);
  assert.match(gate?.readinessImpact ?? "", /canonical complete-platform name/);
});

test("23, 24, 25. dependencies are forward-only, cycle-free, public-API-only", () => {
  const forwardOnly = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-FORWARD-ONLY");
  const cycleFree = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-CYCLE-FREE");
  const publicApiOnly = DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-PUBLIC-API-ONLY");
  assert.equal(forwardOnly?.actualValue, true);
  assert.equal(cycleFree?.actualValue, true);
  assert.equal(publicApiOnly?.actualValue, true);
  const gate = DataSourceKnowledgeCertificationGates.getGateById(
    "GATE-DEPENDENCY-ARCHITECTURE-CERTIFIED",
  );
  assert.equal(gate?.status, "Certified");
});

test("26. ownership boundaries remain protected", () => {
  const gate = DataSourceKnowledgeCertificationGates.getGateById(
    "GATE-OWNERSHIP-BOUNDARIES-PROTECTED",
  );
  assert.ok(gate);
  assert.equal(gate?.status, "Certified");
  assert.equal(gate?.category, "Ownership");
});

test("27. all public objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationPlatform));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationRegistry));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationGates));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationEvidence));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationCompatibility));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCertificationSummary));
});

test("28. unknown lookup ids return undefined and never throw", () => {
  assert.equal(DataSourceKnowledgeCertificationRegistry.getComponentById("nope"), undefined);
  assert.equal(DataSourceKnowledgeCertificationGates.getGateById("nope"), undefined);
  assert.equal(DataSourceKnowledgeCertificationEvidence.getEvidenceById("nope"), undefined);
  assert.equal(DataSourceKnowledgeCertificationCompatibility.getCompatibilityById("nope"), undefined);
});

test("29. repeated access is deterministic", () => {
  const first = DataSourceKnowledgeCertificationGates.gates.map((g) => g.gateId);
  const second = DataSourceKnowledgeCertificationGates.gates.map((g) => g.gateId);
  assert.deepEqual(first, second);
});

test("30. no forbidden runtime behavior: every public export is data (no functions)", () => {
  for (const value of Object.values(certificationApi)) {
    assert.notEqual(typeof value, "function");
  }
  assert.equal(DataSourceKnowledgeCertificationPlatform.metadataOnly, true);
  assert.equal(DataSourceKnowledgeCertificationPlatform.runtimeFree, true);
});

test("31. certification manifest counts match actual inventories", () => {
  const m = DataSourceKnowledgeCertificationManifest;
  assert.equal(m.componentCount, DataSourceKnowledgeCertificationRegistry.components.length);
  assert.equal(m.gateCount, DataSourceKnowledgeCertificationGates.gates.length);
  assert.equal(m.evidenceCount, DataSourceKnowledgeCertificationEvidence.items.length);
  assert.equal(m.compatibilityCount, DataSourceKnowledgeCertificationCompatibility.declarations.length);
  assert.equal(m.componentCount, 7);
  assert.equal(m.gateCount, 14);
  assert.equal(m.compatibilityCount, 10);
  assert.equal(m.certifiedGateCount, 14);
  assert.equal(m.failedGateCount, 0);
  assert.equal(m.warningGateCount, 0);
});

test("32, 33, 34, 35, 36. status, counts, readiness, and next phase", () => {
  assert.equal(DataSourceKnowledgeCertificationManifest.certificationStatus, "Certified");
  assert.equal(DataSourceKnowledgeCertificationManifest.blockingIssueCount, 0);
  assert.equal(DataSourceKnowledgeCertificationManifest.warningCount, 0);
  assert.equal(DataSourceKnowledgeCertificationManifest.readiness, "ReadyForFreeze");
  assert.equal(DataSourceKnowledgeCertificationManifest.nextPhase, "DKL-2:8");
  assert.equal(DataSourceKnowledgeCertificationSummary.status, "Certified");
  assert.equal(DataSourceKnowledgeCertificationSummary.readiness, "ReadyForFreeze");
  assert.equal(DataSourceKnowledgeCertificationSummary.nextPhase, "DKL-2:8");
  assert.equal(DataSourceKnowledgeCertificationPlatform.identity.status, "Certified");
  assert.equal(DataSourceKnowledgeCertificationPlatform.identity.readiness, "ReadyForFreeze");
});

test("37. platformMetadataArtifactCount and physicalPhaseArtifactCount are separately documented", () => {
  const metadataArtifacts =
    DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-ARTIFACTS-METADATA");
  const physicalArtifacts =
    DataSourceKnowledgeCertificationEvidence.getEvidenceById("EV-ARTIFACTS-PHYSICAL");
  assert.equal(metadataArtifacts?.actualValue, 41);
  assert.equal(physicalArtifacts?.actualValue, 48);
  assert.notEqual(metadataArtifacts?.actualValue, physicalArtifacts?.actualValue);
});

test("38. summary guarantee count is 12 and certified gate count is 14", () => {
  assert.equal(DataSourceKnowledgeCertificationSummary.guaranteeCount, 12);
  assert.equal(DataSourceKnowledgeCertificationSummary.certifiedGateCount, 14);
  assert.equal(DataSourceKnowledgeCertificationSummary.componentCount, 7);
  assert.equal(DataSourceKnowledgeCertificationSummary.compatibilityCount, 10);
  assert.equal(DataSourceKnowledgeCertificationSummary.blockingIssueCount, 0);
  assert.equal(DataSourceKnowledgeCertificationSummary.warningCount, 0);
});

test("39. certification platform aggregates canonical objects by reference", () => {
  assert.equal(DataSourceKnowledgeCertificationPlatform.registry, DataSourceKnowledgeCertificationRegistry);
  assert.equal(DataSourceKnowledgeCertificationPlatform.gates, DataSourceKnowledgeCertificationGates);
  assert.equal(DataSourceKnowledgeCertificationPlatform.evidence, DataSourceKnowledgeCertificationEvidence);
  assert.equal(
    DataSourceKnowledgeCertificationPlatform.compatibility,
    DataSourceKnowledgeCertificationCompatibility,
  );
  assert.equal(DataSourceKnowledgeCertificationPlatform.manifest, DataSourceKnowledgeCertificationManifest);
  assert.equal(DataSourceKnowledgeCertificationPlatform.summary, DataSourceKnowledgeCertificationSummary);
});
