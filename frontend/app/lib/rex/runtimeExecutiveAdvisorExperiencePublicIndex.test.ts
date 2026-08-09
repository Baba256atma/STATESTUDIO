import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_IDENTITY_CHAIN as identityChain,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_CONSUMER_POLICIES as consumerPolicies,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_INDEX_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_INDEX_SECTIONS as sections,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES as validationApis,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS as publishedRuntimeSymbols,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES as platformGuarantees,
  getRuntimeExecutiveAdvisorExperiencePublicIndexIdentity,
  resolveRuntimeExecutiveAdvisorExperiencePlatform,
  resolveRuntimeExecutiveAdvisorExperiencePublicIndexRelease,
  runtimeExecutiveAdvisorExperiencePublicIndex as publicIndex,
  runtimeExecutiveAdvisorExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorExperiencePublicIndexModule as publicIndexModule,
  runtimeExecutiveAdvisorExperiencePublicIndexRegistry as registry,
  verifyRuntimeExecutiveAdvisorExperienceConsumerEntry,
  verifyRuntimeExecutiveAdvisorExperiencePublicationCompleteness,
} from "./runtimeExecutiveAdvisorExperiencePublicIndex.ts";

import {
  runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
  resolveRuntimeExecutiveAdvisorExperiencePlatform as resolveFromFreeze,
  verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperienceCertificationFreeze";

import type {
  RuntimeExecutiveAdvisorExperiencePlatformResult,
} from "./runtimeExecutiveAdvisorExperiencePublicIndex.ts";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveAdvisorExperiencePublicIndex.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact REX-3:9 identity / version / namespace / phase / SoleConsumerEntryPoint", () => {
  assert.equal(
    publicIndexModule.identity,
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex",
  );
  assert.equal(publicIndexModule.version, "3.9.0");
  assert.equal(
    publicIndexModule.namespace,
    "nexora.rex.advisor-experience.public-index",
  );
  assert.equal(publicIndexModule.layer, "RuntimeExecutiveExperience");
  assert.equal(publicIndexModule.domain, "ExecutiveAdvisor");
  assert.equal(publicIndexModule.phase, "PublicIndex");
  assert.equal(publicIndexModule.role, "SoleConsumerEntryPoint");
  assert.equal(publicIndexModule.consumerRole, "SoleConsumerEntryPoint");
  assert.deepEqual(
    getRuntimeExecutiveAdvisorExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-3:8; no backward imports", () => {
  assert.equal(
    publicIndexModule.upstreamDependency,
    "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze",
  );
  assert.equal(
    publicIndexModule.upstreamDependency,
    runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    publicIndexModule.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveAdvisorExperienceCertificationFreeze",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorExperienceCertificationFreeze",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:ExperiencePlatform|ExperienceOrchestration|StageCoordination|GuidanceActions|ResponseModel|ContextSubjectBinding|ExperienceFoundation)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:rex\/runtimeEnabled|rex\/runtimeExecutiveStage|ex-dri|dri|nol)/,
  );
  assert.equal(boundary.consumesCertificationFreezeOnly, true);
  assert.equal(boundary.importsPlatformDirectly, false);
  assert.equal(boundary.importsRex37Directly, false);
  assert.equal(boundary.introducesRuntimeBehavior, false);
});

