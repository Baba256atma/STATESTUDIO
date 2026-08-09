import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS as acknowledgmentKinds,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES as confirmationModes,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY as confirmationPolicy,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES as policyRules,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES as readinessStates,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES as confirmationStatuses,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES as issueCodes,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS as issueDomains,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES as safetySeverities,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES as safetyStatuses,
  canConfirmRuntimeExecutiveAction,
  createRuntimeExecutiveActionConfirmationFingerprint,
  createRuntimeExecutiveActionConfirmationScope,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionConfirmationPolicy,
  getRuntimeExecutiveActionConfirmationSafetyGuarantees,
  getRuntimeExecutiveActionConfirmationSafetyIdentity,
  getRuntimeExecutiveActionConfirmationSafetyRegistry,
  hasRuntimeExecutiveActionChangedSincePreview,
  resolveRuntimeExecutiveActionConfirmation,
  runtimeExecutiveActionConfirmationSafety as module,
  runtimeExecutiveActionConfirmationSafetyApiNames as apiNames,
  runtimeExecutiveActionConfirmationSafetyCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionConfirmationSafetyRegistry as registry,
  verifyRuntimeExecutiveActionConfirmationSafety,
} from "./runtimeExecutiveActionConfirmationSafety.ts";

import {
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionPresentationPreviewIdentity,
  runtimeExecutiveActionPresentationPreviewSupportedImportPath,
  verifyRuntimeExecutiveActionPresentationPreview,
} from "@/app/lib/rex/runtimeExecutiveActionPresentationPreview";

import {
  resolveRuntimeExecutiveActionIntentContext,
  type RuntimeExecutiveActionIntentContextResult,
} from "@/app/lib/rex/runtimeExecutiveActionIntentContext";

const source = readFileSync(
  new URL("./runtimeExecutiveActionConfirmationSafety.ts", import.meta.url),
  "utf8",
);

function withProposalFields(
  result: ReturnType<typeof resolveRuntimeExecutiveActionIntentContext>,
  fields: {
    readonly priority?: "low" | "normal" | "high" | "critical";
    readonly lifecycle?:
      | "draft"
      | "prepared"
      | "pending-confirmation"
      | "confirmed"
      | "cancelled";
  },
): RuntimeExecutiveActionIntentContextResult {
  return Object.freeze({
    ...result,
    proposal: result.proposal
      ? Object.freeze({
          ...result.proposal,
          ...(fields.priority !== undefined
            ? { priority: fields.priority }
            : {}),
          ...(fields.lifecycle !== undefined
            ? { lifecycle: fields.lifecycle }
            : {}),
        })
      : result.proposal,
  }) as RuntimeExecutiveActionIntentContextResult;
}

