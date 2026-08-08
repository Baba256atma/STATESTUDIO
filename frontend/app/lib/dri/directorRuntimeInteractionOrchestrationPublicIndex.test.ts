import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as freezeSurface from "./directorRuntimeInteractionOrchestrationFreeze.ts";
import {
  DRI_4_DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_LOCK as lock,
  certifyDirectorRuntimeInteractionOrchestrationPlatform,
  createDirectorRuntimeFocusSelectionState,
  createDirectorRuntimeInteractionOrchestrationInput,
  createEmptyDirectorRuntimeFocusSelectionState,
  directorRuntimeInteractionOrchestrationApprovedFrozenExports as approvedExports,
  directorRuntimeInteractionOrchestrationCertificationStatus as certificationStatus,
  directorRuntimeInteractionOrchestrationConsumerImportPath as importPath,
  directorRuntimeInteractionOrchestrationConsumerReadiness as readiness,
  directorRuntimeInteractionOrchestrationConsumerRole as consumerRole,
  directorRuntimeInteractionOrchestrationConsumerRules as consumerRules,
  directorRuntimeInteractionOrchestrationFreezeStatus as freezeStatus,
  directorRuntimeInteractionOrchestrationPublicFunctionalApiNames as functionalApis,
  directorRuntimeInteractionOrchestrationPublicIdentityChain as identityChain,
  directorRuntimeInteractionOrchestrationPublicIndex as publicIndex,
  directorRuntimeInteractionOrchestrationPublicIndexIdentity as identity,
  directorRuntimeInteractionOrchestrationPublicIndexNamespace as namespace,
  directorRuntimeInteractionOrchestrationPublicIndexRegistry as registry,
  directorRuntimeInteractionOrchestrationPublicIndexVersion as version,
  directorRuntimeInteractionOrchestrationPublicNamespaceSections as sections,
  directorRuntimeInteractionOrchestrationPublicTypeNames as publicTypes,
  directorRuntimeInteractionOrchestrationReleaseStatus as releaseStatus,
  directorRuntimeInteractionOrchestrationStability as stability,
  isCompletedDirectorRuntimeInteractionOrchestration,
  isDirectorRuntimeInteractionOrchestrationResult,
  isRejectedDirectorRuntimeInteractionOrchestration,
  isStoppedDirectorRuntimeInteractionOrchestration,
  orchestrateDirectorRuntimeInteraction,
  verifyDirectorRuntimeInteractionOrchestrationConsumerEntry,
  verifyDirectorRuntimeInteractionOrchestrationFreeze,
  verifyDirectorRuntimeInteractionOrchestrationPlatform,
  verifyDirectorRuntimeInteractionOrchestrationPublicIndex,
} from "./directorRuntimeInteractionOrchestrationPublicIndex.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionOrchestrationPublicIndex.ts", import.meta.url),
  "utf8",
);

