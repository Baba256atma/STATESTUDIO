import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_RUNTIME_INTERACTION_APPROVAL as approvalValues,
  EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY as availabilityValues,
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY as boundary,
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY as eligibilityValues,
  EXECUTIVE_RUNTIME_INTERACTION_KINDS as kinds,
  EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES as lifecycleStates,
  EXECUTIVE_RUNTIME_INTERACTION_ORDERING_RULE as orderingRule,
  EXECUTIVE_RUNTIME_INTERACTION_SURFACES as surfaces,
  bindExecutiveRuntimeExperienceInteractions,
  bindExecutiveRuntimeInteractionApproval,
  bindExecutiveRuntimeInteractionEligibility,
  bindExecutiveRuntimeInteractionIntent,
  bindExecutiveRuntimeInteractionSource,
  bindExecutiveRuntimeInteractionTarget,
  createExecutiveRuntimeInteractionSnapshot,
  getRuntimeEnabledExecutiveExperienceInteractionBindingIdentity,
  isExecutiveRuntimeInteractionApproval,
  isExecutiveRuntimeInteractionAvailability,
  isExecutiveRuntimeInteractionEligibility,
  isExecutiveRuntimeInteractionKind,
  runtimeEnabledExecutiveExperienceInteractionBinding as interactionBinding,
  runtimeEnabledExecutiveExperienceInteractionBindingCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceInteractionBindingRegistry as registry,
  validateExecutiveRuntimeInteractionBinding,
  verifyExecutiveInteractionBinding,
  type ExecutiveRuntimeInteractionDescriptor,
} from "./runtimeEnabledExecutiveExperienceInteractionBinding.ts";

import {
  bindExecutiveRuntimeScene,
  runtimeEnabledExecutiveExperienceSceneBindingIdentity,
  verifyExecutiveSceneBinding,
  type ExecutiveRuntimeSceneSnapshot,
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
    "./runtimeEnabledExecutiveExperienceInteractionBinding.ts",
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
    runtimeSource,
  });
  const presentation = createExecutiveRuntimePresentationContract({
    subject: activeSubject,
    targetSurface: "stage",
    presentationState: "report",
    visibility: "visible",
    runtimeSource,
  });
  const surface = createExecutiveRuntimeSurfaceReference({
    surface: "stage",
    surfaceId: "surface.stage",
    runtimeState: "ready",
    activationState: "eligible",
  });
  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.interaction",
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
    snapshotId: "snap.ix.1",
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
    sceneId: "scene.ix",
  });
  assert.ok(scene.sceneGraph);
  return {
    snapshotId: "snap.scene.ix",
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

test("1. exact REX-1:5 identity", () => {
  assert.equal(
    interactionBinding.identity,
    "REX-1:5/ExecutiveInteractionBinding",
  );
  assert.equal(canonicalIdentity.identity, interactionBinding.identity);
  assert.equal(interactionBinding.stage, "ExecutiveInteractionBinding");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceInteractionBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.5.0", () => {
  assert.equal(interactionBinding.version, "1.5.0");
  assert.equal(registry.version, "1.5.0");
});

test("3. exact namespace", () => {
  assert.equal(
    interactionBinding.namespace,
    "nexora.rex.runtime-enabled-executive-experience.interaction-binding",
  );
});

test("4. sole immediate dependency is REX-1:4 scene binding", () => {
  assert.equal(
    interactionBinding.upstreamDependency,
    "REX-1:4/ExecutiveSceneBinding",
  );
  assert.equal(
    interactionBinding.upstreamDependency,
    runtimeEnabledExecutiveExperienceSceneBindingIdentity,
  );
  assert.equal(
    interactionBinding.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding",
  ]);
});

test("5. forbidden imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|next\/router|next\/navigation)["']/i,
  );
  assert.equal(boundary.importsStateBindingDirectly, false);
  assert.equal(boundary.importsContractsDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
});

test("6. interaction-kind compatibility and vocabularies", () => {
  assert.deepEqual([...kinds], [
    "select",
    "focus",
    "open",
    "inspect",
    "compare",
    "activate",
    "dismiss",
  ]);
  assert.equal(isExecutiveRuntimeInteractionKind("select"), true);
  assert.equal(isExecutiveRuntimeInteractionKind("click"), false);
  assert.deepEqual([...eligibilityValues], [
    "ineligible",
    "eligible",
    "restricted",
  ]);
  assert.deepEqual([...availabilityValues], [
    "unavailable",
    "available",
    "ready",
  ]);
  assert.deepEqual([...approvalValues], [
    "not-required",
    "required",
    "approved",
    "rejected",
  ]);
  assert.deepEqual([...lifecycleStates], [
    "idle",
    "pending",
    "active",
    "completed",
    "cancelled",
  ]);
  assert.deepEqual([...surfaces], [
    "experience",
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
  ]);
});

