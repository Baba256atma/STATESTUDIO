/**
 * NPA-T SAVED-SCENE-LIVE-RESTORATION:1 — canonical live view restoration.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createSceneOrgSavedScene,
  resolveSceneOrgSavedScene,
} from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { createSceneOrgCanonicalReference } from "../scene-org/sceneOrgRegionContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPInteractionSubject,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import { applyNexoraMVPPresentationStateChange } from "./nexoraMVPPresentationState.ts";

const reference = createSceneOrgCanonicalReference({
  canonicalId: "obj-capacity",
  kind: "object",
  owner: "canonical MO/Object catalog",
});

function scene(
  sceneId: string,
  presentationDepth: "minimum" | "report" | "operation" = "report",
) {
  return createSceneOrgSavedScene({
    sceneId,
    name: sceneId,
    kind: "SAVED",
    sceneIntentType: "manager-view",
    canonicalReferences: [reference],
    layout: {
      presentationDepth,
      leftRegion: "management",
      rightRegion: "collapsed",
      detailWorkspace: "open",
    },
  });
}

test("Saved Scene schema whitelists references and presentation/layout metadata only", () => {
  const saved = createSceneOrgSavedScene({
    ...scene("capacity-live-review"),
    ...({
      status: "stable",
      attention: "normal",
      kpi: "82%",
      evidence: ["stale"],
      relationships: ["stale-edge"],
      watchRanking: ["obj-capacity"],
      watchBudget: 99,
      composedBodies: ["clone"],
    } as object),
  });
  assert.deepEqual(Object.keys(saved).sort(), [
    "canonicalReferences",
    "kind",
    "layout",
    "name",
    "sceneId",
    "sceneIntentType",
    "visibility",
  ]);
  for (const forbidden of [
    "status",
    "attention",
    "kpi",
    "evidence",
    "relationships",
    "watchRanking",
    "watchBudget",
    "composedBodies",
  ]) {
    assert.equal(forbidden in saved, false, forbidden);
  }
});

test("open resolves current canonical truth, label, KPI, evidence, and relationships", () => {
  const saved = scene("capacity-live-review");
  let current: Readonly<{
    id: string;
    label: string;
    status: string;
    attention: string;
    kpi: string;
    evidence: readonly string[];
    relationships: readonly string[];
  }> = Object.freeze({
    id: "obj-capacity",
    label: "Capacity",
    status: "stable",
    attention: "elevated",
    kpi: "82%",
    evidence: Object.freeze(["day-1"]),
    relationships: Object.freeze(["rel-old"]),
  });
  const first = resolveSceneOrgSavedScene(saved, () => current);
  current = Object.freeze({
    id: "obj-capacity",
    label: "Production Capacity",
    status: "critical",
    attention: "critical",
    kpi: "69%",
    evidence: Object.freeze(["day-5"]),
    relationships: Object.freeze(["rel-current"]),
  });
  const reopened = resolveSceneOrgSavedScene(saved, () => current);
  assert.equal(reopened.status, "resolved-current-canonical-subject");
  assert.equal(reopened.restoredCanonicalId, "obj-capacity");
  assert.strictEqual(reopened.live[0]?.content, current);
  assert.deepEqual(reopened.live[0]?.content, {
    id: "obj-capacity",
    label: "Production Capacity",
    status: "critical",
    attention: "critical",
    kpi: "69%",
    evidence: ["day-5"],
    relationships: ["rel-current"],
  });
  assert.notDeepEqual(first.live[0]?.content, reopened.live[0]?.content);
});

test("post-restore updates stay live and do not mutate stable Scene metadata", () => {
  const saved = scene("capacity-post-update");
  let status = "watch";
  const resolve = () =>
    resolveSceneOrgSavedScene(saved, () => ({ id: "obj-capacity", status }));
  assert.equal(resolve().live[0]?.content?.status, "watch");
  status = "critical";
  assert.equal(resolve().live[0]?.content?.status, "critical");
  assert.equal(saved.layout.presentationDepth, "report");
  assert.equal(saved.canonicalReferences[0]?.canonicalId, "obj-capacity");
});

test("multiple Scenes share one canonical subject without cloning truth", () => {
  const details = scene("customer-details", "report");
  const actions = scene("customer-actions", "operation");
  const canonical = Object.freeze({ id: "obj-capacity", status: "critical" });
  const resolve = () => canonical;
  const a = resolveSceneOrgSavedScene(details, resolve);
  const b = resolveSceneOrgSavedScene(actions, resolve);
  assert.strictEqual(a.live[0]?.content, canonical);
  assert.strictEqual(b.live[0]?.content, canonical);
  assert.notEqual(a.scene.layout.presentationDepth, b.scene.layout.presentationDepth);
});

test("saved presentation request is revalidated against the restored subject", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const subject = resolveNexoraMVPInteractionSubject("obj-capacity", catalog);
  assert.ok(subject);
  const selected = selectNexoraMVPInteractionSubject(initial, subject.id, catalog);
  const report = applyNexoraMVPPresentationStateChange(selected, "report");
  const operation = applyNexoraMVPPresentationStateChange(selected, "operation");
  assert.equal(report.presentationState, "report");
  assert.equal(operation.presentationState, "operation");

  const unknown = selectNexoraMVPInteractionSubject(initial, "obj-unknown", catalog);
  assert.equal(unknown, initial);
  const downgraded = applyNexoraMVPPresentationStateChange(
    Object.freeze({
      ...initial,
      selectedSubject: Object.freeze({
        id: "obj-unknown",
        label: "Unknown",
        kind: "object" as const,
      }),
      focusedSubject: Object.freeze({
        id: "obj-unknown",
        label: "Unknown",
        kind: "object" as const,
      }),
    }),
    "operation",
  );
  assert.equal(downgraded.presentationState, "report");
});

test("missing canonical subject is classified and shell fails closed to Overview/minimum", () => {
  const missing = resolveSceneOrgSavedScene(scene("missing"), () => null);
  assert.equal(missing.status, "canonical-subject-missing");
  assert.equal(missing.restoredCanonicalId, null);

  const source = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  const openScene = source.slice(
    source.indexOf('case "OPEN_SCENE"'),
    source.indexOf('case "MAKE_DEFAULT_SCENE"'),
  );
  assert.ok(
    openScene.indexOf("resolveSceneOrgSavedScene") <
      openScene.indexOf("selectNexoraMVPInteractionSubject"),
  );
  assert.ok(
    openScene.indexOf("selectNexoraMVPInteractionSubject") <
      openScene.indexOf("applyNexoraMVPPresentationStateChange"),
  );
  assert.match(openScene, /resetNexoraMVPObjectInteractionOverview/);
  assert.match(openScene, /NEXORA_MVP_DEFAULT_PRESENTATION_STATE/);
});

test("current catalog truth rebuilds the Stage after Saved Scene selection", () => {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  const catalog = Object.freeze({
    ...base,
    objects: Object.freeze(
      base.objects.map((object) =>
        object.id === "obj-capacity"
          ? Object.freeze({
              ...object,
              label: "Production Capacity",
              status: "risk" as const,
              attention: "critical" as const,
            })
          : object,
      ),
    ),
  });
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const selected = selectNexoraMVPInteractionSubject(
    initial,
    "obj-capacity",
    catalog,
  );
  const restored = applyNexoraMVPPresentationStateChange(selected, "report");
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    restored,
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  const capacity = presentation.scene.objects.find(
    (object) => object.id === "obj-capacity",
  );
  assert.equal(capacity?.label, "Production Capacity");
  assert.equal(capacity?.status, "risk");
  assert.equal(capacity?.attention, "critical");
  assert.equal(presentation.scene.presentationState, "report");
});

test("missing-subject reset clears stale focus and CENTER without changing membership", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
  const focused = selectNexoraMVPInteractionSubject(
    initial,
    "ctx-problem-capacity",
    catalog,
  );
  const reset = resetNexoraMVPObjectInteractionOverview(focused);
  const safe = applyNexoraMVPPresentationStateChange(reset, "minimum");
  assert.equal(safe.focusedSubject, null);
  assert.equal(safe.selectedSubject, null);
  assert.equal(safe.presentationState, "minimum");
  assert.equal(safe.mode, "overview");
  assert.equal(catalog.objects.length, baseCatalogSize());
});

function baseCatalogSize() {
  return getDefaultNexoraMVPObjectInteractionCatalog().objects.length;
}

test("runtime diagnostics distinguish saved reference from current truth source", () => {
  const source = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /data-saved-scene-restoration-status/);
  assert.match(source, /data-saved-scene-requested-subject/);
  assert.match(source, /data-saved-scene-restored-subject/);
  assert.match(source, /data-saved-scene-resolved-depth/);
  assert.match(source, /current-canonical-authorities/);
});
