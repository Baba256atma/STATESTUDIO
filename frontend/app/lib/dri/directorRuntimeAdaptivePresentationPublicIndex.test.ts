import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as freezeSurface from "./directorRuntimeAdaptivePresentationFreeze.ts";
import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_APPROVED_FROZEN_EXPORTS as approvedExports,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CONSUMER_RULES as consumerRules,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_IDENTITY_CHAIN as identityChain,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_NAMESPACE_CHAIN as namespaceChain,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_NAMESPACE_STAGES as namespaceStages,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PROHIBITED_CONSUMER_IMPORTS as prohibitedImports,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PUBLIC_CONSTANT_NAMES as publicConstants,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PUBLIC_EXPORT_MANIFEST as publicManifest,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PUBLIC_INDEX_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PUBLIC_TYPE_NAMES as publicTypes,
  DRI_5_ADAPTIVE_PRESENTATION_PLATFORM_LOCK as lockValue,
  areDirectorRuntimeAdaptivePresentationPlansEqual,
  compareDirectorRuntimeAdaptivePresentationPlans,
  createDirectorRuntimeAdaptivePresentationPlanSnapshot,
  createDirectorRuntimePresentationIntent,
  directorRuntimeAdaptivePresentationConsumerImportPath as consumerPath,
  directorRuntimeAdaptivePresentationConsumerInformation as consumerInfo,
  directorRuntimeAdaptivePresentationConsumerRole as consumerRole,
  directorRuntimeAdaptivePresentationPublicIndex as publicIndex,
  directorRuntimeAdaptivePresentationPublicIndexIdentity as identity,
  directorRuntimeAdaptivePresentationPublicIndexNamespace as namespace,
  directorRuntimeAdaptivePresentationPublicIndexRegistry as registry,
  directorRuntimeAdaptivePresentationPublicIndexVersion as version,
  directorRuntimeAdaptivePresentationPublicLock as lock,
  directorRuntimeAdaptivePresentationReleaseInformation as releaseInfo,
  findDirectorRuntimeAdaptivePresentationPlanById,
  orchestrateDirectorRuntimeAdaptivePresentation,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  validateDirectorRuntimePresentationIntent,
  verifyDirectorRuntimeAdaptivePresentationConsumerEntry,
  verifyDirectorRuntimeAdaptivePresentationPublicIndex,
  verifyDirectorRuntimeAdaptivePresentationPublicSurface,
} from "./directorRuntimeAdaptivePresentationPublicIndex.ts";

const source = readFileSync(
  new URL("./directorRuntimeAdaptivePresentationPublicIndex.ts", import.meta.url),
  "utf8",
);

function buildOrchestrationInput() {
  const subject = { subjectId: "Inventory", subjectKind: "NexoraObject" as const };
  const intent = createDirectorRuntimePresentationIntent({
    intentId: "intent-public-1",
    subject,
    state: "report",
    attention: "warning",
    density: "standard",
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
    source: "scene",
  });
  const stateResolution = resolveDirectorRuntimePresentationState({
    subject,
    requiresExecutiveReport: true,
    requiresOperation: false,
  });
  const attentionEmphasis = resolveDirectorRuntimeAttentionEmphasisPolicy({
    subject,
    resolvedState: stateResolution,
    signal: "risk",
    riskPresent: true,
    actionRequired: false,
    exceptionPresent: false,
  });
  const densityResolution = resolveDirectorRuntimeInformationDensity({
    subject,
    attentionPolicy: attentionEmphasis,
    signal: "inspection",
    inspectionRequired: true,
    analysisRequired: false,
    decisionContextRequired: false,
    operationContextRequired: false,
  });
  return { intent, stateResolution, attentionEmphasis, densityResolution };
}

test("1. publishes exact DRI-5:9 identity, version, and namespace", () => {
  assert.deepEqual({ identity, version, namespace }, {
    identity: "DRI-5:9/DirectorRuntimeAdaptivePresentationPublicIndex",
    version: "5.9.0",
    namespace: "nexora.dri.adaptive-presentation.public-index",
  });
  assert.equal(publicIndex.phase, "DRI-5:9");
  assert.equal(Object.isFrozen(publicIndex), true);
});