test("7. source / target / intent binding", () => {
  const sourceBound = bindExecutiveRuntimeInteractionSource({
    surface: "stage",
    subject: subject(),
    sceneNodeId: "node.goal.goal-1",
    runtimeSource,
  });
  const targetBound = bindExecutiveRuntimeInteractionTarget({
    surface: "advisor",
    subject: subject(),
    runtimeSource,
  });
  const intent = bindExecutiveRuntimeInteractionIntent({
    interactionId: "ix.1",
    kind: "inspect",
    source: sourceBound,
    target: targetBound,
    activeSubject: subject(),
    activeSurface: "stage",
    sceneId: "scene.ix",
  });
  assert.equal(sourceBound.surface, "stage");
  assert.equal(targetBound.surface, "advisor");
  assert.equal(intent.kind, "inspect");
  assert.equal(intent.source.surface, "stage");
  assert.equal(intent.target.surface, "advisor");
});

test("8. eligibility / approval / availability preservation", () => {
  assert.equal(
    bindExecutiveRuntimeInteractionEligibility("restricted"),
    "restricted",
  );
  assert.equal(
    bindExecutiveRuntimeInteractionEligibility(undefined),
    "ineligible",
  );
  assert.equal(boundary.fabricatesEligibility, false);
  assert.equal(
    bindExecutiveRuntimeInteractionApproval(undefined),
    "not-required",
  );
  assert.equal(
    bindExecutiveRuntimeInteractionApproval("required"),
    "required",
  );
  assert.equal(boundary.fabricatesApproval, false);
  assert.equal(isExecutiveRuntimeInteractionEligibility("eligible"), true);
  assert.equal(isExecutiveRuntimeInteractionAvailability("ready"), true);
  assert.equal(isExecutiveRuntimeInteractionApproval("approved"), true);
});

test("9. complete interaction binding with cross-surface Stage → Advisor", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const result = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        interactionId: "ix.stage-to-advisor",
        kind: "select",
        sourceSurface: "stage",
        targetSurface: "advisor",
        eligibility: "eligible",
        availability: "ready",
      }),
    ],
  });
  assert.equal(result.status, "bound");
  assert.equal(result.interactionBindings.length, 1);
  assert.equal(result.interactionBindings[0]?.source.surface, "stage");
  assert.equal(result.interactionBindings[0]?.target.surface, "advisor");
  assert.equal(
    validateExecutiveRuntimeInteractionBinding(result.interactionBindings[0]!),
    true,
  );
  assert.equal(result.stage?.surface, "stage");
  assert.equal(result.advisor?.surface, "advisor");
  assert.ok(result.stage?.eligibleKinds.includes("select"));
});

test("10. surface specialty bindings", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const result = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        interactionId: "ix.insight",
        kind: "inspect",
        sourceSurface: "insight",
        targetSurface: "stage",
        selectedMetricId: "m-1",
        eligibility: "eligible",
        availability: "ready",
      }),
      descriptor({
        interactionId: "ix.timeline",
        kind: "open",
        sourceSurface: "timeline",
        targetSurface: "stage",
        temporalContextId: "t-1",
        selectedPackId: "pack-1",
        eligibility: "eligible",
        availability: "ready",
      }),
      descriptor({
        interactionId: "ix.explorer",
        kind: "focus",
        sourceSurface: "explorer",
        targetSurface: "stage",
        collectionContextId: "col-1",
        eligibility: "eligible",
        availability: "ready",
      }),
    ],
  });
  assert.equal(result.insight?.selectedMetricId, "m-1");
  assert.equal(result.timeline?.temporalContextId, "t-1");
  assert.equal(result.timeline?.selectedPackId, "pack-1");
  assert.equal(result.explorer?.collectionContextId, "col-1");
  assert.equal(result.surfaceBindings.length, 6);
});

test("11. active interaction never fabricated", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const withoutActive = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [descriptor({ lifecycleState: "idle" })],
  });
  assert.equal(withoutActive.activeInteraction, undefined);
  assert.equal(boundary.fabricatesActiveInteraction, false);

  const withActive = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        interactionId: "ix.active",
        lifecycleState: "active",
        eligibility: "eligible",
        availability: "ready",
      }),
    ],
    activeInteractionId: "ix.active",
  });
  assert.equal(withActive.activeInteraction?.interactionId, "ix.active");
  assert.equal(withActive.activeInteraction?.state, "active");
});

