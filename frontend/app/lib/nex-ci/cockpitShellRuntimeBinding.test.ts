import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP as capabilityMap,
  COCKPIT_RUNTIME_PROPAGATION_KINDS as propagationKinds,
  COCKPIT_RUNTIME_PROPAGATION_MATRIX as propagationMatrix,
  COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY as boundary,
  COCKPIT_SHELL_RUNTIME_BINDING_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES as guarantees,
  COCKPIT_SHELL_RUNTIME_BINDING_PRINCIPLE as principle,
  cockpitShellRuntimeBinding as bindingModule,
  cockpitShellRuntimeBindingApiNames as apiNames,
  cockpitShellRuntimeBindingCanonicalIdentity as canonicalIdentity,
  doesCockpitSurfaceReceivePropagation,
  getCockpitRuntimePropagationKinds,
  getCockpitShellRuntimeBindingIdentity,
  getCockpitSurfacePropagationKinds,
  isCockpitRuntimePropagationKind,
  resolveCockpitShellRuntimeBinding,
  resolveCockpitSurfaceRuntimeContext,
  resolveCockpitSurfaceRuntimeState,
  validateCockpitShellRuntimeBinding,
  verifyCockpitShellRuntimeBinding,
} from "./cockpitShellRuntimeBinding.ts";

import {
  EXECUTIVE_COCKPIT_SURFACES as surfaces,
  createExecutiveCockpitIntegrationSnapshot,
  executiveCockpitIntegrationFoundationIdentity,
  getExecutiveCockpitSurfaceBinding,
  verifyExecutiveCockpitIntegrationFoundation,
} from "./executiveCockpitIntegrationFoundation.ts";

const source = readFileSync(
  new URL("./cockpitShellRuntimeBinding.ts", import.meta.url),
  "utf8",
);

function sampleSnapshot(
  overrides: {
    readonly activeSurface?: (typeof surfaces)[number];
    readonly status?:
      | "idle"
      | "ready"
      | "active"
      | "transitioning"
      | "unavailable";
  } = {},
) {
  const activeSurface = overrides.activeSurface ?? "stage";
  return createExecutiveCockpitIntegrationSnapshot({
    context: {
      workspaceId: "ws.demo",
      modelId: "model.demo",
      activeSurface,
      activeWorkspace: "operations",
      selectedSubjectId: "object-1",
      focusedSubjectId: "goal-1",
      presentationState: "report",
      attentionSubjectId: "goal-1",
    },
    state: {
      activeSurface,
      activeWorkspace: "operations",
      selectedSubject: { id: "object-1", kind: "object" },
      focusedSubject: { id: "goal-1", kind: "goal" },
      presentationState: "report",
      attentionSubjectId: "goal-1",
      status: overrides.status ?? "ready",
    },
  });
}

