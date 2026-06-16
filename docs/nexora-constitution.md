# Nexora Constitution

**Status:** Foundational product authority.

**Scope:** Product identity, mission, design philosophy, executive UX philosophy, and non-negotiable architectural rules for Nexora.

This document is the highest-level product authority for Nexora. All future development—architectural, UI, engine, topology, and AI—must respect and be evaluated against this Constitution.

---

## Nexora Identity

### Public Definition

> Nexora is an Executive Decision Intelligence System.

### Type-C Definition

> Nexora helps managers understand situations, simulate futures, and make better decisions.

---

## Mission

Nexora exists to close the gap between organizational data and executive action. The system transforms **data into understanding**, **understanding into simulation**, and **simulation into decision support**.

Managers do not need more reports. They need clarity on what is happening, what could happen, and what to do next. Nexora is built to deliver that clarity through a unified executive experience—where the situation is visible, the analysis is explainable, and the path to decision is supported by evidence and simulation rather than intuition alone.

---

## Core Constitutional Rules

These rules are non-negotiable. They govern every surface, interaction, and architectural decision in Nexora.

### Rule #1 — Scene, MRP, and Assistant Roles

- **Scene** shows the situation.
- **MRP** explains the situation.
- **Assistant** discusses the situation.

Each layer has a distinct responsibility. They must not collapse into one another or duplicate each other's primary function.

### Rule #2 — Objects Are Information

Objects are information. Objects are not decoration.

Every object in the Scene must carry meaning. Visual presence without informational purpose violates this Constitution.

### Rule #3 — Navigate by Objects, Not Menus

Managers navigate by objects, not menus.

The executive path through Nexora is object-centric. Selection, context, and action flow from what is in the situation—not from hierarchical menu structures.

### Rule #4 — Every View Answers a Decision Question

Every view must answer a decision question.

If a view cannot be tied to a concrete decision question—*What is at risk? What should we prioritize? What happens if we act?*—it does not belong in Nexora.

### Rule #5 — No Dead Dashboards

No dead dashboards. Insights must be connected to actions.

Insights that terminate in display alone are insufficient. Every insight surface must offer a path to action, simulation, or deeper analysis.

### Rule #6 — One Screen, One Story

One screen. One story.

Each executive view tells one coherent narrative. Competing stories, fragmented panels, and unrelated metrics on a single screen violate executive clarity.

### Rule #7 — Context Is King

Context is king.

Object selection, active mode, workspace state, and situational framing must persist and propagate across Scene, MRP, and Assistant. Context loss is a constitutional failure.

### Rule #8 — Simulation Before Recommendation

Simulation before recommendation.

Nexora must show what could happen before it recommends what to do. Recommendations without simulated futures are premature.

### Rule #9 — The Scene Is the Primary Interface

The Scene is the primary interface.

The Three.js executive scene is not a backdrop. It is the primary visual intelligence layer through which managers perceive and navigate the situation.

### Rule #10 — Never Overwhelm the Executive

Never overwhelm the executive.

Information density, visual noise, and cognitive load must be actively managed. Nexora serves executives who decide under pressure; the system must respect their attention as a scarce resource.

### Rule #11 — Executive Decision Boundary Contract

Timeline, Scenario, and War Room are permanently separated executive workspaces. Each answers a distinct decision question and owns a non-overlapping capability boundary.

| Workspace | Domain | Decision Question |
|-----------|--------|-------------------|
| **Timeline** | Past | What happened? |
| **Scenario** | Possible futures | What could happen? |
| **War Room** | Action | What should we do now? |

**Timeline** explains the past — historical events, object state changes, decisions, risk events, operational trends, and scenario outcomes. Timeline must not predict futures, generate alternative futures, recommend actions, or commit decisions.

**Scenario** explores possible futures — alternative futures, simulations, decision comparison, impact and risk forecasting, and outcome probability analysis. Scenario must not rewrite historical records, modify timeline history, execute decisions, or commit actions.

**War Room** commits to action — decision execution, strategy selection, operational response plans, action tracking, executive command surfaces, and monitoring active decisions. War Room must not alter historical records, rewrite timeline events, or own simulation generation without Scenario ownership.

Runtime enforcement tag: `[NEXORA_RULE_11_BOUNDARY]`. Active freeze tag: `[NEXORA_RULE_11_ACTIVE]` (version 1.0). All current and future MRP workspace certifications must verify compliance. Certification fails when any workspace crosses its ownership boundary.

Reference: `docs/architecture/nexora-rule-11-executive-decision-boundary.md`

### Rule #12 — Intelligence Ownership Contract

Nexora is an Executive Decision Intelligence System. **MRP owns intelligence.** **Assistant owns conversation.** The Assistant is not the intelligence authority.

| Owner | Domain | Answers |
|-------|--------|---------|
| **MRP (certified workspaces)** | Authoritative intelligence | What is happening? · How is it operating? · What can go wrong? · What happened before? · What could happen next? · What should we do now? |
| **Assistant** | Executive conversation | Explain this. · Why? · How? · What does this mean? · What should I review? |

