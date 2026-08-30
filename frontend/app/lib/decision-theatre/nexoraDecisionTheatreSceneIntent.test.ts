/**
 * DTH:5 — Scene Intent and Scene Script tests.
 * Consumes resolved canonical inputs. Does not replace NLU, Director, or Stage tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { composeNexoraSemanticTurn } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES } from "./nexoraDecisionTheatreIconicFixtures.ts";
import {
  composeNexoraDecisionTheatreSceneScript,
  emptyNexoraDecisionTheatreSceneSemanticInput,
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLES,
  NEXORA_DECISION_THEATRE_SCENE_INTENT_KINDS,
  NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY,
  NEXORA_DECISION_THEATRE_SCENE_TRANSITION_POLICIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreSceneIntentIdentity,
  nexoraDecisionTheatreSceneScriptIdentity,
  projectNexoraDecisionTheatreFoundation,
  resolveNexoraDecisionTheatreSceneIntent,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import { DTH3_PROOF_REL_SUPPORTED } from "./nexoraDecisionTheatreVisualGrammarFixtures.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function collectionStage(utterance: string, state = initial()) {
  const semantic = composeNexoraSemanticTurn({ utterance, catalog });
  const raw = semantic.diagnostics.collectionKind?.toLowerCase() ?? null;
  const kind =
    raw === "problem" || raw === "risk" || raw === "opportunity" ||
    raw === "scenario" || raw === "decision" || raw === "execution" || raw === "goal"
      ? raw
      : null;
  const plan = directNexoraPresentation({
    owner: semantic.owner,
    presentationRequest: "COLLECTION",
    primaryReference: semantic.references.primary,
    references: semantic.references.references,
    collectionKind: kind,
    collectionScope: semantic.diagnostics.collectionScope,
    collectionMembers: semantic.canonicalCollectionMembers,
    currentStage: state,
  });
  return applyDirectorPlanToStage({ plan, state, catalog });
}

function project(state = initial(), extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">) {
  return projectNexoraDecisionTheatreFoundation({ stageState: state, catalog, ...extra });
}

function runConversation(utterance: string, state = initial()) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: state.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: state.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: state,
    catalog,
    messageIdSeed: `dth5-${utterance}`,
  });
}

function semantic(partial: Parameters<typeof emptyNexoraDecisionTheatreSceneSemanticInput>[0]) {
  return emptyNexoraDecisionTheatreSceneSemanticInput(partial);
}

test("Scene Intent and Scene Script contracts, registry, immutability, serialization", () => {
  assert.equal(nexoraDecisionTheatreSceneIntentIdentity, "DTH:5/SceneIntent");
  assert.equal(nexoraDecisionTheatreSceneScriptIdentity, "DTH:5/SceneScript");
  assert.equal(NEXORA_DECISION_THEATRE_SCENE_INTENT_KINDS.length, 11);
  assert.equal(Object.keys(NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY).length, 11);
  assert.equal(NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLES.includes("ANCHOR"), true);
  assert.equal(NEXORA_DECISION_THEATRE_SCENE_TRANSITION_POLICIES.includes("NO_VISUAL_TRANSITION"), true);
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("scene-intent"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("object-investigation"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-comparison"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  const theatre = project();
  assert.equal(Object.isFrozen(theatre.sceneIntent), true);
  assert.equal(Object.isFrozen(theatre.sceneScript), true);
  assert.throws(() => {
    (theatre.sceneIntent as { intentKind: string }).intentKind = "mutated";
  });
  const again = project();
  assert.equal(theatre.sceneIntent.sceneIntentId, again.sceneIntent.sceneIntentId);
  assert.equal(theatre.sceneScript.scriptId, again.sceneScript.scriptId);
  assert.deepEqual(JSON.parse(JSON.stringify(theatre.sceneIntent)), JSON.parse(JSON.stringify(again.sceneIntent)));
  assert.equal(theatre.sceneIntent.derivationMetadata.parsedRawManagerText, false);
  assert.equal(theatre.sceneIntent.derivationMetadata.duplicateNlu, false);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});

test("proofs 1-6: orientation, preserve, focal, collections, investigation", () => {
  const orient = project(initial(), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "orient",
      stageOrientationRequest: true,
      primaryResponseOwner: "WORKSPACE_STATE",
    }),
  });
  assert.equal(orient.sceneIntent.intentKind, "ORIENT_TO_STAGE");
  assert.equal(orient.sceneIntent.stageMutationPermission, "PRESERVE_AND_EXPLAIN");

  const definition = project(initial(), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "define",
      knowledgeDefinitionRequest: true,
      primaryResponseOwner: "PRODUCT_KNOWLEDGE",
    }),
  });
  assert.equal(definition.sceneIntent.intentKind, "PRESERVE_SCENE");
  assert.equal(definition.sceneIntent.stageMutationPermission, "NO_CHANGE");

  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const review = project(focused, {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "review-focal",
      canonicalOperation: "EXPLAIN",
      communicativeIntent: "ASK_EXPLANATION",
      namedSubject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
      focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
      explicitNamedEntityAndAction: true,
    }),
  });
  assert.equal(review.sceneIntent.intentKind, "REVIEW_FOCAL_OBJECT");
  assert.equal(review.sceneScript.anchorActorId, "ctx-problem-margin");

  const problems = project(collectionStage("show problems"), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "problems",
      explicitCollectionRequest: true,
      conversationIntentKind: "show-problems",
      requestedCollection: Object.freeze({
        kind: "problem",
        memberIds: Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]),
      }),
    }),
  });
  assert.equal(problems.sceneIntent.intentKind, "REVIEW_COLLECTION");
  assert.deepEqual(problems.sceneIntent.activeCollectionRef?.memberIds, ["ctx-problem-capacity", "ctx-problem-margin"]);

  const scenarios = project(collectionStage("show scenarios"), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "scenarios",
      explicitCollectionRequest: true,
      conversationIntentKind: "show-scenarios",
      requestedCollection: Object.freeze({
        kind: "scenario",
        memberIds: Object.freeze(["ctx-scenario-capacity", "ctx-scenario-demand", "ctx-scenario-pricing"]),
      }),
    }),
  });
  assert.equal(scenarios.sceneIntent.intentKind, "REVIEW_COLLECTION");
  assert.ok((scenarios.sceneIntent.activeCollectionRef?.memberIds.length ?? 0) >= 2);

  const investigate = project(focused, {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "investigate",
      canonicalOperation: "INVESTIGATE",
      questionType: "CAUSE",
      focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
    }),
  });
  assert.equal(investigate.sceneIntent.intentKind, "INVESTIGATE_CONDITION");
});

test("proofs 7-12: comparison, singleton, important, urgency, consequence, observation", () => {
  const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
  const compare = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "compare-two",
    canonicalOperation: "COMPARE",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...two]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  }));
  assert.equal(compare.intentKind, "COMPARE_CANDIDATES");
  assert.equal(compare.comparisonMembers.length, 2);

  const singleton = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "compare-one",
    canonicalOperation: "COMPARE",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze(["ctx-scenario-pricing"]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  }));
  assert.equal(singleton.intentKind, "CLARIFY_SCENE");
  assert.match(singleton.clarification.question ?? "", /two Scenarios/i);

  const important = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "important",
    canonicalOperation: "COMPARE",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...two]),
      criterion: "UNSPECIFIED",
      criterionAmbiguous: true,
      criterionResolution: null,
    }),
  }));
  assert.equal(important.intentKind, "CLARIFY_SCENE");
  assert.match(important.clarification.question ?? "", /urgency/i);

  const urgency = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "urgency",
    canonicalOperation: "COMPARE",
    pendingClarification: Object.freeze({ present: true, reason: "ambiguous-criterion", awaiting: important.clarification.question }),
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...two]),
      criterion: "URGENCY",
      criterionAmbiguous: false,
      criterionResolution: "URGENCY",
    }),
  }));
  assert.equal(urgency.intentKind, "COMPARE_CANDIDATES");
  assert.equal(urgency.comparisonCriterion, "URGENCY");

  const consequence = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "consequence",
    canonicalOperation: "CONSEQUENCE",
    questionType: "CONSEQUENCE",
    focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
  }));
  assert.equal(consequence.intentKind, "REVIEW_CONSEQUENCE");

  const observation = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "observe",
    communicativeIntent: "OBSERVE",
    observationNotScenario: true,
    focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
  }));
  assert.equal(observation.intentKind, "PRESERVE_SCENE");
});

test("proofs 13-17: commitment, execution, outcome, unsupported, unknown entity", () => {
  const decision = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "decision",
    conversationIntentKind: "decision-status",
    namedSubject: Object.freeze({ id: "ctx-decision-reprice", kind: "decision", label: "Reprice", authority: "catalog" }),
    canonicalOperation: "EXPLAIN",
    explicitNamedEntityAndAction: true,
  }));
  assert.equal(decision.intentKind, "REVIEW_COMMITMENT");

  const execution = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "execution",
    conversationIntentKind: "execution-status",
    namedSubject: Object.freeze({ id: "ctx-execution-rollout", kind: "execution", label: "Rollout", authority: "catalog" }),
    canonicalOperation: "STATUS",
    explicitNamedEntityAndAction: true,
  }));
  assert.equal(execution.intentKind, "REVIEW_EXECUTION");

  const outcome = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "outcome",
    journeyPhase: "OUTCOME",
    journeyState: "AWAITING_OUTCOME",
    canonicalOperation: "STATUS",
    communicativeIntent: "ASK_STATUS",
  }));
  assert.equal(outcome.intentKind, "REVIEW_OUTCOME");

  const unsupported = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "unsupported",
      unsupportedRequest: true,
      reservedCapability: "nexo-time-and-theatre-replay",
      focalExecutiveObject: Object.freeze({ id: "obj-revenue", kind: "object", label: "Revenue", authority: "catalog" }),
    }),
  });
  assert.equal(unsupported.sceneIntent.intentKind, "PRESERVE_SCENE");
  assert.equal(unsupported.primaryExecutiveObjectId, "obj-revenue");

  const unknown = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "unknown",
      unknownEntityNamed: true,
      namedSubject: null,
      focalExecutiveObject: Object.freeze({ id: "obj-revenue", kind: "object", label: "Revenue", authority: "catalog" }),
    }),
  });
  assert.equal(unknown.sceneIntent.intentKind, "PRESERVE_SCENE");
  assert.notEqual(unknown.sceneScript.anchorActorId, "unknown-entity");
});

test("proofs 18-24: named override, deixis, collection completeness, pending correction", () => {
  const stale = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const named = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "named-override",
    canonicalOperation: "EXPLAIN",
    explicitNamedEntityAndAction: true,
    namedSubject: Object.freeze({ id: "ctx-problem-capacity", kind: "problem", label: "Capacity Gap", authority: "catalog" }),
    focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
  }));
  assert.equal(named.focalExecutiveObjectRef, "ctx-problem-capacity");
  assert.equal(named.intentKind, "REVIEW_FOCAL_OBJECT");
  assert.equal(stale.focusedSubject?.id, "ctx-problem-margin");

  const reviewIt = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "review-it",
    canonicalOperation: "EXPLAIN",
    conversationIntentKind: "explain",
    deixis: Object.freeze({ pronoun: "it", resolvedIds: Object.freeze(["ctx-decision-reprice"]) }),
    namedSubject: Object.freeze({ id: "ctx-decision-reprice", kind: "decision", label: "Reprice", authority: "catalog" }),
  }));
  assert.equal(reviewIt.intentKind, "REVIEW_COMMITMENT");

  const explainIt = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "explain-it",
    canonicalOperation: "EXPLAIN",
    deixis: Object.freeze({ pronoun: "it", resolvedIds: Object.freeze(["ctx-problem-margin"]) }),
    focalExecutiveObject: Object.freeze({ id: "ctx-problem-margin", kind: "problem", label: "Margin Pressure", authority: "catalog" }),
  }));
  assert.equal(explainIt.intentKind, "REVIEW_FOCAL_OBJECT");
  assert.equal(explainIt.focalExecutiveObjectRef, "ctx-problem-margin");

  const them = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "them",
    canonicalOperation: "COMPARE",
    deixis: Object.freeze({ pronoun: "them", resolvedIds: Object.freeze(["ctx-scenario-pricing", "ctx-scenario-demand"]) }),
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze(["ctx-scenario-pricing", "ctx-scenario-demand"]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  }));
  assert.equal(them.intentKind, "COMPARE_CANDIDATES");
  assert.equal(them.comparisonMembers.length, 2);

  const themOne = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "them-one",
    canonicalOperation: "COMPARE",
    deixis: Object.freeze({ pronoun: "them", resolvedIds: Object.freeze(["ctx-scenario-pricing"]) }),
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze(["ctx-scenario-pricing"]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  }));
  assert.equal(themOne.intentKind, "CLARIFY_SCENE");

  const collection = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "complete-collection",
    explicitCollectionRequest: true,
    requestedCollection: Object.freeze({
      kind: "problem",
      memberIds: Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]),
    }),
  }));
  assert.equal(collection.activeCollectionRef?.memberIds.length, 2);

  const correction = resolveNexoraDecisionTheatreSceneIntent(semantic({
    canonicalSemanticResultRef: "correction",
    pendingClarification: Object.freeze({ present: true, reason: "OBJECT_AMBIGUITY", awaiting: "Which object?" }),
    explicitCorrection: true,
    explicitNamedEntityAndAction: true,
    canonicalOperation: "EXPLAIN",
    namedSubject: Object.freeze({ id: "ctx-problem-capacity", kind: "problem", label: "Capacity Gap", authority: "catalog" }),
  }));
  assert.equal(correction.intentKind, "REVIEW_FOCAL_OBJECT");
  assert.equal(correction.focalExecutiveObjectRef, "ctx-problem-capacity");
});

test("proofs 25-32: determinism, continuity, actor identity, iconic owner, relationships, causality", () => {
  const input = semantic({
    canonicalSemanticResultRef: "same",
    canonicalOperation: "EXPLAIN",
    namedSubject: Object.freeze({ id: "obj-revenue", kind: "object", label: "Revenue", authority: "catalog" }),
    explicitNamedEntityAndAction: true,
  });
  const a = resolveNexoraDecisionTheatreSceneIntent(input);
  const b = resolveNexoraDecisionTheatreSceneIntent(input);
  assert.equal(a.sceneIntentId, b.sceneIntentId);

  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const first = project(focused, { sceneSemanticInput: input });
  const second = project(focused, { sceneSemanticInput: input });
  assert.equal(first.sceneScript.scriptId, second.sceneScript.scriptId);

  const followUp = project(focused, {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "readonly",
      knowledgeDefinitionRequest: true,
      lastValidSceneScript: first.sceneScript,
    }),
  });
  assert.equal(followUp.sceneScript.scriptId, first.sceneScript.scriptId);

  const recomposed = project(collectionStage("show problems"), {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "recompose",
      explicitCollectionRequest: true,
      conversationIntentKind: "show-problems",
      requestedCollection: Object.freeze({
        kind: "problem",
        memberIds: Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]),
      }),
      lastValidSceneScript: first.sceneScript,
    }),
  });
  assert.notEqual(recomposed.sceneScript.scriptId, first.sceneScript.scriptId);

  for (const actor of first.sceneScript.actors) {
    assert.ok(actor.canonicalId.length > 0);
    if (actor.executive) {
      assert.ok(first.visibleExecutiveObjects.some((item) => item.id === actor.canonicalId));
    }
  }

  const withIconic = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog), {
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "iconic",
      canonicalOperation: "COMPARE",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze(["ctx-scenario-capacity", "ctx-scenario-pricing"]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
  });
  for (const actor of withIconic.sceneScript.actors) {
    if (actor.role === "ICONIC_INDICATOR") {
      assert.ok(actor.ownerExecutiveObjectId);
      assert.ok(withIconic.sceneScript.actors.some((item) => item.executive && item.canonicalId === actor.ownerExecutiveObjectId));
    }
  }

  const rel = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), {
    visualGrammarInput: {
      relationshipPresentations: [
        { relationshipId: DTH3_PROOF_REL_SUPPORTED.id, supportState: "unknown", causalAuthority: true, direction: "source-to-target" },
      ],
    },
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "rels",
      stageOrientationRequest: true,
      causalitySupported: false,
    }),
  });
  assert.equal(rel.sceneScript.relationships.every((item) => item.causalStatus === "unsupported"), true);
  assert.equal(
    rel.sceneScript.requestedGrammarDirectives.every((item) => !item.includes(":direction:") || item.endsWith(":none")),
    true,
  );
});

test("proofs 33-40: equal size, atmosphere separation, domain safety, refresh, back/forward, clarification preserve", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog);
  const compare = project(focused, {
    visualGrammarInput: {
      impactCriterion: { criterionId: "cost", unit: "USD", values: { "ctx-scenario-capacity": null } },
    },
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "size",
      canonicalOperation: "COMPARE",
      impactScaleEvidenceSufficient: false,
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze(["ctx-scenario-capacity", "ctx-scenario-pricing"]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
  });
  assert.equal(
    compare.sceneScript.requestedGrammarDirectives.every((item) => !item.includes("size-higher") && !item.includes("size-lower")),
    true,
  );

  const withAtmosphere = project(focused, {
    atmosphereAuthority: { investigationSupported: true },
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "atm",
      canonicalOperation: "INVESTIGATE",
    }),
  });
  assert.equal(withAtmosphere.sceneIntent.derivationMetadata.atmosphereSelected, false);
  assert.equal(withAtmosphere.sceneScript.atmosphereRef, withAtmosphere.warRoomAtmosphere.mode);
  assert.equal(withAtmosphere.sceneScript.derivationMetadata.atmosphereSelectedIndependently, false);
  assert.equal(withAtmosphere.writes.decisionState, false);
  assert.equal(withAtmosphere.writes.executionState, false);
  assert.equal(withAtmosphere.writes.outcome, false);
  assert.equal(withAtmosphere.writes.learning, false);
  assert.equal(withAtmosphere.sceneScript.derivationMetadata.mutatedDecision, false);
  assert.equal(withAtmosphere.sceneScript.derivationMetadata.startedExecution, false);
  assert.equal(withAtmosphere.sceneScript.derivationMetadata.createdOutcomeOrLearning, false);

  const refresh = project(focused, { sceneSemanticInput: semantic({ canonicalSemanticResultRef: "refresh-same", canonicalOperation: "EXPLAIN", namedSubject: Object.freeze({ id: "ctx-scenario-capacity", kind: "scenario", label: "Capacity", authority: "catalog" }), explicitNamedEntityAndAction: true }) });
  const refreshAgain = project(focused, { sceneSemanticInput: semantic({ canonicalSemanticResultRef: "refresh-same", canonicalOperation: "EXPLAIN", namedSubject: Object.freeze({ id: "ctx-scenario-capacity", kind: "scenario", label: "Capacity", authority: "catalog" }), explicitNamedEntityAndAction: true, navigationRestore: "refresh" }) });
  assert.equal(refresh.sceneScript.scriptId, refreshAgain.sceneScript.scriptId);

  let nav = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  nav = selectNexoraMVPInteractionSubject(nav, "obj-capacity", catalog);
  const atCapacity = project(nav);
  const back = stepBackNexoraMVPObjectInteraction(nav, catalog);
  const backTheatre = project(back, {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: `stage:${back.mode}:${back.focusedSubject?.id}`,
      focalExecutiveObject: back.focusedSubject
        ? Object.freeze({ id: back.focusedSubject.id, kind: back.focusedSubject.kind, label: back.focusedSubject.label, authority: "catalog" })
        : null,
      navigationRestore: "back",
    }),
  });
  const restoredFocus = project(back);
  assert.equal(backTheatre.sceneScript.transitionPolicy, "RESTORE_SNAPSHOT");
  assert.equal(backTheatre.primaryExecutiveObjectId, restoredFocus.primaryExecutiveObjectId);
  const forward = stepForwardNexoraMVPObjectInteraction(back, catalog);
  assert.equal(project(forward).primaryExecutiveObjectId, atCapacity.primaryExecutiveObjectId);
  const overview = resetNexoraMVPObjectInteractionOverview(nav);
  assert.equal(project(overview).sceneProvenance.navigationHistoryDuplicated, false);

  const last = project(focused);
  const clarify = project(focused, {
    sceneSemanticInput: semantic({
      canonicalSemanticResultRef: "clarify-hold",
      canonicalOperation: "COMPARE",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze(["ctx-scenario-capacity"]),
        criterion: "UNSPECIFIED",
        criterionAmbiguous: true,
        criterionResolution: null,
      }),
      lastValidSceneScript: last.sceneScript,
    }),
  });
  assert.equal(clarify.sceneIntent.intentKind, "CLARIFY_SCENE");
  assert.equal(clarify.sceneScript.scriptId, last.sceneScript.scriptId);
  assert.equal(clarify.primaryExecutiveObjectId, focused.focusedSubject?.id);
});

test("no duplicate NLU, Advisor-readable scene, diagnostics, conversation regression", () => {
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "nexoraDecisionTheatreSceneIntentResolver.ts"),
    "utf8",
  );
  assert.equal(source.includes("interpretCanonicalManagerMeaning"), false);
  assert.equal(source.includes("interpretManagerTurnMeaning"), false);
  assert.equal(source.includes("resolveNexoraConversationalIntent"), false);

  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const text = JSON.stringify(theatre.advisorReadable);
  assert.doesNotMatch(text, /DTH:5|Scene Intent|Scene Script|NexoGraph|DIR:1/);
  assert.ok(theatre.advisorReadable.scene.question.length > 0);
  assert.equal(theatre.advisorReadable.scene.stagePreserved, true);

  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: { stageState: selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), catalog },
  });
  assert.ok(diagnostics.sceneIntentId.length > 0);
  assert.ok(diagnostics.sceneScriptId.startsWith("dth5-script:"));
  assert.equal(diagnostics.unauthorizedMutation, false);

  const orientLive = runConversation("explain the stage");
  assert.equal(orientLive.decisionTheatre?.sceneIntent.intentKind, "ORIENT_TO_STAGE");
  const problemsLive = runConversation("show problems");
  assert.equal(problemsLive.decisionTheatre?.sceneIntent.intentKind, "REVIEW_COLLECTION");
  assert.equal(problemsLive.decisionTheatre?.writes.decisionState, false);
  const focused = runConversation("Explain it", selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  assert.equal(focused.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.ok(
    focused.decisionTheatre?.sceneIntent.intentKind === "REVIEW_FOCAL_OBJECT" ||
      focused.decisionTheatre?.sceneIntent.intentKind === "ORIENT_TO_STAGE" ||
      focused.decisionTheatre?.sceneIntent.intentKind === "PRESERVE_SCENE",
  );
  const composer = composeNexoraDecisionTheatreSceneScript;
  assert.equal(typeof composer, "function");
});
