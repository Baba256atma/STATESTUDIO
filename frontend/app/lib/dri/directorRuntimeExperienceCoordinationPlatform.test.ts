import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS as changeKinds,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES as priorities,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS as reasons,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES as rules,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES as scopes,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES as statuses,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS as triggers,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS as relationships,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES as roles,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as surfaces,
  coordinateDirectorRuntimeExperience,
  directorRuntimeExperienceCoordinationPlatform as platformModule,
  directorRuntimeExperienceCoordinationPlatformApiNames as apiNames,
  directorRuntimeExperienceCoordinationPlatformCanonicalIdentity as canonicalIdentity,
  directorRuntimeExperienceCoordinationPlatformRegistry as registry,
  getDirectorRuntimeExperienceCoordinationPlatformIdentity,
  getDirectorRuntimeExperienceCoordinationRules,
  listDirectorRuntimeExperienceCoordinationChangeKinds,
  listDirectorRuntimeExperienceCoordinationScopes,
  listDirectorRuntimeExperienceCoordinationStatuses,
  listDirectorRuntimeExperienceCoordinationTriggerKinds,
  listDirectorRuntimeExperienceSurfaceRoles,
  resolveDirectorRuntimeExperienceCoordination,
  validateDirectorRuntimeExperienceCoordination,
  verifyDirectorRuntimeExperienceCoordinationPlatform,
  type DirectorRuntimeExperienceCoordinationInput,
  type DirectorRuntimeExperienceCoordinationExperienceState,
} from "./directorRuntimeExperienceCoordinationPlatform.ts";

import {
  bridgeDirectorRuntimeConsumerInteraction,
  verifyDirectorRuntimeConsumerInteractionBridge,
  type DirectorRuntimeConsumerInteraction,
  type DirectorRuntimeConsumerInteractionBridgeResult,
} from "./directorRuntimeConsumerInteractionBridge.ts";

import { bindDirectorRuntimeConsumerContext } from
  "@/app/lib/dri/directorRuntimeConsumerContextBinding";
import { bindDirectorRuntimeExperienceSurfaces } from
  "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";
import {
  projectDirectorRuntimeExperienceState,
  type DirectorRuntimeExperienceStateProjectionResult,
} from "@/app/lib/dri/directorRuntimeExperienceStateProjection";
import { verifyDirectorRuntimeExperienceStateProjection } from
  "@/app/lib/dri/directorRuntimeExperienceStateProjection";
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
  new URL("./directorRuntimeExperienceCoordinationPlatform.ts", import.meta.url),
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

