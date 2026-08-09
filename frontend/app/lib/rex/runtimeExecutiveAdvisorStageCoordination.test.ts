import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  assembleRuntimeExecutiveAdvisorGuidancePackage,
  runtimeExecutiveAdvisorGuidanceActionsIdentity,
  runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
  type RuntimeExecutiveAdvisorExecutiveAction,
  type RuntimeExecutiveAdvisorGuidance,
  verifyRuntimeExecutiveAdvisorGuidanceActions,
} from "@/app/lib/rex/runtimeExecutiveAdvisorGuidanceActions";

import {
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS as mappings,
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN as emptyPlan,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES as authorities,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_FORBIDDEN,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS as intents,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS as operations,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS as preconditionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES as priorities,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES as states,
  evaluateRuntimeExecutiveAdvisorStageCoordinationPreconditions,
  getRuntimeExecutiveAdvisorStageCoordinationIdentity,
  isRuntimeExecutiveAdvisorStageCoordinationReady,
  mapRuntimeExecutiveAdvisorActionToCoordinationIntent,
  orderRuntimeExecutiveAdvisorStageCoordinationSteps,
  resolveRuntimeExecutiveAdvisorStageCoordinationAuthority,
  resolveRuntimeExecutiveAdvisorStageCoordinationConflicts,
  resolveRuntimeExecutiveAdvisorStageCoordinationPlan,
  resolveRuntimeExecutiveAdvisorStageCoordinationResult,
  resolveRuntimeExecutiveAdvisorStageCoordinationState,
  runtimeExecutiveAdvisorStageCoordination as module,
  runtimeExecutiveAdvisorStageCoordinationApiNames as apiNames,
  runtimeExecutiveAdvisorStageCoordinationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorStageCoordinationRegistry as registry,
  validateRuntimeExecutiveAdvisorStageCoordinationPlan,
  validateRuntimeExecutiveAdvisorStageCoordinationStep,
  verifyRuntimeExecutiveAdvisorStageCoordination,
} from "./runtimeExecutiveAdvisorStageCoordination.ts";

const source = readFileSync(
  new URL("./runtimeExecutiveAdvisorStageCoordination.ts", import.meta.url),
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
    target: overrides.target ??
      Object.freeze({ subjectId: "object.factory" }),
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
        Object.freeze({
          kind: "stage-selection" as const,
          sourceId: "src.1",
        }),
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
        Object.freeze({
          kind: "stage-selection" as const,
          sourceId: "src.1",
        }),
      ],
    ),
  });
}

function pkg(input: {
  readonly guidance?: RuntimeExecutiveAdvisorGuidance[];
  readonly actions: RuntimeExecutiveAdvisorExecutiveAction[];
  readonly primaryId?: string | null;
  readonly state?: "none" | "available" | "recommended" | "urgent";
}) {
  const guidanceItems = input.guidance ?? [
    guidance({ id: "g.inspect", kind: "inspect" }),
  ];
  const primary =
    input.primaryId === null
      ? null
      : guidanceItems.find((entry) => entry.id === (input.primaryId ?? "g.inspect")) ??
        guidanceItems[0] ??
        null;
  return assembleRuntimeExecutiveAdvisorGuidancePackage({
    state: input.state ?? "available",
    primaryGuidance: primary,
    guidance: guidanceItems,
    actions: input.actions,
    confidence: "medium",
    urgency: "low",
  });
}

test("1. exact identity / version / namespace / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:5/RuntimeExecutiveAdvisorStageCoordination",
  );
  assert.equal(module.version, "3.5.0");
  assert.equal(
    module.namespace,
    "nexora.rex.advisor-experience.stage-coordination",
  );
  assert.equal(module.status, "CoordinationReady");
  assert.equal(
    module.upstreamDependency,
    "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorGuidanceActionsIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorStageCoordinationIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorGuidanceActions",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:ResponseModel|ContextSubjectBinding|ExperienceFoundation)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)[^"']*["']/,
  );
});

