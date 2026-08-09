import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CONTEXTUAL_SURFACES as contextualSurfaces,
  EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS as reactionKinds,
  EXECUTIVE_EXPLORER_MODES as explorerModes,
  EXECUTIVE_LIVE_LENS_LAYERS as liveLensLayers,
  EXECUTIVE_TIMELINE_REPLAY_BOUNDARY as replayBoundary,
  EXECUTIVE_TIMELINE_SCOPES as timelineScopes,
  TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY as boundary,
  TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES as guarantees,
  createExecutiveExplorerInteractionIntent,
  createExecutiveLiveLensInteractionIntent,
  createExecutiveTimelineInteractionIntent,
  getTimelineExplorerLiveLensIntegrationIdentity,
  normalizeExecutiveExplorerInteraction,
  normalizeExecutiveLiveLensInteraction,
  normalizeExecutiveTimelineInteraction,
  resolveExecutiveContextualSurfacesIntegration,
  resolveExecutiveExplorerContext,
  resolveExecutiveLiveLensCenter,
  resolveExecutiveLiveLensContext,
  resolveExecutiveLiveLensLayer,
  resolveExecutiveLiveLensLayerNavigation,
  resolveExecutiveTimelineContext,
  timelineExplorerLiveLensIntegration as module,
  timelineExplorerLiveLensIntegrationApiNames as apiNames,
  timelineExplorerLiveLensIntegrationCanonicalIdentity as canonicalIdentity,
  validateExecutiveContextualSurfacesIntegration,
  verifyTimelineExplorerLiveLensIntegration,
} from "./timelineExplorerLiveLensIntegration.ts";

import {
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveCockpitOrchestrationSnapshot,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  orchestrateExecutiveCockpitInteraction,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
} from "./cockpitInteractionOrchestration.ts";

const source = readFileSync(
  new URL("./timelineExplorerLiveLensIntegration.ts", import.meta.url),
  "utf8",
);

const relatedGraph = {
  relatedSubjects: [
    { id: "goal-1", kind: "goal" as const },
    { id: "object-1", kind: "object" as const },
    { id: "pack-1", kind: "pack" as const },
    { id: "decision-1", kind: "decision" as const },
  ],
  relationships: [
    {
      id: "rel.goal-object",
      sourceSubjectId: "goal-1",
      targetSubjectId: "object-1",
      kind: "related" as const,
    },
    {
      id: "rel.object-pack",
      sourceSubjectId: "object-1",
      targetSubjectId: "pack-1",
      kind: "contains" as const,
    },
    {
      id: "rel.object-decision",
      sourceSubjectId: "object-1",
      targetSubjectId: "decision-1",
      kind: "related" as const,
    },
  ],
};

function makeOrchestration(input: {
  readonly activeWorkspace?: "overview" | "problem" | "scenario" | "decision" | "execution";
  readonly focusedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem" | "decision";
  };
  readonly selectedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem" | "decision";
  };
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly status?: "idle" | "ready" | "active" | "transitioning" | "unavailable";
  readonly withStageGraph?: boolean;
  readonly transitionTo?: "problem" | "scenario" | "decision" | "execution";
} = {}) {
  const cockpit = resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubjectId: input.selectedSubject?.id,
        focusedSubjectId: input.focusedSubject?.id,
        presentationState: input.presentationState ?? "report",
      },
      state: {
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubject: input.selectedSubject,
        focusedSubject: input.focusedSubject,
        presentationState: input.presentationState ?? "report",
        status: input.status ?? "ready",
      },
    }),
  );

  const stage = resolveExecutiveStageScene(
    cockpit,
    input.withStageGraph ? relatedGraph : undefined,
  );

  const base = resolveExecutiveWorkspaceExperience({
    cockpit,
    stage,
    currentWorkspace: createExecutiveWorkspaceReference(
      input.activeWorkspace ?? "overview",
    ),
  });

  const experience =
    input.transitionTo === undefined
      ? base
      : resolveExecutiveWorkspaceExperience({
          cockpit,
          stage,
          currentWorkspace: base.currentWorkspace,
          intent: createExecutiveWorkspaceSelectionIntent(
            `workspace.${input.transitionTo}`,
          ),
        });

  return createExecutiveCockpitOrchestrationSnapshot(
    resolveExecutiveAdvisorInsightIntegration(experience),
  );
}

