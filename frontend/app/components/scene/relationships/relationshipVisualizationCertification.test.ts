import { describe, expect, it } from "vitest";

import {
  REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  REL_UX3_CERTIFICATION_GATE_TITLES,
  REL_UX3_CERTIFICATION_TAGS,
  REL_UX3_CERTIFICATION_VERSION,
} from "./relationshipVisualizationCertificationContract";
import { certifyRelationshipVisualization } from "./relationshipVisualizationCertification";

describe("relationshipVisualizationCertification", () => {
  it("exports REL-UX-3 relationship visualization certification tags and diagnostic", () => {
    expect(REL_UX3_CERTIFICATION_VERSION).toBe("REL-UX-3");
    expect(REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC).toBe(
      "[RelationshipVisualizationCertification] Certification Complete"
    );
    expect(REL_UX3_CERTIFICATION_TAGS).toEqual([
      "[REL_UX3_CERTIFIED]",
      "[FLOW_BALLS_CERTIFIED]",
      "[RELATIONSHIP_VISUALIZATION_STABLE]",
      "[EXECUTIVE_UX_READY]",
      "[REL_UX3_COMPLETE]",
    ]);
  });

  it("passes gates A through O", () => {
    const result = certifyRelationshipVisualization({
      buildPassed: true,
      testsPassed: true,
    });

    expect(result.version).toBe("REL-UX-3");
    expect(result.certified).toBe(true);
    expect(result.result).toBe("PASS");
    expect(result.gates).toHaveLength(15);
    expect(result.gates.every((entry) => entry.status === "PASS")).toBe(true);
    expect(result.scenarios).toHaveLength(5);
    expect(result.scenarios.every((entry) => entry.status === "PASS")).toBe(true);
    expect(result.diagnostics).toContain(REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.gates)).toBe(true);
    expect(Object.isFrozen(result.scenarios)).toBe(true);
  });

  it("exposes required gates", () => {
    const result = certifyRelationshipVisualization();
    const gateNames = result.gates.map((entry) => entry.name);

    expect(gateNames).toEqual(Object.values(REL_UX3_CERTIFICATION_GATE_TITLES));
    expect(gateNames).toContain("Object Selection");
    expect(gateNames).toContain("Flow Balls Runtime");
    expect(gateNames).toContain("100 Relationship Stress Test");
    expect(gateNames).toContain("No Memory Leak");
    expect(gateNames).toContain("Build Passes");
  });

  it("exposes stress and flow scenarios", () => {
    const result = certifyRelationshipVisualization();
    const scenarioIds = result.scenarios.map((entry) => entry.id);

    expect(scenarioIds).toEqual([
      "fifty_relationship_stress",
      "hundred_relationship_stress",
      "object_click_visual_response",
      "workspace_switching_isolation",
      "flow_ball_budget",
    ]);
  });

  it("fails when build verification fails", () => {
    const result = certifyRelationshipVisualization({
      buildPassed: false,
      testsPassed: true,
    });

    expect(result.certified).toBe(false);
    expect(result.result).toBe("FAIL");
    expect(result.gates.find((entry) => entry.id === "O")?.status).toBe("FAIL");
  });
});
