import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as freezeSurface from "./directorRuntimeSceneOrchestrationFreeze.ts";
import {
  DRI_3_SCENE_ORCHESTRATION_LOCK as lock,
  directorRuntimeSceneOrchestrationApprovedFrozenExports as approvedExports,
  directorRuntimeSceneOrchestrationCertificationStatus as certificationStatus,
  directorRuntimeSceneOrchestrationConsumerImportPath as importPath,
  directorRuntimeSceneOrchestrationConsumerReadiness as readiness,
  directorRuntimeSceneOrchestrationConsumerRole as consumerRole,
  directorRuntimeSceneOrchestrationConsumerRules as consumerRules,
  directorRuntimeSceneOrchestrationFreezeStatus as freezeStatus,
  directorRuntimeSceneOrchestrationPublicFunctionalApiNames as functionalApis,
  directorRuntimeSceneOrchestrationPublicIdentityChain as identityChain,
  directorRuntimeSceneOrchestrationPublicIndex as publicIndex,
  directorRuntimeSceneOrchestrationPublicIndexIdentity as identity,
  directorRuntimeSceneOrchestrationPublicIndexNamespace as namespace,
  directorRuntimeSceneOrchestrationPublicIndexRegistry as registry,
  directorRuntimeSceneOrchestrationPublicIndexVersion as version,
  directorRuntimeSceneOrchestrationPublicNamespaceSections as sections,
  directorRuntimeSceneOrchestrationPublicTypeNames as publicTypes,
  directorRuntimeSceneOrchestrationReleaseStatus as releaseStatus,
  directorRuntimeSceneOrchestrationStability as stability,
  isDirectorSceneOrchestrationPlatformEligible,
  isPublishedDirectorSceneOrchestrationPlatformResult,
  publishDirectorRuntimeSceneOrchestrationPlatform,
  verifyDirectorRuntimeSceneOrchestrationConsumerEntry,
} from "./directorRuntimeSceneOrchestrationPublicIndex.ts";

const source = readFileSync(
  new URL("./directorRuntimeSceneOrchestrationPublicIndex.ts", import.meta.url), "utf8");

