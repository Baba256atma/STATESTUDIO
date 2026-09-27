/**
 * NPA-T MLEVEL:4 — focused spatial transition tests A–AF.
 * Motion is downstream of MLEVEL:1/2. Does not start MLEVEL:5.
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { EXECUTIVE_STAGE_MOTION } from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import type { NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiManagementLevelPath } from "./nmiManagementLevelPathCompose.ts";
import { composeNmiManagementLevelSpatial } from "./nmiManagementLevelSpatialCompose.ts";
import {
  MANAGEMENT_LEVEL_MOTION_TOKENS,
  NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT,
  liveSamplesFromMotionSample,
  planManagementLevelMotion,
  sampleManagementLevelMotion,
  settleManagementLevelMotion,
} from "./nmiManagementLevelMotionCompose.ts";
import { nmiManagementLevelMotionIdentity } from "./nmiManagementLevelMotionIdentity.ts";
import { NexoraManagementLevelContextNav } from "@/app/executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPANY = "obj-revenue";
const OPERATIONS = "obj-delivery";
const PRODUCTION = "obj-inventory";
const CAPACITY = "obj-capacity";

function ref(id: string, kind: NmiCanonicalRef["kind"]): NmiCanonicalRef {
  return { id, kind, authority: "canonical", sourceRef: `src:${id}` };
}

function rel(relationshipId: string, fromId: string, toId: string): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind: "belongs_to",
    epistemicStatus: "DECLARED",
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function hierarchyMap() {
  return composeNmiManagementMap({
    mapId: "map-mlevel-4",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-mlevel-4",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      businessProjectRef: ref(COMPANY, "BUSINESS_PROJECT"),
      nodes: [
        ref(COMPANY, "BUSINESS_PROJECT"),
        ref(OPERATIONS, "PROCESS"),
        ref(PRODUCTION, "PROCESS"),
        ref(CAPACITY, "PROBLEM"),
      ],
      relationships: [
        rel("rel:capacity-production", CAPACITY, PRODUCTION),
        rel("rel:production-operations", PRODUCTION, OPERATIONS),
        rel("rel:operations-company", OPERATIONS, COMPANY),
      ],
    }),
  });
}

function compositionFor(id: string) {
  return composeNmiManagementLevelSpatial({
    path: composeNmiManagementLevelPath({
      selectedCanonicalId: id,
      map: hierarchyMap(),
    }),
  });
}

function planFor(fromId: string | null, toId: string, reducedMotion = false) {
  const next = compositionFor(toId);
  return planManagementLevelMotion({
    previous: fromId ? compositionFor(fromId) : null,
    next,
    selectedCanonicalId: toId,
    reducedMotion,
  });
}

function kindOf(plan: ReturnType<typeof planFor>, id: string) {
  return plan.participants.find((item) => item.canonicalId === id)?.kind;
}

test("A. Previous and next compositions match participants by canonical ID", () => {
  const plan = planFor(PRODUCTION, CAPACITY);
  assert.equal(kindOf(plan, PRODUCTION), "PERSISTING_SHIFT");
  assert.equal(kindOf(plan, OPERATIONS), "PERSISTING_SHIFT");
  assert.equal(kindOf(plan, CAPACITY), "ENTERING_ACTIVE");
  assert.equal(kindOf(plan, COMPANY), "EXITING_CONTEXT");
});

test("B. L1 → L2 is PERSISTING_SHIFT, not exit + unrelated enter", () => {
  const plan = planFor(PRODUCTION, CAPACITY);
  const production = plan.participants.find((item) => item.canonicalId === PRODUCTION);
  assert.equal(production?.kind, "PERSISTING_SHIFT");
  assert.equal(production?.sourceRole, "ACTIVE");
  assert.equal(production?.targetRole, "PARENT");
});

test("C. L2 → L3 is PERSISTING_SHIFT", () => {
  const operations = planFor(PRODUCTION, CAPACITY).participants.find((item) => item.canonicalId === OPERATIONS);
  assert.equal(operations?.kind, "PERSISTING_SHIFT");
  assert.equal(operations?.sourceRole, "PARENT");
  assert.equal(operations?.targetRole, "GRANDPARENT");
});

test("D. L2 → L1 is PERSISTING_SHIFT", () => {
  const production = planFor(CAPACITY, PRODUCTION).participants.find((item) => item.canonicalId === PRODUCTION);
  assert.equal(production?.kind, "PERSISTING_SHIFT");
  assert.equal(production?.sourceRole, "PARENT");
  assert.equal(production?.targetRole, "ACTIVE");
});

test("E. New child is ENTERING_ACTIVE", () => {
  assert.equal(kindOf(planFor(PRODUCTION, CAPACITY), CAPACITY), "ENTERING_ACTIVE");
});

test("F. Newly visible ancestor is ENTERING_CONTEXT", () => {
  assert.equal(kindOf(planFor(CAPACITY, PRODUCTION), COMPANY), "ENTERING_CONTEXT");
});

test("G. Ancestor leaving visible three-level depth is EXITING_CONTEXT", () => {
  assert.equal(kindOf(planFor(PRODUCTION, CAPACITY), COMPANY), "EXITING_CONTEXT");
});

test("H. Unchanged canonical role can remain PERSISTING_SAME", () => {
  const same = compositionFor(CAPACITY);
  const plan = planManagementLevelMotion({
    previous: same,
    next: same,
    selectedCanonicalId: CAPACITY,
  });
  assert.ok(plan.participants.every((item) => item.kind === "PERSISTING_SAME"));
});

test("I. Target XY exactly equals MLEVEL:2 target", () => {
  const next = compositionFor(CAPACITY);
  const plan = planFor(PRODUCTION, CAPACITY);
  for (const slot of next.slots) {
    const participant = plan.participants.find((item) => item.canonicalId === slot.canonicalId);
    assert.deepEqual(participant?.target.normalized, slot.placement.normalized);
    assert.deepEqual(participant?.targetPlacement, slot.placement);
  }
});

test("J. Target scale exactly equals MLEVEL:2 target", () => {
  const next = compositionFor(CAPACITY);
  const plan = planFor(PRODUCTION, CAPACITY);
  for (const slot of next.slots) {
    const participant = plan.participants.find((item) => item.canonicalId === slot.canonicalId);
    assert.equal(participant?.target.scale, slot.scale);
  }
});

test("K. Physical Z remains zero", () => {
  const sample = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.5);
  for (const item of sample.participants) {
    assert.equal(item.current.world.z, 0);
    assert.equal(item.current.worldZ, 0);
    assert.equal(item.source.worldZ, 0);
    assert.equal(item.target.worldZ, 0);
  }
});

test("L. No transition computes independent hierarchy", () => {
  assert.equal(planFor(PRODUCTION, CAPACITY).computesIndependentHierarchy, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT.computesIndependentHierarchy, false);
});

test("M. No transition computes independent target layout", () => {
  const next = compositionFor(CAPACITY);
  const plan = planManagementLevelMotion({
    previous: compositionFor(PRODUCTION),
    next,
    selectedCanonicalId: CAPACITY,
  });
  assert.equal(plan.computesIndependentTargetLayout, false);
  assert.equal(plan.targetComposition, next);
});

test("N. Canonical navigation precedes transition planning", () => {
  const plan = planFor(PRODUCTION, CAPACITY);
  assert.equal(plan.canonicalNavigationPreceded, true);
  assert.equal(plan.selectedCanonicalId, CAPACITY);
  assert.equal(plan.ownsSelectedCanonicalId, false);
});

test("O. Semantic selected subject equals new canonical active during motion", () => {
  const sample = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.4);
  assert.equal(sample.selectedCanonicalId, CAPACITY);
  const capacity = sample.participants.find((item) => item.canonicalId === CAPACITY);
  assert.equal(capacity?.semanticSelected, true);
});

test("P. Old visual participant does not remain semantic selection", () => {
  const production = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.4).participants.find(
    (item) => item.canonicalId === PRODUCTION,
  );
  assert.equal(production?.semanticSelected, false);
  assert.equal(production?.kind, "PERSISTING_SHIFT");
});

test("Q. Stage card limit remains Stage-wide", () => {
  const sample = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.5);
  assert.equal(sample.cardAuthorityMaximum, SCENE_ORG_NORMAL_STAGE_CARD_RULE.maximum);
  assert.equal(sample.multipliesStageCardLimit, false);
});

test("R. L2/L3 do not inherit full L1 card sets during transition", () => {
  const sample = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.5);
  const production = sample.participants.find((item) => item.canonicalId === PRODUCTION);
  const operations = sample.participants.find((item) => item.canonicalId === OPERATIONS);
  const capacity = sample.participants.find((item) => item.canonicalId === CAPACITY);
  assert.equal(production?.stageCardEligible, false);
  assert.equal(operations?.stageCardEligible, false);
  assert.equal(capacity?.stageCardEligible, true);
});

test("S. OVS management state remains unchanged", () => {
  const ovs = Object.freeze({ watch: true, critical: false });
  const before = JSON.stringify(ovs);
  sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.5);
  assert.equal(JSON.stringify(ovs), before);
  assert.equal(
    planFor(PRODUCTION, CAPACITY).participants.every((item) => item.mutatesOvsManagementState === false),
    true,
  );
});

test("T. Watch/Critical/selected/focus semantics are not rewritten by level motion", () => {
  for (const item of planFor(CAPACITY, PRODUCTION).participants) {
    assert.equal(item.mutatesSelectionFocusWatchCritical, false);
  }
});

test("U. Hierarchy connector meaning remains belongs_to", () => {
  const sample = settleManagementLevelMotion(planFor(PRODUCTION, CAPACITY));
  assert.ok(sample.connectors.length > 0);
  for (const connector of sample.connectors) {
    assert.equal(connector.meaning, "hierarchical-containment");
    assert.equal(connector.impliesCausality, false);
  }
});

test("V. Direct L3 drill-up does not synthesize intermediate canonical navigation", () => {
  const plan = planFor(CAPACITY, OPERATIONS);
  assert.equal(plan.selectedCanonicalId, OPERATIONS);
  assert.equal(kindOf(plan, OPERATIONS), "PERSISTING_SHIFT");
  assert.equal(kindOf(plan, COMPANY), "ENTERING_CONTEXT");
  assert.equal(kindOf(plan, CAPACITY), "EXITING_CONTEXT");
  assert.equal(kindOf(plan, PRODUCTION), "EXITING_CONTEXT");
  assert.notEqual(plan.selectedCanonicalId, PRODUCTION);
});

test("W. Reduced-motion target equals normal-motion target", () => {
  const normal = settleManagementLevelMotion(planFor(PRODUCTION, CAPACITY, false));
  const reduced = settleManagementLevelMotion(planFor(PRODUCTION, CAPACITY, true));
  assert.deepEqual(
    normal.participants.map((item) => [item.canonicalId, item.current]),
    reduced.participants.map((item) => [item.canonicalId, item.current]),
  );
});

test("X. Reduced motion does not depend on animation for hierarchy comprehension", () => {
  const reduced = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY, true), 0);
  assert.equal(reduced.settled, true);
  assert.equal(reduced.participants.find((item) => item.canonicalId === CAPACITY)?.targetRole, "ACTIVE");
  assert.equal(reduced.participants.some((item) => item.canonicalId === COMPANY), false);
});

test("Y. Transition interruption/re-target preserves latest canonical target", () => {
  const first = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.4);
  const retarget = planManagementLevelMotion({
    previous: compositionFor(CAPACITY),
    next: compositionFor(PRODUCTION),
    selectedCanonicalId: PRODUCTION,
    liveSamples: liveSamplesFromMotionSample(first),
  });
  const settled = settleManagementLevelMotion(retarget);
  assert.equal(settled.selectedCanonicalId, PRODUCTION);
  assert.equal(retarget.interruptionPolicy, "retarget-from-live-sample");
  const expected = compositionFor(PRODUCTION);
  for (const slot of expected.slots) {
    const current = settled.participants.find((item) => item.canonicalId === slot.canonicalId)?.current;
    assert.deepEqual(current?.normalized, slot.placement.normalized);
    assert.equal(current?.scale, slot.scale);
  }
});

test("Z. No level history/drill stack is introduced", () => {
  const plan = planFor(CAPACITY, PRODUCTION);
  assert.equal(plan.mutatesLocalLevelStack, false);
  assert.equal("levelHistory" in plan, false);
});

test("AA. No camera choreography is introduced", () => {
  assert.equal(planFor(PRODUCTION, CAPACITY).cameraChoreography, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT.cameraChoreography, false);
});

test("AB. No physical-Z hierarchy motion is introduced", () => {
  assert.equal(planFor(PRODUCTION, CAPACITY).usesZForHierarchy, false);
  const mid = sampleManagementLevelMotion(planFor(PRODUCTION, CAPACITY), 0.5);
  assert.ok(mid.participants.every((item) => item.current.world.z === 0));
});

test("AC. Settled state exactly equals static MLEVEL:2 composition", () => {
  const next = compositionFor(CAPACITY);
  const settled = settleManagementLevelMotion(planFor(PRODUCTION, CAPACITY));
  assert.equal(settled.settled, true);
  assert.deepEqual(
    settled.participants.map((item) => item.canonicalId).sort(),
    next.slots.map((slot) => slot.canonicalId).sort(),
  );
  for (const slot of next.slots) {
    const current = settled.participants.find((item) => item.canonicalId === slot.canonicalId)?.current;
    assert.deepEqual(current?.normalized, slot.placement.normalized);
    assert.equal(current?.scale, slot.scale);
  }
});

test("AD. No transient transition state remains after settlement", () => {
  const settled = settleManagementLevelMotion(planFor(PRODUCTION, CAPACITY));
  assert.equal(settled.phase, "complete");
  assert.equal(settled.participants.some((item) => item.kind === "EXITING_CONTEXT" && item.targetRole == null), false);
});

test("AE. Existing Stage behavior remains safe with no level transition", () => {
  const next = compositionFor(COMPANY);
  const plan = planManagementLevelMotion({
    previous: null,
    next,
    selectedCanonicalId: COMPANY,
  });
  const sample = sampleManagementLevelMotion(plan, 0);
  assert.equal(sample.settled, true);
  assert.equal(sample.participants.length, 1);
  assert.equal(sample.participants[0]?.canonicalId, COMPANY);
});

test("AF. Timing/easing configuration comes from STAGE-MOTION:1 tokens", () => {
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.durationMs, EXECUTIVE_STAGE_MOTION.topologyDurationMs);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.reducedMotionDurationMs, EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.easing, "easeOutCubic");
  assert.equal(planFor(PRODUCTION, CAPACITY).durationMs, EXECUTIVE_STAGE_MOTION.topologyDurationMs);
  assert.equal(planFor(PRODUCTION, CAPACITY, true).durationMs, EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs);
});

test("Journeys A–E identity continuity and motion sanity artifact", () => {
  const down = planFor(PRODUCTION, CAPACITY);
  const mid = sampleManagementLevelMotion(down, 0.5);
  const end = settleManagementLevelMotion(down);
  const productionMid = mid.participants.find((item) => item.canonicalId === PRODUCTION)!;
  assert.equal(productionMid.canonicalId, PRODUCTION);
  assert.ok(productionMid.current.scale < productionMid.source.scale);
  assert.ok(productionMid.current.scale > productionMid.target.scale);
  const up = planFor(CAPACITY, PRODUCTION);
  assert.equal(kindOf(up, PRODUCTION), "PERSISTING_SHIFT");
  const out = join(HERE, "../../../artifacts/mlevel/MLEVEL-4");
  mkdirSync(out, { recursive: true });
  writeFileSync(
    join(out, "motion-sanity.json"),
    JSON.stringify(
      {
        drillDown: {
          t0: down.participants.map((item) => ({
            id: item.canonicalId,
            kind: item.kind,
            role: item.sourceRole,
            scale: item.source.scale,
          })),
          mid: mid.participants.map((item) => ({
            id: item.canonicalId,
            kind: item.kind,
            scale: item.current.scale,
            y: item.current.normalized.y,
          })),
          t1: end.participants.map((item) => ({
            id: item.canonicalId,
            kind: item.kind,
            role: item.targetRole,
            scale: item.current.scale,
          })),
        },
        drillUp: settleManagementLevelMotion(up).participants.map((item) => ({
          id: item.canonicalId,
          role: item.targetRole,
          scale: item.current.scale,
        })),
      },
      null,
      2,
    ),
  );
});

test("Live MLEVEL presentation consumes transition tokens", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraManagementLevelContextNav, {
      composition: compositionFor(CAPACITY),
      selectedCanonicalId: CAPACITY,
      onSelectSubject: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-management-level-context-nav"/);
  assert.match(html, /data-mlevel-motion=/);
  assert.match(html, /NPA-T MLEVEL:4\/ManagementLevelSpatialTransition/);
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /selectedCanonicalId=/);
  assert.match(shell, /NexoraManagementLevelContextNav/);
  const nav = readFileSync(
    join(HERE, "../../executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx"),
    "utf8",
  );
  assert.match(nav, /planManagementLevelMotion/);
  assert.match(nav, /sampleManagementLevelMotion/);
  assert.match(nav, /motionCssTransition/);
  assert.equal(nmiManagementLevelMotionIdentity, "NPA-T MLEVEL:4/ManagementLevelSpatialTransition");
});
