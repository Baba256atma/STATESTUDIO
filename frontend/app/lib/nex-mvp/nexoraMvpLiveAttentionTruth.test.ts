/**
 * NPA-T LIVE-ATTENTION-TRUTH:1 — effective attention/status authority.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { resolveExecutiveOvsObjectStateVisual } from "@/app/lib/spatial-presentation/executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_STAGE_WATCH_BUDGET,
  rankExecutiveWatchCandidates,
  resolveExecutiveStageDisclosure,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract.ts";
import {
  applyDataRealityAwareStageBindingsToCatalog,
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMvpSubjectPrimaryStageBodyAdmission } from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import {
  NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY,
  isSupportedLiveManagementEvidence,
  resolveNexoraMvpEffectiveManagementState,
  resolveNexoraMvpEffectiveManagementStates,
} from "@/app/lib/nex-mvp/nexoraMvpLiveAttentionTruth.ts";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const fixtureById = Object.fromEntries(
  NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((entry) => [entry.id, entry]),
);

function overviewSubjects(
  objects: readonly {
    readonly id: string;
    readonly attention: string;
    readonly status: string;
  }[],
) {
  return objects.map((object) =>
    Object.freeze({
      subjectId: object.id,
      objectKind: "object",
      family: "business-object" as const,
      attention: object.attention,
      status: object.status,
    }),
  );
}

function overviewFromCatalog(
  objects: readonly {
    readonly id: string;
    readonly attention: string;
    readonly status: string;
  }[],
) {
  return resolveExecutiveStageDisclosure({
    subjects: overviewSubjects(objects),
    relationships: [],
    presentationMode: "overview",
    presentationDepth: "minimum",
    watchBudgetMax: 2,
  });
}

test("policy identity — single overlay resolver, no second store", () => {
  assert.equal(
    NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.owner,
    "resolveNexoraMvpEffectiveManagementState",
  );
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.secondStore, false);
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.mutatesCanonicalBaseline, false);
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.llmWritesEffectiveState, false);
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.unboundSafetyOverwrite, false);
});

test("1 — baseline-only attention/status", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-budget",
    baseline: { attention: "normal", status: "stable" },
  });
  assert.deepEqual(resolved.effective, { attention: "normal", status: "stable" });
  assert.equal(resolved.provenance.sourceClass, "catalog-baseline");
  assert.equal(resolved.fieldSources.attention, "catalog-baseline");
});

test("2 — full supported live override", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-customer-1"],
        datasetId: "dataset-a",
      },
    ],
  });
  assert.deepEqual(resolved.effective, {
    attention: "important",
    status: "watch",
  });
  assert.equal(resolved.provenance.sourceClass, "data-reality-supported");
  assert.deepEqual(resolved.provenance.evidenceIds, ["ev-customer-1"]);
});

test("3 — status-only live evidence retains baseline attention", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-x",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [
      {
        objectId: "obj-x",
        bindingStatus: "bound",
        mvpStatus: "watch",
        evidenceIds: ["ev-status"],
      },
    ],
  });
  assert.equal(resolved.effective.status, "watch");
  assert.equal(resolved.effective.attention, "elevated");
  assert.equal(resolved.fieldSources.attention, "catalog-baseline");
  assert.equal(resolved.fieldSources.status, "live-supported");
});

test("4 — attention-only live evidence retains baseline status", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-x",
    baseline: { attention: "normal", status: "stable" },
    evidence: [
      {
        objectId: "obj-x",
        bindingStatus: "bound",
        mvpAttention: "critical",
        evidenceIds: ["ev-attention"],
      },
    ],
  });
  assert.equal(resolved.effective.attention, "critical");
  assert.equal(resolved.effective.status, "stable");
});

test("5 — unsupported live evidence cannot change effective state", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "unbound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-bad"],
      },
    ],
  });
  assert.equal(
    isSupportedLiveManagementEvidence({
      objectId: "obj-customer",
      bindingStatus: "unbound",
      mvpAttention: "important",
      mvpStatus: "watch",
    }),
    false,
  );
  assert.deepEqual(resolved.effective, { attention: "elevated", status: "stable" });
  assert.equal(resolved.provenance.sourceClass, "live-withheld");
});

test("6 — missing live evidence falls back to baseline", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-risk",
    baseline: { attention: "critical", status: "risk" },
    evidence: [],
  });
  assert.deepEqual(resolved.effective, resolved.baseline);
});

test("7 — later same-source update replaces prior supported state", () => {
  const baseline = { attention: "elevated" as const, status: "stable" as const };
  const first = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline,
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-1"],
        datasetId: "ds-a",
      },
    ],
  });
  const second = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline,
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        mvpAttention: "normal",
        mvpStatus: "stable",
        evidenceIds: ["ev-2"],
        datasetId: "ds-a",
      },
    ],
  });
  assert.equal(first.effective.status, "watch");
  assert.deepEqual(second.effective, { attention: "normal", status: "stable" });
});

test("8/9 — conflicting supported evidence is deterministic, not array order", () => {
  const evidenceA = {
    objectId: "obj-customer",
    bindingStatus: "bound" as const,
    mvpStatus: "watch" as const,
    mvpAttention: "important" as const,
    evidenceIds: ["ev-a"],
    datasetId: "ds",
  };
  const evidenceB = {
    objectId: "obj-customer",
    bindingStatus: "bound" as const,
    mvpStatus: "stable" as const,
    mvpAttention: "normal" as const,
    evidenceIds: ["ev-z"],
    datasetId: "ds",
  };
  const forward = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [evidenceA, evidenceB],
  });
  const reversed = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [evidenceB, evidenceA],
  });
  assert.deepEqual(forward.effective, reversed.effective);
  assert.equal(forward.effective.status, "stable");
  assert.equal(forward.provenance.evidenceIds[0], "ev-z");
});

test("10 — reset/withdrawal falls back to baseline", () => {
  const live = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-live"],
      },
    ],
  });
  const withdrawn = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: live.baseline,
    evidence: [],
  });
  assert.equal(live.effective.status, "watch");
  assert.deepEqual(withdrawn.effective, withdrawn.baseline);
});

test("11 — canonical ID unchanged by live state", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  const risk = experience.catalog.objects.find((entry) => entry.id === "obj-risk");
  assert.equal(risk?.id, "obj-risk");
  assert.equal(risk?.objectKind, "risk");
  const fixtureRisk = NEXORA_MVP_STAGE_OBJECT_FIXTURES.find(
    (entry) => entry.id === "obj-risk",
  );
  assert.equal(fixtureRisk?.objectKind, "risk");
});

test("12 — Primary admission unchanged by live state", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  for (const object of catalog.objects) {
    assert.equal(
      resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, object.id)
        .admittedPrimaryBody,
      true,
    );
    assert.equal(
      resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
        experience.catalog,
        object.id,
      ).admittedPrimaryBody,
      true,
    );
  }
  assert.equal(experience.catalog.objects.length, 8);
});

test("13 — provenance retained on supported live", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-capacity",
    baseline: { attention: "important", status: "watch" },
    evidence: [
      {
        objectId: "obj-capacity",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-cap"],
        realityState: "watch",
        datasetId: "executive-operations",
      },
    ],
    runtimeStateId: "runtime-1",
  });
  assert.equal(resolved.provenance.datasetId, "executive-operations");
  assert.equal(resolved.provenance.runtimeStateId, "runtime-1");
  assert.equal(resolved.provenance.realityState, "watch");
});

test("14 — Customer promotion is evidence, not ID/label", () => {
  const promoted = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-new-account",
    baseline: { attention: "normal", status: "stable" },
    evidence: [
      {
        objectId: "obj-new-account",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-generic"],
      },
    ],
  });
  assert.deepEqual(promoted.effective, {
    attention: "important",
    status: "watch",
  });
  const owner = readFileSync(join(here, "nexoraMvpLiveAttentionTruth.ts"), "utf8");
  assert.doesNotMatch(owner, /obj-customer/);
  assert.doesNotMatch(owner, /label\.includes/);
});

test("15 — Risk effective change does not mutate objectKind; unbound retains baseline", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  const risk = experience.effectiveManagementStates.find(
    (entry) => entry.canonicalId === "obj-risk",
  );
  assert.ok(risk);
  assert.deepEqual(risk.baseline, { attention: "critical", status: "risk" });
  assert.deepEqual(risk.effective, risk.baseline);
  assert.equal(risk.provenance.sourceClass, "live-withheld");
  const stamped = experience.catalog.objects.find((entry) => entry.id === "obj-risk");
  assert.equal(stamped?.objectKind, "risk");
  assert.equal(stamped?.attention, "critical");
  assert.equal(stamped?.status, "risk");
  assert.equal(fixtureById["obj-risk"]?.attention, "critical");
});

test("16 — Capacity continuity when live agrees with baseline class", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  const capacity = experience.effectiveManagementStates.find(
    (entry) => entry.canonicalId === "obj-capacity",
  );
  assert.ok(capacity);
  assert.equal(capacity.baseline.attention, "important");
  assert.equal(capacity.baseline.status, "watch");
  assert.equal(capacity.effective.attention, "important");
  assert.equal(capacity.effective.status, "watch");
  assert.equal(capacity.canonicalId, "obj-capacity");
});

test("17 — Overview consumes effective state", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  const customer = experience.effectiveManagementStates.find(
    (entry) => entry.canonicalId === "obj-customer",
  );
  assert.equal(customer?.effective.attention, "important");
  assert.equal(customer?.effective.status, "watch");
  const disclosure = overviewFromCatalog(experience.catalog.objects);
  assert.deepEqual([...disclosure.watchObjectIds].sort(), [
    "obj-capacity",
    "obj-risk",
  ]);
  assert.equal(
    disclosure.byId.get("obj-risk")?.disclosureReason,
    "watch-critical",
  );
  assert.equal(
    disclosure.byId.get("obj-customer")?.disclosureReason,
    "hidden-watch-overflow",
  );
});

test("18 — OVS consumes resolved upstream state", () => {
  const risk = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-risk",
    baseline: { attention: "critical", status: "risk" },
  });
  const visual = resolveExecutiveOvsObjectStateVisual({
    status: risk.effective.status,
    attention: risk.effective.attention,
  });
  assert.ok(visual);
  const owner = readFileSync(
    join(here, "../spatial-presentation/executiveOvsObjectStateVisual.ts"),
    "utf8",
  );
  assert.match(owner, /Presentation only/);
});

test("19 — NMI does not own Stage object attention", () => {
  assert.equal(NMI_FOUNDATION_CONTRACT.attentionImplemented, false);
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.nmiOwnsTruth, false);
});

test("20 — Advisor does not own effective Stage catalog state", () => {
  assert.equal(NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.advisorOwnsTruth, false);
});

test("21 — LLM cannot directly write state", () => {
  assert.equal(
    NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY.llmWritesEffectiveState,
    false,
  );
  const owner = readFileSync(join(here, "nexoraMvpLiveAttentionTruth.ts"), "utf8");
  assert.doesNotMatch(owner, /openai|anthropic|chat\.completions/i);
});

test("22 — CSV/provider identity does not determine semantics", () => {
  const csv = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-a",
    baseline: { attention: "normal", status: "stable" },
    evidence: [
      {
        objectId: "obj-a",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["csv:row:1"],
        datasetId: "csv",
      },
    ],
  });
  const api = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-a",
    baseline: { attention: "normal", status: "stable" },
    evidence: [
      {
        objectId: "obj-a",
        bindingStatus: "bound",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["api:row:1"],
        datasetId: "salesforce",
      },
    ],
  });
  assert.deepEqual(csv.effective, api.effective);
  const owner = readFileSync(join(here, "nexoraMvpLiveAttentionTruth.ts"), "utf8");
  assert.doesNotMatch(owner, /source === \"csv\"/);
  assert.doesNotMatch(owner, /Salesforce/);
});

test("23 — input order does not change result unless evidence identity differs", () => {
  const objects = [
    { id: "obj-b", attention: "normal" as const, status: "stable" as const },
    { id: "obj-a", attention: "normal" as const, status: "stable" as const },
  ];
  const bindings = [
    {
      objectId: "obj-a",
      bindingStatus: "bound" as const,
      mvpStatus: "watch" as const,
      mvpAttention: "important" as const,
      evidenceIds: ["e1"],
      realityState: "watch" as const,
      hasData: true,
      hasKPI: true,
      resolutionStatus: "resolved" as const,
    },
  ];
  const a = resolveNexoraMvpEffectiveManagementStates({
    baselineObjects: objects,
    bindings,
  });
  const b = resolveNexoraMvpEffectiveManagementStates({
    baselineObjects: [...objects].reverse(),
    bindings: [...bindings].reverse(),
  });
  assert.deepEqual(
    a.map((entry) => [entry.canonicalId, entry.effective]),
    [
      ["obj-b", { attention: "normal", status: "stable" }],
      ["obj-a", { attention: "important", status: "watch" }],
    ],
  );
  assert.deepEqual(
    Object.fromEntries(a.map((entry) => [entry.canonicalId, entry.effective])),
    Object.fromEntries(b.map((entry) => [entry.canonicalId, entry.effective])),
  );
});

test("24 — recomputation produces identical output", () => {
  const input = {
    canonicalId: "obj-customer",
    baseline: { attention: "elevated" as const, status: "stable" as const },
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound" as const,
        mvpAttention: "important" as const,
        mvpStatus: "watch" as const,
        evidenceIds: ["ev-1"],
      },
    ],
  };
  assert.deepEqual(
    resolveNexoraMvpEffectiveManagementState(input),
    resolveNexoraMvpEffectiveManagementState(input),
  );
});

test("25 — Watch ranking/disclosure remains sealed", () => {
  assert.equal(EXECUTIVE_STAGE_WATCH_BUDGET.minVisible, 2);
  assert.equal(EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible, 3);
  const ranked = rankExecutiveWatchCandidates({
    candidates: overviewSubjects(catalog.objects),
    maxVisible: 2,
  });
  assert.deepEqual(ranked.visibleIds, ["obj-risk", "obj-capacity"]);
});

test("I3 — baseline fixtures remain inspectable after overlay", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
  });
  assert.equal(fixtureById["obj-customer"]?.attention, "elevated");
  assert.equal(fixtureById["obj-customer"]?.status, "stable");
  const customer = experience.effectiveManagementStates.find(
    (entry) => entry.canonicalId === "obj-customer",
  );
  assert.equal(customer?.baseline.attention, "elevated");
  assert.equal(customer?.effective.attention, "important");
  assert.notEqual(
    experience.catalog.objects.find((entry) => entry.id === "obj-customer")
      ?.attention,
    fixtureById["obj-customer"]?.attention,
  );
});

test("unavailable resolution withholds live fields", () => {
  const resolved = resolveNexoraMvpEffectiveManagementState({
    canonicalId: "obj-customer",
    baseline: { attention: "elevated", status: "stable" },
    evidence: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        resolutionStatus: "unavailable",
        mvpAttention: "important",
        mvpStatus: "watch",
        evidenceIds: ["ev-unavail"],
      },
    ],
  });
  assert.deepEqual(resolved.effective, { attention: "elevated", status: "stable" });
});

test("apply overlay does not mutate default catalog fixtures", () => {
  const stamped = applyDataRealityAwareStageBindingsToCatalog(catalog, {
    objects: [
      {
        objectId: "obj-customer",
        bindingStatus: "bound",
        mvpStatus: "watch",
        mvpAttention: "important",
        evidenceIds: [],
        realityState: "watch",
        hasData: true,
        hasKPI: true,
        resolutionStatus: "resolved",
      },
    ],
  } as never);
  assert.equal(
    getDefaultNexoraMVPObjectInteractionCatalog().objects.find(
      (entry) => entry.id === "obj-customer",
    )?.status,
    "stable",
  );
  assert.equal(
    stamped.objects.find((entry) => entry.id === "obj-customer")?.status,
    "watch",
  );
  assert.equal(
    stamped.objects.find((entry) => entry.id === "obj-risk")?.status,
    "risk",
  );
});

test("missing canonical object with live evidence is ignored (fail closed)", () => {
  const states = resolveNexoraMvpEffectiveManagementStates({
    baselineObjects: [
      { id: "obj-only", attention: "normal", status: "stable" },
    ],
    extraEvidence: [
      {
        objectId: "obj-ghost",
        bindingStatus: "bound",
        mvpAttention: "critical",
        mvpStatus: "risk",
        evidenceIds: ["ghost"],
      },
    ],
  });
  assert.equal(states.length, 1);
  assert.equal(states[0]?.canonicalId, "obj-only");
  assert.equal(states[0]?.effective.attention, "normal");
});
