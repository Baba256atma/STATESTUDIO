import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS as approvedExports,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES as checkStatuses,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES as scopes,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES as certificationStatuses,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES as compatibilityEntries,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES as compatibilityStatuses,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES as eligibilityValues,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_MANIFEST as freezeManifest,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUSES as freezeStatuses,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_GUARANTEE_EVIDENCE_MAP as guaranteeEvidenceMap,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK as lock,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE as lockValue,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS as characteristics,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_REQUIREMENTS as requirements,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUSES as readinessStatuses,
  areDirectorRuntimeAttentionFocusCertificationRecordsEquivalent,
  areDirectorRuntimeAttentionFocusFreezeManifestsEquivalent,
  certifyAndFreezeDirectorRuntimeAttentionFocusPlatform,
  certifyDirectorRuntimeAttentionFocusPlatform,
  directorRuntimeAttentionFocusCertificationFreeze as layer,
  directorRuntimeAttentionFocusCertificationFreezeCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionFocusCertificationFreezePolicy as policy,
  directorRuntimeAttentionFocusCertificationFreezeRegistry as registry,
  freezeDirectorRuntimeAttentionFocusPlatform,
  validateDirectorRuntimeAttentionFocusCertificationRecord,
  validateDirectorRuntimeAttentionFocusFreezeManifest,
  verifyDirectorRuntimeAttentionFocusCertificationFreeze,
} from "./directorRuntimeAttentionFocusCertificationFreeze.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionFocusCertificationFreeze.ts", import.meta.url),
  "utf8",
);

test("1. exact identity", () => {
  assert.equal(
    layer.identity,
    "DRI-6:8/DirectorRuntimeAttentionFocusCertificationFreeze",
  );
  assert.equal(layer.role, "CertificationFreeze");
  assert.equal(layer.status, "CertifiedFrozen");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.8.0");
  assert.equal(canonicalIdentity.version, "6.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    layer.namespace,
    "nexora.dri.attention-focus.certification-freeze",
  );
});

test("4. sole immediate dependency = DRI-6:7", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionFocusPlatform"],
  );
  assert.equal(source.includes("directorRuntimeAttentionTransitionOrchestration"), false);
  assert.equal(source.includes("directorRuntimeAttentionPathOrchestration"), false);
  assert.equal(source.includes("directorRuntimeFocusContextBinding"), false);
  assert.equal(source.includes("directorRuntimeAttentionPriorityResolution"), false);
});

test("5. canonical certification statuses", () => {
  assert.deepEqual([...certificationStatuses], [
    "certified", "conditionally-certified", "rejected",
  ]);
  assert.equal(registry.certificationStatusCount, 3);
});

test("6. canonical eligibility values", () => {
  assert.deepEqual([...eligibilityValues], [
    "eligible", "conditionally-eligible", "ineligible",
  ]);
  assert.equal(registry.eligibilityCount, 3);
});

test("7. canonical freeze statuses", () => {
  assert.deepEqual([...freezeStatuses], ["frozen", "not-frozen", "rejected"]);
  assert.equal(registry.freezeStatusCount, 3);
});

test("8. canonical certification scopes", () => {
  assert.deepEqual([...scopes], [
    "identity",
    "dependency",
    "pipeline",
    "contracts",
    "determinism",
    "immutability",
    "traceability",
    "compatibility",
    "architectural-boundary",
    "consumer-guarantees",
  ]);
  assert.equal(registry.certificationScopeCount, 10);
});

test("9. canonical check statuses", () => {
  assert.deepEqual([...checkStatuses], ["pass", "conditional", "fail"]);
  assert.equal(registry.checkStatusCount, 3);
});

test("10. canonical compatibility statuses", () => {
  assert.deepEqual([...compatibilityStatuses], [
    "compatible", "conditionally-compatible", "incompatible",
  ]);
  assert.deepEqual([...readinessStatuses], [
    "ready-for-public-index",
    "conditionally-ready-for-public-index",
    "not-ready-for-public-index",
  ]);
});

test("11. platform characteristics registry", () => {
  assert.equal(characteristics.length, 12);
  assert.ok(characteristics.includes("Deterministic"));
  assert.ok(characteristics.includes("Synchronous"));
  assert.equal(registry.characteristicCount, 12);
});

test("12. platform guarantees registry", () => {
  assert.equal(guarantees.length, 16);
  assert.ok(guarantees.includes("CanonicalIdentity"));
  assert.ok(guarantees.includes("PriorityPolicyAuthorityPreserved"));
  assert.equal(registry.guaranteeCount, 16);
});