test("2. sole immediate dependency is DRI-5:8 Freeze", () => {
  assert.equal(
    publicIndex.immediateDependency,
    "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze",
  );
  assert.equal(registry.dependency, publicIndex.immediateDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAdaptivePresentationFreeze"],
  );
  const importBlock = imports.join("\n");
  assert.doesNotMatch(
    importBlock,
    /Platform|Orchestration|DensityPolicy|EmphasisPolicy|StateResolver|PresentationIntent|Foundation/,
  );
});

test("3. consumer path and role are exact", () => {
  assert.equal(
    consumerPath,
    "@/app/lib/dri/directorRuntimeAdaptivePresentationPublicIndex",
  );
  assert.equal(consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumerInfo.consumerPath, consumerPath);
  assert.equal(consumerInfo.consumerRole, consumerRole);
  assert.equal(consumerInfo.soleConsumerEntryPoint, true);
});

test("4. release state is Released · Certified · Frozen · Compatible · Stable · ReadyForConsumer", () => {
  assert.equal(releaseInfo.releaseStatus, "Released");
  assert.equal(releaseInfo.certification, "Certified");
  assert.equal(releaseInfo.freeze, "Frozen");
  assert.equal(releaseInfo.compatibility, "Compatible");
  assert.equal(releaseInfo.stability, "Stable");
  assert.equal(releaseInfo.readiness, "ReadyForConsumer");
  assert.equal(consumerInfo.readiness, "ReadyForConsumer");
  assert.match(
    publicIndex.architecturalStatus,
    /Released · Certified · Frozen · Compatible · Stable · Locked · ReadyForConsumer · SoleConsumerEntryPoint/,
  );
});

test("5. lock is exact and active", () => {
  assert.equal(lockValue, "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED");
  assert.deepEqual(lock, {
    lock: "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED",
    locked: true,
  });
  assert.equal(lock, freezeSurface.DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK);
  assert.equal(Object.isFrozen(lock), true);
});

test("6. identity chain has exactly nine ordered DRI-5 identities", () => {
  assert.deepEqual([...identityChain], [
    "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
    "DRI-5:2/DirectorRuntimePresentationIntent",
    "DRI-5:3/DirectorRuntimePresentationStateResolver",
    "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy",
    "DRI-5:5/DirectorRuntimeInformationDensityPolicy",
    "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration",
    "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
    "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze",
    "DRI-5:9/DirectorRuntimeAdaptivePresentationPublicIndex",
  ]);
  assert.equal(identityChain.length, 9);
  assert.equal(Object.isFrozen(identityChain), true);
});

test("7. namespace chain has exactly nine ordered stage namespaces", () => {
  assert.deepEqual([...namespaceStages], [
    "foundation",
    "intent",
    "state-resolver",
    "attention-emphasis-policy",
    "information-density-policy",
    "orchestration",
    "platform",
    "freeze",
    "public-index",
  ]);
  assert.equal(namespaceChain.length, 9);
  assert.deepEqual(
    namespaceChain.map((entry) => entry.namespace),
    [
      "nexora.dri.adaptive-presentation.foundation",
      "nexora.dri.adaptive-presentation.intent",
      "nexora.dri.adaptive-presentation.state-resolver",
      "nexora.dri.adaptive-presentation.attention-emphasis-policy",
      "nexora.dri.adaptive-presentation.information-density-policy",
      "nexora.dri.adaptive-presentation.orchestration",
      "nexora.dri.adaptive-presentation.platform",
      "nexora.dri.adaptive-presentation.freeze",
      "nexora.dri.adaptive-presentation.public-index",
    ],
  );
});

test("8. frozen export parity with DRI-5:8", () => {
  assert.equal(
    approvedExports,
    freezeSurface.DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS,
  );
  const names = approvedExports.map((entry) => entry.name);
  assert.deepEqual(
    names,
    [...freezeSurface.DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORT_NAMES],
  );
  assert.equal(new Set(names).size, names.length);
  assert.equal(publicManifest.frozenExportCount, approvedExports.length);
  assert.equal(Object.isFrozen(approvedExports), true);
});

