# NPA-T RMS:1 — Actor contracts

## Manager Agent

Represents a realistic manager. Future: ask, set Goals, investigate Problems, review KPIs/Risks, compare Scenarios, make/approve Decisions, monitor Execution/Outcomes.

RMS:1: contract only. Actions tagged `MANAGER_AGENT`. Speaks to Nexora through CC:5 later; no autonomous decision loop.

## Operator Agent

Represents operational activity of the simulated Business/Project. Future domains: sales, purchasing, production, inventory, maintenance, HR, finance, PMO/project operations, other.

RMS:1: contract only. May later produce observable data for Data Reality. Must not write Ground Truth into Nexora. No CSV generation.

## Nexora

The real product runtime. Runtime owner CC:5 (`executeNexoraConversationalExperience`). Ground Truth access `FORBIDDEN`. Knowledge only from legitimate Data, Object, Advisor, Stage, and management authorities.

No privileged “simulation Nexora”.

## Observer

Read-only. May later classify: Manager Agent error, Operator Agent error, Nexora behavior/error, conversation error, data error, Object/referent error, simulation/world error, runtime/system error.

Must not repair, influence, or override Manager, Operator, or Nexora.

## Real manager (reserved)

`REAL_MANAGER` channel for future TAKE_CONTROL. Distinct from Manager Agent.
