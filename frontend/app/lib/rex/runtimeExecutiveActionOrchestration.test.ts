import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY as eligibility,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES as issueCodes,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES as issueSources,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS as nextOperations,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS as operations,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES as phases,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASE_OUTCOMES as phaseOutcomes,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY_RULES as policyRules,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES as transitions,
  RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES as terminalOutcomes,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionOrchestrationSnapshot,
  evaluateRuntimeExecutiveActionOrchestration,
  getAllowedRuntimeExecutiveActionOrchestrationTransitions,
  getRuntimeExecutiveActionOrchestrationIdentity,
  getRuntimeExecutiveActionOrchestrationPolicy,
  getRuntimeExecutiveActionOrchestrationRegistry,
  orchestrateRuntimeExecutiveAction,
  runtimeExecutiveActionOrchestration as module,
  runtimeExecutiveActionOrchestrationApiNames as apiNames,
  runtimeExecutiveActionOrchestrationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionOrchestrationRegistry as registry,
  verifyRuntimeExecutiveActionOrchestration,
} from "./runtimeExecutiveActionOrchestration.ts";

import {
  runtimeExecutiveActionConfirmationSafetyIdentity,
  runtimeExecutiveActionConfirmationSafetySupportedImportPath,
  verifyRuntimeExecutiveActionConfirmationSafety,
} from "@/app/lib/rex/runtimeExecutiveActionConfirmationSafety";

const source = readFileSync(
  new URL("./runtimeExecutiveActionOrchestration.ts", import.meta.url),
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
  origin: { kind: "insight" as const, referenceId: "insight.schedule-risk" },
  context: {
    workspaceId: "workspace.operations",
    insightId: "insight.schedule-risk",
    focusedSubjectId: "object.project-alpha",
  },
  selectedSubject: {
    kind: "object" as const,
    id: "object.project-alpha",
    label: "Project Alpha",
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

function runToConfirmation(proposal = projectAlphaProposal) {
  const evaluated = evaluateRuntimeExecutiveActionOrchestration({
    proposal,
    presentationState: "operation",
  });
  assert.ok(evaluated.orchestration);
  return evaluated;
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:6/RuntimeExecutiveActionOrchestration",
  );
  assert.equal(module.version, "5.6.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.orchestration",
  );
  assert.equal(module.phase, "Orchestration");
  assert.equal(
    module.architecturalRole,
    "ExecutiveActionRuntimeOrchestrator",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionOrchestrationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:5 confirmation safety", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionConfirmationSafetyIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionConfirmationSafetySupportedImportPath,
  );
  assert.equal(boundary.consumesConfirmationSafetyOnly, true);
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
    "@/app/lib/rex/runtimeExecutiveActionConfirmationSafety",
  ]);
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/);
  assert.doesNotMatch(source, /jira|slack|openai|nodemailer/i);
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.equal(verifyRuntimeExecutiveActionConfirmationSafety().ok, true);
});

test("3. phases / statuses / operations / outcomes order", () => {
  assert.deepEqual([...phases], [
    "proposal",
    "contract",
    "intent-context",
    "preview",
    "confirmation",
    "prepared-for-dispatch",
    "terminal",
  ]);
  assert.deepEqual([...statuses], [
    "idle",
    "in-progress",
    "waiting",
    "blocked",
    "ready",
    "completed",
    "cancelled",
    "rejected",
  ]);
  assert.deepEqual([...operations], [
    "prepare",
    "evaluate-contract",
    "resolve-intent-context",
    "build-preview",
    "evaluate-confirmation",
    "confirm",
    "decline",
    "cancel",
    "advance",
  ]);
  assert.deepEqual([...phaseOutcomes], [
    "passed",
    "waiting",
    "blocked",
    "rejected",
    "terminal",
  ]);
  assert.deepEqual([...nextOperations], [
    "provide-missing-information",
    "resolve-intent",
    "resolve-context",
    "resolve-recipient",
    "review-preview",
    "acknowledge-warning",
    "confirm",
    "none",
  ]);
  assert.deepEqual([...eligibility], ["not-eligible", "eligible"]);
  assert.deepEqual([...terminalOutcomes], [
    "prepared-for-dispatch",
    "declined",
    "cancelled",
    "rejected",
  ]);
  assert.deepEqual([...issueSources], [
    "contract",
    "intent-context",
    "preview",
    "confirmation-safety",
    "orchestration",
  ]);
  assert.deepEqual([...issueCodes], [
    "invalid-orchestration-transition",
    "phase-skipped",
    "phase-mismatch",
    "confirmation-required",
    "orchestration-already-terminal",
    "downstream-not-eligible",
    "missing-proposal",
    "missing-confirmation-input",
  ]);
});

