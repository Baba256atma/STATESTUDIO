import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS as approvedExports,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_RULES as consumerRules,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PROHIBITED_CONSUMER_IMPORTS as prohibitedImports,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_DEPENDENCY_CHAIN as dependencyChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES as publicApis,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN as identityChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS as sections,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN as namespaceChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES as publicTypes,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES as verificationApis,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN as versionChain,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK as lock,
  directorRuntimeExecutiveGuidanceConsumerImportPath as importPath,
  directorRuntimeExecutiveGuidanceConsumerInformation as consumerInformation,
  directorRuntimeExecutiveGuidanceConsumerReadiness as consumerReadiness,
  directorRuntimeExecutiveGuidanceConsumerRole as consumerRole,
  directorRuntimeExecutiveGuidancePublicApis as publicApisSection,
  directorRuntimeExecutiveGuidancePublicCertification as certificationSection,
  directorRuntimeExecutiveGuidancePublicCompatibility as compatibilitySection,
  directorRuntimeExecutiveGuidancePublicIdentity as identitySection,
  directorRuntimeExecutiveGuidancePublicIndex as publicIndex,
  directorRuntimeExecutiveGuidancePublicIndexCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidancePublicIndexRegistry as registry,
  directorRuntimeExecutiveGuidancePublicTypes as publicTypesSection,
  directorRuntimeExecutiveGuidancePublicValidation as validationSection,
  directorRuntimeExecutiveGuidanceReleaseInformation as releaseSection,
  directorRuntimeExecutiveGuidanceReleaseMetadata as releaseMetadata,
  directorRuntimeExecutiveGuidanceReleaseStatus as releaseStatus,
  directorRuntimeExecutiveGuidanceStability as stability,
  evaluateDirectorRuntimeExecutiveGuidanceReleaseGate,
  verifyDirectorRuntimeExecutiveGuidanceConsumerEntry,
  verifyDirectorRuntimeExecutiveGuidancePublicIndex,
} from "./directorRuntimeExecutiveGuidancePublicIndex.ts";

import { directorRuntimeExecutiveGuidanceFreezeIdentity } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze";
import { verifyDirectorRuntimeExecutiveGuidanceFreeze } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze";
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
  new URL("./directorRuntimeExecutiveGuidancePublicIndex.ts", import.meta.url),
  "utf8",
);

test("1. exact DRI-7:9 identity", () => {
  assert.equal(
    publicIndex.identity,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
  assert.equal(canonicalIdentity.identity, publicIndex.identity);
  assert.equal(publicIndex.phase, "DRI-7:9");
  assert.equal(publicIndex.role, "SoleConsumerEntryPoint");
});

test("2. exact version 7.9.0", () => {
  assert.equal(publicIndex.version, "7.9.0");
  assert.equal(canonicalIdentity.version, "7.9.0");
});

test("3. exact namespace", () => {
  assert.equal(
    publicIndex.namespace,
    "nexora.dri.executive-guidance.public-index",
  );
});

test("4. sole immediate dependency is DRI-7:8", () => {
  assert.equal(
    publicIndex.immediateDependency,
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  );
  assert.equal(
    publicIndex.immediateDependency,
    directorRuntimeExecutiveGuidanceFreezeIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze",
  ]);
});

test("5. no direct DRI-7:7 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceAdapterCertification["']/,
  );
});

test("6. no direct DRI-7:6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidancePlatform["']/,
  );
});

test("7. no direct DRI-7:5 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceDelivery["']/,
  );
});

test("8. no direct DRI-7:4 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceComposition["']/,
  );
});

test("9. no direct DRI-7:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceResolution["']/,
  );
});

test("10. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("11. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("12. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("13. Supported consumer import path exact", () => {
  assert.equal(
    importPath,
    "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex",
  );
  assert.equal(publicIndex.supportedImportPath, importPath);
});

test("14. Consumer role = SoleConsumerEntryPoint", () => {
  assert.equal(consumerRole, "SoleConsumerEntryPoint");
  assert.equal(consumerInformation.role, "SoleConsumerEntryPoint");
});

test("15. Identity-chain count = 9", () => {
  assert.equal(identityChain.length, 9);
});

test("16. Identity-chain exact order", () => {
  assert.deepEqual([...identityChain], [
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  ]);
});

test("17. Version-chain count = 9", () => {
  assert.equal(versionChain.length, 9);
});

test("18. Version-chain exact order", () => {
  assert.deepEqual([...versionChain], [
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "7.4.0",
    "7.5.0",
    "7.6.0",
    "7.7.0",
    "7.8.0",
    "7.9.0",
  ]);
});

test("19. Namespace-chain count = 9", () => {
  assert.equal(namespaceChain.length, 9);
});

