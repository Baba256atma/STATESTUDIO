import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES as consequenceRules,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES as densities,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER as sectionOrder,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES as previewStatuses,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES as warningCodes,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES as warningSeverities,
  RUNTIME_EXECUTIVE_ACTION_TITLE_RULES as titleRules,
  getRuntimeExecutiveActionPresentationPreviewGuarantees,
  getRuntimeExecutiveActionPresentationPreviewIdentity,
  getRuntimeExecutiveActionPresentationPreviewRegistry,
  resolveRuntimeExecutiveActionPresentationDensity,
  resolveRuntimeExecutiveActionPresentationState,
  resolveRuntimeExecutiveActionPresentationSummary,
  resolveRuntimeExecutiveActionPresentationTitle,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionPresentationPreview as module,
  runtimeExecutiveActionPresentationPreviewApiNames as apiNames,
  runtimeExecutiveActionPresentationPreviewCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveActionPresentationPreviewRegistry as registry,
  verifyRuntimeExecutiveActionPresentationPreview,
} from "./runtimeExecutiveActionPresentationPreview.ts";

import {
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionIntentContextSupportedImportPath,
  verifyRuntimeExecutiveActionIntentContext,
  type RuntimeExecutiveActionIntentContextResult,
} from "@/app/lib/rex/runtimeExecutiveActionIntentContext";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveActionPresentationPreview.ts",
    import.meta.url,
  ),
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

function projectAlphaIntentContext(
  overrides?: Parameters<typeof resolveRuntimeExecutiveActionIntentContext>[0],
) {
  return withProposalFields(
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
      ...overrides,
    }),
    { priority: "high", lifecycle: "draft" },
  );
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    module.identity,
    "REX-5:4/RuntimeExecutiveActionPresentationPreview",
  );
  assert.equal(module.version, "5.4.0");
  assert.equal(
    module.namespace,
    "nexora.rex.action-experience.presentation-preview",
  );
  assert.equal(module.phase, "PresentationPreview");
  assert.equal(
    module.architecturalRole,
    "ExecutiveActionPresentationPreviewRuntime",
  );
  assert.deepEqual(
    getRuntimeExecutiveActionPresentationPreviewIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:3 intent context", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-5:3/RuntimeExecutiveActionIntentContext",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveActionIntentContextIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveActionIntentContextSupportedImportPath,
  );
  assert.equal(boundary.consumesIntentContextOnly, true);
  assert.equal(boundary.importsRex52Directly, false);
  assert.equal(boundary.importsRex51Directly, false);
  assert.equal(boundary.importsRex4Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveActionIntentContext",
  ]);
  assert.equal(verifyRuntimeExecutiveActionIntentContext().ok, true);
});

test("3. presentation states and densities", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.deepEqual([...densities], ["compact", "standard", "expanded"]);
  assert.equal(registry.presentationStateCount, 3);
  assert.equal(registry.presentationDensityCount, 3);
});

test("4. preview section order is canonical", () => {
  assert.deepEqual([...sectionOrder], [
    "action",
    "subject",
    "target",
    "recipient",
    "intent",
    "priority",
    "reason",
    "origin",
    "context",
    "consequence",
    "readiness",
    "warnings",
    "lifecycle",
  ]);
});

test("5. deterministic title and summary rules", () => {
  assert.equal(
    resolveRuntimeExecutiveActionPresentationTitle({
      actionKind: "request",
      intentKind: "request-information",
    }),
    "Request Update",
  );
  assert.equal(
    resolveRuntimeExecutiveActionPresentationTitle({
      actionKind: "assign",
      intentKind: "delegate",
    }),
    "Assign Responsibility",
  );
  assert.equal(
    resolveRuntimeExecutiveActionPresentationTitle({
      actionKind: "approve",
      intentKind: "approve",
    }),
    "Approve Decision",
  );
  assert.equal(
    resolveRuntimeExecutiveActionPresentationSummary({
      intentKind: "request-information",
      subjectLabel: "Project Alpha",
      recipientLabel: "Engineering Lead",
    }),
    "Request an update from Engineering Lead about Project Alpha.",
  );
  assert.equal(registry.titleRuleCount, titleRules.length);
  assert.equal(registry.consequenceRuleCount, consequenceRules.length);
});

test("6. minimum presentation state", () => {
  const result = resolveRuntimeExecutiveActionPreview({
    intentContext: projectAlphaIntentContext(),
    requestedPresentationState: "minimum",
  });
  assert.equal(result.status, "ready");
  assert.equal(result.preview?.presentationState, "minimum");
  assert.equal(result.preview?.density, "compact");
  assert.equal(result.preview?.title, "Request Update");
  const kinds = result.preview?.sections.map((entry) => entry.kind) ?? [];
  assert.ok(kinds.includes("action"));
  assert.ok(kinds.includes("subject"));
  assert.ok(kinds.includes("priority"));
  assert.ok(kinds.includes("readiness"));
  assert.equal(kinds.includes("consequence"), false);
});