test("1-8. exact Public Index identity, Freeze-only dependency, consumer path/role", () => {
  assert.deepEqual({
    identity,
    namespace,
    version,
    dependency: publicIndex.immediateDependency,
    lock,
    role: consumerRole,
    importPath,
  }, {
    identity: "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
    namespace: "nexora.dri.interaction.orchestration.public-index",
    version: "4.9.0",
    dependency: "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
    lock: "DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED",
    role: "SoleConsumerEntryPoint",
    importPath: "@/app/lib/dri/directorRuntimeInteractionOrchestrationPublicIndex",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionOrchestrationFreeze",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*directorRuntimeInteraction(?:OrchestrationFoundation|Contracts|IntentResolution|ReactionPlanning|Execution|OrchestrationPlatform)|directorRuntimeFocusSelectionOrchestration["']/,
  );
});

test("9-15. Released · Certified · Frozen · Stable · ReadyForConsumer · Compatible · Locked", () => {
  assert.equal(releaseStatus, "Released");
  assert.equal(certificationStatus, "Certified");
  assert.equal(freezeStatus, "Frozen");
  assert.equal(stability, "Stable");
  assert.equal(readiness, "ReadyForConsumer");
  assert.equal(publicIndex.compatibility.status, "compatible");
  assert.equal(lock, freezeSurface.directorRuntimeInteractionOrchestrationLock);
  assert.deepEqual(publicIndex.releaseInformation, {
    release: "Released",
    freeze: "Frozen",
    certification: "Certified",
    stability: "Stable",
    readiness: "ReadyForConsumer",
    lock: "DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED",
    version: "4.9.0",
    namespace: "nexora.dri.interaction.orchestration.public-index",
    platformAuthority: "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
    freezeAuthority: "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
    driStatus:
      "DRI-4 Director Runtime Interaction Orchestration Released · Certified · Frozen · Stable · ReadyForConsumer",
  });
});

test("16-17. namespace-section count and order are exact", () => {
  assert.deepEqual([...sections], [
    "Identity",
    "Public Types",
    "Public APIs",
    "Validation",
    "Certification",
    "Release Information",
    "Compatibility",
    "Registry",
    "Consumer Information",
  ]);
  assert.equal(sections.length, 9);
  assert.equal(registry.namespaceSectionCount, sections.length);
  assert.equal(new Set(sections).size, 9);
  for (const key of [
    "identity",
    "publicTypes",
    "publicApis",
    "validation",
    "certification",
    "releaseInformation",
    "compatibility",
    "registry",
    "consumerInformation",
  ] as const) {
    assert.ok(key in publicIndex);
  }
});

test("18-25. approved surface published exclusively; counts derive from freeze", () => {
  const freezeExports =
    freezeSurface.directorRuntimeInteractionOrchestrationFrozenPublicApiSurface;
  assert.equal(approvedExports, freezeExports);
  assert.deepEqual(approvedExports, freezeExports);
  assert.equal(registry.approvedFrozenExportCount, approvedExports.length);
  assert.equal(registry.approvedFrozenExportCount, freezeExports.length);
  assert.equal(
    new Set(approvedExports.map(({ exportName }) => exportName)).size,
    approvedExports.length,
  );
  assert.deepEqual(publicTypes,
    freezeSurface.directorRuntimeInteractionOrchestrationFrozenPublicTypeNames);
  assert.deepEqual(functionalApis,
    freezeSurface.directorRuntimeInteractionOrchestrationFrozenFunctionalApiNames);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicFunctionalApiCount, functionalApis.length);
  assert.equal(registry.frozenExportCount,
    freezeSurface.directorRuntimeInteractionOrchestrationFrozenExports.length);
  assert.ok(functionalApis.includes("orchestrateDirectorRuntimeInteraction"));
  assert.ok(!functionalApis.includes("continueDirectorRuntimeInteractionOrchestrationAfterIntent"));
  assert.ok(!source.includes("export function orchestrateDirectorRuntimeInteraction"));
});