function withSurfaceStatus(
  experienceState: DirectorRuntimeExperienceStateProjectionResult,
  surface: (typeof surfaces)[number],
  status:
    | "projected"
    | "partially-projected"
    | "inactive"
    | "unavailable"
    | "invalid",
): DirectorRuntimeExperienceStateProjectionResult {
  const projections = experienceState.projections.map((entry) => {
    if (entry.surface !== surface) return entry;
    return Object.freeze({ ...entry, status });
  });
  return Object.freeze({
    ...experienceState,
    projections: Object.freeze(projections),
  }) as DirectorRuntimeExperienceStateProjectionResult;
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

function bridge(
  kind: DirectorRuntimeConsumerInteraction["kind"],
  surface: DirectorRuntimeConsumerInteraction["surface"],
  extras: Partial<DirectorRuntimeConsumerInteraction> = {},
  experienceState?: DirectorRuntimeExperienceStateProjectionResult,
): {
  bridgeResult: DirectorRuntimeConsumerInteractionBridgeResult;
  experienceState: DirectorRuntimeExperienceStateProjectionResult;
} {
  const state = experienceState ?? experienceStateForSurface(surface);
  const bridgeResult = bridgeDirectorRuntimeConsumerInteraction({
    interaction: interaction({
      interactionId: `ix.${surface}.${kind}`,
      kind,
      surface,
      ...extras,
    }),
    experienceState: state,
  });
  return { bridgeResult, experienceState: state };
}

function coordinateFromBridge(
  kind: DirectorRuntimeConsumerInteraction["kind"],
  surface: DirectorRuntimeConsumerInteraction["surface"],
  extras: Partial<DirectorRuntimeConsumerInteraction> = {},
  experienceState?: DirectorRuntimeExperienceStateProjectionResult,
  context?: DirectorRuntimeExperienceCoordinationInput["coordinationContext"],
) {
  const { bridgeResult, experienceState: state } = bridge(
    kind,
    surface,
    extras,
    experienceState,
  );
  assert.ok(
    bridgeResult.status === "bridged" ||
      bridgeResult.status === "partially-bridged",
    `expected bridgeable interaction, got ${bridgeResult.status}`,
  );
  return coordinateDirectorRuntimeExperience({
    experienceStateProjection: state,
    interactionBridgeResult: bridgeResult,
    coordinationContext: context,
  });
}

function roleOf(
  result: ReturnType<typeof coordinateDirectorRuntimeExperience>,
  surface: (typeof surfaces)[number],
) {
  return result.surfaceOutcomes.find((entry) => entry.surface === surface)?.role;
}

function outcomeOf(
  result: ReturnType<typeof coordinateDirectorRuntimeExperience>,
  surface: (typeof surfaces)[number],
) {
  return result.surfaceOutcomes.find((entry) => entry.surface === surface);
}

test("1. exact identity", () => {
  assert.equal(
    platformModule.identity,
    "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform",
  );
  assert.equal(canonicalIdentity.identity, platformModule.identity);
  assert.equal(platformModule.phase, "DRI-8:6");
  assert.equal(platformModule.role, "ExperienceCoordinationPlatform");
  assert.deepEqual(
    getDirectorRuntimeExperienceCoordinationPlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.6.0", () => {
  assert.equal(platformModule.version, "8.6.0");
  assert.equal(canonicalIdentity.version, "8.6.0");
  assert.equal(registry.version, "8.6.0");
});

test("3. exact namespace", () => {
  assert.equal(
    platformModule.namespace,
    "nexora.dri.consumer-integration.experience-coordination-platform",
  );
});

test("4. DRI-8:5 is the sole immediate dependency", () => {
  assert.equal(
    platformModule.upstreamDependency,
    "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
  );
  assert.equal(
    platformModule.interactionBridgeBoundary,
    "DRI-8:5-consumer-interaction-bridge-only",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeConsumerInteractionBridge",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeExperienceStateProjection|directorRuntimeExperienceSurfaceBinding|directorRuntimeConsumerContextBinding|directorRuntimeConsumerIntegrationFoundation|directorRuntimeInteractionOrchestration/,
  );
});

test("5. coordination statuses are canonical and unique", () => {
  assert.deepEqual([...statuses], [
    "coordinated",
    "partially-coordinated",
    "no-op",
    "blocked",
    "invalid",
  ]);
  assert.equal(new Set(statuses).size, statuses.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceCoordinationStatuses()],
    [...statuses],
  );
});

test("6. coordination scopes are canonical and unique", () => {
  assert.deepEqual([...scopes], [
    "surface",
    "subject",
    "workspace",
    "experience",
  ]);
  assert.equal(new Set(scopes).size, scopes.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceCoordinationScopes()],
    [...scopes],
  );
});

test("7. surface roles are canonical and unique", () => {
  assert.deepEqual([...roles], [
    "primary",
    "supporting",
    "background",
    "preserved",
    "inactive",
  ]);
  assert.equal(new Set(roles).size, roles.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceSurfaceRoles()],
    [...roles],
  );
});

test("8. trigger kinds are canonical and unique", () => {
  assert.deepEqual([...triggers], [
    "state-change",
    "selection-change",
    "focus-change",
    "activation",
    "navigation",
    "inspection",
    "dismissal",
    "attention-change",
    "guidance-change",
  ]);
  assert.equal(new Set(triggers).size, triggers.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceCoordinationTriggerKinds()],
    [...triggers],
  );
});

test("9. change kinds are canonical and unique", () => {
  assert.deepEqual([...changeKinds], [
    "update",
    "preserve",
    "deactivate",
    "reactivate",
    "none",
  ]);
  assert.equal(new Set(changeKinds).size, changeKinds.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceCoordinationChangeKinds()],
    [...changeKinds],
  );
});

test("10. priority vocabulary is canonical", () => {
  assert.deepEqual([...priorities], ["critical", "high", "normal", "low"]);
  assert.equal(new Set(priorities).size, priorities.length);
});

test("11. canonical six surfaces are preserved", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  assert.equal(registry.surfaceCount, 6);
});

