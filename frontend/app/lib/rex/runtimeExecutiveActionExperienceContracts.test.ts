import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_CONTRACTS_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES as families,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES as issueCodes,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_PRIORITIES as contractPriorities,
  RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES as preparationStatuses,
  createRuntimeExecutiveActionContextContract,
  createRuntimeExecutiveActionIntentContract,
  createRuntimeExecutiveActionLifecycleContract,
  createRuntimeExecutiveActionPreparationRequest,
  createRuntimeExecutiveActionPriorityContract,
  createRuntimeExecutiveActionProposalContract,
  createRuntimeExecutiveActionRecipientContract,
  createRuntimeExecutiveActionSubjectContract,
  createRuntimeExecutiveActionTargetContract,
  evaluateRuntimeExecutiveActionLifecycleContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  getRuntimeExecutiveActionExperienceContractsGuarantees,
  getRuntimeExecutiveActionExperienceContractsIdentity,
  getRuntimeExecutiveActionExperienceContractsRegistry,
  runtimeExecutiveActionExperienceContracts as contracts,
  runtimeExecutiveActionExperienceContractsApiNames as apiNames,
  runtimeExecutiveActionExperienceContractsCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionExperienceContractsRegistry as registry,
  verifyRuntimeExecutiveActionExperienceContracts,
} from "./runtimeExecutiveActionExperienceContracts.ts";

import {
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  canTransitionRuntimeExecutiveActionLifecycle,
  createRuntimeExecutiveActionContext,
  createRuntimeExecutiveActionId,
  createRuntimeExecutiveActionIntent,
  createRuntimeExecutiveActionRecipient,
  createRuntimeExecutiveActionSubject,
  createRuntimeExecutiveActionTarget,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionExperienceFoundationSupportedImportPath,
  verifyRuntimeExecutiveActionExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveActionExperienceContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

function projectAlphaProposal(
  overrides?: Partial<
    Parameters<typeof createRuntimeExecutiveActionProposalContract>[0]
  >,
) {
  return createRuntimeExecutiveActionProposalContract({
    actionId: createRuntimeExecutiveActionId({
      key: "project-alpha.request-update",
    }),
    kind: "request",
    subject: createRuntimeExecutiveActionSubject({
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
      referenceId: "nexora.object.project-alpha",
    }),
    target: createRuntimeExecutiveActionTarget({
      kind: "team",
      id: "team.engineering",
      label: "Engineering Team",
    }),
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "role",
      id: "role.engineering-lead",
      label: "Engineering Lead",
    }),
    intent: createRuntimeExecutiveActionIntent({
      kind: "request-information",
    }),
    priority: "high",
    title: "Request Update",
    reason: "Schedule risk increasing",
    context: createRuntimeExecutiveActionContext({
      workspaceId: "workspace.alpha",
      focusedSubjectId: "object.project-alpha",
      insightId: "insight.schedule-risk",
    }),
    lifecycle: "draft",
    ...overrides,
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    contracts.identity,
    "REX-5:2/RuntimeExecutiveActionExperienceContracts",
  );
  assert.equal(contracts.version, "5.2.0");
  assert.equal(
    contracts.namespace,
    "nexora.rex.action-experience.contracts",
  );
  assert.equal(contracts.phase, "Contracts");
  assert.equal(
    contracts.architecturalRole,
    "ExecutiveActionExperienceContractLayer",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionExperienceContractsIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:1 foundation", () => {
  assert.equal(
    contracts.upstreamDependency,
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    runtimeExecutiveActionExperienceFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    runtimeExecutiveActionExperienceFoundationSupportedImportPath,
  );
  assert.equal(boundary.consumesFoundationOnly, true);
  assert.equal(boundary.importsRex4Directly, false);
  assert.equal(boundary.importsRex3Directly, false);
  assert.equal(boundary.importsRex2Directly, false);
  assert.equal(boundary.importsRex1Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionExperienceFoundation",
  ]);

  assert.equal(verifyRuntimeExecutiveActionExperienceFoundation().ok, true);
});

test("3. canonical contract families", () => {
  assert.deepEqual([...families], [
    "ActionProposal",
    "ActionSubject",
    "ActionTarget",
    "ActionRecipient",
    "ActionIntent",
    "ActionPriority",
    "ActionContext",
    "ActionLifecycle",
    "ActionReadiness",
    "ActionPreparation",
    "ActionOutcome",
  ]);
  assert.equal(registry.contractFamilyCount, 11);
});

