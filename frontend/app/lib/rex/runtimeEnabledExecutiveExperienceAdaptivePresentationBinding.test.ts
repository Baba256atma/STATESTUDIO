import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY as boundary,
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_ORDERING_RULE as orderingRule,
  EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_SAFE_FALLBACK_RULE as safeFallbackRule,
  EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES as densities,
  EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS as emphasisValues,
  EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES as priorities,
  EXECUTIVE_RUNTIME_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY as visibilityValues,
  bindExecutiveRuntimeAdvisorPresentation,
  bindExecutiveRuntimeExperiencePresentation,
  bindExecutiveRuntimeExplorerPresentation,
  bindExecutiveRuntimeInsightPresentation,
  bindExecutiveRuntimeStagePresentation,
  bindExecutiveRuntimeSubjectPresentation,
  bindExecutiveRuntimeSurfacePresentation,
  bindExecutiveRuntimeTimelinePresentation,
  createExecutiveRuntimePresentationSnapshot,
  getRuntimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
  isExecutiveRuntimePresentationDensity,
  isExecutiveRuntimePresentationEmphasis,
  isExecutiveRuntimePresentationPriority,
  isExecutiveRuntimePresentationState,
  isExecutiveRuntimePresentationVisibility,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBinding as presentationBinding,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingRegistry as registry,
  validateExecutiveRuntimeExperiencePresentationBinding,
  validateExecutiveRuntimeSubjectPresentationBinding,
  validateExecutiveRuntimeSurfacePresentationBinding,
  verifyAdaptivePresentationBinding,
  type ExecutiveRuntimeSurfacePresentationDescriptor,
} from "./runtimeEnabledExecutiveExperienceAdaptivePresentationBinding.ts";

