import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS as checkIds,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS as domains,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_STATUSES as certStatuses,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_COMPATIBILITY_STATUSES as compatStatuses,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN as chain,
  certifyDirectorRuntimeConsumerAdapter,
  directorRuntimeConsumerAdapterCertification as certModule,
  directorRuntimeConsumerAdapterCertificationApiNames as apiNames,
  directorRuntimeConsumerAdapterCertificationCanonicalIdentity as canonicalIdentity,
  directorRuntimeConsumerAdapterCertificationRegistry as registry,
  getDirectorRuntimeConsumerAdapterCertificationIdentity,
  getDirectorRuntimeConsumerAdapterCompatibility,
  listDirectorRuntimeConsumerAdapterCertificationChecks,
  listDirectorRuntimeConsumerAdapterCertificationDomains,
  verifyDirectorRuntimeConsumerAdapterCertification,
} from "./directorRuntimeConsumerAdapterCertification.ts";

import { verifyDirectorRuntimeExperienceCoordinationPlatform } from
  "./directorRuntimeExperienceCoordinationPlatform.ts";
import { verifyDirectorRuntimeConsumerInteractionBridge } from
  "./directorRuntimeConsumerInteractionBridge.ts";
import { verifyDirectorRuntimeExperienceStateProjection } from
  "./directorRuntimeExperienceStateProjection.ts";
import { verifyDirectorRuntimeExperienceSurfaceBinding } from
  "./directorRuntimeExperienceSurfaceBinding.ts";
import { verifyDirectorRuntimeConsumerContextBinding } from
  "./directorRuntimeConsumerContextBinding.ts";
import { verifyDirectorRuntimeConsumerIntegrationFoundation } from
  "./directorRuntimeConsumerIntegrationFoundation.ts";
import { verifyDirectorRuntimeExecutiveGuidancePublicIndex } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";
import { verifyDirectorRuntimeInteractionOrchestrationPublicIndex } from
  "@/app/lib/dri/directorRuntimeInteractionOrchestrationPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeConsumerAdapterCertification.ts", import.meta.url),
  "utf8",
);

function check(
  report: ReturnType<typeof certifyDirectorRuntimeConsumerAdapter>,
  id: string,
) {
  const entry = report.checks.find((item) => item.id === id);
  assert.ok(entry, `missing check ${id}`);
  return entry;
}

test("1. exact identity", () => {
  assert.equal(
    certModule.identity,
    "DRI-8:7/DirectorRuntimeConsumerAdapterCertification",
  );
  assert.equal(canonicalIdentity.identity, certModule.identity);
  assert.equal(certModule.phase, "DRI-8:7");
  assert.equal(certModule.role, "ConsumerAdapterCertification");
  assert.deepEqual(
    getDirectorRuntimeConsumerAdapterCertificationIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.7.0", () => {
  assert.equal(certModule.version, "8.7.0");
  assert.equal(canonicalIdentity.version, "8.7.0");
  assert.equal(registry.version, "8.7.0");
});

test("3. exact namespace", () => {
  assert.equal(
    certModule.namespace,
    "nexora.dri.consumer-integration.adapter-certification",
  );
});

test("4. DRI-8:6 is the sole immediate dependency", () => {
  assert.equal(
    certModule.upstreamDependency,
    "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform",
  );
  assert.equal(
    certModule.coordinationPlatformBoundary,
    "DRI-8:6-experience-coordination-platform-only",
  );
  const driImports = [...source.matchAll(/from\s+["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("@/") || value.startsWith("./"));
  assert.deepEqual(driImports, [
    "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform",
  ]);
  assert.equal(
    driImports.filter((value) =>
      value.includes("directorRuntimeConsumerInteractionBridge") ||
      value.includes("directorRuntimeExperienceStateProjection") ||
      value.includes("directorRuntimeExperienceSurfaceBinding") ||
      value.includes("directorRuntimeConsumerContextBinding") ||
      value.includes("directorRuntimeConsumerIntegrationFoundation")
    ).length,
    0,
  );
});

test("5. Certification statuses are canonical", () => {
  assert.deepEqual([...certStatuses], ["certified", "not-certified"]);
});

test("6. Compatibility statuses are canonical", () => {
  assert.deepEqual([...compatStatuses], ["compatible", "incompatible"]);
});

test("7. Certification domains are unique", () => {
  assert.equal(new Set(domains).size, domains.length);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerAdapterCertificationDomains()],
    [...domains],
  );
  assert.deepEqual([...domains], [
    "identity",
    "dependency",
    "foundation",
    "context-binding",
    "surface-binding",
    "state-projection",
    "interaction-bridge",
    "coordination",
    "immutability",
    "determinism",
    "compatibility",
    "framework-independence",
    "semantic-integrity",
    "boundary-integrity",
    "runtime-safety",
    "registry-integrity",
  ]);
});

test("8. Certification check IDs are unique", () => {
  assert.equal(new Set(checkIds).size, checkIds.length);
  assert.equal(
    listDirectorRuntimeConsumerAdapterCertificationChecks().length,
    checkIds.length,
  );
});

test("9. All check domains are valid", () => {
  const domainSet = new Set<string>(domains);
  for (const entry of listDirectorRuntimeConsumerAdapterCertificationChecks()) {
    assert.ok(domainSet.has(entry.domain), entry.domain);
  }
});

test("10. Identity chain DRI-8:1–8:7 is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-IDENTITY-001").status, "passed");
  assert.equal(chain.length, 6);
});