test("2. vocabulary collections, mappings, registry", () => {
  assert.deepEqual([...states], ["none", "planned", "ready", "blocked"]);
  assert.equal(intents.length, 12);
  assert.equal(operations.length, 10);
  assert.deepEqual([...priorities], [
    "background",
    "normal",
    "high",
    "critical",
  ]);
  assert.deepEqual([...authorities], [
    "advisor-request",
    "manager-confirmed",
    "runtime-approved",
  ]);
  assert.equal(preconditionKinds.length, 9);
  assert.equal(mappings.length, 12);
  assert.equal(capabilities.length, 22);
  assert.deepEqual([...registrySections], [
    "Identity",
    "CoordinationStates",
    "CoordinationIntents",
    "CoordinationOperations",
    "CoordinationPriorities",
    "CoordinationAuthorities",
    "Preconditions",
    "ActionMappings",
    "Sequencing",
    "Validation",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.actionMappingCount, mappings.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
  assert.deepEqual(
    [...mapRuntimeExecutiveAdvisorActionToCoordinationIntent("inspect-subject")],
    ["observe", "focus"],
  );
  assert.deepEqual(
    [...mapRuntimeExecutiveAdvisorActionToCoordinationIntent("focus-subject")],
    ["focus"],
  );
  assert.deepEqual(
    [
      ...mapRuntimeExecutiveAdvisorActionToCoordinationIntent(
        "trace-relationship",
      ),
    ],
    ["trace"],
  );
});

test("3. empty coordination plan", () => {
  const plan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    assembleRuntimeExecutiveAdvisorGuidancePackage({
      state: "none",
      primaryGuidance: null,
      guidance: [],
      actions: [],
      confidence: "unknown",
      urgency: "none",
    }),
  );
  assert.deepEqual(plan, emptyPlan);
  assert.equal(plan.state, "none");
  assert.equal(plan.isReady, false);
  assert.equal(plan.steps.length, 0);
});

test("4. Example A — inspect Factory → request-focus (least invasive)", () => {
  const plan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      actions: [
        action({
          id: "a.inspect",
          kind: "inspect-subject",
          targetSubjectIds: ["object.factory"],
        }),
      ],
    }),
  );
  assert.equal(plan.state, "ready");
  assert.equal(plan.isReady, true);
  const focus = plan.steps.find((step) => step.operation === "request-focus");
  assert.ok(focus);
  assert.equal(focus!.intent, "focus");
  assert.deepEqual([...focus!.target.subjectIds], ["object.factory"]);
  assert.equal(focus!.authority, "advisor-request");
  assert.equal(
    plan.steps.some((step) => step.operation === "request-selection"),
    false,
  );
  const presentation = plan.steps.find(
    (step) => step.operation === "request-presentation-state",
  );
  assert.ok(presentation);
  assert.equal(presentation!.target.presentationState, "report");
});

test("5. explicit focus + selection protection + highlight", () => {
  const focusPlan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.focus", kind: "investigate" })],
      actions: [
        action({
          id: "a.focus",
          kind: "focus-subject",
          authority: "runtime-coordination",
          safety: "navigational",
          sourceGuidanceIds: ["g.focus"],
          targetSubjectIds: ["object.factory"],
        }),
      ],
      primaryId: "g.focus",
    }),
  );
  assert.ok(
    focusPlan.steps.some((step) => step.operation === "request-focus"),
  );

  const protectedPlan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [
        guidance({
          id: "g.inspect.delivery",
          kind: "inspect",
          target: Object.freeze({ subjectId: "object.delivery" }),
        }),
      ],
      actions: [
        action({
          id: "a.inspect.delivery",
          kind: "inspect-subject",
          targetSubjectIds: ["object.delivery"],
          sourceGuidanceIds: ["g.inspect.delivery"],
        }),
      ],
      primaryId: "g.inspect.delivery",
    }),
    { managerSelectedSubjectId: "object.factory" },
  );
  assert.equal(
    protectedPlan.steps.some((step) => step.operation === "request-selection"),
    false,
  );
  assert.ok(
    protectedPlan.steps.some(
      (step) =>
        step.operation === "request-highlight" &&
        step.target.subjectIds.includes("object.delivery"),
    ),
  );
  assert.equal(
    protectedPlan.steps.some(
      (step) =>
        step.operation === "request-focus" &&
        step.target.subjectIds.includes("object.delivery"),
    ),
    false,
  );
});

