import { test } from "node:test";
import * as assert from "node:assert/strict";

import { resolveSceneObjectIcon } from "./objectIconMapping.ts";
import type { SceneObject } from "../sceneTypes.ts";

test("resolves finance icon from domain", () => {
  const icon = resolveSceneObjectIcon({
    id: "revenue",
    label: "Revenue",
    domain: "finance",
  });

  assert.equal(icon?.src, "/icons/finance.svg");
});

test("resolves risk icon from role and label", () => {
  const icon = resolveSceneObjectIcon({
    id: "margin-risk",
    label: "Margin Risk",
    role: "risk",
  });

  assert.equal(icon?.src, "/icons/risk.svg");
});

test("resolves supply chain icon from semantic keywords", () => {
  const icon = resolveSceneObjectIcon({
    id: "supplier",
    label: "Primary Node",
    semantic: {
      keywords: ["supplier", "lead time"],
    },
  });

  assert.equal(icon?.src, "/icons/supply-chain.svg");
});

test("returns null when no semantic icon exists", () => {
  const object: SceneObject = {
    id: "plain",
    label: "Plain Object",
    type: "sphere",
  };

  assert.equal(resolveSceneObjectIcon(object), null);
});
