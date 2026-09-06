import assert from "node:assert/strict";
import test from "node:test";

import {
  BUSINESS_PROJECT_CONTEXT_BOUNDARY,
  diagnoseBusinessProjectContext,
  resolveBusinessProjectContext,
  type BusinessProjectKnownConcept,
  type BusinessProjectSourceRef,
  type ContextConfirmationState,
} from "./index.ts";

const ref = (authorityId: string, sourceId: string, sourceContextId: string | null = null): BusinessProjectSourceRef => Object.freeze({ authorityId, sourceId, sourceContextId });
const semantic = (conceptId: string, label: string, sourceContextId: string, confirmationState: ContextConfirmationState = "MANAGER_CONFIRMED"): BusinessProjectKnownConcept => Object.freeze({ conceptId, label, confirmationState, sourceRef: ref("RDI:2/CSV+DATA-ADV:2", conceptId, sourceContextId) });
const evidence = (evidenceId: string, kind: "ORGANIZATION" | "PROJECT" | "DOMAIN", label: string, confirmationState: ContextConfirmationState = "AUTHORITATIVE") => Object.freeze({ evidenceId, kind, label, confirmationState, sourceRef: ref(kind === "DOMAIN" ? "NexoraDomainRegistry" : "ManagerOnboarding", evidenceId) });

test("BCA:1 A — known manufacturing Business context consumes confirmed OTD without causality", () => {
  const context = resolveBusinessProjectContext({
    workspaceId: "manufacturing",
    domain: { domainId: "supply_chain", evidence: evidence("domain-manufacturing", "DOMAIN", "Manufacturing Operations") },
    organization: { context: { label: "Industrial door manufacturer" }, evidence: evidence("org-1", "ORGANIZATION", "Manufacturing company", "MANAGER_CONFIRMED") },
    confirmedSemanticConcepts: [semantic("otd", "On-Time Delivery", "source-a")],
  });
  assert.equal(context.contextKind, "BUSINESS");
  assert.equal(context.knownConcepts[0]?.label, "On-Time Delivery");
  assert.ok(context.contextualRelationships.some((item) => item.toContextConcept === "Delivery"));
  assert.ok(context.contextualRelationships.every((item) => item.causal === false));
  assert.equal(Object.isFrozen(context), true);
});

test("BCA:1 B — Project context preserves schedule and cost relevance without inventing risk", () => {
  const context = resolveBusinessProjectContext({
    workspaceId: "warehouse-expansion",
    project: { context: { projectId: "project-warehouse", label: "Warehouse Expansion" }, evidence: evidence("project-warehouse", "PROJECT", "Warehouse Expansion") },
    confirmedSemanticConcepts: [semantic("planned-date", "Planned Completion Date", "project-source"), semantic("actual-date", "Actual Completion Date", "project-source"), semantic("project-cost", "Project Cost", "project-source")],
  });
  assert.equal(context.contextKind, "PROJECT");
  assert.ok(context.contextualRelationships.some((item) => item.toContextConcept === "Project Schedule"));
  assert.ok(context.contextualRelationships.some((item) => item.toContextConcept === "Finance"));
  assert.equal(context.contextualRelationships.some((item) => /risk/i.test(item.toContextConcept)), false);
});

test("BCA:1 C — Hybrid preserves business and project context independently", () => {
  const context = resolveBusinessProjectContext({
    workspaceId: "line-expansion",
    organization: { context: { label: "Manufacturing business" }, evidence: evidence("org-line", "ORGANIZATION", "Manufacturing business") },
    project: { context: { projectId: "line-install", label: "Install new production line" }, evidence: evidence("project-line", "PROJECT", "Production Line Expansion") },
  });
  assert.equal(context.contextKind, "HYBRID");
  assert.equal(context.organizationContext?.label, "Manufacturing business");
  assert.equal(context.projectContext?.projectId, "line-install");
});

