import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_INTENT_CONTRACT_VERSION,
  resolveExecutiveIntentExample,
  validateExecutiveIntentShape,
} from "./executiveIntentContract.ts";
import {
  EXECUTIVE_INTENT_DIAGNOSTIC_CODES,
  createExecutiveIntentDiagnostic,
  isExecutiveIntentDiagnosticCode,
} from "./executiveIntentDiagnostics.ts";
import {
  EXECUTIVE_INTENT_ALLOWED_LIFECYCLE_TRANSITIONS,
  EXECUTIVE_INTENT_FORBIDDEN_LIFECYCLE_TRANSITIONS,
  isAllowedLifecycleTransition,
  resolveLifecycleTransition,
} from "./executiveIntentLifecycleMatrix.ts";
import {
  ExecutiveIntentStateEngine,
  evaluateExecutiveIntentStateContext,
  isIntentActionable,
  isIntentArchived,
  isIntentBlocked,
  isIntentReady,
  resolveExecutiveIntentState,
  resolveExecutiveIntentStateProbeExample,
  resolveExecutiveIntentStateResult,
  resolveIntentDiagnostics,
  resolveIntentFreshness,
  resolveIntentReadiness,
  resolveIntentStateSummary,
  resolveIntentStructuralHealth,
} from "./executiveIntentStateEngine.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_RULES, EXECUTIVE_INTENT_STATE_ENGINE_TAGS } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const STALE_EVALUATED_AT = "2026-06-01T00:00:00.000Z";

function buildRequest(
  intent: ReturnType<typeof resolveExecutiveIntentExample> | null,
  overrides: Partial<{
    intentId: string;
    workspaceId: string;
    evaluatedAt: string;
    proposedLifecycleTransition: {
      from: "created" | "validated" | "approved" | "activated" | "updated" | "completed" | "archived";
      to: "created" | "validated" | "approved" | "activated" | "updated" | "completed" | "archived";
    } | null;
  }> = Object.freeze({})
) {
  return Object.freeze({
    intent,
    intentId: overrides.intentId ?? intent?.intentId ?? "intent-missing",
    workspaceId: overrides.workspaceId ?? intent?.workspaceId ?? "ws-example-001",
    evaluatedAt: overrides.evaluatedAt ?? FIXED_TIME,
    proposedLifecycleTransition: overrides.proposedLifecycleTransition ?? null,
  });
}

test("resolves valid active intent as ready with healthy structural health", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const result = resolveExecutiveIntentStateResult(buildRequest(intent));

  assert.equal(result.state.stateCategory, "ready");
  assert.equal(result.readiness, "ready");
  assert.equal(result.structuralHealth, "healthy");
  assert.equal(result.freshness, "fresh");
  assert.equal(result.executionState, "active");
  assert.equal(result.readOnly, true);
  assert.equal(result.engineVersion, "APP-3/2");
  assert.equal(result.contractVersion, EXECUTIVE_INTENT_CONTRACT_VERSION);
  assert.equal(result.state.flags.isReady, true);
  assert.equal(result.state.flags.isDownstreamReady, true);
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_ok"));
});

test("returns unknown state when intent is missing", () => {
  const result = resolveExecutiveIntentStateResult(
    buildRequest(null, Object.freeze({ intentId: "intent-missing", workspaceId: "ws-001" }))
  );

  assert.equal(result.state.stateCategory, "unknown");
  assert.equal(result.readiness, "not_ready");
  assert.equal(result.structuralHealth, "unknown");
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_missing"));
});

test("detects invalid metadata and marks intent invalid", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const invalid = Object.freeze({
    ...intent,
    metadata: Object.freeze({
      ...intent.metadata,
      priority: "urgent" as "high",
    }),
  });
  const result = resolveExecutiveIntentStateResult(buildRequest(invalid));

  assert.equal(result.structuralHealth, "invalid");
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_invalid_metadata"));
});

