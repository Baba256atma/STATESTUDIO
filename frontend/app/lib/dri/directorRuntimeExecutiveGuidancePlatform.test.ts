import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY as capability,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER as executionOrder,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_IDS as ruleIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER as ruleOrder,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES as stages,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES as stageStatuses,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES as statuses,
  createDirectorExecutiveGuidancePlatformInput,
  createDirectorRuntimeExecutiveGuidanceResolutionContext,
  directorRuntimeExecutiveGuidancePlatform as platform,
  directorRuntimeExecutiveGuidancePlatformApiNames as apiNames,
  directorRuntimeExecutiveGuidancePlatformCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidancePlatformRegistry as registry,
  resolveDirectorExecutiveGuidancePlatformStatus,
  runDirectorExecutiveGuidancePlatform,
  verifyDirectorRuntimeExecutiveGuidancePlatform,
  type DirectorRuntimeExecutiveGuidancePlatformInput,
  type DirectorRuntimeExecutiveGuidanceResolutionInput,
  type DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy,
} from "./directorRuntimeExecutiveGuidancePlatform.ts";

import {
  createDirectorRuntimeExecutiveGuidanceCandidate,
  createDirectorRuntimeExecutiveGuidanceEnvelope,
  type DirectorRuntimeExecutiveGuidanceCandidate,
  type DirectorRuntimeExecutiveGuidanceEnvelope,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { directorRuntimeExecutiveGuidanceDeliveryIdentity } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery";
import { verifyDirectorRuntimeExecutiveGuidanceDelivery } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery";
import { verifyDirectorRuntimeExecutiveGuidanceComposition } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition";
import { verifyDirectorRuntimeExecutiveGuidanceResolution } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";
import { verifyDirectorRuntimeExecutiveGuidanceContracts } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidancePlatform.ts", import.meta.url),
  "utf8",
);

function makeGuidance(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceCandidate["guidance"]> & {
    guidanceId: string;
  },
): DirectorRuntimeExecutiveGuidanceCandidate["guidance"] {
  return {
    guidanceId: overrides.guidanceId,
    guidanceKind: overrides.guidanceKind ?? "direct-attention",
    target: overrides.target ?? {
      targetKind: "object",
      targetId: "production",
    },
    importance: overrides.importance ?? "critical",
    urgency: overrides.urgency ?? "immediate",
    intent: overrides.intent ?? "warn",
    source: overrides.source ?? {
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    },
    rationale: overrides.rationale,
  };
}

function makeCandidate(
  candidateId: string,
  guidanceOverrides: Partial<DirectorRuntimeExecutiveGuidanceCandidate["guidance"]> & {
    guidanceId: string;
  },
  extras: Partial<DirectorRuntimeExecutiveGuidanceCandidate> = {},
): DirectorRuntimeExecutiveGuidanceCandidate {
  return createDirectorRuntimeExecutiveGuidanceCandidate({
    candidateId,
    guidance: makeGuidance(guidanceOverrides),
    eligibility: extras.eligibility ?? "eligible",
    provenance: extras.provenance ?? {
      sourceReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      derivedFromGuidanceIds: [],
    },
    constraints: extras.constraints ?? {},
  });
}

function makeEnvelope(
  candidates: readonly DirectorRuntimeExecutiveGuidanceCandidate[],
): DirectorRuntimeExecutiveGuidanceEnvelope {
  return createDirectorRuntimeExecutiveGuidanceEnvelope({
    envelopeId: "envelope.production-risk",
    request: {
      requestId: "request.production-risk",
      subjects: [{ targetKind: "object", targetId: "production" }],
      attentionReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      constraints: {
        preserveCurrentFocus: false,
        preserveExecutiveContext: false,
        allowInterruption: true,
        allowComparison: true,
        allowPathExplanation: true,
        maximumGuidanceItems: 10,
      },
    },
    candidates: [...candidates],
    relationships: [],
    paths: [],
    deliveryPolicy: {
      interruption: "non-interruptive",
      persistence: "transient",
      preserveFocus: false,
      preserveContext: false,
    },
  });
}

function makeResolutionInput(
  candidates: readonly DirectorRuntimeExecutiveGuidanceCandidate[],
): DirectorRuntimeExecutiveGuidanceResolutionInput {
  const envelope = makeEnvelope(candidates);
  return {
    resolutionId: "resolution.production-risk",
    envelope,
    context: createDirectorRuntimeExecutiveGuidanceResolutionContext({
      activeContext: null,
      activeFocus: null,
      deliveryPolicy: envelope.deliveryPolicy,
    }),
  };
}

