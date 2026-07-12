export type FinancePlatformId = "BUS-28";

export type FinancePlatformName = "Executive Finance Platform";

export type FinancePlatformCode = "EXEC_FIN";

export type FinancePlatformVersion = "1.0.0";

export type FinancePlatformStage = "Foundation";

export type FinancialObjectType =
  | "Revenue"
  | "Expense"
  | "Cost"
  | "Profit"
  | "Budget"
  | "Forecast"
  | "CashFlow"
  | "Invoice"
  | "Payment"
  | "Account"
  | "Currency"
  | "Asset"
  | "Liability"
  | "Equity"
  | "FinancialPeriod"
  | "FinancialStatement";

export type FinancialStatus = "Draft" | "Active" | "Frozen" | "Archived";

export type FinancialPeriodType = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";

export type CurrencyType = "ISO4217";

export type FinancialVisibility = "Internal" | "Public" | "Restricted";

export type FinanceIdentity = Readonly<{
  readonly platformId: FinancePlatformId;
  readonly platformName: FinancePlatformName;
  readonly platformCode: FinancePlatformCode;
  readonly platformVersion: FinancePlatformVersion;
  readonly platformStage: FinancePlatformStage;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceMetadata = Readonly<{
  readonly moduleName: "finance-contracts";
  readonly version: FinancePlatformVersion;
  readonly contractVersion: "1.0.0";
  readonly publicApis: readonly string[];
  readonly supportedConsumers: readonly string[];
  readonly architectureLayer: "BUS";
  readonly certificationState: "BUS-28:1 Foundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialObject = Readonly<{
  readonly objectId: `${Lowercase<string>}-${string}`;
  readonly objectType: FinancialObjectType;
  readonly status: FinancialStatus;
  readonly visibility: FinancialVisibility;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialAccount = Readonly<{
  readonly accountId: `account-${string}`;
  readonly accountCode: string;
  readonly accountName: string;
  readonly status: FinancialStatus;
  readonly visibility: FinancialVisibility;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialCurrency = Readonly<{
  readonly currencyId: `currency-${string}`;
  readonly currencyCode: string;
  readonly currencyType: CurrencyType;
  readonly status: FinancialStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialPeriod = Readonly<{
  readonly periodId: `period-${string}`;
  readonly periodType: FinancialPeriodType;
  readonly label: string;
  readonly status: FinancialStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialStatement = Readonly<{
  readonly statementId: `statement-${string}`;
  readonly statementType:
    | Extract<
        FinancialObjectType,
        | "Revenue"
        | "Expense"
        | "Cost"
        | "Profit"
        | "CashFlow"
        | "Asset"
        | "Liability"
        | "Equity"
      >
    | "FinancialStatement";
  readonly periodId: FinancialPeriod["periodId"];
  readonly visibility: FinancialVisibility;
  readonly status: FinancialStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinancialApiDescriptor = Readonly<{
  readonly apiName: string;
  readonly returnType: "metadata";
  readonly stable: true;
  readonly runtimeBehavior: false;
}>;

export type FinanceContractSummary = Readonly<{
  readonly contractLayer: "BUS-28:1";
  readonly objectTypes: readonly FinancialObjectType[];
  readonly statuses: readonly FinancialStatus[];
  readonly periodTypes: readonly FinancialPeriodType[];
  readonly currencyTypes: readonly CurrencyType[];
  readonly visibilities: readonly FinancialVisibility[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
