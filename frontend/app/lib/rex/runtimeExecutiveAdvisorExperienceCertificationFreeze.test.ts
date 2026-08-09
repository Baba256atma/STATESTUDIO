import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  runtimeExecutiveAdvisorExperiencePlatformIdentity,
  runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
  verifyRuntimeExecutiveAdvisorExperiencePlatform,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePlatform";

import {
  REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS as domains,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES as outcomes,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES as severities,
  RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES as freezeStatuses,
  RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES as lockStatuses,
  RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS as publicationReadiness,
  certifyRuntimeExecutiveAdvisorExperiencePlatform,
  freezeRuntimeExecutiveAdvisorExperiencePlatform,
  getRuntimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
  isRuntimeExecutiveAdvisorExperienceCertified,
  isRuntimeExecutiveAdvisorExperienceFrozen,
  isRuntimeExecutiveAdvisorExperienceLocked,
  isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex,
  resolveRuntimeExecutiveAdvisorExperiencePlatform,
  runtimeExecutiveAdvisorExperienceCertificationFreeze as module,
  runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames as apiNames,
  runtimeExecutiveAdvisorExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorExperienceCertificationFreezeRegistry as registry,
  validateRuntimeExecutiveAdvisorExperienceCertification,
  verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze,
  verifyRuntimeExecutiveAdvisorExperienceCompatibility,
  verifyRuntimeExecutiveAdvisorExperiencePlatformLock,
} from "./runtimeExecutiveAdvisorExperienceCertificationFreeze.ts";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveAdvisorExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / status / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze",
  );
  assert.equal(module.version, "3.8.0");
  assert.equal(
    module.namespace,
    "nexora.rex.advisor-experience.certification-freeze",
  );
  assert.equal(module.status, "CertifiedFrozen");
  assert.equal(
    module.upstreamDependency,
    "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorExperiencePlatformIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePlatform",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:ExperienceOrchestration|StageCoordination|GuidanceActions|ResponseModel|ContextSubjectBinding|ExperienceFoundation)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)[^"']*["']/,
  );
  assert.equal(boundary.consumesPlatformOnly, true);
  assert.equal(boundary.importsRex36Directly, false);
  assert.equal(boundary.introducesRuntimeBehavior, false);
});