import {
  bindExecutiveRuntimeExperienceInteractions,
  createExecutiveRuntimeInteractionSnapshot,
  runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
  verifyExecutiveInteractionBinding,
  type ExecutiveRuntimeInteractionDescriptor,
  type ExecutiveRuntimeInteractionSnapshot,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding";

import {
  bindExecutiveRuntimeScene,
  type ExecutiveRuntimeSceneSnapshot,
  verifyExecutiveSceneBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding";

import {
  bindExecutiveRuntimeExperienceState,
  verifyRuntimeContextStateBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding";

import {
  createExecutiveRuntimeAttentionContract,
  createExecutiveRuntimeAuthorityContract,
  createExecutiveRuntimeExperienceContract,
  createExecutiveRuntimeFocusContract,
  createExecutiveRuntimePresentationContract,
  createExecutiveRuntimeReadinessContract,
  createExecutiveRuntimeSubjectReference,
  createExecutiveRuntimeSurfaceContract,
  createExecutiveRuntimeSurfaceReference,
  verifyExecutiveRuntimeContracts,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts";

import {
  RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  createRuntimeExecutiveExperienceContext,
  createRuntimeExecutiveExperienceSnapshot,
  createRuntimeExecutiveSurfaceState,
  verifyRuntimeEnabledExecutiveExperienceFoundation,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperienceAdaptivePresentationBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const runtimeSource = RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;

function subject(id = "goal-1") {
  return createExecutiveRuntimeSubjectReference({
    kind: "goal",
    id,
    label: `Goal ${id}`,
  });
}

function buildSceneSnapshot(overrides?: {
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly visibility?: "visible" | "hidden" | "dimmed";
  readonly emphasis?: "none" | "low" | "medium" | "high";
}): ExecutiveRuntimeSceneSnapshot {
  const activeSubject = subject();
  const presentationState = overrides?.presentationState ?? "minimum";
  const focus = createExecutiveRuntimeFocusContract({
    focusedSubject: activeSubject,
    relationship: "primary",
    runtimeSource,
  });
  const attention = createExecutiveRuntimeAttentionContract({
    subject: activeSubject,
    level: "primary",
    persistence: "transient",
    runtimeSource,
  });
  const presentation = createExecutiveRuntimePresentationContract({
    subject: activeSubject,
    targetSurface: "stage",
    presentationState,
    visibility: overrides?.visibility ?? "visible",
    ...(overrides?.emphasis !== undefined
      ? { emphasis: overrides.emphasis }
      : {}),
    runtimeSource,
  });
  const surface = createExecutiveRuntimeSurfaceReference({
    surface: "stage",
    surfaceId: "surface.stage",
    runtimeState: "ready",
    activationState: "eligible",
  });
  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.presentation",
    runtimeState: "ready",
    activationState: "eligible",
    activeSurface: "stage",
    activeSubjectKind: "goal",
    activeSubjectId: "goal-1",
    presentationState,
    runtimeContextAvailable: true,
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });
  const snapshot = createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.pres.1",
    context,
    surfaceStates: [
      createRuntimeExecutiveSurfaceState({
        surface: "stage",
        availability: "ready",
        activation: "eligible",
        subjectKind: "goal",
        subjectId: "goal-1",
        presentationState,
      }),
    ],
    currentSubjectKind: "goal",
    currentSubjectId: "goal-1",
    runtimeReadiness: "ready",
    upstreamIntegrationIdentity: runtimeSource.authorityIdentity,
    upstreamIntegrationVersion: "1.9.0",
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });
  const experience = createExecutiveRuntimeExperienceContract({
    experienceContext: context,
    currentSnapshot: snapshot,
    activeSubject,
    activeSurface: surface,
    surfaceContracts: [
      createExecutiveRuntimeSurfaceContract({
        surface,
        currentSubject: activeSubject,
        focus,
        attention,
        presentation,
        activation: "eligible",
        readiness: "ready",
      }),
    ],
    focus,
    attention,
    presentation,
    readiness: createExecutiveRuntimeReadinessContract({
      runtimeAvailable: true,
      contextAvailable: true,
      surfaceReady: true,
      subjectReady: true,
      presentationReady: true,
      interactionReady: true,
      overallReady: true,
    }),
    authority: createExecutiveRuntimeAuthorityContract(),
    contractIdentity: "REX-1:2/ExecutiveRuntimeContracts",
    contractVersion: "1.2.0",
  });
  const bound = bindExecutiveRuntimeExperienceState({
    experienceContract: experience,
  });
  assert.ok(bound.boundState);
  const scene = bindExecutiveRuntimeScene({
    boundState: bound.boundState,
    sceneId: "scene.pres",
  });
  assert.ok(scene.sceneGraph);
  return {
    snapshotId: "snap.scene.pres",
    sceneGraph: scene.sceneGraph!,
    activeSubject,
    activeNode: scene.sceneGraph!.activeNode,
    focus: scene.sceneGraph!.activeNode?.focus,
    attention: scene.sceneGraph!.attentionNodes[0]?.attention,
    presentation: scene.sceneGraph!.presentation,
    readiness: scene.sceneGraph!.readiness,
    authority: scene.sceneGraph!.authority,
    sourceVersion: scene.sceneGraph!.sourceVersion,
    surfaceBinding: scene.surfaceBinding,
    bindingIdentity: "REX-1:4/ExecutiveSceneBinding",
    bindingVersion: "1.4.0",
  };
}

function descriptor(
  overrides?: Partial<ExecutiveRuntimeInteractionDescriptor>,
): ExecutiveRuntimeInteractionDescriptor {
  return Object.freeze({
    interactionId: "ix.select.goal-1",
    kind: "select",
    sourceSurface: "stage",
    targetSurface: "advisor",
    sourceSubject: subject(),
    targetSubject: subject(),
    eligibility: "eligible",
    availability: "ready",
    approval: "not-required",
    lifecycleState: "idle",
    ...overrides,
  });
}

function buildInteractionSnapshot(overrides?: {
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly visibility?: "visible" | "hidden" | "dimmed";
  readonly emphasis?: "none" | "low" | "medium" | "high";
}): ExecutiveRuntimeInteractionSnapshot {
  const sceneSnapshot = buildSceneSnapshot(overrides);
  const result = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [descriptor()],
  });
  assert.notEqual(result.status, "invalid");
  return createExecutiveRuntimeInteractionSnapshot({
    snapshotId: "snap.ix.pres",
    result,
    activeSubject: sceneSnapshot.activeSubject,
    activeSurface: "stage",
    sceneId: sceneSnapshot.sceneGraph.sceneId,
  });
}

