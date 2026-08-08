import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_CONSTRAINTS as emptyConstraints,
  DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PROVENANCE as emptyProvenance,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES as contractCategories,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PRINCIPLE as principle,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES as contractStatuses,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS as contextKinds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES as eligibilityValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES as interruptionValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES as persistenceValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS as relationshipKinds,
  createDirectorRuntimeExecutiveGuidanceCandidate,
  createDirectorRuntimeExecutiveGuidanceConstraints,
  createDirectorRuntimeExecutiveGuidanceContextReference,
  createDirectorRuntimeExecutiveGuidanceContractIssue,
  createDirectorRuntimeExecutiveGuidanceContractRelationship,
  createDirectorRuntimeExecutiveGuidanceContractResult,
  createDirectorRuntimeExecutiveGuidanceDeliveryPolicy,
  createDirectorRuntimeExecutiveGuidanceEnvelope,
  createDirectorRuntimeExecutiveGuidancePathContract,
  createDirectorRuntimeExecutiveGuidanceProvenance,
  createDirectorRuntimeExecutiveGuidanceRequest,
  directorRuntimeExecutiveGuidanceContracts as contracts,
  directorRuntimeExecutiveGuidanceContractsCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceContractsConstructorNames as constructorNames,
  directorRuntimeExecutiveGuidanceContractsGuardNames as guardNames,
  directorRuntimeExecutiveGuidanceContractsRegistry as registry,
  isDirectorRuntimeExecutiveGuidanceCandidate,
  isDirectorRuntimeExecutiveGuidanceEnvelope,
  isDirectorRuntimeExecutiveGuidanceRequest,
  verifyDirectorRuntimeExecutiveGuidanceContracts,
} from "./directorRuntimeExecutiveGuidanceContracts.ts";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES as importanceValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES as urgencyValues,
  directorRuntimeExecutiveGuidanceFoundationIdentity,
  verifyDirectorRuntimeExecutiveGuidanceFoundation,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import {
  directorRuntimeAttentionFocusPublicIndexIdentity,
  verifyDirectorRuntimeAttentionFocusPublicIndex,
} from "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceContracts.ts", import.meta.url),
  "utf8",
);

const sampleGuidance = {
  guidanceId: "guidance.production-warning",
  guidanceKind: "direct-attention" as const,
  target: { targetKind: "object" as const, targetId: "production" },
  importance: "critical" as const,
  urgency: "immediate" as const,
  intent: "warn" as const,
  source: {
    sourceKind: "attention-output" as const,
    sourceId: "attention.production-risk",
  },
};

test("1. exact DRI-7:2 identity", () => {
  assert.equal(
    contracts.identity,
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
  );
  assert.equal(canonicalIdentity.identity, contracts.identity);
  assert.equal(contracts.phase, "DRI-7:2");
  assert.equal(contracts.name, "DirectorRuntimeExecutiveGuidanceContracts");
  assert.equal(contracts.role, "Contracts");
  assert.equal(contracts.status, "ContractsReady");
});

test("2. exact version 7.2.0", () => {
  assert.equal(contracts.version, "7.2.0");
  assert.equal(canonicalIdentity.version, "7.2.0");
  assert.equal(registry.version, "7.2.0");
});

test("3. exact namespace", () => {
  assert.equal(
    contracts.namespace,
    "nexora.dri.executive-guidance.contracts",
  );
  assert.equal(canonicalIdentity.namespace, contracts.namespace);
});

test("4. sole immediate dependency is DRI-7:1", () => {
  assert.equal(
    contracts.upstreamDependency,
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    directorRuntimeExecutiveGuidanceFoundationIdentity,
  );
  assert.equal(registry.dependency, contracts.upstreamDependency);
  assert.equal(contracts.foundationBoundary, "DRI-7:1-foundation-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation",
  ]);
});

