# APP-7:6 — Business Timeline API + Consumer Contract Layer

## Purpose

APP-7:6 is the **official public access layer** for the Business Timeline platform. Future Dashboard, Assistant, Workspace, Visualization, Report, and Export consumers must use this facade — not internal APP-7 modules directly.

Builds on **APP-7:1** through **APP-7:5**.

## API groups

### `BusinessTimelineApi.events`
- `createEvent`, `getEventById`, `getEventsByWorkspace`, `updateEventMetadata`, `archiveEvent`

### `BusinessTimelineApi.query`
- `queryTimeline`, `getOrderedEvents`, `getRange`, `getSummary`

### `BusinessTimelineApi.lifecycle`
- `buildLifecycle`, `getLifecycleSummary`, `extractMilestones`

### `BusinessTimelineApi.context`
- `buildContextModel`, `getEventContext`, `getRelatedEvents`

### `BusinessTimelineApi.certification`
- `runCertification`

## Consumer contracts

| Consumer | Read-only | Mutation | Allowed groups | Forbidden groups |
| --- | --- | --- | --- | --- |
| DashboardConsumer | yes | no | query, lifecycle, context | events, certification |
| AssistantConsumer | yes | no | query, lifecycle, context | events, certification |
| WorkspaceConsumer | no | yes | events, query, lifecycle, context | certification |
| VisualizationConsumer | yes | no | query, context | events, lifecycle, certification |
| ReportConsumer | yes | no | query, lifecycle, context | events, certification |
| ExportConsumer | yes | no | query, lifecycle, context, certification | events |
| FutureAppConsumer | yes | no | query, lifecycle, context, certification | events |

## Direct import guard

Future consumers **MUST import APP-7:6 public APIs only**. Direct imports from `businessEventEngine`, `businessTimelineQuery`, `businessTimelineLifecycle`, or `businessTimelineContext` internal modules are forbidden.

## Public entry points

- `createBusinessTimelineApi()`
- `getBusinessTimelineApi()`
- `getBusinessTimelineApiManifest()`
- `validateBusinessTimelineApiContract()`
- `getBusinessTimelineConsumerContract()`
- `validateBusinessTimelineConsumerAccess()`
- `runBusinessTimelineApiCertification()`

## Certification

```bash
cd frontend && node --test app/lib/business-timeline/businessTimelineApi.test.ts
```

## Next phase

APP-7:7 may add platform certification or freeze metadata consuming APP-7:6.
