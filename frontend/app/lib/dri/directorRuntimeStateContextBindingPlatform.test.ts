import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
} from "./directorRuntimeStateContextBindingValidation.ts";
import {
  certifyRuntimeStateContextBinding,
  createRuntimeStateContextBindingCertificationEvidence,
  type RuntimeStateContextBindingCertificationRecord,
} from "./directorRuntimeStateContextBindingCertification.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CHARACTERISTICS as characteristics,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES as consumerCategories,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES as eligibilityValues,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_GUARANTEE_IDS as guaranteeIds,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_PUBLICATION_PHASES as publicationPhases,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES as readinessValues,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_REQUIREMENT_IDS as requirementIds,
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES as platformStatuses,
  createRuntimeStateContextBindingPlatformManifest,
  directorRuntimeStateContextBindingPlatform as platform,
  evaluateRuntimeStateContextBindingPlatformEligibility,
  inspectRuntimeStateContextBindingPlatform,
  isRuntimeStateContextBindingPlatformPublished,
  isRuntimeStateContextBindingPlatformPublishedWithConditions,
  isRuntimeStateContextBindingPlatformReadyForAdapterCertification,
  isRuntimeStateContextBindingPlatformRejected,
  publishRuntimeStateContextBindingPlatform,
  runtimeStateContextBindingPlatformApiNames,
  runtimeStateContextBindingPlatformCompatibility as compatibility,
  runtimeStateContextBindingPlatformCompatibilityEntryNames,
  runtimeStateContextBindingPlatformPredicateNames,
  runtimeStateContextBindingPlatformPublicApiSurface,
  runtimeStateContextBindingPlatformRegistry as registry,
  runtimeStateContextBindingPlatformRequirements as requirements,
} from "./directorRuntimeStateContextBindingPlatform.ts";

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
function certificationRecord(completedOverrides: Record<string, unknown> = {}, invalidRequest = false) {
  const request = integrationRequest();
  const completed = integrateRuntimeStateContextBinding(integrationRequest(completedOverrides));
  const rejected = integrateRuntimeStateContextBinding({ ...request, direction: "director-to-runtime" });
  const requestReport = validateRuntimeStateContextBindingIntegrationRequest(invalidRequest ?
    { ...request, consumerRole: "bad" } as unknown as RuntimeStateContextBindingIntegrationRequest : request);
  const reports = [
    ["request", "integration-request", requestReport],
    ["completed", "completed-integration-outcome",
      validateRuntimeStateContextBindingIntegrationOutcome(completed)],
    ["rejected", "rejected-integration-outcome",
      validateRuntimeStateContextBindingIntegrationOutcome(rejected)],
    ["registry", "integration-registry",
      validateRuntimeStateContextBindingIntegrationRegistry(runtimeStateContextBindingIntegrationRegistry)],
    ["descriptor", "integration-descriptor",
      validateRuntimeStateContextBindingIntegrationDescriptor(directorRuntimeStateContextBindingIntegration)],
    ["api", "integration-public-api-surface", validateRuntimeStateContextBinding({
      kind: "integration-public-api-surface", value: runtimeStateContextBindingIntegrationPublicApiSurface,
    })],
  ] as const;
  return certifyRuntimeStateContextBinding(Object.freeze({
    certificationId: "certification-1",
    evidence: Object.freeze(reports.map(([id, evidenceKind, validationReport]) =>
      createRuntimeStateContextBindingCertificationEvidence({
        evidenceId: `e-${id}`, evidenceKind, validationReport,
      }))),
  }));
}
const input = (certification: RuntimeStateContextBindingCertificationRecord = certificationRecord()) =>
  Object.freeze({ platformId: "platform-caller-1", certification });

test("publishes exact platform metadata and sole Certification dependency", () => {
  assert.equal(platform.identity, "DRI-2:7/DirectorRuntimeStateContextBindingPlatform");
  assert.equal(platform.version, "2.7.0");
  assert.equal(platform.namespace, "nexora.dri.runtime.state-context-binding.platform");
  assert.equal(platform.stage, "Platform");
  assert.equal(platform.immediateDependency, "DRI-2:6/DirectorRuntimeStateContextBindingCertification");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingPlatform.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingCertification"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBinding(?:Validation|Integration|Engine|Contracts|Foundation)|directorRuntimeIntegration/);
});

