import type { FinanceIdentity as FinanceIdentityContract } from "./financeTypes.ts";

export const FinanceIdentity: FinanceIdentityContract = Object.freeze({
  platformId: "BUS-28",
  platformName: "Executive Finance Platform",
  platformCode: "EXEC_FIN",
  platformVersion: "1.0.0",
  platformStage: "Foundation",
  metadataOnly: true,
  immutable: true,
});

export function getFinanceIdentity(): FinanceIdentityContract {
  return FinanceIdentity;
}
