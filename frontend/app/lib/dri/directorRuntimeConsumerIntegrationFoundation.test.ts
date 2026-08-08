import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS as bindingKinds,
  DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES as boundaryGuarantees,
  DIRECTOR_RUNTIME_CONSUMER_FAMILIES as consumerFamilies,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PRINCIPLE as principle,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS as interactionKinds,
  DIRECTOR_RUNTIME_COORDINATION_REASONS as coordinationReasons,
  DIRECTOR_RUNTIME_COORDINATION_SCOPES as coordinationScopes,
  DIRECTOR_RUNTIME_COORDINATION_VOCABULARY as coordinationVocabulary,
  DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS as projectionKinds,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES as surfaceCapabilities,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as surfaces,
  DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS as capabilityKinds,
  createDirectorRuntimeConsumer,
  createDirectorRuntimeConsumerBindingDescriptor,
  createDirectorRuntimeConsumerInteractionIntent,
  createDirectorRuntimeExperienceCoordinationDescriptor,
  createDirectorRuntimeExperienceProjection,
  directorRuntimeConsumerIntegrationFoundation as foundation,
  directorRuntimeConsumerIntegrationFoundationApiNames as apiNames,
  directorRuntimeConsumerIntegrationFoundationCanonicalIdentity as canonicalIdentity,
  directorRuntimeConsumerIntegrationFoundationRegistry as registry,
  getDirectorRuntimeConsumerIntegrationFoundationIdentity,
  getDirectorRuntimeExperienceSurfaceCapabilities,
  isDirectorRuntimeExperienceSurface,
  listDirectorRuntimeConsumerBindingKinds,
  listDirectorRuntimeConsumerInteractionKinds,
  listDirectorRuntimeExperienceProjectionKinds,
  listDirectorRuntimeExperienceSurfaces,
  verifyDirectorRuntimeConsumerIntegrationFoundation,
} from "./directorRuntimeConsumerIntegrationFoundation.ts";

import {
  directorRuntimeExecutiveGuidancePublicIndexIdentity,
  verifyDirectorRuntimeExecutiveGuidancePublicIndex,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";

const source = readFileSync(
  new URL("./directorRuntimeConsumerIntegrationFoundation.ts", import.meta.url),
  "utf8",
);

test("1. exact DRI-8:1 identity", () => {
  assert.equal(
    foundation.identity,
    "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
  );
  assert.equal(canonicalIdentity.identity, foundation.identity);
  assert.equal(foundation.phase, "DRI-8:1");
  assert.equal(foundation.name, "DirectorRuntimeConsumerIntegrationFoundation");
  assert.equal(foundation.layer, "DirectorRuntimeConsumerIntegration");
  assert.equal(foundation.role, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
  assert.deepEqual(
    getDirectorRuntimeConsumerIntegrationFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.1.0", () => {
  assert.equal(foundation.version, "8.1.0");
  assert.equal(canonicalIdentity.version, "8.1.0");
  assert.equal(registry.version, "8.1.0");
});

test("3. exact namespace", () => {
  assert.equal(
    foundation.namespace,
    "nexora.dri.consumer-integration.foundation",
  );
  assert.equal(canonicalIdentity.namespace, foundation.namespace);
  assert.equal(registry.namespace, foundation.namespace);
});

test("4. DRI-7:9 Public Index is the sole immediate upstream dependency", () => {
  assert.equal(
    foundation.upstreamDependency,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    directorRuntimeExecutiveGuidancePublicIndexIdentity,
  );
  assert.equal(registry.dependency, foundation.upstreamDependency);
  assert.equal(canonicalIdentity.upstream, foundation.upstreamDependency);
  assert.equal(foundation.executiveGuidanceBoundary, "DRI-7:9-public-index-only");
  assert.equal(boundary.soleImmediateDependency, "DRI-7:9");
  assert.equal(boundary.consumesPublicIndexOnly, true);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeExecutiveGuidance(?:Foundation|Contracts|Resolution|Composition|Delivery|Platform|AdapterCertification|Freeze)["']/,
  );
});

test("5. required six experience surfaces exist", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  assert.equal(surfaces.length, 6);
  assert.deepEqual([...listDirectorRuntimeExperienceSurfaces()], [...surfaces]);
});

test("6. surface identifiers are unique", () => {
  assert.equal(new Set(surfaces).size, surfaces.length);
  assert.equal(Object.isFrozen(surfaces), true);
  for (const surface of surfaces) {
    assert.equal(isDirectorRuntimeExperienceSurface(surface), true);
  }
  assert.equal(isDirectorRuntimeExperienceSurface("ExecutiveStage"), false);
  assert.equal(isDirectorRuntimeExperienceSurface("stage-panel"), false);
});

test("7. required binding kinds exist", () => {
  assert.deepEqual([...bindingKinds], [
    "context",
    "state",
    "scene",
    "presentation",
    "attention",
    "guidance",
    "interaction",
    "coordination",
  ]);
  assert.equal(bindingKinds.length, 8);
  assert.equal(new Set(bindingKinds).size, 8);
  assert.equal(Object.isFrozen(bindingKinds), true);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerBindingKinds()],
    [...bindingKinds],
  );
});

