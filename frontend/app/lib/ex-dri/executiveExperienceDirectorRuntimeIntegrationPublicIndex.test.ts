import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  EXECUTIVE_DIRECTOR_RUNTIME_APPROVED_FROZEN_EXPORTS,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_LOCK,
  EXECUTIVE_DIRECTOR_RUNTIME_PROHIBITED_CONSUMER_IMPORTS,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CERTIFICATION_NAMES,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_GUARANTEES,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_EXPORT_REGISTRY,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_FUNCTIONAL_API_NAMES,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_INDEX_SECTIONS,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_TYPE_NAMES,
  EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_VALIDATION_API_NAMES,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
  EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS,
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
  EXECUTIVE_INTEGRATION_PLATFORM_SURFACES,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeConsumerReadiness,
  executiveExperienceDirectorRuntimeIntegrationPublicIndex,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexArchitecturalRole,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexCanonicalIdentity,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexDependencyIdentity,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexModule,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexNamespace,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexRegistry,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexSupportedImportPath,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexVersion,
  executiveExperienceDirectorRuntimePublicCertificationStatus,
  executiveExperienceDirectorRuntimePublicCompatibilityStatus,
  executiveExperienceDirectorRuntimePublicFreezeStatus,
  executiveExperienceDirectorRuntimePublicLockStatus,
  executiveExperienceDirectorRuntimePublicStability,
  executiveExperienceDirectorRuntimeReleaseStatus,
  prepareExecutiveDirectorRuntimeRequest,
  processDirectorRuntimeResponseForExecutiveExperience,
  resolveExecutiveDirectorRuntimePublicIndexRelease,
  verifyExecutiveExperienceDirectorRuntimeIntegrationPublicIndex,
} from "./executiveExperienceDirectorRuntimeIntegrationPublicIndex.ts";

import {
  certifyExecutiveExperienceDirectorRuntimeIntegration as freezeCertify,
  prepareExecutiveDirectorRuntimeRequest as freezePrepare,
  processDirectorRuntimeResponseForExecutiveExperience as freezeProcess,
  verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze,
} from "./executiveExperienceDirectorRuntimeIntegrationCertificationFreeze.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = readFileSync(
  join(
    __dirname,
    "executiveExperienceDirectorRuntimeIntegrationPublicIndex.ts",
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

test("1. Exact identity", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexCanonicalIdentity
      .identity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
});

test("2. Exact version 1.9.0", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexVersion,
    "1.9.0",
  );
});

test("3. Exact namespace", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexNamespace,
    "nexora.ex.dri.integration.public-index",
  );
});

test("4. Consumer role is SoleConsumerEntryPoint", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexArchitecturalRole,
    "SoleConsumerEntryPoint",
  );
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION.consumerRole,
    "SoleConsumerEntryPoint",
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexModule.role,
    "SoleConsumerEntryPoint",
  );
});

test("5. Sole immediate dependency is EX-DRI-8", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexDependencyIdentity,
    "EX-DRI-8/ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex-dri\/executiveExperienceDirectorRuntime(?:Integration(?:Foundation|Contracts|Platform)|ContextState|Interaction|ScenePresentation|AdvisorInsight)[^"']*["']/,
  );
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/(?:dri|nol)\//);
});

test("6. Exact supported import path", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexSupportedImportPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
});

test("7. Exactly nine namespace sections in canonical order", () => {
  assert.equal(EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_INDEX_SECTIONS.length, 9);
  assert.deepEqual([...EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_INDEX_SECTIONS], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.deepEqual(
    Object.keys(executiveExperienceDirectorRuntimeIntegrationPublicIndex),
    [...EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_INDEX_SECTIONS],
  );
});

test("8. Release status is Released", () => {
  assert.equal(executiveExperienceDirectorRuntimeReleaseStatus, "Released");
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndex.ReleaseInformation
      .releaseStatus,
    "Released",
  );
});

test("9. Certification is Certified from frozen upstream", () => {
  assert.equal(
    executiveExperienceDirectorRuntimePublicCertificationStatus,
    "Certified",
  );
  const freeze =
    verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze();
  assert.equal(freeze.certificationStatus, "certified");
  assert.equal(freeze.valid, true);
});

test("10. Compatibility is Compatible", () => {
  assert.equal(
    executiveExperienceDirectorRuntimePublicCompatibilityStatus,
    "Compatible",
  );
});

test("11. Freeze is Frozen", () => {
  assert.equal(executiveExperienceDirectorRuntimePublicFreezeStatus, "Frozen");
});

test("12. Lock is Locked with exact platform lock", () => {
  assert.equal(executiveExperienceDirectorRuntimePublicLockStatus, "Locked");
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_LOCK,
    "EX-DRI-EXECUTIVE-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED",
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndex.ReleaseInformation
      .lock,
    "EX-DRI-EXECUTIVE-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED",
  );
});

test("13. Stability is Stable", () => {
  assert.equal(executiveExperienceDirectorRuntimePublicStability, "Stable");
});

test("14. Consumer readiness is ReadyForConsumer", () => {
  assert.equal(
    executiveExperienceDirectorRuntimeConsumerReadiness,
    "ReadyForConsumer",
  );
});

