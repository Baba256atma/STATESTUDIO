import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceFreeze } from "./timelineWorkspaceFreeze.ts";

const files = [
  "timelineWorkspaceFreeze.test.ts",
  "timelineWorkspaceFreeze.ts",
  "timelineWorkspaceFreezeCompatibility.ts",
  "timelineWorkspaceFreezeGuarantees.ts",
  "timelineWorkspaceFreezeIdentity.ts",
  "timelineWorkspaceFreezeLock.ts",
  "timelineWorkspaceFreezePublicApi.ts",
  "timelineWorkspaceFrozenBaselines.ts",
];

test("WS-10:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:8 publishes its canonical immutable lock", () => {
  const freeze = TimelineWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-10:8/TimelineWorkspaceFreeze");
  assert.equal(
    freeze.identity.namespace,
    "nexora.workspace.timeline.freeze",
  );
  assert.equal(freeze.lock.id, "WS-10-TIMELINE-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-10:8 freezes exactly eight baselines and complete chain", () => {
  const freeze = TimelineWorkspaceFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.deepEqual(freeze.metadata.architectureChain, [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
  ]);
  assert.equal(freeze.baselines[6].source, freeze.certification);
});

test("WS-10:8 publishes deterministic compatibility, guarantees, and APIs", () => {
  const freeze = TimelineWorkspaceFreeze;
  assert.deepEqual(
    [
      freeze.compatibility.length,
      freeze.guarantees.length,
      freeze.publicApi.length,
    ],
    [9, 8, 8],
  );
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 8);
  assert.equal(freeze.release, "Released");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.stability, "Stable");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-10:8 consumes Certification only and contains no runtime", () => {
  const freeze = TimelineWorkspaceFreeze;
  const source = readFileSync(
    new URL("./timelineWorkspaceFreeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./timelineWorkspacePlatform"), false);
  assert.equal(source.includes("./timelineWorkspaceManifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-10:7 Timeline Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.timelinePlayback, false);
  assert.equal(freeze.businessLogic, false);
});
