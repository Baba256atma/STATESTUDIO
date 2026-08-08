import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS as checkIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS as domains,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES as certificationStatuses,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES as compatibilityStatuses,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS as consumerKinds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS as mandatoryCheckIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  certifyDirectorExecutiveGuidanceAdapter,
  certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters,
  createDirectorExecutiveGuidanceAdapterCertificationInput,
  createDirectorExecutiveGuidanceAdapterDescriptor,
  directorRuntimeExecutiveGuidanceAdapterCertification as certification,
  directorRuntimeExecutiveGuidanceAdapterCertificationApiNames as apiNames,
  directorRuntimeExecutiveGuidanceAdapterCertificationCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceAdapterCertificationManifest as manifest,
  directorRuntimeExecutiveGuidanceAdapterCertificationRegistry as registry,
  directorRuntimeExecutiveGuidanceAdapterCertificationReport as canonicalReport,
  verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
  type DirectorRuntimeExecutiveGuidanceAdapterDescriptor,
} from "./directorRuntimeExecutiveGuidanceAdapterCertification.ts";

import { directorRuntimeExecutiveGuidancePlatformIdentity } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform";
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
  new URL(
    "./directorRuntimeExecutiveGuidanceAdapterCertification.ts",
    import.meta.url,
  ),
  "utf8",
);

function validDescriptor(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceAdapterDescriptor> = {},
): DirectorRuntimeExecutiveGuidanceAdapterDescriptor {
  return createDirectorExecutiveGuidanceAdapterDescriptor({
    adapterId: overrides.adapterId ?? "director.scene.guidance",
    consumerKind: overrides.consumerKind ?? "scene",
    acceptedPlatformVersion: overrides.acceptedPlatformVersion ?? "7.6.0",
    preservesIdentity: overrides.preservesIdentity ?? true,
    preservesHierarchy: overrides.preservesHierarchy ?? true,
    preservesProvenance: overrides.preservesProvenance ?? true,
    preservesOrdering: overrides.preservesOrdering ?? true,
    preservesReadiness: overrides.preservesReadiness ?? true,
    sideEffectFreeAtBoundary: overrides.sideEffectFreeAtBoundary ?? true,
  });
}

function certifyDescriptor(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceAdapterDescriptor> = {},
) {
  return certifyDirectorExecutiveGuidanceAdapter(
    createDirectorExecutiveGuidanceAdapterCertificationInput({
      certificationId: "certification.scene.guidance",
      adapterDescriptor: validDescriptor(overrides),
    }),
  );
}

function checkPassed(
  report: ReturnType<typeof certifyDirectorExecutiveGuidanceAdapter>,
  checkId: string,
): boolean {
  return report.checks.find((entry) => entry.checkId === checkId)?.passed ===
    true;
}

test("1. exact DRI-7:7 identity", () => {
  assert.equal(
    certification.identity,
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
  );
  assert.equal(canonicalIdentity.identity, certification.identity);
  assert.equal(certification.phase, "DRI-7:7");
  assert.equal(certification.role, "AdapterCertification");
});

test("2. exact version 7.7.0", () => {
  assert.equal(certification.version, "7.7.0");
  assert.equal(canonicalIdentity.version, "7.7.0");
});

test("3. exact namespace", () => {
  assert.equal(
    certification.namespace,
    "nexora.dri.executive-guidance.adapter-certification",
  );
});

test("4. sole immediate dependency is DRI-7:6", () => {
  assert.equal(
    certification.upstreamDependency,
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
  );
  assert.equal(
    certification.upstreamDependency,
    directorRuntimeExecutiveGuidancePlatformIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform",
  ]);
});

test("5. no direct DRI-7:5 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceDelivery["']/,
  );
});

test("6. no direct DRI-7:4 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceComposition["']/,
  );
});

test("7. no direct DRI-7:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceResolution["']/,
  );
});

test("8. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("9. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("10. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("11. certification-status vocabulary complete", () => {
  assert.deepEqual([...certificationStatuses], ["certified", "not-certified"]);
});

test("12. compatibility-status vocabulary complete", () => {
  assert.deepEqual([...compatibilityStatuses], ["compatible", "incompatible"]);
});

