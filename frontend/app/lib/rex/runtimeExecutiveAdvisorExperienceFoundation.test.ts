import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS as actionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS as attentionLevels,
  RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS as confidenceLevels,
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT as emptyContext,
  RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES as engagementStates,
  RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS as guidanceIntents,
  RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES as informationDensities,
  RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS as provenanceKinds,
  RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS as stageRelationships,
  RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS as urgencyLevels,
  createRuntimeExecutiveAdvisorActionAffordance,
  createRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorEmptyContext,
  createRuntimeExecutiveAdvisorProvenance,
  createRuntimeExecutiveAdvisorSnapshot,
  createRuntimeExecutiveAdvisorSubject,
  getRuntimeExecutiveAdvisorExperienceFoundationIdentity,
  isRuntimeExecutiveAdvisorContextual,
  isRuntimeExecutiveAdvisorGuidanceReady,
  mapRuntimeExecutiveStageAttentionToAdvisorAttention,
  normalizeRuntimeExecutiveAdvisorActionAffordances,
  normalizeRuntimeExecutiveAdvisorContext,
  runtimeExecutiveAdvisorExperienceFoundation as foundation,
  runtimeExecutiveAdvisorExperienceFoundationApiNames as apiNames,
  runtimeExecutiveAdvisorExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorExperienceFoundationRegistry as registry,
  validateRuntimeExecutiveAdvisorContext,
  validateRuntimeExecutiveAdvisorSnapshot,
  verifyRuntimeExecutiveAdvisorExperienceFoundation,
} from "./runtimeExecutiveAdvisorExperienceFoundation.ts";

