# Nexora Domain System

The domain layer is a deterministic foundation for Type-C behavior. It converts domain vocabulary into safe objects, relationships, risk signals, scenarios, and executive guidance without mutating live scene state outside canonical insertion helpers.

## Flow

1. **Registry**: `domainRegistry.ts` defines compact domain definitions, object templates, relationship templates, risk signals, and panel vocabulary.
2. **Catalog**: `domainObjectCatalog.ts` and `domainAddObjectAdapter.ts` expose UI-friendly object options.
3. **Canonical object insertion**: `domainObjectCreation.ts` creates normalized scene objects. `domainSceneInsertion.ts` is the only domain object insertion helper and returns a new scene object.
4. **Relationship graph**: `domainRelationshipEngine.ts` derives deterministic relationship matches. `domainEdgeFactory.ts` builds schema-compatible edges. `domainGraphInsertion.ts` immutably adds only missing edges.
5. **Relationship intelligence**: `domainRelationshipRules.ts` and `enrichDomainRelationships.ts` derive semantic relationship meaning for existing edges without creating, removing, or rewriting graph structure.
6. **Chat understanding**: `domainChatInterpreter.ts` classifies text and `domainActionPlanner.ts` produces bounded planned actions. Chat does not mutate scenes directly.
7. **Risk intelligence**: `domainRiskEvaluator.ts`, `domainFragilityScoring.ts`, and `domainPropagationHints.ts` compute read-only risk signals and overlay-ready metadata.
8. **Scenarios**: `domainScenarioGenerator.ts` creates virtual executive scenarios. `deriveDomainScenarios.ts`, `domainScenarioRules.ts`, and `domainScenarioNarratives.ts` add relationship-aware executive scenario intelligence. `domainScenarioScoring.ts`, `domainScenarioComparison.ts`, and `domainExecutiveRecommendations.ts` score and explain them.
9. **Executive synthesis**: `domainExecutiveSynthesis.ts`, `domainExecutivePrioritization.ts`, and `domainExecutiveBriefing.ts` produce calm, deterministic Type-C guidance.

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

## Project Lifecycle

`domainProjectSnapshot.ts` builds a local domain project snapshot with the active domain, scene payload, object count, edge count, and optional derived intelligence snapshots. `domainProjectValidation.ts` validates the snapshot contract without throwing. `domainProjectStorage.ts` saves, loads, and clears one browser-local snapshot under `nexora.domain.project.v1`; it is guarded for SSR and localStorage failures.

Restore is intentionally passive: `domainProjectRestore.ts` returns the saved scene and active domain id only. React state updates, panel choices, routing, and any derived risk/scenario/executive recomputation must happen in the caller. There is no autosave and no backend persistence in this phase. Derived intelligence should normally be recomputed after restore unless a caller explicitly chooses to display the saved derived snapshot.

## Timeline & Propagation Visualization

`domainPropagationBuilder.ts` converts domain edges and propagation hints into a small deterministic timeline of propagation events. Frames are capped, deduped by source/target/type, and use stable timestamps and ids so callers can memoize safely. `domainPropagationVisualization.ts` converts frames into renderer-safe object and edge highlight metadata, while `domainTimelineSummary.ts` produces a concise executive summary.

This layer is not a simulation engine, physics engine, or animation loop. It does not mutate scene JSON, open panels, or trigger playback. Future UI/overlay callers should invoke it explicitly, reuse existing propagation overlay guards, and avoid regenerating frames every render.

## Relationship Intelligence

`domainRelationshipTypes.ts` defines stable semantic relationship metadata such as `dependency`, `flow`, `risk`, `financial`, `control`, and `monitoring`. `domainRelationshipRules.ts` maps domain object pairs and existing relationship types into that metadata through small deterministic rules. `enrichDomainRelationships.ts` returns read-only enriched edge descriptions and executive explanations, leaving scene edges untouched.

Propagation remains conservative: `domainPropagationHints.ts` only applies small semantic multipliers when relationship metadata is present or inferable from existing edge types. Dependency and risk paths strengthen propagation, while monitoring/support relationships soften it. This is enrichment, not graph rewriting.

## Scenario Intelligence

`deriveDomainScenarios.ts` turns objects, semantic relationships, and fragility scores into read-only executive scenario overlays. It does not create objects, create edges, open panels, mutate scene JSON, or run simulations. Scenario types include delay, bottleneck, instability, overload, dependency failure, resource constraint, financial pressure, and communication breakdown.

`domainScenarioRules.ts` performs deterministic pattern matching from relationship semantics and fragility pressure. `domainScenarioIntelligenceScoring.ts` produces bounded confidence and priority values, while `domainScenarioNarratives.ts` converts technical patterns into short executive language. Derived scenarios use stable ids and deterministic `createdAt` values so callers can memoize safely.

`domainScenarioOverlays.ts` converts derived scenarios into renderer/panel-safe metadata: scenario summaries and object highlight hints. It is passive and does not mutate scene JSON or open panels.

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
