/**
 * NPA-T NPS:5 bounded live /executive proof via the production conversational path.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("NPS:5 Runtime Proofs").workspaceId;
}

function run(
  utterance: string,
  workspaceId: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext ?? {
      currentSubjectId: null,
      previousSubjectIds: [],
      currentWorkspaceId: workspaceId,
    },
    executiveContext:
      previous?.nextExecutiveContext ??
      createEmptyNexoraExecutiveContextSnapshot({ currentWorkspaceId: workspaceId }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    messageIdSeed: `nps-5-runtime-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

test("NPS:5 live — compare, recommend, and refuse Decision on Capacity Gap", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const listed = run("What options do we have for Capacity Gap?", workspaceId, first);
  const compared = run("Compare them.", workspaceId, listed);
  assert.equal(compared.npsComparisonRecommendation?.problemId, "ctx-problem-capacity");
  assert.equal(compared.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.ok((compared.npsComparisonRecommendation?.comparedOptions.length ?? 0) >= 2);
  assert.match(compared.response, /Capacity Gap/i);
  assert.match(compared.response, /faster|reversible|cost|expansion/i);
  assert.doesNotMatch(compared.response, /\bNPS\b|\bNCA\b|CC:10|resolver|composer/i);
  assert.ok(
    compared.npsComparisonRecommendation?.comparedOptions.some(
      (item) => item.canonicalScenarioId === "ctx-scenario-capacity",
    ),
  );
  const choose = run("Which one should we choose?", workspaceId, compared);
  assert.equal(choose.npsComparisonRecommendation?.problemId, "ctx-problem-capacity");
  assert.equal(choose.npsComparisonRecommendation?.commitsDecision, false);
  assert.equal(choose.npsComparisonRecommendation?.approvedDecision, null);
  assert.match(choose.response, /recommend|condition|if supplier|no clear preference|which matters more/i);
  assert.doesNotMatch(choose.response, /we have chosen|approved Decision/i);
  const decision = run("So that's our decision?", workspaceId, choose);
  assert.equal(decision.npsComparisonRecommendation?.problemId, "ctx-problem-capacity");
  assert.match(decision.response, /not an approved Decision/i);
  assert.equal(decision.npsComparisonRecommendation?.commitsDecision, false);
  const why = run("Why that one?", workspaceId, decision);
  assert.equal(why.npsComparisonRecommendation?.problemId, "ctx-problem-capacity");
  assert.match(why.response, /Capacity Gap/i);
});
