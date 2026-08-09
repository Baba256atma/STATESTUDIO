import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY as boundary,
  COCKPIT_INTERACTION_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES as guarantees,
  EXECUTIVE_COCKPIT_INTERACTION_KINDS as kinds,
  EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES as priorities,
  EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS as reasons,
  EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES as statuses,
  EXECUTIVE_COCKPIT_INTERACTION_SOURCES as sources,
  EXECUTIVE_COCKPIT_REACTION_KINDS as reactionKinds,
  EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX as matrix,
  cockpitInteractionOrchestration as module,
  cockpitInteractionOrchestrationApiNames as apiNames,
  cockpitInteractionOrchestrationCanonicalIdentity as canonicalIdentity,
  createExecutiveAdvisorGuidanceIntent,
  createExecutiveCockpitInteractionIntent,
  createExecutiveCockpitOrchestrationSnapshot,
  createExecutiveInsightRequestIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveWorkspaceSelectionIntent,
  getCockpitInteractionOrchestrationIdentity,
  isSourceCapableOfInteraction,
  normalizeExecutiveCockpitInteractionIntent,
  orchestrateExecutiveCockpitInteraction,
  planExecutiveCockpitReactions,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveCockpitInteraction,
  resolveExecutiveCockpitOrchestrationSnapshot,
  resolveExecutiveCockpitSnapshotReactions,
  validateExecutiveCockpitInteractionOrchestration,
  verifyCockpitInteractionOrchestration,
} from "./cockpitInteractionOrchestration.ts";

import {
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveWorkspaceReference,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
} from "./advisorInsightIntegration.ts";

const source = readFileSync(
  new URL("./cockpitInteractionOrchestration.ts", import.meta.url),
  "utf8",
);

const relatedGraph = {
  relatedSubjects: [
    { id: "object-1", kind: "object" as const },
    { id: "goal-1", kind: "goal" as const },
    { id: "pack-1", kind: "pack" as const },
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
  ],
};

function makeOrchestration(input: {
  readonly activeWorkspace?: "overview" | "problem" | "scenario" | "decision" | "execution";
  readonly focusedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem";
  };
  readonly selectedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem";
  };
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly status?: "idle" | "ready" | "active" | "transitioning" | "unavailable";
  readonly activeSurface?:
    | "stage"
    | "advisor"
    | "insight"
    | "timeline"
    | "explorer"
    | "live-lens"
    | "workspace-dial"
    | "context-bar"
    | "navigation"
    | "status";
  readonly withStageGraph?: boolean;
  readonly transitionTo?: "problem" | "scenario" | "decision" | "execution";
} = {}) {
  const cockpit = resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        activeSurface: input.activeSurface ?? "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubjectId: input.selectedSubject?.id,
        focusedSubjectId: input.focusedSubject?.id,
        presentationState: input.presentationState ?? "report",
      },
      state: {
        activeSurface: input.activeSurface ?? "stage",
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

function reactionKindsOf(
  result: ReturnType<typeof orchestrateExecutiveCockpitInteraction>,
): string[] {
  return result.reactions.map((reaction) => reaction.kind);
}

test("1. identity metadata", () => {
  assert.equal(module.identity, "NEX-CI:6/CockpitInteractionOrchestration");
  assert.equal(canonicalIdentity.identity, module.identity);
  assert.deepEqual(getCockpitInteractionOrchestrationIdentity(), canonicalIdentity);
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(module.version, "1.6.0");
  assert.equal(
    module.namespace,
    "nexora.executive.cockpit.integration.interaction-orchestration",
  );
  assert.equal(module.phase, "CockpitInteractionOrchestration");
  assert.equal(module.architecturalRole, "CockpitInteractionOrchestration");
});

test("3. sole immediate dependency is NEX-CI:5", () => {
  assert.equal(
    module.upstreamDependency,
    "NEX-CI:5/AdvisorInsightIntegration",
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/nex-ci/advisorInsightIntegration",
  );
  assert.equal(boundary.consumesNexCi5Only, true);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) => entry === "@/app/lib/nex-ci/advisorInsightIntegration",
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
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding|executiveStageIntegration|workspaceDialExperienceSwitching)["']/,
  );
  assert.equal(boundary.implementsNexCi7, false);
  assert.equal(boundary.ownsTimelineDetail, false);
  assert.equal(boundary.ownsExplorerDetail, false);
  assert.equal(boundary.ownsLiveLensDetail, false);
});