test("2. vocabularies, registries, dynamic counts", () => {
  assert.deepEqual([...statuses], ["uncertified", "certified", "failed"]);
  assert.deepEqual([...outcomes], ["pass", "fail"]);
  assert.deepEqual([...severities], ["required", "critical"]);
  assert.equal(domains.length, 24);
  assert.deepEqual([...freezeStatuses], ["unfrozen", "frozen"]);
  assert.deepEqual([...lockStatuses], ["unlocked", "locked"]);
  assert.deepEqual([...publicationReadiness], [
    "not-ready",
    "ready-for-public-index",
  ]);
  assert.equal(capabilities.length, 17);
  assert.equal(invariants.length, 24);
  assert.deepEqual([...registrySections], [
    "Identity",
    "CertificationDomains",
    "CertificationChecks",
    "CertificationStatus",
    "Compatibility",
    "Freeze",
    "Lock",
    "ApprovedExports",
    "Invariants",
    "PublicationReadiness",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.domainCount, domains.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.ok(Object.isFrozen(domains));
  assert.ok(Object.isFrozen(approvedExports));
  assert.ok(Object.isFrozen(invariants));
  assert.ok(Object.isFrozen(module));
});

test("3. successful certification / freeze / lock / public-index readiness", () => {
  const report = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  const again = certifyRuntimeExecutiveAdvisorExperiencePlatform();

  assert.equal(report.status, "certified");
  assert.equal(report.isCertified, true);
  assert.equal(report.compatibility, "compatible");
  assert.equal(report.freezeStatus, "frozen");
  assert.equal(report.lockStatus, "locked");
  assert.equal(report.publicationReadiness, "ready-for-public-index");
  assert.equal(report.failedCheckCount, 0);
  assert.equal(report.passedCheckCount, report.totalCheckCount);
  assert.ok(report.totalCheckCount > 0);
  assert.equal(
    report.certifiedPlatformIdentity,
    "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform",
  );
  assert.equal(
    report.platformLock,
    "REX-3-RUNTIME-EXECUTIVE-ADVISOR-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, report.platformLock);
  assert.deepEqual(report, again);
  assert.equal(
    validateRuntimeExecutiveAdvisorExperienceCertification(report).ok,
    true,
  );

  const ids = report.checks.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const domain of domains) {
    assert.ok(
      report.checks.some((entry) => entry.domain === domain),
      `missing checks for domain ${domain}`,
    );
  }
  assert.ok(report.checks.every((entry) => entry.outcome === "pass"));

  assert.equal(
    verifyRuntimeExecutiveAdvisorExperienceCompatibility(),
    "compatible",
  );

  const freeze = freezeRuntimeExecutiveAdvisorExperiencePlatform(report);
  assert.equal(freeze.freezeStatus, "frozen");
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(freeze.compatibility, "compatible");
  assert.equal(freeze.publicationReadiness, "ready-for-public-index");
  assert.equal(
    freeze.lock,
    "REX-3-RUNTIME-EXECUTIVE-ADVISOR-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(verifyRuntimeExecutiveAdvisorExperiencePlatformLock(freeze), true);
  assert.equal(isRuntimeExecutiveAdvisorExperienceCertified(report), true);
  assert.equal(isRuntimeExecutiveAdvisorExperienceFrozen(freeze), true);
  assert.equal(isRuntimeExecutiveAdvisorExperienceLocked(freeze), true);
  assert.equal(
    isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex(freeze),
    true,
  );
});

test("4. critical domains / approved exports / invariants", () => {
  const report = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  for (const id of [
    "manager-authority-preserved",
    "stage-ownership-external",
    "context-safety-preserved",
    "confirmation-preserved",
    "non-execution",
    "ai-neutrality",
    "ui-neutrality",
    "sole-platform-dependency",
  ]) {
    const entry = report.checks.find((check) => check.id === id);
    assert.ok(entry, `missing check ${id}`);
    assert.equal(entry!.outcome, "pass");
    assert.equal(entry!.severity, "critical");
  }

  assert.ok(
    approvedExports.includes("resolveRuntimeExecutiveAdvisorExperiencePlatform"),
  );
  assert.ok(
    approvedExports.includes("runtimeExecutiveAdvisorExperiencePlatform"),
  );
  assert.ok(
    approvedExports.includes(
      "REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED",
    ),
  );
  assert.equal(new Set(approvedExports).size, approvedExports.length);

  assert.ok(invariants.includes("manager-authority-frozen"));
  assert.ok(invariants.includes("stage-ownership-frozen"));
  assert.ok(invariants.includes("approved-export-surface-frozen"));
  assert.equal(typeof resolveRuntimeExecutiveAdvisorExperiencePlatform, "function");
});

test("5. failed certification / incompatible cannot freeze", () => {
  const good = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  const failedReport = Object.freeze({
    ...good,
    status: "failed" as const,
    isCertified: false,
    failedCheckCount: 1,
    passedCheckCount: good.totalCheckCount - 1,
    freezeStatus: "unfrozen" as const,
    lockStatus: "unlocked" as const,
    compatibility: "incompatible" as const,
    publicationReadiness: "not-ready" as const,
  });

  const freeze = freezeRuntimeExecutiveAdvisorExperiencePlatform(failedReport);
  assert.equal(freeze.freezeStatus, "unfrozen");
  assert.equal(freeze.lockStatus, "unlocked");
  assert.equal(freeze.compatibility, "incompatible");
  assert.equal(freeze.publicationReadiness, "not-ready");
  assert.equal(verifyRuntimeExecutiveAdvisorExperiencePlatformLock(freeze), false);
  assert.equal(isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex(freeze), false);
  assert.equal(
    validateRuntimeExecutiveAdvisorExperienceCertification(failedReport).ok,
    false,
  );

  // Manager-authority / AI / non-execution failures must prevent freeze if present.
  const managerFail = Object.freeze({
    ...good,
    status: "failed" as const,
    isCertified: false,
    failedCheckCount: 1,
    passedCheckCount: good.totalCheckCount - 1,
    checks: Object.freeze(
      good.checks.map((entry) =>
        entry.id === "manager-authority-preserved"
          ? Object.freeze({ ...entry, outcome: "fail" as const })
          : entry,
      ),
    ),
    freezeStatus: "unfrozen" as const,
    lockStatus: "unlocked" as const,
    compatibility: "incompatible" as const,
    publicationReadiness: "not-ready" as const,
  });
  const managerFreeze =
    freezeRuntimeExecutiveAdvisorExperiencePlatform(managerFail);
  assert.equal(managerFreeze.freezeStatus, "unfrozen");
  assert.equal(managerFreeze.lockStatus, "unlocked");
});

test("6. determinism, immutability, no new behavior, REX-3:7 compatibility", () => {
  const a = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  const b = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  assert.deepEqual(a, b);
  const fa = freezeRuntimeExecutiveAdvisorExperiencePlatform(a);
  const fb = freezeRuntimeExecutiveAdvisorExperiencePlatform(b);
  assert.deepEqual(fa, fb);

  assert.ok(Object.isFrozen(a.checks));
  assert.ok(Object.isFrozen(fa.approvedExports));
  assert.ok(Object.isFrozen(fa.invariants));

  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.modifiesPlatformBehavior, false);
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);

  assert.equal(verifyRuntimeExecutiveAdvisorExperiencePlatform().ok, true);
  const verification =
    verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.compatibility, "compatible");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.lockStatus, "locked");
  assert.equal(verification.publicationReadiness, "ready-for-public-index");
  assert.equal(verification.readyForPublicIndex, true);
  assert.equal(verification.noNewBehavior, true);
  assert.equal(verification.platformOk, true);
  assert.equal(verification.domainCount, 24);
  assert.equal(verification.failedCheckCount, 0);
  assert.equal(verification.invariantCount, 24);
  assert.equal(verification.capabilityCount, 17);
  assert.equal(verification.sectionCount, 11);
  assert.equal(
    verification.platformLock,
    "REX-3-RUNTIME-EXECUTIVE-ADVISOR-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:9 Public Index/,
  );
});