test("13. platform requirements registry", () => {
  assert.equal(requirements.length, 12);
  assert.ok(requirements.includes("PlatformVerificationPasses"));
  assert.equal(registry.requirementCount, 12);
});

test("14. compatibility registry", () => {
  assert.equal(compatibilityEntries.length, 5);
  assert.equal(registry.compatibilityCount, 5);
  assert.ok(
    compatibilityEntries.every((entry) => entry.status === "compatible"),
  );
});

test("15. exact freeze lock", () => {
  assert.equal(lockValue, "DRI-6-DIRECTOR-RUNTIME-ATTENTION-FOCUS-LOCKED");
  assert.equal(lock.lock, lockValue);
  assert.equal(lock.locked, true);
});

test("16. approved frozen export registry", () => {
  assert.ok(approvedExports.includes("runDirectorRuntimeAttentionFocusPlatform"));
  assert.ok(approvedExports.includes("verifyDirectorRuntimeAttentionFocusPlatform"));
  assert.equal(registry.approvedFrozenExportCount, approvedExports.length);
  assert.equal(new Set(approvedExports).size, approvedExports.length);
});

test("17. registry dynamic counts", () => {
  assert.equal(registry.certificationStatusCount, certificationStatuses.length);
  assert.equal(registry.eligibilityCount, eligibilityValues.length);
  assert.equal(registry.freezeStatusCount, freezeStatuses.length);
  assert.equal(registry.certificationScopeCount, scopes.length);
  assert.equal(registry.characteristicCount, characteristics.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.compatibilityCount, compatibilityEntries.length);
});

test("18. registry immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Object.isFrozen(lock), true);
  assert.equal(Object.isFrozen(approvedExports), true);
});

test("19. exact upstream DRI-6:7 identity certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(
    result.certification.platformIdentity,
    "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
  );
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "identity/exact-platform-identity" &&
      entry.status === "pass"),
  );
});

test("20. upstream dependency certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "dependency/sole-immediate-dependency" &&
      entry.status === "pass"),
  );
});

test("21. pipeline-order certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "pipeline/exact-pipeline-order" &&
      entry.status === "pass"),
  );
});

test("22. determinism certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "determinism/repeated-platform-verification" &&
      entry.status === "pass"),
  );
});

test("23. immutability certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "immutability/platform-surface-immutable" &&
      entry.status === "pass"),
  );
});

test("24. traceability certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "traceability/signal-trace-support" &&
      entry.status === "pass"),
  );
});

test("25. primary-consistency certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "contracts/primary-consistency-support" &&
      entry.status === "pass"),
  );
});

test("26. suppression-consistency certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "contracts/suppression-consistency-support" &&
      entry.status === "pass"),
  );
});

test("27. transition semantic-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/transition-semantic-boundary" &&
      entry.status === "pass"),
  );
});

test("28. presentation-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/presentation-boundary" &&
      entry.status === "pass"),
  );
});

test("29. scene-mutation-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/scene-mutation-boundary" &&
      entry.status === "pass"),
  );
});

test("30. business-reasoning-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/business-reasoning-boundary" &&
      entry.status === "pass"),
  );
});

test("31. Advisor-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/advisor-boundary" &&
      entry.status === "pass"),
  );
});

test("32. persistence-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/persistence-boundary" &&
      entry.status === "pass"),
  );
});

test("33. event-system-boundary certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/event-system-boundary" &&
      entry.status === "pass"),
  );
});

test("34. synchronous characteristic certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/synchronous-characteristic" &&
      entry.status === "pass"),
  );
  assert.ok(characteristics.includes("Synchronous"));
});

test("35. complete required evidence", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(result.certification.evidence.length >= 10);
  assert.ok(
    scopes.every((scope) =>
      result.certification.evidence.some((entry) => entry.scope === scope)),
  );
});

test("36. deterministic evidence ordering", () => {
  const first = certifyDirectorRuntimeAttentionFocusPlatform();
  const second = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.deepEqual(
    first.certification.evidence.map((entry) => entry.checkId),
    second.certification.evidence.map((entry) => entry.checkId),
  );
  const scopeOrder = first.certification.evidence.map((entry) => entry.scope);
  let lastIndex = -1;
  for (const scope of scopeOrder) {
    const index = scopes.indexOf(scope);
    assert.ok(index >= lastIndex);
    lastIndex = index;
  }
});

test("37. guarantee-to-evidence mapping completeness", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  const evidenceIds = result.certification.evidence.map((entry) => entry.checkId);
  for (const guarantee of guarantees) {
    const mapped = guaranteeEvidenceMap[guarantee];
    assert.ok(mapped.length > 0);
    for (const checkId of mapped) {
      assert.ok(evidenceIds.includes(checkId), `${guarantee} -> ${checkId}`);
      const entry = result.certification.evidence.find((item) =>
        item.checkId === checkId);
      assert.equal(entry?.status, "pass");
    }
  }
});

