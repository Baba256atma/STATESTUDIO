/** EX-3:1 metadata-only Foundation verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceFoundation,
  ExecutiveTimelineExperienceFoundationApprovedAliases,
  ExecutiveTimelineExperienceFoundationBoundaries,
  ExecutiveTimelineExperienceFoundationCapabilities,
  ExecutiveTimelineExperienceFoundationContracts,
  ExecutiveTimelineExperienceFoundationDependencyDeclaration,
  ExecutiveTimelineExperienceFoundationId,
  ExecutiveTimelineExperienceFoundationIdentity,
  ExecutiveTimelineExperienceFoundationLifecycle,
  ExecutiveTimelineExperienceFoundationLifecycleStates,
  ExecutiveTimelineExperienceFoundationLogicalDependencies,
  ExecutiveTimelineExperienceFoundationMission,
  ExecutiveTimelineExperienceFoundationMissionConcepts,
  ExecutiveTimelineExperienceFoundationNamespace,
  ExecutiveTimelineExperienceFoundationNonCapabilities,
  ExecutiveTimelineExperienceFoundationReadiness,
  ExecutiveTimelineExperienceFoundationStatus,
  ExecutiveTimelineExperienceFoundationSummaryValue,
  assertExecutiveTimelineExperienceFoundationIdentity,
  assertExecutiveTimelineExperienceFoundationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFoundationLifecycle,
  getExecutiveTimelineExperienceFoundationSummary,
  isExecutiveTimelineExperienceFoundationLifecycleState,
  resolveExecutiveTimelineExperienceFoundationIdentity,
} from "./executiveTimelineExperienceFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceFoundation.ts",
  "executiveTimelineExperienceFoundationTypes.ts",
  "executiveTimelineExperienceFoundationIdentity.ts",
  "executiveTimelineExperienceFoundationLifecycle.ts",
  "executiveTimelineExperienceFoundationContracts.ts",
  "executiveTimelineExperienceFoundationMetadata.ts",
  "executiveTimelineExperienceFoundationBoundaries.ts",
  "executiveTimelineExperienceFoundation.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:1 package inventory", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceFoundation(?:[A-Z].*)?(?:\.test)?\.ts$/
        .test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has no runtime imports of Stage, Journal, RTC, UI, or providers", () => {
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*(executiveStage|executiveJournal|rtc|react|next|provider)/i,
      );
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
    assert.equal(
      ExecutiveTimelineExperienceFoundationDependencyDeclaration
        .runtimeImportCount,
      0,
    );
  });

  it("does not authorize Registry from Foundation flags", () => {
    assert.equal(ExecutiveTimelineExperienceFoundation.registryCreated, false);
    assert.equal(
      ExecutiveTimelineExperienceFoundation.registryAuthorized,
      false,
    );
    assert.equal(ExecutiveTimelineExperienceFoundation.ex32Created, false);
    assert.equal(ExecutiveTimelineExperienceFoundation.ex32Authorized, false);
  });
});

describe("EX-3:1 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceFoundationId,
      "EX-3:1/ExecutiveTimelineExperienceFoundation",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationNamespace,
      "nexora.ex.executive.timeline.experience.foundation",
    );
    assert.equal(ExecutiveTimelineExperienceFoundationStatus, "Foundation");
    assert.equal(
      ExecutiveTimelineExperienceFoundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationIdentity.architecturalLayer,
      "Executive Experience (EX)",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationIdentity.module,
      "Executive Timeline Experience",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationIdentity
        .readyForRegistryAuthorizesEx32,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceFoundationId,
    ExecutiveTimelineExperienceFoundationNamespace,
    ...ExecutiveTimelineExperienceFoundationApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      const resolved = resolveExecutiveTimelineExperienceFoundationIdentity(
        value,
      );
      assert.equal(resolved.ok, true);
      assert.equal(
        assertExecutiveTimelineExperienceFoundationIdentity(value),
        ExecutiveTimelineExperienceFoundationId,
      );
    });
  }

  for (const value of [
    null,
    "",
    " EX-3:1",
    "ex-3:1",
    "EX-3:2",
    "EX-2:1",
    "ExecutiveTimelineExperienceFoundatio",
  ]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      const resolved = resolveExecutiveTimelineExperienceFoundationIdentity(
        value,
      );
      assert.equal(resolved.ok, false);
      assert.throws(() =>
        assertExecutiveTimelineExperienceFoundationIdentity(value)
      );
    });
  }
});

describe("EX-3:1 lifecycle", () => {
  it("allows only immediate forward transitions", () => {
    assert.equal(
      isExecutiveTimelineExperienceFoundationLifecycleState("Draft"),
      true,
    );
    assert.equal(
      isExecutiveTimelineExperienceFoundationLifecycleState(" draft"),
      false,
    );
    for (
      let index = 0;
      index < ExecutiveTimelineExperienceFoundationLifecycleStates.length - 1;
      index += 1
    ) {
      assert.equal(
        canTransitionExecutiveTimelineExperienceFoundationLifecycle(
          ExecutiveTimelineExperienceFoundationLifecycleStates[index],
          ExecutiveTimelineExperienceFoundationLifecycleStates[index + 1],
        ),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveTimelineExperienceFoundationLifecycle(
        "Draft",
        "Foundation",
      ),
      false,
    );
    assert.equal(
      canTransitionExecutiveTimelineExperienceFoundationLifecycle(
        "ReadyForRegistry",
        "Foundation",
      ),
      false,
    );
    assert.equal(
      assertExecutiveTimelineExperienceFoundationLifecycleTransition(
        "Foundation",
        "ReadyForRegistry",
      ),
      true,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationLifecycle.currentState,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationLifecycle.rollbackProhibited,
      true,
    );
  });
});

describe("EX-3:1 mission, capabilities, contracts, and boundaries", () => {
  it("declares timeline mission concepts as descriptive metadata", () => {
    assert.equal(
      ExecutiveTimelineExperienceFoundationMission.descriptiveOnly,
      true,
    );
    assert.deepEqual(
      [...ExecutiveTimelineExperienceFoundationMissionConcepts],
      [
        "Past",
        "Present",
        "Future",
        "TimeNavigation",
        "ExecutiveEvents",
        "WorkspaceTransitions",
        "JournalSynchronization",
        "DecisionHistory",
      ],
    );
  });

  it("publishes exactly eight declarative capabilities", () => {
    assert.equal(ExecutiveTimelineExperienceFoundationCapabilities.length, 8);
    ExecutiveTimelineExperienceFoundationCapabilities.forEach((entry, index) => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.declarativeOnly, true);
      assert.equal(entry.executable, false);
      assert.equal(Object.isFrozen(entry), true);
    });
  });

  it("publishes exactly twelve prohibited non-capabilities", () => {
    assert.equal(
      ExecutiveTimelineExperienceFoundationNonCapabilities.length,
      12,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationNonCapabilities.every(
        (entry) => entry.prohibited === true && Object.isFrozen(entry),
      ),
      true,
    );
    assert.ok(
      ExecutiveTimelineExperienceFoundationNonCapabilities.some(
        (entry) => entry.name === "RtcExecution",
      ),
    );
    assert.ok(
      ExecutiveTimelineExperienceFoundationNonCapabilities.some(
        (entry) => entry.name === "RenderingLogic",
      ),
    );
  });

  it("publishes exactly eight descriptive contracts", () => {
    assert.equal(ExecutiveTimelineExperienceFoundationContracts.length, 8);
    assert.equal(
      ExecutiveTimelineExperienceFoundationContracts.every(
        (contract, index) =>
          contract.order === index + 1
          && contract.descriptiveOnly === true
          && contract.runtimeEffects === false
          && contract.registryAuthorized === false
          && Object.isFrozen(contract),
      ),
      true,
    );
  });

  it("seals allowed and prohibited boundary surfaces", () => {
    assert.deepEqual(
      [...ExecutiveTimelineExperienceFoundationBoundaries.allowed],
      [
        "metadata",
        "contracts",
        "lifecycle",
        "identities",
        "capability declarations",
      ],
    );
    assert.deepEqual(
      [...ExecutiveTimelineExperienceFoundationBoundaries.prohibited],
      [
        "runtime",
        "RTC",
        "rendering",
        "persistence",
        "networking",
        "providers",
        "AI execution",
      ],
    );
    assert.equal(ExecutiveTimelineExperienceFoundationBoundaries.runtime, false);
    assert.equal(ExecutiveTimelineExperienceFoundationBoundaries.rtc, false);
    assert.equal(
      ExecutiveTimelineExperienceFoundationBoundaries.uiRendering,
      false,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationBoundaries
        .directRuntimeImportOfEx1OrEx2,
      false,
    );
  });
});

describe("EX-3:1 dependencies, aggregate, and summary", () => {
  it("declares logical Stage and Journal dependencies without runtime imports", () => {
    assert.equal(
      ExecutiveTimelineExperienceFoundationLogicalDependencies.length,
      2,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationLogicalDependencies[0]?.identity,
      "EX-1:9/ExecutiveStagePublicIndex",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationLogicalDependencies[1]?.identity,
      "EX-2:9/ExecutiveJournalExperiencePublicIndex",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationLogicalDependencies.every(
        (entry) => entry.runtimeImport === false && entry.logicalOnly === true,
      ),
      true,
    );
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceFoundation),
      true,
    );
    assert.equal(ExecutiveTimelineExperienceFoundation.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceFoundation.sideEffectFree, true);
    assert.equal(ExecutiveTimelineExperienceFoundation.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceFoundation.uiRendering, false);
    assert.equal(
      ExecutiveTimelineExperienceFoundation.animationImplementation,
      false,
    );
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveTimelineExperienceFoundationSummary(),
      ExecutiveTimelineExperienceFoundationSummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.capabilityCount,
      8,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.nonCapabilityCount,
      12,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.contractCount,
      8,
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.status,
      "Foundation",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveTimelineExperienceFoundationSummaryValue.registryAuthorized,
      false,
    );
    assert.equal(
      JSON.stringify(ExecutiveTimelineExperienceFoundationSummaryValue)
        .includes("payload"),
      false,
    );
  });
});
