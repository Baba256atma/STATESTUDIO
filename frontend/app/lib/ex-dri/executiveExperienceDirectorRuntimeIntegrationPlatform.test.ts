import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS as changeKinds,
  EXECUTIVE_INTEGRATION_PLATFORM_COMPATIBILITY as compatibility,
  EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS as directionOwners,
  EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES as guarantees,
  EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES as issueCodes,
  EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES as issueSources,
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_INTEGRATION_PLATFORM_SURFACES as surfaces,
  areExecutiveDirectorRuntimeUnifiedProjectionsEqual,
  createExecutiveDirectorRuntimeIntegrationCycle,
  diffExecutiveDirectorRuntimeUnifiedProjection,
  executiveExperienceDirectorRuntimeIntegrationPlatform as platform,
  executiveExperienceDirectorRuntimeIntegrationPlatformApiNames as apiNames,
  executiveExperienceDirectorRuntimeIntegrationPlatformCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeIntegrationPlatformRegistry as registry,
  getExecutiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
  getExecutiveIntegrationPlatformDirectionOwner,
  isExecutiveDirectorRuntimePlatformResponseResult,
  prepareExecutiveDirectorRuntimeRequest,
  processDirectorRuntimeResponseForExecutiveExperience,
  validateExecutiveDirectorRuntimeCycleCorrelation,
  verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform,
} from "./executiveExperienceDirectorRuntimeIntegrationPlatform.ts";