test("1. identity metadata", () => {
  assert.equal(
    bindingModule.identity,
    "NEX-CI:2/CockpitShellRuntimeBinding",
  );
  assert.equal(canonicalIdentity.identity, bindingModule.identity);
  assert.equal(bindingModule.phase, "ShellRuntimeBinding");
  assert.equal(bindingModule.name, "CockpitShellRuntimeBinding");
  assert.equal(bindingModule.layer, "NEX-CI");
  assert.equal(bindingModule.stage, "ShellRuntimeBinding");
  assert.deepEqual(
    getCockpitShellRuntimeBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(bindingModule.version, "1.2.0");
  assert.equal(canonicalIdentity.version, "1.2.0");
  assert.equal(
    bindingModule.namespace,
    "nexora.executive.cockpit.integration.shell-runtime-binding",
  );
  assert.equal(bindingModule.phase, "ShellRuntimeBinding");
  assert.equal(
    bindingModule.architecturalRole,
    "CockpitShellRuntimeBinding",
  );
  assert.equal(
    boundary.architecturalRole,
    "CockpitShellRuntimeBinding",
  );
});

test("3. sole immediate dependency is NEX-CI:1 foundation", () => {
  assert.equal(
    bindingModule.upstreamDependency,
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(
    bindingModule.upstreamDependency,
    executiveCockpitIntegrationFoundationIdentity,
  );
  assert.equal(
    bindingModule.dependencyPath,
    "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(boundary.consumesNexCi1Only, true);
  assert.equal(bindingModule.nexCi1Boundary, "NEX-CI:1-foundation-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) =>
        entry === "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation",
    ),
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
    /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens|stores)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.bypassesNexCi1IntoRex, false);
  assert.equal(boundary.bypassesIntoExDri, false);
  assert.equal(boundary.bypassesIntoDri, false);
  assert.equal(boundary.bypassesIntoNol, false);
  assert.equal(boundary.implementsNexCi3, false);
});

test("5. propagation kinds and uniqueness", () => {
  assert.deepEqual([...propagationKinds], [
    "workspace",
    "selection",
    "focus",
    "attention",
    "presentation",
    "status",
  ]);
  assert.equal(propagationKinds.length, 6);
  assert.equal(new Set(propagationKinds).size, 6);
  assert.deepEqual(
    [...getCockpitRuntimePropagationKinds()],
    [...propagationKinds],
  );
  assert.equal(isCockpitRuntimePropagationKind("focus"), true);
  assert.equal(isCockpitRuntimePropagationKind("camera"), false);
  assert.deepEqual(capabilityMap, {
    workspace: "workspace-coordination",
    selection: "selection-propagation",
    focus: "focus-propagation",
    attention: "attention-propagation",
    presentation: "presentation-state-propagation",
    status: "runtime-state-consumption",
  });
});

test("6. all canonical surfaces covered with exactly one runtime state", () => {
  const snapshot = sampleSnapshot();
  const resolved = resolveCockpitShellRuntimeBinding(snapshot);
  assert.equal(resolved.surfaces.length, surfaces.length);
  assert.equal(resolved.surfaces.length, 10);
  assert.deepEqual(
    resolved.surfaces.map((entry) => entry.surface),
    [...surfaces],
  );
  assert.equal(
    new Set(resolved.surfaces.map((entry) => entry.surface)).size,
    surfaces.length,
  );
  assert.equal(resolved.contexts.length, 10);
  assert.deepEqual(
    resolved.contexts.map((entry) => entry.surface),
    [...surfaces],
  );
});

test("7. Stage runtime binding", () => {
  const snapshot = sampleSnapshot({ activeSurface: "stage" });
  const stage = resolveCockpitSurfaceRuntimeState(snapshot, "stage");
  const context = resolveCockpitSurfaceRuntimeContext(snapshot, "stage");
  assert.equal(stage.role, "primary");
  assert.equal(stage.active, true);
  assert.equal(stage.enabled, true);
  assert.equal(stage.available, true);
  assert.equal(stage.receivesWorkspace, true);
  assert.equal(stage.receivesSelection, true);
  assert.equal(stage.receivesFocus, true);
  assert.equal(stage.receivesAttention, true);
  assert.equal(stage.receivesPresentationState, true);
  assert.equal(stage.receivesStatus, true);
  assert.equal(context.activeWorkspace, "operations");
  assert.equal(context.selectedSubject?.id, "object-1");
  assert.equal(context.focusedSubject?.id, "goal-1");
  assert.equal(context.attentionSubjectId, "goal-1");
  assert.equal(context.presentationState, "report");
  assert.equal(context.integrationStatus, "ready");
  assert.equal(getExecutiveCockpitSurfaceBinding("stage").role, "primary");
});

test("8. Workspace Dial runtime binding", () => {
  const snapshot = sampleSnapshot({ activeSurface: "workspace-dial" });
  const dial = resolveCockpitSurfaceRuntimeState(snapshot, "workspace-dial");
  const context = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "workspace-dial",
  );
  assert.equal(dial.role, "control");
  assert.equal(dial.active, true);
  assert.equal(dial.receivesWorkspace, true);
  assert.equal(dial.receivesStatus, true);
  assert.equal(dial.receivesPresentationState, true);
  assert.equal(dial.receivesSelection, false);
  assert.equal(dial.receivesFocus, false);
  assert.equal(dial.receivesAttention, false);
  assert.equal(context.activeWorkspace, "operations");
  assert.equal(context.integrationStatus, "ready");
  assert.equal(context.selectedSubject, undefined);
  assert.equal(context.focusedSubject, undefined);
  assert.equal(context.attentionSubjectId, undefined);
});

