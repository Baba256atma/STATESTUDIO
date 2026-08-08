import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS as diagnosticKinds,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES as bridgeStatuses,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS as interactionKinds,
  DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS as interactionReasons,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as surfaces,
  DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS as targetRequirements,
  DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS as intentMappings,
  DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX as capabilityMatrix,
  bridgeDirectorRuntimeConsumerInteraction,
  directorRuntimeConsumerInteractionBridge as bridgeModule,
  directorRuntimeConsumerInteractionBridgeApiNames as apiNames,
  directorRuntimeConsumerInteractionBridgeCanonicalIdentity as canonicalIdentity,
  directorRuntimeConsumerInteractionBridgeRegistry as registry,
  getDirectorRuntimeConsumerInteractionBridgeIdentity,
  getDirectorRuntimeSurfaceInteractionCapabilities,
  isDirectorRuntimeConsumerInteractionSupported,
  listDirectorRuntimeConsumerInteractionBridgeStatuses,
  listDirectorRuntimeConsumerInteractionKinds,
  resolveDirectorRuntimeConsumerInteractionIntent,
  verifyDirectorRuntimeConsumerInteractionBridge,
  type DirectorRuntimeConsumerInteraction,
  type DirectorRuntimeConsumerInteractionBridgeInput,
} from "./directorRuntimeConsumerInteractionBridge.ts";

import { bindDirectorRuntimeConsumerContext } from
  "@/app/lib/dri/directorRuntimeConsumerContextBinding";
import { bindDirectorRuntimeExperienceSurfaces } from
  "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";
import {
  projectDirectorRuntimeExperienceState,
  type DirectorRuntimeExperienceStateProjectionResult,
  verifyDirectorRuntimeExperienceStateProjection,
} from "@/app/lib/dri/directorRuntimeExperienceStateProjection";
import { verifyDirectorRuntimeExperienceSurfaceBinding } from
  "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";
import { verifyDirectorRuntimeConsumerContextBinding } from
  "@/app/lib/dri/directorRuntimeConsumerContextBinding";
import { verifyDirectorRuntimeConsumerIntegrationFoundation } from
  "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";
import { verifyDirectorRuntimeExecutiveGuidancePublicIndex } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";
import { verifyDirectorRuntimeInteractionOrchestrationPublicIndex } from
  "@/app/lib/dri/directorRuntimeInteractionOrchestrationPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeConsumerInteractionBridge.ts", import.meta.url),
  "utf8",
);

const consumer = {
  consumerId: "executive.main",
  consumerFamily: "executive-experience" as const,
};

function fullExperienceState(): DirectorRuntimeExperienceStateProjectionResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.full",
    consumer,
    scope: "workspace",
    mode: "execution",
    activeSubject: { kind: "object", id: "factory", label: "Factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production" },
    activeGoal: { kind: "goal", id: "increase-capacity" },
    activeObject: { kind: "object", id: "factory" },
    activePack: { packId: "pack.capacity", packCategory: "execution" },
    temporal: { temporalKind: "current" },
    attention: {
      attentionPriority: "high",
      attentionReason: "Capacity Risk",
    },
    guidance: {
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity Constraint",
    },
  });
  assert.ok(context.context);
  return projectDirectorRuntimeExperienceState(
    bindDirectorRuntimeExperienceSurfaces(context.context),
  );
}

function partialExperienceState(): DirectorRuntimeExperienceStateProjectionResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.partial",
    consumer,
    scope: "workspace",
    activeGoal: { kind: "goal", id: "g1" },
    guidance: { guidanceIntent: "inspect" },
  });
  assert.ok(context.context);
  return projectDirectorRuntimeExperienceState(
    bindDirectorRuntimeExperienceSurfaces(context.context),
  );
}

function emptyExperienceState(): DirectorRuntimeExperienceStateProjectionResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.empty",
    consumer,
    scope: "global",
  });
  assert.ok(context.context);
  return projectDirectorRuntimeExperienceState(
    bindDirectorRuntimeExperienceSurfaces(context.context),
  );
}

function interaction(
  partial: Omit<DirectorRuntimeConsumerInteraction, "source"> & {
    source?: "consumer-experience";
  },
): DirectorRuntimeConsumerInteraction {
  return {
    source: "consumer-experience",
    ...partial,
  };
}

