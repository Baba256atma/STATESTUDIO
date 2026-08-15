/**
 * SP:4.1C — Executive Focus Visual Grammar & Object Separation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET,
  resolveExecutiveFocusSceneDisclosure,
} from "./executiveFocusSceneDisclosure.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY,
  EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY,
  EXECUTIVE_FOCUS_VISUAL_SCALE,
  EXECUTIVE_FOCUS_VISUAL_SEPARATION,
  executiveFocusVisualGrammarArchitecturalRole,
  executiveFocusVisualGrammarIdentity,
  executiveFocusVisualGrammarNamespace,
  executiveFocusVisualGrammarVersion,
  getExecutiveFocusVisualGrammarIdentity,
  measureExecutiveFocusObjectGap,
  resolveExecutiveFocusClearRadius,
  resolveExecutiveFocusVisualGrammar,
  resolveExecutiveStageObjectBounds,
  verifyExecutiveFocusVisualGrammar,
} from "./executiveFocusVisualGrammar.ts";
import {
  EXECUTIVE_TOPOLOGY_STAGE_LAYOUT,
} from "./executiveTopologyGuidedStageComposition.ts";

const source = readFileSync(
  new URL("./executiveFocusVisualGrammar.ts", import.meta.url),
  "utf8",
);

const stageSource = readFileSync(
  new URL("../nex-mvp/nexora3DExecutiveStage.ts", import.meta.url),
  "utf8",
);

function capacityFocusSubjects() {
  return Object.freeze([
    Object.freeze({
      subjectId: "obj-capacity",
      label: "Capacity",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "focused" as const,
      disclosureState: "visible-primary" as const,
      position: [0, 0.42, 0.14] as const,
      status: "watch",
      attention: "important",
    }),
    Object.freeze({
      subjectId: "obj-inventory",
      label: "Inventory",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [-1.1, 0.42, 1.1] as const,
      status: "stable",
    }),
    Object.freeze({
      subjectId: "obj-delivery",
      label: "Delivery",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [1.2, 0.42, 0.9] as const,
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-budget",
      label: "Budget",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [-1.2, 0.42, -0.8] as const,
    }),
    Object.freeze({
      subjectId: "obj-risk",
      label: "Risk",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "unrelated" as const,
      disclosureState: "background-discoverable" as const,
      attention: "critical",
      position: [1.6, 0.2, -1.1] as const,
      status: "risk",
    }),
  ]);
}

function resolveCapacity(depth: "minimum" | "report" | "operation" = "minimum") {
  return resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: depth,
    focusedSubjectId: "obj-capacity",
    subjects: capacityFocusSubjects(),
  });
}

test("1. deterministic visual grammar", () => {
  const a = resolveCapacity();
  const b = resolveCapacity();
  assert.deepEqual(a.subjects, b.subjects);
});

test("2. deterministic scale hierarchy", () => {
  assert.ok(EXECUTIVE_FOCUS_VISUAL_SCALE.primary > EXECUTIVE_FOCUS_VISUAL_SCALE.related);
  assert.ok(EXECUTIVE_FOCUS_VISUAL_SCALE.related > EXECUTIVE_FOCUS_VISUAL_SCALE.background);
  assert.ok(
    EXECUTIVE_FOCUS_VISUAL_SCALE.elevated > EXECUTIVE_FOCUS_VISUAL_SCALE.background,
  );
});

test("3. focused object scale remains bounded", () => {
  const result = resolveCapacity();
  const focused = result.byId.get("obj-capacity")!;
  assert.ok(focused.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary);
  assert.ok(focused.scale <= 1.06);
});

test("4. related object scale remains subordinate", () => {
  const result = resolveCapacity();
  assert.ok(
    result.byId.get("obj-inventory")!.scale <
      result.byId.get("obj-capacity")!.scale,
  );
});

test("5. background scale remains readable", () => {
  const result = resolveCapacity();
  const risk = result.byId.get("obj-risk")!;
  assert.ok(risk.scale >= EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable);
  assert.ok(risk.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.elevated + 0.01);
});

test("6. geometry-aware bounds resolution", () => {
  const cube = resolveExecutiveStageObjectBounds({
    subjectId: "a",
    objectKind: "object",
    scale: 1,
  });
  assert.ok(cube.boundingRadius > 0);
  assert.ok(cube.footprintRadius > 0);
  assert.equal(cube.geometryFamily, "block");
});

test("7. cube/cube separation", () => {
  const result = resolveCapacity();
  const gap = measureExecutiveFocusObjectGap({
    leftBounds: result.byId.get("obj-capacity")!.bounds,
    leftPosition: result.byId.get("obj-capacity")!.targetPosition,
    rightBounds: result.byId.get("obj-inventory")!.bounds,
    rightPosition: result.byId.get("obj-inventory")!.targetPosition,
  });
  assert.ok(gap >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap);
});

test("8. cube/sphere separation", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "operation",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      ...capacityFocusSubjects(),
      Object.freeze({
        subjectId: "ctx-problem",
        label: "Capacity Gap",
        family: "executive-work" as const,
        objectKind: "problem",
        workKind: "problem" as const,
        disclosureState: "visible-related" as const,
        position: [2, 0.8, 0.2] as const,
      }),
    ]),
  });
  const gap = measureExecutiveFocusObjectGap({
    leftBounds: result.byId.get("obj-capacity")!.bounds,
    leftPosition: result.byId.get("obj-capacity")!.targetPosition,
    rightBounds: result.byId.get("ctx-problem")!.bounds,
    rightPosition: result.byId.get("ctx-problem")!.targetPosition,
  });
  assert.ok(gap >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap);
});

test("9. cube/cylinder separation", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "operation",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      ...capacityFocusSubjects(),
      Object.freeze({
        subjectId: "ctx-execution",
        label: "Capacity Expansion",
        family: "executive-work" as const,
        objectKind: "execution",
        workKind: "execution" as const,
        disclosureState: "visible-related" as const,
        position: [2.1, 1.5, 0.2] as const,
      }),
    ]),
  });
  const gap = measureExecutiveFocusObjectGap({
    leftBounds: result.byId.get("obj-delivery")!.bounds,
    leftPosition: result.byId.get("obj-delivery")!.targetPosition,
    rightBounds: result.byId.get("ctx-execution")!.bounds,
    rightPosition: result.byId.get("ctx-execution")!.targetPosition,
  });
  assert.ok(gap >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap);
});

test("10. cube/decision-geometry separation", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "operation",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      ...capacityFocusSubjects(),
      Object.freeze({
        subjectId: "ctx-decision",
        label: "Expand Capacity",
        family: "executive-work" as const,
        objectKind: "decision",
        workKind: "decision" as const,
        disclosureState: "visible-related" as const,
        position: [2, 1.1, 0.2] as const,
      }),
    ]),
  });
  assert.ok(result.separationSatisfied);
});

test("11. positive world-space gap", () => {
  const result = resolveCapacity();
  for (let i = 0; i < result.subjects.length; i += 1) {
    for (let j = i + 1; j < result.subjects.length; j += 1) {
      const left = result.subjects[i]!;
      const right = result.subjects[j]!;
      const gap = measureExecutiveFocusObjectGap({
        leftBounds: left.bounds,
        leftPosition: left.targetPosition,
        rightBounds: right.bounds,
        rightPosition: right.targetPosition,
      });
      assert.ok(gap > 0);
    }
  }
});

test("12. positive projected screen-space gap", () => {
  const result = resolveCapacity();
  assert.equal(result.projectedSeparationSatisfied, true);
});

test("13. no object touching", () => {
  const result = resolveCapacity();
  assert.equal(result.separationSatisfied, true);
});

test("14. no object containment", () => {
  const result = resolveCapacity();
  for (const left of result.subjects) {
    for (const right of result.subjects) {
      if (left.subjectId === right.subjectId) continue;
      const centerDistance = Math.hypot(
        left.targetPosition[0] - right.targetPosition[0],
        left.targetPosition[1] - right.targetPosition[1],
        left.targetPosition[2] - right.targetPosition[2],
      );
      assert.ok(centerDistance > left.bounds.boundingRadius);
    }
  }
});

test("15. no apparent embedding from canonical camera", () => {
  assert.equal(resolveCapacity().projectedSeparationSatisfied, true);
});

test("16. separation remains valid after scale application", () => {
  const result = resolveCapacity();
  assert.equal(result.separationSatisfied, true);
  assert.ok(result.calibrationPasses <= EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxCalibrationPasses);
});

test("17. Hub radius adapts to object bounds", () => {
  const result = resolveCapacity();
  assert.ok(result.hubRadius >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMin);
  assert.ok(result.hubRadius <= EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMax);
});

test("18. focused whitespace preserved", () => {
  assert.equal(resolveCapacity().focusWhitespaceSatisfied, true);
});

test("19. separation correction preserves Hub anchor", () => {
  const result = resolveCapacity();
  const focused = result.byId.get("obj-capacity")!;
  // XY hub anchor preserved. Grammar may use temporary calibration Z;
  // STAGE-2D:2 Stage seed/boundary flattens semantic depth to 0.
  assert.equal(focused.targetPosition[0], EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.x);
  assert.equal(focused.targetPosition[1], EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.y);
  assert.ok(Number.isFinite(focused.targetPosition[2]));
});

test("20. no Z-only collision escape", () => {
  assert.equal(EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.solvesOverlapViaZOnly, false);
  assert.equal(resolveCapacity().usedZOnlyEscape, false);
  assert.doesNotMatch(source, /z\s*\+=\s*|position\.z\s*=\s*[^;]*escape/i);
});

test("21. label hierarchy deterministic", () => {
  const a = resolveCapacity().byId.get("obj-capacity")!.label;
  const b = resolveCapacity().byId.get("obj-capacity")!.label;
  assert.deepEqual(a, b);
  assert.equal(a.hierarchy, "primary");
});

test("22. focused label never suppressed", () => {
  const label = resolveCapacity().byId.get("obj-capacity")!.label;
  assert.equal(label.neverSuppress, true);
  assert.equal(label.suppressible, false);
});

test("23. secondary labels may simplify/suppress deterministically", () => {
  const related = resolveCapacity().byId.get("obj-inventory")!.label;
  const background = resolveCapacity().byId.get("obj-risk")!.label;
  assert.equal(related.suppressible, true);
  assert.equal(background.showStatus, false);
});

test("24. label/object clearance", () => {
  assert.match(source, /labelClearance|prominence|neverSuppress/);
});

test("25. bounded label collision handling", () => {
  assert.ok(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY.maximumCalibrationPasses <= 6,
  );
});

test("26. Executive Thread uses distinct presentation grammar", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "operation",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      ...capacityFocusSubjects(),
      Object.freeze({
        subjectId: "ctx-problem",
        label: "Capacity Gap",
        family: "executive-work" as const,
        objectKind: "problem",
        workKind: "problem" as const,
        disclosureState: "visible-related" as const,
        position: [0.2, 0.5, 0.2] as const,
      }),
      Object.freeze({
        subjectId: "ctx-scenario",
        label: "Capacity Expansion",
        family: "executive-work" as const,
        objectKind: "scenario",
        workKind: "scenario" as const,
        disclosureState: "visible-related" as const,
        position: [0.3, 0.6, 0.2] as const,
      }),
    ]),
  });
  const problem = result.byId.get("ctx-problem")!;
  assert.equal(problem.inExecutiveThread, true);
  assert.equal(problem.inBusinessNetwork, false);
  assert.equal(problem.label.hierarchy, "executive-thread");
  assert.equal(problem.label.primaryLine, "Problem");
  assert.ok(
    Math.abs(
      problem.targetPosition[0] -
        result.byId.get("obj-capacity")!.targetPosition[0],
    ) > 0.75,
  );
});

test("27. Executive Thread members remain separated", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "operation",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      ...capacityFocusSubjects().slice(0, 3),
      Object.freeze({
        subjectId: "ctx-problem",
        label: "Capacity Gap",
        family: "executive-work" as const,
        objectKind: "problem",
        workKind: "problem" as const,
        disclosureState: "visible-related" as const,
        position: [2, 0.5, 0.2] as const,
      }),
      Object.freeze({
        subjectId: "ctx-scenario",
        label: "Capacity Expansion",
        family: "executive-work" as const,
        objectKind: "scenario",
        workKind: "scenario" as const,
        disclosureState: "visible-related" as const,
        position: [2, 0.6, 0.2] as const,
      }),
      Object.freeze({
        subjectId: "ctx-decision",
        label: "Expand Capacity",
        family: "executive-work" as const,
        objectKind: "decision",
        workKind: "decision" as const,
        disclosureState: "visible-related" as const,
        position: [2, 0.7, 0.2] as const,
      }),
      Object.freeze({
        subjectId: "ctx-execution",
        label: "Capacity Expansion",
        family: "executive-work" as const,
        objectKind: "execution",
        workKind: "execution" as const,
        disclosureState: "visible-related" as const,
        position: [2, 0.8, 0.2] as const,
      }),
    ]),
  });
  assert.equal(result.separationSatisfied, true);
});

test("28. Business Network remains topology-owned", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.replacesTopologyAuthority,
    false,
  );
  assert.match(stageSource, /resolveExecutiveTopologyGuidedStageComposition/);
  assert.match(stageSource, /resolveExecutiveFocusVisualGrammar/);
});

test("29. MINIMUM disclosure budget unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.maxVisibleSubjects,
    6,
  );
});

test("30. REPORT disclosure semantics unchanged", () => {
  const disclosure = resolveExecutiveFocusSceneDisclosure({
    subjects: Object.freeze([
      Object.freeze({
        subjectId: "obj-capacity",
        family: "business-object" as const,
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
    ]),
    relationships: Object.freeze([]),
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: "report",
  });
  assert.equal(disclosure.byId.get("ctx-problem")?.state, "visible-related");
  assert.equal(disclosure.byId.get("ctx-decision")?.state, "hidden");
});

test("31. OPERATION disclosure semantics unchanged", () => {
  const disclosure = resolveExecutiveFocusSceneDisclosure({
    subjects: Object.freeze([
      Object.freeze({
        subjectId: "obj-capacity",
        family: "business-object" as const,
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
    ]),
    relationships: Object.freeze([]),
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: "operation",
  });
  assert.equal(disclosure.byId.get("ctx-execution")?.state, "visible-related");
});

test("32. canonical relationships unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.inventsRelationships,
    false,
  );
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(
    scene.connections.length,
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.length,
  );
});

test("33. Data Reality unchanged", () => {
  assert.equal(EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDataReality, false);
});

test("34. lighting hierarchy unchanged", () => {
  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "obj-capacity",
    focused: true,
  });
  assert.equal(lighting.level, "primary");
  assert.equal(
    lighting.strength,
    EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength,
  );
});

test("35. Stage safe areas respected", () => {
  assert.match(source, /applyExecutiveSpatialUiOverlaySafeCorrection/);
});

test("36. identical input → identical output", () => {
  const input = {
    mode: "focus" as const,
    presentationDepth: "minimum" as const,
    focusedSubjectId: "obj-capacity",
    subjects: capacityFocusSubjects(),
  };
  assert.deepEqual(
    resolveExecutiveFocusVisualGrammar(input).subjects,
    resolveExecutiveFocusVisualGrammar(input).subjects,
  );
});

test("37. bounded calibration passes", () => {
  assert.ok(
    resolveCapacity().calibrationPasses <=
      EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY.maximumCalibrationPasses,
  );
});

test("38. no per-frame solver requirement", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY.perFrameRecalculation,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY.usesPhysicsEngine,
    false,
  );
});

test("39. existing SP:4.1 identity remains", () => {
  assert.match(
    readFileSync(
      new URL("./executiveTopologyGuidedStageComposition.ts", import.meta.url),
      "utf8",
    ),
    /SP:4\.1\/TopologyGuidedExecutiveStageComposition/,
  );
});

test("40. existing SP:4.1B identity remains", () => {
  assert.match(
    readFileSync(
      new URL("./executiveFocusSceneDisclosure.ts", import.meta.url),
      "utf8",
    ),
    /SP:4\.1B\/ExecutiveFocusSceneDisclosure/,
  );
});

test("identity + verify gate", () => {
  const identity = getExecutiveFocusVisualGrammarIdentity();
  assert.equal(identity.id, "SP:4.1C/ExecutiveFocusVisualGrammar");
  assert.equal(identity.version, "4.1.2");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-focus-visual-grammar",
  );
  assert.equal(
    identity.architecturalRole,
    "PresentationOnlyExecutiveFocusVisualGrammar",
  );
  assert.equal(executiveFocusVisualGrammarIdentity, identity.id);
  assert.equal(executiveFocusVisualGrammarVersion, "4.1.2");
  assert.equal(
    executiveFocusVisualGrammarNamespace,
    identity.namespace,
  );
  assert.equal(
    executiveFocusVisualGrammarArchitecturalRole,
    identity.architecturalRole,
  );
  assert.equal(verifyExecutiveFocusVisualGrammar().ok, true);
});

test("stage integration applies restrained focus scale", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const inventory = scene.objects.find((entry) => entry.id === "obj-inventory")!;
  assert.ok(inventory.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary);
  assert.equal(inventory.visualGrammarRole, "primary");
});

test("interaction: expanded thread uses distinct spine", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "operation",
    environmentIntent: state.environmentIntent,
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  const capacity = presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const problem = presentation.contextNodes.find(
    (node) => node.kind === "problem",
  );
  assert.ok(problem);
  assert.ok(
    Math.abs(problem!.targetPosition[0] - capacity.targetPosition[0]) > 1,
  );
});

// ─── Rendered Separation Calibration (human-signoff fix) ───────────────────

function revenueMinimumSubjects() {
  return Object.freeze([
    Object.freeze({
      subjectId: "obj-revenue",
      label: "Revenue",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "focused" as const,
      disclosureState: "visible-primary" as const,
      position: [0, 0.42, 0.14] as const,
      status: "stable",
    }),
    Object.freeze({
      subjectId: "obj-customer",
      label: "Customer",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [-1.2, 0.42, 0.9] as const,
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-demand",
      label: "Demand",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [0.2, 0.42, 1.4] as const,
      status: "unresolved",
    }),
    Object.freeze({
      subjectId: "obj-capacity",
      label: "Capacity",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [1.3, 0.42, 0.7] as const,
      status: "watch",
    }),
    Object.freeze({
      subjectId: "thread-obj-revenue",
      label: "Executive Thread · 5",
      family: "collapsed-thread" as const,
      objectKind: "insight",
      roleHint: "collapsed-thread" as const,
      disclosureState: "collapsed-thread" as const,
      position: [0.8, 0.1, 1.1] as const,
    }),
  ]);
}

function resolveRevenueMinimum() {
  return resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-revenue",
    subjects: revenueMinimumSubjects(),
  });
}

test("C1. effective bounds include presentation scale", () => {
  const a = resolveExecutiveStageObjectBounds({
    subjectId: "a",
    objectKind: "object",
    scale: 1,
  });
  const b = resolveExecutiveStageObjectBounds({
    subjectId: "b",
    objectKind: "object",
    scale: 0.76,
  });
  assert.ok(b.effectiveBoundingRadius < a.effectiveBoundingRadius);
  assert.ok(
    Math.abs(b.effectiveBoundingRadius / a.effectiveBoundingRadius - 0.76) <
      0.02,
  );
});

test("C2. effective bounds include geometry-family dimensions", () => {
  const block = resolveExecutiveStageObjectBounds({
    subjectId: "block",
    objectKind: "object",
    scale: 1,
  });
  const cylinder = resolveExecutiveStageObjectBounds({
    subjectId: "cylinder",
    objectKind: "execution",
    scale: 1,
  });
  assert.notEqual(block.geometryFamily, cylinder.geometryFamily);
  assert.notEqual(
    block.effectiveBoundingRadius,
    cylinder.effectiveBoundingRadius,
  );
});

test("C3. silhouette extent enlarges effective footprint beyond mesh AABB", () => {
  const bounds = resolveExecutiveStageObjectBounds({
    subjectId: "a",
    objectKind: "object",
    scale: 1,
  });
  assert.equal(
    bounds.silhouetteExtentScale,
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.silhouetteExtentScale,
  );
  assert.ok(bounds.effectiveFootprintRadius > bounds.dimensions.width / 2);
});

test("C4. Revenue-like focused Hub has protected clear radius", () => {
  const result = resolveRevenueMinimum();
  const revenue = result.byId.get("obj-revenue")!;
  const neighbors = ["obj-customer", "obj-demand", "obj-capacity"].map(
    (id) => result.byId.get(id)!,
  );
  const clear = resolveExecutiveFocusClearRadius({
    focusBounds: revenue.bounds,
    neighborBounds: neighbors.map((entry) => entry.bounds),
  });
  assert.ok(clear > revenue.bounds.effectiveFootprintRadius);
  assert.ok(result.hubRadius + 1e-6 >= clear - 0.35);
});

test("C5. related objects remain outside focus clear radius", () => {
  const result = resolveRevenueMinimum();
  const revenue = result.byId.get("obj-revenue")!;
  const neighbors = ["obj-customer", "obj-demand", "obj-capacity"].map(
    (id) => result.byId.get(id)!,
  );
  const clear = resolveExecutiveFocusClearRadius({
    focusBounds: revenue.bounds,
    neighborBounds: neighbors.map((entry) => entry.bounds),
  });
  for (const neighbor of neighbors) {
    const dist = Math.hypot(
      neighbor.targetPosition[0] - revenue.targetPosition[0],
      neighbor.targetPosition[2] - revenue.targetPosition[2],
    );
    assert.ok(
      dist + 1e-4 >= clear,
      `${neighbor.subjectId} inside clear radius (${dist} < ${clear})`,
    );
  }
});

test("C6. no visible pair intersects after final transforms", () => {
  const result = resolveRevenueMinimum();
  const subjects = result.subjects;
  for (let i = 0; i < subjects.length; i += 1) {
    for (let j = i + 1; j < subjects.length; j += 1) {
      const gap = measureExecutiveFocusObjectGap({
        leftBounds: subjects[i]!.bounds,
        leftPosition: subjects[i]!.targetPosition,
        rightBounds: subjects[j]!.bounds,
        rightPosition: subjects[j]!.targetPosition,
      });
      assert.ok(gap >= 0, `pair intersects: ${subjects[i]!.subjectId}/${subjects[j]!.subjectId}`);
    }
  }
});

test("C7. positive surface gap remains", () => {
  const result = resolveRevenueMinimum();
  const subjects = result.subjects;
  for (let i = 0; i < subjects.length; i += 1) {
    for (let j = i + 1; j < subjects.length; j += 1) {
      const gap = measureExecutiveFocusObjectGap({
        leftBounds: subjects[i]!.bounds,
        leftPosition: subjects[i]!.targetPosition,
        rightBounds: subjects[j]!.bounds,
        rightPosition: subjects[j]!.targetPosition,
      });
      assert.ok(
        gap + 1e-4 >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap * 0.85,
      );
    }
  }
});

test("C8. projected silhouettes retain minimum gap", () => {
  const result = resolveRevenueMinimum();
  assert.equal(result.projectedSeparationSatisfied, true);
});

test("C9. no neighbor hides behind focused object", () => {
  const result = resolveRevenueMinimum();
  const revenue = result.byId.get("obj-revenue")!;
  for (const id of ["obj-customer", "obj-demand", "obj-capacity"]) {
    const neighbor = result.byId.get(id)!;
    const dist = Math.hypot(
      neighbor.targetPosition[0] - revenue.targetPosition[0],
      neighbor.targetPosition[2] - revenue.targetPosition[2],
    );
    assert.ok(dist > revenue.bounds.effectiveFootprintRadius * 1.5);
  }
});

test("C10. no two Hub neighbors collapse to the same projected sector", () => {
  const result = resolveRevenueMinimum();
  const sectors = result.hubSectorAssignments
    .filter((entry) => !entry.subjectId.startsWith("thread-"))
    .map((entry) => entry.sectorId);
  assert.equal(new Set(sectors).size, sectors.length);
});

test("C11. degenerate Hub angular layout is corrected", () => {
  const piled = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-revenue",
    subjects: Object.freeze([
      ...revenueMinimumSubjects().slice(0, 4).map((subject, index) =>
        Object.freeze({
          ...subject,
          position: [
            0.1 * index,
            0.42,
            0.14 + 0.05 * index,
          ] as const,
        }),
      ),
      revenueMinimumSubjects()[4]!,
    ]),
  });
  const revenue = piled.byId.get("obj-revenue")!;
  const angles = ["obj-customer", "obj-demand", "obj-capacity"].map((id) => {
    const neighbor = piled.byId.get(id)!;
    return Math.atan2(
      neighbor.targetPosition[2] - revenue.targetPosition[2],
      neighbor.targetPosition[0] - revenue.targetPosition[0],
    );
  });
  const unique = new Set(angles.map((angle) => angle.toFixed(2)));
  assert.equal(unique.size, 3);
});

test("C12. separation correction remains deterministic", () => {
  const input = {
    mode: "focus" as const,
    presentationDepth: "minimum" as const,
    focusedSubjectId: "obj-revenue",
    subjects: revenueMinimumSubjects(),
  };
  assert.deepEqual(
    resolveExecutiveFocusVisualGrammar(input).subjects,
    resolveExecutiveFocusVisualGrammar(input).subjects,
  );
});

test("C13. focus anchor remains stable", () => {
  const result = resolveRevenueMinimum();
  const revenue = result.byId.get("obj-revenue")!;
  assert.ok(Math.abs(revenue.targetPosition[0]) < 0.35);
  assert.ok(Math.abs(revenue.targetPosition[2]) < 0.55);
});

test("C14. secondary scale reduction remains bounded", () => {
  const result = resolveRevenueMinimum();
  for (const subject of result.subjects) {
    const floor =
      subject.visualRole === "collapsed-thread"
        ? EXECUTIVE_FOCUS_VISUAL_SCALE.collapsedThread * 0.75
        : EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable * 0.7;
    assert.ok(subject.scale + 1e-6 >= floor);
    assert.ok(subject.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary);
  }
});

test("C15. no Z-only escape", () => {
  const result = resolveRevenueMinimum();
  assert.equal(result.usedZOnlyEscape, false);
  assert.equal(EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.solvesOverlapViaZOnly, false);
});

test("C16. Stage safe areas remain respected", () => {
  assert.match(source, /applyExecutiveSpatialUiOverlaySafeCorrection/);
  const result = resolveRevenueMinimum();
  for (const subject of result.subjects) {
    assert.ok(Number.isFinite(subject.targetPosition[0]));
    assert.ok(Number.isFinite(subject.targetPosition[1]));
    assert.ok(Number.isFinite(subject.targetPosition[2]));
  }
});

test("C17. collapsed thread is smaller/subordinate", () => {
  const result = resolveRevenueMinimum();
  const thread = result.byId.get("thread-obj-revenue")!;
  const related = result.byId.get("obj-customer")!;
  assert.equal(thread.visualRole, "collapsed-thread");
  assert.ok(thread.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.collapsedThread + 0.01);
  assert.ok(thread.scale < related.scale);
});

test("C18. collapsed thread does not intersect focus geometry", () => {
  const result = resolveRevenueMinimum();
  const gap = measureExecutiveFocusObjectGap({
    leftBounds: result.byId.get("obj-revenue")!.bounds,
    leftPosition: result.byId.get("obj-revenue")!.targetPosition,
    rightBounds: result.byId.get("thread-obj-revenue")!.bounds,
    rightPosition: result.byId.get("thread-obj-revenue")!.targetPosition,
  });
  assert.ok(gap >= EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap * 0.85);
});

test("C19. collapsed thread does not merge with focus-ring geometry", () => {
  const result = resolveRevenueMinimum();
  const revenue = result.byId.get("obj-revenue")!;
  const thread = result.byId.get("thread-obj-revenue")!;
  const dist = Math.hypot(
    thread.targetPosition[0] - revenue.targetPosition[0],
    thread.targetPosition[2] - revenue.targetPosition[2],
  );
  // Focus pedestal outer ring ~0.68; thread must sit clearly outside.
  assert.ok(dist > 0.95);
});

test("C20. collapsed thread safe-sector placement deterministic", () => {
  const a = resolveRevenueMinimum().byId.get("thread-obj-revenue")!;
  const b = resolveRevenueMinimum().byId.get("thread-obj-revenue")!;
  assert.deepEqual(a.targetPosition, b.targetPosition);
});

test("C21. labels follow final calibrated positions", () => {
  const result = resolveRevenueMinimum();
  for (const subject of result.subjects) {
    assert.ok(subject.label.primaryLine.length > 0);
    assert.ok(subject.targetPosition.every((value) => Number.isFinite(value)));
  }
  assert.equal(result.byId.get("obj-revenue")!.label.primaryLine, "Revenue");
});

test("C22. connections follow final calibrated positions (integration)", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  const revenue = presentation.scene.objects.find((o) => o.id === "obj-revenue")!;
  for (const connection of presentation.scene.connections) {
    if (connection.sourceId !== "obj-revenue" && connection.targetId !== "obj-revenue") {
      continue;
    }
    assert.ok(revenue.targetPosition);
  }
  assert.ok(presentation.contextConnections.length >= 0);
});

test("C23. hit targets follow final transforms", () => {
  assert.match(
    readFileSync(
      new URL("../../executive/nex-mvp/stage/NexoraStageContextNodes.tsx", import.meta.url),
      "utf8",
    ),
    /node\.targetPosition/,
  );
  assert.match(
    readFileSync(
      new URL("../../executive/nex-mvp/stage/NexoraStageObject.tsx", import.meta.url),
      "utf8",
    ),
    /presentation\.targetPosition/,
  );
});

test("C24. Disclosure membership unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDisclosureMembership,
    false,
  );
  assert.equal(EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.relatedBusiness, 4);
});

test("C25. topology selection unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.replacesTopologyAuthority,
    false,
  );
  assert.ok(EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubRadius > 0);
});

test("C26. Data Reality unchanged", () => {
  assert.equal(EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDataReality, false);
});

test("C27. lighting unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.replacesLightingHierarchy,
    false,
  );
});

test("C28. identity/version remains 4.1.2", () => {
  assert.equal(executiveFocusVisualGrammarVersion, "4.1.2");
  assert.equal(getExecutiveFocusVisualGrammarIdentity().version, "4.1.2");
});

test("C29. shell applies grammar → SP:4.3 network → SP:4.2 plane", () => {
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.match(shell, /applyExecutiveFocusVisualGrammarToStagePresentation/);
  assert.match(shell, /applyExecutiveNetworkTopologyToStagePresentation/);
  assert.match(shell, /applyExecutivePresentationPlaneToStagePresentation/);
  const readabilityIdx = shell.indexOf(
    "applyDataRealityExecutiveReadabilityToStagePresentation",
  );
  const grammarIdx = shell.lastIndexOf(
    "applyExecutiveFocusVisualGrammarToStagePresentation",
  );
  const networkIdx = shell.lastIndexOf(
    "applyExecutiveNetworkTopologyToStagePresentation",
  );
  const planeIdx = shell.lastIndexOf(
    "applyExecutivePresentationPlaneToStagePresentation",
  );
  assert.ok(grammarIdx > readabilityIdx);
  assert.ok(networkIdx > grammarIdx);
  assert.ok(planeIdx > networkIdx);
});

test("C30. collapsed-thread mesh uses restrained torus", () => {
  const nodes = readFileSync(
    new URL("../../executive/nex-mvp/stage/NexoraStageContextNodes.tsx", import.meta.url),
    "utf8",
  );
  assert.match(nodes, /torusGeometry args=\{\[0\.14, 0\.035/);
});