test("9. Advisor and Insight independently runtime-bindable", () => {
  const snapshot = sampleSnapshot({ activeSurface: "advisor" });
  const advisor = resolveCockpitSurfaceRuntimeState(snapshot, "advisor");
  const insight = resolveCockpitSurfaceRuntimeState(snapshot, "insight");
  const advisorContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "advisor",
  );
  const insightContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "insight",
  );

  assert.equal(advisor.surface, "advisor");
  assert.equal(insight.surface, "insight");
  assert.notEqual(advisor.surface, insight.surface);
  assert.equal(advisor.role, "supporting");
  assert.equal(insight.role, "supporting");
  assert.equal(advisor.active, true);
  assert.equal(insight.active, false);

  for (const state of [advisor, insight]) {
    assert.equal(state.receivesWorkspace, true);
    assert.equal(state.receivesSelection, true);
    assert.equal(state.receivesFocus, true);
    assert.equal(state.receivesAttention, true);
    assert.equal(state.receivesPresentationState, true);
  }

  assert.equal(advisorContext.selectedSubject?.kind, "object");
  assert.equal(insightContext.focusedSubject?.kind, "goal");
  assert.equal(advisorContext.attentionSubjectId, "goal-1");
  assert.equal(insightContext.presentationState, "report");
});

test("10. Timeline / Explorer / Live Lens runtime bindings", () => {
  const snapshot = sampleSnapshot({ activeSurface: "timeline" });
  for (const surface of ["timeline", "explorer", "live-lens"] as const) {
    const state = resolveCockpitSurfaceRuntimeState(snapshot, surface);
    const context = resolveCockpitSurfaceRuntimeContext(snapshot, surface);
    assert.equal(state.role, "contextual");
    assert.equal(state.enabled, true);
    assert.equal(state.available, true);
    assert.equal(state.receivesWorkspace, true);
    assert.equal(state.receivesSelection, true);
    assert.equal(state.receivesFocus, true);
    assert.equal(state.receivesAttention, true);
    assert.equal(state.receivesPresentationState, true);
    assert.equal(context.activeWorkspace, "operations");
    assert.equal(context.selectedSubject?.id, "object-1");
    assert.equal(context.focusedSubject?.id, "goal-1");
    assert.equal(state.active, surface === "timeline");
  }
});

test("11. Context Bar / Navigation / Status runtime bindings", () => {
  const snapshot = sampleSnapshot({ activeSurface: "status" });

  const contextBar = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "context-bar",
  );
  const contextBarState = resolveCockpitSurfaceRuntimeState(
    snapshot,
    "context-bar",
  );
  assert.equal(contextBarState.role, "control");
  assert.equal(contextBar.workspaceId, "ws.demo");
  assert.equal(contextBar.modelId, "model.demo");
  assert.equal(contextBar.activeWorkspace, "operations");
  assert.equal(contextBar.integrationStatus, "ready");
  assert.equal(contextBar.selectedSubject, undefined);
  assert.equal(contextBar.focusedSubject, undefined);

  const navigation = resolveCockpitSurfaceRuntimeState(snapshot, "navigation");
  const navigationContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "navigation",
  );
  assert.equal(navigation.role, "navigation");
  assert.equal(navigation.receivesWorkspace, true);
  assert.equal(navigation.receivesSelection, false);
  assert.equal(navigation.receivesStatus, false);
  assert.equal(navigationContext.activeWorkspace, "operations");
  assert.equal(navigationContext.integrationStatus, undefined);
  assert.equal(navigationContext.selectedSubject, undefined);

  const status = resolveCockpitSurfaceRuntimeState(snapshot, "status");
  const statusContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "status",
  );
  assert.equal(status.role, "status");
  assert.equal(status.active, true);
  assert.equal(status.receivesStatus, true);
  assert.equal(status.receivesWorkspace, false);
  assert.equal(statusContext.integrationStatus, "ready");
  assert.equal(statusContext.activeWorkspace, undefined);
  assert.equal(statusContext.selectedSubject, undefined);
});