/**
 * DRI-8:4 marks interactionReadiness=disabled when DRI-8:3 surface
 * capabilities omit "interaction". For bridge-mapping tests on those
 * surfaces, enable readiness explicitly while preserving projection state.
 */
function experienceStateForSurface(
  surface: (typeof surfaces)[number],
  base: DirectorRuntimeExperienceStateProjectionResult = fullExperienceState(),
): DirectorRuntimeExperienceStateProjectionResult {
  const projection = base.projections.find((entry) => entry.surface === surface);
  if (
    projection &&
    projection.interactionReadiness === "disabled" &&
    (projection.status === "projected" ||
      projection.status === "partially-projected")
  ) {
    return withReadiness(base, surface, "enabled");
  }
  return base;
}

function bridge(
  kind: DirectorRuntimeConsumerInteraction["kind"],
  surface: DirectorRuntimeConsumerInteraction["surface"],
  extras: Partial<DirectorRuntimeConsumerInteraction> = {},
  experienceState?: DirectorRuntimeExperienceStateProjectionResult,
) {
  const state = experienceState ?? experienceStateForSurface(surface);
  const input: DirectorRuntimeConsumerInteractionBridgeInput = {
    interaction: interaction({
      interactionId: `ix.${surface}.${kind}`,
      kind,
      surface,
      ...extras,
    }),
    experienceState: state,
  };
  return bridgeDirectorRuntimeConsumerInteraction(input);
}

function withReadiness(
  experienceState: DirectorRuntimeExperienceStateProjectionResult,
  surface: (typeof surfaces)[number],
  readiness: "enabled" | "limited" | "disabled",
): DirectorRuntimeExperienceStateProjectionResult {
  const projections = experienceState.projections.map((entry) => {
    if (entry.surface !== surface) return entry;
    return Object.freeze({ ...entry, interactionReadiness: readiness });
  });
  return Object.freeze({
    ...experienceState,
    projections: Object.freeze(projections),
  });
}

test("1. exact identity", () => {
  assert.equal(
    bridgeModule.identity,
    "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
  );
  assert.equal(canonicalIdentity.identity, bridgeModule.identity);
  assert.equal(bridgeModule.phase, "DRI-8:5");
  assert.equal(bridgeModule.role, "ConsumerInteractionBridge");
  assert.deepEqual(
    getDirectorRuntimeConsumerInteractionBridgeIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.5.0", () => {
  assert.equal(bridgeModule.version, "8.5.0");
  assert.equal(canonicalIdentity.version, "8.5.0");
  assert.equal(registry.version, "8.5.0");
});

test("3. exact namespace", () => {
  assert.equal(
    bridgeModule.namespace,
    "nexora.dri.consumer-integration.interaction-bridge",
  );
});

test("4. DRI-8:4 is the sole immediate dependency", () => {
  assert.equal(
    bridgeModule.upstreamDependency,
    "DRI-8:4/DirectorRuntimeExperienceStateProjection",
  );
  assert.equal(
    bridgeModule.experienceProjectionBoundary,
    "DRI-8:4-experience-state-projection-only",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeExperienceStateProjection",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeExperienceSurfaceBinding|directorRuntimeConsumerContextBinding|directorRuntimeConsumerIntegrationFoundation|directorRuntimeInteractionOrchestration/,
  );
});

test("5. canonical interaction kinds are preserved", () => {
  assert.deepEqual([...interactionKinds], [
    "select",
    "focus",
    "activate",
    "hover",
    "navigate",
    "inspect",
    "dismiss",
  ]);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerInteractionKinds()],
    [...interactionKinds],
  );
});

test("6. bridge statuses are unique", () => {
  assert.deepEqual([...bridgeStatuses], [
    "bridged",
    "partially-bridged",
    "blocked",
    "unsupported",
    "invalid",
  ]);
  assert.equal(new Set(bridgeStatuses).size, bridgeStatuses.length);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerInteractionBridgeStatuses()],
    [...bridgeStatuses],
  );
});

test("7. surface interaction capability matrix uses valid surfaces", () => {
  for (const surface of surfaces) {
    assert.ok(surface in capabilityMatrix);
    assert.equal(Object.isFrozen(capabilityMatrix[surface]), true);
  }
  assert.equal(Object.keys(capabilityMatrix).length, surfaces.length);
});

