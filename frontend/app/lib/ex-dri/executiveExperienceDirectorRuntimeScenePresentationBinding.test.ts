import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES as surfaces,
  EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS as changeKinds,
  EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS as deferredKinds,
  EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS as supportedKinds,
  EXECUTIVE_SCENE_SUBJECT_ROLES as sceneRoles,
  areExecutiveScenePresentationProjectionsEqual,
  areExecutiveSceneProjectionsEqual,
  bindDirectorRuntimeAttentionDirection,
  bindDirectorRuntimeDirectionsToExecutiveScenePresentation,
  bindDirectorRuntimeFocusDirection,
  bindDirectorRuntimePresentationDirection,
  bindDirectorRuntimeResponseToExecutiveScenePresentation,
  bindDirectorRuntimeSceneDirection,
  diffExecutiveScenePresentationProjection,
  executiveExperienceDirectorRuntimeScenePresentationBinding as binding,
  executiveExperienceDirectorRuntimeScenePresentationBindingApiNames as apiNames,
  executiveExperienceDirectorRuntimeScenePresentationBindingCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeScenePresentationBindingRegistry as registry,
  getExecutiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
  getScenePresentationDirectionSupport,
  isExecutiveScenePresentationBindingResult,
  isExecutiveSceneProjection,
  verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding,
} from "./executiveExperienceDirectorRuntimeScenePresentationBinding.ts";

import {
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeInteractionBindingIdentity,
  verifyExecutiveExperienceDirectorRuntimeInteractionBinding,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding";

import {
  verifyExecutiveExperienceDirectorRuntimeContextStateBinding,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding";

import {
  verifyExecutiveExperienceDirectorRuntimeIntegrationContracts,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts";

import {
  verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation";

import {
  directorRuntimeConsumerIntegrationPublicIndexIdentity,
  verifyDirectorRuntimeConsumerIntegrationPublicIndex,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex";

const source = readFileSync(
  new URL(
    "./executiveExperienceDirectorRuntimeScenePresentationBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const factory = Object.freeze({
  id: "factory-1",
  kind: "object" as const,
  label: "Factory",
});
const supplier = Object.freeze({
  id: "supplier-1",
  kind: "object" as const,
  label: "Supplier",
});
const warehouse = Object.freeze({
  id: "warehouse-1",
  kind: "object" as const,
  label: "Warehouse",
});
const production = Object.freeze({
  id: "production-1",
  kind: "object" as const,
  label: "Production",
});
const throughputKpi = Object.freeze({
  id: "kpi-throughput",
  kind: "kpi" as const,
  label: "Throughput KPI",
});

test("1. exact EX-DRI-5 identity", () => {
  assert.equal(
    binding.identity,
    "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "EX-DRI-5");
  assert.equal(
    binding.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
  );
  assert.equal(binding.status, "ScenePresentationBindingReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeScenePresentationBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.5.0", () => {
  assert.equal(binding.version, "1.5.0");
  assert.equal(canonicalIdentity.version, "1.5.0");
  assert.equal(registry.version, "1.5.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.ex.dri.integration.scene-presentation-binding",
  );
});

test("4. architectural role", () => {
  assert.equal(
    binding.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
  );
});

test("5. sole immediate dependency is EX-DRI-4", () => {
  assert.equal(
    binding.upstreamDependency,
    "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
  );
  assert.equal(
    binding.upstreamDependency,
    executiveExperienceDirectorRuntimeInteractionBindingIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|nol|ex-dri\/executiveExperienceDirectorRuntime(?:Integration|ContextState))[^"']*["']/,
  );
});

test("6. scene binding preserves semantic composition without renderer data", () => {
  const scene = bindDirectorRuntimeSceneDirection(
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [supplier, warehouse, production],
    }),
  );
  assert.equal(isExecutiveSceneProjection(scene), true);
  assert.equal(scene.surface, "stage");
  assert.equal(scene.primarySubject?.id, "factory-1");
  assert.deepEqual(
    scene.relatedSubjects.map((subject) => subject.id),
    ["supplier-1", "warehouse-1", "production-1"],
  );
  assert.equal(scene.subjects[0]?.role, "primary");
  assert.doesNotMatch(
    JSON.stringify(scene),
    /Vector3|Object3D|x=|y=|z=|camera|opacity|mesh|material/,
  );
});

test("7. focus binding is semantic and distinct from selection", () => {
  const focus = bindDirectorRuntimeFocusDirection(
    createExecutiveRuntimeDirectionContract({
      kind: "focus",
      surface: "stage",
      subject: throughputKpi,
      role: "focused",
    }),
  );
  assert.equal(focus.subject?.id, "kpi-throughput");
  assert.equal(focus.role, "focused");
  assert.doesNotMatch(JSON.stringify(focus), /camera|zoom|lookAt|selected/);
});

test("8. attention binding preserves level/reason without color policy", () => {
  const attention = bindDirectorRuntimeAttentionDirection(
    createExecutiveRuntimeDirectionContract({
      kind: "attention",
      surface: "stage",
      subject: factory,
      level: "primary",
      reason: "runtime-selection",
    }),
  );
  assert.equal(attention.subject.id, "factory-1");
  assert.equal(attention.level, "primary");
  assert.equal(attention.reason, "runtime-selection");
  assert.doesNotMatch(
    JSON.stringify(attention),
    /"#|red|green|yellow|opacity|pulse|glow/,
  );
});

test("9. presentation binding supports exact states only", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  for (const state of presentationStates) {
    const projection = bindDirectorRuntimePresentationDirection(
      createExecutiveRuntimeDirectionContract({
        kind: "presentation",
        surface: "stage",
        subject: factory,
        state,
      }),
    );
    assert.equal(projection.state, state);
  }
});

test("10. selection/focus separation remains representable", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [],
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "focus",
      surface: "stage",
      subject: throughputKpi,
      role: "focused",
    }),
  ]);
  assert.equal(result.status, "bound");
  assert.equal(result.projection?.scene?.primarySubject?.id, "factory-1");
  assert.equal(result.projection?.focus[0]?.subject?.id, "kpi-throughput");
  assert.notEqual(
    result.projection?.scene?.primarySubject?.id,
    result.projection?.focus[0]?.subject?.id,
  );
});

