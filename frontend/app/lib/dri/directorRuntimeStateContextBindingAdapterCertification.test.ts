import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createRuntimeStateContextBindingRequest } from "./directorRuntimeStateContextBindingContracts.ts";
import { directorRuntimeStateContextBindingIntegration, integrateRuntimeStateContextBinding,
  runtimeStateContextBindingIntegrationPublicApiSurface,
  runtimeStateContextBindingIntegrationRegistry } from "./directorRuntimeStateContextBindingIntegration.ts";
import { validateRuntimeStateContextBinding, validateRuntimeStateContextBindingIntegrationDescriptor,
  validateRuntimeStateContextBindingIntegrationOutcome, validateRuntimeStateContextBindingIntegrationRegistry,
  validateRuntimeStateContextBindingIntegrationRequest } from "./directorRuntimeStateContextBindingValidation.ts";
import { certifyRuntimeStateContextBinding, createRuntimeStateContextBindingCertificationEvidence }
  from "./directorRuntimeStateContextBindingCertification.ts";
import { publishRuntimeStateContextBindingPlatform, type RuntimeStateContextBindingPlatformManifest }
  from "./directorRuntimeStateContextBindingPlatform.ts";
import * as platformRuntime from "./directorRuntimeStateContextBindingPlatform.ts";
import * as adapterRuntime from "./directorRuntimeStateContextBindingAdapterCertification.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS as approvedBehaviors,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES as capabilities,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_DECISIONS as decisions,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_EVALUATION_PHASES as phases,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES as adapterGuarantees,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_STATUSES as statuses,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES as compatibilityStates,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_ELIGIBILITY_VALUES as eligibilityValues,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS as evidenceKinds,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS as evidenceResults,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES as severities,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS as adapterKinds,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS as prohibitedBehaviors,
  RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES as categories,
  certifyRuntimeStateContextBindingAdapter,
  createRuntimeStateContextBindingAdapterEvidence,
  directorRuntimeStateContextBindingAdapterCertification as adapterCertification,
  evaluateRuntimeStateContextBindingAdapterEligibility,
  inspectRuntimeStateContextBindingAdapterCertification,
  isRuntimeStateContextBindingAdapterCertificationRejected,
  isRuntimeStateContextBindingAdapterCertified,
  isRuntimeStateContextBindingAdapterCertifiedWithConditions,
  runtimeStateContextBindingAdapterCertificationApiNames,
  runtimeStateContextBindingAdapterCertificationPredicateNames,
  runtimeStateContextBindingAdapterCertificationPublicApiSurface,
  runtimeStateContextBindingAdapterCertificationRegistry as registry,
  runtimeStateContextBindingAdapterCertificationRequirements as requirements,
  type RuntimeStateContextBindingAdapterBehavior,
  type RuntimeStateContextBindingAdapterCertificationRequest,
  type RuntimeStateContextBindingAdapterDeclaration,
  type RuntimeStateContextBindingAdapterEvidence,
} from "./directorRuntimeStateContextBindingAdapterCertification.ts";

