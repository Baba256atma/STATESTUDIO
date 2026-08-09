import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as publicIndexModule from "./executiveCockpitIntegrationPublicIndex.ts";
import {
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS as approvedExports,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES as guarantees,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS as invariants,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS as metadataApis,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS as publishedRuntime,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_COCKPIT_SURFACES as surfaces,
  EXECUTIVE_CONTEXTUAL_SURFACES as contextualSurfaces,
  NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED as platformLock,
  createExecutiveCockpitInteractionIntent,
  createExecutiveExplorerInteractionIntent,
  createExecutiveLiveLensInteractionIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveTimelineInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  executiveCockpitIntegrationPublicIndex as namespaceRegistry,
  executiveCockpitIntegrationPublicIndexCanonicalIdentity as canonicalIdentity,
  executiveCockpitIntegrationPublicIndexModule as module,
  getExecutiveCockpitIntegrationCertificationFreeze,
  getExecutiveCockpitIntegrationPublicConsumerInformation,
  getExecutiveCockpitIntegrationPublicIndexIdentity,
  getExecutiveCockpitIntegrationPublicIndexRegistry,
  getExecutiveCockpitIntegrationReleaseInformation,
  normalizeExecutiveExplorerInteraction,
  normalizeExecutiveLiveLensInteraction,
  normalizeExecutiveTimelineInteraction,
  orchestrateExecutiveCockpitInteraction,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveExplorerContext,
  resolveExecutiveLiveLensContext,
  resolveExecutiveStageScene,
  resolveExecutiveTimelineContext,
  resolveExecutiveWorkspaceExperience,
  validateExecutiveCockpitIntegrationPublicIndex,
  verifyExecutiveCockpitIntegrationCertificationFreeze,
  verifyExecutiveCockpitIntegrationPublicIndex,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveWorkspaceReference,
} from "./executiveCockpitIntegrationPublicIndex.ts";

const source = readFileSync(
  new URL("./executiveCockpitIntegrationPublicIndex.ts", import.meta.url),
  "utf8",
);

const APPROVED_TYPE_NAMES = new Set([
  "ExecutiveCockpitIntegrationCertificationCheck",
  "ExecutiveCockpitIntegrationCertificationReport",
  "ExecutiveCockpitIntegrationCertificationDomain",
  "ExecutiveCockpitIntegrationCompatibilityIssue",
  "ExecutiveCockpitIntegrationCompatibilityResult",
  "ExecutiveCockpitIntegrationFreeze",
  "ExecutiveCockpitIntegrationFreezeInvariant",
  "ExecutiveCockpitIntegrationConsumerInformation",
  "ExecutiveCockpitOrchestrationSnapshot",
  "ExecutiveCockpitInteractionIntent",
  "ExecutiveCockpitPresentationState",
  "ExecutiveCockpitSubjectReference",
  "ExecutiveCockpitSurface",
  "ExecutiveWorkspaceReference",
]);

test("1. exact identity / version / namespace / phase / roles", () => {
  assert.equal(
    module.identity,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );
  assert.equal(module.version, "1.9.0");
  assert.equal(
    module.namespace,
    "nexora.executive.cockpit.integration.public-index",
  );
  assert.equal(module.phase, "PublicIndex");
  assert.equal(
    module.architecturalRole,
    "ExecutiveCockpitIntegrationPublicIndex",
  );
  assert.equal(module.consumerRole, "SoleConsumerEntryPoint");
  assert.deepEqual(
    getExecutiveCockpitIntegrationPublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is NEX-CI:8 only", () => {
  assert.equal(
    module.upstreamDependency,
    "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze",
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze",
  );
  assert.equal(module.boundary.consumesNexCi8Only, true);
  assert.equal(module.boundary.isSoleConsumerEntryPoint, true);

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) =>
        entry === "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze",
    ),
    `unexpected imports: ${imports.join(", ")}`,
  );
});

test("3. no direct NEX-CI:1–7 / NOL / DRI / EX-DRI / private REX imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding|executiveStageIntegration|workspaceDialExperienceSwitching|advisorInsightIntegration|cockpitInteractionOrchestration|timelineExplorerLiveLensIntegration)["']/,
  );
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/);
  assert.equal(module.boundary.importsNexCi1Directly, false);
  assert.equal(module.boundary.importsNolDirectly, false);
  assert.equal(module.boundary.importsDriDirectly, false);
  assert.equal(module.boundary.importsExDriDirectly, false);
  assert.equal(module.boundary.importsRexInternalsDirectly, false);
});