test("11. composite binding produces deterministic projection", () => {
  const directions = [
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [supplier, warehouse],
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "focus",
      surface: "stage",
      subject: throughputKpi,
      role: "focused",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "attention",
      surface: "stage",
      subject: factory,
      level: "primary",
      reason: "high-attention",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "presentation",
      surface: "stage",
      subject: factory,
      state: "report",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "presentation",
      surface: "stage",
      subject: throughputKpi,
      state: "report",
    }),
  ];

  const first =
    bindDirectorRuntimeDirectionsToExecutiveScenePresentation(directions);
  const second =
    bindDirectorRuntimeDirectionsToExecutiveScenePresentation(directions);

  assert.equal(first.status, "bound");
  assert.ok(first.projection);
  assert.equal(first.projection.scene?.primarySubject?.id, "factory-1");
  assert.deepEqual(
    first.projection.scene?.relatedSubjects.map((s) => s.id),
    ["supplier-1", "warehouse-1"],
  );
  assert.equal(first.projection.focus[0]?.subject?.id, "kpi-throughput");
  assert.equal(first.projection.attention[0]?.level, "primary");
  assert.equal(first.projection.presentation.length, 2);
  assert.equal(
    areExecutiveScenePresentationProjectionsEqual(
      first.projection,
      second.projection!,
    ),
    true,
  );
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.projection), true);
});

test("12. deferred directions are explicit", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      messageKey: "hint",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "coordination",
      sourceSurface: "stage",
      targetSurfaces: ["advisor", "insight"],
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "interaction",
      surface: "stage",
      interaction: "select",
    }),
  ]);
  assert.equal(result.status, "partial");
  assert.equal(result.deferredDirections.length, 3);
  assert.deepEqual(
    result.deferredDirections.map((direction) => direction.kind),
    ["guidance", "coordination", "interaction"],
  );
  assert.deepEqual([...deferredKinds], [
    "guidance",
    "interaction",
    "coordination",
  ]);
  assert.equal(getScenePresentationDirectionSupport("guidance"), "deferred");
});

