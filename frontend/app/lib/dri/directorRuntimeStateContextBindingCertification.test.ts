import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createRuntimeStateContextBinding } from
  "./directorRuntimeStateContextBindingFoundation.ts";
import { createRuntimeStateContextBindingRequest } from
  "./directorRuntimeStateContextBindingContracts.ts";
import {
  directorRuntimeStateContextBindingIntegration,
  integrateRuntimeStateContextBinding,
  runtimeStateContextBindingIntegrationPublicApiSurface,
  runtimeStateContextBindingIntegrationRegistry,
  type RuntimeStateContextBindingIntegrationRequest,
} from "./directorRuntimeStateContextBindingIntegration.ts";
import {
  validateRuntimeStateContextBinding,
  validateRuntimeStateContextBindingIntegrationDescriptor,
  validateRuntimeStateContextBindingIntegrationOutcome,
  validateRuntimeStateContextBindingIntegrationRegistry,
  validateRuntimeStateContextBindingIntegrationRequest,
  type RuntimeStateContextBindingValidationReport,
} from "./directorRuntimeStateContextBindingValidation.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS as decisions,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES as eligibilityStatuses,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVALUATION_PHASES as evaluationPhases,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS as evidenceKinds,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES as findingSeverities,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES as guarantees,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES as categories,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES as statuses,
  certifyRuntimeStateContextBinding,
  createRuntimeStateContextBindingCertificationEvidence,
  directorRuntimeStateContextBindingCertification as certification,
  evaluateRuntimeStateContextBindingCertificationEligibility,
  isRuntimeStateContextBindingCertificationRejected,
  isRuntimeStateContextBindingCertified,
  isRuntimeStateContextBindingCertifiedWithConditions,
  runtimeStateContextBindingCertificationApiNames,
  runtimeStateContextBindingCertificationPredicateNames,
  runtimeStateContextBindingCertificationPublicApiSurface,
  runtimeStateContextBindingCertificationRegistry as registry,
  runtimeStateContextBindingCertificationRequirementApplicability as applicability,
  runtimeStateContextBindingCertificationRequirements as requirements,
  type RuntimeStateContextBindingCertificationEvidence,
  type RuntimeStateContextBindingCertificationEvidenceKind,
  type RuntimeStateContextBindingCertificationRequest,
} from "./directorRuntimeStateContextBindingCertification.ts";

const state = Object.freeze({ runtimeStateId: "state-1", runtimeStateVersion: "1",
  runtimeStateKind: "executive" });
const context = Object.freeze({ workspaceId: "w", goalId: "g", objectId: "o", packId: "p" });
function integrationRequest(overrides: Record<string, unknown> = {}):
  RuntimeStateContextBindingIntegrationRequest {
  return Object.freeze({ consumerRole: "runtime", direction: "runtime-to-director",
    engineInput: Object.freeze({ request: createRuntimeStateContextBindingRequest({
      bindingId: "binding-1", runtimeState: state, context, scope: "pack", ...overrides,
    }) }) });
}
function evidence(evidenceId: string, evidenceKind: RuntimeStateContextBindingCertificationEvidenceKind,
  validationReport: RuntimeStateContextBindingValidationReport) {
  return createRuntimeStateContextBindingCertificationEvidence({ evidenceId, evidenceKind,
    validationReport });
}
function completeEvidence(completedReport?: RuntimeStateContextBindingValidationReport) {
  const request = integrationRequest();
  const completed = integrateRuntimeStateContextBinding(request);
  const rejected = integrateRuntimeStateContextBinding({ ...request, direction: "director-to-runtime" });
  return Object.freeze([
    evidence("e-request", "integration-request",
      validateRuntimeStateContextBindingIntegrationRequest(request)),
    evidence("e-completed", "completed-integration-outcome",
      completedReport ?? validateRuntimeStateContextBindingIntegrationOutcome(completed)),
    evidence("e-rejected", "rejected-integration-outcome",
      validateRuntimeStateContextBindingIntegrationOutcome(rejected)),
    evidence("e-registry", "integration-registry",
      validateRuntimeStateContextBindingIntegrationRegistry(runtimeStateContextBindingIntegrationRegistry)),
    evidence("e-descriptor", "integration-descriptor",
      validateRuntimeStateContextBindingIntegrationDescriptor(directorRuntimeStateContextBindingIntegration)),
    evidence("e-api", "integration-public-api-surface", validateRuntimeStateContextBinding({
      kind: "integration-public-api-surface", value: runtimeStateContextBindingIntegrationPublicApiSurface,
    })),
  ]);
}
function request(evidenceRecords = completeEvidence()): RuntimeStateContextBindingCertificationRequest {
  return Object.freeze({ certificationId: "certification-caller-1", evidence: evidenceRecords });
}