**MRP authoritative workspaces:** Executive Summary · Operational · Risk · Timeline · Scenario · War Room · Future certified workspaces.

**Assistant MAY:** read, explain, summarize, compare, and discuss workspace intelligence.

**Assistant MAY NOT:** replace, invent, or override workspace intelligence; execute workspace decisions; or act as an independent decision authority.

**Runtime flow:** Executive Workspace → Certified Intelligence → Assistant Reads → Assistant Explains → Executive Understands. Assistant never bypasses workspace intelligence.

Runtime enforcement tag: `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`. Active freeze tag: `[NEXORA_RULE_12_ACTIVE]` (version 1.0). All future Assistant certifications must verify compliance. Certification fails when Assistant owns intelligence or bypasses certified workspace authority.

Reference: `docs/architecture/nexora-rule-12-intelligence-ownership.md`

### Rule #13 — Commitment Ownership Contract

**Timeline owns history.** **Scenario owns possibility.** **War Room owns commitment.**

| Workspace | Domain | Question |
|-----------|--------|----------|
| **Timeline** | History | What happened? |
| **Scenario** | Possibility | What could happen? |
| **War Room** | Commitment | What are we going to do? |

**Timeline and Scenario MAY NOT:** execute actions or commit decisions.

**War Room MAY:** select strategy, create action plans, track execution status, and monitor active decisions.

**War Room MAY NOT:** rewrite history, generate simulations, or own forecasting logic.

Runtime enforcement tag: `[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]`. Active freeze tag: `[NEXORA_RULE_13_ACTIVE]` (version 1.0). All Timeline, Scenario, and War Room certifications must verify compliance. Certification fails when commitment ownership is violated.

Reference: `docs/architecture/nexora-rule-13-commitment-ownership.md`

### Rule #14 — Recommendation Ownership Contract

**War Room owns commitment.** **Advisory owns recommendation.** **Governance owns approval.** No workspace may violate this boundary.

| Domain | Question |
|--------|----------|
| **Scenario** | What could happen? |
| **War Room** | What are we going to do? |
| **Advisory** | What do I recommend? |
| **Governance** | Is this approved? |

**War Room MAY:** select strategy, create action plans, track execution status, and monitor active decisions (commitment).

**War Room MAY NOT:** issue recommendations or approve decisions.

**Advisory MAY:** generate recommendations, rank alternatives, suggest guidance, and evaluate tradeoffs.

**Advisory MAY NOT:** approve decisions or commit actions.

**Governance MAY:** approve, reject, escalate, and record approval status.

**Governance MAY NOT:** issue recommendations or commit actions.

**All other certified workspaces** (Executive Summary, Operational, Risk, Timeline, Scenario) **MAY NOT:** issue recommendations, approve decisions, or commit actions.

Runtime enforcement tag: `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`. Active freeze tag: `[NEXORA_RULE_14_ACTIVE]` (version 1.0). All workspace, Advisory, and Governance certifications must verify compliance. Certification fails when any actor crosses recommendation, approval, or commitment ownership boundaries.

Reference: `docs/architecture/nexora-rule-14-recommendation-ownership.md`

---

## MRP Constitutional Principles

The Main Right Panel (MRP) is the executive explanation layer.

### MRP Contains Only

- **Dashboard (Insight)**
- **Assistant**

MRP must never become a navigation maze. It is not a secondary app shell, a settings hub, or a collection of unrelated tools.

### MRP Must Always Preserve

- **Panel Name** — the executive always knows where they are.
- **Active Mode** — the current operational or analytical mode is visible and stable.
- **Selected Object Context** — what is selected in the Scene is reflected and honored in MRP.
- **Return Navigation** — the executive can always return to where they came from without losing context.

---

## Scene Constitutional Principles

The Scene is the primary visual intelligence layer.

The Scene must communicate the following through **object behavior** and **visual state**—not through disconnected labels, overlays, or secondary dashboards:

- **Risk**
- **Opportunity**
- **Priority**
- **Relationships**
- **Operational Status**

The Scene shows the situation. It does not explain it (MRP) or discuss it (Assistant). Visual state is the language of situational awareness.

---

## Assistant Constitutional Principles

The Assistant does not replace analysis.

The Assistant **explains** analysis, simulations, and recommendations generated by Nexora. It is a conversational layer over system intelligence—not a substitute for it.

The Assistant must:

- Ground responses in Nexora-generated analysis and simulation output.
- Respect selected object context and active executive mode.
- Support decision discussion without inventing facts or bypassing the simulation layer.

---

## Final Statement

All future architectural decisions, UI decisions, engine decisions, topology decisions, and AI decisions must be evaluated against this Constitution.

When a proposed change conflicts with any rule or principle in this document, the change must be rejected, redesigned, or explicitly superseded by a formal constitutional amendment—not implemented by exception, workaround, or local convention.

**Nexora is an Executive Decision Intelligence System. This Constitution ensures it remains one.**