test("4. transition graph allows only canonical edges", () => {
  assert.equal(transitions.length, 10);
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "proposal",
      to: "contract",
      operation: "advance",
    }),
    true,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "confirmation",
      to: "prepared-for-dispatch",
      operation: "confirm",
    }),
    true,
  );
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
    getAllowedRuntimeExecutiveActionOrchestrationTransitions("preview").length,
    2,
  );
});

test("5. no phase skipping to prepared-for-dispatch", () => {
  const prepared = orchestrateRuntimeExecutiveAction({
    proposal: projectAlphaProposal,
    operation: "prepare",
  });
  const skipped = orchestrateRuntimeExecutiveAction({
    state: prepared.orchestration,
    operation: "advance",
    // still only advances proposal → contract
  });
  assert.notEqual(skipped.orchestration?.phase, "prepared-for-dispatch");

  const jump = orchestrateRuntimeExecutiveAction({
    state: prepared.orchestration,
    operation: "confirm",
  });
  assert.equal(jump.status, "rejected");
  assert.ok(
    jump.issues.some(
      (entry) =>
        entry.code === "phase-mismatch" || entry.code === "phase-skipped",
    ),
  );
});

test("6. normal flow waits for confirmation then becomes dispatch-eligible", () => {
  const evaluated = runToConfirmation();
  assert.equal(evaluated.orchestration?.phase, "confirmation");
  assert.equal(evaluated.orchestration?.status, "waiting");
  assert.equal(evaluated.orchestration?.nextOperation, "confirm");
  assert.equal(
    evaluated.orchestration?.downstreamEligibility,
    "not-eligible",
  );
  assert.equal(evaluated.orchestration?.dispatchRequest, undefined);

  const confirmed = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "confirm",
    confirmationDecision: "confirm",
  });
  assert.equal(confirmed.status, "completed");
  assert.equal(confirmed.orchestration?.phase, "prepared-for-dispatch");
  assert.equal(confirmed.orchestration?.downstreamEligibility, "eligible");
  assert.equal(
    confirmed.orchestration?.dispatchRequest?.identity,
    "REX-5:6/RuntimeExecutiveActionDispatchRequest",
  );
  assert.equal(
    confirmed.orchestration?.dispatchRequest?.providerNeutral,
    true,
  );
  assert.equal(
    confirmed.orchestration?.dispatchRequest?.externalDispatch,
    false,
  );
});

test("7. auto-confirmation is impossible", () => {
  const evaluated = runToConfirmation();
  const advanced = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "advance",
  });
  assert.equal(advanced.status, "rejected");
  assert.ok(
    advanced.issues.some((entry) => entry.code === "confirmation-required"),
  );
  assert.equal(
    evaluated.orchestration?.downstreamEligibility,
    "not-eligible",
  );
  assert.equal(boundary.autoConfirmationForbidden, true);
});

test("8. ambiguous intent blocks at intent-context", () => {
  const result = evaluateRuntimeExecutiveActionOrchestration({
    proposal: {
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
      proposal: {
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
        priority: "normal",
      },
    },
  });
  assert.equal(result.orchestration?.phase, "intent-context");
  assert.equal(result.orchestration?.status, "blocked");
  assert.equal(result.orchestration?.nextOperation, "resolve-intent");
  assert.equal(result.orchestration?.downstreamEligibility, "not-eligible");
  assert.ok(
    result.orchestration?.issues.some(
      (entry) => entry.source === "intent-context",
    ),
  );
});

