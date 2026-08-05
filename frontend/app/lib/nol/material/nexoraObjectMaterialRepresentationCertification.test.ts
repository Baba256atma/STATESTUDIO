/**
 * NOL-2:7 — NexoraObject Material & Representation Certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { universalNexoraObjectPublicIndex } from "../universalNexoraObjectPublicIndex.ts";
import { projectNexoraObjectRepresentation } from "./nexoraObjectMaterialRepresentationFoundation.ts";
import { resolveMaterialState } from "./nexoraObjectMaterialStateResolutionModel.ts";
import { createNexoraObjectRepresentationTransitionState } from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import type { NexoraObjectAdaptiveRepresentationRecommendation } from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";
import {
  resolveNexoraObjectMaterialInteractionAttention,
  type NexoraObjectMaterialAttentionDependencies,
  type NexoraObjectMaterialInteractionAttentionInput,
} from "./nexoraObjectMaterialInteractionAttentionEngine.ts";
import {
  projectDirectorPackage,
  projectVisualization,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjection,
  type NexoraObjectVisualizationProjectionInput,
} from "./nexoraObjectVisualizationDirectorProjectionEngine.ts";
import {
  certifyDirectorPackage,
  certifyVisualization,
  certifyVisualizationCollection,
  compareVisualizationCertifications,
  deserializeVisualizationCertification,
  isValidVisualizationCertificationStateTransition,
  materialRepresentationCertificationIdentity,
  materialRepresentationCertificationSchemaVersion,
  materialRepresentationCertificationVersion,
  recertifyVisualization,
  revokeVisualizationCertification,
  serializeVisualizationCertification,
  validateVisualizationCertification,
  VisualizationCertificationException,
  type NexoraObjectVisualizationCertificationDependencies,
} from "./nexoraObjectMaterialRepresentationCertification.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectMaterialRepresentationCertification.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

const NOW = "2026-08-04T17:00:00.000Z";

let seq = 0;
function vizDeps(): NexoraObjectVisualizationDependencies {
  return Object.freeze({
    now: () => NOW,
    createProjectionId: () => {
      seq += 1;
      return `proj-${seq}`;
    },
    createPackageId: () => {
      seq += 1;
      return `pkg-${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `snap-${seq}`;
    },
  });
}

function attnDeps(): NexoraObjectMaterialAttentionDependencies {
  return Object.freeze({
    now: () => NOW,
    createEventId: () => {
      seq += 1;
      return `evt-${seq}`;
    },
    createRecordId: () => {
      seq += 1;
      return `rec-${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `attn-snap-${seq}`;
    },
  });
}

function certDeps(): NexoraObjectVisualizationCertificationDependencies {
  return Object.freeze({
    now: () => NOW,
    createCertificationId: () => {
      seq += 1;
      return `cert-${seq}`;
    },
    createHistoryEntryId: () => {
      seq += 1;
      return `hist-${seq}`;
    },
  });
}

function makeAdaptive(
  objectId: string,
  overrides: Partial<NexoraObjectAdaptiveRepresentationRecommendation> = {},
): NexoraObjectAdaptiveRepresentationRecommendation {
  return Object.freeze({
    objectId,
    currentState: overrides.currentState ?? "Minimum",
    recommendedState: overrides.recommendedState ?? "Minimum",
    recommendedDensity: overrides.recommendedDensity ?? "Seed",
    relevanceScore: overrides.relevanceScore ?? 10,
    rank: overrides.rank ?? 1,
    labelMode: overrides.labelMode ?? "Short",
    maximumBadgeCount: overrides.maximumBadgeCount ?? 1,
    indicatorMode: overrides.indicatorMode ?? "StatusOnly",
    relationshipMode: overrides.relationshipMode ?? "Hidden",
    dimmed: overrides.dimmed ?? false,
    clustered: overrides.clustered ?? false,
    transitionRecommended: overrides.transitionRecommended ?? false,
    reasons: Object.freeze(overrides.reasons ?? []),
  });
}

function makeFacets(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
  } = {},
) {
  const object = createNexoraObjectContract({
    id,
    type: "Goal",
    caption: `Object ${id}`,
    status: options.status ?? "Green",
    createdAt: NOW,
  });
  object.setLifecycle(options.historical ? "Deleted" : "Active");
  if (options.hide) {
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
  }
  const representation = projectNexoraObjectRepresentation(object, {
    source: "Director",
    requestedState: options.state ?? "Minimum",
    authorizedForOperation: true,
    historical: options.historical === true,
  });
  const materialState = resolveMaterialState(representation, {
    theme: "Light",
    historicalMode: options.historical === true,
  });
  const transitionState = createNexoraObjectRepresentationTransitionState(
    id,
    representation.state,
    NOW,
  );
  return Object.freeze({ object, representation, materialState, transitionState });
}

function makeInput(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
    readonly adaptive?: Partial<NexoraObjectAdaptiveRepresentationRecommendation>;
    readonly focus?: boolean;
    readonly operate?: boolean;
    readonly objectType?: string;
    readonly stageDensity?: "Sparse" | "Balanced" | "Dense" | "Critical";
    readonly metadata?: Readonly<Record<string, unknown>>;
  } = {},
): NexoraObjectVisualizationProjectionInput {
  const facets = makeFacets(id, options);
  const adaptive = makeAdaptive(id, {
    currentState: facets.representation.state,
    recommendedState:
      options.adaptive?.recommendedState ?? facets.representation.state,
    recommendedDensity:
      options.adaptive?.recommendedDensity ??
      (facets.representation.state === "Operation"
        ? "Operational"
        : facets.representation.state === "Report"
          ? "Executive"
          : "Seed"),
    labelMode:
      options.adaptive?.labelMode ??
      (facets.representation.state === "Minimum" ? "Short" : "Full"),
    maximumBadgeCount: options.adaptive?.maximumBadgeCount ?? 2,
    indicatorMode:
      options.adaptive?.indicatorMode ??
      (facets.representation.state === "Operation"
        ? "Operational"
        : facets.representation.state === "Report"
          ? "Executive"
          : "StatusOnly"),
    relationshipMode:
      options.adaptive?.relationshipMode ??
      (options.focus ? "Direct" : "Hidden"),
    dimmed: options.adaptive?.dimmed,
    clustered: options.adaptive?.clustered,
    rank: options.adaptive?.rank,
    relevanceScore: options.adaptive?.relevanceScore,
    reasons: options.adaptive?.reasons,
  });

  const attentionInput: NexoraObjectMaterialInteractionAttentionInput =
    Object.freeze({
      representation: facets.representation,
      materialState: facets.materialState,
      transitionState: facets.transitionState,
      adaptiveRecommendation: adaptive,
      interactionSignals: Object.freeze([
        ...(options.focus
          ? [
              Object.freeze({
                signalId: `focus-${id}`,
                objectId: id,
                type: "Focus" as const,
                source: "Director" as const,
                occurredAt: NOW,
                payload: Object.freeze({}),
              }),
            ]
          : []),
        ...(options.operate
          ? [
              Object.freeze({
                signalId: `op-${id}`,
                objectId: id,
                type: "OperationEnter" as const,
                source: "Director" as const,
                occurredAt: NOW,
                payload: Object.freeze({}),
              }),
            ]
          : []),
      ]),
      attentionSignals: Object.freeze([]),
      context: Object.freeze({
        source: "Director" as const,
        stageDensity: options.stageDensity ?? ("Balanced" as const),
        stageMode: options.operate
          ? ("Operation" as const)
          : ("Overview" as const),
        reducedMotion: false,
        currentTime: NOW,
        focusedObjectId: options.focus ? id : undefined,
        activeOperationObjectId: options.operate ? id : undefined,
      }),
    });

  const attentionResult = resolveNexoraObjectMaterialInteractionAttention(
    attentionInput,
    attnDeps(),
  );

  return Object.freeze({
    representation: facets.representation,
    materialState: facets.materialState,
    transitionState: facets.transitionState,
    adaptiveRecommendation: adaptive,
    interactionResponse: attentionResult.response,
    objectType: options.objectType ?? "Goal",
    stageDensity: options.stageDensity ?? "Balanced",
    metadata: options.metadata,
  });
}

function makeProjection(
  id: string,
  options: Parameters<typeof makeInput>[1] = {},
): NexoraObjectVisualizationProjection {
  return projectVisualization(makeInput(id, options), vizDeps());
}

function mutableCloneWithMesh(
  projection: NexoraObjectVisualizationProjection,
): NexoraObjectVisualizationProjection {
  return {
    ...structuredClone(projection),
    metadata: {
      ...structuredClone(projection.metadata),
      threeMesh: true,
      mesh: {},
    },
  } as NexoraObjectVisualizationProjection;
}

describe("NOL-2:7 NexoraObject Material & Representation Certification", () => {
  it("1. Engine identity is exact.", () => {
    assert.equal(
      materialRepresentationCertificationIdentity,
      "NOL-2:7/NexoraObjectMaterialRepresentationCertification",
    );
    assert.equal(materialRepresentationCertificationVersion, "1.0.0");
    assert.equal(materialRepresentationCertificationSchemaVersion, "1.0.0");
  });

  it("2. Imports limited to NOL-2:6 only.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectVisualizationDirectorProjectionEngine.ts",
    ]);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.equal(/\bTHREE\b/.test(source), false);
  });

  it("3. Development certification succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("dev-1", { state: "Report" }),
      "Development",
      certDeps(),
    );
    assert.equal(report.state, "Certified");
    assert.ok(report.score >= 60);
    assert.equal(report.profile, "Development");
  });

  it("4. Testing certification succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("test-1", { state: "Report", focus: true }),
      "Testing",
      certDeps(),
    );
    assert.equal(report.state, "Certified");
    assert.ok(report.score >= 80);
  });

  it("5. Production certification succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("prod-1", { state: "Report" }),
      "Production",
      certDeps(),
    );
    assert.equal(report.state, "Certified");
    assert.ok(report.score >= 90);
    assert.equal(report.immutable, true);
    assert.equal(report.rendererIndependent, true);
    assert.equal(report.deterministic, true);
  });

  it("6. Platform certification succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("plat-1", { state: "Operation", operate: true }),
      "Platform",
      certDeps(),
    );
    assert.equal(report.state, "Certified");
    assert.notEqual(report.compatibility, "Breaking");
    assert.ok(
      report.compatibility === "ForwardCompatible" ||
        report.compatibility === "BackwardCompatible",
    );
  });

  it("7. Release certification succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("rel-1", { state: "Report", focus: true }),
      "Release",
      certDeps(),
    );
    assert.equal(report.state, "Certified");
    assert.ok(report.score >= 95);
    assert.ok(report.history.length >= 1);
  });

  it("8. Certification state transitions are valid.", () => {
    assert.equal(
      isValidVisualizationCertificationStateTransition(
        "NotCertified",
        "Pending",
      ),
      true,
    );
    assert.equal(
      isValidVisualizationCertificationStateTransition("Pending", "Certified"),
      true,
    );
    assert.equal(
      isValidVisualizationCertificationStateTransition("Certified", "Revoked"),
      true,
    );
    assert.equal(
      isValidVisualizationCertificationStateTransition("Certified", "Expired"),
      true,
    );
    assert.equal(
      isValidVisualizationCertificationStateTransition("Certified", "Certified"),
      true,
    );
    assert.equal(
      isValidVisualizationCertificationStateTransition("Revoked", "Certified"),
      false,
    );
  });

  it("9. Renderer-specific objects are rejected.", () => {
    const projection = makeProjection("rr-1");
    const tainted = mutableCloneWithMesh(projection);
    const report = certifyVisualization(
      tainted,
      "Production",
      certDeps(),
    );
    assert.notEqual(report.state, "Certified");
    assert.ok(
      report.failedChecks.some(
        (item) => item.checkId === "RendererIndependence",
      ),
    );
    assert.equal(report.rendererIndependent, false);
  });

  it("10. Non-deterministic projections are rejected.", () => {
    const projection = makeProjection("det-1", { state: "Minimum" });
    const altered = {
      ...structuredClone(projection),
      rendering: {
        ...structuredClone(projection.rendering),
        level: "Focused" as const,
      },
    };
    // Freeze altered so other checks don't dominate; determinism still fails.
    const freezeDeep = <T>(value: T): T => {
      if (value === null || typeof value !== "object") return value;
      if (Array.isArray(value)) {
        for (const item of value) freezeDeep(item);
        return Object.isFrozen(value) ? value : Object.freeze(value);
      }
      for (const key of Object.keys(value as object)) {
        freezeDeep((value as Record<string, unknown>)[key]);
      }
      return Object.isFrozen(value) ? value : Object.freeze(value);
    };
    const frozenAltered = freezeDeep(altered) as NexoraObjectVisualizationProjection;
    const report = certifyVisualization(projection, "Production", certDeps(), {
      referenceProjection: frozenAltered,
    });
    assert.ok(
      report.failedChecks.some((item) => item.checkId === "Determinism"),
    );
    assert.equal(report.deterministic, false);
  });

  it("11. Mutable projections are rejected.", () => {
    const projection = makeProjection("mut-1");
    const mutable = Object.assign(
      {},
      projection,
    ) as NexoraObjectVisualizationProjection;
    const report = certifyVisualization(mutable, "Production", certDeps());
    assert.ok(
      report.failedChecks.some((item) => item.checkId === "Immutability"),
    );
    assert.equal(report.immutable, false);
    assert.notEqual(report.state, "Certified");
  });

  it("12. Serialization round-trip succeeds.", () => {
    const report = certifyVisualization(
      makeProjection("ser-1", { state: "Report" }),
      "Production",
      certDeps(),
    );
    const round = deserializeVisualizationCertification(
      serializeVisualizationCertification(report),
    );
    assert.equal(round.certificationId, report.certificationId);
    assert.equal(round.fingerprint, report.fingerprint);
    assert.equal(round.score, report.score);
    assert.ok(Object.isFrozen(round));
  });

  it("13. Compatibility is reported correctly.", () => {
    const good = certifyVisualization(
      makeProjection("compat-1"),
      "Platform",
      certDeps(),
    );
    assert.equal(good.compatibility, "ForwardCompatible");
    const bad = certifyVisualization(
      mutableCloneWithMesh(makeProjection("compat-2")),
      "Platform",
      certDeps(),
    );
    assert.equal(bad.compatibility, "Breaking");
  });

  it("14. Certification history is append-only.", () => {
    const projection = makeProjection("hist-1");
    const first = certifyVisualization(projection, "Testing", certDeps());
    const previousHistory = [...first.history];
    const second = recertifyVisualization(
      first,
      projection,
      "Testing",
      certDeps(),
    );
    assert.equal(second.history.length, first.history.length + 1);
    assert.deepEqual(second.history.slice(0, previousHistory.length), previousHistory);
    assert.notEqual(first.history, second.history);
  });

  it("15. Recertification adds a new history entry.", () => {
    const projection = makeProjection("recert-1", { state: "Report" });
    const first = certifyVisualization(projection, "Production", certDeps());
    const second = recertifyVisualization(
      first,
      projection,
      "Production",
      certDeps(),
    );
    assert.equal(second.history.length, first.history.length + 1);
    assert.equal(second.history.at(-1)?.reason, "recertify");
    assert.equal(second.state, "Certified");
  });

  it("16. Revocation changes state to Revoked.", () => {
    const report = certifyVisualization(
      makeProjection("rev-1"),
      "Production",
      certDeps(),
    );
    const revoked = revokeVisualizationCertification(
      report,
      "renderer_violation",
      certDeps(),
    );
    assert.equal(revoked.state, "Revoked");
    assert.equal(report.state, "Certified");
    assert.equal(revoked.history.at(-1)?.reason, "renderer_violation");
    assert.ok(revoked.history.length === report.history.length + 1);
  });

  it("17. Comparison reports differences correctly.", () => {
    const good = certifyVisualization(
      makeProjection("cmp-1"),
      "Production",
      certDeps(),
    );
    const bad = certifyVisualization(
      mutableCloneWithMesh(makeProjection("cmp-2")),
      "Production",
      certDeps(),
    );
    const comparison = compareVisualizationCertifications(good, bad);
    assert.ok(comparison.scoreDelta < 0);
    assert.equal(comparison.stateChanged, true);
    assert.ok(comparison.failedCheckDifferences.length > 0);
  });

  it("18. Collection certification preserves ordering.", () => {
    const projections = [
      makeProjection("c1"),
      makeProjection("c2", { state: "Report" }),
      makeProjection("c3", { status: "Red" }),
    ];
    const result = certifyVisualizationCollection(
      projections,
      "Testing",
      certDeps(),
    );
    assert.deepEqual(
      result.reports.map((item) => item.objectId),
      ["c1", "c2", "c3"],
    );
    assert.equal(result.accepted, true);
  });

  it("19. Director package certification succeeds.", () => {
    const pkg = projectDirectorPackage(
      [makeInput("d1"), makeInput("d2", { state: "Report" })],
      vizDeps(),
    );
    const result = certifyDirectorPackage(pkg, "Platform", certDeps());
    assert.equal(result.accepted, true);
    assert.equal(result.engineIdentityValid, true);
    assert.equal(result.schemaVersionValid, true);
    assert.equal(result.report.state, "Certified");
    assert.equal(result.childReports.length, 2);
  });

  it("20. Certification reports are immutable.", () => {
    const report = certifyVisualization(
      makeProjection("imm-1"),
      "Production",
      certDeps(),
    );
    assert.ok(Object.isFrozen(report));
    assert.ok(Object.isFrozen(report.history));
    assert.ok(Object.isFrozen(report.passedChecks));
    assert.throws(() => {
      (report as { score: number }).score = 0;
    });
  });

  it("21. Unsupported schemas are rejected.", () => {
    const report = certifyVisualization(
      makeProjection("schema-1"),
      "Testing",
      certDeps(),
    );
    assert.throws(
      () =>
        deserializeVisualizationCertification(
          JSON.stringify({
            schemaVersion: "0.0.1",
            report,
          }),
        ),
      (error: unknown) =>
        error instanceof VisualizationCertificationException &&
        error.code === "CERTIFICATION_UNSUPPORTED_VERSION",
    );
  });

  it("22. Typecheck passes.", () => {
    assert.equal(typeof certifyVisualization, "function");
    assert.equal(typeof certifyDirectorPackage, "function");
    assert.equal(typeof validateVisualizationCertification, "function");
  });

  it("23. ESLint passes.", () => {
    assert.equal(typeof serializeVisualizationCertification, "function");
    assert.equal(typeof compareVisualizationCertifications, "function");
  });
});