test("6. trace / compare / show-related / no path fabrication", () => {
  const relId = "rel:object.factory→object.delivery";
  const traceReady = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [
        guidance({ id: "g.trace", kind: "trace", priority: "high" }),
      ],
      actions: [
        action({
          id: "a.trace",
          kind: "trace-relationship",
          authority: "runtime-coordination",
          safety: "navigational",
          targetSubjectIds: ["object.factory", "object.delivery"],
          sourceGuidanceIds: ["g.trace"],
        }),
      ],
      primaryId: "g.trace",
      state: "recommended",
    }),
    { knownRelationshipIds: [relId] },
  );
  assert.ok(
    traceReady.steps.some(
      (step) =>
        step.operation === "request-path-emphasis" &&
        step.target.relationshipId === relId &&
        step.blocked === false,
    ),
  );
  assert.ok(
    traceReady.steps.some(
      (step) => step.operation === "request-presentation-state",
    ),
  );

  const traceBlocked = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.trace", kind: "trace" })],
      actions: [
        action({
          id: "a.trace",
          kind: "trace-relationship",
          authority: "runtime-coordination",
          targetSubjectIds: ["object.factory", "object.delivery"],
          sourceGuidanceIds: ["g.trace"],
        }),
      ],
      primaryId: "g.trace",
    }),
    { knownRelationshipIds: ["rel:other"] },
  );
  const pathStep = traceBlocked.steps.find(
    (step) => step.operation === "request-path-emphasis",
  );
  assert.ok(pathStep);
  assert.equal(pathStep!.blocked, true);
  assert.ok(
    traceBlocked.state === "blocked" || traceBlocked.state === "planned",
  );

  const compare = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.compare", kind: "compare" })],
      actions: [
        action({
          id: "a.compare",
          kind: "compare-subjects",
          targetSubjectIds: ["scenario.a", "scenario.b"],
          sourceGuidanceIds: ["g.compare"],
          preconditions: [
            Object.freeze({
              kind: "comparison-subjects-present" as const,
              satisfied: true,
            }),
          ],
        }),
      ],
      primaryId: "g.compare",
    }),
  );
  const comparison = compare.steps.find(
    (step) => step.operation === "request-comparison",
  );
  assert.ok(comparison);
  assert.deepEqual([...comparison!.target.subjectIds], [
    "scenario.a",
    "scenario.b",
  ]);
  assert.equal(validateRuntimeExecutiveAdvisorStageCoordinationStep(comparison).ok, true);

  const related = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.related", kind: "monitor" })],
      actions: [
        action({
          id: "a.related",
          kind: "show-related",
          authority: "runtime-coordination",
          safety: "navigational",
          targetSubjectIds: ["object.factory"],
          sourceGuidanceIds: ["g.related"],
        }),
      ],
      primaryId: "g.related",
    }),
  );
  assert.ok(
    related.steps.some((step) => step.operation === "request-related-visibility"),
  );
  assert.ok(
    related.steps.some(
      (step) =>
        step.operation === "request-scene-context" &&
        step.target.sceneMode === "related-context",
    ),
  );
});