test("publishes exact certification metadata and sole Validation dependency", () => {
  assert.equal(certification.identity, "DRI-2:6/DirectorRuntimeStateContextBindingCertification");
  assert.equal(certification.version, "2.6.0");
  assert.equal(certification.namespace, "nexora.dri.runtime.state-context-binding.certification");
  assert.equal(certification.stage, "Certification");
  assert.equal(certification.immediateDependency,
    "DRI-2:5/DirectorRuntimeStateContextBindingValidation");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingCertification.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingValidation"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBinding(?:Integration|Engine|Contracts|Foundation)|directorRuntimeIntegration/);
});

test("publishes stable unique vocabularies, guarantees, phases, and requirements", () => {
  assert.deepEqual(statuses,
    ["not-evaluated", "eligible", "certified", "certified-with-conditions", "rejected"]);
  assert.deepEqual(decisions, ["approve", "approve-with-conditions", "reject"]);
  assert.deepEqual(eligibilityStatuses, ["eligible", "incomplete", "ineligible"]);
  assert.deepEqual(findingSeverities, ["info", "condition", "error", "critical"]);
  assert.deepEqual(evaluationPhases, ["request-inspected", "evidence-classified",
    "eligibility-evaluated", "requirements-evaluated", "findings-consolidated",
    "decision-resolved", "record-created"]);
  for (const values of [statuses, decisions, eligibilityStatuses, categories, findingSeverities,
    evidenceKinds, guarantees, evaluationPhases]) assert.equal(new Set(values).size, values.length);
  assert.equal(new Set(requirements.map(({ id }) => id)).size, requirements.length);
  for (const requirement of requirements)
    assert.equal(applicability[requirement.id], requirement.requiredEvidenceKinds);
});

test("preserves caller certification and evidence identities", () => {
  const evidenceRecord = completeEvidence()[0]!;
  assert.equal(evidenceRecord.evidenceId, "e-request");
  assert.equal(evidenceRecord.validationReport, evidenceRecord.validationReport);
  const record = certifyRuntimeStateContextBinding(request());
  assert.equal(record.certificationIdentity, "certification-caller-1");
  assert.equal(record.evidenceConsidered[0]?.evidenceId, "e-request");
});

test("classifies complete, missing, duplicate, unsupported, and conflicting evidence", () => {
  const complete = completeEvidence();
  assert.equal(evaluateRuntimeStateContextBindingCertificationEligibility(request(complete)).status,
    "eligible");
  const missing = complete.slice(1);
  const incomplete = evaluateRuntimeStateContextBindingCertificationEligibility(request(missing));
  assert.equal(incomplete.status, "incomplete");
  assert.deepEqual(incomplete.missingEvidenceKinds, ["integration-request"]);
  const duplicate = evaluateRuntimeStateContextBindingCertificationEligibility(
    request(Object.freeze([...complete, complete[0]!])));
  assert.deepEqual(duplicate.duplicateEvidenceKinds, ["integration-request"]);
  const unsupported = { ...complete[0], evidenceId: "unsupported", evidenceKind: "unknown-kind" } as
    unknown as RuntimeStateContextBindingCertificationEvidence;
  assert.deepEqual(evaluateRuntimeStateContextBindingCertificationEligibility(
    request(Object.freeze([...complete, unsupported]))).unsupportedEvidenceKinds, ["unknown-kind"]);
  const conflict = { ...complete[1], evidenceKind: "integration-request" as const };
  const conflicting = evaluateRuntimeStateContextBindingCertificationEligibility(
    request(Object.freeze([...complete, { ...conflict, evidenceId: "e-request" }])));
  assert.equal(conflicting.status, "ineligible");
  assert.deepEqual(conflicting.conflictingEvidenceIds, ["e-request"]);
});

