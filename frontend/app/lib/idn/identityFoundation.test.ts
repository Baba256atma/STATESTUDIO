import assert from "node:assert/strict";
import test from "node:test";

import {
  createIdentity,
  IDENTITY_CONTRACT_VERSION,
  isIdentityLifecycleState,
  isIdentityType,
  validateIdentity,
  validateIdentityCollection,
} from "./identityIndex.ts";

const baseCreated = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["foundation"],
  metadata: { region: "global" },
});

test("creates deterministic canonical identities from supplied ids", () => {
  const identity = createIdentity({
    id: "user:001",
    type: "User",
    displayName: "Nexora Founder",
    created: baseCreated,
    lifecycle: "Active",
    version: 2,
    tags: ["executive"],
    metadata: { tier: "founder" },
  });

  assert.equal(identity.contractVersion, IDENTITY_CONTRACT_VERSION);
  assert.equal(identity.id, "user:001");
  assert.equal(identity.type, "User");
  assert.equal(identity.displayName, "Nexora Founder");
  assert.equal(identity.lifecycle, "Active");
  assert.equal(identity.version, 2);
  assert.deepEqual(identity.tags, ["executive"]);
  assert.deepEqual(identity.metadata, { tier: "founder" });
});

test("defaults lifecycle and versions without randomness", () => {
  const first = createIdentity({
    id: "workspace:001",
    type: "Workspace",
    displayName: "Workspace",
    created: baseCreated,
  });
  const second = createIdentity({
    id: "workspace:001",
    type: "Workspace",
    displayName: "Workspace",
    created: baseCreated,
  });

  assert.equal(first.lifecycle, "Created");
  assert.equal(first.version, 1);
  assert.deepEqual(first, second);
});

test("validates all canonical identity types and lifecycle states", () => {
  assert.equal(isIdentityType("Tenant"), true);
  assert.equal(isIdentityType("Account"), false);
  assert.equal(isIdentityLifecycleState("Archived"), true);
  assert.equal(isIdentityLifecycleState("Suspended"), false);
});

test("accepts valid metadata contracts", () => {
  const identity = createIdentity({
    id: "service:billing",
    type: "Service",
    displayName: "Billing Service",
    created: {
      ...baseCreated,
      source: "integration",
      description: "Service identity only.",
      metadata: { system: true, retries: 0, parent: null },
    },
    metadata: { publicContract: true },
  });

  assert.equal(validateIdentity(identity).valid, true);
});

test("rejects missing required fields with structured issues", () => {
  const invalid = {
    ...createIdentity({
      id: "project:001",
      type: "Project",
      displayName: "Project",
      created: baseCreated,
    }),
    id: "",
    displayName: " ",
  };

  const validation = validateIdentity(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.field === "id"), true);
  assert.equal(validation.issues.some((entry) => entry.field === "displayName"), true);
});

test("rejects invalid lifecycle values", () => {
  const invalid = {
    ...createIdentity({
      id: "agent:001",
      type: "Agent",
      displayName: "Forecast Agent",
      created: baseCreated,
    }),
    lifecycle: "Suspended",
  };

  const validation = validateIdentity(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues[0]?.code, "invalid_lifecycle");
});

test("rejects invalid metadata values and timestamps", () => {
  const invalid = {
    ...createIdentity({
      id: "api:001",
      type: "API",
      displayName: "Public API",
      created: baseCreated,
    }),
    created: {
      ...baseCreated,
      createdAt: "not-a-date",
      source: "unknown",
      metadata: { nested: { blocked: true } },
    },
  };

  const validation = validateIdentity(invalid);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.field === "created.createdAt"), true);
  assert.equal(validation.issues.some((entry) => entry.field === "created.source"), true);
  assert.equal(validation.issues.some((entry) => entry.field === "created.metadata.nested"), true);
});

test("detects duplicate ids across identity collections", () => {
  const first = createIdentity({
    id: "tenant:001",
    type: "Tenant",
    displayName: "Tenant A",
    created: baseCreated,
  });
  const second = createIdentity({
    id: "tenant:001",
    type: "Tenant",
    displayName: "Tenant Duplicate",
    created: baseCreated,
  });

  const validation = validateIdentityCollection([first, second]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_id"), true);
});

test("returns structured validation for non-object contracts", () => {
  const validation = validateIdentity(null);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues[0]?.field, "identity");
  assert.equal(validation.issues[0]?.code, "invalid_metadata");
});

test("keeps session identity as metadata-only contract", () => {
  const session = createIdentity({
    id: "session:metadata:001",
    type: "Session",
    displayName: "Executive Workspace Session Metadata",
    created: baseCreated,
    metadata: { deviceClass: "desktop", continuityMarker: null },
  });

  assert.equal(session.type, "Session");
  assert.equal(validateIdentity(session).valid, true);
});