test("13. runtime response statuses are preserved", () => {
  const resolved = bindDirectorRuntimeResponseToExecutiveScenePresentation(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C1" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "report",
        }),
      ],
    }),
  );
  assert.equal(resolved.status, "bound");

  const partial = bindDirectorRuntimeResponseToExecutiveScenePresentation(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C2" },
      status: "partial",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "focus",
          surface: "stage",
          subject: factory,
          role: "focused",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
        }),
      ],
    }),
  );
  assert.equal(partial.status, "partial");
  assert.equal(partial.deferredDirections.length, 1);

  const rejected = bindDirectorRuntimeResponseToExecutiveScenePresentation(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C3" },
      status: "rejected",
      directions: [],
    }),
  );
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.projection, undefined);

  const noop = bindDirectorRuntimeResponseToExecutiveScenePresentation(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C4" },
      status: "noop",
      directions: [],
    }),
  );
  assert.equal(noop.status, "noop");
  assert.equal(noop.projection, undefined);
});

test("14. conflict detection for presentation / focus / subject identity", () => {
  const presentationConflict =
    bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
      createExecutiveRuntimeDirectionContract({
        kind: "presentation",
        surface: "stage",
        subject: factory,
        state: "minimum",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "presentation",
        surface: "stage",
        subject: factory,
        state: "operation",
      }),
    ]);
  assert.equal(presentationConflict.status, "rejected");
  assert.ok(
    presentationConflict.issues.some(
      (entry) => entry.code === "CONFLICTING_PRESENTATION_STATE",
    ),
  );

  const identityConflict =
    bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
      createExecutiveRuntimeDirectionContract({
        kind: "scene",
        surface: "stage",
        primarySubject: { id: "factory-1", kind: "object" },
        relatedSubjects: [],
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "focus",
        surface: "stage",
        subject: { id: "factory-1", kind: "kpi" },
        role: "focused",
      }),
    ]);
  assert.equal(identityConflict.status, "rejected");
  assert.ok(
    identityConflict.issues.some(
      (entry) => entry.code === "SUBJECT_IDENTITY_CONFLICT",
    ),
  );

  const duplicatePrimary =
    bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
      createExecutiveRuntimeDirectionContract({
        kind: "scene",
        surface: "stage",
        primarySubject: factory,
        relatedSubjects: [factory],
      }),
    ]);
  assert.equal(duplicatePrimary.status, "rejected");
  assert.ok(
    duplicatePrimary.issues.some(
      (entry) => entry.code === "DUPLICATE_SCENE_SUBJECT",
    ),
  );
});

test("15. related-subject order is preserved", () => {
  const scene = bindDirectorRuntimeSceneDirection(
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [warehouse, supplier, production],
    }),
  );
  assert.deepEqual(
    scene.relatedSubjects.map((subject) => subject.label),
    ["Warehouse", "Supplier", "Production"],
  );
});

test("16. semantic diffs detect visual-state changes", () => {
  const left = bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [supplier],
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "focus",
      surface: "stage",
      subject: factory,
      role: "focused",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "attention",
      surface: "stage",
      subject: factory,
      level: "primary",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "presentation",
      surface: "stage",
      subject: factory,
      state: "minimum",
    }),
  ]).projection!;

  const right = bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: warehouse,
      relatedSubjects: [supplier, production],
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "focus",
      surface: "stage",
      subject: throughputKpi,
      role: "focused",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "attention",
      surface: "stage",
      subject: factory,
      level: "secondary",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "presentation",
      surface: "stage",
      subject: factory,
      state: "report",
    }),
  ]).projection!;

  const diff = diffExecutiveScenePresentationProjection(left, right);
  assert.equal(diff.changed, true);
  assert.deepEqual([...diff.changes], [...changeKinds]);
  assert.doesNotMatch(JSON.stringify(diff), /animate|camera|fade|opacity/);
  assert.equal(areExecutiveSceneProjectionsEqual(left.scene!, left.scene!), true);
});