const state = { runtimeStateId: "s", runtimeStateVersion: "1", runtimeStateKind: "executive" };
const context = { workspaceId: "w", goalId: "g", objectId: "o", packId: "p" };
function platformManifest(conditional = false): RuntimeStateContextBindingPlatformManifest {
  const integrationRequest = { consumerRole: "runtime" as const, direction: "runtime-to-director" as const,
    engineInput: { request: createRuntimeStateContextBindingRequest({ bindingId: "b", runtimeState: state,
      context: conditional ? { workspaceId: "w", goalId: "g" } : context,
      scope: conditional ? "object" : "pack" }) } };
  const completed = integrateRuntimeStateContextBinding(integrationRequest);
  const rejected = integrateRuntimeStateContextBinding({ ...integrationRequest,
    direction: "director-to-runtime" });
  const reports = [
    ["request", "integration-request", validateRuntimeStateContextBindingIntegrationRequest(integrationRequest)],
    ["completed", "completed-integration-outcome", validateRuntimeStateContextBindingIntegrationOutcome(completed)],
    ["rejected", "rejected-integration-outcome", validateRuntimeStateContextBindingIntegrationOutcome(rejected)],
    ["registry", "integration-registry", validateRuntimeStateContextBindingIntegrationRegistry(
      runtimeStateContextBindingIntegrationRegistry)],
    ["descriptor", "integration-descriptor", validateRuntimeStateContextBindingIntegrationDescriptor(
      directorRuntimeStateContextBindingIntegration)],
    ["api", "integration-public-api-surface", validateRuntimeStateContextBinding({
      kind: "integration-public-api-surface", value: runtimeStateContextBindingIntegrationPublicApiSurface })],
  ] as const;
  const certification = certifyRuntimeStateContextBinding({ certificationId: "platform-cert",
    evidence: reports.map(([id, evidenceKind, validationReport]) =>
      createRuntimeStateContextBindingCertificationEvidence({ evidenceId: id, evidenceKind,
        validationReport })) });
  const publication = publishRuntimeStateContextBindingPlatform({ platformId: "platform-1", certification });
  if (!("manifest" in publication)) throw new Error("test fixture platform was not published");
  return publication.manifest;
}
function declaration(platform = platformManifest(), overrides: Partial<RuntimeStateContextBindingAdapterDeclaration> = {}) {
  return Object.freeze({ adapterId: "adapter-1", adapterName: "Candidate Adapter", adapterVersion: "1.0.0",
    adapterKind: "inspection" as const, consumerCategory: "adapter-certification" as const,
    targetPlatformIdentity: platform.platformIdentity, targetPlatformVersion: platform.platformVersion,
    declaredCapabilities: capabilities, preservedGuarantees: platform.approvedGuarantees,
    satisfiedRequirements: platform.platformRequirements.map(({ id }) => id),
    declaredBehaviors: approvedBehaviors, ...overrides });
}
function passingEvidence(adapterId = "adapter-1") {
  return Object.freeze(evidenceKinds.map((evidenceKind) => createRuntimeStateContextBindingAdapterEvidence({
    evidenceId: `e-${evidenceKind}`, adapterId, evidenceKind, claimId: `claim-${evidenceKind}`,
    result: "passed", details: "declarative evidence passed",
  })));
}
function request(platform = platformManifest(), adapter = declaration(platform),
  evidence: readonly RuntimeStateContextBindingAdapterEvidence[] = passingEvidence()):
  RuntimeStateContextBindingAdapterCertificationRequest {
  return Object.freeze({ certificationId: "adapter-certification-caller", platform, adapter, evidence });
}

test("publishes exact identity and sole Platform dependency", () => {
  assert.equal(adapterCertification.identity,
    "DRI-2:8/DirectorRuntimeStateContextBindingAdapterCertification");
  assert.equal(adapterCertification.version, "2.8.0");
  assert.equal(adapterCertification.namespace,
    "nexora.dri.runtime.state-context-binding.adapter-certification");
  assert.equal(adapterCertification.stage, "AdapterCertification");
  assert.equal(adapterCertification.immediateDependency,
    "DRI-2:7/DirectorRuntimeStateContextBindingPlatform");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingAdapterCertification.ts",
    import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], ["@/app/lib/dri/directorRuntimeStateContextBindingPlatform"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBinding(?:Certification|Validation|Integration|Engine|Contracts|Foundation)|directorRuntimeIntegration/);
});

test("propagates the Platform-approved runtime surface by strict identity", () => {
  const names = [
    "createRuntimeStateContextBindingRequest", "executeRuntimeStateContextBindingEngine",
    "createRuntimeStateContextBindingIntegrationRequest", "integrateRuntimeStateContextBinding",
    "inspectRuntimeStateContextBindingIntegrationOutcome",
    "isBoundRuntimeStateContextBindingResult", "validateRuntimeStateContextBinding",
  ] as const;
  for (const name of names) assert.equal(adapterRuntime[name], platformRuntime[name], name);
  assert.deepEqual(adapterRuntime.runtimeStateContextBindingApprovedRuntimeApiSurface.map(({ name }) => name),
    names);
  assert.equal(new Set(names).size, names.length);
  assert.equal(new Set(adapterRuntime.runtimeStateContextBindingApprovedRuntimeTypeSurface).size,
    adapterRuntime.runtimeStateContextBindingApprovedRuntimeTypeSurface.length);
  assert.deepEqual(new Set(adapterRuntime.runtimeStateContextBindingApprovedRuntimeApiSurface
    .map(({ category }) => category)), new Set([
    "request-construction", "engine-execution", "integration", "inspection", "predicate", "validation",
  ]));
  assert.equal(Object.isFrozen(adapterRuntime.runtimeStateContextBindingApprovedRuntimeApiSurface), true);
  assert.equal(adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface.apiCount,
    adapterRuntime.runtimeStateContextBindingApprovedRuntimeApiSurface.length);
  assert.equal(adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface.typeCount,
    adapterRuntime.runtimeStateContextBindingApprovedRuntimeTypeSurface.length);
  assert.equal(adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface.identityPreserved, true);
  assert.equal(adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface.readiness,
    "ApprovedRuntimeSurfaceReadyForPublicIndex");
  assert.deepEqual(JSON.parse(JSON.stringify(
    adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface)),
  adapterRuntime.directorRuntimeStateContextBindingApprovedRuntimeSurface);
  assert.notEqual(adapterRuntime.runtimeStateContextBindingAdapterCertificationPublicApiSurface,
    adapterRuntime.runtimeStateContextBindingApprovedRuntimeApiSurface);
});

