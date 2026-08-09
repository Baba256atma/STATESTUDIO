import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS as bindingStrengths,
  RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES as completenessValues,
  RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS as conflictKinds,
  RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES as contextRoles,
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES as resultStatuses,
  RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES as intentStatuses,
  RUNTIME_EXECUTIVE_ACTION_INTENT_RULES as intentRules,
  RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY as compatibilityRules,
  RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS as originKinds,
  assessRuntimeExecutiveActionContextSuitability,
  bindRuntimeExecutiveActionContext,
  getRuntimeExecutiveActionIntentContextGuarantees,
  getRuntimeExecutiveActionIntentContextIdentity,
  getRuntimeExecutiveActionIntentContextRegistry,
  getRuntimeExecutiveActionIntentRuleRegistry,
  isRuntimeExecutiveActionKindIntentCompatible,
  resolveRuntimeExecutiveActionIntent,
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionIntentContext as module,
  runtimeExecutiveActionIntentContextApiNames as apiNames,
  runtimeExecutiveActionIntentContextCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionIntentContextRegistry as registry,
  verifyRuntimeExecutiveActionIntentContext,
} from "./runtimeExecutiveActionIntentContext.ts";

import {
  createRuntimeExecutiveActionProposalContract,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceContractsSupportedImportPath,
  verifyRuntimeExecutiveActionExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceContracts";

const source = readFileSync(
  new URL("./runtimeExecutiveActionIntentContext.ts", import.meta.url),
  "utf8",
);

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:3/RuntimeExecutiveActionIntentContext",
  );
  assert.equal(module.version, "5.3.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.intent-context",
  );
  assert.equal(module.phase, "IntentContext");
  assert.equal(
    module.architecturalRole,
    "ExecutiveActionIntentContextRuntime",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionIntentContextIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:2 contracts", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:2/RuntimeExecutiveActionExperienceContracts",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionExperienceContractsIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionExperienceContractsSupportedImportPath,
  );
  assert.equal(boundary.consumesContractsOnly, true);
  assert.equal(boundary.importsRex51Directly, false);
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
    "@/app/lib/rex/runtimeExecutiveActionExperienceContracts",
  ]);
  assert.equal(verifyRuntimeExecutiveActionExperienceContracts().ok, true);
});

test("3. canonical intent resolution statuses", () => {
  assert.deepEqual([...intentStatuses], [
    "explicit",
    "derived",
    "ambiguous",
    "unresolved",
  ]);
  assert.equal(registry.intentResolutionStatusCount, 4);
});

test("4. explicit intent always wins when valid", () => {
  const resolution = resolveRuntimeExecutiveActionIntent({
    kind: "send",
    intent: { kind: "request-information" },
    subject: { kind: "object", id: "object.project-alpha", label: "Project Alpha" },
    reason: "Schedule risk increasing",
    origin: { kind: "insight", referenceId: "insight.schedule-risk" },
  });
  assert.equal(resolution.status, "explicit");
  assert.equal(resolution.resolvedIntent, "request-information");
  assert.equal(resolution.sourceIntent, "request-information");
  assert.ok(
    resolution.evidence.some((entry) => entry.kind === "explicit-intent"),
  );

  const combined = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
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
    origin: { kind: "insight", referenceId: "insight.schedule-risk" },
    reason: "Schedule risk increasing",
    title: "Request Update",
    context: {
      workspaceId: "workspace.operations",
      focusedSubjectId: "object.project-alpha",
      insightId: "insight.schedule-risk",
    },
  });
  assert.equal(combined.intentResolution.status, "explicit");
  assert.equal(combined.intentResolution.resolvedIntent, "request-information");
  assert.equal(combined.reason?.reason, "Schedule risk increasing");
  assert.equal(combined.reason?.derived, false);
});

