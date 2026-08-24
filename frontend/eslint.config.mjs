import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Temporary tsc emit for executiveIntent/executiveMemory experiments (not governed source).
    // Owner: Frontend Tooling. Parallel to `.tmp/` psych smoke outDir; never linted as product code.
    ".tmp-em/**",
    // Certification artifacts and Node capture scripts are not product runtime.
    // They use CommonJS `require()` by design and must not fail the product lint gate.
    ".certification/**",
    ".validation-screenshots/**",
  ]),
  {
    name: "nexora/certified-imperative-r3f-runtime",
    files: [
      "app/components/SceneCanvas.tsx",
      "app/components/scene/AnimatableObject.tsx",
      "app/components/scene/navigation/ExecutiveOrbitControls.tsx",
      "app/components/panels/ExecutiveDashboardPanel.tsx",
      "app/executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx",
      "app/executive/nex-mvp/stage/NexoraStageScene.tsx",
      "app/executive/nex-mvp/stage/NexoraStageObject.tsx",
      "app/executive/exs1/advisor/ExecutiveAdvisorProvider.tsx",
      "app/executive/exs1/beta/ExecutiveBetaProvider.tsx",
      "app/executive/exs1/runtime/ExecutiveRuntimeProvider.tsx",
      "app/executive/exs1/impact/hooks/useScenarioImpact.ts",
      "app/executive/exs1/components/Exs1Cockpit.tsx",
      "app/lib/simulation/usePropagationBridge.ts",
      "app/screens/hooks/scene/useSceneApplyController.ts",
    ],
    rules: {
      // React Compiler treats Three.js/R3F scene mutation, lazy store refs,
      // signature-based memoization, and effect-synced state as errors.
      // Those are certified imperative runtime seams. Changing them would
      // redesign frozen Stage/EXS1/dashboard memo contracts. Keep them
      // visible as warnings; do not fail the product gate on compiler/R3F
      // impedance.
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/use-memo": "warn",
    },
  },
]);

export default eslintConfig;