function projectAlphaPreview(overrides?: {
  readonly priority?: "low" | "normal" | "high" | "critical";
  readonly lifecycle?:
    | "draft"
    | "prepared"
    | "pending-confirmation"
    | "confirmed"
    | "cancelled";
  readonly presentationState?: "minimum" | "report" | "operation";
}) {
  const intentContext = withProposalFields(
    resolveRuntimeExecutiveActionIntentContext({
      kind: "request",
      intent: { kind: "request-information" },
      subject: {
        kind: "object",
        id: "object.project-alpha",
        label: "Project Alpha",
      },
      target: {
        kind: "team",
        id: "team.engineering",
        label: "Engineering Team",
      },
      recipient: {
        kind: "role",
        id: "role.engineering-lead",
        label: "Engineering Lead",
      },
      title: "Request Update",
      reason: "Schedule risk increasing",
      origin: { kind: "insight", referenceId: "insight.schedule-risk" },
      context: {
        workspaceId: "workspace.operations",
        insightId: "insight.schedule-risk",
        focusedSubjectId: "object.project-alpha",
      },
      selectedSubject: {
        kind: "object",
        id: "object.project-alpha",
        label: "Project Alpha",
      },
    }),
    {
      priority: overrides?.priority ?? "high",
      lifecycle: overrides?.lifecycle ?? "pending-confirmation",
    },
  );

  return resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: overrides?.presentationState ?? "operation",
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
  );
  assert.equal(module.version, "5.5.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.confirmation-safety",
  );
  assert.equal(module.phase, "ConfirmationSafety");
  assert.equal(
    module.architecturalRole,
    "ExecutiveActionConfirmationSafetyRuntime",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionConfirmationSafetyIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:4 presentation preview", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:4/RuntimeExecutiveActionPresentationPreview",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionPresentationPreviewIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionPresentationPreviewSupportedImportPath,
  );
  assert.equal(boundary.consumesPresentationPreviewOnly, true);
  assert.equal(boundary.importsRex53Directly, false);
  assert.equal(boundary.importsRex52Directly, false);
  assert.equal(boundary.importsRex51Directly, false);
  assert.equal(boundary.importsRex4Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionPresentationPreview",
  ]);

  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(source, /jira|slack|openai|anthropic|nodemailer/i);
  assert.doesNotMatch(source, /\bdispatch\s*\(/);
  assert.doesNotMatch(source, /\bsendEmail\s*\(/);
  assert.doesNotMatch(source, /\bcreateTicket\s*\(/);
  assert.equal(verifyRuntimeExecutiveActionPresentationPreview().ok, true);
});

test("3. confirmation statuses / modes / readiness order", () => {
  assert.deepEqual([...confirmationStatuses], [
    "not-ready",
    "ready",
    "confirmed",
    "declined",
    "cancelled",
  ]);
  assert.deepEqual([...confirmationModes], [
    "standard",
    "review-required",
    "explicit-high-risk",
  ]);
  assert.deepEqual([...readinessStates], [
    "not-ready",
    "review-required",
    "ready",
  ]);
});

test("4. safety statuses / severities / domains / issue codes", () => {
  assert.deepEqual([...safetyStatuses], ["safe", "review", "blocked"]);
  assert.deepEqual([...safetySeverities], [
    "info",
    "caution",
    "high",
    "blocking",
  ]);
  assert.deepEqual([...issueDomains], [
    "subject",
    "target",
    "recipient",
    "intent",
    "priority",
    "reason",
    "context",
    "consequence",
    "lifecycle",
    "confirmation",
  ]);
  assert.deepEqual([...issueCodes], [
    "recipient-unresolved",
    "recipient-missing",
    "target-missing",
    "intent-ambiguous",
    "intent-unresolved",
    "context-conflict",
    "reason-missing",
    "consequence-unclear",
    "critical-priority-review",
    "lifecycle-not-confirmable",
    "preview-blocked",
    "confirmation-scope-missing",
    "review-acknowledgment-required",
    "high-risk-explicit-acknowledgment-required",
    "confirmation-scope-changed",
    "subject-missing",
  ]);
  assert.deepEqual([...acknowledgmentKinds], [
    "reviewed-warning",
    "accepted-critical-priority",
    "accepted-consequence",
    "accepted-unresolved-recipient",
  ]);
});

test("5. standard action becomes confirmation-ready and confirmable", () => {
  const previewResult = projectAlphaPreview();
  assert.equal(previewResult.status, "ready");

  const safety = evaluateRuntimeExecutiveActionSafety({ previewResult });
  assert.equal(safety.status, "safe");

  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult,
    safety,
  });
  assert.equal(readiness.state, "ready");
  assert.equal(readiness.mode, "standard");
  assert.equal(readiness.canConfirm, true);

  const result = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
  });
  assert.equal(result.status, "accepted");
  assert.equal(result.confirmation?.status, "confirmed");
  assert.equal(result.confirmation?.resultingLifecycleIntent, "confirmed");
  assert.equal(result.confirmation?.mode, "standard");
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
});

