import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DemoFlowState, DemoScript, DemoScriptStep } from "./demoScript";

export type DemoFlowControllerState = {
  flowState: DemoFlowState;
  currentStep: DemoScriptStep | null;
  currentStepIndex: number;
  totalSteps: number;
  autoplay: boolean;
  running: boolean;
  canStepBackward: boolean;
  canStepForward: boolean;
};

type StepTriggerSource = "manual" | "autoplay";

type UseDemoFlowControllerArgs = {
  script: DemoScript;
  enabled?: boolean;
  onRunStep: (step: DemoScriptStep, context: { index: number; source: StepTriggerSource }) => Promise<void> | void;
};

function stepStateFromIndex(script: DemoScript, index: number): DemoFlowState {
  if (index < 0 || index >= script.steps.length) return "idle";
  return script.steps[index]?.step_id ?? "idle";
}

export function useDemoFlowController(args: UseDemoFlowControllerArgs) {
  const { script, enabled = true, onRunStep } = args;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [autoplay, setAutoplay] = useState(false);
  const [running, setRunning] = useState(false);
  const runTokenRef = useRef(0);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
  const autoplayRef = useRef(false);

  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearAutoAdvance, [clearAutoAdvance]);

  const executeStep = useCallback(
    async (index: number, source: StepTriggerSource, keepAutoplay: boolean) => {
      if (!enabled) return;
      if (index < 0 || index >= script.steps.length) return;

      clearAutoAdvance();
      const token = runTokenRef.current + 1;
      runTokenRef.current = token;
      setCurrentStepIndex(index);
      setRunning(true);

      try {
        await onRunStep(script.steps[index], { index, source });
      } finally {
        if (runTokenRef.current !== token) return;
        setRunning(false);
        if (!keepAutoplay || !autoplayRef.current) return;
        const nextIndex = index + 1;
        if (nextIndex >= script.steps.length) {
          setAutoplay(false);
          return;
        }
        const nextDelay = Math.max(0, Number(script.steps[index]?.auto_advance_delay_ms ?? 1200));
        autoAdvanceTimeoutRef.current = window.setTimeout(() => {
          void executeStep(nextIndex, "autoplay", true);
        }, nextDelay);
      }
    },
    [clearAutoAdvance, enabled, onRunStep, script]
  );

  const start = useCallback(() => {
    setAutoplay(true);
    const startIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
    void executeStep(startIndex, "manual", true);
  }, [currentStepIndex, executeStep]);

  const restart = useCallback(() => {
    setAutoplay(false);
    void executeStep(0, "manual", false);
  }, [executeStep]);

  const pause = useCallback(() => {
    setAutoplay(false);
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  const notifyManualInteraction = useCallback(() => {
    setAutoplay(false);
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  const goToStep = useCallback(
    (index: number) => {
      setAutoplay(false);
      void executeStep(index, "manual", false);
    },
    [executeStep]
  );

  const stepForward = useCallback(() => {
    const nextIndex = Math.min(script.steps.length - 1, currentStepIndex + 1);
    setAutoplay(false);
    void executeStep(nextIndex < 0 ? 0 : nextIndex, "manual", false);
  }, [currentStepIndex, executeStep, script.steps.length]);

  const stepBackward = useCallback(() => {
    const prevIndex = Math.max(0, currentStepIndex - 1);
    setAutoplay(false);
    void executeStep(prevIndex, "manual", false);
  }, [currentStepIndex, executeStep]);

  const currentStep = currentStepIndex >= 0 ? script.steps[currentStepIndex] ?? null : null;

  const controllerState = useMemo<DemoFlowControllerState>(
    () => ({
      flowState: stepStateFromIndex(script, currentStepIndex),
      currentStep,
      currentStepIndex,
      totalSteps: script.steps.length,
      autoplay,
      running,
      canStepBackward: currentStepIndex > 0,
      canStepForward: currentStepIndex < script.steps.length - 1,
    }),
    [autoplay, currentStep, currentStepIndex, running, script]
  );

  return {
    ...controllerState,
    start,
    restart,
    pause,
    goToStep,
    stepForward,
    stepBackward,
    notifyManualInteraction,
  };
}
