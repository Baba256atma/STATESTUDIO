/**
 * SP:4.1B — Executive Focus Scene Disclosure tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY,
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET,
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_COMPLEXITY,
  compareExecutiveFocusPresentationDepth,
  executiveFocusSceneDisclosureArchitecturalRole,
  executiveFocusSceneDisclosureIdentity,
  executiveFocusSceneDisclosureNamespace,
  executiveFocusSceneDisclosureVersion,
  getExecutiveFocusSceneDisclosureIdentity,
  isExecutiveFocusConnectionDisclosed,
  rankExecutiveFocusRelatedBusinessObjects,
  resolveExecutiveFocusSceneDisclosure,
  verifyExecutiveFocusSceneDisclosure,
  type ExecutiveFocusSceneSubjectInput,
  type ResolveExecutiveFocusSceneDisclosureInput,
} from "./executiveFocusSceneDisclosure.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  EXECUTIVE_TOPOLOGY_STAGE_LAYOUT,
  resolveExecutiveTopologyGuidedStageComposition,
} from "./executiveTopologyGuidedStageComposition.ts";

const source = readFileSync(
  new URL("./executiveFocusSceneDisclosure.ts", import.meta.url),
  "utf8",
);

const stageSource = readFileSync(
  new URL("../nex-mvp/nexora3DExecutiveStage.ts", import.meta.url),
  "utf8",
);

const subjects: readonly ExecutiveFocusSceneSubjectInput[] = Object.freeze([
  Object.freeze({
    subjectId: "obj-capacity",
    family: "business-object" as const,
    attention: "important",
    status: "watch",
  }),
  Object.freeze({
    subjectId: "obj-inventory",
    family: "business-object" as const,
    attention: "normal",
    status: "stable",
  }),
  Object.freeze({
    subjectId: "obj-delivery",
    family: "business-object" as const,
    attention: "important",
    status: "watch",
  }),
  Object.freeze({
    subjectId: "obj-demand",
    family: "business-object" as const,
    attention: "elevated",
    status: "watch",
  }),
  Object.freeze({
    subjectId: "obj-risk",
    family: "business-object" as const,
    attention: "critical",
    status: "risk",
  }),
  Object.freeze({
    subjectId: "obj-budget",
    family: "business-object" as const,
    attention: "normal",
    status: "stable",
  }),
  Object.freeze({
    subjectId: "obj-customer",
    family: "business-object" as const,
    attention: "elevated",
    status: "stable",
  }),
  Object.freeze({
    subjectId: "obj-revenue",
    family: "business-object" as const,
    attention: "elevated",
    status: "stable",
  }),
  Object.freeze({
    subjectId: "ctx-problem",
    family: "executive-work" as const,
    workKind: "problem" as const,
    linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
  }),
  Object.freeze({
    subjectId: "ctx-scenario",
    family: "executive-work" as const,
    workKind: "scenario" as const,
    linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
  }),
  Object.freeze({
    subjectId: "ctx-decision",
    family: "executive-work" as const,
    workKind: "decision" as const,
    linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
  }),
  Object.freeze({
    subjectId: "ctx-execution",
    family: "executive-work" as const,
    workKind: "execution" as const,
    linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
  }),
]);

const relationships = Object.freeze([
  Object.freeze({
    id: "r-inv-cap",
    sourceId: "obj-inventory",
    targetId: "obj-capacity",
  }),
  Object.freeze({
    id: "r-cap-del",
    sourceId: "obj-capacity",
    targetId: "obj-delivery",
  }),
  Object.freeze({
    id: "r-bud-cap",
    sourceId: "obj-budget",
    targetId: "obj-capacity",
  }),
  Object.freeze({
    id: "r-risk-del",
    sourceId: "obj-risk",
    targetId: "obj-delivery",
  }),
  Object.freeze({
    id: "r-dem-del",
    sourceId: "obj-demand",
    targetId: "obj-delivery",
  }),
]);

function disclose(
  depth: ResolveExecutiveFocusSceneDisclosureInput["presentationDepth"],
  extras?: Partial<ResolveExecutiveFocusSceneDisclosureInput>,
) {
  return resolveExecutiveFocusSceneDisclosure({
    subjects,
    relationships,
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: depth,
    ...extras,
  });
}

test("1. deterministic disclosure", () => {
  const a = disclose("minimum");
  const b = disclose("minimum");
  assert.deepEqual(a.entries, b.entries);
  assert.deepEqual(a.visibleSubjectIds, b.visibleSubjectIds);
});

test("2. focused Business Object remains visible-primary", () => {
  const result = disclose("minimum");
  assert.equal(result.byId.get("obj-capacity")?.state, "visible-primary");
});

test("3. MINIMUM obeys visibility budget", () => {
  const result = disclose("minimum");
  assert.ok(result.visibleBudgetUsed <= result.visibleBudgetMax);
  assert.ok(
    result.visibleBudgetUsed <=
      EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.maxVisibleSubjects,
  );
});

test("4. MINIMUM limits related Business Objects", () => {
  const result = disclose("minimum");
  const related = result.entries.filter(
    (entry) =>
      entry.family === "business-object" && entry.state === "visible-related",
  );
  assert.ok(
    related.length <=
      EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.relatedBusiness,
  );
});

test("5. MINIMUM does not expand full Executive Thread", () => {
  const result = disclose("minimum");
  const expanded = result.entries.filter(
    (entry) =>
      entry.family === "executive-work" &&
      (entry.state === "visible-primary" || entry.state === "visible-related"),
  );
  assert.equal(expanded.length, 0);
  assert.equal(result.byId.get("ctx-problem")?.state, "hidden");
  assert.equal(result.byId.get("ctx-scenario")?.state, "hidden");
  assert.equal(result.byId.get("ctx-decision")?.state, "hidden");
  assert.equal(result.byId.get("ctx-execution")?.state, "hidden");
});

test("6. collapsed Executive Thread appears when relevant work exists", () => {
  const result = disclose("minimum");
  assert.equal(result.collapsedThreadSubjectId, "thread-obj-capacity");
  assert.equal(
    result.byId.get("thread-obj-capacity")?.state,
    "collapsed-thread",
  );
});

test("7. collapsed thread does not mutate canonical truth", () => {
  const result = disclose("minimum");
  const thread = result.byId.get("thread-obj-capacity")!;
  assert.deepEqual(thread.collapsedMemberIds, [
    "ctx-problem",
    "ctx-scenario",
    "ctx-decision",
    "ctx-execution",
  ]);
  assert.deepEqual(result.canonicalRelationshipIds, [
    "r-inv-cap",
    "r-cap-del",
    "r-bud-cap",
    "r-risk-del",
    "r-dem-del",
  ]);
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.inventsRelationships,
    false,
  );
});

test("8. REPORT keeps Thread collapsed until explicit expand (STAGE-THREAD:1-FIX)", () => {
  const minimum = disclose("minimum");
  const report = disclose("report");
  assert.ok(minimum.collapsedThreadSubjectId != null);
  assert.ok(report.collapsedThreadSubjectId != null);
  const reportWork = report.entries.filter(
    (entry) =>
      entry.family === "executive-work" &&
      (entry.state === "visible-primary" || entry.state === "visible-related"),
  );
  assert.equal(reportWork.length, 0);
  const reportExpanded = disclose("report", { expandExecutiveThread: true });
  const expandedWork = reportExpanded.entries.filter(
    (entry) =>
      entry.family === "executive-work" &&
      (entry.state === "visible-primary" || entry.state === "visible-related"),
  );
  assert.ok(expandedWork.length >= 2);
  assert.ok(expandedWork.some((entry) => entry.workKind === "problem"));
  assert.ok(expandedWork.some((entry) => entry.workKind === "scenario"));
});

test("9. OPERATION keeps gateway; explicit expand reveals full Thread", () => {
  const operation = disclose("operation");
  assert.ok(operation.collapsedThreadSubjectId != null);
  assert.equal(operation.byId.get("ctx-problem")?.state, "hidden");
  const expanded = disclose("operation", { expandExecutiveThread: true });
  assert.equal(expanded.collapsedThreadSubjectId, null);
  assert.equal(expanded.byId.get("ctx-problem")?.state, "visible-related");
  assert.equal(expanded.byId.get("ctx-scenario")?.state, "visible-related");
  assert.equal(expanded.byId.get("ctx-decision")?.state, "visible-related");
  assert.equal(expanded.byId.get("ctx-execution")?.state, "visible-related");
});

test("10. Presentation Depth ordering is monotonic", () => {
  assert.ok(
    compareExecutiveFocusPresentationDepth("minimum", "report") < 0,
  );
  assert.ok(
    compareExecutiveFocusPresentationDepth("report", "operation") < 0,
  );
  // STAGE-THREAD:1-FIX — collapsed gateway at all depths; expanded budgets grow.
  const minimum = disclose("minimum", { expandExecutiveThread: true })
    .visibleSubjectIds.length;
  const report = disclose("report", { expandExecutiveThread: true })
    .visibleSubjectIds.length;
  const operation = disclose("operation", { expandExecutiveThread: true })
    .visibleSubjectIds.length;
  assert.ok(minimum <= report);
  assert.ok(report <= operation);
});

test("11. critical competing attention remains discoverable", () => {
  const result = disclose("minimum");
  assert.equal(
    result.byId.get("obj-risk")?.state,
    "background-discoverable",
  );
});

test("12. unrelated normal objects are suppressed during focus", () => {
  const result = disclose("minimum");
  assert.equal(result.byId.get("obj-customer")?.state, "hidden");
  assert.equal(result.byId.get("obj-revenue")?.state, "hidden");
});

test("13. hidden objects retain original runtime state", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const revenue = scene.objects.find((entry) => entry.id === "obj-revenue")!;
  assert.equal(revenue.disclosureState, "hidden");
  assert.equal(revenue.attention, "elevated");
  assert.equal(revenue.status, "stable");
  assert.equal(revenue.id, "obj-revenue");
});

test("14. hidden objects do not retain active hit targets", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const hidden = scene.objects.filter(
    (entry) => entry.disclosureState === "hidden",
  );
  assert.ok(hidden.length > 0);
  assert.ok(hidden.every((entry) => entry.interactive === false));
});

test("15. hidden objects do not retain floating labels", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const hidden = scene.objects.filter(
    (entry) => entry.disclosureState === "hidden",
  );
  assert.ok(hidden.every((entry) => entry.labelVisible === false));
});

test("16. hidden subjects do not produce orphan edges", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const hiddenIds = new Set(
    scene.objects
      .filter((entry) => entry.disclosureState === "hidden")
      .map((entry) => entry.id),
  );
  for (const connection of scene.connections) {
    if (
      hiddenIds.has(connection.sourceId) ||
      hiddenIds.has(connection.targetId)
    ) {
      assert.equal(connection.visualRole, "hidden");
      assert.equal(connection.opacity, 0);
    }
  }
});

test("17. no invented connections", () => {
  const result = disclose("minimum");
  assert.deepEqual(
    [...result.canonicalRelationshipIds].sort(),
    [...relationships.map((entry) => entry.id)].sort(),
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.deletesCanonicalRelationships,
    false,
  );
});

test("18. stable ranking of related objects", () => {
  const subjectsById = new Map(
    subjects.map((subject) => [subject.subjectId, subject]),
  );
  const a = rankExecutiveFocusRelatedBusinessObjects({
    candidateIds: ["obj-budget", "obj-delivery", "obj-inventory"],
    subjectsById,
    directRelationshipIds: new Set([
      "obj-budget",
      "obj-delivery",
      "obj-inventory",
    ]),
  });
  const b = rankExecutiveFocusRelatedBusinessObjects({
    candidateIds: ["obj-inventory", "obj-budget", "obj-delivery"],
    subjectsById,
    directRelationshipIds: new Set([
      "obj-budget",
      "obj-delivery",
      "obj-inventory",
    ]),
  });
  assert.deepEqual(a, b);
  assert.equal(a[0], "obj-delivery");
});

test("19. identical input → identical output", () => {
  const input: ResolveExecutiveFocusSceneDisclosureInput = {
    subjects,
    relationships,
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: "report",
  };
  assert.deepEqual(
    resolveExecutiveFocusSceneDisclosure(input).entries,
    resolveExecutiveFocusSceneDisclosure(input).entries,
  );
});

test("20. topology receives disclosed set (via STAGE-PROD:0 authority)", () => {
  assert.match(stageSource, /resolveExecutiveStageDisclosure/);
  assert.match(
    stageSource,
    /participatesInTopology|disclosedBusinessIds|topologyObjects/,
  );
  const disclosure = disclose("minimum");
  const topologyIds = disclosure.topologySubjectIds.filter((id) =>
    id.startsWith("obj-"),
  );
  const topology = resolveExecutiveTopologyGuidedStageComposition({
    objects: topologyIds.map((objectId) =>
      Object.freeze({
        objectId,
        label: objectId,
      }),
    ),
    relationships: relationships.filter(
      (relationship) =>
        topologyIds.includes(relationship.sourceId) &&
        topologyIds.includes(relationship.targetId),
    ),
    focusedObjectId: "obj-capacity",
    topologyType: "hub",
  });
  const positionedIds = [...topology.byId.keys()];
  assert.ok(positionedIds.every((objectId) => topologyIds.includes(objectId)));
  assert.ok(!positionedIds.includes("obj-customer"));
  assert.ok(topologyIds.includes("obj-capacity"));
});

test("21. Hub anchor remains focused object", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const capacity = scene.objects.find((entry) => entry.id === "obj-capacity")!;
  assert.equal(capacity.role, "focused");
  assert.deepEqual(capacity.targetPosition, [
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.x,
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.y,
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.z +
      EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.depthPrimaryZ,
  ]);
});

test("22. lighting hierarchy remains unchanged", () => {
  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "obj-capacity",
    focused: true,
  });
  assert.equal(lighting.level, "primary");
  assert.equal(
    lighting.strength,
    EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength,
  );
  assert.doesNotMatch(source, /resolveExecutiveLightingHierarchy\(/);
});

test("23. Data Reality remains unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.ownsDataReality,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.ownsBusinessTruth,
    false,
  );
});

test("24. Advisor state remains unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.ownsAdvisorState,
    false,
  );
});

test("25. bounded resolver complexity", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_COMPLEXITY.usesGraphSimulation,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_COMPLEXITY.perFrameRecalculation,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_COMPLEXITY.maximumRelationshipHops,
    1,
  );
  assert.doesNotMatch(source, /d3-force|Math\.random|Date\.now/);
});

test("26. existing SP:4.1 tests remain green via identity + stage bridge", () => {
  const identity = getExecutiveFocusSceneDisclosureIdentity();
  assert.equal(
    identity.id,
    "SP:4.1B/ExecutiveFocusSceneDisclosure",
  );
  assert.equal(identity.version, "4.1.1");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-focus-scene-disclosure",
  );
  assert.equal(
    identity.architecturalRole,
    "PresentationOnlyExecutiveFocusSceneDisclosure",
  );
  assert.equal(
    executiveFocusSceneDisclosureIdentity,
    "SP:4.1B/ExecutiveFocusSceneDisclosure",
  );
  assert.equal(executiveFocusSceneDisclosureVersion, "4.1.1");
  assert.equal(
    executiveFocusSceneDisclosureNamespace,
    "nexora.spatial-presentation.executive-focus-scene-disclosure",
  );
  assert.equal(
    executiveFocusSceneDisclosureArchitecturalRole,
    "PresentationOnlyExecutiveFocusSceneDisclosure",
  );
  assert.equal(verifyExecutiveFocusSceneDisclosure().ok, true);
});

test("interaction: MINIMUM Capacity collapses executive thread", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  assert.ok(
    presentation.contextNodes.some(
      (node) => node.role === "collapsed-thread",
    ),
  );
  assert.ok(
    presentation.contextNodes.every(
      (node) =>
        node.role === "collapsed-thread" ||
        node.kind === "object" ||
        node.kind === "executive-thread",
    ),
  );
  assert.equal(
    presentation.contextNodes.filter((node) =>
      ["problem", "scenario", "decision", "execution"].includes(node.kind),
    ).length,
    0,
  );
});

test("interaction: selecting collapsed thread expands work subjects", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(state, "thread-obj-capacity");
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  assert.equal(state.expandExecutiveThread, true);
  assert.ok(
    presentation.scene.objects.some((object) => object.id === "ctx-problem-capacity"),
  );
  // STAGE-THREAD:1-FIX — quiet Collapse control replaces discoverable gateway.
  const collapse = presentation.contextNodes.find(
    (node) => node.role === "collapsed-thread",
  );
  assert.ok(collapse);
  assert.equal(collapse!.gatewayMode, "quiet-collapse");
  assert.equal(collapse!.label, "Collapse Thread");
});

test("connection disclosure helper rejects hidden endpoints", () => {
  const disclosure = disclose("minimum");
  assert.equal(
    isExecutiveFocusConnectionDisclosed({
      sourceId: "obj-capacity",
      targetId: "obj-delivery",
      disclosure,
    }),
    true,
  );
  assert.equal(
    isExecutiveFocusConnectionDisclosed({
      sourceId: "obj-capacity",
      targetId: "obj-customer",
      disclosure,
    }),
    false,
  );
});
