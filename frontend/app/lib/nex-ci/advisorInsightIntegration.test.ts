import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ADVISOR_INSIGHT_INTEGRATION_BOUNDARY as boundary,
  ADVISOR_INSIGHT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  ADVISOR_INSIGHT_INTEGRATION_GUARANTEES as guarantees,
  EXECUTIVE_ADVISOR_CONTEXT_MODES as advisorModes,
  EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS as advisorReactions,
  EXECUTIVE_ADVISOR_READINESS_STATES as advisorReadiness,
  EXECUTIVE_CONTEXT_SUBJECT_ROLES as subjectRoles,
  EXECUTIVE_INSIGHT_CONTEXT_MODES as insightModes,
  EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS as insightReactions,
  EXECUTIVE_INSIGHT_READINESS_STATES as insightReadiness,
  advisorInsightIntegration as module,
  advisorInsightIntegrationApiNames as apiNames,
  advisorInsightIntegrationCanonicalIdentity as canonicalIdentity,
  createExecutiveAdvisorGuidanceIntent,
  createExecutiveInsightRequestIntent,
  getAdvisorInsightIntegrationIdentity,
  isExecutiveAdvisorContextMode,
  isExecutiveInsightContextMode,
  resolveExecutiveAdvisorContext,
  resolveExecutiveAdvisorContextMode,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveAdvisorInsightTransition,
  resolveExecutiveAdvisorReadiness,
  resolveExecutiveContextSubjects,
  resolveExecutiveInsightContext,
  resolveExecutiveInsightContextMode,
  resolveExecutiveInsightReadiness,
  validateExecutiveAdvisorInsightIntegration,
  verifyAdvisorInsightIntegration,
} from "./advisorInsightIntegration.ts";

import {
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
  type ExecutiveWorkspaceExperienceSnapshot,
} from "./workspaceDialExperienceSwitching.ts";

const source = readFileSync(
  new URL("./advisorInsightIntegration.ts", import.meta.url),
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

function makeExperience(input: {
  readonly activeWorkspace?: string;
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
  readonly attentionSubjectId?: string;
  readonly withStageGraph?: boolean;
  readonly transitionTo?: "problem" | "scenario" | "decision" | "execution";
} = {}): ExecutiveWorkspaceExperienceSnapshot {
  const cockpit = resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubjectId: input.selectedSubject?.id,
        focusedSubjectId: input.focusedSubject?.id,
        presentationState: input.presentationState ?? "report",
        attentionSubjectId: input.attentionSubjectId,
      },
      state: {
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubject: input.selectedSubject,
        focusedSubject: input.focusedSubject,
        presentationState: input.presentationState ?? "report",
        attentionSubjectId: input.attentionSubjectId,
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
      (input.activeWorkspace as "overview" | "problem" | "scenario" | "decision" | "execution") ??
        "overview",
    ),
  });

  if (input.transitionTo === undefined) {
    return base;
  }

  return resolveExecutiveWorkspaceExperience({
    cockpit,
    stage,
    currentWorkspace: base.currentWorkspace,
    intent: createExecutiveWorkspaceSelectionIntent(
      `workspace.${input.transitionTo}`,
    ),
  });
}

test("1. identity metadata", () => {
  assert.equal(module.identity, "NEX-CI:5/AdvisorInsightIntegration");
  assert.equal(canonicalIdentity.identity, module.identity);
  assert.deepEqual(getAdvisorInsightIntegrationIdentity(), canonicalIdentity);
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(module.version, "1.5.0");
  assert.equal(
    module.namespace,
    "nexora.executive.cockpit.integration.advisor-insight",
  );
  assert.equal(module.phase, "AdvisorInsightIntegration");
  assert.equal(module.architecturalRole, "AdvisorInsightIntegration");
});