test("5. no direct DRI-6 dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
  assert.doesNotMatch(source, /DRI-6:[0-9]/);
  assert.notEqual(
    contracts.upstreamDependency,
    directorRuntimeAttentionFocusPublicIndexIdentity,
  );
});

test("6. eligibility vocabulary completeness", () => {
  assert.deepEqual([...eligibilityValues], [
    "eligible",
    "suppressed",
    "deferred",
    "ineligible",
  ]);
  assert.equal(eligibilityValues.length, 4);
  assert.equal(new Set(eligibilityValues).size, 4);
});

test("7. interruption vocabulary completeness", () => {
  assert.deepEqual([...interruptionValues], [
    "non-interruptive",
    "contextual",
    "interruptive",
  ]);
  assert.equal(interruptionValues.length, 3);
});

test("8. persistence vocabulary completeness", () => {
  assert.deepEqual([...persistenceValues], [
    "transient",
    "context-bound",
    "focus-bound",
    "persistent",
  ]);
  assert.equal(persistenceValues.length, 4);
});

test("9. context-kind vocabulary completeness", () => {
  assert.deepEqual([...contextKinds], [
    "goal",
    "object",
    "problem",
    "scenario",
    "decision",
    "execution",
    "workspace",
    "lens",
  ]);
  assert.equal(contextKinds.length, 8);
});

test("10. relationship-kind vocabulary completeness", () => {
  assert.deepEqual([...relationshipKinds], [
    "supports",
    "explains",
    "causes",
    "depends-on",
    "conflicts-with",
    "compares-with",
    "impacts",
    "derived-from",
  ]);
  assert.equal(relationshipKinds.length, 8);
});

test("11. contract-status vocabulary completeness", () => {
  assert.deepEqual([...contractStatuses], ["accepted", "rejected"]);
  assert.equal(contractStatuses.length, 2);
  assert.deepEqual([...contractCategories], [
    "request",
    "candidate",
    "constraints",
    "context-reference",
    "provenance",
    "relationship",
    "path",
    "delivery-policy",
    "envelope",
    "result",
    "issue",
  ]);
});

test("12. request construction", () => {
  const request = createDirectorRuntimeExecutiveGuidanceRequest({
    requestId: "request.production-risk",
    subjects: [{ targetKind: "object", targetId: "production" }],
    attentionReferences: [{
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    }],
    intent: "warn",
    constraints: {
      preserveCurrentFocus: false,
      preserveExecutiveContext: true,
      allowInterruption: true,
      allowComparison: false,
      allowPathExplanation: true,
      maximumGuidanceItems: 5,
    },
    context: { contextKind: "problem", contextId: "ctx.production-risk" },
  });
  assert.equal(request.requestId, "request.production-risk");
  assert.equal(request.subjects[0]?.targetId, "production");
  assert.equal(request.intent, "warn");
  assert.equal(request.constraints.maximumGuidanceItems, 5);
  assert.equal(isDirectorRuntimeExecutiveGuidanceRequest(request), true);
});

test("13. candidate construction", () => {
  const candidate = createDirectorRuntimeExecutiveGuidanceCandidate({
    candidateId: "candidate.production-warning",
    guidance: sampleGuidance,
    eligibility: "eligible",
    provenance: {
      sourceReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      derivedFromGuidanceIds: [],
    },
    constraints: { allowInterruption: true },
  });
  assert.equal(candidate.candidateId, "candidate.production-warning");
  assert.equal(candidate.eligibility, "eligible");
  assert.equal(candidate.guidance.importance, "critical");
  assert.equal(isDirectorRuntimeExecutiveGuidanceCandidate(candidate), true);
});

test("14. constraint construction", () => {
  const constraints = createDirectorRuntimeExecutiveGuidanceConstraints({
    preserveCurrentFocus: true,
    allowPathExplanation: false,
    maximumGuidanceItems: 3,
  });
  assert.equal(constraints.preserveCurrentFocus, true);
  assert.equal(constraints.allowPathExplanation, false);
  assert.equal(constraints.maximumGuidanceItems, 3);
  assert.equal(Object.isFrozen(constraints), true);
  assert.equal(Object.isFrozen(emptyConstraints), true);
});

