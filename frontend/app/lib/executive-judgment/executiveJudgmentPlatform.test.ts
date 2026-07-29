import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { validateExecutiveJudgment } from "./executiveJudgmentEngine.ts";
import { validateExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationEngine.ts";
import {
  ExecutiveJudgmentPlatform,
  buildExecutiveJudgmentPlatformManifest,
  createExecutiveJudgmentPlatform,
  getExecutiveJudgmentPlatformRegistry,
  getExecutiveJudgmentPlatformVersion,
  runExecutiveJudgmentPlatform,
  validateExecutiveJudgmentPlatform,
} from "./executiveJudgmentPlatformIndex.ts";

function item(id: string, label: string, source: string, references: readonly string[] = Object.freeze([])): ExecutiveJudgmentContextItem {
  return Object.freeze({ id, label, description: `${label} metadata.`, source, references: Object.freeze([...references]), metadataOnly: true });
}

function input() {
  return Object.freeze({
    availableEvidence: Object.freeze([
      item("evidence.1", "Evidence", "Document Store", Object.freeze(["doc.1"])),
      item("evidence.2", "Growth Evidence", "KPI Platform", Object.freeze(["kpi.1"])),
    ]),
    constraints: Object.freeze([
      item("constraint.1", "Resource Constraint", "Resource Model", Object.freeze(["evidence.1"])),
    ]),
    availableAlternatives: Object.freeze([
      item("alternative.viable", "Viable Alternative", "APP", Object.freeze(["evidence.1"])),
      item("alternative.blocked", "Blocked Alternative", "APP", Object.freeze(["evidence.2", "constraint.1"])),
      item("tradeoff.1", "Execution Strategic Gain", "APP", Object.freeze(["evidence.1", "constraint.1"])),
      item("opportunity.1", "Strategic Gain Opportunity", "Opportunity Platform", Object.freeze(["evidence.2", "tradeoff.1"])),
    ]),
    risks: Object.freeze([
      item("risk.1", "Execution Risk", "Risk Platform", Object.freeze(["evidence.1", "constraint.1", "tradeoff.1"])),
    ]),
  });
}

test("executes complete platform pipeline", () => {
  const result = runExecutiveJudgmentPlatform(input());
  assert.equal(result.platformIdentity.platformVersion, "APP-JUDGE-9");
  assert.equal(result.context.baseContext.contextId, "executive-judgment-context");
  assert.equal(result.evidenceAssessment.assessments.length, 2);
  assert.equal(result.constraintAssessment.assessments.length, 1);
  assert.equal(result.executiveJudgment.judgmentId, "judgment.executive-judgment-context");
  assert.equal(result.judgmentExplanation.explanationType, "structured-judgment-explanation");
});

test("preserves phase ordering", () => {
  const result = runExecutiveJudgmentPlatform(input());
  assert.deepEqual(result.pipelineSnapshot.phaseOrder, [
    "APP-JUDGE-1",
    "APP-JUDGE-2",
    "APP-JUDGE-3",
    "APP-JUDGE-4",
    "APP-JUDGE-5",
    "APP-JUDGE-6",
    "APP-JUDGE-7",
    "APP-JUDGE-8",
    "APP-JUDGE-9",
  ]);
});

test("validates dependencies", () => {
  const registry = getExecutiveJudgmentPlatformRegistry();
  const appJudge9 = registry.dependencyMatrix.find((entry) => entry.phaseId === "APP-JUDGE-9");
  assert.equal(appJudge9?.consumes.length, 8);
  assert.equal(appJudge9?.consumes.includes("APP-JUDGE-8"), true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveJudgmentPlatformManifest();
  assert.equal(manifest.platformVersion, "APP-JUDGE-9");
  assert.equal(manifest.certifiedComponents.length, 9);
  assert.equal(manifest.manifestFingerprint.length > 0, true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveJudgmentPlatformRegistry();
  assert.equal(registry.platformId, "APP-JUDGE");
  assert.equal(registry.publicApis.includes("runExecutiveJudgmentPlatform"), true);
  assert.equal(registry.extensionPolicy.allowsRecommendations, false);
  assert.equal(registry.releaseMetadata.nextPhase, "APP-JUDGE-10");
});

test("publishes immutable outputs", () => {
  const result = createExecutiveJudgmentPlatform(input());
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.pipelineSnapshot), true);
  assert.equal(result.platformMetadata.immutable, true);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutiveJudgmentPlatform.runExecutiveJudgmentPlatform, "function");
  assert.equal(typeof ExecutiveJudgmentPlatform.createExecutiveJudgmentPlatform, "function");
  assert.equal(typeof ExecutiveJudgmentPlatform.validateExecutiveJudgmentPlatform, "function");
  assert.equal(typeof ExecutiveJudgmentPlatform.buildExecutiveJudgmentPlatformManifest, "function");
  assert.equal(typeof ExecutiveJudgmentPlatform.getExecutiveJudgmentPlatformRegistry, "function");
  assert.equal(typeof ExecutiveJudgmentPlatform.getExecutiveJudgmentPlatformVersion, "function");
});

test("validates platform result", () => {
  const validation = validateExecutiveJudgmentPlatform(runExecutiveJudgmentPlatform(input()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("creates deterministic pipeline snapshots", () => {
  const left = runExecutiveJudgmentPlatform(input());
  const right = runExecutiveJudgmentPlatform(input());
  assert.equal(left.pipelineSnapshot.fingerprint, right.pipelineSnapshot.fingerprint);
  assert.equal(left.executionManifest.manifestFingerprint, right.executionManifest.manifestFingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-8 compatibility", () => {
  const result = runExecutiveJudgmentPlatform(input());
  assert.equal(validateExecutiveJudgment(result.executiveJudgment).valid, true);
  assert.equal(validateExecutiveJudgmentExplanation(result.judgmentExplanation).valid, true);
});

test("publishes platform version", () => {
  assert.equal(getExecutiveJudgmentPlatformVersion(), "APP-JUDGE-9");
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatform.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformRunner.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformManifest.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformIndex.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("call LLM"), false);
  assert.equal(sources.includes("fetch("), false);
  assert.equal(sources.includes("writeFile"), false);
});
