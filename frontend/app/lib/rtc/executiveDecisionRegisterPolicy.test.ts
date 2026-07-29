/**
 * RTC-3:5 — Executive Decision Register Policy Tests.
 *
 * Deterministic coverage for fail-closed policy evaluation.
 * Direct rule-to-test traceability for every canonical rule.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveDecisionRegisterValidation } from "./executiveDecisionRegisterValidation.ts";
import * as PolicyModule from "./executiveDecisionRegisterPolicy.ts";
import {
  ExecutiveDecisionRegisterPolicy,
  ExecutiveDecisionRegisterPolicyId,
  ExecutiveDecisionRegisterPolicyName,
  ExecutiveDecisionRegisterPolicyNamespace,
  ExecutiveDecisionRegisterPolicyReadiness,
  ExecutiveDecisionRegisterPolicyStatus,
  ExecutiveDecisionRegisterPolicyVersion,
  evaluateExecutiveDecisionRegisterPolicy,
  getExecutiveDecisionRegisterPolicyObligations,
  getExecutiveDecisionRegisterPolicySummary,
  isExecutiveDecisionRegisterPolicyAllowed,
  isExecutiveDecisionRegisterPolicyConfirmationRequired,
  isExecutiveDecisionRegisterPolicyDenied,
  verifyExecutiveDecisionRegisterPolicyRuleCompleteness,
} from "./executiveDecisionRegisterPolicy.ts";
import { ExecutiveDecisionRegisterPolicyRules } from "./executiveDecisionRegisterPolicyRules.ts";
import type {
  ExecutiveDecisionRegisterPolicyDecision,
  ExecutiveDecisionRegisterPolicyDecisionKind,
  ExecutiveDecisionRegisterPolicyRequest,
} from "./executiveDecisionRegisterPolicyTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC35_FILES = Object.freeze([
  "executiveDecisionRegisterPolicy.ts",
  "executiveDecisionRegisterPolicyTypes.ts",
  "executiveDecisionRegisterPolicyIdentity.ts",
  "executiveDecisionRegisterPolicyLifecycle.ts",
  "executiveDecisionRegisterPolicyContracts.ts",
  "executiveDecisionRegisterPolicyRules.ts",
  "executiveDecisionRegisterPolicyMetadata.ts",
  "executiveDecisionRegisterPolicy.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterModel\.ts["']/,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const VALIDATION_REF = "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

const validValidation = Object.freeze({
  outcome: "Valid" as const,
  valid: true,
  warningCount: 0,
  errorCount: 0,
  validationResultRef: VALIDATION_REF,
});

const invalidValidation = Object.freeze({
  outcome: "Invalid" as const,
  valid: false,
  warningCount: 0,
  errorCount: 1,
  validationResultRef: VALIDATION_REF,
});

const request = (
  overrides: Partial<ExecutiveDecisionRegisterPolicyRequest>,
): ExecutiveDecisionRegisterPolicyRequest =>
  Object.freeze({
    requestId: "req-1",
    operation: "ProposeDecision",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: "authority-1",
    delegation: null,
    purpose: "continuity",
    targetRegister: "RTC-EDR-00000001",
    targetEntityKind: "DecisionProposal",
    targetEntityId: "proposal-1",
    currentLifecycleState: "Proposed",
    proposedLifecycleState: null,
    authorityState: "NonAuthoritative",
    originState: "HumanAuthored",
    privacyCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-proposal",
    evidenceRefs: Object.freeze(["evidence-1"]),
    validation: validValidation,
    requestedScope: Object.freeze(["fields:metadata"]),
    confirmationContext: null,
    jurisdictionContext: null,
    jurisdictionRequired: false,
    breakGlass: null,
    authoritySubstitute: null,
    inPlaceMutation: false,
    historicalOverwrite: false,
    historicalDeletion: false,
    reopeningWithoutEvent: false,
    privateReflectionAsDecisionRecord: false,
    automaticPrivateReflectionPromotion: false,
    crossCategoryConversionWithoutEvent: false,
    activeDisputePresent: false,
    challengedDecisionRef: null,
    predecessorDecisionRef: null,
    successorDecisionRef: null,
    supersessionEffectivePoint: null,
    closureMetadataPresent: false,
    dispositionGovernanceEvidencePresent: false,
    projectionSourceRegisterPresent: true,
    projectionProvenancePresent: true,
    projectionCreatesAuthority: false,
    projectionHidesDispute: false,
    projectionErasesLineage: false,
    projectionNonAuthoritative: true,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    dualControlRequired: false,
    ...overrides,
  });

type RuleCoverage = {
  readonly ruleKey: string;
  readonly ruleId: string;
  readonly expectedDecision: ExecutiveDecisionRegisterPolicyDecisionKind;
  readonly run: () => ExecutiveDecisionRegisterPolicyDecision;
};

const assertDecision = (
  decision: ExecutiveDecisionRegisterPolicyDecision,
  kind: ExecutiveDecisionRegisterPolicyDecisionKind,
  ruleId?: string,
): void => {
  assert.equal(decision.decision, kind);
  if (ruleId !== undefined) {
    assert.ok(
      decision.matchingRuleIds.includes(ruleId),
      `expected matchingRuleIds to include ${ruleId}, got ${decision.matchingRuleIds.join(",")}`,
    );
  }
  assert.equal(Object.isFrozen(decision), true);
  assert.equal(Object.isFrozen(decision.obligations), true);
  assert.equal(Object.isFrozen(decision.matchingRuleIds), true);
};

const RULE_COVERAGE: readonly RuleCoverage[] = Object.freeze([
  Object.freeze({
    ruleKey: "ValidationEvidenceRequired",
    ruleId: "RTC-3:5/Rule/01",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(request({ validation: null })),
  }),
  Object.freeze({
    ruleKey: "InvalidValidationDenies",
    ruleId: "RTC-3:5/Rule/02",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({ validation: invalidValidation }),
      ),
  }),
  Object.freeze({
    ruleKey: "MismatchedValidationRefDenies",
    ruleId: "RTC-3:5/Rule/03",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          validation: Object.freeze({
            outcome: "Valid" as const,
            valid: true,
            warningCount: 0,
            errorCount: 0,
            validationResultRef: "RTC-X/Wrong",
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "UnknownOperationDenies",
    ruleId: "RTC-3:5/Rule/04",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({ operation: "TeleportDecision" }),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthorityRequired",
    ruleId: "RTC-3:5/Rule/05",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          authorityRef: null,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthoritySubstituteRejected",
    ruleId: "RTC-3:5/Rule/06",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          authoritySubstitute: "Title",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "IncompleteDelegationDenies",
    ruleId: "RTC-3:5/Rule/07",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          delegation: Object.freeze({
            status: "Incomplete" as const,
            scope: "",
            evidenceRef: null,
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DelegationRevokedDenies",
    ruleId: "RTC-3:5/Rule/08",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          delegation: Object.freeze({
            status: "Revoked" as const,
            scope: "scope-a",
            evidenceRef: "ev-1",
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DelegationExpiredDenies",
    ruleId: "RTC-3:5/Rule/09",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          delegation: Object.freeze({
            status: "Expired" as const,
            scope: "scope-a",
            evidenceRef: "ev-1",
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DelegationOutOfScopeDenies",
    ruleId: "RTC-3:5/Rule/10",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          delegation: Object.freeze({
            status: "OutOfScope" as const,
            scope: "scope-a",
            evidenceRef: "ev-1",
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotConfirm",
    ruleId: "RTC-3:5/Rule/11",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          actorKind: "Ai",
          originState: "AiProposed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotCreateOrBroadenAuthority",
    ruleId: "RTC-3:5/Rule/12",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          actorKind: "Ai",
          originState: "AiProposed",
          targetEntityKind: "DecisionAuthority",
          proposedEffect: "create-authority",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotMakeAuthoritativeOrEffective",
    ruleId: "RTC-3:5/Rule/13",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "MakeDecisionEffective",
          actorKind: "Ai",
          currentLifecycleState: "Confirmed",
          originState: "AiProposed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotResolveOrSupersede",
    ruleId: "RTC-3:5/Rule/14",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ResolveDispute",
          actorKind: "Ai",
          activeDisputePresent: true,
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotCloseDiscloseOrExport",
    ruleId: "RTC-3:5/Rule/15",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "CloseDecision",
          actorKind: "Ai",
          closureMetadataPresent: true,
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiCannotRetainDisposeOrBreakGlass",
    ruleId: "RTC-3:5/Rule/16",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "DisposeDecision",
          actorKind: "Ai",
          dispositionPolicyRef: "disp-1",
          dispositionGovernanceEvidencePresent: true,
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiProposeNonAuthoritative",
    ruleId: "RTC-3:5/Rule/17",
    expectedDecision: "Allow" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          actorKind: "Ai",
          originState: "AiProposed",
          authorityState: "NonAuthoritative",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "PrivateReflectionDenied",
    ruleId: "RTC-3:5/Rule/18",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          privateReflectionAsDecisionRecord: true,
          privacyCategory: "PrivateReflection",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "RestrictedClassificationRequired",
    ruleId: "RTC-3:5/Rule/19",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          privacyCategory: "RestrictedExecutiveRecord",
          classification: null,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "PrivacyBypassDenied",
    ruleId: "RTC-3:5/Rule/20",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          automaticPrivateReflectionPromotion: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "LifecycleConfirmRequiresProposed",
    ruleId: "RTC-3:5/Rule/21",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          currentLifecycleState: "Effective",
          confirmationContext: Object.freeze({
            humanConfirmer: true,
            proposalRef: "P1",
            expectedProposalRef: "P1",
            proposedEffect: "e1",
            expectedEffect: "e1",
            authorityRef: "authority-1",
            expectedAuthorityRef: "authority-1",
            evidenceSet: Object.freeze(["evidence-1"]),
            expectedEvidenceSet: Object.freeze(["evidence-1"]),
            policyVersionRef: "RTC-3:5/1.0.0",
            singleUse: true,
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "LifecycleEffectiveRequiresConfirmed",
    ruleId: "RTC-3:5/Rule/22",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "MakeDecisionEffective",
          currentLifecycleState: "Proposed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisposedToActiveDenied",
    ruleId: "RTC-3:5/Rule/23",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          currentLifecycleState: "Disposed",
          proposedLifecycleState: "Active",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "InPlaceMutationDenied",
    ruleId: "RTC-3:5/Rule/24",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "CorrectDecision",
          inPlaceMutation: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisputeRequiresChallengedRef",
    ruleId: "RTC-3:5/Rule/25",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "OpenDispute",
          challengedDecisionRef: null,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ResolveRequiresActiveDispute",
    ruleId: "RTC-3:5/Rule/26",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ResolveDispute",
          activeDisputePresent: false,
          evidenceRefs: Object.freeze([]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "SupersessionLineageRequired",
    ruleId: "RTC-3:5/Rule/27",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "SupersedeDecision",
          predecessorDecisionRef: null,
          successorDecisionRef: "D2",
          supersessionEffectivePoint: "t1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "CircularSupersessionDenied",
    ruleId: "RTC-3:5/Rule/28",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "SupersedeDecision",
          predecessorDecisionRef: "D1",
          successorDecisionRef: "D1",
          supersessionEffectivePoint: "t1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "EvidenceRequired",
    ruleId: "RTC-3:5/Rule/29",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          evidenceRefs: Object.freeze([]),
          confirmationContext: Object.freeze({
            humanConfirmer: true,
            proposalRef: "P1",
            expectedProposalRef: "P1",
            proposedEffect: "e1",
            expectedEffect: "e1",
            authorityRef: "authority-1",
            expectedAuthorityRef: "authority-1",
            evidenceSet: Object.freeze([]),
            expectedEvidenceSet: Object.freeze([]),
            policyVersionRef: "RTC-3:5/1.0.0",
            singleUse: true,
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ProjectionConstraints",
    ruleId: "RTC-3:5/Rule/30",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ProjectDecisionRegister",
          projectionCreatesAuthority: true,
          projectionNonAuthoritative: false,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisclosureFailClosed",
    ruleId: "RTC-3:5/Rule/31",
    expectedDecision: "Deny" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ReadDecision",
          purpose: null,
          classification: null,
          requestedScope: Object.freeze([]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ExportRequiresConfirmation",
    ruleId: "RTC-3:5/Rule/32",
    expectedDecision: "RequireConfirmation" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ExportDecision",
          exportPolicyRef: "export-1",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "RetentionDispositionRequiresConfirmation",
    ruleId: "RTC-3:5/Rule/33",
    expectedDecision: "RequireConfirmation" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ApplyRetention",
          retentionPolicyRef: "ret-1",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ClosureRequiresConfirmation",
    ruleId: "RTC-3:5/Rule/34",
    expectedDecision: "RequireConfirmation" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "CloseDecision",
          closureMetadataPresent: true,
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "BreakGlassBounded",
    ruleId: "RTC-3:5/Rule/35",
    expectedDecision: "RequireConfirmation" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "BreakGlassAccess",
          breakGlass: Object.freeze({
            emergencyCategory: "safety",
            reason: "incident",
            narrowScope: "decision-1",
            expiryRequired: true,
            reviewRequired: true,
          }),
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "HumanConfirmationRequired",
    ruleId: "RTC-3:5/Rule/36",
    expectedDecision: "RequireConfirmation" as const,
    run: () =>
      evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          confirmationContext: Object.freeze({
            humanConfirmer: true,
            proposalRef: "P1",
            expectedProposalRef: "P1",
            proposedEffect: "e1",
            expectedEffect: "e1",
            authorityRef: "authority-1",
            expectedAuthorityRef: "authority-1",
            evidenceSet: Object.freeze(["evidence-1"]),
            expectedEvidenceSet: Object.freeze(["evidence-1"]),
            policyVersionRef: "RTC-3:5/1.0.0",
            singleUse: true,
          }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "CanonicalAllow",
    ruleId: "RTC-3:5/Rule/37",
    expectedDecision: "Allow" as const,
    run: () => evaluateExecutiveDecisionRegisterPolicy(request({})),
  }),
]);

describe("RTC-3:5 Executive Decision Register Policy", () => {
  describe("Rule traceability", () => {
    it("covers every canonical rule exactly once", () => {
      assert.equal(ExecutiveDecisionRegisterPolicyRules.length, 37);
      assert.equal(RULE_COVERAGE.length, 37);
      const coveredKeys = RULE_COVERAGE.map((item) => item.ruleKey).sort();
      const canonicalKeys = ExecutiveDecisionRegisterPolicyRules.map(
        (item) => item.ruleKey,
      ).sort();
      assert.deepEqual(coveredKeys, canonicalKeys);
      for (const rule of ExecutiveDecisionRegisterPolicyRules) {
        const coverage = RULE_COVERAGE.find(
          (item) => item.ruleKey === rule.ruleKey,
        );
        assert.ok(coverage, `missing coverage for ${rule.ruleKey}`);
        assert.equal(coverage.ruleId, rule.ruleId);
      }
    });

    for (const coverage of RULE_COVERAGE) {
      it(`direct coverage: ${coverage.ruleId} ${coverage.ruleKey}`, () => {
        const decision = coverage.run();
        assertDecision(
          decision,
          coverage.expectedDecision,
          coverage.ruleId,
        );
      });
    }
  });

  describe("Identity and upstream", () => {
    it("has exact RTC-3:5 identity, namespace, status, and readiness", () => {
      assert.equal(RTC35_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of RTC35_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterPolicyId,
        "RTC-3:5/ExecutiveDecisionRegisterPolicy",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicyNamespace,
        "nexora.rtc.executive.decision.register.policy",
      );
      assert.equal(ExecutiveDecisionRegisterPolicyStatus, "Policy");
      assert.equal(
        ExecutiveDecisionRegisterPolicyReadiness,
        "ReadyForEnforcement",
      );
      assert.equal(ExecutiveDecisionRegisterPolicyVersion, "1.0.0");
      assert.equal(
        ExecutiveDecisionRegisterPolicyName,
        "Executive Decision Register Policy",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.nextPhase,
        "RTC-3:6 — Executive Decision Register Enforcement",
      );
      assert.equal(ExecutiveDecisionRegisterPolicy.enforcementPhase, false);
      assert.ok("evaluateExecutiveDecisionRegisterPolicy" in PolicyModule);
      assert.equal(
        ExecutiveDecisionRegisterPolicy.nextPhase.startsWith("RTC-3:6"),
        true,
      );
    });

    it("preserves exact RTC-3:4 reference and upstream chain", () => {
      assert.equal(
        ExecutiveDecisionRegisterPolicy.validation,
        ExecutiveDecisionRegisterValidation,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.model,
        ExecutiveDecisionRegisterValidation.model,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.registry,
        ExecutiveDecisionRegisterValidation.registry,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.foundation,
        ExecutiveDecisionRegisterValidation.foundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.upstreamChain.validation,
        "RTC-3:4/ExecutiveDecisionRegisterValidation",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.upstreamChain.model,
        "RTC-3:3/ExecutiveDecisionRegisterModel",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.upstreamChain.registry,
        "RTC-3:2/ExecutiveDecisionRegisterRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.upstreamChain.foundation,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.aiMustNot,
        ExecutiveDecisionRegisterValidation.aiMustNot,
      );
      assert.equal(
        ExecutiveDecisionRegisterValidation.readiness,
        "ReadyForPolicy",
      );
    });

    it("bans direct model/registry/foundation runtime imports", () => {
      for (const file of RTC35_FILES.filter((name) => !name.endsWith(".test.ts"))) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.doesNotMatch(source, pattern);
        }
      }
    });
  });

  describe("Decision semantics", () => {
    it("allows valid propose and denies invalid or missing validation", () => {
      const allowed = evaluateExecutiveDecisionRegisterPolicy(request({}));
      assert.equal(allowed.decision, "Allow");
      assert.equal(isExecutiveDecisionRegisterPolicyAllowed(allowed), true);
      assert.equal(allowed.decisionCode, "POL-ALLOW");

      const invalid = evaluateExecutiveDecisionRegisterPolicy(
        request({ validation: invalidValidation }),
      );
      assert.equal(invalid.decision, "Deny");
      assert.equal(isExecutiveDecisionRegisterPolicyDenied(invalid), true);

      const missing = evaluateExecutiveDecisionRegisterPolicy(
        request({ validation: null }),
      );
      assert.equal(missing.decision, "Deny");
      assert.equal(missing.validationOutcome, "Missing");
    });

    it("applies deny over confirmation over allow", () => {
      const denied = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ExportDecision",
          exportPolicyRef: "export-1",
          actorKind: "Ai",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(denied.decision, "Deny");

      const confirm = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ExportDecision",
          exportPolicyRef: "export-1",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(confirm.decision, "RequireConfirmation");
      assert.equal(
        isExecutiveDecisionRegisterPolicyConfirmationRequired(confirm),
        true,
      );
    });

    it("is deterministic, non-mutating, and mutation-safe", () => {
      const input = request({});
      const first = evaluateExecutiveDecisionRegisterPolicy(input);
      const second = evaluateExecutiveDecisionRegisterPolicy(input);
      assert.deepEqual(first, second);
      assert.equal(input.requestId, "req-1");
      assert.throws(() => {
        (first.matchingRuleIds as unknown as string[]).push("x");
      });
      assert.throws(() => {
        (first.obligations as unknown as Array<{ kind: string }>).push({
          kind: "RequireReview",
        });
      });
      assert.equal(
        getExecutiveDecisionRegisterPolicyObligations(first),
        first.obligations,
      );
    });
  });

  describe("Proposal and confirmation", () => {
    it("allows non-authoritative human and AI proposals", () => {
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(request({})).decision,
        "Allow",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            actorKind: "Ai",
            originState: "AiProposed",
            authorityState: "NonAuthoritative",
          }),
        ).decision,
        "Allow",
      );
    });

    it("requires confirmation for ConfirmDecision and denies AI or mismatch", () => {
      const confirm = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          confirmationContext: Object.freeze({
            humanConfirmer: true,
            proposalRef: "P1",
            expectedProposalRef: "P1",
            proposedEffect: "e1",
            expectedEffect: "e1",
            authorityRef: "authority-1",
            expectedAuthorityRef: "authority-1",
            evidenceSet: Object.freeze(["evidence-1"]),
            expectedEvidenceSet: Object.freeze(["evidence-1"]),
            policyVersionRef: "RTC-3:5/1.0.0",
            singleUse: true,
          }),
        }),
      );
      assert.equal(confirm.decision, "RequireConfirmation");
      assert.ok(confirm.confirmation !== null);

      const ai = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          actorKind: "Ai",
        }),
      );
      assert.equal(ai.decision, "Deny");

      const mismatch = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ConfirmDecision",
          confirmationContext: Object.freeze({
            humanConfirmer: true,
            proposalRef: "P1",
            expectedProposalRef: "P2",
            proposedEffect: "e1",
            expectedEffect: "e1",
            authorityRef: "authority-1",
            expectedAuthorityRef: "authority-1",
            evidenceSet: Object.freeze(["evidence-1"]),
            expectedEvidenceSet: Object.freeze(["evidence-1"]),
            policyVersionRef: "RTC-3:5/1.0.0",
            singleUse: true,
          }),
        }),
      );
      assert.equal(mismatch.decision, "Deny");
    });
  });

  describe("AI prohibitions", () => {
    it("denies each authoritative AI power independently", () => {
      const cases: readonly {
        readonly operation: string;
        readonly ruleId: string;
        readonly extra?: Partial<ExecutiveDecisionRegisterPolicyRequest>;
      }[] = Object.freeze([
        {
          operation: "ConfirmDecision",
          ruleId: "RTC-3:5/Rule/11",
        },
        {
          operation: "ProposeDecision",
          ruleId: "RTC-3:5/Rule/12",
          extra: Object.freeze({
            proposedEffect: "broaden-authority",
            targetEntityKind: "DecisionAuthority",
          }),
        },
        {
          operation: "MakeDecisionEffective",
          ruleId: "RTC-3:5/Rule/13",
          extra: Object.freeze({ currentLifecycleState: "Confirmed" }),
        },
        {
          operation: "ResolveDispute",
          ruleId: "RTC-3:5/Rule/14",
          extra: Object.freeze({
            activeDisputePresent: true,
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "SupersedeDecision",
          ruleId: "RTC-3:5/Rule/14",
          extra: Object.freeze({
            predecessorDecisionRef: "D1",
            successorDecisionRef: "D2",
            supersessionEffectivePoint: "t1",
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "CloseDecision",
          ruleId: "RTC-3:5/Rule/15",
          extra: Object.freeze({
            closureMetadataPresent: true,
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "DiscloseDecision",
          ruleId: "RTC-3:5/Rule/15",
          extra: Object.freeze({ evidenceRefs: Object.freeze(["ev-1"]) }),
        },
        {
          operation: "ExportDecision",
          ruleId: "RTC-3:5/Rule/15",
          extra: Object.freeze({
            exportPolicyRef: "export-1",
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "ApplyRetention",
          ruleId: "RTC-3:5/Rule/16",
          extra: Object.freeze({
            retentionPolicyRef: "ret-1",
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "DisposeDecision",
          ruleId: "RTC-3:5/Rule/16",
          extra: Object.freeze({
            dispositionPolicyRef: "disp-1",
            dispositionGovernanceEvidencePresent: true,
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        },
        {
          operation: "BreakGlassAccess",
          ruleId: "RTC-3:5/Rule/16",
          extra: Object.freeze({
            breakGlass: Object.freeze({
              emergencyCategory: "safety",
              reason: "incident",
              narrowScope: "decision-1",
              expiryRequired: true,
              reviewRequired: true,
            }),
          }),
        },
      ]);

      for (const item of cases) {
        const decision = evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: item.operation,
            actorKind: "Ai",
            originState: "AiProposed",
            ...item.extra,
          }),
        );
        assertDecision(decision, "Deny", item.ruleId);
      }
    });
  });

  describe("Lifecycle, append-only, dispute, supersession", () => {
    it("denies unconfirmed effectiveness, in-place correction, and disposed reversal", () => {
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "MakeDecisionEffective",
            currentLifecycleState: "Proposed",
          }),
        ).decision,
        "Deny",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "CorrectDecision",
            inPlaceMutation: true,
          }),
        ).decision,
        "Deny",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            currentLifecycleState: "Disposed",
            proposedLifecycleState: "Active",
          }),
        ).decision,
        "Deny",
      );
    });

    it("requires append-only obligations for valid correction and denies incomplete lineage", () => {
      const correction = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "CorrectDecision",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(correction.decision, "RequireConfirmation");
      assert.ok(
        correction.obligations.some(
          (item) => item.kind === "RequireAppendOnlyEvent",
        ),
      );

      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "OpenDispute",
            challengedDecisionRef: null,
          }),
        ).decision,
        "Deny",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "ResolveDispute",
            activeDisputePresent: false,
          }),
        ).decision,
        "Deny",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "SupersedeDecision",
            predecessorDecisionRef: "D1",
            successorDecisionRef: "D1",
            supersessionEffectivePoint: "t1",
          }),
        ).decision,
        "Deny",
      );
    });
  });

  describe("Privacy, disclosure, export, projection, outcome", () => {
    it("denies private reflection and unknown disclosure without leaking metadata", () => {
      const denied = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "SearchDecisions",
          purpose: null,
          classification: null,
          requestedScope: Object.freeze([]),
        }),
      );
      assert.equal(denied.decision, "Deny");
      assert.equal(denied.reason, "Disclosure denied.");
      assert.equal(denied.revealsProtectedMetadata, false);

      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({ privateReflectionAsDecisionRecord: true }),
        ).decision,
        "Deny",
      );
    });

    it("allows valid projection and outcome reference; denies authority-creating projection", () => {
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "ProjectDecisionRegister",
            projectionSourceRegisterPresent: true,
            projectionProvenancePresent: true,
            projectionNonAuthoritative: true,
          }),
        ).decision,
        "Allow",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "ProjectDecisionRegister",
            projectionHidesDispute: true,
          }),
        ).decision,
        "Deny",
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "ReferenceOutcome",
            evidenceRefs: Object.freeze(["ev-1"]),
          }),
        ).decision,
        "Allow",
      );
    });

    it("requires export confirmation without selecting export format", () => {
      const exported = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "ExportDecision",
          exportPolicyRef: "export-1",
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(exported.decision, "RequireConfirmation");
      assert.ok(
        exported.obligations.some((item) => item.kind === "RequireExportEvidence"),
      );
      assert.equal(
        "exportFormat" in exported,
        false,
      );
    });

    it("does not decide closure sufficiency or retention periods", () => {
      const closure = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "CloseDecision",
          closureMetadataPresent: true,
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(closure.decision, "RequireConfirmation");
      assert.equal(ExecutiveDecisionRegisterPolicy.ownsClosureSufficiency, false);
      assert.equal(
        ExecutiveDecisionRegisterPolicy.ownsEvidencePinningDefaults,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.ownsRetentionScheduling,
        false,
      );
    });
  });

  describe("Break-glass", () => {
    it("denies incomplete break-glass and confirms bounded human requests", () => {
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "BreakGlassAccess",
            breakGlass: null,
          }),
        ).decision,
        "Deny",
      );
      const bounded = evaluateExecutiveDecisionRegisterPolicy(
        request({
          operation: "BreakGlassAccess",
          breakGlass: Object.freeze({
            emergencyCategory: "safety",
            reason: "incident",
            narrowScope: "decision-1",
            expiryRequired: true,
            reviewRequired: true,
          }),
          evidenceRefs: Object.freeze(["ev-1"]),
        }),
      );
      assert.equal(bounded.decision, "RequireConfirmation");
      assert.ok(
        bounded.obligations.some(
          (item) => item.kind === "RequireBreakGlassReview",
        ),
      );
      assert.equal(
        evaluateExecutiveDecisionRegisterPolicy(
          request({
            operation: "BreakGlassAccess",
            actorKind: "Ai",
            breakGlass: Object.freeze({
              emergencyCategory: "safety",
              reason: "incident",
              narrowScope: "decision-1",
              expiryRequired: true,
              reviewRequired: true,
            }),
          }),
        ).decision,
        "Deny",
      );
    });
  });

  describe("Decisions, open issues, and package exports", () => {
    it("preserves D-01 through D-30 and unresolved OI-01 through OI-06", () => {
      const local = ExecutiveDecisionRegisterPolicy.decisions.map(
        (item) => item.decisionId,
      );
      assert.deepEqual(local, ["D-25", "D-26", "D-27", "D-28", "D-29", "D-30"]);
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.upstreamValidationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-19", "D-20", "D-21", "D-22", "D-23", "D-24"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.upstreamModelDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-13", "D-14", "D-15", "D-16", "D-17", "D-18"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.upstreamRegistryDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-07", "D-08", "D-09", "D-10", "D-11", "D-12"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.upstreamFoundationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );

      assert.equal(ExecutiveDecisionRegisterPolicy.openIssues.length, 6);
      for (const issue of ExecutiveDecisionRegisterPolicy.openIssues) {
        assert.equal(issue.resolved, false);
        assert.equal(issue.resolvedByPolicy, false);
        assert.equal(issue.carriedByPhase, "RTC-3:5");
        assert.equal(issue.sourcePhase, "RTC-3:1");
      }
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.openIssues.map((item) => item.issueId),
        ["OI-01", "OI-02", "OI-03", "OI-04", "OI-05", "OI-06"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterPolicy.openIssues.map(
          (item) => item.accountableOwner,
        ),
        [
          "Records / legal",
          "Executive governance",
          "Journal steward",
          "Privacy + legal",
          "Executive governance",
          "Architecture authority",
        ],
      );
    });

    it("exposes summary and verifies rule catalogue completeness", () => {
      const summary = getExecutiveDecisionRegisterPolicySummary();
      assert.equal(summary.ruleCount, 37);
      assert.equal(summary.readiness, "ReadyForEnforcement");
      assert.equal(
        summary.nextPhase,
        "RTC-3:6 — Executive Decision Register Enforcement",
      );
      const catalogue = verifyExecutiveDecisionRegisterPolicyRuleCompleteness();
      assert.equal(catalogue.decision, "Allow");
    });
  });
});
