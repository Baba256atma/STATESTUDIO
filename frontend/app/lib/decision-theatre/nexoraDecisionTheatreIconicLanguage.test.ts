/**
 * DTH:2 — Executive vs Iconic Object language tests.
 * Does not replace DTH:1, Stage, Director, Manager–Object, or NEX-EXP tests.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { composeNexoraSemanticTurn } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NexoraDecisionTheatreIconicSatellite } from "../../executive/nex-mvp/stage/NexoraDecisionTheatreIconicSatellites.tsx";
import {
  NEXORA_DECISION_THEATRE_DTH2_GOAL_OBJECT_FIXTURE,
  NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
  NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE,
  NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST,
  NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_TIME,
} from "./nexoraDecisionTheatreIconicFixtures.ts";
import {
  NEXORA_DECISION_THEATRE_ICONIC_REGISTRY,
  NEXORA_DECISION_THEATRE_ICONIC_ROLES,
} from "./nexoraDecisionTheatreIconicRegistry.ts";
import {
  iconicIdsPolluteExecutiveSurface,
  iconicValueHonestlyRepresentable,
} from "./nexoraDecisionTheatreIconicProjection.ts";
import {
  classifyNexoraDecisionTheatreVisualFamily,
  deriveNexoraDecisionTheatreIconicPresentationId,
  isNexoraDecisionTheatreIconicPresentationId,
  NEXORA_DECISION_THEATRE_DATA_ID_PREFIX,
  NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX,
  NEXORA_DECISION_THEATRE_VISUAL_FAMILIES,
  nexoraDecisionTheatreVisualLanguageIdentity,
  resolveCanonicalExecutiveObjectType,
} from "./nexoraDecisionTheatreVisualFamily.ts";
import {
  evaluateNexoraDecisionTheatreInvariants,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function catalogWithGoal(): NexoraMVPObjectInteractionCatalog {
  return {
    objects: Object.freeze([...catalog.objects, NEXORA_DECISION_THEATRE_DTH2_GOAL_OBJECT_FIXTURE]),
    relationships: catalog.relationships,
    contextSubjects: catalog.contextSubjects,
    contextLinks: catalog.contextLinks,
  };
}

function project(
  state: NexoraMVPObjectInteractionState,
  extra?: {
    readonly catalog?: NexoraMVPObjectInteractionCatalog;
    readonly sources?: Parameters<typeof projectNexoraDecisionTheatreFoundation>[0]["iconicAuthoritativeSources"];
    readonly utterance?: string;
  },
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog: extra?.catalog ?? catalog,
    iconicAuthoritativeSources: extra?.sources,
    managerQuestion: extra?.utterance ?? null,
  });
}

function scene(state: NexoraMVPObjectInteractionState, useCatalog = catalog) {
  return deriveNexoraMVPStageInteractionPresentation(state, useCatalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

test("visual families are explicit, immutable, and independent of renderer cues", () => {
  assert.deepEqual([...NEXORA_DECISION_THEATRE_VISUAL_FAMILIES], ["EXECUTIVE_OBJECT", "ICONIC_OBJECT", "DATA_OBJECT"]);
  assert.equal(classifyNexoraDecisionTheatreVisualFamily({ id: "obj-risk" }), "EXECUTIVE_OBJECT");
  assert.equal(
    classifyNexoraDecisionTheatreVisualFamily({
      id: deriveNexoraDecisionTheatreIconicPresentationId({
        ownerExecutiveObjectId: "ctx-scenario-capacity",
        role: "cost",
        sourceRef: "src",
      }),
    }),
    "ICONIC_OBJECT",
  );
  assert.equal(
    classifyNexoraDecisionTheatreVisualFamily({ id: `${NEXORA_DECISION_THEATRE_DATA_ID_PREFIX}overview:csv` }),
    "DATA_OBJECT",
  );
  assert.equal(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("executive-versus-iconic-object-language"), true);
  assert.equal(nexoraDecisionTheatreVisualLanguageIdentity, "DTH:2/ExecutiveAndIconicObjectLanguage");
});

test("Goal, Problem, Scenario, Decision, and Execution remain Executive Objects", () => {
  const withGoal = catalogWithGoal();
  const goal = project(selectNexoraMVPInteractionSubject(initial(), "obj-goal", withGoal), { catalog: withGoal });
  const problem = project(selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog));
  const scenario = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog));
  const decision = project(selectNexoraMVPInteractionSubject(initial(), "ctx-decision-capacity", catalog));
  const execution = project(selectNexoraMVPInteractionSubject(initial(), "ctx-execution-capacity", catalog));
  assert.equal(goal.visibleExecutiveObjects.find((item) => item.id === "obj-goal")?.visualFamily, "EXECUTIVE_OBJECT");
  assert.equal(resolveCanonicalExecutiveObjectType({ id: "obj-goal", kind: "object", label: "Margin Recovery Goal" }), "goal");
  assert.equal(problem.visibleExecutiveObjects.find((item) => item.id === "ctx-problem-margin")?.canonicalObjectType, "problem");
  assert.equal(scenario.visibleExecutiveObjects.find((item) => item.id === "ctx-scenario-capacity")?.canonicalObjectType, "scenario");
  assert.equal(decision.visibleExecutiveObjects.find((item) => item.id === "ctx-decision-capacity")?.canonicalObjectType, "decision");
  assert.equal(execution.visibleExecutiveObjects.find((item) => item.id === "ctx-execution-capacity")?.canonicalObjectType, "execution");
  for (const theatre of [goal, problem, scenario, decision, execution]) {
    assert.equal(theatre.iconicObjects.length, 0);
    assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
  }
});

test("supported Cost, Time, Evidence, Uncertainty, and Reversibility attach to a Scenario", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const theatre = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  const roles = theatre.iconicObjects.map((item) => item.role);
  for (const role of ["cost", "time", "evidence", "uncertainty", "reversibility"] as const) {
    const iconic = theatre.iconicObjects.find((item) => item.role === role);
    assert.ok(iconic, `missing ${role}`);
    assert.equal(iconic?.ownerExecutiveObjectId, NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER);
    assert.equal(iconic?.visualFamily, "ICONIC_OBJECT");
    assert.equal(isNexoraDecisionTheatreIconicPresentationId(iconic?.presentationId ?? ""), true);
    assert.equal(catalog.objects.some((item) => item.id === iconic?.presentationId), false);
    assert.equal(catalog.contextSubjects.some((item) => item.id === iconic?.presentationId), false);
  }
  assert.equal(theatre.iconicObjects.find((item) => item.role === "time")?.valueKind, "time-to-impact");
  assert.equal(theatre.iconicObjects.find((item) => item.role === "uncertainty")?.unknown, true);
  assert.equal(theatre.iconicObjects.find((item) => item.role === "uncertainty")?.value, null);
  assert.equal(theatre.iconicObjects.find((item) => item.role === "reversibility")?.value, "PARTIAL");
  assert.equal(theatre.iconicObjects.find((item) => item.role === "reversibility")?.provenance, "scenario-expectation");
  assert.ok(!roles.includes("confidence"));
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});

test("iconic IDs are stable, prefixed, and do not collide with Executive Object IDs", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const first = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  const second = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  assert.deepEqual(
    first.iconicObjects.map((item) => item.presentationId),
    second.iconicObjects.map((item) => item.presentationId),
  );
  for (const iconic of first.iconicObjects) {
    assert.equal(iconic.presentationId.startsWith(NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX), true);
    assert.equal(first.visibleExecutiveObjects.some((item) => item.id === iconic.presentationId), false);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(first.iconicObjects)), JSON.parse(JSON.stringify(second.iconicObjects)));
});

test("iconic objects do not enter Queue, collections, navigation, or one-hop topology", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const beforeScene = scene(focused);
  const theatre = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  const afterScene = scene(focused);
  const iconicIds = theatre.iconicObjects.map((item) => item.presentationId);
  const queueIds = (afterScene.queueEntries ?? []).flatMap((entry) => entry.objectIds);
  const queueCounts = (afterScene.queueEntries ?? []).map((entry) => `${entry.category}:${entry.count}`);
  const emptyCounts = (beforeScene.queueEntries ?? []).map((entry) => `${entry.category}:${entry.count}`);
  assert.deepEqual(queueCounts, emptyCounts);
  const collectionIds = focused.collectionContext?.objectIds ?? [];
  const trailIds = focused.stage2dNavigationTrail.objectIds;
  const relatedIds = afterScene.scene.connections.flatMap((item) => [item.sourceId, item.targetId, item.id]);
  assert.deepEqual(
    iconicIdsPolluteExecutiveSurface({
      iconicObjects: theatre.iconicObjects,
      executiveIds: theatre.visibleExecutiveObjects.map((item) => item.id),
      queueObjectIds: queueIds,
      collectionObjectIds: collectionIds,
      navigationObjectIds: trailIds,
      relatedObjectIds: relatedIds,
    }),
    [],
  );
  assert.deepEqual(
    afterScene.scene.connections.map((item) => item.id),
    beforeScene.scene.connections.map((item) => item.id),
  );
  assert.equal(trailIds.some((id) => iconicIds.includes(id)), false);
  assert.equal(theatre.writes.queueMembership, false);
  assert.equal(theatre.writes.navigationTrail, false);
  assert.equal(theatre.writes.topology, false);
  assert.equal(theatre.writes.canonicalObjects, false);
});

test("canonical Risk remains an Executive Object and is not replaced by an icon", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-risk", catalog);
  const theatre = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  const risk = theatre.visibleExecutiveObjects.find((item) => item.id === "obj-risk");
  assert.equal(risk?.visualFamily, "EXECUTIVE_OBJECT");
  assert.equal(risk?.canonicalObjectType, "risk");
  assert.equal(theatre.iconicObjects.some((item) => item.ownerExecutiveObjectId === "obj-risk"), false);
  assert.equal(theatre.visibleExecutiveObjects.some((item) => item.id === "obj-risk"), true);
});

test("unsupported cost and time are not displayed as zero; missing evidence is not low confidence", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  assert.equal(iconicValueHonestlyRepresentable(NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST), false);
  assert.equal(iconicValueHonestlyRepresentable(NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_TIME), false);
  const theatre = project(focused, {
    sources: [
      NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST,
      NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_TIME,
      NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE,
    ],
  });
  assert.equal(theatre.iconicObjects.some((item) => item.role === "cost"), false);
  assert.equal(theatre.iconicObjects.some((item) => item.role === "time"), false);
  const evidence = theatre.iconicObjects.find((item) => item.role === "evidence");
  assert.equal(evidence?.missing, true);
  assert.equal(evidence?.value, null);
  assert.equal(evidence?.mustNotInterpretAs.includes("low confidence"), true);
});

test("manager-reported provenance remains manager-reported", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const theatre = project(focused, { sources: [NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST] });
  const cost = theatre.iconicObjects.find((item) => item.role === "cost");
  assert.equal(cost?.provenance, "manager-reported-observation");
  assert.equal(theatre.advisorReadable.iconicObjects[0]?.authoritativeSource.includes("manager reported"), true);
});

test("removing the owner removes its Iconic Objects; empty support preserves Stage", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const withIconics = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  assert.ok(withIconics.iconicObjects.length > 0);
  const other = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const afterOwnerGone = project(other, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  assert.equal(afterOwnerGone.iconicObjects.length, 0);
  const empty = project(focused);
  const before = scene(focused);
  const after = scene(focused);
  assert.equal(empty.iconicObjects.length, 0);
  assert.equal(empty.visualLanguage.iconicProjectionIdentity, "none");
  assert.deepEqual(
    before.scene.objects.map((item) => item.id),
    after.scene.objects.map((item) => item.id),
  );
});

test("iconic semantic registry is complete and prohibits decorative empty roles", () => {
  assert.deepEqual([...NEXORA_DECISION_THEATRE_ICONIC_ROLES], [
    "cost",
    "time",
    "evidence",
    "confidence",
    "uncertainty",
    "reversibility",
    "capacity",
    "goal-impact",
  ]);
  for (const role of NEXORA_DECISION_THEATRE_ICONIC_ROLES) {
    const definition = NEXORA_DECISION_THEATRE_ICONIC_REGISTRY[role];
    assert.ok(definition.managerReadableName);
    assert.ok(definition.prohibitedInterpretations.length > 0);
    assert.ok(definition.rendererIconToken.startsWith("iconic-"));
    assert.ok(definition.permittedValueKinds.includes("unknown"));
  }
  assert.ok(NEXORA_DECISION_THEATRE_ICONIC_REGISTRY.time.permittedValueKinds.includes("deadline"));
  assert.ok(NEXORA_DECISION_THEATRE_ICONIC_REGISTRY.time.permittedValueKinds.includes("time-to-impact"));
  assert.ok(NEXORA_DECISION_THEATRE_ICONIC_REGISTRY.cost.prohibitedInterpretations.includes("profit"));
});

test("Advisor-readable iconic context stays truthful and free of architecture codes", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const theatre = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  const text = JSON.stringify(theatre.advisorReadable);
  assert.doesNotMatch(text, /DTH:2|DTH:1|DIR:1|NEX-MVP|NexoGraph/);
  assert.ok(theatre.advisorReadable.iconicObjects.length > 0);
  assert.ok(theatre.advisorReadable.iconicObjects.every((item) => item.ownerLabel.length > 0));
});

test("renderer family distinction is semantic and iconic click does not select the owner", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const theatre = project(focused, { sources: [NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST] });
  const iconic = theatre.iconicObjects[0];
  assert.ok(iconic);
  const html = renderToStaticMarkup(React.createElement(NexoraDecisionTheatreIconicSatellite, { iconic }));
  assert.match(html, /data-visual-family="iconic-object"/);
  assert.match(html, /data-iconic-owner="ctx-scenario-capacity"/);
  assert.match(html, /aria-label=/);
  assert.doesNotMatch(html, /nexora-stage-object-control/);
});

test("unsupported role, missing source, and invalid relationship attachment are rejected", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const relationships = project(focused).relationships;
  const validRelationshipId = relationships[0]?.id ?? null;
  const base = NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST;
  const unsupportedRole = project(focused, {
    sources: [{ ...base, role: "profit" as typeof base.role, sourceRef: "fixture-unsupported-role" }],
  });
  assert.equal(unsupportedRole.iconicObjects.length, 0);
  const missingSource = project(focused, {
    sources: [{ ...base, sourceAuthority: "", sourceRef: "fixture-empty-authority" }],
  });
  assert.equal(missingSource.iconicObjects.length, 0);
  const invalidRelationship = project(focused, {
    sources: [{ ...base, relationshipId: "rel-not-in-scene", sourceRef: "fixture-invalid-rel" }],
  });
  assert.equal(invalidRelationship.iconicObjects.length, 0);
  if (validRelationshipId != null) {
    const attached = project(focused, {
      sources: [{ ...base, relationshipId: validRelationshipId, sourceRef: "fixture-valid-rel" }],
    });
    assert.equal(attached.iconicObjects.length, 1);
    assert.equal(attached.iconicObjects[0]?.relationshipId, validRelationshipId);
  }
});

test("Iconic projection does not mutate domain state, breadcrumbs, or catalog membership", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER, catalog);
  const before = JSON.stringify(focused);
  const beforeCatalog = JSON.stringify({
    objects: catalog.objects.map((item) => item.id),
    subjects: catalog.contextSubjects.map((item) => item.id),
  });
  const theatre = project(focused, { sources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(
    JSON.stringify({
      objects: catalog.objects.map((item) => item.id),
      subjects: catalog.contextSubjects.map((item) => item.id),
    }),
    beforeCatalog,
  );
  assert.equal(Object.isFrozen(theatre), true);
  assert.equal(Object.isFrozen(theatre.iconicObjects), true);
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.writes.outcome, false);
  assert.equal(theatre.writes.learning, false);
  assert.equal(theatre.writes.evidence, false);
  const iconicIds = theatre.iconicObjects.map((item) => item.presentationId);
  assert.equal(focused.trail.some((item) => iconicIds.includes(item.id)), false);
  assert.equal(focused.stage2dNavigationTrail.objectIds.some((id) => iconicIds.includes(id)), false);
  const capacityOwner = selectNexoraMVPInteractionSubject(initial(), "obj-capacity", catalog);
  const capacityIconic = project(capacityOwner, {
    sources: [{
      ...NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
      ownerExecutiveObjectId: "obj-capacity",
      role: "capacity",
      valueKind: "capacity-demand",
      sourceRef: "fixture-capacity-on-kpi",
      managerReadableLabel: "Capacity",
    }],
  });
  assert.equal(capacityIconic.iconicObjects.length, 0);
  assert.equal(
    capacityIconic.visibleExecutiveObjects.find((item) => item.id === "obj-capacity")?.visualFamily,
    "EXECUTIVE_OBJECT",
  );
});

test("DTH:1 Stage click, Advisor read, and conversation remain unchanged without iconic sources", () => {
  const clicked = selectNexoraMVPInteractionSubject(initial(), "obj-capacity", catalog);
  const theatre = project(clicked);
  assert.equal(theatre.primaryExecutiveObjectId, "obj-capacity");
  assert.equal(theatre.iconicObjects.length, 0);
  const explain = executeNexoraConversationalExperience({
    utterance: "Explain it",
    conversationContext: Object.freeze({
      currentSubjectId: clicked.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: clicked.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: clicked,
    catalog,
    messageIdSeed: "dth2-explain",
  });
  assert.equal(explain.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(explain.decisionTheatre?.iconicObjects.length, 0);
  const semantic = composeNexoraSemanticTurn({ utterance: "show problems", catalog });
  const plan = directNexoraPresentation({
    owner: semantic.owner,
    presentationRequest: "COLLECTION",
    primaryReference: semantic.references.primary,
    references: semantic.references.references,
    collectionKind: "problem",
    collectionScope: semantic.diagnostics.collectionScope,
    collectionMembers: semantic.canonicalCollectionMembers,
    currentStage: initial(),
  });
  const stage = applyDirectorPlanToStage({ plan, state: initial(), catalog });
  assert.deepEqual(stage.collectionContext?.objectIds, ["ctx-problem-capacity", "ctx-problem-margin"]);
  assert.equal(project(stage).iconicObjects.length, 0);
});
