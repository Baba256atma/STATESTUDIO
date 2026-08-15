/**
 * STAGE-PROD:6V — Human Visual Certification machine checks + Advisor matrix.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_STAGE_HVC_BOUNDARY,
  EXECUTIVE_STAGE_HVC_BUDGETS,
  EXECUTIVE_STAGE_HVC_VIEWPORTS,
  buildExecutiveHvcObservability,
  getExecutiveStageHumanVisualCertificationIdentity,
  resolveExecutiveHvcAdvisorPanelVisibility,
  resolveExecutiveHvcEffectiveBudgets,
  verifyExecutiveStageHumanVisualCertification,
} from "./executiveStageHumanVisualCertification.ts";
import { EXECUTIVE_STAGE_WATCH_BUDGET } from "./executiveStageProductivityContract.ts";
import { EXECUTIVE_STAGE_COLLECTION_BUDGET } from "./executiveStageQueueFoundation.ts";
import { EXECUTIVE_STAGE_PREPARATION_BUDGET } from "./executiveStagePreparation.ts";
import {
  beginNexoraMVPDailyPreparation,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

test("6V identity + presentation-only boundary", () => {
  const identity = getExecutiveStageHumanVisualCertificationIdentity();
  assert.equal(
    identity.id,
    "STAGE-PROD:6V/ExecutiveStageHumanVisualCertification",
  );
  assert.equal(EXECUTIVE_STAGE_HVC_BOUNDARY.implementsNewProductCapability, false);
  assert.equal(EXECUTIVE_STAGE_HVC_BOUNDARY.schematicCapturesQualifyForHvc, false);
  const verify = verifyExecutiveStageHumanVisualCertification();
  assert.equal(verify.ok, true);
  assert.equal(verify.budgetsCalibrated, true);
});

test("6V calibrated budgets applied to runtime authorities", () => {
  assert.equal(EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible, 3);
  assert.equal(EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible, 6);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible, 6);
  assert.equal(EXECUTIVE_STAGE_HVC_BUDGETS.previous.collectionMaxVisible, 8);
  assert.equal(EXECUTIVE_STAGE_HVC_BUDGETS.previous.watchMaxVisible, 4);
  const effective = resolveExecutiveHvcEffectiveBudgets();
  assert.equal(effective.collectionMaxVisible, 6);
  assert.equal(effective.watchMaxVisible, 3);
});

test("6V Advisor visibility matrix", () => {
  assert.deepEqual(
    resolveExecutiveHvcAdvisorPanelVisibility({
      presentationMode: "overview",
    }),
    { preparation: false, nba: false, brief: false, memory: false },
  );
  assert.deepEqual(
    resolveExecutiveHvcAdvisorPanelVisibility({
      presentationMode: "preparation",
      preparationActive: true,
    }),
    { preparation: true, nba: false, brief: false, memory: false },
  );
  const decision = resolveExecutiveHvcAdvisorPanelVisibility({
    presentationMode: "object-focus",
    subjectKind: "decision",
    nbaAvailable: true,
    briefEligible: true,
    memoryAvailable: true,
  });
  assert.equal(decision.preparation, false);
  assert.equal(decision.nba, true);
  assert.equal(decision.brief, true);
  assert.equal(decision.memory, true);

  const bo = resolveExecutiveHvcAdvisorPanelVisibility({
    presentationMode: "object-focus",
    subjectKind: "object",
    nbaAvailable: true,
    briefEligible: true,
    memoryAvailable: true,
  });
  assert.equal(bo.memory, false);
  assert.equal(bo.nba, true);
});

test("6V viewports + observability", () => {
  assert.equal(EXECUTIVE_STAGE_HVC_VIEWPORTS.primary.width, 1502);
  assert.equal(EXECUTIVE_STAGE_HVC_VIEWPORTS.narrow.width, 1280);
  const obs = buildExecutiveHvcObservability({
    presentationMode: "preparation",
    viewportWidth: 1502,
    viewportHeight: 942,
    preparationCount: 5,
  });
  assert.equal(obs.hvcCameraContract, "fixed");
  assert.equal(obs.hvcTopologyZContract, 0);
  assert.equal(obs.hvcSchematicQualifies, false);
});

test("6V machine invariants: camera/z + no auto-focus in prep", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = beginNexoraMVPDailyPreparation(state);
  assert.equal(state.focusedSubject, null);
  assert.equal(state.selectedSubject, null);
  let presentation = deriveNexoraMVPStageInteractionPresentation(state);
  assert.equal(presentation.presentationMode, "preparation");
  for (const object of presentation.scene.objects) {
    const z =
      Array.isArray(object.position) ? object.position[2] : object.position?.z;
    if (z != null) assert.equal(z, 0);
  }
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  presentation = deriveNexoraMVPStageInteractionPresentation(state);
  assert.equal(presentation.focusedSubjectId, "obj-capacity");
  assert.equal(presentation.presentationMode, "object-focus");
});

test("6V verify status awaits runtime captures without forcing PASS", () => {
  const pending = verifyExecutiveStageHumanVisualCertification({
    realCaptureCount: 0,
  });
  assert.equal(pending.status, "AwaitingRuntimeCaptures");
  const signed = verifyExecutiveStageHumanVisualCertification({
    realCaptureCount: 12,
    blockingStatesGradeOk: true,
    machineInvariantsOk: true,
  });
  assert.equal(signed.status, "HVC-PASS-WITH-MINOR-DEBT");
});
