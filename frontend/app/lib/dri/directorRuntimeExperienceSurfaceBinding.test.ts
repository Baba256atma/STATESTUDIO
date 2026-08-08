import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES as availabilityStates,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS as diagnosticKinds,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS as bindingReasons,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES as bindingStatuses,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX as capabilityMatrix,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as surfaces,
  bindDirectorRuntimeExperienceSurfaces,
  directorRuntimeExperienceSurfaceBinding as binding,
  directorRuntimeExperienceSurfaceBindingApiNames as apiNames,
  directorRuntimeExperienceSurfaceBindingCanonicalIdentity as canonicalIdentity,
  directorRuntimeExperienceSurfaceBindingRegistry as registry,
  getDirectorRuntimeExperienceSurfaceBindingIdentity,
  getDirectorRuntimeExperienceSurfaceCapabilities,
  listDirectorRuntimeExperienceSurfaceBindingStatuses,
  listDirectorRuntimeExperienceSurfaces,
  resolveDirectorRuntimeExperienceSurfaceBinding,
  verifyDirectorRuntimeExperienceSurfaceBinding,
} from "./directorRuntimeExperienceSurfaceBinding.ts";

import {
  bindDirectorRuntimeConsumerContext,
  type DirectorRuntimeConsumerContext,
  verifyDirectorRuntimeConsumerContextBinding,
} from "@/app/lib/dri/directorRuntimeConsumerContextBinding";
import { verifyDirectorRuntimeConsumerIntegrationFoundation } from
  "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";
import { verifyDirectorRuntimeExecutiveGuidancePublicIndex } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExperienceSurfaceBinding.ts", import.meta.url),
  "utf8",
);

const consumer = {
  consumerId: "executive.main",
  consumerFamily: "executive-experience" as const,
};

function requireContext(
  result: ReturnType<typeof bindDirectorRuntimeConsumerContext>,
): DirectorRuntimeConsumerContext {
  assert.ok(result.context, "expected consumer context");
  return result.context;
}

function fullContext(): DirectorRuntimeConsumerContext {
  return requireContext(bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.full",
    consumer,
    scope: "workspace",
    mode: "decision",
    activeSubject: { kind: "object", id: "factory", label: "Factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production", label: "Production KPI" },
    activeGoal: { kind: "goal", id: "increase-capacity" },
    activeObject: { kind: "object", id: "factory" },
    activePack: { packId: "pack.capacity", packCategory: "decision" },
    temporal: { temporalKind: "current", timelinePosition: "now" },
    attention: {
      attentionTarget: { kind: "problem", id: "capacity-risk" },
      attentionPriority: "primary",
      attentionReason: "Capacity Risk",
    },
    guidance: {
      guidanceSubject: { kind: "object", id: "factory" },
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Bottleneck",
    },
  }));
}

function partialContext(): DirectorRuntimeConsumerContext {
  return requireContext(bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.partial",
    consumer,
    scope: "workspace",
    mode: "goal",
    activeGoal: { kind: "goal", id: "g1" },
    guidance: {
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity",
    },
  }));
}

function emptyContext(): DirectorRuntimeConsumerContext {
  return requireContext(bindDirectorRuntimeConsumerContext({
    bindingId: "ctx.empty",
    consumer,
    scope: "global",
  }));
}

function bindingFor(
  result: ReturnType<typeof bindDirectorRuntimeExperienceSurfaces>,
  surface: (typeof surfaces)[number],
) {
  const entry = result.bindings.find((item) => item.surface === surface);
  assert.ok(entry, `expected binding for ${surface}`);
  return entry;
}

