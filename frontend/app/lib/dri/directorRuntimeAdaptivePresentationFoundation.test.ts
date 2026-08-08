import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ATTENTION_LEVELS as attentionLevels,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES as densities,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES as interactionExposures,
  DIRECTOR_RUNTIME_PRESENTATION_FULL_CAPABILITY as fullCapability,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES as priorities,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTORS as stateDescriptors,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTOR_LIST as stateDescriptorList,
  DIRECTOR_RUNTIME_PRESENTATION_STATES as presentationStates,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES as visibilities,
  createDirectorRuntimePresentationCapability,
  createDirectorRuntimePresentationContext,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationSubject,
  directorRuntimeAdaptivePresentationFoundation as foundation,
  directorRuntimeAdaptivePresentationFoundationCanonicalIdentity as canonicalIdentity,
  directorRuntimeAdaptivePresentationFoundationRegistry as registry,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationVisibility,
  verifyDirectorRuntimeAdaptivePresentationFoundation,
  type DirectorRuntimePresentationIntent,
} from "./directorRuntimeAdaptivePresentationFoundation.ts";

const source = readFileSync(
  new URL("./directorRuntimeAdaptivePresentationFoundation.ts", import.meta.url),
  "utf8",
);

test("1. publishes exact DRI-5:1 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: foundation.phase,
    name: foundation.name,
    identity: foundation.identity,
    namespace: foundation.namespace,
    version: foundation.version,
    layer: foundation.layer,
    stage: foundation.stage,
  }, {
    phase: "DRI-5:1",
    name: "DirectorRuntimeAdaptivePresentationFoundation",
    identity: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
    namespace: "nexora.dri.adaptive-presentation.foundation",
    version: "5.1.0",
    layer: "DirectorRuntimeAdaptivePresentation",
    stage: "Foundation",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
    version: "5.1.0",
    namespace: "nexora.dri.adaptive-presentation.foundation",
    upstream: "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
  });
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(foundation.status, "FoundationReady");
  assert.equal(foundation.deterministic, true);
  assert.equal(foundation.foundation, true);
  assert.equal(foundation.rendererIndependent, true);
  assert.equal(foundation.philosophy, "meaning-not-appearance");
});

test("2. sole immediate architectural dependency is DRI-4:9 Public Index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
  );
  assert.equal(
    registry.dependency,
    "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
  );
  assert.equal(foundation.interactionOrchestrationBoundary, "DRI-4:9-public-index-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeInteractionOrchestrationPublicIndex",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeInteractionOrchestration(?:Foundation|Contracts|Intent|Focus|Reaction|Platform|Freeze|Validation|Certification)/,
  );
  assert.doesNotMatch(
    source,
    /directorRuntime(?:SceneOrchestration|StateContextBinding|Integration)(?:Foundation|PublicIndex|Contracts|Platform|Freeze)/,
  );
});

test("3. presentation states are exactly minimum, report, operation in order", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(presentationStates.length, 3);
  assert.equal(new Set(presentationStates).size, 3);
  assert.equal(Object.isFrozen(presentationStates), true);
  for (const state of presentationStates) {
    assert.equal(isDirectorRuntimePresentationState(state), true);
  }
  assert.equal(isDirectorRuntimePresentationState("Minimum"), false);
});

test("4. presentation state descriptors are semantic and renderer-neutral", () => {
  assert.equal(stateDescriptorList.length, 3);
  assert.deepEqual(stateDescriptorList.map((descriptor) => descriptor.state), [
    "minimum", "report", "operation",
  ]);
  assert.equal(stateDescriptors.minimum.informationLevel, "lowest");
  assert.equal(stateDescriptors.minimum.actionCapability, "none");
  assert.equal(stateDescriptors.report.informationLevel, "executive");
  assert.equal(stateDescriptors.report.actionCapability, "informational");
  assert.equal(stateDescriptors.operation.informationLevel, "action-capable");
  assert.equal(stateDescriptors.operation.actionCapability, "executive-operation");
  assert.equal(Object.isFrozen(stateDescriptors), true);
  assert.equal(Object.isFrozen(stateDescriptors.minimum), true);
  assert.equal(Object.isFrozen(stateDescriptorList), true);
  assert.doesNotMatch(source, /\b(?:width|height|fontSize|material|shader|opacity|cssClass)\b/);
});

test("5. attention levels are exactly normal, notice, warning, critical", () => {
  assert.deepEqual([...attentionLevels], ["normal", "notice", "warning", "critical"]);
  assert.equal(attentionLevels.length, 4);
  assert.equal(Object.isFrozen(attentionLevels), true);
  assert.equal(isDirectorRuntimeAttentionLevel("critical"), true);
  assert.equal(isDirectorRuntimeAttentionLevel("red"), false);
  assert.doesNotMatch(source, /\b(?:green|yellow|red|orange|glow|pulse|blink)\b/);
});