test("8. required projection kinds exist", () => {
  assert.deepEqual([...projectionKinds], [
    "identity",
    "context",
    "state",
    "scene",
    "focus",
    "visibility",
    "presentation",
    "attention",
    "guidance",
    "interaction",
  ]);
  assert.equal(projectionKinds.length, 10);
  assert.equal(new Set(projectionKinds).size, 10);
  assert.equal(Object.isFrozen(projectionKinds), true);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceProjectionKinds()],
    [...projectionKinds],
  );
});

test("9. required interaction intents exist", () => {
  assert.deepEqual([...interactionKinds], [
    "select",
    "focus",
    "activate",
    "hover",
    "navigate",
    "inspect",
    "dismiss",
  ]);
  assert.equal(interactionKinds.length, 7);
  assert.equal(new Set(interactionKinds).size, 7);
  assert.equal(Object.isFrozen(interactionKinds), true);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerInteractionKinds()],
    [...interactionKinds],
  );
});

test("10. capability definitions reference valid surfaces/capabilities", () => {
  assert.equal(
    Object.keys(surfaceCapabilities).length,
    surfaces.length,
  );
  for (const surface of surfaces) {
    const caps = getDirectorRuntimeExperienceSurfaceCapabilities(surface);
    assert.ok(caps.length > 0);
    assert.equal(Object.isFrozen(caps), true);
    assert.equal(new Set(caps).size, caps.length);
    for (const capability of caps) {
      assert.ok(
        (capabilityKinds as readonly string[]).includes(capability),
        `${surface} capability ${capability} must be known`,
      );
    }
  }
  assert.deepEqual([...surfaceCapabilities.stage], [
    "scene",
    "presentation",
    "attention",
    "interaction",
  ]);
  assert.deepEqual([...surfaceCapabilities.advisor], [
    "context",
    "guidance",
    "attention",
  ]);
  assert.deepEqual([...surfaceCapabilities.insight], [
    "context",
    "state",
    "guidance",
  ]);
});

test("11. coordination vocabulary is internally valid", () => {
  assert.deepEqual([...coordinationVocabulary], [
    "primary-surface",
    "supporting-surfaces",
    "affected-surfaces",
    "coordination-scope",
    "coordination-reason",
  ]);
  assert.equal(coordinationVocabulary.length, 5);
  assert.equal(new Set(coordinationVocabulary).size, 5);
  assert.deepEqual([...coordinationScopes], [
    "experience",
    "surface-set",
    "binding",
  ]);
  assert.deepEqual([...coordinationReasons], [
    "selection-changed",
    "focus-changed",
    "context-changed",
    "guidance-changed",
    "state-changed",
    "attention-changed",
  ]);
  const descriptor = createDirectorRuntimeExperienceCoordinationDescriptor({
    coordinationId: "coord.selection",
    primarySurface: "stage",
    supportingSurfaces: ["advisor", "insight"],
    affectedSurfaces: ["stage", "advisor", "insight", "live-lens"],
    coordinationScope: "experience",
    coordinationReason: "selection-changed",
  });
  assert.equal(Object.isFrozen(descriptor), true);
  assert.equal(Object.isFrozen(descriptor.supportingSurfaces), true);
  assert.equal(Object.isFrozen(descriptor.affectedSurfaces), true);
  assert.throws(() => {
    (descriptor.supportingSurfaces as string[]).push("explorer");
  });
});

