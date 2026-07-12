import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS,
  EXECUTIVE_RESOURCE_MANIFEST_COMPATIBILITY,
  EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES,
  EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION,
  EXECUTIVE_RESOURCE_MANIFEST_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_RESOURCE_MANIFEST_IDENTITY,
  EXECUTIVE_RESOURCE_MANIFEST_METADATA,
  EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE,
  EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_MANIFEST_STATUS,
  EXECUTIVE_RESOURCE_MANIFEST_SUMMARY,
  EXECUTIVE_RESOURCE_MANIFEST_VERSION,
  EXECUTIVE_RESOURCE_PLATFORM_MANIFEST,
  EXECUTIVE_RESOURCE_RELEASE_METADATA,
  ExecutiveResourceManifestFoundation,
  ExecutiveResourceManifestPublicFoundation,
} from "./executiveResourceManifestIndex.ts";

test("publishes immutable manifest exports", () => {
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE, "nexora.bus.executive-resource.manifest");
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_STATUS, "Published");
  assert.equal(
    EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION,
    "Canonical metadata-only manifest layer for executive resource intelligence.",
  );
  assert.equal(Object.isFrozen(ExecutiveResourceManifestFoundation), true);
});

test("publishes dependency integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES.length, 4);
  assert.equal(
    EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES.every(
      (dependency) => dependency.dependencyStatus === "Available",
    ),
    true,
  );
});

test("publishes component and release metadata integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS.length, 8);
  assert.equal(EXECUTIVE_RESOURCE_RELEASE_METADATA.releaseStatus, "Published");
  assert.equal(EXECUTIVE_RESOURCE_RELEASE_METADATA.releaseType, "MetadataOnly");
});

test("publishes compatibility and summary integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_SUMMARY.componentCount, 8);
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_SUMMARY.dependencyCount, 4);
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_MANIFEST.platformStatus, "Published");
});

test("publishes aggregate foundation integrity, namespace consistency, and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_MANIFEST_IDENTITY.identityNamespace,
    EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE,
  );
  assert.equal(
    EXECUTIVE_RESOURCE_MANIFEST_METADATA.manifestNamespace,
    EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE,
  );
  assert.equal(EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS.length, 13);
  assert.equal(
    EXECUTIVE_RESOURCE_MANIFEST_FOUNDATION_COMPATIBILITY.validationPublicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveResourceManifestPublicFoundation), true);
});