test("validates lifecycle transition matrix", () => {
  assert.equal(isAllowedLifecycleTransition("created", "validated"), true);
  assert.equal(isAllowedLifecycleTransition("validated", "approved"), true);
  assert.equal(isAllowedLifecycleTransition("approved", "activated"), true);
  assert.equal(isAllowedLifecycleTransition("created", "approved"), false);
  assert.equal(isAllowedLifecycleTransition("created", "activated"), false);
  assert.equal(isAllowedLifecycleTransition("validated", "activated"), false);
  assert.equal(isAllowedLifecycleTransition("completed", "activated"), false);
  assert.equal(isAllowedLifecycleTransition("archived", "activated"), false);

  assert.equal(resolveLifecycleTransition("approved", "activated").allowed, true);
  assert.equal(resolveLifecycleTransition("created", "approved").allowed, false);

  assert.ok(EXECUTIVE_INTENT_ALLOWED_LIFECYCLE_TRANSITIONS.length >= 6);
  assert.ok(EXECUTIVE_INTENT_FORBIDDEN_LIFECYCLE_TRANSITIONS.length >= 5);
});

test("rejects illegal proposed lifecycle transitions in diagnostics", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const result = resolveExecutiveIntentStateResult(
    buildRequest(
      intent,
      Object.freeze({
        proposedLifecycleTransition: Object.freeze({ from: "created", to: "activated" }),
      })
    )
  );

  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_illegal_lifecycle_transition"));
  assert.equal(result.lifecycleValidation?.allowed, false);
});

test("resolves readiness levels for paused and archived intents", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const paused = Object.freeze({
    ...intent,
    metadata: Object.freeze({ ...intent.metadata, status: "paused" as const }),
  });
  assert.equal(resolveIntentReadiness(buildRequest(paused)), "waiting");

  const archived = Object.freeze({
    ...intent,
    metadata: Object.freeze({
      ...intent.metadata,
      status: "archived" as const,
      lifecycle: "archived" as const,
    }),
  });
  const archivedResult = resolveExecutiveIntentStateResult(buildRequest(archived));
  assert.equal(archivedResult.readiness, "archived");
  assert.equal(isIntentArchived(buildRequest(archived)), true);
  assert.ok(archivedResult.diagnostics.some((entry) => entry.code === "intent_archived"));
});

test("resolves freshness for aging and stale intents", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  assert.equal(resolveIntentFreshness(intent, FIXED_TIME), "fresh");
  assert.equal(resolveIntentFreshness(intent, "2026-01-03T00:00:00.000Z"), "recent");

  const oldUpdated = Object.freeze({
    ...intent,
    metadata: Object.freeze({
      ...intent.metadata,
      updatedAt: "2026-03-15T00:00:00.000Z",
    }),
  });
  const staleResult = resolveExecutiveIntentStateResult(
    buildRequest(oldUpdated, Object.freeze({ evaluatedAt: STALE_EVALUATED_AT }))
  );
  assert.equal(staleResult.freshness, "stale");
  assert.ok(staleResult.diagnostics.some((entry) => entry.code === "intent_stale"));
});

test("detects blocked intent from blocking relations", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const blocked = Object.freeze({
    ...intent,
    relations: Object.freeze([
      Object.freeze({
        relationId: "rel-block-1",
        sourceIntentId: intent.intentId,
        targetIntentId: "intent-other",
        relationType: "blocks" as const,
        readOnly: true as const,
      }),
    ]),
  });
  const result = resolveExecutiveIntentStateResult(buildRequest(blocked));

  assert.equal(result.readiness, "blocked");
  assert.equal(isIntentBlocked(buildRequest(blocked)), true);
  assert.equal(isIntentReady(buildRequest(blocked)), false);
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_blocked"));
});

test("enforces workspace isolation", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const result = resolveExecutiveIntentStateResult(
    buildRequest(intent, Object.freeze({ workspaceId: "ws-other" }))
  );

  assert.equal(result.readiness, "blocked");
  assert.equal(result.state.flags.workspaceIsolated, false);
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_workspace_mismatch"));
});