import {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS,
  runtimeExecutiveStageExperiencePublicIndexIdentity,
  runtimeExecutiveStageExperiencePublicIndexSupportedImportPath,
  verifyRuntimeExecutiveStageExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveAdvisorExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

function factorySubject(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveAdvisorSubject>[0]>,
) {
  return createRuntimeExecutiveAdvisorSubject({
    id: "object.factory",
    kind: "nexora-object",
    label: "Factory",
    sourceId: "stage.object.factory",
    ...overrides,
  });
}

function factoryContext(
  overrides?: Parameters<typeof createRuntimeExecutiveAdvisorContext>[0],
) {
  return createRuntimeExecutiveAdvisorContext({
    subject: factorySubject(),
    engagement: "engaged",
    intent: "investigate",
    attention: "elevated",
    presentationState: "report",
    informationDensity: "balanced",
    confidence: "medium",
    urgency: "low",
    stageRelationship: "selected-subject",
    provenance: [
      createRuntimeExecutiveAdvisorProvenance({
        kind: "stage-selection",
        sourceId: "object.factory",
        reason: "manager selected Factory on Stage",
      }),
    ],
    actionAffordances: [
      createRuntimeExecutiveAdvisorActionAffordance({
        id: "act.inspect",
        kind: "inspect",
        label: "Inspect",
        subjectId: "object.factory",
      }),
      createRuntimeExecutiveAdvisorActionAffordance({
        id: "act.explain",
        kind: "explain",
        label: "Explain",
        subjectId: "object.factory",
      }),
      createRuntimeExecutiveAdvisorActionAffordance({
        id: "act.trace",
        kind: "trace",
        label: "Trace",
        subjectId: "object.factory",
      }),
      createRuntimeExecutiveAdvisorActionAffordance({
        id: "act.open-scenario",
        kind: "open-scenario",
        label: "Open Scenario",
      }),
    ],
    ...overrides,
  });
}

test("1. exact REX-3:1 identity / version / namespace / layer / domain / phase", () => {
  assert.equal(
    foundation.identity,
    "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation",
  );
  assert.equal(foundation.version, "3.1.0");
  assert.equal(foundation.namespace, "nexora.rex.advisor-experience.foundation");
  assert.equal(foundation.layer, "RuntimeExecutiveExperience");
  assert.equal(foundation.domain, "ExecutiveAdvisor");
  assert.equal(foundation.phase, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
  assert.deepEqual(
    getRuntimeExecutiveAdvisorExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:9 public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeExecutiveStageExperiencePublicIndexIdentity,
  );
  assert.equal(
    foundation.dependencyPath,
    runtimeExecutiveStageExperiencePublicIndexSupportedImportPath,
  );
  assert.equal(
    foundation.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex",
  ]);
});

test("3. no direct REX-2 internals / REX-1 / EX-DRI / DRI / NOL imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:ExperienceFoundation|ExperienceContracts|Model|FocusSelection|PresentationAttention|ExperienceOrchestration|ExperiencePlatform|ExperienceCertificationFreeze)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding|Platform|CertificationFreeze|PublicIndex)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(boundary.importsRex2InternalDirectly, false);
  assert.equal(boundary.importsRex1Directly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("4. canonical subject kinds and no KOR", () => {
  assert.deepEqual([...subjectKinds], [
    "workspace",
    "goal",
    "nexora-object",
    "kpi",
    "koi",
    "problem",
    "scenario",
    "decision",
    "execution",
    "pack",
    "connection",
    "scene",
  ]);
  assert.ok(![...subjectKinds].includes("kor" as never));
  assert.ok(!actionKinds.includes("kor" as never));
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.subjectKindCount, 12);
});

test("5. engagement / guidance intent / attention / presentation / density", () => {
  assert.deepEqual([...engagementStates], ["idle", "aware", "engaged", "guiding"]);
  assert.deepEqual([...guidanceIntents], [
    "observe",
    "explain",
    "inspect",
    "compare",
    "investigate",
    "evaluate",
    "recommend",
    "decide",
    "act",
  ]);
  assert.deepEqual([...attentionLevels], [
    "ambient",
    "normal",
    "elevated",
    "critical",
  ]);
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.deepEqual([...informationDensities], [
    "compact",
    "balanced",
    "expanded",
  ]);
  // Density independent of presentation.
  const compactReport = createRuntimeExecutiveAdvisorContext({
    subject: factorySubject(),
    engagement: "engaged",
    presentationState: "report",
    informationDensity: "compact",
  });
  const expandedReport = createRuntimeExecutiveAdvisorContext({
    subject: factorySubject(),
    engagement: "engaged",
    presentationState: "report",
    informationDensity: "expanded",
  });
  assert.equal(compactReport.presentationState, "report");
  assert.equal(compactReport.informationDensity, "compact");
  assert.equal(expandedReport.informationDensity, "expanded");
});

test("6. confidence / urgency / provenance / stage relationship / action kinds", () => {
  assert.deepEqual([...confidenceLevels], ["unknown", "low", "medium", "high"]);
  assert.deepEqual([...urgencyLevels], [
    "none",
    "low",
    "medium",
    "high",
    "immediate",
  ]);
  assert.deepEqual([...provenanceKinds], [
    "runtime-context",
    "stage-focus",
    "stage-selection",
    "scene",
    "interaction",
    "attention",
    "presentation-state",
    "explicit-manager-intent",
  ]);
  assert.deepEqual([...stageRelationships], [
    "none",
    "observing",
    "focused-subject",
    "selected-subject",
    "related-subject",
  ]);
  assert.deepEqual([...actionKinds], [
    "inspect",
    "focus",
    "explain",
    "compare",
    "trace",
    "open-scenario",
    "open-decision",
    "open-execution",
    "show-related",
    "dismiss",
  ]);

  // Urgency independent of attention.
  const strategic = createRuntimeExecutiveAdvisorContext({
    subject: factorySubject(),
    engagement: "engaged",
    attention: "elevated",
    urgency: "low",
  });
  assert.equal(strategic.attention, "elevated");
  assert.equal(strategic.urgency, "low");
});

test("7. subject / context / snapshot construction and Factory example", () => {
  const subject = factorySubject();
  assert.equal(subject.id, "object.factory");
  assert.equal(subject.kind, "nexora-object");
  assert.equal(subject.label, "Factory");
  assert.equal(Object.isFrozen(subject), true);

  const context = factoryContext();
  assert.equal(context.subject?.id, "object.factory");
  assert.equal(context.engagement, "engaged");
  assert.equal(context.intent, "investigate");
  assert.equal(context.attention, "elevated");
  assert.equal(context.presentationState, "report");
  assert.equal(context.stageRelationship, "selected-subject");
  assert.equal(context.actionAffordances.length, 4);
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.actionAffordances), true);

  const snapshot = createRuntimeExecutiveAdvisorSnapshot({ context });
  assert.equal(snapshot.activeSubjectId, "object.factory");
  assert.equal(snapshot.isContextual, true);
  assert.equal(snapshot.isGuidanceReady, true);
  assert.equal(
    snapshot.foundationIdentity,
    "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation",
  );
  assert.equal(snapshot.foundationVersion, "3.1.0");
  assert.equal(Object.isFrozen(snapshot), true);

  // Related-subject relationship remains representable.
  const related = factoryContext({
    subject: createRuntimeExecutiveAdvisorSubject({
      id: "object.delivery",
      kind: "nexora-object",
      label: "Delivery",
    }),
    stageRelationship: "related-subject",
  });
  assert.equal(related.stageRelationship, "related-subject");
  assert.equal(related.subject?.id, "object.delivery");
});

