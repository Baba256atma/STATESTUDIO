import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_MVP_APPLICATION_FOUNDATION_BOUNDARY as boundary,
  NEXORA_MVP_CAPABILITIES as capabilities,
  NEXORA_MVP_CAPABILITY_REGISTRY as capabilityRegistry,
  NEXORA_MVP_PRESENTATION_STATES as presentationStates,
  NEXORA_MVP_PRIMARY_SURFACE as primarySurface,
  NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS as environmentIntents,
  NEXORA_MVP_SURFACE_REGISTRY as surfaceRegistry,
  NEXORA_MVP_SURFACE_ROLE_MAP as surfaceRoleMap,
  NEXORA_MVP_SURFACES as surfaces,
  NEXORA_MVP_WORKSPACE_ENVIRONMENT_MAP as workspaceEnvironmentMap,
  NEXORA_MVP_WORKSPACE_ORDER as workspaceOrder,
  NEXORA_MVP_WORKSPACE_REGISTRY as workspaceRegistry,
  createNexoraMVPApplication,
  getInitialNexoraMVPApplicationSnapshot,
  getNexoraMVPApplicationIdentity,
  getNexoraMVPCapabilityRegistry,
  getNexoraMVPPresentationStates,
  getNexoraMVPPrimarySurface,
  getNexoraMVPSceneEnvironmentIntent,
  getNexoraMVPSurfaceRegistry,
  getNexoraMVPWorkspaceOrder,
  getNexoraMVPWorkspaceRegistry,
  nexoraMVPApplicationFoundationArchitecturalRole,
  nexoraMVPApplicationFoundationIdentity,
  nexoraMVPApplicationFoundationNamespace,
  nexoraMVPApplicationFoundationPhase,
  nexoraMVPApplicationFoundationReadiness,
  nexoraMVPApplicationFoundationUpstreamIdentity,
  nexoraMVPApplicationFoundationUpstreamImportPath,
  nexoraMVPApplicationFoundationVersion,
  validateNexoraMVPApplicationFoundation,
} from "./nexoraMVPApplicationFoundation.ts";

import {
  validateNexoraMVPApplicationFoundationWithUpstream,
  verifyNexoraMVPUpstreamIntegration,
} from "./nexoraMVPUpstreamIntegration.ts";

import {
  executiveCockpitIntegrationPublicIndexIdentity,
  executiveCockpitIntegrationPublicIndexSupportedImportPath,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex";

const source = readFileSync(
  new URL("./nexoraMVPApplicationFoundation.ts", import.meta.url),
  "utf8",
);

test("1. exact NEX-MVP:1 identity", () => {
  const identity = getNexoraMVPApplicationIdentity();
  assert.equal(
    nexoraMVPApplicationFoundationIdentity,
    "NEX-MVP:1/NexoraMVPApplicationFoundation",
  );
  assert.equal(identity.id, "NEX-MVP:1/NexoraMVPApplicationFoundation");
  assert.equal(
    identity.id,
    "NEX-MVP:1/NexoraMVPApplicationFoundation",
  );
});

test("2. version", () => {
  assert.equal(nexoraMVPApplicationFoundationVersion, "1.1.0");
  assert.equal(getNexoraMVPApplicationIdentity().version, "1.1.0");
});

test("3. namespace", () => {
  assert.equal(
    nexoraMVPApplicationFoundationNamespace,
    "nexora.mvp.application.foundation",
  );
  assert.equal(
    getNexoraMVPApplicationIdentity().namespace,
    "nexora.mvp.application.foundation",
  );
});

test("4. architectural role and phase", () => {
  assert.equal(
    nexoraMVPApplicationFoundationArchitecturalRole,
    "MVPApplicationCompositionRoot",
  );
  assert.equal(
    getNexoraMVPApplicationIdentity().architecturalRole,
    "MVPApplicationCompositionRoot",
  );
  assert.equal(
    nexoraMVPApplicationFoundationPhase,
    "ApplicationFoundation",
  );
  assert.equal(
    getNexoraMVPApplicationIdentity().phase,
    "ApplicationFoundation",
  );
  assert.equal(
    nexoraMVPApplicationFoundationReadiness,
    "ReadyForExecutiveShell",
  );
});

test("5. upstream NEX-CI dependency verification", () => {
  assert.equal(
    nexoraMVPApplicationFoundationUpstreamIdentity,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );
  assert.equal(
    nexoraMVPApplicationFoundationUpstreamIdentity,
    executiveCockpitIntegrationPublicIndexIdentity,
  );
  assert.equal(
    nexoraMVPApplicationFoundationUpstreamImportPath,
    "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex",
  );
  assert.equal(
    nexoraMVPApplicationFoundationUpstreamImportPath,
    executiveCockpitIntegrationPublicIndexSupportedImportPath,
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );
  assert.equal(boundary.consumesNexCiPublicIndexOnly, true);

  const verification = verifyNexoraMVPUpstreamIntegration();
  assert.equal(verification.ok, true);
  assert.equal(verification.identityValid, true);
  assert.equal(verification.importPathValid, true);
  assert.equal(verification.releaseStatusValid, true);
  assert.equal(verification.certificationStatusValid, true);
  assert.equal(verification.compatibilityStatusValid, true);
  assert.equal(verification.freezeStatusValid, true);
  assert.equal(verification.consumerReadinessValid, true);
  assert.equal(verification.stageSurfaceAvailable, true);
  assert.equal(verification.publicIndexOk, true);
  assert.equal(verification.releaseStatus, "released");
  assert.equal(verification.certificationStatus, "certified");
  assert.equal(verification.compatibilityStatus, "compatible");
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.consumerReadiness, "ready-for-consumer");

  const failed = verifyNexoraMVPUpstreamIntegration({ forceFailure: true });
  assert.equal(failed.ok, false);
});

