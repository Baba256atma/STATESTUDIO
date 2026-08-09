import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_ADVISOR_GUIDANCE_ROLES as advisorRoles,
  EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS as changeKinds,
  EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS as deferredKinds,
  EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_TO_EX_DRI_5_DIRECTION_KINDS as deferredToExDri5,
  EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS as supportedKinds,
  EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES as targetSurfaces,
  EXECUTIVE_INSIGHT_ROLES as insightRoles,
  areExecutiveAdvisorInsightProjectionsEqual,
  areExecutiveAdvisorProjectionsEqual,
  areExecutiveInsightProjectionsEqual,
  bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight,
  bindDirectorRuntimeGuidanceToExecutiveAdvisor,
  bindDirectorRuntimeGuidanceToExecutiveInsight,
  bindDirectorRuntimeResponseToExecutiveAdvisorInsight,
  createExecutiveAdvisorCompositeProjection,
  createExecutiveAdvisorInsightProjection,
  createExecutiveAdvisorProjection,
  createExecutiveInsightCompositeProjection,
  createExecutiveInsightProjection,
  diffExecutiveAdvisorInsightProjection,
  diffExecutiveAdvisorProjection,
  diffExecutiveInsightProjection,
  executiveExperienceDirectorRuntimeAdvisorInsightBinding as binding,
  executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames as apiNames,
  executiveExperienceDirectorRuntimeAdvisorInsightBindingCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeAdvisorInsightBindingRegistry as registry,
  getAdvisorInsightCoordinationTargets,
  getAdvisorInsightDirectionSupport,
  getExecutiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
  isExecutiveAdvisorInsightBindingResult,
  isExecutiveAdvisorProjection,
  isExecutiveInsightProjection,
  verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding,
} from "./executiveExperienceDirectorRuntimeAdvisorInsightBinding.ts";

import {
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
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
    "./executiveExperienceDirectorRuntimeAdvisorInsightBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const factory = Object.freeze({
  id: "factory-1",
  kind: "object" as const,
  label: "Factory",
});
const throughputKpi = Object.freeze({
  id: "kpi-throughput",
  kind: "kpi" as const,
  label: "Throughput KPI",
});

test("1. exact EX-DRI-6 identity", () => {
  assert.equal(
    binding.identity,
    "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "EX-DRI-6");
  assert.equal(
    binding.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
  );
  assert.equal(binding.status, "AdvisorInsightBindingReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.6.0", () => {
  assert.equal(binding.version, "1.6.0");
  assert.equal(canonicalIdentity.version, "1.6.0");
  assert.equal(registry.version, "1.6.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.ex.dri.integration.advisor-insight-binding",
  );
});

test("4. architectural role", () => {
  assert.equal(
    binding.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
  );
});

test("5. sole immediate dependency is EX-DRI-5", () => {
  assert.equal(
    binding.upstreamDependency,
    "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
  );
  assert.equal(
    binding.upstreamDependency,
    executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|nol|ex-dri\/executiveExperienceDirectorRuntime(?:Integration|ContextState|Interaction))[^"']*["']/,
  );
});

test("6. Advisor guidance binds without generated prose or UI behavior", () => {
  const advisor = bindDirectorRuntimeGuidanceToExecutiveAdvisor(
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "warn",
      messageKey: "advisor.factory.capacity-risk",
    }),
  );
  assert.equal(isExecutiveAdvisorProjection(advisor), true);
  assert.equal(advisor.surface, "advisor");
  assert.equal(advisor.subject?.id, "factory-1");
  assert.equal(advisor.guidanceRole, "warn");
  assert.equal(advisor.messageKey, "advisor.factory.capacity-risk");
  assert.doesNotMatch(
    JSON.stringify(advisor),
    /bottleneck|Your factory|setAdvisor|openPanel|callLLM/,
  );
});

test("7. Insight guidance binds without metric calculation", () => {
  const insight = bindDirectorRuntimeGuidanceToExecutiveInsight(
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "insight",
      subject: throughputKpi,
      guidanceRole: "metric",
      messageKey: "insight.factory.throughput",
    }),
  );
  assert.equal(isExecutiveInsightProjection(insight), true);
  assert.equal(insight.surface, "insight");
  assert.equal(insight.subject?.id, "kpi-throughput");
  assert.equal(insight.insightRole, "metric");
  assert.equal(insight.insightKey, "insight.factory.throughput");
  assert.doesNotMatch(
    JSON.stringify(insight),
    /calculate|SQL|chart|opacity|Vector3/,
  );
});

