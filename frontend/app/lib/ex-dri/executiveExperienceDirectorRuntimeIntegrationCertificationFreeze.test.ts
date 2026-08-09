import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_DIRECTOR_RUNTIME_CERTIFICATION_CHECK_CODES as checkCodes,
  EXECUTIVE_DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS as domains,
  EXECUTIVE_DIRECTOR_RUNTIME_CERTIFICATION_FREEZE_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_DIRECTOR_RUNTIME_FREEZE_GUARANTEES as freezeGuarantees,
  EXECUTIVE_DIRECTOR_RUNTIME_FREEZE_INVARIANTS as freezeInvariants,
  EXECUTIVE_DIRECTOR_RUNTIME_FROZEN_PLATFORM_METADATA as frozenMetadata,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_IDENTITY_CHAIN_WITH_FREEZE as identityChain,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_LOCK as platformLock,
  certifyExecutiveExperienceDirectorRuntimeIntegration,
  executiveExperienceDirectorRuntimeIntegrationCertificationFreeze as freeze,
  executiveExperienceDirectorRuntimeIntegrationCertificationFreezeCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeIntegrationCertificationFreezeRegistry as registry,
  getExecutiveExperienceDirectorRuntimeIntegrationCertificationFreezeIdentity,
  resolveExecutiveDirectorRuntimePublicIndexReadiness,
  verifyExecutiveExperienceDirectorRuntimeCompatibility,
  verifyExecutiveExperienceDirectorRuntimeFreeze,
  verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze,
} from "./executiveExperienceDirectorRuntimeIntegrationCertificationFreeze.ts";

import {
  EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS as directionOwners,
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_INTEGRATION_PLATFORM_SURFACES as surfaces,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
  prepareExecutiveDirectorRuntimeRequest,
  processDirectorRuntimeResponseForExecutiveExperience,
  validateExecutiveDirectorRuntimeCycleCorrelation,
  verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPlatform";

import {
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
    "./executiveExperienceDirectorRuntimeIntegrationCertificationFreeze.ts",
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

test("1. exact EX-DRI-8 identity", () => {
  assert.equal(
    freeze.identity,
    "EX-DRI-8/ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  );
  assert.equal(canonicalIdentity.identity, freeze.identity);
  assert.equal(freeze.phase, "EX-DRI-8");
  assert.equal(
    freeze.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  );
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeIntegrationCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.8.0", () => {
  assert.equal(freeze.version, "1.8.0");
  assert.equal(canonicalIdentity.version, "1.8.0");
  assert.equal(registry.version, "1.8.0");
});

test("3. exact namespace", () => {
  assert.equal(
    freeze.namespace,
    "nexora.ex.dri.integration.certification-freeze",
  );
});

test("4. architectural role", () => {
  assert.equal(
    freeze.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  );
});

test("5. sole immediate dependency is EX-DRI-7", () => {
  assert.equal(
    freeze.upstreamDependency,
    "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  );
  assert.equal(
    freeze.upstreamDependency,
    executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
  );
  assert.equal(
    freeze.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPlatform",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (value) =>
        value ===
        "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPlatform",
    ),
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|nol|ex-dri\/executiveExperienceDirectorRuntime(?:Integration(?:Foundation|Contracts)|ContextState|Interaction|ScenePresentation|AdvisorInsight))[^"']*["']/,
  );
});

test("6. identity chain has eight exact identities in order", () => {
  assert.deepEqual([...identityChain], [
    "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
    "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
    "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
    "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
    "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
    "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
    "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
    "EX-DRI-8/ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  ]);
  assert.equal(new Set(identityChain).size, 8);
});

test("7. dependency chain ends at EX-DRI-7 → EX-DRI-6 and DRI consumer entry", () => {
  assert.equal(
    freeze.upstreamDependency,
    "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform().ok,
    true,
  );
});

test("8. canonical surfaces are exact six", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
});

test("9. presentation states are exact three", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
});

test("10. integration directions are exact two", () => {
  assert.match(source, /"ex-to-dri"/);
  assert.match(source, /"dri-to-ex"/);
});

test("11. runtime directions and ownership routing", () => {
  assert.equal(directionOwners.scene, "EX-DRI-5");
  assert.equal(directionOwners.focus, "EX-DRI-5");
  assert.equal(directionOwners.attention, "EX-DRI-5");
  assert.equal(directionOwners.presentation, "EX-DRI-5");
  assert.equal(directionOwners.guidance, "EX-DRI-6");
  assert.equal(directionOwners.coordination, "EX-DRI-6");
  assert.equal(directionOwners.interaction, "deferred");
});

test("12. request path certification example", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: {
      activeSurface: "stage",
      mode: "scenario",
      activeGoalId: "Goal-1",
      activePackId: "Scenario-A",
      surfaces: [
        {
          surface: "stage",
          selectedSubject: factory,
          presentationState: "report",
        },
      ],
    },
    correlation: { correlationId: "C-FREEZE-REQ" },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  assert.equal(prepared.status, "prepared");
  assert.equal(prepared.request?.direction, "ex-to-dri");
  assert.doesNotMatch(JSON.stringify(prepared), /executeDirector|callDRI/);
});

test("13. response path produces unified visual + advisor/insight projection", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-FREEZE-RES" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "scene",
          surface: "stage",
          primarySubject: factory,
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
          kind: "guidance",
          surface: "advisor",
          subject: factory,
          guidanceRole: "warn",
          messageKey: "advisor.factory.capacity-risk",
        }),
        createExecutiveRuntimeDirectionContract({
          kind: "coordination",
          sourceSurface: "stage",
          targetSurfaces: ["advisor", "insight"],
          subject: factory,
        }),
      ],
    }),
  );
  assert.equal(result.status, "resolved");
  assert.ok(result.projection?.visual);
  assert.ok(result.projection?.advisorInsight);
});

