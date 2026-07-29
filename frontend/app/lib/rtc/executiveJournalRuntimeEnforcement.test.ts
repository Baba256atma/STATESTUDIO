/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Tests.
 *
 * Deterministic coverage for fail-closed enforcement planning.
 * No mocks. No randomness. No network. No databases. No execution.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import {
  evaluateExecutiveJournalRuntimePolicy,
} from "./executiveJournalRuntimePolicy.ts";
import type {
  ExecutiveJournalRuntimePolicyDecision,
  ExecutiveJournalRuntimePolicyObligation,
  ExecutiveJournalRuntimePolicyRequest,
} from "./executiveJournalRuntimePolicyTypes.ts";
import * as EnforcementModule from "./executiveJournalRuntimeEnforcement.ts";
import {
  ExecutiveJournalRuntimeEnforcement,
  ExecutiveJournalRuntimeEnforcementId,
  ExecutiveJournalRuntimeEnforcementName,
  ExecutiveJournalRuntimeEnforcementNamespace,
  ExecutiveJournalRuntimeEnforcementReadiness,
  ExecutiveJournalRuntimeEnforcementStatus,
  ExecutiveJournalRuntimeEnforcementVersion,
  ExecutiveJournalRuntimeObligationStepMapping,
  getExecutiveJournalRuntimeEnforcementSummary,
  isExecutiveJournalEnforcementAwaitingConfirmation,
  isExecutiveJournalEnforcementBlocked,
  isExecutiveJournalEnforcementEnforceable,
  planExecutiveJournalRuntimeEnforcement,
  validateExecutiveJournalObligationStepMapping,
} from "./executiveJournalRuntimeEnforcement.ts";
import type {
  ExecutiveJournalRuntimeEnforcementConfirmationEvidence,
  ExecutiveJournalRuntimeEnforcementRequest,
} from "./executiveJournalRuntimeEnforcementTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC26_FILES = Object.freeze([
  "executiveJournalRuntimeEnforcement.ts",
  "executiveJournalRuntimeEnforcementTypes.ts",
  "executiveJournalRuntimeEnforcementIdentity.ts",
  "executiveJournalRuntimeEnforcementLifecycle.ts",
  "executiveJournalRuntimeEnforcementContracts.ts",
  "executiveJournalRuntimeEnforcementRules.ts",
  "executiveJournalRuntimeEnforcementMetadata.ts",
  "executiveJournalRuntimeEnforcement.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeModel\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeValidation\.ts["']/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const validValidation = Object.freeze({
  outcome: "Valid" as const,
  valid: true,
  warningCount: 0,
  errorCount: 0,
});

const policyRequest = (
  overrides: Partial<ExecutiveJournalRuntimePolicyRequest>,
): ExecutiveJournalRuntimePolicyRequest =>
  Object.freeze({
    requestId: "req-1",
    operation: "Propose",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: "authority-1",
    delegation: null,
    purpose: "continuity",
    targetJournalId: "RTC-JRN-00000001",
    targetEntityKind: "Intent",
    targetEntityId: "intent-1",
    recordCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-intent",
    evidenceRefs: Object.freeze(["evidence-1"]),
    lifecycleState: "Proposed",
    requestedScope: Object.freeze(["fields:metadata"]),
    jurisdictionContext: null,
    jurisdictionRequired: false,
    breakGlass: null,
    validation: validValidation,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    dualControlRequired: false,
    ...overrides,
  });

const confirmationFor = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
  overrides: Partial<ExecutiveJournalRuntimeEnforcementConfirmationEvidence> = {},
): ExecutiveJournalRuntimeEnforcementConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: request.actorId,
    requestId: request.requestId,
    policyDecisionCode: request.policyDecision.decisionCode,
    policyVersion: request.policyDecision.policyVersion,
    targetId: request.targetEntityId,
    operation: request.operation,
    proposedEffect: request.proposedEffect,
    authorityRef: request.authorityRef ?? "",
    singleUse: true as const,
    expired: false,
    expiryMetadata: "expiry:upstream-authority",
    ...overrides,
  });