test("5. derived intent uses deterministic rules", () => {
  const assign = resolveRuntimeExecutiveActionIntent({ kind: "assign" });
  assert.equal(assign.status, "derived");
  assert.equal(assign.resolvedIntent, "delegate");
  assert.ok(assign.evidence.length > 0);

  assert.equal(
    resolveRuntimeExecutiveActionIntent({ kind: "approve" }).resolvedIntent,
    "approve",
  );
  assert.equal(
    resolveRuntimeExecutiveActionIntent({ kind: "review" }).resolvedIntent,
    "review",
  );
  assert.equal(
    resolveRuntimeExecutiveActionIntent({ kind: "escalate" }).resolvedIntent,
    "escalate",
  );
  assert.equal(
    resolveRuntimeExecutiveActionIntent({ kind: "follow-up" }).resolvedIntent,
    "follow-up",
  );

  const sendDecision = resolveRuntimeExecutiveActionIntent({
    kind: "send",
    subject: {
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    },
  });
  assert.equal(sendDecision.status, "derived");
  assert.equal(sendDecision.resolvedIntent, "inform");

  const sendStatus = resolveRuntimeExecutiveActionIntent({
    kind: "send",
    reason: "Schedule risk increasing",
    subject: { kind: "object", id: "object.project-alpha" },
  });
  assert.equal(sendStatus.status, "derived");
  assert.equal(sendStatus.resolvedIntent, "request-information");

  assert.equal(getRuntimeExecutiveActionIntentRuleRegistry(), intentRules);
  assert.equal(registry.intentRuleCount, intentRules.length);
});

test("6. ambiguity and unresolved are preserved", () => {
  const ambiguous = resolveRuntimeExecutiveActionIntent({
    kind: "send",
    subject: { kind: "object", id: "object.project-alpha", label: "Project Alpha" },
  });
  assert.equal(ambiguous.status, "ambiguous");
  assert.equal(ambiguous.resolvedIntent, undefined);
  assert.deepEqual([...ambiguous.candidates], [
    "inform",
    "request-information",
    "coordinate",
  ]);

  const unresolved = resolveRuntimeExecutiveActionIntent({});
  assert.equal(unresolved.status, "unresolved");
  assert.deepEqual([...unresolved.candidates], []);

  const combinedAmbiguous = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    subject: { kind: "object", id: "object.project-alpha" },
    title: "Send",
  });
  assert.equal(combinedAmbiguous.status, "ambiguous");
  assert.equal(module.ambiguityPreserving, true);
});