test("1. exact REX-1:6 identity", () => {
  assert.equal(
    presentationBinding.identity,
    "REX-1:6/AdaptivePresentationBinding",
  );
  assert.equal(canonicalIdentity.identity, presentationBinding.identity);
  assert.equal(presentationBinding.stage, "AdaptivePresentationBinding");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.6.0", () => {
  assert.equal(presentationBinding.version, "1.6.0");
  assert.equal(registry.version, "1.6.0");
});

test("3. exact namespace", () => {
  assert.equal(
    presentationBinding.namespace,
    "nexora.rex.runtime-enabled-executive-experience.adaptive-presentation-binding",
  );
});

test("4. sole immediate dependency is REX-1:5 interaction binding", () => {
  assert.equal(
    presentationBinding.upstreamDependency,
    "REX-1:5/ExecutiveInteractionBinding",
  );
  assert.equal(
    presentationBinding.upstreamDependency,
    runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
  );
  assert.equal(
    presentationBinding.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding",
  ]);
});

test("5. forbidden direct imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|next\/router|next\/navigation)["']/i,
  );
  assert.equal(boundary.importsSceneBindingDirectly, false);
  assert.equal(boundary.importsStateBindingDirectly, false);
  assert.equal(boundary.importsContractsDirectly, false);
  assert.equal(boundary.importsFoundationDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.calculatesPresentation, false);
  assert.equal(boundary.upgradesPresentationState, false);
});

test("6. canonical presentation states", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(isExecutiveRuntimePresentationState("minimum"), true);
  assert.equal(isExecutiveRuntimePresentationState("report"), true);
  assert.equal(isExecutiveRuntimePresentationState("operation"), true);
  assert.equal(isExecutiveRuntimePresentationState("expanded"), false);
});

test("7. visibility / emphasis / priority / density vocabularies", () => {
  assert.deepEqual([...visibilityValues], [
    "visible",
    "hidden",
    "collapsed",
  ]);
  assert.deepEqual([...emphasisValues], ["none", "low", "medium", "high"]);
  assert.deepEqual([...priorities], ["low", "normal", "high", "critical"]);
  assert.deepEqual([...densities], ["compact", "balanced", "detailed"]);
  assert.equal(isExecutiveRuntimePresentationVisibility("collapsed"), true);
  assert.equal(isExecutiveRuntimePresentationEmphasis("medium"), true);
  assert.equal(isExecutiveRuntimePresentationPriority("normal"), true);
  assert.equal(isExecutiveRuntimePresentationDensity("balanced"), true);
  assert.equal(isExecutiveRuntimePresentationEmphasis("critical"), false);
  assert.equal(isExecutiveRuntimePresentationPriority("urgent"), false);
});

test("8. subject and surface presentation binding", () => {
  const authority = createExecutiveRuntimeAuthorityContract();
  const readiness = Object.freeze({
    runtimeReady: true,
    contextReady: true,
    subjectReady: true,
    surfaceReady: true,
    presentationReady: true,
    interactionReady: true,
    overallReady: true,
  });
  const subjectBound = bindExecutiveRuntimeSubjectPresentation({
    subject: subject(),
    presentationState: "minimum",
    visibility: "visible",
    emphasis: "low",
    priority: "normal",
    density: "compact",
    readiness,
    authority,
  });
  assert.equal(subjectBound.presentationState, "minimum");
  assert.equal(subjectBound.subject.kind, "goal");
  assert.equal(subjectBound.subject.id, "goal-1");
  assert.equal(validateExecutiveRuntimeSubjectPresentationBinding(subjectBound), true);

  const surfaceBound = bindExecutiveRuntimeSurfacePresentation({
    surface: "stage",
    activeSubject: subject(),
    presentationState: "report",
    visibility: "visible",
    readiness,
    authority,
  });
  assert.equal(surfaceBound.surface, "stage");
  assert.equal(surfaceBound.presentationState, "report");
  assert.equal(validateExecutiveRuntimeSurfacePresentationBinding(surfaceBound), true);
});

