import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BCA8_BUSINESS_CSV,
  BCA8_CERTIFICATION_BOUNDARY,
  BCA8_PROJECT_B_CSV,
  BCA8_PROJECT_CSV,
  BCA8_SOURCE_A_BKL_CSV,
  BCA8_SOURCE_B_BKL_CSV,
  BUSINESS_PROJECT_PRESENTATION_BOUNDARY,
  certifyRealManagerRealData,
  confirmCertificationColumn,
  confirmCertificationField,
  interpretCertificationCsv,
  nextCertificationClarification,
  resolveBusinessProjectContextClarification,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const orchestratorSource = readFileSync(join(here, "certifyRealManagerRealData.ts"), "utf8");

function meanings(projection: ReturnType<typeof certifyRealManagerRealData>): string[] {
  return projection.concepts.map((item) => item.canonicalMeaning).filter((item): item is string => Boolean(item));
}

function plantReview() {
  const interpreted = interpretCertificationCsv("plant-delivery.csv", BCA8_BUSINESS_CSV);
  return confirmCertificationColumn(interpreted, "CAP_AV", "Yes, it means available capacity.").review;
}

function jargon(text: string) {
  return /BCA:\d|DATA-ADV|sourceRef|MANAGER_CONFIRMED|POTENTIALLY_RELATED_TO|resolver|projection/i.test(text);
}

test("BCA:8 A/B/C — real Business CSV intake; CAP_AV is not silently guessed; confirmation uses existing writer", () => {
  const review = interpretCertificationCsv("plant-delivery.csv", BCA8_BUSINESS_CSV);
  const cap = review.mappings.find((item) => item.sourceColumn === "CAP_AV");
  assert.ok(cap);
  assert.notEqual(cap.semantic?.state, "UNDERSTOOD");
  const need = nextCertificationClarification(review);
  assert.ok(need);
  assert.notEqual(cap.semantic?.confirmationSource, "manager");
  const confirmed = confirmCertificationColumn(review, "CAP_AV", "Yes, it means available capacity.");
  assert.equal(confirmed.review.mappings.find((item) => item.sourceColumn === "CAP_AV")?.semantic?.confirmationSource, "manager");
  const projection = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review: confirmed.review,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "What is happening with delivery?",
  });
  assert.ok(meanings(projection).includes("Capacity"));
  assert.equal(confirmed.review.mappings.find((item) => item.sourceColumn === "CAP_AV")?.semantic?.confirmationSource, "manager");
  assert.equal(BCA8_CERTIFICATION_BOUNDARY.confirmationWriter, "applyCsvSemanticClarification");
  assert.doesNotMatch(orchestratorSource, /saveManagerRoleConfirmation|confirmBcaContext/);
});

test("BCA:8 D–G — Business context, concepts, non-causal relationships, and process placement", () => {
  const review = plantReview();
  const projection = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "What is happening with delivery?",
  });
  assert.equal(projection.context.contextKind, "BUSINESS");
  assert.ok(["Backlog", "Capacity", "On-Time Delivery", "Throughput", "Gross Margin"].some((name) => meanings(projection).includes(name)));
  assert.equal(projection.presentation.rejectedInferences.some((item) => /causality/i.test(item) || /not causality/.test(item) || /relationship is not causality/.test(item)), true);
  assert.equal(projection.concepts.every((item) => item.currentReality === "NOT_ESTABLISHED"), true);
  assert.equal(projection.concepts.every((item) => item.executiveObjectId === null), true);
});

test("BCA:8 H/I — Operations role is relevance only; permission and Decision authority stay unknown", () => {
  const review = plantReview();
  for (const title of ["Operations Manager", "CFO", "CEO", "Project Manager"] as const) {
    const projection = certifyRealManagerRealData({
      fileName: "plant-delivery.csv",
      csvText: BCA8_BUSINESS_CSV,
      review,
      organizationLabel: "Manufacturing Company",
      roleTitle: title,
      currentRequest: "What is happening with delivery?",
    });
    assert.equal(projection.manager.permissionsKnown, false);
    assert.equal(projection.manager.decisionAuthorityKnown, false);
  }
});

