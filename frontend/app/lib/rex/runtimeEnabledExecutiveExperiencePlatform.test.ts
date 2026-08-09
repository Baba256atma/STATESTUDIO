import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES as apiNames,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY as boundary,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY as capabilityRegistry,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY as compatibility,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT as consumerContract,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES as guarantees,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES as issueCodes,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS as registrySections,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES as statuses,
  bindRuntimeEnabledExecutiveSurfacePlatformState,
  composeRuntimeEnabledExecutiveExperiencePlatform,
  createRuntimeEnabledExecutiveExperiencePlatformSnapshot,
  getRuntimeEnabledExecutiveExperiencePlatformIdentity,
  isRuntimeEnabledExecutiveExperiencePlatformCapability,
  isRuntimeEnabledExecutiveExperiencePlatformStatus,
  resolveRuntimeEnabledExecutiveExperiencePlatformReadiness,
  runtimeEnabledExecutiveExperiencePlatform as platform,
  runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperiencePlatformRegistry as registry,
  validateRuntimeEnabledExecutiveExperiencePlatform,
  validateRuntimeEnabledExecutiveExperiencePlatformInput,
  verifyRuntimeEnabledExecutiveExperiencePlatform,
} from "./runtimeEnabledExecutiveExperiencePlatform.ts";

import {
  bindExecutiveRuntimeExperiencePresentation,
  createExecutiveRuntimePresentationSnapshot,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
  verifyAdaptivePresentationBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding";

import {
  bindExecutiveRuntimeExperienceInteractions,
  createExecutiveRuntimeInteractionSnapshot,
  type ExecutiveRuntimeInteractionDescriptor,
  verifyExecutiveInteractionBinding,
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
    "./runtimeEnabledExecutiveExperiencePlatform.ts",
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

function buildSceneSnapshot(): ExecutiveRuntimeSceneSnapshot {
  const activeSubject = subject();
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
    presentationState: "report",
    visibility: "visible",
    emphasis: "medium",
    runtimeSource,
  });
  const surface = createExecutiveRuntimeSurfaceReference({
    surface: "stage",
    surfaceId: "surface.stage",
    runtimeState: "ready",
    activationState: "eligible",
  });
  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.platform",
    runtimeState: "ready",
    activationState: "eligible",
    activeSurface: "stage",
    activeSubjectKind: "goal",
    activeSubjectId: "goal-1",
    presentationState: "report",
    runtimeContextAvailable: true,
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });
  const snapshot = createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.plat.1",
    context,
    surfaceStates: [
      createRuntimeExecutiveSurfaceState({
        surface: "stage",
        availability: "ready",
        activation: "eligible",
        subjectKind: "goal",
        subjectId: "goal-1",
        presentationState: "report",
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
    sceneId: "scene.plat",
  });
  assert.ok(scene.sceneGraph);
  return {
    snapshotId: "snap.scene.plat",
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

function buildPresentationSnapshot() {
  const sceneSnapshot = buildSceneSnapshot();
  const interactionResult = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [descriptor()],
  });
  assert.notEqual(interactionResult.status, "invalid");
  const interactionSnapshot = createExecutiveRuntimeInteractionSnapshot({
    snapshotId: "snap.ix.plat",
    result: interactionResult,
    activeSubject: sceneSnapshot.activeSubject,
    activeSurface: "stage",
    sceneId: sceneSnapshot.sceneGraph.sceneId,
  });
  const presentationResult = bindExecutiveRuntimeExperiencePresentation({
    interactionSnapshot,
    surfacePresentations: [
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
        contextId: "advisor.ctx",
      }),
      Object.freeze({
        surface: "insight" as const,
        subject: subject(),
        presentationState: "report" as const,
        selectedMetricId: "m-1",
      }),
      Object.freeze({
        surface: "timeline" as const,
        presentationState: "minimum" as const,
        temporalContextId: "t-1",
        selectedPackId: "pack-1",
      }),
      Object.freeze({
        surface: "explorer" as const,
        subject: subject(),
        presentationState: "minimum" as const,
        collectionContextId: "col-1",
      }),
      Object.freeze({
        surface: "experience" as const,
        presentationState: "report" as const,
      }),
    ],
  });
  assert.ok(presentationResult.experiencePresentation);
  return createExecutiveRuntimePresentationSnapshot({
    snapshotId: "snap.pres.plat",
    result: presentationResult,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
}

test("1. exact REX-1:7 identity", () => {
  assert.equal(
    platform.identity,
    "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform",
  );
  assert.equal(canonicalIdentity.identity, platform.identity);
  assert.equal(platform.stage, "Platform");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperiencePlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.7.0", () => {
  assert.equal(platform.version, "1.7.0");
  assert.equal(registry.version, "1.7.0");
});

test("3. exact namespace", () => {
  assert.equal(
    platform.namespace,
    "nexora.rex.runtime-enabled-executive-experience.platform",
  );
});

test("4. sole immediate dependency is REX-1:6 adaptive presentation binding", () => {
  assert.equal(
    platform.upstreamDependency,
    "REX-1:6/AdaptivePresentationBinding",
  );
  assert.equal(
    platform.upstreamDependency,
    runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
  );
  assert.equal(
    platform.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding",
  ]);
});

