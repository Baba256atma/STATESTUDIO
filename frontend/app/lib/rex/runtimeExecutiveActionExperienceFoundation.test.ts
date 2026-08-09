import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_FOUNDATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS as intentKinds,
  RUNTIME_EXECUTIVE_ACTION_KINDS as actionKinds,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES as lifecycleStates,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS as lifecycleTransitions,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES as priorities,
  RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES as readinessStatuses,
  RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS as recipientKinds,
  RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS as targetKinds,
  canTransitionRuntimeExecutiveActionLifecycle,
  createRuntimeExecutiveAction,
  createRuntimeExecutiveActionContext,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionId,
  createRuntimeExecutiveActionIntent,
  createRuntimeExecutiveActionRecipient,
  createRuntimeExecutiveActionSubject,
  createRuntimeExecutiveActionTarget,
  evaluateRuntimeExecutiveActionReadiness,
  getAllowedRuntimeExecutiveActionLifecycleTransitions,
  getRuntimeExecutiveActionExperienceFoundationGuarantees,
  getRuntimeExecutiveActionExperienceFoundationIdentity,
  getRuntimeExecutiveActionExperienceFoundationRegistry,
  isRuntimeExecutiveActionIntentKind,
  isRuntimeExecutiveActionKind,
  isRuntimeExecutiveActionLifecycleState,
  isRuntimeExecutiveActionPriority,
  isRuntimeExecutiveActionRecipientKind,
  isRuntimeExecutiveActionSubjectKind,
  isRuntimeExecutiveActionTargetKind,
  normalizeRuntimeExecutiveActionDraft,
  runtimeExecutiveActionExperienceFoundation as foundation,
  runtimeExecutiveActionExperienceFoundationApiNames as apiNames,
  runtimeExecutiveActionExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionExperienceFoundationRegistry as registry,
  validateRuntimeExecutiveActionDraft,
  verifyRuntimeExecutiveActionExperienceFoundation,
} from "./runtimeExecutiveActionExperienceFoundation.ts";

import {
  runtimeExecutiveInsightExperiencePublicIndexIdentity,
  runtimeExecutiveInsightExperiencePublicIndexSupportedImportPath,
  verifyRuntimeExecutiveInsightExperiencePublicIndex,
} from "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveActionExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

function projectAlphaDraft(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveActionDraft>[0]>,
) {
  return createRuntimeExecutiveActionDraft({
    actionId: createRuntimeExecutiveActionId({ key: "project-alpha.request-update" }),
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
    lifecycle: "draft",
    title: "Request Update",
    reason: "Schedule risk increasing",
    context: createRuntimeExecutiveActionContext({
      workspaceId: "workspace.alpha",
      focusedSubjectId: "object.project-alpha",
      insightId: "insight.schedule-risk",
    }),
    createdAtIso: "2026-08-09T12:00:00.000Z",
    orderKey: "001",
    ...overrides,
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    foundation.identity,
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
  );
  assert.equal(foundation.version, "5.1.0");
  assert.equal(
    foundation.namespace,
    "nexora.rex.action-experience.foundation",
  );
  assert.equal(foundation.phase, "Foundation");
  assert.equal(
    foundation.architecturalRole,
    "ExecutiveActionExperienceFoundation",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-4:9 public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeExecutiveInsightExperiencePublicIndexIdentity,
  );
  assert.equal(
    foundation.dependencyPath,
    runtimeExecutiveInsightExperiencePublicIndexSupportedImportPath,
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(boundary.importsRex4InternalDirectly, false);
  assert.equal(boundary.importsRex3Directly, false);
  assert.equal(boundary.importsRex2Directly, false);
  assert.equal(boundary.importsRex1Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex",
  ]);

  const upstream = verifyRuntimeExecutiveInsightExperiencePublicIndex();
  assert.equal(upstream.ok, true);
});

test("3. canonical action-kind vocabulary", () => {
  assert.deepEqual([...actionKinds], [
    "request",
    "assign",
    "send",
    "approve",
    "review",
    "escalate",
    "follow-up",
  ]);
  assert.equal(isRuntimeExecutiveActionKind("request"), true);
  assert.equal(isRuntimeExecutiveActionKind("create-jira-ticket"), false);
  assert.equal(isRuntimeExecutiveActionKind("send-slack-message"), false);
  assert.equal(registry.actionKindCount, 7);
});