test("publishes stable unique vocabularies, requirements, and phases", () => {
  for (const values of [adapterKinds, capabilities, approvedBehaviors, prohibitedBehaviors,
    evidenceKinds, evidenceResults, compatibilityStates, statuses, decisions, eligibilityValues,
    categories, severities, phases, adapterGuarantees])
    assert.equal(new Set(values).size, values.length);
  assert.equal(new Set(requirements.map(({ id }) => id)).size, requirements.length);
  assert.equal(phases.length, 11);
});

test("complete declaration and passing evidence certify caller identities", () => {
  const record = certifyRuntimeStateContextBindingAdapter(request());
  assert.equal(record.certificationIdentity, "adapter-certification-caller");
  assert.equal(record.adapterIdentity, "adapter-1");
  assert.equal(record.status, "certified");
  assert.equal(record.decision, "approve");
  assert.equal(record.compatibility, "compatible");
  assert.equal(record.summary.blockingFindingCount, 0);
  assert.equal(isRuntimeStateContextBindingAdapterCertified(record), true);
  assert.deepEqual(record.adapterCertificationGuarantees, adapterGuarantees);
});

test("published, conditional, and blocked platforms resolve eligibility safely", () => {
  assert.equal(evaluateRuntimeStateContextBindingAdapterEligibility(request()).eligibility, "eligible");
  const conditional = platformManifest(true);
  assert.equal(evaluateRuntimeStateContextBindingAdapterEligibility(
    request(conditional, declaration(conditional))).eligibility, "conditionally-eligible");
  const blocked = { ...platformManifest(), platformStatus: "rejected", platformReadiness: "Blocked" } as
    unknown as RuntimeStateContextBindingPlatformManifest;
  const blockedRequest = request(blocked, declaration(blocked));
  assert.equal(evaluateRuntimeStateContextBindingAdapterEligibility(blockedRequest).eligibility,
    "ineligible");
  assert.equal(certifyRuntimeStateContextBindingAdapter(blockedRequest).status, "rejected");
});

test("platform identity, version, kind, capability, and consumer mismatches reject", () => {
  const base = platformManifest();
  const variants: Partial<RuntimeStateContextBindingAdapterDeclaration>[] = [
    { targetPlatformIdentity: "wrong" }, { targetPlatformVersion: "0" },
    { adapterKind: "unknown" as never },
    { declaredCapabilities: [...capabilities, "unknown"] as never },
    { consumerCategory: "unknown" as never },
  ];
  for (const variant of variants)
    assert.equal(certifyRuntimeStateContextBindingAdapter(
      request(base, declaration(base, variant))).status, "rejected");
});

test("requires complete Platform requirements and guarantees", () => {
  const platform = platformManifest();
  const missingRequirement = declaration(platform, {
    satisfiedRequirements: platform.platformRequirements.slice(1).map(({ id }) => id),
  });
  const missingGuarantee = declaration(platform, {
    preservedGuarantees: platform.approvedGuarantees.slice(1),
  });
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, missingRequirement)).status, "rejected");
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, missingGuarantee)).status, "rejected");
  const duplicate = declaration(platform, { satisfiedRequirements: [
    ...platform.platformRequirements.map(({ id }) => id), platform.platformRequirements[0]!.id,
  ] });
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, duplicate)).status, "certified-with-conditions");
});

test("preserves conditional Platform conditions in conditional certification", () => {
  const platform = platformManifest(true);
  const record = certifyRuntimeStateContextBindingAdapter(request(platform, declaration(platform)));
  assert.equal(record.status, "certified-with-conditions");
  assert.equal(record.decision, "approve-with-conditions");
  assert.ok(record.conditions.some((id) => id === platform.conditions[0]?.conditionId));
  assert.equal(isRuntimeStateContextBindingAdapterCertifiedWithConditions(record), true);
});

test("every prohibited behavior causes blocking rejection", () => {
  const platform = platformManifest();
  for (const behavior of prohibitedBehaviors) {
    const adapter = declaration(platform, { declaredBehaviors: [...approvedBehaviors,
      behavior as RuntimeStateContextBindingAdapterBehavior] });
    const record = certifyRuntimeStateContextBindingAdapter(request(platform, adapter));
    assert.equal(record.status, "rejected", behavior);
    assert.ok(record.findings.some(({ blocking }) => blocking));
  }
});