test("1. exact identity", () => {
  assert.equal(
    binding.identity,
    "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "DRI-8:3");
  assert.equal(binding.layer, "DirectorRuntimeConsumerIntegration");
  assert.equal(binding.role, "ExperienceSurfaceBinding");
  assert.deepEqual(
    getDirectorRuntimeExperienceSurfaceBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.3.0", () => {
  assert.equal(binding.version, "8.3.0");
  assert.equal(canonicalIdentity.version, "8.3.0");
  assert.equal(registry.version, "8.3.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.dri.consumer-integration.experience-surface-binding",
  );
  assert.equal(canonicalIdentity.namespace, binding.namespace);
});

test("4. DRI-8:2 is the sole immediate dependency", () => {
  assert.equal(
    binding.upstreamDependency,
    "DRI-8:2/DirectorRuntimeConsumerContextBinding",
  );
  assert.equal(registry.dependency, binding.upstreamDependency);
  assert.equal(binding.contextBindingBoundary, "DRI-8:2-context-binding-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeConsumerContextBinding",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeConsumerIntegrationFoundation|directorRuntimeExecutiveGuidance|directorRuntimeAttentionFocus/,
  );
});

test("5. canonical six experience surfaces are preserved", () => {
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

test("6. surface order is deterministic", () => {
  const result = bindDirectorRuntimeExperienceSurfaces(fullContext());
  assert.deepEqual(
    result.bindings.map((entry) => entry.surface),
    [...surfaces],
  );
  const again = bindDirectorRuntimeExperienceSurfaces(fullContext());
  assert.deepEqual(
    again.bindings.map((entry) => entry.surface),
    result.bindings.map((entry) => entry.surface),
  );
});

test("7. binding statuses are canonical and unique", () => {
  assert.deepEqual([...bindingStatuses], [
    "bound",
    "partially-bound",
    "inactive",
    "unavailable",
    "invalid",
  ]);
  assert.equal(new Set(bindingStatuses).size, bindingStatuses.length);
  assert.deepEqual(
    [...listDirectorRuntimeExperienceSurfaceBindingStatuses()],
    [...bindingStatuses],
  );
});

test("8. availability states are canonical and unique", () => {
  assert.deepEqual([...availabilityStates], [
    "available",
    "partial",
    "unavailable",
  ]);
  assert.equal(new Set(availabilityStates).size, availabilityStates.length);
});

test("9. capability matrix uses valid surface identifiers", () => {
  for (const surface of surfaces) {
    assert.ok(surface in capabilityMatrix);
    assert.equal(Object.isFrozen(capabilityMatrix[surface]), true);
  }
  assert.equal(Object.keys(capabilityMatrix).length, surfaces.length);
});

test("10. capability matrix uses valid upstream capability identifiers", () => {
  const kinds = new Set(registry.surfaceCapabilities);
  for (const surface of surfaces) {
    const caps = getDirectorRuntimeExperienceSurfaceCapabilities(surface);
    assert.ok(caps.length > 0);
    assert.equal(new Set(caps).size, caps.length);
    for (const capability of caps) {
      assert.ok(kinds.has(capability), `${capability} must be known`);
    }
  }
  assert.deepEqual([...capabilityMatrix.stage], [
    "context",
    "scene",
    "presentation",
    "attention",
    "interaction",
  ]);
  assert.deepEqual([...capabilityMatrix.advisor], [
    "context",
    "guidance",
    "attention",
    "interaction",
  ]);
});

test("11. Stage receives only relevant semantic context", () => {
  const stage = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "stage",
  );
  assert.ok(stage.relevantContext.activeSubject);
  assert.ok(stage.relevantContext.selectedSubject);
  assert.ok(stage.relevantContext.focusedSubject);
  assert.ok(stage.relevantContext.attention);
  assert.equal(stage.relevantContext.guidance, undefined);
  assert.equal(stage.relevantContext.temporal, undefined);
  assert.equal(stage.relevantContext.mode, undefined);
});

test("12. Advisor receives only relevant semantic context", () => {
  const advisor = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "advisor",
  );
  assert.ok(advisor.relevantContext.activeSubject);
  assert.ok(advisor.relevantContext.guidance);
  assert.ok(advisor.relevantContext.attention);
  assert.ok(advisor.relevantContext.activeGoal);
  assert.equal(advisor.relevantContext.temporal, undefined);
  assert.equal(advisor.relevantContext.focusedSubject, undefined);
});

test("13. Insight receives only relevant semantic context", () => {
  const insight = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "insight",
  );
  assert.ok(insight.relevantContext.activeSubject);
  assert.ok(insight.relevantContext.focusedSubject);
  assert.ok(insight.relevantContext.attention);
  assert.ok(insight.relevantContext.guidance);
  assert.equal(insight.relevantContext.temporal, undefined);
  assert.equal(insight.relevantContext.mode, undefined);
});

test("14. Live Lens receives only relevant semantic context", () => {
  const liveLens = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "live-lens",
  );
  assert.ok(liveLens.relevantContext.activeSubject);
  assert.ok(liveLens.relevantContext.selectedSubject);
  assert.ok(liveLens.relevantContext.focusedSubject);
  assert.ok(liveLens.relevantContext.activeGoal);
  assert.equal(liveLens.relevantContext.guidance, undefined);
  assert.equal(liveLens.relevantContext.attention, undefined);
  assert.equal(liveLens.relevantContext.temporal, undefined);
});