test("certifies complete valid validation evidence", () => {
  const record = certifyRuntimeStateContextBinding(request());
  assert.equal(record.status, "certified");
  assert.equal(record.decision, "approve");
  assert.equal(record.findings.filter(({ blocking }) => blocking).length, 0);
  assert.deepEqual(record.certificationGuarantees, guarantees);
  assert.equal(isRuntimeStateContextBindingCertified(record), true);
  assert.equal(isRuntimeStateContextBindingCertifiedWithConditions(record), false);
});

test("turns warning evidence into conditions without blocking approval", () => {
  const partialOutcome = integrateRuntimeStateContextBinding(integrationRequest({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  }));
  const partialReport = validateRuntimeStateContextBindingIntegrationOutcome(partialOutcome);
  const record = certifyRuntimeStateContextBinding(request(completeEvidence(partialReport)));
  assert.equal(record.status, "certified-with-conditions");
  assert.equal(record.decision, "approve-with-conditions");
  assert.ok(record.findings.some(({ severity }) => severity === "condition"));
  assert.equal(record.summary.blockingFindingCount, 0);
  assert.equal(isRuntimeStateContextBindingCertifiedWithConditions(record), true);
});

test("invalid validation evidence blocks certification", () => {
  const invalidReport = validateRuntimeStateContextBindingIntegrationRequest({
    ...integrationRequest(), consumerRole: "invalid",
  } as unknown as RuntimeStateContextBindingIntegrationRequest);
  const records = [...completeEvidence()];
  records[0] = evidence("e-request", "integration-request", invalidReport);
  const record = certifyRuntimeStateContextBinding(request(Object.freeze(records)));
  assert.equal(record.status, "rejected");
  assert.equal(record.decision, "reject");
  assert.ok(record.summary.blockingFindingCount > 0);
  assert.equal(isRuntimeStateContextBindingCertificationRejected(record), true);
  assert.deepEqual(record.certificationGuarantees, []);
});

test("evaluates validation status rather than raw binding status", () => {
  const outcomes = [
    integrateRuntimeStateContextBinding(integrationRequest({ bindingId: "" })),
    integrateRuntimeStateContextBinding(Object.freeze({ consumerRole: "inspection" as const,
      direction: "inspection-only" as const, engineInput: Object.freeze({
        request: createRuntimeStateContextBinding({ bindingId: "u", runtimeState: null,
          context: {}, scope: "global" }),
      }) })),
  ];
  for (const bindingOutcome of outcomes) {
    const report = validateRuntimeStateContextBindingIntegrationOutcome(bindingOutcome);
    assert.equal(report.status, "valid");
    const record = certifyRuntimeStateContextBinding(request(completeEvidence(report)));
    assert.equal(record.status, "certified");
  }
});

test("reports duplicate, unsupported, conflicting, and missing evidence deterministically", () => {
  const complete = completeEvidence();
  const duplicate = certifyRuntimeStateContextBinding(request(Object.freeze([...complete, complete[0]!])));
  assert.equal(duplicate.status, "certified-with-conditions");
  const missing = certifyRuntimeStateContextBinding(request(complete.slice(1)));
  assert.equal(missing.status, "rejected");
  const conflict = { ...complete[1]!, evidenceId: "e-request" };
  const conflicting = certifyRuntimeStateContextBinding(request(Object.freeze([...complete, conflict])));
  assert.equal(conflicting.status, "rejected");
  const one = certifyRuntimeStateContextBinding(request(Object.freeze([...complete, complete[0]!])));
  assert.deepEqual(duplicate.findings.map(({ findingId }) => findingId),
    one.findings.map(({ findingId }) => findingId));
});