test("15. context reference construction", () => {
  const context = createDirectorRuntimeExecutiveGuidanceContextReference({
    contextKind: "decision",
    contextId: "decision.expand-capacity",
  });
  assert.deepEqual(context, {
    contextKind: "decision",
    contextId: "decision.expand-capacity",
  });
  assert.equal(Object.isFrozen(context), true);
});

test("16. provenance construction", () => {
  const provenance = createDirectorRuntimeExecutiveGuidanceProvenance({
    sourceReferences: [{
      sourceKind: "focus-subject",
      sourceId: "focus.production",
    }],
    derivedFromGuidanceIds: ["guidance.parent"],
    rationale: "Derived from focus subject",
  });
  assert.equal(provenance.sourceReferences.length, 1);
  assert.deepEqual([...provenance.derivedFromGuidanceIds], ["guidance.parent"]);
  assert.equal(provenance.rationale, "Derived from focus subject");
  assert.equal(Object.isFrozen(emptyProvenance), true);
});

test("17. relationship construction", () => {
  const relationship = createDirectorRuntimeExecutiveGuidanceContractRelationship({
    relationshipId: "rel.supplier-production",
    relationshipKind: "impacts",
    sourceTarget: { targetKind: "object", targetId: "supplier" },
    targetTarget: { targetKind: "object", targetId: "production" },
    rationale: "Supplier disruption impacts production",
  });
  assert.equal(relationship.relationshipKind, "impacts");
  assert.equal(relationship.sourceTarget.targetId, "supplier");
  assert.equal(relationship.targetTarget.targetId, "production");
  assert.equal(Object.isFrozen(relationship), true);
});

test("18. delivery-policy construction", () => {
  const policy = createDirectorRuntimeExecutiveGuidanceDeliveryPolicy({
    interruption: "interruptive",
    persistence: "focus-bound",
    preserveFocus: false,
    preserveContext: true,
  });
  assert.equal(policy.interruption, "interruptive");
  assert.equal(policy.persistence, "focus-bound");
  assert.equal(policy.preserveFocus, false);
  assert.equal(policy.preserveContext, true);
});

test("19. envelope construction", () => {
  const envelope = createDirectorRuntimeExecutiveGuidanceEnvelope({
    envelopeId: "envelope.production-risk",
    request: {
      requestId: "request.production-risk",
      subjects: [{ targetKind: "object", targetId: "production" }],
      attentionReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      constraints: { allowInterruption: true },
    },
    candidates: [{
      candidateId: "candidate.production-warning",
      guidance: sampleGuidance,
      eligibility: "eligible",
      provenance: {
        sourceReferences: [{
          sourceKind: "attention-output",
          sourceId: "attention.production-risk",
        }],
        derivedFromGuidanceIds: [],
      },
      constraints: {},
    }],
    relationships: [{
      relationshipId: "rel-1",
      relationshipKind: "explains",
      sourceTarget: { targetKind: "kpi", targetId: "delivery-performance" },
      targetTarget: { targetKind: "object", targetId: "production" },
    }],
    paths: [{
      pathId: "path-impact",
      targets: [
        { targetKind: "object", targetId: "supplier" },
        { targetKind: "object", targetId: "production" },
        { targetKind: "kpi", targetId: "delivery-performance" },
        { targetKind: "object", targetId: "customer" },
      ],
      meaning: "Operational impact path",
      provenance: {
        sourceReferences: [{
          sourceKind: "path-evidence",
          sourceId: "path.production-impact",
        }],
        derivedFromGuidanceIds: [],
      },
    }],
    deliveryPolicy: {
      interruption: "interruptive",
      persistence: "context-bound",
      preserveFocus: false,
      preserveContext: true,
    },
  });
  assert.equal(envelope.envelopeId, "envelope.production-risk");
  assert.equal(envelope.candidates.length, 1);
  assert.equal(envelope.paths[0]?.targets.length, 4);
  assert.equal(isDirectorRuntimeExecutiveGuidanceEnvelope(envelope), true);
});