test("11. Version chain is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-IDENTITY-002").status, "passed");
  assert.deepEqual(
    [...chain.map((entry) => entry.version), certModule.version],
    ["8.1.0", "8.2.0", "8.3.0", "8.4.0", "8.5.0", "8.6.0", "8.7.0"],
  );
});

test("12. Dependency chain is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-DEPENDENCY-001").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-DEPENDENCY-002").status, "passed");
});

test("13. Six canonical surfaces are certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-FOUNDATION-001").status, "passed");
});

test("14. Context binding integrity is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-CONTEXT-001").status, "passed");
});

test("15. Selection/focus distinction is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-SEMANTIC-001").status, "passed");
});

test("16. Subject identity preservation is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-SEMANTIC-002").status, "passed");
});

test("17. No synthetic context is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-CONTEXT-002").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-SEMANTIC-003").status, "passed");
});

test("18. Surface filtering is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-SURFACE-001").status, "passed");
});

test("19. Surface order is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-FOUNDATION-001").status, "passed");
  assert.deepEqual([...registry.surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
});

test("20. State projection semantics are certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-PROJECTION-001").status, "passed");
});

test("21. minimum/report/operation compatibility is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-PROJECTION-001").status, "passed");
  assert.match(check(report, "DRI-8-CERT-PROJECTION-001").expected, /presentation/);
});

test("22. No styling/geometry is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-PROJECTION-002").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-BOUNDARY-001").status, "passed");
});

test("23. No animation instructions are certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-PROJECTION-002").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-BOUNDARY-001").status, "passed");
});

test("24. Interaction vocabulary is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BRIDGE-001").status, "passed");
});

test("25. Interaction readiness enforcement is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BRIDGE-003").status, "passed");
});

test("26. Browser event isolation is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BRIDGE-002").status, "passed");
});

test("27. Runtime non-mutation is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-RUNTIME-001").status, "passed");
  assert.equal(certModule.mutatesRuntimeState, false);
});

test("28. Unsupported interaction handling is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BRIDGE-004").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-E2E-004").status, "passed");
});

test("29. Blocked interaction handling is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-003").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-RUNTIME-004").status, "passed");
});

test("30. Coordination roles are certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-COORD-001").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-COORD-002").status, "passed");
});

test("31. Minimal fan-out is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-COORD-003").status, "passed");
});

test("32. Preserved-surface behavior is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-COORD-003").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-E2E-002").status, "passed");
});

test("33. Partial coordination is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-COORD-004").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-E2E-005").status, "passed");
});

test("34. No-op coordination is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-COORD-004").status, "passed");
});

test("35. DRI-4 non-duplication is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BOUNDARY-002").status, "passed");
});

test("36. DRI-6 attention non-duplication is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BOUNDARY-003").status, "passed");
});

test("37. DRI-7 guidance non-duplication is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-BOUNDARY-003").status, "passed");
});

test("38. KPI/KOI/business logic absence is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-RUNTIME-002").status, "passed");
  assert.equal(check(report, "DRI-8-CERT-PROJECTION-003").status, "passed");
});

test("39. Framework independence is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-FRAMEWORK-001").status, "passed");
});

test("40. Immutability is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-IMMUTABILITY-001").status, "passed");
});