test("8. default / empty Advisor foundation state", () => {
  assert.equal(emptyContext.subject, null);
  assert.equal(emptyContext.engagement, "idle");
  assert.equal(emptyContext.intent, "observe");
  assert.equal(emptyContext.attention, "ambient");
  assert.equal(emptyContext.presentationState, "minimum");
  assert.equal(emptyContext.informationDensity, "compact");
  assert.equal(emptyContext.confidence, "unknown");
  assert.equal(emptyContext.urgency, "none");
  assert.equal(emptyContext.stageRelationship, "none");
  assert.deepEqual(emptyContext.provenance, []);
  assert.deepEqual(emptyContext.actionAffordances, []);
  assert.equal(createRuntimeExecutiveAdvisorEmptyContext(), emptyContext);
  assert.equal(Object.isFrozen(emptyContext), true);

  const defaultContext = createRuntimeExecutiveAdvisorContext();
  assert.deepEqual(defaultContext, emptyContext);
});

test("9. contextual-awareness and guidance-readiness predicates", () => {
  assert.equal(isRuntimeExecutiveAdvisorContextual(emptyContext), false);
  assert.equal(isRuntimeExecutiveAdvisorGuidanceReady(emptyContext), false);

  const awareOnly = createRuntimeExecutiveAdvisorContext({
    subject: factorySubject(),
    engagement: "aware",
  });
  assert.equal(isRuntimeExecutiveAdvisorContextual(awareOnly), true);
  assert.equal(isRuntimeExecutiveAdvisorGuidanceReady(awareOnly), false);

  const engaged = factoryContext({ engagement: "engaged" });
  assert.equal(isRuntimeExecutiveAdvisorContextual(engaged), true);
  assert.equal(isRuntimeExecutiveAdvisorGuidanceReady(engaged), true);

  const guiding = factoryContext({ engagement: "guiding" });
  assert.equal(isRuntimeExecutiveAdvisorGuidanceReady(guiding), true);

  // guiding does not generate advice text in this layer.
  assert.doesNotMatch(source, /capacity is causing delivery risk/i);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bfetch\s*\(/i);
});

