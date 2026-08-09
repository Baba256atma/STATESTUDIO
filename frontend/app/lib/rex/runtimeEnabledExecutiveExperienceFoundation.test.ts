import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY as boundary,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES as guarantees,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PRINCIPLE as principle,
  RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES as activationStates,
  RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE as runtimeSource,
  RUNTIME_EXECUTIVE_EXPERIENCE_STATES as runtimeStates,
  RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS as subjectKindSemantics,
  RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES as surfaces,
  RUNTIME_EXECUTIVE_PRESENTATION_STATES as presentationStates,
  createRuntimeExecutiveExperienceContext,
  createRuntimeExecutiveExperienceSnapshot,
  createRuntimeExecutiveSurfaceState,
  getRuntimeEnabledExecutiveExperienceFoundationIdentity,
  isRuntimeExecutiveExperienceActivationState,
  isRuntimeExecutiveExperienceState,
  isRuntimeExecutiveExperienceSubjectKind,
  isRuntimeExecutiveExperienceSurface,
  isRuntimeExecutivePresentationState,
  listRuntimeExecutiveExperienceActivationStates,
  listRuntimeExecutiveExperienceStates,
  listRuntimeExecutiveExperienceSubjectKinds,
  listRuntimeExecutiveExperienceSurfaces,
  listRuntimeExecutivePresentationStates,
  runtimeEnabledExecutiveExperienceFoundation as foundation,
  runtimeEnabledExecutiveExperienceFoundationApiNames as apiNames,
  runtimeEnabledExecutiveExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceFoundationRegistry as registry,
  verifyRuntimeEnabledExecutiveExperienceFoundation,
} from "./runtimeEnabledExecutiveExperienceFoundation.ts";

import {
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
  verifyExecutiveExperienceDirectorRuntimeIntegrationPublicIndex,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact REX-1:1 identity", () => {
  assert.equal(
    foundation.identity,
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(canonicalIdentity.identity, foundation.identity);
  assert.equal(foundation.phase, "REX-1");
  assert.equal(
    foundation.name,
    "RuntimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(foundation.layer, "REX");
  assert.equal(foundation.stage, "Foundation");
  assert.equal(foundation.role, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.1.0", () => {
  assert.equal(foundation.version, "1.1.0");
  assert.equal(canonicalIdentity.version, "1.1.0");
  assert.equal(registry.version, "1.1.0");
});

test("3. exact namespace", () => {
  assert.equal(
    foundation.namespace,
    "nexora.rex.runtime-enabled-executive-experience.foundation",
  );
  assert.equal(canonicalIdentity.namespace, foundation.namespace);
  assert.equal(registry.namespace, foundation.namespace);
});

test("4. architectural role is RuntimeEnabledExecutiveExperienceBoundary", () => {
  assert.equal(
    foundation.architecturalRole,
    "RuntimeEnabledExecutiveExperienceBoundary",
  );
  assert.equal(
    canonicalIdentity.architecturalRole,
    "RuntimeEnabledExecutiveExperienceBoundary",
  );
  assert.equal(
    boundary.architecturalRole,
    "RuntimeEnabledExecutiveExperienceBoundary",
  );
});

test("5. sole immediate dependency is EX-DRI public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
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
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(foundation.exDriBoundary, "EX-DRI-9-public-index-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex",
  ]);
});

test("6. forbidden direct dependency boundaries", () => {
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
    /from\s+["']@\/app\/lib\/ex-dri\/executiveExperienceDirectorRuntime(?!IntegrationPublicIndex)[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens|stores)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.bypassesExDriIntoDri, false);
  assert.equal(boundary.bypassesDriIntoNol, false);
});

test("7. canonical surface vocabulary", () => {
  assert.deepEqual([...surfaces], [
    "experience",
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
  ]);
  assert.equal(surfaces.length, 6);
  assert.equal(new Set(surfaces).size, 6);
  assert.deepEqual([...listRuntimeExecutiveExperienceSurfaces()], [...surfaces]);
  for (const required of [
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "experience",
  ] as const) {
    assert.ok(surfaces.includes(required));
  }
});

test("8. canonical subject vocabulary", () => {
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
  ]);
  assert.equal(subjectKinds.length, 9);
  assert.equal(new Set(subjectKinds).size, 9);
  assert.deepEqual(
    [...listRuntimeExecutiveExperienceSubjectKinds()],
    [...subjectKinds],
  );
  assert.equal(
    subjectKindSemantics.koi,
    "Key Output Index associated with goals/intents and executive focus",
  );
  assert.equal(subjectKindSemantics.calculatesKpi, false);
  assert.equal(subjectKindSemantics.calculatesKoi, false);
  assert.equal(subjectKindSemantics.introducesKor, false);
  assert.equal(
    (subjectKinds as readonly string[]).includes("kor"),
    false,
  );
  assert.equal(subjectKindSemantics.usesOnlyCanonicalIndexTerminology, true);
});

