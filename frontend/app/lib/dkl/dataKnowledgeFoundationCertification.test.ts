import assert from "node:assert/strict";
import test from "node:test";

import * as certificationApi from "./dataKnowledgeFoundationCertificationIndex.ts";
import {
  DataKnowledgeFoundationCertification,
  DataKnowledgeFoundationCertificationGates,
  DataKnowledgeFoundationCertificationManifest,
  DataKnowledgeFoundationCompatibilityCertification,
  DataKnowledgeFoundationRegressionCertification,
  getDataKnowledgeFoundationCertification,
  getDataKnowledgeFoundationCertificationGateById,
  getDataKnowledgeFoundationCertificationSummary,
} from "./dataKnowledgeFoundationCertificationIndex.ts";
import { isDeeplyFrozen } from "./dataKnowledgeFoundationCertificationTypes.ts";
import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationPlatform } from "./dataKnowledgeFoundationPlatformIndex.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationCertification",
  "DataKnowledgeFoundationCertificationGates",
  "DataKnowledgeFoundationCompatibilityCertification",
  "DataKnowledgeFoundationRegressionCertification",
  "DataKnowledgeFoundationCertificationManifest",
  "getDataKnowledgeFoundationCertification",
  "getDataKnowledgeFoundationCertificationSummary",
  "getDataKnowledgeFoundationCertificationGateById",
];

const gateById = (id: string) => {
  const gate = getDataKnowledgeFoundationCertificationGateById(id);
  assert.ok(gate, `expected gate ${id} to exist`);
  return gate;
};

test("index exposes exactly eight public APIs", () => {
  assert.equal(Object.keys(certificationApi).length, 8);
  assert.deepEqual(Object.keys(certificationApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("1. certification platform exists", () => {
  assert.ok(DataKnowledgeFoundationCertification);
  assert.equal(getDataKnowledgeFoundationCertification(), DataKnowledgeFoundationCertification);
});

test("2. exactly sixteen gates exist", () => {
  assert.equal(DataKnowledgeFoundationCertificationGates.length, 16);
});

test("3. every gate id is unique", () => {
  const ids = DataKnowledgeFoundationCertificationGates.map((gate) => gate.id);
  assert.equal(new Set(ids).size, 16);
});

test("4. every gate is deeply frozen", () => {
  for (const gate of DataKnowledgeFoundationCertificationGates) {
    assert.ok(isDeeplyFrozen(gate), `gate ${gate.id} must be deeply frozen`);
  }
});

test("5. all sixteen gates pass", () => {
  const passed = DataKnowledgeFoundationCertificationGates.filter((gate) => gate.result === "PASS");
  assert.equal(passed.length, 16);
});

test("6. no blocking failures exist", () => {
  const blockingFailures = DataKnowledgeFoundationCertificationGates.filter(
    (gate) => gate.blocking && gate.result === "FAIL"
  );
  assert.equal(blockingFailures.length, 0);
});

test("7. foundation gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-foundation").result, "PASS");
});

test("8. registry gate passes", () => {
  const gate = gateById("dkl-cert-gate-registry");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.componentCount, 5);
  assert.equal(gate.evidence.publicApiCount, 7);
});

test("9. model gate passes", () => {
  const gate = gateById("dkl-cert-gate-model");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.businessTypeCount, 8);
  assert.equal(gate.evidence.relationshipTypeCount, 7);
  assert.equal(gate.evidence.metadataFieldCount, 7);
});

test("10. validation gate confirms 48/48 rules pass", () => {
  const gate = gateById("dkl-cert-gate-validation");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.ruleCount, 48);
  assert.equal(gate.evidence.passedRules, 48);
  assert.equal(gate.evidence.failedRules, 0);
});

test("11. manifest gate confirms 4 phases and 31 APIs", () => {
  const gate = gateById("dkl-cert-gate-manifest");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.phaseCount, 4);
  assert.equal(gate.evidence.totalApis, 31);
});

test("12. platform gate confirms five canonical sections", () => {
  const gate = gateById("dkl-cert-gate-platform");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.sectionsPresent, true);
  assert.equal(gate.evidence.canonicalReferencesPreserved, true);
});

test("13. ownership gate confirms zero overlap", () => {
  const gate = gateById("dkl-cert-gate-ownership");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.ownershipOverlap, 0);
});

test("14. dependency gate confirms zero overlap", () => {
  const gate = gateById("dkl-cert-gate-dependencies");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.dependencyOverlap, 0);
});

test("15. public API gate confirms 47 pre-certification APIs", () => {
  const gate = gateById("dkl-cert-gate-public-api");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.total, 47);
});

test("16. immutability gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-immutability").result, "PASS");
});

test("17. determinism gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-determinism").result, "PASS");
});

test("18. metadata-only gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-metadata-only").result, "PASS");
});

test("19. runtime-free gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-runtime-free").result, "PASS");
});

