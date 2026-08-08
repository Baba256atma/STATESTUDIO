import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES,
  bindDirectorRuntimeConsumerContext,
  bridgeDirectorRuntimeConsumerInteraction,
  coordinateDirectorRuntimeExperience,
  directorRuntimeConsumerIntegrationConsumerInformation,
  directorRuntimeConsumerIntegrationConsumerImportPath,
  directorRuntimeConsumerIntegrationConsumerReadiness,
  directorRuntimeConsumerIntegrationConsumerRole,
  directorRuntimeConsumerIntegrationPublicApis,
  directorRuntimeConsumerIntegrationPublicIndex,
  directorRuntimeConsumerIntegrationPublicIndexCanonicalIdentity,
  directorRuntimeConsumerIntegrationPublicIndexIdentity,
  directorRuntimeConsumerIntegrationPublicIndexNamespace,
  directorRuntimeConsumerIntegrationPublicIndexRegistry,
  directorRuntimeConsumerIntegrationPublicIndexUpstream,
  directorRuntimeConsumerIntegrationPublicIndexVersion,
  directorRuntimeConsumerIntegrationReleaseInformation,
  directorRuntimeConsumerIntegrationReleaseStatus,
  directorRuntimeConsumerIntegrationStability,
  listDirectorRuntimeExperienceCoordinationStatuses,
  listDirectorRuntimeExperiencePresentationStates,
  listDirectorRuntimeExperienceSurfaceRoles,
  listDirectorRuntimeExperienceSurfaces,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeConsumerIntegrationRelease,
  verifyDirectorRuntimeConsumerIntegrationPublicIndex,
} from "./directorRuntimeConsumerIntegrationPublicIndex.ts";

import {
  bindDirectorRuntimeConsumerContext as freezeBindContext,
  bridgeDirectorRuntimeConsumerInteraction as freezeBridge,
  coordinateDirectorRuntimeExperience as freezeCoordinate,
  projectDirectorRuntimeExperienceState as freezeProject,
  verifyDirectorRuntimeConsumerIntegrationFreeze,
} from "./directorRuntimeConsumerIntegrationFreeze.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = readFileSync(
  join(__dirname, "directorRuntimeConsumerIntegrationPublicIndex.ts"),
  "utf8",
);

test("1. Exact identity", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexIdentity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexCanonicalIdentity.identity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("2. Exact version 8.9.0", () => {
  assert.equal(directorRuntimeConsumerIntegrationPublicIndexVersion, "8.9.0");
});

test("3. Exact namespace", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexNamespace,
    "nexora.dri.consumer-integration.public-index",
  );
});

test("4. DRI-8:8 is the sole immediate dependency", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexUpstream,
    "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  );
  const driImports = [...source.matchAll(/from\s+["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("@/") || value.startsWith("./"));
  assert.deepEqual(driImports, [
    "@/app/lib/dri/directorRuntimeConsumerIntegrationFreeze",
  ]);
});

test("5. Exact supported import path", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerImportPath,
    "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("6. Consumer role is SoleConsumerEntryPoint", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerRole,
    "SoleConsumerEntryPoint",
  );
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.role,
    "SoleConsumerEntryPoint",
  );
});

test("7. Upstream certification is Certified", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.certificationStatus,
    "Certified",
  );
});

test("8. Upstream compatibility is Compatible", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.compatibilityStatus,
    "Compatible",
  );
});

test("9. Upstream freeze is Frozen", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.freezeStatus,
    "Frozen",
  );
});

test("10. Upstream lock is Locked", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.lockStatus,
    "Locked",
  );
});

test("11. Exact lock value is preserved", () => {
  assert.equal(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
    "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.lock,
    "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED",
  );
});

test("12. Upstream stability is Stable", () => {
  assert.equal(directorRuntimeConsumerIntegrationStability, "Stable");
});

test("13. Upstream readiness is ReadyForPublicIndex", () => {
  const freeze = verifyDirectorRuntimeConsumerIntegrationFreeze();
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.ok, true);
});

test("14. Release status is Released", () => {
  assert.equal(directorRuntimeConsumerIntegrationReleaseStatus, "Released");
});

test("15. Consumer readiness is ReadyForConsumer", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerReadiness,
    "ReadyForConsumer",
  );
});