test("7. workflow confirmation, dismiss, review presentation", () => {
  const openAction = action({
    id: "a.open",
    kind: "open-scenario",
    state: "requires-confirmation",
    authority: "manager-confirmation",
    safety: "workflow",
    sourceGuidanceIds: ["g.scenario"],
    targetSubjectIds: ["scenario.a"],
  });
  const unconfirmed = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.scenario", kind: "prepare-scenario" })],
      actions: [openAction],
      primaryId: "g.scenario",
    }),
  );
  const workflow = unconfirmed.steps.find(
    (step) => step.operation === "request-workflow-open",
  );
  assert.ok(workflow);
  assert.equal(workflow!.blocked, true);
  assert.equal(workflow!.target.workflow, "scenario");
  assert.ok(
    unconfirmed.state === "planned" || unconfirmed.state === "blocked",
  );
  assert.equal(unconfirmed.isReady, false);

  const confirmed = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.scenario", kind: "prepare-scenario" })],
      actions: [openAction],
      primaryId: "g.scenario",
    }),
    { managerConfirmedActionIds: ["a.open"] },
  );
  const confirmedWorkflow = confirmed.steps.find(
    (step) => step.operation === "request-workflow-open",
  );
  assert.ok(confirmedWorkflow);
  assert.equal(confirmedWorkflow!.blocked, false);
  assert.equal(confirmedWorkflow!.authority, "manager-confirmed");
  assert.equal(confirmed.state, "ready");
  assert.equal(
    resolveRuntimeExecutiveAdvisorStageCoordinationAuthority(openAction, {
      managerConfirmedActionIds: ["a.open"],
    }),
    "manager-confirmed",
  );

  const dismiss = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.observe", kind: "observe" })],
      actions: [
        action({
          id: "a.dismiss",
          kind: "dismiss-guidance",
          sourceGuidanceIds: ["g.observe"],
          targetSubjectIds: [],
        }),
      ],
      primaryId: "g.observe",
    }),
  );
  assert.ok(
    dismiss.steps.some(
      (step) =>
        step.operation === "request-dismiss" && step.intent === "dismiss",
    ),
  );

  const review = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.exec", kind: "prepare-action" })],
      actions: [
        action({
          id: "a.review",
          kind: "review-execution",
          safety: "workflow",
          targetSubjectIds: ["execution.capacity"],
          sourceGuidanceIds: ["g.exec"],
        }),
      ],
      primaryId: "g.exec",
    }),
  );
  assert.ok(
    review.steps.some(
      (step) =>
        step.operation === "request-presentation-state" &&
        step.target.presentationState === "operation",
    ),
  );
});

test("8. preconditions, conflicts, sequencing, dedupe, readiness", () => {
  const compareAction = action({
    id: "a.compare",
    kind: "compare-subjects",
    targetSubjectIds: ["scenario.a"],
    sourceGuidanceIds: ["g.compare"],
  });
  const preconditions =
    evaluateRuntimeExecutiveAdvisorStageCoordinationPreconditions({
      action: compareAction,
      operation: "request-comparison",
      target: Object.freeze({ subjectIds: Object.freeze(["scenario.a"]) }),
      context: {},
    });
  assert.equal(
    preconditions.find((entry) => entry.kind === "comparison-targets-present")
      ?.satisfied,
    false,
  );

  const conflicting = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [
        guidance({ id: "g.primary", kind: "inspect", priority: "high" }),
        guidance({ id: "g.alt", kind: "inspect", priority: "low" }),
      ],
      actions: [
        action({
          id: "a.factory",
          kind: "focus-subject",
          authority: "runtime-coordination",
          targetSubjectIds: ["object.factory"],
          sourceGuidanceIds: ["g.primary"],
        }),
        action({
          id: "a.delivery",
          kind: "focus-subject",
          authority: "advisor-only",
          targetSubjectIds: ["object.delivery"],
          sourceGuidanceIds: ["g.alt"],
        }),
      ],
      primaryId: "g.primary",
      state: "recommended",
    }),
  );
  const focusSteps = conflicting.steps.filter(
    (step) => step.operation === "request-focus",
  );
  assert.equal(focusSteps.length, 1);
  assert.deepEqual([...focusSteps[0]!.target.subjectIds], ["object.factory"]);
  assert.equal(focusSteps[0]!.fromPrimaryGuidance, true);

  const composite = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg({
      guidance: [guidance({ id: "g.trace", kind: "trace", priority: "high" })],
      actions: [
        action({
          id: "a.trace",
          kind: "trace-relationship",
          authority: "runtime-coordination",
          targetSubjectIds: ["object.factory", "object.delivery"],
          sourceGuidanceIds: ["g.trace"],
        }),
        action({
          id: "a.inspect",
          kind: "inspect-subject",
          targetSubjectIds: ["object.factory"],
          sourceGuidanceIds: ["g.trace"],
        }),
      ],
      primaryId: "g.trace",
    }),
    {
      knownRelationshipIds: ["rel:object.factory→object.delivery"],
    },
  );
  assert.ok(composite.steps.length >= 2);
  const ordered = orderRuntimeExecutiveAdvisorStageCoordinationSteps(
    composite.steps,
  );
  const sceneIdx = ordered.findIndex(
    (step) => step.operation === "request-scene-context",
  );
  const pathIdx = ordered.findIndex(
    (step) => step.operation === "request-path-emphasis",
  );
  const presentIdx = ordered.findIndex(
    (step) => step.operation === "request-presentation-state",
  );
  if (pathIdx >= 0 && presentIdx >= 0) {
    assert.ok(pathIdx < presentIdx);
  }
  void sceneIdx;

  const focusDup = composite.steps.filter(
    (step) =>
      step.operation === "request-focus" &&
      step.target.subjectIds.includes("object.factory"),
  );
  assert.ok(focusDup.length <= 1);
  if (focusDup[0]) {
    assert.ok(focusDup[0].sourceActionIds.length >= 1);
  }

  assert.equal(isRuntimeExecutiveAdvisorStageCoordinationReady(composite), true);
  assert.equal(
    validateRuntimeExecutiveAdvisorStageCoordinationPlan(composite).ok,
    true,
  );

  const conflictResolved = resolveRuntimeExecutiveAdvisorStageCoordinationConflicts(
    composite.steps,
  );
  assert.ok(conflictResolved.length >= 1);
});