test("38. successful canonical certification", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(result.ok, true);
  assert.equal(result.certification.status, "certified");
  assert.equal(result.certification.failedRequiredCount, 0);
});

test("39. successful freeze eligibility", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(result.certification.eligibility, "eligible");
});

test("40. successful frozen manifest", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.ok(result.manifest);
  assert.equal(result.manifest?.freezeStatus, "frozen");
  assert.equal(result.manifest?.lock, lockValue);
  assert.deepEqual(result.manifest, freezeManifest);
});

test("41. successful ReadyForPublicIndex result", () => {
  const result = certifyAndFreezeDirectorRuntimeAttentionFocusPlatform();
  assert.equal(result.readiness, "ready-for-public-index");
  assert.equal(layer.readiness, "ready-for-public-index");
});

test("42. rejected certification cannot freeze", () => {
  const rejected = certifyDirectorRuntimeAttentionFocusPlatform({
    platformIdentity: "WRONG",
  });
  assert.equal(rejected.certification.status, "rejected");
  const freeze = freezeDirectorRuntimeAttentionFocusPlatform(rejected.certification);
  assert.equal(freeze.ok, false);
  assert.equal(freeze.manifest, null);
  assert.equal(freeze.freezeStatus, "rejected");
});

test("43. rejected certification returns no approved manifest", () => {
  const rejected = certifyDirectorRuntimeAttentionFocusPlatform({
    platformIdentity: "WRONG",
  });
  assert.equal(rejected.manifest, null);
  assert.equal(rejected.readiness, "not-ready-for-public-index");
});

test("44. identity mismatch rejection", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform({
    platformIdentity: "DRI-6:7/Wrong",
  });
  assert.equal(result.certification.status, "rejected");
  assert.equal(result.certification.eligibility, "ineligible");
});

test("45. pipeline mismatch rejection", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform({
    pipelineOrder: ["complete", "signal-validation"],
  });
  assert.equal(result.certification.status, "rejected");
});

test("46. determinism failure rejection", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform({
    forceDeterminismFailure: true,
  });
  assert.equal(result.certification.status, "rejected");
});

test("47. presentation leakage rejection", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform({
    includesPresentation: true,
    moduleSource: 'const color = "red"; const camera = {};',
  });
  assert.equal(result.certification.status, "rejected");
  assert.ok(
    result.certification.evidence.some((entry) =>
      entry.checkId === "architectural-boundary/presentation-boundary" &&
      entry.status === "fail"),
  );
});

test("48. semantic-authority violation rejection", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform({
    introducesNewSemantics: true,
    performsPriorityResolution: true,
  });
  assert.equal(result.certification.status, "rejected");
});

test("49. conditional certification policy if supported", () => {
  assert.equal(policy.conditionalFreezeAllowed, true);
});

test("50. conditions remain visible and ordered", () => {
  const success = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.deepEqual(success.certification.conditions, []);
  assert.equal(Object.isFrozen(success.certification.conditions), true);
});

test("51. compatibility validation", () => {
  for (const entry of compatibilityEntries) {
    assert.ok(
      (compatibilityStatuses as readonly string[]).includes(entry.status),
    );
  }
});

test("52. freeze-manifest validation", () => {
  assert.equal(
    validateDirectorRuntimeAttentionFocusFreezeManifest(freezeManifest).ok,
    true,
  );
  assert.equal(
    validateDirectorRuntimeAttentionFocusFreezeManifest({
      ...freezeManifest!,
      certificationStatus: "rejected",
    }).ok,
    false,
  );
});

test("53. lock-manifest consistency", () => {
  assert.equal(freezeManifest?.lock, lockValue);
  assert.equal(layer.lock.lock, freezeManifest?.lock);
});

test("54. certification/manifest consistency", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(
    result.manifest?.certificationStatus,
    result.certification.status,
  );
  assert.equal(result.manifest?.eligibility, result.certification.eligibility);
  assert.equal(result.manifest?.identity, result.certification.platformIdentity);
  assert.equal(result.manifest?.version, result.certification.platformVersion);
});

test("55. approved-export integrity", () => {
  assert.ok(
    freezeManifest?.approvedExports.every((name) =>
      (approvedExports as readonly string[]).includes(name)),
  );
});

test("56. JSON-compatible certification record", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  const serialized = JSON.stringify(result.certification);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.status, "certified");
  assert.ok(Array.isArray(parsed.evidence));
});

