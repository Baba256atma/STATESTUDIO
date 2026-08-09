import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_CONNECTION_DISPOSITIONS as connectionDispositions,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_OBJECT_DISPOSITIONS as objectDispositions,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_SCENE_TRANSITION_INTENTS as sceneTransitions,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_INDEX_SECTIONS as sections,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES as validationApis,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS as publishedRuntimeSymbols,
  compareRuntimeExecutiveStageExperiencePlatformPlans,
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageExperiencePublicIndexIdentity,
  resolveRuntimeExecutiveStageExperience,
  resolveRuntimeExecutiveStageExperiencePublicIndexRelease,
  runtimeExecutiveStageExperiencePlatform,
  runtimeExecutiveStageExperiencePublicIndex as publicIndex,
  runtimeExecutiveStageExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveStageExperiencePublicIndexModule as publicIndexModule,
  runtimeExecutiveStageExperiencePublicIndexRegistry as registry,
  verifyRuntimeExecutiveStageExperienceConsumerEntry,
  verifyRuntimeExecutiveStageExperiencePublicationCompleteness,
} from "./runtimeExecutiveStageExperiencePublicIndex.ts";

import {
  runtimeExecutiveStageExperienceCertificationFreezeIdentity,
  resolveRuntimeExecutiveStageExperience as resolveFromFreeze,
  verifyRuntimeExecutiveStageExperienceCertificationFreeze,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceCertificationFreeze";

import { verifyRuntimeExecutiveStageExperiencePlatform } from "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform";
import { verifyRuntimeExecutiveStageExperienceOrchestration } from "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration";
import { verifyRuntimeExecutiveStagePresentationAttention } from "@/app/lib/rex/runtimeExecutiveStagePresentationAttention";
import { verifyRuntimeExecutiveStageFocusSelection } from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";
import { verifyRuntimeExecutiveStageModel } from "@/app/lib/rex/runtimeExecutiveStageModel";
import { verifyRuntimeExecutiveStageExperienceContracts } from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";
import { verifyRuntimeExecutiveStageExperienceFoundation } from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";
import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperiencePublicIndex.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / SoleConsumerEntryPoint", () => {
  assert.equal(
    publicIndexModule.identity,
    "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex",
  );
  assert.equal(publicIndexModule.version, "2.9.0");
  assert.equal(
    publicIndexModule.namespace,
    "nexora.rex.stage-experience.public-index",
  );
  assert.equal(publicIndexModule.layer, "REX");
  assert.equal(publicIndexModule.role, "SoleConsumerEntryPoint");
  assert.equal(publicIndexModule.phase, "PublicIndex");
  assert.deepEqual(
    getRuntimeExecutiveStageExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:8; no REX-2:1–2:7 imports", () => {
  assert.equal(
    publicIndexModule.upstreamDependency,
    "REX-2:8/RuntimeExecutiveStageExperienceCertificationFreeze",
  );
  assert.equal(
    publicIndexModule.upstreamDependency,
    runtimeExecutiveStageExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    publicIndexModule.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperienceCertificationFreeze",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperienceCertificationFreeze",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:ExperiencePlatform|ExperienceOrchestration|PresentationAttention|FocusSelection|Model|ExperienceFoundation|ExperienceContracts)["']/,
  );
  assert.equal(boundary.consumesCertificationFreezeOnly, true);
  assert.equal(boundary.importsPlatformDirectly, false);
  assert.equal(boundary.importsOrchestrationDirectly, false);
  assert.equal(boundary.importsRex27Directly, false);
  assert.equal(boundary.introducesStageBehavior, false);
});