test("handles missing, failed, conditional, duplicate, conflicting, and mismatched evidence", () => {
  const platform = platformManifest();
  assert.equal(certifyRuntimeStateContextBindingAdapter(request(platform, declaration(platform),
    passingEvidence().slice(1))).status, "rejected");
  const failed = [...passingEvidence()]; failed[0] = { ...failed[0]!, result: "failed" };
  assert.equal(certifyRuntimeStateContextBindingAdapter(request(platform, declaration(platform), failed)).status,
    "rejected");
  const conditional = [...passingEvidence()]; conditional[0] = { ...conditional[0]!, result: "conditional" };
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, declaration(platform), conditional)).status, "certified-with-conditions");
  const duplicate = [...passingEvidence(), passingEvidence()[0]!];
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, declaration(platform), duplicate)).status, "certified-with-conditions");
  const conflict = [...passingEvidence(), { ...passingEvidence()[0]!, result: "failed" as const }];
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, declaration(platform), conflict)).status, "rejected");
  const mismatch = passingEvidence("other-adapter");
  assert.equal(certifyRuntimeStateContextBindingAdapter(
    request(platform, declaration(platform), mismatch)).status, "rejected");
});

test("filters certified capabilities, guarantees, and requirements to approved claims", () => {
  const platform = platformManifest();
  const record = certifyRuntimeStateContextBindingAdapter(request(platform, declaration(platform)));
  assert.deepEqual(record.certifiedCapabilities, capabilities);
  assert.deepEqual(record.preservedGuarantees, platform.approvedGuarantees);
  assert.deepEqual(record.satisfiedPlatformRequirements,
    platform.platformRequirements.map(({ id }) => id));
  assert.equal(record.summary.preservedGuaranteeCount, platform.approvedGuarantees.length);
  assert.equal(record.summary.satisfiedPlatformRequirementCount,
    platform.platformRequirements.length);
  assert.equal(record.summary.totalRequirements, requirements.length);
  assert.equal(record.summary.totalEvidence, evidenceKinds.length);
});

test("is deterministic, immutable, JSON-safe, non-mutating, and inspectable", () => {
  const source = request(); const before = JSON.stringify(source);
  const one = certifyRuntimeStateContextBindingAdapter(source);
  certifyRuntimeStateContextBindingAdapter(request(platformManifest(), declaration(platformManifest(), {
    adapterId: "unrelated" }), passingEvidence("unrelated")));
  const two = certifyRuntimeStateContextBindingAdapter(source);
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.findings), true);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  assert.equal(inspectRuntimeStateContextBindingAdapterCertification(one).adapterIdentity, "adapter-1");
  assert.equal(isRuntimeStateContextBindingAdapterCertificationRejected(one), false);
  const hasFunction = (value: unknown): boolean => typeof value === "function" ||
    (value !== null && typeof value === "object" && Object.values(value).some(hasFunction));
  assert.equal(hasFunction(one), false);
});

test("registry, APIs, descriptor, and prohibited architecture remain clean", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.adapterKindCount, registry.adapterKinds], [registry.adapterCapabilityCount, registry.adapterCapabilities],
    [registry.approvedBehaviorCount, registry.approvedBehaviors],
    [registry.prohibitedBehaviorCount, registry.prohibitedBehaviors],
    [registry.evidenceKindCount, registry.evidenceKinds], [registry.evidenceResultCount, registry.evidenceResults],
    [registry.compatibilityStateCount, registry.compatibilityStates],
    [registry.certificationStatusCount, registry.certificationStatuses],
    [registry.certificationDecisionCount, registry.certificationDecisions],
    [registry.requirementCategoryCount, registry.requirementCategories],
    [registry.findingSeverityCount, registry.findingSeverities],
    [registry.evaluationPhaseCount, registry.evaluationPhases], [registry.requirementCount, registry.requirements],
    [registry.certificationGuaranteeCount, registry.certificationGuarantees],
    [registry.contractTypeCount, registry.contractTypes], [registry.functionalApiCount, registry.functionalApis],
    [registry.predicateCount, registry.predicates], [registry.publicApiCount, registry.publicApiSurface],
    [registry.adapterCertificationApiCount, registry.adapterCertificationApiSurface],
    [registry.approvedRuntimeApiCount, registry.approvedRuntimeApiSurface],
    [registry.approvedRuntimeTypeCount, registry.approvedRuntimeTypeSurface],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.deepEqual(runtimeStateContextBindingAdapterCertificationPublicApiSurface,
    [...runtimeStateContextBindingAdapterCertificationApiNames,
      ...runtimeStateContextBindingAdapterCertificationPredicateNames]);
  assert.equal(adapterCertification.registry, registry);
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingAdapterCertification.ts",
    import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|registerAdapter|activateAdapter|installAdapter|enableAdapter|setActiveAdapter)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|subscribe|listener|callback|async|Promise|setTimeout|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /ReadyForConsumer|SoleConsumerEntryPoint|DRI-2-RUNTIME-STATE-CONTEXT-BINDING-LOCKED/);
});
