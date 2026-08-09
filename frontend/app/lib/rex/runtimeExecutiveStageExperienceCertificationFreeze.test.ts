import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS as domains,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES as certificationGuarantees,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES as frozenGuarantees,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES as frozenPresentationStates,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_REGISTRY as registry,
  certifyRuntimeExecutiveStageExperiencePlatform,
  createRuntimeExecutiveStageExperienceFreezeContract,
  createRuntimeExecutiveStageModel,
  evaluateRuntimeExecutiveStageExperienceCompatibility,
  getRuntimeExecutiveStageExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveStageExperienceLockDescriptor,
  inspectRuntimeExecutiveStageExperienceCertificationResult,
  isRuntimeExecutiveStageExperienceCertificationDomain,
  isRuntimeExecutiveStageExperienceCertificationStatus,
  isRuntimeExecutiveStageExperienceCompatibilityStatus,
  isRuntimeExecutiveStageExperienceFreezeStatus,
  isRuntimeExecutiveStageExperienceLockStatus,
  resolveRuntimeExecutiveStageExperience,
  runtimeExecutiveStageExperienceCertificationFreeze as certificationFreeze,
  runtimeExecutiveStageExperienceCertificationFreezeApiNames as apiNames,
  runtimeExecutiveStageExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveStageExperiencePlatform,
  runtimeExecutiveStageExperiencePlatformIdentity,
  validateRuntimeExecutiveStageExperienceCertificationResult,
  validateRuntimeExecutiveStageExperienceFreezeContract,
  verifyRuntimeExecutiveStageExperienceApprovedExports,
  verifyRuntimeExecutiveStageExperienceCertification,
  verifyRuntimeExecutiveStageExperienceCertificationFreeze,
  verifyRuntimeExecutiveStageExperienceFreeze,
  verifyRuntimeExecutiveStageExperienceFreezeInvariants,
  verifyRuntimeExecutiveStageExperiencePlatform,
  verifyRuntimeExecutiveStageExperiencePublicIndexReadiness,
} from "./runtimeExecutiveStageExperienceCertificationFreeze.ts";

