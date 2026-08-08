import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES as activityStates,
  DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES as dominanceStates,
  DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES as emphasisStates,
  DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES as interactionReadinessStates,
  DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES as presentationStates,
  DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS as diagnosticKinds,
  DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS as projectionReasons,
  DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES as projectionStatuses,
  DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_PROJECTION_CAPABILITIES as surfaceProjectionCapabilities,
  DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES as visibilityStates,
  directorRuntimeExperienceStateProjection as projectionModule,
  directorRuntimeExperienceStateProjectionApiNames as apiNames,
  directorRuntimeExperienceStateProjectionCanonicalIdentity as canonicalIdentity,
  directorRuntimeExperienceStateProjectionRegistry as registry,
  getDirectorRuntimeExperienceStateProjectionIdentity,
  listDirectorRuntimeExperienceActivityStates,
  listDirectorRuntimeExperienceDominanceStates,
  listDirectorRuntimeExperienceEmphasisStates,
  listDirectorRuntimeExperienceInteractionReadinessStates,
  listDirectorRuntimeExperiencePresentationStates,
  listDirectorRuntimeExperienceProjectionStatuses,
  listDirectorRuntimeExperienceVisibilityStates,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeExperienceStateProjection,
  resolveDirectorRuntimeExperienceStateProjectionFromResult,
  verifyDirectorRuntimeExperienceStateProjection,
} from "./directorRuntimeExperienceStateProjection.ts";

import {
  bindDirectorRuntimeConsumerContext,
  verifyDirectorRuntimeConsumerContextBinding,
} from "@/app/lib/dri/directorRuntimeConsumerContextBinding";
import {
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as surfaces,
  bindDirectorRuntimeExperienceSurfaces,
  type DirectorRuntimeExperienceSurfaceBindingResult,
  verifyDirectorRuntimeExperienceSurfaceBinding,
} from "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";
import { verifyDirectorRuntimeConsumerIntegrationFoundation } from
  "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";
import { verifyDirectorRuntimeExecutiveGuidancePublicIndex } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExperienceStateProjection.ts", import.meta.url),
  "utf8",
);

const consumer = {
  consumerId: "executive.main",
  consumerFamily: "executive-experience" as const,
};

function fullBindings(): DirectorRuntimeExperienceSurfaceBindingResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.full",
    consumer,
    scope: "workspace",
    mode: "execution",
    activeSubject: { kind: "object", id: "factory", label: "Factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: {
      kind: "object",
      id: "kpi-production",
      label: "Production KPI",
    },
    activeGoal: { kind: "goal", id: "increase-capacity" },
    activeObject: { kind: "object", id: "factory" },
    activePack: { packId: "pack.capacity", packCategory: "execution" },
    temporal: { temporalKind: "current", timelinePosition: "now" },
    attention: {
      attentionTarget: { kind: "problem", id: "capacity-risk" },
      attentionPriority: "high",
      attentionReason: "Capacity Risk",
    },
    guidance: {
      guidanceSubject: { kind: "object", id: "factory" },
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity Constraint",
    },
  });
  assert.ok(context.context);
  return bindDirectorRuntimeExperienceSurfaces(context.context);
}

function partialBindings(): DirectorRuntimeExperienceSurfaceBindingResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.partial",
    consumer,
    scope: "workspace",
    mode: "goal",
    activeGoal: { kind: "goal", id: "g1" },
    guidance: {
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity",
    },
  });
  assert.ok(context.context);
  return bindDirectorRuntimeExperienceSurfaces(context.context);
}

function emptyBindings(): DirectorRuntimeExperienceSurfaceBindingResult {
  const context = bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.empty",
    consumer,
    scope: "global",
  });
  assert.ok(context.context);
  return bindDirectorRuntimeExperienceSurfaces(context.context);
}