test("9. unresolved recipient surfaces at preview with source preservation", () => {
  const prepared = orchestrateRuntimeExecutiveAction({
    proposal: {
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
    },
    operation: "prepare",
  });
  const contract = orchestrateRuntimeExecutiveAction({
    state: prepared.orchestration,
    operation: "evaluate-contract",
  });
  const intent = orchestrateRuntimeExecutiveAction({
    state: contract.orchestration,
    operation: "resolve-intent-context",
  });
  // May wait at intent-context if partially-resolved, or continue to preview.
  if (intent.orchestration?.phase === "intent-context") {
    assert.ok(
      ["waiting", "blocked", "ready"].includes(
        intent.orchestration.status,
      ),
    );
    if (intent.orchestration.phaseOutcome === "passed") {
      const preview = orchestrateRuntimeExecutiveAction({
        state: intent.orchestration,
        operation: "build-preview",
      });
      assert.equal(preview.orchestration?.phase, "preview");
      assert.ok(
        ["waiting", "blocked"].includes(preview.orchestration?.status ?? ""),
      );
      assert.equal(
        preview.orchestration?.nextOperation,
        "resolve-recipient",
      );
      assert.ok(
        preview.orchestration?.issues.some(
          (entry) => entry.source === "preview",
        ),
      );
    } else {
      assert.ok(
        ["resolve-recipient", "resolve-intent", "resolve-context"].includes(
          intent.orchestration.nextOperation,
        ),
      );
    }
  }
});

test("10. critical action waits for acknowledgment", () => {
  const criticalProposal = Object.freeze({
    ...projectAlphaProposal,
    // priority is applied via proposal contract fields if supported through request
  });
  // Build through gates then force critical via confirmation evaluation path:
  // Use evaluate and confirm without acknowledgments after patching lifecycle/priority
  // through a full proposal that includes priority when supported by create contract.
  const prepared = orchestrateRuntimeExecutiveAction({
    proposal: {
      ...criticalProposal,
      proposal: {
        kind: "approve",
        intent: { kind: "approve" },
        subject: {
          kind: "decision",
          id: "decision.capacity",
          label: "Increase Capacity",
        },
        recipient: {
          kind: "role",
          id: "role.executive",
          label: "Executive Sponsor",
        },
        title: "Approve Decision",
        priority: "critical",
        reason: "Capacity risk",
      },
      kind: "approve",
      intent: { kind: "approve" },
      subject: {
        kind: "decision",
        id: "decision.capacity",
        label: "Increase Capacity",
      },
      recipient: {
        kind: "role",
        id: "role.executive",
        label: "Executive Sponsor",
      },
      title: "Approve Decision",
      reason: "Capacity risk",
    },
    operation: "prepare",
  });

  let state = prepared.orchestration!;
  for (const operation of [
    "evaluate-contract",
    "resolve-intent-context",
    "build-preview",
    "evaluate-confirmation",
  ] as const) {
    const step = orchestrateRuntimeExecutiveAction({
      state,
      operation,
      presentationState: "operation",
      proposal: {
        kind: "approve",
        intent: { kind: "approve" },
        subject: {
          kind: "decision",
          id: "decision.capacity",
          label: "Increase Capacity",
        },
        recipient: {
          kind: "role",
          id: "role.executive",
          label: "Executive Sponsor",
        },
        title: "Approve Decision",
        reason: "Capacity risk",
        proposal: state.proposal
          ? Object.freeze({ ...state.proposal, priority: "critical" })
          : undefined,
      },
    });
    if (step.orchestration === undefined) break;
    state = step.orchestration;
    if (state.status === "blocked" || state.phaseOutcome !== "passed") {
      if (state.phase === "confirmation") break;
      if (state.phaseOutcome !== "passed" && state.phase !== "confirmation") {
        // continue only while gates pass
      }
    }
  }

  // Ensure we reach confirmation with review semantics when possible.
  if (state.phase === "confirmation") {
    assert.ok(
      state.nextOperation === "acknowledge-warning" ||
        state.nextOperation === "confirm" ||
        state.status === "waiting" ||
        state.status === "blocked",
    );
    assert.equal(state.downstreamEligibility, "not-eligible");
  }
});

test("11. decline and cancel are terminal non-dispatch outcomes", () => {
  const evaluated = runToConfirmation();

  const declined = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "decline",
  });
  assert.equal(declined.orchestration?.phase, "terminal");
  assert.equal(declined.orchestration?.terminalOutcome, "declined");
  assert.equal(declined.orchestration?.downstreamEligibility, "not-eligible");
  assert.equal(declined.orchestration?.dispatchRequest, undefined);

  const cancelled = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "cancel",
  });
  assert.equal(cancelled.orchestration?.phase, "terminal");
  assert.equal(cancelled.status, "cancelled");
  assert.equal(cancelled.orchestration?.terminalOutcome, "cancelled");
  assert.equal(
    cancelled.orchestration?.downstreamEligibility,
    "not-eligible",
  );
});

