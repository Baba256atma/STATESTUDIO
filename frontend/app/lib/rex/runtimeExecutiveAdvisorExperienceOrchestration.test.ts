import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN as emptyCoordination,
  assembleRuntimeExecutiveAdvisorGuidancePackage,
  resolveRuntimeExecutiveAdvisorStageCoordinationPlan,
  runtimeExecutiveAdvisorStageCoordinationIdentity,
  runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
  type RuntimeExecutiveAdvisorExecutiveAction,
  type RuntimeExecutiveAdvisorGuidance,
  type RuntimeExecutiveAdvisorStageCoordinationPlan,
  verifyRuntimeExecutiveAdvisorStageCoordination,
} from "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination";

import {
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY as actionVisibilityValues,
  RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS as freshnessValues,
  RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS as coordinationIntents,
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN as emptyPlan,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS as interruptionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES as phases,
  RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS as transitionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY as guidanceVisibilityValues,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_FORBIDDEN,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES as modes,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES as states,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS as triggers,
  RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS as presentationIntents,
  getRuntimeExecutiveAdvisorExperienceOrchestrationIdentity,
  isRuntimeExecutiveAdvisorExperienceExecutable,
  isRuntimeExecutiveAdvisorExperienceStable,
  resolveRuntimeExecutiveAdvisorActionVisibility,
  resolveRuntimeExecutiveAdvisorContextFreshness,
  resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent,
  resolveRuntimeExecutiveAdvisorExperienceOrchestration,
  resolveRuntimeExecutiveAdvisorExperiencePhases,
  resolveRuntimeExecutiveAdvisorGuidanceVisibility,
  resolveRuntimeExecutiveAdvisorOrchestrationMode,
  resolveRuntimeExecutiveAdvisorPresentationIntent,
  runtimeExecutiveAdvisorExperienceOrchestration as module,
  runtimeExecutiveAdvisorExperienceOrchestrationApiNames as apiNames,
  runtimeExecutiveAdvisorExperienceOrchestrationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorExperienceOrchestrationRegistry as registry,
  validateRuntimeExecutiveAdvisorExperienceOrchestration,
  verifyRuntimeExecutiveAdvisorExperienceOrchestration,
} from "./runtimeExecutiveAdvisorExperienceOrchestration.ts";

const source = readFileSync(
  new URL("./runtimeExecutiveAdvisorExperienceOrchestration.ts", import.meta.url),
  "utf8",
);

function guidance(
  overrides: Partial<RuntimeExecutiveAdvisorGuidance> &
    Pick<RuntimeExecutiveAdvisorGuidance, "id" | "kind">,
): RuntimeExecutiveAdvisorGuidance {
  return Object.freeze({
    id: overrides.id,
    kind: overrides.kind,
    priority: overrides.priority ?? "normal",
    target: overrides.target ?? Object.freeze({ subjectId: "object.factory" }),
    confidence: overrides.confidence ?? "medium",
    urgency: overrides.urgency ?? "low",
    rationale: overrides.rationale ??
      Object.freeze({
        sourceObservationIds: Object.freeze(["obs.1"]),
        sourceSignalIds: Object.freeze([] as string[]),
        sourceRelationshipIds: Object.freeze([] as string[]),
        sourceImplicationIds: Object.freeze([] as string[]),
      }),
    provenance: overrides.provenance ??
      Object.freeze([
        Object.freeze({ kind: "stage-selection" as const, sourceId: "src.1" }),
      ]),
    dismissible: overrides.dismissible ?? true,
  });
}

function action(
  overrides: Partial<RuntimeExecutiveAdvisorExecutiveAction> &
    Pick<RuntimeExecutiveAdvisorExecutiveAction, "id" | "kind">,
): RuntimeExecutiveAdvisorExecutiveAction {
  return Object.freeze({
    id: overrides.id,
    kind: overrides.kind,
    state: overrides.state ?? "available",
    authority: overrides.authority ?? "advisor-only",
    safety: overrides.safety ?? "informational",
    targetSubjectIds: Object.freeze(
      overrides.targetSubjectIds ?? ["object.factory"],
    ),
    preconditions: Object.freeze(
      overrides.preconditions ?? [
        Object.freeze({ kind: "subject-present" as const, satisfied: true }),
      ],
    ),
    sourceGuidanceIds: Object.freeze(
      overrides.sourceGuidanceIds ?? ["g.inspect"],
    ),
    provenance: Object.freeze(
      overrides.provenance ?? [
        Object.freeze({ kind: "stage-selection" as const, sourceId: "src.1" }),
      ],
    ),
  });
}

