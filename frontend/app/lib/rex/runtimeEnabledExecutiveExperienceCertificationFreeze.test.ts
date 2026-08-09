import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS as domains,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY as boundary,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_GUARANTEES as certificationGuarantees,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FREEZE_INVARIANTS as invariants,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES as frozenGuarantees,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS as registrySections,
  certifyRuntimeEnabledExecutiveExperiencePlatform,
  createRuntimeEnabledExecutiveExperienceFreezeContract,
  getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  isRuntimeEnabledExecutiveExperienceCertificationDomain,
  isRuntimeEnabledExecutiveExperienceCertificationStatus,
  isRuntimeEnabledExecutiveExperienceCompatibilityStatus,
  isRuntimeEnabledExecutiveExperienceFreezeStatus,
  isRuntimeEnabledExecutiveExperienceLockStatus,
  runtimeEnabledExecutiveExperienceCertificationFreeze as certificationFreeze,
  runtimeEnabledExecutiveExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceCertificationFreezeRegistry as registry,
  validateRuntimeEnabledExecutiveExperienceCertificationReport,
  validateRuntimeEnabledExecutiveExperienceFreezeContract,
  verifyRuntimeEnabledExecutiveExperienceCertification,
  verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
  verifyRuntimeEnabledExecutiveExperienceFreeze,
} from "./runtimeEnabledExecutiveExperienceCertificationFreeze.ts";

import {
  runtimeEnabledExecutiveExperiencePlatformIdentity,
  verifyRuntimeEnabledExecutiveExperiencePlatform,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePlatform";

import { verifyAdaptivePresentationBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding";
import { verifyExecutiveInteractionBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding";
import { verifyExecutiveSceneBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding";
import { verifyRuntimeContextStateBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding";
import { verifyExecutiveRuntimeContracts } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts";
import { verifyRuntimeEnabledExecutiveExperienceFoundation } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact REX-1:8 identity", () => {
  assert.equal(
    certificationFreeze.identity,
    "REX-1:8/RuntimeEnabledExecutiveExperienceCertificationFreeze",
  );
  assert.equal(canonicalIdentity.identity, certificationFreeze.identity);
  assert.equal(certificationFreeze.stage, "CertificationFreeze");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.8.0", () => {
  assert.equal(certificationFreeze.version, "1.8.0");
  assert.equal(registry.version, "1.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    certificationFreeze.namespace,
    "nexora.rex.runtime-enabled-executive-experience.certification-freeze",
  );
});

test("4. sole immediate dependency is REX-1:7 platform", () => {
  assert.equal(
    certificationFreeze.upstreamDependency,
    "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform",
  );
  assert.equal(
    certificationFreeze.upstreamDependency,
    runtimeEnabledExecutiveExperiencePlatformIdentity,
  );
  assert.equal(
    certificationFreeze.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePlatform",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePlatform",
  ]);
});

test("5. forbidden direct imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|next\/router|next\/navigation)["']/i,
  );
  assert.equal(boundary.consumesPlatformOnly, true);
  assert.equal(boundary.importsPresentationBindingDirectly, false);
  assert.equal(boundary.importsInteractionBindingDirectly, false);
  assert.equal(boundary.importsSceneBindingDirectly, false);
  assert.equal(boundary.importsStateBindingDirectly, false);
  assert.equal(boundary.importsContractsDirectly, false);
  assert.equal(boundary.importsFoundationDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.modifiesPlatformBehavior, false);
});

test("6. certification-domain vocabulary, order, and count", () => {
  assert.deepEqual([...domains], [
    "identity",
    "dependency",
    "contracts",
    "state-binding",
    "scene-binding",
    "interaction-binding",
    "adaptive-presentation",
    "platform-composition",
    "runtime-authority",
    "surface-integrity",
    "immutability",
    "determinism",
    "compatibility",
    "consumer-safety",
    "scope-discipline",
  ]);
  assert.equal(registry.domainCount, 15);
  assert.equal(
    isRuntimeEnabledExecutiveExperienceCertificationDomain("identity"),
    true,
  );
  assert.equal(
    isRuntimeEnabledExecutiveExperienceCertificationDomain("camera"),
    false,
  );
});

