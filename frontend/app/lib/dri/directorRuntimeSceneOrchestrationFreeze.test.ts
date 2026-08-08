import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as platformSurface from "./directorRuntimeSceneOrchestrationPlatform.ts";
import {
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_LEVELS as attentionLevels,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_ORDER as attentionOrder,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_DECISIONS as certificationDecisions,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_STATUSES as certificationStatuses,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_KINDS as operationKinds,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_ORDER as operationOrder,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_CAPABILITIES as frozenCapabilities,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_ELIGIBILITY_VALUES as frozenEligibility,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_GUARANTEES as frozenPlatformGuarantees,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_STATUSES as frozenPlatformStatuses,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_SEVERITIES as validationSeverities,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_STATUSES as validationStatuses,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES,
  directorRuntimeSceneOrchestrationFreeze as freeze,
  directorRuntimeSceneOrchestrationFreezeCompatibility as compatibility,
  directorRuntimeSceneOrchestrationFreezeConsumerRules as consumerRules,
  directorRuntimeSceneOrchestrationFreezeGuarantees as guarantees,
  directorRuntimeSceneOrchestrationFreezeManifest as manifest,
  directorRuntimeSceneOrchestrationFreezeRegistry as registry,
  directorRuntimeSceneOrchestrationFreezeReleaseInformation as releaseInformation,
  directorRuntimeSceneOrchestrationFreezeVerification as freezeVerification,
  directorRuntimeSceneOrchestrationFrozenFunctionalApiNames as functionalApis,
  directorRuntimeSceneOrchestrationFrozenIdentityChain as identityChain,
  directorRuntimeSceneOrchestrationFrozenPublicApiSurface as publicApiSurface,
  directorRuntimeSceneOrchestrationFrozenPublicTypeNames as publicTypes,
  directorRuntimeSceneOrchestrationLock as lock,
  directorRuntimeSceneOrchestrationPlatform,
  directorRuntimeSceneOrchestrationPlatformLock as platformLock,
  directorRuntimeSceneOrchestrationPublicIndexReadiness as publicIndexReadiness,
  isDirectorSceneOrchestrationPlatformEligible,
  isPublishedDirectorSceneOrchestrationPlatformResult,
  publishDirectorRuntimeSceneOrchestrationPlatform,
  verifyDirectorRuntimeSceneOrchestrationFreeze,
} from "./directorRuntimeSceneOrchestrationFreeze.ts";

const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationFreeze.ts", import.meta.url),
  "utf8");

test("publishes exact Freeze identity and sole DRI-3:7 Platform dependency", () => {
  assert.deepEqual({
    phase: freeze.phase, name: freeze.name, identity: freeze.identity,
    namespace: freeze.namespace, version: freeze.version,
    dependency: freeze.immediateDependency, upstream: freeze.upstream,
  }, {
    phase: "DRI-3:8", name: "DirectorRuntimeSceneOrchestrationFreeze",
    identity: "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze",
    namespace: "nexora.dri.scene.orchestration.freeze", version: "3.8.0",
    dependency: "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
    upstream: "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeSceneOrchestrationPlatform"]);
  assert.doesNotMatch(source, /directorRuntimeScene(?:OrchestrationFoundation|OrchestrationContracts|OrchestrationModel|FocusAttentionOrchestration|OrchestrationValidation|OrchestrationCertification|OrchestrationPublicIndex)\b/);
});

test("publishes canonical lock, Frozen status, Stable stability, and ReadyForPublicIndex", () => {
  assert.equal(lock, "DRI-3-SCENE-ORCHESTRATION-LOCKED");
  assert.deepEqual(platformLock, {
    lockId: "DRI-3-SCENE-ORCHESTRATION-LOCKED", locked: true, phase: "DRI-3", stage: "Freeze",
  });
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.state, "frozen");
  assert.equal(freeze.stability, "stable");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.frozen, true);
  assert.equal(manifest.lock, lock);
  assert.equal(manifest.status, "Frozen");
  assert.equal(manifest.readiness, "ReadyForPublicIndex");
  assert.equal(manifest.stabilityStatus, "stable");
  assert.equal(manifest.releaseStatus, "released");
  assert.equal(manifest.platformId, "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform");
  assert.equal(Object.isFrozen(platformLock), true);
  assert.equal("timestamp" in platformLock, false);
});