test("8. capability matrix uses valid interaction kinds", () => {
  const kindSet = new Set(interactionKinds);
  for (const surface of surfaces) {
    const caps = getDirectorRuntimeSurfaceInteractionCapabilities(surface);
    assert.ok(caps.length > 0);
    for (const kind of caps) {
      assert.ok(kindSet.has(kind));
      assert.equal(
        isDirectorRuntimeConsumerInteractionSupported(surface, kind),
        true,
      );
    }
  }
});

test("9. select requires valid subject where required", () => {
  const result = bridge("select", "stage");
  assert.equal(result.status, "invalid");
  assert.ok(result.diagnostics.some((entry) => entry.kind === "missing-subject"));
  assert.equal(targetRequirements.select.subjectRequired, true);
});

test("10. focus requires valid subject", () => {
  const result = bridge("focus", "stage");
  assert.equal(result.status, "invalid");
  assert.ok(result.diagnostics.some((entry) => entry.kind === "missing-subject"));
});

test("11. activate requires valid capability/action reference", () => {
  const result = bridge("activate", "advisor", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "invalid");
  assert.ok(
    result.diagnostics.some((entry) => entry.kind === "missing-capability"),
  );
});

test("12. navigate validates semantic navigation target/scope", () => {
  const result = bridge("navigate", "live-lens");
  assert.equal(result.status, "invalid");
  assert.ok(
    result.diagnostics.some((entry) =>
      entry.kind === "missing-navigation-target"),
  );
});

test("13. dismiss supports subjectless form when canonical rules permit", () => {
  const result = bridge("dismiss", "advisor");
  assert.equal(result.status, "bridged");
  assert.ok(result.runtimeIntent);
  assert.equal(result.runtimeIntent.kind, "dismissal");
  assert.equal(result.runtimeIntent.subject, null);
});

test("14. Stage select bridges correctly", () => {
  const result = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "selection");
  assert.equal(result.runtimeIntent?.subject?.id, "factory");
  assert.equal(result.runtimeIntent?.reason, "user-selection");
  assert.equal(result.runtimeIntent?.surface, "stage");
});