test("16. Exactly nine namespace sections exist", () => {
  assert.equal(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length,
    9,
  );
});

test("17. Namespace section order is canonical", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS],
    [
      "Identity",
      "PublicTypes",
      "PublicAPIs",
      "Validation",
      "Certification",
      "ReleaseInformation",
      "Compatibility",
      "Registry",
      "ConsumerInformation",
    ],
  );
});

test("18. Public export manifest contains unique names", () => {
  const names = DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST.map(
    (entry) => entry.exportName,
  );
  assert.equal(new Set(names).size, names.length);
});

test("19. All public exports are approved frozen exports", () => {
  const approved = new Set(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.map(
      (entry) => entry.exportName,
    ),
  );
  for (const entry of DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST) {
    assert.ok(approved.has(entry.exportName));
    assert.equal(entry.approvedFrozenStatus, "approved-frozen");
    assert.equal(entry.publicStatus, "public");
  }
});

test("20. No internal-only export leaks", () => {
  for (const entry of DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST) {
    assert.notEqual(entry.publicStatus, "internal");
    assert.doesNotMatch(entry.exportName, /^_/);
    assert.doesNotMatch(entry.exportName, /Helper|Internal|Private/);
  }
});

test("21. Public functional APIs reference frozen implementations directly", () => {
  assert.equal(bindDirectorRuntimeConsumerContext, freezeBindContext);
  assert.equal(projectDirectorRuntimeExperienceState, freezeProject);
  assert.equal(bridgeDirectorRuntimeConsumerInteraction, freezeBridge);
  assert.equal(coordinateDirectorRuntimeExperience, freezeCoordinate);
  assert.equal(
    directorRuntimeConsumerIntegrationPublicApis.bindDirectorRuntimeConsumerContext,
    freezeBindContext,
  );
});

test("22. Public type surface remains compatible", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.includes(
      "DirectorRuntimeConsumerContext",
    ),
  );
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.includes(
      "DirectorRuntimeExperienceCoordinationResult",
    ),
  );
  assert.equal(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    directorRuntimeConsumerIntegrationPublicIndexRegistry.publicTypeCount,
  );
});

test("23. Six canonical surfaces are preserved", () => {
  assert.equal(DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES.length, 6);
  assert.deepEqual([...listDirectorRuntimeExperienceSurfaces()], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
});

test("24. Canonical surface order is preserved", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
    ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
  );
});

test("25. Interaction vocabulary is preserved", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS],
    ["select", "focus", "activate", "hover", "navigate", "inspect", "dismiss"],
  );
});

test("26. Presentation vocabulary is preserved", () => {
  assert.deepEqual(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );
  assert.deepEqual([...listDirectorRuntimeExperiencePresentationStates()], [
    "minimum",
    "report",
    "operation",
  ]);
});

test("27. Coordination vocabulary is preserved", () => {
  const statuses = listDirectorRuntimeExperienceCoordinationStatuses();
  const roles = listDirectorRuntimeExperienceSurfaceRoles();
  for (const value of [
    "primary",
    "supporting",
    "background",
    "preserved",
    "inactive",
  ]) {
    assert.ok(
      roles.includes(value as (typeof roles)[number]) ||
        statuses.includes(value as (typeof statuses)[number]),
      value,
    );
  }
});

test("28. Selection/focus distinction is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "selection-focus-distinct",
    ),
  );
});

test("29. Subject identity guarantee is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "identity-preserving",
    ),
  );
});

test("30. Minimal fan-out guarantee is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "minimal-fan-out",
    ),
  );
});

test("31. Preserved-surface guarantee is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "preserve-unaffected-surfaces",
    ),
  );
});

test("32. Framework independence is preserved", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerInformation.frameworkIndependence,
    true,
  );
});

test("33. Browser event isolation is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "browser-event-independent",
    ),
  );
  assert.doesNotMatch(source, /\b(MouseEvent|PointerEvent|KeyboardEvent)\b/);
});

test("34. Rendering isolation is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "rendering-independent",
    ),
  );
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material)\b/);
});

test("35. Runtime non-mutation guarantee is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "Runtime-non-mutating",
    ),
  );
});

