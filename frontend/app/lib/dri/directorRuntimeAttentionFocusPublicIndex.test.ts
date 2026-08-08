import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as freezeSurface from "./directorRuntimeAttentionFocusCertificationFreeze.ts";
import * as publicModule from "./directorRuntimeAttentionFocusPublicIndex.ts";
import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CONSUMER_GUARANTEES as consumerGuarantees,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_CONSUMER_RULES as consumerRules,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_IDENTITY_CHAIN as identityChain,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_NAMESPACE_CHAIN as namespaceChain,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_NAMESPACE_SECTIONS as sections,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_NAMESPACE_STAGES as namespaceStages,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PROHIBITED_CONSUMER_IMPORTS as prohibitedImports,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_APPROVED_FROZEN_EXPORTS as approvedExports,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_EXPORT_NAMES as publicExports,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_INDEX_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_TYPE_NAMES as publicTypes,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PUBLIC_VALIDATION_API_NAMES as validationApis,
  DRI_6_DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK as lockValue,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionSignal,
  directorRuntimeAttentionFocusConsumerImportPath as consumerPath,
  directorRuntimeAttentionFocusConsumerInformation as consumerInfo,
  directorRuntimeAttentionFocusConsumerRole as consumerRole,
  directorRuntimeAttentionFocusPublicCertification as certification,
  directorRuntimeAttentionFocusPublicCompatibility as compatibility,
  directorRuntimeAttentionFocusPublicIndex as publicIndex,
  directorRuntimeAttentionFocusPublicIndexIdentity as identity,
  directorRuntimeAttentionFocusPublicIndexNamespace as namespace,
  directorRuntimeAttentionFocusPublicIndexRegistry as registry,
  directorRuntimeAttentionFocusPublicIndexVersion as version,
  directorRuntimeAttentionFocusPublicLock as lock,
  directorRuntimeAttentionFocusReleaseInformation as releaseInfo,
  directorRuntimeAttentionFocusReleaseStatus as releaseStatus,
  directorRuntimeAttentionFocusStability as stability,
  directorRuntimeAttentionFocusConsumerReadiness as readiness,
  orchestrateDirectorRuntimeAttentionPaths,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPriority,
  runDirectorRuntimeAttentionFocusPlatform,
  validateDirectorRuntimeAttentionFocusPlatformInput,
  verifyDirectorRuntimeAttentionFocusConsumerEntry,
  verifyDirectorRuntimeAttentionFocusPlatform,
  verifyDirectorRuntimeAttentionFocusPublicIndex,
} from "./directorRuntimeAttentionFocusPublicIndex.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionFocusPublicIndex.ts", import.meta.url),
  "utf8",
);

test("1. exact identity", () => {
  assert.equal(identity, "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex");
  assert.equal(publicIndex.identity, identity);
  assert.equal(publicIndex.role, "PublicIndex");
});

test("2. exact version", () => {
  assert.equal(version, "6.9.0");
  assert.equal(publicIndex.version, "6.9.0");
});

test("3. exact namespace", () => {
  assert.equal(namespace, "nexora.dri.attention-focus.public-index");
});