function coordinationFrom(actions: RuntimeExecutiveAdvisorExecutiveAction[], context = {}) {
  const guidanceItems = [
    guidance({
      id: actions[0]?.sourceGuidanceIds[0] ?? "g.inspect",
      kind:
        actions[0]?.kind === "trace-relationship"
          ? "trace"
          : actions[0]?.kind === "open-scenario"
            ? "prepare-scenario"
            : actions[0]?.kind === "compare-subjects"
              ? "compare"
              : "inspect",
      priority: "high",
    }),
  ];
  const pkg = assembleRuntimeExecutiveAdvisorGuidancePackage({
    state: "recommended",
    primaryGuidance: guidanceItems[0]!,
    guidance: guidanceItems,
    actions,
    confidence: "medium",
    urgency: "medium",
  });
  return resolveRuntimeExecutiveAdvisorStageCoordinationPlan(pkg, context);
}

test("1. exact identity / version / namespace / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration",
  );
  assert.equal(module.version, "3.6.0");
  assert.equal(
    module.namespace,
    "nexora.rex.advisor-experience.orchestration",
  );
  assert.equal(module.status, "OrchestrationReady");
  assert.equal(
    module.upstreamDependency,
    "REX-3:5/RuntimeExecutiveAdvisorStageCoordination",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorStageCoordinationIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorExperienceOrchestrationIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:GuidanceActions|ResponseModel|ContextSubjectBinding|ExperienceFoundation)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)[^"']*["']/,
  );
});

test("2. vocabulary collections and registry", () => {
  assert.deepEqual([...states], [
    "idle",
    "prepared",
    "active",
    "suspended",
    "completed",
    "blocked",
  ]);
  assert.deepEqual([...modes], [
    "passive",
    "responsive",
    "guidance",
    "coordinated",
  ]);
  assert.deepEqual([...phases], [
    "observe",
    "understand",
    "respond",
    "guide",
    "coordinate",
    "settle",
  ]);
  assert.equal(triggers.length, 11);
  assert.deepEqual([...presentationIntents], [
    "hidden",
    "signal",
    "summary",
    "guidance",
    "operation",
  ]);
  assert.deepEqual([...guidanceVisibilityValues], [
    "hidden",
    "available",
    "primary",
    "expanded",
  ]);
  assert.deepEqual([...actionVisibilityValues], [
    "hidden",
    "available",
    "confirmation-required",
    "blocked",
  ]);
  assert.deepEqual([...coordinationIntents], [
    "none",
    "defer",
    "request",
    "ready",
  ]);
  assert.deepEqual([...transitionKinds], [
    "enter",
    "advance",
    "hold",
    "resume",
    "settle",
    "dismiss",
  ]);
  assert.deepEqual([...freshnessValues], ["current", "stale", "invalid"]);
  assert.equal(interruptionKinds.length, 7);
  assert.equal(capabilities.length, 18);
  assert.deepEqual([...registrySections], [
    "Identity",
    "OrchestrationStates",
    "OrchestrationModes",
    "ExperiencePhases",
    "Triggers",
    "PresentationIntents",
    "GuidanceVisibility",
    "ActionVisibility",
    "CoordinationExecutionIntents",
    "Transitions",
    "Freshness",
    "Interruptions",
    "Validation",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicApiCount, apiNames.length);
});

test("3. empty / passive / responsive orchestration", () => {
  const empty = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: emptyCoordination,
    trigger: "runtime-context",
  });
  assert.equal(empty.plan.state, "idle");
  assert.equal(empty.plan.mode, "passive");
  assert.equal(empty.plan.steps.length, 0);
  assert.equal(empty.plan.isStable, true);
  assert.equal(empty.plan.isExecutable, false);
  assert.equal(empty.plan.trigger, "runtime-context");

  const passive = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: emptyCoordination,
    trigger: "runtime-context",
    signals: { hasResponse: false, hasGuidance: false },
  });
  assert.equal(passive.plan.mode, "passive");
  assert.deepEqual(
    [...resolveRuntimeExecutiveAdvisorExperiencePhases("passive")],
    ["observe", "settle"],
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPresentationIntent({ mode: "passive" }),
    "signal",
  );

  const responsive = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: emptyCoordination,
    trigger: "stage-selection",
    signals: {
      hasResponse: true,
      hasGuidance: false,
      contextSubjectId: "object.factory",
      experienceSubjectId: "object.factory",
    },
  });
  assert.equal(responsive.plan.mode, "responsive");
  assert.deepEqual(
    [...resolveRuntimeExecutiveAdvisorExperiencePhases("responsive")],
    ["observe", "understand", "respond", "settle"],
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPresentationIntent({ mode: "responsive" }),
    "summary",
  );
  assert.ok(
    responsive.plan.steps.every(
      (step) =>
        step.actionVisibility === "hidden" || step.phase === "respond",
    ),
  );
});

