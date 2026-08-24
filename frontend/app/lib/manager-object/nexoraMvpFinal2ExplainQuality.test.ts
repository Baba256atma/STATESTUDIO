/**
 * NEX-MVP-FINAL:2 — Explain quality: object meaning over change fallback.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { classifyNexoraExiUtterance } from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `nex-mvp-final2-${utterance}`,
  });
}

describe("NEX-MVP-FINAL:2 Manager Object Explain Quality", () => {
  it("does not classify Explain as EXI change", () => {
    assert.equal(classifyNexoraExiUtterance("explain it"), null);
    assert.equal(classifyNexoraExiUtterance("explain this"), null);
    assert.equal(classifyNexoraExiUtterance("Explain Inventory"), null);
    assert.equal(classifyNexoraExiUtterance("What changed?"), "change");
  });

  it("show inventory then explain it explains Inventory, not prior-state comparison", () => {
    const shown = run("show inventory");
    assert.equal(shown.nextRuntimeState.focusedSubject?.id, "obj-inventory");
    assert.match(shown.response, /Inventory/i);
    const explained = run("explain it.", shown);
    assert.equal(
      explained.contextResult.context.primarySubject?.subjectId,
      "obj-inventory",
    );
    assert.match(explained.response, /Inventory/i);
    assert.doesNotMatch(explained.response, /prior-state comparison/i);
    assert.doesNotMatch(explained.response, /Unknown goal/i);
    assert.doesNotMatch(explained.response, /MISSING_GOAL/);
    assert.doesNotMatch(explained.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
    assert.match(
      explained.response,
      /Turns|Stable|Capacity|attention|state/i,
    );
    assert.ok(explained.response.length > 40);
  });

  it("named Explain uses the same engine path for representative objects", () => {
    const cases = [
      ["show capacity", "Explain Capacity.", /Capacity/i],
      ["show delivery", "Explain Delivery.", /Delivery/i],
      ["show risk", "Explain Risk.", /Risk/i],
    ] as const;
    for (const [show, explain, expected] of cases) {
      const focused = run(show);
      const result = run(explain, focused);
      assert.match(result.response, expected);
      assert.doesNotMatch(result.response, /prior-state comparison/i);
    }
  });

  it("deictic it follows the latest focused object", () => {
    const inventory = run("show inventory");
    const capacity = run("show capacity", inventory);
    const explained = run("explain it.", capacity);
    assert.equal(
      explained.contextResult.context.primarySubject?.subjectId,
      "obj-capacity",
    );
    assert.match(explained.response, /Capacity/i);
    assert.doesNotMatch(explained.response, /Inventory currently/i);
  });

  it("show risk problem does not silently pick Margin Pressure", () => {
    const result = run("show risk problem");
    assert.notEqual(
      result.contextResult.context.primarySubject?.subjectId,
      "ctx-problem-margin",
    );
    assert.match(result.response, /more than one|which one|which item|Which/i);
  });

  it("show Margin Pressure still focuses that problem", () => {
    const result = run("show Margin Pressure");
    assert.equal(
      result.contextResult.context.primarySubject?.subjectId,
      "ctx-problem-margin",
    );
  });

  it("generic explain engine has no Inventory branch", () => {
    const source = readFileSync(
      join(here, "managerObjectExplainEngine.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /if \(label === ["']Inventory["']\)/);
    assert.doesNotMatch(source, /obj-inventory/);
  });
});