test("7. kind / intent compatibility", () => {
  assert.equal(
    isRuntimeExecutiveActionKindIntentCompatible("assign", "delegate"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveActionKindIntentCompatible("send", "inform"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveActionKindIntentCompatible("send", "request-information"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveActionKindIntentCompatible("approve", "delegate"),
    false,
  );
  assert.equal(
    isRuntimeExecutiveActionKindIntentCompatible("review", "escalate"),
    false,
  );
  assert.equal(registry.compatibilityRuleCount, compatibilityRules.length);

  const flagged = resolveRuntimeExecutiveActionIntentContext({
    kind: "approve",
    intent: { kind: "delegate" },
    subject: { kind: "object", id: "object.project-alpha" },
    title: "Bad pairing",
  });
  assert.equal(flagged.intentResolution.status, "explicit");
  assert.equal(flagged.intentResolution.compatible, false);
  assert.ok(
    flagged.contextBinding.conflicts.some(
      (entry) => entry.kind === "incompatible-kind-intent",
    ),
  );
});

test("8. origin kinds and context binding strengths", () => {
  assert.deepEqual([...originKinds], [
    "manual",
    "stage",
    "advisor",
    "insight",
    "decision",
    "scenario",
    "execution",
    "workspace",
    "system",
    "agent",
  ]);
  assert.deepEqual([...contextRoles], [
    "workspace",
    "stage",
    "selected-subject",
    "focused-subject",
    "insight",
    "advisor",
    "scenario",
    "decision",
    "problem",
    "goal",
    "pack",
    "execution",
  ]);
  assert.deepEqual([...bindingStrengths], [
    "primary",
    "supporting",
    "ambient",
  ]);
  assert.deepEqual([...completenessValues], [
    "minimal",
    "sufficient",
    "rich",
  ]);

  const binding = bindRuntimeExecutiveActionContext({
    selectedSubject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    focusedSubject: {
      kind: "object",
      id: "object.capacity",
      label: "Capacity",
    },
    supportingReferences: [
      {
        role: "insight",
        id: "insight.schedule-risk",
        label: "Schedule Risk",
      },
    ],
    context: {
      workspaceId: "workspace.operations",
    },
  });

  assert.equal(binding.primary[0]?.id, "object.project-alpha");
  assert.ok(
    binding.supporting.some((entry) => entry.id === "object.capacity"),
  );
  assert.ok(
    binding.supporting.some((entry) => entry.id === "insight.schedule-risk"),
  );
  assert.ok(
    binding.ambient.some((entry) => entry.id === "workspace.operations"),
  );
  assert.equal(binding.completeness, "rich");

  // Deduplicate identical insight references
  const deduped = bindRuntimeExecutiveActionContext({
    supportingReferences: [
      { role: "insight", id: "insight.a" },
      { role: "insight", id: "insight.a" },
      { role: "insight", id: "insight.a" },
    ],
  });
  assert.equal(
    deduped.references.filter((entry) => entry.id === "insight.a").length,
    1,
  );
});

test("9. context precedence is deterministic and preserves distinctions", () => {
  const binding = bindRuntimeExecutiveActionContext({
    context: {
      selectedSubjectId: "from-context-selected",
      focusedSubjectId: "from-context-focused",
      insightId: "from-context-insight",
      workspaceId: "from-context-workspace",
    },
    selectedSubject: {
      kind: "object",
      id: "from-selected-arg",
      label: "Selected Arg",
    },
    focusedSubject: {
      kind: "object",
      id: "from-focused-arg",
      label: "Focused Arg",
    },
  });

  // Context-selected already occupies selected-subject; arg selected is distinct and also primary.
  assert.ok(
    binding.primary.some((entry) => entry.id === "from-context-selected"),
  );
  assert.ok(
    binding.primary.some((entry) => entry.id === "from-selected-arg"),
  );
  assert.ok(
    binding.supporting.some((entry) => entry.id === "from-context-focused"),
  );
  assert.ok(
    binding.supporting.some((entry) => entry.id === "from-focused-arg"),
  );
  assert.ok(
    binding.supporting.some((entry) => entry.id === "from-context-insight"),
  );
  assert.ok(
    binding.ambient.some((entry) => entry.id === "from-context-workspace"),
  );

  // Subject / target / recipient remain separate from context subjects.
  const result = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    intent: { kind: "inform" },
    subject: {
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    },
    target: {
      kind: "project",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: {
      kind: "role",
      id: "role.engineering-lead",
      label: "Engineering Lead",
    },
    selectedSubject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    supportingReferences: [
      { role: "insight", id: "insight.capacity-risk", label: "Capacity Risk" },
    ],
    title: "Send Decision",
  });
  assert.equal(result.proposal?.subject?.id, "decision.increase-capacity");
  assert.equal(result.proposal?.target?.id, "object.project-alpha");
  assert.equal(result.proposal?.recipient?.id, "role.engineering-lead");
  assert.ok(
    result.contextBinding.supporting.some(
      (entry) => entry.id === "insight.capacity-risk",
    ),
  );
  assert.notEqual(
    result.proposal?.subject?.id,
    result.proposal?.recipient?.id,
  );
});

test("10. multiple primary subjects are flagged as conflicts", () => {
  const binding = bindRuntimeExecutiveActionContext({
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
  assert.ok(
    binding.conflicts.some(
      (entry) =>
        entry.kind === "multiple-primary-subjects" &&
        entry.outcome === "flagged",
    ),
  );
  assert.deepEqual([...conflictKinds], [
    "multiple-primary-subjects",
    "conflicting-origins",
    "incompatible-kind-intent",
    "duplicate-incompatible-recipient-context",
  ]);
});

test("11. context suitability and result statuses", () => {
  assert.deepEqual([...resultStatuses], [
    "resolved",
    "partially-resolved",
    "ambiguous",
    "unresolved",
    "rejected",
  ]);

  const rich = resolveRuntimeExecutiveActionIntentContext({
    proposal: createRuntimeExecutiveActionProposalContract({
      kind: "assign",
      subject: {
        kind: "object",
        id: "object.capacity-review",
        label: "Capacity Review",
      },
      recipient: {
        kind: "role",
        id: "role.operations-manager",
        label: "Operations Manager",
      },
      title: "Assign Capacity Review",
      context: {
        workspaceId: "workspace.operations",
        insightId: "insight.capacity",
        focusedSubjectId: "object.capacity-review",
      },
    }),
    selectedSubject: {
      kind: "object",
      id: "object.capacity-review",
      label: "Capacity Review",
    },
    origin: { kind: "manual" },
  });
  assert.equal(rich.intentResolution.status, "derived");
  assert.equal(rich.intentResolution.resolvedIntent, "delegate");
  assert.equal(rich.contextBinding.completeness, "rich");
  assert.equal(
    assessRuntimeExecutiveActionContextSuitability({
      intentResolution: rich.intentResolution,
      contextBinding: rich.contextBinding,
    }),
    "strong",
  );

  const rejected = resolveRuntimeExecutiveActionIntentContext({
    kind: "create-jira-ticket" as unknown as "request",
    title: "Bad",
  });
  assert.equal(rejected.status, "rejected");
});

test("12. reason preservation and no narrative invention", () => {
  const result = resolveRuntimeExecutiveActionIntentContext({
    kind: "request",
    intent: { kind: "request-information" },
    subject: { kind: "object", id: "object.project-alpha" },
    title: "Request Update",
    reason: "  Schedule risk increasing  ",
  });
  assert.equal(result.reason?.reason, "Schedule risk increasing");
  assert.equal(result.reason?.derived, false);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|\bembedding\b/i);
  assert.doesNotMatch(source, /generateText\s*\(|createChatCompletion/);
  assert.equal(boundary.introducesLlmInference, false);
  assert.equal(module.aiIndependent, true);
});

test("13. immutability and determinism", () => {
  const selected = {
    kind: "object" as const,
    id: "object.project-alpha",
    label: "Project Alpha",
  };
  const request = {
    kind: "send" as const,
    intent: { kind: "request-information" as const },
    subject: selected,
    title: "Request Update",
    reason: "Schedule risk increasing",
    origin: { kind: "insight" as const, referenceId: "insight.schedule-risk" },
  };

  const first = resolveRuntimeExecutiveActionIntentContext(request);
  selected.label = "MUTATED";
  const second = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    intent: { kind: "request-information" },
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Request Update",
    reason: "Schedule risk increasing",
    origin: { kind: "insight", referenceId: "insight.schedule-risk" },
  });

  assert.equal(first.proposal?.subject?.label, "Project Alpha");
  assert.deepEqual(first.intentResolution, second.intentResolution);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.intentResolution), true);
  assert.equal(Object.isFrozen(first.contextBinding.references), true);
  assert.equal(Object.isFrozen(intentStatuses), true);
  assert.equal(Object.isFrozen(guarantees), true);

  const a = verifyRuntimeExecutiveActionIntentContext();
  const b = verifyRuntimeExecutiveActionIntentContext();
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);

  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /crypto\.randomUUID|uuidv4|nanoid/i);
});