test("15. Canonical surfaces preserved", () => {
  assert.deepEqual([...EXECUTIVE_INTEGRATION_PLATFORM_SURFACES], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  assert.equal(EXECUTIVE_INTEGRATION_PLATFORM_SURFACES.length, 6);
});

test("16. Presentation states preserved", () => {
  assert.deepEqual([...EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES], [
    "minimum",
    "report",
    "operation",
  ]);
});

test("17. Integration directions preserved", () => {
  assert.deepEqual([...EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS], [
    "ex-to-dri",
    "dri-to-ex",
  ]);
});

test("18. Seven runtime direction kinds preserved", () => {
  assert.deepEqual([...EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS], [
    "scene",
    "focus",
    "attention",
    "presentation",
    "guidance",
    "coordination",
    "interaction",
  ]);
  assert.equal(EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS.length, 7);
  for (const kind of [
    "scene",
    "focus",
    "attention",
    "presentation",
    "guidance",
    "interaction",
    "coordination",
  ] as const) {
    assert.ok(
      (EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS as readonly string[]).includes(
        kind,
      ),
      kind,
    );
  }
});

test("19. Public request capability via EX-DRI-9 only", () => {
  const prepared = prepareExecutiveDirectorRuntimeRequest({
    state: baseState(),
    correlation: { correlationId: "C-PUBLIC-REQ", sequence: 1 },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factory,
    },
  });
  assert.equal(prepared.status, "prepared");
  assert.equal(prepared.request?.direction, "ex-to-dri");
  assert.equal(prepared.request?.kind, "context-interaction");
  assert.equal(prepared.request?.correlation.correlationId, "C-PUBLIC-REQ");
  assert.doesNotMatch(
    JSON.stringify(prepared),
    /executeDirector|callDRI|setState|useState|createRoot/,
  );
});

test("20. Public response capability via EX-DRI-9 only", () => {
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-PUBLIC-RES" },
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
    }),
  );
  assert.equal(result.status, "resolved");
  assert.ok(result.projection);
  assert.equal(
    result.projection?.visual.scene?.primarySubject?.id,
    "factory-1",
  );
  assert.equal(
    result.projection?.visual.focus[0]?.subject?.id,
    "kpi-throughput",
  );
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
});

test("21. Visual projection APIs reachable through Public Index", () => {
  assert.ok(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_FUNCTIONAL_API_NAMES.includes(
      "processDirectorRuntimeResponseForExecutiveExperience",
    ),
  );
  assert.ok(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_TYPE_NAMES.includes(
      "ExecutiveDirectorRuntimeUnifiedProjection",
    ),
  );
  assert.equal(
    typeof executiveExperienceDirectorRuntimeIntegrationPublicIndex.PublicAPIs
      .processDirectorRuntimeResponseForExecutiveExperience,
    "function",
  );
});