test("4. consumer import path and readiness distinction", () => {
  assert.equal(
    module.supportedImportPath,
    "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex",
  );
  const consumer = getExecutiveCockpitIntegrationPublicConsumerInformation();
  assert.equal(consumer.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumer.importPath, module.supportedImportPath);
  assert.equal(consumer.readiness, "ready-for-consumer");
  assert.equal(consumer.releaseStatus, "released");

  const freezeConsumer =
    publicIndexModule.getExecutiveCockpitIntegrationConsumerInformation();
  assert.equal(freezeConsumer.currentReadiness, "ready-for-public-index");
});

test("5. release / certification / freeze / lock / stability statuses", () => {
  const release = getExecutiveCockpitIntegrationReleaseInformation();
  assert.equal(release.releaseStatus, "released");
  assert.equal(release.certificationStatus, "certified");
  assert.equal(release.compatibilityStatus, "compatible");
  assert.equal(release.freezeStatus, "frozen");
  assert.equal(release.lockStatus, "locked");
  assert.equal(release.stability, "stable");
  assert.equal(release.consumerReadiness, "ready-for-consumer");
  assert.equal(release.identity, module.identity);
  assert.equal(
    platformLock,
    "NEX-CI-EXECUTIVE-COCKPIT-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(module.platformLock, platformLock);
  assert.equal(
    module.architecturalStatus,
    "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer",
  );
});

test("6. approved export equality — all frozen runtime symbols published", () => {
  const approvedRuntime = approvedExports.filter(
    (name) => !APPROVED_TYPE_NAMES.has(name),
  );
  assert.equal(publishedRuntime.length, approvedRuntime.length);
  assert.deepEqual([...publishedRuntime], [...approvedRuntime]);

  for (const name of approvedRuntime) {
    assert.ok(
      name in publicIndexModule,
      `missing approved runtime export: ${name}`,
    );
  }

  assert.equal(approvedExports.length, 82);
  assert.equal(publishedRuntime.length, 68);
  assert.equal(APPROVED_TYPE_NAMES.size, 14);
});

test("7. no unapproved frozen-symbol leakage beyond metadata APIs", () => {
  const nexCi9MetadataAllowlist = new Set([
    ...metadataApis,
    "executiveCockpitIntegrationPublicIndexIdentity",
    "executiveCockpitIntegrationPublicIndexVersion",
    "executiveCockpitIntegrationPublicIndexNamespace",
    "executiveCockpitIntegrationPublicIndexLayer",
    "executiveCockpitIntegrationPublicIndexPhase",
    "executiveCockpitIntegrationPublicIndexArchitecturalRole",
    "executiveCockpitIntegrationPublicIndexConsumerRole",
    "executiveCockpitIntegrationPublicIndexDependencyIdentity",
    "executiveCockpitIntegrationPublicIndexDependencyPath",
    "executiveCockpitIntegrationPublicIndexSupportedImportPath",
    "executiveCockpitIntegrationPublicIndexCanonicalIdentity",
    "executiveCockpitIntegrationPublicIndexModule",
    "executiveCockpitIntegrationPublicIndex",
    "executiveCockpitIntegrationPublicIndexRegistry",
    "executiveCockpitIntegrationReleaseInformation",
    "executiveCockpitIntegrationPublicConsumerInformation",
    "executiveCockpitIntegrationPublicIndexApiNames",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PRINCIPLE",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY",
    "EXECUTIVE_COCKPIT_INTEGRATION_RELEASE_STATUSES",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_READINESS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS",
    "EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_VALIDATION_API_NAMES",
    "executiveCockpitIntegrationPublicIndexIdentitySection",
    "executiveCockpitIntegrationPublicIndexPublicTypesSection",
    "executiveCockpitIntegrationPublicIndexFoundationSection",
    "executiveCockpitIntegrationPublicIndexShellRuntimeSection",
    "executiveCockpitIntegrationPublicIndexStageSection",
    "executiveCockpitIntegrationPublicIndexWorkspaceDialSection",
    "executiveCockpitIntegrationPublicIndexAdvisorInsightSection",
    "executiveCockpitIntegrationPublicIndexInteractionOrchestrationSection",
    "executiveCockpitIntegrationPublicIndexTimelineExplorerLiveLensSection",
    "executiveCockpitIntegrationPublicIndexValidationSection",
    "executiveCockpitIntegrationPublicIndexCertificationSection",
    "executiveCockpitIntegrationPublicIndexReleaseInformationSection",
    "executiveCockpitIntegrationPublicIndexCompatibilitySection",
    "executiveCockpitIntegrationPublicIndexRegistrySection",
    "executiveCockpitIntegrationPublicIndexConsumerInformationSection",
    "default",
  ]);

  const approvedRuntime = new Set<string>(
    approvedExports.filter((name) => !APPROVED_TYPE_NAMES.has(name)),
  );

  for (const key of Object.keys(publicIndexModule)) {
    if (approvedRuntime.has(key) || nexCi9MetadataAllowlist.has(key)) {
      continue;
    }
    assert.fail(`unapproved public export leaked: ${key}`);
  }
});

test("8. registry section order and deterministic metadata", () => {
  assert.deepEqual([...registrySections], [
    "Identity",
    "PublicTypes",
    "Foundation",
    "ShellRuntime",
    "Stage",
    "WorkspaceDial",
    "AdvisorInsight",
    "InteractionOrchestration",
    "TimelineExplorerLiveLens",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.deepEqual(Object.keys(namespaceRegistry), [...registrySections]);

  const registryA = getExecutiveCockpitIntegrationPublicIndexRegistry();
  const registryB = getExecutiveCockpitIntegrationPublicIndexRegistry();
  assert.deepEqual(registryA, registryB);
  assert.equal(registryA.sectionCount, 15);
  assert.equal(registryA.approvedExportCount, 82);
  assert.equal(registryA.publishedRuntimeSymbolCount, 68);
  assert.equal(registryA.consumerGuaranteeCount, 14);
  assert.equal(registryA.invariantCount, 30);
  assert.ok(Object.isFrozen(namespaceRegistry));
  assert.ok(Object.isFrozen(registrySections));
  assert.ok(Object.isFrozen(guarantees));
  assert.ok(Object.isFrozen(invariants));
});

test("9. Stage / Workspace Dial / Advisor / Insight / Orchestration APIs", () => {
  assert.equal(typeof resolveExecutiveStageScene, "function");
  assert.equal(typeof createExecutiveStageInteractionIntent, "function");
  assert.equal(typeof resolveExecutiveWorkspaceExperience, "function");
  assert.equal(typeof createExecutiveWorkspaceReference, "function");
  assert.equal(typeof createExecutiveWorkspaceSelectionIntent, "function");
  assert.equal(typeof resolveExecutiveAdvisorInsightIntegration, "function");
  assert.equal(typeof orchestrateExecutiveCockpitInteraction, "function");
  assert.equal(typeof createExecutiveCockpitInteractionIntent, "function");
  assert.equal(typeof resolveCockpitShellRuntimeBinding, "function");
});

test("10. Timeline / Explorer / Live Lens APIs through Public Index", () => {
  assert.equal(typeof createExecutiveTimelineInteractionIntent, "function");
  assert.equal(typeof createExecutiveExplorerInteractionIntent, "function");
  assert.equal(typeof createExecutiveLiveLensInteractionIntent, "function");
  assert.equal(typeof normalizeExecutiveTimelineInteraction, "function");
  assert.equal(typeof normalizeExecutiveExplorerInteraction, "function");
  assert.equal(typeof normalizeExecutiveLiveLensInteraction, "function");
  assert.equal(typeof resolveExecutiveTimelineContext, "function");
  assert.equal(typeof resolveExecutiveExplorerContext, "function");
  assert.equal(typeof resolveExecutiveLiveLensContext, "function");
  assert.deepEqual([...contextualSurfaces], [
    "timeline",
    "explorer",
    "live-lens",
  ]);
});

test("11. presentation / selection-focus / current-target contracts available", () => {
  const presentation: ExecutiveCockpitPresentationState = "minimum";
  assert.equal(presentation, "minimum");
  const subject: ExecutiveCockpitSubjectReference = {
    id: "subject-1",
    kind: "object",
  };
  assert.equal(subject.id, "subject-1");
  const currentWorkspace: ExecutiveWorkspaceReference =
    createExecutiveWorkspaceReference("overview");
  const targetWorkspace: ExecutiveWorkspaceReference =
    createExecutiveWorkspaceReference("execution");
  assert.equal(currentWorkspace.kind, "overview");
  assert.equal(targetWorkspace.kind, "execution");
  assert.notEqual(currentWorkspace.id, targetWorkspace.id);

  const selectionIntent = createExecutiveWorkspaceSelectionIntent(
    targetWorkspace.id,
  );
  assert.ok(selectionIntent);
  assert.equal(typeof resolveExecutiveWorkspaceExperience, "function");

  assert.ok(publicTypeNames.includes("ExecutiveCockpitPresentationState"));
  assert.ok(publicTypeNames.includes("ExecutiveWorkspaceReference"));
  assert.ok(
    publishedRuntime.includes("createExecutiveWorkspaceSelectionIntent"),
  );
  assert.ok(publishedRuntime.includes("orchestrateExecutiveCockpitInteraction"));
});

test("12. canonical Cockpit surfaces preserved", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "live-lens",
    "workspace-dial",
    "context-bar",
    "navigation",
    "status",
  ]);
  assert.equal(surfaces.length, 10);
});

