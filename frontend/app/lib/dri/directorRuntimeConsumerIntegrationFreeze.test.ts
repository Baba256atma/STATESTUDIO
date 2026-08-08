import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS as approvedExports,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS as invariantIds,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_STATUSES as freezeStatuses,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES as exportCategories,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_LOCK_STATUSES as lockStatuses,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK as platformLock,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_READINESS as readinessStatuses,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_STABILITY_STATUSES as stabilityStatuses,
  freezeDirectorRuntimeConsumerIntegration,
  directorRuntimeConsumerIntegrationFreeze as freezeModule,
  directorRuntimeConsumerIntegrationFreezeApiNames as apiNames,
  directorRuntimeConsumerIntegrationFreezeCanonicalIdentity as canonicalIdentity,
  directorRuntimeConsumerIntegrationFreezeRegistry as registry,
  directorRuntimeConsumerIntegrationFreezeResult as canonicalResult,
  getDirectorRuntimeConsumerIntegrationApprovedFrozenExports,
  getDirectorRuntimeConsumerIntegrationFreezeIdentity,
  getDirectorRuntimeConsumerIntegrationPlatformLock,
  listDirectorRuntimeConsumerIntegrationFreezeInvariants,
  verifyDirectorRuntimeConsumerIntegrationFreeze,
} from "./directorRuntimeConsumerIntegrationFreeze.ts";

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  certifyDirectorRuntimeConsumerAdapter,
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
  new URL("./directorRuntimeConsumerIntegrationFreeze.ts", import.meta.url),
  "utf8",
);