test("9. Stage / Advisor / Insight / Timeline / Explorer presentation", () => {
  const authority = createExecutiveRuntimeAuthorityContract();
  const readiness = Object.freeze({
    runtimeReady: true,
    contextReady: true,
    subjectReady: true,
    surfaceReady: true,
    presentationReady: true,
    interactionReady: true,
    overallReady: true,
  });
  const subjectBound = bindExecutiveRuntimeSubjectPresentation({
    subject: subject(),
    presentationState: "report",
    readiness,
    authority,
  });
  const stage = bindExecutiveRuntimeStagePresentation({
    subjectPresentations: [subjectBound],
    activeSubjectPresentation: subjectBound,
    presentationState: "report",
    density: "balanced",
    readiness,
  });
  assert.equal(stage.surface, "stage");
  assert.equal(stage.scenePresentationState, "report");

  const advisor = bindExecutiveRuntimeAdvisorPresentation({
    activeSubject: subject(),
    presentationState: "operation",
    interactionReady: true,
    readiness,
    authority,
  });
  assert.equal(advisor.surface, "advisor");
  assert.equal(advisor.presentationState, "operation");

  const insight = bindExecutiveRuntimeInsightPresentation({
    activeSubject: subject(),
    presentationState: "report",
    selectedMetricId: "m-1",
    readiness,
  });
  assert.equal(insight.surface, "insight");
  assert.equal(insight.selectedMetricId, "m-1");

  const timeline = bindExecutiveRuntimeTimelinePresentation({
    temporalContextId: "t-1",
    selectedPackId: "pack-1",
    presentationState: "minimum",
    readiness,
  });
  assert.equal(timeline.surface, "timeline");
  assert.equal(timeline.selectedPackId, "pack-1");

  const explorer = bindExecutiveRuntimeExplorerPresentation({
    collectionContextId: "col-1",
    selectedSubject: subject(),
    presentationState: "minimum",
    readiness,
  });
  assert.equal(explorer.surface, "explorer");
  assert.equal(explorer.collectionContextId, "col-1");
});

test("10. experience presentation preserves upstream presentation and authority", () => {
  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "minimum",
    visibility: "hidden",
    emphasis: "low",
  });
  const result = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  assert.ok(
    result.status === "bound" || result.status === "partial",
    `unexpected status ${result.status}`,
  );
  assert.ok(result.experiencePresentation);
  assert.equal(
    result.experiencePresentation!.presentationState,
    "minimum",
  );
  assert.equal(
    result.experiencePresentation!.authority.relationship,
    "EX-DRI → REX",
  );
  assert.equal(
    result.experiencePresentation!.stage?.scenePresentationState,
    "minimum",
  );
  // Presentation preservation: do not upgrade minimum → report.
  assert.notEqual(
    result.experiencePresentation!.presentationState,
    "report",
  );
  // Visibility preservation: hidden stays hidden (not inferred visible from focus).
  const stageSurface = result.surfacePresentations.find(
    (entry) => entry.surface === "stage",
  );
  assert.equal(stageSurface?.visibility, "hidden");
  assert.ok(
    validateExecutiveRuntimeExperiencePresentationBinding(
      result.experiencePresentation!,
    ),
  );
});

test("11. focus / attention / interaction presentation preservation", () => {
  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "report",
    emphasis: "medium",
  });
  const result = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  assert.ok(result.experiencePresentation?.focusPresentation);
  assert.equal(
    result.experiencePresentation!.focusPresentation!.subject.id,
    "goal-1",
  );
  assert.ok(result.experiencePresentation?.attentionPresentation);
  assert.equal(
    result.experiencePresentation!.attentionPresentation!.subject.id,
    "goal-1",
  );
  assert.ok(result.experiencePresentation?.interactionPresentation);
  assert.equal(
    result.experiencePresentation!.interactionPresentation!.interactionId,
    "ix.select.goal-1",
  );
  assert.equal(
    result.experiencePresentation!.interactionPresentation!.interactionKind,
    "select",
  );
});