test("9. determinism, immutability, validation, state consistency", () => {
  const input = pkg({
    actions: [
      action({
        id: "a.inspect",
        kind: "inspect-subject",
        targetSubjectIds: ["object.factory"],
      }),
    ],
  });
  const frozenActions = Object.freeze([...input.actions]);
  const a = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(input);
  const b = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(input);
  assert.deepEqual(a, b);
  assert.equal(input.actions.length, frozenActions.length);
  assert.deepEqual([...input.actions], [...frozenActions]);

  const result = resolveRuntimeExecutiveAdvisorStageCoordinationResult(input);
  assert.equal(result.plan.state, "ready");
  assert.ok(result.readyStepIds.length > 0);
  assert.equal(result.blockedStepIds.length, 0);

  assert.equal(
    resolveRuntimeExecutiveAdvisorStageCoordinationState({ steps: [] }),
    "none",
  );
  assert.equal(validateRuntimeExecutiveAdvisorStageCoordinationPlan(a).ok, true);
  assert.equal(
    validateRuntimeExecutiveAdvisorStageCoordinationStep(a.steps[0]).ok,
    true,
  );
});

test("10. no AI / no UI / no Stage mutation / REX-3:4 compatibility / verification", () => {
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.navigatesApplication, false);
  assert.equal(boundary.forgesManagerConfirmation, false);
  assert.equal(boundary.inventsPaths, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']zustand["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_FORBIDDEN.includes("dispatch()"),
  );
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_FORBIDDEN.includes("navigate()"),
  );
  assert.ok(module.forbiddenResponsibilities.includes("Stage mutation"));

  assert.equal(verifyRuntimeExecutiveAdvisorGuidanceActions().ok, true);
  const verification = verifyRuntimeExecutiveAdvisorStageCoordination();
  assert.equal(verification.ok, true);
  assert.equal(verification.noStageMutation, true);
  assert.equal(verification.noNavigation, true);
  assert.equal(verification.noAutoExecution, true);
  assert.equal(verification.guidanceOk, true);
  assert.equal(verification.coordinationStateCount, 4);
  assert.equal(verification.coordinationIntentCount, 12);
  assert.equal(verification.coordinationOperationCount, 10);
  assert.equal(verification.actionMappingCount, 12);
  assert.equal(verification.capabilityCount, 22);
  assert.equal(verification.sectionCount, 11);
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:6 Advisor Experience Orchestration/,
  );
});