function defaultDeliveryPolicy(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy> =
    {},
): DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy {
  return Object.freeze({
    allowDelivery: true,
    allowInterruption: true,
    preserveFocus: true,
    preserveContext: true,
    preferredChannel: "director",
    fallbackChannel: null,
    ...overrides,
  });
}

function makePlatformInput(
  overrides: Partial<DirectorRuntimeExecutiveGuidancePlatformInput> & {
    readonly candidates?: readonly DirectorRuntimeExecutiveGuidanceCandidate[];
  } = {},
): DirectorRuntimeExecutiveGuidancePlatformInput {
  const candidates = overrides.candidates ?? [
    makeCandidate("candidate.production-risk", {
      guidanceId: "guidance.production-risk",
    }),
    makeCandidate("candidate.delivery-kpi", {
      guidanceId: "guidance.delivery-kpi",
      guidanceKind: "surface-evidence",
      intent: "explain",
      importance: "important",
      urgency: "soon",
      target: { targetKind: "kpi", targetId: "delivery-kpi" },
      source: {
        sourceKind: "runtime-state",
        sourceId: "metric.delivery-kpi",
      },
    }),
  ];
  const resolutionInput =
    overrides.resolutionInput ?? makeResolutionInput(candidates);
  return createDirectorExecutiveGuidancePlatformInput({
    platformRunId: overrides.platformRunId ?? "platform-run.production-risk",
    deliveryId: overrides.deliveryId ?? "delivery.production-risk",
    resolutionInput,
    compositionContext: overrides.compositionContext ?? {
      compositionId: "composition.production-risk",
      relationships: Object.freeze([]),
      paths: Object.freeze([]),
    },
    deliveryPolicy: overrides.deliveryPolicy ?? defaultDeliveryPolicy(),
    deliveryContext: overrides.deliveryContext ?? {
      activeFocusId: "production",
      activeContextId: "production",
      requestedChannel: "director",
    },
  });
}

test("1. exact DRI-7:6 identity", () => {
  assert.equal(
    platform.identity,
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
  );
  assert.equal(canonicalIdentity.identity, platform.identity);
  assert.equal(platform.phase, "DRI-7:6");
  assert.equal(platform.role, "Platform");
});

test("2. exact version 7.6.0", () => {
  assert.equal(platform.version, "7.6.0");
  assert.equal(canonicalIdentity.version, "7.6.0");
});

test("3. exact namespace", () => {
  assert.equal(
    platform.namespace,
    "nexora.dri.executive-guidance.platform",
  );
});

test("4. sole immediate dependency is DRI-7:5", () => {
  assert.equal(
    platform.upstreamDependency,
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
  );
  assert.equal(
    platform.upstreamDependency,
    directorRuntimeExecutiveGuidanceDeliveryIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery",
  ]);
});

test("5. no direct DRI-7:4 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceComposition["']/,
  );
});

test("6. no direct DRI-7:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceResolution["']/,
  );
});

test("7. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("8. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("9. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("10. platform-status vocabulary completeness", () => {
  assert.deepEqual([...statuses], [
    "ready",
    "completed",
    "held",
    "deferred",
    "blocked",
    "failed",
  ]);
});

test("11. platform-stage vocabulary completeness", () => {
  assert.deepEqual([...stages], [
    "resolution",
    "composition",
    "delivery",
  ]);
});

test("12. stage-status vocabulary completeness", () => {
  assert.deepEqual([...stageStatuses], [
    "not-started",
    "completed",
    "skipped",
    "blocked",
    "failed",
  ]);
});

test("13. platform registry deterministic", () => {
  assert.equal(registry.identity, platform.identity);
  assert.equal(registry.version, "7.6.0");
  assert.equal(registry.statusCount, 6);
  assert.equal(registry.stageCount, 3);
  assert.equal(registry.ruleCount, 9);
  assert.ok(Object.isFrozen(registry));
});

test("14. execution-order registry exact", () => {
  assert.deepEqual([...executionOrder], [
    "resolution",
    "composition",
    "delivery",
  ]);
});

