/**
 * NEX-MVP:9 — certification & release tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildNexoraMVPReleaseManifest,
  certifyAndReleaseNexoraMVP,
  certifyNexoraMVP,
  getNexoraMVPCertificationReleaseIdentity,
  NEXORA_MVP_CERTIFICATION_DOMAINS,
  NEXORA_MVP_CERTIFIED_PHASE_CHAIN,
  NEXORA_MVP_PRIMARY_DEMO_FLOW,
  nexoraMVPCanonicalRoute,
  nexoraMVPCertificationImmediateDependency,
  nexoraMVPCertificationReleaseIdentity,
  nexoraMVPCertificationReleaseNamespace,
  nexoraMVPCertificationReleaseVersion,
  nexoraMVPReleaseLockIdentity,
  type NexoraMVPCertificationEvidence,
} from "./nexoraMVPCertificationRelease.ts";
import { getNexoraMVPWorkspaceOrder } from "./nexoraMVPApplicationFoundation.ts";
import { getNexoraMVPPresentationStates } from "./nexoraMVPApplicationFoundation.ts";
import { getNexoraMVPSceneEnvironmentIntent } from "./nexoraMVPApplicationFoundation.ts";

const PASSING_EVIDENCE: NexoraMVPCertificationEvidence = Object.freeze({
  mvpTestSuitePassed: true,
  mvpTypeScriptClean: true,
  productionCompilePassed: true,
  productionTypecheckPassed: true,
  manualProductReviewPassed: true,
});

/** Evidence matching the observed 2026-08-09 repository build outcome. */
export const OBSERVED_RELEASE_EVIDENCE: NexoraMVPCertificationEvidence =
  Object.freeze({
    mvpTestSuitePassed: true,
    mvpTypeScriptClean: true,
    productionCompilePassed: true,
    productionTypecheckPassed: false,
    productionTypecheckFailureScope: "unrelated",
    productionTypecheckDetail:
      "app/lib/dri/directorRuntimeInteractionContracts.ts:249 — pre-existing DRI cast error (outside NEX-MVP).",
    manualProductReviewPassed: true,
  });