test("4. sole immediate dependency = DRI-6:8", () => {
  assert.equal(
    publicIndex.immediateDependency,
    "DRI-6:8/DirectorRuntimeAttentionFocusCertificationFreeze",
  );
  assert.equal(registry.dependency, publicIndex.immediateDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionFocusCertificationFreeze"],
  );
  const importBlock = imports.join("\n");
  assert.doesNotMatch(importBlock, /Foundation|SignalContracts|PriorityResolution/);
  assert.doesNotMatch(importBlock, /FocusContextBinding|PathOrchestration/);
  assert.doesNotMatch(importBlock, /TransitionOrchestration|FocusPlatform["']/);
});

test("5. exact supported consumer import path", () => {
  assert.equal(
    consumerPath,
    "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex",
  );
  assert.equal(consumerInfo.supportedImportPath, consumerPath);
  assert.equal(publicIndex.supportedImportPath, consumerPath);
});

test("6. exact consumer role", () => {
  assert.equal(consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumerInfo.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumerInfo.soleConsumerEntryPoint, true);
});

test("7. release status = Released", () => {
  assert.equal(releaseStatus, "Released");
  assert.equal(releaseInfo.releaseStatus, "Released");
});

test("8. stability = Stable", () => {
  assert.equal(stability, "Stable");
  assert.equal(releaseInfo.stability, "Stable");
});

test("9. readiness = ReadyForConsumer", () => {
  assert.equal(readiness, "ReadyForConsumer");
  assert.equal(consumerInfo.readiness, "ReadyForConsumer");
});

test("10. upstream certification = Certified", () => {
  assert.equal(
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUS,
    "certified",
  );
  assert.equal(certification.certificationStatus, "certified");
  assert.equal(publicIndex.certificationStatus, "certified");
});

test("11. upstream freeze status = Frozen", () => {
  assert.equal(
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUS,
    "frozen",
  );
  assert.equal(certification.freezeStatus, "frozen");
  assert.equal(publicIndex.freezeStatus, "frozen");
});

test("12. exact freeze lock", () => {
  assert.equal(lockValue, "DRI-6-DIRECTOR-RUNTIME-ATTENTION-FOCUS-LOCKED");
  assert.equal(lock.lock, lockValue);
  assert.equal(lock.locked, true);
  assert.equal(lock, freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK);
});

test("13. identity-chain count = 9", () => {
  assert.equal(identityChain.length, 9);
  assert.equal(registry.identityChainCount, 9);
});

test("14. exact identity-chain order", () => {
  assert.deepEqual([...identityChain], [
    "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
    "DRI-6:2/DirectorRuntimeAttentionSignalContracts",
    "DRI-6:3/DirectorRuntimeAttentionPriorityResolution",
    "DRI-6:4/DirectorRuntimeFocusContextBinding",
    "DRI-6:5/DirectorRuntimeAttentionPathOrchestration",
    "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration",
    "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
    "DRI-6:8/DirectorRuntimeAttentionFocusCertificationFreeze",
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  ]);
});

test("15. namespace-chain count = 9", () => {
  assert.equal(namespaceChain.length, 9);
  assert.equal(registry.namespaceChainCount, 9);
});

test("16. exact namespace-chain order", () => {
  assert.deepEqual([...namespaceStages], [
    "foundation",
    "signal-contracts",
    "priority-resolution",
    "context-binding",
    "path-orchestration",
    "transition-orchestration",
    "platform",
    "certification-freeze",
    "public-index",
  ]);
  assert.deepEqual(
    namespaceChain.map((entry) => entry.namespace),
    [
      "nexora.dri.attention-focus.foundation",
      "nexora.dri.attention-focus.signal-contracts",
      "nexora.dri.attention-focus.priority-resolution",
      "nexora.dri.attention-focus.context-binding",
      "nexora.dri.attention-focus.path-orchestration",
      "nexora.dri.attention-focus.transition-orchestration",
      "nexora.dri.attention-focus.platform",
      "nexora.dri.attention-focus.certification-freeze",
      "nexora.dri.attention-focus.public-index",
    ],
  );
});

test("17. namespace-section count", () => {
  assert.equal(sections.length, 9);
  assert.equal(registry.namespaceSectionCount, 9);
});

test("18. exact namespace-section order", () => {
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
});

test("19. approved export registry exists", () => {
  assert.ok(approvedExports.length > 0);
  assert.equal(
    approvedExports,
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS,
  );
});

test("20. public type registry exists", () => {
  assert.ok(publicTypes.length > 0);
  assert.ok(publicTypes.includes("DirectorRuntimeAttentionFocusPlatformResult"));
});

test("21. public functional API registry exists", () => {
  assert.ok(publicApis.includes("runDirectorRuntimeAttentionFocusPlatform"));
  assert.ok(publicApis.includes("resolveDirectorRuntimeAttentionPriority"));
});

test("22. validation API registry exists", () => {
  assert.ok(
    validationApis.includes("validateDirectorRuntimeAttentionFocusPlatformInput"),
  );
  assert.ok(validationApis.includes("verifyDirectorRuntimeAttentionFocusPlatform"));
});

test("23. compatibility registry preserved", () => {
  assert.deepEqual(
    [...compatibility.entries],
    [...freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES],
  );
  assert.equal(
    compatibility.count,
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES.length,
  );
});

test("24. consumer guarantee registry", () => {
  assert.deepEqual([...consumerGuarantees], [
    "Released",
    "Stable",
    "Certified",
    "Frozen",
    "ReadyForConsumer",
    "Deterministic",
    "Immutable",
    "Stateless",
    "RendererIndependent",
    "Traceable",
    "SinglePipelineOrder",
    "NoSceneMutation",
  ]);
});

test("25. consumer rule registry", () => {
  assert.deepEqual([...consumerRules], [
    "ImportPublicIndexOnly",
    "DoNotImportFoundationDirectly",
    "DoNotImportSignalContractsDirectly",
    "DoNotImportPriorityResolutionDirectly",
    "DoNotImportFocusBindingDirectly",
    "DoNotImportPathOrchestrationDirectly",
    "DoNotImportTransitionOrchestrationDirectly",
    "DoNotImportPlatformDirectly",
    "DoNotImportCertificationFreezeDirectly",
    "PreserveFrozenSemantics",
  ]);
  assert.equal(prohibitedImports.length, 8);
});

test("26. dynamic count integrity", () => {
  assert.equal(registry.counts.identityChainCount, identityChain.length);
  assert.equal(registry.counts.namespaceChainCount, namespaceChain.length);
  assert.equal(registry.counts.namespaceSectionCount, sections.length);
  assert.equal(registry.counts.approvedFrozenExportCount, approvedExports.length);
  assert.equal(registry.counts.publicExportCount, publicExports.length);
  assert.equal(registry.counts.publicTypeCount, publicTypes.length);
  assert.equal(registry.counts.publicFunctionalApiCount, publicApis.length);
  assert.equal(registry.counts.validationApiCount, validationApis.length);
  assert.equal(registry.counts.consumerGuaranteeCount, consumerGuarantees.length);
  assert.equal(registry.counts.consumerRuleCount, consumerRules.length);
  assert.equal(
    registry.counts.compatibilityEntryCount,
    compatibility.entries.length,
  );
});

test("27. Public Index registry immutability", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.throws(() => {
    (registry as { version: string }).version = "0.0.0";
  });
});

test("28. consumer information immutability", () => {
  assert.equal(Object.isFrozen(consumerInfo), true);
  assert.equal(Object.isFrozen(consumerInfo.rules), true);
  assert.equal(Object.isFrozen(consumerInfo.prohibitedImports), true);
});

test("29. identity chain immutability", () => {
  assert.equal(Object.isFrozen(identityChain), true);
});

test("30. namespace chain immutability", () => {
  assert.equal(Object.isFrozen(namespaceChain), true);
  assert.equal(Object.isFrozen(namespaceChain[0]), true);
});

test("31. public export registry immutability", () => {
  assert.equal(Object.isFrozen(publicExports), true);
  assert.equal(Object.isFrozen(approvedExports), true);
});

test("32. direct re-export semantic preservation", () => {
  assert.equal(
    runDirectorRuntimeAttentionFocusPlatform,
    freezeSurface.runDirectorRuntimeAttentionFocusPlatform,
  );
  assert.equal(
    resolveDirectorRuntimeAttentionPriority,
    freezeSurface.resolveDirectorRuntimeAttentionPriority,
  );
  assert.equal(
    bindDirectorRuntimeFocusContext,
    freezeSurface.bindDirectorRuntimeFocusContext,
  );
  assert.equal(
    orchestrateDirectorRuntimeAttentionPaths,
    freezeSurface.orchestrateDirectorRuntimeAttentionPaths,
  );
  assert.equal(
    orchestrateDirectorRuntimeAttentionTransition,
    freezeSurface.orchestrateDirectorRuntimeAttentionTransition,
  );
  assert.equal(
    verifyDirectorRuntimeAttentionFocusPlatform,
    freezeSurface.verifyDirectorRuntimeAttentionFocusPlatform,
  );
});

test("33. no behavioral wrappers", () => {
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+runDirectorRuntimeAttentionFocusPlatform\s*\(/m,
  );
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeAttentionPriority\s*\(/m,
  );
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+bindDirectorRuntimeFocusContext\s*\(/m,
  );
});

test("34. no duplicate priority policy", () => {
  assert.equal(source.includes("DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE"), false);
  assert.ok(absentCapabilities.includes("PriorityResolutionImplementation"));
});

test("35. no duplicate focus policy", () => {
  assert.equal(
    source.includes("DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE"),
    false,
  );
  assert.ok(absentCapabilities.includes("FocusBindingImplementation"));
});

test("36. no duplicate path policy", () => {
  assert.equal(source.includes("collectDirectedPaths"), false);
  assert.ok(absentCapabilities.includes("PathTraversalImplementation"));
});

test("37. no duplicate transition policy", () => {
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+classifySubjectTransition\s*\(/m,
  );
  assert.ok(absentCapabilities.includes("TransitionImplementation"));
});

test("38. no duplicate certification/freeze policy", () => {
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+certifyDirectorRuntimeAttentionFocusPlatform\s*\(/m,
  );
  assert.doesNotMatch(
    source,
    /^\s*(?:export\s+)?function\s+freezeDirectorRuntimeAttentionFocusPlatform\s*\(/m,
  );
  assert.ok(absentCapabilities.includes("CertificationImplementation"));
});

test("39. upstream freeze manifest exists", () => {
  assert.ok(freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_MANIFEST);
  assert.ok(publicIndex.freezeManifest);
});

test("40. freeze manifest reports ReadyForPublicIndex", () => {
  assert.equal(
    publicIndex.freezeManifest?.readiness,
    "ready-for-public-index",
  );
  assert.equal(
    publicIndex.upstreamReadiness,
    "ready-for-public-index",
  );
});

test("41. freeze manifest lock consistency", () => {
  assert.equal(publicIndex.freezeManifest?.lock, lockValue);
  assert.equal(publicIndex.freezeLock, lockValue);
});

test("42. freeze-manifest approved exports match publication rules", () => {
  assert.deepEqual(
    [...approvedExports],
    [...(publicIndex.freezeManifest?.approvedExports ?? [])],
  );
  assert.deepEqual([...publicExports], [...approvedExports]);
});

test("43. no unapproved public exports", () => {
  for (const name of publicExports) {
    assert.ok(
      (freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS as
        readonly string[]).includes(name),
      name,
    );
  }
  for (const name of publicApis) {
    assert.ok((approvedExports as readonly string[]).includes(name), name);
  }
  for (const name of validationApis) {
    assert.ok((approvedExports as readonly string[]).includes(name), name);
  }
});

test("44. approved public symbols are reachable", () => {
  for (const name of approvedExports) {
    assert.equal(
      typeof (publicModule as Record<string, unknown>)[name] !== "undefined",
      true,
      name,
    );
  }
});

test("45. internal-only symbols remain unpublished", () => {
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      publicModule,
      "certifyDirectorRuntimeAttentionFocusPlatform",
    ),
    false,
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      publicModule,
      "freezeDirectorRuntimeAttentionFocusPlatform",
    ),
    false,
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      publicModule,
      "hasForbiddenSemanticDuplication",
    ),
    false,
  );
});

