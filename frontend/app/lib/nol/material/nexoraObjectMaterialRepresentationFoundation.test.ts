/**
 * NOL-2:1 — NexoraObject Material & Representation Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  universalNexoraObjectPublicIndex,
  type MutableNexoraObject,
  type NexoraObjectStatus,
} from "../universalNexoraObjectPublicIndex.ts";
import {
  deserializeNexoraObjectRepresentation,
  materialRepresentationFoundationIdentity,
  projectNexoraObjectRepresentation,
  resolveNexoraObjectGeometry,
  resolveNexoraObjectMaterial,
  resolveNexoraObjectRepresentationState,
  serializeNexoraObjectRepresentation,
  validateNexoraObjectMaterial,
  validateNexoraObjectRepresentation,
  type NexoraObjectRepresentation,
  type NexoraObjectRepresentationContext,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectMaterialRepresentationFoundation.ts"),
  "utf8",
);

const {
  createNexoraObjectContract,
  freezeNexoraObject,
} = universalNexoraObjectPublicIndex.objectContracts;
const {
  applyNexoraObjectRuntimeCommand,
  getNexoraObjectRuntimeState,
} = universalNexoraObjectPublicIndex.objectRuntime;

function ctx(
  partial: Partial<NexoraObjectRepresentationContext> & {
    readonly source?: NexoraObjectRepresentationContext["source"];
  } = {},
): NexoraObjectRepresentationContext {
  return {
    source: partial.source ?? "Director",
    ...partial,
  };
}

function makeObject(
  id: string,
  type: "Decision" | "Action" | "Goal" | "KPI" = "Goal",
  status: NexoraObjectStatus = "White",
): MutableNexoraObject {
  const object = createNexoraObjectContract({
    id,
    type,
    caption: `Caption ${id}`,
    status,
    createdAt: "2026-08-04T16:00:00.000Z",
  });
  object.setLifecycle("Active");
  return object;
}

function fingerprint(object: MutableNexoraObject) {
  return Object.freeze({
    identity: JSON.stringify(object.identity),
    status: object.status,
    lifecycle: object.lifecycle,
    runtime: JSON.stringify(object.runtime),
    metadata: JSON.stringify(object.metadata),
    relationships: JSON.stringify(object.getRelationships()),
    executive: JSON.stringify(object.executive),
    kpi: JSON.stringify(object.kpi),
  });
}

function mutationAffordances(rep: NexoraObjectRepresentation) {
  const mutation = new Set([
    "AddToStage",
    "RemoveFromStage",
    "Approve",
    "Reject",
    "Cancel",
    "Start",
    "Pause",
    "Resume",
    "Complete",
    "Edit",
  ]);
  return rep.affordances.filter(
    (a) => a.visible && a.enabled && mutation.has(a.affordance),
  );
}

describe("NOL-2:1 NexoraObject Material & Representation Foundation", () => {
  it("1. Module identity is exact", () => {
    assert.equal(
      materialRepresentationFoundationIdentity,
      "NOL-2:1/NexoraObjectMaterialRepresentationFoundation",
    );
  });

  it("2. Module imports only NOL-1:9 Public Index", () => {
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    assert.ok(imports.length > 0);
    for (const spec of imports) {
      assert.ok(
        spec.includes("universalNexoraObjectPublicIndex"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("/foundation/"), false);
    assert.equal(source.includes("/freeze/"), false);
    assert.equal(source.includes("/contract/"), false);
  });

  it("3. Default object representation resolves to Minimum", () => {
    const object = makeObject("m3");
    const state = resolveNexoraObjectRepresentationState(object, ctx());
    assert.equal(state, "Minimum");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.state, "Minimum");
  });

  it("4. Focused object resolves to Report", () => {
    const object = makeObject("m4");
    applyNexoraObjectRuntimeCommand(object, { type: "Focus" }, {
      source: "Director",
    });
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.state, "Report");
  });

  it("5. Authorized operation request resolves to Operation", () => {
    const object = makeObject("m5", "Decision");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.equal(rep.state, "Operation");
  });

  it("6. Unauthorized operation request falls back to Report", () => {
    const object = makeObject("m6", "Decision");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: false }),
    );
    assert.equal(rep.state, "Report");
  });

  it("7. Hidden object returns visible: false", () => {
    const object = makeObject("m7");
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.visible, false);
  });

  it("8. Hidden representation is not interactive", () => {
    const object = makeObject("m8");
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.interactive, false);
  });

  it("9. Deleted object is historical and read-only", () => {
    const object = makeObject("m9");
    applyNexoraObjectRuntimeCommand(object, { type: "Lock" }, {
      source: "System",
      authorizedSystemMutation: true,
    });
    object.setLifecycle("Deleted");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.readOnly, true);
    assert.equal(rep.profile, "Historical");
    assert.equal(rep.state, "Report");
    assert.equal(mutationAffordances(rep).length, 0);
  });

  it("10. Archived object exposes no execution affordances", () => {
    const object = makeObject("m10", "Action");
    object.setLifecycle("Archived");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    const execution = rep.affordances.filter((a) =>
      ["Start", "Pause", "Resume", "Complete", "Cancel"].includes(a.affordance),
    );
    assert.ok(execution.every((a) => !a.enabled || !a.visible));
  });

  it("11. Locked object Operation representation is read-only", () => {
    const object = makeObject("m11", "Decision");
    applyNexoraObjectRuntimeCommand(object, { type: "Lock" }, {
      source: "System",
      authorizedSystemMutation: true,
    });
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.equal(rep.state, "Operation");
    assert.equal(rep.readOnly, true);
    assert.equal(mutationAffordances(rep).length, 0);
  });

  it("12. Seed color maps exactly from all six NOL-1 statuses", () => {
    const statuses: NexoraObjectStatus[] = [
      "Red",
      "Yellow",
      "Green",
      "Blue",
      "White",
      "Black",
    ];
    for (const status of statuses) {
      const object = makeObject(`m12-${status}`, "Goal", status);
      const material = resolveNexoraObjectMaterial(object, "Minimum", ctx());
      assert.equal(material.color.seed, status);
      assert.equal(material.color.inheritedFromStatus, true);
    }
  });

  it("13. Selection changes emphasis but not Seed color", () => {
    const object = makeObject("m13", "Goal", "Green");
    applyNexoraObjectRuntimeCommand(object, { type: "Select" }, {
      source: "Director",
    });
    const material = resolveNexoraObjectMaterial(object, "Report", ctx());
    assert.equal(material.color.seed, "Green");
    assert.equal(material.emphasis, "Selected");
  });

  it("14. Focus changes emphasis but not object status", () => {
    const object = makeObject("m14", "Goal", "Yellow");
    const before = object.status;
    applyNexoraObjectRuntimeCommand(object, { type: "Focus" }, {
      source: "Director",
    });
    const material = resolveNexoraObjectMaterial(object, "Report", ctx());
    assert.equal(object.status, before);
    assert.equal(material.color.seed, "Yellow");
    assert.equal(material.emphasis, "Focused");
  });

  it("15. Minimum uses compact geometry", () => {
    const object = makeObject("m15");
    const geometry = resolveNexoraObjectGeometry(object, "Minimum");
    assert.ok(["XS", "S"].includes(geometry.size));
    assert.ok(geometry.scale <= 1);
    assert.ok(["Point", "Sphere", "Node", "Badge"].includes(geometry.shape));
  });

  it("16. Report uses executive density", () => {
    const object = makeObject("m16");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    assert.equal(rep.density, "Executive");
  });

  it("17. Operation uses operational density", () => {
    const object = makeObject("m17", "Decision");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.equal(rep.density, "Operational");
  });

  it("18. Minimum exposes no mutation affordances", () => {
    const object = makeObject("m18", "Decision");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.equal(rep.state, "Minimum");
    assert.equal(mutationAffordances(rep).length, 0);
  });

  it("19. Report exposes no destructive actions by default", () => {
    const object = makeObject("m19", "Decision");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    assert.equal(mutationAffordances(rep).length, 0);
    assert.equal(
      rep.affordances.some(
        (a) => a.affordance === "Approve" && a.visible && a.enabled,
      ),
      false,
    );
  });

  it("20. Operation exposes only permitted affordances", () => {
    const object = makeObject("m20", "Goal");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.ok(rep.affordances.some((a) => a.affordance === "Select"));
    assert.ok(rep.affordances.some((a) => a.affordance === "InspectTimeline"));
    assert.equal(
      rep.affordances.some(
        (a) => a.affordance === "Approve" && a.visible && a.enabled,
      ),
      false,
    );
  });

  it("21. Decision object may expose approval affordances", () => {
    const object = makeObject("m21", "Decision");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.ok(
      rep.affordances.some(
        (a) => a.affordance === "Approve" && a.visible && a.enabled,
      ),
    );
    assert.ok(
      rep.affordances.some(
        (a) => a.affordance === "Reject" && a.visible && a.enabled,
      ),
    );
  });

  it("22. Execution object affordances reflect execution state", () => {
    const object = makeObject("m22", "Action");
    applyNexoraObjectRuntimeCommand(object, { type: "PrepareExecution" }, {
      source: "Director",
    });
    applyNexoraObjectRuntimeCommand(object, { type: "StartExecution" }, {
      source: "Director",
    });
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    const pause = rep.affordances.find((a) => a.affordance === "Pause");
    const start = rep.affordances.find((a) => a.affordance === "Start");
    assert.ok(pause?.enabled);
    assert.equal(start?.enabled, false);
  });

  it("23. Generic object exposes inspection affordances", () => {
    const object = makeObject("m23", "Goal");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.ok(
      rep.affordances.some((a) => a.affordance === "InspectRelationships"),
    );
    assert.ok(rep.affordances.some((a) => a.affordance === "InspectTimeline"));
  });

  it("24. Missing KPI data does not create fake indicators", () => {
    const object = makeObject("m24");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    assert.equal(object.kpi.healthScore, null);
    assert.equal(rep.indicators.healthVisible, false);
    assert.equal(rep.indicators.trendVisible, false);
  });

  it("25. Badge ordering is deterministic", () => {
    const object = makeObject("m25", "Goal", "Yellow");
    const a = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    ).badges.map((b) => b.badgeId);
    const b = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    ).badges.map((b) => b.badgeId);
    assert.deepEqual(a, b);
    for (let i = 1; i < a.length; i += 1) {
      const prev = projectNexoraObjectRepresentation(
        object,
        ctx({ requestedState: "Report" }),
      ).badges[i - 1]!.priority;
      const next = projectNexoraObjectRepresentation(
        object,
        ctx({ requestedState: "Report" }),
      ).badges[i]!.priority;
      assert.ok(prev <= next);
    }
  });

  it("26. Duplicate badge IDs fail validation", () => {
    const object = makeObject("m26");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    const broken = {
      ...rep,
      badges: [
        ...rep.badges,
        { ...rep.badges[0]!, badgeId: rep.badges[0]!.badgeId },
      ],
    } as NexoraObjectRepresentation;
    const result = validateNexoraObjectRepresentation(broken, object);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "REPRESENTATION_DUPLICATE_BADGE_ID"),
    );
  });

  it("27. Invalid geometry fails validation", () => {
    const object = makeObject("m27");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    const broken = {
      ...rep,
      geometry: { ...rep.geometry, scale: Number.NaN, depth: -1 },
    } as NexoraObjectRepresentation;
    const result = validateNexoraObjectRepresentation(broken, object);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "REPRESENTATION_INVALID_GEOMETRY"),
    );
  });

  it("28. Invalid opacity fails validation", () => {
    const object = makeObject("m28", "Goal", "Green");
    const material = resolveNexoraObjectMaterial(object, "Minimum", ctx());
    const result = validateNexoraObjectMaterial(
      { ...material, opacity: 1.5 },
      "Green",
    );
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "REPRESENTATION_INVALID_MATERIAL"),
    );
  });

  it("29. Status-color conflict fails validation", () => {
    const object = makeObject("m29", "Goal", "Green");
    const material = resolveNexoraObjectMaterial(object, "Minimum", ctx());
    const result = validateNexoraObjectMaterial(
      {
        ...material,
        color: { ...material.color, seed: "Red", inheritedFromStatus: true },
      },
      "Green",
    );
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some(
        (e) => e.code === "REPRESENTATION_STATUS_COLOR_CONFLICT",
      ),
    );
  });

  it("30. Representation projection never mutates object identity", () => {
    const object = makeObject("m30");
    const before = fingerprint(object);
    projectNexoraObjectRepresentation(object, ctx({ focused: true }));
    assert.equal(JSON.stringify(object.identity), before.identity);
  });

  it("31. Representation projection never mutates Runtime", () => {
    const object = makeObject("m31");
    const before = JSON.stringify(getNexoraObjectRuntimeState(object));
    const beforeFlags = JSON.stringify(object.runtime);
    projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Operation", authorizedForOperation: true }),
    );
    assert.equal(JSON.stringify(getNexoraObjectRuntimeState(object)), before);
    assert.equal(JSON.stringify(object.runtime), beforeFlags);
  });

  it("32. Representation projection never mutates State", () => {
    const object = makeObject("m32", "Goal", "Blue");
    const before = fingerprint(object);
    projectNexoraObjectRepresentation(object, ctx({ selected: true }));
    assert.equal(object.status, before.status);
    assert.equal(object.lifecycle, before.lifecycle);
    assert.equal(JSON.stringify(object.executive), before.executive);
  });

  it("33. Representation projection never mutates Relationships", () => {
    const object = makeObject("m33");
    object.addRelationship({
      id: "rel-1",
      kind: "related_to",
      toId: "other",
      createdAt: "2026-08-04T16:00:00.000Z",
    });
    const before = JSON.stringify(object.getRelationships());
    projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    assert.equal(JSON.stringify(object.getRelationships()), before);
  });

  it("34. Representation descriptors are deeply immutable", () => {
    const object = makeObject("m34");
    const rep = projectNexoraObjectRepresentation(object, ctx());
    assert.throws(() => {
      (rep as { state: string }).state = "Operation";
    });
    assert.throws(() => {
      (rep.badges as unknown as { push: (v: unknown) => void }).push({});
    });
    assert.throws(() => {
      (rep.material as { opacity: number }).opacity = 0;
    });
  });

  it("35. Serialization and deserialization are reversible", () => {
    const object = makeObject("m35", "Decision", "Red");
    const rep = projectNexoraObjectRepresentation(
      object,
      ctx({ requestedState: "Report" }),
    );
    const json = serializeNexoraObjectRepresentation(rep);
    const restored = deserializeNexoraObjectRepresentation(json);
    assert.equal(restored.objectId, rep.objectId);
    assert.equal(restored.state, rep.state);
    assert.equal(restored.material.color.seed, "Red");
    assert.equal(restored.badges.length, rep.badges.length);
  });

  it("36. Unsupported representation schema is rejected", () => {
    assert.throws(() => {
      deserializeNexoraObjectRepresentation(
        JSON.stringify({
          foundationIdentity: materialRepresentationFoundationIdentity,
          schemaVersion: "9.9.9",
          representation: {},
        }),
      );
    }, /Unsupported representation schema/);
  });

  it("37. Serialized output contains no functions or renderer objects", () => {
    const object = makeObject("m37");
    const json = serializeNexoraObjectRepresentation(
      projectNexoraObjectRepresentation(object, ctx()),
    );
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("Mesh"), false);
    assert.equal(json.includes("Shader"), false);
    assert.equal(json.includes("React"), false);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    assert.equal(typeof parsed.representation, "object");
  });

  it("38. Material resolution is deterministic", () => {
    const object = makeObject("m38", "Goal", "Blue");
    const a = resolveNexoraObjectMaterial(object, "Report", ctx({ focused: true }));
    const b = resolveNexoraObjectMaterial(object, "Report", ctx({ focused: true }));
    assert.deepEqual(a, b);
  });

  it("39. Geometry resolution is deterministic", () => {
    const object = makeObject("m39", "Decision");
    assert.deepEqual(
      resolveNexoraObjectGeometry(object, "Operation"),
      resolveNexoraObjectGeometry(object, "Operation"),
    );
  });

  it("40. The module is framework-independent and renderer-independent", () => {
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("from 'react'"), false);
    assert.equal(source.includes("three"), false);
    assert.equal(source.includes("next/"), false);
    assert.equal(source.includes("document."), false);
    assert.equal(source.includes("window."), false);
    assert.equal(source.includes("HTMLElement"), false);
    // freezeNexoraObject remains available for consumers via Public Index.
    assert.equal(typeof freezeNexoraObject, "function");
  });
});
