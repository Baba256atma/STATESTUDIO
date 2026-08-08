import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS as decisions,
  DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_FINDING_DISPOSITIONS as dispositions,
  DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES as guarantees,
  DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES as statuses,
  certifyDirectorRuntimeSceneOrchestration,
  createDirectorSceneOrchestrationCertificationCondition,
  createDirectorSceneOrchestrationCertificationEvidence,
  directorRuntimeSceneOrchestrationCertification as descriptor,
  directorRuntimeSceneOrchestrationCertificationRegistry as registry,
  directorSceneOrchestrationCertificationRequirements as requirements,
  isDirectorRuntimeSceneOrchestrationCertificationRejected,
  isDirectorRuntimeSceneOrchestrationCertified,
  isDirectorRuntimeSceneOrchestrationConditionallyCertified,
  isDirectorRuntimeSceneOrchestrationPublicationEligible,
} from "./directorRuntimeSceneOrchestrationCertification.ts";
import {
  validateDirectorRuntimeSceneOrchestration,
  type DirectorSceneOrchestrationPlan,
  type DirectorSceneOrchestrationValidationFinding,
  type DirectorSceneOrchestrationValidationReport,
} from "./directorRuntimeSceneOrchestrationValidation.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const plan: DirectorSceneOrchestrationPlan = Object.freeze({
  planId: "request-1:scene-orchestration-plan",
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

test("publishes exact identity and sole DRI-3:5 Validation dependency", () => {
  assert.deepEqual({ phase: descriptor.phase, name: descriptor.name, identity: descriptor.identity,
    namespace: descriptor.namespace, version: descriptor.version,
    dependency: descriptor.immediateDependency }, {
    phase: "DRI-3:6", name: "DirectorRuntimeSceneOrchestrationCertification",
    identity: "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification",
    namespace: "nexora.dri.scene.orchestration.certification", version: "3.6.0",
    dependency: "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationCertification.ts",
    import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeSceneOrchestrationValidation"]);
  assert.doesNotMatch(source, /directorRuntimeScene(?:FocusAttentionOrchestration|OrchestrationModel|OrchestrationContracts|OrchestrationFoundation|OrchestrationPlatform)/);
});

test("publishes exact certification vocabularies, requirements, and guarantees", () => {
  assert.deepEqual(statuses, ["certified", "conditionally-certified", "rejected"]);
  assert.deepEqual(decisions, ["approve", "approve-with-conditions", "reject"]);
  assert.deepEqual(dispositions, ["non-blocking", "condition", "blocking"]);
  for (const values of [statuses, decisions, dispositions, guarantees])
    assert.equal(new Set(values).size, values.length);
  assert.equal(new Set(requirements.map(({ requirementId }) => requirementId)).size, requirements.length);
  assert.ok(requirements.some(({ requirementId }) => requirementId === "validation-passed"));
});

test("constructs immutable condition and evidence while preserving validation order", () => {
  const condition = createDirectorSceneOrchestrationCertificationCondition({ conditionId: "condition-1",
    code: "warning-one", message: "Visible condition", sourceRuleId: "rule-one" });
  const source = report([finding("warning-one", "warning", "rule-one"),
    finding("notice-one", "notice", "rule-two")]);
  const evidence = createDirectorSceneOrchestrationCertificationEvidence(source);
  assert.deepEqual(condition, { conditionId: "condition-1", code: "warning-one",
    message: "Visible condition", sourceRuleId: "rule-one" });
  assert.deepEqual(evidence.findingCodes, ["warning-one", "notice-one"]);
  assert.deepEqual(evidence.checkedRuleIds, ["identity.plan-id"]);
  assert.equal(Object.isFrozen(condition), true);
  assert.equal(Object.isFrozen(evidence), true);
  assert.equal(Object.isFrozen(evidence.findingCodes), true);
});

test("valid validation without findings certifies deterministically", () => {
  const validationReport = validateDirectorRuntimeSceneOrchestration(plan);
  const record = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport });
  assert.equal(record.status, "certified");
  assert.equal(record.decision, "approve");
  assert.deepEqual(record.conditions, []);
  assert.deepEqual(record.rejectionReasons, []);
  assert.deepEqual(record.guarantees, guarantees);
  assert.equal(record.certificationId,
    `${plan.planId}:${validationReport.validationId}:DRI-3:6:certification`);
  assert.equal(isDirectorRuntimeSceneOrchestrationCertified(record), true);
  assert.equal(isDirectorRuntimeSceneOrchestrationPublicationEligible(record), true);
});

test("notice findings remain non-blocking and do not create conditions", () => {
  const record = certifyDirectorRuntimeSceneOrchestration({ plan,
    validationReport: report([finding("notice-one", "notice")]) });
  assert.equal(record.status, "certified");
  assert.deepEqual(record.conditions, []);
  assert.deepEqual(record.evidence.findingCodes, ["notice-one"]);
});