test("5. forbidden direct imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|next\/router|next\/navigation)["']/i,
  );
  assert.equal(boundary.importsInteractionBindingDirectly, false);
  assert.equal(boundary.importsSceneBindingDirectly, false);
  assert.equal(boundary.importsStateBindingDirectly, false);
  assert.equal(boundary.importsContractsDirectly, false);
  assert.equal(boundary.importsFoundationDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.composesRatherThanReinvents, true);
  assert.equal(boundary.isFinalPublicConsumerIndex, false);
});

test("6. capability vocabulary and count", () => {
  assert.deepEqual([...capabilities], [
    "runtime-context",
    "runtime-state",
    "scene-binding",
    "interaction-binding",
    "adaptive-presentation",
    "surface-readiness",
    "subject-readiness",
    "runtime-authority",
    "experience-snapshot",
  ]);
  assert.equal(registry.capabilityCount, 9);
  assert.equal(isRuntimeEnabledExecutiveExperiencePlatformCapability("scene-binding"), true);
  assert.equal(
    isRuntimeEnabledExecutiveExperiencePlatformCapability("camera"),
    false,
  );
  assert.deepEqual([...capabilityRegistry], [
    "RuntimeContext",
    "RuntimeState",
    "SurfaceState",
    "Scene",
    "Interaction",
    "Presentation",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "CrossSurfaceContext",
    "Readiness",
    "RuntimeAuthority",
    "Snapshot",
    "Validation",
  ]);
  assert.equal(registry.capabilityRegistryCount, 16);
});

test("7. platform status / readiness / input validation", () => {
  assert.deepEqual([...statuses], [
    "ready",
    "partial",
    "unavailable",
    "invalid",
  ]);
  assert.equal(isRuntimeEnabledExecutiveExperiencePlatformStatus("ready"), true);
  assert.equal(
    isRuntimeEnabledExecutiveExperiencePlatformStatus("bound"),
    false,
  );
  assert.equal(validateRuntimeEnabledExecutiveExperiencePlatformInput({}), false);
  const presentationSnapshot = buildPresentationSnapshot();
  assert.equal(
    validateRuntimeEnabledExecutiveExperiencePlatformInput({
      presentationSnapshot,
    }),
    true,
  );
  const readiness = resolveRuntimeEnabledExecutiveExperiencePlatformReadiness({
    presentationReadiness: presentationSnapshot.readiness,
    authorityReady: true,
    experiencePresent: true,
    subjectReady: true,
    surfacesReady: true,
    sceneReady: true,
    interactionReady: true,
    presentationReady: true,
  });
  assert.equal(readiness.overallReady, true);
  assert.equal(readiness.authorityReady, true);
});

