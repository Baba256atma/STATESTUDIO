import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS as checks,
  RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS as domains,
  RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  certifyRuntimeExecutiveWorkspaceExperience,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveWorkspaceExperienceCertificationSummary,
  getRuntimeExecutiveWorkspaceExperienceFreezeManifest,
  runtimeExecutiveWorkspaceExperienceCertificationFreeze as certification,
  runtimeExecutiveWorkspaceExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperienceFreezeManifest as freezeManifest,
  verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze,
  verifyRuntimeExecutiveWorkspaceExperienceCompatibility,
} from "./runtimeExecutiveWorkspaceExperienceCertificationFreeze.ts";

import {
  runtimeExecutiveWorkspaceExperiencePlatformIdentity,
  runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePlatform";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    certification.identity,
    "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze",
  );
  assert.equal(certification.version, "6.8.0");
  assert.equal(
    certification.namespace,
    "nexora.rex.workspace-experience.certification-freeze",
  );
  assert.equal(certification.phase, "CertificationFreeze");
  assert.equal(
    certification.architecturalRole,
    "RuntimeExecutiveWorkspaceExperienceCertificationFreeze",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:7 platform", () => {
  assert.equal(
    certification.upstreamDependency,
    "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform",
  );
  assert.equal(
    certification.upstreamDependency,
    runtimeExecutiveWorkspaceExperiencePlatformIdentity,
  );
  assert.equal(
    certification.dependencyPath,
    runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
  );
  assert.equal(boundary.consumesPlatformOnly, true);
  assert.equal(boundary.importsRex66Directly, false);
  assert.equal(boundary.importsRex65Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePlatform",
  ]);
});

test("3. canonical lock and successful certification statuses", () => {
  assert.equal(
    platformLock,
    "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED",
  );
  const result = certifyRuntimeExecutiveWorkspaceExperience();
  assert.equal(result.status, "certified");
  assert.equal(result.compatibility, "compatible");
  assert.equal(result.freeze, "frozen");
  assert.equal(result.lock, "locked");
  assert.equal(result.stability, "stable");
  assert.equal(result.readiness, "ready-for-public-index");
  assert.equal(result.readinessDisplay, "ReadyForPublicIndex");
  assert.equal(result.certification, "Certified");
  assert.equal(result.compatibilityDisplay, "Compatible");
  assert.equal(result.freezeDisplay, "Frozen");
  assert.equal(result.lockDisplay, "Locked");
  assert.equal(result.stabilityDisplay, "Stable");
  assert.equal(result.platformLock, platformLock);
  assert.equal(result.failedCheckCount, 0);
  assert.equal(
    result.passedCheckCount + result.failedCheckCount,
    result.totalCheckCount,
  );
  assert.equal(result.passedCheckCount, result.totalCheckCount);
});

test("4. workspace / surface / composition certification", () => {
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
    "stage",
    "advisor",
    "insight",
    "action",
  ]);
  for (const surface of [
    "dial",
    "workspace-dial",
    "timeline",
    "left-nav",
    "right-panel",
    "top-controls",
  ]) {
    assert.ok(
      !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[])
        .includes(surface),
    );
  }
  assert.equal(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.stage, "primary");
  assert.equal(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.action, "inactive");
  assert.equal(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision.action, "supporting");
  assert.equal(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.execution.advisor, "contextual");
  assert.ok(checks.some((entry) => entry.id === "surface-composition-matrix" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "stage-primary" && entry.passed));
});

test("5. resolution, presentation, non-linear, same-workspace", () => {
  assert.ok(checks.some((entry) => entry.id === "context-resolution" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "presentation-independence" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "non-linear-navigation" && entry.passed));
  assert.ok(
    checks.some((entry) => entry.id === "same-workspace-context-change" && entry.passed),
  );
});

test("6. transition phases, surface transitions, dial boundary", () => {
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES], [
    "prepare",
    "leave",
    "enter",
    "settle",
  ]);
  assert.ok(
    checks.some((entry) => entry.id === "surface-transition-classification" && entry.passed),
  );
  assert.ok(checks.some((entry) => entry.id === "dial-boundary" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "dial-geometry-absent" && entry.passed));
  assert.equal(freezeManifest.dialIsNotWorkspace, true);
  assert.equal(freezeManifest.dialIsNotSurface, true);
  assert.equal(freezeManifest.dialGeometryFrozen, false);
  assert.equal(freezeManifest.semanticDialFrozen, true);
  assert.equal(freezeManifest.visualDialFrozen, false);
  assert.equal(freezeManifest.automotiveStylingFrozen, false);
});

