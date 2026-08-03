export type {
  ConnectionLifecycle,
  ConnectorDescriptor,
  ConnectorFieldMapping,
  ConnectorFilter,
  ConnectorHealthState,
  ConnectorJournalEntry,
  ConnectorKind,
  ConnectorValidationResult,
  DiscoveredSchema,
  ExecutiveConnector,
  SchemaPreviewStats,
} from "./ExecutiveConnectorContracts";
export {
  buildDiscoveredSchema,
  computePreviewStats,
  detectColumnType,
  parseCsvText,
} from "./ExecutiveSchemaDiscovery";
export { validateDiscoveredSchema } from "./ExecutiveConnectorValidation";
export { healthColor, healthFromLifecycle } from "./ExecutiveConnectorHealth";
export {
  createConnectorRegistry,
  createDefaultConnectors,
} from "./ExecutiveConnectorRegistry";
export { createConnectorManager } from "./ExecutiveConnectorManager";
export type { ManagedConnectorStatus } from "./ExecutiveConnectorManager";
export {
  createIdleSession,
  suggestMappingsFromSchema,
  toConnectorJournalEntry,
} from "./ExecutiveConnectionSession";
export type { ExecutiveConnectionSession } from "./ExecutiveConnectionSession";
export { createConnectorPlatform } from "./ExecutiveConnectorPlatform";
export type { ExecutiveConnectorPlatform } from "./ExecutiveConnectorPlatform";
export {
  buildPublishedMappings,
  buildPublishedSource,
  publishSessionToRuntime,
} from "./ExecutiveRuntimePublisher";
export { createCsvConnector, SAMPLE_INVENTORY_CSV } from "./connectors/CsvConnector";
export { createExcelConnector } from "./connectors/ExcelConnector";
export { createRestApiConnector } from "./connectors/RestApiConnector";
export { createDatabaseConnector } from "./connectors/DatabaseConnector";
export { createSapConnector } from "./connectors/SapConnector";
export {
  ExecutiveConnectorContext,
  ExecutiveConnectorProvider,
} from "./ExecutiveConnectorProvider";
export { useEnterpriseConnector } from "./hooks/useEnterpriseConnector";
export { ExecutiveConnectorExplorer } from "./ExecutiveConnectorExplorer";
export { ExecutivePublishWizard } from "./ExecutivePublishWizard";
export { ExecutiveSchemaPreview } from "./ExecutiveSchemaPreview";
export { ExecutiveConnectorJournalEntry } from "./ExecutiveConnectorJournalEntry";
export {
  getConnectorInspectorSnapshot,
  publishConnectorInspectorSnapshot,
  subscribeConnectorInspector,
} from "./connectorInspectorBridge";
