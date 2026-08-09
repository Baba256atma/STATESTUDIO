import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY as boundary,
  EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES as statuses,
  EXECUTIVE_RUNTIME_SCENE_ORDERING_RULE as orderingRule,
  EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS as relationshipKinds,
  EXECUTIVE_RUNTIME_SCENE_VISIBILITY as visibility,
  bindExecutiveRuntimeActiveSceneSubject,
  bindExecutiveRuntimeScene,
  bindExecutiveRuntimeSceneAttention,
  bindExecutiveRuntimeSceneEdges,
  bindExecutiveRuntimeSceneFocus,
  bindExecutiveRuntimeSceneGraph,
  bindExecutiveRuntimeSceneNodes,
  bindExecutiveRuntimeScenePresentation,
  createExecutiveRuntimeSceneSnapshot,
  getRuntimeEnabledExecutiveExperienceSceneBindingIdentity,
  isExecutiveRuntimeSceneVisibility,
  runtimeEnabledExecutiveExperienceSceneBinding as sceneBinding,
  runtimeEnabledExecutiveExperienceSceneBindingCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceSceneBindingRegistry as registry,
  validateExecutiveRuntimeSceneEdge,
  validateExecutiveRuntimeSceneGraph,
  validateExecutiveRuntimeSceneNode,
  verifyExecutiveSceneBinding,
  type ExecutiveRuntimeSceneRelationship,
} from "./runtimeEnabledExecutiveExperienceSceneBinding.ts";

import {
  bindExecutiveRuntimeExperienceState,
  runtimeEnabledExecutiveExperienceStateBindingIdentity,
  verifyRuntimeContextStateBinding,
  type BoundExecutiveRuntimeExperienceState,
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
    "./runtimeEnabledExecutiveExperienceSceneBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const runtimeSource = RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;

function subject(id: string, kind: "goal" | "object" | "pack" = "goal") {
  return createExecutiveRuntimeSubjectReference({
    kind,
    id,
    label: `${kind}:${id}`,
    parentId: kind === "goal" ? "pack-1" : undefined,
  });
}

function buildBoundState(options?: {
  readonly includeActiveSubject?: boolean;
  readonly includeFocus?: boolean;
  readonly includeAttention?: boolean;
  readonly includePresentation?: boolean;
  readonly includeStage?: boolean;
  readonly runtimeState?: "unavailable" | "ready" | "active";
  readonly overallReady?: boolean;
  readonly surfaces?: ReadonlyArray<"stage" | "advisor" | "insight" | "explorer">;
}): BoundExecutiveRuntimeExperienceState {
  const activeSubject =
    options?.includeActiveSubject === false ? undefined : subject("goal-1");
  const secondary = subject("object-1", "object");
  const focus =
    options?.includeFocus === false
      ? undefined
      : createExecutiveRuntimeFocusContract({
          focusedSubject: activeSubject ?? subject("goal-1"),
          secondarySubject: secondary,
          relationship: "primary",
          reason: "upstream",
          runtimeSource,
        });
  const attention =
    options?.includeAttention === false
      ? undefined
      : createExecutiveRuntimeAttentionContract({
          subject: activeSubject ?? subject("goal-1"),
          level: "primary",
          persistence: "sticky",
          runtimeSource,
        });
  const presentation =
    options?.includePresentation === false
      ? undefined
      : createExecutiveRuntimePresentationContract({
          subject: activeSubject ?? subject("goal-1"),
          targetSurface: "stage",
          presentationState: "report",
          visibility: "visible",
          emphasis: "high",
          runtimeSource,
        });

  const surfaceNames =
    options?.surfaces ??
    (options?.includeStage === false
      ? (["advisor", "insight"] as const)
      : (["explorer", "advisor", "stage"] as const));

  const surfaceContracts = surfaceNames.map((name) =>
    createExecutiveRuntimeSurfaceContract({
      surface: createExecutiveRuntimeSurfaceReference({
        surface: name,
        surfaceId: `surface.${name}`,
        runtimeState: options?.runtimeState ?? "ready",
        activationState: "eligible",
      }),
      currentSubject: activeSubject,
      focus,
      attention,
      presentation:
        presentation && name === "stage"
          ? presentation
          : presentation
            ? createExecutiveRuntimePresentationContract({
                ...presentation,
                targetSurface: name,
              })
            : undefined,
      activation: "eligible",
      readiness: options?.runtimeState ?? "ready",
    }),
  );

  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.scene",
    runtimeState: options?.runtimeState ?? "ready",
    activationState: "eligible",
    activeSurface: options?.includeStage === false ? "advisor" : "stage",
    activeSubjectKind: activeSubject?.kind,
    activeSubjectId: activeSubject?.id,
    presentationState: presentation?.presentationState,
    runtimeContextAvailable: options?.runtimeState !== "unavailable",
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });

  const snapshot = createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.scene.1",
    context,
    surfaceStates: surfaceNames.map((name) =>
      createRuntimeExecutiveSurfaceState({
        surface: name,
        availability: options?.runtimeState ?? "ready",
        activation: "eligible",
        subjectKind: activeSubject?.kind,
        subjectId: activeSubject?.id,
        presentationState: presentation?.presentationState,
      }),
    ),
    currentSubjectKind: activeSubject?.kind,
    currentSubjectId: activeSubject?.id,
    runtimeReadiness: options?.runtimeState ?? "ready",
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
    activeSurface:
      options?.includeStage === false
        ? createExecutiveRuntimeSurfaceReference({
            surface: "advisor",
            surfaceId: "surface.advisor",
            runtimeState: options?.runtimeState ?? "ready",
            activationState: "eligible",
          })
        : createExecutiveRuntimeSurfaceReference({
            surface: "stage",
            surfaceId: "surface.stage",
            runtimeState: options?.runtimeState ?? "ready",
            activationState: "eligible",
          }),
    surfaceContracts,
    focus,
    attention,
    presentation,
    readiness: createExecutiveRuntimeReadinessContract({
      runtimeAvailable: options?.runtimeState !== "unavailable",
      contextAvailable: true,
      surfaceReady: true,
      subjectReady: activeSubject !== undefined,
      presentationReady: presentation !== undefined,
      interactionReady: true,
      overallReady: options?.overallReady ?? true,
    }),
    authority: createExecutiveRuntimeAuthorityContract(),
    contractIdentity: "REX-1:2/ExecutiveRuntimeContracts",
    contractVersion: "1.2.0",
  });

  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experience,
  });
  assert.ok(result.boundState);
  return result.boundState!;
}