test("4. canonical subject / target / recipient vocabularies remain separate", () => {
  assert.deepEqual([...subjectKinds], [
    "object",
    "goal",
    "problem",
    "scenario",
    "decision",
    "execution",
    "insight",
    "pack",
    "workspace",
  ]);
  assert.deepEqual([...targetKinds], [
    "person",
    "team",
    "role",
    "project",
    "workspace",
    "object",
    "decision",
    "external-system",
  ]);
  assert.deepEqual([...recipientKinds], [
    "person",
    "team",
    "role",
    "agent",
    "system",
    "unresolved",
  ]);
  assert.equal(isRuntimeExecutiveActionSubjectKind("insight"), true);
  assert.equal(isRuntimeExecutiveActionTargetKind("external-system"), true);
  assert.equal(isRuntimeExecutiveActionRecipientKind("unresolved"), true);
  assert.equal(isRuntimeExecutiveActionSubjectKind("unresolved"), false);
  assert.equal(isRuntimeExecutiveActionTargetKind("agent"), false);
  assert.equal(isRuntimeExecutiveActionRecipientKind("project"), false);

  const subject = createRuntimeExecutiveActionSubject({
    kind: "object",
    id: "object.project-alpha",
    label: "Project Alpha",
  });
  const target = createRuntimeExecutiveActionTarget({
    kind: "team",
    id: "team.engineering",
    label: "Engineering Team",
  });
  const recipient = createRuntimeExecutiveActionRecipient({
    kind: "role",
    id: "role.engineering-lead",
    label: "Engineering Lead",
  });
  assert.notEqual(subject.kind, target.kind);
  assert.notDeepEqual(subject, recipient);
  assert.notDeepEqual(target, recipient);
});

test("5. action kind and action intent remain distinct", () => {
  assert.deepEqual([...intentKinds], [
    "inform",
    "request-information",
    "request-action",
    "delegate",
    "review",
    "approve",
    "reject",
    "escalate",
    "coordinate",
    "follow-up",
  ]);
  assert.equal(isRuntimeExecutiveActionKind("send"), true);
  assert.equal(isRuntimeExecutiveActionIntentKind("request-information"), true);
  assert.equal(isRuntimeExecutiveActionIntentKind("send"), false);
  assert.equal(isRuntimeExecutiveActionKind("request-information"), false);
  assert.equal(isRuntimeExecutiveActionKind("delegate"), false);
  assert.equal(isRuntimeExecutiveActionIntentKind("delegate"), true);

  const action = createRuntimeExecutiveAction({
    actionId: createRuntimeExecutiveActionId({ key: "send.decision" }),
    kind: "send",
    subject: createRuntimeExecutiveActionSubject({
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    }),
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "role",
      id: "role.operations-manager",
      label: "Operations Manager",
    }),
    intent: createRuntimeExecutiveActionIntent({ kind: "inform" }),
    priority: "critical",
    lifecycle: "pending-confirmation",
    title: "Send Decision",
  });
  assert.equal(action.kind, "send");
  assert.equal(action.intent.kind, "inform");
});

test("6. priorities and lifecycle vocabulary", () => {
  assert.deepEqual([...priorities], ["low", "normal", "high", "critical"]);
  assert.deepEqual([...lifecycleStates], [
    "draft",
    "prepared",
    "pending-confirmation",
    "confirmed",
    "cancelled",
  ]);
  assert.equal(isRuntimeExecutiveActionPriority("high"), true);
  assert.equal(isRuntimeExecutiveActionPriority(1 as unknown as string), false);
  assert.equal(isRuntimeExecutiveActionLifecycleState("confirmed"), true);
  assert.equal(isRuntimeExecutiveActionLifecycleState("executed"), false);
  assert.equal(registry.priorityCount, 4);
  assert.equal(registry.lifecycleStateCount, 5);
});