test("4. guidance / coordinated modes, phases, visibility", () => {
  const inspectPlan = coordinationFrom([
    action({
      id: "a.inspect",
      kind: "inspect-subject",
      targetSubjectIds: ["object.delivery"],
      sourceGuidanceIds: ["g.inspect"],
    }),
  ]);

  const guidanceMode = resolveRuntimeExecutiveAdvisorOrchestrationMode({
    coordinationPlan: {
      ...inspectPlan,
      state: "planned",
      isReady: false,
    },
    signals: {
      hasResponse: true,
      hasGuidance: true,
      hasPrimaryGuidance: true,
    },
  });
  // Inspect often produces ready coordination; force guidance via planned package.
  const planned: RuntimeExecutiveAdvisorStageCoordinationPlan = Object.freeze({
    ...inspectPlan,
    state: "planned",
    isReady: false,
    blockedStepIds: Object.freeze(
      inspectPlan.steps.map((step) => step.id),
    ),
    steps: Object.freeze(
      inspectPlan.steps.map((step) =>
        Object.freeze({
          ...step,
          blocked: true,
          preconditions: Object.freeze([
            ...step.preconditions,
            Object.freeze({
              kind: "manager-confirmed" as const,
              satisfied: false,
            }),
          ]),
        }),
      ),
    ),
  });

  const guidanceResult = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: planned,
    trigger: "guidance-ready",
    signals: {
      hasResponse: true,
      hasGuidance: true,
      hasPrimaryGuidance: true,
      actionVisibilityHint: "confirmation-required",
      contextSubjectId: "object.delivery",
      experienceSubjectId: "object.delivery",
    },
  });
  assert.equal(guidanceResult.plan.mode, "guidance");
  assert.deepEqual(
    [...resolveRuntimeExecutiveAdvisorExperiencePhases("guidance")],
    ["observe", "understand", "respond", "guide", "settle"],
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPresentationIntent({ mode: "guidance" }),
    "guidance",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorGuidanceVisibility({
      mode: "guidance",
      signals: { hasGuidance: true, hasPrimaryGuidance: true },
    }),
    "primary",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionVisibility({
      mode: "guidance",
      coordinationPlan: planned,
      signals: { actionVisibilityHint: "confirmation-required" },
    }),
    "confirmation-required",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent({
      mode: "guidance",
      coordinationPlan: planned,
      actionVisibility: "confirmation-required",
    }),
    "defer",
  );

  const readyPlan = coordinationFrom([
    action({
      id: "a.trace",
      kind: "trace-relationship",
      authority: "runtime-coordination",
      safety: "navigational",
      targetSubjectIds: ["object.factory", "object.delivery"],
      sourceGuidanceIds: ["g.inspect"],
    }),
  ], {
    knownRelationshipIds: ["rel:object.factory→object.delivery"],
  });
  assert.equal(readyPlan.state, "ready");

  const coordinated = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: readyPlan,
    trigger: "coordination-ready",
    signals: {
      hasResponse: true,
      hasGuidance: true,
      hasPrimaryGuidance: true,
      hasAlternativeGuidance: true,
      contextSubjectId: "object.factory",
      experienceSubjectId: "object.factory",
    },
  });
  assert.equal(coordinated.plan.mode, "coordinated");
  assert.deepEqual(
    coordinated.plan.steps.map((step) => step.phase),
    ["observe", "understand", "respond", "guide", "coordinate", "settle"],
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPresentationIntent({ mode: "coordinated" }),
    "operation",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorGuidanceVisibility({
      mode: "coordinated",
      signals: {
        hasGuidance: true,
        hasPrimaryGuidance: true,
        hasAlternativeGuidance: true,
      },
    }),
    "expanded",
  );
  const coordinateStep = coordinated.plan.steps.find(
    (step) => step.phase === "coordinate",
  );
  assert.ok(coordinateStep);
  assert.equal(coordinateStep!.coordinationExecutionIntent, "ready");
  assert.ok(coordinateStep!.coordinationStepIds.length > 0);
  assert.equal(coordinated.plan.state, "active");
  assert.equal(isRuntimeExecutiveAdvisorExperienceStable(coordinated.plan), true);
  assert.equal(
    isRuntimeExecutiveAdvisorExperienceExecutable(coordinated.plan),
    true,
  );
  void guidanceMode;
});