function relationship(
  id: string,
  sourceId: string,
  targetId: string,
  kind: ExecutiveRuntimeSceneRelationship["relationshipKind"] = "supports",
): ExecutiveRuntimeSceneRelationship {
  return Object.freeze({
    relationshipId: id,
    sourceSubject: subject(sourceId),
    targetSubject: subject(targetId, "object"),
    relationshipKind: kind,
    active: true,
    runtimeSource,
  });
}

test("1. exact REX-1:4 identity", () => {
  assert.equal(sceneBinding.identity, "REX-1:4/ExecutiveSceneBinding");
  assert.equal(canonicalIdentity.identity, sceneBinding.identity);
  assert.equal(sceneBinding.phase, "REX-1");
  assert.equal(sceneBinding.stage, "ExecutiveSceneBinding");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceSceneBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.4.0", () => {
  assert.equal(sceneBinding.version, "1.4.0");
  assert.equal(registry.version, "1.4.0");
});

test("3. exact namespace", () => {
  assert.equal(
    sceneBinding.namespace,
    "nexora.rex.runtime-enabled-executive-experience.scene-binding",
  );
});

test("4. sole immediate dependency is REX-1:3 state binding", () => {
  assert.equal(
    sceneBinding.upstreamDependency,
    "REX-1:3/RuntimeContextStateBinding",
  );
  assert.equal(
    sceneBinding.upstreamDependency,
    runtimeEnabledExecutiveExperienceStateBindingIdentity,
  );
  assert.equal(
    sceneBinding.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding",
  ]);
});

test("5. forbidden direct imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.importsContractsDirectly, false);
  assert.equal(boundary.importsFoundationDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
});

test("6. scene visibility vocabulary", () => {
  assert.deepEqual([...visibility], ["visible", "hidden", "collapsed"]);
  assert.equal(isExecutiveRuntimeSceneVisibility("collapsed"), true);
  assert.equal(isExecutiveRuntimeSceneVisibility("dimmed"), false);
});