import { verifyRuntimeExecutiveStageExperienceOrchestration } from "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration";
import { verifyRuntimeExecutiveStagePresentationAttention } from "@/app/lib/rex/runtimeExecutiveStagePresentationAttention";
import { verifyRuntimeExecutiveStageFocusSelection } from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";
import { verifyRuntimeExecutiveStageModel } from "@/app/lib/rex/runtimeExecutiveStageModel";
import { verifyRuntimeExecutiveStageExperienceContracts } from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";
import { verifyRuntimeExecutiveStageExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";
import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / role", () => {
  assert.equal(
    certificationFreeze.identity,
    "REX-2:8/RuntimeExecutiveStageExperienceCertificationFreeze",
  );
  assert.equal(certificationFreeze.version, "2.8.0");
  assert.equal(
    certificationFreeze.namespace,
    "nexora.rex.stage-experience.certification-freeze",
  );
  assert.equal(certificationFreeze.role, "CertificationAndFreezeBoundary");
  assert.deepEqual(
    getRuntimeExecutiveStageExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:7; no REX-2:1–2:6 imports", () => {
  assert.equal(
    certificationFreeze.upstreamDependency,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
  assert.equal(
    certificationFreeze.upstreamDependency,
    runtimeExecutiveStageExperiencePlatformIdentity,
  );
  assert.equal(
    certificationFreeze.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:ExperienceOrchestration|PresentationAttention|FocusSelection|Model|ExperienceFoundation|ExperienceContracts)["']/,
  );
  assert.equal(boundary.consumesPlatformOnly, true);
  assert.equal(boundary.importsRex26Directly, false);
  assert.equal(boundary.importsRex25Directly, false);
  assert.equal(boundary.importsRex24Directly, false);
  assert.equal(boundary.introducesStageBehavior, false);
});

test("3. certification domains / registry immutability / derived counts", () => {
  assert.equal(domains.length, 22);
  assert.equal(registry.domainCount, 22);
  assert.ok(Object.isFrozen(domains));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(invariants));
  assert.ok(Object.isFrozen(approvedExports));
  assert.ok(Object.isFrozen(certificationFreeze));
  assert.equal(registrySections.length, 14);
  assert.equal(registry.sectionCount, 14);
  assert.equal(
    isRuntimeExecutiveStageExperienceCertificationDomain("identity"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveStageExperienceCertificationDomain("camera"),
    false,
  );
  assert.ok(domains.includes("focus-experience"));
  assert.ok(domains.includes("orchestration-integrity"));
  assert.ok(domains.includes("compatibility"));
});

test("4. canonical platform certifies: Certified / Compatible / Frozen / Locked", () => {
  const report = certifyRuntimeExecutiveStageExperiencePlatform();
  const again = certifyRuntimeExecutiveStageExperiencePlatform();

  assert.equal(report.certificationStatus, "certified");
  assert.equal(report.compatibility.overallStatus, "compatible");
  assert.equal(report.freezeStatus, "frozen");
  assert.equal(report.lockStatus, "locked");
  assert.equal(report.readiness, "ReadyForPublicIndex");
  assert.equal(report.failedCheckCount, 0);
  assert.equal(report.passedCheckCount, report.totalCheckCount);
  assert.ok(report.totalCheckCount > 0);
  assert.equal(
    report.certifiedPlatformIdentity,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
  assert.equal(
    report.platformLock,
    "REX-2-RUNTIME-EXECUTIVE-STAGE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, report.platformLock);
  assert.deepEqual(report, again);
  assert.equal(
    validateRuntimeExecutiveStageExperienceCertificationResult(report),
    true,
  );

  for (const domain of domains) {
    assert.ok(
      report.checks.some((entry) => entry.domain === domain),
      `missing checks for domain ${domain}`,
    );
  }
  assert.ok(report.checks.every((entry) => entry.passed === true));
  assert.ok(report.domainResults.every((entry) => entry.passed === true));
});

test("5. focus/selection/attention remain distinct; presentation states frozen", () => {
  const report = certifyRuntimeExecutiveStageExperiencePlatform();
  assert.ok(
    report.checks.some(
      (c) => c.id === "focus-distinct-from-selection" && c.passed,
    ),
  );
  assert.ok(
    report.checks.some(
      (c) => c.id === "focus-distinct-from-attention" && c.passed,
    ),
  );
  assert.ok(
    report.checks.some(
      (c) => c.id === "selection-distinct-from-attention" && c.passed,
    ),
  );
  assert.deepEqual([...frozenPresentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.ok(
    report.checks.some(
      (c) => c.id === "no-unauthorized-presentation-state" && c.passed,
    ),
  );
  assert.ok(
    report.checks.some(
      (c) => c.id === "orchestration-authority-rex-2-6" && c.passed,
    ),
  );
  assert.ok(
    report.checks.some(
      (c) => c.id === "platform-boundary-authority" && c.passed,
    ),
  );
});

test("6. freeze invariants / approved exports / lock / readiness", () => {
  assert.equal(invariants.length, 31);
  assert.equal(registry.invariantCount, 31);
  assert.equal(verifyRuntimeExecutiveStageExperienceFreezeInvariants().ok, true);
  assert.equal(invariants[0]?.id, "rex-2-is-stage-experience");
  assert.equal(invariants[30]?.id, "rex-2-9-depends-on-freeze");

  const exportsCheck = verifyRuntimeExecutiveStageExperienceApprovedExports();
  assert.equal(exportsCheck.ok, true);
  assert.equal(exportsCheck.unique, true);
  assert.ok(approvedExports.includes("resolveRuntimeExecutiveStageExperience"));
  assert.ok(approvedExports.includes("runtimeExecutiveStageExperiencePlatform"));
  assert.ok(approvedExports.includes("createRuntimeExecutiveStageModel"));
  assert.ok(approvedExports.includes("RuntimeExecutiveStageExperiencePlan"));

  const freeze = verifyRuntimeExecutiveStageExperienceFreeze();
  assert.equal(freeze.ok, true);
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.freezeStatus, "frozen");
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(
    freeze.platformLock,
    "REX-2-RUNTIME-EXECUTIVE-STAGE-EXPERIENCE-PLATFORM-LOCKED",
  );

  const lock = getRuntimeExecutiveStageExperienceLockDescriptor();
  assert.equal(
    lock.lockIdentity,
    "REX-2-RUNTIME-EXECUTIVE-STAGE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(lock.lockStatus, "locked");
  assert.equal(lock.readiness, "ReadyForPublicIndex");
  assert.equal(lock.publicationPolicy, "approved-exports-only");

  assert.equal(
    verifyRuntimeExecutiveStageExperiencePublicIndexReadiness().ok,
    true,
  );
  assert.equal(consumerGuarantees.length, 18);
  assert.equal(certificationGuarantees.length, 22);
  assert.ok(frozenGuarantees.some((entry) => entry.id === "certified"));
  assert.ok(frozenGuarantees.some((entry) => entry.id === "ready-for-public-index"));
});

test("7. failed / incompatible certification cannot freeze", () => {
  const good = certifyRuntimeExecutiveStageExperiencePlatform();
  const failedReport = Object.freeze({
    ...good,
    certificationStatus: "failed" as const,
    failedCheckCount: 1,
    passedCheckCount: good.totalCheckCount - 1,
    freezeEligible: false,
    lockEligible: false,
    freezeStatus: "unfrozen" as const,
    lockStatus: "unlocked" as const,
    readiness: "NotReadyForPublicIndex" as const,
    compatibility: Object.freeze({
      ...good.compatibility,
      overallStatus: "incompatible" as const,
    }),
    summary: "NotCertified · NotEligibleForFreeze · NotReadyForPublicIndex",
  });

  const contract =
    createRuntimeExecutiveStageExperienceFreezeContract(failedReport);
  assert.equal(contract.freezeStatus, "unfrozen");
  assert.equal(contract.lockStatus, "unlocked");
  assert.equal(contract.readiness, "NotReadyForPublicIndex");
  assert.notEqual(contract.compatibilityStatus, "compatible");
  assert.equal(
    validateRuntimeExecutiveStageExperienceFreezeContract(contract),
    true,
  );
  assert.equal(
    isRuntimeExecutiveStageExperienceCertificationStatus("failed"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveStageExperienceCompatibilityStatus("incompatible"),
    true,
  );
  assert.equal(isRuntimeExecutiveStageExperienceFreezeStatus("unfrozen"), true);
  assert.equal(isRuntimeExecutiveStageExperienceLockStatus("unlocked"), true);
});

test("8. REX-2:9 can obtain platform symbols through REX-2:8; no wrappers", () => {
  assert.equal(
    runtimeExecutiveStageExperiencePlatform.identity,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
  assert.equal(typeof resolveRuntimeExecutiveStageExperience, "function");
  assert.equal(typeof createRuntimeExecutiveStageModel, "function");
  assert.equal(verifyRuntimeExecutiveStageExperiencePlatform().ok, true);
  assert.ok(
    approvedExports.includes("resolveRuntimeExecutiveStageExperience"),
  );
  // Re-exports must not introduce local wrapper function definitions.
  assert.doesNotMatch(
    source,
    /function\s+resolveRuntimeExecutiveStageExperience\s*\(/,
  );
  assert.doesNotMatch(
    source,
    /function\s+createRuntimeExecutiveStageModel\s*\(/,
  );
  assert.doesNotMatch(
    source,
    /function\s+verifyRuntimeExecutiveStageExperiencePlatform\s*\(/,
  );
});

test("9. no renderer / KPI / React / Three.js / DOM behavior", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\b(ReactNode|HTMLElement|document\.|window\.)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:render|animate|calculateKpi|calculateKoi|fetch)[A-Za-z0-9_]*\b/,
  );
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.calculatesKpi, false);
  assert.equal(boundary.calculatesKoi, false);
  assert.equal(boundary.inventsBusinessRelationships, false);
  assert.equal(boundary.inventsExecutiveDecisions, false);
  assert.equal(boundary.executesAnimation, false);
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
});

test("10. inspection / compatibility / verification determinism", () => {
  const first = verifyRuntimeExecutiveStageExperienceCertificationFreeze();
  const second = verifyRuntimeExecutiveStageExperienceCertificationFreeze();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);

  const cert = verifyRuntimeExecutiveStageExperienceCertification();
  assert.equal(cert.ok, true);
  assert.equal(cert.allChecksPassed, true);
  assert.equal(cert.domainsCovered, true);

  const inspected = inspectRuntimeExecutiveStageExperienceCertificationResult(
    cert.report,
  );
  assert.equal(inspected.certificationStatus, "certified");
  assert.equal(inspected.compatibilityStatus, "compatible");
  assert.equal(inspected.freezeEligible, true);

  const compatibility = evaluateRuntimeExecutiveStageExperienceCompatibility();
  assert.equal(compatibility.overallStatus, "compatible");
  assert.equal(compatibility.orchestrationCompatible, true);
  assert.equal(apiNames.length, registry.apiCount);
});

test("11. upstream REX-2:1–2:7 regressions remain healthy", () => {
  assert.equal(verifyRuntimeExecutiveStageExperiencePlatform().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceOrchestration().ok, true);
  assert.equal(verifyRuntimeExecutiveStagePresentationAttention().ok, true);
  assert.equal(verifyRuntimeExecutiveStageFocusSelection().ok, true);
  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
