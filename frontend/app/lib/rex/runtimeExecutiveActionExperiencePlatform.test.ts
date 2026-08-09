import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN as identityChain,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_API_CATEGORIES as apiCategories,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS as sections,
  RUNTIME_EXECUTIVE_ACTION_KINDS as actionKinds,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES as lifecycleStates,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES as orchestrationPhases,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES as presentationStates,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionExperiencePlatformSnapshot,
  evaluateRuntimeExecutiveActionExperience,
  getRuntimeExecutiveActionExperiencePlatform,
  getRuntimeExecutiveActionExperiencePlatformCapabilities,
  getRuntimeExecutiveActionExperiencePlatformIdentity,
  getRuntimeExecutiveActionExperiencePlatformRegistry,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionExperiencePlatform as module,
  runtimeExecutiveActionExperiencePlatformApiNames as apiNames,
  runtimeExecutiveActionExperiencePlatformCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionExperiencePlatformConsumerInformation as consumerInformation,
  runtimeExecutiveActionExperiencePlatformRegistry as registry,
  verifyRuntimeExecutiveActionExperiencePlatform,
  verifyRuntimeExecutiveActionExperiencePlatformCompatibility,
  verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness,
  verifyRuntimeExecutiveActionExperiencePlatformInvariants,
} from "./runtimeExecutiveActionExperiencePlatform.ts";

import {
  runtimeExecutiveActionOrchestrationIdentity,
  runtimeExecutiveActionOrchestrationSupportedImportPath,
  verifyRuntimeExecutiveActionOrchestration,
} from "@/app/lib/rex/runtimeExecutiveActionOrchestration";

const source = readFileSync(
  new URL("./runtimeExecutiveActionExperiencePlatform.ts", import.meta.url),
  "utf8",
);

const projectAlphaProposal = Object.freeze({
  kind: "request" as const,
  intent: { kind: "request-information" as const },
  subject: {
    kind: "object" as const,
    id: "object.project-alpha",
    label: "Project Alpha",
  },
  target: {
    kind: "team" as const,
    id: "team.engineering",
    label: "Engineering Team",
  },
  recipient: {
    kind: "role" as const,
    id: "role.engineering-lead",
    label: "Engineering Lead",
  },
  title: "Request Update",
  reason: "Schedule risk increasing",
  selectedSubject: {
    kind: "object" as const,
    id: "object.project-alpha",
    label: "Project Alpha",
  },
  context: {
    workspaceId: "workspace.operations",
    insightId: "insight.schedule-risk",
    focusedSubjectId: "object.project-alpha",
  },
  proposal: Object.freeze({
    kind: "request" as const,
    intent: { kind: "request-information" as const },
    subject: {
      kind: "object" as const,
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    target: {
      kind: "team" as const,
      id: "team.engineering",
      label: "Engineering Team",
    },
    recipient: {
      kind: "role" as const,
      id: "role.engineering-lead",
      label: "Engineering Lead",
    },
    title: "Request Update",
    reason: "Schedule risk increasing",
    priority: "high" as const,
    context: {
      workspaceId: "workspace.operations",
      insightId: "insight.schedule-risk",
      focusedSubjectId: "object.project-alpha",
    },
  }),
});

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
  );
  assert.equal(module.version, "5.7.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.platform",
  );
  assert.equal(module.phase, "Platform");
  assert.equal(
    module.architecturalRole,
    "RuntimeExecutiveActionExperiencePlatform",
  );
  assert.equal(module.consumerRole, "PreCertificationPlatformSurface");
  assert.deepEqual(
    getRuntimeExecutiveActionExperiencePlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:6 orchestration", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:6/RuntimeExecutiveActionOrchestration",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionOrchestrationIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionOrchestrationSupportedImportPath,
  );
  assert.equal(boundary.consumesOrchestrationOnly, true);
  assert.equal(boundary.importsRex55Directly, false);
  assert.equal(boundary.importsRex54Directly, false);
  assert.equal(boundary.importsRex53Directly, false);
  assert.equal(boundary.importsRex52Directly, false);
  assert.equal(boundary.importsRex51Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionOrchestration",
  ]);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(source, /jira|slack|openai|nodemailer/i);
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.equal(verifyRuntimeExecutiveActionOrchestration().ok, true);
});