test("13. consumer-kind vocabulary complete", () => {
  assert.deepEqual([...consumerKinds], [
    "director",
    "scene",
    "advisor",
    "insight",
    "journal",
    "timeline",
    "custom",
  ]);
});

test("14. capability vocabulary complete", () => {
  assert.deepEqual([...capabilities], [
    "consume-platform-result",
    "preserve-identity",
    "preserve-hierarchy",
    "preserve-provenance",
    "preserve-order",
    "preserve-readiness",
    "preserve-delivery-status",
    "respect-consumer-boundary",
  ]);
});

test("15. certification-domain vocabulary complete", () => {
  assert.deepEqual([...domains], [
    "identity",
    "dependency",
    "platform-contract",
    "hierarchy",
    "provenance",
    "ordering",
    "readiness",
    "delivery-status",
    "renderer-independence",
    "advisor-independence",
    "action-independence",
    "side-effect-boundary",
    "immutability",
    "determinism",
    "consumer-adaptability",
  ]);
});

test("16. certification check IDs unique", () => {
  assert.equal(new Set(checkIds).size, checkIds.length);
});

test("17. mandatory checks complete", () => {
  assert.deepEqual([...mandatoryCheckIds], [...checkIds]);
  assert.equal(mandatoryCheckIds.length, 20);
});

test("18. certification registry deterministic", () => {
  assert.equal(registry.identity, certification.identity);
  assert.equal(registry.checkCount, 20);
  assert.equal(registry.domainCount, 15);
  assert.ok(Object.isFrozen(registry));
});

test("19. certification manifest correct", () => {
  assert.equal(manifest.version, "7.7.0");
  assert.equal(manifest.platformVersion, "7.6.0");
  assert.equal(manifest.rendererIndependent, true);
  assert.equal(manifest.advisorIndependent, true);
  assert.equal(manifest.actionIndependent, true);
  assert.equal(manifest.sideEffectBoundaryCertified, true);
  assert.equal(manifest.certifiesBoundaryOnly, true);
});

test("20. platform identity certified", () => {
  const report = certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters();
  assert.ok(checkPassed(report, "dri7.adapter.identity.platform"));
  assert.equal(
    report.platformIdentity,
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
  );
});

test("21. platform version compatibility certified", () => {
  const report = certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters();
  assert.ok(checkPassed(report, "dri7.adapter.version.compatibility"));
  assert.equal(report.platformVersion, "7.6.0");
});

test("22. platform consumer surface certified", () => {
  const report = certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters();
  assert.ok(checkPassed(report, "dri7.adapter.contract.consumer-surface"));
});

test("23. identity preservation certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.identity.platform"));
  assert.ok(checkPassed(certifyDescriptor(), "dri7.adapter.identity.platform"));
});

test("24. hierarchy preservation certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.hierarchy.preserved"));
});

test("25. provenance preservation certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.provenance.preserved"));
});

test("26. ordering preservation certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.ordering.preserved"));
});

test("27. readiness preservation certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.readiness.preserved"));
});

test("28. delivery-status preservation certified", () => {
  assert.ok(
    checkPassed(canonicalReport, "dri7.adapter.delivery-status.preserved"),
  );
});

test("29. renderer independence certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.renderer-independent"));
});

test("30. scene-adapter semantic compatibility certified", () => {
  assert.ok(
    checkPassed(canonicalReport, "dri7.adapter.scene.semantic-compatibility"),
  );
});

test("31. Three.js independence certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.renderer-independent"));
  assert.doesNotMatch(source, /from\s+["']three["']/);
});

test("32. React independence certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.renderer-independent"));
  assert.doesNotMatch(source, /from\s+["']react["']/);
});

test("33. Advisor independence certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.advisor-independent"));
});

test("34. Insight semantic compatibility certified", () => {
  assert.ok(
    checkPassed(canonicalReport, "dri7.adapter.insight.semantic-compatibility"),
  );
});

test("35. Journal semantic compatibility certified", () => {
  assert.ok(
    checkPassed(canonicalReport, "dri7.adapter.journal.semantic-compatibility"),
  );
});