test("preserves runtime API identity without wrappers", () => {
  assert.equal(publishDirectorRuntimeSceneOrchestrationPlatform,
    platformSurface.publishDirectorRuntimeSceneOrchestrationPlatform);
  assert.equal(isDirectorSceneOrchestrationPlatformEligible,
    platformSurface.isDirectorSceneOrchestrationPlatformEligible);
  assert.equal(isPublishedDirectorSceneOrchestrationPlatformResult,
    platformSurface.isPublishedDirectorSceneOrchestrationPlatformResult);
  assert.equal(directorRuntimeSceneOrchestrationPlatform,
    platformSurface.directorRuntimeSceneOrchestrationPlatform);
  assert.equal(freeze.frozenApis.publishDirectorRuntimeSceneOrchestrationPlatform,
    platformSurface.publishDirectorRuntimeSceneOrchestrationPlatform);
  assert.equal(freeze.platform, platformSurface.directorRuntimeSceneOrchestrationPlatform);
  assert.equal(frozenPlatformStatuses, DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES);
  assert.equal(frozenEligibility, DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES);
  assert.equal(frozenCapabilities, DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES);
  assert.equal(frozenPlatformGuarantees, DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES);
  assert.doesNotMatch(source,
    /function\s+(?:frozen|wrap).*publishDirectorRuntimeSceneOrchestrationPlatform/i);
  assert.doesNotMatch(source,
    /const\s+publishDirectorRuntimeSceneOrchestrationPlatform\s*=\s*\(/);
});

test("freezes public API surface, types, and functional APIs with derived counts", () => {
  assert.equal(registry.publicApiCount, publicApiSurface.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.functionalApiCount, functionalApis.length);
  assert.equal(new Set(publicApiSurface.map(({ exportName }) => exportName)).size,
    publicApiSurface.length);
  assert.deepEqual(functionalApis, [
    "publishDirectorRuntimeSceneOrchestrationPlatform",
    "isDirectorSceneOrchestrationPlatformEligible",
    "isPublishedDirectorSceneOrchestrationPlatformResult",
  ]);
  assert.ok(publicTypes.includes("DirectorSceneOrchestrationPlan"));
  assert.ok(publicTypes.includes("DirectorSceneOrchestrationCertificationRecord"));
  assert.ok(publicTypes.includes("DirectorSceneOrchestrationPlatformManifest"));
  assert.deepEqual(publicApiSurface.map(({ exportName }) => exportName),
    manifest.publicApiSurface);
  assert.equal(Object.isFrozen(publicApiSurface), true);
  assert.equal(Object.isFrozen(publicApiSurface[0]), true);
});

test("preserves lineage, operation order, attention policy, and authority vocabularies", () => {
  assert.deepEqual(identityChain, [
    "DRI-3:1/DirectorRuntimeSceneOrchestrationFoundation",
    "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts",
    "DRI-3:3/DirectorRuntimeSceneOrchestrationModel",
    "DRI-3:4/DirectorRuntimeSceneFocusAttentionOrchestration",
    "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation",
    "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification",
    "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
    "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze",
  ]);
  assert.equal(identityChain.length, 8);
  assert.deepEqual(operationOrder, [
    "preserve", "reveal", "conceal", "relate", "focus", "emphasize", "deemphasize", "attention",
  ]);
  assert.equal(operationKinds.length, 8);
  assert.deepEqual(attentionLevels, ["normal", "notice", "important", "critical"]);
  assert.deepEqual(attentionOrder, ["critical", "important", "notice", "normal"]);
  assert.deepEqual(validationStatuses, ["valid", "invalid"]);
  assert.deepEqual(validationSeverities, ["notice", "warning", "error"]);
  assert.deepEqual(certificationStatuses, ["certified", "conditionally-certified", "rejected"]);
  assert.deepEqual(certificationDecisions, ["approve", "approve-with-conditions", "reject"]);
  assert.deepEqual(frozenPlatformStatuses,
    ["published", "published-with-conditions", "rejected"]);
  assert.ok(certificationStatuses.includes("conditionally-certified"));
  assert.ok(frozenPlatformStatuses.includes("published-with-conditions"));
  assert.equal(guarantees.includes("conditions-preserved"), true);
  assert.equal(guarantees.includes("validation-authority-preserved"), true);
  assert.equal(guarantees.includes("certification-authority-preserved"), true);
  assert.equal(guarantees.includes("focus-attention-policy-preserved"), true);
  assert.equal(guarantees.includes("canonical-operation-order-preserved"), true);
});

test("publishes freeze guarantees, compatibility, and consumer Public Index boundary", () => {
  assert.equal(new Set(guarantees).size, guarantees.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.deepEqual(guarantees, freeze.guarantees);
  assert.equal(compatibility.requiredUpstream,
    "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform");
  assert.equal(compatibility.readyForPublicIndex, true);
  assert.equal(compatibility.renderingSupported, false);
  assert.equal(compatibility.nolMutationSupported, false);
  assert.equal(compatibility.compatibilityTargets,
    platformSurface.DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS);
  assert.ok(consumerRules.includes("consume DRI-3 through DRI-3:9 Public Index"));
  assert.equal(releaseInformation.role, "FrozenUpstreamForPublicIndex");
  assert.equal(releaseInformation.publicIndex, false);
  assert.equal(releaseInformation.soleConsumerEntryPoint, false);
  assert.equal(publicIndexReadiness.nextStageId,
    "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex");
  assert.equal(publicIndexReadiness.soleConsumerEntryPoint, false);
});

test("registry counts are dynamic and Freeze metadata is deeply immutable", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts],
    [registry.freezeStateCount, registry.freezeStates],
    [registry.releaseStatusCount, registry.releaseStatuses],
    [registry.stabilityStatusCount, registry.stabilityStatuses],
    [registry.identityChainCount, registry.identityChain],
    [registry.publicApiCount, registry.publicApiSurface],
    [registry.publicTypeCount, registry.publicTypeNames],
    [registry.functionalApiCount, registry.functionalApiNames],
    [registry.guaranteeCount, registry.guarantees],
    [registry.consumerRuleCount, registry.consumerRules],
    [registry.operationKindCount, registry.operationOrder],
    [registry.attentionLevelCount, registry.attentionLevels],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(compatibility), true);
  assert.equal(Object.isFrozen(consumerRules), true);
  assert.equal(Object.isFrozen(releaseInformation), true);
  assert.equal(Object.isFrozen(identityChain), true);
  assert.deepEqual(JSON.parse(JSON.stringify({
    identity: freeze.identity, lock, manifest: {
      freezeId: manifest.freezeId, platformId: manifest.platformId, lock: manifest.lock,
      frozen: manifest.frozen, readiness: manifest.readiness,
    }, guarantees: [...guarantees],
  })), {
    identity: freeze.identity, lock, manifest: {
      freezeId: manifest.freezeId, platformId: manifest.platformId, lock: manifest.lock,
      frozen: manifest.frozen, readiness: manifest.readiness,
    }, guarantees: [...guarantees],
  });
});

