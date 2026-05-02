export type ChatQAScenario = {
  id: string;
  description: string;
  inputs: string[];
  expected: {
    noPanelFlash?: boolean;
    latestWins?: boolean;
    noOverwrite?: boolean;
    noSceneReset?: boolean;
    noDuplicateScene?: boolean;
  };
};

export const CHAT_QA_SCENARIOS: ChatQAScenario[] = [
  {
    id: "repeat_input",
    description: "Repeated input should not flash panel",
    inputs: ["open risk", "open risk", "open risk"],
    expected: { noPanelFlash: true, noDuplicateScene: true },
  },
  {
    id: "rapid_switch",
    description: "Rapid panel switch should apply only latest",
    inputs: ["open timeline", "open dashboard"],
    expected: { latestWins: true },
  },
  {
    id: "low_confidence",
    description: "Low confidence should not overwrite meaningful panel",
    inputs: ["what is going on?"],
    expected: { noOverwrite: true },
  },
  {
    id: "fallback",
    description: "Fallback should not reset panel or scene",
    inputs: ["???"],
    expected: { noSceneReset: true, noOverwrite: true },
  },
  {
    id: "duplicate_message",
    description: "Same message should not duplicate scene reaction",
    inputs: ["analyze risk", "analyze risk"],
    expected: { noDuplicateScene: true },
  },
  {
    id: "analyze_without_object",
    description: "Analyze should be blocked when no object is selected",
    inputs: ["analyze risk"],
    expected: { noSceneReset: true, noOverwrite: true },
  },
];

export type ChatQARunResult = {
  scenarioId: string;
  logs: any[];
  pass: boolean;
  details: string[];
};

export type ChatQAFixtureControls = {
  clearExplicitSelection?: () => void;
  restoreExplicitSelection?: () => void;
};

