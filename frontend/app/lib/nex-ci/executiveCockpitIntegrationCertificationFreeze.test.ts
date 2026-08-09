import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS as approvedExports,
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS as exportSections,
  EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS as domains,
  EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION as consumerInfo,
  EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS as invariants,
  NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED as platformLock,
  certifyExecutiveCockpitIntegration,
  executiveCockpitIntegrationCertificationFreeze as module,
  executiveCockpitIntegrationCertificationFreezeApiNames as apiNames,
  executiveCockpitIntegrationCertificationFreezeCanonicalIdentity as canonicalIdentity,
  getExecutiveCockpitIntegrationApprovedExports,
  getExecutiveCockpitIntegrationCertificationDomains,
  getExecutiveCockpitIntegrationCertificationFreeze,
  getExecutiveCockpitIntegrationCertificationFreezeIdentity,
  getExecutiveCockpitIntegrationConsumerInformation,
  getExecutiveCockpitIntegrationFreezeInvariants,
  validateExecutiveCockpitIntegrationCertificationFreeze,
  verifyExecutiveCockpitIntegrationCertificationFreeze,
  verifyExecutiveCockpitIntegrationCompatibility,
} from "./executiveCockpitIntegrationCertificationFreeze.ts";

const source = readFileSync(
  new URL("./executiveCockpitIntegrationCertificationFreeze.ts", import.meta.url),
  "utf8",
);

test("1. identity metadata", () => {
  assert.equal(
    module.identity,
    "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze",
  );
  assert.equal(canonicalIdentity.identity, module.identity);
  assert.deepEqual(
    getExecutiveCockpitIntegrationCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(module.version, "1.8.0");
  assert.equal(
    module.namespace,
    "nexora.executive.cockpit.integration.certification-freeze",
  );
  assert.equal(module.phase, "CertificationFreeze");
  assert.equal(
    module.architecturalRole,
    "ExecutiveCockpitIntegrationCertificationFreeze",
  );
});

test("3. sole immediate dependency is NEX-CI:7", () => {
  assert.equal(
    module.upstreamDependency,
    "NEX-CI:7/TimelineExplorerLiveLensIntegration",
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration",
  );
  assert.equal(module.boundary.consumesNexCi7Only, true);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) =>
        entry === "node:fs" ||
        entry === "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration",
    ),
  );
});

test("4. forbidden dependency boundaries and NEX-CI:9 not started", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding|executiveStageIntegration|workspaceDialExperienceSwitching|advisorInsightIntegration|cockpitInteractionOrchestration)["']/,
  );
  assert.equal(module.boundary.implementsNexCi9, false);
  assert.equal(module.boundary.isPublicIndex, false);
  assert.doesNotMatch(
    source,
    /executiveCockpitIntegrationPublicIndex\.ts/,
  );
});

test("5. certification domains and uniqueness", () => {
  assert.deepEqual([...domains], [
    "identity",
    "dependency-integrity",
    "foundation",
    "shell-runtime-binding",
    "stage-integration",
    "workspace-dial",
    "advisor-insight",
    "interaction-orchestration",
    "contextual-surfaces",
    "workspace-consistency",
    "focus-selection-consistency",
    "presentation-compatibility",
    "attention-compatibility",
    "determinism",
    "immutability",
    "framework-independence",
    "consumer-readiness",
  ]);
  assert.equal(domains.length, new Set(domains).size);
  assert.equal(getExecutiveCockpitIntegrationCertificationDomains(), domains);
});

test("6. identity chain / certification success", () => {
  const report = certifyExecutiveCockpitIntegration();
  assert.equal(report.status, "certified");
  assert.equal(report.compatibility, "compatible");
  assert.equal(report.freezeStatus, "frozen");
  assert.equal(report.lockStatus, "locked");
  assert.equal(report.stability, "stable");
  assert.equal(report.consumerReadiness, "ready-for-public-index");
  assert.equal(report.failedCheckCount, 0);
  assert.equal(report.passedCheckCount, report.checks.length);
  assert.equal(report.checks.length, 35);
  assert.equal(
    report.checks.length,
    new Set(report.checks.map((entry) => entry.id)).size,
  );

  const chainCheck = report.checks.find(
    (entry) => entry.id === "identity-chain-order",
  );
  assert.equal(chainCheck?.passed, true);

  const phaseResults = [
    "foundation-verify",
    "shell-runtime-binding",
    "stage-integration",
    "workspace-dial",
    "advisor-insight",
    "interaction-orchestration",
    "contextual-surfaces",
  ];
  for (const id of phaseResults) {
    assert.equal(
      report.checks.find((entry) => entry.id === id)?.passed,
      true,
      id,
    );
  }
});

