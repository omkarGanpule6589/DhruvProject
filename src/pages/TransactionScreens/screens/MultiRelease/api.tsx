import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getHoldCheck(params) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/ReleaseMultipleService/ReleaseMultipleValidate",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function PostMultirealse(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ReleaseMultipleService/ReleaseMultiple", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status eq 3 and Status ne 2 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