test("15. Stage focus bridges correctly", () => {
  const result = bridge("focus", "stage", {
    subject: { kind: "object", id: "kpi-production" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "focus");
  assert.equal(result.runtimeIntent?.subject?.id, "kpi-production");
});

test("16. Stage inspect bridges correctly", () => {
  const result = bridge("inspect", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "inspection");
});

test("17. Advisor activate bridges correctly", () => {
  const result = bridge("activate", "advisor", {
    subject: { kind: "object", id: "factory" },
    capability: { capabilityId: "inspect-bottleneck" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "activation");
  assert.equal(
    result.runtimeIntent?.capability?.capabilityId,
    "inspect-bottleneck",
  );
  assert.equal(result.runtimeIntent?.subject?.id, "factory");
});

test("18. Advisor dismiss bridges correctly", () => {
  const result = bridge("dismiss", "advisor");
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "dismissal");
  assert.equal(result.runtimeIntent?.reason, "user-dismissal");
});

test("19. Insight inspect bridges correctly", () => {
  const result = bridge("inspect", "insight", {
    subject: { kind: "object", id: "kpi-production" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "inspection");
  assert.equal(result.runtimeIntent?.surface, "insight");
});

test("20. Live Lens select bridges correctly", () => {
  const result = bridge("select", "live-lens", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "selection");
});

test("21. Live Lens navigate bridges correctly", () => {
  const result = bridge("navigate", "live-lens", {
    navigation: {
      from: { kind: "goal", id: "increase-capacity" },
      to: { kind: "object", id: "factory" },
    },
  });
  assert.equal(result.status, "bridged");
  assert.equal(result.runtimeIntent?.kind, "navigation");
  assert.equal(result.runtimeIntent?.navigation?.from?.id, "increase-capacity");
  assert.equal(result.runtimeIntent?.navigation?.to?.id, "factory");
});

test("22. Timeline select/navigation bridges correctly", () => {
  const selectResult = bridge("select", "timeline", {
    subject: { kind: "pack", id: "pack.capacity" },
  });
  assert.equal(selectResult.status, "bridged");
  const navigateResult = bridge("navigate", "timeline", {
    navigation: { scope: "historical" },
  });
  assert.equal(navigateResult.status, "bridged");
  assert.equal(navigateResult.runtimeIntent?.kind, "navigation");
});

test("23. Explorer select/inspect bridges correctly", () => {
  const selectResult = bridge("select", "explorer", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(selectResult.status, "bridged");
  const inspectResult = bridge("inspect", "explorer", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(inspectResult.status, "bridged");
});

test("24. unsupported surface/interaction pair returns unsupported", () => {
  const result = bridge("hover", "timeline", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "unsupported");
  assert.equal(result.runtimeIntent, null);
  assert.ok(
    result.diagnostics.some((entry) =>
      entry.kind === "unsupported-surface-interaction"),
  );
});

test("25. disabled interaction readiness returns blocked", () => {
  const experienceState = withReadiness(
    fullExperienceState(),
    "explorer",
    "disabled",
  );
  const result = bridge(
    "activate",
    "explorer",
    {
      subject: { kind: "object", id: "factory" },
      capability: { capabilityId: "related-data" },
    },
    experienceState,
  );
  assert.equal(result.status, "blocked");
  assert.equal(result.runtimeIntent, null);
  assert.ok(
    result.diagnostics.some((entry) => entry.kind === "interaction-disabled"),
  );
});

test("26. limited readiness enforces allowed interactions", () => {
  const experienceState = withReadiness(
    fullExperienceState(),
    "stage",
    "limited",
  );
  const inspectAllowed = bridge(
    "inspect",
    "stage",
    { subject: { kind: "object", id: "factory" } },
    experienceState,
  );
  assert.equal(inspectAllowed.status, "bridged");

  const activateBlocked = bridge(
    "activate",
    "stage",
    {
      subject: { kind: "object", id: "factory" },
      capability: { capabilityId: "inspect-bottleneck" },
    },
    experienceState,
  );
  assert.equal(activateBlocked.status, "blocked");
  assert.ok(
    activateBlocked.diagnostics.some((entry) =>
      entry.kind === "interaction-limited"),
  );
});

test("27. invalid projection prevents intent creation", () => {
  const result = bridgeDirectorRuntimeConsumerInteraction({
    interaction: interaction({
      interactionId: "ix.invalid",
      kind: "select",
      surface: "stage",
      subject: { kind: "object", id: "factory" },
    }),
    experienceState: {
      projections: [],
      status: "invalid",
      activeProjections: [],
      inactiveProjections: [...surfaces],
      diagnostics: [],
      provenance: {
        sourceBindingIdentity: "x",
        surfaceBindingIdentity: "y",
        stateProjectionIdentity: "z",
        surfaceIdentifier: "aggregate",
      },
    },
  });
  assert.equal(result.status, "invalid");
  assert.equal(result.runtimeIntent, null);
});

test("28. unavailable projection prevents inappropriate bridging", () => {
  const result = bridge(
    "select",
    "stage",
    { subject: { kind: "object", id: "factory" } },
    emptyExperienceState(),
  );
  assert.equal(result.status, "blocked");
  assert.equal(result.runtimeIntent, null);
  assert.ok(
    result.diagnostics.some((entry) => entry.kind === "surface-unavailable"),
  );
});

test("29. partial projection is handled deterministically", () => {
  const experienceState = partialExperienceState();
  const explorer = experienceState.projections.find((entry) =>
    entry.surface === "explorer");
  assert.equal(explorer?.status, "partially-projected");
  // Explorer partially-projected may still have disabled readiness (no interaction capability).
  // Advisor is projected with interaction enabled — inspect under partial overall state.
  const advisorInspect = bridge(
    "inspect",
    "advisor",
    { subject: { kind: "object", id: "factory" } },
    experienceState,
  );
  assert.ok(
    advisorInspect.status === "bridged" ||
      advisorInspect.status === "partially-bridged",
  );

  const liveLens = experienceState.projections.find((entry) =>
    entry.surface === "live-lens");
  assert.equal(liveLens?.status, "partially-projected");
  const liveSelect = bridge(
    "select",
    "live-lens",
    { subject: { kind: "object", id: "factory" } },
    withReadiness(experienceState, "live-lens", "enabled"),
  );
  assert.equal(liveSelect.status, "partially-bridged");
  assert.ok(liveSelect.runtimeIntent);
});

test("30. subject identity is preserved", () => {
  const result = bridge("select", "stage", {
    subject: { kind: "object", id: "factory", label: "Factory" },
  });
  assert.equal(result.runtimeIntent?.subject?.id, "factory");
  assert.equal(result.runtimeIntent?.subject?.kind, "object");
  assert.equal(result.runtimeIntent?.subject?.label, "Factory");
});

test("31. surface identity is preserved", () => {
  const result = bridge("inspect", "insight", {
    subject: { kind: "object", id: "kpi-production" },
  });
  assert.equal(result.runtimeIntent?.surface, "insight");
  assert.equal(result.interaction?.surface, "insight");
});

test("32. capability identity is preserved", () => {
  const result = bridge("activate", "advisor", {
    capability: {
      capabilityId: "inspect-bottleneck",
      label: "Inspect Bottleneck",
    },
  });
  assert.equal(
    result.runtimeIntent?.capability?.capabilityId,
    "inspect-bottleneck",
  );
  assert.equal(result.runtimeIntent?.capability?.label, "Inspect Bottleneck");
});

test("33. no semantic subject replacement occurs", () => {
  const result = bridge("focus", "stage", {
    subject: { kind: "object", id: "kpi-production" },
  });
  assert.equal(result.runtimeIntent?.subject?.id, "kpi-production");
  assert.notEqual(result.runtimeIntent?.subject?.id, "factory");
  assert.notEqual(result.runtimeIntent?.subject?.id, "production");
});

test("34. interaction reasons are deterministic", () => {
  const first = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  const second = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(first.runtimeIntent?.reason, "user-selection");
  assert.equal(first.runtimeIntent?.reason, second.runtimeIntent?.reason);
  assert.equal(new Set(interactionReasons).size, interactionReasons.length);
});

test("35. runtime intents are deterministic", () => {
  const first = bridge("activate", "advisor", {
    capability: { capabilityId: "inspect-bottleneck" },
    subject: { kind: "object", id: "factory" },
  });
  const second = bridge("activate", "advisor", {
    capability: { capabilityId: "inspect-bottleneck" },
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual(first.runtimeIntent, second.runtimeIntent);
  const resolved = resolveDirectorRuntimeConsumerInteractionIntent(
    interaction({
      interactionId: "ix.advisor.activate",
      kind: "activate",
      surface: "advisor",
      capability: { capabilityId: "inspect-bottleneck" },
      subject: { kind: "object", id: "factory" },
    }),
  );
  assert.deepEqual(resolved, first.runtimeIntent);
});

test("36. provenance is deterministic", () => {
  const first = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  const second = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual(first.provenance, second.provenance);
  assert.equal(
    first.provenance.interactionBridgeIdentity,
    bridgeModule.identity,
  );
  assert.equal(first.provenance.surfaceIdentifier, "stage");
  assert.equal(first.provenance.interactionKind, "select");
  assert.doesNotMatch(source, /\bDate\.now\s*\(|crypto\.randomUUID\b/);
});

test("37. input interaction is not mutated", () => {
  const ix = interaction({
    interactionId: "ix.mutate",
    kind: "select",
    surface: "stage",
    subject: { kind: "object", id: "factory" },
  });
  const snap = JSON.stringify(ix);
  bridgeDirectorRuntimeConsumerInteraction({
    interaction: ix,
    experienceState: fullExperienceState(),
  });
  assert.equal(JSON.stringify(ix), snap);
});

test("38. DRI-8:4 projection input is not mutated", () => {
  const experienceState = fullExperienceState();
  const snap = JSON.stringify(experienceState);
  bridgeDirectorRuntimeConsumerInteraction({
    interaction: interaction({
      interactionId: "ix.proj",
      kind: "select",
      surface: "stage",
      subject: { kind: "object", id: "factory" },
    }),
    experienceState,
  });
  assert.equal(JSON.stringify(experienceState), snap);
});

test("39. output is immutable", () => {
  const result = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.diagnostics), true);
  assert.equal(Object.isFrozen(result.provenance), true);
  assert.ok(result.runtimeIntent);
  assert.equal(Object.isFrozen(result.runtimeIntent), true);
  assert.throws(() => {
    (result as { status?: string }).status = "invalid";
  });
});

test("40. registry counts are dynamically derived", () => {
  assert.equal(registry.interactionKindCount, interactionKinds.length);
  assert.equal(registry.bridgeStatusCount, bridgeStatuses.length);
  assert.equal(
    registry.surfaceInteractionCapabilityCount,
    surfaces.reduce(
      (total, surface) => total + capabilityMatrix[surface].length,
      0,
    ),
  );
  assert.equal(
    registry.targetRequirementCount,
    Object.keys(targetRequirements).length,
  );
  assert.equal(registry.interactionToIntentMappingCount, intentMappings.length);
  assert.equal(registry.interactionReasonCount, interactionReasons.length);
  assert.equal(registry.diagnosticKindCount, diagnosticKinds.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
});

test("41. verification passes", () => {
  const first = verifyDirectorRuntimeConsumerInteractionBridge();
  const second = verifyDirectorRuntimeConsumerInteractionBridge();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.dri84BoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.mutatesRuntimeState, false);
  assert.equal(first.capabilityMatrixValid, true);
});

test("42. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom)["']/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|useState|useEffect|createContext)\b/,
  );
});

test("43. no Next.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["']next(?:\/[^"']*)?["']/i);
  assert.doesNotMatch(source, /\b(?:router\.push|useRouter|NextResponse)\b/);
});

test("44. no Three.js dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(source, /\b(?:THREE|Object3D|Raycaster|WebGL)\b/);
});

test("45. no DOM/browser event dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:MouseEvent|PointerEvent|KeyboardEvent|TouchEvent|HTMLElement|EventTarget|addEventListener|onClick)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|localStorage|clientX|clientY|screenX|screenY)\b/,
  );
});

test("46. public API exposes no MouseEvent/PointerEvent types", () => {
  assert.doesNotMatch(
    source,
    /\b(?:React\.MouseEvent|React\.PointerEvent|MouseEvent|PointerEvent)\b/,
  );
});

test("47. no UI rendering behavior exists", () => {
  assert.doesNotMatch(
    source,
    /\b(?:openPanel|setOpacity|moveCamera|expandDrawer|scrollTo|setClassName|animateObject)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:highlight|fade|zoom|animate)\s*[:=]/,
  );
});

