/**
 * NPA-T NPS:3 bounded live /executive proof via the production conversational path.
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
  return createWorkspace("NPS:3 Runtime Proofs").workspaceId;
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
    messageIdSeed: `nps-3-runtime-${utterance}`,
  });
}

test("NPS:3 live — evidence question stays on Capacity Gap and does not confirm a cause", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const evidence = run("What does the evidence say is causing it?", workspaceId, first);
  assert.equal(evidence.npsEvidenceCause?.problemId, "ctx-problem-capacity");
  assert.equal(evidence.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.ok((evidence.npsEvidenceCause?.observations.length ?? 0) + (evidence.npsEvidenceCause?.relationships.length ?? 0) > 0);
  assert.equal(evidence.npsEvidenceCause?.confirmedCause, null);
  assert.notEqual(evidence.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");
  assert.match(evidence.response, /Capacity Gap|evidence|contributor|not proven|not a confirmed cause/i);
  assert.doesNotMatch(evidence.response, /\bNPS\b|\bCORE-INT\b|CC:8|resolver|composer/i);
  const leading = run("So is Demand Surge definitely the cause?", workspaceId, evidence);
  assert.equal(leading.npsEvidenceCause?.problemId, "ctx-problem-capacity");
  assert.equal(leading.npsEvidenceCause?.confirmedCause, null);
  assert.match(leading.response, /not a confirmed cause/i);
  assert.doesNotMatch(leading.response, /Demand Surge is (?:definitely |the confirmed )?cause/i);
  assert.equal(leading.npsEvidenceCause?.writesScenario, false);
  assert.equal(leading.npsEvidenceCause?.writesRecommendation, false);
});
