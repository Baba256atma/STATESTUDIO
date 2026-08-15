/**
 * NEX-MVP:4 — pure Object Interaction tests (no WebGL).
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getNexoraMVPObjectInteractionIdentity,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPInteractionSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  syncNexoraMVPObjectInteractionShellContext,
  verifyNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionCatalog,
} from "./nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "./nexoraMVPObjectInteractionFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "./nexoraMVPStageFixtures.ts";

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

describe("NEX-MVP:4 Nexora Object Interaction", () => {
  it("identity and verify gate", () => {
    const identity = getNexoraMVPObjectInteractionIdentity();
    assert.equal(identity.id, "NEX-MVP:4/NexoraObjectInteraction");
    assert.equal(identity.version, "2.0.0");
    assert.equal(identity.namespace, "nexora.mvp.object-interaction");
    assert.equal(
      identity.architecturalRole,
      "MVPExecutiveObjectInteractionCoordinator",
    );
    assert.equal(verifyNexoraMVPObjectInteraction().ok, true);
  });

  it("1. selecting a valid object focuses it", () => {
    const next = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    assert.equal(next.mode, "object-focused");
    assert.equal(next.selectedSubject?.id, "obj-revenue");
    assert.equal(next.focusedSubject?.id, "obj-revenue");
    assert.equal(next.selectedSubject?.kind, "object");
  });

  it("2. invalid subject rejection leaves state unchanged", () => {
    const before = initial();
    const after = selectNexoraMVPInteractionSubject(before, "obj-does-not-exist");
    assert.deepEqual(after, before);
    assert.equal(resolveNexoraMVPInteractionSubject("missing"), null);
  });

  it("3. focus derivation drives Stage presentation", () => {
    const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    assert.equal(presentation.focusedSubjectId, "obj-revenue");
    assert.equal(presentation.scene.mode, "focus");
    const focused = presentation.scene.objects.find((o) => o.id === "obj-revenue");
    assert.ok(focused);
    assert.equal(focused.role, "focused");
    assert.equal(focused.focused, true);
  });

  it("4. direct relationship resolution emphasizes related objects", () => {
    const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    assert.ok(presentation.emphasizedObjectIds.includes("obj-revenue"));
    assert.ok(presentation.emphasizedRelationshipIds.length >= 0);
    const related = presentation.scene.objects.filter((o) => o.role === "related");
    assert.ok(related.length > 0);
  });

  it("5. unrelated object subordination", () => {
    const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    assert.ok(presentation.subordinateObjectIds.length > 0);
    for (const id of presentation.subordinateObjectIds) {
      const object = presentation.scene.objects.find((entry) => entry.id === id);
      assert.equal(object?.role, "unrelated");
    }
  });

  it("6. context subject derivation for Revenue", () => {
    // SP:4.1B — MINIMUM collapses the Executive Thread; OPERATION expands it.
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const minimum = deriveNexoraMVPStageInteractionPresentation(focused);
    assert.ok(
      minimum.contextNodes.some((node) => node.role === "collapsed-thread"),
    );
    assert.equal(
      minimum.contextNodes.filter((node) =>
        ["problem", "scenario", "decision", "execution"].includes(node.kind),
      ).length,
      0,
    );

    const operationState = syncNexoraMVPObjectInteractionShellContext(focused, {
      workspace: focused.workspace,
      presentationState: "operation",
      environmentIntent: focused.environmentIntent,
    });
    // STAGE-THREAD:1-FIX / STAGE-PROD:0 — Operation keeps gateway until expand.
    const collapsedPresentation =
      deriveNexoraMVPStageInteractionPresentation(operationState);
    assert.ok(
      collapsedPresentation.contextNodes.some(
        (node) => node.role === "collapsed-thread",
      ),
    );
    assert.equal(
      collapsedPresentation.contextNodes.filter((node) =>
        ["problem", "scenario", "decision", "execution"].includes(node.kind),
      ).length,
      0,
    );

    const expanded = selectNexoraMVPInteractionSubject(
      operationState,
      "thread-obj-revenue",
    );
    assert.equal(expanded.expandExecutiveThread, true);
    const presentation = deriveNexoraMVPStageInteractionPresentation(expanded);
    // STAGE-THREAD:1 — expanded executive-work projects as Stage objects.
    const kinds = new Set(
      presentation.scene.objects
        .filter((object) =>
          ["problem", "scenario", "decision", "execution"].includes(object.kind),
        )
        .map((object) => object.kind),
    );
    assert.ok(kinds.has("problem"));
    assert.ok(kinds.has("scenario"));
    assert.ok(kinds.has("decision"));
    assert.ok(
      presentation.scene.objects.some((n) => n.id === "ctx-scenario-pricing"),
    );
  });

  it("7. stable context ordering is deterministic", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const operationState = syncNexoraMVPObjectInteractionShellContext(focused, {
      workspace: focused.workspace,
      presentationState: "operation",
      environmentIntent: focused.environmentIntent,
    });
    const state = selectNexoraMVPInteractionSubject(
      operationState,
      "thread-obj-revenue",
    );
    const a = deriveNexoraMVPStageInteractionPresentation(state);
    const b = deriveNexoraMVPStageInteractionPresentation(state);
    const workIds = (presentation: typeof a) =>
      presentation.scene.objects
        .filter((object) => object.id.startsWith("ctx-"))
        .map((object) => object.id);
    assert.deepEqual(workIds(a), workIds(b));
    const ids = workIds(a);
    const problems = ids.filter((id) => id.startsWith("ctx-problem"));
    const scenarios = ids.filter((id) => id.startsWith("ctx-scenario"));
    assert.ok(problems.length > 0 && scenarios.length > 0);
    assert.ok(ids.indexOf(problems[0]!) < ids.indexOf(scenarios[0]!));
  });

  it("8. sparse object behavior fabricates no context nodes", () => {
    // Inventory has no context links in the default catalog.
    const state = selectNexoraMVPInteractionSubject(initial(), "obj-inventory");
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    assert.equal(presentation.mode, "object-focused");
    assert.equal(presentation.contextNodes.length, 0);
  });

  it("9. object with many relationships caps context density", () => {
    const manySubjects = Array.from({ length: 12 }, (_, index) =>
      Object.freeze({
        id: `ctx-extra-${index}`,
        label: `Extra ${index}`,
        kind: (["problem", "scenario", "decision", "execution"] as const)[
          index % 4
        ]!,
        status: "stable" as const,
        attention: "normal" as const,
      }),
    );
    const manyLinks = manySubjects.map((subject, index) =>
      Object.freeze({
        id: `link-extra-${index}`,
        objectId: "obj-revenue",
        contextId: subject.id,
        relation: "association",
      }),
    );
    const catalog: NexoraMVPObjectInteractionCatalog = {
      objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
      relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
      contextSubjects: Object.freeze([
        ...NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
        ...manySubjects,
      ]),
      contextLinks: Object.freeze([
        ...NEXORA_MVP_CONTEXT_LINK_FIXTURES,
        ...manyLinks,
      ]),
    };
    const state = selectNexoraMVPInteractionSubject(
      initial(),
      "obj-revenue",
      catalog,
    );
    const presentation = deriveNexoraMVPStageInteractionPresentation(
      state,
      catalog,
    );
    assert.ok(presentation.contextNodes.length <= 8);
  });

  it("10. overview reset clears focus and preserves shell context", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const reset = resetNexoraMVPObjectInteractionOverview(focused);
    assert.equal(reset.mode, "overview");
    assert.equal(reset.selectedSubject, null);
    assert.equal(reset.focusedSubject, null);
    assert.equal(reset.workspace, "overview");
    assert.equal(reset.presentationState, "minimum");
    assert.equal(reset.environmentIntent, "neutral");
  });

  it("11. back transition: context → object → overview", () => {
    const object = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const context = selectNexoraMVPInteractionSubject(
      object,
      "ctx-scenario-pricing",
    );
    assert.equal(context.mode, "context-focused");
    assert.equal(context.focusedSubject?.id, "ctx-scenario-pricing");

    const backToObject = stepBackNexoraMVPObjectInteraction(context);
    assert.equal(backToObject.mode, "object-focused");
    assert.equal(backToObject.focusedSubject?.id, "obj-revenue");

    const backToOverview = stepBackNexoraMVPObjectInteraction(backToObject);
    assert.equal(backToOverview.mode, "overview");
    assert.equal(backToOverview.focusedSubject, null);
  });

  it("12. workspace preservation across object focus", () => {
    const scenarioShell = createInitialNexoraMVPObjectInteractionState({
      workspace: "scenario",
      presentationState: "minimum",
      environmentIntent: "simulate",
    });
    const focused = selectNexoraMVPInteractionSubject(
      scenarioShell,
      "obj-revenue",
    );
    assert.equal(focused.workspace, "scenario");
    assert.equal(focused.environmentIntent, "simulate");
  });

  it("13. presentation-state preservation across selection", () => {
    const reportShell = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const focused = selectNexoraMVPInteractionSubject(
      reportShell,
      "obj-capacity",
    );
    assert.equal(focused.presentationState, "report");
    const presentation = deriveNexoraMVPStageInteractionPresentation(focused);
    assert.equal(presentation.scene.presentationState, "report");
  });

  it("14. deterministic repeated resolution", () => {
    const a = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const b = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const pa = deriveNexoraMVPStageInteractionPresentation(a);
    const pb = deriveNexoraMVPStageInteractionPresentation(b);
    assert.equal(JSON.stringify(pa), JSON.stringify(pb));
  });

  it("advisor bridge updates with focus", () => {
    const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
    assert.equal(bridge.focusedSubject?.id, "obj-revenue");
    assert.equal(bridge.subjectKind, "object");
    assert.ok(bridge.contextSubjectIds.length > 0);
    assert.equal(bridge.activeWorkspace, "overview");
  });

  it("shell context sync preserves focus", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const synced = syncNexoraMVPObjectInteractionShellContext(focused, {
      workspace: "problem",
      presentationState: "operation",
      environmentIntent: "investigate",
    });
    assert.equal(synced.focusedSubject?.id, "obj-revenue");
    assert.equal(synced.workspace, "problem");
    assert.equal(synced.presentationState, "operation");
    assert.equal(synced.environmentIntent, "investigate");
  });

  it("environment intent preserved on object click", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "decision",
      presentationState: "minimum",
      environmentIntent: "commit",
    });
    const next = selectNexoraMVPInteractionSubject(start, "obj-revenue");
    assert.equal(next.environmentIntent, "commit");
  });
});