test("10. validation coverage including duplicate actions and empty ids", () => {
  const valid = validateRuntimeExecutiveAdvisorContext(factoryContext());
  assert.equal(valid.ok, true);
  assert.equal(valid.issues.length, 0);

  const invalidSubject = validateRuntimeExecutiveAdvisorContext({
    ...factoryContext(),
    subject: { id: "", kind: "nexora-object", label: "Factory" },
  });
  assert.equal(invalidSubject.ok, false);
  assert.ok(invalidSubject.issues.some((entry) => entry.code === "invalid-subject-id"));

  const invalidKind = validateRuntimeExecutiveAdvisorContext({
    ...factoryContext(),
    subject: { id: "x", kind: "kor", label: "Bad" },
  });
  assert.equal(invalidKind.ok, false);
  assert.ok(invalidKind.issues.some((entry) => entry.code === "invalid-subject-kind"));

  const duplicateActions = validateRuntimeExecutiveAdvisorContext({
    ...factoryContext(),
    actionAffordances: [
      {
        id: "dup",
        kind: "inspect",
        label: "A",
        enabled: true,
      },
      {
        id: "dup",
        kind: "explain",
        label: "B",
        enabled: true,
      },
    ],
  });
  assert.equal(duplicateActions.ok, false);
  assert.ok(
    duplicateActions.issues.some((entry) => entry.code === "duplicate-action-id"),
  );

  assert.throws(() =>
    normalizeRuntimeExecutiveAdvisorActionAffordances([
      {
        id: "dup",
        kind: "inspect",
        label: "A",
        enabled: true,
      },
      {
        id: "dup",
        kind: "explain",
        label: "B",
        enabled: true,
      },
    ]),
  );

  assert.throws(() =>
    createRuntimeExecutiveAdvisorSubject({
      id: "",
      kind: "goal",
      label: "Goal",
    }),
  );

  const badSnapshot = validateRuntimeExecutiveAdvisorSnapshot({
    context: factoryContext(),
    activeSubjectId: "wrong",
    isContextual: true,
    isGuidanceReady: true,
    foundationIdentity: foundation.identity,
    foundationVersion: foundation.version,
  });
  assert.equal(badSnapshot.ok, false);
});

test("11. deterministic behavior and source immutability", () => {
  const affordances = Object.freeze([
    Object.freeze({
      id: "act.inspect",
      kind: "inspect" as const,
      label: "Inspect",
      enabled: true,
      subjectId: "object.factory",
    }),
    Object.freeze({
      id: "act.explain",
      kind: "explain" as const,
      label: "Explain",
      enabled: true,
    }),
  ]);
  const provenance = Object.freeze([
    Object.freeze({
      kind: "stage-selection" as const,
      sourceId: "object.factory",
      reason: "selected",
    }),
  ]);
  const input = Object.freeze({
    subject: Object.freeze({
      id: "object.factory",
      kind: "nexora-object" as const,
      label: "Factory",
    }),
    engagement: "engaged" as const,
    intent: "investigate" as const,
    attention: "elevated" as const,
    presentationState: "report" as const,
    informationDensity: "balanced" as const,
    confidence: "medium" as const,
    urgency: "low" as const,
    stageRelationship: "selected-subject" as const,
    provenance,
    actionAffordances: affordances,
  });
  const before = JSON.stringify(input);
  const a = normalizeRuntimeExecutiveAdvisorContext(input);
  const b = normalizeRuntimeExecutiveAdvisorContext(input);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(a, b);

  const snapA = createRuntimeExecutiveAdvisorSnapshot({ context: a });
  const snapB = createRuntimeExecutiveAdvisorSnapshot({ context: a });
  assert.deepEqual(snapA, snapB);

  assert.deepEqual(
    normalizeRuntimeExecutiveAdvisorActionAffordances(affordances).map(
      (entry) => entry.id,
    ),
    ["act.inspect", "act.explain"],
  );
});

test("12. registry order, dynamically derived counts, capabilities", () => {
  assert.deepEqual([...registrySections], [
    "Identity",
    "SubjectKinds",
    "EngagementStates",
    "GuidanceIntents",
    "AttentionLevels",
    "PresentationStates",
    "InformationDensities",
    "ConfidenceLevels",
    "UrgencyLevels",
    "ProvenanceKinds",
    "StageRelationships",
    "ActionKinds",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.sectionCount, 13);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.engagementStateCount, engagementStates.length);
  assert.equal(registry.guidanceIntentCount, guidanceIntents.length);
  assert.equal(registry.attentionLevelCount, attentionLevels.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.informationDensityCount, informationDensities.length);
  assert.equal(registry.confidenceLevelCount, confidenceLevels.length);
  assert.equal(registry.urgencyLevelCount, urgencyLevels.length);
  assert.equal(registry.provenanceKindCount, provenanceKinds.length);
  assert.equal(registry.stageRelationshipCount, stageRelationships.length);
  assert.equal(registry.actionKindCount, actionKinds.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);

  assert.ok(capabilities.includes("advisor-subject-modeling"));
  assert.ok(capabilities.includes("guidance-readiness"));
  assert.ok(capabilities.includes("contextual-awareness"));
  assert.ok(capabilities.includes("foundation-validation"));
  assert.equal(capabilities.length, 15);
});