test("7. lifecycle transitions are explicit and deterministic", () => {
  assert.equal(lifecycleTransitions.length, 6);
  assert.equal(registry.lifecycleTransitionCount, 6);

  assert.deepEqual(
    [...getAllowedRuntimeExecutiveActionLifecycleTransitions("draft")],
    ["prepared", "cancelled"],
  );
  assert.deepEqual(
    [...getAllowedRuntimeExecutiveActionLifecycleTransitions("prepared")],
    ["pending-confirmation", "cancelled"],
  );
  assert.deepEqual(
    [
      ...getAllowedRuntimeExecutiveActionLifecycleTransitions(
        "pending-confirmation",
      ),
    ],
    ["confirmed", "cancelled"],
  );
  assert.deepEqual(
    [...getAllowedRuntimeExecutiveActionLifecycleTransitions("confirmed")],
    [],
  );
  assert.deepEqual(
    [...getAllowedRuntimeExecutiveActionLifecycleTransitions("cancelled")],
    [],
  );

  assert.equal(
    canTransitionRuntimeExecutiveActionLifecycle("draft", "prepared"),
    true,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionLifecycle("draft", "confirmed"),
    false,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionLifecycle("confirmed", "cancelled"),
    false,
  );
  assert.equal(
    canTransitionRuntimeExecutiveActionLifecycle(
      "pending-confirmation",
      "confirmed",
    ),
    true,
  );

  // Transition helpers never mutate an action.
  const action = projectAlphaDraft({ lifecycle: "draft" });
  canTransitionRuntimeExecutiveActionLifecycle("draft", "prepared");
  assert.equal(action.lifecycle, "draft");
});

test("8. draft construction supports incomplete and ready preparation states", () => {
  const incomplete = createRuntimeExecutiveActionDraft({
    title: "Request Update",
    subject: createRuntimeExecutiveActionSubject({
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    }),
    priority: "high",
    reason: "Schedule risk",
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "unresolved",
      label: "responsible operations manager",
    }),
  });
  assert.equal(incomplete.lifecycle, "draft");
  assert.equal(incomplete.kind, undefined);
  assert.equal(incomplete.intent, undefined);
  assert.equal(incomplete.recipient?.kind, "unresolved");

  const incompleteReadiness =
    evaluateRuntimeExecutiveActionReadiness(incomplete);
  assert.equal(incompleteReadiness.status, "incomplete");
  assert.deepEqual([...incompleteReadiness.missing], ["kind", "intent"]);

  const missingRecipient = createRuntimeExecutiveActionDraft({
    kind: "request",
    subject: createRuntimeExecutiveActionSubject({
      kind: "object",
      id: "object.project-alpha",
    }),
    intent: createRuntimeExecutiveActionIntent({
      kind: "request-information",
    }),
    title: "Request Update",
    priority: "high",
  });
  const readinessMissingRecipient =
    evaluateRuntimeExecutiveActionReadiness(missingRecipient);
  assert.equal(readinessMissingRecipient.status, "incomplete");
  assert.deepEqual([...readinessMissingRecipient.missing], ["recipient"]);

  const readyDraft = projectAlphaDraft({
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "unresolved",
      label: "responsible operations manager",
    }),
  });
  const ready = evaluateRuntimeExecutiveActionReadiness(readyDraft);
  assert.equal(ready.status, "ready");
  assert.deepEqual([...ready.missing], []);
  assert.deepEqual([...readinessStatuses], ["incomplete", "ready"]);
});