function projectionFor(
  result: ReturnType<typeof projectDirectorRuntimeExperienceState>,
  surface: (typeof surfaces)[number],
) {
  const entry = result.projections.find((item) => item.surface === surface);
  assert.ok(entry, `expected projection for ${surface}`);
  return entry;
}

test("1. exact identity", () => {
  assert.equal(
    projectionModule.identity,
    "DRI-8:4/DirectorRuntimeExperienceStateProjection",
  );
  assert.equal(canonicalIdentity.identity, projectionModule.identity);
  assert.equal(projectionModule.phase, "DRI-8:4");
  assert.equal(projectionModule.layer, "DirectorRuntimeConsumerIntegration");
  assert.equal(projectionModule.role, "ExperienceStateProjection");
  assert.deepEqual(
    getDirectorRuntimeExperienceStateProjectionIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.4.0", () => {
  assert.equal(projectionModule.version, "8.4.0");
  assert.equal(canonicalIdentity.version, "8.4.0");
  assert.equal(registry.version, "8.4.0");
});

test("3. exact namespace", () => {
  assert.equal(
    projectionModule.namespace,
    "nexora.dri.consumer-integration.experience-state-projection",
  );
  assert.equal(canonicalIdentity.namespace, projectionModule.namespace);
});

test("4. DRI-8:3 is the sole immediate dependency", () => {
  assert.equal(
    projectionModule.upstreamDependency,
    "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding",
  );
  assert.equal(registry.dependency, projectionModule.upstreamDependency);
  assert.equal(
    projectionModule.surfaceBindingBoundary,
    "DRI-8:3-surface-binding-only",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeConsumerContextBinding|directorRuntimeConsumerIntegrationFoundation|directorRuntimeExecutiveGuidance|directorRuntimeAdaptivePresentation/,
  );
});

test("5. canonical projection statuses are unique", () => {
  assert.deepEqual([...projectionStatuses], [
    "projected",
    "partially-projected",
    "inactive",
    "unavailable",
    "invalid",
  ]);
  assert.equal(new Set(projectionStatuses).size, projectionStatuses.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceProjectionStatuses()],
    [...projectionStatuses],
  );
});

test("6. canonical activity states are unique", () => {
  assert.deepEqual([...activityStates], [
    "active",
    "supporting",
    "background",
    "inactive",
  ]);
  assert.equal(new Set(activityStates).size, activityStates.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceActivityStates()],
    [...activityStates],
  );
});

test("7. canonical visibility states are unique", () => {
  assert.deepEqual([...visibilityStates], ["visible", "hidden", "collapsed"]);
  assert.equal(new Set(visibilityStates).size, visibilityStates.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceVisibilityStates()],
    [...visibilityStates],
  );
});

test("8. canonical dominance states are unique", () => {
  assert.deepEqual([...dominanceStates], [
    "primary",
    "secondary",
    "background",
    "none",
  ]);
  assert.equal(new Set(dominanceStates).size, dominanceStates.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceDominanceStates()],
    [...dominanceStates],
  );
});

test("9. canonical presentation states are valid", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(new Set(presentationStates).size, 3);
  assert.deepEqual(
    [...listDirectorRuntimeExperiencePresentationStates()],
    [...presentationStates],
  );
});

test("10. canonical emphasis states are valid", () => {
  assert.deepEqual([...emphasisStates], [
    "none",
    "normal",
    "highlighted",
    "warning",
    "critical",
  ]);
  assert.equal(new Set(emphasisStates).size, emphasisStates.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceEmphasisStates()],
    [...emphasisStates],
  );
});

test("11. canonical interaction-readiness states are unique", () => {
  assert.deepEqual([...interactionReadinessStates], [
    "enabled",
    "limited",
    "disabled",
  ]);
  assert.equal(
    new Set(interactionReadinessStates).size,
    interactionReadinessStates.length,
  );
  assert.deepEqual(
    [...listDirectorRuntimeExperienceInteractionReadinessStates()],
    [...interactionReadinessStates],
  );
});

