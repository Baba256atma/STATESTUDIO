/**
 * NPA-T LIVE-STAGE-LAYOUT-FIX:1 — reserved Stage control geometry.
 * Markup contract only. Browser hit-testing is a separate gate.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveFlowContextIndicator } from "../flow/NexoraExecutiveFlowContextIndicator.tsx";
import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import { NexoraManagementLevelContextNav } from "./NexoraManagementLevelContextNav.tsx";
import { deriveNexoraMVPExecutiveFlowChain } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow.ts";
import type { NmiCanonicalRef } from "@/app/lib/nmi/nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "@/app/lib/nmi/nmiFoundation.ts";
import { composeNmiManagementLevelPath } from "@/app/lib/nmi/nmiManagementLevelPathCompose.ts";
import { composeNmiManagementMap } from "@/app/lib/nmi/nmiManagementMapCompose.ts";
import { composeNmiManagementLevelSpatial } from "@/app/lib/nmi/nmiManagementLevelSpatialCompose.ts";
import type { NmiManagementRelationship } from "@/app/lib/nmi/nmiRelationshipContract.ts";

const here = dirname(fileURLToPath(import.meta.url));

function sliceBetween(html: string, startMarker: string, endMarker: string): string {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, startMarker);
  assert.ok(end > start, endMarker);
  return html.slice(start, end);
}

test("header reserves Scenes outside the Stage canvas", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  const header = sliceBetween(
    html,
    'data-testid="executive-stage-header"',
    'data-testid="executive-stage-director"',
  );
  assert.match(header, /data-testid="nexora-saved-scene-collection"/);
  assert.doesNotMatch(header, /data-testid="nexora-3d-executive-stage"/);
  const stage = sliceBetween(
    html,
    'data-testid="nexora-3d-executive-stage"',
    'data-testid="nexora-stage-scene-region"',
  );
  assert.doesNotMatch(stage, /data-testid="nexora-saved-scene-collection"/);
});

test("process bar reserves On Stage and navigation bar reserves Scenes", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  const process = sliceBetween(
    html,
    'data-testid="nexora-flow-chain"',
    'data-testid="executive-stage-frame"',
  );
  assert.match(process, /data-stage-menu="process"/);
  assert.match(process, /id="nexora-process-on-stage-slot"/);
  assert.doesNotMatch(process, /data-testid="nexora-stage-object-list"/);
  const navigation = sliceBetween(
    html,
    'data-testid="executive-stage-header"',
    'data-testid="executive-stage-director"',
  );
  assert.match(navigation, /data-stage-menu="navigation"/);
  const scenesAt = navigation.indexOf('data-testid="nexora-saved-scene-collection"');
  const slotAt = navigation.indexOf('id="nexora-stage-navigation-slot"');
  assert.ok(scenesAt >= 0 && slotAt > scenesAt);
  assert.doesNotMatch(navigation, /data-testid="nexora-3d-executive-stage"/);
  const stageSource = readFileSync(join(here, "Nexora3DExecutiveStage.tsx"), "utf8");
  assert.match(stageSource, /createPortal\(onStageMenu, menuSlots\.onStage\)/);
  assert.match(stageSource, /createPortal\(stageNavigation, menuSlots\.navigation\)/);
  assert.doesNotMatch(stageSource, /setMenuSlots/);
  assert.doesNotMatch(stageSource, /useLayoutEffect/);
  assert.doesNotMatch(stageSource, /translateX\(-50%\)/);
});

test("On Stage list body floats and does not stretch the process bar", () => {
  const stageSource = readFileSync(join(here, "Nexora3DExecutiveStage.tsx"), "utf8");
  const detailsAt = stageSource.lastIndexOf('data-testid="nexora-stage-object-list"');
  const bodyAt = stageSource.lastIndexOf('data-testid="nexora-stage-object-list-body"');
  assert.ok(detailsAt >= 0 && bodyAt > detailsAt);
  const detailsStyle = stageSource.slice(detailsAt, bodyAt);
  const bodyStyle = stageSource.slice(bodyAt, bodyAt + 700);
  assert.doesNotMatch(detailsStyle, /flexDirection:\s*"column"/);
  assert.match(bodyStyle, /position:\s*"absolute"/);
  assert.match(bodyStyle, /right:\s*0/);
  assert.match(bodyStyle, /overflow:\s*"auto"/);
  assert.match(bodyStyle, /maxHeight:\s*"12rem"/);
  assert.match(
    stageSource,
    /details\[data-testid="nexora-stage-object-list"\]:not\(\[open\]\) > \[data-testid="nexora-stage-object-list-body"\]/,
  );
});

test("populated management navigation stays on the process bar", () => {
  const ref = (id: string, kind: NmiCanonicalRef["kind"]): NmiCanonicalRef => ({
    id,
    kind,
    authority: "BCA:1",
    sourceRef: `src:${id}`,
  });
  const rel = (relationshipId: string, fromId: string, toId: string): NmiManagementRelationship => ({
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
  });
  const model = composeNmiUnifiedManagementModel({
    modelId: "layout-fix-1",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:company", "BUSINESS_PROJECT"),
    nodes: [
      ref("org:company", "BUSINESS_PROJECT"),
      ref("proc:operations", "PROCESS"),
      ref("proc:production", "PROCESS"),
    ],
    relationships: [
      rel("rel:production-operations", "proc:production", "proc:operations"),
      rel("rel:operations-company", "proc:operations", "org:company"),
    ],
  });
  const map = composeNmiManagementMap({
    mapId: "layout-fix-1-map",
    model,
    annotations: [
      { id: "org:company", title: "Company" },
      { id: "proc:operations", title: "Operations" },
      { id: "proc:production", title: "Production" },
    ],
  });
  const composition = composeNmiManagementLevelSpatial({
    path: composeNmiManagementLevelPath({
      selectedCanonicalId: "proc:production",
      map,
    }),
  });
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveFlowContextIndicator, {
      chain: deriveNexoraMVPExecutiveFlowChain({ focusedSubjectId: null }),
      context: React.createElement(NexoraManagementLevelContextNav, {
        composition,
        selectedCanonicalId: "proc:production",
        onSelectSubject: () => undefined,
      }),
    }),
  );
  const navAt = html.indexOf('data-testid="nexora-management-level-slot-parent"');
  const slotAt = html.indexOf('id="nexora-process-on-stage-slot"');
  assert.ok(navAt >= 0 && slotAt > navAt);
  assert.match(html, /data-stage-menu="process"/);
  assert.match(html, /flex-wrap:\s*wrap/);
  assert.doesNotMatch(html, /data-testid="nexora-saved-scene-collection"/);
});