import {
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
  verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding";

import {
  verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding";

import {
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
  verifyDirectorRuntimeConsumerIntegrationPublicIndex,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex";

const source = readFileSync(
  new URL(
    "./executiveExperienceDirectorRuntimeIntegrationPlatform.ts",
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
const throughputKpi = Object.freeze({
  id: "kpi-throughput",
  kind: "kpi" as const,
  label: "Throughput KPI",
});

function baseState() {
  return Object.freeze({
    activeSurface: "stage" as const,
    mode: "scenario" as const,
    activeGoalId: "Goal-1",
    activePackId: "Scenario-A",
    surfaces: Object.freeze([
      Object.freeze({
        surface: "stage" as const,
        selectedSubject: factory,
        presentationState: "report" as const,
      }),
    ]),
  });
}

test("1. exact EX-DRI-7 identity", () => {
  assert.equal(
    platform.identity,
    "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  );
  assert.equal(canonicalIdentity.identity, platform.identity);
  assert.equal(platform.phase, "EX-DRI-7");
  assert.equal(platform.status, "IntegrationPlatformReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeIntegrationPlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.7.0", () => {
  assert.equal(platform.version, "1.7.0");
  assert.equal(canonicalIdentity.version, "1.7.0");
  assert.equal(registry.version, "1.7.0");
});

test("3. exact namespace", () => {
  assert.equal(platform.namespace, "nexora.ex.dri.integration.platform");
});

test("4. architectural role", () => {
  assert.equal(
    platform.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  );
});

test("5. sole immediate dependency is EX-DRI-6", () => {
  assert.equal(
    platform.upstreamDependency,
    "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
  );
  assert.equal(
    platform.upstreamDependency,
    executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
  );
  assert.equal(
    platform.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|nol|ex-dri\/executiveExperienceDirectorRuntime(?:Integration(?:Foundation|Contracts)|ContextState|Interaction|ScenePresentation))[^"']*["']/,
  );
});

test("6. request preparation binds context and interaction without executing DRI", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: baseState(),
    correlation: { correlationId: "C100", sequence: 1 },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  assert.equal(prepared.status, "prepared");
  assert.equal(prepared.contextBinding?.valid, true);
  assert.equal(prepared.contextBinding?.activeContext?.surface, "stage");
  assert.equal(
    prepared.contextBinding?.activeContext?.selectedSubject?.id,
    "factory-1",
  );
  assert.equal(prepared.request?.direction, "ex-to-dri");
  assert.equal(prepared.request?.kind, "context-interaction");
  assert.equal(prepared.request?.correlation.correlationId, "C100");
  assert.equal(prepared.request?.interaction?.kind, "select");
  assert.doesNotMatch(JSON.stringify(prepared), /executeDirector|callDRI|setState/);
});

test("7. context-only preparation produces canonical context request", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: baseState(),
    correlation: { correlationId: "C-CONTEXT" },
  });
  assert.equal(prepared.status, "prepared");
  assert.equal(prepared.request?.kind, "context");
  assert.equal(prepared.request?.interaction, undefined);
  assert.equal(prepared.request?.context.surface, "stage");
});

test("8. rejected preparation for invalid surface", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: {
      activeSurface: "main-panel",
      surfaces: [{ surface: "main-panel" }],
    },
    correlation: { correlationId: "C-BAD" },
  });
  assert.equal(prepared.status, "rejected");
  assert.equal(prepared.request, undefined);
  assert.ok(
    prepared.issues.some(
      (entry) =>
        entry.code === "INVALID_PLATFORM_INPUT" ||
        entry.code === "CONTEXT_BINDING_FAILED",
    ),
  );
  assert.ok(prepared.issues.every((entry) => entry.source.length > 0));
});

test("9. resolved response produces unified visual + advisor/insight projection", () => {
  const response = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: { correlationId: "C100" },
    status: "resolved",
    directions: [
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
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "presentation",
        surface: "stage",
        subject: factory,
        state: "report",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "guidance",
        surface: "advisor",
        subject: factory,
        guidanceRole: "warn",
        messageKey: "advisor.factory.capacity-risk",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "guidance",
        surface: "insight",
        subject: throughputKpi,
        guidanceRole: "metric",
        messageKey: "insight.factory.throughput",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "coordination",
        sourceSurface: "stage",
        targetSurfaces: ["advisor", "insight"],
        subject: factory,
      }),
    ],
  });

  const result = processDirectorRuntimeResponseForExecutiveExperience(response);
  assert.equal(result.status, "resolved");
  assert.ok(result.projection);
  assert.equal(
    result.projection?.visual.scene?.primarySubject?.id,
    "factory-1",
  );
  assert.equal(result.projection?.visual.focus[0]?.subject?.id, "kpi-throughput");
  assert.equal(result.projection?.visual.attention[0]?.level, "primary");
  assert.equal(result.projection?.visual.presentation[0]?.state, "report");
  assert.equal(
    result.projection?.advisorInsight.advisor.guidance[0]?.messageKey,
    "advisor.factory.capacity-risk",
  );
  assert.equal(
    result.projection?.advisorInsight.insight.insights[0]?.insightKey,
    "insight.factory.throughput",
  );
  assert.equal(
    result.projection?.advisorInsight.advisor.coordination[0]?.sourceSurface,
    "stage",
  );
  assert.equal(isExecutiveDirectorRuntimePlatformResponseResult(result), true);
});

test("10. partial response preserves partial status", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-PARTIAL" },
      status: "partial",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "minimum",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "interaction",
          surface: "stage",
          interaction: "select",
        }),
      ],
    }),
  );
  assert.equal(result.status, "partial");
  assert.ok(result.projection);
  assert.equal(result.projection?.visual.presentation[0]?.state, "minimum");
});

test("11. noop response fabricates no projection", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-NOOP" },
      status: "noop",
      directions: [],
    }),
  );
  assert.equal(result.status, "noop");
  assert.equal(result.projection, undefined);
});

test("12. rejected response fabricates no semantic changes", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-REJECT" },
      status: "rejected",
      directions: [],
    }),
  );
  assert.equal(result.status, "rejected");
  assert.equal(result.projection, undefined);
});

test("13. direction routing ownership map", () => {
  assert.equal(directionOwners.scene, "EX-DRI-5");
  assert.equal(directionOwners.focus, "EX-DRI-5");
  assert.equal(directionOwners.attention, "EX-DRI-5");
  assert.equal(directionOwners.presentation, "EX-DRI-5");
  assert.equal(directionOwners.guidance, "EX-DRI-6");
  assert.equal(directionOwners.coordination, "EX-DRI-6");
  assert.equal(directionOwners.interaction, "deferred");
  assert.equal(getExecutiveIntegrationPlatformDirectionOwner("scene"), "EX-DRI-5");
  assert.equal(
    getExecutiveIntegrationPlatformDirectionOwner("guidance"),
    "EX-DRI-6",
  );
  assert.equal(
    getExecutiveIntegrationPlatformDirectionOwner("interaction"),
    "deferred",
  );
});

