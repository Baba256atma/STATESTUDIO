import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  certifyDirectorRuntimeSceneOrchestration,
  type DirectorSceneOrchestrationCertificationRecord,
  type DirectorSceneOrchestrationPlan,
} from "./directorRuntimeSceneOrchestrationCertification.ts";
import type {
  DirectorSceneOrchestrationValidationFinding,
  DirectorSceneOrchestrationValidationReport,
} from "./directorRuntimeSceneOrchestrationValidation.ts";
import {
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES as capabilities,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS as characteristics,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES as compatibilityStatuses,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS as compatibilityTargets,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES as consumerCategories,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES as eligibilityValues,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES as guarantees,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES as publicationPhases,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS as requirementIds,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES as statuses,
  directorRuntimeSceneOrchestrationPlatform as descriptor,
  directorRuntimeSceneOrchestrationPlatformRegistry as registry,
  directorSceneOrchestrationPlatformConsumerContract as consumerContract,
  directorSceneOrchestrationPlatformRequirements as requirements,
  isDirectorSceneOrchestrationPlatformEligible,
  isPublishedDirectorSceneOrchestrationPlatformResult,
  publishDirectorRuntimeSceneOrchestrationPlatform,
} from "./directorRuntimeSceneOrchestrationPlatform.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const plan: DirectorSceneOrchestrationPlan = Object.freeze({
  planId: "PLAN-001",
  context: Object.freeze({ runtimeContextId: "context-1", runtimeStateId: "state-1" }),
  focus: Object.freeze({ primary: factory, secondary: Object.freeze([]) }),
  attention: Object.freeze([]), paths: Object.freeze([]),
  operations: Object.freeze([{ operationId: "focus-factory", kind: "focus" as const,
    subjects: Object.freeze([factory]), relationships: Object.freeze([]) }]),
});

function report(findings: readonly DirectorSceneOrchestrationValidationFinding[] = [],
  overrides: Partial<DirectorSceneOrchestrationValidationReport> = {}):
DirectorSceneOrchestrationValidationReport {
  const errorCount = findings.filter(({ severity }) => severity === "error").length;
  const warningCount = findings.filter(({ severity }) => severity === "warning").length;
  const noticeCount = findings.filter(({ severity }) => severity === "notice").length;
  return Object.freeze({ validationId: `${plan.planId}:DRI-3:5:validation`, planId: plan.planId,
    status: errorCount ? "invalid" as const : "valid" as const,
    findings: Object.freeze([...findings]), checkedRuleIds: Object.freeze(["identity.plan-id"]),
    errorCount, warningCount, noticeCount, ...overrides });
}

const finding = (code: string, severity: "notice" | "warning" | "error",
  ruleId = "test.rule"): DirectorSceneOrchestrationValidationFinding =>
  Object.freeze({ ruleId, code, severity, message: `${code} message` });

function certification(
  findings: readonly DirectorSceneOrchestrationValidationFinding[] = [],
  planOverride: DirectorSceneOrchestrationPlan = plan,
): DirectorSceneOrchestrationCertificationRecord {
  return certifyDirectorRuntimeSceneOrchestration({
    plan: planOverride,
    validationReport: report(findings, { planId: planOverride.planId,
      validationId: `${planOverride.planId}:DRI-3:5:validation` }),
  });
}

const input = (
  cert: DirectorSceneOrchestrationCertificationRecord = certification(),
  planValue: DirectorSceneOrchestrationPlan = plan,
) => Object.freeze({ plan: planValue, certification: cert });