const sampleEntries = Object.freeze([
  Object.freeze({
    id: "entry.object-1",
    subject: Object.freeze({ id: "object-1", kind: "object" as const }),
    timestamp: "2026-01-02T00:00:00.000Z",
    importance: "normal" as const,
  }),
  Object.freeze({
    id: "entry.decision-1",
    subject: Object.freeze({ id: "decision-1", kind: "decision" as const }),
    pack: Object.freeze({ id: "decision-1", kind: "decision" as const }),
    timestamp: "2026-01-01T00:00:00.000Z",
    importance: "high" as const,
  }),
  Object.freeze({
    id: "entry.workspace",
    timestamp: "2026-01-03T00:00:00.000Z",
  }),
]);

test("1. identity metadata", () => {
  assert.equal(
    module.identity,
    "NEX-CI:7/TimelineExplorerLiveLensIntegration",
  );
  assert.equal(canonicalIdentity.identity, module.identity);
  assert.deepEqual(
    getTimelineExplorerLiveLensIntegrationIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(module.version, "1.7.0");
  assert.equal(
    module.namespace,
    "nexora.executive.cockpit.integration.contextual-surfaces",
  );
  assert.equal(module.phase, "TimelineExplorerLiveLensIntegration");
  assert.equal(
    module.architecturalRole,
    "TimelineExplorerLiveLensIntegration",
  );
});

test("3. sole immediate dependency is NEX-CI:6", () => {
  assert.equal(
    module.upstreamDependency,
    "NEX-CI:6/CockpitInteractionOrchestration",
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/nex-ci/cockpitInteractionOrchestration",
  );
  assert.equal(boundary.consumesNexCi6Only, true);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) =>
        entry === "@/app/lib/nex-ci/cockpitInteractionOrchestration",
    ),
  );
});

test("4. forbidden dependency boundaries", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding|executiveStageIntegration|workspaceDialExperienceSwitching|advisorInsightIntegration)["']/,
  );
  assert.equal(boundary.implementsNexCi8, false);
  assert.equal(boundary.ownsPersistence, false);
  assert.equal(boundary.ownsHistoryEngine, false);
  assert.equal(boundary.ownsReplayAnimation, false);
});

test("5. contextual vocabularies and ordering", () => {
  assert.deepEqual([...contextualSurfaces], [
    "timeline",
    "explorer",
    "live-lens",
  ]);
  assert.deepEqual([...timelineScopes], ["day", "week", "month", "year"]);
  assert.deepEqual([...explorerModes], [
    "objects",
    "data",
    "journal",
    "packs",
    "related",
  ]);
  assert.deepEqual([...liveLensLayers], ["goal", "object", "pack"]);
  assert.equal(reactionKinds.length, 9);
  assert.equal(
    replayBoundary,
    "semantic-temporal-navigation-request·no-animation·no-persistence",
  );
});