test("publishes stable unique platform vocabularies", () => {
  assert.deepEqual(platformStatuses,
    ["unavailable", "eligible", "published", "published-with-conditions", "rejected"]);
  assert.deepEqual(readinessValues,
    ["NotReady", "ReadyForAdapterCertification", "ReadyWithConditions", "Blocked"]);
  assert.deepEqual(eligibilityValues, ["eligible", "conditionally-eligible", "ineligible"]);
  assert.deepEqual(consumerCategories,
    ["adapter-certification", "freeze", "public-index-preparation", "architectural-inspection"]);
  for (const values of [platformStatuses, readinessValues, eligibilityValues, consumerCategories,
    publicationPhases, characteristics, guaranteeIds, requirementIds])
    assert.equal(new Set(values).size, values.length);
});

test("maps certification decisions to platform eligibility", () => {
  assert.equal(evaluateRuntimeStateContextBindingPlatformEligibility(input()).status, "eligible");
  const conditional = certificationRecord({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  });
  assert.equal(evaluateRuntimeStateContextBindingPlatformEligibility(input(conditional)).status,
    "conditionally-eligible");
  assert.equal(evaluateRuntimeStateContextBindingPlatformEligibility(
    input(certificationRecord({}, true))).status, "ineligible");
});

test("publishes approved and conditional manifests and rejects failed certification", () => {
  const published = publishRuntimeStateContextBindingPlatform(input());
  assert.equal(published.status, "published");
  assert.equal(published.readiness, "ReadyForAdapterCertification");
  assert.equal("manifest" in published, true);
  assert.deepEqual(published.blockingReasons, []);

  const conditionalCertification = certificationRecord({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  });
  const conditional = publishRuntimeStateContextBindingPlatform(input(conditionalCertification));
  assert.equal(conditional.status, "published-with-conditions");
  assert.equal(conditional.readiness, "ReadyWithConditions");
  assert.ok("manifest" in conditional && conditional.manifest.conditions.length > 0);

  const rejected = publishRuntimeStateContextBindingPlatform(input(certificationRecord({}, true)));
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.readiness, "Blocked");
  assert.equal("manifest" in rejected, false);
  assert.ok(rejected.blockingReasons.length > 0);
  assert.equal(createRuntimeStateContextBindingPlatformManifest(
    input(certificationRecord({}, true))), null);
});

test("preserves caller platform identity and authentic certification facts", () => {
  const certification = certificationRecord();
  const result = publishRuntimeStateContextBindingPlatform(input(certification));
  if (!isRuntimeStateContextBindingPlatformPublished(result)) return assert.fail("not published");
  assert.equal(result.manifest.platformIdentity, "platform-caller-1");
  assert.equal(result.manifest.certification, certification);
  assert.equal(result.manifest.certificationIdentity, certification.certificationIdentity);
  assert.equal(result.manifest.certificationStatus, certification.status);
  assert.equal(result.manifest.certificationDecision, certification.decision);
  assert.equal(result.manifest.certification.findings, certification.findings);
});

test("projects only supported certification guarantees in stable order", () => {
  const certification = certificationRecord();
  const result = publishRuntimeStateContextBindingPlatform(input(certification));
  if (!isRuntimeStateContextBindingPlatformPublished(result)) return assert.fail("not published");
  assert.deepEqual(result.manifest.approvedGuarantees, guaranteeIds);
  const altered = { ...certification,
    certificationGuarantees: [...certification.certificationGuarantees, "unsupported-guarantee"] } as
    unknown as RuntimeStateContextBindingCertificationRecord;
  const alteredResult = publishRuntimeStateContextBindingPlatform(input(altered));
  assert.ok("manifest" in alteredResult);
  if ("manifest" in alteredResult)
    assert.equal(alteredResult.manifest.approvedGuarantees.includes("unsupported-guarantee"), false);
});

test("preserves certification conditions without rewriting", () => {
  const certification = certificationRecord({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  });
  const result = publishRuntimeStateContextBindingPlatform(input(certification));
  if (!isRuntimeStateContextBindingPlatformPublishedWithConditions(result))
    return assert.fail("not conditionally published");
  const finding = certification.findings.find(({ severity }) => severity === "condition")!;
  assert.deepEqual(result.manifest.conditions[0], {
    conditionId: `platform-condition:${finding.findingId}`,
    sourceCertificationFindingId: finding.findingId,
    requirementId: finding.requirementId,
    description: finding.message,
    blocking: false,
  });
});