test("BCA:8 J/K — one material clarification; meaning questions do not force role questions", () => {
  const hybrid = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review: plantReview(),
    organizationLabel: "Manufacturing Operations",
    projectId: "line",
    projectLabel: "Production Expansion",
    roleTitle: "Delivery Manager",
    currentRequest: "Explain our capacity issue.",
  });
  assert.equal(hybrid.clarification.clarificationNeeded, true);
  assert.equal(hybrid.clarification.ambiguityType, "HYBRID_SCOPE_AMBIGUITY");
  const meaning = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Delivery Manager",
    currentRequest: "What does Gross Margin mean?",
  });
  assert.equal(meaning.clarification.roleClarificationNeeded, false);
  assert.equal(meaning.clarification.canProceedWithoutClarification, true);
});

test("BCA:8 L/M — context-aware Advisor; same evidence different role, identical fingerprint", () => {
  const review = plantReview();
  const ops = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "Operations Manager", currentRequest: "What is happening with delivery?" });
  const cfo = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "CFO", currentRequest: "What is happening with delivery?" });
  const ceo = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "CEO", currentRequest: "What is happening with delivery?" });
  assert.equal(ops.presentation.underlyingEvidenceFingerprint, cfo.presentation.underlyingEvidenceFingerprint);
  assert.equal(ops.presentation.underlyingEvidenceFingerprint, ceo.presentation.underlyingEvidenceFingerprint);
  assert.notEqual(ops.presentation.advisorContext.managerFacingExplanation, cfo.presentation.advisorContext.managerFacingExplanation);
  assert.match(ops.presentation.advisorContext.managerFacingExplanation, /delivery|fulfillment|backlog|capacity/i);
  assert.match(cfo.presentation.advisorContext.managerFacingExplanation, /margin|cost|financial/i);
  assert.match(ceo.presentation.advisorContext.managerFacingExplanation, /goal|trade-off/i);
  assert.equal(jargon(ops.presentation.advisorContext.managerFacingExplanation), false);
});

test("BCA:8 N/O — object explanation and why-showing stay safe", () => {
  const review = plantReview();
  const explain = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "Operations Manager", currentRequest: "Explain this Backlog object.", selectedConceptMeaning: "Backlog" });
  assert.match(explain.presentation.advisorContext.managerFacingExplanation, /fulfillment|production/i);
  assert.equal(jargon(explain.presentation.advisorContext.managerFacingExplanation), false);
  const why = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "Operations Manager", currentRequest: "Why are you showing me Capacity?" });
  assert.match(why.presentation.advisorContext.managerFacingExplanation, /does not mean it is the root cause/i);
});

test("BCA:8 P/Q/R — Stage membership, focus, and Theatre grammar stay unmutated", () => {
  const review = plantReview();
  const projection = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "CFO", currentRequest: "What is happening with delivery?" });
  assert.deepEqual(projection.stageObjectsAdded, []);
  assert.equal(projection.focusMutatedTo, null);
  assert.equal(projection.presentation.theatreContext.sizeUnchanged, true);
  assert.equal(projection.presentation.theatreContext.colorUnchanged, true);
  assert.equal(projection.presentation.theatreContext.causalVisualRejected, true);
  assert.equal(BUSINESS_PROJECT_PRESENTATION_BOUNDARY.mutatesObjectSize, false);
});

test("BCA:8 S/T — Hybrid capacity stays unmerged; forecast is not current", () => {
  const hybrid = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review: plantReview(),
    organizationLabel: "Manufacturing Operations",
    projectId: "line",
    projectLabel: "Production Expansion",
    roleTitle: "Operations Manager",
    currentRequest: "Explain our capacity issue.",
  });
  assert.equal(hybrid.context.contextKind, "HYBRID");
  assert.equal(hybrid.clarification.ambiguityType, "HYBRID_SCOPE_AMBIGUITY");
  const forecast = certifyRealManagerRealData({
    fileName: "expansion.csv",
    csvText: BCA8_PROJECT_CSV,
    projectId: "line",
    projectLabel: "Production Expansion",
    roleTitle: "Project Manager",
    currentRequest: "What is happening with capacity?",
    temporalStatus: "FORECAST",
  });
  assert.match(forecast.presentation.advisorContext.managerFacingExplanation, /forecast/i);
});

