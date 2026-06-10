/**
 * MRP:2:2 — Legacy Focus routing findings (documented, not duplicated).
 */

export const FOCUS_MODE_LEGACY_FINDINGS = Object.freeze({
  executiveObjectPanel: {
    path: "frontend/app/components/panels/ExecutiveObjectPanel.tsx",
    behavior: "Legacy MRP-docked object panel; merges fallbackExecutiveData with buildExecutiveObjectPanelData.",
    risk: "Gated on rightPanelState view — not used as Focus authority.",
    status: "read_only_reference",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Hosts executive_object / object_focus views with duplicate object presentation.",
    risk: "Competing destination if Focus opens legacy panels.",
    status: "isolated_in_legacy_host",
  },
  executiveObjectPanelData: {
    path: "frontend/app/lib/panels/executiveObjectPanelData.ts",
    behavior: "Pure builder from sceneJson, responseData, riskPropagation, recommendation.",
    risk: "None — reused as read-only context source for Focus.",
    status: "canonical_builder_reused",
  },
  objectSelection: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "selectedObjectIdState is canonical selection authority.",
    risk: "Dashboard must not write selection.",
    status: "authority_preserved",
  },
  executiveFocusModeRuntime: {
    path: "frontend/app/lib/workspace/executiveFocusModeRuntime.ts",
    behavior: "Camera/scene focus toggle store — separate from Dashboard Focus mode.",
    risk: "Name collision; Dashboard Focus does not call this runtime.",
    status: "decoupled",
  },
});