test("4. proposal contracts: complete and incomplete remain structurally valid", () => {
  const complete = evaluateRuntimeExecutiveActionProposalContract(
    projectAlphaProposal(),
  );
  assert.equal(complete.valid, true);
  assert.equal(complete.value?.kind, "request");
  assert.equal(complete.value?.title, "Request Update");

  const incomplete = evaluateRuntimeExecutiveActionProposalContract({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: { kind: "unresolved", label: "ops manager" },
    priority: "high",
    title: "Request Update",
    reason: "Schedule risk increasing",
  });
  assert.equal(incomplete.valid, true);
  assert.equal(incomplete.value?.intent, undefined);
  assert.ok(
    incomplete.issues.some((entry) => entry.code === "incomplete-action"),
  );

  const invalid = evaluateRuntimeExecutiveActionProposalContract({
    kind: "create-jira-ticket",
    subject: { kind: "object", id: "object.project-alpha" },
  });
  assert.equal(invalid.valid, false);
  assert.ok(
    invalid.issues.some((entry) => entry.code === "invalid-action-kind"),
  );
});

test("5. subject / target / recipient remain distinct; unresolved recipients valid", () => {
  const subject = createRuntimeExecutiveActionSubjectContract({
    subject: createRuntimeExecutiveActionSubject({
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    }),
  });
  const target = createRuntimeExecutiveActionTargetContract({
    target: createRuntimeExecutiveActionTarget({
      kind: "project",
      id: "object.project-alpha",
      label: "Project Alpha",
    }),
  });
  const recipient = createRuntimeExecutiveActionRecipientContract({
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "unresolved",
      label: "responsible operations manager",
    }),
  });

  assert.equal(subject.subject.kind, "decision");
  assert.equal(target.target.kind, "project");
  assert.equal(recipient.recipient.kind, "unresolved");
  assert.notEqual(subject.subject.kind, target.target.kind);
  assert.notDeepEqual(target.target, recipient.recipient);

  const proposal = evaluateRuntimeExecutiveActionProposalContract({
    kind: "send",
    subject: subject.subject,
    target: target.target,
    recipient: recipient.recipient,
    intent: { kind: "inform" },
    priority: "critical",
    title: "Send Decision",
  });
  assert.equal(proposal.valid, true);
  assert.equal(proposal.value?.recipient?.kind, "unresolved");
});

test("6. action kind and intent remain independent", () => {
  const intent = createRuntimeExecutiveActionIntentContract({
    intent: createRuntimeExecutiveActionIntent({
      kind: "request-information",
    }),
  });
  const proposal = projectAlphaProposal({
    kind: "send",
    intent: intent.intent,
  });
  assert.equal(proposal.kind, "send");
  assert.equal(proposal.intent?.kind, "request-information");

  const evaluated = evaluateRuntimeExecutiveActionProposalContract(proposal);
  assert.equal(evaluated.valid, true);
  assert.equal(evaluated.value?.kind, "send");
  assert.equal(evaluated.value?.intent?.kind, "request-information");
  assert.equal(contracts.kindIntentSeparated, true);
});

test("7. priority consumes foundation vocabulary; context preserved", () => {
  assert.equal(contractPriorities, RUNTIME_EXECUTIVE_ACTION_PRIORITIES);
  const priority = createRuntimeExecutiveActionPriorityContract({
    priority: "high",
  });
  assert.equal(priority.priority, "high");
  assert.throws(
    () =>
      createRuntimeExecutiveActionPriorityContract({
        priority: "urgent" as unknown as "high",
      }),
    /known action priority/,
  );

  const contextInput = {
    workspaceId: "workspace.alpha",
    focusedSubjectId: "object.project-alpha",
    selectedSubjectId: "object.project-alpha",
    insightId: "insight.schedule-risk",
    decisionId: "decision.keep-focus",
    scenarioId: "scenario.capacity",
  };
  const context = createRuntimeExecutiveActionContextContract({
    context: createRuntimeExecutiveActionContext(contextInput),
  });
  assert.deepEqual(
    {
      workspaceId: context.context.workspaceId,
      focusedSubjectId: context.context.focusedSubjectId,
      selectedSubjectId: context.context.selectedSubjectId,
      insightId: context.context.insightId,
      decisionId: context.context.decisionId,
      scenarioId: context.context.scenarioId,
    },
    contextInput,
  );

  // Insight must not be reinterpreted into an action automatically.
  assert.equal(boundary.reinterpretsUpstreamInsight, false);
  assert.equal(boundary.introducesIntentInference, false);
});