test("46. public platform execution reachable if approved", () => {
  assert.equal(typeof runDirectorRuntimeAttentionFocusPlatform, "function");
  assert.equal(
    typeof publicModule.runDirectorRuntimeAttentionFocusPlatform,
    "function",
  );
});

test("47. public validation reachable if approved", () => {
  assert.equal(typeof validateDirectorRuntimeAttentionFocusPlatformInput, "function");
  assert.equal(typeof verifyDirectorRuntimeAttentionFocusPlatform, "function");
});

test("48. public types reachable if approved", () => {
  assert.ok(publicTypes.includes("DirectorRuntimeAttentionSignal"));
  assert.ok(publicTypes.includes("DirectorRuntimeFocusContext"));
  assert.ok(publicTypes.includes("DirectorRuntimeAttentionFocusFreezeManifest"));
});

test("49. guarantee-to-certification preservation", () => {
  assert.ok(
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS
      .includes("Deterministic"),
  );
  assert.ok(
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS
      .includes("NoSceneMutation"),
  );
  assert.ok(consumerGuarantees.includes("Deterministic"));
  assert.ok(consumerGuarantees.includes("Certified"));
  assert.ok(consumerGuarantees.includes("Frozen"));
});

test("50. compatibility preservation", () => {
  assert.ok(
    compatibility.entries.every((entry) => entry.status === "compatible"),
  );
  assert.equal(
    compatibility.entries,
    freezeSurface.DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES,
  );
});