test("12. boundary guarantees exist", () => {
  assert.equal(boundaryGuarantees.length, 10);
  assert.equal(new Set(boundaryGuarantees.map((g) => g.id)).size, 10);
  assert.deepEqual(
    boundaryGuarantees.map((entry) => entry.id),
    [
      "semantic-intent-owner",
      "rendering-owner",
      "framework-independent-runtime",
      "no-upstream-mutation",
      "immutable-projections",
      "no-ui-leakage",
      "no-react-dependency",
      "no-threejs-dependency",
      "no-dom-event-dependency",
      "approved-contract-coupling",
    ],
  );
  assert.equal(Object.isFrozen(boundaryGuarantees), true);
  assert.equal(boundary.mutatesUpstreamRuntime, false);
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(
    principle,
    "Director Runtime determines semantic experience intent. Consumer UI determines rendering implementation.",
  );
});

test("13. canonical collections cannot be mutated", () => {
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(consumerFamilies), true);
  assert.equal(Object.isFrozen(surfaces), true);
  assert.equal(Object.isFrozen(bindingKinds), true);
  assert.equal(Object.isFrozen(projectionKinds), true);
  assert.equal(Object.isFrozen(interactionKinds), true);
  assert.equal(Object.isFrozen(coordinationVocabulary), true);
  assert.equal(Object.isFrozen(surfaceCapabilities), true);
  assert.equal(Object.isFrozen(boundaryGuarantees), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.throws(() => {
    (surfaces as unknown as string[]).push("dashboard");
  });
  assert.throws(() => {
    (bindingKinds as unknown as string[]).push("style");
  });
  assert.throws(() => {
    (foundation as { version?: string }).version = "0.0.0";
  });

  const consumer = createDirectorRuntimeConsumer({
    consumerId: "executive.main",
    consumerFamily: "executive-experience",
  });
  assert.equal(Object.isFrozen(consumer), true);
  assert.throws(() => {
    (consumer as { consumerId?: string }).consumerId = "mutated";
  });

  const projection = createDirectorRuntimeExperienceProjection({
    projectionId: "proj.focus",
    projectionKind: "focus",
    surface: "stage",
    subjectId: "factory",
    attributes: { dominance: "high" },
  });
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.attributes), true);
  assert.throws(() => {
    (projection as { subjectId?: string }).subjectId = "mutated";
  });

  const binding = createDirectorRuntimeConsumerBindingDescriptor({
    bindingId: "bind.scene",
    bindingKind: "scene",
    surface: "stage",
    consumerId: "executive.main",
  });
  assert.equal(Object.isFrozen(binding), true);

  const intent = createDirectorRuntimeConsumerInteractionIntent({
    intentId: "intent.select",
    interactionKind: "select",
    surface: "stage",
    subjectId: "factory",
  });
  assert.equal(Object.isFrozen(intent), true);
});

