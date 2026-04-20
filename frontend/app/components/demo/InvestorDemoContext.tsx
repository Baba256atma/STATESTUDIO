"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type InvestorDemoState = {
  active: boolean;
  /** 0 = init, 1–5 = guided beats. */
  step: number;
};

export const INVESTOR_DEMO_MAX_STEP = 5;

type InvestorDemoContextValue = {
  demo: InvestorDemoState;
  startDemo: () => void;
  exitDemo: () => void;
  nextStep: () => void;
  backStep: () => void;
};

const InvestorDemoContext = createContext<InvestorDemoContextValue | null>(null);

export function InvestorDemoProvider({ children }: { children: React.ReactNode }) {
  const [demo, setDemo] = useState<InvestorDemoState>({ active: false, step: 0 });

  const startDemo = useCallback(() => {
    setDemo({ active: true, step: 0 });
  }, []);

  const exitDemo = useCallback(() => {
    setDemo({ active: false, step: 0 });
  }, []);

  const nextStep = useCallback(() => {
    setDemo((prev) => {
      if (process.env.NODE_ENV !== "production") {
        const canGoNext = prev.active && prev.step <= INVESTOR_DEMO_MAX_STEP;
        console.log("[Nexora][Demo]", { active: prev.active, step: prev.step, canGoNext });
      }
      if (!prev.active) return prev;
      if (prev.step >= INVESTOR_DEMO_MAX_STEP) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[Nexora][Demo][Next]", { action: "finish_exit" });
        }
        return { active: false, step: 0 };
      }
      const nextStepNum = prev.step + 1;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][Demo][Next]", { action: "advance", step: nextStepNum });
      }
      return { active: true, step: nextStepNum };
    });
  }, []);

  const backStep = useCallback(() => {
    setDemo((d) => (d.active ? { active: true, step: Math.max(0, d.step - 1) } : d));
  }, []);

  const value = useMemo(
    () => ({ demo, startDemo, exitDemo, nextStep, backStep }),
    [demo, startDemo, exitDemo, nextStep, backStep]
  );

  return <InvestorDemoContext.Provider value={value}>{children}</InvestorDemoContext.Provider>;
}

export function useInvestorDemo(): InvestorDemoContextValue {
  const ctx = useContext(InvestorDemoContext);
  if (!ctx) {
    throw new Error("useInvestorDemo must be used within InvestorDemoProvider");
  }
  return ctx;
}

export function useInvestorDemoOptional(): InvestorDemoContextValue | null {
  return useContext(InvestorDemoContext);
}