test("12. canonical surface order is preserved", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual(
    result.surfaceOutcomes.map((entry) => entry.surface),
    [...surfaces],
  );
});

test("13. Stage selection can make Stage primary", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "coordinated");
  assert.equal(result.primarySurface, "stage");
  assert.equal(roleOf(result, "stage"), "primary");
});

test("14. Stage selection coordinates relevant supporting surfaces", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "live-lens"), "supporting");
  assert.equal(roleOf(result, "explorer"), "supporting");
});

test("15. Unrelated surfaces can be preserved", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(roleOf(result, "timeline"), "preserved");
  assert.ok(result.preservedSurfaces.includes("timeline"));
});

test("16. Selection and focus remain distinct", () => {
  const selected = { kind: "object" as const, id: "factory" };
  const focused = { kind: "object" as const, id: "kpi-production" };
  const result = coordinateFromBridge(
    "focus",
    "stage",
    { subject: focused },
    undefined,
    { selectedSubject: selected, focusedSubject: focused },
  );
  assert.equal(result.coordinationPlan?.selectedSubject?.id, "factory");
  assert.equal(result.coordinationPlan?.focusedSubject?.id, "kpi-production");
  assert.notEqual(
    result.coordinationPlan?.selectedSubject?.id,
    result.coordinationPlan?.focusedSubject?.id,
  );
});

test("17. Focused subject can coordinate Insight/Advisor without replacing selection", () => {
  const selected = { kind: "object" as const, id: "factory" };
  const focused = { kind: "object" as const, id: "kpi-production" };
  const result = coordinateFromBridge(
    "focus",
    "stage",
    { subject: focused },
    undefined,
    { selectedSubject: selected, focusedSubject: focused },
  );
  assert.equal(result.primarySurface, "insight");
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "stage"), "supporting");
  const stageOutcome = outcomeOf(result, "stage");
  assert.equal(stageOutcome?.selectedSubject?.id, "factory");
  assert.equal(stageOutcome?.focusedSubject?.id, "kpi-production");
});

test("18. Attention changes coordinate only relevant surfaces", () => {
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState(),
    coordinationContext: {
      triggerOverride: "attention-change",
      sourceSurfaceOverride: "stage",
      attentionSubject: { kind: "object", id: "capacity-risk" },
    },
  });
  assert.ok(
    result.status === "coordinated" || result.status === "partially-coordinated",
  );
  assert.equal(roleOf(result, "stage"), "primary");
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "timeline"), "preserved");
  assert.equal(roleOf(result, "explorer"), "preserved");
});

test("19. Guidance changes coordinate relevant surfaces", () => {
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState(),
    coordinationContext: {
      triggerOverride: "guidance-change",
      sourceSurfaceOverride: "advisor",
      guidancePresent: true,
      selectedSubject: { kind: "object", id: "factory" },
    },
  });
  assert.equal(result.primarySurface, "advisor");
  assert.equal(roleOf(result, "stage"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "timeline"), "preserved");
});

test("20. Live Lens navigation can make Live Lens primary", () => {
  const result = coordinateFromBridge("navigate", "live-lens", {
    navigation: {
      from: { kind: "goal", id: "increase-capacity" },
      to: { kind: "object", id: "factory" },
      scope: "goal-to-object",
    },
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.primarySurface, "live-lens");
  assert.equal(roleOf(result, "stage"), "supporting");
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "explorer"), "supporting");
  assert.equal(roleOf(result, "timeline"), "preserved");
});

test("21. Timeline navigation can make Timeline primary", () => {
  const result = coordinateFromBridge("navigate", "timeline", {
    navigation: {
      to: { kind: "pack", id: "pack.capacity" },
      scope: "temporal-pack",
    },
    subject: { kind: "pack", id: "pack.capacity" },
  });
  assert.equal(result.primarySurface, "timeline");
  assert.equal(roleOf(result, "stage"), "supporting");
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "live-lens"), "preserved");
  assert.equal(roleOf(result, "explorer"), "preserved");
});

test("22. Explorer interaction can coordinate related surfaces", () => {
  const result = coordinateFromBridge("select", "explorer", {
    subject: { kind: "object", id: "warehouse" },
  });
  assert.equal(result.primarySurface, "explorer");
  assert.equal(roleOf(result, "stage"), "supporting");
  assert.equal(roleOf(result, "advisor"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "live-lens"), "supporting");
  assert.equal(roleOf(result, "timeline"), "preserved");
});

