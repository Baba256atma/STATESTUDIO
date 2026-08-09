import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN as identityChain,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS as intentKinds,
  RUNTIME_EXECUTIVE_ACTION_KINDS as actionKinds,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES as lifecycleStates,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES as orchestrationPhases,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS as functionalApis,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS as sections,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS as publicationApis,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_VALIDATION_APIS as validationApis,
  RUNTIME_EXECUTIVE_ACTION_PUBLIC_CERTIFICATION_PUBLICATION_APIS as certificationPublicationApis,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionExperience,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionExperienceConsumerInformation,
  getRuntimeExecutiveActionExperiencePublicIndexIdentity,
  getRuntimeExecutiveActionExperiencePublicIndexRegistry,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperienceConsumerInformation as consumerInformation,
  runtimeExecutiveActionExperiencePublicIndex as publicIndex,
  runtimeExecutiveActionExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionExperiencePublicIndexModule as module,
  runtimeExecutiveActionExperiencePublicIndexRegistry as registry,
  verifyRuntimeExecutiveActionExperienceCertification,
  verifyRuntimeExecutiveActionExperienceCompatibility,
  verifyRuntimeExecutiveActionExperienceFreeze,
  verifyRuntimeExecutiveActionExperiencePublicIndex,
} from "./runtimeExecutiveActionExperiencePublicIndex.ts";

import {
  runtimeExecutiveActionExperienceCertificationFreezeIdentity,
  runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze";

import type {
  RuntimeExecutiveActionDispatchRequest,
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionPreviewResult,
} from "./runtimeExecutiveActionExperiencePublicIndex.ts";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveActionExperiencePublicIndex.ts",
    import.meta.url,
  ),
  "utf8",
);

test("1. exact identity / version / namespace / SoleConsumerEntryPoint", () => {
  assert.equal(
    module.identity,
    "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex",
  );
  assert.equal(module.version, "5.9.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.public-index",
  );
  assert.equal(module.phase, "PublicIndex");
  assert.equal(module.role, "SoleConsumerEntryPoint");
  assert.equal(module.consumerRole, "SoleConsumerEntryPoint");
  assert.equal(module.architecturalRole, "SoleConsumerEntryPoint");
  assert.deepEqual(
    getRuntimeExecutiveActionExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:8; no lower-phase imports", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze",
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze",
  ]);

  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAction(?:ExperienceFoundation|ExperienceContracts|IntentContext|PresentationPreview|ConfirmationSafety|Orchestration|ExperiencePlatform)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtime(?:EnabledExecutiveExperience|ExecutiveStage|ExecutiveAdvisor|ExecutiveInsight)[^"']*["']/,
  );
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(openai|anthropic|nodemailer|@slack|jira|axios|node-fetch|pg|redis|bullmq)[^"']*["']/i,
  );
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.equal(module.boundary.consumesCertificationFreezeOnly, true);
  assert.equal(module.boundary.importsRex57Directly, false);
  assert.equal(module.boundary.importsRex56Directly, false);
  assert.equal(module.boundary.importsRex51Directly, false);
  assert.equal(module.boundary.introducesRuntimeBehavior, false);
});