test("9. public counts derive from frozen export registry", () => {
  const surface = verifyDirectorRuntimeAdaptivePresentationPublicSurface();
  assert.equal(surface.ok, true);
  assert.equal(surface.frozenExportCount, approvedExports.length);
  assert.equal(surface.publicTypeCount, publicTypes.length);
  assert.equal(surface.publicConstantCount, publicConstants.length);
  assert.equal(surface.publicFunctionalApiCount, publicApis.length);
  assert.equal(
    publicTypes.length,
    approvedExports.filter((entry) => entry.category === "type").length,
  );
  assert.equal(
    publicConstants.length,
    approvedExports.filter((entry) => entry.category === "constant").length,
  );
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicConstantCount, publicConstants.length);
  assert.equal(registry.publicApiCount, publicApis.length);
});

test("10. consumer rules prohibit direct DRI-5:1 through DRI-5:8 imports", () => {
  assert.equal(consumerRules.length, 12);
  assert.ok(consumerRules.includes("consumers-import-from-dri-5-9-only"));
  assert.ok(consumerRules.includes("consumers-do-not-import-foundation-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-presentation-intent-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-state-resolver-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-attention-emphasis-policy-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-information-density-policy-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-orchestration-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-platform-directly"));
  assert.ok(consumerRules.includes("consumers-do-not-import-freeze-directly"));
  assert.deepEqual([...prohibitedImports], [
    "@/app/lib/dri/directorRuntimeAdaptivePresentationFoundation",
    "@/app/lib/dri/directorRuntimePresentationIntent",
    "@/app/lib/dri/directorRuntimePresentationStateResolver",
    "@/app/lib/dri/directorRuntimeAttentionEmphasisPolicy",
    "@/app/lib/dri/directorRuntimeInformationDensityPolicy",
    "@/app/lib/dri/directorRuntimeAdaptivePresentationOrchestration",
    "@/app/lib/dri/directorRuntimeAdaptivePresentationPlatform",
    "@/app/lib/dri/directorRuntimeAdaptivePresentationFreeze",
  ]);
});

test("11. API parity with frozen DRI-5:8 references", () => {
  assert.equal(
    createDirectorRuntimePresentationIntent,
    freezeSurface.createDirectorRuntimePresentationIntent,
  );
  assert.equal(
    validateDirectorRuntimePresentationIntent,
    freezeSurface.validateDirectorRuntimePresentationIntent,
  );
  assert.equal(
    resolveDirectorRuntimePresentationState,
    freezeSurface.resolveDirectorRuntimePresentationState,
  );
  assert.equal(
    resolveDirectorRuntimeAttentionEmphasisPolicy,
    freezeSurface.resolveDirectorRuntimeAttentionEmphasisPolicy,
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity,
    freezeSurface.resolveDirectorRuntimeInformationDensity,
  );
  assert.equal(
    orchestrateDirectorRuntimeAdaptivePresentation,
    freezeSurface.orchestrateDirectorRuntimeAdaptivePresentation,
  );
  assert.equal(
    areDirectorRuntimeAdaptivePresentationPlansEqual,
    freezeSurface.areDirectorRuntimeAdaptivePresentationPlansEqual,
  );
  assert.equal(
    compareDirectorRuntimeAdaptivePresentationPlans,
    freezeSurface.compareDirectorRuntimeAdaptivePresentationPlans,
  );

  const input = buildOrchestrationInput();
  assert.equal(validateDirectorRuntimePresentationIntent(input.intent).valid, true);
  const fromPublic = orchestrateDirectorRuntimeAdaptivePresentation(input);
  const fromFreeze = freezeSurface.orchestrateDirectorRuntimeAdaptivePresentation(input);
  assert.deepEqual(fromPublic, fromFreeze);
  assert.equal(fromPublic.ok, true);
  assert.ok(fromPublic.plan);
  const snapshot = createDirectorRuntimeAdaptivePresentationPlanSnapshot([fromPublic.plan!]);
  assert.equal(
    findDirectorRuntimeAdaptivePresentationPlanById(snapshot.plans, fromPublic.plan!.planId)
      ?.planId,
    fromPublic.plan!.planId,
  );
});