test("15. platform rule order deterministic", () => {
  assert.deepEqual([...ruleOrder], [
    "input-integrity",
    "resolution-stage",
    "composition-stage",
    "delivery-stage",
    "stage-order",
    "stage-short-circuit",
    "outcome-mapping",
    "traceability",
    "consumer-readiness",
  ]);
  assert.deepEqual([...ruleIds], [
    "dri7.platform.input-integrity",
    "dri7.platform.resolution-stage",
    "dri7.platform.composition-stage",
    "dri7.platform.delivery-stage",
    "dri7.platform.stage-order",
    "dri7.platform.stage-short-circuit",
    "dri7.platform.outcome-mapping",
    "dri7.platform.traceability",
    "dri7.platform.consumer-readiness",
  ]);
});

test("16. capability descriptor correct", () => {
  assert.equal(capability.supportsResolution, true);
  assert.equal(capability.supportsComposition, true);
  assert.equal(capability.supportsDelivery, true);
  assert.equal(capability.rendererIndependent, true);
  assert.equal(capability.advisorIndependent, true);
  assert.equal(capability.actionIndependent, true);
  assert.equal(capability.sideEffectFree, true);
  assert.equal(capability.adapterIndependent, true);
  assert.equal(capability.synchronous, true);
});

test("17. valid resolution stage executes", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.notEqual(result.resolution, null);
  assert.equal(result.resolution?.resolutionId, "resolution.production-risk");
  assert.equal(result.stageTrace[0]?.stage, "resolution");
  assert.equal(result.stageTrace[0]?.status, "completed");
});

test("18. valid composition stage executes after resolution", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.notEqual(result.composition, null);
  assert.equal(
    result.composition?.compositionId,
    "composition.production-risk",
  );
  assert.equal(result.stageTrace[1]?.stage, "composition");
  assert.equal(result.stageTrace[1]?.status, "completed");
  assert.equal(
    result.stageTrace[1]?.inputIdentity,
    result.resolution?.resolutionId,
  );
});

test("19. valid delivery stage executes after composition", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.notEqual(result.delivery, null);
  assert.equal(result.delivery?.deliveryId, "delivery.production-risk");
  assert.equal(result.stageTrace[2]?.stage, "delivery");
  assert.equal(result.stageTrace[2]?.status, "completed");
  assert.equal(
    result.stageTrace[2]?.inputIdentity,
    result.composition?.compositionId,
  );
});

test("20. completed ready delivery maps to platform completed", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.delivery?.status, "ready");
  assert.equal(result.status, "completed");
  assert.equal(
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "ready",
      failed: false,
    }),
    "completed",
  );
});

test("21. held delivery maps to platform held", () => {
  const result = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      deliveryPolicy: defaultDeliveryPolicy({ allowDelivery: false }),
    }),
  );
  assert.equal(result.delivery?.status, "held");
  assert.equal(result.status, "held");
  assert.equal(result.summary.consumerReady, false);
});

test("22. deferred delivery maps to platform deferred", () => {
  const result = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      deliveryPolicy: defaultDeliveryPolicy({ allowInterruption: false }),
    }),
  );
  assert.equal(result.delivery?.status, "deferred");
  assert.equal(result.status, "deferred");
  assert.equal(result.summary.consumerReady, false);
});

test("23. blocked delivery maps to platform blocked", () => {
  assert.equal(
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "blocked",
      failed: false,
    }),
    "blocked",
  );
  // Ordinary empty selection yields held (not failure); blocked mapping is
  // reserved for delivery integrity/contract blocks preserved by the platform.
  const empty = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({ candidates: [] }),
  );
  assert.equal(empty.status, "held");
  assert.notEqual(empty.status, "failed");
  assert.equal(empty.delivery?.status, "held");
});

test("24. failed upstream stage maps to platform failed", () => {
  const result = runDirectorExecutiveGuidancePlatform({
    platformRunId: "platform-run.invalid",
    deliveryId: "delivery.invalid",
    resolutionInput: {
      resolutionId: "resolution.broken",
      envelope: {} as never,
      context: {} as never,
    },
    compositionContext: {
      compositionId: "composition.broken",
      relationships: [],
      paths: [],
    },
    deliveryPolicy: defaultDeliveryPolicy(),
    deliveryContext: {
      activeFocusId: null,
      activeContextId: null,
      requestedChannel: null,
    },
  });
  assert.equal(result.status, "failed");
  assert.equal(result.resolution, null);
  assert.equal(result.composition, null);
  assert.equal(result.delivery, null);
});

