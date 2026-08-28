import assert from "node:assert/strict";
import test from "node:test";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "./nexoraSemanticPresentationDirector.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { composeNexoraSemanticTurn } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const initial = () => createInitialNexoraMVPObjectInteractionState({
  workspace: "overview",
  presentationState: "minimum",
  environmentIntent: "neutral",
});

function collectionPlan(utterance: string, state = initial()) {
  const semantic = composeNexoraSemanticTurn({ utterance, catalog });
  const raw = semantic.diagnostics.collectionKind?.toLowerCase() ?? null;
  const kind = raw === "problem" || raw === "risk" || raw === "opportunity" ||
    raw === "scenario" || raw === "decision" || raw === "execution" || raw === "goal" ? raw : null;
  return directNexoraPresentation({
    owner: semantic.owner,
    presentationRequest: "COLLECTION",
    primaryReference: semantic.references.primary,
    references: semantic.references.references,
    collectionKind: kind,
    collectionScope: semantic.diagnostics.collectionScope,
    collectionMembers: semantic.canonicalCollectionMembers,
    currentStage: state,
  });
}

test("multi-member Problems remain one canonical collection through Stage", () => {
  const plan = collectionPlan("show problems");
  assert.equal(plan.intent, "SHOW_COLLECTION");
  assert.deepEqual(plan.targets.map((item) => item.id), ["ctx-problem-capacity", "ctx-problem-margin"]);
  assert.equal(plan.primaryTarget, null);
  const stage = applyDirectorPlanToStage({ plan, state: initial(), catalog });
  assert.deepEqual(stage.collectionContext?.objectIds, plan.targets.map((item) => item.id));
  assert.equal(stage.focusedSubject, null);
});

test("scenario, decision and execution membership is generic and exact", () => {
  for (const utterance of ["show scenarios", "show decisions", "show executions"]) {
    const plan = collectionPlan(utterance);
    assert.equal(plan.intent, plan.targets.length ? "SHOW_COLLECTION" : "NO_CHANGE");
    if (plan.intent === "SHOW_COLLECTION") {
      const stage = applyDirectorPlanToStage({ plan, state: initial(), catalog });
      assert.deepEqual(stage.collectionContext?.objectIds, plan.targets.map((item) => item.id));
      assert.equal(plan.businessMutationAllowed, false);
    }
  }
});

test("one-member Risk preserves collection semantics and empty collections do not invent objects", () => {
  const risk = collectionPlan("show risks");
  assert.equal(risk.intent, "SHOW_COLLECTION");
  assert.equal(risk.targets.length, 1);
  assert.equal(risk.collection?.kind, "risk");
  for (const utterance of ["show opportunities", "show goals"]) {
    const plan = collectionPlan(utterance);
    if (plan.targets.length === 0) {
      assert.equal(plan.intent, "NO_CHANGE");
      assert.equal(plan.mutationRequired, false);
    }
  }
});

test("already-satisfied collection is stable and a collection supersedes stale focus", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const scenarios = collectionPlan("show scenarios", focused);
  const stage = applyDirectorPlanToStage({ plan: scenarios, state: focused, catalog });
  assert.equal(stage.focusedSubject, null);
  assert.equal(stage.collectionContext?.category, "scenario");
  const repeated = collectionPlan("show scenarios", stage);
  assert.equal(repeated.intent, "SHOW_COLLECTION");
  assert.equal(repeated.alreadySatisfied, true);
  assert.equal(repeated.mutationRequired, false);
});

test("explain, workspace, capability, assertion and social turns are NO_CHANGE", () => {
  for (const utterance of [
    "Explain Capacity Gap.", "What is on Stage now?", "Can you add an object?",
    "Capacity Gap and Margin Pressure are Problems.", "Thanks.",
  ]) {
    const semantic = composeNexoraSemanticTurn({ utterance, catalog });
    const plan = directNexoraPresentation({
      owner: semantic.owner, presentationRequest: "NONE",
      primaryReference: semantic.references.primary, references: semantic.references.references,
      collectionKind: null, collectionScope: null, collectionMembers: Object.freeze([]), currentStage: initial(),
    });
    assert.equal(plan.intent, "NO_CHANGE", utterance);
    assert.equal(plan.businessMutationAllowed, false);
  }
});
