import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_UPSTREAM_DEPENDENCIES as approvedUpstream,
  EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY as boundary,
  EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES as capabilities,
  EXECUTIVE_COCKPIT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES as guarantees,
  EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_COCKPIT_INTEGRATION_PRINCIPLE as principle,
  EXECUTIVE_COCKPIT_INTEGRATION_ROLES as roles,
  EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE as runtimeSource,
  EXECUTIVE_COCKPIT_INTEGRATION_STATUSES as statuses,
  EXECUTIVE_COCKPIT_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_COCKPIT_SUBJECT_KINDS as subjectKinds,
  EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS as subjectKindSemantics,
  EXECUTIVE_COCKPIT_SURFACE_BINDINGS as bindings,
  EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES as defaultRoles,
  EXECUTIVE_COCKPIT_SURFACES as surfaces,
  createExecutiveCockpitIntegrationContext,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveCockpitIntegrationState,
  executiveCockpitIntegrationFoundation as foundation,
  executiveCockpitIntegrationFoundationApiNames as apiNames,
  executiveCockpitIntegrationFoundationCanonicalIdentity as canonicalIdentity,
  executiveCockpitIntegrationFoundationRegistry as registry,
  getExecutiveCockpitIntegrationCapabilities,
  getExecutiveCockpitIntegrationFoundationIdentity,
  getExecutiveCockpitIntegrationRoles,
  getExecutiveCockpitIntegrationStatuses,
  getExecutiveCockpitPresentationStates,
  getExecutiveCockpitSubjectKinds,
  getExecutiveCockpitSurfaceBinding,
  getExecutiveCockpitSurfaceBindings,
  getExecutiveCockpitSurfaceDefaultRole,
  getExecutiveCockpitSurfaces,
  isExecutiveCockpitIntegrationCapability,
  isExecutiveCockpitIntegrationRole,
  isExecutiveCockpitIntegrationStatus,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSubjectKind,
  isExecutiveCockpitSurface,
  verifyExecutiveCockpitIntegrationFoundation,
} from "./executiveCockpitIntegrationFoundation.ts";

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  verifyRuntimeEnabledExecutiveExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./executiveCockpitIntegrationFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. identity metadata", () => {
  assert.equal(
    foundation.identity,
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(canonicalIdentity.identity, foundation.identity);
  assert.equal(foundation.phase, "Foundation");
  assert.equal(
    foundation.name,
    "ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(foundation.layer, "NEX-CI");
  assert.equal(foundation.stage, "Foundation");
  assert.equal(foundation.role, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
  assert.deepEqual(
    getExecutiveCockpitIntegrationFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(foundation.version, "1.1.0");
  assert.equal(canonicalIdentity.version, "1.1.0");
  assert.equal(registry.version, "1.1.0");
  assert.equal(
    foundation.namespace,
    "nexora.executive.cockpit.integration.foundation",
  );
  assert.equal(canonicalIdentity.namespace, foundation.namespace);
  assert.equal(foundation.phase, "Foundation");
  assert.equal(
    foundation.architecturalRole,
    "ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(
    canonicalIdentity.architecturalRole,
    "ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(
    boundary.architecturalRole,
    "ExecutiveCockpitIntegrationFoundation",
  );
});

test("3. sole immediate dependency is REX public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  );
  assert.equal(
    registry.dependencyIdentity,
    foundation.upstreamDependency,
  );
  assert.equal(
    canonicalIdentity.dependencyIdentity,
    foundation.upstreamDependency,
  );
  assert.equal(
    foundation.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(foundation.rexBoundary, "REX-1:9-public-index-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  ]);

  assert.equal(approvedUpstream.length, 3);
  assert.deepEqual(
    approvedUpstream.map((entry) => entry.exportName),
    [
      "runtimeEnabledExecutiveExperiencePublicIndexIdentity",
      "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES",
      "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS",
    ],
  );
});

test("4. forbidden direct dependency boundaries", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/(?!runtimeEnabledExecutiveExperiencePublicIndex)[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens|stores)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.bypassesRexIntoExDri, false);
  assert.equal(boundary.bypassesExDriIntoDri, false);
  assert.equal(boundary.bypassesDriIntoNol, false);
  assert.equal(boundary.orchestratesRexInternals, false);
  assert.equal(boundary.orchestratesDriInternals, false);
  assert.equal(boundary.orchestratesNolInternals, false);
  assert.equal(boundary.implementsLaterNexCiPhases, false);
});

test("5. canonical cockpit surface list and uniqueness", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "live-lens",
    "workspace-dial",
    "context-bar",
    "navigation",
    "status",
  ]);
  assert.equal(surfaces.length, 10);
  assert.equal(new Set(surfaces).size, 10);
  assert.deepEqual([...getExecutiveCockpitSurfaces()], [...surfaces]);
  assert.equal(isExecutiveCockpitSurface("stage"), true);
  assert.equal(isExecutiveCockpitSurface("dashboard"), false);
  assert.ok(surfaces.includes("advisor"));
  assert.ok(surfaces.includes("insight"));
  assert.notEqual(
    surfaces.indexOf("advisor"),
    surfaces.indexOf("insight"),
  );
});

