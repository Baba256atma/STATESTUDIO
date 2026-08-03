import { ExecutiveJournalExperiencePlatform } from "./executiveJournalExperiencePlatform.ts";
import type { ExecutiveJournalExperienceCertificationEvidenceRef } from "./executiveJournalExperienceCertificationTypes.ts";

/**
 * Read-only evidence references. Content is never duplicated from upstream.
 */
export const ExecutiveJournalExperienceCertificationEvidence = Object.freeze([
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/PlatformAggregate" as const,
    order: 1,
    kind: "PlatformAggregate" as const,
    reference: ExecutiveJournalExperiencePlatform.identity.id,
    platform: ExecutiveJournalExperiencePlatform,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/ProductionBuild" as const,
    order: 2,
    kind: "ProductionBuild" as const,
    reference: "EX-2:6-BUILD/ProductionBuildVerification" as const,
    exitCode: 0 as const,
    governingCommand:
      "NODE_OPTIONS=--max-old-space-size=8192 npm run build" as const,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/TypeScript" as const,
    order: 3,
    kind: "TypeScript" as const,
    reference: "EX-2:6-BUILD/TypeScriptVerification" as const,
    exitCode: 0 as const,
    governingCommand:
      "NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck" as const,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/TestVerification" as const,
    order: 4,
    kind: "TestVerification" as const,
    reference: "EX-2:6/executiveJournalExperiencePlatform.test.ts" as const,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/RouteVerification" as const,
    order: 5,
    kind: "RouteVerification" as const,
    reference: "EX-2:6-BUILD/RouteCompilationVerification" as const,
    staticRoutes: Object.freeze([
      "/",
      "/_not-found",
      "/executive",
      "/executive/journal-preview",
      "/pipeline",
      "/psych",
      "/sycho",
      "/type-c",
    ] as const),
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/DependencyVerification" as const,
    order: 6,
    kind: "DependencyVerification" as const,
    reference:
      ExecutiveJournalExperiencePlatform.dependencyDeclaration.runtimeDependency,
    platformRuntimeDependency:
      "EX-2:5/ExecutiveJournalExperienceManifest" as const,
    certificationRuntimeDependency:
      "EX-2:6/ExecutiveJournalExperiencePlatform" as const,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:7/Evidence/AuthorizationDecision" as const,
    order: 7,
    kind: "AuthorizationDecision" as const,
    reference: "AD-EX2-14" as const,
    authorization: ExecutiveJournalExperiencePlatform.authorization,
    duplicatesUpstream: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);

export const ExecutiveJournalExperienceCertificationEvidenceCatalogue =
  Object.freeze(
    ExecutiveJournalExperienceCertificationEvidence.map((entry) =>
      Object.freeze({
        evidenceId: entry.evidenceId,
        order: entry.order,
        kind: entry.kind,
        reference: entry.reference,
        duplicatesUpstream: false as const,
        readOnly: true as const,
        metadataOnly: true as const,
        immutable: true as const,
      } satisfies ExecutiveJournalExperienceCertificationEvidenceRef)),
  );

export const ExecutiveJournalExperienceCertificationEvidenceByKind =
  Object.freeze({
    platform: ExecutiveJournalExperienceCertificationEvidence[0],
    productionBuild: ExecutiveJournalExperienceCertificationEvidence[1],
    typeScript: ExecutiveJournalExperienceCertificationEvidence[2],
    testVerification: ExecutiveJournalExperienceCertificationEvidence[3],
    routeVerification: ExecutiveJournalExperienceCertificationEvidence[4],
    dependencyVerification: ExecutiveJournalExperienceCertificationEvidence[5],
    authorizationDecision: ExecutiveJournalExperienceCertificationEvidence[6],
  });
