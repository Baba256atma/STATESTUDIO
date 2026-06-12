import { describe, expect, it, beforeEach } from "vitest";

import {
  HUD_RUNTIME_FREEZE_V1,
  HUD_SUPPORTED_MIN_VIEWPORT_WIDTH_PX,
  isHudRuntimeFrozen,
} from "./hudRuntimeFreezeContract.ts";
import {
  resetHudRuntimeFreezeDiagnosticsForTests,
} from "./hudRuntimeFreezeDiagnostics.ts";
import {
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
} from "../scene/sceneHudZoneContract.ts";
import {
  resetObjectPanelSafeZoneForTests,
} from "./objectPanelSafeZoneRuntime.ts";
import { resetTimelineZoneForTests } from "./timelineZoneRuntime.ts";
import {
  runHudRuntimeFreezeValidation,
  runHudRuntimeQaScenario,
  runObjectClickFreezeQaSequence,
  validateHudRuntimeFreezeSignatureStability,
  validateObjectClickSingleWriteBehavior,
} from "./hudRuntimeFreezeValidation.ts";
import { resetObjectClickPanelDedupForTests } from "./objectClickPanelDedupRuntime.ts";

describe("hudRuntimeFreezeContract", () => {
  it("declares HUD runtime frozen", () => {
    expect(isHudRuntimeFrozen()).toBe(true);
    expect(HUD_RUNTIME_FREEZE_V1.id).toBe("HUD_RUNTIME_FREEZE_V1");
    expect(HUD_RUNTIME_FREEZE_V1.phases).toContain("MRP_HUD:10:2");
    expect(HUD_RUNTIME_FREEZE_V1.phases).toContain("MRP_HUD:10:3");
    expect(HUD_RUNTIME_FREEZE_V1.phases).toContain("MRP_HUD:10:5A");
  });

  it("freezes object-click single-write behavior", () => {
    expect(HUD_RUNTIME_FREEZE_V1.frozenSubsystems).toContain("object_click_panel_dedup_runtime");
    expect(HUD_RUNTIME_FREEZE_V1.frozenBehaviors.objectClickSingleWrite.maxWritesPerClick).toBe(1);
  });

  it("freezes safe-zone behaviors and not visual polish", () => {
    expect(HUD_RUNTIME_FREEZE_V1.frozenSubsystems).toContain("object_panel_safe_zone_contract");
    expect(HUD_RUNTIME_FREEZE_V1.notFrozen).toContain("visual_polish");
  });
});

describe("hudRuntimeFreezeValidation QA scenarios", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
    resetObjectPanelSafeZoneForTests();
    resetTimelineZoneForTests();
    resetHudRuntimeFreezeDiagnosticsForTests();
    resetObjectClickPanelDedupForTests();
  });

  it("1 — fresh load /type-c desktop", () => {
    const result = runHudRuntimeQaScenario({ scenario: "fresh_load" });
    expect(result.overall).not.toBe("fail");
    expect(result.checks.objectPanelMrpCollision).toBe(false);
    expect(result.checks.timelineObjectPanelCollision).toBe(false);
  });

  it("2 — dashboard tab active", () => {
    const result = runHudRuntimeQaScenario({
      scenario: "dashboard_tab",
      activeMrpTab: "dashboard",
    });
    expect(result.overall).not.toBe("fail");
    expect(result.zones.mrp).toBe("pass");
  });

  it("3 — assistant tab active", () => {
    const result = runHudRuntimeQaScenario({
      scenario: "assistant_tab",
      activeMrpTab: "assistant",
    });
    expect(result.overall).not.toBe("fail");
    expect(result.zones.assistant).toBe("pass");
  });

  it("4 — select object A (single-write)", () => {
    const result = runHudRuntimeQaScenario({ scenario: "select_object_a" });
    expect(result.checks.objectClickPanelLoop).toBe(false);
    expect(result.checks.objectClickSingleWrite).toBe(true);
    expect(result.zones.objectPanel).toBe("pass");
  });

  it("5 — select object B (expanded panel)", () => {
    const result = runHudRuntimeQaScenario({ scenario: "select_object_b" });
    expect(result.zones.objectPanel).toBe("pass");
    expect(result.zones.timeline).toBe("pass");
  });

  it("6 — deselect canvas", () => {
    const result = runHudRuntimeQaScenario({ scenario: "deselect_canvas" });
    expect(result.overall).not.toBe("fail");
  });

  it("7 — assistant support panels", () => {
    const result = runHudRuntimeQaScenario({ scenario: "assistant_support_panels" });
    expect(result.zones.assistant).toBe("pass");
  });

  it("8 — resize viewports", () => {
    for (const viewportWidth of [1440, 1280, 1024, 900, 768]) {
      resetSceneHudZoneContractForTests();
      const result = runHudRuntimeQaScenario({
        scenario: "resize_viewport",
        viewportWidth,
      });
      expect(result.checks.visibleOverlap).toBe(false);
      expect(result.zones.timeline).not.toBe("fail");
      expect(result.zones.objectPanel).not.toBe("fail");
    }
  });

  it("9 — idle 60s signature stability", () => {
    const contract = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      sceneWidth: 900,
      sceneHeight: 800,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
      timelineVisible: true,
    });
    expect(
      validateHudRuntimeFreezeSignatureStability(contract, {
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
        sceneWidth: 900,
      })
    ).toBe(true);

    const idleResult = runHudRuntimeQaScenario({ scenario: "idle_60s" });
    expect(idleResult.checks.objectClickIdleReplay).toBe(true);
    expect(idleResult.checks.objectClickPanelLoop).toBe(false);
  });

  it("10 — console inspection baseline", () => {
    const result = runHudRuntimeQaScenario({ scenario: "console_inspection" });
    expect(result.checks.hudZoneBrakeWouldSpam).toBe(false);
    expect(result.checks.repeatedLayoutWrites).toBe(false);
    expect(result.checks.objectClickSingleWrite).toBe(true);
    expect(result.freezeId).toBe(HUD_RUNTIME_FREEZE_V1.id);
  });
});

describe("object click freeze QA sequence", () => {
  beforeEach(() => {
    resetObjectClickPanelDedupForTests();
  });

  it("A → 3s → B → 3s → A → 10s idle produces exactly 3 writes", () => {
    const sequence = runObjectClickFreezeQaSequence();
    expect(sequence.appliedWrites).toBe(3);
    expect(sequence.writeSequence).toEqual(["obj-a", "obj-b", "obj-a"]);
    expect(sequence.duplicateWritesBlocked).toBeGreaterThanOrEqual(1);
    expect(sequence.idleReplayBlocked).toBe(true);
    expect(sequence.objectClickPanelLoop).toBe(false);
  });

  it("validateObjectClickSingleWriteBehavior passes", () => {
    expect(validateObjectClickSingleWriteBehavior().pass).toBe(true);
  });
});

describe("hudRuntimeFreezeValidation collisions", () => {
  beforeEach(() => {
    resetSceneHudZoneContractForTests();
    resetHudRuntimeFreezeDiagnosticsForTests();
  });

  it("passes at supported minimum viewport width", () => {
    const contract = resolveSceneHudZoneContract({
      viewportWidth: HUD_SUPPORTED_MIN_VIEWPORT_WIDTH_PX,
      viewportHeight: 900,
      sceneWidth: 480,
      sceneHeight: 800,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
      timelineVisible: true,
    });
    const result = runHudRuntimeFreezeValidation({
      sceneHudContract: contract,
      context: {
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
        sceneWidth: 480,
      },
      useVisibleMrpHost: true,
    });
    expect(result.overall).not.toBe("fail");
  });
});