test("3. type-only imports also respect REX-5:8 boundary", () => {
  const typeFromClauses = [
    ...source.matchAll(/export type\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
  assert.ok(typeFromClauses.length > 0);
  assert.ok(
    typeFromClauses.every(
      (path) =>
        path ===
        "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze",
    ),
  );
});

test("4. supported import path and nine ordered namespace sections", () => {
  assert.equal(
    module.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex",
  );
  assert.deepEqual([...sections], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.equal(sections.length, 9);
  assert.deepEqual(Object.keys(publicIndex), [...sections]);
  assert.ok(Object.isFrozen(publicIndex));
  assert.ok(Object.isFrozen(module));
  assert.ok(Object.isFrozen(registry));
});

test("5. release / certification / compatibility / freeze / lock / stability / readiness", () => {
  assert.equal(module.releaseStatus, "Released");
  assert.equal(module.certificationStatus, "Certified");
  assert.equal(module.compatibilityStatus, "Compatible");
  assert.equal(module.freezeStatus, "Frozen");
  assert.equal(module.lockStatus, "Locked");
  assert.equal(module.stability, "Stable");
  assert.equal(module.consumerReadiness, "ReadyForConsumer");
  assert.equal(
    platformLock,
    "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(module.platformLock, platformLock);
  assert.equal(publicIndex.ReleaseInformation.release, "Released");
  assert.equal(publicIndex.Certification.certificationStatus, "Certified");
  assert.equal(publicIndex.Compatibility.overallStatus, "Compatible");
  assert.equal(publicIndex.Identity.consumerRole, "SoleConsumerEntryPoint");
});

test("6. identity chain REX-5:1 → REX-5:9", () => {
  assert.deepEqual([...identityChain], [
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
    "REX-5:2/RuntimeExecutiveActionExperienceContracts",
    "REX-5:3/RuntimeExecutiveActionIntentContext",
    "REX-5:4/RuntimeExecutiveActionPresentationPreview",
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
    "REX-5:6/RuntimeExecutiveActionOrchestration",
    "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
    "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
    "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex",
  ]);
  assert.equal(registry.identityChainCount, identityChain.length);
  assert.equal(identityChain.length, 9);
});

test("7. approved exports unique; functional APIs approved; no unapproved runtime APIs", () => {
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  for (const name of functionalApis) {
    assert.ok(
      (approvedExports as readonly string[]).includes(name),
      `functional API not approved: ${name}`,
    );
  }
  assert.equal(new Set(functionalApis).size, functionalApis.length);
  assert.doesNotMatch(source, /\bfunction\s+confirmIfSafe\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+autoApprove\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+executeConfirmedAction\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+sendEmail\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+createTicket\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+callAgent\s*\(/);
  assert.doesNotMatch(source, /\bfunction\s+publishExternally\s*\(/);
});

test("8. registry integrity and derived counts", () => {
  assert.equal(registry.sectionCount, 9);
  assert.equal(new Set(sections).size, sections.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(
    registry.publicApiCount,
    functionalApis.length + publicationApis.length,
  );
  assert.equal(registry.functionalApiCount, functionalApis.length);
  assert.equal(registry.publicationApiCount, publicationApis.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(
    registry.certificationPublicationApiCount,
    certificationPublicationApis.length,
  );
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
  assert.equal(new Set(consumerGuarantees).size, consumerGuarantees.length);
  assert.equal(new Set(publicTypes).size, publicTypes.length);
  assert.deepEqual(
    getRuntimeExecutiveActionExperiencePublicIndexRegistry(),
    registry,
  );
  assert.deepEqual(
    getRuntimeExecutiveActionExperienceConsumerInformation(),
    consumerInformation,
  );
  assert.equal(
    consumerInformation.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex",
  );
  assert.equal(consumerInformation.externalDispatchSupport, "NotProvided");
  assert.equal(consumerInformation.providerRoutingSupport, "NotProvided");
});

test("9. presentation / confirmation gate / no phase skipping", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
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
});

test("10. foundation / contracts / intent / kinds / lifecycle preserved via Public Index", () => {
  const draft = createRuntimeExecutiveActionDraft({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Request review",
  });
  assert.equal(draft.kind, "request");
  assert.equal(draft.lifecycle, "draft");
  assert.ok(actionKinds.includes("request"));
  assert.ok(intentKinds.includes("inform"));
  assert.notEqual(actionKinds, intentKinds);
  assert.ok(lifecycleStates.includes("draft"));
  assert.ok(!lifecycleStates.includes("sent"));
  assert.ok(!lifecycleStates.includes("delivered"));
  assert.ok(!lifecycleStates.includes("executed"));

  const proposal = createRuntimeExecutiveActionProposalContract({
    kind: draft.kind,
    subject: draft.subject,
    title: draft.title,
  });
  const evaluation = evaluateRuntimeExecutiveActionProposalContract(proposal);
  assert.equal(typeof evaluation.valid, "boolean");
  // invalid ≠ incomplete remains a frozen contract principle for consumers
  assert.ok("valid" in evaluation);
  assert.ok("issues" in evaluation);

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

  const preparation = evaluateRuntimeExecutiveActionPreparationContract({
    draft,
  });
  assert.ok(preparation !== undefined);
  assert.ok("status" in preparation);
});

test("11. preview / safety / confirmation / orchestration / dispatch surface available", () => {
  assert.equal(typeof resolveRuntimeExecutiveActionPreview, "function");
  assert.equal(typeof evaluateRuntimeExecutiveActionSafety, "function");
  assert.equal(typeof resolveRuntimeExecutiveActionConfirmation, "function");
  assert.equal(typeof orchestrateRuntimeExecutiveAction, "function");
  assert.equal(typeof evaluateRuntimeExecutiveActionExperience, "function");
  assert.equal(typeof createRuntimeExecutiveActionDispatchRequest, "function");
  assert.ok(orchestrationPhases.includes("proposal"));
  assert.ok(orchestrationPhases.includes("confirmation"));
  assert.ok(orchestrationPhases.includes("prepared-for-dispatch"));

  const draft: RuntimeExecutiveActionDraft = createRuntimeExecutiveActionDraft({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Request review",
  });
  void draft;

  // Type surface reachable through Public Index without lower-phase imports.
  type _Preview = RuntimeExecutiveActionPreviewResult;
  type _Dispatch = RuntimeExecutiveActionDispatchRequest;
  const _typeProbe: [_Preview | undefined, _Dispatch | undefined] = [
    undefined,
    undefined,
  ];
  assert.equal(_typeProbe.length, 2);

  assert.doesNotMatch(source, /\bjiraProjectId\b/);
  assert.doesNotMatch(source, /\bslackChannel\b/);
  assert.doesNotMatch(source, /\bteamsChannel\b/);
  assert.doesNotMatch(source, /\bemailProvider\b/);
  assert.doesNotMatch(source, /\bwebhookUrl\b/);
});

test("12. consumer guarantees complete and unique", () => {
  for (const guarantee of [
    "sole-consumer-entry-point",
    "certified",
    "compatible",
    "frozen",
    "locked",
    "stable",
    "ready-for-consumer",
    "deterministic",
    "immutable",
    "confirmation-gated",
    "safety-preserving",
    "scope-stable",
    "ambiguity-preserving",
    "phase-ordered",
    "provider-neutral",
    "renderer-independent",
    "transport-independent",
    "external-dispatch-free",
  ] as const) {
    assert.ok(consumerGuarantees.includes(guarantee), guarantee);
  }
  assert.equal(consumerGuarantees.length, 18);
});

test("13. Public Index verification succeeds; upstream statuses preserved", () => {
  const verification = verifyRuntimeExecutiveActionExperiencePublicIndex();
  assert.equal(verification.valid, true);
  assert.equal(verification.readyForConsumer, true);
  assert.equal(verification.failedCheckCount, 0);
  assert.equal(verification.passedCheckCount, verification.checks.length);
  assert.deepEqual([...verification.issues], []);

  assert.equal(
    verifyRuntimeExecutiveActionExperienceCertification().status,
    "certified",
  );
  assert.equal(
    verifyRuntimeExecutiveActionExperienceCompatibility().status,
    "compatible",
  );
  assert.equal(
    verifyRuntimeExecutiveActionExperienceFreeze().freezeStatus,
    "frozen",
  );
  assert.equal(
    verifyRuntimeExecutiveActionExperienceFreeze().lock,
    platformLock,
  );
});

test("14. immutability / determinism / independence", () => {
  const first = verifyRuntimeExecutiveActionExperiencePublicIndex();
  const second = verifyRuntimeExecutiveActionExperiencePublicIndex();
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.checks));
  assert.ok(Object.isFrozen(platformLock));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(module));
  assert.ok(Object.isFrozen(consumerInformation));
  assert.ok(Object.isFrozen(canonicalIdentity));

  assert.equal(module.boundary.rendererIndependent, true);
  assert.equal(module.boundary.aiIndependent, true);
  assert.equal(module.boundary.transportIndependent, true);
  assert.equal(module.boundary.providerNeutral, true);
  assert.equal(module.boundary.introducesDispatch, false);
  assert.equal(module.soleConsumerEntryPoint, true);
});