test("7. scenario round-trips A–H certified", () => {
  const report = certifyExecutiveCockpitIntegration();
  for (const id of [
    "scenario-a-general-empty",
    "scenario-b-selected-only",
    "scenario-c-focused",
    "scenario-d-workspace-change",
    "scenario-e-presentation-change",
    "scenario-f-explorer-focus",
    "scenario-g-timeline-pack",
    "scenario-h-live-lens",
  ]) {
    assert.equal(
      report.checks.find((entry) => entry.id === id)?.passed,
      true,
      id,
    );
  }
});

test("8. consistency / independence / mutation / determinism certifications", () => {
  const report = certifyExecutiveCockpitIntegration();
  for (const id of [
    "workspace-consistency",
    "focus-selection-consistency",
    "presentation-compatibility",
    "attention-compatibility",
    "no-cross-surface-mutation",
    "determinism",
    "immutability",
    "framework-independence",
  ]) {
    assert.equal(
      report.checks.find((entry) => entry.id === id)?.passed,
      true,
      id,
    );
  }
});

test("9. certification failure semantics", () => {
  const failed = certifyExecutiveCockpitIntegration({
    forceFailureCheckId: "identity-nex-ci-8",
  });
  assert.equal(failed.status, "failed");
  assert.equal(failed.compatibility, "incompatible");
  assert.equal(failed.freezeStatus, "unfrozen");
  assert.equal(failed.lockStatus, "unlocked");
  assert.equal(failed.stability, "unstable");
  assert.equal(failed.consumerReadiness, "not-ready");
  assert.equal(failed.failedCheckCount, 1);
  assert.equal(
    failed.checks.find((entry) => entry.id === "identity-nex-ci-8")?.passed,
    false,
  );

  const compatibility = verifyExecutiveCockpitIntegrationCompatibility();
  assert.equal(compatibility.status, "compatible");
  assert.equal(compatibility.issues.length, 0);
});

test("10. freeze / lock / invariants / approved exports / consumer info", () => {
  assert.equal(
    platformLock,
    "NEX-CI-EXECUTIVE-COCKPIT-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(invariants.length, 27);
  assert.ok(invariants.every((entry) => entry.required === true));
  assert.equal(
    invariants.length,
    new Set(invariants.map((entry) => entry.id)).size,
  );
  assert.equal(getExecutiveCockpitIntegrationFreezeInvariants(), invariants);

  assert.equal(approvedExports.length, new Set(approvedExports).size);
  assert.ok(approvedExports.length >= 80);
  assert.equal(getExecutiveCockpitIntegrationApprovedExports(), approvedExports);
  assert.deepEqual([...exportSections], [
    "Identity",
    "PublicTypes",
    "Foundation",
    "Stage",
    "Workspace",
    "AdvisorInsight",
    "Orchestration",
    "ContextualSurfaces",
    "Validation",
    "Certification",
    "Freeze",
    "ConsumerInformation",
  ]);

  assert.equal(
    consumerInfo.futurePublicIndex,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );
  assert.equal(
    consumerInfo.futureConsumerImportPath,
    "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex",
  );
  assert.equal(consumerInfo.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumerInfo.currentReadiness, "ready-for-public-index");
  assert.equal(getExecutiveCockpitIntegrationConsumerInformation(), consumerInfo);
});

test("11. canonical freeze self-verification", () => {
  const freeze = getExecutiveCockpitIntegrationCertificationFreeze();
  assert.equal(freeze.platformLock, platformLock);
  assert.equal(freeze.freezeStatus, "frozen");
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(freeze.stability, "stable");
  assert.equal(freeze.consumerReadiness, "ready-for-public-index");
  assert.equal(freeze.identity, module.identity);

  const verification = verifyExecutiveCockpitIntegrationCertificationFreeze(
    freeze,
  );
  assert.equal(verification.ok, true);
  assert.equal(verification.certified, true);
  assert.equal(verification.compatible, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.locked, true);
  assert.equal(verification.stable, true);
  assert.equal(verification.readyForPublicIndex, true);
  assert.equal(verification.implementsNexCi9, false);
  assert.equal(verification.isPublicIndex, false);

  const validation = validateExecutiveCockpitIntegrationCertificationFreeze();
  assert.equal(validation.ok, true);
  assert.equal(validation.selfCertified, true);
  assert.equal(validation.selfVerified, true);
  assert.equal(apiNames.length, 10);
});

test("12. no React / Three.js / R3F / AI / network / persistence; not Public Index", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /\bfrom\s+["']openai["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']@anthropic-ai\//);
  assert.doesNotMatch(
    source,
    /\b(?:window\.localStorage|window\.indexedDB|new\s+XMLHttpRequest|fetch\s*\()\b/,
  );
  assert.equal(module.boundary.introducesReact, false);
  assert.equal(module.boundary.introducesThreeJs, false);
  assert.equal(module.boundary.introducesAiSdk, false);
  assert.equal(module.boundary.ownsNetworkAccess, false);
  assert.equal(module.boundary.ownsPersistence, false);
  assert.equal(module.boundary.isPublicIndex, false);
  assert.equal(
    module.architecturalStatus,
    "Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex",
  );
});