test("14. correlation validation detects mismatch without repair", () => {
  const valid = validateExecutiveDirectorRuntimeCycleCorrelation({
    request: { correlationId: "C100" },
    response: { correlationId: "C100" },
  });
  assert.equal(valid.length, 0);

  const mismatch = validateExecutiveDirectorRuntimeCycleCorrelation({
    request: { correlationId: "C100" },
    response: { correlationId: "C200" },
  });
  assert.equal(mismatch.length, 1);
  assert.equal(mismatch[0]?.code, "CORRELATION_MISMATCH");

  const processed = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C200" },
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
    { requestCorrelation: { correlationId: "C100" } },
  );
  assert.equal(processed.status, "rejected");
  assert.ok(
    processed.issues.some((entry) => entry.code === "CORRELATION_MISMATCH"),
  );
});

test("15. selection/focus separation remains representable end-to-end", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: baseState(),
    correlation: { correlationId: "C-SF" },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  assert.equal(
    prepared.contextBinding?.activeContext?.selectedSubject?.id,
    "factory-1",
  );

  const processed = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-SF" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "focus",
          surface: "stage",
          subject: throughputKpi,
          role: "focused",
        }),
      ],
    }),
    { requestCorrelation: prepared.request!.correlation },
  );
  assert.equal(processed.status, "resolved");
  assert.equal(
    prepared.contextBinding?.activeContext?.selectedSubject?.id,
    "factory-1",
  );
  assert.equal(
    processed.projection?.visual.focus[0]?.subject?.id,
    "kpi-throughput",
  );
});

test("16. subject identity conflicts propagate into platform result", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-CONFLICT" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "warn",
          messageKey: "advisor.factory.capacity-risk",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "insight",
          subject: Object.freeze({
            id: "factory-1",
            kind: "kpi" as const,
            label: "Factory as KPI",
          }),
          guidanceRole: "metric",
          messageKey: "insight.factory.throughput",
        }),
      ],
    }),
  );
  assert.equal(result.status, "rejected");
  assert.ok(
    result.issues.some(
      (entry) =>
        entry.code === "ADVISOR_INSIGHT_BINDING_FAILED" &&
        entry.upstreamCode === "SUBJECT_IDENTITY_CONFLICT",
    ),
  );
});

test("17. presentation states remain minimum/report/operation", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  for (const state of presentationStates) {
    const result = processDirectorRuntimeResponseForExecutiveExperience(
      createExecutiveDirectorRuntimeResponse({
        direction: "dri-to-ex",
        correlation: { correlationId: `C-${state}` },
        status: "resolved",
        directions: [
          createExecutiveRuntimeDirectionContract({
            kind: "presentation",
            surface: "stage",
            subject: factory,
            state,
          }),
        ],
      }),
    );
    assert.equal(result.status, "resolved");
    assert.equal(result.projection?.visual.presentation[0]?.state, state);
  }
});

test("18. unified projection diffs compose visual/advisor/insight/coordination", () => {
  const previous = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-DIFF" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "minimum",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "warn",
          messageKey: "advisor.factory.capacity-risk",
        }),
      ],
    }),
  ).projection!;

  const next = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-DIFF" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "focus",
          surface: "stage",
          subject: throughputKpi,
          role: "focused",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "report",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "clarify",
          messageKey: "advisor.scenario.compare",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "insight",
          subject: throughputKpi,
          guidanceRole: "metric",
          messageKey: "insight.factory.throughput",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "coordination",
          sourceSurface: "stage",
          targetSurfaces: ["advisor", "insight"],
          subject: factory,
        }),
      ],
    }),
  ).projection!;

  const diff = diffExecutiveDirectorRuntimeUnifiedProjection(previous, next);
  assert.equal(diff.changed, true);
  assert.ok(diff.changes.includes("visual"));
  assert.ok(diff.changes.includes("advisor"));
  assert.ok(diff.changes.includes("insight"));
  assert.ok(diff.changes.includes("coordination"));
  assert.deepEqual([...changeKinds], ["visual", "advisor", "insight", "coordination"]);
  assert.doesNotMatch(JSON.stringify(diff), /animate|camera|fade|chart/);
});