test("8. lifecycle contracts align with REX-5:1 transitions", () => {
  const allowed = evaluateRuntimeExecutiveActionLifecycleContract({
    current: "draft",
    requested: "prepared",
  });
  assert.equal(allowed.valid, true);
  assert.equal(allowed.lifecycle?.allowed, true);
  assert.equal(
    canTransitionRuntimeExecutiveActionLifecycle("draft", "prepared"),
    true,
  );

  const rejected = evaluateRuntimeExecutiveActionLifecycleContract({
    current: "cancelled",
    requested: "confirmed",
  });
  assert.equal(rejected.valid, false);
  assert.equal(rejected.lifecycle?.allowed, false);
  assert.ok(
    rejected.issues.some(
      (entry) => entry.code === "invalid-lifecycle-transition",
    ),
  );

  const contract = createRuntimeExecutiveActionLifecycleContract({
    current: "prepared",
    requested: "pending-confirmation",
  });
  assert.equal(contract.current, "prepared");
  assert.equal(contract.requested, "pending-confirmation");
});

test("9. incomplete ≠ invalid for readiness and preparation", () => {
  const unresolvedProposal = projectAlphaProposal({
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "unresolved",
      label: "responsible operations manager",
    }),
  });
  const proposalEval =
    evaluateRuntimeExecutiveActionProposalContract(unresolvedProposal);
  assert.equal(proposalEval.valid, true);

  const preparation = evaluateRuntimeExecutiveActionPreparationContract(
    createRuntimeExecutiveActionPreparationRequest({
      draft: unresolvedProposal,
      requestedLifecycle: "prepared",
      requireResolvedRecipient: true,
    }),
  );
  assert.equal(preparation.status, "incomplete");
  assert.equal(preparation.valid, true);
  assert.equal(preparation.incomplete, true);
  assert.ok(preparation.missing.includes("resolved-recipient"));

  const accepted = evaluateRuntimeExecutiveActionPreparationContract({
    draft: projectAlphaProposal(),
    requestedLifecycle: "prepared",
    requireResolvedRecipient: true,
  });
  assert.equal(accepted.status, "accepted");
  assert.equal(accepted.valid, true);
  assert.equal(accepted.incomplete, false);

  const rejected = evaluateRuntimeExecutiveActionPreparationContract({
    draft: {
      kind: "send-email",
      subject: { kind: "object", id: "object.project-alpha" },
      title: "Bad",
    },
  });
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.valid, false);
  assert.equal(rejected.incomplete, false);

  assert.deepEqual([...preparationStatuses], [
    "accepted",
    "incomplete",
    "rejected",
  ]);
  assert.equal(contracts.incompleteDistinctFromInvalid, true);
});

test("10. Project Alpha contract flow produces valid proposal + accepted preparation", () => {
  const proposal = projectAlphaProposal();
  const proposalEval = evaluateRuntimeExecutiveActionProposalContract(proposal);
  assert.equal(proposalEval.valid, true);
  assert.equal(proposalEval.value?.subject?.label, "Project Alpha");
  assert.equal(proposalEval.value?.target?.label, "Engineering Team");
  assert.equal(proposalEval.value?.recipient?.label, "Engineering Lead");
  assert.equal(proposalEval.value?.intent?.kind, "request-information");
  assert.equal(proposalEval.value?.priority, "high");
  assert.equal(proposalEval.value?.context?.insightId, "insight.schedule-risk");

  const preparation = evaluateRuntimeExecutiveActionPreparationContract({
    draft: proposal,
    requestedLifecycle: "prepared",
  });
  assert.equal(preparation.status, "accepted");
  assert.equal(preparation.value?.title, "Request Update");
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(contracts.dispatchFree, true);
});

test("11. issue codes are deterministic and ordered", () => {
  assert.deepEqual([...issueCodes], [
    "missing-action",
    "invalid-action-kind",
    "missing-subject",
    "invalid-subject",
    "invalid-target",
    "invalid-recipient",
    "missing-intent",
    "invalid-intent",
    "invalid-priority",
    "invalid-context",
    "invalid-lifecycle-state",
    "invalid-lifecycle-transition",
    "incomplete-action",
  ]);
  assert.equal(registry.issueCodeCount, 13);
});

test("12. immutability and determinism", () => {
  const input = {
    kind: "request" as const,
    subject: {
      kind: "object" as const,
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: {
      kind: "unresolved" as const,
      label: "ops manager",
    },
    intent: { kind: "request-information" as const },
    priority: "high" as const,
    title: "Request Update",
  };
  const first = evaluateRuntimeExecutiveActionProposalContract(input);
  input.subject.label = "MUTATED";
  input.title = "MUTATED";
  const second = evaluateRuntimeExecutiveActionProposalContract({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: { kind: "unresolved", label: "ops manager" },
    intent: { kind: "request-information" },
    priority: "high",
    title: "Request Update",
  });

  assert.equal(first.valid, true);
  assert.equal(first.value?.subject?.label, "Project Alpha");
  assert.equal(first.value?.title, "Request Update");
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.value), true);
  assert.equal(Object.isFrozen(families), true);
  assert.equal(Object.isFrozen(guarantees), true);

  const a = verifyRuntimeExecutiveActionExperienceContracts();
  const b = verifyRuntimeExecutiveActionExperienceContracts();
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);

  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /crypto\.randomUUID|uuidv4|nanoid/i);
});