test("3. identity chain is exact ordered REX-5:1 → REX-5:7", () => {
  assert.deepEqual([...identityChain], [
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
    "REX-5:2/RuntimeExecutiveActionExperienceContracts",
    "REX-5:3/RuntimeExecutiveActionIntentContext",
    "REX-5:4/RuntimeExecutiveActionPresentationPreview",
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
    "REX-5:6/RuntimeExecutiveActionOrchestration",
    "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
  ]);
  assert.equal(registry.identityChainCount, 7);
});

test("4. capabilities / readiness / api categories", () => {
  assert.deepEqual([...capabilities], [
    "action-domain",
    "action-contracts",
    "intent-context-resolution",
    "presentation-preview",
    "confirmation-safety",
    "action-orchestration",
    "dispatch-request-preparation",
  ]);
  assert.equal(registry.capabilityCount, 7);
  assert.deepEqual([...apiCategories], [
    "Identity",
    "Domain",
    "Contracts",
    "IntentContext",
    "Presentation",
    "ConfirmationSafety",
    "Orchestration",
    "Verification",
    "Registry",
    "PlatformInformation",
  ]);
  assert.deepEqual(
    getRuntimeExecutiveActionExperiencePlatformCapabilities(),
    capabilities,
  );
});

test("5. foundation / contracts / presentation / orchestration preservation", () => {
  assert.ok(actionKinds.includes("request"));
  assert.ok(actionKinds.includes("approve"));
  assert.ok(lifecycleStates.includes("pending-confirmation"));
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.deepEqual([...orchestrationPhases].slice(0, 6), [
    "proposal",
    "contract",
    "intent-context",
    "preview",
    "confirmation",
    "prepared-for-dispatch",
  ]);

  const draft = createRuntimeExecutiveActionDraft({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Request Update",
  });
  assert.equal(draft.kind, "request");
  assert.ok(Object.isFrozen(draft));

  const intent = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Send",
  });
  assert.equal(intent.status, "ambiguous");
});

test("6. confirmation gate and no-phase-skipping preserved", () => {
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

test("7. platform evaluation waits for confirmation; confirm becomes eligible", () => {
  const evaluated = evaluateRuntimeExecutiveActionExperience({
    proposal: projectAlphaProposal,
    presentationState: "operation",
  });
  assert.equal(evaluated.orchestration?.phase, "confirmation");
  assert.equal(evaluated.orchestration?.status, "waiting");
  assert.equal(
    evaluated.orchestration?.downstreamEligibility,
    "not-eligible",
  );

  const confirmed = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "confirm",
  });
  assert.equal(confirmed.orchestration?.phase, "prepared-for-dispatch");
  assert.equal(confirmed.orchestration?.downstreamEligibility, "eligible");
  assert.equal(
    confirmed.orchestration?.dispatchRequest?.externalDispatch,
    false,
  );
  assert.equal(
    confirmed.orchestration?.dispatchRequest?.providerNeutral,
    true,
  );

  const snapshot = createRuntimeExecutiveActionExperiencePlatformSnapshot(
    confirmed.orchestration!,
  );
  assert.equal(snapshot.externalDispatch, "not-performed");
  assert.equal(snapshot.downstreamEligibility, "eligible");
  assert.ok(Object.isFrozen(snapshot));
});