test("1. exact identity", () => {
  assert.equal(
    freezeModule.identity,
    "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  );
  assert.equal(canonicalIdentity.identity, freezeModule.identity);
  assert.equal(freezeModule.phase, "DRI-8:8");
  assert.equal(freezeModule.role, "CertificationAndFreeze");
  assert.deepEqual(
    getDirectorRuntimeConsumerIntegrationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.8.0", () => {
  assert.equal(freezeModule.version, "8.8.0");
  assert.equal(canonicalIdentity.version, "8.8.0");
  assert.equal(registry.version, "8.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    freezeModule.namespace,
    "nexora.dri.consumer-integration.freeze",
  );
});

test("4. DRI-8:7 is the sole immediate dependency", () => {
  assert.equal(
    freezeModule.upstreamDependency,
    "DRI-8:7/DirectorRuntimeConsumerAdapterCertification",
  );
  assert.equal(
    freezeModule.adapterCertificationBoundary,
    "DRI-8:7-consumer-adapter-certification-only",
  );
  // Lifecycle import must remain solely DRI-8:7.
  const lifecycleImport = source.match(
    /^import\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']/m,
  );
  assert.ok(lifecycleImport);
  assert.equal(
    lifecycleImport[1],
    "@/app/lib/dri/directorRuntimeConsumerAdapterCertification",
  );
  // Publication re-exports may additionally surface approved frozen sources.
  const driImports = [...source.matchAll(/from\s+["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("@/") || value.startsWith("./"));
  const allowedPublicationPaths = new Set([
    "@/app/lib/dri/directorRuntimeConsumerAdapterCertification",
    "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation",
    "@/app/lib/dri/directorRuntimeConsumerContextBinding",
    "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding",
    "@/app/lib/dri/directorRuntimeExperienceStateProjection",
    "@/app/lib/dri/directorRuntimeConsumerInteractionBridge",
    "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform",
  ]);
  for (const path of driImports) {
    assert.ok(
      allowedPublicationPaths.has(path),
      `unexpected DRI import path: ${path}`,
    );
  }
});

test("5. Certification must be certified before successful freeze", () => {
  assert.equal(canonicalResult.certificationStatus, "certified");
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceNotCertified: true,
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.equal(failed.certificationStatus, "not-certified");
});

test("6. Compatibility must be compatible before successful freeze", () => {
  assert.equal(canonicalResult.compatibilityStatus, "compatible");
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceIncompatible: true,
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.equal(failed.compatibilityStatus, "incompatible");
});

test("7. Exact canonical platform lock is correct", () => {
  assert.equal(platformLock, "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED");
  assert.equal(
    getDirectorRuntimeConsumerIntegrationPlatformLock(),
    "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(canonicalResult.lock, platformLock);
});

test("8. Freeze status vocabulary is canonical", () => {
  assert.deepEqual([...freezeStatuses], ["frozen", "not-frozen"]);
});

test("9. Lock status vocabulary is canonical", () => {
  assert.deepEqual([...lockStatuses], ["locked", "unlocked"]);
});

test("10. Stability vocabulary is canonical", () => {
  assert.deepEqual([...stabilityStatuses], ["stable", "unstable"]);
});

test("11. Public-index readiness vocabulary is canonical", () => {
  assert.deepEqual([...readinessStatuses], [
    "ReadyForPublicIndex",
    "NotReadyForPublicIndex",
  ]);
});

test("12. Freeze invariants have unique IDs", () => {
  assert.equal(new Set(invariantIds).size, invariantIds.length);
  assert.deepEqual(
    invariants.map((entry) => entry.id),
    [...invariantIds],
  );
});

test("13. All required invariant categories are present", () => {
  const categories = new Set<string>(
    invariants.map((entry) => entry.category),
  );
  for (const required of [
    "dependency",
    "surfaces",
    "boundary",
    "context-binding",
    "surface-binding",
    "state-projection",
    "interaction-bridge",
    "coordination",
    "semantic-integrity",
    "framework-independence",
    "runtime-safety",
    "ownership",
    "business-isolation",
    "determinism",
    "immutability",
  ]) {
    assert.ok(categories.has(required), required);
  }
});

test("14. Six canonical surfaces are frozen", () => {
  assert.equal(registry.surfaceCount, 6);
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
    ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
  );
});

test("15. Canonical surface order is frozen", () => {
  assert.deepEqual([...registry.surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
});

test("16. Context-binding contract is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-004",
  );
  assert.equal(entry?.status, "passed");
});

test("17. Surface-binding contract is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-005",
  );
  assert.equal(entry?.status, "passed");
});

test("18. State-projection contract is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-006",
  );
  assert.equal(entry?.status, "passed");
});

test("19. Interaction vocabulary is frozen", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS],
    ["select", "focus", "activate", "hover", "navigate", "inspect", "dismiss"],
  );
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-007",
  );
  assert.equal(entry?.status, "passed");
});

test("20. Coordination vocabulary is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-008",
  );
  assert.equal(entry?.status, "passed");
});

test("21. minimum/report/operation compatibility is preserved", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );
});

test("22. Selection/focus distinction is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-009",
  );
  assert.equal(entry?.status, "passed");
});

test("23. Subject identity-preservation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-010",
  );
  assert.equal(entry?.status, "passed");
});

test("24. Minimal-fan-out guarantee is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-011",
  );
  assert.equal(entry?.status, "passed");
});

test("25. Preserved-surface guarantee is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-012",
  );
  assert.equal(entry?.status, "passed");
});

test("26. Browser-event isolation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-013",
  );
  assert.equal(entry?.status, "passed");
});

test("27. Framework independence is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-014",
  );
  assert.equal(entry?.status, "passed");
});

test("28. Rendering isolation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-015",
  );
  assert.equal(entry?.status, "passed");
});

test("29. Styling/geometry/animation isolation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-015",
  );
  assert.equal(entry?.status, "passed");
});

test("30. Runtime non-mutation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-016",
  );
  assert.equal(entry?.status, "passed");
  assert.equal(freezeModule.mutatesRuntimeState, false);
});

test("31. DRI-4 ownership boundary is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-017",
  );
  assert.equal(entry?.status, "passed");
});