test("20. contract result structure", () => {
  const accepted = createDirectorRuntimeExecutiveGuidanceContractResult({
    status: "accepted",
    value: { ok: true },
    issues: [],
  });
  const rejected = createDirectorRuntimeExecutiveGuidanceContractResult({
    status: "rejected",
    value: null,
    issues: [{
      code: "invalid-request",
      message: "requestId required",
      path: "requestId",
    }],
  });
  assert.equal(accepted.status, "accepted");
  assert.deepEqual(accepted.value, { ok: true });
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.value, null);
  assert.equal(rejected.issues.length, 1);
});

test("21. contract issue structure", () => {
  const issue = createDirectorRuntimeExecutiveGuidanceContractIssue({
    code: "invalid-candidate",
    message: "candidateId must be non-empty",
    path: "candidates[0].candidateId",
  });
  assert.deepEqual(issue, {
    code: "invalid-candidate",
    message: "candidateId must be non-empty",
    path: "candidates[0].candidateId",
  });
  assert.equal(Object.isFrozen(issue), true);
});

test("22. candidate ordering preservation", () => {
  const envelope = createDirectorRuntimeExecutiveGuidanceEnvelope({
    envelopeId: "envelope.order",
    request: {
      requestId: "request.order",
      subjects: [],
      attentionReferences: [],
      constraints: {},
    },
    candidates: [
      {
        candidateId: "candidate-c",
        guidance: {
          ...sampleGuidance,
          guidanceId: "g-c",
          importance: "supporting",
          urgency: "none",
        },
        eligibility: "eligible",
        provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
        constraints: {},
      },
      {
        candidateId: "candidate-a",
        guidance: {
          ...sampleGuidance,
          guidanceId: "g-a",
          importance: "critical",
          urgency: "immediate",
        },
        eligibility: "deferred",
        provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
        constraints: {},
      },
      {
        candidateId: "candidate-b",
        guidance: {
          ...sampleGuidance,
          guidanceId: "g-b",
          importance: "important",
          urgency: "soon",
        },
        eligibility: "eligible",
        provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
        constraints: {},
      },
    ],
    relationships: [],
    paths: [],
    deliveryPolicy: {
      interruption: "non-interruptive",
      persistence: "transient",
      preserveFocus: true,
      preserveContext: true,
    },
  });
  assert.deepEqual(
    envelope.candidates.map((entry) => entry.candidateId),
    ["candidate-c", "candidate-a", "candidate-b"],
  );
  assert.equal(boundary.preservesCallerCandidateOrder, true);
  assert.equal(boundary.doesNotRankCandidates, true);
});

test("23. path ordering preservation", () => {
  const path = createDirectorRuntimeExecutiveGuidancePathContract({
    pathId: "path-order",
    targets: [
      { targetKind: "object", targetId: "supplier" },
      { targetKind: "object", targetId: "warehouse" },
      { targetKind: "object", targetId: "production" },
      { targetKind: "kpi", targetId: "delivery-performance" },
      { targetKind: "object", targetId: "customer" },
    ],
    provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
  });
  assert.deepEqual(
    path.targets.map((entry) => entry.targetId),
    [
      "supplier",
      "warehouse",
      "production",
      "delivery-performance",
      "customer",
    ],
  );
});

test("24. provenance traceability", () => {
  const candidate = createDirectorRuntimeExecutiveGuidanceCandidate({
    candidateId: "candidate.trace",
    guidance: sampleGuidance,
    eligibility: "eligible",
    provenance: {
      sourceReferences: [
        {
          sourceKind: "attention-output",
          sourceId: "attention.production-risk",
        },
        {
          sourceKind: "relationship-evidence",
          sourceId: "rel.supplier-production",
        },
      ],
      derivedFromGuidanceIds: ["guidance.upstream"],
      rationale: "Traceable to attention and relationship evidence",
    },
    constraints: {},
  });
  assert.equal(candidate.provenance.sourceReferences.length, 2);
  assert.equal(candidate.provenance.derivedFromGuidanceIds[0], "guidance.upstream");
  assert.ok(candidate.provenance.rationale?.includes("Traceable"));
});

