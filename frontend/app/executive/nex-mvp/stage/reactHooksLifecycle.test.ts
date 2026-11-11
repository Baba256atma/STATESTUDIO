import assert from "node:assert/strict";
import test from "node:test";

import {
  causalHandoffDraftForBoundary,
  emptyCausalHandoffDraft,
} from "./NexoraCausalInvestigationView.tsx";
import {
  decisionSelectionForBoundary,
  emptyDecisionSelection,
} from "./NexoraDecisionDomainControls.tsx";
import { stageDragMove } from "./stageDataObjectDragEpoch.ts";

test("NexoCause keeps a Scenario draft inside one Workspace and Deck", () => {
  const boundary = "company-a\0production";
  const draft = {
    ...emptyCausalHandoffDraft(boundary),
    scenarioName: "Reduce delay",
    intervention: "Add a shift",
    acknowledged: true,
    goalId: "goal-1",
  };
  assert.equal(causalHandoffDraftForBoundary(draft, boundary), draft);
  assert.equal(draft.acknowledged, true);
});

test("NexoCause drops a Scenario draft when Workspace or Deck changes", () => {
  const draft = {
    ...emptyCausalHandoffDraft("company-a\0production"),
    scenarioName: "Reduce delay",
    acknowledged: true,
    proposal: null,
  };
  const otherWorkspace = causalHandoffDraftForBoundary(draft, "company-b\0production");
  const otherDeck = causalHandoffDraftForBoundary(draft, "company-a\0finance");
  assert.equal(otherWorkspace.scenarioName, "");
  assert.equal(otherWorkspace.acknowledged, false);
  assert.equal(otherWorkspace.proposal, null);
  assert.equal(otherDeck.scenarioName, "");
  assert.notEqual(otherDeck.boundary, draft.boundary);
});

test("Decision selection stays while the Workspace and Deck stay the same", () => {
  const boundary = "company-a\0production";
  const selection = { ...emptyDecisionSelection(boundary), selectedId: "scenario-1", message: "Scenario recorded" };
  assert.deepEqual(decisionSelectionForBoundary(selection, boundary), selection);
});

test("Decision selection and status text reset across Workspace and Deck boundaries", () => {
  const selection = {
    ...emptyDecisionSelection("company-a\0production"),
    selectedId: "decision-1",
    message: "Decision approved",
  };
  const otherWorkspace = decisionSelectionForBoundary(selection, "company-b\0production");
  const otherDeck = decisionSelectionForBoundary(selection, "company-a\0finance");
  assert.deepEqual(otherWorkspace, emptyDecisionSelection("company-b\0production"));
  assert.deepEqual(otherDeck, emptyDecisionSelection("company-a\0finance"));
});

test("Stage drag follows the captured spatial epoch and cancels when that identity changes", () => {
  const epoch = "company-a|production|";
  assert.equal(stageDragMove(false, epoch, epoch), "idle");
  assert.equal(stageDragMove(true, epoch, epoch), "continue");
  assert.equal(stageDragMove(true, epoch, "company-b|production|"), "cancel");
  assert.equal(stageDragMove(true, epoch, "company-a|finance|"), "cancel");
  assert.equal(stageDragMove(true, epoch, "company-a|production|manufacturing"), "cancel");
});