test("7. subject identity preservation and no fallback inference", () => {
  const bound = buildBoundState();
  const active = bindExecutiveRuntimeActiveSceneSubject(bound);
  assert.equal(active?.id, "goal-1");
  assert.equal(active?.kind, "goal");

  const without = buildBoundState({ includeActiveSubject: false });
  assert.equal(bindExecutiveRuntimeActiveSceneSubject(without), undefined);
  assert.equal(boundary.infersActiveSubject, false);
  assert.equal(boundary.inventsSubjectIds, false);
});

test("8. node binding and deterministic ordering", () => {
  assert.equal(orderingRule, "preserve-upstream-collection-order");
  assert.match(source, /Never reorder nodes based on focus or attention/);

  const bound = buildBoundState();
  const nodes = bindExecutiveRuntimeSceneNodes(bound, "scene.rex.exp.scene");
  assert.ok(nodes.length >= 2);
  assert.equal(nodes[0]?.subject.id, "goal-1");
  assert.equal(nodes[1]?.subject.id, "object-1");
  assert.equal(nodes[0]?.nodeId, "node.goal.goal-1");
  assert.equal(validateExecutiveRuntimeSceneNode(nodes[0]!), true);
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:new\s+Object3D|new\s+Mesh|BufferGeometry|WebGLRenderer)\b/,
  );
  assert.equal(boundary.calculatesLayoutCoordinates, false);
});

test("9. edge binding and deterministic ordering", () => {
  const bound = buildBoundState();
  const nodes = bindExecutiveRuntimeSceneNodes(bound, "scene.1");
  const first = bindExecutiveRuntimeSceneEdges(
    [
      relationship("r2", "goal-1", "object-1", "influences"),
      relationship("r1", "goal-1", "object-1", "supports"),
    ],
    nodes,
  );
  assert.deepEqual(
    first.edges.map((edge) => edge.edgeId),
    ["edge.r2", "edge.r1"],
  );
  assert.equal(validateExecutiveRuntimeSceneEdge(first.edges[0]!), true);
  assert.deepEqual([...relationshipKinds], [
    "depends-on",
    "influences",
    "contains",
    "associated-with",
    "precedes",
    "supports",
  ]);
});

test("10. focus / attention / presentation preservation", () => {
  const bound = buildBoundState();
  const focus = bindExecutiveRuntimeSceneFocus(bound.focus);
  assert.equal(focus?.focusedSubject.id, "goal-1");
  assert.equal(focus?.relationship, "primary");
  assert.equal(boundary.calculatesFocus, false);

  const attention = bindExecutiveRuntimeSceneAttention(bound.attention);
  assert.equal(attention?.level, "primary");
  assert.equal(boundary.calculatesAttention, false);

  const presentation = bindExecutiveRuntimeScenePresentation(bound.presentation);
  assert.equal(presentation?.presentationState, "report");
  assert.equal(presentation?.visibility, "visible");
  assert.equal(boundary.resolvesPresentation, false);
});

test("11. Stage surface binding and runtime authority", () => {
  const bound = buildBoundState();
  const result = bindExecutiveRuntimeScene({
    boundState: bound,
    sceneId: "scene.stage",
  });
  assert.equal(result.surfaceBinding?.targetSurface, "stage");
  assert.equal(result.surfaceBinding?.stagePresent, true);
  assert.equal(result.sceneGraph?.authority.relationship, "EX-DRI → REX");
  assert.equal(result.sceneGraph?.sourceVersion, "1.9.0");
  assert.equal(boundary.rewritesRuntimeAuthority, false);
});

test("12. complete / partial / unavailable / invalid binding", () => {
  const complete = bindExecutiveRuntimeScene({
    boundState: buildBoundState(),
    relationships: [relationship("rel-1", "goal-1", "object-1")],
  });
  assert.equal(complete.status, "bound");
  assert.ok(complete.sceneGraph);
  assert.equal(validateExecutiveRuntimeSceneGraph(complete.sceneGraph!), true);

  const partial = bindExecutiveRuntimeScene({
    boundState: buildBoundState({
      includeActiveSubject: false,
      includePresentation: false,
      overallReady: false,
    }),
  });
  assert.equal(partial.status, "partial");

  const unavailable = bindExecutiveRuntimeScene({
    boundState: buildBoundState({ runtimeState: "unavailable" }),
  });
  assert.equal(unavailable.status, "unavailable");

  const invalid = bindExecutiveRuntimeScene({});
  assert.equal(invalid.status, "invalid");
  assert.ok(
    invalid.issues.some((entry) => entry.code === "missing-bound-runtime-state"),
  );
});