test("7. certification report: all checks pass, certified / compatible / frozen / locked", () => {
  const report = certifyRuntimeEnabledExecutiveExperiencePlatform();
  const again = certifyRuntimeEnabledExecutiveExperiencePlatform();

  assert.equal(report.certificationStatus, "certified");
  assert.equal(report.compatibility.overallStatus, "compatible");
  assert.equal(report.freezeStatus, "frozen");
  assert.equal(report.lockStatus, "locked");
  assert.equal(report.failedCheckCount, 0);
  assert.equal(report.passedCheckCount, report.totalCheckCount);
  assert.ok(report.totalCheckCount > 0);
  assert.equal(
    report.certifiedPlatformIdentity,
    "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform",
  );
  assert.equal(
    report.platformLock,
    "REX-1-RUNTIME-ENABLED-EXECUTIVE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, report.platformLock);
  assert.deepEqual(report, again);
  assert.equal(
    validateRuntimeEnabledExecutiveExperienceCertificationReport(report),
    true,
  );

  // Every domain has at least one check.
  for (const domain of domains) {
    assert.ok(
      report.checks.some((entry) => entry.domain === domain),
      `missing checks for domain ${domain}`,
    );
  }
  assert.ok(report.checks.every((entry) => entry.passed === true));
});

test("8. compatibility report fields", () => {
  const report = certifyRuntimeEnabledExecutiveExperiencePlatform();
  assert.equal(report.compatibility.rexChainCompatible, true);
  assert.equal(report.compatibility.runtimeAuthorityCompatible, true);
  assert.equal(report.compatibility.surfaceCompatible, true);
  assert.equal(report.compatibility.sceneCompatible, true);
  assert.equal(report.compatibility.interactionCompatible, true);
  assert.equal(report.compatibility.presentationCompatible, true);
  assert.equal(report.compatibility.consumerCompatible, true);
  assert.equal(
    isRuntimeEnabledExecutiveExperienceCompatibilityStatus("compatible"),
    true,
  );
  assert.equal(
    isRuntimeEnabledExecutiveExperienceCompatibilityStatus("unknown"),
    false,
  );
});

test("9. freeze invariants, approved exports, frozen guarantees, public-index readiness", () => {
  assert.equal(invariants.length, 30);
  assert.equal(registry.invariantCount, 30);
  assert.equal(invariants[0]?.id, "identity-frozen");
  assert.equal(
    invariants[29]?.id,
    "rex-1-9-publishes-approved-frozen-surface",
  );

  assert.ok(approvedExports.length > 0);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.ok(
    approvedExports.includes("composeRuntimeEnabledExecutiveExperiencePlatform"),
  );
  assert.ok(
    approvedExports.includes("runtimeEnabledExecutiveExperiencePlatform"),
  );
  assert.ok(
    approvedExports.includes("verifyRuntimeEnabledExecutiveExperiencePlatform"),
  );

  assert.equal(certificationGuarantees.length, 30);
  assert.equal(frozenGuarantees.length, 35);
  assert.ok(frozenGuarantees.some((entry) => entry.id === "certified"));
  assert.ok(frozenGuarantees.some((entry) => entry.id === "compatible"));
  assert.ok(frozenGuarantees.some((entry) => entry.id === "frozen"));
  assert.ok(frozenGuarantees.some((entry) => entry.id === "locked"));
  assert.ok(
    frozenGuarantees.some((entry) => entry.id === "ready-for-public-index"),
  );

  const freeze = verifyRuntimeEnabledExecutiveExperienceFreeze();
  assert.equal(freeze.ok, true);
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.freezeStatus, "frozen");
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(
    freeze.platformLock,
    "REX-1-RUNTIME-ENABLED-EXECUTIVE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(
    validateRuntimeEnabledExecutiveExperienceFreezeContract(freeze.contract),
    true,
  );

  const contract = createRuntimeEnabledExecutiveExperienceFreezeContract();
  assert.equal(contract.readiness, "ReadyForPublicIndex");
  assert.equal(isRuntimeEnabledExecutiveExperienceFreezeStatus("frozen"), true);
  assert.equal(isRuntimeEnabledExecutiveExperienceLockStatus("locked"), true);
  assert.equal(
    isRuntimeEnabledExecutiveExperienceCertificationStatus("certified"),
    true,
  );
});

test("10. deterministic verification and immutable collections", () => {
  const first = verifyRuntimeEnabledExecutiveExperienceCertificationFreeze();
  const second = verifyRuntimeEnabledExecutiveExperienceCertificationFreeze();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);

  const cert = verifyRuntimeEnabledExecutiveExperienceCertification();
  assert.equal(cert.ok, true);
  assert.equal(cert.allChecksPassed, true);
  assert.equal(cert.domainsCovered, true);

  assert.equal(Object.isFrozen(certificationFreeze), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(domains), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(approvedExports), true);
  assert.equal(Object.isFrozen(certificationGuarantees), true);
  assert.equal(Object.isFrozen(frozenGuarantees), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(boundary), true);
  assert.equal(registrySections.length, 14);
  assert.equal(registry.sectionCount, 14);
});

test("11. no caller/upstream mutation and no runtime behavior additions", () => {
  const platformBefore = JSON.stringify(
    verifyRuntimeEnabledExecutiveExperiencePlatform(),
  );
  certifyRuntimeEnabledExecutiveExperiencePlatform();
  verifyRuntimeEnabledExecutiveExperienceFreeze();
  verifyRuntimeEnabledExecutiveExperienceCertificationFreeze();
  assert.equal(
    JSON.stringify(verifyRuntimeEnabledExecutiveExperiencePlatform()),
    platformBefore,
  );

  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.modifiesPlatformBehavior, false);
  assert.equal(certificationFreeze.introducesRuntimeBehavior, false);
  assert.ok(
    certificationFreeze.forbiddenResponsibilities.includes("Public Index"),
  );
  assert.ok(
    certificationFreeze.forbiddenResponsibilities.includes(
      "platform behavior modification",
    ),
  );
});

test("12. no React / Three.js / renderer / AI / persistence / network dependency", () => {
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /SceneRenderer/);
  assert.doesNotMatch(source, /openai|anthropic|@ai-sdk/i);
  assert.doesNotMatch(source, /fetch\s*\(|localStorage|indexedDB/);
  assert.doesNotMatch(source, /createStore|EventEmitter|eventBus/);
  assert.ok(
    certificationFreeze.forbiddenResponsibilities.includes("React integration"),
  );
  assert.ok(
    certificationFreeze.forbiddenResponsibilities.includes(
      "Three.js integration",
    ),
  );
  assert.ok(
    certificationFreeze.forbiddenResponsibilities.includes("Advisor AI"),
  );
});

test("13. REX-1:1 through REX-1:7 regression markers remain healthy", () => {
  assert.equal(verifyRuntimeEnabledExecutiveExperiencePlatform().ok, true);
  assert.equal(verifyAdaptivePresentationBinding().ok, true);
  assert.equal(verifyExecutiveInteractionBinding().ok, true);
  assert.equal(verifyExecutiveSceneBinding().ok, true);
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