test("23. Advisor activation can coordinate supporting surfaces", () => {
  const result = coordinateFromBridge("activate", "advisor", {
    capability: { capabilityId: "inspect-bottleneck" },
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.primarySurface, "advisor");
  assert.equal(roleOf(result, "stage"), "supporting");
  assert.equal(roleOf(result, "insight"), "supporting");
  assert.equal(roleOf(result, "live-lens"), "supporting");
  assert.equal(roleOf(result, "timeline"), "preserved");
  assert.equal(roleOf(result, "explorer"), "background");
});

test("24. Dismissal can produce local/no-op coordination", () => {
  const result = coordinateFromBridge("dismiss", "advisor");
  assert.equal(result.status, "no-op");
  assert.equal(result.primarySurface, "advisor");
  assert.deepEqual([...result.affectedSurfaces], ["advisor"]);
  assert.ok(result.preservedSurfaces.includes("stage"));
  assert.ok(result.preservedSurfaces.includes("insight"));
});

test("25. No universal six-surface fan-out occurs", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.ok(result.affectedSurfaces.length < 6);
  assert.ok(result.preservedSurfaces.length >= 1);
  assert.ok(!result.affectedSurfaces.includes("timeline"));
});

test("26. Partial projections produce partial coordination", () => {
  const state = partialExperienceState();
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: state,
    coordinationContext: {
      triggerOverride: "guidance-change",
      sourceSurfaceOverride: "advisor",
      guidancePresent: true,
    },
  });
  assert.ok(
    result.status === "partially-coordinated" ||
      result.status === "coordinated" ||
      result.status === "no-op",
  );
  if (result.status === "partially-coordinated") {
    assert.ok(
      result.diagnostics.some((entry) => entry.kind === "partial-coordination"),
    );
  }
});

test("27. Unavailable supporting surface does not necessarily invalidate entire result", () => {
  const state = withSurfaceStatus(
    fullExperienceState(),
    "insight",
    "unavailable",
  );
  const result = coordinateFromBridge(
    "select",
    "stage",
    { subject: { kind: "object", id: "factory" } },
    state,
  );
  assert.notEqual(result.status, "invalid");
  assert.ok(
    result.status === "partially-coordinated" ||
      result.status === "coordinated",
  );
  assert.equal(result.primarySurface, "stage");
});

test("28. Required unavailable surface is handled deterministically", () => {
  const state = withSurfaceStatus(fullExperienceState(), "stage", "unavailable");
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: state,
    coordinationContext: {
      triggerOverride: "selection-change",
      sourceSurfaceOverride: "stage",
      selectedSubject: { kind: "object", id: "factory" },
    },
  });
  assert.equal(result.status, "blocked");
  assert.equal(result.coordinationPlan, null);
  assert.ok(
    result.diagnostics.some(
      (entry) => entry.kind === "required-surface-unavailable",
    ),
  );
});

test("29. Invalid input produces invalid result", () => {
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: {
      status: "invalid",
      projections: [],
    },
    coordinationContext: {
      triggerOverride: "selection-change",
      sourceSurfaceOverride: "stage",
    },
  });
  assert.equal(result.status, "invalid");
  assert.equal(result.coordinationPlan, null);
});

test("30. No-op behavior is deterministic", () => {
  const a = coordinateFromBridge("dismiss", "advisor");
  const b = coordinateFromBridge("dismiss", "advisor");
  assert.equal(a.status, "no-op");
  assert.deepEqual(a, b);
});

test("31. Primary surface resolution is deterministic", () => {
  const a = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  const b = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(a.primarySurface, "stage");
  assert.equal(a.primarySurface, b.primarySurface);
});

test("32. Supporting-surface resolution is deterministic", () => {
  const a = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  const b = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual([...a.supportingSurfaces], [...b.supportingSurfaces]);
  assert.deepEqual([...a.supportingSurfaces], [
    "advisor",
    "insight",
    "live-lens",
    "explorer",
  ]);
});

test("33. Preserved-surface resolution is deterministic", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual([...result.preservedSurfaces], ["timeline"]);
});

