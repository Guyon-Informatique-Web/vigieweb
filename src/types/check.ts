// Types lies aux resultats de checks

import type { SiteStatus } from "./site";

export type CheckType = "UPTIME" | "SSL" | "DOMAIN" | "PERFORMANCE";

export interface Check {
  id: string;
  siteId: string;
  status: SiteStatus;
  statusCode: number | null;
  responseTime: number | null;
  errorMessage: string | null;
  checkType: CheckType;
  checkedAt: Date;
}
