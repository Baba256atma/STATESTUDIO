import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES as presentationStates,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS as subjectKinds,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES as surfaces,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY as boundary,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS as sections,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES as validationApis,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS as publishedRuntimeSymbols,
  composeRuntimeEnabledExecutiveExperiencePlatform,
  getRuntimeEnabledExecutiveExperiencePublicIndexIdentity,
  resolveRuntimeEnabledExecutiveExperiencePublicIndexRelease,
  runtimeEnabledExecutiveExperiencePublicIndex as publicIndex,
  runtimeEnabledExecutiveExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperiencePublicIndexModule as publicIndexModule,
  runtimeEnabledExecutiveExperiencePublicIndexRegistry as registry,
  verifyRuntimeEnabledExecutiveExperienceConsumerEntry,
  verifyRuntimeEnabledExecutiveExperiencePublicationCompleteness,
} from "./runtimeEnabledExecutiveExperiencePublicIndex.ts";

import {
  runtimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze";

import { verifyRuntimeEnabledExecutiveExperiencePlatform } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePlatform";
import { verifyAdaptivePresentationBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding";
import { verifyExecutiveInteractionBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding";
import { verifyExecutiveSceneBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding";
import { verifyRuntimeContextStateBinding } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding";
import { verifyExecutiveRuntimeContracts } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts";
import { verifyRuntimeEnabledExecutiveExperienceFoundation } from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperiencePublicIndex.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact REX-1:9 identity / version / namespace / layer / phase / stage", () => {
  assert.equal(
    publicIndexModule.identity,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(publicIndexModule.version, "1.9.0");
  assert.equal(
    publicIndexModule.namespace,
    "nexora.rex.runtime-enabled-executive-experience.public-index",
  );
  assert.equal(publicIndexModule.layer, "REX");
  assert.equal(publicIndexModule.phase, "REX-1");
  assert.equal(publicIndexModule.stage, "PublicIndex");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-1:8 certification freeze", () => {
  assert.equal(
    publicIndexModule.upstreamDependency,
    "REX-1:8/RuntimeEnabledExecutiveExperienceCertificationFreeze",
  );
  assert.equal(
    publicIndexModule.upstreamDependency,
    runtimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    publicIndexModule.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze",
  ]);
});

test("3. forbidden direct dependency boundaries", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding|Platform)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|next\/router|next\/navigation)["']/i,
  );
  assert.equal(boundary.consumesCertificationFreezeOnly, true);
  assert.equal(boundary.importsPlatformDirectly, false);
  assert.equal(boundary.importsPresentationBindingDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.isSoleConsumerEntryPoint, true);
});

test("4. supported import path and SoleConsumerEntryPoint role", () => {
  assert.equal(
    publicIndexModule.supportedImportPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(publicIndexModule.role, "SoleConsumerEntryPoint");
  assert.equal(
    publicIndex.Identity.consumerRole,
    "SoleConsumerEntryPoint",
  );
  assert.equal(
    publicIndex.ConsumerInformation.supportedImportPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  );
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
    "REX-1-RUNTIME-ENABLED-EXECUTIVE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, publicIndexModule.platformLock);
  assert.equal(
    publicIndex.ReleaseInformation.releaseStatus,
    "Released",
  );
  assert.equal(
    publicIndex.Certification.certificationStatus,
    "Certified",
  );
  assert.equal(
    publicIndex.Compatibility.overallStatus,
    "Compatible",
  );
});

test("6. exactly nine namespace sections in canonical order", () => {
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
});

test("7. approved exports only and publication completeness", () => {
  for (const symbol of publishedRuntimeSymbols) {
    assert.ok(
      (approvedExports as readonly string[]).includes(symbol),
      `published runtime symbol not approved: ${symbol}`,
    );
  }
  assert.ok(approvedExports.includes(
    "composeRuntimeEnabledExecutiveExperiencePlatform",
  ));
  assert.ok(approvedExports.includes(
    "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES",
  ));
  assert.ok(approvedExports.includes(
    "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS",
  ));

  const completeness =
    verifyRuntimeEnabledExecutiveExperiencePublicationCompleteness();
  assert.equal(completeness.ok, true);
  assert.equal(completeness.missingApprovedRuntimeSymbols.length, 0);
  assert.equal(completeness.namespaceSectionsPresent, true);
  assert.equal(completeness.registryCountsMatch, true);
  assert.equal(typeof composeRuntimeEnabledExecutiveExperiencePlatform, "function");
});

test("8. public type / API / validation registry consistency", () => {
  assert.ok(publicTypes.length > 0);
  assert.ok(publicApis.includes("composeRuntimeEnabledExecutiveExperiencePlatform"));
  assert.ok(
    validationApis.includes("verifyRuntimeEnabledExecutiveExperienceConsumerEntry"),
  );
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, publicApis.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.platformCapabilityCount, capabilities.length);
  assert.equal(registry.surfaceCount, surfaces.length);
});

