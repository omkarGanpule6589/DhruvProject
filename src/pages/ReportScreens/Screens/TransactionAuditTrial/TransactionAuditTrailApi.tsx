import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getAuditTrailtabout(body) {
  const accessToken = getSessionToken();
  return api.post(`svc/AuditTrailService/AduitSearch`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getAuditTrailHistory(body) {
  const accessToken = getSessionToken();
  return api.post(`svc/AuditTrailService/TransactionHistory`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getRoutecardIdbyName(params) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/RouteCard?$filter=RouteCardName eq '${params}'&$select=RouteCardId`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getRoutecardList() {
  const accessToken = getSessionToken();
  return api.get(`odata/routecard`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
