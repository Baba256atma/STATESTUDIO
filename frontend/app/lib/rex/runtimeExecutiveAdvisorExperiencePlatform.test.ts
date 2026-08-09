import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN as emptyCoordination,
  assembleRuntimeExecutiveAdvisorGuidancePackage,
  resolveRuntimeExecutiveAdvisorStageCoordinationPlan,
  runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
  runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
  type RuntimeExecutiveAdvisorExecutiveAction,
  type RuntimeExecutiveAdvisorGuidance,
  type RuntimeExecutiveAdvisorOrchestrationInput,
  verifyRuntimeExecutiveAdvisorExperienceOrchestration,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperienceOrchestration";

import {
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY as compatibilityValues,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER as consumer,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES as consumerPolicies,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES as executionModes,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH as healthValues,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES as platformStates,
  getRuntimeExecutiveAdvisorExperiencePlatformIdentity,
  isRuntimeExecutiveAdvisorPlatformCertificationReady,
  isRuntimeExecutiveAdvisorPlatformFreezeReady,
  isRuntimeExecutiveAdvisorPlatformOperational,
  isRuntimeExecutiveAdvisorPlatformReady,
  resolveRuntimeExecutiveAdvisorExperiencePlatform,
  resolveRuntimeExecutiveAdvisorPlatformCompatibility,
  resolveRuntimeExecutiveAdvisorPlatformExecutionMode,
  resolveRuntimeExecutiveAdvisorPlatformHealth,
  resolveRuntimeExecutiveAdvisorPlatformState,
  runtimeExecutiveAdvisorExperiencePlatform as module,
  runtimeExecutiveAdvisorExperiencePlatformApiNames as apiNames,
  runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorExperiencePlatformRegistry as registry,
  validateRuntimeExecutiveAdvisorExperiencePlatform,
  verifyRuntimeExecutiveAdvisorExperiencePlatform,
} from "./runtimeExecutiveAdvisorExperiencePlatform.ts";

const source = readFileSync(
  new URL("./runtimeExecutiveAdvisorExperiencePlatform.ts", import.meta.url),
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

function orchestrationInput(
  actions: RuntimeExecutiveAdvisorExecutiveAction[],
  extras: Partial<RuntimeExecutiveAdvisorOrchestrationInput> = {},
  coordinationContext = {},
): RuntimeExecutiveAdvisorOrchestrationInput {
  const guidanceItems = [
    guidance({
      id: actions[0]?.sourceGuidanceIds[0] ?? "g.inspect",
      kind:
        actions[0]?.kind === "trace-relationship"
          ? "trace"
          : actions[0]?.kind === "open-scenario"
            ? "prepare-scenario"
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
  const coordinationPlan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    pkg,
    coordinationContext,
  );
  return Object.freeze({
    coordinationPlan,
    trigger: extras.trigger ?? "stage-selection",
    signals: Object.freeze({
      hasResponse: true,
      hasGuidance: true,
      hasPrimaryGuidance: true,
      contextSubjectId: "object.factory",
      experienceSubjectId: "object.factory",
      ...extras.signals,
    }),
  });
}

test("1. exact identity / version / namespace / status / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform",
  );
  assert.equal(module.version, "3.7.0");
  assert.equal(module.namespace, "nexora.rex.advisor-experience.platform");
  assert.equal(module.status, "PlatformReady");
  assert.equal(
    module.upstreamDependency,
    "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorExperiencePlatformIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorExperienceOrchestration",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:StageCoordination|GuidanceActions|ResponseModel|ContextSubjectBinding|ExperienceFoundation)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)[^"']*["']/,
  );
});