test("12. cross-surface presentation differences without forced global state", () => {
  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "minimum",
  });
  const surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationDescriptor> =
    [
      Object.freeze({
        surface: "stage" as const,
        subject: subject(),
        presentationState: "report" as const,
        density: "detailed" as const,
      }),
      Object.freeze({
        surface: "advisor" as const,
        subject: subject(),
        presentationState: "operation" as const,
        density: "balanced" as const,
      }),
      Object.freeze({
        surface: "timeline" as const,
        subject: subject(),
        presentationState: "minimum" as const,
        density: "compact" as const,
      }),
    ];
  const result = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
    surfacePresentations,
  });
  assert.ok(result.experiencePresentation);
  assert.equal(
    result.experiencePresentation!.stage?.scenePresentationState,
    "report",
  );
  assert.equal(
    result.experiencePresentation!.advisor?.presentationState,
    "operation",
  );
  assert.equal(
    result.experiencePresentation!.timeline?.presentationState,
    "minimum",
  );
  // Experience-level presentation remains upstream minimum — not forced global.
  assert.equal(result.experiencePresentation!.presentationState, "minimum");
  assert.equal(boundary.upgradesPresentationState, false);
});

test("13. safe missing-data defaults do not fabricate aggressive presentation", () => {
  assert.equal(safeFallbackRule, "absent-metadata-remains-undefined");
  assert.equal(boundary.fabricatesCriticalEmphasis, false);
  assert.equal(boundary.fabricatesHighPriority, false);
  assert.equal(boundary.infersVisibilityFromFocus, false);

  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "minimum",
  });
  // Strip optional presentation metadata from a cloned binding view by
  // binding without surface descriptors — absent density/priority/emphasis
  // must remain undefined (never critical/high/detailed).
  const result = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  const explorer = result.experiencePresentation?.explorer;
  assert.ok(explorer);
  assert.equal(explorer!.emphasis, undefined);
  assert.equal(explorer!.density, undefined);
  const timeline = result.experiencePresentation?.timeline;
  assert.equal(timeline?.density, undefined);
  // Do not invent critical/high when absent.
  assert.notEqual(explorer!.emphasis, "high");
});

test("14. deterministic ordering preserved", () => {
  assert.equal(orderingRule, "preserve-upstream-collection-order");
  const interactionSnapshot = buildInteractionSnapshot();
  const first = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  const second = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  assert.deepEqual(
    first.surfacePresentations.map((entry) => entry.surface),
    [
      "experience",
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
    ],
  );
  assert.deepEqual(
    first.surfacePresentations.map((entry) => entry.surface),
    second.surfacePresentations.map((entry) => entry.surface),
  );
  assert.deepEqual(
    first.subjectPresentations.map((entry) => entry.subject.id),
    second.subjectPresentations.map((entry) => entry.subject.id),
  );
});

test("15. partial / unavailable / invalid binding and issue codes", () => {
  const invalid = bindExecutiveRuntimeExperiencePresentation({});
  assert.equal(invalid.status, "invalid");
  assert.ok(
    invalid.issues.some(
      (entry) => entry.code === "missing-interaction-binding",
    ),
  );
  assert.ok(
    invalid.issues.some(
      (entry) => entry.code === "missing-runtime-authority",
    ),
  );

  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "minimum",
  });
  const badDescriptor = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
    surfacePresentations: [
      Object.freeze({
        surface: "stage" as const,
        presentationState: "expanded" as unknown as "minimum",
      }),
    ],
  });
  assert.equal(badDescriptor.status, "invalid");
  assert.ok(
    badDescriptor.issues.some(
      (entry) => entry.code === "invalid-presentation-state",
    ),
  );

  assert.ok(issueCodes.includes("missing-interaction-binding"));
  assert.ok(issueCodes.includes("presentation-unavailable"));
  assert.ok(issueCodes.includes("invalid-visibility"));
  assert.ok(issueCodes.includes("invalid-emphasis"));
  assert.ok(issueCodes.includes("invalid-priority"));
  assert.ok(issueCodes.includes("invalid-density"));
  assert.ok(issueCodes.includes("surface-presentation-unavailable"));
});