test("12. deterministic ordering preserved", () => {
  assert.equal(orderingRule, "preserve-upstream-collection-order");
  const sceneSnapshot = buildSceneSnapshot();
  const result = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({ interactionId: "ix.b", kind: "open" }),
      descriptor({ interactionId: "ix.a", kind: "select" }),
    ],
  });
  assert.deepEqual(
    result.interactionBindings.map((item) => item.interactionId),
    ["ix.b", "ix.a"],
  );
});

test("13. partial / unavailable / invalid binding", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const partial = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        eligibility: "ineligible",
        availability: "available",
      }),
    ],
  });
  assert.equal(partial.status, "partial");
  assert.ok(
    partial.issues.some((entry) => entry.code === "interaction-not-eligible"),
  );

  const unavailable = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot: {
      ...sceneSnapshot,
      readiness: {
        ...sceneSnapshot.readiness,
        runtimeAvailable: false,
        overallReady: false,
      },
      sceneGraph: {
        ...sceneSnapshot.sceneGraph,
        readiness: {
          ...sceneSnapshot.sceneGraph.readiness,
          runtimeAvailable: false,
          overallReady: false,
        },
      },
    },
    interactions: [descriptor()],
  });
  assert.equal(unavailable.status, "unavailable");

  const invalid = bindExecutiveRuntimeExperienceInteractions({});
  assert.equal(invalid.status, "invalid");
  assert.ok(
    invalid.issues.some((entry) => entry.code === "missing-scene-context"),
  );
});

test("14. approval-required and invalid kind issues", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const approvalRequired = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        approval: "required",
        eligibility: "eligible",
        availability: "ready",
      }),
    ],
  });
  assert.ok(
    approvalRequired.issues.some((entry) => entry.code === "approval-required"),
  );

  const badKind = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [
      descriptor({
        kind: "click" as never,
      }),
    ],
  });
  assert.equal(badKind.status, "invalid");
  assert.ok(
    badKind.issues.some((entry) => entry.code === "invalid-interaction-kind"),
  );
});

test("15. snapshot creation is pure", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const result = bindExecutiveRuntimeExperienceInteractions({
    sceneSnapshot,
    interactions: [descriptor()],
  });
  const snapshot = createExecutiveRuntimeInteractionSnapshot({
    snapshotId: "snap.ix.bound",
    result,
    sceneId: sceneSnapshot.sceneGraph.sceneId,
    activeSubject: subject(),
    activeSurface: "stage",
    timestampIso: "2026-08-08T00:00:00.000Z",
  });
  assert.equal(snapshot.snapshotId, "snap.ix.bound");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|crypto\.randomUUID\(/);
});

test("16. deterministic repeated execution and no input mutation", () => {
  const sceneSnapshot = buildSceneSnapshot();
  const interactions = [descriptor({ interactionId: "ix.stable" })];
  const input = { sceneSnapshot, interactions };
  const snap = JSON.stringify(input);
  const first = bindExecutiveRuntimeExperienceInteractions(input);
  const second = bindExecutiveRuntimeExperienceInteractions(input);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), snap);
});

test("17. immutable registry / guarantees / validation", () => {
  assert.equal(guarantees.length, 30);
  assert.equal(issueCodes.length, 12);
  assert.equal(registrySections.length, 23);
  assert.equal(Object.isFrozen(registry), true);
  assert.throws(() => {
    (kinds as unknown as string[]).push("click");
  });
  const verified = verifyExecutiveInteractionBinding();
  assert.equal(verified.ok, true);
  assert.deepEqual(verified, verifyExecutiveInteractionBinding());
  assert.equal(
    interactionBinding.architecturalStatus,
    "Interaction Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForAdaptivePresentationBinding",
  );
});

test("18. no React / Three.js / router / AI / persistence / network dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|three|@react-three(?:\/[^"']*)?|next\/router|next\/navigation|openai|anthropic)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:addEventListener\s*\(|onClick\s*=|useRouter\s*\(|fetch\s*\()\b/,
  );
  assert.equal(boundary.executesInteractions, false);
  assert.equal(boundary.dispatchesEvents, false);
  assert.equal(boundary.navigates, false);
  assert.equal(boundary.raycasts, false);
});

test("19. REX-1:1 through REX-1:4 regression remains intact", () => {
  assert.equal(verifyExecutiveSceneBinding().ok, true);
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