test("6. surface registry uniqueness", () => {
  assert.deepEqual([...surfaces], [
    "shell",
    "context",
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "status",
    "floating-panel",
  ]);
  assert.equal(surfaces.length, 9);
  assert.equal(new Set(surfaces).size, 9);
  assert.equal(surfaceRegistry.length, 9);
  assert.deepEqual(
    surfaceRegistry.map((entry) => entry.id),
    [...surfaces],
  );
  assert.deepEqual(
    getNexoraMVPSurfaceRegistry().map((entry) => entry.id),
    [...surfaces],
  );
});

test("7. Stage is the primary surface", () => {
  assert.equal(primarySurface, "stage");
  assert.equal(getNexoraMVPPrimarySurface(), "stage");
  assert.equal(surfaceRoleMap.stage, "primary");
  const primaries = surfaceRegistry.filter((entry) => entry.role === "primary");
  assert.equal(primaries.length, 1);
  assert.equal(primaries[0]?.id, "stage");
  assert.equal(surfaceRoleMap.advisor, "supporting");
  assert.equal(surfaceRoleMap.insight, "supporting");
  assert.equal(surfaceRoleMap.timeline, "supporting");
  assert.equal(surfaceRoleMap.context, "navigation");
  assert.equal(surfaceRoleMap.explorer, "navigation");
  assert.equal(surfaceRoleMap["floating-panel"], "overlay");
  assert.equal(surfaceRoleMap.status, "system");
  assert.equal(surfaceRoleMap.shell, "system");
});

test("8. workspace registry completeness", () => {
  assert.equal(workspaceRegistry.length, 5);
  assert.deepEqual(
    workspaceRegistry.map((entry) => entry.kind),
    ["overview", "problem", "scenario", "decision", "execution"],
  );
  for (const [index, entry] of workspaceRegistry.entries()) {
    assert.equal(entry.order, index);
    assert.equal(entry.id, `workspace.${entry.kind}`);
    assert.equal(entry.workspace.kind, entry.kind);
    assert.ok(typeof entry.label === "string" && entry.label.length > 0);
    assert.ok(typeof entry.role === "string" && entry.role.length > 0);
  }
  assert.deepEqual(
    getNexoraMVPWorkspaceRegistry().map((entry) => entry.kind),
    [...workspaceOrder],
  );
});

test("9. deterministic workspace ordering", () => {
  assert.deepEqual([...workspaceOrder], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.deepEqual([...getNexoraMVPWorkspaceOrder()], [...workspaceOrder]);
  assert.deepEqual(
    getNexoraMVPWorkspaceRegistry().map((entry) => entry.order),
    [0, 1, 2, 3, 4],
  );
});

test("10. presentation states include Minimum / Report / Operation", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.deepEqual([...getNexoraMVPPresentationStates()], [
    "minimum",
    "report",
    "operation",
  ]);
});

test("11. workspace/environment mapping completeness", () => {
  assert.deepEqual([...environmentIntents], [
    "neutral",
    "investigate",
    "simulate",
    "commit",
    "execute",
  ]);
  assert.equal(workspaceEnvironmentMap.overview, "neutral");
  assert.equal(workspaceEnvironmentMap.problem, "investigate");
  assert.equal(workspaceEnvironmentMap.scenario, "simulate");
  assert.equal(workspaceEnvironmentMap.decision, "commit");
  assert.equal(workspaceEnvironmentMap.execution, "execute");
  for (const kind of workspaceOrder) {
    assert.equal(
      getNexoraMVPSceneEnvironmentIntent(kind),
      workspaceEnvironmentMap[kind],
    );
  }
});

test("12. canonical bootstrap state", () => {
  const app = createNexoraMVPApplication();
  assert.equal(app.snapshot.workspace.kind, "overview");
  assert.equal(app.snapshot.presentationState, "minimum");
  assert.equal(app.snapshot.activeSurface, "stage");
  assert.equal(app.snapshot.environmentIntent, "neutral");
  assert.equal(
    app.identity.id,
    "NEX-MVP:1/NexoraMVPApplicationFoundation",
  );
  assert.equal(
    app.upstreamIdentity,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );

  const initial = getInitialNexoraMVPApplicationSnapshot();
  assert.equal(initial.workspace.kind, "overview");
  assert.equal(initial.presentationState, "minimum");
  assert.equal(initial.activeSurface, "stage");
  assert.equal(initial.environmentIntent, "neutral");
});

