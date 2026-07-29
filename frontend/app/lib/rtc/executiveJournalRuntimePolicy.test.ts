/**
 * RTC-2:5 — Executive Journal Runtime Policy Tests.
 *
 * Deterministic coverage for fail-closed policy evaluation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveJournalRuntimeValidation } from "./executiveJournalRuntimeValidation.ts";
import * as PolicyModule from "./executiveJournalRuntimePolicy.ts";
import {
  ExecutiveJournalRuntimePolicy,
  ExecutiveJournalRuntimePolicyId,
  ExecutiveJournalRuntimePolicyName,
  ExecutiveJournalRuntimePolicyNamespace,
  ExecutiveJournalRuntimePolicyReadiness,
  ExecutiveJournalRuntimePolicyStatus,
  ExecutiveJournalRuntimePolicyVersion,
  evaluateExecutiveJournalRuntimePolicy,
  getExecutiveJournalRuntimePolicySummary,
  isExecutiveJournalPolicyAllowed,
  isExecutiveJournalPolicyConfirmationRequired,
  isExecutiveJournalPolicyDenied,
} from "./executiveJournalRuntimePolicy.ts";
import type { ExecutiveJournalRuntimePolicyRequest } from "./executiveJournalRuntimePolicyTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC25_FILES = Object.freeze([
  "executiveJournalRuntimePolicy.ts",
  "executiveJournalRuntimePolicyTypes.ts",
  "executiveJournalRuntimePolicyIdentity.ts",
  "executiveJournalRuntimePolicyLifecycle.ts",
  "executiveJournalRuntimePolicyContracts.ts",
  "executiveJournalRuntimePolicyRules.ts",
  "executiveJournalRuntimePolicyMetadata.ts",
  "executiveJournalRuntimePolicy.test.ts",
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

const invalidValidation = Object.freeze({
  outcome: "Invalid" as const,
  valid: false,
  warningCount: 0,
  errorCount: 1,
});

const request = (
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

describe("RTC-2:5 Executive Journal Runtime Policy", () => {
  it("creates exactly eight Policy files with canonical identity", () => {
    assert.equal(RTC25_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC25_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      ExecutiveJournalRuntimePolicyId,
      "RTC-2:5/ExecutiveJournalRuntimePolicy",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicyNamespace,
      "nexora.rtc.executive.journal.policy",
    );
    assert.equal(ExecutiveJournalRuntimePolicyStatus, "Policy");
    assert.equal(ExecutiveJournalRuntimePolicyReadiness, "ReadyForPlatform");
    assert.equal(ExecutiveJournalRuntimePolicyVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimePolicyName,
      "Executive Journal Runtime Policy",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.nextPhase,
      "RTC-2:6 — Executive Journal Runtime Policy Enforcement",
    );
    assert.ok("evaluateExecutiveJournalRuntimePolicy" in PolicyModule);
  });

  it("imports RTC-2:4 by reference and preserves upstream chain identities", () => {
    assert.equal(
      ExecutiveJournalRuntimePolicy.validation,
      ExecutiveJournalRuntimeValidation,
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.model,
      ExecutiveJournalRuntimeValidation.model,
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.registry,
      ExecutiveJournalRuntimeValidation.model.registry,
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.foundation,
      ExecutiveJournalRuntimeValidation.model.foundation,
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.upstreamChain.validation,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.upstreamChain.model,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.upstreamChain.registry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.upstreamChain.foundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(
      ExecutiveJournalRuntimePolicy.aiMustNot,
      ExecutiveJournalRuntimeValidation.aiMustNot,
    );
  });

  it("allows a canonical valid human propose and denies invalid/missing validation", () => {
    const allowed = evaluateExecutiveJournalRuntimePolicy(request({}));
    assert.equal(allowed.decision, "Allow");
    assert.equal(isExecutiveJournalPolicyAllowed(allowed), true);

    const invalid = evaluateExecutiveJournalRuntimePolicy(
      request({ validation: invalidValidation }),
    );
    assert.equal(invalid.decision, "Deny");

    const missing = evaluateExecutiveJournalRuntimePolicy(
      request({ validation: null }),
    );
    assert.equal(missing.decision, "Deny");
    assert.equal(missing.validationOutcome, "Missing");
  });

  it("denies unknown operations and missing authority on consequential actions", () => {
    const unknown = evaluateExecutiveJournalRuntimePolicy(
      request({ operation: "Teleport" }),
    );
    assert.equal(unknown.decision, "Deny");

    const noAuthority = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        authorityRef: null,
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(noAuthority.decision, "Deny");
  });

  it("denies revoked and out-of-scope delegation", () => {
    const revoked = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        delegation: Object.freeze({
          status: "Revoked",
          scope: "decisions",
          evidenceRef: "d1",
        }),
      }),
    );
    assert.equal(revoked.decision, "Deny");

    const outOfScope = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        delegation: Object.freeze({
          status: "OutOfScope",
          scope: "other",
          evidenceRef: "d1",
        }),
      }),
    );
    assert.equal(outOfScope.decision, "Deny");
  });

  it("requires human confirmation for consequential decision and commitment closure", () => {
    const confirm = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        targetEntityKind: "Decision",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(confirm.decision, "RequireConfirmation");
    assert.equal(isExecutiveJournalPolicyConfirmationRequired(confirm), true);
    assert.ok(confirm.confirmation);

    const close = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "CloseCommitment",
        targetEntityKind: "Commitment",
        proposedEffect: "close-commitment",
      }),
    );
    assert.equal(close.decision, "RequireConfirmation");
  });

  it("enforces AI boundary prohibitions and non-authoritative propose", () => {
    const aiConfirm = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        actorKind: "Ai",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(aiConfirm.decision, "Deny");

    const aiAuthority = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Propose",
        actorKind: "Ai",
        targetEntityKind: "AuthorityReference",
        proposedEffect: "create-authority",
      }),
    );
    assert.equal(aiAuthority.decision, "Deny");

    const aiClose = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "CloseCommitment",
        actorKind: "Ai",
        proposedEffect: "close-commitment",
      }),
    );
    assert.equal(aiClose.decision, "Deny");

    const aiDisclose = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Disclose",
        actorKind: "Ai",
        proposedEffect: "disclose",
      }),
    );
    assert.equal(aiDisclose.decision, "Deny");

    const aiExport = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Export",
        actorKind: "Ai",
        exportPolicyRef: "export-pol",
        proposedEffect: "export",
      }),
    );
    assert.equal(aiExport.decision, "Deny");

    const aiRetention = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "ApplyRetention",
        actorKind: "Ai",
        retentionPolicyRef: "ret-1",
        proposedEffect: "retain",
      }),
    );
    assert.equal(aiRetention.decision, "Deny");

    const aiDispose = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Dispose",
        actorKind: "Ai",
        dispositionPolicyRef: "disp-1",
        proposedEffect: "dispose",
      }),
    );
    assert.equal(aiDispose.decision, "Deny");

    const aiPropose = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Propose",
        actorKind: "Ai",
        targetEntityKind: "Intent",
        proposedEffect: "draft-intent",
      }),
    );
    assert.equal(aiPropose.decision, "Allow");
  });

  it("protects private reflection and requires confirmation for promotion", () => {
    const search = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Search",
        recordCategory: "PrivateReflection",
        purpose: "discovery",
      }),
    );
    assert.equal(search.decision, "Deny");

    const project = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Project",
        recordCategory: "PrivateReflection",
      }),
    );
    assert.equal(project.decision, "Deny");

    const exported = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Export",
        recordCategory: "PrivateReflection",
        exportPolicyRef: "export-pol",
      }),
    );
    assert.equal(exported.decision, "Deny");

    const promote = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "PromotePrivateReflection",
        recordCategory: "PrivateReflection",
        proposedEffect: "promote-selected",
      }),
    );
    assert.equal(promote.decision, "RequireConfirmation");
  });

  it("fails closed on disclosure and does not reveal protected metadata", () => {
    const denied = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Disclose",
        purpose: null,
        classification: "secret-title-should-not-leak",
        proposedEffect: "disclose-secret",
        targetEntityId: "secret-entity-99",
      }),
    );
    assert.equal(denied.decision, "Deny");
    assert.equal(denied.reason, "Disclosure denied.");
    assert.equal(denied.revealsProtectedMetadata, false);
    assert.doesNotMatch(denied.reason, /secret-title|secret-entity/);
  });

  it("requires authority and confirmation for export, retention, and disposition", () => {
    const exported = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Export",
        exportPolicyRef: "export-pol-1",
        proposedEffect: "export-record",
      }),
    );
    assert.equal(exported.decision, "RequireConfirmation");

    const retention = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "ApplyRetention",
        retentionPolicyRef: "ret-pol-1",
        proposedEffect: "apply-retention",
      }),
    );
    assert.equal(retention.decision, "RequireConfirmation");

    const disposition = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Dispose",
        dispositionPolicyRef: "disp-pol-1",
        proposedEffect: "dispose-record",
      }),
    );
    assert.equal(disposition.decision, "RequireConfirmation");

    const dispositionMissing = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Dispose",
        dispositionPolicyRef: null,
        evidenceRefs: Object.freeze([]),
        proposedEffect: "dispose-record",
      }),
    );
    assert.equal(dispositionMissing.decision, "Deny");
  });

  it("bounds break-glass and enforces decision precedence", () => {
    const breakGlass = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "BreakGlassAccess",
        proposedEffect: "emergency-read",
        breakGlass: Object.freeze({
          emergencyCategory: "incident",
          reason: "continuity",
          narrowScope: "journal-1",
          expiryRequired: true,
          reviewRequired: true,
        }),
      }),
    );
    assert.equal(breakGlass.decision, "RequireConfirmation");
    assert.ok(
      breakGlass.obligations.some((item) =>
        item.kind === "RequireBreakGlassReview"
      ),
    );

    const precedence = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        actorKind: "Ai",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(precedence.decision, "Deny");
    assert.equal(isExecutiveJournalPolicyDenied(precedence), true);

    const confirmOverAllow = evaluateExecutiveJournalRuntimePolicy(
      request({
        operation: "Confirm",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(confirmOverAllow.decision, "RequireConfirmation");
  });

  it("keeps obligations immutable/deterministic and does not mutate input", () => {
    const input = request({
      operation: "Export",
      exportPolicyRef: "export-pol-1",
      proposedEffect: "export-record",
    });
    const before = JSON.stringify(input);
    const first = evaluateExecutiveJournalRuntimePolicy(input);
    const second = evaluateExecutiveJournalRuntimePolicy(input);
    assert.equal(JSON.stringify(input), before);
    assert.deepEqual(first, second);
    assert.equal(Object.isFrozen(first), true);
    assert.equal(Object.isFrozen(first.obligations), true);
    const kinds = first.obligations.map((item) => item.kind);
    assert.deepEqual(kinds, [...kinds].sort((a, b) => {
      const order = ExecutiveJournalRuntimePolicy.obligationKinds;
      return order.indexOf(a) - order.indexOf(b);
    }));
    assert.deepEqual(
      first.matchingRuleIds,
      [...first.matchingRuleIds].sort(),
    );
  });

  it("carries open issues unresolved and bans prohibited imports", () => {
    assert.equal(ExecutiveJournalRuntimePolicy.openIssues.length, 6);
    for (const issue of ExecutiveJournalRuntimePolicy.openIssues) {
      assert.equal(issue.resolved, false);
      assert.equal(issue.resolvedByPolicy, false);
    }
    assert.equal(ExecutiveJournalRuntimePolicy.resolvesOpenIssues, false);

    const sources = RTC25_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(source, pattern, `${file} ${pattern}`);
      }
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.doesNotMatch(source, /\b(fetch|Date\.now|Math\.random)\b/);
    }
  });

  it("preserves deterministic summary", () => {
    const summaryA = getExecutiveJournalRuntimePolicySummary();
    const summaryB = getExecutiveJournalRuntimePolicySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.ruleCount, 27);
    assert.equal(summaryA.operationCount, 18);
    assert.equal(summaryA.obligationKindCount, 12);
    assert.equal(summaryA.openIssueCount, 6);
  });
});