test("20-21. re-exported functions preserve identity without wrappers", () => {
  assert.equal(
    orchestrateDirectorRuntimeInteraction,
    freezeSurface.orchestrateDirectorRuntimeInteraction,
  );
  assert.equal(
    createDirectorRuntimeInteractionOrchestrationInput,
    freezeSurface.createDirectorRuntimeInteractionOrchestrationInput,
  );
  assert.equal(
    createDirectorRuntimeFocusSelectionState,
    freezeSurface.createDirectorRuntimeFocusSelectionState,
  );
  assert.equal(
    createEmptyDirectorRuntimeFocusSelectionState,
    freezeSurface.createEmptyDirectorRuntimeFocusSelectionState,
  );
  assert.equal(
    verifyDirectorRuntimeInteractionOrchestrationPlatform,
    freezeSurface.verifyDirectorRuntimeInteractionOrchestrationPlatform,
  );
  assert.equal(
    verifyDirectorRuntimeInteractionOrchestrationFreeze,
    freezeSurface.verifyDirectorRuntimeInteractionOrchestrationFreeze,
  );
  assert.equal(
    certifyDirectorRuntimeInteractionOrchestrationPlatform,
    freezeSurface.certifyDirectorRuntimeInteractionOrchestrationPlatform,
  );
  assert.equal(
    isDirectorRuntimeInteractionOrchestrationResult,
    freezeSurface.isDirectorRuntimeInteractionOrchestrationResult,
  );
  assert.equal(
    isCompletedDirectorRuntimeInteractionOrchestration,
    freezeSurface.isCompletedDirectorRuntimeInteractionOrchestration,
  );
  assert.equal(
    isRejectedDirectorRuntimeInteractionOrchestration,
    freezeSurface.isRejectedDirectorRuntimeInteractionOrchestration,
  );
  assert.equal(
    isStoppedDirectorRuntimeInteractionOrchestration,
    freezeSurface.isStoppedDirectorRuntimeInteractionOrchestration,
  );
  assert.doesNotMatch(
    source,
    /const\s+orchestrateDirectorRuntimeInteraction\s*=\s*\(/,
  );
  assert.doesNotMatch(
    source,
    /function\s+(?:frozen|wrap).*orchestrateDirectorRuntimeInteraction/i,
  );
});

test("26-30. consumer rules/info and Public Index metadata are immutable/deterministic", () => {
  assert.equal(Object.isFrozen(consumerRules), true);
  assert.equal(Object.isFrozen(publicIndex.consumerInformation), true);
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.equal(Object.isFrozen(approvedExports), true);
  assert.equal(Object.isFrozen(sections), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.deepEqual(publicIndex, { ...publicIndex });
  assert.ok(consumerRules.includes("public-index-only"));
  assert.ok(consumerRules.includes("no-platform-import"));
  assert.ok(consumerRules.includes("no-freeze-import"));
});

test("31-35. verifiers return true; identity chain is complete and ordered", () => {
  const entry = verifyDirectorRuntimeInteractionOrchestrationConsumerEntry();
  assert.equal(entry.valid, true);
  assert.equal(entry.readyForConsumer, true);
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationPublicIndex(), true);
  assert.deepEqual([...identityChain], [
    "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
    "DRI-4:2/DirectorRuntimeInteractionContracts",
    "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
    "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
    "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
    "DRI-4:6/DirectorRuntimeInteractionExecution",
    "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
    "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
    "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
  ]);
  assert.equal(identityChain.length, 9);
  assert.equal(registry.identityChainCount, 9);
});

test("36-38. Freeze certification/compatibility/lock reused, not redefined", () => {
  assert.equal(
    publicIndex.compatibility.status,
    freezeSurface.directorRuntimeInteractionOrchestrationFreezeCompatibility.status,
  );
  assert.equal(
    publicIndex.compatibility.upstreamIdentity,
    freezeSurface.directorRuntimeInteractionOrchestrationFreezeCompatibility.upstreamIdentity,
  );
  assert.equal(lock, freezeSurface.directorRuntimeInteractionOrchestrationLock);
  assert.equal(
    certifyDirectorRuntimeInteractionOrchestrationPlatform,
    freezeSurface.certifyDirectorRuntimeInteractionOrchestrationPlatform,
  );
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES\s*=\s*Object\.freeze\(\[/);
  assert.doesNotMatch(
    source,
    /DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED"\s*as const/,
  );
});

test("39-52. no new runtime semantics; architectural purity", () => {
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES\s*=/);
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:publish|subscribe|emit|EventEmitter)\s*\(/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|HTMLElement|Object3D|Mesh|Camera|Vector3)\b/,
  );
  assert.doesNotMatch(source, /\b(?:document|window)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:generateSummary|recommend|callLLM|calculateKpi|approveDecision|allocateBudget)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(publicIndex.consumerInformation.soleConsumerEntryPoint, true);
  assert.equal(publicIndex.stage, "PublicIndex");
});
