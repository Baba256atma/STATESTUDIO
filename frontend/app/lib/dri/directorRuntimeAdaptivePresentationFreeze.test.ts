import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as platformSurface from "./directorRuntimeAdaptivePresentationPlatform.ts";
import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS as checks,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS as domains,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUSES as compatibilityStatuses,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES as freezeGuarantees,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST as manifest,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUSES as freezeStatuses,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS as frozenExports,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK as lock,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUSES as readinessStatuses,
  certifyDirectorRuntimeAdaptivePresentationPlatform,
  createDirectorRuntimePresentationIntent,
  directorRuntimeAdaptivePresentationFreeze as freeze,
  directorRuntimeAdaptivePresentationFreezeCanonicalIdentity as canonicalIdentity,
  directorRuntimeAdaptivePresentationFreezeRegistry as registry,
  orchestrateDirectorRuntimeAdaptivePresentation,
  resolveDirectorRuntimeAdaptivePresentationFreezeOutcome,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  summarizeDirectorRuntimeAdaptivePresentationCertification,
  validateDirectorRuntimePresentationIntent,
  verifyDirectorRuntimeAdaptivePresentationFreeze,
  verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility,
} from "./directorRuntimeAdaptivePresentationFreeze.ts";

const source = readFileSync(
  new URL("./directorRuntimeAdaptivePresentationFreeze.ts", import.meta.url),
  "utf8",
);

test("1. publishes exact DRI-5:8 identity, version, and namespace", () => {
  assert.deepEqual({
    identity: freeze.identity,
    version: freeze.version,
    namespace: freeze.namespace,
  }, {
    identity: "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze",
    version: "5.8.0",
    namespace: "nexora.dri.adaptive-presentation.freeze",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze",
    version: "5.8.0",
    namespace: "nexora.dri.adaptive-presentation.freeze",
    dependency: "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
  });
  assert.equal(freeze.phase, "DRI-5:8");
  assert.equal(Object.isFrozen(freeze), true);
});

test("2. sole immediate dependency is DRI-5:7 Platform", () => {
  assert.equal(
    freeze.dependency,
    "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
  );
  assert.equal(registry.dependency, freeze.dependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAdaptivePresentationPlatform"],
  );
  const importBlock = imports.join("\n");
  assert.doesNotMatch(
    importBlock,
    /Orchestration|DensityPolicy|EmphasisPolicy|StateResolver|PresentationIntent|PresentationFoundation/,
  );
});

test("3. exactly twelve certification domains in canonical order", () => {
  assert.deepEqual([...domains], [
    "identity",
    "dependency",
    "capabilities",
    "semantics",
    "determinism",
    "immutability",
    "compatibility",
    "renderer-independence",
    "framework-independence",
    "side-effect-freedom",
    "platform-boundary",
    "public-index-readiness",
  ]);
  assert.equal(Object.isFrozen(domains), true);
});

test("4. exactly 38 certification checks with unique IDs and valid domains", () => {
  assert.equal(checks.length, 38);
  assert.equal(new Set(checks.map((entry) => entry.id)).size, 38);
  for (const check of checks) {
    assert.match(check.id, /^dri-5:8\/[a-z0-9-]+\/[a-z0-9-]+$/);
    assert.ok((domains as readonly string[]).includes(check.domain));
    assert.equal(Object.isFrozen(check), true);
  }
  assert.equal(Object.isFrozen(checks), true);
});

test("5. canonical platform certification succeeds with 38/0", () => {
  const certification = certifyDirectorRuntimeAdaptivePresentationPlatform();
  assert.equal(certification.status, "certified");
  assert.equal(certification.totalChecks, 38);
  assert.equal(certification.passedChecks, 38);
  assert.equal(certification.failedChecks, 0);
  assert.equal(Object.isFrozen(certification), true);
  assert.deepEqual(
    certifyDirectorRuntimeAdaptivePresentationPlatform(),
    certification,
  );

  const summary = summarizeDirectorRuntimeAdaptivePresentationCertification(
    certification,
  );
  assert.equal(summary.length, 12);
  assert.deepEqual(
    summary.map((entry) => entry.domain),
    [...domains],
  );
  for (const entry of summary) {
    assert.equal(entry.status, "certified");
    assert.equal(entry.failedCount, 0);
  }
});

test("6. malformed fixture yields failed certification", () => {
  const failed = certifyDirectorRuntimeAdaptivePresentationPlatform({
    identity: "DRI-5:7/WrongPlatform",
    version: "0.0.0",
    namespace: "wrong.namespace",
  });
  assert.equal(failed.status, "failed");
  assert.ok(failed.failedChecks > 0);
  assert.ok(failed.passedChecks < 38);
  assert.ok(
    failed.checks.some((entry) =>
      entry.checkId === "dri-5:8/identity/exact-identity" && entry.passed === false
    ),
  );
});