test("6. Timeline context / ordering / empty / normalization / replay", () => {
  const empty = resolveExecutiveTimelineContext(makeOrchestration({}));
  assert.equal(empty.scope, "week");
  assert.equal(empty.entries.length, 0);
  assert.equal(empty.workspace?.kind, "overview");

  const focused = resolveExecutiveTimelineContext(
    makeOrchestration({
      withStageGraph: true,
      focusedSubject: { id: "object-1", kind: "object" },
      selectedSubject: { id: "goal-1", kind: "goal" },
    }),
    { scope: "month", entries: sampleEntries },
  );
  assert.equal(focused.scope, "month");
  assert.equal(focused.focusedSubject?.id, "object-1");
  assert.equal(focused.selectedSubject?.id, "goal-1");
  assert.ok(focused.entries.length >= 1);
  const timestamps = focused.entries.map((entry) => entry.timestamp ?? "");
  assert.deepEqual(timestamps, [...timestamps].sort());

  const selectEntry = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "select-entry",
      entryId: "entry.decision-1",
      subjectId: "decision-1",
    }),
    focused,
  );
  assert.equal(selectEntry.source, "timeline");
  assert.equal(selectEntry.kind, "select");
  assert.equal(selectEntry.subjectId, "decision-1");

  const selectPack = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "select-pack",
      packId: "decision-1",
    }),
  );
  assert.equal(selectPack.kind, "select");
  assert.equal(selectPack.subjectId, "decision-1");

  const replay = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "replay",
      subjectId: "object-1",
      timestamp: "2026-01-02T00:00:00.000Z",
    }),
  );
  assert.equal(replay.kind, "navigate");
  assert.equal(
    (replay.metadata as { replayBoundary?: string } | undefined)
      ?.replayBoundary,
    replayBoundary,
  );

  const scopeChange = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "change-scope",
      scope: "year",
    }),
  );
  assert.equal(scopeChange.kind, "activate");
  assert.equal(
    (scopeChange.metadata as { scope?: string } | undefined)?.scope,
    "year",
  );
});

test("7. Explorer modes / related / selection / focus / empty", () => {
  const empty = resolveExecutiveExplorerContext(makeOrchestration({}));
  assert.equal(empty.mode, "objects");
  assert.equal(empty.items.length, 0);

  const related = resolveExecutiveExplorerContext(
    makeOrchestration({
      withStageGraph: true,
      focusedSubject: { id: "object-1", kind: "object" },
    }),
  );
  assert.equal(related.mode, "related");
  assert.ok(related.items.some((item) => item.subject?.id === "object-1"));
  assert.ok(related.items.every((item) => item.kind === "related"));

  const packs = resolveExecutiveExplorerContext(
    makeOrchestration({ withStageGraph: true }),
    { mode: "packs" },
  );
  assert.equal(packs.mode, "packs");
  assert.ok(packs.items.some((item) => item.kind === "pack"));

  const select = normalizeExecutiveExplorerInteraction(
    createExecutiveExplorerInteractionIntent({
      kind: "select-item",
      subjectId: "object-1",
      itemId: "explorer.object.object-1",
    }),
  );
  assert.equal(select.source, "explorer");
  assert.equal(select.kind, "select");

  const focus = normalizeExecutiveExplorerInteraction(
    createExecutiveExplorerInteractionIntent({
      kind: "focus-item",
      subjectId: "object-1",
    }),
  );
  assert.equal(focus.kind, "focus");
  assert.equal(focus.source, "explorer");
});