test("57. JSON-compatible freeze manifest", () => {
  const serialized = JSON.stringify(freezeManifest);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.lock, lockValue);
  assert.ok(Array.isArray(parsed.approvedExports));
});

test("58. certification immutability", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.certification), true);
  assert.equal(Object.isFrozen(result.certification.evidence), true);
  assert.throws(() => {
    (result.certification as { status: string }).status = "rejected";
  });
});

test("59. manifest immutability", () => {
  assert.equal(Object.isFrozen(freezeManifest), true);
  assert.equal(Object.isFrozen(freezeManifest!.approvedExports), true);
  assert.throws(() => {
    (freezeManifest as { lock: string }).lock = "CHANGED";
  });
});

test("60. deterministic repeated certification", () => {
  const first = certifyDirectorRuntimeAttentionFocusPlatform();
  const second = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(
    areDirectorRuntimeAttentionFocusCertificationRecordsEquivalent(
      first.certification,
      second.certification,
    ),
    true,
  );
});

test("61. deterministic repeated freeze", () => {
  const first = certifyAndFreezeDirectorRuntimeAttentionFocusPlatform();
  const second = certifyAndFreezeDirectorRuntimeAttentionFocusPlatform();
  assert.equal(
    areDirectorRuntimeAttentionFocusFreezeManifestsEquivalent(
      first.manifest,
      second.manifest,
    ),
    true,
  );
});

test("62. no priority-resolution behavior", () => {
  assert.equal(policy.performsPriorityResolution, false);
  assert.ok(absentCapabilities.includes("PriorityResolution"));
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeAttentionPriority\s*\(/m,
  );
  assert.equal(source.includes("DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE"), false);
});

test("63. no focus-binding behavior", () => {
  assert.equal(policy.rebindsFocusContext, false);
  assert.ok(absentCapabilities.includes("FocusContextBinding"));
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+bindDirectorRuntimeFocusContext\s*\(/m,
  );
  assert.equal(
    source.includes("DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE"),
    false,
  );
});

test("64. no path-orchestration behavior", () => {
  assert.equal(policy.discoversPaths, false);
  assert.ok(absentCapabilities.includes("PathOrchestration"));
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+orchestrateDirectorRuntimeAttentionPaths\s*\(/m,
  );
  assert.equal(source.includes("collectDirectedPaths"), false);
  assert.equal(source.includes("buildEdges"), false);
});

test("65. no transition-orchestration behavior", () => {
  assert.equal(policy.redefinesTransitions, false);
  assert.ok(absentCapabilities.includes("TransitionOrchestration"));
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+classifySubjectTransition\s*\(/m,
  );
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+orchestrateDirectorRuntimeAttentionTransition\s*\(/m,
  );
});

test("66. no presentation behavior", () => {
  assert.equal(policy.includesPresentation, false);
  assert.ok(absentCapabilities.includes("Rendering"));
  assert.ok(absentCapabilities.includes("Animation"));
});

test("67. no scene mutation", () => {
  assert.equal(policy.mutatesScene, false);
  assert.ok(absentCapabilities.includes("SceneMutation"));
  assert.equal(source.includes("hideNode"), false);
  assert.equal(source.includes("selectMesh"), false);
  assert.equal(source.includes("setCameraTarget"), false);
  assert.equal(source.includes("mutateScene"), false);
});

test("68. no persistence/network behavior", () => {
  assert.equal(policy.persistsState, false);
  assert.equal(policy.usesNetworking, false);
  assert.equal(source.includes("localStorage"), false);
  assert.equal(source.includes("sessionStorage"), false);
  assert.equal(source.includes("fetch("), false);
  assert.equal(source.includes("WebSocket"), false);
});

test("69. DRI-6:8 static verification success", () => {
  const verification = verifyDirectorRuntimeAttentionFocusCertificationFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.readiness, "ready-for-public-index");
  assert.equal(verification.lock, lockValue);
});

test("70. deterministic repeated static verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionFocusCertificationFreeze(),
    verifyDirectorRuntimeAttentionFocusCertificationFreeze(),
  );
});

test("71. capability registry", () => {
  assert.ok(capabilities.includes("PlatformCertification"));
  assert.ok(capabilities.includes("FreezeManifestGeneration"));
  assert.deepEqual([...absentCapabilities], [
    "PriorityResolution",
    "FocusContextBinding",
    "PathOrchestration",
    "TransitionOrchestration",
    "Rendering",
    "Animation",
    "SceneMutation",
    "BusinessReasoning",
  ]);
});

test("72. certification record validation", () => {
  const result = certifyDirectorRuntimeAttentionFocusPlatform();
  assert.equal(
    validateDirectorRuntimeAttentionFocusCertificationRecord(
      result.certification,
    ).ok,
    true,
  );
});