test("derives decision and summary counts from evidence and requirements", () => {
  const partialReport = validateRuntimeStateContextBindingIntegrationOutcome(
    integrateRuntimeStateContextBinding(integrationRequest({
      scope: "object", context: { workspaceId: "w" },
    })),
  );
  for (const record of [
    certifyRuntimeStateContextBinding(request()),
    certifyRuntimeStateContextBinding(request(completeEvidence(partialReport))),
  ]) {
    assert.equal(record.summary.totalRequirements, requirements.length);
    assert.equal(record.summary.totalEvidenceRecords, record.evidenceConsidered.length);
    assert.equal(record.summary.blockingFindingCount,
      record.findings.filter(({ blocking }) => blocking).length);
    assert.equal(record.summary.passedRequirements + record.summary.conditionRequirements +
      record.summary.failedRequirements, record.summary.totalRequirements);
    assert.equal(record.summary.finalStatus, record.status);
    assert.equal(record.summary.finalDecision, record.decision);
  }
});

test("is deterministic, stateless, immutable, and source non-mutating", () => {
  const source = request();
  const before = JSON.stringify(source);
  const one = certifyRuntimeStateContextBinding(source);
  certifyRuntimeStateContextBinding(request(completeEvidence().slice(1)));
  const two = certifyRuntimeStateContextBinding(source);
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.findings), true);
  assert.equal(Object.isFrozen(one.summary), true);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  const containsFunction = (value: unknown): boolean => typeof value === "function" ||
    (value !== null && typeof value === "object" && Object.values(value)
      .some((entry) => containsFunction(entry)));
  assert.equal(containsFunction(one), false);
});

test("registry dynamic counts, public API, and descriptor remain consistent", () => {
  assert.equal(registry.statusCount, registry.statuses.length);
  assert.equal(registry.decisionCount, registry.decisions.length);
  assert.equal(registry.eligibilityStatusCount, registry.eligibilityStatuses.length);
  assert.equal(registry.requirementCategoryCount, registry.requirementCategories.length);
  assert.equal(registry.findingSeverityCount, registry.findingSeverities.length);
  assert.equal(registry.evidenceKindCount, registry.evidenceKinds.length);
  assert.equal(registry.guaranteeCount, registry.guarantees.length);
  assert.equal(registry.evaluationPhaseCount, registry.evaluationPhases.length);
  assert.equal(registry.requirementCount, registry.requirements.length);
  assert.equal(registry.contractTypeCount, registry.contractTypes.length);
  assert.equal(registry.functionalApiCount, registry.functionalApis.length);
  assert.equal(registry.predicateCount, registry.predicates.length);
  assert.equal(registry.publicApiCount, registry.publicApiSurface.length);
  assert.deepEqual(runtimeStateContextBindingCertificationPublicApiSurface,
    [...runtimeStateContextBindingCertificationApiNames,
      ...runtimeStateContextBindingCertificationPredicateNames]);
  assert.equal(certification.registry, registry);
  assert.equal(certification.requirementRegistry, requirements);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(certification), true);
});

test("contains no validation duplication, repair, publication, freeze, state, events, I/O, UI, or execution", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingCertification.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|counter|history)\b/);
  assert.doesNotMatch(source, /\b(?:repairValidationReport|removeInvalidFinding|downgradeValidationError|insertMissingEvidence|rewriteValidationStatus|fixRegistry|correctDescriptor|normalizeAndApprove)\b/);
  assert.doesNotMatch(source, /\b(?:publishPlatform|createPlatformManifest|markReadyForPlatform|releaseCapability|registerConsumer|activateRuntimeBinding)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|publish|subscribe|listener|callback|async|Promise|setTimeout|setInterval|WebSocket|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:camera|animation|rendering|executeDirector|dispatchCommand|synchronizeState|runtime store)\b/i);
});