test("36. Timeline semantic compatibility certified", () => {
  assert.ok(
    checkPassed(
      canonicalReport,
      "dri7.adapter.timeline.semantic-compatibility",
    ),
  );
});

test("37. Action independence certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.action-independent"));
});

test("38. Side-effect boundary certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.side-effect-boundary"));
});

test("39. Immutability certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.immutability"));
});

test("40. Determinism certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.determinism"));
});

test("41. Consumer adaptability certified", () => {
  assert.ok(checkPassed(canonicalReport, "dri7.adapter.consumer-adaptability"));
});

test("42. Valid descriptor → certified", () => {
  const report = certifyDescriptor();
  assert.equal(report.certificationStatus, "certified");
});

test("43. Valid descriptor → compatible", () => {
  const report = certifyDescriptor();
  assert.equal(report.compatibilityStatus, "compatible");
});

test("44. Hierarchy-preservation failure → not-certified", () => {
  const report = certifyDescriptor({ preservesHierarchy: false });
  assert.equal(report.certificationStatus, "not-certified");
  assert.equal(checkPassed(report, "dri7.adapter.hierarchy.preserved"), false);
});

test("45. Provenance-preservation failure → not-certified", () => {
  const report = certifyDescriptor({ preservesProvenance: false });
  assert.equal(report.certificationStatus, "not-certified");
});

test("46. Ordering-preservation failure → not-certified", () => {
  const report = certifyDescriptor({ preservesOrdering: false });
  assert.equal(report.certificationStatus, "not-certified");
});

test("47. Readiness-preservation failure → not-certified", () => {
  const report = certifyDescriptor({ preservesReadiness: false });
  assert.equal(report.certificationStatus, "not-certified");
});

test("48. Identity-preservation failure → not-certified", () => {
  const report = certifyDescriptor({ preservesIdentity: false });
  assert.equal(report.certificationStatus, "not-certified");
});

test("49. Platform-version incompatibility → not-certified", () => {
  const report = certifyDescriptor({ acceptedPlatformVersion: "7.5.0" });
  assert.equal(report.certificationStatus, "not-certified");
  assert.equal(
    checkPassed(report, "dri7.adapter.version.compatibility"),
    false,
  );
});

test("50. Failed mandatory check → incompatible", () => {
  const report = certifyDescriptor({ preservesHierarchy: false });
  assert.equal(report.compatibilityStatus, "incompatible");
});

test("51. All mandatory checks → certified", () => {
  const report = certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters();
  assert.equal(report.failedCheckCount, 0);
  assert.equal(report.certificationStatus, "certified");
  assert.equal(report.checks.length, mandatoryCheckIds.length);
});

test("52. Certification passed/failed counts reconcile", () => {
  const report = certifyDescriptor({ preservesOrdering: false });
  assert.equal(
    report.passedCheckCount + report.failedCheckCount,
    report.checks.length,
  );
  assert.ok(report.failedCheckCount >= 1);
});

test("53. No certification score", () => {
  assert.doesNotMatch(source, /certificationScore|compatibilityScore/);
});

test("54. No confidence score", () => {
  assert.doesNotMatch(source, /adapterConfidence|confidenceScore|0\.\d{2}/);
});