test("5. interaction vocabularies and capability matrix", () => {
  assert.equal(sources.length, 10);
  assert.equal(kinds.length, 15);
  assert.deepEqual([...statuses], ["accepted", "rejected", "ignored", "deferred"]);
  assert.equal(reasons.length, 12);
  assert.deepEqual([...priorities], ["critical", "high", "normal", "low"]);
  assert.equal(reactionKinds.length, 19);
  assert.equal(isSourceCapableOfInteraction("stage", "select"), true);
  assert.equal(isSourceCapableOfInteraction("stage", "change-workspace"), false);
  assert.equal(isSourceCapableOfInteraction("workspace-dial", "change-workspace"), true);
  assert.equal(isSourceCapableOfInteraction("advisor", "request-guidance"), true);
  assert.equal(isSourceCapableOfInteraction("insight", "request-insight"), true);
  assert.ok(matrix.stage.includes("focus"));
  assert.ok(matrix.navigation.includes("change-presentation"));
});

test("6. Stage select / focus / clear / same-subject no-op", () => {
  const base = makeOrchestration({ withStageGraph: true });

  const selected = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveStageInteractionIntent("select", "object-1"),
  );
  assert.equal(selected.resolution.status, "accepted");
  assert.equal(selected.snapshot.selectedSubject?.id, "object-1");
  assert.equal(selected.snapshot.focusedSubject, undefined);
  assert.ok(reactionKindsOf(selected).includes("update-selection"));
  assert.ok(reactionKindsOf(selected).includes("update-advisor"));
  assert.ok(reactionKindsOf(selected).includes("update-insight"));

  const sameSelect = orchestrateExecutiveCockpitInteraction(
    selected.snapshot,
    createExecutiveStageInteractionIntent("select", "object-1"),
  );
  assert.equal(sameSelect.resolution.status, "ignored");
  assert.equal(sameSelect.resolution.reason, "no-op");
  assert.equal(sameSelect.reactions.length, 0);

  const focused = orchestrateExecutiveCockpitInteraction(
    selected.snapshot,
    createExecutiveStageInteractionIntent("focus", "object-1"),
  );
  assert.equal(focused.resolution.status, "accepted");
  assert.equal(focused.snapshot.focusedSubject?.id, "object-1");
  assert.equal(focused.snapshot.selectedSubject?.id, "object-1");
  assert.ok(reactionKindsOf(focused).includes("update-focus"));
  assert.ok(reactionKindsOf(focused).includes("update-timeline"));

  const clearedFocus = orchestrateExecutiveCockpitInteraction(
    focused.snapshot,
    createExecutiveStageInteractionIntent("clear-focus"),
  );
  assert.equal(clearedFocus.resolution.status, "accepted");
  assert.equal(clearedFocus.snapshot.focusedSubject, undefined);
  assert.ok(reactionKindsOf(clearedFocus).includes("restore-cockpit"));

  const clearedSelection = orchestrateExecutiveCockpitInteraction(
    selected.snapshot,
    createExecutiveStageInteractionIntent("clear-selection"),
  );
  assert.equal(clearedSelection.resolution.status, "accepted");
  assert.equal(clearedSelection.snapshot.selectedSubject, undefined);
});

test("7. workspace change / already-active / transition conflict", () => {
  const base = makeOrchestration({ withStageGraph: true });

  const changed = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveWorkspaceSelectionIntent("workspace.problem"),
  );
  assert.equal(changed.resolution.status, "accepted");
  assert.equal(changed.snapshot.currentWorkspace?.kind, "overview");
  assert.equal(changed.snapshot.targetWorkspace?.kind, "problem");
  assert.ok(reactionKindsOf(changed).includes("update-workspace"));

  const already = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveWorkspaceSelectionIntent("workspace.overview"),
  );
  assert.equal(already.resolution.status, "ignored");
  assert.equal(already.resolution.reason, "no-op");

  const during = orchestrateExecutiveCockpitInteraction(
    changed.snapshot,
    createExecutiveWorkspaceSelectionIntent("workspace.scenario"),
  );
  assert.equal(during.resolution.status, "rejected");
  assert.equal(during.resolution.reason, "transition-in-progress");

  const focusDeferred = orchestrateExecutiveCockpitInteraction(
    changed.snapshot,
    createExecutiveStageInteractionIntent("focus", "object-1"),
  );
  assert.equal(focusDeferred.resolution.status, "deferred");
  assert.equal(focusDeferred.resolution.reason, "transition-in-progress");
});

