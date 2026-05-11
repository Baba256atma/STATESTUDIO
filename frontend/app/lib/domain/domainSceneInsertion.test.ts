import { test } from "node:test";
import * as assert from "node:assert/strict";

import { insertDomainObjectIntoScene } from "./domainSceneInsertion.ts";
import type { SceneJson } from "../sceneTypes.ts";

function baseScene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        {
          id: "existing_core",
          label: "Existing Core",
          type: "core",
          position: [0, 0, 0],
        },
      ],
      loops: [
        {
          id: "existing_loop",
          type: "stability_balance",
          edges: [{ from: "existing_core", to: "existing_core", weight: 0.1 }],
        },
      ],
    },
  };
}

test("insertion preserves existing scene objects", () => {
  const scene = baseScene();
  const originalObjects = scene.scene.objects;
  const result = insertDomainObjectIntoScene({
    currentScene: scene,
    creationRequest: {
      domainId: "supply_chain",
      templateId: "supply_chain_inventory",
      source: "user_add",
    },
  });

  assert.equal(result.success, true);
  assert.equal(scene.scene.objects, originalObjects);
  assert.equal(scene.scene.objects?.length, 1);
  assert.equal(result.nextScene?.scene.objects?.[0]?.id, "existing_core");
});

test("insertion adds exactly one object", () => {
  const result = insertDomainObjectIntoScene({
    currentScene: baseScene(),
    creationRequest: {
      domainId: "finance",
      templateId: "finance_cash_flow",
      source: "user_add",
    },
  });

  assert.equal(result.success, true);
  assert.equal(result.nextScene?.scene.objects?.length, 2);
  assert.equal(result.createdObjectId, "domain_finance_cash_flow");
});

test("duplicate protection skips existing matching object", () => {
  const once = insertDomainObjectIntoScene({
    currentScene: baseScene(),
    creationRequest: {
      domainId: "retail",
      templateId: "retail_inventory",
      source: "user_add",
    },
  });
  const twice = insertDomainObjectIntoScene({
    currentScene: once.nextScene,
    creationRequest: {
      domainId: "retail",
      templateId: "retail_inventory",
      source: "user_add",
    },
  });

  assert.equal(twice.success, false);
  assert.equal(twice.nextScene?.scene.objects?.length, 2);
  assert.ok(twice.warnings?.includes("duplicate_object_skipped"));
});

test("invalid scene returns safe failure", () => {
  const result = insertDomainObjectIntoScene({
    currentScene: null,
    creationRequest: {
      domainId: "general",
      templateId: "general_risk",
      source: "system",
    },
  });

  assert.equal(result.success, false);
  assert.ok(result.warnings?.includes("invalid_scene"));
});

test("no mutation of original scene loops", () => {
  const scene = baseScene();
  const originalLoops = scene.scene.loops;
  const result = insertDomainObjectIntoScene({
    currentScene: scene,
    creationRequest: {
      domainId: "security",
      templateId: "security_control",
      source: "user_add",
    },
  });

  assert.equal(scene.scene.loops, originalLoops);
  assert.equal(result.nextScene?.scene.loops, originalLoops);
});

test("positioning is deterministic and avoids center after existing object", () => {
  const result = insertDomainObjectIntoScene({
    currentScene: baseScene(),
    creationRequest: {
      domainId: "pmo",
      templateId: "pmo_timeline",
      source: "user_add",
      preferredPosition: "auto",
    },
  });

  assert.deepEqual(result.nextScene?.scene.objects?.[1]?.position, [2.2, -0.18, 0]);
});