test("14. registry counts are derived correctly", () => {
  assert.equal(registry.consumerFamilyCount, consumerFamilies.length);
  assert.equal(registry.surfaceCount, surfaces.length);
  assert.equal(registry.bindingKindCount, bindingKinds.length);
  assert.equal(registry.projectionKindCount, projectionKinds.length);
  assert.equal(registry.interactionKindCount, interactionKinds.length);
  assert.equal(
    registry.coordinationVocabularyCount,
    coordinationVocabulary.length,
  );
  assert.equal(registry.surfaceCapabilityRegistryCount, surfaces.length);
  assert.equal(registry.boundaryGuaranteeCount, boundaryGuarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.deepEqual([...registrySections], [
    "identity",
    "consumer",
    "surfaces",
    "bindings",
    "projections",
    "interactions",
    "coordination",
    "capabilities",
    "boundary-guarantees",
  ]);
  assert.equal(registrySections.length, 9);
});

test("15. verification is deterministic", () => {
  const first = verifyDirectorRuntimeConsumerIntegrationFoundation();
  const second = verifyDirectorRuntimeConsumerIntegrationFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.identity, foundation.identity);
  assert.equal(first.version, "8.1.0");
  assert.equal(first.consumerFamilyCount, 1);
  assert.equal(first.surfaceCount, 6);
  assert.equal(first.bindingKindCount, 8);
  assert.equal(first.projectionKindCount, 10);
  assert.equal(first.interactionKindCount, 7);
  assert.equal(first.coordinationVocabularyCount, 5);
  assert.equal(first.surfaceCapabilityRegistryCount, 6);
  assert.equal(first.boundaryGuaranteeCount, 10);
  assert.equal(first.registrySectionCount, 9);
  assert.equal(first.publicApiCount, apiNames.length);
  assert.equal(first.frozen, true);
  assert.equal(first.dri7BoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.capabilitiesValid, true);
  assert.equal(first.coordinationValid, true);
  assert.equal(
    foundation.architecturalStatus,
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForConsumerContextBinding",
  );
});

test("16. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect|createContext)\b/);
  assert.doesNotMatch(source, /\b(?:jsx|tsx)\s*[:=]/);
});

test("17. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material|Vector3)\b/);
});

test("18. no DOM event dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:MouseEvent|PointerEvent|KeyboardEvent|TouchEvent|FocusEvent|UIEvent|EventTarget|addEventListener|onClick|onHover|onMouseDown)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest|navigator)\b/,
  );
});

test("19. no UI component dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens|TimelinePanel|ExplorerPanel)\b/,
  );
  assert.doesNotMatch(source, /\.(?:module\.css|css)["']/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("20. upstream DRI behavior remains unchanged", () => {
  const publicIndex = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    publicIndex.identity,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
  assert.equal(publicIndex.version, "7.9.0");
  assert.equal(
    directorRuntimeExecutiveGuidancePublicIndexIdentity,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
  const dri7Foundation = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(dri7Foundation.ok, true);
  assert.equal(
    dri7Foundation.identity,
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
  );
  assert.doesNotMatch(
    source,
    /verifyDirectorRuntimeExecutiveGuidance(?:Foundation|Platform|PublicIndex|Freeze)/,
  );
});

test("21. consumer family vocabulary supports executive-experience", () => {
  assert.deepEqual([...consumerFamilies], ["executive-experience"]);
  assert.equal(consumerFamilies.length, 1);
  const consumer = createDirectorRuntimeConsumer({
    consumerId: "nexora.executive",
    consumerFamily: "executive-experience",
  });
  assert.equal(consumer.consumerFamily, "executive-experience");
});

test("22. constructors do not mutate caller input", () => {
  const mutableProjection = {
    projectionId: "proj.1",
    projectionKind: "attention" as const,
    surface: "advisor" as const,
    subjectId: "kpi-production",
    attributes: { target: "KPI-Production" } as Record<string, string>,
  };
  const snap = JSON.stringify(mutableProjection);
  createDirectorRuntimeExperienceProjection(mutableProjection);
  assert.equal(JSON.stringify(mutableProjection), snap);
  mutableProjection.attributes.target = "mutated";
  assert.equal(mutableProjection.attributes.target, "mutated");

  const mutableCoordination = {
    coordinationId: "coord.1",
    primarySurface: "stage" as const,
    supportingSurfaces: ["advisor", "insight"] as Array<
      "advisor" | "insight" | "explorer"
    >,
    affectedSurfaces: ["stage", "advisor"] as Array<"stage" | "advisor" | "timeline">,
    coordinationScope: "experience" as const,
    coordinationReason: "focus-changed" as const,
  };
  const coordSnap = JSON.stringify(mutableCoordination);
  createDirectorRuntimeExperienceCoordinationDescriptor(mutableCoordination);
  assert.equal(JSON.stringify(mutableCoordination), coordSnap);
  mutableCoordination.supportingSurfaces.push("explorer");
  assert.equal(mutableCoordination.supportingSurfaces.length, 3);
});
