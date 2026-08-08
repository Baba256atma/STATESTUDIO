import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN as dependencyChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS as domains,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS as checkIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_MANDATORY_CHECK_IDS as mandatoryCheckIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_STATUSES as freezeStatuses,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST as frozenExportManifest,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN as identityChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN as namespaceChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK as lock,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS as lockStatus,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_READINESS_VALUES as releaseReadinessValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN as versionChain,
  certifyDirectorRuntimeExecutiveGuidanceFreeze,
  directorRuntimeExecutiveGuidanceFreeze as freeze,
  directorRuntimeExecutiveGuidanceFreezeApiNames as apiNames,
  directorRuntimeExecutiveGuidanceFreezeCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceFreezeCertificationResult as canonicalResult,
  directorRuntimeExecutiveGuidanceFreezeManifest as manifest,
  directorRuntimeExecutiveGuidanceFreezeRegistry as registry,
  verifyDirectorRuntimeExecutiveGuidanceFreeze,
} from "./directorRuntimeExecutiveGuidanceFreeze.ts";

import { directorRuntimeExecutiveGuidanceAdapterCertificationIdentity } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification";
import { verifyDirectorRuntimeExecutiveGuidanceAdapterCertification } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification";
import { verifyDirectorRuntimeExecutiveGuidancePlatform } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform";
import { verifyDirectorRuntimeExecutiveGuidanceDelivery } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery";
import { verifyDirectorRuntimeExecutiveGuidanceComposition } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition";
import { verifyDirectorRuntimeExecutiveGuidanceResolution } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";
import { verifyDirectorRuntimeExecutiveGuidanceContracts } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceFreeze.ts", import.meta.url),
  "utf8",
);

function checkPassed(
  result: ReturnType<typeof certifyDirectorRuntimeExecutiveGuidanceFreeze>,
  checkId: string,
): boolean {
  return result.checks.find((entry) => entry.checkId === checkId)?.passed ===
    true;
}

test("1. exact DRI-7:8 identity", () => {
  assert.equal(
    freeze.identity,
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  );
  assert.equal(canonicalIdentity.identity, freeze.identity);
  assert.equal(freeze.phase, "DRI-7:8");
  assert.equal(freeze.role, "CertificationFreeze");
});

test("2. exact version 7.8.0", () => {
  assert.equal(freeze.version, "7.8.0");
  assert.equal(canonicalIdentity.version, "7.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    freeze.namespace,
    "nexora.dri.executive-guidance.freeze",
  );
});

test("4. sole immediate dependency is DRI-7:7", () => {
  assert.equal(
    freeze.upstreamDependency,
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
  );
  assert.equal(
    freeze.upstreamDependency,
    directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification",
  ]);
});

test("5. no direct DRI-7:6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidancePlatform["']/,
  );
});

test("6. no direct DRI-7:5 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceDelivery["']/,
  );
});

test("7. no direct DRI-7:4 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceComposition["']/,
  );
});

test("8. no direct DRI-7:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceResolution["']/,
  );
});

test("9. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("10. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("11. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("12. exact lock equals DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED", () => {
  assert.equal(lock, "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED");
  assert.equal(freeze.lock, lock);
  assert.equal(manifest.lock, lock);
});

test("13. Lock status is locked", () => {
  assert.equal(lockStatus, "locked");
  assert.equal(manifest.lockStatus, "locked");
  assert.equal(freeze.lockStatus, "locked");
});

test("14. Freeze-status vocabulary complete", () => {
  assert.deepEqual([...freezeStatuses], ["frozen", "not-frozen"]);
});

test("15. Release-readiness vocabulary complete", () => {
  assert.deepEqual([...releaseReadinessValues], [
    "ready-for-public-index",
    "not-ready-for-public-index",
  ]);
});

test("16. Identity-chain count = 8", () => {
  assert.equal(identityChain.length, 8);
});

test("17. Identity-chain exact order", () => {
  assert.deepEqual([...identityChain], [
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  ]);
});

test("18. Version-chain count = 8", () => {
  assert.equal(versionChain.length, 8);
});

test("19. Version-chain exact order", () => {
  assert.deepEqual([...versionChain], [
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "7.4.0",
    "7.5.0",
    "7.6.0",
    "7.7.0",
    "7.8.0",
  ]);
});

test("20. Namespace-chain count = 8", () => {
  assert.equal(namespaceChain.length, 8);
});

test("21. Namespace-chain exact order", () => {
  assert.deepEqual([...namespaceChain], [
    "nexora.dri.executive-guidance.foundation",
    "nexora.dri.executive-guidance.contracts",
    "nexora.dri.executive-guidance.resolution",
    "nexora.dri.executive-guidance.composition",
    "nexora.dri.executive-guidance.delivery",
    "nexora.dri.executive-guidance.platform",
    "nexora.dri.executive-guidance.adapter-certification",
    "nexora.dri.executive-guidance.freeze",
  ]);
});

test("22. Dependency chain exact", () => {
  assert.deepEqual([...dependencyChain], [
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  ]);
});

