# Assistant-introduced referents

Nexora’s own answer can introduce a follow-up referent when the entity is **canonical and resolved**, not when it is arbitrary Advisor prose.

## Data sources

On unique CSV/Data Library listing (`csv-availability`, inventory, pending inventory, source inventory, named source, source contents/semantics/status):

- bind `advisorDataDialogue.sourceContextId` to that source;
- record the same id on FINAL:6.2 via `applyAssistantIntroducedReferent`.

Multiple listed sources do not guess a unique `sourceContextId`. Isolated `it` asks which CSV.

## Other families

Named Problem, Risk, Scenario, Decision, Execution, and KPI/object already become 6.2 active subjects when the manager or Nexora resolves them canonically (SHOW of one, explicit name, ordinal, Stage click). This repair does not add a parallel entity extractor from free text.

A manager can then say `explain it` / `tell me more about it` without repeating the just-introduced canonical name.

## What is not a referent

Unstructured sentences, suggested criteria, and generic capability talk do not mint referents. HELP parks the thread; a later weak `it` clarifies when Scenario history and a Data introduction both remain.