test("12. Stage binding produces valid Stage projection", () => {
  const stage = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  assert.equal(stage.status, "projected");
  assert.equal(stage.activity, "active");
  assert.equal(stage.dominance, "primary");
  assert.equal(stage.visibility, "visible");
  assert.ok(
    stage.presentationState === "report" ||
      stage.presentationState === "operation",
  );
  assert.equal(stage.emphasis, "warning");
  assert.equal(stage.interactionReadiness, "enabled");
  assert.equal(stage.subject?.id, "factory");
});

test("13. Advisor binding produces valid Advisor projection", () => {
  const advisor = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "advisor",
  );
  assert.equal(advisor.status, "projected");
  assert.equal(advisor.activity, "supporting");
  assert.equal(advisor.visibility, "visible");
  assert.equal(advisor.guidanceAvailability, "available");
  assert.equal(advisor.interactionReadiness, "enabled");
});

test("14. Insight binding produces valid Insight projection", () => {
  const insight = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "insight",
  );
  assert.equal(insight.status, "projected");
  assert.equal(insight.activity, "supporting");
  assert.equal(insight.visibility, "visible");
  assert.equal(insight.presentationState, "report");
  assert.equal(insight.focusedSubject?.id, "kpi-production");
});

test("15. Live Lens binding produces valid Live Lens projection", () => {
  const liveLens = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "live-lens",
  );
  assert.equal(liveLens.status, "projected");
  assert.equal(liveLens.activity, "supporting");
  assert.equal(liveLens.visibility, "visible");
  assert.equal(liveLens.focusAvailability, "available");
  assert.equal(liveLens.selectionAvailability, "available");
  assert.equal(liveLens.subject?.id, "factory");
});

test("16. Timeline binding produces valid Timeline projection", () => {
  const timeline = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "timeline",
  );
  assert.equal(timeline.status, "projected");
  assert.equal(timeline.activity, "background");
  assert.equal(timeline.visibility, "visible");
  assert.equal(timeline.temporalMode, "current");
  assert.ok(timeline.reasons.includes("temporal-context-available"));
});

test("17. Explorer binding produces valid Explorer projection", () => {
  const explorer = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "explorer",
  );
  assert.equal(explorer.status, "projected");
  assert.equal(explorer.activity, "background");
  assert.equal(explorer.visibility, "visible");
  assert.equal(explorer.subject?.id, "factory");
});

test("18. full DRI-8:3 result produces deterministic projection result", () => {
  const first = projectDirectorRuntimeExperienceState(fullBindings());
  const second = projectDirectorRuntimeExperienceState(fullBindings());
  assert.equal(first.status, "projected");
  assert.equal(first.projections.length, 6);
  assert.deepEqual(
    first.projections.map((entry) => ({
      surface: entry.surface,
      status: entry.status,
      activity: entry.activity,
      dominance: entry.dominance,
      presentationState: entry.presentationState,
      emphasis: entry.emphasis,
    })),
    second.projections.map((entry) => ({
      surface: entry.surface,
      status: entry.status,
      activity: entry.activity,
      dominance: entry.dominance,
      presentationState: entry.presentationState,
      emphasis: entry.emphasis,
    })),
  );
});

test("19. partial DRI-8:3 result produces partial projections correctly", () => {
  const result = projectDirectorRuntimeExperienceState(partialBindings());
  const advisor = projectionFor(result, "advisor");
  const insight = projectionFor(result, "insight");
  const liveLens = projectionFor(result, "live-lens");
  const explorer = projectionFor(result, "explorer");
  const stage = projectionFor(result, "stage");
  const timeline = projectionFor(result, "timeline");

  assert.equal(advisor.status, "projected");
  assert.equal(insight.status, "projected");
  assert.equal(liveLens.status, "partially-projected");
  assert.equal(explorer.status, "partially-projected");
  assert.ok(stage.status === "inactive" || stage.status === "unavailable");
  assert.ok(
    timeline.status === "inactive" || timeline.status === "unavailable",
  );
});