test("23. Certification-domain vocabulary complete", () => {
  assert.deepEqual([...domains], [
    "identity-chain",
    "version-chain",
    "namespace-chain",
    "dependency-chain",
    "foundation-integrity",
    "contract-integrity",
    "resolution-integrity",
    "composition-integrity",
    "delivery-integrity",
    "platform-integrity",
    "adapter-certification",
    "semantic-boundary",
    "traceability",
    "determinism",
    "immutability",
    "renderer-independence",
    "advisor-independence",
    "action-independence",
    "side-effect-freedom",
    "consumer-readiness",
    "release-readiness",
  ]);
});

test("24. Certification check IDs unique", () => {
  assert.equal(new Set(checkIds).size, checkIds.length);
});

test("25. Mandatory checks complete", () => {
  assert.deepEqual([...mandatoryCheckIds], [...checkIds]);
  assert.equal(mandatoryCheckIds.length, 21);
});

test("26. Foundation integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.foundation-integrity"));
});

test("27. Contracts integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.contract-integrity"));
});

test("28. Resolution integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.resolution-integrity"));
});

test("29. Composition integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.composition-integrity"));
});

test("30. Delivery integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.delivery-integrity"));
});

test("31. Platform integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.platform-integrity"));
});

test("32. Adapter certification integrity certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.adapter-certification"));
});

test("33. Semantic boundary certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.semantic-boundary"));
});

test("34. Traceability certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.traceability"));
});

test("35. Determinism certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.determinism"));
});

test("36. Immutability certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.immutability"));
});

test("37. Renderer independence certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.renderer-independence"));
});

test("38. Three.js independence certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.renderer-independence"));
  assert.doesNotMatch(source, /from\s+["']three["']/);
});

test("39. React independence certified", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
});

test("40. DOM/browser independence certified", () => {
  assert.doesNotMatch(source, /\bdocument\b|\bwindow\b|\bHTMLElement\b/);
});

test("41. Advisor independence certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.advisor-independence"));
});

test("42. Action independence certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.action-independence"));
});

test("43. Side-effect freedom certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.side-effect-freedom"));
});

test("44. Consumer readiness certified", () => {
  assert.ok(checkPassed(canonicalResult, "dri7.freeze.consumer-readiness"));
});

test("45. Canonical certification status = certified", () => {
  assert.equal(manifest.certificationStatus, "certified");
  assert.equal(canonicalResult.certificationStatus, "certified");
});

test("46. Canonical compatibility = compatible", () => {
  assert.equal(manifest.compatibilityStatus, "compatible");
});

test("47. Canonical freeze status = frozen", () => {
  assert.equal(manifest.freezeStatus, "frozen");
});

test("48. Canonical release readiness = ready-for-public-index", () => {
  assert.equal(manifest.releaseReadiness, "ready-for-public-index");
  assert.equal(manifest.readinessLabel, "ReadyForPublicIndex");
});

test("49. Passed/failed check counts reconcile", () => {
  assert.equal(
    canonicalResult.passedCheckCount + canonicalResult.failedCheckCount,
    canonicalResult.checks.length,
  );
});

test("50. Canonical failed check count = 0", () => {
  assert.equal(canonicalResult.failedCheckCount, 0);
  assert.equal(canonicalResult.passedCheckCount, 21);
});

test("51. Manifest identity consistent", () => {
  assert.equal(manifest.identity, freeze.identity);
});

test("52. Manifest version consistent", () => {
  assert.equal(manifest.version, "7.8.0");
});

test("53. Manifest namespace consistent", () => {
  assert.equal(manifest.namespace, freeze.namespace);
});

test("54. Manifest lock consistent", () => {
  assert.equal(manifest.lock, "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED");
});

test("55. Manifest chain data consistent", () => {
  assert.deepEqual([...manifest.identityChain], [...identityChain]);
  assert.deepEqual([...manifest.versionChain], [...versionChain]);
  assert.deepEqual([...manifest.namespaceChain], [...namespaceChain]);
});

test("56. Registry deterministic", () => {
  assert.equal(registry.identity, freeze.identity);
  assert.equal(registry.checkCount, 21);
  assert.equal(registry.identityChainCount, 8);
  assert.equal(registry.lock, lock);
});

test("57. Registry immutable", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(registry.checkIds));
});

test("58. Manifest immutable", () => {
  assert.ok(Object.isFrozen(manifest));
});

test("59. Check array immutable", () => {
  assert.ok(Object.isFrozen(manifest.checks));
  assert.ok(Object.isFrozen(canonicalResult.checks));
});

test("60. Identity-chain immutable", () => {
  assert.ok(Object.isFrozen(identityChain));
});

test("61. Version-chain immutable", () => {
  assert.ok(Object.isFrozen(versionChain));
});

test("62. Namespace-chain immutable", () => {
  assert.ok(Object.isFrozen(namespaceChain));
});

test("63. Frozen export manifest deterministic", () => {
  assert.equal(frozenExportManifest.length, 3);
  assert.equal(frozenExportManifest[0]?.stage, "DRI-7:7/AdapterCertification");
  assert.equal(frozenExportManifest[1]?.stage, "DRI-7:8/Freeze");
  assert.ok(Object.isFrozen(frozenExportManifest));
});