test("9. certification / compatibility publication", () => {
  assert.equal(publicIndex.Certification.failedCheckCount, 0);
  assert.equal(
    publicIndex.Certification.passedCheckCount,
    publicIndex.Certification.totalCheckCount,
  );
  assert.equal(
    publicIndex.Certification.platformLock,
    "REX-1-RUNTIME-ENABLED-EXECUTIVE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(
    publicIndex.Certification.publicIndexReadiness,
    "ReadyForPublicIndex",
  );
  assert.equal(publicIndex.Compatibility.rexChainCompatible, true);
  assert.equal(publicIndex.Compatibility.runtimeAuthorityCompatible, true);
  assert.equal(publicIndex.Compatibility.surfaceCompatible, true);
  assert.equal(publicIndex.Compatibility.sceneCompatible, true);
  assert.equal(publicIndex.Compatibility.interactionCompatible, true);
  assert.equal(publicIndex.Compatibility.presentationCompatible, true);
  assert.equal(publicIndex.Compatibility.consumerCompatible, true);
  assert.equal(
    publicIndex.Compatibility.runtimeAuthorityPolicy,
    "EX-DRI → REX",
  );
});

test("10. canonical surfaces / subjects / presentation states preserved", () => {
  assert.deepEqual([...surfaces], [
    "experience",
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
  ]);
  assert.deepEqual([...subjectKinds], [
    "goal",
    "object",
    "problem",
    "scenario",
    "decision",
    "execution",
    "kpi",
    "koi",
    "pack",
  ]);
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.ok(![...subjectKinds].includes("kor" as never));
});

test("11. consumer guarantees and immutability", () => {
  assert.equal(consumerGuarantees.length, 25);
  assert.equal(Object.isFrozen(consumerGuarantees), true);
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(sections), true);
  assert.equal(Object.isFrozen(boundary), true);
  assert.equal(Object.isFrozen(publicIndexModule), true);
});

test("12. deterministic consumer verification and no upstream mutation", () => {
  const freezeBefore = JSON.stringify(
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze(),
  );
  const first = verifyRuntimeEnabledExecutiveExperienceConsumerEntry();
  const second = verifyRuntimeEnabledExecutiveExperienceConsumerEntry();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.releaseStatus, "Released");
  assert.equal(first.certificationStatus, "Certified");
  assert.equal(first.compatibilityStatus, "Compatible");
  assert.equal(first.freezeStatus, "Frozen");
  assert.equal(first.lockStatus, "Locked");
  assert.equal(first.stability, "Stable");
  assert.equal(first.consumerReadiness, "ReadyForConsumer");
  assert.equal(first.sectionCount, 9);
  assert.equal(first.namespaceOrderValid, true);
  assert.equal(first.approvedPublicationOnly, true);
  assert.equal(first.publicationComplete, true);
  assert.equal(first.surfacesPreserved, true);
  assert.equal(first.subjectsPreserved, true);
  assert.equal(first.presentationStatesPreserved, true);
  assert.equal(first.introducesNoBehavior, true);

  assert.equal(
    JSON.stringify(verifyRuntimeEnabledExecutiveExperienceCertificationFreeze()),
    freezeBefore,
  );

  const failed = resolveRuntimeEnabledExecutiveExperiencePublicIndexRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "Unreleased");
  assert.equal(failed.consumerReadiness, "NotReadyForConsumer");
});

test("13. no React / Three.js / renderer / AI / persistence / network / new behavior", () => {
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(publicIndexModule.introducesRuntimeBehavior, false);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /SceneRenderer/);
  assert.doesNotMatch(source, /openai|anthropic|@ai-sdk/i);
  assert.doesNotMatch(source, /fetch\s*\(|localStorage|indexedDB/);
  assert.doesNotMatch(source, /createStore|EventEmitter|eventBus/);
});

test("14. REX-1:1 through REX-1:8 regression markers remain healthy", () => {
  assert.equal(
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze().ok,
    true,
  );
  assert.equal(verifyRuntimeEnabledExecutiveExperiencePlatform().ok, true);
  assert.equal(verifyAdaptivePresentationBinding().ok, true);
  assert.equal(verifyExecutiveInteractionBinding().ok, true);
  assert.equal(verifyExecutiveSceneBinding().ok, true);
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