test("34. Affected-surface resolution is deterministic", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.deepEqual([...result.affectedSurfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "explorer",
  ]);
});

test("35. Coordination reasons are deterministic", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.coordinationPlan?.reason, "selection-context-change");
  assert.ok(reasons.includes(result.coordinationPlan!.reason));
});

test("36. Coordination priority is deterministic", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.coordinationPlan?.priority, "high");
});

test("37. Subject identity is preserved", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(result.coordinationPlan?.subject?.id, "factory");
  assert.equal(outcomeOf(result, "stage")?.subject?.id, "factory");
  assert.equal(outcomeOf(result, "advisor")?.subject?.id, "factory");
});

test("38. Selection identity is preserved", () => {
  const selected = { kind: "object" as const, id: "factory" };
  const focused = { kind: "object" as const, id: "kpi-production" };
  const result = coordinateFromBridge(
    "focus",
    "stage",
    { subject: focused },
    undefined,
    { selectedSubject: selected, focusedSubject: focused },
  );
  assert.equal(result.coordinationPlan?.selectedSubject?.id, "factory");
  for (const surface of ["stage", "insight", "advisor"] as const) {
    assert.equal(outcomeOf(result, surface)?.selectedSubject?.id, "factory");
  }
});

test("39. Focus identity is preserved", () => {
  const selected = { kind: "object" as const, id: "factory" };
  const focused = { kind: "object" as const, id: "kpi-production" };
  const result = coordinateFromBridge(
    "focus",
    "stage",
    { subject: focused },
    undefined,
    { selectedSubject: selected, focusedSubject: focused },
  );
  assert.equal(result.coordinationPlan?.focusedSubject?.id, "kpi-production");
  assert.equal(outcomeOf(result, "insight")?.focusedSubject?.id, "kpi-production");
});

test("40. Input interaction result is not mutated", () => {
  const { bridgeResult, experienceState } = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  const before = JSON.stringify(bridgeResult);
  coordinateDirectorRuntimeExperience({
    experienceStateProjection: experienceState,
    interactionBridgeResult: bridgeResult,
  });
  assert.equal(JSON.stringify(bridgeResult), before);
});

test("41. Input projections are not mutated", () => {
  const experienceState = fullExperienceState();
  const before = JSON.stringify(experienceState);
  coordinateFromBridge(
    "select",
    "stage",
    { subject: { kind: "object", id: "factory" } },
    experienceState,
  );
  assert.equal(JSON.stringify(experienceState), before);
});

test("42. Output plan is immutable", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.ok(Object.isFrozen(result));
  assert.ok(result.coordinationPlan && Object.isFrozen(result.coordinationPlan));
  assert.throws(() => {
    // @ts-expect-error immutability
    result.status = "invalid";
  });
});

test("43. Surface outcomes are immutable", () => {
  const result = coordinateFromBridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.ok(Object.isFrozen(result.surfaceOutcomes));
  for (const outcome of result.surfaceOutcomes) {
    assert.ok(Object.isFrozen(outcome));
  }
});

test("44. Registry counts are dynamically derived", () => {
  assert.equal(registry.coordinationStatusCount, statuses.length);
  assert.equal(registry.coordinationScopeCount, scopes.length);
  assert.equal(registry.surfaceRoleCount, roles.length);
  assert.equal(registry.triggerKindCount, triggers.length);
  assert.equal(registry.changeKindCount, changeKinds.length);
  assert.equal(registry.priorityCount, priorities.length);
  assert.equal(registry.coordinationReasonCount, reasons.length);
  assert.equal(registry.coordinationRuleCount, rules.length);
  assert.equal(registry.surfaceRelationshipCount, relationships.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(
    registry.surfaceRelationshipMemberCount,
    relationships.reduce((total, rel) => total + rel.surfaces.length, 0),
  );
});

test("45. Verification passes", () => {
  const verification = verifyDirectorRuntimeExperienceCoordinationPlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.dri85BoundaryIntact, true);
  assert.equal(verification.frameworkIndependent, true);
  assert.equal(verification.mutatesRuntimeState, false);
});

test("46. no React dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']react-dom["']/);
  assert.doesNotMatch(source, /\buse(State|Effect|Memo|Callback|Ref)\b/);
});

test("47. no Next.js dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']next(\/|["'])/);
});

test("48. no Three.js dependency", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
});