test("8. presentation change and same-presentation no-op", () => {
  const base = makeOrchestration({ presentationState: "report" });
  const changed = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "change-presentation",
      presentationState: "operation",
    }),
  );
  assert.equal(changed.resolution.status, "accepted");
  assert.equal(changed.snapshot.presentationState, "operation");
  assert.ok(reactionKindsOf(changed).includes("update-presentation"));

  const same = orchestrateExecutiveCockpitInteraction(
    changed.snapshot,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "change-presentation",
      presentationState: "operation",
    }),
  );
  assert.equal(same.resolution.status, "ignored");
  assert.equal(same.resolution.reason, "no-op");
});

test("9. Advisor / Insight request routing and unavailable", () => {
  const base = makeOrchestration({
    withStageGraph: true,
    focusedSubject: { id: "object-1", kind: "object" },
  });

  const guidance = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveAdvisorGuidanceIntent("subject", "object-1"),
  );
  assert.equal(guidance.resolution.status, "accepted");
  assert.equal(guidance.resolution.intent.kind, "request-guidance");
  assert.ok(reactionKindsOf(guidance).includes("update-advisor"));
  assert.equal(guidance.snapshot.focusedSubject?.id, "object-1");

  const insight = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveInsightRequestIntent("relationship", "object-1"),
  );
  assert.equal(insight.resolution.status, "accepted");
  assert.ok(reactionKindsOf(insight).includes("update-insight"));

  const unavailable = makeOrchestration({ status: "unavailable" });
  const blockedAdvisor = orchestrateExecutiveCockpitInteraction(
    unavailable,
    createExecutiveAdvisorGuidanceIntent("general"),
  );
  assert.equal(blockedAdvisor.resolution.status, "rejected");
  assert.equal(blockedAdvisor.resolution.reason, "surface-unavailable");

  const blockedInsight = orchestrateExecutiveCockpitInteraction(
    unavailable,
    createExecutiveInsightRequestIntent("general"),
  );
  assert.equal(blockedInsight.resolution.status, "rejected");
  assert.equal(blockedInsight.resolution.reason, "surface-unavailable");
});

test("10. surface activate / deactivate / open / close / dismiss / context-open", () => {
  const base = makeOrchestration();

  const activated = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "activate",
      targetSurface: "explorer",
    }),
  );
  assert.equal(activated.resolution.status, "accepted");
  assert.equal(activated.snapshot.activeSurface, "explorer");
  assert.ok(reactionKindsOf(activated).includes("activate-surface"));

  const alreadyActive = orchestrateExecutiveCockpitInteraction(
    activated.snapshot,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "activate",
      targetSurface: "explorer",
    }),
  );
  assert.equal(alreadyActive.resolution.status, "ignored");
  assert.equal(alreadyActive.resolution.reason, "already-active");

  const deactivated = orchestrateExecutiveCockpitInteraction(
    activated.snapshot,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "deactivate",
      targetSurface: "explorer",
    }),
  );
  assert.equal(deactivated.resolution.status, "accepted");
  assert.equal(deactivated.snapshot.activeSurface, "stage");

  const opened = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "advisor",
      kind: "open",
      targetSurface: "advisor",
    }),
  );
  assert.equal(opened.resolution.status, "accepted");
  assert.ok(reactionKindsOf(opened).includes("open-surface"));

  const closed = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "close",
      targetSurface: "insight",
    }),
  );
  assert.equal(closed.resolution.status, "accepted");
  assert.ok(reactionKindsOf(closed).includes("close-surface"));

  const dismissed = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "advisor",
      kind: "dismiss",
      targetSurface: "advisor",
    }),
  );
  assert.equal(dismissed.resolution.status, "accepted");
  assert.equal(dismissed.snapshot.selectedSubject, undefined);

  const contextOpen = orchestrateExecutiveCockpitInteraction(
    makeOrchestration({
      withStageGraph: true,
      selectedSubject: { id: "object-1", kind: "object" },
    }),
    createExecutiveStageInteractionIntent("context-open", "object-1"),
  );
  assert.equal(contextOpen.resolution.status, "accepted");
  assert.ok(reactionKindsOf(contextOpen).includes("update-context-bar"));
});

test("11. unsupported source/kind and unavailable target", () => {
  const base = makeOrchestration();
  const unsupported = resolveExecutiveCockpitInteraction(
    base,
    createExecutiveCockpitInteractionIntent({
      source: "stage",
      kind: "change-workspace",
      workspaceId: "workspace.problem",
    }),
  );
  assert.equal(unsupported.status, "rejected");
  assert.equal(unsupported.reason, "unsupported-by-source");

  const unavailableTarget = resolveExecutiveCockpitInteraction(
    makeOrchestration({ status: "unavailable" }),
    createExecutiveCockpitInteractionIntent({
      source: "navigation",
      kind: "activate",
      targetSurface: "timeline",
    }),
  );
  assert.equal(unavailableTarget.status, "rejected");
  assert.equal(unavailableTarget.reason, "surface-unavailable");
});