test("6. integration role list and uniqueness", () => {
  assert.deepEqual([...roles], [
    "primary",
    "supporting",
    "contextual",
    "navigation",
    "control",
    "status",
  ]);
  assert.equal(roles.length, 6);
  assert.equal(new Set(roles).size, 6);
  assert.deepEqual([...getExecutiveCockpitIntegrationRoles()], [...roles]);
  assert.equal(isExecutiveCockpitIntegrationRole("primary"), true);
  assert.equal(isExecutiveCockpitIntegrationRole("owner"), false);
});

test("7. capability list and uniqueness", () => {
  assert.deepEqual([...capabilities], [
    "surface-coordination",
    "runtime-state-consumption",
    "focus-propagation",
    "selection-propagation",
    "presentation-state-propagation",
    "attention-propagation",
    "workspace-coordination",
    "executive-subject-coordination",
    "interaction-readiness",
  ]);
  assert.equal(capabilities.length, 9);
  assert.equal(new Set(capabilities).size, 9);
  assert.deepEqual(
    [...getExecutiveCockpitIntegrationCapabilities()],
    [...capabilities],
  );
  assert.equal(
    isExecutiveCockpitIntegrationCapability("focus-propagation"),
    true,
  );
  assert.equal(
    isExecutiveCockpitIntegrationCapability("scene-rendering"),
    false,
  );
});

test("8. integration statuses", () => {
  assert.deepEqual([...statuses], [
    "idle",
    "ready",
    "active",
    "transitioning",
    "unavailable",
  ]);
  assert.equal(statuses.length, 5);
  assert.deepEqual(
    [...getExecutiveCockpitIntegrationStatuses()],
    [...statuses],
  );
  assert.equal(isExecutiveCockpitIntegrationStatus("ready"), true);
  assert.equal(isExecutiveCockpitIntegrationStatus("pending"), false);
});

test("9. subject kinds reuse REX frozen vocabulary", () => {
  assert.deepEqual([...subjectKinds], [
    "goal",
    "object",
    "problem",
    "scenario",
    "decision",
    "execution",
    "kpi",
    "koi",
    "pack",
    "insight",
    "guidance",
  ]);
  assert.equal(subjectKinds.length, 11);
  assert.equal(new Set(subjectKinds).size, 11);
  assert.deepEqual(
    subjectKinds.slice(0, 9),
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS],
  );
  assert.deepEqual([...getExecutiveCockpitSubjectKinds()], [...subjectKinds]);
  assert.equal(subjectKindSemantics.object, "NexoraObject");
  assert.equal(subjectKindSemantics.reusesRexFrozenSubjectKinds, true);
  assert.equal(subjectKindSemantics.competingSubjectModel, false);
  assert.equal(subjectKindSemantics.implementsDomainBehavior, false);
  assert.equal(isExecutiveCockpitSubjectKind("object"), true);
  assert.equal(isExecutiveCockpitSubjectKind("guidance"), true);
  assert.equal(isExecutiveCockpitSubjectKind("kor"), false);
});

test("10. presentation-state compatibility from REX public index", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(presentationStates.length, 3);
  assert.deepEqual(
    [...getExecutiveCockpitPresentationStates()],
    [...presentationStates],
  );
  assert.deepEqual(
    [...presentationStates],
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES],
  );
  assert.equal(
    presentationStates,
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  );
  assert.equal(
    registry.PresentationCompatibility.competingPresentationModel,
    false,
  );
  assert.equal(isExecutiveCockpitPresentationState("report"), true);
  assert.equal(isExecutiveCockpitPresentationState("detail"), false);
});