test("3. type-only imports also respect REX-2:8 boundary", () => {
  const typeFromClauses = [
    ...source.matchAll(/export type\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
  assert.ok(typeFromClauses.length > 0);
  assert.ok(
    typeFromClauses.every(
      (path) =>
        path ===
        "@/app/lib/rex/runtimeExecutiveStageExperienceCertificationFreeze",
    ),
  );
});

test("4. supported import path and nine ordered namespace sections", () => {
  assert.equal(
    publicIndexModule.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex",
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
    "REX-2-RUNTIME-EXECUTIVE-STAGE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(platformLock, publicIndexModule.platformLock);
  assert.equal(publicIndex.ReleaseInformation.releaseStatus, "Released");
  assert.equal(publicIndex.Certification.certificationStatus, "Certified");
  assert.equal(publicIndex.Compatibility.overallStatus, "Compatible");
  assert.equal(publicIndex.Identity.consumerRole, "SoleConsumerEntryPoint");
});

test("6. namespace sections valid; registry counts derived", () => {
  assert.equal(
    publicIndex.Identity.identity,
    "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex",
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
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, publicApis.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.platformCapabilityCount, capabilities.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
  assert.equal(
    publicIndex.ConsumerInformation.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex",
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
    verifyRuntimeExecutiveStageExperiencePublicationCompleteness();
  assert.equal(completeness.ok, true);
  assert.equal(completeness.missingApprovedRuntimeSymbols.length, 0);
  assert.ok(approvedExports.includes("resolveRuntimeExecutiveStageExperience"));
  assert.ok(approvedExports.includes("RuntimeExecutiveStageExperiencePlan"));
  assert.ok(
    approvedExports.includes(
      "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES",
    ),
  );
});

test("8. presentation / object / connection / scene-change publication", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.deepEqual([...objectDispositions], [
    "primary",
    "contextual",
    "related",
    "selected",
    "attention-bearing",
    "background",
    "suppressed",
  ]);
  assert.deepEqual([...connectionDispositions], [
    "emphasized",
    "visible",
    "contextual",
    "de-emphasized",
    "suppressed",
  ]);
  assert.ok(sceneTransitions.includes("initial-scene"));
  assert.ok(sceneTransitions.includes("focus-change"));
  assert.ok(sceneTransitions.includes("selection-change"));
  assert.ok(sceneTransitions.includes("attention-change"));
  assert.ok(sceneTransitions.includes("presentation-state-change"));
  assert.ok(sceneTransitions.includes("relationship-emphasis-change"));
  assert.ok(sceneTransitions.includes("scene-replacement"));
  assert.ok(sceneTransitions.includes("scene-restoration"));
  assert.ok(capabilities.includes("focus-experience"));
  assert.ok(capabilities.includes("selection-experience"));
  assert.ok(capabilities.includes("attention-experience"));
  assert.ok(capabilities.includes("connection-experience"));
  assert.ok(capabilities.includes("scene-experience"));
  assert.ok(capabilities.includes("scene-change-experience"));
  assert.ok(capabilities.includes("nexora-object-experience"));
  assert.ok(capabilities.includes("experience-plan"));
  assert.ok(capabilities.includes("stage-orchestration"));
});

test("9. focus/selection/attention remain distinct; authorities preserved", () => {
  assert.ok(
    consumerGuarantees.some((g) => g.id === "focus-distinct-from-selection"),
  );
  assert.ok(
    consumerGuarantees.some((g) => g.id === "focus-distinct-from-attention"),
  );
  assert.ok(
    consumerGuarantees.some((g) => g.id === "selection-distinct-from-attention"),
  );
  assert.ok(
    consumerGuarantees.some((g) => g.id === "rex-2-8-certification-authority"),
  );
  assert.ok(
    consumerGuarantees.some((g) => g.id === "rex-2-7-platform-authority"),
  );
  assert.ok(
    consumerGuarantees.some((g) => g.id === "rex-2-6-orchestration-authority"),
  );
  assert.equal(consumerGuarantees.length, 25);
  assert.equal(
    runtimeExecutiveStageExperiencePlatform.orchestration
      .remainsOrchestrationAuthority,
    true,
  );
  assert.equal(
    runtimeExecutiveStageExperiencePlatform.identity,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
});

test("10. no wrappers; public API preserves original function identity", () => {
  assert.equal(resolveRuntimeExecutiveStageExperience, resolveFromFreeze);
  assert.equal(typeof resolveRuntimeExecutiveStageExperience, "function");
  assert.equal(typeof createRuntimeExecutiveStageModel, "function");
  assert.equal(
    typeof compareRuntimeExecutiveStageExperiencePlatformPlans,
    "function",
  );
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

test("11. verification succeeds; deterministic; no renderer/KPI behavior", () => {
  const freezeBefore = JSON.stringify(
    verifyRuntimeExecutiveStageExperienceCertificationFreeze(),
  );
  const first = verifyRuntimeExecutiveStageExperienceConsumerEntry();
  const second = verifyRuntimeExecutiveStageExperienceConsumerEntry();
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
  assert.equal(first.presentationStatesPreserved, true);
  assert.equal(first.dispositionsPreserved, true);
  assert.equal(first.platformAuthorityPreserved, true);
  assert.equal(first.orchestrationAuthorityPreserved, true);
  assert.equal(first.certificationAuthorityPreserved, true);
  assert.equal(first.introducesNoBehavior, true);
  assert.equal(
    JSON.stringify(verifyRuntimeExecutiveStageExperienceCertificationFreeze()),
    freezeBefore,
  );

  const failed = resolveRuntimeExecutiveStageExperiencePublicIndexRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "Unreleased");
  assert.equal(failed.consumerReadiness, "NotReadyForConsumer");

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
  assert.equal(boundary.inventsExecutiveDecisions, false);
});

test("12. upstream REX-2:1–2:8 regressions remain healthy", () => {
  assert.equal(
    verifyRuntimeExecutiveStageExperienceCertificationFreeze().ok,
    true,
  );
  assert.equal(verifyRuntimeExecutiveStageExperiencePlatform().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceOrchestration().ok, true);
  assert.equal(verifyRuntimeExecutiveStagePresentationAttention().ok, true);
  assert.equal(verifyRuntimeExecutiveStageFocusSelection().ok, true);
  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
