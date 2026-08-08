import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_CERTIFICATION_CHECK_STATUSES,
  DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS,
  DIRECTOR_RUNTIME_CERTIFICATION_PROFILES,
  DIRECTOR_RUNTIME_CERTIFICATION_REQUIREMENT_LEVELS,
  DIRECTOR_RUNTIME_CERTIFICATION_STATUSES,
  certifyDirectorRuntimeIntegration,
  createDirectorRuntimeCertificationCheck,
  createDirectorRuntimeCertificationEvidence,
  createDirectorRuntimeCertificationNote,
  createDirectorRuntimeCertificationRequest,
  directorRuntimeCanonicalCertificationFixture,
  directorRuntimeCertificationRegistry,
  directorRuntimeCertificationRegistryCount,
  directorRuntimeCertifiedGuaranteeCount,
  directorRuntimeCertifiedGuarantees,
  directorRuntimeIntegrationCertificationIdentity,
  directorRuntimeIntegrationCertificationManifest,
  directorRuntimeIntegrationCertificationMetadata,
  directorRuntimeIntegrationCertificationNamespace,
  directorRuntimeIntegrationCertificationUpstream,
  directorRuntimeIntegrationCertificationVersion,
  getDirectorRuntimeCertificationRegistry,
  isDirectorRuntimeCertificationCheckStatus,
  isDirectorRuntimeCertificationDomain,
  isDirectorRuntimeCertificationProfile,
  isDirectorRuntimeCertificationRequirementLevel,
  isDirectorRuntimeCertificationStatus,
  resolveDirectorRuntimeCertificationDecision,
  resolveDirectorRuntimeCertificationStatus,
  verifyDirectorRuntimeIntegrationCertification,
  type DirectorRuntimeCertificationCheck,
  type DirectorRuntimeCertificationRequest,
} from "./directorRuntimeIntegrationCertification.ts";
import {
  directorRuntimeIntegrationValidationIdentity,
  directorRuntimeIntegrationValidationMetadata,
} from "./directorRuntimeIntegrationValidation.ts";

const sourceText = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationCertification.ts",
  ),
  "utf8",
);

function cloneFixture(
  overrides: Partial<DirectorRuntimeCertificationRequest> = {},
): DirectorRuntimeCertificationRequest {
  const base = structuredClone(directorRuntimeCanonicalCertificationFixture);
  return {
    ...base,
    ...overrides,
    implementationEvidence: overrides.implementationEvidence ?? base.implementationEvidence,
    validationRequest: overrides.validationRequest ?? base.validationRequest,
    validationContext: overrides.validationContext ?? base.validationContext,
  };
}

function check(
  status: DirectorRuntimeCertificationCheck["status"],
  requirementLevel: DirectorRuntimeCertificationCheck["requirementLevel"] = "required",
): DirectorRuntimeCertificationCheck {
  return createDirectorRuntimeCertificationCheck({
    checkId: `${requirementLevel}:${status}`,
    domain: "identity",
    requirementLevel,
    status,
    message: `${status} check`,
    evidenceIds: ["evidence"],
  });
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) => deeplyFrozen(item, seen));
}