test("6. critical action requires review and explicit acknowledgment", () => {
  const previewResult = projectAlphaPreview({
    priority: "critical",
    presentationState: "operation",
  });

  const safety = evaluateRuntimeExecutiveActionSafety({ previewResult });
  assert.equal(safety.status, "review");
  assert.ok(
    safety.issues.some((entry) => entry.code === "critical-priority-review"),
  );

  const readinessWithout = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult,
    safety,
  });
  assert.equal(readinessWithout.state, "review-required");
  assert.equal(readinessWithout.mode, "explicit-high-risk");
  assert.equal(readinessWithout.canConfirm, false);

  const blocked = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
  });
  assert.equal(blocked.status, "blocked");
  assert.ok(
    blocked.issues.some(
      (entry) =>
        entry.code === "high-risk-explicit-acknowledgment-required" ||
        entry.code === "review-acknowledgment-required",
    ),
  );

  const acknowledgments = Object.freeze([
    Object.freeze({
      kind: "accepted-critical-priority" as const,
      acknowledged: true,
    }),
    Object.freeze({
      kind: "accepted-consequence" as const,
      acknowledged: true,
    }),
  ]);

  const readinessWith = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult,
    safety,
    acknowledgments,
  });
  assert.equal(readinessWith.state, "ready");
  assert.equal(readinessWith.canConfirm, true);

  const accepted = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
    acknowledgments,
  });
  assert.equal(accepted.status, "accepted");
  assert.equal(accepted.confirmation?.status, "confirmed");
});

test("7. ambiguous intent blocks confirmation", () => {
  const intentContext = withProposalFields(
    resolveRuntimeExecutiveActionIntentContext({
      kind: "send",
      subject: {
        kind: "object",
        id: "object.project-alpha",
        label: "Project Alpha",
      },
      recipient: {
        kind: "role",
        id: "role.engineering-lead",
        label: "Engineering Lead",
      },
      title: "Send",
    }),
    { lifecycle: "pending-confirmation", priority: "normal" },
  );
  const previewResult = resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: "operation",
  });

  assert.equal(previewResult.presentation?.intent.ambiguous, true);

  const safety = evaluateRuntimeExecutiveActionSafety({ previewResult });
  assert.equal(safety.status, "blocked");
  assert.ok(safety.issues.some((entry) => entry.code === "intent-ambiguous"));

  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult,
    safety,
  });
  assert.equal(readiness.state, "not-ready");
  assert.equal(canConfirmRuntimeExecutiveAction({ previewResult }), false);
});

test("8. unresolved recipient blocks send and reviews assign", () => {
  const sendPreview = resolveRuntimeExecutiveActionPreview({
    intentContext: withProposalFields(
      resolveRuntimeExecutiveActionIntentContext({
        kind: "send",
        intent: { kind: "inform" },
        subject: {
          kind: "object",
          id: "object.project-alpha",
          label: "Project Alpha",
        },
        recipient: {
          kind: "unresolved",
          label: "Responsible Operations Manager",
        },
        title: "Send Decision",
      }),
      { lifecycle: "pending-confirmation", priority: "normal" },
    ),
    requestedPresentationState: "operation",
  });

  const sendSafety = evaluateRuntimeExecutiveActionSafety({
    previewResult: sendPreview,
  });
  assert.equal(sendSafety.status, "blocked");
  assert.ok(
    sendSafety.issues.some((entry) => entry.code === "recipient-unresolved"),
  );

  const assignPreview = resolveRuntimeExecutiveActionPreview({
    intentContext: withProposalFields(
      resolveRuntimeExecutiveActionIntentContext({
        kind: "assign",
        intent: { kind: "delegate" },
        subject: {
          kind: "object",
          id: "object.capacity",
          label: "Capacity Review",
        },
        recipient: {
          kind: "unresolved",
          label: "Operations Manager",
        },
        title: "Assign Responsibility",
      }),
      { lifecycle: "pending-confirmation", priority: "normal" },
    ),
    requestedPresentationState: "operation",
  });

  const assignSafety = evaluateRuntimeExecutiveActionSafety({
    previewResult: assignPreview,
  });
  assert.equal(assignSafety.status, "review");
  assert.ok(
    assignSafety.issues.some(
      (entry) =>
        entry.code === "recipient-unresolved" && entry.blocking === false,
    ),
  );

  const assignReadiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult: assignPreview,
    safety: assignSafety,
  });
  assert.equal(assignReadiness.state, "review-required");

  const assignReady = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult: assignPreview,
    safety: assignSafety,
    acknowledgments: [
      { kind: "accepted-unresolved-recipient", acknowledged: true },
    ],
  });
  assert.equal(assignReady.state, "ready");
});

