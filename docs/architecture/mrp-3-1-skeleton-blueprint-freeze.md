# MRP:3:1 — Final Main Right Panel Skeleton Blueprint Freeze

**Status:** Frozen skeleton architecture contract.

**Phase:** MRP:3:1

**Freeze tag:** `[MRP_SKELETON_BLUEPRINT_FROZEN]`

**Scope:** Final Main Right Panel (MRP) structural layout before additional panel development. Tab ownership, context header contract, dynamic workspace render zone, and acceptance gates.

**Authority chain:**

1. `docs/nexora-constitution.md`
2. `docs/architecture/constitutional-compliance.md`
3. `docs/nexora-main-right-panel-architecture.md`
4. This document — skeleton layout freeze

This document freezes the **final MRP skeleton**. All future MRP panel development must render inside this structure. No feature may alter Section A tab titles, remove Section B context visibility, or mount executive content outside Section C.

---

## 1. Freeze Purpose

The MRP skeleton is frozen to prevent structural drift before workspace and intelligence surface development continues.

**Frozen decisions:**

- Two permanent runtime tabs only: **Insight** and **Assistant**
- Three immutable layout sections: Top Runtime Tabs, Context Header, Dynamic Workspace Area
- Single render zone for all executive workspace content
- Permanent context visibility for executive orientation and return navigation

**Out of scope for this freeze:**

- Workspace business logic and engine behavior
- Individual workspace UI polish inside Section C
- Scene Panel, Object Panel, and Timeline zone geometry (see HUD zone contracts)

---

## 2. Constitutional Alignment

This skeleton implements constitutional and compliance requirements:

| Constitutional requirement | Skeleton enforcement |
|----------------------------|----------------------|
| MRP contains Dashboard (Insight) + Assistant only | Section A — exactly two tabs |
| Panel Name, Active Mode, Selected Object Context, Return Navigation | Section B — always visible |
| Scene shows; MRP explains; Assistant discusses | Section C — explanation workspaces; Assistant tab isolated |
| One screen, one story | Section C — single active workspace render at a time |
| Never overwhelm the executive | Fixed header zones; workspace scroll contained in Section C |
| No dead dashboards | Section C workspaces must connect insights to action (workspace-level contract) |

Agents and reviewers must evaluate all MRP work against `docs/ai-context/nexora-core-rules.md`.

---

## 3. Final MRP Skeleton Layout

The MRP is a vertical stack of three sections. Sections A and B are **persistent chrome**. Section C is the **sole dynamic render zone**.

```text
┌─────────────────────────────────────────┐
│ SECTION A — Top Runtime Tabs            │
│  [ Insight ]  [ Assistant ]             │
├─────────────────────────────────────────┤
│ SECTION B — Context Header              │
│  Panel Name                             │
│  Active Mode                            │
│  Selected Object Context                │
│  ← Back                                 │
├─────────────────────────────────────────┤
│ SECTION C — Dynamic Workspace Area      │
│                                         │
│  (Executive Summary, Operational,       │
│   Risk, Timeline, Scenario, War Room,   │
│   Advisory, Governance — one active)    │
│                                         │
│  ▲ scroll contained here                │
│  ▼ fills remaining available height     │
└─────────────────────────────────────────┘
```

### Layout ownership

| Section | Role | Visibility | Height behavior |
|---------|------|------------|-----------------|
| **A** | Runtime tab selection | Always visible | Fixed — tab bar height |
| **B** | Executive context orientation | Always visible | Fixed — context header height |
| **C** | Workspace content render | Always present | Flex — occupies all remaining MRP height |

Section C must not be collapsed, hidden, or replaced by alternate panel hosts during normal executive operation.

---

## 4. Section A — Top Runtime Tabs

### 4.1 Permanent tabs

The MRP contains **only two permanent tabs**:

| Display title | Internal tab id | Purpose |
|---------------|-----------------|---------|
| **Insight** | `dashboard` | Executive explanation layer — hosts Dashboard contexts and workspace surfaces |
| **Assistant** | `assistant` | Executive discussion layer — hosts conversational decision support |

### 4.2 Tab title immutability

**These tab titles must never change.**

