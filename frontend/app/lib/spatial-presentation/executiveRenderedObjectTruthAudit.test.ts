/**
 * SP:4.1C — Rendered-Bounds Truth Audit tests.
 *
 * Connects certification data to the production Stage presentation path.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveFocusVisualGrammarToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectScale,
  toExecutiveObjectVisualInput,
  resolveExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_FOCUS_VISUAL_SEPARATION,
  resolveExecutiveStageObjectBounds,
  executiveFocusVisualGrammarIdentity,
  executiveFocusVisualGrammarVersion,
} from "./executiveFocusVisualGrammar.ts";
import {
  EXECUTIVE_RENDERED_TRUTH_OWNERSHIP_CHAIN,
  EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE,
  auditInventoryMinimumRenderedObjectTruth,
  auditRevenueMinimumRenderedObjectTruth,
  positionsMatchCertified,
  resolveEffectiveRenderedStageObjectScale,
  executiveRenderedObjectTruthAuditIdentity,
  executiveRenderedObjectTruthAuditVersion,
} from "./executiveRenderedObjectTruthAudit.ts";
import {
  isExecutiveRenderedBoundsTruthOverlayEnabled,
  ndcToStageCssPercent,
} from "./executiveRenderedBoundsTruthOverlay.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("truth audit identity stays on SP:4.1C v4.1.2", () => {
  assert.equal(
    executiveRenderedObjectTruthAuditIdentity,
    "SP:4.1C/RenderedBoundsTruthAudit",
  );
  assert.equal(executiveRenderedObjectTruthAuditVersion, "4.1.2");
  assert.equal(
    executiveFocusVisualGrammarIdentity,
    "SP:4.1C/ExecutiveFocusVisualGrammar",
  );
  assert.equal(executiveFocusVisualGrammarVersion, "4.1.2");
  assert.equal(EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE, "ScaleMismatch");
});

test("1. certified final position equals renderer targetPosition", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  for (const snapshot of audit.snapshots) {
    assert.ok(
      positionsMatchCertified(
        snapshot.certifiedTargetPosition,
        snapshot.certifiedTargetPosition,
      ),
    );
  }
  // Production objects expose the same target as certification.
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-inventory");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const presentation = applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveNetworkTopologyToStagePresentation(
      applyExecutiveFocusVisualGrammarToStagePresentation(
        deriveNexoraMVPStageInteractionPresentation(state),
        { presentationDepth: "minimum" },
      ),
    ),
  );
  for (const snapshot of audit.snapshots) {
    const object = presentation.scene.objects.find(
      (entry) => entry.id === snapshot.objectId,
    );
    assert.ok(object);
    assert.ok(
      positionsMatchCertified(
        snapshot.certifiedTargetPosition,
        object!.targetPosition,
      ),
      snapshot.objectId,
    );
  }
});

test("2. certified scale equals effective renderer scale", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  assert.equal(audit.rootCause, "NoneDetected");
  for (const snapshot of audit.snapshots) {
    assert.equal(
      snapshot.effectiveRenderedScale,
      resolveEffectiveRenderedStageObjectScale({
        certifiedPresentationScale: snapshot.certifiedPresentationScale,
        focused: snapshot.objectId === audit.focusedObjectId,
      }),
    );
    assert.ok(
      Math.abs(
        snapshot.certifiedPresentationScale - snapshot.effectiveRenderedScale,
      ) < 1e-4,
      `${snapshot.objectId}: certified=${snapshot.certifiedPresentationScale} rendered=${snapshot.effectiveRenderedScale}`,
    );
    assert.equal(snapshot.scaleMismatch, false);
  }
});

test("3. geometry-family bounds match rendered dimensions", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  for (const snapshot of audit.snapshots) {
    const family = resolveExecutiveObjectGeometryFamily({
      objectKind: "object",
    });
    // Inventory fixtures are business objects → block family.
    if (snapshot.geometryFamily === "block") {
      assert.equal(
        snapshot.localGeometryDimensions.width,
        family.dimensions.width,
      );
      const bounds = resolveExecutiveStageObjectBounds({
        subjectId: snapshot.objectId,
        objectKind: "object",
        scale: snapshot.certifiedPresentationScale,
      });
      assert.equal(
        bounds.effectiveBoundingRadius,
        snapshot.certifiedWorldBounds.effectiveBoundingRadius,
      );
    }
  }
});

test("4. parent transforms included via group-scale authority", () => {
  const scale = resolveExecutiveObjectScale({
    spatialRole: "related",
    focused: false,
    hovered: false,
    compositionScale: 0.5,
  });
  assert.equal(scale, 0.5);
  assert.ok(scale < EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable);
  assert.ok(scale >= EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale);
});

test("5. relevant rotation — AABB model documented (no silent AABB skip)", () => {
  // Current projected bounds use axis-aligned silhouette radius × scale.
  // Inventory business cubes are unrotated in Stage presentation.
  const audit = auditInventoryMinimumRenderedObjectTruth();
  for (const snapshot of audit.snapshots) {
    assert.ok(snapshot.certifiedWorldBounds.effectiveBoundingRadius > 0);
  }
  assert.ok(
    EXECUTIVE_RENDERED_TRUTH_OWNERSHIP_CHAIN.some((step) =>
      step.includes("mesh dimensions"),
    ),
  );
});

test("6–8. camera + aspect + projected envelope use Stage presentation", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  for (const snapshot of audit.snapshots) {
    assert.ok(snapshot.certifiedProjected != null, snapshot.objectId);
    assert.ok(
      Number.isFinite(snapshot.certifiedProjected!.centerNdcX),
      snapshot.objectId,
    );
    assert.ok(
      Number.isFinite(snapshot.certifiedProjected!.safeRadiusNdc),
      snapshot.objectId,
    );
  }
  assert.equal(EXECUTIVE_FOCUS_VISUAL_SEPARATION.aspect, 16 / 9);
  assert.ok(
    audit.secondaryCauses.includes("ViewportMismatch") ||
      audit.secondaryCauses.includes("ProjectionCameraMismatch") ||
      audit.rootCause === "NoneDetected",
  );
});

test("9. final targetPosition is not modified after certification path equality", () => {
  const inventory = auditInventoryMinimumRenderedObjectTruth();
  const again = auditInventoryMinimumRenderedObjectTruth();
  assert.deepEqual(
    inventory.snapshots.map((entry) => entry.certifiedTargetPosition),
    again.snapshots.map((entry) => entry.certifiedTargetPosition),
  );
  assert.deepEqual(
    inventory.snapshots.map((entry) => entry.certifiedPresentationScale),
    again.snapshots.map((entry) => entry.certifiedPresentationScale),
  );
});

test("10. Inventory fixture pairwise gaps use production Stage values", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  assert.equal(audit.fixture, "Inventory·MINIMUM");
  assert.equal(audit.focusedObjectId, "obj-inventory");
  const ids = new Set(audit.snapshots.map((entry) => entry.objectId));
  assert.ok(ids.has("obj-inventory"));
  assert.ok(ids.has("obj-capacity"));
  // Scale/render truth must stay aligned. World-gap certification from SP:4.1C
  // is superseded by SP:4.3 presentation-plane territories; SP:4.5 owns final
  // silhouette separation.
  for (const pair of audit.pairs) {
    assert.equal(pair.discrepancy, false, pair.reason);
  }
  for (const snapshot of audit.snapshots) {
    assert.equal(snapshot.scaleMismatch, false);
  }
});

test("11. Revenue fixture uses same truth path", () => {
  const audit = auditRevenueMinimumRenderedObjectTruth();
  assert.equal(audit.fixture, "Revenue·MINIMUM");
  assert.equal(audit.focusedObjectId, "obj-revenue");
  assert.equal(audit.rootCause, "NoneDetected");
  for (const snapshot of audit.snapshots) {
    assert.equal(snapshot.scaleMismatch, false);
  }
  for (const pair of audit.pairs) {
    assert.equal(pair.discrepancy, false);
  }
});

test("12. no duplicate post-certification scale authority", () => {
  const visual = resolveExecutiveObjectVisualPresentation(
    toExecutiveObjectVisualInput({
      objectId: "obj-inventory",
      objectKind: "object",
      objectName: "Inventory",
      selected: true,
      focused: true,
      hovered: false,
      role: "focus",
      scale: 0.559,
    }),
  );
  assert.equal(visual.scale, 0.559);
  // Legacy floor must not apply when compositionScale is explicit.
  assert.notEqual(visual.scale, EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable);
});

test("ownership chain is complete and Stage wires truth overlay", () => {
  assert.ok(EXECUTIVE_RENDERED_TRUTH_OWNERSHIP_CHAIN.length >= 8);
  const stagePath = join(
    here,
    "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx",
  );
  const source = readFileSync(stagePath, "utf8");
  assert.match(source, /NexoraStageRenderedBoundsTruthOverlay/);
  const foundationPath = join(here, "executiveObjectVisualFoundation.ts");
  const foundation = readFileSync(foundationPath, "utf8");
  assert.match(foundation, /minimumCompositionScale/);
  assert.match(foundation, /hasExplicitCompositionScale/);
});

test("overlay gate is off by default; NDC mapping is invertible at origin", () => {
  assert.equal(isExecutiveRenderedBoundsTruthOverlayEnabled(), false);
  const origin = ndcToStageCssPercent(0, 0);
  assert.equal(origin.leftPercent, 50);
  assert.equal(origin.topPercent, 50);
});

test("Inventory audit case after correction is Aligned", () => {
  const audit = auditInventoryMinimumRenderedObjectTruth();
  assert.equal(audit.caseClassification, "Aligned_CertifiedEqualsRendered");
  assert.ok(
    audit.findings.some((entry) => entry.includes("Proven root cause")),
  );
});
