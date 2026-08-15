/**
 * P1:6 — End-to-End Executive Advisor Integration & Certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_INVARIANTS,
  DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_PRINCIPLES,
  DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS,
  DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT,
  DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS,
  certifyDataRealityExecutiveAdvisorEndToEnd,
  dataRealityExecutiveAdvisorCertificationIdentity,
  dataRealityExecutiveAdvisorCertificationNamespace,
  dataRealityExecutiveAdvisorCertificationPhase,
  dataRealityExecutiveAdvisorCertificationVersion,
  getDataRealityExecutiveAdvisorCertificationIdentity,
  getDataRealityExecutiveAdvisorCertificationMetadata,
  verifyDataRealityExecutiveAdvisorCertification,
} from "./dataRealityExecutiveAdvisorCertification.ts";
import {
  dataRealityExecutiveAdvisorIntegrationIdentity,
  dataRealityExecutiveAdvisorIntegrationNamespace,
  dataRealityExecutiveAdvisorIntegrationPhase,
  dataRealityExecutiveAdvisorIntegrationVersion,
  getDataRealityExecutiveAdvisorIntegrationIdentity,
  resolveDataRealityExecutiveAdvisorIntegration,
} from "./dataRealityExecutiveAdvisorIntegration.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { composeDataRealityExecutiveAdvisorResponse } from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import { NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS } from "./dataRealityStageProjection.ts";

const here = dirname(fileURLToPath(import.meta.url));

function sharedContext() {
  return {
    focusedObjectId:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.focusedObjectId,
    selectedObjectIds:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.selectedObjectIds,
    currentWorkspace:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.currentWorkspace,
    requestedIntent:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.requestedIntent,
    responseMode:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.responseMode,
  };
}

test("P1:6 integration identity", () => {
  const identity = getDataRealityExecutiveAdvisorIntegrationIdentity();
  assert.equal(
    dataRealityExecutiveAdvisorIntegrationIdentity,
    "P1:6/DataRealityExecutiveAdvisorIntegration",
  );
  assert.equal(identity.identity, "P1:6/DataRealityExecutiveAdvisorIntegration");
  assert.equal(dataRealityExecutiveAdvisorIntegrationVersion, "1.0.0");
  assert.equal(
    dataRealityExecutiveAdvisorIntegrationNamespace,
    "nexora.data-reality.executive-advisor.integration",
  );
  assert.equal(dataRealityExecutiveAdvisorIntegrationPhase, "Integration");
  assert.equal(Object.isFrozen(identity), true);
});

test("P1:6 certification identity and metadata", () => {
  const identity = getDataRealityExecutiveAdvisorCertificationIdentity();
  assert.equal(
    dataRealityExecutiveAdvisorCertificationIdentity,
    "P1:6/DataRealityExecutiveAdvisorEndToEndCertification",
  );
  assert.equal(
    identity.identity,
    "P1:6/DataRealityExecutiveAdvisorEndToEndCertification",
  );
  assert.equal(dataRealityExecutiveAdvisorCertificationVersion, "1.0.0");
  assert.equal(
    dataRealityExecutiveAdvisorCertificationNamespace,
    "nexora.data-reality.executive-advisor.certification",
  );
  assert.equal(
    dataRealityExecutiveAdvisorCertificationPhase,
    "EndToEndCertification",
  );
  assert.equal(
    DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS,
    "Verified · Certified · Stable · ReadyForMVP",
  );

  const metadata = getDataRealityExecutiveAdvisorCertificationMetadata();
  assert.equal(metadata.capabilities.length, 27);
  assert.equal(metadata.invariants.length, 45);
  assert.equal(metadata.principles.length, 9);
  assert.equal(metadata.requiredCheckIds.length, 30);
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_INVARIANTS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_PRINCIPLES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS),
    true,
  );
});

test("P1:6 Dataset A end-to-end baseline", () => {
  const result = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });

  const productionKpi = result.dataRealitySnapshot.kpis.find(
    (entry) => entry.objectKey === "production",
  )!;
  assert.equal(productionKpi.value, 87);
  assert.equal(
    result.advisorContext.observations.find(
      (entry) => entry.subjectId === "obj-capacity",
    )?.state,
    "watch",
  );
  assert.equal(result.advisorContext.dominantState, "watch");
  assert.equal(result.advisorContext.attention, "medium");
  assert.equal(result.response.tone, "attention");
  assert.equal(result.response.requiresImmediateAttention, false);
  assert.equal(
    result.advisoryResolution.guidance.some((entry) => entry.kind === "escalate"),
    false,
  );
});

test("P1:6 Dataset B end-to-end operational pressure", () => {
  const result = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  const productionKpi = result.dataRealitySnapshot.kpis.find(
    (entry) => entry.objectKey === "production",
  )!;
  assert.equal(productionKpi.value, 96);
  assert.equal(
    result.advisorContext.observations.find(
      (entry) => entry.subjectId === "obj-capacity",
    )?.state,
    "critical",
  );
  assert.equal(result.advisorContext.dominantState, "critical");
  assert.equal(result.advisorContext.attention, "immediate");
  assert.equal(result.response.tone, "critical");
  assert.equal(result.response.requiresImmediateAttention, true);
  assert.ok(
    result.advisoryResolution.guidance.some((entry) => entry.priority === "urgent"),
  );
});

test("P1:6 A/B causal difference through shared integration", () => {
  const a = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });
  const b = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  const kpiA = a.dataRealitySnapshot.kpis.find(
    (entry) => entry.objectKey === "production",
  )!.value;
  const kpiB = b.dataRealitySnapshot.kpis.find(
    (entry) => entry.objectKey === "production",
  )!.value;
  assert.notEqual(kpiA, kpiB);

  const changedObservations = a.advisorContext.observations.filter((obsA) => {
    const obsB = b.advisorContext.observations.find(
      (entry) => entry.subjectId === obsA.subjectId,
    );
    return obsB && obsB.state !== obsA.state;
  });
  assert.equal(changedObservations.length, 5);

  assert.notEqual(a.advisorContext.dominantState, b.advisorContext.dominantState);
  assert.notEqual(a.response.tone, b.response.tone);
  assert.notEqual(
    a.response.requiresImmediateAttention,
    b.response.requiresImmediateAttention,
  );
  assert.notEqual(a.response.headline, b.response.headline);
});

test("P1:6 Dataset B response traces backward to evidence and dataset", () => {
  const result = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  const primaryGuidance = result.advisoryResolution.guidance.find(
    (entry) => entry.id === result.advisoryResolution.primaryGuidanceId,
  )!;
  assert.ok(primaryGuidance);
  assert.ok(result.response.guidanceIds.includes(primaryGuidance.id));

  const sourceCandidateId = primaryGuidance.sourceCandidateIds[0];
  if (sourceCandidateId) {
    assert.ok(
      result.advisoryResolution.candidates.some(
        (entry) => entry.id === sourceCandidateId,
      ),
    );
  }

  const observation = result.advisorContext.observations.find((entry) =>
    primaryGuidance.observationIds.includes(entry.id),
  )!;
  assert.equal(observation.subjectId, "obj-capacity");

  const kpiEvidence = result.advisorContext.evidence.find(
    (entry) =>
      observation.evidenceIds.includes(entry.id) && entry.sourceKind === "kpi",
  )!;
  assert.equal(kpiEvidence.value, 96);
  assert.equal(result.dataRealitySnapshot.datasetId, getExecutiveOperationsPressureDataset().id);
  assert.ok(
    result.traceability.traceLinks.some(
      (link) =>
        link.relation === "dataset-produces-snapshot" &&
        link.fromId === getExecutiveOperationsPressureDataset().id,
    ),
  );
});

test("P1:6 object-model and Stage ID stability", () => {
  const a = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });
  const b = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.deepEqual(
    a.advisorContext.observations.map((entry) => entry.subjectId).sort(),
    b.advisorContext.observations.map((entry) => entry.subjectId).sort(),
  );

  const stageIds = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.map(
    (binding) => binding.mvpStageObjectId,
  );
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    assert.ok(stageIds.includes(id));
    assert.ok(
      a.advisorContext.observations.some((entry) => entry.subjectId === id),
    );
  }
});

test("P1:6 response-mode truth equivalence on Dataset B", () => {
  const result = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  for (const mode of ["minimum", "brief", "standard", "detailed"] as const) {
    const response = composeDataRealityExecutiveAdvisorResponse({
      context: result.advisorContext,
      advisoryResolution: result.advisoryResolution,
      mode,
      includeSecondaryGuidance: mode === "detailed",
    });
    assert.equal(response.tone, "critical");
    assert.equal(response.requiresImmediateAttention, true);
    assert.equal(response.primarySubjectId, "obj-capacity");
    assert.equal(response.headline, result.response.headline);
  }
});

test("P1:6 no upstream mutation", () => {
  const dataset = getExecutiveOperationsDemoDataset();
  const before = JSON.stringify(dataset);
  const result = resolveDataRealityExecutiveAdvisorIntegration({
    dataset,
    ...sharedContext(),
  });
  const snapshotJson = JSON.stringify(result.dataRealitySnapshot);
  const observationJson = JSON.stringify(result.observationResolution);
  const contextJson = JSON.stringify(result.advisorContext);
  const advisoryJson = JSON.stringify(result.advisoryResolution);

  assert.equal(JSON.stringify(dataset), before);
  assert.equal(JSON.stringify(result.dataRealitySnapshot), snapshotJson);
  assert.equal(JSON.stringify(result.observationResolution), observationJson);
  assert.equal(JSON.stringify(result.advisorContext), contextJson);
  assert.equal(JSON.stringify(result.advisoryResolution), advisoryJson);
});

test("P1:6 full certification passes ReadyForMVP", () => {
  const certification = certifyDataRealityExecutiveAdvisorEndToEnd();
  assert.equal(
    certification.status,
    "Verified · Certified · Stable · ReadyForMVP",
  );
  assert.equal(certification.passed, true);
  assert.equal(verifyDataRealityExecutiveAdvisorCertification(certification), true);

  for (const requiredId of DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS) {
    const found = certification.checks.find((entry) => entry.id === requiredId);
    assert.ok(found, `missing check ${requiredId}`);
    assert.equal(found!.passed, true, `${requiredId}: ${found!.reason}`);
  }

  const productionDiff = certification.causalDifferences.find(
    (entry) =>
      entry.subjectId === "obj-capacity" && entry.dimension === "kpi",
  )!;
  assert.equal(productionDiff.changed, true);
  assert.equal(productionDiff.datasetAValue, "87");
  assert.equal(productionDiff.datasetBValue, "96");
});

test("P1:6 dependency and non-duplication rules", () => {
  const integrationSource = readFileSync(
    join(here, "dataRealityExecutiveAdvisorIntegration.ts"),
    "utf8",
  );
  const certificationSource = readFileSync(
    join(here, "dataRealityExecutiveAdvisorCertification.ts"),
    "utf8",
  );

  assert.ok(
    integrationSource.includes("resolveDatasetExecutiveReality"),
  );
  assert.ok(
    integrationSource.includes("resolveDataRealityExecutiveObservationResolution"),
  );
  assert.ok(integrationSource.includes("buildDataRealityAwareAdvisorContext"));
  assert.ok(
    integrationSource.includes("resolveDataRealityExecutiveAdvisoryResolution"),
  );
  assert.ok(
    integrationSource.includes("composeDataRealityExecutiveAdvisorResponse"),
  );

  assert.equal(/normalizeDatasetToBusinessFacts/.test(integrationSource), false);
  assert.equal(/computeNexoraKPIs/.test(integrationSource), false);
  assert.equal(/resolveObjectExecutiveStates/.test(integrationSource), false);
  assert.equal(/buildBusinessFactEvidence/.test(integrationSource), false);
  assert.equal(/candidateIntentsForState/.test(integrationSource), false);
  assert.equal(/composeSituationText/.test(integrationSource), false);

  for (const source of [integrationSource, certificationSource]) {
    for (const pattern of [
      /from\s+["']react["']/,
      /from\s+["']next\//,
      /from\s+["']three["']/,
      /from\s+["']@react-three\//,
      /from\s+["']openai["']/,
      /from\s+["']@anthropic-ai\//,
    ]) {
      assert.equal(pattern.test(source), false, String(pattern));
    }
  }
});