test("36. Business/KPI/KOI isolation is preserved", () => {
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "business-logic-independent",
    ),
  );
  assert.doesNotMatch(source, /\b(?:calculateKpi|calculateKoi|openai|anthropic)\b/i);
});

test("37. Consumer import policy prohibits direct DRI-8 internal consumption", () => {
  assert.equal(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS.length,
    8,
  );
  assert.ok(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS.includes(
      "@/app/lib/dri/directorRuntimeConsumerIntegrationFreeze",
    ),
  );
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerInformation.internalImportsProhibited,
    true,
  );
});

test("38. Public Index object is immutable", () => {
  assert.ok(Object.isFrozen(directorRuntimeConsumerIntegrationPublicIndex));
  assert.throws(() => {
    // @ts-expect-error immutability probe
    directorRuntimeConsumerIntegrationPublicIndex.releaseStatus = "NotReleased";
  });
});

test("39. Export manifest is immutable", () => {
  assert.ok(
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST),
  );
});

test("40. Registry is immutable", () => {
  assert.ok(
    Object.isFrozen(directorRuntimeConsumerIntegrationPublicIndexRegistry),
  );
});

test("41. Consumer metadata is immutable", () => {
  assert.ok(
    Object.isFrozen(directorRuntimeConsumerIntegrationConsumerInformation),
  );
});

test("42. Release information is immutable", () => {
  assert.ok(
    Object.isFrozen(directorRuntimeConsumerIntegrationReleaseInformation),
  );
});

test("43. Verification is deterministic", () => {
  const a = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  const b = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.deepEqual(a, b);
});

test("44. Registry counts are dynamically derived", () => {
  const registry = directorRuntimeConsumerIntegrationPublicIndexRegistry;
  assert.equal(
    registry.namespaceSectionCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length,
  );
  assert.equal(
    registry.publicExportCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST.length,
  );
  assert.equal(
    registry.consumerGuaranteeCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.length,
  );
});

test("45. Public API count is dynamically derived", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexRegistry.publicApiCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES.length,
  );
});

test("46. Public type count is dynamically derived", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexRegistry.publicTypeCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
  );
});

test("47. Export count is dynamically derived", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexRegistry.approvedFrozenExportCount,
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
  );
});

test("48. Verification returns ok: true", () => {
  const verification = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.equal(verification.ok, true);
});

test("49. No React dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']react-dom["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect|createContext)\b/);
});

test("50. No Next.js UI dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']next(\/|["'])/);
  assert.doesNotMatch(source, /\/app\/executive\//);
  assert.doesNotMatch(source, /\/components\//);
});

test("51. No Three.js dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
});

test("52. No DOM/browser dependency", () => {
  assert.doesNotMatch(source, /\b(document|window|localStorage|HTMLElement)\b/);
});

test("53. No UI component dependency", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/(components|ui|executive)\//);
});

test("54. No new runtime behavior is introduced", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.noNewRuntimeBehavior,
    true,
  );
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.publicationOnly,
    true,
  );
  assert.doesNotMatch(
    source,
    /export function (bind|project|bridge|coordinate)DirectorRuntime/,
  );
});

test("55. No new business logic is introduced", () => {
  assert.doesNotMatch(source, /\b(?:kpiScore|koiScore|decisionScore)\b/i);
});

test("56. DRI-8:8 behavior remains unchanged", () => {
  const freeze = verifyDirectorRuntimeConsumerIntegrationFreeze();
  assert.equal(freeze.ok, true);
  assert.equal(
    freeze.identity,
    "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  );
});

test("57. Release failure derives NotReleased / NotReadyForConsumer", () => {
  const failed = resolveDirectorRuntimeConsumerIntegrationRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "NotReleased");
  assert.equal(failed.consumerReadiness, "NotReadyForConsumer");
  assert.equal(failed.gatePassed, false);
});

test("58. Validation API count is inspectable", () => {
  assert.equal(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES.length,
    directorRuntimeConsumerIntegrationPublicIndexRegistry.validationApiCount,
  );
});

test("59. Supported consumer family is executive-experience", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationConsumerInformation.supportedConsumerFamily,
    "executive-experience",
  );
});

test("60. Final lifecycle state is complete", () => {
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndex.architecturalStatus,
    "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer",
  );
});