test("5. confirmation defer, blocked, freshness, interruptions, dismiss", () => {
  const openPlan = coordinationFrom([
    action({
      id: "a.open",
      kind: "open-scenario",
      state: "requires-confirmation",
      authority: "manager-confirmation",
      safety: "workflow",
      targetSubjectIds: ["scenario.a"],
      sourceGuidanceIds: ["g.inspect"],
    }),
  ]);
  const deferred = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: openPlan,
    trigger: "guidance-ready",
    signals: {
      hasGuidance: true,
      hasPrimaryGuidance: true,
      managerConfirmed: false,
      contextSubjectId: "scenario.a",
      experienceSubjectId: "scenario.a",
    },
  });
  assert.ok(
    deferred.plan.mode === "guidance" || deferred.plan.mode === "coordinated",
  );
  const actionVis = resolveRuntimeExecutiveAdvisorActionVisibility({
    mode: "guidance",
    coordinationPlan: openPlan,
    signals: { managerConfirmed: false },
  });
  assert.equal(actionVis, "confirmation-required");
  assert.equal(
    resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent({
      mode: "guidance",
      coordinationPlan: openPlan,
      actionVisibility: "confirmation-required",
    }),
    "defer",
  );
  assert.equal(deferred.plan.isExecutable, false);

  const confirmedPlan = coordinationFrom(
    [
      action({
        id: "a.open",
        kind: "open-scenario",
        state: "requires-confirmation",
        authority: "manager-confirmation",
        safety: "workflow",
        targetSubjectIds: ["scenario.a"],
        sourceGuidanceIds: ["g.inspect"],
      }),
    ],
    { managerConfirmedActionIds: ["a.open"] },
  );
  const confirmed = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: confirmedPlan,
    trigger: "action-confirmed",
    signals: {
      hasGuidance: true,
      hasPrimaryGuidance: true,
      managerConfirmed: true,
      contextSubjectId: "scenario.a",
      experienceSubjectId: "scenario.a",
    },
  });
  assert.ok(
    confirmed.plan.steps.some(
      (step) => step.coordinationExecutionIntent === "ready",
    ) ||
      confirmed.plan.mode === "coordinated",
  );

  const blockedPlan: RuntimeExecutiveAdvisorStageCoordinationPlan =
    Object.freeze({
      ...openPlan,
      state: "blocked",
      isReady: false,
      blockedStepIds: Object.freeze(openPlan.steps.map((step) => step.id)),
      steps: Object.freeze(
        openPlan.steps.map((step) => Object.freeze({ ...step, blocked: true })),
      ),
    });
  const blocked = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: blockedPlan,
    trigger: "coordination-ready",
    signals: {
      hasGuidance: true,
      hasPrimaryGuidance: true,
      contextSubjectId: "scenario.a",
      experienceSubjectId: "scenario.a",
    },
  });
  assert.ok(
    blocked.plan.state === "blocked" ||
      blocked.plan.steps.some((step) => step.actionVisibility === "blocked"),
  );
  assert.equal(blocked.plan.isExecutable, false);

  assert.equal(
    resolveRuntimeExecutiveAdvisorContextFreshness({
      trigger: "runtime-context",
      signals: {
        contextSubjectId: "object.factory",
        experienceSubjectId: "object.factory",
      },
    }),
    "current",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorContextFreshness({
      trigger: "subject-change",
      signals: {
        contextSubjectId: "object.customer",
        experienceSubjectId: "object.delivery",
      },
    }),
    "stale",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorContextFreshness({
      trigger: "context-invalidated",
      signals: { contextSubjectId: null, experienceSubjectId: "object.factory" },
    }),
    "invalid",
  );

  const stale = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: coordinationFrom([
      action({ id: "a.inspect", kind: "inspect-subject" }),
    ]),
    trigger: "subject-change",
    signals: {
      hasGuidance: true,
      previouslyActive: true,
      contextSubjectId: "object.customer",
      experienceSubjectId: "object.delivery",
      interruption: "selection-changed",
    },
  });
  assert.equal(stale.plan.state, "suspended");
  assert.equal(stale.plan.freshness, "stale");
  assert.equal(stale.plan.isExecutable, false);
  assert.equal(stale.plan.isStable, false);

  const invalid = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: coordinationFrom([
      action({ id: "a.inspect", kind: "inspect-subject" }),
    ]),
    trigger: "context-invalidated",
    signals: {
      hasGuidance: true,
      previouslyActive: true,
      contextSubjectId: null,
      experienceSubjectId: "object.factory",
    },
  });
  assert.equal(invalid.plan.state, "completed");
  assert.equal(invalid.freshness, "invalid");
  assert.equal(invalid.plan.steps[0]?.guidanceVisibility, "hidden");

  const manager = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: coordinationFrom([
      action({ id: "a.inspect", kind: "inspect-subject" }),
    ]),
    trigger: "interaction",
    signals: {
      hasGuidance: true,
      previouslyActive: true,
      interruption: "manager-action",
      contextSubjectId: "object.customer",
      experienceSubjectId: "object.delivery",
    },
  });
  assert.equal(manager.plan.state, "suspended");
  assert.equal(manager.plan.interruption, "manager-action");

  const dismiss = resolveRuntimeExecutiveAdvisorExperienceOrchestration({
    coordinationPlan: coordinationFrom([
      action({ id: "a.inspect", kind: "inspect-subject" }),
    ]),
    trigger: "dismiss",
    signals: { previouslyActive: true, hasGuidance: true },
  });
  assert.equal(dismiss.plan.state, "completed");
  assert.equal(dismiss.plan.steps[0]?.presentationIntent, "hidden");
  assert.equal(dismiss.plan.steps[0]?.guidanceVisibility, "hidden");
  assert.equal(dismiss.plan.steps[0]?.actionVisibility, "hidden");
  assert.equal(dismiss.plan.steps[0]?.coordinationExecutionIntent, "none");
});

