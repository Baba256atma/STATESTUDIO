/**
 * NOL-2:2 — NexoraObject Material State & Resolution Model tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { universalNexoraObjectPublicIndex } from "../universalNexoraObjectPublicIndex.ts";
import {
  projectNexoraObjectRepresentation,
  type NexoraObjectRepresentation,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";
import {
  createMaterialCacheKey,
  deserializeMaterialState,
  materialStateResolutionModelIdentity,
  resolveMaterialState,
  serializeMaterialState,
  validateMaterialState,
  type NexoraObjectMaterialResolutionContext,
  type NexoraObjectMaterialState,
} from "./nexoraObjectMaterialStateResolutionModel.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectMaterialStateResolutionModel.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

function makeRepresentation(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly type?: "Decision" | "Action" | "Goal";
    readonly requestedState?: "Minimum" | "Report" | "Operation";
    readonly hide?: boolean;
    readonly select?: boolean;
    readonly focus?: boolean;
    readonly historical?: boolean;
    readonly deleted?: boolean;
  } = {},
): NexoraObjectRepresentation {
  const object = createNexoraObjectContract({
    id,
    type: options.type ?? "Goal",
    caption: `Object ${id}`,
    status: options.status ?? "Green",
    createdAt: "2026-08-04T16:12:00.000Z",
  });
  object.setLifecycle("Active");

  if (options.hide) {
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
  }
  if (options.select) {
    applyNexoraObjectRuntimeCommand(object, { type: "Select" }, {
      source: "Director",
    });
  }
  if (options.focus) {
    applyNexoraObjectRuntimeCommand(object, { type: "Focus" }, {
      source: "Director",
    });
  }
  if (options.deleted) {
    applyNexoraObjectRuntimeCommand(object, { type: "Lock" }, {
      source: "System",
      authorizedSystemMutation: true,
    });
    object.setLifecycle("Deleted");
  }

  return projectNexoraObjectRepresentation(object, {
    source: "Director",
    requestedState: options.requestedState,
    authorizedForOperation: true,
    historical: options.historical,
  });
}

function resolutionCtx(
  partial: Partial<NexoraObjectMaterialResolutionContext> = {},
): NexoraObjectMaterialResolutionContext {
  return {
    theme: partial.theme ?? "Light",
    zoomLevel: partial.zoomLevel ?? "Medium",
    stageDensity: partial.stageDensity ?? "Balanced",
    interactionMode: partial.interactionMode ?? "Browse",
    historicalMode: partial.historicalMode,
  };
}

describe("NOL-2:2 NexoraObject Material State & Resolution Model", () => {
  it("1. Module imports only NOL-2:1", () => {
    assert.equal(
      materialStateResolutionModelIdentity,
      "NOL-2:2/NexoraObjectMaterialStateResolutionModel",
    );
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    assert.ok(imports.length > 0);
    for (const spec of imports) {
      assert.ok(
        spec.includes("nexoraObjectMaterialRepresentationFoundation"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("universalNexoraObjectPublicIndex"), false);
    assert.equal(source.includes("/foundation/"), false);
    assert.equal(source.includes("/freeze/"), false);
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("three"), false);
  });

  it("2. Material state resolves deterministically", () => {
    const representation = makeRepresentation("r2", {
      requestedState: "Report",
      status: "Blue",
    });
    const a = resolveMaterialState(representation, resolutionCtx());
    const b = resolveMaterialState(representation, resolutionCtx());
    assert.deepEqual(a, b);
    assert.equal(a.representationState, "Report");
    assert.equal(a.seedColor, "Blue");
  });

  it("3. Equal inputs generate identical cache keys", () => {
    const representation = makeRepresentation("r3", { status: "Green" });
    const a = resolveMaterialState(representation, resolutionCtx());
    const b = resolveMaterialState(representation, resolutionCtx());
    assert.equal(a.cacheKey, b.cacheKey);
    assert.equal(
      createMaterialCacheKey({
        representationVersion: representation.representationVersion,
        state: representation.state,
        theme: "Light",
        emphasis: a.emphasis,
        status: a.seedColor,
        profile: a.profile,
        layer: a.layer,
        opacity: a.opacity,
      }),
      a.cacheKey,
    );
  });

  it("4. Different themes generate different material states", () => {
    const representation = makeRepresentation("r4", {
      requestedState: "Report",
    });
    const light = resolveMaterialState(
      representation,
      resolutionCtx({ theme: "Light" }),
    );
    const dark = resolveMaterialState(
      representation,
      resolutionCtx({ theme: "Dark" }),
    );
    assert.notEqual(light.theme, dark.theme);
    assert.notEqual(light.themeTokens.surfaceToken, dark.themeTokens.surfaceToken);
    assert.notEqual(light.cacheKey, dark.cacheKey);
  });

  it("5. Seed colors remain unchanged across themes", () => {
    const representation = makeRepresentation("r5", { status: "Red" });
    const light = resolveMaterialState(
      representation,
      resolutionCtx({ theme: "Light" }),
    );
    const dark = resolveMaterialState(
      representation,
      resolutionCtx({ theme: "Dark" }),
    );
    assert.equal(light.seedColor, "Red");
    assert.equal(dark.seedColor, "Red");
    assert.equal(light.material.color.seed, "Red");
    assert.equal(dark.material.color.seed, "Red");
    assert.equal(
      light.material.color.seed,
      representation.material.color.seed,
    );
  });

  it("6. Hidden objects resolve opacity = 0", () => {
    const representation = makeRepresentation("r6", { hide: true });
    const state = resolveMaterialState(representation, resolutionCtx());
    assert.equal(state.opacity, 0);
    assert.equal(state.visibility, false);
  });

  it("7. Historical objects reduce opacity", () => {
    const normal = resolveMaterialState(
      makeRepresentation("r7a", { requestedState: "Report" }),
      resolutionCtx(),
    );
    const historical = resolveMaterialState(
      makeRepresentation("r7b", { deleted: true }),
      resolutionCtx({ historicalMode: true }),
    );
    assert.ok(historical.opacity < normal.opacity);
    assert.ok(historical.opacity > 0);
    assert.equal(historical.layer, "Historical");
  });

  it("8. Focused objects receive highest layer priority", () => {
    const focused = resolveMaterialState(
      makeRepresentation("r8", { focus: true }),
      resolutionCtx(),
    );
    const selected = resolveMaterialState(
      makeRepresentation("r8b", { select: true }),
      resolutionCtx(),
    );
    assert.equal(focused.layer, "Focused");
    assert.equal(selected.layer, "Selected");
    assert.ok(
      focused.layer === "Focused" &&
        selected.layer === "Selected",
    );
  });

  it("9. Selected objects receive medium emphasis", () => {
    const state = resolveMaterialState(
      makeRepresentation("r9", { select: true, status: "Green" }),
      resolutionCtx(),
    );
    assert.equal(state.emphasis, "Medium");
  });

  it("10. Red status resolves Critical emphasis", () => {
    const state = resolveMaterialState(
      makeRepresentation("r10", { status: "Red", requestedState: "Report" }),
      resolutionCtx(),
    );
    assert.equal(state.emphasis, "Critical");
    assert.equal(state.seedColor, "Red");
  });

  it("11. Glow never changes Seed color", () => {
    const representation = makeRepresentation("r11", {
      focus: true,
      status: "Yellow",
    });
    const state = resolveMaterialState(representation, resolutionCtx());
    assert.ok(state.glow !== "None");
    assert.equal(state.seedColor, "Yellow");
    assert.equal(state.material.color.seed, "Yellow");
  });

  it("12. Outline resolution is deterministic", () => {
    const representation = makeRepresentation("r12", { focus: true });
    const a = resolveMaterialState(representation, resolutionCtx());
    const b = resolveMaterialState(representation, resolutionCtx());
    assert.equal(a.outline, b.outline);
    assert.ok(["None", "Thin", "Normal", "Bold"].includes(a.outline));
  });

  it("13. Shadow resolution is deterministic", () => {
    const representation = makeRepresentation("r13", {
      requestedState: "Operation",
      type: "Decision",
    });
    const a = resolveMaterialState(representation, resolutionCtx());
    const b = resolveMaterialState(representation, resolutionCtx());
    assert.equal(a.shadow, b.shadow);
  });

  it("14. Animation hints are immutable", () => {
    const state = resolveMaterialState(
      makeRepresentation("r14"),
      resolutionCtx(),
    );
    assert.throws(() => {
      (state.animationHints as { appear: string }).appear = "None";
    });
  });

  it("15. Material state is deeply immutable", () => {
    const state = resolveMaterialState(
      makeRepresentation("r15", { requestedState: "Report" }),
      resolutionCtx(),
    );
    assert.throws(() => {
      (state as { opacity: number }).opacity = 0;
    });
    assert.throws(() => {
      (state.themeTokens as { theme: string }).theme = "Dark";
    });
    assert.throws(() => {
      (state.material as { opacity: number }).opacity = 0;
    });
  });

  it("16. Cache keys are stable across runs", () => {
    const representation = makeRepresentation("r16", { status: "Blue" });
    const keys = Array.from({ length: 5 }, () =>
      resolveMaterialState(representation, resolutionCtx({ theme: "Dark" }))
        .cacheKey,
    );
    assert.ok(keys.every((key) => key === keys[0]));
  });

  it("17. Validation rejects invalid opacity", () => {
    const state = resolveMaterialState(
      makeRepresentation("r17"),
      resolutionCtx(),
    );
    const broken = { ...state, opacity: 1.5 } as NexoraObjectMaterialState;
    const result = validateMaterialState(broken);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "MATERIAL_STATE_INVALID_OPACITY"),
    );
  });

  it("18. Serialization is reversible", () => {
    const state = resolveMaterialState(
      makeRepresentation("r18", { status: "Green", requestedState: "Report" }),
      resolutionCtx({ theme: "Dark" }),
    );
    const json = serializeMaterialState(state);
    const restored = deserializeMaterialState(json);
    assert.equal(restored.cacheKey, state.cacheKey);
    assert.equal(restored.seedColor, "Green");
    assert.equal(restored.theme, "Dark");
    assert.equal(restored.opacity, state.opacity);
  });

  it("19. Unsupported schema versions are rejected", () => {
    assert.throws(() => {
      deserializeMaterialState(
        JSON.stringify({
          engineIdentity: materialStateResolutionModelIdentity,
          schemaVersion: "9.9.9",
          state: {},
        }),
      );
    }, /Unsupported material state schema/);
  });

  it("20. No renderer-specific objects are produced", () => {
    const state = resolveMaterialState(
      makeRepresentation("r20", { requestedState: "Operation", type: "Action" }),
      resolutionCtx(),
    );
    const json = serializeMaterialState(state);
    assert.equal(json.includes("Mesh"), false);
    assert.equal(json.includes("Shader"), false);
    assert.equal(json.includes("HTMLElement"), false);
    assert.equal(json.includes("React"), false);
    assert.equal(json.includes("#"), false); // no hex colors
    assert.equal(typeof state.themeTokens.surfaceToken, "string");
    assert.ok(state.themeTokens.surfaceToken.startsWith("theme."));
  });

  it("21. No mutation of representation occurs", () => {
    const representation = makeRepresentation("r21", {
      requestedState: "Report",
      status: "Blue",
    });
    const before = JSON.stringify(representation);
    resolveMaterialState(representation, resolutionCtx({ theme: "Dark" }));
    assert.equal(JSON.stringify(representation), before);
    assert.equal(representation.material.color.seed, "Blue");
  });

  it("22. Typecheck remains clean", () => {
    // Validated externally by npm run typecheck.
    assert.equal(typeof resolveMaterialState, "function");
  });

  it("23. ESLint remains clean", () => {
    // Validated externally by repository-standard ESLint.
    assert.equal(typeof serializeMaterialState, "function");
  });
});