test("41. Determinism is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-DETERMINISM-001").status, "passed");
});

test("42. Registry integrity is certified", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-REGISTRY-001").status, "passed");
});

test("43. Canonical end-to-end fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-001").status, "passed");
});

test("44. Stage selection end-to-end fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-002").status, "passed");
});

test("45. Blocked interaction fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-003").status, "passed");
});

test("46. Unsupported interaction fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-004").status, "passed");
});

test("47. Partial-chain fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-005").status, "passed");
});

test("48. Empty-context fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-006").status, "passed");
});

test("49. Invalid-input handling fixture passes", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(check(report, "DRI-8-CERT-E2E-007").status, "passed");
});

test("50. Passed/failed counts derive correctly", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(
    report.summary.passedCheckCount + report.summary.failedCheckCount,
    report.summary.checkCount,
  );
  assert.equal(report.summary.checkCount, report.checks.length);
  assert.equal(report.summary.domainCount, domains.length);
});

test("51. Certification status derives from checks", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(report.summary.failedCheckCount, 0);
  assert.equal(report.certificationStatus, "certified");
  assert.equal(report.summary.certificationStatus, "certified");
});

test("52. Compatibility status derives from checks", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(report.compatibilityStatus, "compatible");
  assert.equal(getDirectorRuntimeConsumerAdapterCompatibility(), "compatible");
});

test("53. Certification artifact is immutable", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.ok(Object.isFrozen(report));
  assert.ok(Object.isFrozen(report.checks));
  assert.ok(Object.isFrozen(report.summary));
  assert.ok(Object.isFrozen(report.provenance));
  assert.throws(() => {
    // @ts-expect-error immutability
    report.certificationStatus = "not-certified";
  });
});

test("54. Certification itself is deterministic", () => {
  const a = certifyDirectorRuntimeConsumerAdapter();
  const b = certifyDirectorRuntimeConsumerAdapter();
  assert.deepEqual(a, b);
});

test("55. Verification returns success when all checks pass", () => {
  const verification = verifyDirectorRuntimeConsumerAdapterCertification();
  assert.equal(verification.ok, true);
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.compatibilityStatus, "compatible");
  assert.equal(verification.readiness, "ready-for-freeze");
  assert.equal(verification.noPrematureFreeze, true);
});

test("56. No new upstream behavior is introduced", () => {
  assert.equal(certModule.introducesConsumerBehavior, false);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(consumerContextBinding|experienceStateProjection|consumerInteractionBridge)["']/,
  );
  assert.ok(!source.includes("export function bindDirector"));
  assert.ok(!source.includes("export function projectDirector"));
  assert.ok(!source.includes("export function bridgeDirector"));
  assert.ok(!source.includes("export function coordinateDirector"));
});

test("57. No freeze lock is created prematurely", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(report.frozenDeclared, false);
  assert.equal(report.releasedDeclared, false);
  assert.equal(report.readyForConsumerDeclared, false);
  assert.equal(certModule.declaresFreeze, false);
  assert.equal(report.readiness, "ready-for-freeze");
  assert.equal(check(report, "DRI-8-CERT-RUNTIME-003").status, "passed");
});

test("58. DRI-8:6 behavior remains unchanged", () => {
  assert.equal(verifyDirectorRuntimeExperienceCoordinationPlatform().ok, true);
});

test("59. Guarantees and registry sections are inspectable", () => {
  const report = certifyDirectorRuntimeConsumerAdapter();
  assert.ok(report.guarantees.includes("ready-for-freeze"));
  assert.ok(report.guarantees.includes("full-chain-certified"));
  assert.equal(guarantees.length, registry.guaranteeCount);
  assert.equal(registrySections.length, registry.registrySectionCount);
  assert.equal(apiNames.length, registry.publicApiCount);
});

test("60. Upstream DRI-8/7/6/4 compatibility remains healthy", () => {
  assert.equal(verifyDirectorRuntimeExperienceCoordinationPlatform().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerInteractionBridge().ok, true);
  assert.equal(verifyDirectorRuntimeExperienceStateProjection().ok, true);
  assert.equal(verifyDirectorRuntimeExperienceSurfaceBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerContextBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerIntegrationFoundation().ok, true);
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePublicIndex().ok, true);
  assert.equal(verifyDirectorRuntimeAttentionFocusPublicIndex().ok === true, true);
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationPublicIndex(), true);
});