test("9. context conflict is preserved and requires review", () => {
  const intentContext = resolveRuntimeExecutiveActionIntentContext({
    kind: "request",
    intent: { kind: "request-information" },
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: {
      kind: "role",
      id: "role.engineering-lead",
      label: "Engineering Lead",
    },
    title: "Request Update",
    selectedSubject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    primarySubjects: [
      {
        kind: "object",
        id: "object.project-beta",
        label: "Project Beta",
      },
    ],
  });
  assert.ok(intentContext.contextBinding.conflicts.length > 0);

  const previewResult = resolveRuntimeExecutiveActionPreview({
    intentContext: withProposalFields(intentContext, {
      priority: "normal",
      lifecycle: "pending-confirmation",
    }),
    requestedPresentationState: "report",
  });

  const safety = evaluateRuntimeExecutiveActionSafety({ previewResult });
  assert.ok(safety.issues.some((entry) => entry.code === "context-conflict"));
  assert.equal(safety.dimensions.contextConsistency, "conflicted");

  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult,
    safety,
  });
  assert.equal(readiness.state, "review-required");
});

test("10. consequence clarity and lifecycle confirmability", () => {
  const draftPreview = projectAlphaPreview({
    lifecycle: "draft",
    presentationState: "operation",
  });
  const draftSafety = evaluateRuntimeExecutiveActionSafety({
    previewResult: draftPreview,
  });
  assert.ok(
    draftSafety.issues.some(
      (entry) => entry.code === "lifecycle-not-confirmable",
    ),
  );

  const confirmedLifecycle = projectAlphaPreview({
    lifecycle: "confirmed",
  });
  assert.equal(
    canConfirmRuntimeExecutiveAction({ previewResult: confirmedLifecycle }),
    false,
  );

  // Operation without consequence surfaces consequence-unclear when applicable.
  const presentation = draftPreview.presentation;
  if (presentation && presentation.consequence === undefined) {
    assert.ok(
      draftSafety.issues.some((entry) => entry.code === "consequence-unclear"),
    );
  }
});

test("11. fingerprint is deterministic and scope changes are detected", () => {
  const previewResult = projectAlphaPreview();
  const presentation = previewResult.presentation!;
  const scope = createRuntimeExecutiveActionConfirmationScope(presentation);
  const first = createRuntimeExecutiveActionConfirmationFingerprint(scope);
  const second = createRuntimeExecutiveActionConfirmationFingerprint(scope);
  assert.equal(first.value, second.value);
  assert.match(first.value, /^rex\.confirm\.v1:[0-9a-f]{8}$/);

  const changed = createRuntimeExecutiveActionConfirmationFingerprint(
    Object.freeze({
      ...scope,
      recipientId: "role.operations-lead",
    }),
  );
  assert.equal(
    hasRuntimeExecutiveActionChangedSincePreview({
      expectedFingerprint: first.value,
      currentFingerprint: changed,
    }),
    true,
  );

  const blocked = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
    expectedFingerprint: changed.value,
  });
  assert.equal(blocked.status, "blocked");
  assert.ok(
    blocked.issues.some(
      (entry) => entry.code === "confirmation-scope-changed",
    ),
  );
});

test("12. decline and cancel remain distinct", () => {
  const previewResult = projectAlphaPreview();

  const declined = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "decline",
  });
  assert.equal(declined.status, "declined");
  assert.equal(declined.confirmation?.status, "declined");
  assert.equal(declined.confirmation?.resultingLifecycleIntent, undefined);

  const cancelled = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "cancel",
  });
  assert.equal(cancelled.status, "cancelled");
  assert.equal(cancelled.confirmation?.status, "cancelled");
  assert.notEqual(declined.status, cancelled.status);
});

