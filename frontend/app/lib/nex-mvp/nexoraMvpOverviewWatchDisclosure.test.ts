/**
 * NPA-T OVERVIEW-WATCH-DISCLOSURE:1 — Overview Watch / Primary disclosure.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import {
  EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY,
  rankExecutiveWatchCandidates,
  resolveExecutiveStageDisclosure,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMvpSubjectPrimaryStageBodyAdmission } from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import { resolveNexoraMvpStagePopulationSnapshot } from "@/app/lib/nex-mvp/nexoraMvpComposedPopulation.ts";
import { NEXORA_MVP_STAGE_REPRESENTATION_ROLE } from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function overviewState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function present(
  state = overviewState(),
  nextCatalog: NexoraMVPObjectInteractionCatalog = catalog,
) {
  return deriveNexoraMVPStageInteractionPresentation(state, nextCatalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

function overviewSubjects(
  objects: readonly {
    readonly id: string;
    readonly label?: string;
    readonly kind?: string;
    readonly objectKind?: string;
    readonly attention?: string;
    readonly status?: string;
  }[],
) {
  return objects.map((object) =>
    Object.freeze({
      subjectId: object.id,
      label: object.label,
      objectKind: object.objectKind ?? object.kind ?? "object",
      family: "business-object" as const,
      attention: object.attention,
      status: object.status,
    }),
  );
}

function defaultOverviewDisclosure() {
  return resolveExecutiveStageDisclosure({
    subjects: overviewSubjects(catalog.objects),
    relationships: catalog.relationships,
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
}

test("policy identity — hybrid Overview, single disclosure owner", () => {
  assert.equal(
    EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.productMeaning,
    "HYBRID_EXECUTIVE_OVERVIEW",
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.owner,
    "resolveExecutiveStageDisclosure",
  );
  assert.equal(EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.secondStore, false);
  assert.equal(EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.hardCodedOverviewIds, false);
});

test("P1 — all 8 remain Primary admitted regardless of Overview subset", () => {
  const presentation = present();
  assert.equal(catalog.objects.length, 8);
  for (const entry of catalog.objects) {
    assert.equal(
      resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, entry.id)
        .admittedPrimaryBody,
      true,
    );
  }
  const snap = resolveNexoraMvpStagePopulationSnapshot({
    catalog,
    composedObjects: presentation.scene.objects,
  });
  assert.equal(snap.catalogPrimaryCount, 8);
  assert.ok(snap.composedPrimaryCount < snap.catalogPrimaryCount);
});

test("P2 — Overview composition derives from disclosure policy, not catalog order", () => {
  const reversed = {
    ...catalog,
    objects: Object.freeze([...catalog.objects].reverse()),
  };
  const a = defaultOverviewDisclosure();
  const b = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects(reversed.objects),
    relationships: reversed.relationships,
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual([...a.watchObjectIds].sort(), [...b.watchObjectIds].sort());
  assert.deepEqual(
    [...a.watchObjectIds].sort(),
    ["obj-capacity", "obj-risk"],
  );
  const ranked = rankExecutiveWatchCandidates({
    candidates: overviewSubjects(catalog.objects),
    maxVisible: 2,
  });
  assert.deepEqual(ranked.visibleIds, ["obj-risk", "obj-capacity"]);
});

test("P3 — current visible bodies have an explicit management reason", () => {
  const disclosure = defaultOverviewDisclosure();
  assert.equal(disclosure.byId.get("obj-risk")?.disclosureReason, "watch-critical");
  assert.equal(
    disclosure.byId.get("obj-capacity")?.disclosureReason,
    "watch-attention",
  );
  assert.equal(disclosure.byId.get("obj-risk")?.spatialRole, "watch");
  assert.equal(disclosure.byId.get("obj-capacity")?.spatialRole, "watch");
});

test("P4 — current hidden bodies have an explicit exclusion reason", () => {
  const disclosure = defaultOverviewDisclosure();
  assert.equal(
    disclosure.byId.get("obj-delivery")?.disclosureReason,
    "hidden-watch-overflow",
  );
  assert.equal(
    disclosure.byId.get("obj-budget")?.disclosureReason,
    "stable-no-current-attention",
  );
  assert.equal(
    disclosure.byId.get("obj-inventory")?.disclosureReason,
    "stable-no-current-attention",
  );
});

test("P5 — changing fixture order does not change Overview selection", () => {
  const rankedA = rankExecutiveWatchCandidates({
    candidates: overviewSubjects(catalog.objects),
    maxVisible: 2,
  });
  const rankedB = rankExecutiveWatchCandidates({
    candidates: overviewSubjects([...catalog.objects].reverse()),
    maxVisible: 2,
  });
  assert.deepEqual(rankedA.visibleIds, rankedB.visibleIds);
});

test("P6 — canonical IDs do not determine importance", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      {
        id: "obj-zzz",
        attention: "critical",
        status: "risk",
      },
      {
        id: "obj-aaa",
        attention: "normal",
        status: "stable",
      },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(disclosure.watchObjectIds, ["obj-zzz"]);
  assert.equal(
    disclosure.byId.get("obj-aaa")?.disclosureReason,
    "stable-no-current-attention",
  );
});

test("P7 — labels do not determine importance", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      {
        id: "obj-a",
        label: "Risk",
        attention: "normal",
        status: "stable",
      },
      {
        id: "obj-b",
        label: "Quiet Widget",
        attention: "critical",
        status: "watch",
      },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(disclosure.watchObjectIds, ["obj-b"]);
});

test("P8 — OVS form does not determine importance", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  const diamondStable = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      {
        id: "obj-risk-shape",
        objectKind: "risk",
        attention: "normal",
        status: "stable",
      },
      {
        id: "obj-ops",
        objectKind: "object",
        attention: "important",
        status: "watch",
      },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.ok(diamondStable.watchObjectIds.includes("obj-ops"));
  assert.equal(
    diamondStable.byId.get("obj-risk-shape")?.disclosureReason,
    "stable-no-current-attention",
  );
});

test("P9 — theme does not affect population", () => {
  const day = present(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  );
  const investigate = present(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "investigate",
    }),
  );
  const ids = (presentation: ReturnType<typeof present>) =>
    presentation.scene.objects
      .filter(
        (entry) =>
          entry.disclosureState !== "hidden" &&
          entry.spatialRole !== "hidden" &&
          entry.stageRepresentationRole ===
            NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      )
      .map((entry) => entry.id)
      .sort();
  assert.deepEqual(ids(day), ids(investigate));
});

test("P10 — DTH does not affect population", () => {
  const type = resolveCanonicalExecutiveObjectType({
    id: "obj-risk",
    kind: "object",
    label: "Risk",
  });
  assert.equal(type, "risk");
  const disclosure = defaultOverviewDisclosure();
  assert.ok(disclosure.watchObjectIds.includes("obj-risk"));
});

test("P11 — MLEVEL does not own Overview relevance", () => {
  assert.equal(EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.mlevelOwnsDisclosure, false);
  assert.equal(
    EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.owner,
    "resolveExecutiveStageDisclosure",
  );
});

test("P12 — Executive-work CENTER does not alter default Overview policy", () => {
  const focused = selectNexoraMVPInteractionSubject(
    overviewState(),
    "ctx-problem-capacity",
    catalog,
  );
  const restored = resetNexoraMVPObjectInteractionOverview(focused);
  const before = defaultOverviewDisclosure();
  const after = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects(catalog.objects),
    relationships: catalog.relationships,
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.equal(restored.mode, "overview");
  assert.deepEqual(before.watchObjectIds, after.watchObjectIds);
});

test("P13 — stable/no-attention case has deterministic useful fallback", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      { id: "obj-m", attention: "normal", status: "stable" },
      { id: "obj-k", attention: "normal", status: "stable" },
      { id: "obj-z", attention: "normal", status: "stable" },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(disclosure.watchObjectIds, ["obj-k", "obj-m"]);
  assert.equal(
    disclosure.byId.get("obj-k")?.disclosureReason,
    "orientation-fallback",
  );
  assert.equal(
    disclosure.byId.get("obj-z")?.disclosureReason,
    "stable-no-current-attention",
  );
});

test("P14 — too-many-attention case is deterministic", () => {
  const bodies = ["obj-f", "obj-c", "obj-a", "obj-e", "obj-b", "obj-d"].map(
    (id) => ({
      id,
      attention: "critical" as const,
      status: "watch" as const,
    }),
  );
  const first = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects(bodies),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  const reversed = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([...bodies].reverse()),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(first.watchObjectIds, ["obj-a", "obj-b"]);
  assert.deepEqual(first.watchObjectIds, reversed.watchObjectIds);
  assert.equal(
    first.byId.get("obj-c")?.disclosureReason,
    "hidden-watch-overflow",
  );
});

test("P15 — a newly admitted generic Primary Body can participate without ID registration", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      { id: "obj-capacity", attention: "normal", status: "stable" },
      { id: "obj-new-resource", attention: "critical", status: "unresolved" },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.ok(disclosure.watchObjectIds.includes("obj-new-resource"));
  assert.equal(
    disclosure.byId.get("obj-new-resource")?.disclosureReason,
    "watch-critical",
  );
});

test("state change — attention swap re-derives Overview", () => {
  const before = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      { id: "obj-a", attention: "stable" as never, status: "stable" },
      { id: "obj-b", attention: "critical", status: "watch" },
      { id: "obj-c", attention: "normal", status: "stable" },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(before.watchObjectIds, ["obj-b"]);
  const after = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      { id: "obj-a", attention: "critical", status: "watch" },
      { id: "obj-b", attention: "normal", status: "stable" },
      { id: "obj-c", attention: "normal", status: "stable" },
    ]),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(after.watchObjectIds, ["obj-a"]);
});

test("relationships do not expand Overview Watch set", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: overviewSubjects([
      { id: "obj-capacity", attention: "critical", status: "watch" },
      { id: "obj-budget", attention: "normal", status: "stable" },
    ]),
    relationships: [
      Object.freeze({
        id: "rel-budget-capacity",
        sourceId: "obj-budget",
        targetId: "obj-capacity",
      }),
    ],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
  assert.deepEqual(disclosure.watchObjectIds, ["obj-capacity"]);
  assert.equal(
    disclosure.byId.get("obj-budget")?.disclosureReason,
    "stable-no-current-attention",
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_DISCLOSURE_POLICY.relationshipExpansionInOverview,
    false,
  );
});