test("6. information densities are exactly minimal, standard, expanded", () => {
  assert.deepEqual([...densities], ["minimal", "standard", "expanded"]);
  assert.equal(densities.length, 3);
  assert.equal(Object.isFrozen(densities), true);
  assert.equal(isDirectorRuntimeInformationDensity("expanded"), true);
  assert.equal(isDirectorRuntimeInformationDensity("maximum"), false);
});

test("7. presentation state does not hard-code density mapping", () => {
  assert.doesNotMatch(
    source,
    /minimum\s*=\s*minimal|report\s*=\s*standard|operation\s*=\s*expanded/,
  );
  const intent: DirectorRuntimePresentationIntent = {
    subject: { subjectId: "kpi-1", subjectKind: "KPI" },
    state: "minimum",
    attention: "normal",
    density: "expanded",
    priority: "low",
    visibility: "visible",
    interactionExposure: "none",
  };
  const created = createDirectorRuntimePresentationIntent(intent);
  assert.equal(created.state, "minimum");
  assert.equal(created.density, "expanded");
});

test("8. priorities are exactly low, normal, high, urgent", () => {
  assert.deepEqual([...priorities], ["low", "normal", "high", "urgent"]);
  assert.equal(priorities.length, 4);
  assert.equal(Object.isFrozen(priorities), true);
  assert.equal(isDirectorRuntimePresentationPriority("urgent"), true);
  assert.equal(isDirectorRuntimePresentationPriority("critical"), false);
});

test("9. visibilities are exactly visible, hidden, collapsed", () => {
  assert.deepEqual([...visibilities], ["visible", "hidden", "collapsed"]);
  assert.equal(visibilities.length, 3);
  assert.equal(Object.isFrozen(visibilities), true);
  assert.equal(isDirectorRuntimePresentationVisibility("collapsed"), true);
  assert.equal(isDirectorRuntimePresentationVisibility("display:none"), false);
});

test("10. interaction exposures are exactly none, inspect, select, operate", () => {
  assert.deepEqual([...interactionExposures], ["none", "inspect", "select", "operate"]);
  assert.equal(interactionExposures.length, 4);
  assert.equal(Object.isFrozen(interactionExposures), true);
  assert.equal(isDirectorRuntimeInteractionExposure("operate"), true);
  assert.equal(isDirectorRuntimeInteractionExposure("onClick"), false);
  assert.doesNotMatch(source, /\b(?:onClick|onHover|onPointerDown|addEventListener)\b/);
});

test("11. subject, intent, context, and capability contracts are plain immutable data", () => {
  const subjectInput = { subjectId: "factory-01", subjectKind: "NexoraObject", namespace: "nexora" };
  const subject = createDirectorRuntimePresentationSubject(subjectInput);
  subjectInput.subjectId = "mutated";
  assert.equal(subject.subjectId, "factory-01");
  assert.equal(Object.isFrozen(subject), true);

  const intent = createDirectorRuntimePresentationIntent({
    subject,
    state: "report",
    attention: "warning",
    density: "standard",
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
  });
  assert.deepEqual(intent, {
    subject: { subjectId: "factory-01", subjectKind: "NexoraObject", namespace: "nexora" },
    state: "report",
    attention: "warning",
    density: "standard",
    priority: "high",
    visibility: "visible",
    interactionExposure: "inspect",
  });
  assert.equal(Object.isFrozen(intent), true);
  assert.equal(Object.isFrozen(intent.subject), true);

  const context = createDirectorRuntimePresentationContext({
    runtimeContextId: "runtime-1",
    sceneContextId: "scene-1",
    interactionContextId: "ix-1",
    focusContextId: "focus-1",
    metadata: { mode: "executive", rank: 1, active: true },
  });
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.metadata), true);

  const capability = createDirectorRuntimePresentationCapability({
    presentationStates: ["minimum", "report"],
    attentionLevels: ["normal"],
    informationDensities: ["minimal"],
    priorities: ["low"],
    visibilities: ["visible"],
    interactionExposures: ["none", "inspect"],
  });
  assert.equal(Object.isFrozen(capability), true);
  assert.equal(Object.isFrozen(capability.presentationStates), true);
  assert.deepEqual([...fullCapability.presentationStates], [...presentationStates]);
  assert.equal(Object.isFrozen(fullCapability), true);
});