test("generates deterministic diagnostics and summary", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const request = buildRequest(intent);
  const first = resolveIntentDiagnostics(request);
  const second = resolveIntentDiagnostics(request);
  assert.equal(first.length, second.length);
  assert.deepEqual(
    first.map((entry) => entry.code),
    second.map((entry) => entry.code)
  );

  const summary = resolveIntentStateSummary(request);
  assert.equal(summary.readOnly, true);
  assert.equal(summary.intentId, intent.intentId);
  assert.ok(summary.headline.length > 0);
});

test("declares diagnostics vocabulary", () => {
  assert.equal(EXECUTIVE_INTENT_DIAGNOSTIC_CODES.length, 14);
  assert.equal(isExecutiveIntentDiagnosticCode("intent_ok"), true);
  assert.equal(isExecutiveIntentDiagnosticCode("unknown_code"), false);
  const diagnostic = createExecutiveIntentDiagnostic("intent_ok", "OK", FIXED_TIME);
  assert.equal(diagnostic.futureCompatible, true);
  assert.equal(diagnostic.blocking, false);
});

test("validates structural health helper independently", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const diagnostics = resolveIntentDiagnostics(buildRequest(intent));
  assert.equal(resolveIntentStructuralHealth(intent, diagnostics), "healthy");
  assert.equal(resolveIntentStructuralHealth(null, diagnostics), "unknown");
});

test("resolves actionable intent only when ready and healthy", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  assert.equal(isIntentActionable(buildRequest(intent)), true);
});

test("produces deterministic probe example and engine metadata", () => {
  const first = resolveExecutiveIntentStateProbeExample(FIXED_TIME);
  const second = resolveExecutiveIntentStateProbeExample(FIXED_TIME);
  assert.equal(first.state.stateCategory, second.state.stateCategory);
  assert.equal(first.summary.headline, second.summary.headline);
  assert.equal(ExecutiveIntentStateEngine.version, "APP-3/2");
  assert.equal(EXECUTIVE_INTENT_STATE_ENGINE_RULES.noMutation, true);
  assert.ok(EXECUTIVE_INTENT_STATE_ENGINE_TAGS.includes("[APP3_2]"));
});

test("maintains APP-3:1 contract compatibility without modification", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  assert.equal(validateExecutiveIntentShape(intent).valid, true);
  const state = resolveExecutiveIntentState(buildRequest(intent));
  assert.equal(state.readOnly, true);
  assert.equal(intent.readOnly, true);
  assert.equal(intent.metadata.status, "active");
});

test("evaluates context without mutating input intent", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const before = JSON.stringify(intent);
  evaluateExecutiveIntentStateContext(buildRequest(intent));
  assert.equal(JSON.stringify(intent), before);
});

test("detects duplicate dependency identifiers", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const withDuplicate = Object.freeze({
    ...intent,
    metadata: Object.freeze({
      ...intent.metadata,
      dependencies: Object.freeze([
        Object.freeze({
          dependencyId: "dep-1",
          targetIntentId: "intent-other",
          relationType: "depends_on" as const,
          readOnly: true as const,
        }),
        Object.freeze({
          dependencyId: "dep-1",
          targetIntentId: "intent-other-2",
          relationType: "depends_on" as const,
          readOnly: true as const,
        }),
      ]),
    }),
  });
  const result = resolveExecutiveIntentStateResult(buildRequest(withDuplicate));
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_duplicate_dependency"));
});

test("detects unsupported contract version", () => {
  const intent = Object.freeze({
    ...resolveExecutiveIntentExample(FIXED_TIME),
    contractVersion: "APP-3/0",
  });
  const result = resolveExecutiveIntentStateResult(buildRequest(intent));
  assert.ok(result.diagnostics.some((entry) => entry.code === "intent_unsupported_version"));
});