test("publishes stable requirements and compatibility metadata", () => {
  assert.deepEqual(requirements.map(({ id }) => id), requirementIds);
  assert.deepEqual(compatibility.supportedBindingScopes,
    ["global", "workspace", "goal", "object", "pack"]);
  assert.deepEqual(compatibility.supportedBindingStatuses,
    ["unbound", "partial", "bound", "invalid"]);
  assert.deepEqual(compatibility.supportedCompatibilityStates,
    ["compatible", "incomplete", "incompatible"]);
  assert.equal(runtimeStateContextBindingPlatformCompatibilityEntryNames.length, 8);
  assert.equal(consumerCategories.includes("public-index-preparation"), true);
  assert.equal(consumerCategories.includes("SoleConsumerEntryPoint" as never), false);
});

test("predicates and inspection expose publication readiness safely", () => {
  const published = publishRuntimeStateContextBindingPlatform(input());
  const conditional = publishRuntimeStateContextBindingPlatform(input(certificationRecord({
    scope: "object", context: { workspaceId: "w" },
  })));
  const rejected = publishRuntimeStateContextBindingPlatform(input(certificationRecord({}, true)));
  assert.equal(isRuntimeStateContextBindingPlatformPublished(published), true);
  assert.equal(isRuntimeStateContextBindingPlatformPublishedWithConditions(conditional), true);
  assert.equal(isRuntimeStateContextBindingPlatformRejected(rejected), true);
  assert.equal(isRuntimeStateContextBindingPlatformReadyForAdapterCertification(published), true);
  assert.equal(inspectRuntimeStateContextBindingPlatform(published).platformIdentity,
    "platform-caller-1");
  assert.equal(inspectRuntimeStateContextBindingPlatform(rejected).platformIdentity, null);
});

test("is deterministic, stateless, immutable, JSON-safe, and source non-mutating", () => {
  const source = input();
  const before = JSON.stringify(source);
  const one = publishRuntimeStateContextBindingPlatform(source);
  publishRuntimeStateContextBindingPlatform(input(certificationRecord({}, true)));
  const two = publishRuntimeStateContextBindingPlatform(source);
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(one), true);
  if ("manifest" in one) {
    assert.equal(Object.isFrozen(one.manifest), true);
    assert.equal(Object.isFrozen(one.manifest.approvedGuarantees), true);
    assert.equal(Object.isFrozen(one.manifest.conditions), true);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  const containsFunction = (value: unknown): boolean => typeof value === "function" ||
    (value !== null && typeof value === "object" && Object.values(value)
      .some((entry) => containsFunction(entry)));
  assert.equal(containsFunction(one), false);
});

test("registry dynamic counts, public API, and descriptor are consistent", () => {
  const countPairs: readonly [number, readonly unknown[]][] = [
    [registry.contractTypeCount, registry.contractTypes], [registry.statusCount, registry.statuses],
    [registry.readinessValueCount, registry.readinessValues],
    [registry.eligibilityValueCount, registry.eligibilityValues],
    [registry.consumerCategoryCount, registry.consumerCategories],
    [registry.publicationPhaseCount, registry.publicationPhases],
    [registry.characteristicCount, registry.characteristics],
    [registry.guaranteeCount, registry.guarantees], [registry.requirementCount, registry.requirements],
    [registry.compatibilityEntryCount, registry.compatibilityEntries],
    [registry.functionalApiCount, registry.functionalApis],
    [registry.predicateCount, registry.predicates], [registry.publicApiCount, registry.publicApiSurface],
  ];
  for (const [count, values] of countPairs) assert.equal(count, values.length);
  assert.deepEqual(runtimeStateContextBindingPlatformPublicApiSurface,
    [...runtimeStateContextBindingPlatformApiNames, ...runtimeStateContextBindingPlatformPredicateNames]);
  assert.equal(new Set(runtimeStateContextBindingPlatformPublicApiSurface).size,
    runtimeStateContextBindingPlatformPublicApiSurface.length);
  assert.equal(platform.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(platform), true);
});

test("contains no adapters, lock, release, state, synchronization, events, I/O, UI, or execution", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingPlatform.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|cache|singleton|history)\b/);
  assert.doesNotMatch(source, /DRI-2-RUNTIME-STATE-CONTEXT-BINDING-LOCKED|ReadyForConsumer|SoleConsumerEntryPoint/);
  assert.doesNotMatch(runtimeStateContextBindingPlatformPublicApiSurface.join(" "),
    /createAdapter|executeAdapter|freezePlatform|publicIndex|lockPlatform|releasePlatform/i);
  assert.doesNotMatch(source, /\b(?:applyBinding|activateBinding|synchronizeState|pushStateToDirector|pullStateFromRuntime|commitBinding)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|subscribe|listener|callback|async|Promise|setTimeout|setInterval|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:camera|animation|rendering|executeDirector|dispatchCommand|scene composition)\b/i);
});