test("25. importance/urgency independence inherited from Foundation", () => {
  const opportunity = createDirectorRuntimeExecutiveGuidanceCandidate({
    candidateId: "candidate.opportunity",
    guidance: {
      ...sampleGuidance,
      guidanceId: "g-opportunity",
      guidanceKind: "surface-opportunity",
      importance: "important",
      urgency: "none",
      intent: "prepare-decision",
    },
    eligibility: "eligible",
    provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
    constraints: {},
  });
  assert.equal(opportunity.guidance.importance, "important");
  assert.equal(opportunity.guidance.urgency, "none");
  assert.ok(!importanceValues.includes("immediate" as never));
  assert.ok(!urgencyValues.includes("critical" as never));
});

test("26. input arrays are not mutated", () => {
  const subjects = [{ targetKind: "object" as const, targetId: "production" }];
  const attentionReferences = [{
    sourceKind: "attention-output" as const,
    sourceId: "attention.production-risk",
  }];
  const candidates: Array<{
    candidateId: string;
    guidance: typeof sampleGuidance;
    eligibility: "eligible" | "deferred";
    provenance: {
      sourceReferences: typeof attentionReferences;
      derivedFromGuidanceIds: string[];
    };
    constraints: Record<string, never>;
  }> = [{
    candidateId: "c1",
    guidance: sampleGuidance,
    eligibility: "eligible",
    provenance: {
      sourceReferences: [...attentionReferences],
      derivedFromGuidanceIds: [],
    },
    constraints: {},
  }];
  const subjectsSnap = JSON.stringify(subjects);
  const refsSnap = JSON.stringify(attentionReferences);
  const candidatesSnap = JSON.stringify(candidates);
  createDirectorRuntimeExecutiveGuidanceEnvelope({
    envelopeId: "e1",
    request: {
      requestId: "r1",
      subjects,
      attentionReferences,
      constraints: {},
    },
    candidates,
    relationships: [],
    paths: [],
    deliveryPolicy: {
      interruption: "non-interruptive",
      persistence: "transient",
      preserveFocus: true,
      preserveContext: true,
    },
  });
  assert.equal(JSON.stringify(subjects), subjectsSnap);
  assert.equal(JSON.stringify(attentionReferences), refsSnap);
  assert.equal(JSON.stringify(candidates), candidatesSnap);
  candidates.push({
    candidateId: "c2",
    guidance: sampleGuidance,
    eligibility: "deferred",
    provenance: { sourceReferences: [], derivedFromGuidanceIds: [] },
    constraints: {},
  });
  assert.equal(candidates.length, 2);
});

test("27. returned contracts resist mutation", () => {
  const request = createDirectorRuntimeExecutiveGuidanceRequest({
    requestId: "r-imm",
    subjects: [{ targetKind: "object", targetId: "production" }],
    attentionReferences: [],
    constraints: { allowComparison: true },
  });
  assert.equal(Object.isFrozen(request), true);
  assert.equal(Object.isFrozen(request.subjects), true);
  assert.throws(() => {
    (request as { requestId?: string }).requestId = "mutated";
  });
  assert.throws(() => {
    (request.subjects as unknown as Array<{ targetId: string }>).push({
      targetId: "extra",
    });
  });
});

test("28. no ranking behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:rankCandidates|selectPrimary|chooseWinner|sortByImportance|sortByUrgency|priorityScore|salienceScore)\b/,
  );
  assert.equal(boundary.doesNotRankCandidates, true);
  assert.equal(boundary.doesNotResolveGuidance, true);
  assert.equal(boundary.doesNotComposeGuidance, true);
});

