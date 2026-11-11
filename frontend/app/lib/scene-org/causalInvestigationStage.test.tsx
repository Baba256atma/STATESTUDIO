/**
 * NPA-T NEXOCAUSE-STAGE-INSPECTION:1
 * View contract, saved-scene identities, and manager inspection markup.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraCausalInvestigationView } from "../../executive/nex-mvp/stage/NexoraCausalInvestigationView.tsx";
import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { reviewCausalHypothesis } from "./causalHypothesisReview.ts";
import {
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  listCausalHypothesisReviews,
  resetCausalInvestigationDomainForTests,
} from "./canonicalCausalInvestigationDomain.ts";
import { resetCanonicalObjectsForTests } from "./canonicalObjectRegistry.ts";
import { resetCanonicalRelationshipsForTests } from "./canonicalRelationshipGraph.ts";
import { resetDecisionDomainForTests } from "./canonicalDecisionDomain.ts";
import { resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import {
  CAUSAL_INVESTIGATION_EMPTY,
  causalReviewActionsForStatus,
} from "./causalInvestigationStageContract.ts";
import {
  publishCausalInvestigationUiSelection,
  readCausalInvestigationUiSelection,
  resetCausalInvestigationUiSessionForTests,
  setCausalInvestigationUiStorageForTests,
} from "./causalInvestigationUiSession.ts";
import { CAUSAL_INVESTIGATION_VIEW, parseStagePresentationView } from "./organizationalSolarView.ts";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  createSceneOrgSavedScene,
  parseSceneOrgCausalSelection,
} from "./sceneOrgWorkspacePlacementContract.ts";
import {
  parseSceneOrgSavedScenes,
  serializeSceneOrgSavedScenes,
} from "./sceneOrgSavedSceneDurability.ts";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

test("NexoCause is an executive view and does not replace Stage, Solar, or Decision", () => {
  assert.equal(parseStagePresentationView("causal-investigation"), CAUSAL_INVESTIGATION_VIEW);
  assert.equal(parseStagePresentationView("stage"), null);
  assert.equal(parseStagePresentationView("not-a-view"), null);
  assert.deepEqual(causalReviewActionsForStatus("PROPOSED"), ["REQUEST_EVIDENCE", "START_REVIEW"]);
  assert.deepEqual(causalReviewActionsForStatus("UNDER_REVIEW"), [
    "REQUEST_EVIDENCE",
    "REJECT",
    "RETURN_TO_INVESTIGATION",
    "ACCEPT_FOR_SCENARIO",
  ]);
  assert.deepEqual(causalReviewActionsForStatus("ARCHIVED"), []);
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-testid="nexora-stage-view-stage"/);
  assert.match(html, /data-testid="nexora-stage-view-solar"/);
  assert.match(html, /data-testid="nexora-stage-view-decision"/);
  assert.match(html, /data-testid="nexora-stage-view-causal"/);
  assert.match(html, /data-testid="nexora-workspace-dial-mount"/);
  assert.match(html, /data-testid="nexora-causal-inspection-slot"/);
  const source = readFileSync(new URL("../../executive/nex-mvp/stage/NexoraCausalInvestigationView.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /transitionCausalHypothesis/);
  assert.doesNotMatch(source, /approveManagerDecision/);
  assert.doesNotMatch(source, /localStorage/);
});

test("saved scenes keep NexoCause identities and drop resolved dataset values", () => {
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-cause",
    name: "Cause",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "workspace-a",
    ownerDeckId: "production",
    canonicalReferences: [createSceneOrgCanonicalReference({
      canonicalId: "org:workspace-a:o1",
      kind: "object",
      owner: "canonical MO/Object catalog",
    })],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    stageView: CAUSAL_INVESTIGATION_VIEW,
    causalSelection: {
      investigationId: "cause:workspace-a:1",
      hypothesisId: "hypothesis:workspace-a:1",
      canonicalObjectId: "org:workspace-a:o1",
    },
  });
  const loaded = parseSceneOrgSavedScenes(serializeSceneOrgSavedScenes([scene]));
  assert.equal(loaded.status, "loaded");
  assert.equal(loaded.scenes[0]?.stageView, CAUSAL_INVESTIGATION_VIEW);
  assert.equal(loaded.scenes[0]?.causalSelection?.investigationId, "cause:workspace-a:1");
  assert.doesNotMatch(serializeSceneOrgSavedScenes([scene]), /resolvedValue|capacity/);
  const poisoned = JSON.parse(serializeSceneOrgSavedScenes([scene])) as {
    scenes: Array<Record<string, unknown>>;
  };
  const selection = poisoned.scenes[0]?.causalSelection as Record<string, unknown>;
  selection.resolvedValue = "120";
  const reopened = parseSceneOrgSavedScenes(JSON.stringify(poisoned));
  assert.equal(reopened.status, "loaded");
  assert.equal(reopened.scenes[0]?.stageView, CAUSAL_INVESTIGATION_VIEW);
  assert.equal(reopened.scenes[0]?.causalSelection, undefined);
  assert.equal(parseSceneOrgCausalSelection({ investigationId: "cause:1", resolvedValue: "90" }), null);
});

test("investigation selection stays inside the active deck", () => {
  const store = memory();
  setCausalInvestigationUiStorageForTests(store);
  publishCausalInvestigationUiSelection("company-a", "production", {
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
    canonicalObjectId: null,
  });
  assert.equal(readCausalInvestigationUiSelection("company-a", "finance"), null);
  assert.equal(readCausalInvestigationUiSelection("company-b", "production"), null);
  assert.equal(readCausalInvestigationUiSelection("company-a", "production")?.investigationId, "cause:company-a:1");
  publishCausalInvestigationUiSelection("company-a", "production", {
    investigationId: "cause:company-a:1",
    hypothesisId: null,
    canonicalObjectId: null,
    resolvedValue: "120",
  } as never);
  assert.equal(readCausalInvestigationUiSelection("company-a", "production")?.hypothesisId, "hypothesis:company-a:1");
  resetCausalInvestigationUiSessionForTests();
});

test("the investigation view reads the canonical record and review actions", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  const store = memory();
  resetCanonicalObjectsForTests(store);
  resetCanonicalRelationshipsForTests(store);
  resetDecisionDomainForTests(store);
  resetCanonicalMutationJournalForTests(store);
  resetCausalInvestigationDomainForTests(store);
  setDeckRegistryStorageForTests(store);
  setCausalInvestigationUiStorageForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "NPA NexoCause Stage Test", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(production.ok, true);
    assert.equal(finance.ok, true);
    if (!production.ok || !finance.ok) return;
    const empty = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
    }));
    assert.match(empty, new RegExp(CAUSAL_INVESTIGATION_EMPTY));
    assert.match(empty, /Create investigation/);
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Efficiency decline",
      problemStatement: "Why did production efficiency decline?",
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const observation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Downtime was reported during the shift.",
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Unexpected maintenance downtime reduced output.",
      observationIds: [observation.value.observationId],
      limitations: ["The downtime report is not a measured dataset."],
      evidenceRoles: [{ observationId: observation.value.observationId, role: "SUPPORTING" }],
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    publishCausalInvestigationUiSelection(company.workspaceId, production.value.deckId, {
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      canonicalObjectId: null,
    });
    const proposed = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
    }));
    assert.match(proposed, /Why did production efficiency decline/);
    assert.match(proposed, /MANAGER_REPORTED|MANAGER REPORTED/);
    assert.match(proposed, /Request More Evidence/);
    assert.match(proposed, /Start Review/);
    assert.doesNotMatch(proposed, /Accept for Scenario/);
    assert.match(proposed, /Causation is not established|does not establish causation/);
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Start the manager review.",
      operationId: "stage-start-review",
    });
    assert.equal(started.ok, true);
    const reviewing = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
    }));
    assert.match(reviewing, /Accept for Scenario/);
    assert.match(reviewing, /I acknowledge the unresolved limitations/);
    assert.match(reviewing, /nexora-causal-action-ACCEPT_FOR_SCENARIO" disabled/);
    assert.match(reviewing, /stage-start-review/);
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).length, 1);
    const isolated = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
    }));
    assert.match(isolated, new RegExp(CAUSAL_INVESTIGATION_EMPTY));
    assert.doesNotMatch(isolated, /Efficiency decline/);
    const demo = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: DEMO_WORKSPACE_ID,
      deckId: null,
    }));
    assert.match(demo, /protected Demo/);
    assert.doesNotMatch(demo, /Create investigation/);
    const executive = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: NEXORA_EXECUTIVE_DECK_ID,
    }));
    assert.match(executive, /Executive deck/);
    assert.doesNotMatch(executive, /Efficiency decline/);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCausalInvestigationUiSessionForTests();
  }
});