test("64. Frozen export manifest excludes private helpers", () => {
  const freezeExports = frozenExportManifest[1]?.exportNames ?? [];
  assert.ok(!freezeExports.includes("evaluateFreezeChecks"));
  assert.ok(!freezeExports.includes("freezeCheck"));
  assert.ok(!freezeExports.includes("arraysEqual"));
  assert.ok(
    freezeExports.includes("certifyDirectorRuntimeExecutiveGuidanceFreeze"),
  );
});

test("65. No new runtime guidance behavior", () => {
  assert.doesNotMatch(
    source,
    /runDirectorExecutiveGuidancePlatform\s*\(|deliverDirectorExecutiveGuidance\s*\(|composeDirectorExecutiveGuidance\s*\(|resolveDirectorExecutiveGuidance\s*\(/,
  );
  assert.equal(freeze.certifiesAndFreezesOnly, true);
});

test("66. No adapter implementation", () => {
  assert.doesNotMatch(
    source,
    /adaptPlatformToScene|adaptPlatformToReact|renderGuidance\s*\(/,
  );
  assert.equal(freeze.noConcreteAdapters, true);
});

test("67. No dispatch", () => {
  assert.doesNotMatch(
    source,
    /dispatchToAdapter|sendToScene|sendToAdvisor|publishToConsumer/,
  );
});

test("68. No event bus", () => {
  assert.doesNotMatch(source, /\bEventEmitter\b|\beventBus\b|\bsubscribe\b|\bpublish\b/);
});

test("69. No network IO", () => {
  assert.doesNotMatch(source, /\bfetch\b|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test("70. No storage IO", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|\bfs\./);
});

test("71. No timers", () => {
  assert.doesNotMatch(source, /\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b/);
});

test("72. No randomness", () => {
  assert.doesNotMatch(source, /Math\.random|crypto\.randomUUID/);
});

test("73. No internally generated timestamps", () => {
  assert.doesNotMatch(source, /Date\.now\(|new Date\(|performance\.now/);
});

test("74. No renderer integration", () => {
  assert.doesNotMatch(source, /SceneRenderer|AnimatableObject|@react-three/);
});

test("75. No Advisor/LLM integration", () => {
  assert.doesNotMatch(source, /\bLLM\b|systemPrompt|openai|tokenCount|chatCompletion/);
});

test("76. No business action execution", () => {
  assert.doesNotMatch(
    source,
    /\bapprove\(|\breject\(|\bexecute\(|\bpause\(|\bresume\(|\bcancel\(/,
  );
});

test("77. No Public Index created in this step", () => {
  // DRI-7:8 freezes only; Public Index is a later stage (DRI-7:9).
  assert.equal(freeze.noPublicIndex, true);
  assert.doesNotMatch(
    source,
    /directorRuntimeExecutiveGuidancePublicIndex/,
  );
  assert.doesNotMatch(source, /\bSoleConsumerEntryPoint\b/);
  assert.doesNotMatch(source, /"ready-for-consumer"/);
});

test("78. Failure of mandatory check prevents freeze", () => {
  const failed = certifyDirectorRuntimeExecutiveGuidanceFreeze({
    forceFailedCheckId: "dri7.freeze.adapter-certification",
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.equal(failed.certificationStatus, "not-certified");
});

test("79. Failure of mandatory check prevents release readiness", () => {
  const failed = certifyDirectorRuntimeExecutiveGuidanceFreeze({
    forceFailedCheckId: "dri7.freeze.release-readiness",
  });
  assert.equal(failed.releaseReadiness, "not-ready-for-public-index");
  assert.equal(failed.lockStatus, "unlocked");
});

test("80. All mandatory checks produce frozen state", () => {
  const result = certifyDirectorRuntimeExecutiveGuidanceFreeze();
  assert.equal(result.freezeStatus, "frozen");
  assert.equal(result.lockStatus, "locked");
  assert.equal(result.failedCheckCount, 0);
});

test("81. Verification passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "7.8.0");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.lock, "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED");
});

test("82. DRI-7:7 regression passes", () => {
  assert.equal(
    verifyDirectorRuntimeExecutiveGuidanceAdapterCertification().ok,
    true,
  );
});

test("83. DRI-7:6 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePlatform().ok, true);
});

test("84. DRI-7:5 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceDelivery().ok, true);
});

test("85. DRI-7:4 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceComposition().ok, true);
});

test("86. DRI-7:3 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceResolution().ok, true);
});

test("87. DRI-7:2 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceContracts().ok, true);
});

test("88. DRI-7:1 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceFoundation().ok, true);
});

test("89. DRI-6 regression remains clean", () => {
  assert.equal(verifyDirectorRuntimeAttentionFocusPublicIndex().ok, true);
});

test("90. Focused DRI-7:8 suite surface sanity", () => {
  assert.ok(
    apiNames.includes("certifyDirectorRuntimeExecutiveGuidanceFreeze"),
  );
  assert.ok(
    publicTypeNames.includes("DirectorRuntimeExecutiveGuidanceFreezeManifest"),
  );
  assert.equal(registry.frozenExportManifestCount, 3);
});