test("12. multi-reaction generation, ordering, deduplication", () => {
  const base = makeOrchestration({ withStageGraph: true });
  const focused = orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveStageInteractionIntent("focus", "object-1"),
  );
  assert.ok(focused.reactions.length >= 8);
  const orders = focused.reactions.map((reaction) =>
    reactionKinds.indexOf(reaction.kind),
  );
  assert.deepEqual(
    orders,
    [...orders].sort((a, b) => a - b),
  );
  assert.ok(reactionKindsOf(focused).includes("update-timeline"));
  assert.ok(reactionKindsOf(focused).includes("update-explorer"));
  assert.ok(reactionKindsOf(focused).includes("update-live-lens"));

  const planned = planExecutiveCockpitReactions(base, focused.resolution);
  const keys = planned.map(
    (reaction) =>
      `${reaction.kind}|${reaction.targetSurface ?? ""}|${reaction.subjectId ?? ""}`,
  );
  assert.equal(keys.length, new Set(keys).size);
});

test("13. Timeline / Explorer / Live Lens propagation boundary only", () => {
  assert.equal(module.timelineBoundary, "context-propagation-only·no-replay");
  assert.equal(module.explorerBoundary, "context-propagation-only·no-workflows");
  assert.equal(
    module.liveLensBoundary,
    "context-propagation-only·no-goal-object-pack",
  );
  assert.doesNotMatch(source, /function\s+replayTimeline/);
  assert.doesNotMatch(source, /navigateGoalObjectPack/);
  assert.equal(boundary.ownsTimelineDetail, false);
});

test("14. deterministic orchestration, normalization, immutability", () => {
  const base = makeOrchestration({
    withStageGraph: true,
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  const intent = createExecutiveStageInteractionIntent("focus", "object-1");
  const a = orchestrateExecutiveCockpitInteraction(base, intent);
  const b = orchestrateExecutiveCockpitInteraction(base, intent);
  assert.deepEqual(a.resolution, b.resolution);
  assert.deepEqual(a.reactions, b.reactions);
  assert.equal(a.snapshot.focusedSubject?.id, b.snapshot.focusedSubject?.id);

  const normalized = normalizeExecutiveCockpitInteractionIntent(
    createExecutiveWorkspaceSelectionIntent("workspace.decision"),
  );
  assert.equal(normalized.kind, "change-workspace");
  assert.equal(normalized.source, "workspace-dial");

  const frozenSelected = base.selectedSubject;
  orchestrateExecutiveCockpitInteraction(
    base,
    createExecutiveStageInteractionIntent("select", "object-1"),
  );
  assert.equal(base.selectedSubject, frozenSelected);
  assert.ok(Object.isFrozen(base));
  assert.ok(Object.isFrozen(a.snapshot));
  assert.ok(Object.isFrozen(a.reactions));

  const diff = resolveExecutiveCockpitSnapshotReactions(base, a.snapshot);
  assert.ok(diff.some((reaction) => reaction.kind === "update-focus"));
});

test("15. validation / invariants", () => {
  const snapshot = makeOrchestration({ withStageGraph: true });
  const validation = validateExecutiveCockpitInteractionOrchestration(snapshot);
  assert.equal(validation.ok, true);
  assert.equal(validation.sourceCount, 10);
  assert.equal(validation.kindCount, 15);
  assert.equal(validation.guaranteeCount, 26);
  assert.equal(validation.matrixComplete, true);
  assert.equal(verifyCockpitInteractionOrchestration().ok, true);
  assert.equal(guarantees.length, 26);
  assert.equal(apiNames.length, 31);
  assert.ok(forbiddenResponsibilities.length >= 8);
  assert.equal(
    resolveExecutiveCockpitOrchestrationSnapshot(snapshot.advisorInsight)
      .orchestrationIdentity,
    module.identity,
  );
});

test("16. no React / Three.js / R3F / AI SDK / network coupling", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /\bfrom\s+["']openai["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']@anthropic-ai\//);
  assert.doesNotMatch(source, /\bfrom\s+["']@google\/generative-ai["']/);
  assert.doesNotMatch(
    source,
    /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|openai\.|anthropic\.|@google\/generative-ai)\b/i,
  );
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesAiSdk, false);
  assert.equal(boundary.surfacesNeverDirectlyMutateEachOther, true);
});