test("11. canonical bindings — one per surface, roles, and completeness", () => {
  assert.equal(bindings.length, 10);
  assert.equal(bindings.length, surfaces.length);
  assert.deepEqual(
    bindings.map((binding) => binding.surface),
    [...surfaces],
  );
  assert.deepEqual([...getExecutiveCockpitSurfaceBindings()], [...bindings]);

  for (const surface of surfaces) {
    const binding = getExecutiveCockpitSurfaceBinding(surface);
    assert.equal(binding.surface, surface);
    assert.equal(binding.role, defaultRoles[surface]);
    assert.equal(binding.enabled, true);
    assert.equal(Object.isFrozen(binding), true);
    assert.equal(Object.isFrozen(binding.capabilities), true);
    assert.ok(binding.capabilities.length > 0);
    for (const capability of binding.capabilities) {
      assert.equal(isExecutiveCockpitIntegrationCapability(capability), true);
    }
    assert.equal(
      new Set(binding.capabilities).size,
      binding.capabilities.length,
    );
  }

  assert.equal(getExecutiveCockpitSurfaceBinding("stage").role, "primary");
  assert.equal(
    getExecutiveCockpitSurfaceDefaultRole("stage"),
    "primary",
  );
  assert.equal(
    getExecutiveCockpitSurfaceBinding("workspace-dial").role,
    "control",
  );
  assert.equal(
    getExecutiveCockpitSurfaceDefaultRole("workspace-dial"),
    "control",
  );
  assert.equal(
    getExecutiveCockpitSurfaceBinding("advisor").role,
    "supporting",
  );
  assert.equal(
    getExecutiveCockpitSurfaceBinding("insight").role,
    "supporting",
  );
  assert.throws(() =>
    getExecutiveCockpitSurfaceBinding("dashboard" as never),
  );
});

test("12. runtime source declares REX → NEX-CI", () => {
  assert.equal(runtimeSource.relationship, "REX → NEX-CI");
  assert.equal(runtimeSource.originLayer, "REX");
  assert.equal(runtimeSource.destinationLayer, "NEX-CI");
  assert.equal(
    runtimeSource.authorityIdentity,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(runtimeSource.nexCiIsRuntimeOwner, false);
  assert.equal(runtimeSource.nexCiIsIntegrationConsumer, true);
  assert.equal(foundation.runtimeSource, runtimeSource);
});

test("13. context creation", () => {
  const context = createExecutiveCockpitIntegrationContext({
    workspaceId: "ws.demo",
    modelId: "model.demo",
    activeSurface: "stage",
    activeWorkspace: "operations",
    selectedSubjectId: "goal-1",
    focusedSubjectId: "goal-1",
    presentationState: "report",
    attentionSubjectId: "goal-1",
  });
  assert.equal(Object.isFrozen(context), true);
  assert.equal(context.activeSurface, "stage");
  assert.equal(context.workspaceId, "ws.demo");
  assert.equal(context.modelId, "model.demo");
  assert.equal(context.activeWorkspace, "operations");
  assert.equal(context.selectedSubjectId, "goal-1");
  assert.equal(context.focusedSubjectId, "goal-1");
  assert.equal(context.presentationState, "report");
  assert.equal(context.attentionSubjectId, "goal-1");
  assert.equal(context.runtimeSource, runtimeSource);
  assert.equal(context.foundationIdentity, foundation.identity);
  assert.equal(context.foundationVersion, "1.1.0");
  assert.throws(() => {
    (context as { activeSurface?: string }).activeSurface = "advisor";
  });
  assert.throws(() =>
    createExecutiveCockpitIntegrationContext({
      activeSurface: "dashboard" as never,
    }),
  );
  assert.throws(() =>
    createExecutiveCockpitIntegrationContext({
      activeSurface: "stage",
      presentationState: "detail" as never,
    }),
  );
});

test("14. state creation", () => {
  const state = createExecutiveCockpitIntegrationState({
    activeSurface: "advisor",
    activeWorkspace: "operations",
    selectedSubject: { id: "object-1", kind: "object" },
    focusedSubject: { id: "goal-1", kind: "goal" },
    presentationState: "minimum",
    attentionSubjectId: "goal-1",
    status: "ready",
  });
  assert.equal(Object.isFrozen(state), true);
  assert.equal(state.activeSurface, "advisor");
  assert.equal(state.status, "ready");
  assert.equal(state.selectedSubject?.kind, "object");
  assert.equal(state.focusedSubject?.id, "goal-1");
  assert.equal(state.presentationState, "minimum");
  assert.equal(state.attentionSubjectId, "goal-1");
  assert.equal(Object.isFrozen(state.selectedSubject), true);
  assert.throws(() => {
    (state as { status?: string }).status = "active";
  });
  assert.throws(() =>
    createExecutiveCockpitIntegrationState({
      activeSurface: "stage",
      status: "pending" as never,
    }),
  );
  assert.throws(() =>
    createExecutiveCockpitIntegrationState({
      activeSurface: "stage",
      status: "ready",
      selectedSubject: { id: "x", kind: "kor" as never },
    }),
  );
});

test("15. snapshot creation", () => {
  const snapshot = createExecutiveCockpitIntegrationSnapshot({
    context: {
      activeSurface: "insight",
      activeWorkspace: "analysis",
      selectedSubjectId: "pack-1",
      focusedSubjectId: "pack-1",
      presentationState: "operation",
      attentionSubjectId: "pack-1",
    },
    state: {
      activeSurface: "insight",
      activeWorkspace: "analysis",
      selectedSubject: { id: "pack-1", kind: "pack" },
      focusedSubject: { id: "pack-1", kind: "pack" },
      presentationState: "operation",
      attentionSubjectId: "pack-1",
      status: "active",
    },
  });
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.bindings), true);
  assert.equal(snapshot.context.activeSurface, "insight");
  assert.equal(snapshot.state.status, "active");
  assert.equal(snapshot.bindings.length, 10);
  assert.equal(snapshot.runtimeSource, runtimeSource);
  assert.equal(snapshot.foundationIdentity, foundation.identity);
  assert.equal(registry.Snapshot.dataOnly, true);
  assert.equal(registry.Snapshot.allowsReactElements, false);
  assert.equal(registry.Snapshot.allowsCallbacks, false);
  assert.equal(registry.Snapshot.allowsThreeJsObjects, false);
  assert.equal(registry.Snapshot.allowsDomReferences, false);
});

