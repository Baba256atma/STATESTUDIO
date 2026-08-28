/**
 * NXA:6-PREP Test Funnel — wraps existing repository commands.
 * Sequential. Does not replace CI or skip failures.
 */

export const nxaTestFunnelIdentity = "NXA:6-PREP/TestFunnel" as const;

export type NxaFunnelLevel = 1 | 2 | 3 | 4;

export type NxaFunnelCommand = Readonly<{
  id: string;
  purpose: string;
  command: string;
  required: boolean;
}>;

export const NXA_FUNNEL_LEVELS: Readonly<Record<NxaFunnelLevel, Readonly<{
  name: string;
  recommendedNext: NxaFunnelLevel | null;
  commands: readonly NxaFunnelCommand[];
}>>> = Object.freeze({
  1: Object.freeze({
    name: "Focused",
    recommendedNext: 2,
    commands: Object.freeze([
      Object.freeze({
        id: "l1-cert-infra",
        purpose: "NXA:6-PREP infrastructure self-tests",
        command: "./node_modules/.bin/tsx --test app/lib/nexora-certification/*.test.ts app/lib/runtime/diagnosticSwitch.test.ts",
        required: true,
      }),
    ]),
  }),
  2: Object.freeze({
    name: "Layer",
    recommendedNext: 3,
    commands: Object.freeze([
      Object.freeze({
        id: "l2-owning-layers",
        purpose: "CC, DIR semantic, NXA contract, and certification infrastructure",
        command: "./node_modules/.bin/tsx --test app/lib/nexora-certification/*.test.ts app/lib/conversational-control/*.test.ts app/lib/director/nexoraSemanticPresentationDirector.test.ts app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.test.ts app/lib/manager-object/nexoraNxa2ConversationGuidanceContract.test.ts app/lib/manager-object/nexoraNxa3ExecutiveSituation.test.ts app/lib/manager-object/nexoraNxa4ProactiveAdvisory.test.ts app/lib/manager-object/nexoraNxa5ExecutiveJudgment.test.ts app/lib/manager-object/nexoraNxa5Fix2CollectionPresentationParity.test.ts",
        required: true,
      }),
    ]),
  }),
  3: Object.freeze({
    name: "Integration",
    recommendedNext: 4,
    commands: Object.freeze([
      Object.freeze({
        id: "l3-cross-layer",
        purpose: "Advisor→DIR→Stage, Queue parity, FIX2, harness certified cases",
        command: "./node_modules/.bin/tsx --test app/lib/nexora-certification/*.test.ts app/lib/manager-object/nexoraNxa5Fix2CollectionPresentationParity.test.ts app/lib/director/nexoraSemanticPresentationDirector.test.ts app/lib/conversational-control/conversationalRuntimeBridge.test.ts",
        required: true,
      }),
    ]),
  }),
  4: Object.freeze({
    name: "Milestone Certification",
    recommendedNext: null,
    commands: Object.freeze([
      Object.freeze({
        id: "l4-executive-omnibus",
        purpose: "Executive-domain omnibus including new infrastructure tests",
        command: "./node_modules/.bin/tsx --test app/lib/manager-object/*.test.ts app/lib/conversational-control/*.test.ts app/lib/executive-intelligence/*.test.ts app/lib/nexora-entrance/*.test.ts app/lib/director/nexoraSemanticPresentationDirector.test.ts app/lib/nexora-certification/*.test.ts",
        required: true,
      }),
      Object.freeze({
        id: "l4-dir-inventory",
        purpose: "DIR inventory via Node strip-types",
        command: "node --experimental-strip-types --test app/lib/director/directorFoundation.test.ts app/lib/director/directorRegistry.test.ts app/lib/director/directorValidation.test.ts app/lib/director/directorCertification.test.ts app/lib/director/directorModel.test.ts app/lib/director/directorManifest.test.ts app/lib/director/directorFreeze.test.ts app/lib/director/directorPlatform.test.ts app/lib/director/directorPublicIndex.test.ts",
        required: true,
      }),
      Object.freeze({
        id: "l4-typecheck",
        purpose: "TypeScript noEmit",
        command: "NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck",
        required: true,
      }),
      Object.freeze({
        id: "l4-eslint",
        purpose: "ESLint on PREP surface",
        command: "npx eslint app/lib/nexora-certification app/lib/runtime/diagnosticSwitch.ts app/lib/runtime/diagnosticSwitch.test.ts scripts/nxa-test-funnel.mjs scripts/nxa-conversation-harness.mjs scripts/nxa-6-prep-live-smoke.mjs",
        required: true,
      }),
      Object.freeze({
        id: "l4-diff-check",
        purpose: "Whitespace check on PREP files",
        command: "git diff --check -- app/lib/nexora-certification app/lib/runtime/diagnosticSwitch.ts app/lib/runtime/diagnosticSwitch.test.ts scripts/nxa-test-funnel.mjs scripts/nxa-6-prep-live-smoke.mjs",
        required: true,
      }),
      Object.freeze({
        id: "l4-build",
        purpose: "Production build and static generation",
        command: "NODE_OPTIONS=--max-old-space-size=8192 npm run build",
        required: true,
      }),
      Object.freeze({
        id: "l4-live-smoke",
        purpose: "Live /executive smoke using existing Playwright helpers",
        command: "node scripts/nxa-6-prep-live-smoke.mjs",
        required: true,
      }),
    ]),
  }),
});