test("25. resolution failure short-circuits composition", () => {
  const result = runDirectorExecutiveGuidancePlatform({
    platformRunId: "platform-run.fail-resolution",
    deliveryId: "delivery.fail",
    resolutionInput: {
      resolutionId: "resolution.fail",
      envelope: { candidates: undefined } as never,
      context: {
        activeContext: null,
        activeFocus: null,
        deliveryPolicy: {
          interruption: "non-interruptive",
          persistence: "transient",
          preserveFocus: false,
          preserveContext: false,
        },
      },
    },
    compositionContext: {
      compositionId: "composition.fail",
      relationships: [],
      paths: [],
    },
    deliveryPolicy: defaultDeliveryPolicy(),
    deliveryContext: {
      activeFocusId: null,
      activeContextId: null,
      requestedChannel: null,
    },
  });
  assert.equal(result.status, "failed");
  assert.equal(result.composition, null);
  assert.equal(result.stageTrace[1]?.status, "skipped");
});

test("26. resolution failure short-circuits delivery", () => {
  const result = runDirectorExecutiveGuidancePlatform({
    platformRunId: "platform-run.fail-resolution-2",
    deliveryId: "delivery.fail-2",
    resolutionInput: {
      resolutionId: "resolution.fail-2",
      envelope: { candidates: undefined } as never,
      context: {
        activeContext: null,
        activeFocus: null,
        deliveryPolicy: {
          interruption: "non-interruptive",
          persistence: "transient",
          preserveFocus: false,
          preserveContext: false,
        },
      },
    },
    compositionContext: {
      compositionId: "composition.fail-2",
      relationships: [],
      paths: [],
    },
    deliveryPolicy: defaultDeliveryPolicy(),
    deliveryContext: {
      activeFocusId: null,
      activeContextId: null,
      requestedChannel: null,
    },
  });
  assert.equal(result.delivery, null);
  assert.equal(result.stageTrace[2]?.status, "skipped");
});

test("27. composition failure short-circuits delivery", () => {
  const result = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      compositionContext: {
        compositionId: "composition.bad-relationship",
        relationships: [null as never],
        paths: [],
      },
    }),
  );
  assert.equal(result.status, "failed");
  assert.notEqual(result.resolution, null);
  assert.equal(result.composition, null);
  assert.equal(result.delivery, null);
  assert.equal(result.stageTrace[1]?.status, "failed");
  assert.equal(result.stageTrace[2]?.status, "skipped");
});

test("28. held/deferred/blocked are not treated as platform failure", () => {
  const held = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      deliveryPolicy: defaultDeliveryPolicy({ allowDelivery: false }),
    }),
  );
  const deferred = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      deliveryPolicy: defaultDeliveryPolicy({ allowInterruption: false }),
    }),
  );
  assert.notEqual(held.status, "failed");
  assert.notEqual(deferred.status, "failed");
  assert.equal(held.stageTrace[2]?.status, "completed");
  assert.equal(deferred.stageTrace[2]?.status, "completed");
});

test("29. stage trace complete", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.stageTrace.length, 3);
  assert.deepEqual(
    result.stageTrace.map((entry) => entry.stage),
    ["resolution", "composition", "delivery"],
  );
});

test("30. stage trace ordered", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.deepEqual(
    result.stageTrace.map((entry) => entry.stage),
    [...executionOrder],
  );
});

test("31. resolution identity preserved", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.resolution?.resolutionId, "resolution.production-risk");
  assert.equal(
    result.stageTrace[0]?.outputIdentity,
    "resolution.production-risk",
  );
});

test("32. composition identity preserved", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(
    result.composition?.compositionId,
    "composition.production-risk",
  );
});

test("33. delivery identity preserved", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.delivery?.deliveryId, "delivery.production-risk");
});

test("34. platform run identity preserved", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.platformRunId, "platform-run.production-risk");
});

test("35. no internally generated stage IDs", () => {
  assert.doesNotMatch(source, /crypto\.randomUUID|Math\.random|Date\.now/);
  assert.doesNotMatch(source, /generateId|uuidv4|nanoid/);
});

test("36. resolution output not rewritten", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(result.resolution);
  assert.equal(result.resolution.requestId, "request.production-risk");
  assert.ok(result.resolution.selectedCandidateIds.length >= 1);
});

test("37. composition output not rewritten", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(result.composition);
  assert.equal(
    result.composition.primary?.guidanceId,
    "guidance.production-risk",
  );
  assert.equal(result.composition.primary?.priorityTier, "primary");
});