- The executive-facing labels are permanently **Insight** and **Assistant**.
- Renaming, aliasing, or seasonal relabeling of these tabs is forbidden without a formal constitutional amendment.
- Internal state may continue to use `dashboard` as the tab id for Insight (see MRP:12:3). Display label and tab id are intentionally decoupled.

### 4.3 Forbidden tab patterns

The following must **never** become MRP tabs:

- Risk, Scenario, War Room, Timeline, Sources, Settings
- Operational, Advisory, Governance, Executive Summary
- Reports, Analytics, Controls, Operations, Compare, Analyze

These are **Dynamic Workspace surfaces** (Section C) or **Left Nav / Dashboard Context** routes — not tabs.

### 4.4 Tab contract

Canonical TypeScript contract: `frontend/app/lib/ui/mainRightPanelContract.ts`

```ts
type MainRightPanelTab = "dashboard" | "assistant";
```

Brake traces on violation:

- `[MRP][Brake] Invalid tab detected.`
- `[MRP][Brake] Unauthorized tab creation attempt.`

---

## 5. Section B — Context Header

The Context Header is permanent executive orientation chrome. It answers: **Where am I? What mode am I in? What object am I looking at? How do I return?**

### 5.1 Required fields

The Context Header must always display:

| Field | Description | Example |
|-------|-------------|---------|
| **Panel Name** | Current workspace or panel identity | `Risk` |
| **Active Mode** | Current analytical or operational mode | `Forecast` |
| **Selected Object Context** | Scene-selected object scope | `Supplier A` |
| **Back Navigation** | Return path without context loss | `← Back` |

**Example rendering:**

```text
Risk
Forecast
Supplier A
← Back
```

### 5.2 Context header rules

- Section B remains visible on **both** Insight and Assistant tabs.
- Context fields must reflect synchronized state from Scene selection, Dashboard mode, and workspace lifecycle.
- Back Navigation must preserve Panel Name, Active Mode, and Selected Object Context unless the executive explicitly changes scope.
- Context Header must not be replaced by breadcrumbs, hidden menus, or collapsible chrome that defaults to hidden.

### 5.3 Constitutional mapping

This section directly implements MRP constitutional principles from `docs/nexora-constitution.md`:

- Panel Name
- Active Mode
- Selected Object Context
- Return Navigation

Context loss in Section B is a **constitutional failure**.

---

## 6. Section C — Dynamic Workspace Area

Section C is the **only authorized render zone** for executive workspace content inside MRP.

### 6.1 Authorized workspace surfaces

The following surfaces render **only** inside Section C:

| Surface | Classification | Typical tab |
|---------|----------------|-------------|
| **Executive Summary** | Status intelligence / overview layer | Insight |
| **Operational** | Live operations intelligence | Insight |
| **Risk** | Risk analysis and fragility views | Insight |
| **Timeline** | Decision timeline and replay context | Insight |
| **Scenario** | Simulation and scenario workspaces | Insight |
| **War Room** | Crisis and coordination workspace | Insight |
| **Advisory** | Recommendation and advisory intelligence | Insight |
| **Governance** | Decision governance and policy context | Insight |

Assistant tab content (conversation, context panel, action cards) also renders in Section C when Assistant is active — but must remain **Assistant-isolated** and must not remount or reset when Insight workspace context changes.

### 6.2 Single render zone rule

**No panel may render outside the Dynamic Workspace Area.**

Forbidden mount targets:

- Legacy `#nexora-right-panel-root` inside hidden ObjectPanelShell
- Floating modals as primary workspace hosts
- Scene-adjacent right-rail portals outside `#nexora-visible-mrp-host`
- Duplicate parallel dashboard hosts competing with Section C
- Third-party panel shells that bypass MainRightPanelShell section structure

Authorized host chain (Type-C):

```text
NexoraShell visible right rail
  └── #nexora-visible-mrp-host
        └── MainRightPanelShell
              ├── Section A — tabs
              ├── Section B — context header
              └── Section C — dynamic workspace (sole content mount)
```

### 6.3 Workspace vs tab discipline

| Concept | Owns | Does not own |
|---------|------|--------------|
| **Section A tab** | Insight vs Assistant mode | Workspace content selection |
| **Dashboard Context** | Left Nav → Insight content routing | New MRP tabs |
| **Section C surface** | Active workspace UI | Tab creation or hidden routes |

Left Nav and object actions change **what renders in Section C**. They must not create new Section A tabs.