test("32. DRI-6 ownership boundary is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-018",
  );
  assert.equal(entry?.status, "passed");
});

test("33. DRI-7 ownership boundary is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-019",
  );
  assert.equal(entry?.status, "passed");
});

test("34. KPI/KOI/business isolation is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-020",
  );
  assert.equal(entry?.status, "passed");
});

test("35. Determinism guarantee is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-021",
  );
  assert.equal(entry?.status, "passed");
});

test("36. Immutability guarantee is frozen", () => {
  const entry = canonicalResult.invariants.find(
    (item) => item.id === "DRI-8-FREEZE-INVARIANT-022",
  );
  assert.equal(entry?.status, "passed");
});

test("37. Approved frozen export names are unique", () => {
  const names = approvedExports.map((entry) => entry.exportName);
  assert.equal(new Set(names).size, names.length);
});

test("38. Approved frozen export categories are valid", () => {
  const valid = new Set<string>(exportCategories);
  for (const entry of approvedExports) {
    assert.ok(valid.has(entry.category), entry.category);
  }
});

test("39. Approved frozen exports reference valid upstream sources", () => {
  const sources = new Set([
    ...registry.chain.map((entry) => entry.identity),
    "DRI-8:7/DirectorRuntimeConsumerAdapterCertification",
    "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  ]);
  for (const entry of approvedExports) {
    assert.ok(sources.has(entry.sourceIdentity), entry.sourceIdentity);
    assert.equal(entry.approvalStatus, "approved");
  }
});

test("40. Export ordering is deterministic", () => {
  assert.deepEqual(
    getDirectorRuntimeConsumerIntegrationApprovedFrozenExports(),
    approvedExports,
  );
  assert.deepEqual(
    freezeDirectorRuntimeConsumerIntegration().approvedFrozenExports,
    approvedExports,
  );
});

test("41. Failed certification prevents successful freeze", () => {
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceNotCertified: true,
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.equal(failed.lockStatus, "unlocked");
});

test("42. Failed compatibility prevents successful freeze", () => {
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceIncompatible: true,
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.equal(failed.lock, "none");
});

test("43. Failed invariant prevents successful freeze", () => {
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceFailedInvariantId: "DRI-8-FREEZE-INVARIANT-011",
  });
  assert.equal(failed.freezeStatus, "not-frozen");
  assert.ok(failed.failedInvariantCount >= 1);
});

test("44. Failed freeze does not activate lock", () => {
  const failed = freezeDirectorRuntimeConsumerIntegration({
    forceNotCertified: true,
  });
  assert.equal(failed.lockStatus, "unlocked");
  assert.equal(failed.lock, "none");
});

test("45. Successful freeze reports frozen", () => {
  assert.equal(canonicalResult.freezeStatus, "frozen");
});

test("46. Successful freeze reports locked", () => {
  assert.equal(canonicalResult.lockStatus, "locked");
});

test("47. Successful freeze reports stable", () => {
  assert.equal(canonicalResult.stability, "stable");
});

test("48. Successful freeze reports ReadyForPublicIndex", () => {
  assert.equal(canonicalResult.readiness, "ReadyForPublicIndex");
  assert.equal(freezeModule.readiness, "ReadyForPublicIndex");
});

