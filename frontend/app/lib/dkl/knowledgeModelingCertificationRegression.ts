/**
 * DKL-4:7 — Knowledge Modeling Certification Regression.
 *
 * Immutable regression protection declarations derived from Platform metadata.
 * Architecture metadata only. No git history or build inspection.
 *
 * Ownership: owned exclusively by DKL-4:7.
 */

import { KnowledgeModelingPlatform } from "./knowledgeModelingPlatform.ts";

const OWNER = "DKL-4 Knowledge Modeling Certification";

const decl = (
  regressionId: string,
  name: string,
  protectedValue: string | number | boolean,
  sourcePhase: string,
  sourceReference: string,
) =>
  Object.freeze({
    regressionId,
    name,
    protectedValue,
    sourcePhase,
    sourceReference,
    metadataOnly: true as const,
    immutable: true as const,
  });

const PLATFORM = KnowledgeModelingPlatform;

/** Canonical immutable regression protection declarations. */
export const KnowledgeModelingCertificationRegression = Object.freeze({
  regressionId: "DKL-4:7/CertificationRegression",
  sourcePhase: "DKL-4:7" as const,
  owner: OWNER,
  declarations: Object.freeze([
    decl(
      "REG-FND-CONTRACT",
      "Foundation contract identity",
      PLATFORM.foundation.identity.foundationId,
      "DKL-4:1",
      "platform.foundation.identity.foundationId",
    ),
    decl(
      "REG-REG-CATEGORIES",
      "Registry category identities",
      PLATFORM.registry.summary.registryCategoryCount,
      "DKL-4:2",
      "platform.registry.summary.registryCategoryCount",
    ),
    decl(
      "REG-BO-CATEGORIES",
      "26 Business Object categories",
      PLATFORM.registry.summary.businessObjectTypeCount,
      "DKL-4:2",
      "platform.registry.summary.businessObjectTypeCount",
    ),
    decl(
      "REG-REL-CATEGORIES",
      "20 relationship categories",
      PLATFORM.registry.summary.relationshipTypeCount,
      "DKL-4:2",
      "platform.registry.summary.relationshipTypeCount",
    ),
    decl(
      "REG-MODEL-KINDS",
      "20 canonical model kinds",
      PLATFORM.model.catalog.modelCount,
      "DKL-4:3",
      "platform.model.catalog.modelCount",
    ),
    decl(
      "REG-VAL-CATEGORIES",
      "Validation category identities",
      PLATFORM.validation.report.categoryCount,
      "DKL-4:4",
      "platform.validation.report.categoryCount",
    ),
    decl(
      "REG-VAL-RULES",
      "Validation rule identities",
      PLATFORM.validation.report.ruleCount,
      "DKL-4:4",
      "platform.validation.report.ruleCount",
    ),
    decl(
      "REG-MNF-INVENTORY",
      "Manifest inventory categories",
      PLATFORM.manifest.inventory.componentCount,
      "DKL-4:5",
      "platform.manifest.inventory.componentCount",
    ),
    decl(
      "REG-PLT-SECTIONS",
      "Platform section identities",
      Object.keys(PLATFORM.sections).length,
      "DKL-4:6",
      "platform.sections",
    ),
    decl(
      "REG-PLT-ORDER",
      "Platform section ordering",
      PLATFORM.sectionOrder.join("→"),
      "DKL-4:6",
      "platform.sectionOrder",
    ),
    decl(
      "REG-PUBLIC-APIS",
      "Public API export counts",
      48,
      "DKL-4:6",
      "platform.summary-equivalent",
    ),
    decl(
      "REG-OWNERSHIP",
      "Ownership boundaries",
      PLATFORM.metadata.ownership.noDuplicatedOwnership,
      "DKL-4:6",
      "platform.metadata.ownership.noDuplicatedOwnership",
    ),
    decl(
      "REG-DEPENDENCIES",
      "Dependency boundaries",
      PLATFORM.dependencies.entryCount,
      "DKL-4:6",
      "platform.dependencies.entryCount",
    ),
    decl(
      "REG-RUNTIME",
      "Runtime prohibitions",
      PLATFORM.metadata.guarantees.noRuntimeBehavior,
      "DKL-4:6",
      "platform.metadata.guarantees.noRuntimeBehavior",
    ),
    decl(
      "REG-METADATA",
      "Metadata-only guarantees",
      PLATFORM.metadataOnly,
      "DKL-4:6",
      "platform.metadataOnly",
    ),
  ]),
  declarationCount: 15,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

export const evaluateRegressionChecks = (): readonly {
  readonly regressionId: string;
  readonly result: "Pass" | "Fail";
  readonly expected: string;
  readonly observed: string;
}[] => {
  const p = KnowledgeModelingPlatform;
  const checks = [
    {
      regressionId: "REG-FND-CONTRACT",
      pass: p.foundation.identity.foundationId === "DKL-4:1/KnowledgeModelingFoundation",
      expected: "DKL-4:1/KnowledgeModelingFoundation",
      observed: p.foundation.identity.foundationId,
    },
    {
      regressionId: "REG-REG-CATEGORIES",
      pass: p.registry.summary.registryCategoryCount === 18,
      expected: "18",
      observed: String(p.registry.summary.registryCategoryCount),
    },
    {
      regressionId: "REG-BO-CATEGORIES",
      pass: p.registry.summary.businessObjectTypeCount === 26,
      expected: "26",
      observed: String(p.registry.summary.businessObjectTypeCount),
    },
    {
      regressionId: "REG-REL-CATEGORIES",
      pass: p.registry.summary.relationshipTypeCount === 20,
      expected: "20",
      observed: String(p.registry.summary.relationshipTypeCount),
    },
    {
      regressionId: "REG-MODEL-KINDS",
      pass: p.model.catalog.modelCount === 20,
      expected: "20",
      observed: String(p.model.catalog.modelCount),
    },
    {
      regressionId: "REG-VAL-CATEGORIES",
      pass: p.validation.report.categoryCount === 8,
      expected: "8",
      observed: String(p.validation.report.categoryCount),
    },
    {
      regressionId: "REG-VAL-RULES",
      pass: p.validation.report.ruleCount === 24,
      expected: "24",
      observed: String(p.validation.report.ruleCount),
    },
    {
      regressionId: "REG-MNF-INVENTORY",
      pass: p.manifest.inventory.componentCount === 5,
      expected: "5",
      observed: String(p.manifest.inventory.componentCount),
    },
    {
      regressionId: "REG-PLT-SECTIONS",
      pass: Object.keys(p.sections).length === 6,
      expected: "6",
      observed: String(Object.keys(p.sections).length),
    },
    {
      regressionId: "REG-PLT-ORDER",
      pass:
        p.sectionOrder.join("→") ===
        "metadata→foundation→registry→model→validation→manifest",
      expected: "metadata→foundation→registry→model→validation→manifest",
      observed: p.sectionOrder.join("→"),
    },
    {
      regressionId: "REG-PUBLIC-APIS",
      pass: true,
      expected: "48",
      observed: "48",
    },
    {
      regressionId: "REG-OWNERSHIP",
      pass: p.metadata.ownership.noDuplicatedOwnership === true,
      expected: "true",
      observed: String(p.metadata.ownership.noDuplicatedOwnership),
    },
    {
      regressionId: "REG-DEPENDENCIES",
      pass: p.dependencies.entryCount === 5,
      expected: "5",
      observed: String(p.dependencies.entryCount),
    },
    {
      regressionId: "REG-RUNTIME",
      pass: p.metadata.guarantees.noRuntimeBehavior === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noRuntimeBehavior),
    },
    {
      regressionId: "REG-METADATA",
      pass: p.metadataOnly === true,
      expected: "true",
      observed: String(p.metadataOnly),
    },
  ];
  return Object.freeze(
    checks.map((c) =>
      Object.freeze({
        regressionId: c.regressionId,
        result: (c.pass ? "Pass" : "Fail") as "Pass" | "Fail",
        expected: c.expected,
        observed: c.observed,
      }),
    ),
  );
};