function normalize(v: string): string {
  return String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function stepWasLoopSkipped(log: {
  runSnapshot?: { loopGuard?: Record<string, unknown> };
  loopGuard?: Record<string, unknown> | null;
}): boolean {
  const lg = log?.runSnapshot?.loopGuard ?? log?.loopGuard ?? undefined;
  return lg?.dedupedRapidDuplicate === true || lg?.skippedReentrantRun === true;
}

function getIdempotency(log: { runSnapshot?: Record<string, unknown>; idempotency?: unknown }): Record<string, unknown> | undefined {
  const raw = log?.runSnapshot?.idempotency ?? log?.idempotency;
  return raw !== undefined && typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : undefined;
}

function stepWasPanelIdempotentSkip(log: { runSnapshot?: Record<string, unknown>; idempotency?: unknown }): boolean {
  return getIdempotency(log)?.panelSkipped === true;
}

function stepHadSceneReactionApplied(log: {
  runSnapshot?: { sceneReactionApplied?: unknown };
  sceneReactionApplied?: unknown;
}): boolean {
  return (
    log?.runSnapshot?.sceneReactionApplied === true ||
    log?.sceneReactionApplied === true
  );
}

function stepWasSceneIdempotentSkip(log: { runSnapshot?: Record<string, unknown>; idempotency?: unknown }): boolean {
  return getIdempotency(log)?.sceneSkipped === true;
}

export function detectPanelFlash(panelHistory: string[], logs?: any[]): boolean {
  let repeatedOpenCount = 0;
  for (let i = 1; i < panelHistory.length; i += 1) {
    if (panelHistory[i] && panelHistory[i] === panelHistory[i - 1]) {
      if (logs) {
        const prevSkip = stepWasLoopSkipped(logs[i - 1]);
        const currSkip = stepWasLoopSkipped(logs[i]);
        const prevPanelIdem = stepWasPanelIdempotentSkip(logs[i - 1]);
        const currPanelIdem = stepWasPanelIdempotentSkip(logs[i]);
        if (currSkip || prevSkip || currPanelIdem || prevPanelIdem) continue;
      }
      repeatedOpenCount += 1;
    }
  }
  return repeatedOpenCount >= 2;
}

/** True only if the same non-empty scene signature was applied to the scene more than once (ignores debug-only repeats / idempotent skips). */
export function detectDuplicateScene(sceneSignatures: string[], logs?: any[]): boolean {
  const seen = new Set<string>();
  for (let i = 0; i < sceneSignatures.length; i += 1) {
    if (logs && stepWasLoopSkipped(logs[i])) continue;
    if (logs && stepWasSceneIdempotentSkip(logs[i])) continue;
    if (logs && !stepHadSceneReactionApplied(logs[i])) continue;
    const s = String(sceneSignatures[i] ?? "").trim();
    if (!s) continue;
    if (seen.has(s)) return true;
    seen.add(s);
  }
  return false;
}

export function detectOverwrite(prevPanel: string, nextPanel: string, confidence: number): boolean {
  const prev = String(prevPanel ?? "").trim();
  const next = String(nextPanel ?? "").trim();
  if (!prev || !next || prev === next) return false;
  if (confidence >= 0.45) return false;
  const meaningful = new Set(["dashboard", "risk", "timeline", "war_room", "executive_object"]);
  return meaningful.has(prev) && !meaningful.has(next);
}

export function getChatPipelineDebugState(): any {
  if (typeof window === "undefined") return {};
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  return (w.__NEXORA_DEBUG__?.chatPipeline as Record<string, unknown>) ?? {};
}

export async function runChatQAScenario(
  scenario: ChatQAScenario,
  runChat: (input: string) => Promise<any>,
  getDebugState: () => any,
  fixtures?: ChatQAFixtureControls
): Promise<ChatQARunResult> {
  const logs: any[] = [];
  const details: string[] = [];

  if (scenario.id === "analyze_without_object") {
    fixtures?.clearExplicitSelection?.();
    await wait(50);
  }

  for (const input of scenario.inputs) {
    const runSnapshot = await runChat(input);
    const state = getDebugState();
    logs.push({
      input,
      runSnapshot,
      panelView: state?.panelView ?? null,
      sceneSignature: state?.sceneSignature ?? null,
      confidence: Number(state?.confidence ?? 0),
      stabilityReason: state?.stabilityReason ?? null,
      staleSkipped: state?.staleSkipped === true,
      lifecycleStatus: state?.lifecycleStatus ?? null,
      loopGuard: state?.loopGuard ?? null,
      idempotency: state?.idempotency ?? null,
      sceneReactionApplied: state?.sceneReactionApplied === true,
      selectedObjectGuard: state?.selectedObjectGuard ?? null,
    });
    await wait(350);
  }

  const panelHistory = logs.map((l) => String(l.panelView ?? ""));
  const sceneSignatures = logs.map((l) => String(l.sceneSignature ?? ""));
  const confidenceHistory = logs.map((l) => Number(l.confidence ?? 0));

  let pass = true;

  if (scenario.id === "analyze_without_object") {
    const st = logs[0];
    const g = (st?.runSnapshot?.selectedObjectGuard ?? st?.selectedObjectGuard) as
      | Record<string, unknown>
      | undefined;
    if (g?.blocked !== true) {
      pass = false;
      details.push("Expected selectedObjectGuard.blocked === true when no object is selected.");
    }
    if (logs.some((l) => l.sceneReactionApplied === true)) {
      pass = false;
      details.push("Scene reaction must not apply when the selected-object guard blocks.");
    }
    const forbiddenPanels = new Set(["risk", "fragility", "timeline", "war_room", "explanation"]);
    for (const l of logs) {
      const v = String(l.panelView ?? "").trim().toLowerCase();
      if (forbiddenPanels.has(v)) {
        pass = false;
        details.push(`Risk/sim panel should not be forced open; got "${v}".`);
        break;
      }
    }
    const hint = String(g?.assistantMessage ?? "").toLowerCase();
    if (!hint.includes("select") || !hint.includes("object")) {
      pass = false;
      details.push("Assistant message should ask the user to select an object.");
    }
  }

  if (scenario.expected.noPanelFlash) {
    const flashed = detectPanelFlash(panelHistory, logs);
    if (flashed) {
      pass = false;
      details.push("Panel flash detected: same panel reopened repeatedly.");
    }
  }

  if (scenario.expected.noDuplicateScene) {
    const duplicated = detectDuplicateScene(sceneSignatures, logs);
    if (duplicated) {
      pass = false;
      details.push("Duplicate scene signature detected.");
    }
  }

  if (scenario.expected.latestWins) {
    const lastInput = scenario.inputs[scenario.inputs.length - 1] ?? "";
    const finalPanel = panelHistory[panelHistory.length - 1] ?? "";
    const expectedPanel =
      normalize(lastInput).includes("dashboard")
        ? "dashboard"
        : normalize(lastInput).includes("timeline")
          ? "timeline"
          : finalPanel;
    if (expectedPanel && finalPanel !== expectedPanel) {
      pass = false;
      details.push(`Latest-wins failed: expected "${expectedPanel}" got "${finalPanel}".`);
    }
  }

  if (scenario.expected.noOverwrite && panelHistory.length >= 2) {
    for (let i = 1; i < panelHistory.length; i += 1) {
      if (detectOverwrite(panelHistory[i - 1], panelHistory[i], confidenceHistory[i] ?? 0)) {
        pass = false;
        details.push(`Low-confidence overwrite detected: "${panelHistory[i - 1]}" -> "${panelHistory[i]}".`);
        break;
      }
    }
  }

  if (scenario.expected.noSceneReset) {
    const resetDetected = sceneSignatures.some((sig) => !String(sig ?? "").trim());
    if (resetDetected) {
      pass = false;
      details.push("Scene reset detected (empty scene signature).");
    }
  }

  if (details.length === 0) {
    details.push("All checks passed.");
  }

  return {
    scenarioId: scenario.id,
    logs,
    pass,
    details,
  };
}