test("7. compatibility is compatible for canonical platform", () => {
  assert.deepEqual([...compatibilityStatuses], ["compatible", "incompatible"]);
  const compatibility = verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility();
  assert.equal(compatibility.status, "compatible");
  assert.equal(
    compatibility.expectedPlatformIdentity,
    "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform",
  );
  assert.deepEqual(
    verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility(),
    compatibility,
  );
  assert.equal(Object.isFrozen(compatibility), true);

  const incompatible = verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility({
    identity: "DRI-5:7/Wrong",
    dependency: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
  });
  assert.equal(incompatible.status, "incompatible");
});

test("8. freeze status is frozen only when certification passes", () => {
  assert.deepEqual([...freezeStatuses], ["frozen", "unfrozen"]);
  const success = resolveDirectorRuntimeAdaptivePresentationFreezeOutcome();
  assert.equal(success.freezeStatus, "frozen");
  assert.equal(freeze.freezeStatus, "frozen");

  const failedCert = certifyDirectorRuntimeAdaptivePresentationPlatform({
    identity: "bad",
  });
  const failedOutcome = resolveDirectorRuntimeAdaptivePresentationFreezeOutcome(
    failedCert,
    verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility({ identity: "bad" }),
  );
  assert.equal(failedOutcome.freezeStatus, "unfrozen");
  assert.equal(failedOutcome.readiness, "not-ready-for-public-index");
});

test("9. lock is exact and immutable", () => {
  assert.deepEqual(lock, {
    lock: "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED",
    locked: true,
  });
  assert.equal(Object.isFrozen(lock), true);
  assert.throws(() => {
    (lock as { locked?: boolean }).locked = false;
  });
});

test("10. readiness is ready-for-public-index without consumer release claims", () => {
  assert.deepEqual([...readinessStatuses], [
    "ready-for-public-index",
    "not-ready-for-public-index",
  ]);
  assert.equal(freeze.readiness, "ready-for-public-index");
  assert.equal(freeze.released, false);
  assert.equal(freeze.readyForConsumer, false);
  assert.equal(freeze.soleConsumerEntryPoint, false);
  assert.equal(freeze.publicIndex, false);
  assert.equal(source.includes("Ready" + "ForConsumer"), false);
  assert.equal(source.includes("Sole" + "ConsumerEntryPoint"), false);
  assert.doesNotMatch(freeze.readiness, /consumer|released/i);
  assert.doesNotMatch(freeze.architecturalStatus, /ReadyForConsumer/);
});

test("11. frozen export surface is non-empty, unique, ordered, immutable", () => {
  assert.ok(frozenExports.length > 0);
  const names = frozenExports.map((entry) => entry.name);
  assert.equal(new Set(names).size, names.length);
  assert.deepEqual(
    names,
    [...names].sort((left, right) => {
      const leftIndex = names.indexOf(left);
      const rightIndex = names.indexOf(right);
      return leftIndex - rightIndex;
    }),
  );
  for (const entry of frozenExports) {
    assert.equal(typeof entry.name, "string");
    assert.equal(typeof entry.category, "string");
    assert.equal(Object.isFrozen(entry), true);
    assert.doesNotMatch(entry.name, /test|private|adapter|react|three|css|camera/i);
  }
  assert.equal(Object.isFrozen(frozenExports), true);
  assert.ok(names.includes("orchestrateDirectorRuntimeAdaptivePresentation"));
  assert.ok(names.includes("createDirectorRuntimePresentationIntent"));
  assert.ok(names.includes("directorRuntimeAdaptivePresentationPlatform"));
});

test("12. approved frozen APIs preserve DRI-5:7 platform references", () => {
  assert.equal(
    createDirectorRuntimePresentationIntent,
    platformSurface.createDirectorRuntimePresentationIntent,
  );
  assert.equal(
    validateDirectorRuntimePresentationIntent,
    platformSurface.validateDirectorRuntimePresentationIntent,
  );
  assert.equal(
    resolveDirectorRuntimePresentationState,
    platformSurface.resolveDirectorRuntimePresentationState,
  );
  assert.equal(
    resolveDirectorRuntimeAttentionEmphasisPolicy,
    platformSurface.resolveDirectorRuntimeAttentionEmphasisPolicy,
  );
  assert.equal(
    resolveDirectorRuntimeInformationDensity,
    platformSurface.resolveDirectorRuntimeInformationDensity,
  );
  assert.equal(
    orchestrateDirectorRuntimeAdaptivePresentation,
    platformSurface.orchestrateDirectorRuntimeAdaptivePresentation,
  );
  assert.equal(
    orchestrateDirectorRuntimeAdaptivePresentation,
    platformSurface.directorRuntimeAdaptivePresentationPlatform.orchestrate,
  );
});

