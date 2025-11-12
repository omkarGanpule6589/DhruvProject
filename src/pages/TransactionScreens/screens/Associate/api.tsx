import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getAssociateRouteCad(params) {
  const accessToken = getSessionToken();
  return api.post("svc/AssociateService/GridAssociate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function PostAssociate(params) {
  const accessToken = getSessionToken();
  return api.post("svc/AssociateService/Associate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and (ChildCount gt 0 or qty eq 0) and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
