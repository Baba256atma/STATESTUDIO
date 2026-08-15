/**
 * SP:2.7 — Executive Object Visual Integration & Certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP,
  EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST,
  EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY,
  certifyExecutiveObjectVisualIntegration,
  executiveObjectVisualIntegrationCertificationIdentity,
  getExecutiveObjectVisualIntegrationCertificationIdentity,
  verifyExecutiveObjectVisualIntegrationCertification,
} from "./executiveObjectVisualIntegrationCertification.ts";

const certificationSource = readFileSync(
  new URL("./executiveObjectVisualIntegrationCertification.ts", import.meta.url),
  "utf8",
);

test("1. SP:2.7 identity and certification-only boundary", () => {
  const identity = getExecutiveObjectVisualIntegrationCertificationIdentity();
  assert.equal(
    identity.id,
    "SP:2.7/ExecutiveObjectVisualIntegrationCertification",
  );
  assert.equal(identity.version, "2.7.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-object-visual-integration-certification",
  );
  assert.equal(
    identity.architecturalRole,
    "PresentationOnlyExecutiveObjectVisualIntegrationCertification",
  );
  assert.equal(identity.readiness, "AwaitingHumanVisualSignOff");
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .startsSp3Atmosphere,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .autoClaimsHumanVisualSignOff,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .freezesSp2Automatically,
    false,
  );
  assert.equal(executiveObjectVisualIntegrationCertificationIdentity, identity.id);
  assert.equal(verifyExecutiveObjectVisualIntegrationCertification().ok, true);
});

test("2. certify API returns Level A+B certified with human pending", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  assert.equal(result.structuralStatus, "certified");
  assert.equal(result.automatedStatus, "certified");
  assert.equal(result.humanVisualStatus, "pending");
  assert.equal(result.sp2StructurallyComplete, true);
  assert.equal(result.sp2FullyVisuallySignedOff, false);
  assert.equal(result.levels.A, "certified");
  assert.equal(result.levels.B, "certified");
  assert.equal(result.levels.C, "pending");
  assert.equal(result.counts.failed, 0);
  assert.ok(result.counts.passed > 0);
  assert.ok(result.counts.pending > 0);
  assert.equal(
    result.counts.pending,
    EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST.length,
  );
});

test("3. single-authority map is explicit", () => {
  assert.deepEqual(
    { ...EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP },
    {
      visual: "SP:2.1",
      geometry: "SP:2.2",
      material: "SP:2.3",
      stateSeverity: "SP:2.4",
      labelDensity: "SP:2.5",
      focusAttentionPresentation: "SP:2.6",
      cameraSpatial: "SP:1",
    },
  );
  const result = certifyExecutiveObjectVisualIntegration();
  const authority = result.findings.find(
    (item) => item.id === "A.singleAuthority.map",
  );
  assert.ok(authority);
  assert.equal(authority?.status, "pass");
});

test("4. renderer / no-ID-hack / no-shader structural findings pass", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  for (const id of [
    "A.renderer.consumesSp21",
    "A.renderer.meshStandard",
    "A.renderer.dumb",
    "A.renderer.noIdHacks",
    "A.performance.memoizedResolve",
    "A.chain.composition",
  ]) {
    const finding = result.findings.find((item) => item.id === id);
    assert.ok(finding, `missing finding ${id}`);
    assert.equal(finding?.status, "pass", finding?.message);
  }
});

test("5. mandatory critical-background non-edge scenario passes", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  const scenario = result.scenarioResults.find(
    (item) => item.scenarioId === "criticalBackground.nonEdge",
  );
  assert.ok(scenario);
  assert.equal(scenario?.status, "pass");
  const finding = result.findings.find(
    (item) => item.id === "B.criticalBackground.nonEdge",
  );
  assert.equal(finding?.status, "pass");
});

test("6. core automated scenarios pass", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  const required = [
    "baseline.overview",
    "mixed.semanticTypes",
    "focus.normal",
    "focus.critical",
    "related.critical",
    "recommendation.orthogonal",
    "unresolved.distinct",
    "many.critical",
    "dense.scene",
    "occlusion.deliveryLike",
    "ui.exclusion.riskLike",
    "navigation.orbitTiltZoom",
    "focus.switchAndExit",
    "interaction.hoverSelection",
    "labels.longAndMissing",
    "labels.collision",
    "invariants.stateSpatialBusiness",
    "ranges.determinism",
    "scenes.dominant",
    "labels.densityProgressive",
    "geometry.mappingAuthority",
  ];
  for (const scenarioId of required) {
    const scenario = result.scenarioResults.find(
      (item) => item.scenarioId === scenarioId,
    );
    assert.ok(scenario, `missing scenario ${scenarioId}`);
    assert.equal(scenario?.status, "pass", scenarioId);
  }
});

test("7. human checklist remains pending and complete", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  assert.equal(EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST.length, 18);
  const human = result.scenarioResults.find(
    (item) => item.scenarioId === "human.visualSignOff",
  );
  assert.ok(human);
  assert.equal(human?.status, "pending");
  for (const item of EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST) {
    const finding = result.findings.find((entry) => entry.id === `C.${item}`);
    assert.ok(finding, item);
    assert.equal(finding?.status, "pending");
  }
});

test("8. verified human status only when explicitly supplied", () => {
  const pending = certifyExecutiveObjectVisualIntegration();
  assert.equal(pending.sp2FullyVisuallySignedOff, false);
  const verified = certifyExecutiveObjectVisualIntegration({
    humanVisualStatus: "verified",
  });
  assert.equal(verified.humanVisualStatus, "verified");
  assert.equal(verified.sp2FullyVisuallySignedOff, true);
  assert.equal(verified.levels.C, "certified");
  assert.equal(verified.counts.pending, 0);
});

test("9. forced failures surface without burying under pass counts", () => {
  const structural = certifyExecutiveObjectVisualIntegration({
    forceStructuralFailure: true,
  });
  assert.equal(structural.structuralStatus, "failed");
  assert.equal(structural.sp2StructurallyComplete, false);
  assert.ok(structural.findings.some((item) => item.id === "A.forced.failure"));

  const automated = certifyExecutiveObjectVisualIntegration({
    forceAutomatedFailure: true,
  });
  assert.equal(automated.automatedStatus, "failed");
  assert.equal(automated.sp2StructurallyComplete, false);
  assert.ok(automated.findings.some((item) => item.id === "B.forced.failure"));
});

test("10. certification does not start SP:3 and does not freeze automatically", () => {
  assert.doesNotMatch(certificationSource, /fog|postprocessing|ambient animation/i);
  assert.doesNotMatch(certificationSource, /startsSp3Atmosphere:\s*true/);
  assert.doesNotMatch(certificationSource, /Frozen|PublicIndex|Locked/);
  assert.match(
    certificationSource,
    /certifyExecutiveObjectVisualIntegration/,
  );
  assert.match(
    certificationSource,
    /AwaitingHumanVisualSignOff/,
  );
});

test("11. findings expose owning phase and category", () => {
  const result = certifyExecutiveObjectVisualIntegration();
  for (const finding of result.findings) {
    assert.ok(finding.phase.length > 0);
    assert.ok(finding.category.length > 0);
    assert.ok(finding.message.length > 0);
    assert.ok(["pass", "fail", "pending"].includes(finding.status));
  }
});

test("12. verify helper reports human pending and no SP:3", () => {
  const verification = verifyExecutiveObjectVisualIntegrationCertification();
  assert.equal(verification.ok, true);
  assert.equal(verification.structuralCertified, true);
  assert.equal(verification.automatedCertified, true);
  assert.equal(verification.humanPending, true);
  assert.equal(verification.doesNotStartSp3, true);
  assert.equal(verification.doesNotAutoClaimHumanSignOff, true);
});