test("9. Project Alpha scenario is representable without contacting anyone", () => {
  const draft = projectAlphaDraft();
  assert.equal(draft.title, "Request Update");
  assert.equal(draft.subject?.label, "Project Alpha");
  assert.equal(draft.target?.label, "Engineering Team");
  assert.equal(draft.recipient?.label, "Engineering Lead");
  assert.equal(draft.intent?.kind, "request-information");
  assert.equal(draft.priority, "high");
  assert.equal(draft.lifecycle, "draft");
  assert.equal(draft.context?.insightId, "insight.schedule-risk");
  assert.equal(draft.reason?.text, "Schedule risk increasing");
  assert.equal(
    draft.foundationIdentity,
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
  );

  assert.doesNotMatch(source, /\bsend\s*\(|\bdispatch\s*\(|\bexecute\s*\(/);
  assert.doesNotMatch(source, /createTicket|sendEmail|sendMessage|assignUser/);
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(foundation.dispatchFree, true);
});

test("10. Send Decision scenario remains representation-only", () => {
  const action = createRuntimeExecutiveAction({
    actionId: createRuntimeExecutiveActionId({ key: "send.increase-capacity" }),
    kind: "send",
    subject: createRuntimeExecutiveActionSubject({
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    }),
    recipient: createRuntimeExecutiveActionRecipient({
      kind: "role",
      id: "role.operations-manager",
      label: "Operations Manager",
    }),
    intent: createRuntimeExecutiveActionIntent({ kind: "inform" }),
    priority: "critical",
    lifecycle: "pending-confirmation",
    title: "Send Decision",
  });
  assert.equal(action.lifecycle, "pending-confirmation");
  assert.equal(action.priority, "critical");
  assert.equal(action.kind, "send");
  assert.equal(action.intent.kind, "inform");
  assert.equal(boundary.introducesMessaging, false);
  assert.equal(boundary.introducesAgentExecution, false);
});

test("11. constructors are deterministic and do not invent IDs or time", () => {
  const first = projectAlphaDraft();
  const second = projectAlphaDraft();
  assert.deepEqual(first, second);
  assert.equal(
    createRuntimeExecutiveActionId({ key: "stable" }),
    createRuntimeExecutiveActionId({ key: "stable" }),
  );
  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /crypto\.randomUUID|uuidv4|nanoid/i);
});

test("12. immutability: caller input and returned collections are protected", () => {
  const subjectInput = {
    kind: "object" as const,
    id: "object.project-alpha",
    label: "Project Alpha",
  };
  const recipientInput = {
    kind: "unresolved" as const,
    label: "ops manager",
  };
  const draftInput = {
    kind: "request" as const,
    subject: subjectInput,
    recipient: recipientInput,
    intent: { kind: "request-information" as const },
    title: "  Request Update  ",
    priority: "high" as const,
  };

  const draft = createRuntimeExecutiveActionDraft(draftInput);
  subjectInput.label = "MUTATED";
  recipientInput.label = "MUTATED";
  draftInput.title = "MUTATED";

  assert.equal(draft.subject?.label, "Project Alpha");
  assert.equal(draft.recipient?.label, "ops manager");
  assert.equal(draft.title, "Request Update");
  assert.equal(Object.isFrozen(draft), true);
  assert.equal(Object.isFrozen(draft.subject), true);
  assert.equal(Object.isFrozen(draft.recipient), true);
  assert.equal(Object.isFrozen(actionKinds), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(registry), true);

  assert.throws(() => {
    (actionKinds as unknown as string[]).push("create-jira-ticket");
  }, TypeError);

  const readiness = evaluateRuntimeExecutiveActionReadiness(draft);
  assert.equal(Object.isFrozen(readiness), true);
  assert.equal(Object.isFrozen(readiness.missing), true);
});

test("13. normalization preserves context without inference and rejects invalid vocabulary", () => {
  const context = createRuntimeExecutiveActionContext({
    workspaceId: "  workspace.alpha  ",
    insightId: "insight.schedule-risk",
  });
  assert.deepEqual(context, {
    workspaceId: "workspace.alpha",
    insightId: "insight.schedule-risk",
  });
  assert.equal(context.advisorId, undefined);
  assert.equal(context.stageId, undefined);

  assert.throws(
    () =>
      createRuntimeExecutiveActionDraft({
        kind: "create-jira-ticket" as unknown as "request",
      }),
    /known action kind/,
  );
  assert.throws(
    () =>
      createRuntimeExecutiveActionRecipient({
        kind: "person",
      }),
    /not unresolved/,
  );
  assert.throws(
    () =>
      createRuntimeExecutiveActionSubject({
        kind: "kor" as unknown as "object",
        id: "x",
      }),
    /subject kind/,
  );

  const validation = validateRuntimeExecutiveActionDraft({
    lifecycle: "executed",
    kind: "send-email",
    priority: "urgent",
    subject: { kind: "ticket", id: "" },
    recipient: { kind: "slack-channel" },
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((issue) => issue.code === "unknown-action-kind"));
  assert.ok(validation.issues.some((issue) => issue.code === "unknown-priority"));
  assert.ok(
    validation.issues.some((issue) => issue.code === "invalid-lifecycle-state"),
  );
  assert.ok(
    validation.issues.some((issue) => issue.code === "invalid-subject-kind"),
  );
  assert.ok(
    validation.issues.some((issue) => issue.code === "invalid-recipient-kind"),
  );
});

test("14. foundation guarantees and registry sections", () => {
  assert.deepEqual([...guarantees], [
    "deterministic",
    "immutable",
    "renderer-independent",
    "transport-independent",
    "provider-independent",
    "side-effect-free",
    "context-preserving",
    "recipient-resolution-independent",
    "dispatch-free",
    "upstream-safe",
  ]);
  assert.equal(
    getRuntimeExecutiveActionExperienceFoundationGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveActionExperienceFoundationRegistry(),
    registry,
  );
  assert.deepEqual([...registry.sections], [
    "Identity",
    "ActionKinds",
    "SubjectKinds",
    "TargetKinds",
    "RecipientKinds",
    "Intents",
    "Priorities",
    "LifecycleStates",
    "Readiness",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.sectionCount, 11);
  assert.equal(registry.guaranteeCount, 10);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.actionKindCount, actionKinds.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.targetKindCount, targetKinds.length);
  assert.equal(registry.recipientKindCount, recipientKinds.length);
  assert.equal(registry.intentKindCount, intentKinds.length);
});

test("15. architectural boundary: no renderer / transport / provider deps", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /from\s+["'][^"']*jira[^"']*["']/i);
  assert.doesNotMatch(source, /from\s+["'][^"']*slack[^"']*["']/i);
  assert.doesNotMatch(source, /from\s+["'][^"']*(?:nodemailer|@sendgrid|postmark)[^"']*["']/i);
  assert.doesNotMatch(source, /from\s+["'](?:axios|node-fetch|graphql|@octokit)["']/);
  assert.doesNotMatch(source, /from\s+["'](?:pg|mongodb|prisma|sqlite3)["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveInsightExperience(?!PublicIndex)[^"']*["']/,
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
  // Provider destination fields must not appear as domain property names.
  assert.doesNotMatch(
    source,
    /^\s*(?:readonly\s+)?(?:jiraProjectId|slackChannel|emailAddress|teamsWebhook)\s*[?:]/m,
  );
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.equal(foundation.rendererIndependent, true);
  assert.equal(foundation.transportIndependent, true);
  assert.equal(foundation.providerIndependent, true);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.introducesUiBehavior, false);
  assert.equal(boundary.introducesExternalIntegration, false);
  assert.equal(boundary.introducesJiraIntegration, false);
  assert.equal(boundary.introducesSlackIntegration, false);
});

test("16. no side effects / no external dispatch surface", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /from\s+["']node:fs["']/);
  assert.doesNotMatch(source, /publishExternally|createTicket|sendEmail|sendMessage/);
  assert.equal(foundation.sideEffectFree, true);
  assert.equal(foundation.deterministic, true);
  assert.equal(boundary.introducesRecipientResolution, false);
  assert.equal(boundary.introducesPersistence, false);
});

test("17. verification / readiness for REX-5:2", () => {
  const first = verifyRuntimeExecutiveActionExperienceFoundation();
  const second = verifyRuntimeExecutiveActionExperienceFoundation();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamConsumerEntryOk, true);
  assert.equal(first.frozen, true);
  assert.equal(first.dispatchFree, true);
  assert.equal(first.subjectTargetRecipientSeparated, true);
  assert.equal(first.kindIntentSeparated, true);
  assert.equal(first.actionKindCount, 7);
  assert.equal(first.subjectKindCount, 9);
  assert.equal(first.targetKindCount, 8);
  assert.equal(first.recipientKindCount, 6);
  assert.equal(first.intentKindCount, 10);
  assert.equal(first.priorityCount, 4);
  assert.equal(first.lifecycleStateCount, 5);
  assert.equal(first.lifecycleTransitionCount, 6);
  assert.equal(first.guaranteeCount, 10);
  assert.equal(first.sectionCount, 11);
  assert.equal(
    foundation.architecturalStatus,
    "REX-5:1 Runtime Executive Action Experience Foundation — FoundationReady",
  );

  // Normalize repeated draft construction remains equivalent.
  const a = normalizeRuntimeExecutiveActionDraft(projectAlphaDraft());
  const b = normalizeRuntimeExecutiveActionDraft(projectAlphaDraft());
  assert.deepEqual(a, b);
});