test("8. deterministic platform composition preserves subject/surface/authority", () => {
  const presentationSnapshot = buildPresentationSnapshot();
  const first = composeRuntimeEnabledExecutiveExperiencePlatform({
    presentationSnapshot,
  });
  const second = composeRuntimeEnabledExecutiveExperiencePlatform({
    presentationSnapshot,
  });
  assert.ok(first.platform);
  assert.ok(
    first.status === "ready" || first.status === "partial",
    `unexpected status ${first.status}`,
  );
  assert.equal(first.platform!.activeSubject?.id, "goal-1");
  assert.equal(first.platform!.activeSurface, "stage");
  assert.equal(first.platform!.authority.relationship, "EX-DRI → REX");
  assert.equal(
    first.platform!.experiencePresentation.presentationState,
    "report",
  );
  assert.equal(
    validateRuntimeEnabledExecutiveExperiencePlatform(first.platform!),
    true,
  );
  assert.deepEqual(
    first.platform!.surfaceStates.map((entry) => entry.surface),
    second.platform!.surfaceStates.map((entry) => entry.surface),
  );
  assert.deepEqual(
    first.platform!.surfaceStates.map((entry) => entry.surface),
    [
      "experience",
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
    ],
  );
});

test("9. Stage / Advisor / Insight / Timeline / Explorer platform capabilities", () => {
  const presentationSnapshot = buildPresentationSnapshot();
  const result = composeRuntimeEnabledExecutiveExperiencePlatform({
    presentationSnapshot,
  });
  const composed = result.platform!;
  assert.equal(composed.stage?.surface, "stage");
  assert.equal(composed.stage?.scenePresent, true);
  assert.equal(composed.stage?.activeSceneSubject?.id, "goal-1");
  assert.ok(composed.stage?.focus);
  assert.ok(composed.stage?.attention);

  assert.equal(composed.advisor?.surface, "advisor");
  assert.equal(composed.advisor?.presentationState, "operation");
  assert.equal(composed.advisor?.contextId, "advisor.ctx");

  assert.equal(composed.insight?.surface, "insight");
  assert.equal(composed.insight?.selectedMetricId, "m-1");

  assert.equal(composed.timeline?.surface, "timeline");
  assert.equal(composed.timeline?.selectedPackId, "pack-1");
  assert.equal(composed.timeline?.temporalContextId, "t-1");

  assert.equal(composed.explorer?.surface, "explorer");
  assert.equal(composed.explorer?.collectionContextId, "col-1");
  assert.equal(composed.explorer?.selectedSubject?.id, "goal-1");
});

test("10. cross-surface context is representational", () => {
  const presentationSnapshot = buildPresentationSnapshot();
  const result = composeRuntimeEnabledExecutiveExperiencePlatform({
    presentationSnapshot,
  });
  const cross = result.platform!.crossSurfaceContext;
  assert.ok(cross);
  assert.equal(cross!.activeSurface, "stage");
  assert.equal(cross!.sourceSurface, "stage");
  assert.equal(cross!.targetSurface, "advisor");
  assert.equal(cross!.sharedSubject?.id, "goal-1");
  assert.ok(cross!.interactionRelationship);
  assert.equal(boundary.executesInteraction, false);
});

