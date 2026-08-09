import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION as consumerInfo,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY as registry,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS as sections,
  compareRuntimeExecutiveStageExperiencePlatformPlans,
  getRuntimeExecutiveStageExperiencePlatformCapabilities,
  getRuntimeExecutiveStageExperiencePlatformIdentity,
  inspectRuntimeExecutiveStageExperiencePlatformResult,
  resolveRuntimeExecutiveStageExperience,
  runtimeExecutiveStageExperiencePlatform as platform,
  runtimeExecutiveStageExperiencePlatformApiNames as apiNames,
  runtimeExecutiveStageExperiencePlatformCanonicalIdentity as canonicalIdentity,
  validateRuntimeExecutiveStageExperiencePlatformInput,
  verifyRuntimeExecutiveStageExperiencePlatform,
} from "./runtimeExecutiveStageExperiencePlatform.ts";

import {
  createRuntimeExecutiveStageModel,
  runtimeExecutiveStageExperienceOrchestrationIdentity,
  verifyRuntimeExecutiveStageExperienceOrchestration,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration";

import { verifyRuntimeExecutiveStagePresentationAttention } from "@/app/lib/rex/runtimeExecutiveStagePresentationAttention";
import { verifyRuntimeExecutiveStageFocusSelection } from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";
import { verifyRuntimeExecutiveStageModel } from "@/app/lib/rex/runtimeExecutiveStageModel";
import {
  createRuntimeExecutiveStageSceneContract,
  verifyRuntimeExecutiveStageExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";
import {
  createRuntimeExecutiveStageConnection,
  createRuntimeExecutiveStageContext,
  createRuntimeExecutiveStageScene,
  createRuntimeExecutiveStageSubject,
  verifyRuntimeExecutiveStageExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";
import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperiencePlatform.ts",
    import.meta.url,
  ),
  "utf8",
);

function buildModel() {
  const subjects = [
    createRuntimeExecutiveStageSubject({
      subjectId: "object.storage",
      kind: "object",
      label: "Storage",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.factory",
      kind: "object",
      label: "Factory",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "kpi.production",
      kind: "kpi",
      label: "KPI",
      presentationState: "minimum",
      attention: "warning",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.customer",
      kind: "object",
      label: "Customer",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.finance",
      kind: "object",
      label: "Finance",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.hr",
      kind: "object",
      label: "HR",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
  ];

  return createRuntimeExecutiveStageModel({
    modelId: "model.executive-operations",
    sceneContract: createRuntimeExecutiveStageSceneContract({
      scene: createRuntimeExecutiveStageScene({
        sceneId: "scene.executive-operations",
        revision: "r1",
        subjects,
        connections: [
          createRuntimeExecutiveStageConnection({
            connectionId: "conn.storage-factory",
            sourceSubjectId: "object.storage",
            targetSubjectId: "object.factory",
            kind: "flow",
            direction: "directed",
            state: "active",
          }),
          createRuntimeExecutiveStageConnection({
            connectionId: "conn.factory-kpi",
            sourceSubjectId: "object.factory",
            targetSubjectId: "kpi.production",
            kind: "kpi-relationship",
            direction: "directed",
            state: "emphasized",
          }),
          createRuntimeExecutiveStageConnection({
            connectionId: "conn.kpi-customer",
            sourceSubjectId: "kpi.production",
            targetSubjectId: "object.customer",
            kind: "impact",
            direction: "directed",
            state: "active",
          }),
          createRuntimeExecutiveStageConnection({
            connectionId: "conn.finance-factory",
            sourceSubjectId: "object.finance",
            targetSubjectId: "object.factory",
            kind: "influence",
            direction: "directed",
            state: "active",
          }),
          createRuntimeExecutiveStageConnection({
            connectionId: "conn.hr-factory",
            sourceSubjectId: "object.hr",
            targetSubjectId: "object.factory",
            kind: "influence",
            direction: "directed",
            state: "active",
          }),
        ],
        sceneState: "active",
        context: createRuntimeExecutiveStageContext({
          contextId: "ctx.executive-operations",
          activeSubjectId: "object.factory",
        }),
      }),
      source: "executive",
    }),
  });
}

function resolveFactoryExperience(planId = "plan.factory") {
  return resolveRuntimeExecutiveStageExperience({
    planId,
    model: buildModel(),
    selectionSubjectId: "object.factory",
    source: "executive",
    interactionReason: "Manager focused Factory",
  });
}

test("1. exact identity / version / namespace / role", () => {
  assert.equal(
    platform.identity,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
  assert.equal(platform.version, "2.7.0");
  assert.equal(platform.namespace, "nexora.rex.stage-experience.platform");
  assert.equal(platform.role, "PlatformBoundary");
  assert.equal(platform.phase, "Platform");
  assert.equal(platform.layer, "REX");
  assert.deepEqual(
    getRuntimeExecutiveStageExperiencePlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:6", () => {
  assert.equal(
    platform.upstreamDependency,
    "REX-2:6/RuntimeExecutiveStageExperienceOrchestration",
  );
  assert.equal(
    platform.upstreamDependency,
    runtimeExecutiveStageExperienceOrchestrationIdentity,
  );
  assert.equal(
    platform.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration",
  ]);
});

test("3. no direct REX-2:1–2:5 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:PresentationAttention|FocusSelection|Model|ExperienceFoundation|ExperienceContracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesOrchestrationOnly, true);
  assert.equal(boundary.importsRex25Directly, false);
  assert.equal(boundary.importsRex24Directly, false);
  assert.equal(boundary.isFinalPublicConsumerIndex, false);
});

test("4. platform / registry / guarantees immutability", () => {
  assert.ok(Object.isFrozen(platform));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(guarantees));
  assert.ok(Object.isFrozen(capabilities));
  assert.ok(Object.isFrozen(consumerInfo));
  assert.equal(guarantees.length, 20);
  assert.equal(sections.length, 8);
  assert.equal(consumerInfo.readyForCertificationAndFreeze, true);
  assert.equal(consumerInfo.isFinalPublicConsumerIndex, false);
});

test("5. resolve Stage Experience — Factory focus platform result", () => {
  const result = resolveFactoryExperience();
  assert.equal(result.status, "accepted");
  assert.equal(result.validation.ok, true);
  assert.equal(
    result.platformIdentity,
    "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
  );
  assert.equal(
    result.orchestrationIdentity,
    "REX-2:6/RuntimeExecutiveStageExperienceOrchestration",
  );
  assert.equal(result.plan.primaryFocusSubjectId, "object.factory");
  assert.deepEqual([...result.plan.selectedSubjectIds], ["object.factory"]);
  assert.ok(result.plan.attentionSubjectIds.includes("kpi.production"));
  assert.ok(result.plan.visibleSubjectIds.includes("object.factory"));
  assert.ok(result.plan.visibleSubjectIds.includes("kpi.production"));
  assert.ok(result.plan.emphasizedConnectionIds.includes("conn.factory-kpi"));
  assert.ok(result.reasons.length > 0);

  const factory = result.plan.subjects.find(
    (s) => s.subjectId === "object.factory",
  )!;
  const kpi = result.plan.subjects.find(
    (s) => s.subjectId === "kpi.production",
  )!;
  assert.equal(factory.presentationState, "operation");
  assert.equal(kpi.presentationState, "report");
  assert.equal(kpi.attention, "warning");
});

test("6. focus / selection / attention remain distinct", () => {
  const result = resolveRuntimeExecutiveStageExperience({
    planId: "plan.kpi-override",
    model: buildModel(),
    selectionSubjectId: "object.factory",
    focusRequest: { primaryFocusSubjectId: "kpi.production" },
    source: "director",
  });
  assert.equal(result.status, "accepted");
  assert.equal(result.plan.selectedSubjectIds[0], "object.factory");
  assert.equal(result.plan.primaryFocusSubjectId, "kpi.production");
  assert.notEqual(
    result.plan.selectedSubjectIds[0],
    result.plan.primaryFocusSubjectId,
  );
  assert.ok(result.plan.attentionSubjectIds.includes("kpi.production"));
});

test("7. presentation states preserved; deterministic equivalence", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  const a = resolveFactoryExperience("plan.a");
  const b = resolveFactoryExperience("plan.b");
  assert.equal(a.plan.stagePresentationState, b.plan.stagePresentationState);
  assert.deepEqual(
    [...a.plan.visibleSubjectIds],
    [...b.plan.visibleSubjectIds],
  );
  assert.deepEqual(
    [...a.plan.emphasizedConnectionIds],
    [...b.plan.emphasizedConnectionIds],
  );
  const comparison = compareRuntimeExecutiveStageExperiencePlatformPlans(
    a.plan,
    b.plan,
  );
  // planIds differ but semantic composition matches except plan id fields
  assert.equal(comparison.focusChanged, false);
  assert.equal(comparison.selectionChanged, false);
  assert.equal(comparison.attentionChanged, false);
  assert.equal(comparison.presentationChanged, false);
});

test("8. previous/current comparison; scene-change intents; inspection", () => {
  const first = resolveFactoryExperience("plan.1");
  const second = resolveRuntimeExecutiveStageExperience({
    planId: "plan.2",
    model: buildModel(),
    selectionSubjectId: "object.factory",
    source: "executive",
    previousPlan: first.plan,
  });
  assert.ok(second.comparison !== undefined);
  assert.equal(second.comparison!.identical, true);
  assert.ok(first.plan.sceneTransition.intents.includes("initial-scene"));

  const inspected = inspectRuntimeExecutiveStageExperiencePlatformResult(first);
  assert.equal(inspected.planId, "plan.1");
  assert.equal(inspected.primaryFocusSubjectId, "object.factory");
  assert.equal(inspected.validationOk, true);
});

test("9. invalid input fails deterministically; input immutability", () => {
  const model = buildModel();
  const invalid = resolveRuntimeExecutiveStageExperience({
    planId: "",
    model,
    selectionSubjectId: "object.factory",
    source: "executive",
  });
  assert.equal(invalid.status, "invalid");
  assert.equal(invalid.validation.ok, false);
  assert.ok(invalid.validation.issues.includes("missing-plan-id"));

  const unknown = validateRuntimeExecutiveStageExperiencePlatformInput({
    planId: "plan.x",
    model,
    selectionSubjectId: "missing.subject",
    source: "executive",
  });
  assert.equal(unknown.ok, false);
  assert.ok(unknown.issues.includes("unknown-selection-subject"));

  const subjectsRef = model.subjects;
  resolveFactoryExperience();
  assert.equal(model.subjects, subjectsRef);
  assert.ok(Object.isFrozen(model));
});

test("10. no renderer / KPI / React / Three.js behavior", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\b(ReactNode|HTMLElement|document\.|window\.)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:render|animate|calculateKpi|calculateKoi|fetch)[A-Za-z0-9_]*\b/,
  );
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.calculatesKpi, false);
  assert.equal(boundary.calculatesKoi, false);
  assert.equal(boundary.orchestrationAuthorityRemainsRex26, true);
  assert.equal(platform.orchestration.remainsOrchestrationAuthority, true);
  assert.ok(
    capabilities.includes("stage-orchestration") &&
      capabilities.includes("experience-plan"),
  );
  assert.deepEqual(
    [...getRuntimeExecutiveStageExperiencePlatformCapabilities()],
    [...capabilities],
  );
});

test("11. registry counts and upstream regressions", () => {
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.sectionCount, sections.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);

  const verification = verifyRuntimeExecutiveStageExperiencePlatform();
  assert.equal(verification.ok, true);
  assert.equal(verification.orchestrationBoundaryIntact, true);
  assert.equal(verification.platformOnly, true);

  assert.equal(verifyRuntimeExecutiveStageExperienceOrchestration().ok, true);
  assert.equal(verifyRuntimeExecutiveStagePresentationAttention().ok, true);
  assert.equal(verifyRuntimeExecutiveStageFocusSelection().ok, true);
  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
