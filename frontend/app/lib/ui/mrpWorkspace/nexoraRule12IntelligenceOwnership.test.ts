import test from "node:test";
import assert from "node:assert/strict";

import {
  ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS,
  ASSISTANT_CONVERSATION_QUESTIONS,
  MRP_INTELLIGENCE_AUTHORITY_QUESTIONS,
  NEXORA_RULE_12_ACTIVE_TAG,
  NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
  NEXORA_RULE_12_VERSION,
  RULE_12_BLOCKED_ASSISTANT_VIOLATIONS,
} from "./governance/nexoraRule12IntelligenceOwnershipContract.ts";
import {
  guardAssistantIntelligenceAction,
  guardNexoraRule12IntelligenceOwnership,
  resetNexoraRule12IntelligenceOwnershipRuntimeForTests,
  traceNexoraRule12ActiveOnce,
  verifyNexoraRule12CertificationCompliance,
} from "./governance/nexoraRule12IntelligenceOwnershipRuntime.ts";

test.beforeEach(() => {
  resetNexoraRule12IntelligenceOwnershipRuntimeForTests();
});

test("exports Rule #12 intelligence ownership and active tags", () => {
  assert.equal(
    NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
    "[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]"
  );
  assert.equal(NEXORA_RULE_12_ACTIVE_TAG, "[NEXORA_RULE_12_ACTIVE]");
  assert.equal(NEXORA_RULE_12_VERSION, "1.0");
});

test("MRP intelligence authority questions map to certified workspaces", () => {
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.executive_summary, "What is happening?");
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.operational, "How is it operating?");
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.risk, "What can go wrong?");
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.timeline, "What happened before?");
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.scenario, "What could happen next?");
  assert.equal(MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.war_room, "What should we do now?");
});

test("Assistant conversation questions remain separate from MRP intelligence", () => {
  assert.equal(ASSISTANT_CONVERSATION_QUESTIONS.explain, "Explain this.");
  assert.equal(ASSISTANT_CONVERSATION_QUESTIONS.review, "What should I review?");
  assert.notEqual(
    ASSISTANT_CONVERSATION_QUESTIONS.explain,
    MRP_INTELLIGENCE_AUTHORITY_QUESTIONS.executive_summary
  );
});

test("allows grounded Assistant intelligence actions", () => {
  for (const action of ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS) {
    const result = guardAssistantIntelligenceAction({
      action,
      workspaceId: "risk",
      hasWorkspaceGrounding: true,
      sourceLabel: "test",
    });
    assert.equal(result.allowed, true, action);
    assert.equal(result.tag, NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG);
  }
});

test("blocks Assistant generating unsupported risk scores", () => {
  const blocked = guardNexoraRule12IntelligenceOwnership({
    source: "assistant",
    violationKind: "generate_unsupported_risk_scores",
    workspaceId: "risk",
  });
  assert.equal(blocked.allowed, false);
  if (!blocked.allowed) {
    assert.equal(blocked.violationKind, "generate_unsupported_risk_scores");
    assert.match(blocked.reason, /risk scores/i);
  }
});

test("blocks Assistant generating unsupported scenario forecasts", () => {
  const blocked = guardNexoraRule12IntelligenceOwnership({
    source: "assistant",
    violationKind: "generate_unsupported_scenario_forecasts",
    workspaceId: "scenario",
  });
  assert.equal(blocked.allowed, false);
});

test("blocks Assistant overriding workspace conclusions", () => {
  const blocked = guardNexoraRule12IntelligenceOwnership({
    source: "assistant",
    violationKind: "override_workspace_conclusions",
  });
  assert.equal(blocked.allowed, false);
});

test("blocks Assistant acting as decision authority", () => {
  for (const violationKind of [
    "act_as_decision_authority",
    "execute_workspace_decisions",
    "replace_workspace_intelligence",
    "invent_workspace_intelligence",
    "override_workspace_intelligence",
    "bypass_workspace_intelligence",
  ] as const) {
    const blocked = guardNexoraRule12IntelligenceOwnership({
      source: "assistant",
      violationKind,
    });
    assert.equal(blocked.allowed, false, violationKind);
  }
});

test("blocks ungrounded Assistant explanations", () => {
  const blocked = guardAssistantIntelligenceAction({
    action: "explain_workspace_intelligence",
    hasWorkspaceGrounding: false,
  });
  assert.equal(blocked.allowed, false);
  if (!blocked.allowed) {
    assert.equal(blocked.violationKind, "bypass_workspace_intelligence");
  }
});

test("certification compliance passes for Rule #12 guard", () => {
  const result = verifyNexoraRule12CertificationCompliance();
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
  assert.equal(result.tag, NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG);
});

test("all blocked violations are enumerated in contract", () => {
  assert.equal(RULE_12_BLOCKED_ASSISTANT_VIOLATIONS.length, 9);
});

test("traceNexoraRule12ActiveOnce is safe to call repeatedly", () => {
  traceNexoraRule12ActiveOnce("test");
  traceNexoraRule12ActiveOnce("test");
});