test("19. semantic equality ignores reference identity", () => {
  const make = () =>
    processDirectorRuntimeResponseForExecutiveExperience(
      createExecutiveDirectorRuntimeResponse({
        direction: "dri-to-ex",
        correlation: { correlationId: "C-EQ" },
        status: "resolved",
        directions: [
          createExecutiveRuntimeDirectionContract({
            kind: "presentation",
            surface: "stage",
            subject: factory,
            state: "report",
          }),
          createExecutiveRuntimeDirectionContract({
            kind: "guidance",
            surface: "advisor",
            subject: factory,
            guidanceRole: "recommend",
            messageKey: "advisor.decision.review",
          }),
        ],
      }),
    ).projection!;

  const left = make();
  const right = make();
  assert.notEqual(left, right);
  assert.equal(
    areExecutiveDirectorRuntimeUnifiedProjectionsEqual(left, right),
    true,
  );
});

test("20. issue propagation preserves source and upstreamCode", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: {
      activeSurface: "stage",
      mode: "not-a-mode",
      surfaces: [{ surface: "stage" }],
    },
    correlation: { correlationId: "C-ISSUE" },
  });
  assert.equal(prepared.status, "rejected");
  assert.ok(prepared.issues.length > 0);
  assert.ok(
    prepared.issues.every((entry) =>
      (issueSources as readonly string[]).includes(entry.source),
    ),
  );

  const conflict = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-ISSUE-2" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "warn",
          messageKey: "advisor.factory.capacity-risk",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "insight",
          subject: Object.freeze({
            id: "factory-1",
            kind: "kpi" as const,
          }),
          guidanceRole: "metric",
          messageKey: "insight.factory.throughput",
        }),
      ],
    }),
  );
  assert.ok(
    conflict.issues.some(
      (entry) =>
        entry.source === "advisor-insight-binding" &&
        entry.upstreamCode === "SUBJECT_IDENTITY_CONFLICT",
    ),
  );
});

test("21. immutability of platform artifacts", () => {
  const input = Object.freeze({
    state: baseState(),
    correlation: Object.freeze({ correlationId: "C-IMM" }),
    interaction: Object.freeze({
      interactionId: "ix.select.factory",
      kind: "select" as const,
      surface: "stage" as const,
      subject: factory,
    }),
  });
  const before = JSON.stringify(input);
  const prepared = prepareExecutiveDirectorRuntimeRequest(input);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(prepared), true);
  assert.equal(Object.isFrozen(prepared.issues), true);

  const response = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: { correlationId: "C-IMM" },
    status: "resolved",
    directions: [
      createExecutiveRuntimeDirectionContract({
        kind: "presentation",
        surface: "stage",
        subject: factory,
        state: "operation",
      }),
    ],
  });
  const responseBefore = JSON.stringify(response);
  const processed = processDirectorRuntimeResponseForExecutiveExperience(
    response,
  );
  assert.equal(JSON.stringify(response), responseBefore);
  assert.equal(Object.isFrozen(processed), true);
  assert.equal(Object.isFrozen(processed.projection), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
});

test("22. deterministic repeated platform calls", () => {
  const input = {
    state: baseState(),
    correlation: { correlationId: "C-DET" },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select" as const,
      surface: "stage" as const,
      subject: factory,
    },
  };
  const first = prepareExecutiveDirectorRuntimeRequest(input);
  const second = prepareExecutiveDirectorRuntimeRequest(input);
  assert.equal(first.status, second.status);
  assert.equal(
    JSON.stringify(first.request),
    JSON.stringify(second.request),
  );
});