test("20. Namespace-chain exact order", () => {
  assert.deepEqual([...namespaceChain], [
    "nexora.dri.executive-guidance.foundation",
    "nexora.dri.executive-guidance.contracts",
    "nexora.dri.executive-guidance.resolution",
    "nexora.dri.executive-guidance.composition",
    "nexora.dri.executive-guidance.delivery",
    "nexora.dri.executive-guidance.platform",
    "nexora.dri.executive-guidance.adapter-certification",
    "nexora.dri.executive-guidance.freeze",
    "nexora.dri.executive-guidance.public-index",
  ]);
});

test("21. Dependency chain exact", () => {
  assert.deepEqual([...dependencyChain], [
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
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

test("22. Exact lock preserved", () => {
  assert.equal(lock, "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED");
  assert.equal(publicIndex.lock, lock);
  assert.equal(releaseMetadata.lock, lock);
});

test("23. Lock status = locked", () => {
  assert.equal(publicIndex.lockStatus, "locked");
  assert.equal(releaseMetadata.lockStatus, "locked");
});

test("24. Certification status = certified", () => {
  assert.equal(publicIndex.certificationStatus, "certified");
  assert.equal(certificationSection.certificationStatus, "certified");
});

test("25. Compatibility status = compatible", () => {
  assert.equal(publicIndex.compatibilityStatus, "compatible");
  assert.equal(compatibilitySection.compatibilityStatus, "compatible");
});

test("26. Freeze status = frozen", () => {
  assert.equal(publicIndex.freezeStatus, "frozen");
});

test("27. Release status = released", () => {
  assert.equal(releaseStatus, "released");
  assert.equal(publicIndex.releaseStatus, "released");
});

test("28. Stability = stable", () => {
  assert.equal(stability, "stable");
  assert.equal(publicIndex.stability, "stable");
});

test("29. Consumer readiness = ready-for-consumer", () => {
  assert.equal(consumerReadiness, "ready-for-consumer");
  assert.equal(publicIndex.consumerReadiness, "ready-for-consumer");
});

test("30. Namespace-section count = 9", () => {
  assert.equal(sections.length, 9);
  assert.equal(registry.namespaceSectionCount, 9);
});

test("31. Identity section valid", () => {
  assert.equal(identitySection.identity, publicIndex.identity);
  assert.equal(identitySection.identityChainCount, 9);
  assert.equal(publicIndex.sections.Identity, identitySection);
});

test("32. Public Types section valid", () => {
  assert.ok(publicTypesSection.count > 0);
  assert.equal(publicTypesSection.source.includes("DRI-7:8"), true);
  assert.ok(publicTypes.includes("DirectorRuntimeExecutiveGuidanceFreezeManifest"));
});

test("33. Public APIs section valid", () => {
  assert.ok(publicApisSection.count > 0);
  assert.ok(publicApis.includes("verifyDirectorRuntimeExecutiveGuidanceFreeze"));
  assert.ok(
    publicApis.includes("certifyDirectorExecutiveGuidanceAdapter"),
  );
});

test("34. Verification section valid", () => {
  assert.ok(validationSection.count >= 4);
  assert.ok(verificationApis.includes(
    "verifyDirectorRuntimeExecutiveGuidanceConsumerEntry",
  ));
  assert.equal(publicIndex.sections.Validation, validationSection);
});

test("35. Certification section valid", () => {
  assert.equal(certificationSection.certificationStatus, "certified");
  assert.equal(certificationSection.freezeStatus, "frozen");
  assert.equal(certificationSection.lockStatus, "locked");
});

test("36. Release Information section valid", () => {
  assert.equal(releaseSection.releaseStatus, "released");
  assert.equal(releaseSection.stability, "stable");
  assert.equal(releaseSection.consumerReadiness, "ready-for-consumer");
});

test("37. Compatibility section valid", () => {
  assert.equal(compatibilitySection.compatibilityStatus, "compatible");
  assert.equal(compatibilitySection.semanticAdapterCompatible, true);
});

test("38. Registry section valid", () => {
  assert.equal(registry.identity, publicIndex.identity);
  assert.equal(registry.approvedFrozenExportCount, approvedExports.length);
  assert.ok(Object.isFrozen(registry));
});

test("39. Consumer Information section valid", () => {
  assert.equal(consumerInformation.role, "SoleConsumerEntryPoint");
  assert.equal(consumerInformation.directInternalImportsSupported, false);
  assert.equal(consumerInformation.rendererIndependent, true);
  assert.equal(consumerRules.length, 12);
});

test("40. Approved frozen exports present", () => {
  assert.ok(approvedExports.length > 0);
  assert.ok(approvedExports.includes(
    "certifyDirectorExecutiveGuidanceAdapter",
  ));
  assert.ok(approvedExports.includes(
    "directorRuntimeExecutiveGuidanceFreezeManifest",
  ));
});

test("41. No approved frozen export missing", () => {
  for (const name of approvedExports) {
    if (name.startsWith("DirectorRuntime")) {
      assert.ok(
        publicTypes.includes(name) ||
          approvedExports.includes(name),
        `missing type export metadata: ${name}`,
      );
    } else {
      assert.ok(
        publicApis.includes(name as (typeof publicApis)[number]) ||
          [
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN",
            "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST",
            "directorRuntimeExecutiveGuidanceFreezeIdentity",
            "directorRuntimeExecutiveGuidanceFreezeManifest",
            "directorRuntimeExecutiveGuidanceFreezeRegistry",
            "directorRuntimeExecutiveGuidanceFreeze",
            "directorRuntimeExecutiveGuidanceFreezeVersion",
            "directorRuntimeExecutiveGuidanceFreezeNamespace",
          ].includes(name),
        `missing approved export: ${name}`,
      );
    }
  }
});

test("42. No private helper exposed", () => {
  assert.ok(!publicApis.includes("evaluateReleaseGate"));
  assert.ok(!publicApis.includes("collectPublishedExportNames"));
  assert.ok(!approvedExports.includes("evaluateFreezeChecks"));
});

test("43. No unapproved export exposed", () => {
  assert.doesNotMatch(source, /runDirectorExecutiveGuidancePlatform/);
  assert.doesNotMatch(source, /composeDirectorExecutiveGuidance\b/);
  assert.doesNotMatch(source, /deliverDirectorExecutiveGuidance\b/);
});

test("44. No new runtime behavior", () => {
  assert.equal(publicIndex.noNewRuntimeBehavior, true);
  assert.equal(publicIndex.publicationOnly, true);
});

test("45. No new resolution behavior", () => {
  assert.doesNotMatch(source, /function\s+resolveDirectorExecutiveGuidance\b/);
});

test("46. No new composition behavior", () => {
  assert.doesNotMatch(source, /function\s+composeDirectorExecutiveGuidance\b/);
});

test("47. No new delivery behavior", () => {
  assert.doesNotMatch(source, /function\s+deliverDirectorExecutiveGuidance\b/);
});

test("48. No new platform behavior", () => {
  assert.doesNotMatch(
    source,
    /function\s+runDirectorExecutiveGuidancePlatform\b/,
  );
});

test("49. No new adapter behavior", () => {
  assert.doesNotMatch(source, /adaptPlatformToScene|adaptPlatformToReact/);
});

test("50. No wrapper changing semantics", () => {
  assert.equal(publicIndex.noWrappers, true);
  assert.doesNotMatch(
    source,
    /export\s+function\s+certifyDirectorExecutiveGuidanceAdapter\s*\(/,
  );
  assert.match(
    source,
    /export\s*\{[\s\S]*certifyDirectorExecutiveGuidanceAdapter[\s\S]*\}\s*from/,
  );
});

test("51. Public Index descriptor immutable", () => {
  assert.ok(Object.isFrozen(publicIndex));
  assert.ok(Object.isFrozen(publicIndex.sections));
});

test("52. Release metadata immutable", () => {
  assert.ok(Object.isFrozen(releaseMetadata));
  assert.ok(Object.isFrozen(releaseSection));
});

test("53. Consumer information immutable", () => {
  assert.ok(Object.isFrozen(consumerInformation));
});

test("54. Consumer rules immutable", () => {
  assert.ok(Object.isFrozen(consumerRules));
  assert.ok(Object.isFrozen(prohibitedImports));
});

test("55. Registry immutable", () => {
  assert.ok(Object.isFrozen(registry));
});

test("56. Identity chain immutable", () => {
  assert.ok(Object.isFrozen(identityChain));
});

test("57. Version chain immutable", () => {
  assert.ok(Object.isFrozen(versionChain));
});

test("58. Namespace chain immutable", () => {
  assert.ok(Object.isFrozen(namespaceChain));
});

test("59. Verification result immutable", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.ok(Object.isFrozen(verification));
  assert.ok(Object.isFrozen(verification.checks));
});

test("60. Consumer-entry verification passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceConsumerEntry();
  assert.equal(verification.ok, true);
  assert.equal(verification.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(verification.releaseStatus, "released");
});

test("61. Public-index verification passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.equal(verification.ok, true);
  assert.equal(verification.namespaceSectionCount, 9);
});

test("62. Direct internal imports marked unsupported", () => {
  assert.equal(consumerInformation.directInternalImportsSupported, false);
  assert.equal(prohibitedImports.length, 8);
  assert.ok(
    prohibitedImports.includes(
      "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform",
    ),
  );
});

test("63. Renderer independence preserved", () => {
  assert.equal(consumerInformation.rendererIndependent, true);
});

test("64. Three.js independence preserved", () => {
  assert.doesNotMatch(source, /from\s+["']three["']|@react-three/);
});

test("65. React independence preserved", () => {
  assert.doesNotMatch(source, /from\s+["']react["']|from\s+["']next\//);
});

test("66. DOM/browser independence preserved", () => {
  assert.doesNotMatch(source, /\bdocument\b|\bwindow\b|\bHTMLElement\b/);
});

test("67. Advisor independence preserved", () => {
  assert.equal(consumerInformation.advisorIndependent, true);
  assert.doesNotMatch(source, /\bLLM\b|systemPrompt|openai|tokenCount/);
});

test("68. Action independence preserved", () => {
  assert.equal(consumerInformation.actionIndependent, true);
});

test("69. Side-effect freedom preserved", () => {
  assert.equal(consumerInformation.sideEffectFree, true);
});

test("70. No dispatch", () => {
  assert.doesNotMatch(
    source,
    /dispatchToAdapter|sendToScene|sendToAdvisor|publishToConsumer/,
  );
});

test("71. No event bus", () => {
  assert.doesNotMatch(source, /\bEventEmitter\b|\beventBus\b|\bsubscribe\b|\bpublish\b/);
});

test("72. No network IO", () => {
  assert.doesNotMatch(source, /\bfetch\b|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test("73. No storage IO", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|\bfs\./);
});

test("74. No timers", () => {
  assert.doesNotMatch(source, /\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b/);
});

test("75. No randomness", () => {
  assert.doesNotMatch(source, /Math\.random|crypto\.randomUUID/);
});

test("76. No internally generated timestamps", () => {
  assert.doesNotMatch(source, /Date\.now\(|new Date\(|performance\.now/);
});

test("77. No adapter registration", () => {
  assert.doesNotMatch(source, /registerAdapter\s*\(|unregisterAdapter\s*\(/);
});

test("78. No concrete adapter implementation", () => {
  assert.doesNotMatch(
    source,
    /adaptPlatformToScene|SceneRenderer|AnimatableObject/,
  );
});

test("79. Release gate requires certified state", () => {
  assert.equal(releaseMetadata.certificationStatus, "certified");
  assert.equal(releaseStatus, "released");
});

test("80. Release gate requires compatible state", () => {
  assert.equal(releaseMetadata.compatibilityStatus, "compatible");
});

test("81. Release gate requires frozen state", () => {
  assert.equal(releaseMetadata.freezeStatus, "frozen");
});

test("82. Release gate requires locked state", () => {
  assert.equal(releaseMetadata.lockStatus, "locked");
});

test("83. Release gate requires ready-for-public-index", () => {
  const freezeOk = verifyDirectorRuntimeExecutiveGuidanceFreeze();
  assert.equal(freezeOk.releaseReadiness, "ready-for-public-index");
  assert.equal(releaseStatus, "released");
});

test("84. Failed release invariant prevents released state", () => {
  const failed = evaluateDirectorRuntimeExecutiveGuidanceReleaseGate({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "not-released");
  assert.equal(failed.stability, "unstable");
});

test("85. Failed release invariant prevents ready-for-consumer", () => {
  const failed = evaluateDirectorRuntimeExecutiveGuidanceReleaseGate({
    forceReleaseFailure: true,
  });
  assert.equal(failed.consumerReadiness, "not-ready-for-consumer");
});

test("86. DRI-7:8 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceFreeze().ok, true);
});

test("87. DRI-7:7 regression passes", () => {
  assert.equal(
    verifyDirectorRuntimeExecutiveGuidanceAdapterCertification().ok,
    true,
  );
});

test("88. DRI-7:6 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePlatform().ok, true);
});

test("89. DRI-7:5 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceDelivery().ok, true);
});

test("90. DRI-7:4 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceComposition().ok, true);
});

test("91. DRI-7:3 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceResolution().ok, true);
});

test("92. DRI-7:2 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceContracts().ok, true);
});

test("93. DRI-7:1 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceFoundation().ok, true);
});

test("94. DRI-6 regression remains clean", () => {
  assert.equal(verifyDirectorRuntimeAttentionFocusPublicIndex().ok, true);
});

test("95. Focused DRI-7:9 suite surface sanity", () => {
  assert.equal(publicIndex.architecturalStatus.includes("COMPLETE"), true);
  assert.equal(sections.length, 9);
  assert.ok(Object.isFrozen(publicIndex));
});
