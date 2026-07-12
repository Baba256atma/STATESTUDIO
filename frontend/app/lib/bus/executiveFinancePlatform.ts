import { buildExecutiveFinancePlatform, getExecutiveFinancePlatform, runExecutiveFinancePlatform } from "./executiveFinancePlatformRunner.ts";
import { getExecutiveFinancePlatformManifest } from "./executiveFinancePlatformManifest.ts";
import { ExecutiveFinancePlatformRegistry } from "./executiveFinancePlatformRegistry.ts";

export const ExecutiveFinancePlatform = Object.freeze({
  buildExecutiveFinancePlatform,
  runExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  getExecutiveFinancePlatformManifest,
  ExecutiveFinancePlatformRegistry,
});
