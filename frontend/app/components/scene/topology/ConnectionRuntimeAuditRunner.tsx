"use client";

/**
 * AUDIT-REMOVE: Dev-only connection runtime audit runner (no render side effects).
 */

import { useEffect, useMemo, useRef } from "react";

import {
  buildConnectionRuntimeAuditSignature,
  logConnectionRuntimeAudit,
  type ConnectionRuntimeAuditContext,
} from "../../../lib/scene/topology/connectionRuntimeAudit";

export type ConnectionRuntimeAuditRunnerProps = {
  enabled?: boolean;
  context: ConnectionRuntimeAuditContext;
};

export function ConnectionRuntimeAuditRunner(props: ConnectionRuntimeAuditRunnerProps): null {
  const lastSignatureRef = useRef<string>("");
  const auditSignature = useMemo(
    () => buildConnectionRuntimeAuditSignature(props.context),
    [props.context]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (props.enabled === false) return;
    if (auditSignature === lastSignatureRef.current) return;
    lastSignatureRef.current = auditSignature;
    logConnectionRuntimeAudit(props.context);
  }, [auditSignature, props.context, props.enabled]);

  return null;
}

export default ConnectionRuntimeAuditRunner;
