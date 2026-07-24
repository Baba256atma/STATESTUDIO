/** WS-2:6 — Manifest-backed compatibility and extension surfaces. */
import { ExecutiveHomeWorkspaceManifest } from "./executiveHomeWorkspaceManifest.ts";
export const ExecutiveHomeWorkspacePlatformCompatibility = Object.freeze(
  ExecutiveHomeWorkspaceManifest.compatibility.map((source) => Object.freeze({
    ...source, source, platformStatus: "Compatible", metadataOnly: true, immutable: true,
  })),
);
export const ExecutiveHomeWorkspacePlatformExtensions =
  ExecutiveHomeWorkspaceManifest.extensions;