test("BCA:1 D/E — unconfirmed fields remain Unknown; confirmed Backlog gains non-causal relevance", () => {
  const unknown = resolveBusinessProjectContext({ workspaceId: "opaque", confirmedSemanticConcepts: [semantic("bkl", "BKL", "source-a", "UNCONFIRMED"), semantic("cap-av", "CAP_AV", "source-a", "UNCONFIRMED")] });
  assert.equal(unknown.contextKind, "UNKNOWN");
  assert.equal(unknown.knownConcepts.length, 0);
  assert.equal(unknown.contextualRelationships.length, 0);
  assert.match(unknown.unresolvedContext.join(" "), /excluded/i);
  const backlog = resolveBusinessProjectContext({ workspaceId: "operations", confirmedSemanticConcepts: [semantic("bkl", "Backlog Level", "source-a")] });
  assert.equal(backlog.contextKind, "BUSINESS");
  assert.deepEqual(backlog.contextualRelationships.map((item) => item.toContextConcept), ["Operations", "Delivery", "Workload"]);
  assert.ok(backlog.contextualRelationships.every((item) => item.causal === false));
});

test("BCA:1 F — Manager Context is descriptive and grants no permission or decision authority", () => {
  const context = resolveBusinessProjectContext({
    workspaceId: "finance",
    managerContext: { roleLabel: "Finance Manager", sourceRef: ref("ManagerConversation", "manager-role"), confirmationState: "MANAGER_CONFIRMED", permissions: null, decisionAuthority: null },
    domain: { domainId: "finance", evidence: evidence("finance-domain", "DOMAIN", "Finance") },
  });
  assert.equal(context.managerContext?.roleLabel, "Finance Manager");
  assert.equal(context.managerContext?.permissions, null);
  assert.equal(context.managerContext?.decisionAuthority, null);
  const diagnostics = diagnoseBusinessProjectContext(context);
  assert.ok(diagnostics.rejectedUnsafeInference.includes("manager-role-does-not-grant-permission"));
});

test("BCA:1 G — same concept remains isolated by source provenance", () => {
  const a = resolveBusinessProjectContext({ workspaceId: "w", confirmedSemanticConcepts: [semantic("backlog-a", "Backlog Level", "source-a")] });
  const b = resolveBusinessProjectContext({ workspaceId: "w", confirmedSemanticConcepts: [semantic("backlog-b", "Backlog Level", "source-b")] });
  assert.notEqual(a.contextId, b.contextId);
  assert.equal(a.sourceRefs.some((item) => item.sourceContextId === "source-b"), false);
  assert.equal(b.sourceRefs.some((item) => item.sourceContextId === "source-a"), false);
});

test("BCA:1 H — durable authoritative input rebuilds an equivalent projection with no hidden state", () => {
  const input = Object.freeze({ workspaceId: "restored", project: Object.freeze({ context: Object.freeze({ projectId: "p1", label: "Warehouse Expansion" }), evidence: evidence("p1", "PROJECT", "Warehouse Expansion") }), confirmedSemanticConcepts: Object.freeze([semantic("schedule", "Schedule Variance", "source-restored")]) });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectContext(input);
  const rebuilt = resolveBusinessProjectContext(JSON.parse(before));
  assert.deepEqual(rebuilt, first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(diagnoseBusinessProjectContext(first).mutatesAuthorities, false);
});

test("BCA:1 authority boundary excludes all downstream mutations and causal truth", () => {
  assert.deepEqual(BUSINESS_PROJECT_CONTEXT_BOUNDARY, {
    ownsContextInterpretation: true,
    ownsDomain: false,
    ownsGoals: false,
    ownsObjects: false,
    ownsDataReality: false,
    ownsSemanticConfirmation: false,
    ownsStage: false,
    ownsDecision: false,
    ownsExecution: false,
    ownsOutcome: false,
    ownsLearning: false,
    createsCausalEdges: false,
    createsObjects: false,
    createsGoals: false,
    persistsState: false,
    usesLlm: false,
  });
});