test("9. runtime states", () => {
  assert.deepEqual([...runtimeStates], [
    "unavailable",
    "available",
    "ready",
    "active",
  ]);
  assert.equal(runtimeStates.length, 4);
  assert.deepEqual(
    [...listRuntimeExecutiveExperienceStates()],
    [...runtimeStates],
  );
});

test("10. activation states", () => {
  assert.deepEqual([...activationStates], [
    "inactive",
    "eligible",
    "activated",
  ]);
  assert.equal(activationStates.length, 3);
  assert.deepEqual(
    [...listRuntimeExecutiveExperienceActivationStates()],
    [...activationStates],
  );
});

test("11. presentation-state compatibility from EX-DRI public index", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(presentationStates.length, 3);
  assert.deepEqual(
    [...listRuntimeExecutivePresentationStates()],
    [...presentationStates],
  );
  assert.deepEqual(
    [...presentationStates],
    [...EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES],
  );
  assert.equal(
    presentationStates,
    EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
  );
  assert.equal(
    registry.PresentationCompatibility.competingPresentationModel,
    false,
  );
});

test("12. runtime source declares EX-DRI → REX", () => {
  assert.equal(runtimeSource.relationship, "EX-DRI → REX");
  assert.equal(runtimeSource.originLayer, "EX-DRI");
  assert.equal(runtimeSource.destinationLayer, "REX");
  assert.equal(
    runtimeSource.authorityIdentity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(runtimeSource.rexIsDirectorDecisionSource, false);
  assert.equal(runtimeSource.rexIsExperienceConsumer, true);
  assert.equal(foundation.runtimeSource, runtimeSource);
});

test("13. immutable registry sections and derived counts", () => {
  assert.deepEqual([...registrySections], [
    "Identity",
    "Dependency",
    "Surfaces",
    "Subjects",
    "RuntimeStates",
    "ActivationStates",
    "PresentationCompatibility",
    "Context",
    "Snapshot",
    "Guarantees",
  ]);
  assert.equal(registrySections.length, 10);
  assert.equal(registry.sectionCount, 10);
  assert.equal(registry.surfaceCount, surfaces.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.runtimeStateCount, runtimeStates.length);
  assert.equal(registry.activationStateCount, activationStates.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.Identity), true);
  assert.equal(Object.isFrozen(registry.Dependency), true);
  assert.equal(Object.isFrozen(registry.Surfaces), true);
  assert.equal(Object.isFrozen(registry.Subjects), true);
  assert.equal(Object.isFrozen(registry.RuntimeStates), true);
  assert.equal(Object.isFrozen(registry.ActivationStates), true);
  assert.equal(Object.isFrozen(registry.PresentationCompatibility), true);
  assert.equal(Object.isFrozen(registry.Context), true);
  assert.equal(Object.isFrozen(registry.Snapshot), true);
  assert.equal(Object.isFrozen(registry.Guarantees), true);
});