test("13. freeze manifest contains required fields", () => {
  assert.equal(manifest.identity, freeze.identity);
  assert.equal(manifest.version, "5.8.0");
  assert.equal(manifest.namespace, freeze.namespace);
  assert.equal(manifest.dependency, freeze.dependency);
  assert.equal(manifest.certificationStatus, "certified");
  assert.equal(manifest.freezeStatus, "frozen");
  assert.equal(manifest.compatibilityStatus, "compatible");
  assert.equal(manifest.lock, lock);
  assert.equal(manifest.readiness, "ready-for-public-index");
  assert.equal(manifest.certificationDomainCount, 12);
  assert.equal(manifest.certificationCheckCount, 38);
  assert.equal(manifest.frozenExportCount, frozenExports.length);
  assert.deepEqual([...manifest.guarantees], [...freezeGuarantees]);
  assert.deepEqual([...manifest.invariants], [...invariants]);
  assert.equal(Object.isFrozen(manifest), true);
});

test("14. freeze verification returns ok with expected counts", () => {
  const verification = verifyDirectorRuntimeAdaptivePresentationFreeze();
  assert.equal(verification.ok, true);
  assert.equal(verification.certificationDomainCount, 12);
  assert.equal(verification.certificationCheckCount, 38);
  assert.equal(verification.passedCheckCount, 38);
  assert.equal(verification.failedCheckCount, 0);
  assert.equal(verification.frozenExportCount, frozenExports.length);
  assert.equal(verification.freezeGuaranteeCount, 12);
  assert.equal(verification.invariantCount, 38);
  assert.equal(verification.freezeStatus, "frozen");
  assert.equal(verification.compatibilityStatus, "compatible");
  assert.equal(verification.readiness, "ready-for-public-index");
  assert.equal(verification.locked, true);
  assert.equal(verification.publicIndex, false);
  assert.deepEqual(
    verifyDirectorRuntimeAdaptivePresentationFreeze(),
    verification,
  );
  assert.equal(Object.isFrozen(verification), true);
});

test("15. practical runtime immutability", () => {
  const certification = certifyDirectorRuntimeAdaptivePresentationPlatform();
  const compatibility = verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility();
  const verification = verifyDirectorRuntimeAdaptivePresentationFreeze();
  assert.equal(Object.isFrozen(domains), true);
  assert.equal(Object.isFrozen(checks), true);
  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(compatibility), true);
  assert.equal(Object.isFrozen(lock), true);
  assert.equal(Object.isFrozen(frozenExports), true);
  assert.equal(Object.isFrozen(freezeGuarantees), true);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(verification), true);
  assert.equal(Object.isFrozen(invariants), true);
});

test("16. renderer and framework independence", () => {
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  const importBlock = imports.join("\n");
  assert.doesNotMatch(importBlock, /^react$/m);
  assert.doesNotMatch(importBlock, /react-dom/);
  assert.doesNotMatch(importBlock, /^next\//m);
  assert.doesNotMatch(importBlock, /^three$/m);
  assert.equal(importBlock.includes("@react-" + "three"), false);
  assert.equal(importBlock.includes("framer-" + "motion"), false);
  assert.doesNotMatch(importBlock, /components/);
  assert.doesNotMatch(source, /\bdocument\.|\bwindow\.|\blocalStorage\b|\bCSSStyle|\bHTMLElement\b/);
});

test("17. platform boundary — no policy reimplementation", () => {
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+createDirectorRuntimePresentationIntent\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimePresentationState\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeAttention\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeEmphasis\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+resolveDirectorRuntimeInformationDensity\s*\(/m);
  assert.doesNotMatch(source, /^\s*(?:export\s+)?function\s+orchestrateDirectorRuntimeAdaptivePresentation\s*\(/m);
  assert.equal(source.includes("PRESENTATION_STATE_" + "PRECEDENCE"), false);
  assert.equal(source.includes("ATTENTION_" + "PRECEDENCE"), false);
  assert.equal(source.includes("INFORMATION_DENSITY_" + "PRECEDENCE"), false);
  assert.match(source, /export\s*\{[\s\S]*orchestrateDirectorRuntimeAdaptivePresentation/);
});

test("18. public index boundary protected", () => {
  assert.equal(
    source.includes("directorRuntimeAdaptivePresentation" + "PublicIndex"),
    false,
  );
  assert.equal(source.includes("Sole" + "ConsumerEntryPoint"), false);
  assert.equal(source.includes("Ready" + "ForConsumer"), false);
  assert.equal(invariants.includes("dri-5-9-public-index-is-not-implemented-here"), true);
  assert.equal(invariants.length, 38);
  assert.deepEqual([...freezeGuarantees], [
    "identity-locked",
    "dependency-locked",
    "semantics-locked",
    "capability-surface-locked",
    "export-surface-locked",
    "deterministic",
    "immutable",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "compatible",
    "ready-for-public-index",
  ]);
});