test("11. surface platform-state binding and snapshot", () => {
  const presentationSnapshot = buildPresentationSnapshot();
  const result = composeRuntimeEnabledExecutiveExperiencePlatform({
    presentationSnapshot,
  });
  const stageState = bindRuntimeEnabledExecutiveSurfacePlatformState({
    surface: "stage",
    presentation: result.platform!.surfacePresentations.find(
      (entry) => entry.surface === "stage",
    ),
    interactionPresentation: result.platform!.interactionPresentation,
    activeSubject: result.platform!.activeSubject,
    authority: result.platform!.authority,
  });
  assert.equal(stageState.surface, "stage");
  assert.equal(stageState.sceneRelationship, "stage-scene");
  assert.equal(stageState.presentationState, "report");

  const snapA = createRuntimeEnabledExecutiveExperiencePlatformSnapshot({
    snapshotId: "snap.platform.1",
    result,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  const snapB = createRuntimeEnabledExecutiveExperiencePlatformSnapshot({
    snapshotId: "snap.platform.1",
    result,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(snapA.platformIdentity, platform.identity);
  assert.equal(snapA.activeSubject?.id, "goal-1");
  assert.deepEqual(snapA, snapB);
});

test("12. compatibility metadata, API registry, consumer contract", () => {
  assert.equal(
    compatibility.upstreamRexIdentity,
    "REX-1:6/AdaptivePresentationBinding",
  );
  assert.equal(compatibility.runtimeAuthorityRelationship, "EX-DRI → REX");
  assert.equal(compatibility.presentationCompatible, true);
  assert.equal(compatibility.interactionCompatible, true);
  assert.equal(compatibility.sceneCompatible, true);
  assert.equal(compatibility.frameworkNeutral, true);

  assert.ok(apiNames.includes("composeRuntimeEnabledExecutiveExperiencePlatform"));
  assert.ok(apiNames.includes("createRuntimeEnabledExecutiveExperiencePlatformSnapshot"));
  assert.ok(apiNames.includes("verifyRuntimeEnabledExecutiveExperiencePlatform"));
  assert.equal(registry.apiCount, apiNames.length);

  assert.equal(
    consumerContract.supportedPlatformIdentity,
    platform.identity,
  );
  assert.equal(consumerContract.consumerRole, "PlatformConsumerSurface");
  assert.equal(consumerContract.isFinalPublicConsumerIndex, false);
  assert.equal(consumerContract.runtimeAuthoritySource, "EX-DRI → REX");
  assert.equal(platform.isFinalPublicConsumerIndex, false);
});

test("13. issue codes and invalid / partial binding", () => {
  const invalid = composeRuntimeEnabledExecutiveExperiencePlatform({});
  assert.equal(invalid.status, "invalid");
  assert.ok(
    invalid.issues.some(
      (entry) => entry.code === "missing-presentation-binding",
    ),
  );
  assert.ok(
    invalid.issues.some(
      (entry) => entry.code === "missing-runtime-authority",
    ),
  );
  assert.ok(issueCodes.includes("surface-unavailable"));
  assert.ok(issueCodes.includes("scene-unavailable"));
  assert.ok(issueCodes.includes("interaction-unavailable"));
  assert.ok(issueCodes.includes("presentation-unavailable"));
  assert.ok(issueCodes.includes("readiness-incomplete"));
  assert.ok(issueCodes.includes("invalid-platform-input"));
});

test("14. immutable registry / guarantees / verification / no mutation", () => {
  const presentationSnapshot = buildPresentationSnapshot();
  const frozenInput = Object.freeze({ presentationSnapshot });
  const before = JSON.stringify(frozenInput);
  composeRuntimeEnabledExecutiveExperiencePlatform(frozenInput);
  assert.equal(JSON.stringify(frozenInput), before);

  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(guarantees.length, 30);
  assert.equal(registrySections.length, 23);
  assert.equal(registry.guaranteeCount, 30);
  assert.equal(registry.sectionCount, 23);

  const verification = verifyRuntimeEnabledExecutiveExperiencePlatform();
  assert.equal(verification.ok, true);
  assert.equal(
    verification.identity,
    "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform",
  );
  assert.equal(verification.version, "1.7.0");
  assert.equal(verification.guaranteeCount, 30);
  assert.equal(verification.presentationBindingBoundaryIntact, true);
  assert.equal(verification.frameworkIndependent, true);
  assert.equal(verification.notFinalPublicIndex, true);
  assert.equal(verification.compositionRuleValid, true);
});

test("15. no React / Three.js / renderer / AI / persistence / network dependency", () => {
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.recalculatesFocus, false);
  assert.equal(boundary.recalculatesAttention, false);
  assert.equal(boundary.independentlyResolvesPresentation, false);
  assert.equal(boundary.executesInteraction, false);
  assert.equal(boundary.calculatesSceneLayout, false);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /SceneRenderer/);
  assert.doesNotMatch(source, /openai|anthropic|@ai-sdk/i);
  assert.doesNotMatch(source, /fetch\s*\(|localStorage|indexedDB/);
  assert.doesNotMatch(source, /createStore|EventEmitter|eventBus/);
  assert.ok(
    platform.forbiddenResponsibilities.includes("React integration"),
  );
  assert.ok(
    platform.forbiddenResponsibilities.includes("Advisor AI behavior"),
  );
  assert.ok(
    platform.forbiddenResponsibilities.includes("Three.js scene integration"),
  );
});

test("16. REX-1:1 through REX-1:6 regression markers remain healthy", () => {
  assert.equal(verifyAdaptivePresentationBinding().ok, true);
  assert.equal(verifyExecutiveInteractionBinding().ok, true);
  assert.equal(verifyExecutiveSceneBinding().ok, true);
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