test("13. acknowledgments are never auto-created", () => {
  assert.doesNotMatch(source, /acknowledged:\s*true/);
  const previewResult = projectAlphaPreview({ priority: "critical" });
  const result = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "evaluate",
  });
  assert.equal(result.confirmation?.status, "not-ready");
  assert.equal(
    result.confirmation?.readiness.reviewRequirements.some(
      (entry) =>
        entry.requiredAcknowledgment === "accepted-critical-priority",
    ),
    true,
  );
});

test("14. immutability and determinism", () => {
  const previewResult = projectAlphaPreview();
  const frozenWarnings = previewResult.warnings;
  const first = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
  });
  const second = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
  });

  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.confirmation));
  assert.ok(Object.isFrozen(first.confirmation?.scope));
  assert.ok(Object.isFrozen(first.confirmation?.fingerprint));
  assert.equal(previewResult.warnings, frozenWarnings);

  assert.ok(Object.isFrozen(confirmationStatuses));
  assert.ok(Object.isFrozen(issueCodes));
  assert.ok(Object.isFrozen(confirmationPolicy));
  assert.ok(Object.isFrozen(guarantees));
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(module));
});

test("15. registry / policy / guarantees / verification", () => {
  assert.equal(registry.sectionCount, 13);
  assert.deepEqual([...registry.sections], [
    "Identity",
    "ConfirmationStatuses",
    "ConfirmationModes",
    "ConfirmationReadiness",
    "SafetyStatuses",
    "SafetySeverities",
    "SafetyIssueDomains",
    "SafetyIssueCodes",
    "AcknowledgmentKinds",
    "ReviewRequirements",
    "ConfirmationPolicy",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.confirmationStatusCount, 5);
  assert.equal(registry.confirmationModeCount, 3);
  assert.equal(registry.confirmationReadinessStateCount, 3);
  assert.equal(registry.safetyStatusCount, 3);
  assert.equal(registry.safetySeverityCount, 4);
  assert.equal(registry.safetyIssueDomainCount, 10);
  assert.equal(registry.safetyIssueCodeCount, 16);
  assert.equal(registry.acknowledgmentKindCount, 4);
  assert.equal(registry.reviewRequirementKindCount, 4);
  assert.equal(registry.confirmationPolicyRuleCount, policyRules.length);
  assert.equal(registry.guaranteeCount, 17);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, apiNames.length);

  assert.deepEqual(
    getRuntimeExecutiveActionConfirmationSafetyRegistry(),
    registry,
  );
  assert.deepEqual(
    getRuntimeExecutiveActionConfirmationSafetyGuarantees(),
    guarantees,
  );
  assert.deepEqual(
    getRuntimeExecutiveActionConfirmationPolicy(),
    confirmationPolicy,
  );

  assert.ok(apiNames.includes("resolveRuntimeExecutiveActionConfirmation"));
  assert.ok(apiNames.includes("evaluateRuntimeExecutiveActionSafety"));
  assert.ok(
    apiNames.includes("evaluateRuntimeExecutiveActionConfirmationReadiness"),
  );

  const verification = verifyRuntimeExecutiveActionConfirmationSafety();
  assert.equal(verification.ok, true);
  assert.equal(verification.fingerprintDeterministic, true);
  assert.equal(verification.scopeStable, true);
  assert.equal(verification.criticalActionSafe, true);
  assert.equal(verification.ambiguityBlocking, true);
  assert.equal(verification.acknowledgmentExplicit, true);
  assert.equal(verification.dispatchFree, true);
  assert.equal(verification.aiIndependent, true);
  assert.equal(verification.rendererIndependent, true);
  assert.equal(verification.providerIndependent, true);
  assert.equal(verification.transportIndependent, true);
});

test("16. no dispatch on successful confirmation", () => {
  const previewResult = projectAlphaPreview();
  const result = resolveRuntimeExecutiveActionConfirmation({
    previewResult,
    decision: "confirm",
  });
  assert.equal(result.status, "accepted");
  assert.equal(result.confirmation?.resultingLifecycleIntent, "confirmed");
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(module.dispatchFree, true);
  assert.doesNotMatch(source, /\bexecute\s*\(/);
  assert.doesNotMatch(source, /\bpublishExternally\s*\(/);
  assert.doesNotMatch(source, /\bcallAgent\s*\(/);
});