test("22. Advisor/Insight projection reachable through Public Index", () => {
  assert.ok(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_TYPE_NAMES.includes(
      "ExecutiveDirectorRuntimeUnifiedProjection",
    ),
  );
  const result = processDirectorRuntimeResponseForExecutiveExperience(
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: { correlationId: "C-ADV" },
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
  assert.equal(
    result.projection?.advisorInsight.advisor.guidance[0]?.messageKey,
    "advisor.decision.review",
  );
});

test("23. No renderer / React / Three / AI coupling in public index source", () => {
  assert.doesNotMatch(source, /from\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(
    source,
    /from\s+["'](?:three|@react-three\/(?:fiber|drei))["']/,
  );
  assert.doesNotMatch(source, /from\s+["']next(?:\/|$)/);
  assert.doesNotMatch(
    source,
    /from\s+["'](?:zustand|redux|mobx|jotai|openai|@anthropic|@google\/generative-ai)["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:createRoot|useState|useEffect|document\.|window\.|THREE\.|WebGL|callLLM|generateText|prompt)\b/,
  );
});

test("24. Public-index verification succeeds", () => {
  const verification =
    verifyExecutiveExperienceDirectorRuntimeIntegrationPublicIndex();
  assert.equal(verification.valid, true);
  assert.equal(verification.released, true);
  assert.equal(verification.certified, true);
  assert.equal(verification.compatible, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.locked, true);
  assert.equal(verification.stable, true);
  assert.equal(verification.readyForConsumer, true);
});

test("25. Forced release failure clears ReadyForConsumer", () => {
  const failed = resolveExecutiveDirectorRuntimePublicIndexRelease({
    forceReleaseFailure: true,
  });
  assert.equal(failed.releaseStatus, "Unreleased");
  assert.equal(failed.consumerReadiness, "NotReadyForConsumer");
  assert.equal(failed.gatePassed, false);
});

test("26. Immutability of public surfaces", () => {
  assert.equal(
    Object.isFrozen(executiveExperienceDirectorRuntimeIntegrationPublicIndex),
    true,
  );
  assert.equal(
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationPublicIndexRegistry,
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_EXPORT_REGISTRY),
    true,
  );
  assert.equal(
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_GUARANTEES),
    true,
  );
  assert.equal(
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationPublicIndex
        .ReleaseInformation,
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationPublicIndex.Compatibility,
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationPublicIndex
        .ConsumerInformation,
    ),
    true,
  );
  assert.throws(() => {
    (
      executiveExperienceDirectorRuntimeIntegrationPublicIndex as {
        Identity: unknown;
      }
    ).Identity = {};
  });
});

test("27. Frozen API identity preservation (no wrappers)", () => {
  assert.equal(prepareExecutiveDirectorRuntimeRequest, freezePrepare);
  assert.equal(
    processDirectorRuntimeResponseForExecutiveExperience,
    freezeProcess,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndex.PublicAPIs
      .prepareExecutiveDirectorRuntimeRequest,
    freezePrepare,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndex.PublicAPIs
      .processDirectorRuntimeResponseForExecutiveExperience,
    freezeProcess,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndex.Certification
      .certifyExecutiveExperienceDirectorRuntimeIntegration,
    freezeCertify,
  );
});

test("28. Export completeness against approved frozen registry", () => {
  const approved = new Set(
    EXECUTIVE_DIRECTOR_RUNTIME_APPROVED_FROZEN_EXPORTS.map(
      (entry) => entry.exportName,
    ),
  );
  for (const entry of EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_EXPORT_REGISTRY) {
    assert.ok(approved.has(entry.exportName), entry.exportName);
    assert.equal(entry.approvedFrozenStatus, "approved-frozen");
    assert.equal(entry.publicStatus, "public");
  }
  for (const required of [
    "prepareExecutiveDirectorRuntimeRequest",
    "processDirectorRuntimeResponseForExecutiveExperience",
    "certifyExecutiveExperienceDirectorRuntimeIntegration",
    "verifyExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  ] as const) {
    assert.ok(approved.has(required), required);
  }
  assert.ok(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_VALIDATION_API_NAMES.includes(
      "verifyExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
    ),
  );
});

test("29. Export minimality — no private helper leakage", () => {
  for (const entry of EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_EXPORT_REGISTRY) {
    assert.doesNotMatch(entry.exportName, /^_/);
    assert.doesNotMatch(
      entry.exportName,
      /Helper|Internal|Private|Temp|Builder/,
    );
  }
  assert.doesNotMatch(source, /export\s+(?:function|const)\s+_/);
});

test("30. Registry counts derived from canonical arrays", () => {
  const registry =
    executiveExperienceDirectorRuntimeIntegrationPublicIndexRegistry;
  assert.equal(
    registry.sectionCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_INDEX_SECTIONS.length,
  );
  assert.equal(
    registry.publicTypeCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_TYPE_NAMES.length,
  );
  assert.equal(
    registry.publicFunctionalApiCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_FUNCTIONAL_API_NAMES.length,
  );
  assert.equal(
    registry.validationApiCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_VALIDATION_API_NAMES.length,
  );
  assert.equal(
    registry.certificationApiCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CERTIFICATION_NAMES.length,
  );
  assert.equal(
    registry.publicExportCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_EXPORT_REGISTRY.length,
  );
  assert.equal(
    registry.consumerGuaranteeCount,
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_GUARANTEES.length,
  );
  assert.equal(registry.surfaceCount, 6);
  assert.equal(registry.presentationStateCount, 3);
  assert.equal(registry.runtimeDirectionCount, 7);
  assert.equal(registry.consumerGuaranteeCount, 34);
});

test("31. Sole-entry / consumer import policy", () => {
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION.soleEntryPolicy,
    "Future Executive integration consumers should import EX-DRI only through EX-DRI-9.",
  );
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PROHIBITED_CONSUMER_IMPORTS.length,
    8,
  );
  assert.ok(
    EXECUTIVE_DIRECTOR_RUNTIME_PROHIBITED_CONSUMER_IMPORTS.includes(
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
    ),
  );
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION.freezeProvenance,
    "EX-DRI-8/ExecutiveExperienceDirectorRuntimeIntegrationCertificationFreeze",
  );
});

test("32. Consumer guarantees cover mandatory public boundary rules", () => {
  const ids = EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_GUARANTEES.map(
    (entry) => entry.id,
  );
  for (const required of [
    "sole-supported-entry",
    "depends-only-on-ex-dri-8",
    "no-new-public-index-behavior",
    "dri-authoritative-runtime",
    "ex-owns-rendering",
    "no-kpi-calculation",
    "no-koi-calculation",
    "no-kor",
    "no-react",
    "no-threejs",
    "no-ai",
    "platform-lock-preserved",
    "internal-phases-not-contracts",
  ] as const) {
    assert.ok((ids as readonly string[]).includes(required), required);
  }
});

test("33. Framework / renderer independence metadata", () => {
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION.frameworkIndependent,
    true,
  );
  assert.equal(
    EXECUTIVE_DIRECTOR_RUNTIME_PUBLIC_CONSUMER_INFORMATION.rendererIndependent,
    true,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexModule
      .reactIndependent,
    true,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexModule
      .threeJsIndependent,
    true,
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationPublicIndexModule.aiIndependent,
    true,
  );
});