test("17. immutability of inputs and projections", () => {
  const direction = createExecutiveRuntimeDirectionContract({
    kind: "scene",
    surface: "stage",
    primarySubject: factory,
    relatedSubjects: [supplier],
  });
  const snap = JSON.stringify(direction);
  const result = bindDirectorRuntimeDirectionsToExecutiveScenePresentation([
    direction,
  ]);
  assert.equal(JSON.stringify(direction), snap);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.projection), true);
  assert.equal(Object.isFrozen(binding), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.throws(() => {
    (supportedKinds as unknown as string[]).push("guidance");
  });
});

test("18. framework / renderer isolation", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|@react-three(?:\/[^"']*)?|zustand|redux|framer-motion)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:Vector3|Object3D|Mesh|Camera|HTMLElement|window|document|ReactNode|JSX)\b/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|lib\/(?:dri|nol))[^"']*["']/,
  );
});

test("19. catalogs and verification", () => {
  assert.deepEqual([...supportedKinds], [
    "scene",
    "focus",
    "attention",
    "presentation",
  ]);
  assert.deepEqual([...deferredKinds], [
    "guidance",
    "interaction",
    "coordination",
  ]);
  assert.deepEqual([...sceneRoles], ["primary", "related", "contextual"]);
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  assert.equal(guarantees.length, 30);
  assert.equal(issueCodes.length, 15);
  assert.deepEqual([...registrySections], [
    "Identity",
    "SupportedDirections",
    "Scene",
    "Focus",
    "Attention",
    "Presentation",
    "CompositeBinding",
    "Diffing",
    "Validation",
    "IssueCodes",
    "Guarantees",
    "Compatibility",
  ]);

  const first =
    verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding();
  const second =
    verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(isExecutiveScenePresentationBindingResult({
    status: "noop",
    issues: [],
    deferredDirections: [],
  }), true);
  assert.equal(first.publicApiCount, apiNames.length);
  assert.equal(first.publicTypeCount, publicTypeNames.length);
  assert.equal(
    binding.architecturalStatus,
    "ScenePresentationBinding Complete · Deterministic · Stateless · Renderer-Independent · ReadyForExDriAdvisorInsightBinding",
  );
});

test("20. canonical Nexora Factory cycle is representable", () => {
  const result = bindDirectorRuntimeResponseToExecutiveScenePresentation(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-factory" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "scene",
          surface: "stage",
          primarySubject: factory,
          relatedSubjects: [
            supplier,
            warehouse,
            { id: "customer-1", kind: "object", label: "Customer" },
          ],
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "focus",
          surface: "stage",
          subject: throughputKpi,
          role: "focused",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "attention",
          surface: "stage",
          subject: factory,
          level: "primary",
          reason: "selected-primary",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "report",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: throughputKpi,
          state: "report",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: supplier,
          state: "minimum",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: warehouse,
          state: "minimum",
        }),
      ],
    }),
  );

  assert.equal(result.status, "bound");
  assert.equal(result.projection?.scene?.primarySubject?.label, "Factory");
  assert.equal(result.projection?.focus[0]?.subject?.label, "Throughput KPI");
  assert.equal(result.projection?.attention[0]?.level, "primary");
  assert.equal(result.projection?.presentation.length, 4);
  assert.doesNotMatch(
    JSON.stringify(result.projection),
    /position\.set|lookAt|setOpacity|setPanelOpen|animate|camera/,
  );
});

test("21. EX-DRI-1..4 regressions remain green", () => {
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationContracts().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeContextStateBinding().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeInteractionBinding().ok,
    true,
  );
});

test("22. DRI consumer integration public index remains intact", () => {
  const publicIndex = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexIdentity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("23. metadata policies are deterministic / stateless / renderer-independent", () => {
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.statelessStatus, true);
  assert.equal(canonicalIdentity.rendererIndependenceStatus, true);
  assert.equal(canonicalIdentity.mutationPolicy, "immutable");
  assert.equal(binding.threeJsIndependent, true);
  assert.equal(binding.reactIndependent, true);
  assert.equal(binding.frameworkIndependent, true);
});
