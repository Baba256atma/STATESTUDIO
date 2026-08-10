import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_EXECUTIVE_SHELL_BOUNDARY as boundary,
  NEXORA_EXECUTIVE_SHELL_MOUNTS as mounts,
  createInitialNexoraExecutiveShellApplicationState,
  getNexoraExecutiveShellIdentity,
  getNexoraExecutiveShellWorkspaceOptions,
  nexoraExecutiveShellArchitecturalRole,
  nexoraExecutiveShellCanonicalRoute,
  nexoraExecutiveShellIdentity,
  nexoraExecutiveShellNamespace,
  nexoraExecutiveShellPhase,
  nexoraExecutiveShellReadiness,
  nexoraExecutiveShellUpstreamIdentity,
  nexoraExecutiveShellUpstreamImportPath,
  nexoraExecutiveShellVersion,
  verifyNexoraExecutiveShell,
} from "./nexoraExecutiveShell.ts";

import { nexoraMVPApplicationFoundationIdentity } from "./nexoraMVPApplicationFoundation.ts";

const source = readFileSync(
  new URL("./nexoraExecutiveShell.ts", import.meta.url),
  "utf8",
);

test("1. exact NEX-MVP:2 identity", () => {
  assert.equal(
    nexoraExecutiveShellIdentity,
    "NEX-MVP:2/NexoraExecutiveShell",
  );
  assert.equal(
    getNexoraExecutiveShellIdentity().id,
    "NEX-MVP:2/NexoraExecutiveShell",
  );
});

test("2. version / namespace / phase / role", () => {
  const identity = getNexoraExecutiveShellIdentity();
  assert.equal(nexoraExecutiveShellVersion, "1.2.0");
  assert.equal(identity.version, "1.2.0");
  assert.equal(nexoraExecutiveShellNamespace, "nexora.mvp.executive-shell");
  assert.equal(identity.namespace, "nexora.mvp.executive-shell");
  assert.equal(nexoraExecutiveShellPhase, "ExecutiveShell");
  assert.equal(identity.phase, "ExecutiveShell");
  assert.equal(
    nexoraExecutiveShellArchitecturalRole,
    "MVPExecutiveExperienceShell",
  );
  assert.equal(identity.architecturalRole, "MVPExecutiveExperienceShell");
  assert.equal(
    nexoraExecutiveShellReadiness,
    "ReadyFor3DExecutiveStage",
  );
});

test("3. immediate dependency is NEX-MVP:1 foundation", () => {
  assert.equal(
    nexoraExecutiveShellUpstreamIdentity,
    "NEX-MVP:1/NexoraMVPApplicationFoundation",
  );
  assert.equal(
    nexoraExecutiveShellUpstreamIdentity,
    nexoraMVPApplicationFoundationIdentity,
  );
  assert.equal(
    nexoraExecutiveShellUpstreamImportPath,
    "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation",
  );
  assert.equal(boundary.consumesMvpFoundationOnly, true);
  assert.equal(boundary.bypassesFoundationIntoNexCi, false);

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation",
  ]);
});

test("4. canonical route and mounts", () => {
  assert.equal(nexoraExecutiveShellCanonicalRoute, "/executive");
  assert.equal(boundary.canonicalRoute, "/executive");
  assert.equal(mounts.length, 10);
  assert.ok(mounts.includes("stage"));
  assert.ok(mounts.includes("stage-mount"));
  assert.ok(mounts.includes("workspace-dial-mount"));
  assert.ok(mounts.includes("advisor-insight"));
  assert.ok(mounts.includes("timeline-dock"));
  assert.ok(mounts.includes("floating-panel"));
});

test("5. bootstrap state from foundation", () => {
  const state = createInitialNexoraExecutiveShellApplicationState();
  assert.equal(state.workspace, "overview");
  assert.equal(state.presentationState, "minimum");
  assert.equal(state.activeSurface, "stage");
  assert.equal(state.selectedSubject, null);
  assert.equal(state.focusedSubject, null);
  assert.equal(state.environmentIntent, "neutral");
});

test("6. workspace options follow foundation order", () => {
  assert.deepEqual(
    getNexoraExecutiveShellWorkspaceOptions().map((entry) => entry.kind),
    ["overview", "problem", "scenario", "decision", "execution"],
  );
});

test("7. verification passes and no Three.js Stage claim", () => {
  const verification = verifyNexoraExecutiveShell();
  assert.equal(verification.ok, true);
  assert.equal(verification.primarySurfaceIsStage, true);
  assert.equal(verification.noThreeJsStageClaim, true);
  assert.equal(boundary.introducesThreeJsStage, false);
  assert.equal(boundary.introducesReactThreeFiber, false);
  assert.equal(boundary.introducesWorkspaceDialGeometry, false);

  const failed = verifyNexoraExecutiveShell({ forceFailure: true });
  assert.equal(failed.ok, false);
});

test("8. no private upstream architecture imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/(?!executiveCockpitIntegrationPublicIndex)[^"']*["']/,
  );
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
});