test("3. sole immediate dependency is NEX-CI:4", () => {
  assert.equal(
    module.upstreamDependency,
    "NEX-CI:4/WorkspaceDialExperienceSwitching",
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/nex-ci/workspaceDialExperienceSwitching",
  );
  assert.equal(boundary.consumesNexCi4Only, true);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) =>
        entry === "@/app/lib/nex-ci/workspaceDialExperienceSwitching",
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
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding|executiveStageIntegration)["']/,
  );
  assert.equal(boundary.implementsNexCi6, false);
  assert.equal(boundary.ownsAiExecution, false);
  assert.equal(boundary.ownsContentGeneration, false);
});

test("5. Advisor / Insight mode and readiness vocabularies remain distinct", () => {
  assert.deepEqual([...advisorModes], [
    "general",
    "workspace",
    "subject",
    "transition",
    "attention",
  ]);
  assert.deepEqual([...insightModes], [
    "general",
    "subject",
    "relationship",
    "attention",
    "workspace",
  ]);
  assert.notDeepEqual([...advisorModes], [...insightModes]);
  assert.deepEqual([...advisorReadiness], ["ready", "limited", "unavailable"]);
  assert.deepEqual([...insightReadiness], ["ready", "limited", "unavailable"]);
  assert.deepEqual([...subjectRoles], [
    "focused",
    "selected",
    "primary",
    "related",
  ]);
  assert.equal(advisorReactions.length, 8);
  assert.equal(insightReactions.length, 7);
  assert.ok(insightReactions.includes("relationship-changed"));
  assert.equal(insightReactions.includes("transition-started"), false);
  assert.equal(isExecutiveAdvisorContextMode("transition"), true);
  assert.equal(isExecutiveInsightContextMode("relationship"), true);
});

test("6. empty / general and workspace-only context", () => {
  const empty = resolveExecutiveAdvisorInsightIntegration(makeExperience({}));
  assert.equal(empty.advisor.mode, "workspace");
  assert.equal(empty.insight.mode, "workspace");
  assert.equal(empty.advisor.readiness, "limited");
  assert.equal(empty.insight.readiness, "limited");
  assert.equal(empty.advisor.subjects.length, 0);
  assert.equal(empty.insight.context.selectedSubject, undefined);
  assert.equal("targetWorkspace" in empty.insight.context, false);

  const noWorkspaceLabel = resolveExecutiveAdvisorContext(
    makeExperience({ activeWorkspace: "overview" }),
  );
  assert.equal(noWorkspaceLabel.workspace?.kind, "overview");
});

test("7. selection / focus / precedence / distinction / deduplication", () => {
  const selectedOnly = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      selectedSubject: { id: "object-1", kind: "object" },
    }),
  );
  assert.equal(selectedOnly.advisor.mode, "subject");
  assert.equal(selectedOnly.advisor.context.selectedSubject?.id, "object-1");
  assert.equal(selectedOnly.advisor.context.focusedSubject, undefined);

  const focused = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      selectedSubject: { id: "object-1", kind: "object" },
      focusedSubject: { id: "goal-1", kind: "goal" },
      withStageGraph: true,
    }),
  );
  assert.equal(focused.advisor.context.focusedSubject?.id, "goal-1");
  assert.equal(focused.advisor.context.selectedSubject?.id, "object-1");
  assert.equal(focused.advisor.context.primaryStageSubject?.id, "goal-1");

  const same = resolveExecutiveContextSubjects(
    makeExperience({
      selectedSubject: { id: "object-1", kind: "object" },
      focusedSubject: { id: "object-1", kind: "object" },
      withStageGraph: true,
    }),
  );
  assert.equal(same.filter((entry) => entry.subject.id === "object-1").length, 1);
  assert.equal(same[0]?.role, "focused");
});

test("8. Stage primary fallback and relationship / attention projection", () => {
  const experience = makeExperience({
    focusedSubject: { id: "object-1", kind: "object" },
    attentionSubjectId: "object-1",
    withStageGraph: true,
  });
  const integration = resolveExecutiveAdvisorInsightIntegration(experience);
  assert.equal(integration.advisor.context.primaryStageSubject?.id, "object-1");
  assert.ok(integration.advisor.context.relationships.length >= 1);
  assert.ok(
    integration.advisor.context.relationships.every(
      (relationship) =>
        relationship.sourceSubjectId === "object-1" ||
        relationship.targetSubjectId === "object-1",
    ),
  );
  assert.equal(
    integration.advisor.attentionContext.primaryAttentionSubjectId,
    "object-1",
  );
  assert.equal(integration.insight.mode, "relationship");
  assert.ok(
    integration.advisor.subjects.some((entry) => entry.role === "related"),
  );
});