test("16. snapshot creation is pure and deterministic", () => {
  const interactionSnapshot = buildInteractionSnapshot({
    presentationState: "report",
  });
  const result = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
  });
  const snapA = createExecutiveRuntimePresentationSnapshot({
    snapshotId: "snap.pres.bound",
    result,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  const snapB = createExecutiveRuntimePresentationSnapshot({
    snapshotId: "snap.pres.bound",
    result,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(snapA.snapshotId, "snap.pres.bound");
  assert.equal(snapA.bindingIdentity, presentationBinding.identity);
  assert.deepEqual(snapA, snapB);
});

test("17. no input mutation and immutable registry/guarantees", () => {
  const interactionSnapshot = buildInteractionSnapshot();
  const surfacePresentations = [
    Object.freeze({
      surface: "advisor" as const,
      presentationState: "operation" as const,
    }),
  ];
  const frozenInput = Object.freeze({
    interactionSnapshot,
    surfacePresentations: Object.freeze(surfacePresentations),
  });
  const before = JSON.stringify(frozenInput);
  bindExecutiveRuntimeExperiencePresentation(frozenInput);
  assert.equal(JSON.stringify(frozenInput), before);

  assert.equal(Object.isFrozen(presentationBinding), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(guarantees.length, 30);
  assert.equal(registrySections.length, 23);
  assert.equal(registry.guaranteeCount, 30);
  assert.equal(registry.sectionCount, 23);
});

test("18. validation helpers and verifyAdaptivePresentationBinding", () => {
  assert.equal(isExecutiveRuntimePresentationState("operation"), true);
  assert.equal(isExecutiveRuntimePresentationVisibility("visible"), true);
  assert.equal(isExecutiveRuntimePresentationEmphasis("none"), true);
  assert.equal(isExecutiveRuntimePresentationPriority("critical"), true);
  assert.equal(isExecutiveRuntimePresentationDensity("compact"), true);
  assert.equal(validateExecutiveRuntimeSubjectPresentationBinding({}), false);
  assert.equal(validateExecutiveRuntimeSurfacePresentationBinding({}), false);
  assert.equal(
    validateExecutiveRuntimeExperiencePresentationBinding({}),
    false,
  );

  const verification = verifyAdaptivePresentationBinding();
  assert.equal(verification.ok, true);
  assert.equal(verification.identity, "REX-1:6/AdaptivePresentationBinding");
  assert.equal(verification.version, "1.6.0");
  assert.equal(verification.guaranteeCount, 30);
  assert.equal(verification.interactionBindingBoundaryIntact, true);
  assert.equal(verification.frameworkIndependent, true);
  assert.equal(verification.orderingRuleValid, true);
  assert.equal(verification.safeFallbackRuleValid, true);
});

test("19. architectural dependency-boundary and no UI/AI/renderer deps", () => {
  assert.equal(boundary.soleImmediateDependency, "REX-1:5/ExecutiveInteractionBinding");
  assert.equal(boundary.consumesInteractionBindingOnly, true);
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.executesInteraction, false);
  assert.equal(boundary.calculatesFocus, false);
  assert.equal(boundary.calculatesAttention, false);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /SceneRenderer/);
  assert.doesNotMatch(source, /openai|anthropic|@ai-sdk/i);
  assert.doesNotMatch(source, /fetch\s*\(|localStorage|indexedDB/);
  assert.doesNotMatch(source, /createStore|EventEmitter|eventBus/);
  assert.ok(
    presentationBinding.forbiddenResponsibilities.includes("Stage rendering"),
  );
  assert.ok(
    presentationBinding.forbiddenResponsibilities.includes("AI reasoning"),
  );
});

test("20. upstream REX regression markers remain healthy", () => {
  assert.equal(verifyExecutiveInteractionBinding().ok, true);
  assert.equal(verifyExecutiveSceneBinding().ok, true);
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