test("49. no DOM/browser dependency", () => {
  assert.doesNotMatch(source, /\b(document|window|localStorage|HTMLElement)\b/);
  assert.doesNotMatch(source, /\b(MouseEvent|PointerEvent|KeyboardEvent)\b/);
});

test("50. no CSS/rendering dependency", () => {
  assert.doesNotMatch(source, /\b(className|css`|styled-components|zIndex|opacity)\b/);
  assert.doesNotMatch(
    source,
    /\b(setOpacity|moveCamera|openPanel|expandDrawer|scrollTo)\b/,
  );
});

test("51. no animation behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(fade|pulse|ripple|easing|spring|animateObject|camera transition)\b/i,
  );
});

test("52. no business/KPI/KOI logic", () => {
  assert.doesNotMatch(
    source,
    /\b(calculateKpi|calculateKoi|riskScore|scenarioRank|llm|openai)\b/i,
  );
});

test("53. no Runtime state mutation", () => {
  assert.equal(platformModule.mutatesRuntimeState, false);
  assert.doesNotMatch(
    source,
    /\b(dispatch|setState|mutateRuntime|writeJournal)\b/,
  );
});

test("54. no DRI-4 orchestration logic duplication", () => {
  assert.doesNotMatch(
    source,
    /directorRuntimeInteractionOrchestration|reactionPlanning|executionOrchestration/,
  );
  assert.doesNotMatch(
    source,
    /\b(resolveInteractionObservation|planInteractionReaction)\b/,
  );
});

test("55. DRI-8:5 behavior remains unchanged", () => {
  assert.equal(verifyDirectorRuntimeConsumerInteractionBridge().ok, true);
  const { bridgeResult } = bridge("select", "stage", {
    subject: { kind: "object", id: "factory" },
  });
  assert.equal(bridgeResult.status, "bridged");
  assert.equal(bridgeResult.runtimeIntent?.kind, "selection");
});

test("56. resolve API matches coordinate API", () => {
  const input: DirectorRuntimeExperienceCoordinationInput = {
    experienceStateProjection: fullExperienceState(),
    coordinationContext: {
      triggerOverride: "selection-change",
      sourceSurfaceOverride: "stage",
      selectedSubject: { kind: "object", id: "factory" },
    },
  };
  assert.deepEqual(
    resolveDirectorRuntimeExperienceCoordination(input),
    coordinateDirectorRuntimeExperience(input),
  );
});

test("57. rules API exposes immutable registry", () => {
  const listed = getDirectorRuntimeExperienceCoordinationRules();
  assert.equal(listed.length, rules.length);
  assert.ok(Object.isFrozen(listed));
});

test("58. validate API reports invalid experience state", () => {
  const diagnostics = validateDirectorRuntimeExperienceCoordination({
    experienceStateProjection: {
      status: "projected",
      projections: "bad" as unknown as DirectorRuntimeExperienceCoordinationExperienceState["projections"],
    },
  });
  assert.ok(
    diagnostics.some((entry) => entry.kind === "invalid-coordination-input"),
  );
});

test("59. blocked bridge result blocks coordination", () => {
  const state = withReadiness(fullExperienceState(), "stage", "disabled");
  const bridgeResult = bridgeDirectorRuntimeConsumerInteraction({
    interaction: interaction({
      interactionId: "ix.blocked",
      kind: "select",
      surface: "stage",
      subject: { kind: "object", id: "factory" },
    }),
    experienceState: state,
  });
  assert.equal(bridgeResult.status, "blocked");
  const result = coordinateDirectorRuntimeExperience({
    experienceStateProjection: state,
    interactionBridgeResult: bridgeResult,
  });
  assert.equal(result.status, "blocked");
});

test("60. upstream DRI chain and DRI-4 public index remain healthy", () => {
  assert.equal(verifyDirectorRuntimeConsumerInteractionBridge().ok, true);
  assert.equal(verifyDirectorRuntimeExperienceStateProjection().ok, true);
  assert.equal(verifyDirectorRuntimeExperienceSurfaceBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerContextBinding().ok, true);
  assert.equal(verifyDirectorRuntimeConsumerIntegrationFoundation().ok, true);
  assert.equal(verifyDirectorRuntimeExecutiveGuidancePublicIndex().ok, true);
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationPublicIndex(), true);
});