test("14. registry / guarantees / public surface", () => {
  assert.deepEqual([...guarantees], [
    "deterministic",
    "immutable",
    "contract-aligned",
    "explicit-intent-precedence",
    "ambiguity-preserving",
    "context-preserving",
    "origin-preserving",
    "subject-target-recipient-separated",
    "kind-intent-separated",
    "auditable-resolution",
    "renderer-independent",
    "provider-independent",
    "transport-independent",
    "side-effect-free",
    "dispatch-free",
  ]);
  assert.equal(
    getRuntimeExecutiveActionIntentContextGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveActionIntentContextRegistry(),
    registry,
  );
  assert.deepEqual([...registry.sections], [
    "Identity",
    "IntentResolutionStatuses",
    "OriginKinds",
    "ContextRoles",
    "BindingStrengths",
    "ContextCompleteness",
    "ResolutionStatuses",
    "CompatibilityRules",
    "IntentRules",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.sectionCount, 11);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.ok(apiNames.includes("resolveRuntimeExecutiveActionIntent"));
  assert.ok(apiNames.includes("bindRuntimeExecutiveActionContext"));
  assert.ok(apiNames.includes("resolveRuntimeExecutiveActionIntentContext"));
});

test("15. architectural boundary: no renderer / AI / upstream REX imports", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /from\s+["'](?:axios|node-fetch|graphql)["']/);
  assert.doesNotMatch(source, /from\s+["'][^"']*jira[^"']*["']/i);
  assert.doesNotMatch(source, /from\s+["'][^"']*slack[^"']*["']/i);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:nodemailer|openai|anthropic|@ai-sdk)[^"']*["']/i,
  );
  assert.doesNotMatch(source, /from\s+["'](?:pg|mongodb|prisma|sqlite3)["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveActionExperienceFoundation["']/,
  );
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
  assert.equal(module.rendererIndependent, true);
  assert.equal(module.providerIndependent, true);
  assert.equal(module.transportIndependent, true);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.introducesUiBehavior, false);
});

test("16. no side effects / no external dispatch", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /from\s+["']node:fs["']/);
  assert.doesNotMatch(
    source,
    /publishExternally|createTicket|sendEmail|sendMessage|assignExternally/,
  );
  assert.equal(module.sideEffectFree, true);
  assert.equal(module.deterministic, true);
  assert.equal(module.dispatchFree, true);
  assert.equal(boundary.introducesDispatch, false);
  assert.equal(boundary.introducesAgentExecution, false);
  assert.equal(boundary.introducesRecipientResolution, false);
});

test("17. verification / readiness for REX-5:4", () => {
  const verification = verifyRuntimeExecutiveActionIntentContext();
  assert.equal(verification.ok, true);
  assert.equal(verification.upstreamContractsOk, true);
  assert.equal(verification.explicitIntentPrecedence, true);
  assert.equal(verification.ambiguityPreserving, true);
  assert.equal(verification.contextPreserving, true);
  assert.equal(verification.originPreserving, true);
  assert.equal(verification.subjectTargetRecipientSeparated, true);
  assert.equal(verification.kindIntentSeparated, true);
  assert.equal(verification.auditableResolution, true);
  assert.equal(verification.aiIndependent, true);
  assert.equal(verification.dispatchFree, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.intentResolutionStatusCount, 4);
  assert.equal(verification.originKindCount, 10);
  assert.equal(verification.contextRoleCount, 12);
  assert.equal(verification.bindingStrengthCount, 3);
  assert.equal(verification.contextCompletenessCount, 3);
  assert.equal(verification.resultStatusCount, 5);
  assert.equal(verification.conflictKindCount, 4);
  assert.equal(verification.guaranteeCount, 15);
  assert.equal(verification.sectionCount, 11);
  assert.equal(
    module.architecturalStatus,
    "REX-5:3 Runtime Executive Action Intent & Context — IntentContextReady",
  );
});
