/**
 * MO-INT:1 — Manager–Object Executive Experience Integration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  MANAGER_OBJECT_EXPERIENCE_BOUNDARY,
  getManagerObjectExperienceIntegrationIdentity,
  verifyManagerObjectExperienceIntegration,
} from "./managerObjectExperienceComposer.ts";
import { resolveManagerObjectTurn } from "./managerObjectInteraction.ts";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
} from "./managerObjectActive.ts";

const here = dirname(fileURLToPath(import.meta.url));

function subjects() {
  return projectManagerObjectConversationalSubjects();
}

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `mo-int1-${utterance}`,
  });
}

describe("MO-INT:1 Manager–Object Executive Experience Integration", () => {
  it("identity and boundary — not MO:7", () => {
    assert.equal(
      getManagerObjectExperienceIntegrationIdentity().id,
      "MO-INT:1/ManagerObjectExecutiveExperienceIntegration",
    );
    assert.equal(MANAGER_OBJECT_EXPERIENCE_BOUNDARY.createsMo7, false);
    assert.equal(MANAGER_OBJECT_EXPERIENCE_BOUNDARY.newAdvisor, false);
    assert.equal(MANAGER_OBJECT_EXPERIENCE_BOUNDARY.usesLlm, false);
    assert.equal(verifyManagerObjectExperienceIntegration().ok, true);
  });

  it("generic composer has no object-identity routing", () => {
    const source = readFileSync(join(here, "managerObjectExperienceComposer.ts"), "utf8");
    assert.doesNotMatch(source, /if\s*\([^)]*Capacity|if\s*\([^)]*Revenue|if\s*\([^)]*ScenarioB/);
    assert.doesNotMatch(source, /obj-capacity|obj-revenue/);
  });

  it("manager-facing copy does not expose engine ids", () => {
    const stated = run("My goal is to improve delivery reliability.");
    const capacity = run("Explain Capacity.", { previous: stated });
    const where = run("Where are we?", { previous: capacity });
    const attention = run("What needs my attention?", { previous: where });
    const next = run("What should I do next?", { previous: attention });
    const blob = `${where.response} ${attention.response} ${next.response}`;
    assert.doesNotMatch(blob, /\bMO:[1-6]\b/);
    assert.doesNotMatch(blob, /\bobj-[a-z0-9-]+\b/);
  });

  it("duplicate guidance is collapsed to one next step on journey questions", () => {
    const stated = run("My goal is to improve delivery reliability.");
    const problem = run("Explain Capacity Gap.", { previous: stated });
    const where = run("Where are we?", { previous: problem });
    const matches = where.response.match(/Recommended next:/g) ?? [];
    assert.ok(matches.length <= 1);
    assert.match(where.response, /Goal:|Where we are/i);
  });

  it("full conversation remains one experience", () => {
    const goal = run("My goal is to improve delivery reliability.");
    const show = run("Show Capacity.", { previous: goal });
    assert.equal(show.managerObjectTurn.activeObjectId, "obj-capacity");
    const explain = run("Explain this.", { previous: show });
    assert.equal(explain.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.doesNotMatch(explain.response, /Explanation:|Exploration:|Navigation:/);
    const connected = run("What is connected?", { previous: explain });
    assert.match(connected.response, /related|connected/i);
    const look = run("Where should I look next?", { previous: connected });
    assert.match(look.response, /Recommended next:|Recommended direction|Capacity Gap/i);
    const why = run("Why?", { previous: look });
    assert.match(why.response, /Capacity Gap|connected|goal/i);
    const gap = run("Show Capacity Gap.", { previous: why });
    assert.equal(gap.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
    const where = run("Where are we now?", { previous: gap });
    assert.match(where.response, /Goal:|Where we are|waiting/i);
    const block = run("What is blocking us?", { previous: where });
    assert.match(block.response, /blocker|decision/i);
    const attention = run("What needs my attention?", { previous: block });
    assert.match(attention.response, /Needs your attention|No manager intervention|Intervention/i);
    assert.equal(attention.managerObjectTurn.attention.stealsDirectFocus, false);
    const intervene = run("Do I need to intervene?", { previous: attention });
    assert.match(intervene.response, /Intervention:/i);
    assert.doesNotMatch(intervene.response, /I approved/i);
    const continueWithout = run("What can continue without me?", { previous: intervene });
    assert.match(continueWithout.response, /continue|watching|intervention|without/i);
  });

  it("what about compares without stealing focus", () => {
    const stated = run("My goal is to improve delivery reliability.");
    const capacity = run("Explain Capacity.", { previous: stated });
    const attention = run("What needs my attention?", { previous: capacity });
    const about = run("What about Revenue?", { previous: attention });
    assert.equal(about.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.match(about.response, /Revenue|outranks|highest-priority|ranking/i);
  });

  it("generic object types stay on one engine", () => {
    for (const [utterance, id] of [
      ["Explain Close Capacity Gap.", "goal-capacity-availability"],
      ["Explain Capacity.", "obj-capacity"],
      ["Explain Capacity Gap.", "ctx-problem-capacity"],
      ["Explain Risk.", "obj-risk"],
      ["Explain Capacity Expansion Plan.", "ctx-scenario-capacity"],
      ["Explain Expand Capacity.", "ctx-decision-capacity"],
      ["Explain Capacity Expansion.", "ctx-execution-capacity"],
    ] as const) {
      const turn = resolveManagerObjectTurn({
        utterance,
        conversationalKind: "explain",
        hasNamedTargetHint: true,
        namedSubjectId: id,
        subjects: subjects(),
      });
      assert.equal(turn.activeObjectId, id);
      assert.equal(turn.explanation.engineId, "MO:2/GenericExplainEngine");
      assert.equal(turn.attention.engineId, "MO:6/ExecutiveAttentionInterventionIntelligence");
    }
  });

  it("click activation matches show navigation for active object", () => {
    const show = run("Show Capacity.");
    const clicked = activateManagerObjectFromClick(
      createEmptyManagerObjectSession(),
      "obj-capacity",
    );
    assert.equal(show.managerObjectTurn.activeObjectId, clicked.activeObjectId);
    assert.equal(clicked.activationSource, "click");
  });

  it("explain named object does not require a new Stage writer", () => {
    const explained = run("Explain Margin Pressure.");
    assert.equal(explained.managerObjectTurn.navigation.writesStageCoordinates, false);
    assert.equal(explained.managerObjectTurn.attention.stealsDirectFocus, false);
  });
});