test("15. Timeline receives only relevant semantic context", () => {
  const timeline = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "timeline",
  );
  assert.ok(timeline.relevantContext.temporal);
  assert.ok(timeline.relevantContext.activePack);
  assert.equal(timeline.relevantContext.activeSubject, undefined);
  assert.equal(timeline.relevantContext.guidance, undefined);
  assert.equal(timeline.relevantContext.attention, undefined);
});

test("16. Explorer receives only relevant semantic context", () => {
  const explorer = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "explorer",
  );
  assert.ok(explorer.relevantContext.activeSubject);
  assert.ok(explorer.relevantContext.activeObject);
  assert.ok(explorer.relevantContext.activePack);
  assert.equal(explorer.relevantContext.guidance, undefined);
  assert.equal(explorer.relevantContext.temporal, undefined);
  assert.equal(explorer.relevantContext.attention, undefined);
});

test("17. full consumer context can produce valid bindings", () => {
  const result = bindDirectorRuntimeExperienceSurfaces(fullContext());
  assert.equal(result.status, "bound");
  assert.equal(result.bindings.length, 6);
  for (const entry of result.bindings) {
    assert.equal(entry.status, "bound");
    assert.equal(entry.activation, "active");
  }
  assert.deepEqual([...result.activeSurfaces], [...surfaces]);
  assert.equal(result.inactiveSurfaces.length, 0);
});

test("18. partial consumer context produces deterministic partial bindings", () => {
  const result = bindDirectorRuntimeExperienceSurfaces(partialContext());
  const advisor = bindingFor(result, "advisor");
  const timeline = bindingFor(result, "timeline");
  const stage = bindingFor(result, "stage");
  assert.equal(advisor.status, "bound");
  assert.ok(advisor.relevantContext.guidance);
  assert.ok(advisor.relevantContext.activeGoal);
  assert.ok(
    timeline.status === "inactive" || timeline.status === "unavailable",
  );
  assert.ok(stage.status === "inactive" || stage.status === "unavailable");
  const again = bindDirectorRuntimeExperienceSurfaces(partialContext());
  assert.deepEqual(
    again.bindings.map((entry) => ({
      surface: entry.surface,
      status: entry.status,
    })),
    result.bindings.map((entry) => ({
      surface: entry.surface,
      status: entry.status,
    })),
  );
});

test("19. empty valid context does not throw", () => {
  assert.doesNotThrow(() => {
    bindDirectorRuntimeExperienceSurfaces(emptyContext());
  });
  const result = bindDirectorRuntimeExperienceSurfaces(emptyContext());
  assert.ok(
    result.status === "unavailable" || result.status === "inactive",
  );
  assert.equal(result.bindings.length, 6);
  for (const entry of result.bindings) {
    assert.ok(
      entry.status === "unavailable" || entry.status === "inactive",
    );
    assert.equal(entry.activation, "inactive");
  }
});

test("20. invalid context produces invalid result/diagnostics", () => {
  const invalid = bindDirectorRuntimeExperienceSurfaces({
    contextId: "",
    consumer: { consumerId: "", consumerFamily: "executive-experience" },
    scope: "workspace",
  } as unknown as DirectorRuntimeConsumerContext);
  assert.equal(invalid.status, "invalid");
  assert.equal(invalid.bindings.length, 0);
  assert.ok(
    invalid.diagnostics.some((entry) => entry.kind === "invalid-context"),
  );
});

test("21. selection semantics are preserved", () => {
  const stage = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "stage",
  );
  assert.equal(stage.relevantContext.selectedSubject?.id, "factory");
  assert.equal(stage.relevantContext.selectedSubject?.kind, "object");
});