test("13. empty initial selection and focus", () => {
  const snapshot = createNexoraMVPApplication().snapshot;
  assert.equal(snapshot.selectedSubject, null);
  assert.equal(snapshot.focusedSubject, null);
});

test("14. capability registry consistency", () => {
  assert.deepEqual([...capabilities], [
    "executive-shell",
    "stage",
    "workspace",
    "presentation-state",
    "selection",
    "focus",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "scene-environment",
  ]);
  assert.equal(capabilityRegistry.length, capabilities.length);
  assert.equal(new Set(capabilityRegistry.map((e) => e.id)).size, 11);
  assert.deepEqual(
    getNexoraMVPCapabilityRegistry().map((entry) => entry.id),
    [...capabilities],
  );

  const byId = Object.fromEntries(
    capabilityRegistry.map((entry) => [entry.id, entry.readiness]),
  );
  assert.equal(byId["workspace"], "available");
  assert.equal(byId["presentation-state"], "available");
  assert.equal(byId["selection"], "available");
  assert.equal(byId["focus"], "available");
  assert.equal(byId["scene-environment"], "available");
  assert.equal(byId["executive-shell"], "prepared");
  assert.equal(byId["stage"], "prepared");
  assert.equal(byId["advisor"], "prepared");
  assert.equal(byId["insight"], "prepared");
  assert.equal(byId["timeline"], "prepared");
  assert.equal(byId["explorer"], "prepared");
  assert.ok(
    Object.values(byId).every(
      (readiness) => readiness === "available" || readiness === "prepared",
    ),
  );
});

test("15. deterministic repeated bootstrap", () => {
  const a = createNexoraMVPApplication();
  const b = createNexoraMVPApplication();
  assert.deepEqual(a.snapshot, b.snapshot);
  assert.deepEqual(a.identity, b.identity);
  assert.equal(a.upstreamIdentity, b.upstreamIdentity);
  assert.deepEqual(
    a.workspaces.map((entry) => entry.kind),
    b.workspaces.map((entry) => entry.kind),
  );
  assert.equal(JSON.stringify(a.snapshot), JSON.stringify(b.snapshot));
});

test("16. validation success for canonical configuration", () => {
  const validation = validateNexoraMVPApplicationFoundation();
  assert.equal(validation.ok, true);
  assert.equal(validation.identityValid, true);
  assert.equal(validation.surfacesUnique, true);
  assert.equal(validation.exactlyOnePrimaryStage, true);
  assert.equal(validation.workspaceOrderValid, true);
  assert.equal(validation.presentationStatesValid, true);
  assert.equal(validation.environmentMappingComplete, true);
  assert.equal(validation.initialSnapshotValid, true);
  assert.equal(validation.capabilitiesUnique, true);
  assert.equal(validation.bootstrapDeterministic, true);

  const complete = validateNexoraMVPApplicationFoundationWithUpstream();
  assert.equal(complete.ok, true);
  assert.equal(complete.upstreamIntegrationValid, true);

  const failed = validateNexoraMVPApplicationFoundation({
    forceFailure: true,
  });
  assert.equal(failed.ok, false);
});

test("17. architectural purity — no React / Three.js / R3F / browser", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /@react-three\/drei/);
  assert.doesNotMatch(source, /\bfrom\s+["']next(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /\btypeof\s+window\b/);
  assert.doesNotMatch(source, /\btypeof\s+document\b/);
  assert.doesNotMatch(source, /\bglobalThis\.(?:window|document)\b/);
  assert.doesNotMatch(source, /\bHTMLElement\b/);
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesReactThreeFiber, false);
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.ownsRendering, false);
  assert.equal(boundary.ownsReactState, false);
  assert.equal(boundary.introducesUiComponents, false);
});

test("18. UI-safe foundation has no runtime upstream imports", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, []);

  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci(?:\/[^"']*)?["']/,
  );
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
  assert.doesNotMatch(source, /from\s+["']node:fs["']/);
  assert.equal(boundary.bypassesNexCiIntoRex, false);
  assert.equal(boundary.bypassesRexIntoExDri, false);
  assert.equal(boundary.bypassesExDriIntoDri, false);
  assert.equal(boundary.bypassesDriIntoNol, false);
  assert.equal(boundary.implementsLaterNexMvpPhases, false);
  assert.equal(
    boundary.soleImmediateDependency,
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex",
  );
});

test("19. identity getter is immutable and deterministic", () => {
  const a = getNexoraMVPApplicationIdentity();
  const b = getNexoraMVPApplicationIdentity();
  assert.equal(a, b);
  assert.ok(Object.isFrozen(a));
  assert.throws(() => {
    // @ts-expect-error — identity must remain immutable
    a.version = "mutated";
  });
});