test("8. Live Lens layers / center / navigation / invalid center", () => {
  const root = resolveExecutiveLiveLensContext(makeOrchestration({}));
  assert.equal(root.layer, "goal");
  assert.equal(root.centerSubject, undefined);
  assert.equal(root.items.length, 0);

  const focused = makeOrchestration({
    withStageGraph: true,
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  assert.equal(resolveExecutiveLiveLensCenter(focused)?.id, "object-1");
  assert.equal(resolveExecutiveLiveLensLayer(focused), "object");

  const selectedOnly = makeOrchestration({
    withStageGraph: true,
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  assert.equal(resolveExecutiveLiveLensCenter(selectedOnly)?.id, "goal-1");

  const primaryFallback = makeOrchestration({
    withStageGraph: true,
    selectedSubject: { id: "object-1", kind: "object" },
  });
  // selected drives center; primary may equal selected when no focus
  assert.equal(resolveExecutiveLiveLensCenter(primaryFallback)?.id, "object-1");

  const liveLens = resolveExecutiveLiveLensContext(focused, {
    layer: "object",
  });
  assert.equal(liveLens.centerSubject?.id, "object-1");
  assert.equal(
    liveLens.items.filter((item) => item.role === "center").length,
    1,
  );

  assert.equal(resolveExecutiveLiveLensLayerNavigation("pack", "back"), "object");
  assert.equal(resolveExecutiveLiveLensLayerNavigation("object", "back"), "goal");
  assert.equal(resolveExecutiveLiveLensLayerNavigation("goal", "back"), "goal");
  assert.equal(resolveExecutiveLiveLensLayerNavigation("goal", "open"), "object");
  assert.equal(resolveExecutiveLiveLensLayerNavigation("object", "open"), "pack");
  assert.equal(resolveExecutiveLiveLensLayerNavigation("pack", "reset"), "goal");

  const withClearedFocus = resolveExecutiveContextualSurfacesIntegration({
    orchestration: makeOrchestration({ withStageGraph: true }),
    previous: resolveExecutiveContextualSurfacesIntegration({
      orchestration: makeOrchestration({
        withStageGraph: true,
        focusedSubject: { id: "object-1", kind: "object" },
      }),
    }),
  });
  // focus cleared → center clears; layer may preserve if still valid
  assert.equal(withClearedFocus.liveLens.centerSubject, undefined);

  const invalidCenterCleared = resolveExecutiveContextualSurfacesIntegration({
    orchestration: makeOrchestration({}), // no stage subjects
    previous: resolveExecutiveContextualSurfacesIntegration({
      orchestration: makeOrchestration({
        withStageGraph: true,
        focusedSubject: { id: "object-1", kind: "object" },
      }),
    }),
  });
  assert.equal(invalidCenterCleared.liveLens.centerSubject, undefined);
  assert.equal(invalidCenterCleared.liveLens.layer, "goal");
});

test("9. workspace / presentation / selection-focus / reactions", () => {
  const base = resolveExecutiveContextualSurfacesIntegration({
    orchestration: makeOrchestration({
      withStageGraph: true,
      presentationState: "report",
      selectedSubject: { id: "goal-1", kind: "goal" },
    }),
    timelineState: { scope: "week", entries: sampleEntries },
    explorerState: { mode: "objects" },
    liveLensState: { layer: "goal" },
  });
  assert.equal(base.timeline.presentationState, "report");
  assert.equal(base.timeline.selectedSubject?.id, "goal-1");
  assert.equal(base.timeline.focusedSubject, undefined);
  assert.equal(base.explorer.mode, "objects");

  const focused = resolveExecutiveContextualSurfacesIntegration({
    orchestration: makeOrchestration({
      withStageGraph: true,
      presentationState: "operation",
      focusedSubject: { id: "object-1", kind: "object" },
      selectedSubject: { id: "goal-1", kind: "goal" },
      transitionTo: "problem",
    }),
    previous: base,
    timelineState: { scope: "week", entries: sampleEntries },
    explorerState: { mode: "objects" },
    liveLensState: { layer: "object" },
  });
  assert.equal(focused.orchestration.currentWorkspace?.kind, "overview");
  assert.equal(focused.orchestration.targetWorkspace?.kind, "problem");
  assert.equal(focused.timeline.workspace?.kind, "overview");
  assert.equal(focused.timeline.presentationState, "operation");
  assert.notEqual(focused.timeline.selectedSubject?.id, focused.timeline.focusedSubject?.id);
  assert.ok(
    focused.reactions.some(
      (reaction) => reaction.kind === "live-lens-center-change",
    ),
  );
  const orders = focused.reactions.map((reaction) =>
    reactionKinds.indexOf(reaction.kind),
  );
  assert.deepEqual(
    orders,
    [...orders].sort((a, b) => a - b),
  );
});

test("10. Cockpit ↔ contextual surface flows and duplicate handling", () => {
  const orchestration = makeOrchestration({ withStageGraph: true });
  const snapshot = resolveExecutiveContextualSurfacesIntegration({
    orchestration,
    timelineState: {
      entries: [
        ...sampleEntries,
        sampleEntries[0], // duplicate id
      ],
    },
    explorerState: { mode: "packs" },
  });
  const entryIds = snapshot.timeline.entries.map((entry) => entry.id);
  assert.equal(entryIds.length, new Set(entryIds).size);

  const timelineIntent = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "select-entry",
      entryId: "entry.object-1",
      subjectId: "object-1",
    }),
    snapshot.timeline,
  );
  const afterTimeline = orchestrateExecutiveCockpitInteraction(
    orchestration,
    timelineIntent,
  );
  assert.equal(afterTimeline.resolution.status, "accepted");
  assert.equal(afterTimeline.snapshot.selectedSubject?.id, "object-1");

  const explorerIntent = normalizeExecutiveExplorerInteraction(
    createExecutiveExplorerInteractionIntent({
      kind: "focus-item",
      subjectId: "object-1",
    }),
  );
  const afterExplorer = orchestrateExecutiveCockpitInteraction(
    orchestration,
    explorerIntent,
  );
  assert.equal(afterExplorer.resolution.status, "accepted");
  assert.equal(afterExplorer.snapshot.focusedSubject?.id, "object-1");

  const liveLensIntent = normalizeExecutiveLiveLensInteraction(
    createExecutiveLiveLensInteractionIntent({
      kind: "select-item",
      subjectId: "decision-1",
    }),
  );
  const afterLiveLens = orchestrateExecutiveCockpitInteraction(
    orchestration,
    liveLensIntent,
  );
  assert.equal(afterLiveLens.resolution.status, "accepted");
  assert.equal(afterLiveLens.snapshot.selectedSubject?.id, "decision-1");

  const propagated = resolveExecutiveContextualSurfacesIntegration({
    orchestration: afterExplorer.snapshot,
    previous: snapshot,
  });
  assert.equal(propagated.liveLens.centerSubject?.id, "object-1");
  assert.equal(propagated.explorer.focusedSubject?.id, "object-1");
});

test("11. deterministic snapshot / immutability / validation", () => {
  const orchestration = makeOrchestration({
    withStageGraph: true,
    focusedSubject: { id: "object-1", kind: "object" },
  });
  const input = {
    orchestration,
    timelineState: { scope: "day" as const, entries: sampleEntries },
    explorerState: { mode: "related" as const },
    liveLensState: { layer: "object" as const },
  };
  const a = resolveExecutiveContextualSurfacesIntegration(input);
  const b = resolveExecutiveContextualSurfacesIntegration(input);
  assert.deepEqual(a.timeline, b.timeline);
  assert.deepEqual(a.explorer, b.explorer);
  assert.deepEqual(a.liveLens, b.liveLens);
  assert.deepEqual(a.reactions, b.reactions);
  assert.ok(Object.isFrozen(a));
  assert.ok(Object.isFrozen(a.timeline.entries));
  assert.equal(orchestration.focusedSubject?.id, "object-1");

  const validation = validateExecutiveContextualSurfacesIntegration(a);
  assert.equal(validation.ok, true);
  assert.equal(validation.guaranteeCount, 26);
  assert.equal(verifyTimelineExplorerLiveLensIntegration().ok, true);
  assert.equal(guarantees.length, 26);
  assert.equal(apiNames.length, 33);
  assert.ok(forbiddenResponsibilities.length >= 8);
});

test("12. no React / Three.js / R3F / AI / persistence coupling", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /\bfrom\s+["']openai["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']@anthropic-ai\//);
  assert.doesNotMatch(source, /\bfrom\s+["']@google\/generative-ai["']/);
  assert.doesNotMatch(
    source,
    /\b(?:window\.localStorage|window\.indexedDB|globalThis\.localStorage|fetch\s*\(|new\s+XMLHttpRequest)\b/,
  );
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesAiSdk, false);
  assert.equal(boundary.surfacesNeverDirectlyMutateEachOther, true);
  assert.equal(boundary.ownsExplorerIngestion, false);
  assert.equal(boundary.ownsLiveLensGeometry, false);
});