test("51. condition preservation", () => {
  assert.deepEqual([...(certification.conditions ?? [])], []);
  assert.deepEqual(
    [...(publicIndex.freezeManifest?.conditions ?? [])],
    [],
  );
});

test("52. consumer-entry verification success", () => {
  const verification = verifyDirectorRuntimeAttentionFocusConsumerEntry();
  assert.equal(verification.ok, true);
  assert.equal(verification.releaseStatus, "Released");
  assert.equal(verification.stability, "Stable");
  assert.equal(verification.readiness, "ReadyForConsumer");
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.frozen, true);
  assert.equal(verification.released, true);
});

test("53. Public Index verification success", () => {
  const verification = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(verification.ok, true);
  assert.equal(
    verification.lock,
    "DRI-6-DIRECTOR-RUNTIME-ATTENTION-FOCUS-LOCKED",
  );
});

test("54. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionFocusPublicIndex(),
    verifyDirectorRuntimeAttentionFocusPublicIndex(),
  );
  assert.deepEqual(
    verifyDirectorRuntimeAttentionFocusConsumerEntry(),
    verifyDirectorRuntimeAttentionFocusConsumerEntry(),
  );
});

test("55. JSON-compatible metadata", () => {
  const payload = {
    identity,
    version,
    namespace,
    identityChain,
    namespaceStages,
    sections,
    approvedExports,
    publicApis,
    consumerRules,
    consumerGuarantees,
    counts: registry.counts,
    release: releaseInfo,
  };
  const serialized = JSON.stringify(payload);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.identity, identity);
  assert.equal(parsed.counts.identityChainCount, 9);
});

