# Nexora Main Right Panel Architecture

Status: Frozen MVP architecture contract.

Scope: Main Right Panel tab ownership, Dashboard context routing, Assistant isolation, and legacy right-panel audit.

This document freezes the Main Right Panel (MRP) as the canonical executive information surface for the Nexora MVP. It does not implement Dashboard content, Assistant features, Risk UI, Scenario UI, Timeline UI, or engine behavior.

## 1. Canonical Definition

The Main Right Panel is the executive information surface.

Rules:

- MRP is permanent.
- MRP exists independently of the Scene Panel, Object Panel, Timeline, and Three.js scene.
- MRP is not a floating tool.
- MRP is not a temporary modal.
- MRP is not a router destination.

## 2. Canonical Tabs

The MRP has exactly two tabs:

1. Dashboard
2. Assistant

Forbidden MRP tabs:

- Risk
- Scenario
- War Room
- Sources
- Timeline
- Reports
- Analytics
- Controls
- Operations

These are Dashboard contexts or subordinate surfaces, not MRP tabs.

Canonical TypeScript contract:

`frontend/app/lib/ui/mainRightPanelContract.ts`

```ts
type MainRightPanelTab =
  | "dashboard"
  | "assistant";
```

## 3. Dashboard Context

Dashboard is the executive workspace surface. It hosts contexts.

```ts
type DashboardContext =
  | "overview"
  | "sources"
  | "scenario"
  | "risk"
  | "war_room"
  | "timeline"
  | "settings";
```

Dashboard Context controls content. Dashboard Context does not create a new tab, route, MRP page, or MRP section.

## 4. Assistant Isolation

Assistant owns:

- conversation
- guidance
- explanation
- recommendations
- navigation assistance

Assistant does not own:

- source management UI
- scenario editor UI
- risk dashboard UI
- timeline workspace

Assistant must remain isolated from Dashboard Context routing. Dashboard context changes must not remount Assistant, recreate Assistant, reset Assistant state, or reset Assistant memory.

## 5. Relationships

Left Nav changes Dashboard Context only:

```text
Left Nav -> Sources
MRP Tab -> Dashboard
Dashboard Context -> sources
```

Object Panel is not part of MRP. Object selection must not create MRP tabs. Object actions may update Dashboard Context.

Scene Panel is not part of MRP. Scene actions may update Dashboard Context. Scene actions must not create MRP tabs.

Timeline is scene-native. Timeline is not a third MRP tab, routed MRP page, or right-panel timeline workspace. Timeline context may appear within Dashboard.

## 6. Routing Governance

Allowed:

```text
Mode
  -> Dashboard Context
  -> Dashboard Content
```

Forbidden:

```text
Mode
  -> New Right Panel Tab
```

## 7. Brake System

Canonical MRP warnings:

- `[MRP][Brake] Invalid tab detected.`
- `[MRP][Brake] Unauthorized tab creation attempt.`
- `[MRP][Brake] Legacy panel route detected.`
- `[MRP][Brake] Dashboard context routing failed.`

Invalid tabs fall back to Dashboard. Invalid Dashboard Context falls back to Overview.

## 8. Legacy Audit

Existing right-panel architecture identified during the freeze:

- `frontend/app/components/right-panel/RightPanelHost.tsx`
  - Classification: legacy compatibility renderer for historical right-panel views.
  - Mapping: future Dashboard content may reuse internal components, but new MRP tabs must not be added here.

- `frontend/app/lib/ui/right-panel/rightPanelTypes.ts`
  - Classification: legacy right-panel view enum.
  - Mapping: compatibility only; new MRP code must use `MainRightPanelTab`.

- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts`
  - Classification: deprecated legacy route/tab mapper.
  - Mapping: legacy inputs should map into Dashboard Context, not new MRP tabs.

- `frontend/app/lib/ui/right-panel/rightPanelRegistry.ts`
  - Classification: legacy view registry.
  - Mapping: compatibility registry; not canonical MRP tab registry.

- `frontend/app/screens/hooks/right-panel/rightPanelAuthorityRoute.ts`
  - Classification: authority compatibility normalizer.
  - Mapping: legacy right-panel views remain compatibility routes until migrated.

- `frontend/app/components/workspace/ExecutiveAssistantPanelShell.tsx`
  - Classification: Assistant shell.
  - Mapping: canonical Assistant tab host; must stay stable across Dashboard Context changes.

- `frontend/app/components/workspace/ObjectPanelShell.tsx`
  - Classification: scene-native object panel.
  - Mapping: not part of MRP.

- `frontend/app/components/workspace/ScenePanelShell.tsx`
  - Classification: scene-native scene panel.
  - Mapping: not part of MRP.

## 9. Audit Summary

The MRP is frozen as a two-tab executive information surface: Dashboard and Assistant. Sources, Scenario, Risk, War Room, Timeline, and Settings are Dashboard contexts. Legacy right-panel views remain compatibility routes only and are marked deprecated. Future development must not add new MRP tabs or route modes directly into new right-panel tab surfaces.