test("55. No concrete adapter implementation", () => {
  assert.doesNotMatch(
    source,
    /adaptPlatformToScene|adaptPlatformToReact|renderGuidance\s*\(/,
  );
  assert.equal(certification.noConcreteAdapters, true);
});

test("56. No adapter registration", () => {
  assert.doesNotMatch(
    source,
    /registerAdapter\s*\(|unregisterAdapter\s*\(|adapterRegistry\.add/,
  );
});

test("57. No plugin loading", () => {
  assert.doesNotMatch(source, /import\(|require\(|pluginLoader|loadAdapter/);
});

test("58. No dispatch", () => {
  assert.doesNotMatch(
    source,
    /dispatchToAdapter|sendToScene|sendToAdvisor|publishToConsumer/,
  );
});

test("59. No event bus", () => {
  assert.doesNotMatch(source, /\bEventEmitter\b|\beventBus\b|\bsubscribe\b|\bpublish\b/);
});

test("60. No network IO", () => {
  assert.doesNotMatch(source, /\bfetch\b|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test("61. No storage IO", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|\bfs\./);
});

test("62. No timers", () => {
  assert.doesNotMatch(source, /\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b/);
});

test("63. No randomness", () => {
  assert.doesNotMatch(source, /Math\.random|crypto\.randomUUID/);
});

test("64. No generated timestamps", () => {
  assert.doesNotMatch(source, /Date\.now\(|new Date\(|performance\.now/);
});

test("65. Certification input not mutated", () => {
  const input = createDirectorExecutiveGuidanceAdapterCertificationInput({
    certificationId: "certification.mutation",
    adapterDescriptor: validDescriptor(),
  });
  const before = JSON.stringify(input);
  certifyDirectorExecutiveGuidanceAdapter(input);
  assert.equal(JSON.stringify(input), before);
});

test("66. Adapter descriptor not mutated", () => {
  const descriptor = validDescriptor();
  const before = JSON.stringify(descriptor);
  certifyDescriptor({ adapterId: descriptor.adapterId });
  assert.equal(JSON.stringify(descriptor), before);
});

test("67. Certification report immutable", () => {
  const report = certifyDescriptor();
  assert.ok(Object.isFrozen(report));
  assert.ok(Object.isFrozen(report.checks));
  assert.throws(() => {
    (report as { certificationStatus: string }).certificationStatus =
      "not-certified";
  });
});

test("68. Registry immutable", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(registry.checkIds));
  assert.ok(Object.isFrozen(registry.consumerKinds));
});

test("69. Manifest immutable", () => {
  assert.ok(Object.isFrozen(manifest));
});

test("70. Repeated identical input → identical report", () => {
  const input = createDirectorExecutiveGuidanceAdapterCertificationInput({
    certificationId: "certification.determinism",
    adapterDescriptor: validDescriptor(),
  });
  const first = certifyDirectorExecutiveGuidanceAdapter(input);
  const second = certifyDirectorExecutiveGuidanceAdapter(input);
  assert.deepEqual(first, second);
});

test("71. No Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
});

test("72. No React dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next)(?:\/[^"']*)?["']/i,
  );
});

test("73. No DOM/browser dependency", () => {
  assert.doesNotMatch(source, /\bdocument\b|\bwindow\b|\bHTMLElement\b|\bCanvas\b/);
});

test("74. No SceneRenderer dependency", () => {
  assert.doesNotMatch(source, /SceneRenderer|AnimatableObject/);
});

test("75. No LLM behavior", () => {
  assert.doesNotMatch(source, /\bLLM\b|systemPrompt|openai|tokenCount|chatCompletion/);
});

test("76. No business action execution", () => {
  assert.doesNotMatch(
    source,
    /\bapprove\(|\breject\(|\bexecute\(|\bpause\(|\bresume\(|\bcancel\(/,
  );
});

test("77. Verification passes", () => {
  const verification =
    verifyDirectorRuntimeExecutiveGuidanceAdapterCertification();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "7.7.0");
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.failedCheckCount, 0);
});

test("78. DRI-7:6 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePlatform().ok, true);
});

test("79. DRI-7:5 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceDelivery().ok, true);
});

test("80. DRI-7:4 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceComposition().ok, true);
});

test("81. DRI-7:3 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceResolution().ok, true);
});

test("82. DRI-7:2 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceContracts().ok, true);
});

test("83. DRI-7:1 regression passes", () => {
  assert.equal(verifyDirectorRuntimeExecutiveGuidanceFoundation().ok, true);
});

test("84. DRI-6 regression remains clean", () => {
  assert.equal(verifyDirectorRuntimeAttentionFocusPublicIndex().ok, true);
});

test("85. Focused DRI-7:7 suite surface sanity", () => {
  assert.ok(
    apiNames.includes("certifyDirectorExecutiveGuidanceAdapter"),
  );
  assert.ok(
    publicTypeNames.includes(
      "DirectorRuntimeExecutiveGuidanceAdapterCertificationReport",
    ),
  );
  assert.equal(canonicalReport.certificationStatus, "certified");
  assert.equal(canonicalReport.compatibilityStatus, "compatible");
});
