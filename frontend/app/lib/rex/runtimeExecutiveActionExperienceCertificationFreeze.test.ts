import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_DOMAINS as domains,
  RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_ISSUE_CODES as issueCodes,
  RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_REGISTRY_SECTIONS as sections,
  RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_STATUSES as certificationStatuses,
  RUNTIME_EXECUTIVE_ACTION_COMPATIBILITY_STATUSES as compatibilityStatuses,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_ACTION_FREEZE_STATUSES as freezeStatuses,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES as frozenGuarantees,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS as frozenInvariants,
  RUNTIME_EXECUTIVE_ACTION_LOCK_STATUSES as lockStatuses,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_READINESS as publicIndexReadiness,
  canTransitionRuntimeExecutiveActionOrchestration,
  getRuntimeExecutiveActionExperienceCertification,
  getRuntimeExecutiveActionExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveActionExperienceCertificationFreezeRegistry,
  getRuntimeExecutiveActionExperienceFreeze,
  getRuntimeExecutiveActionExperiencePlatformLock,
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionExperienceCertificationFreeze as module,
  runtimeExecutiveActionExperienceCertificationFreezeApiNames as apiNames,
  runtimeExecutiveActionExperienceCertificationFreezeCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation as consumerInformation,
  runtimeExecutiveActionExperienceCertificationFreezeRegistry as registry,
  verifyRuntimeExecutiveActionExperienceCertification,
  verifyRuntimeExecutiveActionExperienceCompatibility,
  verifyRuntimeExecutiveActionExperienceFreeze,
} from "./runtimeExecutiveActionExperienceCertificationFreeze.ts";

import {
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  runtimeExecutiveActionExperiencePlatformIdentity,
  runtimeExecutiveActionExperiencePlatformSupportedImportPath,
  verifyRuntimeExecutiveActionExperiencePlatform,
} from "@/app/lib/rex/runtimeExecutiveActionExperiencePlatform";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveActionExperienceCertificationFreeze.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
  );
  assert.equal(module.version, "5.8.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.certification-freeze",
  );
  assert.equal(module.phase, "CertificationFreeze");
  assert.equal(
    module.architecturalRole,
    "RuntimeExecutiveActionExperienceCertificationFreeze",
  );
  assert.equal(module.consumerRole, "FrozenPrePublicIndexSurface");
  assert.deepEqual(
    getRuntimeExecutiveActionExperienceCertificationFreezeIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:7 platform", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionExperiencePlatformIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionExperiencePlatformSupportedImportPath,
  );
  assert.equal(module.boundary.consumesPlatformOnly, true);
  assert.equal(module.boundary.importsRex56Directly, false);
  assert.equal(module.boundary.importsRex55Directly, false);
  assert.equal(module.boundary.importsRex51Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionExperiencePlatform",
  ]);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(source, /from\s+["'][^"']*(openai|nodemailer|@slack|jira)[^"']*["']/i);
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.equal(verifyRuntimeExecutiveActionExperiencePlatform().status, "valid");
});

test("3. lock / statuses / domains / readiness", () => {
  assert.equal(
    platformLock,
    "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(getRuntimeExecutiveActionExperiencePlatformLock(), platformLock);
  assert.deepEqual([...certificationStatuses], ["certified", "not-certified"]);
  assert.deepEqual([...freezeStatuses], ["frozen", "not-frozen"]);
  assert.deepEqual([...lockStatuses], ["locked", "unlocked"]);
  assert.deepEqual([...compatibilityStatuses], [
    "compatible",
    "incompatible",
  ]);
  assert.deepEqual([...publicIndexReadiness], [
    "ready-for-public-index",
    "not-ready-for-public-index",
  ]);
  assert.deepEqual([...domains], [
    "Identity",
    "DependencyChain",
    "Foundation",
    "Contracts",
    "IntentContext",
    "PresentationPreview",
    "ConfirmationSafety",
    "Orchestration",
    "DispatchBoundary",
    "PlatformCapabilities",
    "PlatformRegistry",
    "PlatformInvariants",
    "PlatformGuarantees",
    "Compatibility",
    "Immutability",
    "Determinism",
    "RendererIndependence",
    "ProviderIndependence",
    "ExternalDispatchAbsence",
  ]);
  assert.equal(new Set(domains).size, domains.length);
  assert.equal(new Set(issueCodes).size, issueCodes.length);
});

test("4. identity chain REX-5:1 → REX-5:8", () => {
  assert.deepEqual([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN], [
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
    "REX-5:2/RuntimeExecutiveActionExperienceContracts",
    "REX-5:3/RuntimeExecutiveActionIntentContext",
    "REX-5:4/RuntimeExecutiveActionPresentationPreview",
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
    "REX-5:6/RuntimeExecutiveActionOrchestration",
    "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
  ]);
  assert.equal(
    module.identity,
    "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
  );
});

test("5. foundation / presentation / confirmation / orchestration preservation", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "proposal",
      to: "prepared-for-dispatch",
      operation: "advance",
    }),
    false,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "preview",
      to: "prepared-for-dispatch",
      operation: "advance",
    }),
    false,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "confirmation",
      to: "prepared-for-dispatch",
      operation: "advance",
    }),
    false,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "confirmation",
      to: "prepared-for-dispatch",
      operation: "confirm",
    }),
    true,
  );

  const ambiguous = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Send",
  });
  assert.equal(ambiguous.status, "ambiguous");
});