test("9. Minimum / Report / Operation presentation compatibility", () => {
  for (const presentationState of ["minimum", "report", "operation"] as const) {
    const integration = resolveExecutiveAdvisorInsightIntegration(
      makeExperience({
        focusedSubject: { id: "object-1", kind: "object" },
        presentationState,
      }),
    );
    assert.equal(
      integration.advisor.context.presentationState,
      presentationState,
    );
    assert.equal(
      integration.insight.context.presentationState,
      presentationState,
    );
  }
});

test("10. workspace transition awareness and current/target distinction", () => {
  const integration = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      activeWorkspace: "overview",
      transitionTo: "problem",
      focusedSubject: { id: "object-1", kind: "object" },
    }),
  );
  assert.equal(integration.advisor.mode, "transition");
  assert.equal(integration.advisor.context.workspace?.kind, "overview");
  assert.equal(integration.advisor.context.targetWorkspace?.kind, "problem");
  assert.equal(
    integration.advisor.context.transitionStatus,
    "transitioning",
  );
  assert.equal(integration.insight.context.workspace?.kind, "overview");
  assert.equal("targetWorkspace" in integration.insight.context, false);
  assert.notEqual(integration.insight.mode, "transition");
});

test("11. Advisor / Insight readiness including unavailable", () => {
  const ready = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      focusedSubject: { id: "object-1", kind: "object" },
      withStageGraph: true,
    }),
  );
  assert.equal(ready.advisor.readiness, "ready");
  assert.equal(ready.insight.readiness, "ready");

  const unavailable = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({ status: "unavailable" }),
  );
  assert.equal(unavailable.advisor.readiness, "unavailable");
  assert.equal(unavailable.insight.readiness, "unavailable");

  assert.equal(
    resolveExecutiveAdvisorReadiness(makeExperience({})),
    "limited",
  );
  assert.equal(
    resolveExecutiveInsightReadiness(makeExperience({})),
    "limited",
  );
});

test("12. Advisor and Insight reaction detection and ordering", () => {
  const previous = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({ activeWorkspace: "overview" }),
  );
  const next = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      activeWorkspace: "overview",
      focusedSubject: { id: "object-1", kind: "object" },
      selectedSubject: { id: "goal-1", kind: "goal" },
      presentationState: "operation",
      withStageGraph: true,
    }),
  );
  const transition = resolveExecutiveAdvisorInsightTransition(previous, next);
  assert.ok(
    transition.advisorReactions.some(
      (reaction) => reaction.kind === "context-updated",
    ),
  );
  assert.ok(
    transition.advisorReactions.some(
      (reaction) => reaction.kind === "subject-focused",
    ),
  );
  assert.ok(
    transition.insightReactions.some(
      (reaction) => reaction.kind === "relationship-changed",
    ),
  );
  assert.deepEqual(
    transition.advisorReactions.map((reaction) => reaction.priority),
    [...transition.advisorReactions.map((reaction) => reaction.priority)].sort(
      (a, b) => a - b,
    ),
  );

  const withTransitionPrev = previous;
  const withTransitionNext = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      activeWorkspace: "overview",
      transitionTo: "decision",
    }),
  );
  const advisorTransition = resolveExecutiveAdvisorInsightTransition(
    withTransitionPrev,
    withTransitionNext,
  );
  assert.ok(
    advisorTransition.advisorReactions.some(
      (reaction) => reaction.kind === "transition-started",
    ),
  );
});