test("verification is deterministic and Freeze does not reimplement upstream behavior", () => {
  const one = verifyDirectorRuntimeSceneOrchestrationFreeze();
  const two = verifyDirectorRuntimeSceneOrchestrationFreeze(freeze);
  assert.deepEqual(one, two);
  assert.deepEqual(one, { valid: true, lock: "DRI-3-SCENE-ORCHESTRATION-LOCKED", frozen: true });
  assert.deepEqual(freezeVerification, one);
  assert.equal(freeze.platform, directorRuntimeSceneOrchestrationPlatform);
  const platformBefore = JSON.stringify(platformSurface.directorRuntimeSceneOrchestrationPlatform);
  verifyDirectorRuntimeSceneOrchestrationFreeze();
  assert.equal(JSON.stringify(platformSurface.directorRuntimeSceneOrchestrationPlatform),
    platformBefore);
  assert.doesNotMatch(source, /certifyDirectorRuntimeSceneOrchestration\s*\(/);
  assert.doesNotMatch(source, /validateDirectorRuntimeSceneOrchestration\s*\(/);
  assert.doesNotMatch(source, /function\s+publishDirectorRuntimeSceneOrchestrationPlatform\s*\(/);
  assert.doesNotMatch(source, /from\s+["'][^"']*OrchestrationPublicIndex["']/);
  assert.doesNotMatch(source, /DirectorRuntimeSceneOrchestrationPublicIndex\s*=/);
  assert.match(source, /DRI-3:9\/DirectorRuntimeSceneOrchestrationPublicIndex/);
});

test("contains no renderer, NOL mutation, business, AI, persistence, networking, or events", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|camera|mesh|geometry|material|shader|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:calculateKpi|calculateKoi|rankScenario|approveDecision|openai|anthropic|llm|emit|dispatch)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:scene\.add|node\.focus|node\.hide|ReadyForConsumer|SoleConsumerEntryPoint)\b/);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /DRI-3-SCENE-LOCKED|DRI3-SCENE-ORCHESTRATION-LOCKED|DRI-3-ORCHESTRATION-LOCKED/);
  assert.match(source, /DRI-3-SCENE-ORCHESTRATION-LOCKED/);
});
