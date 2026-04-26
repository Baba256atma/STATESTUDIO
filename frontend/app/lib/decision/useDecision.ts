"use client";

import { useEffect, useState } from "react";

import type { DecisionInsightOutput } from "./decisionIntelligenceTypes";
import { getDecision, subscribeDecision } from "./decisionStore";

export function useDecision(): DecisionInsightOutput | null {
  const [decision, setDecision] = useState<DecisionInsightOutput | null>(() => getDecision());

  useEffect(() => {
    return subscribeDecision(setDecision);
  }, []);

  return decision;
}