test("2. vocabulary, registries, dynamic counts", () => {
  assert.deepEqual([...platformStates], [
    "idle",
    "ready",
    "active",
    "degraded",
    "blocked",
  ]);
  assert.deepEqual([...executionModes], [
    "observe-only",
    "response",
    "guidance",
    "coordinated",
  ]);
  assert.deepEqual([...healthValues], ["healthy", "degraded", "blocked"]);
  assert.deepEqual([...compatibilityValues], ["compatible", "incompatible"]);
  assert.equal(capabilities.length, 18);
  assert.equal(guarantees.length, 18);
  assert.equal(consumerPolicies.length, 8);
  assert.deepEqual([...registrySections], [
    "Identity",
    "PlatformStates",
    "ExecutionModes",
    "Health",
    "Compatibility",
    "PublicAPIs",
    "Capabilities",
    "Guarantees",
    "Validation",
    "ConsumerPolicy",
    "CertificationReadiness",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.platformStateCount, platformStates.length);
  assert.equal(registry.executionModeCount, executionModes.length);
  assert.equal(registry.healthCount, healthValues.length);
  assert.equal(registry.compatibilityCount, compatibilityValues.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.consumerPolicyCount, consumerPolicies.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(consumer.role, "RuntimeExecutiveAdvisorPlatformConsumer");
  assert.equal(consumer.mayImportLowerRex3Phases, false);
  assert.equal(consumer.finalPublicEntry, false);
});

test("3. empty / observe-only / response / guidance / coordinated", () => {
  const empty = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: Object.freeze({
      coordinationPlan: emptyCoordination,
      trigger: "runtime-context",
    }),
  });
  assert.equal(empty.state, "idle");
  assert.equal(empty.executionMode, "observe-only");
  assert.equal(empty.health, "healthy");
  assert.equal(empty.compatibility, "compatible");
  assert.equal(empty.isReady, true);
  assert.equal(empty.isOperational, false);
  assert.equal(isRuntimeExecutiveAdvisorPlatformReady(empty), true);
  assert.equal(isRuntimeExecutiveAdvisorPlatformOperational(empty), false);

  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("passive"),
    "observe-only",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("responsive"),
    "response",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("guidance"),
    "guidance",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("coordinated"),
    "coordinated",
  );

  const responsive = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: Object.freeze({
      coordinationPlan: emptyCoordination,
      trigger: "stage-selection",
      signals: Object.freeze({
        hasResponse: true,
        hasGuidance: false,
        contextSubjectId: "object.factory",
        experienceSubjectId: "object.factory",
      }),
    }),
  });
  assert.equal(responsive.executionMode, "response");
  assert.ok(
    responsive.state === "active" || responsive.state === "ready",
  );

  const coordinated = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [
        action({
          id: "a.trace",
          kind: "trace-relationship",
          authority: "runtime-coordination",
          safety: "navigational",
          targetSubjectIds: ["object.factory", "object.delivery"],
        }),
      ],
      {
        trigger: "coordination-ready",
        signals: {
          hasResponse: true,
          hasGuidance: true,
          hasPrimaryGuidance: true,
          contextSubjectId: "object.factory",
          experienceSubjectId: "object.factory",
        },
      },
      { knownRelationshipIds: ["rel:object.factory→object.delivery"] },
    ),
  });
  assert.equal(coordinated.executionMode, "coordinated");
  assert.equal(coordinated.state, "active");
  assert.equal(coordinated.health, "healthy");
  assert.equal(coordinated.compatibility, "compatible");
  assert.equal(coordinated.isReady, true);
  assert.equal(coordinated.isOperational, true);
  assert.equal(
    validateRuntimeExecutiveAdvisorExperiencePlatform(coordinated).ok,
    true,
  );
  assert.doesNotMatch(JSON.stringify(coordinated), /setStageFocus|focus\(/);

  const guidanceOnly = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [
        action({
          id: "a.open",
          kind: "open-scenario",
          state: "requires-confirmation",
          authority: "manager-confirmation",
          safety: "workflow",
          targetSubjectIds: ["scenario.a"],
        }),
      ],
      {
        trigger: "guidance-ready",
        signals: {
          hasGuidance: true,
          hasPrimaryGuidance: true,
          managerConfirmed: false,
          contextSubjectId: "scenario.a",
          experienceSubjectId: "scenario.a",
        },
      },
    ),
  });
  assert.ok(
    guidanceOnly.executionMode === "guidance" ||
      guidanceOnly.executionMode === "coordinated",
  );
  assert.equal(
    guidanceOnly.orchestration.plan.steps.some(
      (step) =>
        step.actionVisibility === "confirmation-required" ||
        step.coordinationExecutionIntent === "defer",
    ) ||
      guidanceOnly.orchestration.plan.isExecutable === false,
    true,
  );
});

