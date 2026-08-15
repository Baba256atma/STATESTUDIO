/**
 * P2:8.1 — Data Reality Visual Stage Audit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY,
  DATA_REALITY_VISUAL_STAGE_AUDIT_PROVENANCE_CHAIN,
  DATA_REALITY_VISUAL_STAGE_AUDIT_SUBJECTS,
  DATA_REALITY_VISUAL_STAGE_CANONICAL_NON_EDGES,
  assertCanonicalNonEdgesPreserved,
  auditDataRealityVisualStage,
  compareAnchorFocusVisibility,
  compareAttentionVisibility,
  compareConnectionVisibility,
  compareContextRevealVisibility,
  compareExecutiveStateVisibility,
  dataRealityVisualStageAuditArchitecturalRole,
  dataRealityVisualStageAuditIdentity,
  dataRealityVisualStageAuditNamespace,
  dataRealityVisualStageAuditPhase,
  dataRealityVisualStageAuditReadiness,
  dataRealityVisualStageAuditVersion,
  extractObservedStageEvidenceFromPresentation,
  getDataRealityVisualStageAuditIdentity,
  groupVisualRealityFindingsByDimension,
  summarizeVisualRealityAudit,
  type ObservedStageObjectEvidence,
  type VisualRealityAuditFinding,
} from "./dataRealityVisualStageAudit.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";

const here = dirname(fileURLToPath(import.meta.url));

function sampleObservedObject(
  overrides: Partial<ObservedStageObjectEvidence> & { readonly objectId: string },
): ObservedStageObjectEvidence {
  return Object.freeze({
    objectId: overrides.objectId,
    label: overrides.label ?? overrides.objectId,
    present: overrides.present ?? true,
    role: overrides.role ?? "normal",
    status: overrides.status ?? "stable",
    attention: overrides.attention ?? "normal",
    focused: overrides.focused ?? false,
    selected: overrides.selected ?? false,
    opacity: overrides.opacity ?? 1,
    scale: overrides.scale ?? 1,
    emissiveIntensity: overrides.emissiveIntensity ?? 0.06,
    labelProminence: overrides.labelProminence ?? "full",
    targetPosition: overrides.targetPosition ?? ([0, 0, 0] as const),
    hasStatusColorTreatment: overrides.hasStatusColorTreatment ?? true,
  });
}

test("P2:8.1 identity and boundary", () => {
  const identity = getDataRealityVisualStageAuditIdentity();
  assert.equal(
    dataRealityVisualStageAuditIdentity,
    "P2:8.1/DataRealityVisualStageAudit",
  );
  assert.equal(identity.identity, "P2:8.1/DataRealityVisualStageAudit");
  assert.equal(dataRealityVisualStageAuditVersion, "2.8.1");
  assert.equal(
    dataRealityVisualStageAuditNamespace,
    "nexora.data-reality.visual-stage-audit",
  );
  assert.equal(dataRealityVisualStageAuditPhase, "VisualRealityAudit");
  assert.equal(
    dataRealityVisualStageAuditArchitecturalRole,
    "DataRealityVisualStageAuditBoundary",
  );
  assert.equal(
    dataRealityVisualStageAuditReadiness,
    "ReadyForVisualStateValidation",
  );
  assert.equal(
    DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY.ownsKpiComputation,
    false,
  );
  assert.equal(
    DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY.redesignsStageVisuals,
    false,
  );
  assert.equal(
    DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY.certifiesHumanVisualPerception,
    false,
  );
  assert.ok(
    DATA_REALITY_VISUAL_STAGE_AUDIT_PROVENANCE_CHAIN.includes(
      "P2:8.1 Visual Stage Audit",
    ),
  );
  assert.equal(DATA_REALITY_VISUAL_STAGE_AUDIT_SUBJECTS.length, 6);
});

test("TEST 1 — canonical executive state preserved through audit inputs", () => {
  const baseline = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  const pressure = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
  });

  const baselineRevenue = baseline.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  const pressureRevenue = pressure.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  const baselineCapacity = baseline.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const pressureCapacity = pressure.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;

  assert.equal(baselineRevenue.status, "stable");
  assert.equal(baselineRevenue.attention, "normal");
  assert.equal(pressureRevenue.status, "watch");
  assert.equal(pressureRevenue.attention, "important");
  assert.equal(baselineCapacity.status, "watch");
  assert.equal(baselineCapacity.attention, "important");
  assert.equal(pressureCapacity.status, "risk");
  assert.equal(pressureCapacity.attention, "critical");

  const baselineBinding = baseline.audit.findings.find(
    (entry) =>
      entry.subjectId === "revenue" && entry.dimension === "executive-state",
  )!;
  assert.equal(
    (baselineBinding.expectedState as { mvpStatus?: string }).mvpStatus,
    "stable",
  );
});

test("TEST 2 — rendered evidence can be compared against expected state", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  const observed = extractObservedStageEvidenceFromPresentation(
    bundle.presentation,
  );
  assert.equal(observed.evidenceKind, "structural");
  assert.ok(observed.objects.some((entry) => entry.objectId === "obj-inventory"));
  assert.ok(observed.instrumentationMarkers.length > 0);

  const inventoryState = bundle.audit.findings.find(
    (entry) =>
      entry.subjectId === "warehouse" &&
      entry.dimension === "executive-state",
  )!;
  assert.equal(
    (inventoryState.expectedState as { mvpStatus?: string }).mvpStatus,
    "risk",
  );
  assert.equal(
    (inventoryState.observedState as { status?: string }).status,
    "risk",
  );
});

test("TEST 3 — missing visible treatment becomes computed-but-not-visible", () => {
  const result = compareExecutiveStateVisibility({
    expectedMvpStatus: "risk",
    expectedMvpAttention: "critical",
    expectedUnresolved: false,
    hasStageObject: true,
    stageObjectMissingByDesign: false,
    observed: sampleObservedObject({
      objectId: "obj-capacity",
      status: "risk",
      attention: "critical",
      hasStatusColorTreatment: false,
    }),
  });
  assert.equal(result.status, "computed-but-not-visible");
});

test("TEST 4 — contradictory treatment becomes visually-misleading", () => {
  const result = compareExecutiveStateVisibility({
    expectedMvpStatus: "risk",
    expectedMvpAttention: "critical",
    expectedUnresolved: false,
    hasStageObject: true,
    stageObjectMissingByDesign: false,
    observed: sampleObservedObject({
      objectId: "obj-capacity",
      status: "stable",
      attention: "normal",
    }),
  });
  assert.equal(result.status, "visually-misleading");
});

test("TEST 5 — weak treatment distinguished from missing treatment", () => {
  const weak = compareExecutiveStateVisibility({
    expectedMvpStatus: "risk",
    expectedMvpAttention: "critical",
    expectedUnresolved: false,
    hasStageObject: true,
    stageObjectMissingByDesign: false,
    observed: sampleObservedObject({
      objectId: "obj-capacity",
      status: "risk",
      attention: "critical",
      scale: 1.02,
      emissiveIntensity: 0.1,
      role: "normal",
    }),
  });
  const missing = compareExecutiveStateVisibility({
    expectedMvpStatus: "risk",
    expectedMvpAttention: "critical",
    expectedUnresolved: false,
    hasStageObject: true,
    stageObjectMissingByDesign: false,
    observed: sampleObservedObject({
      objectId: "obj-capacity",
      status: "risk",
      attention: "critical",
      role: "unrelated",
      scale: 0.78,
      opacity: 0.28,
      emissiveIntensity: 0.02,
    }),
  });
  assert.equal(weak.status, "visible-but-weak");
  assert.equal(missing.status, "computed-but-not-visible");
  assert.notEqual(weak.status, missing.status);
});

test("TEST 6 — unresolved state is not silently classified as normal", () => {
  const unresolved = compareExecutiveStateVisibility({
    expectedMvpStatus: undefined,
    expectedMvpAttention: undefined,
    expectedUnresolved: true,
    hasStageObject: false,
    stageObjectMissingByDesign: true,
    observed: undefined,
  });
  assert.equal(unresolved.status, "unresolved-as-designed");

  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  const costFindings = bundle.audit.findings.filter(
    (entry) => entry.subjectId === "cost",
  );
  assert.ok(costFindings.length >= 2);
  assert.ok(
    costFindings.every((entry) => entry.status === "unresolved-as-designed"),
  );
  assert.ok(
    !costFindings.some(
      (entry) =>
        (entry.observedState as { status?: string }).status === "stable" ||
        (entry.observedState as { status?: string }).status === "normal",
    ),
  );
});

test("TEST 7 — P2:6 anchor identity is preserved", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  assert.equal(bundle.audit.anchorObjectId, "obj-revenue");
  assert.equal(bundle.presentation.scene.focusedObjectId, "obj-revenue");

  const anchorFinding = bundle.audit.findings.find(
    (entry) => entry.dimension === "focus-anchor",
  )!;
  assert.equal(
    (anchorFinding.expectedState as { anchorObjectId?: string }).anchorObjectId,
    "obj-revenue",
  );
  assert.notEqual(anchorFinding.status, "visually-misleading");

  const compare = compareAnchorFocusVisibility({
    expectedAnchorId: "obj-revenue",
    observedFocusedId: "obj-revenue",
    observedAnchor: sampleObservedObject({
      objectId: "obj-revenue",
      role: "focused",
      focused: true,
      selected: true,
      scale: 1.32,
      emissiveIntensity: 0.45,
      targetPosition: [0, 0.42, 0],
    }),
    backgroundObjects: [
      sampleObservedObject({
        objectId: "obj-budget",
        role: "unrelated",
        opacity: 0.28,
        selected: false,
        focused: false,
      }),
      sampleObservedObject({
        objectId: "obj-capacity",
        role: "unrelated",
        opacity: 0.86,
        scale: 1.12,
        selected: false,
        focused: false,
        attention: "critical",
        status: "risk",
      }),
    ],
    retainedObjectIds: ["obj-capacity"],
  });
  assert.equal(compare.status, "visible-and-consistent");
});

test("TEST 8 — P2:7 canonical edge identity is preserved", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const connectionFindings = bundle.audit.findings.filter(
    (entry) => entry.dimension === "connections",
  );
  assert.ok(connectionFindings.length > 0);

  const customerRevenue = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  );
  assert.ok(customerRevenue);
  assert.equal(customerRevenue.sourceId, "obj-customer");
  assert.equal(customerRevenue.targetId, "obj-revenue");

  const compare = compareConnectionVisibility({
    expected: {
      connectionId: "rel-customer-revenue",
      sourceId: "obj-customer",
      targetId: "obj-revenue",
      isRevealed: true,
      isForeground: true,
      isBackground: false,
      impliesCausality: false,
    },
    observed: {
      connectionId: "rel-customer-revenue",
      sourceId: "obj-customer",
      targetId: "obj-revenue",
      present: true,
      emphasized: true,
      opacity: 0.78,
    },
  });
  assert.equal(compare.status, "visible-and-consistent");
});

test("TEST 9 — canonical non-edges remain non-edges", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });

  const hasRevenueCapacity = bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" && entry.targetId === "obj-revenue"),
  );
  assert.equal(hasRevenueCapacity, false);

  const preserved = assertCanonicalNonEdgesPreserved(
    bundle.presentation.scene.connections.map((entry) =>
      Object.freeze({
        connectionId: entry.id,
        sourceId: entry.sourceId,
        targetId: entry.targetId,
        present: true,
        emphasized: entry.emphasized,
        opacity: entry.opacity,
      }),
    ),
    DATA_REALITY_VISUAL_STAGE_CANONICAL_NON_EDGES,
  );
  assert.equal(preserved.status, "visible-and-consistent");
  assert.equal(preserved.fabricated.length, 0);

  const nonEdgeFinding = bundle.audit.findings.find(
    (entry) => entry.subjectId === "canonical-non-edges",
  )!;
  assert.equal(nonEdgeFinding.status, "visible-and-consistent");
  assert.notEqual(nonEdgeFinding.severity, "blocker");
});

test("TEST 10 — context remains 1-hop", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const contextFinding = bundle.audit.findings.find(
    (entry) => entry.dimension === "context",
  )!;
  assert.equal(
    (contextFinding.expectedState as { revealDepthHops?: number })
      .revealDepthHops,
    1,
  );
  assert.notEqual(contextFinding.status, "visually-misleading");

  const overDepth = compareContextRevealVisibility({
    revealDepthHops: 2,
    maxDirectContextItems: 8,
    expectedItems: [],
    observed: [],
  });
  assert.equal(overDepth.status, "visually-misleading");
});

test("TEST 11 — hidden overflow remains hidden", () => {
  const ok = compareContextRevealVisibility({
    revealDepthHops: 1,
    maxDirectContextItems: 8,
    expectedItems: [
      {
        contextId: "ctx-direct",
        revealRole: "direct-context",
        isDirect: true,
      },
      {
        contextId: "ctx-hidden",
        revealRole: "hidden",
        isDirect: false,
      },
    ],
    observed: [
      {
        contextId: "ctx-direct",
        subjectId: "ctx-direct",
        kind: "problem",
        role: "related",
        present: true,
        opacity: 0.9,
        scale: 1,
        focused: false,
      },
      {
        contextId: "ctx-hidden",
        subjectId: "ctx-hidden",
        kind: "scenario",
        role: "unrelated",
        present: true,
        opacity: 0.1,
        scale: 0.7,
        focused: false,
      },
    ],
  });
  assert.equal(ok.status, "visible-and-consistent");

  const leaked = compareContextRevealVisibility({
    revealDepthHops: 1,
    maxDirectContextItems: 8,
    expectedItems: [
      {
        contextId: "ctx-hidden",
        revealRole: "hidden",
        isDirect: false,
      },
    ],
    observed: [
      {
        contextId: "ctx-hidden",
        subjectId: "ctx-hidden",
        kind: "scenario",
        role: "related",
        present: true,
        opacity: 0.9,
        scale: 1,
        focused: false,
      },
    ],
  });
  assert.equal(leaked.status, "visually-misleading");
});

test("TEST 12 — audit ordering/output is deterministic", () => {
  const a = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  const b = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  assert.deepEqual(a.audit, b.audit);
  assert.deepEqual(
    a.audit.findings.map((entry) => entry.findingId),
    b.audit.findings.map((entry) => entry.findingId),
  );
});

test("E2E — baseline vs pressure produce observable Stage differences", () => {
  const baseline = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  const pressure = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
  });

  const baselineMarkers = extractObservedStageEvidenceFromPresentation(
    baseline.presentation,
  ).instrumentationMarkers.join("|");
  const pressureMarkers = extractObservedStageEvidenceFromPresentation(
    pressure.presentation,
  ).instrumentationMarkers.join("|");
  assert.notEqual(baselineMarkers, pressureMarkers);

  const capacityBaseline = baseline.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const capacityPressure = pressure.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.notEqual(capacityBaseline.status, capacityPressure.status);
  assert.notEqual(capacityBaseline.attention, capacityPressure.attention);
});

test("E2E — interaction flow overview → focus → clear preserves auditability", () => {
  const overview = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
  });
  const focused = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });

  assert.equal(overview.presentation.scene.mode, "overview");
  assert.equal(focused.presentation.scene.mode, "focus");
  assert.equal(focused.audit.anchorObjectId, "obj-revenue");
  assert.equal(cleared.presentation.scene.mode, "overview");
  assert.equal(cleared.presentation.scene.focusedObjectId, null);

  const attentionCompare = compareAttentionVisibility({
    expectedAttention: "critical",
    retainAttention: true,
    isAnchor: false,
    observed: sampleObservedObject({
      objectId: "obj-capacity",
      attention: "critical",
      role: "unrelated",
      opacity: 0.58,
      scale: 0.88,
      emissiveIntensity: 0.18,
      labelProminence: "reduced",
    }),
  });
  assert.ok(
    attentionCompare.status === "visible-but-weak" ||
      attentionCompare.status === "visible-and-consistent",
  );
});

test("Summary grouping and severity aggregation", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const summary = summarizeVisualRealityAudit(
    bundle.audit.findings,
    DATA_REALITY_VISUAL_STAGE_AUDIT_SUBJECTS.length,
  );
  assert.equal(summary.totalSubjectsAudited, 6);
  assert.equal(
    summary.totalFindings,
    bundle.audit.findings.length,
  );
  assert.equal(
    summary.visibleAndConsistentCount +
      summary.visibleButWeakCount +
      summary.computedButNotVisibleCount +
      summary.visuallyMisleadingCount +
      summary.unresolvedAsDesignedCount +
      summary.notApplicableCount,
    summary.totalFindings,
  );
  assert.equal(
    summary.blockerCount +
      summary.highCount +
      summary.mediumCount +
      summary.lowCount,
    summary.totalFindings,
  );

  const grouped = groupVisualRealityFindingsByDimension(bundle.audit.findings);
  assert.ok(grouped["object-presence"].length > 0);
  assert.ok(grouped["executive-state"].length > 0);
  assert.ok(grouped.attention.length > 0);
  assert.ok(grouped["focus-anchor"].length > 0);
  assert.ok(grouped.connections.length > 0);
  assert.ok(grouped.context.length > 0);
  assert.ok(grouped.density.length > 0);
  assert.ok(grouped["camera-spatial"].length > 0);
});

test("Source boundary — audit does not recompute upstream engines", () => {
  const source = readFileSync(
    join(here, "dataRealityVisualStageAudit.ts"),
    "utf8",
  );
  assert.equal(source.includes("computeNexoraKPIs"), false);
  assert.equal(source.includes("resolveObjectExecutiveStates"), false);
  assert.equal(
    source.includes("resolveDataRealityAwareSceneChoreography("),
    false,
  );
  assert.equal(
    source.includes("resolveDataRealityAwareConnectionsContext("),
    false,
  );
  assert.ok(source.includes("certifiesHumanVisualPerception: false"));
});

test("auditDataRealityVisualStage freezes output and retains readiness", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  assert.equal(
    bundle.audit.identity.readiness,
    "ReadyForVisualStateValidation",
  );
  assert.equal(bundle.audit.provenance.auditCertified, false);
  assert.ok(Array.isArray(bundle.audit.knownLimitations));
  assert.ok(
    bundle.audit.knownLimitations.some((entry) =>
      entry.includes("human visual perception"),
    ),
  );

  assert.throws(() => {
    (bundle.audit.findings as VisualRealityAuditFinding[]).push(
      bundle.audit.findings[0]!,
    );
  });
});