test("6. determinism, immutability, validation, ordering", () => {
  const plan = coordinationFrom([
    action({
      id: "a.inspect",
      kind: "inspect-subject",
      targetSubjectIds: ["object.factory"],
    }),
  ]);
  const input = Object.freeze({
    coordinationPlan: plan,
    trigger: "stage-selection" as const,
    signals: Object.freeze({
      hasResponse: true,
      hasGuidance: true,
      hasPrimaryGuidance: true,
      contextSubjectId: "object.factory",
      experienceSubjectId: "object.factory",
    }),
  });
  const a = resolveRuntimeExecutiveAdvisorExperienceOrchestration(input);
  const b = resolveRuntimeExecutiveAdvisorExperienceOrchestration(input);
  assert.deepEqual(a, b);

  const phaseOrder = a.plan.steps.map((step) => step.phase);
  for (let index = 1; index < phaseOrder.length; index += 1) {
    assert.ok(
      phases.indexOf(phaseOrder[index]!) >=
        phases.indexOf(phaseOrder[index - 1]!),
    );
  }
  assert.ok(a.plan.transitions.length >= 1);
  assert.equal(
    validateRuntimeExecutiveAdvisorExperienceOrchestration(a.plan).ok,
    true,
  );
  assert.equal(plan.steps.length > 0, true);
  assert.equal(input.coordinationPlan.steps.length, plan.steps.length);
});

test("7. no AI / no UI / no Stage mutation / REX-3:5 compatibility / verification", () => {
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.navigatesApplication, false);
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.chatAssumesConversation, false);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']zustand["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_FORBIDDEN.includes("navigate()"),
  );
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_FORBIDDEN.includes("dispatch()"),
  );
  assert.ok(module.forbiddenResponsibilities.includes("React components"));

  assert.equal(verifyRuntimeExecutiveAdvisorStageCoordination().ok, true);
  const verification = verifyRuntimeExecutiveAdvisorExperienceOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.noStageMutation, true);
  assert.equal(verification.noNavigation, true);
  assert.equal(verification.noUi, true);
  assert.equal(verification.noAutoExecution, true);
  assert.equal(verification.coordinationOk, true);
  assert.equal(verification.orchestrationStateCount, 6);
  assert.equal(verification.orchestrationModeCount, 4);
  assert.equal(verification.experiencePhaseCount, 6);
  assert.equal(verification.triggerCount, 11);
  assert.equal(verification.capabilityCount, 18);
  assert.equal(verification.sectionCount, 14);
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:7 Runtime Executive Advisor Experience Platform/,
  );
  assert.deepEqual(emptyPlan.steps, []);
});