const enforcementRequest = (
  decision: ExecutiveJournalRuntimePolicyDecision,
  overrides: Partial<ExecutiveJournalRuntimeEnforcementRequest> = {},
): ExecutiveJournalRuntimeEnforcementRequest => {
  const base: ExecutiveJournalRuntimeEnforcementRequest = Object.freeze({
    requestId: decision.requestId,
    policyDecision: decision,
    operation: "Propose",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: "authority-1",
    authorityStatus: "Active",
    purpose: decision.purpose,
    targetJournalId: "RTC-JRN-00000001",
    targetEntityKind: "Intent",
    targetEntityId: decision.targetId,
    proposedEffect: "record-intent",
    lifecycleState: "Proposed",
    recordCategory: "ExecutiveRecord",
    classification: "internal",
    validationOutcome: "Valid",
    evidenceRefs: Object.freeze([...decision.evidenceRefs]),
    predecessorRef: null,
    affectedRef: null,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    confirmationEvidence: null,
    requiresUnresolvedOpenIssueDefault: false,
    ...overrides,
  });
  return base;
};

const withConfirmation = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
  overrides: Partial<ExecutiveJournalRuntimeEnforcementConfirmationEvidence> = {},
): ExecutiveJournalRuntimeEnforcementRequest =>
  Object.freeze({
    ...request,
    confirmationEvidence: confirmationFor(request, overrides),
  });

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