test("14. resolved / partial / rejected / noop response semantics", () => {
  const resolved = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-R" },
      status: "resolved",
      directions: [
        createExecutiveRuntimeDirectionContract({
          kind: "presentation",
          surface: "stage",
          subject: factory,
          state: "operation",
        }),
      ],
    }),
  );
  assert.equal(resolved.status, "resolved");

  const partial = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-P" },
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
  assert.equal(partial.status, "partial");

  const rejected = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-X" },
      status: "rejected",
      directions: [],
    }),
  );
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.projection, undefined);

  const noop = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-N" },
      status: "noop",
      directions: [],
    }),
  );
  assert.equal(noop.status, "noop");
  assert.equal(noop.projection, undefined);
});

test("15. selection/focus separation remains legal", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: {
      activeSurface: "stage",
      surfaces: [{ surface: "stage", selectedSubject: factory }],
    },
    correlation: { correlationId: "C-SF" },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  const focused = processDirectorRuntimeResponseForExecutiveExperience(
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
  );
  assert.equal(
    prepared.contextBinding?.activeContext?.selectedSubject?.id,
    "factory-1",
  );
  assert.equal(focused.projection?.visual.focus[0]?.subject?.id, "kpi-throughput");
});

test("16. subject coherence conflict is detected", () => {
  const conflict = processDirectorRuntimeResponseForExecutiveExperience(
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
          subject: Object.freeze({ id: "factory-1", kind: "kpi" as const }),
          guidanceRole: "metric",
          messageKey: "insight.factory.throughput",
        }),
      ],
    }),
  );
  assert.equal(conflict.status, "rejected");
  assert.ok(
    conflict.issues.some(
      (entry) => entry.upstreamCode === "SUBJECT_IDENTITY_CONFLICT",
    ),
  );
});

test("17. correlation match/mismatch", () => {
  assert.equal(
    validateExecutiveDirectorRuntimeCycleCorrelation({
      request: { correlationId: "C100" },
      response: { correlationId: "C100" },
    }).length,
    0,
  );
  assert.ok(
    validateExecutiveDirectorRuntimeCycleCorrelation({
      request: { correlationId: "C100" },
      response: { correlationId: "C200" },
    }).some((entry) => entry.code === "CORRELATION_MISMATCH"),
  );
});

test("18. deterministic repeated certification", () => {
  const first = certifyExecutiveExperienceDirectorRuntimeIntegration();
  const second = certifyExecutiveExperienceDirectorRuntimeIntegration();
  assert.equal(first.status, second.status);
  assert.equal(first.passedCount, second.passedCount);
  assert.equal(first.failedCount, second.failedCount);
  assert.deepEqual(
    first.checks.map((entry) => entry.code),
    second.checks.map((entry) => entry.code),
  );
});

test("19. call order does not change outcomes", () => {
  const a = verifyExecutiveExperienceDirectorRuntimeCompatibility();
  const b = certifyExecutiveExperienceDirectorRuntimeIntegration();
  const c = verifyExecutiveExperienceDirectorRuntimeCompatibility();
  assert.equal(a.status, c.status);
  assert.equal(b.status, "certified");
});

test("20. immutability of freeze artifacts", () => {
  assert.equal(Object.isFrozen(domains), true);
  assert.equal(Object.isFrozen(checkCodes), true);
  assert.equal(Object.isFrozen(freezeInvariants), true);
  assert.equal(Object.isFrozen(freezeGuarantees), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(platformLock), true);
  const verification =
    verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze();
  assert.equal(Object.isFrozen(verification), true);
  assert.throws(() => {
    (domains as unknown as string[]).push("Extra");
  });
});