test("publishes exact identity, namespace, version, and sole DRI-3:6 dependency", () => {
  assert.deepEqual({
    phase: descriptor.phase, name: descriptor.name, identity: descriptor.identity,
    namespace: descriptor.namespace, version: descriptor.version,
    dependency: descriptor.immediateDependency,
  }, {
    phase: "DRI-3:7", name: "DirectorRuntimeSceneOrchestrationPlatform",
    identity: "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform",
    namespace: "nexora.dri.scene.orchestration.platform", version: "3.7.0",
    dependency: "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationPlatform.ts",
    import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeSceneOrchestrationCertification"]);
  assert.doesNotMatch(source, /directorRuntimeScene(?:OrchestrationValidation|FocusAttentionOrchestration|OrchestrationModel|OrchestrationContracts|OrchestrationFoundation|OrchestrationFreeze|OrchestrationPublicIndex)/);
});

test("publishes canonical platform vocabularies", () => {
  assert.deepEqual(statuses, ["published", "published-with-conditions", "rejected"]);
  assert.deepEqual(eligibilityValues, ["eligible", "conditionally-eligible", "ineligible"]);
  assert.deepEqual(capabilities, [
    "focus-orchestration", "attention-orchestration", "visibility-orchestration",
    "relationship-orchestration", "path-orchestration", "preservation-orchestration",
  ]);
  assert.deepEqual(compatibilityStatuses, ["compatible", "conditional", "incompatible"]);
  assert.deepEqual(consumerCategories, ["director", "scene", "adapter", "runtime"]);
  assert.deepEqual(publicationPhases, ["inspect", "qualify", "project", "publish"]);
  for (const values of [statuses, eligibilityValues, capabilities, compatibilityStatuses,
    consumerCategories, publicationPhases, characteristics, guarantees, requirementIds])
    assert.equal(new Set(values).size, values.length);
});

test("constructs platform input and publishes certified artifacts", () => {
  const cert = certification();
  const publicationInput = input(cert);
  assert.equal(publicationInput.plan.planId, "PLAN-001");
  assert.equal(publicationInput.certification.status, "certified");
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(publicationInput);
  assert.equal(result.status, "published");
  assert.equal(result.eligibility, "eligible");
  assert.ok(result.manifest);
  assert.deepEqual(result.manifest.conditions, []);
  assert.equal(result.manifest.manifestId,
    `${plan.planId}:${cert.certificationId}:DRI-3:7:platform`);
  assert.equal(isDirectorSceneOrchestrationPlatformEligible(publicationInput), true);
  assert.equal(isPublishedDirectorSceneOrchestrationPlatformResult(result), true);
});

test("maps conditionally-certified artifacts to published-with-conditions", () => {
  const cert = certification([
    finding("CONDITION-A", "warning", "rule-a"),
    finding("CONDITION-B", "warning", "rule-b"),
  ]);
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input(cert));
  assert.equal(result.status, "published-with-conditions");
  assert.equal(result.eligibility, "conditionally-eligible");
  assert.ok(result.manifest);
  assert.deepEqual(result.manifest.conditions.map(({ code }) => code),
    ["CONDITION-A", "CONDITION-B"]);
  assert.deepEqual(result.manifest.conditions.map(({ conditionId }) => conditionId),
    cert.conditions.map(({ conditionId }) => conditionId));
  assert.deepEqual(result.manifest.conditions.map(({ sourceRuleId }) => sourceRuleId),
    ["rule-a", "rule-b"]);
});

test("rejects rejected certification without a usable manifest", () => {
  const cert = certification([finding("structural-error", "error")]);
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input(cert));
  assert.equal(cert.status, "rejected");
  assert.equal(result.status, "rejected");
  assert.equal(result.eligibility, "ineligible");
  assert.equal(result.manifest, null);
  assert.ok(result.reasons.some(({ code }) => code === "certification-rejected"));
  assert.equal(isDirectorSceneOrchestrationPlatformEligible(input(cert)), false);
  assert.equal(isPublishedDirectorSceneOrchestrationPlatformResult(result), false);
});

test("rejects plan/certification identity mismatch without altering certification", () => {
  const cert = certification();
  const mismatchedPlan = Object.freeze({ ...plan, planId: "PLAN-A" });
  const mismatchedCert = Object.freeze({ ...cert, planId: "PLAN-B" });
  const before = JSON.stringify(mismatchedCert);
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(
    input(mismatchedCert, mismatchedPlan));
  assert.equal(result.status, "rejected");
  assert.equal(result.eligibility, "ineligible");
  assert.equal(result.manifest, null);
  assert.ok(result.reasons.some(({ code }) => code === "plan-certification-identity-mismatch"));
  assert.equal(JSON.stringify(mismatchedCert), before);
  assert.equal(mismatchedCert.status, "certified");
});

test("rejects missing required certification evidence", () => {
  const cert = certification();
  const incomplete = Object.freeze({ ...cert, validationId: "" });
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input(incomplete));
  assert.equal(result.status, "rejected");
  assert.equal(result.eligibility, "ineligible");
  assert.equal(result.manifest, null);
  assert.ok(result.reasons.some(({ code }) => code === "certification-evidence-incomplete"));
});

test("projects platform capabilities and guarantees in stable approved order", () => {
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input());
  assert.ok(result.manifest);
  assert.deepEqual(result.manifest.capabilities, capabilities);
  assert.equal(result.manifest.capabilities.includes(
    "threejs-camera-focus" as typeof capabilities[number]), false);
  assert.deepEqual(result.manifest.guarantees, guarantees);
  const altered = Object.freeze({
    ...certification(),
    guarantees: Object.freeze(["deterministic-certification", "unsupported-guarantee",
      "renderer-independent"]),
  });
  const alteredResult = publishDirectorRuntimeSceneOrchestrationPlatform(input(altered));
  assert.ok(alteredResult.manifest);
  assert.deepEqual(alteredResult.manifest.guarantees, [
    "deterministic-publication", "renderer-independent", "ordered-capabilities",
  ]);
  assert.equal(alteredResult.manifest.guarantees.includes(
    "unsupported-guarantee" as typeof guarantees[number]), false);
});

