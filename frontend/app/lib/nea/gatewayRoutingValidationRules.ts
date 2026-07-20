/**
 * NEA-5:4 — Gateway Routing Validation Rules.
 *
 * Immutable declarative validation rules for NEA-5:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-5:4.
 */

import {
  GatewayRoutingModelId,
  GatewayRoutingModelPlatform,
} from "./gatewayRoutingModel.ts";
import type {
  GatewayRoutingValidationCategory,
  GatewayRoutingValidationCategoryId,
  GatewayRoutingValidationRule,
  GatewayRoutingValidationSeverity,
  GatewayRoutingValidationTarget,
} from "./gatewayRoutingValidationTypes.ts";

const model = GatewayRoutingModelPlatform;

const category = (
  categoryId: GatewayRoutingValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: GatewayRoutingValidationTarget,
  order: number,
): GatewayRoutingValidationCategory =>
  Object.freeze({
    categoryId,
    categoryName,
    description,
    targetModelKind,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly twenty-two validation categories. */
export const GatewayRoutingValidationCategories: readonly GatewayRoutingValidationCategory[] =
  Object.freeze([
    category("RouteIdentity", "Route Identity Validation", "Validate route identity completeness and uniqueness.", "RouteIdentity", 1),
    category("RouteDefinition", "Route Definition Validation", "Validate route definition composition and references.", "RouteDefinition", 2),
    category("RouteDestination", "Route Destination Validation", "Validate canonical destination references.", "RouteDestination", 3),
    category("RouteDecision", "Route Decision Validation", "Validate canonical decision references.", "RouteDecision", 4),
    category("RouteContext", "Route Context Validation", "Validate canonical routing contexts.", "RouteContext", 5),
    category("RouteStrategy", "Route Strategy Validation", "Validate strategy declarations — no execution.", "RouteStrategy", 6),
    category("RoutePriority", "Route Priority Validation", "Validate canonical priority references.", "RoutePriority", 7),
    category("RouteStatus", "Route Status Validation", "Validate routing status metadata.", "RouteStatus", 8),
    category("RouteResult", "Route Result Validation", "Validate routing result structure.", "RouteResult", 9),
    category("RoutePolicy", "Route Policy Validation", "Validate routing policy declarations.", "RoutePolicy", 10),
    category("RouteMetadata", "Route Metadata Validation", "Validate metadata completeness.", "RouteMetadata", 11),
    category("RouteCapability", "Route Capability Validation", "Validate canonical routing capabilities.", "RouteCapability", 12),
    category("RouteLifecycle", "Route Lifecycle Validation", "Validate canonical routing lifecycle.", "RouteLifecycle", 13),
    category("RouteRequest", "Route Request Validation", "Validate request composition — no routing execution.", "RouteRequest", 14),
    category("RouteResponse", "Route Response Validation", "Validate response composition.", "RouteResponse", 15),
    category("RouteResolution", "Route Resolution Validation", "Validate destination resolution metadata — no routing logic.", "RouteResolution", 16),
    category("RouteDiagnostics", "Route Diagnostics Validation", "Validate diagnostics metadata.", "RouteDiagnostics", 17),
    category("RouteSummary", "Route Summary Validation", "Validate summary composition.", "RouteSummary", 18),
    category("RouteConfiguration", "Route Configuration Validation", "Validate configuration metadata — no executable configuration.", "RouteConfiguration", 19),
    category("RouteReference", "Route Reference Validation", "Validate canonical route references.", "RouteReference", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across routing models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: GatewayRoutingValidationCategoryId,
  targetModelKind: GatewayRoutingValidationTarget,
  description: string,
  severity: GatewayRoutingValidationSeverity,
  order: number,
): GatewayRoutingValidationRule =>
  Object.freeze({
    ruleId: `NEA-5:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${GatewayRoutingModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly sixty declarative validation rules.
 * All reference Model kinds. No rule executes validation.
 */
export const GatewayRoutingValidationRules: readonly GatewayRoutingValidationRule[] =
  Object.freeze([
    rule("RouteIdentity-Completeness", "Route Identity Completeness", "RouteIdentity", "RouteIdentity", "Route identity fields must be declared completely.", "Error", 1),
    rule("RouteIdentity-Unique", "Unique Route Identity", "RouteIdentity", "RouteIdentity", "Route identity ids must be unique.", "Error", 2),
    rule("RouteIdentity-Canonical", "Route Identity Canonical Reference", "RouteIdentity", "RouteIdentity", "Route identity must preserve canonical Registry references.", "Error", 3),

    rule("RouteDefinition-Completeness", "Route Definition Completeness", "RouteDefinition", "RouteDefinition", "Route definition fields must be declared completely.", "Error", 4),
    rule("RouteDefinition-Composition", "Route Definition Composition", "RouteDefinition", "RouteDefinition", "Route definition must declare destination, strategy, priority, capability, and lifecycle references.", "Error", 5),
    rule("RouteDefinition-NoRouting", "Route Definition Non-Routing", "RouteDefinition", "RouteDefinition", "Route definition validation must not execute routing.", "Info", 6),

    rule("RouteDestination-Canonical", "Route Destination Canonical Reference", "RouteDestination", "RouteDestination", "Destination must reference a canonical Registry destination.", "Error", 7),
    rule("RouteDestination-Completeness", "Route Destination Completeness", "RouteDestination", "RouteDestination", "Destination metadata must be complete.", "Error", 8),
    rule("RouteDestination-NoInvocation", "Route Destination Non-Invocation", "RouteDestination", "RouteDestination", "Destination validation must not invoke consumers.", "Info", 9),

    rule("RouteDecision-Canonical", "Route Decision Canonical Reference", "RouteDecision", "RouteDecision", "Decision must reference a canonical Registry decision.", "Error", 10),
    rule("RouteDecision-Completeness", "Route Decision Completeness", "RouteDecision", "RouteDecision", "Decision metadata must be complete.", "Error", 11),
    rule("RouteDecision-NoEvaluation", "Route Decision Non-Evaluation", "RouteDecision", "RouteDecision", "Decision validation must not evaluate decisions.", "Info", 12),

    rule("RouteContext-Canonical", "Route Context Canonical Reference", "RouteContext", "RouteContext", "Context must reference a canonical Registry context.", "Error", 13),
    rule("RouteContext-NoPropagation", "Route Context Non-Propagation", "RouteContext", "RouteContext", "Context validation must not propagate context at runtime.", "Info", 14),

    rule("RouteStrategy-Canonical", "Route Strategy Canonical Reference", "RouteStrategy", "RouteStrategy", "Strategy must reference a canonical Registry strategy.", "Error", 15),
    rule("RouteStrategy-NoExecution", "Route Strategy Non-Execution", "RouteStrategy", "RouteStrategy", "Strategy validation must not execute strategies.", "Info", 16),

    rule("RoutePriority-Canonical", "Route Priority Canonical Reference", "RoutePriority", "RoutePriority", "Priority must reference a canonical Registry priority.", "Error", 17),
    rule("RoutePriority-NoScheduling", "Route Priority Non-Scheduling", "RoutePriority", "RoutePriority", "Priority validation must not schedule priority.", "Info", 18),

    rule("RouteStatus-Canonical", "Route Status Canonical Reference", "RouteStatus", "RouteStatus", "Status must reference a canonical Registry status.", "Error", 19),
    rule("RouteStatus-NoTransitions", "Route Status Non-Transition", "RouteStatus", "RouteStatus", "Status validation must not transition status at runtime.", "Info", 20),

    rule("RouteResult-Structure", "Route Result Structure", "RouteResult", "RouteResult", "Route result structure must be complete.", "Error", 21),
    rule("RouteResult-NoEmission", "Route Result Non-Emission", "RouteResult", "RouteResult", "Result validation must not emit results at runtime.", "Info", 22),

    rule("RoutePolicy-Canonical", "Route Policy Canonical Reference", "RoutePolicy", "RoutePolicy", "Policy must reference a canonical Registry routing policy.", "Error", 23),
    rule("RoutePolicy-NoExecution", "Route Policy Non-Execution", "RoutePolicy", "RoutePolicy", "Policy validation must not execute policies.", "Info", 24),

    rule("RouteMetadata-Completeness", "Route Metadata Completeness", "RouteMetadata", "RouteMetadata", "Route metadata model must be complete.", "Error", 25),
    rule("RouteMetadata-Lifecycle", "Route Metadata Lifecycle Consistency", "RouteMetadata", "RouteMetadata", "Route metadata lifecycle must remain consistent.", "Error", 26),

    rule("RouteCapability-Canonical", "Route Capability Canonical Reference", "RouteCapability", "RouteCapability", "Capability must reference a canonical Registry capability.", "Error", 27),
    rule("RouteCapability-NoExecution", "Route Capability Non-Execution", "RouteCapability", "RouteCapability", "Capability validation must not execute capabilities.", "Info", 28),

    rule("RouteLifecycle-Canonical", "Route Lifecycle Canonical Reference", "RouteLifecycle", "RouteLifecycle", "Lifecycle must reference a canonical Registry lifecycle entry.", "Error", 29),
    rule("RouteLifecycle-NoStateMachine", "Route Lifecycle Non-State-Machine", "RouteLifecycle", "RouteLifecycle", "Lifecycle validation must not execute a state machine.", "Info", 30),

    rule("RouteRequest-Composition", "Route Request Composition", "RouteRequest", "RouteRequest", "Route request must compose identity, context, and resolution references.", "Error", 31),
    rule("RouteRequest-Completeness", "Route Request Completeness", "RouteRequest", "RouteRequest", "Route request fields must be declared completely.", "Error", 32),
    rule("RouteRequest-NoProcessing", "Route Request Non-Processing", "RouteRequest", "RouteRequest", "Request validation must not process messages.", "Info", 33),

    rule("RouteResponse-Composition", "Route Response Composition", "RouteResponse", "RouteResponse", "Route response must compose result and diagnostics references.", "Error", 34),
    rule("RouteResponse-Completeness", "Route Response Completeness", "RouteResponse", "RouteResponse", "Route response fields must be declared completely.", "Error", 35),
    rule("RouteResponse-NoInvocation", "Route Response Non-Invocation", "RouteResponse", "RouteResponse", "Response validation must not invoke consumers.", "Info", 36),

    rule("RouteResolution-Composition", "Route Resolution Composition", "RouteResolution", "RouteResolution", "Route resolution must declare destination and decision references.", "Error", 37),
    rule("RouteResolution-Completeness", "Route Resolution Completeness", "RouteResolution", "RouteResolution", "Route resolution fields must be declared completely.", "Error", 38),
    rule("RouteResolution-NoLogic", "Route Resolution Non-Logic", "RouteResolution", "RouteResolution", "Resolution validation must not execute routing logic.", "Info", 39),

    rule("RouteDiagnostics-Structure", "Route Diagnostics Structure", "RouteDiagnostics", "RouteDiagnostics", "Diagnostics metadata structure must be complete.", "Error", 40),
    rule("RouteDiagnostics-Composition", "Route Diagnostics Composition", "RouteDiagnostics", "RouteDiagnostics", "Diagnostics must compose declared result references.", "Error", 41),

    rule("RouteSummary-Composition", "Route Summary Composition", "RouteSummary", "RouteSummary", "Summary must compose definition and response references.", "Error", 42),
    rule("RouteSummary-ResultRefs", "Route Summary Result References", "RouteSummary", "RouteSummary", "Summary may declare optional response diagnostics references.", "Warning", 43),
    rule("RouteSummary-Completeness", "Route Summary Completeness", "RouteSummary", "RouteSummary", "Route summary metadata must be complete.", "Error", 44),

    rule("RouteConfiguration-Strategy", "Route Configuration Strategy Reference", "RouteConfiguration", "RouteConfiguration", "Configuration must declare strategy references.", "Error", 45),
    rule("RouteConfiguration-NoExecutable", "Route Configuration Non-Executable", "RouteConfiguration", "RouteConfiguration", "Configuration validation must not execute configuration.", "Info", 46),

    rule("RouteReference-Identity", "Route Reference Identity Reference", "RouteReference", "RouteReference", "Route reference must declare a route identity reference.", "Error", 47),
    rule("RouteReference-Canonical", "Route Reference Canonical Contracts", "RouteReference", "RouteReference", "Route reference must preserve canonical contract references.", "Error", 48),

    rule("CrossModel-IdentityDefinition", "Cross-Model Identity Definition", "CrossModel", "CrossModel", "Identity ↔ Definition relationship must remain consistent.", "Error", 49),
    rule("CrossModel-DefinitionDestination", "Cross-Model Definition Destination", "CrossModel", "CrossModel", "Definition ↔ Destination relationship must remain consistent.", "Error", 50),
    rule("CrossModel-DefinitionStrategy", "Cross-Model Definition Strategy", "CrossModel", "CrossModel", "Definition ↔ Strategy relationship must remain consistent.", "Error", 51),
    rule("CrossModel-RequestIdentity", "Cross-Model Request Identity", "CrossModel", "CrossModel", "Request ↔ Identity relationship must remain consistent.", "Error", 52),
    rule("CrossModel-RequestResolution", "Cross-Model Request Resolution", "CrossModel", "CrossModel", "Request ↔ Resolution relationship must remain consistent.", "Error", 53),
    rule("CrossModel-ResolutionDestination", "Cross-Model Resolution Destination", "CrossModel", "CrossModel", "Resolution ↔ Destination/Decision relationship must remain consistent.", "Error", 54),
    rule("CrossModel-ResponseResult", "Cross-Model Response Result", "CrossModel", "CrossModel", "Response ↔ Result relationship must remain consistent.", "Error", 55),
    rule("CrossModel-SummaryDefinition", "Cross-Model Summary Definition", "CrossModel", "CrossModel", "Summary ↔ Definition/Response relationship must remain consistent.", "Error", 56),

    rule("Platform-ModelRefs", "Platform Model References", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 57),
    rule("Platform-Ownership", "Platform Ownership Consistency", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 58),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 59),
    rule("Platform-ImmutableComposition", "Platform Immutable Composition", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved.", "Error", 60),
  ]);

/** Model anchors proving rules target NEA-5:3 domain models. */
export const GatewayRoutingValidationModelAnchors = Object.freeze({
  modelId: GatewayRoutingModelId,
  sourcePhase: "NEA-5:4" as const,
  domainModelCount: model.domainModels.modelCount,
  routeIdentityModelCount: model.domainModels.routeIdentityModelCount,
  relationshipCount: model.relationships.relationshipCount,
  domainModelKinds: Object.freeze(
    model.domainModels.models.map((item) => item.modelKind),
  ),
  preservesCanonicalModelReferences: true as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable rules catalog. */
export const GatewayRoutingValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-5:4/ValidationRuleCatalog",
  sourcePhase: "NEA-5:4" as const,
  categories: GatewayRoutingValidationCategories,
  rules: GatewayRoutingValidationRules,
  categoryCount: GatewayRoutingValidationCategories.length,
  ruleCount: GatewayRoutingValidationRules.length,
  modelAnchors: GatewayRoutingValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
