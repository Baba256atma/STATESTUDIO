/**
 * RTC-3:6 — Executive Decision Register Enforcement Tests.
 *
 * Deterministic coverage for fail-closed enforcement planning.
 * Direct rule-to-test traceability for every canonical rule.
 * No mocks. No randomness. No network. No databases. No execution.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import { evaluateExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import type {
  ExecutiveDecisionRegisterPolicyDecision,
  ExecutiveDecisionRegisterPolicyRequest,
} from "./executiveDecisionRegisterPolicyTypes.ts";
import * as EnforcementModule from "./executiveDecisionRegisterEnforcement.ts";
import {
  ExecutiveDecisionRegisterEnforcement,
  ExecutiveDecisionRegisterEnforcementId,
  ExecutiveDecisionRegisterEnforcementName,
  ExecutiveDecisionRegisterEnforcementNamespace,
  ExecutiveDecisionRegisterEnforcementReadiness,
  ExecutiveDecisionRegisterEnforcementStatus,
  ExecutiveDecisionRegisterEnforcementVersion,
  ExecutiveDecisionRegisterObligationStepMapping,
  getExecutiveDecisionRegisterEnforcementSummary,
  isExecutiveDecisionRegisterEnforcementAwaitingConfirmation,
  isExecutiveDecisionRegisterEnforcementBlocked,
  isExecutiveDecisionRegisterEnforcementEnforceable,
  planExecutiveDecisionRegisterEnforcement,
  verifyExecutiveDecisionRegisterObligationStepMapping,
} from "./executiveDecisionRegisterEnforcement.ts";
import { ExecutiveDecisionRegisterEnforcementRules } from "./executiveDecisionRegisterEnforcementRules.ts";
import { ExecutiveDecisionRegisterEnforcementStepKinds } from "./executiveDecisionRegisterEnforcementLifecycle.ts";
import type {
  ExecutiveDecisionRegisterEnforcementConfirmationEvidence,
  ExecutiveDecisionRegisterEnforcementRequest,
  ExecutiveDecisionRegisterEnforcementResult,
  ExecutiveDecisionRegisterEnforcementResultKind,
  ExecutiveDecisionRegisterEnforcementStepKind,
} from "./executiveDecisionRegisterEnforcementTypes.ts";
import type { ExecutiveDecisionRegisterPolicyObligationKind } from "./executiveDecisionRegisterPolicyTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC36_FILES = Object.freeze([
  "executiveDecisionRegisterEnforcement.ts",
  "executiveDecisionRegisterEnforcementTypes.ts",
  "executiveDecisionRegisterEnforcementIdentity.ts",
  "executiveDecisionRegisterEnforcementLifecycle.ts",
  "executiveDecisionRegisterEnforcementContracts.ts",
  "executiveDecisionRegisterEnforcementRules.ts",
  "executiveDecisionRegisterEnforcementMetadata.ts",
  "executiveDecisionRegisterEnforcement.test.ts",
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
  /from ["']\.\/executiveDecisionRegisterValidation\.ts["']/,
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

const policyRequest = (
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

const confirmationFor = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
  overrides: Partial<ExecutiveDecisionRegisterEnforcementConfirmationEvidence> =
    {},
): ExecutiveDecisionRegisterEnforcementConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: request.actorId,
    actorKind: "Human" as const,
    requestId: request.requestId,
    policyDecisionCode: request.policyDecision.decisionCode,
    policyDecisionId: request.policyDecision.policyId,
    policyVersion: request.policyDecision.policyVersion,
    targetId: request.targetEntityId,
    operation: request.operation,
    proposedEffect: request.proposedEffect,
    authorityRef: request.authorityRef ?? "",
    evidenceSet: Object.freeze([...request.evidenceRefs]),
    obligationKinds: Object.freeze(
      request.policyDecision.obligations.map((item) => item.kind),
    ),
    singleUse: true as const,
    expired: false,
    expiryMetadata: "expiry:upstream-authority",
    ...overrides,
  });

const assertNoEffectBearing = (
  result: ExecutiveDecisionRegisterEnforcementResult,
): void => {
  assert.equal(result.steps.length, 0);
  assert.equal(result.plan, null);
  assert.equal(result.executes, false);
  if (result.kind === "AwaitingConfirmation") {
    assert.equal(
      result.preparationSteps.every((step) => step.effectBearing === false),
      true,
    );
    assert.equal(
      result.preparationSteps.every((step) => step.executes === false),
      true,
    );
  }
  const serialized = JSON.stringify(result);
  assert.equal(/persist|network|commit|dispatch|publish|mutate/i.test(serialized), false);
};

const enforcementRequest = (
  decision: ExecutiveDecisionRegisterPolicyDecision,
  overrides: Partial<ExecutiveDecisionRegisterEnforcementRequest> = {},
): ExecutiveDecisionRegisterEnforcementRequest =>
  Object.freeze({
    requestId: decision.requestId,
    policyDecision: decision,
    operation: "ProposeDecision",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: decision.authorityRef ?? "authority-1",
    authorityStatus: "Active",
    authoritySubstitute: null,
    purpose: decision.purpose,
    targetRegister: "RTC-EDR-00000001",
    targetEntityKind: "DecisionProposal",
    targetEntityId: decision.targetId,
    currentLifecycleState: "Proposed",
    proposedLifecycleState: null,
    privacyCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-proposal",
    validationOutcome: "Valid",
    validationReference: VALIDATION_REF,
    evidenceRefs: Object.freeze([...decision.evidenceRefs]),
    predecessorRef: null,
    successorRef: null,
    challengedDecisionRef: null,
    activeDisputePresent: false,
    closureMetadataPresent: false,
    dispositionGovernanceEvidencePresent: false,
    inPlaceMutation: false,
    privateReflectionAsDecisionRecord: false,
    projectionCreatesAuthority: false,
    projectionHidesDispute: false,
    projectionErasesLineage: false,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    confirmationEvidence: null,
    breakGlass: null,
    requiresUnresolvedOpenIssueDefault: false,
    ...overrides,
  });

const withConfirmation = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
  overrides: Partial<ExecutiveDecisionRegisterEnforcementConfirmationEvidence> =
    {},
): ExecutiveDecisionRegisterEnforcementRequest =>
  Object.freeze({
    ...request,
    confirmationEvidence: confirmationFor(request, overrides),
  });

type RuleCoverage = {
  readonly ruleKey: string;
  readonly ruleId: string;
  readonly expectedKind: ExecutiveDecisionRegisterEnforcementResultKind;
  readonly run: () => ExecutiveDecisionRegisterEnforcementResult;
};

const assertResult = (
  result: ExecutiveDecisionRegisterEnforcementResult,
  kind: ExecutiveDecisionRegisterEnforcementResultKind,
): void => {
  assert.equal(result.kind, kind);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.executes, false);
  assert.equal(result.revealsProtectedMetadata, false);
  if (kind === "Blocked" || kind === "AwaitingConfirmation") {
    assert.equal(result.steps.length, 0);
    assert.equal(result.plan, null);
  }
};

const allowDecision = (): ExecutiveDecisionRegisterPolicyDecision =>
  evaluateExecutiveDecisionRegisterPolicy(policyRequest({}));

const denyDecision = (): ExecutiveDecisionRegisterPolicyDecision =>
  evaluateExecutiveDecisionRegisterPolicy(
    policyRequest({ operation: "TeleportDecision" }),
  );

const confirmDecision = (): ExecutiveDecisionRegisterPolicyDecision =>
  evaluateExecutiveDecisionRegisterPolicy(
    policyRequest({
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

const RULE_COVERAGE: readonly RuleCoverage[] = Object.freeze([
  Object.freeze({
    ruleKey: "DenyBlocks",
    ruleId: "RTC-3:6/Rule/01",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(denyDecision()),
      ),
  }),
  Object.freeze({
    ruleKey: "UnknownDecisionBlocks",
    ruleId: "RTC-3:6/Rule/02",
    expectedKind: "Blocked" as const,
    run: () => {
      const base = allowDecision();
      const unknown = Object.freeze({
        ...base,
        decision: "Maybe" as unknown as typeof base.decision,
      });
      return planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(unknown),
      );
    },
  }),
  Object.freeze({
    ruleKey: "InvalidValidationBlocks",
    ruleId: "RTC-3:6/Rule/03",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision(), {
          validationOutcome: "Invalid",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthorityGate",
    ruleId: "RTC-3:6/Rule/04",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision(), {
          authorityStatus: "Revoked",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiBoundaryBlocks",
    ruleId: "RTC-3:6/Rule/05",
    expectedKind: "Blocked" as const,
    run: () => {
      const decision = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "ExportDecision",
          exportPolicyRef: "export-1",
          evidenceRefs: Object.freeze(["evidence-1"]),
        }),
      );
      return planExecutiveDecisionRegisterEnforcement(
        withConfirmation(
          enforcementRequest(decision, {
            operation: "ExportDecision",
            actorKind: "Ai",
            exportPolicyRef: "export-1",
          }),
        ),
      );
    },
  }),
  Object.freeze({
    ruleKey: "PrivacyBoundaryBlocks",
    ruleId: "RTC-3:6/Rule/06",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision(), {
          privateReflectionAsDecisionRecord: true,
          privacyCategory: "PrivateReflection",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "LifecycleGate",
    ruleId: "RTC-3:6/Rule/07",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        withConfirmation(
          enforcementRequest(confirmDecision(), {
            operation: "ConfirmDecision",
            currentLifecycleState: "Effective",
            proposedEffect: "e1",
          }),
        ),
      ),
  }),
  Object.freeze({
    ruleKey: "UnsupportedObligationBlocks",
    ruleId: "RTC-3:6/Rule/08",
    expectedKind: "Blocked" as const,
    run: () => {
      const base = allowDecision();
      const withUnknown = Object.freeze({
        ...base,
        obligations: Object.freeze([
          ...base.obligations,
          Object.freeze({
            obligationId: "RTC-3:5/Obligation/UnknownObligation",
            kind: "UnknownObligation" as never,
            description: "unsupported",
            order: 99,
            metadataOnly: true as const,
            immutable: true as const,
          }),
        ]),
      });
      return planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(withUnknown),
      );
    },
  }),
  Object.freeze({
    ruleKey: "OpenIssueDefaultBlocks",
    ruleId: "RTC-3:6/Rule/09",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision(), {
          requiresUnresolvedOpenIssueDefault: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ConfirmationBinding",
    ruleId: "RTC-3:6/Rule/10",
    expectedKind: "Blocked" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        withConfirmation(
          enforcementRequest(confirmDecision(), {
            operation: "ConfirmDecision",
            proposedEffect: "e1",
          }),
          { proposedEffect: "wrong-effect" },
        ),
      ),
  }),
  Object.freeze({
    ruleKey: "AwaitConfirmation",
    ruleId: "RTC-3:6/Rule/11",
    expectedKind: "AwaitingConfirmation" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(confirmDecision(), {
          operation: "ConfirmDecision",
          proposedEffect: "e1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AllowEnforceable",
    ruleId: "RTC-3:6/Rule/12",
    expectedKind: "Enforceable" as const,
    run: () =>
      planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision()),
      ),
  }),
]);

type ObligationCoverage = {
  readonly obligation: ExecutiveDecisionRegisterPolicyObligationKind;
  readonly expectedSteps: readonly ExecutiveDecisionRegisterEnforcementStepKind[];
};

const OBLIGATION_COVERAGE: readonly ObligationCoverage[] = Object.freeze([
  Object.freeze({
    obligation: "RequireHumanConfirmation" as const,
    expectedSteps: Object.freeze(["VerifyConfirmation"] as const),
  }),
  Object.freeze({
    obligation: "RequireAuthorityEvidence" as const,
    expectedSteps: Object.freeze(["VerifyAuthority", "VerifyEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequirePurposeBinding" as const,
    expectedSteps: Object.freeze(["VerifyPurpose"] as const),
  }),
  Object.freeze({
    obligation: "RequireEvidenceReference" as const,
    expectedSteps: Object.freeze(["VerifyEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequireAppendOnlyEvent" as const,
    expectedSteps: Object.freeze(["PrepareProposalEvent"] as const),
  }),
  Object.freeze({
    obligation: "RequireProvenance" as const,
    expectedSteps: Object.freeze(["VerifyEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequireFieldFiltering" as const,
    expectedSteps: Object.freeze(["ApplyFieldFilter"] as const),
  }),
  Object.freeze({
    obligation: "RequireRedaction" as const,
    expectedSteps: Object.freeze(["ApplyRedaction"] as const),
  }),
  Object.freeze({
    obligation: "RequireDisclosureEvidence" as const,
    expectedSteps: Object.freeze(["PrepareDisclosureEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequireExportEvidence" as const,
    expectedSteps: Object.freeze(["PrepareExportEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequireRetentionEvidence" as const,
    expectedSteps: Object.freeze(["PrepareRetentionEvidence"] as const),
  }),
  Object.freeze({
    obligation: "RequireDispositionEvidence" as const,
    expectedSteps: Object.freeze(["PrepareDispositionEvent"] as const),
  }),
  Object.freeze({
    obligation: "RequireReview" as const,
    expectedSteps: Object.freeze(["PrepareBreakGlassReview"] as const),
  }),
  Object.freeze({
    obligation: "RequireExpiry" as const,
    expectedSteps: Object.freeze(["VerifyConfirmation"] as const),
  }),
  Object.freeze({
    obligation: "RequireBreakGlassReview" as const,
    expectedSteps: Object.freeze(["PrepareBreakGlassReview"] as const),
  }),
]);

describe("RTC-3:6 Executive Decision Register Enforcement", () => {
  describe("Rule traceability", () => {
    it("covers every canonical rule exactly once", () => {
      assert.equal(ExecutiveDecisionRegisterEnforcementRules.length, 12);
      assert.equal(RULE_COVERAGE.length, 12);
      const coveredKeys = RULE_COVERAGE.map((item) => item.ruleKey).sort();
      const canonicalKeys = ExecutiveDecisionRegisterEnforcementRules.map(
        (item) => item.ruleKey,
      ).sort();
      assert.deepEqual(coveredKeys, canonicalKeys);
    });

    for (const coverage of RULE_COVERAGE) {
      it(`direct coverage: ${coverage.ruleId} ${coverage.ruleKey}`, () => {
        const result = coverage.run();
        assertResult(result, coverage.expectedKind);
        if (
          coverage.expectedKind === "Blocked"
          || coverage.expectedKind === "AwaitingConfirmation"
        ) {
          assertNoEffectBearing(result);
        }
      });
    }
  });

  describe("Obligation traceability", () => {
    it("covers every canonical obligation exactly once with complete mapping", () => {
      assert.equal(ExecutiveDecisionRegisterPolicy.obligationKinds.length, 15);
      assert.equal(OBLIGATION_COVERAGE.length, 15);
      assert.equal(verifyExecutiveDecisionRegisterObligationStepMapping(), true);
      const covered = OBLIGATION_COVERAGE.map((item) => item.obligation).sort();
      const canonical = [...ExecutiveDecisionRegisterPolicy.obligationKinds].sort();
      assert.deepEqual(covered, canonical);
      const mappingKeys = Object.keys(
        ExecutiveDecisionRegisterObligationStepMapping,
      ).sort();
      assert.deepEqual(mappingKeys, canonical);
    });

    for (const coverage of OBLIGATION_COVERAGE) {
      it(`direct obligation mapping: ${coverage.obligation}`, () => {
        const mapped =
          ExecutiveDecisionRegisterObligationStepMapping[coverage.obligation];
        assert.ok(mapped !== undefined);
        assert.deepEqual([...mapped], [...coverage.expectedSteps]);
        for (const step of mapped) {
          assert.ok(
            (ExecutiveDecisionRegisterEnforcementStepKinds as readonly string[])
              .includes(step),
          );
        }
        assert.equal(Object.isFrozen(mapped), true);
        const first = [...mapped];
        const second = [
          ...ExecutiveDecisionRegisterObligationStepMapping[coverage.obligation],
        ];
        assert.deepEqual(first, second);
      });
    }
  });

  describe("Identity and upstream", () => {
    it("has exact RTC-3:6 identity, namespace, status, and readiness", () => {
      assert.equal(RTC36_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of RTC36_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterEnforcementId,
        "RTC-3:6/ExecutiveDecisionRegisterEnforcement",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcementNamespace,
        "nexora.rtc.executive.decision.register.enforcement",
      );
      assert.equal(ExecutiveDecisionRegisterEnforcementStatus, "Enforcement");
      assert.equal(
        ExecutiveDecisionRegisterEnforcementReadiness,
        "ReadyForExecutionContract",
      );
      assert.equal(ExecutiveDecisionRegisterEnforcementVersion, "1.0.0");
      assert.equal(
        ExecutiveDecisionRegisterEnforcementName,
        "Executive Decision Register Enforcement",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.nextPhase,
        "RTC-3:7 — Executive Decision Register Execution Contract",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.executionContractPhase,
        false,
      );
      assert.ok("planExecutiveDecisionRegisterEnforcement" in EnforcementModule);
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.nextPhase.startsWith("RTC-3:7"),
        true,
      );
    });

    it("preserves exact RTC-3:5 reference and upstream chain", () => {
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.policy,
        ExecutiveDecisionRegisterPolicy,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.validation,
        ExecutiveDecisionRegisterPolicy.validation,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.model,
        ExecutiveDecisionRegisterPolicy.model,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.registry,
        ExecutiveDecisionRegisterPolicy.registry,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.foundation,
        ExecutiveDecisionRegisterPolicy.foundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.upstreamChain.policy,
        "RTC-3:5/ExecutiveDecisionRegisterPolicy",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.upstreamChain.validation,
        "RTC-3:4/ExecutiveDecisionRegisterValidation",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.upstreamChain.model,
        "RTC-3:3/ExecutiveDecisionRegisterModel",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.upstreamChain.registry,
        "RTC-3:2/ExecutiveDecisionRegisterRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.upstreamChain.foundation,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.aiMustNot,
        ExecutiveDecisionRegisterPolicy.aiMustNot,
      );
      assert.equal(
        ExecutiveDecisionRegisterPolicy.readiness,
        "ReadyForEnforcement",
      );
    });

    it("bans direct validation/model/registry/foundation runtime imports", () => {
      for (const file of RTC36_FILES.filter((name) => !name.endsWith(".test.ts"))) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.doesNotMatch(source, pattern);
        }
      }
    });
  });

  describe("Decision translation and precedence", () => {
    it("enforces Blocked > AwaitingConfirmation > Enforceable", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterEnforcement.lifecycle.precedence],
        ["Blocked", "AwaitingConfirmation", "Enforceable"],
      );
      const blocked = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(denyDecision()),
      );
      assertResult(blocked, "Blocked");
      assertNoEffectBearing(blocked);
      assert.equal(isExecutiveDecisionRegisterEnforcementBlocked(blocked), true);
      assert.equal(blocked.reasonCode, "ENF-DENY");

      const awaiting = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(confirmDecision(), {
          operation: "ConfirmDecision",
          proposedEffect: "e1",
        }),
      );
      assertResult(awaiting, "AwaitingConfirmation");
      assertNoEffectBearing(awaiting);
      assert.equal(
        isExecutiveDecisionRegisterEnforcementAwaitingConfirmation(awaiting),
        true,
      );

      const enforceable = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision()),
      );
      assertResult(enforceable, "Enforceable");
      assert.equal(
        isExecutiveDecisionRegisterEnforcementEnforceable(enforceable),
        true,
      );
      if (enforceable.kind === "Enforceable") {
        assert.ok(enforceable.plan !== null);
        assert.equal(enforceable.plan.executes, false);
        assert.ok(
          enforceable.steps.some((step) => step.kind === "SealEnforcementPlan"),
        );
        assert.ok(
          enforceable.steps.some((step) => step.kind === "PrepareProposalEvent"),
        );
      }
    });

    it("Deny cannot be overridden by confirmation or obligations", () => {
      const denied = denyDecision();
      const withConf = withConfirmation(
        enforcementRequest(denied, {
          operation: "ConfirmDecision",
        }),
      );
      const result = planExecutiveDecisionRegisterEnforcement(withConf);
      assertResult(result, "Blocked");
      assertNoEffectBearing(result);
      assert.equal(result.reasonCode, "ENF-DENY");
    });

    it("Allow with outstanding confirmation cannot become Enforceable", () => {
      const base = allowDecision();
      const withOutstanding = Object.freeze({
        ...base,
        confirmation: Object.freeze({
          proposedEffect: "record-proposal",
          confirmingActor: "actor-1",
          requiredAuthority: "authority-1",
          evidenceToDisplay: Object.freeze(["evidence-1"]),
          policyVersionRequired: true as const,
          singleUseRequired: true as const,
          expiryRequired: true as const,
          dualControlRequired: false,
          metadataOnly: true as const,
          immutable: true as const,
        }),
      });
      const result = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(withOutstanding),
      );
      assertResult(result, "Blocked");
      assert.equal(result.reasonCode, "ENF-CONFIRMATION-OUTSTANDING");
    });

    it("unknown or malformed policy decisions fail closed", () => {
      const base = allowDecision();
      const malformed = Object.freeze({
        ...base,
        policyId: "RTC-X/UnknownPolicy" as typeof base.policyId,
      });
      const result = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(malformed),
      );
      assertResult(result, "Blocked");
      assert.equal(result.reasonCode, "ENF-UNKNOWN-POLICY");
    });

    it("is deterministic, non-mutating, and mutation-safe", () => {
      const input = enforcementRequest(allowDecision());
      const first = planExecutiveDecisionRegisterEnforcement(input);
      const second = planExecutiveDecisionRegisterEnforcement(input);
      assert.deepEqual(first, second);
      assert.equal(input.requestId, "req-1");
      assert.throws(() => {
        (first as unknown as { kind: string }).kind = "Blocked";
      });
    });
  });

  describe("Confirmation binding", () => {
    it("exact confirmation upgrades RequireConfirmation to Enforceable", () => {
      const request = withConfirmation(
        enforcementRequest(confirmDecision(), {
          operation: "ConfirmDecision",
          proposedEffect: "e1",
        }),
      );
      const result = planExecutiveDecisionRegisterEnforcement(request);
      assertResult(result, "Enforceable");
      if (result.kind === "Enforceable") {
        assert.ok(
          result.steps.some((step) => step.kind === "PrepareConfirmationEvent"),
        );
      }
    });

    it("blocks missing, expired, mismatched, and unrelated confirmation fields", () => {
      const base = enforcementRequest(confirmDecision(), {
        operation: "ConfirmDecision",
        proposedEffect: "e1",
      });
      const mismatches: readonly Partial<
        ExecutiveDecisionRegisterEnforcementConfirmationEvidence
      >[] = Object.freeze([
        { requestId: "other-request" },
        { policyDecisionId: "RTC-X/Wrong" },
        { operation: "CloseDecision" },
        { targetId: "other-target" },
        { actorId: "other-actor" },
        { authorityRef: "other-authority" },
        { obligationKinds: Object.freeze(["RequireExportEvidence"] as const) },
        { evidenceSet: Object.freeze(["other-evidence"]) },
        { expired: true },
        { proposedEffect: "unrelated-effect" },
      ]);
      for (const mismatch of mismatches) {
        const result = planExecutiveDecisionRegisterEnforcement(
          withConfirmation(base, mismatch),
        );
        assertResult(result, "Blocked");
        assert.equal(result.reasonCode, "ENF-CONFIRMATION-MISMATCH");
      }
    });

    it("confirmation cannot override Deny or create authority", () => {
      const denied = withConfirmation(
        enforcementRequest(denyDecision(), {
          operation: "ConfirmDecision",
          authoritySubstitute: null,
        }),
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(denied).reasonCode,
        "ENF-DENY",
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          withConfirmation(
            enforcementRequest(confirmDecision(), {
              operation: "ConfirmDecision",
              proposedEffect: "e1",
              authoritySubstitute: "Title",
            }),
          ),
        ).kind,
        "Blocked",
      );
    });

    it("blocks authority substitutes, mismatches, and incomplete delegation", () => {
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(allowDecision(), {
            authoritySubstitute: "Title",
          }),
        ).kind,
        "Blocked",
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(allowDecision(), {
            authorityStatus: "Expired",
          }),
        ).kind,
        "Blocked",
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(allowDecision(), {
            authorityRef: "different-authority",
          }),
        ).kind,
        "Blocked",
      );
    });
  });

  describe("Enforceable-plan safety", () => {
    it("orders verification before preparation and keeps Prepare steps as descriptors", () => {
      const result = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(allowDecision()),
      );
      assertResult(result, "Enforceable");
      if (result.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const verifyOrders = result.steps
        .filter((step) => step.kind.startsWith("Verify"))
        .map((step) => step.order);
      const prepareOrders = result.steps
        .filter((step) => step.kind.startsWith("Prepare"))
        .map((step) => step.order);
      assert.ok(verifyOrders.length > 0);
      assert.ok(prepareOrders.length > 0);
      assert.ok(Math.max(...verifyOrders) < Math.min(...prepareOrders));
      for (const step of result.steps) {
        assert.equal(step.executes, false);
        assert.equal(step.metadataOnly, true);
        assert.equal(Object.isFrozen(step), true);
      }
      assert.equal(result.plan.executes, false);
      assert.equal(result.plan.failureBehavior, "FailClosed");
      assert.equal(result.plan.requestId, "req-1");
      assert.equal(result.plan.policyDecisionId, allowDecision().policyId);
      const serialized = JSON.stringify(result.plan);
      assert.equal(/receipt|committed|published|dispatched/i.test(serialized), false);
      const ordered = result.steps.map((step) => step.order);
      assert.deepEqual(ordered, [...ordered].sort((a, b) => a - b));
    });
  });

  describe("AI, privacy, lifecycle, projection", () => {
    it("blocks AI for authoritative operations and allows non-authoritative AI propose", () => {
      const aiPropose = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          actorKind: "Ai",
          originState: "AiProposed",
          authorityState: "NonAuthoritative",
        }),
      );
      assert.equal(aiPropose.decision, "Allow");
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(aiPropose, { actorKind: "Ai" }),
        ).kind,
        "Enforceable",
      );

      const close = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "CloseDecision",
          closureMetadataPresent: true,
          evidenceRefs: Object.freeze(["evidence-1"]),
        }),
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          withConfirmation(
            enforcementRequest(close, {
              operation: "CloseDecision",
              actorKind: "Ai",
              closureMetadataPresent: true,
              proposedEffect: "record-proposal",
            }),
          ),
        ).kind,
        "Blocked",
      );
    });

    it("blocks private reflection, disposed-to-active, and bad projections", () => {
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(allowDecision(), {
            privacyCategory: "PrivateReflection",
          }),
        ).kind,
        "Blocked",
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(allowDecision(), {
            currentLifecycleState: "Disposed",
            proposedLifecycleState: "Active",
          }),
        ).kind,
        "Blocked",
      );
      const project = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "ProjectDecisionRegister",
        }),
      );
      assert.equal(
        planExecutiveDecisionRegisterEnforcement(
          enforcementRequest(project, {
            operation: "ProjectDecisionRegister",
            projectionHidesDispute: true,
          }),
        ).kind,
        "Blocked",
      );
    });
  });

  describe("Obligations, decisions, and package exports", () => {
    it("maps every RTC-3:5 obligation and preserves D-01 through D-36", () => {
      assert.equal(verifyExecutiveDecisionRegisterObligationStepMapping(), true);
      for (const kind of ExecutiveDecisionRegisterPolicy.obligationKinds) {
        assert.ok(
          ExecutiveDecisionRegisterObligationStepMapping[kind] !== undefined,
          `missing mapping for ${kind}`,
        );
      }
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.decisions.map(
          (item) => item.decisionId,
        ),
        ["D-31", "D-32", "D-33", "D-34", "D-35", "D-36"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.upstreamPolicyDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-25", "D-26", "D-27", "D-28", "D-29", "D-30"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.upstreamValidationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-19", "D-20", "D-21", "D-22", "D-23", "D-24"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.upstreamModelDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-13", "D-14", "D-15", "D-16", "D-17", "D-18"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.upstreamRegistryDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-07", "D-08", "D-09", "D-10", "D-11", "D-12"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.upstreamFoundationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEnforcement.openIssues.map(
          (item) => item.issueId,
        ),
        ["OI-01", "OI-02", "OI-03", "OI-04", "OI-05", "OI-06"],
      );
      for (const issue of ExecutiveDecisionRegisterEnforcement.openIssues) {
        assert.equal(issue.resolved, false);
        assert.equal(issue.resolvedByEnforcement, false);
        assert.equal(issue.carriedByPhase, "RTC-3:6");
      }
      assert.deepEqual(
        [...ExecutiveDecisionRegisterEnforcement.aiMustNot],
        [...ExecutiveDecisionRegisterPolicy.aiMustNot],
      );
    });

    it("exposes AD-RTC3-06 and never executes plans", () => {
      const summary = getExecutiveDecisionRegisterEnforcementSummary();
      assert.equal(summary.ruleCount, 12);
      assert.equal(summary.obligationMappingCount, 15);
      assert.equal(summary.readiness, "ReadyForExecutionContract");
      assert.equal(
        summary.nextPhase,
        "RTC-3:7 — Executive Decision Register Execution Contract",
      );
      assert.deepEqual([...summary.architectureDecisionIds], ["AD-RTC3-06"]);
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.architectureDecision.decisionId,
        "AD-RTC3-06",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.architectureDecision.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.readiness,
        "ReadyForExecutionContract",
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.metadata.architectureDecision
          .decisionId,
        "AD-RTC3-06",
      );
      assert.equal(ExecutiveDecisionRegisterEnforcement.executesPlans, false);
      assert.equal(ExecutiveDecisionRegisterEnforcement.plansOnly, true);
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.ownsClosureSufficiency,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.executionContractPhase,
        false,
      );
    });
  });
});