test("8. blocked ambiguous platform state is not auto-repaired", () => {
  const evaluated = evaluateRuntimeExecutiveActionExperience({
    proposal: {
      kind: "send",
      subject: {
        kind: "object",
        id: "object.project-alpha",
        label: "Project Alpha",
      },
      recipient: {
        kind: "unresolved",
        label: "ops",
      },
      title: "Send",
      proposal: {
        kind: "send",
        subject: {
          kind: "object",
          id: "object.project-alpha",
          label: "Project Alpha",
        },
        recipient: { kind: "unresolved", label: "ops" },
        title: "Send",
        priority: "normal",
      },
    },
  });
  assert.ok(
    evaluated.orchestration?.phase === "intent-context" ||
      evaluated.orchestration?.phase === "preview" ||
      evaluated.orchestration?.phase === "confirmation",
  );
  assert.notEqual(
    evaluated.orchestration?.downstreamEligibility,
    "eligible",
  );
});

test("9. invariants / compatibility / verification / consumer readiness", () => {
  const invariantResult =
    verifyRuntimeExecutiveActionExperiencePlatformInvariants();
  assert.equal(invariantResult.ok, true);
  assert.equal(invariantResult.invariants.length, 11);

  const compatibility =
    verifyRuntimeExecutiveActionExperiencePlatformCompatibility();
  assert.equal(compatibility.status, "compatible");

  const verification = verifyRuntimeExecutiveActionExperiencePlatform();
  assert.equal(verification.status, "valid");
  assert.equal(verification.readiness, "ready");
  assert.equal(verification.readyForCertification, true);
  assert.equal(verification.failedCount, 0);
  assert.ok(verification.checks.length >= 14);

  const consumer =
    verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness();
  assert.equal(consumer.status, "ReadyForCertification");
  assert.equal(consumer.readyForConsumer, false);
  assert.equal(consumer.consumerRole, "PreCertificationPlatformSurface");
});

test("10. registry integrity and consumer information", () => {
  assert.deepEqual([...sections], [
    "Identity",
    "IdentityChain",
    "Capabilities",
    "PublicTypes",
    "PublicAPIs",
    "Lifecycle",
    "Presentation",
    "ConfirmationSafety",
    "Orchestration",
    "Verification",
    "Compatibility",
    "Invariants",
    "Guarantees",
    "ConsumerInformation",
  ]);
  assert.equal(registry.sectionCount, 14);
  assert.equal(new Set(sections).size, sections.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.identityChainCount, identityChain.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.deepEqual(
    getRuntimeExecutiveActionExperiencePlatformRegistry(),
    registry,
  );

  assert.equal(consumerInformation.currentPhase, "Platform");
  assert.equal(consumerInformation.nextPhase, "CertificationFreeze");
  assert.equal(
    consumerInformation.consumerRole,
    "PreCertificationPlatformSurface",
  );
  assert.equal(consumerInformation.externalDispatch, "not-provided");
  assert.equal(consumerInformation.providerRouting, "not-provided");
  assert.equal(consumerInformation.uiRendering, "not-provided");
  assert.equal(consumerInformation.consumerEntryPoint, "not-yet");
  assert.equal(module.readyForConsumer, false);
  assert.equal(module.certified, false);
  assert.equal(module.frozen, false);
  assert.equal(module.released, false);
});

test("11. immutability / determinism / independence / no dispatch", () => {
  const first = verifyRuntimeExecutiveActionExperiencePlatform();
  const second = verifyRuntimeExecutiveActionExperiencePlatform();
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(identityChain));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(module));

  const platform = getRuntimeExecutiveActionExperiencePlatform();
  assert.equal(platform.readiness, "ready");
  assert.ok(Object.isFrozen(platform));

  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.aiIndependent, true);
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(module.externalDispatchFree, true);
  assert.doesNotMatch(source, /\bsendEmail\s*\(/);
  assert.doesNotMatch(source, /\bcreateTicket\s*\(/);
  assert.doesNotMatch(source, /\bcallAgent\s*\(/);
  assert.doesNotMatch(source, /\bpublishExternally\s*\(/);
});