test("preserves condition order and builds compatibility plus consumer contract", () => {
  const cert = certification([
    finding("CONDITION-A", "warning", "rule-a"),
    finding("CONDITION-B", "warning", "rule-b"),
  ]);
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input(cert));
  assert.ok(result.manifest);
  assert.deepEqual(result.manifest.conditions, cert.conditions.map((condition) => ({ ...condition })));
  assert.deepEqual(result.manifest.compatibility.map(({ target }) => target),
    compatibilityTargets.map(({ target }) => target));
  assert.ok(result.manifest.compatibility.every(({ status }) => status === "conditional"));
  const published = publishDirectorRuntimeSceneOrchestrationPlatform(input());
  assert.ok(published.manifest);
  assert.ok(published.manifest.compatibility.every(({ status }) => status === "compatible"));
  assert.deepEqual(result.manifest.consumer, consumerContract);
  assert.equal(consumerContract.entryRole, "CertifiedSceneOrchestrationPlatform");
  assert.equal(consumerContract.mutationAllowed, false);
  assert.deepEqual(publicationPhases, ["inspect", "qualify", "project", "publish"]);
});

test("preserves source immutability and freezes nested manifest collections", () => {
  const cert = certification([finding("CONDITION-A", "warning", "rule-a")]);
  const planBefore = JSON.stringify(plan);
  const certBefore = JSON.stringify(cert);
  const evidenceBefore = JSON.stringify(cert.evidence);
  const conditionsBefore = JSON.stringify(cert.conditions);
  const one = publishDirectorRuntimeSceneOrchestrationPlatform(input(cert));
  const two = publishDirectorRuntimeSceneOrchestrationPlatform(input(cert));
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(plan), planBefore);
  assert.equal(JSON.stringify(cert), certBefore);
  assert.equal(JSON.stringify(cert.evidence), evidenceBefore);
  assert.equal(JSON.stringify(cert.conditions), conditionsBefore);
  assert.ok(one.manifest);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.manifest), true);
  assert.equal(Object.isFrozen(one.manifest.capabilities), true);
  assert.equal(Object.isFrozen(one.manifest.guarantees), true);
  assert.equal(Object.isFrozen(one.manifest.conditions), true);
  assert.equal(Object.isFrozen(one.manifest.conditions[0]), true);
  assert.equal(Object.isFrozen(one.manifest.compatibility), true);
  assert.equal(Object.isFrozen(one.manifest.consumer), true);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
});

test("registry uses dynamically derived counts and immutable surfaces", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts],
    [registry.statusCount, registry.statuses],
    [registry.eligibilityValueCount, registry.eligibilityValues],
    [registry.capabilityCount, registry.capabilities],
    [registry.guaranteeCount, registry.guarantees],
    [registry.compatibilityStatusCount, registry.compatibilityStatuses],
    [registry.compatibilityTargetCount, registry.compatibilityTargets],
    [registry.consumerCategoryCount, registry.consumerCategories],
    [registry.publicationPhaseCount, registry.publicationPhases],
    [registry.characteristicCount, registry.characteristics],
    [registry.requirementCount, registry.requirements],
    [registry.publicApiCount, registry.publicApis],
    [registry.predicateCount, registry.predicates],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.deepEqual(requirements.map(({ requirementId }) => requirementId), requirementIds);
  assert.deepEqual(characteristics, [
    "deterministic", "stateless", "synchronous", "immutable", "json-compatible",
    "certification-gated", "renderer-independent", "business-policy-independent",
    "lineage-preserving", "condition-transparent",
  ]);
  assert.equal(descriptor.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(descriptor), true);
});

test("preserves lineage and contains no forbidden platform behaviors", () => {
  const authoritative = certification();
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input(authoritative));
  assert.ok(result.manifest);
  assert.equal(result.manifest.planId, plan.planId);
  assert.equal(result.manifest.certificationId, authoritative.certificationId);
  assert.equal(result.manifest.validationId, authoritative.validationId);
  assert.equal(result.manifest.platformIdentity.identity, descriptor.identity);
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationPlatform.ts",
    import.meta.url), "utf8");
  assert.doesNotMatch(source, /certifyDirectorRuntimeSceneOrchestration\s*\(/);
  assert.doesNotMatch(source, /validateDirectorRuntimeSceneOrchestration\s*\(/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|camera|mesh|geometry|material|shader|color|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:repair|normalize|calculateKpi|calculateKoi|rankScenario|approveDecision|openai|anthropic|llm|emit|dispatch)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:scene\.add|node\.focus|node\.hide|DRI-3-LOCKED|ReadyForConsumer|SoleConsumerEntryPoint|Frozen|Released)\b/);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(authoritative.status, "certified");
});