test("20. inactive bindings remain inactive", () => {
  const result = projectDirectorRuntimeExperienceState(partialBindings());
  const stage = projectionFor(result, "stage");
  if (stage.status === "inactive") {
    assert.equal(stage.activity, "inactive");
    assert.equal(stage.visibility, "collapsed");
    assert.equal(stage.dominance, "none");
  }
});

test("21. unavailable bindings remain unavailable", () => {
  const result = projectDirectorRuntimeExperienceState(emptyBindings());
  assert.equal(result.status, "unavailable");
  for (const entry of result.projections) {
    assert.equal(entry.status, "unavailable");
    assert.equal(entry.activity, "inactive");
    assert.equal(entry.visibility, "hidden");
    assert.equal(entry.dominance, "none");
    assert.equal(entry.subject, null);
  }
});

test("22. invalid binding result produces invalid projection result", () => {
  const invalid = projectDirectorRuntimeExperienceState({
    bindings: [],
    status: "invalid",
    activeSurfaces: [],
    inactiveSurfaces: [...surfaces],
    diagnostics: [],
    provenance: {
      sourceContextIdentity: "x",
      contextBindingIdentity: "y",
      surfaceBindingIdentity: "z",
      surfaceIdentifier: "aggregate",
    },
  } as DirectorRuntimeExperienceSurfaceBindingResult);
  assert.equal(invalid.status, "invalid");
  assert.equal(invalid.projections.length, 0);
  assert.ok(
    invalid.diagnostics.some((entry) => entry.kind === "invalid-binding"),
  );
});

test("23. active subject identity is preserved", () => {
  const stage = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  assert.equal(stage.subject?.id, "factory");
  assert.equal(stage.subject?.kind, "object");
});

test("24. selection identity is preserved where projected", () => {
  const stage = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  assert.equal(stage.selectedSubject?.id, "factory");
  assert.equal(stage.selectionAvailability, "available");
});

test("25. focus identity is preserved where projected", () => {
  const stage = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  const insight = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "insight",
  );
  assert.equal(stage.focusedSubject?.id, "kpi-production");
  assert.equal(insight.focusedSubject?.id, "kpi-production");
});

test("26. attention semantics are preserved/translated only through approved rules", () => {
  const stage = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  assert.equal(stage.attentionState, "high");
  assert.equal(stage.emphasis, "warning");
  assert.ok(stage.reasons.includes("attention-elevated"));
  assert.doesNotMatch(source, /\brecalculate|scoreAttention|rankAttention\b/i);
});

test("27. guidance is not regenerated", () => {
  assert.doesNotMatch(source, /\b(?:openai|anthropic|llm|generateGuidance)\b/i);
  const advisor = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "advisor",
  );
  assert.equal(advisor.guidanceAvailability, "available");
  assert.ok(advisor.reasons.includes("guidance-available"));
});

test("28. KPI is not calculated", () => {
  assert.doesNotMatch(
    source,
    /\b(?:calculateKpi|computeKpi|kpiScore|kpiValue)\b/i,
  );
});

test("29. KOI is not calculated", () => {
  assert.doesNotMatch(
    source,
    /\b(?:calculateKoi|computeKoi|koiScore|koiValue)\b/i,
  );
});

test("30. no synthetic business context is created", () => {
  const result = projectDirectorRuntimeExperienceState(partialBindings());
  const stage = projectionFor(result, "stage");
  assert.equal(stage.subject, null);
  assert.doesNotMatch(
    JSON.stringify(result),
    /Production Efficiency|invented|synthetic/i,
  );
});

test("31. presentation-state resolution is deterministic", () => {
  const first = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "advisor",
  );
  const second = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "advisor",
  );
  assert.equal(first.presentationState, second.presentationState);
  assert.equal(first.presentationState, "operation");
});