test("8. coordination binds Advisor and Insight without panel opening", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    createExecutiveRuntimeDirectionContract({
      kind: "coordination",
      sourceSurface: "stage",
      targetSurfaces: ["advisor", "insight"],
      subject: factory,
    }),
  ]);
  assert.equal(result.status, "bound");
  assert.equal(result.projection?.advisor.coordination.length, 1);
  assert.equal(result.projection?.insight.coordination.length, 1);
  assert.equal(
    result.projection?.advisor.coordination[0]?.sourceSurface,
    "stage",
  );
  assert.equal(
    result.projection?.insight.coordination[0]?.subject?.id,
    "factory-1",
  );
  assert.doesNotMatch(JSON.stringify(result), /openPanel|setTab|scrollIntoView/);
});

test("9. mixed coordination targets bind owned and defer others", () => {
  const direction = createExecutiveRuntimeDirectionContract({
    kind: "coordination",
    sourceSurface: "stage",
    targetSurfaces: ["advisor", "insight", "timeline"],
    subject: factory,
  });
  const targets = getAdvisorInsightCoordinationTargets(direction);
  assert.deepEqual([...targets.ownedTargets], ["advisor", "insight"]);
  assert.deepEqual([...targets.deferredTargets], ["timeline"]);

  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    direction,
  ]);
  assert.equal(result.status, "partial");
  assert.equal(result.projection?.advisor.coordination.length, 1);
  assert.equal(result.projection?.insight.coordination.length, 1);
  assert.equal(result.deferredDirections.length, 1);
  assert.equal(result.deferredDirections[0]?.kind, "coordination");
  if (result.deferredDirections[0]?.kind === "coordination") {
    assert.deepEqual(
      [...result.deferredDirections[0].targetSurfaces],
      ["timeline"],
    );
  }
});

test("10. Advisor and Insight may use distinct subjects", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
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
  ]);
  assert.equal(result.status, "bound");
  assert.equal(result.projection?.advisor.guidance[0]?.subject?.id, "factory-1");
  assert.equal(
    result.projection?.insight.insights[0]?.subject?.id,
    "kpi-throughput",
  );
});

test("11. subject identity conflict is detected", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
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
        label: "Factory KPI",
      }),
      guidanceRole: "metric",
      messageKey: "insight.factory.throughput",
    }),
  ]);
  assert.equal(result.status, "rejected");
  assert.ok(
    result.issues.some((entry) => entry.code === "SUBJECT_IDENTITY_CONFLICT"),
  );
});

test("12. duplicate guidance is detected; distinct same-subject guidance remains legal", () => {
  const duplicate = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "warn",
      messageKey: "advisor.factory.capacity-risk",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "warn",
      messageKey: "advisor.factory.capacity-risk",
    }),
  ]);
  assert.equal(duplicate.status, "rejected");
  assert.ok(
    duplicate.issues.some(
      (entry) => entry.code === "DUPLICATE_GUIDANCE_DIRECTION",
    ),
  );

  const distinct = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "warn",
      messageKey: "advisor.factory.capacity-risk",
    }),
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "clarify",
      messageKey: "advisor.scenario.compare",
    }),
  ]);
  assert.equal(distinct.status, "bound");
  assert.equal(distinct.projection?.advisor.guidance.length, 2);
});

test("13. runtime response statuses are preserved", () => {
  const resolved = bindDirectorRuntimeResponseToExecutiveAdvisorInsight(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C1" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "recommend",
          messageKey: "advisor.decision.review",
        }),
      ],
    }),
  );
  assert.equal(resolved.status, "bound");

  const partial = bindDirectorRuntimeResponseToExecutiveAdvisorInsight(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C2" },
      status: "partial",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "guidance",
          surface: "insight",
          subject: throughputKpi,
          guidanceRole: "evidence",
          messageKey: "insight.scenario.impact",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "scene",
          surface: "stage",
          relatedSubjects: [],
        }),
      ],
    }),
  );
  assert.equal(partial.status, "partial");
  assert.equal(partial.deferredDirections.length, 1);

  const rejected = bindDirectorRuntimeResponseToExecutiveAdvisorInsight(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C3" },
      status: "rejected",
      directions: [],
    }),
  );
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.projection, undefined);

  const noop = bindDirectorRuntimeResponseToExecutiveAdvisorInsight(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C4" },
      status: "noop",
      directions: [],
    }),
  );
  assert.equal(noop.status, "noop");
  assert.equal(noop.projection, undefined);
});

