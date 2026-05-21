import type {
  ExecutiveReadinessSignal,
  MVPReadinessDisplayModel,
  MVPReadinessRuntimeInput,
  MVPReadinessStatus,
  RuntimeHealthDisplayItem,
} from "./mvpReadinessDashboardTypes";

const DEV_LOG_PREFIX = "[Nexora][MVPReadinessDashboard]";
const lastReadinessStatusByOrg = new Map<string, MVPReadinessStatus>();

function devLogStatusChange(organizationId: string, status: MVPReadinessStatus, prior: MVPReadinessStatus | null): void {
  if (process.env.NODE_ENV === "production") return;
  if (prior === status) return;
  console.info(`${DEV_LOG_PREFIX} readiness status — ${prior ?? "none"} → ${status} (${organizationId})`);
  if (status === "mvp_ready") {
    console.info(`${DEV_LOG_PREFIX} MVP-ready transition — executive runtime health surface stabilized`);
  }
  if (prior === "mvp_ready" || prior === "stable") {
    if (status === "monitored" || status === "not_ready") {
      console.info(`${DEV_LOG_PREFIX} runtime health degradation — ${prior} → ${status}`);
    }
  }
}

function hasRuntimeData(input: MVPReadinessRuntimeInput): boolean {
  return Boolean(input.foundation || input.operational || input.interaction);
}

function formatTrustLevel(trustState: string | undefined): string {
  switch (trustState) {
    case "executive_grade":
      return "Executive-grade trust";
    case "trusted":
      return "Trusted";
    case "conditionally_trusted":
      return "Conditionally trusted";
    case "monitored":
      return "Monitored";
    case "untrusted":
      return "Needs trust reinforcement";
    default:
      return "Awaiting trust evaluation";
  }
}

function formatUiState(uiState: string | undefined): string {
  switch (uiState) {
    case "mvp_ready":
      return "MVP ready";
    case "production_safe":
      return "Production safe";
    case "stable":
      return "Stable";
    case "monitored":
      return "Monitored";
    case "unstable":
      return "Unstable";
    default:
      return "Awaiting UI evaluation";
  }
}

function formatFoundationStatus(status: string | undefined): string {
  switch (status) {
    case "mvp_ready":
      return "MVP ready";
    case "hardened":
      return "Hardened";
    case "operational":
      return "Operational";
    case "stabilizing":
      return "Stabilizing";
    case "unstable":
      return "Unstable";
    default:
      return "Awaiting foundation evaluation";
  }
}