test("32. dominance resolution is deterministic", () => {
  const result = projectDirectorRuntimeExperienceState(fullBindings());
  assert.equal(projectionFor(result, "stage").dominance, "primary");
  assert.equal(projectionFor(result, "advisor").dominance, "secondary");
  assert.equal(projectionFor(result, "timeline").dominance, "background");
});

test("33. emphasis resolution is deterministic", () => {
  const first = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  const second = projectionFor(
    projectDirectorRuntimeExperienceState(fullBindings()),
    "stage",
  );
  assert.equal(first.emphasis, "warning");
  assert.equal(first.emphasis, second.emphasis);
});

test("34. interaction-readiness resolution is deterministic", () => {
  const result = projectDirectorRuntimeExperienceState(fullBindings());
  assert.equal(projectionFor(result, "stage").interactionReadiness, "enabled");
  assert.equal(
    projectionFor(result, "advisor").interactionReadiness,
    "enabled",
  );
  const partial = projectDirectorRuntimeExperienceState(partialBindings());
  assert.equal(
    projectionFor(partial, "live-lens").interactionReadiness,
    "disabled",
  );
});

test("35. projection reasons are deterministic", () => {
  const first = projectDirectorRuntimeExperienceState(fullBindings());
  const second = projectDirectorRuntimeExperienceState(fullBindings());
  assert.deepEqual(
    first.projections.map((entry) => [...entry.reasons]),
    second.projections.map((entry) => [...entry.reasons]),
  );
  assert.equal(new Set(projectionReasons).size, projectionReasons.length);
});

test("36. provenance is deterministic", () => {
  const bindings = fullBindings();
  const result = projectDirectorRuntimeExperienceState(bindings);
  assert.equal(
    result.provenance.sourceBindingIdentity,
    bindings.provenance.sourceContextIdentity,
  );
  assert.equal(
    result.provenance.stateProjectionIdentity,
    projectionModule.identity,
  );
  assert.equal(result.provenance.surfaceIdentifier, "aggregate");
  assert.doesNotMatch(source, /\bDate\.now\s*\(|crypto\.randomUUID\b/);
});

test("37. surface order is preserved", () => {
  const result = projectDirectorRuntimeExperienceState(fullBindings());
  assert.deepEqual(
    result.projections.map((entry) => entry.surface),
    [...surfaces],
  );
});

test("38. input bindings are not mutated", () => {
  const bindings = fullBindings();
  const snap = JSON.stringify(bindings);
  projectDirectorRuntimeExperienceState(bindings);
  assert.equal(JSON.stringify(bindings), snap);
});

test("39. projection output is immutable", () => {
  const result = projectDirectorRuntimeExperienceState(fullBindings());
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.projections), true);
  assert.equal(Object.isFrozen(result.activeProjections), true);
  assert.equal(Object.isFrozen(result.diagnostics), true);
  for (const entry of result.projections) {
    assert.equal(Object.isFrozen(entry), true);
    assert.equal(Object.isFrozen(entry.reasons), true);
    assert.equal(Object.isFrozen(entry.provenance), true);
  }
  assert.throws(() => {
    (result as { status?: string }).status = "invalid";
  });
});

test("40. registry counts are dynamically derived", () => {
  assert.equal(registry.projectionStatusCount, projectionStatuses.length);
  assert.equal(registry.activityStateCount, activityStates.length);
  assert.equal(registry.visibilityStateCount, visibilityStates.length);
  assert.equal(registry.dominanceStateCount, dominanceStates.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.emphasisStateCount, emphasisStates.length);
  assert.equal(
    registry.interactionReadinessStateCount,
    interactionReadinessStates.length,
  );
  assert.equal(registry.projectionReasonCount, projectionReasons.length);
  assert.equal(registry.diagnosticKindCount, diagnosticKinds.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(
    registry.surfaceProjectionCapabilityCount,
    surfaces.reduce(
      (total, surface) =>
        total + surfaceProjectionCapabilities[surface].length,
      0,
    ),
  );
});

test("41. verification passes", () => {
  const first = verifyDirectorRuntimeExperienceStateProjection();
  const second = verifyDirectorRuntimeExperienceStateProjection();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.dri83BoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(
    projectionModule.architecturalStatus,
    "Experience State Projection Complete · Deterministic · Immutable · Framework-Independent · ReadyForConsumerInteractionBridge",
  );
});

test("42. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)["']/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|useState|useEffect|createContext)\b/,
  );
});