test("7. report presentation state", () => {
  const result = resolveRuntimeExecutiveActionPreview({
    intentContext: projectAlphaIntentContext(),
    requestedPresentationState: "report",
  });
  assert.equal(result.preview?.presentationState, "report");
  assert.equal(result.presentation?.subject?.label, "Project Alpha");
  assert.equal(result.presentation?.target?.label, "Engineering Team");
  assert.equal(result.presentation?.recipient?.label, "Engineering Lead");
  assert.equal(result.presentation?.intent.label, "Request Information");
  assert.equal(result.presentation?.priority?.label, "High");
  assert.equal(result.presentation?.reason, "Schedule risk increasing");
  assert.equal(result.presentation?.origin?.label, "Insight");

  const kinds = result.preview?.sections.map((entry) => entry.kind) ?? [];
  assert.deepEqual(
    kinds,
    kinds
      .slice()
      .sort(
        (a, b) =>
          sectionOrder.indexOf(a as (typeof sectionOrder)[number]) -
          sectionOrder.indexOf(b as (typeof sectionOrder)[number]),
      ),
  );
});

test("8. operation presentation state with consequence", () => {
  const intentContext = withProposalFields(
    resolveRuntimeExecutiveActionIntentContext({
      kind: "assign",
      intent: { kind: "delegate" },
      subject: {
        kind: "object",
        id: "object.capacity-review",
        label: "Capacity Review",
      },
      target: {
        kind: "team",
        id: "team.operations",
        label: "Operations",
      },
      recipient: {
        kind: "role",
        id: "role.operations-manager",
        label: "Operations Manager",
      },
      title: "Assign Responsibility",
      selectedSubject: {
        kind: "object",
        id: "object.capacity-review",
        label: "Capacity Review",
      },
      context: {
        workspaceId: "workspace.operations",
        insightId: "insight.capacity",
      },
    }),
    { priority: "critical", lifecycle: "pending-confirmation" },
  );

  const result = resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: "operation",
  });
  assert.equal(result.preview?.presentationState, "operation");
  assert.equal(result.preview?.title, "Assign Responsibility");
  assert.equal(
    result.preview?.sections.find((entry) => entry.kind === "action")?.value,
    "ASSIGN RESPONSIBILITY",
  );
  assert.equal(
    result.presentation?.consequence?.statement,
    "Responsibility will be requested from the selected recipient.",
  );
  assert.equal(result.presentation?.consequence?.semanticOnly, true);
  assert.equal(result.presentation?.lifecycle?.label, "Pending Confirmation");
  assert.ok(
    result.warnings.some((entry) => entry.code === "critical-priority"),
  );
  assert.doesNotMatch(
    result.presentation?.consequence?.statement ?? "",
    /email|jira|slack|webhook/i,
  );
});

test("9. subject / target / recipient remain separate", () => {
  const result = resolveRuntimeExecutiveActionPreview({
    intentContext: projectAlphaIntentContext(),
    requestedPresentationState: "report",
  });
  assert.equal(result.presentation?.subject?.id, "object.project-alpha");
  assert.equal(result.presentation?.target?.id, "team.engineering");
  assert.equal(result.presentation?.recipient?.id, "role.engineering-lead");
  assert.notEqual(
    result.presentation?.subject?.id,
    result.presentation?.target?.id,
  );
  assert.notEqual(
    result.presentation?.target?.id,
    result.presentation?.recipient?.id,
  );
});

test("10. ambiguous intent and unresolved recipient remain visible", () => {
  const intentContext = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    recipient: {
      kind: "unresolved",
      label: "Responsible Operations Manager",
    },
    title: "Send",
  });
  const result = resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: "operation",
  });

  assert.equal(result.presentation?.intent.ambiguous, true);
  assert.equal(result.presentation?.intent.resolvedIntent, undefined);
  assert.ok(result.presentation?.intent.candidates.length > 0);
  assert.equal(result.presentation?.recipient?.unresolved, true);
  assert.match(
    result.preview?.sections.find((entry) => entry.kind === "recipient")
      ?.value ?? "",
    /Unresolved/,
  );
  assert.ok(
    result.warnings.some((entry) => entry.code === "recipient-unresolved"),
  );
  assert.ok(
    result.warnings.some((entry) => entry.code === "intent-ambiguous"),
  );
  assert.ok(["partial", "blocked"].includes(result.status));
});

