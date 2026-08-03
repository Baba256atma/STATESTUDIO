/** EX-2:6 metadata-only Platform verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperiencePlatform,
  ExecutiveJournalExperiencePlatformAccessClassificationValues,
  ExecutiveJournalExperiencePlatformApprovedAliases,
  ExecutiveJournalExperiencePlatformAuthorization,
  ExecutiveJournalExperiencePlatformAvailabilityValues,
  ExecutiveJournalExperiencePlatformBindingKinds,
  ExecutiveJournalExperiencePlatformBindingStatusValues,
  ExecutiveJournalExperiencePlatformBoundaries,
  ExecutiveJournalExperiencePlatformCanonicalEligibility,
  ExecutiveJournalExperiencePlatformCanonicalInput,
  ExecutiveJournalExperiencePlatformCapabilityBindings,
  ExecutiveJournalExperiencePlatformConsumerBindingFields,
  ExecutiveJournalExperiencePlatformContracts,
  ExecutiveJournalExperiencePlatformDecisions,
  ExecutiveJournalExperiencePlatformDependencyDeclaration,
  ExecutiveJournalExperiencePlatformEligibilityValues,
  ExecutiveJournalExperiencePlatformExposureStatusValues,
  ExecutiveJournalExperiencePlatformId,
  ExecutiveJournalExperiencePlatformIdentity,
  ExecutiveJournalExperiencePlatformIntegrityStatusValues,
  ExecutiveJournalExperiencePlatformIsolationValues,
  ExecutiveJournalExperiencePlatformLifecycle,
  ExecutiveJournalExperiencePlatformLifecycleStates,
  ExecutiveJournalExperiencePlatformManifestBinding,
  ExecutiveJournalExperiencePlatformNamespace,
  ExecutiveJournalExperiencePlatformNonCapabilityEnforcement,
  ExecutiveJournalExperiencePlatformProviderModeValues,
  ExecutiveJournalExperiencePlatformProviderSourceBoundaries,
  ExecutiveJournalExperiencePlatformReadiness,
  ExecutiveJournalExperiencePlatformReadinessConditions,
  ExecutiveJournalExperiencePlatformReasonCodes,
  ExecutiveJournalExperiencePlatformSourceClassificationValues,
  ExecutiveJournalExperiencePlatformStatus,
  ExecutiveJournalExperiencePlatformSummaryValue,
  ExecutiveJournalExperiencePlatformUpstream,
  assertExecutiveJournalExperiencePlatformIdentity,
  assertExecutiveJournalExperiencePlatformLifecycleTransition,
  canTransitionExecutiveJournalExperiencePlatformLifecycle,
  createExecutiveJournalExperiencePlatformConsumerBinding,
  evaluateExecutiveJournalExperiencePlatformEligibility,
  getExecutiveJournalExperiencePlatformSummary,
  isExecutiveJournalExperiencePlatformAccessClassification,
  isExecutiveJournalExperiencePlatformBindingKind,
  isExecutiveJournalExperiencePlatformLifecycleState,
  isExecutiveJournalExperiencePlatformProviderMode,
  isExecutiveJournalExperiencePlatformReasonCode,
  isExecutiveJournalExperiencePlatformSourceClassification,
  resolveExecutiveJournalExperiencePlatformIdentity,
} from "./executiveJournalExperiencePlatform.ts";
import { ExecutiveJournalExperienceManifest } from "./executiveJournalExperienceManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveJournalExperiencePlatform.ts",
  "executiveJournalExperiencePlatformTypes.ts",
  "executiveJournalExperiencePlatformIdentity.ts",
  "executiveJournalExperiencePlatformLifecycle.ts",
  "executiveJournalExperiencePlatformContracts.ts",
  "executiveJournalExperiencePlatformBindings.ts",
  "executiveJournalExperiencePlatformMetadata.ts",
  "executiveJournalExperiencePlatform.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-2:6 package and dependency boundary", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveJournalExperiencePlatform(?:[A-Z].*)?(?:\.test)?\.ts$/.test(name),
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Manifest as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(join(HERE, "executiveJournalExperiencePlatform.ts"), "utf8");
    const upstreamImports = [...aggregate.matchAll(/from "(\.\/executiveJournalExperience[^"]+)"/g)]
      .map((match) => match[1])
      .filter((path) => !path.includes("Platform"));
    assert.deepEqual(upstreamImports, ["./executiveJournalExperienceManifest.ts"]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(source, /import\([^)]|require\s*\(|from ["'][^"']*(Validation|Model|Registry|Foundation|rtc|react|next)/i);
      assert.doesNotMatch(source, /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/);
    }
  });

  it("creates no route, provider, or adapter from Platform", () => {
    assert.equal(ExecutiveJournalExperiencePlatform.ex27Created, false);
    assert.equal(ExecutiveJournalExperiencePlatform.ex27Authorized, false);
    assert.equal(ExecutiveJournalExperiencePlatform.providerExecution, false);
  });
});

describe("EX-2:6 identity", () => {
  it("publishes exact identity and readiness", () => {
    assert.equal(ExecutiveJournalExperiencePlatformId, "EX-2:6/ExecutiveJournalExperiencePlatform");
    assert.equal(ExecutiveJournalExperiencePlatformNamespace, "nexora.ex.executive.journal.experience.platform");
    assert.equal(ExecutiveJournalExperiencePlatformStatus, "Platform");
    assert.equal(ExecutiveJournalExperiencePlatformReadiness, "ReadyForCertification");
    assert.equal(ExecutiveJournalExperiencePlatformIdentity.authorizationDecisionId, "AD-EX2-14");
    assert.equal(ExecutiveJournalExperiencePlatformIdentity.readyForCertificationAuthorizesEx27, false);
  });

  for (const value of [
    ExecutiveJournalExperiencePlatformId,
    ExecutiveJournalExperiencePlatformNamespace,
    ...ExecutiveJournalExperiencePlatformApprovedAliases,
  ]) {
    it(`resolves approved identity ${value}`, () => {
      assert.equal(resolveExecutiveJournalExperiencePlatformIdentity(value).ok, true);
      assert.equal(assertExecutiveJournalExperiencePlatformIdentity(value), ExecutiveJournalExperiencePlatformId);
    });
  }

  for (const value of [null, "", " EX-2:6", "ex-2:6", "EX-2:7", "RTC-2:9", "ExecutiveJournalExperiencePlatfor"]) {
    it(`rejects identity ${String(value)}`, () => {
      assert.equal(resolveExecutiveJournalExperiencePlatformIdentity(value).ok, false);
      assert.throws(() => assertExecutiveJournalExperiencePlatformIdentity(value));
    });
  }
});

describe("closed vocabularies", () => {
  const catalogues = [
    ExecutiveJournalExperiencePlatformEligibilityValues,
    ExecutiveJournalExperiencePlatformBindingStatusValues,
    ExecutiveJournalExperiencePlatformExposureStatusValues,
    ExecutiveJournalExperiencePlatformAvailabilityValues,
    ExecutiveJournalExperiencePlatformIsolationValues,
    ExecutiveJournalExperiencePlatformProviderModeValues,
    ExecutiveJournalExperiencePlatformAccessClassificationValues,
    ExecutiveJournalExperiencePlatformSourceClassificationValues,
    ExecutiveJournalExperiencePlatformIntegrityStatusValues,
    ExecutiveJournalExperiencePlatformReasonCodes,
    ExecutiveJournalExperiencePlatformBindingKinds,
    ExecutiveJournalExperiencePlatformLifecycleStates,
  ];
  catalogues.forEach((catalogue, index) => {
    it(`freezes and uniquely orders catalogue ${index + 1}`, () => {
      assert.equal(Object.isFrozen(catalogue), true);
      assert.equal(new Set(catalogue).size, catalogue.length);
    });
  });
  it("guards exact values without normalization", () => {
    assert.equal(isExecutiveJournalExperiencePlatformReasonCode("ManifestMissing"), true);
    assert.equal(isExecutiveJournalExperiencePlatformReasonCode(" manifestmissing"), false);
    assert.equal(isExecutiveJournalExperiencePlatformBindingKind("ManifestBinding"), true);
    assert.equal(isExecutiveJournalExperiencePlatformBindingKind("manifestBinding"), false);
    assert.equal(isExecutiveJournalExperiencePlatformProviderMode("NoProvider"), true);
    assert.equal(isExecutiveJournalExperiencePlatformProviderMode("No Provider"), false);
    assert.equal(isExecutiveJournalExperiencePlatformAccessClassification("MetadataOnlyAccess"), true);
    assert.equal(isExecutiveJournalExperiencePlatformAccessClassification("ProductionAccess"), false);
    assert.equal(isExecutiveJournalExperiencePlatformSourceClassification("SyntheticEvidenceReferenceOnly"), true);
    assert.equal(isExecutiveJournalExperiencePlatformSourceClassification("RealRtc2Source"), false);
  });
});

describe("exact Manifest binding and eligibility", () => {
  it("binds exact eligible, sealed, ReadyForPlatform Manifest references", () => {
    assert.equal(ExecutiveJournalExperiencePlatformManifestBinding.manifest, ExecutiveJournalExperienceManifest);
    assert.equal(ExecutiveJournalExperiencePlatformManifestBinding.manifestEligibility, ExecutiveJournalExperienceManifest.canonicalEligibility);
    assert.equal(ExecutiveJournalExperiencePlatformManifestBinding.manifestLifecycle.currentState, "ReadyForPlatform");
    assert.equal(ExecutiveJournalExperiencePlatformCanonicalEligibility.eligibility, "Eligible");
  });

  const cases = [
    ["ManifestMissing", { manifest: null }],
    ["ManifestCloned", { manifest: { ...ExecutiveJournalExperienceManifest } }],
    ["ManifestIneligible", { manifestEligibility: Object.freeze({ eligibility: "Ineligible" }) }],
    ["ManifestStale", { manifestCurrent: false }],
    ["ManifestIdentityMismatch", { manifestIdentity: "EX-2:4/ExecutiveJournalExperienceValidation" }],
    ["ManifestReadinessMismatch", { manifestReadiness: "ReadyForCertification" }],
    ["CapabilityCatalogueMismatch", { capabilities: [...ExecutiveJournalExperienceManifest.capabilities] }],
    ["NonCapabilityCatalogueMismatch", { nonCapabilities: [...ExecutiveJournalExperienceManifest.nonCapabilities] }],
    ["PrerequisiteCatalogueMismatch", { platformPrerequisites: [...ExecutiveJournalExperienceManifest.platformPrerequisites] }],
    ["UpstreamReferenceMismatch", { upstream: { ...ExecutiveJournalExperienceManifest.upstream } }],
    ["PlatformAuthorizationMissing", { platformAuthorization: null }],
    ["PlatformContractUnsealed", { contractsSealed: false }],
  ] as const;
  for (const [code, patch] of cases) {
    it(`fails closed with ${code}`, () => {
      const input = { ...ExecutiveJournalExperiencePlatformCanonicalInput, ...patch };
      const before = JSON.stringify(input);
      const evaluated = evaluateExecutiveJournalExperiencePlatformEligibility(input);
      assert.equal(evaluated.eligible, false);
      assert.equal(evaluated.reasons.some((reason) => reason.code === code), true);
      assert.equal(JSON.stringify(input), before);
      assert.equal(Object.isFrozen(evaluated), true);
      assert.equal(Object.isFrozen(evaluated.reasons), true);
    });
  }

  it("uses deterministic reason precedence without duplicates or payload echo", () => {
    const input = { ...ExecutiveJournalExperiencePlatformCanonicalInput, manifest: null, manifestCurrent: false, contractsSealed: false };
    const a = evaluateExecutiveJournalExperiencePlatformEligibility(input);
    const b = evaluateExecutiveJournalExperiencePlatformEligibility(input);
    assert.deepEqual(a, b);
    assert.deepEqual(a.reasons.map((reason) => reason.code), ["ManifestMissing", "ManifestStale", "PlatformContractUnsealed"]);
    assert.equal(new Set(a.reasons.map((reason) => reason.code)).size, a.reasonCount);
    assert.equal(a.reasons.every((reason) => reason.echoesInput === false), true);
  });

  it("ordinary malformed input does not throw", () => {
    for (const value of [undefined, null, 0, "", [], true]) {
      assert.doesNotThrow(() => evaluateExecutiveJournalExperiencePlatformEligibility(value));
      assert.equal(evaluateExecutiveJournalExperiencePlatformEligibility(value).eligible, false);
    }
  });
});

describe("capability and non-capability bindings", () => {
  it("is complete, ordered, immutable, and exact by reference", () => {
    assert.equal(ExecutiveJournalExperiencePlatformCapabilityBindings.length, 16);
    assert.equal(ExecutiveJournalExperiencePlatformNonCapabilityEnforcement.length, 19);
    assert.equal(Object.isFrozen(ExecutiveJournalExperiencePlatformCapabilityBindings), true);
    assert.equal(Object.isFrozen(ExecutiveJournalExperiencePlatformNonCapabilityEnforcement), true);
  });
  ExecutiveJournalExperiencePlatformCapabilityBindings.forEach((binding, index) => {
    it(`covers capability binding ${binding.bindingId}`, () => {
      assert.equal(binding.order, index + 1);
      assert.equal(binding.manifestCapability, ExecutiveJournalExperienceManifest.capabilities[index]);
      assert.equal(binding.exposure, "Exposed");
      assert.equal(binding.runtimeImplementation, false);
      assert.equal(binding.createsAuthority, false);
      assert.equal(binding.productionApplicable, false);
      assert.equal(Object.isFrozen(binding), true);
    });
  });
  ExecutiveJournalExperiencePlatformNonCapabilityEnforcement.forEach((entry, index) => {
    it(`covers prohibition ${entry.enforcementId}`, () => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.manifestNonCapability, ExecutiveJournalExperienceManifest.nonCapabilities[index]);
      assert.equal(entry.exposure, "Prohibited");
      assert.equal(entry.productionApplicable, false);
      assert.equal(Object.isFrozen(entry), true);
    });
  });
});

describe("provider, consumer, readiness, lifecycle, and contracts", () => {
  it("enforces provider and source prohibitions", () => {
    assert.equal(ExecutiveJournalExperiencePlatformProviderSourceBoundaries.providerMode, "NoProvider");
    assert.equal(ExecutiveJournalExperiencePlatformProviderSourceBoundaries.providerExecution, false);
    assert.equal(ExecutiveJournalExperiencePlatformProviderSourceBoundaries.dataFetching, false);
    assert.equal(ExecutiveJournalExperiencePlatformProviderSourceBoundaries.realRtc2Source, "RealRtc2SourceProhibited");
    assert.equal(ExecutiveJournalExperiencePlatformProviderSourceBoundaries.productionSource, "ProductionSourceProhibited");
  });

  it("publishes the exact closed ten-field consumer contract", () => {
    assert.equal(ExecutiveJournalExperiencePlatformConsumerBindingFields.length, 10);
    const valid = createExecutiveJournalExperiencePlatformConsumerBinding({
      consumerIdentity: "EX-2:6/AuthorizedMetadataConsumer",
      manifestIdentity: ExecutiveJournalExperienceManifest.identity.id,
      allowedCapabilityReferences: ExecutiveJournalExperienceManifest.capabilities,
      prohibitedCapabilityReferences: ExecutiveJournalExperienceManifest.nonCapabilities,
      accessClassification: "MetadataOnlyAccess",
      sourceClassification: "SyntheticEvidenceReferenceOnly",
      isolationRequirement: "MetadataOnlyIsolated",
      authorizationEvidence: "AD-EX2-14",
    });
    assert.notEqual(valid, null);
    assert.equal(Object.isFrozen(valid), true);
    assert.equal(createExecutiveJournalExperiencePlatformConsumerBinding({
      consumerIdentity: "unknown",
      manifestIdentity: ExecutiveJournalExperienceManifest.identity.id,
      allowedCapabilityReferences: [],
      prohibitedCapabilityReferences: [],
      accessClassification: "ProductionAccessProhibited",
      sourceClassification: "RealRtc2SourceProhibited",
      isolationRequirement: "NotIsolated",
      authorizationEvidence: "AD-EX2-14",
    }), null);
  });

  ExecutiveJournalExperiencePlatformReadinessConditions.forEach((condition, index) => {
    it(`covers readiness condition ${index + 1}`, () => {
      assert.equal(typeof condition, "string");
      assert.equal(condition.length > 0, true);
      assert.equal(ExecutiveJournalExperiencePlatformReadinessConditions.indexOf(condition), index);
    });
  });

  it("allows only immediate lifecycle transitions", () => {
    assert.equal(isExecutiveJournalExperiencePlatformLifecycleState("Declared"), true);
    assert.equal(isExecutiveJournalExperiencePlatformLifecycleState(" declared"), false);
    for (let index = 0; index < ExecutiveJournalExperiencePlatformLifecycleStates.length - 1; index += 1) {
      assert.equal(canTransitionExecutiveJournalExperiencePlatformLifecycle(
        ExecutiveJournalExperiencePlatformLifecycleStates[index],
        ExecutiveJournalExperiencePlatformLifecycleStates[index + 1],
      ), true);
    }
    assert.equal(canTransitionExecutiveJournalExperiencePlatformLifecycle("Declared", "Sealed"), false);
    assert.equal(canTransitionExecutiveJournalExperiencePlatformLifecycle("Sealed", "Sealed"), false);
    assert.equal(canTransitionExecutiveJournalExperiencePlatformLifecycle("Sealed", "Declared"), false);
    assert.equal(assertExecutiveJournalExperiencePlatformLifecycleTransition("Sealed", "ReadyForCertification"), true);
    assert.equal(ExecutiveJournalExperiencePlatformLifecycle.readyForCertificationAuthorizesEx27, false);
  });

  it("publishes immutable exact contracts and decisions", () => {
    assert.equal(ExecutiveJournalExperiencePlatformContracts.length, 10);
    assert.equal(ExecutiveJournalExperiencePlatformContracts.every((contract, index) =>
      contract.order === index + 1 && Object.isFrozen(contract)
      && contract.runtimeEffects === false
      && contract.productionAuthorization === false), true);
    assert.deepEqual(ExecutiveJournalExperiencePlatformDecisions.map((decision) => decision.decisionId), [
      "EX-2:6/D-21", "EX-2:6/D-22", "EX-2:6/D-23",
      "EX-2:6/D-24", "EX-2:6/D-25", "EX-2:6/D-26",
    ]);
  });
});

describe("upstream preservation, aggregate, and summary", () => {
  it("preserves exact upstream references, issues, and gates", () => {
    assert.equal(ExecutiveJournalExperiencePlatformUpstream.manifest, ExecutiveJournalExperienceManifest);
    assert.equal(ExecutiveJournalExperiencePlatformUpstream.validation, ExecutiveJournalExperienceManifest.validation);
    assert.equal(ExecutiveJournalExperiencePlatformUpstream.openIssues, ExecutiveJournalExperienceManifest.openIssues);
    assert.equal(ExecutiveJournalExperiencePlatformUpstream.pendingGates, ExecutiveJournalExperienceManifest.pendingGates);
    assert.equal(ExecutiveJournalExperiencePlatform.openIssues.issues.length, 13);
    assert.deepEqual(ExecutiveJournalExperiencePlatform.pendingGates, ["G-EX2-04", "G-EX2-07", "G-EX2-12"]);
    assert.equal(
      ExecutiveJournalExperiencePlatform.openIssues.pendingGates.every(
        (gate) => gate.result === "Pending",
      ),
      true,
    );
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveJournalExperiencePlatform), true);
    assert.equal(ExecutiveJournalExperiencePlatform.manifest, ExecutiveJournalExperienceManifest);
    assert.equal(ExecutiveJournalExperiencePlatform.authorization, ExecutiveJournalExperiencePlatformAuthorization);
    assert.equal(ExecutiveJournalExperiencePlatform.boundaries, ExecutiveJournalExperiencePlatformBoundaries);
    assert.equal(ExecutiveJournalExperiencePlatformDependencyDeclaration.runtimeDependency, "EX-2:5/ExecutiveJournalExperienceManifest");
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(getExecutiveJournalExperiencePlatformSummary(), ExecutiveJournalExperiencePlatformSummaryValue);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.capabilityBindingCount, 16);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.nonCapabilityEnforcementCount, 19);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.readinessConditionCount, 12);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.consumerBindingFieldCount, 10);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.openIssueCount, 13);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.pendingGateCount, 3);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.ex27Created, false);
    assert.equal(ExecutiveJournalExperiencePlatformSummaryValue.ex27Authorized, false);
    assert.equal(JSON.stringify(ExecutiveJournalExperiencePlatformSummaryValue).includes("payload"), false);
  });
});