test("56. no presentation behavior", () => {
  assert.ok(absentCapabilities.includes("Rendering"));
  assert.equal(source.includes("Three.js"), false);
  assert.doesNotMatch(source, /\buseEffect\b|\buseState\b/);
});

test("57. no scene mutation", () => {
  assert.ok(absentCapabilities.includes("SceneMutation"));
  assert.equal(source.includes("hideNode"), false);
  assert.equal(source.includes("mutateScene"), false);
});

test("58. no business reasoning", () => {
  assert.doesNotMatch(source, /\bcalculateKPI\b|\bcalculateKOI\b|\briskScore\b/);
});

test("59. no persistence", () => {
  assert.equal(source.includes("localStorage"), false);
  assert.equal(source.includes("sessionStorage"), false);
});

test("60. no networking", () => {
  assert.equal(source.includes("fetch("), false);
  assert.equal(source.includes("WebSocket"), false);
});

test("61. no event system", () => {
  assert.equal(source.includes("EventEmitter"), false);
  assert.equal(source.includes("addEventListener"), false);
});

test("62. no unnecessary async wrappers", () => {
  assert.doesNotMatch(source, /async\s+function/);
  assert.doesNotMatch(source, /new\s+Promise/);
});

test("63. DRI-6:9 focused verification architectural status", () => {
  assert.match(
    publicIndex.architecturalStatus,
    /Released · Certified · Frozen · Stable · Locked · ReadyForConsumer · SoleConsumerEntryPoint/,
  );
});

test("64. signal factory reachable through public index", () => {
  const signal = createDirectorRuntimeAttentionSignal({
    signalId: "sig-public-1",
    subject: { subjectId: "factory-01", subjectKind: "object" },
    source: "user-interaction",
    reason: "explicit-selection",
    scope: "subject",
    requestedLevel: "primary",
    persistence: "transient",
    intent: "request-focus",
  });
  assert.equal(signal.signalId, "sig-public-1");
});