test("20. compatibility gate passes", () => {
  assert.equal(gateById("dkl-cert-gate-compatibility").result, "PASS");
});

test("21. regression gate confirms all required baselines", () => {
  const gate = gateById("dkl-cert-gate-regression");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.baselinesMatch, true);
  assert.equal(gate.evidence.totalPreCertificationApis, 47);
  assert.equal(gate.evidence.validationRuleCount, 48);
  assert.equal(gate.evidence.manifestPhaseCount, 4);
  assert.equal(gate.evidence.platformSectionCount, 5);
});

test("22. freeze readiness gate passes", () => {
  const gate = gateById("dkl-cert-gate-freeze-readiness");
  assert.equal(gate.result, "PASS");
  assert.equal(gate.evidence.allPriorGatesPass, true);
  assert.equal(gate.evidence.noBlockingFailures, true);
});

test("23. manifest gate count equals actual gate count", () => {
  assert.equal(
    DataKnowledgeFoundationCertificationManifest.gateCount,
    DataKnowledgeFoundationCertificationGates.length
  );
  assert.equal(DataKnowledgeFoundationCertificationManifest.gateCount, 16);
});

test("24. manifest passed count equals sixteen", () => {
  assert.equal(DataKnowledgeFoundationCertificationManifest.passedGates, 16);
});

test("25. manifest failed count equals zero", () => {
  assert.equal(DataKnowledgeFoundationCertificationManifest.failedGates, 0);
  assert.equal(DataKnowledgeFoundationCertificationManifest.blockingFailures, 0);
});

test("26. summary is deterministic", () => {
  const first = getDataKnowledgeFoundationCertificationSummary();
  const second = getDataKnowledgeFoundationCertificationSummary();
  assert.equal(first, second);
  assert.deepEqual(first, second);
  assert.equal(first.totalGates, 16);
  assert.equal(first.passedGates, 16);
  assert.equal(first.failedGates, 0);
  assert.equal(first.blockingFailures, 0);
  assert.equal(first.certificationStatus, "CERTIFIED");
  assert.equal(first.stability, "STABLE");
  assert.equal(first.readiness, "ReadyForFreeze");
});

test("27. known gate lookup returns canonical gate", () => {
  const gate = getDataKnowledgeFoundationCertificationGateById("dkl-cert-gate-foundation");
  assert.equal(gate, DataKnowledgeFoundationCertificationGates[0]);
});

test("28. unknown gate lookup returns undefined and never throws", () => {
  assert.equal(getDataKnowledgeFoundationCertificationGateById("dkl-cert-gate-unknown"), undefined);
});

test("29. aggregate certification object is deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationCertification));
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationCertificationManifest));
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationCompatibilityCertification));
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationRegressionCertification));
});

test("30. earlier phase metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundation.identity.layerId, "DKL");
  assert.equal(DataKnowledgeFoundationModel.businessModel.types.length, 8);
  assert.equal(DataKnowledgeFoundationValidation.rules.length, 48);
  assert.equal(DataKnowledgeFoundationManifest.phases.phaseCount, 4);
  assert.equal(DataKnowledgeFoundationCertification.compatibility.certifiedPhases.length, 6);
  assert.equal(DataKnowledgeFoundationCertification.regression.verified, true);
  assert.equal(DataKnowledgeFoundationPlatform.summary.readiness, "ReadyForCertification");
});

test("31. no runtime behavior is exposed by public APIs", () => {
  const runtimeVerb = /fetch|save|persist|query|ingest|process|execute|orchestrat|async|await|http|network|render|delete|insert|update/i;
  for (const name of Object.keys(certificationApi)) {
    assert.ok(!runtimeVerb.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("32. compatibility certification declares all required guarantees", () => {
  const guarantees = DataKnowledgeFoundationCompatibilityCertification.guarantees;
  assert.equal(guarantees.metadataOnly, true);
  assert.equal(guarantees.runtimeFree, true);
  assert.equal(guarantees.deepFrozen, true);
  assert.equal(guarantees.deterministic, true);
  assert.equal(guarantees.publicApiStable, true);
  assert.equal(guarantees.ownershipProtected, true);
  assert.equal(guarantees.dependencyProtected, true);
  assert.equal(guarantees.manifestDriven, true);
  assert.equal(guarantees.canonicalReferencesPreserved, true);
  assert.equal(guarantees.readyForFreeze, true);
});

test("final certification is CERTIFIED, STABLE, and ReadyForFreeze", () => {
  assert.equal(DataKnowledgeFoundationCertification.metadata.certificationStatus, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationCertification.metadata.stability, "STABLE");
  assert.equal(DataKnowledgeFoundationCertification.metadata.readiness, "ReadyForFreeze");
  assert.equal(DataKnowledgeFoundationCertificationManifest.certificationStatus, "CERTIFIED");
});