test("38. delivery output not rewritten", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(result.delivery);
  assert.equal(
    result.delivery.primary?.guidanceId,
    result.composition?.primary?.guidanceId,
  );
  assert.equal(result.delivery.primary?.priorityTier, "primary");
});

test("39. delivery consumer readiness preserved", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.delivery?.readiness, "ready-for-consumer");
});

test("40. platform consumer readiness derived correctly", () => {
  const ready = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  const held = runDirectorExecutiveGuidancePlatform(
    makePlatformInput({
      deliveryPolicy: defaultDeliveryPolicy({ allowDelivery: false }),
    }),
  );
  assert.equal(ready.readiness, "ready-for-consumer");
  assert.equal(ready.summary.consumerReady, true);
  assert.equal(held.readiness, "not-ready-for-consumer");
  assert.equal(held.summary.consumerReady, false);
});

test("41. summary completed-stage count correct", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.summary.completedStageCount, 3);
});

test("42. summary blocked-stage count correct", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.summary.blockedStageCount, 0);
});

test("43. summary failed-stage count correct", () => {
  const failed = runDirectorExecutiveGuidancePlatform({
    platformRunId: "x",
    deliveryId: "y",
    resolutionInput: {
      resolutionId: "r",
      envelope: { candidates: undefined } as never,
      context: {
        activeContext: null,
        activeFocus: null,
        deliveryPolicy: {
          interruption: "non-interruptive",
          persistence: "transient",
          preserveFocus: false,
          preserveContext: false,
        },
      },
    },
    compositionContext: {
      compositionId: "c",
      relationships: [],
      paths: [],
    },
    deliveryPolicy: defaultDeliveryPolicy(),
    deliveryContext: {
      activeFocusId: null,
      activeContextId: null,
      requestedChannel: null,
    },
  });
  assert.equal(failed.summary.failedStageCount, 1);
  assert.equal(failed.summary.skippedStageCount, 2);
});

test("44. summary output availability flags correct", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.summary.resolutionAvailable, true);
  assert.equal(result.summary.compositionAvailable, true);
  assert.equal(result.summary.deliveryAvailable, true);
  assert.equal(result.summary.deliveryStatus, "ready");
});

test("45. no hidden stage execution", () => {
  assert.doesNotMatch(source, /\bsetTimeout\b|\bsetInterval\b|\bqueueMicrotask\b/);
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(result.stageTrace.length, 3);
});

