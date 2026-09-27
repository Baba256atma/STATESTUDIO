import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraDetailWorkspaceBoundary } from "@/app/executive/nex-mvp/scene-org/NexoraWorkspaceRegionBoundary.tsx";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  SCENE_ORG_DETAIL_AUTHORITY_GUARD,
  preserveSceneOrgDetailExitContext,
  projectSceneOrgDetailWorkspace,
} from "./sceneOrgDetailWorkspaceContract.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const shellSource = readFileSync(
  join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
  "utf8",
);
const explorerSource = readFileSync(
  join(FRONTEND, "app/executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"),
  "utf8",
);

const canonicalSource = createSceneOrgCanonicalReference({
  canonicalId: "csv:overview:capacity",
  kind: "data-source",
  owner: "RDI source authority",
});

test("ORG:6 Detail Workspace opens from a canonical reference", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      NexoraDetailWorkspaceBoundary,
      { target: canonicalSource, open: true, connectionsAvailable: true },
      React.createElement("div", { "data-testid": "existing-data-explorer" }),
    ),
  );
  assert.match(html, /aria-label="Detail Workspace"/);
  assert.match(html, /data-detail-context-key="data-source:csv:overview:capacity"/);
  assert.match(html, /data-scene-org-canonical-target="csv:overview:capacity"/);
});

test("ORG:6 reuses the existing CSV and Data Explorer without duplicate ingestion", () => {
  assert.equal(
    shellSource.match(/<NexoraExecutiveDataExplorer/g)?.length,
    1,
  );
  assert.match(shellSource, /\{dataDetailContent\}/);
  assert.match(explorerSource, /<CsvRealDataImportFlow/);
  assert.doesNotMatch(shellSource, /parseCsv|createCsv|ingestCsv/);
});

test("ORG:6 keeps deep CSV content out of permanent Left, Stage, and Right", () => {
  assert.match(
    shellSource,
    /const managementExplorerKind = detailWorkspaceOpen \? null : explorerKind/,
  );
  assert.match(shellSource, /<NexoraDetailWorkspaceBoundary[\s\S]*\{dataDetailContent\}/);
  assert.doesNotMatch(shellSource, /<NexoraStageMount[\s\S]*<NexoraExecutiveDataExplorer/);
});

test("ORG:6 preserves canonical source and provenance identity", () => {
  const projection = projectSceneOrgDetailWorkspace({
    open: true,
    target: canonicalSource,
    connectionsAvailable: true,
    configurationAvailable: true,
  });
  assert.equal(projection.target, canonicalSource);
  assert.equal(projection.contextKey, "data-source:csv:overview:capacity");
  assert.match(explorerSource, /data-rdi3-source=\{source\.sourceContextId\}/);
  assert.match(explorerSource, /Evidence & provenance/);
});

test("ORG:6 existing data actions keep their current authorities", () => {
  assert.match(explorerSource, /removeCsvRealDataImport/);
  assert.match(explorerSource, /requestNexoraLiveObservation/);
  assert.match(explorerSource, /disconnectNexoraLiveConnection/);
  assert.match(explorerSource, /onImportCommitted\(committed\)/);
});

test("ORG:6 closing Detail preserves Stage, selection, and Advisor context", () => {
  const context = Object.freeze({
    stageId: "obj-capacity",
    selectedId: "obj-capacity",
    conversationId: "conversation-7",
  });
  assert.equal(preserveSceneOrgDetailExitContext(context), context);
  assert.match(shellSource, /const onExplorerClose = useCallback\(\(\) => \{\s*setActiveNav\("Home"\);\s*\}, \[\]\)/);
});

test("ORG:6 unavailable Connections or Configuration fail safely", () => {
  const projection = projectSceneOrgDetailWorkspace({
    open: true,
    target: canonicalSource,
    connectionsAvailable: false,
    configurationAvailable: false,
  });
  assert.deepEqual(projection.availableCapabilities, ["DATA"]);
  assert.deepEqual(projection.safeUnavailableCapabilities, [
    "CONNECTIONS",
    "CONFIGURATION",
  ]);
});

test("ORG:6 introduces no Data Reality, Gate, CSV, Object, or Manager authority", () => {
  assert.deepEqual(SCENE_ORG_DETAIL_AUTHORITY_GUARD, {
    reusesDataExplorer: true,
    reusesRdiDataReality: true,
    reusesGate: true,
    reusesCsvLifecycle: true,
    reusesConnectionAuthorities: true,
    createsDataReality: false,
    createsGate: false,
    createsCsvPipeline: false,
    createsObjectStore: false,
    createsManagerWorkflow: false,
    copiesBusinessState: false,
    addsAdvisorCommands: false,
  });
});
