# Nexora Domain System

The domain layer is a deterministic foundation for Type-C behavior. It converts domain vocabulary into safe objects, relationships, risk signals, scenarios, and executive guidance without mutating live scene state outside canonical insertion helpers.

## Flow

1. **Registry**: `domainRegistry.ts` defines compact domain definitions, object templates, relationship templates, risk signals, and panel vocabulary.
2. **Catalog**: `domainObjectCatalog.ts` and `domainAddObjectAdapter.ts` expose UI-friendly object options.
3. **Canonical object insertion**: `domainObjectCreation.ts` creates normalized scene objects. `domainSceneInsertion.ts` is the only domain object insertion helper and returns a new scene object.
4. **Relationship graph**: `domainRelationshipEngine.ts` derives deterministic relationship matches. `domainEdgeFactory.ts` builds schema-compatible edges. `domainGraphInsertion.ts` immutably adds only missing edges.
5. **Chat understanding**: `domainChatInterpreter.ts` classifies text and `domainActionPlanner.ts` produces bounded planned actions. Chat does not mutate scenes directly.
6. **Risk intelligence**: `domainRiskEvaluator.ts`, `domainFragilityScoring.ts`, and `domainPropagationHints.ts` compute read-only risk signals and overlay-ready metadata.
7. **Scenarios**: `domainScenarioGenerator.ts` creates virtual executive scenarios. `domainScenarioScoring.ts`, `domainScenarioComparison.ts`, and `domainExecutiveRecommendations.ts` score and explain them.
8. **Executive synthesis**: `domainExecutiveSynthesis.ts`, `domainExecutivePrioritization.ts`, and `domainExecutiveBriefing.ts` produce calm, deterministic Type-C guidance.

## Anti-loop Expectations

- No domain module should call React state setters, open panels, or mutate scene objects in place.
- Repeated calls with the same input should produce identical outputs, except insertion metadata timestamps.
- Chat planning is capped to one or two object actions per message.
- Graph insertion is idempotent: existing source/target/type edges are skipped.

## Dedupe Strategy

`domainDedupe.ts` centralizes stable signatures for actions, objects, edges, signals, and scenarios. Prefer these helpers before adding module-local dedupe logic.

## Validation

`domainContractValidation.ts` provides lightweight validators for:

- domain objects
- domain edges
- risk signals
- scenarios
- executive insights

Validators return warnings instead of throwing so production flows degrade safely.

## Extension Guidelines

- Add vocabulary through `domainRegistry.ts` first.
- Reuse canonical insertion helpers for scene writes.
- Keep risk, scenario, and executive layers read-only.
- Prefer deterministic rules over AI-style inference.
- Add integration tests when connecting a new layer to the existing flow.

## Domain Phase Validation Checklist

- Domain selection falls back safely through `normalizeDomainId`.
- Add Object menu data comes from `getAddObjectMenuItemsForDomain`.
- Object creation uses `createDomainSceneObject` and `insertDomainObjectIntoScene`.
- Relationship generation uses `insertDomainRelationshipsIntoScene` and remains idempotent.
- Risk, scenario, and executive intelligence layers are read-only derivations.
- Panels are not opened by domain engines; UI must call panel APIs explicitly.
- Repeated graph/risk/scenario/executive derivations must be deterministic.
- Smoke coverage lives in `domainFullFlowSmoke.test.ts`.