test("23. framework / renderer / AI independence", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next\/|three|@react-three|zustand|redux|framer-motion|openai|anthropic)/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|ReactNode|JSX\.Element|HTMLElement|Vector3|Object3D)\b/,
  );
  assert.equal(platform.reactIndependent, true);
  assert.equal(platform.rendererIndependent, true);
  assert.equal(platform.aiIndependent, true);
});

test("24. catalogs and verification", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  assert.equal(issueSources.length, 5);
  assert.equal(issueCodes.length, 10);
  assert.equal(guarantees.length, 36);
  assert.equal(registrySections.length, 12);
  assert.equal(compatibility.length, 5);
  assert.ok(apiNames.includes("prepareExecutiveDirectorRuntimeRequest"));
  assert.ok(
    apiNames.includes("processDirectorRuntimeResponseForExecutiveExperience"),
  );
  const verification =
    verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform();
  assert.equal(verification.ok, true);
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform().ok,
    true,
  );
  assert.match(
    platform.architecturalStatus,
    /ReadyForExDriIntegrationPlatformFreeze/,
  );
});

test("25. canonical end-to-end semantic cycle is representable", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: {
      activeSurface: "stage",
      mode: "scenario",
      activeGoalId: "Improve-Capacity",
      activePackId: "Scenario-A",
      surfaces: [
        {
          surface: "stage",
          selectedSubject: factory,
          presentationState: "report",
        },
      ],
    },
    correlation: { correlationId: "C-CYCLE", sequence: 1 },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  assert.equal(prepared.status, "prepared");

  const response = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: { correlationId: "C-CYCLE" },
    status: "resolved",
    directions: [
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
        kind: "guidance",
        surface: "advisor",
        subject: factory,
        guidanceRole: "warn",
        messageKey: "advisor.factory.capacity-risk",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "guidance",
        surface: "insight",
        subject: throughputKpi,
        guidanceRole: "metric",
        messageKey: "insight.factory.throughput",
      }),
      createExecutiveRuntimeDirectionContract({
        kind: "coordination",
        sourceSurface: "stage",
        targetSurfaces: ["advisor", "insight"],
        subject: factory,
      }),
    ],
  });

  const processed = processDirectorRuntimeResponseForExecutiveExperience(
    response,
    { requestCorrelation: prepared.request!.correlation },
  );
  assert.equal(processed.status, "resolved");

  const cycle = createExecutiveDirectorRuntimeIntegrationCycle({
    preparedRequest: prepared,
    runtimeResponse: response,
    processedResponse: processed,
  });
  assert.equal(cycle.preparedRequest.request?.kind, "context-interaction");
  assert.equal(
    cycle.processedResponse?.projection?.visual.scene?.primarySubject?.id,
    "factory-1",
  );
  assert.equal(
    cycle.processedResponse?.projection?.visual.focus[0]?.subject?.id,
    "kpi-throughput",
  );
  assert.equal(
    cycle.processedResponse?.projection?.advisorInsight.advisor.guidance[0]
      ?.guidanceRole,
    "warn",
  );
  assert.doesNotMatch(
    JSON.stringify(cycle),
    /setReactState|scene\.position|camera\.lookAt|openAdvisorPanel|callLLM|Factory capacity is becoming/,
  );
});

test("26. EX-DRI-1..6 regressions remain green", () => {
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
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding().ok,
    true,
  );
});

test("27. DRI consumer integration public index remains intact", () => {
  assert.equal(verifyDirectorRuntimeConsumerIntegrationPublicIndex().ok, true);
});

test("28. metadata policies are deterministic / stateless / framework-independent", () => {
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.statelessStatus, true);
  assert.equal(canonicalIdentity.rendererIndependence, true);
  assert.equal(canonicalIdentity.frameworkIndependence, true);
  assert.equal(
    canonicalIdentity.orchestrationPolicy,
    "compose-request-preparation-and-response-processing",
  );
  assert.equal(canonicalIdentity.mutationPolicy, "immutable");
  assert.equal(canonicalIdentity.sideEffectPolicy, "side-effect-free");
});