test("14. immutable guarantees (15)", () => {
  assert.equal(guarantees.length, 15);
  assert.equal(new Set(guarantees.map((g) => g.id)).size, 15);
  assert.deepEqual(
    guarantees.map((entry) => entry.id),
    [
      "ex-dri-sole-immediate-dependency",
      "no-bypass-ex-dri-into-dri",
      "no-bypass-dri-into-nol",
      "no-director-computation",
      "no-rendering-ownership",
      "framework-neutral-foundation",
      "immutable-plain-data-runtime-context",
      "surfaces-independently-addressable",
      "subjects-independently-identifiable",
      "presentation-states-preserved",
      "represents-focus-attention-without-calculation",
      "no-kpi-koi-calculation",
      "no-ai-reasoning",
      "no-persistence-network",
      "no-visible-ux-redesign",
    ],
  );
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(boundary.ownsDirectorComputation, false);
  assert.equal(boundary.ownsRendering, false);
  assert.equal(boundary.introducesUxRedesign, false);
  assert.equal(boundary.calculatesFocusOrAttention, false);
  assert.equal(boundary.calculatesKpi, false);
  assert.equal(boundary.calculatesKoi, false);
  assert.equal(boundary.introducesAiReasoning, false);
  assert.equal(boundary.introducesPersistenceOrNetwork, false);
});

test("15. context contract behavior", () => {
  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.demo",
    runtimeState: "ready",
    activationState: "eligible",
    activeSurface: "stage",
    activeSubjectKind: "goal",
    activeSubjectId: "goal-1",
    presentationState: "report",
    runtimeContextAvailable: true,
    runtimeSource,
    foundationIdentity: foundation.identity,
    foundationVersion: foundation.version,
    timestampIso: "2026-08-08T00:00:00.000Z",
  });
  assert.equal(Object.isFrozen(context), true);
  assert.equal(context.experienceId, "rex.exp.demo");
  assert.equal(context.runtimeState, "ready");
  assert.equal(context.activationState, "eligible");
  assert.equal(context.activeSurface, "stage");
  assert.equal(context.activeSubjectKind, "goal");
  assert.equal(context.presentationState, "report");
  assert.equal(context.runtimeContextAvailable, true);
  assert.equal(context.runtimeSource, runtimeSource);
  assert.throws(() => {
    (context as { runtimeState?: string }).runtimeState = "active";
  });
  assert.throws(() =>
    createRuntimeExecutiveExperienceContext({
      experienceId: "rex.exp.demo",
      runtimeState: "pending" as never,
      activationState: "eligible",
      runtimeContextAvailable: true,
      runtimeSource,
      foundationIdentity: foundation.identity,
      foundationVersion: foundation.version,
    }),
  );
});

test("16. surface state and snapshot representation", () => {
  const surfaceState = createRuntimeExecutiveSurfaceState({
    surface: "advisor",
    availability: "available",
    activation: "activated",
    subjectKind: "koi",
    subjectId: "koi-1",
    presentationState: "minimum",
    focusedSubjectId: "goal-1",
    attentionSubjectId: "goal-1",
  });
  assert.equal(Object.isFrozen(surfaceState), true);
  assert.equal(surfaceState.surface, "advisor");
  assert.equal(surfaceState.focusedSubjectId, "goal-1");

  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.demo",
    runtimeState: "active",
    activationState: "activated",
    activeSurface: "advisor",
    activeSubjectKind: "koi",
    activeSubjectId: "koi-1",
    presentationState: "minimum",
    runtimeContextAvailable: true,
    runtimeSource,
    foundationIdentity: foundation.identity,
    foundationVersion: foundation.version,
  });

  const snapshot = createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.1",
    context,
    surfaceStates: [surfaceState],
    currentSubjectKind: "koi",
    currentSubjectId: "koi-1",
    runtimeReadiness: "active",
    upstreamIntegrationIdentity:
      executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
    upstreamIntegrationVersion: "1.9.0",
    runtimeSource,
    foundationIdentity: foundation.identity,
    foundationVersion: foundation.version,
  });
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.surfaceStates), true);
  assert.equal(snapshot.upstreamIntegrationIdentity, foundation.upstreamDependency);
  assert.equal(snapshot.upstreamIntegrationVersion, "1.9.0");
  assert.equal(snapshot.runtimeSource.relationship, "EX-DRI → REX");
  assert.equal(snapshot.currentSubjectKind, "koi");
  assert.equal(registry.Snapshot.introducesStore, false);
  assert.equal(registry.Snapshot.introducesSubscription, false);
  assert.equal(registry.Snapshot.introducesEventEmitter, false);
});