test("12. certification and freeze preservation", () => {
  const certification = publicIndex.certification;
  assert.equal(certification.status, "Certified");
  assert.equal(certification.upstreamStatus, "certified");
  assert.equal(certification.failedCheckCount, 0);
  assert.equal(certification.passedCheckCount, 38);
  assert.equal(certification.result.status, "certified");

  assert.equal(releaseInfo.upstreamFreezeStatus, "frozen");
  assert.equal(releaseInfo.upstreamReadiness, "ready-for-public-index");
  assert.equal(freezeSurface.DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUS, "frozen");
  assert.equal(releaseInfo.releaseStatus, "Released");
  assert.equal(releaseInfo.stability, "Stable");
  assert.equal(releaseInfo.readiness, "ReadyForConsumer");
});

test("13. verification APIs succeed", () => {
  const verification = verifyDirectorRuntimeAdaptivePresentationPublicIndex();
  assert.equal(verification.ok, true);
  assert.equal(verification.identityChainCount, 9);
  assert.equal(verification.namespaceChainCount, 9);
  assert.equal(verification.frozenExportCount, approvedExports.length);
  assert.equal(verification.publicTypeCount, publicTypes.length);
  assert.equal(verification.publicConstantCount, publicConstants.length);
  assert.equal(verification.publicFunctionalApiCount, publicApis.length);
  assert.equal(verification.consumerRuleCount, 12);
  assert.equal(verification.invariantCount, 45);
  assert.equal(verification.lock, "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED");
  assert.deepEqual(
    verifyDirectorRuntimeAdaptivePresentationPublicIndex(),
    verification,
  );

  const consumer = verifyDirectorRuntimeAdaptivePresentationConsumerEntry();
  assert.equal(consumer.ok, true);
  assert.equal(consumer.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(
    consumer.consumerPath,
    "@/app/lib/dri/directorRuntimeAdaptivePresentationPublicIndex",
  );

  const surface = verifyDirectorRuntimeAdaptivePresentationPublicSurface();
  assert.equal(surface.ok, true);
});

test("14. practical runtime immutability", () => {
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.equal(Object.isFrozen(releaseInfo), true);
  assert.equal(Object.isFrozen(consumerInfo), true);
  assert.equal(Object.isFrozen(consumerRules), true);
  assert.equal(Object.isFrozen(identityChain), true);
  assert.equal(Object.isFrozen(namespaceChain), true);
  assert.equal(Object.isFrozen(publicManifest), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(verifyDirectorRuntimeAdaptivePresentationPublicIndex()), true);
});

test("15. renderer and framework independence", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  const importBlock = imports.join("\n");
  assert.doesNotMatch(importBlock, /^react$/m);
  assert.doesNotMatch(importBlock, /react-dom|^three$|next\//);
  assert.equal(importBlock.includes("@react-" + "three"), false);
  assert.equal(importBlock.includes("framer-" + "motion"), false);
  assert.doesNotMatch(importBlock, /components/);
  assert.doesNotMatch(source, /\bdocument\.|\bwindow\.|\blocalStorage\b|\bHTMLElement\b/);
});

test("16. no new presentation or renderer behavior", () => {
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+createDirectorRuntimePresentationIntent\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimePresentationState\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeAttention\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeEmphasis\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeInformationDensity\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+orchestrateDirectorRuntimeAdaptivePresentation\s*\(/m);
  assert.equal(source.includes("PRESENTATION_STATE_" + "PRECEDENCE"), false);
  assert.equal(source.includes("ATTENTION_" + "PRECEDENCE"), false);
  assert.equal(source.includes("INFORMATION_DENSITY_" + "PRECEDENCE"), false);
  assert.doesNotMatch(source, /\bKPI\b|\bKOI\b|risk-engine|Three\.js|AnimatableObject/);
});

test("17. sole consumer entry architectural contract", () => {
  assert.equal(consumerRole, "SoleConsumerEntryPoint");
  assert.equal(prohibitedImports.length, 8);
  assert.equal(
    consumerPath,
    "@/app/lib/dri/directorRuntimeAdaptivePresentationPublicIndex",
  );
  assert.equal(invariants.includes("dri-5-is-complete-at-dri-5-9"), true);
  assert.equal(invariants.length, 45);
  assert.equal(publicIndex.stage, "PublicIndex");
  assert.doesNotMatch(source, /DRI-5:10|directorRuntimeAdaptivePresentationPublicIndex10/);
});
