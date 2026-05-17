/**
 * D7:2:1 — Operational universe topology tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
  freezeOperationalUniverseTopologySnapshot,
} from "./operationalUniverseTopologyEngine.ts";
import { classifyTopologyObject, classifyTopologyObjects } from "./operationalUniverseClassification.ts";
import {
  buildCrossDomainDependencyChannels,
  inferCrossRegionRelationships,
} from "./crossDomainDependencyModel.ts";
import { buildTopologyContentFingerprint, detectRegionDependencyCycle, guardBuildTopology } from "./topologyGuards.ts";
import { buildExecutiveTopologySemantics } from "./executiveTopologySemantics.ts";

function sceneFixture(): SceneJson {
  return {
    scene: {
      objects: [
        {
          id: "plant_a",
          label: "Manufacturing Plant A",
          domain: "manufacturing",
          category: "production",
          dependencies: ["warehouse_hub"],
        },
        {
          id: "warehouse_hub",
          label: "Central Warehouse",
          domain: "logistics",
          category: "distribution",
          dependencies: ["customer_ops"],
        },
        {
          id: "customer_ops",
          label: "Customer Operations",
          domain: "customer",
          category: "service",
        },
        {
          id: "finance_core",
          label: "Finance Core",
          domain: "finance",
          category: "treasury",
        },
      ],
      loops: [
        {
          id: "flow_1",
          type: "resource",
          edges: [{ from: "plant_a", to: "warehouse_hub" }],
        },
      ],
    },
  };
}

test("deterministic topology fingerprints", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const input = { topologyId: "topo-det", objects };
  const r1 = buildOperationalUniverseTopology(input);
  const r2 = buildOperationalUniverseTopology(input);
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.topology.fingerprint, r2.snapshot.topology.fingerprint);
});

test("region classification is explainable and deterministic", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const classes = classifyTopologyObjects({ objects });
  const plant = classes.find((c) => c.objectId === "plant_a");
  const finance = classes.find((c) => c.objectId === "finance_core");
  assert.ok(plant);
  assert.equal(plant!.regionId, "manufacturing");
  assert.ok(finance);
  assert.equal(finance!.regionId, "finance");
  assert.ok(plant!.rationale.length > 0);
});

test("cross-domain dependency mapping across regions", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const classifications = classifyTopologyObjects({ objects });
  const relationships = inferCrossRegionRelationships(classifications, objects);
  assert.ok(
    relationships.some(
      (r) => r.sourceRegionId === "manufacturing" && r.targetRegionId === "logistics"
    )
  );
  const channels = buildCrossDomainDependencyChannels(relationships);
  assert.ok(channels.length >= 1);
});

test("replay-safe frozen topology snapshot", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const built = buildOperationalUniverseTopology({ topologyId: "topo-freeze", objects });
  assert.ok(built.ok);
  if (!built.ok) return;
  const frozen = freezeOperationalUniverseTopologySnapshot(built.snapshot);
  assert.throws(() => {
    (frozen.topology as { topologyId: string }).topologyId = "mutated";
  });
  assert.equal(frozen.topology.fingerprint, built.snapshot.topology.fingerprint);
});

test("rejects circular regional dependencies", () => {
  const relationships = [
    {
      relationshipId: "r1",
      sourceRegionId: "a",
      targetRegionId: "b",
      relationshipType: "dependency" as const,
      intensity: 0.8,
    },
    {
      relationshipId: "r2",
      sourceRegionId: "b",
      targetRegionId: "c",
      relationshipType: "dependency" as const,
      intensity: 0.8,
    },
    {
      relationshipId: "r3",
      sourceRegionId: "c",
      targetRegionId: "a",
      relationshipType: "dependency" as const,
      intensity: 0.8,
    },
  ];
  const cycle = detectRegionDependencyCycle(relationships);
  assert.ok(cycle);
  const guard = guardBuildTopology({
    topologyId: "topo-cycle",
    objects: [{ objectId: "o1" }],
    relationships,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "circular_dependency");
});

test("rejects duplicate topology fingerprint", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const first = buildOperationalUniverseTopology({ topologyId: "topo-dup", objects });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildTopologyContentFingerprint({
    objectIds: objects.map((o) => o.objectId),
    relationshipKeys: first.snapshot.topology.crossDomainRelationships.map((r) => r.relationshipId),
  });
  const second = buildOperationalUniverseTopology({
    topologyId: "topo-dup-2",
    objects,
    priorTopologyFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_topology");
});

test("scene extraction does not mutate sceneJson", () => {
  const scene = sceneFixture();
  const frozen = JSON.stringify(scene);
  extractTopologyObjectsFromScene(scene);
  assert.equal(JSON.stringify(scene), frozen);
});

test("executive topology semantics are readable", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const built = buildOperationalUniverseTopology({ topologyId: "topo-nar", objects });
  assert.ok(built.ok);
  if (!built.ok) return;
  assert.match(built.snapshot.semantics.universeHeadline, /operational|linked|universe|Manufacturing|Logistics/i);
  assert.ok(!built.snapshot.semantics.universeHeadline.includes("Node graph"));
  const manual = buildExecutiveTopologySemantics({
    regions: built.snapshot.topology.operationalRegions,
    relationships: built.snapshot.topology.crossDomainRelationships,
    channels: built.snapshot.topology.dependencyChannels,
  });
  assert.ok(manual.dependencySummaries.length > 0);
});

test("relationship integrity and panel contract", () => {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const built = buildOperationalUniverseTopology({ topologyId: "topo-panel", objects });
  assert.ok(built.ok);
  if (!built.ok) return;
  assert.ok(built.panelContract.regionCount >= 2);
  assert.ok(built.panelContract.regions.every((r) => r.objectCount >= 0));
  for (const rel of built.snapshot.topology.crossDomainRelationships) {
    assert.ok(rel.sourceRegionId);
    assert.ok(rel.targetRegionId);
    assert.ok(rel.intensity >= 0 && rel.intensity <= 1);
  }
});

test("region override classification", () => {
  const cls = classifyTopologyObject(
    { objectId: "custom_node", label: "Mystery Node", domain: "unknown" },
    "executive_systems"
  );
  assert.equal(cls.regionId, "executive_systems");
  assert.equal(cls.confidence, 1);
});