test("11. context conflict propagates as warning", () => {
  const intentContext = resolveRuntimeExecutiveActionIntentContext({
    kind: "request",
    intent: { kind: "request-information" },
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
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

  const result = resolveRuntimeExecutiveActionPreview({
    intentContext: withProposalFields(intentContext, { priority: "normal" }),
    requestedPresentationState: "report",
  });
  assert.ok(
    result.warnings.some((entry) => entry.code === "context-conflict"),
  );
});

test("12. warning ordering is deterministic", () => {
  assert.deepEqual([...warningSeverities], [
    "info",
    "caution",
    "warning",
    "blocking",
  ]);
  assert.deepEqual([...warningCodes], [
    "recipient-unresolved",
    "intent-ambiguous",
    "intent-unresolved",
    "target-missing",
    "context-conflict",
    "reason-missing",
    "lifecycle-invalid",
    "action-incomplete",
    "critical-priority",
  ]);

  const result = resolveRuntimeExecutiveActionPreview({
    intentContext: resolveRuntimeExecutiveActionIntentContext({
      kind: "send",
      subject: { kind: "object", id: "object.project-alpha" },
      recipient: { kind: "unresolved", label: "ops" },
      title: "Send",
    }),
    requestedPresentationState: "report",
  });

  const severities = result.warnings.map((entry) => entry.severity);
  const blockingIndex = severities.indexOf("blocking");
  const cautionIndex = severities.indexOf("caution");
  if (blockingIndex >= 0 && cautionIndex >= 0) {
    assert.ok(blockingIndex < cautionIndex);
  }
});

test("13. state and density resolvers", () => {
  const intentContext = projectAlphaIntentContext();
  assert.equal(
    resolveRuntimeExecutiveActionPresentationState({
      intentContext,
      requestedPresentationState: "operation",
    }),
    "operation",
  );
  assert.equal(
    resolveRuntimeExecutiveActionPresentationDensity({
      presentationState: "minimum",
      intentContext,
      warnings: [],
    }),
    "compact",
  );
  assert.deepEqual([...previewStatuses], [
    "ready",
    "partial",
    "blocked",
    "rejected",
  ]);
});

test("14. immutability and determinism", () => {
  const intentContext = projectAlphaIntentContext();
  const first = resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: "report",
  });
  const second = resolveRuntimeExecutiveActionPreview({
    intentContext,
    requestedPresentationState: "report",
  });
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.preview), true);
  assert.equal(Object.isFrozen(first.preview?.sections), true);
  assert.equal(Object.isFrozen(presentationStates), true);
  assert.equal(Object.isFrozen(guarantees), true);

  const a = verifyRuntimeExecutiveActionPresentationPreview();
  const b = verifyRuntimeExecutiveActionPresentationPreview();
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);

  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /crypto\.randomUUID|uuidv4|nanoid/i);
});

test("15. registry / guarantees / public surface", () => {
  assert.deepEqual([...guarantees], [
    "deterministic",
    "immutable",
    "intent-context-aligned",
    "renderer-independent",
    "presentation-state-aware",
    "density-aware",
    "warning-aware",
    "ambiguity-preserving",
    "context-preserving",
    "recipient-resolution-safe",
    "lifecycle-aware",
    "provider-independent",
    "transport-independent",
    "side-effect-free",
    "dispatch-free",
  ]);
  assert.equal(
    getRuntimeExecutiveActionPresentationPreviewGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveActionPresentationPreviewRegistry(),
    registry,
  );
  assert.deepEqual([...registry.sections], [
    "Identity",
    "PresentationStates",
    "PresentationDensities",
    "PreviewSections",
    "SectionVisibility",
    "SectionImportance",
    "WarningSeverities",
    "WarningCodes",
    "PreviewStatuses",
    "TitleRules",
    "ConsequenceRules",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.sectionCount, 13);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.ok(apiNames.includes("resolveRuntimeExecutiveActionPreview"));
  assert.ok(apiNames.includes("resolveRuntimeExecutiveActionPresentationState"));
});

test("16. architectural boundary: no UI / AI / upstream REX imports", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /from\s+["'](?:axios|node-fetch|graphql)["']/);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:jira|slack|openai|anthropic)[^"']*["']/i,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveActionExperience(?:Foundation|Contracts)["']/,
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
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(
    source,
    /confirmAction\s*\(|approveAndSend\s*\(|cancelAndDispatch\s*\(/,
  );
  assert.equal(module.rendererIndependent, true);
  assert.equal(module.aiIndependent, true);
  assert.equal(module.confirmationBehaviorAbsent, true);
  assert.equal(boundary.introducesConfirmationBehavior, false);
  assert.equal(boundary.introducesLlmGeneration, false);
});

test("17. no side effects / no external dispatch", () => {
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
});

test("18. verification / readiness for REX-5:5", () => {
  const verification = verifyRuntimeExecutiveActionPresentationPreview();
  assert.equal(verification.ok, true);
  assert.equal(verification.upstreamIntentContextOk, true);
  assert.equal(verification.ambiguityPreserving, true);
  assert.equal(verification.recipientResolutionSafe, true);
  assert.equal(verification.contextPreserving, true);
  assert.equal(verification.lifecycleAware, true);
  assert.equal(verification.aiIndependent, true);
  assert.equal(verification.dispatchFree, true);
  assert.equal(verification.confirmationBehaviorAbsent, true);
  assert.equal(verification.frozen, true);
  assert.equal(verification.presentationStateCount, 3);
  assert.equal(verification.presentationDensityCount, 3);
  assert.equal(verification.warningCodeCount, 9);
  assert.equal(verification.previewStatusCount, 4);
  assert.equal(verification.guaranteeCount, 15);
  assert.equal(verification.sectionCount, 13);
  assert.equal(
    module.architecturalStatus,
    "REX-5:4 Runtime Executive Action Presentation & Preview — PresentationPreviewReady",
  );
});
