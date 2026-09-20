/**
 * NPA-T STAGE-PROD:1 — Live Stage Foundation tests.
 * Integration onto the existing NEX-MVP host. No second Stage/Director/Theatre.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { hostNmiLiveManagementIntelligence } from "@/app/lib/nmi/nmiLivePipeline.ts";
import { nmiLiveIdentity } from "@/app/lib/nmi/nmiLiveIdentity.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getNexora3DExecutiveStageIdentity } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import { executiveStageQueueFoundationIdentity } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { ExecutiveShell } from "@/app/executive/components/ExecutiveShell.tsx";
import * as PublicIndex from "./stageProdPublicIndex.ts";
import {
  STAGE_PROD_LIVE_FOUNDATION_BOUNDARY,
  projectStageProdLiveFoundation,
  stageProdLiveFoundationIdentity,
  stageProdPublicIndexIdentity,
  verifyStageProdLiveFoundationBoundary,
} from "./stageProdPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function theatreFor(state: NexoraMVPObjectInteractionState) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
  });
}

test("STAGE-PROD:1 public index and authority boundary", () => {
  assert.equal(stageProdPublicIndexIdentity, "NPA-T STAGE-PROD:1/LiveStageFoundationPublicIndex");
  assert.equal(stageProdLiveFoundationIdentity, "NPA-T STAGE-PROD:1/LiveStageFoundation");
  assert.equal(verifyStageProdLiveFoundationBoundary().ok, true);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelStageStore, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelDirector, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelTheatre, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.startsStageProd2, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.queue, executiveStageQueueFoundationIdentity);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.host, getNexora3DExecutiveStageIdentity().id);
  assert.deepEqual(
    [...STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.consumptionPath],
    ["Canonical context", "Stage projection", "Live Stage host", "Visible Stage"],
  );
  assert.ok(Object.keys(PublicIndex).includes("projectStageProdLiveFoundation"));
  assert.equal(
    Object.keys(PublicIndex).some((key) => /write|commit|approve|startExecution/i.test(key)),
    false,
  );
});

test("A — /executive uses the production Stage host", () => {
  const page = readFileSync(join(FRONTEND, "app/executive/page.tsx"), "utf8");
  const cockpit = readFileSync(
    join(FRONTEND, "app/executive/components/ExecutiveCockpit.tsx"),
    "utf8",
  );
  const shell = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const mount = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"),
    "utf8",
  );
  assert.match(page, /from ["']\.\/components\/ExecutiveShell["']/);
  assert.doesNotMatch(page, /Exs1Cockpit|from ["']\.\/exs1/);
  assert.match(cockpit, /NexoraExecutiveShell/);
  assert.match(shell, /NexoraStageMount/);
  assert.match(mount, /Nexora3DExecutiveStage/);
  assert.match(shell, /projectStageProdLiveFoundation/);
  const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
  assert.match(html, /data-testid="executive-page"|data-testid="executive-shell"/);
  assert.match(html, /data-testid="nexora-stage-mount"/);
  assert.match(html, /data-testid="nexora-3d-executive-stage"/);
  assert.match(html, /data-stage-identity="NEX-MVP:3\/Nexora3DExecutiveStage"/);
  assert.match(html, /data-stage-prod-live="NPA-T STAGE-PROD:1\/LiveStageFoundation"/);
  assert.match(html, /aria-label="Executive Stage"/);
});

test("B — Canonical Stage projection reaches the host", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const theatre = theatreFor(focused);
  const nmi = hostNmiLiveManagementIntelligence({
    catalog,
    focusedSubjectId: "obj-revenue",
  });
  const projection = projectStageProdLiveFoundation({
    theatre,
    nmi,
    focusedCanonicalObjectId: "obj-revenue",
  });
  assert.equal(projection.status, "ok");
  assert.equal(projection.host, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(projection.mount, "NexoraStageMount");
  assert.equal(projection.route, "/executive");
  assert.equal(projection.identities.theatreSceneIdentity, theatre.theatreSceneIdentity);
  assert.equal(projection.identities.nmiLiveIdentity, nmiLiveIdentity);
  const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
  assert.match(html, /data-stage-prod-status="ok"/);
  assert.match(html, /data-stage-prod-host="NEX-MVP:3\/Nexora3DExecutiveStage"/);
  assert.match(html, /data-theatre-scene-intent=/);
  assert.match(html, /data-stage-prod-scene-intent=/);
});

test("C — focused Object identity is preserved source → projection → host", () => {
  const sourceId = "obj-revenue";
  const focused = selectNexoraMVPInteractionSubject(initial(), sourceId, catalog);
  assert.equal(focused.focusedSubject?.id, sourceId);
  const theatre = theatreFor(focused);
  assert.equal(theatre.primaryExecutiveObjectId, sourceId);
  const nmi = hostNmiLiveManagementIntelligence({
    catalog,
    focusedSubjectId: sourceId,
  });
  const projection = projectStageProdLiveFoundation({
    theatre,
    nmi,
    focusedCanonicalObjectId: focused.focusedSubject?.id ?? null,
    conversationalReferentId: focused.focusedSubject?.id ?? null,
  });
  assert.equal(projection.identities.focusedCanonicalObjectId, sourceId);
  assert.equal(projection.identities.theatrePrimaryObjectId, sourceId);
  assert.equal(projection.identities.conversationalReferentId, sourceId);
  assert.ok(projection.identities.goalIds.length + projection.identities.problemRiskIds.length >= 0);
  assert.equal(projection.inventedFacts, false);
});

test("D — Director/Theatre scene intent reaches Stage without UI reinterpretation", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const theatre = theatreFor(focused);
  const projection = projectStageProdLiveFoundation({
    theatre,
    nmi: hostNmiLiveManagementIntelligence({
      catalog,
      focusedSubjectId: "obj-revenue",
    }),
    focusedCanonicalObjectId: "obj-revenue",
  });
  assert.equal(
    projection.identities.theatreSceneIntentKind,
    theatre.sceneIntent.intentKind,
  );
  assert.equal(
    projection.identities.theatreSceneScriptId,
    theatre.sceneScript.scriptId,
  );
  assert.equal(
    projection.identities.directorIntent,
    theatre.directorProjection?.intent ?? null,
  );
  const projectorSource = readFileSync(
    join(HERE, "stageProdProjectLiveFoundation.ts"),
    "utf8",
  );
  assert.doesNotMatch(projectorSource, /intentKind\s*=\s*"/);
  assert.doesNotMatch(projectorSource, /REVIEW_FOCAL_OBJECT|ORIENT_TO_STAGE/);
  const mountSource = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"),
    "utf8",
  );
  assert.match(mountSource, /foundation\.identities\.theatreSceneIntentKind/);
  assert.doesNotMatch(mountSource, /sceneIntentKind\s*===\s*["']REVIEW/);
});

test("E — rendering Stage produces no unauthorized canonical writes", () => {
  const projection = projectStageProdLiveFoundation({
    theatre: theatreFor(initial()),
    nmi: hostNmiLiveManagementIntelligence({ catalog }),
  });
  assert.equal(projection.writesCanonicalManagementState, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.writesCanonicalManagementState, false);
  const projector = readFileSync(join(HERE, "stageProdProjectLiveFoundation.ts"), "utf8");
  assert.doesNotMatch(projector, /listDecisions\(\)\.push|commitDecision|startExecution/);
  const mount = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"),
    "utf8",
  );
  assert.match(mount, /data-stage-prod-writes="false"/);
});

test("F — missing/partial Stage projection fails safely", () => {
  const missing = projectStageProdLiveFoundation({});
  assert.equal(missing.status, "missing");
  assert.equal(missing.degraded, true);
  assert.equal(missing.inventedFacts, false);
  assert.equal(missing.identities.theatreSceneIntentKind, null);
  assert.equal(missing.identities.focusedCanonicalObjectId, null);
  assert.deepEqual(missing.identities.goalIds, []);
  assert.deepEqual(missing.identities.decisionIds, []);
  const partial = projectStageProdLiveFoundation({
    theatre: theatreFor(initial()),
  });
  assert.equal(partial.status, "partial");
  assert.equal(partial.degraded, true);
  assert.equal(partial.identities.nmiLiveIdentity, null);
  assert.deepEqual(partial.identities.kpiDataIds, []);
});

test("G — no duplicate Stage/Director/Theatre/NMI authority", () => {
  const projection = projectStageProdLiveFoundation({
    theatre: theatreFor(initial()),
    nmi: hostNmiLiveManagementIntelligence({ catalog }),
    dthExpSceneIdentity: "NPA-T DTH-EXP:10/ExecutiveJourney",
  });
  assert.equal(projection.parallelStageStore, false);
  assert.equal(projection.parallelDirector, false);
  assert.equal(projection.parallelTheatre, false);
  assert.equal(projection.startsStageProd2, false);
  assert.equal(projection.identities.dthExpSceneIdentity, "NPA-T DTH-EXP:10/ExecutiveJourney");
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelQueue, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelNmi, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelAdvisor, false);
  const projector = readFileSync(join(HERE, "stageProdProjectLiveFoundation.ts"), "utf8");
  assert.doesNotMatch(projector, /composeDthExpExecutiveJourney|directNexoraPresentation/);
  assert.match(projector, /projectNexoraDecisionTheatreFoundation|NexoraDecisionTheatreFoundation/);
});