describe("RTC-2:6 Executive Journal Runtime Policy Enforcement", () => {
  it("1-4: exact identity, namespace, status, and RTC-1:6 readiness", () => {
    assert.equal(RTC26_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC26_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      ExecutiveJournalRuntimeEnforcementId,
      "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcementNamespace,
      "nexora.rtc.executive.journal.enforcement",
    );
    assert.equal(ExecutiveJournalRuntimeEnforcementStatus, "Enforcement");
    assert.equal(
      ExecutiveJournalRuntimeEnforcementReadiness,
      "ReadyForCertification",
    );
    assert.equal(ExecutiveJournalRuntimeEnforcementVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeEnforcementName,
      "Executive Journal Runtime Policy Enforcement",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.nextPhase,
      "RTC-2:7 — Executive Journal Runtime Execution Contract",
    );
    assert.ok("planExecutiveJournalRuntimeEnforcement" in EnforcementModule);
  });

  it("5-6: imports RTC-2:5 by reference and preserves upstream chain", () => {
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.policy,
      ExecutiveJournalRuntimePolicy,
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.upstreamChain.policy,
      "RTC-2:5/ExecutiveJournalRuntimePolicy",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.upstreamChain.validation,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.upstreamChain.model,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.upstreamChain.registry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.upstreamChain.foundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.aiMustNot,
      ExecutiveJournalRuntimePolicy.aiMustNot,
    );
    assert.equal(ExecutiveJournalRuntimePolicy.readiness, "ReadyForPlatform");
  });

  it("7-8: Deny produces Blocked with no effect steps", () => {
    const denied = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({ operation: "Teleport" }),
    );
    assert.equal(denied.decision, "Deny");
    const result = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(denied, { operation: "Teleport" }),
    );
    if (result.kind !== "Blocked") {
      assert.fail(`Expected Blocked, received ${result.kind}`);
    }
    assert.equal(isExecutiveJournalEnforcementBlocked(result), true);
    assert.equal(result.steps.length, 0);
    assert.deepEqual(result.steps, []);
    assert.equal(result.plan, null);
  });

  it("9-10: confirmation-required produces AwaitingConfirmation with no effect steps", () => {
    const confirm = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(confirm.decision, "RequireConfirmation");
    const result = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(confirm, {
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
        lifecycleState: "Proposed",
      }),
    );
    assert.equal(result.kind, "AwaitingConfirmation");
    assert.equal(
      isExecutiveJournalEnforcementAwaitingConfirmation(result),
      true,
    );
    assert.equal(result.steps.length, 0);
    assert.equal(result.plan, null);
    if (result.kind === "AwaitingConfirmation") {
      assert.ok(result.preparationSteps.every((step) => !step.effectBearing));
    }
  });

  it("11: valid confirmation permits the eligible plan", () => {
    const confirm = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    const pending = enforcementRequest(confirm, {
      operation: "Confirm",
      targetEntityKind: "Decision",
      targetEntityId: "decision-1",
      proposedEffect: "confirm-decision",
      lifecycleState: "Proposed",
    });
    const result = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(pending),
    );
    assert.equal(result.kind, "Enforceable");
    assert.equal(isExecutiveJournalEnforcementEnforceable(result), true);
    assert.ok(result.plan);
    assert.ok(
      result.steps.some((step) => step.kind === "PrepareEventAppend"),
    );
  });

  it("12-15: confirmation binding mismatches and expiry block", () => {
    const confirm = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    const pending = enforcementRequest(confirm, {
      operation: "Confirm",
      targetEntityKind: "Decision",
      targetEntityId: "decision-1",
      proposedEffect: "confirm-decision",
    });

    const actorMismatch = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(pending, { actorId: "other-actor" }),
    );
    assert.equal(actorMismatch.kind, "Blocked");

    const requestMismatch = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(pending, { requestId: "other-req" }),
    );
    assert.equal(requestMismatch.kind, "Blocked");

    const versionMismatch = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(pending, { policyVersion: "9.9.9" }),
    );
    assert.equal(versionMismatch.kind, "Blocked");

    const expired = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(pending, { expired: true }),
    );
    assert.equal(expired.kind, "Blocked");
  });

  it("16: Allow with satisfied obligations produces Enforceable", () => {
    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    assert.equal(allowed.decision, "Allow");
    const result = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(allowed),
    );
    assert.equal(result.kind, "Enforceable");
    assert.ok(result.plan);
    assert.ok(result.steps.some((step) => step.kind === "SealEnforcementPlan"));
  });

  it("17-18: unknown decision kind and unknown obligation block", () => {
    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const unknownDecision = Object.freeze({
      ...allowed,
      decision: "Maybe" as ExecutiveJournalRuntimePolicyDecision["decision"],
    });
    const unknownKind = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(unknownDecision),
    );
    assert.equal(unknownKind.kind, "Blocked");
    assert.equal(unknownKind.reasonCode, "ENF-UNKNOWN-DECISION");

    const fakeObligation = Object.freeze({
      obligationId: "RTC-2:5/Obligation/Unknown",
      kind: "RequireTeleport" as ExecutiveJournalRuntimePolicyObligation["kind"],
      description: "unsupported",
      order: 99,
      metadataOnly: true as const,
      immutable: true as const,
    });
    const unknownObligationDecision = Object.freeze({
      ...allowed,
      obligations: Object.freeze([fakeObligation]),
    });
    const unknownObligation = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(unknownObligationDecision),
    );
    assert.equal(unknownObligation.kind, "Blocked");
    assert.equal(unknownObligation.reasonCode, "ENF-UNSUPPORTED-OBLIGATION");
    if (unknownObligation.kind === "Blocked") {
      assert.equal(unknownObligation.unsupportedObligation, "RequireTeleport");
    }
  });

  it("19-21: missing/revoked authority and invalid validation block", () => {
    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const missingAuthority = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(allowed, { authorityRef: null }),
    );
    assert.equal(missingAuthority.kind, "Blocked");

    const revoked = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(allowed, { authorityStatus: "Revoked" }),
    );
    assert.equal(revoked.kind, "Blocked");

    const invalidValidation = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(allowed, { validationOutcome: "Invalid" }),
    );
    assert.equal(invalidValidation.kind, "Blocked");
  });

  it("22-26: AI cannot confirm, create authority, close, disclose/export, or alter retention", () => {
    const confirm = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
        actorKind: "Human",
      }),
    );
    const aiConfirm = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(confirm, {
          operation: "Confirm",
          actorKind: "Ai",
          targetEntityId: "decision-1",
          proposedEffect: "confirm-decision",
        }),
      ),
    );
    assert.equal(aiConfirm.kind, "Blocked");
    assert.equal(aiConfirm.reasonCode, "ENF-AI");

    const propose = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Propose",
        targetEntityKind: "AuthorityReference",
        targetEntityId: "auth-ref-1",
        actorKind: "Human",
      }),
    );
    const aiAuthority = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(propose, {
        actorKind: "Ai",
        targetEntityKind: "AuthorityReference",
        targetEntityId: "auth-ref-1",
      }),
    );
    assert.equal(aiAuthority.kind, "Blocked");
    assert.equal(aiAuthority.reasonCode, "ENF-AI-AUTHORITY");

    const close = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "CloseCommitment",
        targetEntityKind: "Commitment",
        targetEntityId: "commit-1",
        proposedEffect: "close-commitment",
      }),
    );
    const aiClose = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(close, {
          operation: "CloseCommitment",
          actorKind: "Ai",
          targetEntityId: "commit-1",
          proposedEffect: "close-commitment",
        }),
      ),
    );
    assert.equal(aiClose.kind, "Blocked");

    const disclose = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Disclose",
        proposedEffect: "disclose",
        purpose: "oversight",
      }),
    );
    const aiDisclose = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(disclose, {
        operation: "Disclose",
        actorKind: "Ai",
        proposedEffect: "disclose",
      }),
    );
    assert.equal(aiDisclose.kind, "Blocked");

    const exported = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Export",
        proposedEffect: "export",
        exportPolicyRef: "export-policy-1",
        purpose: "oversight",
      }),
    );
    const aiExport = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(exported, {
        operation: "Export",
        actorKind: "Ai",
        proposedEffect: "export",
        exportPolicyRef: "export-policy-1",
      }),
    );
    assert.equal(aiExport.kind, "Blocked");

    const retention = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "ApplyRetention",
        proposedEffect: "retain",
        retentionPolicyRef: "retention-policy-1",
      }),
    );
    const aiRetention = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(retention, {
          operation: "ApplyRetention",
          actorKind: "Ai",
          proposedEffect: "retain",
          retentionPolicyRef: "retention-policy-1",
        }),
      ),
    );
    assert.equal(aiRetention.kind, "Blocked");

    const dispose = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Dispose",
        proposedEffect: "dispose",
        dispositionPolicyRef: "disposition-policy-1",
      }),
    );
    const aiDispose = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(dispose, {
          operation: "Dispose",
          actorKind: "Ai",
          proposedEffect: "dispose",
          dispositionPolicyRef: "disposition-policy-1",
        }),
      ),
    );
    assert.equal(aiDispose.kind, "Blocked");
  });

  it("27-29: private reflection cannot enter shared search, projection, or export", () => {
    const policyDenied = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Search",
        recordCategory: "PrivateReflection",
        proposedEffect: "search",
      }),
    );
    assert.equal(policyDenied.decision, "Deny");
    assert.equal(
      planExecutiveJournalRuntimeEnforcement(
        enforcementRequest(policyDenied, {
          operation: "Search",
          recordCategory: "PrivateReflection",
          proposedEffect: "search",
        }),
      ).kind,
      "Blocked",
    );

    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const privateAllow = Object.freeze({
      ...allowed,
      decision: "Allow" as const,
    });
    for (const operation of ["Search", "Project", "Export"] as const) {
      const result = planExecutiveJournalRuntimeEnforcement(
        enforcementRequest(privateAllow, {
          operation,
          recordCategory: "PrivateReflection",
          proposedEffect: operation.toLowerCase(),
          exportPolicyRef: operation === "Export" ? "export-policy-1" : null,
        }),
      );
      assert.equal(result.kind, "Blocked");
      assert.equal(result.reasonCode, "ENF-PRIVATE");
    }
  });

  it("30: private promotion requires confirmation and prepares a new shared event", () => {
    const promote = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "PromotePrivateReflection",
        recordCategory: "PrivateReflection",
        targetEntityKind: "PrivateReflection",
        targetEntityId: "private-1",
        proposedEffect: "promote-private",
      }),
    );
    const awaiting = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(promote, {
        operation: "PromotePrivateReflection",
        recordCategory: "PrivateReflection",
        targetEntityKind: "PrivateReflection",
        targetEntityId: "private-1",
        proposedEffect: "promote-private",
      }),
    );
    assert.equal(awaiting.kind, "AwaitingConfirmation");

    const enforceable = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(promote, {
          operation: "PromotePrivateReflection",
          recordCategory: "PrivateReflection",
          targetEntityKind: "PrivateReflection",
          targetEntityId: "private-1",
          proposedEffect: "promote-private",
        }),
      ),
    );
    assert.equal(enforceable.kind, "Enforceable");
    assert.ok(
      enforceable.steps.some((step) => step.kind === "PrepareEventAppend"),
    );
    assert.equal(enforceable.plan?.privacyCategory, "PrivateReflection");
  });

  it("31-33: correction is append-only, supersession preserves predecessor, invalid lifecycle blocks", () => {
    const baseAllow = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const correction = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(baseAllow, {
        operation: "Correct",
        proposedEffect: "correct",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        affectedRef: "event-accepted-1",
        lifecycleState: "Accepted",
      }),
    );
    assert.equal(correction.kind, "Enforceable");
    assert.ok(
      correction.steps.some((step) => step.kind === "PrepareCorrectionAppend"),
    );
    assert.ok(
      !correction.steps.some((step) =>
        step.description.toLowerCase().includes("in-place")
      ),
    );

    const supersession = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(baseAllow, {
        operation: "Supersede",
        proposedEffect: "supersede",
        targetEntityId: "decision-2",
        predecessorRef: "decision-1",
        lifecycleState: "Accepted",
      }),
    );
    assert.equal(supersession.kind, "Enforceable");
    assert.ok(
      supersession.steps.some((step) =>
        step.kind === "PrepareSupersessionAppend"
      ),
    );
    assert.ok(
      supersession.plan?.compensationMetadata?.includes("predecessor:decision-1"),
    );

    const closeAgain = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "CloseCommitment",
        targetEntityKind: "Commitment",
        targetEntityId: "commit-1",
        proposedEffect: "close-commitment",
      }),
    );
    const invalidLifecycle = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(closeAgain, {
          operation: "CloseCommitment",
          targetEntityId: "commit-1",
          proposedEffect: "close-commitment",
          lifecycleState: "Closed",
        }),
      ),
    );
    assert.equal(invalidLifecycle.kind, "Blocked");
    assert.equal(invalidLifecycle.reasonCode, "ENF-LIFECYCLE");
  });

  it("34-35: disclosure maps filter/redaction; export maps evidence without choosing format", () => {
    const disclose = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Disclose",
        proposedEffect: "disclose",
        purpose: "oversight",
      }),
    );
    const disclosure = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(disclose, {
        operation: "Disclose",
        proposedEffect: "disclose",
        purpose: "oversight",
      }),
    );
    if (disclosure.kind === "Enforceable") {
      assert.ok(
        disclosure.steps.some((step) => step.kind === "ApplyFieldFilter"),
      );
      assert.ok(
        disclosure.steps.some((step) => step.kind === "ApplyRedaction"),
      );
      assert.ok(
        disclosure.steps.some((step) =>
          step.kind === "PrepareDisclosureEvidence"
        ),
      );
    } else {
      assert.equal(disclosure.kind, "AwaitingConfirmation");
      const confirmed = planExecutiveJournalRuntimeEnforcement(
        withConfirmation(
          enforcementRequest(disclose, {
            operation: "Disclose",
            proposedEffect: "disclose",
            purpose: "oversight",
          }),
        ),
      );
      assert.equal(confirmed.kind, "Enforceable");
      assert.ok(
        confirmed.steps.some((step) => step.kind === "ApplyFieldFilter"),
      );
      assert.ok(
        confirmed.steps.some((step) => step.kind === "ApplyRedaction"),
      );
    }

    const exported = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Export",
        proposedEffect: "export",
        exportPolicyRef: "export-policy-1",
        purpose: "oversight",
      }),
    );
    const exportPlan = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(exported, {
          operation: "Export",
          proposedEffect: "export",
          exportPolicyRef: "export-policy-1",
          purpose: "oversight",
        }),
      ),
    );
    assert.equal(exportPlan.kind, "Enforceable");
    const exportStep = exportPlan.steps.find(
      (step) => step.kind === "PrepareExportEvidence",
    );
    assert.ok(exportStep);
    assert.ok(!exportStep.description.toLowerCase().includes("format pdf"));
    assert.ok(!exportStep.description.toLowerCase().includes("choose"));
  });

  it("36-38: retention does not choose period; disposition requires confirmation; break-glass bounded", () => {
    const retention = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "ApplyRetention",
        proposedEffect: "retain",
        retentionPolicyRef: "retention-policy-1",
      }),
    );
    const retentionPlan = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(retention, {
          operation: "ApplyRetention",
          proposedEffect: "retain",
          retentionPolicyRef: "retention-policy-1",
        }),
      ),
    );
    assert.equal(retentionPlan.kind, "Enforceable");
    const retentionStep = retentionPlan.steps.find(
      (step) => step.kind === "PrepareRetentionEvidence",
    );
    assert.ok(retentionStep);
    assert.ok(
      retentionStep.description.includes("without choosing a retention period"),
    );

    const dispose = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Dispose",
        proposedEffect: "dispose",
        dispositionPolicyRef: "disposition-policy-1",
      }),
    );
    const awaitingDispose = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(dispose, {
        operation: "Dispose",
        proposedEffect: "dispose",
        dispositionPolicyRef: "disposition-policy-1",
      }),
    );
    assert.equal(awaitingDispose.kind, "AwaitingConfirmation");
    const disposePlan = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(dispose, {
          operation: "Dispose",
          proposedEffect: "dispose",
          dispositionPolicyRef: "disposition-policy-1",
        }),
      ),
    );
    assert.equal(disposePlan.kind, "Enforceable");
    assert.ok(
      disposePlan.steps.some((step) =>
        step.kind === "PrepareDispositionEvidence"
      ),
    );

    const breakGlass = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "BreakGlassAccess",
        proposedEffect: "break-glass",
        breakGlass: Object.freeze({
          emergencyCategory: "continuity",
          reason: "incident",
          narrowScope: "record-1",
          expiryRequired: true,
          reviewRequired: true,
        }),
      }),
    );
    const breakGlassPlan = planExecutiveJournalRuntimeEnforcement(
      withConfirmation(
        enforcementRequest(breakGlass, {
          operation: "BreakGlassAccess",
          proposedEffect: "break-glass",
        }),
      ),
    );
    assert.equal(breakGlassPlan.kind, "Enforceable");
    assert.ok(
      breakGlassPlan.steps.some((step) =>
        step.kind === "PrepareBreakGlassReview"
      ),
    );
    assert.ok(
      breakGlassPlan.steps.some((step) => step.kind === "VerifyConfirmation"),
    );
  });

  it("39-41: obligation mapping complete, step order deterministic, repeated planning equivalent", () => {
    assert.equal(validateExecutiveJournalObligationStepMapping(), true);
    for (const kind of ExecutiveJournalRuntimePolicy.obligationKinds) {
      assert.ok(
        ExecutiveJournalRuntimeObligationStepMapping[kind],
        `missing mapping for ${kind}`,
      );
    }

    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const input = enforcementRequest(allowed);
    const first = planExecutiveJournalRuntimeEnforcement(input);
    const second = planExecutiveJournalRuntimeEnforcement(input);
    assert.deepEqual(first, second);
    if (first.kind === "Enforceable" && second.kind === "Enforceable") {
      const orders = first.steps.map((step) => step.order);
      const sorted = [...orders].sort((a, b) => a - b);
      assert.deepEqual(orders, sorted);
      assert.deepEqual(
        first.steps.map((step) => step.kind),
        second.steps.map((step) => step.kind),
      );
      assert.equal(first.plan?.summary, second.plan?.summary);
    }
  });

  it("42-43: inputs are not mutated and exported canonical data is mutation-safe", () => {
    const allowed = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
    const input = enforcementRequest(allowed);
    const before = JSON.stringify(input);
    const result = planExecutiveJournalRuntimeEnforcement(input);
    assert.equal(JSON.stringify(input), before);
    assert.equal(mutateFrozen(result), false);
    if (result.kind === "Enforceable" && result.plan) {
      assert.equal(mutateFrozen(result.plan), false);
      assert.equal(mutateFrozen(result.steps), false);
    }
    const summary = getExecutiveJournalRuntimeEnforcementSummary();
    assert.equal(mutateFrozen(summary), false);
    assert.equal(mutateFrozen(ExecutiveJournalRuntimeEnforcement), false);
  });

  it("44: OI-01 through OI-06 remain unresolved", () => {
    const ids = ExecutiveJournalRuntimeEnforcement.openIssues.map(
      (item) => item.issueId,
    );
    assert.deepEqual(ids, [
      "OI-01",
      "OI-02",
      "OI-03",
      "OI-04",
      "OI-05",
      "OI-06",
    ]);
    assert.ok(
      ExecutiveJournalRuntimeEnforcement.openIssues.every(
        (item) => item.resolved === false && item.resolvedByEnforcement === false,
      ),
    );
    const blockedOpenIssue = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(
        evaluateExecutiveJournalRuntimePolicy(policyRequest({})),
        { requiresUnresolvedOpenIssueDefault: true },
      ),
    );
    assert.equal(blockedOpenIssue.kind, "Blocked");
    assert.equal(blockedOpenIssue.reasonCode, "ENF-OPEN-ISSUE");
  });

  it("45: no prohibited imports exist in RTC-2:6 files", () => {
    for (const file of RTC26_FILES) {
      if (file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} matches prohibited import ${pattern}`,
        );
      }
    }
    const aggregate = readFileSync(
      `${HERE}/executiveJournalRuntimeEnforcement.ts`,
      "utf8",
    );
    assert.ok(
      aggregate.includes('from "./executiveJournalRuntimePolicy.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimeValidation.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimeFoundation.ts"'),
    );
    const rules = readFileSync(
      `${HERE}/executiveJournalRuntimeEnforcementRules.ts`,
      "utf8",
    );
    assert.ok(rules.includes('from "./executiveJournalRuntimePolicy.ts"'));
  });

  it("46: precedence is Blocked > AwaitingConfirmation > Enforceable", () => {
    assert.deepEqual(
      [...ExecutiveJournalRuntimeEnforcement.lifecycle.precedence],
      ["Blocked", "AwaitingConfirmation", "Enforceable"],
    );
    assert.equal(ExecutiveJournalRuntimeEnforcement.executesPlans, false);
    assert.equal(ExecutiveJournalRuntimeEnforcement.plansOnly, true);
  });
});