describe("NEX-MVP:9 Certification & Release", () => {
  it("1. exact NEX-MVP:9 identity", () => {
    const identity = getNexoraMVPCertificationReleaseIdentity();
    assert.equal(
      identity.id,
      "NEX-MVP:9/NexoraMVPCertificationRelease",
    );
    assert.equal(identity.id, nexoraMVPCertificationReleaseIdentity);
  });

  it("2. version", () => {
    assert.equal(nexoraMVPCertificationReleaseVersion, "1.9.0");
    assert.equal(
      getNexoraMVPCertificationReleaseIdentity().version,
      "1.9.0",
    );
  });

  it("3. namespace", () => {
    assert.equal(
      nexoraMVPCertificationReleaseNamespace,
      "nexora.mvp.certification-release",
    );
  });

  it("4. immediate dependency = NEX-MVP:8", () => {
    assert.equal(
      nexoraMVPCertificationImmediateDependency,
      "NEX-MVP:8/NexoraExecutiveFlowIntegration",
    );
  });

  it("5. complete MVP phase chain", () => {
    assert.equal(NEXORA_MVP_CERTIFIED_PHASE_CHAIN.length, 9);
    assert.equal(
      NEXORA_MVP_CERTIFIED_PHASE_CHAIN[0],
      "NEX-MVP:1/NexoraMVPApplicationFoundation",
    );
    assert.equal(
      NEXORA_MVP_CERTIFIED_PHASE_CHAIN[8],
      "NEX-MVP:9/NexoraMVPCertificationRelease",
    );
  });

  it("6. canonical route = /executive", () => {
    assert.equal(nexoraMVPCanonicalRoute, "/executive");
  });

  it("7. canonical workspace order", () => {
    assert.deepEqual([...getNexoraMVPWorkspaceOrder()], [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]);
  });

  it("8. canonical presentation states", () => {
    assert.deepEqual([...getNexoraMVPPresentationStates()], [
      "minimum",
      "report",
      "operation",
    ]);
  });

  it("9. scene environment mapping", () => {
    assert.equal(getNexoraMVPSceneEnvironmentIntent("overview"), "neutral");
    assert.equal(getNexoraMVPSceneEnvironmentIntent("problem"), "investigate");
    assert.equal(getNexoraMVPSceneEnvironmentIntent("scenario"), "simulate");
    assert.equal(getNexoraMVPSceneEnvironmentIntent("decision"), "commit");
    assert.equal(getNexoraMVPSceneEnvironmentIntent("execution"), "execute");
  });

  it("10. release manifest", () => {
    const { manifest } = certifyAndReleaseNexoraMVP(PASSING_EVIDENCE);
    assert.equal(manifest.route, "/executive");
    assert.equal(manifest.version, "1.9.0");
    assert.equal(manifest.releaseStatus, "Released");
    assert.equal(manifest.certifiedPhases.length, 9);
  });

  it("11. lock identity", () => {
    const { manifest } = certifyAndReleaseNexoraMVP(PASSING_EVIDENCE);
    assert.equal(
      manifest.lockIdentity,
      "NEX-MVP-EXECUTIVE-DECISION-ENVIRONMENT-LOCKED",
    );
    assert.equal(
      nexoraMVPReleaseLockIdentity,
      "NEX-MVP-EXECUTIVE-DECISION-ENVIRONMENT-LOCKED",
    );
  });

  it("12. certification domain uniqueness", () => {
    assert.equal(
      new Set(NEXORA_MVP_CERTIFICATION_DOMAINS).size,
      NEXORA_MVP_CERTIFICATION_DOMAINS.length,
    );
    assert.ok(NEXORA_MVP_CERTIFICATION_DOMAINS.includes("ExecutiveFlow"));
    assert.ok(NEXORA_MVP_CERTIFICATION_DOMAINS.includes("ArchitecturalPurity"));
  });

  it("13. required checks all pass in canonical configuration", () => {
    const result = certifyNexoraMVP(PASSING_EVIDENCE);
    assert.equal(result.status, "Certified");
    assert.equal(result.requiredFailed, 0);
    assert.ok(result.requiredPassed > 0);
    assert.ok(result.checks.every((check) => check.required === false || check.ok));
  });

  it("14. failure result when a required check fails", () => {
    const result = certifyNexoraMVP(PASSING_EVIDENCE, { forceFailure: true });
    assert.equal(result.status, "Failed");
    assert.ok(result.requiredFailed >= 1);
  });

  it("15. release cannot be Released when certification fails", () => {
    const result = certifyNexoraMVP(
      Object.freeze({
        ...PASSING_EVIDENCE,
        productionCompilePassed: false,
      }),
    );
    const manifest = buildNexoraMVPReleaseManifest(result);
    assert.equal(result.status, "Failed");
    assert.notEqual(manifest.releaseStatus, "Released");
  });

  it("15b. unrelated production typecheck debt does not block MVP release", () => {
    const { certification, manifest } = certifyAndReleaseNexoraMVP(
      OBSERVED_RELEASE_EVIDENCE,
    );
    assert.equal(certification.status, "Certified");
    assert.equal(manifest.releaseStatus, "Released");
    assert.ok(
      certification.warnings.some(
        (entry) => entry.id === "production-typecheck-unrelated",
      ),
    );
  });

  it("16. readiness cannot be ReadyForMVPUse when certification fails", () => {
    const result = certifyNexoraMVP(
      Object.freeze({
        ...PASSING_EVIDENCE,
        mvpTestSuitePassed: false,
      }),
    );
    const manifest = buildNexoraMVPReleaseManifest(result);
    assert.equal(manifest.readiness, "NotReady");
    assert.equal(manifest.lockStatus, "Unlocked");
    assert.equal(manifest.freezeStatus, "Unfrozen");
  });

  it("17. deterministic repeated certification result", () => {
    const a = certifyNexoraMVP(PASSING_EVIDENCE);
    const b = certifyNexoraMVP(PASSING_EVIDENCE);
    assert.equal(a.status, b.status);
    assert.equal(a.requiredPassed, b.requiredPassed);
    assert.equal(a.requiredFailed, b.requiredFailed);
    assert.deepEqual(
      a.checks.map((entry) => [entry.id, entry.ok]),
      b.checks.map((entry) => [entry.id, entry.ok]),
    );
  });

  it("18. no prohibited duplicate engine declarations where statically testable", () => {
    const result = certifyNexoraMVP(PASSING_EVIDENCE);
    const audit = result.checks.find(
      (entry) => entry.id === "duplicate-engine-audit",
    );
    assert.ok(audit);
    assert.equal(audit.ok, true);
  });

  it("19. no obvious private-upstream import bypass where statically testable", () => {
    const result = certifyNexoraMVP(PASSING_EVIDENCE);
    const purity = result.checks.find(
      (entry) => entry.id === "architectural-purity",
    );
    assert.ok(purity);
    assert.equal(purity.ok, true);
  });

  it("demo flow documentation exists", () => {
    assert.ok(NEXORA_MVP_PRIMARY_DEMO_FLOW.length >= 6);
  });

  it("domains covered by checks", () => {
    const result = certifyNexoraMVP(PASSING_EVIDENCE);
    const domains = new Set(result.checks.map((entry) => entry.domain));
    for (const domain of NEXORA_MVP_CERTIFICATION_DOMAINS) {
      assert.ok(domains.has(domain), `missing domain ${domain}`);
    }
  });
});