test("14. deferred EX-DRI-5 and interaction directions are explicit", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      relatedSubjects: [],
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
      kind: "interaction",
      surface: "stage",
      interaction: "select",
    }),
  ]);
  assert.equal(result.status, "partial");
  assert.equal(result.deferredDirections.length, 5);
  assert.deepEqual(
    result.deferredDirections.map((direction) => direction.kind),
    ["scene", "focus", "attention", "presentation", "interaction"],
  );
  assert.deepEqual([...deferredKinds], [
    "scene",
    "focus",
    "attention",
    "presentation",
    "interaction",
  ]);
  assert.deepEqual([...deferredToExDri5], [
    "scene",
    "focus",
    "attention",
    "presentation",
  ]);
  assert.equal(getAdvisorInsightDirectionSupport("scene"), "deferred");
  assert.equal(getAdvisorInsightDirectionSupport("guidance"), "supported");
});

test("15. no generated executive prose in projections", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "warn",
      messageKey: "advisor.factory.capacity-risk",
    }),
  ]);
  const serialized = JSON.stringify(result.projection);
  assert.match(serialized, /advisor\.factory\.capacity-risk/);
  assert.doesNotMatch(
    serialized,
    /critical bottleneck|next quarter|I recommend|You should/,
  );
});

test("16. AI / LLM SDK independence", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:openai|anthropic|@anthropic-ai\/sdk|@google\/generative-ai|@google\/genai|langchain|ollama|tiktoken)["']/,
  );
  assert.doesNotMatch(source, /\b(?:callLLM|createCompletion|generateText|embedDocuments)\b/);
  assert.equal(binding.aiIndependent, true);
  assert.equal(binding.contentGenerationPolicy, "no-content-generation");
});

test("17. semantic diffs detect Advisor/Insight changes", () => {
  const previous = createExecutiveAdvisorInsightProjection({
    advisor: createExecutiveAdvisorCompositeProjection({
      guidance: [
        createExecutiveAdvisorProjection({
          subject: factory,
          guidanceRole: "warn",
          messageKey: "advisor.factory.capacity-risk",
        }),
      ],
    }),
    insight: createExecutiveInsightCompositeProjection({
      insights: [
        createExecutiveInsightProjection({
          subject: throughputKpi,
          insightRole: "metric",
          insightKey: "insight.factory.throughput",
        }),
      ],
    }),
  });
  const next = createExecutiveAdvisorInsightProjection({
    advisor: createExecutiveAdvisorCompositeProjection({
      guidance: [
        createExecutiveAdvisorProjection({
          subject: factory,
          guidanceRole: "clarify",
          messageKey: "advisor.factory.capacity-risk",
        }),
      ],
      coordination: [
        {
          surface: "advisor",
          sourceSurface: "stage",
          subject: factory,
        },
      ],
    }),
    insight: createExecutiveInsightCompositeProjection({
      insights: [
        createExecutiveInsightProjection({
          subject: throughputKpi,
          insightRole: "impact",
          insightKey: "insight.scenario.impact",
        }),
      ],
      coordination: [
        {
          surface: "insight",
          sourceSurface: "stage",
          subject: factory,
        },
      ],
    }),
  });

  const advisorDiff = diffExecutiveAdvisorProjection(
    previous.advisor,
    next.advisor,
  );
  const insightDiff = diffExecutiveInsightProjection(
    previous.insight,
    next.insight,
  );
  const composite = diffExecutiveAdvisorInsightProjection(previous, next);

  assert.equal(advisorDiff.changed, true);
  assert.ok(advisorDiff.changes.includes("advisor-guidance"));
  assert.ok(advisorDiff.changes.includes("advisor-coordination"));
  assert.equal(insightDiff.changed, true);
  assert.ok(insightDiff.changes.includes("insight-content"));
  assert.ok(insightDiff.changes.includes("insight-coordination"));
  assert.deepEqual([...composite.changes], [...changeKinds]);
  assert.doesNotMatch(
    JSON.stringify(composite),
    /fade|camera|opacity|animation|chart/,
  );
});

test("18. semantic equality ignores reference identity", () => {
  const left = createExecutiveAdvisorProjection({
    subject: factory,
    guidanceRole: "warn",
    messageKey: "advisor.factory.capacity-risk",
  });
  const right = createExecutiveAdvisorProjection({
    subject: { ...factory },
    guidanceRole: "warn",
    messageKey: "advisor.factory.capacity-risk",
  });
  assert.notEqual(left, right);
  assert.equal(areExecutiveAdvisorProjectionsEqual(left, right), true);

  const insightLeft = createExecutiveInsightProjection({
    subject: throughputKpi,
    insightRole: "metric",
    insightKey: "insight.factory.throughput",
  });
  const insightRight = createExecutiveInsightProjection({
    subject: { ...throughputKpi },
    insightRole: "metric",
    insightKey: "insight.factory.throughput",
  });
  assert.equal(
    areExecutiveInsightProjectionsEqual(insightLeft, insightRight),
    true,
  );

  const compositeLeft = createExecutiveAdvisorInsightProjection({
    advisor: createExecutiveAdvisorCompositeProjection({ guidance: [left] }),
    insight: createExecutiveInsightCompositeProjection({
      insights: [insightLeft],
    }),
  });
  const compositeRight = createExecutiveAdvisorInsightProjection({
    advisor: createExecutiveAdvisorCompositeProjection({ guidance: [right] }),
    insight: createExecutiveInsightCompositeProjection({
      insights: [insightRight],
    }),
  });
  assert.equal(
    areExecutiveAdvisorInsightProjectionsEqual(compositeLeft, compositeRight),
    true,
  );
});