test("16. invalid surface rejection where applicable", () => {
  assert.equal(isExecutiveCockpitSurface("live-lens"), true);
  assert.equal(isExecutiveCockpitSurface("experience"), false);
  assert.throws(() =>
    createExecutiveCockpitIntegrationContext({
      activeSurface: "experience" as never,
    }),
  );
  assert.throws(() =>
    createExecutiveCockpitIntegrationState({
      activeSurface: "experience" as never,
      status: "idle",
    }),
  );
  assert.throws(() =>
    getExecutiveCockpitSurfaceDefaultRole("experience" as never),
  );
});

test("17. deterministic verification and invariants", () => {
  const first = verifyExecutiveCockpitIntegrationFoundation();
  const second = verifyExecutiveCockpitIntegrationFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.identity, foundation.identity);
  assert.equal(first.version, "1.1.0");
  assert.equal(
    first.namespace,
    "nexora.executive.cockpit.integration.foundation",
  );
  assert.equal(first.layer, "NEX-CI");
  assert.equal(first.phase, "Foundation");
  assert.equal(first.stage, "Foundation");
  assert.equal(
    first.dependencyIdentity,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(first.surfaceCount, 10);
  assert.equal(first.roleCount, 6);
  assert.equal(first.statusCount, 5);
  assert.equal(first.capabilityCount, 9);
  assert.equal(first.subjectKindCount, 11);
  assert.equal(first.presentationStateCount, 3);
  assert.equal(first.bindingCount, 10);
  assert.equal(first.guaranteeCount, 15);
  assert.equal(first.invariantCount, 15);
  assert.equal(first.registrySectionCount, 13);
  assert.equal(first.frozen, true);
  assert.equal(first.rexBoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.presentationStatesValid, true);
  assert.equal(first.bindingsComplete, true);
  assert.equal(first.stageIsPrimary, true);
  assert.equal(first.workspaceDialIsControl, true);
  assert.equal(first.advisorInsightSeparate, true);
  assert.equal(first.guaranteesPresent, true);
  assert.equal(first.runtimeSourceValid, true);
  assert.equal(
    foundation.architecturalStatus,
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForCockpitShellBinding",
  );
  assert.equal(
    principle,
    "Runtime / REX → NEX-CI → Executive Cockpit → Executive User. The Cockpit consumes NEX-CI; it does not reach through NEX-CI into REX/DRI/NOL internals.",
  );
});

