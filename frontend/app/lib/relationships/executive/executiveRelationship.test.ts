import { describe, expect, it, beforeEach } from "vitest";

import {
  classifyExecutiveRelationship,
  createRelationshipAnimationContract,
  createRelationshipPropagationContract,
  DEFAULT_RELATIONSHIP_DENSITY_MODE,
  evaluateExecutiveRelationshipMetadata,
  getRelationshipRenderPlan,
  resetExecutiveRelationshipInstrumentationForTests,
  resetRelationshipDensityForTests,
  resolveExecutiveRelationshipScenePlan,
  resolveRelationshipContext,
  resolveRelationshipFocusRole,
} from "./index";
import type { NexoraRelationship } from "../relationshipTypes";

const baseRelationship = (overrides: Partial<NexoraRelationship> = {}): NexoraRelationship => ({
  id: "rel-1",
  sourceId: "obj-a",
  targetId: "obj-b",
  type: "dependency",
  direction: "uni",
  createdAt: "2026-01-01T00:00:00.000Z",
  metadata: { strength: 0.8 },
  ...overrides,
});

describe("executive relationship runtimes", () => {
  beforeEach(() => {
    resetExecutiveRelationshipInstrumentationForTests();
    resetRelationshipDensityForTests();
  });

  it("classifies dependency, influence, and risk types", () => {
    expect(classifyExecutiveRelationship(baseRelationship({ type: "dependency" }))).toBe("DEPENDENCY");
    expect(classifyExecutiveRelationship(baseRelationship({ type: "influences" }))).toBe("INFLUENCE");
    expect(classifyExecutiveRelationship(baseRelationship({ type: "risk" }))).toBe("RISK");
  });

  it("evaluates executive relationship metadata", () => {
    const metadata = evaluateExecutiveRelationshipMetadata(baseRelationship({ type: "risk" }));
    expect(metadata.relationshipType).toBe("RISK");
    expect(metadata.relationshipImportance).toBeGreaterThan(0.5);
    expect(metadata.propagationPotential).toBeGreaterThan(0.5);
  });

  it("focuses direct dependencies when object selected", () => {
    const role = resolveRelationshipFocusRole({
      relationship: baseRelationship(),
      selectedObjectId: "obj-a",
    });
    expect(role).toBe("direct_dependency");
  });

  it("defaults density mode to executive and hides low-importance links", () => {
    expect(DEFAULT_RELATIONSHIP_DENSITY_MODE).toBe("EXECUTIVE");
    const relationships = [
      baseRelationship({ id: "r1", metadata: { strength: 0.9 } }),
      baseRelationship({ id: "r2", type: "information", metadata: { strength: 0.1 } }),
      baseRelationship({ id: "r3", sourceId: "obj-x", targetId: "obj-y", metadata: { strength: 0.1 } }),
    ];
    const plan = resolveExecutiveRelationshipScenePlan({ relationships });
    expect(plan.densityMode).toBe("EXECUTIVE");
    expect(getRelationshipRenderPlan(plan, "r1")?.visible).toBe(true);
    expect(getRelationshipRenderPlan(plan, "r3")?.visible).toBe(false);
  });

  it("highlights selected object network context while keeping unrelated lines visible", () => {
    const relationships = [
      baseRelationship({ id: "dep", type: "dependency" }),
      baseRelationship({ id: "risk", type: "risk", metadata: { strength: 0.95 } }),
      baseRelationship({ id: "other", sourceId: "obj-x", targetId: "obj-y", metadata: { strength: 0.2 } }),
    ];
    const plan = resolveExecutiveRelationshipScenePlan({
      relationships,
      selectedObjectId: "obj-a",
    });
    expect(getRelationshipRenderPlan(plan, "dep")?.focusRole).toBe("direct_dependency");
    expect(getRelationshipRenderPlan(plan, "dep")?.visible).toBe(true);
    expect(getRelationshipRenderPlan(plan, "risk")?.focusRole).toBe("major_risk_route");
    expect(getRelationshipRenderPlan(plan, "risk")?.visible).toBe(true);
    expect(getRelationshipRenderPlan(plan, "other")?.focusRole).toBe("unrelated");
    expect(getRelationshipRenderPlan(plan, "other")?.visible).toBe(true);
  });

  it("keeps direct dependency and unrelated relationships visible when object selected", () => {
    const relationships = [
      baseRelationship({ id: "dep", type: "dependency" }),
      baseRelationship({
        id: "unrelated",
        sourceId: "obj-x",
        targetId: "obj-y",
        type: "information",
        metadata: { strength: 0.1 },
      }),
    ];
    const plan = resolveExecutiveRelationshipScenePlan({
      relationships,
      selectedObjectId: "obj-a",
    });
    const depPlan = getRelationshipRenderPlan(plan, "dep");
    const unrelatedPlan = getRelationshipRenderPlan(plan, "unrelated");
    expect(depPlan?.focusRole).toBe("direct_dependency");
    expect(depPlan?.visible).toBe(true);
    expect(unrelatedPlan?.focusRole).toBe("unrelated");
    expect(unrelatedPlan?.visible).toBe(true);
  });

  it("builds relationship context for object info", () => {
    const labels = new Map([
      ["obj-a", "Supplier Hub"],
      ["obj-b", "Distribution Node"],
    ]);
    const context = resolveRelationshipContext({
      objectId: "obj-a",
      objectLabels: labels,
      relationships: [
        baseRelationship({ id: "dep", type: "dependency" }),
        baseRelationship({ id: "inf", type: "influences", targetId: "obj-c", metadata: { strength: 0.9 } }),
        baseRelationship({ id: "risk", type: "risk", metadata: { strength: 0.88 } }),
      ],
    });
    expect(context.mostCriticalDependency?.relationshipId).toBe("dep");
    expect(context.mostInfluentialConnection?.relationshipId).toBe("inf");
    expect(context.highestRiskRelationship?.relationshipId).toBe("risk");
  });

  it("creates propagation and animation contracts", () => {
    const relationship = baseRelationship({ type: "risk" });
    const propagation = createRelationshipPropagationContract(relationship);
    expect(propagation.readyForRiskPropagation).toBe(true);
    const animation = createRelationshipAnimationContract(relationship);
    expect(animation.enabled).toBe(false);
    expect(animation.supportedAnimations.length).toBeGreaterThan(0);
  });
});