### 6.4 Height and scroll contract

- Section C occupies **all remaining available height** below Sections A and B.
- Vertical overflow scrolls **inside Section C**, not at the MRP shell root (unless explicitly unified in a later HUD contract).
- Sections A and B must not scroll out of view during normal workspace navigation.

---

## 7. Legacy Architecture Prohibition

**No legacy right-panel architecture may be reused** for new MRP skeleton compliance.

### 7.1 Legacy classification

| Asset | Classification | Skeleton rule |
|-------|----------------|---------------|
| `RightPanelHost.tsx` | Legacy compatibility renderer | Must not become primary MRP host |
| `rightPanelRouter.ts` | Deprecated route mapper | Legacy inputs map to Dashboard Context, not new tabs |
| `rightPanelRegistry.ts` | Legacy view registry | Compatibility only |
| `#nexora-right-panel-root` (hidden) | Legacy portal | Must not receive primary workspace mounts |
| `ExecutiveAssistantPanelShell` (NexoraShell legacy path) | Superseded on Type-C | Visible MRP uses MainRightPanelShell skeleton |

### 7.2 Migration rule

Legacy components may supply **internal UI fragments** reused inside Section C. They must not reintroduce legacy routing, tab creation, or parallel panel authority.

---

## 8. Router Loop Prevention

The skeleton requires **stable, acyclic navigation** between tabs, context, and workspace surfaces.

### 8.1 Allowed navigation graph

```text
Section A tab switch (Insight ↔ Assistant)
  ↕ read-only context sync; no remount loops

Left Nav / Object action
  → Dashboard Context or workspace mode change
  → Section C content swap
  → Section B context update

Back Navigation
  → prior workspace/context snapshot
  → Section B restored
  → no tab creation
```

### 8.2 Forbidden loop patterns

- Tab switch triggering dashboard mode change that immediately switches tab back
- Context header back action re-entering the same route without state delta
- Legacy router and MainRightPanelShell both reacting to the same navigation event
- Workspace launch → context publish → workspace relaunch cycles
- Assistant sync events mutating Dashboard authority state (Assistant receives copies only)

### 8.3 Brake and guard expectations

Existing loop guards and brakes remain mandatory:

- `[MRP][Brake] Legacy panel route detected.`
- `[MRP][Brake] Dashboard context routing failed.`
- Render loop guards on dashboard home and object click paths
- Single active workspace enforcement via transition controller

New panel development must not bypass these guards.

---

## 9. Acceptance Gates

All criteria below must pass before additional MRP panel development proceeds on this skeleton.

### Gate 1 — Tab permanence

| # | Criterion | Required state |
|---|-----------|----------------|
| 1.1 | Insight tab visible at all times (expanded or collapsed rail) | **PASS** |
| 1.2 | Assistant tab visible at all times (expanded or collapsed rail) | **PASS** |
| 1.3 | Tab display titles are exactly **Insight** and **Assistant** | **PASS** |
| 1.4 | No third MRP tab exists or is routable | **PASS** |

### Gate 2 — Context header permanence

| # | Criterion | Required state |
|---|-----------|----------------|
| 2.1 | Context Header visible on Insight tab | **PASS** |
| 2.2 | Context Header visible on Assistant tab | **PASS** |
| 2.3 | Panel Name displayed | **PASS** |
| 2.4 | Active Mode displayed | **PASS** |
| 2.5 | Selected Object Context displayed | **PASS** |
| 2.6 | Back Navigation displayed and functional | **PASS** |

### Gate 3 — Dynamic workspace layout

| # | Criterion | Required state |
|---|-----------|----------------|
| 3.1 | Section C occupies remaining available height | **PASS** |
| 3.2 | All workspace surfaces mount only in Section C | **PASS** |
| 3.3 | No executive workspace renders outside MRP skeleton | **PASS** |
| 3.4 | Scroll contained to workspace area without losing Sections A/B | **PASS** |

### Gate 4 — Architecture hygiene

| # | Criterion | Required state |
|---|-----------|----------------|
| 4.1 | No legacy right-panel host used as primary render path | **PASS** |
| 4.2 | No router loops on tab switch, back navigation, or workspace launch | **PASS** |
| 4.3 | Visible MRP host is `#nexora-visible-mrp-host` on Type-C | **PASS** |
| 4.4 | Constitutional compliance checklist satisfied | **PASS** |