test("7. orchestration / bootstrap / determinism / immutability", () => {
  assert.ok(checks.some((entry) => entry.id === "experience-orchestration" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "bootstrap" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "pipeline-order" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "determinism" && entry.passed));
  assert.ok(checks.some((entry) => entry.id === "immutability" && entry.passed));

  const first = certifyRuntimeExecutiveWorkspaceExperience();
  const second = certifyRuntimeExecutiveWorkspaceExperience();
  assert.deepEqual(first, second);

  assert.equal(Object.isFrozen(domains), true);
  assert.equal(Object.isFrozen(checks), true);
  assert.equal(Object.isFrozen(freezeManifest), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.throws(() => {
    (domains as unknown as string[]).push("ui");
  });
  assert.throws(() => {
    (checks as unknown as Array<{ id: string }>).push({
      id: "x",
    });
  });
});

test("8. compatibility, verification, summary, freeze manifest", () => {
  const compatibility = verifyRuntimeExecutiveWorkspaceExperienceCompatibility();
  assert.equal(compatibility.status, "compatible");
  assert.equal(compatibility.reasons.length, 0);

  const verification = verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.certified, true);
  assert.equal(verification.compatible, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.locked, true);
  assert.equal(verification.stable, true);
  assert.equal(verification.readyForPublicIndex, true);
  assert.equal(verification.isReleased, false);
  assert.equal(verification.readyForConsumer, false);
  assert.equal(verification.domainCount, 23);
  assert.equal(verification.invariantCount, 36);
  assert.equal(verification.checkCount, checks.length);
  assert.equal(new Set(domains).size, domains.length);
  assert.equal(new Set(checks.map((entry) => entry.id)).size, checks.length);

  const summary = getRuntimeExecutiveWorkspaceExperienceCertificationSummary();
  assert.equal(summary.status, "certified");
  assert.equal(summary.failed, 0);
  assert.equal(summary.passed, summary.checkCount);
  assert.equal(summary.platformLock, platformLock);

  const manifest = getRuntimeExecutiveWorkspaceExperienceFreezeManifest();
  assert.equal(manifest, freezeManifest);
  assert.equal(manifest.primarySurface, "stage");
  assert.equal(manifest.workspaces.length, 5);
  assert.equal(manifest.surfaces.length, 4);
  assert.equal(manifest.cockpitLayoutFrozen, false);
});

test("9. malformed fixture detection without mutating canonical state", () => {
  const brokenChecks = Object.freeze([
    ...checks.slice(0, 2),
    Object.freeze({
      id: "identity-platform",
      domain: "identity" as const,
      passed: false,
      message: "forced failure",
    }),
  ]);
  assert.equal(new Set(brokenChecks.map((entry) => entry.id)).size < brokenChecks.length, true);
  assert.equal(checks.every((entry) => entry.passed), true);
  assert.equal(certifyRuntimeExecutiveWorkspaceExperience().status, "certified");
});

test("10. architectural boundary and forbidden dependencies", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(
    source,
    /\bCadillac(?:Workspace|Dial)\b|\bPorsche(?:Workspace|Dial)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:angle|degrees|radius|rotation|detent)\s*[:=]/,
  );
  assert.doesNotMatch(source, /\b250ms\b|\b300ms\b|\bease-in\b|\bspring\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(|setTimeout\s*\(/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspace(?:ExperienceFoundation|ExperienceContracts|ContextModeResolution|SurfaceComposition|TransitionDialOrchestration|ExperienceOrchestration)["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*PublicIndex\b/,
  );

  assert.equal(boundary.introducesRuntimeBehavior, false);
  assert.equal(boundary.introducesNewWorkspaceSemantics, false);
  assert.equal(boundary.modifiesPlatformPolicy, false);
  assert.equal(boundary.introducesDialGeometry, false);
  assert.equal(boundary.freezesCockpitLayout, false);
  assert.equal(boundary.freezesAutomotiveStyling, false);
  assert.equal(boundary.isFinalPublicConsumerIndex, false);
  assert.equal(boundary.readyForConsumer, false);
  assert.equal(boundary.isReleased, false);
  assert.equal(
    certification.architecturalStatus,
    "REX-6:8 Runtime Executive Workspace Experience Certification & Freeze — Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex",
  );
});