test("29. no candidate-selection behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:selectCandidate|resolvePrimary|pickPrimary|winner|loser|promoteCandidate|suppressCandidate)\b/,
  );
  assert.ok(
    invariants.some((entry) => entry.id === "candidate-not-resolution"),
  );
});

test("30. no attention recalculation", () => {
  assert.doesNotMatch(
    source,
    /\b(?:scoreAttention|recalculateAttention|focusScore|attentionScore|salience|riskFormula|weightedScore)\b/,
  );
  assert.equal(boundary.doesNotRecalculateAttention, true);
  assert.equal(boundary.attentionAuthority, "DRI-6");
});

test("31. no renderer-specific fields", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|hexColor|opacity|position|camera|zoom|glow|pulse|animation|duration|easing|cssClass|panel|modal|tooltip|svg|mesh|material|geometry)\s*[?:]/,
  );
  assert.doesNotMatch(source, /\b(?:x|y|z|scale|rotation)\s*[?:]/);
});

test("32. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Vector3)\b/);
});

test("33. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)(?:\/[^"']*)?["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect)\b/);
});

test("34. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest|navigator)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("35. no Advisor/LLM dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:prompt|systemPrompt|assistantMessage|chatMessage|LLMResponse|tokenCount|modelName)\b/,
  );
  assert.equal(contracts.advisorIndependent, true);
});

test("36. no action execution", () => {
  assert.doesNotMatch(
    source,
    /\b(?:approveDecision|rejectDecision|startExecution|pauseExecution|cancelExecution|navigateWorkspace|openPanel|modifyObject)\b/,
  );
  assert.equal(contracts.actionIndependent, true);
});

test("37. registry deterministic and frozen", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(eligibilityValues), true);
  assert.equal(Object.isFrozen(contractCategories), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(registry.vocabularySectionCount, 7);
  assert.equal(registry.vocabularyValueCount, 40);
  assert.throws(() => {
    (registry as { version?: string }).version = "0";
  });
});

test("38. contract verification passes", () => {
  const first = verifyDirectorRuntimeExecutiveGuidanceContracts();
  const second = verifyDirectorRuntimeExecutiveGuidanceContracts();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.eligibilityCount, 4);
  assert.equal(first.interruptionCount, 3);
  assert.equal(first.persistenceCount, 4);
  assert.equal(first.contextKindCount, 8);
  assert.equal(first.relationshipKindCount, 8);
  assert.equal(first.contractStatusCount, 2);
  assert.equal(first.contractCategoryCount, 11);
  assert.equal(first.publicTypeCount, 21);
  assert.equal(first.constructorCount, 11);
  assert.equal(first.guardCount, 17);
  assert.equal(first.invariantCount, 13);
  assert.equal(first.frozen, true);
  assert.equal(first.preservesCandidateOrder, true);
  assert.equal(first.foundationCompatible, true);
  assert.equal(first.rendererIndependent, true);
  assert.equal(first.advisorIndependent, true);
  assert.equal(first.actionIndependent, true);
  assert.equal(first.noRanking, true);
  assert.equal(first.noAttentionRecalculation, true);
  assert.equal(constructorNames.length, registry.constructorCount);
  assert.equal(guardNames.length, registry.guardCount);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(principle.includes("Foundation defines what guidance IS"), true);
  assert.equal(
    contracts.architecturalStatus,
    "Contracts Complete · Deterministic · Immutable · Traceable · Renderer-Independent · ReadyForResolution",
  );
});

test("39. DRI-7:1 regression passes", () => {
  const foundation = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(
    foundation.identity,
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
  );
  assert.equal(foundation.version, "7.1.0");
});

test("40. DRI-6 regression remains clean", () => {
  const publicIndex = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    publicIndex.identity,
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  );
  assert.equal(
    directorRuntimeAttentionFocusPublicIndexIdentity,
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  );
});