test("49. Successful freeze does NOT report Released", () => {
  assert.equal(canonicalResult.releasedDeclared, false);
  assert.equal(freezeModule.noRelease, true);
  assert.doesNotMatch(source, /releaseStatus:\s*["']Released["']/);
});

test("50. Successful freeze does NOT report ReadyForConsumer", () => {
  assert.equal(canonicalResult.readyForConsumerDeclared, false);
  assert.equal(freezeModule.noRelease, true);
  assert.doesNotMatch(source, /readyForConsumerDeclared:\s*true/);
  assert.doesNotMatch(source, /consumerReadiness:\s*["']ReadyForConsumer["']/);
});

test("51. Freeze result is deterministic", () => {
  const a = freezeDirectorRuntimeConsumerIntegration();
  const b = freezeDirectorRuntimeConsumerIntegration();
  assert.deepEqual(a, b);
  assert.deepEqual(a, canonicalResult);
});

test("52. Freeze result is immutable", () => {
  assert.ok(Object.isFrozen(canonicalResult));
  assert.ok(Object.isFrozen(canonicalResult.invariants));
  assert.throws(() => {
    // @ts-expect-error immutability
    canonicalResult.freezeStatus = "not-frozen";
  });
});

test("53. Invariant registry is immutable", () => {
  assert.ok(Object.isFrozen(invariants));
  assert.ok(Object.isFrozen(listDirectorRuntimeConsumerIntegrationFreezeInvariants()));
});

test("54. Export manifest is immutable", () => {
  assert.ok(Object.isFrozen(approvedExports));
  for (const entry of approvedExports) {
    assert.ok(Object.isFrozen(entry));
  }
});

test("55. Registry counts are dynamically derived", () => {
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.surfaceCount, registry.surfaces.length);
  assert.equal(
    registry.interactionKindCount,
    registry.interactionKinds.length,
  );
});

test("56. Provenance is deterministic", () => {
  const a = freezeDirectorRuntimeConsumerIntegration();
  const b = freezeDirectorRuntimeConsumerIntegration();
  assert.deepEqual(a.provenance, b.provenance);
  assert.equal(
    a.provenance.sourceCertificationIdentity,
    "DRI-8:7/DirectorRuntimeConsumerAdapterCertification",
  );
  assert.equal(
    a.provenance.freezeIdentity,
    "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  );
  assert.equal(
    a.provenance.lockedPlatformIdentity,
    "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED",
  );
});

test("57. Verification returns ok: true", () => {
  const verification = verifyDirectorRuntimeConsumerIntegrationFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.lockStatus, "locked");
  assert.equal(verification.readiness, "ReadyForPublicIndex");
});

test("58. No React dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']react-dom["']/);
});

test("59. No Next.js dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']next(\/|["'])/);
});

test("60. No Three.js dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
});

test("61. No DOM/browser dependency", () => {
  assert.doesNotMatch(source, /\b(document|window|localStorage|HTMLElement)\b/);
  assert.doesNotMatch(source, /\b(MouseEvent|PointerEvent|KeyboardEvent)\b/);
});

test("62. No new adapter behavior is introduced", () => {
  assert.equal(freezeModule.introducesConsumerBehavior, false);
  assert.equal(freezeModule.certifiesAndFreezesOnly, true);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(consumerContextBinding|experienceStateProjection|consumerInteractionBridge|experienceCoordinationPlatform)["']/,
  );
});

test("63. No Public Index is created prematurely", () => {
  assert.equal(freezeModule.noPublicIndex, true);
  assert.equal(freezeModule.noSoleConsumerEntryPoint, true);
  assert.equal(canonicalResult.soleConsumerEntryPointDeclared, false);
  assert.doesNotMatch(
    source,
    /soleConsumerEntryPointDeclared:\s*true/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*directorRuntimeConsumerIntegrationPublicIndex["']/,
  );
  assert.doesNotMatch(source, /export function createDirectorRuntimeConsumerIntegrationPublicIndex/);
});

test("64. DRI-8:7 certification behavior remains unchanged", () => {
  assert.equal(verifyDirectorRuntimeConsumerAdapterCertification().ok, true);
  const certification = certifyDirectorRuntimeConsumerAdapter();
  assert.equal(certification.certificationStatus, "certified");
  assert.equal(certification.compatibilityStatus, "compatible");
  assert.equal(certification.readiness, "ready-for-freeze");
  assert.equal(certification.frozenDeclared, false);
});

test("65. Upstream DRI chain and relevant public indexes remain healthy", () => {
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