test("6. certification / compatibility / freeze succeed", () => {
  const certification = verifyRuntimeExecutiveActionExperienceCertification();
  assert.equal(certification.status, "certified");
  assert.equal(certification.compatibility, "compatible");
  assert.equal(certification.freeze, "frozen");
  assert.equal(certification.lock, "locked");
  assert.equal(certification.platformLock, platformLock);
  assert.equal(certification.readyForPublicIndex, "ready-for-public-index");
  assert.equal(certification.failedCheckCount, 0);
  assert.equal(
    certification.passedCheckCount,
    certification.checks.length,
  );
  assert.equal(
    registry.certificationCheckCount,
    certification.checks.length,
  );
  assert.equal(new Set(certification.checks.map((entry) => entry.id)).size, certification.checks.length);

  const compatibility = verifyRuntimeExecutiveActionExperienceCompatibility();
  assert.equal(compatibility.status, "compatible");

  const freeze = verifyRuntimeExecutiveActionExperienceFreeze();
  assert.equal(freeze.freezeStatus, "frozen");
  assert.equal(freeze.lockStatus, "locked");
  assert.equal(freeze.lock, platformLock);
  assert.equal(freeze.readyForPublicIndex, "ready-for-public-index");
  assert.deepEqual(getRuntimeExecutiveActionExperienceFreeze(), freeze);

  const model = getRuntimeExecutiveActionExperienceCertification();
  assert.equal(model.certificationStatus, "certified");
  assert.equal(model.failedChecks.length, 0);
  assert.ok(Object.isFrozen(model));
});

test("7. frozen invariants / guarantees / approved exports", () => {
  assert.equal(frozenInvariants.length, 25);
  assert.equal(registry.frozenInvariantCount, frozenInvariants.length);
  assert.ok(frozenInvariants.every((entry) => entry.status === "enforced"));
  assert.equal(
    new Set(frozenInvariants.map((entry) => entry.id)).size,
    frozenInvariants.length,
  );

  assert.equal(frozenGuarantees.length, 18);
  assert.ok(frozenGuarantees.includes("certified"));
  assert.ok(frozenGuarantees.includes("ready-for-public-index"));
  assert.ok(frozenGuarantees.includes("external-dispatch-free"));

  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  assert.ok(
    approvedExports.includes(
      "verifyRuntimeExecutiveActionExperienceCertification",
    ),
  );
  assert.ok(
    approvedExports.includes("createRuntimeExecutiveActionDispatchRequest"),
  );
});

test("8. registry integrity and consumer information", () => {
  assert.deepEqual([...sections], [
    "Identity",
    "Certification",
    "CertificationDomains",
    "CertificationChecks",
    "Compatibility",
    "Freeze",
    "Lock",
    "FrozenInvariants",
    "FrozenGuarantees",
    "ApprovedExports",
    "PublicIndexReadiness",
    "ConsumerInformation",
  ]);
  assert.equal(registry.sectionCount, 12);
  assert.equal(new Set(sections).size, sections.length);
  assert.equal(registry.certificationDomainCount, domains.length);
  assert.equal(registry.certificationIssueCodeCount, issueCodes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.deepEqual(
    getRuntimeExecutiveActionExperienceCertificationFreezeRegistry(),
    registry,
  );

  assert.equal(consumerInformation.currentPhase, "CertificationFreeze");
  assert.equal(consumerInformation.status, "Certified");
  assert.equal(consumerInformation.compatibility, "Compatible");
  assert.equal(consumerInformation.freeze, "Frozen");
  assert.equal(consumerInformation.lock, "Locked");
  assert.equal(consumerInformation.nextPhase, "PublicIndex");
  assert.equal(consumerInformation.consumerReadiness, "ReadyForPublicIndex");
  assert.equal(consumerInformation.readyForConsumer, false);
  assert.equal(module.readyForConsumer, false);
  assert.equal(module.released, false);
});

test("9. immutability / determinism / independence", () => {
  const first = verifyRuntimeExecutiveActionExperienceCertification();
  const second = verifyRuntimeExecutiveActionExperienceCertification();
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.checks));
  assert.ok(Object.isFrozen(platformLock));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(module));

  assert.equal(module.boundary.rendererIndependent, true);
  assert.equal(module.boundary.aiIndependent, true);
  assert.equal(module.boundary.introducesDispatch, false);
  assert.doesNotMatch(source, /\bfunction\s+sendEmail\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+createTicket\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+callAgent\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+publishExternally\s*\(/);
});