test("21. React / Three.js / AI / store independence", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next\/|three|@react-three|zustand|redux|mobx|jotai|framer-motion|openai|anthropic|@anthropic-ai\/sdk|@google\/generative-ai)["']/,
  );
  assert.equal(freeze.reactIndependent, true);
  assert.equal(freeze.threeJsIndependent, true);
  assert.equal(freeze.aiIndependent, true);
  assert.equal(freeze.rendererIndependent, true);
  const certification =
    certifyExecutiveExperienceDirectorRuntimeIntegration();
  for (const code of [
    "REACT_INDEPENDENT",
    "THREEJS_INDEPENDENT",
    "AI_INDEPENDENT",
    "STORE_INDEPENDENT",
    "RENDERER_INDEPENDENT",
  ] as const) {
    assert.ok(
      certification.checks.some(
        (entry) => entry.code === code && entry.passed === true,
      ),
    );
  }
});

test("22. no duplicate runtime-engine APIs on freeze surface", () => {
  assert.doesNotMatch(
    source,
    /export\s+function\s+(?:resolveIntent|resolveFocus|resolveAttention|sceneOrchestrator|guidanceEngine|coordinationEngine)\b/,
  );
  const certification =
    certifyExecutiveExperienceDirectorRuntimeIntegration();
  assert.ok(
    certification.checks.some(
      (entry) =>
        entry.code === "NO_DUPLICATE_RUNTIME_ENGINE" && entry.passed === true,
    ),
  );
});

test("23. exact platform lock and locked status", () => {
  assert.equal(
    platformLock,
    "EX-DRI-EXECUTIVE-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(freeze.lock, platformLock);
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(verifyExecutiveExperienceDirectorRuntimeFreeze(), "frozen");
});

test("24. canonical readiness outcome", () => {
  const verification =
    verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze();
  assert.equal(verification.valid, true);
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.compatibilityStatus, "compatible");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.lockStatus, "locked");
  assert.equal(verification.stability, "Stable");
  assert.equal(verification.readiness, "ReadyForPublicIndex");
  assert.deepEqual(frozenMetadata, {
    certification: "certified",
    compatibility: "compatible",
    freeze: "frozen",
    lock: "locked",
    stability: "Stable",
    readiness: "ReadyForPublicIndex",
  });
});

test("25. failure readiness cannot remain ReadyForPublicIndex", () => {
  assert.equal(
    resolveExecutiveDirectorRuntimePublicIndexReadiness({
      certificationStatus: "failed",
      compatibilityStatus: "compatible",
      freezeStatus: "frozen",
      lockStatus: "locked",
    }),
    "NotReadyForPublicIndex",
  );
  assert.equal(
    resolveExecutiveDirectorRuntimePublicIndexReadiness({
      certificationStatus: "certified",
      compatibilityStatus: "incompatible",
      freezeStatus: "frozen",
      lockStatus: "locked",
    }),
    "NotReadyForPublicIndex",
  );
  assert.equal(
    resolveExecutiveDirectorRuntimePublicIndexReadiness({
      certificationStatus: "certified",
      compatibilityStatus: "compatible",
      freezeStatus: "unfrozen",
      lockStatus: "unlocked",
    }),
    "NotReadyForPublicIndex",
  );
});

test("26. certification domains and checks", () => {
  assert.equal(domains.length, 18);
  assert.equal(checkCodes.length, 34);
  const certification =
    certifyExecutiveExperienceDirectorRuntimeIntegration();
  assert.equal(certification.status, "certified");
  assert.equal(certification.failedCount, 0);
  assert.equal(certification.passedCount, certification.checks.length);
  assert.equal(certification.checks.length, 34);
  for (const code of checkCodes) {
    assert.ok(certification.checks.some((entry) => entry.code === code));
  }
});

test("27. freeze invariants and guarantees", () => {
  assert.equal(freezeInvariants.length, 34);
  assert.equal(freezeGuarantees.length, 34);
  assert.ok(freezeInvariants.every((entry) => entry.required === true));
  assert.equal(registrySections.length, 11);
  assert.match(freeze.architecturalStatus, /ReadyForPublicIndex/);
});

test("28. EX-DRI-1..7 regressions remain green", () => {
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
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform().ok,
    true,
  );
});

test("29. DRI consumer integration public index remains intact", () => {
  assert.equal(verifyDirectorRuntimeConsumerIntegrationPublicIndex().ok, true);
});

test("30. metadata policies are certified / compatible / frozen / locked", () => {
  assert.equal(canonicalIdentity.certificationStatus, "certified");
  assert.equal(canonicalIdentity.compatibilityStatus, "compatible");
  assert.equal(canonicalIdentity.freezeStatus, "frozen");
  assert.equal(canonicalIdentity.lockStatus, "locked");
  assert.equal(canonicalIdentity.stability, "Stable");
  assert.equal(canonicalIdentity.readiness, "ReadyForPublicIndex");
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.immutableStatus, true);
  assert.equal(canonicalIdentity.frameworkIndependenceStatus, true);
});