test("3. type-only imports also respect REX-3:8 boundary", () => {
  const typeFromClauses = [
    ...source.matchAll(/export type\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
  assert.ok(typeFromClauses.length > 0);
  assert.ok(
    typeFromClauses.every(
      (path) =>
        path ===
        "@/app/lib/rex/runtimeExecutiveAdvisorExperienceCertificationFreeze",
    ),
  );
});

test("4. supported import path and nine ordered namespace sections", () => {
  assert.equal(
    publicIndexModule.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex",
  );
  assert.deepEqual([...sections], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.equal(sections.length, 9);
  assert.deepEqual(Object.keys(publicIndex), [...sections]);
  assert.ok(Object.isFrozen(publicIndex));
  assert.ok(Object.isFrozen(publicIndexModule));
  assert.ok(Object.isFrozen(registry));
});

test("5. release / certification / compatibility / freeze / lock / stability / readiness", () => {
  assert.equal(publicIndexModule.releaseStatus, "Released");
  assert.equal(publicIndexModule.certificationStatus, "Certified");
  assert.equal(publicIndexModule.compatibilityStatus, "Compatible");
  assert.equal(publicIndexModule.freezeStatus, "Frozen");
  assert.equal(publicIndexModule.lockStatus, "Locked");
  assert.equal(publicIndexModule.stability, "Stable");
  assert.equal(publicIndexModule.consumerReadiness, "ReadyForConsumer");
  assert.equal(
    publicIndexModule.platformLock,
    "REX-3-RUNTIME-EXECUTIVE-ADVISOR-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, publicIndexModule.platformLock);
  assert.equal(publicIndex.ReleaseInformation.releaseStatus, "Released");
  assert.equal(publicIndex.Certification.certificationStatus, "Certified");
  assert.equal(publicIndex.Compatibility.overallStatus, "Compatible");
  assert.equal(publicIndex.Identity.consumerRole, "SoleConsumerEntryPoint");
  assert.deepEqual([...publicIndex.ReleaseInformation.statusTuple], [
    "Released",
    "Certified",
    "Compatible",
    "Frozen",
    "Locked",
    "Stable",
    "ReadyForConsumer",
  ]);
});

test("6. namespace sections valid; registry counts derived", () => {
  assert.equal(
    publicIndex.Identity.identity,
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex",
  );
  assert.ok(publicIndex.PublicTypes.typeCount > 0);
  assert.ok(publicIndex.PublicAPIs.apiCount > 0);
  assert.ok(publicIndex.Validation.validationApiCount > 0);
  assert.equal(publicIndex.Certification.failedCheckCount, 0);
  assert.equal(
    publicIndex.Certification.passedCheckCount,
    publicIndex.Certification.totalCheckCount,
  );
  assert.equal(publicIndex.Registry.sectionCount, 9);
  assert.equal(registry.namespaceSectionCount, 9);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicFunctionalApiCount, publicApis.length);
  assert.equal(registry.publicValidationApiCount, validationApis.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.guaranteeCount, platformGuarantees.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
  assert.equal(registry.consumerPolicyCount, consumerPolicies.length);
  assert.equal(registry.identityChainCount, 9);
  assert.equal(
    publicIndex.ConsumerInformation.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex",
  );
});

test("7. approved exports unique / traceable; no unauthorized escape", () => {
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  for (const symbol of publishedRuntimeSymbols) {
    assert.ok(
      (approvedExports as readonly string[]).includes(symbol),
      `published runtime symbol not approved: ${symbol}`,
    );
  }
  const completeness =
    verifyRuntimeExecutiveAdvisorExperiencePublicationCompleteness();
  assert.equal(completeness.ok, true);
  assert.equal(completeness.missingApprovedRuntimeSymbols.length, 0);
});

test("8. no duplicate export names in public catalogs", () => {
  assert.equal(new Set(publicTypes).size, publicTypes.length);
  assert.equal(new Set(publicApis).size, publicApis.length);
  assert.equal(new Set(validationApis).size, validationApis.length);
  assert.equal(new Set(publishedRuntimeSymbols).size, publishedRuntimeSymbols.length);
  assert.equal(new Set(consumerGuarantees).size, consumerGuarantees.length);
  assert.equal(new Set(consumerPolicies).size, consumerPolicies.length);
});

test("9. frozen type publication and type-only consumer import", () => {
  assert.ok(publicTypes.includes("RuntimeExecutiveAdvisorExperiencePlatformResult"));
  assert.ok(publicTypes.includes("RuntimeExecutiveAdvisorPlatformInput"));
  assert.ok(publicTypes.includes("RuntimeExecutiveAdvisorPlatformState"));
  const typeProbe: RuntimeExecutiveAdvisorExperiencePlatformResult | null = null;
  assert.equal(typeProbe, null);
});

test("10. frozen value re-exports are reference-equal (no wrappers)", () => {
  assert.equal(resolveRuntimeExecutiveAdvisorExperiencePlatform, resolveFromFreeze);
  assert.equal(
    publicIndex.PublicAPIs.resolveRuntimeExecutiveAdvisorExperiencePlatform,
    resolveFromFreeze,
  );
});

test("11. certification / freeze info exactly reflects REX-3:8", () => {
  const freezeOk = verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze();
  assert.equal(freezeOk.ok, true);
  assert.equal(publicIndex.Certification.platformLock, platformLock);
  assert.equal(publicIndex.Certification.freezeStatus, "Frozen");
  assert.equal(publicIndex.Certification.lockStatus, "Locked");
  assert.equal(publicIndex.Certification.compatibilityStatus, "Compatible");
  assert.equal(
    publicIndex.Certification.certificationIdentity,
    "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze",
  );
});

test("12. Released requires Certified · Compatible · Frozen · Locked", () => {
  const release = resolveRuntimeExecutiveAdvisorExperiencePublicIndexRelease();
  assert.equal(release.releaseStatus, "Released");
  assert.equal(release.certificationStatus, "Certified");
  assert.equal(release.compatibilityStatus, "Compatible");
  assert.equal(release.freezeStatus, "Frozen");
  assert.equal(release.lockStatus, "Locked");
  assert.equal(release.gatePassed, true);
  const failed = resolveRuntimeExecutiveAdvisorExperiencePublicIndexRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "Unreleased");
  assert.equal(failed.gatePassed, false);
});

test("13. consumer guarantees and policy", () => {
  assert.ok(consumerGuarantees.includes("sole-consumer-entry-point"));
  assert.ok(consumerGuarantees.includes("manager-authority-safe"));
  assert.ok(consumerGuarantees.includes("stage-ownership-safe"));
  assert.ok(consumerGuarantees.includes("context-safe"));
  assert.ok(consumerGuarantees.includes("confirmation-safe"));
  assert.ok(consumerGuarantees.includes("non-executing-advisor"));
  assert.ok(consumerGuarantees.includes("ai-provider-neutral"));
  assert.ok(consumerGuarantees.includes("renderer-neutral"));
  assert.ok(consumerPolicies.includes("consume-public-index-only"));
  assert.ok(consumerPolicies.includes("do-not-import-rex-3-internals"));
  assert.ok(consumerPolicies.includes("do-not-bypass-manager-confirmation"));
  assert.ok(consumerPolicies.includes("do-not-execute-stage-actions-directly"));
  assert.ok(consumerPolicies.includes("do-not-rewrite-frozen-semantics"));
  assert.ok(consumerPolicies.includes("do-not-assume-ai-provider"));
});

test("14. Public Index verifier succeeds; deterministic", () => {
  const first = verifyRuntimeExecutiveAdvisorExperienceConsumerEntry();
  const second = verifyRuntimeExecutiveAdvisorExperienceConsumerEntry();
  assert.equal(first.valid, true);
  assert.equal(first.identityValid, true);
  assert.equal(first.releaseValid, true);
  assert.equal(first.certificationValid, true);
  assert.equal(first.compatibilityValid, true);
  assert.equal(first.freezeValid, true);
  assert.equal(first.lockValid, true);
  assert.equal(first.registryValid, true);
  assert.equal(first.namespaceOrderValid, true);
  assert.equal(first.dependencyValid, true);
  assert.equal(first.approvedExportValid, true);
  assert.equal(first.consumerRoleValid, true);
  assert.equal(first.supportedImportPathValid, true);
  assert.deepEqual(first, second);
});

test("15. identity chain metadata count is 9", () => {
  assert.equal(identityChain.length, 9);
  assert.equal(identityChain[0], "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation");
  assert.equal(
    identityChain[7],
    "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze",
  );
  assert.equal(
    identityChain[8],
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex",
  );
  assert.equal(publicIndex.Identity.identityChainCount, 9);
});

test("16. manager authority / Stage ownership / context / confirmation preserved", () => {
  assert.ok(platformGuarantees.includes("manager-authority-preservation"));
  assert.ok(platformGuarantees.includes("stage-ownership-preservation"));
  assert.ok(platformGuarantees.includes("context-safety"));
  assert.ok(platformGuarantees.includes("confirmation-preservation"));
  assert.ok(platformGuarantees.includes("no-hidden-action-execution"));
  assert.ok(platformGuarantees.includes("no-ai-dependency"));
  assert.ok(platformGuarantees.includes("no-ui-dependency"));
  assert.equal(boundary.ownsStage, false);
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.aiProviderIndependent, true);
});

test("17. no AI / React / UI / nondeterminism in source", () => {
  assert.doesNotMatch(source, /\b(openai|anthropic|@ai-sdk|llm|embedding)\b/i);
  assert.doesNotMatch(source, /\b(react|jsx|next\/navigation)\b/i);
  assert.doesNotMatch(source, /\b(Math\.random|Date\.now|crypto\.randomUUID)\b/);
  assert.doesNotMatch(source, /\b(window|document)\b/);
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(publicIndexModule.introducesRuntimeBehavior, false);
});

test("18. source immutability and REX-3:8 compatibility", () => {
  assert.ok(Object.isFrozen(publicIndex));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(approvedExports));
  assert.ok(Object.isFrozen(sections));
  assert.ok(Object.isFrozen(consumerGuarantees));
  assert.ok(Object.isFrozen(consumerPolicies));
  assert.equal(verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze().ok, true);
  assert.equal(publicIndexModule.compatibilityStatus, "Compatible");
});

test("19. no new runtime behavior; publication completeness", () => {
  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.publishesApprovedExportsOnly, true);
  assert.doesNotMatch(source, /export\s+function\s+focus/i);
  assert.doesNotMatch(source, /export\s+function\s+navigate/i);
  assert.doesNotMatch(source, /export\s+function\s+approve/i);
  assert.equal(
    verifyRuntimeExecutiveAdvisorExperiencePublicationCompleteness().ok,
    true,
  );
});
