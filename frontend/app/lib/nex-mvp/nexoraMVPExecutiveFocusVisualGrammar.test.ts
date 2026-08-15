/**
 * SP:4.1C — final grammar pass restores calibrated separation after choreography.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import { EXECUTIVE_FOCUS_VISUAL_SCALE } from "../spatial-presentation/executiveFocusVisualGrammar.ts";

test("final grammar pass restores restrained Revenue focus scale after smash", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  const base = deriveNexoraMVPStageInteractionPresentation(state);

  const smashed = Object.freeze({
    ...base,
    scene: Object.freeze({
      ...base.scene,
      objects: Object.freeze(
        base.scene.objects.map((object) =>
          Object.freeze({
            ...object,
            scale:
              object.id === "obj-revenue"
                ? 1.32
                : object.disclosureState === "hidden"
                  ? object.scale
                  : 1.05,
            targetPosition:
              object.id === "obj-revenue"
                ? ([0, 0.42, 0.14] as const)
                : ([
                    object.targetPosition[0] * 0.35,
                    object.targetPosition[1],
                    object.targetPosition[2] * 0.35,
                  ] as const),
          }),
        ),
      ),
    }),
  });

  const restored = applyExecutiveFocusVisualGrammarToStagePresentation(
    smashed,
    { presentationDepth: "minimum" },
  );
  const revenue = restored.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.ok(revenue.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary);
  assert.equal(revenue.visualGrammarRole, "primary");

  const visible = restored.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  );
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const left = visible[i]!;
      const right = visible[j]!;
      const dist = Math.hypot(
        left.targetPosition[0] - right.targetPosition[0],
        left.targetPosition[1] - right.targetPosition[1],
        left.targetPosition[2] - right.targetPosition[2],
      );
      assert.ok(dist > 0.55, `${left.id}/${right.id} still piled (${dist})`);
    }
  }
});

test("final grammar pass keeps collapsed thread subordinate", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  const presentation = applyExecutiveFocusVisualGrammarToStagePresentation(
    deriveNexoraMVPStageInteractionPresentation(state),
    { presentationDepth: "minimum" },
  );
  const thread = presentation.contextNodes.find(
    (node) => node.role === "collapsed-thread",
  );
  assert.ok(thread);
  assert.ok(thread!.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.collapsedThread + 0.05);
  const related = presentation.scene.objects.find(
    (entry) => entry.role === "related" || entry.visualGrammarRole === "related",
  );
  if (related != null) {
    assert.ok(thread!.scale < related.scale);
  }
});
