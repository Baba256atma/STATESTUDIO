/**
 * NPA-T NPS:2 bounded live /executive proof via the production conversational path.
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
  return createWorkspace("NPS:2 Runtime Proofs").workspaceId;
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
    messageIdSeed: `nps-2-runtime-${utterance}`,
  });
}

test("NPS:2 live — Investigate Capacity Gap understands the Problem and next investigation step", () => {
  const workspaceId = setup();
  const result = run("Investigate Capacity Gap.", workspaceId);
  assert.equal(result.npsPath?.problemOwnership, "DETERMINED");
  assert.equal(result.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.equal(result.npsUnderstanding?.problemTitle, "Capacity Gap");
  assert.ok((result.npsUnderstanding?.knownFacts.length ?? 0) + (result.npsUnderstanding?.knownSymptoms.length ?? 0) > 0);
  assert.ok((result.npsUnderstanding?.unknowns.length ?? 0) > 0);
  assert.ok(
    result.npsUnderstanding?.action === "INVESTIGATE_EXISTING_EVIDENCE" ||
      result.npsUnderstanding?.action === "ASK_MANAGER",
  );
  assert.match(result.response, /Capacity Gap/i);
  assert.match(`${result.response} ${result.npsUnderstanding?.managerProjection.text ?? ""}`, /know|unclear|missing|history|question/i);
  assert.doesNotMatch(result.response, /\bNPS\b|\bECA\b|CC:10|resolver|composer/i);
  assert.equal(result.npsUnderstanding?.commitsDecision, false);
  assert.equal(result.npsUnderstanding?.startsExecution, false);
  assert.equal(result.npsUnderstanding?.confirmedCause, null);
});

test("NPS:2 live — follow-up keeps the same Problem and investigation need", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const why = run("Why do we need that?", workspaceId, first);
  assert.equal(why.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.equal(why.managerObjectTurn.session.npsProblemId, "ctx-problem-capacity");
  assert.match(why.response, /Capacity Gap|needed|history|unresolved/i);
  const again = run("Investigate it.", workspaceId, why);
  assert.equal(again.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.notEqual(again.npsUnderstanding?.problemId, "ctx-problem-margin");
  assert.equal(again.npsUnderstanding?.fabricatesEvidence, false);
});