test("19. immutability of inputs and projections", () => {
  const directions = Object.freeze([
    createExecutiveRuntimeDirectionContract({
      kind: "guidance",
      surface: "advisor",
      subject: factory,
      guidanceRole: "orient",
      messageKey: "advisor.scenario.compare",
    }),
  ]);
  const before = JSON.stringify(directions);
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(
    directions,
  );
  assert.equal(JSON.stringify(directions), before);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.projection), true);
  assert.equal(Object.isFrozen(result.projection?.advisor), true);
  assert.equal(Object.isFrozen(result.projection?.insight), true);
  assert.equal(Object.isFrozen(result.issues), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(issueCodes), true);
});

test("20. deterministic repeated binding", () => {
  const directions = [
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
  ];
  const first =
    bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(directions);
  const second =
    bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(directions);
  assert.equal(first.status, "bound");
  assert.equal(
    areExecutiveAdvisorInsightProjectionsEqual(
      first.projection!,
      second.projection!,
    ),
    true,
  );
  assert.equal(isExecutiveAdvisorInsightBindingResult(first), true);
});

test("21. catalogs and verification", () => {
  assert.deepEqual([...supportedKinds], ["guidance", "coordination"]);
  assert.deepEqual([...targetSurfaces], ["advisor", "insight"]);
  assert.equal(advisorRoles.length, 6);
  assert.equal(insightRoles.length, 6);
  assert.equal(changeKinds.length, 4);
  assert.equal(issueCodes.length, 14);
  assert.equal(guarantees.length, 30);
  assert.equal(registrySections.length, 12);
  assert.ok(publicTypeNames.length > 0);
  assert.ok(apiNames.includes("bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight"));
  const verification =
    verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding();
  assert.equal(verification.ok, true);
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding().ok,
    true,
  );
  assert.match(
    binding.architecturalStatus,
    /ReadyForExDriIntegrationPlatform/,
  );
});

test("22. canonical Nexora Factory Advisor/Insight cycle is representable", () => {
  const result = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight([
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
    createExecutiveRuntimeDirectionContract({
      kind: "scene",
      surface: "stage",
      primarySubject: factory,
      relatedSubjects: [],
    }),
  ]);
  assert.equal(result.status, "partial");
  assert.equal(result.projection?.advisor.guidance[0]?.guidanceRole, "warn");
  assert.equal(
    result.projection?.advisor.guidance[0]?.messageKey,
    "advisor.factory.capacity-risk",
  );
  assert.equal(result.projection?.insight.insights[0]?.insightRole, "metric");
  assert.equal(
    result.projection?.insight.insights[0]?.insightKey,
    "insight.factory.throughput",
  );
  assert.equal(result.projection?.advisor.coordination[0]?.sourceSurface, "stage");
  assert.equal(result.deferredDirections.map((d) => d.kind).includes("scene"), true);
  assert.doesNotMatch(
    JSON.stringify(result.projection),
    /Factory capacity is becoming a critical bottleneck/,
  );
});

test("23. framework / renderer / AI isolation", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next\/|three|@react-three|zustand|redux|framer-motion)/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ReactNode|JSX\.Element|HTMLElement|window|document|Vector3|Object3D|Mesh|Camera)\b/,
  );
  assert.equal(binding.reactIndependent, true);
  assert.equal(binding.rendererIndependent, true);
  assert.equal(binding.threeJsIndependent, true);
});

test("24. EX-DRI-1..5 regressions remain green", () => {
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
});

test("25. DRI consumer integration public index remains intact", () => {
  assert.equal(verifyDirectorRuntimeConsumerIntegrationPublicIndex().ok, true);
});

test("26. metadata policies are deterministic / stateless / AI-independent", () => {
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.statelessStatus, true);
  assert.equal(canonicalIdentity.rendererIndependenceStatus, true);
  assert.equal(canonicalIdentity.contentGenerationPolicy, "no-content-generation");
  assert.equal(canonicalIdentity.mutationPolicy, "immutable");
  assert.equal(canonicalIdentity.sideEffectPolicy, "side-effect-free");
});