test("22. focus semantics are preserved", () => {
  const stage = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "stage",
  );
  const insight = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "insight",
  );
  assert.equal(stage.relevantContext.focusedSubject?.id, "kpi-production");
  assert.equal(insight.relevantContext.focusedSubject?.id, "kpi-production");
  assert.notEqual(
    stage.relevantContext.selectedSubject?.id,
    stage.relevantContext.focusedSubject?.id,
  );
});

test("23. guidance is preserved without regeneration", () => {
  const advisor = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "advisor",
  );
  assert.equal(advisor.relevantContext.guidance?.guidanceIntent, "inspect");
  assert.equal(
    advisor.relevantContext.guidance?.guidanceReason,
    "Inspect Bottleneck",
  );
  assert.doesNotMatch(source, /\b(?:openai|anthropic|llm|generateGuidance)\b/i);
});

test("24. attention is preserved without recalculation", () => {
  const stage = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "stage",
  );
  assert.equal(
    stage.relevantContext.attention?.attentionReason,
    "Capacity Risk",
  );
  assert.equal(stage.relevantContext.attention?.attentionPriority, "primary");
  assert.doesNotMatch(source, /\brecalculate|scoreAttention|rankAttention\b/i);
});

test("25. temporal context is preserved without Timeline behavior", () => {
  const timeline = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "timeline",
  );
  assert.equal(timeline.relevantContext.temporal?.temporalKind, "current");
  assert.equal(timeline.relevantContext.temporal?.timelinePosition, "now");
  assert.doesNotMatch(
    source,
    /\b(?:renderTimeline|replay|writeJournal|seekTimeline)\b/,
  );
});

test("26. no synthetic business context is created", () => {
  const result = bindDirectorRuntimeExperienceSurfaces(partialContext());
  const stage = bindingFor(result, "stage");
  assert.equal(stage.relevantContext.activeObject, undefined);
  assert.equal(stage.relevantContext.attention, undefined);
  assert.doesNotMatch(
    JSON.stringify(result),
    /Production Efficiency|invented|synthetic/i,
  );
});

test("27. binding reasons are deterministic", () => {
  const first = bindDirectorRuntimeExperienceSurfaces(fullContext());
  const second = bindDirectorRuntimeExperienceSurfaces(fullContext());
  assert.deepEqual(
    first.bindings.map((entry) => [...entry.bindingReasons]),
    second.bindings.map((entry) => [...entry.bindingReasons]),
  );
  const stage = bindingFor(first, "stage");
  assert.ok(stage.bindingReasons.includes("active-subject-relevant"));
  assert.ok(stage.bindingReasons.includes("focus-relevant"));
  assert.ok(stage.bindingReasons.includes("attention-required"));
  assert.equal(new Set(bindingReasons).size, bindingReasons.length);
});

test("28. provenance is deterministic", () => {
  const context = fullContext();
  const result = bindDirectorRuntimeExperienceSurfaces(context);
  assert.equal(result.provenance.sourceContextIdentity, context.contextId);
  assert.equal(
    result.provenance.contextBindingIdentity,
    context.provenance.bindingIdentity,
  );
  assert.equal(
    result.provenance.surfaceBindingIdentity,
    binding.identity,
  );
  assert.equal(result.provenance.surfaceIdentifier, "aggregate");
  const stage = bindingFor(result, "stage");
  assert.equal(stage.provenance.surfaceIdentifier, "stage");
  assert.doesNotMatch(source, /\bDate\.now\s*\(|crypto\.randomUUID\b/);
});

test("29. input is not mutated", () => {
  const context = fullContext();
  const snap = JSON.stringify(context);
  bindDirectorRuntimeExperienceSurfaces(context);
  assert.equal(JSON.stringify(context), snap);
});

test("30. output bindings are immutable", () => {
  const result = bindDirectorRuntimeExperienceSurfaces(fullContext());
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.bindings), true);
  assert.equal(Object.isFrozen(result.activeSurfaces), true);
  assert.equal(Object.isFrozen(result.diagnostics), true);
  for (const entry of result.bindings) {
    assert.equal(Object.isFrozen(entry), true);
    assert.equal(Object.isFrozen(entry.relevantContext), true);
    assert.equal(Object.isFrozen(entry.bindingReasons), true);
    assert.equal(Object.isFrozen(entry.capabilities), true);
  }
  assert.throws(() => {
    (result as { status?: string }).status = "invalid";
  });
});

