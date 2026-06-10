import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ASSISTANT_RAIL_BASE_WIDTH_PX,
  ASSISTANT_RAIL_WIDE_WIDTH_PX,
  ASSISTANT_READING_MIN_CHARS_PER_LINE,
  ASSISTANT_SCENE_DOMINANCE_MIN_RATIO,
  evaluateAssistantReadingComfort,
  resolveAssistantContentWidthPx,
  resolveAssistantRailLayoutTraceLog,
  resolveMaxAssistantWidthForSceneDominance,
} from "./assistantRailLayoutContract.ts";
import { ASSISTANT_READING_COMFORT_TOKENS } from "./assistantReadingComfortTokens.ts";
import {
  buildAssistantRailLayoutMeasurement,
  resolveAssistantRailWidth,
} from "./assistantRailWidthRuntime.ts";

describe("assistantRailLayout", () => {
  it("Test 1 — executive desktop assistant width targets reading comfort", () => {
    const width = resolveAssistantRailWidth({ viewportWidth: 1440, preset: "executive" });
    assert.ok(width >= ASSISTANT_RAIL_BASE_WIDTH_PX);
    const contentWidth = resolveAssistantContentWidthPx(width);
    assert.equal(evaluateAssistantReadingComfort(contentWidth), "pass");
  });

  it("Test 2 — long response content width exceeds minimum chars per line", () => {
    const contentWidth = resolveAssistantContentWidthPx(420);
    const chars = Math.floor(contentWidth / 6.4);
    assert.ok(chars >= ASSISTANT_READING_MIN_CHARS_PER_LINE);
  });

  it("Test 3 — scene dominance cap prevents assistant overpowering workspace", () => {
    const width1440 = resolveAssistantRailWidth({ viewportWidth: 1440, preset: "executive" });
    const sceneWidth = 1440 - width1440 - 192;
    const ratio = sceneWidth / 1440;
    assert.ok(ratio >= ASSISTANT_SCENE_DOMINANCE_MIN_RATIO - 0.02);
  });

  it("Test 4 — suggested question chips use balanced wrap mode", () => {
    assert.equal(ASSISTANT_READING_COMFORT_TOKENS.chips.flexBasis.includes("50%"), true);
  });

  it("Test 5 — wide desktop expands assistant moderately", () => {
    const wide = resolveAssistantRailWidth({ viewportWidth: 1680, preset: "executive" });
    const compact = resolveAssistantRailWidth({ viewportWidth: 1320, preset: "executive" });
    assert.equal(wide, ASSISTANT_RAIL_WIDE_WIDTH_PX);
    assert.ok(wide >= compact);
  });

  it("Test 6 — tablet width remains responsive", () => {
    const tablet = resolveAssistantRailWidth({ viewportWidth: 1100, preset: "executive" });
    assert.ok(tablet >= 320);
    assert.ok(tablet <= resolveMaxAssistantWidthForSceneDominance(1100));
  });

  it("Test 7 — layout measurement computes scene-to-assistant ratio", () => {
    const measurement = buildAssistantRailLayoutMeasurement({
      viewportWidth: 1440,
      sceneWidth: 828,
      assistantWidth: 420,
      timelineWidth: 860,
    });
    assert.ok(measurement.sceneToAssistantRatio > 1.9);
    assert.equal(measurement.readingComfort, "pass");
  });

  it("Test 8 — reading comfort trace format", () => {
    const log = resolveAssistantRailLayoutTraceLog({
      assistantWidth: 420,
      sceneWidth: 828,
      readingComfort: "pass",
      chipWrapMode: "enabled",
    });
    assert.match(log, /assistantWidth=420/);
    assert.match(log, /sceneWidth=828/);
    assert.match(log, /readingComfort=pass/);
    assert.match(log, /chipWrapMode=enabled/);
  });

  it("Test 9 — analysis preset receives modest width bonus", () => {
    const executive = resolveAssistantRailWidth({ viewportWidth: 1440, preset: "executive" });
    const analysis = resolveAssistantRailWidth({ viewportWidth: 1440, preset: "analysis" });
    assert.ok(analysis >= executive);
  });

  it("Test 10 — conversation tokens increase line rhythm", () => {
    assert.ok(ASSISTANT_READING_COMFORT_TOKENS.conversation.lineHeight >= 1.6);
    assert.equal(ASSISTANT_READING_COMFORT_TOKENS.conversation.assistantMaxWidth, "100%");
  });
});