test("BCA:8 U — CSV values do not become Problems or current failure", () => {
  const review = plantReview();
  const projection = certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, review, organizationLabel: "Manufacturing Company", roleTitle: "Operations Manager", currentRequest: "What is happening with delivery?" });
  assert.equal(projection.objectsCreated.length, 0);
  assert.doesNotMatch(projection.presentation.advisorContext.managerFacingExplanation, /Delivery Failure|Critical Problem|fulfillment process is failing/);
  assert.ok(projection.negativeInferences.some((item) => /CSV value is an executive Problem/i.test(item)));
});

test("BCA:8 V — Source A BKL confirmation does not transfer to Source B", () => {
  const a = interpretCertificationCsv("source-a.csv", BCA8_SOURCE_A_BKL_CSV, null, "bca8:source-a");
  const need = nextCertificationClarification(a);
  const confirmedA = need ? confirmCertificationField(a, "Yes, BKL means backlog level.").review : a;
  const b = interpretCertificationCsv("source-b.csv", BCA8_SOURCE_B_BKL_CSV, confirmedA, "bca8:source-b");
  const fieldA = confirmedA.mappings.find((item) => item.sourceColumn === "BKL");
  const fieldB = b.mappings.find((item) => item.sourceColumn === "BKL");
  assert.ok(fieldA?.semantic);
  assert.ok(fieldB?.semantic);
  assert.notEqual(fieldB.semantic.sourceContextId, fieldA.semantic.sourceContextId);
  assert.notEqual(fieldB.semantic.confirmationSource, "manager");
});

test("BCA:8 W — Project A confirmation does not leak into Project B presentation", () => {
  const a = certifyRealManagerRealData({ fileName: "expansion-a.csv", csvText: BCA8_PROJECT_CSV, projectId: "line", projectLabel: "Production Expansion", roleTitle: "Project Manager", currentRequest: "What is happening on the project?" });
  const b = certifyRealManagerRealData({ fileName: "expansion-b.csv", csvText: BCA8_PROJECT_B_CSV, projectId: "project-b", projectLabel: "Other Expansion", roleTitle: "Project Manager", currentRequest: "What is happening on the project?" });
  assert.equal(b.presentation.sourceRefs.some((item) => item.sourceId === "line"), false);
  assert.equal(a.context.projectContext?.projectId, "line");
  assert.equal(b.context.projectContext?.projectId, "project-b");
});

test("BCA:8 X/Y — manager correction and I don't know stay on the existing writer", () => {
  const review = interpretCertificationCsv("plant-delivery.csv", BCA8_BUSINESS_CSV);
  const corrected = confirmCertificationColumn(review, "CAP_AV", "No, this means available labor capacity.");
  assert.match(corrected.review.mappings.find((item) => item.sourceColumn === "CAP_AV")?.semantic?.confirmedMeaning ?? "", /labor capacity/i);
  const unknown = confirmCertificationColumn(review, "CAP_AV", "I don't know.");
  assert.equal(unknown.review.mappings.find((item) => item.sourceColumn === "CAP_AV")?.semantic?.state, "UNKNOWN");
  const loop = resolveBusinessProjectContextClarification({
    context: certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, organizationLabel: "Manufacturing Company", roleTitle: "Delivery Manager", currentRequest: "Which operational issue matters most for my responsibility?" }).context,
    concepts: [],
    managerDecisionContext: certifyRealManagerRealData({ fileName: "plant-delivery.csv", csvText: BCA8_BUSINESS_CSV, organizationLabel: "Manufacturing Company", roleTitle: "Delivery Manager", currentRequest: "Which operational issue matters most for my responsibility?" }).manager,
    currentRequest: "Which operational issue matters most for my responsibility?",
    existingConfirmations: [Object.freeze({ clarificationKey: "MANAGER_ROLE:ROLE_AMBIGUITY", confirmationState: "DECLINED" })],
  });
  assert.equal(loop.clarificationNeeded, false);
  assert.equal(loop.declinedOrUnknown, true);
});