test("publishes exact Public Index identity and sole DRI-3:8 Freeze dependency", () => {
  assert.deepEqual({
    identity, namespace, version, dependency: publicIndex.immediateDependency,
    lock, role: consumerRole, importPath,
  }, {
    identity: "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex",
    namespace: "nexora.dri.scene.orchestration.public-index",
    version: "3.9.0",
    dependency: "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze",
    lock: "DRI-3-SCENE-ORCHESTRATION-LOCKED",
    role: "SoleConsumerEntryPoint",
    importPath: "@/app/lib/dri/directorRuntimeSceneOrchestrationPublicIndex",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeSceneOrchestrationFreeze"]);
  assert.doesNotMatch(source, /from\s+["'][^"']*directorRuntimeScene(?:OrchestrationFoundation|OrchestrationContracts|OrchestrationModel|FocusAttentionOrchestration|OrchestrationValidation|OrchestrationCertification|OrchestrationPlatform)["']/);
});

test("publishes Released · Frozen · Certified · Stable · ReadyForConsumer statuses", () => {
  assert.equal(releaseStatus, "Released");
  assert.equal(freezeStatus, "Frozen");
  assert.equal(certificationStatus, "Certified");
  assert.equal(stability, "Stable");
  assert.equal(readiness, "ReadyForConsumer");
  assert.deepEqual(publicIndex.releaseInformation, {
    release: "Released", freeze: "Frozen", certification: "Certified",
    stability: "Stable", readiness: "ReadyForConsumer",
    lock: "DRI-3-SCENE-ORCHESTRATION-LOCKED", version: "3.9.0",
    namespace: "nexora.dri.scene.orchestration.public-index",
    platformAuthority: "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
    freezeAuthority: "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze",
  });
  assert.equal(lock, freezeSurface.directorRuntimeSceneOrchestrationLock);
});

test("exposes exactly nine ordered namespace sections and nine identity-chain entries", () => {
  assert.deepEqual(sections, [
    "Identity", "Public Types", "Public APIs", "Validation", "Certification",
    "Release Information", "Compatibility", "Registry", "Consumer Information",
  ]);
  assert.equal(sections.length, 9);
  assert.equal(registry.namespaceSectionCount, sections.length);
  assert.equal(new Set(sections).size, 9);
  assert.deepEqual(identityChain, [
    "DRI-3:1/DirectorRuntimeSceneOrchestrationFoundation",
    "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts",
    "DRI-3:3/DirectorRuntimeSceneOrchestrationModel",
    "DRI-3:4/DirectorRuntimeSceneFocusAttentionOrchestration",
    "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation",
    "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification",
    "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
    "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze",
    "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex",
  ]);
  assert.equal(identityChain.length, 9);
  assert.equal(registry.identityChainCount, identityChain.length);
  assert.equal(publicIndex.identity.identityChainCount, identityChain.length);
  for (const key of [
    "identity", "publicTypes", "publicApis", "validation", "certification",
    "releaseInformation", "compatibility", "registry", "consumerInformation",
  ] as const) assert.ok(key in publicIndex);
});

test("approved frozen exports are complete, exclusive, ordered, and duplicate-free", () => {
  const freezeExports = freezeSurface.directorRuntimeSceneOrchestrationFrozenPublicApiSurface;
  assert.equal(approvedExports, freezeExports);
  assert.deepEqual(approvedExports, freezeExports);
  assert.equal(registry.approvedFrozenExportCount, approvedExports.length);
  assert.equal(registry.approvedFrozenExportCount, freezeExports.length);
  assert.equal(new Set(approvedExports.map(({ exportName }) => exportName)).size,
    approvedExports.length);
  assert.deepEqual(approvedExports.map(({ exportName, exportKind }) => [exportName, exportKind]),
    freezeExports.map(({ exportName, exportKind }) => [exportName, exportKind]));
  assert.deepEqual(publicTypes, freezeSurface.directorRuntimeSceneOrchestrationFrozenPublicTypeNames);
  assert.deepEqual(functionalApis,
    freezeSurface.directorRuntimeSceneOrchestrationFrozenFunctionalApiNames);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicFunctionalApiCount, functionalApis.length);
});

test("preserves runtime API identity without wrappers", () => {
  assert.equal(publishDirectorRuntimeSceneOrchestrationPlatform,
    freezeSurface.publishDirectorRuntimeSceneOrchestrationPlatform);
  assert.equal(isDirectorSceneOrchestrationPlatformEligible,
    freezeSurface.isDirectorSceneOrchestrationPlatformEligible);
  assert.equal(isPublishedDirectorSceneOrchestrationPlatformResult,
    freezeSurface.isPublishedDirectorSceneOrchestrationPlatformResult);
  assert.equal(publicIndex.publicApis.publish,
    freezeSurface.publishDirectorRuntimeSceneOrchestrationPlatform);
  assert.equal(publicIndex.platform, freezeSurface.directorRuntimeSceneOrchestrationPlatform);
  assert.equal(publicIndex.freeze, freezeSurface.directorRuntimeSceneOrchestrationFreeze);
  assert.doesNotMatch(source,
    /const\s+publishDirectorRuntimeSceneOrchestrationPlatform\s*=\s*\(/);
  assert.doesNotMatch(source,
    /function\s+publishDirectorRuntimeSceneOrchestrationPlatform\s*\(/);
});

test("preserves authorities, vocabularies, operation order, and conditional transparency", () => {
  assert.equal(publicIndex.validation.authority,
    "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation");
  assert.deepEqual(publicIndex.validation.statuses, ["valid", "invalid"]);
  assert.deepEqual(publicIndex.validation.severities, ["notice", "warning", "error"]);
  assert.equal(publicIndex.certification.authority,
    "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification");
  assert.deepEqual(publicIndex.certification.statuses,
    ["certified", "conditionally-certified", "rejected"]);
  assert.deepEqual(publicIndex.certification.decisions,
    ["approve", "approve-with-conditions", "reject"]);
  assert.equal(publicIndex.certification.conditionalTransparency, true);
  assert.equal(publicIndex.releaseInformation.platformAuthority,
    "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform");
  assert.equal(publicIndex.releaseInformation.freezeAuthority,
    "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze");
  assert.deepEqual(publicIndex.operationOrder, [
    "preserve", "reveal", "conceal", "relate", "focus", "emphasize", "deemphasize", "attention",
  ]);
  assert.equal(publicIndex.operationKinds.length, 8);
  assert.deepEqual(publicIndex.attentionLevels, ["normal", "notice", "important", "critical"]);
  assert.deepEqual(publicIndex.attentionOrder, ["critical", "important", "notice", "normal"]);
  assert.ok(publicIndex.certification.statuses.includes("conditionally-certified"));
  assert.ok(freezeSurface.directorRuntimeSceneOrchestrationFreezeGuarantees
    .includes("conditions-preserved"));
  assert.ok(freezeSurface.directorRuntimeSceneOrchestrationFreezeGuarantees
    .includes("focus-attention-policy-preserved"));
});

test("consumer rules, verification, and immutability are deterministic", () => {
  assert.ok(consumerRules.includes("public-index-only"));
  assert.ok(consumerRules.includes("no-platform-import"));
  assert.ok(consumerRules.includes("no-freeze-import"));
  assert.ok(consumerRules.includes("preserve-certification-conditions"));
  assert.equal(publicIndex.consumerInformation.role, "SoleConsumerEntryPoint");
  assert.equal(publicIndex.consumerInformation.soleConsumerEntryPoint, true);
  const one = verifyDirectorRuntimeSceneOrchestrationConsumerEntry();
  const two = verifyDirectorRuntimeSceneOrchestrationConsumerEntry();
  assert.deepEqual(one, two);
  assert.equal(one.valid, true);
  assert.equal(one.readyForConsumer, true);
  assert.deepEqual(one.violations, []);
  assert.equal(one.sectionCount, 9);
  assert.equal(one.identityChainCount, 9);
  assert.equal(one.approvedFrozenExportCount, approvedExports.length);
  const freezeBefore = JSON.stringify(freezeSurface.directorRuntimeSceneOrchestrationFreeze);
  verifyDirectorRuntimeSceneOrchestrationConsumerEntry();
  assert.equal(JSON.stringify(freezeSurface.directorRuntimeSceneOrchestrationFreeze), freezeBefore);
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(sections), true);
  assert.equal(Object.isFrozen(identityChain), true);
  assert.equal(Object.isFrozen(consumerRules), true);
  assert.equal(Object.isFrozen(approvedExports), true);
});

test("registry counts are dynamically derived", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts],
    [registry.namespaceSectionCount, registry.namespaceSections],
    [registry.identityChainCount, registry.identityChain],
    [registry.approvedFrozenExportCount, registry.approvedFrozenExports],
    [registry.publicTypeCount, registry.publicTypes],
    [registry.publicFunctionalApiCount, registry.publicFunctionalApis],
    [registry.consumerRuleCount, registry.consumerRules],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.equal(new Set(registry.concepts).size, registry.concepts.length);
});

test("contains no new orchestration behavior and no forbidden dependencies", () => {
  assert.doesNotMatch(source, /function\s+(?:resolve|validate|certify|orchestrate)/i);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|camera|mesh|geometry|material|shader|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:calculateKpi|calculateKoi|rankScenario|approveDecision|openai|anthropic|llm|emit|dispatch)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:scene\.add|node\.focus|node\.hide)\b/);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(lock, "DRI-3-SCENE-ORCHESTRATION-LOCKED");
  assert.doesNotMatch(source, /DRI-3-SCENE-LOCKED|DRI3-SCENE-ORCHESTRATION-LOCKED|DRI-3-ORCHESTRATION-LOCKED/);
});
