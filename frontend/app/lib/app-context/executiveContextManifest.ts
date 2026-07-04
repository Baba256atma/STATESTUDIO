import { AppDomainPlatformFreeze } from "../app-dom/appDomainPlatformFreezeIndex.ts";
import type { ExecutiveContextManifest } from "./executiveContextTypes.ts";

const CONTEXT_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "workspace",
  "domain",
  "objects",
  "kpis",
  "risks",
  "scenario",
  "timeline",
  "simulation",
  "intent",
  "goal",
  "constraints",
] as const);


function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<ExecutiveContextManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.contextVersion,
      manifest.builderVersion,
      manifest.consumedAppDomainPlatform,
      manifest.supportedAppVersion,
      manifest.contextSections.join(","),
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildExecutiveContextManifest(): ExecutiveContextManifest {
  const base = Object.freeze({
    contextVersion: "APP-CTX-1" as const,
    builderVersion: "APP-CTX-1" as const,
    consumedAppDomainPlatform: AppDomainPlatformFreeze.listAppDomainPlatformPhases().some((phase) => phase.phaseId === "APP-DOM-4")
      ? "APP-DOM-4"
      : "APP-DOM-unknown",
    supportedAppVersion: "APP-CTX-1" as const,
    contextSections: CONTEXT_SECTIONS,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...base, fingerprint: manifestFingerprint(base) });
}

export function validateExecutiveContextManifest(manifest: ExecutiveContextManifest) {
  const expected = manifestFingerprint({
    contextVersion: manifest.contextVersion,
    builderVersion: manifest.builderVersion,
    consumedAppDomainPlatform: manifest.consumedAppDomainPlatform,
    supportedAppVersion: manifest.supportedAppVersion,
    contextSections: manifest.contextSections,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });
  const valid =
    manifest.contextVersion === "APP-CTX-1" &&
    manifest.builderVersion === "APP-CTX-1" &&
    manifest.consumedAppDomainPlatform === "APP-DOM-4" &&
    manifest.contextSections.length === CONTEXT_SECTIONS.length &&
    manifest.fingerprint === expected &&
    manifest.metadataOnly;

  return Object.freeze({
    valid,
    issues: Object.freeze(
      valid ? [] : [Object.freeze({ code: "invalid_context_manifest", message: "Executive context manifest is invalid." })]
    ),
  });
}