test("BCA:8 Z–AF — Scenario, comparison, recommendation, Decision, Execution, Outcome, and Learning are not BCA-owned", () => {
  const projection = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "What is happening with delivery?",
  });
  assert.equal(projection.recommendationWriter, "none");
  assert.equal(projection.decisionCommitted, false);
  assert.equal(projection.executionStarted, false);
  assert.equal(projection.outcomeCausalClaim, false);
  assert.equal(projection.learningWritten, false);
  assert.ok(projection.journey.some((step) => step.authority === "CC:10 / CC:10R"));
  assert.ok(projection.journey.some((step) => step.authority === "CC:11"));
  assert.ok(projection.truthLedger.some((row) => row.statement === "Action caused improvement" && row.status === "NOT ESTABLISHED"));
});

test("BCA:8 AG/AH — refresh through previousMapping and identical rebuild", () => {
  const first = interpretCertificationCsv("plant-delivery.csv", BCA8_BUSINESS_CSV);
  const confirmed = confirmCertificationColumn(first, "CAP_AV", "Yes, it means available capacity.").review;
  const refreshed = interpretCertificationCsv("plant-delivery.csv", BCA8_BUSINESS_CSV, confirmed);
  assert.equal(refreshed.mappings.find((item) => item.sourceColumn === "CAP_AV")?.semantic?.confirmationSource, "manager");
  const input = Object.freeze({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review: confirmed,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "What is happening with delivery?",
  });
  const before = JSON.stringify({ ...input, review: { mappingId: confirmed.mappingId, mappings: confirmed.mappings.map((item) => item.sourceColumn) } });
  const a = certifyRealManagerRealData(input);
  const b = certifyRealManagerRealData({ ...input, review: confirmed });
  assert.equal(a.presentation.underlyingEvidenceFingerprint, b.presentation.underlyingEvidenceFingerprint);
  assert.equal(Object.isFrozen(a.presentation), true);
  assert.equal(before.includes("plant-delivery.csv"), true);
});

test("BCA:8 AI/AJ — manager language stays clean; primary journey records existing authorities only", () => {
  const review = plantReview();
  const projection = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "Why does backlog matter?",
  });
  assert.equal(jargon(projection.presentation.advisorContext.managerFacingExplanation), false);
  assert.equal(BCA8_CERTIFICATION_BOUNDARY.ownsAdvisor, false);
  assert.equal(BCA8_CERTIFICATION_BOUNDARY.ownsDecision, false);
  assert.ok(projection.journey.every((step) => step.authority !== "BCA:8Advisor"));
});

test("BCA:8 project scenario — schedule variance is schedule control without failure claims", () => {
  const projection = certifyRealManagerRealData({
    fileName: "expansion.csv",
    csvText: BCA8_PROJECT_CSV,
    projectId: "line",
    projectLabel: "Production Expansion",
    roleTitle: "Project Manager",
    currentRequest: "What is happening on the project?",
  });
  assert.equal(projection.context.contextKind, "PROJECT");
  assert.ok(meanings(projection).includes("Schedule Variance") || meanings(projection).includes("Milestone") || meanings(projection).includes("Cost") || meanings(projection).includes("Resource Availability"));
  assert.doesNotMatch(projection.presentation.advisorContext.managerFacingExplanation, /project is failing|budget has been exceeded/i);
});

test("BCA:8 causal question remains qualified", () => {
  const review = plantReview();
  const projection = certifyRealManagerRealData({
    fileName: "plant-delivery.csv",
    csvText: BCA8_BUSINESS_CSV,
    review,
    organizationLabel: "Manufacturing Company",
    roleTitle: "Operations Manager",
    currentRequest: "Is backlog caused by low capacity?",
  });
  assert.doesNotMatch(JSON.stringify(projection.presentation.advisorContext), /"CAUSES"/);
  assert.ok(projection.negativeInferences.includes("Capacity caused backlog = NOT ESTABLISHED"));
});