test("48. no Runtime state mutation exists", () => {
  assert.equal(bridgeModule.mutatesRuntimeState, false);
  assert.doesNotMatch(
    source,
    /\b(?:setSelection|mutateRuntime|updateStore|dispatchRuntime|writeRuntime)\b/,
  );
});

test("49. no business/KPI/KOI logic exists", () => {
  assert.doesNotMatch(
    source,
    /\b(?:calculateKpi|calculateKoi|kpiScore|koiScore|riskScore|recommendDecision)\b/i,
  );
  assert.doesNotMatch(source, /\b(?:openai|anthropic|llm)\b/i);
});

test("50. no DRI-4 interaction orchestration is duplicated", () => {
  assert.doesNotMatch(
    source,
    /\b(?:resolveDirectorRuntimeInteraction|planDirectorRuntimeReaction|orchestrateDirectorRuntimeInteraction)\b/,
  );
  assert.doesNotMatch(
    source,
    /directorRuntimeInteraction(?:Orchestration|Reaction|Contracts)/,
  );
});

test("51. no DRI-8:6 cross-surface coordination is introduced", () => {
  assert.doesNotMatch(
    source,
    /\b(?:orchestrat|coordinateSurfaces|propagateSurfaceChange|ExperienceCoordination)\b/i,
  );
});

test("52. DRI-8:4 behavior remains unchanged", () => {
  const dri84 = verifyDirectorRuntimeExperienceStateProjection();
  assert.equal(dri84.ok, true);
  assert.equal(dri84.version, "8.4.0");
  assert.doesNotMatch(source, /verifyDirectorRuntimeExperienceStateProjection/);
});

test("53. upstream DRI chain and DRI-4 public index remain healthy", () => {
  assert.equal(verifyDirectorRuntimeExperienceSurfaceBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerContextBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerIntegrationFoundation().ok, true);
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePublicIndex().ok, true);
  assert.equal(
    verifyDirectorRuntimeInteractionOrchestrationPublicIndex(),
    true,
  );
});