test("13. validation / certification / freeze APIs", () => {
  const validation = validateExecutiveCockpitIntegrationPublicIndex();
  assert.equal(validation.ok, true);
  assert.equal(validation.releaseGatePassed, true);

  const verification = verifyExecutiveCockpitIntegrationPublicIndex();
  assert.equal(verification.ok, true);
  assert.equal(verification.releaseStatus, "released");
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.compatibilityStatus, "compatible");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.lockStatus, "locked");
  assert.equal(verification.stability, "stable");
  assert.equal(verification.consumerReadiness, "ready-for-consumer");
  assert.equal(verification.freezeVerified, true);

  const freezeVerification =
    verifyExecutiveCockpitIntegrationCertificationFreeze();
  assert.equal(freezeVerification.ok, true);
  assert.equal(freezeVerification.readyForPublicIndex, true);

  const freeze = getExecutiveCockpitIntegrationCertificationFreeze();
  assert.equal(freeze.platformLock, platformLock);
  assert.equal(freeze.consumerReadiness, "ready-for-public-index");

  const failed = verifyExecutiveCockpitIntegrationPublicIndex({
    forceFailure: true,
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.releaseStatus, "unreleased");
  assert.equal(failed.consumerReadiness, "not-ready");
});

test("14. consumer guarantees and invariants", () => {
  assert.equal(guarantees.length, 14);
  assert.equal(invariants.length, 30);
  assert.equal(metadataApis.length, 6);
  assert.deepEqual([...metadataApis], [
    "getExecutiveCockpitIntegrationPublicIndexIdentity",
    "getExecutiveCockpitIntegrationPublicIndexRegistry",
    "getExecutiveCockpitIntegrationReleaseInformation",
    "getExecutiveCockpitIntegrationPublicConsumerInformation",
    "validateExecutiveCockpitIntegrationPublicIndex",
    "verifyExecutiveCockpitIntegrationPublicIndex",
  ]);
});

test("15. no React / Three.js / R3F / AI / network / persistence / NEX-CI:10", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /\bfrom\s+["']openai["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']@anthropic-ai\//);
  assert.doesNotMatch(source, /\bfrom\s+["']@google\/generative-ai["']/);
  assert.doesNotMatch(
    source,
    /\b(?:window\.localStorage|window\.indexedDB|new\s+XMLHttpRequest|fetch\s*\()\b/,
  );
  assert.equal(module.boundary.introducesReact, false);
  assert.equal(module.boundary.introducesThreeJs, false);
  assert.equal(module.boundary.introducesAiSdk, false);
  assert.equal(module.boundary.ownsNetworkAccess, false);
  assert.equal(module.boundary.ownsPersistence, false);
  assert.equal(module.boundary.introducesNewBehavior, false);
  assert.equal(module.boundary.implementsNexCi10, false);
  assert.equal(module.boundary.publicationOnly, true);
  assert.doesNotMatch(source, /NEX-CI:10\//);
});