test("4. degraded / blocked / compatibility / authority preservation", () => {
  const stale = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [action({ id: "a.inspect", kind: "inspect-subject" })],
      {
        trigger: "subject-change",
        signals: {
          hasGuidance: true,
          previouslyActive: true,
          contextSubjectId: "object.customer",
          experienceSubjectId: "object.delivery",
          interruption: "selection-changed",
        },
      },
    ),
  });
  assert.equal(stale.state, "degraded");
  assert.equal(stale.health, "degraded");
  assert.equal(stale.isReady, true);
  assert.equal(stale.isOperational, true);
  assert.equal(isRuntimeExecutiveAdvisorPlatformOperational(stale), true);

  const manager = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [action({ id: "a.inspect", kind: "inspect-subject" })],
      {
        trigger: "interaction",
        signals: {
          hasGuidance: true,
          previouslyActive: true,
          interruption: "manager-action",
          contextSubjectId: "object.customer",
          experienceSubjectId: "object.delivery",
        },
      },
    ),
  });
  assert.ok(
    manager.state === "degraded" ||
      manager.orchestration.plan.state === "suspended",
  );
  assert.equal(manager.orchestration.plan.interruption, "manager-action");

  const invalid = resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [action({ id: "a.inspect", kind: "inspect-subject" })],
      {
        trigger: "context-invalidated",
        signals: {
          hasGuidance: true,
          previouslyActive: true,
          contextSubjectId: null,
          experienceSubjectId: "object.factory",
        },
      },
    ),
  });
  assert.ok(invalid.state === "idle" || invalid.state === "blocked");
  assert.equal(invalid.isOperational, false);

  const forged = {
    ...coordinatedFixture(),
    orchestration: {
      ...coordinatedFixture().orchestration,
      plan: {
        ...coordinatedFixture().orchestration.plan,
        freshness: "stale" as const,
        state: "active" as const,
      },
    },
  };
  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformCompatibility(forged.orchestration),
    "incompatible",
  );
  const blockedCompat = resolveRuntimeExecutiveAdvisorPlatformState({
    orchestration: forged.orchestration,
    compatibility: "incompatible",
  });
  assert.equal(blockedCompat, "blocked");
  assert.equal(
    resolveRuntimeExecutiveAdvisorPlatformHealth({
      state: "blocked",
      compatibility: "incompatible",
      orchestration: forged.orchestration,
    }),
    "blocked",
  );

  const invalidResult = {
    ...emptyPlatformFixture(),
    state: "blocked" as const,
    health: "blocked" as const,
    compatibility: "incompatible" as const,
    isReady: true,
    isOperational: true,
  };
  assert.equal(
    validateRuntimeExecutiveAdvisorExperiencePlatform(invalidResult).ok,
    false,
  );
});

test("5. determinism, immutability, certification / freeze readiness", () => {
  const input = Object.freeze({
    orchestrationInput: orchestrationInput([
      action({ id: "a.inspect", kind: "inspect-subject" }),
    ]),
  });
  const a = resolveRuntimeExecutiveAdvisorExperiencePlatform(input);
  const b = resolveRuntimeExecutiveAdvisorExperiencePlatform(input);
  assert.deepEqual(a, b);
  assert.equal(
    input.orchestrationInput.coordinationPlan.steps.length > 0,
    true,
  );
  assert.equal(validateRuntimeExecutiveAdvisorExperiencePlatform(a).ok, true);

  assert.ok(guarantees.includes("manager-authority-preservation"));
  assert.ok(guarantees.includes("no-direct-stage-mutation"));
  assert.ok(guarantees.includes("no-ai-dependency"));
  assert.ok(guarantees.includes("confirmation-preservation"));
  assert.ok(consumerPolicies.includes("consume-platform-only"));
  assert.ok(
    consumerPolicies.includes("do-not-bypass-manager-confirmation"),
  );

  assert.equal(isRuntimeExecutiveAdvisorPlatformCertificationReady(), true);
  assert.equal(isRuntimeExecutiveAdvisorPlatformFreezeReady(), true);
});

test("6. no AI / no UI / no Stage mutation / REX-3:6 compatibility / verification", () => {
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.ownsStage, false);
  assert.equal(boundary.navigatesApplication, false);
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(boundary.inventsUpstreamBehavior, false);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']zustand["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN.includes("setStageFocus()"),
  );
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN.includes("dispatch()"),
  );

  assert.equal(
    verifyRuntimeExecutiveAdvisorExperienceOrchestration().ok,
    true,
  );
  const verification = verifyRuntimeExecutiveAdvisorExperiencePlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.noStageMutation, true);
  assert.equal(verification.noUi, true);
  assert.equal(verification.noAi, true);
  assert.equal(verification.noNewBehavior, true);
  assert.equal(verification.orchestrationOk, true);
  assert.equal(verification.platformStateCount, 5);
  assert.equal(verification.executionModeCount, 4);
  assert.equal(verification.guaranteeCount, 18);
  assert.equal(verification.capabilityCount, 18);
  assert.equal(verification.consumerPolicyCount, 8);
  assert.equal(verification.sectionCount, 11);
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:8 Certification & Freeze/,
  );
});

function emptyPlatformFixture() {
  return resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: Object.freeze({
      coordinationPlan: emptyCoordination,
      trigger: "runtime-context",
    }),
  });
}

function coordinatedFixture() {
  return resolveRuntimeExecutiveAdvisorExperiencePlatform({
    orchestrationInput: orchestrationInput(
      [
        action({
          id: "a.inspect",
          kind: "inspect-subject",
          targetSubjectIds: ["object.factory"],
        }),
      ],
      { trigger: "coordination-ready" },
    ),
  });
}