describe("DRI-1:6 Director Runtime Integration Certification", () => {
  it("publishes exact identity and consumes only DRI-1:5 Validation", () => {
    assert.equal(directorRuntimeIntegrationCertificationIdentity, "DRI-1:6/DirectorRuntimeIntegrationCertification");
    assert.equal(directorRuntimeIntegrationCertificationVersion, "1.6.0");
    assert.equal(directorRuntimeIntegrationCertificationNamespace, "nexora.dri.runtime.integration.certification");
    assert.equal(directorRuntimeIntegrationCertificationUpstream, directorRuntimeIntegrationValidationIdentity);
    assert.deepEqual(directorRuntimeIntegrationCertificationMetadata, {
      identity: "DRI-1:6/DirectorRuntimeIntegrationCertification",
      version: "1.6.0",
      namespace: "nexora.dri.runtime.integration.certification",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Certification",
      status: "CertificationReady",
      upstream: "DRI-1:5/DirectorRuntimeIntegrationValidation",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationValidationMetadata.authority,
    });
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationValidation.ts"]);
  });

  it("publishes exact ordered certification vocabulary", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS, [
      "identity", "dependency", "foundation", "contracts", "mapping", "binding",
      "validation", "authority", "determinism", "immutability", "architecture", "readiness",
    ]);
    assert.deepEqual(DIRECTOR_RUNTIME_CERTIFICATION_CHECK_STATUSES, ["passed", "failed", "blocked", "not-applicable"]);
    assert.deepEqual(DIRECTOR_RUNTIME_CERTIFICATION_STATUSES, ["certified", "certified-with-notes", "not-certified", "blocked"]);
    assert.deepEqual(DIRECTOR_RUNTIME_CERTIFICATION_REQUIREMENT_LEVELS, ["required", "recommended", "informational"]);
    assert.deepEqual(DIRECTOR_RUNTIME_CERTIFICATION_PROFILES, ["core", "strict", "platform"]);
    assert.equal(isDirectorRuntimeCertificationDomain("unknown"), false);
    assert.equal(isDirectorRuntimeCertificationCheckStatus("unknown"), false);
    assert.equal(isDirectorRuntimeCertificationStatus("unknown"), false);
    assert.equal(isDirectorRuntimeCertificationRequirementLevel("unknown"), false);
    assert.equal(isDirectorRuntimeCertificationProfile("unknown"), false);
  });

  it("creates immutable evidence, checks, notes, and requests", () => {
    const evidence = createDirectorRuntimeCertificationEvidence({
      evidenceId: "Evidence:KEEP", sourceStage: "DRI-1:5", subject: "identity",
      result: "pass", detail: "Deterministic detail",
    });
    const certificationCheck = createDirectorRuntimeCertificationCheck({
      checkId: "Check:KEEP", domain: "identity", requirementLevel: "required",
      status: "passed", message: "Identity passed", evidenceIds: [evidence.evidenceId],
    });
    const note = createDirectorRuntimeCertificationNote({ code: "NOTE", message: "Future responsibility", domain: "readiness" });
    const input = cloneFixture({ suppliedEvidence: [evidence] });
    const before = structuredClone(input);
    const request = createDirectorRuntimeCertificationRequest(input);
    assert.deepEqual(input, before);
    assert.equal(deeplyFrozen(evidence), true);
    assert.equal(deeplyFrozen(certificationCheck), true);
    assert.equal(deeplyFrozen(note), true);
    assert.equal(deeplyFrozen(request), true);
  });

  it("resolves overall status with required precedence", () => {
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("passed")], []), "certified");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("passed"), check("failed", "recommended")], []), "certified-with-notes");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("failed")], []), "not-certified");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("blocked")], []), "blocked");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("blocked"), check("failed")], []), "not-certified");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("not-applicable", "informational")], []), "certified");
    assert.equal(resolveDirectorRuntimeCertificationStatus([check("passed")], [createDirectorRuntimeCertificationNote({ code: "N", message: "note", domain: "readiness" })]), "certified-with-notes");
  });

  it("certifies the canonical fixture and produces Platform readiness", () => {
    const report = certifyDirectorRuntimeIntegration(directorRuntimeCanonicalCertificationFixture);
    assert.equal(report.status, "certified");
    assert.deepEqual(report.decision, { certified: true, status: "certified", readyForPlatform: true });
    assert.equal(report.validationReport.status, "valid");
    assert.equal(report.requiredCheckCount, 12);
    assert.equal(report.passedCount, 13);
    assert.deepEqual(report.checks.slice(0, 12).map(({ domain }) => domain), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS);
    assert.deepEqual(report.certifiedDomains, DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS);
    assert.equal(deeplyFrozen(report), true);
    assert.equal(verifyDirectorRuntimeIntegrationCertification(), true);
  });

  it("applies core, strict, and platform profiles in canonical domain order", () => {
    const core = certifyDirectorRuntimeIntegration(cloneFixture({ profile: "core", domains: [], includeRecommendedChecks: false }));
    const strict = certifyDirectorRuntimeIntegration(cloneFixture({ profile: "strict", domains: [], includeRecommendedChecks: false }));
    const platform = certifyDirectorRuntimeIntegration(cloneFixture({ profile: "platform", domains: [], includeRecommendedChecks: false }));
    assert.equal(core.status, "certified");
    assert.equal(strict.status, "certified");
    assert.equal(platform.status, "certified");
    assert.deepEqual(core.checks.map(({ domain }) => domain), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS.slice(0, 7));
    assert.deepEqual(strict.checks.map(({ domain }) => domain), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS.slice(0, 11));
    assert.deepEqual(platform.checks.map(({ domain }) => domain), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS);
    assert.equal(core.decision.readyForPlatform, false);
    assert.equal(strict.decision.readyForPlatform, false);
    assert.equal(platform.decision.readyForPlatform, true);
  });

  it("fails modified identities, versions, namespaces, and dependencies", () => {
    for (const mutation of [
      { identity: "DRI-1:1/Wrong" }, { version: "9.9.9" }, { namespace: "wrong.namespace" },
    ]) {
      const input = cloneFixture();
      const stages = input.implementationEvidence.stages.map((stage, index) => index === 0 ? { ...stage, ...mutation } : stage);
      const report = certifyDirectorRuntimeIntegration(cloneFixture({ implementationEvidence: { ...input.implementationEvidence, stages } }));
      assert.equal(report.status, "not-certified");
      assert.equal(report.checks[0]?.domain, "identity");
      assert.equal(report.checks[0]?.status, "failed");
    }
    const input = cloneFixture();
    const stages = input.implementationEvidence.stages.map((stage, index) => index === 5 ? { ...stage, upstream: "DRI-1:3/DirectorRuntimeIntegrationMapping" } : stage);
    const report = certifyDirectorRuntimeIntegration(cloneFixture({ implementationEvidence: { ...input.implementationEvidence, stages } }));
    assert.equal(report.checks.find(({ domain }) => domain === "dependency")?.status, "failed");
    assert.equal(report.status, "not-certified");
  });

  it("blocks missing evidence and fails incomplete required stage capabilities", () => {
    for (const [domain, field] of [
      ["foundation", "foundationComplete"], ["contracts", "contractsComplete"],
      ["mapping", "mappingComplete"], ["binding", "bindingComplete"],
      ["validation", "validationComplete"],
    ] as const) {
      const input = cloneFixture();
      const missing = { ...input.implementationEvidence } as Record<string, unknown>;
      delete missing[field];
      const blocked = certifyDirectorRuntimeIntegration(cloneFixture({ implementationEvidence: missing as unknown as typeof input.implementationEvidence }));
      assert.equal(blocked.checks.find((entry) => entry.domain === domain)?.status, "blocked");
      assert.equal(blocked.status, "blocked");
      const failed = certifyDirectorRuntimeIntegration(cloneFixture({ implementationEvidence: { ...input.implementationEvidence, [field]: false } }));
      assert.equal(failed.checks.find((entry) => entry.domain === domain)?.status, "failed");
      assert.equal(failed.status, "not-certified");
    }
  });

  it("requires accepted release validation and exposes mapping/lifecycle failures", () => {
    const unresolved = cloneFixture();
    const validationRequest = {
      ...unresolved.validationRequest,
      mappingResolutions: [{ requestId: "unresolved", status: "unresolved", mappings: [], matchedRuleIds: [] }],
    };
    const unresolvedReport = certifyDirectorRuntimeIntegration(cloneFixture({ validationRequest }));
    assert.equal(unresolvedReport.validationReport.status, "valid-with-warnings");
    assert.equal(unresolvedReport.checks.find(({ domain }) => domain === "validation")?.status, "failed");

    const invalidTransition = cloneFixture();
    const retired = { ...invalidTransition.validationRequest.bindings[0]!, lifecycle: "retired" as const };
    const transitionRequest = { ...invalidTransition.validationRequest, transitions: [{ binding: retired, nextState: "active" as const }] };
    const transitionReport = certifyDirectorRuntimeIntegration(cloneFixture({ validationRequest: transitionRequest }));
    assert.equal(transitionReport.validationReport.status, "invalid");
    assert.equal(transitionReport.status, "not-certified");
  });

  it("fails reverse direction, Runtime authority violations, and fatal validation", () => {
    const reverse = cloneFixture();
    const reverseReport = certifyDirectorRuntimeIntegration(cloneFixture({
      validationContext: { ...reverse.validationContext, expectedDirection: "director-to-runtime" as "runtime-to-director" },
    }));
    assert.equal(reverseReport.validationReport.status, "fatal");
    assert.equal(reverseReport.checks.find(({ domain }) => domain === "authority")?.status, "failed");
    assert.equal(reverseReport.status, "not-certified");

    const authority = cloneFixture();
    const authorityReport = certifyDirectorRuntimeIntegration(cloneFixture({
      validationContext: { ...authority.validationContext, runtimeAuthoritative: false },
      implementationEvidence: { ...authority.implementationEvidence, runtimeAuthoritative: false },
    }));
    assert.equal(authorityReport.validationReport.status, "fatal");
    assert.equal(authorityReport.checks.find(({ domain }) => domain === "authority")?.status, "failed");
  });

  it("fails forbidden architecture evidence and preserves every failure", () => {
    const input = cloneFixture();
    const report = certifyDirectorRuntimeIntegration(cloneFixture({
      implementationEvidence: {
        ...input.implementationEvidence,
        foundationComplete: false,
        contractsComplete: false,
        architectureSafe: false,
        businessIsolated: false,
      },
      validationContext: { ...input.validationContext, forbiddenDependencies: ["react", "three"] },
    }));
    assert.equal(report.status, "not-certified");
    assert.deepEqual(
      report.checks.filter(({ status }) => status === "failed").map(({ domain }) => domain),
      ["foundation", "contracts", "validation", "architecture", "readiness"],
    );
    assert.equal(report.failedCount, 5);
    assert.equal(report.evidence.length, report.checks.length);
    assert.deepEqual(report.notes, []);
    assert.equal(report.decision.readyForPlatform, false);
  });

  it("is deterministic, immutable, ordered, and business-value independent", () => {
    const input = cloneFixture();
    const before = structuredClone(input);
    const left = certifyDirectorRuntimeIntegration(input);
    const right = certifyDirectorRuntimeIntegration(input);
    assert.deepEqual(input, before);
    assert.deepEqual(left, right);
    const low = cloneFixture({ validationRequest: { ...input.validationRequest, payloads: [{ kpi: 10 }] } });
    const high = cloneFixture({ validationRequest: { ...input.validationRequest, payloads: [{ kpi: 90 }] } });
    assert.deepEqual(certifyDirectorRuntimeIntegration(low), certifyDirectorRuntimeIntegration(high));
    assert.deepEqual(left.checks.map(({ domain }) => domain).slice(0, 12), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS);
    assert.deepEqual(left.evidence.map(({ subject }) => subject).slice(0, 12), DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS);
  });

  it("publishes the complete immutable manifest", () => {
    assert.equal(directorRuntimeIntegrationCertificationManifest.identity, directorRuntimeIntegrationCertificationIdentity);
    assert.equal(directorRuntimeIntegrationCertificationManifest.version, "1.6.0");
    assert.equal(directorRuntimeIntegrationCertificationManifest.namespace, "nexora.dri.runtime.integration.certification");
    assert.equal(directorRuntimeIntegrationCertificationManifest.layer, "DRI");
    assert.equal(directorRuntimeIntegrationCertificationManifest.phase, "DRI-1");
    assert.equal(directorRuntimeIntegrationCertificationManifest.stage, "Certification");
    assert.equal(directorRuntimeIntegrationCertificationManifest.status, "CertificationReady");
    assert.equal(directorRuntimeIntegrationCertificationManifest.upstream, directorRuntimeIntegrationValidationIdentity);
    assert.equal(directorRuntimeIntegrationCertificationManifest.integrationDirection, "runtime-to-director");
    assert.equal(directorRuntimeIntegrationCertificationManifest.readinessTarget, "DRI-1:7/DirectorRuntimeIntegrationPlatform");
    assert.equal(deeplyFrozen(directorRuntimeIntegrationCertificationManifest), true);
  });

  it("publishes sixteen guarantees and seventeen registry concepts", () => {
    assert.equal(directorRuntimeCertifiedGuaranteeCount, 16);
    assert.equal(directorRuntimeCertifiedGuaranteeCount, directorRuntimeCertifiedGuarantees.length);
    assert.equal(directorRuntimeCertificationRegistryCount, 17);
    assert.equal(directorRuntimeCertificationRegistryCount, directorRuntimeCertificationRegistry.length);
    assert.equal(getDirectorRuntimeCertificationRegistry(), directorRuntimeCertificationRegistry);
    assert.equal(deeplyFrozen(directorRuntimeCertifiedGuarantees), true);
    assert.equal(deeplyFrozen(directorRuntimeCertificationRegistry), true);
  });

  it("maps final decisions without hiding notes or failures", () => {
    assert.deepEqual(resolveDirectorRuntimeCertificationDecision("certified", true), { certified: true, status: "certified", readyForPlatform: true });
    assert.deepEqual(resolveDirectorRuntimeCertificationDecision("certified-with-notes", false), { certified: true, status: "certified-with-notes", readyForPlatform: false });
    assert.deepEqual(resolveDirectorRuntimeCertificationDecision("not-certified", true), { certified: false, status: "not-certified", readyForPlatform: false });
    assert.deepEqual(resolveDirectorRuntimeCertificationDecision("blocked", true), { certified: false, status: "blocked", readyForPlatform: false });
  });

  it("contains no UI, renderer, persistence, browser, network, or live integration dependency", () => {
    assert.doesNotMatch(sourceText, /\b(?:React|ReactDOM|THREE|SceneRenderer|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|Math\.random|Date\.now|randomUUID|NODE_ENV)\b/);
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:renderer|database|network|store|nol\/)[^"']*["']/i);
  });
});
