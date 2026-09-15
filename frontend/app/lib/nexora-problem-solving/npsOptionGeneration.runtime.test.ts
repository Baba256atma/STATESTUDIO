/**
 * NPA-T NPS:4 bounded live /executive proof via the production conversational path.
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
  return createWorkspace("NPS:4 Runtime Proofs").workspaceId;
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
    messageIdSeed: `nps-4-runtime-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

test("NPS:4 live — options stay on Capacity Gap, reuse Expansion Plan, and do not recommend", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const options = run("What options do we have for Capacity Gap?", workspaceId, first);
  assert.equal(options.npsOptionGeneration?.problemId, "ctx-problem-capacity");
  assert.equal(options.npsUnderstanding?.problemId, "ctx-problem-capacity");
  assert.ok((options.npsOptionGeneration?.optionCandidates.length ?? 0) >= 3);
  assert.equal(options.npsOptionGeneration?.recommendation, null);
  assert.equal(options.npsOptionGeneration?.preferredOption, null);
  assert.equal(options.npsOptionGeneration?.writesScenario, false);
  assert.equal(options.npsOptionGeneration?.commitsDecision, false);
  assert.match(options.response, /Capacity Gap/i);
  assert.match(options.response, /external|internal|monitor|schedul/i);
  assert.doesNotMatch(options.response, /Nexora recommends|best option|should be selected/i);
  assert.doesNotMatch(options.response, /\bNPS\b|\bCC:9\b|resolver|composer/i);
  assert.ok(
    options.npsOptionGeneration?.optionCandidates.some(
      (item) => item.reusedScenarioId === "ctx-scenario-capacity" || item.title === "Capacity Expansion Plan",
    ),
  );
  const detail = run("Tell me more about the external option.", workspaceId, options);
  assert.equal(detail.npsOptionGeneration?.problemId, "ctx-problem-capacity");
  assert.equal(detail.managerObjectTurn.session.npsOptionCandidateId, "opt-external-capacity");
  assert.match(detail.response, /external/i);
  assert.match(detail.response, /Capacity Gap/i);
  assert.doesNotMatch(detail.response, /Demand Surge caused/i);
});