function pickPrimaryRisk(input: MVPReadinessRuntimeInput): string {
  const interactionRisk = input.interaction?.uiRisks[0];
  const operationalRisk = input.operational?.trustRisks[0];
  const foundationRisk = input.foundation?.operationalRisks[0];

  const raw = interactionRisk ?? operationalRisk ?? foundationRisk;
  if (!raw) return "No elevated risk detected";

  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatRuntimeHealthLabel(status: MVPReadinessStatus): string {
  switch (status) {
    case "mvp_ready":
      return "Ready for MVP smoke test";
    case "stable":
      return "Runtime stable";
    case "monitored":
      return "Runtime monitored";
    case "not_ready":
    default:
      return "Needs further stabilization";
  }
}

export function deriveMVPReadinessStatus(input: MVPReadinessRuntimeInput): MVPReadinessStatus {
  if (!hasRuntimeData(input)) return "not_ready";

  const foundationStatus = input.foundation?.runtimeStatus;
  const trustState = input.operational?.trustState;
  const uiState = input.interaction?.uiState;
  const panelFlash = input.interaction?.panelRuntimeReliability.panelFlashDetected === true;
  const sceneDrift = input.interaction?.sceneInteractionReliability.reactionWithoutContract === true;

  if (panelFlash && sceneDrift) return "not_ready";
  if (trustState === "untrusted") return "not_ready";
  if (panelFlash || sceneDrift) return "monitored";

  if (
    uiState === "mvp_ready" ||
    (foundationStatus === "mvp_ready" &&
      (trustState === "trusted" || trustState === "executive_grade") &&
      (uiState === "production_safe" || uiState === "stable"))
  ) {
    return "mvp_ready";
  }

  if (
    foundationStatus === "hardened" ||
    foundationStatus === "operational" ||
    foundationStatus === "mvp_ready" ||
    uiState === "stable" ||
    uiState === "production_safe" ||
    trustState === "trusted" ||
    trustState === "conditionally_trusted"
  ) {
    return "stable";
  }

  if (foundationStatus === "stabilizing" || uiState === "monitored" || trustState === "monitored") {
    return "monitored";
  }

  return "not_ready";
}

export function getRecommendedNextCheck(input: MVPReadinessRuntimeInput, status: MVPReadinessStatus): string {
  const panelFlash = input.interaction?.panelRuntimeReliability.panelFlashDetected;
  const sceneDrift = input.interaction?.sceneInteractionReliability.reactionWithoutContract;
  const chatLoop = input.interaction?.chatInteractionReliability.chatPanelSceneLoopRisk;
  const selectionLoss = input.interaction?.uiRisks.includes("context_persistence_risk");

  if (status === "mvp_ready") {
    return "Run the executive analyze flow three times and verify no panel flash or duplicate scene reaction.";
  }
  if (panelFlash) {
    return "Repeat panel open and close across advice, risk, and timeline views; confirm panels remain visible.";
  }
  if (sceneDrift) {
    return "Trigger one bounded scene reaction and confirm the scene contract signature stays consistent.";
  }
  if (chatLoop) {
    return "Submit the same analyze prompt twice and confirm chat does not repeatedly reopen panels.";
  }
  if (selectionLoss) {
    return "Select an object, run analyze, and confirm selection context remains visible in the panel.";
  }
  if (!hasRuntimeData(input)) {
    return "Allow governance cognition to complete one full evaluation cycle before MVP smoke testing.";
  }
  return "Review runtime foundation and operational reliability signals before executive MVP validation.";
}

function toneForStatus(status: MVPReadinessStatus): RuntimeHealthDisplayItem["tone"] {
  switch (status) {
    case "mvp_ready":
      return "positive";
    case "stable":
      return "positive";
    case "monitored":
      return "caution";
    case "not_ready":
    default:
      return "risk";
  }
}

function buildHealthItems(
  input: MVPReadinessRuntimeInput,
  readinessStatus: MVPReadinessStatus
): RuntimeHealthDisplayItem[] {
  const foundation = input.foundation;
  const operational = input.operational;
  const interaction = input.interaction;

  return [
    {
      id: "runtime-health",
      label: "Runtime health",
      value: formatRuntimeHealthLabel(readinessStatus),
      tone: toneForStatus(readinessStatus),
    },
    {
      id: "ui-stability",
      label: "UI stability",
      value: interaction ? formatUiState(interaction.uiState) : "Awaiting evaluation",
      tone: interaction?.uiState === "unstable" ? "risk" : interaction ? "positive" : "neutral",
    },
    {
      id: "panel-stability",
      label: "Panel stability",
      value: interaction?.panelRuntimeReliability.panelStable
        ? "Panel behavior stable"
        : interaction?.panelRuntimeReliability.panelFlashDetected
          ? "Panel behavior monitored"
          : "Awaiting panel evaluation",
      tone: interaction?.panelRuntimeReliability.panelFlashDetected ? "caution" : "neutral",
    },
    {
      id: "scene-stability",
      label: "Scene stability",
      value: interaction?.sceneInteractionReliability.sceneContractValid
        ? "Scene contract consistent"
        : "Scene stability monitored",
      tone: interaction?.sceneInteractionReliability.reactionWithoutContract ? "caution" : "neutral",
    },
    {
      id: "chat-pipeline",
      label: "Chat pipeline",
      value: interaction?.chatInteractionReliability.chatPipelineDeduped
        ? "Chat pipeline stable"
        : "Chat pipeline monitored",
      tone: interaction?.chatInteractionReliability.duplicatePanelUpdateForSameInput ? "caution" : "neutral",
    },
    {
      id: "trust-level",
      label: "Executive trust",
      value: operational ? formatTrustLevel(operational.trustState) : "Awaiting trust evaluation",
      tone:
        operational?.trustState === "untrusted"
          ? "risk"
          : operational?.trustState === "trusted" || operational?.trustState === "executive_grade"
            ? "positive"
            : "neutral",
    },
    {
      id: "foundation",
      label: "Runtime foundation",
      value: foundation ? formatFoundationStatus(foundation.runtimeStatus) : "Awaiting foundation",
      tone: foundation?.runtimeStatus === "mvp_ready" ? "positive" : "neutral",
    },
  ];
}

function buildSignals(input: MVPReadinessRuntimeInput): ExecutiveReadinessSignal[] {
  const signals: ExecutiveReadinessSignal[] = [];
  const push = (id: string, label: string, summary: string) => {
    signals.push({ signalId: id, label, summary });
  };

  if (input.interaction?.stabilitySignals.includes("panel_state_stable")) {
    push("panel-stable", "Panel stable", "Executive panels remain stable without flash symptoms.");
  }
  if (input.interaction?.stabilitySignals.includes("scene_signature_consistent")) {
    push("scene-consistent", "Scene consistent", "Scene contract remains aligned with bounded reactions.");
  }
  if (input.operational?.reliabilitySignals?.includes("bounded_runtime_behavior")) {
    push("bounded-runtime", "Bounded runtime", "Cognition runtime remains bounded and explainable.");
  }
  if (input.foundation?.readinessSignals.includes("executive_safe_outputs")) {
    push("executive-safe", "Executive-safe outputs", "Runtime outputs remain explainable for executives.");
  }

  return signals.slice(0, 4);
}

export function summarizeExecutiveReadiness(input: MVPReadinessRuntimeInput): MVPReadinessDisplayModel {
  const readinessStatus = deriveMVPReadinessStatus(input);
  const prior = lastReadinessStatusByOrg.get(input.organizationId) ?? null;
  devLogStatusChange(input.organizationId, readinessStatus, prior);
  lastReadinessStatusByOrg.set(input.organizationId, readinessStatus);

  const runtimeHealth = formatRuntimeHealthLabel(readinessStatus);
  const uiStability = formatUiState(input.interaction?.uiState);
  const panelStability = input.interaction?.panelRuntimeReliability.panelStable
    ? "Panel behavior stable"
    : "Panel behavior monitored";
  const sceneStability = input.interaction?.sceneInteractionReliability.sceneContractValid
    ? "Scene contract consistent"
    : "Scene stability monitored";
  const chatPipelineStability = input.interaction?.chatInteractionReliability.chatPipelineDeduped
    ? "Chat pipeline stable"
    : "Chat pipeline monitored";
  const trustLevel = formatTrustLevel(input.operational?.trustState);
  const currentRisk = pickPrimaryRisk(input);
  const recommendedNextCheck = getRecommendedNextCheck(input, readinessStatus);

  const confidenceRaw =
    input.interaction?.confidence ?? input.operational?.confidence ?? input.foundation?.confidence;
  const confidencePercent =
    confidenceRaw !== undefined ? Math.round(confidenceRaw * 100) : null;

  const overallHeadline =
    readinessStatus === "mvp_ready"
      ? "Nexora appears stable enough for MVP executive use right now."
      : readinessStatus === "stable"
        ? "Nexora runtime is stable with bounded executive interaction behavior."
        : readinessStatus === "monitored"
          ? "Nexora runtime is monitored — continue stabilization before MVP sign-off."
          : "Nexora needs further runtime stabilization before MVP executive use.";

  return {
    readinessStatus,
    runtimeHealth,
    uiStability,
    panelStability,
    sceneStability,
    chatPipelineStability,
    trustLevel,
    currentRisk,
    recommendedNextCheck,
    overallHeadline,
    confidencePercent,
    healthItems: Object.freeze(buildHealthItems(input, readinessStatus)),
    signals: Object.freeze(buildSignals(input)),
    hasRuntimeData: hasRuntimeData(input),
  };
}

export function resetMVPReadinessDashboardDevState(): void {
  lastReadinessStatusByOrg.clear();
}