test("13. missing relationship source/target handling", () => {
  const bound = buildBoundState();
  const nodes = bindExecutiveRuntimeSceneNodes(bound, "scene.1");
  const missingTarget = bindExecutiveRuntimeSceneEdges(
    [relationship("missing-target", "goal-1", "missing-object")],
    nodes,
  );
  assert.equal(missingTarget.edges.length, 0);
  assert.ok(
    missingTarget.issues.some(
      (entry) => entry.code === "relationship-target-missing",
    ),
  );

  const missingSource = bindExecutiveRuntimeSceneEdges(
    [
      Object.freeze({
        relationshipId: "missing-source",
        sourceSubject: subject("ghost-goal"),
        targetSubject: subject("object-1", "object"),
        relationshipKind: "associated-with" as const,
        active: true,
        runtimeSource,
      }),
    ],
    nodes,
  );
  assert.ok(
    missingSource.issues.some(
      (entry) => entry.code === "relationship-source-missing",
    ),
  );
});

test("14. missing stage surface is partial/unavailable, not thrown", () => {
  assert.doesNotThrow(() => {
    const result = bindExecutiveRuntimeScene({
      boundState: buildBoundState({ includeStage: false }),
    });
    assert.equal(result.surfaceBinding?.stagePresent, false);
    assert.ok(
      result.issues.some((entry) => entry.code === "missing-stage-surface"),
    );
  });
});

test("15. snapshot creation is pure", () => {
  const result = bindExecutiveRuntimeScene({
    boundState: buildBoundState(),
  });
  assert.ok(result.sceneGraph);
  const snapshot = createExecutiveRuntimeSceneSnapshot({
    snapshotId: "snap.scene.bound",
    sceneGraph: result.sceneGraph!,
    surfaceBinding: result.surfaceBinding,
    timestampIso: "2026-08-08T00:00:00.000Z",
  });
  assert.equal(snapshot.snapshotId, "snap.scene.bound");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|crypto\.randomUUID\(/);
});

test("16. deterministic repeated execution and no input mutation", () => {
  const bound = buildBoundState();
  const relationships = [relationship("rel-stable", "goal-1", "object-1")];
  const input = { boundState: bound, relationships, sceneId: "scene.stable" };
  const snap = JSON.stringify(input);
  const first = bindExecutiveRuntimeScene(input);
  const second = bindExecutiveRuntimeScene(input);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), snap);
});

test("17. immutable registry / guarantees / validation", () => {
  assert.equal(guarantees.length, 30);
  assert.equal(statuses.length, 4);
  assert.equal(issueCodes.length, 12);
  assert.equal(registrySections.length, 18);
  assert.equal(Object.isFrozen(registry), true);
  assert.throws(() => {
    (visibility as unknown as string[]).push("transparent");
  });

  const verified = verifyExecutiveSceneBinding();
  assert.equal(verified.ok, true);
  assert.deepEqual(verified, verifyExecutiveSceneBinding());
  assert.equal(verified.guaranteeCount, 30);
  assert.equal(
    sceneBinding.architecturalStatus,
    "Scene Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExecutiveInteractionBinding",
  );
});

test("18. no React / Three.js / renderer / AI / persistence / network dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|three|@react-three(?:\/[^"']*)?|zustand|openai|anthropic)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:SceneRenderer|WebGLRenderer|Object3D|AnimatableObject|ExecutiveStage)\b/,
  );
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /\b(?:localStorage|sessionStorage|createStore|EventEmitter)\b/,
  );
  assert.equal(boundary.calculatesLayoutCoordinates, false);
  assert.equal(boundary.calculatesCameraBehavior, false);
  assert.equal(boundary.implementsAnimation, false);
});

test("19. graph binding helper and active node", () => {
  const bound = bindExecutiveRuntimeSceneGraph({
    boundState: buildBoundState(),
    relationships: [relationship("g1", "goal-1", "object-1")],
  });
  assert.ok(bound.graph);
  assert.equal(bound.graph?.activeNode?.subject.id, "goal-1");
  assert.equal(bound.graph?.focusedNodes.length, 2);
  assert.equal(bound.graph?.edges.length, 1);
});

test("20. REX-1:1 through REX-1:3 regression remains intact", () => {
  assert.equal(verifyRuntimeContextStateBinding().ok, true);
  assert.equal(verifyExecutiveRuntimeContracts().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceFoundation().ok, true);
});
