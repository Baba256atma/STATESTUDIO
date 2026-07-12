import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS,
  EXECUTIVE_ORGANIZATION_MANIFEST_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES,
  EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_MANIFEST_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_MANIFEST_IDENTITY,
  EXECUTIVE_ORGANIZATION_MANIFEST_METADATA,
  EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE,
  EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_MANIFEST_STATUS,
  EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY,
  EXECUTIVE_ORGANIZATION_MANIFEST_VERSION,
  EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST,
  EXECUTIVE_ORGANIZATION_RELEASE_METADATA,
  ExecutiveOrganizationManifestFoundation,
  ExecutiveOrganizationManifestPublicFoundation,
} from "./executiveOrganizationManifestIndex.ts";

test("publishes immutable manifest exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE, "nexora.bus.executive-organization.manifest");
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_STATUS, "Published");
  assert.equal(
    EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION,
    "Canonical metadata-only manifest layer for executive organization intelligence.",
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationManifestFoundation), true);
});

test("publishes dependency metadata integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES.length, 4);
  assert.equal(
    EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES.every(
      (dependency) => dependency.dependencyStatus === "Available",
    ),
    true,
  );
});

test("publishes component and release metadata integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS.length, 8);
  assert.equal(EXECUTIVE_ORGANIZATION_RELEASE_METADATA.releaseStatus, "Published");
  assert.equal(EXECUTIVE_ORGANIZATION_RELEASE_METADATA.releaseType, "MetadataOnly");
});

test("publishes compatibility and summary integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY.componentCount, 8);
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY.dependencyCount, 4);
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST.platformStatus, "Published");
});

test("publishes namespace consistency and aggregate integrity", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_MANIFEST_IDENTITY.identityNamespace,
    EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE,
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_MANIFEST_METADATA.manifestNamespace,
    EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE,
  );
  assert.equal(EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS.length, 13);
  assert.equal(
    EXECUTIVE_ORGANIZATION_MANIFEST_FOUNDATION_COMPATIBILITY.validationPublicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationManifestPublicFoundation), true);
});