test("31. registry counts are dynamically derived", () => {
  assert.equal(registry.surfaceCount, surfaces.length);
  assert.equal(registry.bindingStatusCount, bindingStatuses.length);
  assert.equal(registry.availabilityStateCount, availabilityStates.length);
  assert.equal(registry.bindingReasonCount, bindingReasons.length);
  assert.equal(registry.diagnosticKindCount, diagnosticKinds.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(
    registry.capabilityMatrixEntryCount,
    surfaces.reduce(
      (total, surface) => total + capabilityMatrix[surface].length,
      0,
    ),
  );
  assert.deepEqual([...registrySections], [
    "identity",
    "dependency",
    "surfaces",
    "binding-statuses",
    "availability-states",
    "surface-capabilities",
    "binding-reasons",
    "diagnostics",
    "provenance",
    "guarantees",
  ]);
});

test("32. verification passes", () => {
  const first = verifyDirectorRuntimeExperienceSurfaceBinding();
  const second = verifyDirectorRuntimeExperienceSurfaceBinding();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.surfaceCount, 6);
  assert.equal(first.bindingStatusCount, 5);
  assert.equal(first.dri82BoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.capabilityMatrixValid, true);
  assert.equal(
    binding.architecturalStatus,
    "Experience Surface Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExperienceStateProjection",
  );
});

test("33. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)["']/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|useState|useEffect|createContext)\b/,
  );
});

test("34. no Three.js dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material|Vector3)\b/);
});

test("35. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:MouseEvent|PointerEvent|HTMLElement|addEventListener|onClick)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
});

test("36. no Executive component dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens)\b/,
  );
});

test("37. no state projection behavior from DRI-8:4 is introduced", () => {
  assert.doesNotMatch(
    source,
    /\b(?:dominance|presentationState|emphasis|visibility\s*=\s*["']dimmed)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:projectDirectorRuntimeExperience|ExperienceStateProjection)\b/,
  );
  const stage = bindingFor(
    bindDirectorRuntimeExperienceSurfaces(fullContext()),
    "stage",
  );
  assert.equal("dominance" in stage.relevantContext, false);
  assert.equal("presentationState" in stage, false);
});

test("38. no interaction bridge behavior from DRI-8:5 is introduced", () => {
  assert.doesNotMatch(
    source,
    /\b(?:onClick|bridgeInteraction|mapPointerEvent|translateUiEvent)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ConsumerInteractionBridge|click\s*→\s*select)\b/,
  );
});

test("39. no cross-surface orchestration from DRI-8:6 is introduced", () => {
  assert.doesNotMatch(
    source,
    /\b(?:orchestrat|coordinateSurfaces|propagateSurfaceChange|ExperienceCoordination)\b/i,
  );
  const result = bindDirectorRuntimeExperienceSurfaces(fullContext());
  // Shared subject ids are references only — not orchestration side effects.
  for (const entry of result.bindings) {
    assert.ok(Array.isArray(entry.sharedSubjectIds));
  }
});

test("40. DRI-8:2 behavior remains unchanged", () => {
  const dri82 = verifyDirectorRuntimeConsumerContextBinding();
  assert.equal(dri82.ok, true);
  assert.equal(
    dri82.identity,
    "DRI-8:2/DirectorRuntimeConsumerContextBinding",
  );
  assert.equal(dri82.version, "8.2.0");
  assert.doesNotMatch(source, /verifyDirectorRuntimeConsumerContextBinding/);
});

test("41. single-surface resolver matches aggregate binding", () => {
  const context = fullContext();
  const aggregate = bindDirectorRuntimeExperienceSurfaces(context);
  for (const surface of surfaces) {
    const resolved = resolveDirectorRuntimeExperienceSurfaceBinding(
      context,
      surface,
    );
    assert.ok(resolved);
    const fromAggregate = bindingFor(aggregate, surface);
    assert.equal(resolved.status, fromAggregate.status);
    assert.deepEqual(resolved.relevantContext, fromAggregate.relevantContext);
    assert.deepEqual(resolved.bindingReasons, fromAggregate.bindingReasons);
  }
});

test("42. DRI-8:1 and DRI-7 upstream remain healthy", () => {
  const foundation = verifyDirectorRuntimeConsumerIntegrationFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(foundation.version, "8.1.0");
  const publicIndex = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    publicIndex.identity,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
});