test("43. no Three.js dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material|Vector3)\b/);
});

test("44. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:MouseEvent|PointerEvent|HTMLElement|addEventListener|onClick)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
});

test("45. no CSS/rendering dependency", () => {
  assert.doesNotMatch(source, /\.(?:module\.css|css)["']/);
  assert.doesNotMatch(
    source,
    /\b(?:className|zIndex|fontSize|borderRadius|boxShadow|display:\s*none)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:red|green|blue|yellow|white|black)\b/,
  );
});

test("46. no chart-library dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:recharts|chart\.js|d3|victory|nivo)["']/i,
  );
  assert.doesNotMatch(source, /\b(?:BarChart|LineChart|PieChart|generateChart)\b/);
});

test("47. no animation logic", () => {
  assert.doesNotMatch(
    source,
    /\b(?:duration|easing|spring|fade|pulse|ripple|animationDuration)\b/,
  );
});

test("48. no DRI-8:5 interaction bridging", () => {
  assert.doesNotMatch(
    source,
    /\b(?:bridgeInteraction|mapPointerEvent|translateUiEvent|ConsumerInteractionBridge)\b/,
  );
  assert.doesNotMatch(source, /\b(?:click\s*→\s*select|hover\s*→\s*focus)\b/);
});

test("49. no DRI-8:6 coordination behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:orchestrat|coordinateSurfaces|propagateSurfaceChange|ExperienceCoordination)\b/i,
  );
});

test("50. DRI-8:3 behavior remains unchanged", () => {
  const dri83 = verifyDirectorRuntimeExperienceSurfaceBinding();
  assert.equal(dri83.ok, true);
  assert.equal(
    dri83.identity,
    "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding",
  );
  assert.equal(dri83.version, "8.3.0");
  assert.doesNotMatch(source, /verifyDirectorRuntimeExperienceSurfaceBinding/);
});

test("51. single-surface resolver matches aggregate projection", () => {
  const bindings = fullBindings();
  const aggregate = projectDirectorRuntimeExperienceState(bindings);
  for (const surface of surfaces) {
    const binding = bindings.bindings.find((entry) => entry.surface === surface);
    assert.ok(binding);
    const resolved = resolveDirectorRuntimeExperienceStateProjection(binding);
    const fromAggregate = projectionFor(aggregate, surface);
    assert.equal(resolved.status, fromAggregate.status);
    assert.equal(resolved.activity, fromAggregate.activity);
    assert.equal(resolved.dominance, fromAggregate.dominance);
    assert.equal(resolved.presentationState, fromAggregate.presentationState);
    assert.deepEqual(resolved.reasons, fromAggregate.reasons);

    const fromResult = resolveDirectorRuntimeExperienceStateProjectionFromResult(
      bindings,
      surface,
    );
    assert.ok(fromResult);
    assert.equal(fromResult.status, fromAggregate.status);
  }
});

test("52. upstream DRI-8:2 / DRI-8:1 / DRI-7 remain healthy", () => {
  const dri82 = verifyDirectorRuntimeConsumerContextBinding();
  assert.equal(dri82.ok, true);
  assert.equal(dri82.version, "8.2.0");
  const dri81 = verifyDirectorRuntimeConsumerIntegrationFoundation();
  assert.equal(dri81.ok, true);
  assert.equal(dri81.version, "8.1.0");
  const dri79 = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.equal(dri79.ok, true);
});
