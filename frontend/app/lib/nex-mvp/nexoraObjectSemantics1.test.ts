/**
 * NPA-T OBJECT-SEMANTICS:1 — canonical management identity.
 *
 * Stage `kind` stays the business-object category. `objectKind` is the
 * management identity when the catalog record declares one.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { CSV_MAPPING_TARGETS } from "@/app/lib/data-reality/csvRealDataVerticalSlice.ts";
import type { DataRealityAwareStageBindingResult } from "@/app/lib/data-reality/dataRealityAwareStageExperienceBinding.ts";
import { collectManagerObjectContext } from "@/app/lib/manager-object/managerObjectContext.ts";
import { findManagerObjectCatalogRecord } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  resolveNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import { applyDataRealityAwareStageBindingsToCatalog } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPStageScenePresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import {
  NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  NEXORA_MVP_CANONICAL_RISK_OBJECT_KIND,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
  getNexoraMVPStageObjectFixtures,
  type NexoraMVPStageObjectFixture,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { projectExecutiveOvsObjectKindHandoff } from "@/app/lib/spatial-presentation/projectExecutiveOvsObjectKindHandoff.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  resolveExecutiveOvsObjectVisualLanguage,
} from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";

const here = dirname(fileURLToPath(import.meta.url));

const GENERIC_OBJECT_IDS = [
  "obj-capacity",
  "obj-inventory",
  "obj-demand",
  "obj-customer",
  "obj-delivery",
  "obj-budget",
  "obj-revenue",
] as const;

function catalogWith(
  objects: readonly NexoraMVPStageObjectFixture[],
): NexoraMVPObjectInteractionCatalog {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  return Object.freeze({ ...base, objects });
}

function sceneFor(environmentIntent: "neutral" | "commit") {
  return resolveNexoraMVPStageScenePresentation({
    objects: getNexoraMVPStageObjectFixtures(),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    focusedObjectId: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    presentationState: "minimum",
    environmentIntent,
  });
}

test("Risk canonical record stores management identity risk", () => {
  const record = getNexoraMVPStageObjectFixtures().find(
    (object) => object.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  );
  assert.ok(record);
  assert.equal(record.kind, "object");
  assert.equal(record.objectKind, NEXORA_MVP_CANONICAL_RISK_OBJECT_KIND);
  assert.equal(record.objectKind, "risk");
  assert.equal(record.label, "Risk");
});

test("resolveIdentity(obj-risk) is risk without label inference", () => {
  const identity = collectManagerObjectContext(NEXORA_MVP_CANONICAL_RISK_OBJECT_ID);
  assert.equal(identity.objectId, "obj-risk");
  assert.equal(identity.identity.value, "Risk");
  assert.equal(identity.objectKind.value, "risk");
  assert.equal(identity.objectKind.support, "KNOWN");

  const stripped = catalogWith(
    getNexoraMVPStageObjectFixtures().map((object) =>
      object.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID
        ? Object.freeze({
            id: object.id,
            label: "Risk",
            kind: "object" as const,
            position: object.position,
            status: "stable" as const,
            attention: "normal" as const,
          })
        : object,
    ),
  );
  assert.equal(
    collectManagerObjectContext(NEXORA_MVP_CANONICAL_RISK_OBJECT_ID, stripped)
      .objectKind.value,
    "object",
  );

  const declared = catalogWith([
    Object.freeze({
      id: "obj-exposure",
      label: "Exposure Watch",
      kind: "object" as const,
      objectKind: "risk" as const,
      position: [0, 0, 0] as const,
      status: "stable" as const,
      attention: "normal" as const,
    }),
  ]);
  assert.equal(
    collectManagerObjectContext("obj-exposure", declared).objectKind.value,
    "risk",
  );
});

test("Stage projection forwards Risk management identity and keeps stage category", () => {
  const scene = sceneFor("neutral");
  const risk = scene.objects.find((object) => object.id === "obj-risk");
  assert.ok(risk);
  assert.equal(risk.kind, "object");
  assert.equal(risk.objectKind, "risk");
  const subject = resolveNexoraMVPInteractionSubject("obj-risk");
  assert.equal(subject?.id, "obj-risk");
  assert.equal(subject?.kind, "object");
});

test("generic business objects stay object", () => {
  for (const id of GENERIC_OBJECT_IDS) {
    const record = getNexoraMVPStageObjectFixtures().find((object) => object.id === id);
    assert.ok(record, id);
    assert.equal(record.kind, "object", id);
    assert.equal(record.objectKind, undefined, id);
    const identity = collectManagerObjectContext(id);
    assert.equal(identity.objectKind.value, "object", id);
    const projected = sceneFor("neutral").objects.find((object) => object.id === id);
    assert.equal(projected?.kind, "object", id);
    assert.equal(projected?.objectKind, undefined, id);
  }
});

test("Inventory On Hand is a measurement, not Inventory's identity", () => {
  const inventory = collectManagerObjectContext("obj-inventory");
  assert.equal(inventory.objectKind.value, "object");
  const measurement = CSV_MAPPING_TARGETS.find(
    (target) => target.targetId === "inventory.on-hand",
  );
  assert.ok(measurement);
  assert.equal(measurement.label, "Inventory On Hand");
  assert.equal(measurement.objectKey, "inventory");
  assert.equal(measurement.metricKey, "onHand");
  assert.notEqual(measurement.targetId, "obj-inventory");
  const presentation = getNexoraMVPSubjectPresentationFixture("obj-inventory");
  assert.equal(presentation?.subjectKind, "object");
  assert.equal(presentation?.primaryKpi?.id, "kpi-inventory");
  assert.notEqual(presentation?.primaryKpi?.id, "obj-inventory");
});

test("Capacity object stays separate from the Capacity Goal and Capacity Availability", () => {
  const capacity = collectManagerObjectContext("obj-capacity");
  assert.equal(capacity.objectKind.value, "object");
  const goal = collectManagerObjectContext("goal-capacity-availability");
  assert.equal(goal.objectKind.value, "goal");
  assert.equal(
    findManagerObjectCatalogRecord("goal-capacity-availability")?.objectKind,
    "goal",
  );
  assert.equal(
    findManagerObjectCatalogRecord("goal-capacity-availability")?.associatedObjectId,
    "obj-capacity",
  );
  assert.notEqual(capacity.objectId, goal.objectId);
  const availability = CSV_MAPPING_TARGETS.find(
    (target) => target.metricKey === "usedCapacity" || target.metricKey === "totalCapacity",
  );
  assert.ok(availability);
  assert.notEqual(availability.targetId, "obj-capacity");
});

test("context subjects stay distinct from the Capacity object", () => {
  assert.equal(
    collectManagerObjectContext("ctx-problem-capacity").objectKind.value,
    "problem",
  );
  assert.equal(
    collectManagerObjectContext("ctx-scenario-capacity").objectKind.value,
    "scenario",
  );
  assert.equal(
    collectManagerObjectContext("ctx-decision-capacity").objectKind.value,
    "decision",
  );
  assert.equal(
    collectManagerObjectContext("ctx-execution-capacity").objectKind.value,
    "execution",
  );
  assert.equal(collectManagerObjectContext("obj-capacity").objectKind.value, "object");
});

test("DTH classification does not overwrite canonical management kind", () => {
  for (const id of GENERIC_OBJECT_IDS) {
    const record = getNexoraMVPStageObjectFixtures().find((object) => object.id === id);
    assert.ok(record);
    const dth = resolveCanonicalExecutiveObjectType({
      id,
      kind: record.kind,
      label: record.label,
    });
    assert.equal(dth, "kpi", id);
    assert.equal(record.kind, "object", id);
    assert.equal(collectManagerObjectContext(id).objectKind.value, "object", id);
  }
  const risk = getNexoraMVPStageObjectFixtures().find((object) => object.id === "obj-risk");
  assert.ok(risk);
  assert.equal(
    resolveCanonicalExecutiveObjectType({
      id: risk.id,
      kind: risk.kind,
      label: risk.label,
    }),
    "risk",
  );
  assert.equal(risk.objectKind, "risk");
});

test("status and attention changes do not change management identity", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const beforeRisk = collectManagerObjectContext("obj-risk", catalog).objectKind.value;
  const beforeInventory = collectManagerObjectContext("obj-inventory", catalog).objectKind.value;
  const stamped = applyDataRealityAwareStageBindingsToCatalog(catalog, {
    objects: catalog.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        mvpStatus: object.id === "obj-inventory" ? "watch" : "stable",
        mvpAttention: object.id === "obj-inventory" ? "critical" : "normal",
      }),
    ),
  } as unknown as DataRealityAwareStageBindingResult);
  const inventory = stamped.objects.find((object) => object.id === "obj-inventory");
  const risk = stamped.objects.find((object) => object.id === "obj-risk");
  assert.equal(inventory?.status, "watch");
  assert.equal(inventory?.attention, "critical");
  assert.equal(inventory?.kind, "object");
  assert.equal(inventory?.objectKind, undefined);
  assert.equal(risk?.kind, "object");
  assert.equal(risk?.objectKind, "risk");
  assert.equal(risk?.status, "stable");
  assert.equal(
    collectManagerObjectContext("obj-risk", stamped).objectKind.value,
    beforeRisk,
  );
  assert.equal(
    collectManagerObjectContext("obj-inventory", stamped).objectKind.value,
    beforeInventory,
  );
  assert.equal(beforeRisk, "risk");
  assert.equal(beforeInventory, "object");
});

test("theme intent does not change management identity", () => {
  const neutral = sceneFor("neutral");
  const commit = sceneFor("commit");
  for (const id of [...GENERIC_OBJECT_IDS, "obj-risk"] as const) {
    const day = neutral.objects.find((object) => object.id === id);
    const night = commit.objects.find((object) => object.id === id);
    assert.equal(day?.kind, night?.kind, id);
    assert.equal(day?.objectKind, night?.objectKind, id);
  }
  const identitySource = readFileSync(
    join(here, "../manager-object/managerObjectContext.ts"),
    "utf8",
  );
  assert.doesNotMatch(identitySource, /theme|day|night/i);
});

test("OVS form cue is catalog objectKind, not the Risk id", () => {
  const record = getNexoraMVPStageObjectFixtures().find(
    (object) => object.id === "obj-risk",
  );
  assert.equal(record?.objectKind, "risk");
  const handoff = projectExecutiveOvsObjectKindHandoff({
    id: record?.id,
    kind: record?.kind,
    objectKind: record?.objectKind,
  });
  assert.equal(handoff, "risk");
  assert.equal(
    collectManagerObjectContext("obj-risk").objectKind.value,
    handoff,
  );
  const riskLanguage = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: handoff,
    enabled: true,
  });
  assert.equal(riskLanguage.family, "risk");
  assert.equal(riskLanguage.primitive, "diamond");
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: "obj-risk",
      kind: "object",
    }),
    "object",
  );
  const inventoryKind = projectExecutiveOvsObjectKindHandoff({
    id: "obj-inventory",
    kind: "object",
  });
  assert.equal(inventoryKind, "object");
  const inventoryLanguage = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: inventoryKind,
    enabled: true,
  });
  assert.equal(inventoryLanguage.family, "operational");
  assert.equal(inventoryLanguage.primitive, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
  const handoffSource = readFileSync(
    join(here, "../spatial-presentation/projectExecutiveOvsObjectKindHandoff.ts"),
    "utf8",
  );
  assert.doesNotMatch(handoffSource, /NEXORA_MVP_CANONICAL_RISK_OBJECT_ID/);
  assert.doesNotMatch(handoffSource, /obj-risk/);
});

test("relationships are unchanged", () => {
  assert.deepEqual(
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((entry) =>
      [entry.id, entry.sourceId, entry.targetId].join(":"),
    ),
    [
      "rel-budget-capacity:obj-budget:obj-capacity",
      "rel-capacity-delivery:obj-capacity:obj-delivery",
      "rel-delivery-customer:obj-delivery:obj-customer",
      "rel-customer-revenue:obj-customer:obj-revenue",
      "rel-risk-delivery:obj-risk:obj-delivery",
      "rel-inventory-capacity:obj-inventory:obj-capacity",
      "rel-demand-delivery:obj-demand:obj-delivery",
      "rel-demand-revenue:obj-demand:obj-revenue",
    ],
  );
});

test("stage disclosure still receives the structural kind", () => {
  const stage = readFileSync(join(here, "./nexora3DExecutiveStage.ts"), "utf8");
  assert.match(stage, /objectKind: object\.kind/);
  assert.match(stage, /object\.objectKind != null \? \{ objectKind: object\.objectKind \}/);
});
