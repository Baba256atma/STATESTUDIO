/**
 * MO:1 — Manager–Object Interaction Foundation certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_UX2_INTERACTION_LAW } from "../spatial-presentation/executiveStage2DTopologyRecomposition.ts";
import {
  collectManagerObjectContext,
} from "./managerObjectContext.ts";
import {
  MANAGER_OBJECT_REGISTERED_GOAL,
  projectManagerObjectConversationalSubjects,
} from "./managerObjectCatalog.ts";
import {
  createEmptyManagerObjectSession,
} from "./managerObjectActive.ts";
import {
  getManagerObjectInteractionFoundationIdentity,
  MANAGER_OBJECT_INTERACTION_BOUNDARY,
} from "./managerObjectInteractionFoundation.ts";
import {
  resolveManagerObjectTurn,
  verifyManagerObjectInteractionFoundation,
} from "./managerObjectInteraction.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function subjects() {
  return projectManagerObjectConversationalSubjects();
}

function run(
  utterance: string,
  options?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: options?.state ?? previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `mo1-${utterance}`,
  });
}

describe("MO:1 Manager–Object Interaction Foundation", () => {
  it("identity, boundary, and verify gate", () => {
    const identity = getManagerObjectInteractionFoundationIdentity();
    assert.equal(identity.id, "MO:1/ManagerObjectInteractionFoundation");
    assert.equal(MANAGER_OBJECT_INTERACTION_BOUNDARY.createsParallelTruth, false);
    assert.equal(MANAGER_OBJECT_INTERACTION_BOUNDARY.startsMo2, false);
    assert.equal(MANAGER_OBJECT_INTERACTION_BOUNDARY.redesignsStage, false);
    assert.equal(verifyManagerObjectInteractionFoundation().ok, true);
  });

  it("1. Capacity can become active", () => {
    const click = resolveManagerObjectTurn({
      activation: "click",
      clickedObjectId: "obj-capacity",
      previousSession: createEmptyManagerObjectSession(),
    });
    assert.equal(click.activeObjectId, "obj-capacity");
    const spoken = run("Focus on Capacity");
    assert.equal(spoken.managerObjectTurn.activeObjectId, "obj-capacity");
  });

  it("2. Delivery can become active", () => {
    const click = resolveManagerObjectTurn({
      activation: "click",
      clickedObjectId: "obj-delivery",
      previousSession: createEmptyManagerObjectSession(),
    });
    assert.equal(click.activeObjectId, "obj-delivery");
    const spoken = run("Focus on Delivery");
    assert.equal(spoken.managerObjectTurn.activeObjectId, "obj-delivery");
  });

  it("3. Goal can become active", () => {
    const turn = resolveManagerObjectTurn({
      utterance: "Explain Goal",
      conversationalKind: "explain",
      hasNamedTargetHint: true,
      namedSubjectId: MANAGER_OBJECT_REGISTERED_GOAL.objectId,
      subjects: subjects(),
    });
    assert.equal(turn.activeObjectId, MANAGER_OBJECT_REGISTERED_GOAL.objectId);
    assert.equal(turn.context.objectKind.value, "goal");
    const spoken = run("Explain Close Capacity Gap");
    assert.equal(
      spoken.managerObjectTurn.activeObjectId,
      MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    );
  });

  it("4. Problem/Risk can become active", () => {
    const problem = run("Focus on Capacity Gap");
    assert.equal(problem.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
    const risk = run("Focus on Risk");
    assert.equal(risk.managerObjectTurn.activeObjectId, "obj-risk");
  });

  it("5. Scenario can become active", () => {
    const spoken = run("Focus on Capacity Expansion Plan");
    assert.equal(spoken.managerObjectTurn.activeObjectId, "ctx-scenario-capacity");
  });

  it("6. Decision can become active", () => {
    const spoken = run("Focus on Expand Capacity");
    assert.equal(spoken.managerObjectTurn.activeObjectId, "ctx-decision-capacity");
  });

  it("7. Execution can become active", () => {
    const spoken = run("Focus on Capacity Expansion");
    assert.equal(
      spoken.managerObjectTurn.activeObjectId,
      "ctx-execution-capacity",
    );
  });

  it("8. Explain X resolves the requested object rather than a hard-coded default", () => {
    const delivery = run("Explain Delivery");
    assert.equal(delivery.managerObjectTurn.activeObjectId, "obj-delivery");
    assert.equal(delivery.contextResult.context.primarySubject?.subjectId, "obj-delivery");
    assert.notEqual(delivery.managerObjectTurn.activeObjectId, "obj-capacity");
    const capacity = run("Explain Capacity");
    assert.equal(capacity.managerObjectTurn.activeObjectId, "obj-capacity");
    const why = resolveNexoraConversationalIntent({
      utterance: "Why is Capacity critical?",
    });
    assert.equal(why.intent.kind, "explain");
    assert.equal(why.intent.targetHints[0]?.raw, "capacity");
  });

  it("9. Explain this uses the current active object", () => {
    const capacity = run("Focus on Capacity");
    const explanation = run("Explain this", { previous: capacity });
    assert.equal(explanation.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.equal(explanation.managerObjectTurn.usesActiveObject, true);
  });

  it("10. Follow-up questions preserve object context", () => {
    const capacity = run("Focus on Capacity");
    const why = run("Why?", { previous: capacity });
    assert.equal(why.managerObjectTurn.activeObjectId, "obj-capacity");
    const next = run("What should I do about this?", { previous: why });
    assert.equal(next.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.equal(next.managerObjectTurn.intent, "RECOMMEND");
  });

  it("11. Switching objects replaces active context correctly", () => {
    const capacity = run("Focus on Capacity");
    assert.equal(capacity.managerObjectTurn.activeObjectId, "obj-capacity");
    const delivery = run("Explain Delivery", { previous: capacity });
    assert.equal(delivery.managerObjectTurn.activeObjectId, "obj-delivery");
    assert.equal(
      delivery.managerObjectTurn.session.previousActiveObjectId,
      "obj-capacity",
    );
  });

  it("12. Related objects are discoverable through the generic relationship contract", () => {
    const context = collectManagerObjectContext("obj-capacity");
    const related = context.relationships.map((edge) => edge.otherId);
    assert.ok(related.includes("obj-delivery") || related.includes("obj-budget"));
    assert.ok(related.includes("ctx-problem-capacity"));
    assert.equal(
      context.relationships.every((edge) => edge.relationshipId.length > 0),
      true,
    );
  });

  it("13. Missing evidence is reported as unknown rather than fabricated", () => {
    const demand = collectManagerObjectContext("obj-demand");
    assert.equal(demand.kpi.support, "UNKNOWN");
    assert.equal(demand.kpi.value, null);
    assert.equal(demand.executiveMeaning.support, "UNKNOWN");
    assert.equal(demand.outcomes.support, "UNKNOWN");
    const preview = resolveManagerObjectTurn({
      clickedObjectId: "obj-demand",
      activation: "click",
    });
    assert.match(preview.explainPreview.uncertainty, /UNKNOWN/);
    assert.equal(preview.explainPreview.fabricated, false);
    assert.doesNotMatch(preview.explainPreview.explanation, /\$8\.4M/);
  });

  it("14. Existing Stage click-to-center behavior remains intact", () => {
    const focused = selectNexoraMVPInteractionSubject(
      initialState(),
      "obj-delivery",
    );
    const base = deriveNexoraMVPStageInteractionPresentation(focused);
    const presentation = applyExecutiveStageFixedCameraToStagePresentation(
      applyExecutiveStage2DTopologyRecompositionToStagePresentation(
        applyExecutiveStage2DTopologyPlaneToStagePresentation(
          applyExecutivePresentationPlaneToStagePresentation(
            applyExecutiveNetworkTopologyToStagePresentation(
              applyExecutiveFocusVisualGrammarToStagePresentation(base, {
                presentationDepth: "minimum",
              }),
            ),
          ),
        ),
      ),
    );
    const delivery = presentation.scene.objects.find((o) => o.id === "obj-delivery");
    assert.ok(delivery);
    assert.equal(focused.focusedSubject?.id, "obj-delivery");
    assert.equal(delivery.focused, true);
    assert.equal(delivery.targetPosition[0], 0);
    assert.equal(delivery.targetPosition[1], 0);
    assert.deepEqual(EXECUTIVE_STAGE_2D_CENTER, { x: 0, y: 0, z: 0 });
    assert.equal(
      EXECUTIVE_STAGE_UX2_INTERACTION_LAW.statement,
      "CLICK OBJECT → CENTER → RECOMPOSE RELATED CONTEXT",
    );
    assert.equal(EXECUTIVE_STAGE_UX2_INTERACTION_LAW.camera, "fixed");
    const source = readFileSync(
      join(here, "../nex-mvp/nexoraMVPObjectInteraction.ts"),
      "utf8",
    );
    assert.match(source, /selectNexoraMVPInteractionSubject/);
  });

  it("15. UX:1–UX:6 certified identities remain imported by live tests", () => {
    const ux2 = readFileSync(
      join(here, "../nex-mvp/nexoraExecutiveUx2StageInteraction.test.ts"),
      "utf8",
    );
    const ux4 = readFileSync(
      join(here, "../nex-mvp/nexoraExecutiveUx4WorkingChat.test.ts"),
      "utf8",
    );
    const ux6 = readFileSync(
      join(here, "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts"),
      "utf8",
    );
    assert.match(ux2, /UX:2/);
    assert.match(ux4, /UX:4/);
    assert.match(ux6, /MVP:1\/NexoraManagerMVPReleaseBaseline/);
    assert.equal(MANAGER_OBJECT_INTERACTION_BOUNDARY.redesignsAdvisor, false);
  });

  it("generic intents work across object types without per-object branches", () => {
    const source = readFileSync(
      join(here, "managerObjectIntent.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|Capacity Gap/);
    const deliveryWhy = resolveManagerObjectTurn({
      utterance: "Why is Delivery critical?",
      conversationalKind: "explain",
      hasNamedTargetHint: true,
      namedSubjectId: "obj-delivery",
      subjects: subjects(),
    });
    assert.equal(deliveryWhy.intent, "WHY");
    const riskOptions = resolveManagerObjectTurn({
      utterance: "What are my options?",
      conversationalKind: "situation",
      namedSubjectId: null,
      previousSession: {
        activeObjectId: "obj-risk",
        previousActiveObjectId: null,
        activationSource: "click",
      },
      subjects: subjects(),
    });
    assert.equal(riskOptions.activeObjectId, "obj-risk");
    assert.equal(riskOptions.intent, "OPTIONS");
  });
});
