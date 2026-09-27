import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "@/app/executive/nex-mvp/NexoraExecutiveShell.tsx";
import {
  NexoraDetailWorkspaceBoundary,
  NexoraWorkspaceRegionBoundary,
} from "@/app/executive/nex-mvp/scene-org/NexoraWorkspaceRegionBoundary.tsx";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  SCENE_ORG_AUTHORITY_REGION_MATRIX,
  SCENE_ORG_DUPLICATE_AUTHORITY_GUARD,
  SCENE_ORG_REGION_CONTRACTS,
  SCENE_ORG_REGION_IDS,
  createSceneOrgCanonicalReference,
  sceneOrgRegionContractIdentity,
} from "./sceneOrgRegionContract.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");

test("ORG:2 defines four presentation-only regions that own no canonical authority", () => {
  assert.deepEqual(SCENE_ORG_REGION_IDS, [
    "left-management",
    "center-stage",
    "right-context",
    "detail-workspace",
  ]);
  for (const region of SCENE_ORG_REGION_IDS) {
    const contract = SCENE_ORG_REGION_CONTRACTS[region];
    assert.equal(contract.presentationOnly, true);
    assert.ok(contract.neverOwns.includes("manager-workflow"));
    assert.ok(contract.neverOwns.includes("queue-attention"));
    assert.ok(contract.neverOwns.includes("stage"));
    assert.ok(contract.neverOwns.includes("data-reality"));
  }
  assert.equal(SCENE_ORG_REGION_CONTRACTS["detail-workspace"].reservationOnly, true);
});

test("ORG:2 authority matrix keeps every owner outside the four regions", () => {
  const owners = new Map(
    SCENE_ORG_AUTHORITY_REGION_MATRIX.map((entry) => [entry.authority, entry.owner]),
  );
  assert.equal(owners.get("NMI"), "NMI:1-8");
  assert.equal(owners.get("Attention/Queue"), "STAGE-PROD Queue");
  assert.equal(owners.get("DIR:1"), "DIR:1");
  assert.equal(owners.get("Stage"), "NEX-MVP/STAGE-PROD");
  assert.equal(owners.get("Advisor"), "CC:5/NCA/NXA/ECA/MO");
  assert.equal(owners.get("Decision/Execution"), "CC:10/CC:11");
  assert.ok(
    Object.values(SCENE_ORG_DUPLICATE_AUTHORITY_GUARD).every(
      (createsDuplicate) => createsDuplicate === false,
    ),
  );
});

test("ORG:2 production shell exposes the four seams without replacing existing hosts", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  for (const region of SCENE_ORG_REGION_IDS) {
    assert.match(html, new RegExp(`data-scene-org-region="${region}"`));
  }
  assert.match(html, /data-scene-org-contract="NPA-T ORG:2\/SceneArchitectureExistingAuthorityIntegration"/);
  assert.match(html, /data-testid="nexora-stage-mount"/);
  assert.match(html, /data-stage-prod-live=/);
  assert.match(html, /data-testid="nexora-advisor-insight-region"/);
  assert.match(html, /data-testid="nexora-cc4-runtime-bridge"/);
  assert.match(html, /data-scene-org-reservation-only="true"/);
});

test("ORG:2 Right and Detail seams receive canonical identity, not copied business state", () => {
  const canonical = createSceneOrgCanonicalReference({
    canonicalId: "ctx-problem-capacity",
    kind: "object",
    owner: "canonical MO/Object catalog",
  });
  assert.deepEqual(Object.keys(canonical).sort(), ["canonicalId", "kind", "owner"]);
  assert.equal(Object.isFrozen(canonical), true);
  assert.throws(
    () =>
      createSceneOrgCanonicalReference({
        canonicalId: "  ",
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    /canonical identity/,
  );

  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        NexoraWorkspaceRegionBoundary,
        {
          region: "right-context",
          canonicalTargetId: canonical.canonicalId,
          referentId: canonical.canonicalId,
        },
        React.createElement("span", null, "existing Advisor host"),
      ),
      React.createElement(NexoraDetailWorkspaceBoundary, { target: canonical }),
    ),
  );
  assert.equal(
    html.match(/data-scene-org-canonical-target="ctx-problem-capacity"/g)?.length,
    2,
  );
  assert.match(html, /data-scene-org-referent="ctx-problem-capacity"/);
  assert.doesNotMatch(html, /status=|label=|evidence=|business-state=/);
});

test("ORG:2 Advisor command keeps the existing CC:5 to Stage runtime path intact", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const result = executeNexoraConversationalExperience({
    utterance: "Show scenarios",
    runtimeState: initial,
    catalog,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    previousManagerObjectSession: createEmptyManagerObjectSession(),
    messageIdSeed: "org2-advisor-stage",
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    result.nextRuntimeState,
    catalog,
  );
  assert.equal(result.nextRuntimeState.collectionContext?.category, "scenario");
  const stageObjectIds = new Set(
    presentation.scene.objects.map((object) => object.id),
  );
  for (const canonicalId of result.nextRuntimeState.collectionContext?.objectIds ?? []) {
    assert.equal(stageObjectIds.has(canonicalId), true);
  }
});

test("ORG:2 production path does not revive the dormant EXS manager-mode runtime", () => {
  const page = readFileSync(join(FRONTEND, "app/executive/page.tsx"), "utf8");
  const cockpit = readFileSync(
    join(FRONTEND, "app/executive/components/ExecutiveCockpit.tsx"),
    "utf8",
  );
  const shell = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const productionPath = `${page}\n${cockpit}\n${shell}`;
  assert.doesNotMatch(productionPath, /ExecutiveRuntimeProvider/);
  assert.doesNotMatch(productionPath, /ExecutiveModeSelector/);
  assert.doesNotMatch(productionPath, /createExecutiveRuntimeStore/);
  assert.match(productionPath, /NexoraExecutiveShell/);
  assert.match(productionPath, /executeNexoraConversationalExperience/);
  assert.match(productionPath, /hostNmiLiveManagementIntelligence/);
  assert.equal(
    sceneOrgRegionContractIdentity,
    "NPA-T ORG:2/SceneArchitectureExistingAuthorityIntegration",
  );
});