test("warnings produce visible ordered deduplicated conditional certification", () => {
  const validationReport = report([
    finding("warning-one", "warning", "rule-one"),
    finding("warning-one", "warning", "rule-one"),
    finding("warning-two", "warning", "rule-two"),
  ]);
  const record = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport });
  assert.equal(record.status, "conditionally-certified");
  assert.equal(record.decision, "approve-with-conditions");
  assert.deepEqual(record.conditions.map(({ code }) => code), ["warning-one", "warning-two"]);
  assert.deepEqual(record.evidence.findingCodes, ["warning-one", "warning-one", "warning-two"]);
  assert.equal(isDirectorRuntimeSceneOrchestrationConditionallyCertified(record), true);
  assert.equal(isDirectorRuntimeSceneOrchestrationPublicationEligible(record), true);
});

test("invalid validation and error findings can never be upgraded", () => {
  const validationReport = report([finding("structural-error", "error")]);
  const record = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport });
  assert.equal(record.status, "rejected");
  assert.equal(record.decision, "reject");
  assert.deepEqual(record.rejectionReasons,
    ["validation-invalid", "blocking-validation-finding"]);
  assert.deepEqual(record.evidence.findingCodes, ["structural-error"]);
  assert.deepEqual(record.guarantees, []);
  assert.equal(isDirectorRuntimeSceneOrchestrationCertificationRejected(record), true);
  assert.equal(isDirectorRuntimeSceneOrchestrationPublicationEligible(record), false);
});

test("rejects plan mismatch, missing validation identity, and missing evidence in stable order", () => {
  const invalidEvidence = report([], { validationId: "", planId: "other-plan", checkedRuleIds: [] });
  const record = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport: invalidEvidence });
  assert.equal(record.status, "rejected");
  assert.deepEqual(record.rejectionReasons, ["plan-validation-identity-mismatch",
    "validation-identity-missing", "validation-evidence-missing"]);
  assert.equal(record.evidence.planId, "other-plan");
  assert.equal(record.evidence.validationId, "");
});

test("rejects missing plan identity and malformed deterministic validation identity", () => {
  const anonymousPlan = { ...plan, planId: "" };
  const record = certifyDirectorRuntimeSceneOrchestration({ plan: anonymousPlan,
    validationReport: report([], { validationId: "arbitrary", planId: "" }) });
  assert.equal(record.status, "rejected");
  assert.deepEqual(record.rejectionReasons,
    ["plan-identity-missing", "validation-identity-invalid"]);
});

test("trusts validation authority and does not re-run or repair orchestration rules", () => {
  const invalidPlan = { ...plan, focus: { primary: factory, secondary: [factory] } };
  const authoritative = report([], { planId: invalidPlan.planId });
  const before = JSON.stringify(invalidPlan);
  const record = certifyDirectorRuntimeSceneOrchestration({ plan: invalidPlan,
    validationReport: authoritative });
  assert.equal(record.status, "certified");
  assert.equal(JSON.stringify(invalidPlan), before);
});

test("preserves plan/report sources and produces immutable deterministic JSON-safe records", () => {
  const validationReport = report([finding("warning-one", "warning")]);
  const planBefore = JSON.stringify(plan); const reportBefore = JSON.stringify(validationReport);
  const one = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport });
  const two = certifyDirectorRuntimeSceneOrchestration({ plan, validationReport });
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(plan), planBefore);
  assert.equal(JSON.stringify(validationReport), reportBefore);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.conditions), true);
  assert.equal(Object.isFrozen(one.conditions[0]), true);
  assert.equal(Object.isFrozen(one.rejectionReasons), true);
  assert.equal(Object.isFrozen(one.evidence), true);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
});

test("registry uses dynamically derived counts and immutable ordered surfaces", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts], [registry.statusCount, registry.statuses],
    [registry.decisionCount, registry.decisions],
    [registry.findingDispositionCount, registry.findingDispositions],
    [registry.requirementCount, registry.requirements], [registry.guaranteeCount, registry.guarantees],
    [registry.publicApiCount, registry.publicApis], [registry.predicateCount, registry.predicates],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.equal(descriptor.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no validation execution, repair, renderer, NOL, business, AI, persistence, or events", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationCertification.ts",
    import.meta.url), "utf8");
  assert.doesNotMatch(source, /validateDirectorRuntimeSceneOrchestration\s*\(/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|camera|mesh|geometry|material|color|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:repair|normalize|calculateKpi|calculateKoi|rankScenario|approveDecision|openai|anthropic|llm|emit|publish|dispatch)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:sceneNode|renderer)\s*\.|from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