---

## 10. Section Interaction Matrix

| User action | Section A | Section B | Section C |
|-------------|-----------|-----------|-----------|
| Switch Insight → Assistant | Active tab changes | Context preserved | Assistant content mounts |
| Switch Assistant → Insight | Active tab changes | Context preserved | Prior Insight workspace restores |
| Left Nav mode change | Insight remains/selects Insight | Panel Name / Active Mode update | Workspace surface swaps |
| Scene object select | Unchanged tab | Selected Object Context updates | Workspace may react to selection |
| Back Navigation | Unchanged tab | Prior context restored | Prior workspace surface restored |
| MRP rail collapse | Tab labels compress to rail | Context header hidden only in collapsed rail contract* | Workspace hidden until expand |

\*Collapsed rail behavior is governed by MRP shell collapse contract (MRP:12:3). Expand restores full skeleton with Sections A–C intact.

---

## 11. Related Documents

| Document | Relationship |
|----------|--------------|
| `docs/nexora-main-right-panel-architecture.md` | Tab and Dashboard Context ownership |
| `docs/nexora-routing-governance.md` | Cross-panel navigation rules |
| `docs/nexora-canonical-panel-architecture.md` | Workspace surface boundaries |
| `docs/mrp-header-navigation-refinement-report.md` | Insight tab label freeze (MRP:12:3) |
| `docs/mrp-context-sync-contract-report.md` | Dashboard ↔ Assistant read-only sync |
| `docs/mrp-hud-zone-contract-audit-report.md` | Zone E MRP safe zone geometry |
| `docs/architecture/constitutional-compliance.md` | Phase review and attestation |

---

## 12. Development Rules After Freeze

While `[MRP_SKELETON_BLUEPRINT_FROZEN]` is in effect:

1. **Do** implement new workspace UI inside Section C only.
2. **Do** update Section B context fields when introducing new workspace modes.
3. **Do** route legacy panel requests into Dashboard Context and Section C surfaces.
4. **Do not** add MRP tabs, hidden tab routes, or secondary panel shells.
5. **Do not** mount executive content outside MainRightPanelShell Section C.
6. **Do not** rename Insight or Assistant tab titles.
7. **Do not** hide Section B during normal expanded operation.
8. **Do not** rewire navigation through legacy right-panel routers.

---

## 13. Constitutional Compliance Attestation

```markdown
## Constitutional Compliance Attestation — MRP:3:1

**Phase:** MRP:3:1 — Final Main Right Panel Skeleton Blueprint Freeze
**Freeze tag:** [MRP_SKELETON_BLUEPRINT_FROZEN]
**Date:** 2026-06-13

### Checklist Results
- [x] Executive decision making supported — workspace surfaces tie to decision questions
- [x] Scene First architecture respected — MRP explains; Scene remains primary
- [x] Object-Centric navigation respected — object context in Section B
- [x] Context visibility preserved — Section B permanent fields
- [x] Cognitive load reduced or neutral — fixed chrome, single workspace story
- [x] Simulation Before Recommendation supported — Scenario surface in Section C

### Violation Scan
- [x] No MRP tab expansion beyond Insight + Assistant
- [x] No decorative-only workspace mounts
- [x] No dead dashboard structure — surfaces require action linkage at workspace level
- [x] No hidden object context in expanded skeleton
- [x] No Assistant bypass of analysis/simulation layers

### Outcome
- [x] Skeleton blueprint frozen for panel development
```

---

## 14. Freeze Statement

**[MRP_SKELETON_BLUEPRINT_FROZEN]**

The Main Right Panel skeleton is hereby frozen as:

- **Section A** — Top Runtime Tabs: `[ Insight ]` `[ Assistant ]` (titles immutable)
- **Section B** — Context Header: Panel Name, Active Mode, Selected Object Context, Back Navigation (always visible in expanded operation)
- **Section C** — Dynamic Workspace Area: sole render zone for Executive Summary, Operational, Risk, Timeline, Scenario, War Room, Advisory, and Governance

All future MRP panel development must conform to this skeleton. Structural changes require an explicit architecture supersession — not incremental drift.

**Insight and Assistant remain. Context remains visible. Workspaces render in one place. Legacy hosts stay retired.**