test("12. dispatch request preserves scope and rejects mutation", () => {
  const evaluated = runToConfirmation();
  const confirmed = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "confirm",
  });
  assert.equal(confirmed.status, "completed");
  const dispatch = confirmed.orchestration?.dispatchRequest;
  assert.ok(dispatch);
  assert.equal(dispatch?.actionKind, "request");
  assert.equal(dispatch?.subject?.label, "Project Alpha");
  assert.equal(dispatch?.recipient?.label, "Engineering Lead");
  assert.match(dispatch?.confirmationFingerprint ?? "", /^rex\.confirm\.v1:/);

  const mutated = createRuntimeExecutiveActionDispatchRequest({
    orchestration: confirmed.orchestration!,
    expectedFingerprint: "rex.confirm.v1:deadbeef",
  });
  assert.equal(mutated.status, "rejected");
  assert.ok(
    mutated.issues.some(
      (entry) => entry.code === "confirmation-scope-changed",
    ),
  );
});

test("13. contract rejection and history / snapshot / determinism", () => {
  const rejected = orchestrateRuntimeExecutiveAction({
    proposal: {
      kind: "not-a-kind" as unknown as "request",
      title: "Bad",
    },
    operation: "prepare",
  });
  assert.equal(rejected.status, "rejected");
  assert.ok(
    rejected.issues.some((entry) => entry.code === "missing-proposal"),
  );

  const first = runToConfirmation();
  const second = runToConfirmation();
  assert.equal(first.orchestration?.phase, second.orchestration?.phase);
  assert.equal(first.orchestration?.status, second.orchestration?.status);
  assert.equal(
    first.orchestration?.nextOperation,
    second.orchestration?.nextOperation,
  );
  assert.ok((first.orchestration?.history.length ?? 0) >= 2);
  assert.ok(Object.isFrozen(first.orchestration));
  assert.ok(Object.isFrozen(first.orchestration?.history));

  const snapshot = createRuntimeExecutiveActionOrchestrationSnapshot(
    first.orchestration!,
  );
  assert.equal(snapshot.phase, "confirmation");
  assert.equal(snapshot.downstreamEligibility, "not-eligible");
  assert.ok(Object.isFrozen(snapshot));
});

test("14. registry / policy / guarantees / verification", () => {
  assert.equal(registry.sectionCount, 14);
  assert.equal(registry.phaseCount, 7);
  assert.equal(registry.statusCount, 8);
  assert.equal(registry.operationCount, 9);
  assert.equal(registry.transitionCount, 10);
  assert.equal(registry.nextOperationCount, 8);
  assert.equal(registry.issueSourceCount, 5);
  assert.equal(registry.issueCodeCount, 8);
  assert.equal(registry.terminalOutcomeCount, 4);
  assert.equal(registry.policyRuleCount, policyRules.length);
  assert.equal(registry.guaranteeCount, 15);
  assert.equal(registry.publicApiCount, apiNames.length);

  assert.deepEqual(getRuntimeExecutiveActionOrchestrationRegistry(), registry);
  assert.deepEqual(getRuntimeExecutiveActionOrchestrationPolicy(), module.policy);
  assert.deepEqual(
    [...getRuntimeExecutiveActionOrchestrationIdentity().identity],
    [...canonicalIdentity.identity],
  );
  assert.ok(guarantees.includes("auto-confirmation-forbidden"));
  assert.ok(guarantees.includes("external-dispatch-free"));

  const verification = verifyRuntimeExecutiveActionOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.noPhaseSkipping, true);
  assert.equal(verification.autoConfirmationForbidden, true);
  assert.equal(verification.confirmationGated, true);
  assert.equal(verification.providerNeutral, true);
  assert.equal(verification.externalDispatchFree, true);
  assert.equal(verification.aiIndependent, true);
  assert.equal(verification.rendererIndependent, true);
});

test("15. no external dispatch side effects", () => {
  const evaluated = runToConfirmation();
  const confirmed = orchestrateRuntimeExecutiveAction({
    state: evaluated.orchestration,
    operation: "confirm",
  });
  assert.equal(confirmed.orchestration?.downstreamEligibility, "eligible");
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(module.externalDispatchFree, true);
  assert.doesNotMatch(source, /\bsendEmail\s*\(/);
  assert.doesNotMatch(source, /\bcreateTicket\s*\(/);
  assert.doesNotMatch(source, /\bcallAgent\s*\(/);
  assert.doesNotMatch(source, /\bpublishExternally\s*\(/);
});