test("13. upstream REX-2 compatibility and Stage attention mapping", () => {
  assert.equal(
    presentationStates,
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  );
  assert.deepEqual(
    [...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS],
    ["normal", "informational", "elevated", "warning", "critical"],
  );
  assert.equal(
    mapRuntimeExecutiveStageAttentionToAdvisorAttention("elevated"),
    "elevated",
  );
  assert.equal(
    mapRuntimeExecutiveStageAttentionToAdvisorAttention("critical"),
    "critical",
  );
  assert.equal(
    mapRuntimeExecutiveStageAttentionToAdvisorAttention("warning"),
    "elevated",
  );
  assert.equal(
    mapRuntimeExecutiveStageAttentionToAdvisorAttention("informational"),
    "normal",
  );
  assert.equal(
    mapRuntimeExecutiveStageAttentionToAdvisorAttention("normal"),
    "ambient",
  );
  assert.equal(boundary.ownsStageExperience, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(
    foundation.responsibilitySeparation.advisorIsNotSecondDirector,
    true,
  );
  assert.equal(verifyRuntimeExecutiveStageExperienceConsumerEntry().ok, true);
});

test("14. absence of side effects / AI / UI / Stage mutation surfaces", () => {
  assert.equal(boundary.introducesLlmGeneration, false);
  assert.equal(boundary.introducesChatBehavior, false);
  assert.equal(boundary.introducesActionExecution, false);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.equal(foundation.sideEffectFree, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']zustand["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect|createStore)\s*\(/);
  assert.doesNotMatch(source, /document\.|window\.|localStorage|fetch\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.ok(foundation.forbiddenResponsibilities.includes("LLM calls"));
  assert.ok(foundation.forbiddenResponsibilities.includes("Advisor chat"));
  assert.ok(foundation.forbiddenResponsibilities.includes("Stage mutation"));
  assert.ok(foundation.forbiddenResponsibilities.includes("action execution"));
});

test("15. verification / readiness for REX-3:2", () => {
  const verification = verifyRuntimeExecutiveAdvisorExperienceFoundation();
  assert.equal(verification.ok, true);
  assert.equal(verification.identity, foundation.identity);
  assert.equal(verification.version, "3.1.0");
  assert.equal(verification.publicIndexBoundaryIntact, true);
  assert.equal(verification.reusesUpstreamPresentationStates, true);
  assert.equal(verification.upstreamConsumerEntryOk, true);
  assert.equal(verification.noKor, true);
  assert.equal(verification.aiProviderIndependent, true);
  assert.equal(verification.rendererIndependent, true);
  assert.equal(verification.subjectKindCount, 12);
  assert.equal(verification.engagementStateCount, 4);
  assert.equal(verification.guidanceIntentCount, 9);
  assert.equal(verification.attentionLevelCount, 4);
  assert.equal(verification.presentationStateCount, 3);
  assert.equal(verification.informationDensityCount, 3);
  assert.equal(verification.confidenceLevelCount, 4);
  assert.equal(verification.urgencyLevelCount, 5);
  assert.equal(verification.provenanceKindCount, 8);
  assert.equal(verification.stageRelationshipCount, 5);
  assert.equal(verification.actionKindCount, 10);
  assert.equal(verification.capabilityCount, 15);
  assert.equal(verification.sectionCount, 13);
  assert.match(
    foundation.architecturalStatus,
    /Ready for REX-3:2 Advisor Context & Subject Binding/,
  );
});
