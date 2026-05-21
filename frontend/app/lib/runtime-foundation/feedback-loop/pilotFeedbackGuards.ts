import type {
  FeedbackCategory,
  FeedbackSeverity,
  MVPPilotFeedback,
  MVPPilotFeedbackCapture,
  PilotLearningSnapshot,
} from "./pilotFeedbackTypes";

export const PILOT_FEEDBACK_MAX_ENTRIES = 20;
export const PILOT_FEEDBACK_MAX_SNAPSHOTS = 8;
export const PILOT_FEEDBACK_MAX_SIGNALS = 12;
export const PILOT_FEEDBACK_MAX_RECOMMENDATIONS = 8;
export const PILOT_FEEDBACK_MAX_FIELD_LENGTH = 280;
export const PILOT_FEEDBACK_MIN_EVAL_INTERVAL_MS = 500;
export const PILOT_FEEDBACK_MAX_RECURSION_DEPTH = 2;
export const PILOT_FEEDBACK_MIN_CONFIDENCE = 0.45;
export const PILOT_FEEDBACK_MAX_INFLATED_CONFIDENCE = 0.9;

const SENSITIVE_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b\d{16}\b/,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\bpassword\s*[:=]/i,
  /\bssn\b/i,
];

const lastEvalAtByOrg = new Map<string, number>();
let pilotFeedbackEvaluationDepth = 0;

export function beginPilotFeedbackEvaluation(): boolean {
  if (pilotFeedbackEvaluationDepth >= PILOT_FEEDBACK_MAX_RECURSION_DEPTH) return false;
  pilotFeedbackEvaluationDepth += 1;
  return true;
}

export function endPilotFeedbackEvaluation(): void {
  pilotFeedbackEvaluationDepth = Math.max(0, pilotFeedbackEvaluationDepth - 1);
}

export function shouldEvaluatePilotFeedbackLoop(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PILOT_FEEDBACK_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampPilotFeedbackConfidence(score: number): number {
  return Number(
    Math.min(
      PILOT_FEEDBACK_MAX_INFLATED_CONFIDENCE,
      Math.max(PILOT_FEEDBACK_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function sanitizePilotFeedbackField(value: string | undefined): {
  text: string;
  containsSensitivePattern: boolean;
} {
  const raw = (value ?? "").trim().slice(0, PILOT_FEEDBACK_MAX_FIELD_LENGTH);
  let containsSensitivePattern = false;
  let text = raw;

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      containsSensitivePattern = true;
      text = text.replace(pattern, "[redacted]");
    }
  }

  return { text, containsSensitivePattern };
}

export function sanitizePilotFeedbackCapture(capture: MVPPilotFeedbackCapture): {
  whatConfusedYou: string;
  whatFeltValuable: string;
  whatShouldImprove: string;
  pilotNotes: string;
  containsSensitivePattern: boolean;
} {
  const confused = sanitizePilotFeedbackField(capture.whatConfusedYou);
  const valuable = sanitizePilotFeedbackField(capture.whatFeltValuable);
  const improve = sanitizePilotFeedbackField(capture.whatShouldImprove);
  const notes = sanitizePilotFeedbackField(capture.pilotNotes);

  return {
    whatConfusedYou: confused.text,
    whatFeltValuable: valuable.text,
    whatShouldImprove: improve.text,
    pilotNotes: notes.text,
    containsSensitivePattern:
      confused.containsSensitivePattern ||
      valuable.containsSensitivePattern ||
      improve.containsSensitivePattern ||
      notes.containsSensitivePattern,
  };
}

export function inferFeedbackCategory(text: string): FeedbackCategory {
  const lower = text.toLowerCase();
  if (/panel|right rail|rail|sidebar/.test(lower)) return "panel_confusion";
  if (/scene|visual|map|canvas/.test(lower)) return "scene_understanding";
  if (/trust|credible|believe|confidence/.test(lower)) return "trust";
  if (/input|upload|data entry|form/.test(lower)) return "data_input";
  if (/demo|flow|walkthrough|onboarding/.test(lower)) return "demo_flow";
  if (/decision|recommend|focus|priority|value/.test(lower)) return "decision_value";
  if (/ui|flash|stable|layout|responsive/.test(lower)) return "ui_stability";
  if (/clear|confus|explain|understand|language|jargon/.test(lower)) return "clarity";
  return "unknown";
}

export function inferFeedbackSeverity(
  category: FeedbackCategory,
  text: string,
  containsSensitivePattern: boolean
): FeedbackSeverity {
  if (containsSensitivePattern) return "high";
  const lower = text.toLowerCase();
  if (/critical|blocked|broken|unusable/.test(lower)) return "critical";
  if (/confus|unclear|lost|hard to/.test(lower)) return "medium";
  if (category === "trust" || category === "data_input") return "medium";
  return "low";
}

export function validateMVPPilotFeedback(
  entry: MVPPilotFeedback | null | undefined
): entry is MVPPilotFeedback {
  if (!entry) return false;
  if (!entry.feedbackId.trim() || !entry.organizationId.trim()) return false;
  if (!entry.signature.trim()) return false;
  const hasContent =
    entry.whatConfusedYou.length > 0 ||
    entry.whatFeltValuable.length > 0 ||
    entry.whatShouldImprove.length > 0 ||
    entry.pilotNotes.length > 0;
  return hasContent && Number.isFinite(entry.generatedAt);
}

export function validatePilotLearningSnapshot(
  snapshot: PilotLearningSnapshot | null | undefined
): snapshot is PilotLearningSnapshot {
  if (!snapshot) return false;
  if (!snapshot.feedbackLoopId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.trim() || !snapshot.signature.trim()) return false;
  if (snapshot.confidence < PILOT_FEEDBACK_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > PILOT_FEEDBACK_MAX_INFLATED_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function resetPilotFeedbackGuards(): void {
  lastEvalAtByOrg.clear();
  pilotFeedbackEvaluationDepth = 0;
}