test("18. immutable registry / guarantees / readonly canonical behavior", () => {
  assert.deepEqual([...registrySections], [
    "Identity",
    "Dependency",
    "Surfaces",
    "Roles",
    "Statuses",
    "Capabilities",
    "Subjects",
    "PresentationCompatibility",
    "Bindings",
    "Context",
    "State",
    "Snapshot",
    "Guarantees",
  ]);
  assert.equal(registrySections.length, 13);
  assert.equal(registry.sectionCount, 13);
  assert.equal(registry.surfaceCount, surfaces.length);
  assert.equal(registry.roleCount, roles.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.bindingCount, bindings.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(surfaces), true);
  assert.equal(Object.isFrozen(roles), true);
  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(Object.isFrozen(bindings), true);
  assert.equal(Object.isFrozen(guarantees), true);

  assert.equal(guarantees.length, 15);
  assert.deepEqual(
    guarantees.map((entry) => entry.id),
    [
      "cockpit-surfaces-uniquely-defined",
      "one-binding-per-surface",
      "binding-roles-valid",
      "binding-capabilities-canonical",
      "stage-is-primary-visual-surface",
      "workspace-dial-is-control-surface",
      "advisor-insight-remain-separate",
      "presentation-state-reuses-rex",
      "no-react-dependency",
      "no-threejs-dependency",
      "no-rendering",
      "no-network-access",
      "no-persistence",
      "no-direct-nol-dri-orchestration",
      "deterministic-side-effect-free",
    ],
  );

  assert.throws(() => {
    (surfaces as unknown as string[]).push("dashboard");
  });
  assert.throws(() => {
    (bindings as unknown as unknown[]).pop();
  });
  assert.throws(() => {
    (foundation as { version?: string }).version = "0.0.0";
  });
  assert.throws(() => {
    (registry as { surfaceCount?: number }).surfaceCount = -1;
  });

  const mutable = {
    activeSurface: "stage" as const,
    status: "idle" as const,
  };
  const snap = JSON.stringify(mutable);
  createExecutiveCockpitIntegrationState(mutable);
  assert.equal(JSON.stringify(mutable), snap);
});

test("19. no React / Three.js / UI framework coupling", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*)["']/i,
  );
  assert.doesNotMatch(
    source,
    /import\s+.*\b(?:React|ReactDOM|JSX|useState|useEffect|createContext|useMemo|useCallback)\b/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens|TimelinePanel|ExplorerPanel|WorkspaceDial)\b/,
  );
  assert.doesNotMatch(source, /\.(?:module\.css|css)["']/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
  assert.equal(boundary.introducesUiComponents, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.ownsRendering, false);
  assert.equal(boundary.introducesPersistenceOrNetwork, false);
});

test("20. no later NEX-CI phase / UI / orchestration behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:CockpitShellRuntimeBinding|ExecutiveStageIntegration|WorkspaceDialExperienceSwitching)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:generateAdvice|generateInsight|replayTimeline|navigateLiveLens|switchWorkspace)\b/,
  );
  for (const required of [
    "React components",
    "Three.js scenes",
    "Advisor content generation",
    "Insight generation",
    "NEX-CI:2 Cockpit Shell Runtime Binding",
    "NEX-CI:8 Executive Cockpit Certification & Freeze",
    "NEX-CI:9 Executive Cockpit Public Index",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
  assert.equal(apiNames.length, 20);
  assert.ok(
    apiNames.includes("getExecutiveCockpitIntegrationFoundationIdentity"),
  );
  assert.ok(apiNames.includes("createExecutiveCockpitIntegrationSnapshot"));
  assert.ok(apiNames.includes("verifyExecutiveCockpitIntegrationFoundation"));
});

test("21. REX public index consumer entry remains intact", () => {
  const consumerEntry =
    verifyRuntimeEnabledExecutiveExperienceConsumerEntry();
  assert.equal(consumerEntry.ok, true);
  assert.equal(
    runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
});