test("12. propagation matrix coverage and capability compatibility", () => {
  assert.equal(propagationMatrix.length, surfaces.length);
  assert.deepEqual(
    propagationMatrix.map((entry) => entry.surface),
    [...surfaces],
  );

  for (const surface of surfaces) {
    const kinds = getCockpitSurfacePropagationKinds(surface);
    const binding = getExecutiveCockpitSurfaceBinding(surface);
    for (const kind of propagationKinds) {
      const capability = capabilityMap[kind];
      const expected = binding.capabilities.includes(capability);
      assert.equal(
        doesCockpitSurfaceReceivePropagation(surface, kind),
        expected,
        `${surface}/${kind}`,
      );
      assert.equal(kinds.includes(kind), expected, `${surface}/${kind} list`);
    }
  }

  assert.throws(() =>
    doesCockpitSurfaceReceivePropagation("dashboard" as never, "focus"),
  );
  assert.throws(() =>
    doesCockpitSurfaceReceivePropagation("stage", "camera" as never),
  );
});

test("13. workspace / selection / focus / attention / presentation / status propagation", () => {
  assert.equal(
    doesCockpitSurfaceReceivePropagation("stage", "workspace"),
    true,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("stage", "selection"),
    true,
  );
  assert.equal(doesCockpitSurfaceReceivePropagation("stage", "focus"), true);
  assert.equal(
    doesCockpitSurfaceReceivePropagation("stage", "attention"),
    true,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("stage", "presentation"),
    true,
  );
  assert.equal(doesCockpitSurfaceReceivePropagation("stage", "status"), true);

  assert.equal(
    doesCockpitSurfaceReceivePropagation("workspace-dial", "workspace"),
    true,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("workspace-dial", "selection"),
    false,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("navigation", "status"),
    false,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("status", "workspace"),
    false,
  );
  assert.equal(
    doesCockpitSurfaceReceivePropagation("status", "status"),
    true,
  );
});

test("14. unsupported propagation rejection / no context leak", () => {
  const snapshot = sampleSnapshot();
  const dialContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "workspace-dial",
  );
  assert.equal("selectedSubject" in dialContext, false);
  assert.equal("focusedSubject" in dialContext, false);
  assert.equal("attentionSubjectId" in dialContext, false);

  const statusContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "status",
  );
  assert.equal("activeWorkspace" in statusContext, false);
  assert.equal("selectedSubject" in statusContext, false);
  assert.equal("presentationState" in statusContext, false);

  const navigationContext = resolveCockpitSurfaceRuntimeContext(
    snapshot,
    "navigation",
  );
  assert.equal("integrationStatus" in navigationContext, false);
  assert.equal("selectedSubject" in navigationContext, false);
});

test("15. surface activation semantics (enabled / available / active)", () => {
  const ready = sampleSnapshot({
    activeSurface: "explorer",
    status: "ready",
  });
  const unavailable = sampleSnapshot({
    activeSurface: "explorer",
    status: "unavailable",
  });

  const readyExplorer = resolveCockpitSurfaceRuntimeState(ready, "explorer");
  const readyStage = resolveCockpitSurfaceRuntimeState(ready, "stage");
  assert.equal(readyExplorer.enabled, true);
  assert.equal(readyExplorer.available, true);
  assert.equal(readyExplorer.active, true);
  assert.equal(readyStage.active, false);
  assert.equal(readyStage.available, true);

  const unavailableExplorer = resolveCockpitSurfaceRuntimeState(
    unavailable,
    "explorer",
  );
  assert.equal(unavailableExplorer.enabled, true);
  assert.equal(unavailableExplorer.available, false);
  assert.equal(unavailableExplorer.active, true);
});