test("13. registry / guarantees / public surface", () => {
  assert.deepEqual([...guarantees], [
    "deterministic",
    "immutable",
    "foundation-aligned",
    "contract-composable",
    "progressive-construction-safe",
    "incomplete-distinct-from-invalid",
    "subject-target-recipient-separated",
    "kind-intent-separated",
    "context-preserving",
    "renderer-independent",
    "provider-independent",
    "transport-independent",
    "side-effect-free",
    "dispatch-free",
  ]);
  assert.equal(
    getRuntimeExecutiveActionExperienceContractsGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveActionExperienceContractsRegistry(),
    registry,
  );
  assert.deepEqual([...registry.sections], [
    "Identity",
    "ContractFamilies",
    "ProposalContracts",
    "SubjectContracts",
    "TargetContracts",
    "RecipientContracts",
    "IntentContracts",
    "PriorityContracts",
    "ContextContracts",
    "LifecycleContracts",
    "ReadinessContracts",
    "PreparationContracts",
    "ResultContracts",
    "IssueCodes",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.sectionCount, 16);
  assert.equal(registry.proposalContractCount, 1);
  assert.equal(registry.subjectContractCount, 1);
  assert.equal(registry.targetContractCount, 1);
  assert.equal(registry.recipientContractCount, 1);
  assert.equal(registry.intentContractCount, 1);
  assert.equal(registry.priorityContractCount, 1);
  assert.equal(registry.contextContractCount, 1);
  assert.equal(registry.lifecycleContractCount, 1);
  assert.equal(registry.readinessContractCount, 1);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.ok(
    apiNames.includes("evaluateRuntimeExecutiveActionProposalContract"),
  );
  assert.ok(
    apiNames.includes("evaluateRuntimeExecutiveActionPreparationContract"),
  );
});

test("14. architectural boundary: no renderer / transport / upstream REX imports", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /from\s+["'][^"']*jira[^"']*["']/i);
  assert.doesNotMatch(source, /from\s+["'][^"']*slack[^"']*["']/i);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:nodemailer|@sendgrid|postmark)[^"']*["']/i,
  );
  assert.doesNotMatch(source, /from\s+["'](?:axios|node-fetch|graphql)["']/);
  assert.doesNotMatch(source, /from\s+["'](?:pg|mongodb|prisma|sqlite3)["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Advisor|Stage)Experience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.equal(contracts.rendererIndependent, true);
  assert.equal(contracts.providerIndependent, true);
  assert.equal(contracts.transportIndependent, true);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.introducesUiBehavior, false);
  assert.equal(boundary.introducesExternalIntegration, false);
});

test("15. no side effects / no external dispatch", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /from\s+["']node:fs["']/);
  assert.doesNotMatch(
    source,
    /publishExternally|createTicket|sendEmail|sendMessage|assignExternally/,
  );
  assert.equal(contracts.sideEffectFree, true);
  assert.equal(contracts.deterministic, true);
  assert.equal(boundary.introducesOrchestration, false);
  assert.equal(boundary.introducesRecipientResolution, false);
  assert.equal(boundary.introducesConfirmationWorkflow, false);
});

test("16. verification / readiness for REX-5:3", () => {
  const verification = verifyRuntimeExecutiveActionExperienceContracts();
  assert.equal(verification.ok, true);
  assert.equal(verification.upstreamFoundationOk, true);
  assert.equal(verification.incompleteDistinctFromInvalid, true);
  assert.equal(verification.subjectTargetRecipientSeparated, true);
  assert.equal(verification.kindIntentSeparated, true);
  assert.equal(verification.contextPreserving, true);
  assert.equal(verification.lifecycleAligned, true);
  assert.equal(verification.dispatchFree, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.contractFamilyCount, 11);
  assert.equal(verification.issueCodeCount, 13);
  assert.equal(verification.preparationResultStatusCount, 3);
  assert.equal(verification.guaranteeCount, 14);
  assert.equal(verification.sectionCount, 16);
  assert.equal(
    contracts.architecturalStatus,
    "REX-5:2 Runtime Executive Action Experience Contracts — ContractsReady",
  );
});