test("12. foundation invariants are complete, ordered, and immutable", () => {
  assert.equal(invariants.length, 18);
  assert.deepEqual(invariants.map((invariant) => invariant.id), [
    "presentation-state-count",
    "presentation-state-order",
    "attention-vocabulary",
    "density-vocabulary",
    "priority-vocabulary",
    "visibility-vocabulary",
    "interaction-exposure-vocabulary",
    "renderer-independent-contracts",
    "plain-immutable-data",
    "state-density-independence",
    "attention-not-color",
    "priority-not-animation",
    "visibility-not-rendering",
    "exposure-not-handlers",
    "no-runtime-resolution",
    "no-orchestration",
    "no-rendering",
    "sole-upstream-dri-4-9",
  ]);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(invariants[0]), true);
  assert.equal(registry.invariantCount, 18);
});

test("13. foundation registry is complete, deterministic, and immutable", () => {
  assert.equal(registry.identity, foundation.identity);
  assert.equal(registry.version, foundation.version);
  assert.equal(registry.namespace, foundation.namespace);
  assert.equal(registry.presentationStateCount, 3);
  assert.equal(registry.attentionLevelCount, 4);
  assert.equal(registry.informationDensityCount, 3);
  assert.equal(registry.priorityCount, 4);
  assert.equal(registry.visibilityCount, 3);
  assert.equal(registry.interactionExposureCount, 4);
  assert.deepEqual([...registry.presentationStates], ["minimum", "report", "operation"]);
  assert.deepEqual([...registry.attentionLevels], ["normal", "notice", "warning", "critical"]);
  assert.deepEqual([...registry.informationDensities], ["minimal", "standard", "expanded"]);
  assert.deepEqual([...registry.priorities], ["low", "normal", "high", "urgent"]);
  assert.deepEqual([...registry.visibilities], ["visible", "hidden", "collapsed"]);
  assert.deepEqual([...registry.interactionExposures], ["none", "inspect", "select", "operate"]);
  assert.equal(foundation.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|performance\.now)\b/);
});

test("14. canonical registries reject practical runtime mutation", () => {
  assert.throws(() => {
    (presentationStates as unknown as string[]).push("extra");
  }, TypeError);
  assert.throws(() => {
    (attentionLevels as unknown as string[])[0] = "mutated";
  }, TypeError);
  assert.throws(() => {
    (registry as { presentationStateCount: number }).presentationStateCount = 99;
  }, TypeError);
  assert.throws(() => {
    (foundation as { version: string }).version = "0.0.0";
  }, TypeError);
  assert.throws(() => {
    (stateDescriptors.minimum as { executivePurpose: string }).executivePurpose = "x";
  }, TypeError);
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(foundation.version, "5.1.0");
});

test("15. verification API returns successful deterministic structural result", () => {
  const first = verifyDirectorRuntimeAdaptivePresentationFoundation();
  const second = verifyDirectorRuntimeAdaptivePresentationFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    presentationStateCount: first.presentationStateCount,
    attentionLevelCount: first.attentionLevelCount,
    informationDensityCount: first.informationDensityCount,
    priorityCount: first.priorityCount,
    visibilityCount: first.visibilityCount,
    interactionExposureCount: first.interactionExposureCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
    version: "5.1.0",
    namespace: "nexora.dri.adaptive-presentation.foundation",
    dependency: "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
    presentationStateCount: 3,
    attentionLevelCount: 4,
    informationDensityCount: 3,
    priorityCount: 4,
    visibilityCount: 3,
    interactionExposureCount: 4,
    invariantCount: 18,
    frozen: true,
  });
});

test("16. renderer independence — no React/UI/Three.js/CSS imports or constructs", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|CSSStyleDeclaration|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|sessionStorage|fetch)\b/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(source, /\b(?:px|rem|vw|vh)\b/);
  assert.doesNotMatch(source, /from\s+["'][^"']*\.(?:css|module\.css)["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
});

test("17. boundary protection — no resolver, orchestration, or downstream DRI-5 behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:resolvePresentation|resolveAttention|resolveDensity|resolvePriority|resolveVisibility|resolveInteraction)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:orchestratePresentation|presentationPlan|presentationOrchestrat|attentionPolicy|densityPolicy)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:centerObject|highlightObject|glowEffect|colorMapping|cameraTransition|animatePresentation)\b/,
  );
  assert.doesNotMatch(
    source,
    /DRI-5:[2-9]|PresentationIntentResolution|PresentationStateResolver|AdaptivePresentationOrchestration|AdaptivePresentationPlatform/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(
    foundation.architecturalStatus,
    "Established · Deterministic · Immutable · RendererIndependent · ReadyForPresentationIntent",
  );
});