test("46. no re-resolution", () => {
  assert.doesNotMatch(source, /eligibility|duplicate-guidance|conflict-guidance/);
  assert.match(source, /resolveDirectorExecutiveGuidance\(input\.resolutionInput\)/);
  const calls = source.match(/resolveDirectorExecutiveGuidance\(/g) ?? [];
  assert.equal(calls.length, 1);
});

test("47. no re-composition", () => {
  const calls = source.match(/composeDirectorExecutiveGuidance\(/g) ?? [];
  assert.equal(calls.length, 1);
  assert.doesNotMatch(source, /priorityTier\s*=\s*["']supporting["']/);
});

test("48. no re-delivery-policy logic", () => {
  assert.doesNotMatch(source, /allowDelivery\s*===\s*false/);
  assert.doesNotMatch(source, /non-interruption-policy/);
  const calls = source.match(/deliverDirectorExecutiveGuidance\(/g) ?? [];
  assert.equal(calls.length, 1);
});

test("49. no new guidance created", () => {
  assert.doesNotMatch(source, /createDirectorRuntimeExecutiveGuidanceItem/);
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.equal(
    result.delivery?.primary?.guidance.guidanceId,
    "guidance.production-risk",
  );
});

test("50. no numeric scoring", () => {
  assert.doesNotMatch(source, /deliveryScore|platformScore|score\s*[:=]/);
});

test("51. no weighted ranking", () => {
  assert.doesNotMatch(source, /weight|ranking|rankScore/);
});

test("52. no event bus", () => {
  assert.doesNotMatch(source, /\bEventEmitter\b|\beventBus\b|\bsubscribe\b|\bpublish\b/);
});

test("53. no callbacks", () => {
  assert.doesNotMatch(source, /onComplete|consumerCallback|addListener/);
});

test("54. no network IO", () => {
  assert.doesNotMatch(source, /\bfetch\b|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test("55. no storage IO", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|\bfs\./);
});

test("56. no timers", () => {
  assert.doesNotMatch(source, /\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b/);
});

test("57. no randomness", () => {
  assert.doesNotMatch(source, /Math\.random|crypto\.randomUUID/);
});

test("58. no generated timestamps", () => {
  assert.doesNotMatch(source, /Date\.now\(|new Date\(|performance\.now/);
});

test("59. no artificial async behavior", () => {
  assert.doesNotMatch(source, /\basync\b|\bawait\b|\bPromise\b/);
});

test("60. platform input not mutated", () => {
  const input = makePlatformInput();
  const before = JSON.stringify(input);
  runDirectorExecutiveGuidancePlatform(input);
  assert.equal(JSON.stringify(input), before);
});

test("61. upstream stage input not mutated", () => {
  const input = makePlatformInput();
  const resolutionBefore = JSON.stringify(input.resolutionInput);
  const policyBefore = JSON.stringify(input.deliveryPolicy);
  const contextBefore = JSON.stringify(input.deliveryContext);
  runDirectorExecutiveGuidancePlatform(input);
  assert.equal(JSON.stringify(input.resolutionInput), resolutionBefore);
  assert.equal(JSON.stringify(input.deliveryPolicy), policyBefore);
  assert.equal(JSON.stringify(input.deliveryContext), contextBefore);
});

test("62. platform result immutable", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(Object.isFrozen(result));
  assert.throws(() => {
    (result as { status: string }).status = "failed";
  });
});

test("63. stage trace immutable", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(Object.isFrozen(result.stageTrace));
  assert.ok(Object.isFrozen(result.stageTrace[0]));
});

test("64. summary immutable", () => {
  const result = runDirectorExecutiveGuidancePlatform(makePlatformInput());
  assert.ok(Object.isFrozen(result.summary));
});

test("65. registry immutable", () => {
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(registry.statuses));
  assert.ok(Object.isFrozen(registry.stages));
  assert.ok(Object.isFrozen(registry.ruleIds));
});

test("66. repeated identical input gives identical result", () => {
  const input = makePlatformInput();
  const first = runDirectorExecutiveGuidancePlatform(input);
  const second = runDirectorExecutiveGuidancePlatform(input);
  assert.deepEqual(first, second);
});

test("67. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["']three["']|@react-three/);
});

test("68. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["']react["']|from\s+["']react-dom["']|from\s+["']next\//);
});

test("69. no DOM/browser dependency", () => {
  assert.doesNotMatch(source, /\bdocument\b|\bwindow\b|\bHTMLElement\b|\bCanvas\b/);
});

test("70. no SceneRenderer integration", () => {
  assert.doesNotMatch(source, /SceneRenderer|AnimatableObject/);
});

test("71. no Advisor/LLM behavior", () => {
  assert.doesNotMatch(source, /\bLLM\b|systemPrompt|openai|tokenCount|chatCompletion/);
});

test("72. no business action execution", () => {
  assert.doesNotMatch(
    source,
    /\bapprove\(|\breject\(|\bexecute\(|\bpause\(|\bresume\(|\bcancel\(/,
  );
});

test("73. no adapter behavior", () => {
  assert.doesNotMatch(
    source,
    /adapterCertification|compatibilityMatrix|ReactAdapter|ThreeAdapter/,
  );
  assert.equal(capability.adapterIndependent, true);
});

test("74. platform verification passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidancePlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.version, "7.6.0");
  assert.equal(verification.statusCount, 6);
  assert.equal(verification.stageCount, 3);
  assert.equal(verification.ruleCount, 9);
});

test("75. DRI-7:5 regression passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceDelivery();
  assert.equal(verification.ok, true);
});

test("76. DRI-7:4 regression passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceComposition();
  assert.equal(verification.ok, true);
});

test("77. DRI-7:3 regression passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceResolution();
  assert.equal(verification.ok, true);
});

test("78. DRI-7:2 regression passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceContracts();
  assert.equal(verification.ok, true);
});

test("79. DRI-7:1 regression passes", () => {
  const verification = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(verification.ok, true);
});

test("80. DRI-6 regression remains clean", () => {
  const verification = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(verification.ok, true);
});

test("81. focused DRI-7:6 suite surface sanity", () => {
  assert.ok(apiNames.includes("runDirectorExecutiveGuidancePlatform"));
  assert.ok(publicTypeNames.includes("DirectorRuntimeExecutiveGuidancePlatformResult"));
  assert.equal(registry.publicApiCount, apiNames.length);
});