test("13. Advisor / Insight independence and guidance/request intent boundaries", () => {
  const integration = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      focusedSubject: { id: "object-1", kind: "object" },
      withStageGraph: true,
      transitionTo: "scenario",
    }),
  );
  assert.notEqual(integration.advisor, integration.insight);
  assert.notEqual(integration.advisor.context, integration.insight.context);
  assert.ok("targetWorkspace" in integration.advisor.context);
  assert.equal("targetWorkspace" in integration.insight.context, false);
  assert.notEqual(integration.advisor.mode, integration.insight.mode);

  const guidance = createExecutiveAdvisorGuidanceIntent(
    "subject",
    "object-1",
  );
  assert.deepEqual(guidance, {
    source: "advisor",
    contextMode: "subject",
    subjectId: "object-1",
  });
  const request = createExecutiveInsightRequestIntent("relationship", "object-1");
  assert.equal(request.source, "insight");
  assert.throws(() =>
    createExecutiveAdvisorGuidanceIntent("relationship" as never),
  );
});

test("14. deterministic snapshot and input immutability", () => {
  const experience = makeExperience({
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
    withStageGraph: true,
  });
  const clone = JSON.stringify(experience);
  const first = resolveExecutiveAdvisorInsightIntegration(experience);
  const second = resolveExecutiveAdvisorInsightIntegration(experience);
  assert.equal(JSON.stringify(experience), clone);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.advisor.context), true);
  assert.equal(Object.isFrozen(first.insight.subjects), true);
});

test("15. validation / invariants", () => {
  const snapshot = resolveExecutiveAdvisorInsightIntegration(
    makeExperience({
      focusedSubject: { id: "object-1", kind: "object" },
      withStageGraph: true,
    }),
  );
  const validation = validateExecutiveAdvisorInsightIntegration(snapshot);
  const verification = verifyAdvisorInsightIntegration();
  assert.equal(validation.ok, true);
  assert.equal(verification.ok, true);
  assert.equal(validation.version, "1.5.0");
  assert.equal(
    validation.dependencyIdentity,
    "NEX-CI:4/WorkspaceDialExperienceSwitching",
  );
  assert.equal(validation.advisorModeCount, 5);
  assert.equal(validation.insightModeCount, 5);
  assert.equal(validation.advisorReadinessCount, 3);
  assert.equal(validation.insightReadinessCount, 3);
  assert.equal(validation.subjectRoleCount, 4);
  assert.equal(validation.advisorReactionKindCount, 8);
  assert.equal(validation.insightReactionKindCount, 7);
  assert.equal(validation.guaranteeCount, 26);
  assert.equal(validation.invariantCount, 26);
  assert.equal(validation.advisorInsightDistinct, true);
  assert.equal(validation.frameworkIndependent, true);
  assert.equal(validation.intelligenceIndependent, true);
  assert.equal(guarantees.length, 26);
  assert.equal(
    resolveExecutiveAdvisorContextMode(
      makeExperience({ activeWorkspace: "overview" }),
    ),
    "workspace",
  );
  assert.equal(
    resolveExecutiveInsightContextMode(
      makeExperience({
        focusedSubject: { id: "object-1", kind: "object" },
        withStageGraph: true,
      }),
    ),
    "relationship",
  );
});

test("16. no React / Three.js / R3F / AI SDK / network coupling", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*|@react-three(?:\/[^"']*)?|openai|@anthropic-ai\/[^"']*|@google\/generative-ai)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|openai\.|anthropic\.|@google\/generative-ai)\b/i,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(/);
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesReactThreeFiber, false);
  assert.equal(boundary.introducesAiSdk, false);
  assert.equal(boundary.ownsNetworkAccess, false);
  assert.equal(boundary.ownsCockpitOrchestration, false);
  assert.equal(boundary.implementsNexCi6, false);
  for (const required of [
    "OpenAI SDK",
    "Advisor content generation",
    "Insight content generation",
    "Cockpit interaction orchestration",
    "NEX-CI:6 Cockpit Interaction Orchestration",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
  assert.equal(apiNames.length, 30);
  assert.ok(module.advisorRole.includes("guidance"));
  assert.ok(module.insightRole.includes("observation"));
});