test("16. deterministic binding resolution and immutability", () => {
  const snapshot = sampleSnapshot({ activeSurface: "insight" });
  const inputClone = JSON.stringify(snapshot);

  const first = resolveCockpitShellRuntimeBinding(snapshot);
  const second = resolveCockpitShellRuntimeBinding(snapshot);

  assert.equal(JSON.stringify(snapshot), inputClone);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.binding), true);
  assert.equal(Object.isFrozen(first.surfaces), true);
  assert.equal(Object.isFrozen(first.contexts), true);
  assert.equal(first.binding.activeSurface, "insight");
  assert.equal(first.binding.integrationStatus, "ready");
  assert.equal(
    first.surfaces.filter((entry) => entry.active).length,
    1,
  );
  assert.equal(
    first.surfaces.find((entry) => entry.active)?.surface,
    "insight",
  );

  assert.throws(() => {
    (propagationKinds as unknown as string[]).push("camera");
  });
  assert.throws(() => {
    (bindingModule as { version?: string }).version = "0.0.0";
  });
  assert.throws(() => {
    (first.surfaces as unknown as unknown[]).pop();
  });
});

test("17. validation / invariants", () => {
  const resolved = resolveCockpitShellRuntimeBinding(sampleSnapshot());
  const validation = validateCockpitShellRuntimeBinding(resolved);
  const verification = verifyCockpitShellRuntimeBinding();

  assert.equal(validation.ok, true);
  assert.equal(verification.ok, true);
  assert.equal(validation.identity, bindingModule.identity);
  assert.equal(validation.version, "1.2.0");
  assert.equal(
    validation.namespace,
    "nexora.executive.cockpit.integration.shell-runtime-binding",
  );
  assert.equal(validation.phase, "ShellRuntimeBinding");
  assert.equal(
    validation.dependencyIdentity,
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation",
  );
  assert.equal(validation.surfaceCount, 10);
  assert.equal(validation.propagationKindCount, 6);
  assert.equal(validation.matrixCoverage, 10);
  assert.equal(validation.guaranteeCount, 20);
  assert.equal(validation.invariantCount, 20);
  assert.equal(validation.foundationOk, true);
  assert.equal(validation.frozen, true);
  assert.equal(validation.stageIsPrimary, true);
  assert.equal(validation.workspaceDialIsControl, true);
  assert.equal(validation.advisorInsightDistinct, true);
  assert.equal(validation.propagationCompatible, true);
  assert.equal(validation.frameworkIndependent, true);
  assert.equal(guarantees.length, 20);
  assert.equal(
    principle,
    "REX → NEX-CI:1 Foundation → NEX-CI:2 Shell Runtime Binding → Executive Cockpit Shell. Runtime state is bound without determining UI rendering.",
  );
});

test("18. no React / Three.js / UI framework coupling", () => {
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
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens|WorkspaceDial)\b/,
  );
  assert.doesNotMatch(source, /\.(?:module\.css|css)["']/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.ownsRendering, false);
  assert.equal(boundary.ownsStageMechanics, false);
  assert.equal(boundary.ownsWorkspaceDialMechanics, false);
});

test("19. no later-phase / intelligence / Stage mechanics behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:generateAdvice|generateInsight|replayTimeline|navigateLiveLens|switchWorkspace|rotateDial)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:function\s+implementExecutiveStageIntegration|import\s+.*AnimatableObject)\b/,
  );
  assert.equal(boundary.implementsNexCi3, false);
  assert.equal(boundary.ownsStageMechanics, false);
  for (const required of [
    "React components",
    "Three.js scenes",
    "Workspace Dial geometry",
    "Advisor intelligence",
    "Insight generation",
    "NEX-CI:3 Executive Stage Integration",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
  assert.equal(apiNames.length, 10);
  assert.deepEqual([...apiNames], [
    "getCockpitShellRuntimeBindingIdentity",
    "getCockpitRuntimePropagationKinds",
    "isCockpitRuntimePropagationKind",
    "doesCockpitSurfaceReceivePropagation",
    "getCockpitSurfacePropagationKinds",
    "resolveCockpitSurfaceRuntimeState",
    "resolveCockpitSurfaceRuntimeContext",
    "resolveCockpitShellRuntimeBinding",
    "validateCockpitShellRuntimeBinding",
    "verifyCockpitShellRuntimeBinding",
  ]);
});

test("20. NEX-CI:1 foundation remains intact", () => {
  const foundation = verifyExecutiveCockpitIntegrationFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(
    getExecutiveCockpitSurfaceBinding("stage").capabilities.includes(
      "workspace-coordination",
    ),
    true,
  );
  assert.equal(
    executiveCockpitIntegrationFoundationIdentity,
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation",
  );
});