test("17. deterministic verification", () => {
  const first = verifyRuntimeEnabledExecutiveExperienceFoundation();
  const second = verifyRuntimeEnabledExecutiveExperienceFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.identity, foundation.identity);
  assert.equal(first.version, "1.1.0");
  assert.equal(
    first.namespace,
    "nexora.rex.runtime-enabled-executive-experience.foundation",
  );
  assert.equal(first.layer, "REX");
  assert.equal(first.phase, "REX-1");
  assert.equal(first.stage, "Foundation");
  assert.equal(
    first.dependencyIdentity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(first.surfaceCount, 6);
  assert.equal(first.subjectKindCount, 9);
  assert.equal(first.runtimeStateCount, 4);
  assert.equal(first.activationStateCount, 3);
  assert.equal(first.presentationStateCount, 3);
  assert.equal(first.guaranteeCount, 15);
  assert.equal(first.registrySectionCount, 10);
  assert.equal(first.frozen, true);
  assert.equal(first.exDriBoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.presentationStatesValid, true);
  assert.equal(first.guaranteesPresent, true);
  assert.equal(first.runtimeSourceValid, true);
  assert.equal(
    foundation.architecturalStatus,
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForContracts",
  );
  assert.equal(
    principle,
    "Certified Executive Runtime Context → Runtime-enabled Executive Experience. REX consumes EX-DRI; it does not own Director decisions.",
  );
});

test("18. validators and no mutation of caller-owned inputs", () => {
  assert.equal(isRuntimeExecutiveExperienceSurface("stage"), true);
  assert.equal(isRuntimeExecutiveExperienceSurface("live-lens"), false);
  assert.equal(isRuntimeExecutiveExperienceSubjectKind("koi"), true);
  assert.equal(isRuntimeExecutiveExperienceSubjectKind("kor"), false);
  assert.equal(isRuntimeExecutiveExperienceState("ready"), true);
  assert.equal(isRuntimeExecutiveExperienceState("pending"), false);
  assert.equal(isRuntimeExecutiveExperienceActivationState("eligible"), true);
  assert.equal(isRuntimeExecutiveExperienceActivationState("pending"), false);
  assert.equal(isRuntimeExecutivePresentationState("operation"), true);
  assert.equal(isRuntimeExecutivePresentationState("detail"), false);

  const mutable = {
    experienceId: "rex.exp.mutable",
    runtimeState: "available" as const,
    activationState: "inactive" as const,
    runtimeContextAvailable: false,
    runtimeSource,
    foundationIdentity: foundation.identity,
    foundationVersion: foundation.version,
  };
  const snap = JSON.stringify(mutable);
  createRuntimeExecutiveExperienceContext(mutable);
  assert.equal(JSON.stringify(mutable), snap);
  mutable.runtimeContextAvailable = true;
  assert.equal(mutable.runtimeContextAvailable, true);

  assert.throws(() => {
    (surfaces as unknown as string[]).push("dashboard");
  });
  assert.throws(() => {
    (presentationStates as unknown as string[]).push("expanded");
  });
  assert.throws(() => {
    (foundation as { version?: string }).version = "0.0.0";
  });
  assert.throws(() => {
    (registry as { surfaceCount?: number }).surfaceCount = -1;
  });
});

test("19. no React / runtime-renderer / framework coupling", () => {
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
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens|TimelinePanel|ExplorerPanel)\b/,
  );
  assert.doesNotMatch(source, /\.(?:module\.css|css)["']/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
});

test("20. no business / AI / orchestration behavior introduced", () => {
  assert.doesNotMatch(
    source,
    /\b(?:openai|anthropic|llm|gpt-|advisorReason|generateInsight|simulateScenario)\b/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:calculateKpi|calculateKoi|resolveFocus|resolveAttention|orchestrateScene)\b/,
  );
  for (const required of [
    "Director computation",
    "KPI calculation",
    "KOI calculation",
    "AI reasoning",
    "React components",
    "Three.js behavior",
    "visible UX redesign",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
});

test("21. EX-DRI public index compatibility remains intact", () => {
  const publicIndex =
    verifyExecutiveExperienceDirectorRuntimeIntegrationPublicIndex();
  assert.equal(publicIndex.valid, true);
  assert.equal(publicIndex.readyForConsumer, true);
  assert.equal(publicIndex.compatible, true);
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
});
