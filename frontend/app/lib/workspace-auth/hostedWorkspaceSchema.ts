/**
 * HOSTED-MVP:2 — Postgres schema for workspace ownership.
 *
 * HOSTED-MVP:3 extends this database. It does not replace it.
 */

export const HOSTED_WORKSPACE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS hosted_workspace (
  workspace_id text PRIMARY KEY,
  owner_user_id text NOT NULL,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('BUSINESS', 'PROJECT')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS hosted_workspace_owner_idx
  ON hosted_workspace (owner_user_id, created_at);

CREATE TABLE IF NOT EXISTS hosted_pending_csv (
  pending_id text PRIMARY KEY,
  workspace_id text NOT NULL REFERENCES hosted_workspace (workspace_id) ON DELETE CASCADE,
  file_name text NOT NULL,
  csv_text text NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS hosted_pending_csv_workspace_idx
  ON hosted_pending_csv (workspace_id, expires_at);

CREATE TABLE IF NOT EXISTS hosted_data_source (
  source_id text NOT NULL,
  workspace_id text NOT NULL REFERENCES hosted_workspace (workspace_id) ON DELETE CASCADE,
  import_id text NOT NULL,
  file_name text NOT NULL,
  mapping_json text NOT NULL,
  prepared_json text NOT NULL,
  row_count integer NOT NULL,
  accepted_at timestamptz NOT NULL,
  PRIMARY KEY (workspace_id, source_id)
);
CREATE INDEX IF NOT EXISTS hosted_data_source_workspace_idx
  ON hosted_data_source (workspace_id, accepted_at, source_id);

CREATE TABLE IF NOT EXISTS hosted_observation (
  observation_id text PRIMARY KEY,
  workspace_id text NOT NULL,
  source_id text NOT NULL,
  metric_id text NOT NULL,
  value_text text NOT NULL,
  observed_at timestamptz,
  row_number integer NOT NULL,
  provenance text NOT NULL,
  FOREIGN KEY (workspace_id, source_id)
    REFERENCES hosted_data_source (workspace_id, source_id) ON DELETE CASCADE,
  UNIQUE (workspace_id, source_id, metric_id, row_number)
);
CREATE INDEX IF NOT EXISTS hosted_observation_source_idx
  ON hosted_observation (workspace_id, source_id, row_number);

CREATE TABLE IF NOT EXISTS hosted_decision (
  workspace_id text NOT NULL REFERENCES hosted_workspace (workspace_id) ON DELETE CASCADE,
  decision_id text NOT NULL,
  record_json text NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (workspace_id, decision_id)
);

CREATE TABLE IF NOT EXISTS hosted_execution (
  workspace_id text NOT NULL REFERENCES hosted_workspace (workspace_id) ON DELETE CASCADE,
  execution_id text NOT NULL,
  decision_id text NOT NULL,
  record_json text NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (workspace_id, execution_id),
  FOREIGN KEY (workspace_id, decision_id)
    REFERENCES hosted_decision (workspace_id, decision_id)
);

CREATE TABLE IF NOT EXISTS hosted_saved_scene (
  workspace_id text NOT NULL REFERENCES hosted_workspace (workspace_id) ON DELETE CASCADE,
  scene_id text NOT NULL,
  name text NOT NULL,
  is_default boolean NOT NULL,
  record_json text NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (workspace_id, scene_id)
);
`;
